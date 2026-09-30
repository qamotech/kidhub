"""Inject src/*.html modules into studio.html (idempotent, alphabetical order) and rebuild index.html's embedded copy.

Order matters: modules are re-appended before </body> sorted by name, so shared engines
(e.g. src/audio.html) load before the modules that use them (src/music.html).
"""
from pathlib import Path
import re, html, json, sys
root = Path(__file__).parent
studio = root / 'studio.html'
s = studio.read_text(encoding='utf-8')
s = re.sub(r'<!-- SRC:([\w-]+) -->[\s\S]*?<!-- /SRC:\1 -->\n?', '', s)
games = (root / 'games' / 'games.json')
games_json = games.read_text(encoding='utf-8') if games.exists() else '[]'
blocks = []
for f in sorted((root / 'src').glob('*.html')):
    body = f.read_text(encoding='utf-8').strip().replace('/*__GAMES__*/[]', json.dumps(json.loads(games_json), ensure_ascii=False))
    blocks.append(f'<!-- SRC:{f.stem} -->\n{body}\n<!-- /SRC:{f.stem} -->\n')
import hashlib, time
stamp = time.strftime('%Y.%m.%d-%H%M') + '-' + hashlib.sha1(''.join(blocks).encode()).hexdigest()[:6]
blocks = [b.replace('__BUILD__', stamp) for b in blocks]
sw = root / 'sw.js'
if sw.exists():
    sw.write_text(re.sub(r"const V='[^']*';", f"const V='kidhub-{stamp}';", sw.read_text(encoding='utf-8'), count=1), encoding='utf-8')
i = s.rindex('</body>')
s = s[:i] + ''.join(blocks) + s[i:]
studio.write_text(s, encoding='utf-8')
idx = root / 'index.html'
o = idx.read_text(encoding='utf-8')
m = re.search(r'(<iframe id="app-0"[^>]*srcdoc=")([\s\S]*?)("[^>]*>)', o)
if not m:
    sys.exit('dashboard iframe not found')
idx.write_text(o[:m.start(2)] + html.escape(s, quote=True) + o[m.end(2):], encoding='utf-8')
print('built', len(s), 'bytes,', len(blocks), 'modules')
from tools.practice_kits import build as build_practice_kits
build_practice_kits()
