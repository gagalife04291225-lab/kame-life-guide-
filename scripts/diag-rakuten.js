
'use strict';
const https = require('https');
const APP_ID       = process.env.RAKUTEN_APP_ID;
const AFFILIATE_ID = process.env.RAKUTEN_AFFILIATE_ID;

console.log('[DIAG] APP_ID length:', APP_ID ? APP_ID.length : 'MISSING');
console.log('[DIAG] AFFILIATE_ID length:', AFFILIATE_ID ? AFFILIATE_ID.length : 'MISSING');
console.log('[DIAG] APP_ID format:', APP_ID ? APP_ID.replace(/[a-zA-Z0-9]/g, 'x') : 'MISSING');

if (!APP_ID || !AFFILIATE_ID) { console.log('[FATAL] Missing secrets'); process.exit(1); }

const params = new URLSearchParams({
  applicationId: APP_ID,
  affiliateId:   AFFILIATE_ID,
  keyword:       'エーハイム クラシック 2217',
  hits:          '3',
  sort:          '-reviewCount',
  availability:  '1',
});

const path = '/services/api/IchibaItem/Search/20220601?' + params.toString();
console.log('[DIAG] Request path (masked):', path.replace(APP_ID, 'APP_ID_MASKED').replace(AFFILIATE_ID, 'AFF_ID_MASKED'));

const options = {
  hostname: 'app.rakuten.co.jp',
  path: path,
  method: 'GET',
  headers: { 'Accept': 'application/json' },
};

https.request(options, (res) => {
  console.log('[DIAG] HTTP status:', res.statusCode);
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    let d;
    try { d = JSON.parse(data); } catch(e) { console.log('[PARSE ERROR]', data.slice(0,200)); process.exit(1); }
    if (d.error) {
      console.log('[API ERROR] code:', d.error);
      console.log('[API ERROR] desc:', d.error_description);
      process.exit(1);
    }
    const items = d.Items || [];
    console.log('[DIAG] Items returned:', items.length);
    if (!items.length) { console.log('[NO ITEMS]'); process.exit(0); }
    const item = items[0].Item || items[0];
    const itemUrl      = item.itemUrl      || null;
    const affiliateUrl = item.affiliateUrl || null;
    console.log('PRODUCT: filter_canister_eheim_2217');
    console.log('ITEM_NAME: ' + (item.itemName||'').slice(0,60));
    console.log('itemUrl_present: '      + (itemUrl      ? 'YES' : 'NO'));
    console.log('affiliateUrl_present: ' + (affiliateUrl ? 'YES' : 'NO'));
    if (itemUrl) console.log('itemUrl_sample: ' + itemUrl.slice(0,30) + '***' + itemUrl.slice(-10));
    if (affiliateUrl) console.log('affiliateUrl_sample: ' + affiliateUrl.slice(0,30) + '***' + affiliateUrl.slice(-10));
    if (affiliateUrl && affiliateUrl.includes('rakuten')) {
      console.log('VERDICT: COMMISSION_ENABLED');
    } else {
      console.log('VERDICT: NO_COMMISSION');
    }
  });
}).on('error', e => { console.log('[NET ERROR]', e.message); process.exit(1); }).end();
