/**
 * RAKUTEN-ID Phase 1 — 商品同一性判定（identity matching）
 *
 * 目的:
 *   既存 scoreCandidate()（価格35/評点25/レビュー数20/送料10/ショップ10）は
 *   「その出品が良い出品か」を測るもので、「同一商品か」は測っていない。
 *   本モジュールは同一性だけを判定する独立ゲートを提供する。
 *
 * 判定レベル:
 *   EXACT     … 一意性の高い型番が候補名に完全一致（＋メーカー矛盾なし）。
 *               JAN/productCode は現行 IchibaItem/Search 応答に含まれないため、
 *               API が返す場合に備えた将来拡張点としてコメントで残す。
 *   STRONG    … メーカー一致 ＋ シリーズ名一致 ＋ 自サイト側が宣言する
 *               SKU属性（W数/容量/サイズcm/号数/サイズ等級）がすべて候補名で確認できる。
 *               自サイト側が SKU属性を持たない商品（例: カメプロス）は
 *               メーカー＋固有シリーズ名の一致で成立する。
 *   AMBIGUOUS … 矛盾はないが SKU を一意に確認できない。昇格禁止。
 *   REJECT    … メーカー/W数/容量/サイズ/号数/等級/入数のいずれかが明確に矛盾。
 *
 * 使い方（update-rakuten.js から）:
 *   const IDN = require('./rakuten-identity.js');
 *   const idn = IDN.deriveIdentity(product);
 *   const m   = IDN.matchIdentity(idn, item);   // {level, evidence[], conflicts[]}
 *   const best= IDN.pickBest(idn, items, scoreFn);
 *
 * このモジュールは fs / ネットワーク / 環境変数に一切触れない（純関数のみ）。
 */
'use strict';

// ── メーカー辞書（同定用。検索語の書き換えには使わない）──────────
// 正規名 → 候補名に現れうる表記ゆれ。判定は正規化文字列の部分一致。
const MAKERS = {
  'GEX':        ['gex', 'ジェックス', 'エキゾテラ', 'exoterra', 'exo terra'],
  'キョーリン':  ['キョーリン', 'kyorin', 'ひかり', 'hikari'],
  'テトラ':      ['テトラ', 'tetra'],
  'スドー':      ['スドー', 'sudo'],
  '三晃商会':    ['三晃商会', '三晃', 'sanko'],
  'Zoo Med':    ['zoo med', 'zoomed', 'ズーメッド'],
  'コトブキ工芸': ['コトブキ', 'kotobuki'],
  'ニッソー':    ['ニッソー', 'nisso'],
  'マルカン':    ['マルカン', 'marukan'],
  'みどり商会':  ['みどり商会'],
  'INKBIRD':    ['inkbird', 'インクバード'],
  'シンワ測定':  ['シンワ', 'shinwa'],
  'ゼンスイ':    ['ゼンスイ', 'zensui'],
  'Fluval':     ['fluval', 'フルーバル'],
  'Arcadia':    ['arcadia', 'アルカディア'],
  'Rep-Cal':    ['rep-cal', 'repcal', 'レップカル', 'レプカル'],
  'Repashy':    ['repashy', 'レパシー'],
  'Mazuri':     ['mazuri', 'マズリ'],
  '水作':        ['水作', 'suisaku'],
  'ビバリア':    ['ビバリア', 'vivaria'],
  'Habistat':   ['habistat', 'ハビスタット'],
  'エーハイム':  ['エーハイム', 'eheim'],
};

// シリーズ名として使わない一般語（カテゴリ内のどの商品にも現れうる語）
const GENERIC_WORDS = [
  'バスキングスポットランプ', 'バスキングランプ', 'バスキングライト', 'バスキング',
  'スポットランプ', 'ランプ', 'ライト', 'フィルター', 'ヒーター', 'サーモスタット',
  'サーモ', '水槽', 'ケージ', 'ケース', 'フード', 'シェルター', '床材', '温度計',
  '湿度計', '水温計', 'リクガメ', '爬虫類', '亀', 'カメ', 'タートル', '水入れ',
  '餌', 'エサ', 'セット', 'サイズ', 'タイプ', 'ガラス製', '大型', '小型',
];

// ── RAKUTEN-ID Phase 2: 誤マッチ防止語彙 ───────────────────────
// 消耗品・付属品ワード。候補名に現れ、自商品名に無い場合は本体候補として不採用（REJECT）。
// Phase 1 dry-run の実例: 「粗目フィルターパッド 2213用」「クラシック2217専用ろ材セット」。
const CONSUMABLE_WORDS = [
  'パッド', 'ろ材', '濾材', 'ろ過材', '交換用', '詰め替え', '詰替', 'スペア', '替えマット',
];
// 変種SKUマーカー。候補名にあり自商品名に無い場合、STRONG を AMBIGUOUS へ落とす
// （同一シリーズの別SKUを安易に同一扱いしない）。EXACT（一意型番一致）には適用しない。
// Phase 1 dry-run の実例: 「レプトミン ニオイブロック超大粒」「カメプロス 沈下性大スティック」。
const VARIANT_MARKERS = [
  'ニオイブロック', '超大粒', '大粒', '小粒', '細粒', '細目', '粗目',
  '沈下性', '浮上性', 'タイトビーム', '訳あり', '徳用', '業務用', 'ジュニア', 'ベビー',
];
// ケージ・水槽（enclosure）商品の候補に照明系ワードを許さない。
// Phase 1 dry-run の実例: グラステラリウム9030 の適合表記を持つ「コンパクトトップ90N」（照明フード）。
const LIGHTING_WORDS = ['ランプ', 'ライト', '照明', '灯式', '電球', 'バルブ'];

// ── 検索語の別表記（0件時の代替クエリ生成専用。同定には使わない）──
const BRAND_QUERY_ALIASES = [
  [/SANKO/gi, '三晃商会'],
  [/ReptoMin/gi, 'レプトミン'],
  [/ReptiSun/gi, 'レプティサン'],
  [/Fluval/gi, 'フルーバル'],
  [/Exo\s*Terra/gi, 'エキゾテラ'],
  [/Zoo\s*Med/gi, 'ズーメッド'],
  [/Repashy/gi, 'レパシー'],
  [/Mazuri/gi, 'マズリ'],
  [/Rep-?Cal/gi, 'レップカル'],
];

// ── 正規化 ─────────────────────────────────────────────
function normJa(s) {
  return String(s == null ? '' : s)
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[・　]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
function alnum(s) { return normJa(s).replace(/[^a-z0-9]/g, ''); }

// ── 属性抽出（W数 / 容量 / cm / 号 / サイズ等級 / 入数）───────────
function extractAttrs(text) {
  const t = normJa(text);
  const attrs = { watts: [], caps: [], cms: [], gous: [], grades: [], packs: [] };
  let m;
  const wre = /(\d+(?:\.\d+)?)\s*w(?![a-z])/g;
  while ((m = wre.exec(t))) attrs.watts.push(parseFloat(m[1]));
  // 容量: kg→g、l→ml に正規化して {kind, v} で持つ（「リットル」表記も l として扱う）
  const cre = /(\d+(?:\.\d+)?)\s*(kg|g|ml|l|リットル|ℓ)(?![a-z])/g;
  while ((m = cre.exec(t))) {
    const v = parseFloat(m[1]);
    if (m[2] === 'kg')      attrs.caps.push({ kind: 'g',  v: v * 1000 });
    else if (m[2] === 'g')  attrs.caps.push({ kind: 'g',  v: v });
    else if (m[2] === 'ml') attrs.caps.push({ kind: 'ml', v: v });
    else                    attrs.caps.push({ kind: 'ml', v: v * 1000 });
  }
  const cmre = /(\d{2,3}(?:\.\d+)?)\s*cm(?![a-z])/g;
  while ((m = cmre.exec(t))) attrs.cms.push(parseFloat(m[1]));
  const gre = /(\d{1,2})\s*号/g;
  while ((m = gre.exec(t))) attrs.gous.push(parseInt(m[1], 10));
  // サイズ等級（S/M/ML/L等）: 単独トークンのみ。容量の l と誤認しないよう境界必須
  const sre = /(?:^|[\s(（/])(ss|ml|xl|ll|s|m|l)(?:サイズ)?(?:$|[\s)）/])/g;
  while ((m = sre.exec(t))) attrs.grades.push(m[1]);
  // 入数・セット数（×2、3個セット等）。商品名自体に「セット」を含む商品は呼び出し側で除外判断
  const pre1 = /[×x]\s*([2-9]\d*)(?![0-9])/g;
  while ((m = pre1.exec(t))) attrs.packs.push(parseInt(m[1], 10));
  const pre2 = /([2-9]\d*)\s*(?:個|袋|本|箱|枚)\s*(?:入り?|セット|パック)/g;
  while ((m = pre2.exec(t))) attrs.packs.push(parseInt(m[1], 10));
  return attrs;
}

// ── 型番トークン抽出 ─────────────────────────────────────
// 例: PF701 / RTT-1 / 73117 / BK9045 / KC-1200LT / IBS-TH3 / SH55 / BL-50 / e-ROKA / FX6 / 10i
function extractModels(name) {
  const t = String(name == null ? '' : name).normalize('NFKC');
  const out = [];
  const re = /[A-Za-z]+(?:-[A-Za-z0-9]+)+|[A-Za-z]{1,6}-?\d{1,5}[A-Za-z0-9]*|\d{1,3}[A-Za-z]{1,3}\d*|\d{4,5}(?![0-9])/g;
  let m;
  while ((m = re.exec(t))) {
    const tok = m[0];
    const a = alnum(tok);
    // 単位付き数値（80w / 26w / 400g / 8.8l / 900 が続くcm等）を型番と誤認しない
    if (/^\d+(?:\.\d+)?(w|g|kg|l|ml|cm|mm)$/i.test(a)) continue;
    if (a.length < 2) continue;
    out.push(tok);
  }
  return out;
}
// 「一意性の高い型番」= 英数混在、または4桁以上の数字列
function isUniqueModel(tok) {
  const a = alnum(tok);
  const hasDigit = /\d/.test(a);
  const hasAlpha = /[a-z]/.test(a);
  return (hasDigit && hasAlpha && a.length >= 3) || (/^\d{4,5}$/.test(a));
}

// ── 自サイト商品から identity を導出 ─────────────────────────
function deriveIdentity(product) {
  const name = String(product.name || '');
  const nameNorm = normJa(name);
  // メーカー特定（最長一致優先）
  let maker = null, makerAliases = [];
  let bestLen = 0;
  Object.keys(MAKERS).forEach(function(canon) {
    MAKERS[canon].forEach(function(al) {
      const a = normJa(al);
      if (nameNorm.indexOf(a) >= 0 && a.length > bestLen) {
        maker = canon; bestLen = a.length;
      }
    });
  });
  if (maker) makerAliases = MAKERS[maker].map(normJa);

  const attrs = extractAttrs(name);
  const models = extractModels(name).filter(function(tok) {
    // メーカー別名そのものは型番ではない（例: GEX）
    return makerAliases.indexOf(normJa(tok)) < 0;
  });

  // シリーズ語: 括弧注記を除いた name から、メーカー別名・一般語を除いた語
  const stripped = name.replace(/（[^）]*）|\([^)]*\)/g, ' ');
  const words = normJa(stripped).split(' ').filter(Boolean);
  const series = [];
  words.forEach(function(w) {
    if (makerAliases.indexOf(w) >= 0) return;
    if (GENERIC_WORDS.some(function(g) { return normJa(g) === w; })) return;
    if (/^\d+(?:\.\d+)?(w|g|kg|l|ml|cm|mm|号)?$/.test(w)) return;
    if (/^(ss|ml|xl|ll|s|m|l)サイズ$/.test(w)) return;   // サイズ等級語はシリーズではない
    const kana = /[぀-ヿ一-鿿]/.test(w);
    if ((kana && w.length >= 2) || (!kana && w.length >= 4)) series.push(w);
  });

  const productIsSet = /セット/.test(name);
  return { maker: maker, makerAliases: makerAliases, models: models,
           attrs: attrs, series: series, productIsSet: productIsSet,
           name: name, category: String(product.category || '') };
}

// hay 内に「別メーカー」の別名があるか（自メーカー別名は除外して判定）
function findForeignMaker(hayNorm, ownMaker) {
  const own = ownMaker ? MAKERS[ownMaker].map(normJa) : [];
  let found = null;
  Object.keys(MAKERS).forEach(function(canon) {
    if (canon === ownMaker) return;
    MAKERS[canon].forEach(function(al) {
      const a = normJa(al);
      // 自メーカー別名の部分文字列（例:「ひかり」と「光」）は素通し。完全一致部分のみ
      if (own.indexOf(a) >= 0) return;
      if (hayNorm.indexOf(a) >= 0 && !found) found = canon;
    });
  });
  return found;
}

// 型番が「適合・専用表記」の文脈でだけ現れていないか（RAKUTEN-ID Phase 2）。
// 例: 「粗目フィルターパッド 2213用」「クラシック2217専用ろ材セット」
//     「…コンパクトトップ90N … グラステラリウム9045 9030用」
// 型番の直後（間に別の英数トークン・区切りを挟んでもよい）に
// 用/専用/対応/適合 が続く場合、その一致は本体の同一性根拠にしない。
// 数字のみの型番は連続一致のみ許す（「90-30」等の寸法表記を型番と誤認しないため）。
function modelInCompatContext(hayNorm, tok) {
  const a = alnum(tok);
  if (!a) return false;
  const esc = function(c) { return c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); };
  const sep = '[\\s\\-‐–−]*';
  const aPat = /^[0-9]+$/.test(a) ? esc(a) : a.split('').map(esc).join(sep);
  const re = new RegExp(aPat + '(?:[\\s/、,]*[0-9a-z\\-‐–−]+)*\\s*(?:専用|対応|適合|用)');
  return re.test(hayNorm);
}

// ── 候補1件との照合 ──────────────────────────────────────
// item: 楽天APIの Item（itemName / catchcopy を参照。URLは見ない）
function matchIdentity(idn, item) {
  const hayRaw  = String(item.itemName || '') + ' ' + String(item.catchcopy || '');
  const hayNorm = normJa(hayRaw);
  const hayAl   = alnum(hayRaw);
  const hayAttrs = extractAttrs(hayRaw);
  const evidence = [], conflicts = [];

  // メーカー
  const makerHit = idn.makerAliases.some(function(a) { return hayNorm.indexOf(a) >= 0; });
  if (makerHit) evidence.push('maker:' + idn.maker);
  else if (idn.maker) {
    const foreign = findForeignMaker(hayNorm, idn.maker);
    if (foreign) conflicts.push('maker≠(' + foreign + ')');
  }

  // W数: 双方が宣言していて一致しない → 矛盾
  if (idn.attrs.watts.length) {
    const want = idn.attrs.watts;
    if (hayAttrs.watts.length) {
      const hit = want.some(function(w) { return hayAttrs.watts.indexOf(w) >= 0; });
      if (hit) evidence.push(want[0] + 'W');
      else conflicts.push('watt ' + want[0] + '≠' + hayAttrs.watts.join('/'));
    }
  }
  // 容量
  if (idn.attrs.caps.length) {
    const want = idn.attrs.caps;
    if (hayAttrs.caps.length) {
      const hit = want.some(function(c) {
        return hayAttrs.caps.some(function(h) { return h.kind === c.kind && h.v === c.v; });
      });
      if (hit) evidence.push('容量一致');
      else conflicts.push('容量不一致');
    }
  }
  // サイズcm
  if (idn.attrs.cms.length && hayAttrs.cms.length) {
    const hit = idn.attrs.cms.some(function(v) { return hayAttrs.cms.indexOf(v) >= 0; });
    if (hit) evidence.push(idn.attrs.cms[0] + 'cm');
    else conflicts.push('サイズcm不一致');
  }
  // 号数
  if (idn.attrs.gous.length && hayAttrs.gous.length) {
    const hit = idn.attrs.gous.some(function(v) { return hayAttrs.gous.indexOf(v) >= 0; });
    if (hit) evidence.push(idn.attrs.gous[0] + '号');
    else conflicts.push('号数不一致');
  }
  // サイズ等級（S/ML等）
  if (idn.attrs.grades.length && hayAttrs.grades.length) {
    const hit = idn.attrs.grades.some(function(g) { return hayAttrs.grades.indexOf(g) >= 0; });
    if (hit) evidence.push('等級' + idn.attrs.grades[0].toUpperCase());
    else conflicts.push('等級不一致');
  }
  // 入数（自商品がセット商品でないのに ×2 / 3個セット等）
  if (!idn.productIsSet && hayAttrs.packs.length) {
    conflicts.push('入数(' + hayAttrs.packs[0] + ')');
  }

  // 成分変種（カルシウムの D3 有無）の取り違え防止
  const pn = normJa(idn.name);
  if (pn.indexOf('d3なし') >= 0) {
    if (hayNorm.indexOf('d3') >= 0 && hayNorm.indexOf('d3なし') < 0) conflicts.push('D3有無');
  } else if (pn.indexOf('ビタミンd3') >= 0 || pn.indexOf('+d3') >= 0) {
    if (hayNorm.indexOf('d3なし') >= 0) conflicts.push('D3有無');
  }

  // ── RAKUTEN-ID Phase 2: 誤マッチ防止 ──
  // 消耗品・付属品（自商品名に同語が無い場合のみ矛盾扱い）
  CONSUMABLE_WORDS.forEach(function(w) {
    const nw = normJa(w);
    if (hayNorm.indexOf(nw) >= 0 && pn.indexOf(nw) < 0) conflicts.push('消耗品(' + w + ')');
  });
  // ケージ・水槽商品に照明系候補を許さない
  if (idn.category === 'enclosure') {
    const lw = LIGHTING_WORDS.find(function(w) { return hayNorm.indexOf(normJa(w)) >= 0; });
    if (lw) conflicts.push('照明系(' + lw + ')');
  }

  // 型番（適合・専用表記の文脈でだけ現れる型番は同一性根拠にしない）
  let modelHit = null, compatOnly = null;
  idn.models.forEach(function(tok) {
    if (modelHit) return;
    const a = alnum(tok);
    if (!(a && hayAl.indexOf(a) >= 0)) return;
    if (modelInCompatContext(hayNorm, tok)) { if (!compatOnly) compatOnly = tok; return; }
    modelHit = tok;
  });
  if (compatOnly && !modelHit) conflicts.push('適合表記(' + compatOnly + ')');
  if (modelHit) evidence.push('model:' + modelHit);

  // シリーズ（Phase 2: catchcopy でなく itemName 内の一致だけを根拠にする。
  // 例:「乾燥エビ」が説明文にだけ現れる別商品を STRONG にしない）
  const hayNameNorm = normJa(item.itemName || '');
  const seriesHits = idn.series.filter(function(t) { return hayNameNorm.indexOf(t) >= 0; });
  if (seriesHits.length) evidence.push('series:' + seriesHits[0]);

  // 変種SKUマーカー（候補名にあり自商品名に無い → STRONG 不成立の材料）
  const variantMismatch = [];
  VARIANT_MARKERS.forEach(function(w) {
    const nw = normJa(w);
    if (hayNameNorm.indexOf(nw) >= 0 && pn.indexOf(nw) < 0) variantMismatch.push(w);
  });
  if (variantMismatch.length) evidence.push('variant≠' + variantMismatch[0]);

  // ── レベル判定 ──
  let level;
  if (conflicts.length) {
    level = 'REJECT';
  } else if (modelHit && isUniqueModel(modelHit) && (makerHit || !idn.maker)) {
    // JAN/productCode が API 応答に載る日が来たら、ここに JAN完全一致→EXACT を追加する
    level = 'EXACT';
  } else {
    // STRONG: メーカー＋シリーズ＋（自商品が宣言する主要SKU属性の全確認）
    const declared = [];
    if (idn.attrs.watts.length)  declared.push(hayAttrs.watts.length  && idn.attrs.watts.some(function(w){ return hayAttrs.watts.indexOf(w) >= 0; }));
    if (idn.attrs.caps.length)   declared.push(hayAttrs.caps.length   && idn.attrs.caps.some(function(c){ return hayAttrs.caps.some(function(h){ return h.kind===c.kind && h.v===c.v; }); }));
    if (idn.attrs.gous.length)   declared.push(hayAttrs.gous.length   && idn.attrs.gous.some(function(v){ return hayAttrs.gous.indexOf(v) >= 0; }));
    if (idn.attrs.grades.length) declared.push(hayAttrs.grades.length && idn.attrs.grades.some(function(g){ return hayAttrs.grades.indexOf(g) >= 0; }));
    const attrsAllConfirmed = declared.length === 0 || declared.every(Boolean);
    if (makerHit && seriesHits.length >= 1 && attrsAllConfirmed &&
        variantMismatch.length === 0) level = 'STRONG';
    else level = 'AMBIGUOUS';
  }
  return { level: level, evidence: evidence, conflicts: conflicts,
           variantMismatch: variantMismatch };
}

// ── 候補配列から最良を選ぶ ─────────────────────────────────
// scoreFn: 既存 scoreCandidate（品質/価格の安全チェック）。null は安全チェック落ち。
const LEVEL_RANK = { EXACT: 3, STRONG: 2, AMBIGUOUS: 1, REJECT: 0 };
function pickBest(idn, items, scoreFn) {
  let best = null;
  items.forEach(function(item) {
    const m = matchIdentity(idn, item);
    const q = scoreFn ? scoreFn(item) : 0;   // null = 品質安全チェック落ち
    const cand = { item: item, match: m, quality: q };
    if (!best) { best = cand; return; }
    const a = LEVEL_RANK[m.level], b = LEVEL_RANK[best.match.level];
    if (a > b) best = cand;
    else if (a === b && (q || -1) > (best.quality || -1)) best = cand;
  });
  return best;
}

// ── 0件時の代替クエリ（最大2本。同定とは独立）────────────────────
function buildAltQueries(term) {
  const out = [];
  let t1 = String(term || '');
  BRAND_QUERY_ALIASES.forEach(function(pair) { t1 = t1.replace(pair[0], pair[1]); });
  t1 = t1.replace(/\s+/g, ' ').trim();
  if (t1 && t1 !== term) out.push(t1);
  // 補助語（爬虫類/リクガメ/亀/餌/フード等）を落とした短縮形
  const t2base = (out[0] || term || '');
  const t2 = t2base.replace(/\b(爬虫類|リクガメ|亀|カメ|餌|エサ|フード)\b/g, ' ')
                   .replace(/\s+/g, ' ').trim();
  if (t2 && t2 !== t2base && t2 !== term && out.indexOf(t2) < 0 && t2.length >= 4) out.push(t2);
  return out.slice(0, 2);
}

// ── 成果対象URLか（Phase 4: available 整合性チェック）──────────────
// hb.afl.rakuten.co.jp 等のアフィリエイト計測ドメインのみ成果対象とみなす。
// 将来の正規ドメイン追加に備えて「afl.rakuten.co.jp で終わるホスト」を広めに許可し、
// パスやパラメータ形式は検査しない（過剰なハードコードで正規URLを誤拒否しないため）。
function isCommissionUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const h = new URL(url).hostname;
    return h === 'hb.afl.rakuten.co.jp' || /(^|\.)afl\.rakuten\.co\.jp$/.test(h);
  } catch (e) { return false; }
}

module.exports = {
  MAKERS: MAKERS,
  BRAND_QUERY_ALIASES: BRAND_QUERY_ALIASES,
  CONSUMABLE_WORDS: CONSUMABLE_WORDS,
  VARIANT_MARKERS: VARIANT_MARKERS,
  LIGHTING_WORDS: LIGHTING_WORDS,
  modelInCompatContext: modelInCompatContext,
  normJa: normJa,
  extractAttrs: extractAttrs,
  extractModels: extractModels,
  isUniqueModel: isUniqueModel,
  deriveIdentity: deriveIdentity,
  matchIdentity: matchIdentity,
  pickBest: pickBest,
  buildAltQueries: buildAltQueries,
  isCommissionUrl: isCommissionUrl,
  LEVEL_RANK: LEVEL_RANK,
};
