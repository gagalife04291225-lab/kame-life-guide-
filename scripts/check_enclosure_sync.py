#!/usr/bin/env python3
"""species ページの「終生飼育に必要な水槽の目安」を data/species-master.json と照合する。

species-master.json の care.enclosure_jp が飼育条件の唯一の正本（care_schema.purpose）。
種ページの手入力値が正本とずれたら非ゼロ終了する。

使い方:
    python3 scripts/check_enclosure_sync.py
"""
import glob
import json
import re
import sys

LS_LEAD = re.compile(
    r'ls-lead">この種の終生飼育に必要な水槽の目安：<strong>(.*?)</strong>'
)
# 正本の値には社内向けの根拠が括弧で付くことがある（例: 海外24インチ推奨が国内規格へほぼ一致）。
# 読者向け表示では落とす。
INTERNAL_PAREN = re.compile(r'（[^）]*(?:インチ|㎡|一致|上回る)[^）]*）')


def display_value(raw: str) -> str:
    return INTERNAL_PAREN.sub('', raw).strip()


def main() -> int:
    master = json.load(open('data/species-master.json', encoding='utf-8'))
    by_slug = {s['slug']: s for s in master['species']}

    matched = []
    mismatched = []
    page_missing = []
    master_missing = []

    for path in sorted(glob.glob('species/*.html')):
        slug = path.split('/')[-1][:-5]
        if 'template' in slug:
            continue
        text = open(path, encoding='utf-8').read()
        hit = LS_LEAD.search(text)
        entry = by_slug.get(slug)
        enclosure = (entry.get('care') or {}).get('enclosure_jp') if entry else None
        master_value = enclosure.get('value') if enclosure else None

        if not master_value:
            if hit:
                master_missing.append((slug, hit.group(1)))
            continue
        if not hit:
            page_missing.append(slug)
            continue

        expected = display_value(master_value)
        if hit.group(1) == expected:
            matched.append(slug)
        else:
            mismatched.append((slug, hit.group(1), expected))

    print(f'一致: {len(matched)}')
    print(f'不一致: {len(mismatched)}')
    print(f'ページ側に記載なし（正本には値あり）: {len(page_missing)}')
    print(f'正本に値なしだがページに値あり（推測値の疑い）: {len(master_missing)}')

    for slug, page, expected in mismatched:
        print(f'  NG {slug}: ページ「{page}」/ 正本「{expected}」')
    for slug, page in master_missing:
        print(f'  WARN {slug}: 正本 enclosure_jp 未登録なのにページに「{page}」')

    if mismatched:
        print('\n正本（data/species-master.json の care.enclosure_jp）に合わせてください。')
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
