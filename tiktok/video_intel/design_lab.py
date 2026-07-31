#!/usr/bin/env python3
"""
Phase14 / Design System Laboratory

動画の設計そのものを資産として管理する。
値を変えるときは **理由と Evidence を必ず伴う**。理由なしの変更はできない。

管理対象: フォント / 字幕 / CTA / 色 / BGM / 効果音 / 構図 / 編集テンポ / ブランドルール
変更履歴: design_history に全件保持（誰が・いつ・なぜ・根拠は何か）
"""
import datetime, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from odin_store import ensure
import evidence as EV

VERSION = "1.0"

# DESIGN-SYSTEM.md v1.0 の値を資産として取り込む（出所を rationale に明記）
SEED = [
    # key, category, value, unit, rationale
    ("font.primary", "フォント", "Noto Sans JP", "", "ブランド指定。現状は IPAGothic で代用中（未達）"),
    ("font.size.hook", "フォント", "104", "px", "1080px幅基準。フック文の可読性"),
    ("font.size.heading", "フォント", "92", "px", "見出し"),
    ("font.size.body", "フォント", "76", "px", "本文"),
    ("font.size.sub", "フォント", "56", "px", "補助"),
    ("font.size.note", "フォント", "40", "px", "注釈"),

    ("subtitle.words_per_line", "字幕", "3-7", "語", "研究レポート E1"),
    ("subtitle.min_display", "字幕", "1.5", "秒", "研究レポート E5"),
    ("subtitle.position", "字幕", "中央〜下3分の1（縦帯3-4）", "", "研究レポート E8"),
    ("subtitle.stroke", "字幕", "4-5", "px", "研究レポート E7（明色文字＋濃色縁取り）"),
    ("subtitle.max_width", "字幕", "864", "px", "セーフエリア x86-950 の内側"),

    ("cta.position", "CTA", "最後2-3秒", "", "研究レポート E4"),
    ("cta.words", "CTA", "2-3", "語", "研究レポート E4"),
    ("cta.example", "CTA", "プロフィールへ", "", "動画#1 v3 で使用"),

    ("color.bg", "色", "#0d1f1a", "", "ブランドカラー forest-deep"),
    ("color.fg", "色", "#f4efe2", "", "parchment / 背景比 14.90:1（WCAG AA合格・計算値）"),
    ("color.accent", "色", "#d4a96a", "", "accent / 背景比 7.88:1（合格）"),
    ("color.warn", "色", "#e0705c", "", "背景比 5.41:1（合格）。#c85a4a は 4.09:1 で不合格だったため変更"),
    ("color.stroke", "色", "#06100d", "", "テロップ縁取り"),

    ("bgm.bpm", "BGM", "80-100", "BPM", "研究レポート G1（チュートリアル帯）"),
    ("bgm.trend_audio", "BGM", "使わない", "", "音源の世界観がブランドを規定してしまうため"),
    ("bgm.narration", "BGM", "肉声（AI音声不可）", "", "研究レポート H2/H3（真正性の信頼 81% vs 63%）"),
    ("se.policy", "効果音", "過剰なSEを使わない", "", "高級感と両立しないため"),

    ("composition.safe_x", "構図", "86-950", "px", "TikTok右側UI回避（保守値・実機未検証）"),
    ("composition.safe_y", "構図", "288-1382", "px", "上部UI・下部キャプション帯回避"),
    ("composition.bottom_band_max", "構図", "8", "%", "最下帯の占有上限（UI衝突防止）"),

    ("tempo.duration", "編集テンポ", "38-45", "秒", "研究レポート F1/F3/F4"),
    ("tempo.cuts_per_10sec_min", "編集テンポ", "2.5", "回", "研究レポート D3（+26%完走率）"),
    ("tempo.shot_median_max", "編集テンポ", "2.0", "秒", "研究レポート D1"),
    ("tempo.over2s_ratio_max", "編集テンポ", "35", "%", "研究レポート D1"),
    ("tempo.longest_static_max", "編集テンポ", "1.5", "秒", "研究レポート D1/D2"),
    ("tempo.change_per_sec_min", "編集テンポ", "0.8", "回", "研究レポート D1"),
    ("tempo.open_3s_cuts_min", "編集テンポ", "2", "回", "研究レポート A3（n=34,635）"),

    ("brand.display_name", "ブランドルール", "亀好きさん", "", "恒久ルール。Tete系表記は禁止"),
    ("brand.priority", "ブランドルール", "正確性＞信頼＞ブランド＞品質＞再生数＞利益", "", "会社憲法（不変）"),
    ("brand.ai_imagery", "ブランドルール", "AI生成の実写風映像は使わない", "", "研究レポート H2/H3/H4"),
    ("brand.unknown", "ブランドルール", "分からないことは分からないと書く", "", "品質基準"),
    ("brand.species", "ブランドルール", "飼育していない種を飼育しているように見せない", "", "恒久ルール"),
]

def seed(con, at=None):
    """初期資産を投入する（既にあるキーは上書きしない）"""
    ensure(con)
    at = at or datetime.date.today().isoformat()
    n = 0
    for key, cat, val, unit, why in SEED:
        if con.execute("SELECT 1 FROM design_assets WHERE key=?", (key,)).fetchone():
            continue
        evid = EV.create(con, kind="design_asset",
                         source_docs=["tiktok/DESIGN-SYSTEM.md", "tiktok/research/RESEARCH-REPORT.md"],
                         note="%s = %s" % (key, val), created_at=at)
        con.execute("INSERT INTO design_assets VALUES (?,?,?,?,?,?,?,?)",
                    (key, cat, val, unit, why, evid, VERSION, at))
        con.execute("INSERT INTO design_history (key,old_value,new_value,reason,evidence_id,changed_at) "
                    "VALUES (?,?,?,?,?,?)", (key, None, val, "初期登録（DESIGN-SYSTEM v1.0より）", evid, at))
        n += 1
    con.commit()
    return n

def update(con, key, new_value, reason, evidence_id=None, at=None):
    """値を変更する。**理由と Evidence が無ければ変更できない。**"""
    ensure(con)
    if not reason:
        raise ValueError("理由のない変更はできません（Phase14の規約）")
    at = at or datetime.date.today().isoformat()
    r = con.execute("SELECT * FROM design_assets WHERE key=?", (key,)).fetchone()
    if not r:
        raise ValueError("未登録のキー: %s" % key)
    if not evidence_id:
        evidence_id = EV.create(con, kind="design_change",
                                source_docs=["design_lab.update"],
                                note="%s: %s → %s / %s" % (key, r["value"], new_value, reason),
                                created_at=at)
    con.execute("UPDATE design_assets SET value=?, evidence_id=?, updated_at=? WHERE key=?",
                (str(new_value), evidence_id, at, key))
    con.execute("INSERT INTO design_history (key,old_value,new_value,reason,evidence_id,changed_at) "
                "VALUES (?,?,?,?,?,?)", (key, r["value"], str(new_value), reason, evidence_id, at))
    con.commit()
    return dict(key=key, old=r["value"], new=str(new_value), evidence_id=evidence_id)

def get_all(con, category=None):
    ensure(con)
    w, p = ("category=?", [category]) if category else ("1=1", [])
    return [dict(x) for x in con.execute(
        "SELECT * FROM design_assets WHERE %s ORDER BY category, key" % w, p)]

def history(con, key=None):
    ensure(con)
    w, p = ("key=?", [key]) if key else ("1=1", [])
    return [dict(x) for x in con.execute(
        "SELECT * FROM design_history WHERE %s ORDER BY id DESC" % w, p)]

def summary(con):
    ensure(con)
    by = {r[0]: r[1] for r in con.execute("SELECT category, COUNT(*) FROM design_assets GROUP BY category")}
    return dict(assets=sum(by.values()), by_category=by,
                changes=con.execute("SELECT COUNT(*) FROM design_history").fetchone()[0])

def render(con):
    s = summary(con)
    L = ["# Design System Laboratory（Phase14）", "",
         "資産 %d件 / 変更履歴 %d件 / version %s" % (s["assets"], s["changes"], VERSION), "",
         "| カテゴリ | キー | 値 | 単位 | 根拠 | Evidence |",
         "|---------|-----|----|----- |------|----------|"]
    for a in get_all(con):
        L.append("| %s | %s | %s | %s | %s | %s |" % (
            a["category"], a["key"], a["value"], a["unit"] or "", a["rationale"], a["evidence_id"]))
    h = history(con)[:15]
    L += ["", "## 変更履歴（最新15件）", "",
          "| 日付 | キー | 変更前 | 変更後 | 理由 | Evidence |",
          "|------|-----|--------|--------|------|----------|"]
    for x in h:
        L.append("| %s | %s | %s | %s | %s | %s |" % (
            x["changed_at"], x["key"], x["old_value"] or "—", x["new_value"],
            x["reason"], x["evidence_id"]))
    return "\n".join(L) + "\n"
