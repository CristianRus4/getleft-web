// Drip publishing: what the schedule in i18n/publish-schedule.json lets go live on a given day.
//
//   pages     new English pages. Until its date a page waits in scheduled/<path>, which the site
//             build skips and the live site 404s; on or after its date the build moves it to <path>.
//   releases  "<family>/<locale>" for the hash families (blog, tools, pages). A locale copy of a
//             hash-family page is published only once its release date has come; a family/locale
//             with no date is held. The "site" family (home, support, contact) is never scheduled.
//
// Dates are New Zealand dates (Pacific/Auckland). BUILD_DATE=YYYY-MM-DD overrides today.
//
//   node scripts/lib/publish.mjs --commit-message   one-line summary of the staged changes (CI)

import { promises as fs, existsSync, readFileSync, renameSync, mkdirSync, readdirSync, rmdirSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { ROOT, ALL_LOCALES, SOURCE_LOCALE, FAMILIES } from './site.mjs';

export const SCHEDULE_FILE = 'i18n/publish-schedule.json';
export const SCHEDULED_DIR = 'scheduled';
export const CALENDAR_FILE = 'docs/seo/publish-schedule.md';
export const TIME_ZONE = 'Pacific/Auckland';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isDate(s) {
  if (typeof s !== 'string' || !DATE_RE.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

// Today in New Zealand, or BUILD_DATE.
export function buildDate() {
  const env = process.env.BUILD_DATE;
  if (env) {
    if (!isDate(env)) throw new Error(`BUILD_DATE must be YYYY-MM-DD, got "${env}"`);
    return env;
  }
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date()).map(p => [p.type, p.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

let cached = null;
export function loadSchedule() {
  if (cached) return cached;
  const file = path.join(ROOT, SCHEDULE_FILE);
  const raw = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {};
  cached = { pages: raw.pages || {}, releases: raw.releases || {} };
  return cached;
}

export function isReleased(family, loc, date = buildDate()) {
  const d = loadSchedule().releases[`${family}/${loc}`];
  return typeof d === 'string' && d <= date;
}

// English pages whose date has not come yet.
export function pendingPages(date = buildDate()) {
  return Object.entries(loadSchedule().pages).filter(([, d]) => d > date).map(([p]) => p).sort();
}

// Moves every due page from scheduled/<path> to <path>. Returns the moved paths.
export function promoteDuePages(date = buildDate()) {
  const moved = [];
  for (const [page, d] of Object.entries(loadSchedule().pages).sort()) {
    if (d > date) continue;
    const src = path.join(ROOT, SCHEDULED_DIR, page);
    const dst = path.join(ROOT, page);
    if (!existsSync(src)) continue;
    if (existsSync(dst)) throw new Error(`${page} is due on ${d}, but both ${SCHEDULED_DIR}/${page} and ${page} exist; keep one`);
    mkdirSync(path.dirname(dst), { recursive: true });
    renameSync(src, dst);
    pruneEmptyDirs(path.dirname(src));
    moved.push(page);
  }
  return moved;
}

function pruneEmptyDirs(dir) {
  const stop = path.join(ROOT, SCHEDULED_DIR);
  while (dir.startsWith(stop + path.sep) && readdirSync(dir).length === 0) {
    rmdirSync(dir);
    dir = path.dirname(dir);
  }
}

// The family a page path belongs to ('blog/x.html' → blog family), or null.
export function familyOfPage(page) {
  for (const f of FAMILIES) {
    for (const pattern of f.pages) {
      if (pattern.includes('*')) {
        const dir = path.posix.dirname(pattern);
        if (page.startsWith(`${dir}/`) && page.endsWith('.html') && !page.slice(dir.length + 1).includes('/')) return f;
      } else if (page === pattern) {
        return f;
      }
    }
  }
  return null;
}

// Every file under scheduled/, relative to it.
export function scheduledFiles() {
  const out = [];
  const walk = rel => {
    const dir = path.join(ROOT, SCHEDULED_DIR, rel);
    if (!existsSync(dir)) return;
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) walk(r);
      else if (e.name.endsWith('.html')) out.push(r);
    }
  };
  walk('');
  return out.sort();
}

const localeName = code => ALL_LOCALES.find(l => l.code === code)?.name || code;

// docs/seo/publish-schedule.md. ready: Map "<family>/<loc>" → pages at or above the coverage threshold.
// No build date in the file, so it only changes when an item is added, goes live or gains pages.
export async function writeCalendar(date, ready) {
  const { pages, releases } = loadSchedule();
  const rows = [
    ...Object.entries(pages).map(([p, d]) => ({ d, item: `\`${p}\``, type: 'English page' })),
    ...Object.entries(releases).map(([k, d]) => {
      const [family, loc] = k.split('/');
      const n = ready.get(k) || 0;
      return { d, item: `\`${k}\`: ${family} in ${localeName(loc)}, ${n} page${n === 1 ? '' : 's'}`, type: 'Translation release' };
    }),
  ].sort((a, b) => a.d.localeCompare(b.d) || a.item.localeCompare(b.item));

  const held = [...ready.entries()].filter(([k, n]) => n > 0 && !(k in releases)).sort(([a], [b]) => a.localeCompare(b));
  const undated = scheduledFiles().filter(p => !(p in pages));

  const lines = [
    '# Publish schedule',
    '',
    `Generated by \`node scripts/build.mjs\` from \`${SCHEDULE_FILE}\`. Don't edit this file; edit the JSON (Lane 0 only).`,
    'Dates are New Zealand dates. The daily publish workflow runs at 07:15 NZ time; status is as of the last build.',
    '',
    '| Date | Item | Type | Status |',
    '|---|---|---|---|',
    ...rows.map(r => `| ${r.d} | ${r.item} | ${r.type} | ${r.d <= date ? 'live' : 'scheduled'} |`),
    '',
    '## Held translations',
    '',
    'Pages translated to at least 90% whose family/locale has no release date yet. They are not published.',
    '',
  ];
  if (held.length) {
    lines.push('| Release key | Language | Pages ready |', '|---|---|---|');
    for (const [k, n] of held) lines.push(`| \`${k}\` | ${localeName(k.split('/')[1])} | ${n} |`);
  } else {
    lines.push('None.');
  }
  lines.push('', '## Undated pages in `scheduled/`', '', 'These wait until they get a date in `pages`.', '');
  lines.push(undated.length ? undated.map(p => `- \`${SCHEDULED_DIR}/${p}\``).join('\n') : 'None.');

  const next = lines.join('\n') + '\n';
  const file = path.join(ROOT, CALENDAR_FILE);
  let prev = null;
  try { prev = await fs.readFile(file, 'utf8'); } catch {}
  if (prev !== next) await fs.writeFile(file, next);
}

// "Daily publish 2026-10-21: blog/fr, blog/new-article.html", from the staged changes.
export function commitMessage(date = buildDate()) {
  const added = execFileSync('git', ['diff', '--cached', '--no-renames', '--name-only', '--diff-filter=A'], { cwd: ROOT, encoding: 'utf8' })
    .split('\n').filter(Boolean);
  const { pages } = loadSchedule();
  const items = new Set();
  const locales = new Set(ALL_LOCALES.map(l => l.code).filter(c => c !== SOURCE_LOCALE));
  for (const f of added) {
    if (f in pages) { items.add(f); continue; }
    const [loc, ...rest] = f.split('/');
    if (!locales.has(loc)) continue;
    const family = familyOfPage(rest.join('/'));
    if (family?.mode === 'hash') items.add(`${family.id}/${loc}`);
  }
  const list = [...items].sort();
  return `Daily publish ${date}: ${list.length ? list.join(', ') : 'refresh generated files'}`;
}

if (import.meta.url === `file://${process.argv[1]}` && process.argv.includes('--commit-message')) {
  console.log(commitMessage());
}
