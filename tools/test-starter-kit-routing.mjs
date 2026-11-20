import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { test } from 'node:test';

const read = path => fs.readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const diagnosis = read('shindan/index.html');
const speciesPage = read('species/musk-turtle.html');
const nativeKey = speciesPage.match(/mountStarterKit\(\{ equipmentKey: '([^']+)'/)?.[1];
function fn(name) {
  const start = diagnosis.indexOf('function ' + name + '(');
  assert.ok(start >= 0, name);
  const end = diagnosis.indexOf('\n}', start);
  assert.ok(end > start, name);
  return diagnosis.slice(start, end + 2);
}

function fixture() {
  const kit = { innerHTML: '', style: { display: 'none' }, querySelectorAll: () => [] };
  const gaps = { innerHTML: '', appendChild() {} };
  const hits = { shown: [], events: [], loads: 0, warnings: [] };
  const context = vm.createContext({
    window: {
      location: { pathname: '/shindan/', search: '' },
      loadSpecies: async () => { hits.loads++; },
      loadResultAssets: async () => { hits.loads++; },
    },
    document: {
      getElementById: id => ({ 'starter-kit-section': kit, 'gate-stop-gap-list': gaps })[id] ?? null,
      createElement: () => ({}),
    },
    console: { warn: (...args) => hits.warnings.push(args) },
    gtag() {},
    ga4Event: (name, params) => hits.events.push({ name, params }),
    saveResultToUrl() {},
    calcMatchPercent: () => 100,
    show: id => hits.shown.push(id),
    LIFESPAN_DATA: {},
    hits,
  });
  const refOnly = diagnosis.match(/^  var refOnly = \(sp\.commerceAllowed[^\n]+/m)?.[0];
  const render = diagnosis.match(/^  if \(!refOnly\) \{ try \{ renderStarterKitV2\(sp\)[^\n]+\n  else [^\n]+/m)?.[0];
  assert.ok(refOnly && render, 'real result commerce gate');
  const run = js => vm.runInContext(js, context);
  for (const path of ['data/products.js', 'js/starter-kit.js', 'shindan/species.js']) run(read(path));
  run(['resolveEquipmentKey', 'renderStarterKitV2', 'computeReadiness',
    'finishQuiz', 'renderGateStop', 'calcResult'].map(fn).join('\n'));
  run(`
    var readinessAnswers = [], scores = {}, selectedRoute, result, _diagnosisCompleted, _lastRunnerUp, _lastCandidateCount;
    function showResult(sp) {
      hits.shown.push(sp.slug);
      ${refOnly}
      ${render}
    }
    var musk = SPECIES.aquatic.find(sp => sp.slug === 'musk-turtle');
  `);
  return { run, hits, kit };
}

function assertNativeMuskKit(run, hits, kit) {
  assert.equal(hits.shown.at(-1), 'musk-turtle');
  assert.equal(run("resolveEquipmentKey('aquatic', musk)"), nativeKey);
  assert.equal(run("result.equipmentKey || resolveEquipmentKey(selectedRoute.id, result)"), nativeKey);
  assert.equal(kit.style.display, '');
  const links = [...kit.innerHTML.matchAll(/class="sk-card-btn" href="([^"]+)"/g)].map(m => m[1]);
  assert.ok(links.length > 0, 'rendered kit has actual Amazon product links');
  assert.ok(links.every(url => /^https:\/\/www\.amazon\.co\.jp\/dp\/[A-Z0-9]{10}\/?\?tag=kamelife090e-22$/.test(url)));
  assert.ok(links.some(url => url.includes('/dp/B000NGQZU0')), 'canonical standard aquatic filter');
  return links;
}

test('ranking equipment CTA points to a real fragment and retains the same GA4 handler', () => {
  const ranking = read('ranking-beginner-top10.html');
  const links = [...ranking.matchAll(/<a href="([^"]+)" class="gear-btn-p"\s+onclick="([^"]+)"/g)];
  assert.equal(links.length, 1);
  const [, href, handler] = links[0];
  const [path, fragment] = href.split('#');
  assert.equal(path, 'species/russian-tortoise.html');
  assert.equal(fragment, 'starter-kit-root');
  assert.equal((read(path).match(/id="starter-kit-root"/g) || []).length, 1);
  assert.equal(handler, "(typeof gtag==='function')&&gtag('event','hard_cta_click',{source:'ranking_gear',destination:'russian_starter_kit'})");
});

test('readiness A proceeds to the normal canonical aquatic result', async () => {
  const { run, hits, kit } = fixture();
  run("selectedRoute = { id: 'aquatic', species: [musk] }; finishQuiz();");
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(hits.events[0]?.params.verdict, 'A');
  assert.equal(hits.loads, 2);
  assertNativeMuskKit(run, hits, kit);
  assert.equal(run('result === musk'), true);
});

for (const [name, setup] of [
  ['exotic beginner, existing aquatic candidate', "selectedRoute = { id: 'exotic', species: SPECIES.exotic }; scores = { beginner: 2 };"],
  ['exotic beginner, no eligible aquatic candidate', "selectedRoute = { id: 'exotic', species: SPECIES.exotic }; scores = { beginner: 2 }; SPECIES.aquatic.length = 0;"],
  ['generic fallback when no result resolves', "SPECIES.exotic.length = 0; selectedRoute = { id: 'exotic', species: [] };"],
]) {
  test(name + ' uses the same aquatic cards as the normal result', () => {
    const normal = fixture();
    normal.run("selectedRoute = { id: 'aquatic', species: [musk] }; calcResult();");
    const actual = fixture();
    actual.run(setup + ' calcResult();');
    assert.deepEqual(assertNativeMuskKit(actual.run, actual.hits, actual.kit),
      assertNativeMuskKit(normal.run, normal.hits, normal.kit));
    assert.equal(actual.run('musk.equipmentKey'), undefined, 'seed species remains unchanged');
    assert.equal(actual.run('musk.equipmentRoute'), undefined, 'native route hint is local to the copy');
    assert.equal(actual.run("resolveEquipmentKey('exotic', musk)"), 'fully_aquatic', 'unhinted exotic resolver is unchanged');
    assert.equal(actual.run('selectedRoute.id'), 'exotic', 'analytics route remains unchanged');
  });
}

test('readiness STOP prevents results, product loads and commerce even on exotic beginner answers', async () => {
  const { run, hits, kit } = fixture();
  run("selectedRoute = { id: 'exotic', species: SPECIES.exotic }; scores = { beginner: 2 }; readinessAnswers = [{q:'housing', kind:'blocker'}, {q:'care', kind:'blocker'}]; finishQuiz();");
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(hits.shown, ['screen-gate-stop']);
  assert.equal(hits.events[0]?.params.verdict, 'C');
  assert.equal(hits.loads, 0);
  assert.equal(kit.innerHTML, '');
  const stop = diagnosis.match(/<section id="screen-gate-stop"[\s\S]*?<\/section>/)?.[0];
  assert.ok(stop);
  assert.doesNotMatch(stop, /amazon\.co\.jp|rakuten\.co\.jp|amzn\.to|starter-kit/);
});

test('reference-only and commerce-disallowed species keep their kits hidden', () => {
  for (const gate of ["availability: 'reference_only'", "commerceAllowed: false"]) {
    const { run, kit } = fixture();
    run("selectedRoute = { id:'aquatic' }; showResult({ ...musk, " + gate + " });");
    assert.equal(kit.style.display, 'none', gate);
    assert.equal(kit.innerHTML, '');
  }
});
