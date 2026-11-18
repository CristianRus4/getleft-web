/*
  Left printables: the shared core (window.LeftPrint).

  Every printable page loads, in this order:
    /tools/tools.js           shared tool helpers (sharing, analytics, toolT)
    /tools/print/strings.js   English text (generated from i18n/tools-runtime/print/*.json)
    /tools/print/core.js      this file
    /tools/print/<id>.js      one printable: LeftPrint.define({...})

  What lives here, so that one change applies to every printable:
    PAPERS, TIERS   page sizes and the per-size numbers (padding, rule, line weight)
    P (parts)       the building blocks every sheet is drawn with: head, rule,
                    check (circle), day (rounded square), box, lines, field,
                    section, label. Their look lives in tools/print/print.css.
    t()             translated text: window.LEFT_TOOL_I18N.print on translated
                    pages, falling back to window.LEFT_PRINT_EN
    fmt             month, weekday and date names in the page's language
    define/mount    the controls, the live preview, the link (state in the
                    URL hash, never sent to a server) and printing.
*/
(function () {
  'use strict';

  // ─────────── Paper ───────────

  // Portrait size in CSS px (96 per inch) and the physical size for @page.
  // Letter uses the A4 tier: same type sizes and spacing, its own page box.
  const PAPERS = {
    A5: { w: 559, h: 794, size: ['148mm', '210mm'], tier: 'A5' },
    A4: { w: 794, h: 1123, size: ['210mm', '297mm'], tier: 'A4' },
    A3: { w: 1123, h: 1587, size: ['297mm', '420mm'], tier: 'A3' },
    Letter: { w: 816, h: 1056, size: ['8.5in', '11in'], tier: 'A4' },
  };
  const PAPER_ORDER = ['A5', 'A4', 'A3', 'Letter'];

  // Page padding, header rule and stroke weight per size.
  const TIERS = {
    A5: { px: 40, py: 36, rule: 1.5, ruleGap: 9, lw: 1.1 },
    A4: { px: 56, py: 52, rule: 2, ruleGap: 12, lw: 1.3 },
    A3: { px: 80, py: 72, rule: 3, ruleGap: 16, lw: 1.6 },
  };

  const ACCENTS = ['#FF4F00', '#0D0D0D', '#0A84FF', '#34C759', '#BF5AF2'];

  // Regions that print on US Letter and start the week on Sunday.
  const LETTER_REGIONS = ['US', 'CA', 'MX', 'PH', 'CL', 'CO', 'VE', 'PR', 'GT', 'CR', 'PA', 'DO', 'SV', 'NI'];
  const SUNDAY_REGIONS = ['US', 'CA', 'MX', 'PH', 'BR', 'JP', 'KR', 'TW', 'HK', 'IL', 'IN', 'ZA', 'CO', 'VE', 'PE', 'GT', 'PR', 'DO', 'SV', 'HN', 'NI', 'PA', 'SA', 'AU'];

  function visitorRegion() {
    const tags = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || 'en-US'];
    for (const tag of tags) {
      try {
        const region = new Intl.Locale(tag).maximize().region;
        if (region) return region;
      } catch (e) { /* ignore */ }
    }
    return 'US';
  }

  function defaultPaper() {
    return LETTER_REGIONS.includes(visitorRegion()) ? 'Letter' : 'A4';
  }

  // 0 = Sunday, 1 = Monday.
  function defaultWeekStart() {
    try {
      const loc = new Intl.Locale((navigator.languages && navigator.languages[0]) || navigator.language || 'en-US');
      const info = loc.getWeekInfo ? loc.getWeekInfo() : loc.weekInfo;
      if (info && info.firstDay) return info.firstDay === 7 ? 0 : 1;
    } catch (e) { /* ignore */ }
    return SUNDAY_REGIONS.includes(visitorRegion()) ? 0 : 1;
  }

  // ─────────── Text ───────────

  function lang() {
    return document.documentElement.getAttribute('lang') || 'en';
  }

  function lookup(obj, key) {
    return String(key).split('.').reduce((o, k) => (o && typeof o === 'object' ? o[k] : undefined), obj);
  }

  let pluralRules = null;
  function plural(n) {
    if (!pluralRules) {
      try { pluralRules = new Intl.PluralRules(lang()); } catch (e) { pluralRules = new Intl.PluralRules('en'); }
    }
    return pluralRules.select(n);
  }

  // t('streak.dayOne'), t('ui.left', { n: 12 }). A value that is an object of
  // plural categories ({ one, other, ... }) is picked by vars.count, or by
  // vars.n when it is a number.
  function t(key, vars) {
    const tr = lookup(window.LEFT_TOOL_I18N && window.LEFT_TOOL_I18N.print, key);
    const en = lookup(window.LEFT_PRINT_EN, key);
    let value = (typeof tr === 'string' || (tr && typeof tr === 'object')) ? tr : en;
    if (value && typeof value === 'object') {
      const count = vars && (typeof vars.count === 'number' ? vars.count : typeof vars.n === 'number' ? vars.n : null);
      const cat = count == null ? 'other' : plural(count);
      value = value[cat] ?? value.other ?? (en && typeof en === 'object' ? (en[cat] ?? en.other) : '');
    }
    if (typeof value !== 'string') value = key;
    if (!vars) return value;
    return value.replace(/\{(\w+)\}/g, (m, name) => (name in vars ? String(vars[name]) : m));
  }

  function cap(s) {
    s = String(s || '');
    return s ? s.charAt(0).toLocaleUpperCase(lang()) + s.slice(1) : s;
  }

  const fmtCache = new Map();
  function dtf(opts) {
    const k = lang() + JSON.stringify(opts);
    if (!fmtCache.has(k)) {
      let f;
      try { f = new Intl.DateTimeFormat(lang(), opts); } catch (e) { f = new Intl.DateTimeFormat('en', opts); }
      fmtCache.set(k, f);
    }
    return fmtCache.get(k);
  }

  const fmt = {
    // Month name, m = 0..11. style: 'long' | 'short' | 'narrow'. Capitalised.
    month(m, style) { return cap(dtf({ month: style || 'long' }).format(new Date(2027, m, 1))); },
    // Month and year as a title, e.g. "January 2027".
    monthYear(y, m) { return cap(dtf({ month: 'long', year: 'numeric' }).format(new Date(y, m, 1))); },
    // Weekday name, dow = 0 (Sunday) .. 6. style: 'narrow' | 'short' | 'long'.
    weekday(dow, style) { return cap(dtf({ weekday: style || 'short' }).format(new Date(2023, 0, 1 + dow))); },
    // Full date, e.g. "14 March 1992" or "March 14, 1992" by language.
    date(d, opts) { return dtf(opts || { day: 'numeric', month: 'long', year: 'numeric' }).format(d); },
    num(n) { try { return new Intl.NumberFormat(lang()).format(n); } catch (e) { return String(n); } },
  };

  // ─────────── Dates ───────────

  const util = {
    daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); },
    daysInYear(y) { return Math.round((new Date(y + 1, 0, 1) - new Date(y, 0, 1)) / 864e5); },
    dayOfYear(d) { return Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - new Date(d.getFullYear(), 0, 1)) / 864e5); },
    // 'YYYY-MM-DD' -> local Date, or null.
    parseDate(s) {
      const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || ''));
      if (!m) return null;
      const d = new Date(+m[1], +m[2] - 1, +m[3]);
      return isNaN(d) ? null : d;
    },
    isoDate(d) {
      const p = n => String(n).padStart(2, '0');
      return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
    },
    // The year people are planning for: next year from October on.
    planYear() { const n = new Date(); return n.getMonth() >= 9 ? n.getFullYear() + 1 : n.getFullYear(); },
    // The month people are planning for: next month from the 20th on.
    planMonth() {
      const n = new Date();
      const d = n.getDate() >= 20 ? new Date(n.getFullYear(), n.getMonth() + 1, 1) : new Date(n.getFullYear(), n.getMonth(), 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    },
    weekStart: defaultWeekStart,
  };

  // ─────────── Parts ───────────

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  const px = n => (Math.round(n * 100) / 100) + 'px';

  // style({ '--s': 12, width: '100%' }) -> ' style="--s:12px;width:100%"'.
  // Numbers become px, except for keys in UNITLESS.
  const UNITLESS = new Set(['flex', 'flex-grow', 'flex-shrink', 'opacity', 'z-index', 'font-weight', 'line-height', 'order']);
  // `extra` is more of the same: an object like `obj`, or a raw CSS string.
  function style(obj, extra) {
    const parts = [];
    const all = Object.assign({}, obj || {}, extra && typeof extra === 'object' ? extra : {});
    for (const [k, v] of Object.entries(all)) {
      if (v === undefined || v === null || v === false || v === '') continue;
      parts.push(k + ':' + (typeof v === 'number' && !UNITLESS.has(k) ? px(v) : v));
    }
    if (typeof extra === 'string' && extra) parts.push(extra);
    return parts.length ? ' style="' + esc(parts.join(';')) + '"' : '';
  }
  function cls(base, flags, more) {
    const out = [base];
    for (const [k, v] of Object.entries(flags || {})) if (v) out.push('is-' + k);
    if (more) out.push(more);
    return ' class="' + out.join(' ') + '"';
  }

  const P = {
    esc,
    px,
    style,

    // Big title with an optional subtitle on its baseline and an optional
    // right-hand block, then the rule. { title, sub, right, size, subSize, rule }
    head(o) {
      const right = o.right ? '<div class="lp-head__right">' + o.right + '</div>' : '';
      const sub = o.sub ? '<div class="lp-sub">' + o.sub + '</div>' : '';
      return '<header class="lp-head"' + style({ '--title': o.size, '--sub': o.subSize || Math.round(o.size * 0.3) }) + '>'
        + '<div class="lp-head__main"><div class="lp-title">' + o.title + '</div>' + sub + '</div>' + right
        + '</header>' + (o.rule === false ? '' : P.rule());
    },

    // The black rule under a header. { inline: true } runs on from a title.
    rule(o) {
      return '<div class="lp-rule' + (o && o.inline ? ' lp-rule--inline' : '') + '"' + style(o && o.style) + '></div>';
    },

    // Circle for habits, streaks, goals and checks.
    // { s, fs, label, accent, off, done, fluid, color, cls, css }
    check(o) {
      o = o || {};
      return '<span' + cls('lp-check', { accent: o.accent, off: o.off, done: o.done, fluid: o.fluid }, o.cls)
        + style({ '--s': o.s, '--fs': o.fs, '--c': o.color }, o.css) + '>' + (o.label != null ? esc(o.label) : '') + '</span>';
    },

    // Rounded square for days that pass. thin: a lighter stroke for tiny squares.
    // { s, fs, label, past, now, accent, filled, blank, fluid, thin, cls, css }
    day(o) {
      o = o || {};
      return '<span' + cls('lp-day', { past: o.past, now: o.now, accent: o.accent, filled: o.filled, blank: o.blank, fluid: o.fluid, thin: o.thin }, o.cls)
        + style({ '--s': o.s, '--fs': o.fs }, o.css) + '>' + (o.label != null ? esc(o.label) : '') + '</span>';
    },

    // Rounded write-in box with a number in the corner, or centred / at the
    // end with align: 'center' | 'end'.
    // past: time gone, as dark as a past day; lived: a lighter shade for big boxes.
    // { n, sub, fs, r, pad, align, accent, muted, shaded, past, lived, empty, cls, css, inner }
    box(o) {
      o = o || {};
      const n = o.n != null && o.n !== '' ? '<span class="lp-box__n">' + esc(o.n) + '</span>' : '';
      const sub = o.sub ? '<span class="lp-box__sub">' + esc(o.sub) + '</span>' : '';
      return '<div' + cls('lp-box', { accent: o.accent, muted: o.muted, shaded: o.shaded, past: o.past, lived: o.lived, empty: o.empty, center: o.align === 'center', end: o.align === 'end' }, o.cls)
        + style({ '--fs': o.fs, '--r': o.r, '--bp': o.pad }, o.css) + '>' + n + sub + (o.inner || '') + '</div>';
    },

    // Write-in lines. { row, faint, texts: ['...'], fs, css }
    lines(count, o) {
      o = o || {};
      let out = '';
      for (let i = 0; i < count; i++) {
        const text = o.texts && o.texts[i];
        out += '<div class="lp-line' + (o.faint ? ' is-faint' : '') + (text ? ' has-text' : '') + '">' + (text ? '<span>' + esc(text) + '</span>' : '') + '</div>';
      }
      return '<div class="lp-lines"' + style({ '--row': o.row, '--lfs': o.fs }, o.css) + '>' + out + '</div>';
    },

    // Grey label over a write-in line, or over a typed value.
    // { value, lab, lineH, w, css }
    field(label, o) {
      o = o || {};
      const body = o.value
        ? '<div class="lp-field__value"' + style({ height: o.lineH, display: 'flex', 'align-items': 'flex-end' }) + '>' + esc(o.value) + '</div>'
        : '<div class="lp-line"></div>';
      return '<div class="lp-field"' + style({ '--lab': o.lab, '--line-h': o.lineH, width: o.w }, o.css) + '>'
        + '<span class="lp-field__label">' + esc(label) + '</span>' + body + '</div>';
    },

    // Bold section title over any body. { fs, gap, css, cls }
    section(title, body, o) {
      o = o || {};
      return '<section class="lp-section' + (o.cls ? ' ' + o.cls : '') + '"' + style({ '--fs': o.fs, gap: o.gap }, o.css) + '>'
        + '<div class="lp-section__title">' + esc(title) + '</div>' + (body || '') + '</section>';
    },

    // Rounded bar: grey, in ink when on, or in a colour. Full width by default
    // (the year strip), or w wide (the colour mark beside a habit). { h, w, on, color, css }
    bar(o) {
      o = o || {};
      return '<div' + cls('lp-bar', { on: o.on, fixed: o.w != null }, o.cls) + style({ '--h': o.h, '--c': o.color, width: o.w }, o.css) + '></div>';
    },

    // Thin grey track with an ink segment from `from` to `to` (0..1 of the width):
    // where a month sits in the year. { h, from, to, css }
    track(o) {
      o = o || {};
      const from = Math.max(0, Math.min(1, o.from || 0));
      const to = Math.max(from, Math.min(1, o.to == null ? 1 : o.to));
      return '<div class="lp-track"' + style({ '--h': o.h }, o.css) + '><span' + style({ left: (from * 100).toFixed(2) + '%', width: ((to - from) * 100).toFixed(2) + '%' }) + '></span></div>';
    },

    // Small grey label; ink, accent, or regular weight for numbers in a grid.
    // { fs, ink, accent, regular, css, cls }
    label(text, o) {
      o = o || {};
      return '<span' + cls('lp-label', { ink: o.ink, accent: o.accent, regular: o.regular }, o.cls) + style({ '--fs': o.fs }, o.css) + '>' + esc(text) + '</span>';
    },
  };

  // ─────────── Registry ───────────

  const defs = new Map();

  function define(def) {
    if (!def || !def.id || typeof def.render !== 'function') throw new Error('LeftPrint.define: id and render() are required');
    def.fields = def.fields || [];
    defs.set(def.id, def);
    if (document.readyState !== 'loading') boot();
  }

  // The fields every printable has: paper first, colour last.
  function allFields(def) {
    const paper = {
      key: 'paper', type: 'segment', label: 'ui.paper',
      options: PAPER_ORDER.map(v => ({ v, label: 'ui.paper' + v })),
      def: defaultPaper,
    };
    // def.accent: false drops the colour control; a function hides it when it returns false.
    const colour = { key: 'c', type: 'colour', label: 'ui.colour', def: ACCENTS[0], when: typeof def.accent === 'function' ? def.accent : undefined };
    return [paper, ...def.fields, ...(def.accent === false ? [] : [colour])];
  }

  function fieldDefault(f) {
    const v = typeof f.def === 'function' ? f.def({ t, fmt, util }) : f.def;
    if (f.type === 'list') return (v || []).map(item => Object.assign({}, item));
    if (v !== undefined) return v;
    if (f.type === 'year') return util.planYear();
    if (f.type === 'month') return util.planMonth().m;
    if (f.type === 'number') return f.min || 0;
    if (f.type === 'segment' || f.type === 'select') return f.options[0].v;
    return '';
  }

  function defaults(def) {
    const s = {};
    for (const f of allFields(def)) s[f.key] = fieldDefault(f);
    return s;
  }

  // ─────────── State in the URL hash ───────────

  const clean = v => String(v == null ? '' : v).replace(/[|~]/g, ' ').slice(0, 120);

  function encode(def, state) {
    const q = new URLSearchParams();
    for (const f of allFields(def)) {
      const v = state[f.key];
      if (f.type === 'list') {
        q.set(f.key, (v || []).map(item => f.item.map(sf => clean(item[sf.key])).join('~')).join('|'));
      } else if (f.type === 'colour') {
        q.set(f.key, String(v).replace('#', ''));
      } else {
        q.set(f.key, clean(v));
      }
    }
    return q.toString();
  }

  function coerce(f, raw) {
    if (raw == null) return undefined;
    switch (f.type) {
      case 'number': {
        const n = Number(raw);
        if (!isFinite(n)) return undefined;
        return Math.min(f.max ?? Infinity, Math.max(f.min ?? -Infinity, n));
      }
      case 'year': {
        const n = parseInt(raw, 10);
        return n >= 1900 && n <= 2200 ? n : undefined;
      }
      case 'month': {
        const n = parseInt(raw, 10);
        return n >= 0 && n <= 11 ? n : undefined;
      }
      case 'segment':
      case 'select':
        return f.options.some(o => String(o.v) === raw) ? f.options.find(o => String(o.v) === raw).v : undefined;
      case 'colour':
        return /^[0-9a-fA-F]{6}$/.test(raw) ? '#' + raw.toUpperCase() : undefined;
      case 'date':
        return raw === '' || util.parseDate(raw) ? raw : undefined;
      case 'list': {
        if (raw === '') return [];
        return raw.split('|').slice(0, f.max || 20).map(row => {
          const cells = row.split('~');
          const item = {};
          f.item.forEach((sf, i) => { item[sf.key] = coerce(sf, cells[i] ?? '') ?? fieldDefault(sf); });
          return item;
        });
      }
      default:
        return String(raw).slice(0, f.max || 120);
    }
  }

  function readHash(def) {
    return stateFrom(def, location.hash.replace(/^#/, ''));
  }

  // Defaults, overridden by a link's settings ('paper=A4&n=66&...').
  function stateFrom(def, hash) {
    const s = defaults(def);
    if (!hash) return s;
    let q;
    try { q = new URLSearchParams(hash); } catch (e) { return s; }
    for (const f of allFields(def)) {
      if (!q.has(f.key)) continue;
      const v = coerce(f, q.get(f.key));
      if (v !== undefined) s[f.key] = v;
    }
    return s;
  }

  // ─────────── Rendering ───────────

  function context(def, state) {
    const paper = PAPERS[state.paper] ? state.paper : 'A4';
    const P0 = PAPERS[paper];
    const orientation = typeof def.orientation === 'function' ? def.orientation(state) : (def.orientation || 'portrait');
    const landscape = orientation === 'landscape';
    const w = landscape ? P0.h : P0.w;
    const h = landscape ? P0.w : P0.h;
    const T = TIERS[P0.tier];
    return {
      paper, tier: P0.tier, orientation, landscape,
      w, h, px: T.px, py: T.py, cw: w - 2 * T.px, ch: h - 2 * T.py,
      rule: T.rule, ruleGap: T.ruleGap, lw: T.lw,
      accent: state.c || ACCENTS[0],
      pick: byTier => (byTier[paper] !== undefined ? byTier[paper] : byTier[P0.tier]),
      page: landscape ? [P0.size[1], P0.size[0]] : P0.size,
      today: new Date(),
      lang: lang(), t, fmt, util, P,
    };
  }

  function sheetHtml(def, state) {
    const ctx = context(def, state);
    const inner = def.render(state, ctx);
    const html = '<div class="lp-sheet" data-tier="' + ctx.tier + '" data-printable="' + esc(def.id) + '"'
      + style({ '--w': ctx.w, '--h': ctx.h, '--px': ctx.px, '--py': ctx.py, '--rule': ctx.rule, '--rule-gap': ctx.ruleGap, '--lw': ctx.lw, '--accent': ctx.accent })
      + '>' + inner + '</div>';
    return { html, ctx };
  }

  // Scale a rendered sheet into a frame no wider than maxW and no taller than maxH.
  function fit(frame, ctx, maxW, maxH) {
    const scale = Math.min(maxW / ctx.w, maxH / ctx.h);
    frame.style.width = Math.floor(ctx.w * scale) + 'px';
    frame.style.height = Math.floor(ctx.h * scale) + 'px';
    const sheet = frame.firstElementChild;
    if (sheet) sheet.style.transform = 'scale(' + scale + ')';
  }

  // ─────────── Controls ───────────

  function el(tag, attrs, children) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === undefined || v === null || v === false) continue;
      if (k === 'text') n.textContent = v;
      else if (k === 'class') n.className = v;
      else n.setAttribute(k, v === true ? '' : v);
    }
    for (const c of children || []) if (c) n.appendChild(c);
    return n;
  }

  let uid = 0;
  function inputFor(f, value, onChange, opts) {
    const id = 'lp-f' + (++uid);
    const placeholder = f.placeholder ? t(f.placeholder) : undefined;
    let input;
    switch (f.type) {
      case 'segment': {
        input = el('div', { class: 'tool-toggle', role: 'group', 'aria-label': f.label ? t(f.label) : undefined });
        for (const o of f.options) {
          const b = el('button', { type: 'button', text: o.label ? t(o.label) : String(o.text ?? o.v) });
          b.dataset.v = String(o.v);
          if (String(o.v) === String(value)) b.classList.add('is-active');
          b.addEventListener('click', () => {
            input.querySelectorAll('button').forEach(x => x.classList.toggle('is-active', x === b));
            onChange(o.v);
          });
          input.appendChild(b);
        }
        return { node: input, id: null };
      }
      case 'select':
      case 'year':
      case 'month': {
        input = el('select', { id });
        let options = f.options;
        if (f.type === 'year') {
          const now = new Date().getFullYear();
          options = [];
          for (let y = now - 1; y <= now + 4; y++) options.push({ v: y, text: String(y) });
        }
        if (f.type === 'month') options = Array.from({ length: 12 }, (_, m) => ({ v: m, text: fmt.month(m) }));
        for (const o of options) {
          const opt = el('option', { value: String(o.v), text: o.label ? t(o.label) : String(o.text ?? o.v) });
          if (String(o.v) === String(value)) opt.selected = true;
          input.appendChild(opt);
        }
        input.addEventListener('change', () => {
          const o = options.find(x => String(x.v) === input.value);
          onChange(o ? o.v : input.value);
        });
        break;
      }
      case 'number':
        input = el('input', { id, type: 'number', inputmode: 'numeric', min: f.min, max: f.max, step: f.step || 1, value: String(value) });
        input.addEventListener('input', () => {
          const n = Number(input.value);
          if (input.value !== '' && isFinite(n)) onChange(Math.min(f.max ?? Infinity, Math.max(f.min ?? -Infinity, n)));
        });
        break;
      case 'date':
        input = el('input', { id, type: 'date', value: value || '' });
        input.addEventListener('input', () => onChange(input.value));
        break;
      case 'colour': {
        input = el('div', { class: 'lp-swatches', role: 'group', 'aria-label': t('ui.colour') });
        for (const c of ACCENTS) {
          const b = el('button', { type: 'button', class: 'lp-swatch' + (c.toUpperCase() === String(value).toUpperCase() ? ' is-active' : ''), 'aria-label': c });
          b.style.setProperty('--c', c);
          b.addEventListener('click', () => {
            input.querySelectorAll('.lp-swatch').forEach(x => x.classList.toggle('is-active', x === b));
            onChange(c);
          });
          input.appendChild(b);
        }
        return { node: input, id: null };
      }
      default:
        input = el('input', { id, type: 'text', value: value || '', maxlength: f.max || 60, placeholder, autocomplete: 'off', spellcheck: 'false' });
        input.addEventListener('input', () => onChange(input.value));
    }
    if (opts && opts.ariaLabel) input.setAttribute('aria-label', opts.ariaLabel);
    if (opts && opts.narrow) input.classList.add('lp-list__narrow');
    return { node: input, id };
  }

  function listControl(f, state, commit) {
    const wrap = el('div', { class: 'lp-list' });
    const draw = () => {
      wrap.innerHTML = '';
      const items = state[f.key];
      // Rows with three or more inputs: the first gets its own line, the rest sit under it.
      const stacked = f.item.length > 2;
      items.forEach((item, i) => {
        const row = el('div', { class: 'lp-list__item' + (stacked ? ' is-stacked' : '') });
        if (stacked) row.style.setProperty('--rest', String(f.item.length - 1));
        for (const sf of f.item) {
          const { node } = inputFor(sf, item[sf.key], v => { item[sf.key] = v; commit(); }, {
            ariaLabel: sf.label ? t(sf.label) : (sf.placeholder ? t(sf.placeholder) : undefined),
            narrow: sf.narrow,
          });
          row.appendChild(node);
        }
        const rm = el('button', { type: 'button', class: 'lp-list__remove', 'aria-label': t('ui.remove'), text: '×' });
        rm.addEventListener('click', () => { items.splice(i, 1); draw(); commit(); });
        row.appendChild(rm);
        wrap.appendChild(row);
      });
      if (items.length < (f.max || 10)) {
        const add = el('button', { type: 'button', class: 'lp-list__add', text: t(f.add || 'ui.add') });
        add.addEventListener('click', () => {
          const blank = {};
          for (const sf of f.item) blank[sf.key] = fieldDefault(sf);
          items.push(blank);
          draw();
          commit();
          const inputs = wrap.querySelectorAll('.lp-list__item:last-of-type input');
          if (inputs[0]) inputs[0].focus();
        });
        wrap.appendChild(add);
      }
    };
    draw();
    return wrap;
  }

  // A field with apply(value, state, helpers) may rewrite other fields when it
  // changes (a "Start from" select filling in the title and the list); the
  // controls are then rebuilt so they show the new values.
  function controls(def, state, commit, rebuild) {
    const root = el('div', { class: 'lp-controls' });
    const blocks = [];
    let pending = null; // a half-width control waiting for its pair
    for (const f of allFields(def)) {
      const block = el('div', { class: 'lp-control' });
      let labelFor = null;
      let node;
      if (f.type === 'list') node = listControl(f, state, commit);
      else {
        const r = inputFor(f, state[f.key], v => {
          state[f.key] = v;
          if (typeof f.apply === 'function') { f.apply(v, state, { t, fmt, util }); rebuild(); }
          commit();
        });
        node = r.node;
        labelFor = r.id;
      }
      if (f.label) block.appendChild(el(labelFor ? 'label' : 'span', { class: 'lp-control__label', for: labelFor || undefined, text: t(f.label) }));
      block.appendChild(node);
      blocks.push({ f, block });
      if (f.half) {
        if (pending) { pending.appendChild(block); pending = null; }
        else { pending = el('div', { class: 'lp-row' }, [block]); root.appendChild(pending); }
      } else {
        pending = null;
        root.appendChild(block);
      }
    }
    const btn = el('button', { type: 'button', class: 'lp-print-btn', text: t('ui.print') });
    root.appendChild(btn);
    const sync = () => blocks.forEach(({ f, block }) => { block.hidden = typeof f.when === 'function' ? !f.when(state) : false; });
    sync();
    return { root, btn, sync };
  }

  // ─────────── Printing ───────────

  let printHolder = null;
  let pageStyle = null;
  function preparePrint(sheet) {
    if (!printHolder) {
      printHolder = el('div', { class: 'lp-print', 'aria-hidden': 'true' });
      document.body.appendChild(printHolder);
      pageStyle = el('style', { id: 'lp-page-size' });
      document.head.appendChild(pageStyle);
    }
    const [pw, ph] = sheet.ctx.page;
    printHolder.innerHTML = '<div class="lp-print__page" style="width:' + pw + ';height:' + ph + '">' + sheet.html + '</div>';
    pageStyle.textContent = '@page { size: ' + pw + ' ' + ph + '; margin: 0; }';
  }

  // ─────────── Mount ───────────

  function mountTool(host) {
    const def = defs.get(host.dataset.lpTool);
    if (!def || host.dataset.lpMounted) return;
    host.dataset.lpMounted = '1';
    const state = readHash(def);
    const stage = el('div', { class: 'lp-stage' });
    const frame = el('div', { class: 'lp-frame', role: 'img', 'aria-label': t('ui.preview') });
    stage.appendChild(frame);
    let current = null;
    let queued = false;

    const draw = () => {
      queued = false;
      current = sheetHtml(def, state);
      frame.innerHTML = current.html;
      layout();
      preparePrint(current);
    };
    const layout = () => {
      if (!current) return;
      const maxW = stage.clientWidth || host.clientWidth || 600;
      const wide = window.matchMedia('(min-width: 861px)').matches;
      const maxH = wide ? Math.max(360, window.innerHeight - 140) : maxW * 1.5;
      fit(frame, current.ctx, maxW, maxH);
    };
    const commit = () => {
      ui.sync();
      try { history.replaceState(null, '', '#' + encode(def, state)); } catch (e) { /* ignore */ }
      if (!queued) { queued = true; requestAnimationFrame(draw); }
    };

    const onPrint = () => {
      preparePrint(current);
      if (typeof window.toolTrack === 'function') window.toolTrack('print_click', { printable: def.id, paper: state.paper });
      window.print();
    };
    let ui = null;
    const buildUI = () => {
      const next = controls(def, state, commit, buildUI);
      next.btn.addEventListener('click', onPrint);
      if (ui && ui.root.parentNode === host) host.replaceChild(next.root, ui.root);
      ui = next;
    };
    buildUI();
    window.addEventListener('beforeprint', () => current && preparePrint(current));
    // A pasted link that changes only the hash: start again from its settings.
    window.addEventListener('hashchange', () => {
      if (location.hash.replace(/^#/, '') === encode(def, state)) return;
      delete host.dataset.lpMounted;
      mountTool(host);
    }, { once: true });

    host.innerHTML = '';
    host.appendChild(stage);
    host.appendChild(ui.root);
    draw();
    if (window.ResizeObserver) new ResizeObserver(layout).observe(stage);
    else window.addEventListener('resize', layout);
  }

  function mountThumb(host) {
    const def = defs.get(host.dataset.lpThumb);
    if (!def || host.dataset.lpMounted) return;
    host.dataset.lpMounted = '1';
    const state = Object.assign(defaults(def), def.thumb || {});
    const sheet = sheetHtml(def, state);
    const frame = el('div', { class: 'lp-frame', 'aria-hidden': 'true' });
    frame.innerHTML = sheet.html;
    host.appendChild(frame);
    const layout = () => fit(frame, sheet.ctx, host.clientWidth || 220, host.clientHeight || 200);
    layout();
    if (window.ResizeObserver) new ResizeObserver(layout).observe(host);
  }

  function boot() {
    document.querySelectorAll('[data-lp-tool]').forEach(mountTool);
    document.querySelectorAll('[data-lp-thumb]').forEach(mountThumb);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);

  window.LeftPrint = {
    PAPERS, TIERS, ACCENTS,
    define, defaults, P, t, fmt, util,
    // For tests: render a printable to an HTML string, from overrides
    // ({ paper: 'A3', n: 66 }) or from link settings ('paper=A3&n=66').
    render(id, overrides) {
      const def = defs.get(id);
      if (!def) throw new Error('Unknown printable ' + id);
      const state = typeof overrides === 'string' ? stateFrom(def, overrides) : Object.assign(defaults(def), overrides || {});
      return sheetHtml(def, state);
    },
    list: () => [...defs.keys()],
  };
})();
