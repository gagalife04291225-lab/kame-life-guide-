#!/usr/bin/env node
/**
 * ASIN 構造監査（オフライン・ネットワーク不要）
 *
 * リポジトリ全体から Amazon の ASIN を抽出し、docs/asin-audit.csv と突き合わせる。
 * **Amazon への問い合わせは一切しない。** 商品が実在するか・商品名が正しいかは
 * このスクリプトでは判定できない（PA-API 廃止 / Creators API 資格未充足 /
 * スクレイピングは規約違反）。判定できるのは「リポジトリ内部の整合性」だけ。
 *
 * 検出するもの:
 *   1. NEW      … コードにあるが CSV に無い ASIN（＝未検証のまま公開されている）
 *   2. REMOVED  … CSV にあるがコードから消えた ASIN
 *   3. RENAMED  … サイト表記が CSV 記録時から変わった ASIN
 *   4. NO_TAG   … アフィリエイト追跡ID が付いていない Amazon リンク
 *   5. DUP      … 同一商品に複数 ASIN を併用している疑い（同名で ASIN が違う）
 *   6. STALE    … 最終検証日が閾値より古い ASIN（既定 90 日）
 *
 * 使い方:
 *   node scripts/audit-asin.mjs              # 監査のみ（CSVを書き換えない）
 *   node scripts/audit-asin.mjs --write      # CSV を現状へ同期（検証結果は保持）
 *   node scripts/audit-asin.mjs --stale-days 60
 *
 * 終了コード:
 *   0 = 差分なし / 1 = 要対応の差分あり / 2 = 実行エラー
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CSV_PATH = 'docs/asin-audit.csv';
const TAG = 'kamelife090e-22';
const ARGV = process.argv.slice(2);
const WRITE = ARGV.includes('--write');
const STALE_DAYS = (() => {
  const i = ARGV.indexOf('--stale-days');
  return i >= 0 ? Number(ARGV[i + 1]) || 90 : 90;
})();

const HEADERS = [
  'ファイル', 'ASIN', '商品名', '検証状態', '代替', '確認用URL',
  '掲載箇所数', '種別', 'Amazon上の実際の商品名', '在庫', '検証メモ', '検証日', '検証方法',
];

/* ───────────── CSV（依存なし・引用符対応） ───────────── */

function parseCsv(text) {
  const s = text.replace(/^﻿/, '');
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (quoted) {
      if (c === '"') {
        if (s[i + 1] === '"') { field += '"'; i++; } else { quoted = false; }
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  if (!rows.length) return [];
  const head = rows[0];
  return rows.slice(1)
    .filter(r => r.some(v => v !== ''))
    .map(r => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])));
}

function toCsv(objs) {
  const esc = v => {
    const t = String(v ?? '');
    return /[",\n\r]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t;
  };
  return '﻿' + [HEADERS.join(',')]
    .concat(objs.map(o => HEADERS.map(h => esc(o[h])).join(',')))
    .join('\n') + '\n';
}

/* ───────────── ファイル走査 ───────────── */

const SKIP_DIRS = new Set(['node_modules', '.git', '.github', 'scripts', 'tools', 'docs']);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') && e.name !== '.') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      walk(p, out);
    } else if (/\.(html|js)$/.test(e.name)) {
      out.push(path.relative(ROOT, p));
    }
  }
  return out;
}

/* ───────────── ASIN 抽出 ───────────── */

const RX_DP = /amazon\.co\.jp\/(?:[^"'\s)]*\/)?dp\/([A-Z0-9]{10})/g;
const RX_DATA = /data-asin="([A-Z0-9]{10})"/g;
const RX_FIELD = /asin:\s*'([A-Z0-9]{10})'/g;
const RX_ANCHOR = /<a[^>]+href="https:\/\/www\.amazon\.co\.jp\/(?:[^"]*\/)?dp\/([A-Z0-9]{10})[^"]*"[^>]*>([\s\S]*?)<\/a>/g;
const RX_H3 = /<h3[^>]*>([\s\S]*?)<\/h3>/g;
const RX_NAME_JS = /name:\s*'((?:[^'\\]|\\.)*)'/g;
const RX_LABEL_JS = /asin:\s*'([A-Z0-9]{10})'\s*,\s*label:\s*'((?:[^'\\]|\\.)*)'/g;
const BAD_NAME = /Amazonで|楽天|見る$|購入|価格・詳細|チェック|→/;

const strip = h => String(h || '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ').trim();

function cleanName(n) {
  const t = strip(n).slice(0, 80);
  return (!t || t.length < 4 || BAD_NAME.test(t)) ? '' : t;
}

/** prio が小さいほど信頼できる商品名 */
function collect(files) {
  const hits = [];
  const add = (file, asin, name, kind, prio) =>
    hits.push({ file, asin, name: cleanName(name), kind, prio });

  for (const f of files) {
    const src = fs.readFileSync(path.join(ROOT, f), 'utf8');

    const directKind = f.endsWith('.js')
      ? `${path.basename(f)}（affiliateUrl 等の直リンク）`
      : 'HTML内の直リンク';
    for (const m of src.matchAll(RX_ANCHOR)) add(f, m[1], m[2], 'HTML内の直リンク', 4);
    for (const m of src.matchAll(RX_DP)) add(f, m[1], '', directKind, 9);

    for (const m of src.matchAll(RX_DATA)) {
      const heads = [...src.slice(0, m.index).matchAll(RX_H3)];
      add(f, m[1], heads.length ? heads[heads.length - 1][1] : '', 'data-asin（JSで/dp/へ展開）', 3);
    }

    if (f.endsWith('.js')) {
      const isEquip = /equipment\.js$/.test(f);
      for (const m of src.matchAll(RX_LABEL_JS)) {
        add(f, m[1], m[2], 'equipment.js（診断結果の推奨機材）', 2);
      }
      if (!isEquip) {
        for (const m of src.matchAll(RX_FIELD)) {
          const names = [...src.slice(0, m.index).matchAll(RX_NAME_JS)];
          add(f, m[1], names.length ? names[names.length - 1][1] : '',
            `${path.basename(f)}（JSデータ）`, 1);
        }
      }
    }
  }
  return hits;
}

/* ───────────── 集約 ───────────── */

function aggregate(hits) {
  const map = new Map();
  for (const h of hits) {
    if (!map.has(h.asin)) map.set(h.asin, { files: new Set(), names: [], kinds: new Set() });
    const a = map.get(h.asin);
    a.files.add(h.file);
    a.kinds.add(h.kind);
    if (h.name) a.names.push([h.prio, h.name]);
  }
  const out = new Map();
  for (const [asin, a] of map) {
    a.names.sort((x, y) => x[0] - y[0] || x[1].localeCompare(y[1]));
    out.set(asin, {
      files: [...a.files].sort(),
      name: a.names.length ? a.names[0][1] : '',
      kinds: [...a.kinds].sort(),
    });
  }
  return out;
}

/* ───────────── 追跡ID チェック ───────────── */

function findUntagged(files) {
  const bad = [];
  const rx = /https:\/\/www\.amazon\.co\.jp\/[^"'\s)]+/g;
  for (const f of files) {
    const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of src.matchAll(rx)) {
      const url = m[0];
      // JS の文字列連結でタグを足している行は対象外
      if (url.includes(TAG)) continue;
      const line = src.slice(0, m.index).split('\n').length;
      const ctx = src.slice(m.index, m.index + 220);
      if (/\?tag=|&tag=|"\s*\+\s*TAG|tag=" \+/.test(ctx)) continue;
      bad.push({ file: f, line, url: url.slice(0, 110) });
    }
  }
  return bad;
}

/* ───────────── 実行 ───────────── */

function main() {
  const files = walk(ROOT);
  const live = aggregate(collect(files));

  const csvExists = fs.existsSync(CSV_PATH);
  const prev = csvExists ? parseCsv(fs.readFileSync(CSV_PATH, 'utf8')) : [];
  const prevBy = new Map(prev.map(r => [r['ASIN'], r]));

  const NEW = [], REMOVED = [], RENAMED = [], STALE = [];
  const today = new Date();

  const rows = [];
  for (const asin of [...live.keys()].sort()) {
    const cur = live.get(asin);
    const old = prevBy.get(asin);

    if (!old) {
      NEW.push({ asin, name: cur.name, files: cur.files });
    } else if (cur.name && old['商品名'] && cur.name !== old['商品名']) {
      RENAMED.push({ asin, from: old['商品名'], to: cur.name });
    }

    const verifiedAt = old?.['検証日'] || '';
    if (old && old['検証状態'] === 'OK' && verifiedAt) {
      const d = new Date(verifiedAt);
      if (!isNaN(d) && (today - d) / 86400000 > STALE_DAYS) {
        STALE.push({ asin, name: cur.name, at: verifiedAt });
      }
    }

    rows.push({
      'ファイル': cur.files.join(' | '),
      'ASIN': asin,
      '商品名': cur.name || old?.['商品名'] || '',
      '検証状態': old ? (RENAMED.some(r => r.asin === asin) ? 'NOT EVALUATED' : old['検証状態']) : 'NOT EVALUATED',
      '代替': old?.['代替'] || '',
      '確認用URL': `https://www.amazon.co.jp/dp/${asin}/`,
      '掲載箇所数': String(cur.files.length),
      '種別': cur.kinds.join(' / '),
      'Amazon上の実際の商品名': old?.['Amazon上の実際の商品名'] || '',
      '在庫': old?.['在庫'] || '',
      '検証メモ': RENAMED.some(r => r.asin === asin)
        ? `サイト表記が変わったため要再検証（旧: ${prevBy.get(asin)['商品名']}）`
        : (old?.['検証メモ'] || '検証未実施'),
      '検証日': RENAMED.some(r => r.asin === asin) ? '' : (old?.['検証日'] || ''),
      '検証方法': old?.['検証方法'] || '',
    });
  }

  for (const r of prev) if (!live.has(r['ASIN'])) REMOVED.push({ asin: r['ASIN'], name: r['商品名'] });

  // 同名で ASIN が違う＝同一商品に複数 ASIN の疑い
  const byName = new Map();
  for (const r of rows) {
    if (!r['商品名']) continue;
    const k = r['商品名'];
    if (!byName.has(k)) byName.set(k, []);
    byName.get(k).push(r['ASIN']);
  }
  const DUP = [...byName].filter(([, a]) => a.length > 1).map(([name, asins]) => ({ name, asins }));

  const NO_TAG = findUntagged(files);

  /* ── 出力 ── */
  const counts = rows.reduce((m, r) => (m[r['検証状態']] = (m[r['検証状態']] || 0) + 1, m), {});
  const L = [];
  L.push('# ASIN 構造監査');
  L.push('');
  L.push(`- 走査ファイル: **${files.length}**`);
  L.push(`- ASIN: **${rows.length}** 件（掲載 ${rows.reduce((s, r) => s + Number(r['掲載箇所数']), 0)} 箇所）`);
  L.push(`- 検証状態: ${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(' / ')}`);
  L.push('');
  L.push('> このスクリプトは Amazon へ問い合わせません。商品が実在するか・商品名が正しいかは判定できません。');
  L.push('> 実照合は Claude セッション（WebSearch）側で行います。');
  L.push('');

  const sec = (title, arr, fmt) => {
    L.push(`## ${title}: ${arr.length} 件`);
    if (!arr.length) L.push('なし'); else arr.slice(0, 40).forEach(x => L.push('- ' + fmt(x)));
    if (arr.length > 40) L.push(`- …ほか ${arr.length - 40} 件`);
    L.push('');
  };

  sec('NEW（未検証のまま公開されている ASIN）', NEW, x => `\`${x.asin}\` ${x.name || '(名称不明)'} — ${x.files.join(', ')}`);
  sec('REMOVED（コードから消えた ASIN）', REMOVED, x => `\`${x.asin}\` ${x.name}`);
  sec('RENAMED（サイト表記が変わった ASIN）', RENAMED, x => `\`${x.asin}\` 「${x.from}」→「${x.to}」`);
  sec('NO_TAG（追跡ID が無い Amazon リンク）', NO_TAG, x => `${x.file}:${x.line} ${x.url}`);
  sec('DUP（同一商品名に複数 ASIN）', DUP, x => `「${x.name}」→ ${x.asins.join(', ')}`);
  sec(`STALE（検証から ${STALE_DAYS} 日超）`, STALE, x => `\`${x.asin}\` ${x.name}（最終検証 ${x.at}）`);

  const report = L.join('\n');
  console.log(report);

  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, report + '\n');
  }

  const actionable = NEW.length + REMOVED.length + RENAMED.length + NO_TAG.length;

  if (WRITE) {
    fs.mkdirSync(path.dirname(CSV_PATH), { recursive: true });
    fs.writeFileSync(CSV_PATH, toCsv(rows));
    console.log(`\n${CSV_PATH} を現状へ同期しました（検証結果は保持）。`);
  }

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT,
      [`actionable=${actionable}`, `new=${NEW.length}`, `removed=${REMOVED.length}`,
       `renamed=${RENAMED.length}`, `notag=${NO_TAG.length}`, `dup=${DUP.length}`,
       `stale=${STALE.length}`, `total=${rows.length}`].join('\n') + '\n');
  }

  process.exit(actionable > 0 ? 1 : 0);
}

try {
  main();
} catch (e) {
  console.error('ASIN 監査に失敗しました:', e && e.stack || e);
  process.exit(2);
}
