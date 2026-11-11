#!/usr/bin/env node
// Writes docs/seo/campaign-tokens.tsv: every App Store campaign token on the built site
// (links and Smart App Banners, English and every locale copy) with the page, position and
// locale it stands for, plus the short links in _redirects. App Store Connect reports
// installs per token; this file turns them back into pages. Part of build.mjs, after the
// locale copies. Fails when a token is too long or two pages share one.

import { promises as fs, existsSync } from 'node:fs';
import path from 'node:path';
import { ROOT, ALL_LOCALES, SOURCE_LOCALE, pageToUrlPath } from './lib/site.mjs';
import { englishPages } from './site-inject.mjs';
import { CAMPAIGN_FILE, CT_MAX_LENGTH, POSITION_NAMES, siteConfig, isOwnAppStoreHref } from './lib/appstore.mjs';

const cfg = siteConfig();
const LOCALE_CODES = ALL_LOCALES.map(l => l.code).filter(c => c !== SOURCE_LOCALE);

async function walk(dir, out = []) {
  for (const e of await fs.readdir(path.join(ROOT, dir), { withFileTypes: true })) {
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) await walk(rel, out);
    else if (e.name.endsWith('.html')) out.push(rel);
  }
  return out;
}

async function main() {
  const files = [...await englishPages()];
  for (const loc of LOCALE_CODES) if (existsSync(path.join(ROOT, loc))) files.push(...await walk(loc));

  const rows = new Map(); // token → { url, position, locale }
  const errors = [];
  const add = (token, row) => {
    if (token.length > CT_MAX_LENGTH) errors.push(`${row.url}: token ${token} is ${token.length} characters (max ${CT_MAX_LENGTH})`);
    const prev = rows.get(token);
    if (prev && (prev.url !== row.url || prev.position !== row.position)) errors.push(`token ${token} is used by ${prev.url} (${prev.position}) and ${row.url} (${row.position})`);
    else rows.set(token, row);
  };

  for (const file of files) {
    const html = await fs.readFile(path.join(ROOT, file), 'utf8');
    if (!html.includes('apps.apple.com') && !html.includes('apple-itunes-app')) continue;
    const [first, ...rest] = file.split('/');
    const locale = LOCALE_CODES.includes(first) ? first : SOURCE_LOCALE;
    const page = locale === SOURCE_LOCALE ? file : rest.join('/');
    const url = `/${locale === SOURCE_LOCALE ? '' : `${locale}/`}${pageToUrlPath(page)}`;
    const tokens = [];
    for (const m of html.matchAll(/\shref="(https:\/\/apps\.apple\.com\/[^"]*)"/g)) {
      const href = m[1].replace(/&amp;/g, '&');
      if (!isOwnAppStoreHref(href, cfg.appId)) continue;
      const ct = new URL(href).searchParams.get('ct');
      if (ct) tokens.push(ct);
    }
    const banner = html.match(/<meta\s+name="apple-itunes-app"\s+content="([^"]*)"/i);
    if (banner) {
      const ct = /[?&,\s]ct=([^&,"\s]+)/.exec(banner[1].replace(/&amp;/g, '&'));
      if (ct) tokens.push(ct[1]);
    }
    for (const token of tokens) {
      const parts = token.match(new RegExp(`^${cfg.campaignPrefix}-.+-([a-z])-${locale}$`));
      add(token, { url, position: parts ? POSITION_NAMES[parts[1]] || parts[1] : 'other', locale: parts ? locale : '' });
    }
  }

  // Short links (kept as they are): /app, /download, /ios.
  const redirects = existsSync(path.join(ROOT, '_redirects')) ? await fs.readFile(path.join(ROOT, '_redirects'), 'utf8') : '';
  for (const line of redirects.split('\n')) {
    const m = line.match(/^(\/\S*)\s+(https:\/\/apps\.apple\.com\/\S+)/);
    const ct = m && new URL(m[2]).searchParams.get('ct');
    if (ct) add(ct, { url: m[1], position: 'short link', locale: 'all' });
  }

  if (errors.length) {
    console.error(`[campaigns] FAILED:\n  ${errors.slice(0, 20).join('\n  ')}`);
    process.exit(1);
  }
  const lines = ['token\tpage\tposition\tlocale', ...[...rows].sort(([a], [b]) => a.localeCompare(b)).map(([t, r]) => `${t}\t${r.url}\t${r.position}\t${r.locale}`)];
  const next = lines.join('\n') + '\n';
  const file = path.join(ROOT, CAMPAIGN_FILE);
  const prev = existsSync(file) ? await fs.readFile(file, 'utf8') : null;
  if (prev !== next) await fs.writeFile(file, next);
  console.log(`[campaigns] ${rows.size} campaign tokens on ${files.length} pages${prev !== next ? `; wrote ${CAMPAIGN_FILE}` : ''}.`);
}

main().catch(err => { console.error(`[campaigns] ${err.stack || err.message}`); process.exit(1); });
