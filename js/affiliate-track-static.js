/*
 * affiliate-track-static.js
 * best10 / review ページ用のアフィリエイトクリック計測。
 * 既存の canonical affiliate_click スキーマ（js/starter-kit.js / js/affiliate-cta.js）を
 * 100%流用する。新規イベント名・独自パラメータは作成しない。
 *
 * canonical schema:
 *   provider / location / category / product_id / species_slug / tier
 *
 * - クリック時のみ送信（イベント委譲・capture不使用）
 * - 1クリック1イベント（アンカー単位で発火、重複なし）
 * - リンク遷移は阻害しない（preventDefault しない・同期処理のみ）
 */
(function () {
  'use strict';

  // ページ種別 → canonical location
  function pageLocation() {
    var p = (window.location && window.location.pathname) || '';
    if (p.indexOf('-review') !== -1) return 'review_page';
    if (p.indexOf('-best10') !== -1) return 'best10_page';
    return 'best10_page';
  }

  // ファイル名先頭（food-best10 → food, uvb-light-review → uvb-light）→ category
  function pageCategory() {
    var p = (window.location && window.location.pathname) || '';
    var file = p.split('/').pop() || '';
    var m = file.replace(/\.html$/, '').replace(/-(best10|review)$/, '');
    return m || 'unknown';
  }

  // href から provider を判定
  function providerOf(href) {
    if (!href) return null;
    if (href.indexOf('amazon.co.jp') !== -1 || href.indexOf('tag=kamelife09-22') !== -1) return 'amazon';
    if (href.indexOf('rakuten') !== -1) return 'rakuten';
    return null;
  }

  // Amazon の href から ASIN（/dp/XXXX）を抽出。検索リンク(/s?k=)は空
  function asinOf(href, el) {
    if (el && el.getAttribute && el.getAttribute('data-asin')) {
      return el.getAttribute('data-asin').trim();
    }
    var m = href && href.match(/\/dp\/([A-Z0-9]{10})/);
    return m ? m[1] : '';
  }

  var LOC = pageLocation();
  var CAT = pageCategory();

  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var provider = providerOf(href);
    if (!provider) return;               // アフィリンク以外は無視
    if (typeof gtag !== 'function') return;

    gtag('event', 'affiliate_click', {
      provider:     provider,
      location:     LOC,
      category:     CAT,
      product_id:   provider === 'amazon' ? asinOf(href, a) : '',
      species_slug: '',
      tier:         '',
    });

    if (typeof window.KAME_GA_DEBUG_LOG === 'function') {
      window.KAME_GA_DEBUG_LOG('affiliate_click', {
        provider: provider, location: LOC, category: CAT,
        product_id: provider === 'amazon' ? asinOf(href, a) : '',
        page_path: (window.location && window.location.pathname) || 'unknown',
      });
    }
  }, false); // capture=false: 1クリック1回、遷移を阻害しない
})();
