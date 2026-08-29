#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Visual System Phase 1 の適用（冪等）

やること:
  1. 全対象ページに css/system.css を読み込ませる
  2. 共通ナビ <nav class="klg-nav"> と SVG スプライトを <body> 直後へ差し込む
     （既に mini-nav を持つページは、そちらを残して二重に出さない）
  3. species ヒーローの <span class="sp-emoji">絵文字</span> を
     6生態カテゴリの SVG アイコンへ置換し、body に data-klg-cat を付ける
  4. shindan のルートカード5個、トップの主要カード4個のアイコンを SVG へ置換
  5. review系6ページに klg-review クラスを付けて本体テーマへ寄せる

やらないこと:
  - 本文中の意味補助絵文字の削除
  - 著者情報・学名・説明文・SEO要素の変更

  python3 tools/gen_visual_system.py --check   計測のみ
  python3 tools/gen_visual_system.py --apply   書き込み
"""

import os
import re
import sys
import glob
import json
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MARK_CSS = 'href="%scss/system.css"'
MARK_NAV = 'class="klg-nav"'

# ---- SVG スプライト -----------------------------------------------------
# 独自に描いた単色ラインアイコン。ロゴ・型番は使っていない。
SPRITE = '''<svg class="klg-sprite" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><defs>
<symbol id="klg-i-tortoise" viewBox="0 0 24 24"><path d="M4.4 13.6c0-3.4 3.2-6 7.6-6s7.6 2.6 7.6 6"/><path d="M4.4 13.6h15.2"/><path d="M12 7.6v6M8.2 8.4l-1.1 5.2M15.8 8.4l1.1 5.2"/><path d="M6.2 13.6v2.2M17.8 13.6v2.2M9.4 13.6v1.6M14.6 13.6v1.6"/><path d="M19.6 11.8h1.6a1 1 0 0 1 0 2h-1.2"/></symbol>
<symbol id="klg-i-forest" viewBox="0 0 24 24"><path d="M4.6 14.2c0-3.2 3.3-5.8 7.4-5.8s7.4 2.6 7.4 5.8"/><path d="M4.6 14.2h14.8"/><path d="M12 8.4v5.8"/><path d="M7.4 9.6 6.2 14.2M16.6 9.6l1.2 4.6"/><path d="M3 18.4c1.8-1 3.4-1 5 0M16 18.4c1.8-1 3.4-1 5 0"/></symbol>
<symbol id="klg-i-semiaquatic" viewBox="0 0 24 24"><path d="M5 11.6c0-3 3.1-5.4 7-5.4s7 2.4 7 5.4"/><path d="M5 11.6h14"/><path d="M12 6.2v5.4M8.4 7.2 7.4 11.6M15.6 7.2l1 4.4"/><path d="M2.6 15.4c1.6-1.2 3.2-1.2 4.8 0s3.2 1.2 4.8 0 3.2-1.2 4.8 0 3.2 1.2 4.4 0"/><path d="M2.6 18.6c1.6-1.2 3.2-1.2 4.8 0s3.2 1.2 4.8 0 3.2-1.2 4.8 0 3.2 1.2 4.4 0"/></symbol>
<symbol id="klg-i-aquatic" viewBox="0 0 24 24"><path d="M6 10.4c0-2.7 2.7-4.8 6-4.8s6 2.1 6 4.8"/><path d="M6 10.4h12"/><path d="M12 5.6v4.8"/><path d="M4.2 13.4c1.5 1.4 3 1.4 4.5 0M10.2 13.4c1.5 1.4 3 1.4 4.5 0M16.2 13.4c1.2 1.1 2.4 1.3 3.6.6"/><path d="M2.4 17.4c1.7-1.3 3.4-1.3 5.1 0s3.4 1.3 5.1 0 3.4-1.3 5.1 0 2.6 1 3.3.5"/></symbol>
<symbol id="klg-i-brackish" viewBox="0 0 24 24"><path d="M6 10.8c0-2.7 2.7-4.8 6-4.8s6 2.1 6 4.8"/><path d="M6 10.8h12M12 6v4.8"/><path d="M2.6 15c1.6-1.2 3.2-1.2 4.8 0s3.2 1.2 4.8 0 3.2-1.2 4.8 0 3.2 1.2 4.4 0"/><path d="M5.4 19.2h.02M9 19.2h.02M12.6 19.2h.02M16.2 19.2h.02M19.8 19.2h.02" stroke-width="2.1"/></symbol>
<symbol id="klg-i-softshell" viewBox="0 0 24 24"><ellipse cx="11.4" cy="12.4" rx="6.6" ry="4.6"/><path d="M18 11.4c1.4-.6 2.6-.3 3.4.8-.9 1-2.1 1.2-3.4.6"/><path d="M4.8 12.4c-1 .5-1.8 1.3-2.2 2.3"/><path d="M8 16.6l-.8 2M14.6 16.6l.8 2"/></symbol>
<symbol id="klg-i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="M15.4 15.4 20 20"/></symbol>
<symbol id="klg-i-book" viewBox="0 0 24 24"><path d="M4 5.2h5.6c1.3 0 2.4 1 2.4 2.3v11c0-1-1.1-1.8-2.4-1.8H4z"/><path d="M20 5.2h-5.6c-1.3 0-2.4 1-2.4 2.3v11c0-1 1.1-1.8 2.4-1.8H20z"/></symbol>
<symbol id="klg-i-compass" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.2"/><path d="m14.9 9.1-1.6 4.2-4.2 1.6 1.6-4.2z"/></symbol>
<symbol id="klg-i-drop" viewBox="0 0 24 24"><path d="M12 3.6s5.4 5.6 5.4 9.3a5.4 5.4 0 0 1-10.8 0C6.6 9.2 12 3.6 12 3.6z"/></symbol>
<symbol id="klg-i-egg" viewBox="0 0 24 24"><path d="M12 3.8c3.1 0 5.6 4.4 5.6 8.2a5.6 5.6 0 1 1-11.2 0c0-3.8 2.5-8.2 5.6-8.2z"/></symbol>
<symbol id="klg-i-coin" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.2"/><path d="M12 7.6v8.8M14.4 9.6c-.6-.7-1.5-1-2.4-1-1.3 0-2.4.7-2.4 1.8s1.1 1.6 2.4 1.8 2.4.7 2.4 1.8-1.1 1.8-2.4 1.8c-.9 0-1.8-.3-2.4-1"/></symbol>
<symbol id="klg-i-leaf" viewBox="0 0 24 24"><path d="M19.4 4.6c0 8.4-4.2 12.6-9.4 12.6-2.6 0-4.6-1.4-4.6-4 0-5.4 6.2-8.6 14-8.6z"/><path d="M5.4 19.4c2.2-4 5.4-6.8 9.2-8.4"/></symbol>
<symbol id="klg-i-mountain" viewBox="0 0 24 24"><path d="m3 18.6 5.4-9 3.2 5 2.2-3.4 7.2 7.4z"/><path d="M8.4 9.6 6 13.4h4.8"/></symbol>
<symbol id="klg-i-sparkle" viewBox="0 0 24 24"><path d="m12 3.6 1.9 5.2 5.5 1.9-5.5 1.9L12 17.8l-1.9-5.2-5.5-1.9 5.5-1.9z"/><path d="M18.6 16.4l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7z"/></symbol>
<symbol id="klg-i-help" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.2"/><path d="M9.6 9.6a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2-2.4 3.4"/><path d="M12 16.6h.02" stroke-width="2.1"/></symbol>
<symbol id="klg-i-care" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.2"/><path d="M12 8.4v7.2M8.4 12h7.2"/></symbol>
<symbol id="klg-i-gear" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 3.4v2.4M12 18.2v2.4M20.6 12h-2.4M5.8 12H3.4M18.1 5.9l-1.7 1.7M7.6 16.4l-1.7 1.7M18.1 18.1l-1.7-1.7M7.6 7.6 5.9 5.9"/></symbol>
<symbol id="klg-i-scale" viewBox="0 0 24 24"><path d="M12 4.6v14.8M6.4 19.4h11.2"/><path d="M4 9.6h6.4L7.2 15z"/><path d="M13.6 9.6H20l-3.2 5.4z"/><path d="M4 9.6 12 7.4l8 2.2"/></symbol>
<symbol id="klg-i-star" viewBox="0 0 24 24"><path d="m12 4 2.4 5 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 9.8 9.6 9z"/></symbol>
<symbol id="klg-i-arrow" viewBox="0 0 24 24"><path d="M4.8 12h14"/><path d="m13.4 6.8 5.4 5.2-5.4 5.2"/></symbol>
</defs></svg>'''

# 6生態カテゴリ → アイコン id
CAT_ICON = {
    "リクガメ": "klg-i-tortoise",
    "ヤマガメ・ハコガメ": "klg-i-forest",
    "半水棲": "klg-i-semiaquatic",
    "水棲（淡水）": "klg-i-aquatic",
    "汽水": "klg-i-brackish",
    "スッポン・曲頸": "klg-i-softshell",
}
FALLBACK_ICON = "klg-i-tortoise"


def nav_html(prefix):
    """prefix はルートまでの相対パス（'' / '../'）"""
    return (
        '<nav class="klg-nav" aria-label="サイトナビゲーション">\n'
        '  <div class="klg-nav-inner">\n'
        '    <a href="%(p)sindex.html" class="klg-nav-logo" aria-label="カメライフガイド トップ">'
        '<svg class="klg-ico" aria-hidden="true"><use href="#klg-i-tortoise"/></svg>KAME LIFE</a>\n'
        '    <a href="%(p)sspecies-list.html" class="klg-nav-link">種一覧</a>\n'
        '    <a href="%(p)sguides/index.html" class="klg-nav-link">ガイド</a>\n'
        '    <a href="%(p)strouble/index.html" class="klg-nav-link">トラブル</a>\n'
        '    <a href="%(p)sshindan/index.html" class="klg-nav-cta">診断'
        '<svg class="klg-ico" aria-hidden="true"><use href="#klg-i-arrow"/></svg></a>\n'
        '  </div>\n'
        '</nav>\n' % {"p": prefix}
    )


def prefix_for(path):
    rel = os.path.relpath(path, ROOT)
    depth = rel.count(os.sep)
    return "../" * depth


def species_bigcat():
    """tools/taxonomy.js の GENUS_CAT を使って slug → 大分類 を得る"""
    js = """
    const t=require('%s/tools/taxonomy.js');
    const fs=require('fs'),vm=require('vm');
    let src=fs.readFileSync('%s/shindan/species.js','utf8')+'\\n;globalThis.__S=SPECIES;';
    const ctx={};vm.createContext(ctx);vm.runInContext(src,ctx);
    const out={};
    for(const sp of ctx.__S.all){
      if(!sp.slug) continue;
      const bare=String(sp.latin||'').replace(/\\([^)]*\\)/g,' ').replace(/（[^）]*）/g,' ').trim();
      const genus=bare.split(/\\s+/)[0]||'';
      out[sp.slug]=t.GENUS_CAT[genus]||'';
    }
    console.log(JSON.stringify(out));
    """ % (ROOT, ROOT)
    r = subprocess.run(["node", "-e", js], capture_output=True, text=True, cwd=ROOT)
    if r.returncode != 0:
        print("  ! taxonomy 取得失敗:", r.stderr.strip()[:200])
        return {}
    return json.loads(r.stdout)


def ensure_css(html, prefix):
    if MARK_CSS % prefix in html:
        return html, False
    tag = '<link rel="stylesheet" href="%scss/system.css">\n' % prefix
    i = html.find("</head>")
    if i == -1:
        # </head> を持たないページがある（index.html / guide-*.html）。
        # その場合は <body> の直前へ入れる。
        m = re.search(r"<body[^>]*>", html)
        if not m:
            return html, False
        i = m.start()
    return html[:i] + tag + html[i:], True


def ensure_nav(html, prefix):
    """共通ナビとスプライトを差し込む。既存 mini-nav があるページはナビを足さない"""
    changed = False
    m = re.search(r"<body([^>]*)>", html)
    if not m:
        return html, False
    # スプライトは全ページに必要（アイコン置換で use するため）
    if 'class="klg-sprite"' not in html:
        html = html[: m.end()] + "\n" + SPRITE + "\n" + html[m.end():]
        changed = True
        m = re.search(r"<body([^>]*)>", html)
    # 旧 mini-nav は共通ナビへ置換する（サイト内でナビを1種類に統一）
    if '<nav class="mini-nav"' in html:
        html = re.sub(r'<nav class="mini-nav".*?</nav>\s*', "", html, flags=re.S)
        changed = True
    has_own_nav = False
    if MARK_NAV not in html and not has_own_nav:
        m = re.search(r"<body([^>]*)>", html)
        end = html.find(">", m.start()) + 1
        sprite_end = html.find("</svg>", end)
        insert_at = html.find("\n", sprite_end) + 1 if sprite_end != -1 else end
        html = html[:insert_at] + nav_html(prefix) + html[insert_at:]
        changed = True
        # body に klg-has-nav を付ける
        m = re.search(r"<body([^>]*)>", html)
        attrs = m.group(1)
        if "klg-has-nav" not in attrs:
            if 'class="' in attrs:
                new = attrs.replace('class="', 'class="klg-has-nav ', 1)
            else:
                new = attrs + ' class="klg-has-nav"'
            html = html[: m.start()] + "<body%s>" % new + html[m.end():]
    return html, changed


def set_body_attr(html, key, value):
    m = re.search(r"<body([^>]*)>", html)
    if not m:
        return html, False
    attrs = m.group(1)
    if '%s="%s"' % (key, value) in attrs:
        return html, False
    attrs = re.sub(r'\s%s="[^"]*"' % key, "", attrs)
    attrs = attrs + ' %s="%s"' % (key, value)
    return html[: m.start()] + "<body%s>" % attrs + html[m.end():], True


def add_body_class(html, cls):
    m = re.search(r"<body([^>]*)>", html)
    if not m:
        return html, False
    attrs = m.group(1)
    if cls in attrs:
        return html, False
    if 'class="' in attrs:
        attrs = attrs.replace('class="', 'class="%s ' % cls, 1)
    else:
        attrs = attrs + ' class="%s"' % cls
    return html[: m.start()] + "<body%s>" % attrs + html[m.end():], True


ICO = '<svg class="klg-ico" aria-hidden="true"><use href="#%s"/></svg>'
SP_EMOJI_RE = re.compile(r'<span class="sp-emoji">(.*?)</span>', re.S)


def apply_species(paths, cats):
    n_css = n_nav = n_ico = 0
    for p in paths:
        html = open(p, encoding="utf-8").read()
        orig = html
        prefix = prefix_for(p)
        html, c = ensure_css(html, prefix); n_css += c
        html, c = ensure_nav(html, prefix); n_nav += c
        slug = os.path.basename(p)[:-5]
        cat = cats.get(slug, "")
        icon = CAT_ICON.get(cat, FALLBACK_ICON)
        if cat:
            html, _ = set_body_attr(html, "data-klg-cat", cat)
        new_span = '<span class="sp-emoji">%s</span>' % (ICO % icon)
        if SP_EMOJI_RE.search(html):
            cur = SP_EMOJI_RE.search(html).group(0)
            if cur != new_span:
                html = SP_EMOJI_RE.sub(lambda m: new_span, html, count=1)
                n_ico += 1
        if html != orig:
            open(p, "w", encoding="utf-8").write(html)
    return n_css, n_nav, n_ico


def apply_generic(paths, review=False):
    n_css = n_nav = 0
    for p in paths:
        html = open(p, encoding="utf-8").read()
        orig = html
        prefix = prefix_for(p)
        html, c = ensure_css(html, prefix); n_css += c
        html, c = ensure_nav(html, prefix); n_nav += c
        if review:
            html, _ = add_body_class(html, "klg-review")
        if html != orig:
            open(p, "w", encoding="utf-8").write(html)
    return n_css, n_nav


# --- shindan ルートカード / トップ主要カードの絵文字置換 ------------------
SHINDAN_MAP = {
    "🏔️": "klg-i-tortoise",
    "🏊": "klg-i-aquatic",
    "🍂": "klg-i-forest",
    "🌀": "klg-i-sparkle",
    "❓": "klg-i-help",
    "🐢": "klg-i-tortoise",
}
TOP_CARD_MAP = {
    "💧": "klg-i-drop",
    "🐣": "klg-i-egg",
    "💰": "klg-i-coin",
    "🌿": "klg-i-leaf",
    "🔍": "klg-i-search",
    "📖": "klg-i-book",
}


def replace_in_class(html, class_pat, mapping):
    """指定クラスを持つ要素のテキストが絵文字だけなら SVG に置き換える"""
    n = 0
    pat = re.compile(r'(<(\w+)[^>]*class="[^"]*%s[^"]*"[^>]*>)(.*?)(</\2>)' % class_pat, re.S)

    def rep(m):
        nonlocal n
        inner = m.group(3).strip()
        if inner in mapping:
            n += 1
            return m.group(1) + (ICO % mapping[inner]) + m.group(4)
        return m.group(0)

    return pat.sub(rep, html), n


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "--check"
    cats = species_bigcat()
    sp = [f for f in sorted(glob.glob(os.path.join(ROOT, "species", "*.html")))
          if "template" not in os.path.basename(f)]
    others = []
    for pat in ("species-list.html", "ranking-*.html", "compare/*.html", "trouble/*.html",
                "shindan/index.html", "guides/*.html", "*-best10.html", "guide-*.html",
                "explore.html", "real-setups/index.html", "photo-credits.html"):
        others += [f for f in sorted(glob.glob(os.path.join(ROOT, pat)))
                   if "template" not in os.path.basename(f)]
    reviews = sorted(glob.glob(os.path.join(ROOT, "*-review.html")))

    print("対象: species %d / その他 %d / review %d" % (len(sp), len(others), len(reviews)))
    print("カテゴリ解決: %d slug" % len([v for v in cats.values() if v]))

    if mode != "--apply":
        return 0

    a, b, c = apply_species(sp, cats)
    print("species: css+%d nav+%d アイコン置換%d" % (a, b, c))
    d, e = apply_generic(others)
    print("その他 : css+%d nav+%d" % (d, e))
    f, g = apply_generic(reviews, review=True)
    print("review : css+%d nav+%d (klg-review 付与)" % (f, g))

    # index.html はナビ既存。CSS とカードアイコンだけ入れる
    ip = os.path.join(ROOT, "index.html")
    html = open(ip, encoding="utf-8").read(); orig = html
    html, _ = ensure_css(html, "")
    if 'class="klg-sprite"' not in html:
        m = re.search(r"<body([^>]*)>", html)
        html = html[: m.end()] + "\n" + SPRITE + "\n" + html[m.end():]
    html, n1 = replace_in_class(html, "pc-card-icon", TOP_CARD_MAP)
    html, n2 = replace_in_class(html, "entry-card-icon", TOP_CARD_MAP)
    if html != orig:
        open(ip, "w", encoding="utf-8").write(html)
    print("index  : カードアイコン置換 %d" % (n1 + n2))

    # shindan
    shp = os.path.join(ROOT, "shindan", "index.html")
    html = open(shp, encoding="utf-8").read(); orig = html
    html, n3 = replace_in_class(html, "route-icon", SHINDAN_MAP)
    html, n4 = replace_in_class(html, "sh-logo", SHINDAN_MAP)
    if html != orig:
        open(shp, "w", encoding="utf-8").write(html)
    print("shindan: ルートアイコン置換 %d" % (n3 + n4))
    return 0


if __name__ == "__main__":
    sys.exit(main())
