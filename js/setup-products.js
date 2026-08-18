/**
 * Kame Life Guide - Setup Products Renderer（ガイドページ用）
 *
 * 飼育環境イメージ図の直下にある div.setup-products[data-setup] へ、
 * 「この飼育環境を作るための用品候補」を描画する。
 *
 * 依存: data/products.js（PRODUCTS / EQUIPMENT_MAP / getRakutenSearchUrl / hasRakuten）
 *       data/setup-specs.js（SETUP_SPECS）
 *
 * 原則:
 *   - 画像内に描かれた機材と候補商品は別物（見出し下に明記）
 *   - 候補は第一候補＋条件付き代替の最大2つ。大量掲載しない
 *   - DBに適切な候補が無い必需品は、選定条件のみを表示しリンクは置かない
 */

'use strict';

(function () {
  var NEED_LABEL = { must: '必須', recommended: '推奨', optional: '任意' };
  var NEED_BG = { must: '#2f4a3c', recommended: '#b07c3f', optional: '#8a8570' };
  var CAT_LABEL = {
    enclosure: '水槽・ケージ', filter: 'フィルター', lighting_uvb: 'UVBライト',
    lighting_basking: 'バスキングライト', heating: 'ヒーター・保温', substrate: '床材',
    shelter: 'シェルター', thermometer: '温度・湿度計', water_dish: '水入れ',
    food: '餌', supplements: 'サプリメント'
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function resolveProduct(equipmentKey, cat, tier) {
    try {
      var id = EQUIPMENT_MAP[equipmentKey] && EQUIPMENT_MAP[equipmentKey][cat] && EQUIPMENT_MAP[equipmentKey][cat][tier];
      return id ? PRODUCTS[id] || null : null;
    } catch (e) { return null; }
  }

  function buyButtons(p, pos) {
    var html = '';
    // GA4計測用のdata属性（正典 affiliate_click スキーマに対応。Phase 28-C 準拠）
    var da = ' data-product-id="' + esc(p.id) + '" data-cat="' + esc(p.category) + '" data-tier="' + esc(p.tier || '') + '" data-pos="' + esc(pos || 'primary') + '"';
    if (p.affiliateUrl && p.affiliateUrl !== '#') {
      html += '<a href="' + esc(p.affiliateUrl) + '" target="_blank" rel="nofollow sponsored noopener" data-retailer="amazon"' + da + ' style="display:inline-block;font-size:.78rem;padding:4px 12px;border-radius:99px;background:#2f4a3c;color:#f4efe2;text-decoration:none;margin-right:8px;">Amazonで見る</a>';
    }
    try {
      if (p.rakutenStatus === 'available' && p.rakutenUrl) {
        html += '<a href="' + esc(p.rakutenUrl) + '" target="_blank" rel="nofollow sponsored noopener" data-retailer="rakuten"' + da + ' style="display:inline-block;font-size:.78rem;padding:4px 12px;border-radius:99px;background:#b02e2e;color:#fff;text-decoration:none;">楽天で見る</a>';
      } else if (typeof getRakutenSearchUrl === 'function' && p.rakutenStatus === 'search') {
        var u = getRakutenSearchUrl(p);
        if (u) html += '<a href="' + esc(u) + '" target="_blank" rel="nofollow sponsored noopener" data-retailer="rakuten"' + da + ' style="display:inline-block;font-size:.78rem;padding:4px 12px;border-radius:99px;background:#b02e2e;color:#fff;text-decoration:none;">楽天で探す</a>';
      }
    } catch (e) {}
    return html;
  }

  function row(catLabel, need, note, primary, alt, avoid) {
    var h = '<div style="padding:12px 0;border-top:1px solid rgba(138,133,112,.25);">';
    h += '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px;">';
    h += '<span style="font-size:.72rem;font-weight:700;padding:1px 9px;border-radius:99px;background:' + (NEED_BG[need] || '#8a8570') + ';color:#fff;">' + esc(NEED_LABEL[need] || need) + '</span>';
    h += '<span style="font-weight:700;font-size:.9rem;">' + esc(catLabel) + '</span></div>';
    if (note) h += '<div style="font-size:.8rem;opacity:.85;line-height:1.7;margin-bottom:6px;">' + esc(note) + '</div>';
    if (primary) {
      h += '<div style="font-size:.85rem;margin-bottom:6px;">候補: ' + esc(primary.name) + (primary.priceRange ? '<span style="opacity:.6;font-size:.75rem;">（' + esc(primary.priceRange) + '）</span>' : '') + '</div>';
      h += '<div>' + buyButtons(primary, 'primary') + '</div>';
    }
    if (alt && (!primary || alt.id !== primary.id)) {
      h += '<div style="font-size:.78rem;opacity:.8;margin-top:6px;">代替候補: ' + esc(alt.name) + '　' + buyButtons(alt, 'alt') + '</div>';
    }
    if (avoid) h += '<div style="font-size:.76rem;color:#a05252;margin-top:6px;">避けたい仕様: ' + esc(avoid) + '</div>';
    h += '</div>';
    return h;
  }

  function render(box, spec) {
    // noLinks: 商品候補・アフィリエイトリンクを置かないページ用（site-policy.html の
    // 「商品リンクを置いていないページ」に該当するガイド。選定条件のみ表示する）。
    var noLinks = !!spec.noLinks;
    var h = '<div style="border:1.5px solid rgba(138,133,112,.35);border-radius:12px;padding:16px 18px;margin:6px 0 26px;">';
    h += '<p style="font-weight:700;font-size:.95rem;margin:0 0 2px;">' + (noLinks ? 'この飼育環境を作るための用品の選び方' : 'この飼育環境を作るための用品候補') + '</p>';
    if (noLinks) {
      h += '<p style="font-size:.74rem;opacity:.7;line-height:1.7;margin:0 0 4px;">イメージ図に描かれた機材とは別に、用途・能力・サイズの選び方の目安です。このページには方針として商品リンクを置いていません（<a href="site-policy.html" style="color:inherit;">このサイトの情報について</a>）。</p>';
    } else {
      h += '<p style="font-size:.74rem;opacity:.7;line-height:1.7;margin:0 0 4px;">イメージ図に描かれた機材とは別に、用途・能力・サイズを根拠に選んだ候補です（広告リンクを含みます）。価格・仕様は必ず販売ページでご確認ください。</p>';
    }
    if (spec.pageNote) h += '<p style="font-size:.78rem;line-height:1.7;margin:0 0 4px;color:#7a5b2e;">' + esc(spec.pageNote) + '</p>';

    spec.categories.forEach(function (c) {
      var p = noLinks ? null : resolveProduct(spec.equipmentKey, c.cat, c.tier);
      var alt = (noLinks || !c.altTier) ? null : resolveProduct(spec.equipmentKey, c.cat, c.altTier);
      h += row(CAT_LABEL[c.cat] || c.cat, c.need, c.note, p, alt, c.avoid);
    });
    (spec.extras || []).forEach(function (x) {
      var p = PRODUCTS[x.productId];
      if (noLinks) h += row(x.label || (p && CAT_LABEL[p.category]) || '関連用品', x.need, x.note, null, null, null);
      else if (p) h += row(x.label || CAT_LABEL[p.category] || '関連用品', x.need, x.note, p, null, null);
    });
    (spec.missing || []).forEach(function (m) {
      h += row(m.label, 'must', m.spec + '（適切な候補を選定中のため、条件のみ記載しています）', null, null, null);
    });
    h += '</div>';
    box.innerHTML = h;
    box.hidden = false;

    // GA4: 正典 affiliate_click（Phase 28-C 統一スキーマ）。リスナーはコンテナ毎に1つ。
    // 静的リンク用トラッカー（affiliate-track-static.js）はガイドページに未読込のため二重計測なし。
    // 計測が失敗してもリンク遷移は妨げない（preventDefaultしない・try/catchで握る）。
    if (!box.__kameTracked) {
      box.__kameTracked = true;
      var setupId = box.getAttribute('data-setup') || '';
      var eqKey = spec.equipmentKey || '';
      box.addEventListener('click', function (e) {
        try {
          var a = e.target && e.target.closest ? e.target.closest('a[data-retailer]') : null;
          if (!a || !box.contains(a)) return;
          if (typeof gtag !== 'function') return;
          gtag('event', 'affiliate_click', {
            provider:      a.getAttribute('data-retailer') || '',
            location:      'setup_products',
            category:      a.getAttribute('data-cat') || 'unknown',
            product_id:    a.getAttribute('data-product-id') || '',
            species_slug:  '',
            tier:          a.getAttribute('data-tier') || '',
            setup_id:      setupId,
            equipment_key: eqKey,
            link_position: a.getAttribute('data-pos') || '',
          });
        } catch (err) {}
      });
    }
  }

  function init() {
    if (typeof SETUP_SPECS === 'undefined' || typeof PRODUCTS === 'undefined' || typeof EQUIPMENT_MAP === 'undefined') return;
    var boxes = document.querySelectorAll('.setup-products[data-setup]');
    for (var i = 0; i < boxes.length; i++) {
      var spec = SETUP_SPECS[boxes[i].getAttribute('data-setup')];
      if (spec && !spec.speciesLinkOnly && spec.categories.length) render(boxes[i], spec);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
