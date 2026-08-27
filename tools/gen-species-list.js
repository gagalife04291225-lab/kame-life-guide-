#!/usr/bin/env node
/**
 * species-list.html の自動生成部分を tools/taxonomy.js と shindan/species.js から作り直す。
 *
 *   node tools/gen-species-list.js          … 生成して書き込む
 *   node tools/gen-species-list.js --check  … 差分があるかだけ調べる（書き込まない）
 *
 * 生成する箇所は3つ。いずれもマーカーで囲われている。
 *   1. // BEGIN:taxonomy-data … // END:taxonomy-data
 *      ページ内 JS が使う GENUS_CAT / CAT_ORDER / CAT_NOTE。
 *      species-list.html は外部JSを増やさない方針なので、値をここへ焼き込む。
 *      定義の正本は tools/taxonomy.js の1箇所だけ。
 *   2. <!-- BEGIN:species-index … --> … <!-- END:species-index -->
 *      JS無効時に見える noscript 静的一覧。JS表示と同じ118件・同じ並び順にする。
 *   3. // BEGIN:wamei-alias … // END:wamei-alias
 *      検索で別名を引くための WAMEI_ALIAS。正本は data/species-master.json の
 *      wamei_aliases 1箇所だけで、ここはその写し。二重管理をしないため
 *      shindan/species.js には alias を持たせない。master の wamei と
 *      species.js の name を突き合わせて紐づける（slug を持たない種があるため）。
 *   4. 件数バーの初期値（JS無効時に見える数字）。
 *
 * shindan/species.js は読み取るだけで書き換えない。種を追加したら本スクリプトと
 * tools/gen-guide-species.js を実行すれば、一覧とガイドの両方が同期する。
 */
'use strict';
const fs = require('fs');
const path = require('path');
const T = require('./taxonomy.js');

const FILE = path.join(T.ROOT, 'species-list.html');
const check = process.argv.indexOf('--check') >= 0;

const all = T.decorate(T.loadSpecies());
const groups = T.buildGroups(all);
const ordered = T.flatten(groups);

// ── 検証 ──
const problems = [];
if (ordered.length !== all.length) problems.push('並べ替えで件数が変わった: ' + ordered.length + ' / ' + all.length);
const names = ordered.map(i => i.sp.name);
if (new Set(names).size !== names.length) problems.push('種名の重複');
const unknown = all.filter(i => i.bigCat === 'その他');
if (unknown.length) problems.push('大分類UNKNOWN: ' + unknown.map(i => i.sp.name + '（' + i.genus + '）').join(', '));
ordered.forEach(i => {
  const h = T.guideHref(i.sp);
  const f = h.split('#')[0].split('?')[0];
  if (!fs.existsSync(path.join(T.ROOT, f))) problems.push('リンク先が無い: ' + i.sp.name + ' → ' + h);
});
if (problems.length) {
  console.error('■ 問題があるため書き込みを中止します');
  problems.forEach(p => console.error('  - ' + p));
  process.exit(1);
}

// ── 1. 分類データ（ページ内JS用のリテラル）──
function jsObj(o, indent) {
  const pad = ' '.repeat(indent);
  return '{\n' + Object.keys(o).map(k =>
    pad + (/^[A-Za-z_$][\w$]*$/.test(k) ? k : "'" + k + "'") + ":'" + o[k] + "'"
  ).join(',\n') + '\n}';
}
const taxonomyBlock = [
  '// このブロックは tools/taxonomy.js から生成される。値の正本はそちら。',
  'var GENUS_CAT = ' + jsObj(T.GENUS_CAT, 2) + ';',
  'var CAT_ORDER = ' + JSON.stringify(T.CAT_ORDER).replace(/","/g, "','").replace(/^\["/, "['").replace(/"\]$/, "']") + ';',
  'var CAT_NOTE = ' + jsObj(T.CAT_NOTE, 2) + ';'
].join('\n');

// ── 2. 検索用の別名（正本は data/species-master.json の wamei_aliases）──
const MASTER = path.join(T.ROOT, 'data', 'species-master.json');
const master = JSON.parse(fs.readFileSync(MASTER, 'utf8')).species;
const nameSet = new Set(all.map(i => i.sp.name));
const aliasPairs = [];
const aliasProblems = [];
master.forEach(rec => {
  const a = rec.wamei_aliases;
  if (!a || !a.length) return;
  if (!nameSet.has(rec.wamei)) {
    // 正本に別名があるのに一覧へ載らない＝検索から静かに消える。気づけるように止める。
    aliasProblems.push('wamei_aliases があるが species.js に該当種がない: ' +
                       rec.slug + '（' + rec.wamei + '）');
    return;
  }
  aliasPairs.push([rec.wamei, a.slice()]);
});
if (aliasProblems.length) {
  console.error('■ 別名の紐づけに問題があるため書き込みを中止します');
  aliasProblems.forEach(p => console.error('  - ' + p));
  process.exit(1);
}
aliasPairs.sort((x, y) => (x[0] < y[0] ? -1 : x[0] > y[0] ? 1 : 0));
const aliasCount = aliasPairs.reduce((n, p) => n + p[1].length, 0);
const aliasBlock = [
  '// 別名の正本は data/species-master.json の wamei_aliases。ここは検索用の写し。',
  '// 値は master の文字列をそのまま連結する（加工しない）。',
  'var WAMEI_ALIAS = {'
].concat(aliasPairs.map((p, i) =>
  "  '" + p[0] + "':'" + p[1].join(' ') + "'" + (i < aliasPairs.length - 1 ? ',' : '')
)).concat(['};']).join('\n');

// ── 3. noscript 静的一覧（JS表示と同じ118件・同じ並び）──
const idx = ['<!-- SEO: 静的種別ページリンク（クローラー向け）。JS表示と同じ118件・同じ並び順。 -->',
             '<noscript>', '<nav aria-label="種別ページ一覧">'];
groups.forEach(c => {
  idx.push('<h2>' + T.esc(c.cat) + '（' + c.count + '種）</h2>');
  c.genera.forEach(g => {
    idx.push('<h3>' + T.esc(g.genus) + '</h3>');
    idx.push('<ul>');
    g.species.forEach(s => s.items.forEach(i => {
      idx.push('<li><a href="' + T.esc(T.guideHref(i.sp)) + '">' + T.esc(i.sp.name) +
               '（' + T.esc(i.sp.latin) + '）' +
               (i.sp.hasPage ? 'の飼育ガイド' : 'は暮らし方ガイドで解説') + '</a></li>');
    }));
    idx.push('</ul>');
  });
});
idx.push('</nav>', '</noscript>');
const indexBlock = idx.join('\n');

// ── 書き込み ──
let src = fs.readFileSync(FILE, 'utf8');
const before = src;

let next = T.replaceBlock(src, '// BEGIN:taxonomy-data (tools/gen-species-list.js が生成。手で編集しない)',
                          '// END:taxonomy-data', taxonomyBlock);
if (next === null) { console.error('マーカーが見つかりません: taxonomy-data'); process.exit(1); }
src = next;

next = T.replaceBlock(src, '// BEGIN:wamei-alias (tools/gen-species-list.js が生成。手で編集しない)',
                      '// END:wamei-alias', aliasBlock);
if (next === null) { console.error('マーカーが見つかりません: wamei-alias'); process.exit(1); }
src = next;

next = T.replaceBlock(src, '<!-- BEGIN:species-index (tools/gen-species-list.js が生成。手で編集しない) -->',
                      '<!-- END:species-index -->', indexBlock);
if (next === null) { console.error('マーカーが見つかりません: species-index'); process.exit(1); }
src = next;

// ── 4. 件数バーの初期値 ──
const countRe = /(<span class="count-num" id="count-num">)\d+(<\/span>)/;
if (!countRe.test(src)) { console.error('件数バーが見つかりません'); process.exit(1); }
src = src.replace(countRe, '$1' + all.length + '$2');

const changed = src !== before;
if (changed && !check) fs.writeFileSync(FILE, src);

console.log('  種データ        ' + all.length + '件');
console.log('  大分類          ' + groups.map(c => c.cat + ' ' + c.count).join(' / '));
console.log('  noscript 掲載   ' + (indexBlock.match(/<li>/g) || []).length + '件' +
            '（うち種別ページ ' + all.filter(i => i.sp.hasPage).length + ' / ガイド遷移 ' +
            all.filter(i => !i.sp.hasPage).length + '）');
console.log('  件数バー初期値  ' + all.length);
console.log('  検索用の別名    ' + aliasPairs.length + '種 / ' + aliasCount + '件（正本 data/species-master.json）');
console.log(check ? ('差分: ' + (changed ? 'あり' : 'なし')) : ('species-list.html: ' + (changed ? '更新' : '変更なし')));
