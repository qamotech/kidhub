"""Idempotently attach tailored practice companions to games and secondary dashboard apps."""
from pathlib import Path
import html,json,re
ROOT=Path(__file__).resolve().parents[1]
GOALS={
'popstorm':['Try a hero and describe its starting advantage.','Compare two power-up choices during separate runs.','Record a strategy for a boss or a longer survival run.'],
'neon-pong':['Practice returning the ball from different paddle positions.','Try a rally while keeping movements small.','Compare two rounds and describe what improved.'],
'combat-cars':['Learn steering and turning before chasing opponents.','Plan a route that avoids a crowded area.','Compare an aggressive and a defensive driving strategy.'],
'shadow-defense':['Identify the defense controls before starting.','Practice waiting for an attack before responding.','Describe one timing improvement after two rounds.'],
'miyagi-throw':['Practice aiming at a nearby target.','Adjust your aim for a farther target.','Record which cue helped you aim more accurately.'],
'n8-shift':['Learn which form beats each hazard: walls, pits, lasers and drones.','Practice shifting just before a hazard to land a PERFECT.','Compare two runs and note which hazard you want to improve on.'],
'ninja-sandbox':['Explore the movement controls in a safe area.','Chain a run and a jump toward a chosen landmark.','Invent a short route and try it twice.'],
'shipment-8bit':['Learn the arena layout before rushing.','Practice movement around an obstacle.','Record a route or position that helped you survive.'],
'blob-bash-royale':['Practice recovery after leaving a platform.','Use a defensive option before attacking.','Compare two fighters or stages and note a difference.'],
'panther-arena':['Inspect the board before choosing a move.','Predict an opponent response before your turn.','Explain one choice that protected your position.'],
'qamelot-conquest':['Explore movement and attacks in the first area.','Choose a route before entering a crowded encounter.','Record a tactic you would try on the next run.'],
'qamelot-tower-defense':['Inspect paths before placing a tower.','Compare tower coverage from two positions.','Explain one upgrade or placement choice after a wave.'],
'stix-stax-stonz':['Identify every line that could win.','Block an immediate threat before planning your own line.','Describe a move that creates two threats.']}
COMPANIONS={1:('KidsBeat',['Build a short beat with two contrasting sounds.','Change the tempo and compare the groove.','Record a pattern or describe how to recreate it.']),2:('Qamo Mathcore',['Solve a problem using the available controls.','Check the result with a second method.','Write a new example and explain the steps.']),3:('Stix Stax Stonz',['Find a possible winning line.','Block an immediate threat.','Describe a move that sets up your next turn.'])}
def tag(id,title,goals,src):
 attrs={'src':src,'data-activity':id,'data-title':title,'data-goals':json.dumps(goals,ensure_ascii=False)}
 return '<!-- PRACTICE KIT -->\n<script '+ ' '.join(k+'="'+html.escape(v,quote=True)+'"' for k,v in attrs.items())+' defer></script>\n<!-- /PRACTICE KIT -->'
def replace(s,t):
 s=re.sub(r'<!-- PRACTICE KIT -->[\s\S]*?<!-- /PRACTICE KIT -->\s*','',s)
 return re.sub(r'</body>',lambda _:t+'\n</body>',s,count=1,flags=re.I) if re.search('</body>',s,re.I) else s+t
def build():
 for g in json.loads((ROOT/'games/games.json').read_text(encoding='utf-8')):
  p=ROOT/'games'/f'{g["slug"]}.html';p.write_text(replace(p.read_text(encoding='utf-8'),tag(g['slug'],g['title'],GOALS[g['slug']],'../activity-kit.js')),encoding='utf-8')
 p=ROOT/'index.html';s=p.read_text(encoding='utf-8')
 for i,(title,goals) in COMPANIONS.items():
  pattern=rf'(<iframe id="app-{i}"[^>]*srcdoc=")([\s\S]*?)("[^>]*>)';m=re.search(pattern,s);assert m
  inner=replace(html.unescape(m[2]),tag('companion-'+str(i),title,goals,'activity-kit.js'));s=s[:m.start(2)]+html.escape(inner,quote=True)+s[m.end(2):]
 p.write_text(s,encoding='utf-8')
 print('Practice kits: 14 games and 3 companion apps')
if __name__=='__main__':build()
