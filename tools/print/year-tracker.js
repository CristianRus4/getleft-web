/*
  Year in pixels: months down, days 1-31 across, one rounded square per day,
  a Total column on A4 and A3, and a header with the year and a write-in field.
  Built only from the shared parts in core.js (head, day, box, label, section, lines).
*/
LeftPrint.define({
  id: 'year-tracker',
  orientation: 'landscape',
  fields: [
    { key: 'year', type: 'year', label: 'ui.year', half: true },
    { key: 'template', type: 'segment', label: 'year-tracker.template', half: true, options: [{ v: 'habit', label: 'year-tracker.habit' }, { v: 'mood', label: 'year-tracker.mood' }, { v: 'blank', label: 'year-tracker.blank' }], def: 'habit' },
    { key: 'goal', type: 'text', label: 'year-tracker.goal', placeholder: 'year-tracker.goalPlaceholder', max: 60, def: '' },
  ],

  render(s, ctx) {
    const { P, t, fmt, util } = ctx;
    const S = ctx.pick({
      A5: { year: 48, field: 15, fieldW: 330, lab: 34, total: 0, sq: 16, gap: 11, qGap: 8, head: 8, mon: 9.5, gridM: 22, r: 4 },
      A4: { year: 68, field: 22, fieldW: 470, lab: 46, total: 52, sq: 25, gap: 17, qGap: 14, head: 10, mon: 12, gridM: 32, r: 6 },
      A3: { year: 96, field: 30, fieldW: 660, lab: 66, total: 74, sq: 34, gap: 23, qGap: 20, head: 14, mon: 17, gridM: 44, r: 9 },
    });
    const year = Number(s.year) || util.planYear();
    const tpl = s.template || 'habit';
    const goal = String(s.goal || '').trim();

    // Header: the year, and "My goal is" with a line (typed text prints on it).
    const label = tpl === 'mood' ? t('year-tracker.labelMood') : tpl === 'habit' ? t('year-tracker.labelHabit') : '';
    const maxChars = Math.max(8, Math.floor((S.fieldW - S.field * (label.length * 0.55 + 1)) / (S.field * 0.56)));
    const text = goal.length > maxChars ? goal.slice(0, maxChars - 1).trimEnd() + '…' : goal;
    const right = '<div style="display:flex;align-items:flex-end;gap:12px;width:' + S.fieldW + 'px;max-width:100%">'
      + (label ? P.section(label, '', { fs: S.field, css: { 'white-space': 'nowrap', 'padding-bottom': Math.round(S.field * 0.3) } }) : '')
      + '<div style="flex:1;min-width:0">' + P.lines(1, { row: Math.round(S.field * 1.5), texts: [text], fs: S.field }) + '</div></div>';
    const head = P.head({ title: year, size: S.year, right });

    // Grid: month label column, 31 days, optional Total column.
    const cellW = (ctx.cw - S.lab - (S.total || 0)) / 31;
    const sq = Math.floor(Math.min(S.sq, cellW));
    const cols = S.lab + 'px repeat(31,minmax(0,1fr))' + (S.total ? ' ' + S.total + 'px' : '');
    let g = '<span></span>';
    for (let d = 1; d <= 31; d++) g += '<span>' + P.label(d, { fs: S.head }) + '</span>';
    if (S.total) g += '<span style="justify-self:end">' + P.label(t('year-tracker.total'), { fs: S.head }) + '</span>';
    for (let m = 0; m < 12; m++) {
      const dim = util.daysInMonth(year, m);
      const top = (m === 3 || m === 6 || m === 9) ? 'margin-top:' + S.qGap + 'px;' : '';
      g += '<span style="' + top + 'justify-self:start;min-width:0">' + P.label(fmt.month(m, 'short'), { fs: S.mon, ink: true }) + '</span>';
      for (let d = 1; d <= 31; d++) g += d <= dim ? '<span style="' + top + 'line-height:0">' + P.day({ s: sq }) + '</span>' : '<span></span>';
      if (S.total) g += '<span style="' + top + 'justify-self:end">' + P.box({ n: '/' + dim, fs: S.head, r: S.r, muted: true, align: 'end', css: { width: Math.round(S.total * 0.77), height: sq } }) + '</span>';
    }
    const grid = '<div style="display:grid;grid-template-columns:' + cols + ';row-gap:' + S.gap + 'px;align-items:center;justify-items:center;margin-top:' + S.gridM + 'px">' + g + '</div>';

    return head + grid;
  },
});
