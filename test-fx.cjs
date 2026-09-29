const { chromium } = require('playwright');const assert=require('assert');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});const page=await b.newPage({viewport:{width:1280,height:800}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(process.env.STUDIO_URL||'file:///'+process.cwd().split(require('path').sep).join('/')+'/studio.html');
assert.equal(await page.locator('.px .px-scene').count(),4);assert((await page.evaluate(()=>kidFx.layers))>=40);
const top=await page.evaluate(()=>{const p=document.querySelector('.px');return scrollY+p.getBoundingClientRect().top});
const shots=[];for(const f of [.12,.37,.62,.87]){await page.evaluate(([t,f])=>{const p=document.querySelector('.px');scrollTo(0,t+f*(p.offsetHeight-innerHeight))},[top,f]);await page.waitForTimeout(250);const op=await page.$$eval('.px-scene',s=>s.map(x=>+getComputedStyle(x).opacity));shots.push(op.indexOf(Math.max(...op)));if(f===.37)await page.screenshot({path:'parallax.png'})}
assert.deepEqual(shots,[0,1,2,3],'scenes advance with scroll: '+shots);
assert((await page.locator('h2:has-text("🧭")').count())>=1,'emojified headings');
await page.emulateMedia({reducedMotion:'reduce'});await page.reload();assert.equal(await page.$$eval('.px-scene',s=>s.every(x=>getComputedStyle(x).opacity==='1')),true,'reduced motion shows static scenes');
await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile overflow');
assert.deepEqual(errors,[]);console.log('PASS fx: 4-scene parallax advances with scroll, emojis, reduced-motion fallback, mobile');await b.close()})().catch(e=>{console.error(e);process.exit(1)});
