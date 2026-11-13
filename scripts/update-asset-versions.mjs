import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const ASSETS = ['js/starter-kit.js', 'data/products.js', 'shindan/species.js', 'shindan/routes.js'];
const DEFAULT_ROOT = fileURLToPath(new URL('../', import.meta.url));
const SKIP_DIRS = new Set(['.git', 'node_modules', '.venv', 'venv']);

export function updateAssetVersions(root = DEFAULT_ROOT, { check = false } = {}) {
  root = path.resolve(root);
  // Read all inputs before writing any HTML; a missing asset must not cause partial updates.
  const versions = Object.fromEntries(ASSETS.map(asset => {
    const normalized = fs.readFileSync(path.join(root, asset), 'utf8').replace(/\r\n/g, '\n');
    return [asset, crypto.createHash('sha256').update(normalized, 'utf8').digest('hex').slice(0, 12)];
  }));
  const changed = [];
  function versionUrl(src, relativeFile, htmlAttribute) {
    if (!src || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(src)) return src;
    const match = src.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/);
    if (!match) return src;
    const [, pathname, query = '', hash = ''] = match;
    const resolved = path.posix.normalize(pathname.startsWith('/')
      ? pathname.slice(1) : path.posix.join(path.posix.dirname(relativeFile), pathname));
    if (!Object.hasOwn(versions, resolved)) return src;
    const separator = htmlAttribute && query.includes('&amp;') ? '&amp;' : '&';
    const parts = query ? query.slice(1).split(htmlAttribute ? /&amp;|&/ : /&/) : [];
    const retained = parts.filter(part => !/^v(?:=|$)/.test(part));
    retained.push('v=' + versions[resolved]);
    return pathname + '?' + retained.join(separator) + hash;
  }
  function transform(text, relativeFile) {
    // Leave commented markup alone. Preserve every non-URL character, including CRLF and BOM.
    return text.split(/(<!--[\s\S]*?-->)/g).map(part => {
      if (part.startsWith('<!--')) return part;
      part = part.replace(/<script\b[^>]*>/gi, tag => tag.replace(/(\s+src\s*=\s*)(["'])(.*?)\2/i,
        (_, prefix, quote, src) => prefix + quote + versionUrl(src, relativeFile, true) + quote));
      if (relativeFile === 'shindan/index.html') {
        part = part.replace(/(\b__loadScriptOnce\s*\(\s*)(["'])([^"'\r\n]*)\2/g,
          (_, prefix, quote, src) => prefix + quote + versionUrl(src, relativeFile, false) + quote);
      }
      return part;
    }).join('');
  }
  function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a,b)=>a.name.localeCompare(b.name))) {
      if (entry.isSymbolicLink()) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) { if (!SKIP_DIRS.has(entry.name)) visit(full); continue; }
      if (!entry.isFile() || !/\.html$/i.test(entry.name)) continue;
      const relativeFile = path.relative(root, full).split(path.sep).join('/');
      const before = fs.readFileSync(full, 'utf8');
      const after = transform(before, relativeFile);
      if (before !== after) { changed.push(relativeFile); if (!check) fs.writeFileSync(full, after, 'utf8'); }
    }
  }
  visit(root);
  return { changed, versions };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (args.some(arg => arg !== '--check')) throw new Error('Usage: node scripts/update-asset-versions.mjs [--check]');
    const check = args.includes('--check');
    const result = updateAssetVersions(DEFAULT_ROOT, { check });
    console.log(`${check ? 'Check' : 'Update'}: ${result.changed.length} HTML file(s) ${check ? 'need updating' : 'updated'}.`);
    for (const file of result.changed) console.log(file);
    if (check && result.changed.length) process.exitCode = 1;
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
