"""Generate an application catalog from the shipped core activities, tools, and games."""
from pathlib import Path
import re,json
ROOT=Path(__file__).resolve().parents[1]
CORE=[('draw','🎨','Art Studio','Create','Draw, add text, import images, and export art.'),('game','⭐','Catch the Stars','Play','Practice target timing with relaxed and timed rounds.'),('stories','📚','Story Garden','Learn','Read six original stories and answer comprehension questions.'),('music','🎹','Music Lab','Create','Play, sequence, record, and explore sounds.'),('math','🚀','Math Mission','Learn','Practice arithmetic, division, and word problems.'),('memory','🧠','Memory Match','Play','Match up to twelve pairs across four collections.'),('coding','🤖','Code Logic','Learn','Program a robot through ten selectable routes.'),('space','🪐','Space Explorer','Learn','Explore planets and practice their order.'),('dino','🦴','Dino Dig','Learn','Find fossils and record observations.'),('puzzle','🧩','Shapes Puzzle','Play','Plan moves in a sliding-tile puzzle.'),('farm','🐮','Farm Friends','Learn','Match animal calls and write farm adventures.'),('color','🖍️','Coloring Book','Create','Color a scene or export a pattern quilt.'),('spelling','🔤','Word Spelling','Learn','Practice fifty words and missing letters.'),('clock','🕒','Telling Time','Learn','Read clocks and practice elapsed time.'),('music-maker','🎵','Music Maker','Create','Compose a sixteen-step melody.'),('storybook','📖','Storybook Creator','Create','Write and print a picture book with up to 24 pages.')]
def build():
 s=(ROOT/'studio.html').read_text(encoding='utf-8')
 records=[{'id':'suite-'+str(i),'title':name,'emoji':emoji,'kind':'Applications','category':cat,'description':desc,'frame':i,'href':'index.html#app='+str(i)} for i,name,emoji,cat,desc in [(0,'KidHub','🚀','Learn','The full activity hub, creative studios, toolbox, and arcade.'),(1,'KidsBeat','🥁','Create','Sequence beats with 24 instruments, swing, effects, and track mixing.'),(2,'Qamo Mathcore','📐','Learn','A drawing notebook for math diagrams, text, mirrored sketches, and image export.'),(3,'Stix Stax Stonz','❌','Play','A strategy board game with AI options, undo, and personal practice goals.')]]
 for id,emoji,title,cat,desc in CORE:records.append({'id':'core-'+id,'title':title,'emoji':emoji,'kind':'Activities','category':cat,'description':desc,'frame':0,'screen':id,'href':'studio.html#'+id})
 cats={'math':'Learn','words':'Learn','science':'Learn','time':'Learn','arts':'Create','games':'Play','well':'Wellbeing','help':'Helpers'}
 bank=s[s.index('const T=['):s.index('const TOOL=Object.fromEntries')]
 tools=re.findall(r'^\["([\w-]+)","([^"]+)","([^"]+)","([^"]+)"',bank,re.M);assert len(tools)==80,len(tools)
 for id,emoji,title,cat in tools:records.append({'id':'tool-'+id,'title':title,'emoji':emoji,'kind':'Toolbox','category':cats[cat],'description':f'{title}: an interactive tool with its own experiment trail and journal.','frame':0,'tool':id,'href':'studio.html#tool='+id})
 for g in json.loads((ROOT/'games/games.json').read_text(encoding='utf-8')):records.append({'id':'game-'+g['slug'],'title':g['title'],'emoji':g['emoji'],'kind':'Arcade','category':'Play','description':g['blurb'],'href':'games/'+g['slug']+'.html'})
 assert len({r['id'] for r in records})==len(records)
 (ROOT/'portal-data.js').write_text('window.KidHubCatalog='+json.dumps(records,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
 print('Application catalog:',len(records),'verified entries')
if __name__=='__main__':build()
