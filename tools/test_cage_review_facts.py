import json
import re
import unittest
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
class CageReviewFacts(unittest.TestCase):
    def test_sixty_cm_not_lifetime(self):
        text = (ROOT / 'cage-review.html').read_text(encoding='utf-8')
        self.assertNotIn('ヘルマン・ロシアリクガメ幼体〜成体に', text)
        self.assertIn('成体まで飼う広さとしては勧めません', text)
        self.assertIn('内部空間は約59×44×42cm', text)
    def test_filter_not_tank(self):
        text = (ROOT / 'cage-review.html').read_text(encoding='utf-8')
        self.assertNotIn('フィルター内蔵型水槽セット', text)
        self.assertIn('水槽本体は付属しません', text)
    def test_no_unverified_testimonial_rating_or_rank(self):
        text = (ROOT / 'cage-review.html').read_text(encoding='utf-8')
        for old in ['実際に購入・使用した5種類', 'ratingValue', 'rating-box', '第1位', 'ベスト10', '2025年版', '売れ筋ランキングと飼育コミュニティ']:
            self.assertNotIn(old, text)
        self.assertIn('掲載順は売上や評価の順位ではありません', text)
    def test_schema_parses(self):
        text = (ROOT / 'cage-review.html').read_text(encoding='utf-8')
        for raw in re.findall(r'<script type="application/ld\+json">(.*?)</script>', text, re.S):
            json.loads(raw)
if __name__ == '__main__': unittest.main()
