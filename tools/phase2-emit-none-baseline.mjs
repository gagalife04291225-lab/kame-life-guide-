// tools/phase2-emit-none-baseline.mjs
// Emits the none baseline snapshot JSON for the shindan diagnosis Phase2.
// Does NOT reimplement ranking logic: it imports CASES + evaluate from the
// (unmodified) dryrun evaluator by re-reading it, and re-runs evaluate() to
// capture structured results. Reads real shindan data files. Read-only.
import fs from 'fs';
import vm from 'vm';
import crypto from 'crypto';
import { execSync } from 'child_process';

function sha256(path){ return crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex'); }

// Load the dryrun evaluator source and evaluate it in a context that captures
// its internal CASES + evaluate() without running its console output loop.
// We do this by reading the dryrun file, stripping its trailing runner (the
// part after the CASES array that only console.logs), and exposing CASES+evaluate.
const dry = fs.readFileSync('tools/phase2-golden18-dryrun.mjs','utf8');

// The dryrun is ESM using import fs/vm. We cannot vm-run ESM imports easily,
// so instead we replicate ONLY the data loading + call its exported pieces.
// Simplest faithful approach: dynamically import the dryrun as a module is not
// possible (it self-runs). So we re-derive by importing species/routes and
// re-using the SAME evaluate by extracting the function bodies is fragile.
// Instead: run the dryrun as a child process, capture stdout, and parse it.
const raw = execSync('node tools/phase2-golden18-dryrun.mjs', {encoding:'utf8', maxBuffer:10*1024*1024});

// ---- parse structured stdout ----
const lines = raw.split('\n');
const head = execSync('git rev-parse HEAD',{encoding:'utf8'}).trim();
const cases = [];
let cur = null;
const caseHeaderRe = /^(GS-[A-Z]+-\d+) \[(\w+)\] (.+)$/;
const ansRe = /^\s*answers=\[([^\]]*)\] \(len (\d+)\/(\d+) (OK|LEN-MISMATCH!)\)/;
const scoresRe = /^\s*scores=(\{.*\})$/;
const metaRe = /^\s*beginner_mode=(\w+)\s+matched=(\d+)\s+pool=(\w+)\((\d+)\)\s+tieMembers=(\d+)/;
const topRe = /^\s*(Top[123]): (.+?) \| raw=([\-\d.]+) aM=([\d.]+) dM=([\d.]+) lM=([\d.]+) bM=([\d.]+) oM=([\d.]+) => fs=([\-\d.]+) \[([^\/]*)\/([^\/]*)\/([^\/]*)\/([^\]]*)\]/;
const topFallbackRe = /^\s*(Top[123]): (.+)$/;
for (const ln of lines){
  let m;
  if ((m = ln.match(caseHeaderRe))){
    cur = { case_id:m[1], route:m[2], purpose:m[3], top3:[] };
    cases.push(cur); continue;
  }
  if (!cur) continue;
  if ((m = ln.match(ansRe))){ cur.answers = m[1].split(',').map(s=>parseInt(s.trim(),10)); cur.len=parseInt(m[2]); cur.expectedLen=parseInt(m[3]); cur.lenOk=(m[4]==='OK'); continue; }
  if ((m = ln.match(scoresRe))){ try{ cur.scores=JSON.parse(m[1]); }catch(e){ cur.scores_raw=m[1]; } continue; }
  if ((m = ln.match(metaRe))){ cur.beginner_mode=(m[1]==='true'); cur.matched=parseInt(m[2]); cur.poolType=m[3]; cur.poolSize=parseInt(m[4]); cur.tieMembers=parseInt(m[5]); continue; }
  if ((m = ln.match(topRe))){
    cur.top3.push({ rank:m[1], name:m[2], raw:parseFloat(m[3]), availMult:parseFloat(m[4]), diffMult:parseFloat(m[5]), legalMult:parseFloat(m[6]), budgetMult:parseFloat(m[7]), odorMult:parseFloat(m[8]), finalScore:parseFloat(m[9]), availability:m[10], difficulty:m[11], legal:(m[12]==='null'?null:m[12]), size:m[13] });
    continue;
  }
  if ((m = ln.match(topFallbackRe)) && cur.top3.length<3 && !ln.includes('raw=')){
    cur.top3.push({ rank:m[1], name:m[2].trim() }); continue;
  }
}

const snapshot = {
  schema_version: '1.0',
  status: 'BASELINE SNAPSHOT',
  normalization_method: 'none',
  scope: 'shindan diagnosis',
  generated_from: {
    branch: 'main',
    head,
    evaluator: 'tools/phase2-golden18-dryrun.mjs',
    files: {
      'shindan/index.html': { sha256: sha256('shindan/index.html') },
      'shindan/species.js': { sha256: sha256('shindan/species.js') },
      'shindan/routes.js': { sha256: sha256('shindan/routes.js') },
      'tools/phase2-golden18-dryrun.mjs': { sha256: sha256('tools/phase2-golden18-dryrun.mjs') }
    }
  },
  ordering_rule: {
    ranking_path: 'shindan/index.html finalScore = raw * availMult * diffMult * legalMult * budgetMult * odorMult',
    tie_breakers: ['finalScore desc (6-digit)', 'recommendationPriority desc', 'availability common>rare>archive', 'difficulty easy first', 'name localeCompare ja'],
    tie_rounding: '6-digit'
  },
  audit_notes: [
    'exotic route has no answer adding the beginner tag; beginner_mode=true unreachable in normal operation, so routeId===exotic && beginner_mode fallback is unreachable.',
    'GS-EXOT-03 purpose relabeled to budget-penalty verification (fallback unreachable).',
    'ranking-engine (js/ranking-engine.js) is a SEPARATE system not used by shindan/; its baseline docs/phase2/baselines/none-baseline-main-454f4c1.json is unrelated to this snapshot.'
  ],
  case_distribution: cases.reduce((a,c)=>{a[c.route]=(a[c.route]||0)+1;return a;},{}),
  case_count: cases.length,
  cases
};

const OUT = 'docs/phase2/baselines/shindan-none-golden18-0bb3185.json';
fs.mkdirSync('docs/phase2/baselines', {recursive:true});
fs.writeFileSync(OUT, JSON.stringify(snapshot, null, 2));
console.log('WROTE', OUT);
console.log('case_count', snapshot.case_count);
console.log('distribution', JSON.stringify(snapshot.case_distribution));
console.log('head', snapshot.generated_from.head);
