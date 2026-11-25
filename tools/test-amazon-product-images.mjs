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
const key=asin=>'jp-primary-v3:'+asin;
const stored=new Map();
let writes=0,reads=0;
const env={...setup,KLG_AMAZON_IMAGES:{
 async get(keys,opt){
   assert.ok(Array.isArray(keys)); assert.equal(opt.type,'json'); reads++;
   return new Map(keys.map(k=>[k,stored.get(k)??null]));
 },
 async put(k,data,opt){
   const row=JSON.parse(data);
   assert.match(k,/^jp-primary-v3:[A-Z0-9]{10}$/);
   assert.equal(opt.expiration,Math.floor((row.checkedAt+64800000)/1000));
   stored.set(k,row); writes++;
 },
 async delete(k){stored.delete(k); writes++;}
}};
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
const dedicated=new Request(route.replace('kamelifeguide.com','amazon-images.kamelifeguide.com')+'?items='+id,{
  headers:{Origin:'https://kamelifeguide.com','Sec-Fetch-Site':'same-site'}});
const dedicatedReply=await serve(dedicated,env,current,true);
assert.equal(dedicatedReply.headers.get('Access-Control-Allow-Origin'),'https://kamelifeguide.com');
assert.equal(dedicatedReply.headers.get('Vary'),'Origin');
assert.equal(dedicatedReply.headers.get('Cross-Origin-Resource-Policy'),'same-site');
assert.equal((await dedicatedReply.json()).photos[id].detailUrl,detailUrl);
assert.deepEqual((await (await serve(dedicated,env,current+64800000,true)).json()).photos,{});
for(const origin of [null,'https://example.com','https://www.kamelifeguide.com','https://kamelifeguide.com.evil.test']){
 const response=await serve(new Request(dedicated.url,{headers:{...(origin?{Origin:origin}:{}),'Sec-Fetch-Site':'same-site'}}),env,current,true);
 assert.equal(response.status,403);
 assert.equal(response.headers.get('Access-Control-Allow-Origin'),null);
}
assert.equal((await serve(new Request(dedicated.url,{headers:{Origin:'https://kamelifeguide.com','Sec-Fetch-Site':'cross-site'}}),env,current,true)).status,403);
assert.equal((await serve(new Request(dedicated.url.replace('amazon-images.kamelifeguide.com','example.pages.dev'),{headers:dedicated.headers}),env,current,true)).status,404);
assert.equal((await serve(dedicated,env,current)).status,404);

assert.deepEqual(await body(serve(new Request(route+'?items='+id),env,current+64800000)),{photos:{}});
await assert.rejects(doRefresh(429),/official_api_http_429/);
await assert.rejects(doRefresh({itemsResult:{items:[item(other)]}}),/item_mismatch/);
await assert.rejects(doRefresh({errors:[{code:'UnknownFailure'}]}),/unexpected_catalog/);
assert.equal(writes,1);
const invalidPhoto=url.replace('.com/','.com.invalid/');
await assert.rejects(doRefresh({itemsResult:{items:[item(id,other)]}}),/official_api_invalid_detail_url/);
await assert.rejects(doRefresh({itemsResult:{items:[item(id,id,invalidPhoto)]}}),/official_api_invalid_photo_url/);
assert.equal(writes,1);
const unavailable=(sku,code='ItemNotAccessible')=>({code,message:code==='ItemNotAccessible'
 ? 'The ItemId '+sku+' is not accessible through the Creators API.'
 : 'The ItemIds '+sku+' provided in the request is invalid.'});
assert.equal((await doRefresh({errors:[unavailable(id)]})).available,0);
const medium=url.replace('test-fixture','medium-fixture');
const withMedium=item(id,id,invalidPhoto);
withMedium.images.primary.medium={url:medium};
assert.deepEqual(await doRefresh({itemsResult:{items:[withMedium]}}),{requested:1,available:1});
assert.equal(stored.get(key(id)).url,medium);
const pairEnv={...env,KLG_APPROVED_ASINS:id+','+other};
const pairRefresh=(data,at=current)=>refresh(pairEnv,{fetcher:fake(data),clock:()=>at,sleep:async()=>{}});
const storePair=()=>pairRefresh({itemsResult:{items:[item(),item(other,other)]}});
assert.deepEqual(await storePair(),{requested:2,available:2});
const fresh=new Map(stored), freshWrites=writes;
const unrelated='B012345678';
for(const [data,error] of [
 [{itemsResult:{items:[item()]}},/incomplete_batch/],
 [{itemsResult:{items:[item(),item(other,id)]}},/official_api_invalid_detail_url/],
 [{itemsResult:{items:[item(),item(other,other,invalidPhoto)]}},/official_api_invalid_photo_url/],
 [{itemsResult:{items:[item(),item(other,other,'')]}},/official_api_invalid_photo_url/],
 [{itemsResult:{items:[item()]},errors:[unavailable(unrelated)]},/item_error_mismatch/],
 [{itemsResult:{items:[item()]},errors:[{code:'ItemNotAccessible'}]},/item_error_mismatch/],
 [{itemsResult:{items:[item()]},errors:[unavailable(id)]},/item_error_mismatch/],
 [{itemsResult:{items:[item()]},errors:[unavailable(other),unavailable(other)]},/item_error_mismatch/],
 [{itemsResult:{items:[item()]},errors:[unavailable(other+', '+unrelated)]},/item_error_mismatch/],
]) {
 await assert.rejects(pairRefresh(data,current+60000),error);
 assert.equal(writes,freshWrites);
 assert.deepEqual(stored,fresh);
 const req=new Request(route+'?items='+id+','+other);
 const both=await body(serve(req,pairEnv,current+60000));
 assert.deepEqual(Object.keys(both.photos),[id,other]);
 assert.ok(Object.values(both.photos).every(photo=>photo.expiresAt===current+64800000));
 assert.deepEqual(await body(serve(req,pairEnv,current+64800000)),{photos:{}});
}
for(const data of [
 {itemsResult:{items:[item()]},errors:[unavailable(other)]},
 {itemsResult:{items:[item()]},errors:[unavailable(other,'InvalidParameterValue')]},
 {itemsResult:{items:[item(),{asin:other,detailPageURL:item(other,other).detailPageURL}]}},
]) {
 await storePair();
 const before=writes;
 assert.deepEqual(await pairRefresh(data,current+60000),{requested:2,available:1});
 assert.equal(writes,before+2);
 const req=new Request(route+'?items='+id+','+other);
 const one=await body(serve(req,pairEnv,current+60000));
 assert.deepEqual(Object.keys(one.photos),[id]);
 assert.equal(one.photos[id].expiresAt,current+60000+64800000);
}
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
const multiBatchSnapshot=new Map(stored), multiBatchWrites=writes;
const next=current+60000;
const freshUrl=url.replace('test-fixture','updated-fixture');
const anyAsk=(when,ids=twelve,e=batched)=>body(serve(new Request(route+'?items='+ids.join(',')),e,when));
for(const [failOn,mode] of [[2,'404'],[2,'incomplete'],[1,'404']]){
  stored.clear();
  for(const [k,v] of multiBatchSnapshot)stored.set(k,v);
  let batchCalls=0;
  const before=writes;
  await assert.rejects(refresh(batched,{clock:()=>next,sleep:async()=>{},
    fetcher:async(url,init)=>{
      if(url.includes('/token')) return Response.json({access_token:'fixture'});
      const {itemIds}=JSON.parse(init.body);
      if(++batchCalls===failOn){
        if(mode==='404')return Response.json({__type:'com.amazon.creators#ResourceNotFoundException'},{status:404});
        return Response.json({itemsResult:{items:itemIds.slice(0,1).map(x=>item(x,x,freshUrl))}});
      }
      return Response.json({itemsResult:{items:itemIds.map(x=>item(x,x,freshUrl))}});
    }
  }),mode==='404'?/official_api_http_404; failed_batches=1; refreshed=/ : /incomplete_batch/);
  assert.equal(batchCalls,2,'earlier 404 must not stop later good batches');
  const good=failOn===2?twelve.slice(0,10):twelve.slice(10);
  assert.equal(writes,before+good.length);
  const during=(await anyAsk(next)).photos;
  for(const sku of twelve){
    assert.equal(during[sku].expiresAt,(good.includes(sku)?next:current)+64800000);
    assert.equal(during[sku].url,good.includes(sku)?freshUrl:url);
  }
  const reordered={...batched,KLG_APPROVED_ASINS:[...twelve].reverse().join(',')};
  assert.deepEqual(Object.keys((await anyAsk(current+64800000,twelve,reordered)).photos),good);
  assert.deepEqual((await anyAsk(next+64800000)).photos,{});
}
const before404=writes;
await assert.rejects(doRefresh(404),/official_api_http_404/);
assert.equal(writes,before404);
assert.ok(writes>multiBatchWrites);
console.log('Refresh coverage: good batches update independently; failed or incomplete batches retain original expiry; confirmed unavailable/no-image entries are removed');
const beforeRetry=writes;
await assert.rejects(refresh(env,{clock:()=>current,sleep:()=>assert.fail('must not retry long hint'),
 fetcher:async(url)=>url.includes('/token')?Response.json({access_token:'fixture'}):
   new Response(null,{status:429,headers:{'Retry-After':'30'}})}),/official_api_http_429/);
assert.equal(writes,beforeRetry);
stored.set(key(id),{checkedAt:current,url,detailUrl:detailUrl.replace(id,other)});
assert.deepEqual(await body(ask()),{photos:{}});
stored.delete(key(id));
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
assert.match(css,/\.klg-amazon-photo-link:is\(\.amazon-btn,\.prod-cta\)\s*\{\s*display:\s*inline-grid/);
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

const boxPages=["species/eastern-box-turtle.html","species/taiwan-box-turtle.html","species/ornate-box-turtle.html","species/desert-box-turtle.html","species/chinese-box-turtle.html","species/florida-box-turtle.html","species/malayan-box-turtle.html","species/indochinese-box-turtle.html","species/three-striped-box-turtle.html","species/three-toed-box-turtle.html"];
const fitHelper='../js/box-turtle-filter-fit.js';
for (const page of boxPages) {
  const species=readFileSync(new URL('../'+page,import.meta.url),'utf8');
  assert.match(species,/浅い.{0,12}水|水.{0,20}浅/,page);
  const mount=species.match(/<script>\s*([^<]*mountStarterKit\(\{ equipmentKey: 'box_turtle'[^<]*)<\/script>/);
  assert.ok(mount,page);
  const loader='<script src="'+fitHelper+'?v=1"></script>';
  const kitSource=species.search(/<script src="\.\.\/js\/starter-kit\.js\?v=[a-f0-9]+"><\/script>/);
  const fitSource=species.indexOf(loader);
  assert.ok(kitSource >= 0 && fitSource > kitSource && fitSource < mount.index,page);
  const ctx={window:{location:{hostname:'kamelifeguide.com',pathname:'/'+page,search:''}}};
  for (const path of ['../data/products.js','../js/starter-kit.js']) {
    runInNewContext(readFileSync(new URL(path,import.meta.url),'utf8'),ctx);
  }
  let kit='';
  const originalRow=JSON.parse(runInNewContext('JSON.stringify(PRODUCTS.filter_small)',ctx));
  runInNewContext(readFileSync(new URL(fitHelper,import.meta.url),'utf8'),ctx);
  ctx.mountStarterKit=opts=>{kit=ctx.renderStarterKitHtmlV2(opts.equipmentKey,opts);};
  runInNewContext(mount[1],ctx);
  const actualRow=JSON.parse(runInNewContext('JSON.stringify(PRODUCTS.filter_small)',ctx));
  assert.deepEqual({...actualRow,why:originalRow.why},originalRow,page);
  const at50=kit.split('data-sk-product="filter_small"')[1]?.split('</label>')[0];
  assert.ok(at50,page);
  assert.match(at50,/浅い水入れだけなら、このフィルターは不要/);
  assert.match(at50,/幅40〜51cm/);
  assert.match(at50,/モーターの最低水位線より上/);
  assert.doesNotMatch(at50,/必須/);
  assert.match(at50,/data-asin="B0012UO6Q6"[^>]*data-equipment-key="box_turtle"[^>]*data-product-id="filter_small"[^>]*data-provider="amazon"/);
  assert.ok(at50.indexOf('最低水位線') < at50.indexOf('data-provider="amazon"'),page);
}
for (const [model,range] of [['AT-20','15〜32'],['AT-30','20〜36']]) {
  const card=cards.find(value=>value.includes(model+'（外掛け式'));
  assert.ok(card?.includes(range+'cm水槽'));
  assert.ok(card.includes('モーターの最低水位線より上'));
  assert.doesNotMatch(card,/モーターが水槽の外側|15〜30cm水槽/);
}
