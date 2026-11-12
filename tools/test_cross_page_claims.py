import unittest,re,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
class Claims(unittest.TestCase):
 def test_comparative_rows(self):
  for p in (ROOT/'species').glob('*.html'):
   for row in re.findall(r'<tr\b[^>]*>.*?</tr>',p.read_text(),re.S):
    with self.subTest(file=p.name,row=row[:90]):
     if 'href="spenglers-leaf-turtle.html"' in row:self.assertNotIn('10〜14cm',row)
     if 'href="hirase-turtle.html"' in row:
      self.assertNotIn('日本固有',row);self.assertNotIn('日本・希少上級',row)
     if 'href="musk-turtle.html"' in row:
      for old in ['30〜60cm水槽','45〜60cm','△任意']:self.assertNotIn(old,row)
     if 'href="razorback-musk-turtle.html"' in row:
      for old in ['45cm〜','△任意']:self.assertNotIn(old,row)
 def test_no_old_guarantees(self):
  s=(ROOT/'guide-beginner.html').read_text()
  for x in ['ほぼ無臭','終生45','終生成体','水槽30cm〜','どれを選んでも30年以上','3〜5日家を空ける','同等のフィルターなら','外部式フィルター必須','投げ込み式では追いつかない','UVI 2〜4相当','UVI 3〜5相当','幼体なら50W','飼育環境はほぼ同じ','最大28cm']:
   with self.subTest(text=x):self.assertNotIn(x,s)
 def test_record_values(self):
  s=(ROOT/'guide-beginner.html').read_text()
  for x in ['13.7cm','17.6cm','35.7cm','記録上限']:self.assertIn(x,s)
 def test_faq_visible_equals_json(self):
  s=(ROOT/'guide-beginner.html').read_text();schema=[]
  for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>',s,re.S):
   d=json.loads(block)
   for o in (d.get('@graph',[d]) if isinstance(d,dict) else d):
    if o.get('@type')=='FAQPage':schema=[q['acceptedAnswer']['text'] for q in o['mainEntity']]
  visible=[re.sub('<[^>]+>','',v).strip() for v in re.findall(r'<div class="faq-body">(.*?)</div>',s,re.S)]
  self.assertEqual(len(schema),7);self.assertEqual(visible,schema)
if __name__=='__main__':unittest.main()
