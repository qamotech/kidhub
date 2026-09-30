"""One-time migration of the original inline activity bank. Source edits are retained in studio.html."""
from pathlib import Path
import re
p=Path(__file__).resolve().parents[1]/'studio.html'
s=p.read_text(encoding='utf-8')
if '<!-- CORE EXPANSION V1 -->' in s:raise SystemExit('Core expansion already applied')
def change(old,new):
 global s
 assert old in s,old[:90]
 s=s.replace(old,new,1)
change('<select id="mathMode" onchange="math.start()">','<select id="mathMode" onchange="math.start()"><option value="divide">Division</option>')
change('["add", "subtract", "multiply"][Math.floor(Math.random() * 3)]','["add", "subtract", "multiply", "divide"][Math.floor(Math.random() * 4)]')
change('          right = op === "add" ? a + b : op === "multiply" ? a * b : a - b;', '          if(op === "divide") a *= b;\n          right = op === "divide" ? a / b : op === "add" ? a + b : op === "multiply" ? a * b : a - b;')
change('${op === "add" ? "+" : op === "multiply" ? "×" : "−"}', '${op === "divide" ? "÷" : op === "add" ? "+" : op === "multiply" ? "×" : "−"}')
change('          hintText =\n            op === "add"','          hintText =\n            op === "divide" ? `Share ${a} into ${b} equal groups. How many in each?` : op === "add"')
# Longer, themed memory decks and no background clock advancement.
change('        let icons = ["🐸", "🚀", "🌈", "🦁", "🎸", "🍓", "🦋", "⚽"],','''        const themes={mixed:["🐸","🚀","🌈","🦁","🎸","🍓","🦋","⚽","🌙","🦊","🌻","🐬"],animals:["🐸","🦁","🐬","🐢","🦊","🐻","🐨","🐯","🐧","🐘","🦒","🐝"],food:["🍎","🍌","🍓","🍇","🍉","🥕","🥦","🍒","🍐","🍊","🍋","🥝"],space:["🚀","🌙","⭐","🪐","🌍","☄️","🛸","👽","🛰️","🔭","🌞","🌌"]};
        let icons = themes.mixed,''')
change('            let selected = icons.slice(0, activePairs);','            icons=themes[document.getElementById("memoryTheme")?.value]||themes.mixed;\n            let selected = icons.slice(0, activePairs);')
change('            tick = setInterval(() => {\n              sec++;','            tick = setInterval(() => {\n              if(app.current!=="memory"||document.hidden)return;\n              sec++;')
idx=s.index('id="memorySize"');pos=s.index('</select>',idx)
s=s[:pos]+'<option value="10">10 pairs</option><option value="12">12 pairs</option>'+s[pos:]
pos=s.index('</select>',idx)+len('</select>')
s=s[:pos]+'''<label for="memoryTheme">Card collection</label><select id="memoryTheme" onchange="memoryGame.start()"><option value="mixed">Mixed adventures</option><option value="animals">Animals</option><option value="food">Fruit & vegetables</option><option value="space">Space</option></select>'''+s[pos:]
# Extra code routes; existing badge remains earned after the original five.
old='{s:[2,2],g:[0,0],w:[[1,1],[1,2],[1,3],[2,1],[3,1]]}];let lv=Math.min(P.robot,4)'
new='{s:[2,2],g:[0,0],w:[[1,1],[1,2],[1,3],[2,1],[3,1]]},{s:[4,4],g:[0,0],w:[[3,3],[2,3],[1,3]]},{s:[0,0],g:[4,4],w:[[0,1],[1,1],[2,1],[3,3]]},{s:[2,0],g:[2,4],w:[[2,1],[2,2],[2,3]]},{s:[4,2],g:[0,2],w:[[3,2],[2,2],[1,2]]},{s:[4,0],g:[0,4],w:[[3,0],[3,1],[3,2],[1,2],[1,3],[1,4]]}];let lv=Math.min(P.robot,9)'
change(old,new)
change('Level ${lv+1}/5','Level ${lv+1}/${LV.length}')
change('<p><b>Level ${lv+1}/${LV.length}</b>','<label>Choose level <select data-level>${LV.map((_,i)=>`<option value="${i}" ${i===lv?"selected":""}>Route ${i+1}</option>`).join("")}</select></label><p><b>Level ${lv+1}/${LV.length}</b>')
change('  $$("[data-d]",el).forEach', '  $("[data-level]",el).onchange=e=>{if(run)return;lv=+e.target.value;prog=[];pos=null;draw()};$("[data-level]",el).disabled=run;\n  $$("[data-d]",el).forEach')
change('$("[data-u]",el).onclick=()=>{prog.pop();draw()};$("[data-c]",el).onclick=()=>{prog=[];pos=null;draw()}', '$("[data-u]",el).onclick=()=>{if(run)return;prog.pop();draw()};$("[data-c]",el).onclick=()=>{if(run)return;prog=[];pos=null;draw()}')
change('lv=Math.min(lv+1,4);prog=[];pos=null;draw(was===4?', 'lv=Math.min(lv+1,LV.length-1);prog=[];pos=null;draw(was===LV.length-1?')
# Prevent route timers running after leaving; the next Run safely restarts.
change('const step=()=>{if(i>=prog.length)', 'const step=()=>{if(app.current!=="coding"){run=false;pos=null;draw();return}if(i>=prog.length)')
# Larger spelling bank and adjustable filters.
change('duck:"🦆"};','duck:"🦆",garden:"🌻",butterfly:"🦋",rainbow:"🌈",elephant:"🐘",penguin:"🐧",giraffe:"🦒",strawberry:"🍓",watermelon:"🍉",carrot:"🥕",broccoli:"🥦",umbrella:"☂️",snowman:"⛄",bicycle:"🚲",helicopter:"🚁",violin:"🎻",guitar:"🎸",drum:"🥁",panda:"🐼",lemon:"🍋",orange:"🍊"};')
change('const W=Object.keys(EMO);let sc=0,w;const nx=()=>{w=pick(W);','const W=Object.keys(EMO);let sc=0,w,wordLevel="all";const nx=()=>{const bank=W.filter(v=>wordLevel==="all"||(wordLevel==="short"?v.length<=4:v.length>=5));w=pick(bank);')
change('<p>Spell this word! <button','<label>Word collection <select data-wordlevel><option value="all">All 50 words</option><option value="short">Short words</option><option value="long">Longer words</option></select></label><p>Spell this word! <button')
change('const i=$("#kpSp",el),f=$("[data-f]",el);','const i=$("#kpSp",el),f=$("[data-f]",el);$("[data-wordlevel]",el).value=wordLevel;$("[data-wordlevel]",el).onchange=e=>{wordLevel=e.target.value;nx()};')
# Extend music maker without discarding previously saved eight-step songs.
change(']],S=8;P.lists.seq=P.lists.seq&&P.lists.seq.length===N.length*S?P.lists.seq:Array(N.length*S).fill(0);',']],S=16;if(P.lists.seq?.length===40){const old=P.lists.seq;P.lists.seq=Array.from({length:80},(_,i)=>i%16<8?old[Math.floor(i/16)*8+i%16]:0)}P.lists.seq=P.lists.seq&&P.lists.seq.length===N.length*S?P.lists.seq:Array(N.length*S).fill(0);')
# More storyboard capacity and room for richer captions.
change('P.story.length>=12','P.story.length>=24')
change('maxlength="400" style="width:100%"','maxlength="800" style="width:100%"')
change('p.text=e.target.value.slice(0,400)','p.text=e.target.value.slice(0,800)')
s=s.replace('</body>','<!-- CORE EXPANSION V1 -->\n</body>',1)
p.write_text(s,encoding='utf-8')
print('Expanded native math, memory, coding, spelling, music maker, and storybook activities')
