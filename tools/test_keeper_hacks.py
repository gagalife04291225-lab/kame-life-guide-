"""Keeper-hacks article structure and site integration regression checks."""
import unittest
import re
from pathlib import Path
from html.parser import HTMLParser
import xml.etree.ElementTree as ET
ROOT = Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.ids=[]; self.links=[]; self.tags=[]; self.feed(text)
    def handle_starttag(self,tag,attrs):
        a=dict(attrs); self.tags.append((tag,a))
        if 'id' in a:self.ids.append(a['id'])
        if tag=='a':self.links.append(a)
class KeeperHacks(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html=(ROOT/'guides/keeper-hacks.html').read_text(encoding='utf-8');cls.page=Page(cls.html)
    def test_eight_practical_tips(self):
        self.assertEqual(sum(t=='article' and a.get('class')=='tip' for t,a in self.page.tags),8)
        self.assertEqual(sum(t=='details' for t,a in self.page.tags),8)
        self.assertEqual(self.html.count('<summary>やり方を見る</summary>'),8)
    def test_fragment_targets(self):
        self.assertEqual(len(self.page.ids),len(set(self.page.ids)))
        for a in self.page.links:
            h=a.get('href','')
            if h.startswith('#'):self.assertIn(h[1:],self.page.ids)
    def test_existing_affiliate_links(self):
        amazon=[a for a in self.page.links if 'amazon.co.jp' in a.get('href','')]
        rakuten=[a for a in self.page.links if 'search.rakuten.co.jp' in a.get('href','')]
        self.assertEqual(len(amazon),4);self.assertEqual(len(rakuten),4)
        for a in amazon:self.assertIn('tag=kamelife090e-22',a['href'])
        for a in amazon+rakuten:self.assertEqual(a.get('rel'),'nofollow sponsored')
    def test_ga4_one_config(self):
        self.assertEqual(self.html.count("gtag('config','G-QQTE5CVF3K')"),1)
        self.assertEqual(self.html.count('gtag/js?id=G-QQTE5CVF3K'),1)
    def test_sitemap_unique(self):
        tree=ET.parse(ROOT/'sitemap.xml');ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
        locs=[e.text for e in tree.findall('.//s:loc',ns)]
        self.assertEqual(locs.count('https://kamelifeguide.com/guides/keeper-hacks.html'),1)
    def test_sources_and_limits_visible_in_source(self):
        self.assertIn('参考資料の確認日：2026年11月12日',self.html)
        self.assertIn('魚の水槽で紹介されている清掃方法',self.html)
        self.assertIn('普段の水換えや水質確認は続けます',self.html)
        self.assertIn('全製品を同じ月数にはしません',self.html)
        self.assertNotIn('<!-- PRACTICAL_TIPS -->',self.html)
    def test_quick_drain_pump_manufacturer_conditions(self):
        self.assertIn('id="quick-drain-pump"', self.html)
        for text in ('PH-73', '約1.1m', '10cm以上', '排水先を低くできるか'):
            self.assertIn(text, self.html)
        for url in ('https://www.suisaku.com/product/maintenance_goods/2045/',
                    'https://www.suisaku.com/sys/wp-content/uploads/2025/09/PK-23_quick-drain-pump-normal.pdf'):
            self.assertIn(url, [a.get('href') for a in self.page.links])
    def test_quick_drain_pump_has_no_unverified_purchase_claims(self):
        section = self.html.split('id="quick-drain-pump"', 1)[1].split('</article>', 1)[0]
        for forbidden in ('amazon.co.jp', 'B09WYHW7G8', '使用しています', '砂利掃除', '作業時間が半分'):
            self.assertNotIn(forbidden, section)
    def test_concrete_product_links(self):
        expected = {
            'suisaku-ph73': 'https://item.rakuten.co.jp/chanet/268072/',
            'gex-cleaner-dropper': 'https://item.rakuten.co.jp/chanet/168159/',
            'tanita-kj305': 'https://item.rakuten.co.jp/webby/50892153/',
            'shimano-st422i': 'https://item.rakuten.co.jp/naturum/2455158/',
        }
        self.assertEqual(sum('data-product' in a for a in self.page.links), 4)
        actual = {a['data-product']: a['href'] for a in self.page.links if 'data-product' in a}
        self.assertEqual(actual, expected)
        for a in self.page.links:
            if 'data-product' in a:
                self.assertEqual(a.get('rel'), 'nofollow')
                self.assertNotIn('tag=', a['href'])
                self.assertNotIn('hb.afl', a['href'])
    def test_product_conditions_without_experience_claim(self):
        for value in ('28.5cm', '22.4cm', '水深36cm', '容器と亀を合わせて3kg',
                      '容器込み300g', '本体は濡らさず', '64cmと30cm', '貼り直せない',
                      'もともとは釣り用', 'ガラス越しの見え方や角度'):
            self.assertIn(value, self.html)
        for section_id in ('cleaner-dropper', 'weight-scale', 'measure-sticker'):
            section = self.html.split('id="'+section_id+'"', 1)[1].split('</article>', 1)[0]
            for phrase in ('使っています', '使ってみました', '正確に測れる', '在庫あり'):
                self.assertNotIn(phrase, section)
    def test_new_products_inside_existing_details(self):
        for product in ('suisaku-ph73', 'gex-cleaner-dropper', 'tanita-kj305', 'shimano-st422i'):
            before = self.html.split('data-product="'+product+'"')[0]
            self.assertGreater(before.rfind('<details>'), before.rfind('</details>'))
    def test_local_destinations(self):
        for a in self.page.links:
            h=a.get('href','').split('#')[0]
            if h and not re.match(r'https?://',h):self.assertTrue((ROOT/'guides'/h).exists(),h)
if __name__=='__main__':unittest.main()
