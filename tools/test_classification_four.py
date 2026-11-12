import unittest,json,re,html
from pathlib import Path
from test_species_size_sync import species_records,upper
ROOT=Path(__file__).resolve().parents[1]
VALUES={'collier-snake-necked-turtle':40,'three-toed-box-turtle':17.9,'ornate-box-turtle':17,'desert-box-turtle':17}
class ClassificationFour(unittest.TestCase):
 def test_record_alignment(self):
  master={s['slug']:s for s in json.loads((ROOT/'data/species-master.json').read_text())['species']}
  records={s['slug']:s for s in species_records()}
  for slug,val in VALUES.items():
   with self.subTest(slug=slug):
    self.assertEqual(master[slug]['max_shell_length_cm']['value'],val)
    for k in ['core','legacy']:self.assertEqual(upper(records[slug][k]),val)
    page=(ROOT/'species'/f'{slug}.html').read_text()
    self.assertEqual(page.count('class="classification-size-evidence"'),1)
    for block in re.findall(r'<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>',page,re.S):json.loads(block)
 def test_scope_is_explicit(self):
  r={s['slug']:s for s in species_records()}
  self.assertIn('直線甲長かどうかは明記',r['collier-snake-necked-turtle']['note'])
  self.assertIn('18.9cm',r['three-toed-box-turtle']['note'])
  for slug in ['ornate-box-turtle','desert-box-turtle']:self.assertIn('産地型の最大値でも、一般的な成体サイズでもありません',r[slug]['note'])
 def test_typical_does_not_become_age_forecast(self):
  p=(ROOT/'species/collier-snake-necked-turtle.html').read_text()
  self.assertNotIn('10年後は甲長通常',p)
  self.assertNotIn('甲長通常30cm未満目安',p)

 def test_growth_and_taxon_review(self):
  for slug in VALUES:
   page=(ROOT/'species'/f'{slug}.html').read_text()
   self.assertNotRegex(page,r'(?:1|10)年後[のは].{0,8}甲長')
   self.assertNotIn('1年後の姿',page);self.assertNotIn('10年後のサイズ感',page)
  for slug,old in [('three-toed-box-turtle','13〜17cm・'),('ornate-box-turtle','12〜16cm・'),('desert-box-turtle','12〜16cm・')]:
   page=(ROOT/'species'/f'{slug}.html').read_text()
   self.assertNotIn('class="lp-block-title">'+old,page)
  tri=(ROOT/'species/three-toed-box-turtle.html').read_text()
  for old in ['他亜種は4本','基亜種トウブ','記録約16.5cm']:self.assertNotIn(old,tri)
  col=(ROOT/'species/collier-snake-necked-turtle.html').read_text()
  self.assertNotIn('高水温（26〜30℃）',col)
  md=(ROOT/'SHINDAN-SPECIES.md').read_text()
  self.assertNotIn('ホオアカドロガメの基亜種を含む',md)

 def test_ornata_record_labels(self):
  for slug in ['ornate-box-turtle','desert-box-turtle']:
   page=(ROOT/'species'/f'{slug}.html').read_text()
   with self.subTest(slug=slug):
    self.assertEqual(page.count('種全体の記録17cm'),3)
    self.assertNotIn('M（11〜15cm）',page)
    self.assertNotIn('甲長11〜15cm目安',page)
    self.assertIn('産地型',page)
