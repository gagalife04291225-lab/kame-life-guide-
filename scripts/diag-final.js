
'use strict';
const https = require('https');
const APP_ID       = process.env.RAKUTEN_APP_ID;
const AFFILIATE_ID = process.env.RAKUTEN_AFFILIATE_ID;

const params = new URLSearchParams({
  applicationId: APP_ID,
  affiliateId:   AFFILIATE_ID,
  keyword:       'エーハイム クラシック 2217',
  hits:          '3',
  sort:          '-reviewCount',
  availability:  '1',
});

https.request({
  hostname: 'app.rakuten.co.jp',
  path: '/services/api/IchibaItem/Search/20220601?' + params.toString(),
  method: 'GET',
  headers: { 'Accept': 'application/json' },
}, (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    let r;
    try { r = JSON.parse(d); } catch(e) { console.log('[PARSE_ERROR]', d.slice(0,100)); return; }
    if (r.error) {
      console.log('[API_ERROR]', r.error, '|', r.error_description);
      return;
    }
    const items = r.Items || [];
    console.log('[ITEMS_COUNT]', items.length);
    if (!items.length) { console.log('[NO_ITEMS]'); return; }
    const item = items[0].Item || items[0];
    const itemUrl      = item.itemUrl      || null;
    const affiliateUrl = item.affiliateUrl || null;
    console.log('PRODUCT: filter_canister_eheim_2217');
    console.log('ITEM_NAME:', (item.itemName||'').slice(0,60));
    console.log('PRICE:', item.itemPrice);
    console.log('RATING:', item.reviewAverage, '| REVIEWS:', item.reviewCount);
    console.log('itemUrl_present:', itemUrl ? 'YES' : 'NO');
    console.log('affiliateUrl_present:', affiliateUrl ? 'YES' : 'NO');
    if (itemUrl)      console.log('itemUrl_sample:', itemUrl.slice(0,32)+'***'+itemUrl.slice(-10));
    if (affiliateUrl) console.log('affiliateUrl_sample:', affiliateUrl.slice(0,32)+'***'+affiliateUrl.slice(-10));
    if (affiliateUrl && affiliateUrl.includes('rakuten')) {
      console.log('VERDICT: COMMISSION_ENABLED');
    } else {
      console.log('VERDICT: NO_COMMISSION (itemUrl only)');
    }
  });
}).on('error', e => console.log('[NET_ERROR]', e.message)).end();
