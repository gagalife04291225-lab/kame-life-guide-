/* Explicit opt-in for static commerce anchors on guide/trouble pages only.
 * Does not observe setup-products/starter-kit buttons or claim purchases/revenue.
 * Untagged retailer searches are retained and distinguished by link_type.
 */
(function () {
  'use strict';
  if (window.__kameContentAffiliateTracked) return;
  window.__kameContentAffiliateTracked = true;
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[data-commerce-static="1"][href]') : null;
    if (!a || a.getAttribute('aria-disabled') === 'true') return;
    try {
      var u = new URL(a.getAttribute('href'), window.location.href);
      if (u.protocol !== 'https:') return;
      var provider, kind, productId = '';
      if (u.hostname === 'www.amazon.co.jp' || u.hostname === 'amazon.co.jp') {
        provider = 'amazon';
        var asin = u.pathname.match(/^\/(?:dp|gp\/product)\/([A-Z0-9]{10})(?:\/|$)/);
        productId = asin ? asin[1] : '';
        kind = u.searchParams.has('tag') ? (asin ? 'affiliate_product' : 'affiliate_search') : 'retailer_search';
      } else if (u.hostname === 'search.rakuten.co.jp') {
        provider = 'rakuten'; kind = 'retailer_search';
      } else if (u.hostname === 'hb.afl.rakuten.co.jp') {
        provider = 'rakuten'; kind = 'affiliate_product';
      } else return;
      if (typeof window.gtag !== 'function') return;
      window.gtag('event', kind === 'retailer_search' ? 'retailer_outbound_click' : 'affiliate_click', {
        provider: provider,
        location: window.location.pathname.indexOf('/trouble/') === 0 ? 'trouble_page' : 'guide_page',
        category: 'unknown', product_id: productId, species_slug: '', tier: '', link_type: kind
      });
    } catch (err) { /* Analytics must not block navigation. */ }
  }, false);
})();
