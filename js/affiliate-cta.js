/**
 * Kame Life Guide — Affiliate CTA Enhancer
 * Phase 7-D-2: benefit-driven copy + GA4 tracking
 *
 * Usage: <script src="../js/affiliate-cta.js"></script>
 * Place before </body> on species pages.
 * No per-page config required.
 */
'use strict';

(function () {

  /* ── slug from canonical ──────────────────────────── */
  function getCurrentSlug() {
    var canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      var m = canonical.href.match(/species\/([^/]+)\.html/);
      if (m) return m[1];
    }
    return window.location.pathname.match(/species\/([^/]+)\.html/) ?
      window.location.pathname.match(/species\/([^/]+)\.html/)[1] : null;
  }

  /* ── CTA text by URL type ─────────────────────────── */
  function getAmazonLabel(href) {
    // search URL (s?k=) → category browse
    if (href && href.indexOf('/s?k=') !== -1) return '今日の価格を見る';
    // product URL (/dp/) → specific product
    return 'Amazonで詳細を見る';
  }

  /* ── GA4 helper ───────────────────────────────────── */
  function fireAffiliateEvent(slug, labelText, productId, href) {
    if (typeof gtag !== 'function') return;
    gtag('event', 'affiliate_cta_click', {
      species:    slug       || null,
      cta_label:  labelText  || null,
      product_id: productId  || null,
      destination: href      || null,
    });
  }

  /* ── patch btn-amz ────────────────────────────────── */
  function patchAmazonButtons(slug) {
    var btns = document.querySelectorAll('a.btn-amz[href]');
    btns.forEach(function (a) {
      var href = a.getAttribute('href');
      // skip if already improved (not the weak default)
      if (a.textContent.trim() === 'Amazonで見る' ||
          a.textContent.trim() === 'Amazonで探す') {
        a.textContent = getAmazonLabel(href);
      }
      // GA4 click tracking (idempotent via flag)
      if (!a.dataset.affTracked) {
        a.dataset.affTracked = '1';
        a.addEventListener('click', function () {
          fireAffiliateEvent(
            slug,
            a.textContent.trim(),
            a.dataset.productId || a.dataset.asin || null,
            href
          );
        });
      }
    });
  }

  /* ── run ──────────────────────────────────────────── */
  function run() {
    var slug = getCurrentSlug();
    patchAmazonButtons(slug);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

})();
