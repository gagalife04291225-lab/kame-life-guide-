"""Regression checks: no universal shell-length/area formula in equipment intros."""
from pathlib import Path
import re
import unittest
ROOT = Path(__file__).resolve().parents[1]

class EnclosureEvidenceWordingTest(unittest.TestCase):
    def test_growth_links_and_no_universal_formula(self):
        forbidden = ('甲長の5倍以上の底面積', '甲長の5倍以上が目安',
                     '甲長10cmのカメなら最低60cm', '甲長の5〜6倍×3〜4倍',
                     '水槽は甲長の5〜6倍の横幅が基準')
        for name in ('cage-review.html', 'cage-best10.html', 'water-filter-review.html'):
            content = (ROOT / name).read_text()
            with self.subTest(page=name):
                self.assertIn('kid/index.html#growth', content)
                for text in forbidden:
                    self.assertNotIn(text, content)

    def test_filter_not_flow_only_guarantee(self):
        content = (ROOT / 'water-filter-review.html').read_text()
        self.assertNotIn('水槽容量の10〜20倍/時', content)
        self.assertNotIn('汚染負荷は同サイズの魚の5〜10倍', content)
        self.assertIn('表示された流量だけで', content)
        self.assertIn('実際に入れる水量', content)

    def test_space_not_only_area_and_water_depth_separate(self):
        cage = (ROOT / 'cage-best10.html').read_text()
        self.assertIn('容器の高さや水深、脱走を防ぐ構造も別に確認', cage)
        water = (ROOT / 'water-filter-review.html').read_text()
        self.assertIn('水深は水槽の大きさとは別', water)

if __name__ == '__main__':
    unittest.main()
