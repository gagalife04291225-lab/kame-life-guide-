#!/usr/bin/env node
/**
 * 飼育ガイド（guide-*.html）の「このガイドの対象種」ブロックを生成して差し替える。
 *
 *   node tools/gen-guide-species.js          … 生成して書き込む
 *   node tools/gen-guide-species.js --check  … 差分があるかだけ調べる（書き込まない）
 *
 * 種データは shindan/species.js を唯一の入力とする。このスクリプトは species.js を
 * 一切変更しない。種を追加したら本スクリプトを再実行すれば9ガイドが同期する。
 *
 * ── 帰属の根拠 ────────────────────────────────────────────
 * 1. 大分類は tools/taxonomy.js の GENUS_CAT（属→大分類の明示マッピング）で決める。
 *    種名（和名）の部分一致判定は使わない。
 * 2. 大分類 → ガイドの基本対応は CAT_GUIDE のとおり。
 * 3. リクガメの guide-dry / guide-arid 振り分けは、species.js の links[0].href
 *    （サイトが各種カードのリンク先として既に持っている確定データ）を根拠にする。
 * 4. Kinixys homeana（セオレガメ・ホメアナ）だけは links[0] が guide-moist を指すが、
 *    GENUS_CAT ではリクガメ科であり guide-moist（ヤマガメ・ハコガメ）の対象ではない。
 *    species.js の記述「西アフリカの熱帯雨林に生息」「高湿度・高温の環境が必要」が
 *    guide-arid.html の定義「熱帯の湿潤な環境に暮らすリクガメ／湿度60〜80%」と一致
 *    するため guide-arid に入れる。DRY_ARID_OVERRIDE に根拠つきで明記する。
 * 5. guide-japan は横断掲載。対象は links[0] が guide-japan の3種で、これは
 *    guide-japan.html 本文の「純粋な在来イシガメ3種に絞って解説しています」と一致する。
 *    3種は水棲（淡水）でもあるため guide-water-full にも載る（意図的な二重掲載）。
 * 6. guide-beginner は難易度で選んだ横断ガイドで、species.js に per-species の
 *    帰属データが無い。対象種リストは既存の手書きセクションを正とし、
 *    ここでは一覧への導線だけを出す。
 */
'use strict';
const fs = require('fs');
const path = require('path');
const T = require('./taxonomy.js');

const ROOT = T.ROOT;

// 分類と並び順の定義は tools/taxonomy.js が正本。ここでは複製しない。
const GENUS_CAT = T.GENUS_CAT;
const RANK_ORDER = T.RANK_ORDER;
const sciParts = T.sciParts;
const esc = T.esc;
const BEGIN = '<!-- BEGIN:guide-species (tools/gen-guide-species.js が生成。手で編集しない) -->';
const END = '<!-- END:guide-species -->';

// 大分類 → ガイド（リクガメだけは dry/arid に分かれるので後段で決める）
const CAT_GUIDE = {
  'ヤマガメ・ハコガメ':'guide-moist',
  '半水棲':'guide-semi',
  '水棲（淡水）':'guide-water-full',
  '汽水':'guide-brackish',
  'スッポン・曲頸':'guide-softshell'
};

// リクガメの dry/arid 振り分けを links[0] で決められない種の明示指定（根拠を必ず書く）
const DRY_ARID_OVERRIDE = {
  'Kinixys homeana': {
    guide: 'guide-arid',
    reason: 'links[0]はguide-moistだがリクガメ科。species.jsの「西アフリカの熱帯雨林／高湿度・高温」がguide-aridの定義と一致'
  }
};

// 各ガイドの見出し文言
const GUIDE_META = {
  'guide-dry':        { label:'乾燥系リクガメ',        lead:'このガイドで扱う乾燥系リクガメの種別ページです。' },
  'guide-arid':       { label:'多湿系リクガメ',        lead:'このガイドで扱う多湿系リクガメの種別ページです。' },
  'guide-moist':      { label:'ヤマガメ・ハコガメ',    lead:'このガイドで扱うヤマガメ・ハコガメの種別ページです。' },
  'guide-semi':       { label:'半水棲ガメ',            lead:'このガイドで扱うニオイガメ・ドロガメの仲間の種別ページです。' },
  'guide-water-full': { label:'水棲・淡水ガメ',        lead:'このガイドで扱う水棲・淡水ガメの種別ページです。' },
  'guide-brackish':   { label:'汽水ガメ',              lead:'このガイドで扱う汽水ガメの種別ページです。' },
  'guide-softshell':  { label:'スッポン・曲頸類',      lead:'このガイドで扱うスッポン類・曲頸類の種別ページです。' },
  'guide-japan':      { label:'日本産カメ',            lead:'このガイドで扱う在来イシガメの種別ページです。水棲・淡水ガメのガイドにも掲載しています。' },
  'guide-beginner':   { label:'初心者向け',            lead:'このガイドで詳しく紹介している6種のほかにも、難易度「入門」「入門〜中級」の種があります。種一覧ページで絞り込んで見られます。', heading:'初心者向けの種をもっと見る' }
};

// 一覧への絞り込み導線（species-list.html の既存URLパラメータを使う）
const LIST_LINK = {
  'guide-dry':        { href:'species-list.html?hab=陸棲',        text:'リクガメを一覧で見る' },
  'guide-arid':       { href:'species-list.html?hab=陸棲',        text:'リクガメを一覧で見る' },
  'guide-moist':      { href:'species-list.html?hab=森林系',      text:'ヤマガメ・ハコガメを一覧で見る' },
  'guide-semi':       { href:'species-list.html?hab=半水棲',      text:'半水棲ガメを一覧で見る' },
  'guide-water-full': { href:'species-list.html?hab=水棲',        text:'水棲ガメを一覧で見る' },
  'guide-brackish':   { href:'species-list.html?hab=水棲',        text:'水棲ガメを一覧で見る' },
  'guide-softshell':  { href:'species-list.html?hab=水棲',        text:'水棲ガメを一覧で見る' },
  'guide-japan':      { href:'species-list.html?hab=水棲',        text:'水棲ガメを一覧で見る' },
  'guide-beginner':   { href:'species-list.html?diff=初心者向け', text:'初心者向けの種を一覧で見る' }
};

const GUIDES = Object.keys(GUIDE_META);

function linkGuide(sp) {
  const h = (sp.links && sp.links[0]) ? sp.links[0].href : '';
  return h.replace('../', '').replace('.html', '');
}

// ── 帰属の決定 ──
function assign(all) {
  const problems = [];
  all.forEach(it => {
    const p = sciParts(it.sp.latin);
    it.genus = p.genus; it.binomial = p.binomial; it.subsp = p.subsp;
    it.rank = p.subsp ? '亜種' : (p.note ? '変異型' : '種');
    it.cat = GENUS_CAT[p.genus] || 'UNKNOWN';
    it.linkGuide = linkGuide(it.sp);
    it.pop = it.sp.recommendationPriority || 0;

    if (it.cat === 'UNKNOWN') { problems.push('大分類UNKNOWN: ' + it.sp.name + '（属 ' + p.genus + '）'); it.guide = null; return; }
    if (it.cat === 'リクガメ') {
      const ov = DRY_ARID_OVERRIDE[p.binomial];
      if (ov) { it.guide = ov.guide; it.guideNote = ov.reason; }
      else if (it.linkGuide === 'guide-dry' || it.linkGuide === 'guide-arid') it.guide = it.linkGuide;
      else { problems.push('dry/arid未確定: ' + it.sp.name + '（links[0]=' + it.linkGuide + '）'); it.guide = null; }
    } else {
      it.guide = CAT_GUIDE[it.cat];
    }
    // guide-japan は横断掲載（links[0] が根拠）
    it.crossJapan = (it.linkGuide === 'guide-japan');
  });
  return problems;
}

// ── 並び（species-list.html Phase 1A と同じ規則）──
function orderForGuide(items) {
  const gmap = {};
  items.forEach(i => { (gmap[i.genus] = gmap[i.genus] || []).push(i); });
  return Object.keys(gmap).map(g => {
    const arr = gmap[g], smap = {};
    arr.forEach(i => { (smap[i.binomial] = smap[i.binomial] || []).push(i); });
    const species = Object.keys(smap).map(b => {
      const s = smap[b].slice().sort((a, z) => {
        if (RANK_ORDER[a.rank] !== RANK_ORDER[z.rank]) return RANK_ORDER[a.rank] - RANK_ORDER[z.rank];
        if (a.rank === '亜種' && z.rank === '亜種') return a.subsp < z.subsp ? -1 : a.subsp > z.subsp ? 1 : 0;
        return a.origIndex - z.origIndex;
      });
      return { binomial: b, items: s, pop: Math.max.apply(null, s.map(x => x.pop)) };
    }).sort((a, z) => (z.pop - a.pop) || (a.binomial < z.binomial ? -1 : 1));
    return { genus: g, species: species, pop: Math.max.apply(null, arr.map(x => x.pop)) };
  }).sort((a, z) => (z.pop - a.pop) || (a.genus < z.genus ? -1 : 1));
}

const STYLE = [
'<style>',
'.gs-wrap{margin:40px 0 8px;}',
'.gs-wrap h3{font-family:"Playfair Display",serif;font-weight:700;font-size:1.16rem;color:var(--forest);margin:0 0 6px;}',
'.gs-lead{font-size:.86rem;color:#5a6b60;line-height:1.8;margin:0 0 16px;}',
'.gs-genus{margin:18px 0 8px;font-family:"Playfair Display",serif;font-style:italic;font-weight:600;font-size:.95rem;color:var(--accent-dark);}',
'.gs-list{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(2,1fr);gap:7px;}',
'.gs-list li{margin:0;}',
'.gs-list a,.gs-list span.gs-nopage{display:block;padding:9px 12px;border-radius:9px;border:1px solid #e4ddc9;background:#fff;',
'  font-size:.86rem;line-height:1.5;color:var(--forest-deep);text-decoration:none;transition:border-color .15s,background .15s;}',
'.gs-list a:hover{border-color:var(--accent);background:#fffbf3;}',
'.gs-list span.gs-nopage{color:#8a9389;background:#f7f4ea;}',
'.gs-list .gs-sub{padding-left:22px;}',
'.gs-latin{display:block;font-style:italic;font-size:.72rem;color:#8a9389;margin-top:1px;}',
'.gs-note{font-size:.78rem;color:#8a9389;margin:14px 0 0;line-height:1.7;}',
'.gs-more{display:inline-block;margin-top:16px;padding:9px 18px;border-radius:22px;background:var(--forest);',
'  color:var(--parchment);text-decoration:none;font-size:.86rem;border:1px solid #3d5a4b;}',
'.gs-more:hover{background:var(--accent-dark);border-color:var(--accent-dark);}',
'@media(max-width:560px){.gs-list{grid-template-columns:1fr;}}',
'</style>'
].join('\n');

function renderBlock(guide, items) {
  const meta = GUIDE_META[guide], more = LIST_LINK[guide];
  const out = [BEGIN, STYLE, '<div class="gs-wrap">',
    '  <h3>' + esc(meta.heading || ('このガイドの対象種' + (items.length ? '（' + items.length + '種）' : ''))) + '</h3>'];
  if (meta.lead) out.push('  <p class="gs-lead">' + esc(meta.lead) + '</p>');
  orderForGuide(items).forEach(g => {
    out.push('  <div class="gs-genus">' + esc(g.genus) + '</div>');
    out.push('  <ul class="gs-list">');
    g.species.forEach(s => s.items.forEach(i => {
      const cls = (i.rank === '種') ? '' : ' class="gs-sub"';
      const inner = esc(i.sp.name) + '<span class="gs-latin">' + esc(i.sp.latin) + '</span>';
      out.push(i.sp.hasPage && i.sp.slug
        ? '    <li' + cls + '><a href="species/' + i.sp.slug + '.html">' + inner + '</a></li>'
        : '    <li' + cls + '><span class="gs-nopage">' + inner + '（種別ページは準備中）</span></li>');
    }));
    out.push('  </ul>');
  });
  if (guide === 'guide-japan') {
    out.push('  <p class="gs-note">この3種は水棲・淡水ガメでもあるため、<a href="guide-water-full.html">水棲・淡水ガメの飼い方ガイド</a>にも掲載しています。</p>');
  }
  out.push('  <a class="gs-more" href="' + more.href + '">' + esc(more.text) + ' →</a>');
  out.push('</div>', END);
  return out.join('\n');
}

// ── 実行 ──
const check = process.argv.indexOf('--check') >= 0;
const all = T.loadSpecies();
const problems = assign(all);

const byGuide = {};
GUIDES.forEach(g => { byGuide[g] = []; });
all.forEach(i => { if (i.guide) byGuide[i.guide].push(i); });
// guide-japan は横断掲載
all.forEach(i => { if (i.crossJapan) byGuide['guide-japan'].push(i); });

// 検証
const assigned = all.filter(i => i.guide);
if (assigned.length !== all.length) problems.push('guide未所属: ' + (all.length - assigned.length) + '件');
const primaryCount = GUIDES.filter(g => g !== 'guide-japan' && g !== 'guide-beginner')
  .reduce((a, g) => a + byGuide[g].length, 0);
if (primaryCount !== all.length) problems.push('主所属の合計が' + primaryCount + '件（期待' + all.length + '件）');
const dup = {};
GUIDES.forEach(g => { if (g === 'guide-japan') return; byGuide[g].forEach(i => { dup[i.sp.name] = (dup[i.sp.name] || 0) + 1; }); });
Object.keys(dup).forEach(n => { if (dup[n] > 1) problems.push('二重所属: ' + n); });

if (problems.length) {
  console.error('■ 問題があるため書き込みを中止します');
  problems.forEach(p => console.error('  - ' + p));
  process.exit(1);
}

let changed = 0;
GUIDES.forEach(g => {
  const f = path.join(ROOT, g + '.html');
  let s = fs.readFileSync(f, 'utf8');
  const block = renderBlock(g, byGuide[g]);
  const re = new RegExp(BEGIN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]*?' + END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  let next;
  if (re.test(s)) {
    next = s.replace(re, block);
  } else {
    // 「この暮らしから選ぶ飼育機材」の .gear ブロックの直前に入れる。
    // guide-beginner だけ構成が違うので機材セクションの直前を使う。
    const anchor = (g === 'guide-beginner') ? '<!-- ── GEAR: 水棲ガメ ── -->' : '<div class="gear">';
    const idx = (g === 'guide-beginner') ? s.indexOf(anchor) : s.lastIndexOf(anchor);
    if (idx < 0) { console.error('挿入位置が見つかりません: ' + g); process.exit(1); }
    next = s.slice(0, idx) + block + '\n\n    ' + s.slice(idx);
  }
  if (next !== s) {
    changed++;
    if (!check) fs.writeFileSync(f, next);
  }
  console.log('  ' + g.padEnd(18) + String(byGuide[g].length).padStart(3) + '種' +
              (next !== s ? '  [更新]' : '  [変更なし]'));
});
console.log(check ? ('差分のあるファイル: ' + changed) : ('書き込み: ' + changed + ' ファイル'));
