
'use strict';
const https = require('https');
const APP_ID       = process.env.RAKUTEN_APP_ID;
const AFFILIATE_ID = process.env.RAKUTEN_AFFILIATE_ID;

function test(label, options, postData) {
  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        let r; try { r = JSON.parse(d); } catch(e) { r = {_raw: d.slice(0,100)}; }
        console.log('['+label+'] HTTP='+res.statusCode+' error='+(r.error||'none')+' items='+(r.Items||[]).length);
        if (r.error) console.log('  desc:', r.error_description||'');
        if (r._raw) console.log('  raw:', r._raw);
        resolve();
      });
    });
    req.on('error', e => { console.log('['+label+'] NET:', e.message); resolve(); });
    if (postData) req.write(postData);
    req.end();
  });
}

(async () => {
  const keyword = encodeURIComponent('エーハイム クラシック 2217');

  // Test 1: Old endpoint, pk_ as applicationId (already known to fail)
  await test('T1-old-query', {
    hostname: 'app.rakuten.co.jp',
    path: `/services/api/IchibaItem/Search/20220601?applicationId=${APP_ID}&keyword=${keyword}&hits=1`,
    headers: { 'Accept': 'application/json' }
  });

  // Test 2: New API with Authorization Bearer header (2026 migration style)
  await test('T2-bearer-header', {
    hostname: 'app.rakuten.co.jp',
    path: `/services/api/IchibaItem/Search/20220601?keyword=${keyword}&hits=1`,
    headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + APP_ID }
  });

  // Test 3: New endpoint path (some APIs moved)
  await test('T3-new-path', {
    hostname: 'api.rakuten.co.jp',
    path: `/services/api/IchibaItem/Search/20220601?applicationId=${APP_ID}&keyword=${keyword}&hits=1`,
    headers: { 'Accept': 'application/json' }
  });

  // Test 4: applicationId = access key without pk_ prefix
  const stripped = APP_ID.replace(/^pk_/, '');
  await test('T4-strip-prefix', {
    hostname: 'app.rakuten.co.jp',
    path: `/services/api/IchibaItem/Search/20220601?applicationId=${stripped}&keyword=${keyword}&hits=1`,
    headers: { 'Accept': 'application/json' }
  });
})();
