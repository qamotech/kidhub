const { chromium } = require('playwright');const assert=require('assert');
(async()=>{const b=await chromium.launch({channel:'msedge'});const ctx=await b.newContext({viewport:{width:1280,height:900}});const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
const sent=[];let mode='ok';
await page.route('https://formsubmit.co/**',r=>{sent.push({url:r.request().url(),body:r.request().postDataJSON()});const body=mode==='ok'?{success:'true',message:'The form was submitted successfully.'}:{success:'false',message:"This form needs Activation. We've sent you an email containing an 'Activate Form' link."};r.fulfill({status:200,headers:{'access-control-allow-origin':'*','content-type':'application/json'},body:JSON.stringify(body)})});
await page.goto('file:///'+process.cwd().split(require('path').sep).join('/')+'/studio.html');
await page.locator('#cwBtn').click({force:true});await page.locator('#cwPanel.open').waitFor();
await page.locator('#cwPanel [data-t="set"]').click();const q=await page.locator('#cwBody p').first().innerText();const [x,y]=q.match(/(\d+) × (\d+)/).slice(1).map(Number);await page.fill('#cwGate',String(x*y));await page.locator('#cwGo').click();
await page.fill('[data-m="0"]','mom.test@example.com');await page.fill('[data-m="1"]','not-an-email');await page.locator('#cwSave').click();
assert.equal(await page.evaluate(()=>kidCloud.state.contacts[0].email),'mom.test@example.com');assert.equal(await page.evaluate(()=>kidCloud.state.contacts[1].email),'','invalid email rejected');
await page.fill('[data-m="1"]','dad.test@example.com');await page.locator('#cwSave').click();
// first send -> activation needed
mode='activate';await page.locator('#cwPanel [data-t="msg"]').click();await page.locator('#cwBody [data-c="c2"]').click();await page.fill('#cwMsg','Hello from the test');await page.locator('#cwSend').click();
await page.waitForFunction(()=>kidCloud.state.outbox.at(-1).status!=='sending');assert.equal(await page.evaluate(()=>kidCloud.state.outbox.at(-1).status),'activate');
// after activation -> retry sends
mode='ok';await page.locator('#cwPanel [data-t="out"]').click();await page.locator('#cwRetry').click();await page.waitForFunction(()=>kidCloud.state.outbox.at(-1).status==='sent');
const last=sent.at(-1);assert(/formsubmit\.co\/ajax\/(mom|dad)\.test%40example\.com/.test(last.url));assert.equal(last.body.message,'Hello from the test');assert(/KidHub message from/.test(last.body._subject));
assert.deepEqual([...new Set(sent.map(s=>decodeURIComponent(s.url.split('/ajax/')[1])))].sort(),['dad.test@example.com','mom.test@example.com'],'both parents emailed');
// SOS subject + offline queue
await page.locator('#cwPanel [data-t="msg"]').click();await page.locator('#cwSos').click();await page.locator('#cwSos').click();await page.waitForFunction(()=>kidCloud.state.outbox.at(-1).sos&&kidCloud.state.outbox.at(-1).status==='sent');assert(/URGENT/.test(sent.at(-1).body._subject));
await ctx.setOffline(true);await page.fill('#cwMsg','offline hi');await page.locator('#cwSend').click();await page.waitForFunction(()=>kidCloud.state.outbox.at(-1).status==='queued');await ctx.setOffline(false);
// no email configured -> saved locally, nothing sent
await page.evaluate(()=>{kidCloud.state.contacts.forEach(c=>c.email='')});const n=sent.length;await page.fill('#cwMsg','no email');await page.locator('#cwSend').click();await page.waitForFunction(()=>kidCloud.state.outbox.at(-1).status==='saved');assert.equal(sent.length,n);
assert.deepEqual(errors,[]);console.log('PASS cloud email: per-parent email via FormSubmit, activation status, retry, SOS subject, offline queue, invalid email rejected, nothing sent without setup');await b.close()})().catch(e=>{console.error(e);process.exit(1)});
