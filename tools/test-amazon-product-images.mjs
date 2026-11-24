import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {serve,refresh} from '../workers/amazon-product-images/src/index.mjs';
const id='B000NGQZU0', other='B00167XQLG';
const route='https://kamelifeguide.com/api/amazon-product-images';
const current=Date.parse('2026-11-24T18:00:00Z');
const url='https://m.media-amazon.com/images/I/test-fixture.jpg';
const setup={KLG_APPROVED_ASINS:id,KLG_CREATORS_CLIENT_ID:'test',KLG_CREATORS_CLIENT_SECRET:'test'};
let stored=null, writes=0, reads=0;
const env={...setup,KLG_AMAZON_IMAGES:{async get(){reads++;return stored;},
 async put(key,data,opt){assert.equal(key,'jp-primary-v1');assert.equal(opt.expirationTtl,64800);
   stored=JSON.parse(data);writes++;}}};
const ask=(items=id,opt={})=>serve(new Request(route+'?items='+items,opt),env,current);
const body=async resp=>(await resp).json();
assert.deepEqual(await body(ask()),{photos:{}});
assert.equal((await ask('B:invalid')).status,400);
assert.equal((await ask(id+'&items='+other)).status,400);
assert.equal((await ask(id,{headers:{'Sec-Fetch-Site':'cross-site'}})).status,403);
assert.equal((await ask(id,{method:'POST'})).status,405);
assert.equal((await serve(new Request(route.replace('kamelifeguide.com','example.org')),env)).status,404);
const failClosed=await serve(new Request(route+'?items='+id),{...env,KLG_APPROVED_ASINS:''},current);
assert.deepEqual(await failClosed.json(),{photos:{}});
const fake=(catalog)=>{
 let requests=0;
 return async (endpoint,init)=>{
   const post=JSON.parse(init.body);
   assert.equal(init.redirect,'error');
   if(requests++===0){assert.equal(endpoint,'https://api.amazon.co.jp/auth/o2/token');
     assert.equal(post.scope,'creatorsapi::default');return Response.json({access_token:'not-a-real-token'});}
   assert.equal(endpoint,'https://creatorsapi.amazon/catalog/v1/getItems');
   assert.equal(post.marketplace,'www.amazon.co.jp');assert.equal(post.partnerTag,'kamelife090e-22');
   assert.equal(init.headers['x-marketplace'],'www.amazon.co.jp');
   return typeof catalog==='number'?new Response(null,{status:catalog}):Response.json(catalog);
 };
};
const item=(sku=id,link=id,img=url)=>({
 asin:sku,detailPageURL:'https://www.amazon.co.jp/dp/'+link+'?tag=kamelife090e-22',
 images:{primary:{large:{url:img}}}
});
const doRefresh=cat=>refresh(env,{fetcher:fake(cat),clock:()=>current});
assert.deepEqual(await doRefresh({itemsResult:{items:[item()]}}),{requested:1,available:1});
assert.equal(writes,1);
const r=await ask(id+','+other);
assert.match(r.headers.get('cache-control'),/no-store/);
assert.deepEqual(await r.json(),{photos:{[id]:{asin:id,url,expiresAt:current+64800000}}});
const n=reads;
assert.deepEqual(await body(ask(other)),{photos:{}});
assert.equal(reads,n);
assert.deepEqual(await body(serve(new Request(route+'?items='+id),env,current+64800000)),{photos:{}});
await assert.rejects(doRefresh(429),/official_api_http_429/);
await assert.rejects(doRefresh({itemsResult:{items:[item(other)]}}),/item_mismatch/);
await assert.rejects(doRefresh({errors:[{code:'UnknownFailure'}]}),/unexpected_catalog/);
assert.equal(writes,1);
assert.equal((await doRefresh({itemsResult:{items:[item(id,other)]}})).available,0);
assert.equal((await doRefresh({itemsResult:{items:[item(id,id,url.replace('.com/','.com.invalid/'))]}})).available,0);
assert.equal((await doRefresh({errors:[{code:'ItemNotAccessible'}]})).available,0);
// Guide mismatch fix: do not advertise an external/top filter and send to an AT-50.
const guide=readFileSync(new URL('../guide-beginner.html',import.meta.url),'utf8');
const filter=guide.slice(guide.indexOf('<div class="gear-name">飼育水量に合うフィルター'),guide.indexOf('<div class="gear-name">亀用配合飼料'));
assert.match(filter,/href="water-filter-best10\.html">フィルターを種類別に比較/);
assert.match(filter,/B0012UO6Q6\?tag=kamelife090e-22[^>]+>外掛け式 AT-50をAmazonで見る/);
assert.match(readFileSync(new URL('../water-filter-best10.html',import.meta.url),'utf8'),/オートワンタッチフィルター AT-50（外掛け式・大型）/);
console.log('Amazon image checks: strict scope, whitelist, redirects, site-only response, same-ASIN, expiry, safe failure and mismatched guide link PASS');

// Execute the actual sizing routine in isolation. Source file is not auto-loaded.
const js=readFileSync(new URL('../js/amazon-product-images.js',import.meta.url),'utf8');
const code=js.slice(js.indexOf('  function frameSize('),js.indexOf('  function paint('));
assert.ok(code.length>100);
const size=runInNewContext(code+'; frameSize');
for(const [w,h,want] of [[500,500,[200,200]],[318,500,[165,260]],[500,270,[260,140]],
  [80,140,[80,140]],[160,90,[160,90]],[1,2000,[1,260]],[0,500,null]]){
  assert.deepEqual(size(w,h)?Array.from(size(w,h)):null,want);
}
const css=readFileSync(new URL('../css/amazon-product-images.css',import.meta.url),'utf8');
assert.match(css,/max-inline-size: 100%/);
assert.match(css,/object-fit: contain/);
console.log('Mobile photo sizing: portrait/landscape, small source, missing dimensions and parent cap PASS');
