#!/usr/bin/env python3
"""
Phase17 / Self Review（自己監査）

毎週、自分自身を監査する。**問題があれば修正案を作る。**
監査項目（依頼どおり8つ）:
  C1 推測が混入していないか       … 統計的裏づけの無い記録が「知識」を名乗っていないか
  C2 統計不足ではないか           … 判定不能の実験・仮説の滞留
  C3 古い知識を使っていないか     … 一定期間更新されていない知識
  C4 重複知識がないか             … タイトル/主張の重複
  C5 ライセンス違反がないか       … AGPL/GPL の依存が有効化されていないか
  C6 OSS更新漏れがないか          … レジストリの更新日が古すぎないか
  C7 Evidence欠落がないか         … 知識・実験・デザイン資産に Evidence があるか
  C8 未取得の放置がないか         … Benchmark で未取得のまま長期放置していないか

各チェックは PASS / FAIL / WARN を返し、FAIL には**必ず修正案**を付ける。
"""
import datetime, os, sys, json, importlib
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from odin_store import ensure, j, uj
import knowledge_engine as KE
import experiment_engine as XE
import benchmark_dept as BD
import design_lab as DL
import memory_engine as ME
from oss import rank as R

STALE_KNOWLEDGE_DAYS = 180
STALE_REGISTRY_DAYS = 30
STALE_BENCHMARK_DAYS = 14

def _days_since(d, today):
    if not d:
        return 9999
    y, m, dd = (int(x) for x in str(d)[:10].split("-"))
    return (today - datetime.date(y, m, dd)).days

def _c(cid, name, status, detail, fix=None, data=None):
    return dict(id=cid, name=name, status=status, detail=detail, fix=fix, data=data)

def review(con, today=None):
    ensure(con)
    today = today or datetime.date.today()
    checks = []

    # C1 推測の混入
    bad = []
    for k in KE.list_records(con, status="knowledge"):
        st = k.get("stat_evidence")
        if not st or st.get("p") is None or st["p"] >= 0.05:
            bad.append(k["kid"])
    checks.append(_c("C1", "推測が混入していないか",
                     "FAIL" if bad else "PASS",
                     ("統計的裏づけのない記録が『知識』を名乗っている: %s" % ", ".join(bad)) if bad
                     else "『知識』はすべて有意な統計結果を持っている",
                     fix=("該当レコードを knowledge_engine.refute() で否定するか、"
                          "実験を回して昇格条件を満たすこと") if bad else None,
                     data=bad))

    # C2 統計不足
    ex = XE.summary(con)
    und = ex["undecidable"]
    hyp = KE.stats_summary(con)["hypothesis"]
    st_status = "WARN" if (und or hyp) else "PASS"
    checks.append(_c("C2", "統計不足ではないか", st_status,
                     "判定不能の実験 %d件 / 仮説のまま %d件" % (und, hyp),
                     fix=("動画と実績データを増やして再実行する。"
                          "各群 n>=%d が必要" % XE.MIN_N) if st_status != "PASS" else None,
                     data=dict(undecidable=und, hypothesis=hyp)))

    # C3 古い知識
    old = [k["kid"] for k in KE.list_records(con)
           if k["status"] != "refuted" and _days_since(k["updated_at"], today) > STALE_KNOWLEDGE_DAYS]
    checks.append(_c("C3", "古い知識を使っていないか", "WARN" if old else "PASS",
                     ("%d日以上更新されていない知識: %s" % (STALE_KNOWLEDGE_DAYS, ", ".join(old))) if old
                     else "%d日以上放置された知識はない" % STALE_KNOWLEDGE_DAYS,
                     fix="最新データで再検証し、通らなければ refute する" if old else None,
                     data=old))

    # C4 重複知識
    seen, dup = {}, []
    for k in KE.list_records(con):
        key = (k["category"], (k["title"] or "").strip())
        if key in seen:
            dup.append((seen[key], k["kid"], k["title"]))
        else:
            seen[key] = k["kid"]
    checks.append(_c("C4", "重複知識がないか", "FAIL" if dup else "PASS",
                     ("重複: %s" % "; ".join("%s≒%s(%s)" % d for d in dup)) if dup
                     else "同カテゴリ・同タイトルの重複はない",
                     fix="片方を superseded_by で紐づけて統合する" if dup else None,
                     data=dup))

    # C5 ライセンス違反
    ranked = R.rank()
    risky = [r for r in ranked if r["license_class"] in ("network-copyleft", "strong-copyleft")]
    req = os.path.join(os.path.dirname(os.path.abspath(__file__)), "requirements.txt")
    reqtxt = open(req, encoding="utf-8").read() if os.path.exists(req) else ""
    active = []
    for r in risky:
        pkg = r["full_name"].split("/")[-1].lower()
        for line in reqtxt.splitlines():
            ls = line.strip()
            if ls and not ls.startswith("#") and pkg in ls.lower():
                active.append(r["full_name"])
    checks.append(_c("C5", "ライセンス違反がないか", "FAIL" if active else "PASS",
                     ("コピーレフトOSSが必須依存として有効: %s" % ", ".join(active)) if active
                     else "AGPL/GPL の %d件はすべてコメントアウト（任意依存）のまま" % len(risky),
                     fix="requirements.txt から外し、代替OSSに置き換える" if active else None,
                     data=[r["full_name"] + "(" + (r["license"] or "?") + ")" for r in risky]))

    # C6 OSS更新漏れ
    reg = R.load()
    measured = reg.get("measured_at")
    d = _days_since(measured, today)
    checks.append(_c("C6", "OSS更新漏れがないか", "WARN" if d > STALE_REGISTRY_DAYS else "PASS",
                     "レジストリ最終測定 %s（%d日前 / %d件）" % (measured, d, len(reg["repos"])),
                     fix="Research Department を実行してレジストリを更新する" if d > STALE_REGISTRY_DAYS else None,
                     data=dict(measured_at=measured, days=d, repos=len(reg["repos"]))))

    # C7 Evidence欠落
    miss = []
    miss += [r[0] for r in con.execute("SELECT kid FROM knowledge_records WHERE evidence_id IS NULL")]
    miss += [r[0] for r in con.execute(
        "SELECT eid FROM experiments WHERE status='analyzed' AND evidence_id IS NULL")]
    miss += [r[0] for r in con.execute("SELECT key FROM design_assets WHERE evidence_id IS NULL")]
    checks.append(_c("C7", "Evidence欠落がないか", "FAIL" if miss else "PASS",
                     ("Evidenceの無いレコード: %s" % ", ".join(map(str, miss[:10]))) if miss
                     else "知識・実験・デザイン資産はすべて Evidence を持つ",
                     fix="evidence.create() で根拠を作成して紐づける" if miss else None,
                     data=miss))

    # C8 未取得の放置
    bs = BD.summary(con)
    stale_src = []
    for s in bs["sources"]:
        if _days_since(s["last_checked"], today) > STALE_BENCHMARK_DAYS:
            stale_src.append(s["source"])
    unavail = bs["unavailable"]
    status = "WARN" if (stale_src or unavail) else "PASS"
    checks.append(_c("C8", "未取得の放置がないか", status,
                     "未取得 %d件 / %d日以上未確認のソース: %s" % (
                         unavail, STALE_BENCHMARK_DAYS, ", ".join(stale_src) or "なし"),
                     fix=("到達不可のソースは環境側の制約。APIキーで解決できるものは"
                          "オーナーに設定を依頼する（YouTube Data API v3 は無料枠あり）")
                     if status != "PASS" else None,
                     data=dict(unavailable=unavail, stale_sources=stale_src)))

    passed = sum(1 for c in checks if c["status"] == "PASS")
    failed = sum(1 for c in checks if c["status"] == "FAIL")
    warned = sum(1 for c in checks if c["status"] == "WARN")
    rep = dict(reviewed_at=today.isoformat(), checks=checks,
               passed=passed, failed=failed, warned=warned,
               verdict=("要修正" if failed else ("要注意" if warned else "健全")),
               fixes=[dict(id=c["id"], name=c["name"], fix=c["fix"])
                      for c in checks if c["fix"]])
    con.execute("INSERT INTO self_reviews (reviewed_at,passed,failed,report_json) VALUES (?,?,?,?)",
                (today.isoformat(), passed, failed, j(rep)))
    con.commit()
    return rep

def render(rep):
    L = ["# Self Review（Phase17） — %s" % rep["reviewed_at"], "",
         "判定: **%s** ／ PASS %d / WARN %d / FAIL %d" % (
             rep["verdict"], rep["passed"], rep["warned"], rep["failed"]), "",
         "| # | 監査項目 | 結果 | 内容 |", "|---|---------|------|------|"]
    for c in rep["checks"]:
        mark = {"PASS": "PASS", "WARN": "WARN", "FAIL": "**FAIL**"}[c["status"]]
        L.append("| %s | %s | %s | %s |" % (c["id"], c["name"], mark, c["detail"]))
    if rep["fixes"]:
        L += ["", "## 修正案（自動生成）", ""]
        L += ["- **%s %s**: %s" % (f["id"], f["name"], f["fix"]) for f in rep["fixes"]]
    else:
        L += ["", "修正が必要な項目はない。"]
    return "\n".join(L) + "\n"

def history(con, limit=10):
    ensure(con)
    return [dict(r) for r in con.execute(
        "SELECT id, reviewed_at, passed, failed FROM self_reviews ORDER BY id DESC LIMIT ?", (limit,))]
