#!/usr/bin/env python3
"""
Phase15 / Memory Engine（会社の記憶）

目的はただ一つ: **同じ失敗を繰り返さない。**

保存対象:
  success_factor       成功要因
  failure_factor       失敗要因
  rejected_hypothesis  却下した仮説
  adopted_hypothesis   採用した仮説
  reproduced           再現できた知見
  not_reproduced       再現できなかった知見

すべて Evidence ID を必須にする。根拠のない「記憶」は作れない。
`check_before_action()` は、これから行おうとする変更が
**過去に却下・失敗した記憶と衝突しないか**を照会する。
"""
import datetime, os, sys, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from odin_store import ensure, next_id
import evidence as EV

KINDS = ("success_factor", "failure_factor", "rejected_hypothesis",
         "adopted_hypothesis", "reproduced", "not_reproduced")
KIND_JA = {"success_factor": "成功要因", "failure_factor": "失敗要因",
           "rejected_hypothesis": "却下した仮説", "adopted_hypothesis": "採用した仮説",
           "reproduced": "再現できた知見", "not_reproduced": "再現できなかった知見"}

class MemoryError_(Exception):
    pass

def remember(con, kind, title, detail, evidence_id=None, video_ids=None,
             metric_refs=None, stat_refs=None, related_kid=None, related_eid=None,
             source_docs=None, reproduced="untested", at=None):
    ensure(con)
    if kind not in KINDS:
        raise MemoryError_("kind は %s のいずれか" % (KINDS,))
    at = at or datetime.date.today().isoformat()
    if not evidence_id:
        evidence_id = EV.create(con, kind="memory", video_ids=video_ids,
                                metric_refs=metric_refs, stat_refs=stat_refs,
                                source_docs=source_docs,
                                knowledge_ids=[related_kid] if related_kid else None,
                                experiment_ids=[related_eid] if related_eid else None,
                                note=title, created_at=at)
    mid = next_id(con, "company_memory", "mid", "MEM")
    con.execute("INSERT INTO company_memory VALUES (?,?,?,?,?,?,?,?,?)",
                (mid, kind, title, detail, evidence_id, reproduced,
                 related_kid, related_eid, at))
    con.commit()
    return mid

def recall(con, kind=None, q=None):
    ensure(con)
    w, p = ["1=1"], []
    if kind: w.append("kind=?"); p.append(kind)
    if q: w.append("(title LIKE ? OR detail LIKE ?)"); p += ["%%%s%%" % q, "%%%s%%" % q]
    return [dict(x) for x in con.execute(
        "SELECT * FROM company_memory WHERE %s ORDER BY mid" % " AND ".join(w), p)]

# 日本語は分かち書きされないため、**文字2-gram**で照合する。
# （空白区切りのトークン化は日本語では機能しない。実際に照合漏れが出たので変更した）
_DROP = "、。，．（）()[]「」『』/・:：;；!！?？\"'　 \t\n"

def _tokens(s):
    s = "".join(ch for ch in (s or "") if ch not in _DROP)
    return {s[i:i+2] for i in range(len(s)-1)} if len(s) >= 2 else set()

def _similarity(a, b):
    """Jaccard係数。0-1。"""
    if not a or not b:
        return 0.0
    return len(a & b) / float(len(a | b))

def _lcs(a, b):
    """最長共通部分文字列の長さ。n-gram類似度だけだと
    『静止カード方式は使わない』と『静止カードを並べて…』を取り逃したため追加した。"""
    a = "".join(ch for ch in (a or "") if ch not in _DROP)
    b = "".join(ch for ch in (b or "") if ch not in _DROP)
    if not a or not b:
        return 0, ""
    prev = [0]*(len(b)+1); best, end = 0, 0
    for i in range(1, len(a)+1):
        cur = [0]*(len(b)+1)
        for jx in range(1, len(b)+1):
            if a[i-1] == b[jx-1]:
                cur[jx] = prev[jx-1] + 1
                if cur[jx] > best:
                    best, end = cur[jx], i
        prev = cur
    return best, a[end-best:end]

LCS_MIN = 5

def check_before_action(con, proposal_text):
    """これからやろうとしていることが、過去の失敗・却下と衝突しないか照会する。

    同じ失敗を繰り返さないための最後の関門。**必ず行動前に呼ぶ。**
    """
    ensure(con)
    tk = _tokens(proposal_text)
    hits = []
    for m in recall(con):
        if m["kind"] not in ("failure_factor", "rejected_hypothesis", "not_reproduced"):
            continue
        mt_title = _tokens(m["title"])
        mt_all = _tokens(m["title"] + (m["detail"] or ""))
        # タイトルとの類似度（強い一致）か、本文込みの重なりが十分にあるか
        sim_t = _similarity(tk, mt_title)
        overlap = tk & mt_all
        cover = len(tk & mt_title) / float(len(mt_title)) if mt_title else 0.0
        lcs_n, lcs_s = _lcs(proposal_text, m["title"])
        if sim_t >= 0.35 or cover >= 0.6 or lcs_n >= LCS_MIN:
            hits.append(dict(mid=m["mid"], kind=m["kind"], kind_ja=KIND_JA[m["kind"]],
                             title=m["title"], detail=m["detail"],
                             evidence_id=m["evidence_id"],
                             similarity=round(max(sim_t, cover), 3),
                             common_phrase=lcs_s if lcs_n >= LCS_MIN else None,
                             matched_terms=sorted(overlap)[:8]))
    return dict(proposal=proposal_text, conflicts=hits,
                verdict=("過去の失敗・却下と衝突する可能性あり。実行前に確認すること。"
                         if hits else "過去の失敗記録との明確な衝突はない"),
                note="文字2-gramのJaccard類似度＋最長共通部分文字列（>=5文字）による照合。見落としがありうるので最終判断は人が行う。")

def summary(con):
    ensure(con)
    by = {r[0]: r[1] for r in con.execute("SELECT kind, COUNT(*) FROM company_memory GROUP BY kind")}
    rep = {r[0]: r[1] for r in con.execute("SELECT reproduced, COUNT(*) FROM company_memory GROUP BY reproduced")}
    return dict(total=sum(by.values()), by_kind=by, by_reproduced=rep,
                by_kind_ja={KIND_JA[k]: v for k, v in by.items() if k in KIND_JA})

def render(con):
    s = summary(con)
    L = ["# Memory Engine（Phase15）", "",
         "記憶 %d件 ／ " % s["total"] + " / ".join("%s %d" % (k, v) for k, v in s["by_kind_ja"].items()), "",
         "| ID | 種別 | タイトル | 再現性 | 関連知識 | 関連実験 | Evidence | 記録日 |",
         "|----|------|---------|--------|---------|---------|----------|--------|"]
    for m in recall(con):
        L.append("| %s | %s | %s | %s | %s | %s | %s | %s |" % (
            m["mid"], KIND_JA.get(m["kind"], m["kind"]), m["title"], m["reproduced"],
            m["related_kid"] or "—", m["related_eid"] or "—", m["evidence_id"], m["created_at"]))
    L += ["", "> `check_before_action()` を実行前に呼ぶことで、",
          "> 過去に却下・失敗した施策を再提案していないかを照会できる。"]
    return "\n".join(L) + "\n"
