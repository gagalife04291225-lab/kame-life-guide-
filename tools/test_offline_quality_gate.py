"""Structural checks for the no-secret, standard-runner quality gate."""
import importlib.util
from pathlib import Path
import unittest

ROOT = Path(__file__).parents[1]
SPEC = importlib.util.spec_from_file_location('offline_checks', ROOT / 'scripts/run-offline-checks.py')
mod = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(mod)


class OfflineGateTests(unittest.TestCase):
    def test_node_tests_discovered_without_fixed_count(self):
        actual = [cmd[1] for cmd in mod.commands() if cmd[:1] == ['node'] and cmd[1].startswith('tools/test-')]
        self.assertEqual(actual, [str(p.relative_to(ROOT)) for p in sorted((ROOT / 'tools').glob('test-*.mjs'))])

    def test_ci_cost_and_secret_boundaries(self):
        text = (ROOT / '.github/workflows/site-offline-checks.yml').read_text()
        self.assertIn('runs-on: ubuntu-latest', text)
        self.assertIn('github.event.repository.private == false', text)
        self.assertIn('contents: read', text)
        self.assertIn('persist-credentials: false', text)
        self.assertIn('fetch-depth: 0', text)
        self.assertIn('timeout-minutes: 10', text)
        self.assertNotIn('secrets.', text)
        self.assertNotIn('upload-artifact', text)
        self.assertNotIn('actions/cache', text)
        self.assertNotIn('pull_request_target:', text)

    def test_rakuten_schedule_unchanged_and_races_not_cancelled(self):
        text = (ROOT / '.github/workflows/rakuten-sync.yml').read_text()
        self.assertIn("cron: '0 18 * * *'", text)
        self.assertIn('group: rakuten-sync\n  cancel-in-progress: false', text)
        self.assertIn('python scripts/push-rakuten-update.py', text)
        self.assertNotIn('git push --force', text)
        self.assertIn("IDENTITY_PROMOTE: ${{ github.event.inputs.identity_promote == 'true' && 'true' || 'false' }}", text)


if __name__ == '__main__':
    unittest.main()
