
'use strict';
const https = require('https');
const ACCESS_KEY   = process.env.RAKUTEN_APP_ID;      // pk_... access key
const AFFILIATE_ID = process.env.RAKUTEN_AFFILIATE_ID;

function test(label, params) {
  return new Promise((resolve) => {
    const p = new URLSearchParams({...params, keyword:'エーハイム 2217', hits:'1'});
    https.request({
      hostname:'app.rakuten.co.jp',
      path:'/services/api/IchibaItem/Search/20220601?' + p.toString(),
      method:'GET', headers:{'Accept':'application/json'}
    }, (res) => {
      let d=''; res.on('data',c=>d+=c);
      res.on('end',()=>{
        let r; try{r=JSON.parse(d);}catch(e){r={error:'parse'};}
        console.log('['+label+'] HTTP='+res.statusCode+
          ' error='+(r.error||'NONE')+' items='+(r.Items||[]).length);
        if(r.Items&&r.Items[0]){
          const item=r.Items[0].Item||r.Items[0];
          console.log('  itemUrl: '+(item.itemUrl?'YES':'NO'));
          console.log('  affiliateUrl: '+(item.affiliateUrl?'YES':'NO'));
          if(item.affiliateUrl) console.log('  affUrl sample: '+item.affiliateUrl.slice(0,40)+'...');
        }
        resolve();
      });
    }).on('error',e=>{console.log('['+label+'] ERR:'+e.message);resolve();}).end();
  });
}

(async()=>{
  // Test 1: Access key as applicationId (new format?)
  await test('AccessKey-as-appId', {applicationId: ACCESS_KEY, affiliateId: AFFILIATE_ID});
  // Test 2: Access key without affiliateId
  await test('AccessKey-no-affId', {applicationId: ACCESS_KEY});
})();
