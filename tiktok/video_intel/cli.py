#!/usr/bin/env python3
"""
TITAN CLI

  python3 -m video_intel.cli analyze <video...> [--db PATH] [--genre G] [--source S]
  python3 -m video_intel.cli list   [--db PATH] [--where SQL] [--order COL] [--limit N]
  python3 -m video_intel.cli outcome <sha1> --views N --retention3s P --completion P ...
  python3 -m video_intel.cli compare --where-a SQL --where-b SQL [--db PATH]
  python3 -m video_intel.cli correlate --outcome completion_pct [--db PATH]
  python3 -m video_intel.cli export [--db PATH] [--out DIR] [--where SQL]
  python3 -m video_intel.cli oss [カテゴリ]
  python3 -m video_intel.cli serve [--port 8765] [--db PATH]

検索例:
  --where "genre='教育' AND duration_sec<=30"
  --where-a "views>=1000000" --where-b "views<10000"
"""
import sys, os, json, argparse, datetime
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from video_intel import engine, db, stats, report

DEFAULT_DB = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "research", "titan.db")

def cmd_analyze(a):
    con = db.connect(a.db)
    now = datetime.datetime.now().strftime("%Y-%m-%d")
    for p in a.videos:
        print("解析中: %s" % p)
        r = engine.analyze(p, with_adapters=not a.no_adapters)
        sid = db.upsert(con, r, genre=a.genre, source=a.source, notes=a.notes, ingested_at=now)
        v = r["video"]
        print("  sha1=%s 尺%.1fs カット%d 中央値%.2fs 変化%.2f/秒 最長静止%.2fs" % (
            sid, r["format"]["duration_sec"], v["cuts"]["count"],
            v["shot_length"]["median"] or 0, v["screen_change"]["per_sec"] or 0,
            v["screen_change"]["longest_static_run_sec"]))
        if r["not_measured"]:
            print("  未測定: " + " / ".join(r["not_measured"][:3]) + (" ..." if len(r["not_measured"]) > 3 else ""))

def cmd_list(a):
    con = db.connect(a.db)
    rows = db.query(con, a.where, (), a.limit, a.order)
    if not rows:
        print("該当なし"); return
    ks = ["label", "duration_sec", "cuts_per_10sec", "shot_median", "change_per_sec",
          "longest_static_sec", "genre", "views", "completion_pct"]
    print(" | ".join(ks))
    for r in rows:
        print(" | ".join("" if r.get(k) is None else str(r.get(k)) for k in ks))
    print("\n%d件" % len(rows))

def cmd_outcome(a):
    con = db.connect(a.db)
    db.set_outcome(con, a.sha1, a.measured_at, views=a.views, retention_3s_pct=a.retention3s,
                   completion_pct=a.completion, avg_watch_sec=a.avg_watch, saves=a.saves,
                   shares=a.shares, comments=a.comments, likes=a.likes,
                   profile_visits=a.profile_visits, site_sessions=a.site_sessions)
    print("実績を登録: %s (%s)" % (a.sha1, a.measured_at))

def cmd_compare(a):
    con = db.connect(a.db)
    ra = db.query(con, a.where_a, (), 10000, "duration_sec")
    rb = db.query(con, a.where_b, (), 10000, "duration_sec")
    res = stats.compare_groups(ra, rb, a.name_a, a.name_b)
    print("# 成功/失敗パターン比較（Welch t検定 + BH法によるFDR補正）")
    print("%s n=%d ／ %s n=%d" % (res["group_a"], res["n_a"], res["group_b"], res["n_b"]))
    if not res["significant"]:
        print("\n有意差のある指標: なし")
        print("判定不能の指標: %d 件（%s）" % (res["undecidable_count"], res["note"]))
    else:
        print("\n| 指標 | %s平均 | %s平均 | 差 | p | q(FDR) | Cohen's d | 効果量 |" % (res["group_a"], res["group_b"]))
        print("|------|--------|--------|----|---|--------|-----------|--------|")
        for r in res["significant"]:
            print("| %s | %s | %s | %s | %s | %s | %s | %s |" % (
                r["metric"], r["mean_a"], r["mean_b"], r["diff"], r["p"], r["q_fdr"],
                r["cohens_d"], r["effect_size"]))
    if a.json:
        open(a.json, "w", encoding="utf-8").write(json.dumps(res, ensure_ascii=False, indent=2))
        print("\nJSON: %s" % a.json)

def cmd_correlate(a):
    con = db.connect(a.db)
    rows = db.query(con, a.where, (), 10000, "duration_sec")
    res = stats.correlate_with_outcome(rows, a.outcome)
    print("# 指標と %s の相関（Pearson + FDR補正）  n=%d" % (a.outcome, res["n"]))
    if not res["significant"]:
        print("有意な相関: なし（または判定不能）")
        print(res["note"])
    else:
        print("| 指標 | r | p | q(FDR) |")
        print("|------|---|---|--------|")
        for r in res["significant"]:
            print("| %s | %s | %s | %s |" % (r["metric"], r["r"], r["p"], r["q_fdr"]))
        print("\n" + res["note"])

def cmd_export(a):
    con = db.connect(a.db)
    rows = db.query(con, a.where, (), 10000, a.order)
    extra = []
    if a.where_a and a.where_b:
        res = stats.compare_groups(db.query(con, a.where_a, (), 10000, "duration_sec"),
                                   db.query(con, a.where_b, (), 10000, "duration_sec"))
        extra.append(("成功/失敗パターン比較", json.dumps(res, ensure_ascii=False, indent=2)))
    paths = report.write_all(rows, a.out, a.name, "TITAN 解析レポート", extra)
    for k, v in paths.items():
        print("%-5s %s" % (k, v))

def cmd_oss(a):
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from oss import rank as R
    sys.argv = ["rank"] + ([a.category] if a.category else [])
    R.main()

def cmd_research(a):
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from research_dept import daily_report
    md, _ = daily_report()
    print(md)
    if a.out:
        open(a.out, "w", encoding="utf-8").write(md); print("保存: %s" % a.out)

def cmd_caps(a):
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from oss import capabilities as C
    sys.argv = ["caps"] + ([a.category] if a.category else [])
    C.main()

def cmd_sufficiency(a):
    con = db.connect(a.db)
    r = db.data_sufficiency(con)
    print(json.dumps(r, ensure_ascii=False, indent=2))

def cmd_knowledge(a):
    con = db.connect(a.db)
    if a.add:
        db.add_knowledge(con, a.sha1, a.kind, a.add, a.evidence, a.confidence,
                         datetime.date.today().isoformat())
        print("記録しました")
    for k in db.get_knowledge(con, a.sha1, a.kind if a.add is None else None):
        print("[%s] %s\n    根拠: %s（確度 %s）" % (k["kind"], k["text"], k["evidence"], k["confidence"]))

def cmd_improvement(a):
    con = db.connect(a.db)
    if a.from_sha and a.to_sha:
        d = db.add_improvement(con, a.from_sha, a.to_sha, a.change or "",
                               datetime.date.today().isoformat())
        print("改善履歴を記録:")
        for k, v in d.items():
            if v["delta"]:
                print("  %-22s %s → %s (%+.3f)" % (k, v["before"], v["after"], v["delta"]))
    else:
        for r in db.get_improvements(con):
            print("- %s → %s : %s" % (r["sha1_from"][:8], r["sha1_to"][:8], r["change"]))

# ── ODIN v2.0 ─────────────────────────────────────────────
def _v2():
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def cmd_kn(a):
    _v2(); import knowledge_engine as KE
    con = db.connect(a.db)
    if a.add:
        r = KE.add(con, a.add, a.category, a.claim or a.add,
                   video_ids=(a.videos.split(",") if a.videos else None),
                   source_docs=(a.docs.split(",") if a.docs else None),
                   force_hypothesis=a.hypothesis)
        print("登録: %s status=%s confidence=%s Evidence=%s" % (r["kid"], r["status"], r["confidence"], r["evidence_id"]))
        if r["downgrade_reasons"]:
            print("  仮説に落ちた理由: " + " / ".join(r["downgrade_reasons"]))
        return
    if a.refute:
        print(KE.refute(con, a.refute, a.reason or "自己監査による否定")); return
    print(KE.render(con))

def cmd_ex(a):
    _v2(); import experiment_engine as XE
    con = db.connect(a.db)
    if a.design:
        eid = XE.design(con, a.design, a.hypothesis or a.design, a.variable or a.metric,
                        a.metric, a.direction, a.group_a, a.group_b, a.outcome)
        print("設計: %s" % eid)
        if a.run:
            r = XE.run(con, eid)
            print("実行: %s → %s  %s" % (r["eid"], r["verdict"], r["note"]))
        return
    if a.run_eid:
        r = XE.run(con, a.run_eid)
        print("%s → %s  n=%d/%d  %s" % (r["eid"], r["verdict"], r["n_a"], r["n_b"], r["note"])); return
    print(XE.render(con))

def cmd_benchmark(a):
    _v2(); import benchmark_dept as BD
    con = db.connect(a.db)
    if a.run:
        BD.run_all(con)
    print(BD.render(con))

def cmd_design(a):
    _v2(); import design_lab as DL
    con = db.connect(a.db)
    if a.seed:
        print("初期投入: %d件" % DL.seed(con)); return
    if a.set_key:
        print(DL.update(con, a.set_key, a.value, a.reason)); return
    print(DL.render(con))

def cmd_memory(a):
    _v2(); import memory_engine as ME
    con = db.connect(a.db)
    if a.check:
        r = ME.check_before_action(con, a.check)
        print(r["verdict"])
        for c in r["conflicts"]:
            print("  ⚠ %s [%s] %s（類似 %.2f / 共通句『%s』）" % (
                c["mid"], c["kind_ja"], c["title"], c["similarity"], c.get("common_phrase") or "-"))
        print("  " + r["note"]); return
    if a.add:
        print("記録:", ME.remember(con, a.kind, a.add, a.detail or a.add,
                                   source_docs=[a.doc] if a.doc else None)); return
    print(ME.render(con))

def cmd_review(a):
    _v2(); import self_review as SR
    con = db.connect(a.db)
    rep = SR.review(con)
    print(SR.render(rep))
    if a.out:
        open(a.out, "w", encoding="utf-8").write(SR.render(rep)); print("保存: %s" % a.out)

def cmd_dashboard(a):
    _v2(); import company as CO
    con = db.connect(a.db)
    print(CO.render(con))
    if a.out:
        open(a.out, "w", encoding="utf-8").write(CO.render(con)); print("保存: %s" % a.out)

def cmd_serve(a):
    from video_intel import server
    server.serve(a.port, a.db)

def main():
    ap = argparse.ArgumentParser(prog="video_intel", description="TITAN Video Intelligence Platform")
    ap.add_argument("--db", default=DEFAULT_DB)
    sub = ap.add_subparsers(dest="cmd", required=True)

    p = sub.add_parser("analyze"); p.add_argument("videos", nargs="+")
    p.add_argument("--genre"); p.add_argument("--source"); p.add_argument("--notes")
    p.add_argument("--no-adapters", action="store_true"); p.set_defaults(fn=cmd_analyze)

    p = sub.add_parser("list"); p.add_argument("--where", default="1=1")
    p.add_argument("--order", default="duration_sec"); p.add_argument("--limit", type=int, default=100)
    p.set_defaults(fn=cmd_list)

    p = sub.add_parser("outcome"); p.add_argument("sha1")
    p.add_argument("--measured-at", dest="measured_at", default=datetime.date.today().isoformat())
    for k in ["views", "saves", "shares", "comments", "likes", "profile_visits", "site_sessions"]:
        p.add_argument("--"+k.replace("_", "-"), dest=k, type=int)
    p.add_argument("--retention3s", type=float); p.add_argument("--completion", type=float)
    p.add_argument("--avg-watch", dest="avg_watch", type=float)
    p.set_defaults(fn=cmd_outcome)

    p = sub.add_parser("compare")
    p.add_argument("--where-a", dest="where_a", required=True)
    p.add_argument("--where-b", dest="where_b", required=True)
    p.add_argument("--name-a", dest="name_a", default="A群"); p.add_argument("--name-b", dest="name_b", default="B群")
    p.add_argument("--json"); p.set_defaults(fn=cmd_compare)

    p = sub.add_parser("correlate"); p.add_argument("--outcome", default="completion_pct")
    p.add_argument("--where", default="1=1"); p.set_defaults(fn=cmd_correlate)

    p = sub.add_parser("export"); p.add_argument("--where", default="1=1")
    p.add_argument("--order", default="duration_sec"); p.add_argument("--out", default="tiktok/research/out")
    p.add_argument("--name", default="titan-report")
    p.add_argument("--where-a", dest="where_a"); p.add_argument("--where-b", dest="where_b")
    p.set_defaults(fn=cmd_export)

    p = sub.add_parser("oss"); p.add_argument("category", nargs="?"); p.set_defaults(fn=cmd_oss)
    p = sub.add_parser("research"); p.add_argument("--out"); p.set_defaults(fn=cmd_research)
    p = sub.add_parser("caps"); p.add_argument("category", nargs="?"); p.set_defaults(fn=cmd_caps)
    p = sub.add_parser("sufficiency"); p.set_defaults(fn=cmd_sufficiency)

    p = sub.add_parser("knowledge"); p.add_argument("--sha1"); p.add_argument("--kind")
    p.add_argument("--add"); p.add_argument("--evidence"); p.add_argument("--confidence", default="中")
    p.set_defaults(fn=cmd_knowledge)

    p = sub.add_parser("improvement")
    p.add_argument("--from", dest="from_sha"); p.add_argument("--to", dest="to_sha")
    p.add_argument("--change"); p.set_defaults(fn=cmd_improvement)

    p = sub.add_parser("kn"); p.add_argument("--add"); p.add_argument("--category", default="編集テンポ")
    p.add_argument("--claim"); p.add_argument("--videos"); p.add_argument("--docs")
    p.add_argument("--hypothesis", action="store_true")
    p.add_argument("--refute"); p.add_argument("--reason"); p.set_defaults(fn=cmd_kn)

    p = sub.add_parser("ex"); p.add_argument("--design"); p.add_argument("--hypothesis")
    p.add_argument("--variable"); p.add_argument("--metric", default="longest_static_sec")
    p.add_argument("--direction", default="decrease", choices=["increase", "decrease"])
    p.add_argument("--group-a", dest="group_a", default="1=1")
    p.add_argument("--group-b", dest="group_b", default="1=0")
    p.add_argument("--outcome"); p.add_argument("--run", action="store_true")
    p.add_argument("--run-eid", dest="run_eid"); p.set_defaults(fn=cmd_ex)

    p = sub.add_parser("benchmark"); p.add_argument("--run", action="store_true"); p.set_defaults(fn=cmd_benchmark)

    p = sub.add_parser("design"); p.add_argument("--seed", action="store_true")
    p.add_argument("--set", dest="set_key"); p.add_argument("--value"); p.add_argument("--reason")
    p.set_defaults(fn=cmd_design)

    p = sub.add_parser("memory"); p.add_argument("--check"); p.add_argument("--add")
    p.add_argument("--kind", default="failure_factor"); p.add_argument("--detail"); p.add_argument("--doc")
    p.set_defaults(fn=cmd_memory)

    p = sub.add_parser("review"); p.add_argument("--out"); p.set_defaults(fn=cmd_review)
    p = sub.add_parser("dashboard"); p.add_argument("--out"); p.set_defaults(fn=cmd_dashboard)

    p = sub.add_parser("serve"); p.add_argument("--port", type=int, default=8765); p.set_defaults(fn=cmd_serve)

    a = ap.parse_args()
    a.fn(a)

if __name__ == "__main__":
    main()
