"""受診遅延を招く一律の待機日数と自己治療の回帰防止。"""
from pathlib import Path
import json,re,unittest,html
ROOT=Path(__file__).resolve().parents[1]
NAMES=('index','runny-nose','mbd-uvb','swollen-eyes','not-eating','lethargy','hibernation-trouble')
def read(n):return (ROOT/'trouble'/f'{n}.html').read_text(encoding='utf8')
def plain(s):return html.unescape(re.sub('<[^>]+>','',s)).strip()
class EmergencyGuidance(unittest.TestCase):
 def test_hub_no_blanket_wait(self):
  s=read('index');self.assertNotIn('数日以内に受診を検討',s);self.assertNotIn('1週間以上続くなら',s);self.assertIn('待たずに爬虫類対応',s)
 def test_respiratory_no_next_day_wait(self):
  s=read('runny-nose');self.assertNotIn('同日または翌日',s);self.assertNotIn('数日以内',s);self.assertIn('翌日まで待たず',s)
 def test_mbd_no_watch_or_home_cure(self):
  s=read('mbd-uvb');self.assertNotIn('⚠ 要観察',s);self.assertNotIn('進行を止めることが第一',s);self.assertNotIn('甲羅を軽く押して',s);self.assertIn('受診相談',s)
 def test_appetite_no_fixed_threshold(self):
  s=read('not-eating');self.assertNotIn('2週間以上',s);self.assertNotIn('5%以上',s);self.assertIn('一定の減少率に達するまで待たず',s)
 def test_breathing_first_before_home_care(self):
  for name in ('not-eating','lethargy','mbd-uvb','hibernation-trouble'):
   s=read(name);self.assertIn('medical-first',s,name);self.assertIn('環境改善の効果を待たず',s,name)
 def test_reviewed_observation_language(self):
  s=read("lethargy");self.assertNotIn("⚠ 要観察",s);self.assertNotIn("まず最初に温度の実測",s)
  self.assertNotIn("この一点で、原因の可能性が大きく絞り込まれます",read("swollen-eyes"))
 def test_hibernation_scope(self):
  s=read('hibernation-trouble');self.assertNotIn('1〜2週間',s);self.assertNotIn('7日',s);self.assertIn('日数を待たずに連絡',s)
 def test_jsonld_matches_visible_faq(self):
  for name in NAMES:
   s=read(name);body=re.sub(r'<script.*?</script>','',s,flags=re.S)
   for raw in re.findall(r'<script type="application/ld\+json">(.*?)</script>',s,re.S):
    def visit(obj):
     if isinstance(obj,dict):
      if obj.get('@type')=='Question':
       self.assertIn(obj['name'],plain(body),name);self.assertIn(obj['acceptedAnswer']['text'],plain(body),name)
      for v in obj.values():visit(v)
     elif isinstance(obj,list):
      for v in obj:visit(v)
    visit(json.loads(raw))
 def test_sources_readable(self):
  for name in NAMES:
   s=read(name);self.assertIn('medical-sources',s,name);self.assertIn('treeoflifeexotics.vet/',s);self.assertIn('vcahospitals.com/',s)
if __name__=='__main__':unittest.main()
