#!/usr/bin/env python3
"""
Phase11 / Knowledge Engine

SQLiteに保存するだけでは知識ではない。**知識と推測を絶対に混在させない。**
そのために「知識」を名乗る条件をコードで強制する。

  status = "knowledge"  を名乗れる条件（すべて必須）:
     1. 根拠となる動画が MIN_VIDEOS 本以上ある
     2. 統計結果（stat_evidence）が存在し、有意（p<0.05 かつ q_fdr<0.05）である
     3. Evidence ID を持つ
  → 1つでも欠けたら status は自動的に "hypothesis"（仮説）に落とされる。
     昇格させたいなら実験を回してデータを増やすしかない。

  status = "refuted"     否定された知識。**削除しない。** 履歴として残す。

保持する項目（依頼どおり）:
  タイトル / カテゴリ / 根拠動画ID / 根拠となる解析値 / 統計結果 /
  確信度 / 作成日 / 更新日 / 否定された履歴
"""
import datetime, json
from odin_store import ensure, next_id, j, uj
import evidence as EV

MIN_VIDEOS = 5          # 統計が動き出す最小本数（stats.MIN_N と揃える）
CATEGORIES = ("編集テンポ", "冒頭設計", "テロップ", "色設計", "構図", "音",
              "尺", "導線", "ブランド", "OSS", "運用")

class KnowledgeError(Exception):
    pass

def _judge_status(video_ids, stat_evidence, evidence_id):
    """知識を名乗れるかを機械的に判定する。人の裁量を入れない。"""
    reasons = []
    if not video_ids or len(video_ids) < MIN_VIDEOS:
        reasons.append("根拠動画が %d本（必要 %d本）" % (len(video_ids or []), MIN_VIDEOS))
    if not stat_evidence:
        reasons.append("統計結果がない")
    else:
        p = stat_evidence.get("p")
        q = stat_evidence.get("q_fdr")
        if stat_evidence.get("verdict") == "判定不能":
            reasons.append("統計が判定不能")
        elif p is None or p >= 0.05:
            reasons.append("p値が有意水準を満たさない（p=%s）" % p)
        elif q is not None and q >= 0.05:
            reasons.append("FDR補正後に有意でない（q=%s）" % q)
    if not evidence_id:
        reasons.append("Evidence ID がない")
    return ("knowledge" if not reasons else "hypothesis"), reasons

def add(con, title, category, claim, video_ids=None, metric_evidence=None,
        stat_evidence=None, experiment_ids=None, confidence=None,
        source_docs=None, created_at=None, force_hypothesis=False):
    ensure(con)
    if category not in CATEGORIES:
        raise KnowledgeError("category は %s のいずれか" % (CATEGORIES,))
    today = created_at or datetime.date.today().isoformat()
    evid = EV.create(con, kind="knowledge",
                     video_ids=video_ids, metric_refs=metric_evidence,
                     stat_refs=stat_evidence, experiment_ids=experiment_ids,
                     source_docs=source_docs, note=title, created_at=today)
    status, reasons = _judge_status(video_ids, stat_evidence, evid)
    if force_hypothesis:
        status, reasons = "hypothesis", (reasons or ["明示的に仮説として登録"])
    if confidence is None:
        confidence = "高" if status == "knowledge" else ("低" if reasons else "中")
    kid = next_id(con, "knowledge_records", "kid", "KN")
    con.execute("INSERT INTO knowledge_records VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                (kid, title, category, claim, status, confidence,
                 j(video_ids), j(metric_evidence), j(stat_evidence), evid,
                 j(experiment_ids), today, today, None))
    con.commit()
    return dict(kid=kid, status=status, confidence=confidence,
                evidence_id=evid, downgrade_reasons=reasons)

def refute(con, kid, reason, evidence_id=None, refuted_by="self_review", at=None):
    """知識を否定する。**レコードは消さない。** 履歴として残すのが Phase11 の要件。"""
    ensure(con)
    at = at or datetime.date.today().isoformat()
    r = con.execute("SELECT * FROM knowledge_records WHERE kid=?", (kid,)).fetchone()
    if not r:
        raise KnowledgeError("知識が見つかりません: %s" % kid)
    con.execute("INSERT INTO knowledge_refutations (kid,refuted_at,reason,evidence_id,refuted_by) "
                "VALUES (?,?,?,?,?)", (kid, at, reason, evidence_id, refuted_by))
    con.execute("UPDATE knowledge_records SET status='refuted', confidence='低', updated_at=? WHERE kid=?",
                (at, kid))
    con.commit()
    return dict(kid=kid, status="refuted", reason=reason)

def promote(con, kid, stat_evidence, video_ids=None, at=None):
    """新しい統計結果で仮説を知識へ昇格させる（条件を満たす場合のみ）"""
    ensure(con)
    at = at or datetime.date.today().isoformat()
    r = con.execute("SELECT * FROM knowledge_records WHERE kid=?", (kid,)).fetchone()
    if not r:
        raise KnowledgeError("知識が見つかりません: %s" % kid)
    vids = video_ids or uj(r["video_ids"], [])
    status, reasons = _judge_status(vids, stat_evidence, r["evidence_id"])
    con.execute("UPDATE knowledge_records SET status=?, confidence=?, stat_evidence=?, "
                "video_ids=?, updated_at=? WHERE kid=?",
                (status, "高" if status == "knowledge" else "中",
                 j(stat_evidence), j(vids), at, kid))
    con.commit()
    return dict(kid=kid, status=status, reasons=reasons)

def get(con, kid):
    ensure(con)
    r = con.execute("SELECT * FROM knowledge_records WHERE kid=?", (kid,)).fetchone()
    if not r:
        return None
    d = dict(r)
    for k in ("video_ids", "metric_evidence", "stat_evidence", "experiment_ids"):
        d[k] = uj(d[k])
    d["refutations"] = [dict(x) for x in con.execute(
        "SELECT * FROM knowledge_refutations WHERE kid=? ORDER BY id", (kid,))]
    return d

def list_records(con, status=None, category=None):
    ensure(con)
    w, p = ["1=1"], []
    if status: w.append("status=?"); p.append(status)
    if category: w.append("category=?"); p.append(category)
    rows = [dict(x) for x in con.execute(
        "SELECT * FROM knowledge_records WHERE %s ORDER BY kid" % " AND ".join(w), p)]
    for d in rows:
        for k in ("video_ids", "metric_evidence", "stat_evidence", "experiment_ids"):
            d[k] = uj(d[k])
    return rows

def stats_summary(con):
    ensure(con)
    by = {r[0]: r[1] for r in con.execute(
        "SELECT status, COUNT(*) FROM knowledge_records GROUP BY status")}
    cat = {r[0]: r[1] for r in con.execute(
        "SELECT category, COUNT(*) FROM knowledge_records GROUP BY category")}
    ref = con.execute("SELECT COUNT(*) FROM knowledge_refutations").fetchone()[0]
    total = sum(by.values())
    return dict(total=total, by_status=by, by_category=cat, refutations=ref,
                knowledge=by.get("knowledge", 0), hypothesis=by.get("hypothesis", 0),
                refuted=by.get("refuted", 0),
                note=("『知識』は統計的裏づけと Evidence を持つものだけ。"
                      "満たさないものは自動的に『仮説』に落ちる。"))

def render(con):
    s = stats_summary(con)
    L = ["# Knowledge Engine（Phase11）", "",
         "知識 %d / 仮説 %d / 否定済み %d ／ 否定履歴 %d件" % (
             s["knowledge"], s["hypothesis"], s["refuted"], s["refutations"]), "",
         "| ID | 状態 | 確信度 | カテゴリ | タイトル | 根拠動画 | 統計 | Evidence | 更新日 |",
         "|----|------|--------|---------|---------|---------|------|----------|--------|"]
    for r in list_records(con):
        st = r["stat_evidence"]
        stx = "—" if not st else ("p=%s q=%s d=%s" % (st.get("p"), st.get("q_fdr"), st.get("cohens_d")))
        L.append("| %s | %s | %s | %s | %s | %d本 | %s | %s | %s |" % (
            r["kid"], r["status"], r["confidence"], r["category"], r["title"],
            len(r["video_ids"] or []), stx, r["evidence_id"], r["updated_at"]))
    refs = [dict(x) for x in con.execute("SELECT * FROM knowledge_refutations ORDER BY id")]
    if refs:
        L += ["", "## 否定された履歴（削除せず残す）", "",
              "| 知識ID | 否定日 | 理由 | 誰が |", "|--------|--------|------|------|"]
        L += ["| %s | %s | %s | %s |" % (x["kid"], x["refuted_at"], x["reason"], x["refuted_by"])
              for x in refs]
    return "\n".join(L) + "\n"
