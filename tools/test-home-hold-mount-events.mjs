import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const events=[];
const root={style:{},innerHTML:'',cards:[],querySelector(){return null;},querySelectorAll(selector){
 if(selector!=='.sk-bundle-card')return [];
 this.cards=[...this.innerHTML.matchAll(/<div class="sk-bundle-card [^>]+>/g)].map(([tag])=>{
  const dataset={};for(const [,key,value] of tag.matchAll(/data-([a-z-]+)="([^"]*)"/g))dataset[key.replace(/-([a-z])/g,(_,x)=>x.toUpperCase())]=value;
  const button={addEventListener(type,fn){this[type]=fn;}};
  return {dataset,button,querySelector(){return button;}};
 });return this.cards;
}};
const c=vm.createContext({console,URLSearchParams,window:{location:{hostname:'example.com',pathname:'/test',search:''}},document:{getElementById(){return root;}},gtag:(...args)=>events.push(args)});
vm.runInContext(read('data/products.js')+'\n'+read('js/starter-kit.js'),c);
const slug='home-hinge-back-tortoise';
for(const key of ['tortoise_dry_small','tortoise_forest'])for(const sourcePage of ['species','diagnosis']){
 events.length=0;
 c.mountStarterKit({name:'Home',slug,equipmentKey:key},'test',{sourcePage});
 const picks=['budget','standard','premium'].map(t=>c.generateKitByTier(key,t,slug));
 const expected=picks.map(p=>c.calcBundlePriceRange(p));
 const shown=events.find(x=>x[1]==='starter_kit_shown')[2];
 assert.equal(shown.card_count,picks[0].length);
 const view=events.filter(x=>x[1]==='bundle_view');assert.equal(view.length,1);
 for(const [i,t] of ['budget','standard','premium'].entries())assert.equal(view[0][2][t+'_price_low'],expected[i].low);
 assert.ok(!root.innerHTML.includes('data-product-id="substrate_grassland_mix"'));
 assert.equal(root.cards.length,3);
 root.cards.forEach((card,i)=>{
  assert.equal(Number(card.dataset.bundleCount),picks[i].length);
  assert.equal(Number(card.dataset.bundlePrice),expected[i].low);
  assert.equal(Number(card.dataset.bundlePriceHigh),expected[i].high);
  const start=events.length;card.button.click();const clicked=events.slice(start);
  for(const name of ['bundle_click','bundle_card_click']){
   const hit=clicked.find(x=>x[1]===name);assert.ok(hit,name);
   assert.equal(hit[2].estimated_price,expected[i].low);assert.equal(hit[2].product_count,picks[i].length);
  }
  assert.equal(clicked.find(x=>x[1]==='starter_kit_bundle_open')[2].bundle_item_count,picks[i].length);
 });
 if(key==='tortoise_dry_small'){assert.equal(picks[1].length,9);assert.equal(expected[1].low,28500);assert.equal(expected[1].high,58500);}
}
// Re-mounting another species must restore its unchanged candidate and remove the hold text.
c.mountStarterKit({name:'Russian',slug:'russian-tortoise',equipmentKey:'tortoise_dry_small'},'test');
assert.ok(root.innerHTML.includes('data-product-id="substrate_grassland_mix"'));
assert.ok(!root.innerHTML.includes('data-sk-held-category'));
console.log('PASS: mounted Home species/diagnosis, dry/forest routes; rendered bundle counts/prices match view and click events; remount clears hold. No network APIs provided.');
// Isolate the hold guard: make every candidate price known, so missing-price guards cannot mask it.
vm.runInContext('Object.values(PRODUCTS).forEach(function(p){if(!p.priceRange)p.priceRange="¥100–200";});',c);
const tabs=vm.runInContext('SK_TABS',c);
const makeTabs=held=>tabs.map(tab=>({tab,picks:c.generateKitByTier('tortoise_dry_small',tab.tiers[0],held?slug:undefined),held:held?c.getHeldKitItems('tortoise_dry_small',tab.tiers[0],slug):[]}));
const noHold=c.renderBundleSummary(makeTabs(false),'Control');
assert.ok(noHold.includes('sk-bundle-savings'),'positive control: complete-price bundles must display savings');
const held=c.renderBundleSummary(makeTabs(true),'Home');
assert.ok(!held.includes('sk-bundle-savings'),'hold must suppress savings even when all displayed prices are known');
console.log('PASS: complete-price synthetic control displays savings; same candidates with Home hold suppress savings.');
