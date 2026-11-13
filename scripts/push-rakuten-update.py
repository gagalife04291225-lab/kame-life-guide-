#!/usr/bin/env python3
"""Push a generated update without overwriting concurrent main changes.

Only ordinary pushes and merges are used. Conflicts stop publication, preserving
both the remote branch and the local generated commit. No force, reset or rebase.
"""
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]


def run(*args, check=True, capture=False):
    return subprocess.run(args, cwd=ROOT, check=check, text=True,
                          stdout=subprocess.PIPE if capture else None)


def git(*args, **kwargs):
    return run('git', *args, **kwargs)


def main():
    if git('symbolic-ref', '--short', 'HEAD', capture=True).stdout.strip() != 'main':
        raise RuntimeError('Publication is allowed only from the main branch.')
    if git('status', '--porcelain', capture=True).stdout.strip():
        raise RuntimeError('Expected a clean tree after the generated commit.')
    changed = git('diff-tree', '--no-commit-id', '--name-only', '-r', 'HEAD', capture=True).stdout.splitlines()
    if not changed or any(p not in ('data/products.js', 'data/rakuten-diag.json') and not p.endswith('.html') for p in changed):
        raise RuntimeError('Refusing a commit outside generated data / HTML references.')
    original = git('rev-parse', 'HEAD', capture=True).stdout.strip()
    for attempt in range(3):
        if git('push', 'origin', 'HEAD:refs/heads/main', check=False).returncode == 0:
            print('Generated update published with ordinary fast-forward push.')
            return 0
        if attempt == 2:
            break
        git('fetch', 'origin', 'refs/heads/main')
        remote = git('rev-parse', 'FETCH_HEAD', capture=True).stdout.strip()
        if remote == git('rev-parse', 'HEAD', capture=True).stdout.strip():
            print('Remote already contains this exact update; no duplicate push.')
            return 0
        if git('merge-base', '--is-ancestor', remote, 'HEAD', check=False).returncode == 0:
            # Already contains remote main: a permission/network error, not a race.
            raise RuntimeError('Push failed without remote advancement; no retry workaround.')
        if git('merge', '--no-edit', remote, check=False).returncode:
            git('merge', '--abort')
            raise RuntimeError('Concurrent edits conflict. Nothing overwritten; generated commit: ' + original)
        # Remote work may have changed a versioned asset. Refresh on the merged tree.
        run('node', 'scripts/update-asset-versions.mjs')
        run('node', 'scripts/update-asset-versions.mjs', '--check')
        changes = git('diff', '--name-only', capture=True).stdout.splitlines()
        if any(not p.endswith('.html') for p in changes):
            raise RuntimeError('Asset refresh changed an unexpected non-HTML file; publication stopped.')
        if changes:
            git('add', '--', *changes)
            git('commit', '-m', 'chore: refresh asset references after concurrent update')
        run(sys.executable, 'scripts/run-offline-checks.py')
        if git('status', '--porcelain', capture=True).stdout.strip():
            raise RuntimeError('Checks modified the working tree; publication stopped.')
    raise RuntimeError('Remote kept advancing; bounded retries exhausted. Generated commit: ' + original)


if __name__ == '__main__':
    try:
        sys.exit(main())
    except (RuntimeError, subprocess.CalledProcessError) as exc:
        print(str(exc), file=sys.stderr)
        sys.exit(1)
