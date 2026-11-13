import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8').replace(/\r\n/g,'\n');
const base=p=>execFileSync('git',['-C',root,'show','fde885bd:'+p],{encoding:'utf8'}).replace(/\r\n/g,'\n');
function ctx(rd){const h=rd('shindan/index.html'),a=h.indexOf('function resolveEquipmentKey('),b=h.indexOf('\n}',a),c=vm.createContext({window:{},document:{},console});vm.runInContext(rd('data/products.js')+'\n'+rd('js/starter-kit.js')+'\n'+rd('shindan/species.js')+'\n'+h.slice(a,b+2)+';this.species=SPECIES;',c);return c;}
const old=ctx(base),now=ctx(read),plain=x=>JSON.parse(JSON.stringify(x));
const signature=items=>plain(items).map(x=>({cat:x.cat,tier:x.tier,id:x.product.id,price:x.product.priceRange}));
let count=0,tiers=0;const changes=[];
for(const[route,list]of Object.entries(now.species).filter(([r])=>r!=='all'))for(let i=0;i<list.length;i++){
 const sp=list[i],original=old.species[route][i],normal=now.resolveEquipmentKey(route,sp),all=now.resolveEquipmentKey('all',sp);
 assert.equal(normal,old.resolveEquipmentKey(route,original),'native key '+sp.slug);
 assert.equal(all,normal,'all/native key '+sp.slug);
 assert.ok(now.species.all.includes(sp),'all getter preserves object identity');
 const oldAll=old.resolveEquipmentKey('all',original);
 if(oldAll!==all)changes.push({route,slug:sp.slug,from:oldAll,to:all});
 for(const tier of['budget','standard','premium']){
  const a=now.generateKitByTier(normal,tier),b=now.generateKitByTier(all,tier),before=old.generateKitByTier(normal,tier);
  assert.deepEqual(plain(a),plain(b),'all candidate order/content '+sp.slug);
  assert.deepEqual(signature(a),signature(before),'native candidate order/price '+sp.slug);
  assert.equal(a.length,b.length);
  assert.deepEqual(plain(now.calcBundlePriceRange(a)),plain(now.calcBundlePriceRange(b)));
  assert.deepEqual(plain(now.calcBundlePriceRange(a)),plain(old.calcBundlePriceRange(before)));
  tiers++;
 }count++;
}
assert.equal(count,119);assert.equal(tiers,357);assert.equal(changes.length,46);
// Unknown objects retain legacy fallback, including when no source route exists.
for(const sp of[{name:'unknown'}, {name:'unknown',size:'XL'}, {name:'unknown',extraSpecs:{tankSize:'x'}}])assert.equal(now.resolveEquipmentKey('all',sp),old.resolveEquipmentKey('all',sp));
// This fix does not alter reference-only commerce suppression.
const guards=h=>h.split('\n').filter(l=>/refOnly/.test(l));
assert.deepEqual(guards(read('shindan/index.html')),guards(base('shindan/index.html')));
assert.ok(read('shindan/index.html').includes('if (!refOnly) { try { renderStarterKitV2(sp);'));
assert.throws(()=>{for(const[r,arr]of Object.entries(old.species).filter(([r])=>r!=='all'))for(const sp of arr)assert.equal(old.resolveEquipmentKey('all',sp),old.resolveEquipmentKey(r,sp));},{name:'AssertionError'});
console.log('PASS:119 native keys unchanged;357 native tier selections/order/prices unchanged;all matches native;46 all-route corrections;reference-only suppression unchanged;old code fails.');
console.log(JSON.stringify(changes));
