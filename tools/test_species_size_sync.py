#!/usr/bin/env python3
"""診断ツールの「最大甲長」表示と正本・記事の数値がずれていないかを確かめる。

背景（PR #216 のレビュー指摘）:
  shindan/index.html の結果画面は coreSpecs.size を「最大甲長」として表示し、
  coreSpecs が無いときだけ旧形式 specs['最大甲長'] を使う。
  旧形式だけを直して coreSpecs を直し忘れると、画面には古い値が出る。

検査:
  1. 同じレコードの coreSpecs.size と specs['最大甲長'] の上限値が一致すること
     （既知の不一致は KNOWN_DIVERGENCE に固定。新しい不一致が増えたら失敗）
  2. 「大きくならない亀7種」記事の7種は、coreSpecs.size・specs['最大甲長']・
     species-master の max_shell_length_cm が 0.5cm 以内で一致し、
     記事の「資料に残る上限」列にも同じ値が出ていること

使い方:
    python3 -m unittest discover -s tools -p 'test_*.py'
"""
import json
import os
import re
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 2026-11-12 時点で既に食い違っていた種（本テスト追加時の実測）。
# 直したらここから消す。ここへ新しく足すのは、食い違いを意図して残すと Owner が判断したときだけ。
KNOWN_DIVERGENCE = {
    'チェリーヘッドアカアシリクガメ',
}

# guides/small-best-turtles.html の比較表に載る7種
SMALL_GUIDE = {
    'spenglers-leaf-turtle': 'スペングラーヤマガメ',
    'musk-turtle': 'ミシシッピニオイガメ',
    'razorback-musk-turtle': 'カブトニオイガメ',
    'florida-box-turtle': 'フロリダハコガメ',
    'white-lipped-mud-turtle': 'シロクチドロガメ',
    'japanese-pond-turtle': 'ニホンイシガメ',
    'russian-tortoise': 'ロシアリクガメ',
}

NUM = re.compile(r'\d+(?:\.\d+)?')


def upper(text):
    """文字列中の数値の最大値（小数を1つの数として読む）。"""
    nums = [float(n) for n in NUM.findall(text or '')]
    return max(nums) if nums else None


def species_records():
    raw = open(os.path.join(ROOT, 'shindan', 'species.js'), encoding='utf-8').read()
    # レコードは行頭 "  { name: '" で始まる。非貪欲 regex で隣のレコードに誤帰属させないよう分割する
    starts = [m.start() for m in re.finditer(r"\n  \{ name: '", raw)] + [len(raw)]
    out = []
    for a, b in zip(starts, starts[1:]):
        seg = raw[a:b]
        name = re.search(r"name: '([^']+)'", seg).group(1)
        slug = re.search(r"slug: '([^']+)'", seg)
        core = re.search(r"coreSpecs:\s*\{[^}]*?size: '([^']*)'", seg)
        reason = re.search(r"reason: '([^']*)'", seg)
        tank = re.search(r"tankSize: '([^']*)'", seg)
        tank_legacy = re.search(r"'水槽サイズ': '([^']*)'", seg)
        note = re.search(r"sizeNote: '([^']*)'", seg)
        legacy = re.search(r"'最大甲長': '([^']*)'", seg)
        out.append({
            'name': name,
            'slug': slug.group(1) if slug else None,
            'core': core.group(1) if core else None,
            'legacy': legacy.group(1) if legacy else None,
            'reason': reason.group(1) if reason else '',
            'tank': tank.group(1) if tank else None,
            'tank_legacy': tank_legacy.group(1) if tank_legacy else None,
            'note': note.group(1) if note else None,
        })
    return out


class SpeciesSizeSync(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.records = species_records()
        master = json.load(open(os.path.join(ROOT, 'data', 'species-master.json'), encoding='utf-8'))
        cls.master = {s['slug']: s for s in master['species']}
        cls.article = open(os.path.join(ROOT, 'guides', 'small-best-turtles.html'), encoding='utf-8').read()

    def test_parser_found_records(self):
        self.assertGreater(len(self.records), 100)

    def test_core_and_legacy_agree(self):
        new = []
        for r in self.records:
            if r['core'] and r['legacy'] and r['name'] not in KNOWN_DIVERGENCE:
                if upper(r['core']) != upper(r['legacy']):
                    new.append((r['name'], r['core'], r['legacy']))
        self.assertEqual(new, [], 'coreSpecs.size と specs["最大甲長"] が食い違っている（画面は coreSpecs を表示する）')

    def test_small_guide_species(self):
        by_slug = {r['slug']: r for r in self.records if r['slug']}
        for slug, name in SMALL_GUIDE.items():
            with self.subTest(slug=slug):
                rec = by_slug.get(slug)
                self.assertIsNotNone(rec, 'species.js に slug がない')
                self.assertEqual(rec['name'], name)
                mx = self.master[slug]['max_shell_length_cm']
                self.assertIn(mx.get('verification'), ('CONFIRMED', 'LIKELY'))
                want = float(mx['value'])
                for field in ('core', 'legacy'):
                    got = upper(rec[field])
                    self.assertIsNotNone(got, field)
                    self.assertLessEqual(abs(got - want), 0.5, '%s %s=%s / master=%s' % (name, field, rec[field], want))
                # 記事のサイズ表: 種名の行にある「資料に残る上限」セル（3列目）
                row = re.search(r'<tr>\s*<td class="cmp-name"><a href="\.\./species/%s\.html">.*?</tr>' % re.escape(slug),
                                self.article, re.S)
                self.assertIsNotNone(row, '記事のサイズ表に行がない')
                cells = re.findall(r'<td[^>]*>(.*?)</td>', row.group(0), re.S)
                limit_cell = re.sub(r'<a class="src-ref"[^>]*>\[\d+\]</a>', '', cells[2])
                limit_cell = re.sub(r'<span class="cmp-sub">.*?</span>', '', limit_cell, flags=re.S)
                self.assertLessEqual(abs(upper(limit_cell) - want), 0.5, '%s 記事=%s / master=%s' % (name, limit_cell, want))


    def test_small_guide_notes_and_space(self):
        """7種は「最大甲長」の注記を持ち、診断の容器の説明が正本の成体向け目安を下回らない。"""
        by_slug = {r['slug']: r for r in self.records if r['slug']}
        # 「45cm水槽」「30〜45cm水槽」「90cm級ケージ」「50cm程度のケージ」などの容器サイズ
        tank_re = re.compile(r'(\d+)(?:〜(\d+))?cm.{0,4}?(?:水槽|ケージ|から)')
        for slug, name in SMALL_GUIDE.items():
            with self.subTest(slug=slug):
                rec = by_slug[slug]
                self.assertTrue(rec['note'], '%s に sizeNote がない' % name)
                self.assertIn('一般的な成体', rec['note'])
                enc = self.master[slug]['care']['enclosure_jp']['value']
                enc = re.sub(r'（[^）]*インチ[^）]*）', '', enc)  # 正本の社内向け注記（インチ換算）を除く
                floor = min(int(n) for n in re.findall(r'\d+', enc))
                sizes = []
                for m in tank_re.finditer(rec['reason']):
                    sizes += [int(x) for x in m.groups() if x]
                for field in ('tank', 'tank_legacy'):
                    if rec[field]:
                        sizes += [int(n) for n in re.findall(r'\d+', rec[field])]
                for v in sizes:
                    self.assertGreaterEqual(v, floor, '%s: 診断の容器説明 %scm が正本「%s」の下限 %scm を下回る' % (name, v, enc, floor))


if __name__ == '__main__':
    unittest.main()
