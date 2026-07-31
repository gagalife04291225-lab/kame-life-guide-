#!/usr/bin/env python3
"""
ODIN / Research Department（AI Company OS の研究部）

役割:
  1. OSS新着・更新の取り込み（GitHub Actions が収集したJSONを読む）
  2. 採用候補の評価（実測フィールドのみ）
  3. ライセンス確認（商用可否・ネットワークコピーレフトの警告）
  4. 既存構成との比較 —— **既存より優れている場合のみ**候補として提案する
  5. 更新レポート生成

原則:
  - 「star数が多い」だけでは採用候補にしない。**現行構成の弱点を埋める**場合のみ。
  - 有料・GPU必須・ライセンス不適合は自動で除外する。
  - 判断根拠は必ず数値で残す。
"""
import json, os, sys, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from oss import rank as R
from oss import capabilities as C

# ── 現行構成（ODIN v1.0 が実際に使っているもの） ────────────────────
CURRENT_STACK = {
    "動画取得":       dict(name="yt-dlp/yt-dlp", role="動画取得", replaceable=True),
    "動画基盤":       dict(name="FFmpeg (imageio-ffmpeg同梱)", role="復号・フレーム抽出", replaceable=False),
    "数値計算":       dict(name="numpy", role="全解析の基盤", replaceable=False),
    "カット解析":     dict(name="自前実装 (engine.py)", role="カット検出・静止検出", replaceable=True),
    "統計解析":       dict(name="自前実装 (stats.py)", role="Welch t / Pearson / FDR", replaceable=True),
    "DB":            dict(name="SQLite (標準)", role="知識DB", replaceable=True),
    "WebUI":         dict(name="http.server (標準)", role="ダッシュボード", replaceable=True),
    "MCP":           dict(name="自前実装 (mcp_server.py)", role="MCPサーバ", replaceable=True),
    "OCR":           dict(name="tesseract (任意)", role="字幕抽出", replaceable=True),
    "音声解析":       dict(name="faster-whisper (任意)", role="ナレーション速度", replaceable=True),
    "被写体解析":     dict(name="mediapipe (任意)", role="姿勢・表情", replaceable=True),
    "ベクトル検索":   dict(name="未導入", role="現時点で不要と判断", replaceable=True),
}

# 現行構成が満たしていない領域＝ここを埋める候補だけが価値を持つ
GAPS = {
    "ベクトル検索": "動画本数が増えて類似検索が必要になった場合のみ。現時点は SQL で足りる",
    "AI生成判定":  "実写/CG/AI生成の割合が未測定。分類器が必要",
    "ロゴ検出":    "学習済みロゴモデルが無い",
    "音楽解析":    "BPM推定の確度が低い。ただし主要OSS(essentia)がAGPLで不適合",
    "感情解析":    "感情変化・驚きの位置が未測定",
}

# 自動除外の条件
def disqualify(r):
    """採用候補から自動的に外す条件。理由を返す（Noneなら除外しない）"""
    lic = (r.get("license") or "").lower()
    cls = R.LICENSE_CLASS.get(lic, "unknown")
    if r.get("archived"):
        return "アーカイブ済（開発終了）"
    if cls == "network-copyleft":
        return "AGPL系。WebUI提供時にソース公開義務が及びうる（★絶対条件『商用ライセンス購入禁止』とも衝突）"
    if cls == "strong-copyleft":
        return "GPL系。リンク時に公開義務が及びうる。採用は要検討"
    caps = C.capabilities(r)
    if caps.get("gpu_required") is True and caps.get("cpu_ok") is not True:
        return "GPU必須の申告あり（絶対条件『ローカル無料構成』に反する可能性）"
    m = C.maintenance(r)
    if m["status"] == "stale":
        return "1年以上更新なし（保守停滞）"
    return None

def evaluate(r, incumbent_score=None):
    """候補1件を評価する。実測フィールドのみ。"""
    sc = R.score_repo(r)
    dq = disqualify(r)
    caps = C.capabilities(r)
    diff = C.install_difficulty(r)
    verdict, reason = "不採用", (dq or "")
    if dq is None:
        cats = [c for c in r["category"].split("/") if c in GAPS]
        if cats:
            verdict = "採用候補（未充足領域を埋める）"
            reason = "現行構成に無い領域: %s（%s）" % (", ".join(cats), GAPS[cats[0]])
        elif incumbent_score is not None and sc["score"] > incumbent_score + 10:
            verdict = "比較検証の対象"
            reason = "同カテゴリの現行より score が %.1f 高い（+10超）" % (sc["score"] - incumbent_score)
        else:
            verdict = "保留（現行で足りている）"
            reason = "現行構成が要件を満たしており、置き換える理由がない"
    return dict(full_name=r["full_name"], category=r["category"], **sc,
                license=r.get("license"), license_class=R.LICENSE_CLASS.get((r.get("license") or "").lower(), "unknown"),
                capabilities=caps, install_difficulty=diff["level"],
                maintenance=C.maintenance(r)["label"],
                verdict=verdict, reason=reason)

def daily_report(candidates=None, today=None):
    """candidates: GitHub Actions が集めた新着リスト（無ければレジストリ全体を点検）"""
    today = today or datetime.date.today().isoformat()
    reg = R.load()
    ranked = R.rank()
    by_cat = {}
    for r in ranked:
        for c in r["category"].split("/"):
            by_cat.setdefault(c, []).append(r["score"])
    incumbent = {c: max(v) for c, v in by_cat.items()}

    src = candidates if candidates is not None else reg["repos"]
    evals = [evaluate(r, incumbent.get(r["category"].split("/")[0])) for r in src]

    adopt = [e for e in evals if e["verdict"].startswith("採用候補")]
    test = [e for e in evals if e["verdict"] == "比較検証の対象"]
    reject = [e for e in evals if e["verdict"] == "不採用"]
    hold = [e for e in evals if e["verdict"].startswith("保留")]
    adopt.sort(key=lambda e: -e["score"]); test.sort(key=lambda e: -e["score"])

    cv = C.coverage(reg["repos"])
    lines = [
        "# ODIN Research Department 日次レポート — %s" % today, "",
        "調査対象: **%d件** / カテゴリ %d種" % (len(reg["repos"]), len({c for r in reg["repos"] for c in r["category"].split("/")})),
        "測定カバレッジ: topics %d/%d (%.1f%%) ／ license %d/%d (%.1f%%)" % (
            cv["topics_measured"], cv["total"], cv["topics_coverage_pct"],
            cv["license_measured"], cv["total"], cv["license_coverage_pct"]),
        "", "## 判定サマリ", "",
        "| 判定 | 件数 |", "|------|------|",
        "| 採用候補（未充足領域） | %d |" % len(adopt),
        "| 比較検証の対象 | %d |" % len(test),
        "| 保留（現行で足りている） | %d |" % len(hold),
        "| 不採用（自動除外） | %d |" % len(reject), "",
    ]
    if adopt:
        lines += ["## 採用候補（現行構成の穴を埋めるもののみ）", "",
                  "| repo | カテゴリ | score | ライセンス | 導入難易度 | 理由 |",
                  "|------|---------|-------|-----------|-----------|------|"]
        for e in adopt[:15]:
            lines.append("| %s | %s | %.1f | %s | %s | %s |" % (
                e["full_name"], e["category"], e["score"], e["license"] or "未測定",
                e["install_difficulty"], e["reason"]))
        lines.append("")
    if test:
        lines += ["## 比較検証の対象（現行より score +10 超）", "",
                  "| repo | カテゴリ | score | 理由 |", "|------|---------|-------|------|"]
        for e in test[:10]:
            lines.append("| %s | %s | %.1f | %s |" % (e["full_name"], e["category"], e["score"], e["reason"]))
        lines.append("")
    dq_counts = {}
    for e in reject:
        dq_counts[e["reason"]] = dq_counts.get(e["reason"], 0) + 1
    if dq_counts:
        lines += ["## 自動除外の内訳", "", "| 理由 | 件数 |", "|------|------|"]
        lines += ["| %s | %d |" % (k, v) for k, v in sorted(dq_counts.items(), key=lambda x: -x[1])]
        lines.append("")
    lines += ["## 現行構成（比較の基準）", "", "| 層 | 採用中 | 役割 | 置換可否 |", "|----|--------|------|---------|"]
    for k, v in CURRENT_STACK.items():
        lines.append("| %s | %s | %s | %s |" % (k, v["name"], v["role"], "可" if v["replaceable"] else "不可（基盤）"))
    lines += ["", "## 未充足領域（ここを埋める候補だけが価値を持つ）", ""]
    lines += ["- **%s**: %s" % (k, v) for k, v in GAPS.items()]
    lines += ["", "---",
              "_判定はすべて実測フィールド（stars/forks/issues/更新日/archived/topics/license）由来。_",
              "_速度・精度は未測定のためスコアに含めていない。_"]
    return "\n".join(lines) + "\n", dict(adopt=adopt, test=test, hold=len(hold), reject=reject)

def main():
    cand = None
    if len(sys.argv) > 1 and os.path.exists(sys.argv[1]):
        cand = json.load(open(sys.argv[1], encoding="utf-8"))
    md, data = daily_report(cand)
    print(md)
    out = os.path.join(HERE, "..", "research", "odin-research-report.md")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, "w", encoding="utf-8").write(md)
    print("レポート: %s" % os.path.abspath(out))

if __name__ == "__main__":
    main()
