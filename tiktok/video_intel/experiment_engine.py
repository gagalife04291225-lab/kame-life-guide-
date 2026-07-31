#!/usr/bin/env python3
"""
Phase13 / Experiment Engine

改善案を「思いつき」で実装しない。**必ず実験として管理する。**

  Experiment-001
    仮説        冒頭0.5秒の変化量を増やすと3秒保持率が上がる
    変数        open_0_5s_change（1つだけ変える）
    比較対象    群A（変更後） vs 群B（変更前）
    実測        DBから取得
    統計        Welch t検定 + BH-FDR
    判定        採用 / 却下 / 保留 / 判定不能

判定ルール（機械的。裁量を入れない）:
  判定不能 … いずれかの群が n<5
  採用     … 有意（p<0.05 かつ q<0.05）かつ 効果量が中以上 かつ 方向が仮説どおり
  却下     … 有意だが方向が仮説と逆
  保留     … 有意でない（＝差がないとは言えないが、採用もできない）

「保留」を用意しているのが重要。有意でないことは「効果がない」の証明ではない。
"""
import datetime, json, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from odin_store import ensure, next_id, j, uj
import evidence as EV
from video_intel import stats as ST, db as DB

MIN_N = ST.MIN_N

def design(con, title, hypothesis, variable, metric, direction,
           group_a_query, group_b_query, outcome_metric=None, at=None):
    """実験を設計する（まだ回さない）"""
    ensure(con)
    if direction not in ("increase", "decrease"):
        raise ValueError("direction は increase / decrease")
    at = at or datetime.date.today().isoformat()
    eid = next_id(con, "experiments", "eid", "EX", width=3)
    con.execute("INSERT INTO experiments VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                (eid, title, hypothesis, variable, metric, direction, outcome_metric,
                 group_a_query, group_b_query, "designed", None, None, None, at, at))
    con.commit()
    return eid

def run(con, eid, at=None):
    """実験を実行して判定まで出す"""
    ensure(con)
    at = at or datetime.date.today().isoformat()
    r = con.execute("SELECT * FROM experiments WHERE eid=?", (eid,)).fetchone()
    if not r:
        raise ValueError("実験が見つかりません: %s" % eid)
    a = DB.query(con, r["group_a_query"], (), 10000, "duration_sec")
    b = DB.query(con, r["group_b_query"], (), 10000, "duration_sec")
    metric = r["outcome_metric"] or r["metric"]
    res = ST.welch_t([x.get(metric) for x in a], [x.get(metric) for x in b])
    res["q_fdr"] = res.get("p")          # 単独実験なので補正なし（複数指標比較では compare_groups を使う）
    res["metric"] = metric

    if res.get("verdict") == "判定不能":
        verdict = "判定不能"
    else:
        sig = res.get("p") is not None and res["p"] < 0.05
        eff = res.get("effect_size") in ("中", "大")
        diff = res.get("diff") or 0
        want_up = (r["direction"] == "increase")
        matches = (diff > 0) if want_up else (diff < 0)
        if sig and eff and matches:
            verdict = "採用"
        elif sig and not matches:
            verdict = "却下"
        else:
            verdict = "保留"

    evid = EV.create(con, kind="experiment",
                     video_ids=[x["sha1"] for x in a] + [x["sha1"] for x in b],
                     metric_refs={metric: dict(group_a=[x.get(metric) for x in a],
                                               group_b=[x.get(metric) for x in b])},
                     stat_refs=res, experiment_ids=[eid],
                     note="%s / %s" % (r["title"], verdict), created_at=at)
    con.execute("UPDATE experiments SET status='analyzed', verdict=?, result_json=?, "
                "evidence_id=?, updated_at=? WHERE eid=?",
                (verdict, j(res), evid, at, eid))
    con.commit()
    return dict(eid=eid, verdict=verdict, result=res, evidence_id=evid,
                n_a=len(a), n_b=len(b),
                note=("『保留』は効果がないことの証明ではない。標本を増やして再実行する。"
                      if verdict == "保留" else
                      "各群 %d本以上が必要。データを増やすまで結論を出さない。" % MIN_N
                      if verdict == "判定不能" else ""))

def get(con, eid):
    ensure(con)
    r = con.execute("SELECT * FROM experiments WHERE eid=?", (eid,)).fetchone()
    if not r:
        return None
    d = dict(r); d["result_json"] = uj(d["result_json"]); return d

def list_all(con):
    ensure(con)
    out = []
    for r in con.execute("SELECT * FROM experiments ORDER BY eid"):
        d = dict(r); d["result_json"] = uj(d["result_json"]); out.append(d)
    return out

def summary(con):
    ensure(con)
    by = {r[0] or "designed": r[1] for r in con.execute(
        "SELECT verdict, COUNT(*) FROM experiments GROUP BY verdict")}
    total = con.execute("SELECT COUNT(*) FROM experiments").fetchone()[0]
    analyzed = con.execute("SELECT COUNT(*) FROM experiments WHERE status='analyzed'").fetchone()[0]
    adopted = by.get("採用", 0); rejected = by.get("却下", 0)
    decided = adopted + rejected
    return dict(total=total, analyzed=analyzed, by_verdict=by,
                adopted=adopted, rejected=rejected,
                held=by.get("保留", 0), undecidable=by.get("判定不能", 0),
                success_rate_pct=(round(100*adopted/decided, 1) if decided else None),
                failure_rate_pct=(round(100*rejected/decided, 1) if decided else None),
                note=("成功率は『採用/(採用+却下)』。保留・判定不能は分母に入れない"
                      "（結論が出ていないものを成功にも失敗にも数えない）。"))

def render(con):
    s = summary(con)
    L = ["# Experiment Engine（Phase13）", "",
         "実験 %d件（解析済み %d件） 採用 %d / 却下 %d / 保留 %d / 判定不能 %d" % (
             s["total"], s["analyzed"], s["adopted"], s["rejected"], s["held"], s["undecidable"]),
         "成功率: %s / 失敗率: %s  ※%s" % (
             ("%.1f%%" % s["success_rate_pct"]) if s["success_rate_pct"] is not None else "判定不能",
             ("%.1f%%" % s["failure_rate_pct"]) if s["failure_rate_pct"] is not None else "判定不能",
             s["note"]), "",
         "| ID | タイトル | 変数 | 指標 | 方向 | 判定 | p | 効果量 | Evidence |",
         "|----|---------|------|------|------|------|---|--------|----------|"]
    for e in list_all(con):
        r = e["result_json"] or {}
        L.append("| %s | %s | %s | %s | %s | %s | %s | %s | %s |" % (
            e["eid"], e["title"], e["variable"], e["metric"], e["direction"],
            e["verdict"] or "未実行", r.get("p", "—"), r.get("effect_size", "—"),
            e["evidence_id"] or "—"))
    return "\n".join(L) + "\n"
