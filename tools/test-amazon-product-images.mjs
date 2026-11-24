import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {serve,refresh} from '../workers/amazon-product-images/src/index.mjs';
const id='B000NGQZU0', other='B00167XQLG';
const route='https://kamelifeguide.com/api/amazon-product-images';
const current=Date.parse('2026-11-24T18:00:00Z');
const url='https://m.media-amazon.com/images/I/test-fixture.jpg';
const detailUrl='https://www.amazon.co.jp/dp/'+id+'?tag=kamelife090e-22&linkCode=ogi&language=ja_JP&th=1&psc=1';
const setup={KLG_APPROVED_ASINS:id,KLG_CREATORS_CLIENT_ID:'test',KLG_CREATORS_CLIENT_SECRET:'test'};
let stored=null, writes=0, reads=0;
const env={...setup,KLG_AMAZON_IMAGES:{async get(){reads++;return stored;},
 async put(key,data,opt){assert.equal(key,'jp-primary-v2');assert.equal(opt.expirationTtl,64800);
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
 asin:sku,detailPageURL:link===id?detailUrl:'https://www.amazon.co.jp/dp/'+link+'?tag=kamelife090e-22',
 images:{primary:{large:{url:img}}}
});
const doRefresh=cat=>refresh(env,{fetcher:fake(cat),clock:()=>current,sleep:async()=>{}});
assert.deepEqual(await doRefresh({itemsResult:{items:[item()]}}),{requested:1,available:1});
assert.equal(writes,1);
const r=await ask(id+','+other);
assert.match(r.headers.get('cache-control'),/no-store/);
assert.deepEqual(await r.json(),{photos:{[id]:{asin:id,url,detailUrl,expiresAt:current+64800000}}});
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
const waits=[];
const calls=[];
const twelve=Array.from({length:12},(_,i)=>'B'+String(i).padStart(9,'0'));
let tries=0;
const batched={...env,KLG_APPROVED_ASINS:twelve.join(',')};
const counts=await refresh(batched,{clock:()=>current,sleep:async ms=>{waits.push(ms);},
 fetcher:async(url,init)=>{
   if(url.includes('/token')) return Response.json({access_token:'fixture'});
   const {itemIds}=JSON.parse(init.body);calls.push(itemIds.length);
   if(tries++===0)return new Response(null,{status:429,headers:{'Retry-After':'5'}});
   return Response.json({itemsResult:{items:itemIds.map(x=>item(x,x))}});
 }});
assert.deepEqual(waits,[5000,2200]);
assert.deepEqual(calls,[10,10,2]);
assert.deepEqual(counts,{requested:12,available:12});
const beforeRetry=writes;
await assert.rejects(refresh(env,{clock:()=>current,sleep:()=>assert.fail('must not retry long hint'),
 fetcher:async(url)=>url.includes('/token')?Response.json({access_token:'fixture'}):
   new Response(null,{status:429,headers:{'Retry-After':'30'}})}),/official_api_http_429/);
assert.equal(writes,beforeRetry);
const old=stored;stored={checkedAt:current,photos:{[id]:{url,detailUrl:detailUrl.replace(id,other)}}};
assert.deepEqual(await body(ask()),{photos:{}});
stored=old;
// Guide mismatch fix: do not advertise an external/top filter and send to an AT-50.
const guide=readFileSync(new URL('../guide-beginner.html',import.meta.url),'utf8');
const filter=guide.slice(guide.indexOf('<div class="gear-name">飼育水量に合うフィルター'),guide.indexOf('<div class="gear-name">亀用配合飼料'));
assert.match(filter,/href="water-filter-best10\.html">フィルターを種類別に比較/);
assert.match(filter,/B0012UO6Q6\?tag=kamelife090e-22[^>]+>外掛け式 AT-50をAmazonで見る/);
assert.match(filter,/AT-50は外掛け式で、メーカーの適合水槽は幅40〜51cm/);
assert.match(filter,/モーターの最低水位線より上/);
const comparison=readFileSync(new URL('../water-filter-best10.html',import.meta.url),'utf8');
const cards=comparison.split('<div class="item">');
for (const [model,range,asin] of [['AT-50','40〜51','B0012UO6Q6'],['AT-75W','60〜75','B002JIEPMU']]) {
  const card=cards.find(value=>value.includes(model+'（外掛け式）'));
  assert.ok(card,'comparison card: '+model);
  assert.ok(card.includes('メーカー適合：'+range+'cm水槽'));
  assert.ok(card.includes('モーターの最低水位線より上'));
  assert.ok(card.includes('href="https://spectrumbrands.jp/products-aqua/filter/0093-2/"'));
  assert.ok(card.includes('href="https://spectrumbrands.jp/product-qa/aqua/568/"'));
  assert.ok(card.includes('data-asin="'+asin+'"'));
  assert.doesNotMatch(card,/75〜120cm水槽向け|大型水槽|多めの飼育数|90cm以上の水槽で/);
}
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


// Execute the exact runtime photo/link controllers with minimal DOM objects.
// The existing anchor is neither replaced nor given a second click listener.
const jss=js.slice(js.indexOf('  const asinOf'),js.indexOf('  function scheduleFlush'));
let imageNode;
let ctx;
const el=()=>({className:'',hidden:false,style:{},events:{},
  attrs:new Map(),dataset:{},isConnected:true,textContent:'Amazonで見る',
  getAttribute(k){return this.attrs.get(k);},setAttribute(k,v){this.attrs.set(k,v);},
  removeAttribute(k){this.attrs.delete(k);},remove(){this.removed=true;},
  append(child){this.child=child;},prepend(child){this.frame=child;},
  addEventListener(k,fn){this.events[k]=fn;},
  closest(sel){return sel.startsWith('.item')?ctx:null;},
  querySelector(){return null;},classList:{add(){},remove(){}}});
ctx=el();
const runtime=runInNewContext(jss+'; ({paint,remove,validPhoto})',{
  location:{origin:'https://kamelifeguide.com'},URL,Date,
  document:{createElement(type){const n=el();if(type==='img'){imageNode=n;n.naturalWidth=318;n.naturalHeight=500;}return n;}}
});
const a=el();
const original='https://www.amazon.co.jp/dp/'+id+'?tag=kamelife090e-22';
a.setAttribute('href',original); a.dataset.clickUrl=original;
const nowPhoto={asin:id,url,detailUrl,expiresAt:Date.now()+50000};
runtime.paint(a,id,nowPhoto);
assert.equal(a.getAttribute('href'),original);
imageNode.events.load();
assert.equal(a.getAttribute('href'),detailUrl);
assert.equal(a.dataset.clickUrl,detailUrl);
assert.equal(a.frame.hidden,false);
assert.deepEqual(Object.keys(a.events),[]);
runtime.remove(a);
assert.equal(a.getAttribute('href'),original);
assert.equal(a.dataset.clickUrl,original);
assert.equal(a.frame.removed,true);
for(const bad of [detailUrl.replace(id,other), detailUrl.replace('.jp/','.jp.evil/'), detailUrl+'&tag=another']){
  assert.equal(runtime.validPhoto({...nowPhoto,detailUrl:bad},id),false);
}
runtime.paint(a,id,nowPhoto);
imageNode.events.error();
assert.equal(a.getAttribute('href'),original);
assert.equal(a.frame.removed,true);
console.log('Attribution: exact unchanged API destination, one original link, failure restores safely; bounded 429 and pacing PASS');

const eastern=readFileSync(new URL('../species/eastern-box-turtle.html',import.meta.url),'utf8');
assert.match(eastern,/浅い水入れ/);
const mount=eastern.match(/mountStarterKit\(\{ equipmentKey: '([^']+)', name: '([^']+)'/);
assert.ok(mount);
const kitContext={window:{location:{hostname:'kamelifeguide.com',pathname:'/species/eastern-box-turtle.html',search:''}}};
for (const path of ['../data/products.js','../js/starter-kit.js']) {
  runInNewContext(readFileSync(new URL(path,import.meta.url),'utf8'),kitContext);
}
const kit=kitContext.renderStarterKitHtmlV2(mount[1],{name:mount[2]});
const at50=kit.split('data-sk-product="filter_small"')[1]?.split('</label>')[0];
assert.ok(at50,'actual V2 budget card for the named page');
assert.match(at50,/浅い水入れだけなら、このフィルターは不要/);
assert.match(at50,/幅40〜51cm/);
assert.match(at50,/モーターの最低水位線より上/);
assert.doesNotMatch(at50,/必須/);
assert.match(at50,/data-asin="B0012UO6Q6"[^>]*data-equipment-key="box_turtle"[^>]*data-product-id="filter_small"[^>]*data-provider="amazon"/);
assert.ok(at50.indexOf('最低水位線') < at50.indexOf('data-provider="amazon"'));
for (const [model,range] of [['AT-20','15〜32'],['AT-30','20〜36']]) {
  const card=cards.find(value=>value.includes(model+'（外掛け式'));
  assert.ok(card?.includes(range+'cm水槽'));
  assert.ok(card.includes('モーターの最低水位線より上'));
  assert.doesNotMatch(card,/モーターが水槽の外側|15〜30cm水槽/);
}
