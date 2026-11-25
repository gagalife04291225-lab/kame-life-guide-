import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const read=(p)=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const c=runInNewContext(read('data/products.js')+'\n;PRODUCTS');
const tag='kamelife090e-22';
for(const [id,asin] of [
 ['uvb_compact','B088X2HCGG'],
 ['waterdish_zoomed_ramp_bowl','B00BUFVR56'],
 ['food_reptomin_super_large_260','B0F31XT1KJ'],
 ['thermometer_wifi','B0BZVLB6R4']
]){
 assert.equal(c[id].asin,asin);
 const url=new URL(c[id].affiliateUrl);
 assert.equal(url.origin,'https://www.amazon.co.jp');
 assert.equal(url.pathname,'/dp/'+asin);
 assert.deepEqual(url.searchParams.getAll('tag'),[tag]);
}
function card(file,id){
 const entries=read(file).split('<div class="item">').filter(s=>s.includes('data-asin="'+id+'"'));
 assert.equal(entries.length,1,id);
 return entries[0];
}
assert.match(card('uvb-light-best10.html','B088X2HCGG'),/26W[\s\S]*Amazonで在庫を見る/);
assert.match(card('cage-best10.html','B00BF91SQK'),/PT2604/);
assert.match(card('food-best10.html','B00BR05SFO'),/沈下性\s*小ペレット\s*120g/);
const food=card('food-best10.html','B0F31XT1KJ');
assert.match(food,/レプトミンスーパー 大粒 260g/);
assert.doesNotMatch(food,/280g/);
const plus=c.thermometer_wifi;
assert.match(plus.name,/IBS-TH3 PLUS$/);
assert.match(plus.rakutenSearchTerm,/IBS-TH3 PLUS$/);
assert.equal(plus.rakutenStatus,'search');
assert.equal(plus.rakutenIdentityHold,true);
for(const key of ['rakutenUrl','rakutenItemCode','rakutenPrice','rakutenShop','rakutenImageUrl'])assert.equal(plus[key],null);
console.log('Exact product replacements and wrong-model retail image safeguards PASS');
