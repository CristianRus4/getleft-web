/*
  Monthly habit tracker: one row per habit, one circle per day of the month.
  A habit's days (every day, weekdays, Mon/Wed/Fri...) decide which days are
  planned; the others get the dashed circle and are left out of "/planned".
  Built from the shared parts in core.js (head, label, check, lines, section, rule).
*/
(function () {
  const { fmt } = LeftPrint;

  // Starters: [name key, days, goal key]. Text lives in habits.json under starter.<key>.
  const STARTERS = {
    newYear: [['h1', 'daily', 'g1'], ['h2', 'daily', 'g2'], ['h3', 'daily'], ['h4', 'mwf', 'g4'], ['h5', 'weekdays', 'g5']],
    reading: [['h1', 'daily', 'g1'], ['h2', 'weekdays', 'g2'], ['h3', 'weekends']],
    dry: [['h1', 'daily'], ['h2', 'daily', 'g2'], ['h3', 'daily'], ['h4', 'daily', 'g4']],
    noSpend: [['h1', 'daily'], ['h2', 'daily'], ['h3', 'daily']],
    fitness: [['h1', 'daily', 'g1'], ['h2', 'mwf', 'g2'], ['h3', 'daily', 'g3'], ['h4', 'weekends']],
    blank: [],
  };
  const starterKey = v => (STARTERS[v] ? v : 'newYear');
  const habitsOf = (v, t) => STARTERS[starterKey(v)].map(([h, sched, g]) => ({
    name: t('habits.starter.' + starterKey(v) + '.' + h), sched, goal: g ? t('habits.starter.' + starterKey(v) + '.' + g) : '',
  }));

  // Which days of the week (0 = Sunday) each schedule plans.
  const DAYS = { daily: [0, 1, 2, 3, 4, 5, 6], weekdays: [1, 2, 3, 4, 5], weekends: [0, 6], mwf: [1, 3, 5], tt: [2, 4] };
  const dayList = days => {
    const names = days.map(d => fmt.weekday(d, 'short'));
    try { return new Intl.ListFormat(document.documentElement.lang || 'en', { type: 'unit', style: 'short' }).format(names); } catch (e) { return names.join(', '); }
  };
  const schedText = (v, t) => (v === 'mwf' || v === 'tt' ? dayList(DAYS[v]) : t('habits.' + (DAYS[v] ? v : 'daily')));
  const SCHED = ['daily', 'weekdays', 'weekends', 'mwf', 'tt'].map(v => (v === 'mwf' || v === 'tt' ? { v, text: dayList(DAYS[v]) } : { v, label: 'habits.' + v }));

  // Habit colours from the design; the chosen colour leads.
  const PALETTE = ['#FF4F00', '#0A84FF', '#34C759', '#BF5AF2', '#FF9F0A', '#FF375F'];

  // Rough text width in em, to shrink a long title so it never spills.
  const ems = (s, latin) => [...String(s)].reduce((w, c) => w + (c.codePointAt(0) >= 0x2E80 ? 1 : latin), 0);

  LeftPrint.define({
    id: 'habits',
    orientation: 'landscape',
    // The colour control does nothing in black and white.
    accent: s => s.ink !== 'bw',
    fields: [
      {
        key: 'start', type: 'select', label: 'habits.start', def: 'newYear',
        options: Object.keys(STARTERS).map(v => ({ v, label: 'habits.starter.' + v + '.label' })),
        // Picking a starter replaces the title and habits with the starter's.
        apply(v, s, { t }) { s.title = t('habits.starter.' + starterKey(v) + '.title'); s.habits = habitsOf(v, t); },
      },
      { key: 'm', type: 'month', label: 'ui.month', half: true, def: ({ util }) => util.planMonth().m },
      { key: 'y', type: 'year', label: 'ui.year', half: true, def: ({ util }) => util.planMonth().y },
      { key: 'title', type: 'text', label: 'habits.title', max: 40, def: ({ t }) => t('habits.starter.newYear.title') },
      {
        key: 'habits', type: 'list', label: 'habits.habits', add: 'habits.addHabit', max: 10,
        item: [
          { key: 'name', type: 'text', label: 'habits.habitName', placeholder: 'habits.habitPlaceholder', max: 40 },
          { key: 'sched', type: 'select', label: 'habits.schedule', options: SCHED, def: 'daily', narrow: true },
          { key: 'goal', type: 'text', label: 'habits.goal', placeholder: 'habits.goalPlaceholder', max: 24 },
        ],
        def: ({ t }) => habitsOf('newYear', t),
      },
      { key: 'ink', type: 'segment', label: 'habits.ink', options: [{ v: 'colour', label: 'habits.inkColour' }, { v: 'bw', label: 'habits.inkBw' }], def: 'colour' },
    ],
    thumb: {},

    render(s, ctx) {
      const { P, t, util } = ctx;
      const S = ctx.pick({
        A5: { top: 11, title: 30, left: 20, leftSub: 10, gridM: 18, nameCol: 160, doneCol: 44, ini: 8, num: 9.5, headPad: 5, rows: 6, rowH: 38, ring: 12, barH: 20, barW: 3, name: 11.5, sub: 0, doneW: 20, doneF: 8.5, refN: 2, refLines: 3, refRow: 24, refTitle: 12, refM: 18, refGap: 28 },
        A4: { top: 14, title: 42, left: 26, leftSub: 13, gridM: 26, nameCol: 230, doneCol: 58, ini: 10, num: 12, headPad: 7, rows: 6, rowH: 46, ring: 17, barH: 26, barW: 3, name: 14, sub: 10.5, doneW: 26, doneF: 10, refN: 2, refLines: 5, refRow: 30, refTitle: 15, refM: 26, refGap: 40 },
        A3: { top: 19, title: 60, left: 36, leftSub: 18, gridM: 34, nameCol: 330, doneCol: 82, ini: 13, num: 16, headPad: 10, rows: 10, rowH: 52, ring: 24, barH: 32, barW: 4, name: 19, sub: 14, doneW: 36, doneF: 14, refN: 3, refLines: 5, refRow: 34, refTitle: 20, refM: 32, refGap: 56 },
      });
      const y = Number(s.y) || util.planMonth().y;
      const m = Math.min(11, Math.max(0, Number(s.m) || 0));
      const bw = s.ink === 'bw';
      const start = starterKey(s.start);
      const palette = [ctx.accent].concat(PALETTE.filter(c => c.toUpperCase() !== String(ctx.accent).toUpperCase()));
      const dim = util.daysInMonth(y, m);
      const dows = Array.from({ length: dim }, (_, i) => new Date(y, m, i + 1).getDay());
      const weekend = g => g === 0 || g === 6;
      const cell = (css, inner, shade) => '<div style="' + css + (shade ? ';background:var(--shade)' : '') + '">' + (inner || '') + '</div>';
      const muted = (text, fs) => '<div class="lp-muted" style="font-size:' + fs + 'px;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + P.esc(text) + '</div>';

      // Header: month and year over the title; days left in the year on the right.
      const left = util.daysInYear(y) - util.dayOfYear(new Date(y, m, 1));
      // The sentence places the number ({n}) where its language wants it; the number is drawn large.
      const [before = '', after = ''] = t('habits.daysLeft', { n: '\u0001', count: left, year: y }).split('\u0001').map(x => x.trim());
      const small = text => text ? '<span class="lp-muted lp-nowrap" style="font-size:' + S.leftSub + 'px">' + P.esc(text) + '</span>' : '';
      const leftText = before + after;
      const right = '<div style="display:flex;align-items:baseline;gap:' + Math.round(S.left * 0.23) + 'px;padding-bottom:' + Math.round(S.title * 0.06) + 'px">'
        + small(before) + P.label(fmt.num(left), { fs: S.left, accent: !bw, ink: bw }) + small(after) + '</div>';
      const rightW = String(left).length * 0.62 * S.left + S.left * 0.23 * ((before ? 1 : 0) + (after ? 1 : 0)) + ems(leftText, 0.5) * S.leftSub;
      const title = String(s.title || '').trim() || t('habits.starter.' + start + '.title');
      const titleSize = Math.max(S.title * 0.4, Math.min(S.title, (ctx.cw - rightW - 30) / Math.max(1, ems(title, 0.56))));
      const head = '<div style="display:flex;gap:' + Math.round(S.top * 0.6) + 'px;margin-bottom:' + Math.round(S.top * 0.45) + 'px;flex:none">'
        + P.label(fmt.month(m), { fs: S.top, accent: !bw, ink: bw }) + P.label(String(y), { fs: S.top }) + '</div>'
        + P.head({ title: P.esc(title), size: titleSize, right });

      // Grid: name column, one column per day, Done.
      let cells = cell('');
      dows.forEach(g => { cells += cell('text-align:center;padding-top:' + Math.round(S.headPad * 0.85) + 'px', P.label(fmt.weekday(g, 'narrow'), { fs: S.ini }), weekend(g)); });
      cells += cell('');
      cells += cell('display:flex;align-items:flex-end;padding-bottom:' + S.headPad + 'px', P.label(t('sheet.habit'), { fs: S.doneF * 1.1 }));
      dows.forEach((g, i) => { cells += cell('text-align:center;padding:' + Math.round(S.headPad * 0.3) + 'px 0 ' + S.headPad + 'px', P.label(String(i + 1), { fs: S.num, ink: !weekend(g) }), weekend(g)); });
      cells += cell('display:flex;align-items:flex-end;justify-content:center;padding-bottom:' + S.headPad + 'px', P.label(t('sheet.done'), { fs: S.doneF * 1.1 }));
      cells += P.rule({ style: { 'grid-column': '1/-1', 'margin-top': 0 } });

      const rowCss = 'height:' + S.rowH + 'px;border-bottom:1px solid var(--hair);display:flex;align-items:center';
      const habits = (s.habits || []).slice(0, S.rows);
      for (let r = 0; r < S.rows; r++) {
        const h = habits[r] || {};
        const name = String(h.name || '').trim();
        const sched = DAYS[h.sched] ? h.sched : 'daily';
        const goal = String(h.goal || '').trim();
        const col = !name ? 'var(--stroke-strong)' : bw ? 'var(--ink)' : palette[r % palette.length];
        let text = '';
        if (name) {
          text = P.bar({ w: S.barW, h: S.barH, color: col })
            + '<div style="display:flex;flex-direction:column;gap:' + Math.round(S.name / 7) + 'px;min-width:0">'
            + '<div class="lp-strong" style="font-size:' + S.name + 'px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + P.label(name, { fs: S.name, ink: true }) + '</div>'
            + (S.sub ? muted(schedText(sched, t) + (goal ? ' · ' + goal : ''), S.sub) : '')
            + '</div>';
        }
        cells += cell(rowCss + ';gap:' + Math.round(S.name / 2) + 'px;padding-right:12px;min-width:0', text);
        let planned = 0;
        dows.forEach(g => {
          const on = DAYS[sched].includes(g);
          if (on) planned++;
          cells += cell(rowCss + ';justify-content:center', on ? P.check({ s: S.ring, color: col }) : P.check({ s: S.ring, off: true }), weekend(g));
        });
        cells += cell(rowCss + ';justify-content:center',
          '<div style="display:flex;align-items:flex-end;gap:2px">'
          + P.lines(1, { row: Math.round(S.doneF * 1.2), css: 'width:' + S.doneW + 'px' })
          + (name ? P.label('/' + planned, { fs: S.doneF }) : '') + '</div>');
      }
      const grid = '<div style="flex:none;display:grid;grid-template-columns:' + S.nameCol + 'px repeat(' + dim + ',minmax(0,1fr)) ' + S.doneCol + 'px;margin-top:' + S.gridM + 'px">' + cells + '</div>';

      // Reflection columns: as many lines as the space left holds.
      const used = S.top + S.top * 0.45 + titleSize * 0.9 + ctx.ruleGap + ctx.rule + S.gridM
        + S.ini + S.headPad * 0.85 + S.num + S.headPad * 1.3 + 4 + ctx.rule + S.rows * S.rowH
        + S.refM + S.refTitle * 1.1;
      const lines = Math.max(1, Math.min(S.refLines, Math.floor((ctx.ch - used - 6) / S.refRow)));
      const titles = [t('habits.starter.' + start + '.r1'), t('habits.starter.' + start + '.r2'), t('habits.nextMonth')].slice(0, S.refN);
      const reflect = '<div style="flex:none;display:grid;grid-template-columns:repeat(' + S.refN + ',minmax(0,1fr));column-gap:' + S.refGap + 'px;margin-top:' + S.refM + 'px">'
        + titles.map(ti => P.section(ti, P.lines(lines, { row: S.refRow, faint: true }), { fs: S.refTitle, css: 'overflow:hidden' })).join('')
        + '</div>';

      return head + grid + reflect;
    },
  });
})();
