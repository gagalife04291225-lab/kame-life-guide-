
const https = require('https');

const WORKER = 'https://kame-ai-worker.gagalife04291225.workers.dev/intent';

function post(payload, label) {
  return new Promise(resolve => {
    const body = JSON.stringify(payload);
    const url = new URL(WORKER);
    const opts = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'Origin': 'https://gagalife04291225-lab.github.io',
      }
    };
    const req = https.request(opts, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => {
        let r; try { r = JSON.parse(d); } catch(e) { r = {_raw: d.slice(0,100)}; }
        console.log('['+label+'] HTTP='+res.statusCode);
        console.log('  intent:     '+(r.intent||'—'));
        console.log('  species:    '+(r.species||'—'));
        console.log('  confidence: '+(r.confidence||'—'));
        console.log('  ga4_event:  '+(r.ga4_event||'—'));
        console.log('  fallback:   '+(r.fallback||false));
        if (r._raw) console.log('  raw: '+r._raw);
        resolve(r);
      });
    });
    req.on('error', e => { console.log('['+label+'] NET_ERR: '+e.message); resolve({}); });
    req.setTimeout(8000, () => { req.destroy(); console.log('['+label+'] TIMEOUT'); resolve({}); });
    req.write(body);
    req.end();
  });
}

(async () => {
  // Case A: high-confidence beginner water turtle
  await post({
    answers: {q1:'beginner', q2:'water', q3:'small', q4:'easy', q5:'low_cost'},
    species_hint: 'musk_turtle'
  }, 'Case_A_high_confidence');

  await new Promise(r => setTimeout(r, 600));

  // Case B: ambiguous mixed signals
  await post({
    answers: {q1:'intermediate', q2:'any', q3:'medium'},
    species_hint: null
  }, 'Case_B_ambiguous');

  await new Promise(r => setTimeout(r, 600));

  // Case C: 404 endpoint → should return non-200
  const url404 = new URL('https://kame-ai-worker.gagalife04291225.workers.dev/nonexistent');
  await new Promise(resolve => {
    const req = https.request({
      hostname: url404.hostname, path: url404.pathname, method: 'POST',
      headers: {'Content-Type':'application/json','Content-Length':2,'Origin':'https://gagalife04291225-lab.github.io'}
    }, res => {
      console.log('[Case_C_fallback] HTTP='+res.statusCode+' → client fallback to button flow');
      resolve();
    });
    req.on('error', e => { console.log('[Case_C_fallback] ERR='+e.message+' → fallback OK'); resolve(); });
    req.write('{}');
    req.end();
  });

  console.log('[SMOKE_DONE]');
})();
