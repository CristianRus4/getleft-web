/*
  Goal tracker: the year, then up to four goals, each a grid of circles.
  Built only from the shared parts in core.js (head, field, section, check).
*/
LeftPrint.define({
  id: 'goals',
  orientation: 'portrait',
  fields: [
    { key: 'year', type: 'year', label: 'goals.year', half: true },
    { key: 'template', type: 'segment', label: 'goals.template', half: true, options: [{ v: 'examples', label: 'goals.templateExamples' }, { v: 'blank', label: 'goals.templateBlank' }], def: 'examples' },
    {
      key: 'goals', type: 'list', label: 'goals.goals', max: 4, add: 'goals.add',
      when: s => s.template !== 'blank',
      item: [
        { key: 'title', type: 'text', placeholder: 'goals.goalTitlePlaceholder', label: 'goals.goalTitle', max: 40, def: '' },
        { key: 'target', type: 'number', label: 'goals.target', min: 1, max: 1000000, def: 30, narrow: true },
        { key: 'unit', type: 'text', placeholder: 'goals.unitPlaceholder', label: 'goals.unit', max: 8, def: '', narrow: true },
        { key: 'by', type: 'date', label: 'goals.by', def: '', narrow: true },
      ],
      def: ({ t }) => [
        { title: t('goals.ex1'), target: 20, unit: '', by: '' },
        { title: t('goals.ex2'), target: 300, unit: t('goals.ex2unit'), by: '' },
        { title: t('goals.ex3'), target: Number(String(t('goals.ex3target')).replace(/\D/g, '')) || 3000, unit: t('goals.ex3unit'), by: '' },
        { title: t('goals.ex4'), target: 30, unit: '', by: '' },
      ],
    },
  ],

  render(s, ctx) {
    const { P, t, fmt, util } = ctx;
    const S = ctx.pick({
      A5: { year: 60, sub: 18, bodyM: 26, goals: 3, cols: 10, title: 16, lab: 9, lineH: 18, byW: 110, gap: 5, secGap: 9, circ: 7.5 },
      A4: { year: 88, sub: 26, bodyM: 40, goals: 3, cols: 10, title: 22, lab: 11, lineH: 24, byW: 150, gap: 6, secGap: 12, circ: 10 },
      A3: { year: 120, sub: 36, bodyM: 52, goals: 4, cols: 15, title: 30, lab: 15, lineH: 32, byW: 210, gap: 8, secGap: 16, circ: 12.5 },
    });
    const year = s.year || util.planYear();

    // The goals to draw: the typed ones, then blank ones to fill the sheet.
    const typed = s.template === 'blank' ? [] : (s.goals || []);
    const rows = typed.slice(0, S.goals).map(g => ({
      title: String(g.title || '').trim(),
      target: Math.max(1, Math.round(Number(g.target) || 30)),
      unit: String(g.unit || '').trim(),
      by: util.parseDate(g.by),
    }));
    while (rows.length < S.goals) rows.push({ title: '', target: 30, unit: '', by: null });

    // Circle labels: one per unit up to 30, else 30 circles worth a friendly step.
    const niceStep = raw => {
      const mag = Math.pow(10, Math.floor(Math.log10(raw)));
      for (const m of [1, 2, 2.5, 5, 10]) if (m * mag >= raw - 1e-9) return m * mag;
      return 10 * mag;
    };
    const withUnit = (n, unit) => {
      const v = fmt.num(n);
      if (!unit) return v;
      return /^[$£€¥]$/.test(unit) ? unit + v : v + ' ' + unit;
    };
    const labelsFor = g => {
      if (g.target <= 30) return Array.from({ length: g.target }, (_, i) => withUnit(i + 1, g.unit));
      const step = niceStep(g.target / 30);
      const n = Math.ceil(g.target / step - 1e-9);
      return Array.from({ length: n }, (_, i) => withUnit(i === n - 1 ? g.target : Math.round((i + 1) * step * 100) / 100, g.unit));
    };

    const size = (ctx.cw - (S.cols - 1) * S.gap) / S.cols;
    const sections = rows.map(g => {
      const labels = labelsFor(g);
      // Shrink the label font so the longest label fits inside the circle.
      const longest = Math.max(...labels.map(l => l.length));
      const fs = Math.min(S.circ, (size * 0.8) / (longest * 0.6));
      const circles = labels.map((l, i) => P.check({ fluid: true, label: l, fs, accent: i === labels.length - 1 })).join('');
      const head = g.title
        ? '<div style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + P.section(g.title, '', { fs: S.title }) + '</div>'
        : '<div style="flex:1;min-width:0">' + P.field(t('goals.goal'), { lab: S.lab, lineH: S.lineH }) + '</div>';
      const by = P.field(t('goals.doneBy'), {
        w: S.byW, lab: S.lab, lineH: S.lineH,
        value: g.by ? fmt.date(g.by, { day: 'numeric', month: 'short', year: 'numeric' }) : '',
      });
      return '<section style="display:flex;flex-direction:column;gap:' + S.secGap + 'px">'
        + '<div style="display:flex;align-items:flex-end;gap:24px">' + head + by + '</div>'
        + '<div style="display:grid;grid-template-columns:repeat(' + S.cols + ',minmax(0,1fr));gap:' + S.gap + 'px">' + circles + '</div>'
        + '</section>';
    }).join('');

    return P.head({ title: P.esc(year), sub: P.esc(t('goals.heading')), size: S.year, subSize: S.sub })
      + '<div class="lp-grow" style="display:flex;flex-direction:column;justify-content:space-between;margin-top:' + S.bodyM + 'px">' + sections + '</div>';
  },
});
