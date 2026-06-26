
'use strict';
const https = require('https');
const APP_ID     = process.env.RAKUTEN_APP_ID;
const ACCESS_KEY = process.env.RAKUTEN_ACCESS_KEY;
const AFF_ID     = process.env.RAKUTEN_AFFILIATE_ID;
const REFERER    = 'https://gagalife04291225-lab.github.io/kame-life-guide-/';

function testPost(label, hostname, path, body, headers) {
  return new Promise(resolve => {
    const bodyStr = JSON.stringify(body);
    const opts = {
      hostname, path, method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(bodyStr), 'Accept': 'application/json' }, headers)
    };
    const req = https.request(opts, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => {
        console.log('['+label+'] HTTP='+res.statusCode);
        let r; try { r = JSON.parse(d); } catch(e) { r = {_raw: d.slice(0,150)}; }
        const items = r.Items || [];
        if (r.errors) console.log('  err:', JSON.stringify(r.errors));
        if (r.error) console.log('  err:', r.error, r.error_description);
        if (r._raw) console.log('  raw:', r._raw);
        if (items.length) {
          const item = items[0].Item || items[0];
          console.log('  ITEM:', (item.itemName||'').slice(0,50));
          console.log('  affiliateUrl:', item.affiliateUrl ? 'YES: '+item.affiliateUrl.slice(0,40) : 'NO');
        }
        resolve();
      });
    });
    req.on('error', e => { console.log('['+label+'] ERR:', e.message); resolve(); });
    req.write(bodyStr);
    req.end();
  });
}

function testGet(label, hostname, path, headers) {
  return new Promise(resolve => {
    const opts = { hostname, path, method: 'GET', headers: Object.assign({ 'Accept': 'application/json' }, headers) };
    https.request(opts, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => {
        console.log('['+label+'] HTTP='+res.statusCode);
        let r; try { r = JSON.parse(d); } catch(e) { r = {_raw: d.slice(0,150)}; }
        if (r.errors) console.log('  err:', JSON.stringify(r.errors));
        if (r.error) console.log('  err:', r.error, r.error_description);
        if (r._raw) console.log('  raw:', r._raw);
        const items = r.Items || [];
        if (items.length) console.log('  ITEMS:', items.length, 'affiliateUrl:', (items[0].Item||items[0]).affiliateUrl ? 'YES' : 'NO');
        resolve();
      });
    }).on('error', e => { console.log('['+label+'] ERR:', e.message); resolve(); }).end();
  });
}

(async () => {
  const kw = 'エーハイム クラシック 2217';

  // POST with referrer in body
  await testPost('POST-referer-body', 'openapi.rakuten.co.jp',
    '/ichibams/api/IchibaItem/Search/20220601',
    { applicationId: APP_ID, accessKey: ACCESS_KEY, affiliateId: AFF_ID,
      keyword: kw, hits: 1, referrer: REFERER, httpReferrer: REFERER },
    { 'Authorization': 'Bearer ' + ACCESS_KEY }
  );

  // GET with Origin header instead of Referer
  await testGet('GET-origin-header',
    'openapi.rakuten.co.jp',
    `/ichibams/api/IchibaItem/Search/20220601?applicationId=${APP_ID}&accessKey=${ACCESS_KEY}&affiliateId=${AFF_ID}&keyword=${encodeURIComponent(kw)}&hits=1`,
    { 'Authorization': 'Bearer ' + ACCESS_KEY, 'Origin': 'https://gagalife04291225-lab.github.io', 'Referer': REFERER }
  );

  // GET with X-Forwarded-Host to simulate referrer
  await testGet('GET-x-host',
    'openapi.rakuten.co.jp',
    `/ichibams/api/IchibaItem/Search/20220601?applicationId=${APP_ID}&accessKey=${ACCESS_KEY}&affiliateId=${AFF_ID}&keyword=${encodeURIComponent(kw)}&hits=1`,
    { 'Authorization': 'Bearer ' + ACCESS_KEY, 'X-Forwarded-Host': 'gagalife04291225-lab.github.io' }
  );
})();
