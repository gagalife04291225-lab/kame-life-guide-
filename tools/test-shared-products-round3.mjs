import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url)),read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8').replace(/\r\n/g,'\n'),base=p=>execFileSync('git',['-C',root,'show','fde885bd:'+p],{encoding:'utf8'}).replace(/\r\n/g,'\n');
function ctx(rd){const h=rd('shindan/index.html'),a=h.indexOf('function resolveEquipmentKey('),b=h.indexOf('\n}',a),c=vm.createContext({window:{},document:{},console});vm.runInContext(rd('data/products.js')+'\n'+rd('js/starter-kit.js')+'\n'+rd('shindan/species.js')+'\n'+h.slice(a,b+2)+';this.products=PRODUCTS;this.species=SPECIES;',c);return c;}
const old=ctx(base),now=ctx(read),plain=x=>JSON.parse(JSON.stringify(x)),whyIds=['food_tortoise_gel','supplement_multivitamin'];
assert.deepEqual(Object.keys(now.products),Object.keys(old.products));
for(const[id,p]of Object.entries(now.products)){const a=plain(p),b=plain(old.products[id]);if(whyIds.includes(id)){delete a.why;delete b.why;}assert.deepEqual(a,b,id);}
assert.ok(now.products.food_tortoise_gel.why.includes('熱湯'));assert.ok(now.products.food_tortoise_gel.why.includes('時々のおやつ'));assert.ok(!/療養|偏食/.test(now.products.food_tortoise_gel.why));assert.ok(!/週1|人工飼料のみ/.test(now.products.supplement_multivitamin.why));
const clean=a=>plain(a).map(x=>{if(whyIds.includes(x.product.id))delete x.product.why;return x;});
let n=0;const impacts={};
for(const[r,list]of Object.entries(now.species).filter(([r])=>r!=='all'))for(let i=0;i<list.length;i++)for(const route of[r,'all'])for(const tier of['budget','standard','premium']){
 const sp=list[i],key=now.resolveEquipmentKey(route,sp);assert.equal(key,old.resolveEquipmentKey(r,old.species[r][i])); // all now intentionally follows native route
const a=now.generateKitByTier(key,tier),b=old.generateKitByTier(key,tier);assert.deepEqual(clean(a),clean(b));assert.deepEqual(plain(now.calcBundlePriceRange(a)),plain(old.calcBundlePriceRange(b)));
 for(const item of a){const after=now.getCvrBadge(item,key),before=old.getCvrBadge(item,key);if(item.cat==='lighting_uvb')assert.equal(after.label,'照射条件を確認');else if(item.cat==='lighting_basking')assert.equal(after.label,'照射先の温度を確認');else assert.deepEqual(plain(after),plain(before));
  if(whyIds.includes(item.product.id)||['lighting_uvb','lighting_basking'].includes(item.cat)){let id=whyIds.includes(item.product.id)?item.product.id:item.cat;impacts[id]??={native:new Set(),all:new Set(),slots:0};impacts[id][route==='all'?'all':'native'].add(sp.name);impacts[id].slots++;}
 }n++;
}assert.equal(n,714);
// Every unchanged-category/card is byte-identical; affected cards change only prose/badge.
for(const[id,p]of Object.entries(now.products)){
 for(const tier of['budget','standard','premium']){const item={cat:p.category,tier,product:p};if(!whyIds.includes(id)&&!['lighting_uvb','lighting_basking'].includes(p.category))assert.equal(now.renderSkCard(item,'test','tortoise_forest'),old.renderSkCard({...item,product:old.products[id]},'test','tortoise_forest'));}
}
for(const cat of['lighting_uvb','lighting_basking'])assert.throws(()=>assert.equal(old.getCvrBadge({cat,tier:'budget'},'tortoise_forest').label,now.getCvrBadge({cat,tier:'budget'},'tortoise_forest').label),{name:'AssertionError'});
assert.throws(()=>assert.ok(!/療養|偏食/.test(old.products.food_tortoise_gel.why)),{name:'AssertionError'});assert.throws(()=>assert.ok(!/週1/.test(old.products.supplement_multivitamin.why)),{name:'AssertionError'});
for(const [id,v]of Object.entries(impacts))console.log(id,JSON.stringify({native:v.native.size,all:v.all.size,slots:v.slots}));
console.log('PASS:714 selections match native-route baseline (all-route correction intentional); only two product why fields changed; only UVB/basking badges changed; all unrelated cards unchanged; old code fails corrected prose/badge assertions.');
