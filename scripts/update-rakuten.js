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

// Failure policy for the daily sync.
// A broken API must fail the workflow, not quietly write zero changes.
const MAX_SERVER_RETRIES  = 2;   // 5xx only
const MAX_PRODUCT_FAILURES = 5;  // non-fatal per-product failures tolerated

// Rakuten Ichiba Item Search API endpoint (2026 migration)
const RAKUTEN_API_HOST = 'openapi.rakuten.co.jp';
const RAKUTEN_API_PATH = '/ichibams/api/IchibaItem/Search/20260701';

// ─── Image Audit Mode (read-only investigation) ───────────────
// Enabled ONLY via env AUDIT_IMAGES=true (workflow_dispatch input).
// This mode NEVER writes products.js, NEVER commits, NEVER pushes.
// It queries the Rakuten API for a small fixed product set and dumps
// non-secret response fields to a JSON artifact for schema discovery.
const AUDIT_IMAGES = process.env.AUDIT_IMAGES === 'true';
const AUDIT_OUT_PATH = path.resolve(process.cwd(), 'rakuten-image-audit.json');
const AUDIT_MAX_CANDIDATES = 5;

// Product IDs under audit (fixed default set, owner-approved).
// Suspect set = previously flagged as possible mislinks.
// Control set = known-good comparison items.
// All 10 IDs are verified to exist in data/products.js.
// Overridable via AUDIT_PRODUCT_IDS (comma-separated) without code change;
// when that env var is empty, exactly these 10 products are processed.
const AUDIT_SUSPECT_IDS = [
  'filter_canister_xl',
  'filter_canister_large',
  'filter_canister_medium',
  'basking_halogen_35w',
  'food_aqua_turtle_pellet',
  'supplement_mineral_block',
];
const AUDIT_CONTROL_IDS = [
  'tank_60',
  'filter_canister_premium',
  'food_aquatic_premium',
  'uvb_t5_desert_std',
];


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
// ─── API error taxonomy ───────────────────────────────────────
// A typed error so callers can distinguish "no results" from "API is broken".
// FATAL kinds must abort the whole sync — silently writing zero updates while
// the API rejects every request is what previously masked a month-long outage.
function ApiError(kind, httpStatus, code, message, meta) {
  const e = new Error(kind + (httpStatus ? ' (HTTP ' + httpStatus + ')' : '') +
                      (code ? ' [' + code + ']' : '') + (message ? ': ' + message : ''));
  e.name        = 'ApiError';
  e.kind        = kind;          // AUTH | RATE_LIMIT | SERVER | BAD_RESPONSE | API_ERROR | NETWORK
  e.httpStatus  = httpStatus || null;
  e.apiCode     = code || null;
  e.apiMessage  = message || null;
  e.meta        = meta || null;  // shape info only — never raw bodies
  e.fatal       = (kind === 'AUTH');   // 401/403 → stop immediately
  return e;
}

// Safely describe an unknown error payload WITHOUT storing it.
// Records only: type, array-ness, key names, string length. Never the values.
function describeErrorPayload(v) {
  if (v === null || v === undefined) return { type: 'absent' };
  if (typeof v === 'string')  return { type: 'string', length: v.length };
  if (Array.isArray(v)) {
    const head = v.length ? v[0] : null;
    return {
      type: 'array',
      length: v.length,
      firstElementType: head === null ? 'null' : (Array.isArray(head) ? 'array' : typeof head),
      firstElementKeys: (head && typeof head === 'object' && !Array.isArray(head))
        ? Object.keys(head) : null,
    };
  }
  if (typeof v === 'object') return { type: 'object', keys: Object.keys(v) };
  return { type: typeof v };
}

// Pull an error code/message out of any of the shapes Rakuten may return.
// Official spec (400/404/429/500/503): {error, error_description}
// Observed on 403 (undocumented): {errors: ...}
function extractApiError(parsed) {
  if (!parsed || typeof parsed !== 'object') return { code: null, message: null };
  if (parsed.error || parsed.error_description) {
    return {
      code: String(parsed.error || ''),
      message: String(parsed.error_description || ''),
    };
  }
  const errs = parsed.errors;
  if (errs) {
    if (Array.isArray(errs) && errs.length && errs[0] && typeof errs[0] === 'object') {
      const e0 = errs[0];
      return {
        code: String(e0.code || e0.error || e0.type || e0.reason || ''),
        message: String(e0.message || e0.error_description || e0.detail || e0.description || ''),
      };
    }
    if (typeof errs === 'object' && !Array.isArray(errs)) {
      return {
        code: String(errs.code || errs.error || errs.type || ''),
        message: String(errs.message || errs.error_description || errs.detail || ''),
      };
    }
    if (typeof errs === 'string') return { code: null, message: errs };
  }
  return { code: null, message: null };
}

// ─── Rakuten API fetch (validated) ────────────────────────────
// Rejects with a typed ApiError on any non-success condition, so that a broken
// API can never be mistaken for "no products matched".
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
        'Origin': 'https://gagalife04291225-lab.github.io',
        'Referer': 'https://gagalife04291225-lab.github.io/',
      },
    };
    const req = https.request(options, function(res) {
      let data = '';
      res.on('data', function(chunk) { data += chunk; });
      res.on('end', function() {
        const status      = res.statusCode || 0;
        const contentType = (res.headers && res.headers['content-type']) || '';

        // 1) HTTP status gate — never swallow a failed request.
        if (status === 401 || status === 403) {
          let parsed = null;
          try { parsed = JSON.parse(data); } catch (e) { /* shape unknown */ }
          const info  = extractApiError(parsed);
          const shape = parsed && typeof parsed === 'object'
            ? { topLevelKeys: Object.keys(parsed),
                errorsShape: describeErrorPayload(parsed.errors) }
            : { topLevelKeys: [], errorsShape: { type: 'non-object' } };
          return reject(ApiError('AUTH', status,
            redact(info.code || ''), redact((info.message || '').slice(0, 200)), shape));
        }
        if (status === 429) {
          const retryAfter = (res.headers && res.headers['retry-after']) || null;
          return reject(ApiError('RATE_LIMIT', status, 'too_many_requests',
            retryAfter ? ('retry-after=' + retryAfter) : null, null));
        }
        if (status >= 500) {
          return reject(ApiError('SERVER', status, null, null, null));
        }
        if (status < 200 || status > 299) {
          let parsed = null;
          try { parsed = JSON.parse(data); } catch (e) { /* ignore */ }
          const info = extractApiError(parsed);
          return reject(ApiError('API_ERROR', status,
            redact(info.code || ''), redact((info.message || '').slice(0, 200)), null));
        }

        // 2) content-type gate
        if (contentType && contentType.indexOf('json') === -1) {
          return reject(ApiError('BAD_RESPONSE', status, 'NON_JSON_CONTENT_TYPE',
            redact(String(contentType)), null));
        }

        // 3) JSON parse gate
        let parsed;
        try {
          parsed = JSON.parse(data);
        } catch (e) {
          return reject(ApiError('BAD_RESPONSE', status, 'JSON_PARSE_FAILED',
            redact(e.message), null));
        }

        // 4) HTTP 200 but the body carries an error structure → still an error.
        if (parsed && typeof parsed === 'object' && (parsed.error || parsed.errors)) {
          const info  = extractApiError(parsed);
          const shape = { topLevelKeys: Object.keys(parsed),
                          errorsShape: describeErrorPayload(parsed.errors) };
          return reject(ApiError('API_ERROR', status,
            redact(info.code || 'ERROR_IN_200_BODY'),
            redact((info.message || '').slice(0, 200)), shape));
        }

        // 5) Distinguish a genuine empty result from a malformed response.
        //    Official success bodies always carry Items (array) plus count/hits.
        const hasItems = parsed && Object.prototype.hasOwnProperty.call(parsed, 'Items');
        if (!hasItems) {
          return reject(ApiError('BAD_RESPONSE', status, 'ITEMS_KEY_NOT_FOUND',
            null, { topLevelKeys: (parsed && typeof parsed === 'object')
                                  ? Object.keys(parsed) : [] }));
        }
        if (!Array.isArray(parsed.Items)) {
          return reject(ApiError('BAD_RESPONSE', status, 'ITEMS_NOT_ARRAY',
            null, { itemsType: typeof parsed.Items }));
        }

        // Success. Items may legitimately be empty → NO_RESULT is the caller's call.
        resolve(parsed);
      });
    });
    req.on('error', function(e) {
      reject(ApiError('NETWORK', null, 'REQUEST_ERROR', redact(e.message), null));
    });
    req.setTimeout(10000, function() {
      req.destroy();
      reject(ApiError('NETWORK', null, 'TIMEOUT', 'Request timeout', null));
    });
    req.end();
  });
}

// ─── Diagnostic fetch (audit mode only) ──────────────────────
// Same request as rakutenSearch(), but captures transport-level facts so an
// empty result can be explained: HTTP status, content-type, top-level key
// NAMES, API error code/message, and which items key (if any) is present.
// Never stores: the request URL, Authorization header, any Secret value,
// or the full response body.
function rakutenSearchDiagnostic(searchTerm, maxItems) {
  return new Promise(function(resolve) {
    const params = new URLSearchParams({
      applicationId: APP_ID,
      accessKey:     ACCESS_KEY,
      affiliateId:   AFFILIATE_ID,
      keyword:       searchTerm,
      hits:          String(maxItems || 10),
      sort:          '-reviewCount',
      imageFlag:     '1',
      availability:  '1',
    });
    const options = {
      hostname: RAKUTEN_API_HOST,
      path:     RAKUTEN_API_PATH + '?' + params.toString(),
      method:   'GET',
      headers:  {
        'Accept': 'application/json',
        'Origin': 'https://gagalife04291225-lab.github.io',
        'Referer': 'https://gagalife04291225-lab.github.io/',
      },
    };
    const req = https.request(options, function(res) {
      let data = '';
      res.on('data', function(chunk) { data += chunk; });
      res.on('end', function() {
        const diag = {
          httpStatus:        res.statusCode || null,
          contentType:       (res.headers && res.headers['content-type']) || null,
          topLevelKeys:      [],
          detectedItemsKey:  null,
          detectedItemsType: null,
          apiErrorCode:      null,
          apiErrorMessage:   null,
          reportedCount:     null,
          errorObjectKeys:   null,
        };
        let parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch (e) {
          // Body was not JSON. Record the fact only — never the body itself.
          diag.apiErrorCode = 'NON_JSON_RESPONSE';
          diag.apiErrorMessage = redact('JSON parse failed: ' + e.message);
          return resolve({ parsed: null, diag: diag });
        }

        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          diag.topLevelKeys = Object.keys(parsed);   // key NAMES only
        } else {
          diag.topLevelKeys = [];
          diag.detectedItemsType = Array.isArray(parsed) ? 'array' : typeof parsed;
        }

        // Rakuten error shapes:
        //   {error, error_description} | {code, message} | {errors:[{code,message}...]}
        if (parsed && Array.isArray(parsed.errors) && parsed.errors.length) {
          const e0 = parsed.errors[0];
          if (e0 && typeof e0 === 'object') {
            // Unknown shape: record the KEY NAMES, and stringify the first
            // error object (redacted) so the failure reason is visible.
            diag.errorObjectKeys = Object.keys(e0);
            diag.apiErrorCode    = redact(String(e0.code || e0.error || e0.type || e0.name || ''));
            diag.apiErrorMessage = redact(JSON.stringify(e0)).slice(0, 300);
          } else {
            diag.apiErrorCode    = 'ERRORS_ARRAY_NON_OBJECT';
            diag.apiErrorMessage = redact(String(e0)).slice(0, 200);
          }
        } else if (parsed && (parsed.error || parsed.code || parsed.error_description)) {
          diag.apiErrorCode    = redact(String(parsed.error || parsed.code || ''));
          diag.apiErrorMessage = redact(String(parsed.error_description || parsed.message || ''));
        }

        // Which items key is present? (Items / items / item)
        const ITEM_KEYS = ['Items', 'items', 'item'];
        for (let i = 0; i < ITEM_KEYS.length; i++) {
          const k = ITEM_KEYS[i];
          if (parsed && Object.prototype.hasOwnProperty.call(parsed, k)) {
            diag.detectedItemsKey  = k;
            diag.detectedItemsType = Array.isArray(parsed[k]) ? 'array' : typeof parsed[k];
            break;
          }
        }

        // Count-related fields, if any
        const COUNT_KEYS = ['count', 'hits', 'pageCount', 'page', 'first', 'last'];
        const counts = {};
        COUNT_KEYS.forEach(function(k) {
          if (parsed && typeof parsed[k] === 'number') counts[k] = parsed[k];
        });
        if (Object.keys(counts).length) diag.reportedCount = counts;

        resolve({ parsed: parsed, diag: diag });
      });
    });
    req.on('error', function(e) {
      resolve({ parsed: null, diag: {
        httpStatus: null, contentType: null, topLevelKeys: [],
        detectedItemsKey: null, detectedItemsType: null,
        apiErrorCode: 'REQUEST_ERROR', apiErrorMessage: redact(e.message),
        reportedCount: null,
      }});
    });
    req.setTimeout(10000, function() {
      req.destroy();
      resolve({ parsed: null, diag: {
        httpStatus: null, contentType: null, topLevelKeys: [],
        detectedItemsKey: null, detectedItemsType: null,
        apiErrorCode: 'TIMEOUT', apiErrorMessage: 'Request timeout',
        reportedCount: null,
      }});
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

// ─── Image Audit (read-only; never writes products.js) ───────
// Extracts ONLY the whitelisted fields below. Full API responses are
// never dumped, and no secret (appId/accessKey/affiliateId/Authorization)
// is ever written to logs or the artifact.
//
// SECURITY: affiliateUrl and itemUrl are NEVER stored in full.
// A Rakuten affiliateUrl embeds the Affiliate ID (and tracking params) in
// its path/query, so persisting it would leak an affiliate credential into
// the artifact. We store only existence flags and the parsed host.
function safeHost(u) {
  if (typeof u !== 'string' || u.length === 0) return null;
  try {
    return new URL(u).host || null;   // host only — no path, no query
  } catch (e) {
    return null;                      // unparseable → null (never raw string)
  }
}

function extractAuditFields(item) {
  // Whitelist. Fields absent from the Rakuten response resolve to null.
  const pick = function(k) {
    return (item && item[k] !== undefined && item[k] !== '') ? item[k] : null;
  };
  const rawAffiliateUrl = (item && typeof item.affiliateUrl === 'string') ? item.affiliateUrl : '';
  const rawItemUrl      = (item && typeof item.itemUrl === 'string')      ? item.itemUrl      : '';

  return {
    itemName:         pick('itemName'),
    itemCode:         pick('itemCode'),
    itemPrice:        pick('itemPrice'),
    shopName:         pick('shopName'),
    mediumImageUrls:  pick('mediumImageUrls'),
    smallImageUrls:   pick('smallImageUrls'),
    imageUrl:         pick('imageUrl'),
    jan:              pick('jan'),
    brand:            pick('brand'),
    manufacturer:     pick('manufacturer'),
    modelNumber:      pick('modelNumber'),
    postageFlag:      pick('postageFlag'),
    reviewCount:      pick('reviewCount'),
    // Minimized URL info — never the full strings.
    hasAffiliateUrl:  rawAffiliateUrl.length > 0,
    affiliateHost:    safeHost(rawAffiliateUrl),
    hasItemUrl:       rawItemUrl.length > 0,
  };
}

// Redact any secret that could appear in an error string (defense in depth).
function redact(str) {
  let s = String(str == null ? '' : str);
  [APP_ID, ACCESS_KEY, AFFILIATE_ID].forEach(function(sec) {
    if (sec) s = s.split(sec).join('***REDACTED***');
  });
  // Strip credential-bearing query params if a URL ever leaks into a message
  s = s.replace(/(applicationId|accessKey|affiliateId)=[^&\s]*/gi, '$1=***REDACTED***');
  s = s.replace(/Bearer\s+[A-Za-z0-9._-]+/g, 'Bearer ***REDACTED***');
  return s;
}

async function auditImages() {
  validateSecrets();
  console.log('[image-audit] READ-ONLY mode. products.js will NOT be modified.');

  const { products } = loadProducts();

  // Allow explicit override of the product set without editing code.
  const override = (process.env.AUDIT_PRODUCT_IDS || '').trim();
  const requested = override
    ? override.split(',').map(function(s) { return s.trim(); }).filter(Boolean)
    : AUDIT_SUSPECT_IDS.concat(AUDIT_CONTROL_IDS);

  const audit = {
    executedAt: new Date().toISOString(),
    apiVersion: RAKUTEN_API_PATH,
    testedProductCount: 0,
    detectedImageFields: [],
    results: [],
    errors: [],
  };

  const imageFieldsSeen = new Set();

  for (const productId of requested) {
    const product = products[productId];
    if (!product) {
      // Do NOT guess a replacement ID — report and move on.
      audit.errors.push({ productId: productId, error: 'PRODUCT_ID_NOT_FOUND_IN_products.js' });
      console.log('[image-audit] MISSING ID (not substituted): ' + productId);
      continue;
    }

    const searchKeyword = product.rakutenSearchTerm || product.name || '';
    if (!searchKeyword) {
      audit.errors.push({ productId: productId, error: 'NO_SEARCH_KEYWORD' });
      continue;
    }

    await sleep(1100);  // Respect Rakuten API rate limit

    // Diagnostic fetch: capture transport-level facts so an empty result
    // can be explained instead of silently yielding zero candidates.
    const probe = await rakutenSearchDiagnostic(searchKeyword, AUDIT_MAX_CANDIDATES);
    const diag = probe.diag;
    const parsed = probe.parsed;

    // Record failure reasons explicitly.
    if (diag.httpStatus !== null && diag.httpStatus !== 200) {
      audit.errors.push({
        productId: productId,
        error: 'HTTP_' + diag.httpStatus,
        apiErrorCode: diag.apiErrorCode,
        apiErrorMessage: diag.apiErrorMessage,
      });
    } else if (diag.apiErrorCode) {
      audit.errors.push({
        productId: productId,
        error: 'API_ERROR',
        apiErrorCode: diag.apiErrorCode,
        apiErrorMessage: diag.apiErrorMessage,
      });
    }

    // Resolve the items array from whichever key the API actually used.
    let items = [];
    if (parsed && diag.detectedItemsKey && Array.isArray(parsed[diag.detectedItemsKey])) {
      items = parsed[diag.detectedItemsKey];
    } else if (parsed && diag.httpStatus === 200 && !diag.apiErrorCode) {
      audit.errors.push({ productId: productId, error: 'ITEMS_KEY_NOT_FOUND' });
    }

    const candidates = items.slice(0, AUDIT_MAX_CANDIDATES).map(function(entry) {
      // Rakuten wraps each hit as { Item: {...} } in some versions; handle both.
      const item = (entry && entry.Item) ? entry.Item : entry;
      const picked = extractAuditFields(item);
      // Record which image-bearing fields actually exist in the live response
      ['mediumImageUrls', 'smallImageUrls', 'imageUrl'].forEach(function(f) {
        if (picked[f]) imageFieldsSeen.add(f);
      });
      return picked;
    });

    audit.results.push({
      productId:      productId,
      registeredName: product.name || null,
      searchKeyword:  searchKeyword,
      // Diagnostics (no URL, no headers, no secrets, no full body)
      httpStatus:        diag.httpStatus,
      contentType:       diag.contentType,
      topLevelKeys:      diag.topLevelKeys,      // key NAMES only
      detectedItemsKey:  diag.detectedItemsKey,
      detectedItemsType: diag.detectedItemsType,
      apiErrorCode:      diag.apiErrorCode,
      apiErrorMessage:   diag.apiErrorMessage,
      errorObjectKeys:   diag.errorObjectKeys,
      reportedCount:     diag.reportedCount,
      candidateCount: candidates.length,
      candidates:     candidates,
    });
    audit.testedProductCount++;
    console.log('[image-audit] ' + productId +
                ' — http=' + diag.httpStatus +
                ' itemsKey=' + (diag.detectedItemsKey || 'NONE') +
                ' candidates: ' + candidates.length);
  }

  audit.detectedImageFields = Array.from(imageFieldsSeen);

  const serialized = JSON.stringify(audit, null, 2);

  // ── Post-generation secret scan (defense in depth) ──────────
  // Fail hard if any credential-ish token or an actual Secret value
  // ended up in the artifact. Secret VALUES are never printed — only a verdict.
  const FORBIDDEN_TOKENS = [
    'applicationId', 'accessKey', 'affiliateId',
    'Authorization', 'Bearer',
    'RAKUTEN_APP_ID', 'RAKUTEN_ACCESS_KEY', 'RAKUTEN_AFFILIATE_ID',
  ];
  const hitTokens = FORBIDDEN_TOKENS.filter(function(t) {
    return serialized.indexOf(t) !== -1;
  });
  const secretValues = [APP_ID, ACCESS_KEY, AFFILIATE_ID].filter(Boolean);
  const leakedSecretCount = secretValues.filter(function(v) {
    return serialized.indexOf(v) !== -1;
  }).length;

  if (hitTokens.length > 0 || leakedSecretCount > 0) {
    // Report token NAMES only; never the values, never the offending content.
    console.error('[FATAL][image-audit] Secret scan FAILED.');
    if (hitTokens.length) console.error('  Forbidden tokens present: ' + hitTokens.join(', '));
    if (leakedSecretCount) console.error('  Secret values detected in artifact: ' + leakedSecretCount);
    process.exit(3);   // Do not write the artifact.
  }
  console.log('OK: no secret values detected');

  fs.writeFileSync(AUDIT_OUT_PATH, serialized, 'utf8');
  console.log('[image-audit] Wrote artifact JSON (products.js untouched).');
  console.log('[image-audit] Tested: ' + audit.testedProductCount +
              ' | Image fields detected: ' + (audit.detectedImageFields.join(', ') || 'NONE') +
              ' | Errors: ' + audit.errors.length);
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
    failed: [],
    noResult: 0,
  };

  // Set when the API itself is broken (auth/rate-limit/too many failures).
  // While non-null, products.js must not be written and the run must fail.
  let apiFailure = null;
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
    let attempt = 0;
    for (;;) {
      try {
        apiResult = await rakutenSearch(searchTerm, 10);
        break;                                   // success
      } catch (e) {
        // AUTH (401/403): the credentials or the request itself are being
        // rejected. Every subsequent product would fail identically — abort now
        // rather than "succeeding" with zero updates.
        if (e.kind === 'AUTH') {
          console.error('[FATAL] Rakuten API rejected the request — aborting sync.');
          console.error('  httpStatus : ' + e.httpStatus);
          console.error('  apiCode    : ' + (e.apiCode || '(none)'));
          console.error('  apiMessage : ' + (e.apiMessage || '(none)'));
          if (e.meta) console.error('  shape      : ' + JSON.stringify(e.meta));
          console.error('  NOTE: products.js was NOT modified.');
          apiFailure = { kind: e.kind, httpStatus: e.httpStatus,
                         apiCode: e.apiCode, apiMessage: e.apiMessage, meta: e.meta };
          break;
        }
        // RATE_LIMIT: do not hammer the API. Stop the run.
        if (e.kind === 'RATE_LIMIT') {
          console.error('[FATAL] Rate limited by Rakuten API — aborting sync.');
          console.error('  ' + (e.apiMessage || 'retry-after not provided'));
          apiFailure = { kind: e.kind, httpStatus: e.httpStatus,
                         apiCode: e.apiCode, apiMessage: e.apiMessage, meta: null };
          break;
        }
        // SERVER (5xx): transient. Retry up to MAX_SERVER_RETRIES.
        if (e.kind === 'SERVER' && attempt < MAX_SERVER_RETRIES) {
          attempt++;
          console.log('[RETRY] ' + productId + ' — HTTP ' + e.httpStatus +
                      ' (attempt ' + attempt + '/' + MAX_SERVER_RETRIES + ')');
          await sleep(2000 * attempt);
          continue;
        }
        // Everything else (BAD_RESPONSE / API_ERROR / NETWORK / exhausted 5xx):
        // count it, and fail the run if too many products are affected.
        console.error('[ERROR] ' + productId + ' — ' + e.message);
        report.failed.push(productId + ' (' + (e.kind || 'UNKNOWN') + ')');
        break;
      }
    }
    if (apiFailure) break;          // fatal: stop iterating products
    if (!apiResult) {
      // This product failed but was not fatal — move on.
      if (report.failed.length > MAX_PRODUCT_FAILURES) {
        console.error('[FATAL] Too many product failures (' + report.failed.length +
                      ') — aborting sync.');
        apiFailure = { kind: 'TOO_MANY_FAILURES', httpStatus: null,
                       apiCode: null, apiMessage: null, meta: null };
        break;
      }
      continue;
    }

    // Reaching here means: HTTP 200, JSON, no error structure, Items is an array.
    // An empty array is therefore a genuine "no products matched" — not a failure.
    const items = (apiResult.Items || []).map(function(i) { return i.Item || i; });
    if (!items.length) {
      console.log('[NO_RESULT] ' + productId);
      report.noResult++;
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

  // ── API failure gate ───────────────────────────────────────
  // If the API rejected us, products.js must NOT be touched and the workflow
  // must FAIL. Previously a 403 produced zero updates and exited 0, which made
  // a month-long outage look like a series of successful no-op runs.
  if (apiFailure) {
    console.error('\n=== Rakuten Sync FAILED ===');
    console.error('Reason:      ' + apiFailure.kind);
    if (apiFailure.httpStatus) console.error('HTTP status: ' + apiFailure.httpStatus);
    if (apiFailure.apiCode)    console.error('API code:    ' + apiFailure.apiCode);
    if (apiFailure.apiMessage) console.error('API message: ' + apiFailure.apiMessage);
    if (apiFailure.meta)       console.error('Shape:       ' + JSON.stringify(apiFailure.meta));
    console.error('products.js: NOT modified.');
    console.error('[rakuten-sync] Aborted — ' + new Date().toISOString());
    process.exit(1);           // fail the workflow
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
  console.log('No result:      ' + report.noResult);
  console.log('Failed:         ' + report.failed.length);
  if (report.failed.length) {
    console.log('\nFailed products:');
    report.failed.forEach(function(l) { console.log('  - ' + l); });
  }
  if (report.changed.length) {
    console.log('\nChanged products:');
    report.changed.forEach(function(l) { console.log('  - ' + l); });
  }
  console.log('[rakuten-sync] Done — ' + new Date().toISOString());
}

// ─── Entry point ──────────────────────────────────────────────
// AUDIT_IMAGES=true routes to auditImages() and NEVER reaches main(),
// so the products.js writeFileSync path is structurally unreachable.
if (AUDIT_IMAGES) {
  auditImages().catch(function(e) {
    console.error('[FATAL][image-audit]', redact(e.message));
    process.exit(1);
  });
} else {
  main().catch(function(e) {
    console.error('[FATAL]', e.message);
    process.exit(1);
  });
}
