import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8').replace(/\r\n/g,'\n');
const html=read('shindan/index.html');
function extract(name){const a=html.indexOf('function '+name+'('),b=html.indexOf('\n}\n',a);assert.ok(a>=0&&b>a);return html.slice(a,b+2);}
const section={style:{}},slot={innerHTML:''};let mounts=0;
const c=vm.createContext({console,window:{},document:{getElementById(id){return id==='species-equipment-conditions'?slot:id==='starter-kit-section'?section:null;}},LIFESPAN_DATA:{},selectedRoute:{id:'all'},mountStarterKit(){mounts++;}});
vm.runInContext(read('shindan/species.js')+'\n'+extract('resolveEquipmentKey')+'\n'+extract('renderSpeciesEquipmentConditions')+'\n'+extract('updateSpeciesEquipmentConditions')+'\n'+extract('renderStarterKitV2')+';this.species=SPECIES;this.conditions=DIAGNOSIS_EQUIPMENT_CONDITIONS;',c);
assert.equal(Object.keys(c.conditions).length,119);
let targeted=0,others=0;
for(const [route,list] of Object.entries(c.species).filter(([key])=>key!=='all'))for(const sp of list){
 for(const r of [route,'all']){
  c.selectedRoute={id:r}; c.updateSpeciesEquipmentConditions(sp);c.renderStarterKitV2(sp);
  if(c.conditions[sp.slug || sp.name] && sp.commerceAllowed !== false && sp.availability !== 'reference_only'){
   targeted++;assert.ok(slot.innerHTML.includes('用品を選ぶ前に'));assert.ok(!slot.innerHTML.includes('undefined'));
   assert.equal((slot.innerHTML.match(/<li>/g)||[]).length,c.conditions[sp.slug || sp.name].items.length+c.conditions[sp.slug || sp.name].sources.length);
   assert.ok(c.conditions[sp.slug || sp.name].items.length >= 2);
   assert.ok(!/13〜15cm|0\.5〜1\.5|1\.005/.test(slot.innerHTML));
   assert.ok(c.conditions[sp.slug || sp.name].sources.every(x=>x.url.startsWith('https://')));
  }else{others++;assert.equal(slot.innerHTML,'',sp.name);}
 }
}
assert.equal(targeted+others,238);assert.ok(targeted>=200);assert.equal(mounts,238);
// Known → unrelated → known clears and restores the same slot.
for(const slug of ['west-african-mud-turtle','missing-slug','northern-diamondback-terrapin']){
 const sp=c.species.all.find(x=>x.slug===slug)||{slug};c.updateSpeciesEquipmentConditions(sp);c.renderStarterKitV2(sp);
 assert.equal(!!slot.innerHTML,slug!=='missing-slug');
}
assert.ok(html.indexOf('id="species-equipment-conditions"')<html.indexOf('id="starter-kit-section"'));
assert.equal((html.match(/id="species-equipment-conditions"/g)||[]).length,1);
console.log('PASS: all 119 species conditions; name fallback plus reference-only suppression; slot reset and 238 kit renders');

for(const ref of [{commerceAllowed:false},{availability:'reference_only'}]){
 c.updateSpeciesEquipmentConditions(c.species.all.find(x=>x.slug==='west-african-mud-turtle'));
 assert.ok(slot.innerHTML);
 c.updateSpeciesEquipmentConditions({...ref,slug:'west-african-mud-turtle'});
 assert.equal(slot.innerHTML,'');
}
assert.ok(extract('showResult').startsWith('function showResult(sp, pct, runners) {\n  updateSpeciesEquipmentConditions(sp);'));
console.log('PASS: reference-only transitions clear equipment conditions at showResult entry');

for (const slug of ['matamata','amazon-matamata']) {
 assert.ok(c.conditions[slug].items.join('').includes('鼻先を水面'));
 assert.ok(c.conditions[slug].items.join('').includes('その水位'));
}
assert.ok(c.conditions['pig-nosed-turtle'].note.includes('終生'));
assert.ok(!html.includes('TEASER_CATS'));
assert.ok(!html.includes('ROUTE_COST_FALLBACK'));
assert.ok(html.includes('用品ごとの価格と候補合計は、上の一覧'));
assert.ok(read('js/starter-kit.js').includes('飼育開始にかかる総額ではありません'));

assert.ok(c.conditions['home-hinge-back-tortoise'].items.join('').includes('湿り気'));

// Execute the actual CTA event block, rather than allowing its catch to hide missing variables.
const eventStart=html.indexOf('    // GA4: diagnosis_cta_view');
const eventEnd=html.indexOf('  })();',eventStart);
const events=[];
const ec=vm.createContext({ga4Event:(name,payload)=>events.push({name,payload}),sp:{name:'test',slug:'test'},_lastCandidateCount:3,equipKey:'semi_aquatic_small',top3Count:3});
vm.runInContext(html.slice(eventStart,eventEnd),ec);
assert.equal(events.length,1);assert.equal(events[0].name,'diagnosis_cta_view');
assert.equal(events[0].payload.has_teaser,false);
assert.equal(events[0].payload.init_cost,'');assert.equal(events[0].payload.monthly_cost,'');
assert.equal(events[0].payload.top3_tier,'requirements');
console.log('PASS: CTA impression event emits after fee teaser removal');

assert.ok(html.includes('用品を買う前に、成体に必要な広さと設置場所'));
assert.ok(!html.includes('\\u521D\\u6708'));
