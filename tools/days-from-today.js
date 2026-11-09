// Days from today: shared by /tools/days-from-today and the fixed pages
// (30, 45, 60, 90 and 120 days from today). Needs /tools/tools.js first.
// Strings come from the hidden #dft-strings block, so the build translates them.
(function () {
  const root = document.getElementById('dft');
  if (!root) return;
  const $id = id => document.getElementById(id);
  const strEl = $id('dft-strings');
  const s = (key, vars) => {
    const el = strEl && strEl.querySelector('[data-s="' + key + '"]');
    return toolInterpolate(el ? el.textContent.trim() : key, vars);
  };
  const nEl = $id('dft-n'), unitEl = $id('dft-unit'), dirEl = $id('dft-dir');
  const dateEl = $id('dft-answer'), sinceEl = $id('dft-since'), statsEl = $id('dft-stats'), calEl = $id('dft-cal');
  const loc = toolFormatLocale();
  const dec1 = new Intl.NumberFormat(loc, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const MAX = 36500;
  const isWeekend = d => d.getDay() === 0 || d.getDay() === 6;
  const today0 = () => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); };
  const daysBetween = (a, b) => Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / 864e5);

  // Read the starting values: the page default, then any shared link.
  const q = new URLSearchParams(location.search);
  const qn = parseInt(q.get('n'), 10);
  if (qn >= 0 && qn <= MAX) nEl.value = qn;
  if (['days', 'weekdays', 'weeks', 'months'].includes(q.get('unit'))) unitEl.value = q.get('unit');
  if (q.get('dir') === 'ago') dirEl.value = '-1';

  // The date `n` units after (dir 1) or before (dir -1) `from`.
  function shift(from, n, unit, dir) {
    if (unit === 'months') return addToDate(from, { months: n * dir });
    if (unit === 'weeks') return addToDate(from, { days: 7 * n * dir });
    if (unit === 'days') return addToDate(from, { days: n * dir });
    const d = new Date(from);
    let left = n;
    while (left > 0) { d.setDate(d.getDate() + dir); if (!isWeekend(d)) left--; }
    return d;
  }
  function weekdaysBetween(a, b) {
    const [x, y] = a <= b ? [a, b] : [b, a];
    let c = 0;
    for (const d = new Date(x.getFullYear(), x.getMonth(), x.getDate() + 1); d <= y; d.setDate(d.getDate() + 1)) if (!isWeekend(d)) c++;
    return c;
  }
  const tile = (n, lbl) => '<div class="tool-stat"><div class="tool-stat-num">' + n + '</div><div class="tool-stat-label">' + toolEscape(lbl) + '</div></div>';
  const state = () => {
    const n = Math.min(MAX, Math.max(0, parseInt(nEl.value, 10) || 0));
    return { n, unit: unitEl.value, dir: +dirEl.value };
  };
  const phrase = st => fmtNum(st.n) + ' ' + unitEl.selectedOptions[0].text.trim() + ' ' + dirEl.selectedOptions[0].text.trim();

  let target = today0();
  function render() {
    const st = state();
    const today = today0();
    target = shift(today, st.n, st.unit, st.dir);
    dateEl.textContent = formatDateLong(target);
    sinceEl.textContent = s(st.dir > 0 ? 'from' : 'back', { date: formatDateLong(today) });
    const days = Math.abs(daysBetween(today, target));
    statsEl.innerHTML = tile(fmtNum(days), s('calDays')) + tile(fmtNum(weekdaysBetween(today, target)), s('weekdays')) +
      tile(dec1.format(days / 7), s('weeks')) + tile(fmtNum(isoWeek(target).week), s('weekNo'));

    // The target's month, with the days inside the span shaded.
    const y = target.getFullYear(), m = target.getMonth();
    const start = new Date(y, m, 1), last = new Date(y, m + 1, 0).getDate();
    const lo = st.dir > 0 ? today : target, hi = st.dir > 0 ? target : today;
    const fdow = (() => {
      try { const l = new Intl.Locale(loc || navigator.language || 'en-US'); const w = (l.getWeekInfo && l.getWeekInfo()) || l.weekInfo; if (w && w.firstDay) return w.firstDay % 7; } catch (e) {}
      const tag = loc || navigator.language || 'en-US';
      return tag === 'en' || /-(US|CA|MX|BR|JP|KR|TW|HK|IN|IL|PH|ZA)\b/i.test(tag) ? 0 : 1;
    })();
    let g = '';
    for (let i = 0; i < 7; i++) g += '<div class="pp-cal__dow">' + toolEscape(new Date(2024, 0, 7 + ((fdow + i) % 7)).toLocaleDateString(loc, { weekday: 'narrow' })) + '</div>';
    for (let i = 0; i < (start.getDay() - fdow + 7) % 7; i++) g += '<div></div>';
    for (let d = 1; d <= last; d++) {
      const day = new Date(y, m, d);
      const cls = ['pp-cal__day'];
      if (+day === +target) cls.push('is-target');
      else if (+day === +today) cls.push('is-today');
      else if (day > lo && day < hi) cls.push('is-span');
      else cls.push('is-out');
      g += '<div class="' + cls.join(' ') + '">' + d + '</div>';
    }
    calEl.innerHTML = '<div class="pp-cal__head"><span>' + toolEscape(start.toLocaleDateString(loc, { month: 'long', year: 'numeric' })) + '</span></div><div class="pp-cal__grid" aria-hidden="true">' + g + '</div>';
    document.querySelectorAll('#dft-presets button').forEach(b => b.classList.toggle('is-active', st.unit === 'days' && +b.dataset.n === st.n));
  }

  // Generated tables, so they never go stale.
  const offsets = $id('dft-offsets');
  if (offsets) {
    const today = today0();
    offsets.innerHTML = offsets.dataset.ns.split(',').map(Number).map(n => {
      const d = addToDate(today, { days: n });
      const href = offsets.dataset.pages.split(',').includes(String(n)) ? '/tools/' + n + '-days-from-today' : '';
      const num = href ? '<a href="' + href + '">' + fmtNum(n) + '</a>' : fmtNum(n);
      return '<tr><td>' + num + '</td><td>' + toolEscape(formatDateLong(d)) + '</td><td>' + fmtNum(weekdaysBetween(today, d)) + '</td></tr>';
    }).join('');
  }
  const months = $id('dft-months');
  if (months) {
    const n = +months.dataset.n, t = today0();
    let rows = '';
    for (let i = 1; i <= 12; i++) {
      const a = new Date(t.getFullYear(), t.getMonth() + i, 1);
      rows += '<tr><td>' + toolEscape(a.toLocaleDateString(loc, { year: 'numeric', month: 'long', day: 'numeric' })) + '</td><td>' + toolEscape(formatDateLong(addToDate(a, { days: n }))) + '</td></tr>';
    }
    months.innerHTML = rows;
  }

  [nEl, unitEl, dirEl].forEach(el => el.addEventListener('input', render));
  [unitEl, dirEl].forEach(el => el.addEventListener('change', render));
  document.querySelectorAll('#dft-presets button').forEach(b => b.addEventListener('click', () => {
    nEl.value = b.dataset.n; unitEl.value = 'days'; render();
  }));

  function shareUrl() {
    const st = state();
    const base = location.origin + location.pathname;
    const p = new URLSearchParams();
    if (st.n !== +root.dataset.n) p.set('n', st.n);
    if (st.unit !== 'days') p.set('unit', st.unit);
    if (st.dir < 0) p.set('dir', 'ago');
    const qs = p.toString();
    return qs ? base + '?' + qs : base;
  }
  const shareBtn = $id('dft-share');
  shareBtn.addEventListener('click', async () => {
    const url = shareUrl();
    try {
      if (navigator.share) { await navigator.share({ title: document.title, text: s('shareText', { what: phrase(state()), date: formatDateLong(target) }), url }); return; }
      await navigator.clipboard.writeText(url);
      const old = shareBtn.textContent;
      shareBtn.textContent = s('copied');
      setTimeout(() => { shareBtn.textContent = old; }, 1800);
    } catch (e) { /* share sheet dismissed */ }
  });

  // An all-day calendar event on the target date.
  $id('dft-ics').addEventListener('click', () => {
    const ymd = d => d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
    const next = new Date(target.getFullYear(), target.getMonth(), target.getDate() + 1);
    const title = phrase(state()).replace(/[,;\\]/g, ' ');
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Left//Days from today//EN', 'BEGIN:VEVENT',
      'UID:' + ymd(target) + '-' + Date.now() + '@getleft.app', 'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, ''),
      'DTSTART;VALUE=DATE:' + ymd(target), 'DTEND;VALUE=DATE:' + ymd(next), 'SUMMARY:' + title, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    a.download = 'date-' + ymd(target) + '.ics';
    document.body.appendChild(a); a.click(); a.remove();
  });

  tickEvery(60000, render);
})();
