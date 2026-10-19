#!/usr/bin/env node
// Normalises every English page in place before the locale build copies them:
// clean URLs, canonical/og:url, primary nav and footer links, robots meta,
// analytics + consent partials, App Store campaign links, Smart App Banner and
// the content-type meta. Idempotent: managed blocks sit between marker comments.

import { promises as fs, existsSync } from 'node:fs';
import path from 'node:path';
import { ROOT, SITE_ORIGIN, FAMILIES, listFamilyPages, pageToUrlPath, readJson } from './lib/site.mjs';

// Pages that must never be indexed. Mood is hidden in production builds of the app.
const NOINDEX = new Set([
  'terms.html',
  'download.html',
  'promo.html',
  '404.html',
  'invite/index.html',
  'public/invite/index.html',
  'todoist/oauth/callback-fallback.html',
  'support/mood-tracker-in-left.html',
  'support/world-mood-globe.html',
]);

// Pages that load the site chrome but must not carry analytics (invite codes,
// OAuth parameters) or campaign rewriting.
const NO_ANALYTICS = new Set([
  'invite/index.html',
  'public/invite/index.html',
  'todoist/oauth/callback-fallback.html',
  'friends',
]);

const SKIP_DIRS = new Set(['partials', 'templates-photos', 'node_modules', 'scripts', 'docs', 'i18n', 'functions', 'images', 'fonts', 'favicon', 'left-icon', '.well-known', '.git', '.claude']);

export async function englishPages() {
  const registry = await readJson('i18n/locales.json');
  const localeDirs = new Set(registry.locales.map(l => l.code));
  const out = [];
  async function walk(dir) {
    const entries = await fs.readdir(path.join(ROOT, dir), { withFileTypes: true });
    for (const e of entries) {
      const rel = dir ? `${dir}/${e.name}` : e.name;
      if (e.isDirectory()) {
        if (!dir && (localeDirs.has(e.name) || SKIP_DIRS.has(e.name) || e.name.startsWith('.'))) continue;
        await walk(rel);
      } else if (e.name.endsWith('.html')) {
        out.push(rel);
      }
    }
  }
  await walk('');
  return out.sort();
}

export function familyOf(page, familyPages) {
  for (const [id, pages] of familyPages) if (pages.has(page)) return id;
  return null;
}

export function contentType(page) {
  if (page === 'index.html') return 'home';
  if (page.startsWith('blog/')) return 'blog';
  if (page.startsWith('tools/')) return 'tool';
  if (page === 'support.html' || page.startsWith('support/')) return 'support';
  if (page === 'privacy.html' || page === 'terms.html') return 'legal';
  if (page === 'press.html') return 'press';
  if (page === 'contact.html') return 'contact';
  if (page === 'web.html') return 'webapp';
  return 'landing';
}

// The family label used in App Store campaign tokens.
export function ctaFamily(page) {
  const t = contentType(page);
  return ({ home: 'home', blog: 'blog', tool: 'tool', support: 'support', legal: 'legal', press: 'other', contact: 'other', webapp: 'other', landing: 'land' })[t] || 'other';
}

function cleanInternalLinks(html, page) {
  // Absolute .html links → clean URLs (Cloudflare 308s them anyway).
  html = html.replace(/(href)="(\/[^"#?]*?)(?:index\.html|\.html)([?#][^"]*)?"/g, (full, attr, p, qs = '') => {
    if (/^\/(invite|public|todoist|\.well-known)\//.test(p + '/')) return full;
    return `${attr}="${p}${qs}"`;
  });
  // Relative sibling links inside support/ and blog/ (e.g. href="fasting-in-left.html").
  const dir = path.posix.dirname(page);
  if (dir !== '.') {
    html = html.replace(/href="([a-z0-9][a-z0-9-]*)\.html([?#][^"]*)?"/g, (full, slug, qs = '') => `href="/${dir}/${slug}${qs}"`);
  }
  return html;
}

function setCanonical(html, page) {
  if (page === 'friends') return html; // deliberate cross-host canonical to go.getleft.app
  if (!/<link\s+rel="canonical"/i.test(html)) return html;
  const url = `${SITE_ORIGIN}/${pageToUrlPath(page)}`;
  html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${url}" />`);
  html = html.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${url}" />`);
  return html;
}

function setRobots(html, page) {
  if (!NOINDEX.has(page)) return html;
  const tag = '<meta name="robots" content="noindex,follow" />';
  if (/<meta\s+name="robots"[^>]*>/i.test(html)) return html.replace(/<meta\s+name="robots"[^>]*>/i, tag);
  return html.replace(/(<meta\s+charset[^>]*>)/i, `$1\n  ${tag}`);
}

function upsertBlock(html, name, payload, anchor, where = 'after') {
  const start = `<!-- left:${name}:start -->`;
  const end = `<!-- left:${name}:end -->`;
  const block = `${start}\n${payload}\n${end}`;
  const s = html.indexOf(start);
  const e = html.indexOf(end);
  if (s !== -1 && e !== -1) return html.slice(0, s) + block + html.slice(e + end.length);
  const m = anchor.exec(html);
  if (!m) return html;
  const pos = where === 'before' ? m.index : m.index + m[0].length;
  return html.slice(0, pos) + (where === 'before' ? `${block}\n` : `\n${block}`) + html.slice(pos);
}

function removeBlock(html, name) {
  const start = `<!-- left:${name}:start -->`;
  const end = `<!-- left:${name}:end -->`;
  const s = html.indexOf(start);
  const e = html.indexOf(end);
  if (s === -1 || e === -1) return html;
  return html.slice(0, s).replace(/[ \t]*\n?$/, '') + html.slice(e + end.length).replace(/^\n/, '');
}

function primaryNav(page) {
  const features = page === 'index.html' ? '#features' : '/#features';
  return [
    `          <a href="${features}" class="nav-link" data-i18n="common.nav.features">Features</a>`,
    `          <a href="/tools/" class="nav-link" data-i18n="common.nav.tools">Tools</a>`,
    `          <a href="/blog/" class="nav-link" data-i18n="common.nav.blog">Blog</a>`,
  ].join('\n');
}

function setPrimaryNav(html, page) {
  // Replace the contents of the first .nav-links container with the managed link set.
  return html.replace(/(<div\s+class="nav-links"[^>]*>)([\s\S]*?)(<\/div>)/i, (full, open, inner, close) => {
    const body = `<!-- left:nav:start -->\n${primaryNav(page)}\n          <!-- left:nav:end -->`;
    return `${open}\n          ${body}\n        ${close}`;
  });
}

function setFooterExtras(html) {
  if (!/<nav\s+class="footer-links"/i.test(html)) return html;
  const links = [
    '<a href="/blog/" data-i18n="common.footer.blog">Blog</a>',
    '<a href="#" data-consent-open data-i18n="common.footer.cookie_settings">Cookie settings</a>',
  ].join('\n          ');
  html = removeBlock(html, 'footer-extra');
  return html.replace(/(<nav\s+class="footer-links"[^>]*>[\s\S]*?)(\s*(?:<!-- i18n:switcher:start -->|<\/nav>))/i,
    (full, before, tail) => `${before}\n          <!-- left:footer-extra:start -->\n          ${links}\n          <!-- left:footer-extra:end -->${tail}`);
}

function dedupeHreflang(html) {
  // Stray copies of en/x-default left outside the managed hreflang block.
  return html.replace(/(<!-- i18n:hreflang:end -->)((?:\s*<link\s+rel="alternate"\s+hreflang="[^"]+"\s+href="[^"]+"\s*\/?>)+)/g, '$1');
}

function setMeta(html, name, content) {
  const tag = `<meta name="${name}" content="${content}" />`;
  const re = new RegExp(`<meta\\s+name="${name.replace(/[:]/g, '\\:')}"[^>]*>`, 'i');
  if (re.test(html)) return html.replace(re, tag);
  return html.replace(/(<meta\s+name="viewport"[^>]*>)/i, `$1\n  ${tag}`);
}

async function loadOptional(file) {
  const full = path.join(ROOT, file);
  return existsSync(full) ? fs.readFile(full, 'utf8') : null;
}

export async function run({ quiet = false } = {}) {
  const config = (await readJson('site.config.json', {})) || {};
  const gaId = (config.ga4MeasurementId || '').trim();
  const analyticsPartial = gaId ? await loadOptional('partials/analytics.html') : null;
  const consentPartial = gaId ? await loadOptional('partials/consent-banner.html') : null;
  const appstore = (!process.env.LEFT_SKIP_APPSTORE && existsSync(path.join(ROOT, 'scripts/lib/appstore.mjs'))) ? await import('./lib/appstore.mjs') : null;

  const familyPages = new Map();
  for (const f of FAMILIES) familyPages.set(f.id, new Set(await listFamilyPages(f)));

  const pages = await englishPages();
  let changed = 0;
  for (const page of pages) {
    const file = path.join(ROOT, page);
    const before = await fs.readFile(file, 'utf8');
    let html = before;
    const isDocument = /<html[\s>]/i.test(html);
    if (!isDocument) continue;

    html = cleanInternalLinks(html, page);
    html = setCanonical(html, page);
    html = setRobots(html, page);
    html = dedupeHreflang(html);
    if (/<div\s+class="nav-links"/i.test(html)) html = setPrimaryNav(html, page);
    html = setFooterExtras(html);
    html = setMeta(html, 'left:content-type', contentType(page));

    const indexable = !NOINDEX.has(page);
    if (indexable && !NO_ANALYTICS.has(page) && page !== 'web.html') {
      const banner = appstore?.smartBannerMeta ? appstore.smartBannerMeta() : `<meta name="apple-itunes-app" content="app-id=${config.appId || '6740155884'}">`;
      if (!/<meta\s+name="apple-itunes-app"/i.test(html) || /<!-- left:smart-banner:start -->/.test(html)) {
        html = upsertBlock(html, 'smart-banner', `  ${banner}`, /<meta\s+name="viewport"[^>]*>/i);
      }
    }

    if (!NO_ANALYTICS.has(page)) {
      if (analyticsPartial) {
        const payload = analyticsPartial.trim()
          .replaceAll('__GA4_ID__', gaId)
          .replaceAll('__GA4_EXCLUDED__', JSON.stringify(config.analyticsExcludedPaths || []));
        const anchor = /<!-- i18n:auto-detect:end -->/.test(html) ? /<!-- i18n:auto-detect:end -->/ : /<meta\s+name="viewport"[^>]*>/i;
        html = upsertBlock(html, 'analytics', payload, anchor);
      } else {
        html = removeBlock(html, 'analytics');
      }
      if (consentPartial) html = upsertBlock(html, 'consent', consentPartial.trim(), /<\/body>/i, 'before');
      else html = removeBlock(html, 'consent');
      if (appstore?.rewriteAppStoreLinks) {
        html = appstore.rewriteAppStoreLinks(html, { family: ctaFamily(page), locale: 'en' });
      }
    }

    if (html !== before) {
      await fs.writeFile(file, html);
      changed++;
    }
  }
  if (!quiet) console.log(`[inject] ${pages.length} English pages checked, ${changed} updated${gaId ? '' : ' (analytics off: no GA4 ID yet)'}.`);
  return { pages, familyPages };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run().catch(err => { console.error(err); process.exit(1); });
}
