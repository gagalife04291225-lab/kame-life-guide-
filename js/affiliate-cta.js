/**
 * Kame Life Guide — Affiliate CTA Enhancer
 * Phase 7-D-2: benefit-driven copy + GA4 tracking
 * Phase 7-D-3: +placement metadata
 */
'use strict';

(function () {

  function getCurrentSlug() {
    var canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      var m = canonical.href.match(/species\/([^/]+)\.html/);
      if (m) return m[1];
    }
    var pm = window.location.pathname.match(/species\/([^/]+)\.html/);
    return pm ? pm[1] : null;
  }

  function getAmazonLabel(href) {
    if (href && href.indexOf('/s?k=') !== -1) return '今日の価格を見る';
    return 'Amazonで詳細を見る';
  }

  /* ── placement detection ─────────────────────────── */
  function getPlacement(el) {
    // walk ancestors for known containers
    var node = el.parentElement;
    while (node && node !== document.body) {
      var cls = node.className || '';
      var id  = node.id || '';
      if (id === 'starter-kit-root' || cls.indexOf('sk-') !== -1)
        return 'starterkit';
      if (cls.indexOf('cmp-card') !== -1 || cls.indexOf('cmp-section') !== -1)
        return 'comparison';
      if (id === 'sticky-diagnosis-cta')
        return 'sticky_cta';
      if (cls.indexOf('gear-card') !== -1 || cls.indexOf('gear-cards') !== -1)
        return 'inline_product';
      if (cls.indexOf('result') !== -1 || id.indexOf('result') !== -1)
        return 'result_page';
      node = node.parentElement;
    }
    return 'unknown';
  }

  /* ── GA4 helper ───────────────────────────────────── */
  function fireAffiliateEvent(slug, labelText, productId, href, placement) {
    if (typeof gtag !== 'function') return;
    gtag('event', 'affiliate_cta_click', {
      species:     slug       || null,
      cta_label:   labelText  || null,
      product_id:  productId  || null,
      destination: href       || null,
      placement:   placement  || 'unknown',
    });
  }

  /* ── patch btn-amz ────────────────────────────────── */
  function patchAmazonButtons(slug) {
    var btns = document.querySelectorAll('a.btn-amz[href]');
    btns.forEach(function (a) {
      var href = a.getAttribute('href');
      if (a.textContent.trim() === 'Amazonで見る' ||
          a.textContent.trim() === 'Amazonで探す') {
        a.textContent = getAmazonLabel(href);
      }
      if (!a.dataset.affTracked) {
        a.dataset.affTracked = '1';
        a.addEventListener('click', function () {
          fireAffiliateEvent(
            slug,
            a.textContent.trim(),
            a.dataset.productId || a.dataset.asin || null,
            href,
            getPlacement(a)
          );
        });
      }
    });
  }

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
