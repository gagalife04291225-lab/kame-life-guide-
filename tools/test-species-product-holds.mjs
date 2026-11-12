import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8').replace(/\r\n/g,'\n');
const html=read('shindan/index.html');
const a=html.indexOf('function resolveEquipmentKey('), b=html.indexOf('\n}\n',a);
const c=vm.createContext({window:{location:{hostname:'example.com'}},document:{},console});
vm.runInContext(read('shindan/species.js')+'\n'+read('data/products.js')+'\n'+read('js/starter-kit.js')+'\n'+html.slice(a,b+2)+';this.species=SPECIES;this.products=PRODUCTS;',c);
const plain=x=>JSON.parse(JSON.stringify(x));
let checked=0,changed=0;
for(const [route,list] of Object.entries(c.species).filter(([key])=>key!=='all'))for(const sp of list)for(const r of [route,'all'])for(const tier of ['budget','standard','premium']){
 const key=c.resolveEquipmentKey(r,sp),legacy=c.generateKitByTier(key,tier),actual=c.generateKitByTier(key,tier,sp.slug);
 const expected=legacy.filter(x=>!(sp.slug==='home-hinge-back-tortoise'&&x.product.id==='substrate_grassland_mix'));
 assert.deepEqual(plain(actual),plain(expected));
 if(actual.length!==legacy.length){changed++;assert.equal(sp.slug,'home-hinge-back-tortoise');assert.equal(tier,'standard');assert.equal(r,'all');}
 checked++;
}
assert.equal(checked,714);assert.equal(changed,1);
for(const slug of [undefined,'unknown-slug','russian-tortoise'])for(const tier of ['budget','standard','premium'])assert.deepEqual(plain(c.generateKitByTier('tortoise_dry_small',tier,slug)),plain(c.generateKitByTier('tortoise_dry_small',tier)));
const picks=c.generateKitByTier('tortoise_dry_small','standard','home-hinge-back-tortoise');
assert.equal(picks.length,9);assert.deepEqual(plain(c.calcBundlePriceRange(picks)),{low:28500,high:58500});
assert.ok(!picks.some(x=>x.cat==='substrate'),'No automatic substitute');
const homeHtml=c.renderStarterKitHtmlV2('tortoise_dry_small',{slug:'home-hinge-back-tortoise',name:'ホームセオレガメ'});
assert.ok(homeHtml.includes('床材代を含みません'));assert.ok(homeHtml.includes('床材の購入候補を選定していません'));
assert.ok(!homeHtml.includes(c.products.substrate_grassland_mix.affiliateUrl));
assert.ok(!homeHtml.includes(c.products.substrate_grassland_mix.rakutenUrl));
assert.ok(read('species/home-hinge-back-tortoise.html').includes("mountStarterKit({ slug: 'home-hinge-back-tortoise'"));
assert.ok(/var spV2 = \{\s*slug:\s*sp.slug/.test(html));
assert.ok(!homeHtml.includes('必要商品をすべて確認'));
console.log('PASS 119 species × 2 routes × 3 tiers = 714; only Home/all/standard changed; no fallback; prices/links/missing category correct');
