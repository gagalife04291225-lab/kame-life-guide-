import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const origin = 'https://kamelifeguide.com';
const kitContext = { window: { location: { hostname: 'kamelifeguide.com', pathname: '/species/test.html', search: '' } } };
const kit = runInNewContext(
  read('data/products.js') + '\n' + read('js/starter-kit.js') +
  '\n; ({ groups: Object.keys(EQUIPMENT_MAP), generateKitByTier, renderSkCard, renderStarterKitHtmlV2 })',
  kitContext);
const client = read('js/amazon-product-images.js');
const asinStart = client.indexOf('  const asinOf =');
const asinEnd = client.indexOf('  const items =');
const routeStart = client.indexOf('  const contextSelectors =');
const routeEnd = client.indexOf('  function validPhoto(');
assert.ok(asinStart >= 0 && asinEnd > asinStart && routeStart >= 0 && routeEnd > routeStart);
const guard = runInNewContext(client.slice(asinStart, asinEnd) + client.slice(routeStart, routeEnd) +
  '; ({ asinOf, route })', { URL, location: { origin } });

function attrs(tag) {
  return Object.fromEntries([...tag.matchAll(/\s([\w:-]+)="([^"]*)"/g)]
    .map(m => [m[1], m[2].replace(/&amp;/g, '&')]));
}
function routeFor(cta, retailerNodes = []) {
  const context = {
    querySelector(selector) {
      return retailerNodes.find(node => selector.split(',').some(rule => {
        if (rule === '.sk-card-media') return (node.class || '').split(/\s+/).includes('sk-card-media');
        const m = /^a\[([\w-]+)(\*=|=)"([^"]+)"\](:not\(\.is-placeholder\))?$/.exec(rule);
        assert.ok(m, 'unknown retailer selector: ' + rule);
        if (node.tag !== 'a' || (m[4] && (node.class || '').split(/\s+/).includes('is-placeholder'))) return false;
        return m[2] === '*=' ? (node[m[1]] || '').includes(m[3]) : node[m[1]] === m[3];
      })) || null;
    }
  };
  return guard.route({
    dataset: { asin: cta['data-asin'] },
    textContent: cta.text,
    getAttribute: key => cta[key] ?? null,
    closest: selector => selector.split(',').includes('.sk-card') ? context : null,
    querySelector: () => null
  });
}

const counts = { cards: 0, amazonExact: 0, mixedSearch: 0, mixedExact: 0, mixedMedia: 0,
  isolatedControls: 0, eligibleAsRendered: 0 };
const unique = new Set();
let eheimFrequencyCards = 0;
for (const group of kit.groups) {
  const mounted = kit.renderStarterKitHtmlV2(group, { name: 'Fixture' });
  for (const tier of ['budget', 'standard', 'premium']) {
    const picks = kit.generateKitByTier(group, tier);
    assert.ok(picks.length > 0, group + ' ' + tier);
    for (const pick of picks) {
      const html = kit.renderSkCard(pick, 'Fixture', group);
      assert.ok(mounted.includes(html), 'card not found in actual rendered kit');
      counts.cards++;
      const links = [...html.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/g)]
        .map(m => ({ ...attrs(m[0].slice(0, m[0].indexOf('>') + 1)), tag: 'a', text: m[1] }));
      const amazon = links.find(n => n['data-provider'] === 'amazon');
      const id = amazon && guard.asinOf(amazon.href);
      if (!id) continue;
      if (id === 'B002SGX79U') {
        const warning = '50Hz用と60Hz用';
        assert.ok(html.includes(warning), '2217 must warn about the two frequencies');
        assert.ok(html.indexOf(warning) < html.indexOf(amazon.href), 'show frequency before buying');
        eheimFrequencyCards++;
      }
      counts.amazonExact++;
      unique.add(id);
      assert.equal(amazon['data-asin'], id);
      assert.equal(amazon['data-click-url'], amazon.href);
      const rakuten = links.filter(n => n['data-provider'] === 'rakuten');
      const controls = rakuten.filter(n => /^(search|affiliate)$/.test(n['data-mode']) &&
        !(n.class||'').split(/\s+/).includes('sk-card-media'));
      assert.ok(controls.length <= 1, 'ambiguous retailer controls');
      for (const control of controls) assert.equal(control['data-click-url'], control.href);
      if (controls.some(n => n['data-mode'] === 'search')) counts.mixedSearch++;
      if (controls.some(n => n['data-mode'] === 'affiliate')) counts.mixedExact++;
      const media = [...html.matchAll(/<div\b[^>]*class="sk-card-media"[^>]*>/g)]
        .map(m => ({ ...attrs(m[0]), tag: 'div' }));
      const adjacent = [...links.filter(n => n !== amazon), ...media];
      const hasMedia = adjacent.some(n => (n.class || '').split(/\s+/).includes('sk-card-media'));
      if (hasMedia) counts.mixedMedia++;
      const result = routeFor(amazon, adjacent);
      assert.equal(result, controls.length || hasMedia ? null : id, group + '/' + tier + '/' + id);
      if (result) counts.eligibleAsRendered++;
      assert.equal(routeFor(amazon), id, 'Amazon-only positive control');
      counts.isolatedControls++;
    }
  }
}
assert.ok(counts.mixedExact > 0 && counts.mixedSearch > 0 && counts.mixedMedia > 0,
  'current starter-kit mixed retailer cases were not exercised');
assert.equal(counts.isolatedControls, counts.amazonExact);
assert.equal(eheimFrequencyCards, 2, 'cover both 2217 Starter Kit routes');
console.log('Amazon photo starter-kit coverage (group/tier occurrences, not site totals):',
  JSON.stringify({ groups: kit.groups.length, tiers: 3, ...counts, uniqueAsins: unique.size }));
