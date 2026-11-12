import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const cwd=fileURLToPath(new URL('../',import.meta.url));const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8').replace(/\r\n/g,'\n');const base=p=>execFileSync('git',['-C',cwd,'show','893e89d2:'+p],{encoding:'utf8'}).replace(/\r\n/g,'\n');
function data(text){const c=vm.createContext({});vm.runInContext(text+';this.species=SPECIES;this.conditions=DIAGNOSIS_EQUIPMENT_CONDITIONS;',c);return c;}
const old=data(base('shindan/species.js')),now=data(read('shindan/species.js')),plain=x=>JSON.parse(JSON.stringify(x));
const targets=['elongated-tortoise','red-footed-tortoise'];let count=0,changes=0;
for(const [route,list] of Object.entries(now.species).filter(([r])=>r!=='all'))for(let i=0;i<list.length;i++){
 const actual=plain(list[i]),expected=plain(old.species[route][i]);assert.equal(actual.name,expected.name);
 if(targets.includes(actual.slug)){expected.coreSpecs.diet='雑食（植物性・動物性の食材）';if(actual.slug==='elongated-tortoise')expected.specs['主な食事']='植物性・動物性の食材';changes++;}
 assert.deepEqual(actual,expected,actual.name);count++;
}assert.equal(count,119);assert.equal(changes,2);
assert.equal(Object.keys(now.conditions).length,32);assert.equal(Object.keys(now.conditions).filter(k=>!old.conditions[k]).length,16);
for(const [slug,c] of Object.entries(old.conditions))assert.deepEqual(plain(now.conditions[slug]),plain(c),slug+' existing conditions');
for(const [slug,c] of Object.entries(now.conditions)){assert.ok(now.species.all.some(sp=>sp.slug===slug));assert.ok(c.items.length>=3);assert.ok(c.sources.length);assert.ok(c.sources.every(s=>s.url.startsWith('https://')));}
// Evaluate the actual spec rendering block. Core data must override conflicting legacy data.
const html=read('shindan/index.html');const start=html.indexOf("  var specGrid = document.getElementById('res-specs');"),end=html.indexOf('  if (sp.lifespanEvidence) {',start);assert.ok(start>=0&&end>start);
function render(sp){const grid={innerHTML:''};vm.runInNewContext(html.slice(start,end),{sp,document:{getElementById(){return grid;}}});return grid.innerHTML;}
for(const sp of now.species.all){const out=render(sp);if(sp.coreSpecs?.diet)assert.ok(out.includes(sp.coreSpecs.diet),sp.name);else if(sp.specs?.['主な食事'])assert.ok(out.includes(sp.specs['主な食事']),sp.name);}
for(const slug of targets){const sp=now.species.all.find(x=>x.slug===slug),prior=old.species.all.find(x=>x.slug===slug);assert.ok(render(sp).includes('雑食（植物性・動物性の食材）'));assert.throws(()=>assert.ok(render(prior).includes('雑食（植物性・動物性の食材）')),{name:'AssertionError'});const fallback=plain(sp);delete fallback.coreSpecs;assert.ok(render(fallback).includes(fallback.specs['主な食事']));const page=read('species/'+slug+'.html');assert.ok(page.includes('雑食（植物性・動物性）'));assert.ok(!base('species/'+slug+'.html').includes('<div class="stat-value">雑食（植物性・動物性）</div>'));}
console.log('PASS:119 species unchanged except authorized3 diet fields;16 conditions added/16 preserved; actual core/fallback renderer checked across119; old2 species diet displays fail corrected assertions.');
