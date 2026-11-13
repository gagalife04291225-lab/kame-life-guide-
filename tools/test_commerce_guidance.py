import unittest,re,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
PAGES=list(ROOT.glob('*-best10.html'))
class CommerceGuidanceTest(unittest.TestCase):
 def test_comparison_not_unsupported_ranking(self):
  for p in PAGES:
   s=p.read_text(encoding='utf-8')
   with self.subTest(page=p.name):
    self.assertNotRegex(s,'売れ筋|ベスト10|以下のランキング')
    self.assertIn('番号は掲載順です。売上や性能の順位ではありません。',s)
    nums=[int(x) for x in re.findall(r'<div class="rank-num"[^>]*>(\d+)</div>',s)]
    self.assertEqual(nums,list(range(1,len(nums)+1)))
 def test_rakuten_card_container(self):
  for p in PAGES:
   s=p.read_text(encoding='utf-8')
   self.assertIn('document.querySelectorAll(".item, .diy")',s,p.name)
   self.assertNotIn('document.querySelectorAll(".item-body, .diy")',s,p.name)
   self.assertIn('楽天で商品名を検索',s)
 def test_exact_product_mapping_only(self):
  expected={'cage-best10.html':['tank_90'],'shelter-best10.html':['shelter_medium'],'water-filter-best10.html':['filter_small','filter_canister_xl']}
  for p in PAGES:
   s=p.read_text(encoding='utf-8')
   self.assertEqual(re.findall(r'data-product-id="([^"]+)"',s),expected.get(p.name,[]))
   if p.name in expected:
    self.assertIn('product.asin === productLink.getAttribute("data-asin")',s)
    self.assertIn('product.rakutenStatus === "available"',s)
 def test_no_duplicate_asins_in_comparison_cards(self):
  for name in ['cage-best10.html','food-best10.html','substrate-best10.html']:
   s=(ROOT/name).read_text(encoding='utf-8')
   asins=re.findall(r'data-asin="([^"]+)"',s)
   self.assertEqual(len(asins),len(set(asins)),name)
 def test_no_unverified_personal_use_claims(self):
  for name in ['food-best10.html','dish-best10.html','shelter-best10.html']:
   s=(ROOT/name).read_text(encoding='utf-8')
   self.assertNotRegex(s,'筆者も使用中|筆者実使用品|筆者も実際に使っています|筆者が.*実際に使っています|筆者自身|実際にムオヒラセガメ')
 def test_jsonld_valid(self):
  for p in PAGES:
   for raw in re.findall(r'<script type="application/ld\+json">(.*?)</script>',p.read_text(encoding='utf-8'),re.S):json.loads(raw)
if __name__=='__main__':unittest.main()
