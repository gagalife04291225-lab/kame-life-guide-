// Offline only: no browser, network, GA4 account or real events.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>fs.readFileSync(root+p,'utf8');
const BASE='5c2b665555dc513072b7385f66786bc49f5ac154';
const old=p=>execFileSync('git',['-C',root,'show',BASE+':'+p],{encoding:'utf8'});
const pages={'guide-beginner.html':12,'guide-brackish.html':3,'trouble/not-eating.html':4,'trouble/runny-nose.html':4,'trouble/swollen-eyes.html':2,'guides/keeper-hacks.html':12};
const decode=s=>s.replace(/&amp;/g,'&');
const attrs=s=>Object.fromEntries([...s.matchAll(/([\w-]+)="([^"]*)"/g)].map(m=>[m[1],decode(m[2])]));
const anchors=s=>[...s.matchAll(/<a\b[^>]*>/g)].map(m=>attrs(m[0]));
function anchor(a){
 const classes=new Set((a.class||'').split(' '));
 const n={getAttribute:k=>a[k]??null,setAttribute:(k,v)=>a[k]=v,removeAttribute:k=>delete a[k],classList:{contains:k=>classes.has(k),remove:k=>classes.delete(k)},closest:s=>s==='.cta'&&classes.has('cta')?n:s==='a[data-commerce-static="1"][href]'&&a['data-commerce-static']==='1'&&a.href?n:null};
 return n;
}
function harness(path){
 const events=[],handlers={};
 const window={location:{href:'https://kamelifeguide.com/'+path,pathname:'/'+path},gtag:(...x)=>events.push(x)};
 const document={readyState:'complete',addEventListener:(k,f)=>(handlers[k]??=[]).push(f),querySelectorAll:()=>[],querySelector:()=>null,getElementById:()=>null};
 const c=vm.createContext({window,document,URL,console});
 return {c,window,document,events,handlers,run:p=>vm.runInContext(read(p),c),click:n=>{let prevented=false;for(const f of handlers.click||[])f({target:{closest:s=>n?.closest(s)},preventDefault:()=>prevented=true});return prevented;}};
}
let total=0,tagged=0,searches=0;const examples={};
for(const [p,count]of Object.entries(pages)){
 const current=read(p),baseline=old(p),list=anchors(current).filter(a=>a['data-commerce-static']==='1');
 assert.equal(list.length,count,p);
 // Freeze only this slice's retailer anchors, permitting independently reviewed prose edits.
 const commerce=a=>{try{return ['www.amazon.co.jp','search.rakuten.co.jp','hb.afl.rakuten.co.jp'].includes(new URL(a.href).hostname);}catch{return false;}};
 const withoutMarker=list.map(a=>{const b={...a};delete b['data-commerce-static'];return b;});
 assert.deepEqual(withoutMarker,anchors(baseline).filter(commerce),p+' retailer href/attributes preserved');
 assert.equal((current.match(/affiliate-track-content\.js/g)||[]).length,1);
 assert.ok(!/affiliate-track-static\.js|affiliate-cta\.js/.test(current));
 const h=harness(p);h.run('js/affiliate-track-content.js');h.run('js/affiliate-track-content.js');assert.equal(h.handlers.click.length,1,'double include guarded');
 for(const a of list){
  const n=anchor({...a}),start=h.events.length;assert.equal(h.click(n),false);assert.equal(h.events.length,start+1);
  const [verb,event,data]=h.events.at(-1);examples[event+':'+data.provider+':'+data.link_type]??=h.events.at(-1);assert.equal(verb,'event');
  assert.equal(data.location,p.startsWith('trouble/')?'trouble_page':'guide_page');
  for(const key of ['provider','location','category','product_id','species_slug','tier'])assert.ok(key in data);
  assert.ok(!('value'in data)&&!('currency'in data));
  if(a.href.includes('search.rakuten.co.jp')){searches++;assert.equal(event,'retailer_outbound_click');assert.equal(data.link_type,'retailer_search');assert.equal(data.provider,'rakuten');assert.equal(data.product_id,'');}
  else {tagged++;assert.equal(event,'affiliate_click');assert.equal(data.provider,a.href.includes('hb.afl.rakuten.co.jp')?'rakuten':'amazon');const asin=a.href.match(/\/dp\/([A-Z0-9]{10})/);assert.equal(data.product_id,asin?asin[1]:'');assert.equal(data.link_type,asin||data.provider==='rakuten'?'affiliate_product':'affiliate_search');}
  total++;
 }
 // Generated setup/starter-kit links, attribution and unrelated links are not opted in.
 let before=h.events.length;
 for(const a of [{href:'https://www.amazon.co.jp/dp/B0012UO6Q6?tag=kamelife090e-22','data-retailer':'amazon'},{href:'https://developers.rakuten.com/'},{href:'/index.html'},{href:'https://evil.example/?amazon.co.jp','data-commerce-static':'1'},{href:list[0].href,'data-commerce-static':'1','aria-disabled':'true'}])h.click(anchor(a));
 assert.equal(h.events.length,before,'unrelated/dynamic ignored');
 delete h.window.gtag;assert.doesNotThrow(()=>h.click(anchor({...list[0]})));
 h.window.gtag=()=>{throw new Error('mock failure');};assert.equal(h.click(anchor({...list[0]})),false,'analytics failure preserves navigation');
}
assert.deepEqual([total,tagged,searches],[37,22,15]);
// KID actual renderer and bound handlers; mocks provide no network APIs.
const h=harness('kid/');h.run('data/kid.js');h.run('js/kid-lookup.js');h.run('js/affiliate-track-content.js');
const {KID,KIDLookupTest:T}=h.window;
const active=KID.equipment.filter(x=>x.cta_enabled!==false&&x.affiliate?.amazon&& !['UNSAFE','UNKNOWN'].includes(x.safety_label));
assert.deepEqual(Array.from(active,x=>x.id),['nest-tote-soil','light-stand','filter-sponge']);
for(const item of active){
 const list=anchors(T.ctaHtml(item));
 const a=anchor(list.find(a=>a['data-channel']==='amazon'));
 const start=h.events.length;
 assert.equal(h.click(a),true,'conditional initially locked');assert.equal(h.events.length,start);
 // Execute the real details handler, not a manually stripped lock.
 h.document.getElementById=id=>id==='detail-'+item.id?{classList:{toggle:()=>true}}:null;
 h.document.querySelector=()=>({querySelectorAll:()=>[a],querySelector:()=>null});
 const toggle={getAttribute:()=>item.id,setAttribute:()=>{},closest:s=>s==='[data-toggle]'?toggle:null};
 h.click(toggle);assert.ok(a.getAttribute('href'));assert.equal(a.getAttribute('data-href'),null);
 const pre=h.events.length;assert.equal(h.click(a),false);assert.equal(h.events.length,pre+1,'one canonical event, no static duplicate');
 const [verb,name,d]=h.events.at(-1);assert.equal(verb,'event');assert.equal(name,'affiliate_click');
 examples['kid:'+item.id]=h.events.at(-1);assert.equal(d.equipment_id,item.id);assert.equal(d.product_id,item.id);assert.equal(d.channel,'amazon');assert.equal(d.provider,'amazon');assert.equal(d.source,'kid');assert.equal(d.location,'kid_lookup');
 for(const k of ['category','species_slug','tier'])assert.ok(k in d);
 const placeholder=anchor(list.find(a=>a['data-channel']==='rakuten'));let n=h.events.length;assert.equal(h.click(placeholder),true);assert.equal(h.events.length,n);
}
for(const id of ['tub-toro-80','hospital-container'])assert.equal(T.ctaHtml(KID.equipment.find(x=>x.id===id)),'');
for(const safety_label of ['UNSAFE','UNKNOWN'])assert.equal(T.ctaHtml({...active[0],safety_label}),'');
assert.equal(T.ctaHtml({...active[0],cta_enabled:false}),'');
let safe=anchor(anchors(T.ctaHtml({...active[0],safety_label:'SAFE'})).find(a=>a['data-channel']==='amazon'));
let before=h.events.length;assert.equal(h.click(safe),false);assert.equal(h.events.length,before+1);
delete h.window.gtag;assert.doesNotThrow(()=>h.click(safe));
assert.equal(read('data/kid.js'),old('data/kid.js'),'KID data unchanged');
assert.equal(read('data/products.js'),old('data/products.js'),'product data unchanged');
console.log(JSON.stringify(examples,null,2));
console.log('PASS:37 exact hrefs preserved;22 tagged affiliate_click +15 separate retailer_outbound_click;single listener;dynamic/unrelated ignored;3 KID real unlock flows, legacy+canonical payload,placeholders/disabled/unsafe/unknown gated;no real events.');
