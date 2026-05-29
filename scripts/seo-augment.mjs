#!/usr/bin/env node
// One-shot, idempotent SEO augmenter for standalone (non-i18n-built) pages.
//   node scripts/seo-augment.mjs
// - Blog articles missing og:image: inject og:url, og:image (1200x630 fallback),
//   og:site_name, and a Twitter summary_large_image card.
// - Tool pages missing og:site_name: inject it after og:type/og:url.
// Safe to re-run: every insertion is guarded by a presence check.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const OG_IMAGE = 'https://getleft.app/images/og-image.png';

function attr(html, re) { const m = html.match(re); return m ? m[1] : null; }

async function listHtml(dir) {
  const full = path.join(ROOT, dir);
  const out = [];
  for (const e of await fs.readdir(full)) {
    if (e.endsWith('.html') && e !== 'index.html') out.push(`${dir}/${e}`);
  }
  return out;
}

async function augmentBlog(file) {
  const full = path.join(ROOT, file);
  let html = await fs.readFile(full, 'utf8');
  if (/property="og:image"/.test(html)) return false; // already done
  const canonical = attr(html, /<link\s+rel="canonical"\s+href="([^"]+)"/i);
  const ogTitle = attr(html, /<meta\s+property="og:title"\s+content="([^"]+)"/i)
    || attr(html, /<title>([^<]+)<\/title>/i) || 'Left Blog';
  const ogDesc = attr(html, /<meta\s+property="og:description"\s+content="([^"]+)"/i)
    || attr(html, /<meta\s+name="description"\s+content="([^"]+)"/i) || '';
  const block = [
    canonical ? `  <meta property="og:url" content="${canonical}" />` : null,
    `  <meta property="og:image" content="${OG_IMAGE}" />`,
    `  <meta property="og:image:width" content="1200" />`,
    `  <meta property="og:image:height" content="630" />`,
    `  <meta property="og:site_name" content="Left" />`,
    `  <meta name="twitter:card" content="summary_large_image" />`,
    `  <meta name="twitter:title" content="${ogTitle}" />`,
    `  <meta name="twitter:description" content="${ogDesc}" />`,
    `  <meta name="twitter:image" content="${OG_IMAGE}" />`,
  ].filter(Boolean).join('\n');
  // Insert right after the og:type line (present on every blog article).
  html = html.replace(/(<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>)/i,
    `$1\n${block}`);
  await fs.writeFile(full, html);
  return true;
}

async function augmentTool(file) {
  const full = path.join(ROOT, file);
  let html = await fs.readFile(full, 'utf8');
  if (/property="og:site_name"/.test(html)) return false;
  if (!/property="og:image"/.test(html)) return false; // expect tools already have og:image
  // Add og:site_name after og:image (or after og:type if image line absent).
  const anchor = /(<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>)/i;
  if (anchor.test(html)) {
    html = html.replace(anchor, `$1\n  <meta property="og:site_name" content="Left" />`);
  } else {
    html = html.replace(/(<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>)/i,
      `$1\n  <meta property="og:site_name" content="Left" />`);
  }
  await fs.writeFile(full, html);
  return true;
}

async function main() {
  let blogN = 0, toolN = 0;
  for (const f of await listHtml('blog')) { if (await augmentBlog(f)) { blogN++; console.log(`[seo] blog +OG  ${f}`); } }
  for (const f of await listHtml('tools')) { if (await augmentTool(f)) { toolN++; console.log(`[seo] tool +site_name ${f}`); } }
  console.log(`[seo] done. blog: ${blogN}, tools: ${toolN}`);
}

main().catch(e => { console.error(e); process.exit(1); });
