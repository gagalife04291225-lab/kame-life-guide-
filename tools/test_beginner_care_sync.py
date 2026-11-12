#!/usr/bin/env python3
"""Safety regressions for the two beginner rankings and common musk care article.

Run: python3 -m unittest discover -s tools -p 'test_beginner_care_sync.py'
These check published claims/schema consistency, not animal-specific suitability.
"""
from pathlib import Path
import html
import json
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]
PAGES = ('ranking-beginner-top10.html', 'guides/beginner-top10-turtles.html', 'species/musk-turtle.html')

def plain(text):
    return re.sub(r'\s+', '', html.unescape(re.sub(r'<[^>]*>', '', text)))

def schemas(text):
    return [json.loads(s) for s in re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', text, re.S)]

def nodes(items):
    for item in items:
        yield item
        yield from item.get('@graph', [])

class BeginnerCareSync(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pages = {p: (ROOT / p).read_text() for p in PAGES}
        cls.musk = cls.pages[PAGES[-1]]

    def test_json_ld_and_faq_match(self):
        total = 0
        for path, text in self.pages.items():
            with self.subTest(page=path):
                faqs = [n for n in nodes(schemas(text)) if n.get('@type') == 'FAQPage']
                if path == 'guides/beginner-top10-turtles.html':
                    self.assertEqual(len(faqs), 0)  # this guide has no FAQ block
                    continue
                self.assertEqual(len(faqs), 1)
                visible = re.findall(r'<div class="faq-(?:a|body)">(.*?)</div>', text, re.S)
                structured = [x['acceptedAnswer']['text'] for x in faqs[0]['mainEntity']]
                self.assertEqual([plain(x) for x in visible], [plain(x) for x in structured])
                total += len(visible)
        self.assertEqual(total, 13)

    def test_musk_size_not_confused_with_record(self):
        self.assertIn('成体5〜12cm（記録13.7cm）', self.musk)
        self.assertIn('最大直甲長は13.7cm', self.musk)
        for stale in ('最大14cm', '10〜14cm', '45〜60cm', '30cm水槽', '甲長7cmまで30cm'):
            self.assertNotIn(stale, self.musk)

    def test_master_enclosure_matches_article(self):
        master = json.loads((ROOT / 'data/species-master.json').read_text())
        entry = next(s for s in master['species'] if s['slug'] == 'musk-turtle')
        value = entry['care']['enclosure_jp']['value']
        self.assertIn('45cmで開始', value)
        self.assertIn('成体は60cm以上', value)
        self.assertIn('単独・当サイト目安', value)
        lead = re.search(r'ls-lead">.*?<strong>(.*?)</strong>', self.musk).group(1)
        self.assertEqual(lead, value)
        self.assertIn('科学的に確定した最低基準ではありません', self.musk)
        self.assertIn('長さ100cm', self.musk)

    def test_musk_temperature_uvb_and_rest(self):
        self.assertEqual(self.musk.count('24〜26℃'), 4)
        for expected in ('約32℃', '毎日のUVB照射を推奨', '水面近くの休み場', '完全に体を乾かせる陸場', '光から逃げられる場所'):
            self.assertIn(expected, self.musk)
        for stale in ('なくても飼育は可能', 'ベビーは25〜28℃', 'UVB 5.0', '>10〜30cm<'):
            self.assertNotIn(stale, self.musk)

    def test_no_calendar_or_smell_only_water_safety(self):
        for expected in ('濁りや臭いが出るまで待たない', '水質検査', '塩素を処理', '水温差を小さく', '単独飼育を基本'):
            self.assertIn(expected, self.musk)
        for stale in ('毎日〜2日に1回の全換え', '水質管理さえ整えれば', '10分以内に食べ切れる量'):
            self.assertNotIn(stale, self.musk)

    def test_metadata_description_same(self):
        text = self.musk
        meta = re.search(r'<meta name="description" content="([^"]+)"', text).group(1)
        og = re.search(r'<meta property="og:description" content="([^"]+)"', text).group(1)
        article = next(n for n in nodes(schemas(text)) if n.get('@type') == 'Article')
        self.assertEqual(meta, og)
        self.assertEqual(meta, article['description'])
        self.assertIn('成体60cm以上', meta)

    def test_rankings_link_fixed_size_evidence(self):
        for path in PAGES[:2]:
            text = self.pages[path]
            self.assertIn('small-best-turtles.html#size', text)
            for record in ('13.7cm', '17.6cm'):
                self.assertIn(record, text)
            self.assertNotIn('終生45〜60cm', text)
            self.assertNotIn('終生飼育の目安は45〜60cm', text)

    def test_b_plan_growth_not_duplicated(self):
        self.assertIn('kid/index.html#growth', self.musk)
        self.assertNotIn('id="growth-tank"', self.musk)
        self.assertNotIn('id="measure-shell"', self.musk)
        self.assertNotIn('KID 安全判定', self.musk)

    def test_verified_care_sources_linked(self):
        for domain in ('rvc.ac.uk/Media/', 'treeoflifeexotics.vet/education-resource-center/', 'fishkeeper.co.uk/fish/', 'mass.gov/info-details/'):
            self.assertIn(domain, self.musk)
        self.assertIn('cage-best10.html#band-tank-60-90', self.musk)
        guide = self.pages['guides/beginner-top10-turtles.html']
        first_temperature = re.search(r'水温の目安</div><div class="spec-val">([^<]+)', guide)
        self.assertIsNotNone(first_temperature)
        self.assertEqual(first_temperature.group(1), '24〜26℃')

class EvidenceFollowup(unittest.TestCase):
    def test_no_fixed_age_forecast(self):
        for slug in ('wood-turtle', 'malayan-box-turtle', 'red-footed-tortoise', 'brown-wood-turtle-manni', 'nicaragua-wood-turtle', 'painted-wood-turtle'):
            text = (ROOT / 'species' / (slug + '.html')).read_text()
            self.assertNotRegex(text, r'(?:1年後の甲長|10年後は甲長|10年後でも甲長)')
            for schema in schemas(text):
                self.assertIsInstance(schema, (dict, list))

    def test_wood_has_no_categorical_illness_threshold(self):
        text = (ROOT / 'species/wood-turtle.html').read_text()
        for stale in ('22℃を超えると体調', '高水温（22℃超）', '25℃超）は危険'):
            self.assertNotIn(stale, text)
        self.assertIn('成体16〜25cm', text)

    def test_source_specific_maxima_and_diagnosis(self):
        master = json.loads((ROOT / 'data/species-master.json').read_text())
        items = {s['slug']: s for s in master['species']}
        self.assertEqual(items['red-footed-tortoise']['max_shell_length_cm']['value'], 60.0)
        self.assertEqual(items['wood-turtle']['max_shell_length_cm']['verification'], 'UNPROVEN')
        text = (ROOT / 'shindan/species.js').read_text()
        self.assertIn("'最大甲長': '60cm（資料値）'", text)
        self.assertIn("coreSpecs: { size: '60cm（資料値）'", text)
        self.assertIn("'最大甲長': '未確定（成体16〜25cm）'", text)

if __name__ == '__main__':
    unittest.main()
