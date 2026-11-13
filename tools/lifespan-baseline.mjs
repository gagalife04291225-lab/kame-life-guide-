// Narrow exception for the one hundred eleven sourced lifespan edits on 2026-11-13.
// Keep original legal/care baselines intact; assert the approved values before normalization.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const fixtures=JSON.parse(fs.readFileSync(new URL('./lifespan-fixtures.json',import.meta.url),'utf8'));
export const addedLifespanSlugs=['reeves-turtle','red-eared-slider','sulcata-tortoise','red-footed-tortoise','greek-tortoise','eastern-box-turtle','malayan-box-turtle','elongated-tortoise','home-hinge-back-tortoise','leopard-tortoise','spotted-turtle','west-african-mud-turtle','western-painted-turtle','eastern-painted-turtle','northern-diamondback-terrapin','pancake-tortoise','name:インドホシガメ','aldabra-tortoise','wood-turtle','european-pond-turtle','pig-nosed-turtle','yellow-mud-turtle','african-helmeted-turtle','matamata','marginated-tortoise','impressed-tortoise','name:ビルマホシガメ','name:エジプトリクガメ','blandings-turtle','northern-map-turtle','mississippi-map-turtle','florida-softshell-turtle','chinese-softshell-turtle','pink-bellied-side-necked-turtle','chaco-tortoise','bell-hinge-back-tortoise','bowsprit-tortoise','name:マダガスカルクモノスガメ','mississippi-mud-turtle','striped-mud-turtle','spiny-softshell-turtle','smooth-softshell-turtle','eastern-long-necked-turtle','siebenrocks-snake-necked-turtle','hilaire-side-necked-turtle','scorpion-mud-turtle','red-cheeked-mud-turtle','mexican-mud-turtle','herrera-mud-turtle','narrow-bridged-mud-turtle','loggerhead-musk-turtle','stripe-necked-musk-turtle','eastern-mud-turtle','florida-mud-turtle','false-map-turtle','ouachita-map-turtle-sp','ringed-map-turtle','black-knobbed-map-turtle','hirase-turtle','obsti-hirase-turtle','indochinese-box-turtle','three-striped-box-turtle','taiwan-box-turtle','chinese-box-turtle','painted-wood-turtle','brown-wood-turtle-manni','nicaragua-wood-turtle','sonora-wood-turtle','guerrero-wood-turtle','annulated-wood-turtle','yellow-pond-turtle','yaeyama-pond-turtle','canton-reeves-turtle','chinese-stripe-necked-turtle','asian-black-marsh-turtle','asian-leaf-turtle','iberian-greek-tortoise','tunisian-greek-tortoise','moroccan-greek-tortoise','libyan-greek-tortoise','golden-greek-tortoise','cherry-head-tortoise','eastern-hermann-tortoise','western-hermann-tortoise','peninsula-cooter','suwannee-cooter','river-cooter','rio-grande-cooter','florida-red-bellied-turtle','yellow-bellied-slider','cumberland-slider','carolina-diamondback-terrapin','mississippi-diamondback-terrapin','ornate-diamondback-terrapin','mangrove-diamondback-terrapin','albino-chinese-softshell','amazon-matamata','texas-diamondback-terrapin','three-toed-box-turtle','gulf-coast-box-turtle','ornate-box-turtle','desert-box-turtle','alabama-map-turtle','name:ヒラタニオイガメ','name:テキサスチズガメ','painted-turtle','midland-painted-turtle','giant-musk-turtle-mx','giant-musk-turtle','mccords-snake-necked-turtle','collier-snake-necked-turtle'];
export function normalizeSourcedLifespan(before,after){
 const key=after.slug||'name:'+after.name;
 if(!addedLifespanSlugs.includes(key)){
  if(['musk-turtle','razorback-musk-turtle','white-lipped-mud-turtle','florida-box-turtle','japanese-pond-turtle','spenglers-leaf-turtle','russian-tortoise','hermann-tortoise'].includes(key)){
   const [value,note,url,source]=fixtures[key];
   assert.equal(after.coreSpecs.lifespan,value);
   assert.deepEqual(JSON.parse(JSON.stringify(after.lifespanEvidence)),{note,url,source});
   assert.equal(before.lifespanEvidence.url,url);
   assert.equal(before.lifespanEvidence.source,source);
   before.lifespanEvidence={...before.lifespanEvidence,note};
  }
  return;
 }
 const [value,note,url,source]=fixtures[key];
 assert.equal(after.coreSpecs.lifespan,value,after.slug+' sourced lifespan');
 assert.deepEqual(JSON.parse(JSON.stringify(after.lifespanEvidence)),{note,url,source},after.slug+' exact evidence');
 if(key==='florida-mud-turtle'){
  assert.equal(after.reason,before.reason.replace('ミシシッピドロガメの南部亜種。','フロリダに分布する独立種。以前はトウブドロガメの亜種として扱われていました。'));
  before.reason=after.reason;
 }
 before.coreSpecs={...before.coreSpecs,lifespan:value};
 delete before.lifespanEvidence;
 delete after.lifespanEvidence;
}
