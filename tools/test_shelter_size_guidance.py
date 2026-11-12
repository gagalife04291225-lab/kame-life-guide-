"""Regression checks for the scoped Spengler/shelter correction.

Run: python -m unittest discover -s tools -p test_shelter_size_guidance.py -v
These checks do not certify product fit or the other product descriptions.
"""
import html
import json
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / 'shelter-best10.html').read_text(encoding='utf-8')
TFTSG = 'https://iucn-tftsg.org/wp-content/uploads/file/Accounts/crm_5_047_spengleri_v1_2010.pdf'
NATURALIS = 'https://turtles.linnaeus.naturalis.nl/linnaeus_ng/app/views/species/taxon.php?id=8063'


def card(asin):
    for item in re.split(r'<div class="item">', HTML)[1:]:
        if 'data-asin="' + asin + '"' in item:
            return item
    raise AssertionError('Product card not found: ' + asin)


def plain(value):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', '', value))).strip()


class ShelterSizeGuidance(unittest.TestCase):
    def test_species_sources_and_range_are_distinguished(self):
        paragraph = re.search(r'<p id="spengler-size">(.*?)</p>', HTML, re.S)
        self.assertIsNotNone(paragraph)
        text = paragraph.group(1)
        for required in ('おおむね7〜11cm', '約10.7cm', '13cm', '甲長の有意な雌雄差',
                         '11cmを絶対的な上限とはせず', TFTSG, NATURALIS):
            self.assertIn(required, text)
        for obsolete in ('成体で甲長11〜13cm', '成体甲長11〜13cm', '甲長12cm前後', 'メスはさらに大きく'):
            self.assertNotIn(obsolete, HTML)

    def test_intro_requires_actual_body_and_entrance_measurements(self):
        intro = re.search(r'<section class="intro">(.*?)</section>', HTML, re.S).group(1)
        for required in ('甲幅・甲高', '入口の幅・高さ', '内部の奥行・幅・高さ', '成長に合わせて見直す'):
            self.assertIn(required, intro)
        self.assertNotIn('今の体の大きさ」で選んでしまう', intro)
        self.assertNotIn('必ず<strong>成体の甲長・甲幅で選ぶ', intro)

    def test_three_product_cards_do_not_guarantee_fit(self):
        for asin in ('B07F49T8N2', 'B004KUYSH2', 'B00E0GM8JG'):
            with self.subTest(asin=asin):
                text = card(asin)
                self.assertIn('内寸・入口要確認', text)
                self.assertIn('入口の幅・高さと内部の奥行・幅・高さは、まだ確認できていません', text)
                for obsolete in ('成体対応', 'まず大きさで困りません', '余裕をもって全身を隠せます',
                                 '甲長8cm前後まで', '甲長10cm前後まで', '甲長13cm以上',
                                 '成体はこのサイズでは入れない', '入れるサイズです'):
                    self.assertNotIn(obsolete, text)

    def test_product_dimension_labels_are_retained(self):
        for asin, dimensions in (
            ('B07F49T8N2', '本体約26×29×15.5cm'),
            ('B004KUYSH2', 'W17×D9×H5.5cm'),
            ('B00E0GM8JG', 'W23.5×D15×H6.5cm'),
        ):
            self.assertIn('<span>' + dimensions + '</span>', card(asin))

    def test_metadata_and_article_schema_agree(self):
        meta = re.search(r'<meta name="description" content="([^"]+)"', HTML).group(1)
        og = re.search(r'<meta property="og:description" content="([^"]+)"', HTML).group(1)
        schemas = [json.loads(x) for x in re.findall(r'<script type="application/ld\+json">(.*?)</script>', HTML, re.S)]
        article = next(n for s in schemas for n in s.get('@graph', []) if n.get('@type') == 'Article')
        self.assertEqual(meta, og)
        self.assertEqual(meta, article['description'])
        self.assertIn('入口と内寸', meta)
        self.assertNotIn('成体が余裕で入る', meta)

    def test_comparison_article_and_faq_retain_source_distinction(self):
        guide = (ROOT / 'guides/small-best-turtles.html').read_text(encoding='utf-8')
        self.assertIn('7〜11cm', guide)
        self.assertIn('10.7cm', guide)
        self.assertIn('13cmとする図鑑もある', guide)
        for url in (TFTSG, NATURALIS):
            self.assertIn(url, guide)
        visible = [plain(x) for x in re.findall(r'<div class="faq-a">(.*?)</div>', guide, re.S)]
        schemas = [json.loads(x) for x in re.findall(r'<script type="application/ld\+json">(.*?)</script>', guide, re.S)]
        nodes = [n for s in schemas for n in (s.get('@graph', [s]) if isinstance(s, dict) else s)]
        faq = next(n for n in nodes if n.get('@type') == 'FAQPage')
        self.assertEqual(visible, [plain(q['acceptedAnswer']['text']) for q in faq['mainEntity']])

    def test_amazon_sequence_and_tracking_are_retained(self):
        self.assertEqual(re.findall(r'data-asin="([^"]+)"', HTML), [
            'B00O0QMK2Q', 'B00O0QM6H0', 'B07ZMC69P7', 'B07F49T8N2',
            'B07F3SR326', 'B07F3RVTXP', 'B07F3L16ZR', 'B079L7M5RW',
            'B07B8J9FYS', 'B0BSND3GBP', 'B09QH9315W', 'B004KUYSH2',
            'B00E0GM8JG', 'B09129F675'])
        self.assertIn('var TAG = "kamelife090e-22";', HTML)
        self.assertIn("gtag('config','G-QQTE5CVF3K')", HTML)
        self.assertIn('src="/js/affiliate-track-static.js"', HTML)


if __name__ == '__main__':
    unittest.main()
