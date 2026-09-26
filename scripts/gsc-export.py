#!/usr/bin/env python3
"""Export Google Search Console Search Analytics data to CSV/JSON.

Authentication uses a Google service-account JSON file with read access to the
Search Console property. The caller must grant the service-account email access
to the property in Search Console.
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import sys
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from tempfile import TemporaryDirectory
from typing import Any, Iterable

SCOPE = "https://www.googleapis.com/auth/webmasters.readonly"
ROW_LIMIT = 25_000
DEFAULT_LAG_DAYS = 3


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Export Search Console Search Analytics data")
    parser.add_argument("--site-url", default=os.getenv("GSC_SITE_URL"))
    parser.add_argument("--credentials", default=os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))
    parser.add_argument("--days", type=int, default=90)
    parser.add_argument("--lag-days", type=int, default=DEFAULT_LAG_DAYS)
    parser.add_argument("--start-date", help="YYYY-MM-DD; overrides --days")
    parser.add_argument("--end-date", help="YYYY-MM-DD; defaults to today minus --lag-days")
    parser.add_argument("--output-dir", default="artifacts/gsc")
    parser.add_argument("--self-test", action="store_true")
    return parser.parse_args()


def parse_iso_day(value: str) -> date:
    try:
        return date.fromisoformat(value)
    except ValueError as exc:
        raise SystemExit(f"Invalid date '{value}'. Expected YYYY-MM-DD.") from exc


def resolve_window(args: argparse.Namespace) -> tuple[date, date]:
    if args.days < 1:
        raise SystemExit("--days must be >= 1")
    if args.lag_days < 0:
        raise SystemExit("--lag-days must be >= 0")
    end = parse_iso_day(args.end_date) if args.end_date else date.today() - timedelta(days=args.lag_days)
    start = parse_iso_day(args.start_date) if args.start_date else end - timedelta(days=args.days - 1)
    if start > end:
        raise SystemExit("start date must be <= end date")
    return start, end


def build_service(credentials_path: str):
    if not credentials_path:
        raise SystemExit("Missing credentials. Set GOOGLE_APPLICATION_CREDENTIALS or pass --credentials.")
    path = Path(credentials_path)
    if not path.is_file():
        raise SystemExit(f"Credentials file not found: {path}")

    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
    except ImportError as exc:
        raise SystemExit(
            "Missing Google API dependencies. Install google-api-python-client and google-auth."
        ) from exc

    credentials = service_account.Credentials.from_service_account_file(
        str(path), scopes=[SCOPE]
    )
    return build("searchconsole", "v1", credentials=credentials, cache_discovery=False)


def fetch_rows(
    service: Any,
    site_url: str,
    start: date,
    end: date,
    dimensions: list[str],
    search_type: str = "web",
) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    start_row = 0

    while True:
        body = {
            "startDate": start.isoformat(),
            "endDate": end.isoformat(),
            "dimensions": dimensions,
            "type": search_type,
            "rowLimit": ROW_LIMIT,
            "startRow": start_row,
            "dataState": "final",
        }
        response = service.searchanalytics().query(siteUrl=site_url, body=body).execute()
        batch = response.get("rows", [])
        rows.extend(batch)
        if len(batch) < ROW_LIMIT:
            break
        start_row += len(batch)

    return rows


def normalized_records(rows: Iterable[dict[str, Any]], dimensions: list[str]) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    for row in rows:
        keys = row.get("keys", [])
        record: dict[str, Any] = {
            dimension: keys[index] if index < len(keys) else ""
            for index, dimension in enumerate(dimensions)
        }
        record.update(
            clicks=row.get("clicks", 0),
            impressions=row.get("impressions", 0),
            ctr=row.get("ctr", 0),
            position=row.get("position", 0),
        )
        records.append(record)
    return records


def write_csv(path: Path, rows: list[dict[str, Any]], dimensions: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fields = [*dimensions, "clicks", "impressions", "ctr", "position"]
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows(normalized_records(rows, dimensions))


def metric_summary(rows: list[dict[str, Any]]) -> dict[str, Any]:
    clicks = sum(float(row.get("clicks", 0)) for row in rows)
    impressions = sum(float(row.get("impressions", 0)) for row in rows)
    return {
        "rows": len(rows),
        "rowSumClicks": round(clicks, 3),
        "rowSumImpressions": round(impressions, 3),
        "rowSumCtr": round(clicks / impressions, 6) if impressions else 0,
        "note": "Row sums are dimensioned exports and may exclude anonymized/top-row-limited data.",
    }


def export_dataset(
    service: Any,
    site_url: str,
    start: date,
    end: date,
    output_dir: Path,
) -> dict[str, Any]:
    specs = {
        "pages": ["page"],
        "queries": ["query"],
        "page-query": ["page", "query"],
    }
    summary: dict[str, Any] = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "siteUrl": site_url,
        "startDate": start.isoformat(),
        "endDate": end.isoformat(),
        "searchType": "web",
        "exports": {},
    }

    for name, dimensions in specs.items():
        rows = fetch_rows(service, site_url, start, end, dimensions)
        write_csv(output_dir / f"{name}.csv", rows, dimensions)
        summary["exports"][name] = metric_summary(rows)

    (output_dir / "summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    return summary


def run_self_test() -> int:
    sample = [
        {
            "keys": ["https://example.com/a", "亀 飼い方"],
            "clicks": 5,
            "impressions": 100,
            "ctr": 0.05,
            "position": 8.2,
        }
    ]
    with TemporaryDirectory() as tmp:
        path = Path(tmp) / "sample.csv"
        write_csv(path, sample, ["page", "query"])
        text = path.read_text(encoding="utf-8-sig")
        expected = "page,query,clicks,impressions,ctr,position"
        if expected not in text or "亀 飼い方" not in text:
            print("SELF-TEST FAIL", file=sys.stderr)
            return 1
    print("SELF-TEST PASS")
    return 0


def main() -> int:
    args = parse_args()
    if args.self_test:
        return run_self_test()
    if not args.site_url:
        raise SystemExit("Missing Search Console property. Set GSC_SITE_URL or pass --site-url.")

    start, end = resolve_window(args)
    output_dir = Path(args.output_dir)
    service = build_service(args.credentials)

    try:
        summary = export_dataset(service, args.site_url, start, end, output_dir)
    except Exception as exc:
        # Do not dump credential material; Google client errors are safe to summarize.
        print(f"GSC export failed: {type(exc).__name__}: {exc}", file=sys.stderr)
        return 1

    print(
        "GSC export complete:",
        summary["siteUrl"],
        summary["startDate"],
        "to",
        summary["endDate"],
    )
    for name, metrics in summary["exports"].items():
        print(f"  {name}: {metrics['rows']} rows")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
