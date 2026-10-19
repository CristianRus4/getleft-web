#!/usr/bin/env node
// Checks for drip publishing (scripts/lib/publish.mjs, i18n/publish-schedule.json).
//
//   node scripts/check-publish.mjs              schedule checks on the built tree (part of build.mjs)
//   node scripts/check-publish.mjs --selftest   also builds a throwaway copy of the repo on three
//                                               fixture dates and checks what is live on each
//
// Fails on:
//   - a malformed schedule: bad dates, unknown family or locale, odd page paths
//   - two future releases, or two future English pages, on the same day (policy: one of each per day)
//   - a future page missing from scheduled/, or already at its live path
//   - any live page, sitemap.xml or llms.txt linking to a page that is still scheduled
//     (links are not rewritten: add the link on or after the page's date)
//   - a locale copy or sitemap URL for a family/locale whose release has not come

import { promises as fs, existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { ROOT, SITE_ORIGIN, ALL_LOCALES, SOURCE_LOCALE, FAMILIES, listFamilyPages, pageToUrlPath, pageUrl } from './lib/site.mjs';
import { SCHEDULE_FILE, SCHEDULED_DIR, CALENDAR_FILE, buildDate, isDate, isReleased, loadSchedule, pendingPages, scheduledFiles } from './lib/publish.mjs';
import { englishPages } from './site-inject.mjs';

const errors = [];
const warnings = [];
const fail = msg => errors.push(msg);

const TARGET_CODES = new Set(ALL_LOCALES.map(l => l.code).filter(c => c !== SOURCE_LOCALE));
const HASH_FAMILIES = new Map(FAMILIES.filter(f => f.mode === 'hash').map(f => [f.id, f]));

function checkShape(raw) {
  for (const k of Object.keys(raw)) {
    if (k !== 'pages' && k !== 'releases' && !k.startsWith('_')) fail(`${SCHEDULE_FILE}: unknown key "${k}" (use "pages" and "releases")`);
  }
  for (const [key, d] of Object.entries(raw.releases || {})) {
    const [family, loc, extra] = key.split('/');
    if (extra !== undefined || !HASH_FAMILIES.has(family)) fail(`${SCHEDULE_FILE}: release "${key}" must be <family>/<locale> with family ${[...HASH_FAMILIES.keys()].join(', ')}`);
    else if (!TARGET_CODES.has(loc)) fail(`${SCHEDULE_FILE}: release "${key}" names unknown locale "${loc}"`);
    if (!isDate(d)) fail(`${SCHEDULE_FILE}: release "${key}" date "${d}" is not YYYY-MM-DD`);
  }
  for (const [page, d] of Object.entries(raw.pages || {})) {
    if (!/^[a-z0-9][a-z0-9._/-]*\.html$/.test(page) || page.includes('..') || page.startsWith(`${SCHEDULED_DIR}/`)) {
      fail(`${SCHEDULE_FILE}: page "${page}" must be the live path relative to the repo root, e.g. blog/new-article.html`);
    }
    if (!isDate(d)) fail(`${SCHEDULE_FILE}: page "${page}" date "${d}" is not YYYY-MM-DD`);
  }
}

function checkOnePerDay(entries, what, date) {
  const byDay = new Map();
  for (const [k, d] of entries) if (d > date) byDay.set(d, [...(byDay.get(d) || []), k]);
  for (const [d, ks] of byDay) if (ks.length > 1) fail(`${SCHEDULE_FILE}: ${ks.length} ${what} on ${d} (${ks.join(', ')}); the policy allows one per day`);
}

// '/blog/x', '/blog/x.html', 'https://getleft.app/blog/x?y#z' → '/blog/x'
function normalizeHref(href) {
  if (href.startsWith(SITE_ORIGIN + '/')) href = href.slice(SITE_ORIGIN.length);
  if (!href.startsWith('/')) return null;
  return href.replace(/[?#].*$/, '').replace(/\.html$/, '').replace(/\/index$/, '/');
}

async function liveFiles() {
  const files = await englishPages();
  for (const loc of TARGET_CODES) {
    const walk = async rel => {
      for (const e of await fs.readdir(path.join(ROOT, rel), { withFileTypes: true })) {
        const r = `${rel}/${e.name}`;
        if (e.isDirectory()) await walk(r);
        else if (e.name.endsWith('.html')) files.push(r);
      }
    };
    if (existsSync(path.join(ROOT, loc))) await walk(loc);
  }
  return files;
}

async function checkTree(date) {
  const raw = existsSync(path.join(ROOT, SCHEDULE_FILE)) ? JSON.parse(await fs.readFile(path.join(ROOT, SCHEDULE_FILE), 'utf8')) : {};
  checkShape(raw);
  const { pages, releases } = loadSchedule();
  checkOnePerDay(Object.entries(releases), 'releases', date);
  checkOnePerDay(Object.entries(pages), 'English pages', date);

  const pending = pendingPages(date);
  for (const page of pending) {
    if (!existsSync(path.join(ROOT, SCHEDULED_DIR, page))) fail(`${page} is scheduled for ${pages[page]} but ${SCHEDULED_DIR}/${page} does not exist`);
    if (existsSync(path.join(ROOT, page))) fail(`${page} is scheduled for ${pages[page]} but is already live at ${page}; move it to ${SCHEDULED_DIR}/${page}`);
  }
  for (const [page, d] of Object.entries(pages)) {
    if (d <= date && !existsSync(path.join(ROOT, page))) warnings.push(`${page} was due on ${d} but does not exist`);
  }
  for (const f of scheduledFiles()) if (!(f in pages)) warnings.push(`${SCHEDULED_DIR}/${f} has no date in ${SCHEDULE_FILE}; it stays unpublished`);

  // Nothing live may link to a page that is still scheduled.
  if (pending.length) {
    const target = new Map(pending.map(p => [`/${pageToUrlPath(p)}`, p]));
    const sources = [...await liveFiles(), 'sitemap.xml', 'llms.txt'].filter(f => existsSync(path.join(ROOT, f)));
    for (const file of sources) {
      const text = await fs.readFile(path.join(ROOT, file), 'utf8');
      const hrefs = [...text.matchAll(/(?:href|src)="([^"]+)"/g), ...text.matchAll(/<loc>([^<]+)<\/loc>/g), ...text.matchAll(/\]\(([^)\s]+)\)/g)].map(m => m[1]);
      for (const href of hrefs) {
        const p = target.get(normalizeHref(href));
        if (p) fail(`${file} links to ${href}, which is scheduled for ${pages[p]}; remove the link until then (or link it on that day)`);
      }
    }
  }

  // Held family/locales: no copies, no sitemap entries.
  const sitemap = await fs.readFile(path.join(ROOT, 'sitemap.xml'), 'utf8');
  for (const f of HASH_FAMILIES.values()) {
    const fp = await listFamilyPages(f);
    for (const loc of TARGET_CODES) {
      if (isReleased(f.id, loc, date)) continue;
      for (const page of fp) {
        if (existsSync(path.join(ROOT, loc, page))) fail(`${loc}/${page} exists but ${f.id}/${loc} is not released`);
        if (sitemap.includes(`${pageUrl(page, loc)}<`) || sitemap.includes(`href="${pageUrl(page, loc)}"`)) fail(`sitemap.xml lists ${pageUrl(page, loc)} but ${f.id}/${loc} is not released`);
      }
    }
  }
}

// ─── self-test on a throwaway copy ───

async function selftest() {
  const real = loadSchedule();
  const today = buildDate();
  // Fixture: the live wildcard-family release with the most copies, and a new page in that family
  // that is a copy of one of its translated pages (so its translation exists the moment it is promoted).
  let best = null;
  for (const [key, d] of Object.entries(real.releases)) {
    const [family, loc] = key.split('/');
    const f = HASH_FAMILIES.get(family);
    if (!f || d > today || !f.pages.some(p => p.includes('*'))) continue;
    const copies = (await listFamilyPages(f)).filter(p => existsSync(path.join(ROOT, loc, p)) && !p.endsWith('/index.html'));
    if (!best || copies.length > best.copies.length) best = { key, f, loc, copies };
  }
  if (!best || !best.copies.length) throw new Error('selftest needs a released blog or tools locale with at least one copy');
  const { key: relKey, f: family, loc, copies } = best;
  const dir = path.posix.dirname(family.pages.find(p => p.includes('*')));
  const fixturePage = `${dir}/zz-publish-fixture.html`;
  const D0 = '2099-06-01', D1 = '2099-06-02', D2 = '2099-06-03'; // release on D1, new page on D2

  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'left-publish-'));
  const skip = new Set(['.git', 'node_modules', '.wrangler', 'images', 'fonts', 'templates-photos', ...TARGET_CODES]);
  await fs.cp(ROOT, tmp, { recursive: true, filter: src => !skip.has(path.relative(ROOT, src).split(path.sep)[0]) });
  console.log(`[check-publish] selftest in ${tmp}: release ${relKey} on ${D1}, new page ${fixturePage} on ${D2}`);

  const schedule = { pages: { ...real.pages, [fixturePage]: D2 }, releases: { ...real.releases, [relKey]: D1 } };
  await fs.writeFile(path.join(tmp, SCHEDULE_FILE), JSON.stringify(schedule, null, 2) + '\n');
  await fs.mkdir(path.join(tmp, SCHEDULED_DIR, dir), { recursive: true });
  await fs.copyFile(path.join(ROOT, copies[0]), path.join(tmp, SCHEDULED_DIR, fixturePage));
  // Hash catalogs are keyed by page slug: give the fixture the source page's translation.
  const slugOf = p => p.slice(dir.length + 1).replace(/\.html$/, '');
  const catFile = path.join(tmp, family.catalogDir, `${loc}.json`);
  const cat = JSON.parse(await fs.readFile(catFile, 'utf8'));
  cat[family.id][slugOf(fixturePage)] = cat[family.id][slugOf(copies[0])];
  await fs.writeFile(catFile, JSON.stringify(cat, null, 2) + '\n');

  const T = rel => path.join(tmp, rel);
  const read = rel => fs.readFile(T(rel), 'utf8');
  const results = [];
  const expect = (ok, msg) => results.push([ok, msg]);
  const run = (script, date) => {
    try {
      execFileSync('node', script, { cwd: tmp, encoding: 'utf8', stdio: 'pipe', env: { ...process.env, BUILD_DATE: date, LEFT_SKIP_I18N_GATE: '1' } });
      return { ok: true, out: '' };
    } catch (err) {
      return { ok: false, out: `${err.stdout || ''}${err.stderr || ''}` };
    }
  };
  const build = date => {
    const r = run(['scripts/build.mjs'], date);
    expect(r.ok, `${date}: build passes`);
    if (!r.ok) console.error(r.out.split('\n').slice(-25).join('\n'));
  };
  const allFamilyPages = async () => (await fs.readdir(T(dir))).filter(e => e.endsWith('.html')).map(e => `${dir}/${e}`);
  const familyCopies = async () => (await allFamilyPages()).filter(p => existsSync(T(`${loc}/${p}`)));

  // D0: release and page both held.
  build(D0);
  let sitemap = await read('sitemap.xml');
  expect((await familyCopies()).length === 0, `${D0}: no ${loc}/${dir}/ copies before the release`);
  expect(!sitemap.includes(`${SITE_ORIGIN}/${loc}/${dir}/`), `${D0}: sitemap has no ${loc}/${dir}/ URL or hreflang`);
  let leaks = 0;
  for (const p of copies) if ((await read(p)).includes(`href="${pageUrl(p, loc)}"`)) leaks++;
  expect(leaks === 0, `${D0}: English ${dir} pages carry no hreflang or link to ${loc}`);
  expect(existsSync(T(`${loc}/index.html`)), `${D0}: the site family (${loc}/index.html) is never held`);
  expect(existsSync(T(`${SCHEDULED_DIR}/${fixturePage}`)) && !existsSync(T(fixturePage)), `${D0}: ${fixturePage} waits in ${SCHEDULED_DIR}/`);
  expect(!sitemap.includes(pageUrl(fixturePage)), `${D0}: ${fixturePage} is not in the sitemap`);
  expect((await read(CALENDAR_FILE)).includes(`| ${D1} | \`${relKey}\``) && /\| scheduled \|/.test(await read(CALENDAR_FILE)), `${D0}: calendar lists the release as scheduled`);

  // A live page linking to the scheduled page fails the schedule check.
  const host = copies[1] || copies[0];
  const hostHtml = await read(host);
  await fs.writeFile(T(host), hostHtml.replace('</body>', `<a href="/${pageToUrlPath(fixturePage)}">soon</a>\n</body>`));
  const linked = run(['scripts/check-publish.mjs'], D0);
  expect(!linked.ok && linked.out.includes(`${host} links to /${pageToUrlPath(fixturePage)}`), `${D0}: a link from ${host} to the scheduled page fails the check`);
  await fs.writeFile(T(host), hostHtml);

  // D1: release live, page still held, so no translation of it either.
  build(D1);
  sitemap = await read('sitemap.xml');
  const live = await familyCopies();
  expect(live.length >= copies.length, `${D1}: ${live.length} ${loc}/${dir}/ copies published (${copies.length} live today)`);
  let bad = [];
  for (const p of live) {
    const html = await read(`${loc}/${p}`);
    const en = await read(p);
    const noindex = s => /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(s);
    if (noindex(html) !== noindex(en)) bad.push(`${p}: robots differs from English`);
    else if (!noindex(html) && !sitemap.includes(`<loc>${pageUrl(p, loc)}</loc>`)) bad.push(`${p}: not in sitemap`);
    else if (!html.includes(`<link rel="canonical" href="${pageUrl(p, loc)}" />`)) bad.push(`${p}: canonical`);
    else if (!en.includes(`hreflang="${ALL_LOCALES.find(l => l.code === loc).hreflang[0]}" href="${pageUrl(p, loc)}"`)) bad.push(`${p}: English hreflang`);
  }
  expect(bad.length === 0, `${D1}: every ${loc}/${dir}/ copy is indexable, in the sitemap and in hreflang${bad.length ? `: ${bad.slice(0, 3).join('; ')}` : ''}`);
  expect(!existsSync(T(fixturePage)) && !existsSync(T(`${loc}/${fixturePage}`)), `${D1}: the new page and its translation stay held`);

  // D2: page promoted, normalised, translated in the same build.
  build(D2);
  sitemap = await read('sitemap.xml');
  expect(existsSync(T(fixturePage)) && !existsSync(T(`${SCHEDULED_DIR}/${fixturePage}`)), `${D2}: ${fixturePage} moved into place`);
  const fx = existsSync(T(fixturePage)) ? await read(fixturePage) : '';
  expect(fx.includes(`<link rel="canonical" href="${pageUrl(fixturePage)}" />`) && sitemap.includes(`<loc>${pageUrl(fixturePage)}</loc>`), `${D2}: ${fixturePage} has its own canonical and is in the sitemap`);
  expect(existsSync(T(`${loc}/${fixturePage}`)) && sitemap.includes(`<loc>${pageUrl(fixturePage, loc)}</loc>`), `${D2}: its ${loc} copy is published with it`);
  expect((await read(`i18n/${family.id}/en.json`)).includes(`"${slugOf(fixturePage)}"`), `${D2}: the build extracts its English for translation`);
  expect(!/\| scheduled \|/.test(await read(CALENDAR_FILE)), `${D2}: calendar shows both items live`);

  for (const [ok, msg] of results) console.log(`  ${ok ? '✓' : '✗'} ${msg}`);
  const failed = results.filter(([ok]) => !ok).length;
  if (failed) {
    console.error(`[check-publish] selftest FAILED (${failed}); copy kept at ${tmp}`);
    process.exit(1);
  }
  await fs.rm(tmp, { recursive: true, force: true });
  console.log(`[check-publish] selftest passed (${results.length} checks).`);
}

async function main() {
  const date = buildDate();
  await checkTree(date);
  for (const w of warnings) console.warn(`  warning: ${w}`);
  if (errors.length) {
    console.error(`[check-publish] FAILED with ${errors.length} problem(s):`);
    for (const e of errors.slice(0, 40)) console.error(`  ${e}`);
    process.exit(1);
  }
  const { pages, releases } = loadSchedule();
  console.log(`[check-publish] OK (${date}): ${Object.values(releases).filter(d => d <= date).length} releases live, ${Object.values(releases).filter(d => d > date).length} scheduled; ${pendingPages(date).length} of ${Object.keys(pages).length} English pages waiting.`);
  if (process.argv.includes('--selftest')) await selftest();
}

main().catch(err => { console.error(`[check-publish] ${err.stack || err.message}`); process.exit(1); });
