"""Local bare-repository race tests; no network, credentials or real price APIs."""
import importlib.util
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
from unittest.mock import patch

SPEC = importlib.util.spec_from_file_location('push_rakuten', Path(__file__).parents[1] / 'scripts/push-rakuten-update.py')
mod = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(mod)


def git(root, *args):
    return subprocess.check_output(['git', '-C', str(root), *args], text=True, stderr=subprocess.DEVNULL).strip()


@unittest.skipUnless(shutil.which('git') and shutil.which('node'), 'Git and Node are required')
class GeneratedPushTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.remote = self.root / 'remote.git'
        self.local = self.root / 'local'
        self.other = self.root / 'other'
        subprocess.run(['git', 'init', '--bare', '--initial-branch=main', str(self.remote)], check=True, stdout=subprocess.DEVNULL)
        subprocess.run(['git', 'clone', str(self.remote), str(self.local)], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        self.configure(self.local)
        self.write(self.local, 'data/products.js', 'base\n')
        self.write(self.local, 'index.html', 'old reference\n')
        self.write(self.local, 'scripts/update-asset-versions.mjs', "import fs from 'node:fs'; if(!process.argv.includes('--check')) fs.writeFileSync('index.html','refreshed reference\\n');\n")
        self.write(self.local, 'scripts/run-offline-checks.py', 'raise SystemExit(0)\n')
        self.commit(self.local, 'base')
        git(self.local, 'push', 'origin', 'main')
        subprocess.run(['git', 'clone', str(self.remote), str(self.other)], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        self.configure(self.other)
        self.write(self.local, 'data/products.js', 'generated\n')
        self.commit(self.local, 'generated')
        self.generated = git(self.local, 'rev-parse', 'HEAD')
        self.root_patch = patch.object(mod, 'ROOT', self.local)
        self.root_patch.start()

    def tearDown(self):
        self.root_patch.stop()
        self.temp.cleanup()

    def configure(self, repo):
        git(repo, 'config', 'user.name', 'Offline fixture')
        git(repo, 'config', 'user.email', 'fixture@example.invalid')

    def write(self, repo, path, text):
        file = repo / path
        file.parent.mkdir(parents=True, exist_ok=True)
        file.write_text(text)

    def commit(self, repo, label):
        git(repo, 'add', '.')
        git(repo, 'commit', '-m', label)

    def remote_change(self, path, content):
        self.write(self.other, path, content)
        self.commit(self.other, 'concurrent')
        git(self.other, 'push', 'origin', 'main')
        return git(self.other, 'rev-parse', 'HEAD')

    def test_no_race(self):
        self.assertEqual(mod.main(), 0)
        self.assertEqual(git(self.remote, 'rev-parse', 'main'), self.generated)

    def test_disjoint_race_keeps_both_and_refreshes_assets(self):
        remote = self.remote_change('species/example.html', 'owner update\n')
        self.assertEqual(mod.main(), 0)
        self.assertEqual(git(self.remote, 'show', 'main:data/products.js'), 'generated')
        self.assertEqual(git(self.remote, 'show', 'main:species/example.html'), 'owner update')
        self.assertEqual(git(self.remote, 'show', 'main:index.html'), 'refreshed reference')
        git(self.local, 'merge-base', '--is-ancestor', remote, 'HEAD')
        git(self.local, 'merge-base', '--is-ancestor', self.generated, 'HEAD')

    def test_conflicting_race_preserves_remote_and_generated_commit(self):
        remote = self.remote_change('data/products.js', 'owner product update\n')
        with self.assertRaisesRegex(RuntimeError, 'conflict'):
            mod.main()
        self.assertEqual(git(self.remote, 'rev-parse', 'main'), remote)
        self.assertEqual(git(self.local, 'rev-parse', 'HEAD'), self.generated)
        self.assertEqual(git(self.local, 'status', '--porcelain'), '')

    def test_remote_failing_checks_are_not_published(self):
        remote = self.remote_change('scripts/run-offline-checks.py', 'raise SystemExit(1)\n')
        with self.assertRaises(subprocess.CalledProcessError):
            mod.main()
        self.assertEqual(git(self.remote, 'rev-parse', 'main'), remote)
        git(self.local, 'merge-base', '--is-ancestor', self.generated, 'HEAD')

    def test_unrelated_commit_refused(self):
        self.write(self.local, 'private.txt', 'not a generated product update')
        self.commit(self.local, 'unexpected')
        with self.assertRaisesRegex(RuntimeError, 'outside generated'):
            mod.main()

    def test_successful_push_with_lost_response_is_not_duplicated(self):
        real_git = mod.git
        pushes = []
        def lost_response(*args, **kwargs):
            result = real_git(*args, **kwargs)
            if args[0] == 'push':
                pushes.append(args)
                return subprocess.CompletedProcess(args, 1)
            return result
        with patch.object(mod, 'git', lost_response):
            self.assertEqual(mod.main(), 0)
        self.assertEqual(len(pushes), 1)
        self.assertEqual(git(self.remote, 'rev-parse', 'main'), self.generated)

    def test_feature_branch_never_publishes_to_main(self):
        git(self.local, 'switch', '-c', 'feature')
        with self.assertRaisesRegex(RuntimeError, 'only from the main'):
            mod.main()
        self.assertNotEqual(git(self.remote, 'rev-parse', 'main'), self.generated)

    def test_dirty_tree_refused(self):
        self.write(self.local, 'index.html', 'not committed')
        with self.assertRaisesRegex(RuntimeError, 'clean tree'):
            mod.main()

    def test_failed_push_without_advancement_is_not_retried(self):
        real_git = mod.git
        pushes = []
        def denied(*args, **kwargs):
            if args[0] == 'push':
                pushes.append(args)
                return subprocess.CompletedProcess(args, 1)
            return real_git(*args, **kwargs)
        with patch.object(mod, 'git', denied):
            with self.assertRaisesRegex(RuntimeError, 'no retry workaround'):
                mod.main()
        self.assertEqual(len(pushes), 1)


if __name__ == '__main__':
    unittest.main()
