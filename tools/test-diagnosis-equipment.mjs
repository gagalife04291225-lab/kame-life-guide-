import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const read = p => fs.readFileSync(new URL('../'+p,import.meta.url),'utf8').replace(/\r\n/g,'\n');
const html=read('shindan/index.html');
const extract = name => {const a=html.indexOf('function '+name+'(');assert.ok(a>=0);const b=html.indexOf('\n}\n',a);assert.ok(b>a);return html.slice(a,b+2);};
const c=vm.createContext({window:{location:{hostname:'example.com'}},document:{},URLSearchParams,console});
vm.runInContext(read('shindan/species.js')+'\n'+read('data/products.js')+'\n'+read('js/starter-kit.js')+'\n'+extract('resolveEquipmentKey')+';this.species=SPECIES;this.products=PRODUCTS;this.equipment=EQUIPMENT_MAP;',c);
let count=0;
const slugs=new Set();
for(const [route,species] of Object.entries(c.species).filter(([key])=>key!=='all'))for(const sp of species){
 if(sp.slug){assert.ok(!slugs.has(sp.slug),sp.slug);slugs.add(sp.slug);}
 assert.ok(c.equipment[c.resolveEquipmentKey(route,sp)],sp.name);
 assert.ok(c.renderStarterKitHtmlV2(c.resolveEquipmentKey(route,sp),{name:sp.name}).includes('比較候補'));
 count++;
}
assert.equal(count,119);
assert.equal(slugs.size,113);
for(const p of Object.values(c.products)){
 assert.ok(c.SK_CAT_LABELS_PAGE[p.category],p.category);
 const card=c.renderSkCard({cat:p.category,tier:'standard',product:p},'test','');
 if(!p.priceRange)assert.ok(card.includes('価格は販売先で確認'));
}
assert.ok(c.renderCostBox([{product:{priceRange:''}}],{}).includes('価格未掲載1点を除く'));
let cards=0;
for(const key of Object.keys(c.equipment))for(const tier of ['budget','standard','premium']){
 const picks=c.generateKitByTier(key,tier);
 for(const item of picks){
  assert.ok(c.SK_CAT_LABELS_PAGE[item.cat],item.cat);
  const card=c.renderSkCard(item,'test',key);
  assert.ok(!card.includes('>water_dish<'));
  if(item.cat==='enclosure')assert.ok(card.includes('製品の内寸'));
  cards++;
 }
 const rendered=c.renderStarterKitHtmlV2(key,{name:'test',equipmentKey:key});
 assert.ok(rendered.includes('そのまま一式そろえれば飼えるという意味ではありません'));
 assert.ok(!/必須セット|まずはここから|最もおすすめ/.test(rendered));
}
assert.ok(!html.includes('top3Tier'));
assert.ok(html.includes('最初に確認する用品'));
assert.ok(!html.includes('迷ったらこの'));
for(const p of Object.values(c.products).filter(p=>p.category==='enclosure'))assert.ok(!/成体になっても手狭にならない|小型種なら十分|大型リクガメ成体向け/.test(p.why));
console.log(`PASS: ${count} species comparison guidance; ${cards} product cards; all tier comparison guidance`);

for(const key of Object.keys(c.equipment))for(const tier of ['budget','standard','premium']){
 const heater=c.getTierProduct(key,'heating',tier);
 if(heater)assert.notEqual(heater.category,'temperature_control',key+' '+tier);
}
for(const key of ['tortoise_forest','box_turtle']){
 assert.equal(c.getTierProduct(key,'heating','premium').id,'heater_panel_45');
 const rendered=c.renderStarterKitHtmlV2(key,{name:'test'});
 assert.ok(rendered.includes('本体は発熱しません'));
 assert.ok(rendered.includes('メーカーがサーモスタットとの接続を推奨していません'));
 assert.ok(!c.generateKitByTier(key,'premium').some(x=>x.product.id==='thermostat_digital'));
}
for(const slug of ['tunisian-greek-tortoise','moroccan-greek-tortoise']){
 const sp=c.species.land.find(x=>x.slug===slug);
 assert.ok(sp.reason.includes('当サイトの目安で90〜120cm級'));
 assert.ok(!sp.reason.includes('60〜90cmケージで通せる'));
}
console.log('PASS: thermostat never substitutes for a heater; two site enclosure guidelines synchronized');

for(const p of Object.values(c.products)){
 if(p.id.startsWith('thermostat'))assert.equal(p.category,'temperature_control',p.id);
 if(p.name.includes('ピタリ適温プラス')){
  assert.ok(!p.why.includes('併用推奨'));
  assert.ok(p.why.includes('ケージ全体の空気を暖める器具ではありません'));
 }
}
