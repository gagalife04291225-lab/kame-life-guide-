#!/usr/bin/env python3
"""
KAME LIFE GUIDE / アクセス数の取得ツール（GA4 + Search Console）

このツールが存在する理由:
  この実行環境からは GA4 と Search Console の**画面**（analytics.google.com /
  search.google.com）に到達できない（組織のegressポリシーで403）。
  しかし **API は到達できる**ことを実測で確認した。

    analyticsdata.googleapis.com   → HTTP 401（認証が要るだけ。到達可）
    searchconsole.googleapis.com   → HTTP 401（同上）
    oauth2.googleapis.com/token    → HTTP 400（正常応答。到達可）

  つまり残る壁は**認証だけ**。サービスアカウントの鍵さえあれば数字が取れる。
  そのための配線を先に全部済ませてある。

費用: 無料（GA4 Data API / Search Console API とも無料枠内。追加課金なし）

使い方:
  # 1) 疎通と準備の確認（鍵なしで実行できる）
  python3 tools/analytics_fetch.py --selftest

  # 2) 実データを取る
  python3 tools/analytics_fetch.py \
      --key /path/to/service-account.json \
      --ga4-property 123456789 \
      --site https://kamelifeguide.com/ \
      --days 28

必要なもの（オーナー作業）:
  A. Google Cloud でサービスアカウントを作り、JSONキーをダウンロード
     （Google Analytics Data API と Search Console API を有効化）
  B. GA4 → 管理 → プロパティのアクセス管理 →
     そのサービスアカウントのメールアドレスを「閲覧者」で追加
  C. GA4 → 管理 → プロパティ設定 の右上にある **数値のプロパティID**（10桁前後）
     ※ G-QQTE5CVF3K は測定IDであって、これとは別物
  D. Search Console → 設定 → ユーザーと権限 →
     同じメールアドレスを「制限付き」以上で追加

セキュリティ:
  鍵は PAT と同じ扱いにする。**使ったら失効させる。使い回さない。**
  このツールは鍵をリポジトリに書き込まない。標準出力にも出さない。
"""
import argparse, base64, datetime, json, os, sys, time, urllib.request, urllib.error

TOKEN_URL = "https://oauth2.googleapis.com/token"
GA4_URL   = "https://analyticsdata.googleapis.com/v1beta/properties/%s:runReport"
GSC_URL   = "https://searchconsole.googleapis.com/webmasters/v3/sites/%s/searchAnalytics/query"
SCOPES = ("https://www.googleapis.com/auth/analytics.readonly "
          "https://www.googleapis.com/auth/webmasters.readonly")
OUTDIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                      "tiktok", "research")

# ───────────────────────── HTTP ─────────────────────────

def post(url, data, headers=None, form=False):
    body = (urllib.parse.urlencode(data).encode() if form
            else json.dumps(data).encode())
    h = {"Content-Type": "application/x-www-form-urlencoded" if form else "application/json"}
    h.update(headers or {})
    req = urllib.request.Request(url, data=body, headers=h, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=40) as r:
            return r.status, json.load(r)
    except urllib.error.HTTPError as e:
        raw = e.read().decode(errors="ignore")
        try:
            return e.code, json.loads(raw)
        except Exception:
            return e.code, {"raw": raw[:400]}
    except Exception as e:
        return 0, {"error": str(e)[:200]}

import urllib.parse  # noqa: E402  (post() で使う)

# ───────────────────────── 認証 ─────────────────────────

def access_token(key_path):
    """サービスアカウントJSON → JWT署名 → アクセストークン"""
    import jwt  # PyJWT
    with open(key_path, encoding="utf-8") as f:
        sa = json.load(f)
    for k in ("client_email", "private_key", "token_uri"):
        if k not in sa:
            raise SystemExit("鍵ファイルの形式が違います（%s がありません）" % k)
    now = int(time.time())
    assertion = jwt.encode(
        {"iss": sa["client_email"], "scope": SCOPES, "aud": TOKEN_URL,
         "iat": now, "exp": now + 3600},
        sa["private_key"], algorithm="RS256")
    st, res = post(sa.get("token_uri", TOKEN_URL),
                   {"grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
                    "assertion": assertion}, form=True)
    if st != 200 or "access_token" not in res:
        raise SystemExit("トークン取得に失敗（HTTP %s）: %s" % (st, json.dumps(res, ensure_ascii=False)[:300]))
    return res["access_token"], sa["client_email"]

# ───────────────────────── GA4 ─────────────────────────

def ga4_report(token, prop, days, dimensions, metrics, limit=20):
    body = {
        "dateRanges": [{"startDate": "%ddaysAgo" % days, "endDate": "today"}],
        "dimensions": [{"name": d} for d in dimensions],
        "metrics": [{"name": m} for m in metrics],
        "limit": limit,
    }
    st, res = post(GA4_URL % prop, body, {"Authorization": "Bearer " + token})
    if st != 200:
        return None, "HTTP %s %s" % (st, json.dumps(res, ensure_ascii=False)[:260])
    rows = []
    for r in res.get("rows", []):
        rows.append([d.get("value") for d in r.get("dimensionValues", [])] +
                    [m.get("value") for m in r.get("metricValues", [])])
    return rows, None

def ga4_totals(token, prop, days):
    body = {"dateRanges": [{"startDate": "%ddaysAgo" % days, "endDate": "today"}],
            "metrics": [{"name": m} for m in
                        ("activeUsers", "sessions", "screenPageViews",
                         "userEngagementDuration", "engagedSessions")]}
    st, res = post(GA4_URL % prop, body, {"Authorization": "Bearer " + token})
    if st != 200:
        return None, "HTTP %s %s" % (st, json.dumps(res, ensure_ascii=False)[:260])
    row = (res.get("rows") or [{}])[0]
    vals = [m.get("value") for m in row.get("metricValues", [])]
    keys = ["ユーザー数", "セッション数", "ページビュー", "総エンゲージメント時間(秒)", "エンゲージセッション"]
    return dict(zip(keys, vals)), None

# ───────────────────────── Search Console ─────────────────────────

def gsc_query(token, site, days, dimensions, limit=20):
    end = datetime.date.today()
    start = end - datetime.timedelta(days=days)
    body = {"startDate": start.isoformat(), "endDate": end.isoformat(),
            "dimensions": dimensions, "rowLimit": limit}
    st, res = post(GSC_URL % urllib.parse.quote(site, safe=""), body,
                   {"Authorization": "Bearer " + token})
    if st != 200:
        return None, "HTTP %s %s" % (st, json.dumps(res, ensure_ascii=False)[:260])
    return res.get("rows", []), None

# ───────────────────────── 自己診断（鍵なしで実行可） ─────────────────────────

def selftest():
    print("=== 疎通と準備の確認（鍵は不要） ===")
    ok = True
    # 署名ライブラリ
    try:
        import jwt, cryptography
        print("  [OK] 署名ライブラリ  PyJWT %s / cryptography %s" % (jwt.__version__, cryptography.__version__))
    except Exception as e:
        print("  [NG] 署名ライブラリ  %s" % e); ok = False
    # 各エンドポイントの到達性
    checks = [
        ("OAuthトークン発行", TOKEN_URL, {"grant_type": "ping"}, True, (400,)),
        ("GA4 Data API", GA4_URL % "0", {"dateRanges": [{"startDate": "7daysAgo", "endDate": "today"}],
                                          "metrics": [{"name": "sessions"}]}, False, (401, 403)),
        ("Search Console API", GSC_URL % urllib.parse.quote("https://example.com/", safe=""),
         {"startDate": "2026-01-01", "endDate": "2026-01-07"}, False, (401, 403)),
    ]
    for name, url, body, form, expect in checks:
        st, res = post(url, body, form=form)
        good = st in expect
        print("  [%s] %-20s HTTP %s%s" % ("OK" if good else "NG", name, st,
              "  （認証が要るだけ＝到達可）" if st in (401, 403) else
              "  （正常応答＝到達可）" if st == 400 else "  ← 到達できていない"))
        ok = ok and good
    print()
    print("  結論: %s" % ("**ネットワークと署名の準備は完了。あとは鍵だけ。**" if ok
                          else "到達できない経路がある。上のNGを確認すること。"))
    print()
    print("  鍵が用意できたら、この1行で数字が出ます:")
    print("    python3 tools/analytics_fetch.py --key sa.json --ga4-property <数値ID> \\")
    print("        --site https://kamelifeguide.com/ --days 28")
    return 0 if ok else 1

# ───────────────────────── 出力 ─────────────────────────

def render(days, totals, pages, sources, gsc_tot, gsc_pages, gsc_queries, tiktok):
    L = ["# カメライフガイド アクセスレポート（実測）", "",
         "取得日: %s ／ 期間: 直近%d日" % (datetime.date.today().isoformat(), days),
         "取得元: GA4 Data API / Search Console API（いずれも無料枠内）", "",
         "> 空欄は**未取得**。推測で埋めていません。", ""]
    if totals:
        L += ["## 全体（GA4）", "", "| 指標 | 値 |", "|------|-----|"]
        L += ["| %s | %s |" % (k, v) for k, v in totals.items()]
        L.append("")
    if pages:
        L += ["## よく見られたページ 上位（GA4）", "",
              "| ページ | 表示回数 | ユーザー数 |", "|--------|---------|-----------|"]
        L += ["| %s | %s | %s |" % (r[0], r[1], r[2]) for r in pages]
        L.append("")
    if sources:
        L += ["## 流入元（GA4）", "", "| 参照元/メディア | セッション | ユーザー |",
              "|----------------|-----------|---------|"]
        L += ["| %s / %s | %s | %s |" % (r[0], r[1], r[2], r[3]) for r in sources]
        L.append("")
    if tiktok is not None:
        L += ["## TikTok流入（utm_source=tiktok）", "",
              ("**%s セッション**" % tiktok) if tiktok else "**0セッション**（まだ公開していない／計測できていない）", ""]
    if gsc_tot:
        L += ["## 検索（Search Console）", "", "| 指標 | 値 |", "|------|-----|"]
        L += ["| クリック | %s |" % gsc_tot.get("clicks"),
              "| 表示回数 | %s |" % gsc_tot.get("impressions"),
              "| CTR | %.2f%% |" % (100*gsc_tot.get("ctr", 0)),
              "| 平均掲載順位 | %.1f |" % gsc_tot.get("position", 0), ""]
    if gsc_queries:
        L += ["### 検索クエリ 上位", "", "| クエリ | クリック | 表示 | CTR | 順位 |",
              "|--------|---------|------|-----|------|"]
        L += ["| %s | %s | %s | %.1f%% | %.1f |" % (r["keys"][0], r["clicks"], r["impressions"],
                                                    100*r["ctr"], r["position"]) for r in gsc_queries]
        L.append("")
    if gsc_pages:
        L += ["### 検索で表示されたページ 上位", "", "| ページ | クリック | 表示 | 順位 |",
              "|--------|---------|------|------|"]
        L += ["| %s | %s | %s | %.1f |" % (r["keys"][0], r["clicks"], r["impressions"], r["position"])
              for r in gsc_pages]
    return "\n".join(L) + "\n"

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--selftest", action="store_true", help="鍵なしで疎通と準備を確認する")
    ap.add_argument("--key", help="サービスアカウントのJSONキー")
    ap.add_argument("--ga4-property", dest="prop", help="GA4の数値プロパティID")
    ap.add_argument("--site", default="https://kamelifeguide.com/", help="Search Consoleのサイト")
    ap.add_argument("--days", type=int, default=28)
    ap.add_argument("--out", default=os.path.join(OUTDIR, "analytics-report.md"))
    a = ap.parse_args()

    if a.selftest or not a.key:
        if not a.key and not a.selftest:
            print("※ --key が無いので自己診断のみ実行します\n")
        return selftest()

    token, who = access_token(a.key)
    print("認証OK: %s" % who)
    totals = pages = sources = tiktok = None
    gsc_tot = gsc_pages = gsc_queries = None

    if a.prop:
        totals, err = ga4_totals(token, a.prop, a.days)
        if err: print("  GA4 全体: 取得失敗 %s" % err)
        pages, err = ga4_report(token, a.prop, a.days, ["pagePath"],
                                ["screenPageViews", "activeUsers"], 20)
        if err: print("  GA4 ページ: 取得失敗 %s" % err)
        sources, err = ga4_report(token, a.prop, a.days, ["sessionSource", "sessionMedium"],
                                  ["sessions", "activeUsers"], 15)
        if err: print("  GA4 流入元: 取得失敗 %s" % err)
        if sources:
            tiktok = sum(int(r[2]) for r in sources if "tiktok" in (r[0] or "").lower())

    if a.site:
        rows, err = gsc_query(token, a.site, a.days, [])
        if err: print("  GSC 全体: 取得失敗 %s" % err)
        elif rows: gsc_tot = rows[0]
        gsc_queries, err = gsc_query(token, a.site, a.days, ["query"], 15)
        if err: print("  GSC クエリ: 取得失敗 %s" % err)
        gsc_pages, err = gsc_query(token, a.site, a.days, ["page"], 15)
        if err: print("  GSC ページ: 取得失敗 %s" % err)

    md = render(a.days, totals, pages, sources, gsc_tot, gsc_pages, gsc_queries, tiktok)
    os.makedirs(os.path.dirname(a.out), exist_ok=True)
    open(a.out, "w", encoding="utf-8").write(md)
    json.dump(dict(fetched_at=datetime.date.today().isoformat(), days=a.days,
                   ga4_totals=totals, ga4_pages=pages, ga4_sources=sources,
                   tiktok_sessions=tiktok, gsc_totals=gsc_tot,
                   gsc_queries=gsc_queries, gsc_pages=gsc_pages),
              open(a.out.replace(".md", ".json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=2)
    print(md)
    print("保存: %s" % a.out)
    print("\n★ 作業が終わったらサービスアカウントの鍵を失効させてください。")
    return 0

if __name__ == "__main__":
    sys.exit(main())
