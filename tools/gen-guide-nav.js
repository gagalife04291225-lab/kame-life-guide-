#!/usr/bin/env node
/**
 * 飼育ガイド8本のカテゴリ導線を2箇所まとめて生成する。
 *
 *   node tools/gen-guide-nav.js          … 生成して書き込む
 *   node tools/gen-guide-nav.js --check  … 差分があるかだけ調べる（書き込まない）
 *
 * ① guide-*.html 8本の「ほかの暮らしのガイド」相互ナビ
 *    各ガイドが「自分以外の7本」すべてへ、正しい href と統一ラベルでリンクする。
 * ② guides/index.html「カテゴリから探す」の「飼育環境 — 種類別ガイド」カード
 *    8ガイドぶんのカードを NAV_ORDER 順で出す。同じ .gh-cards の中にある
 *    機材ガイドのカード（ライト・フィルター・温度・餌）はマーカーの外なので
 *    生成対象にならず、そのまま残る。
 *
 * ガイドを増やしたら NAV_ORDER / NAV_LABEL / CARD_DESC に1行ずつ足して
 * 再実行すれば、①②の両方に反映される。
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

// ② guides/index.html「カテゴリから探す」用
const HUB_FILE  = 'guides/index.html';
const HUB_BEGIN = '<!-- BEGIN:guides-hub-env (tools/gen-guide-nav.js が生成。手で編集しない) -->';
const HUB_END   = '<!-- END:guides-hub-env -->';
const HUB_CAT_TITLE = '<p class="gh-cat-title">飼育環境 — 種類別ガイド</p>';
// マーカーを初回に張るとき、ここから先（機材ガイドのカード）は生成対象外にする
const HUB_TAIL_ANCHOR = '<a href="./uvb-light-guide.html"';

// カード説明文。既存3枚は元の文言をそのまま維持し、追加5枚は同じ形式で書く。
// 各ガイドの meta description の内容に沿わせている。
const CARD_DESC = {
  'guide-water-full': '水槽・フィルター・水温管理など、水棲ガメ飼育の基本をまとめています。',
  'guide-semi':       '水場と陸場を両立させる飼育レイアウトと温度・湿度管理を紹介。',
  'guide-softshell':  '砂に潜るスッポンと、首を横に曲げる曲頸類。深い水と強力なろ過の考え方を解説。',
  'guide-japan':      '日本の在来イシガメの飼育環境。清流を好む種の水質管理と夏の高温対策を解説。',
  'guide-brackish':   'ダイヤモンドバックテラピンの汽水管理。人工海水の作り方と塩分の目安を紹介。',
  'guide-moist':      '湿った林床の再現がポイント。高湿度の維持と隠れ家・浅い水場の作り方をまとめています。',
  'guide-dry':        'ケージ・UVB・温度勾配・床材など、乾燥系リクガメの飼育環境を解説。',
  'guide-arid':       '湿度を必要とする熱帯のリクガメ。広い床面積と適度な保湿の両立を解説。'
};

// GA4 の guide_slug。既存カードと同じ命名（guide- を外して - を _ に）
function gaSlug(g) { return g.replace(/^guide-/, '').replace(/-/g, '_'); }

function renderHubCards() {
  const cards = NAV_ORDER.map(g =>
    '          <a href="../' + g + '.html" class="gh-card"\n' +
    "             onclick=\"(typeof gtag==='function')&&gtag('event','guides_hub_card_click'," +
    "{guide_slug:'" + gaSlug(g) + "',guide_category:'environment'})\">\n" +
    '            <span class="gh-card-tag">' + NAV_LABEL[g] + '</span>\n' +
    '            <p class="gh-card-title">' + NAV_LABEL[g] + 'の飼い方</p>\n' +
    '            <p class="gh-card-desc">' + CARD_DESC[g] + '</p>\n' +
    '            <span class="gh-card-cta">くわしく見る <span class="gh-card-arrow" aria-hidden="true">→</span></span>\n' +
    '          </a>');
  return [HUB_BEGIN, '', cards.join('\n\n'), '', HUB_END, ''].join('\n');
}

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
NAV_ORDER.forEach(g => { if (!CARD_DESC[g]) problems.push('カード説明文が未定義: ' + g); });
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

// ── ② guides/index.html「カテゴリから探す」の飼育環境カード ──
(function () {
  const file = path.join(ROOT, HUB_FILE);
  const src = fs.readFileSync(file, 'utf8');
  const block = renderHubCards();
  let next;

  const marked = new RegExp(q(HUB_BEGIN) + '[\\s\\S]*?' + q(HUB_END) + '\\n?');
  if (marked.test(src)) {
    next = src.replace(marked, block);
  } else {
    // 初回：飼育環境グループの .gh-cards 直後から、機材カードの直前までを置き換える
    const t = src.indexOf(HUB_CAT_TITLE);
    if (t < 0) { console.error('見出しが見つかりません: ' + HUB_FILE); process.exit(1); }
    const c = src.indexOf('<div class="gh-cards">', t);
    if (c < 0) { console.error('gh-cards が見つかりません: ' + HUB_FILE); process.exit(1); }
    const s0 = src.indexOf('\n', c) + 1;
    const tail = src.indexOf(HUB_TAIL_ANCHOR, s0);
    if (tail < 0) { console.error('機材カードの先頭が見つかりません: ' + HUB_FILE); process.exit(1); }
    const lineStart = src.lastIndexOf('\n', tail) + 1;
    next = src.slice(0, s0) + block + src.slice(lineStart);
  }

  const cardCount = (block.match(/class="gh-card"/g) || []).length;
  const hrefs = (block.match(/href="\.\.\/(guide-[a-z-]+)\.html"/g) || [])
    .map(x => x.replace(/href="\.\.\//, '').replace(/\.html"/, ''));
  if (cardCount !== NAV_ORDER.length) { console.error('カード数が不正: ' + cardCount); process.exit(1); }
  if (new Set(hrefs).size !== NAV_ORDER.length) { console.error('カードのリンク先に重複または欠落'); process.exit(1); }
  NAV_ORDER.forEach(g => { if (hrefs.indexOf(g) < 0) { console.error('カードが欠落: ' + g); process.exit(1); } });

  const diff = next !== src;
  if (diff) { changed++; if (!check) fs.writeFileSync(file, next); }
  console.log('  ' + HUB_FILE.padEnd(18) + cardCount + 'カード     ' + (diff ? '  [更新]' : '  [変更なし]'));
})();

console.log(check ? ('差分のあるファイル: ' + changed) : ('書き込み: ' + changed + ' ファイル'));
