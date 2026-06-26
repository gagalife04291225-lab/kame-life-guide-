
'use strict';
const https = require('https');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const APP_ID     = process.env.RAKUTEN_APP_ID;
const ACCESS_KEY = process.env.RAKUTEN_ACCESS_KEY;
const AFF_ID     = process.env.RAKUTEN_AFFILIATE_ID;
const PRODUCTS_PATH = path.resolve(__dirname, '../data/products.js');
const REFERER = 'https://gagalife04291225-lab.github.io/kame-life-guide-/';

function loadProducts() {
  const src = fs.readFileSync(PRODUCTS_PATH, 'utf8');
  const ctx = vm.createContext({});
  vm.runInContext(src.replace(/\bconst\b/g, 'var'), ctx);
  return ctx.PRODUCTS;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function search(term) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      applicationId: APP_ID, accessKey: ACCESS_KEY, affiliateId: AFF_ID,
      keyword: term, hits: '5', sort: '-reviewCount', availability: '1',
    });
    const options = {
      hostname: 'openapi.rakuten.co.jp',
      path: '/ichibams/api/IchibaItem/Search/20220601?' + params.toString(),
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + ACCESS_KEY,
        'Origin': 'https://gagalife04291225-lab.github.io',
        'Referer': REFERER,
      },
    };
    const req = https.request(options, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(d) }); }
        catch(e) { resolve({ status: res.statusCode, data: { _raw: d.slice(0,100) } }); }
      });
    });
    req.on('error', e => reject(e));
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('timeout')); });
    req.end();
  });
}

// Test just 3 products verbosely
const TEST_IDS = [
  { id: 'filter_canister_eheim_2217', term: 'エーハイム クラシック 2217' },
  { id: 'uvb_desert_t5',              term: 'Zoo Med ReptiSun 10.0 T5' },
  { id: 'filter_canister_medium',     term: '外部フィルター 60cm 亀' },
];

(async () => {
  const products = loadProducts();
  const report = [];

  for (const { id, term } of TEST_IDS) {
    await sleep(1200);
    const p = products[id];
    if (!p) { report.push(`${id}: NOT FOUND`); continue; }

    let result;
    try { result = await search(term); }
    catch(e) { report.push(`${id}: NET ERROR ${e.message}`); continue; }

    const { status, data } = result;
    const items = data.Items || [];
    const hasErr = data.error || (data.errors && data.errors.errorMessage);
    const errMsg = data.error || (data.errors && data.errors.errorMessage) || '';

    if (hasErr || !items.length) {
      report.push(`${id}: HTTP=${status} error=${errMsg} items=0`);
      continue;
    }

    // Check top 3 items for affiliateUrl
    const hits = items.slice(0,3).map((i,idx) => {
      const item = i.Item || i;
      const aff = item.affiliateUrl || null;
      const itemUrl = item.itemUrl || null;
      return `  [${idx}] price=${item.itemPrice} rating=${item.reviewAverage}(${item.reviewCount}) ` +
             `affiliateUrl=${aff ? 'YES:'+aff.slice(0,35)+'...' : 'NO'} ` +
             `itemUrl=${itemUrl ? 'YES' : 'NO'}`;
    }).join('\n');

    report.push(`${id}: HTTP=${status} items=${items.length}\n${hits}`);
  }

  console.log('=== VERBOSE SYNC REPORT ===');
  report.forEach(r => console.log(r));
})().catch(e => console.log('[FATAL]', e.message));
