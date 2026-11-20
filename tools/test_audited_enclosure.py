import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

SPEC = importlib.util.spec_from_file_location('audited_enclosure', Path(__file__).resolve().parents[1] / 'scripts/check_audited_enclosure.py')
M = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(M)


class ReviewedPassageTests(unittest.TestCase):
    def check(self, text):
        manifest = {'passages':[{'id':'M01', 'path':'index.html',
          'forbidden':['終生45〜60cm'], 'required':['幼体45cm成体60cm以上']}]}
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            if text is not None:
                (root/'index.html').write_text(text, encoding='utf-8')
            return M.check(root, manifest)

    def test_repository_reviewed_manifest(self):
        root = Path(__file__).resolve().parents[1]
        manifest = json.loads((root / 'tools/fixtures/enclosure-reviewed-passages.json').read_text(encoding='utf-8'))
        self.assertGreater(len(manifest['passages']), 0)
        self.assertEqual(M.check(root, manifest), [])
        # Every original audited claim is independently restored while the new
        # passage remains. This proves a positive phrase cannot mask regression.
        for rule in manifest['passages']:
            for old in rule['negative_examples']:
                with self.subTest(id=rule['id'], old=old), tempfile.TemporaryDirectory() as tmp:
                    target = Path(tmp) / rule['path']
                    target.parent.mkdir(parents=True, exist_ok=True)
                    target.write_text((root / rule['path']).read_text(encoding='utf-8') + '\n' + old, encoding='utf-8')
                    self.assertTrue(M.check(Path(tmp), {'passages':[rule]}))

    def test_actual_comparison_row_gate(self):
        for slug, text, passes in [('russian-tortoise', '成体90cm級ケージ〜', True),
                                   ('russian-tortoise', '成体60〜90cm', False),
                                   ('russian-tortoise', '60〜90cm', False),
                                   ('red-footed-tortoise', '成体は120cm規格でも手狭', True),
                                   ('red-footed-tortoise', '成体90〜120cm', False)]:
            with self.subTest(slug=slug,text=text), tempfile.TemporaryDirectory() as tmp:
                path=Path(tmp,'species/bowsprit-tortoise.html');path.parent.mkdir()
                path.write_text('<table class="compare-table"><tr><th>種</th><th>必要環境</th></tr><tr><td><a href="' + slug + '.html">種</a></td><td>' + text + '</td></tr></table>', encoding='utf-8')
                self.assertEqual(not M.check_reviewed_comparison_rows(Path(tmp)), passes)

    def test_actual_top_stage_gate(self):
        for text, expected in [('幼体45cm・成体60cm以上', True),
                               ('成体45〜60cm', False), ('成体45cm・幼体60cm', False),
                               ('45〜60cm', False)]:
            with self.subTest(text=text), tempfile.TemporaryDirectory() as tmp:
                Path(tmp, 'index.html').write_text('<div id="csim-p1"><p class="csim-reassure">ミシシッピニオイガメは' + text + '。クサガメの成体は90cm以上。</p></div><div id="csim-p2">', encoding='utf-8')
                self.assertEqual(not M.check_top_stage(Path(tmp)), expected)

    def test_corrected_passage(self):
        self.assertEqual(self.check('<p>幼体45cm・成体60cm以上</p>'), [])

    def test_innocuous_punctuation_change(self):
        self.assertEqual(self.check('幼体45cm、成体60cm以上。'), [])

    def test_old_does_not_hide_behind_new(self):
        for old in ['終生45〜60cm', '終生 <b>45〜60cm</b>',
                    '<script type="application/ld+json">{"text":"終生45〜60cm"}</script>']:
            with self.subTest(old=old):
                self.assertTrue(self.check('幼体45cm・成体60cm以上' + old))

    def test_deletion_and_missing_fail(self):
        for text in [None, '']:
            self.assertTrue(self.check(text))


if __name__ == '__main__':
    unittest.main()
