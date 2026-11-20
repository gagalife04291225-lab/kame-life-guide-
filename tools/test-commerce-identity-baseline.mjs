// Fully offline trust-boundary tests. Never alter the checkout under test.
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,mkdirSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {resolveRakutenBaseline,RAKUTEN_FEED_KEYS,applyCommittedRakutenSync} from './commerce-identity-baseline.mjs';
const root=mkdtempSync(join(tmpdir(),'klg-feed-gate-'));
const git=(...args)=>execFileSync('git',['-C',root,...args],{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
const repo='gagalife04291225-lab/kame-life-guide-';
const eventPath=join(root,'event.json');
let count=0;
const check=(label,fn)=>{fn();count++;console.log('PASS '+label);};
const plain=x=>JSON.parse(JSON.stringify(x));
function save(p){writeFileSync(join(root,'data/products.js'),'const PRODUCTS = '+JSON.stringify(p)+';');}
function commit(p,label){save(p);git('add','data/products.js');git('commit','-m',label);return git('rev-parse','HEAD');}
const event=(body)=>writeFileSync(eventPath,JSON.stringify({repository:{full_name:repo,default_branch:'main'},...body}));
const ci=(type,extra={})=>({GITHUB_ACTIONS:'true',GITHUB_REPOSITORY:repo,GITHUB_EVENT_PATH:eventPath,GITHUB_EVENT_NAME:type,...extra});
try{
 git('init','-b','main');git('config','user.name','Fixture');git('config','user.email','fixture@example.invalid');mkdirSync(join(root,'data'));
 const initial={fixture:{name:'unchanged',rakutenSearchTerm:'exact model',rakutenPrice:100}};
 const a=commit(initial,'accepted base');git('update-ref','refs/remotes/origin/main',a);
 const published=plain(initial);published.fixture.rakutenPrice=101;published.fixture.rakutenStatus='verified';
 const b=commit(published,'published feed');git('update-ref','refs/remotes/origin/main',b);
 check('local uses published main, not historical pin',()=>assert.equal(resolveRakutenBaseline(root,{}),b));
 const candidate=plain(published);candidate.fixture.rakutenPrice++;
 const c=commit(candidate,'candidate even if bot-looking');
 check('committed candidate is NOT baseline',()=>assert.equal(resolveRakutenBaseline(root,{}),b));
 const originalEnv={...process.env};
 try{
  // This function reads process.env just as the three existing suites do.
  for(const k of Object.keys(process.env))if(k.startsWith('GITHUB_')||k.startsWith('KLG_RAKUTEN_'))delete process.env[k];
  check('published feed passes all eight exact fields',()=>applyCommittedRakutenSync(plain(initial),plain(published),root));
  for(const key of RAKUTEN_FEED_KEYS){
   const changed=plain(published);changed.fixture[key]=key==='rakutenPrice'?102:'tamper';
   check(key+' candidate tamper rejected',()=>assert.throws(()=>applyCommittedRakutenSync(plain(initial),changed,root)));
  }
  const absent=plain(published);delete absent.fixture.rakutenPrice;
  check('feed field deletion rejected',()=>assert.throws(()=>applyCommittedRakutenSync(plain(initial),absent,root)));
 }finally{for(const k of Object.keys(process.env))delete process.env[k];Object.assign(process.env,originalEnv);}
 event({pull_request:{base:{sha:b,ref:'main',repo:{full_name:repo}}}});
 check('PR uses event base independently',()=>assert.equal(resolveRakutenBaseline(root,ci('pull_request')),b));
 check('PR cannot request generated candidate baseline',()=>assert.throws(()=>resolveRakutenBaseline(root,ci('pull_request',{KLG_RAKUTEN_GENERATED_REF:c}))));
 event({pull_request:{base:{sha:c,ref:'main',repo:{full_name:repo}}}});
 check('PR candidate SHA masquerading as base rejected',()=>assert.throws(()=>resolveRakutenBaseline(root,ci('pull_request'))));
 event({ref:'refs/heads/main',before:b,after:c,sender:{login:'owner',type:'User'}});git('update-ref','refs/remotes/origin/main',c);
 check('ordinary push compares before, not published candidate',()=>assert.equal(resolveRakutenBaseline(root,ci('push',{GITHUB_SHA:c})),b));
 event({ref:'refs/heads/main',before:b,after:c,sender:{login:'github-actions[bot]',type:'Bot'}});
 check('published generated bot feed with runner/event proof accepted',()=>assert.equal(resolveRakutenBaseline(root,ci('push',{GITHUB_SHA:c,GITHUB_ACTOR:'github-actions[bot]'})),c));
 const search=plain(candidate);search.fixture.rakutenSearchTerm='different product';const d=commit(search,'bot-looking');git('update-ref','refs/remotes/origin/main',d);
 event({ref:'refs/heads/main',before:c,after:d,sender:{login:'github-actions[bot]',type:'Bot'}});
 check('even proven bot cannot promote search-field changes',()=>assert.throws(()=>resolveRakutenBaseline(root,ci('push',{GITHUB_SHA:d,GITHUB_ACTOR:'github-actions[bot]'}))));
 // Model a disjoint race: generated commit c and concurrent main n from b.
 git('checkout','-b','remote',b);writeFileSync(join(root,'index.html'),'accepted concurrent page');git('add','index.html');git('commit','-m','concurrent');const n=git('rev-parse','HEAD');git('update-ref','refs/remotes/origin/main',n);
 git('checkout','main');git('reset','--hard',c);git('merge','--no-edit','remote');
 event({});const generatedEnv=ci('schedule',{GITHUB_REF:'refs/heads/main',GITHUB_WORKFLOW_REF:repo+'/.github/workflows/rakuten-sync.yml@refs/heads/main',KLG_RAKUTEN_GENERATED_REF:c,KLG_RAKUTEN_GENERATED_BASE:b});
 check('reconciliation trusts immutable pre-merge output only',()=>assert.equal(resolveRakutenBaseline(root,generatedEnv),c));
 const savedEnv={...process.env};
 try{
  for(const k of Object.keys(process.env))if(k.startsWith('GITHUB_')||k.startsWith('KLG_RAKUTEN_'))delete process.env[k];
  Object.assign(process.env,generatedEnv);
  check('reconciled feed passes against original output',()=>applyCommittedRakutenSync(plain(initial),plain(candidate),root));
  const tampered=plain(candidate);tampered.fixture.rakutenPrice++;
  check('post-merge one-yen tamper fails against original output',()=>assert.throws(()=>applyCommittedRakutenSync(plain(initial),tampered,root)));
 }finally{for(const k of Object.keys(process.env))delete process.env[k];Object.assign(process.env,savedEnv);}
 check('reconciliation cannot approve merged HEAD',()=>assert.throws(()=>resolveRakutenBaseline(root,{...generatedEnv,KLG_RAKUTEN_GENERATED_REF:git('rev-parse','HEAD')})));
 check('local arbitrary override rejected',()=>assert.throws(()=>resolveRakutenBaseline(root,{KLG_RAKUTEN_GENERATED_REF:c,KLG_RAKUTEN_GENERATED_BASE:b})));
 check('wrong workflow rejected',()=>assert.throws(()=>resolveRakutenBaseline(root,{...generatedEnv,GITHUB_WORKFLOW_REF:'untrusted'})));
 writeFileSync(join(root,'.git/shallow'),a+'\n');
 check('shallow history fails with useful diagnostic',()=>assert.throws(()=>resolveRakutenBaseline(root,{}),/full Git history/));rmSync(join(root,'.git/shallow'));
 git('update-ref','-d','refs/remotes/origin/main');
 check('missing published ref fails closed',()=>assert.throws(()=>resolveRakutenBaseline(root,{})));
 console.log('Commerce feed trust tests: '+count+' PASS');
}finally{rmSync(root,{recursive:true,force:true});}
