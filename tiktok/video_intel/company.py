#!/usr/bin/env python3
"""
Phase18 / Research Dashboard のデータ層 ＋ ODIN v2.0 の統合ファサード

会社全体を1つのオブジェクトで可視化する。
表示内容（依頼どおり）:
  知識数 / 実験数 / 成功率 / 失敗率 / 統計成立数 / 判定不能数 /
  採用OSS / 保留OSS / 除外OSS / ライセンス警告 / 最新研究 / 更新履歴
"""
import os, sys, json, datetime
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from odin_store import ensure, uj
import knowledge_engine as KE
import experiment_engine as XE
import benchmark_dept as BD
import design_lab as DL
import memory_engine as ME
import evidence as EV
import self_review as SR
from research_dept import daily_report
from oss import rank as R
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from video_intel import db as DB

def overview(con, with_research=True):
    ensure(con)
    k = KE.stats_summary(con)
    x = XE.summary(con)
    b = BD.summary(con)
    d = DL.summary(con)
    m = ME.summary(con)
    e = EV.summary(con)
    suf = DB.data_sufficiency(con)

    oss = dict(adopt=0, test=0, hold=0, reject=0)
    if with_research:
        _, data = daily_report()
        oss = dict(adopt=len(data["adopt"]), test=len(data["test"]),
                   hold=data["hold"], reject=len(data["reject"]))
    ranked = R.rank()
    warn = [dict(repo=r["full_name"], license=r["license"], cls=r["license_class"],
                 note=r["license_note"])
            for r in ranked if r["license_class"] in ("network-copyleft", "strong-copyleft")]

    videos = con.execute("SELECT COUNT(*) FROM videos").fetchone()[0]
    outcomes = con.execute("SELECT COUNT(DISTINCT sha1) FROM outcomes").fetchone()[0]
    improvements = con.execute("SELECT COUNT(*) FROM improvements").fetchone()[0]

    latest = []
    for r in con.execute("SELECT kid, title, status, updated_at FROM knowledge_records "
                         "ORDER BY updated_at DESC, kid DESC LIMIT 5"):
        latest.append(dict(kind="knowledge", id=r[0], title=r[1], status=r[2], at=r[3]))
    for r in con.execute("SELECT eid, title, verdict, updated_at FROM experiments "
                         "ORDER BY updated_at DESC, eid DESC LIMIT 5"):
        latest.append(dict(kind="experiment", id=r[0], title=r[1], status=r[2] or "未実行", at=r[3]))
    latest.sort(key=lambda z: z["at"] or "", reverse=True)

    hist = [dict(kind="design", id=r["key"], title="%s → %s" % (r["old_value"] or "—", r["new_value"]),
                 status=r["reason"], at=r["changed_at"]) for r in DL.history(con)[:10]]
    reviews = SR.history(con, 5)

    return dict(
        generated_at=datetime.date.today().isoformat(),
        knowledge=dict(total=k["total"], knowledge=k["knowledge"], hypothesis=k["hypothesis"],
                       refuted=k["refuted"], refutations=k["refutations"], by_category=k["by_category"]),
        experiments=dict(total=x["total"], analyzed=x["analyzed"], adopted=x["adopted"],
                         rejected=x["rejected"], held=x["held"], undecidable=x["undecidable"],
                         success_rate_pct=x["success_rate_pct"], failure_rate_pct=x["failure_rate_pct"]),
        statistics=dict(established=x["adopted"] + x["rejected"], undecidable=x["undecidable"],
                        note=x["note"]),
        oss=dict(**oss, total=len(ranked), license_warnings=warn),
        benchmark=dict(observations=b["observations"], measured=b["measured"],
                       unavailable=b["unavailable"],
                       sources=[dict(source=s["source"], reachable=bool(s["reachable"]),
                                     http=s["http_status"], requires_key=bool(s["requires_key"]))
                                for s in b["sources"]]),
        design=dict(assets=d["assets"], changes=d["changes"], by_category=d["by_category"]),
        memory=dict(total=m["total"], by_kind=m["by_kind_ja"]),
        evidence=e,
        data=dict(videos=videos, videos_with_outcome=outcomes, improvements=improvements,
                  sufficiency=suf),
        latest_research=latest[:8],
        update_history=hist,
        self_reviews=reviews,
    )

def render(con):
    o = overview(con)
    K, X, S = o["knowledge"], o["experiments"], o["statistics"]
    L = ["# ODIN Research Dashboard（Phase18） — %s" % o["generated_at"], "",
         "## 会社の状態", "",
         "| 指標 | 値 |", "|------|-----|",
         "| 知識数（確定） | **%d** |" % K["knowledge"],
         "| 仮説数 | %d |" % K["hypothesis"],
         "| 否定済み知識 | %d（否定履歴 %d件） |" % (K["refuted"], K["refutations"]),
         "| 実験数 | %d（解析済み %d） |" % (X["total"], X["analyzed"]),
         "| 成功率 | %s |" % (("%.1f%%" % X["success_rate_pct"]) if X["success_rate_pct"] is not None else "**判定不能**"),
         "| 失敗率 | %s |" % (("%.1f%%" % X["failure_rate_pct"]) if X["failure_rate_pct"] is not None else "**判定不能**"),
         "| 統計成立数 | %d |" % S["established"],
         "| 判定不能数 | %d |" % S["undecidable"],
         "| Evidence 総数 | %d |" % o["evidence"]["total"],
         "| 解析済み動画 | %d本（実績付き %d本） |" % (o["data"]["videos"], o["data"]["videos_with_outcome"]),
         "| デザイン資産 | %d件（変更履歴 %d件） |" % (o["design"]["assets"], o["design"]["changes"]),
         "| 会社の記憶 | %d件 |" % o["memory"]["total"],
         "", "## OSS", "",
         "| 区分 | 件数 |", "|------|------|",
         "| 調査済み合計 | %d |" % o["oss"]["total"],
         "| 採用候補 | %d |" % o["oss"]["adopt"],
         "| 比較検証 | %d |" % o["oss"]["test"],
         "| 保留 | %d |" % o["oss"]["hold"],
         "| 除外 | %d |" % o["oss"]["reject"], ""]
    if o["oss"]["license_warnings"]:
        L += ["### ライセンス警告", "", "| repo | ライセンス | 内容 |", "|------|-----------|------|"]
        L += ["| %s | %s | %s |" % (w["repo"], w["license"], w["note"]) for w in o["oss"]["license_warnings"]]
        L.append("")
    L += ["## Benchmark（競合監視）", "",
          "観測 %d件（実測 %d / 未取得 %d）" % (o["benchmark"]["observations"],
                                              o["benchmark"]["measured"], o["benchmark"]["unavailable"]), "",
          "| ソース | 到達 | HTTP | APIキー |", "|--------|------|------|---------|"]
    L += ["| %s | %s | %s | %s |" % (s["source"], "可" if s["reachable"] else "**不可**",
                                     s["http"], "必要" if s["requires_key"] else "不要")
          for s in o["benchmark"]["sources"]]
    L += ["", "## 最新研究", ""]
    L += ["- [%s] %s %s — %s（%s）" % (r["kind"], r["id"], r["title"], r["status"], r["at"])
          for r in o["latest_research"]] or ["- なし"]
    L += ["", "## 更新履歴（デザイン資産）", ""]
    L += ["- %s %s: %s — %s" % (h["at"], h["id"], h["title"], h["status"]) for h in o["update_history"]] or ["- なし"]
    L += ["", "## データ充足", "", "```", json.dumps(o["data"]["sufficiency"], ensure_ascii=False, indent=2), "```"]
    return "\n".join(L) + "\n"

if __name__ == "__main__":
    con = DB.connect(os.path.join(os.path.dirname(__file__), "..", "research", "titan.db"))
    print(render(con))
