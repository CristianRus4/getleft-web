// Read-only check of scripts/lib/appstore.mjs over four representative pages.
// Run: node scripts/lib/appstore.selftest.mjs
// Nothing is written; the rewritten HTML only lives in memory.

import { readFileSync } from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { appStoreUrl, rewriteAppStoreLinks, smartBannerMeta, isOwnAppStoreHref, CT_MAX_LENGTH, siteConfig } from './appstore.mjs';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

const PAGES = [
  ['index.html', 'home', 'en'],
  ['blog/how-to-build-a-streak.html', 'blog', 'en'],
  ['tools/days-until-birthday.html', 'tool', 'en'],
  ['support/streaks-vs-habits.html', 'support', 'en'],
];
const DUMMY = { appStoreProviderToken: '000000' };

function anchors(html) {
  const out = [];
  const re = /<a\s(?:[^>"']|"[^"]*"|'[^']*')*>/gi;
  let m;
  while ((m = re.exec(html))) {
    const href = /\shref\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(m[0]);
    const cta = /\sdata-cta\s*=\s*"([^"]*)"/i.exec(m[0]);
    if (href) out.push({ tag: m[0], href: (href[1] ?? href[2]).replace(/&amp;/g, '&'), cta: cta && cta[1] });
  }
  return out;
}
const metaTag = html => (/<meta name="apple-itunes-app"[^>]*>/.exec(html) || [''])[0];

const cfg = siteConfig();
console.log(`site.config.json: appId=${cfg.appId} providerToken=${cfg.appStoreProviderToken ? 'set' : '(empty)'} prefix=${cfg.campaignPrefix}`);

for (const [mode, override] of [['config as is', undefined], ['dummy provider token', DUMMY]]) {
  console.log(`\n== ${mode}`);
  for (const [page, family, locale] of PAGES) {
    const html = readFileSync(path.join(ROOT_DIR, page), 'utf8');
    const links = [];
    const out = rewriteAppStoreLinks(html, { family, locale, config: override, links });
    console.log(`-- ${page} (${links.length} links)`);
    for (const l of links) {
      console.log(`   ${l.placement.padEnd(7)} ${l.url}${l.ct ? `  [ct ${l.ct.length} chars]` : ''}`);
      if (l.ct) assert.ok(l.ct.length <= 40 && l.ct.length <= CT_MAX_LENGTH, `ct too long: ${l.ct}`);
    }
    assert.ok(links.length > 0, `${page}: no App Store links found`);
    assert.equal(metaTag(out), metaTag(html), `${page}: apple-itunes-app meta changed`);
    assert.equal(rewriteAppStoreLinks(out, { family, locale, config: override }), out, `${page}: rewrite is not idempotent`);
    const own = anchors(out).filter(a => isOwnAppStoreHref(a.href, cfg.appId));
    for (const a of own) {
      assert.ok(a.cta, `${page}: link without data-cta: ${a.tag}`);
      if (override) {
        const u = new URL(a.href);
        assert.ok(u.searchParams.get('ct') && u.searchParams.get('pt') === DUMMY.appStoreProviderToken && u.searchParams.get('mt') === '8', `${page}: untagged link remains: ${a.href}`);
      } else if (cfg.appStoreProviderToken) {
        const u = new URL(a.href);
        assert.ok(u.searchParams.get('ct') && u.searchParams.get('pt') === cfg.appStoreProviderToken && u.searchParams.get('mt') === '8', `${page}: untagged link remains: ${a.href}`);
      } else {
        assert.equal(a.href, `https://apps.apple.com/app/id${cfg.appId}`);
      }
    }
    assert.equal(own.length, links.length, `${page}: rewritten count mismatch`);
  }
}

assert.equal(appStoreUrl({ family: 'blog', placement: 'END', locale: 'zh-Hant', config: DUMMY }),
  `https://apps.apple.com/app/apple-store/id${cfg.appId}?pt=000000&ct=w-blog-end-zh-Hant&mt=8`);
assert.throws(() => appStoreUrl({ family: 'a-very-long-family-name', placement: 'inline', locale: 'zh-Hant', config: DUMMY }), /characters/);
assert.equal(appStoreUrl({ family: 'other', placement: 'qr', locale: 'all' }), cfg.appStoreProviderToken
  ? `https://apps.apple.com/app/apple-store/id${cfg.appId}?pt=${cfg.appStoreProviderToken}&ct=w-other-qr-all&mt=8`
  : `https://apps.apple.com/app/id${cfg.appId}`);
const redeem = '<a href="https://apps.apple.com/redeem?ctx=offercodes&id=6740155884&code=X">r</a>';
assert.equal(rewriteAppStoreLinks(redeem, { family: 'other', locale: 'en', config: DUMMY }), redeem);
const variants = `<nav class="top-nav"><a href='https://apps.apple.com/us/app/x/id${cfg.appId}?a=1&amp;b=2'>a</a></nav><div data-tool-result><p><a class="dl-btn" href="https://apps.apple.com/app/id${cfg.appId}">b</a></p></div><a href="https://apps.apple.com/app/id1">other app</a>`;
const vlinks = [];
rewriteAppStoreLinks(variants, { family: 'tool', locale: 'de', config: DUMMY, links: vlinks });
assert.deepEqual(vlinks.map(l => l.ct), ['w-tool-nav-de', 'w-tool-result-de']);

console.log('\nsmartBannerMeta() now:        ' + smartBannerMeta());
console.log('smartBannerMeta() with token: ' + smartBannerMeta({ config: DUMMY }));
console.log('\nAll assertions passed.');
