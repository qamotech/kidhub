const { chromium } = require('playwright');const assert=require('assert');
(async()=>{const b=await chromium.launch({channel:'msedge'});const page=await b.newPage({viewport:{width:1280,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const posts=[];await page.route('https://hooks.example.test/**',r=>{posts.push(r.request().postDataJSON());r.fulfill({status:200,headers:{'access-control-allow-origin':'*'},body:'ok'})});
await page.goto('file:///'+process.cwd().split(require('path').sep).join('/')+'/studio.html');
assert.equal(await page.locator('h1,h2,.brand,body').first().evaluate(()=>/kid ?hub[- ]?64/i.test(document.body.innerText)),false,'no KidHub 64 text');
// arcade
await page.locator('[data-id="arcade"]').click();assert.equal(await page.locator('#arGrid .ar-tile').count(),14);await page.fill('#arSearch','pong');assert.equal(await page.locator('#arGrid .ar-tile').count(),1);
assert.equal(await page.locator('#arGrid .ar-tile').first().getAttribute('href'),'games/neon-pong.html');await page.evaluate(()=>app.show('hub'));
// cloud: left side, opens, saves offline, sends via webhook
const bb=await page.locator('#cwBtn').boundingBox();assert(bb.x<60,'cloud on left');
await page.locator('#cwBtn').click({force:true});await page.locator('#cwPanel.open').waitFor();await page.fill('#cwMsg','hello');await page.locator('#cwSend').click();await page.waitForTimeout(200);
assert.equal(await page.evaluate(()=>kidCloud.state.outbox.at(-1).status),'saved');
await page.locator('#cwPanel [data-t="set"]').click();const q=await page.locator('#cwBody p').first().innerText();const [x,y]=q.match(/(\d+) × (\d+)/).slice(1).map(Number);await page.fill('#cwGate',String(x*y));await page.locator('#cwGo').click();
await page.fill('#cwUrl','https://hooks.example.test/kid');await page.locator('#cwSave').click();
await page.locator('#cwPanel [data-t="msg"]').click();await page.locator('#cwBody [data-q]').first().click();await page.locator('#cwSend').click();await page.waitForFunction(()=>kidCloud.state.outbox.at(-1).status==='sent');
assert.equal(posts.at(-1).app,'KidHub');assert.deepEqual(posts.at(-1).to,['Mom']);
await page.locator('#cwPanel [data-t="rem"]').click();await page.fill('#cwRT','Brush teeth');await page.fill('#cwRH','08:00');await page.locator('#cwRA').click();assert.equal(await page.evaluate(()=>kidCloud.state.reminders.length),1);
await page.keyboard.press('Escape');assert.equal(await page.locator('#cwPanel.open').count(),0);
// instruments on native piano
await page.evaluate(()=>app.show('music'));await page.selectOption('#instrument','guitar');await page.locator('[data-note="0"]').first().click().catch(()=>{});
await page.setViewportSize({width:390,height:844});await page.locator('#cwBtn').click({force:true});await page.waitForTimeout(450);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile overflow');await page.screenshot({path:'cloud-mobile.png'});
assert.deepEqual(errors,[]);console.log('PASS cloud+arcade: 14-game arcade menu, KidHub rename, left cloud widget, offline save, webhook send, reminders, mobile');await b.close()})().catch(e=>{console.error(e);process.exit(1)});
