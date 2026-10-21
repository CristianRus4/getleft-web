// Read-only: samples 3 pages per locale and compares them with the English page (content audit CNTXT-885).
// Usage: node docs/seo/audit/data/sample-locales.mjs > docs/seo/audit/data/locale-sample.json
import fs from 'node:fs';
const LOCS = ['id','de','hi','es','es-419','fr','it','nl','pl','pt','pt-BR','ro','ru','tr','ko','ja','zh-Hans','zh-Hant'];
const read = (p) => fs.readFileSync(p, 'utf8');
const ex = (p) => fs.existsSync(p);
const decode = (s) => (s || '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&nbsp;/g, ' ');
const strip = (h) => h.replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style|svg|noscript|template|nav|footer)[\s\S]*?<\/\1>/gi, ' ');
const blocks = (h) => [...strip(h.slice(h.indexOf('</head>'))).matchAll(/<(h[1-6]|p|li|summary|td|th|figcaption)\b[^>]*>([\s\S]*?)<\/\1>/gi)]
  .map((m) => decode(m[2].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()).filter((t) => t.split(' ').length >= 4);
const head = (h) => (h.match(/<head[\s\S]*?<\/head>/i) || [''])[0];
const title = (h) => decode(((head(h).match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ''])[1]).trim());
const meta = (h, n) => { const t = (head(h).match(/<meta\b[^>]*>/gi) || []).find((m) => new RegExp(`(name|property)="${n}"`, 'i').test(m)); const c = t && t.match(/content="([^"]*)"/i); return c ? decode(c[1]) : null; };
const attrOf = (t, n) => (t.match(new RegExp(`${n}="([^"]*)"`, 'i')) || [])[1] || null;
const out = [];
for (const loc of LOCS) {
  const third = loc === 'es' || loc === 'es-419' ? 'blog/how-to-build-a-streak.html' : loc === 'ja' ? 'tools/days-until-birthday.html'
    : ['de', 'zh-Hant'].includes(loc) ? 'countdown-widget.html' : 'support/widget-iphone-lock-screen.html';
  for (const file of ['index.html', 'support/wallpaper-shortcut.html', third]) {
    const lp = `${loc}/${file}`;
    if (!ex(lp)) { out.push({ loc, file, missing: true }); continue; }
    const en = read(file), lh = read(lp);
    const eb = blocks(en), lb = blocks(lh);
    const enSet = new Set(eb);
    const same = lb.filter((b) => enSet.has(b));
    const canon = (head(lh).match(/<link\b[^>]*rel="canonical"[^>]*>/i) || [''])[0];
    const hl = (head(lh).match(/<link\b[^>]*hreflang=[^>]*>/gi) || []).map((t) => attrOf(t, 'hreflang'));
    const url = '/' + loc + '/' + file.replace(/\.html$/, '').replace(/index$/, '');
    const body = lh.slice(head(lh).length).replace(/<(nav|footer|header)\b[\s\S]*?<\/\1>/gi, ' ');
    const hrefs = [...body.matchAll(/<a\b[^>]*href="([^"]*)"/gi)].map((m) => m[1]).filter((h) => h.startsWith('/') && !h.startsWith('//'));
    const enLinks = hrefs.filter((h) => !h.startsWith('/' + loc + '/') && !/^\/(images|fonts|favicon|left-icon|public)/.test(h) && h !== '/' + loc);
    const enLinksThatHaveLocaleCopy = enLinks.filter((h) => { const p = h.split('#')[0].split('?')[0].replace(/\/$/, '/index'); return ex(`${loc}${p}.html`) || ex(`${loc}${p}`); });
    out.push({
      loc, file, htmlLang: attrOf((lh.match(/<html[^>]*>/i) || [''])[0], 'lang'),
      title: title(lh), titleSameAsEn: title(lh) === title(en), descSameAsEn: meta(lh, 'description') === meta(en, 'description'),
      canonicalSelf: !!canon && (attrOf(canon, 'href') || '').toLowerCase().includes((url).toLowerCase().replace(/\/$/, '')),
      hreflangCount: hl.length, hasXDefault: hl.includes('x-default'), hasSelfHreflang: hl.length > 0,
      blocks: lb.length, enBlocks: eb.length, identicalToEnglish: same.length, identicalPct: lb.length ? Math.round(100 * same.length / lb.length) : null,
      sampleIdentical: same.slice(0, 3).map((s) => s.slice(0, 90)),
      linksToEnglishDespiteLocaleCopy: enLinksThatHaveLocaleCopy.slice(0, 6), enLinkCount: enLinksThatHaveLocaleCopy.length, localeLinkCount: hrefs.filter((h) => h.startsWith('/' + loc + '/')).length,
      imgAltSameAsEn: (() => { const a = (h) => [...h.matchAll(/<img\b[^>]*alt="([^"]+)"/gi)].map((m) => m[1]); const e = new Set(a(en)); return a(lh).filter((x) => e.has(x)).length + '/' + a(lh).length; })(),
    });
  }
}
console.log(JSON.stringify(out, null, 1));
