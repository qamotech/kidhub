const { chromium } = require('playwright');const assert=require('assert');
const URL=process.env.POPSTORM_URL||'file:///'+require('path').resolve('games/popstorm.html').split(require('path').sep).join('/'),OUT=require('path').resolve(require('os').tmpdir())+'/';
(async()=>{const b=await chromium.launch({channel:'msedge'});const p=await b.newPage({viewport:{width:1280,height:800}});const errors=[];p.on('pageerror',e=>errors.push(e.message+' @'+(e.stack||'').split('\n')[1]));
await p.goto(URL);await p.waitForTimeout(300);
const drain=async(ms=400)=>{for(let i=0;i<60;i++){const st=await p.evaluate(()=>PopStorm.state);if(st==='level'){await p.keyboard.press(String(1+i%3));await p.waitForTimeout(60)}else if(st==='chest'){await p.click('#btnChest');await p.waitForTimeout(1400);await p.click('#btnChest');await p.waitForTimeout(60)}else break}};
const settle=async()=>{for(let i=0;i<40;i++){await drain();if(await p.evaluate(()=>PopStorm.run.pendingChests===0&&PopStorm.state==='play'))return;await p.waitForTimeout(150)}};
const play=async(ms)=>{const t0=Date.now();while(Date.now()-t0<ms){await drain();const k=['w','d','s','a'][Math.floor((Date.now()-t0)/600)%4];await p.keyboard.down(k);await p.waitForTimeout(150);await p.keyboard.up(k)}};
// 1. pacing: 30s natural play
await p.click('#btnPlay');await p.click('#btnGo');await play(30000);
const early=await p.evaluate(()=>({lvl:PopStorm.run.level,kills:PopStorm.run.kills,t:Math.round(PopStorm.run.time)}));console.log('30s pacing',JSON.stringify(early));assert(early.lvl>=3,'early levels feel fast');
// 2. every weapon at max + evolve all via chests
await drain();if(await p.evaluate(()=>PopStorm.state==='over'))await p.evaluate(()=>PopStorm.start({}));await drain();
await p.evaluate(()=>{PopStorm.debug.god();const R=PopStorm.run,W=PopStorm.content.WEAPONS;R.weapons.length=0;R.passives.length=0;
 const pairs=[['star','clover'],['bubble','soap'],['rainbow','prism'],['bee','honey'],['snow','mittens'],['thunder','battery']];
 pairs.forEach(([w,pa])=>{R.weapons.push({id:w,lvl:5,cd:0,uid:9000+R.weapons.length,acc:0,a:0});R.passives.push({id:pa,lvl:1})});PopStorm.debug.setTime(200)});
for(let i=0;i<6;i++){await p.evaluate(()=>PopStorm.debug.chest());await play(900);await settle()}
const evo=await p.evaluate(()=>PopStorm.run.weapons.map(w=>w.id));console.log('evolved',evo.join());assert.equal(evo.length,6);
const dbg=await p.evaluate(()=>({w:PopStorm.run.weapons.map(w=>w.id+':'+w.lvl),p:PopStorm.run.passives.map(p=>p.id+':'+p.lvl),pc:PopStorm.run.pendingChests,st:PopStorm.state,ev:PopStorm.run.evolutions}));assert(await p.evaluate(()=>PopStorm.run.weapons.every(w=>PopStorm.content.WEAPONS[w.id].evolved)),'all 6 evolved '+JSON.stringify(dbg));
// paint + kite evolutions
await p.evaluate(()=>{const R=PopStorm.run;R.weapons.splice(0,2,{id:'paint',lvl:5,cd:0,uid:9100,acc:0,a:0},{id:'kite',lvl:5,cd:0,uid:9101,acc:0,a:0});R.passives.splice(0,2,{id:'brush',lvl:1},{id:'windsock',lvl:1})});
for(let i=0;i<2;i++){await p.evaluate(()=>PopStorm.debug.chest());await play(900);await settle()}
assert(await p.evaluate(()=>PopStorm.run.weapons.some(w=>w.id==='mural')&&PopStorm.run.weapons.some(w=>w.id==='comet')),'paint/kite evolved');
await p.screenshot({path:OUT+'.ps-evolved.png'});
// 3. events + pets
for(const ev of ['fountain','rush','sleepy','comet','rainbow']){await p.evaluate(e=>PopStorm.debug.event(e),ev);await play(700)}
console.log('events ok, boxes',await p.evaluate(()=>PopStorm.extras.boxes.length));
// 4. bosses to win
await p.evaluate(()=>PopStorm.debug.setTime(598));await play(4000);
assert.equal(await p.evaluate(()=>PopStorm.run.boss&&PopStorm.run.boss.type),'megaMope');
await p.screenshot({path:OUT+'.ps-mega.png'});
await p.evaluate(()=>{const b=PopStorm.run.boss;b.hp=1});await play(2500);
await p.waitForTimeout(2200);assert.equal(await p.evaluate(()=>PopStorm.state),'over','won -> over');
assert(await p.evaluate(()=>PopStorm.run.won));await p.screenshot({path:OUT+'.ps-win.png'});
await p.click('#btnEndless');await play(1500);assert(['play','level','chest'].includes(await p.evaluate(()=>PopStorm.state)),'endless continues');
await p.evaluate(()=>PopStorm.debug.kill());await p.waitForTimeout(1200);
// 5. unlocks, boss rush, daily
const sv=await p.evaluate(()=>({wins:PopStorm.save.stats.wins,heroes:PopStorm.save.heroes,biomes:PopStorm.save.biomes,ach:Object.keys(PopStorm.save.ach).length,coins:PopStorm.save.coins}));console.log('save',JSON.stringify(sv));
assert(sv.heroes.includes('frost')&&sv.biomes.includes('neon'),'win unlocks');
await p.click('#btnMenu');await p.click('#btnRush');await p.waitForTimeout(200);await drain();assert(await p.evaluate(()=>PopStorm.run.bossRush&&PopStorm.run.level>=8));await play(1500);await p.evaluate(()=>PopStorm.debug.kill());await p.waitForTimeout(1200);
await p.click('#btnMenu');await p.click('#btnDaily');await p.click('#btnDailyGo');await play(3000);assert(await p.evaluate(()=>PopStorm.run.daily&&!!PopStorm.run.modifier));await p.evaluate(()=>PopStorm.debug.kill());await p.waitForTimeout(1200);
// 6. every hero runs clean
for(const h of Object.keys(await p.evaluate(()=>PopStorm.content.HEROES))){await p.evaluate(h=>PopStorm.start({hero:h,biome:'lava'}),h);await play(2500);await p.evaluate(()=>PopStorm.debug.kill());await p.waitForTimeout(1100)}
// 7. menus
await p.click('#btnMenu');for(const [btn] of [['#btnShop'],['#btnAch'],['#btnQuests'],['#btnSettings'],['#btnHow']]){await p.click(btn);await p.waitForTimeout(150);await p.keyboard.press('Escape');await p.waitForTimeout(150)}
await p.click('#btnShop');await p.locator('[data-shop="might"]').click();await p.keyboard.press('Escape');
await p.click('#btnAch');await p.click('[data-achtab="book"]');await p.screenshot({path:OUT+'.ps-book.png'});await p.keyboard.press('Escape');
await p.click('#btnPlay');await p.waitForTimeout(200);await p.screenshot({path:OUT+'.ps-select.png'});
// 8. mobile touch play
await p.setViewportSize({width:390,height:844});await p.click('#btnGo');const box={x:195,y:600};await p.mouse.move(box.x,box.y);await p.mouse.down();await p.mouse.move(box.x+60,box.y-20,{steps:5});await p.waitForTimeout(1500);await p.mouse.up();
assert(await p.evaluate(()=>Math.abs(PopStorm.player.x)>20),'touch moves player');await drain();await p.screenshot({path:OUT+'.ps-mobile.png'});
console.log('errors',errors.length,JSON.stringify(errors.slice(0,5)));assert.deepEqual(errors,[]);console.log('PASS PopStorm full playtest');await b.close()})().catch(e=>{console.error(e);process.exit(1)});
