#!/usr/bin/env node
// Writes the Related list at the end of every live English blog post (scripts/lib/related.mjs
// has the rules). Part of build.mjs, after the blog list and before the locale copies, which
// render the same list in each language. Idempotent: a second run changes nothing.
// A post from the last 7 days is linked from at least MIN_INBOUND lists (older posts on its topic).

import { promises as fs, existsSync } from 'node:fs';
import path from 'node:path';
import { ROOT } from './lib/site.mjs';
import { buildDate, loadSchedule, pendingPages } from './lib/publish.mjs';
import { takeManual, pickRelated, blockHtml, upsertBlock, topicsOf, plainText, h1Inner } from './lib/related.mjs';

const isNoindex = html => /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html);
const MIN_INBOUND = 3;
const pageOf = href => {
  const p = href.replace(/^\//, '');
  if (p === '') return 'index.html';
  return p.endsWith('/') ? `${p}index.html` : `${p}.html`;
};

async function main() {
  const date = buildDate();
  const { pages: schedule } = loadSchedule();
  const pending = new Set(pendingPages(date));
  const files = (await fs.readdir(path.join(ROOT, 'blog'))).filter(f => f.endsWith('.html') && f !== 'index.html').sort();

  const posts = [];
  const html = new Map();
  for (const f of files) {
    const page = `blog/${f}`;
    const src = await fs.readFile(path.join(ROOT, page), 'utf8');
    html.set(page, src);
    const inner = h1Inner(src);
    if (!inner) continue;
    const slug = f.replace(/\.html$/, '');
    const title = plainText(inner);
    const published = (src.match(/"datePublished"\s*:\s*"(\d{4}-\d{2}-\d{2})/) || [])[1] || '';
    posts.push({ page, path: `/blog/${slug}`, slug, title, date: schedule[page] || published, topics: topicsOf(slug, title), indexable: !isNoindex(src) });
  }
  const candidates = posts.filter(p => p.indexable);
  const titleCache = new Map();
  const titleOf = async page => {
    if (!titleCache.has(page)) {
      const src = html.get(page) ?? await fs.readFile(path.join(ROOT, page), 'utf8');
      titleCache.set(page, plainText(h1Inner(src) || ''));
    }
    return titleCache.get(page);
  };

  // 1. Each post's list: its own links that are live, then the newest related posts.
  const lists = new Map();
  for (const post of posts) {
    const { html: stripped, manual: found } = takeManual(html.get(post.page));
    const manual = found.filter(p => p !== post.path);
    const items = [];
    for (const href of manual) {
      const page = pageOf(href);
      if (pending.has(page) || !existsSync(path.join(ROOT, page))) continue; // queued: shows from its date
      const title = await titleOf(page);
      if (title) items.push({ href, title });
    }
    for (const p of pickRelated(post, candidates, new Set([post.path, ...manual]))) items.push({ href: p.path, title: p.title });
    lists.set(post.page, { stripped, manual, items });
  }

  // 2. A post from the last week that fewer than 3 lists link to is added to the lists of the
  //    older posts closest to it in topic, so a new post is linked the day it goes live.
  const inboundOf = href => [...lists.values()].filter(l => l.items.some(i => i.href === href)).length;
  const weekAgo = new Date(Date.parse(`${date}T00:00:00Z`) - 6 * 86400000).toISOString().slice(0, 10);
  for (const post of candidates.filter(p => p.date >= weekAgo && p.date <= date).sort((a, b) => b.date.localeCompare(a.date))) {
    let missing = MIN_INBOUND - inboundOf(post.path);
    if (missing <= 0) continue;
    const hosts = candidates
      .filter(h => h.path !== post.path && h.date < post.date && !lists.get(h.page).items.some(i => i.href === post.path))
      .map(h => ({ h, score: [...h.topics].filter(t => post.topics.has(t)).length }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score || b.h.date.localeCompare(a.h.date) || a.h.slug.localeCompare(b.h.slug));
    for (const { h } of hosts) {
      if (missing <= 0) break;
      lists.get(h.page).items.push({ href: post.path, title: post.title });
      missing--;
    }
  }

  // 3. Write.
  let changed = 0;
  const inbound = new Map();
  for (const post of posts) {
    const { stripped, manual, items } = lists.get(post.page);
    for (const i of items) inbound.set(i.href, (inbound.get(i.href) || 0) + 1);
    const after = upsertBlock(stripped, blockHtml({ manual, items }));
    if (after !== html.get(post.page)) {
      await fs.writeFile(path.join(ROOT, post.page), after);
      changed++;
    }
  }

  const today = posts.filter(p => p.indexable && schedule[p.page] === date);
  const thin = today.filter(p => (inbound.get(p.path) || 0) < MIN_INBOUND);
  console.log(`[related] ${posts.length} posts, ${changed} updated.${today.length ? ` Published today: ${today.map(p => `${p.slug} (${inbound.get(p.path) || 0} related links)`).join(', ')}.` : ''}`);
  for (const p of thin) console.warn(`  warning: ${p.page} is linked from only ${inbound.get(p.path) || 0} Related list(s); add a topic word to lib/related.mjs or a manual link`);
}

main().catch(err => { console.error(`[related] ${err.stack || err.message}`); process.exit(1); });
