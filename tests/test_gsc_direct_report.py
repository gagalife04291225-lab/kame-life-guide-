"""Offline regression tests; no Google credentials or network calls required."""
import datetime as dt
import unittest

from scripts import gsc_direct_report as gsc


class DummyResponse:
    ok = True
    status_code = 200

    def __init__(self, body):
        self.body = body

    def json(self):
        return self.body


class DummySession:
    def __init__(self):
        self.calls = []

    def post(self, url, json, timeout):
        self.calls.append((url, json, timeout))
        if json["dimensions"] == ["page"]:
            return DummyResponse({"rows": [
                {"keys": ["https://kamelifeguide.com/ranking-beginner-top10.html"],
                 "clicks": 2, "impressions": 100, "ctr": .02, "position": 14.2}
            ]})
        if json["dimensions"] == []:
            return DummyResponse({"rows": [
                {"clicks": 4, "impressions": 200, "ctr": .02, "position": 12.0}
            ]})
        return DummyResponse({"rows": []})


class TestGscDirectReport(unittest.TestCase):
    def test_date_window_is_inclusive(self):
        self.assertEqual(
            gsc.date_window(dt.date(2026, 10, 11), days=90, lag=3),
            ("2026-07-11", "2026-10-08"))
        with self.assertRaises(ValueError):
            gsc.date_window(days=0)

    def test_url_encodes_property_exactly(self):
        session = DummySession()
        report = gsc.build_report(
            session, "sc-domain:kamelifeguide.com", "2026-07-11", "2026-10-08")
        self.assertEqual(len(session.calls), 4)
        url, data, timeout = session.calls[0]
        self.assertIn("sc-domain%3Akamelifeguide.com", url)
        self.assertEqual(data["type"], "web")
        self.assertEqual(data["dataState"], "final")
        self.assertEqual(data["rowLimit"], 25000)
        self.assertEqual(report["totals"]["clicks"], 4)
        self.assertEqual(report["opportunities"][0]["priority"], "P0")

    def test_missing_rows_not_interpreted_as_error(self):
        self.assertEqual(gsc.parse_rows({}, ["page"]), [])

    def test_bad_dimension_count_fails(self):
        with self.assertRaises(ValueError):
            gsc.parse_rows({"rows": [{"keys": [], "clicks": 1}]}, ["page"])

    def test_does_not_call_any_site_write_endpoint(self):
        session = DummySession()
        gsc.query(session, "https://kamelifeguide.com/", "2026-09-01",
                  "2026-09-30", ["query"])
        self.assertTrue(all("/searchAnalytics/query" in url for url, _, _ in session.calls))
        self.assertEqual(len(session.calls), 1)

    def test_small_impression_pages_are_not_top_priority(self):
        rows = [
            {"page": "https://example.com/a", "clicks": 1,
             "impressions": 10, "ctr": .1, "position": 15},
            {"page": "https://example.com/b", "clicks": 2,
             "impressions": 200, "ctr": .01, "position": 9},
        ]
        candidates = gsc.prioritize(rows)
        self.assertEqual([x["page"] for x in candidates], ["https://example.com/b"])
        self.assertEqual(candidates[0]["priority"], "P1")


if __name__ == "__main__":
    unittest.main()
