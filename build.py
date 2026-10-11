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
i = s.rindex('</body>')
s = s[:i].rstrip() + '\n' + ''.join(blocks) + s[i:]
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
from tools.build_portal import build as build_portal
build_portal()
# Content-based versions: identical sources produce identical deployable files.
import hashlib
sw = root / 'sw.js'
sw_source = re.sub(r"const V='[^']*';", "const V='__VERSION__';", sw.read_text(encoding='utf-8'), count=1)
files = [root / n for n in ('index.html', 'studio.html', 'resources.html',
         'portal.js', 'portal.css', 'portal-data.js', 'dashboard-shell.js',
         'offline.js', 'activity-kit.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png')]
files += sorted((root / 'games').glob('*.html'))
digest = hashlib.sha256(sw_source.encode())
for f in files:
    digest.update(f.relative_to(root).as_posix().encode())
    digest.update(f.read_bytes())
stamp = digest.hexdigest()[:16]
for f in (studio, idx):
    f.write_text(f.read_text(encoding='utf-8').replace('__BUILD__', stamp), encoding='utf-8')
sw.write_text(sw_source.replace('__VERSION__', 'kidhub-' + stamp), encoding='utf-8')
print('Content version:', stamp)
