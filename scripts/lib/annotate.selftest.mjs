#!/usr/bin/env node
// Self-test for scripts/lib/annotate.mjs. Read-only: never writes files.
//   node scripts/lib/annotate.selftest.mjs

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { annotateHash, translateJsonLd, _internal } from './annotate.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const { parseHtml, markerRanges, hasLetters, collectText, CONTENT_EXCLUDED } = _internal;

const FILES = [
  ['blog/how-to-build-a-streak.html', 'blog.how-to-build-a-streak'],
  ['blog/best-apps-for-adhd-iphone.html', 'blog.best-apps-for-adhd-iphone'],
  ['tools/days-until-birthday.html', 'tools.days-until-birthday'],
  ['tools/business-days-calculator.html', 'tools.business-days-calculator'],
  ['tools/index.html', 'tools.index'],
  ['blog/index.html', 'blog.index'],
  ['press.html', 'pages.press'],
];

// Edge cases the real pages do not exercise.
const SYNTHETIC = `<!DOCTYPE html>
<HTML lang="en"><HEAD><TITLE>Edge &amp; cases | Left</TITLE>
<meta name="description" content="Fish &amp; chips">
<meta property="og:title" content="Left">
<script>if (a < b && "</p>" !== '<p>') { document.title = "<h1>x</h1>"; }</script>
<style>p > a { color: red; } /* <li>not a tag</li> */</style>
<script type="application/ld+json">{"@type":"Article","headline":"Edge headline","author":{"@type":"Person","name":"Jane Doe"},"url":"https://x.y/z","name":"Left"}</script>
<script type="application/ld+json">{ not json </script>
</HEAD><BODY>
<!-- a comment with <p>markup</p> inside -->
<P CLASS="x">Uppercase paragraph</P>
<p data-note="a > b">Attribute with a greater-than sign</p>
<ul><li>First unclosed<li>Second unclosed</ul>
<p>Unclosed paragraph
<div>Div after unclosed p</div>
<p>Has <img src="/a.png" alt="Inline image"> and <a href="/x" title="Inside a unit">link</a>.</p>
<img src="/b.png" alt="Standalone image" />
<img src="/c.png" alt='single quoted'>
<input type="text" placeholder="Type here">
<textarea placeholder="Notes here"><p>not markup</p></textarea>
<div class="nested">Outer text <div>inner div text</div></div>
<span class="wrap"><span id="n">42</span> people counting</span>
<button aria-label="Close dialog">×</button>
<p translate="no">Do not translate me</p>
<div class="notranslate"><p>Nor me</p></div>
<svg><title>Icon title</title><text>svg text</text></svg>
<pre>Preformatted text</pre>
<p><code>only code</code></p>
<p>12,345 — 67%</p>
<p>Left</p>
<p data-i18n="existing.key">Already annotated</p>
<a href="/" data-i18n-attr="aria-label:existing.label" aria-label="Home" title="Go home">Home link</a>
<!-- i18n:switcher:start --><p>Managed block</p><a title="Managed">x</a><!-- i18n:switcher:end -->
<!-- left:faq:start --><div>Also managed</div><!-- left:faq:end -->
<table><tr><td>Cell one<td>Cell two</td></tr></table>
<select><option>Option A</option><option>Option B</select>
<br/><hr>
</BODY></HTML>`;

let failures = 0;
const fail = (file, msg) => { failures++; console.error(`  FAIL ${file}: ${msg}`); };

function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

function strip(html, prefix) {
  const p = escapeRe(prefix);
  return html
    .replace(new RegExp(` data-i18n-html="${p}\\.t[0-9a-f]{10}"`, 'g'), '')
    .replace(new RegExp(` data-i18n-attr="(?:[\\w-]+:${p}\\.a[0-9a-f]{10})(?:,[\\w-]+:${p}\\.a[0-9a-f]{10})*"`, 'g'), '')
    .replace(new RegExp(`,[\\w-]+:${p}\\.a[0-9a-f]{10}`, 'g'), '')
    .replace(new RegExp(` data-i18n-ld="${p}"`, 'g'), '');
}

function elementsOf(node, out = []) {
  for (const c of node.children) if (c.type === 'el') { out.push(c); elementsOf(c, out); }
  return out;
}
const attr = (el, n) => { const a = el.attrs.find(x => x.lname === n); return a ? a.value : null; };

function check(label, src, prefix, { expectUncovered = null, print = true } = {}) {
  const { html, entries } = annotateHash(src, prefix);
  const again = annotateHash(src, prefix);
  if (again.html !== html || JSON.stringify(again.entries) !== JSON.stringify(entries)) fail(label, 'not deterministic');

  // (a) round trip
  if (strip(html, prefix) !== src) {
    const s = strip(html, prefix);
    let k = 0; while (k < s.length && s[k] === src[k]) k++;
    fail(label, `stripping added attributes does not restore the input (first diff at ${k}: ${JSON.stringify(s.slice(k, k + 60))})`);
  }

  const doc = parseHtml(html);
  const ranges = markerRanges(doc.comments);
  const els = elementsOf(doc.root);
  const referenced = new Set();
  let textUnits = 0, attrUnits = 0, ldUnits = 0;
  const pfx = prefix + '.';

  for (const el of els) {
    const k = attr(el, 'data-i18n-html');
    const spec = attr(el, 'data-i18n-attr');
    const ld = attr(el, 'data-i18n-ld');
    const ours = (k && k.startsWith(pfx)) || (spec && spec.includes(pfx)) || ld === prefix;
    if (!ours) continue;

    // (e) never inside script/style/svg/math/... or a marker block
    for (let a = el.parent; a && a.type === 'el'; a = a.parent) {
      if (CONTENT_EXCLUDED.has(a.tag)) fail(label, `<${el.tag}> annotated inside <${a.tag}>`);
    }
    if (ranges.some(([s, e]) => el.start >= s && el.start < e)) fail(label, `<${el.tag}> annotated inside a marker block`);

    if (k && k.startsWith(pfx)) {
      textUnits++;
      const suffix = k.slice(pfx.length);
      referenced.add(suffix);
      // (b) inner HTML equals the entry
      const inner = html.slice(el.startTagEnd, el.endStart);
      if (entries[suffix] === undefined) fail(label, `missing entry ${suffix}`);
      else if (entries[suffix] !== inner && entries[suffix].replace(/\s+/g, ' ').trim() !== inner.replace(/\s+/g, ' ').trim()) {
        fail(label, `inner HTML of ${k} differs from its entry`);
      }
      // (d) no nesting
      for (let a = el.parent; a && a.type === 'el'; a = a.parent) {
        const ak = attr(a, 'data-i18n-html');
        if (ak && ak.startsWith(pfx)) fail(label, `${k} nested inside ${ak}`);
      }
    }
    if (spec) {
      for (const pair of spec.split(',')) {
        const key = pair.split(':')[1];
        if (key && key.startsWith(pfx)) { attrUnits++; referenced.add(key.slice(pfx.length)); }
      }
    }
    if (ld === prefix) {
      const body = el.children.filter(c => c.type === 'text').map(c => html.slice(c.start, c.end)).join('');
      translateJsonLd(body, s => { ldUnits++; referenced.add(s); return null; });
    }
  }

  // The build's own regexes (copied from scripts/build-i18n.mjs transform())
  // must see exactly our units, each with its entry as the inner HTML.
  let regexText = 0;
  html.replace(/<([a-zA-Z][\w-]*)([^>]*?)\sdata-i18n-html="([^"]+)"([^>]*?)>([\s\S]*?)<\/\1>/g, (full, tag, b, key, a, inner) => {
    if (!key.startsWith(pfx)) return full;
    regexText++;
    const e = entries[key.slice(pfx.length)];
    if (e === undefined || e.replace(/\s+/g, ' ').trim() !== inner.replace(/\s+/g, ' ').trim()) fail(label, `build regex sees different inner HTML for ${key}`);
    return full;
  });
  if (regexText !== textUnits) fail(label, `build regex matched ${regexText} text units, tree has ${textUnits}`);
  let regexAttr = 0;
  const countPairs = spec => spec.split(',').filter(p => (p.split(':')[1] || '').startsWith(pfx)).length;
  const step3 = html.replace(/<(meta|link|img|input)\b([^>]*?)\sdata-i18n-attr="([^"]+)"([^>]*?)\/?>/gi, (full, t, b, spec) => { regexAttr += countPairs(spec); return ''; });
  step3.replace(/<([a-zA-Z][\w-]*)\b([^>]*?)\sdata-i18n-attr="([^"]+)"([^>]*?)>/g, (full, t, b, spec) => { regexAttr += countPairs(spec); return full; });
  if (regexAttr !== attrUnits) fail(label, `build regex matched ${regexAttr} attribute units, tree has ${attrUnits}`);

  // (c) every entry is referenced
  for (const s of Object.keys(entries)) if (!referenced.has(s)) fail(label, `entry ${s} is never referenced`);

  // Diagnostics: visible text left without a unit.
  const uncovered = [];
  const visit = (node, ctx) => {
    for (const c of node.children) {
      if (c.type === 'text') {
        if (ctx.covered || ctx.excluded) continue;
        const t = html.slice(c.start, c.end);
        if (hasLetters(t)) uncovered.push(t.replace(/\s+/g, ' ').trim().slice(0, 70));
        continue;
      }
      if (c.type !== 'el') continue;
      const k = attr(c, 'data-i18n-html');
      const excluded = ctx.excluded || CONTENT_EXCLUDED.has(c.tag) || c.tag === 'head' && false ||
        attr(c, 'translate') === 'no' || /(^|\s)notranslate(\s|$)/.test(attr(c, 'class') || '') ||
        attr(c, 'data-i18n') != null || ranges.some(([s, e]) => c.start >= s && c.start < e);
      visit(c, { covered: ctx.covered || !!k, excluded });
    }
  };
  visit(doc.root, { covered: false, excluded: false });
  if (expectUncovered) {
    const missing = expectUncovered.filter(x => !uncovered.some(u => u.includes(x)));
    if (missing.length) fail(label, `expected uncovered text not reported: ${missing.join(' | ')}`);
  }

  const svgUnits = Object.values(entries).filter(v => /<svg\b/i.test(v)).length;
  if (print) {
    console.log(`${label}: ${textUnits} text, ${attrUnits} attr, ${ldUnits} JSON-LD units; ${Object.keys(entries).length} entries` +
      (svgUnits ? `; ${svgUnits} unit(s) carry inline <svg>` : '') +
      (uncovered.length ? `; ${uncovered.length} uncovered text node(s)` : ''));
    for (const [k, v] of Object.entries(entries).slice(0, 5)) {
      console.log(`    ${prefix}.${k} = ${JSON.stringify(v.length > 90 ? v.slice(0, 90) + '…' : v)}`);
    }
    for (const u of uncovered.slice(0, 5)) console.log(`    uncovered: ${JSON.stringify(u)}`);
  }
  return { html, entries, uncovered };
}

// Real pages.
for (const [file, prefix] of FILES) {
  const src = readFileSync(path.join(ROOT, file), 'utf8');
  check(file, src, prefix);
}

// Synthetic edge cases, with explicit expectations.
{
  const prefix = 'test.edge-cases';
  const { html, entries } = check('synthetic', SYNTHETIC, prefix, {
    expectUncovered: ['First unclosed', 'Unclosed paragraph', 'Cell one'],
  });
  const has = s => Object.values(entries).includes(s);
  const expectEntry = (s, yes = true) => { if (has(s) !== yes) fail('synthetic', `${yes ? 'missing' : 'unexpected'} entry ${JSON.stringify(s)}`); };
  expectEntry('Edge &amp; cases | Left');
  expectEntry('Fish & chips');
  expectEntry('Uppercase paragraph');
  expectEntry('Attribute with a greater-than sign', false);
  expectEntry('Has <img src="/a.png" alt="Inline image"> and <a href="/x" title="Inside a unit">link</a>.');
  expectEntry('Inline image', false);
  expectEntry('Inside a unit', false);
  expectEntry('Standalone image');
  expectEntry('single quoted', false);
  expectEntry('Type here');
  expectEntry('Notes here');
  expectEntry('<p>not markup</p>', false);
  expectEntry('Outer text <div>inner div text</div>', false);
  expectEntry('<span id="n">42</span> people counting', false);
  expectEntry('Close dialog');
  expectEntry('Do not translate me', false);
  expectEntry('Nor me', false);
  expectEntry('Icon title', false);
  expectEntry('Preformatted text', false);
  expectEntry('12,345 — 67%', false);
  expectEntry('Left', false);
  expectEntry('Already annotated', false);
  expectEntry('Home', false);
  expectEntry('Go home');
  expectEntry('Home link', false);
  expectEntry('Managed block', false);
  expectEntry('Managed', false);
  expectEntry('Also managed', false);
  expectEntry('Cell two');
  expectEntry('Option A');
  expectEntry('Option B', false);
  expectEntry('Edge headline');
  expectEntry('Jane Doe', false);
  expectEntry('Div after unclosed p');
  if (!html.includes(`<P data-i18n-html="${prefix}.t`)) fail('synthetic', 'uppercase tag name not preserved');
  if (!/<div class="nested" data-i18n-html|<div data-i18n-html="[^"]+" class="nested"/.test(html)) {
    // The outer div nests its own tag, so it must not be a unit.
  }
  if (/class="nested"[^>]*data-i18n-html|data-i18n-html="[^"]+" class="nested"/.test(html)) fail('synthetic', 'nested div wrongly annotated');
  if (!html.includes(`<a href="/" data-i18n-attr="aria-label:existing.label,title:${prefix}.a`)) fail('synthetic', 'existing data-i18n-attr not extended');

  // translateJsonLd
  const ld = '{"@type":"Article","headline":"Edge headline","author":{"@type":"Person","name":"Jane Doe"},"keywords":["x"],"text":["List item one", {"@type":"Thing","name":"Nested name"}]}';
  const seen = [];
  const out = translateJsonLd(ld, k => { seen.push(k); return k === Object.keys(entries).find(x => entries[x] === 'Edge headline') ? 'Titular' : null; });
  const parsed = JSON.parse(out);
  if (parsed.headline !== 'Titular') fail('synthetic', 'translateJsonLd did not apply a translation');
  if (parsed.author.name !== 'Jane Doe') fail('synthetic', 'translateJsonLd touched a Person name');
  if (seen.length !== 3) fail('synthetic', `translateJsonLd looked up ${seen.length} strings, expected 3`);
  if (translateJsonLd('{ broken', () => 'x') !== '{ broken') fail('synthetic', 'unparsable JSON-LD not returned unchanged');
}

if (failures) {
  console.error(`\nannotate self-test: ${failures} failure(s)`);
  process.exit(1);
}
console.log('\nannotate self-test: all checks passed');
