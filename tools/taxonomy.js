/**
 * KAME LIFE GUIDE — 種の分類と並び順の唯一の定義（Single Source of Truth）
 *
 * このファイルは「属 → 大分類」のマッピングと、一覧の並び順ルールを一元管理する。
 * 生成物はここから作られる:
 *   - species-list.html の GENUS_CAT / CAT_ORDER / CAT_NOTE（tools/gen-species-list.js）
 *   - species-list.html の noscript 静的一覧（tools/gen-species-list.js）
 *   - guide-*.html の「このガイドの対象種」（tools/gen-guide-species.js）
 *
 * 種データ（shindan/species.js）は読み取るだけで、絶対に書き換えない。
 * 属を増やしたときはここだけ直して各ジェネレータを再実行する。
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// ── 属 → 大分類（40属）──
// 判定はこのマッピングだけで行う。種名（和名）の部分一致判定は使わない。
const GENUS_CAT = {
  // ① リクガメ（リクガメ科 Testudinidae）
  Testudo:'リクガメ', Indotestudo:'リクガメ', Chelonoidis:'リクガメ', Stigmochelys:'リクガメ',
  Kinixys:'リクガメ', Centrochelys:'リクガメ', Aldabrachelys:'リクガメ', Manouria:'リクガメ',
  Malacochersus:'リクガメ', Geochelone:'リクガメ', Chersina:'リクガメ', Pyxis:'リクガメ',
  // ② ヤマガメ・ハコガメ（森林性の陸生・半陸生）
  Clemmys:'ヤマガメ・ハコガメ', Glyptemys:'ヤマガメ・ハコガメ', Geoemyda:'ヤマガメ・ハコガメ',
  Cuora:'ヤマガメ・ハコガメ', Rhinoclemmys:'ヤマガメ・ハコガメ', Terrapene:'ヤマガメ・ハコガメ',
  Cyclemys:'ヤマガメ・ハコガメ',
  // ③ 半水棲（ニオイガメ科 Kinosternidae）
  Sternotherus:'半水棲', Kinosternon:'半水棲', Staurotypus:'半水棲',
  // ④ 水棲（淡水）
  Chrysemys:'水棲（淡水）', Mauremys:'水棲（淡水）', Trachemys:'水棲（淡水）',
  Graptemys:'水棲（淡水）', Pseudemys:'水棲（淡水）', Emydoidea:'水棲（淡水）',
  Emys:'水棲（淡水）', Siebenrockiella:'水棲（淡水）',
  // ⑤ 汽水
  Malaclemys:'汽水',
  // ⑥ スッポン・曲頸
  Apalone:'スッポン・曲頸', Carettochelys:'スッポン・曲頸', Pelodiscus:'スッポン・曲頸',
  Chelodina:'スッポン・曲頸', Chelus:'スッポン・曲頸', Emydura:'スッポン・曲頸',
  Phrynops:'スッポン・曲頸', Pelomedusa:'スッポン・曲頸', Pelusios:'スッポン・曲頸'
};

const CAT_ORDER = ['リクガメ','ヤマガメ・ハコガメ','半水棲','水棲（淡水）','汽水','スッポン・曲頸'];

const CAT_NOTE = {
  'リクガメ':'陸で暮らす。床材とバスキング、UVBが要。',
  'ヤマガメ・ハコガメ':'森林の落ち葉の下。高湿度と浅い水場。',
  '半水棲':'ニオイガメ・ドロガメの仲間。浅い水と陸場。',
  '水棲（淡水）':'水槽で泳がせる。ろ過とバスキングが要。',
  '汽水':'塩分のある水。専用の水づくりが要。',
  'スッポン・曲頸':'スッポン類と、首を横に曲げる仲間。'
};

const RANK_ORDER = { '種': 0, '変異型': 1, '亜種': 2 };

// 学名を 属 / 種小名 / 亜種小名 に分ける（亜属 (…) と全角注記 （…） は除く）
function sciParts(latin) {
  const s = String(latin || '');
  const note = (s.match(/（([^）]*)）/) || [])[1] || '';
  const bare = s.replace(/\([^)]*\)/g, ' ').replace(/（[^）]*）/g, ' ').replace(/\s+/g, ' ').trim();
  const w = bare.split(' ');
  return { genus: w[0] || '', species: w[1] || '', subsp: w[2] || '', note: note,
           binomial: (w[0] || '') + ' ' + (w[1] || '') };
}

// shindan/species.js を評価して 118件を得る（書き換えはしない）
function loadSpecies() {
  const src = fs.readFileSync(path.join(ROOT, 'shindan/species.js'), 'utf8');
  const S = new Function(src + '\nreturn SPECIES;')();
  const seen = {}, all = [];
  ['land', 'aquatic', 'forest', 'exotic'].forEach(route => S[route].forEach(sp => {
    if (seen[sp.name]) return;
    seen[sp.name] = true;
    all.push({ sp: sp, route: route, origIndex: all.length });
  }));
  return all;
}

function decorate(all) {
  all.forEach(it => {
    const p = sciParts(it.sp.latin);
    it.genus = p.genus;
    it.binomial = p.binomial;
    it.subsp = p.subsp;
    it.rank = p.subsp ? '亜種' : (p.note ? '変異型' : '種');
    it.bigCat = GENUS_CAT[p.genus] || 'その他';
    it.pop = it.sp.recommendationPriority || 0;
  });
  return all;
}

// 大分類 → 属 → 種(binomial) の入れ子。species-list.html の同名関数と同じ規則。
function buildGroups(list) {
  const cats = [];
  CAT_ORDER.concat(['その他']).forEach(cat => {
    const items = list.filter(i => i.bigCat === cat);
    if (!items.length) return;
    const gmap = {};
    items.forEach(i => { (gmap[i.genus] = gmap[i.genus] || []).push(i); });
    const genera = Object.keys(gmap).map(g => {
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
      return { genus: g, species: species, count: arr.length,
               pop: Math.max.apply(null, arr.map(x => x.pop)) };
    }).sort((a, z) => (z.pop - a.pop) || (a.genus < z.genus ? -1 : 1));
    cats.push({ cat: cat, genera: genera, count: items.length });
  });
  return cats;
}

function flatten(groups) {
  const out = [];
  groups.forEach(c => c.genera.forEach(g => g.species.forEach(s => s.items.forEach(i => out.push(i)))));
  return out;
}

// species-list.html の guideHref() と同じ規則
function guideHref(sp) {
  if (sp.hasPage && sp.slug) return 'species/' + sp.slug + '.html';
  if (!sp.links || !sp.links[0]) return 'index.html';
  return sp.links[0].href.replace('../', '');
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// マーカーで囲まれた領域を差し替える。マーカーが無ければ null を返す。
function replaceBlock(src, beginMark, endMark, body) {
  const q = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(q(beginMark) + '[\\s\\S]*?' + q(endMark));
  if (!re.test(src)) return null;
  return src.replace(re, beginMark + '\n' + body + '\n' + endMark);
}

module.exports = { ROOT, GENUS_CAT, CAT_ORDER, CAT_NOTE, RANK_ORDER,
                   sciParts, loadSpecies, decorate, buildGroups, flatten,
                   guideHref, esc, replaceBlock };
