#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
species → guides / compare 関連リンク自動生成

設計方針:
  - リンクの根拠は「逆引きインデックス」。guides/ と compare/ の実ファイルを
    走査し、そのページが実際に扱っている species slug を抽出して、
    該当する species ページからのみ逆方向にリンクを張る。
    → 無関係なリンクは構造上生成されない。
  - 飼育機材ガイドのみ、species ページが既にリンクしている
    ルート直下の habitat ガイド（guide-semi / guide-dry 等）から
    生態カテゴリを判定して対応付ける。
    ※ data/species-master.json は「表示HTMLの自動生成元にはしない」と
      正本自身が定めているため、生成元には使わない（照合のみ）。
  - 出力先は各 species ページに既存の <div class="related-links"> ブロック。
    既存の .rel-btn クラスをそのまま使うため CSS 追加ゼロ＝モバイル表示は既存準拠。
  - data-autolink="1" を付与し、再実行時は自前生成分のみ差し替える（冪等）。
  - 生成前に全リンク先の実在を検証する。存在しない URL は生成しない。

使い方:
  python3 scripts/gen_related_links.py --check   # 生成せず計測のみ
  python3 scripts/gen_related_links.py --apply   # 実際に書き込む
"""

import os
import re
import sys
import glob
import statistics

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 生成対象外（テンプレ・noindex）
EXCLUDE = {
    "_template-monetized.html",
    "pink-bellied-template.html",
    "three-toed-box-template.html",
    "hermann-dry-template.html",
    "hime-nioi-turtle.html",
    "ornate-cuora.html",
    "ouachita-map-turtle.html",
}

# habitat ガイド → 生態カテゴリ
AQUATIC_GUIDES = {
    "guide-semi.html",
    "guide-water-full.html",
    "guide-brackish.html",
    "guide-softshell.html",
    "guide-japan.html",
}
TERRESTRIAL_GUIDES = {
    "guide-dry.html",
    "guide-arid.html",
    "guide-moist.html",
    "guide-forest.html",
}

# カテゴリ別の機材ガイド（最も飼育の要になる1本だけ）
EQUIPMENT_GUIDE = {
    "aquatic": ("guides/filter-guide.html", "🔄 フィルターの選び方"),
    "terrestrial": ("guides/uvb-light-guide.html", "☀️ UVBライトの選び方"),
}

# 種を掲載しているガイドの表示ラベル（採用優先度順）
FEATURE_GUIDES = [
    ("guides/real-setup-spenglers-leaf-turtle.html", "📷 リアル飼育環境の実記録"),
    ("guides/real-setup-west-african-mud-turtle.html", "📷 リアル飼育環境の実記録"),
    ("guides/beginner-top10-turtles.html", "🔰 初心者向け亀ランキング"),
    ("guides/small-turtle-top10.html", "📏 小型の亀ランキング"),
    ("guides/low-odor-top10-turtles.html", "🌿 臭わない亀ランキング"),
    ("guides/beginner-best-turtles.html", "🔰 初心者向けおすすめ3選"),
    ("guides/small-best-turtles.html", "📏 小型種おすすめ3選"),
    ("guides/low-odor-turtles.html", "🌿 臭いが少ない種おすすめ3選"),
]

SPECIES_REF = re.compile(r"species/([a-z0-9-]+)\.html")
AUTOLINK_LINE = re.compile(r'[ \t]*<a href="[^"]*" class="rel-btn" data-autolink="1">.*?</a>\n?')

# ---- guides → species（逆方向）---------------------------------------------
# 機材ガイドから代表種へ戻す導線。対象種は恣意的に選ばず、
# サイト自身が既にキュレーションしているランキング掲載種だけを候補にする。
RANKING_SOURCES = [
    "guides/beginner-top10-turtles.html",
    "guides/small-turtle-top10.html",
    "guides/low-odor-top10-turtles.html",
]
# ガイド → 対象カテゴリ（None は水棲・陸棲の両方から代表を出す）
GUIDE_TARGETS = {
    "guides/filter-guide.html": "aquatic",      # 水棲専用の機材
    "guides/uvb-light-guide.html": "terrestrial",  # 陸棲・林床で特に重要
    "guides/food-guide.html": None,             # 全種共通
    "guides/temperature-guide.html": None,      # 全種共通
}
GUIDE_CARDS_MAX = 3
AUTOCARD = re.compile(
    r'[ \t]*<a href="[^"]*" class="related-card" data-autolink="1">.*?</a>\n?', re.S
)


def species_wamei_and_category():
    """species ページ自身から 和名 と 生態カテゴリ を取り出す"""
    out = {}
    for p in species_pages():
        slug = os.path.basename(p)[:-5]
        html = open(p, encoding="utf-8").read()
        out[slug] = (wamei_of(slug), detect_category(html))
    return out


def build_guide_species_plan():
    """機材ガイドに載せる代表種カードを決める"""
    # ランキング掲載回数を数える（多いほど「サイトが代表として扱っている種」）
    freq = {}
    for src in RANKING_SOURCES:
        fp = os.path.join(ROOT, src)
        if not os.path.exists(fp):
            continue
        for slug in set(SPECIES_REF.findall(open(fp, encoding="utf-8").read())):
            freq[slug] = freq.get(slug, 0) + 1

    meta = species_wamei_and_category()
    plan = {}
    for guide, want in GUIDE_TARGETS.items():
        if not os.path.exists(os.path.join(ROOT, guide)):
            continue
        cands = []
        for slug, n in freq.items():
            if slug not in meta:
                continue  # 実ページが無い / 除外対象
            wamei, cat = meta[slug]
            if not wamei or cat is None:
                continue
            if want is not None and cat != want:
                continue
            cands.append((-n, cat, slug, wamei))
        cands.sort()
        if want is None:
            # 全種共通のガイドは水棲・陸棲の両方から均等に代表を出す
            picked, seen = [], {}
            for c in cands:
                cat = c[1]
                if seen.get(cat, 0) >= 2:
                    continue
                seen[cat] = seen.get(cat, 0) + 1
                picked.append(c)
                if len(picked) >= GUIDE_CARDS_MAX:
                    break
            cands = picked
        else:
            cands = cands[:GUIDE_CARDS_MAX]
        plan[guide] = [(s, w, "🐢") for _, _, s, w in cands]
    return plan


def apply_guide_cards(plan):
    changed, total = 0, 0
    for guide, picks in plan.items():
        fp = os.path.join(ROOT, guide)
        src = open(fp, encoding="utf-8").read()
        html = AUTOCARD.sub("", src)
        i = html.find('<div class="related-guides-grid">')
        if i == -1:
            print("  ! related-guides-grid なし:", guide)
            continue
        j = html.find("</div>", i)
        k = html.rfind("\n", i, j)
        pad = "      "
        block = ""
        for slug, wamei, icon in picks:
            block += (
                '%s<a href="../species/%s.html" class="related-card" data-autolink="1">\n'
                '%s  <span class="related-card-icon" aria-hidden="true">%s</span>\n'
                '%s  <p class="related-card-title">%sの飼い方</p>\n'
                '%s  <span class="related-card-arrow">くわしく →</span>\n'
                "%s</a>\n" % (pad, slug, pad, icon, pad, wamei, pad, pad)
            )
            total += 1
        html = html[: k + 1] + block + html[k + 1 :]
        if html != src:
            open(fp, "w", encoding="utf-8").write(html)
            changed += 1
    return changed, total



_WAMEI_CACHE = {}


def wamei_of(slug):
    """species ページ自身の <title> から和名を取得（表示HTMLが唯一の出所）"""
    if slug in _WAMEI_CACHE:
        return _WAMEI_CACHE[slug]
    fp = os.path.join(ROOT, "species", slug + ".html")
    name = None
    if os.path.exists(fp):
        m = re.search(r"<title>([^<｜|]+)", open(fp, encoding="utf-8").read())
        if m:
            # 「◯◯の飼い方」「◯◯の飼育方法」等の接尾を落とす
            name = re.sub(r"の(飼い方|飼育方法|飼育).*$", "", m.group(1).strip()).strip()
    _WAMEI_CACHE[slug] = name
    return name


def species_pages():
    out = []
    for p in sorted(glob.glob(os.path.join(ROOT, "species", "*.html"))):
        if os.path.basename(p) in EXCLUDE:
            continue
        out.append(p)
    return out


def build_reverse_index():
    """guides/ と compare/ を走査し slug -> [(url, label)] の逆引きを作る"""
    guides_idx = {}
    compare_idx = {}

    # guides: 掲載種を逆引き
    for url, label in FEATURE_GUIDES:
        fp = os.path.join(ROOT, url)
        if not os.path.exists(fp):
            continue
        html = open(fp, encoding="utf-8").read()
        for slug in set(SPECIES_REF.findall(html)):
            guides_idx.setdefault(slug, []).append((url, label))

    # compare: 比較対象2種を逆引き
    for fp in sorted(glob.glob(os.path.join(ROOT, "compare", "*.html"))):
        base = os.path.basename(fp)
        if base == "index.html":
            continue
        html = open(fp, encoding="utf-8").read()
        m = re.search(r"<title>([^<|｜]+)", html)
        title = m.group(1).strip() if m else base
        # 「A vs B」形式から2種の和名を取り出す
        parts = [x.strip() for x in re.split(r"\s*vs\.?\s*", title) if x.strip()]
        slugs = sorted(set(SPECIES_REF.findall(html)))
        for slug in slugs:
            # 自種以外の相手種名をラベルにする（短く・自分のページから見て意味が通る）
            other = None
            if len(parts) == 2 and len(slugs) == 2:
                mine = wamei_of(slug)
                if mine:
                    cand = [x for x in parts if x != mine]
                    if len(cand) == 1:
                        other = cand[0]
            label = "⚖️ %sと比較" % other if other else "⚖️ 近縁種と比較"
            compare_idx.setdefault(slug, []).append(("compare/" + base, label))

    return guides_idx, compare_idx


HUB_BLOCK = re.compile(r'<div class="hub-links">.*?</div>', re.S)
NAV_BLOCK = re.compile(r"<nav\b.*?</nav>", re.S)


def detect_category(html):
    """
    そのページ自身が主カテゴリとして掲げている habitat ガイドから判定する。
    フッターの hub-links やナビは全ページ共通で 水棲/リクガメ 両方を列挙するため、
    カテゴリ判定の材料から必ず除外する（除外しないとリクガメが水棲と誤判定される）。
    """
    body = NAV_BLOCK.sub("", HUB_BLOCK.sub("", html))
    refs = set(re.findall(r"(guide-[a-z-]+\.html)", body))
    aq = refs & AQUATIC_GUIDES
    te = refs & TERRESTRIAL_GUIDES
    if aq and not te:
        return "aquatic"
    if te and not aq:
        return "terrestrial"
    return None  # 両方 or 判定不能 → リンクを作らない（誤リンクを出さない）


def strip_autolinks(html):
    return AUTOLINK_LINE.sub("", html)


def measure(paths):
    g, c = [], []
    for p in paths:
        html = open(p, encoding="utf-8").read()
        g.append(len(re.findall(r'href="[^"]*guides/', html)))
        c.append(len(re.findall(r'href="[^"]*compare/', html)))
    def stat(v):
        return dict(
            linked=sum(1 for x in v if x > 0),
            zero=sum(1 for x in v if x == 0),
            median=statistics.median(v),
            total=sum(v),
        )
    return {"guides": stat(g), "compare": stat(c)}


def plan(paths, guides_idx, compare_idx):
    """各ページに追加するリンクを決定"""
    result = {}
    for p in paths:
        slug = os.path.basename(p)[:-5]
        html = strip_autolinks(open(p, encoding="utf-8").read())
        # 共通ナビ（klg-nav）は全ページに guides/ trouble/ へのリンクを持つ。
        # これを「既に手書きリンクがある」と誤判定しないよう、判定対象から外す。
        html = re.sub(r'<nav class="klg-nav".*?</nav>', "", html, flags=re.S)
        adds = []

        # 1. compare（実在する比較ページのみ・1本まで）
        #    既に手書きで compare/ へリンク済みのページは尊重して追加しない
        if "compare/" not in html:
            cands = compare_idx.get(slug, [])
            if cands:
                cands.sort()
                adds.append(cands[0])

        # 2. guides（掲載ガイド優先、無ければカテゴリ別の機材ガイド・1本まで）
        #    既に手書きで guides/ へリンク済みのページは尊重して追加しない
        if "guides/" not in html:
            chosen = None
            featured = list(guides_idx.get(slug, []))
            if featured:
                order = {u: i for i, (u, _) in enumerate(FEATURE_GUIDES)}
                featured.sort(key=lambda x: order.get(x[0], 999))
                chosen = featured[0]
            else:
                cat = detect_category(html)
                if cat:
                    chosen = EQUIPMENT_GUIDE[cat]
            if chosen:
                adds.append(chosen)

        result[p] = adds
    return result


def apply(paths, planned):
    changed = 0
    for p in paths:
        adds = planned.get(p, [])
        src = open(p, encoding="utf-8").read()
        html = strip_autolinks(src)
        if adds:
            i = html.find('<div class="related-links">')
            if i == -1:
                print("  ! related-links ブロックなし:", os.path.relpath(p, ROOT))
                continue
            j = html.find("</div>", i)
            # 閉じ div の直前の行頭インデントを保持したまま挿入する
            k = html.rfind("\n", i, j)
            indent = html[k + 1 : j] if k != -1 else ""
            inner = re.search(r'\n([ \t]*)<a ', html[i:j])
            pad = inner.group(1) if inner else indent + "  "
            block = "".join(
                '%s<a href="../%s" class="rel-btn" data-autolink="1">%s</a>\n' % (pad, u, l)
                for u, l in adds
            )
            html = html[: k + 1] + block + html[k + 1 :]
        if html != src:
            open(p, "w", encoding="utf-8").write(html)
            changed += 1
    return changed


def verify(paths):
    """生成した全リンクの実在確認"""
    broken = []
    total = 0
    for p in paths:
        html = open(p, encoding="utf-8").read()
        for href in re.findall(r'href="(\.\./[^"]+)" class="rel-btn" data-autolink="1"', html):
            total += 1
            target = os.path.normpath(os.path.join(os.path.dirname(p), href))
            if not os.path.exists(target):
                broken.append((os.path.relpath(p, ROOT), href))
    return total, broken


def verify_guides():
    """guides→species で生成したリンクの実在確認"""
    broken = []
    for fp in sorted(glob.glob(os.path.join(ROOT, "guides", "*.html"))):
        html = open(fp, encoding="utf-8").read()
        for href in re.findall(
            r'href="(\.\./species/[^"]+)" class="related-card" data-autolink="1"', html
        ):
            target = os.path.normpath(os.path.join(os.path.dirname(fp), href))
            if not os.path.exists(target):
                broken.append((os.path.relpath(fp, ROOT), href))
    return broken


def measure_dir(d):
    """<dir>→species のリンク状況"""
    v = []
    for fp in sorted(glob.glob(os.path.join(ROOT, d, "*.html"))):
        html = open(fp, encoding="utf-8").read()
        v.append(len(re.findall(r'href="[^"]*species/', html)))
    return dict(
        linked=sum(1 for x in v if x > 0),
        pages=len(v),
        median=statistics.median(v),
        total=sum(v),
    )


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "--check"
    paths = species_pages()
    guides_idx, compare_idx = build_reverse_index()

    before = measure(paths)
    planned = plan(paths, guides_idx, compare_idx)

    print("対象 species ページ: %d" % len(paths))
    print("逆引き: guides掲載種=%d / compare対象種=%d" % (len(guides_idx), len(compare_idx)))
    print("追加予定リンク総数: %d" % sum(len(v) for v in planned.values()))

    if mode == "--apply":
        changed = apply(paths, planned)
        gplan = build_guide_species_plan()
        gchanged, gtotal = apply_guide_cards(gplan)
        after = measure(paths)
        total, broken = verify(paths)
        gb = verify_guides()
        print("更新ファイル数: species %d / guides %d" % (changed, gchanged))
        print("生成リンク総数: species→ %d / guides→species %d" % (total, gtotal))
        print("壊れたURL: %d" % (len(broken) + len(gb)))
        for b in broken + gb:
            print("  BROKEN:", b)
        print("\n--- 実装前 → 実装後 ---")
        for k in ("guides", "compare"):
            b, a = before[k], after[k]
            print("species→%s:" % k)
            print("  リンク有ページ数: %d → %d" % (b["linked"], a["linked"]))
            print("  0件ページ数:      %d → %d" % (b["zero"], a["zero"]))
            print("  中央値:           %g → %g" % (b["median"], a["median"]))
            print("  総リンク数:       %d → %d" % (b["total"], a["total"]))
        print("guides→species: %s" % (measure_dir("guides"),))
        return 1 if (broken or gb) else 0
    else:
        print("\n--- 現状 ---")
        for k in ("guides", "compare"):
            print("species→%s: %s" % (k, before[k]))
    return 0


if __name__ == "__main__":
    sys.exit(main())
