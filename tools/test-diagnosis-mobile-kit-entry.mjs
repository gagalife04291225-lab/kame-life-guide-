import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { test } from 'node:test';

const read = path => fs.readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const html = read('shindan/index.html');
function extract(name) {
  const start = html.indexOf('function ' + name + '(');
  const end = html.indexOf('\n}', start);
  assert.ok(start >= 0 && end > start, name);
  return html.slice(start, end + 2);
}

const ids = ['result-kit-jump', 'commerce-lead', 'res-cta-top-cost-note', 'res-cta-top-link-sec', 'res-cta-secondary'];

test('a native, focusable content jump follows the result badges and lands before kit and commerce', () => {
  const order = ['smart-badges', 'result-kit-jump', 'why-section', 'important-notice', 'res-legal',
    'commerce-lead', 'species-equipment-conditions', 'starter-kit-section', 'res-cta-top', 'res-cta-block'];
  const indices = order.map(id => {
    const matches = [...html.matchAll(new RegExp('id="' + id + '"', 'g'))];
    assert.equal(matches.length, 1, id);
    return matches[0].index;
  });
  assert.deepEqual(indices, indices.toSorted((a, b) => a - b));
  assert.match(html, /<a class="result-kit-jump" id="result-kit-jump" href="#important-notice" hidden>飼う前の注意と、用品・費用を見る<\/a>/);
  assert.match(html, /id="important-notice" tabindex="-1" role="region" aria-labelledby="important-notice-title"/);
  assert.match(html, /id="starter-kit-section" tabindex="-1"/);
  assert.match(html, /#important-notice,\s*#starter-kit-section\s*\{\s*scroll-margin-top:\s*calc\(var\(--klg-nav-h, 52px\) \+ 12px\)/);
  assert.match(html, /\.result-kit-jump:focus-visible,\s*#important-notice:focus-visible/);
  assert.match(html, /\.result-kit-jump:not\(\[hidden\]\)[\s\S]*?min-height: 44px/);
  assert.match(html, /<div class="commerce-lead" id="commerce-lead" hidden>/);
});

test('both lower kit link targets persist and wording fits land or aquatic results', () => {
  assert.equal((html.match(/飼育用品と費用の目安を見る/g) || []).length, 2);
  assert.doesNotMatch(html, /最初に必要な水槽・ライト・餌を見る/);
  for (const [id, variable] of [['res-cta-top-link-sec', 'skUrlTop'], ['res-cta-secondary', 'skUrl']]) {
    assert.match(html, new RegExp("var " + variable + "\\s*= '#starter-kit-section'"));
    assert.ok(html.includes('id="' + id + '" href="\' + ' + variable + ' + \'" hidden>'));
    assert.ok(html.includes("document.getElementById('" + id + "')"));
  }
  assert.match(html, /#res-cta-top-link-sec\[hidden\],\s*#res-cta-secondary\[hidden\]\s*\{\s*display: none/);
});

function fixture() {
  const kit = { style: { display: 'none' }, innerHTML: '', querySelectorAll: () => [],
    querySelector(selector) {
      assert.equal(selector, '.sk-card');
      return this.innerHTML.includes('class="sk-card"') || /class="sk-card\s/.test(this.innerHTML) ? {} : null;
    },
  };
  const notices = { HTML: '既存の注意・法令・飼育条件' };
  const nodes = Object.fromEntries(ids.map(id => [id, { hidden: true }]));
  const screens = ['screen-result', 'screen-start', 'screen-gate-stop'];
  const screenNodes = Object.fromEntries(screens.map(id =>
    [id, { classList: { add: type => calls.shown.push([id, type]), remove() {} } }]));
  const calls = { shown: [], loads: 0, warnings: [], ga: [], finalUrl: '', scroll: [] };
  const loc = { pathname: '/shindan/', search: '', href: '' };
  const run = ((context) => js => vm.runInContext(js, context))(vm.createContext({
    URL, location: loc, history: { replaceState: (a, b, u) => { calls.finalUrl = u; } },
    window: { location: loc, scrollTo: (...args) => calls.scroll.push(args),
      loadSpecies: async () => { calls.loads++; }, loadResultAssets: async () => { calls.loads++; } },
    document: {
      getElementById: id => ({...nodes, ...screenNodes, 'starter-kit-section': kit, 'important-notice': notices})[id] ?? null,
      querySelectorAll: () => Object.values(screenNodes),
    },
    ga4Event: (...a) => calls.ga.push(a), gtag() {},
    console: { warn: (...args) => calls.warnings.push(args) },
    LIFESPAN_DATA: {},
  }));
  for (const path of ['data/products.js', 'js/starter-kit.js', 'shindan/species.js']) run(read(path));
  run(['resolveEquipmentKey', 'renderStarterKitV2', 'setResultKitNavigation', 'resetResultKitNavigation',
    'showRenderedResultKitNavigation', 'show', 'clearResultUrl', 'computeReadiness',
    'finishQuiz', 'renderGateStop', 'resetToStart'].map(extract).join('\n'));
  const result = extract('showResult');
  const initial = result.match(/^  resetResultKitNavigation\(\);$/m)?.[0];
  const ref = result.match(/^  var refOnly = .*;$/m)?.[0];
  const final = result.match(/^  if \(!refOnly\) \{ try \{ renderStarterKitV2\(sp\)[^\n]+\n  else [^\n]+\n  showRenderedResultKitNavigation\(\);$/m)?.[0];
  assert.ok(initial && ref && final, 'invoke the production commerce-reset and render sequence');
  run(`
    var readinessAnswers = [], scores = {}, selectedRoute, currentQuestionIndex, answerHistory, gateIndex, _diagnosisCompleted;
    var musk = SPECIES.aquatic.find(sp => sp.slug === 'musk-turtle');
    var hermann = SPECIES.land.find(sp => sp.slug === 'hermann-tortoise');
    var actualMount = mountStarterKit;
    function runResult(sp) {
      ${initial}
      ${ref}
      show('screen-result');
      ${final}
    }
  `);
  return { run, kit, nodes, notices, calls, loc };
}

function visible(f, expected) {
  assert.deepEqual(Object.values(f.nodes).map(n => n.hidden), ids.map(() => !expected));
  assert.equal(f.kit.style.display, expected ? '' : 'none');
  assert.equal(f.notices.HTML, '既存の注意・法令・飼育条件');
}

test('real land and aquatic kit renders expose the entry; each keeps the existing tier scope and links', () => {
  const f = fixture();
  for (const [route, species] of [['land', 'hermann'], ['aquatic', 'musk']]) {
    f.run("selectedRoute = { id: '" + route + "' }; runResult(" + species + ");");
    visible(f, true);
    assert.match(f.kit.innerHTML, /標準価格帯の候補合計/);
    assert.match(f.kit.innerHTML, /飼育開始にかかる総額ではありません/);
    assert.match(f.kit.innerHTML, /別売の照明器具・取り付け用品/);
    assert.match(f.kit.innerHTML, /sk-panel-essential/);
    assert.match(f.kit.innerHTML, /sk-panel-comfort/);
    assert.match(f.kit.innerHTML, /tag=kamelife090e-22/);
  }
  assert.equal(f.calls.warnings.length, 0);
});

test('failed and empty kits and reference-only result cannot reuse a previously rendered offer', () => {
  const f = fixture();
  f.run("selectedRoute = { id: 'aquatic' }; runResult(musk);");
  visible(f, true);
  f.run('mountStarterKit = undefined; runResult(musk);');
  visible(f, false);
  assert.equal(f.kit.innerHTML, '');
  f.run("mountStarterKit = actualMount; runResult({ ...musk, equipmentKey: 'empty-fixture' });");
  visible(f, false);
  f.run('runResult(musk);');
  visible(f, true);
  for (const gate of ["availability: 'reference_only'", "commerceAllowed: false"]) {
    f.run('runResult({ ...musk, ' + gate + ' });');
    visible(f, false);
    assert.equal(f.kit.innerHTML, '');
    f.run('runResult(musk);');
    visible(f, true);
  }
});

test('rerun clears only result fragments and actual readiness STOP never loads the kit', async () => {
  const f = fixture();
  f.run("selectedRoute = { id: 'aquatic' }; runResult(musk);");
  f.loc.href = 'https://kamelifeguide.test/shindan/?r=aquatic&s=test&source=keep#important-notice';
  f.run('resetToStart();');
  visible(f, false);
  assert.equal(f.kit.innerHTML, '');
  assert.equal(f.calls.finalUrl, 'https://kamelifeguide.test/shindan/?source=keep');
  f.loc.href = 'https://kamelifeguide.test/shindan/?r=aquatic&s=test#other';
  f.run('clearResultUrl();');
  assert.equal(f.calls.finalUrl, 'https://kamelifeguide.test/shindan/#other');
  f.run("selectedRoute = { id: 'aquatic' }; runResult(musk); readinessAnswers = [{q:'housing', kind:'blocker'}, {q:'care', kind:'blocker'}]; finishQuiz();");
  await new Promise(resolve => setImmediate(resolve));
  visible(f, false);
  assert.equal(f.kit.innerHTML, '');
  assert.deepEqual(f.calls.shown.at(-1), ['screen-gate-stop', 'active']);
  assert.equal(f.calls.loads, 0);
  assert.equal(f.calls.ga.at(-1)[1].verdict, 'C');
});

test('only the cost heading and price note get a readable diagnosis-only foreground', () => {
  assert.match(html, /#screen-result \.sk-cost-box \.sk-cost-title,\s*#screen-result \.sk-cost-box \.sk-cost-note \{ color: var\(--parchment-dark\); \}/);
  const palette = variable => {
    const hex = html.match(new RegExp('--' + variable + ': #([a-f0-9]{6});'))?.[1];
    assert.ok(hex, variable);
    return hex.match(/../g).map(s => parseInt(s, 16));
  };
  assert.match(html, /body \{[^}]*background: var\(--forest\);/);
  assert.match(html, /#screen-result \.sk-section \{[^}]*background: transparent;/);
  const alpha = Number(html.match(/#screen-result \.sk-cost-box \{\s*background: rgba\(255,255,255,([.\d]+)\)/)?.[1]);
  assert.equal(alpha, .06);
  const bg = palette('forest').map(c => (1 - alpha) * c + alpha * 255);
  const lum = rgb => rgb.map(v => {
    const c = v / 255;
    return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4;
  }).reduce((total, c, i) => total + c * [.2126, .7152, .0722][i], 0);
  const ratio = (lum(palette('parchment-dark')) + .05) / (lum(bg) + .05);
  assert.ok(ratio >= 4.5, 'candidate WCAG contrast: ' + ratio.toFixed(2) + ':1');
  console.log('Cost heading/note palette contrast on composited cost box:', ratio.toFixed(2) + ':1');
  const kit = read('js/starter-kit.js');
  assert.ok(kit.includes('class="sk-cost-title">📊 飼育コスト早見表'));
  assert.ok(kit.includes('class="sk-cost-note">※機材価格は目安です。Amazon価格は変動します。'));
});
