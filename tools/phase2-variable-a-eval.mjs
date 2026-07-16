// tools/phase2-variable-a-eval.mjs
// Phase2 Step6 — Variable-A evaluation: none vs effective.
// Phase2 evaluation infra — NOT production diagnosis logic. Read-only against
// production files (shindan/*). Does NOT modify Phase1 Stable, the none baseline,
// tie-breakers, sort order, evaluation metrics, or Golden18 case definitions.
//
// The ranking path (finalScore / sort / tie-break / CASES / fallbacks) is copied
// verbatim from tools/phase2-golden18-dryrun.mjs so that method === 'none'
// reproduces the frozen none baseline byte-for-byte. The ONLY addition is:
//   - a `method` switch ('none' | 'effective')
//   - effective: min-max normalize `raw` across the selected candidate set,
//     applied AFTER the per-candidate order-decision score is fixed and BEFORE
//     ordering, per 07-effective-method-definition-v1.0.md (DESIGN FROZEN).
//     fs_effective = normalized(raw) * availMult * diffMult * legalMult * budgetMult * odorMult
//   Multiplier meanings/values, tie judgment (round6), sort order, recPri, avail,
//   diff, name are unchanged.
//
// Usage:
//   node tools/phase2-variable-a-eval.mjs            # compare none vs effective
//   node tools/phase2-variable-a-eval.mjs --emit <path.json>   # also write JSON snapshot
import fs from 'fs';
import vm from 'vm';

// ---- load real data (identical to dryrun) ----
const speciesSrc = fs.readFileSync('shindan/species.js', 'utf8');
const routesSrc  = fs.readFileSync('shindan/routes.js', 'utf8');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(speciesSrc + '\n' + routesSrc + '\nthis.__S=SPECIES; this.__R=ROUTES;', ctx);
const SPECIES = ctx.__S, ROUTES = ctx.__R;
const routeById = {}; ROUTES.forEach(r => routeById[r.id] = r);

// ---- reproduce applyAllRouteTagCompat (verbatim from dryrun) ----
function applyAllRouteTagCompat(s) {
  function bump(key, val){ if (val > (s[key]||0)) s[key]=val; }
  var dryEnv=s.dry_env||0, humidEnv=s.humid_env||0, coolEnv=s.cool_env||0;
  if (dryEnv){ bump('dry',dryEnv); bump('basic_env',dryEnv); }
  if (humidEnv){ bump('humid',humidEnv); bump('advanced_env',humidEnv); bump('semi_aquatic',Math.floor(humidEnv/2)); bump('tropical_climate',humidEnv); bump('warm_climate',Math.floor(humidEnv/2)); }
  if (coolEnv){ bump('cooling',coolEnv); bump('cool_climate',coolEnv); }
  var sm=s.small||0, md=s.medium||0, lg=s.large||0;
  if (sm){ bump('compact',sm); bump('small_tank',sm); bump('s_size',sm); bump('small_form',sm); }
  if (md){ bump('medium_tank',md); bump('m_size',md); }
  if (lg){ bump('large_tank',lg); }
  if (s.land_tortoise){ bump('herbivore',Math.min(3,s.land_tortoise)); bump('dry',Math.min(2,s.land_tortoise)); }
  if (s.terrestrial){ bump('mainstream',1); }
  if (s.aquatic){ bump('mainstream',Math.min(2,s.aquatic)); bump('maintenance',1); }
}

// ---- aggregate answers into scores (verbatim) ----
function aggregate(route, answers){
  const scores = {};
  const qs = route.questions;
  answers.forEach((ansIdx, qi) => {
    const q = qs[qi];
    if (!q) return;
    const choice = q.choices[ansIdx];
    if (!choice) return;
    Object.entries(choice.scores).forEach(([k,v]) => { scores[k]=(scores[k]||0)+v; });
  });
  return scores;
}

// ---- finalScore reproduction (verbatim; returns raw + mults + fs=raw*mults) ----
function makeFinalScore(routeId, beginner_mode){
  return function(sp, scores){
    var raw=0; try { raw = sp.score ? sp.score(scores) : 0; } catch(e){}
    var availMult=1.0;
    if (sp.availability==='rare') availMult=0.65;
    if (sp.availability==='archive') availMult=0.0;
    var diffMult=1.0;
    if (beginner_mode){
      var diff=sp.difficulty||'';
      if (diff==='上級') diffMult=0.40;
      else if (diff==='中〜上級') diffMult=0.55;
      else if (diff.indexOf('中級')>=0 && diff.indexOf('入門')<0) diffMult=0.85;
      if (diff==='入門〜中級') diffMult=0.92;
    }
    var legalMult=1.0;
    if (sp.legal==='conditional_invasive') legalMult=0.25;
    var budgetMult=1.0;
    var _sz=sp.size||'';
    var _isXL=_sz.indexOf('XL')>=0;
    var _isL=!_isXL && _sz.indexOf('L')>=0;
    var _isAquaticSp=(routeId==='aquatic') || /水槽|水量/.test((sp.specs && sp.specs['水容量'])||'');
    if (scores.budget_under10k){
      if (_isXL) budgetMult=0.30; else if (_isL) budgetMult=0.55; else if (_isAquaticSp && _sz.indexOf('M')>=0) budgetMult=0.85;
    } else if (scores.budget_10_30k){
      if (_isXL) budgetMult=0.50; else if (_isL) budgetMult=0.80;
    } else if (scores.budget_30_70k){
      if (_isXL) budgetMult=0.85;
    }
    var odorMult=1.0;
    var _latin=sp.latin||'';
    var _isSliderCooter=/Trachemys|Pseudemys|Chrysemys/.test(_latin);
    var _isBoxTurtle=/Terrapene|Cuora/.test(_latin);
    var _isSmallForest=(routeId==='forest') && _sz.indexOf('S')>=0;
    if (scores.odor_hate){
      if (_isSliderCooter) odorMult=0.45; else if (_isAquaticSp && _isXL) odorMult=0.50; else if (_isAquaticSp && _isL) odorMult=0.60; else if (_isAquaticSp) odorMult=0.85;
      if (_isBoxTurtle || _isSmallForest) odorMult=1.15;
    } else if (scores.odor_low){
      if (_isSliderCooter) odorMult=0.70; else if (_isAquaticSp && (_isXL||_isL)) odorMult=0.78;
      if (_isBoxTurtle || _isSmallForest) odorMult=1.08;
    }
    var fs = raw*availMult*diffMult*legalMult*budgetMult*odorMult;
    return { raw, availMult, diffMult, legalMult, budgetMult, odorMult, fs };
  };
}

const DIFF_ORDER={'入門':0,'入門〜中級':1,'中級':2,'中〜上級':3,'上級':4};
const AVAIL_ORDER={'common':0,'rare':1,'archive':2};
function diffOrder(sp){ var d=sp.difficulty||''; for(var k in DIFF_ORDER){ if(d===k) return DIFF_ORDER[k]; } return 99; }
function round6(x){ return Math.round(x*1e6)/1e6; }

// ---- Variable-B tie-break comparators (applied ONLY when finalScore is tied) ----
// Does NOT touch fs primary key, raw, normalize, multipliers, pool, match, H, Golden18.
// 'A' = current production chain (recPri -> avail -> diff -> name); reproduces Phase1 Stable.
// 'E' = composite: insert raw (higher match first) before name.
// 'B' = availability-first: avail -> recPri -> diff -> name.
function tieBreakCompare(a, b, mode){
  const recPri = x => (x.sp.recommendationPriority||0);
  const availO = x => (AVAIL_ORDER[x.sp.availability]!==undefined?AVAIL_ORDER[x.sp.availability]:1);
  const byRecPri = () => recPri(b)-recPri(a);           // desc
  const byAvail  = () => availO(a)-availO(b);           // common first
  const byDiff   = () => diffOrder(a.sp)-diffOrder(b.sp); // easy first
  const byRaw    = () => b.f.raw-a.f.raw;               // desc (higher raw match first)
  const byName   = () => (a.sp.name||'').localeCompare(b.sp.name||'','ja');
  let chain;
  if (mode==='E')      chain=[byRecPri, byAvail, byDiff, byRaw, byName];
  else if (mode==='B') chain=[byAvail, byRecPri, byDiff, byName];
  else                 chain=[byRecPri, byAvail, byDiff, byName]; // 'A' (default = current)
  for (const f of chain){ const r=f(); if (r!==0) return r; }
  return 0;
}

// ---- effective normalization (min-max over the selected candidate set) ----
// 07-effective-method-definition-v1.0.md: (raw - min)/(max - min); range==0 -> 1;
// single candidate -> 1 (covered by range==0). Applied to the ORDER-DECISION score
// only; multipliers untouched; then recomposed with the same multiplicative corrections.
function applyEffective(scored){
  const raws = scored.map(x => x.f.raw);
  const mn = Math.min.apply(null, raws);
  const mx = Math.max.apply(null, raws);
  const range = mx - mn;
  scored.forEach(x => {
    const norm = (range === 0) ? 1 : (x.f.raw - mn) / range;
    x.f.norm = norm;
    x.f.fs = norm * x.f.availMult * x.f.diffMult * x.f.legalMult * x.f.budgetMult * x.f.odorMult;
  });
}

// ---- hybrid (Candidate3): H = alpha*rel + (1-alpha)*abs, over the selected set ----
// method-definition.md Candidate3: rel = min-max; abs = r/max (min not subtracted).
// alpha = raw-relative weight; (1-alpha) = raw-absolute-ratio retention. range0 -> 1.
const HYBRID_ALPHA = 0.5;
function applyHybrid(scored, alpha){
  const raws = scored.map(x => x.f.raw);
  const mn = Math.min.apply(null, raws);
  const mx = Math.max.apply(null, raws);
  const range = mx - mn;
  scored.forEach(x => {
    let rel, abs;
    if (range === 0){ rel = 1; abs = 1; }
    else {
      rel = (x.f.raw - mn) / range;
      abs = (mx > 0) ? (x.f.raw / mx) : rel;
    }
    const H = alpha * rel + (1 - alpha) * abs;
    x.f.norm = H;
    x.f.fs = H * x.f.availMult * x.f.diffMult * x.f.legalMult * x.f.budgetMult * x.f.odorMult;
  });
}

// ---- full calcResult reproduction, parameterized by method ----
function evaluate(routeId, answers, method, tiebreak){
  tiebreak = tiebreak || 'A';
  const route = routeById[routeId];
  const scores = aggregate(route, answers);
  if (routeId==='all') applyAllRouteTagCompat(scores);
  var candidates = (route.species||[]).filter(sp => sp.availability!=='archive' && sp.availability!=='redirect' && sp.availability!=='exclude' && sp.legal!=='unknown_hold');
  if (candidates.length===0) candidates = (route.species||[]);
  var beginner_mode = (scores.beginner||0) >= 2;
  var poolType, top3=[];
  if (routeId==='exotic' && beginner_mode){
    return { scores, beginner_mode, matchedCount:0, poolType:'exoticFallback', top3:[{name:'ミシシッピニオイガメ(fallback)'}], detail:[] };
  }
  var matched = candidates.filter(sp => { try { return sp.match ? sp.match(scores) : true; } catch(e){ return false; } });
  const finalScore = makeFinalScore(routeId, beginner_mode);
  var safeFallback = candidates.filter(sp => {
    if (sp.legal==='conditional_invasive') return false;
    var diff=sp.difficulty||'';
    if (diff==='上級') return false;
    if (sp.size && sp.size.indexOf('XL')>=0) return false;
    if (beginner_mode && sp.availability==='rare') return false;
    if (beginner_mode && diff==='中〜上級' && routeId!=='forest') return false;
    return true;
  });
  var ROUTE_FALLBACK_NAMES={ aquatic:['ニオイガメ','ヒメニオイガメ','ミシシッピドロガメ'], land:['ヘルマンリクガメ','ロシアリクガメ','ギリシャリクガメ'], forest:['キボシイシガメ','ミツユビハコガメ','゠ウブハコガメ','フロリダハコガメ'] };
  function getRouteFallback(rId){
    var names=ROUTE_FALLBACK_NAMES[rId]||[]; var pool=[];
    var allSps=(SPECIES && SPECIES[rId])?SPECIES[rId]:candidates;
    names.forEach(n => { var found=allSps.filter(sp => sp.name===n && sp.availability!=='archive' && sp.availability!=='redirect' && sp.availability!=='exclude' && sp.legal!=='unknown_hold'); if(found.length) pool.push(found[0]); });
    if (pool.length===0){ pool=allSps.filter(sp => sp.availability!=='archive' && sp.availability!=='redirect' && sp.availability!=='exclude' && sp.legal!=='unknown_hold' && (sp.difficulty||'')!=='上級').slice(0,3); }
    return pool;
  }
  var pool;
  if (matched.length>0){ pool=matched; poolType='matched'; }
  else if (safeFallback.length>0){ pool=safeFallback; poolType='safeFallback'; }
  else { pool=getRouteFallback(routeId); poolType='routeFallback'; if(!pool.length){ pool=candidates; poolType='candidates'; } }
  if (!pool || pool.length===0){ pool=candidates; poolType='candidates'; }
  var scored = pool.map(sp => { const f=finalScore(sp, scores); return { sp, f }; });

  // === insertion point: after order-decision score fixed, before ordering ===
  if (method === 'effective') applyEffective(scored);
  else if (method === 'hybrid') applyHybrid(scored, HYBRID_ALPHA);

  // sort + tie-break: IDENTICAL for both methods (unchanged)
  scored.sort((a,b) => {
    if (b.f.fs!==a.f.fs) return b.f.fs-a.f.fs;   // fs primary key: unchanged
    return tieBreakCompare(a, b, tiebreak);       // Variable-B: tie-break only
  });
  const top = scored.slice(0,3).map(x => ({
    name:x.sp.name, avail:x.sp.availability, diff:x.sp.difficulty, legal:x.sp.legal||null, size:x.sp.size,
    raw:round6(x.f.raw), norm:(x.f.norm!==undefined?round6(x.f.norm):null),
    aM:x.f.availMult, dM:x.f.diffMult, lM:x.f.legalMult, bM:x.f.budgetMult, oM:x.f.odorMult, fs:round6(x.f.fs)
  }));
  const fsList = scored.map(x => round6(x.f.fs));
  const tieGroups = {};
  fsList.forEach(v => { tieGroups[v]=(tieGroups[v]||0)+1; });
  const tieMembers = Object.values(tieGroups).filter(c => c>1).reduce((a,c)=>a+c,0);
  const fullOrder = scored.map(x => x.sp.name);
  const fullFs = scored.map(x => round6(x.f.fs));
  return { scores, beginner_mode, matchedCount:matched.length, poolType, poolSize:pool.length, top3:top, tieMembers, fullOrder, fullFs };
}

// ---- Golden18 cases (verbatim from dryrun; NOT modified) ----
const CASES = [
  { id:'GS-LAND-01', route:'land', purpose:'初心者・小型・低予算・地中海定番', ans:[0,0,0,0,0, 0,2] },
  { id:'GS-LAND-02', route:'land', purpose:'経験者・大型・高予算・個性派', ans:[2,2,0,2,1, 3,3] },
  { id:'GS-LAND-03', route:'land', purpose:'中級・多湿・アジア志向（境界）', ans:[1,1,1,1,3, 1,1] },
  { id:'GS-LAND-04', route:'land', purpose:'初心者・臭い嫌悪・草食可否中間', ans:[0,2,1,0,2, 1,0] },
  { id:'GS-AQUA-01', route:'aquatic', purpose:'初心者・小型水槽・定番・低予算', ans:[0,0,0,0,0,0,0,0, 0,1] },
  { id:'GS-AQUA-02', route:'aquatic', purpose:'経験者・大型水槽・希少ドロ・臭い許容', ans:[2,0,2,2,3,1,2,2, 3,3] },
  { id:'GS-AQUA-03', route:'aquatic', purpose:'定番大型・臭い嫌悪（invasive抑制検証）', ans:[2,0,1,1,0,0,0,1, 3,0] },
  { id:'GS-AQUA-04', route:'aquatic', purpose:'美種チズガメ・中級・中予算', ans:[1,1,2,1,1,2,0,0, 1,1] },
  { id:'GS-AQUA-05', route:'aquatic', purpose:'日本産・イシガメ系・涼しい環境', ans:[1,0,0,2,2,2,1,0, 2,1] },
  { id:'GS-FRST-01', route:'forest', purpose:'初心者・小型・北米ハコガメ・臭い嫌悪', ans:[0,0,0,0,0, 1,0] },
  { id:'GS-FRST-02', route:'forest', purpose:'経験者・多湿冷却・ヤマガメ系', ans:[2,1,1,2,2, 2,2] },
  { id:'GS-FRST-03', route:'forest', purpose:'中間・アジアハコガメ・境界', ans:[1,2,2,1,1, 1,1] },
  { id:'GS-EXOT-01', route:'exotic', purpose:'経験者・ソフトシェル・低予算', ans:[0,0,0,0, 1,3] },
  { id:'GS-EXOT-02', route:'exotic', purpose:'上級・曲頸類・超希少・最大予算', ans:[2,2,2,2, 3,0] },
  { id:'GS-EXOT-03', route:'exotic', purpose:'経験者・ソフトシェル・最低予算（予算ペナルティ検証）', ans:[0,0,0,0, 0,0] },
  { id:'GS-ALL-01', route:'all', purpose:'全ルート横断・初心者・水棲小型', ans:[0,0,0,1,1,0, 0,1] },
  { id:'GS-ALL-02', route:'all', purpose:'全ルート横断・リクガメ大型・経験者', ans:[2,2,0,0,1,2, 3,2] },
  { id:'GS-ALL-03', route:'all', purpose:'全ルート横断・半陸棲・希少志向・中級', ans:[1,1,1,1,2,1, 2,1] },
];

// ---- run comparison ----
function fmtTop(t){
  if (!t || t.raw===undefined) return (t&&t.name)||'-';
  const normStr = t.norm!==null && t.norm!==undefined ? ` norm=${t.norm}` : '';
  return `${t.name} | raw=${t.raw}${normStr} => fs=${t.fs} [${t.avail}/${t.diff}/${t.legal}/${t.size}]`;
}

// ========================================================================
// Variable-B tie-break comparison mode (--vb): none fixed, compare A vs E vs B
// ========================================================================
if (process.argv.includes('--vb')){
  console.log('=== Phase2 Step11 — Variable-B tie-break: A(current) vs E(composite) vs B(avail-first) ===');
  console.log('fixed: method=none (Variable-A adopted). fs primary key unchanged; only tie-break varies.');
  console.log('');
  let e_diff=0, b_diff=0, e_top1=0, b_top1=0, fsSeq_mismatch=0, pool_mismatch=0;
  const flagged = { 'GS-LAND-02':null, 'GS-ALL-03':null };
  for (const c of CASES){
    const A = evaluate(c.route, c.ans, 'none', 'A');
    const E = evaluate(c.route, c.ans, 'none', 'E');
    const B = evaluate(c.route, c.ans, 'none', 'B');
    // integrity: tie-break may reorder ONLY within equal-fs groups -> sorted fs sequence identical
    const fsA=JSON.stringify(A.fullFs), fsE=JSON.stringify(E.fullFs), fsB=JSON.stringify(B.fullFs);
    if (fsA!==fsE || fsA!==fsB) fsSeq_mismatch++;
    if (!(A.poolType===E.poolType && A.poolType===B.poolType && A.poolSize===E.poolSize && A.poolSize===B.poolSize)) pool_mismatch++;
    const t3 = r => r.top3.map(t=>t.name).join(' > ');
    const eOrderDiff = JSON.stringify(A.fullOrder)!==JSON.stringify(E.fullOrder);
    const bOrderDiff = JSON.stringify(A.fullOrder)!==JSON.stringify(B.fullOrder);
    const eTop1Diff = A.top3[0] && E.top3[0] && A.top3[0].name!==E.top3[0].name;
    const bTop1Diff = A.top3[0] && B.top3[0] && A.top3[0].name!==B.top3[0].name;
    if (eOrderDiff) e_diff++; if (bOrderDiff) b_diff++;
    if (eTop1Diff) e_top1++; if (bTop1Diff) b_top1++;
    // Top1 fs-tie group size (was Top1 decided by tie-break at all?)
    const top1fs = A.fullFs[0];
    const top1GroupSize = A.fullFs.filter(v=>v===top1fs).length;
    console.log('──────────────────────────────────────────');
    console.log(`${c.id} [${c.route}]  Top1-fs-tie-group=${top1GroupSize}`);
    console.log(`  A(current): ${t3(A)}`);
    console.log(`  E(composite): ${t3(E)}   ${eOrderDiff?'[order differs from A]':'[= A]'} ${eTop1Diff?'[TOP1 CHANGED]':''}`);
    console.log(`  B(avail-1st): ${t3(B)}   ${bOrderDiff?'[order differs from A]':'[= A]'} ${bTop1Diff?'[TOP1 CHANGED]':''}`);
    if (c.id in flagged) flagged[c.id]={A:t3(A),E:t3(E),B:t3(B),eOrderDiff,bOrderDiff,eTop1Diff,bTop1Diff,top1GroupSize};
  }
  console.log('──────────────────────────────────────────');
  console.log('=== SUMMARY (Variable-B tie-break, none fixed) ===');
  console.log(`cases total                 : ${CASES.length}`);
  console.log(`E differs from A (any order) : ${e_diff}   (TOP1 changed: ${e_top1})`);
  console.log(`B differs from A (any order) : ${b_diff}   (TOP1 changed: ${b_top1})`);
  console.log(`fs-sequence mismatch (must 0): ${fsSeq_mismatch}   (non-tie order preserved if 0)`);
  console.log(`POOL mismatch (must 0)       : ${pool_mismatch}`);
  console.log('');
  console.log('Flagged (name-decided-Top1 suspects):');
  for (const k of Object.keys(flagged)){
    const f=flagged[k]; if(!f){ console.log(`  ${k}: not found`); continue; }
    console.log(`  ${k}: Top1-fs-tie-group=${f.top1GroupSize}  A/E/B Top1 change: E=${f.eTop1Diff} B=${f.bTop1Diff}`);
    console.log(`     A: ${f.A}`);
    console.log(`     E: ${f.E}`);
    console.log(`     B: ${f.B}`);
  }
  process.exit(0);
}

const results = [];
let n_top1_changed=0, n_order_changed=0, n_top3set_changed=0, n_pool_mismatch=0, n_tie_up=0, n_tie_down=0, n_same=0;

// compare none vs TARGET method (default 'effective' for Step6 reproducibility)
const _mi = process.argv.indexOf('--method');
const TARGET = (_mi >= 0 && process.argv[_mi+1]) ? process.argv[_mi+1] : 'effective';
const TLABEL = TARGET.padEnd(9);

console.log(`=== Phase2 Variable-A: none vs ${TARGET} (Golden18) ===`);
console.log('route species counts:', ['land','aquatic','forest','exotic','all'].map(k => k+'='+(SPECIES[k]||[]).length).join(' '));
console.log('');

for (const c of CASES){
  const N = evaluate(c.route, c.ans, 'none');
  const E = evaluate(c.route, c.ans, TARGET);

  // integrity: effective must NOT change pool selection / match / 足切り (07 §7)
  const poolSame = (N.poolType===E.poolType) && (N.poolSize===E.poolSize) && (N.matchedCount===E.matchedCount);
  if (!poolSame) n_pool_mismatch++;

  const nNames = N.top3.map(t=>t.name).join(' > ');
  const eNames = E.top3.map(t=>t.name).join(' > ');
  const top1Changed = (N.top3[0]&&N.top3[0].name) !== (E.top3[0]&&E.top3[0].name);
  const orderChanged = nNames !== eNames;
  const set = a => a.map(t=>t.name).filter(Boolean).sort().join('|');
  const top3setChanged = set(N.top3) !== set(E.top3);
  // full-order change (beyond top3)
  const fullOrderChanged = JSON.stringify(N.fullOrder)!==JSON.stringify(E.fullOrder);

  if (top1Changed) n_top1_changed++;
  if (fullOrderChanged) n_order_changed++;
  if (top3setChanged) n_top3set_changed++;
  if (E.tieMembers > N.tieMembers) n_tie_up++;
  else if (E.tieMembers < N.tieMembers) n_tie_down++;
  if (!orderChanged && !top3setChanged && E.tieMembers===N.tieMembers) n_same++;

  let verdict;
  if (!poolSame) verdict='POOL-MISMATCH(!!)';
  else if (top1Changed) verdict='TOP1-CHANGED';
  else if (orderChanged) verdict='REORDER(top3)';
  else if (fullOrderChanged) verdict='REORDER(below-top3)';
  else if (E.tieMembers!==N.tieMembers) verdict='TIE-ONLY-CHANGED';
  else verdict='SAME';

  console.log('──────────────────────────────────────────');
  console.log(`${c.id} [${c.route}] ${c.purpose}`);
  console.log(`  pool: none=${N.poolType}(${N.poolSize}) ${TARGET}=${E.poolType}(${E.poolSize}) matched none=${N.matchedCount}/tgt=${E.matchedCount}  poolSame=${poolSame}`);
  console.log(`  tieMembers: none=${N.tieMembers} ${TARGET}=${E.tieMembers}`);
  console.log(`  none      : ${N.top3.map(fmtTop).join('  ||  ')}`);
  console.log(`  ${TLABEL}: ${E.top3.map(fmtTop).join('  ||  ')}`);
  console.log(`  => VERDICT: ${verdict}`);

  results.push({
    case_id:c.id, route:c.route, purpose:c.purpose, verdict,
    poolSame, none_poolType:N.poolType, eff_poolType:E.poolType,
    none_matched:N.matchedCount, eff_matched:E.matchedCount,
    none_tieMembers:N.tieMembers, eff_tieMembers:E.tieMembers,
    none_top3:N.top3, effective_top3:E.top3,
    none_fullOrder:N.fullOrder, effective_fullOrder:E.fullOrder,
    top1_changed:top1Changed, order_changed:fullOrderChanged, top3set_changed:top3setChanged
  });
}

console.log('──────────────────────────────────────────');
console.log(`=== SUMMARY (none vs ${TARGET}) ===`);
console.log(`cases total            : ${CASES.length}`);
console.log(`SAME (no order/tie chg): ${n_same}`);
console.log(`TOP1 changed           : ${n_top1_changed}`);
console.log(`full order changed     : ${n_order_changed}`);
console.log(`top3 set changed       : ${n_top3set_changed}`);
console.log(`tie members increased  : ${n_tie_up}`);
console.log(`tie members decreased  : ${n_tie_down}`);
console.log(`POOL MISMATCH (must be 0): ${n_pool_mismatch}`);
console.log('');
console.log('Integrity: effective must not change pool/match/足切り (07 §7). POOL MISMATCH must be 0.');
console.log('Qualitative 改善/悪化 (妥当性・決定力・安定性 / 定性第3段階) is a human step per 05/04; this tool emits the objective diffs only.');

// ---- optional JSON snapshot ----
const emitIdx = process.argv.indexOf('--emit');
if (emitIdx >= 0 && process.argv[emitIdx+1]){
  const out = process.argv[emitIdx+1];
  const snapshot = {
    schema_version:'1.0', status:'VARIABLE-A EVAL (none vs effective)', scope:'shindan diagnosis',
    method_definition:'07-effective-method-definition-v1.0.md (min-max, range0->1, single->1)',
    insertion_point:'after order-decision score fixed, before ordering',
    unchanged:['Phase1 Stable','none baseline','tie-break(round6/recPri/avail/diff/name)','sort','Golden18 cases','multiplier values'],
    summary:{ total:CASES.length, same:n_same, top1_changed:n_top1_changed, full_order_changed:n_order_changed, top3set_changed:n_top3set_changed, tie_increased:n_tie_up, tie_decreased:n_tie_down, pool_mismatch:n_pool_mismatch },
    cases: results
  };
  fs.writeFileSync(out, JSON.stringify(snapshot, null, 2));
  console.log('WROTE', out);
}
