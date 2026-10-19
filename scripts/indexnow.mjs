#!/usr/bin/env node
// Tells Bing and the other IndexNow engines (Yandex, Naver, Seznam) which pages changed, so
// new and edited pages are recrawled within minutes instead of waiting for a sitemap read.
//
//   node scripts/indexnow.mjs            pages changed on origin/main since the last submission
//   node scripts/indexnow.mjs --all      every URL in sitemap.xml
//   node scripts/indexnow.mjs --dry-run  list the URLs without submitting
//   node scripts/indexnow.mjs --since <sha>  pages changed between <sha> and HEAD (the daily
//                                            publish workflow; leaves the local ref alone)
//
// Run it after each push to main. The last submitted commit is stored in the local ref
// refs/indexnow/submitted, which every worktree of this repo shares, so whoever runs it
// next picks up from there.

import { execFileSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { ROOT, SITE_ORIGIN, pageToUrlPath, readJson } from './lib/site.mjs';

const REF = 'refs/indexnow/submitted';
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const sinceIdx = process.argv.indexOf('--since');
const since = sinceIdx >= 0 ? process.argv[sinceIdx + 1] : null;

const git = (...a) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 }).trim();
const tryGit = (...a) => { try { return git(...a); } catch { return null; } };
const sleep = ms => new Promise(r => setTimeout(r, ms));

function sitemapUrls(xml) {
  return new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]));
}

async function waitForKeyFile(key) {
  const url = `${SITE_ORIGIN}/${key}.txt`;
  for (let i = 0; i < 12; i++) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok && (await res.text()).trim() === key) return url;
    } catch {}
    await sleep(15000);
  }
  throw new Error(`${url} does not serve the key yet; push it and wait for the deploy`);
}

async function main() {
  const { indexNowKey: key } = (await readJson('site.config.json', {})) || {};
  if (!key) throw new Error('site.config.json has no indexNowKey');

  if (sinceIdx >= 0 && !since) throw new Error('--since needs a commit');
  let target, base;
  if (since) {
    target = git('rev-parse', 'HEAD');
    base = git('rev-parse', '--verify', `${since}^{commit}`);
  } else {
    tryGit('fetch', '-q', 'origin', 'main');
    target = git('rev-parse', 'origin/main');
    base = tryGit('rev-parse', '-q', '--verify', REF);
  }
  const live = sitemapUrls(git('show', `${target}:sitemap.xml`));

  let urls;
  if (args.has('--all') || !base) {
    urls = [...live];
  } else if (base === target) {
    console.log('[indexnow] nothing new since the last submission.');
    return;
  } else {
    const before = sitemapUrls(tryGit('show', `${base}:sitemap.xml`) || '');
    const changed = git('diff', '--name-only', base, target).split('\n').filter(f => f.endsWith('.html'));
    // Changed pages that are indexable now, plus ones that dropped out of the sitemap,
    // so engines recrawl them and see the removal or noindex.
    urls = changed
      .map(f => `${SITE_ORIGIN}/${pageToUrlPath(f)}`)
      .filter(u => live.has(u) || before.has(u));
    urls = [...new Set(urls)];
  }

  if (!urls.length) {
    console.log('[indexnow] no indexable pages changed.');
    if (!dryRun && !since) git('update-ref', REF, target);
    return;
  }
  if (dryRun) {
    console.log(urls.join('\n'));
    console.log(`[indexnow] ${urls.length} URL(s) would be submitted.`);
    return;
  }

  // Give Cloudflare Pages time to deploy a fresh push before engines start fetching.
  const age = Date.now() / 1000 - Number(git('log', '-1', '--format=%ct', target));
  if (age < 90) await sleep((90 - age) * 1000);
  const keyLocation = await waitForKeyFile(key);

  const host = new URL(SITE_ORIGIN).host;
  for (let i = 0; i < urls.length; i += 10000) {
    const urlList = urls.slice(i, i + 10000);
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host, key, keyLocation, urlList }),
    });
    if (res.status !== 200 && res.status !== 202) {
      throw new Error(`IndexNow answered ${res.status}: ${(await res.text()).slice(0, 200)}`);
    }
  }
  if (!since) git('update-ref', REF, target);
  console.log(`[indexnow] submitted ${urls.length} URL(s) up to ${target.slice(0, 8)}.`);
}

main().catch(err => { console.error(`[indexnow] ${err.message}`); process.exit(1); });
