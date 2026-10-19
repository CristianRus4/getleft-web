// App Store links for the site build: campaign-tagged product page URLs, the
// placement-aware rewrite of every App Store <a> in a page, and the Smart App
// Banner meta tag. All values come from site.config.json; an empty
// appStoreProviderToken means "campaigns not set up yet" and yields clean,
// untagged links so the site keeps working.

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

let cachedConfig = null;
export function siteConfig() {
  if (!cachedConfig) cachedConfig = JSON.parse(readFileSync(path.join(ROOT, 'site.config.json'), 'utf8'));
  return cachedConfig;
}

function resolveConfig(override) {
  return override ? { ...siteConfig(), ...override } : siteConfig();
}

// App Store Connect Help, "Campaign links": the campaign token accepts "up to
// 30 alphanumeric characters and spaces" plus some punctuation, and may not
// start or end with a space. Generated tokens only use [A-Za-z0-9-], so the
// stricter documented 30 is the ceiling (it also satisfies the old 40 rule).
// https://developer.apple.com/help/app-store-connect-analytics/acquisition/campaign-links
export const CT_MAX_LENGTH = 30;

export function campaignToken({ family, placement, locale, config } = {}) {
  const cfg = resolveConfig(config);
  if (!family || !placement || !locale) throw new Error(`campaignToken needs family, placement and locale (got ${family}/${placement}/${locale})`);
  const ct = `${cfg.campaignPrefix}-${String(family).toLowerCase()}-${String(placement).toLowerCase()}-${locale}`;
  if (!/^[A-Za-z0-9-]+$/.test(ct)) throw new Error(`Campaign token "${ct}" has characters outside [A-Za-z0-9-]`);
  if (ct.length > CT_MAX_LENGTH) throw new Error(`Campaign token "${ct}" is ${ct.length} characters; App Store Connect allows ${CT_MAX_LENGTH}`);
  return ct;
}

export function appStoreUrl({ family, placement, locale, config } = {}) {
  const cfg = resolveConfig(config);
  if (!cfg.appStoreProviderToken) return `https://apps.apple.com/app/id${cfg.appId}`;
  const ct = campaignToken({ family, placement, locale, config });
  return `https://apps.apple.com/app/apple-store/id${cfg.appId}?pt=${encodeURIComponent(cfg.appStoreProviderToken)}&ct=${encodeURIComponent(ct)}&mt=8`;
}

// Smart App Banner. Apple's WebKit reference ("Promoting apps with Smart App
// Banners", developer.apple.com/documentation/webkit/promoting-apps-with-smart-app-banners)
// documents only app-id and app-argument. App Store Connect Help ("Campaign
// links", URL above) says to "add your campaign token and provider token when
// implementing a Smart App Banner" but gives no syntax; the only carrier the
// banner has ever accepted is affiliate-data (formerly in the WebKit reference
// for the affiliate program), which developers use as
// affiliate-data=pt=…&ct=…&mt=8 (Apple Developer Forums 803466, 824941; not
// confirmed by Apple). So the campaign is added only once a provider token
// exists; an unrecognised parameter is ignored by Safari, so this cannot break
// the banner. Campaign data appears after 5+ first-time downloads.
export function smartBannerMeta({ appArgument, config } = {}) {
  const cfg = resolveConfig(config);
  const parts = [`app-id=${cfg.appId}`];
  if (appArgument) parts.push(`app-argument=${appArgument}`);
  if (cfg.appStoreProviderToken) {
    parts.push(`affiliate-data=pt=${cfg.appStoreProviderToken}&ct=${cfg.campaignPrefix}-banner&mt=8`);
  }
  return `<meta name="apple-itunes-app" content="${escapeAttr(parts.join(', '))}" />`;
}

// ───────── Link rewriting ─────────

// Same order as analytics.js placementFor(): the first rule any ancestor (or
// the link itself) matches wins, not the nearest ancestor.
const PLACEMENT_RULES = [
  [n => n.classes.has('top-nav'), 'nav'],
  [n => n.classes.has('hero-floater'), 'float'],
  [n => n.classes.has('hero'), 'hero'],
  [n => n.classes.has('download-block') || n.classes.has('download-cta'), 'end'],
  [n => n.classes.has('site-footer'), 'footer'],
  [n => n.classes.has('tool-result') || n.attrs.has('data-tool-result'), 'result'],
];

export function inferPlacement(chain) {
  for (const [test, placement] of PLACEMENT_RULES) {
    if (chain.some(test)) return placement;
  }
  return 'inline';
}

const VOID_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
const RAW_TEXT_TAGS = new Set(['script', 'style', 'textarea', 'title']);
const ATTR_RE = /([^\s"'<>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

function decodeEntities(s) {
  return s.replace(/&(amp|quot|#39|apos|lt|gt);/g, (_, e) => ({ amp: '&', quot: '"', '#39': "'", apos: "'", lt: '<', gt: '>' })[e]);
}
function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Attributes of a start tag with their value offsets inside the tag text.
function parseAttributes(tagText, nameLength) {
  const attrs = new Map();
  const body = tagText.slice(1 + nameLength).replace(/\/?>$/, '');
  const base = 1 + nameLength;
  ATTR_RE.lastIndex = 0;
  let m;
  while ((m = ATTR_RE.exec(body))) {
    const name = m[1].toLowerCase();
    if (attrs.has(name)) continue;
    const raw = m[2] ?? m[3] ?? m[4];
    let valueStart = -1;
    if (raw !== undefined) {
      const quoted = m[2] !== undefined || m[3] !== undefined;
      valueStart = base + m.index + m[0].length - raw.length - (quoted ? 1 : 0);
    }
    attrs.set(name, { value: raw === undefined ? '' : decodeEntities(raw), raw, valueStart, quoted: m[2] !== undefined ? '"' : m[3] !== undefined ? "'" : '' });
  }
  return attrs;
}

export function isOwnAppStoreHref(href, appId = siteConfig().appId) {
  let u;
  try { u = new URL(href); } catch { return false; }
  if (u.hostname !== 'apps.apple.com') return false;
  if (u.pathname.startsWith('/redeem')) return false;
  return new RegExp(`/id${appId}(?:/|$)`).test(u.pathname);
}

// Rewrites every <a> pointing at this app's App Store page to the campaign
// URL for its placement, adding data-cta when it is missing. Leaves
// apps.apple.com/redeem links and the apple-itunes-app meta tag alone.
// Returns the new HTML; `links` on the options object (when passed) receives
// one { placement, ct, url } record per rewritten link.
export function rewriteAppStoreLinks(html, { family, locale, config, links } = {}) {
  const cfg = resolveConfig(config);
  const stack = [];
  let out = '';
  let pos = 0;
  const tagRe = /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<![^>]*>|<\/([A-Za-z][\w:-]*)\s*>|<([A-Za-z][\w:-]*)(?:\s(?:[^>"']|"[^"]*"|'[^']*')*)?\/?>/g;
  let m;
  while ((m = tagRe.exec(html))) {
    const [text, closeName, openName] = m;
    if (closeName) {
      const name = closeName.toLowerCase();
      const idx = stack.map(n => n.tag).lastIndexOf(name);
      if (idx >= 0) stack.length = idx;
      continue;
    }
    if (!openName) continue;
    const tag = openName.toLowerCase();
    const attrs = parseAttributes(text, openName.length);
    const node = {
      tag,
      classes: new Set((attrs.get('class')?.value || '').split(/\s+/).filter(Boolean)),
      attrs,
    };

    if (tag === 'a' && attrs.get('href') && isOwnAppStoreHref(attrs.get('href').value, cfg.appId)) {
      const existing = attrs.get('data-cta')?.value;
      const placement = existing || inferPlacement([...stack, node]);
      const url = appStoreUrl({ family, placement, locale, config });
      const href = attrs.get('href');
      let newTag = text;
      if (href.raw !== undefined) {
        const q = href.quoted || '"';
        const start = href.valueStart - (href.quoted ? 1 : 0);
        const end = href.valueStart + href.raw.length + (href.quoted ? 1 : 0);
        newTag = text.slice(0, start) + q + escapeAttr(url) + q + text.slice(end);
      }
      if (!existing) newTag = newTag.replace(/\s*(\/?)>$/, ` data-cta="${escapeAttr(placement)}"$1>`);
      out += html.slice(pos, m.index) + newTag;
      pos = m.index + text.length;
      if (links) links.push({ placement, ct: cfg.appStoreProviderToken ? campaignToken({ family, placement, locale, config }) : null, url });
    }

    if (RAW_TEXT_TAGS.has(tag)) {
      const close = new RegExp(`</${tag}\\s*>`, 'ig');
      close.lastIndex = tagRe.lastIndex;
      const c = close.exec(html);
      tagRe.lastIndex = c ? c.index + c[0].length : html.length;
      continue;
    }
    if (!VOID_TAGS.has(tag) && !text.endsWith('/>')) stack.push(node);
  }
  return out + html.slice(pos);
}
