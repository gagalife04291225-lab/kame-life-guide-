#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
docs/asin-audit.csv で「NG」と記入された ASIN を、Amazon 検索リンク形式へ置換する。

    https://www.amazon.co.jp/s?k=<商品名>&tag=kamelife09-22

■ 使い方
    python3 scripts/replace_dead_asin.py            # ドライラン（既定。1文字も書き換えない）
    python3 scripts/replace_dead_asin.py --apply    # 実際に書き換える

■ 前提
  - Owner が docs/asin-audit.csv の「検証状態」列を実機で確認して記入していること。
    NG と書かれた行だけを対象にする。空欄・NOT EVALUATED・OK は対象外。
  - 「代替」列に別の ASIN（10桁）が書かれている場合は、検索リンクではなく
    その ASIN の商品リンクへ差し替える。
  - 「代替」列に商品名が書かれている場合は、その文字列で検索リンクを作る。
    空欄なら「商品名」列を検索語に使う。

■ 置換する形
  1. HTML の直リンク            https://www.amazon.co.jp/dp/XXXX...  → 検索URL
  2. best10 系の data-asin      data-asin="XXXX"                     → data-search="<検索語>"
  3. data/products.js           affiliateUrl / asin                  → 検索URL / null
  4. shindan/equipment.js       asin: 'XXXX'                         → asin: null（label は残す）

  2 と 4 は JS 側の描画分岐に依存するため、--apply の前に必ず
  ローカルで表示を確認すること。このスクリプトは表示側の実装を変更しない。

■ 安全策
  - 既定はドライラン。--apply を付けたときだけ書き込む。
  - 追跡ID（kamelife09-22）は必ず維持する。ID が落ちる置換は行わない。
  - CSV に無い ASIN には触れない。
"""

import argparse
import csv
import glob
import os
import re
import sys
from urllib.parse import quote

TAG = 'kamelife09-22'
CSV_PATH = 'docs/asin-audit.csv'
ASIN_RE = re.compile(r'^[A-Z0-9]{10}$')


def search_url(term):
    """商品名から Amazon 検索URLを作る。追跡IDは必ず付ける。"""
    return 'https://www.amazon.co.jp/s?k=%s&tag=%s' % (quote(term, safe=''), TAG)


def product_url(asin):
    return 'https://www.amazon.co.jp/dp/%s?tag=%s' % (asin, TAG)


def load_targets(path):
    """CSV から「検証状態」が NG の行だけを読み、置換先を決める。"""
    if not os.path.exists(path):
        sys.exit('CSV が見つかりません: %s' % path)
    targets = {}
    with open(path, encoding='utf-8-sig', newline='') as fh:
        for row in csv.DictReader(fh):
            state = (row.get('検証状態') or '').strip().upper()
            if state != 'NG':
                continue
            asin = (row.get('ASIN') or '').strip()
            if not ASIN_RE.match(asin):
                print('  [skip] ASIN の形式が不正: %r' % asin)
                continue
            alt = (row.get('代替') or '').strip()
            name = (row.get('商品名') or '').strip()
            if ASIN_RE.match(alt):
                targets[asin] = ('asin', alt, product_url(alt))
            else:
                term = alt or name
                if not term:
                    print('  [skip] %s は商品名も代替も空欄のため検索語を作れない' % asin)
                    continue
                targets[asin] = ('search', term, search_url(term))
    return targets


def iter_files():
    seen = set()
    for pat in ('**/*.html', '**/*.js'):
        for p in glob.glob(pat, recursive=True):
            if 'node_modules' in p or p.startswith('scripts/'):
                continue
            if p not in seen:
                seen.add(p)
                yield p


def replace_in_text(text, asin, kind, term, url):
    """1つの ASIN について、4つの掲載形をまとめて置換する。"""
    n = 0

    # 1) 直リンク（/dp/ASIN ... ）
    pat = re.compile(r'https://www\.amazon\.co\.jp/dp/' + asin + r'[^"\'\s)]*')
    text, c = pat.subn(url, text)
    n += c

    # 2) data-asin（JS が /dp/ へ展開する）
    if kind == 'asin':
        text, c = re.subn(r'data-asin="%s"' % asin, 'data-asin="%s"' % term, text)
    else:
        text, c = re.subn(r'data-asin="%s"' % asin,
                          'data-search="%s"' % term.replace('"', '&quot;'), text)
    n += c

    # 3) JS データの asin フィールド
    if kind == 'asin':
        text, c = re.subn(r"asin:\s*'%s'" % asin, "asin: '%s'" % term, text)
    else:
        text, c = re.subn(r"asin:\s*'%s'" % asin, "asin: null", text)
    n += c

    return text, n


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--apply', action='store_true',
                    help='実際にファイルを書き換える（既定はドライラン）')
    ap.add_argument('--csv', default=CSV_PATH)
    args = ap.parse_args()

    targets = load_targets(args.csv)
    if not targets:
        print('検証状態が NG の行はありません。置換対象なし。')
        return

    print('置換対象 ASIN: %d 件' % len(targets))
    for asin, (kind, term, url) in sorted(targets.items()):
        print('  %s -> %s  %s' % (asin, kind, url))
    print()

    total_files = total_hits = 0
    for path in iter_files():
        original = open(path, encoding='utf-8').read()
        text = original
        hits = 0
        for asin, (kind, term, url) in targets.items():
            text, c = replace_in_text(text, asin, kind, term, url)
            hits += c
        if hits:
            total_files += 1
            total_hits += hits
            print('  %-52s %d 箇所' % (path, hits))
            if args.apply:
                open(path, 'w', encoding='utf-8').write(text)

    print()
    print('対象ファイル: %d / 置換箇所: %d' % (total_files, total_hits))
    if args.apply:
        print('書き換えました。git diff で差分を確認し、表示崩れがないか実機で確認してください。')
    else:
        print('ドライランです。1文字も書き換えていません。実行するには --apply を付けてください。')


if __name__ == '__main__':
    main()
