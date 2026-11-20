#!/usr/bin/env node
// Exercise the actual guide setup renderer, with a minimal offline DOM fixture.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read = file => fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8');
const html = read('guide-arid.html');
assert.match(html, /data-setup="redfoot-a" hidden/);
assert.match(html, /href="species\/red-footed-tortoise\.html"/);
assert.match(read('species/red-footed-tortoise.html'), /120cm規格でも手狭/);

const box = {
  innerHTML: '', hidden: true,
  getAttribute: () => 'redfoot-a',
  addEventListener() {}
};
const document = {
  readyState: 'complete',
  querySelectorAll(selector) {
    assert.equal(selector, '.setup-products[data-setup]');
    return [box];
  }
};
const ctx = vm.createContext({ document });
for (const file of ['data/products.js', 'data/setup-specs.js', 'js/setup-products.js']) {
  vm.runInContext(read(file), ctx, { filename: file });
}

assert.equal(box.hidden, false, 'the guide reveals the rendered setup');
assert.match(box.innerHTML, /成体の飼育スペース/);
assert.match(box.innerHTML, /120cm規格のケージでも手狭/);
assert.match(box.innerHTML, /置いたあとも歩き回れる床面積/);
assert.doesNotMatch(box.innerHTML, /data-cat="enclosure"|BK9045|90cm以上|enclosure_tortoise_120/);
for (const preserved of ['床材', 'UVBライト', 'バスキングライト', 'ヒーター・保温', 'シェルター', '温度・湿度計', '水入れ']) {
  assert.ok(box.innerHTML.includes(preserved), 'missing unrelated setup item: ' + preserved);
}
assert.match(box.innerHTML, /data-retailer=/, 'keep eligible non-enclosure product links');
console.log('PASS red-footed setup: adult enclosure selection criteria only; other equipment and links preserved.');
