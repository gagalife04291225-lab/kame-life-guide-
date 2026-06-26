
'use strict';
const https = require('https');
const APP_ID     = process.env.RAKUTEN_APP_ID;
const ACCESS_KEY = process.env.RAKUTEN_ACCESS_KEY;
const AFF_ID     = process.env.RAKUTEN_AFFILIATE_ID;

function test(label, options) {
  return new Promise(resolve => {
    https.request(options, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => {
        console.log('['+label+'] HTTP='+res.statusCode);
        // Log raw response (no secrets in it)
        console.log('  raw:', d.slice(0,300));
        resolve();
      });
    }).on('error', e => { console.log('['+label+'] ERR:', e.message); resolve(); }).end();
  });
}

const kw = encodeURIComponent('エーハイム クラシック 2217');

(async () => {
  // T1: new endpoint + both query params + bearer header
  await test('T1-new+bearer+query', {
    hostname: 'openapi.rakuten.co.jp',
    path: `/ichibams/api/IchibaItem/Search/20220601?applicationId=${APP_ID}&accessKey=${ACCESS_KEY}&affiliateId=${AFF_ID}&keyword=${kw}&hits=1`,
    headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + ACCESS_KEY }
  });

  // T2: new endpoint + bearer header only (no query params for auth)
  await test('T2-new+bearer-only', {
    hostname: 'openapi.rakuten.co.jp',
    path: `/ichibams/api/IchibaItem/Search/20220601?affiliateId=${AFF_ID}&keyword=${kw}&hits=1`,
    headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + ACCESS_KEY }
  });

  // T3: old endpoint with new credentials (fallback)
  await test('T3-old+bearer', {
    hostname: 'app.rakuten.co.jp',
    path: `/services/api/IchibaItem/Search/20220601?applicationId=${APP_ID}&affiliateId=${AFF_ID}&keyword=${kw}&hits=1`,
    headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + ACCESS_KEY }
  });

  // T4: new endpoint without any auth
  await test('T4-new-no-auth', {
    hostname: 'openapi.rakuten.co.jp',
    path: `/ichibams/api/IchibaItem/Search/20220601?applicationId=${APP_ID}&keyword=${kw}&hits=1`,
    headers: { 'Accept': 'application/json' }
  });
})();
