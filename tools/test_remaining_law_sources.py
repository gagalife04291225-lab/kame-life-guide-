import json
import unittest
from pathlib import Path

class RemainingLawSourcesTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        path = Path(__file__).resolve().parents[1] / 'data/species-master.json'
        cls.rows = {r['slug']: r for r in json.loads(path.read_text(encoding='utf-8'))['species']}

    def test_resolved_appendices(self):
        expected = {
            'chinese-stripe-necked-turtle': 'III',
            'collier-snake-necked-turtle': 'not_listed',
            'siebenrocks-snake-necked-turtle': 'not_listed',
            'hilaire-side-necked-turtle': 'not_listed',
            'archive-testudo-kleinmanni': 'I',
            'archive-geochelone-elegans': 'I',
            'archive-geochelone-platynota': 'I',
            'archive-pyxis-arachnoides': 'I',
        }
        for slug, value in expected.items():
            with self.subTest(slug=slug):
                appendix = self.rows[slug]['cites']['appendix']
                self.assertEqual(appendix['value'], value)
                self.assertEqual(appendix['verification'], 'CONFIRMED')
                self.assertIn('https://zoek.officielebekendmakingen.nl/trb-2026-100.html', appendix['sources'])

    def test_existing_nonlisting_and_third_appendix_preserved(self):
        for slug in ['painted-turtle', 'western-painted-turtle', 'eastern-painted-turtle', 'midland-painted-turtle', 'rio-grande-cooter']:
            self.assertEqual(self.rows[slug]['cites']['appendix']['value'], 'not_listed')
        self.assertEqual(self.rows['reeves-turtle']['cites']['appendix']['value'], 'III')

    def test_japanese_pond_export_note_has_official_advice_source(self):
        appendix = self.rows['japanese-pond-turtle']['cites']['appendix']
        self.assertEqual(appendix['value'], 'II')
        self.assertIn('https://www.env.go.jp/press/101740.html', appendix['sources'])
        self.assertNotIn('\u91ce\u751f\u500b\u4f53\u306e\u5546\u696d\u76ee\u7684\u8f38\u51fa\u306f\u30bc\u30ed\u67a0', appendix.get('note', ''))

if __name__ == '__main__':
    unittest.main()
