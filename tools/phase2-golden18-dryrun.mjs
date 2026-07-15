// tools/phase2-golden18-dryrun.mjs
// Phase2 evaluation infra — NOT production diagnosis logic.
// Faithfully reproduces shindan/index.html lines 2327-2609 ranking path,
// reading real shindan/species.js and shindan/routes.js.
// none baseline only. No normalize. Read-only against production files.
import fs from 'fs';
import vm from 'vm';

// ---- load real data ----
const speciesSrc = fs.readFileSync('shindan/species.js', 'utf8');
const routesSrc  = fs.readFileSync('shindan/routes.js', 'utf8');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(speciesSrc + '\n' + routesSrc + '\nthis.__S=SPECIES; this.__R=ROUTES;', ctx);
const SPECIES = ctx.__S, ROUTES = ctx.__R;
const routeById = {}; ROUTES.forEach(r => routeById[r.id] = r);

// ---- reproduce applyAllRouteTagCompat (index.html) ----
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

// ---- aggregate answers into scores (selectChoice reproduction) ----
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

// ---- finalScore reproduction (index.html Step 5) ----
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

// ---- full calcResult reproduction ----
const DIFF_ORDER={'入門':0,'入門〜中級':1,'中級':2,'中〜上級':3,'上級':4};
const AVAIL_ORDER={'common':0,'rare':1,'archive':2};
function diffOrder(sp){ var d=sp.difficulty||''; for(var k in DIFF_ORDER){ if(d===k) return DIFF_ORDER[k]; } return 99; }

function evaluate(routeId, answers){
  const route = routeById[routeId];
  const scores = aggregate(route, answers);
  if (routeId==='all') applyAllRouteTagCompat(scores);
  var candidates = (route.species||[]).filter(sp => sp.availability!=='archive' && sp.availability!=='redirect' && sp.availability!=='exclude' && sp.legal!=='unknown_hold');
  if (candidates.length===0) candidates = (route.species||[]);
  var beginner_mode = (scores.beginner||0) >= 2;
  var poolType, best, top3=[];
  // exotic beginner fallback
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
  scored.sort((a,b) => {
    if (b.f.fs!==a.f.fs) return b.f.fs-a.f.fs;
    var pa=(a.sp.recommendationPriority||0), pb=(b.sp.recommendationPriority||0);
    if (pb!==pa) return pb-pa;
    var aa=AVAIL_ORDER[a.sp.availability]!==undefined?AVAIL_ORDER[a.sp.availability]:1;
    var ab=AVAIL_ORDER[b.sp.availability]!==undefined?AVAIL_ORDER[b.sp.availability]:1;
    if (aa!==ab) return aa-ab;
    if (diffOrder(a.sp)!==diffOrder(b.sp)) return diffOrder(a.sp)-diffOrder(b.sp);
    return (a.sp.name||'').localeCompare(b.sp.name||'','ja');
  });
  const top = scored.slice(0,3).map(x => ({
    name:x.sp.name, avail:x.sp.availability, diff:x.sp.difficulty, legal:x.sp.legal||null, size:x.sp.size,
    raw:round6(x.f.raw), aM:x.f.availMult, dM:x.f.diffMult, lM:x.f.legalMult, bM:x.f.budgetMult, oM:x.f.odorMult, fs:round6(x.f.fs)
  }));
  // tie key: finalScore rounded to 6 -> group
  const fsList = scored.map(x => round6(x.f.fs));
  const tieGroups = {};
  fsList.forEach(v => { tieGroups[v]=(tieGroups[v]||0)+1; });
  const tieMembers = Object.values(tieGroups).filter(c => c>1).reduce((a,c)=>a+c,0);
  return { scores, beginner_mode, matchedCount:matched.length, poolType, poolSize:pool.length, top3:top, tieMembers, tieKey:'finalScore6->recPri->avail->diff->name' };
}
function round6(x){ return Math.round(x*1e6)/1e6; }

// ---- 18 golden case candidates (Phase2 NEW definitions, not restored) ----
// answer index arrays are per-question (0-based). Length must match route.questions.length.
// land=7 (5 route + 2 common), aquatic=10 (8+2), forest=7 (5+2), exotic=6 (4+2), all=8 (6+2)
const CASES = [
  // ---- land (4) ----
  { id:'GS-LAND-01', route:'land', purpose:'初心者・小型・低予算・地中海定番', ans:[0,0,0,0,0, 0,2] },
  { id:'GS-LAND-02', route:'land', purpose:'経験者・大型・高予算・個性派', ans:[2,2,0,2,1, 3,3] },
  { id:'GS-LAND-03', route:'land', purpose:'中級・多湿・アジア志向（境界）', ans:[1,1,1,1,3, 1,1] },
  { id:'GS-LAND-04', route:'land', purpose:'初心者・臭い嫌悪・草食可否中間', ans:[0,2,1,0,2, 1,0] },
  // ---- aquatic (5) ----
  { id:'GS-AQUA-01', route:'aquatic', purpose:'初心者・小型水槽・定番・低予算', ans:[0,0,0,0,0,0,0,0, 0,1] },
  { id:'GS-AQUA-02', route:'aquatic', purpose:'経験者・大型水槽・希少ドロ・臭い許容', ans:[2,0,2,2,3,1,2,2, 3,3] },
  { id:'GS-AQUA-03', route:'aquatic', purpose:'定番大型・臭い嫌悪（invasive抑制検証）', ans:[2,0,1,1,0,0,0,1, 3,0] },
  { id:'GS-AQUA-04', route:'aquatic', purpose:'美種チズガメ・中級・中予算', ans:[1,1,2,1,1,2,0,0, 1,1] },
  { id:'GS-AQUA-05', route:'aquatic', purpose:'日本産・イシガメ系・涼しい環境', ans:[1,0,0,2,2,2,1,0, 2,1] },
  // ---- forest (3) ----
  { id:'GS-FRST-01', route:'forest', purpose:'初心者・小型・北米ハコガメ・臭い嫌悪', ans:[0,0,0,0,0, 1,0] },
  { id:'GS-FRST-02', route:'forest', purpose:'経験者・多湿冷却・ヤマガメ系', ans:[2,1,1,2,2, 2,2] },
  { id:'GS-FRST-03', route:'forest', purpose:'中間・アジアハコガメ・境界', ans:[1,2,2,1,1, 1,1] },
  // ---- exotic (3) ----
  { id:'GS-EXOT-01', route:'exotic', purpose:'経験者・ソフトシェル・低予算', ans:[0,0,0,0, 1,3] },
  { id:'GS-EXOT-02', route:'exotic', purpose:'上級・曲頸類・超希少・最大予算', ans:[2,2,2,2, 3,0] },
  { id:'GS-EXOT-03', route:'exotic', purpose:'経験者・ソフトシェル・最低予算（予算ペナルティ検証）', ans:[0,0,0,0, 0,0], note:'beginner無しなので通常経路想定' },
  // ---- all (3) ----
  { id:'GS-ALL-01', route:'all', purpose:'全ルート横断・初心者・水棲小型', ans:[0,0,0,1,1,0, 0,1] },
  { id:'GS-ALL-02', route:'all', purpose:'全ルート横断・リクガメ大型・経験者', ans:[2,2,0,0,1,2, 3,2] },
  { id:'GS-ALL-03', route:'all', purpose:'全ルート横断・半陸棲・希少志向・中級', ans:[1,1,1,1,2,1, 2,1] },
];

console.log('=== Phase2 Golden18 DRY-RUN (none baseline, NEW candidates) ===');
console.log('route species counts:', ['land','aquatic','forest','exotic','all'].map(k => k+'='+(SPECIES[k]||[]).length).join(' '));
console.log('');
let dist = {};
for (const c of CASES){
  dist[c.route]=(dist[c.route]||0)+1;
  const route = routeById[c.route];
  const expLen = route.questions.length;
  const okLen = c.ans.length===expLen;
  const r = evaluate(c.route, c.ans);
  console.log('──────────────────────────────────────────');
  console.log(`${c.id} [${c.route}] ${c.purpose}`);
  console.log(`  answers=[${c.ans.join(',')}] (len ${c.ans.length}/${expLen} ${okLen?'OK':'LEN-MISMATCH!'})`);
  console.log(`  scores=${JSON.stringify(r.scores)}`);
  console.log(`  beginner_mode=${r.beginner_mode}  matched=${r.matchedCount}  pool=${r.poolType}(${r.poolSize||0})  tieMembers=${r.tieMembers||0}`);
  const labels=['Top1','Top2','Top3'];
  (r.top3||[]).forEach((t,i) => {
    if (t.name && t.raw!==undefined)
      console.log(`  ${labels[i]}: ${t.name} | raw=${t.raw} aM=${t.aM} dM=${t.dM} lM=${t.lM} bM=${t.bM} oM=${t.oM} => fs=${t.fs} [${t.avail}/${t.diff}/${t.legal}/${t.size}]`);
    else
      console.log(`  ${labels[i]}: ${t.name||'-'}`);
  });
}
console.log('──────────────────────────────────────────');
console.log('case distribution:', JSON.stringify(dist), 'total=', CASES.length);
