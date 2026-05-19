#!/usr/bin/env node
// Coverage check: every key in en.json must exist in every other locale.
// Reports missing/extra keys per locale. Non-zero exit if any locale has missing keys.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const LOCALES_DIR = path.join(ROOT, 'i18n', 'locales');

function flatten(obj, prefix = '', out = []) {
  if (obj == null) return out;
  if (typeof obj === 'string') { out.push(prefix); return out; }
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => flatten(v, `${prefix}[${i}]`, out));
    return out;
  }
  if (typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      if (k.startsWith('_')) continue; // skip _meta etc.
      flatten(v, prefix ? `${prefix}.${k}` : k, out);
    }
  }
  return out;
}

async function main() {
  const files = (await fs.readdir(LOCALES_DIR)).filter(f => f.endsWith('.json'));
  const en = JSON.parse(await fs.readFile(path.join(LOCALES_DIR, 'en.json'), 'utf8'));
  const enKeys = new Set(flatten(en));
  let bad = false;

  for (const f of files) {
    if (f === 'en.json') continue;
    const data = JSON.parse(await fs.readFile(path.join(LOCALES_DIR, f), 'utf8'));
    const keys = new Set(flatten(data));
    const missing = [...enKeys].filter(k => !keys.has(k));
    const extra = [...keys].filter(k => !enKeys.has(k));
    const status = missing.length === 0 ? 'OK ' : 'FAIL';
    console.log(`[${status}] ${f.padEnd(14)} missing=${missing.length}  extra=${extra.length}`);
    if (missing.length) {
      bad = true;
      missing.slice(0, 8).forEach(k => console.log(`         - ${k}`));
      if (missing.length > 8) console.log(`         (+${missing.length - 8} more)`);
    }
  }
  process.exit(bad ? 1 : 0);
}

main().catch(err => { console.error(err); process.exit(1); });
