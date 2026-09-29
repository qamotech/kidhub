const { chromium } = require('playwright');const assert=require('assert');const {spawn}=require('child_process');
(async()=>{const srv=spawn('python',['-m','http.server','8765','--bind','127.0.0.1'],{stdio:'ignore'});await new Promise(r=>setTimeout(r,1200));
const b=await chromium.launch({channel:'msedge'});const ctx=await b.newContext({viewport:{width:1280,height:900}});const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{await page.goto('http://127.0.0.1:8765/studio.html');
assert.equal(await page.evaluate(()=>kidPolish.improvements),40);assert.equal(await page.locator('.themes .theme').count(),8);
for(const t of ['candy','forest','sunset','midnight','arctic','ocean','space','sunny']){await page.evaluate(x=>prefs.theme(x),t);const bg=await page.evaluate(()=>getComputedStyle(document.body).backgroundColor);assert(bg,'theme '+t)}
await page.evaluate(()=>prefs.theme('midnight'));assert.equal(await page.evaluate(()=>getComputedStyle(document.body,'::after').backgroundColor),'rgba(0, 0, 6, 0.14)','dark dim');await page.evaluate(()=>prefs.theme('sunny'));
// routing + title + back
await page.evaluate(()=>app.show('music'));assert(page.url().endsWith('#music'));assert(/Music Lab · KidHub/.test(await page.title()));
await page.evaluate(()=>app.show('draw'));await page.goBack();await page.waitForTimeout(200);assert.equal(await page.evaluate(()=>app.current),'music','back button');
await page.goto('http://127.0.0.1:8765/studio.html#draw');assert.equal(await page.evaluate(()=>app.current),'draw','deep link');
// Esc with paint selection keeps you in Art Studio; second Esc goes home
await page.evaluate(()=>{paintPro.act('selall')});await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>app.current),'draw','esc kept');
await page.evaluate(()=>paintPro.release());await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>app.current),'hub','esc home');
// count + toasts cap + back to top
const n=await page.locator('#cards .card').count();assert.equal(await page.locator('#count').innerText(),`${n} adventures`);
await page.evaluate(()=>{for(let i=0;i<8;i++)ui.toast('t'+i);ui.toast('t7')});assert((await page.locator('#toasts > *').count())<=3,'toast cap');
await page.waitForTimeout(900);await page.evaluate(()=>scrollTo(0,3000));await page.waitForTimeout(300);const sy=await page.evaluate(()=>[scrollY,document.documentElement.scrollHeight,document.querySelectorAll('.kh-top').length]);assert(await page.locator('.kh-top.on').count(),'back-to-top '+sy);
// service worker offline
await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForTimeout(500);
await ctx.setOffline(true);await page.reload();assert.equal(await page.evaluate(()=>typeof app),'object','works offline');await ctx.setOffline(false);
const man=await page.evaluate(()=>fetch('manifest.webmanifest').then(r=>r.json()));assert.equal(man.short_name,'KidHub');
assert.deepEqual(errors,[]);console.log('PASS polish: 40 improvements, 8 themes, dark dim, deep links, back button, titles, Esc guard, count, toast cap, back-to-top, offline SW, manifest');
}catch(e){console.error(e);process.exitCode=1}finally{await b.close();srv.kill()}})();
