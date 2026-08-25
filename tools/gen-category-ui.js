#!/usr/bin/env node
/**
 * 6大分類のUIを2箇所まとめて生成する（Phase 1D）。
 *
 *   node tools/gen-category-ui.js          … 生成して書き込む
 *   node tools/gen-category-ui.js --check  … 差分があるかだけ調べる（書き込まない）
 *
 * ① species-list.html の生息環境フィルターボタン
 *    「すべて」＋ CAT_ORDER の6分類。data-hab の値も表示名も分類名そのもの。
 * ② explore.html「特徴から探す」の6大分類カード
 *    同じ CAT_ORDER 順。小型・珍しい種類のカードはマーカーの外なので
 *    生成対象にならず、そのまま残る。
 *
 * 分類・順序の正本は tools/taxonomy.js の CAT_ORDER ただ一つ。
 * このスクリプトは分類を新たに定義しない。CAT_ORDER を増減したら
 * CAT_UI に対応する行を足して再実行すれば、①②が追随する。
 *
 * species-list.html 側のフィルタ実装（LEGACY_HAB / habTargets / state.habCats）
 * は Phase 1C のままで、ここでは触らない。ボタンのマークアップだけを生成する。
 */
'use strict';
const fs = require('fs');
const path = require('path');
const T = require('./taxonomy.js');

const ROOT = T.ROOT;
const check = process.argv.indexOf('--check') >= 0;
const q = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ── ① species-list.html の生息環境ボタン ──
const SL_FILE  = 'species-list.html';
const SL_BEGIN = '<!-- BEGIN:hab-buttons (tools/gen-category-ui.js が生成。手で編集しない) -->';
const SL_END   = '<!-- END:hab-buttons -->';
const SL_OPEN  = '<div class="filter-btns" id="hab-btns">';
const SL_CLOSE = '</div>';

// ── ② explore.html の6大分類カード ──
const EX_FILE  = 'explore.html';
const EX_BEGIN = '<!-- BEGIN:explore-categories (tools/gen-category-ui.js が生成。手で編集しない) -->';
const EX_END   = '<!-- END:explore-categories -->';
const EX_OPEN  = '<div class="cat-grid">';
// マーカーを初回に張るとき、ここから先（小型・珍しい種類）は生成対象外にする
const EX_TAIL_ANCHOR = '<a class="cat-card" href="species-list.html?size=小型"';

// カードの文言・アイコン・GA4値。分類の定義ではなく表示用のメタデータ。
// キーは CAT_ORDER の分類名。既存の文言をそのまま保持している。
const CAT_UI = {
  'リクガメ':           { icon:'🐢', label:'リクガメ',         ga:'land',
                          sub:'陸を歩く、草食性のおだやかな仲間。' },
  'ヤマガメ・ハコガメ': { icon:'🍃', label:'ヤマガメ・ハコガメ', ga:'forest',
                          sub:'森や湿った環境で暮らす、半陸生の仲間。' },
  '半水棲':             { icon:'💧', label:'ドロガメ・ニオイガメ', ga:'semiaquatic',
                          sub:'水辺を好む、小さめで個性ゆたかな亀。' },
  '水棲（淡水）':       { icon:'🌊', label:'水棲ガメ（淡水）',   ga:'aquatic',
                          sub:'水の中で暮らす、泳ぎ上手な亀たち。' },
  '汽水':               { icon:'🧂', label:'汽水ガメ',           ga:'brackish',
                          sub:'塩分のある水に暮らす、ダイヤモンドバックテラピンの仲間。' },
  'スッポン・曲頸':     { icon:'🌀', label:'スッポン・曲頸',     ga:'softshell',
                          sub:'砂に潜るスッポンと、首を横に曲げる仲間。' }
};

function renderHabButtons() {
  const btns = ['        <button class="fbtn active" data-hab="all">すべて</button>']
    .concat(T.CAT_ORDER.map(c =>
      '        <button class="fbtn" data-hab="' + c + '">' + c + '</button>'));
  return [SL_BEGIN, btns.join('\n'), SL_END, ''].join('\n');
}

function renderExploreCards() {
  const cards = T.CAT_ORDER.map(c => {
    const u = CAT_UI[c];
    return '      <a class="cat-card" href="species-list.html?hab=' + c + '"\n' +
           "         onclick=\"(typeof gtag==='function')&&gtag('event','explore_category_click'," +
           "{cat:'" + u.ga + "'})\">\n" +
           '        <span class="cat-icon" aria-hidden="true">' + u.icon + '</span>\n' +
           '        <p class="cat-label">' + u.label + '</p>\n' +
           '        <p class="cat-sub">' + u.sub + '</p>\n' +
           '      </a>';
  });
  return [EX_BEGIN, cards.join('\n'), EX_END, ''].join('\n');
}

// ── 検証 ──
const problems = [];
T.CAT_ORDER.forEach(c => {
  const u = CAT_UI[c];
  if (!u) { problems.push('カードのUI定義が無い分類: ' + c); return; }
  ['icon', 'label', 'ga', 'sub'].forEach(k => {
    if (!u[k]) problems.push('UI定義の項目が空: ' + c + '.' + k);
  });
});
Object.keys(CAT_UI).forEach(c => {
  if (T.CAT_ORDER.indexOf(c) < 0) problems.push('CAT_ORDER に無い分類のUI定義: ' + c);
});
if (new Set(T.CAT_ORDER.map(c => CAT_UI[c] && CAT_UI[c].ga)).size !== T.CAT_ORDER.length) {
  problems.push('GA4の cat 値に重複');
}
// 実データ側との突き合わせ（分類が空にならないこと）
const all = T.decorate(T.loadSpecies());
T.CAT_ORDER.forEach(c => {
  const n = all.filter(i => i.bigCat === c).length;
  if (!n) problems.push('該当する種が0件の分類: ' + c);
});
const covered = all.filter(i => T.CAT_ORDER.indexOf(i.bigCat) >= 0).length;
if (covered !== all.length) problems.push('CAT_ORDER に入らない種が ' + (all.length - covered) + ' 件');
if (problems.length) {
  console.error('■ 問題があるため書き込みを中止します');
  problems.forEach(p => console.error('  - ' + p));
  process.exit(1);
}

// ── 書き込み ──
let changed = 0;

function apply(file, begin, end, block, firstRun) {
  const p = path.join(ROOT, file);
  const src = fs.readFileSync(p, 'utf8');
  const marked = new RegExp(q(begin) + '[\\s\\S]*?' + q(end) + '\\n?');
  const next = marked.test(src) ? src.replace(marked, block) : firstRun(src, block);
  const diff = next !== src;
  if (diff) { changed++; if (!check) fs.writeFileSync(p, next); }
  return diff;
}

// ① 生息環境ボタン
const d1 = apply(SL_FILE, SL_BEGIN, SL_END, renderHabButtons(), function (src, block) {
  const o = src.indexOf(SL_OPEN);
  if (o < 0) { console.error('hab-btns が見つかりません'); process.exit(1); }
  const s0 = src.indexOf('\n', o) + 1;
  const e0 = src.indexOf(SL_CLOSE, s0);
  if (e0 < 0) { console.error('hab-btns の閉じが見つかりません'); process.exit(1); }
  const lineStart = src.lastIndexOf('\n', e0) + 1;
  return src.slice(0, s0) + block + src.slice(lineStart);
});
const nBtn = (renderHabButtons().match(/<button /g) || []).length;
console.log('  ' + SL_FILE.padEnd(20) + nBtn + 'ボタン（すべて＋' + T.CAT_ORDER.length + '分類）' +
            (d1 ? '  [更新]' : '  [変更なし]'));

// ② explore のカード
const d2 = apply(EX_FILE, EX_BEGIN, EX_END, renderExploreCards(), function (src, block) {
  const o = src.indexOf(EX_OPEN);
  if (o < 0) { console.error('cat-grid が見つかりません'); process.exit(1); }
  const s0 = src.indexOf('\n', o) + 1;
  const tail = src.indexOf(EX_TAIL_ANCHOR, s0);
  if (tail < 0) { console.error('小型カードの先頭が見つかりません'); process.exit(1); }
  const lineStart = src.lastIndexOf('\n', tail) + 1;
  return src.slice(0, s0) + block + src.slice(lineStart);
});
const nCard = (renderExploreCards().match(/class="cat-card"/g) || []).length;
console.log('  ' + EX_FILE.padEnd(20) + nCard + 'カード（6大分類のみ。小型・珍しい種類は対象外）' +
            (d2 ? '  [更新]' : '  [変更なし]'));

console.log('  分類の内訳: ' + T.CAT_ORDER.map(c => c + ' ' + all.filter(i => i.bigCat === c).length).join(' / ') +
            '  計' + all.length);
console.log(check ? ('差分のあるファイル: ' + changed) : ('書き込み: ' + changed + ' ファイル'));
