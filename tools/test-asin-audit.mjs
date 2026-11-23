import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const candidateAudit = fileURLToPath(new URL('../scripts/audit-asin.mjs', import.meta.url));
const audit = process.env.KLG_ASIN_AUDIT_UNDER_TEST
  ? resolve(process.env.KLG_ASIN_AUDIT_UNDER_TEST) : candidateAudit;
const kid = readFileSync(new URL('../data/kid.js', import.meta.url), 'utf8');
const held = kid.split('\n').filter(line => line.includes('amazon_url:') && line.includes('product_verification:'));
assert.equal(held.length, 2, 'test uses the two actual KID evidence records');
const heldId = 'B00N3MTF8A';
const otherId = 'B001OC9MJS';
const newId = 'B0TEST9876';
const approvedTag = 'kamelife090e-22';
const amazon = (id, tagged) => 'https://www.amazon.co.jp/dp/' + id + (tagged ? '?tag=' + approvedTag : '');
const active = (id, tagged = false) => '  affiliate: { amazon: "' + amazon(id, tagged) + '", rakuten: null },';
const item = (...lines) => '{\n  cta_enabled: true,\n' + lines.join('\n') + '\n}';
const list = (...items) => 'const equipment = [\n' + items.join(',\n') + '\n];\n';

function run(files) {
  const root = mkdtempSync(join(tmpdir(), 'klg-asin-fixture-'));
  try {
    for (const [path, content] of Object.entries(files)) {
      const full = join(root, path);
      mkdirSync(dirname(full), { recursive: true });
      writeFileSync(full, content);
    }
    const env = { ...process.env, GITHUB_OUTPUT: join(root, 'outputs.txt') };
    delete env.GITHUB_STEP_SUMMARY;
    const result = spawnSync(process.execPath, [audit], { cwd: root, env, encoding: 'utf8' });
    assert.ifError(result.error);
    assert.equal(result.stderr, '');
    const fields = Object.fromEntries(readFileSync(env.GITHUB_OUTPUT, 'utf8').trim().split('\n').map(p => p.split('=')));
    return { code: result.status, fields, report: result.stdout };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test('real held product_verification records alone are neither NEW nor NO_TAG', () => {
  const result = run({ 'data/kid.js': list(...held.map(e => '{\n  cta_enabled: false,\n' + e + '\n}')) });
  assert.equal(result.code, 0);
  assert.equal(result.fields.new, '0');
  assert.equal(result.fields.notag, '0');
  assert.equal(result.fields.total, '0');
  assert.doesNotMatch(result.report, new RegExp(heldId + '|' + otherId));
});

test('active untagged KID affiliate link is still NEW and NO_TAG', () => {
  const result = run({ 'data/kid.js': list(item(active(newId))) });
  assert.equal(result.code, 1);
  assert.equal(result.fields.new, '1');
  assert.equal(result.fields.notag, '1');
  assert.match(result.report, /data\/kid\.js:4 https:\/\/www\.amazon\.co\.jp\/dp\/B0TEST9876/);
});

test('new tagged KID product still produces NEW, not NO_TAG', () => {
  const result = run({ 'data/kid.js': list(item(active(newId, true))) });
  assert.equal(result.code, 1);
  assert.equal(result.fields.new, '1');
  assert.equal(result.fields.notag, '0');
  assert.match(result.report, /B0TEST9876/);
});

test('same ASIN in evidence and active untagged URL is not globally suppressed', () => {
  const result = run({ 'data/kid.js': list(item(held[0], active(heldId))) });
  assert.equal(result.code, 1);
  assert.equal(result.fields.new, '1');
  assert.equal(result.fields.notag, '1');
  assert.match(result.report, /data\/kid\.js:5 https:\/\/www\.amazon\.co\.jp\/dp\/B00N3MTF8A/);
});

test('unrecognized evidence layout stays visible rather than silently filtered', () => {
  const drift = held[0].replace(' amazon_url:', '\n  amazon_url:');
  const result = run({ 'data/kid.js': list(item(drift)) });
  assert.equal(result.code, 1);
  assert.equal(result.fields.new, '1');
  assert.equal(result.fields.notag, '1');
});

test('evidence URL with different ASIN or non-hold status stays visible', () => {
  for (const drift of [held[0].replace('/dp/' + heldId, '/dp/' + newId),
                      held[0].replace('owner_confirmation_required', 'verified')]) {
    const result = run({ 'data/kid.js': list(item(drift)) });
    assert.equal(result.code, 1);
    assert.equal(result.fields.new, '1');
    assert.equal(result.fields.notag, '1');
  }
});

test('matching-looking content outside data/kid.js is not excluded', () => {
  const result = run({ 'data/other.js': list(item(held[0])) });
  assert.equal(result.code, 1);
  assert.equal(result.fields.new, '1');
  assert.equal(result.fields.notag, '1');
  assert.match(result.report, /data\/other\.js:4/);
});
