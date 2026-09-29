const { chromium } = require('playwright');const assert=require('assert');
(async()=>{const b=await chromium.launch({channel:'msedge',args:['--autoplay-policy=no-user-gesture-required']});const page=await b.newPage({viewport:{width:1280,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('file:///'+process.cwd().split(require('path').sep).join('/')+'/studio.html');await page.evaluate(()=>{localStorage.clear();app.show('music')});await page.locator('#musicDeck').waitFor();
await page.locator('#musicDeck [data-t="beats"]').click();
// messy beat -> auto-fix
await page.locator('#mdClr').click();for(const [r,s] of [[0,3],[0,5],[2,1],[2,6],[2,11],[4,2],[3,7]])await page.locator(`.md-step[data-r="${r}"][data-s="${s}"]`).click();
await page.locator('#mdFix').click();
const P=await page.evaluate(()=>musicDeck.PAT[musicDeck.S.slot]);assert.equal(P[0][0],1,'kick on 1');assert(P[1][4]&&P[1][12],'backbeat');assert.deepEqual(P[2].map((v,s)=>v?s:-1).filter(s=>s>=0),[0,2,4,6,8,10,12,14],'steady 8th hats');assert.equal(P[4].slice(0,12).some(Boolean),false,'toms only in fills');assert.equal(P[3][7],0,'clap off-backbeat removed');
// undo restores
await page.locator('#mdUndoB').click();assert.equal(await page.evaluate(()=>musicDeck.PAT[musicDeck.S.slot][0][0]),0,'undo');await page.locator('#mdFix').click();
// melody: off-key notes -> cohesive
await page.evaluate(()=>{const L=musicDeck.MEL[musicDeck.S.slot];[61,0,75,0,66,0,80,0,63,0,58,0,70,0,68,0].forEach((m,i)=>L[i]=m||-1)});await page.locator('#mdCoh').click();
const L=await page.evaluate(()=>musicDeck.MEL[musicDeck.S.slot].filter(v=>v>=0));const maj=[0,2,4,5,7,9,11];assert(L.every(m=>maj.includes(m%12)),'all in C major: '+L);
for(let i=1;i<L.length;i++)assert(Math.abs(L[i]-L[i-1])<=7,'no big leaps');assert.equal(L.at(-1)%12,0,'ends on C');
await page.locator('#mdIdea').click();assert((await page.evaluate(()=>musicDeck.MEL[musicDeck.S.slot].filter(v=>v>=0).length))>=4);
// genre + fill + remix + auto bass + kit + automix
for(const g of ['pop','hiphop','rock','disco','reggaeton','lofi','march']){await page.selectOption('#mdGenre',g);await page.locator('#mdSmart').click();assert.equal(await page.evaluate(()=>musicDeck.PAT[musicDeck.S.slot][0][0]),1)}
await page.locator('#mdFill').click();await page.locator('#mdMut').click();await page.check('#mdBass');await page.check('#mdHum');
await page.locator('#musicDeck summary:has-text("Drum kit")').click();await page.selectOption('[data-kit="5"]','shaker');await page.locator('#mdAutoMix').click();
// live drum recording
await page.locator('#mdClr').click();await page.locator('#mdRecD').click();await page.waitForTimeout(400);for(let i=0;i<3;i++){await page.keyboard.press('1');await page.waitForTimeout(170)}
assert((await page.evaluate(()=>musicDeck.PAT[musicDeck.seq.cur][0].reduce((a,b)=>a+b,0)))>=1,'recorded kicks');await page.locator('#mdRecD').click();await page.locator('#mdPlay').click();
const coach=await page.locator('#mdCoach').innerText();assert(/Beat Coach/.test(coach));
// keyboard range + octaves + autotune
await page.locator('#musicDeck [data-t="play"]').click();await page.selectOption('#mdRange','4');assert.equal(await page.locator('#mdKb .md-k').count(),49);
for(let i=0;i<5;i++)await page.locator('#mdOctD').click();assert.equal(await page.evaluate(()=>musicDeck.S.oct),0);
await page.check('#mdAuto');await page.evaluate(()=>{musicDeck.noteOn(61);musicDeck.noteOff(61)});assert(/C4|D4/.test(await page.locator('#mdPitch').innerText()),'autotuned C#→C/D');
await page.evaluate(()=>app.show('hub'));assert.deepEqual(errors,[]);console.log('PASS beats: auto-fix, undo, cohesive melody, ideas, 7 genres, fill/remix/bass/kit/mix, live drum recording, coach, 4-octave keys, octave 0, auto-tune');await b.close()})().catch(e=>{console.error(e);process.exit(1)});
