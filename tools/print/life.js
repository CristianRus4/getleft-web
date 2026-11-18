/*
  Life calendar: a life in weeks (landscape), months or years (portrait).
  Built only from the shared parts in core.js (head, day, box, label).
*/
LeftPrint.define({
  id: 'life',
  orientation: s => (s.unit === 'weeks' ? 'landscape' : 'portrait'),
  fields: [
    { key: 'unit', type: 'segment', label: 'life.unit', options: [{ v: 'weeks', label: 'life.weeks' }, { v: 'months', label: 'life.months' }, { v: 'years', label: 'life.years' }], def: 'weeks' },
    { key: 'name', type: 'text', label: 'life.name', placeholder: 'life.namePlaceholder', max: 40, def: '' },
    { key: 'born', type: 'date', label: 'life.birthDate', def: ({ util }) => { const n = new Date(); return util.isoDate(new Date(n.getFullYear() - 30, n.getMonth(), n.getDate())); } },
    { key: 'years', type: 'number', label: 'life.lifespan', min: 50, max: 120, def: 90, half: true },
    { key: 'lived', type: 'segment', label: 'life.lived', options: [{ v: 'blank', label: 'life.blank' }, { v: 'filled', label: 'life.filled' }], def: 'filled', half: true },
  ],
  thumb: { unit: 'weeks' },

  render(s, ctx) {
    const { P, t, fmt, util } = ctx;
    const unit = ['weeks', 'months', 'years'].includes(s.unit) ? s.unit : 'weeks';
    const years = Math.min(120, Math.max(50, Math.round(Number(s.years) || 90)));
    const born = util.parseDate(s.born);
    const today = new Date(ctx.today.getFullYear(), ctx.today.getMonth(), ctx.today.getDate());
    // Shade the time lived only when the birth date is known and not in the future.
    const prefill = s.lived !== 'blank' && !!born && born <= today;

    // Age in whole years, and the last birthday.
    let age = 0;
    let lastBirthday = today;
    if (born) {
      age = today.getFullYear() - born.getFullYear();
      lastBirthday = new Date(today.getFullYear(), born.getMonth(), born.getDate());
      if (lastBirthday > today) { age -= 1; lastBirthday = new Date(today.getFullYear() - 1, born.getMonth(), born.getDate()); }
    }

    const S = ctx.pick({
      A5: {
        weeks: { name: 34, born: 11, bodyM: 14, dec: 3.5, q: 3, ageF: 7, ageEvery: 10, ageH: 12 },
        months: { name: 34, born: 11, bodyM: 18, colGap: 18, rowGapMax: 26, labF: 9, labH: 14 },
        years: { name: 34, born: 11, bodyM: 18, gap: 5, rad: 6, ageF: 8.5, pad: 4 },
      },
      A4: {
        weeks: { name: 48, born: 15, bodyM: 18, dec: 5, q: 4, ageF: 8.5, ageEvery: 5, ageH: 16 },
        months: { name: 48, born: 15, bodyM: 26, colGap: 28, rowGapMax: 38, labF: 11, labH: 18 },
        years: { name: 48, born: 15, bodyM: 26, gap: 7, rad: 9, ageF: 12, pad: 6 },
      },
      A3: {
        weeks: { name: 68, born: 21, bodyM: 26, dec: 7, q: 6, ageF: 12, ageEvery: 5, ageH: 22 },
        months: { name: 68, born: 21, bodyM: 36, colGap: 40, rowGapMax: 54, labF: 15, labH: 25 },
        years: { name: 68, born: 21, bodyM: 36, gap: 10, rad: 13, ageF: 17, pad: 9 },
      },
    })[unit];

    // Header: the name large, "Born 14 March 1992" in grey on its baseline, then the rule.
    // A long name shrinks to half size, then is cut short, so the header stays inside the page.
    let name = String(s.name || '').trim() || t('life.title');
    const bornLabel = born ? t('life.bornOn', { date: fmt.date(born) }) : '';
    const em = str => [...str].reduce((w, ch) => w + (ch.charCodeAt(0) > 0x2e80 ? 1.02 : /[MWmw@]/.test(ch) ? 1.02 : 0.64), 0);
    const bornW = [...bornLabel].reduce((w, ch) => w + (ch.charCodeAt(0) > 0x2e80 ? 1.02 : 0.6), 0) * S.born;
    const roomEm = size => (ctx.cw - bornW - 2) / size - 0.3;
    const minSize = Math.round(S.name * 0.5);
    if (em(name) > roomEm(minSize)) {
      const chars = [...name];
      while (chars.length > 1 && em(chars.join('') + '…') > roomEm(minSize)) chars.pop();
      name = chars.join('').trim() + '…';
    }
    const nameSize = Math.max(minSize, Math.min(S.name, Math.floor((ctx.cw - bornW - 2) / (em(name) + 0.3))));
    const head = P.head({ title: P.esc(name), sub: P.esc(bornLabel), size: nameSize, subSize: S.born });
    const headH = S.name * 0.9 + ctx.ruleGap + ctx.rule + 2;
    const availH = ctx.ch - headH - S.bodyM;

    let body = '';

    if (unit === 'weeks') {
      // 52 rows of weeks, one column per year, a gap every decade and every quarter.
      const weekInYear = Math.min(51, Math.floor((today - lastBirthday) / (7 * 864e5)));
      const now = Math.max(0, Math.min(years * 52 - 1, age * 52 + weekInYear));
      const decades = Math.ceil(years / 10) - 1;
      const px = (ctx.cw - decades * S.dec) / years;
      const py = Math.min(px * 1.6, (availH - S.ageH - 4 - 3 * S.q) / 52);
      const sq = Math.round(Math.min(px, py) * 0.8 * 10) / 10;
      const gap = px - sq;
      const rowCss = 'display:flex;align-items:center;gap:' + P.px(gap) + ';height:' + P.px(py);
      const ml = y => (y > 0 && y % 10 === 0 ? 'margin-left:' + P.px(S.dec) : '');
      let ages = '';
      for (let y = 0; y < years; y++) {
        ages += '<span style="flex:none;width:' + P.px(sq) + ';' + ml(y) + '">'
          + (y % S.ageEvery === 0 ? P.label(String(y), { fs: S.ageF, ink: y % 10 === 0 }) : '') + '</span>';
      }
      let rows = '';
      for (let w = 0; w < 52; w++) {
        let cells = '';
        for (let y = 0; y < years; y++) {
          const i = y * 52 + w;
          cells += P.day({ s: sq, thin: true, past: prefill && i < now, now: prefill && i === now, css: ml(y) });
        }
        rows += '<div style="' + rowCss + ([13, 26, 39].includes(w) ? ';margin-top:' + P.px(S.q) : '') + '">' + cells + '</div>';
      }
      body = '<div class="lp-grow" style="display:flex;flex-direction:column;justify-content:center;margin-top:' + P.px(S.bodyM) + '">'
        + '<div style="' + rowCss + ';height:' + P.px(S.ageH) + ';margin-bottom:4px">' + ages + '</div>' + rows + '</div>';
    } else if (unit === 'months') {
      // Decade blocks: 10 years across, 12 months down, three blocks to a row.
      const monthsSince = born ? (today.getFullYear() - born.getFullYear()) * 12 + today.getMonth() - born.getMonth() - (today.getDate() < born.getDate() ? 1 : 0) : 0;
      const now = Math.max(0, Math.min(years * 12 - 1, monthsSince));
      const nBlocks = Math.ceil(years / 10);
      const COLS = 3;
      const bRows = Math.ceil(nBlocks / COLS);
      const pitch = Math.min((ctx.cw - (COLS - 1) * S.colGap) / COLS / 10, (availH - bRows * S.labH - (bRows - 1) * S.rowGapMax * 0.6) / (bRows * 12));
      const used = bRows * (S.labH + 12 * pitch);
      const rowGap = bRows > 1 ? Math.max(0, Math.min(S.rowGapMax, (availH - used) / (bRows - 1))) : 0;
      const sq = Math.round(pitch * 0.78 * 10) / 10;
      let blocks = '';
      for (let b = 0; b < nBlocks; b++) {
        let cells = '';
        for (let mo = 0; mo < 12; mo++) {
          for (let yy = b * 10; yy < b * 10 + 10; yy++) {
            const i = yy * 12 + mo;
            cells += yy >= years ? '<span></span>' : P.day({ s: sq, thin: true, past: prefill && i < now, now: prefill && i === now });
          }
        }
        blocks += '<div style="display:flex;flex-direction:column">'
          + '<div style="height:' + P.px(S.labH) + '">' + P.label(String(b * 10), { fs: S.labF, ink: true }) + '</div>'
          + '<div style="display:grid;grid-template-columns:repeat(10,' + P.px(pitch) + ');grid-auto-rows:' + P.px(pitch) + ';align-items:center;justify-items:start">' + cells + '</div></div>';
      }
      body = '<div class="lp-grow" style="display:grid;grid-template-columns:repeat(' + COLS + ',' + P.px(pitch * 10) + ');justify-content:space-between;row-gap:' + P.px(rowGap) + ';align-content:center;margin-top:' + P.px(S.bodyM) + '">' + blocks + '</div>';
    } else {
      // Ten boxes to a row, one per year: the age, and the calendar year under it.
      const rowsN = Math.ceil(years / 10);
      const cellW = (ctx.cw - 9 * S.gap) / 10;
      const cellH = Math.min(cellW * 1.25, (availH - (rowsN - 1) * S.gap) / rowsN);
      const y0 = born ? born.getFullYear() : null;
      let cells = '';
      for (let y = 0; y < years; y++) {
        cells += P.box({ n: String(y), sub: y0 != null ? String(y0 + y) : '', fs: S.ageF, r: S.rad, pad: S.pad, lived: prefill && y < age, accent: prefill && y === age });
      }
      body = '<div class="lp-grow" style="display:grid;grid-template-columns:repeat(10,minmax(0,1fr));grid-auto-rows:' + P.px(cellH) + ';gap:' + P.px(S.gap) + ';align-content:center;margin-top:' + P.px(S.bodyM) + '">' + cells + '</div>';
    }

    return head + body;
  },
});
