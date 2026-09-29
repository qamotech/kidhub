const { chromium } = require('playwright');const assert=require('assert');
(async()=>{const b=await chromium.launch({channel:'msedge'});const bad=[];
for(const [w,h] of [[1440,900],[1280,720],[768,1024],[390,844],[360,640],[844,390]]){const p=await b.newPage({viewport:{width:w,height:h}});await p.goto('file:///'+process.cwd().split(require('path').sep).join('/')+'/studio.html');
 await p.locator('#cwBtn').click({force:true});await p.waitForTimeout(450);
 for(const t of ['msg','rem','out','set','new']){await p.locator(`#cwPanel [data-t="${t}"]`).click();await p.waitForTimeout(60);
  const r=await p.evaluate(()=>{const P=document.getElementById('cwPanel').getBoundingClientRect(),tabs=[...document.querySelectorAll('#cwPanel .cw-tabs button')].map(x=>x.getBoundingClientRect()),body=document.getElementById('cwBody');return{P:{t:P.top,l:P.left,r:P.right,b:P.bottom},tabsIn:tabs.every(x=>x.left>=P.left-1&&x.right<=P.right+1&&x.width>30),scrollable:body.scrollHeight<=body.clientHeight+1||getComputedStyle(body).overflowY==='auto',vw:innerWidth,vh:innerHeight}});
  const ok=r.P.t>=0&&r.P.l>=0&&r.P.r<=r.vw&&r.P.b<=r.vh&&r.tabsIn&&r.scrollable;if(!ok)bad.push(`${w}x${h} ${t} ${JSON.stringify(r)}`)}
 if(w===390||w===1440)await p.locator('#cwPanel').screenshot({path:`cloud-${w}.png`});await p.close()}
await b.close();assert.deepEqual(bad,[]);console.log('PASS cloud fit: panel + all 5 tabs fully visible at 6 viewports (desktop, tablet, phones, landscape)')})().catch(e=>{console.error(e.message);process.exit(1)});
