import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url);
const read=p=>fs.readFileSync(new URL(p,root),'utf8');
const c=vm.createContext({window:{location:{hostname:'example.com'}},document:{},URLSearchParams,console});
vm.runInContext(read('data/products.js')+'\n'+read('js/starter-kit.js')+'\nthis.products=PRODUCTS;',c);
for(const [id,name] of [['uvb_t5_desert_std','Zoo Med ReptiSun 10.0 UVB T5'],['uvb_t5_forest_std','Zoo Med ReptiSun 5.0 UVB T5']]){
 const p=c.products[id];assert.equal(p.name,name);assert.equal(p.affiliateUrl,null);assert.equal(p.asin,null);assert.equal(p.rakutenStatus,'search');assert.match(p.rakutenSearchTerm,/Zoo Med ReptiSun/);
 const card=c.renderSkCard({cat:p.category,tier:'standard',product:p},'test','tortoise_forest');
 assert.match(card,/Amazonの掲載先を確認中/);assert.doesNotMatch(card,/は選定中/);assert.doesNotMatch(card,/data-provider="amazon"/);assert.match(card,/search.rakuten.co.jp/);assert.match(card,/Zoo Med ReptiSun/);
}
assert.equal(Object.values(c.products).filter(p=>p.amazonLinkStatus==='identity_review').length,2);
console.log('PASS: 2 intended T5 products preserved; wrong direct links absent; search and precise hold wording present');
