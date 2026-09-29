const { chromium } = require('playwright');const assert=require('assert');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});const page=await b.newPage({viewport:{width:1440,height:1000}});const errors=[];
page.on('pageerror',e=>errors.push(e.message));
await page.goto(process.env.STUDIO_URL||'file:///'+process.cwd().split(require('path').sep).join('/')+'/studio.html');
await page.evaluate(()=>app.show('draw'));await page.locator('#canvas').waitFor();
assert.equal(await page.evaluate(()=>paintPro.tools),48);
const snap=()=>page.evaluate(()=>document.getElementById('canvas').toDataURL());
const box=async()=>{await page.locator('#canvas').scrollIntoViewIfNeeded();return page.locator('#canvas').boundingBox()};
const drag=async(x1,y1,x2,y2,opt={})=>{const r=await box();await page.mouse.move(r.x+x1,r.y+y1);await page.mouse.down(opt);await page.mouse.move(r.x+(x1+x2)/2,r.y+(y1+y2)/2+15,{steps:6});await page.mouse.move(r.x+x2,r.y+y2,{steps:6});await page.mouse.up(opt)};
const click=async(x1,y1,opt={})=>{const r=await box();await page.mouse.click(r.x+x1,r.y+y1,opt)};
const ids=await page.evaluate(()=>paintPro.list());const acts=['selall','crop','del','copy','paste','rotR','rotL','flipV','skew'];const changed=[];
for(const id of ids){if(acts.includes(id))continue;await page.evaluate(()=>{drawing.clear();paintPro.release()});await page.evaluate(i=>{drawing.setColor('#ff0000');if(i==='smudge'){const x=canvas.getContext('2d');x.fillStyle='#00f';x.fillRect(90,90,60,60)}paintPro.setTool(i)},id);const before=await snap();
 if(id==='curve'){await drag(100,100,400,120);await drag(250,110,250,300);await drag(300,110,300,20)}
 else if(id==='polygon'){await click(100,100);await click(300,120);await click(250,300);await click(100,100)}
 else if(id==='bucket'){await click(50,50)}
 else if(id==='dropper'){await page.evaluate(()=>{const x=canvas.getContext('2d');x.fillStyle='#123456';x.fillRect(0,0,50,50)});await click(10,10);assert.equal(await page.evaluate(()=>drawing.getColor()),'#123456');continue}
 else if(id==='replace'){await page.evaluate(()=>{drawing.setColor('#ffffff');paintPro.setC2('#00ff00')});await drag(100,100,300,200)}
 else if(id==='rsel'||id==='fsel'){await page.evaluate(()=>{const x=canvas.getContext('2d');x.fillStyle='#f00';x.fillRect(120,120,80,80)});const b0=await snap();await drag(100,100,220,220);assert(await page.evaluate(()=>!!paintPro.sel),id+' selection');await drag(150,150,400,300);assert.notEqual(await snap(),b0,id+' move');continue}
 else{await page.evaluate(()=>drawing.setColor('#ff0000'));await drag(100,100,300,250)}
 if(await snap()===before)changed.push(id)}
assert.deepEqual(changed,[],'tools that did not draw: '+changed);
// flood fill correctness + undo
await page.evaluate(()=>{drawing.clear();paintPro.setTool('bucket');drawing.setColor('#00aa00')});const pre=await snap();await click(450,280);
assert.deepEqual(await page.evaluate(()=>Array.from(canvas.getContext('2d').getImageData(450,280,1,1).data)),[0,170,0,255]);
await page.evaluate(()=>drawing.undo());assert.equal(await snap(),pre);
// actions
await page.evaluate(()=>{drawing.clear();const x=canvas.getContext('2d');x.fillStyle='#00f';x.fillRect(10,10,200,100)});
for(const a of acts){const before=await snap();await page.evaluate(n=>{if(n==='skew'){paintPro.act('skew');document.getElementById('ppSH').value='20';document.getElementById('ppSkewGo').click()}else if(n==='paste'){paintPro.act('selall');paintPro.act('copy');paintPro.act('paste')}else if(n==='crop'||n==='del'){paintPro.release();paintPro.setTool('rsel')}else paintPro.act(n)},a);
 if(a==='crop'||a==='del'){await drag(5,5,150,80);await page.evaluate(n=>paintPro.act(n),a)}
 if(!['selall','copy','paste'].includes(a))assert.notEqual(await snap(),before,'action '+a);await page.evaluate(()=>paintPro.release())}
for(const t of ['invert','gray','sepia','flipH']){const before=await snap();await page.evaluate(n=>paintPro.act(n),t);assert.notEqual(await snap(),before,t)}
// color editor
await page.locator('#ppEditBtn').click();await page.fill('#ppHex','#abcdef');await page.locator('#ppSet1').click();assert.equal(await page.evaluate(()=>drawing.getColor()),'#abcdef');
await page.selectOption('#ppZoom','2');await page.selectOption('#ppZoom','1');
await page.evaluate(()=>{paintPro.setTool('pencil')});await page.locator('[data-dtool="brush"]').click();assert.equal(await page.locator('.pp-tool.on').count(),0,'native tool releases pro');
await page.screenshot({path:'paint-desktop.png'});
await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile overflow');
assert.deepEqual(errors,[]);console.log('PASS paint: 48 tools draw/act, flood fill+undo, color editor, native handoff, mobile, no errors');await b.close()})().catch(e=>{console.error(e);process.exit(1)});
