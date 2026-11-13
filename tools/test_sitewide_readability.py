"""Guard readable shared text without enlarging ruby or altering content."""
import re, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
class Readability(unittest.TestCase):
 def text(self,p): return (ROOT/p).read_text(encoding="utf8")
 def test_shared_floor(self):
  s=self.text("css/system.css")
  for name,n in [("micro",14),("label",14),("sm",14),("body",16)]:
   self.assertRegex(s,r"--klg-fs-"+name+r":\s*"+str(n)+"px")
 def test_kid_range_labels(self):
  self.assertIn(".bucket-btn small{font-size:.875rem;}",self.text("css/kid.css"))
 def test_body_and_inputs(self):
  s=self.text("css/system.css")
  self.assertIn('font-family:system-ui,"Noto Sans JP"',s)
  self.assertIn("input,select,textarea,button",s)
 def test_literal_small_text_floor(self):
  for fn in ["css/quick-facts.css","css/starter-kit.css","css/kid.css","css/life-preview.css","js/setup-products.js","js/starter-kit.js"]:
   for n,unit in re.findall(r"font-size\s*:\s*([\d.]+)(px|rem)",self.text(fn)):
    self.assertGreaterEqual(float(n)*(16 if unit=="rem" else 1),14,fn)
if __name__=="__main__":unittest.main()
