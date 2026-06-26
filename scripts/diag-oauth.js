
'use strict';
const https = require('https');
const APP_ID       = process.env.RAKUTEN_APP_ID;   // pk_ access key
const AFFILIATE_ID = process.env.RAKUTEN_AFFILIATE_ID;
const APP_UUID     = process.env.RAKUTEN_APP_UUID;  // UUID app ID

function req(label, options, body) {
  return new Promise((resolve) => {
    const r = https.request(options, (res) => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => {
        let parsed; try { parsed = JSON.parse(d); } catch(e) { parsed = {_raw: d.slice(0,200)}; }
        console.log('['+label+'] HTTP='+res.statusCode);
        console.log(JSON.stringify(parsed).slice(0,300));
        resolve(parsed);
      });
    });
    r.on('error', e => { console.log('['+label+'] NET:', e.message); resolve({}); });
    if (body) r.write(body);
    r.end();
  });
}

(async () => {
  // Test: OAuth2 token endpoint with UUID as client_id and pk_ as client_secret
  const creds = Buffer.from(APP_UUID + ':' + APP_ID).toString('base64');
  const tokenResult = await req('OAuth2-token', {
    hostname: 'app.rakuten.co.jp',
    path: '/services/oauth/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + creds,
    }
  }, 'grant_type=client_credentials');

  // Also try: applicationId as UUID directly (old API still live?)  
  const keyword = encodeURIComponent('エーハイム クラシック 2217');
  await req('UUID-direct', {
    hostname: 'app.rakuten.co.jp',
    path: `/services/api/IchibaItem/Search/20220601?applicationId=${APP_UUID}&keyword=${keyword}&hits=1`,
    headers: { 'Accept': 'application/json' }
  });

  // Try the new 2026 API endpoint
  await req('new-2026-endpoint', {
    hostname: 'app.rakuten.co.jp', 
    path: `/services/api/IchibaItem/Search/20230601?applicationId=${APP_UUID}&keyword=${keyword}&hits=1`,
    headers: { 'Accept': 'application/json' }
  });
})();
