"""Shared copy checks; factual data and product-fit checks remain separate."""
from pathlib import Path
import unittest
ROOT=Path(__file__).resolve().parents[1]
class NaturalProse(unittest.TestCase):
    def test_shared_copy_is_reader_facing(self):
        pages=list((ROOT/'species').glob('*.html'))
        for p in pages:
            text=p.read_text(encoding='utf-8')
            for old in ('確定的な一次資料が乏しい項目は断定していません。','当サイトでは「○ヶ月まで」という書き方をしていません。','個体差・性別・レイアウト・同居数で必要量は変わります。'):
                self.assertNotIn(old,text,str(p))
    def test_uncertainty_is_retained(self):
        pages=list((ROOT/'species').glob('*.html'))
        self.assertGreater(sum('資料が少なく、はっきり分かっていない点もあります。' in p.read_text(encoding='utf-8') for p in pages),80)
    def test_tank_guidance_retains_growth_and_space(self):
        alltext=''.join(p.read_text(encoding='utf-8') for p in (ROOT/'species').glob('*.html'))
        self.assertIn('今の甲長と動ける広さを見てください。',alltext)
    def test_shelter_remains_unverified(self):
        text=(ROOT/'shelter-best10.html').read_text(encoding='utf-8')
        self.assertEqual(text.count('入口の幅・高さと内部の奥行・幅・高さは、まだ確認できていません。'),3)
