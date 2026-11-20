"""Do not flatten common musk or Reeves tank benchmarks across life stage or sex."""
import html
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def source(path):
    return (ROOT / path).read_text(encoding='utf-8')


def text(value):
    return ' '.join(html.unescape(re.sub(r'<[^>]*>', ' ', value)).split())


class MuskReevesScope(unittest.TestCase):
    def test_linked_musk_faq_does_not_offer_juvenile_tank_for_life(self):
        page = source('species/reeves-turtle.html')
        question = 'ニオイガメとどちらが飼いやすいですか？'
        details = [x for x in re.findall(r'<details\b.*?</details>', page, re.S)
                   if question in x and 'href="musk-turtle.html"' in x]
        self.assertEqual(len(details), 1)
        visible = text(re.search(r'<div class="faq-body">(.*?)</div>', details[0], re.S)[1])
        raw = re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', page, re.S)
        ld = [e for body in raw for doc in [json.loads(body)] for e in doc.get('@graph', [doc])]
        answers = [q['acceptedAnswer']['text']
                   for e in ld if e.get('@type') == 'FAQPage'
                   for q in e['mainEntity'] if q['name'] == question]
        self.assertEqual(answers, [visible])
        self.assertNotRegex(visible, r'終生.{0,16}45|45.{0,16}終生')
        self.assertRegex(visible, r'ミシシッピニオイガメ.{0,12}幼体.{0,12}45cm')
        self.assertRegex(visible, r'成体を1匹.{0,15}60cm以上')
        self.assertIn('クサガメは成体メスで90cm以上', visible)

    def test_home_keeps_female_condition_on_reeves_benchmark(self):
        block = next(x for x in re.findall(r'<p class="csim-reassure">(.*?)</p>', source('index.html'), re.S)
                     if 'ミシシッピニオイガメ' in x)
        self.assertRegex(block, r'子ガメ.{0,18}45cm')
        self.assertRegex(block, r'成体1匹.{0,10}60cm以上')
        self.assertRegex(block, r'クサガメの成体メス.{0,8}90cm以上')

    def test_small_guide_keeps_male_scope_and_does_not_invent_reeves_minimum(self):
        page = source('guides/small-turtle-top10.html')
        nine = text(page[page.index('オスは甲長14〜16cm'):page.index('<!-- #10 クサガメ -->')])
        ten = text(page[page.index('<!-- #10 クサガメ -->'):page.index('<thead>')])
        self.assertNotIn('90cm以下', nine)
        self.assertRegex(nine, r'成体オス.{0,7}60cm')
        self.assertRegex(nine, r'成体メス.{0,7}90cm')
        self.assertNotIn('最小水槽', ten)
        self.assertNotRegex(ten, r'60\s*〜\s*90\s*cm|90\s*〜\s*120\s*cm')
        self.assertRegex(ten, r'オス.{0,12}体格')
        self.assertRegex(ten, r'成体メス.{0,15}90\s*cm以上')
        self.assertIn('雌雄不明の幼体', ten)

        rows = [text(x) for x in re.findall(r'<tr\b[^>]*>.*?</tr>', page, re.S)]
        map_row, = [r for r in rows if 'ミシシッピチズガメ' in r]
        reeves_row, = [r for r in rows if 'クサガメ（雄）' in r]
        self.assertRegex(map_row, r'成体オス60 cm可・成体メス90 cm目安')
        self.assertRegex(reeves_row, r'成体オスは体格に合わせる・成体メス90 cm以上')
