"""UVB management copy safety and preservation checks."""
import hashlib,json,re,unittest
from pathlib import Path
from html.parser import HTMLParser
ROOT=Path(__file__).resolve().parents[1]
class UVGuidance(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.h=(ROOT/'uvb-light-best10.html').read_text(encoding='utf8')
  cls.baseline=json.loads((ROOT/'docs/qa/uv-guidance-baseline-20261113.json').read_text(encoding='utf8'))
 def test_no_fixed_sunlight_or_card_guarantees(self):
  for s in ['幼体全般','生体が触れても火傷しにくい','12〜15.0相当','照射距離を30〜40cm', 'どんなランプにも勝る','太陽光に勝るもの','30分〜1時間','晴れの日より少し長め','1枚持っておくと確実','UVBの有無・強弱が分かる','寿命を過ぎると「ただの光」']:
   self.assertNotIn(s,self.h)
 def test_conditions_and_limits(self):
  for s in ['種に合った光と温度','日陰を常に残し','過熱の危険','反応する波長や測定精度は確認できていません','機種ごとのメーカー案内','UVI（紫外線指数）']:
   self.assertIn(s,self.h)
 def test_reviewed_head_and_scripts(self):
  self.assertEqual(hashlib.sha256(re.search(r'<head>.*?</head>',self.h,re.S).group().encode()).hexdigest(),self.baseline['head_sha256'])
  self.assertEqual(hashlib.sha256('\n'.join(re.findall(r'<script\b.*?</script>',self.h,re.S)).encode()).hexdigest(),self.baseline['scripts_sha256'])
 def test_reviewed_product_links_and_safety_sources(self):
  self.assertEqual(re.findall(r'data-asin="([^"]+)"',self.h),self.baseline['asins'])
  sources=['https://zoomed.com/lighting-uvb-education-additional-information/','https://zoomed.com/lighting-uvb-education-what-is-uvb/','https://vcahospitals.com/know-your-pet/turtles-aquatic-housing']
  links=re.findall(r'href="([^"]+)"',self.h)
  self.assertEqual([x for x in links if x not in sources],self.baseline['links'])
  for s in sources:self.assertEqual(links.count(s),1)
 def test_markup_and_anchors(self):
  ids=re.findall(r'\bid="([^"]+)"',self.h)
  self.assertEqual(len(ids),len(set(ids)))
  self.assertIn('uvb-type-guide',ids)
  for tag in ['section','div','details','table']:
   self.assertEqual(len(re.findall('<'+tag+r'\b',self.h)),self.h.count('</'+tag+'>'),tag)
  for m in re.findall(r'<script type="application/ld\+json">(.*?)</script>',self.h,re.S):json.loads(m)
if __name__=='__main__':unittest.main()
