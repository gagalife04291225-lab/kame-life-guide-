
'use strict';
const https = require('https');
const APP_ID       = process.env.RAKUTEN_APP_ID;
const AFFILIATE_ID = process.env.RAKUTEN_AFFILIATE_ID;
if (!APP_ID || !AFFILIATE_ID) { console.log('[FATAL] Missing secrets'); process.exit(1); }

const params = new URLSearchParams({
  applicationId: APP_ID,
  affiliateId:   AFFILIATE_ID,
  keyword:       'エーハイム クラシック 2217',
  hits:          '3',
  sort:          '-reviewCount',
  availability:  '1',
});

const options = {
  hostname: 'app.rakuten.co.jp',
  path: '/services/api/IchibaItem/Search/20220601?' + params.toString(),
  method: 'GET',
  headers: { 'Accept': 'application/json' },
};

https.request(options, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const d = JSON.parse(data);
    if (d.error) { console.log('[API ERROR]', d.error, d.error_description); process.exit(1); }
    const items = d.Items || [];
    if (!items.length) { console.log('[NO ITEMS]'); process.exit(0); }
    const item = items[0].Item || items[0];
    const itemUrl      = item.itemUrl      || null;
    const affiliateUrl = item.affiliateUrl || null;
    console.log('PRODUCT: filter_canister_eheim_2217');
    console.log('SEARCH_TERM: エーハイム クラシック 2217');
    console.log('ITEM_NAME: ' + (item.itemName||'').slice(0,60));
    console.log('itemUrl_present: '      + (itemUrl      ? 'YES' : 'NO'));
    console.log('affiliateUrl_present: ' + (affiliateUrl ? 'YES' : 'NO'));
    if (itemUrl) {
      console.log('itemUrl_sample: ' + itemUrl.slice(0,35) + '***' + itemUrl.slice(-12));
    }
    if (affiliateUrl) {
      console.log('affiliateUrl_sample: ' + affiliateUrl.slice(0,35) + '***' + affiliateUrl.slice(-12));
    }
    if (affiliateUrl && affiliateUrl.includes('rakuten')) {
      console.log('SELECTED: affiliateUrl');
      console.log('VERDICT: COMMISSION_ENABLED');
    } else {
      console.log('SELECTED: itemUrl');
      console.log('VERDICT: NO_COMMISSION');
    }
  });
}).on('error', e => { console.log('[NET ERROR]', e.message); process.exit(1); }).end();
