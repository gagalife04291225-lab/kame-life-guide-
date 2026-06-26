#!/usr/bin/env node
/**
 * Kame Life Guide — Rakuten Sync Engine
 * scripts/update-rakuten.js
 *
 * Runs in GitHub Actions (Node.js, server-side only).
 * Reads: data/products.js
 * Writes: data/products.js (Rakuten fields only)
 *
 * Secrets via env vars ONLY — never hardcoded, never logged.
 * Products.js remains valid JS after write.
 */

'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');

// ─── Config ───────────────────────────────────────────────────
const APP_ID       = process.env.RAKUTEN_APP_ID;
const ACCESS_KEY   = process.env.RAKUTEN_ACCESS_KEY;
const AFFILIATE_ID = process.env.RAKUTEN_AFFILIATE_ID;
const PRODUCTS_PATH = path.resolve(__dirname, '../data/products.js');

// Confidence threshold to upgrade search → available
const CONFIDENCE_THRESHOLD = 8.0;

// Rakuten Ichiba Item Search API endpoint (2026 migration)
const RAKUTEN_API_HOST = 'openapi.rakuten.co.jp';
const RAKUTEN_API_PATH = '/ichibams/api/IchibaItem/Search/20220601';

// Category keyword guards (reject items clearly in wrong category)
const CATEGORY_GUARDS = {
  lighting_uvb:     ['UVB', '紫外線', 'ランプ', 'ライト', 'T5', 'T8'],
  lighting_basking: ['バスキング', 'ハロゲン', 'セラミック', 'ランプ', '電球'],
  filter:           ['フィルター', 'ポンプ', 'ろ過'],
  enclosure:        ['ケージ', '水槽', 'ケース', '爬虫類'],
  substrate:        ['床材', '土', 'サンド', 'マット', 'バーク', 'マルチ'],
  heating:          ['ヒーター', '保温', 'パネル'],
  shelter:          ['シェルター', '隠れ家', 'コルク'],
  food:             ['フード', '餌', 'エサ', 'ペレット'],
  supplements:      ['カルシウム', 'サプリ', 'ビタミン'],
  thermometer:      ['温度計', 'サーモ', '温湿度'],
};

// ─── Secrets validation ───────────────────────────────────────
function validateSecrets() {
  const missing = [];
  if (!APP_ID)       missing.push('RAKUTEN_APP_ID');
  if (!ACCESS_KEY)   missing.push('RAKUTEN_ACCESS_KEY');
  if (!AFFILIATE_ID) missing.push('RAKUTEN_AFFILIATE_ID');
  if (missing.length) {
    // Log names only — never values
    console.error('[FATAL] Missing required env vars:', missing.join(', '));
    process.exit(1);
  }
}

// ─── products.js loader ───────────────────────────────────────
function loadProducts() {
  const src = fs.readFileSync(PRODUCTS_PATH, 'utf8');

  // Extract the PRODUCTS object literal via sandboxed eval
  // We run in a throwaway vm context so no side effects
  const vm = require('vm');
  const ctx = vm.createContext({});
  // products.js uses const — rewrite for vm scope
  const safe = src.replace(/\bconst\b/g, 'var');
  vm.runInContext(safe, ctx);
  return { src, products: ctx.PRODUCTS };
}

// ─── Rakuten API fetch ────────────────────────────────────────
function rakutenSearch(searchTerm, maxItems) {
  return new Promise(function(resolve, reject) {
    const params = new URLSearchParams({
      applicationId: APP_ID,
      accessKey:     ACCESS_KEY,
      affiliateId:   AFFILIATE_ID,
      keyword:       searchTerm,
      hits:          String(maxItems || 10),
      sort:          '-reviewCount',    // High-review items first
      imageFlag:     '1',
      availability:  '1',              // In-stock only
    });
    const options = {
      hostname: RAKUTEN_API_HOST,
      path:     RAKUTEN_API_PATH + '?' + params.toString(),
      method:   'GET',
      headers:  {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + ACCESS_KEY,
        'Origin': 'https://gagalife04291225-lab.github.io',
        'Referer': 'https://gagalife04291225-lab.github.io/kame-life-guide-/',
      },
    };
    const req = https.request(options, function(res) {
      let data = '';
      res.on('data', function(chunk) { data += chunk; });
      res.on('end', function() {
        try {
          resolve(JSON.parse(data));
        } catch(e) {
          reject(new Error('JSON parse failed: ' + e.message));
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(10000, function() {
      req.destroy();
      reject(new Error('Request timeout for: ' + searchTerm));
    });
    req.end();
  });
}

// ─── Scoring ─────────────────────────────────────────────────
function scoreCandidate(item, product) {
  const price       = item.itemPrice || 0;
  const rating      = item.reviewAverage || 0;
  const reviewCount = item.reviewCount || 0;
  const shipping    = item.postageFlag === 0;  // 0 = free
  const shopName    = (item.shopName || '').toLowerCase();
  const itemName    = (item.itemName || '').toLowerCase();
  const category    = product.category || '';

  // ── Category guard: reject wrong-category items ───────────
  const guards = CATEGORY_GUARDS[category] || [];
  const nameAndShop = (item.itemName || '') + ' ' + (item.shopName || '');
  if (guards.length > 0) {
    const matched = guards.some(function(kw) {
      return nameAndShop.includes(kw);
    });
    if (!matched) return null;  // Hard reject
  }

  // ── Price score (lower is better; reject if < ¥100 or suspicious) ──
  if (price < 100 || price > 500000) return null;
  // Parse expected price range from priceRange field, e.g. "¥3,000–6,000"
  const priceMatch = (product.priceRange || '').replace(/[¥,]/g, '').match(/(\d+)[^\d]+(\d+)/);
  let priceScore = 5;
  if (priceMatch) {
    const low  = parseInt(priceMatch[1], 10);
    const high = parseInt(priceMatch[2], 10);
    const mid  = (low + high) / 2;
    // Reject extreme outliers (less than 20% of expected or more than 5x expected)
    if (price < low * 0.2 || price > high * 5) return null;
    if      (price <= mid * 0.9)  priceScore = 10;
    else if (price <= mid * 1.1)  priceScore = 8;
    else if (price <= high)       priceScore = 6;
    else                          priceScore = 3;
  }

  // ── Rating score ──────────────────────────────────────────
  let ratingScore;
  if      (rating >= 4.5) ratingScore = 10;
  else if (rating >= 4.2) ratingScore = 8;
  else if (rating >= 3.8) ratingScore = 6;
  else if (rating >= 3.0) ratingScore = 4;
  else                    ratingScore = 2;

  // ── Review count score ────────────────────────────────────
  let reviewScore;
  if      (reviewCount >= 100) reviewScore = 10;
  else if (reviewCount >= 50)  reviewScore = 8;
  else if (reviewCount >= 20)  reviewScore = 6;
  else if (reviewCount >= 5)   reviewScore = 4;
  else                         reviewScore = 2;

  // ── Shipping score ────────────────────────────────────────
  const shippingScore = shipping ? 10 : 4;

  // ── Shop trust score ──────────────────────────────────────
  const trustedShops = ['charm', 'charapetshop', 'reptile', '爬虫類', 'viva', 'discoveranimals',
                        'rakuten24', '正規', 'official', 'メーカー直営', 'ペットの専門店'];
  const suspectedBad = ['中国', 'china', '激安', 'test', '在庫処分', 'わけあり'];
  let shopScore = 5;
  if (suspectedBad.some(function(kw) { return shopName.includes(kw); })) {
    return null;  // Hard reject suspicious seller
  }
  if (trustedShops.some(function(kw) { return shopName.includes(kw) || itemName.includes(kw); })) {
    shopScore = 9;
  }

  // ── Final score ───────────────────────────────────────────
  const score =
    (priceScore    * 0.35) +
    (ratingScore   * 0.25) +
    (reviewScore   * 0.20) +
    (shippingScore * 0.10) +
    (shopScore     * 0.10);

  return Math.round(score * 10) / 10;
}

// ─── URL builder (affiliate URLs only) ───────────────────────
// Returns ONLY commission-capable affiliateUrl (hb.afl.rakuten.co.jp).
// Plain itemUrl is intentionally NOT returned — no commission without affiliateUrl.
function buildAffiliateUrl(itemUrl, affiliateUrl) {
  if (affiliateUrl &&
      typeof affiliateUrl === 'string' &&
      affiliateUrl.includes('rakuten') &&
      affiliateUrl.length > 10) {
    return affiliateUrl;
  }
  return null;  // Never promote to available with plain itemUrl
}

// ─── Patch a single product's Rakuten fields in source ───────
// Modifies ONLY the Rakuten block within the product's definition.
// All other fields are left byte-for-byte identical.
function patchProductInSource(src, productId, updates) {
  // Locate the product block by its ID string
  const openPattern = '  ' + productId + ': {';
  const startIdx = src.indexOf(openPattern);
  if (startIdx === -1) return src;

  // Find the closing '  },' of this product block
  let endIdx = src.indexOf('\n  },\n', startIdx);
  if (endIdx === -1) endIdx = src.indexOf('\n  }\n', startIdx);
  if (endIdx === -1) return src;

  const blockEnd = endIdx + 6;  // include \n  },\n
  let block = src.slice(startIdx, blockEnd);

  // Fields we are allowed to modify
  const ALLOWED_FIELDS = [
    'rakutenUrl', 'rakutenStatus', 'rakutenSearchTerm',
    'rakutenPrice', 'rakutenShop', 'rakutenConfidence', 'rakutenLastUpdated',
  ];

  // Update or add each field
  ALLOWED_FIELDS.forEach(function(field) {
    if (!(field in updates)) return;
    const val = updates[field];
    const jsVal = (val === null) ? 'null'
                : (typeof val === 'number') ? String(val)
                : '\'' + String(val).replace(/'/g, "\\'") + '\'';

    const fieldPattern = new RegExp('    ' + field + ': (?:null|\'[^\']*\'|\\d+(?:\\.\\d+)?),');
    if (fieldPattern.test(block)) {
      block = block.replace(fieldPattern, '    ' + field + ': ' + jsVal + ',');
    } else {
      // Field doesn't exist yet — insert before closing brace
      block = block.replace(/(\n  },)/, '\n    ' + field + ': ' + jsVal + ',$1');
    }
  });

  return src.slice(0, startIdx) + block + src.slice(blockEnd);
}

// ─── Rate limiter (Rakuten API: 1 req/sec safe) ───────────────
function sleep(ms) {
  return new Promise(function(resolve) { setTimeout(resolve, ms); });
}

// ─── Main ─────────────────────────────────────────────────────
async function main() {
  validateSecrets();
  console.log('[rakuten-sync] Starting — ' + new Date().toISOString());

  const { src, products } = loadProducts();
  const today = new Date().toISOString().slice(0, 10);

  // Collect candidates: status === "search" or "available"
  const targets = Object.entries(products).filter(function(entry) {
    const p = entry[1];
    return p && (p.rakutenStatus === 'search' || p.rakutenStatus === 'available');
  });

  console.log('[rakuten-sync] Targets: ' + targets.length);

  const report = {
    updated: 0,
    available: 0,
    searchFallback: 0,
    skipped: Object.keys(products).length - targets.length,
    changed: [],
  };

  let currentSrc = src;

  for (const [productId, product] of targets) {
    const searchTerm = product.rakutenSearchTerm || product.name;
    if (!searchTerm) {
      console.log('[SKIP] No search term: ' + productId);
      report.skipped++;
      continue;
    }

    await sleep(1100);  // Stay within Rakuten API rate limits

    let apiResult;
    try {
      apiResult = await rakutenSearch(searchTerm, 10);
    } catch(e) {
      console.log('[WARN] API error for ' + productId + ': ' + e.message);
      continue;
    }

    const items = (apiResult.Items || []).map(function(i) { return i.Item || i; });
    if (!items.length) {
      console.log('[NO_RESULT] ' + productId);
      continue;
    }

    // Score all candidates
    let bestScore = -1;
    let bestItem  = null;
    items.forEach(function(item) {
      const score = scoreCandidate(item, product);
      if (score !== null && score > bestScore) {
        bestScore = score;
        bestItem  = item;
      }
    });

    if (!bestItem) {
      console.log('[REJECTED] All candidates failed guards: ' + productId);
      continue;
    }

    const updates = { rakutenLastUpdated: today };
    const prevStatus = product.rakutenStatus;

    const affiliateUrl = buildAffiliateUrl(bestItem.itemUrl, bestItem.affiliateUrl);

    if (bestScore >= CONFIDENCE_THRESHOLD && affiliateUrl) {
      // Promote to available — only when BOTH score and commission URL exist
      updates.rakutenStatus     = 'available';
      updates.rakutenUrl        = affiliateUrl;
      updates.rakutenPrice      = bestItem.itemPrice;
      updates.rakutenShop       = bestItem.shopName || '';
      updates.rakutenConfidence = bestScore;
      report.available++;
      console.log('[PROMOTED] ' + productId + ' affiliateUrl=' + affiliateUrl.slice(0,40) + '...');
    } else if (bestScore >= CONFIDENCE_THRESHOLD && !affiliateUrl) {
      // Good score but no commission URL — keep search, log for monitoring
      updates.rakutenStatus     = 'search';
      updates.rakutenUrl        = null;
      updates.rakutenConfidence = bestScore;
      report.searchFallback++;
      console.log('[NO_AFF_URL] ' + productId + ' score=' + bestScore + ' no affiliateUrl returned');
    } else {
      // Below threshold — keep search fallback
      updates.rakutenStatus     = 'search';
      updates.rakutenUrl        = null;
      updates.rakutenConfidence = bestScore;
      report.searchFallback++;
    }

    currentSrc = patchProductInSource(currentSrc, productId, updates);
    report.updated++;
    report.changed.push(productId + ' (' + bestScore + ' → ' + updates.rakutenStatus + ')');
    console.log('[OK] ' + productId + ' score=' + bestScore + ' status=' + updates.rakutenStatus);
  }

  // Write only if changed
  if (report.updated > 0) {
    // Final sanity check: verify output is valid JS
    try {
      const vm = require('vm');
      const ctx = vm.createContext({});
      vm.runInContext(currentSrc.replace(/\bconst\b/g, 'var'), ctx);
      if (!ctx.PRODUCTS) throw new Error('PRODUCTS not defined after patch');
    } catch(e) {
      console.error('[FATAL] Output validation failed:', e.message);
      process.exit(2);
    }

    fs.writeFileSync(PRODUCTS_PATH, currentSrc, 'utf8');
    console.log('[rakuten-sync] Wrote ' + PRODUCTS_PATH);
  } else {
    console.log('[rakuten-sync] No changes — skipping write');
  }

  // Report
  console.log('\n=== Rakuten Sync Report ===');
  console.log('Updated:        ' + report.updated);
  console.log('Available:      ' + report.available);
  console.log('Search fallback:' + report.searchFallback);
  console.log('Skipped:        ' + report.skipped);
  if (report.changed.length) {
    console.log('\nChanged products:');
    report.changed.forEach(function(l) { console.log('  - ' + l); });
  }
  console.log('[rakuten-sync] Done — ' + new Date().toISOString());
}

main().catch(function(e) {
  console.error('[FATAL]', e.message);
  process.exit(1);
});
