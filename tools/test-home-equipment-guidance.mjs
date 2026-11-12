import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const cwd=fileURLToPath(new URL('../',import.meta.url));
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8').replace(/\r\n/g,'\n');
const base=p=>execFileSync('git',['-C',cwd,'show','6b1ac588:'+p],{encoding:'utf8'}).replace(/\r\n/g,'\n');
function context(reader){const c=vm.createContext({console,window:{},document:{}});const h=reader('shindan/index.html');const a=h.indexOf('function resolveEquipmentKey('),b=h.indexOf('\n}',a);vm.runInContext(reader('data/products.js')+'\n'+reader('js/starter-kit.js')+'\n'+reader('shindan/species.js')+'\n'+h.slice(a,b+2)+';this.species=SPECIES;this.products=PRODUCTS;',c);return c;}
const old=context(base),now=context(read),plain=x=>JSON.parse(JSON.stringify(x));
const stripped=p=>{const o=plain(p);delete o.why;return o;};
assert.deepEqual(Object.keys(now.products),Object.keys(old.products));
for(const id of Object.keys(old.products)){assert.deepEqual(stripped(now.products[id]),stripped(old.products[id]),id);if(id!=='substrate_grassland_mix')assert.equal(now.products[id].why,old.products[id].why,id);}
const js=read('js/starter-kit.js');assert.ok(!js.includes('SK_SPECIES_PRODUCT_HOLDS'));assert.ok(!js.includes('getHeldKitItems'));
let count=0;
for(const [route,list] of Object.entries(now.species).filter(([r])=>r!=='all'))for(let i=0;i<list.length;i++)for(const r of [route,'all'])for(const tier of ['budget','standard','premium']){
 const sp=list[i],prior=old.species[route][i];assert.equal(sp.name,prior.name);
 const key=now.resolveEquipmentKey(r,sp);assert.equal(key,old.resolveEquipmentKey(r,prior));
 const a=now.generateKitByTier(key,tier,sp.slug),b=old.generateKitByTier(key,tier);
 const clean=arr=>plain(arr).map(x=>({...x,product:stripped(x.product)}));assert.deepEqual(clean(a),clean(b),sp.name+' '+r+' '+tier);
 assert.deepEqual(plain(now.calcBundlePriceRange(a)),plain(old.calcBundlePriceRange(b)));
 const html=now.renderStarterKitHtmlV2(key,{...sp,equipmentKey:key});
 assert.equal(html.includes('sk-home-conditions'),sp.slug==='home-hinge-back-tortoise');count++;
}
assert.equal(count,714);
const home=read('species/home-hinge-back-tortoise.html');
assert.ok(home.includes("slug: 'home-hinge-back-tortoise'"));
assert.ok(/var spV2 = \{[\s\S]*?slug:\s*sp.slug/.test(read('shindan/index.html')));
const jsons=[...home.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
const faq=jsons.flatMap(j=>j['@graph']||[j]).find(j=>j['@type']==='FAQPage');assert.ok(faq);
const visible=[...home.matchAll(/<div class="faq-body">([\s\S]*?)<\/div>/g)].map(m=>m[1].replace(/<[^>]*>/g,''));
assert.deepEqual(visible,faq.mainEntity.map(x=>x.acceptedAnswer.text));
assert.ok(!home.includes('夏場の高温は問題ない'));assert.ok(!home.includes('25℃以下）は危険'));
assert.equal(now.renderHomeEquipmentNote({slug:'russian-tortoise',name:'ロシアリクガメ'}),'');
assert.ok(now.renderHomeEquipmentNote({name:'ホームセオレガメ'}).includes('袋数'));
// Mount actual implementation with an inert DOM; capture GA in memory, no network.
function mountEvents(c,key){const events=[];const root={style:{},innerHTML:'',querySelectorAll(){return [];},querySelector(){return null;}};c.document={getElementById(){return root;}};c.gtag=(...args)=>events.push(plain(args));c.mountStarterKit({name:'ホームセオレガメ',slug:'home-hinge-back-tortoise',equipmentKey:key},'test',{sourcePage:'diagnosis'});return events;}
for(const key of ['tortoise_dry_small','tortoise_forest'])assert.deepEqual(mountEvents(now,key),mountEvents(old,key));
console.log('PASS: 119 species x native/all x 3 tiers (714), full product records except one why unchanged, Home note only, FAQ matched, actual mount GA unchanged, no exclusion.');
// Quick Facts: Home-only prose changes; all other species retain exact generated HTML.
vm.runInContext(base('js/quick-facts.js'),old);
vm.runInContext(read('js/quick-facts.js'),now);
let qfCount=0;
for(const [route,list] of Object.entries(now.species).filter(([r])=>r!=='all'))for(const sp of list)for(const r of [route,'all']){
 const opts={...sp,equipmentKey:now.resolveEquipmentKey(r,sp)};
 const before=old.renderQuickFacts(opts),after=now.renderQuickFacts(opts);
 const stickyBefore=old.renderStickyCTA(opts),stickyAfter=now.renderStickyCTA(opts);
 if(sp.name==='ホームセオレガメ'){
  assert.ok(after.includes('森林性リクガメ（湿った床・水場）'));
  assert.ok(after.includes('低価格帯の候補合計'));
  assert.ok(after.includes('床材・水場の清掃で変わる'));
  assert.ok(after.includes('用品の比較候補と選び方を見る'));
  assert.ok(!after.includes('この亀を今日から飼えるセット'));
  assert.ok(stickyAfter.includes('用品の比較候補と選び方を見る'));
  assert.equal(after.match(/<span class="qf-cost">([\s\S]*?)<\/span>/)?.[1],before.match(/<span class="qf-cost">([\s\S]*?)<\/span>/)?.[1]);
 }else{
  assert.equal(after,before,sp.name+' Quick Facts');
  assert.equal(stickyAfter,stickyBefore,sp.name+' sticky CTA');qfCount++;
 }
}
assert.equal(qfCount,236);
console.log('PASS: Quick Facts and sticky CTA exact equality for other 118 species x 2 routes; Home labels corrected with cost text unchanged.');
