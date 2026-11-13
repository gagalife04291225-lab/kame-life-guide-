import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

class KidsReadability(unittest.TestCase):
    def test_kids_are_excluded_from_adult_typography(self):
        pages = list((ROOT / "kids").glob("*.html"))
        self.assertEqual(len(pages), 9)
        for page in pages:
            self.assertIn('<body class="k-body">', page.read_text(encoding="utf-8"), page.name)
    def test_reading_and_ruby_sizes(self):
        css = (ROOT / "css/kids.css").read_text(encoding="utf-8")
        self.assertIn('body.k-body{font-size:20px;}', css)
        self.assertIn('font-size:clamp(12px,.65em,18px)', css)
        self.assertIn('.k-q-choices button,.k-q-feedback,', css)
    def test_narrow_map_has_room_for_names(self):
        css = (ROOT / "css/kids.css").read_text(encoding="utf-8")
        self.assertIn('grid-template-columns:repeat(4,minmax(0,1fr))', css)
        self.assertIn('.k-stop{min-width:0;min-height:64px;}', css)

if __name__ == "__main__":
    unittest.main()
