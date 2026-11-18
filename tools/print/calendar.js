/*
  Year calendar: twelve months on one page, in four styles (dates, days left,
  dots, squares), with marked dates and, on A4 and A3, lists for goals and
  dates to remember. Built only from the shared parts in core.js.
*/
(function () {
  const { fmt } = LeftPrint;

  // Rough text width, for truncating typed text so it never runs past its column.
  function fitText(text, maxW, fs) {
    text = String(text || '').trim();
    let w = 0;
    let out = '';
    for (const ch of text) {
      w += (/[ᄀ-ᇿ⺀-꓏가-힯豈-﫿＀-￯]/.test(ch) ? 1 : 0.58) * fs;
      if (w > maxW) return out.replace(/\s+$/, '') + '…';
      out += ch;
    }
    return out;
  }

  LeftPrint.define({
    id: 'calendar',
    orientation: 'portrait',
    fields: [
      { key: 'year', type: 'year', label: 'ui.year', half: true },
      {
        key: 'ws', type: 'segment', label: 'ui.weekStart', half: true,
        options: [{ v: 1, text: fmt.weekday(1, 'long') }, { v: 0, text: fmt.weekday(0, 'long') }],
        def: ({ util }) => util.weekStart(),
      },
      {
        key: 'style', type: 'segment', label: 'calendar.style', def: 'dates',
        options: [
          { v: 'dates', label: 'calendar.styleDates' },
          { v: 'left', label: 'calendar.styleLeft' },
          { v: 'dots', label: 'calendar.styleDots' },
          { v: 'squares', label: 'calendar.styleSquares' },
        ],
      },
      // Dots default to rings and squares to filled, as in the design.
      {
        key: 'dotfill', type: 'segment', label: 'calendar.fill', def: 'outline', when: s => s.style === 'dots',
        options: [{ v: 'outline', label: 'calendar.outline' }, { v: 'filled', label: 'calendar.filled' }],
      },
      {
        key: 'sqfill', type: 'segment', label: 'calendar.fill', def: 'filled', when: s => s.style === 'squares',
        options: [{ v: 'filled', label: 'calendar.filled' }, { v: 'outline', label: 'calendar.outline' }],
      },
      {
        key: 'marks', type: 'list', label: 'calendar.marks', add: 'calendar.addMark', max: 12, def: [],
        item: [
          { key: 'date', type: 'date', label: 'calendar.markDate', narrow: true, def: '' },
          { key: 'label', type: 'text', label: 'calendar.markLabel', placeholder: 'calendar.markPlaceholder', max: 28, def: '' },
        ],
      },
      {
        key: 'goals', type: 'list', label: 'calendar.goals', add: 'calendar.addGoal', max: 7, def: [],
        when: s => s.paper !== 'A5',
        item: [{ key: 'text', type: 'text', label: 'calendar.goal', placeholder: 'calendar.goalPlaceholder', max: 48, def: '' }],
      },
    ],
    thumb: {},

    render(s, ctx) {
      const { P, t, fmt, util } = ctx;
      const S = ctx.pick({
        A5: { year: 60, cols: 3, colGap: 18, gridT: 18, gridB: 0, name: 12, leftF: 0, trackH: 2, trackT: 5, trackB: 4, head: 8, headH: 13, cellH: 16, num: 9.5, numLeft: 7.5, dot: 7, sq: 8, ring: 10, box: false, lists: null },
        A4: { year: 88, cols: 3, colGap: 40, gridT: 28, gridB: 22, name: 16, leftF: 11, trackH: 3, trackT: 7, trackB: 6, head: 10, headH: 20, cellH: 20, num: 12.5, numLeft: 9.5, dot: 10, sq: 11, ring: 14, box: false, lists: { n: 5, rowH: 27, title: 15, num: 12, gap: 34, keys: ['goals', 'remember'] } },
        A3: { year: 120, cols: 4, colGap: 36, gridT: 40, gridB: 36, name: 22, leftF: 13, trackH: 4, trackT: 9, trackB: 9, head: 12, headH: 22, cellH: 36, num: 12, numLeft: 11, dot: 14, sq: 15, ring: 20, box: true, lists: { n: 7, rowH: 34, title: 19, num: 15, gap: 44, keys: ['goals', 'remember', 'notes'] } },
      });
      const y = Number(s.year) || util.planYear();
      const sunday = Number(s.ws) === 0;
      const mode = s.style || 'dates';
      const outline = mode === 'dots' ? s.dotfill !== 'filled' : s.sqfill === 'outline';
      const boxed = S.box && (mode === 'dates' || mode === 'left');
      const total = util.daysInYear(y);

      // Marked dates land on the same day in the calendar's year (birthdays, holidays).
      const marks = [];
      const marked = new Set();
      for (const m of s.marks || []) {
        const d = util.parseDate(m.date);
        if (!d) continue;
        const day = new Date(y, d.getMonth(), d.getDate());
        if (day.getMonth() !== d.getMonth()) continue; // 29 February in a common year
        marked.add(d.getMonth() * 100 + d.getDate());
        marks.push({ day, label: String(m.label || '').trim() });
      }
      marks.sort((a, b) => a.day - b.day);

      // Lists under the calendar (A4, A3).
      const L = S.lists;
      const listsH = L ? L.title * 1.1 + L.n * L.rowH : 0;

      // Cell height: as tall as the design allows, smaller when the page is shorter (Letter).
      const offOf = m => { const dow = new Date(y, m, 1).getDay(); return sunday ? dow : (dow + 6) % 7; };
      const weeksOf = m => Math.ceil((offOf(m) + util.daysInMonth(y, m)) / 7);
      const monthRows = 12 / S.cols;
      let sumWeeks = 0;
      for (let r = 0; r < monthRows; r++) {
        let w = 0;
        for (let c = 0; c < S.cols; c++) w = Math.max(w, weeksOf(r * S.cols + c));
        sumWeeks += w;
      }
      const headTotal = S.year * 0.9 + ctx.ruleGap + ctx.rule;
      const fixedMonth = S.name + S.trackT + S.trackH + S.trackB + S.headH;
      const minGap = S.name;
      const avail = ctx.ch - headTotal - S.gridT - S.gridB - listsH;
      const cellH = Math.min(S.cellH, Math.floor((avail - monthRows * fixedMonth - (monthRows - 1) * minGap) / sumWeeks) - 1);
      const colW = (ctx.cw - (S.cols - 1) * S.colGap) / S.cols;
      const cellW = colW / 7;
      const ring = Math.floor(Math.min(cellH - 1, cellW - 2));
      // Three-digit counts get a slightly wider ring that may touch the next row.
      const ringWide = Math.floor(Math.min(cellH + 1, cellW - 3));
      const dot = Math.min(S.dot, cellH - 4);
      const sq = Math.min(S.sq, cellH - 4);
      const ringO = Math.min(S.ring, cellH - 3);

      const wdays = sunday ? [0, 1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5, 6, 0];
      const cell = (h, inner, extra) => '<div style="height:' + P.px(h) + ';display:flex;align-items:center;justify-content:center' + (extra || '') + '">' + inner + '</div>';

      let months = '';
      for (let m = 0; m < 12; m++) {
        const dim = util.daysInMonth(y, m);
        const startDoy = util.dayOfYear(new Date(y, m, 1));
        const off = offOf(m);
        let cells = wdays.map(d => cell(S.headH, P.label(fmt.weekday(d, 'narrow'), { fs: S.head }))).join('');
        const rows = weeksOf(m);
        for (let i = 0; i < rows * 7; i++) {
          const d = i - off + 1;
          if (d < 1 || d > dim) { cells += '<div style="height:' + P.px(cellH) + '"></div>'; continue; }
          const dow = new Date(y, m, d).getDay();
          const we = dow === 0 || dow === 6;
          const mark = marked.has(m * 100 + d);
          const text = mode === 'left' ? String(total - (startDoy + d - 1)) : String(d);
          if (boxed) {
            cells += '<div style="height:' + P.px(cellH) + ';padding:2px;display:flex">'
              + P.box({ n: text, fs: mode === 'left' ? S.numLeft : S.num, r: 6, pad: 4, muted: we && !mark, accent: mark, css: 'flex:1' }) + '</div>';
            continue;
          }
          let inner;
          if (mode === 'dots') {
            inner = mark ? P.check({ s: ringO, accent: true })
              : outline ? P.check({ s: ringO }) : P.check({ s: dot, done: true, color: 'var(--ink)' });
          } else if (mode === 'squares') {
            inner = mark ? P.day({ s: ringO, accent: true })
              : outline ? P.day({ s: ringO }) : P.day({ s: sq, filled: true });
          } else {
            const fs = mode === 'left' ? S.numLeft : S.num;
            const rs = text.length > 2 ? ringWide : ring;
            inner = mark ? P.check({ s: rs, accent: true, label: text, fs: Math.min(fs, rs * (text.length > 2 ? 0.4 : 0.55)) })
              : P.label(text, { fs, ink: !we, regular: true });
          }
          cells += cell(cellH, inner);
        }
        const left = S.leftF && mode !== 'left' ? P.label(t('calendar.left', { n: total - startDoy }), { fs: S.leftF }) : '';
        const track = P.track({ h: S.trackH, from: startDoy / total, to: (startDoy + dim) / total, css: { margin: P.px(S.trackT) + ' 0 ' + P.px(S.trackB) } });
        months += '<section style="display:flex;flex-direction:column;min-width:0">'
          + '<div style="display:flex;align-items:baseline;gap:8px;height:' + P.px(S.name) + '">'
          + P.label(fmt.month(m), { fs: S.name, accent: true, css: 'flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis' }) + left + '</div>'
          + track
          + '<div style="display:grid;grid-template-columns:repeat(7,minmax(0,1fr))">' + cells + '</div>'
          + '</section>';
      }

      const grid = '<div class="lp-grow" style="display:grid;grid-template-columns:repeat(' + S.cols + ',minmax(0,1fr));column-gap:' + P.px(S.colGap) + ';align-content:space-between;margin:' + P.px(S.gridT) + ' 0 ' + P.px(S.gridB) + '">' + months + '</div>';

      let lists = '';
      if (L) {
        const listW = (ctx.cw - (L.keys.length - 1) * L.gap) / L.keys.length;
        const fs = Math.round(L.title * 0.82);
        const numW = Math.round(L.num * 0.9);
        const goals = (s.goals || []).map(g => String(g.text || '').trim()).filter(Boolean);
        const remember = marks.map(x => fmt.date(x.day, { day: 'numeric', month: 'short' }) + (x.label ? ' ' + x.label : ''));
        lists = '<div style="flex:none;display:grid;grid-template-columns:repeat(' + L.keys.length + ',minmax(0,1fr));column-gap:' + P.px(L.gap) + '">'
          + L.keys.map(k => {
            let body;
            if (k === 'goals') {
              const w = listW - numW - 10;
              body = Array.from({ length: L.n }, (_, i) => '<div style="display:flex;align-items:flex-end;gap:10px">'
                + P.label(String(i + 1), { fs: L.num, accent: true, css: 'width:' + numW + 'px;padding-bottom:' + Math.round(L.num * 0.25) + 'px' })
                + P.lines(1, { row: L.rowH, faint: true, fs, texts: [fitText(goals[i], w, fs)], css: 'flex:1;min-width:0' }) + '</div>').join('');
            } else {
              const texts = k === 'remember' ? remember.slice(0, L.n).map(x => fitText(x, listW, fs)) : [];
              body = P.lines(L.n, { row: L.rowH, faint: true, fs, texts });
            }
            const title = k === 'goals' ? t('calendar.goalsFor', { year: y }) : k === 'remember' ? t('calendar.remember') : t('sheet.notes');
            return P.section(fitText(title, listW, L.title), body, { fs: L.title });
          }).join('')
          + '</div>';
      }

      return P.head({ title: String(y), size: S.year }) + grid + lists;
    },
  });
})();
