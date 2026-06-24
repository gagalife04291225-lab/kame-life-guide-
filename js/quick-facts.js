/**
 * Kame Life Guide - Quick Facts Engine
 * Phase 7-C Step 1-A
 *
 * 使い方（species page, Hero直下）:
 *   <div id="quick-facts-root"></div>
 *   <script src="../js/quick-facts.js"></script>
 *   <script>
 *     mountQuickFacts({
 *       equipmentKey: 'tortoise_dry_small',
 *       name:         'ロシアリクガメ',
 *       difficulty:   '入門〜中級',
 *       lifespan:     '40〜80年',
 *       monthlyCost:  '¥1,000〜3,000',   // 任意
 *     });
 *   </script>
 */

'use strict';

/* ────────────────────────────────────────────────
   1. フォールバックテーブル
   ──────────────────────────────────────────────── */

/** equipmentKey → 飼育タイプ表示名 */
var QF_TYPE_LABEL = {
  tortoise_dry_small:  'リクガメ（乾燥系・小〜中型）',
  tortoise_dry_large:  'リクガメ（乾燥系・大型）',
  tortoise_forest:     'リクガメ（森林系）',
  semi_aquatic_small:  '半水棲ガメ（小型）',
  semi_aquatic_medium: '半水棲ガメ（中型）',
  fully_aquatic:       '完全水棲ガメ',
  japanese_pond:       '日本産水棲ガメ',
  box_turtle:          'ハコガメ（水陸両用）',
};

/** equipmentKey → 臭いレベル（5段階: 1=ほぼなし … 5=強い） */
var QF_SMELL = {
  tortoise_dry_small:  { level: 1, label: 'ほぼなし',     note: '乾燥系・フン処理が楽' },
  tortoise_dry_large:  { level: 2, label: 'わずかにあり', note: 'フンの量多め・換気推奨' },
  tortoise_forest:     { level: 2, label: 'わずかにあり', note: '高湿度床材のカビに注意' },
  semi_aquatic_small:  { level: 3, label: 'やや強め',     note: '水の臭い・週1換水で緩和' },
  semi_aquatic_medium: { level: 4, label: '強め',         note: '水量多い・外部フィルター必須' },
  fully_aquatic:       { level: 4, label: '強め',         note: '大容量フィルター推奨' },
  japanese_pond:       { level: 3, label: 'やや強め',     note: '水替え頻度で大きく変わる' },
  box_turtle:          { level: 2, label: 'わずかにあり', note: '湿り床材の管理がポイント' },
};

/** equipmentKey → 月額維持費目安（フォールバック） */
var QF_MONTHLY = {
  tortoise_dry_small:  '¥1,000〜3,000',
  tortoise_dry_large:  '¥2,000〜5,000',
  tortoise_forest:     '¥1,500〜4,000',
  semi_aquatic_small:  '¥1,000〜2,500',
  semi_aquatic_medium: '¥1,500〜3,500',
  fully_aquatic:       '¥2,000〜5,000',
  japanese_pond:       '¥1,000〜2,500',
  box_turtle:          '¥1,500〜3,000',
};

/** 難易度文字列 → ☆バー（入門/中級/上級の3区分） */
function qfDiffBadge(difficulty) {
  if (!difficulty) return { stars: '—', cls: '' };
  var d = difficulty + '';
  if (/入門/.test(d))       return { stars: '★☆☆', cls: 'qf-diff--easy',  label: '入門' };
  if (/上級/.test(d))       return { stars: '★★★', cls: 'qf-diff--hard',  label: '上級' };
  return                           { stars: '★★☆', cls: 'qf-diff--mid',   label: '中級' };
}

/** 臭いレベル → 絵文字バー */
function qfSmellBar(level) {
  var filled = '🟤'.repeat(level);
  var empty  = '⬜'.repeat(5 - level);
  return filled + empty;
}

/* ────────────────────────────────────────────────
   2. Quick Facts ブロック HTML 生成
   ──────────────────────────────────────────────── */
function renderQuickFacts(opts) {
  var key        = opts.equipmentKey || '';
  var difficulty = opts.difficulty   || '';
  var lifespan   = opts.lifespan     || '';
  var monthly    = opts.monthlyCost  || QF_MONTHLY[key] || '¥1,000〜5,000';
  var typeLabel  = QF_TYPE_LABEL[key] || key || '—';
  var smellData  = QF_SMELL[key]  || { level: 3, label: 'やや強め', note: '換気・清掃で改善' };
  var diff       = qfDiffBadge(difficulty);

  // 初期費用: products.jsがあれば計算、なければキー別概算
  var initCostText = '要確認';
  if (typeof PRODUCTS !== 'undefined' && typeof EQUIPMENT_MAP !== 'undefined' && EQUIPMENT_MAP[key]) {
    var SK_CAT_ORDER_QF = [
      'enclosure','lighting_uvb','lighting_basking',
      'heating','filter','substrate','thermometer',
      'shelter','food','supplements'
    ];
    var totalLow = 0, totalHigh = 0, counted = 0;
    SK_CAT_ORDER_QF.forEach(function(cat) {
      var id = (EQUIPMENT_MAP[key][cat] || {}).budget;
      if (!id || !PRODUCTS[id]) return;
      var pr = PRODUCTS[id].priceRange || '';
      var s  = pr.replace(/[¥,]/g, '');
      var m  = s.match(/(\d+)[^\d]+(\d+)/);
      if (m) { totalLow += parseInt(m[1],10); totalHigh += parseInt(m[2],10); counted++; }
    });
    if (counted >= 3) {
      initCostText = '¥' + totalLow.toLocaleString('ja-JP') + '〜¥' + totalHigh.toLocaleString('ja-JP');
    }
  }

  // 寿命
  var lifespanText = lifespan ? lifespan : '—';

  // アイテム定義
  var items = [
    {
      icon: '🎯',
      label: '飼育難易度',
      value: '<span class="qf-diff ' + diff.cls + '">' + diff.stars + ' ' + (diff.label || difficulty) + '</span>',
    },
    {
      icon: '💰',
      label: '初期費用目安',
      value: '<span class="qf-cost">' + initCostText + '</span>',
      sub: '機材セット合計（目安）',
    },
    {
      icon: '📅',
      label: '月額維持費目安',
      value: '<span class="qf-cost">' + monthly + '</span>',
      sub: '電気代・フード等',
    },
    {
      icon: '💨',
      label: '臭い',
      value: '<span class="qf-smell">' + qfSmellBar(smellData.level) + '</span>',
      sub: smellData.label + '：' + smellData.note,
    },
    {
      icon: '⏳',
      label: '寿命目安',
      value: '<span class="qf-lifespan">' + lifespanText + '</span>',
    },
    {
      icon: '🏠',
      label: '飼育タイプ',
      value: '<span class="qf-type">' + typeLabel + '</span>',
    },
  ];

  var cards = items.map(function(item) {
    return '<div class="qf-card">' +
      '<div class="qf-card-icon">' + item.icon + '</div>' +
      '<div class="qf-card-body">' +
        '<div class="qf-card-label">' + item.label + '</div>' +
        '<div class="qf-card-value">' + item.value + '</div>' +
        (item.sub ? '<div class="qf-card-sub">' + item.sub + '</div>' : '') +
      '</div>' +
    '</div>';
  }).join('');

  return '<div class="qf-block" id="quick-facts">' +
    '<div class="qf-inner">' +
      '<div class="qf-heading-row">' +
        '<span class="qf-heading-text">Quick Facts</span>' +
        '<a class="qf-cta-link" href="#starter-kit-root">' +
          'この亀を今日から飼えるセットを見る →' +
        '</a>' +
      '</div>' +
      '<div class="qf-grid">' + cards + '</div>' +
      '<p class="qf-note">※数値はすべて目安です。個体・環境・地域の電気代によって異なります。</p>' +
    '</div>' +
  '</div>';
}

/* ────────────────────────────────────────────────
   3. Sticky CTA 生成
   ──────────────────────────────────────────────── */
function renderStickyCTA(opts) {
  var isEasy = /入門/.test(opts.difficulty || '');
  var ctaText = isEasy
    ? '初心者向けに全部選んだ飼育セットを見る'
    : 'この亀を今日から飼えるセットを見る';

  return '<div class="qf-sticky-cta" id="qf-sticky-cta" aria-label="飼育セットへのリンク">' +
    '<a class="qf-sticky-btn" href="#starter-kit-root">' +
      '<span class="qf-sticky-icon">🐢</span> ' +
      ctaText +
    '</a>' +
    '<button class="qf-sticky-close" aria-label="閉じる" onclick="' +
      'document.getElementById(\'qf-sticky-cta\').style.display=\'none\';' +
    '">×</button>' +
  '</div>';
}

/* ────────────────────────────────────────────────
   4. Sticky CTA 表示制御
   ──────────────────────────────────────────────── */
function initStickyCTA() {
  var el = document.getElementById('qf-sticky-cta');
  if (!el) return;

  function updateVisibility() {
    var scrollY   = window.scrollY || window.pageYOffset;
    var docH      = document.documentElement.scrollHeight;
    var winH      = window.innerHeight;
    var atBottom  = scrollY + winH >= docH - 200;  // footer付近では非表示
    var pastHero  = scrollY > 300;                  // heroスクロール後に表示

    // starter-kitが画面内にある間は非表示
    var skEl = document.getElementById('starter-kit-root');
    var inView = false;
    if (skEl) {
      var rect = skEl.getBoundingClientRect();
      inView = rect.top < winH && rect.bottom > 0;
    }

    if (pastHero && !atBottom && !inView) {
      el.classList.add('qf-sticky-visible');
    } else {
      el.classList.remove('qf-sticky-visible');
    }
  }

  window.addEventListener('scroll', updateVisibility, { passive: true });
  updateVisibility();
}

/* ────────────────────────────────────────────────
   5. mountQuickFacts（公開API）
   ──────────────────────────────────────────────── */
function mountQuickFacts(opts, mountId) {
  var rootId = mountId || 'quick-facts-root';
  var root   = document.getElementById(rootId);
  if (!root) return;

  root.innerHTML = renderQuickFacts(opts);

  // 初期費用セル: products.js ロード待ちリトライ
  // PRODUCTS / EQUIPMENT_MAP が未定義の場合、100ms×最大10回リトライして上書き
  (function retryInitCost(attempt) {
    var key = opts.equipmentKey || '';
    if (typeof PRODUCTS === 'undefined' || typeof EQUIPMENT_MAP === 'undefined' || !EQUIPMENT_MAP[key]) {
      if (attempt < 10) {
        setTimeout(function() { retryInitCost(attempt + 1); }, 150);
      }
      return; // まだ未定義 → 次回リトライ or 諦め（「要確認」のまま）
    }
    // PRODUCTS が使えるので計算
    var SK_CAT_ORDER_QF = [
      'enclosure','lighting_uvb','lighting_basking',
      'heating','filter','substrate','thermometer',
      'shelter','food','supplements'
    ];
    var totalLow = 0, totalHigh = 0, counted = 0;
    SK_CAT_ORDER_QF.forEach(function(cat) {
      var id = (EQUIPMENT_MAP[key][cat] || {}).budget;
      if (!id || !PRODUCTS[id]) return;
      var pr = PRODUCTS[id].priceRange || '';
      var s  = pr.replace(/[¥,]/g, '');
      var m  = s.match(/(\d+)[^\d]+(\d+)/);
      if (m) { totalLow += parseInt(m[1], 10); totalHigh += parseInt(m[2], 10); counted++; }
    });
    if (counted < 3) return; // 計算不十分 → 「要確認」のまま
    var costText = '¥' + totalLow.toLocaleString('ja-JP') + '〜¥' + totalHigh.toLocaleString('ja-JP');
    // DOMの初期費用セルだけを差し替え
    var costEl = root.querySelector('.qf-card:nth-child(2) .qf-card-value .qf-cost');
    if (costEl) costEl.textContent = costText;
  }(0));

  // Sticky CTAをbodyに追記（重複防止）
  if (!document.getElementById('qf-sticky-cta')) {
    var ctaEl = document.createElement('div');
    ctaEl.innerHTML = renderStickyCTA(opts);
    document.body.appendChild(ctaEl.firstChild);
    initStickyCTA();
  }
}
