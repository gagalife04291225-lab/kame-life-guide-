import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

// Run the actual page script through click listeners registered on elements parsed
// from the actual HTML. This bounded DOM double does not claim browser/AT behavior.
const html = readFileSync(process.env.KLG_READINESS_HTML || new URL('../before-keeping.html', import.meta.url), 'utf8');
const sections = html.match(/<main\b[^>]*>[\s\S]*?<\/main>/i);
const script = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)]
  .map(match => match[1]).find(source => source.includes("'readiness_result'"));
const resultEvents = events => events.filter(([name]) => name === 'readiness_result');

function match(el, selector) {
  const not = selector.match(/:not\(([^)]+)\)$/);
  if (not) return match(el, selector.slice(0, not.index)) && !match(el, not[1]);
  if (selector.startsWith('#')) return el.attrs.id === selector.slice(1);
  if (selector.startsWith('.')) return el.className.split(/\s+/).includes(selector.slice(1));
  throw new Error('Unsupported selector: ' + selector);
}

function dom() {
  let focused;
  let observing;
  const events = [];
  class Element {
    constructor(tag, attrs = {}) {
      this.tagName = tag;
      this.attrs = attrs;
      this.dataset = Object.fromEntries(Object.entries(attrs).filter(([k]) => k.startsWith('data-'))
        .map(([k, v]) => [k.slice(5), v]));
      this.children = [];
      this.listeners = {};
      this.style = {};
    }
    get className() { return this.getAttribute('class') || ''; }
    set className(val) { this.setAttribute('class', val); }
    get disabled() { return Object.hasOwn(this.attrs, 'disabled'); }
    set disabled(val) { this.setFlag('disabled', val); }
    get hidden() { return Object.hasOwn(this.attrs, 'hidden'); }
    set hidden(val) { this.setFlag('hidden', val); }
    get href() { return this.getAttribute('href'); }
    set href(val) { this.setAttribute('href', val); }
    get textContent() { return this.children.map(k => k instanceof Element ? k.textContent : k).join(''); }
    set textContent(value) { this.children = value === '' ? [] : [String(value)]; }
    setAttribute(name, value) { this.attrs[name] = String(value); }
    getAttribute(name) { return this.attrs[name] ?? null; }
    setFlag(name, enabled) { if (enabled) this.attrs[name] = ''; else delete this.attrs[name]; }
    querySelectorAll(selector) {
      return this.children.flatMap(child => child instanceof Element
        ? [...(match(child, selector) ? [child] : []), ...child.querySelectorAll(selector)] : []);
    }
    querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
    append(...items) {
      for (const item of items) {
        if (item instanceof Element) item.parentElement = this;
        this.children.push(item);
      }
    }
    addEventListener(event, handler) { this.listeners[event] = handler; }
    get hiddenByParent() { return this.hidden || !!this.parentElement?.hiddenByParent; }
    focus() { if (!this.hiddenByParent && !this.disabled) focused = this; }
    click() {
      if (this.hiddenByParent || this.disabled) return;
      this.listeners.click?.call(this);
      if (this.attrs.onclick) vm.runInContext(this.attrs.onclick, context);
    }
  }
  const root = new Element('root');
  const stack = [root];
  for (const token of sections[0].match(/<!--[\s\S]*?-->|<[^>]+>|[^<]+/g)) {
    if (token.startsWith('<!--')) continue;
    if (token.startsWith('</')) {
      assert.equal(stack.pop().tagName, token.slice(2, -1));
    } else if (token.startsWith('<')) {
      const found = token.match(/^<([\w-]+)([\s\S]*?)>$/);
      const attrs = Object.fromEntries([...found[2].matchAll(/([\w-]+)(?:="([^"]*)")?/g)]
        .map(([, key, value]) => [key, value || '']));
      const element = new Element(found[1], attrs);
      stack.at(-1).append(element);
      if (found[1] !== 'br') stack.push(element);
    } else {
      stack.at(-1).append(token);
    }
  }
  assert.equal(stack.length, 1);
  const $ = selector => root.querySelector(selector);
  const window = {};
  function IntersectionObserver(observer) {
    observing = {
      observe() {},
      disconnect() { this.disconnected = true; },
      fire(intersects) { observer([{ isIntersecting: intersects }]); },
    };
    return observing;
  }
  window.IntersectionObserver = IntersectionObserver;
  const context = vm.createContext({
    window, IntersectionObserver,
    document: { getElementById: id => $('#' + id), createElement: tag => new Element(tag) },
    gtag: (type, name, payload) => {
      assert.equal(type, 'event');
      events.push([name, JSON.parse(JSON.stringify(payload))]);
    },
  });
  return {
    $, events, window, root, focus: () => focused, observer: () => observing,
    init: () => vm.runInContext(script, context),
    question: num => $('#trs-q' + num),
  };
}

const range = [1, 2, 3, 4, 5];
const topics = ['飼育スペース', '毎月の費用', '温度管理', '同居する人の同意', '寿命と長期の世話'];
const hrefs = ['#keeping-home', '#keeping-costs', '#keeping-daily-care', '#keeping-home', '#keeping-lifespan'];
const choice = (q, id) => q.querySelectorAll('.trs-opt').find(el => el.dataset.choice === id);
const next = q => q.querySelector('.trs-btn-next');
const back = q => q.querySelector('.trs-btn-back:not(.trs-btn-cancel)');
const edit = (browser, num) => browser.root.querySelectorAll('.trs-edit')[num - 1];
const band = score => score < 4 ? 'low' : score < 8 ? 'mid' : 'high';
const progress = (browser, percent) => {
  const bar = browser.$('#trs-progress');
  assert.equal(bar.style.width, percent + '%');
  assert.equal(bar.parentElement.getAttribute('aria-valuenow'), String(percent));
};

function complete(browser, selections) {
  for (const num of range) {
    const question = browser.question(num);
    const selected = choice(question, selections[num - 1]);
    assert.equal(question.hidden, false);
    assert.equal(next(question).disabled, true);
    next(question).click();
    assert.equal(question.hidden, false, 'unanswered Next must never advance');
    selected.click();
    assert.equal(next(question).disabled, false);
    assert.equal(selected.getAttribute('aria-pressed'), 'true');
    assert.equal(question.querySelectorAll('.trs-opt').filter(o => o.getAttribute('aria-pressed') === 'true').length, 1);
    next(question).click();
    assert.equal(question.hidden, true);
  }
}

const allTwo = range.map(() => 'p2');

test('source fallback works with JS absent; init never steals focus; real controls have semantic names', () => {
  const browser = dom();
  const fallback = browser.$('#trs-fallback');
  assert.equal(fallback.hidden, false);
  assert.match(fallback.textContent, /チェックリスト/);
  assert.equal(browser.$('#keeping-checklist').tagName, 'h2');
  assert.equal(browser.$('#keeping-checklist').getAttribute('tabindex'), '-1');
  for (const number of range) {
    const q = browser.question(number);
    assert.equal(q.hidden, true);
    assert.equal(next(q).tagName, 'button');
    assert.equal(next(q).disabled, true);
    assert.equal(q.querySelector('.trs-options').getAttribute('aria-labelledby'), 'trs-prompt' + number);
    assert.equal(q.querySelector('.trs-q-text').getAttribute('aria-describedby'), 'trs-step' + number);
  }
  browser.init();
  assert.equal(fallback.hidden, true);
  assert.equal(browser.focus(), undefined);
  assert.equal(browser.question(1).hidden, false);
  progress(browser, 0);
});

test('all 324 paths through the actual click wiring retain the legacy score bands and show only relevant gaps', () => {
  const browser = dom();
  browser.init();
  let cases = 0, legacyCases = 0;
  const distinctAdvice = new Map();
  for (const a of [0, 1, 2]) for (const b of [0, 1, 2]) for (const c of [0, 1, 2])
    for (const d of [0, 1, 2, 'alone']) for (const e of [0, 1, 2]) {
      const raw = [a, b, c, d, e];
      const values = raw.map(x => x === 'alone' ? 2 : x);
      const ids = raw.map(x => x === 'alone' ? 'alone' : 'p' + x);
      const score = values.reduce((x, y) => x + y, 0); // legacy five-answer formula
      const expected = [];
      for (const point of [0, 1]) {
        values.forEach((value, index) => { if (value === point) expected.push([index, point]); });
      }
      const start = browser.events.length;
      complete(browser, ids);
      assert.equal(browser.$('#trs-score-num').textContent, String(score));
      assert.equal(browser.window._trsBand, band(score));
      assert.equal(browser.$('#trs-result').hidden, false);
      assert.equal(browser.focus(), browser.$('#trs-result-headline'));
      assert.ok(browser.$('#trs-result-headline').getAttribute('tabindex') === '-1');
      progress(browser, 100);
      assert.deepEqual(browser.events.slice(start), [
        ['readiness_start', {}],
        ...values.map((points, i) => ['readiness_answer', { question_id: 'q' + (i + 1), score: points, result_band: 'pending' }]),
        ['readiness_result', { score, result_band: band(score) }],
      ]);
      const items = browser.$('#trs-gaps').children;
      assert.equal(items.length, expected.length);
      items.forEach((item, i) => {
        const [index, point] = expected[i];
        assert.equal(item.children[0].textContent, (point === 0 ? '未確認：' : 'もう少し確認：') + topics[index]);
        const [hint, link] = item.children.slice(1);
        distinctAdvice.set(index + ':' + point, hint.textContent);
        assert.ok(hint.textContent.length > 18);
        assert.equal(link.href, hrefs[index]);
        assert.equal(browser.$(link.href).tagName, 'h2');
      });
      assert.equal(browser.$('#trs-result-secondary').hidden, score !== 10);
      assert.equal(browser.$('#trs-result-cta').href, '#keeping-checklist');
      browser.$('#trs-restart').click();
      assert.equal(browser.focus(), browser.$('#trs-prompt1'));
      assert.equal(browser.window._trsScore, undefined);
      assert.equal(browser.question(1).querySelectorAll('.trs-opt').every(o => o.getAttribute('aria-pressed') === 'false'), true);
      progress(browser, 0);
      cases++;
      if (d !== 'alone') legacyCases++;
    }
  assert.equal(cases, 324);
  assert.equal(legacyCases, 243);
  assert.equal(new Set(distinctAdvice.values()).size, 10, 'each 0/1 gap gives its own next step');
});

test('an 8/10 control with missing temperature names the issue first and cannot send a reader to products or diagnosis', () => {
  const browser = dom();
  browser.init();
  complete(browser, ['p2', 'p2', 'p0', 'p2', 'p2']);
  assert.equal(browser.$('#trs-score-num').textContent, '8');
  assert.equal(browser.$('#trs-gaps').children.length, 1);
  const gap = browser.$('#trs-gaps').children[0];
  assert.equal(gap.children[0].textContent, '未確認：温度管理');
  assert.match(gap.children[1].textContent, /温度を保てる見通しが立つまで、迎えるのは待ち/);
  assert.equal(gap.children[2].href, '#keeping-daily-care');
  const card = browser.$('#trs-result-card');
  assert.ok(card.children.indexOf(browser.$('#trs-gaps')) < card.children.indexOf(browser.$('.trs-score-row')));
  assert.doesNotMatch(card.textContent, /あと一歩|準備は整っています|Starter Kit/);
  assert.equal(browser.$('#trs-result-secondary').hidden, true);
  browser.$('#trs-result-cta').click();
  assert.deepEqual(browser.events.at(-1), ['readiness_cta_click', { score: 8, result_band: 'high', location: 'readiness' }]);
});

test('10/10 still puts the independent six-item checklist first (including those who live alone)', () => {
  const browser = dom();
  browser.init();
  complete(browser, ['p2', 'p2', 'p2', 'alone', 'p2']);
  const card = browser.$('#trs-result-card');
  assert.doesNotMatch(card.textContent, /準備は整っています|準備完了|すべてが整って/);
  for (const required of ['飼育許可', '留守中の世話', '亀を診られる病院', '法規制と寿命', '初期費用と毎月の費用']) {
    assert.ok(card.textContent.includes(required), required);
  }
  const cta = browser.$('#trs-result-cta');
  assert.equal(browser.$(cta.href).textContent, '迎える前のチェックリスト');
  assert.match(cta.textContent, /迎える前のチェックリストを見る/);
  assert.match(browser.$(cta.href).parentElement.textContent, /賃貸なら契約を確認.*同居する人がいる場合は同意/);
  const second = browser.$('#trs-result-secondary');
  assert.ok(card.children.indexOf(cta) < card.children.indexOf(second));
  assert.match(second.textContent, /チェックリストも確認できたら/);
  assert.equal(second.children.find(el => typeof el !== 'string').href, './shindan/');
});

test('edit any response without reset; same-score identity, cancel, back, focus and event contracts', () => {
  const browser = dom();
  browser.init();
  const q1 = browser.question(1), q2 = browser.question(2), q4 = browser.question(4);
  const io = browser.observer();
  io.fire(false);
  io.fire(true);
  io.fire(true);
  assert.equal(io.disconnected, true);
  assert.deepEqual(browser.events, [['readiness_view', {}]]);
  choice(q1, 'p0').click();
  next(q1).click();
  assert.equal(browser.focus(), browser.$('#trs-prompt2'));
  progress(browser, 20);
  back(q2).click();
  assert.equal(browser.focus(), browser.$('#trs-prompt1'));
  assert.equal(choice(q1, 'p0').getAttribute('aria-pressed'), 'true');
  assert.equal(next(q1).disabled, false);
  choice(q1, 'p2').click();
  next(q1).click();
  for (const num of range.slice(1)) {
    choice(browser.question(num), 'p2').click();
    next(browser.question(num)).click();
  }
  const finished = resultEvents(browser.events).length;
  for (const num of range) {
    edit(browser, num).click();
    const q = browser.question(num);
    assert.equal(browser.focus(), browser.$('#trs-prompt' + num));
    assert.equal(choice(q, 'p2').getAttribute('aria-pressed'), 'true');
    assert.equal(back(q).hidden, true);
    assert.equal(next(q).textContent, '変更を反映する');
    progress(browser, 100);
    choice(q, 'p1').click();
    q.querySelector('.trs-btn-cancel').click();
    assert.equal(browser.focus(), edit(browser, num));
    assert.equal(browser.window._trsScore, 10);
    assert.equal(resultEvents(browser.events).length, finished);
  }
  edit(browser, 4).click();
  choice(q4, 'alone').click();
  assert.equal(choice(q4, 'p2').getAttribute('aria-pressed'), 'false');
  assert.equal(choice(q4, 'alone').getAttribute('aria-pressed'), 'true');
  assert.equal(resultEvents(browser.events).length, finished);
  next(q4).click();
  assert.equal(browser.focus(), browser.$('#trs-result-headline'));
  assert.deepEqual(browser.events.at(-1),
    ['readiness_answer', { question_id: 'q4', score: 2, result_band: 'pending' }]);
  assert.equal(resultEvents(browser.events).length, finished);
  edit(browser, 4).click();
  assert.equal(choice(q4, 'alone').getAttribute('aria-pressed'), 'true');
  next(q4).click(); // unchanged save returns without duplicate result
  assert.equal(resultEvents(browser.events).length, finished);
  edit(browser, 2).click();
  choice(q2, 'p0').click();
  next(q2).click();
  assert.equal(browser.window._trsScore, 8);
  assert.match(browser.$('#trs-gaps').textContent, /未確認：毎月の費用/);
  assert.equal(browser.$('#trs-result-secondary').hidden, true);
  assert.equal(resultEvents(browser.events).length, finished);
  browser.$('#trs-result-cta').click();
  assert.deepEqual(browser.events.at(-1), ['readiness_cta_click', { score: 8, result_band: 'high', location: 'readiness' }]);
  const end = browser.events.length;
  browser.$('#trs-restart').click();
  choice(q1, 'p1').click();
  assert.deepEqual(browser.events.slice(end), [
    ['readiness_start', {}],
    ['readiness_answer', { question_id: 'q1', score: 1, result_band: 'pending' }],
  ]);
});
