/* ============================================================
   カメライフガイド キッズ版 — 全ページ共通スクリプト
   - ふりがな表示の切り替え（localStorage に保存・全ページ共有）
   - 島のちずの「通った場所」記録
   クイズは js/kids-quiz.js に分離した（クイズのページだけが読む）。
   localStorage が使えない環境でも、記録が残らないだけで
   ページはそのまま読める。
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

  /* ---------- 島のちず（通った場所の記録） ---------- */
  var PROGRESS_KEY = 'klg-kids-progress';
  var map = document.querySelector('.k-map');
  if (!map) return;

  var here = map.getAttribute('data-stop');   // 今いる場所の番号（文字列）

  function readVisited() {
    try {
      var raw = localStorage.getItem(PROGRESS_KEY);
      if (!raw) return [];
      var list = JSON.parse(raw);
      return Object.prototype.toString.call(list) === '[object Array]' ? list : [];
    } catch (e) { return []; }   // 壊れた値・使えない環境は「記録なし」として扱う
  }

  var visited = readVisited();
  if (here && visited.indexOf(here) === -1) visited.push(here);
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(visited)); } catch (e) { /* 無視 */ }

  // 今いる場所には ✓ を付けない（現在地の表示を優先するため）
  var stops = map.querySelectorAll('.k-stop');
  for (var i = 0; i < stops.length; i++) {
    var no = stops[i].getAttribute('data-stop');
    if (no !== here && visited.indexOf(no) !== -1) stops[i].classList.add('is-done');
  }

  /* ---------- どこまで進んだかを記録（GA4） ---------- */
  if (typeof window.gtag === 'function' && here) {
    try {
      window.gtag('event', 'kids_stop_view', { stop: Number(here), visited: visited.length });
    } catch (e) { /* 無視 */ }
  }
})();
