
'use strict';
const https = require('https');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const APP_ID     = process.env.RAKUTEN_APP_ID;
const ACCESS_KEY = process.env.RAKUTEN_ACCESS_KEY;
const AFF_ID     = process.env.RAKUTEN_AFFILIATE_ID;
const REFERER    = 'https://gagalife04291225-lab.github.io/kame-life-guide-/';

// Load products to get priceRange
const PRODUCTS_PATH = path.resolve(__dirname, '../data/products.js');
const src = fs.readFileSync(PRODUCTS_PATH, 'utf8');
const ctx = vm.createContext({});
vm.runInContext(src.replace(/\bconst\b/g,'var'), ctx);
const PRODUCTS = ctx.PRODUCTS;

// Copy scoring logic from update-rakuten.js
const CATEGORY_GUARDS = {
  filter: ['フィルター', 'ポンプ', 'ろ過'],
};

function parsePriceRange(priceRange) {
  if (!priceRange) return { low: 0, high: 0 };
  const s = priceRange.replace(/[¥,]/g, '');
  const m = s.match(/(\d+)[^\d]+(\d+)/);
  if (m) return { low: parseInt(m[1],10), high: parseInt(m[2],10) };
  return { low: 0, high: 0 };
}

function scoreCandidate(item, product) {
  const price       = item.itemPrice || 0;
  const rating      = item.reviewAverage || 0;
  const reviewCount = item.reviewCount || 0;
  const shipping    = item.postageFlag === 0;
  const shopName    = (item.shopName || '').toLowerCase();
  const category    = product.category || '';

  const guards = CATEGORY_GUARDS[category] || [];
  const nameAndShop = (item.itemName || '') + ' ' + (item.shopName || '');
  if (guards.length > 0) {
    const matched = guards.some(kw => nameAndShop.includes(kw));
    if (!matched) {
      console.log('  [GUARD_REJECT] no category keyword in: "' + nameAndShop.slice(0,80) + '"');
      return null;
    }
  }

  if (price < 100 || price > 500000) return null;
  const { low, high } = parsePriceRange(product.priceRange);
  const mid = (low + high) / 2;
  if (price < low * 0.2 || price > high * 5) {
    console.log('  [PRICE_OUTLIER] price=' + price + ' range=' + low + '-' + high);
    return null;
  }

  let priceScore;
  if      (price <= mid * 0.9)  priceScore = 10;
  else if (price <= mid * 1.1)  priceScore = 8;
  else if (price <= high)       priceScore = 6;
  else                          priceScore = 3;

  let ratingScore;
  if      (rating >= 4.5) ratingScore = 10;
  else if (rating >= 4.2) ratingScore = 8;
  else if (rating >= 3.8) ratingScore = 6;
  else if (rating >= 3.0) ratingScore = 4;
  else                    ratingScore = 2;

  let reviewScore;
  if      (reviewCount >= 100) reviewScore = 10;
  else if (reviewCount >= 50)  reviewScore = 8;
  else if (reviewCount >= 20)  reviewScore = 6;
  else if (reviewCount >= 5)   reviewScore = 4;
  else                         reviewScore = 2;

  const shippingScore = shipping ? 10 : 4;

  const trustedShops = ['charm','charapetshop','reptile','爬虫類','viva','discoveranimals','rakuten24','正規','official','メーカー直営','ペットの専門店'];
  const suspectedBad = ['中国','china','激安','test','在庫処分','わけあり'];
  let shopScore = 5;
  if (suspectedBad.some(kw => shopName.includes(kw))) return null;
  if (trustedShops.some(kw => shopName.includes(kw) || (item.itemName||'').toLowerCase().includes(kw))) shopScore = 9;

  const score = (priceScore*0.35) + (ratingScore*0.25) + (reviewScore*0.20) + (shippingScore*0.10) + (shopScore*0.10);

  console.log('  priceScore=' + priceScore + ' (price=' + price + ' mid=' + mid + ')');
  console.log('  ratingScore=' + ratingScore + ' (rating=' + rating + ')');
  console.log('  reviewScore=' + reviewScore + ' (reviews=' + reviewCount + ')');
  console.log('  shippingScore=' + shippingScore + ' (freeShip=' + shipping + ' postageFlag=' + item.postageFlag + ')');
  console.log('  shopScore=' + shopScore + ' (shop=' + (item.shopName||'?').slice(0,30) + ')');

  return Math.round(score * 10) / 10;
}

function search(term) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      applicationId: APP_ID, accessKey: ACCESS_KEY, affiliateId: AFF_ID,
      keyword: term, hits: '5', sort: '-reviewCount', availability: '1',
    });
    const opts = {
      hostname: 'openapi.rakuten.co.jp',
      path: '/ichibams/api/IchibaItem/Search/20220601?' + params.toString(),
      headers: { 'Accept':'application/json','Authorization':'Bearer '+ACCESS_KEY,'Origin':'https://gagalife04291225-lab.github.io','Referer':REFERER },
    };
    https.request(opts, res => {
      let d=''; res.on('data',c=>d+=c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { resolve({}); } });
    }).on('error', reject).end();
  });
}

(async () => {
  // Test EHEIM with full scoring debug
  const product = PRODUCTS['filter_canister_eheim_2217'];
  console.log('Product: filter_canister_eheim_2217 priceRange=' + product.priceRange);

  const r = await search('エーハイム クラシック 2217');
  const items = r.Items || [];
  console.log('API returned ' + items.length + ' items');

  items.slice(0,3).forEach((i, idx) => {
    const item = i.Item || i;
    console.log('\n[item ' + idx + '] name=' + (item.itemName||'').slice(0,50));
    console.log('  price=' + item.itemPrice + ' affiliateUrl=' + (item.affiliateUrl ? 'YES' : 'NO'));
    const score = scoreCandidate(item, product);
    console.log('  SCORE=' + score + (score >= 8.0 ? ' → WOULD PROMOTE' : ' → BELOW THRESHOLD (8.0)'));
  });
})().catch(e => console.log('[FATAL]', e.message));
