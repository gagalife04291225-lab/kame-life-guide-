#!/usr/bin/env python3
"""Read-only, no-subscription Google Search Console reporting.

Credentials come only from GSC_SERVICE_ACCOUNT_JSON in the environment.
Never commit reports or service-account keys to the public site repository.
"""
import datetime as dt
import json
import os
import pathlib
import sys
import urllib.error
import urllib.parse

from google.auth.transport.requests import AuthorizedSession
from google.oauth2.service_account import Credentials

SCOPE = "https://www.googleapis.com/auth/webmasters.readonly"
API = "https://www.googleapis.com/webmasters/v3/sites/{}/searchAnalytics/query"


def date_window(today=None, days=90, lag=3):
    if today is None:
        today = dt.datetime.now(dt.timezone.utc).date()
    if not (1 <= days <= 365 and 2 <= lag <= 30):
        raise ValueError("GSC_DAYS must be 1..365 and GSC_LAG_DAYS must be 2..30")
    end = today - dt.timedelta(days=lag)
    return (end - dt.timedelta(days=days - 1)).isoformat(), end.isoformat()


def parse_rows(response, dimensions):
    parsed = []
    for row in response.get("rows", []):
        keys = row.get("keys", [])
        if len(keys) != len(dimensions):
            raise ValueError("Unexpected Search Console dimension keys")
        item = dict(zip(dimensions, keys))
        item.update({
            "clicks": row["clicks"],
            "impressions": row["impressions"],
            "ctr": row["ctr"],
            "position": row["position"],
        })
        parsed.append(item)
    return parsed


def query(session, site_url, start, end, dimensions, max_rows=25000):
    url = API.format(urllib.parse.quote(site_url, safe=""))
    rows = []
    offset = 0
    while offset < max_rows:
        limit = min(25000, max_rows - offset)
        response = session.post(url, json={
            "startDate": start, "endDate": end, "type": "web",
            "dataState": "final", "dimensions": dimensions,
            "rowLimit": limit, "startRow": offset,
        }, timeout=45)
        if not response.ok:
            # Do not print tokens or arbitrary server response bodies.
            raise RuntimeError(
                "Search Console API returned HTTP {}. Check that the API is enabled, "
                "the exact GSC_SITE_URL property exists, and the service-account email "
                "has Search Console access.".format(response.status_code))
        batch = parse_rows(response.json(), dimensions)
        rows.extend(batch)
        if len(batch) < limit:
            break
        offset += len(batch)
    return rows


def prioritize(pages):
    """Decision-rules shortlist, not a claim of causal revenue impact."""
    choices = []
    for p in pages:
        if p["impressions"] < 20:
            continue
        pos, ctr = p["position"], p["ctr"]
        if 11 <= pos <= 20:
            priority = "P0"
        elif 4 <= pos < 11 and ctr < 0.03:
            priority = "P1"
        else:
            continue
        choices.append({
            "page": p["page"], "priority": priority,
            "clicks": p["clicks"], "impressions": p["impressions"],
            "ctr": ctr, "position": pos
        })
    return sorted(choices, key=lambda r: (r["priority"] != "P0", -r["impressions"]))[:10]


def build_report(session, site_url, start, end):
    summary_rows = query(session, site_url, start, end, [])
    pages = query(session, site_url, start, end, ["page"])
    queries = query(session, site_url, start, end, ["query"])
    page_queries = query(session, site_url, start, end, ["page", "query"])
    return {
        "site": site_url, "startDate": start, "endDate": end,
        "source": "Google Search Console Search Analytics API; finalized web data",
        "note": "Search Console returns top rows, not necessarily all queries; "
                "page/query totals should not be added together.",
        "totals": summary_rows[0] if summary_rows else None,
        "pages": pages, "queries": queries, "pageQueries": page_queries,
        "opportunities": prioritize(pages),
    }


def main():
    raw = os.environ.get("GSC_SERVICE_ACCOUNT_JSON", "")
    site = os.environ.get("GSC_SITE_URL", "").strip()
    if not raw or not site:
        raise ValueError(
            "BLOCKED_SETUP: configure the GSC_SERVICE_ACCOUNT_JSON secret "
            "and GSC_SITE_URL repository variable first.")
    if not (site.startswith("sc-domain:") or site.startswith("https://") or site.startswith("http://")):
        raise ValueError("GSC_SITE_URL must exactly match a Search Console property.")
    try:
        info = json.loads(raw)
        if info.get("type") != "service_account":
            raise ValueError("Expected a Google service-account JSON key")
        credentials = Credentials.from_service_account_info(info, scopes=[SCOPE])
    except (json.JSONDecodeError, KeyError, ValueError) as exc:
        raise ValueError("Invalid service-account JSON secret") from exc
    start, end = date_window(days=int(os.environ.get("GSC_DAYS", "90")),
                             lag=int(os.environ.get("GSC_LAG_DAYS", "3")))
    report = build_report(AuthorizedSession(credentials), site, start, end)
    target = pathlib.Path(os.environ.get("GSC_OUTPUT", "/tmp/gsc-private-report.json"))
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    # Do not send query terms or private traffic numbers to public Actions logs.
    print("PASS: GSC API report generated; period {} to {}. Report kept off git.".format(start, end))
    private = os.environ.get("GSC_REPOSITORY_PRIVATE", "false").lower() == "true"
    allow_public = os.environ.get("GSC_ALLOW_PUBLIC_SUMMARY", "").lower() == "true"
    summary_path = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary_path:
        with open(summary_path, "a", encoding="utf-8") as fp:
            fp.write("### Direct GSC API check\n\n")
            fp.write("Fetch passed; finalized data {} to {}.\n\n".format(start, end))
            if private or allow_public:
                total = report["totals"] or {}
                fp.write("Clicks: {} · Impressions: {} · CTR: {:.2%} · Position: {:.2f}\n\n".format(
                    total.get("clicks", 0), total.get("impressions", 0),
                    total.get("ctr", 0), total.get("position", 0)))
                fp.write("#### Priority candidates (not yet validated changes)\n\n")
                for row in report["opportunities"][:3]:
                    fp.write("- {}: {} — {} impressions, {} clicks, position {:.2f}\n".format(
                        row["priority"], row["page"], row["impressions"],
                        row["clicks"], row["position"]))
            else:
                fp.write("Public repository: detailed site metrics and queries were withheld.\n")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as exc:
        # Google errors may contain private details; emit only our controlled messages.
        print("ERROR: {}".format(str(exc)), file=sys.stderr)
        sys.exit(1)
