#!/usr/bin/env python3
"""近似種比較表の「必要環境」列を data/species-master.json と照合する。

species-master.json の care.enclosure_jp が飼育条件の唯一の正本（care_schema.purpose）。
比較表のセルは表示都合で短く書くため文字列一致では見られない。ここでは
**正本の必要サイズを下回る表示（＝矛盾）だけ**を検出し、見つかれば非ゼロ終了する。

`check_enclosure_sync.py` が ls-lead（終生飼育の目安）を見るのに対し、本スクリプトは
同じ正本を比較表の全行（自種行・他種行の両方）へ適用する。

使い方:
    python3 scripts/check_compare_enclosure.py
"""
import glob
import json
import re
import sys

SPACE_TH = re.compile(r'必要(?:ケージ|スペース|水槽|環境)$')
OUTDOOR = re.compile(r'屋外|飼育場|池|㎡|施設')
# 正本の文中には甲長が混ざる（例「成体（メス25cm級）は90cm以上」）。容器サイズは国内規格の
# 階梯しか取らないため、規格外の数値は容器サイズとして採用しない。
BODY = re.compile(r'甲長[0-9〜～\-]+(?:cm|ｃｍ)')
RANGE = re.compile(r'(\d+)\s*[〜~]\s*(\d+)\s*cm')
STD_SIZES = {30, 45, 60, 75, 90, 120, 150, 180}


def master_sizes(text):
    """正本の文字列から (最小, 最大, 屋外要否) を取り出す。数値が無ければ (None, None, 屋外要否)。"""
    t = BODY.sub('', text)
    nums = [int(n) for n in re.findall(r'(\d+)\s*cm', t)]
    for a, b in RANGE.findall(t):
        nums += [int(a), int(b)]
    nums = [n for n in nums if n in STD_SIZES]
    outdoor = bool(OUTDOOR.search(t))
    return (min(nums), max(nums), outdoor) if nums else (None, None, outdoor)


def main() -> int:
    master = json.load(open('data/species-master.json', encoding='utf-8'))
    mval = {s['slug']: ((s.get('care') or {}).get('enclosure_jp') or {}).get('value')
            for s in master['species']}

    ok = 0
    conflicts = []
    unjudged = []

    for path in sorted(glob.glob('species/*.html')):
        slug = path.split('/')[-1][:-5]
        if 'template' in slug:
            continue
        text = open(path, encoding='utf-8').read()
        for tbl in re.findall(r'<table class="compare-table">(.*?)</table>', text, re.S):
            head = re.search(r'<thead>.*?</thead>', tbl, re.S)
            if not head:
                continue
            ths = [re.sub('<.*?>', '', t).strip()
                   for t in re.findall(r'<th>(.*?)</th>', head.group(0), re.S)]
            cols = [i for i, t in enumerate(ths) if SPACE_TH.match(t)]
            if not cols:
                continue
            col = cols[0]
            body = tbl.split('</thead>', 1)[1]
            for tr in re.findall(r'<tr.*?</tr>', body, re.S):
                tds = re.findall(r'<td>(.*?)</td>', tr, re.S)
                if len(tds) <= col:
                    continue
                first = tds[0]
                link = re.search(r'href="([a-z0-9\-]+)\.html"', first)
                target = link.group(1) if link else (
                    slug if ('このページ' in first or 'badge-rec' in tr) else None)
                if target is None:
                    continue
                cell = re.sub('<.*?>', '', tds[col]).strip()
                mv = mval.get(target)
                if not mv:
                    unjudged.append((path, target, cell, '正本に値なし'))
                    continue
                lo, hi, outdoor = master_sizes(mv)
                cnums = [int(n) for n in re.findall(r'(\d+)\s*cm', cell)]
                if hi is None:
                    if outdoor and OUTDOOR.search(cell):
                        ok += 1
                    else:
                        unjudged.append((path, target, cell, '正本に数値なし'))
                    continue
                if OUTDOOR.search(cell) and not cnums:
                    ok += 1
                    continue
                if not cnums:
                    conflicts.append((path, target, cell, mv, 'セルに数値なし'))
                    continue
                if max(cnums) < hi:
                    conflicts.append((path, target, cell, mv, f'過小 {max(cnums)}<{hi}'))
                else:
                    ok += 1

    print(f'一致: {ok}')
    print(f'矛盾: {len(conflicts)}')
    print(f'判定不能（正本に値または数値がない）: {len(unjudged)}')
    for path, target, cell, why in unjudged:
        print(f'  SKIP {path} / {target}: 「{cell}」（{why}）')
    for path, target, cell, mv, why in conflicts:
        print(f'  NG {path} / {target}: 表「{cell}」 対 正本「{mv}」（{why}）')
    return 1 if conflicts else 0


if __name__ == '__main__':
    sys.exit(main())
