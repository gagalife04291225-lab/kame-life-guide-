/* ============================================================
   js/annainin.js — 亀の案内人 (Annainin) v1
   Phase 46-A/C. No real AI backend — API・LLM・外部AIは使わない。

   Architecture (top to bottom):
     1. DATA ACCESS  — reads only the site's own existing databases
                       (shindan/species.js の SPECIES, data/products.js の
                       PRODUCTS / EQUIPMENT_MAP). No external API/DB.
     2. CONNECTORS    — static links into 亀診断 / 種類ページ / 比較ページ /
                       Starter Kit / KID. Later phases can extend this map
                       without touching the render layer below.
     3. INTENT_RULES  — dummy keyword classifier. Swappable later for a
                       real NLU call; callers only need
                       classifyIntent(text) -> intent string.
     4. RESPONSE_BUILDERS — per-intent response builder. Several are
                       computed at runtime from the DBs above so the
                       answers reflect real site data instead of static
                       copy. Callers only need
                       getAnnaininResponse(intent) -> {reply, quickReplies, linkedFeatures}.
     5. Chat state + rendering — history array, DOM rendering, input wiring.
     6. GA4 instrumentation — additive, new event names.
   ============================================================ */
(function () {
  'use strict';

  // ---------------------------------------------------------------------
  // 1. DATA ACCESS — existing databases only, loaded via <script> tags in
  //    annainin/index.html (shindan/species.js, data/products.js). Falls
  //    back gracefully to null if a DB script failed to load.
  // ---------------------------------------------------------------------
  var _species = (typeof SPECIES !== 'undefined') ? SPECIES : null;
  var _products = (typeof PRODUCTS !== 'undefined') ? PRODUCTS : null;
  var _equipmentMap = (typeof EQUIPMENT_MAP !== 'undefined') ? EQUIPMENT_MAP : null;

  function allSpecies() {
    if (!_species) return [];
    try { return _species.all || []; } catch (e) { return []; }
  }

  function parseNums(str) {
    if (!str) return null;
    var nums = String(str).match(/\d+/g);
    if (!nums || !nums.length) return null;
    return nums.map(Number);
  }

  function beginnerSpecies(limit) {
    var list = allSpecies().filter(function (s) {
      return s.difficulty === '入門' || s.difficulty === '入門〜中級';
    });
    list.sort(function (a, b) { return (b.recommendationPriority || 0) - (a.recommendationPriority || 0); });
    return list.slice(0, limit || 3);
  }

  function lifespanSummary() {
    var min = null, max = null, minName = null, maxName = null;
    allSpecies().forEach(function (s) {
      var nums = s.coreSpecs && parseNums(s.coreSpecs.lifespan);
      if (!nums) return;
      var lo = Math.min.apply(null, nums), hi = Math.max.apply(null, nums);
      if (min === null || lo < min) { min = lo; minName = s.name; }
      if (max === null || hi > max) { max = hi; maxName = s.name; }
    });
    return { min: min, max: max, minName: minName, maxName: maxName };
  }

  function sizeSummary() {
    var min = null, max = null, maxName = null;
    allSpecies().forEach(function (s) {
      var nums = s.coreSpecs && parseNums(s.coreSpecs.size);
      if (!nums) return;
      var lo = Math.min.apply(null, nums), hi = Math.max.apply(null, nums);
      if (min === null || lo < min) min = lo;
      if (max === null || hi > max) { max = hi; maxName = s.name; }
    });
    return { min: min, max: max, maxName: maxName };
  }

  function tankSizeSummary() {
    var vals = [];
    allSpecies().forEach(function (s) {
      var nums = s.extraSpecs && parseNums(s.extraSpecs.tankSize);
      if (nums) vals = vals.concat(nums);
    });
    if (!vals.length) return null;
    return { min: Math.min.apply(null, vals), max: Math.max.apply(null, vals) };
  }

  function budgetPriceFor(equipmentKey, category) {
    if (!_equipmentMap || !_products) return null;
    var eq = _equipmentMap[equipmentKey];
    if (!eq || !eq[category] || !eq[category].budget) return null;
    var product = _products[eq[category].budget];
    return product ? product.priceRange : null;
  }

  // ---------------------------------------------------------------------
  // 2. CONNECTORS — links into existing site features. No product
  //    recommendation logic or new DB search happens here; these are
  //    plain static navigation links to existing pages.
  // ---------------------------------------------------------------------
  var CONNECTORS = {
    diagnosis: { label: '亀診断をはじめる', href: '../shindan/index.html' },
    starterKit: { label: '診断結果から機材セットを見る', href: '../shindan/index.html' },
    speciesList: { label: '種類一覧を見る（100種）', href: '../species-list.html' },
    comparePage: { label: '種類を比較する', href: '../compare/index.html' },
    kid: { label: '容器チェック（KID）を見る', href: '../kid/index.html' }
  };

  // ---------------------------------------------------------------------
  // 3. Dummy intent classifier — simple keyword matching.
  //    Order matters: more specific rules are placed before broader ones.
  // ---------------------------------------------------------------------
  var INTENT_RULES = [
    { intent: 'greeting', keywords: ['こんにちは', 'こんばんは', 'おはよう', 'はじめまして', 'よろしく', 'hello', 'hi'] },
    { intent: 'tank_size', keywords: ['水槽サイズ', '水槽の大きさ', '水槽は何', 'ケージサイズ', 'タンクサイズ', '水槽が必要', '飼育スペース'] },
    { intent: 'kid_lookup', keywords: ['代用', '容器', 'まだ使える', '衣装ケース', 'トロ舟', '卒業', 'サイズアウト'] },
    { intent: 'starter_kit', keywords: ['機材', 'セット', '何を買え', '揃える', '必要なもの', 'uvb', 'UVB', '飼育セット'] },
    { intent: 'budget', keywords: ['予算', '費用', 'いくら', '初期費用', 'コスト', 'お金'] },
    { intent: 'odor', keywords: ['臭い', '匂い', 'くさい', 'ニオイ'] },
    { intent: 'kids', keywords: ['子供', '子ども', 'こども', 'キッズ', '小学生'] },
    { intent: 'outdoor', keywords: ['屋外', '庭', 'ベランダ', '外飼い', '屋外飼育'] },
    { intent: 'multi_keeping', keywords: ['多頭', '複数飼い', '何匹も', '同居', '混泳'] },
    { intent: 'lifespan', keywords: ['寿命', '何年生きる', '長生き', '何歳まで'] },
    { intent: 'size', keywords: ['甲長', 'どれくらい大きく', '成体', '最大', '体長', '大きさ'] },
    { intent: 'recommended_species', keywords: ['おすすめの種類', '人気の亀', 'どの種類がいい', 'おすすめ教えて', '人気種'] },
    { intent: 'beginner', keywords: ['初心者', 'はじめて', '初めて', '入門'] },
    { intent: 'diagnosis', keywords: ['向いてる', '合う亀', 'どの亀', '亀の種類', '診断', 'どの子', '私に合う'] },
    { intent: 'capability', keywords: ['できること', '何ができる', '使い方', 'help', 'ヘルプ'] }
  ];

  function classifyIntent(text) {
    var normalized = String(text || '').trim().toLowerCase();
    if (!normalized) return 'empty';
    for (var i = 0; i < INTENT_RULES.length; i++) {
      var rule = INTENT_RULES[i];
      for (var j = 0; j < rule.keywords.length; j++) {
        if (normalized.indexOf(rule.keywords[j].toLowerCase()) !== -1) {
          return rule.intent;
        }
      }
    }
    return 'unknown';
  }

  // ---------------------------------------------------------------------
  // 4. Response builders. Each returns { reply, quickReplies, linkedFeatures }.
  //    DB-backed ones compute their numbers at call time from SPECIES /
  //    PRODUCTS / EQUIPMENT_MAP — nothing is hardcoded copy.
  // ---------------------------------------------------------------------
  var TOPIC_QUICK_REPLIES = ['初心者向けの亀は？', '水槽サイズは？', '臭いは気になる？', '初期費用はいくら？'];

  var RESPONSE_BUILDERS = {
    greeting: function () {
      return {
        reply: 'こんにちは！亀の案内人です🐢\nお迎えする亀選びや、機材の準備、日々のお世話について気軽に聞いてくださいね。',
        quickReplies: TOPIC_QUICK_REPLIES,
        linkedFeatures: []
      };
    },

    diagnosis: function () {
      return {
        reply: 'あなたに合う亀を知りたいのですね。簡単な質問に答えるだけで、飼育環境や経験値に合った亀種と必要機材をまとめてご案内する診断ツールがあります。',
        quickReplies: ['診断してみる'],
        linkedFeatures: [CONNECTORS.diagnosis]
      };
    },

    starter_kit: function () {
      return {
        reply: '機材選びですね！亀の種類が決まっている場合は、診断ツールの結果画面から、経験値に合わせた飼育セットを一式ご案内できます。',
        quickReplies: ['診断してみる'],
        linkedFeatures: [CONNECTORS.starterKit]
      };
    },

    kid_lookup: function () {
      return {
        reply: '今お使いの容器がそのまま使えるか気になりますよね。甲長から「今使えるもの・そろそろ卒業・使わない方がいいもの」を確認できるページがあります。',
        quickReplies: ['KIDを見る'],
        linkedFeatures: [CONNECTORS.kid]
      };
    },

    capability: function () {
      return {
        reply: '私にできることはまだ準備中の部分も多いですが、初心者向けの相談、水槽サイズ、臭い、予算、子ども向け、屋外飼育、多頭飼育、寿命、大きさ、おすすめ種類についてお答えできます。',
        quickReplies: TOPIC_QUICK_REPLIES,
        linkedFeatures: []
      };
    },

    beginner: function () {
      var picks = beginnerSpecies(3);
      var names = picks.map(function (s) { return s.name; }).join('・');
      var lede = names
        ? 'データベース内では、' + names + 'あたりが「入門」ランクの亀として登録されています。'
        : '飼育難易度が「入門」ランクの亀がいくつか登録されています。';
      return {
        reply: '初めて亀を迎えるなら、乾燥管理だけで飼える種類か、水質・フィルター管理が必要な種類かで手間が大きく変わります。' + lede + 'ただし性格やスペースとの相性もあるので、診断ツールで具体的な条件を入れるのが確実です。',
        quickReplies: ['診断してみる', '種類一覧を見る'],
        linkedFeatures: [CONNECTORS.diagnosis, CONNECTORS.speciesList]
      };
    },

    tank_size: function () {
      var t = tankSizeSummary();
      var lede = t
        ? 'データベースに登録されている水棲・半水棲種では、必要な水槽サイズはおおよそ' + t.min + '〜' + t.max + 'cm帯に分布しています。'
        : '種類によって必要な水槽サイズは大きく異なります。';
      return {
        reply: lede + '陸生のリクガメは水槽より床面積の広いケージが基準になるため、種類によって考え方が変わります。診断ツールでは今のお部屋の広さを条件に入れて絞り込めます。',
        quickReplies: ['診断してみる', '種類一覧を見る'],
        linkedFeatures: [CONNECTORS.diagnosis, CONNECTORS.speciesList]
      };
    },

    odor: function () {
      return {
        reply: '臭いの出やすさは「水を使う頻度」と関係します。完全水棲種はろ過と換水の管理が臭いを大きく左右し、乾燥系リクガメは床材の管理次第で臭いを抑えやすい傾向があります。診断ツールでは臭いの不安を条件に入れて種を絞り込めますし、比較ページで種類ごとの違いを並べて確認することもできます。',
        quickReplies: ['診断してみる', '種類を比較する'],
        linkedFeatures: [CONNECTORS.diagnosis, CONNECTORS.comparePage]
      };
    },

    budget: function () {
      var enclosurePrice = budgetPriceFor('tortoise_dry_small', 'enclosure');
      var uvbPrice = budgetPriceFor('tortoise_dry_small', 'lighting_uvb');
      var lede;
      if (enclosurePrice && uvbPrice) {
        lede = '例えば小型リクガメ向けの入門構成では、ケージが目安' + enclosurePrice + '、UVBライトが目安' + uvbPrice + 'ほどからそろえられます（データベース掲載の実売価格帯）。';
      } else {
        lede = '初期費用は種類と機材のグレードによって数千円〜数万円まで幅があります。';
      }
      return {
        reply: lede + 'ケージ・照明・保温・床材などをまとめて確認したい場合は、診断結果の画面から予算に応じたStarter Kit（budget/standard/premium）を一式でご案内しています。',
        quickReplies: ['診断してみる'],
        linkedFeatures: [CONNECTORS.diagnosis, CONNECTORS.starterKit]
      };
    },

    kids: function () {
      return {
        reply: 'お子さんと一緒に育てるなら、気性が穏やかで扱いやすい種類、かつ甲長が急に大きくならない種類が向いています。噛みつきの少なさや、日々のお世話の負担も種類ごとに差があるので、比較ページで並べて確認したうえで、診断ツールで暮らし方に合う種を絞り込むのがおすすめです。なお、亀を触った後の手洗いなど衛生面のルールは、種類によらず大切です。',
        quickReplies: ['診断してみる', '種類を比較する'],
        linkedFeatures: [CONNECTORS.diagnosis, CONNECTORS.comparePage]
      };
    },

    outdoor: function () {
      return {
        reply: '屋外飼育は、寒暖差に強い種類か、冬眠（休眠）に対応できるかが分かれ目になります。日本産のイシガメ類や一部のリクガメは屋外飼育例が多い一方、高温多湿を好む種類は屋外だと管理が難しくなりがちです。種類一覧で気候適性を確認しながら、診断ツールで詳しい条件を絞り込んでみてください。',
        quickReplies: ['種類一覧を見る', '診断してみる'],
        linkedFeatures: [CONNECTORS.speciesList, CONNECTORS.diagnosis]
      };
    },

    multi_keeping: function () {
      return {
        reply: '多頭飼育は、同種同士でも縄張り意識やオス同士の争いが起きることがあり、異種同士の混泳はさらに注意が必要です。スペースを単純に頭数分用意するだけでなく、隔離できる予備スペースがあると安心です。種類ごとの相性は比較ページで確認し、頭数を増やす前に診断ツールで今の環境に合っているか見直すのがおすすめです。',
        quickReplies: ['種類を比較する', '診断してみる'],
        linkedFeatures: [CONNECTORS.comparePage, CONNECTORS.diagnosis]
      };
    },

    lifespan: function () {
      var l = lifespanSummary();
      var lede = (l.min !== null && l.max !== null)
        ? 'データベースに登録されている亀では、寿命はおおよそ' + l.min + '〜' + l.max + '年の幅があります（短命な種の例：' + (l.minName || '一部の水棲種') + '、長寿な種の例：' + (l.maxName || '大型リクガメ') + '）。'
        : '亀は種類によって寿命が大きく異なります。';
      return {
        reply: lede + '長く一緒に暮らす前提で選ぶことが後悔の少なさにつながるので、種類一覧やお迎え前に診断ツールで暮らし方との相性を確認しておくと安心です。',
        quickReplies: ['種類一覧を見る', '診断してみる'],
        linkedFeatures: [CONNECTORS.speciesList, CONNECTORS.diagnosis]
      };
    },

    size: function () {
      var s = sizeSummary();
      var lede = (s.min !== null && s.max !== null)
        ? 'データベースでは、成体の甲長はおおよそ' + s.min + '〜' + s.max + 'cmまで幅があります（最大級の例：' + (s.maxName || '大型種') + '）。'
        : '成体になったときの大きさは種類によって大きく異なります。';
      return {
        reply: lede + '小さいまま飼えると思っていた種類が想像以上に大きくなることも多いので、種類一覧や比較ページで成体サイズを確認してから選ぶことをおすすめします。',
        quickReplies: ['種類一覧を見る', '種類を比較する'],
        linkedFeatures: [CONNECTORS.speciesList, CONNECTORS.comparePage]
      };
    },

    recommended_species: function () {
      var picks = beginnerSpecies(3);
      var names = picks.map(function (s) { return s.name; }).join('・');
      var lede = names
        ? '一例として、' + names + 'はデータベース内で入門向けの評価が高い種類です。'
        : '暮らし方によっておすすめは変わります。';
      return {
        reply: lede + 'ただし「おすすめ」は飼育スペース・予算・臭いへの許容度によって変わるため、診断ツールで具体的な条件を入れると、100種の中からあなたに合う種類を絞り込めます。種類一覧を眺めながら比較するのもおすすめです。',
        quickReplies: ['診断してみる', '種類一覧を見る'],
        linkedFeatures: [CONNECTORS.diagnosis, CONNECTORS.speciesList]
      };
    },

    empty: function () {
      return {
        reply: 'メッセージが空のようです。気になることを一言入力してみてください。',
        quickReplies: TOPIC_QUICK_REPLIES,
        linkedFeatures: []
      };
    },

    unknown: function () {
      return {
        reply: 'ごめんなさい、まだうまく理解できませんでした🙏 初心者向け・水槽サイズ・臭い・予算・子ども向け・屋外飼育・多頭飼育・寿命・大きさ・おすすめ種類について相談できます。下のボタンからも選べます。',
        quickReplies: TOPIC_QUICK_REPLIES,
        linkedFeatures: []
      };
    }
  };

  function getAnnaininResponse(intent) {
    var builder = RESPONSE_BUILDERS[intent] || RESPONSE_BUILDERS.unknown;
    return builder();
  }

  // ---------------------------------------------------------------------
  // 5. Chat state + rendering
  // ---------------------------------------------------------------------
  var history = []; // { role: 'user'|'bot', text: string, ts: number }

  var els = {};

  function init() {
    els.history = document.getElementById('an-history');
    els.form = document.getElementById('an-form');
    els.input = document.getElementById('an-input');
    els.sendBtn = document.getElementById('an-send-btn');

    if (!els.history || !els.form || !els.input) return;

    els.form.addEventListener('submit', function (e) {
      e.preventDefault();
      submitUserText(els.input.value);
    });

    document.addEventListener('click', function (e) {
      var quickBtn = e.target.closest('[data-quick-reply]');
      if (quickBtn) {
        submitUserText(quickBtn.getAttribute('data-quick-reply'));
      }
    });

    renderBotTurn(getAnnaininResponse('greeting'), 'greeting');
    ga4Event('annainin_view', {});
  }

  function submitUserText(rawText) {
    var text = String(rawText || '').trim();
    if (!text) return;

    appendUserMessage(text);
    els.input.value = '';
    els.input.focus();

    var typingEl = showTypingIndicator();
    var intent = classifyIntent(text);

    ga4Event('annainin_message_sent', { message_length: text.length });
    ga4Event('annainin_intent_classified', { intent: intent });

    window.setTimeout(function () {
      removeTypingIndicator(typingEl);
      renderBotTurn(getAnnaininResponse(intent), intent);
    }, 480);
  }

  function appendUserMessage(text) {
    history.push({ role: 'user', text: text, ts: Date.now() });
    var row = document.createElement('div');
    row.className = 'an-msg an-msg-user';
    row.innerHTML =
      '<div class="an-avatar">🧑</div>' +
      '<div class="an-bubble"></div>';
    row.querySelector('.an-bubble').textContent = text;
    els.history.appendChild(row);
    scrollToBottom();
  }

  function renderBotTurn(response, intent) {
    history.push({ role: 'bot', text: response.reply, intent: intent, ts: Date.now() });

    var row = document.createElement('div');
    row.className = 'an-msg an-msg-bot';
    row.innerHTML =
      '<div class="an-avatar">🐢</div>' +
      '<div class="an-bubble"></div>';
    row.querySelector('.an-bubble').textContent = response.reply;
    els.history.appendChild(row);

    if (response.quickReplies && response.quickReplies.length) {
      var qr = document.createElement('div');
      qr.className = 'an-quick-replies';
      response.quickReplies.forEach(function (label) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'an-quick-btn';
        btn.setAttribute('data-quick-reply', label);
        btn.textContent = label;
        qr.appendChild(btn);
      });
      els.history.appendChild(qr);
    }

    if (response.linkedFeatures && response.linkedFeatures.length) {
      var lf = document.createElement('div');
      lf.className = 'an-linked-features';
      response.linkedFeatures.forEach(function (feature) {
        var wrap = document.createElement('div');
        wrap.className = 'an-linked-feature';
        var a = document.createElement('a');
        a.href = feature.href;
        a.textContent = feature.label + ' →';
        a.addEventListener('click', function () {
          ga4Event('annainin_feature_link_click', { intent: intent, href: feature.href });
        });
        wrap.appendChild(a);
        lf.appendChild(wrap);
      });
      els.history.appendChild(lf);
    }

    scrollToBottom();
  }

  function showTypingIndicator() {
    var row = document.createElement('div');
    row.className = 'an-msg an-msg-bot an-typing';
    row.innerHTML =
      '<div class="an-avatar">🐢</div>' +
      '<div class="an-bubble"><span class="an-typing-dot"></span><span class="an-typing-dot"></span><span class="an-typing-dot"></span></div>';
    els.history.appendChild(row);
    scrollToBottom();
    return row;
  }

  function removeTypingIndicator(el) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function scrollToBottom() {
    els.history.scrollTop = els.history.scrollHeight;
  }

  // ---------------------------------------------------------------------
  // 6. GA4 — additive only, all-new event names for this new page.
  // ---------------------------------------------------------------------
  function ga4Event(name, params) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params || {});
    }
  }

  document.addEventListener('DOMContentLoaded', init);

  // Exposed for future wiring (e.g. KID/shindan calling into the guide
  // programmatically) and for debugging.
  window.KameAnnainin = {
    classifyIntent: classifyIntent,
    getAnnaininResponse: getAnnaininResponse,
    CONNECTORS: CONNECTORS
  };
})();
