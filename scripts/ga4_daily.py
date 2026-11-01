"""Read-only GA4 collection. Private output only; never configure credentials here."""
from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
import re
import sys
import time
from datetime import date, datetime, timedelta, timezone
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, build_opener, HTTPRedirectHandler
from zoneinfo import ZoneInfo

READ_SCOPE = "https://www.googleapis.com/auth/analytics.readonly"
DATA = "https://analyticsdata.googleapis.com/v1beta/"
ADMIN = "https://analyticsadmin.googleapis.com/v1beta/"
PARAMETERS = ("product_id", "provider", "location", "category", "species_slug",
              "tier", "source_page", "affiliate_vendor", "guide_category", "starter_kit_tier")


class Blocked(RuntimeError):
    """Messages contain fixed codes only, never remote response bodies."""


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise Blocked("API_REDIRECT_REFUSED")


class GoogleAPI:
    def __init__(self):
        self.token = os.environ.get("GA4_ACCESS_TOKEN")
        self.credentials = None
        self.opener = build_opener(NoRedirect())
        if not self.token:
            try:
                import google.auth
                from google.auth.transport.requests import Request as AuthRequest
                self.credentials, _ = google.auth.default(scopes=[READ_SCOPE])
                self.auth_request = AuthRequest()
            except Exception:
                raise Blocked("EXISTING_READONLY_AUTH_UNAVAILABLE") from None

    def call(self, url, body=None):
        if not url.startswith((DATA, ADMIN, "https://analyticsadmin.googleapis.com/v1alpha/")):
            raise Blocked("API_DESTINATION_REFUSED")
        for attempt in range(4):
            try:
                if self.credentials:
                    if not self.credentials.valid:
                        self.credentials.refresh(self.auth_request)
                    token = self.credentials.token
                else:
                    token = self.token
                request = Request(url, data=None if body is None else json.dumps(body).encode(),
                                  headers={"Authorization": "Bearer " + token,
                                           "Content-Type": "application/json"})
                with self.opener.open(request, timeout=45) as response:
                    return json.load(response)
            except HTTPError as error:
                code = error.code
                if code in (429, 500, 502, 503, 504) and attempt < 3:
                    delay = error.headers.get("Retry-After", "")
                    time.sleep(min(30, int(delay)) if delay.isdigit() else 2 ** attempt)
                    continue
                raise Blocked("API_HTTP_" + str(code)) from None
            except (URLError, TimeoutError):
                if attempt < 3:
                    time.sleep(2 ** attempt)
                    continue
                raise Blocked("API_NETWORK_UNAVAILABLE") from None
            except Blocked:
                raise
            except Exception:
                raise Blocked("API_AUTH_OR_RESPONSE_UNAVAILABLE") from None


def inventory(api, url, field):
    rows, tokens = [], set()
    token = None
    while True:
        response = api.call(url + ("?" + urlencode({"pageToken": token}) if token else ""))
        rows.extend(response.get(field, []))
        token = response.get("nextPageToken")
        if not token:
            return rows
        if token in tokens:
            raise Blocked("INVENTORY_PAGING_LOOP")
        tokens.add(token)


def windows(now, zone, days=28, lag=3, end=None):
    today = now.astimezone(ZoneInfo(zone)).date()
    finish = date.fromisoformat(end) if end else today - timedelta(days=lag)
    if days < 1 or lag < 3 or finish > today - timedelta(days=lag):
        raise Blocked("UNFINISHED_PERIOD_REFUSED")
    start = finish - timedelta(days=days - 1)
    previous_end = start - timedelta(days=1)
    return {"current": (start.isoformat(), finish.isoformat()),
            "previous": ((start - timedelta(days=days)).isoformat(), previous_end.isoformat())}


def exact(field, value):
    return {"filter": {"fieldName": field, "stringFilter": {
        "matchType": "EXACT", "value": value, "caseSensitive": True}}}


def quality(metadata):
    warnings = []
    for key in ("subjectToThresholding", "dataLossFromOtherRow", "schemaRestrictionResponse", "dataTruncationReasons"):
        if metadata.get(key):
            warnings.append(key)
    for sample in metadata.get("samplingMetadatas", []):
        if int(sample.get("samplesReadCount", 0)) < int(sample.get("samplingSpaceSize", 0)):
            warnings.append("sampling")
    if metadata.get("emptyReason"):
        warnings.append("emptyReason")
    return warnings


def run_report(api, prop, period, event, dimensions, host, stream, zone, page_size=10000):
    filt = {"andGroup": {"expressions": [exact("eventName", event), exact("hostName", host),
                                                exact("streamId", stream)]}}
    spec = {"dimensions": [{"name": x} for x in dimensions],
            "metrics": [{"name": "eventCount"}], "dimensionFilter": filt}
    compat = api.call(DATA + prop + ":checkCompatibility", spec)
    for field, name_field, expected in (("dimensionCompatibilities", "dimensionMetadata", dimensions),
                                        ("metricCompatibilities", "metricMetadata", ["eventCount"])):
        statuses = {x.get(name_field, {}).get("apiName"): x.get("compatibility")
                    for x in compat.get(field, [])}
        if any(statuses.get(name) != "COMPATIBLE" for name in expected):
            raise Blocked("REPORT_INCOMPATIBLE")
    body = dict(spec, dateRanges=[{"startDate": period[0], "endDate": period[1]}],
                keepEmptyRows=False, limit=str(page_size), returnPropertyQuota=True)
    if dimensions:
        body["orderBys"] = [{"dimension": {"dimensionName": x, "orderType": "ALPHANUMERIC"}}
                            for x in dimensions]
    rows, seen, metas = [], set(), []
    total_rows = None
    while True:
        result = api.call(DATA + prop + ":runReport", dict(body, offset=str(len(rows))))
        count = int(result.get("rowCount", 0))
        if total_rows is not None and total_rows != count:
            raise Blocked("REPORT_CHANGED_DURING_PAGING")
        total_rows = count
        meta = result.get("metadata", {})
        if meta.get("timeZone") != zone:
            raise Blocked("REPORT_TIMEZONE_MISMATCH")
        metas.append(meta)
        if [x["name"] for x in result.get("dimensionHeaders", [])] != dimensions:
            raise Blocked("REPORT_SCHEMA_MISMATCH")
        if [x["name"] for x in result.get("metricHeaders", [])] != ["eventCount"]:
            raise Blocked("REPORT_SCHEMA_MISMATCH")
        chunk = result.get("rows", [])
        for row in chunk:
            key = tuple(x["value"] for x in row.get("dimensionValues", []))
            value = row["metricValues"][0]["value"]
            if len(key) != len(dimensions) or key in seen or not re.fullmatch(r"\d+", value):
                raise Blocked("REPORT_ROW_INVALID_OR_DUPLICATE")
            seen.add(key)
            rows.append({"dimensions": list(key), "count": int(value)})
        if len(rows) == count:
            break
        if not chunk or len(rows) > count:
            raise Blocked("REPORT_TRUNCATED")
    return {"rows": rows, "row_count": total_rows, "metadata": metas,
            "warnings": sorted({w for m in metas for w in quality(m)}),
            "request": body}


def ratio(numerator, denominator):
    return None if denominator == 0 else round(100 * numerator / denominator, 4)


def change(current, previous):
    return {"absolute": current - previous, "percent": None if previous == 0 else
            round(100 * (current - previous) / previous, 4)}


def sum_rows(report):
    return sum(row["count"] for row in report["rows"])


def aggregate_pages(report):
    result = {}
    for row in report["rows"]:
        path = row["dimensions"][1]
        result[path] = result.get(path, 0) + row["count"]
    return result


def summarize(reports):
    output = {}
    for label, bundle in reports.items():
        totals = {event: sum_rows(bundle[event + "_total"]) for event in ("page_view", "affiliate_click")}
        warnings = sorted({w for report in bundle.values() for w in report.get("warnings", [])})
        for event in totals:
            if sum_rows(bundle[event]) != totals[event]:
                warnings.append(event + "_page_total_mismatch")
        pv, clicks = aggregate_pages(bundle["page_view"]), aggregate_pages(bundle["affiliate_click"])
        missing, products = {}, []
        for param in PARAMETERS:
            report = bundle.get("parameter:" + param)
            if report is None:
                missing[param] = {"rate_percent": None, "reason": "not_registered_or_not_queryable"}
                continue
            count = sum_rows(report)
            valid = not report["warnings"] and count == totals["affiliate_click"] and not warnings
            unset = sum(row["count"] for row in report["rows"] if row["dimensions"] == ["(not set)"])
            # Empty strings are not silently folded into GA4's documented (not set) bucket.
            ambiguous = any(row["dimensions"] in ([""], ["(other)"]) for row in report["rows"])
            missing[param] = {"bucket": "(not set)", "bucket_count": unset,
                              "dimension_total": count, "independent_total": totals["affiliate_click"],
                              "residual": totals["affiliate_click"] - count,
                              "reconciled": valid and not ambiguous,
                              "rate_percent": ratio(unset, count) if valid and not ambiguous else None,
                              "reason": "observed_bucket_not_proof_of_missing_send" if valid and not ambiguous
                              else "unreconciled_or_quality_limited"}
            if param == "product_id":
                products = sorted(report["rows"], key=lambda r: (-r["count"], r["dimensions"]))
        output[label] = {"totals": totals, "warnings": sorted(set(warnings)), "missing": missing,
                         "products_raw_ids": products, "pages": [
                             {"page": path, "page_view": pv.get(path, 0),
                              "affiliate_click": clicks.get(path, 0),
                              "clicks_per_100_pv": ratio(clicks.get(path, 0), pv.get(path, 0))
                              if not warnings else None}
                             for path in sorted(pv.keys() | clicks.keys())]}
    previous = {p["page"]: p for p in output["previous"]["pages"]}
    valid = not output["current"]["warnings"] and not output["previous"]["warnings"]
    present = {p["page"] for p in output["current"]["pages"]}
    for path in previous.keys() - present:
        output["current"]["pages"].append({"page": path, "page_view": 0, "affiliate_click": 0,
                                           "clicks_per_100_pv": None})
    for row in output["current"]["pages"]:
        old = previous.get(row["page"], {"page_view": 0, "affiliate_click": 0})
        row["previous"] = old
        row["change"] = {metric: change(row[metric], old[metric]) if valid else None
                         for metric in ("page_view", "affiliate_click")}
    output["comparison_available"] = valid
    output["total_change"] = {key: change(output["current"]["totals"][key], value) if valid else None
                              for key, value in output["previous"]["totals"].items()}
    old_products = {tuple(p["dimensions"]): p["count"] for p in output["previous"]["products_raw_ids"]}
    products = {tuple(p["dimensions"]): p["count"] for p in output["current"]["products_raw_ids"]}
    product_valid = valid and all(output[label]["missing"]["product_id"].get("reconciled", False)
                                  for label in ("current", "previous"))
    output["product_change"] = [{"raw_id": key[0], "current": products.get(key, 0),
                                 "previous": old_products.get(key, 0),
                                 "change": change(products.get(key, 0), old_products.get(key, 0))
                                 if product_valid else None}
                                for key in sorted(products.keys() | old_products.keys())]
    return output


def collect(api, property_id, host, measurement_id, days=28, lag=3, end=None, now=None):
    prop = "properties/" + property_id
    info = api.call(ADMIN + prop)
    zone = info.get("timeZone")
    if not zone:
        raise Blocked("PROPERTY_TIMEZONE_UNAVAILABLE")
    streams = inventory(api, ADMIN + prop + "/dataStreams", "dataStreams")
    matching = [s for s in streams if s.get("webStreamData", {}).get("measurementId") == measurement_id]
    if len(matching) != 1:
        raise Blocked("MEASUREMENT_STREAM_MAPPING_UNCONFIRMED")
    stream = matching[0]["name"].rsplit("/", 1)[1]
    definitions = inventory(api, ADMIN + prop + "/customDimensions", "customDimensions")
    metadata = api.call(DATA + prop + "/metadata")
    api_names = {d["apiName"] for d in metadata.get("dimensions", [])}
    registered = {d["parameterName"] for d in definitions if d.get("scope") == "EVENT"}
    mapping = {key: "customEvent:" + key for key in PARAMETERS
               if key in registered and "customEvent:" + key in api_names}
    periods = windows(now or datetime.now(timezone.utc), zone, days, lag, end)
    rules = {}
    for kind in ("eventCreateRules", "eventEditRules"):
        try:
            url = "https://analyticsadmin.googleapis.com/v1alpha/" + matching[0]["name"] + "/" + kind
            rules[kind] = {"status": "observed", "rows": inventory(api, url, kind)}
        except Blocked as error:
            rules[kind] = {"status": "unavailable", "reason": str(error)}
    reports = {}
    for label, period in periods.items():
        bundle = {}
        for event in ("page_view", "affiliate_click"):
            bundle[event] = run_report(api, prop, period, event, ["date", "pagePath"], host, stream, zone)
            bundle[event + "_total"] = run_report(api, prop, period, event, [], host, stream, zone)
        for param, name in mapping.items():
            bundle["parameter:" + param] = run_report(api, prop, period, "affiliate_click", [name],
                                                     host, stream, zone)
        reports[label] = bundle
    return {"schema_version": 1, "acquired_at_utc": datetime.now(timezone.utc).isoformat(),
            "status": "provisional_retrieved_snapshot_not_final", "periods": periods,
            "timezone": zone, "host": host, "stream_id": stream, "measurement_id": measurement_id,
            "lag_days": lag, "property": info, "custom_definitions": definitions,
            "custom_api_mapping": mapping, "event_rules": rules,
            "external_report_dependencies": "owner_confirmation_required",
            "reports": reports, "summary": summarize(reports)}


def markdown(data):
    summary = data["summary"]
    current = summary["current"]
    lines = ["# GA4 日次分析（暫定スナップショット）", "",
             f"取得: {data['acquired_at_utc']} / timezone: {data['timezone']}",
             f"対象: {data['host']} / 期間: {data['periods']}", "",
             "page_view完全一致のイベント数をPVとし、affiliate_clickは別クエリで取得。",
             "100PVあたりのクリック回数は実人数・購入率ではなく、100を超え得る。",
             "期間終了から日数を空けても確定値とは扱わない。毎日両期間を遅延再取得する。", "",
             f"総数: {current['totals']} / 品質制限: {current['warnings']}",
             f"前期との増減: {summary['total_change']}", "",
             "## ページ別（前期と等長・非重複）", "",
             "| ページ | PV | affiliate_click | 回/100PV | 前期PV | 前期クリック |",
             "|---|---:|---:|---:|---:|---:|"]
    def cell(value):
        if value is None:
            return "算出不能"
        text = str(value).replace("\n", " ").replace("\r", " ").replace("<", "&lt;")
        # Event parameter values and page paths are untrusted input. Prevent Markdown images/links.
        return re.sub(r"([\\`*_{}\[\]()#+!|>])", r"\\\1", text)
    for row in sorted(current["pages"], key=lambda p: (-p["page_view"], p["page"])):
        old = row["previous"]
        lines.append("| " + " | ".join(cell(x) for x in (row["page"], row["page_view"], row["affiliate_click"],
                     row["clicks_per_100_pv"], old["page_view"], old["affiliate_click"])) + " |")
    lines += ["", "## 改善優先の確認候補", ""]
    if current["warnings"]:
        lines += ["品質制限があるため優先順位・差分解釈を保留する。JSONのmetadataを確認する。"]
    else:
        candidates = sorted((p for p in current["pages"] if p["page_view"] >= 20),
                            key=lambda p: (p["clicks_per_100_pv"], -p["page_view"]))[:5]
        for p in candidates:
            lines.append(f"- {cell(p['page'])}: {p['page_view']}PV / {p['affiliate_click']}クリック。"
                         "閲覧機会に対してクリックが少ない候補。まず導線の可視性・適合性と計測欠落を確認。"
                         "PV20以上で回/100PVの低い順という確認用規則。因果や増収額の推定ではない。")
    lines += ["", "## 商品ID別（生ID保持・異体系を統合しない）", "",
              "| 商品ID | 今期クリック | 前期クリック | 増減 | 増減率% |", "|---|---:|---:|---:|---:|"]
    for row in sorted(summary["product_change"], key=lambda r: (-r["current"], r["raw_id"])):
        delta = row["change"] or {"absolute": None, "percent": None}
        lines.append("| " + " | ".join(cell(x) for x in (row["raw_id"], row["current"], row["previous"],
                                                       delta["absolute"], delta["percent"])) + " |")
    lines += ["", "## 未設定bucket", ""]
    for key, value in current["missing"].items():
        lines.append(f"- {key}: {cell(json.dumps(value, ensure_ascii=False))}")
    lines += ["", "登録名と送信キーを自動で別名対応しない。未設定bucket・残差は未送信の証明ではない。",
              "GA4はクリックまでの計測。購入・収益の優先判断には私的なASP実績との別照合が必要。", ""]
    return "\n".join(lines)


def private_output(path):
    target = Path(path).expanduser().resolve()
    repo = Path(__file__).resolve().parents[1]
    if target == repo or repo in target.parents:
        raise Blocked("OUTPUT_INSIDE_PUBLIC_REPOSITORY_REFUSED")
    for parent in (target, *target.parents):
        if (parent / ".git").exists():
            raise Blocked("OUTPUT_INSIDE_GIT_REPOSITORY_REFUSED")
    return target


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--property-id", required=True)
    parser.add_argument("--host", default="kamelifeguide.com")
    parser.add_argument("--measurement-id", default="G-QQTE5CVF3K")
    parser.add_argument("--days", type=int, default=28)
    parser.add_argument("--lag-days", type=int, default=3)
    parser.add_argument("--end-date")
    parser.add_argument("--output-dir", required=True, help="private local directory outside any repository")
    args = parser.parse_args()
    try:
        if not re.fullmatch(r"\d+", args.property_id) or not re.fullmatch(r"[A-Za-z0-9.-]+", args.host):
            raise Blocked("INVALID_PROPERTY_OR_HOST")
        destination = private_output(args.output_dir)
        data = collect(GoogleAPI(), args.property_id, args.host, args.measurement_id,
                       args.days, args.lag_days, args.end_date)
        destination.mkdir(parents=True, exist_ok=True, mode=0o700)
        # Unique names preserve earlier snapshots and avoid concurrent overwrites.
        stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
        for suffix, content in ((".json", json.dumps(data, ensure_ascii=False, indent=2)),
                                (".md", markdown(data))):
            path = destination / ("ga4-" + stamp + suffix)
            descriptor = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
            with os.fdopen(descriptor, "w", encoding="utf-8") as output:
                output.write(content)
        print("GA4_PRIVATE_REPORT_WRITTEN; PROVISIONAL")
        return 0
    except Blocked as error:
        print("BLOCKED: " + str(error), file=sys.stderr)
        return 2
    except Exception:
        # Tracebacks, request URLs and exception bodies may contain credentials or private rows.
        print("BLOCKED: LOCAL_CONFIGURATION_OR_OUTPUT_FAILURE", file=sys.stderr)
        return 2


if __name__ == "__main__":
    sys.exit(main())
