#!/usr/bin/env python3
"""
TITAN Video DB — SQLite（標準ライブラリのみ。追加課金なし・サーバ不要）

設計:
  videos    … 1本1行。よく検索する指標はカラム化し、全解析結果は JSON blob で保持
  outcomes  … 公開後の実績（再生数・保持率など）。**手入力または Analytics CSV から取り込む**
  metrics   … 縦持ちの汎用テーブル。新しい指標を追加してもスキーマ変更不要

ベクトルDBを使わない理由:
  本フェーズの検索要件（教育だけ / 30秒以内 / 100万再生以上 / 字幕あり）は
  すべて構造化クエリで足りる。埋め込み検索が必要になった時点で
  registry の milvus / meilisearch を評価して追加する（実測が先、導入は後）。
"""
import sqlite3, json, os

SCHEMA = """
CREATE TABLE IF NOT EXISTS videos (
  sha1 TEXT PRIMARY KEY,
  label TEXT, file TEXT, path TEXT, ingested_at TEXT,
  width INTEGER, height INTEGER, fps REAL, duration_sec REAL,
  aspect_9_16 INTEGER, has_audio INTEGER, filesize_bytes INTEGER,
  cuts INTEGER, cuts_per_10sec REAL,
  shot_mean REAL, shot_median REAL, shot_variance REAL, shot_stdev REAL,
  over_2sec_ratio_pct REAL,
  change_per_sec REAL, longest_static_sec REAL, mean_frame_diff REAL,
  zoom_ratio REAL, zoom_events INTEGER, pan_events INTEGER,
  brightness REAL, contrast REAL, saturation REAL, color_temp REAL,
  dominant_band INTEGER, bottom_band_pct REAL,
  thirds_ratio REAL, center_weight REAL,
  open_0_5s_change REAL, open_1s_changes INTEGER, open_3s_cuts INTEGER,
  loop_gap REAL,
  bpm INTEGER, onset_per_sec REAL, silence_ratio REAL,
  genre TEXT, source TEXT, notes TEXT,
  raw_json TEXT
);
CREATE TABLE IF NOT EXISTS outcomes (
  sha1 TEXT, measured_at TEXT,
  views INTEGER, retention_3s_pct REAL, completion_pct REAL, avg_watch_sec REAL,
  saves INTEGER, shares INTEGER, comments INTEGER, likes INTEGER,
  profile_visits INTEGER, site_sessions INTEGER,
  PRIMARY KEY (sha1, measured_at)
);
CREATE TABLE IF NOT EXISTS metrics (
  sha1 TEXT, key TEXT, value REAL, PRIMARY KEY (sha1, key)
);
CREATE TABLE IF NOT EXISTS knowledge (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sha1 TEXT, kind TEXT, text TEXT, evidence TEXT, confidence TEXT, created_at TEXT
);
CREATE TABLE IF NOT EXISTS improvements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sha1_from TEXT, sha1_to TEXT, change TEXT, metric_deltas TEXT, created_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_kn    ON knowledge(sha1, kind);
CREATE INDEX IF NOT EXISTS idx_dur   ON videos(duration_sec);
CREATE INDEX IF NOT EXISTS idx_genre ON videos(genre);
"""

def connect(dbpath):
    os.makedirs(os.path.dirname(os.path.abspath(dbpath)), exist_ok=True)
    con = sqlite3.connect(dbpath)
    con.row_factory = sqlite3.Row
    con.executescript(SCHEMA)
    return con

def _g(d, *ks, default=None):
    for k in ks:
        if d is None:
            return default
        d = d.get(k) if isinstance(d, dict) else None
    return default if d is None else d

def flatten(r):
    v, f = r["video"], r["format"]
    return dict(
        sha1=r["sha1"], label=r["label"], file=r["file"], path=r["path"],
        width=f["width"], height=f["height"], fps=f["fps"], duration_sec=f["duration_sec"],
        aspect_9_16=int(bool(f["aspect_9_16"])), has_audio=int(bool(f["has_audio"])),
        filesize_bytes=r["filesize_bytes"],
        cuts=_g(v, "cuts", "count"), cuts_per_10sec=_g(v, "cuts", "per_10sec"),
        shot_mean=_g(v, "shot_length", "mean"), shot_median=_g(v, "shot_length", "median"),
        shot_variance=_g(v, "shot_length", "variance"), shot_stdev=_g(v, "shot_length", "stdev"),
        over_2sec_ratio_pct=_g(v, "shot_length", "over_2sec_ratio_pct"),
        change_per_sec=_g(v, "screen_change", "per_sec"),
        longest_static_sec=_g(v, "screen_change", "longest_static_run_sec"),
        mean_frame_diff=_g(v, "motion", "mean_frame_diff"),
        zoom_ratio=_g(v, "camera", "zoom_ring_center_ratio"),
        zoom_events=_g(v, "camera", "zoom_events"), pan_events=_g(v, "camera", "pan_events"),
        brightness=_g(v, "color", "mean_brightness_0_255"),
        contrast=_g(v, "color", "mean_contrast_stdev"),
        saturation=_g(v, "color", "mean_saturation_0_1"),
        color_temp=_g(v, "color", "color_temperature_r_b_ratio"),
        dominant_band=_g(v, "text_layout", "dominant_band"),
        bottom_band_pct=_g(v, "text_layout", "bottom_band_share_pct"),
        thirds_ratio=_g(v, "composition", "rule_of_thirds_energy_ratio"),
        center_weight=_g(v, "composition", "center_weight_ratio"),
        open_0_5s_change=_g(v, "opening", "first_0_5s", "mean_change"),
        open_1s_changes=_g(v, "opening", "first_1s", "significant_changes"),
        open_3s_cuts=_g(v, "opening", "first_3s", "cuts"),
        loop_gap=_g(v, "loop", "first_last_frame_diff"),
        bpm=_g(r, "audio", "estimated_bpm"),
        onset_per_sec=_g(r, "audio", "onset_per_sec"),
        silence_ratio=_g(r, "audio", "silence_ratio"),
    )

def upsert(con, result, genre=None, source=None, notes=None, ingested_at="1970-01-01"):
    row = flatten(result)
    row.update(genre=genre, source=source, notes=notes,
               ingested_at=ingested_at, raw_json=json.dumps(result, ensure_ascii=False))
    cols = ",".join(row)
    ph = ",".join("?"*len(row))
    con.execute("INSERT OR REPLACE INTO videos (%s) VALUES (%s)" % (cols, ph), list(row.values()))
    for k, val in row.items():
        if isinstance(val, (int, float)) and not isinstance(val, bool):
            con.execute("INSERT OR REPLACE INTO metrics VALUES (?,?,?)", (row["sha1"], k, float(val)))
    con.commit()
    return row["sha1"]

def set_outcome(con, sha1, measured_at, **kw):
    keys = ["views", "retention_3s_pct", "completion_pct", "avg_watch_sec", "saves",
            "shares", "comments", "likes", "profile_visits", "site_sessions"]
    vals = [kw.get(k) for k in keys]
    con.execute("INSERT OR REPLACE INTO outcomes (sha1,measured_at,%s) VALUES (?,?,%s)"
                % (",".join(keys), ",".join("?"*len(keys))), [sha1, measured_at]+vals)
    con.commit()

SAFE_COLS = None
def query(con, where="1=1", params=(), limit=100, order="duration_sec"):
    global SAFE_COLS
    if SAFE_COLS is None:
        SAFE_COLS = {r[1] for r in con.execute("PRAGMA table_info(videos)")} | \
                    {r[1] for r in con.execute("PRAGMA table_info(outcomes)")}
    if order.split()[0] not in SAFE_COLS:
        raise ValueError("不正な order 指定: %s" % order)
    sql = ("SELECT v.*, o.views, o.retention_3s_pct, o.completion_pct, o.saves, o.shares "
           "FROM videos v LEFT JOIN outcomes o ON v.sha1=o.sha1 "
           "WHERE %s ORDER BY %s LIMIT ?" % (where, order))
    return [dict(r) for r in con.execute(sql, list(params)+[limit])]


# ── 知識DB（Phase5: 成功要因 / 失敗要因 / 改善履歴） ─────────────────

KINDS = ("success_factor", "failure_factor", "note", "hypothesis")

def add_knowledge(con, sha1, kind, text, evidence=None, confidence="中", created_at="1970-01-01"):
    """成功要因・失敗要因を記録する。
    evidence には**実測値または統計結果**を入れる。感想は入れない。"""
    if kind not in KINDS:
        raise ValueError("kind は %s のいずれか" % (KINDS,))
    con.execute("INSERT INTO knowledge (sha1,kind,text,evidence,confidence,created_at) VALUES (?,?,?,?,?,?)",
                (sha1, kind, text, evidence, confidence, created_at))
    con.commit()

def get_knowledge(con, sha1=None, kind=None):
    w, p = ["1=1"], []
    if sha1: w.append("sha1=?"); p.append(sha1)
    if kind: w.append("kind=?"); p.append(kind)
    return [dict(r) for r in con.execute(
        "SELECT * FROM knowledge WHERE %s ORDER BY id DESC" % " AND ".join(w), p)]

TRACKED = ["duration_sec", "cuts", "cuts_per_10sec", "shot_median", "shot_variance",
           "over_2sec_ratio_pct", "change_per_sec", "longest_static_sec", "mean_frame_diff",
           "zoom_events", "brightness", "contrast", "open_0_5s_change", "open_3s_cuts", "loop_gap"]

def add_improvement(con, sha1_from, sha1_to, change, created_at="1970-01-01"):
    """改善履歴。指標の差分を自動計算して保存する（何をしたら何が動いたかを残す）"""
    a = con.execute("SELECT * FROM videos WHERE sha1=?", (sha1_from,)).fetchone()
    b = con.execute("SELECT * FROM videos WHERE sha1=?", (sha1_to,)).fetchone()
    if not a or not b:
        raise ValueError("対象の動画がDBにありません")
    d = {}
    for k in TRACKED:
        va, vb = a[k], b[k]
        if isinstance(va, (int, float)) and isinstance(vb, (int, float)):
            d[k] = dict(before=va, after=vb, delta=round(vb - va, 4))
    con.execute("INSERT INTO improvements (sha1_from,sha1_to,change,metric_deltas,created_at) VALUES (?,?,?,?,?)",
                (sha1_from, sha1_to, change, json.dumps(d, ensure_ascii=False), created_at))
    con.commit()
    return d

def get_improvements(con):
    rows = []
    for r in con.execute("SELECT * FROM improvements ORDER BY id"):
        r = dict(r); r["metric_deltas"] = json.loads(r["metric_deltas"]); rows.append(r)
    return rows

def data_sufficiency(con, min_videos=10, min_outcomes=5):
    """Phase7 のゲート: データが足りているかを判定する。
    足りていなければ AI Director は提案を出さない。"""
    n_v = con.execute("SELECT COUNT(*) FROM videos").fetchone()[0]
    n_o = con.execute("SELECT COUNT(DISTINCT sha1) FROM outcomes").fetchone()[0]
    ok = (n_v >= min_videos and n_o >= min_outcomes)
    missing = []
    if n_v < min_videos:
        missing.append("解析済み動画が %d本（必要 %d本）" % (n_v, min_videos))
    if n_o < min_outcomes:
        missing.append("実績データ付き動画が %d本（必要 %d本）" % (n_o, min_outcomes))
    return dict(sufficient=ok, videos=n_v, videos_with_outcome=n_o,
                required=dict(videos=min_videos, outcomes=min_outcomes),
                missing=missing,
                note=("データ十分。提案生成を許可する。" if ok else
                      "**データ不足。台本・投稿戦略の提案は行わない。** 解析と実績登録を先に行うこと。"))
