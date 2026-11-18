/*
  Streak tracker: one circle per day for a 30, 66 or 100 day streak.
  Built only from the shared parts in core.js (head, rule, field, check, section, lines).
*/
LeftPrint.define({
  id: 'streak',
  orientation: 'portrait',
  fields: [
    { key: 'habit', type: 'text', label: 'streak.habit', placeholder: 'streak.habitPlaceholder', max: 32, def: '' },
    { key: 'n', type: 'segment', label: 'streak.length', options: [{ v: 30, text: '30' }, { v: 66, text: '66' }, { v: 100, text: '100' }], def: 100 },
    { key: 'start', type: 'date', label: 'streak.start', def: '' },
    { key: 'why', type: 'text', label: 'streak.why', max: 60, def: '', when: s => s.paper !== 'A5' },
    { key: 'reward', type: 'text', label: 'streak.reward', max: 60, def: '', when: s => s.paper !== 'A5' },
  ],
  thumb: { n: 66 },

  render(s, ctx) {
    const { P, t, fmt, util } = ctx;
    const S = ctx.pick({
      A5: { title: 36, fieldsM: 12, fields: ['dayOne', 'longest'], fieldW: 190, lab: 9, lineH: 18, gap: 0.75, bodyM: 18, boxes: null, numF: 0.34 },
      A4: { title: 52, fieldsM: 18, fields: ['dayOne', 'longest', 'restarts'], fieldW: 200, lab: 11, lineH: 22, gap: 1, bodyM: 18, boxes: { lines: 3, row: 30, fs: 15, gap: 34 }, numF: 0.3 },
      A3: { title: 74, fieldsM: 26, fields: ['dayOne', 'longest', 'restarts'], fieldW: 280, lab: 15, lineH: 30, gap: 1.4, bodyM: 30, boxes: { lines: 4, row: 40, fs: 20, gap: 48 }, numF: 0.3 },
    });
    const n = Number(s.n) || 100;
    const habit = String(s.habit || '').trim();
    const start = util.parseDate(s.start);

    // Header: "100 days of reading" and the rule running on from it.
    const title = habit
      ? P.esc(t('streak.titleHabit', { n, habit: '\u0000' })).replace('\u0000', '<span class="lp-accent">' + P.esc(habit) + '</span>')
      : P.esc(t('streak.title', { n }));
    const head = '<header class="lp-head" style="justify-content:flex-start;align-items:flex-end;gap:' + Math.round(S.title * 0.3) + 'px;--title:' + S.title + 'px">'
      + '<div class="lp-title" style="line-height:0.95;min-width:0;overflow:hidden;text-overflow:ellipsis">' + title + '</div>'
      + P.rule({ inline: true, style: { 'margin-bottom': Math.round(S.title * 0.08) } }) + '</header>';

    // Fields under the header: Day 1 (the start date when given), Longest streak, Restarts.
    const fields = S.fields.map(k => P.field(t('streak.' + k), {
      w: S.fieldW, lab: S.lab, lineH: S.lineH,
      value: k === 'dayOne' && start ? fmt.date(start, { day: 'numeric', month: 'short', year: 'numeric' }) : '',
    })).join('');

    // Bottom boxes: why and the reward, with what the visitor typed on the first line.
    const B = S.boxes;
    const boxes = B ? '<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:' + B.gap + 'px;flex:none">'
      + [['why', s.why], ['reward', s.reward]].map(([k, text]) => P.section(t('streak.' + k), P.lines(B.lines, { row: B.row, faint: true, texts: [String(text || '').trim()], fs: B.fs * 0.85 }), { fs: B.fs })).join('')
      + '</div>' : '';

    // The circles, as big as the space left allows.
    const cols = n === 30 ? 6 : n === 66 ? 11 : 10;
    const rows = Math.ceil(n / cols);
    const gap = Math.round((n === 30 ? 12 : 8) * S.gap);
    const fixedH = S.title * 0.95 + S.fieldsM + S.lab * 1.25 + 3 + S.lineH + ctx.ruleGap + ctx.rule
      + 2 * S.bodyM + (B ? B.fs * 1.1 + B.lines * B.row : 0);
    const sW = (ctx.cw - (cols - 1) * gap) / cols;
    const sH = (ctx.ch - fixedH - (rows - 1) * gap) / rows;
    const size = Math.floor(Math.min(sW, sH));
    let circles = '';
    for (let i = 0; i < n; i++) {
      const d = start ? new Date(start.getFullYear(), start.getMonth(), start.getDate() + i) : null;
      circles += P.check({ s: size, label: d ? d.getDate() : '', fs: size * S.numF });
    }
    const grid = '<div style="width:100%;display:grid;grid-template-columns:repeat(' + cols + ',' + size + 'px);justify-content:space-between;row-gap:' + gap + 'px">' + circles + '</div>';

    return head
      + '<div style="display:flex;justify-content:space-between;margin-top:' + S.fieldsM + 'px;flex:none">' + fields + '</div>'
      + P.rule()
      + '<div class="lp-grow" style="display:flex;align-items:center;margin:' + S.bodyM + 'px 0">' + grid + '</div>'
      + boxes;
  },
});
