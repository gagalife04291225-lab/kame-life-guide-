#!/usr/bin/env python3
"""「成長と容器の見直し」の案内が壊れたり、矛盾した基準が戻ったりしていないかを確かめる。

検査:
  1. 陸ガメ・半陸生（ls-lead が「水槽」以外）の種ページに、水棲向けの
     「容器の長辺は甲長の約4倍」の注記が出ていない（正本ルールは陸生×5で、根拠も別）
  2. /kid/ に JS なしで読める「成長と容器の見直し」節（id="growth"）があり、
     見直しのサイン・甲長の測り方・外貼りメジャーの注意を含む。購入リンクは置かない
  3. 入口ページから /kid/#growth への案内が実在する
  4. 案内文に「○か月で買い替え」型の断定や、餌を減らして成長を抑える案内がない

使い方:
    python3 -m unittest discover -s tools -p 'test_*.py'
"""
import glob
import os
import re
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LS = re.compile(r'ls-lead">この種の終生飼育(?:に必要な(水槽|ケージ（テラリウム）|ケージ|容器)の目安|について)')
AQUATIC_NOTE = '容器の長辺は甲長の約4倍'


def read(rel):
    return open(os.path.join(ROOT, rel), encoding='utf-8').read()


def growth_section():
    t = read('kid/index.html')
    m = re.search(r'<section class="kid-sec" id="growth".*?</section>', t, re.S)
    return m.group(0) if m else ''


class GrowthGuidance(unittest.TestCase):
    def test_land_pages_have_no_aquatic_multiplier(self):
        bad = []
        land = 0
        for f in sorted(glob.glob(os.path.join(ROOT, 'species', '*.html'))):
            if 'template' in f:
                continue
            t = open(f, encoding='utf-8').read()
            m = LS.search(t)
            if m and m.group(1) != '水槽':
                land += 1
                if AQUATIC_NOTE in t:
                    bad.append(os.path.basename(f))
        self.assertGreater(land, 30)
        self.assertEqual(bad, [], '陸系ページに水棲向けの「甲長の約4倍」注記が残っている')

    def test_kid_growth_section_is_static_and_complete(self):
        s = growth_section()
        self.assertTrue(s, '/kid/ に id="growth" の節がない')
        for phrase in ('見直しのサイン', '甲長の測り方', '頭と尾を含めず', 'まっすぐ',
                       '水槽の外に貼る目盛り', '目安', '餌を減らし', 'すぐに今の環境を直す',
                       '（水棲ガメ）', '（リクガメ・ハコガメ）'):
            self.assertIn(phrase, s)
        self.assertNotIn('amazon.co.jp', s)
        self.assertNotIn('rakuten', s)
        self.assertNotIn('kamelife090e-22', s)
        # 出典番号は本文の参照と一覧で対応している
        refs = set(re.findall(r'href="#(gr-src-\d+)"', s))
        ids = set(re.findall(r'id="(gr-src-\d+)"', s))
        self.assertTrue(refs)
        self.assertEqual(refs - ids, set())

    def test_first_answer_separates_aquatic_and_land(self):
        s = growth_section()
        ans = re.search(r'<div class="gr-answer">(.*?)</div>', s, re.S).group(1)
        self.assertIn('水棲ガメ', ans)
        self.assertIn('リクガメ・ハコガメ', ans)
        self.assertIn('species-list.html', ans)
        # 当たり前の禁止を重ねない（外貼り目盛りの説明）
        self.assertNotIn('追いかけて', s)
        small = read('guides/small-best-turtles.html')
        part = small[small.index('id="from-hatchling"'):][:900]
        self.assertIn('水棲ガメ', part)
        self.assertIn('リクガメ・ハコガメ', part)

    def test_kid_wording_matches_function(self):
        # KID は甲長の区分で候補を絞るだけ。種への適合・安全を判定するような表現をしない
        kid = read('kid/index.html') + read('js/kid-lookup.js')
        for bad in ('今使えるもの', 'うちの子に合うものだけ', '今使えるかを見る'):
            self.assertNotIn(bad, kid)
        self.assertIn('kid-howto', read('kid/index.html'))
        self.assertNotIn('安全判定', read('index.html'))
        for f in sorted(glob.glob(os.path.join(ROOT, 'species', '*.html'))):
            t = open(f, encoding='utf-8').read()
            self.assertNotIn('KID 安全判定', t, os.path.basename(f))

    def test_ranking_breathing_is_fixed_now(self):
        t = read('ranking-beginner-top10.html')
        self.assertNotIn('水面まで行きにくそうになったら次の水槽', t)
        self.assertIn('買い替えを待たずに今の水位と足場を直す', t)

    def test_entry_points_link_to_growth(self):
        for rel in ('guides/small-best-turtles.html', 'species/musk-turtle.html',
                    'ranking-beginner-top10.html', 'guides/keeper-hacks.html',
                    'species/russian-tortoise.html'):
            with self.subTest(page=rel):
                self.assertRegex(read(rel), r'href="(?:\.\./)?kid/index\.html#growth"')
        self.assertIn('href="#growth"', read('kid/index.html'))

    def test_no_month_based_replacement_or_food_restriction(self):
        texts = [growth_section(), read('guides/small-best-turtles.html')]
        for t in texts:
            plain = re.sub(r'<[^>]+>', '', t)
            self.assertNotRegex(plain, r'\d+\s*(?:か|ヶ|カ)月で(?:買い替え|広げ)')
            self.assertNotRegex(plain, r'餌を(?:減らして|控えて)(?:成長|大きさ)を(?:抑え|調整)(?:ましょう|てください)')

    def test_musk_depth_is_shallow_not_30cm(self):
        t = read('species/musk-turtle.html')
        card = re.search(r'<div class="env-label">水深</div>\s*<div class="env-value">([^<]*)</div>', t)
        self.assertIsNotNone(card)
        self.assertNotIn('30cm', card.group(1))
        # 45cm を全成体の最低基準として断定しない／水深を唯一の基本と断定しない
        self.assertNotIn('最低ラインは45cm', t)
        self.assertNotIn('成体の最低ライン', t)
        self.assertNotIn('水面に届く深さが基本', t)
        self.assertNotIn('甲長11cmを超えたら60cm', t)
        self.assertIn('科学的に確定した最低基準ではありません', t)
        self.assertNotIn('甲長×4', t)


if __name__ == '__main__':
    unittest.main()
