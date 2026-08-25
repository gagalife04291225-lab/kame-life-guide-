#!/usr/bin/env node
/**
 * 飼育ガイド8本の「ほかの暮らしのガイド」相互ナビを生成して差し替える。
 *
 *   node tools/gen-guide-nav.js          … 生成して書き込む
 *   node tools/gen-guide-nav.js --check  … 差分があるかだけ調べる（書き込まない）
 *
 * 各ガイドが「自分以外の7本」すべてへ、正しい href と統一ラベルでリンクする。
 * ガイドを増やしたら NAV_ORDER に1行足して再実行すれば全ページに反映される。
 *
 * ── 順序とラベルの根拠 ──────────────────────────────────
 * guide-brackish / guide-japan / guide-softshell の3本は既に7リンクの
 * 正しい形になっており、順序もラベルも完全に一致していた。
 * その共通形を NAV_ORDER / NAV_LABEL として抽出している。
 * したがってこの3本については生成結果が既存と完全一致する（差分0）。
 *
 * 修正対象は残り5本で、次の不具合があった。
 *   - guide-dry / guide-semi:  「リクガメ多湿系」の href が guide-moist.html
 *                              （正しくは guide-arid.html）
 *   - guide-moist:             「リクガメ多湿系」が自分自身への自己リンク
 *   - dry / arid / moist / semi / water-full: guide-softshell と guide-japan
 *                              へのリンクが無い（5本 → 7本へ）
 *   - ラベルが「水棲・淡水」「汽水・水辺」など別系統だった
 *
 * guide-beginner は「ほかの暮らしのガイド」ではなくサイト全体のCTA
 * （h2 が Kame Life Guide）なので対象外。
 * 本文・対象種セクション・setup画像・species データには一切触れない。
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BEGIN = '<!-- BEGIN:guide-nav (tools/gen-guide-nav.js が生成。手で編集しない) -->';
const END = '<!-- END:guide-nav -->';

// 掲載順（水 → 陸）。自分自身は除いて出力する。
const NAV_ORDER = [
  'guide-water-full',
  'guide-semi',
  'guide-softshell',
  'guide-japan',
  'guide-brackish',
  'guide-moist',
  'guide-dry',
  'guide-arid'
];

const NAV_LABEL = {
  'guide-water-full': '水棲・淡水ガメ',
  'guide-semi':       '半水棲（ニオイガメ等）',
  'guide-softshell':  'スッポン・ヘビクビガメ',
  'guide-japan':      '日本産カメ',
  'guide-brackish':   '汽水・テラピン',
  'guide-moist':      'ヤマガメ・ハコガメ',
  'guide-dry':        '乾燥系リクガメ',
  'guide-arid':       '多湿系リクガメ'
};

// 既存の hub-links を初回だけ包み込むためのアンカー
const SECTION_HEAD = '<h2>ほかの暮らしのガイド</h2>';

// ガイド以外のリンクで、もともと同じ hub-links に入っていたもの。
// 導線を失わないようそのまま残す（新規追加ではない）。
const EXTRA_LINKS = {
  'guide-water-full': [{ href: 'water-filter-review.html', label: '水槽・フィルターの選び方' }],
  'guide-semi':       [{ href: 'water-filter-review.html', label: '水槽・フィルターの選び方' }]
};

function render(self) {
  const links = NAV_ORDER.filter(g => g !== self)
    .map(g => '      <a href="' + g + '.html">' + NAV_LABEL[g] + '</a>')
    .concat((EXTRA_LINKS[self] || []).map(x =>
      '      <a href="' + x.href + '">' + x.label + '</a>'));
  return [BEGIN, '    <div class="hub-links">', links.join('\n'), '    </div>', END].join('\n');
}

// ── 検証 ──
const problems = [];
NAV_ORDER.forEach(g => {
  if (!NAV_LABEL[g]) problems.push('ラベル未定義: ' + g);
  if (!fs.existsSync(path.join(ROOT, g + '.html'))) problems.push('ファイルが無い: ' + g + '.html');
});
if (new Set(NAV_ORDER).size !== NAV_ORDER.length) problems.push('NAV_ORDER に重複');
if (new Set(Object.values(NAV_LABEL)).size !== NAV_ORDER.length) problems.push('ラベルに重複');
if (problems.length) {
  console.error('■ 問題があるため書き込みを中止します');
  problems.forEach(p => console.error('  - ' + p));
  process.exit(1);
}

const check = process.argv.indexOf('--check') >= 0;
const q = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
let changed = 0;

NAV_ORDER.forEach(self => {
  const file = path.join(ROOT, self + '.html');
  const src = fs.readFileSync(file, 'utf8');
  const block = render(self);
  let next;

  const marked = new RegExp(q(BEGIN) + '[\\s\\S]*?' + q(END));
  if (marked.test(src)) {
    next = src.replace(marked, block);
  } else {
    // 初回：「ほかの暮らしのガイド」直後の hub-links を置き換える
    const h = src.indexOf(SECTION_HEAD);
    if (h < 0) { console.error('見出しが見つかりません: ' + self); process.exit(1); }
    const s0 = src.indexOf('<div class="hub-links">', h);
    if (s0 < 0) { console.error('hub-links が見つかりません: ' + self); process.exit(1); }
    const e0 = src.indexOf('</div>', s0) + '</div>'.length;
    // 行頭のインデントごと差し替える
    const lineStart = src.lastIndexOf('\n', s0) + 1;
    next = src.slice(0, lineStart) + block + src.slice(e0);
  }

  const n = (block.match(/<a href="guide-/g) || []).length;
  const selfLink = block.indexOf('"' + self + '.html"') >= 0;
  if (n !== NAV_ORDER.length - 1) { console.error('ガイドリンク数が不正: ' + self + ' = ' + n); process.exit(1); }
  (EXTRA_LINKS[self] || []).forEach(x => {
    if (!fs.existsSync(path.join(ROOT, x.href))) { console.error('既存リンクの先が無い: ' + x.href); process.exit(1); }
  });
  if (selfLink) { console.error('自己リンクが混入: ' + self); process.exit(1); }

  const diff = next !== src;
  if (diff) { changed++; if (!check) fs.writeFileSync(file, next); }
  const ex = (EXTRA_LINKS[self] || []).length;
  console.log('  ' + self.padEnd(18) + n + 'ガイド' + (ex ? ' +' + ex + '機材' : '     ') + (diff ? '  [更新]' : '  [変更なし]'));
});

console.log(check ? ('差分のあるファイル: ' + changed) : ('書き込み: ' + changed + ' ファイル'));
