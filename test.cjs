const { chromium } = require('playwright');
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync('index.html','utf8');
for(const m of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(m[1]);
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file:///'+process.cwd().replace(/\\/g,'/')+'/index.html');
 await page.locator('[onclick="app.show(\'draw\')"]').first().click();
 await page.locator('#canvas').waitFor({state:'visible'});
 const snap=()=>page.locator('#canvas').evaluate(c=>c.toDataURL());
 async function stroke(tool='brush'){await page.locator(`[data-dtool="${tool}"]`).click();await page.locator('#canvas').scrollIntoViewIfNeeded();const r=await page.locator('#canvas').boundingBox();await page.mouse.move(r.x+100,r.y+100);await page.mouse.down();await page.mouse.move(r.x+230,r.y+200,{steps:12});await page.mouse.up();}
 const initial=await snap();await page.locator('#artColor').fill('#ff0000');await stroke();assert.notEqual(await snap(),initial);
 await page.evaluate(()=>drawing.undo());await page.waitForTimeout(120);assert.equal(await snap(),initial);
 await page.evaluate(()=>drawing.redo());await page.waitForTimeout(120);assert.notEqual(await snap(),initial);
 for(const palette of ['pastel','earth','ocean','bright']){await page.selectOption('#artPalette',palette);await page.locator('#swatches button').first().click();}
 await page.locator('#artOpacity').fill('40');assert.equal(await page.locator('#opacityValue').textContent(),'40%');
 await page.selectOption('#artTip','square');await page.selectOption('#artDash','dash');await page.check('#artRainbow');await stroke();
 await page.uncheck('#artRainbow');await page.check('#artFill');await stroke('triangle');await stroke('rect');await stroke('circle');
 await page.locator('#artText').fill('My colorful world');await page.selectOption('#artFont','serif');await stroke('text');await stroke('picker');
 for(const pack of ['space','nature','animals','food']){await page.selectOption('#artStickers',pack);assert.equal(await page.locator('#stamp option').count(),8);await stroke('stamp');}
 for(const kind of ['hills','sea','comic']){await page.selectOption('#artTemplate',kind);const before=await snap();await page.evaluate(()=>drawing.template());assert.notEqual(await snap(),before);await page.evaluate(()=>drawing.undo());await page.waitForTimeout(120);assert.equal(await snap(),before);}
 await page.locator('#artPaper').fill('#123456');await page.evaluate(()=>drawing.paper());assert.deepEqual(await page.locator('#canvas').evaluate(c=>Array.from(c.getContext('2d').getImageData(400,300,1,1).data)),[18,52,86,255]);
 await stroke();let before=await snap();await page.evaluate(()=>{drawing.flip();drawing.flip();});assert.equal(await snap(),before);await page.evaluate(()=>{drawing.rotate();drawing.rotate();});assert.equal(await snap(),before);
 const png=Buffer.from(initial.split(',')[1],'base64');await page.setInputFiles('#artImport',{name:'sample.png',mimeType:'image/png',buffer:png});await page.waitForFunction(()=>document.querySelector('#artStatus').textContent.includes('imported'));assert.equal(await snap(),initial);
 const downloadPromise=page.waitForEvent('download');await page.evaluate(()=>drawing.download());const download=await downloadPromise;assert(download.suggestedFilename().endsWith('.png'));
 await page.selectOption('#artTemplate','hills');await page.evaluate(()=>drawing.template());await page.locator('#canvas').scrollIntoViewIfNeeded();await page.screenshot({path:'studio-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.locator('#artText').scrollIntoViewIfNeeded();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Mobile overflow');await page.screenshot({path:'studio-mobile.png',fullPage:true});
 assert.deepEqual(errors,[]);console.log('PASS: syntax, all 16 additions, undo/redo, import, PNG download, transforms, desktop/mobile, no page errors');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
