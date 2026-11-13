"""Regression checks for enclosure lead wording and native path lookup."""
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location('enclosure_sync', ROOT / 'scripts/check_enclosure_sync.py')
SYNC = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(SYNC)

class EnclosureCheckerTests(unittest.TestCase):
    def test_three_master_entries_only_change_guide_wording(self):
        baseline = json.loads(subprocess.check_output(
            ['git', 'show', '88b143a9:data/species-master.json'], cwd=ROOT).decode('utf-8'))
        current = json.loads((ROOT / 'data/species-master.json').read_text(encoding='utf-8'))
        old = {s['slug']: s for s in baseline['species']}
        new = {s['slug']: s for s in current['species']}
        replacements = {
            '45〜60cm規格で終生飼育可': '45〜60cm規格（当サイト目安・体格で見直し）',
            'オス60cm可・メス90〜120cm': 'オス60cm・メス90〜120cm（当サイト目安）',
        }
        for slug in ['loggerhead-musk-turtle', 'mississippi-mud-turtle', 'western-painted-turtle']:
            with self.subTest(slug=slug):
                expected = old[slug]
                enclosure = expected['care']['enclosure_jp']
                enclosure['value'] = replacements[enclosure['value']]
                note = enclosure.get('japan_fit', {}).get('jp_note')
                if note in replacements:
                    enclosure['japan_fit']['jp_note'] = replacements[note]
                self.assertEqual(new[slug], expected)

    def test_all_supported_leads_capture_exact_value(self):
        leads = ['この種の終生飼育に必要な' + kind + 'の目安' for kind in
                 ['水槽', 'ケージ（テラリウム）', 'ケージ', '容器']]
        leads += ['この種の終生飼育について', '当サイトの水槽サイズ目安（飼育段階・体格で見直し）']
        for lead in leads:
            with self.subTest(lead=lead):
                hit = SYNC.LS_LEAD.search('<p class="ls-lead">' + lead + '：<strong>60cm開始→成体90cm</strong></p>')
                self.assertIsNotNone(hit)
                self.assertEqual(hit.group(1), '60cm開始→成体90cm')
        self.assertIsNone(SYNC.LS_LEAD.search('<p>当サイトの水槽サイズ目安（飼育段階・体格で見直し）：<strong>60cm</strong>'))

    def run_fixture(self, script, html, value='90cm'):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            (root / 'data').mkdir()
            (root / 'species').mkdir()
            (root / 'data/species-master.json').write_text(json.dumps({'species': [
                {'slug': 'sample-turtle', 'care': {'enclosure_jp': {'value': value}}}
            ]}), encoding='utf-8')
            (root / 'species/sample-turtle.html').write_text(html, encoding='utf-8')
            return subprocess.run([sys.executable, str(ROOT / 'scripts' / script)], cwd=root,
                env={**os.environ, 'PYTHONIOENCODING': 'utf-8'}, capture_output=True, text=True, encoding='utf-8')

    def test_new_lead_checks_exact_value_not_only_presence(self):
        for actual, status, matched in [('90cm', 0, 1), ('60cm', 1, 0)]:
            with self.subTest(actual=actual):
                result = self.run_fixture('check_enclosure_sync.py',
                    '<p class="ls-lead">当サイトの水槽サイズ目安（飼育段階・体格で見直し）：<strong>' + actual + '</strong></p>')
                self.assertEqual(result.returncode, status, result.stderr)
                self.assertIn(f'一致: {matched}', result.stdout)
                self.assertIn('不一致: ' + str(1 - matched), result.stdout)
                self.assertIn('ページ側に記載なし（正本には値あり）: 0', result.stdout)
                self.assertIn('正本に値なしだがページに値あり（推測値の疑い）: 0', result.stdout)

    def test_compare_self_row_native_path_and_undersized_failure(self):
        for actual, status in [('90cm', 0), ('60cm', 1)]:
            with self.subTest(actual=actual):
                html = '<table class="compare-table"><thead><tr><th>種</th><th>必要環境</th></tr></thead><tbody><tr><td>このページ</td><td>' + actual + '</td></tr></tbody></table>'
                result = self.run_fixture('check_compare_enclosure.py', html)
                self.assertEqual(result.returncode, status, result.stderr)
                self.assertIn('判定不能（正本に値または数値がない）: 0', result.stdout)
                self.assertIn('矛盾: ' + str(status), result.stdout)

if __name__ == '__main__':
    unittest.main()
