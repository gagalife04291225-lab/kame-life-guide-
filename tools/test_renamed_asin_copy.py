"""Test the product-card text around four pre-existing Amazon destinations."""
from html.parser import HTMLParser
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
FOREST = 'B00JZFJ5LQ'
DESERT = 'B00JZFJ5R0'
PAGES = ('guide-beginner.html', 'cage-best10.html',
         'species/hermann-dry-template.html', 'species/pink-bellied-template.html',
         'species/three-toed-box-template.html')

def source(path):
    return (ROOT / path).read_text(encoding='utf-8')

class ProductHTML(HTMLParser):
    def __init__(self, code):
        super().__init__()
        self.links = []
        self.active = None
        self.feed(code)

    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            self.active = (dict(attrs), [])
            self.links.append(self.active)

    def handle_endtag(self, tag):
        if tag == 'a':
            self.active = None

    def handle_data(self, data):
        if self.active:
            self.active[1].append(data)

def article_before_link(path, asin, start):
    body = source(path)
    where = body.index(asin)
    return body[body.rindex(start, 0, where):where]

class RenamedASINCopy(unittest.TestCase):
    def test_beginner_cards_use_actual_spiral_names(self):
        for bulb, name in ((FOREST,'フォレスト'), (DESERT,'デザート')):
            with self.subTest(asin=bulb):
                card = article_before_link(PAGES[0], bulb, '<div class="gear-card">')
                self.assertIn(f'ビバリア スパイラルUVB {name} 26W', card)
                self.assertNotRegex(card, r'(?:5|10|12)%')
                self.assertIn('設置距離', card)
        self.assertIn('26Wは消費電力', source(PAGES[0]))

    def test_templates_do_not_assert_uvb_percent_or_uvi_from_spiral_label(self):
        for page, asin in zip(PAGES[2:], (DESERT, FOREST, FOREST)):
            with self.subTest(page=page):
                card = article_before_link(page, asin, '<div class="gear-card">')
                self.assertIn('26Wは消費電力', card)
                self.assertNotRegex(card, r'(?:5|10|12)%|UVI\s*[\d.]|6〜12ヶ月')
                self.assertNotRegex(source(page), r'フォレスト5%タイプ推奨|砂漠用UVBランプ（デザート10%）が必須')
                self.assertIn('メーカーの案内', card)

    def test_wh9045_card_spec_not_resin_or_back_opening(self):
        card = article_before_link(PAGES[1], 'B00M2P5DIK', '<div class="item">')
        for fact in ('組立式ガラスケージ', '外寸90.5×45.5×45cm',
                     '内部空間は約89×44×42cm', '2分割の天井パネル',
                     '設備を置いたあとに使える床面積'):
            self.assertIn(fact, card)
        self.assertNotRegex(card, r'樹脂パネル|前後・上部開放|軽量|ガラスより軽い')

    def test_targeted_ctas_keep_destinations_and_tracking(self):
        for page, asin in ((PAGES[0], FOREST), (PAGES[0], DESERT),
                           (PAGES[2], DESERT), (PAGES[3], FOREST), (PAGES[4], FOREST)):
            with self.subTest(page=page, asin=asin):
                items = ProductHTML(source(page)).links
                links = [attrs for attrs, _ in items if asin in attrs.get('href', '')]
                self.assertEqual(len(links), 1)
                self.assertEqual(links[0]['href'], f'https://www.amazon.co.jp/dp/{asin}?tag=kamelife090e-22')
                self.assertIn('sponsored', links[0]['rel'].split())
                if page == PAGES[0]:
                    self.assertEqual(links[0].get('data-commerce-static'), '1')
        links = [attrs for attrs, _ in ProductHTML(source(PAGES[1])).links
                 if attrs.get('data-asin') == 'B00M2P5DIK']
        self.assertEqual(len(links), 1)
        self.assertIn('amazon-btn', links[0]['class'].split())

    def test_correct_comparison_product_links_stay_paired(self):
        for asin, label in ((FOREST, 'スパイラルUVB フォレスト 26W'),
                            (DESERT, 'スパイラルUVB デザート 26W'),
                            ('B00AQU8HAO', 'OS5-24')):
            card = article_before_link('uvb-light-best10.html', asin, '<div class="item">')
            self.assertIn(label, card)
        self.assertEqual(source('cage-review.html').count('B00M2P5DIK'), 2)
        self.assertIn("asin: 'B00AQU8HAO'", source('data/products.js'))
