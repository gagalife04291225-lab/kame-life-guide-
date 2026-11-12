import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import assert from 'node:assert/strict';import crypto from 'node:crypto';import {spawnSync} from 'node:child_process';import {updateAssetVersions,ASSETS} from '../scripts/update-asset-versions.mjs';
const root=fs.mkdtempSync(path.join(os.tmpdir(),'asset-version-test-'));
const put=(p,s)=>{fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),s);};
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
try{
 for(const [i,a] of ASSETS.entries())put(a,`// asset ${i}\r\nconst x=${i};\r\n`);
 put('index.html','\uFEFF<script src="js/starter-kit.js"></script>\r\n<script src="/data/products.js?mode=x&amp;v=old&amp;lang=ja#tail"></script>\r\n<script src="https://example.com/js/starter-kit.js"></script>\r\n<script src="//example.com/data/products.js"></script>\r\n<script src="js/other.js?v=old"></script>\r\n<!-- <script src="js/starter-kit.js"></script> -->\r\n');
 put('shindan/index.html',`<script src='species.js?v=old&v=duplicate#hash'></script>\n<script>window.__loadScriptOnce('species.js');window.__loadScriptOnce('../data/products.js?mode=x&v=old#h');__loadScriptOnce('../js/starter-kit.js');__loadScriptOnce('https://host/js/starter-kit.js');</script>`);
 put('species/sample.html','<SCRIPT defer SRC = "../js/starter-kit.js?foo=a%20b#h"></SCRIPT>');
 put('unrelated.html','<script src="js/other.js"></script>');put('notes.txt','../js/starter-kit.js');
 const original=read('index.html'),unrelated=read('unrelated.html');
 let result=updateAssetVersions(root,{check:true});assert.equal(result.changed.length,3);assert.equal(read('index.html'),original);
 for(const a of ASSETS)assert.equal(result.versions[a],crypto.createHash('sha256').update(read(a).replace(/\r\n/g,'\n')).digest('hex').slice(0,12));
 const versions=result.versions;result=updateAssetVersions(root);assert.equal(result.changed.length,3);
 assert.ok(read('index.html').startsWith('\uFEFF'));assert.ok(read('index.html').includes('\r\n'));
 assert.ok(read('index.html').includes('?mode=x&amp;lang=ja&amp;v='+versions['data/products.js']+'#tail'));
 assert.ok(read('index.html').includes('https://example.com/js/starter-kit.js'));assert.ok(read('index.html').includes('//example.com/data/products.js'));
 assert.ok(read('index.html').includes('<!-- <script src="js/starter-kit.js"></script> -->'));
 assert.ok(read('species/sample.html').includes('?foo=a%20b&v='+versions['js/starter-kit.js']+'#h'));
 assert.ok(read('shindan/index.html').includes("__loadScriptOnce('species.js?v="+versions['shindan/species.js']+"')"));
 assert.ok(!read('shindan/index.html').includes('v=old'));assert.ok(!read('shindan/index.html').includes('v=duplicate'));
 assert.equal(read('unrelated.html'),unrelated);assert.equal(read('notes.txt'),'../js/starter-kit.js');
 assert.equal(updateAssetVersions(root).changed.length,0);assert.equal(updateAssetVersions(root,{check:true}).changed.length,0);
 // Newline-only asset changes must not change the hash.
 put(ASSETS[0],read(ASSETS[0]).replace(/\r\n/g,'\n'));assert.equal(updateAssetVersions(root,{check:true}).changed.length,0);
 put(ASSETS[0],read(ASSETS[0])+'// changed\n');const before=read('index.html');assert.equal(updateAssetVersions(root,{check:true}).changed.length,3);assert.equal(read('index.html'),before);
 updateAssetVersions(root);assert.equal(updateAssetVersions(root,{check:true}).changed.length,0);
 // CLI check exits nonzero without modifying files; default CLI updates fixture only.
 put('scripts/update-asset-versions.mjs',fs.readFileSync(new URL('../scripts/update-asset-versions.mjs',import.meta.url),'utf8'));
 put('new.html','<script src="data/products.js"></script>');
 const cli=path.join(root,'scripts/update-asset-versions.mjs');const check=spawnSync(process.execPath,[cli,'--check'],{encoding:'utf8'});assert.equal(check.status,1,check.stderr);assert.equal(read('new.html'),'<script src="data/products.js"></script>');
 assert.equal(spawnSync(process.execPath,[cli],{encoding:'utf8'}).status,0);assert.equal(spawnSync(process.execPath,[cli,'--check'],{encoding:'utf8'}).status,0);
 // All asset inputs must be available before any HTML can be rewritten.
 // Make references stale, then remove the LAST input to exercise partial-read handling.
 put(ASSETS[0],read(ASSETS[0])+'// another change\n');
 const snapshots=new Map(['index.html','shindan/index.html','species/sample.html','new.html'].map(p=>[p,read(p)]));
 const missing=ASSETS.at(-1), savedAsset=read(missing);fs.unlinkSync(path.join(root,missing));
 assert.throws(()=>updateAssetVersions(root),{code:'ENOENT'});
 assert.throws(()=>updateAssetVersions(root,{check:true}),{code:'ENOENT'});
 for(const [p,contents] of snapshots)assert.equal(read(p),contents,'Missing asset partially rewrote '+p);
 put(missing,savedAsset);updateAssetVersions(root);assert.equal(updateAssetVersions(root,{check:true}).changed.length,0);

 // Read the real workflow; exercise its gate expressions without executing any
 // workflow commands, contacting Rakuten, committing, or pushing.
 const workflow=fs.readFileSync(new URL('../.github/workflows/rakuten-sync.yml',import.meta.url),'utf8');
 function gate(name){
   const step=workflow.split(/\r?\n(?=      - name: )/).find(s=>s.startsWith('      - name: '+name+'\n')||s.startsWith('      - name: '+name+'\r\n'));
   assert.ok(step,'Missing workflow step: '+name);
   const match=step.match(/\n        if: >-\r?\n([\s\S]*?)(?=\r?\n        \S)/);
   assert.ok(match,'Missing folded gate: '+name);
   return match[1].trim().replace(/\s+/g,' ');
 }
 function evaluate(expression,values){
   const substituted=expression.replace(/github\.event_name|github\.event\.inputs\.(?:audit_images|identity_dryrun|dry_run)|steps\.diff\.outputs\.changed/g,key=>JSON.stringify(values[key]));
   // Permit only the workflow's boolean/string-comparison grammar, not JS code.
   assert.match(substituted,/^(?:\s|\(|\)|&&|\|\||==|!=|"[a-z_]*"|'[a-z_]*')+$/);
   return Function('"use strict";return ('+substituted+');')();
 }
 const refresh=gate('Refresh content-hashed asset references'),commit=gate('Commit and push');
 let matrixCases=0;
 for(const event of ['schedule','workflow_dispatch'])for(const audit of ['','false','true'])for(const identity of ['','false','true'])for(const dry of ['','false','true'])for(const changed of ['','false','true']){
   const values={'github.event_name':event,'github.event.inputs.audit_images':audit,'github.event.inputs.identity_dryrun':identity,'github.event.inputs.dry_run':dry,'steps.diff.outputs.changed':changed};
   const expected=(event!=='workflow_dispatch'||(audit!=='true'&&identity!=='true'))&&changed==='true'&&dry!=='true';
   assert.equal(evaluate(refresh,values),expected,'Refresh gate '+JSON.stringify(values));
   assert.equal(evaluate(commit,values),expected,'Commit gate '+JSON.stringify(values));
   matrixCases++;
 }
 // A scheduled event has no manual inputs. A manual audit/dry-run must not
 // refresh references or commit, even when the earlier diff reports a change.
 assert.equal(evaluate(refresh,{'github.event_name':'schedule','github.event.inputs.audit_images':'','github.event.inputs.identity_dryrun':'','github.event.inputs.dry_run':'','steps.diff.outputs.changed':'true'}),true);
 console.log('PASS: three assets; normal/root/nested/delayed URLs; query/hash; externals/comments/unrelated unchanged; CRLF hash stability; idempotency; changed asset propagation; CLI check; missing asset causes no partial HTML writes; workflow refresh/commit gate matrix '+matrixCases+' cases.');
}finally{fs.rmSync(root,{recursive:true,force:true});}
