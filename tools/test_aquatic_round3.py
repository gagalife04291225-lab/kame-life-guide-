import html
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONDITIONS = json.loads((ROOT / 'docs/qa/aquatic-group3-conditions-20261112.json').read_text(encoding='utf-8'))

def plain(text):
    return re.sub(r'\s+', '', html.unescape(re.sub(r'<[^>]+>', '', text)))

class AquaticRound3Tests(unittest.TestCase):
    def test_eight_source_scoped_conditions(self):
        self.assertEqual(len(CONDITIONS), 8)
        js = (ROOT / 'shindan/species.js').read_text(encoding='utf-8')
        for slug, item in CONDITIONS.items():
            with self.subTest(slug=slug):
                self.assertIn('DIAGNOSIS_EQUIPMENT_CONDITIONS[' + json.dumps(slug) + ']', js)
                self.assertTrue(item['sourceNote'])
                self.assertTrue(item['sources'])
                self.assertEqual(len(item['items']), 3)

    def test_domestic_guidelines_are_conditional(self):
        for slug in CONDITIONS:
            text = (ROOT / 'species' / (slug + '.html')).read_text(encoding='utf-8')
            with self.subTest(slug=slug):
                self.assertIn('当サイトの水槽サイズ目安', text)
                self.assertIn('陸場を置いた後の水域と奥行き', text)
                for old in ['終生45〜60cm', '45〜60cm水槽で終生飼育可', '成体も45〜60cmで十分', '60cm水槽のまま付き合える', '60cm水槽で完結', '背甲高の2〜3倍']:
                    self.assertNotIn(old, text)

    def test_large_cooters_do_not_keep_conflicting_adult_tanks(self):
        for slug in ['florida-red-bellied-turtle', 'peninsula-cooter', 'river-cooter']:
            text = (ROOT / 'species' / (slug + '.html')).read_text(encoding='utf-8')
            with self.subTest(slug=slug):
                self.assertNotIn('>90〜120cm以上<', text)
                self.assertNotIn('90cm以上の水槽での終生飼育', text)
                self.assertNotIn('60〜90cm以上の水槽', text)

    def test_all_visible_faq_answers_match_jsonld(self):
        for slug in CONDITIONS:
            text = (ROOT / 'species' / (slug + '.html')).read_text(encoding='utf-8')
            answers = []
            def walk(value):
                if isinstance(value, dict):
                    if value.get('@type') == 'Question':
                        answers.append(value['acceptedAnswer']['text'])
                    for child in value.values():
                        walk(child)
                elif isinstance(value, list):
                    for child in value:
                        walk(child)
            for block in re.findall(r'<script[^>]+type=[\"\']application/ld\+json[\"\'][^>]*>(.*?)</script>', text, re.S):
                walk(json.loads(block))
            visible = re.sub(r'<script\b[^>]*>.*?</script>', '', text, flags=re.S)
            with self.subTest(slug=slug):
                self.assertTrue(answers)
                for answer in answers:
                    self.assertIn(plain(answer), plain(visible))

if __name__ == '__main__':
    unittest.main()
