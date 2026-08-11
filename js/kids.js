/* ============================================================
   カメライフガイド キッズ版 (kids/index.html)
   - ふりがな表示の切り替え (localStorage に保存)
   - カメクイズ 5問
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
      q: 'カメの<ruby>甲羅<rt>こうら</rt></ruby>は、<ruby>脱<rt>ぬ</rt></ruby>ぐことができる？',
      choices: [
        '<ruby>脱<rt>ぬ</rt></ruby>げる。<ruby>服<rt>ふく</rt></ruby>のようなもの',
        '<ruby>脱<rt>ぬ</rt></ruby>げない。<ruby>体<rt>からだ</rt></ruby>の<ruby>一部<rt>いちぶ</rt></ruby>だから',
        '<ruby>夏<rt>なつ</rt></ruby>だけ<ruby>脱<rt>ぬ</rt></ruby>げる'
      ],
      answer: 1,
      why: '<ruby>甲羅<rt>こうら</rt></ruby>は<ruby>背骨<rt>せぼね</rt></ruby>やあばら<ruby>骨<rt>ぼね</rt></ruby>とくっついていて、<ruby>体<rt>からだ</rt></ruby>の<ruby>一部<rt>いちぶ</rt></ruby>です。だからぶつけると<ruby>痛<rt>いた</rt></ruby>いのです。'
    },
    {
      q: 'カメは<ruby>自分<rt>じぶん</rt></ruby>の<ruby>力<rt>ちから</rt></ruby>で<ruby>体<rt>からだ</rt></ruby>をあたためられる？',
      choices: [
        'あたためられない。<ruby>日<rt>ひ</rt></ruby>なたなどが<ruby>必要<rt>ひつよう</rt></ruby>',
        'いつでも<ruby>自分<rt>じぶん</rt></ruby>であたためられる',
        '<ruby>寝<rt>ね</rt></ruby>ているときだけあたためられる'
      ],
      answer: 0,
      why: 'まわりがさむいとカメの<ruby>体<rt>からだ</rt></ruby>もつめたくなります。だから<ruby>甲羅干<rt>こうらぼ</rt></ruby>しをしたり、<ruby>人間<rt>にんげん</rt></ruby>があたたかい<ruby>場所<rt>ばしょ</rt></ruby>を<ruby>用意<rt>ようい</rt></ruby>したりします。'
    },
    {
      q: 'カメをさわったあと、まずすることは？',
      choices: [
        'おやつを<ruby>食<rt>た</rt></ruby>べる',
        'カメにキスをする',
        '<ruby>石<rt>せっ</rt></ruby>けんで<ruby>手<rt>て</rt></ruby>を<ruby>洗<rt>あら</rt></ruby>う'
      ],
      answer: 2,
      why: 'カメや<ruby>水<rt>みず</rt></ruby>には、おなかをこわす<ruby>菌<rt>きん</rt></ruby>がいることがあります。さわったら、かならず<ruby>石<rt>せっ</rt></ruby>けんで<ruby>手<rt>て</rt></ruby>を<ruby>洗<rt>あら</rt></ruby>いましょう。'
    },
    {
      q: '<ruby>飼<rt>か</rt></ruby>えなくなったカメを、<ruby>近<rt>ちか</rt></ruby>くの<ruby>池<rt>いけ</rt></ruby>に<ruby>逃<rt>に</rt></ruby>がしてもいい？',
      choices: [
        'ダメ。おうちの<ruby>人<rt>ひと</rt></ruby>やお<ruby>店<rt>みせ</rt></ruby>に<ruby>相談<rt>そうだん</rt></ruby>する',
        'いい。<ruby>自然<rt>しぜん</rt></ruby>のほうがカメも<ruby>喜<rt>よろこ</rt></ruby>ぶ',
        '<ruby>大<rt>おお</rt></ruby>きい<ruby>池<rt>いけ</rt></ruby>ならいい'
      ],
      answer: 0,
      why: 'もともといなかったカメが<ruby>増<rt>ふ</rt></ruby>えると、そこにすむ<ruby>生<rt>い</rt></ruby>きものがこまります。<ruby>種類<rt>しゅるい</rt></ruby>によっては<ruby>法律<rt>ほうりつ</rt></ruby>で<ruby>禁止<rt>きんし</rt></ruby>されています。'
    },
    {
      q: 'カメを<ruby>飼<rt>か</rt></ruby>いはじめるとき、いちばん<ruby>大切<rt>たいせつ</rt></ruby>なことは？',
      choices: [
        '<ruby>友<rt>とも</rt></ruby>だちより<ruby>先<rt>さき</rt></ruby>に<ruby>飼<rt>か</rt></ruby>うこと',
        '<ruby>最後<rt>さいご</rt></ruby>までお<ruby>世話<rt>せわ</rt></ruby>できるか、おうちの<ruby>人<rt>ひと</rt></ruby>と<ruby>考<rt>かんが</rt></ruby>えること',
        'いちばん<ruby>安<rt>やす</rt></ruby>いカメを<ruby>選<rt>えら</rt></ruby>ぶこと'
      ],
      answer: 1,
      why: 'カメは<ruby>何十年<rt>なんじゅうねん</rt></ruby>も<ruby>生<rt>い</rt></ruby>きるなかまがいます。<ruby>飼<rt>か</rt></ruby>いはじめる<ruby>前<rt>まえ</rt></ruby>に、おうちの<ruby>人<rt>ひと</rt></ruby>とよく<ruby>話<rt>はな</rt></ruby>しあうことがいちばん<ruby>大切<rt>たいせつ</rt></ruby>です。'
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
    progress.textContent = 'だい ' + (current + 1) + ' もん / ' + QUESTIONS.length + ' もん';
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
    var medal = score === QUESTIONS.length ? '🏆' : (score >= 3 ? '🥈' : '🐢');
    var message = score === QUESTIONS.length
      ? 'ぜんもん せいかい！ カメはかせだね。'
      : (score >= 3
        ? 'よくできました！ まちがえたところを もういちど<ruby>読<rt>よ</rt></ruby>んでみよう。'
        : 'もういちど <ruby>上<rt>うえ</rt></ruby>から<ruby>読<rt>よ</rt></ruby>んでみよう。きっと できるようになります。');

    box.innerHTML =
      '<div class="k-q-result">' +
        '<span class="medal" aria-hidden="true">' + medal + '</span>' +
        '<span class="score">' + QUESTIONS.length + 'もん<ruby>中<rt>ちゅう</rt></ruby> ' + score + 'もん せいかい</span>' +
        '<p>' + message + '</p>' +
      '</div>';

    var retry = document.createElement('button');
    retry.type = 'button';
    retry.className = 'k-btn';
    retry.textContent = 'もういちど ちょうせんする';
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
