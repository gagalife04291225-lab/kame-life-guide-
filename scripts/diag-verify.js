
'use strict';
const https = require('https');
const APP_ID     = process.env.RAKUTEN_APP_ID;
const ACCESS_KEY = process.env.RAKUTEN_ACCESS_KEY;
const AFF_ID     = process.env.RAKUTEN_AFFILIATE_ID;

const params = new URLSearchParams({
  applicationId: APP_ID,
  accessKey:     ACCESS_KEY,
  affiliateId:   AFF_ID,
  keyword:       'エーハイム クラシック 2217',
  hits:          '3',
  sort:          '-reviewCount',
  availability:  '1',
});

const options = {
  hostname: 'openapi.rakuten.co.jp',
  path: '/ichibams/api/IchibaItem/Search/20220601?' + params.toString(),
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + ACCESS_KEY,
  },
};

https.request(options, (res) => {
  let d = ''; res.on('data', c => d += c);
  res.on('end', () => {
    let r; try { r = JSON.parse(d); } catch(e) { console.log('[PARSE_ERR]', d.slice(0,100)); return; }
    if (r.error) { console.log('[API_ERROR]', r.error, '|', r.error_description); return; }
    const items = r.Items || [];
    console.log('[HTTP]', res.statusCode);
    console.log('[ITEMS]', items.length);
    if (!items.length) { console.log('[NO_ITEMS]'); return; }
    const item = items[0].Item || items[0];
    const itemUrl      = item.itemUrl      || null;
    const affiliateUrl = item.affiliateUrl || null;
    console.log('ITEM_NAME:', (item.itemName||'').slice(0,60));
    console.log('PRICE:', item.itemPrice);
    console.log('itemUrl_present:', itemUrl ? 'YES' : 'NO');
    console.log('affiliateUrl_present:', affiliateUrl ? 'YES' : 'NO');
    if (itemUrl) console.log('itemUrl_sample:', itemUrl.slice(0,30)+'***'+itemUrl.slice(-10));
    if (affiliateUrl) console.log('affiliateUrl_sample:', affiliateUrl.slice(0,30)+'***'+affiliateUrl.slice(-10));
    console.log('VERDICT:', affiliateUrl ? 'COMMISSION_ENABLED' : 'NO_COMMISSION');
  });
}).on('error', e => console.log('[NET]', e.message)).end();
