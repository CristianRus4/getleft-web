#!/usr/bin/env node
// Translation coverage, staleness and quality gate for the site catalogs.
//
//   node scripts/check-i18n.mjs                 # report: missing / extra / stale keys, hash-family coverage
//   node scripts/check-i18n.mjs --gate          # also run the translation engine; fail on real errors
//   node scripts/check-i18n.mjs --accept <loc>  # record the current English source for every translated
//                                               # key of <loc> (run after reviewing a translation pass)
//
// Staleness: i18n/source-hashes/<loc>.json records, per site key, a hash of the English text the
// translation was made from. When en.json changes, the key reports as stale until the translator
// updates it and runs --accept. Missing keys fall back to English at build time (allowed); the gate
// fails only on engine errors (placeholders, markup, protected terms…) in keys that are not stale.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { ROOT, ALL_LOCALES, SOURCE_LOCALE, FAMILIES, readJson } from './lib/site.mjs';

const ENGINE = '/Users/cristian/Developer/Tools/translation-engine/bin/translation-engine.js';
const args = process.argv.slice(2);
const GATE = args.includes('--gate');
const acceptIdx = args.indexOf('--accept');
const ACCEPT = acceptIdx >= 0 ? args[acceptIdx + 1] : null;

function flatten(obj, prefix = '', out = {}) {
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => flatten(v, `${prefix}[${i}]`, out));
  } else if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      if (k.startsWith('_')) continue;
      flatten(v, prefix ? `${prefix}.${k}` : k, out);
    }
  } else if (typeof obj === 'string') {
    out[prefix] = obj;
  }
  return out;
}

const hash = s => crypto.createHash('sha1').update(String(s)).digest('hex').slice(0, 12);

async function main() {
  const en = flatten(await readJson('i18n/locales/en.json'));
  const targets = ALL_LOCALES.filter(l => l.code !== SOURCE_LOCALE);

  if (ACCEPT) {
    const loc = await readJson(`i18n/locales/${ACCEPT}.json`);
    if (!loc) { console.error(`[check-i18n] no catalog for ${ACCEPT}`); process.exit(1); }
    const flat = flatten(loc);
    const recorded = {};
    for (const key of Object.keys(en).sort()) if (flat[key]) recorded[key] = hash(en[key]);
    await fs.mkdir(path.join(ROOT, 'i18n/source-hashes'), { recursive: true });
    await fs.writeFile(path.join(ROOT, `i18n/source-hashes/${ACCEPT}.json`), JSON.stringify(recorded, null, 2) + '\n');
    console.log(`[check-i18n] ${ACCEPT}: recorded ${Object.keys(recorded).length} keys as current.`);
    return;
  }

  const staleKeys = new Map();
  console.log('Site catalog (home, support, contact):');
  console.log('  locale    missing  extra  stale');
  for (const l of targets) {
    const catalog = await readJson(`i18n/locales/${l.code}.json`);
    if (!catalog) { console.log(`  ${l.code.padEnd(9)} (no catalog yet)`); continue; }
    const flat = flatten(catalog);
    const recorded = (await readJson(`i18n/source-hashes/${l.code}.json`)) || {};
    const missing = Object.keys(en).filter(k => !(k in flat) || flat[k] === '');
    const extra = Object.keys(flat).filter(k => !(k in en));
    const stale = Object.keys(en).filter(k => k in flat && flat[k] !== '' && recorded[k] !== hash(en[k]));
    staleKeys.set(l.code, new Set(stale));
    console.log(`  ${l.code.padEnd(9)} ${String(missing.length).padStart(7)} ${String(extra.length).padStart(6)} ${String(stale.length).padStart(6)}`);
    if (args.includes('--verbose')) {
      if (missing.length) console.log(`    missing: ${missing.slice(0, 40).join(', ')}${missing.length > 40 ? '…' : ''}`);
      if (stale.length) console.log(`    stale: ${stale.slice(0, 40).join(', ')}${stale.length > 40 ? '…' : ''}`);
      if (extra.length) console.log(`    extra: ${extra.slice(0, 20).join(', ')}${extra.length > 20 ? '…' : ''}`);
    }
  }

  for (const f of FAMILIES.filter(f => f.mode === 'hash')) {
    const enCat = await readJson(`${f.catalogDir}/en.json`);
    if (!enCat) continue;
    const enFlat = flatten(enCat);
    const total = Object.keys(enFlat).length;
    const parts = [];
    for (const l of targets) {
      const cat = await readJson(`${f.catalogDir}/${l.code}.json`);
      if (!cat) continue;
      const flat = flatten(cat);
      const done = Object.keys(enFlat).filter(k => flat[k]).length;
      const orphan = Object.keys(flat).filter(k => !(k in enFlat)).length;
      parts.push(`${l.code} ${Math.round(100 * done / Math.max(total, 1))}%${orphan ? ` (${orphan} orphaned)` : ''}`);
    }
    console.log(`${f.id} catalog: ${total} English units; ${parts.length ? parts.join(', ') : 'no translations yet'}`);
  }

  if (!GATE) return;

  let report;
  try {
    report = JSON.parse(execFileSync('node', [ENGINE, 'audit', '--config', 'docs/translation.config.json'], { cwd: ROOT, maxBuffer: 512 * 1024 * 1024 }).toString());
  } catch (err) {
    // audit exits 1 when errors exist; the JSON is still on stdout.
    report = JSON.parse(err.stdout.toString());
  }
  const blocking = [];
  for (const cat of report.catalogs || []) {
    for (const issue of cat.issues || []) {
      if (issue.severity !== 'error') continue;
      if (issue.kind === 'missing' || issue.kind === 'empty') continue;
      if (cat.id === 'left-website' && staleKeys.get(issue.locale)?.has(issue.key)) continue;
      blocking.push(issue);
    }
  }
  if (blocking.length) {
    console.error(`\n[check-i18n] GATE FAILED: ${blocking.length} translation error(s) in current (non-stale) units:`);
    for (const i of blocking.slice(0, 60)) console.error(`  ${i.catalog} ${i.locale} ${i.key}: ${i.kind}: ${i.detail}`);
    process.exit(1);
  }
  console.log('\n[check-i18n] Gate passed: no placeholder, markup, protected-term or structure errors in current translations.');
}

main().catch(err => { console.error(err); process.exit(1); });
