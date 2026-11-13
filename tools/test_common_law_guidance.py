"""Regression guards for shared slider guidance (not a full legal audit)."""
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COMPARE = ROOT / "compare/painted-vs-red-eared-slider.html"
BEFORE = ROOT / "before-keeping.html"
SOURCE = "https://www.env.go.jp/nature/intro/2outline/regulation/jokentsuki.html"

class CommonLawGuidanceTests(unittest.TestCase):
    def test_household_care_and_limited_free_transfer_are_not_banned(self):
        for path in (COMPARE, BEFORE):
            text = path.read_text(encoding="utf-8")
            with self.subTest(path=path.name):
                self.assertIn("家庭での飼育", text)
                self.assertIn("頒布に当たらない無償", text)
                self.assertIn("原則禁止", text)
                self.assertIn(SOURCE, text)
                for old in ("新規飼育不可", "新規飼育は不可", "新規入手不可", "新たに購入・譲り受けることはできません", "届け出等の条件", "新規に飼い始めることはできません", "規制なし", "規制もないため", "規制を気にせず"):
                    self.assertNotIn(old, text)
    def test_ban_does_not_lose_distribution_caveat(self):
        for path in (COMPARE, BEFORE):
            text = path.read_text(encoding="utf-8")
            with self.subTest(path=path.name):
                self.assertIn("販売・頒布・購入・輸入・野外への放出", text)
                self.assertRegex(text, r"無償でも多数へ配り分ける")
    def test_visible_faq_matches_jsonld(self):
        text = COMPARE.read_text(encoding="utf-8")
        data = [json.loads(m) for m in re.findall(r'<script type="application/ld\+json">(.*?)</script>', text, re.S)]
        graphs = [g for obj in data for g in obj.get("@graph", [obj])]
        faq = next(g for g in graphs if g.get("@type") == "FAQPage")
        section = text.split("<h2>よくある質問</h2>")[1].split("<h2>")[0]
        for question in faq["mainEntity"]:
            self.assertIn("<h3>" + question["name"] + "</h3>", section)
            self.assertIn("<p>" + question["acceptedAnswer"]["text"] + "</p>", section)
    def test_description_layers_match(self):
        text = COMPARE.read_text(encoding="utf-8")
        description = re.search(r'<meta name="description" content="([^"]*)">', text)[1]
        og = re.search(r'<meta property="og:description" content="([^"]*)">', text)[1]
        data = json.loads(re.search(r'<script type="application/ld\+json">(.*?)</script>', text, re.S)[1])
        article = next(g for g in data["@graph"] if g.get("@type") == "Article")
        self.assertEqual(description, og)
        self.assertEqual(description, article["description"])
        self.assertIn("家庭での飼育", description)

if __name__ == "__main__":
    unittest.main()
