#!/usr/bin/env python3
"""
ODIN v2.0 ストア（追加スキーマ）

ODIN v1.0 のテーブル（videos / outcomes / metrics / knowledge / improvements）は
**一切変更しない**。v2.0 は追加テーブルだけで構成する。

追加テーブル:
  evidence               Evidence ID（Phase16）— すべての提案が参照を持つための土台
  knowledge_records      知識レコード（Phase11）
  knowledge_refutations  否定された履歴（Phase11）
  experiments            実験（Phase13）
  benchmark_sources      競合監視ソースと到達可否（Phase12）
  benchmark_observations 競合観測値（未取得も行として残す）（Phase12）
  design_assets          デザイン資産（Phase14）
  design_history         デザイン変更履歴（Phase14）
  company_memory         会社の記憶（Phase15）
  self_reviews           自己監査の記録（Phase17）
"""
import sqlite3, os, json, hashlib

SCHEMA_V2 = """
CREATE TABLE IF NOT EXISTS evidence (
  evid TEXT PRIMARY KEY, kind TEXT, created_at TEXT,
  video_ids TEXT, metric_refs TEXT, stat_refs TEXT, experiment_ids TEXT,
  knowledge_ids TEXT, source_docs TEXT, note TEXT
);
CREATE TABLE IF NOT EXISTS knowledge_records (
  kid TEXT PRIMARY KEY,
  title TEXT NOT NULL, category TEXT NOT NULL, claim TEXT NOT NULL,
  status TEXT NOT NULL,              -- knowledge | hypothesis | refuted
  confidence TEXT NOT NULL,          -- 高 | 中 | 低
  video_ids TEXT, metric_evidence TEXT, stat_evidence TEXT,
  evidence_id TEXT, experiment_ids TEXT,
  created_at TEXT, updated_at TEXT, superseded_by TEXT
);
CREATE TABLE IF NOT EXISTS knowledge_refutations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kid TEXT, refuted_at TEXT, reason TEXT, evidence_id TEXT, refuted_by TEXT
);
CREATE TABLE IF NOT EXISTS experiments (
  eid TEXT PRIMARY KEY, title TEXT, hypothesis TEXT, variable TEXT,
  metric TEXT, direction TEXT,       -- increase | decrease
  outcome_metric TEXT,
  group_a_query TEXT, group_b_query TEXT,
  status TEXT,                       -- designed | analyzed
  verdict TEXT,                      -- 採用 | 却下 | 保留 | 判定不能
  result_json TEXT, evidence_id TEXT,
  created_at TEXT, updated_at TEXT
);
CREATE TABLE IF NOT EXISTS benchmark_sources (
  source TEXT PRIMARY KEY, endpoint TEXT, reachable INTEGER,
  http_status TEXT, requires_key INTEGER, free_quota TEXT,
  last_checked TEXT, note TEXT
);
CREATE TABLE IF NOT EXISTS benchmark_observations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source TEXT, external_id TEXT, observed_at TEXT,
  field TEXT, value TEXT, status TEXT,   -- measured | unavailable
  reason TEXT
);
CREATE TABLE IF NOT EXISTS design_assets (
  key TEXT PRIMARY KEY, category TEXT, value TEXT, unit TEXT,
  rationale TEXT, evidence_id TEXT, version TEXT, updated_at TEXT
);
CREATE TABLE IF NOT EXISTS design_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT, old_value TEXT, new_value TEXT, reason TEXT,
  evidence_id TEXT, changed_at TEXT
);
CREATE TABLE IF NOT EXISTS company_memory (
  mid TEXT PRIMARY KEY, kind TEXT, title TEXT, detail TEXT,
  evidence_id TEXT, reproduced TEXT,  -- reproduced | not_reproduced | untested
  related_kid TEXT, related_eid TEXT, created_at TEXT
);
CREATE TABLE IF NOT EXISTS self_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reviewed_at TEXT, passed INTEGER, failed INTEGER,
  report_json TEXT
);
CREATE INDEX IF NOT EXISTS idx_kr_status ON knowledge_records(status);
CREATE INDEX IF NOT EXISTS idx_bo_src    ON benchmark_observations(source, external_id);
"""

def ensure(con):
    con.executescript(SCHEMA_V2)
    return con

def next_id(con, table, col, prefix, width=4):
    n = con.execute("SELECT COUNT(*) FROM %s" % table).fetchone()[0]
    while True:
        n += 1
        cid = "%s-%0*d" % (prefix, width, n)
        if not con.execute("SELECT 1 FROM %s WHERE %s=?" % (table, col), (cid,)).fetchone():
            return cid

def j(x):
    return None if x is None else json.dumps(x, ensure_ascii=False)

def uj(s, default=None):
    if not s:
        return default
    try:
        return json.loads(s)
    except Exception:
        return default
