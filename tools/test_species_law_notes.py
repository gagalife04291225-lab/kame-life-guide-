"""Regression guards for three corrected legal notes."""
import json
import re
import unittest
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]

def page(slug):
    return (ROOT / 'species' / (slug + '.html')).read_text(encoding='utf-8')

class SpeciesLawNotesTests(unittest.TestCase):
    def test_matamata_ii_in_visible_faq_and_schema(self):
        text = page('amazon-matamata')
        self.assertNotIn('には掲載されて', text)
        self.assertNotIn('輸出を禁止', text)
        data = [json.loads(x) for x in re.findall(r'<script type="application/ld\+json">(.*?)</script>', text, re.S)]
        nodes = [g for x in data for g in x.get('@graph', [x])]
        faq = next(g for g in nodes if g.get('@type') == 'FAQPage')
        q = next(q for q in faq['mainEntity'] if q['name'] == '特別な手続きは必要ですか？')
        answer = q['acceptedAnswer']['text']
        self.assertIn('CITES附属書II', answer)
        self.assertIn('<div class="faq-body">' + answer + '</div>', text)
        self.assertIn('輸出許可書', answer)

    def test_japanese_pond_advice_not_blanket_zero_quota(self):
        text = page('japanese-pond-turtle')
        self.assertNotIn('ゼロ枠', text)
        for value in ('背甲長8cm未満に限り助言可', '8cm以上は助言不可', '飼育繁殖個体はサイズを問わず助言可', 'ほかの審査要件と輸出許可', 'https://www.env.go.jp/press/101740.html'):
            self.assertIn(value, text)

    def test_hanagame_designation_source_and_separate_cites(self):
        text = page('chinese-stripe-necked-turtle')
        self.assertNotIn('press_03312', text)
        self.assertIn('https://www.env.go.jp/press/103048.html', text)
        self.assertIn('CITES附属書III（掲載国：中国）', text)
        self.assertIn('外来生物法の規制が別に', text)
        self.assertIn('許可なく飼育・購入・譲受はできません', text)

if __name__ == '__main__':
    unittest.main()
