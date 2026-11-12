"""Classification names and comparison rows must agree with linked pages."""
from pathlib import Path
import unittest
ROOT = Path(__file__).resolve().parents[1]

class ClassificationRoutes(unittest.TestCase):
    def test_triunguis_route_names(self):
        for f in ('index.html', 'guide-moist.html', 'species-list.html'):
            text=(ROOT/f).read_text()
            self.assertIn('Terrapene triunguis',text)
            self.assertNotIn('Terrapene carolina triunguis',text)

    def test_redcheek_route_names(self):
        for f in ('guide-semi.html', 'species-list.html'):
            text=(ROOT/f).read_text()
            self.assertIn('Kinosternon cruentatum',text)
            self.assertNotIn('Kinosternon scorpioides cruentatum',text)

    def test_softshell_comparison_scope(self):
        for slug in ('smooth-softshell-turtle','spiny-softshell-turtle','florida-softshell-turtle'):
            text=(ROOT/'species'/f'{slug}.html').read_text()
            self.assertIn('23cm（狭義種の記録）',text)
            self.assertIn('養殖・流通個体すべての成長上限ではありません',text)

if __name__ == '__main__':
    unittest.main()
