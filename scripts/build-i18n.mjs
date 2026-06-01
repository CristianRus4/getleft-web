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
  { code: 'en',      name: 'English',                 htmlLang: 'en',      dir: 'ltr', flag: '⚑', abbr: 'EN' },
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
  { code: 'hi',      name: 'हिन्दी',                    htmlLang: 'hi',      dir: 'ltr', flag: '⚑', abbr: 'HI' },
];
const NON_EN_LOCALES = LOCALES.filter(l => l.code !== 'en');
const SUPPORTED_CODES = LOCALES.map(l => l.code);

// Pages to translate. Anything not in this list stays English-only.
const SOURCE_PAGES = [
  'index.html',
  'support.html',
  'contact.html',
];

// Glob-equivalents discovered at runtime.
const SOURCE_DIRS = ['support'];

// Paths that must NEVER be translated or link-rewritten.
const EXCLUDED_PATH_PREFIXES = [
  '/privacy.html', '/terms.html', '/web.html', '/404.html',
  '/press.html', '/tools/', '/tools',
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

  // Inject detection script + switcher + auto-generated JSON-LD into source pages.
  await injectIntoSourcePages(allPages, enLocale);

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

async function injectIntoSourcePages(pages, enData) {
  const detectScript = await fs.readFile(path.join(ROOT, 'partials', 'detect.html'), 'utf8');
  const switcherHtml = await fs.readFile(path.join(ROOT, 'partials', 'switcher.html'), 'utf8');
  const enLocale = { code: 'en', htmlLang: 'en' };

  for (const page of pages) {
    const file = path.join(ROOT, page);
    let html = await fs.readFile(file, 'utf8');

    html = upsertInjection(html, INJECTION_MARK_START, INJECTION_MARK_END,
      `${INJECTION_MARK_START}\n${detectScript.trim()}\n${INJECTION_MARK_END}`,
      /<meta\s+name="viewport"[^>]*>/i);

    html = upsertFooterSwitcher(html,
      `${SWITCHER_MARK_START}\n${switcherHtml.trim()}\n${SWITCHER_MARK_END}`);

    // Update canonical and og:url to clean URL (no .html) so they match the
    // URL Cloudflare Pages actually serves (Pretty URLs strips .html).
    const enUrl = `${SITE_ORIGIN}/${pageToUrlPath(page)}`;
    html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
      `<link rel="canonical" href="${enUrl}" />`);
    html = html.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:url" content="${enUrl}" />`);

    // Insert hreflang alternates on the English source page too (so the canonical
    // English URL also tells search engines about the translated versions).
    const hreflangBlock = buildHreflangBlock(page);
    if (/<!-- i18n:hreflang:start -->/.test(html)) {
      html = html.replace(/<!-- i18n:hreflang:start -->[\s\S]*?<!-- i18n:hreflang:end -->/, hreflangBlock);
    } else {
      html = html.replace(/<link\s+rel="canonical"[^>]*\/?>/i, m => `${m}\n  ${hreflangBlock}`);
    }

    // Fill in auto-generated JSON-LD blocks for the English source as well.
    html = generateJsonLd(html, enData, enLocale, page);

    // Inject TOC + related-guides into every support article.
    if (/^support\/.+\.html$/.test(page)) {
      html = injectSupportArticleExtras(html, page, enData);
    }

    await fs.writeFile(file, html);
  }
}

// ─── Support-article scaffolding (TOC + related guides) ──────────────────────
// Adds id="s-h2-N" to each <h2 data-i18n="…h2_N">, injects a "On this page"
// TOC after the article lede, and injects a "Related guides" grid before the
// download CTA. Both blocks use data-i18n so the per-locale transform pass
// translates them automatically.
const SUPPORT_TOC_MARK_START = '<!-- i18n:support-toc:start -->';
const SUPPORT_TOC_MARK_END   = '<!-- i18n:support-toc:end -->';
const SUPPORT_REL_MARK_START = '<!-- i18n:support-related:start -->';
const SUPPORT_REL_MARK_END   = '<!-- i18n:support-related:end -->';

function injectSupportArticleExtras(html, page, enData) {
  // Strip any previous injection (idempotent rebuilds).
  html = stripInjection(html, SUPPORT_TOC_MARK_START, SUPPORT_TOC_MARK_END);
  html = stripInjection(html, SUPPORT_REL_MARK_START, SUPPORT_REL_MARK_END);

  const currentSlug = page.replace(/^support\//, '').replace(/\.html$/, '');
  const currentArticle = currentSlug.replace(/-/g, '_');

  // 1. Add stable ids to each H2 so the TOC can link to them.
  const h2s = [];
  html = html.replace(
    /<h2\b([^>]*?)\sdata-i18n="(support_articles\.[\w]+\.h2_\d+)"([^>]*)>([\s\S]*?)<\/h2>/g,
    (full, before, key, after, inner) => {
      const idMatch = key.match(/\.h2_(\d+)$/);
      const id = idMatch ? `s-h2-${idMatch[1]}` : null;
      if (!id) return full;
      // Skip the trailing "Start noticing what matters." H2 inside the download block.
      if (/Start noticing/.test(inner)) return full;
      h2s.push({ id, key, fallback: inner.replace(/<[^>]+>/g, '').trim() });
      // If id already set, leave it; otherwise add ours.
      const merged = `${before}${after}`;
      if (/\sid=/.test(merged)) return full;
      return `<h2${before} id="${id}" data-i18n="${key}"${after}>${inner}</h2>`;
    }
  );

  // 2. Build the TOC block.
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

    html = html.replace(
      /(<p\s+class="article-lede"[^>]*>[\s\S]*?<\/p>)/,
      (m) => `${m}\n  ${tocBlock}`
    );
  }

  // 3. Build the related-guides block. Pull other articles from en.json
  //    so titles are the same set in every build; the per-locale transform
  //    pass will translate them via data-i18n.
  const supportArticles = (enData && enData.support_articles) || {};
  const others = Object.keys(supportArticles)
    .filter(slug => slug !== currentArticle && supportArticles[slug] && supportArticles[slug].h1_1)
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

    // Insert before the download-block section if present, else before </article>.
    if (/<section\s+class="download-block"/.test(html)) {
      html = html.replace(/(<section\s+class="download-block")/, `${relatedBlock}\n\n      $1`);
    } else {
      html = html.replace(/(<\/article>)/, `${relatedBlock}\n  $1`);
    }
  }

  return html;
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

  // 6b. <meta property="og:url"> → localized URL (mirror canonical).
  html = html.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${localizedUrl}" />`);

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

  // 10b. Auto-generated JSON-LD blocks (FAQPage, MobileApplication, BreadcrumbList).
  html = generateJsonLd(html, data, locale, pagePath);

  // 11. Strip all data-i18n* attributes from the output (cleanup).
  html = html.replace(/\s+data-i18n(-attr|-html|-list|-list-template|-jsonld|-jsonld-generate)?="[^"]*"/g, '');

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
  return page.replace(/\.html$/, '');
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

// Auto-generate JSON-LD blocks marked with data-i18n-jsonld-generate="<kind>".
// The build pulls localised strings out of the locale JSON and emits a fresh
// JSON-LD payload per language — keeps structured data in sync with copy.
function generateJsonLd(html, data, locale, pagePath) {
  return html.replace(
    /(<script\b[^>]*type="application\/ld\+json"[^>]*data-i18n-jsonld-generate="([^"]+)"[^>]*>)([\s\S]*?)(<\/script>)/g,
    (full, open, kind, body, close) => {
      const obj = jsonLdGenerator(kind, data, locale, pagePath);
      if (!obj) return full;
      return `${open}\n${JSON.stringify(obj, null, 2)}\n${close}`;
    }
  );
}

function jsonLdGenerator(kind, data, locale, pagePath) {
  const origin = SITE_ORIGIN;
  const langPrefix = locale.code === 'en' ? '' : `/${locale.code}`;
  const pageUrl = `${origin}${langPrefix}/${pageToUrlPath(pagePath)}`.replace(/\/$/, '/') || `${origin}/`;
  const inLanguage = locale.htmlLang;

  if (kind === 'faq') {
    const items = (data.index && data.index.faq && Array.isArray(data.index.faq.items)) ? data.index.faq.items : [];
    if (!items.length) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage,
      mainEntity: items.map(it => ({
        '@type': 'Question',
        name: it.q,
        acceptedAnswer: { '@type': 'Answer', text: it.a },
      })),
    };
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
        name: meta.title || 'Left',
        description: meta.description || '',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'iOS 18+',
        downloadUrl: 'https://apps.apple.com/app/id6740155884',
        image: `${origin}/images/hero.webp`,
        screenshot: `${origin}/images/left-feature.webp`,
        author: { '@type': 'Person', name: 'Cristian Rus' },
        publisher: { '@type': 'Organization', name: 'cntxt' },
        inLanguage,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.5', ratingCount: '226' },
      },
    };
  }

  if (kind === 'breadcrumb') {
    // Support article: Home → Support → <article h1>
    const article = pagePath.replace(/^support\//, '').replace(/\.html$/, '').replace(/-/g, '_');
    const articleData = (data.support_articles && data.support_articles[article]) || {};
    const supportLabel = (data.common && data.common.footer && data.common.footer.support) || 'Support';
    const homeLabel = 'Left';
    const articleTitle = articleData.h1_1 || (articleData.meta && articleData.meta.title) || article;
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: homeLabel, item: `${origin}${langPrefix}/` },
        { '@type': 'ListItem', position: 2, name: supportLabel, item: `${origin}${langPrefix}/support` },
        { '@type': 'ListItem', position: 3, name: articleTitle, item: pageUrl },
      ],
    };
  }

  return null;
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

  // Non-translated pages (privacy, terms, web, blog, tools).
  const englishOnly = ['privacy', 'terms', 'web'];
  // Blog: enumerate.
  try {
    const blogEntries = await fs.readdir(path.join(ROOT, 'blog'));
    for (const e of blogEntries) {
      if (!e.endsWith('.html')) continue;
      if (e === 'index.html') englishOnly.push('blog/');
      else englishOnly.push(`blog/${e.replace(/\.html$/, '')}`);
    }
  } catch {}
  // Tools: enumerate English-only canonical URLs.
  try {
    const toolEntries = await fs.readdir(path.join(ROOT, 'tools'));
    for (const e of toolEntries) {
      if (!e.endsWith('.html')) continue;
      if (e === 'index.html') englishOnly.push('tools/');
      else englishOnly.push(`tools/${e.replace(/\.html$/, '')}`);
    }
  } catch {}
  for (const page of englishOnly) {
    lines.push(`  <url>`);
    lines.push(`    <loc>${SITE_ORIGIN}/${page}</loc>`);
    lines.push(`    <lastmod>${today}</lastmod>`);
    lines.push(`  </url>`);
  }

  lines.push(`</urlset>`);
  await fs.writeFile(path.join(ROOT, 'sitemap.xml'), lines.join('\n') + '\n');
  console.log(`[i18n] sitemap.xml written (${pages.length * LOCALES.length} translated URLs + ${englishOnly.length} English-only).`);
}

main().catch(err => { console.error(err); process.exit(1); });
