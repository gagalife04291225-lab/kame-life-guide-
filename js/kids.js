/* ============================================================
   カメライフガイド キッズ版 (kids/index.html)
   - ふりがな表示の切り替え (localStorage に保存)
   - カメクイズ 6問
   ふりがなはモノルビ（漢字1字ごと）で書く。
   ============================================================ */
(function () {
  'use strict';

  /* ---------- ふりがな切り替え ---------- */
  var FURIGANA_KEY = 'klg-kids-furigana';
  var toggle = document.getElementById('furigana-toggle');

  function applyFurigana(on) {
    document.body.classList.toggle('no-furigana', !on);
    if (!toggle) return;
    toggle.setAttribute('aria-pressed', on ? 'true' : 'false');
    toggle.innerHTML = on
      ? 'ふりがな：ひょうじ<ruby>中<rt>ちゅう</rt></ruby>'
      : 'ふりがな：オフ';
  }

  var saved = null;
  try { saved = localStorage.getItem(FURIGANA_KEY); } catch (e) { /* 保存できない環境は既定値で動かす */ }
  applyFurigana(saved !== 'off');

  if (toggle) {
    toggle.addEventListener('click', function () {
      var nowOn = document.body.classList.contains('no-furigana'); // 反転後の状態
      applyFurigana(nowOn);
      try { localStorage.setItem(FURIGANA_KEY, nowOn ? 'on' : 'off'); } catch (e) { /* 無視 */ }
    });
  }

  /* ---------- クイズ ---------- */
  var QUESTIONS = [
    {
      q: 'カメの <ruby>甲<rt>こう</rt>羅<rt>ら</rt></ruby>は ぬげる？',
      choices: [
        'ぬげる。<ruby>服<rt>ふく</rt></ruby>の ような もの',
        'ぬげない。<ruby>体<rt>からだ</rt></ruby>と くっついて いる',
        '<ruby>夏<rt>なつ</rt></ruby>だけ ぬげる'
      ],
      answer: 1,
      why: '<ruby>甲<rt>こう</rt>羅<rt>ら</rt></ruby>は カメの <ruby>体<rt>からだ</rt></ruby>と くっついて います。<ruby>中<rt>なか</rt></ruby>には <ruby>背<rt>せ</rt>骨<rt>ぼね</rt></ruby>も あります。だから ぶつけると いたいです。'
    },
    {
      q: 'カメは <ruby>自<rt>じ</rt>分<rt>ぶん</rt></ruby>で <ruby>体<rt>からだ</rt></ruby>を あたためられる？',
      choices: [
        'あたためられない。<ruby>日<rt>ひ</rt></ruby>なたなどが いる',
        'いつでも <ruby>自<rt>じ</rt>分<rt>ぶん</rt></ruby>で あたためられる',
        'ねて いる ときだけ あたためられる'
      ],
      answer: 0,
      why: 'まわりが さむいと、カメの <ruby>体<rt>からだ</rt></ruby>も つめたく なります。だから <ruby>日<rt>ひ</rt></ruby>なたに <ruby>出<rt>で</rt></ruby>たり、<ruby>人<rt>ひと</rt></ruby>が あたたかい <ruby>場<rt>ば</rt>所<rt>しょ</rt></ruby>を つくったり します。'
    },
    {
      q: 'カメが <ruby>食<rt>た</rt></ruby>べる ものは？',
      choices: [
        'どの カメも <ruby>同<rt>おな</rt></ruby>じ ものを <ruby>食<rt>た</rt></ruby>べる',
        'しゅるいに よって ちがう',
        '<ruby>人<rt>ひと</rt></ruby>の おかしを <ruby>食<rt>た</rt></ruby>べる'
      ],
      answer: 1,
      why: '<ruby>草<rt>くさ</rt></ruby>や <ruby>野<rt>や</rt></ruby>さいを <ruby>食<rt>た</rt></ruby>べる カメ、<ruby>虫<rt>むし</rt></ruby>や <ruby>魚<rt>さかな</rt></ruby>を <ruby>食<rt>た</rt></ruby>べる カメ、りょうほう <ruby>食<rt>た</rt></ruby>べる カメが います。<ruby>飼<rt>か</rt></ruby>う <ruby>前<rt>まえ</rt></ruby>に しらべます。'
    },
    {
      q: 'カメを さわった あとは どうする？',
      choices: [
        'おやつを <ruby>食<rt>た</rt></ruby>べる',
        'カメに キスを する',
        'せっけんで <ruby>手<rt>て</rt></ruby>を あらう'
      ],
      answer: 2,
      why: 'カメや <ruby>水<rt>みず</rt></ruby>には、おなかを こわす ばいきんが いる ことが あります。さわったら かならず <ruby>手<rt>て</rt></ruby>を あらいます。'
    },
    {
      q: '<ruby>飼<rt>か</rt></ruby>えなく なった カメを <ruby>池<rt>いけ</rt></ruby>に にがして いい？',
      choices: [
        'だめ。おうちの <ruby>人<rt>ひと</rt></ruby>や お<ruby>店<rt>みせ</rt></ruby>に そうだんする',
        'いい。そとの ほうが カメも よろこぶ',
        '<ruby>大<rt>おお</rt></ruby>きい <ruby>池<rt>いけ</rt></ruby>なら いい'
      ],
      answer: 0,
      why: 'もとから すんで いた <ruby>生<rt>い</rt></ruby>きものが こまります。にがしては いけない、と きめられて いる カメも います。'
    },
    {
      q: 'カメを <ruby>飼<rt>か</rt></ruby>いはじめる とき、いちばん <ruby>大<rt>たい</rt>切<rt>せつ</rt></ruby>な ことは？',
      choices: [
        'ともだちより <ruby>先<rt>さき</rt></ruby>に <ruby>飼<rt>か</rt></ruby>う こと',
        'おうちの <ruby>人<rt>ひと</rt></ruby>と いっしょに かんがえる こと',
        'いちばん やすい カメを えらぶ こと'
      ],
      answer: 1,
      why: 'カメは <ruby>何<rt>なん</rt>十<rt>じゅう</rt>年<rt>ねん</rt></ruby>も <ruby>生<rt>い</rt></ruby>きる なかまが います。<ruby>飼<rt>か</rt></ruby>いはじめる <ruby>前<rt>まえ</rt></ruby>に、おうちの <ruby>人<rt>ひと</rt></ruby>と よく はなす ことが いちばん <ruby>大<rt>たい</rt>切<rt>せつ</rt></ruby>です。'
    }
  ];

  var box = document.getElementById('quiz-box');
  if (!box) return;

  var current = 0;
  var score = 0;

  function track(name, params) {
    if (typeof window.gtag === 'function') {
      try { window.gtag('event', name, params || {}); } catch (e) { /* 無視 */ }
    }
  }

  function renderQuestion() {
    var item = QUESTIONS[current];
    box.innerHTML = '';

    var progress = document.createElement('p');
    progress.className = 'k-q-progress';
    progress.textContent = 'だい ' + (current + 1) + ' もん（ぜんぶで ' + QUESTIONS.length + ' もん）';
    box.appendChild(progress);

    var qText = document.createElement('p');
    qText.className = 'k-q-text';
    qText.innerHTML = item.q;
    box.appendChild(qText);

    var choices = document.createElement('div');
    choices.className = 'k-q-choices';
    item.choices.forEach(function (choice, index) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.innerHTML = choice;
      btn.addEventListener('click', function () { onAnswer(index, choices); });
      choices.appendChild(btn);
    });
    box.appendChild(choices);

    var feedback = document.createElement('div');
    feedback.id = 'quiz-feedback';
    feedback.setAttribute('aria-live', 'polite');
    box.appendChild(feedback);
  }

  function onAnswer(index, choicesEl) {
    var item = QUESTIONS[current];
    var correct = index === item.answer;
    if (correct) score++;

    var buttons = choicesEl.querySelectorAll('button');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
      if (i === item.answer) buttons[i].classList.add('correct');
      else if (i === index) buttons[i].classList.add('wrong');
    }

    var feedback = document.getElementById('quiz-feedback');
    feedback.className = 'k-q-feedback' + (correct ? '' : ' ng');
    feedback.innerHTML = '<b>' + (correct ? '⭕ せいかい！' : '❌ ざんねん…') + '</b>' + item.why;

    var next = document.createElement('button');
    next.type = 'button';
    next.className = 'k-btn';
    next.textContent = current < QUESTIONS.length - 1 ? 'つぎの もんだいへ →' : 'けっかを みる →';
    next.addEventListener('click', function () {
      current++;
      if (current < QUESTIONS.length) renderQuestion();
      else renderResult();
    });
    feedback.appendChild(next);
    next.focus();
  }

  function renderResult() {
    var medal = score === QUESTIONS.length ? '🏆' : (score >= 4 ? '🥈' : '🐢');
    var message = score === QUESTIONS.length
      ? 'ぜんもん せいかい！ カメはかせだね。'
      : (score >= 4
        ? 'よく できました！ まちがえた ところを もう いちど <ruby>読<rt>よ</rt></ruby>んで みよう。'
        : 'もう いちど <ruby>上<rt>うえ</rt></ruby>から <ruby>読<rt>よ</rt></ruby>んで みよう。きっと できる ように なります。');

    box.innerHTML =
      '<div class="k-q-result">' +
        '<span class="medal" aria-hidden="true">' + medal + '</span>' +
        '<span class="score">' + QUESTIONS.length + 'もん<ruby>中<rt>ちゅう</rt></ruby> ' + score + 'もん せいかい</span>' +
        '<p>' + message + '</p>' +
      '</div>';

    var retry = document.createElement('button');
    retry.type = 'button';
    retry.className = 'k-btn';
    retry.textContent = 'もう いちど ちょうせんする';
    retry.addEventListener('click', function () {
      current = 0;
      score = 0;
      renderQuestion();
    });
    box.querySelector('.k-q-result').appendChild(retry);

    track('kids_quiz_complete', { score: score, total: QUESTIONS.length });
  }

  renderQuestion();
})();
