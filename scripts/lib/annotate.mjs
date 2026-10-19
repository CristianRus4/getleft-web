// In-memory i18n annotation for pages that are not hand-annotated (blog,
// generated tool pages, standalone pages). The source files on disk stay
// clean; at build time annotateHash() adds data-i18n-html / data-i18n-attr /
// data-i18n-ld attributes whose keys are content hashes of the English value,
// so the catalog survives edits elsewhere on the page and a changed sentence
// simply becomes a new key.
//
// The output is consumed unchanged by scripts/build-i18n.mjs transform(),
// whose regexes impose the safety rules enforced below: a data-i18n-html
// element's inner HTML must not contain its own closing tag, start tags must
// not carry a literal '>' inside an attribute value, and every translated
// attribute must be double-quoted.

import { createHash } from 'node:crypto';

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
const RAW_TEXT = new Set(['script', 'style', 'textarea', 'title', 'xmp', 'iframe', 'noembed', 'noframes', 'noscript']);

// Elements that are translated as one HTML unit when they hold text and
// contain none of each other.
const BLOCK = new Set(['title', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'dt', 'dd', 'th', 'td', 'caption', 'figcaption', 'blockquote', 'summary', 'label', 'legend', 'button', 'option']);
// Containers that are annotated only when they hold text directly and no
// block-level unit could take it.
const FALLBACK = new Set(['div', 'span', 'a', 'strong', 'em', 'small', 'section', 'header', 'footer', 'nav', 'aside', 'figure']);
// Nothing inside these is ever annotated.
const CONTENT_EXCLUDED = new Set(['script', 'style', 'svg', 'math', 'code', 'pre', 'noscript', 'template', 'textarea']);
// These may not even get attribute annotations on their own start tag.
const ATTR_EXCLUDED_SELF = new Set(['script', 'style', 'template', 'noscript', 'svg', 'math']);
// A text unit must not swallow live code or managed markup.
const FORBIDDEN_INSIDE_UNIT = new Set(['script', 'style', 'template', 'noscript', 'textarea', 'iframe', 'object']);

const META_NAMES = new Set(['description', 'twitter:title', 'twitter:description', 'twitter:image:alt']);
const META_PROPERTIES = new Set(['og:title', 'og:description', 'og:image:alt']);
const GENERIC_ATTRS = ['alt', 'aria-label', 'title', 'placeholder'];

const JSONLD_KEYS = new Set(['name', 'headline', 'alternativeHeadline', 'description', 'text', 'caption', 'articleBody']);
// The name of a person or organisation is a proper noun, not copy.
const JSONLD_PROPER_NAME_TYPES = new Set(['Person', 'Organization', 'Corporation', 'Brand']);

const MARKER_RE = /^<!--\s*(i18n|left):([\w.-]+):(start|end)\s*-->$/;

// ─── public API ────────────────────────────────────────────────────────────

export function annotateHash(html, prefix) {
  if (typeof html !== 'string') throw new TypeError('annotateHash: html must be a string');
  if (typeof prefix !== 'string' || !/^[^\s".]+(\.[^\s".]+)*$/.test(prefix)) {
    throw new Error(`annotateHash: invalid prefix ${JSON.stringify(prefix)}`);
  }

  const doc = parseHtml(html);
  const ranges = markerRanges(doc.comments);
  prepare(doc, html, ranges);

  const entries = {};
  const addEntry = (suffix, value) => {
    const prev = entries[suffix];
    if (prev === undefined) { entries[suffix] = value; return; }
    if (normalize(prev) !== normalize(value)) {
      throw new Error(`annotateHash: hash collision on ${prefix}.${suffix}`);
    }
  };

  const elements = [];
  walkElements(doc.root, el => elements.push(el));

  const markAnnotated = el => {
    el.annotated = true;
    for (let a = el.parent; a && a.type === 'el'; a = a.parent) a.annotatedDesc = true;
  };
  const annotateText = el => {
    const inner = html.slice(el.startTagEnd, el.endStart);
    const suffix = 't' + hash(inner);
    addEntry(suffix, inner);
    el.textKey = `${prefix}.${suffix}`;
    markAnnotated(el);
  };
  const canText = el =>
    !el.blocked && !el.hasI18n && !el.hasI18nDesc && !el.hasForbiddenDesc && !el.containsMarker &&
    !el.annotated && !el.annotatedDesc && !hasAnnotatedAncestor(el) &&
    el.explicitEnd && el.rawEndTag === `</${el.rawTag}>` && startTagSafe(html, el) &&
    !html.slice(el.startTagEnd, el.endStart).includes(`</${el.rawTag}>`);

  // 1. Block-level units: the innermost listed element that holds text.
  for (const el of elements) {
    if (!BLOCK.has(el.tag) || el.hasBlockDesc) continue;
    if (!hasLetters(collectText(html, el, false))) continue;
    if (canText(el)) annotateText(el);
  }

  // 2. Fallback containers holding text directly (document order, so an
  //    outer container wins over the inline elements inside it).
  for (const el of elements) {
    if (!FALLBACK.has(el.tag) || el.blocked || el.hasBlockDesc || el.annotated) continue;
    if (hasAnnotatedAncestor(el)) continue;
    if (!hasLetters(collectText(html, el, true))) continue;
    if (canText(el)) { annotateText(el); continue; }
    // The container cannot be a unit itself (e.g. it nests its own tag,
    // which would end the build regex early): hand its text to the nearest
    // ancestor that can carry it.
    for (let a = el.parent; a && a.type === 'el'; a = a.parent) {
      if (a.tag === 'body' || a.tag === 'html' || a.tag === 'head') break;
      if (a.blocked || a.hasBlockDesc || a.annotatedDesc || a.hasI18n) break;
      if ((FALLBACK.has(a.tag) || BLOCK.has(a.tag)) && canText(a)) { annotateText(a); break; }
    }
  }

  // 3. Translatable attributes (not inside a text unit: those travel with
  //    the unit's inner HTML).
  for (const el of elements) {
    if (el.blockedInside || ATTR_EXCLUDED_SELF.has(el.tag)) continue;
    if (hasAnnotatedAncestor(el) || !startTagSafe(html, el)) continue;
    const existingSpec = el.attrs.find(a => a.lname === 'data-i18n-attr');
    if (existingSpec && existingSpec.quote !== '"') continue;
    const covered = new Set(existingSpec ? existingSpec.value.split(',').map(p => p.split(':')[0].trim().toLowerCase()) : []);
    const wanted = [];
    if (el.tag === 'meta') {
      const name = attrValue(el, 'name');
      const property = attrValue(el, 'property');
      if ((name && META_NAMES.has(name.trim().toLowerCase())) || (property && META_PROPERTIES.has(property.trim().toLowerCase()))) {
        wanted.push('content');
      }
    }
    for (const a of GENERIC_ATTRS) {
      if (a === 'title' && el.tag === 'link') continue;
      wanted.push(a);
    }
    const pairs = [];
    for (const name of wanted) {
      if (covered.has(name)) continue;
      const matches = el.attrs.filter(a => a.lname === name);
      if (matches.length !== 1) continue;
      const attr = matches[0];
      if (attr.quote !== '"') continue;
      const value = decodeEntities(attr.value);
      if (!isTranslatableString(value)) continue;
      const suffix = 'a' + hash(value);
      addEntry(suffix, value);
      pairs.push(`${name}:${prefix}.${suffix}`);
    }
    if (!pairs.length) continue;
    if (existingSpec) el.attrExtend = { pos: existingSpec.valueEnd, text: ',' + pairs.join(',') };
    else el.attrSpec = pairs.join(',');
  }

  // 4. JSON-LD blocks without their own i18n handling.
  for (const el of elements) {
    if (el.tag !== 'script' || el.blockedInsideMarker) continue;
    const type = attrValue(el, 'type');
    if (!type || type.trim().toLowerCase() !== 'application/ld+json') continue;
    if (el.attrs.some(a => a.lname.startsWith('data-i18n-jsonld') || a.lname === 'data-i18n-ld')) continue;
    const text = el.children.filter(c => c.type === 'text').map(c => html.slice(c.start, c.end)).join('');
    let data;
    try { data = JSON.parse(text); } catch { continue; }
    let found = 0;
    walkJsonLd(data, value => {
      addEntry('l' + hash(value), value);
      found++;
      return value;
    });
    if (found) el.ldPrefix = prefix;
  }

  // Apply insertions back to front so earlier offsets stay valid.
  const insertions = [];
  for (const el of elements) {
    let text = '';
    if (el.textKey) text += ` data-i18n-html="${el.textKey}"`;
    if (el.attrSpec) text += ` data-i18n-attr="${el.attrSpec}"`;
    if (el.ldPrefix) text += ` data-i18n-ld="${el.ldPrefix}"`;
    if (text) insertions.push({ pos: el.start + 1 + el.rawTag.length, text });
    if (el.attrExtend) insertions.push(el.attrExtend);
  }
  insertions.sort((a, b) => b.pos - a.pos);
  let out = html;
  for (const { pos, text } of insertions) out = out.slice(0, pos) + text + out.slice(pos);

  return { html: out, entries };
}

// Replace the translatable strings of a JSON-LD block. `lookup` receives the
// entry suffix (`l<hash>`) and returns the translation or null/undefined.
export function translateJsonLd(jsonText, lookup) {
  let data;
  try { data = JSON.parse(jsonText); } catch { return jsonText; }
  const translated = walkJsonLd(data, value => {
    const t = lookup('l' + hash(value));
    return t ?? value;
  });
  return JSON.stringify(translated, null, 2);
}

// The hash used for every key: first 10 hex chars of sha1 of the value with
// whitespace runs collapsed and trimmed.
export function hashValue(value) { return hash(value); }

// Exposed for the self-test and diagnostics only.
export const _internal = { parseHtml, markerRanges, hasLetters, collectText, CONTENT_EXCLUDED, BLOCK, FALLBACK };

// ─── helpers ───────────────────────────────────────────────────────────────

function normalize(s) { return String(s).replace(/\s+/g, ' ').trim(); }
function hash(s) { return createHash('sha1').update(normalize(s), 'utf8').digest('hex').slice(0, 10); }

function hasLetters(s) {
  const text = String(s).replace(/&(?:#\d+|#x[0-9a-f]+|[a-z][a-z0-9]*);/gi, ' ').replace(/\bLeft\b/g, ' ');
  return /\p{L}/u.test(text);
}

function isUrl(s) {
  const t = s.trim();
  if (/^data:/i.test(t)) return true;
  if (/\s/.test(t)) return false;
  return /^(?:https?:|mailto:|tel:|sms:|ftp:|javascript:|itms(?:-apps)?:|\/\/|\/|#|\.\.?\/|www\.)/i.test(t);
}

function isTranslatableString(s) {
  if (typeof s !== 'string') return false;
  const t = s.trim();
  if (!t || t === 'Left' || isUrl(t)) return false;
  return hasLetters(t);
}

const NAMED_ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', hellip: '…', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', middot: '·', copy: '©', reg: '®', trade: '™' };
function decodeEntities(s) {
  return s.replace(/&(#\d+|#x[0-9a-f]+|[a-z][a-z0-9]*);/gi, (m, body) => {
    if (body[0] === '#') {
      const code = body[1] === 'x' || body[1] === 'X' ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
      try { return String.fromCodePoint(code); } catch { return m; }
    }
    const v = NAMED_ENTITIES[body.toLowerCase()];
    return v ?? m;
  });
}

function attrValue(el, lname) {
  const a = el.attrs.find(x => x.lname === lname);
  return a ? (a.value ?? '') : null;
}

function startTagSafe(html, el) {
  const tag = html.slice(el.start, el.startTagEnd);
  return tag.indexOf('>') === tag.length - 1;
}

function hasAnnotatedAncestor(el) {
  for (let a = el.parent; a && a.type === 'el'; a = a.parent) if (a.annotated) return true;
  return false;
}

function walkElements(node, fn) {
  for (const c of node.children) {
    if (c.type !== 'el') continue;
    fn(c);
    walkElements(c, fn);
  }
}

function isTranslateNo(el) {
  const tr = attrValue(el, 'translate');
  if (tr != null && tr.trim().toLowerCase() === 'no') return true;
  const cls = attrValue(el, 'class');
  return cls != null && /(^|\s)notranslate(\s|$)/.test(cls);
}

// Text of an element's subtree, skipping excluded content. With `direct`,
// stop at nested block/fallback elements (they own their own text).
function collectText(html, el, direct) {
  let out = '';
  const visit = node => {
    for (const c of node.children) {
      if (c.type === 'text') { out += html.slice(c.start, c.end) + ' '; continue; }
      if (c.type !== 'el') continue;
      if (CONTENT_EXCLUDED.has(c.tag) || isTranslateNo(c)) continue;
      if (direct && (BLOCK.has(c.tag) || FALLBACK.has(c.tag))) continue;
      visit(c);
    }
  };
  if (el.tag === 'title') {
    // RCDATA: the raw text child is the title.
    for (const c of el.children) if (c.type === 'text') out += html.slice(c.start, c.end);
    return out;
  }
  visit(el);
  return out;
}

function markerRanges(comments) {
  const ranges = [];
  const open = new Map();
  for (const c of comments) {
    const m = MARKER_RE.exec(c.text);
    if (!m) continue;
    const id = `${m[1]}:${m[2]}`;
    if (m[3] === 'start') {
      if (!open.has(id)) open.set(id, c.start);
    } else if (open.has(id)) {
      ranges.push([open.get(id), c.end]);
      open.delete(id);
    }
  }
  for (const start of open.values()) ranges.push([start, Infinity]);
  return ranges;
}

// Compute inherited exclusion and subtree flags once.
function prepare(doc, html, ranges) {
  const inMarker = pos => ranges.some(([s, e]) => pos >= s && pos < e);
  const visit = (el, inherited) => {
    // inherited: { inside, insideMarker }
    const selfMarker = inMarker(el.start);
    el.blockedInsideMarker = inherited.insideMarker || selfMarker;
    el.hasI18n = el.attrs.some(a => a.lname.startsWith('data-i18n'));
    const translateNo = isTranslateNo(el);
    el.blockedInside = inherited.inside || selfMarker || translateNo;
    el.blocked = el.blockedInside || CONTENT_EXCLUDED.has(el.tag);
    el.containsMarker = ranges.some(([s, e]) => s < el.end && e > el.start);
    const ownsTextI18n = el.attrs.some(a => a.lname === 'data-i18n' || a.lname === 'data-i18n-html' || a.lname.startsWith('data-i18n-list'));
    const childInherited = {
      inside: el.blocked || ownsTextI18n,
      insideMarker: el.blockedInsideMarker,
    };
    el.hasBlockDesc = false;
    el.hasI18nDesc = false;
    el.hasForbiddenDesc = false;
    for (const c of el.children) {
      if (c.type !== 'el') continue;
      visit(c, childInherited);
      if (BLOCK.has(c.tag) || c.hasBlockDesc) el.hasBlockDesc = true;
      if (c.hasI18n || c.hasI18nDesc) el.hasI18nDesc = true;
      if (FORBIDDEN_INSIDE_UNIT.has(c.tag) || c.hasForbiddenDesc) el.hasForbiddenDesc = true;
    }
  };
  for (const c of doc.root.children) if (c.type === 'el') visit(c, { inside: false, insideMarker: false });
}

function walkJsonLd(node, replace) {
  if (Array.isArray(node)) return node.map(n => walkJsonLd(n, replace));
  if (!node || typeof node !== 'object') return node;
  const types = [].concat(node['@type'] ?? []);
  const properName = types.some(t => JSONLD_PROPER_NAME_TYPES.has(t));
  const out = {};
  for (const [k, v] of Object.entries(node)) {
    if (JSONLD_KEYS.has(k) && !(k === 'name' && properName)) {
      if (typeof v === 'string') { out[k] = isTranslatableString(v) ? replace(v) : v; continue; }
      if (Array.isArray(v)) {
        out[k] = v.map(x => (typeof x === 'string' ? (isTranslatableString(x) ? replace(x) : x) : walkJsonLd(x, replace)));
        continue;
      }
    }
    out[k] = walkJsonLd(v, replace);
  }
  return out;
}

// ─── tokenizer + light tree ────────────────────────────────────────────────

const NAME_RE = /[A-Za-z][^\s/>]*/y;
const ATTR_NAME_RE = /[^\s/>][^\s/>=]*/y;
const UNQUOTED_RE = /[^\s>]*/y;

function parseHtml(html) {
  const n = html.length;
  const root = { type: 'root', tag: '#root', children: [], parent: null, attrs: [] };
  const stack = [root];
  const comments = [];
  const cur = () => stack[stack.length - 1];
  let textStart = 0;
  const flushText = end => {
    if (end > textStart) cur().children.push({ type: 'text', start: textStart, end, parent: cur() });
  };
  const closeImplicitly = (idx, pos) => {
    while (stack.length - 1 >= idx) {
      const el = stack.pop();
      el.end = pos;
      el.explicitEnd = false;
    }
  };
  const findOpen = (names, boundaries) => {
    for (let k = stack.length - 1; k > 0; k--) {
      const t = stack[k].tag;
      if (names.has(t)) return k;
      if (boundaries.has(t)) return -1;
    }
    return -1;
  };

  let i = 0;
  while (i < n) {
    const lt = html.indexOf('<', i);
    if (lt === -1) break;
    const next = html[lt + 1];

    if (html.startsWith('<!--', lt)) {
      flushText(lt);
      let e = html.indexOf('-->', lt + 4);
      e = e === -1 ? n : e + 3;
      comments.push({ start: lt, end: e, text: html.slice(lt, e) });
      i = textStart = e;
      continue;
    }
    if (next === '!' || next === '?') {
      flushText(lt);
      let e = html.indexOf('>', lt);
      e = e === -1 ? n : e + 1;
      i = textStart = e;
      continue;
    }
    if (next === '/' && /[A-Za-z]/.test(html[lt + 2] || '')) {
      NAME_RE.lastIndex = lt + 2;
      const m = NAME_RE.exec(html);
      let e = html.indexOf('>', lt);
      if (e === -1) { i = lt + 1; continue; }
      e += 1;
      flushText(lt);
      const lname = m[0].toLowerCase();
      let idx = -1;
      for (let k = stack.length - 1; k > 0; k--) if (stack[k].tag === lname) { idx = k; break; }
      if (idx !== -1) {
        closeImplicitly(idx + 1, lt);
        const el = stack.pop();
        el.endStart = lt;
        el.end = e;
        el.explicitEnd = true;
        el.rawEndTag = html.slice(lt, e);
      }
      i = textStart = e;
      continue;
    }
    if (/[A-Za-z]/.test(next || '')) {
      const tag = parseStartTag(html, lt);
      if (!tag) { i = lt + 1; continue; }
      flushText(lt);
      const lname = tag.rawTag.toLowerCase();
      applyImpliedEnds(lname, stack, findOpen, closeImplicitly, lt);
      const el = {
        type: 'el', tag: lname, rawTag: tag.rawTag, attrs: tag.attrs, children: [], parent: cur(),
        start: lt, startTagEnd: tag.end, endStart: null, end: null, explicitEnd: false, rawEndTag: null,
        selfClosing: tag.selfClosing,
      };
      cur().children.push(el);
      i = textStart = tag.end;
      if (VOID.has(lname) || tag.selfClosing) {
        el.end = tag.end;
        continue;
      }
      stack.push(el);
      if (RAW_TEXT.has(lname)) {
        const re = new RegExp(`</${lname}(?=[\\s/>])`, 'ig');
        re.lastIndex = tag.end;
        const m = re.exec(html);
        const close = m ? m.index : n;
        if (close > tag.end) el.children.push({ type: 'text', start: tag.end, end: close, parent: el, raw: true });
        i = textStart = close;
      }
      continue;
    }
    i = lt + 1; // a literal '<' in text
  }
  flushText(n);
  closeImplicitly(1, n);
  return { root, comments };
}

const P_CLOSERS = new Set(['address', 'article', 'aside', 'blockquote', 'details', 'dialog', 'div', 'dl', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'main', 'menu', 'nav', 'ol', 'p', 'pre', 'section', 'table', 'ul', 'li', 'dd', 'dt', 'summary']);
const P_SCOPE = new Set(['button', 'td', 'th', 'caption', 'table', 'html', 'template', 'object', 'marquee', 'applet']);
const LIST_SCOPE = new Set(['ul', 'ol', 'menu', ...P_SCOPE]);
const DL_SCOPE = new Set(['dl', ...P_SCOPE]);
const ROW_SCOPE = new Set(['tr', 'table', 'html', 'template']);
const SECTION_SCOPE = new Set(['table', 'html', 'template']);
const SELECT_SCOPE = new Set(['select', 'datalist', 'html']);

function applyImpliedEnds(lname, stack, findOpen, closeImplicitly, pos) {
  const close = (names, scope) => {
    const k = findOpen(names, scope);
    if (k !== -1) closeImplicitly(k, pos);
  };
  if (lname === 'li') close(new Set(['li']), LIST_SCOPE);
  if (lname === 'dt' || lname === 'dd') close(new Set(['dt', 'dd']), DL_SCOPE);
  if (P_CLOSERS.has(lname)) close(new Set(['p']), P_SCOPE);
  if (lname === 'option') close(new Set(['option']), SELECT_SCOPE);
  if (lname === 'optgroup') close(new Set(['option', 'optgroup']), SELECT_SCOPE);
  if (lname === 'td' || lname === 'th') close(new Set(['td', 'th']), ROW_SCOPE);
  if (lname === 'tr') close(new Set(['tr']), new Set(['table', 'thead', 'tbody', 'tfoot', 'html', 'template']));
  if (lname === 'thead' || lname === 'tbody' || lname === 'tfoot') close(new Set(['thead', 'tbody', 'tfoot']), SECTION_SCOPE);
}

function parseStartTag(html, lt) {
  const n = html.length;
  NAME_RE.lastIndex = lt + 1;
  const m = NAME_RE.exec(html);
  if (!m) return null;
  const rawTag = m[0];
  let j = lt + 1 + rawTag.length;
  const attrs = [];
  while (j < n) {
    while (j < n && /\s/.test(html[j])) j++;
    if (j >= n) return null;
    const ch = html[j];
    if (ch === '>') return { rawTag, attrs, end: j + 1, selfClosing: false };
    if (ch === '/') {
      if (html[j + 1] === '>') return { rawTag, attrs, end: j + 2, selfClosing: true };
      j++;
      continue;
    }
    ATTR_NAME_RE.lastIndex = j;
    const nm = ATTR_NAME_RE.exec(html);
    if (!nm) { j++; continue; }
    const nameStart = j;
    const name = nm[0];
    j += name.length;
    let k = j;
    while (k < n && /\s/.test(html[k])) k++;
    let value = null, quote = null, valueStart = null, valueEnd = null;
    if (html[k] === '=') {
      k++;
      while (k < n && /\s/.test(html[k])) k++;
      const q = html[k];
      if (q === '"' || q === "'") {
        const close = html.indexOf(q, k + 1);
        if (close === -1) return null;
        quote = q;
        valueStart = k + 1;
        valueEnd = close;
        value = html.slice(valueStart, valueEnd);
        j = close + 1;
      } else {
        UNQUOTED_RE.lastIndex = k;
        const um = UNQUOTED_RE.exec(html);
        quote = '';
        valueStart = k;
        valueEnd = k + um[0].length;
        value = um[0];
        j = valueEnd;
      }
    }
    attrs.push({ name, lname: name.toLowerCase(), value, quote, nameStart, valueStart, valueEnd });
  }
  return null;
}
