"""Inject src/*.html modules into studio.html (idempotent) and rebuild index.html's embedded copy."""
from pathlib import Path
import re, html, sys
root = Path(__file__).parent
studio = root / 'studio.html'
s = studio.read_text(encoding='utf-8')
for f in sorted((root / 'src').glob('*.html')):
    name = f.stem
    block = f'<!-- SRC:{name} -->\n' + f.read_text(encoding='utf-8').strip() + f'\n<!-- /SRC:{name} -->'
    pat = re.compile(rf'<!-- SRC:{name} -->[\s\S]*?<!-- /SRC:{name} -->')
    if pat.search(s):
        s = pat.sub(lambda m: block, s, count=1)
    else:
        i = s.rindex('</body>')
        s = s[:i] + block + '\n' + s[i:]
studio.write_text(s, encoding='utf-8')
idx = root / 'index.html'
o = idx.read_text(encoding='utf-8')
m = re.search(r'(<iframe id="app-0"[^>]*srcdoc=")([\s\S]*?)("[^>]*>)', o)
if not m:
    sys.exit('dashboard iframe not found')
idx.write_text(o[:m.start(2)] + html.escape(s, quote=True) + o[m.end(2):], encoding='utf-8')
print('built', len(s), 'bytes')
