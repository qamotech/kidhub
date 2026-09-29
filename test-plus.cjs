const { chromium } = require('playwright');const assert=require('assert');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});const page=await b.newPage({viewport:{width:1280,height:900}});const errors=[];
page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.dismiss());
await page.goto(process.env.STUDIO_URL||'file:///'+process.cwd().split(require('path').sep).join('/')+'/studio.html');
const k=await page.evaluate(()=>window.KidHubPlus);assert.deepEqual([k.tools,k.features,k.improvements,k.badges],[80,80,80,10]);
assert.equal(await page.locator('#badges .badge').count(),18);
await page.locator('[data-id="tools"]').click();await page.locator('#kpGrid .kp-tile').first().waitFor();
assert.equal(await page.locator('#kpGrid .kp-tile').count(),80);
const ids=await page.$$eval('#kpGrid .kp-tile',a=>a.map(x=>x.dataset.t));
for(const id of ids){await page.evaluate(i=>KidHubPlus.openTool(i),id);const body=page.locator('#kpTool [data-body]');const t=await body.innerText();assert(t.trim().length>0&&!t.includes('snag'),'tool '+id);
 const btn=body.locator('button:not([disabled])').first();if(await btn.count())await btn.click({timeout:2000}).catch(()=>{});}
await page.fill('#kpSearch','clock');await page.waitForTimeout(250);assert((await page.locator('#kpGrid .kp-tile').count())<80);
for(const a of ['coding','space','dino','puzzle','farm','color','spelling','clock','music-maker','storybook']){await page.evaluate(i=>app.show(i),a);const t=await page.locator(`#s-${a} .panel`).innerText();assert(!t.includes('Loading activity')&&!t.includes('could not load'),a);}
await page.evaluate(()=>app.show('hub'));
assert(await page.evaluate(()=>state.badges.includes('kp_first')&&state.badges.includes('kp_forty')));
await page.setViewportSize({width:390,height:844});await page.evaluate(()=>app.show('tools'));assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile overflow');
await page.screenshot({path:'toolbox-mobile.png'});
assert.deepEqual(errors,[]);console.log('PASS plus: 80 tools opened, 10 activities built, badges, mobile, no errors');await b.close()})().catch(e=>{console.error(e);process.exit(1)});
