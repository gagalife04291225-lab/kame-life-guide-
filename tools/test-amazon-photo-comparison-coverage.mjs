
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

// A deliberately small DOM stand-in for the selectors in the *actual* comparison
// page link generators. No network, tracking, browser dependency or clicks.
const read = path => readFileSync(new URL('../'+path, import.meta.url),'utf8');
const origin = 'https://kamelifeguide.com';
const products = read('data/products.js');
const client = read('js/amazon-product-images.js');
const guardCode = client.slice(client.indexOf('  const asinOf ='),client.indexOf('  const items =')) +
  client.slice(client.indexOf('  const contextSelectors ='),client.indexOf('  function validPhoto('));
assert.match(guardCode,/function route/);
const guard = runInNewContext(guardCode+'; ({asinOf,route,contextSelectors})',{URL,location:{origin}});

const match = (node,rule) => {
  const parts = /^([a-z0-9]+)?(?:\.([\w-]+))?(?:\[([\w-]+)(?:(\*=|=)"([^"]*)")?\])?(?::not\(\.([\w-]+)\))?$/.exec(rule.trim());
  assert.ok(parts && parts[0], 'unsupported selector '+rule);
  const [,tag,cls,attr,op,val,excluded] = parts;
  if (tag && tag !== node.tag || cls && !node.classList.contains(cls) ||
      excluded && node.classList.contains(excluded)) return false;
  if (!attr) return true;
  const got = node.getAttribute(attr);
  return got !== null && (!op || (op === '=' ? got === val : got.includes(val)));
};
function element(tag, attrs = {}, parent = null) {
  const n = {
    tag, parent, attrs, children: [],
    classList: {
      contains(s){return (attrs.class || '').split(/\s+/).includes(s);},
      add(s){attrs.class = [attrs.class,s].filter(Boolean).join(' ');}
    },
    getAttribute(k){return attrs[k] ?? null;},
    removeAttribute(k){delete attrs[k];},
    querySelector(sel){return this.querySelectorAll(sel)[0] ?? null;},
    querySelectorAll(sel){
      return this.children.filter(x=>typeof x !== 'string').flatMap(ch=>
        [...(sel.split(',').some(r=>match(ch,r))?[ch]:[]),...ch.querySelectorAll(sel)]);
    },
    closest(sel){
      for(let p=this;p;p=p.parent) if(sel.split(',').some(r=>match(p,r))) return p;
      return null;
    },
    appendChild(child){child.parent=this;this.children.push(child);},
    get dataset(){return {asin:attrs['data-asin']};},
    get textContent(){return this.children.map(ch=>typeof ch === 'string'?ch:ch.textContent).join('');},
    set textContent(value){this.children=[value];}
  };
  for (const [prop,attr] of [['href','href'],['target','target'],['rel','rel'],['className','class']]){
    Object.defineProperty(n,prop,{get(){return attrs[attr];},set(v){attrs[attr]=v;}});
  }
  return n;
}
function parse(markup) {
  const root=element('document');
  let node=root;
  const voidTags=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
  for (const m of markup.matchAll(/<!--[\s\S]*?-->|<\/?([a-z][\w-]*)(?:\s+(?:"[^"]*"|'[^']*'|[^"'<>])*)?\/?>|([^<]+)/gi)){
    const [token,name,str]=m;
    if(str){node.children.push(str);continue;}
    if(!name)continue;
    const tag=name.toLowerCase();
    if(token.startsWith('</')){
      let ancestor=node;
      while(ancestor!==root && ancestor.tag!==tag)ancestor=ancestor.parent;
      if(ancestor!==root)node=ancestor.parent;
      continue;
    }
    const attrs=Object.fromEntries([...token.matchAll(/\s([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)]
      .map(([,k,a,b,c])=>[k.toLowerCase(),(a??b??c??'').replace(/&amp;/g,'&')]));
    const child=element(tag,attrs);
    node.appendChild(child);
    if(!voidTags.has(tag) && !token.endsWith('/>'))node=child;
  }
  return root;
}

const pages=[
  'dish-best10.html','cage-best10.html','food-best10.html','shelter-best10.html',
  'substrate-best10.html','uvb-light-best10.html','water-filter-best10.html'
];
const report={};
for(const page of pages){
  const html=read(page);
  const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)]
    .map(m=>m[1]).filter(script=>script.includes('btnArea.appendChild(rBtn)'));
  assert.equal(scripts.length,1,page+' link generator');
  const doc=parse(html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,''));
  doc.createElement=element;
  runInNewContext(products+'\n'+scripts[0],{document:doc,URL});
  const row={exact:0,search:0,direct:0,eligible:0};
  const amazon=doc.querySelectorAll('a[href*="amazon.co.jp/"]').filter(a=>guard.asinOf(a.href));
  for(const a of amazon){
    row.exact++;
    const ctx=a.closest('.item,.diy');
    assert.ok(ctx,page+' missing card context');
    const partner=ctx.querySelector('a.rakuten-btn');
    assert.ok(partner,page+' missing hydrated Rakuten route');
    if(new URL(partner.href).hostname==='search.rakuten.co.jp')row.search++;
    else if(new URL(partner.href).hostname==='hb.afl.rakuten.co.jp')row.direct++;
    else assert.fail(page+' unexpected Rakuten route');
    if(guard.route(a))row.eligible++;
  }
  assert.ok(row.exact>0,page+' no exact Amazon link exercised');
  assert.equal(row.search+row.direct,row.exact,page+' keep both retailers');
  assert.equal(row.eligible,0,page+' mixed cards are not Amazon photo coverage');
  report[page]=row;
}
const sums=Object.values(report).reduce((prev,x)=>[prev[0]+x.exact,prev[1]+x.search,prev[2]+x.direct,prev[3]+x.eligible],[0,0,0,0]);
assert.ok(sums[1]>0 && sums[2]>0,'exercise search and exact affiliate routes');
console.log('Comparison photo placement after link generation (occurrences, not live coverage):',JSON.stringify(report));

// Guide equipment has a separate renderer. Exercise actual configured mounts,
// including guides that deliberately suppress affiliate links.
const guides=['arid','brackish','dry','japan','moist','softshell','water-full','semi'];
const specs=read('data/setup-specs.js'), renderer=read('js/setup-products.js');
const guideReport={};
const uniqueGuideAsins=new Set();
for(const name of guides){
  const markup=read('guide-'+name+'.html');
  assert.match(markup,/\/?js\/setup-products\.js\b/);
  const doc=parse(markup.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,''));
  const boxes=doc.querySelectorAll('.setup-products[data-setup]');
  assert.ok(boxes.length,name+' missing setup mounts');
  for(const box of boxes){
    box.addEventListener=()=>{};
    Object.defineProperty(box,'innerHTML',{set(html){
      box.children=[];
      for(const child of parse(html).children){
        if(typeof child==='string')box.children.push(child);
        else box.appendChild(child);
      }
    }});
  }
  doc.readyState='complete';
  runInNewContext([products,specs,renderer].join('\n'),{document:doc,window:{}});
  const row={mounts:boxes.length,exact:0,paired:0,noContext:0,blockedByContext:0,eligible:0};
  for(const box of boxes){
    const links=box.querySelectorAll('a[data-retailer]');
    for(const link of links){
      if(link.getAttribute('data-retailer')!=='amazon')continue;
      const asin=guard.asinOf(link.href);
      if(!asin)continue;
      row.exact++;
      uniqueGuideAsins.add(asin);
      const peers=link.parent.querySelectorAll('a[data-retailer="rakuten"]').filter(other=>
        ['data-product-id','data-pos'].every(key=>other.getAttribute(key)===link.getAttribute(key)));
      assert.equal(peers.length,1,name+' exact Amazon guide product must retain its Rakuten option');
      row.paired++;
      if(guard.route(link)){row.eligible++;continue;}
      if(link.closest(guard.contextSelectors))row.blockedByContext++;
      else row.noContext++;
    }
  }
  if(name==='japan')assert.equal(row.exact,0,'Japanese pond guide is link-free by design');
  else assert.ok(row.exact>0,name+' did not exercise any guide product links');
  assert.equal(row.eligible,0,name+' mixed guide links are not Amazon photo coverage');
  guideReport[name]=row;
}
console.log('Guide photo placement after setup rendering (not live coverage):',
  JSON.stringify({pages:guideReport,uniqueAsins:uniqueGuideAsins.size}));
