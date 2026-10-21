#!/usr/bin/env node
// Adds a card to the blog list (blog/index.html) for every live English post that has none,
// so a post promoted from scheduled/ is listed the day it goes live. Part of build.mjs.
//
// Only adds: existing cards, their order and any hand edits stay as they are, and a post that
// already has a card (href="/blog/<slug>") is never added again, so the build is idempotent.
// New cards go at the top of the list, newest release date first.
//
// Listed: blog/<slug>.html, not under scheduled/ and not the index, without a noindex robots meta,
// not in UNLISTED, and not dated in the future in i18n/publish-schedule.json.
// The card is built from the post: h1 (title and image alt), meta description, the
// "N min read" in its article-meta (or words / 230, rounded up), and
// /images/blog/<slug>-hero.webp. The release date is the post's date in the publish schedule,
// else its JSON-LD datePublished.
//
// Locale lists come from this file through scripts/build-i18n.mjs, which keeps a card only where
// the post has a copy in that locale and the card's text is translated.

import { promises as fs, existsSync } from 'node:fs';
import path from 'node:path';
import { ROOT, escapeText, escapeAttr } from './lib/site.mjs';
import { buildDate, loadSchedule } from './lib/publish.mjs';

export const BLOG_DIR = 'blog';
export const BLOG_INDEX = 'blog/index.html';
// Indexable posts that must stay off the list. Noindexed posts (blog/left-apple-watch-app.html
// until the watch app ships) are skipped without being named here.
export const UNLISTED = new Set([]);
const WORDS_PER_MINUTE = 230;

const GRID_RE = /(<section\b[^>]*\bclass="[^"]*\bblog-grid\b[^"]*"[^>]*>)([ \t]*\n)?/;

const decode = s => String(s)
  .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const plain = html => decode(String(html).replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();

export const isNoindex = html => /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html);

// Slugs that already have a card, from href="/blog/<slug>" (with or without .html).
export function listedSlugs(indexHtml) {
  const out = new Set();
  for (const m of indexHtml.matchAll(/<a\b[^>]*>/g)) {
    if (!/\bclass="[^"]*\bblog-card\b/.test(m[0])) continue;
    const href = m[0].match(/\bhref="(?:https:\/\/getleft\.app)?\/blog\/([^"?#/]+?)(?:\.html)?(?:[?#][^"]*)?"/);
    if (href) out.add(href[1]);
  }
  return out;
}

// Card fields read from a post's HTML, or null when it has no h1 or description.
export function postCard(slug, html, scheduleDate = null) {
  const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  const desc = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  if (!h1 || !desc) return null;
  const meta = html.match(/<p\b[^>]*class="article-meta"[^>]*>([\s\S]*?)<\/p>/i);
  const stated = meta && plain(meta[1]).match(/(\d+)\s*min read/i);
  let minutes = stated ? Number(stated[1]) : 0;
  if (!minutes) {
    const body = (html.match(/<article\b[\s\S]*?<\/article>/i) || [html.replace(/<head\b[\s\S]*?<\/head>/i, '')])[0]
      .replace(/<(script|style|svg)\b[\s\S]*?<\/\1>/gi, ' ');
    const words = plain(body).split(' ').filter(w => /\p{L}/u.test(w)).length;
    minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
  }
  const published = html.match(/"datePublished"\s*:\s*"(\d{4}-\d{2}-\d{2})/);
  return {
    slug,
    title: plain(h1[1]),
    // Drop the SEO freshness stamp ("Checked 20 October 2026.") so the card reads like the hand-written ones.
    description: plain(desc[1]).replace(/\s*(?:Checked|Updated|Reviewed)\s+\d{1,2}\s+[A-Za-z]+\s+\d{4}\.?\s*$/, ''),
    minutes,
    date: scheduleDate || (published ? published[1] : ''),
  };
}

export function cardHtml(c) {
  const title = escapeText(c.title);
  return [
    `    <a class="blog-card" href="/blog/${c.slug}">`,
    `      <div class="blog-cover"><img src="/images/blog/${c.slug}-hero.webp" alt="${escapeAttr(c.title)}" width="1200" height="675" loading="lazy" decoding="async" /></div>`,
    `      <div class="blog-body">`,
    `        <div class="blog-title">${title}</div>`,
    `        <div class="blog-excerpt">${escapeText(c.description)}</div>`,
    `        <div class="blog-meta">${c.minutes} min read</div>`,
    `      </div>`,
    `    </a>`,
  ].join('\n');
}

// Inserts the cards at the top of the grid, newest date first (then by slug, for a stable order).
export function addCards(indexHtml, cards) {
  if (!cards.length) return indexHtml;
  if (!GRID_RE.test(indexHtml)) throw new Error(`${BLOG_INDEX}: no <section class="... blog-grid"> to add cards to`);
  const sorted = [...cards].sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
  const block = sorted.map(c => `\n${cardHtml(c)}\n`).join('');
  return indexHtml.replace(GRID_RE, (m, open) => `${open}\n${block}`);
}

// The posts that are live on `date` and missing from the list, as cards.
export async function missingCards(root = ROOT, date = buildDate(), schedule = loadSchedule()) {
  const indexHtml = await fs.readFile(path.join(root, BLOG_INDEX), 'utf8');
  const listed = listedSlugs(indexHtml);
  const cards = [];
  const warnings = [];
  for (const file of (await fs.readdir(path.join(root, BLOG_DIR))).sort()) {
    if (!file.endsWith('.html') || file === 'index.html') continue;
    const slug = file.slice(0, -'.html'.length);
    const page = `${BLOG_DIR}/${file}`;
    if (listed.has(slug) || UNLISTED.has(slug)) continue;
    const scheduled = schedule.pages[page];
    if (scheduled && scheduled > date) continue;
    const html = await fs.readFile(path.join(root, page), 'utf8');
    if (isNoindex(html)) continue;
    const card = postCard(slug, html, scheduled);
    if (!card) { warnings.push(`${page} has no h1 or meta description, so it gets no card`); continue; }
    if (!existsSync(path.join(root, 'images', 'blog', `${slug}-hero.webp`))) warnings.push(`${page}: images/blog/${slug}-hero.webp is missing`);
    cards.push(card);
  }
  return { indexHtml, cards, warnings };
}

export async function syncBlogList(root = ROOT, date = buildDate()) {
  const { indexHtml, cards, warnings } = await missingCards(root, date);
  const next = addCards(indexHtml, cards);
  if (next !== indexHtml) await fs.writeFile(path.join(root, BLOG_INDEX), next);
  return { added: cards.map(c => c.slug), warnings };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const { added, warnings } = await syncBlogList();
    for (const w of warnings) console.warn(`  warning: ${w}`);
    console.log(`[blog-list] ${added.length ? `added ${added.length} card(s): ${added.join(', ')}` : 'every live post has a card'}.`);
  } catch (err) {
    console.error(`[blog-list] ${err.message}`);
    process.exit(1);
  }
}
