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
