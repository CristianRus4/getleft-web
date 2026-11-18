/*
  Monthly planner: a month of rounded write-in day boxes, the year strip, a side
  column with Focus and Notes lines, and habit rows under the month.
  Built only from the shared parts in core.js (label, rule, box, lines, section, check).
*/
(function () {
  const { fmt, util } = LeftPrint;

  // Shorten typed text so it fits a width, with an ellipsis.
  let canvas = null;
  function fitText(text, fs, width, weight) {
    text = String(text || '').trim();
    if (!text || width <= 0) return '';
    let measure;
    try {
      canvas = canvas || document.createElement('canvas');
      const c = canvas.getContext('2d');
      c.font = (weight || 500) + ' ' + fs + 'px "SF Pro Rounded", ui-rounded, -apple-system, BlinkMacSystemFont, system-ui, sans-serif';
      measure = s => c.measureText(s).width;
    } catch (e) {
      measure = s => s.length * fs * 0.62;
    }
    if (measure(text) <= width) return text;
    const chars = Array.from(text);
    let lo = 0, hi = chars.length;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if (measure(chars.slice(0, mid).join('').trimEnd() + '…') <= width) lo = mid; else hi = mid - 1;
    }
    return lo ? chars.slice(0, lo).join('').trimEnd() + '…' : '';
  }

  LeftPrint.define({
    id: 'month',
    orientation: 'landscape',
    fields: [
      { key: 'month', type: 'month', label: 'ui.month', half: true, def: () => util.planMonth().m },
      { key: 'year', type: 'year', label: 'ui.year', half: true, def: () => util.planMonth().y },
      {
        key: 'week', type: 'segment', label: 'ui.weekStart', def: () => util.weekStart(),
        options: [{ v: 1, text: fmt.weekday(1, 'long') }, { v: 0, text: fmt.weekday(0, 'long') }],
      },
      {
        key: 'focus', type: 'list', label: 'month.focus', max: 5, add: 'month.addFocus', def: [],
        item: [{ key: 'text', type: 'text', placeholder: 'month.focusPlaceholder', label: 'month.focus', max: 40, def: '' }],
      },
      {
        key: 'habits', type: 'list', label: 'month.habits', max: 6, add: 'month.addHabit', def: [],
        when: s => s.paper !== 'A5',
        item: [{ key: 'name', type: 'text', placeholder: 'month.habitPlaceholder', label: 'sheet.habit', max: 32, def: '' }],
      },
      {
        key: 'marks', type: 'list', label: 'month.marks', max: 10, add: 'month.addMark', def: [],
        item: [
          { key: 'date', type: 'date', label: 'month.markDate', def: '', narrow: true },
          { key: 'label', type: 'text', placeholder: 'month.markPlaceholder', label: 'month.markLabel', max: 24, def: '' },
        ],
      },
    ],
    thumb: {},

    render(s, ctx) {
      const { P, t } = ctx;
      const S = ctx.pick({
        A5: { top: 11, name: 48, strip: null, gap: 24, calM: 16, wdF: 9, wdPad: 5, dayF: 13, pad: 6, r: 5, cellGap: 4, side: 180, title: 12, rowH: 26, num: 10, lfs: 10, focusN: 3, notesN: 4, notesM: 16, markF: 7.5, habits: null },
        A4: { top: 14, name: 68, strip: { m: 22, h: 5, lab: 9 }, gap: 32, calM: 22, wdF: 11, wdPad: 7, dayF: 17, pad: 8, r: 7, cellGap: 6, side: 236, title: 15, rowH: 30, num: 12, lfs: 12, focusN: 5, notesN: 4, notesM: 22, markF: 9, habits: { n: 5, m: 20, name: 150, head: 9, ring: 14, gap: 7, done: [30, 17], doneCol: 44, fs: 11 } },
        A3: { top: 19, name: 96, strip: { m: 30, h: 7, lab: 12 }, gap: 44, calM: 30, wdF: 15, wdPad: 10, dayF: 23, pad: 11, r: 10, cellGap: 8, side: 330, title: 20, rowH: 36, num: 16, lfs: 16, focusN: 5, notesN: 7, notesM: 28, markF: 12, habits: { n: 6, m: 28, name: 210, head: 12, ring: 20, gap: 10, done: [42, 24], doneCol: 62, fs: 15 } },
      });
      const now = util.planMonth();
      const y = Number(s.year) || now.y;
      const m = s.month >= 0 && s.month <= 11 ? Number(s.month) : now.m;
      const ws = Number(s.week) === 0 ? 0 : 1;
      const dim = util.daysInMonth(y, m);
      const off = (new Date(y, m, 1).getDay() - ws + 7) % 7;
      const rows = Math.ceil((off + dim) / 7);
      const weekend = dow => dow === 0 || dow === 6;

      // Header: "01 2027" over the month name, then the rule.
      const head = '<header class="lp-head" style="--title:' + S.name + 'px">'
        + '<div style="display:flex;flex-direction:column;gap:4px;min-width:0">'
        + '<div style="display:flex;gap:' + Math.round(S.top * 0.55) + 'px">'
        + P.label(String(m + 1).padStart(2, '0'), { fs: S.top, accent: true }) + P.label(String(y), { fs: S.top }) + '</div>'
        + '<div class="lp-title">' + P.esc(fmt.month(m, 'long')) + '</div>'
        + '</div></header>' + P.rule();

      // Year strip: one bar per month, as wide as its days, this month in ink.
      const T = S.strip;
      const strip = T ? '<div style="flex:none;display:flex;gap:' + Math.round(T.h * 0.8) + 'px;margin-top:' + T.m + 'px">'
        + Array.from({ length: 12 }, (_, i) => '<div style="flex:' + util.daysInMonth(y, i) + ' 1 0;min-width:0;display:flex;flex-direction:column;align-items:center;gap:' + T.h + 'px">'
          + P.bar({ h: T.h, on: i === m })
          + P.label(fmt.month(i, 'narrow'), { fs: T.lab, ink: i === m }) + '</div>').join('')
        + '</div>' : '';

      // Marked dates in this month, by day.
      const marks = {};
      for (const mk of s.marks || []) {
        const d = util.parseDate(mk.date);
        if (!d || d.getFullYear() !== y || d.getMonth() !== m) continue;
        const k = d.getDate();
        marks[k] = marks[k] || [];
        const label = String(mk.label || '').trim();
        if (label) marks[k].push(label);
      }

      // The month: weekday names, a rule, then one rounded box per day.
      const calW = ctx.cw - S.side - S.gap;
      const cellW = (calW - 6 * S.cellGap) / 7;
      const markW = cellW - 2 * S.pad - 2;
      let cal = '';
      for (let i = 0; i < 7; i++) {
        const dow = (ws + i) % 7;
        cal += '<div style="padding:0 0 ' + S.wdPad + 'px ' + S.pad + 'px;min-width:0;overflow:hidden">'
          + P.label(fitText(fmt.weekday(dow, 'short'), S.wdF, cellW - S.pad, 600), { fs: S.wdF, ink: !weekend(dow) }) + '</div>';
      }
      cal += '<div style="grid-column:1/-1;margin-bottom:' + S.cellGap + 'px">' + P.rule({ style: { 'margin-top': 0 } }) + '</div>';
      for (let k = 0; k < rows * 7; k++) {
        const d = k - off + 1;
        const dow = (ws + k) % 7;
        if (d < 1 || d > dim) { cal += P.box({ empty: true }); continue; }
        const mk = marks[d];
        const inner = mk && mk.length
          ? '<div style="margin-top:auto;min-width:0;overflow:hidden;white-space:nowrap;line-height:1.15">'
            + P.label(fitText(mk.join(', '), S.markF, markW, 600), { fs: S.markF, ink: true }) + '</div>'
          : '';
        cal += P.box({ n: d, fs: S.dayF, pad: S.pad, r: S.r, shaded: weekend(dow), muted: weekend(dow), accent: !!mk, inner });
      }
      const calendar = '<div style="flex:1 1 0;min-width:0;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));'
        + 'grid-template-rows:auto auto repeat(' + rows + ',minmax(0,1fr));column-gap:' + S.cellGap + 'px;row-gap:0">' + cal + '</div>';

      // Side column: Focus (numbered, with what was typed) and Notes.
      const numW = Math.round(S.num * 0.85);
      const lineW = S.side - numW - 10;
      const focus = (s.focus || []).map(f => String(f.text || '').trim());
      let focusRows = '';
      for (let i = 0; i < S.focusN; i++) {
        focusRows += '<div style="display:flex;align-items:flex-end;gap:10px">'
          + '<div style="width:' + numW + 'px;flex:none;padding-bottom:' + Math.round(S.num * 0.3) + 'px">' + P.label(String(i + 1), { fs: S.num, accent: true }) + '</div>'
          + '<div style="flex:1;min-width:0">' + P.lines(1, { row: S.rowH, faint: true, fs: S.lfs, texts: [fitText(focus[i], S.lfs, lineW, 500)] }) + '</div></div>';
      }
      const side = '<aside style="flex:none;width:' + S.side + 'px;display:flex;flex-direction:column">'
        + P.section(t('month.focus'), focusRows, { fs: S.title })
        + P.section(t('sheet.notes'), P.lines(S.notesN, { row: S.rowH, faint: true }), { fs: S.title, css: 'margin-top:' + S.notesM + 'px' })
        + '</aside>';

      const main = '<div class="lp-grow" style="display:flex;gap:' + S.gap + 'px;margin-top:' + S.calM + 'px">' + calendar + side + '</div>';

      // Habits: a name line, one circle per day, and a Done box.
      const H = S.habits;
      let habits = '';
      if (H) {
        const names = (s.habits || []).map(h => String(h.name || '').trim());
        let g = '<div style="align-self:end;min-width:0">' + P.section(t('month.habits'), '', { fs: S.title }) + '</div>';
        for (let d = 1; d <= dim; d++) g += '<div style="text-align:center">' + P.label(String(d), { fs: H.head }) + '</div>';
        g += '<div style="text-align:center;min-width:0;overflow:hidden">' + P.label(fitText(t('sheet.done'), H.head, H.doneCol, 600), { fs: H.head }) + '</div>';
        for (let r = 0; r < H.n; r++) {
          g += '<div style="align-self:end;min-width:0;margin-right:' + H.ring + 'px">'
            + P.lines(1, { row: H.ring + 2, faint: true, fs: H.fs, texts: [fitText(names[r], H.fs, H.name - H.ring, 500)] }) + '</div>';
          for (let d = 1; d <= dim; d++) {
            const dow = new Date(y, m, d).getDay();
            g += '<div style="display:flex;justify-content:center">' + P.check({ s: H.ring, color: weekend(dow) ? 'var(--past)' : undefined }) + '</div>';
          }
          g += '<div style="display:flex;justify-content:center">' + P.box({ r: Math.round(H.done[1] * 0.35), pad: 0, css: 'width:' + H.done[0] + 'px;height:' + H.done[1] + 'px' }) + '</div>';
        }
        habits = '<div style="flex:none;display:grid;grid-template-columns:' + H.name + 'px repeat(' + dim + ',minmax(0,1fr)) ' + H.doneCol + 'px;'
          + 'row-gap:' + H.gap + 'px;align-items:center;margin-top:' + H.m + 'px">' + g + '</div>';
      }

      return head + strip + main + habits;
    },
  });
})();
