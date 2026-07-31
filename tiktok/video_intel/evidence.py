#!/usr/bin/env python3
"""
Phase16 / Evidence Engine

**すべての提案は Evidence ID を持たなければならない。**
提案だけを表示することを、コードのレベルで禁止する。

Evidence が参照できるもの:
  video_ids       解析済み動画の sha1
  metric_refs     実測値（{"sha1": {"metric": value}} または {"metric": value}）
  stat_refs       統計結果（Welch t / Pearson の生の出力）
  experiment_ids  実験ID
  knowledge_ids   知識ID
  source_docs     外部文献（ファイルパスや出典名。研究レポートの記号IDなど）

空の Evidence は作れない。作ろうとすると EvidenceError を投げる。
"""
import datetime
from odin_store import ensure, next_id, j, uj

class EvidenceError(Exception):
    """根拠なしに提案を出そうとしたときに投げる"""

def create(con, kind, video_ids=None, metric_refs=None, stat_refs=None,
           experiment_ids=None, knowledge_ids=None, source_docs=None, note=None,
           created_at=None):
    ensure(con)
    refs = [video_ids, metric_refs, stat_refs, experiment_ids, knowledge_ids, source_docs]
    if not any(r for r in refs):
        raise EvidenceError(
            "Evidence が空です。動画・実測値・統計・実験・知識・文献のいずれかを必ず参照してください。"
            "（根拠なしの提案は ODIN では作れません）")
    evid = next_id(con, "evidence", "evid", "EV")
    con.execute("INSERT INTO evidence VALUES (?,?,?,?,?,?,?,?,?,?)",
                (evid, kind, created_at or datetime.date.today().isoformat(),
                 j(video_ids), j(metric_refs), j(stat_refs), j(experiment_ids),
                 j(knowledge_ids), j(source_docs), note))
    con.commit()
    return evid

def get(con, evid):
    ensure(con)
    r = con.execute("SELECT * FROM evidence WHERE evid=?", (evid,)).fetchone()
    if not r:
        return None
    d = dict(r)
    for k in ("video_ids", "metric_refs", "stat_refs", "experiment_ids", "knowledge_ids", "source_docs"):
        d[k] = uj(d[k])
    return d

def require(obj, field="evidence_id"):
    """提案オブジェクトが Evidence を持っているか検査する。持っていなければ例外。"""
    if not isinstance(obj, dict) or not obj.get(field):
        raise EvidenceError("提案に %s がありません。Evidence のない提案は表示できません。" % field)
    return obj

def attach_to_findings(con, findings, video_sha1, metrics, source_doc="tiktok/DESIGN-SYSTEM.md"):
    """AI Director の指摘1件ずつに Evidence を付ける（Phase16 の中心）"""
    out = []
    for f in findings:
        used = {k: metrics.get(k) for k in metrics
                if k in (f.get("finding") or "") or k in (f.get("evidence") or "")}
        if not used:
            used = {k: metrics.get(k) for k in
                    ("longest_static_sec", "cuts_per_10sec", "shot_median", "change_per_sec",
                     "open_3s_cuts", "duration_sec", "has_audio") if k in metrics}
        evid = create(con, kind="director_finding", video_ids=[video_sha1],
                      metric_refs={video_sha1: used},
                      source_docs=[source_doc, "rule:" + f.get("rule", "?")],
                      note=f.get("finding"))
        out.append({**f, "evidence_id": evid})
    return out

def summary(con):
    ensure(con)
    n = con.execute("SELECT COUNT(*) FROM evidence").fetchone()[0]
    by = {r[0]: r[1] for r in con.execute("SELECT kind, COUNT(*) FROM evidence GROUP BY kind")}
    return dict(total=n, by_kind=by)
