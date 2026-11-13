"""Offline synthetic fixtures only. No GA4 calls or credentials."""
import importlib.util
import io
from pathlib import Path
from datetime import datetime, timezone
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location("ga4_daily", Path(__file__).parents[1] / "scripts/ga4_daily.py")
ga = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ga)


class Fake:
    def __init__(self, dimensions, chunks):
        self.dimensions, self.chunks, self.calls = dimensions, iter(chunks), []

    def call(self, url, body=None):
        self.calls.append((url, body))
        if url.endswith(":checkCompatibility"):
            return {"dimensionCompatibilities": [
                {"dimensionMetadata": {"apiName": d}, "compatibility": "COMPATIBLE"}
                for d in self.dimensions], "metricCompatibilities": [
                    {"metricMetadata": {"apiName": "eventCount"}, "compatibility": "COMPATIBLE"}]}
        return next(self.chunks)


def response(dimensions, rows, row_count=None, **metadata):
    return {"rowCount": len(rows) if row_count is None else row_count,
            "dimensionHeaders": [{"name": x} for x in dimensions],
            "metricHeaders": [{"name": "eventCount"}],
            "metadata": {"timeZone": "America/Los_Angeles", **metadata},
            "rows": [{"dimensionValues": [{"value": x} for x in key],
                      "metricValues": [{"value": str(value)}]} for key, value in rows]}


def report(rows, warnings=()):
    return {"rows": [{"dimensions": key, "count": value} for key, value in rows], "warnings": list(warnings)}


def bundle(pv=10, clicks=14, product_total=14, warnings=()):
    return {"page_view": report([(["20261001", "/example"], pv)], warnings),
            "page_view_total": report([([], pv)]),
            "affiliate_click": report([(["20261001", "/example"], clicks)]),
            "affiliate_click_total": report([([], clicks)]),
            "parameter:product_id": report([(["raw_internal_id"], product_total - 2), (["(not set)"], 2)])}


class Tests(unittest.TestCase):
    def run_query(self, fake, dimensions=["pagePath"]):
        return ga.run_report(fake, "properties/123", ("2026-10-01", "2026-10-28"),
                             "page_view", dimensions, "example.test", "456", "America/Los_Angeles", 1)

    def test_paging_and_exact_independent_filters(self):
        fake = Fake(["pagePath"], [response(["pagePath"], [(["/a"], 1)], 2),
                                   response(["pagePath"], [(["/b"], 2)], 2)])
        result = self.run_query(fake)
        self.assertEqual(ga.sum_rows(result), 3)
        calls = [body for url, body in fake.calls if url.endswith(":runReport")]
        self.assertEqual([body["offset"] for body in calls], ["0", "1"])
        expressions = calls[0]["dimensionFilter"]["andGroup"]["expressions"]
        self.assertEqual([e["filter"]["fieldName"] for e in expressions], ["eventName", "hostName", "streamId"])
        self.assertTrue(all(e["filter"]["stringFilter"]["matchType"] == "EXACT" for e in expressions))
        self.assertEqual(expressions[0]["filter"]["stringFilter"]["value"], "page_view")

    def test_paging_failure_modes(self):
        first = response(["pagePath"], [(["/a"], 1)], 2)
        for second in (response(["pagePath"], [], 2), response(["pagePath"], [(["/a"], 1)], 2),
                       response(["pagePath"], [(["/b"], 1)], 3)):
            with self.subTest(second=second), self.assertRaises(ga.Blocked):
                self.run_query(Fake(["pagePath"], [first, second]))

    def test_schema_and_timezone(self):
        for value in (response(["wrong"], [(["/a"], 1)]),
                      response(["pagePath"], [(["/a"], 1)], timeZone="Asia/Tokyo")):
            with self.subTest(value=value), self.assertRaises(ga.Blocked):
                self.run_query(Fake(["pagePath"], [value]))

    def test_incompatibility(self):
        fake = Fake([], [])
        with self.assertRaisesRegex(ga.Blocked, "REPORT_INCOMPATIBLE"):
            self.run_query(fake)

    def test_quality_flags(self):
        flags = ga.quality({"subjectToThresholding": True, "dataLossFromOtherRow": True,
                            "samplingMetadatas": [{"samplesReadCount": "5", "samplingSpaceSize": "10"}],
                            "emptyReason": "example"})
        self.assertEqual(set(flags), {"subjectToThresholding", "dataLossFromOtherRow", "sampling", "emptyReason"})

    def test_ratios_zero_and_over_100(self):
        self.assertEqual(ga.ratio(14, 10), 140)
        self.assertIsNone(ga.ratio(1, 0))
        self.assertIsNone(ga.change(1, 0)["percent"])
        self.assertEqual(ga.change(0, 1), {"absolute": -1, "percent": -100})

    def test_dates_timezone_dst_equal_nonoverlap(self):
        now = datetime(2026, 11, 2, 2, tzinfo=timezone.utc)  # LA is still Nov 1.
        periods = ga.windows(now, "America/Los_Angeles")
        self.assertEqual(periods["current"], ("2026-10-02", "2026-10-29"))
        self.assertEqual(periods["previous"], ("2026-09-04", "2026-10-01"))
        with self.assertRaises(ga.Blocked):
            ga.windows(now, "America/Los_Angeles", end="2026-11-01")
        with self.assertRaises(ga.Blocked):
            ga.windows(now, "America/Los_Angeles", lag=1)

    def test_missing_product_reconciliation(self):
        result = ga.summarize({"current": bundle(), "previous": bundle()})
        self.assertEqual(result["current"]["pages"][0]["clicks_per_100_pv"], 140)
        self.assertEqual(result["current"]["missing"]["product_id"]["rate_percent"], 14.2857)
        self.assertIsNone(result["current"]["missing"]["provider"]["rate_percent"])
        result = ga.summarize({"current": bundle(product_total=8), "previous": bundle()})
        self.assertIsNone(result["current"]["missing"]["product_id"]["rate_percent"])
        self.assertEqual(result["current"]["missing"]["product_id"]["residual"], 6)
        self.assertIsNone(result["product_change"][0]["change"])

    def test_quality_suppresses_comparison_and_priority(self):
        result = ga.summarize({"current": bundle(warnings=["subjectToThresholding"]), "previous": bundle()})
        self.assertFalse(result["comparison_available"])
        self.assertIsNone(result["current"]["pages"][0]["clicks_per_100_pv"])
        self.assertIsNone(result["current"]["pages"][0]["change"]["page_view"])

    def test_truncated_period_suppresses_analysis_even_when_totals_match(self):
        warning = ga.quality({"dataTruncationReasons": [{"dataTruncationType": "DATA_TRUNCATION_TYPE_PROPERTY",
                                                        "dataTruncationDate": "2026-10-15"}]})
        self.assertEqual(warning, ["dataTruncationReasons"])
        current = bundle(warnings=warning)
        result = ga.summarize({"current": current, "previous": bundle()})
        self.assertFalse(result["comparison_available"])
        self.assertIsNone(result["total_change"]["affiliate_click"])
        self.assertIsNone(result["current"]["missing"]["product_id"]["rate_percent"])
        data = {"acquired_at_utc": "synthetic", "timezone": "America/Los_Angeles",
                "host": "example.test", "periods": {}, "summary": result}
        self.assertIn("優先順位・差分解釈を保留", ga.markdown(data))

    def test_total_mismatch_and_ambiguous_bucket(self):
        current = bundle()
        current["page_view_total"] = report([([], 99)])
        result = ga.summarize({"current": current, "previous": bundle()})
        self.assertIn("page_view_page_total_mismatch", result["current"]["warnings"])
        current = bundle()
        current["parameter:product_id"] = report([([""], 14)])
        result = ga.summarize({"current": current, "previous": bundle()})
        self.assertIsNone(result["current"]["missing"]["product_id"]["rate_percent"])

    def test_lost_pages_retained(self):
        current = bundle(pv=0, clicks=0, product_total=2)
        current["page_view"] = report([])
        current["affiliate_click"] = report([])
        result = ga.summarize({"current": current, "previous": bundle()})
        self.assertEqual(result["current"]["pages"][0]["change"]["page_view"]["percent"], -100)

    def test_private_output_repo_and_resolved_paths(self):
        root = Path(__file__).resolve().parents[1]
        with self.assertRaises(ga.Blocked):
            ga.private_output(root / "private-ga4")
        with tempfile.TemporaryDirectory(dir=Path(__file__).resolve().parents[2]) as temp:
            path = Path(temp)
            # Synthetic filesystem topology: the runner's /tmp or its checkout
            # parent may itself be a Git repository. Do not weaken production
            # protection just to make a temporary fixture look private.
            original = Path.exists
            for git_root in (None, path, path.parent):
                def exists(item):
                    if item.name == ".git":
                        return git_root is not None and item == git_root / ".git"
                    return original(item)
                with patch.object(Path, "exists", exists):
                    if git_root is None:
                        self.assertEqual(ga.private_output(path / "reports"), (path / "reports").resolve())
                    else:
                        with self.assertRaises(ga.Blocked):
                            ga.private_output(path / "reports")

    def test_no_remote_error_body_or_token_in_logs(self):
        import os
        import urllib.error
        with patch.dict(os.environ, {"GA4_ACCESS_TOKEN": "synthetic-secret"}):
            api = ga.GoogleAPI()
        error = urllib.error.HTTPError(ga.DATA, 403, "synthetic-secret", {}, io.BytesIO(b"private-rows"))
        with patch.object(api.opener, "open", side_effect=error):
            with self.assertRaisesRegex(ga.Blocked, "^API_HTTP_403$"):
                api.call(ga.DATA + "properties/123:runReport", {})

    def test_admin_inventory_pagination_loop(self):
        class Loop:
            def call(self, *args):
                return {"customDimensions": [], "nextPageToken": "repeat"}
        with self.assertRaisesRegex(ga.Blocked, "PAGING_LOOP"):
            ga.inventory(Loop(), ga.ADMIN + "properties/123/customDimensions", "customDimensions")

    def test_complete_collection_and_private_report(self):
        class FixtureAPI:
            def __init__(self):
                self.calls = []

            def call(self, url, body=None):
                self.calls.append((url, body))
                if url == ga.ADMIN + "properties/123":
                    return {"timeZone": "America/Los_Angeles"}
                if url.endswith("/dataStreams"):
                    return {"dataStreams": [{"name": "properties/123/dataStreams/456",
                            "webStreamData": {"measurementId": "G-TEST"}}]}
                if url.endswith("/customDimensions"):
                    return {"customDimensions": [{"parameterName": "product_id", "scope": "EVENT"},
                                                {"parameterName": "location", "scope": "USER"}]}
                if url.endswith("/metadata"):
                    return {"dimensions": [{"apiName": "customEvent:product_id"},
                                           {"apiName": "customUser:location"}]}
                if url.endswith("eventCreateRules"):
                    raise ga.Blocked("API_HTTP_403")
                if url.endswith("eventEditRules"):
                    return {}
                dims = [x["name"] for x in body["dimensions"]]
                if url.endswith(":checkCompatibility"):
                    return Fake(dims, []).call(url, body)
                self_test.assertTrue(url.endswith(":runReport"))
                event = body["dimensionFilter"]["andGroup"]["expressions"][0]["filter"]["stringFilter"]["value"]
                count = 100 if event == "page_view" else 2
                keys = [] if not dims else (["20261001", "/example"] if dims == ["date", "pagePath"] else ["(not set)"])
                return response(dims, [(keys, count)])
        self_test = self
        api = FixtureAPI()
        data = ga.collect(api, "123", "example.test", "G-TEST", now=datetime(2026, 11, 2, tzinfo=timezone.utc))
        self.assertEqual(data["custom_api_mapping"], {"product_id": "customEvent:product_id"})
        self.assertEqual(data["event_rules"]["eventCreateRules"]["status"], "unavailable")
        self.assertEqual(data["summary"]["current"]["totals"], {"page_view": 100, "affiliate_click": 2})
        self.assertEqual(data["summary"]["current"]["missing"]["product_id"]["rate_percent"], 100)
        text = ga.markdown(data)
        self.assertIn("/example", text)
        self.assertIn("暫定", text)
        self.assertTrue(all(url.startswith((ga.DATA, ga.ADMIN, "https://analyticsadmin.googleapis.com/v1alpha/"))
                            for url, _ in api.calls))
        malicious = "![private](https://example.test/image)"
        data["summary"]["current"]["pages"][0]["page"] = malicious
        self.assertNotIn(malicious, ga.markdown(data))

    def test_redirects_refused(self):
        with self.assertRaisesRegex(ga.Blocked, "API_REDIRECT_REFUSED"):
            ga.NoRedirect().redirect_request(None, None, 302, "", {}, "https://example.test")


if __name__ == "__main__":
    unittest.main()
