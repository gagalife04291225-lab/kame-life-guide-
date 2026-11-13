"""Regression guards: domestic provenance is not a CITES permit."""
import json,re,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
class CitesDocumentTests(unittest.TestCase):
 def test_shared_notes_separate_domestic_and_border_rules(self):
  hits=0
  for p in (ROOT/'species').glob('*.html'):
   s=p.read_text(encoding='utf8')
   self.assertNotIn('国内CB個体の飼育に法的制限はありません',s,p.name)
   self.assertNotIn('国内CBは個人購入・飼育とも法的に問題ありません',s,p.name)
   if '国内繁殖の説明と、輸出入に必要なCITES書類は別のものです。' in s:
    hits+=1; self.assertIn('cites_im.html',s)
  self.assertEqual(hits,47)
 def test_document_misdefinitions_removed(self):
  banned=['インボイス（国内繁殖証明書）','CITES II書類（国内CB証明）','CITES IIのCB証明書','販売側はCB証明書またはCITES書類の提示が必要','国内CB個体の取引が原則です']
  for p in (ROOT/'species').glob('*.html'):
   for t in banned:self.assertNotIn(t,p.read_text(encoding='utf8'),p.name)
 def test_edited_faq_answers_exist_in_visible_html(self):
  for slug in ['aldabra-tortoise','asian-black-marsh-turtle','chaco-tortoise','elongated-tortoise','chinese-box-turtle','taiwan-box-turtle','indochinese-box-turtle']:
   s=(ROOT/'species'/(slug+'.html')).read_text(encoding='utf8')
   body=re.sub(r'<script.*?</script>','',s,flags=re.S)
   plain=re.sub(r'\s+','',re.sub(r'<[^>]+>','',body))
   for block in re.findall(r'<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>',s,re.S):
    data=json.loads(block)
    if data.get('@type')=='FAQPage':
     for q in data['mainEntity']:
      answer=re.sub(r'\s+','',re.sub(r'<[^>]+>','',q['acceptedAnswer']['text']))
      self.assertIn(answer,plain,slug)
if __name__=='__main__':unittest.main()
