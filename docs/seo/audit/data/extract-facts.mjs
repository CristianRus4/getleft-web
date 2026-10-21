// Read-only: extracts per-page facts for the content audit (CNTXT-885).
// Usage: node docs/seo/audit/data/extract-facts.mjs  (run from the repo root)
// Writes docs/seo/audit/data/facts.json. Touches nothing else.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SITE = 'https://getleft.app';
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(ROOT, p));

const LOCALES = fs.readdirSync(path.join(ROOT, 'i18n/locales'))
  .filter((f) => f.endsWith('.json') && f !== 'en.json').map((f) => f.replace('.json', ''));
const localeFolder = (l) => l; // folder names equal codes in this repo

// ---------- page list ----------
const LANDING = ['countdown-widget', 'days-since-widget', 'year-progress-widget', 'life-calendar', 'habit-tracker', 'days-left-wallpaper', 'android'];
const LEGAL = ['privacy', 'terms'];
const pages = [];
const add = (file, group) => pages.push({ file, group });
for (const f of fs.readdirSync(path.join(ROOT, 'blog'))) if (f.endsWith('.html')) add(`blog/${f}`, f === 'index.html' ? 'other' : 'blog');
for (const f of fs.readdirSync(path.join(ROOT, 'tools'))) if (f.endsWith('.html')) add(`tools/${f}`, f === 'index.html' ? 'tools-index' : 'tools');
for (const f of fs.readdirSync(path.join(ROOT, 'support'))) if (f.endsWith('.html')) add(`support/${f}`, 'support');
add('support.html', 'support');
add('index.html', 'site');
for (const l of LANDING) add(`${l}.html`, 'site');
for (const l of ['privacy', 'terms', 'press', 'contact', 'web', 'download', 'promo']) add(`${l}.html`, 'site');
const cleanUrl = (file) => {
  let u = '/' + file.replace(/\.html$/, '').replace(/\/index$/, '/');
  if (u === '/index') u = '/';
  return u;
};

// ---------- GSC ----------
const tsv = (p) => read(p).split('\n').slice(1).filter(Boolean).map((l) => l.split('\t'));
const num = (s) => Number(String(s).replace(/[,%]/g, '')) || 0;
const gscPage = {};
for (const [url, clicks, impr, , pos] of tsv('docs/seo/gsc/2026-10-19/getleft.app/page-16m.tsv')) {
  const u = url.replace(SITE, '') || '/';
  gscPage[u] = { clicks: num(clicks), impr: num(impr), pos: num(pos) };
}
const ltQueries = tsv('docs/seo/gsc/2026-10-19/left-time.app/query-16m.tsv').map(([q, c, i, , p]) => ({ q, clicks: num(c), impr: num(i), pos: num(p) }));
const STOP = new Set(['the', 'a', 'an', 'to', 'for', 'of', 'in', 'on', 'and', 'with', 'left', 'app', 'apps', 'iphone', 'ios', 'how', 'best', 'guide', 'is', 'what', 'my']);
const tokens = (s) => s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter((t) => t.length > 2 && !STOP.has(t));
function ltMatches(slug) {
  const toks = new Set(tokens(slug.replace(/-/g, ' ')));
  if (!toks.size) return { impr: 0, top: [] };
  const hits = ltQueries.filter((r) => tokens(r.q).some((t) => toks.has(t))).sort((a, b) => b.impr - a.impr);
  return { impr: hits.reduce((s, r) => s + r.impr, 0), top: hits.slice(0, 5).map((r) => `${r.q} (${r.impr}, pos ${r.pos})`) };
}

// ---------- parse ----------
const strip = (h) => h.replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style|svg|noscript|template)[\s\S]*?<\/\1>/gi, ' ');
const text = (h) => strip(h).replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const attr = (tag, name) => { const m = tag.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`, 'i')); return m ? m[1] : null; };
const decode = (s) => (s || '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

const sitemap = read('sitemap.xml');
const inSitemap = (url) => sitemap.includes(`<loc>${SITE}${url === '/' ? '/' : url}</loc>`);

const facts = {};
const inbound = {};
const outLinks = {};

for (const { file, group } of pages) {
  const html = read(file);
  const url = cleanUrl(file);
  const head = (html.match(/<head[\s\S]*?<\/head>/i) || [''])[0];
  const body = html.slice(head.length);
  const title = decode((head.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ''])[1]).trim();
  const metaTags = head.match(/<meta\b[^>]*>/gi) || [];
  const meta = (n) => { const t = metaTags.find((m) => new RegExp(`(name|property)="${n}"`, 'i').test(m)); return t ? decode(attr(t, 'content')) : null; };
  const desc = meta('description');
  const robots = meta('robots');
  const canonTag = (head.match(/<link\b[^>]*rel="canonical"[^>]*>/i) || [''])[0];
  const canonical = canonTag ? attr(canonTag, 'href') : null;
  const hreflangs = (head.match(/<link\b[^>]*hreflang=[^>]*>/gi) || []).length;
  const ld = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  const ldTypes = new Set();
  let datePublished = null, dateModified = null, authorInLd = false;
  for (const raw of ld) {
    const typeMatches = raw.match(/"@type"\s*:\s*(?:"([^"]+)"|\[([^\]]*)\])/g) || [];
    for (const t of typeMatches) for (const x of t.match(/"([A-Za-z]+)"/g) || []) if (x !== '"@type"') ldTypes.add(x.replace(/"/g, ''));
    datePublished = datePublished || (raw.match(/"datePublished"\s*:\s*"([^"]+)"/) || [])[1] || null;
    dateModified = dateModified || (raw.match(/"dateModified"\s*:\s*"([^"]+)"/) || [])[1] || null;
    if (/"author"/.test(raw)) authorInLd = true;
  }
  const h1s = (body.match(/<h1\b[\s\S]*?<\/h1>/gi) || []).map(text);
  const h2s = (body.match(/<h2\b[\s\S]*?<\/h2>/gi) || []).map(text);
  const visible = text(body.replace(/<(nav|footer|header)\b[\s\S]*?<\/\1>/gi, ' '));
  const words = visible ? visible.split(' ').length : 0;
  const imgs = body.match(/<img\b[^>]*>/gi) || [];
  const imgNoAlt = imgs.filter((i) => { const a = attr(i, 'alt'); return a === null; }).length;
  const imgEmptyAlt = imgs.filter((i) => attr(i, 'alt') === '').length;
  const anchors = [...body.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map((m) => ({ href: attr(m[1], 'href') || '', cta: attr(m[1], 'data-cta'), label: text(m[2]).slice(0, 80) }));
  const mainBody = body.replace(/<(nav|footer|header)\b[\s\S]*?<\/\1>/gi, ' ');
  const mainAnchors = [...mainBody.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map((m) => ({ href: attr(m[1], 'href') || '', cta: attr(m[1], 'data-cta'), label: text(m[2]).slice(0, 80) }));
  const appStoreLinks = mainAnchors.filter((a) => /apps\.apple\.com|go\.getleft\.app/.test(a.href));
  const internal = [...new Set(mainAnchors.map((a) => a.href).filter((h) => /^\//.test(h) || h.startsWith(SITE)).map((h) => h.replace(SITE, '').split('#')[0].split('?')[0].replace(/\.html$/, '').replace(/\/index$/, '/') || '/').filter((h) => h !== url))];
  const external = [...new Set(mainAnchors.map((a) => a.href).filter((h) => /^https?:\/\//.test(h) && !h.startsWith(SITE) && !/apps\.apple\.com|go\.getleft\.app/.test(h)))];
  outLinks[url] = internal;
  for (const t of internal) inbound[t] = (inbound[t] || 0) + 1;
  const locLinks = internal.filter((h) => LOCALES.some((l) => h.startsWith(`/${l}/`)));
  const updatedLine = (visible.match(/(Updated|Last updated|Published|Reviewed)[^.]{0,40}\d{4}/i) || [null])[0];
  const byline = /\b(By |Written by|Author|About the author|Reviewed by)\b/.test(visible) || /rel="author"|class="[^"]*(byline|author)/i.test(body);
  const lcvisible = visible.toLowerCase();
  const claimHits = {};
  const probes = {
    mood: /\bmood\b|world mood/i, timeBetween: /time between/i, watch: /apple watch|watchos|complication/i,
    freeForever: /free forever|forever free|always free|completely free|100% free/i, price: /[$£€]\s?\d|\d+\s?(usd|dollars)\b|per (month|year)|\/(mo|yr|month|year)\b/i,
    ipad: /\bipad(os)?\b/i, mac: /\bmac(os)?\b/i, android: /\bandroid\b/i, ios: /ios\s?(\d+)/gi,
    unlimited: /unlimited/i, trial: /free trial|trial period|\d+-day trial/i, rating: /\b\d(\.\d)?\s?(stars?|\/5)|rated \d|aggregateRating/i,
    controlCenter: /control center/i, pomodoro: /focus (timer|session|mode)|pomodoro/i, downloadsClaim: /\b\d[\d,.]*\s?(k|m)?\+?\s?(users|downloads|people)\b/i,
  };
  for (const [k, re] of Object.entries(probes)) {
    const ms = [...visible.matchAll(new RegExp(re.source, 'gi'))];
    if (ms.length) claimHits[k] = ms.slice(0, 3).map((m) => visible.slice(Math.max(0, m.index - 50), m.index + m[0].length + 50));
  }
  // locale copies
  const locCopies = LOCALES.filter((l) => exists(`${localeFolder(l)}/${file}`));
  const slug = path.basename(file, '.html');
  const lt = ltMatches(slug);
  facts[url] = {
    file, url, group, title, titleLen: title.length, desc, descLen: desc ? desc.length : 0, robots, noindex: /noindex/i.test(robots || ''),
    canonical, canonicalOk: canonical === SITE + (url === '/' ? '/' : url), inSitemap: inSitemap(url), hreflangs,
    jsonLd: [...ldTypes], datePublished, dateModified, authorInLd, byline, updatedLine,
    h1: h1s, h2Count: h2s.length, h2s: h2s.slice(0, 14), words, imgs: imgs.length, imgNoAlt, imgEmptyAlt,
    ogImage: meta('og:image'), twitterCard: meta('twitter:card'),
    appStoreLinks: appStoreLinks.length, ctaTags: appStoreLinks.map((a) => a.cta || '-'), ctaLabels: [...new Set(appStoreLinks.map((a) => a.label))].slice(0, 3),
    internalOut: internal.length, internalOutList: internal, externalOut: external.length, externalList: external.slice(0, 10), localeLinks: locLinks,
    claimHits, localeCopies: locCopies.length, localeCopyList: locCopies,
    gsc: gscPage[url] || null, ltTopicImpr: lt.impr, ltTopQueries: lt.top,
  };
}
for (const u of Object.keys(facts)) facts[u].inboundFromAudited = inbound[u] || 0;

fs.writeFileSync(path.join(ROOT, 'docs/seo/audit/data/facts.json'), JSON.stringify(facts, null, 1));
console.log('pages', Object.keys(facts).length, Object.entries(Object.values(facts).reduce((a, f) => ((a[f.group] = (a[f.group] || 0) + 1), a), {})).join(' '));
