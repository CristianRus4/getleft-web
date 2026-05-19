#!/usr/bin/env node
// One-shot helper: add data-i18n attributes to a set of HTML files,
// extract their English text into a JSON fragment, and merge the fragment
// into i18n/locales/en.json under the chosen namespace.
//
// Usage:
//   node scripts/auto-annotate.mjs support.html support
//   node scripts/auto-annotate.mjs support/*.html support_articles
//   node scripts/auto-annotate.mjs tools/*.html tool_pages
//
// Behavior:
//   - Replaces the <nav> and <footer> blocks with shared annotated versions.
//   - Wraps text inside <h1>, <h2>, <h3>, <p>, <li>, <summary>, <strong>
//     inside <main>/<section> in data-i18n attributes (unique sequential keys).
//   - Skips elements that already have data-i18n* attrs.
//   - Writes annotated HTML back to the same files.
//   - Appends/merges keys into i18n/locales/en.json under namespace.<page-slug>.
//
// Designed to be idempotent: re-running on an already-annotated file is a no-op.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');

const argv = process.argv.slice(2);
if (argv.length < 2) {
  console.error('Usage: node scripts/auto-annotate.mjs <file...> <namespace>');
  process.exit(1);
}
const namespace = argv[argv.length - 1];
const files = argv.slice(0, -1);

const NAV_BLOCK = `  <nav class="top-nav top-nav--visible" aria-label="Primary">
    <div class="container nav-inner">
      <a href="/" class="brand">Left</a>
      <div class="nav-trailing">
        <div class="nav-links">
          <a href="/#features" class="nav-link" data-i18n="common.nav.features">Features</a>
        </div>
        <a class="btn btn-primary" href="https://apps.apple.com/us/app/left-widgets-for-time-left/id6740155884?itscg=30200&amp;itsct=apps_box_badge&amp;mttnsubad=6740155884" target="_blank" rel="noopener" data-i18n="common.nav.download">Download</a>
      </div>
    </div>
  </nav>`;

const FOOTER_BLOCK = `  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-main">
        <div class="footer-brand">
          <span class="footer-counter-inline"><span id="userCounter">2,100,000</span> <span data-i18n="common.footer.counter_suffix">people making every moment count.</span></span>
          <span data-i18n="common.footer.tagline">Left – Coded in NZ – © 2026 cntxt</span>
        </div>
        <nav class="footer-links" aria-label="Footer">
          <a href="/support.html" data-i18n="common.footer.support">Support</a>
          <a href="/terms.html" data-i18n="common.footer.terms">Terms</a>
          <a href="/privacy.html" data-i18n="common.footer.privacy">Privacy</a>
          <a href="/press.html" data-i18n="common.footer.press">Press</a>
          <a href="/contact.html" data-i18n="common.footer.contact">Contact</a>
          <a href="/tools/" data-i18n="common.footer.tools">Tools</a>
        </nav>
      </div>
    </div>
  </footer>`;

function slugifyFile(file) {
  return path.basename(file, '.html').replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '').toLowerCase();
}

function deepMerge(target, source) {
  for (const k of Object.keys(source)) {
    if (source[k] && typeof source[k] === 'object' && !Array.isArray(source[k])) {
      target[k] = deepMerge(target[k] || {}, source[k]);
    } else {
      target[k] = source[k];
    }
  }
  return target;
}

function setKey(obj, dotted, value) {
  const parts = dotted.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!(parts[i] in cur) || typeof cur[parts[i]] !== 'object' || Array.isArray(cur[parts[i]])) {
      cur[parts[i]] = {};
    }
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

async function processFile(file) {
  const full = path.join(ROOT, file);
  let html = await fs.readFile(full, 'utf8');
  const slug = slugifyFile(file);
  const baseKey = `${namespace}.${slug}`;
  const collected = {};

  // 1) Replace the nav block (anything between <nav class="top-nav"...> and </nav>).
  html = html.replace(/<nav class="top-nav[^"]*"[\s\S]*?<\/nav>/, NAV_BLOCK);

  // 2) Replace the footer block.
  html = html.replace(/<footer class="site-footer">[\s\S]*?<\/footer>/, FOOTER_BLOCK);

  // 3) Annotate <title> and meta description.
  html = html.replace(/<title>([^<]+)<\/title>/, (m, t) => {
    if (m.includes('data-i18n')) return m;
    setKey(collected, 'meta.title', t.trim());
    return `<title data-i18n="${baseKey}.meta.title">${t}</title>`;
  });
  html = html.replace(/<meta\s+name="description"\s+content="([^"]+)"\s*\/?>/, (m, t) => {
    if (m.includes('data-i18n')) return m;
    setKey(collected, 'meta.description', t);
    return `<meta data-i18n-attr="content:${baseKey}.meta.description" name="description" content="${t}" />`;
  });

  // 4) Auto-annotate text nodes inside main/section.
  // We do it tag-by-tag with safe regex (text-only contents).
  const counters = {};
  const next = (tag) => { counters[tag] = (counters[tag] || 0) + 1; return counters[tag]; };

  const annotateTag = (tagPattern, keyPrefix) => {
    const re = new RegExp(`<(${tagPattern})((?:\\s+[^>]*)?)>([^<>]+)<\\/\\1>`, 'g');
    html = html.replace(re, (m, tag, attrs, inner) => {
      if (attrs.includes('data-i18n')) return m;
      const trimmed = inner.trim();
      if (!trimmed || /^[\s\d\W]+$/.test(trimmed)) return m;
      if (trimmed.length < 2) return m;
      const idx = next(keyPrefix);
      const key = `${keyPrefix}_${idx}`;
      setKey(collected, key, trimmed);
      return `<${tag}${attrs} data-i18n="${baseKey}.${key}">${inner}</${tag}>`;
    });
  };

  // Order matters: h1/h2/h3 first, then p, then li/summary, then strong.
  annotateTag('h1', 'h1');
  annotateTag('h2', 'h2');
  annotateTag('h3', 'h3');
  annotateTag('p', 'p');
  annotateTag('summary', 'summary');
  annotateTag('li', 'li');
  // Buttons/labels with text-only content
  annotateTag('button', 'btn');
  // Strong-only paragraphs are caught above; standalone <strong> within mixed text we skip.

  await fs.writeFile(full, html);
  return { slug, collected };
}

async function main() {
  const enFile = path.join(ROOT, 'i18n', 'locales', 'en.json');
  const en = JSON.parse(await fs.readFile(enFile, 'utf8'));
  if (!en[namespace]) en[namespace] = {};

  for (const file of files) {
    const { slug, collected } = await processFile(file);
    if (!en[namespace][slug]) en[namespace][slug] = {};
    deepMerge(en[namespace][slug], collected);
    const count = countLeaves(collected);
    console.log(`[annotate] ${file} → ${namespace}.${slug} (+${count} keys)`);
  }

  await fs.writeFile(enFile, JSON.stringify(en, null, 2) + '\n');
  console.log(`[annotate] en.json updated.`);
}

function countLeaves(obj) {
  let n = 0;
  for (const v of Object.values(obj)) {
    if (v && typeof v === 'object' && !Array.isArray(v)) n += countLeaves(v);
    else n += 1;
  }
  return n;
}

main().catch(err => { console.error(err); process.exit(1); });
