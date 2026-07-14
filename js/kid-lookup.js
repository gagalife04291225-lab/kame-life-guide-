/* ============================================================
   js/kid-lookup.js — KID v1 render + reverse-lookup + safety gate
   Phase 29-D. Depends on data/kid.js (window.KID).

   SAFETY GATE (authoritative):
   - UNSAFE  → no CTA block generated at all
   - UNKNOWN → CTA hidden
   - CONDITIONAL → CTA locked until conditions revealed (detail opened)
   - SAFE / TEMPORARY → CTA shows; placeholder when affiliate URL is null
   Affiliate URLs are never fabricated. null → "準備中" placeholder.
   image.ok=false → image never rendered.
   ============================================================ */
(function () {
  "use strict";
  if (!window.KID) { return; }
  var KID = window.KID;

  function ga(name, params) {
    if (typeof window.gtag === "function") { window.gtag("event", name, params || {}); }
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var KS_LABELS = { swim: "遊泳", turn: "方向転換", bask: "陸場", shelter: "隠れ・掘り", secure: "脱走耐性", climate: "環境維持" };
  var KS_MARK = { 3: "◯", 2: "△", 1: "✕", 0: "✕" };

  var GAUGE_MAX = 30; // cm scale ceiling for the 甲長ゲージ

  /* ---------- K-SCORE row ---------- */
  function kscoreHtml(ks) {
    if (!ks) { return ""; }
    var out = [];
    Object.keys(KS_LABELS).forEach(function (k) {
      var v = ks[k];
      if (v === null || v === undefined) { return; } // 非該当 → 非表示
      var mark = KS_MARK[v] || "-";
      out.push('<span class="ks">' + esc(KS_LABELS[k]) + ' <b class="mark-' + v + '">' + mark + "</b></span>");
    });
    if (!out.length) { return ""; }
    return '<div class="kscore" aria-label="K-SCORE">' + out.join("") + "</div>";
  }

  /* ---------- 甲長ゲージ ---------- */
  function gaugeHtml(minCm, maxCm) {
    var lo = Math.max(0, minCm), hi = Math.min(GAUGE_MAX, maxCm);
    var left = (lo / GAUGE_MAX) * 100, width = Math.max(4, ((hi - lo) / GAUGE_MAX) * 100);
    var noteMax = (maxCm >= 999) ? "上限なし" : ("〜" + maxCm + "cm");
    return '<div class="gauge" role="img" aria-label="対応甲長 ' + esc(minCm + "〜" + (maxCm >= 999 ? "" : maxCm) + "cm") + '">' +
      '<div class="gauge-track"><div class="gauge-band" style="left:' + left.toFixed(1) + "%;width:" + width.toFixed(1) + '%"></div></div>' +
      '<div class="gauge-scale"><span>0</span><span>10</span><span>20</span><span>30cm</span></div>' +
      '<p class="gauge-note">対応甲長めやす：' + esc((minCm > 0 ? minCm + "〜" : "") + noteMax) + "</p></div>";
  }

  /* ---------- CTA block (safety-gated) ---------- */
  function ctaHtml(item) {
    // UNSAFE / UNKNOWN → no CTA at all
    if (item.safety_label === "UNSAFE" || item.safety_label === "UNKNOWN") { return ""; }
    if (item.cta_enabled === false) { return ""; }

    var aff = item.affiliate || {};
    var locked = (item.safety_label === "CONDITIONAL"); // unlocked when detail opened
    var lockCls = locked ? " is-locked" : "";
    var hint = item.cta_channel_hint || "";

    function btn(kind, label, url) {
      var placeholder = !url;
      var cls = "cta cta-" + kind + (placeholder ? " is-placeholder" : "") + lockCls;
      var txt = placeholder ? (label + "（準備中）") : label;
      var href = placeholder ? "#" : esc(url);
      var aria = placeholder ? ' aria-disabled="true"' : "";
      return '<a class="' + cls + '" href="' + href + '"' + aria +
        ' data-eqid="' + esc(item.id) + '" data-channel="' + kind + '">' + esc(txt) + "</a>";
    }

    var buttons = "";
    // homecenter-only items: be honest that store is cheaper
    if (hint === "homecenter_pref") {
      buttons += btn("homecenter", "ホームセンターで探す", null);
    }
    buttons += btn("amazon", "Amazonで見る", aff.amazon);
    buttons += btn("rakuten", "楽天で見る", aff.rakuten);

    var gateMsg = locked
      ? '<p class="cta-gate-msg">条件を確認してから購入してください（上の「詳細・条件を見る」を開くとリンクが有効になります）。</p>'
      : "";

    return '<div class="cta-block" data-cta-for="' + esc(item.id) + '">' + gateMsg +
      '<div class="cta-row">' + buttons + "</div></div>";
  }

  /* ---------- detail (spec / conditions / risks / evidence) ---------- */
  function specHtml(item) {
    var rows = [];
    function row(dt, dd) { rows.push('<div><dt>' + esc(dt) + "</dt><dd>" + dd + "</dd></div>"); }
    var di = item.dim_internal, du = item.dim_usable;
    if (di && (di.w || di.d || di.h)) {
      row("実内寸", esc(di.w + "×" + di.d + "×" + di.h + (di.unit || "")));
    } else {
      row("実内寸", '<span class="tbc">要確認</span>' + (du && du.note ? "（" + esc(du.note) + "）" : ""));
    }
    if (du && du.note && (!di || !(di.w))) { /* note already shown */ }
    else if (du && du.note) { row("使用可寸", esc(du.note)); }
    row("対応甲長", esc(item.shell_min_cm + "〜" + (item.shell_max_cm >= 999 ? "上限なし" : item.shell_max_cm + "cm")));
    if (item.water_depth) { row("水深", esc((item.water_depth.rule || "") + (item.water_depth.note ? "／" + item.water_depth.note : ""))); }
    if (item.substrate_depth) { row("床材深", esc((item.substrate_depth.min || "") + "（" + (item.substrate_depth.rule || "") + "）")); }
    row("頭数", ({ single: "単独1頭", pair: "ペア可", area_additive: "面積を頭数分加算", temp_only: "一時のみ" })[item.animal_count] || esc(item.animal_count));
    return '<dl class="spec">' + rows.join("") + "</dl>";
  }

  function conditionsHtml(item) {
    if (!item.conditions || !item.conditions.length) { return ""; }
    return '<div class="conditions"><strong>使用条件</strong><ul>' +
      item.conditions.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul></div>";
  }

  function risksHtml(item) {
    if (!item.risk_warnings || !item.risk_warnings.length) { return ""; }
    var lis = item.risk_warnings.map(function (r) { return "<li>" + esc(r.text) + "</li>"; }).join("");
    var links = (item.linked_failures || []).map(function (fid) {
      var f = KID.failures.filter(function (x) { return x.id === fid; })[0];
      return f ? '<a href="#' + esc(fid) + '">関連する失敗：' + esc(f.title_ja) + "</a>" : "";
    }).filter(Boolean).join(" ・ ");
    return '<div class="risks"><strong>リスク警告</strong><ul>' + lis + "</ul>" + (links ? "<p>" + links + "</p>" : "") + "</div>";
  }

  function evidenceHtml(item) {
    if (!item.evidence || !item.evidence.length) { return ""; }
    var e = item.evidence[0];
    return '<p class="evidence-line">実飼育の参考：<a href="' + esc(e.url) + '" target="_blank" rel="noopener nofollow">' + esc(e.type + " / " + (e.region || "")) + "</a></p>";
  }

  /* ---------- owner photo (only when image.ok===true and path exists) ---------- */
  function imageHtml(item) {
    var im = item.image;
    if (!im || im.ok !== true || !im.path) { return ""; }
    var cap = im.caption ? '<figcaption class="card-photo-caption">' + esc(im.caption) + "</figcaption>" : "";
    return '<figure class="card-photo">' +
      '<img src="' + esc(im.path) + '" alt="' + esc(item.name_ja) + '（運営者の実飼育写真）"' +
      ' width="900" height="1200" loading="lazy"' +
      ' onerror="this.parentNode.style.display=\'none\'">' +
      cap + "</figure>";
  }

  /* ---------- full equipment card ---------- */
  function labelClass(l) { return "label label-" + l.toLowerCase(); }
  var LABEL_JA = { SAFE: "適正サイズなら常用可", CONDITIONAL: "条件付き — まず条件を確認", TEMPORARY: "一時利用のみ", UNSAFE: "推奨しません", UNKNOWN: "情報不足 — 要確認" };

  function cardHtml(item) {
    var head = '<div class="card-head"><h3>' + esc(item.name_ja) + "</h3>" +
      (item.drown_badge ? '<span class="drown-badge">溺死注意</span>' : "") +
      '<span class="' + labelClass(item.safety_label) + '">' + esc(LABEL_JA[item.safety_label] || item.safety_label) + "</span></div>";

    var gauge = gaugeHtml(item.shell_min_cm, item.shell_max_cm);
    var ks = kscoreHtml(item.kscore);

    var detail = '<div class="card-detail" id="detail-' + esc(item.id) + '">' +
      specHtml(item) + conditionsHtml(item) + risksHtml(item) + evidenceHtml(item) + "</div>";

    var toggle = '<button class="card-toggle" type="button" data-toggle="' + esc(item.id) + '" aria-expanded="false" aria-controls="detail-' + esc(item.id) + '">詳細・条件を見る ＋</button>';

    var cta = ctaHtml(item);

    var photo = imageHtml(item);

    return '<article class="kid-card" id="' + esc(item.id) + '" data-buckets="' + esc((item.shell_buckets || []).join(",")) + '">' +
      photo + head + gauge + ks + toggle + detail + cta + "</article>";
  }

  /* ---------- dangerous card ---------- */
  function dangerHtml(d) {
    var alt = "";
    if (d.alternative_id) {
      var a = KID.equipment.filter(function (x) { return x.id === d.alternative_id; })[0];
      if (a) { alt = '<p class="alt">代わりに：<a href="#' + esc(a.id) + '">' + esc(a.name_ja) + "</a></p>"; }
    }
    // NOTE: no CTA generated for dangerous items — by design.
    return '<div class="danger-card" id="' + esc(d.id) + '"><h3>🚫 ' + esc(d.name_ja) +
      '<span class="label label-unsafe">推奨しません</span></h3>' +
      "<p>" + esc(d.reason) + "</p>" + alt + "</div>";
  }

  /* ---------- failure card ---------- */
  function failHtml(f) {
    var sevCls = f.severity === "fatal" ? "sev-fatal" : "sev-serious";
    var sevTxt = ({ fatal: "致命的", serious: "重大", recoverable: "回復可" })[f.severity] || f.severity;
    var urg = ({ emergency_vet: "疑わしければ爬虫類対応の動物病院へ", monitor: "経過観察", adjust_setup: "環境を調整" })[f.urgency] || "";
    var owner = "";
    if (f.owner_note_flag && f.owner_note) {
      owner = '<div class="owner-note"><span class="on-tag">運営者亀好きさんの実体験</span>' + esc(f.owner_note) + "</div>";
    }
    return '<div class="fail-card" id="' + esc(f.id) + '"><div class="fail-head"><h3>' + esc(f.title_ja) +
      '</h3><span class="sev ' + sevCls + '">' + esc(sevTxt) + "</span></div>" +
      '<div class="fail-grid">' +
      '<div class="frow"><span class="flabel">症状</span>' + esc((f.symptoms || []).join("／")) + "</div>" +
      '<div class="frow"><span class="flabel">原因</span>' + esc(f.cause) + "</div>" +
      '<div class="frow"><span class="flabel">警告サイン</span>' + esc((f.warning_signs || []).join("／")) + "</div>" +
      '<div class="frow"><span class="flabel">回避</span>' + esc((f.prevention || []).join("／")) + "</div>" +
      "</div>" + owner +
      (urg ? '<p class="fail-urgent">⚠ ' + esc(urg) + "</p>" : "") + "</div>";
  }

  /* ---------- contested card ---------- */
  function contestHtml(c) {
    var conf = ({ settled: "ほぼ決着", leaning: "見解が寄っている", genuinely_open: "本当に未決着" })[c.field_confidence] || c.field_confidence;
    return '<div class="contest-card" id="' + esc(c.id) + '"><h3>' + esc(c.topic_ja) + "</h3>" +
      '<div class="claim"><span class="ctag">主張A</span>' + esc(c.claim_a) + "</div>" +
      '<div class="claim"><span class="ctag">対立する主張B</span>' + esc(c.claim_b) + "</div>" +
      '<div class="safe-side"><strong>KIDの安全側の推奨</strong>' + esc(c.safe_side_default) + "</div>" +
      '<p class="field-conf">この論点の状況：' + esc(conf) + "</p></div>";
  }

  /* ---------- render all ---------- */
  function renderAll() {
    var eqWrap = document.getElementById("kid-equipment");
    var dgWrap = document.getElementById("kid-dangerous");
    var flWrap = document.getElementById("kid-failures");
    var ctWrap = document.getElementById("kid-contested");

    if (eqWrap) { eqWrap.innerHTML = KID.equipment.map(cardHtml).join(""); }
    if (dgWrap) { dgWrap.innerHTML = KID.dangerous.map(dangerHtml).join(""); }
    if (flWrap) { flWrap.innerHTML = KID.failures.map(failHtml).join(""); }
    if (ctWrap) { ctWrap.innerHTML = KID.contested.map(contestHtml).join(""); }
  }

  /* ---------- reverse lookup filter ---------- */
  var activeBucket = null;

  function applyFilter(bucket) {
    activeBucket = bucket;
    var cards = document.querySelectorAll("#kid-equipment .kid-card");
    var groupNote = document.getElementById("kid-result-note");
    var shown = 0;
    cards.forEach(function (card) {
      var buckets = (card.getAttribute("data-buckets") || "").split(",");
      var match = !bucket || buckets.indexOf(bucket) !== -1;
      card.style.display = match ? "" : "none";
      if (match) { shown++; }
    });
    if (groupNote) {
      if (!bucket) { groupNote.textContent = "安いけど、狭かったら意味がない。まずは全部を並べています。上で甲長を選ぶと、うちの子に合うものだけに絞れます。"; }
      else {
        var b = KID.buckets[bucket];
        groupNote.textContent = "甲長 " + b.label + " に今使えるもの：" + shown + "件。ここに出ていないものは「そろそろ卒業」か「次に買う」対象です。";
      }
    }
    var clear = document.getElementById("selector-clear");
    if (clear) { clear.classList.toggle("is-shown", !!bucket); }
  }

  /* ---------- events ---------- */
  function bind() {
    // bucket selection
    document.querySelectorAll(".bucket-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var b = btn.getAttribute("data-bucket");
        var already = btn.classList.contains("is-active");
        document.querySelectorAll(".bucket-btn").forEach(function (x) { x.classList.remove("is-active"); });
        if (already) { applyFilter(null); return; }
        btn.classList.add("is-active");
        applyFilter(b);
        ga("kid_shell_lookup", { bucket: b });
      });
    });
    var clear = document.getElementById("selector-clear");
    if (clear) {
      clear.addEventListener("click", function () {
        document.querySelectorAll(".bucket-btn").forEach(function (x) { x.classList.remove("is-active"); });
        applyFilter(null);
      });
    }
    // card expand + CONDITIONAL CTA unlock
    document.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target.closest("[data-toggle]") : null;
      if (!t) { return; }
      var id = t.getAttribute("data-toggle");
      var detail = document.getElementById("detail-" + id);
      if (!detail) { return; }
      var open = detail.classList.toggle("is-open");
      t.setAttribute("aria-expanded", open ? "true" : "false");
      t.textContent = open ? "詳細・条件を閉じる −" : "詳細・条件を見る ＋";
      // unlock CONDITIONAL CTA once conditions are visible
      if (open) {
        var block = document.querySelector('[data-cta-for="' + id + '"]');
        if (block) {
          block.querySelectorAll(".cta.is-locked").forEach(function (a) { a.classList.remove("is-locked"); });
        }
        ga("kid_card_expand", { equipment_id: id });
      }
    });
    // affiliate click (only fires for real, non-placeholder links)
    document.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest(".cta") : null;
      if (!a) { return; }
      if (a.classList.contains("is-placeholder") || a.classList.contains("is-locked")) { return; }
      ga("affiliate_click", { equipment_id: a.getAttribute("data-eqid"), channel: a.getAttribute("data-channel"), source: "kid" });
    });
  }

  function init() {
    renderAll();
    bind();
    applyFilter(null);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
