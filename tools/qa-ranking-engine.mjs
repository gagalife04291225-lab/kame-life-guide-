/**
 * Kame Life Guide - Ranking Engine QA
 * Phase 13-A Step 3
 *
 * Run: node tools/qa-ranking-engine.mjs
 *
 * Checks:
 *  1  JSON valid
 *  2  Exactly 20 records
 *  3  Required fields exist
 *  4  All score fields integer 0-100
 *  5  slug unique
 *  6  species_page_url format valid
 *  7  market_tier valid enum
 *  8  category valid enum
 *  9  type0 top10 calculable
 *  10 type1 smell top10 calculable
 *  11 type11 japanese_native calculable
 *  12 no NaN scores
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCORES_PATH = join(__dirname, '..', 'data', 'species_scores.json');

// ── Constants ────────────────────────────────────────────────────────────

const REQUIRED_FIELDS = [
  'slug', 'species_name_ja', 'species_name_en', 'category',
  'beginner', 'smell', 'cost', 'space', 'maintenance',
  'friendliness', 'activity', 'rarity', 'monetization', 'authority',
  'has_page', 'species_page_url', 'compare_urls',
  'starter_kit_key', 'market_tier', 'notes'
];

const SCORE_FIELDS = [
  'beginner', 'smell', 'cost', 'space', 'maintenance',
  'friendliness', 'activity', 'rarity', 'monetization', 'authority'
];

const VALID_TIERS    = ['S', 'A+', 'A', 'B', 'C'];
const VALID_CATS     = ['aquatic', 'tortoise', 'box_turtle', 'side_neck', 'exotic'];
const URL_PATTERN    = /^\/species\/[a-z0-9-]+\.html$/;
const JAPANESE_SLUGS = [
  'reeves-turtle', 'japanese-pond-turtle',
  'yaeyama-pond-turtle', 'unkyu'
];

// ── Formula engine (Node-compatible copy) ────────────────────────────────

const FORMULAS = {
  type0: { weights: { beginner:0.30, smell:0.20, cost:0.20, space:0.15, maintenance:0.15 }, filter: null },
  type1: { weights: { smell:0.40, maintenance:0.20, beginner:0.20, space:0.10, cost:0.10 }, filter: null },
  type2: { weights: { space:0.40, beginner:0.25, smell:0.15, maintenance:0.10, cost:0.10 }, filter: null },
  type3: { weights: { friendliness:0.35, beginner:0.25, smell:0.20, space:0.10, cost:0.10 }, filter: null },
  type4: { weights: { beginner:0.35, maintenance:0.25, smell:0.20, space:0.10, cost:0.10 }, filter: null },
  type5: { weights: { cost:0.40, space:0.20, beginner:0.20, maintenance:0.10, smell:0.10 }, filter: null },
  type6: {
    weights: { beginner:0.30, cost:0.25, smell:0.20, space:0.15, maintenance:0.10 },
    bonusField: 'monetization', bonusWeight: 0.05,
    filter: s => s.category === 'tortoise'
  },
  type7: { weights: { maintenance:0.40, smell:0.25, beginner:0.15, space:0.10, cost:0.10 }, filter: null },
  type8: { weights: { activity:0.40, friendliness:0.25, beginner:0.15, smell:0.10, space:0.10 }, filter: null },
  type9: { weights: { rarity:0.40, activity:0.20, authority:0.20, friendliness:0.10, monetization:0.10 }, filter: null },
  // type10 は利用不可。lifespan 未整備。friendliness を寿命の代理に使う旧式は封鎖済み。
  type10: { unavailable: true, unavailableReason: 'lifespan 未整備', requiresFields: ['lifespan'], weights: {}, filter: null },
  type11: {
    weights: { beginner:0.25, cost:0.20, maintenance:0.20, authority:0.20, friendliness:0.15 },
    filter: s => JAPANESE_SLUGS.includes(s.slug)
  }
};

const isQuarantined = s => !!s && s.ranking_eligible === false;

function assertUsable(type) {
  const f = FORMULAS[type];
  if (f.unavailable) {
    throw new Error(`Ranking type "${type}" is unavailable: ${f.unavailableReason}`);
  }
  if (!f.weights || Object.keys(f.weights).length === 0) {
    throw new Error(`Ranking type "${type}" has no weights — refusing to score.`);
  }
}

function calcScore(species, type) {
  const f = FORMULAS[type];
  assertUsable(type);
  if (isQuarantined(species)) {
    throw new Error(`Refusing to score quarantined record "${species.slug}"`);
  }
  let total = Object.entries(f.weights).reduce((sum, [field, w]) => {
    return sum + species[field] * w;
  }, 0);
  if (f.bonusField) total += species[f.bonusField] * f.bonusWeight;
  return Math.round(total * 100) / 100;
}

function getTop(data, type, limit = 10) {
  const f = FORMULAS[type];
  assertUsable(type);
  const eligible = data.filter(s => !isQuarantined(s));
  const filtered = f.filter ? eligible.filter(f.filter) : eligible;
  return filtered
    .map(s => ({ ...s, _score: calcScore(s, type) }))
    .sort((a, b) => b._score - a._score)
    .slice(0, limit);
}

// ── QA runner ────────────────────────────────────────────────────────────

let data;
const results = [];
let pass = true;

function check(id, desc, fn) {
  try {
    const ok = fn();
    results.push({ id, desc, ok, err: null });
    if (!ok) pass = false;
  } catch (e) {
    results.push({ id, desc, ok: false, err: e.message });
    pass = false;
  }
}

// Check 1: JSON valid
check(1, 'JSON valid', () => {
  const raw = readFileSync(SCORES_PATH, 'utf-8');
  data = JSON.parse(raw);
  return Array.isArray(data);
});

if (!data) {
  console.error('FATAL: Cannot parse JSON. Aborting.');
  process.exit(1);
}

// Check 2: Exactly 20 records
check(2, 'Exactly 20 records', () => data.length === 20);

// Check 3: Required fields exist on all records
check(3, 'Required fields exist', () => {
  for (const s of data) {
    for (const f of REQUIRED_FIELDS) {
      if (!(f in s)) throw new Error(`Missing field "${f}" on slug "${s.slug}"`);
    }
  }
  return true;
});

// Check 4: All score fields integer 0-100
check(4, 'All score fields integer 0-100', () => {
  for (const s of data) {
    for (const f of SCORE_FIELDS) {
      const v = s[f];
      if (!Number.isInteger(v) || v < 0 || v > 100) {
        throw new Error(`Invalid score: ${s.slug}.${f} = ${v}`);
      }
    }
  }
  return true;
});

// Check 5: slug unique
check(5, 'slug unique', () => {
  const slugs = data.map(s => s.slug);
  const uniq = new Set(slugs);
  if (uniq.size !== slugs.length) {
    const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
    throw new Error('Duplicate slugs: ' + dupes.join(', '));
  }
  return true;
});

// Check 6: species_page_url format
check(6, 'species_page_url format valid (null 許容)', () => {
  // null は「canonical に種ページが無い」ことを表す正当な値（PR #118 / #123）。
  // 文字列の場合だけ形式を検査する。
  for (const s of data) {
    if (s.species_page_url === null) continue;
    if (!URL_PATTERN.test(s.species_page_url)) {
      throw new Error(`Bad URL: ${s.slug} → "${s.species_page_url}"`);
    }
  }
  return true;
});

// Check 7: market_tier valid enum
check(7, 'market_tier valid enum', () => {
  for (const s of data) {
    if (!VALID_TIERS.includes(s.market_tier)) {
      throw new Error(`Invalid tier: ${s.slug} → "${s.market_tier}"`);
    }
  }
  return true;
});

// Check 8: category valid enum
check(8, 'category valid enum', () => {
  for (const s of data) {
    if (!VALID_CATS.includes(s.category)) {
      throw new Error(`Invalid category: ${s.slug} → "${s.category}"`);
    }
  }
  return true;
});

// Check 9: type0 top10 calculable
check(9, 'type0 ranking_hub top10 calculable', () => {
  const top = getTop(data, 'type0');
  return top.length === 10 && top.every(s => typeof s._score === 'number');
});

// Check 10: type1 smell top10 calculable
check(10, 'type1 smell top10 calculable', () => {
  const top = getTop(data, 'type1');
  return top.length === 10 && top.every(s => typeof s._score === 'number');
});

// Check 11: type11 japanese_native calculable
check(11, 'type11 japanese_native calculable', () => {
  const top = getTop(data, 'type11');
  // only 3 native species in seed (yaeyama + reeves + japanese-pond)
  if (top.length < 3) throw new Error('Too few japanese native species: ' + top.length);
  return top.every(s => typeof s._score === 'number');
});

// Check 12: no NaN scores across all types
check(12, 'no NaN scores across all available types', () => {
  // 利用不可 type と隔離レコードは対象外（どちらも意図的に算出しない）
  for (const t of Object.keys(FORMULAS)) {
    const f = FORMULAS[t];
    if (f.unavailable) continue;
    const eligible = data.filter(s => !isQuarantined(s));
    const filtered = f.filter ? eligible.filter(f.filter) : eligible;
    for (const s of filtered) {
      const score = calcScore(s, t);
      if (isNaN(score)) throw new Error(`NaN score: ${s.slug} on ${t}`);
    }
  }
  return true;
});

// ── Phase 1A: 隔離と type10 封鎖の回帰検査 ──────────────────────────────

const QUARANTINED = ['reimanns-side-neck', 'yellow-spotted-river-turtle'];

// Check 13: 隔離対象が data 上で明示的に隔離されている
check(13, '隔離2件が ranking_eligible:false と理由を持つ', () => {
  for (const slug of QUARANTINED) {
    const r = data.find(s => s.slug === slug);
    if (!r) throw new Error(`Missing record: ${slug}`);
    if (r.ranking_eligible !== false) {
      throw new Error(`${slug}: ranking_eligible = ${r.ranking_eligible} (期待: false)`);
    }
    if (!r.quarantine_reason || r.quarantine_reason.length < 10) {
      throw new Error(`${slug}: quarantine_reason が無い/短すぎる`);
    }
  }
  return true;
});

// Check 14: 隔離レコードがどの type のランキング候補にも出ない
check(14, '隔離レコードは全 type のランキングに出現しない', () => {
  for (const t of Object.keys(FORMULAS)) {
    if (FORMULAS[t].unavailable) continue;
    const top = getTop(data, t, data.length);
    for (const slug of QUARANTINED) {
      if (top.some(s => s.slug === slug)) {
        throw new Error(`${slug} が ${t} のランキングに出現した`);
      }
    }
  }
  return true;
});

// Check 15: 隔離レコードは単体スコア計算も拒否される（61.90 を再生成できない）
check(15, 'reimanns-side-neck は 61.90 を再生成できない', () => {
  const r = data.find(s => s.slug === 'reimanns-side-neck');
  let threw = false;
  try { calcScore(r, 'type0'); } catch (e) { threw = true; }
  if (!threw) throw new Error('隔離レコードなのに type0 が計算できてしまった');
  // 生の重み計算では 61.90 になる値のままであること＝値は変更していない、
  // しかしエンジン経由では出せないこと、の両方を固定する
  const raw = r.beginner*0.30 + r.smell*0.20 + r.cost*0.20 + r.space*0.15 + r.maintenance*0.15;
  if (Math.round(raw * 100) / 100 !== 61.90) {
    throw new Error(`素の重み計算が 61.90 でない (${raw}) — 評価値が変更された可能性`);
  }
  return true;
});

// Check 16: type10 は明示的に利用不可（0点を返さず失敗する）
check(16, 'type10 long_life は利用不可として失敗する', () => {
  const f = FORMULAS.type10;
  if (!f.unavailable) throw new Error('type10 が unavailable になっていない');
  if (Object.keys(f.weights).length !== 0) {
    throw new Error('type10 に weights が残っている（代理指標が復活しうる）');
  }
  if ('friendliness' in f.weights) throw new Error('friendliness が寿命の代理として残っている');
  let threw = false;
  try { getTop(data, 'type10'); } catch (e) { threw = true; }
  if (!threw) throw new Error('type10 が計算できてしまった');
  return true;
});

// Check 17: type0〜9, 11 は従来どおり算出できる（不必要に壊していない）
check(17, 'type0〜9・11 は引き続き算出可能', () => {
  const usable = Object.keys(FORMULAS).filter(t => !FORMULAS[t].unavailable);
  if (usable.length !== 11) throw new Error(`利用可能 type が ${usable.length} 件（期待: 11）`);
  for (const t of usable) {
    const top = getTop(data, t);
    if (top.length === 0) throw new Error(`${t} の結果が空`);
    if (!top.every(s => typeof s._score === 'number' && !isNaN(s._score))) {
      throw new Error(`${t} に不正スコア`);
    }
  }
  return true;
});

// Check 18: type0 の重みは Phase 1A で変更していない
check(18, 'type0 の式が不変', () => {
  const w = FORMULAS.type0.weights;
  const expect = { beginner:0.30, smell:0.20, cost:0.20, space:0.15, maintenance:0.15 };
  for (const k of Object.keys(expect)) {
    if (w[k] !== expect[k]) throw new Error(`type0.${k} = ${w[k]} (期待 ${expect[k]})`);
  }
  return Object.keys(w).length === 5;
});

// ── Print results ─────────────────────────────────────────────────────────

console.log('\n═══════════════════════════════════════════');
console.log(' KAME LIFE - Ranking Engine QA');
console.log('═══════════════════════════════════════════\n');

for (const r of results) {
  const icon = r.ok ? '✅' : '❌';
  const err  = r.err ? `  → ${r.err}` : '';
  console.log(`${icon} Check ${String(r.id).padStart(2,' ')}: ${r.desc}${err}`);
}

console.log('\n───────────────────────────────────────────');
console.log(pass ? '✅ ALL CHECKS PASSED' : '❌ SOME CHECKS FAILED');
console.log('───────────────────────────────────────────\n');

// ── Top 5 previews ────────────────────────────────────────────────────────

const previews = [
  { type: 'type0', label: 'Type 0: Ranking Hub（初心者向け総合）' },
  { type: 'type1', label: 'Type 1: Smell（臭いが少ない）' },
  { type: 'type2', label: 'Type 2: Small Space（省スペース）' },
  { type: 'type11', label: 'Type 11: Japanese Native（国産）' }
];

for (const p of previews) {
  const top5 = getTop(data, p.type, 5);
  console.log(`▶ ${p.label}`);
  top5.forEach((s, i) => {
    console.log(`  ${i + 1}位 ${s.species_name_ja.padEnd(16,' ')} ${s._score.toFixed(2)}`);
  });
  console.log('');
}

if (!pass) process.exit(1);
