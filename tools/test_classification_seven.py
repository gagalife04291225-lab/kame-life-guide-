import unittest,json,re
from pathlib import Path
from test_species_size_sync import species_records,upper,KNOWN_DIVERGENCE
ROOT=Path(__file__).resolve().parents[1]
class ClassificationSeven(unittest.TestCase):
 def test_values_and_flags(self):
  m={x['slug']:x for x in json.loads((ROOT/'data/species-master.json').read_text())['species']}
  r={x['slug']:x for x in species_records()}
  values={'malayan-box-turtle':27.8,'three-striped-box-turtle':26,'chinese-softshell-turtle':23,'albino-chinese-softshell':None,'greek-tortoise':46,'cherry-head-tortoise':None,'red-cheeked-mud-turtle':16.6}
  for slug,n in values.items():
   with self.subTest(slug=slug):
    self.assertEqual(m[slug]['max_shell_length_cm']['value'],n)
    self.assertEqual(upper(r[slug]['core']),n);self.assertEqual(upper(r[slug]['legacy']),n)
  self.assertEqual(m['greek-tortoise']['max_shell_length_cm']['verification'],'NEEDS_REVIEW')
  for slug in ['cherry-head-tortoise','albino-chinese-softshell']:self.assertEqual(m[slug]['max_shell_length_cm']['verification'],'UNPROVEN')
  self.assertFalse(KNOWN_DIVERGENCE)
 def test_optional_label_applies_both_places(self):
  h=(ROOT/'shindan/index.html').read_text()
  self.assertIn("size: sp.sizeLabel || '最大甲長'",h)
  self.assertIn("'※' + (sp.sizeLabel || '最大甲長')",h)
