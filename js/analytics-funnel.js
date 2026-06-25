/**
 * Kame Life Guide — Analytics Funnel
 * Phase 7-D-3: landing_page_view / species_page_view + placement metadata
 *
 * Usage:
 *   index.html    : <script src="js/analytics-funnel.js"></script>
 *   species pages : <script src="../js/analytics-funnel.js"></script>
 *   (already have affiliate-cta.js; this adds funnel pageview events only)
 */
'use strict';

(function () {
  if (typeof gtag !== 'function') return;

  var path = window.location.pathname;

  /* ── landing_page_view (index.html) ──────────────── */
  if (path === '/' || /\/index\.html$/.test(path) || /kame-life-guide-\/$/.test(path)) {
    if (!window._kame_landing_fired) {
      window._kame_landing_fired = true;
      gtag('event', 'landing_page_view', {
        page_path: path
      });
    }
    return;
  }

  /* ── species_page_view ───────────────────────────── */
  var speciesMatch = path.match(/species\/([^/]+)\.html/);
  if (speciesMatch && !window._kame_species_fired) {
    window._kame_species_fired = true;
    gtag('event', 'species_page_view', {
      species: speciesMatch[1]
    });
  }

})();
