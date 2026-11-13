import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const base='17c981ae55867343f43eeab478f600ff11acd934';
const read=p=>fs.readFileSync(root+p,'utf8');
const load=src=>{const c=vm.createContext({window:{}});vm.runInContext(src+';this.S=SPECIES;',c);return c.S;};
const before=load(execFileSync('git',['-C',root,'show',base+':shindan/species.js'],{encoding:'utf8'}));
const after=load(read('shindan/species.js'));
const slugs=['alabama-map-turtle','european-pond-turtle','spiny-softshell-turtle','pancake-tortoise','red-eared-slider','yellow-bellied-slider','cumberland-slider'];
const stable=s=>JSON.stringify(s,(k,v)=>typeof v==='function'?v.toString():v);
let n=0;
for(const route of ['land','aquatic','forest','exotic']) for(let i=0;i<before[route].length;i++){
 const a={...before[route][i]},b={...after[route][i]};assert.equal(a.slug,b.slug);
 if(slugs.includes(a.slug)) for(const k of ['cites','legalNote','diagnosisNotice',...(a.legal==='conditional_invasive'?['reason']:[])]){delete a[k];delete b[k];}
 if(a.slug==='chinese-stripe-necked-turtle'){assert.equal(b.cites,'CITES III');delete a.cites;delete b.cites;}
 assert.equal(stable(a),stable(b),a.slug);n++;
}
assert.equal(n,119);
for(const slug of ['pancake-tortoise','red-eared-slider','yellow-bellied-slider','cumberland-slider']){const sp=Object.values(after).flat().find(x=>x.slug===slug);assert.match(sp.diagnosisNotice,/飼育自体が一律禁止という意味ではありません/);}
const all=Object.values(after).flat();
for(const slug of slugs){const s=all.find(x=>x.slug===slug);assert.ok(s.legalNote);assert.ok(s.hasPage);}
assert.equal(all.find(x=>x.slug==='alabama-map-turtle').cites,'CITES II');
assert.match(all.find(x=>x.slug==='european-pond-turtle').cites,/ウクライナ個体群のみ/);
assert.match(all.find(x=>x.slug==='spiny-softshell-turtle').legalNote,/atra.*附属書I/);
const master=JSON.parse(read('data/species-master.json')).species;
assert.equal(master.find(x=>x.slug==='alabama-map-turtle').cites.since.value,'2023-02-23');
assert.equal(master.find(x=>x.slug==='european-pond-turtle').cites.since.value,'2021-06-22');
for(const slug of ['european-pond-turtle','spiny-softshell-turtle'])assert.equal(master.find(x=>x.slug===slug).cites.appendix.display_label,all.find(x=>x.slug===slug).cites);
for(const slug of slugs){
 const page=read('species/'+slug+'.html');
 for(const m of page.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))JSON.parse(m[1]);
 const prev=execFileSync('git',['-C',root,'show',base+':species/'+slug+'.html'],{encoding:'utf8'});
 const commerce=s=>[...s.matchAll(/(?:href|src)="([^"]+)"/g)].map(x=>x[1]).filter(x=>/amazon|amzn|rakuten|googletagmanager|starter-kit|products\.js/.test(x));
 // Product cache hashes legitimately change after catalog updates; preserve actual destinations.
 const withoutVersion=xs=>xs.map(x=>x.replace(/([?&])v=[a-f0-9]+(?=&|$)/g,''));
 assert.deepEqual(withoutVersion(commerce(page)),withoutVersion(commerce(prev)),slug+' commerce');
}
assert.ok(!read('species/european-pond-turtle.html').includes('CITES II 掲載種'));
assert.ok(!read('species/cumberland-slider.html').includes('CITES III'));
assert.match(read('species/pancake-tortoise.html'),/30日以内/);
assert.ok(!read('shindan/index.html').includes('既飼育個体のみ継続飼育可'));
console.log('PASS: 119 species stable outside 7 legal-only records; 7 pages schema and commerce preserved');
