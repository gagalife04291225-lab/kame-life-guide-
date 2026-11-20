import importlib.util
from pathlib import Path
import unittest

SPEC = importlib.util.spec_from_file_location('enclosure_claims', Path(__file__).resolve().parents[1] / 'scripts/enclosure_claims.py')
M = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(M)


def claim(text, **kw):
    return dict(text=text, **(dict(species='musk-turtle', sex='either', headcount=1,
        axis='width', basis='nominal-class', scope='species-guide') | kw))


class ScopedClaimTests(unittest.TestCase):
    def test_lower_bound_not_maximum(self):
        self.assertEqual(M.compare_claim(claim('成体45〜60cm'), claim('成体60cm以上')), 'MISMATCH')

    def test_stages_are_not_pooled(self):
        for text, expected in [('幼体45cm・成体60cm以上', 'MATCH'),
                               ('成体45cm・幼体60cm', 'MISMATCH')]:
            self.assertEqual(M.compare_claim(claim(text), claim('成体60cm以上')), expected)

    def test_unknown_and_different_context_never_pass_or_fail(self):
        for key in M.CONTEXT:
            for value in (None, 'unknown', 'different'):
                with self.subTest(key=key, value=value):
                    self.assertEqual(M.compare_claim(claim('成体45cm', **{key:value}),
                                                     claim('成体60cm')), 'UNJUDGED')

    def test_unknown_stage_and_mixed_axes(self):
        for text in ['45〜60cm', '幼体45cm', '成体甲長15cm・水槽60cm',
                     '成体60×45cm', '成体30L', '成体オス60cm・メス90cm',
                     '成体60cmまたは90cm', '成体90〜60cm']:
            with self.subTest(text=text):
                self.assertEqual(M.compare_claim(claim(text), claim('成体60cm')), 'UNJUDGED')

    def test_external_never_becomes_internal(self):
        self.assertEqual(M.compare_claim(claim('成体61.5cm', basis='external'),
                                         claim('成体60cm', basis='internal')), 'UNJUDGED')

    def test_headcount_not_species_average(self):
        self.assertEqual(M.compare_claim(claim('成体60cm', headcount=1),
                                         claim('成体90cm', headcount=2)), 'UNJUDGED')


if __name__ == '__main__':
    unittest.main()
