
'use strict';
const https = require('https');
const APP_ID       = process.env.RAKUTEN_APP_ID;
const AFFILIATE_ID = process.env.RAKUTEN_AFFILIATE_ID;

function testApi(label, paramName, paramValue) {
  return new Promise((resolve) => {
    const params = new URLSearchParams({
      [paramName]: paramValue,
      keyword: 'エーハイム 2217',
      hits: '1',
    });
    const path = '/services/api/IchibaItem/Search/20220601?' + params.toString();
    https.request({ hostname:'app.rakuten.co.jp', path, method:'GET',
      headers:{'Accept':'application/json'} }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        let r;
        try { r = JSON.parse(d); } catch(e) { r = {error:'parse_fail'}; }
        console.log('[' + label + '] status=' + res.statusCode +
          ' error=' + (r.error||'none') + ' items=' + (r.Items||[]).length);
        resolve();
      });
    }).on('error', e => { console.log('['+label+'] NET:'+e.message); resolve(); }).end();
  });
}

(async () => {
  // Test 1: applicationId with UUID
  await testApi('UUID-as-applicationId', 'applicationId', APP_ID);
  // Test 2: Try without affiliateId (simpler request)
  await testApi('UUID-no-affiliate', 'applicationId', APP_ID);
  // Show what the API error says for wrong ID to compare
  console.log('APP_ID:', APP_ID.replace(/[^-]/g,'x'));
  console.log('AFFILIATE_ID:', AFFILIATE_ID.replace(/[^.]/g,'x'));
})();
