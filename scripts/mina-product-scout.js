'use strict';

/**
 * mina-product-scout.js
 *
 * 「ミナのいいものメモ」第1号 商品個体確定のための一時探索スクリプト。
 *
 * 目的:
 *   楽天市場から「USB充電式ハンディヒートシーラー」の候補を自動探索し、
 *   楽天公式 API（一次データ）の実値だけで採点し、1個体を自動確定する。
 *
 * 重要な設計方針:
 *   - 値は楽天 Ichiba Item Search API のレスポンスをそのまま使う。推測値を書かない。
 *   - API が返さない項目（通常価格・割引率など）は NOT_DISPLAYED として明示する。
 *   - 採点は完全に決定的（同じ入力なら同じ順位）。特定商品を事前に優遇しない。
 *   - 秘匿情報（applicationId / accessKey）は出力に一切含めない。
 *     affiliateUrl は公開前提の値であり data/products.js と同じ扱いで保存する。
 *
 * 本スクリプトは調査用であり、data/products.js を含む本番データを一切書き換えない。
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const APP_ID       = process.env.RAKUTEN_APP_ID       || '';
const ACCESS_KEY   = process.env.RAKUTEN_ACCESS_KEY   || '';
const AFFILIATE_ID = process.env.RAKUTEN_AFFILIATE_ID || '';

// update-rakuten.js と同一のエンドポイント（2026 移行版）
const API_HOST = 'openapi.rakuten.co.jp';
const API_PATH = '/ichibams/api/IchibaItem/Search/20260701';

const OUT_DIR = path.join('qc-evidence', 'mina-product-001');

// 指示で与えられた検索語。1語だけに依存しないよう4語を横断する。
const QUERIES = [
  'USB 充電式 ハンディシーラー',
  'USB充電 ヒートシーラー',
  'ハンディシーラー 充電式 カッター',
  '袋 シーラー USB 温度調節',
];

const HITS_PER_QUERY = 30;   // API 上限
const REQUEST_GAP_MS = 1200; // レート制限に配慮

// ─── ユーティリティ ───────────────────────────────────────────

function sleep(ms) {
  return new Promise(function(r) { setTimeout(r, ms); });
}

/** 秘匿値がログへ出るのを防ぐ。 */
function redact(s) {
  let out = String(s == null ? '' : s);
  [APP_ID, ACCESS_KEY].forEach(function(v) {
    if (v) out = out.split(v).join('***REDACTED***');
  });
  return out.replace(/(applicationId|accessKey)=[^&\s]*/gi, '$1=***REDACTED***');
}

function fail(msg) {
  console.error('FATAL: ' + redact(msg));
  process.exit(1);
}

// ─── 楽天 API ────────────────────────────────────────────────

function rakutenSearch(keyword, page) {
  return new Promise(function(resolve, reject) {
    const params = new URLSearchParams({
      applicationId: APP_ID,
      accessKey:     ACCESS_KEY,
      affiliateId:   AFFILIATE_ID,
      keyword:       keyword,
      hits:          String(HITS_PER_QUERY),
      page:          String(page || 1),
      sort:          '-reviewCount', // レビュー実績の厚い順
      imageFlag:     '1',            // 画像ありのみ
      availability:  '1',            // 在庫ありのみ
    });
    const req = https.request({
      hostname: API_HOST,
      path:     API_PATH + '?' + params.toString(),
      method:   'GET',
      headers:  {
        'Accept':  'application/json',
        'Origin':  'https://gagalife04291225-lab.github.io',
        'Referer': 'https://gagalife04291225-lab.github.io/',
      },
    }, function(res) {
      let data = '';
      res.on('data', function(c) { data += c; });
      res.on('end', function() {
        const status = res.statusCode || 0;
        if (status !== 200) {
          return reject(new Error('HTTP ' + status + ' for keyword=' + keyword));
        }
        let parsed;
        try { parsed = JSON.parse(data); }
        catch (e) { return reject(new Error('JSON parse failed for keyword=' + keyword)); }
        const items = parsed.Items || parsed.items || [];
        resolve(Array.isArray(items) ? items : []);
      });
    });
    req.on('error', function(e) { reject(new Error('network: ' + e.message)); });
    req.setTimeout(20000, function() { req.destroy(new Error('timeout')); });
    req.end();
  });
}

/** API のレスポンス形状差（Item ラップの有無）を吸収する。 */
function unwrap(entry) {
  return (entry && entry.Item) ? entry.Item : entry;
}

function firstImage(item) {
  const pools = [item.mediumImageUrls, item.largeImageUrls, item.smallImageUrls];
  for (let i = 0; i < pools.length; i++) {
    const p = pools[i];
    if (Array.isArray(p) && p.length) {
      const v = p[0];
      const url = (v && typeof v === 'object') ? (v.imageUrl || v.url) : v;
      if (url) return String(url).replace(/\?_ex=\d+x\d+$/, '');
    }
  }
  return null;
}

// ─── 仕様判定（商品名 + 商品説明文からの機械抽出）───────────────

const RE = {
  usb:       /USB.{0,8}充電|Type-?C.{0,8}充電|充電式|USB充電/i,
  preheat:   /予熱不要|余熱不要|予熱いらず|余熱いらず|予熱なし|余熱なし|プレヒート不要|すぐ使える/,
  tempMulti: /[0-9０-９]\s*段階.{0,10}(温度|調節|調整)|温度.{0,10}[0-9０-９]\s*段階|温度調[節整]/,
  tempAny:   /温度/,
  cutter:    /カッター|カット機能|2\s*in\s*1|2IN1|開封.{0,6}密封|密封.{0,6}開封/i,
  magnet:    /マグネット|磁石|冷蔵庫.{0,8}貼/,
  handy:     /ハンディ|手持ち|片手|コンパクト|小型|ミニ|携帯|軽量|手のひら/,
  bulky:     /卓上|業務用|据置|据え置き|足踏み|インパルスシーラー|300mm|400mm/,
  sealer:    /シーラー|シール器|密封機|圧着|ヒートシール/,
  vacuumOnly:/真空パック機|真空包装機/,
  size:      /([0-9]{1,3}(?:\.[0-9])?)\s*[×xX*✕]\s*([0-9]{1,3}(?:\.[0-9])?)\s*[×xX*✕]\s*([0-9]{1,3}(?:\.[0-9])?)\s*(cm|mm|センチ)/,
};

function detectSpecs(name, caption) {
  const t = (name || '') + '\n' + (caption || '');
  const sizeM = t.match(RE.size);
  return {
    usbCharge:   RE.usb.test(t),
    preheatFree: RE.preheat.test(t),
    tempMulti:   RE.tempMulti.test(t),
    tempAny:     RE.tempAny.test(t),
    cutter:      RE.cutter.test(t),
    magnet:      RE.magnet.test(t),
    handheld:    RE.handy.test(t),
    bulky:       RE.bulky.test(t),
    isSealer:    RE.sealer.test(t),
    vacuumOnly:  RE.vacuumOnly.test(t) && !RE.handy.test(t),
    sizeText:    sizeM ? sizeM[0] : null,
  };
}

// ─── 採点（100点満点・Owner 指定の配点をそのまま実装）─────────────
//   A 動画実演力 25 / B USB充電式 10 / C 予熱不要 10 / D 温度調整 10
//   E カッター2in1 10 / F マグネット 5 / G 小型・片手 10
//   H レビュー実績 10 / I 価格競争力 5 / J 店舗・ページ信頼性 5

function score(c) {
  const s = c.specs;
  const b = {};

  // A: 5〜10秒で密封実演が成立するか。
  //    手持ちスライド式であることが前提（卓上・業務用は実演の絵にならない）。
  let a = 0;
  if (s.isSealer && s.handheld && !s.bulky) a += 15;
  else if (s.isSealer && !s.bulky)          a += 8;
  else                                       a += 0;
  if (s.preheatFree) a += 5; // 待ち時間ゼロ＝短尺で成立する決定要因
  if (s.cutter)      a += 3; // 開封→密封が1本で撮れる
  if (s.magnet)      a += 2; // 冷蔵庫に貼るオチのカットが足せる
  b.A_demo = Math.min(a, 25);

  b.B_usb    = s.usbCharge ? 10 : 0;
  b.C_preheat = s.preheatFree ? 10 : 0;
  b.D_temp   = s.tempMulti ? 10 : (s.tempAny ? 5 : 0);
  b.E_cutter = s.cutter ? 10 : 0;
  b.F_magnet = s.magnet ? 5 : 0;

  let g = 0;
  if (s.handheld && !s.bulky) g = 10;
  else if (s.handheld)        g = 5;
  else if (!s.bulky)          g = 3;
  b.G_compact = g;

  // H: レビュー実績。件数で階段配点し、平均が低い商品は半減させる。
  const rc = c.reviewCount, ra = c.reviewAverage;
  let h = 0;
  if      (rc >= 200) h = 10;
  else if (rc >= 100) h = 8;
  else if (rc >= 50)  h = 6;
  else if (rc >= 20)  h = 4;
  else if (rc >= 5)   h = 2;
  else if (rc >= 1)   h = 1;
  if (rc > 0 && ra > 0 && ra < 3.5) h = Math.floor(h / 2);
  b.H_review = h;

  // I: 価格競争力。第1号の指定レンジ 1,000〜3,000円を最上位に置く。
  const p = c.price;
  let i = 0;
  if      (p >= 1000 && p <= 3000) i = 5;
  else if (p > 3000 && p <= 4000)  i = 3;
  else if (p > 0 && p < 1000)      i = 4;
  else if (p > 4000)               i = 1;
  b.I_price = i;

  // J: 販売店・商品ページの信頼性。API から機械的に取れる範囲のみで判定する。
  let j = 0;
  if (c.shopName && c.itemUrl && c.availability === 1) j += 3;
  if (ra >= 4.0 && rc >= 10) j += 1;
  if (c.postageFlag === 0)   j += 1; // 送料無料
  b.J_trust = Math.min(j, 5);

  const total = Object.keys(b).reduce(function(acc, k) { return acc + b[k]; }, 0);
  return { breakdown: b, total: total };
}

/** 同点時: 動画実演力 → レビュー実績 → 価格(安い順) → 仕様充実度 */
function compare(x, y) {
  if (y.score.total !== x.score.total)         return y.score.total - x.score.total;
  if (y.score.breakdown.A_demo !== x.score.breakdown.A_demo)
    return y.score.breakdown.A_demo - x.score.breakdown.A_demo;
  if (y.score.breakdown.H_review !== x.score.breakdown.H_review)
    return y.score.breakdown.H_review - x.score.breakdown.H_review;
  if (x.price !== y.price)                     return x.price - y.price;
  const specSum = function(c) {
    const b = c.score.breakdown;
    return b.B_usb + b.C_preheat + b.D_temp + b.E_cutter + b.F_magnet + b.G_compact;
  };
  return specSum(y) - specSum(x);
}

// ─── メイン ─────────────────────────────────────────────────

async function main() {
  if (!APP_ID)       fail('RAKUTEN_APP_ID is not set');
  if (!AFFILIATE_ID) fail('RAKUTEN_AFFILIATE_ID is not set');

  const byItemCode = new Map();
  const queryLog   = [];

  for (let qi = 0; qi < QUERIES.length; qi++) {
    const q = QUERIES[qi];
    let items = [];
    let err   = null;
    try {
      items = await rakutenSearch(q, 1);
    } catch (e) {
      err = redact(e.message);
    }
    queryLog.push({ keyword: q, returned: items.length, error: err });
    console.log('query="' + q + '" returned=' + items.length + (err ? ' error=' + err : ''));

    items.forEach(function(entry) {
      const it = unwrap(entry);
      if (!it || !it.itemCode) return;
      if (byItemCode.has(it.itemCode)) {
        byItemCode.get(it.itemCode)._hitQueries.push(q);
        return;
      }
      const name    = String(it.itemName || '');
      const caption = String(it.itemCaption || '');
      const specs   = detectSpecs(name, caption);

      byItemCode.set(it.itemCode, {
        itemCode:      it.itemCode,
        itemName:      name,
        shopName:      String(it.shopName || ''),
        shopUrl:       it.shopUrl || null,
        itemUrl:       it.itemUrl || null,
        affiliateUrl:  it.affiliateUrl || null,
        price:         Number(it.itemPrice || 0),
        // 楽天 Ichiba Item Search API は「通常価格 / 割引前価格」を返さない。
        // 推測せず NOT_DISPLAYED を明示する。
        listPrice:     'NOT_DISPLAYED',
        discountRate:  'NOT_DISPLAYED',
        reviewCount:   Number(it.reviewCount || 0),
        reviewAverage: Number(it.reviewAverage || 0),
        availability:  Number(it.availability),
        postageFlag:   (it.postageFlag === undefined ? null : Number(it.postageFlag)),
        imageUrl:      firstImage(it),
        captionExcerpt: caption.replace(/\s+/g, ' ').slice(0, 700),
        specs:         specs,
        _hitQueries:   [q],
      });
    });

    if (qi < QUERIES.length - 1) await sleep(REQUEST_GAP_MS);
  }

  const all = Array.from(byItemCode.values());
  console.log('unique items collected: ' + all.length);

  // 対象カテゴリ外を除外する。除外理由を必ず残す（黙って捨てない）。
  const excluded = [];
  const pool = all.filter(function(c) {
    let reason = null;
    if (!c.specs.isSealer)      reason = 'not_a_sealer';
    else if (c.specs.bulky)     reason = 'bulky_desktop_or_industrial';
    else if (c.specs.vacuumOnly)reason = 'vacuum_packer_not_handheld';
    else if (!c.itemUrl)        reason = 'no_item_url';
    else if (!c.imageUrl)       reason = 'no_primary_image';
    else if (!c.affiliateUrl)   reason = 'no_affiliate_url';
    if (reason) {
      excluded.push({ itemCode: c.itemCode, itemName: c.itemName.slice(0, 60), reason: reason });
      return false;
    }
    return true;
  });

  pool.forEach(function(c) {
    c.score = score(c);
    c.hitQueries = c._hitQueries;
    delete c._hitQueries;
  });
  pool.sort(compare);

  if (pool.length < 5) {
    console.log('::warning::candidate pool smaller than 5 (' + pool.length + ')');
  }

  const selected = pool[0] || null;

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const meta = {
    generatedAtUtc: new Date().toISOString(),
    source: 'Rakuten Ichiba Item Search API (' + API_HOST + API_PATH + ')',
    evidenceClass: 'VERIFIED (楽天公式APIの一次データ)',
    apiFilters: { availability: 1, imageFlag: 1, sort: '-reviewCount', hitsPerQuery: HITS_PER_QUERY },
    queries: queryLog,
    uniqueItemsCollected: all.length,
    candidatePoolSize: pool.length,
    excludedCount: excluded.length,
    notes: [
      '楽天 Ichiba Item Search API は割引前価格（通常価格）を返さないため、listPrice / discountRate は NOT_DISPLAYED。',
      'availability=1 で絞り込んでいるため、収録された全候補は取得時点で在庫あり。',
      '仕様フラグは商品名と商品説明文（itemCaption）に対する機械抽出であり、出典は楽天の商品データ。',
    ],
  };

  fs.writeFileSync(
    path.join(OUT_DIR, 'candidates.json'),
    JSON.stringify({ meta: meta, candidates: pool, excluded: excluded }, null, 2) + '\n'
  );
  fs.writeFileSync(
    path.join(OUT_DIR, 'selected-product.json'),
    JSON.stringify({ meta: meta, selected: selected }, null, 2) + '\n'
  );

  // ── evidence.md（人間が読む採点根拠）──
  const rows = pool.slice(0, 12).map(function(c, i) {
    const b = c.score.breakdown;
    return '| ' + (i + 1) + ' | ' + c.score.total + ' | ' + c.itemName.slice(0, 38).replace(/\|/g, '/')
      + ' | ' + c.shopName.replace(/\|/g, '/') + ' | ¥' + c.price
      + ' | ' + c.reviewCount + ' | ' + c.reviewAverage
      + ' | ' + b.A_demo + ' | ' + b.B_usb + ' | ' + b.C_preheat + ' | ' + b.D_temp
      + ' | ' + b.E_cutter + ' | ' + b.F_magnet + ' | ' + b.G_compact
      + ' | ' + b.H_review + ' | ' + b.I_price + ' | ' + b.J_trust + ' |';
  }).join('\n');

  const md = [
    '# ミナのいいものメモ 第1号 — 楽天市場 商品個体 自動探索・採点記録',
    '',
    '- 生成: ' + meta.generatedAtUtc + ' (UTC)',
    '- 取得元: 楽天 Ichiba Item Search API（公式一次データ / EVIDENCE = VERIFIED）',
    '- 検索語: ' + QUERIES.map(function(q) { return '`' + q + '`'; }).join(' / '),
    '- API フィルタ: availability=1（在庫あり）, imageFlag=1（画像あり）, sort=-reviewCount',
    '- ユニーク取得: ' + all.length + ' 件 → 候補プール: ' + pool.length + ' 件 / 除外: ' + excluded.length + ' 件',
    '',
    '## 採点配点（Owner 指定）',
    '',
    'A 動画実演力 25 / B USB充電式 10 / C 予熱不要 10 / D 温度調整 10 / E カッター2in1 10 /',
    'F マグネット 5 / G 小型・片手 10 / H レビュー実績 10 / I 価格競争力 5 / J 店舗信頼性 5',
    '',
    '同点時の決定順: 動画実演力 → レビュー実績 → 価格（安い順） → 仕様充実度',
    '',
    '## 候補一覧（上位）',
    '',
    '| # | 合計 | 商品名 | 店舗 | 価格 | ﾚﾋﾞｭｰ数 | 平均 | A | B | C | D | E | F | G | H | I | J |',
    '|---|------|--------|------|------|---------|------|---|---|---|---|---|---|---|---|---|---|',
    rows,
    '',
    '## 除外した商品と理由',
    '',
    excluded.length
      ? excluded.map(function(e) { return '- `' + e.reason + '` — ' + e.itemName; }).join('\n')
      : '（なし）',
    '',
    '## 価格表示について',
    '',
    '楽天 Ichiba Item Search API は割引前価格（通常価格）を返さない。',
    'したがって本記録の全候補について 通常価格 / 割引率 は **NOT_DISPLAYED** とする。推測値は記載しない。',
    '',
  ].join('\n');

  fs.writeFileSync(path.join(OUT_DIR, 'evidence.md'), md);

  // ── 秘匿値の混入検査（出力を実際に読み直して検証する）──
  //
  // 一致が出た場合は「どこで一致したか」を必ず診断出力する。
  // 原因を推測で塞ぐと、本物の漏洩と偶然の部分一致を区別できなくなるため。
  // 出力時は秘匿値そのものを «SECRET» に置換し、周辺文脈だけを見せる。
  function leakContexts(body, needle) {
    const out = [];
    let idx = body.indexOf(needle);
    while (idx !== -1 && out.length < 5) {
      const s = Math.max(0, idx - 100);
      const e = Math.min(body.length, idx + needle.length + 100);
      out.push(body.slice(s, e).split(needle).join('«SECRET»'));
      idx = body.indexOf(needle, idx + needle.length);
    }
    return out;
  }

  console.log('secret-scan: appIdLength=' + APP_ID.length
    + ' accessKeyLength=' + ACCESS_KEY.length
    + ' affiliateIdLength=' + AFFILIATE_ID.length);

  let leakFound = false;
  ['candidates.json', 'selected-product.json', 'evidence.md'].forEach(function(f) {
    const body = fs.readFileSync(path.join(OUT_DIR, f), 'utf8');
    [['RAKUTEN_APP_ID', APP_ID], ['RAKUTEN_ACCESS_KEY', ACCESS_KEY]].forEach(function(pair) {
      const label = pair[0], val = pair[1];
      if (!val || !body.includes(val)) return;
      leakFound = true;
      console.error('LEAK-DIAG ' + f + ' matched ' + label
        + ' (len=' + val.length + ', occurrences=' + body.split(val).length + ')');
      leakContexts(body, val).forEach(function(ctx, i) {
        console.error('  context[' + i + ']: ' + ctx.replace(/\s+/g, ' '));
      });
    });
    if (/applicationId=|accessKey=/i.test(body)) {
      leakFound = true;
      console.error('LEAK-DIAG ' + f + ' contains a credential query parameter');
    }
  });
  if (leakFound) fail('credential material present in generated files — see LEAK-DIAG above');
  console.log('OK: no credentials found in generated files');

  // ── ジョブログ / サマリへ結果を出す（コンテナ側から API 経由で読めるように）──
  if (selected) {
    const b = selected.score.breakdown;
    const summary = {
      total: selected.score.total,
      breakdown: b,
      itemName: selected.itemName,
      shopName: selected.shopName,
      itemUrl: selected.itemUrl,
      affiliateUrl: selected.affiliateUrl,
      price: selected.price,
      listPrice: selected.listPrice,
      discountRate: selected.discountRate,
      reviewCount: selected.reviewCount,
      reviewAverage: selected.reviewAverage,
      availability: selected.availability,
      postageFlag: selected.postageFlag,
      imageUrl: selected.imageUrl,
      specs: selected.specs,
    };
    console.log('=== SELECTED ===');
    console.log(JSON.stringify(summary, null, 2));
    if (process.env.GITHUB_STEP_SUMMARY) {
      fs.appendFileSync(
        process.env.GITHUB_STEP_SUMMARY,
        '## ミナ第1号 自動選定結果\n\n```json\n' + JSON.stringify(summary, null, 2) + '\n```\n'
      );
    }
  } else {
    console.log('::error::no candidate survived filtering');
    process.exit(1);
  }

  console.log('=== TOP 10 ===');
  pool.slice(0, 10).forEach(function(c, i) {
    console.log((i + 1) + '. [' + c.score.total + '] ¥' + c.price
      + ' rc=' + c.reviewCount + ' ra=' + c.reviewAverage
      + ' | ' + c.shopName + ' | ' + c.itemName.slice(0, 50));
  });
}

main().catch(function(e) { fail(e && e.stack ? e.stack : String(e)); });
