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
  budget:   'まずは最低限で始める',
  standard: '一番おすすめの構成を見る',
  premium:  '理想の飼育環境を作る',
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
        '<div class="sk-cost-sub">必須セット合計</div>' +
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
 * Price Anchor HTML 生成（タブパネル内）
 * 各tierのpicksから合計推定額と「まとめ割引」を表示
 */
function renderPriceAnchor(picks, tier) {
  if (!picks || !picks.length) return '';

  // 合計（中央値で推定）
  var totalLow = 0, totalHigh = 0;
  picks.forEach(function(item) {
    var r = parsePriceRange(item.product.priceRange);
    totalLow  += r.low;
    totalHigh += r.high;
  });
  if (!totalLow && !totalHigh) return '';

  var midpoint = Math.round((totalLow + totalHigh) / 2 / 100) * 100;
  if (!midpoint) midpoint = totalLow || totalHigh;

  // tier別 割引率（あくまで目安表示）
  var discountRate = tier === 'premium' ? 0.10 : tier === 'budget' ? 0.00 : 0.12;
  var kitEstimate  = Math.round(midpoint * (1 - discountRate) / 100) * 100;
  var saving       = midpoint - kitEstimate;

  var indiv = '約' + fmtYen(midpoint);
  var kit   = '約' + fmtYen(kitEstimate);
  var save  = saving > 0 ? '約' + fmtYen(saving) + 'お得' : '—';

  return '<div class="sk-price-anchor" aria-label="価格目安">' +
    '<div class="sk-pa-row sk-pa-indiv">' +
      '<span class="sk-pa-label">個別にそろえると</span>' +
      '<span class="sk-pa-val">' + indiv + '</span>' +
    '</div>' +
    '<div class="sk-pa-row sk-pa-kit">' +
      '<span class="sk-pa-label">スターター構成目安</span>' +
      '<span class="sk-pa-val sk-pa-val--kit">' + kit + '</span>' +
    '</div>' +
    (saving > 0
      ? '<div class="sk-pa-row sk-pa-save">' +
          '<span class="sk-pa-save-badge">差額目安</span>' +
          '<span class="sk-pa-save-val">' + save + '</span>' +
        '</div>'
      : '') +
    '<p class="sk-pa-note">※各商品の参考価格帯から算出した目安です。Amazon実売価格は変動します。</p>' +
  '</div>';
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
  var btn = hasUrl
    ? '<a class="sk-card-btn" href="' + p.affiliateUrl + '" target="_blank" rel="noopener noreferrer sponsored"' +
      ' data-cat="' + p.category + '" data-species="' + (speciesName||'') + '"' +
      ' data-asin="' + (p.asin||'') + '" data-tier="' + (item.tier||'standard') + '"' +
      ' data-equipment-key="' + (equipmentKey||'') + '" data-product-id="' + p.id + '"' +
      ' data-click-url="' + p.affiliateUrl + '">' + tierCtaText + '</a>'
    : '<span class="sk-card-btn sk-card-btn--soon">' + catLabel + 'は選定中</span>';

  var cardTierCls = item.tier === 'standard' ? ' sk-card--standard'
                 : item.tier === 'premium'  ? ' sk-card--premium'
                 : ' sk-card--budget';
  return '<div class="sk-card' + cardTierCls + '">' +
    '<div class="sk-cat-label">' + catLabel + '</div>' +
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
    (tabDef.id !== 'essential' ? ' hidden' : '') + '>' +
    '<p class="sk-tab-desc">' + tabDef.icon + ' ' + tabDef.desc + '</p>' +
    renderPriceAnchor(picks, tabDef.tiers[0]) +
    '<div class="sk-scroll">' + cards + '</div>' +
  '</div>';
}

/**
 * メインHTML生成
 */
function renderStarterKitHtmlV2(equipmentKey, opts) {
  var speciesName = opts.name || '';
  var heading = speciesName ? (speciesName + 'の飼育セットガイド') : '飼育セットガイド';

  // 各タブのpicks生成
  var tabData = SK_TABS.map(function(tab) {
    var picks = generateKitByTier(equipmentKey, tab.tiers[0]);
    return { tab: tab, picks: picks };
  });

  // Cost Box は必須セット(budget)のpicksで計算
  var essentialPicks = tabData[0].picks;
  var costBoxHtml = renderCostBox(essentialPicks, opts);

  // タブボタン
  var tabBtns = SK_TABS.map(function(tab, i) {
    var extraCls = (tab.id === 'comfort') ? ' sk-tab-btn--recommended' : '';
    return '<button class="sk-tab-btn' + (i === 0 ? ' sk-tab-btn--active' : '') + extraCls + '"' +
      ' data-target="sk-panel-' + tab.id + '"' +
      ' role="tab" aria-selected="' + (i === 0 ? 'true' : 'false') + '">' +
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
      '<div class="sk-tabs" role="tablist">' + tabBtns + '</div>' +
      panels +
      '<p class="sk-hint">💡 迷ったら <strong>推奨セット</strong> から始めるのがおすすめです</p>' +
      '<p class="sk-disclaimer">※Amazonアソシエイトリンクを含みます　価格は目安です（変動あり）</p>' +
    '</div>' +
  '</section>';
}

/**
 * タブ切り替えイベント設定
 */
function initSkTabs(root, species) {
  var btns = root.querySelectorAll('.sk-tab-btn');
  var panels = root.querySelectorAll('.sk-tab-panel');
  // tab_id → tab_type / selected_tier マップ
  var TAB_META = {
    'sk-panel-essential': { tab_type: 'essential', selected_tier: 'budget' },
    'sk-panel-comfort':   { tab_type: 'comfort',   selected_tier: 'standard' },
    'sk-panel-advanced':  { tab_type: 'advanced',  selected_tier: 'premium' },
  };
  btns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var target = btn.dataset.target;
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
          tab_id:        target,
          tab_type:      meta.tab_type      || '',
          selected_tier: meta.selected_tier || '',
          species_name:  (species && species.name)         || '',
          species:       (species && species.name)         || '',
          equipment_key: (species && species.equipmentKey) || '',
        });
        // 追加イベント
        gtag('event', 'starter_kit_tier_click', {
          tab_id:        target,
          tab_type:      meta.tab_type      || '',
          selected_tier: meta.selected_tier || '',
          species:       (species && species.name)         || '',
          equipment_key: (species && species.equipmentKey) || '',
        });
      }
    });
  });
}

/**
 * DOMにマウント（後方互換維持 + V2拡張）
 * @param {{ equipmentKey, name, difficulty, lifespan, monthlyCost }} species
 * @param {string} [mountId]
 */
function mountStarterKit(species, mountId) {
  var rootId = mountId || 'starter-kit-root';
  var root = document.getElementById(rootId);
  if (!root) return;
  if (!species || !species.equipmentKey) { root.style.display = 'none'; return; }

  var html = renderStarterKitHtmlV2(species.equipmentKey, species);
  if (!html) { root.style.display = 'none'; return; }

  root.innerHTML = html;
  initSkTabs(root, species);

  if (typeof gtag === 'function') {
    var essentialPicks = generateKitByTier(species.equipmentKey, 'budget');
    gtag('event', 'starter_kit_shown', {
      species_name:  species.name || '',
      species:       species.name || '',
      equipment_key: species.equipmentKey,
      card_count:    essentialPicks.length,
    });
  }

  // クリックトラッキング
  root.querySelectorAll('.sk-card-btn[href]').forEach(function(a) {
    a.addEventListener('click', function() {
      if (typeof gtag === 'function') {
        // 既存イベント（維持）
        gtag('event', 'starter_kit_click', {
          species_name:  a.dataset.species,
          species:       a.dataset.species,
          category:      a.dataset.cat,
          asin:          a.dataset.asin,
          selected_tier: a.dataset.tier,
          equipment_key: a.dataset.equipmentKey,
          product_id:    a.dataset.productId,
        });
        // 既存イベント（維持）
        gtag('event', 'starter_kit_cta_click', {
          species:       a.dataset.species,
          category:      a.dataset.cat,
          asin:          a.dataset.asin,
          selected_tier: a.dataset.tier,
          equipment_key: a.dataset.equipmentKey,
          product_id:    a.dataset.productId,
          click_url:     a.dataset.clickUrl || a.href,
        });
        // Phase 7-C Step 3-A: Amazon外部遷移統一イベント
        if (isAmazonUrl(a.dataset.clickUrl || a.href)) {
          gtag('event', 'amazon_outbound_click', {
            source:        'starter_kit',
            species:       a.dataset.species       || '',
            species_slug:  '',
            equipment_key: a.dataset.equipmentKey  || '',
            category:      a.dataset.cat           || '',
            product_id:    a.dataset.productId     || '',
            asin:          a.dataset.asin          || '',
            selected_tier: a.dataset.tier          || '',
            click_url:     a.dataset.clickUrl      || a.href,
          });
        }
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
