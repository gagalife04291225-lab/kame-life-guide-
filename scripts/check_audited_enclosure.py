#!/usr/bin/env python3
"""Fail closed on changes to reviewed enclosure passages (including JSON-LD).

The manifest is a reviewed correction contract, not a general husbandry parser.
Old claim patterns are forbidden in each audited scope, even when corrected
copy also exists. Positive anchors are semantic fragments, not prose snapshots.
Whitespace/inline markup cannot hide a restored old passage. No auto-update mode.
"""
import argparse
import html
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
import importlib.util
_spec = importlib.util.spec_from_file_location('enclosure_claims', Path(__file__).with_name('enclosure_claims.py'))
_claims = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_claims)


def check_top_stage(root):
    # Scope is the audited cost-simulator water-turtle paragraph, not all Top
    # species/body lengths. The two species must not share an inferred minimum.
    source = (root / 'index.html').read_text(encoding='utf-8')
    block = re.search(r'id="csim-p1"(.*?)id="csim-p2"', source, re.S)
    para = re.search(r'<p class="csim-reassure">(.*?)</p>', block[1], re.S) if block else None
    if not para:
        return ['TOP-STAGE: audited planning paragraph missing']
    text = html.unescape(re.sub(r'<[^>]*>', '', para[1]))
    pieces = re.split('ミシシッピニオイガメ(?:は|については)', text)
    if len(pieces) != 2:
        return ['TOP-STAGE: species scope needs review (UNJUDGED)']
    text = pieces[1].split('クサガメ')[0]
    context = dict(species='musk-turtle', sex='either', headcount=1,
                   axis='width', basis='nominal-class', scope='site-planning-benchmark')
    result = _claims.compare_claim(dict(text=text, **context), dict(text='成体60cm以上', **context))
    return [] if result == 'MATCH' else ['TOP-STAGE: ' + result + ' (not a proven husbandry minimum)']


def check_reviewed_comparison_rows(root):
    """Target only two independently audited adult comparison-row regressions.

    Missing stage is UNJUDGED/review required, not an invented adult mismatch.
    Redfoot's '120 still cramped' is deliberately not converted to a minimum.
    """
    failures = []
    for path in sorted((root / 'species').glob('*.html')):
        source = path.read_text(encoding='utf-8')
        for table in re.findall(r'<table class="compare-table">(.*?)</table>', source, re.S):
            headers = [normalize(x) for x in re.findall(r'<th[^>]*>(.*?)</th>', table, re.S)]
            cols = [i for i, h in enumerate(headers) if re.fullmatch(r'必要(?:ケージ|スペース|水槽|環境)', h)]
            if not cols:
                continue
            for row in re.findall(r'<tr[^>]*>(.*?)</tr>', table, re.S):
                cells = re.findall(r'<td[^>]*>(.*?)</td>', row, re.S)
                if len(cells) <= cols[0]:
                    continue
                target = re.search(r'href="(red-footed-tortoise|russian-tortoise)\.html"', cells[0])
                if not target:
                    continue
                cell = normalize(cells[cols[0]])
                if target[1] == 'red-footed-tortoise':
                    if not re.search(r'成体.{0,8}120cm.{0,8}手狭', cell):
                        failures.append(str(path.relative_to(root)) + ': redfoot adult criterion missing/UNJUDGED')
                else:
                    if path.stem not in {'bowsprit-tortoise', 'chaco-tortoise', 'iberian-greek-tortoise', 'pancake-tortoise'}:
                        continue  # outside the four independently reviewed adult cells
                    context = dict(species=target[1], sex='either', headcount=1, axis='width',
                                   basis='nominal-class', scope='site-planning-benchmark')
                    result = _claims.compare_claim(dict(text=cell, **context), dict(text='成体90cm', **context))
                    if result != 'MATCH':
                        failures.append(str(path.relative_to(root)) + ': Russian adult row ' + result)
    return failures


def normalize(source):
    return re.sub(r'[\s、。・：:；;（）()「」]', '', html.unescape(re.sub(r'<[^>]*>', '', source)))


def check(root, manifest):
    failures = check_top_stage(root) if manifest.get('top_stage_check') else []
    if manifest.get('comparison_rows_check'):
        failures += check_reviewed_comparison_rows(root)
    for rule in manifest['passages']:
        path = root / rule['path']
        if not path.is_file():
            failures.append(rule['id'] + ': missing source ' + rule['path'])
            continue
        text = normalize(path.read_text(encoding='utf-8'))
        for pattern in rule['forbidden']:
            if re.search(pattern, text):
                failures.append(rule['id'] + ': old audited claim remains')
        for pattern in rule['required']:
            if not re.search(pattern, text):
                failures.append(rule['id'] + ': missing reviewed semantic anchor ' + pattern)
    return failures


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=ROOT)
    parser.add_argument('--manifest', type=Path, default=ROOT / 'tools/fixtures/enclosure-reviewed-passages.json')
    args = parser.parse_args()
    manifest = json.loads(args.manifest.read_text(encoding='utf-8'))
    failures = check(args.root, manifest)
    print('Audited enclosure passages: ' + ('FAIL' if failures else 'PASS'))
    for failure in failures:
        print(failure)
    return bool(failures)


if __name__ == '__main__':
    raise SystemExit(main())
