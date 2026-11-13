/** Lifespan records must not be presented as average/maximum lifespan. */
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = process.env.LIFESPAN_TEST_ROOT || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixtures = JSON.parse(fs.readFileSync(new URL('./lifespan-fixtures.json', import.meta.url)));
const read = p => fs.readFileSync(path.join(root,p),'utf8');
const ctx = {console, document: {addEventListener(){},getElementById(){return null;}}};ctx.window=ctx;vm.createContext(ctx);
vm.runInContext(read('shindan/species.js')+';this.species=SPECIES.all;',ctx);
vm.runInContext(read('js/annainin.js'),ctx);
let checks=0;const check=(v,msg)=>{assert.ok(v,msg);checks++;};
for(const [slug,[value,note,url]] of Object.entries(fixtures)){
 const sp=ctx.species.find(s=>slug.startsWith('name:') ? s.name===slug.slice(5) : s.slug===slug);check(sp,slug);
 check(sp.coreSpecs.lifespan===value,slug+' core');
 check(sp.lifespanEvidence.note===note,slug+' evidence');
 check(sp.lifespanEvidence.url===url,slug+' URL');
 if(['name:インドホシガメ','name:ビルマホシガメ','name:エジプトリクガメ','name:マダガスカルクモノスガメ','name:ヒラタニオイガメ','name:テキサスチズガメ'].includes(slug)){check(!sp.hasPage&&sp.slug===null,slug+' remains reference-only with no invented species page');continue;}
 const html=read('species/'+slug+'.html');
 const oldRanges={'painted-turtle':/25[〜～]40年|20[〜～]30年|20[〜～]40年|15[〜～]30年/,'midland-painted-turtle':/25[〜～]40年|20[〜～]30年|20[〜～]40年|15[〜～]30年/,'giant-musk-turtle-mx':/25[〜～]40年|20[〜～]30年|20[〜～]40年|15[〜～]30年/,'giant-musk-turtle':/25[〜～]40年|20[〜～]30年|20[〜～]40年|15[〜～]30年/,'mccords-snake-necked-turtle':/25[〜～]40年|20[〜～]30年|20[〜～]40年|15[〜～]30年/,'collier-snake-necked-turtle':/25[〜～]40年|20[〜～]30年|20[〜～]40年|15[〜～]30年/,'three-toed-box-turtle':/40[〜～]50年|20[〜～]40年|30[〜～]50年|20[〜～]50年|15[〜～]25年/,'gulf-coast-box-turtle':/40[〜～]50年|20[〜～]40年|30[〜～]50年|20[〜～]50年|15[〜～]25年/,'ornate-box-turtle':/40[〜～]50年|20[〜～]40年|30[〜～]50年|20[〜～]50年|15[〜～]25年/,'desert-box-turtle':/40[〜～]50年|20[〜～]40年|30[〜～]50年|20[〜～]50年|15[〜～]25年/,'alabama-map-turtle':/40[〜～]50年|20[〜～]40年|30[〜～]50年|20[〜～]50年|15[〜～]25年/,'carolina-diamondback-terrapin':/20[〜～]40年/,'mississippi-diamondback-terrapin':/20[〜～]40年/,'ornate-diamondback-terrapin':/20[〜～]40年/,'mangrove-diamondback-terrapin':/20[〜～]40年/,'albino-chinese-softshell':/20[〜～]40年/,'amazon-matamata':/20[〜～]40年/,'texas-diamondback-terrapin':/20[〜～]40年/,'eastern-hermann-tortoise':/50[〜～]80年|20[〜～]40年|20[〜～]30年|15[〜～]30年|25[〜～]40年/,'western-hermann-tortoise':/50[〜～]80年|20[〜～]40年|20[〜～]30年|15[〜～]30年|25[〜～]40年/,'peninsula-cooter':/50[〜～]80年|20[〜～]40年|20[〜～]30年|15[〜～]30年|25[〜～]40年/,'suwannee-cooter':/50[〜～]80年|20[〜～]40年|20[〜～]30年|15[〜～]30年|25[〜～]40年/,'river-cooter':/50[〜～]80年|20[〜～]40年|20[〜～]30年|15[〜～]30年|25[〜～]40年/,'rio-grande-cooter':/50[〜～]80年|20[〜～]40年|20[〜～]30年|15[〜～]30年|25[〜～]40年/,'florida-red-bellied-turtle':/50[〜～]80年|20[〜～]40年|20[〜～]30年|15[〜～]30年|25[〜～]40年/,'yellow-bellied-slider':/50[〜～]80年|20[〜～]40年|20[〜～]30年|15[〜～]30年|25[〜～]40年/,'cumberland-slider':/50[〜～]80年|20[〜～]40年|20[〜～]30年|15[〜～]30年|25[〜～]40年/,'iberian-greek-tortoise':/50[〜～]80年|30[〜～]50年/,'tunisian-greek-tortoise':/50[〜～]80年|30[〜～]50年/,'moroccan-greek-tortoise':/50[〜～]80年|30[〜～]50年/,'libyan-greek-tortoise':/50[〜～]80年|30[〜～]50年/,'golden-greek-tortoise':/50[〜～]80年|30[〜～]50年/,'cherry-head-tortoise':/50[〜～]80年|30[〜～]50年/,'yellow-pond-turtle':/20[〜～]40年|20[〜～]30年|15[〜～]30年|25[〜～]40年/,'yaeyama-pond-turtle':/20[〜～]40年|20[〜～]30年|15[〜～]30年|25[〜～]40年/,'canton-reeves-turtle':/20[〜～]40年|20[〜～]30年|15[〜～]30年|25[〜～]40年/,'chinese-stripe-necked-turtle':/20[〜～]40年|20[〜～]30年|15[〜～]30年|25[〜～]40年/,'asian-black-marsh-turtle':/20[〜～]40年|20[〜～]30年|15[〜～]30年|25[〜～]40年/,'asian-leaf-turtle':/20[〜～]40年|20[〜～]30年|15[〜～]30年|25[〜～]40年/,'painted-wood-turtle':/20[〜～]40年|20[〜～]50年/,'brown-wood-turtle-manni':/20[〜～]40年|20[〜～]50年/,'nicaragua-wood-turtle':/20[〜～]40年|20[〜～]50年/,'sonora-wood-turtle':/20[〜～]40年|20[〜～]50年/,'guerrero-wood-turtle':/20[〜～]40年|20[〜～]50年/,'annulated-wood-turtle':/20[〜～]40年|20[〜～]50年/,'hirase-turtle':/20[〜～]40年|20[〜～]50年|30[〜～]50年/,'obsti-hirase-turtle':/20[〜～]40年|20[〜～]50年|30[〜～]50年/,'indochinese-box-turtle':/20[〜～]40年|20[〜～]50年|30[〜～]50年/,'three-striped-box-turtle':/20[〜～]40年|20[〜～]50年|30[〜～]50年/,'taiwan-box-turtle':/20[〜～]40年|20[〜～]50年|30[〜～]50年/,'chinese-box-turtle':/20[〜～]40年|20[〜～]50年|30[〜～]50年/,'eastern-mud-turtle':/20[〜～]30年/,'florida-mud-turtle':/20[〜～]30年/,'false-map-turtle':/20[〜～]30年|15[〜～]30年/,'ouachita-map-turtle-sp':/20[〜～]40年|15[〜～]25年/,'ringed-map-turtle':/20[〜～]40年|15[〜～]30年/,'black-knobbed-map-turtle':/20[〜～]40年|15[〜～]30年/,'red-cheeked-mud-turtle':/20[〜～]30年|15[〜～]30年/,'mexican-mud-turtle':/20[〜～]30年|15[〜～]30年/,'herrera-mud-turtle':/20[〜～]30年|15[〜～]30年/,'narrow-bridged-mud-turtle':/20[〜～]30年/,'loggerhead-musk-turtle':/20[〜～]30年/,'stripe-necked-musk-turtle':/20[〜～]30年|15[〜～]30年/,'spiny-softshell-turtle':/20[〜～]50年|20[〜～]40年/,'smooth-softshell-turtle':/20[〜～]50年|20[〜～]40年/,'eastern-long-necked-turtle':/20[〜～]40年/,'siebenrocks-snake-necked-turtle':/20[〜～]40年/,'hilaire-side-necked-turtle':/20[〜～]40年/,'scorpion-mud-turtle':/20[〜～]40年/,'chaco-tortoise':/50[〜～]80年|30[〜～]80年/,'bell-hinge-back-tortoise':/30[〜～]50年|30[〜～]80年/,'bowsprit-tortoise':/30[〜～]60年|20[〜～]40年/,'mississippi-mud-turtle':/20[〜～]30年|15[〜～]30年/,'striped-mud-turtle':/20[〜～]40年|15[〜～]30年/,'blandings-turtle':/70[〜～]80年|15[〜～]30年/,'northern-map-turtle':/20[〜～]40年|15[〜～]25年/,'mississippi-map-turtle':/20[〜～]30年|15[〜～]30年/,'florida-softshell-turtle':/20[〜～]50年|20[〜～]40年/,'chinese-softshell-turtle':/20[〜～]40年/,'pink-bellied-side-necked-turtle':/20[〜～]30年|15[〜～]30年/,'marginated-tortoise':/50[〜～]100年|30[〜～]80年/,'impressed-tortoise':/30[〜～]50年|30[〜～]80年/,'wood-turtle':/40[〜～]60年|20[〜～]50年/,'european-pond-turtle':/30[〜～]60年|15[〜～]30年/,'pig-nosed-turtle':/20[〜～]40年/,'yellow-mud-turtle':/20[〜～]40年|15[〜～]30年/,'african-helmeted-turtle':/20[〜～]40年/,'matamata':/15[〜～]25年/,'western-painted-turtle':/15[〜～]30年/,'eastern-painted-turtle':/15[〜～]30年/,'northern-diamondback-terrapin':/20[〜～]40年/,'pancake-tortoise':/30[〜～]50年|20[〜～]30年/,'aldabra-tortoise':/80[〜～]150年|野生では100年以上/,'malayan-box-turtle':/20[〜～]40年|20[〜～]50年/,'elongated-tortoise':/40[〜～]60年|30[〜～]80年/,'home-hinge-back-tortoise':/30[〜～]50年|20[〜～]40年/,'leopard-tortoise':/50[〜～]100年|30[〜～]80年/,'spotted-turtle':/25[〜～]50年|20[〜～]50年/,'west-african-mud-turtle':/根拠のある記録なし/,'reeves-turtle':/20[〜～]40年|30[〜～]40年|20[〜～]30年/,'red-eared-slider':/20[〜～]40年|30[〜～]40年/,'sulcata-tortoise':/50[〜～]100年|70[〜～]100年/,'red-footed-tortoise':/30[〜～]80年|50[〜～]80年/,'greek-tortoise':/50[〜～]100年/,'eastern-box-turtle':/30[〜～]80年|40[〜～]50年|30[〜～]50年/};
 if(oldRanges[slug])check(!oldRanges[slug].test(html),slug+' unsupported old lifespan range absent across full page');
 check(!html.includes('（動物園の案内）生きる'),'institutional label not spliced into prose');
 check(!/飼育記録生き|飼育報告生き|文献報告生き|飼育記録の付き合い/.test(html),slug+' no record label in lifespan verb');
 check(!html.includes(value+'の長期飼育'),slug+' record label not spliced into narrative');
 check(html.includes(value),slug+' display');check(html.includes(note),slug+' note');check(html.includes(url),slug+' source');
 check((html.match(/lifespanLabel: '寿命の資料'/g)||[]).length===(slug==='obsti-hirase-turtle'?0:slug==='west-african-mud-turtle'?1:2),slug+' existing widgets labelled');
 for(const m of html.matchAll(/lifespan: ['"]([^'"]+)['"], lifespanLabel: '寿命の資料'/g))check(m[1]===value,slug+' widget exact value');
 if(value.startsWith('種全体は'))check(!html.includes(value.replace('種全体は','種全体は種全体は')),slug+' no duplicate species label');
 check(!/推定寿命<|寿命目安</.test(html),slug+' old label absent');
 const blocks=[...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
 check(blocks.length>0,slug+' structured data parses');
 if(['russian-tortoise','hermann-tortoise','red-eared-slider','sulcata-tortoise','leopard-tortoise','aldabra-tortoise'].includes(slug)) {
  check(blocks.some(b=>JSON.stringify(b).includes(note)),slug+' FAQ matches visible answer');
 }
}
const reply=ctx.KameAnnainin.getAnnaininResponse('lifespan').reply;
check(reply.includes('平均寿命')&&reply.includes('記録'), 'answer distinguishes record/mean');
check(!/\d+.*[〜～].*\d+/.test(reply),'no aggregate range');
check(ctx.KameAnnainin._test.lifespanSummary().max===null,'records never aggregated');
check(read('js/quick-facts.js').includes("opts.lifespanLabel || '寿命目安'"),'quick label backward compatible');
check(read('js/starter-kit.js').includes("opts.lifespanLabel || '寿命目安'"),'starter label backward compatible');
const index=read('shindan/index.html');
check(index.includes('sp.lifespanEvidence ? sp.coreSpecs.lifespan'),'diagnostic override');
check(index.includes('specGrid.appendChild(lifeNoteEl)'),'diagnostic source visible');
check(!index.includes("lifespan: '20〜30年', diet: '雑食'"),'fallbacks updated');
console.log(`${checks} lifespan checks passed`);
