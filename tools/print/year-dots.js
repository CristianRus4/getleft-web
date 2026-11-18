/*
  Year in dots: one rounded square per day of the year, the year as the title.
  Built only from the shared parts in core.js (head, day).
*/
LeftPrint.define({
  id: 'year-dots',
  orientation: 'portrait',
  fields: [
    { key: 'year', type: 'year', label: 'ui.year', half: true },
    { key: 'past', type: 'segment', label: 'year-dots.days', half: true, options: [{ v: 'blank', label: 'year-dots.blank' }, { v: 'filled', label: 'year-dots.filled' }], def: 'blank' },
  ],
  thumb: {},

  render(s, ctx) {
    const { P, util } = ctx;
    const S = ctx.pick({
      A5: { year: 60, cols: 17, m: 18 },
      A4: { year: 88, cols: 18, m: 28 },
      A3: { year: 120, cols: 18, m: 40 },
    });
    const year = Number(s.year) || util.planYear();
    const total = util.daysInYear(year);
    const rows = Math.ceil(total / S.cols);
    const today = ctx.today;
    const live = s.past === 'filled' && today.getFullYear() === year;
    const todayIdx = live ? util.dayOfYear(today) : -1;

    const head = P.head({ title: year, size: S.year });

    // Pitch from the width, shrunk if the rows would not fit the height.
    const availH = ctx.ch - S.year * 0.9 - ctx.ruleGap - ctx.rule - 2 * S.m;
    const pitch = Math.min(ctx.cw / S.cols, availH / rows);
    const size = Math.round(pitch * 0.68);
    let cells = '';
    for (let i = 0; i < total; i++) {
      cells += P.day({ s: size, past: live && i < todayIdx, now: i === todayIdx });
    }
    const grid = '<div style="width:100%;display:grid;grid-template-columns:repeat(' + S.cols + ',minmax(0,1fr));grid-auto-rows:' + pitch.toFixed(2) + 'px;align-items:center;justify-items:center">' + cells + '</div>';

    return head + '<div class="lp-grow" style="display:flex;align-items:center;margin:' + S.m + 'px 0">' + grid + '</div>';
  },
});
