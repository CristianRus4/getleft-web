#!/usr/bin/env node
// Build per-language copies of the marketing site.
// Reads English source HTML files annotated with data-i18n* attributes,
// looks up locale strings from i18n/locales/<lang>.json,
// emits translated copies under /<lang>/<path>.
//
// Usage:
//   node scripts/build-i18n.mjs            # strict: fail on missing keys
//   node scripts/build-i18n.mjs --allow-missing   # fallback to English

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');

const SITE_ORIGIN = 'https://getleft.app';

// Order matters: switcher options follow this order.
const LOCALES = [
  { code: 'en',      name: 'English',                 htmlLang: 'en',      dir: 'ltr', flag: '⚑', abbr: 'ENG' },
  { code: 'es',      name: 'Español (España)',        htmlLang: 'es-ES',   dir: 'ltr', flag: '⚑', abbr: 'ES' },
  { code: 'es-419',  name: 'Español (Latinoamérica)', htmlLang: 'es-419',  dir: 'ltr', flag: '⚑', abbr: 'ES' },
  { code: 'de',      name: 'Deutsch',                 htmlLang: 'de',      dir: 'ltr', flag: '⚑', abbr: 'DE' },
  { code: 'fr',      name: 'Français',                htmlLang: 'fr',      dir: 'ltr', flag: '⚑', abbr: 'FR' },
  { code: 'it',      name: 'Italiano',                htmlLang: 'it',      dir: 'ltr', flag: '⚑', abbr: 'IT' },
  { code: 'pt',      name: 'Português',               htmlLang: 'pt',      dir: 'ltr', flag: '⚑', abbr: 'PT' },
  { code: 'ja',      name: '日本語',                   htmlLang: 'ja',      dir: 'ltr', flag: '⚑', abbr: 'JA' },
  { code: 'nl',      name: 'Nederlands',              htmlLang: 'nl',      dir: 'ltr', flag: '⚑', abbr: 'NL' },
  { code: 'pl',      name: 'Polski',                  htmlLang: 'pl',      dir: 'ltr', flag: '⚑', abbr: 'PL' },
  { code: 'tr',      name: 'Türkçe',                  htmlLang: 'tr',      dir: 'ltr', flag: '⚑', abbr: 'TR' },
  { code: 'ru',      name: 'Русский',                 htmlLang: 'ru',      dir: 'ltr', flag: '⚑', abbr: 'RU' },
  { code: 'zh-Hans', name: '简体中文',                  htmlLang: 'zh-Hans', dir: 'ltr', flag: '⚑', abbr: 'ZH' },
  { code: 'zh-Hant', name: '繁體中文',                  htmlLang: 'zh-Hant', dir: 'ltr', flag: '⚑', abbr: 'ZH' },
  { code: 'ko',      name: '한국어',                   htmlLang: 'ko',      dir: 'ltr', flag: '⚑', abbr: 'KO' },
  { code: 'id',      name: 'Bahasa Indonesia',        htmlLang: 'id',      dir: 'ltr', flag: '⚑', abbr: 'ID' },
  { code: 'ro',      name: 'Română',                  htmlLang: 'ro',      dir: 'ltr', flag: '⚑', abbr: 'RO' },
];
const NON_EN_LOCALES = LOCALES.filter(l => l.code !== 'en');
const SUPPORTED_CODES = LOCALES.map(l => l.code);

// Pages to translate. Anything not in this list stays English-only.
const SOURCE_PAGES = [
  'index.html',
  'support.html',
  'contact.html',
  'press.html',
  'tools/index.html',
];

// Glob-equivalents discovered at runtime.
const SOURCE_DIRS = ['support', 'tools'];

// Paths that must NEVER be translated or link-rewritten.
const EXCLUDED_PATH_PREFIXES = [
  '/privacy.html', '/terms.html', '/web.html', '/404.html',
  '/blog/', '/invite/', '/.well-known/', '/sw.js',
  '/download.html', '/download', '/ios', '/android', '/web',
];

const args = new Set(process.argv.slice(2));
const ALLOW_MISSING = args.has('--allow-missing');

async function main() {
  const allPages = await discoverPages();
  console.log(`[i18n] Source pages: ${allPages.length}`);
  console.log(`[i18n] Locales: ${LOCALES.length} (${NON_EN_LOCALES.length} translations + en source)`);

  const enLocale = await readLocale('en');
  if (!enLocale) {
    console.error('[i18n] ERROR: i18n/locales/en.json missing — cannot proceed.');
    process.exit(1);
  }

  // Inject detection script + switcher into the English source pages (idempotent).
  await injectIntoSourcePages(allPages);

  // Build each non-English locale.
  let totalErrors = 0;
  for (const locale of NON_EN_LOCALES) {
    const data = await readLocale(locale.code);
    if (!data) {
      console.warn(`[i18n] skip ${locale.code}: locale file missing`);
      continue;
    }
    const errors = await buildLocale(locale, data, enLocale, allPages);
    totalErrors += errors;
  }

  // Regenerate sitemap.xml.
  await writeSitemap(allPages);

  if (totalErrors > 0 && !ALLOW_MISSING) {
    console.error(`[i18n] BUILD FAILED: ${totalErrors} missing-key errors. Re-run with --allow-missing to permit English fallback.`);
    process.exit(2);
  }
  console.log(`[i18n] Done. ${totalErrors} missing-key warning(s).`);
}

// ─── discover all .html files under the source dirs + the named root pages ───
async function discoverPages() {
  const set = new Set(SOURCE_PAGES);
  for (const dir of SOURCE_DIRS) {
    const full = path.join(ROOT, dir);
    let entries;
    try { entries = await fs.readdir(full); } catch { continue; }
    for (const e of entries) {
      if (e.endsWith('.html')) set.add(`${dir}/${e}`);
    }
  }
  return [...set];
}

async function readLocale(code) {
  try {
    const file = path.join(ROOT, 'i18n', 'locales', `${code}.json`);
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
}

// ─── inject detection + switcher into the source (English) HTML ───
const INJECTION_MARK_START = '<!-- i18n:auto-detect:start -->';
const INJECTION_MARK_END = '<!-- i18n:auto-detect:end -->';
const SWITCHER_MARK_START = '<!-- i18n:switcher:start -->';
const SWITCHER_MARK_END = '<!-- i18n:switcher:end -->';

async function injectIntoSourcePages(pages) {
  const detectScript = await fs.readFile(path.join(ROOT, 'partials', 'detect.html'), 'utf8');
  const switcherHtml = await fs.readFile(path.join(ROOT, 'partials', 'switcher.html'), 'utf8');

  for (const page of pages) {
    const file = path.join(ROOT, page);
    let html = await fs.readFile(file, 'utf8');

    html = upsertInjection(html, INJECTION_MARK_START, INJECTION_MARK_END,
      `${INJECTION_MARK_START}\n${detectScript.trim()}\n${INJECTION_MARK_END}`,
      /<meta\s+name="viewport"[^>]*>/i);

    html = upsertFooterSwitcher(html,
      `${SWITCHER_MARK_START}\n${switcherHtml.trim()}\n${SWITCHER_MARK_END}`);

    await fs.writeFile(file, html);
  }
}

function upsertInjection(html, startMark, endMark, payload, anchorRegex, insertBefore = false) {
  const startIdx = html.indexOf(startMark);
  const endIdx = html.indexOf(endMark);
  if (startIdx !== -1 && endIdx !== -1) {
    return html.slice(0, startIdx) + payload + html.slice(endIdx + endMark.length);
  }
  const m = anchorRegex.exec(html);
  if (!m) return html;
  const pos = insertBefore ? m.index : m.index + m[0].length;
  return html.slice(0, pos) + '\n' + payload + '\n' + html.slice(pos);
}

function upsertFooterSwitcher(html, payload) {
  html = stripInjection(html, SWITCHER_MARK_START, SWITCHER_MARK_END);
  return html.replace(
    /(<nav\s+class="footer-links"[^>]*>[\s\S]*?)(\s*<\/nav>)/i,
    (full, before, close) => `${before}\n          ${payload.replace(/\n/g, '\n          ')}${close}`
  );
}

// ─── per-locale build ───
async function buildLocale(locale, data, enData, pages) {
  const localeDir = path.join(ROOT, locale.code);
  await fs.rm(localeDir, { recursive: true, force: true });

  let errorCount = 0;
  for (const page of pages) {
    const srcFile = path.join(ROOT, page);
    const dstFile = path.join(localeDir, page);
    await fs.mkdir(path.dirname(dstFile), { recursive: true });
    const srcHtml = await fs.readFile(srcFile, 'utf8');
    const { html, missing } = transform(srcHtml, page, locale, data, enData);
    errorCount += missing.length;
    if (missing.length) {
      console.warn(`[i18n] ${locale.code} ${page}: ${missing.length} missing key(s):`, missing.slice(0, 5).join(', ') + (missing.length > 5 ? '…' : ''));
    }
    await fs.writeFile(dstFile, html);
  }
  return errorCount;
}

// ─── HTML transform ───
function transform(html, pagePath, locale, data, enData) {
  const missing = [];

  // Remove the auto-detect injection on translated pages (no loops).
  html = stripInjection(html, INJECTION_MARK_START, INJECTION_MARK_END);

  // 1. Replace text content: <tag data-i18n="key">…</tag>
  html = html.replace(
    /<([a-zA-Z][\w-]*)([^>]*?)\sdata-i18n="([^"]+)"([^>]*?)>([\s\S]*?)<\/\1>/g,
    (full, tag, before, key, after, inner) => {
      const value = lookup(data, key, enData, missing);
      const cleanedAttrs = `${before}${after}`.replace(/\s+/g, ' ').trim();
      const attrs = cleanedAttrs ? ' ' + cleanedAttrs : '';
      return `<${tag}${attrs}>${escapeText(value)}</${tag}>`;
    }
  );

  // 2. Replace HTML content (allows <strong>, <a> etc): data-i18n-html="key"
  html = html.replace(
    /<([a-zA-Z][\w-]*)([^>]*?)\sdata-i18n-html="([^"]+)"([^>]*?)>([\s\S]*?)<\/\1>/g,
    (full, tag, before, key, after, inner) => {
      const value = lookup(data, key, enData, missing);
      const cleanedAttrs = `${before}${after}`.replace(/\s+/g, ' ').trim();
      const attrs = cleanedAttrs ? ' ' + cleanedAttrs : '';
      return `<${tag}${attrs}>${value}</${tag}>`;
    }
  );

  // 3. Self-closing meta/link: <meta data-i18n-attr="content:key" content="…" />
  html = html.replace(
    /<(meta|link|img|input)\b([^>]*?)\sdata-i18n-attr="([^"]+)"([^>]*?)\/?>/gi,
    (full, tag, before, spec, after) => {
      let combined = `${before}${after}`;
      for (const pair of spec.split(',')) {
        const [attr, key] = pair.split(':').map(s => s.trim());
        if (!attr || !key) continue;
        const value = lookup(data, key, enData, missing);
        const attrRegex = new RegExp(`\\s${attr}="[^"]*"`, 'i');
        if (attrRegex.test(combined)) {
          combined = combined.replace(attrRegex, ` ${attr}="${escapeAttr(value)}"`);
        } else {
          combined += ` ${attr}="${escapeAttr(value)}"`;
        }
      }
      const self = full.endsWith('/>') ? ' />' : '>';
      return `<${tag}${combined}${self}`;
    }
  );

  // 4. Same as #3 but for non-self-closing elements that wrap content (rare;
  //     covers <a data-i18n-attr="aria-label:key"> etc.)
  html = html.replace(
    /<([a-zA-Z][\w-]*)\b([^>]*?)\sdata-i18n-attr="([^"]+)"([^>]*?)>/g,
    (full, tag, before, spec, after) => {
      if (/^(meta|link|img|input)$/i.test(tag)) return full; // handled above
      let combined = `${before}${after}`;
      for (const pair of spec.split(',')) {
        const [attr, key] = pair.split(':').map(s => s.trim());
        if (!attr || !key) continue;
        const value = lookup(data, key, enData, missing);
        const attrRegex = new RegExp(`\\s${attr}="[^"]*"`, 'i');
        if (attrRegex.test(combined)) {
          combined = combined.replace(attrRegex, ` ${attr}="${escapeAttr(value)}"`);
        } else {
          combined += ` ${attr}="${escapeAttr(value)}"`;
        }
      }
      return `<${tag}${combined}>`;
    }
  );

  // 5. <html lang="…">
  html = html.replace(/<html\b([^>]*)\blang="[^"]*"([^>]*)>/i,
    `<html$1 lang="${locale.htmlLang}"$2${locale.dir === 'rtl' ? ' dir="rtl"' : ''}>`);

  // 6. <link rel="canonical"> → localized URL
  const localizedUrl = `${SITE_ORIGIN}/${locale.code}/${pageToUrlPath(pagePath)}`;
  html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${localizedUrl}" />`);

  // 7. hreflang block — replace or insert.
  const hreflangBlock = buildHreflangBlock(pagePath);
  if (/<!-- i18n:hreflang:start -->/.test(html)) {
    html = html.replace(/<!-- i18n:hreflang:start -->[\s\S]*?<!-- i18n:hreflang:end -->/,
      hreflangBlock);
  } else {
    html = html.replace(/<link\s+rel="canonical"[^>]*\/?>/i, m => `${m}\n  ${hreflangBlock}`);
  }

  // 8. Rewrite internal links to /<lang>/...
  html = rewriteLinks(html, locale.code);
  html = rewriteRelativeAssetPaths(html);
  html = updateCustomSwitcher(html, locale);

  // 10. Rewrite JSON-LD blocks that have an i18n-data attribute.
  html = rewriteJsonLd(html, data, enData, missing);

  // 11. Strip all data-i18n* attributes from the output (cleanup).
  html = html.replace(/\s+data-i18n(-attr|-html|-list|-list-template)?="[^"]*"/g, '');

  return { html, missing };
}

function stripInjection(html, startMark, endMark) {
  const startIdx = html.indexOf(startMark);
  const endIdx = html.indexOf(endMark);
  if (startIdx === -1 || endIdx === -1) return html;
  const before = html.slice(0, startIdx);
  const after = html.slice(endIdx + endMark.length);
  return (before.replace(/\s+$/, '') + '\n' + after.replace(/^\s+/, ''));
}

function lookup(data, key, fallback, missing) {
  const parts = splitKey(key);
  let cur = data;
  for (const p of parts) {
    if (cur == null) break;
    cur = cur[p];
  }
  if (typeof cur === 'string') return cur;
  // fall back to English
  let fb = fallback;
  for (const p of parts) {
    if (fb == null) break;
    fb = fb[p];
  }
  if (typeof fb === 'string') {
    missing.push(key);
    return fb;
  }
  missing.push(key);
  return `[[${key}]]`;
}

function splitKey(key) {
  // 'index.faq.items[2].q' → ['index','faq','items','2','q']
  return key.replace(/\[(\d+)\]/g, '.$1').split('.');
}

function escapeText(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

function pageToUrlPath(page) {
  if (page === 'index.html') return '';
  if (page === 'tools/index.html') return 'tools/';
  return page;
}

function buildHreflangBlock(pagePath) {
  const urlPath = pageToUrlPath(pagePath);
  const lines = [`<!-- i18n:hreflang:start -->`];
  // x-default → English (root, no prefix)
  lines.push(`  <link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}/${urlPath}" />`);
  for (const loc of LOCALES) {
    const prefix = loc.code === 'en' ? '' : `${loc.code}/`;
    lines.push(`  <link rel="alternate" hreflang="${loc.htmlLang}" href="${SITE_ORIGIN}/${prefix}${urlPath}" />`);
  }
  lines.push(`  <!-- i18n:hreflang:end -->`);
  return lines.join('\n');
}

function rewriteLinks(html, langCode) {
  return html.replace(/(href|src)="(\/[^"#?]*)([?#][^"]*)?"/g, (full, attr, p, qs) => {
    if (attr === 'src') return full; // never rewrite asset paths
    qs = qs || '';
    // exclude paths
    if (EXCLUDED_PATH_PREFIXES.some(prefix => p === prefix || p.startsWith(prefix))) return full;
    // already a locale-prefixed path → leave
    if (new RegExp(`^/(${SUPPORTED_CODES.join('|')})(/|$)`).test(p)) return full;
    // common assets stay (images, css, js, favicon, manifest)
    if (/^\/(images|favicon|left-icon|public|style\.css|tools\/tools\.css|tools\/tools\.js|index\.js|reviews\.json|TemplateLibrary\.json|web\.css|left\.webmanifest)/.test(p)) {
      return full;
    }
    // bare '/' (homepage)
    if (p === '/') return `${attr}="/${langCode}/${qs}"`;
    // anchor-only on home (e.g. /#features) covered by the regex above
    return `${attr}="/${langCode}${p}${qs}"`;
  });
}

function rewriteRelativeAssetPaths(html) {
  const assetPrefixes = [
    'images/',
    'favicon/',
    'left-icon/',
    'public/',
    'style.css',
    'index.js',
    'reviews.json',
    'TemplateLibrary.json',
    'left.webmanifest',
    'web.css',
    'tools/tools.css',
    'tools/tools.js',
  ];
  const attrs = [
    'href',
    'src',
    'content',
    'data-final-src',
    'data-action-image',
    'data-feature-image',
  ];
  const attrPattern = attrs.join('|');
  return html.replace(new RegExp(`\\b(${attrPattern})="([^"#?:][^"]*)"`, 'g'), (full, attr, value) => {
    if (value.startsWith('/')) return full;
    if (!assetPrefixes.some(prefix => value === prefix || value.startsWith(prefix))) return full;
    return `${attr}="/${value}"`;
  });
}

function updateCustomSwitcher(html, locale) {
  html = html.replace(
    /<span\s+data-current-language>[\s\S]*?<\/span>/,
    `<span data-current-language>${escapeText(locale.abbr || locale.name)}</span>`
  );
  html = html.replace(
    /<span\s+[^>]*data-current-flag[^>]*>[\s\S]*?<\/span>/,
    `<span class="lang-switcher__flag" data-current-flag>${escapeText(locale.flag)}</span>`
  );
  html = html.replace(
    /(<button\s+type="button"\s+role="option"\s+data-lang-option="([^"]+)"[^>]*)(\s+aria-selected="[^"]*")?([^>]*>)/g,
    (full, before, code, selectedAttr, after) => {
      const selected = code === locale.code ? ' aria-selected="true"' : ' aria-selected="false"';
      return `${before}${selected}${after}`;
    }
  );
  return html;
}

function rewriteJsonLd(html, data, enData, missing) {
  return html.replace(
    /(<script\b[^>]*type="application\/ld\+json"[^>]*data-i18n-jsonld="([^"]+)"[^>]*>)([\s\S]*?)(<\/script>)/g,
    (full, open, key, body, close) => {
      const translated = lookup(data, key, enData, missing);
      if (typeof translated !== 'object' && typeof translated !== 'string') return full;
      if (typeof translated === 'string' && translated.startsWith('[[')) return full;
      try {
        const obj = (typeof translated === 'string') ? JSON.parse(translated) : translated;
        return `${open}\n${JSON.stringify(obj, null, 2)}\n${close}`;
      } catch {
        return full;
      }
    }
  );
}

// ─── sitemap.xml ───
async function writeSitemap(pages) {
  const lines = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`,
    `        xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
  ];
  const today = new Date().toISOString().slice(0, 10);

  for (const page of pages) {
    const urlPath = pageToUrlPath(page);
    lines.push(`  <url>`);
    lines.push(`    <loc>${SITE_ORIGIN}/${urlPath}</loc>`);
    lines.push(`    <lastmod>${today}</lastmod>`);
    for (const loc of LOCALES) {
      const prefix = loc.code === 'en' ? '' : `${loc.code}/`;
      lines.push(`    <xhtml:link rel="alternate" hreflang="${loc.htmlLang}" href="${SITE_ORIGIN}/${prefix}${urlPath}" />`);
    }
    lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}/${urlPath}" />`);
    lines.push(`  </url>`);
  }

  // Non-translated pages (privacy, terms, web, blog).
  const englishOnly = ['privacy.html', 'terms.html', 'web.html'];
  // Blog: enumerate.
  try {
    const blogEntries = await fs.readdir(path.join(ROOT, 'blog'));
    for (const e of blogEntries) if (e.endsWith('.html')) englishOnly.push(`blog/${e}`);
  } catch {}
  for (const page of englishOnly) {
    const urlPath = page === 'blog/index.html' ? 'blog/' : page;
    lines.push(`  <url>`);
    lines.push(`    <loc>${SITE_ORIGIN}/${urlPath}</loc>`);
    lines.push(`    <lastmod>${today}</lastmod>`);
    lines.push(`  </url>`);
  }

  lines.push(`</urlset>`);
  await fs.writeFile(path.join(ROOT, 'sitemap.xml'), lines.join('\n') + '\n');
  console.log(`[i18n] sitemap.xml written (${pages.length * LOCALES.length} translated URLs + ${englishOnly.length} English-only).`);
}

main().catch(err => { console.error(err); process.exit(1); });
