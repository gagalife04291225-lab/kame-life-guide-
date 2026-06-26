
'use strict';
const https = require('https');
const APP_ID     = process.env.RAKUTEN_APP_ID;
const ACCESS_KEY = process.env.RAKUTEN_ACCESS_KEY;
const AFF_ID     = process.env.RAKUTEN_AFFILIATE_ID;
const REFERER    = 'https://gagalife04291225-lab.github.io/kame-life-guide-/';

function test(label, options) {
  return new Promise(resolve => {
    https.request(options, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => {
        console.log('['+label+'] HTTP='+res.statusCode);
        let r; try { r = JSON.parse(d); } catch(e) { r = {_raw: d.slice(0,150)}; }
        const items = r.Items || [];
        if (r.errors) console.log('  err:', JSON.stringify(r.errors));
        if (r.error) console.log('  err:', r.error, r.error_description);
        if (items.length) {
          const item = items[0].Item || items[0];
          console.log('  ITEM:', (item.itemName||'').slice(0,50));
          console.log('  affiliateUrl:', item.affiliateUrl ? 'YES' : 'NO');
          if (item.affiliateUrl) console.log('  sample:', item.affiliateUrl.slice(0,40)+'...');
        }
        resolve();
      });
    }).on('error', e => { console.log('['+label+'] ERR:', e.message); resolve(); }).end();
  });
}

const kw = encodeURIComponent('エーハイム クラシック 2217');

(async () => {
  // T1: new endpoint + accessKey in query + Referer header (the fix)
  await test('T1-new+referer+query', {
    hostname: 'openapi.rakuten.co.jp',
    path: `/ichibams/api/IchibaItem/Search/20220601?applicationId=${APP_ID}&accessKey=${ACCESS_KEY}&affiliateId=${AFF_ID}&keyword=${kw}&hits=3&sort=-reviewCount&availability=1`,
    headers: { 'Accept': 'application/json', 'Referer': REFERER }
  });

  // T2: new endpoint + Bearer + Referer (both auth methods + referer)
  await test('T2-new+bearer+referer', {
    hostname: 'openapi.rakuten.co.jp',
    path: `/ichibams/api/IchibaItem/Search/20220601?applicationId=${APP_ID}&affiliateId=${AFF_ID}&keyword=${kw}&hits=3&sort=-reviewCount&availability=1`,
    headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + ACCESS_KEY, 'Referer': REFERER }
  });

  // T3: new endpoint + both auth methods + Referer (belt+suspenders)
  await test('T3-new+all+referer', {
    hostname: 'openapi.rakuten.co.jp',
    path: `/ichibams/api/IchibaItem/Search/20220601?applicationId=${APP_ID}&accessKey=${ACCESS_KEY}&affiliateId=${AFF_ID}&keyword=${kw}&hits=3&sort=-reviewCount&availability=1`,
    headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + ACCESS_KEY, 'Referer': REFERER }
  });
})();
