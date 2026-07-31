#!/usr/bin/env python3
"""
Phase12 / Benchmark Department（競合研究部）

YouTube / TikTok / Instagram / GitHub を継続監視する。
**取得できない情報は「未取得」として行に残す。推測で埋めない。**

設計上の要点:
  - 到達可否を毎回**実測**してから記録する（前提を信じない）
  - 取得できなかった項目も `benchmark_observations` に status='unavailable' で残す。
    「観測しなかった」と「観測して取れなかった」を区別できるようにするため。
  - APIキーが要るソースは requires_key=1 として記録し、**無料枠の有無**も残す。
"""
import json, os, sys, subprocess, datetime, urllib.request, urllib.parse
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from odin_store import ensure, j, uj

# 監視項目（依頼どおり）
FIELDS = ["新着", "更新", "削除", "再生数", "動画時間", "カテゴリ",
          "編集手法", "サムネイル", "字幕構成", "投稿頻度"]

SOURCES = [
    dict(source="GitHub", endpoint="https://api.github.com/",
         requires_key=0, free_quota="認証時 5,000req/h（無料）",
         provides=["新着", "更新", "削除", "カテゴリ", "投稿頻度"]),
    dict(source="YouTube", endpoint="https://www.googleapis.com/youtube/v3/videos",
         requires_key=1, free_quota="YouTube Data API v3 は 10,000ユニット/日 まで無料",
         provides=["新着", "更新", "再生数", "動画時間", "カテゴリ", "サムネイル", "字幕構成", "投稿頻度"]),
    dict(source="TikTok", endpoint="https://www.tiktok.com/oembed",
         requires_key=0, free_quota="公式APIは審査制。oEmbedは限定情報のみ",
         provides=["動画時間", "サムネイル"]),
    dict(source="Instagram", endpoint="https://graph.instagram.com/",
         requires_key=1, free_quota="Graph API は無料枠あり（要アプリ審査）",
         provides=["新着", "再生数", "投稿頻度"]),
]

# 到達可否の実測（HTTPステータスをそのまま記録する）
def probe(url, timeout=12):
    try:
        p = subprocess.run(["curl", "-s", "-o", os.devnull, "-w", "%{http_code}",
                            "--max-time", str(timeout), url],
                           capture_output=True, text=True, timeout=timeout + 5)
        code = (p.stdout or "").strip() or "000"
    except Exception as e:
        return "000", str(e)[:120]
    # 000 = 接続自体が拒否/失敗。4xx は「到達はしている」＝ネットワーク的には可
    reachable = code != "000"
    return code, ("到達可（HTTP %s）" % code if reachable else "到達不可（接続拒否）")

def refresh_sources(con, at=None):
    ensure(con)
    at = at or datetime.date.today().isoformat()
    rows = []
    for s in SOURCES:
        code, note = probe(s["endpoint"])
        reachable = 1 if code != "000" else 0
        con.execute("INSERT OR REPLACE INTO benchmark_sources VALUES (?,?,?,?,?,?,?,?)",
                    (s["source"], s["endpoint"], reachable, code, s["requires_key"],
                     s["free_quota"], at, note))
        rows.append(dict(**s, reachable=bool(reachable), http_status=code, note=note))
    con.commit()
    return rows

def _record(con, source, external_id, field, value, status, reason=None, at=None):
    at = at or datetime.date.today().isoformat()
    con.execute("INSERT INTO benchmark_observations (source,external_id,observed_at,field,value,status,reason) "
                "VALUES (?,?,?,?,?,?,?)",
                (source, external_id, at, field, None if value is None else str(value), status, reason))

def observe_github(con, topics=None, at=None):
    """GitHub は到達可能なので実測する（新着・更新・カテゴリ・投稿頻度に相当）"""
    ensure(con)
    at = at or datetime.date.today().isoformat()
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    topics = topics or ["video-processing", "scene-detection", "computer-vision"]
    n = 0
    for t in topics:
        q = "topic:%s stars:>1000" % t
        url = "https://api.github.com/search/repositories?q=%s&sort=updated&per_page=5" % urllib.parse.quote(q)
        try:
            req = urllib.request.Request(url, headers={
                "Accept": "application/vnd.github+json", "User-Agent": "odin-benchmark",
                **({"Authorization": "Bearer " + token} if token else {})})
            with urllib.request.urlopen(req, timeout=25) as r:
                data = json.load(r)
        except Exception as e:
            msg = str(e)[:120]
            if "403" in msg:
                msg += "（このセッションはリポジトリスコープ制限により /search が使えない。"\
                       "GitHub Actions 上やオーナー環境では実測可能）"
            _record(con, "GitHub", "topic:" + t, "新着", None, "unavailable", msg, at)
            continue
        for it in data.get("items", []):
            fid = it["full_name"]
            _record(con, "GitHub", fid, "新着", it["created_at"][:10], "measured", None, at)
            _record(con, "GitHub", fid, "更新", it["updated_at"][:10], "measured", None, at)
            _record(con, "GitHub", fid, "カテゴリ", ",".join(it.get("topics") or [])[:200], "measured", None, at)
            _record(con, "GitHub", fid, "削除", "archived" if it.get("archived") else "active", "measured", None, at)
            _record(con, "GitHub", fid, "再生数", None, "unavailable", "GitHubに再生数の概念がない", at)
            for f in ("動画時間", "編集手法", "サムネイル", "字幕構成"):
                _record(con, "GitHub", fid, f, None, "unavailable", "GitHubでは取得対象外", at)
            n += 1
    con.commit()
    return n

def observe_video_platform(con, source, at=None):
    """YouTube/TikTok/Instagram。到達不可なら全項目を『未取得』として記録する。"""
    ensure(con)
    at = at or datetime.date.today().isoformat()
    row = con.execute("SELECT * FROM benchmark_sources WHERE source=?", (source,)).fetchone()
    if not row:
        raise ValueError("先に refresh_sources を実行してください")
    if not row["reachable"]:
        reason = "この実行環境から到達不可（HTTP %s / 接続拒否）" % row["http_status"]
    elif row["requires_key"]:
        reason = "到達可だがAPIキー未設定（%s）" % row["free_quota"]
    else:
        reason = None
    if reason:
        for f in FIELDS:
            _record(con, source, "-", f, None, "unavailable", reason, at)
        con.commit()
        return dict(source=source, measured=0, unavailable=len(FIELDS), reason=reason)
    return dict(source=source, measured=0, unavailable=0,
                reason="到達可・キー不要だが本バージョンでは収集未実装")

def run_all(con, at=None):
    ensure(con)
    at = at or datetime.date.today().isoformat()
    srcs = refresh_sources(con, at)
    got = observe_github(con, at=at)
    others = [observe_video_platform(con, s["source"], at) for s in SOURCES if s["source"] != "GitHub"]
    return dict(sources=srcs, github_repos_observed=got, others=others, observed_at=at)

def summary(con):
    ensure(con)
    srcs = [dict(r) for r in con.execute("SELECT * FROM benchmark_sources")]
    tot = con.execute("SELECT COUNT(*) FROM benchmark_observations").fetchone()[0]
    meas = con.execute("SELECT COUNT(*) FROM benchmark_observations WHERE status='measured'").fetchone()[0]
    by_src = {r[0]: dict(measured=r[1], unavailable=r[2]) for r in con.execute(
        "SELECT source, SUM(status='measured'), SUM(status='unavailable') "
        "FROM benchmark_observations GROUP BY source")}
    return dict(sources=srcs, observations=tot, measured=meas,
                unavailable=tot - meas, by_source=by_src)

def render(con):
    s = summary(con)
    L = ["# Benchmark Department（Phase12）", "",
         "観測 %d件（実測 %d / 未取得 %d）" % (s["observations"], s["measured"], s["unavailable"]), "",
         "## 監視ソースの到達可否（実測）", "",
         "| ソース | エンドポイント | 到達 | HTTP | APIキー | 無料枠 |",
         "|--------|--------------|------|------|---------|--------|"]
    for r in s["sources"]:
        L.append("| %s | %s | %s | %s | %s | %s |" % (
            r["source"], r["endpoint"], "可" if r["reachable"] else "**不可**",
            r["http_status"], "必要" if r["requires_key"] else "不要", r["free_quota"]))
    L += ["", "## ソース別の観測件数", "", "| ソース | 実測 | 未取得 |", "|--------|------|--------|"]
    for k, v in s["by_source"].items():
        L.append("| %s | %d | %d |" % (k, v["measured"] or 0, v["unavailable"] or 0))
    L += ["", "> **未取得は推測で埋めない。** 行として残し、理由を必ず記録する。",
          "> 「観測しなかった」と「観測して取れなかった」を区別するための設計。"]
    return "\n".join(L) + "\n"

if __name__ == "__main__":
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from video_intel import db as DB
    con = DB.connect(os.path.join(os.path.dirname(__file__), "..", "research", "titan.db"))
    print(json.dumps(run_all(con), ensure_ascii=False, indent=2)[:1500])
    print(render(con))
