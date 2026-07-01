/**
 * Kame Life Guide - Starter Kit Engine (species page用)
 * Phase 6-C Task 3 → Phase 7A Task 1: 3段階 + Cost Box 対応
 *
 * 依存: data/products.js（PRODUCTS, EQUIPMENT_MAP, getTierProduct）
 *
 * 使い方（species page）:
 *   <script src="../data/products.js"></script>
 *   <script src="../js/starter-kit.js"></script>
 *   <div id="starter-kit-root"></div>
 *   <script>mountStarterKit({
 *     equipmentKey: 'tortoise_dry_small',
 *     name: 'ロシアリクガメ',
 *     difficulty: '入門〜中級',
 *     lifespan: '40〜80年',
 *     monthlyCost: '¥1,000〜3,000'   // 任意
 *   });</script>
 */

'use strict';

// ── Phase 7-C Step 3-A: Amazon URL 判定ヘルパー ──────────────────
function isAmazonUrl(url) {
  if (!url) return false;
  return /amazon\.co\.jp|amzn\.to|amzn\.asia|tag=kamelife09-22/.test(url);
}

// ── Phase 10-D: GA4 payload helpers ──────────────────────────
/**
 * window.location.pathname を返す（テスト差し替え可能）
 */
function _skPagePath() {
  return (typeof window !== 'undefined' && window.location && window.location.pathname)
    ? window.location.pathname
    : 'unknown';
}

/**
 * 文字列フォールバック（空・null・undefined → 'unknown'）
 */
function _skStr(v) {
  return (v && typeof v === 'string' && v.trim() !== '') ? v.trim() : 'unknown';
}

/**
 * category → display_category マッピング
 * products.jsにdisplay_categoryフィールドがないため内部マップで解決
 */
var SK_DISPLAY_CAT_MAP = {
  enclosure:        'ケージ',
  lighting_uvb:     'UVBライト',
  lighting_basking: 'バスキングライト',
  heating:          '保温器具',
  filter:           'フィルター',
  substrate:        '床材',
  thermometer:      '温湿度計',
  shelter:          'シェルター',
  food:             'フード',
  supplements:      'サプリメント',
};

function _skDisplayCat(cat) {
  return SK_DISPLAY_CAT_MAP[cat] || _skStr(cat);
}

/**
 * 診断ルートをURL param ?r= から読み取る
 * species page経由の場合、shindan が ?r=routeId を URLに書き込んでいる
 * 非診断流入の場合は 'unknown' を返す
 */
function _skRoute() {
  try {
    var r = new URLSearchParams(window.location.search).get('r');
    var VALID = { land: 1, aquatic: 1, forest: 1, exotic: 1, all: 1 };
    return (r && VALID[r]) ? r : 'unknown';
  } catch(e) { return 'unknown'; }
}


// ── Phase 10-D Step 2: GA4 Debug Panel ──────────────────────
(function () {
  var _debugEnabled = (
    typeof window !== 'undefined' &&
    /[?&]debug_ga=1/.test(window.location.search) ||
    /[?&]ga_debug=1/.test(window.location.search)
  );

  if (!_debugEnabled) {
    // no-op stub: zero cost for normal users
    window.KAME_GA_DEBUG_LOG = function () {};
    return;
  }

  // ── Panel DOM ────────────────────────────────────────────
  var _panel, _list, _count = 0;
  var MAX_ROWS = 10;

  function _buildPanel() {
    if (_panel) return;

    // Inject minimal CSS
    var style = document.createElement('style');
    style.textContent = [
      '#kame-ga-debug{position:fixed;bottom:0;left:0;right:0;z-index:99999;',
      'background:rgba(13,20,16,.95);color:#d4f0d4;font:11px/1.4 monospace;',
      'max-height:220px;overflow:hidden;border-top:2px solid #4caf50;',
      'box-shadow:0 -4px 20px rgba(0,0,0,.5);}',
      '#kame-ga-debug-hdr{display:flex;align-items:center;justify-content:space-between;',
      'padding:5px 10px;background:rgba(0,0,0,.4);border-bottom:1px solid #2a4a2a;',
      'font-size:10px;letter-spacing:.08em;color:#6fcf6f;font-weight:700;}',
      '#kame-ga-debug-list{overflow-y:auto;max-height:170px;padding:4px 0;}',
      '.kgd-row{display:flex;gap:8px;padding:3px 10px;border-bottom:1px solid rgba(76,175,80,.12);',
      'font-size:10.5px;align-items:flex-start;transition:background .15s;}',
      '.kgd-row:hover{background:rgba(76,175,80,.08);}',
      '.kgd-row:first-child{background:rgba(76,175,80,.12);}',
      '.kgd-n{flex-shrink:0;color:#aaa;min-width:18px;text-align:right;}',
      '.kgd-ev{flex-shrink:0;color:#f0c060;font-weight:700;min-width:170px;}',
      '.kgd-pl{color:#9ef0ae;word-break:break-all;white-space:pre-wrap;}',
    ].join('');
    document.head.appendChild(style);

    _panel = document.createElement('div');
    _panel.id = 'kame-ga-debug';

    var hdr = document.createElement('div');
    hdr.id = 'kame-ga-debug-hdr';
    hdr.innerHTML =
      '<span>🐢 KAME GA DEBUG</span>' +
      '<span style="color:#f0c060">?debug_ga=1 — 最新10件表示</span>' +
      '<button onclick="document.getElementById(&quot;kame-ga-debug&quot;).remove()" ' +
        'style="background:none;border:1px solid #4caf50;color:#4caf50;' +
        'cursor:pointer;padding:1px 7px;border-radius:3px;font-size:10px;">✕ 閉じる</button>';

    _list = document.createElement('div');
    _list.id = 'kame-ga-debug-list';

    _panel.appendChild(hdr);
    _panel.appendChild(_list);

    // append when DOM is ready
    if (document.body) {
      document.body.appendChild(_panel);
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        document.body.appendChild(_panel);
      });
    }
  }

  // ── Public logger ─────────────────────────────────────────
  window.KAME_GA_DEBUG_LOG = function (eventName, payload) {
    // Console にも出力（F12 Console で確認可能）
    console.log('[GA4:SK]', eventName, payload);
    _buildPanel();
    _count++;

    // compact JSON: max 120 chars per row
    var raw = JSON.stringify(payload, null, 0);
    var compact = raw.length > 200 ? raw.slice(0, 197) + '…}' : raw;

    var row = document.createElement('div');
    row.className = 'kgd-row';
    row.innerHTML =
      '<span class="kgd-n">' + _count + '</span>' +
      '<span class="kgd-ev">' + eventName + '</span>' +
      '<span class="kgd-pl">' + compact + '</span>';

    // prepend (newest first)
    if (_list.firstChild) {
      _list.insertBefore(row, _list.firstChild);
    } else {
      _list.appendChild(row);
    }

    // trim to MAX_ROWS
    while (_list.children.length > MAX_ROWS) {
      _list.removeChild(_list.lastChild);
    }
  };

})();

var SK_CAT_LABELS_PAGE = {
  enclosure:        '飼育ケージ',
  lighting_uvb:     'UVBライト',
  lighting_basking: 'バスキングライト',
  heating:          '保温器具',
  filter:           'フィルター',
  substrate:        '床材',
  thermometer:      '温湿度計',
  shelter:          'シェルター',
  food:             'フード',
  supplements:      'サプリ',
};

var SK_TIER_LABEL_PAGE = {
  budget:   'コスパ重視',
  standard: 'まずはこれ',
  premium:  '本格派',
};

// tier別 Amazon CTAボタン文言
var SK_TIER_CTA = {
  budget:   'Amazonで最安値をチェック →',
  standard: 'Amazonで購入候補を見る →',
  premium:  'Amazonで本格セットを見る →',
};

// 3段階タブ定義
var SK_TABS = [
  { id: 'essential', label: '必須セット',   icon: '✅', desc: '飼育開始に最低限必要な機材',     tiers: ['budget'] },
  { id: 'comfort',   label: '推奨セット',   icon: '⭐', desc: '快適化・失敗防止のプラスアルファ', tiers: ['standard'] },
  { id: 'advanced',  label: '上級セット',   icon: '🏆', desc: '余裕が出てきたら揃えたい本格装備', tiers: ['premium'] },
];

var SK_CAT_ORDER = [
  'enclosure', 'lighting_uvb', 'lighting_basking',
  'heating', 'filter', 'substrate', 'thermometer',
  'shelter', 'food', 'supplements'
];

function skStarRating(r) {
  if (!r) return '';
  var full = Math.floor(r);
  var half = (r - full) >= 0.5 ? 1 : 0;
  var empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty) + ' ' + r.toFixed(1);
}

/**
 * 指定tierのピックリスト生成
 */
function generateKitByTier(equipmentKey, tier) {
  if (typeof PRODUCTS === 'undefined' || typeof EQUIPMENT_MAP === 'undefined') return [];
  if (!EQUIPMENT_MAP[equipmentKey]) return [];

  var result = [], seen = {};

  SK_CAT_ORDER.forEach(function(cat) {
    var pick = null;

    if (typeof getTierProduct === 'function') {
      // 指定tierを優先、なければ隣接tierにフォールバック
      var fallbacks = (tier === 'budget')
        ? ['budget', 'standard']
        : (tier === 'premium')
        ? ['premium', 'standard']
        : ['standard', 'budget'];

      for (var i = 0; i < fallbacks.length; i++) {
        var p = getTierProduct(equipmentKey, cat, fallbacks[i]);
        if (p && !seen[p.id]) { pick = p; break; }
      }
    }

    if (!pick) return;
    seen[pick.id] = true;
    result.push({ cat: cat, tier: tier, product: pick });
  });

  return result;
}

/**
 * priceRange から下限・上限を解析
 */
function parsePriceRange(priceRange) {
  if (!priceRange) return { low: 0, high: 0 };
  var s = priceRange.replace(/[¥,]/g, '');
  var m = s.match(/(\d+)[^\d]+(\d+)/);
  if (m) return { low: parseInt(m[1], 10), high: parseInt(m[2], 10) };
  var single = parseInt(s.match(/\d+/), 10) || 0;
  return { low: single, high: single };
}

function fmtYen(n) {
  return '¥' + n.toLocaleString('ja-JP');
}

/**
 * Cost Box HTML 生成
 */
function renderCostBox(picks, opts) {
  var totalLow = 0, totalHigh = 0;
  picks.forEach(function(item) {
    var r = parsePriceRange(item.product.priceRange);
    totalLow  += r.low;
    totalHigh += r.high;
  });
  var costText = (totalLow && totalHigh && totalLow !== totalHigh)
    ? fmtYen(totalLow) + '〜' + fmtYen(totalHigh)
    : totalLow ? fmtYen(totalLow) + '〜' : '—';

  var diff    = opts.difficulty || '—';
  var life    = opts.lifespan   || '—';
  var monthly = opts.monthlyCost || '¥1,000〜3,000';

  return '<div class="sk-cost-box">' +
    '<div class="sk-cost-title">📊 飼育コスト早見表</div>' +
    '<div class="sk-cost-grid">' +
      '<div class="sk-cost-item">' +
        '<div class="sk-cost-label">初期費用目安</div>' +
        '<div class="sk-cost-value">' + costText + '</div>' +
        '<div class="sk-cost-sub">推奨セット合計</div>' +
      '</div>' +
      '<div class="sk-cost-item">' +
        '<div class="sk-cost-label">月額維持費</div>' +
        '<div class="sk-cost-value">' + monthly + '</div>' +
        '<div class="sk-cost-sub">電気代・フード等</div>' +
      '</div>' +
      '<div class="sk-cost-item">' +
        '<div class="sk-cost-label">難易度</div>' +
        '<div class="sk-cost-value sk-cost-diff">' + diff + '</div>' +
      '</div>' +
      '<div class="sk-cost-item">' +
        '<div class="sk-cost-label">寿命目安</div>' +
        '<div class="sk-cost-value">' + life + '</div>' +
      '</div>' +
    '</div>' +
    '<p class="sk-cost-note">※機材価格は目安です。Amazon価格は変動します。</p>' +
  '</div>';
}

/**
 * Phase 17 Sprint3: CVRバッジ判定
 * カテゴリ・tier・equipmentKeyから「クリックする理由」バッジを返す
 */
function getCvrBadge(item, equipmentKey) {
  var cat = item.cat || '';
  var tier = item.tier || 'budget';
  var ek = equipmentKey || '';

  // ── カテゴリ固有バッジ ──────────────────────────────────────
  if (cat === 'filter') {
    if (tier === 'budget')   return { icon: '💰', label: 'コスパ◎' };
    if (tier === 'premium')  return { icon: '🤫', label: '静音設計' };
    return { icon: '🧼', label: 'ニオイ対策' };
  }
  if (cat === 'lighting_uvb') {
    if (tier === 'premium')  return { icon: '⚡', label: '高出力UVB' };
    return { icon: '☀️', label: '必須アイテム' };
  }
  if (cat === 'lighting_basking') {
    return { icon: '🔥', label: '必須アイテム' };
  }
  if (cat === 'food') {
    if (tier === 'budget')   return { icon: '🔰', label: '初心者向け' };
    if (tier === 'premium')  return { icon: '🌿', label: '高品質' };
    return { icon: '🐢', label: '定番フード' };
  }
  if (cat === 'enclosure') {
    if (tier === 'budget')   return { icon: '💰', label: 'コスパ◎' };
    if (tier === 'premium')  return { icon: '🏆', label: '本格仕様' };
    return { icon: '🔰', label: '初心者向け' };
  }
  if (cat === 'substrate') {
    var isDryTortoise = ek.indexOf('tortoise_dry') >= 0;
    if (tier === 'premium')  return isDryTortoise ? { icon: '🌿', label: '天然素材' } : { icon: '🌱', label: '高保湿' };
    return isDryTortoise ? { icon: '🏜️', label: '乾燥環境向け' } : { icon: '💰', label: 'コスパ◎' };
  }
  if (cat === 'thermometer') {
    return { icon: '📊', label: '管理の要' };
  }
  if (cat === 'heating') {
    return { icon: '🌡️', label: '冬の必需品' };
  }
  if (cat === 'shelter') {
    return { icon: '🏠', label: 'ストレス軽減' };
  }
  if (cat === 'supplements') {
    return { icon: '💊', label: '健康維持' };
  }

  // ── equipmentKey 系統バッジ（上書き） ─────────────────────
  var isAquatic  = ek.indexOf('aquatic') >= 0 || ek === 'japanese_pond';
  var isTortoise = ek.indexOf('tortoise') >= 0;
  var isBox      = ek === 'box_turtle';
  var isForest   = ek === 'tortoise_forest';

  if (isAquatic)  return { icon: '🐢', label: '水棲向け' };
  if (isTortoise) return { icon: '🌿', label: 'リクガメ向け' };
  if (isBox)      return { icon: '🍂', label: 'ハコガメ向け' };
  if (isForest)   return { icon: '🌲', label: 'ヤマガメ向け' };

  // ── fallback ───────────────────────────────────────────────
  if (tier === 'budget')   return { icon: '💰', label: 'コスパ◎' };
  if (tier === 'premium')  return { icon: '🏆', label: '本格仕様' };
  return { icon: '🔰', label: '定番' };
}

/**
 * カード1枚のHTML
 */
function renderSkCard(item, speciesName, equipmentKey) {
  var p = item.product;
  var catLabel  = SK_CAT_LABELS_PAGE[item.cat] || item.cat;
  var tierLabel = SK_TIER_LABEL_PAGE[item.tier] || 'まずはこれ';
  var tierCls   = item.tier === 'budget'  ? 'sk-badge-budget'
                : item.tier === 'premium' ? 'sk-badge-premium'
                : 'sk-badge-standard';
  var hasUrl = p.affiliateUrl && p.affiliateUrl !== '#';
  var tierCtaText = (SK_TIER_CTA[item.tier] || 'Amazonで価格・在庫を見る');

  // Amazon CTA (unchanged)
  var amazonBtn = hasUrl
    ? '<a class="sk-card-btn" href="' + p.affiliateUrl + '" target="_blank" rel="noopener noreferrer sponsored"' +
      ' data-cat="' + p.category + '" data-species="' + (speciesName||'') + '"' +
      ' data-asin="' + (p.asin||'') + '" data-tier="' + (item.tier||'standard') + '"' +
      ' data-equipment-key="' + (equipmentKey||'') + '" data-product-id="' + p.id + '"' +
      ' data-display-cat="' + _skDisplayCat(p.category) + '"' +
      ' data-provider="amazon"' +
      ' data-click-url="' + p.affiliateUrl + '">' + tierCtaText + '</a>'
    : '<span class="sk-card-btn sk-card-btn--soon">' + catLabel + 'は選定中</span>';

  // ── Rakuten CTA: TASK 2 Dual CTA UX (CASE A/B/C/D) ──────────
  // CASE A: amazon + rakuten available → 2ボタン（Amazon primary, Rakuten secondary）
  // CASE B: amazon only → rakutenBtn = '' (hidden)
  // CASE C: rakuten pending → Coming Soon badge（非クリッカブル）
  // CASE D: neither → btn全体非表示
  var _rakStatus = p.rakutenStatus || 'pending';
  var _rakSearchUrl = (typeof getRakutenSearchUrl === 'function') ? getRakutenSearchUrl(p) : null;
  var showRakuten  = (typeof hasRakuten === 'function') && hasRakuten(p);
  var showRakSearch = _rakStatus === 'search' && !!_rakSearchUrl;
  var showRakPending = _rakStatus === 'pending' && hasUrl;  // CASE C: Amazon存在時のみbadge表示

  var rakutenBtn = '';
  if (showRakuten) {
    // CASE A: 楽天 available → セカンダリCTA（forest色）
    rakutenBtn = '<a class="sk-card-btn sk-card-btn--rakuten"' +
      ' href="' + p.rakutenUrl + '"' +
      ' target="_blank" rel="noopener noreferrer sponsored"' +
      ' aria-label="' + p.name + 'を楽天市場で見る"' +
      ' data-cat="' + p.category + '" data-species="' + (speciesName||'') + '"' +
      ' data-tier="' + (item.tier||'standard') + '"' +
      ' data-equipment-key="' + (equipmentKey||'') + '" data-product-id="' + p.id + '"' +
      ' data-display-cat="' + _skDisplayCat(p.category) + '"' +
      ' data-provider="rakuten" data-mode="affiliate"' +
      ' data-click-url="' + p.rakutenUrl + '">楽天で購入（ポイント還元）</a>';
  } else if (showRakSearch) {
    // CASE B\'(search): 楽天検索 → アウトラインセカンダリ
    rakutenBtn = '<a class="sk-card-btn sk-card-btn--rakuten-search"' +
      ' href="' + _rakSearchUrl + '"' +
      ' target="_blank" rel="noopener noreferrer"' +
      ' aria-label="' + p.name + 'を楽天市場で検索"' +
      ' data-cat="' + p.category + '" data-species="' + (speciesName||'') + '"' +
      ' data-tier="' + (item.tier||'standard') + '"' +
      ' data-equipment-key="' + (equipmentKey||'') + '" data-product-id="' + p.id + '"' +
      ' data-display-cat="' + _skDisplayCat(p.category) + '"' +
      ' data-provider="rakuten" data-mode="search"' +
      ' data-click-url="' + _rakSearchUrl + '">楽天でも探す</a>';
  } // Case C (pending): show Amazon only — rakutenBtn stays ''
  // CASE D: neither → rakutenBtn = '' (nothing rendered)

  var btn = amazonBtn + rakutenBtn;

  var cardTierCls = item.tier === 'standard' ? ' sk-card--standard'
                 : item.tier === 'premium'  ? ' sk-card--premium'
                 : ' sk-card--budget';
  // Phase 17 Sprint3: CVRバッジ
  var cvrBadge = getCvrBadge(item, equipmentKey);
  var cvrBadgeHtml = '<span class="sk-cvr-badge">' + cvrBadge.icon + ' ' + cvrBadge.label + '</span>';

  return '<div class="sk-card' + cardTierCls + '">' +
    '<div class="sk-cat-label-row">' +
      '<div class="sk-cat-label">' + catLabel + '</div>' +
      cvrBadgeHtml +
    '</div>' +
    '<span class="sk-card-badge ' + tierCls + '">' + tierLabel + '</span>' +
    '<div class="sk-card-name">' + p.name + '</div>' +
    (p.rating ? '<div class="sk-card-rating">' + skStarRating(p.rating) + '</div>' : '') +
    '<div class="sk-card-price">' + p.priceRange + '</div>' +
    (p.why ? '<div class="sk-card-why">' + p.why + '</div>' : '') +
    btn +
  '</div>';
}

/**
 * タブパネル1枚のHTML
 */
function renderTabPanel(tabDef, picks, speciesName, equipmentKey) {
  if (!picks.length) {
    return '<div class="sk-tab-panel" id="sk-panel-' + tabDef.id + '" role="tabpanel" hidden>' +
      '<p class="sk-empty">このカテゴリの商品は現在選定中です。</p>' +
    '</div>';
  }
  var cards = picks.map(function(item) {
    return renderSkCard(item, speciesName, equipmentKey);
  }).join('');

  return '<div class="sk-tab-panel" id="sk-panel-' + tabDef.id + '" role="tabpanel"' +
    (tabDef.id !== 'comfort' ? ' hidden' : '') + '>' +
    '<p class="sk-tab-desc">' + tabDef.icon + ' ' + tabDef.desc + '</p>' +
    '<div class="sk-scroll">' + cards + '</div>' +
  '</div>';
}

/**
 * メインHTML生成
 */
// ── Bundle Summary ───────────────────────────────────────────
/**
 * 各tierのpicksから合計価格（低価格帯の合計）を算出し¥100単位に丸める
 */
function calcBundlePrice(picks) {
  var total = 0;
  picks.forEach(function(item) {
    if (item.product && item.product.priceRange) {
      total += parsePriceRange(item.product.priceRange).low;
    }
  });
  return Math.round(total / 100) * 100;
}

/**
 * Phase 20-E: バンドル価格レンジ計算（低・高）
 */
function calcBundlePriceRange(picks) {
  var low = 0, high = 0;
  picks.forEach(function(item) {
    if (item.product && item.product.priceRange) {
      var r = parsePriceRange(item.product.priceRange);
      low  += r.low  || 0;
      high += r.high || r.low || 0;
    }
  });
  return {
    low:  Math.round(low  / 100) * 100,
    high: Math.round(high / 100) * 100,
  };
}

/**
 * Phase 20-E: 節約額文字列（budget vs standard比較）
 */
function calcSavingsStr(thisLow, standardLow) {
  if (!thisLow || !standardLow) return '';
  var diff = standardLow - thisLow;
  if (diff > 0) return fmtYen(Math.round(diff / 100) * 100) + 'お得';
  return '';
}

/**
 * バンドルサマリーHTML生成（タブの上に表示）
 */
function renderBundleSummary(tabData, speciesName) {
  var BUNDLES = [
    {
      tabId:    'essential',
      tier:     'budget',
      idx:      0,
      label:    'エントリー構成',
      icon:     '🌱',
      desc:     '飼育を始めるための最低限セット。まずはここから。',
      mod:      'sk-bundle--budget',
    },
    {
      tabId:    'comfort',
      tier:     'standard',
      idx:      1,
      label:    'スタンダード構成',
      icon:     '⭐',
      desc:     'コストと快適さのベストバランス。最もおすすめ。',
      mod:      'sk-bundle--standard',
      recommended: true,
    },
    {
      tabId:    'advanced',
      tier:     'premium',
      idx:      2,
      label:    'プレミアム構成',
      icon:     '🏆',
      desc:     '長期管理が楽になる本格仕様。余裕のある方に。',
      mod:      'sk-bundle--premium',
    },
  ];

    // Phase 20-E: standard tierの価格を先算出（savings基準）
  var _stdPicks = tabData[1] ? tabData[1].picks : [];
  var _stdRange = calcBundlePriceRange(_stdPicks);

  var cards = BUNDLES.map(function(b) {
    var picks    = tabData[b.idx] ? tabData[b.idx].picks : [];
    var range    = calcBundlePriceRange(picks);
    var count    = picks.length;
    var priceStr = range.low > 0
      ? (range.high > range.low
          ? fmtYen(range.low) + '〜' + fmtYen(range.high)
          : fmtYen(range.low) + '〜')
      : '価格お問い合わせ';
    var savingsStr  = (b.idx === 0) ? calcSavingsStr(range.low, _stdRange.low) : '';
    var savingsHtml = savingsStr
      ? '<div class="sk-bundle-savings">💰 スタンダードより' + savingsStr + '</div>'
      : '';
    var recBadge = b.recommended
      ? '<span class="sk-bundle-rec-badge">⭐ 最もおすすめ</span>'
      : '';

    // Phase 20-E: カテゴリプレビュー（最大4件 + 残数）
    var previewTags = picks.slice(0, 4).map(function(item) {
      return '<span class="sk-bundle-item-tag">' + _skDisplayCat(item.cat) + '</span>';
    }).join('');
    var moreTag = picks.length > 4
      ? '<span class="sk-bundle-item-more">+' + (picks.length - 4) + '点</span>'
      : '';
    var itemsHtml = '<div class="sk-bundle-items">' + previewTags + moreTag + '</div>';

    // Phase 35-B2: quick-link CTA — first valid pick per tier
    var _qlCopyMap = {
      budget:   '最安構成をAmazonで見る →',
      standard: 'おすすめ構成をAmazonで見る →',
      premium:  '本格セットをAmazonで見る →',
    };
    var _qlPick = null;
    for (var _qi = 0; _qi < picks.length; _qi++) {
      var _qp = picks[_qi].product;
      if (_qp && _qp.affiliateUrl && _qp.affiliateUrl !== '#') {
        _qlPick = picks[_qi]; break;
      }
    }
    var quickLinkHtml = _qlPick
      ? '<a class="sk-bundle-quicklink sk-card-btn"' +
          ' href="' + _qlPick.product.affiliateUrl + '"' +
          ' target="_blank" rel="noopener noreferrer sponsored"' +
          ' aria-label="' + b.label + 'をAmazonで見る"' +
          ' data-cat="' + _qlPick.cat + '"' +
          ' data-species="' + (speciesName || '') + '"' +
          ' data-tier="' + b.tier + '"' +
          ' data-asin="' + (_qlPick.product.asin || '') + '"' +
          ' data-product-id="' + _qlPick.product.id + '"' +
          ' data-display-cat="' + _skDisplayCat(_qlPick.cat) + '"' +
          ' data-provider="amazon"' +
          ' data-click-url="' + _qlPick.product.affiliateUrl + '">' +
          (_qlCopyMap[b.tier] || 'Amazonで見る →') +
        '</a>'
      : '';

    return '<div class="sk-bundle-card ' + b.mod + (b.recommended ? ' sk-bundle-card--rec' : '') + '"' +
      ' data-bundle-tab="sk-panel-' + b.tabId + '"' +
      ' data-bundle-tier="' + b.tier + '"' +
      ' data-bundle-price="' + range.low + '"' +
      ' data-bundle-price-high="' + range.high + '"' +
      ' data-bundle-count="' + count + '"' +
      ' data-species="' + (speciesName || '') + '">' +
      '<div class="sk-bundle-head">' +
        '<span class="sk-bundle-icon" aria-hidden="true">' + b.icon + '</span>' +
        '<span class="sk-bundle-label">' + b.label + recBadge + '</span>' +
      '</div>' +
      '<p class="sk-bundle-desc">' + b.desc + '</p>' +
      itemsHtml +
      '<div class="sk-bundle-meta">' +
        '<span class="sk-bundle-price">' + priceStr + '</span>' +
        '<span class="sk-bundle-count">' + count + '点セット</span>' +
      '</div>' +
      savingsHtml +
      '<button class="sk-bundle-cta" type="button"' +
        ' aria-label="' + b.label + 'の詳細を見る">' +
        'この構成をまとめて揃える →' +
      '</button>' +
      quickLinkHtml +
    '</div>';
  }).join('');

  return '<div class="sk-bundle-summary" role="region" aria-label="構成別セットガイド">' +
    '<p class="sk-bundle-eyebrow">まず構成を選んでください</p>' +
    '<div class="sk-bundle-grid">' + cards + '</div>' +
  '</div>';
}

function renderStarterKitHtmlV2(equipmentKey, opts) {
  var speciesName = opts.name || '';
  var heading = speciesName ? (speciesName + 'の飼育セットガイド') : '飼育セットガイド';

  // 各タブのpicks生成
  var tabData = SK_TABS.map(function(tab) {
    var picks = generateKitByTier(equipmentKey, tab.tiers[0]);
    return { tab: tab, picks: picks };
  });

  // Cost Box は推奨セット(standard)のpicksで計算（Phase 32-A1b: default tab=comfortと一致）
  var essentialPicks = tabData[1].picks;
  var costBoxHtml = renderCostBox(essentialPicks, opts);

  // Bundle Summary（タブ上部）
  var bundleSummaryHtml = renderBundleSummary(tabData, speciesName);

  // タブボタン
  var tabBtns = SK_TABS.map(function(tab, i) {
    var isDefault = (tab.id === 'comfort');
    var extraCls = isDefault ? ' sk-tab-btn--recommended' : '';
    return '<button class="sk-tab-btn' + (isDefault ? ' sk-tab-btn--active' : '') + extraCls + '"' +
      ' data-target="sk-panel-' + tab.id + '"' +
      ' role="tab" aria-selected="' + (isDefault ? 'true' : 'false') + '">' +
      tab.icon + ' ' + tab.label +
      (tab.id === 'comfort' ? '<span class="sk-tab-rec-badge">おすすめ</span>' : '') +
    '</button>';
  }).join('');

  // パネル
  var panels = tabData.map(function(d) {
    return renderTabPanel(d.tab, d.picks, speciesName, equipmentKey);
  }).join('');

  return '<section class="sk-section" aria-label="' + heading + '">' +
    '<div class="sk-inner">' +
      '<h2 class="sk-heading-main">' + heading + '</h2>' +
      costBoxHtml +
      '<p class="sk-hint">💡 迷ったら <strong>推奨セット</strong> から始めるのがおすすめです</p>' +
      bundleSummaryHtml +
      '<div class="sk-tabs" role="tablist">' + tabBtns + '</div>' +
      panels +
      '<p class="sk-disclaimer">※Amazonアソシエイトリンクを含みます　価格は目安です（変動あり）</p>' +
    '</div>' +
  '</section>';
}

/**
 * タブ切り替えイベント設定
 */
function initSkTabs(root, species, _ctx) {
  var _srcPage = (_ctx && _ctx.sourcePage) || 'species';
  var btns = root.querySelectorAll('.sk-tab-btn');
  var panels = root.querySelectorAll('.sk-tab-panel');
  // tab_id → tab_type / selected_tier マップ
  var TAB_META = {
    'sk-panel-essential': { tab_type: 'essential', selected_tier: 'budget' },
    'sk-panel-comfort':   { tab_type: 'comfort',   selected_tier: 'standard' },
    'sk-panel-advanced':  { tab_type: 'advanced',  selected_tier: 'premium' },
  };
  // 現在アクティブなtab状態をclosureで保持（click handler側で参照）
  // Phase 25-D: デフォルト表示タブをcomfort(推奨/standard)に変更したため、初期値もcomfortに整合
  var _currentMeta = TAB_META['sk-panel-comfort'];
  btns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var target = btn.dataset.target;
      _currentMeta = TAB_META[target] || {};
      btns.forEach(function(b) {
        b.classList.toggle('sk-tab-btn--active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });
      panels.forEach(function(p) {
        var show = p.id === target;
        if (show) p.removeAttribute('hidden');
        else p.setAttribute('hidden', '');
      });
      if (typeof gtag === 'function') {
        var meta = TAB_META[target] || {};
        // 既存イベント（維持）
        gtag('event', 'starter_kit_tab', {
          tab_id:           target,
          tab_type:         meta.tab_type      || 'unknown',
          selected_tier:    meta.selected_tier || 'unknown',
          species_name:     _skStr(species && species.name),
          species:          _skStr(species && species.name),
          equipment_key:    _skStr(species && species.equipmentKey),
          page_path:        _skPagePath(),
          affiliate_platform: 'amazon',
          route:            _skRoute(),
          source_page:      _srcPage,
        });
        window.KAME_GA_DEBUG_LOG('starter_kit_tab', {
          tab_type: meta.tab_type, selected_tier: meta.selected_tier,
          species: _skStr(species && species.name), page_path: _skPagePath(),
        });
        // 追加イベント
        gtag('event', 'starter_kit_tier_click', {
          tab_id:           target,
          tab_type:         meta.tab_type      || 'unknown',
          selected_tier:    meta.selected_tier || 'unknown',
          species:          _skStr(species && species.name),
          equipment_key:    _skStr(species && species.equipmentKey),
          page_path:        _skPagePath(),
          affiliate_platform: 'amazon',
          route:            _skRoute(),
          source_page:      _srcPage,
        });
        window.KAME_GA_DEBUG_LOG('starter_kit_tier_click', {
          tab_type: meta.tab_type, selected_tier: meta.selected_tier,
          species: _skStr(species && species.name), page_path: _skPagePath(),
        });
        // Phase 20-E: bundle_tier_switch
        gtag('event', 'bundle_tier_switch', {
          species:       _skStr(species && species.name),
          bundle_tier:   meta.selected_tier || 'unknown',
          equipment_key: _skStr(species && species.equipmentKey),
          page_path:     _skPagePath(),
          route:         _skRoute(),
          source_page:      _srcPage,
        });
        window.KAME_GA_DEBUG_LOG('bundle_tier_switch', {
          species: _skStr(species && species.name),
          bundle_tier: meta.selected_tier || 'unknown',
          equipment_key: _skStr(species && species.equipmentKey),
        });
      }
    });
  });
  // _currentMeta をmountStarterKit側に返す
  return { getMeta: function() { return _currentMeta; } };
}

/**
 * DOMにマウント（後方互換維持 + V2拡張）
 * @param {{ equipmentKey, name, difficulty, lifespan, monthlyCost }} species
 * @param {string} [mountId]
 * @param {{ sourcePage?: string, affiliateLocation?: string }} [analyticsCtx]
 *   analyticsCtx.sourcePage       — GA4 source_page param (default: 'species')
 *   analyticsCtx.affiliateLocation — GA4 location param in affiliate_click (default: 'starter_kit')
 */
function mountStarterKit(species, mountId, analyticsCtx) {
  var rootId = mountId || 'starter-kit-root';
  var root = document.getElementById(rootId);
  // Phase 31-C2a: analytics context — defaults preserve species-page behavior
  var _ctx = analyticsCtx || {};
  var _srcPage  = _ctx.sourcePage         || 'species';
  var _affLoc   = _ctx.affiliateLocation   || 'starter_kit';
  if (!root) return;
  if (!species || !species.equipmentKey) { root.style.display = 'none'; return; }

  var html = renderStarterKitHtmlV2(species.equipmentKey, species);
  if (!html) { root.style.display = 'none'; return; }

  root.innerHTML = html;
  var _tabCtrl = initSkTabs(root, species, _ctx);

  // ── Bundle card click: scroll-to-tab + GA4 ───────────────
  root.querySelectorAll('.sk-bundle-card').forEach(function(card) {
    card.querySelector('.sk-bundle-cta').addEventListener('click', function() {
      var targetPanelId = card.dataset.bundleTab;
      var tier          = card.dataset.bundleTier;
      var price         = parseInt(card.dataset.bundlePrice, 10) || 0;
      var count         = parseInt(card.dataset.bundleCount,  10) || 0;
      var sName         = card.dataset.species || _skStr(species && species.name);

      // Activate matching tab
      var btn = root.querySelector('.sk-tab-btn[data-target="' + targetPanelId + '"]');
      if (btn) btn.click();

      // Smooth-scroll to tabs
      var tabsEl = root.querySelector('.sk-tabs');
      if (tabsEl) {
        tabsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // GA4
      if (typeof gtag === 'function') {
        // Phase 20-E: bundle_click (canonical)
        gtag('event', 'bundle_click', {
          species:          _skStr(sName),
          bundle_tier:      tier,
          equipment_key:    _skStr(species && species.equipmentKey),
          estimated_price:  price,
          product_count:    count,
          page_path:        _skPagePath(),
          route:            _skRoute(),
          source_page:      _srcPage,
        });
        // Legacy (backward compat)
        gtag('event', 'bundle_card_click', {
          species:         _skStr(sName),
          bundle_type:     tier,
          estimated_price: price,
          product_count:   count,
          page_path:       _skPagePath(),
          route:           _skRoute(),
          source_page:      _srcPage,
        });
        window.KAME_GA_DEBUG_LOG('bundle_click', {
          species: _skStr(sName), bundle_tier: tier,
          equipment_key: _skStr(species && species.equipmentKey),
          estimated_price: price, product_count: count,
        });
      }
    });
  });

  if (typeof gtag === 'function') {
    var essentialPicks = generateKitByTier(species.equipmentKey, 'budget');
    gtag('event', 'starter_kit_shown', {
      species_name:     _skStr(species.name),
      species:          _skStr(species.name),
      equipment_key:    _skStr(species.equipmentKey),
      card_count:       essentialPicks.length,
      page_path:        _skPagePath(),
      affiliate_platform: 'amazon',
      route:            _skRoute(),
      source_page:      _srcPage,
    });
    window.KAME_GA_DEBUG_LOG('starter_kit_shown', {
      species: _skStr(species.name), equipment_key: _skStr(species.equipmentKey),
      page_path: _skPagePath(),
    });

    // Phase 20-E: bundle_view — fired once on kit mount
    var _bvBudget = calcBundlePriceRange(generateKitByTier(species.equipmentKey, 'budget'));
    var _bvStd    = calcBundlePriceRange(generateKitByTier(species.equipmentKey, 'standard'));
    var _bvPrem   = calcBundlePriceRange(generateKitByTier(species.equipmentKey, 'premium'));
    gtag('event', 'bundle_view', {
      species:              _skStr(species.name),
      equipment_key:        _skStr(species.equipmentKey),
      bundle_tier:          'all',
      budget_price_low:     _bvBudget.low,
      standard_price_low:   _bvStd.low,
      premium_price_low:    _bvPrem.low,
      page_path:            _skPagePath(),
      route:                _skRoute(),
      source_page:      _srcPage,
    });
    window.KAME_GA_DEBUG_LOG('bundle_view', {
      species: _skStr(species.name), equipment_key: _skStr(species.equipmentKey),
      budget_price_low: _bvBudget.low, standard_price_low: _bvStd.low,
    });
  }

  // クリックトラッキング
  root.querySelectorAll('.sk-card-btn[href]').forEach(function(a) {
    a.addEventListener('click', function() {
      if (typeof gtag === 'function') {
        // 既存イベント（維持）
        var _clickMeta = (_tabCtrl && _tabCtrl.getMeta) ? _tabCtrl.getMeta() : {};
        // Fix E: _provider/_mode を最初に宣言（参照前に定義）
        var _provider = a.dataset.provider || 'amazon';
        var _mode = a.dataset.mode || (_provider === 'amazon' ? 'affiliate' : 'search');
        gtag('event', 'starter_kit_click', {
          species_name:       _skStr(a.dataset.species),
          species:            _skStr(a.dataset.species),
          category:           _skStr(a.dataset.cat),
          product_category:   _skStr(a.dataset.cat),
          display_category:   a.dataset.displayCat || _skDisplayCat(a.dataset.cat),
          asin:               a.dataset.asin       || null,
          selected_tier:      _skStr(a.dataset.tier),
          tab_type:           _clickMeta.tab_type  || 'unknown',
          equipment_key:      _skStr(a.dataset.equipmentKey),
          product_id:         _skStr(a.dataset.productId),
          page_path:          _skPagePath(),
          affiliate_platform: _provider || 'amazon',
          route:              _skRoute(),
          source_page:      _srcPage,
        });
        // 既存イベント（維持）
        gtag('event', 'starter_kit_cta_click', {
          species:            _skStr(a.dataset.species),
          category:           _skStr(a.dataset.cat),
          product_category:   _skStr(a.dataset.cat),
          display_category:   a.dataset.displayCat || _skDisplayCat(a.dataset.cat),
          asin:               a.dataset.asin       || null,
          selected_tier:      _skStr(a.dataset.tier),
          tab_type:           _clickMeta.tab_type  || 'unknown',
          equipment_key:      _skStr(a.dataset.equipmentKey),
          product_id:         _skStr(a.dataset.productId),
          click_url:          a.dataset.clickUrl   || a.href,
          page_path:          _skPagePath(),
          affiliate_platform: _provider || 'amazon',
          route:              _skRoute(),
          source_page:      _srcPage,
        });
        // Phase 28-C: 統一affiliate_clickイベント（canonical schema、amazon_outbound_clickとの二重発火を解消）
        gtag('event', 'affiliate_click', {
          provider:       _provider,
          location:       _affLoc,
          category:       _skStr(a.dataset.cat) || 'unknown',
          product_id:     _skStr(a.dataset.productId) || a.dataset.asin || '',
          species_slug:   _skStr(a.dataset.species),
          tier:           _skStr(a.dataset.tier),
        });
        // Debug log: 1 entry per click (summary)
        window.KAME_GA_DEBUG_LOG('starter_kit_click', {
          species: _skStr(a.dataset.species),
          category: _skStr(a.dataset.cat),
          display_category: a.dataset.displayCat || _skDisplayCat(a.dataset.cat),
          asin: a.dataset.asin || null,
          selected_tier: _skStr(a.dataset.tier),
          tab_type: (_tabCtrl && _tabCtrl.getMeta) ? (_tabCtrl.getMeta().tab_type || 'unknown') : 'unknown',
          product_id: _skStr(a.dataset.productId),
          page_path: _skPagePath(),
          affiliate_platform: 'amazon',
        });
      }
    });
  });
}

// 後方互換 alias
function generateStarterKit(equipmentKey) {
  return generateKitByTier(equipmentKey, 'budget');
}
function generateStarterKitForEquipmentKey(equipmentKey) {
  return generateKitByTier(equipmentKey, 'budget');
}
function renderStarterKitHtml(picks, speciesName, equipmentKey) {
  // V1後方互換（単一tierリスト表示）
  if (!picks || !picks.length) return '';
  var heading = speciesName ? (speciesName + 'のおすすめ飼育セット') : 'おすすめ飼育セット';
  var cards = picks.map(function(item) {
    return renderSkCard(item, speciesName, equipmentKey);
  }).join('');
  return '<section class="sk-section" aria-label="' + heading + '">' +
    '<div class="sk-inner">' +
      '<h2 class="sk-heading-main">' + heading + '</h2>' +
      '<div class="sk-scroll">' + cards + '</div>' +
      '<p class="sk-disclaimer">※Amazonアソシエイトリンクを含みます</p>' +
    '</div>' +
  '</section>';
}

