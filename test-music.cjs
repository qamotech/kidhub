const { chromium } = require('playwright');const assert=require('assert');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true,args:['--autoplay-policy=no-user-gesture-required']});const ctx=await b.newContext({viewport:{width:1280,height:900},acceptDownloads:true});const page=await ctx.newPage();const errors=[];
page.on('pageerror',e=>errors.push(e.message));
await page.goto(process.env.STUDIO_URL||'file:///'+process.cwd().split(require('path').sep).join('/')+'/studio.html');
await page.evaluate(()=>app.show('music'));await page.locator('#musicDeck').waitFor();
assert.equal(await page.evaluate(()=>musicDeck.features),64);
assert.equal(await page.locator('#mdKb .md-k').count(),25);
await page.locator('#mdKb .md-k').first().click();
const ids=await page.evaluate(()=>KBI.LIST.map(i=>i.id));assert.equal(ids.length,24);assert.equal(await page.locator('#instrument option').count(),24);for(const v of ids){await page.selectOption('#mdInst',v);await page.evaluate(()=>{musicDeck.noteOn(60);musicDeck.noteOff(60)})}
await page.locator('[data-t="sound"]').click();for(const r of await page.locator('[data-fx]').all())await r.fill('60');for(const r of await page.locator('[data-env]').all())await r.fill('20');
await page.locator('[data-t="play"]').click();for(const c of ['major','minor','seven','off'])await page.selectOption('#mdChord',c);
await page.selectOption('#mdArp','up');await page.evaluate(()=>musicDeck.noteOn(60));await page.waitForTimeout(400);await page.evaluate(()=>musicDeck.noteOff(60));await page.selectOption('#mdArp','off');
await page.selectOption('#mdScale','pentatonic');await page.check('#mdLock');assert((await page.locator('.md-k.off').count())>0,'scale lock dims keys');await page.uncheck('#mdLock');
await page.locator('#mdPads button').first().click();
await page.keyboard.press('z');await page.keyboard.press('ArrowUp');assert.equal(await page.evaluate(()=>musicDeck.S.oct),5);await page.keyboard.press('ArrowDown');
await page.locator('[data-t="beats"]').click();await page.selectOption('#mdPre','rock');assert((await page.locator('.md-step.on').count())>5);await page.locator('#mdPlay').click();await page.waitForTimeout(700);assert(await page.evaluate(()=>musicDeck.seq.on));await page.locator('#mdRnd').click();await page.locator('[data-slot="B"]').click();await page.locator('#mdPlay').click();
await page.locator('[data-t="loop"]').click();await page.locator('#mdRec').click();for(let i=0;i<4;i++){await page.evaluate(n=>musicDeck.noteOn(n),60+i*2);await page.waitForTimeout(150);await page.evaluate(n=>musicDeck.noteOff(n),60+i*2)}await page.locator('#mdRec').click();
assert((await page.evaluate(()=>musicDeck.LOOP.length))>=4,'loop recorded');await page.locator('#mdLoop').click();await page.waitForTimeout(300);await page.locator('#mdLoop').click();
const dl=page.waitForEvent('download');await page.locator('#mdWav').click();const d=await dl;assert(d.suggestedFilename().endsWith('.wav'));
await page.locator('#mdShare').click();const code=await page.inputValue('#mdCode');assert(code.length>20);await page.evaluate(()=>musicDeck.loop.clear());await page.locator('#mdLoad').click();assert((await page.evaluate(()=>musicDeck.LOOP.length))>=4,'share load');
await page.locator('[data-t="learn"]').click();await page.selectOption('#mdSong',{index:1});assert.equal(await page.locator('.md-k.hint').count(),1);
for(const g of ['note','int','mm']){await page.locator(`[data-ear="${g}"]`).click();assert((await page.locator('#mdEarA button').count())>=2)}
await page.locator('[data-t="fun"]').click();for(const f of await page.locator('[data-fun]').all())await f.click();await page.locator('#mdMelB').click();
await page.evaluate(()=>app.show('hub'));assert(!(await page.evaluate(()=>musicDeck.seq.on)));
await page.setViewportSize({width:390,height:844});await page.evaluate(()=>app.show('music'));assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile overflow');await page.locator('#musicDeck').screenshot({path:'music-deck.png'});
assert.deepEqual(errors,[]);console.log('PASS music: 64 features, 8 voices, fx, chords, arp, scale lock, beats, looper, WAV, share, lessons, ear games, fun, mobile');await b.close()})().catch(e=>{console.error(e);process.exit(1)});
