import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

class CantonEnclosureBasisTests(unittest.TestCase):
    def test_enclosure_basis_does_not_conflate_reevesii(self):
        master = json.loads((ROOT / "data/species-master.json").read_text(encoding="utf-8-sig"))
        species = next(s for s in master["species"] if s["slug"] == "canton-reeves-turtle")
        self.assertEqual(species["scientific_name"]["value"], "Mauremys nigricans")
        basis = species["care"]["enclosure_jp"]["japan_fit"]["basis"]
        self.assertNotIn("reevesii と同種", basis)
        self.assertNotIn("甲長24cm（CONFIRMED）", basis)
        self.assertIn("別種", basis)
        self.assertIn("既存目安", basis)

if __name__ == "__main__":
    unittest.main()
