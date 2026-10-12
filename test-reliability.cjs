const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base=process.env.BASE_URL||'http://127.0.0.1:8765';
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try {
  const context=await browser.newContext({serviceWorkers:'block'}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/resources.html');
  await page.locator('[data-fav="core-draw"]').click();
  assert.equal(await page.evaluate(()=>document.activeElement.dataset.fav),'core-draw');
  await page.check('#app-favorites');await page.locator('[data-fav="core-draw"]').click();
  assert.equal(await page.evaluate(()=>document.activeElement.id),'app-favorites');
  await page.locator('[data-tab="planner"]').click();await page.locator('#plan-sample').click();
  await page.locator('[data-up="1"]').click();
  assert.equal(await page.evaluate(()=>document.activeElement.dataset.done),'0');
  await page.fill('#plan-notes','Preserve this session');
  const upload=body=>page.setInputFiles('#library-import',{name:'library.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(body))});
  await upload({version:1,library:{}});
  assert.match(await page.locator('#portal-status').innerText(),/Could not import/);
  assert.equal(await page.locator('#plan-notes').inputValue(),'Preserve this session');
  const backup={version:1,library:{favorites:[],recent:[],plan:[],notes:'Imported session'}};
  page.once('dialog',d=>d.dismiss());await upload(backup);
  assert.equal(await page.locator('#plan-notes').inputValue(),'Preserve this session');
  await page.evaluate(()=>{Storage.prototype.setItem=function(){throw new DOMException('Full','QuotaExceededError')}});
  page.once('dialog',d=>d.accept());await upload(backup);
  await page.waitForFunction(()=>document.querySelector('#portal-status').textContent.includes('session only'));
  assert.equal(await page.locator('#plan-notes').inputValue(),'Imported session');
  await context.close();
  // Synthetic destinations only: every outbound message is intercepted.
  const cloud=await browser.newContext({serviceWorkers:'block'}),cp=await cloud.newPage();
  let mails=0,hooks=0,activate=true;
  await cloud.route('https://formsubmit.co/**',r=>{mails++;return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(activate?{success:false,message:'Activate your email'}:{success:true})})});
  await cloud.route('https://hooks.example.test/**',r=>{hooks++;return r.fulfill({status:200,body:'ok'})});
  await cp.goto(base+'/studio.html');
  await cp.evaluate(()=>{kidCloud.state.contacts[0].email='parent@example.test';kidCloud.state.hook={url:'https://hooks.example.test/test',fmt:'json'}});
  await cp.evaluate(async()=>{window.testMessage={to:['c1'],content:'Synthetic test',from:'Tester',at:Date.now()};window.delivery1=await kidCloud.deliver(testMessage)});
  assert.equal(await cp.evaluate(()=>delivery1),'activate');assert.equal(mails,1);assert.equal(hooks,1);
  activate=false;
  assert.equal(await cp.evaluate(()=>kidCloud.deliver(testMessage)),'activate');assert.equal(mails,1,'an address waiting for activation is not emailed again (FormSubmit delivers it once activated)');assert.equal(hooks,1,'successful webhook must not be resent when email retries');
  assert.equal(await cp.evaluate(()=>kidCloud.deliver({to:['c1'],content:'After activation',from:'Tester',at:Date.now()})),'sent');assert.equal(mails,2);
  await cloud.setOffline(true);
  assert.equal(await cp.evaluate(()=>{kidCloud.state.contacts[0].email='';kidCloud.state.hook.url='';return kidCloud.deliver({to:['c1'],content:'Local',from:'Tester',at:Date.now()})}),'saved');
  await cloud.close();
  // One user click must request fullscreen once, including promise rejection.
  const games=JSON.parse(fs.readFileSync('games/games.json','utf8'));
  const gc=await browser.newContext({serviceWorkers:'block'}),gp=await gc.newPage();
  await gp.goto(base+'/games/'+games[0].slug+'.html');
  await gp.evaluate(()=>{window.fsCalls=0;document.documentElement.requestFullscreen=()=>{fsCalls++;return Promise.reject(Error('Test denial'))}});
  await gp.locator('#kh-fs').click();assert.equal(await gp.evaluate(()=>fsCalls),1);await gc.close();
  // A first visit to the dashboard installs the complete shell, with no Studio visit.
  const offline=await browser.newContext(),op=await offline.newPage();
  await op.goto(base+'/index.html');
  await op.evaluate(()=>navigator.serviceWorker.ready);
  await op.waitForFunction(()=>!!navigator.serviceWorker.controller);
  const cacheKeys=await op.evaluate(()=>caches.keys());assert(cacheKeys.some(k=>k.startsWith('kidhub-')));
  await offline.setOffline(true);
  let response=await op.goto(base+'/resources.html?offline-check=1');assert.equal(response.status(),200);
  assert.equal(await op.locator('#app-grid .kh-card').count(),100+games.length);
  response=await op.goto(base+'/studio.html');assert.equal(response.status(),200);await op.locator('[data-id="tools"]').waitFor();
  response=await op.goto(base+'/games/not-cached.html');assert.equal(response.status(),503);
  assert.match(await op.locator('h1').innerText(),/not saved offline/);
  await offline.close();assert.deepEqual(errors,[]);
  console.log('PASS reliability: keyboard focus, malformed/cancelled/quota-limited imports, intercepted delivery retry, offline local save, single fullscreen request, dashboard-first offline install, query fallback and uncached-page guidance');
 } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
