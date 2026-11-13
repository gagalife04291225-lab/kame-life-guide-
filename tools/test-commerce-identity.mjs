import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url);
const read=p=>fs.readFileSync(new URL(p,root),'utf8');
const c=vm.createContext({window:{location:{hostname:'example.com'}},document:{},URLSearchParams,console});
vm.runInContext(read('data/products.js')+'\n'+read('js/starter-kit.js')+'\nthis.products=PRODUCTS;',c);
for(const [id,asin,model] of [['uvb_t5_desert_std','B00AQU8HAO','OS5-24'],['uvb_t5_forest_std','B00AQU8GF0','FS5-24']]){
 const p=c.products[id];assert.match(p.name,/24W 交換管/);assert.ok(p.name.includes(model));assert.equal(p.asin,asin);assert.equal(p.affiliateUrl,`https://www.amazon.co.jp/dp/${asin}?tag=kamelife090e-22`);assert.equal(p.amazonLinkStatus,'verified');
 const card=c.renderSkCard({cat:p.category,tier:'standard',product:p},'test','tortoise_forest');
 assert.doesNotMatch(card,/掲載先を確認中/);assert.match(card,/data-provider="amazon"/);assert.match(card,/search.rakuten.co.jp/);assert.ok(card.includes(asin));
}
const article=read('uvb-light-best10.html');assert.doesNotMatch(article,/掲載先を確認中/);assert.match(article,/data-asin="B00AQU8GF0"/);assert.match(article,/PT2340/);assert.match(article,/購入候補には含めていません/);
assert.equal(Object.values(c.products).filter(p=>p.amazonLinkStatus==='identity_review').length,0);
console.log('PASS: exact T5 24W replacement tubes verified; UVB200 is reference-only; no pending identities');
