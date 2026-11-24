import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const read = path => fs.readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const html = process.env.KLG_DIAGNOSIS_ASYNC_HTML ? fs.readFileSync(process.env.KLG_DIAGNOSIS_ASYNC_HTML, 'utf8') : read('shindan/index.html');
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(match => match[1]);
const loader = scripts.find(source => source.includes('window.__lazyScriptCache = {}'));
const main = scripts.find(source => source.includes('function tryRestoreFromUrl()'));
const assets = {
  'species.js': 'shindan/species.js',
  '../data/products.js': 'data/products.js',
  '../js/starter-kit.js': 'js/starter-kit.js',
};

function fixture({ replies = {}, url = 'https://kamelifeguide.com/shindan/', shareType } = {}) {
  let context, focused, now = 0, nextTimer = 0;
  const nodes = new Map(), events = [], loads = [], timers = new Map(), releases = [], answerCallbacks = [], shares = [], clipboards = [], outbound = [];
  class Element {
    constructor(id) {
      this.id = id;
      this.dataset = {};
      this.style = {};
      this.attrs = {};
      this.events = {};
      this.children = [];
      this.tokens = new Set();
      this.classList = {
        add: (...keys) => keys.forEach(key => this.tokens.add(key)),
        remove: (...keys) => keys.forEach(key => this.tokens.delete(key)),
        contains: key => this.tokens.has(key),
      };
      this._html = '';
    }
    set innerHTML(value) {
      this._html = value;
      this.children = [];
      for (const [, id, attrs] of value.matchAll(/ id="([\w-]+)"([^>]+)/g)) {
        const node = new Element(id);
        node.hidden = /\shidden(?:\s|$)/.test(attrs);
        nodes.set(id, node);
      }
    }
    get innerHTML() { return this._html; }
    appendChild(el) { this.children.push(el); return el; }
    setAttribute(k, v) { this.attrs[k] = String(v); }
    hasAttribute(k) { return k in this.attrs; }
    removeAttribute(k) { delete this.attrs[k]; if (k === 'href') delete this.href; }
    getAttribute(k) { return this.attrs[k] ?? null; }
    addEventListener(key, callback) { (this.events[key] ??= []).push(callback); }
    removeEventListener(key, callback) { this.events[key] = (this.events[key] || []).filter(listener => listener !== callback); }
    click() {
      if (!this.disabled && !this.hidden) this.dispatchClick();
    }
    dispatchClick() { (this.events.click || []).forEach(callback => callback.call(this, { target: this, preventDefault() {} })); }
    querySelector(selector) {
      if (selector === '.sk-card') return /class="sk-card[ "]/.test(this._html) ? new Element(selector) : null;
      return new Element(selector);
    }
    querySelectorAll() { return []; }
    get previousElementSibling() { return new Element('prev'); }
    get parentElement() { return this._parent ??= new Element('parent'); }
    focus() { focused = this.id; }
    closest() { return null; }
    remove() { this.removed = true; }
  }
  for (const [, fullId] of html.matchAll(/<[^>\n]*(?:\n[^>]*?)?\bid="([\w-]+)"[^>]*>/g)) {
    const tag = html.match(new RegExp('<[^>]*\\bid="' + fullId + '"[^>]*>'))?.[0] || '';
    const el = new Element(fullId);
    el.hidden = /\shidden(?:\s|>)/.test(tag);
    if (fullId === 'screen-start') el.classList.add('active');
    nodes.set(fullId, el);
  }
  function el(id) { return nodes.get(id); }
  const document = {
    getElementById: id => el(id) || null,
    querySelector: selector => new Element(selector),
    querySelectorAll(selector) {
      if (selector === '.choice-btn') return el('choices').children;
      if (selector === '.screen') return [...nodes.values()].filter(x => x.id.startsWith('screen-'));
      return [];
    },
    createElement: tag => new Element(tag),
    createDocumentFragment: () => new Element('fragment'),
    addEventListener() {},
    head: {
      appendChild(script) {
        const file = script.src.split('?')[0];
        assert.ok(Object.hasOwn(assets, file), script.src);
        const number = loads.filter(load => load.file === file).length;
        const reply = replies[file]?.[number] || 'ok';
        loads.push({ file, reply, script });
        function load() {
          vm.runInContext(read(assets[file]), context);
          if (file === '../js/starter-kit.js') {
            // Use the exact production card renderer; avoid retailer network and DOM wiring.
            context.mountStarterKit = (options, id) => {
              el(id).innerHTML = context.renderStarterKitHtmlV2(options.equipmentKey, options);
            };
          }
          script.onload?.();
        }
        if (reply === 'hold') releases.push(load);
        else if (reply === 'error') queueMicrotask(() => script.onerror?.());
        else if (reply === 'missing') queueMicrotask(() => script.onload?.());
        else if (reply === 'ok') queueMicrotask(load);
        else assert.equal(reply, 'hang');
      },
    },
  };
  const win = { scrollTo() {}, addEventListener() {}, removeEventListener() {}, location: new URL(url),
    open: (...args) => outbound.push(args) };
  const navigator = shareType === 'native' ? { share: args => { shares.push(args); return Promise.resolve(); } } :
    { clipboard: { writeText: text => { clipboards.push(text); return Promise.resolve(); } } };
  const history = { replaceState(_a, _b, raw) { context.location = win.location = new URL(raw); } };
  context = vm.createContext({
    console: { warn() {} }, document, window: win, location: win.location, history, URL, URLSearchParams, navigator,
    ga4Event: (name, params) => events.push([name, JSON.parse(JSON.stringify(params))]),
    requestAnimationFrame() {},
    setTimeout(callback, delay) {
      const id = ++nextTimer;
      if (delay === 250) answerCallbacks.push(callback);
      timers.set(id, { callback, time: now + delay });
      return id;
    },
    clearTimeout(id) { timers.delete(id); },
  });
  vm.runInContext(read('shindan/routes.js') + '\n' + loader + '\n' + main, context);
  function tick(ms) {
    const end = now + ms;
    while (true) {
      const first = [...timers].filter(([, t]) => t.time <= end).sort((left, right) => left[1].time - right[1].time)[0];
      if (!first) break;
      const [id, { callback, time }] = first;
      timers.delete(id);
      now = time;
      callback();
    }
    now = end;
  }
  return {
    el, loads, releases, events, answerCallbacks, shares, clipboards, outbound, tick, win, focus: () => focused,
    run: text => vm.runInContext(text, context),
    screen: () => document.querySelectorAll('.screen').find(screen => screen.classList.contains('active'))?.id,
    chooseRoute: id => el('route-cards').children.find(button => button.dataset.id === id).click(),
    choices: () => el('choices').children,
    count: event => events.filter(([name]) => name === event).length,
  };
}

const idle = () => new Promise(resolve => setImmediate(resolve));
function select(f, choice) {
  const button = f.choices()[choice];
  assert.ok(button, String(choice));
  button.click();
  f.tick(250);
}
function answerToGate(f, { housing = 0, care = 0, space = 2, budget = 2 } = {}) {
  const ordinaryQuestions = f.run('selectedRoute.questions.length');
  for (let q = 0; q < ordinaryQuestions; q++) {
    select(f, q === 0 ? space : q === ordinaryQuestions - 2 ? budget : 0);
  }
  select(f, housing);
  select(f, care);
  return ordinaryQuestions + 2;
}

const kitIds = ['result-kit-jump', 'commerce-lead', 'res-cta-top-cost-note', 'res-cta-top-link-sec', 'res-cta-secondary', 'ec-btn-sk'];
function assertNoKit(f) {
  assert.equal(f.el('starter-kit-section').style.display, 'none');
  assert.equal(f.el('starter-kit-section').innerHTML, '');
  for (const id of kitIds) if (f.el(id)) assert.equal(f.el(id).hidden, true, id);
}

for (const failure of ['error', 'missing', 'hang']) {
  test('species.js ' + failure + ' keeps exact answers and recovers through one retry', async () => {
    const f = fixture({ replies: { 'species.js': [failure, failure, 'ok'] } });
    f.chooseRoute('land');
    await idle();
    if (failure === 'hang') {
      f.tick(8000);
      await idle(); // release failed prefetch before diagnostic submission
    }
    const steps = answerToGate(f);
    const priorScores = f.run('JSON.stringify([scores, answerHistory, readinessAnswers])');
    assert.equal(f.screen(), 'screen-quiz');
    await idle();
    if (failure === 'hang') {
      f.tick(7999);
      assert.equal(f.el('btn-diagnosis-load').hidden, true);
      f.tick(1);
      await idle();
    }
    assert.equal(f.el('diagnosis-load').hidden, false);
    assert.match(f.el('diagnosis-load-message').textContent, /回答はこの画面に残っています/);
    assert.equal(f.focus(), 'diagnosis-load-message');
    assert.equal(f.el('btn-diagnosis-load').hidden, false);
    assert.equal(f.count('readiness_gate_result'), 1);
    assert.equal(f.count('shindan_answer_select'), steps);
    f.el('btn-diagnosis-load').click();
    f.el('btn-diagnosis-load').dispatchClick(); // queued double activation must not start a second job
    await idle();
    assert.equal(f.screen(), 'screen-result');
    assert.equal(f.el('diagnosis-load').hidden, true);
    assert.equal(f.focus(), 'res-name');
    assert.equal(f.run('JSON.stringify([scores, answerHistory, readinessAnswers])'), priorScores);
    assert.equal(f.count('readiness_gate_result'), 1);
    assert.equal(f.count('shindan_answer_select'), steps);
    assert.equal(f.count('shindan_result'), 1);
    assert.equal(f.count('diagnosis_result_view'), 1);
    assert.equal(f.loads.filter(load => load.file === 'species.js').length, 3);
  });
}

for (const failed of ['../js/starter-kit.js', '../data/products.js']) {
  test(failed + ' failure degrades only own kit and retries without duplicate diagnosis events', async () => {
    const f = fixture({ replies: { [failed]: ['error', 'missing', 'ok'] } });
    f.chooseRoute('land');
    await idle();
    answerToGate(f);
    await idle();
    assert.equal(f.screen(), 'screen-result');
    assert.equal(f.focus(), 'res-name');
    assert.match(f.el('kit-load-message').textContent, /診断結果はそのまま/);
    assert.equal(f.el('btn-kit-load').hidden, false);
    assertNoKit(f);
    f.el('btn-kit-load').click();
    await idle();
    assert.match(f.el('starter-kit-section').innerHTML, /class="sk-card/);
    assert.match(f.el('starter-kit-section').innerHTML, /kamelife090e-22/);
    assert.equal(f.el('kit-load').hidden, true);
    assert.equal(f.focus(), 'starter-kit-section');
    assert.equal(f.count('shindan_result'), 1);
    assert.equal(f.count('diagnosis_result_view'), 1);
    assert.equal(f.count('readiness_gate_result'), 1);
  });
}

test('Back at Q1 discards the queued answer even if a stale callback fires; same and another route are safe', async () => {
  for (const nextRoute of ['land', 'aquatic']) {
    const f = fixture();
    f.chooseRoute('land');
    const abandoned = f.choices()[0];
    abandoned.click();
    assert.ok(f.choices().every(button => button.disabled));
    f.el('btn-back').click();
    assert.equal(f.screen(), 'screen-start');
    f.chooseRoute(nextRoute);
    f.answerCallbacks[0](); // the invalidated callback cannot commit even if it is delivered
    abandoned.dispatchClick(); // detached button cannot be rebound to the new question
    f.tick(250);
    assert.match(f.el('progress-label').textContent, /^1 \/ /);
    assert.equal(f.count('shindan_answer_select'), 0);
    assert.equal(f.run('JSON.stringify(scores)'), '{}');
    // Old nodes are no longer part of the active DOM; opposite clicks cannot commit twice.
    f.choices()[1].click();
    f.choices()[0].dispatchClick();
    f.tick(250);
    assert.match(f.el('progress-label').textContent, /^2 \/ /);
    assert.equal(f.count('shindan_answer_select'), 1);
    assert.match(f.events.find(([event]) => event === 'shindan_answer_select')[1].question_id, new RegExp('^' + nextRoute + '_q1$'));
  }
  await idle();
});

test('Quit confirmation while the final timer is pending prevents the old commit; cancel allows one new answer', async () => {
  const f = fixture();
  f.chooseRoute('land');
  for (let q = 0; q < f.run('selectedRoute.questions.length'); q++) select(f, q === 0 ? 2 : 0);
  select(f, 0);
  f.choices()[0].click();
  f.el('btn-back').click();
  f.tick(250);
  assert.equal(f.count('readiness_gate_result'), 0);
  assert.equal(f.el('modal-quit').classList.contains('open'), true);
  f.el('modal-cancel').click();
  assert.equal(f.focus(), 'btn-back');
  assert.ok(f.choices().every(button => !button.disabled));
  select(f, 0);
  await idle();
  assert.equal(f.count('readiness_gate_result'), 1);
  assert.equal(f.screen(), 'screen-result');
});

test('an earlier still-loading result cannot render or replace URL after quit and another run', async () => {
  const f = fixture({ replies: { 'species.js': ['hold'] } });
  f.chooseRoute('land');
  await idle();
  answerToGate(f);
  f.el('btn-back').click();
  f.el('modal-ok').click();
  f.chooseRoute('land');
  const url = f.win.location.href;
  f.releases.shift()();
  await idle();
  assert.equal(f.screen(), 'screen-quiz');
  assert.match(f.el('progress-label').textContent, /^1 \/ /);
  assert.equal(f.win.location.href, url);
  assert.equal(f.count('diagnosis_result_view'), 0);
  assert.equal(f.el('diagnosis-load').hidden, true);
});

test('late kit retry ignores a new route, even when dependency subsequently succeeds', async () => {
  const f = fixture({ replies: { '../js/starter-kit.js': ['error', 'error', 'hold'] } });
  f.chooseRoute('land');
  await idle();
  answerToGate(f);
  await idle();
  f.el('btn-kit-load').click();
  f.el('btn-retry').click();
  f.chooseRoute('land');
  f.releases.shift()();
  await idle();
  assert.equal(f.screen(), 'screen-quiz');
  assertNoKit(f);
  assert.equal(f.el('kit-load').hidden, true);
  assert.equal(f.count('diagnosis_result_view'), 1);
});

test('loading under a quit confirmation settles only after cancel, and retains one result event', async () => {
  const f = fixture({ replies: { 'species.js': ['hold'] } });
  f.chooseRoute('land');
  await idle();
  answerToGate(f);
  f.el('btn-back').click();
  f.releases.shift()();
  await idle();
  assert.equal(f.screen(), 'screen-quiz');
  assert.equal(f.count('diagnosis_result_view'), 0);
  f.el('modal-cancel').click();
  await idle();
  assert.equal(f.screen(), 'screen-result');
  assert.equal(f.count('diagnosis_result_view'), 1);
});

test('retry cannot mount shopping when recovered prices reveal the budget mismatch', async () => {
  const f = fixture({ replies: { '../js/starter-kit.js': ['error', 'missing', 'ok'] } });
  f.chooseRoute('land');
  await idle();
  answerToGate(f, { space: 2, budget: 0 });
  await idle();
  assert.equal(f.screen(), 'screen-result');
  assert.equal(f.el('btn-kit-load').hidden, false);
  assert.match(f.el('result-preparation-note').innerHTML, /予算に収まるとは未確認/);
  const species = f.el('res-name').textContent;
  f.el('btn-kit-load').click();
  await idle();
  assert.match(f.el('result-preparation-note').innerHTML, /予算を上回ります/);
  assert.equal(f.el('kit-load').hidden, true);
  assert.equal(f.focus(), 'result-preparation-title');
  assert.equal(f.el('res-name').textContent, species);
  assertNoKit(f);
  assert.equal(f.el('res-cta-top').innerHTML, '');
  assert.equal(f.count('diagnosis_result_view'), 1);
  assert.equal(f.count('readiness_gate_result'), 1);
});

test('a shared result old species request does not supersede route selection or remove its private-safe recovery', async () => {
  const f = fixture({ replies: { 'species.js': ['error', 'hold'] },
    url: 'https://kamelifeguide.com/shindan/?r=land&s=' + encodeURIComponent('ロシアリクガメ') });
  await idle();
  assert.ok(f.win.location.searchParams.has('r'));
  assert.equal(f.el('btn-restore-load').hidden, false);
  f.el('btn-restore-load').click();
  f.chooseRoute('land');
  f.releases.shift()();
  await idle();
  assert.equal(f.screen(), 'screen-quiz');
  assert.equal(f.win.location.search, '');
  assert.equal(f.count('diagnosis_result_view'), 0);
  assert.equal(f.el('restore-load').hidden, true);
});

test('core aquatic question no longer implies a fixed water-change schedule; scores and 12-step route stay intact', () => {
  const f = fixture();
  f.chooseRoute('aquatic');
  select(f, 1);
  assert.match(f.el('question-text').textContent, /水換え.*フィルター.*時間/);
  assert.doesNotMatch(f.choices().map(el => el.textContent).join(' '), /月1回|週1|外部フィルターで/);
  assert.deepEqual(JSON.parse(f.run('JSON.stringify(ROUTES.find(r=>r.id==="aquatic").questions[1].choices.map(c=>c.scores.maintenance))')), [3, 2, 0]);
  assert.equal(f.el('progress-label').textContent, '2 / 12');
});

for (const shareType of ['native', 'clipboard']) {
  test(shareType + ' share uses computed percentage only for a fresh A, private-safe for B and restore', async () => {
    function assertShare(f, expected, oldShares) {
      f.el('btn-share').click();
      const events = shareType === 'native' ? f.shares : f.clipboards;
      assert.equal(events.length, oldShares + 1);
      assert.equal(f.outbound.length, 0);
      const args = events.at(-1);
      const text = shareType === 'native' ? args.text : args.slice(0, args.lastIndexOf(' '));
      const url = new URL(shareType === 'native' ? args.url : args.slice(args.lastIndexOf(' ') + 1));
      assert.deepEqual([...url.searchParams.keys()], ['r', 's']);
      assert.equal(url.searchParams.get('r'), 'land');
      assert.equal(url.searchParams.get('s'), f.el('res-name').textContent);
      assert.equal(f.count('shindan_share'), oldShares + 1);
      if (expected === null) {
        assert.match(text, /の参考情報/);
        assert.doesNotMatch(text, /私に合う|相性|\d+%|予算|同意|留守/);
        if (shareType === 'native') assert.equal(args.title, '亀の参考情報');
      } else {
        assert.match(text, new RegExp('相性' + expected + '%'));
        if (shareType === 'native') assert.equal(args.title, 'あなたに合う亀診断');
      }
    }
    const fresh = fixture({ shareType });
    fresh.chooseRoute('land');
    answerToGate(fresh);
    await idle();
    assert.equal(fresh.screen(), 'screen-result');
    assert.equal(fresh.el('score-num').textContent, '0'); // animation has not run
    const match = fresh.events.find(([name]) => name === 'shindan_result')[1].match_pct;
    assert.ok(match > 0);
    assertShare(fresh, match, 0);
    fresh.el('score-num').textContent = String(match - 1); // arbitrary transient frame
    assertShare(fresh, match, 1);
    const softB = fixture({ shareType });
    softB.chooseRoute('land');
    answerToGate(softB, { housing: 2, care: 1 });
    await idle();
    assert.equal(softB.events.find(([name]) => name === 'readiness_gate_result')[1].verdict, 'B');
    assertShare(softB, null, 0);
    const restored = fixture({ shareType, url: fresh.win.location.href });
    await idle();
    assert.equal(restored.screen(), 'screen-result');
    assertNoKit(restored);
    assert.equal(restored.loads.filter(load => load.file !== 'species.js').length, 0);
    assertShare(restored, null, 0);
    await idle();
  });
}
