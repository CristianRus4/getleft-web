#!/usr/bin/env node
// Merge gate for the built site. Reads the HTML that will be deployed and fails on:
//   - indexable pages without a self-referencing, extensionless canonical
//   - hreflang alternates that point at missing pages, are not reciprocal, or use unsupported codes
//   - indexable pages missing from sitemap.xml, or sitemap URLs that are missing or noindex
//   - internal links to .html URLs (Cloudflare 308s them)
//   - JSON-LD that does not parse
//   - <html lang> that does not match the locale folder
//   - the analytics block missing while a GA4 ID is configured
//   - App Store links without a campaign token while a provider token is configured
//   - claims about features that are hidden in production

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { ROOT, SITE_ORIGIN, ALL_LOCALES, SOURCE_LOCALE, readJson } from './lib/site.mjs';
import { englishPages } from './site-inject.mjs';

const errors = [];
const warn = [];
const fail = (page, msg) => errors.push(`${page}: ${msg}`);

// Feature names are matched case-sensitively so ordinary phrases ("time between dates") pass.
const HIDDEN_FEATURE = /\b(World Mood|Mood [Tt]racker|[Ff]ree [Ff]orever)\b|\bTime Between\b(?!\s+([Tt]wo|2)\b)/;
const NO_ANALYTICS = new Set(['invite/index.html', 'public/invite/index.html', 'todoist/oauth/callback-fallback.html']);
const HREFLANG_OK = /^(x-default|[a-z]{2,3}(-[A-Z][a-z]{3})?(-[A-Z]{2})?)$/;

function urlToFile(url) {
  if (!url.startsWith(SITE_ORIGIN + '/')) return null;
  let p = url.slice(SITE_ORIGIN.length + 1);
  if (p === '' || p.endsWith('/')) return `${p}index.html`;
  return `${p}.html`;
}

function fileToUrl(file) {
  if (file === 'index.html') return `${SITE_ORIGIN}/`;
  if (file.endsWith('/index.html')) return `${SITE_ORIGIN}/${file.slice(0, -'index.html'.length)}`;
  return `${SITE_ORIGIN}/${file.replace(/\.html$/, '')}`;
}

async function main() {
  const config = (await readJson('site.config.json', {})) || {};
  const english = await englishPages();
  const files = [...english];
  for (const l of ALL_LOCALES) {
    if (l.code === SOURCE_LOCALE) continue;
    const dir = path.join(ROOT, l.code);
    try {
      const walk = async (rel) => {
        for (const e of await fs.readdir(path.join(ROOT, rel), { withFileTypes: true })) {
          const r = `${rel}/${e.name}`;
          if (e.isDirectory()) await walk(r);
          else if (e.name.endsWith('.html')) files.push(r);
        }
      };
      await fs.access(dir);
      await walk(l.code);
    } catch {}
  }

  const html = new Map();
  for (const f of files) html.set(f, await fs.readFile(path.join(ROOT, f), 'utf8'));
  const isNoindex = h => /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(h);

  const sitemap = await fs.readFile(path.join(ROOT, 'sitemap.xml'), 'utf8');
  const sitemapLocs = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]));

  const hreflangOf = new Map();
  for (const [file, h] of html) {
    if (!/<html[\s>]/i.test(h)) continue;
    const localeCode = ALL_LOCALES.find(l => l.code !== SOURCE_LOCALE && file.startsWith(`${l.code}/`))?.code || SOURCE_LOCALE;
    const indexable = !isNoindex(h);

    const langMatch = h.match(/<html\b[^>]*\blang="([^"]+)"/i);
    const expectLang = ALL_LOCALES.find(l => l.code === localeCode)?.htmlLang;
    if (langMatch && expectLang && langMatch[1] !== expectLang) fail(file, `<html lang="${langMatch[1]}"> but expected ${expectLang}`);

    for (const m of h.matchAll(/href="(\/[^"#?]*\.html)(?:[?#][^"]*)?"/g)) {
      if (/^\/(invite|public|todoist|\.well-known)\//.test(m[1])) continue;
      fail(file, `internal link to ${m[1]} (use the clean URL)`);
      break;
    }

    for (const m of h.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
      try { JSON.parse(m[1]); } catch (e) { fail(file, `JSON-LD does not parse: ${e.message}`); }
    }

    if (config.ga4MeasurementId && !NO_ANALYTICS.has(file.replace(/^[^/]+\/(?=invite|public|todoist)/, '')) && file !== 'friends') {
      if (!h.includes('<!-- left:analytics:start -->')) fail(file, 'analytics block missing');
    }

    if (config.appStoreProviderToken) {
      for (const m of h.matchAll(/href="(https:\/\/apps\.apple\.com\/[^"]+)"/g)) {
        if (m[1].includes('/redeem')) continue;
        if (!/[?&](amp;)?ct=/.test(m[1])) { fail(file, `App Store link without campaign token: ${m[1].slice(0, 90)}`); break; }
      }
    }

    if (!indexable) continue;

    const canon = h.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
    if (file !== 'friends' && file !== 'web.html') {
      if (!canon) fail(file, 'no canonical');
      else if (canon !== fileToUrl(file)) fail(file, `canonical ${canon} is not ${fileToUrl(file)}`);
      else if (!sitemapLocs.has(canon)) fail(file, `missing from sitemap.xml`);
    }
    if (canon && /\.html$/.test(canon)) fail(file, `canonical uses .html: ${canon}`);

    const text = h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ');
    const visible = text.replace(/<[^>]+>/g, ' ');
    const metaDesc = h.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1] || '';
    if (localeCode === SOURCE_LOCALE && (HIDDEN_FEATURE.test(visible) || HIDDEN_FEATURE.test(metaDesc))) {
      fail(file, `mentions a feature hidden in production: "${(visible.match(HIDDEN_FEATURE) || metaDesc.match(HIDDEN_FEATURE))[0]}"`);
    }

    const alternates = [...h.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"/g)].map(m => ({ code: m[1], href: m[2] }));
    if (alternates.length) hreflangOf.set(file, alternates);
  }

  // hreflang: valid codes, targets exist, reciprocal.
  for (const [file, alts] of hreflangOf) {
    const self = fileToUrl(file);
    const codes = new Set();
    let selfListed = false;
    for (const a of alts) {
      if (!HREFLANG_OK.test(a.code) || /-419$/.test(a.code)) fail(file, `unsupported hreflang code ${a.code}`);
      if (codes.has(a.code)) fail(file, `duplicate hreflang ${a.code}`);
      codes.add(a.code);
      if (a.href === self) selfListed = true;
      const target = urlToFile(a.href);
      if (!target || !html.has(target)) { fail(file, `hreflang ${a.code} → ${a.href} has no page`); continue; }
      const back = hreflangOf.get(target);
      if (a.code !== 'x-default' && (!back || !back.some(b => b.href === self))) fail(file, `hreflang ${a.code} → ${a.href} does not link back`);
    }
    if (!selfListed) fail(file, 'hreflang set does not include the page itself');
  }

  for (const loc of sitemapLocs) {
    const f = urlToFile(loc);
    if (!f || !html.has(f)) fail('sitemap.xml', `${loc} has no page`);
    else if (isNoindex(html.get(f))) fail('sitemap.xml', `${loc} is noindex`);
  }

  const pages = [...html.keys()].length;
  if (errors.length) {
    console.error(`[check-site] FAILED with ${errors.length} problem(s) across ${pages} pages:`);
    for (const e of errors.slice(0, 80)) console.error(`  ${e}`);
    if (errors.length > 80) console.error(`  … ${errors.length - 80} more`);
    process.exit(1);
  }
  for (const w of warn) console.warn(`  warning: ${w}`);
  console.log(`[check-site] OK: ${pages} pages, ${sitemapLocs.size} sitemap URLs, ${hreflangOf.size} pages with hreflang.`);
}

main().catch(err => { console.error(err); process.exit(1); });
