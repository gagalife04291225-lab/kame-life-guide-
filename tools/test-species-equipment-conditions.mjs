import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8').replace(/\r\n/g,'\n');
const html=read('shindan/index.html');
function extract(name){const a=html.indexOf('function '+name+'('),b=html.indexOf('\n}\n',a);assert.ok(a>=0&&b>a);return html.slice(a,b+2);}
const section={style:{}},slot={innerHTML:''};let mounts=0;
const c=vm.createContext({console,window:{},document:{getElementById(id){return id==='species-equipment-conditions'?slot:id==='starter-kit-section'?section:null;}},LIFESPAN_DATA:{},selectedRoute:{id:'all'},mountStarterKit(){mounts++;}});
vm.runInContext(read('shindan/species.js')+'\n'+extract('resolveEquipmentKey')+'\n'+extract('renderSpeciesEquipmentConditions')+'\n'+extract('updateSpeciesEquipmentConditions')+'\n'+extract('renderStarterKitV2')+';this.species=SPECIES;this.conditions=DIAGNOSIS_EQUIPMENT_CONDITIONS;',c);
assert.equal(Object.keys(c.conditions).length,7);
let targeted=0,others=0;
for(const [route,list] of Object.entries(c.species).filter(([key])=>key!=='all'))for(const sp of list){
 for(const r of [route,'all']){
  c.selectedRoute={id:r}; c.updateSpeciesEquipmentConditions(sp);c.renderStarterKitV2(sp);
  if(c.conditions[sp.slug]){
   targeted++;assert.ok(slot.innerHTML.includes('用品を選ぶ前に'));
   assert.equal((slot.innerHTML.match(/<li>/g)||[]).length,4+c.conditions[sp.slug].sources.length);
   assert.ok(slot.innerHTML.includes('陸場'));
   assert.ok(!/13〜15cm|0\.5〜1\.5|1\.005/.test(slot.innerHTML));
   assert.ok(c.conditions[sp.slug].sources.every(x=>x.url.startsWith('https://')));
  }else{others++;assert.equal(slot.innerHTML,'',sp.name);}
 }
}
assert.equal(targeted,14);assert.equal(others,224);assert.equal(mounts,238);
// Known → unrelated → known clears and restores the same slot.
for(const slug of ['west-african-mud-turtle','russian-tortoise','northern-diamondback-terrapin']){
 const sp=c.species.all.find(x=>x.slug===slug);c.updateSpeciesEquipmentConditions(sp);c.renderStarterKitV2(sp);
 assert.equal(!!slot.innerHTML,slug!=='russian-tortoise');
}
assert.ok(html.indexOf('id="species-equipment-conditions"')<html.indexOf('id="starter-kit-section"'));
assert.equal((html.match(/id="species-equipment-conditions"/g)||[]).length,1);
console.log('PASS: all 7 species on native/all routes; 112 other species unchanged; slot reset and 238 kit renders');

for(const ref of [{commerceAllowed:false},{availability:'reference_only'}]){
 c.updateSpeciesEquipmentConditions(c.species.all.find(x=>x.slug==='west-african-mud-turtle'));
 assert.ok(slot.innerHTML);
 c.updateSpeciesEquipmentConditions({...ref,slug:'west-african-mud-turtle'});
 assert.equal(slot.innerHTML,'');
}
assert.ok(extract('showResult').startsWith('function showResult(sp, pct, runners) {\n  updateSpeciesEquipmentConditions(sp);'));
console.log('PASS: reference-only transitions clear equipment conditions at showResult entry');
