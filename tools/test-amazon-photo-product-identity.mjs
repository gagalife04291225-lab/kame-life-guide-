import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import rakutenIdentity from '../scripts/rakuten-identity.js';
import rakutenSync from '../scripts/update-rakuten.js';
const read=(p)=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const c=runInNewContext(read('data/products.js')+'\n;PRODUCTS');
const tag='kamelife090e-22';
const bowl=rakutenIdentity.deriveIdentity(c.waterdish_zoomed_ramp_bowl);
const bowlName=c.waterdish_zoomed_ramp_bowl.name.split(' LG')[0];
for(const candidate of [
 {itemName:bowlName+' XL RRB-12'},
 {itemName:bowlName+' XL RRB-12',catchcopy:'See also RRB-11 097612924114'},
 {itemName:bowlName+' LG',catchcopy:'See also RRB-11'},
 {itemName:bowlName+' LG RRB-110'},
 {itemName:bowlName+' LG RRB-11',modelNumber:'RRB-12'},
]){
 assert.equal(rakutenIdentity.matchIdentity(bowl,candidate).level,'REJECT',JSON.stringify(candidate));
}
for(const candidate of [
 {itemName:bowlName+' LG RRB-11',catchcopy:'See also XL RRB-12'},
 {itemName:bowlName+' LG',modelNumber:'RRB-11'},
 {itemName:bowlName+' LG',jan:'0097612924114'},
]){
 assert.equal(rakutenIdentity.matchIdentity(bowl,candidate).level,'EXACT',JSON.stringify(candidate));
}
for (const [id, itemCode, path, name, badTitle] of [
 ['waterdish_zoomed_ramp_bowl','chanet:10091840','/chanet/42102/','ZOOMED レプティランプボウル LG','ZOOMED レプティランプボウル LG XL RRB-12'],
 ['food_reptomin_super_large_260','chanet:11165662','/chanet/313682/','テトラ レプトミンスーパー 大粒 260g','テトラ レプトミンスーパー 大粒 260g×3'],
]){
 const p=c[id], identity=rakutenIdentity.deriveIdentity(p);
 const item={itemCode,itemUrl:'https://item.rakuten.co.jp'+path,itemName:name,itemPrice:2100};
 assert.equal(rakutenIdentity.matchIdentity(identity,item).level,'EXACT');
 assert.notEqual(rakutenSync.scoreCandidate(item,p),null);
 for(const invalid of [
  {...item,itemCode:'chanet:99999'},
  {...item,itemUrl:item.itemUrl.replace('item.rakuten.co.jp','item.rakuten.co.jp.invalid')},
  {...item,itemUrl:item.itemUrl+'another/'},
  {...item,itemName:badTitle}
 ]) {
  assert.equal(rakutenIdentity.reviewedOffer(id,invalid),false);
  assert.equal(rakutenSync.scoreCandidate(invalid,p),rakutenSync.scoreCandidate(invalid,{...p,id:'unreviewed'}));
 }
 assert.equal(rakutenSync.scoreCandidate({...item,itemPrice:1},p),null);
}
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
