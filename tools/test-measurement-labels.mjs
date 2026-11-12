import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const cwd=fileURLToPath(new URL('../',import.meta.url));const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8').replace(/\r\n/g,'\n');const base=p=>execFileSync('git',['-C',cwd,'show','893e89d2:'+p],{encoding:'utf8'}).replace(/\r\n/g,'\n');
function ctx(rd){let h=rd('shindan/index.html'),a=h.indexOf('function resolveEquipmentKey('),b=h.indexOf('\n}',a),c=vm.createContext({window:{},document:{},console});vm.runInContext(rd('data/products.js')+'\n'+rd('js/starter-kit.js')+'\n'+rd('shindan/species.js')+'\n'+h.slice(a,b+2)+';this.species=SPECIES;this.products=PRODUCTS;',c);return c;}
const old=ctx(base),now=ctx(read),plain=x=>JSON.parse(JSON.stringify(x));
const strip=p=>{let x=plain(p);delete x.why;return x;};
for(const [id,p] of Object.entries(old.products)){assert.deepEqual(strip(now.products[id]),strip(p));if(id!=='thermometer_dual_probe')assert.equal(now.products[id].why,p.why);}
let n=0;for(const [r,list] of Object.entries(now.species).filter(([r])=>r!=='all'))for(let i=0;i<list.length;i++)for(const route of [r,'all'])for(const tier of ['budget','standard','premium']){
 const key=now.resolveEquipmentKey(route,list[i]);assert.equal(key,old.resolveEquipmentKey(route,old.species[r][i]));
 const a=now.generateKitByTier(key,tier),b=old.generateKitByTier(key,tier);
 assert.deepEqual(plain(a).map(x=>({...x,product:strip(x.product)})),plain(b).map(x=>({...x,product:strip(x.product)})));assert.deepEqual(plain(now.calcBundlePriceRange(a)),plain(old.calcBundlePriceRange(b)));n++;
}assert.equal(n,714);
const labels={thermometer_digital:'温湿度計',thermometer_aqua:'水温計',thermometer_dual_probe:'温度計（本体・外部センサー）',thermometer_infrared:'赤外線温度計（表面温度）',thermometer_wifi:'温湿度計',thermometer_analog:'温度計'};
for(const [id,p] of Object.entries(now.products)){
 const item={cat:p.category,tier:'standard',product:p},html=now.renderSkCard(item,'test','tortoise_dry_small');
 if(p.category!=='thermometer'){assert.equal(html,old.renderSkCard({...item,product:old.products[id]},'test','tortoise_dry_small'),id);continue;}
 assert.ok(html.includes('<div class="sk-cat-label">'+labels[id]+'</div>'),id);
 for(const [,display] of html.matchAll(/data-display-cat="([^"]*)"/g))assert.equal(display,labels[id]);
 const tabs=vm.runInContext('SK_TABS',now).map(tab=>({tab,picks:[item]}));
 const bundle=now.renderBundleSummary(tabs,'test');assert.ok(bundle.includes('<span class="sk-bundle-item-tag">'+labels[id]+'</span>'));
}
assert.equal(now._skDisplayCat('thermometer'),'温度・湿度の測定器');assert.equal(now.getMeasurementLabel({id:'unknown'}),'温度・湿度の測定器');
assert.ok(now.products.thermometer_dual_probe.why.includes('湿度は測れない'));assert.ok(!now.products.thermometer_dual_probe.why.includes('プローブ2本'));
const html=now.renderStarterKitHtmlV2('tortoise_dry_small',{name:'test'});assert.equal((html.match(/class="sk-hint sk-cost-scope"/g)||[]).length,1);assert.ok(html.includes('床材の必要袋数'));assert.ok(html.includes('別売の照明器具'));
console.log('PASS: 714 selections and all product commercial fields unchanged; six measurement labels/card link analytics attributes/bundle labels; other 136 product cards byte-identical; shared cost note.');
// Execute real mountStarterKit click handlers with an inert DOM and memory-only gtag.
// Links are parsed from the actual rendered card HTML, not constructed from expected labels.
function clickEvents(context,product){
 const events=[],links=[];
 const decode=x=>x.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
 const root={style:{},innerHTML:'',querySelector(){return null;},querySelectorAll(selector){
  if(selector!=='.sk-card-btn[href]')return [];
  links.length=0;
  for(const [tag] of this.innerHTML.matchAll(/<a\b[^>]*class="sk-card-btn[^>]*>/g)){
   const dataset={};for(const [,key,value] of tag.matchAll(/data-([a-z-]+)="([^"]*)"/g))dataset[key.replace(/-([a-z])/g,(_,x)=>x.toUpperCase())]=decode(value);
   if(dataset.productId!==product.id)continue;
   const href=tag.match(/\bhref="([^"]*)"/)?.[1];if(!href)continue;
   links.push({dataset,href:decode(href),closest(){return null;},addEventListener(name,handler){this[name]=handler;}});
  }return links;
 }};
 context.document={getElementById(){return root;}};
 context.gtag=(...args)=>events.push(plain(args));
 const render=context.renderStarterKitHtmlV2;
 // Limit the DOM fixture to this actual card; mount/event wiring and card renderer remain real.
 context.renderStarterKitHtmlV2=()=>context.renderSkCard({cat:'thermometer',tier:'standard',product},'test','tortoise_dry_small');
 try{context.mountStarterKit({name:'test',equipmentKey:'tortoise_dry_small'},'test');}finally{context.renderStarterKitHtmlV2=render;}
 assert.ok(links.length>0,product.id+' rendered purchase/search link');
 for(const link of links){const start=events.length;link.click();const emitted=events.slice(start);
  for(const eventName of ['starter_kit_click','starter_kit_cta_click']){
   const event=emitted.find(x=>x[1]===eventName);assert.ok(event,eventName);
   assert.equal(event[2].category,'thermometer');assert.equal(event[2].product_category,'thermometer');
   assert.equal(event[2].display_category,link.dataset.displayCat);
  }
  const affiliate=emitted.find(x=>x[1]==='affiliate_click');assert.ok(affiliate);assert.equal(affiliate[2].category,'thermometer');assert.equal(affiliate[2].product_id,product.id);
 }
 return events.filter(x=>x[1]==='starter_kit_click');
}
for(const [id,label] of Object.entries(labels)){
 const emitted=clickEvents(now,now.products[id]);assert.ok(emitted.length>0);
 for(const event of emitted)assert.equal(event[2].display_category,label,id);
}
const legacy=clickEvents(old,old.products.thermometer_dual_probe);
assert.throws(()=>assert.equal(legacy[0][2].display_category,labels.thermometer_dual_probe),{name:'AssertionError'});
assert.equal(legacy[0][2].display_category,'温湿度計');
console.log('PASS: actual mount/click handlers for all six measurement products preserve canonical category keys and match display labels; base73117 demonstrably fails corrected-label assertion. No network APIs supplied.');
