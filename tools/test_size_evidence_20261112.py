"""Recorded SCL values must agree across diagnosis/master/source paragraph."""
import json
import re
import unittest
from pathlib import Path
from test_species_size_sync import species_records, upper
ROOT=Path(__file__).resolve().parents[1]
VALUES={'elongated-tortoise':38,'bell-hinge-back-tortoise':23,'bowsprit-tortoise':35.1,'home-hinge-back-tortoise':25.8,'western-painted-turtle':26.6,'chinese-stripe-necked-turtle':30,'annulated-wood-turtle':22.6,'gulf-coast-box-turtle':23.5,'carolina-diamondback-terrapin':20.4,'eastern-long-necked-turtle':30,'mccords-snake-necked-turtle':24.1,'hermann-tortoise':35.7,'eastern-hermann-tortoise':35.7,'iberian-greek-tortoise':38.9,'giant-musk-turtle-mx':20.6,'alabama-map-turtle':27.9,'white-lipped-mud-turtle':21.4}
class SizeEvidence(unittest.TestCase):
 def test_master_diagnosis_and_source(self):
  master={s['slug']:s for s in json.loads((ROOT/'data/species-master.json').read_text())['species']}
  records={r['slug']:r for r in species_records()}
  for slug,val in VALUES.items():
   with self.subTest(slug=slug):
    s=master[slug];mx=s['max_shell_length_cm'];r=records[slug]
    self.assertEqual(mx['value'],val)
    self.assertEqual(upper(r['core']),val);self.assertEqual(upper(r['legacy']),val)
    self.assertIn('TTWG 2025',r['note']);self.assertIn('一般的な成体',r['note'])
    self.assertTrue(any('v10.2025.pdf' in u for u in mx['sources']))
    html=(ROOT/s['page']).read_text();self.assertEqual(html.count('class="size-evidence"'),1)
    self.assertIn('通常の成体サイズや',html)
 def test_no_stale_explicit_maximum(self):
  for slug,bad in {'eastern-hermann-tortoise':['最大28cm級'],'giant-musk-turtle-mx':['最大甲長25cm','オスは最大21cm','甲長記録上限'],'alabama-map-turtle':['メス273mm・オス117mm'],'carolina-diamondback-terrapin':['最大23cm超の記録']}.items():
   html=(ROOT/'species'/f'{slug}.html').read_text()
   for phrase in bad:self.assertNotIn(phrase,html)
 def test_json_ld_parses(self):
  for slug in VALUES:
   html=(ROOT/'species'/f'{slug}.html').read_text()
   for block in re.findall(r'<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>',html,re.S):json.loads(block)

 def test_changed_faq_matches_visible(self):
  import html as htmlmod
  for slug in ['hermann-tortoise','eastern-hermann-tortoise','giant-musk-turtle-mx']:
   text=(ROOT/'species'/f'{slug}.html').read_text()
   visible=[htmlmod.unescape(re.sub('<[^>]+>','',a)).strip() for a in re.findall(r'<div class="faq-body">(.*?)</div>',text,re.S)]
   blocks=[json.loads(b) for b in re.findall(r'<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>',text,re.S)]
   faq=next(n for o in blocks for n in o.get('@graph',[o]) if n.get('@type')=='FAQPage')
   self.assertEqual([q['acceptedAnswer']['text'] for q in faq['mainEntity']],visible)

 def test_no_stale_diagnostic_max(self):
  js=(ROOT/'shindan/species.js').read_text()
  for slug in ['eastern-hermann-tortoise','giant-musk-turtle-mx']:
   seg=next(s for s in re.split(r"\n  \{ name:",js) if "slug: '"+slug+"'" in s)
   self.assertNotIn('最大28cm級',seg)
   self.assertNotIn('最大25cm前後',seg)

 def test_white_lip_no_age_prediction(self):
  text=(ROOT/'species/white-lipped-mud-turtle.html').read_text()
  self.assertNotIn('12〜16cm',text)
  self.assertNotIn('300〜600g',text)
  self.assertIn('年齢だけで甲長や体重を予測することはできません',text)

 def test_no_unsubstantiated_typical_bands(self):
  js=(ROOT/'shindan/species.js').read_text()
  cases={'bell-hinge-back-tortoise':'15〜25cm','mccords-snake-necked-turtle':'22〜26cm','giant-musk-turtle-mx':'20〜25cm','white-lipped-mud-turtle':'15〜17cm','carolina-diamondback-terrapin':'13〜21cm'}
  for slug,old in cases.items():
   seg=next(s for s in re.split(r"\n  \{ name:",js) if "slug: '"+slug+"'" in s)
   self.assertNotIn(old,seg)
   text=(ROOT/'species'/f'{slug}.html').read_text()
   self.assertNotIn(old,text)
   self.assertIn('通常の成体サイズの数値範囲は掲載していません',text)
