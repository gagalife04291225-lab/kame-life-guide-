import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FILES = ('food-review.html', 'shelter-review.html', 'substrate-review.html', 'uvb-light-review.html', 'water-filter-review.html')

class ReviewEvidenceTests(unittest.TestCase):
    def test_no_unsubstantiated_rating(self):
        for name in FILES:
            with self.subTest(page=name):
                text = (ROOT / name).read_text(encoding='utf-8')
                self.assertNotIn('class="rating-box"', text)
                self.assertNotIn('★★★★★', text)
                self.assertNotIn('ratingValue', text)
                for raw in re.findall(r'<script type="application/ld\+json">(.*?)</script>', text, re.S):
                    data = json.loads(raw)
                    self.assertEqual({node['@type'] for node in data['@graph']}, {'Article', 'BreadcrumbList'})
    def test_candidates_not_measured_ranking(self):
        for name in FILES:
            text = (ROOT / name).read_text(encoding='utf-8')
            self.assertIn('掲載順はAmazonなどの売れ筋順位や、実測した性能の順位ではありません。', text)
            self.assertNotIn('おすすめ ベスト10', text)
    def test_no_fabricated_substrate_experience(self):
        text = (ROOT / 'substrate-review.html').read_text(encoding='utf-8')
        for claim in ('実際に使用した6種類', '誤飲しても安全', '半数以上のカメ種', '高評価レビュー多数'):
            self.assertNotIn(claim, text)
    def test_no_unsupported_filter_guarantee(self):
        text = (ROOT / 'water-filter-review.html').read_text(encoding='utf-8')
        for claim in ('売れ筋ランキングと', '週1〜2週1', '長寿命（10年以上', '確実にリターン', '激減させる'):
            self.assertNotIn(claim, text)
    def test_measure_shelter_not_generic_ratio(self):
        text = (ROOT / 'shelter-review.html').read_text(encoding='utf-8')
        self.assertNotIn('甲長の1.2〜1.5倍', text)
        self.assertIn('入口・内部の有効寸法', text)

if __name__ == '__main__':
    unittest.main()
