#!/usr/bin/env node
// Build per-language copies of the site from the English source pages.
//
// Locales, hreflang codes and page families come from i18n/locales.json.
//   - "keys" families (home, support, contact) are annotated by hand with
//     data-i18n* attributes and read i18n/locales/<lang>.json.
//   - "hash" families (blog, tools, standalone pages) stay unannotated on disk;
//     scripts/lib/annotate.mjs annotates them in memory with content-hash keys,
//     the English units are written to i18n/<family>/en.json, and a locale copy
//     is emitted only once that page's translation coverage reaches
//     hashFamilyMinCoverage, so no locale URL serves mostly-English content.
// Every page's hreflang, language switcher and detect script list only the
// locales that actually have that page. The build also writes sitemap.xml.
// Drip publishing (scripts/lib/publish.mjs): a hash-family locale copy is also held
// until i18n/publish-schedule.json gives its "<family>/<locale>" release a date on or
// before the build date. Pages waiting in scheduled/ are not in any family yet.
//
// Usage:
//   node scripts/build-i18n.mjs                  # strict: fail on missing keys in "keys" families
//   node scripts/build-i18n.mjs --allow-missing  # English fallback for missing keys

import { promises as fs, existsSync } from 'node:fs';
import path from 'node:path';
import {
  ROOT, SITE_ORIGIN, SOURCE_LOCALE, LOCALES, TARGET_LOCALES, LOCALE_CODES, FAMILIES, HASH_MIN_COVERAGE,
  listFamilyPages, pageToUrlPath, pageUrl, hreflangBlock, lastModified, escapeText, escapeAttr, readJson,
} from './lib/site.mjs';
import { buildDate, isReleased, writeCalendar } from './lib/publish.mjs';

const args = new Set(process.argv.slice(2));
const ALLOW_MISSING = args.has('--allow-missing');
const VERBOSE = args.has('--verbose');
const DATE = buildDate();

const annotateModule = (!process.env.LEFT_SKIP_ANNOTATE && existsSync(path.join(ROOT, 'scripts/lib/annotate.mjs'))) ? await import('./lib/annotate.mjs') : null;
const appstore = (!process.env.LEFT_SKIP_APPSTORE && existsSync(path.join(ROOT, 'scripts/lib/appstore.mjs'))) ? await import('./lib/appstore.mjs') : null;
const { ctaFamily } = await import('./site-inject.mjs');

const INJECTION_MARK_START = '<!-- i18n:auto-detect:start -->';
const INJECTION_MARK_END = '<!-- i18n:auto-detect:end -->';
const SWITCHER_MARK_START = '<!-- i18n:switcher:start -->';
const SWITCHER_MARK_END = '<!-- i18n:switcher:end -->';

// English-only pages that are still indexable and belong in the sitemap.
const ENGLISH_ONLY_INDEXABLE = ['web.html'];

// Locale catalogs can keep FAQ items English has dropped; never publish more than English has.
let EN_FAQ_COUNT = Infinity;

async function main() {
  const families = [];
  for (const f of FAMILIES) {
    const pages = await listFamilyPages(f);
    families.push({ ...f, pages });
  }
  const pageFamily = new Map();
  for (const f of families) for (const p of f.pages) pageFamily.set(p, f);
  const allPages = families.flatMap(f => f.pages);

  console.log(`[i18n] Families: ${families.map(f => `${f.id}=${f.pages.length}`).join(', ')}`);
  console.log(`[i18n] Locales: ${LOCALES.length} (${TARGET_LOCALES.map(l => l.code).join(' ')})`);

  const enSite = await readJson('i18n/locales/en.json');
  if (!enSite) {
    console.error('[i18n] ERROR: i18n/locales/en.json missing - cannot proceed.');
    process.exit(1);
  }
  EN_FAQ_COUNT = (enSite.index && enSite.index.faq && enSite.index.faq.items || []).length;

  // 1. Annotate hash-family pages in memory and write their English catalogs.
  const annotated = new Map(); // page → { html, keys: string[] }
  for (const f of families.filter(f => f.mode === 'hash')) {
    const catalog = {};
    if (!annotateModule) {
      console.warn(`[i18n] scripts/lib/annotate.mjs missing: ${f.id} pages stay English-only.`);
      continue;
    }
    for (const page of f.pages) {
      const src = await fs.readFile(path.join(ROOT, page), 'utf8');
      const prefix = `${f.id}.${hashSlug(page)}`;
      const { html, entries } = annotateModule.annotateHash(src, prefix);
      catalog[hashSlug(page)] = sortObject(entries);
      annotated.set(page, { html, keys: Object.keys(entries).map(k => `${prefix}.${k}`) });
    }
    const extra = f.id === 'tools' ? await readJson('i18n/tools-runtime/en.json') : null;
    const doc = { [f.id]: sortObject(catalog) };
    if (extra) doc[f.id].runtime = extra;
    await writeJsonIfChanged(path.join(f.catalogDir, 'en.json'), doc);
  }

  // 2. Load every locale's catalogs, merged into one lookup tree per locale.
  const data = new Map();
  for (const loc of LOCALES) {
    const tree = loc.code === SOURCE_LOCALE ? structuredClone(enSite) : (await readJson(`i18n/locales/${loc.code}.json`)) || {};
    for (const f of families.filter(f => f.mode === 'hash')) {
      const cat = await readJson(`${f.catalogDir}/${loc.code}.json`);
      if (cat && cat[f.id]) tree[f.id] = cat[f.id];
    }
    data.set(loc.code, tree);
  }
  const enData = data.get(SOURCE_LOCALE);

  // 3. Which locales have which page.
  const availability = new Map(); // page → Set(locale codes)
  const ready = new Map(); // "<family>/<loc>" → pages at or above the threshold, released or not
  const coverageReport = [];
  for (const page of allPages) {
    const f = pageFamily.get(page);
    const set = new Set([SOURCE_LOCALE]);
    for (const loc of TARGET_LOCALES) {
      if (f.mode === 'keys') { set.add(loc.code); continue; }
      const a = annotated.get(page);
      if (!a || !a.keys.length) continue;
      const tree = data.get(loc.code);
      const done = a.keys.filter(k => typeof lookupRaw(tree, k) === 'string' && lookupRaw(tree, k).trim()).length;
      const ratio = done / a.keys.length;
      if (ratio >= HASH_MIN_COVERAGE) {
        const key = `${f.id}/${loc.code}`;
        ready.set(key, (ready.get(key) || 0) + 1);
        if (isReleased(f.id, loc.code, DATE)) set.add(loc.code);
      }
      if (done > 0) coverageReport.push(`${loc.code} ${page} ${(ratio * 100).toFixed(0)}%`);
    }
    availability.set(page, set);
  }
  if (VERBOSE && coverageReport.length) console.log(`[i18n] Hash-family coverage:\n  ${coverageReport.join('\n  ')}`);
  const held = [...ready].filter(([k]) => !isReleased(...k.split('/'), DATE));
  if (held.length) console.log(`[i18n] Held until scheduled (${DATE}): ${held.map(([k, n]) => `${k} ${n}`).join(', ')}`);
  await writeCalendar(DATE, ready);

  const urlToPage = new Map();
  for (const page of allPages) urlToPage.set('/' + pageToUrlPath(page), page);

  // 4. English sources: detect script, switcher, hreflang and generated JSON-LD.
  const detectTpl = await fs.readFile(path.join(ROOT, 'partials', 'detect.html'), 'utf8');
  const switcherTpl = await fs.readFile(path.join(ROOT, 'partials', 'switcher.html'), 'utf8');
  const enLocale = LOCALES.find(l => l.code === SOURCE_LOCALE);
  for (const page of allPages) {
    const file = path.join(ROOT, page);
    const before = await fs.readFile(file, 'utf8');
    const available = availability.get(page);
    let html = before;
    // The language redirect only matters where a translated copy exists.
    html = available.size > 1
      ? upsertInjection(html, INJECTION_MARK_START, INJECTION_MARK_END,
        `${INJECTION_MARK_START}\n${fillDetect(detectTpl, available)}\n${INJECTION_MARK_END}`,
        /<meta\s+name="viewport"[^>]*>/i)
      : stripInjection(html, INJECTION_MARK_START, INJECTION_MARK_END);
    html = upsertFooterSwitcher(html, `${SWITCHER_MARK_START}\n${fillSwitcher(switcherTpl, available)}\n${SWITCHER_MARK_END}`);
    html = setHreflang(html, page, available);
    html = setOgLocale(html, enLocale, available, page);
    if (pageFamily.get(page).mode === 'keys') {
      html = syncEnglishFromCatalog(html, enData);
      html = generateJsonLd(html, enData, enLocale, page);
      if (/^support\/.+\.html$/.test(page)) html = injectSupportArticleExtras(html, page, enData);
    }
    if (html !== before) await fs.writeFile(file, html);
  }

  // 5. Locale copies.
  let totalErrors = 0;
  for (const loc of TARGET_LOCALES) {
    const localeDir = path.join(ROOT, loc.code);
    await fs.rm(localeDir, { recursive: true, force: true });
    const tree = data.get(loc.code);
    let written = 0;
    for (const page of allPages) {
      if (!availability.get(page).has(loc.code)) continue;
      const f = pageFamily.get(page);
      const src = f.mode === 'hash' ? annotated.get(page).html : await fs.readFile(path.join(ROOT, page), 'utf8');
      const { html, missing } = transform(src, page, loc, tree, enData, { availability, urlToPage, family: f, switcherTpl });
      if (f.mode === 'keys') {
        totalErrors += missing.length;
        if (missing.length && VERBOSE) console.warn(`[i18n] ${loc.code} ${page}: ${missing.length} missing key(s): ${missing.slice(0, 5).join(', ')}${missing.length > 5 ? '…' : ''}`);
      }
      const dst = path.join(localeDir, page);
      await fs.mkdir(path.dirname(dst), { recursive: true });
      await fs.writeFile(dst, html);
      written++;
    }
    if (VERBOSE) console.log(`[i18n] ${loc.code}: ${written} pages`);
  }

  // 6. Sitemap.
  await writeSitemap(allPages, availability, pageFamily);

  if (totalErrors > 0 && !ALLOW_MISSING) {
    console.error(`[i18n] BUILD FAILED: ${totalErrors} missing-key errors. Re-run with --allow-missing to permit English fallback.`);
    process.exit(2);
  }
  const translatedHash = [...availability.entries()].filter(([p]) => pageFamily.get(p).mode === 'hash').reduce((n, [, s]) => n + s.size - 1, 0);
  console.log(`[i18n] Done. ${totalErrors} missing site key(s) fell back to English; ${translatedHash} translated blog/tool/page copies.`);
}

// ─── helpers ───

function hashSlug(page) {
  return page.replace(/^[^/]+\//, '').replace(/\.html$/, '').replace(/\//g, '~');
}

function sortObject(obj) {
  return Object.fromEntries(Object.keys(obj).sort().map(k => [k, obj[k]]));
}

async function writeJsonIfChanged(rel, obj) {
  const file = path.join(ROOT, rel);
  const next = JSON.stringify(obj, null, 2) + '\n';
  let prev = null;
  try { prev = await fs.readFile(file, 'utf8'); } catch {}
  if (prev === next) return;
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, next);
}

function aliasMap() {
  const map = {};
  for (const loc of LOCALES) {
    for (const tag of [loc.code, ...(loc.detect || [])]) {
      const t = tag.toLowerCase();
      if (!map[t]) map[t] = loc.code;
    }
  }
  return map;
}

function fillDetect(tpl, available) {
  return tpl.trim()
    .replace('__LOCALE_ALIASES__', JSON.stringify(aliasMap()))
    .replace('__AVAILABLE__', JSON.stringify(LOCALE_CODES.filter(c => available.has(c))));
}

function fillSwitcher(tpl, available) {
  const sorted = [...LOCALES].sort((a, b) => a.name.localeCompare(b.name, 'en'));
  const options = sorted.map(l => `    <button type="button" role="option" data-lang-option="${l.code}">${escapeText(l.name)}</button>`).join('\n');
  const json = Object.fromEntries(LOCALES.map(l => [l.code, { name: l.name, abbr: l.abbr }]));
  return tpl.trim()
    .replace('__SWITCHER_OPTIONS__', options)
    .replace('__LOCALES_JSON__', JSON.stringify(json))
    .replace('__AVAILABLE__', JSON.stringify(LOCALE_CODES.filter(c => available.has(c))));
}

function setHreflang(html, page, available) {
  const block = hreflangBlock(page, available);
  if (/<!-- i18n:hreflang:start -->/.test(html)) {
    return html.replace(/<!-- i18n:hreflang:start -->[\s\S]*?<!-- i18n:hreflang:end -->/, block);
  }
  return html.replace(/<link\s+rel="canonical"[^>]*\/?>/i, m => `${m}\n  ${block}`);
}

function setOgLocale(html, loc, available, page) {
  html = html.replace(/\s*<meta\s+property="og:locale(?::alternate)?"[^>]*>/gi, '');
  const alternates = LOCALES.filter(l => l.code !== loc.code && available.has(l.code))
    .map(l => `\n  <meta property="og:locale:alternate" content="${l.ogLocale}" />`).join('');
  const tag = `<meta property="og:locale" content="${loc.ogLocale}" />${alternates}`;
  if (/<meta\s+property="og:url"[^>]*>/i.test(html)) return html.replace(/(<meta\s+property="og:url"[^>]*>)/i, `$1\n  ${tag}`);
  if (/<meta\s+property="og:title"[^>]*>/i.test(html)) return html.replace(/(<meta\s+property="og:title"[^>]*>)/i, `$1\n  ${tag}`);
  return html;
}

function upsertInjection(html, startMark, endMark, payload, anchorRegex) {
  const startIdx = html.indexOf(startMark);
  const endIdx = html.indexOf(endMark);
  if (startIdx !== -1 && endIdx !== -1) {
    return html.slice(0, startIdx) + payload + html.slice(endIdx + endMark.length);
  }
  const m = anchorRegex.exec(html);
  if (!m) return html;
  const pos = m.index + m[0].length;
  return html.slice(0, pos) + '\n' + payload + '\n' + html.slice(pos);
}

function upsertFooterSwitcher(html, payload) {
  html = stripInjection(html, SWITCHER_MARK_START, SWITCHER_MARK_END);
  return html.replace(
    /(<nav\s+class="footer-links"[^>]*>[\s\S]*?)(\s*<\/nav>)/i,
    (full, before, close) => `${before}\n          ${payload.replace(/\n/g, '\n          ')}${close}`
  );
}

function stripInjection(html, startMark, endMark) {
  const startIdx = html.indexOf(startMark);
  const endIdx = html.indexOf(endMark);
  if (startIdx === -1 || endIdx === -1) return html;
  const before = html.slice(0, startIdx);
  const after = html.slice(endIdx + endMark.length);
  return (before.replace(/\s+$/, '') + '\n' + after.replace(/^\s+/, ''));
}

// en.json is the source of the English copy for hand-annotated pages: rewrite the
// inline English text and attributes from it, keeping the data-i18n* attributes.
function syncEnglishFromCatalog(html, enData) {
  const value = key => {
    const v = lookupRaw(enData, key);
    return typeof v === 'string' && v !== '' ? v : null;
  };
  html = html.replace(/<([a-zA-Z][\w-]*)([^>]*?)(\s)data-i18n="([^"]+)"([^>]*?)>([\s\S]*?)<\/\1>/g,
    (full, tag, before, ws, key, after, inner) => {
      const v = value(key);
      return v == null ? full : `<${tag}${before}${ws}data-i18n="${key}"${after}>${escapeText(v)}</${tag}>`;
    });
  html = html.replace(/<([a-zA-Z][\w-]*)([^>]*?)(\s)data-i18n-html="([^"]+)"([^>]*?)>([\s\S]*?)<\/\1>/g,
    (full, tag, before, ws, key, after, inner) => {
      const v = value(key);
      return v == null ? full : `<${tag}${before}${ws}data-i18n-html="${key}"${after}>${v}</${tag}>`;
    });
  html = html.replace(/<([a-zA-Z][\w-]*)\b([^>]*?\sdata-i18n-attr="([^"]+)"[^>]*?)(\/?)>/g, (full, tag, attrs, spec, slash) => {
    let out = attrs;
    for (const pair of spec.split(',')) {
      const idx = pair.indexOf(':');
      const attr = pair.slice(0, idx).trim();
      const v = value(pair.slice(idx + 1).trim());
      if (!attr || v == null) continue;
      const re = new RegExp(`(\\s${attr}=")[^"]*(")`, 'i');
      if (re.test(out)) out = out.replace(re, `$1${escapeAttr(v)}$2`);
    }
    return `<${tag}${out}${slash}>`;
  });
  return html;
}

// ─── Support-article scaffolding (TOC + related guides) ───
const SUPPORT_TOC_MARK_START = '<!-- i18n:support-toc:start -->';
const SUPPORT_TOC_MARK_END = '<!-- i18n:support-toc:end -->';
const SUPPORT_REL_MARK_START = '<!-- i18n:support-related:start -->';
const SUPPORT_REL_MARK_END = '<!-- i18n:support-related:end -->';
// Not shipped yet (Mood hidden in production, Apple Watch planned): not offered as related reading.
const UNLISTED_SUPPORT = new Set(['mood_tracker_in_left', 'world_mood_globe', 'apple_watch_app']);

function injectSupportArticleExtras(html, page, enData) {
  html = stripInjection(html, SUPPORT_TOC_MARK_START, SUPPORT_TOC_MARK_END);
  html = stripInjection(html, SUPPORT_REL_MARK_START, SUPPORT_REL_MARK_END);

  const currentSlug = page.replace(/^support\//, '').replace(/\.html$/, '');
  const currentArticle = currentSlug.replace(/-/g, '_');

  const h2s = [];
  html = html.replace(
    /<h2\b([^>]*?)\sdata-i18n="(support_articles\.[\w]+\.h2_\d+)"([^>]*)>([\s\S]*?)<\/h2>/g,
    (full, before, key, after, inner) => {
      const idMatch = key.match(/\.h2_(\d+)$/);
      const id = idMatch ? `s-h2-${idMatch[1]}` : null;
      if (!id) return full;
      if (/Start noticing/.test(inner)) return full;
      h2s.push({ id, key, fallback: inner.replace(/<[^>]+>/g, '').trim() });
      const merged = `${before}${after}`;
      if (/\sid=/.test(merged)) return full;
      return `<h2${before} id="${id}" data-i18n="${key}"${after}>${inner}</h2>`;
    }
  );

  if (h2s.length >= 2) {
    const tocItems = h2s.map(h =>
      `      <li><a href="#${h.id}" data-i18n="${h.key}">${escapeText(h.fallback)}</a></li>`
    ).join('\n');
    const tocBlock = [
      SUPPORT_TOC_MARK_START,
      `<nav class="article-toc" aria-label="On this page">`,
      `    <p class="article-toc-label" data-i18n="common.support_article.toc_label">On this page</p>`,
      `    <ul class="article-toc-list">`,
      tocItems,
      `    </ul>`,
      `  </nav>`,
      SUPPORT_TOC_MARK_END,
    ].join('\n');
    html = html.replace(/(<p\s+class="article-lede"[^>]*>[\s\S]*?<\/p>)/, (m) => `${m}\n  ${tocBlock}`);
  }

  const supportArticles = (enData && enData.support_articles) || {};
  const others = Object.keys(supportArticles)
    .filter(slug => slug !== currentArticle && !UNLISTED_SUPPORT.has(slug) && supportArticles[slug] && supportArticles[slug].h1_1)
    .sort();
  if (others.length) {
    const items = others.map(slug => {
      const fallback = escapeText((supportArticles[slug].h1_1 || '').replace(/<[^>]+>/g, '').trim());
      const href = `/support/${slug.replace(/_/g, '-')}`;
      return `      <a class="support-related-item" href="${href}" data-i18n="support_articles.${slug}.h1_1">${fallback}</a>`;
    }).join('\n');
    const relatedBlock = [
      SUPPORT_REL_MARK_START,
      `<section class="support-related">`,
      `    <h2 class="support-related-h2" data-i18n="common.support_article.related_heading">Related guides</h2>`,
      `    <div class="support-related-items">`,
      items,
      `    </div>`,
      `  </section>`,
      SUPPORT_REL_MARK_END,
    ].join('\n');
    if (/<section\s+class="download-block"/.test(html)) {
      html = html.replace(/(<section\s+class="download-block")/, `${relatedBlock}\n\n      $1`);
    } else {
      html = html.replace(/(<\/article>)/, `${relatedBlock}\n  $1`);
    }
  }
  return html;
}

// ─── HTML transform for one locale copy ───
function transform(html, pagePath, locale, data, enData, ctx) {
  const missing = [];

  html = stripInjection(html, INJECTION_MARK_START, INJECTION_MARK_END);

  html = html.replace(
    /<([a-zA-Z][\w-]*)([^>]*?)\sdata-i18n="([^"]+)"([^>]*?)>([\s\S]*?)<\/\1>/g,
    (full, tag, before, key, after) => {
      const value = lookup(data, key, enData, missing);
      const cleanedAttrs = `${before}${after}`.replace(/\s+/g, ' ').trim();
      return `<${tag}${cleanedAttrs ? ' ' + cleanedAttrs : ''}>${escapeText(value)}</${tag}>`;
    }
  );

  html = html.replace(
    /<([a-zA-Z][\w-]*)([^>]*?)\sdata-i18n-html="([^"]+)"([^>]*?)>([\s\S]*?)<\/\1>/g,
    (full, tag, before, key, after) => {
      const value = lookup(data, key, enData, missing);
      const cleanedAttrs = `${before}${after}`.replace(/\s+/g, ' ').trim();
      return `<${tag}${cleanedAttrs ? ' ' + cleanedAttrs : ''}>${value}</${tag}>`;
    }
  );

  const replaceAttrs = (combined, spec) => {
    for (const pair of spec.split(',')) {
      const idx = pair.indexOf(':');
      const attr = pair.slice(0, idx).trim();
      const key = pair.slice(idx + 1).trim();
      if (!attr || !key) continue;
      const value = lookup(data, key, enData, missing);
      const attrRegex = new RegExp(`\\s${attr}="[^"]*"`, 'i');
      if (attrRegex.test(combined)) combined = combined.replace(attrRegex, ` ${attr}="${escapeAttr(value)}"`);
      else combined += ` ${attr}="${escapeAttr(value)}"`;
    }
    return combined;
  };

  html = html.replace(
    /<(meta|link|img|input)\b([^>]*?)\sdata-i18n-attr="([^"]+)"([^>]*?)\/?>/gi,
    (full, tag, before, spec, after) => {
      const combined = replaceAttrs(`${before}${after}`, spec);
      return `<${tag}${combined}${full.endsWith('/>') ? ' />' : '>'}`;
    }
  );
  html = html.replace(
    /<([a-zA-Z][\w-]*)\b([^>]*?)\sdata-i18n-attr="([^"]+)"([^>]*?)>/g,
    (full, tag, before, spec, after) => {
      if (/^(meta|link|img|input)$/i.test(tag)) return full;
      return `<${tag}${replaceAttrs(`${before}${after}`, spec)}>`;
    }
  );

  html = html.replace(/<html\b([^>]*?)\s*\blang="[^"]*"([^>]*)>/i,
    (m, a, b) => `<html${a} lang="${locale.htmlLang}"${b}${locale.dir === 'rtl' ? ' dir="rtl"' : ''}>`);

  const localizedUrl = pageUrl(pagePath, locale.code);
  html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${localizedUrl}" />`);
  html = html.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${localizedUrl}" />`);

  const available = ctx.availability.get(pagePath);
  html = setHreflang(html, pagePath, available);
  html = setOgLocale(html, locale, available, pagePath);

  html = upsertFooterSwitcher(html, `${SWITCHER_MARK_START}\n${fillSwitcher(ctx.switcherTpl, available)}\n${SWITCHER_MARK_END}`);
  html = rewriteLinks(html, locale.code, ctx);
  html = rewriteRelativeAssetPaths(html);
  html = updateCustomSwitcher(html, locale);

  html = rewriteJsonLd(html, data, enData, missing);
  html = generateJsonLd(html, data, locale, pagePath);
  if (annotateModule?.translateJsonLd) {
    html = html.replace(
      /(<script\b[^>]*type="application\/ld\+json"[^>]*\sdata-i18n-ld="([^"]+)"[^>]*>)([\s\S]*?)(<\/script>)/g,
      (full, open, prefix, body, close) => {
        const out = annotateModule.translateJsonLd(body, suffix => {
          const v = lookupRaw(data, `${prefix}.${suffix}`);
          return typeof v === 'string' && v.trim() ? v : null;
        });
        return `${open}\n${out.trim()}\n${close}`;
      }
    );
    html = html.replace(/(<script\b[^>]*type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/g, (full, open, body, close) => {
      if (/"inLanguage"/.test(body) || !/"@context"/.test(body)) return full;
      try {
        const obj = JSON.parse(body);
        if (obj && typeof obj === 'object' && !Array.isArray(obj) && /Article|WebPage|WebApplication|FAQPage|HowTo|Blog/.test(String(obj['@type']))) {
          obj.inLanguage = locale.htmlLang;
          return `${open}\n${JSON.stringify(obj, null, 2)}\n${close}`;
        }
      } catch {}
      return full;
    });
  }

  if (ctx.family.id === 'tools') html = injectToolRuntime(html, data);

  if (appstore?.rewriteAppStoreLinks) {
    html = appstore.rewriteAppStoreLinks(html, { family: ctaFamily(pagePath), locale: locale.code });
  }

  html = html.replace(/\s+data-i18n(-attr|-html|-list|-list-template|-jsonld|-jsonld-generate|-ld)?="[^"]*"/g, '');
  return { html, missing };
}

function injectToolRuntime(html, data) {
  const runtime = data.tools && data.tools.runtime;
  if (!runtime || typeof runtime !== 'object') return html;
  const payload = `<script>window.LEFT_TOOL_I18N=${JSON.stringify(runtime).replace(/</g, '\\u003c')};</script>`;
  return html.replace(/(<script\s+src="\/tools\/tools\.js"[^>]*><\/script>)/, `${payload}\n  $1`);
}

function lookupRaw(data, key) {
  let cur = data;
  for (const p of splitKey(key)) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

function lookup(data, key, fallback, missing) {
  const cur = lookupRaw(data, key);
  if (typeof cur === 'string' && cur !== '') return cur;
  const fb = lookupRaw(fallback, key);
  missing.push(key);
  if (typeof fb === 'string') return fb;
  return `[[${key}]]`;
}

function splitKey(key) {
  return key.replace(/\[(\d+)\]/g, '.$1').split('.');
}

function rewriteLinks(html, langCode, ctx) {
  return html.replace(/href="(\/[^"#?]*)([?#][^"]*)?"/g, (full, p, qs) => {
    qs = qs || '';
    const clean = p === '/' ? '/' : p.replace(/\.html$/, '').replace(/\/index$/, '/');
    if (/^\/(images|favicon|left-icon|public|templates-photos|fonts)\//.test(clean)) return full;
    const page = ctx.urlToPage.get(clean);
    if (!page) return full; // not a translatable page: keep the English URL
    if (!ctx.availability.get(page).has(langCode)) return `href="${clean}${qs}"`;
    if (clean === '/') return `href="/${langCode}/${qs}"`;
    return `href="/${langCode}${clean}${qs}"`;
  });
}

function rewriteRelativeAssetPaths(html) {
  const assetPrefixes = ['images/', 'favicon/', 'left-icon/', 'public/', 'style.css', 'index.js', 'reviews.json',
    'TemplateLibrary.json', 'left.webmanifest', 'web.css', 'tools/tools.css', 'tools/tools.js', 'analytics.js'];
  const attrs = ['href', 'src', 'content', 'data-final-src', 'data-action-image', 'data-action-image-dark', 'data-feature-image', 'data-feature-image-dark'];
  return html.replace(new RegExp(`\\b(${attrs.join('|')})="([^"#?:][^"]*)"`, 'g'), (full, attr, value) => {
    if (value.startsWith('/')) return full;
    if (!assetPrefixes.some(prefix => value === prefix || value.startsWith(prefix))) return full;
    return `${attr}="/${value}"`;
  });
}

function updateCustomSwitcher(html, locale) {
  html = html.replace(/<span\s+data-current-language>[\s\S]*?<\/span>/,
    `<span data-current-language>${escapeText(locale.abbr || locale.name)}</span>`);
  html = html.replace(
    /(<button\s+type="button"\s+role="option"\s+data-lang-option="([^"]+)"[^>]*)(\s+aria-selected="[^"]*")?([^>]*>)/g,
    (full, before, code, selectedAttr, after) => `${before}${code === locale.code ? ' aria-selected="true"' : ' aria-selected="false"'}${after}`
  );
  return html;
}

// ─── JSON-LD ───
function generateJsonLd(html, data, locale, pagePath) {
  return html.replace(
    /(<script\b[^>]*type="application\/ld\+json"[^>]*data-i18n-jsonld-generate="([^"]+)"[^>]*>)([\s\S]*?)(<\/script>)/g,
    (full, open, kind) => {
      const obj = jsonLdGenerator(kind, data, locale, pagePath);
      if (!obj) return full;
      return `${open}\n${JSON.stringify(obj, null, 2)}\n</script>`;
    }
  );
}

function jsonLdGenerator(kind, data, locale, pagePath) {
  const origin = SITE_ORIGIN;
  const langPrefix = locale.code === SOURCE_LOCALE ? '' : `/${locale.code}`;
  const pageUrlValue = pageUrl(pagePath, locale.code);
  const inLanguage = locale.htmlLang;
  const plainText = value => String(value || '')
    .replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();

  if (kind === 'faq') {
    const items = (data.index && data.index.faq && Array.isArray(data.index.faq.items)) ? data.index.faq.items : [];
    if (!items.length) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage,
      mainEntity: items.slice(0, EN_FAQ_COUNT).filter(it => it && it.q && it.a).map(it => ({
        '@type': 'Question',
        name: plainText(it.q),
        acceptedAnswer: { '@type': 'Answer', text: plainText(it.a) },
      })),
    };
  }

  if (kind === 'support-faq') {
    const support = (data.support && data.support.support) || {};
    const entries = [
      ['summary_8', ['li_18', 'li_2', 'li_3']], ['summary_9', ['p_19']], ['summary_3', ['li_1', 'li_12', 'li_13', 'li_14']],
      ['summary_4', ['li_15', 'li_16', 'li_17', 'p_32']], ['summary_1', ['p_15']],
      ['summary_2', ['widget_size_home', 'widget_size_lock', 'widget_size_standby', 'widget_size_mac']],
      ['summary_13', ['p_22']], ['summary_14', ['p_33']], ['summary_21', ['p_34']], ['summary_22', ['p_28']],
      ['summary_17', ['li_8', 'li_9', 'li_10', 'li_11']], ['summary_23', ['p_35']], ['summary_20', ['p_27']],
      ['summary_19', ['p_26']], ['summary_28', ['p_57']], ['summary_29', ['p_58']], ['summary_30', ['p_59']],
      ['summary_31', ['p_60']], ['summary_32', ['p_61']],
    ];
    const mainEntity = entries
      .map(([q, as]) => ({
        '@type': 'Question',
        name: plainText(support[q]),
        acceptedAnswer: { '@type': 'Answer', text: as.map(k => plainText(support[k])).filter(Boolean).join(' ') },
      }))
      .filter(item => item.name && item.acceptedAnswer.text);
    if (!mainEntity.length) return null;
    return { '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage, mainEntity };
  }

  if (kind === 'app') {
    const meta = (data.index && data.index.meta) || {};
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Left',
      url: `${origin}${langPrefix}/`,
      inLanguage,
      about: {
        '@type': 'MobileApplication',
        name: 'Left',
        description: meta.description || '',
        applicationCategory: 'ProductivityApplication',
        operatingSystem: 'iOS 26.0 or later',
        downloadUrl: 'https://apps.apple.com/app/id6740155884',
        image: `${origin}/images/hero.webp`,
        screenshot: `${origin}/images/left-feature.webp`,
        author: { '@type': 'Person', name: 'Cristian Rus' },
        publisher: { '@type': 'Organization', name: 'Cntxt Labs' },
        inLanguage,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.5', ratingCount: '226' },
      },
    };
  }

  if (kind === 'breadcrumb') {
    const article = pagePath.replace(/^support\//, '').replace(/\.html$/, '').replace(/-/g, '_');
    const articleData = (data.support_articles && data.support_articles[article]) || {};
    const supportLabel = (data.common && data.common.footer && data.common.footer.support) || 'Support';
    const articleTitle = articleData.h1_1 || (articleData.meta && articleData.meta.title) || article;
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Left', item: `${origin}${langPrefix}/` },
        { '@type': 'ListItem', position: 2, name: plainText(supportLabel), item: `${origin}${langPrefix}/support` },
        { '@type': 'ListItem', position: 3, name: plainText(articleTitle), item: pageUrlValue },
      ],
    };
  }
  return null;
}

function rewriteJsonLd(html, data, enData, missing) {
  return html.replace(
    /(<script\b[^>]*type="application\/ld\+json"[^>]*data-i18n-jsonld="([^"]+)"[^>]*>)([\s\S]*?)(<\/script>)/g,
    (full, open, key) => {
      const translated = lookupRaw(data, key) ?? lookupRaw(enData, key);
      if (translated == null) return full;
      try {
        const obj = typeof translated === 'string' ? JSON.parse(translated) : translated;
        return `${open}\n${JSON.stringify(obj, null, 2)}\n</script>`;
      } catch {
        return full;
      }
    }
  );
}

// ─── sitemap.xml ───
async function writeSitemap(allPages, availability, pageFamily) {
  const lines = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`,
    `        xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
  ];
  let count = 0;
  const isNoindex = async (file) => {
    try { return /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(await fs.readFile(path.join(ROOT, file), 'utf8')); }
    catch { return true; }
  };
  for (const page of allPages) {
    if (await isNoindex(page)) continue;
    const available = availability.get(page);
    const family = pageFamily.get(page);
    for (const loc of LOCALES) {
      if (!available.has(loc.code)) continue;
      if (family.mode === 'hash' && loc.code !== SOURCE_LOCALE && !isReleased(family.id, loc.code, DATE)) continue;
      const sources = [page];
      if (loc.code !== SOURCE_LOCALE) {
        sources.push(`i18n/locales/${loc.code}.json`);
        if (family.mode === 'hash') sources.push(`${family.catalogDir}/${loc.code}.json`);
      }
      lines.push(`  <url>`);
      lines.push(`    <loc>${pageUrl(page, loc.code)}</loc>`);
      lines.push(`    <lastmod>${lastModified(sources)}</lastmod>`);
      if (available.size > 1) {
        lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl(page, SOURCE_LOCALE)}" />`);
        for (const alt of LOCALES) {
          if (!available.has(alt.code)) continue;
          for (const code of alt.hreflang) lines.push(`    <xhtml:link rel="alternate" hreflang="${code}" href="${pageUrl(page, alt.code)}" />`);
        }
      }
      lines.push(`  </url>`);
      count++;
    }
  }
  for (const page of ENGLISH_ONLY_INDEXABLE) {
    if (!existsSync(path.join(ROOT, page)) || await isNoindex(page)) continue;
    lines.push(`  <url>`, `    <loc>${pageUrl(page)}</loc>`, `    <lastmod>${lastModified([page])}</lastmod>`, `  </url>`);
    count++;
  }
  lines.push(`</urlset>`);
  await fs.writeFile(path.join(ROOT, 'sitemap.xml'), lines.join('\n') + '\n');
  console.log(`[i18n] sitemap.xml written (${count} URLs).`);
}

main().catch(err => { console.error(err); process.exit(1); });
