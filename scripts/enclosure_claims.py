"""Conservative comparison for reviewed enclosure claims, not general Japanese NLP.

Widths are compared only for identical explicitly reviewed contexts. Unknown is
not a pass. External product dimensions cannot establish usable inner space.
"""
import re
import unicodedata

CONTEXT = ('species', 'sex', 'headcount', 'axis', 'basis', 'scope')
NUMBER = re.compile(r'(\d+(?:\.\d+)?)\s*(?:[〜～~–-]\s*(\d+(?:\.\d+)?))?\s*cm')
STAGE = re.compile(r'(幼体|亜成体|成体|終生)')


def stage_widths(text):
    """Return explicit stage width lower bounds, or None on ambiguous syntax.

    Deliberately does not infer stage from nearby species/body-size prose. Each
    stage clause needs exactly one width, no body lengths/volumes/dimensions.
    """
    text = unicodedata.normalize('NFKC', text)
    if re.search(r'甲長|体長|外寸|内寸|[×x]|\d\s*[LlLℓ]|オス|メス|複数|ペア', text):
        return None
    hits = list(STAGE.finditer(text))
    if not hits:
        return None
    result = {}
    for i, hit in enumerate(hits):
        stage = 'adult' if hit[0] in ('成体', '終生') else ('juvenile' if hit[0] == '幼体' else 'subadult')
        clause = text[hit.end():hits[i + 1].start() if i + 1 < len(hits) else len(text)]
        widths = NUMBER.findall(clause)
        if len(widths) != 1 or stage in result:
            return None
        lo, hi = widths[0]
        if hi and float(hi) < float(lo):
            return None
        result[stage] = float(lo)
    return result


def compare_claim(candidate, benchmark):
    """MATCH / MISMATCH / UNJUDGED; never use a range's maximum as its minimum."""
    for key in CONTEXT:
        a, b = candidate.get(key), benchmark.get(key)
        if a is None or b is None or a in ('unknown', '') or b in ('unknown', '') or a != b:
            return 'UNJUDGED'
    a, b = stage_widths(candidate['text']), stage_widths(benchmark['text'])
    if a is None or b is None or not set(b).issubset(a):
        return 'UNJUDGED'
    return 'MISMATCH' if any(a[stage] < width for stage, width in b.items()) else 'MATCH'
