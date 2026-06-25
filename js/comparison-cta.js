/**
 * Kame Life Guide — Comparison CTA Component
 * Phase 7-D: species page comparison funnel
 *
 * Usage (per species page, before </div></div> that wraps article):
 *   <script src="../js/comparison-cta.js"></script>
 *   <script>mountComparisonCta('slug-of-this-page');</script>
 *
 * Insert block: before class="end-cta" div
 */

'use strict';

(function () {

  /* ── comparison data ─────────────────────────────────── */
  var COMPARISON_MAP = {
    'hermann-tortoise': [
      {
        target: 'greek-tortoise',
        targetName: 'ギリシャリクガメ',
        selfName: 'ヘルマンリクガメ',
        points: ['サイズ', '寿命', '湿度管理', '初心者向け'],
        comparePage: '../compare/hermann-vs-greek.html'
      },
      {
        target: 'russian-tortoise',
        targetName: 'ロシアリクガメ',
        selfName: 'ヘルマンリクガメ',
        points: ['サイズ', '活動量', '耐寒性', 'ケージサイズ'],
        comparePage: '../compare/hermann-vs-greek.html'
      }
    ],
    'greek-tortoise': [
      {
        target: 'hermann-tortoise',
        targetName: 'ヘルマンリクガメ',
        selfName: 'ギリシャリクガメ',
        points: ['亜種の多様性', '湿度管理', '価格帯', '初心者向け'],
        comparePage: null
      }
    ],
    'russian-tortoise': [
      {
        target: 'hermann-tortoise',
        targetName: 'ヘルマンリクガメ',
        selfName: 'ロシアリクガメ',
        points: ['活動量', '耐寒性', 'ケージサイズ', '入手難易度'],
        comparePage: null
      }
    ],
    'red-footed-tortoise': [
      {
        target: 'cherry-head-tortoise',
        targetName: 'チェリーヘッドリクガメ',
        selfName: 'アカアシリクガメ',
        points: ['サイズ', '湿度管理', '価格帯', '飼育難易度'],
        comparePage: null
      }
    ],
    'cherry-head-tortoise': [
      {
        target: 'red-footed-tortoise',
        targetName: 'アカアシリクガメ',
        selfName: 'チェリーヘッドリクガメ',
        points: ['サイズ', '湿度管理', '価格帯', '飼育難易度'],
        comparePage: null
      }
    ],
    'three-toed-box-turtle': [
      {
        target: 'eastern-box-turtle',
        targetName: 'イースタンハコガメ',
        selfName: 'ミツユビハコガメ',
        points: ['性格', '食性', '飼育難易度', '入手しやすさ'],
        comparePage: null
      }
    ],
    'eastern-box-turtle': [
      {
        target: 'three-toed-box-turtle',
        targetName: 'ミツユビハコガメ',
        selfName: 'イースタンハコガメ',
        points: ['性格', '食性', '飼育難易度', '入手しやすさ'],
        comparePage: null
      }
    ],
    'gulf-coast-box-turtle': [
      {
        target: 'florida-box-turtle',
        targetName: 'フロリダハコガメ',
        selfName: 'ガルフコーストハコガメ',
        points: ['サイズ', '湿度好み', '分布域', '価格帯'],
        comparePage: null
      }
    ],
    'florida-box-turtle': [
      {
        target: 'gulf-coast-box-turtle',
        targetName: 'ガルフコーストハコガメ',
        selfName: 'フロリダハコガメ',
        points: ['サイズ', '湿度好み', '分布域', '価格帯'],
        comparePage: null
      }
    ],
    'japanese-pond-turtle': [
      {
        target: 'reeves-turtle',
        targetName: 'クサガメ',
        selfName: 'ニホンイシガメ',
        points: ['希少性・保全状況', 'CB入手難易度', '飼育難易度', 'サイズ'],
        comparePage: '../compare/reeves-vs-japanese-pond.html'
      }
    ],
    'reeves-turtle': [
      {
        target: 'japanese-pond-turtle',
        targetName: 'ニホンイシガメ',
        selfName: 'クサガメ',
        points: ['入手しやすさ', '成長後サイズ', '飼育難易度', '臭い'],
        comparePage: '../compare/reeves-vs-japanese-pond.html'
      }
    ],
    'musk-turtle': [
      {
        target: 'razorback-musk-turtle',
        targetName: 'カミソリバックニオイガメ',
        selfName: 'ニオイガメ',
        points: ['甲羅形状', '最大サイズ', '水深要件', '価格帯'],
        comparePage: '../compare/musk-vs-razorback.html'
      }
    ],
    'razorback-musk-turtle': [
      {
        target: 'musk-turtle',
        targetName: 'ニオイガメ',
        selfName: 'カミソリバックニオイガメ',
        points: ['甲羅形状', '最大サイズ', '入手難易度', '飼育しやすさ'],
        comparePage: '../compare/musk-vs-razorback.html'
      }
    ]
  };

  /* ── CSS injection (once) ───────────────────────────── */
  function injectStyles() {
    if (document.getElementById('comparison-cta-styles')) return;
    var s = document.createElement('style');
    s.id = 'comparison-cta-styles';
    s.textContent = [
      '.cmp-section{margin:44px 0 0;}',
      '.cmp-eyebrow{font-size:.7rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;',
        'color:var(--accent-dark,#8f5f2c);margin-bottom:10px;}',
      '.cmp-heading{font-family:"Playfair Display",serif;font-style:italic;font-weight:500;',
        'font-size:1.25rem;color:var(--forest,#2f4a3c);margin-bottom:16px;}',
      '.cmp-cards{display:flex;flex-direction:column;gap:12px;}',
      '.cmp-card{',
        'background:rgba(255,255,255,.72);',
        '-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);',
        'border:1.5px solid #e4ddc9;border-radius:16px;',
        'padding:18px 20px 16px;',
        'box-shadow:0 2px 12px rgba(13,31,26,.06);',
        'transition:border-color .15s,box-shadow .15s;}',
      '.cmp-card:hover{border-color:var(--accent,#d4a96a);box-shadow:0 6px 22px rgba(13,31,26,.10);}',
      '.cmp-label{font-weight:700;font-size:.97rem;color:var(--forest-deep,#0d1f1a);',
        'margin-bottom:10px;line-height:1.35;}',
      '.cmp-points{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px;}',
      '.cmp-point{font-size:.72rem;font-weight:700;',
        'background:var(--parchment,#f4efe2);border:1px solid #ddd5be;',
        'color:var(--accent-dark,#8f5f2c);padding:3px 10px;border-radius:20px;}',
      '.cmp-btn{display:inline-flex;align-items:center;justify-content:center;',
        'width:100%;min-height:44px;',
        'background:var(--forest,#2f4a3c);color:var(--parchment,#f4efe2);',
        'text-decoration:none;font-weight:700;font-size:.88rem;',
        'border-radius:10px;padding:11px 18px;',
        'transition:background .18s;box-sizing:border-box;}',
      '.cmp-btn:hover{background:var(--accent-dark,#8f5f2c);}'
    ].join('');
    document.head.appendChild(s);
  }

  /* ── render ─────────────────────────────────────────── */
  function mountComparisonCta(currentSlug) {
    var pairs = COMPARISON_MAP[currentSlug];
    if (!pairs || !pairs.length) return;

    injectStyles();

    /* build section */
    var section = document.createElement('div');
    section.className = 'cmp-section';
    section.setAttribute('aria-label', 'よく比較される亀');

    var eyebrow = document.createElement('div');
    eyebrow.className = 'cmp-eyebrow';
    eyebrow.textContent = 'Species Compare';

    var heading = document.createElement('h2');
    heading.className = 'cmp-heading';
    heading.textContent = 'よく比較される亀';

    var cards = document.createElement('div');
    cards.className = 'cmp-cards';

    pairs.forEach(function (pair) {
      var card = document.createElement('div');
      card.className = 'cmp-card';

      var label = document.createElement('div');
      label.className = 'cmp-label';
      label.textContent = pair.selfName + ' vs ' + pair.targetName;

      var pointsWrap = document.createElement('div');
      pointsWrap.className = 'cmp-points';
      pair.points.forEach(function (pt) {
        var span = document.createElement('span');
        span.className = 'cmp-point';
        span.textContent = pt;
        pointsWrap.appendChild(span);
      });

      /* CTA: comparePage → target species page (fallback) */
      var href = pair.comparePage
        ? pair.comparePage
        : ('../species/' + pair.target + '.html');
      /* if already in species/ dir, use relative */
      if (window.location.pathname.indexOf('/species/') !== -1) {
        href = pair.comparePage
          ? pair.comparePage
          : (pair.target + '.html');
      }

      var btn = document.createElement('a');
      btn.className = 'cmp-btn';
      btn.href = href;
      btn.textContent = '比較を見る →';
      btn.setAttribute('aria-label',
        pair.selfName + 'と' + pair.targetName + 'を比較する');

      btn.addEventListener('click', function () {
        if (typeof gtag === 'function') {
          gtag('event', 'comparison_cta_click', {
            species: currentSlug,
            compared_to: pair.target,
            destination_type: pair.comparePage ? 'compare_page' : 'species_page'
          });
        }
      });

      card.appendChild(label);
      card.appendChild(pointsWrap);
      card.appendChild(btn);
      cards.appendChild(card);
    });

    section.appendChild(eyebrow);
    section.appendChild(heading);
    section.appendChild(cards);

    /* insert before .end-cta */
    var endCta = document.querySelector('.end-cta');
    if (endCta && endCta.parentNode) {
      endCta.parentNode.insertBefore(section, endCta);
    } else {
      /* fallback: append to last .wrap inside article */
      var wraps = document.querySelectorAll('.article .wrap');
      var target = wraps[wraps.length - 1];
      if (target) target.appendChild(section);
    }
  }

  /* expose globally */
  window.mountComparisonCta = mountComparisonCta;

})();
