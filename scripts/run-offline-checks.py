#!/usr/bin/env python3
"""Run repository checks without credentials, API calls or browser installation."""
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]


def commands():
    yield [sys.executable, '-m', 'unittest', 'discover', '-s', 'tools', '-p', 'test_*.py']
    for path in sorted((ROOT / 'tools').glob('test-*.mjs')):
        yield ['node', str(path.relative_to(ROOT))]
    yield [sys.executable, 'tools/validate_species.py', '--strict']
    yield [sys.executable, 'scripts/check_enclosure_sync.py']
    yield [sys.executable, 'scripts/check_compare_enclosure.py']
    yield ['node', 'scripts/update-asset-versions.mjs', '--check']
    yield ['git', 'diff', '--check']


def main():
    failed = []
    for command in commands():
        print('\n==> ' + ' '.join(command), flush=True)
        if subprocess.run(command, cwd=ROOT).returncode:
            failed.append(' '.join(command))
    print('\nOffline checks: ' + ('PASS' if not failed else 'FAIL'))
    for name in failed:
        print('FAILED: ' + name)
    return bool(failed)


if __name__ == '__main__':
    sys.exit(main())
