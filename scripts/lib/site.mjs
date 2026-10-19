// Shared helpers for the site build: the locale registry, page families,
// URL mapping and git-based last-modified dates.

import { promises as fs, existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

const REGISTRY = JSON.parse(readFileSync(path.join(ROOT, 'i18n', 'locales.json'), 'utf8'));

export const SITE_ORIGIN = REGISTRY.siteOrigin;
export const SOURCE_LOCALE = REGISTRY.sourceLocale;
export const ALL_LOCALES = REGISTRY.locales;
export const FAMILIES = REGISTRY.families;
export const HASH_MIN_COVERAGE = REGISTRY.hashFamilyMinCoverage ?? 0.9;

// A locale is live once its site catalog exists; registry entries without one
// (a language being added) produce no pages, links or hreflang yet.
export const LOCALES = ALL_LOCALES.filter(l =>
  l.code === SOURCE_LOCALE || existsSync(path.join(ROOT, 'i18n', 'locales', `${l.code}.json`)));
export const TARGET_LOCALES = LOCALES.filter(l => l.code !== SOURCE_LOCALE);
export const LOCALE_CODES = LOCALES.map(l => l.code);

export function localePrefixRegex() {
  return new RegExp(`^/(${ALL_LOCALES.map(l => l.code).filter(c => c !== SOURCE_LOCALE).join('|')})(/|$)`);
}

export async function listFamilyPages(family) {
  const out = [];
  for (const pattern of family.pages) {
    if (pattern.includes('*')) {
      const dir = path.dirname(pattern);
      let entries = [];
      try { entries = await fs.readdir(path.join(ROOT, dir)); } catch { continue; }
      for (const e of entries.sort()) if (e.endsWith('.html')) out.push(`${dir}/${e}`);
    } else if (existsSync(path.join(ROOT, pattern))) {
      out.push(pattern);
    }
  }
  return [...new Set(out)];
}

// 'index.html' → '', 'blog/index.html' → 'blog/', 'support/x.html' → 'support/x'
export function pageToUrlPath(page) {
  if (page === 'index.html') return '';
  if (page.endsWith('/index.html')) return page.slice(0, -'index.html'.length);
  return page.replace(/\.html$/, '');
}

export function pageUrl(page, localeCode = SOURCE_LOCALE) {
  const prefix = localeCode === SOURCE_LOCALE ? '' : `${localeCode}/`;
  return `${SITE_ORIGIN}/${prefix}${pageToUrlPath(page)}`;
}

// available: Set of locale codes that have this page (always includes the source locale).
export function hreflangEntries(page, available) {
  const entries = [{ hreflang: 'x-default', href: pageUrl(page, SOURCE_LOCALE) }];
  for (const loc of LOCALES) {
    if (!available.has(loc.code)) continue;
    for (const code of loc.hreflang) entries.push({ hreflang: code, href: pageUrl(page, loc.code) });
  }
  return entries;
}

export function hreflangBlock(page, available, indent = '  ') {
  const lines = ['<!-- i18n:hreflang:start -->'];
  for (const e of hreflangEntries(page, available)) {
    lines.push(`${indent}<link rel="alternate" hreflang="${e.hreflang}" href="${e.href}" />`);
  }
  lines.push(`${indent}<!-- i18n:hreflang:end -->`);
  return lines.join('\n');
}

let gitDates = null;
// Last commit date (YYYY-MM-DD) of each tracked file, read in one git pass.
// Files with uncommitted changes count as modified today.
export function lastModified(files) {
  if (!gitDates) {
    gitDates = new Map();
    try {
      const log = execFileSync('git', ['log', '--format=%x00%cs', '--name-only'], { cwd: ROOT, maxBuffer: 256 * 1024 * 1024 }).toString();
      let date = null;
      for (const line of log.split('\n')) {
        if (line.startsWith('\0')) { date = line.slice(1); continue; }
        if (line && date && !gitDates.has(line)) gitDates.set(line, date);
      }
      const dirty = execFileSync('git', ['status', '--porcelain'], { cwd: ROOT }).toString();
      const today = new Date().toISOString().slice(0, 10);
      for (const line of dirty.split('\n')) {
        const f = line.slice(3).trim();
        if (f) gitDates.set(f.replace(/^"|"$/g, ''), today);
      }
    } catch { /* not a git checkout: fall through to today */ }
  }
  let best = null;
  for (const f of files) {
    const d = gitDates.get(f);
    if (d && (!best || d > best)) best = d;
  }
  return best || new Date().toISOString().slice(0, 10);
}

export function escapeText(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

export async function readJson(file, fallback = null) {
  try { return JSON.parse(await fs.readFile(path.join(ROOT, file), 'utf8')); }
  catch (err) { if (err.code === 'ENOENT') return fallback; throw err; }
}
