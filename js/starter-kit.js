/**
 * Kame Life Guide - Starter Kit Engine (species page用)
 * Phase 6-C Task 3
 *
 * 依存: data/products.js（PRODUCTS, EQUIPMENT_MAP, getTierProduct）
 *
 * 使い方（species page）:
 *   <script src="../data/products.js"></script>
 *   <script src="../js/starter-kit.js"></script>
 *   <div id="starter-kit-root"></div>
 *   <script>mountStarterKit({ equipmentKey: 'tortoise_dry_small', name: 'ロシアリクガメ' });</script>
 */

'use strict';

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
 * equipmentKeyからカード5枚以内を選定（species page版）
 * EQUIPMENT_MAP v2（オブジェクト形式）対応
 */
function generateStarterKit(equipmentKey) {
  if (typeof PRODUCTS === 'undefined' || typeof EQUIPMENT_MAP === 'undefined') return [];
  if (!EQUIPMENT_MAP[equipmentKey]) return [];

  var isV2 = !Array.isArray(EQUIPMENT_MAP[equipmentKey]);
  var result = [], seen = {};
  var TIER_PREF = ['standard', 'budget', 'premium'];

  SK_CAT_ORDER.forEach(function(cat) {
    if (result.length >= 5) return;

    var pick = null, pickTier = null;

    if (isV2) {
      for (var i = 0; i < TIER_PREF.length; i++) {
        var p = (typeof getTierProduct === 'function')
          ? getTierProduct(equipmentKey, cat, TIER_PREF[i]) : null;
        if (!p || seen[p.id]) continue;
        if (p.affiliateUrl && p.affiliateUrl !== '#') {
          pick = p; pickTier = TIER_PREF[i]; break;
        }
        if (!pick) { pick = p; pickTier = TIER_PREF[i]; }
      }
    } else {
      // v1 後方互換
      var ids = EQUIPMENT_MAP[equipmentKey];
      var items = ids.map(function(id) { return PRODUCTS[id]; }).filter(function(p) {
        return p && p.category === cat && !seen[p.id];
      });
      if (items.length) {
        var withUrl = items.filter(function(p) { return p.affiliateUrl && p.affiliateUrl !== '#'; });
        var pool = withUrl.length ? withUrl : items;
        pick = pool.reduce(function(a, b) { return (b.rating||0) > (a.rating||0) ? b : a; });
        pickTier = pick ? (pick.tier || 'standard') : null;
      }
    }

    if (!pick) return;
    seen[pick.id] = true;
    result.push({ cat: cat, tier: pickTier, product: pick });
  });

  return result;
}

/**
 * カードHTMLを生成
 * @param {Array} picks - generateStarterKit の戻り値
 * @param {string} speciesName - 種名
 * @param {string} equipmentKey - EQUIPMENT_MAPキー（GA4用）
 */
function renderStarterKitHtml(picks, speciesName, equipmentKey) {
  if (!picks || !picks.length) return '';

  var heading = speciesName ? (speciesName + 'のおすすめ飼育セット') : 'おすすめ飼育セット';

  var cards = picks.map(function(item) {
    var p = item.product;
    var catLabel = SK_CAT_LABELS_PAGE[item.cat] || item.cat;
    var tierLabel = SK_TIER_LABEL_PAGE[item.tier] || 'まずはこれ';
    var tierCls = item.tier === 'budget' ? 'sk-badge-budget'
                : item.tier === 'premium' ? 'sk-badge-premium'
                : 'sk-badge-standard';
    var hasUrl = p.affiliateUrl && p.affiliateUrl !== '#';
    var btn = hasUrl
      ? '<a class="sk-card-btn" href="' + p.affiliateUrl + '" target="_blank" rel="noopener noreferrer sponsored"' +
        ' data-cat="' + p.category + '" data-species="' + (speciesName||'') + '"' +
        ' data-asin="' + (p.asin||'') + '"' +
        ' data-tier="' + (item.tier||'standard') + '"' +
        ' data-equipment-key="' + (equipmentKey||'') + '"' +
        ' data-product-id="' + p.id + '">Amazonで詳細を見る</a>'
      : '<span class="sk-card-btn sk-card-btn--soon">おすすめ商品選定中</span>';

    return '<div class="sk-card">' +
      '<div class="sk-cat-label">' + catLabel + '</div>' +
      '<span class="sk-card-badge ' + tierCls + '">' + tierLabel + '</span>' +
      '<div class="sk-card-name">' + p.name + '</div>' +
      (p.rating ? '<div class="sk-card-rating">' + skStarRating(p.rating) + '</div>' : '') +
      '<div class="sk-card-price">' + p.priceRange + '</div>' +
      (p.why ? '<div class="sk-card-why">' + p.why + '</div>' : '') +
      btn +
    '</div>';
  }).join('');

  return '<section class="sk-section" aria-label="' + heading + '">' +
    '<div class="sk-inner">' +
      '<h2 class="sk-heading-main">' + heading + '</h2>' +
      '<div class="sk-scroll">' + cards + '</div>' +
      '<p class="sk-disclaimer">※Amazonアソシエイトリンクを含みます</p>' +
    '</div>' +
  '</section>';
}

/**
 * DOMに直接マウントするショートカット
 * @param {{ equipmentKey: string, name: string }} species
 * @param {string} [mountId]
 */
function mountStarterKit(species, mountId) {
  var rootId = mountId || 'starter-kit-root';
  var root = document.getElementById(rootId);
  if (!root) return;
  if (!species || !species.equipmentKey) { root.style.display = 'none'; return; }

  var picks = generateStarterKit(species.equipmentKey);
  var html  = renderStarterKitHtml(picks, species.name || '', species.equipmentKey || '');
  if (!html) { root.style.display = 'none'; return; }

  root.innerHTML = html;

  // GA4（任意：gtag存在時のみ）
  if (typeof gtag === 'function') {
    gtag('event', 'starter_kit_shown', {
      species_name:  species.name || '',
      equipment_key: species.equipmentKey,
      card_count:    picks.length,
    });
  }

  // クリックトラッキング
  root.querySelectorAll('.sk-card-btn[href]').forEach(function(a) {
    a.addEventListener('click', function() {
      if (typeof gtag === 'function') {
        gtag('event', 'starter_kit_click', {
          species_name:  a.dataset.species,
          category:      a.dataset.cat,
          asin:          a.dataset.asin,
          selected_tier:  a.dataset.tier,
          equipment_key:  a.dataset.equipmentKey,
          product_id:     a.dataset.productId,
        });
      }
    });
  });
}

/**
 * generateStarterKit の alias（後方互換・外部呼び出し用）
 * 既存の generateStarterKit(equipmentKey) を変更せずに提供する。
 * @param {string} equipmentKey
 * @returns {Array}
 */
function generateStarterKitForEquipmentKey(equipmentKey) {
  return generateStarterKit(equipmentKey);
}
