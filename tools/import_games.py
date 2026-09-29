"""Copy working N8DEV/Arcade games into kidhub/games/, stripped to just the game.

Removes the site navigation layer (n8x shell/dock/panel, n8-tools-transformers css/js),
menu footers and branding headers, then injects one "back to KidHub" link and a
fullscreen button. Re-run after editing a source game.
"""
from pathlib import Path
import json, re
from bs4 import BeautifulSoup, Comment

SRC = Path(__file__).resolve().parents[2] / 'N8DEV' / 'Arcade'
OUT = Path(__file__).resolve().parents[1] / 'games'
GAMES = [  # file, slug, emoji, title, blurb
    ('PopStorm.html', 'popstorm', '🌟', 'PopStorm: Glow Guardians', 'NEW! Pop Gloomies, build wild power-ups, beat 3 bosses.'),
    ('neon-pong.html', 'neon-pong', '🏓', 'Neon Pong', 'Classic paddle battle with glowing neon.'),
    ('CombatCars.html', 'combat-cars', '🏎️', 'Combat Cars', 'Retro arena racing, 16-bit style.'),
    ('MiyagiDo-ShadowDefense.html', 'shadow-defense', '🥋', 'Shadow Defense', 'Block and defend like a dojo master.'),
    ('MiyagiThrow.html', 'miyagi-throw', '🥷', 'Miyagi Throw!', 'Aim and throw to hit every target.'),
    ('N8-Strike.html', 'n8-strike', '🤖', 'N8 Strike', 'Transforming mecha action.'),
    ('NinjaSandbox.html', 'ninja-sandbox', '🌀', 'Ninja Sandbox', 'Run, jump and transform in a ninja playground.'),
    ('Shipment-8Bit.html', 'shipment-8bit', '👾', 'Shipment 8-Bit', 'Pixel-art arena adventure.'),
    ('blob-bash-royale.html', 'blob-bash-royale', '🟣', 'Blob Bash Royale', 'Bouncy blob platform brawler.'),
    ('blood-and-gold-panther-arena.html', 'panther-arena', '🐆', 'Panther Arena', 'Gold-hunting panther showdown.'),
    ('mecha-strike.html', 'mecha-strike', '🦾', 'Mecha Strike', 'Giant robot transformer protocol.'),
    ('qamelot-conquest-super-arcade-edition.html', 'qamelot-conquest', '🏰', 'Qamelot Conquest', 'Castle-storming arcade quest.'),
    ('qtd-courage-under-fire.html', 'qamelot-tower-defense', '🗼', 'Qamelot Tower Defense', 'Build towers, stop the waves.'),
    ('stix-stax-stonz.html', 'stix-stax-stonz', '❌', 'Stix Stax Stonz', 'Tic-tac-toe with a cyber twist.'),
]
KIT_CSS = """<style id="kh-kit-css">#kh-kit{position:fixed;left:10px;top:10px;z-index:2147483646;display:flex;gap:6px;font:700 14px system-ui,sans-serif}
#kh-kit a,#kh-kit button{display:inline-flex;align-items:center;gap:4px;min-height:40px;padding:6px 12px;border-radius:999px;border:2px solid rgba(255,255,255,.7);background:rgba(20,16,50,.72);color:#fff;text-decoration:none;cursor:pointer;backdrop-filter:blur(6px);font:inherit;box-shadow:0 4px 14px rgba(0,0,0,.3)}
#kh-kit a:focus-visible,#kh-kit button:focus-visible{outline:3px solid #ffe066;outline-offset:2px}
#kh-kit.kh-dim{opacity:.35}#kh-kit:hover{opacity:1}</style>"""
KIT = """<div id="kh-kit"><a href="../studio.html#arcade" target="_top" aria-label="Back to KidHub">⬅️ KidHub</a><button type="button" id="kh-fs" aria-label="Toggle fullscreen">⛶ Fullscreen</button></div>
<script id="kh-kit-js">(()=>{const b=document.getElementById('kh-fs'),k=document.getElementById('kh-kit');const fs=()=>document.fullscreenElement||document.webkitFullscreenElement;
b.onclick=()=>{const d=document.documentElement;if(fs()){(document.exitFullscreen||document.webkitExitFullscreen).call(document)}else{const r=(d.requestFullscreen||d.webkitRequestFullscreen);r&&r.call(d).catch&&r.call(d).catch(()=>{})}};
const sync=()=>{b.textContent=fs()?'🗗 Exit fullscreen':'⛶ Fullscreen'};document.addEventListener('fullscreenchange',sync);document.addEventListener('webkitfullscreenchange',sync);
let t;const wake=()=>{k.classList.remove('kh-dim');clearTimeout(t);t=setTimeout(()=>k.classList.add('kh-dim'),3000)};addEventListener('pointermove',wake,{passive:true});wake()})();</script>"""

def strip(html: str, name: str) -> str:
    soup = BeautifulSoup(html, 'html.parser')
    for el in soup.find_all(lambda t: (t.get('id') or '').startswith('n8x')):
        el.decompose()
    for el in soup.find_all(['link', 'script', 'img']):
        ref = el.get('href') or el.get('src') or ''
        if 'n8-tools-transformers' in ref or ref.endswith('n8-icon.png'):
            el.decompose()
    for el in soup.find_all(['script', 'style']):
        if el.string and ('n8x-shell' in el.string or 'n8x-dock' in el.string):
            el.decompose()
    for el in soup.select('footer.cyber-footer, nav'):
        el.decompose()
    if name == 'blob-bash-royale.html':
        for h in soup.find_all('header'):
            h.decompose()
    for a in soup.select('header a[href]'):  # hub/home links inside kept game HUD headers
        a.decompose()
    for c in soup.find_all(string=lambda s: isinstance(s, Comment) and 'n8x' in s):
        c.extract()
    out = str(soup)
    if name == 'blob-bash-royale.html':  # pro-engine add-on references an undefined `B`; shim it so the block runs
        out = out.replace('<script id="bbr-pro-engine">\n(() => {', '<script id="bbr-pro-engine">\n(() => {\n  const B = window.B || { triggerSpecial() {}, unlock() {} };', 1)
    if name == 'Shipment-8Bit.html':
        out = out.replace('<title>React Artifact</title>', '<title>Shipment 8-Bit</title>')
    icon = "<link rel=\"icon\" href=\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🕹️</text></svg>\">"
    out = re.sub(r'</head>', lambda m: icon + KIT_CSS + '\n</head>', out, count=1, flags=re.I)
    out = re.sub(r'</body>', KIT + '\n</body>', out, count=1, flags=re.I) if re.search(r'</body>', out, re.I) else out + KIT
    return out

def main():
    OUT.mkdir(exist_ok=True)
    meta = []
    for f, slug, emoji, title, blurb in GAMES:
        src = SRC / f
        (OUT / f'{slug}.html').write_text(strip(src.read_text(encoding='utf-8'), f), encoding='utf-8')
        meta.append({'slug': slug, 'emoji': emoji, 'title': title, 'blurb': blurb})
    (OUT / 'games.json').write_text(json.dumps(meta, ensure_ascii=False, indent=1), encoding='utf-8')
    print(f'imported {len(meta)} games')

if __name__ == '__main__':
    main()
