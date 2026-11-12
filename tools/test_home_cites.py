import json,re,unittest
from pathlib import Path
R=Path(__file__).resolve().parents[1]
class HomeCites(unittest.TestCase):
 def test_master(self):
  s=next(x for x in json.loads((R/'data/species-master.json').read_text(encoding='utf-8'))['species'] if x['slug']=='home-hinge-back-tortoise')
  self.assertEqual(s['cites']['appendix']['value'],'I');self.assertEqual(s['cites']['since']['value'],'2026-03-05');self.assertIn('国際希少',s['domestic_law']['value'])
 def test_diagnosis(self):
  s=(R/'shindan/species.js').read_text(encoding='utf-8').split("{ name: 'ホームセオレガメ'")[1].split("{ name:")[0]
  self.assertIn("legal: 'cites_i'",s);self.assertNotIn('CITES II',s);self.assertIn('登録票',s);self.assertIn("availability: 'archive'",s);self.assertIn('return false;',s);self.assertIn('return -9999;',s)
 def test_page(self):
  s=(R/'species/home-hinge-back-tortoise.html').read_text(encoding='utf-8');self.assertNotIn('CITES II',s);self.assertNotIn('附属書II',s)
  for text in ['2026年3月5日','原則禁止','有効な登録票を個体と一緒に','飼い続けることは禁止されていません','press_02851.html','news20260217.htm']:self.assertIn(text,s)
  for j in re.findall(r'<script type="application/ld\+json">(.*?)</script>',s,re.S):json.loads(j)
 def test_identification(self):
  s=next(x for x in json.loads((R/'data/species-identification.json').read_text(encoding='utf-8'))['species'] if x['slug']=='home-hinge-back-tortoise');self.assertIn('CITES附属書I・',s['houkisei']);self.assertNotIn('附属書II',s['houkisei'])
if __name__=='__main__':unittest.main()
