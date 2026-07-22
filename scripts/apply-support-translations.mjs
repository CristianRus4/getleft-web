#!/usr/bin/env node
// Apply re-aligned support-article SEO meta translations across all locales so
// each language's title/description/og match the updated English wording.
// Reads scripts/support-meta-translations.json:
//   { "<lang>": { "<articleKey>": { title, description, og_title?, og_description? } } }
// og_title defaults to title without the " | Left" suffix; og_description to description.
//
// Run:  node scripts/apply-support-translations.mjs   then build-i18n.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');

const data = JSON.parse(
  await fs.readFile(path.join(ROOT, 'scripts', 'support-meta-translations.json'), 'utf8')
);

function stripSuffix(title) {
  return title.replace(/\s*\|\s*Left\s*$/, '').trim();
}

let totalLangs = 0;
let totalFields = 0;
for (const [lang, articles] of Object.entries(data)) {
  const file = path.join(ROOT, 'i18n', 'locales', `${lang}.json`);
  let json;
  try {
    json = JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    console.warn(`[support-i18n] ${lang}: locale file missing/invalid, skipping`);
    continue;
  }
  const sa = json.support_articles;
  if (!sa) { console.warn(`[support-i18n] ${lang}: no support_articles, skipping`); continue; }

  let count = 0;
  for (const [key, m] of Object.entries(articles)) {
    if (!sa[key]) { console.warn(`[support-i18n] ${lang}: missing article ${key}`); continue; }
    sa[key].meta = sa[key].meta || {};
    if (m.title)       { sa[key].meta.title = m.title; count++; }
    if (m.description) { sa[key].meta.description = m.description; count++; }
    sa[key].og_title = m.og_title || (m.title ? stripSuffix(m.title) : sa[key].og_title);
    sa[key].og_description = m.og_description || m.description || sa[key].og_description;
    count += 2;
  }
  await fs.writeFile(file, JSON.stringify(json, null, 2) + '\n');
  totalLangs++;
  totalFields += count;
  console.log(`[support-i18n] ${lang}: updated ${Object.keys(articles).length} articles (${count} fields)`);
}
console.log(`[support-i18n] done - ${totalLangs} locales, ${totalFields} fields total`);
