const { chromium } = require('playwright');const assert=require('assert');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});const page=await b.newPage({viewport:{width:1280,height:800}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const url=process.env.STUDIO_URL||(process.env.BASE_URL&&process.env.BASE_URL+'/studio.html')||'file:///'+process.cwd().split(require('path').sep).join('/')+'/studio.html';
await page.goto(url);
const info=await page.evaluate(()=>({edits:kidSeason.edits.length,n:kidSeason.seasons.length,keys:kidSeason.seasons.map(s=>[s.id,s.stickers.length,s.memory.length,s.catch.length,s.prompts.length,s.swatches.length,s.jokes.length])}));
assert.equal(info.edits,40,'40 seasonal edit slots');assert(info.n>=12,'a full year of seasons');
info.keys.forEach(([id,...n])=>assert(n[0]>=8&&n[1]>=12&&n[2]>=5&&n[3]>=5&&n[4]>=6&&n[5]>=3,'complete season data: '+id));
const order=await page.evaluate(()=>['2026-10-10','2026-10-31','2026-11-15','2026-12-10','2026-12-30','2027-01-20','2027-02-10','2027-03-17','2027-04-10','2027-05-10','2027-06-10','2027-07-04','2027-08-10','2027-09-10'].map(d=>{const [y,m,dd]=d.split('-').map(Number);return kidSeason.forDate(new Date(y,m-1,dd)).id}));
assert.deepEqual(order,['halloween','halloween','thanksgiving','christmas','newyear','newyear','valentine','stpatrick','spring','garden','summer','fireworks','beach','school'],'calendar order: '+order);
const tg=await page.evaluate(()=>{const s=kidSeason.seasons.find(x=>x.id==='thanksgiving');return [s.day(2026).getDate(),s.day(2027).getDate()]});assert.deepEqual(tg,[26,25],'Thanksgiving = 4th Thursday');
for(const id of ['halloween','thanksgiving','christmas']){
 await page.evaluate(id=>kidSeason.set(id),id);
 const st=await page.evaluate(()=>({season:document.documentElement.dataset.season,logo:document.querySelector('.brand .logo').textContent,banner:document.querySelectorAll('.sz-banner').length,garland:document.querySelectorAll('.sz-garland').length,fall:document.querySelectorAll('.sz-fall').length,hunt:document.querySelectorAll('.sz-hunt').length,greet:document.getElementById('greeting').textContent,picker:document.querySelectorAll('#sz-setting button').length}));
 const s=await page.evaluate(id=>{const x=kidSeason.seasons.find(s=>s.id===id);return {logo:x.logo,greet:x.greet}},id);
 assert.equal(st.season,id);assert.equal(st.logo,s.logo);assert.equal(st.banner,1);assert.equal(st.garland,1);assert.equal(st.fall,14);assert(st.hunt<=1);assert(s.greet.includes(st.greet),'seasonal greeting');assert(st.picker>=14,'season picker');
}
await page.evaluate(()=>kidSeason.set('halloween'));
// greeting survives a hub re-render
await page.evaluate(()=>ui.hub());await page.waitForTimeout(50);assert(await page.evaluate(()=>kidSeason.seasons[0].greet.includes(document.getElementById('greeting').textContent)),'greeting persists');
// hidden hunt awards stars
const before=await page.evaluate(()=>state.stars);await page.locator('.sz-hunt').click({force:true});assert.equal(await page.evaluate(()=>state.stars),before+1,'hunt awards a star');
assert.match(await page.locator('.sz-progress').textContent(),/1\/5/);
// art: seasonal stickers + palette
await page.evaluate(()=>app.show('draw'));await page.selectOption('#artStickers','season');assert.equal(await page.$eval('#stamp',s=>s.options[0].value),'🎃');
await page.selectOption('#artPalette','season');assert.equal(await page.locator('#swatches .swatch').count(),6);
// catch + memory collections
await page.evaluate(()=>app.show('memory'));await page.selectOption('#memoryTheme','season');await page.evaluate(()=>memoryGame.start());
const faces=await page.evaluate(()=>document.getElementById('memoryBoard').innerHTML);assert(/🎃|👻|🦇|🕷️/.test(faces),'memory uses Halloween cards');
// off restores the original look
await page.evaluate(()=>kidSeason.set('off'));assert.equal(await page.evaluate(()=>document.documentElement.dataset.season),undefined);assert.equal(await page.locator('.sz-banner').count(),0);assert.equal(await page.locator('.brand .logo').textContent(),'🚀');
await page.evaluate(()=>kidSeason.set('auto'));
await page.setViewportSize({width:390,height:844});await page.evaluate(()=>app.show('hub'));assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile overflow');
await page.evaluate(()=>kidSeason.set('halloween'));await page.screenshot({path:'season-halloween-mobile.png'});
await page.setViewportSize({width:1280,height:800});await page.screenshot({path:'season-halloween.png'});
await page.evaluate(()=>kidSeason.set('auto'));
assert.deepEqual(errors,[]);console.log('PASS seasons: 40 edit slots × 12 seasons, Halloween→Thanksgiving→Christmas calendar, hunt, art, memory, off/auto, mobile');await b.close()})().catch(e=>{console.error(e);process.exit(1)});
