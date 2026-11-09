/*
  Life in weeks calculator (/tools/life-in-weeks-calculator).
  Needs tools.js (date helpers, toolT, toolPreview). Everything runs in the
  browser; nothing is stored or sent.
*/
(function () {
  const birthEl = document.getElementById('liw-birth');
  const spanEl = document.getElementById('liw-span');
  const spanOut = document.getElementById('liw-span-out');
  const avgEl = document.getElementById('liw-avg');
  const avgNote = document.getElementById('liw-avg-note');
  const markEl = document.getElementById('liw-mark');
  const markNote = document.getElementById('liw-mark-note');
  const canvas = document.getElementById('liw-canvas');
  const out = {
    lived: document.getElementById('liw-lived'),
    left: document.getElementById('liw-left'),
    pct: document.getElementById('liw-pct'),
    sat: document.getElementById('liw-sat'),
  };

  // WHO Global Health Observatory, life tables for 2019, world: expectation of
  // life at age x (ex), for males and females. Same source as the life
  // expectancy calculator.
  const WHO_AGES = [0, 1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85];
  const WHO_EX = {
    M: [70.86, 72.11, 68.84, 64.11, 59.30, 54.61, 50.01, 45.42, 40.87, 36.38, 31.99, 27.71, 23.60, 19.78, 16.25, 13.01, 10.06, 7.45, 5.23],
    F: [75.94, 77.01, 73.78, 69.03, 64.20, 59.41, 54.65, 49.89, 45.17, 40.49, 35.89, 31.36, 26.99, 22.81, 18.84, 15.12, 11.71, 8.66, 6.03],
  };
  function remaining(sex, age) {
    const ex = WHO_EX[sex];
    const last = WHO_AGES.length - 1;
    if (age >= WHO_AGES[last]) return Math.max(1.5, ex[last] - 0.3 * (age - WHO_AGES[last]));
    let i = 0;
    while (WHO_AGES[i + 1] <= age) i++;
    const t = (age - WHO_AGES[i]) / (WHO_AGES[i + 1] - WHO_AGES[i]);
    return ex[i] + t * (ex[i + 1] - ex[i]);
  }
  // Average lifespan for someone of this age, women and men averaged.
  function averageLifespan(age) {
    const years = age + (remaining('M', age) + remaining('F', age)) / 2;
    return Math.min(100, Math.max(60, Math.round(years)));
  }

  const day = value => {
    if (!value) return null;
    const d = new Date(value + 'T00:00:00');
    return isNaN(d) ? null : d;
  };
  const today = () => startOfDay(new Date());
  const daysBetween = (a, b) => Math.round((startOfDay(b) - startOfDay(a)) / MS_DAY);
  // Birthday `years` after birth (Feb 29 falls back to Feb 28).
  const birthday = (birth, years) => addToDate(birth, { years });

  // Row (whole years of age) and column (week within that year, 0-51) of a date.
  function cellOf(birth, date) {
    const age = ymdBetween(birth, date).years;
    const week = Math.min(51, Math.floor(daysBetween(birthday(birth, age), date) / 7));
    return { row: age, col: week };
  }

  // Saturdays after today, up to (not including) the end date.
  function saturdaysUntil(end) {
    const start = today();
    start.setDate(start.getDate() + 1);
    const n = daysBetween(start, end);
    if (n <= 0) return 0;
    const offset = (6 - start.getDay() + 7) % 7;
    return offset < n ? Math.floor((n - 1 - offset) / 7) + 1 : 0;
  }

  let spanTouched = false;
  let state = null;

  function compute() {
    const birth = day(birthEl.value);
    const now = today();
    if (!birth || birth > now) return null;
    const ageYears = (now - birth) / (365.2425 * MS_DAY);
    const avg = averageLifespan(Math.floor(ageYears));
    if (!spanTouched) spanEl.value = String(avg);
    const span = parseInt(spanEl.value, 10) || avg;
    const end = birthday(birth, span);
    const totalDays = daysBetween(birth, end);
    const livedDays = Math.min(daysBetween(birth, now), totalDays);
    const mark = day(markEl.value);
    return {
      birth, span, avg, end, ageYears,
      livedWeeks: Math.floor(livedDays / 7),
      leftWeeks: Math.max(0, Math.floor(totalDays / 7) - Math.floor(livedDays / 7)),
      pct: Math.min(100, (livedDays / totalDays) * 100),
      saturdays: saturdaysUntil(end),
      now: cellOf(birth, now),
      mark: mark && mark >= birth ? cellOf(birth, mark) : null,
    };
  }

  // Draw the grid: 52 columns, one row per year, decade labels on the left.
  // Lived weeks faint, this week in the accent colour, weeks ahead solid,
  // a marked week ringed.
  function draw(target, s, opt) {
    const { width, height, ink, accent, gutter, font } = opt;
    const ctx = target.getContext('2d');
    const cols = 52;
    const cell = Math.min((width - gutter) / cols, height / s.span);
    const r = cell * 0.34;
    const x0 = gutter + (width - gutter - cell * cols) / 2;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.font = font;
    for (let row = 0; row < s.span; row++) {
      const y = (row + 0.5) * cell;
      if (row % 10 === 0 && gutter) {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = ink;
        ctx.fillText(String(row), x0 - cell * 0.6, y);
      }
      for (let col = 0; col < cols; col++) {
        const lived = row < s.now.row || (row === s.now.row && col < s.now.col);
        const current = row === s.now.row && col === s.now.col;
        ctx.globalAlpha = lived ? 0.2 : 1;
        ctx.fillStyle = current ? accent : ink;
        if (current) ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(x0 + (col + 0.5) * cell, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    if (s.mark && s.mark.row < s.span) {
      ctx.globalAlpha = 1;
      ctx.strokeStyle = accent;
      ctx.lineWidth = Math.max(1, cell * 0.16);
      ctx.beginPath();
      ctx.arc(x0 + (s.mark.col + 0.5) * cell, (s.mark.row + 0.5) * cell, cell * 0.62, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function colors() {
    const root = getComputedStyle(document.documentElement);
    return {
      ink: getComputedStyle(canvas).color || '#0D0D0D',
      accent: (root.getPropertyValue('--accent') || '').trim() || '#FF4F00',
    };
  }

  function drawPage() {
    const width = canvas.clientWidth;
    if (!width || !state) return;
    const gutter = Math.max(18, Math.round(width * 0.05));
    const cell = (width - gutter) / 52;
    const height = Math.ceil(cell * state.span);
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.style.height = height + 'px';
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    const c = colors();
    draw(canvas, state, { width, height, ink: c.ink, accent: c.accent, gutter, font: `600 ${Math.max(9, Math.round(cell * 1.3))}px system-ui, sans-serif` });
  }

  function render() {
    state = compute();
    spanOut.textContent = spanEl.value;
    if (!state) {
      Object.values(out).forEach(el => { el.textContent = '-'; });
      markNote.textContent = '';
      avgNote.hidden = true;
      toolPreview({ lived: 0, total: parseInt(spanEl.value, 10) || 80 });
      canvas.style.height = '0px';
      return;
    }
    avgEl.textContent = String(state.avg);
    avgNote.hidden = spanTouched && state.span !== state.avg;
    out.lived.textContent = fmtNum(state.livedWeeks);
    out.left.textContent = fmtNum(state.leftWeeks);
    out.pct.textContent = state.pct.toFixed(1) + '%';
    out.sat.textContent = fmtNum(state.saturdays);
    markNote.textContent = state.mark ? toolT('life.mark', { age: state.mark.row, week: state.mark.col + 1 }) : '';
    toolPreview({ lived: state.ageYears, total: state.span, weeks: state.leftWeeks });
    drawPage();
  }

  // ── Save as image: a Lock Screen wallpaper (room for the clock at the top)
  // or a square card. Uses the share sheet where it can carry files (so it
  // can go straight to Photos on iPhone), otherwise downloads a PNG.
  function exportImage(kind, btn) {
    if (!state) { birthEl.focus(); return; }
    const W = kind === 'wallpaper' ? 1179 : 1080;
    const H = kind === 'wallpaper' ? 2556 : 1080;
    const img = document.createElement('canvas');
    img.width = W;
    img.height = H;
    const ctx = img.getContext('2d');
    const bg = '#0C0C0E', ink = '#F5F5F5', accent = '#FF4F00';
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    const side = kind === 'wallpaper' ? 110 : 90;
    const top = kind === 'wallpaper' ? 860 : 150;
    const bottom = kind === 'wallpaper' ? 330 : 90;
    const gridW = W - side * 2;
    const cell = Math.min(gridW / 52, (H - top - bottom) / state.span);
    const gridH = cell * state.span;
    const left = (W - cell * 52) / 2;
    ctx.save();
    ctx.translate(left, top);
    draw(img, state, { width: cell * 52, height: gridH, ink, accent, gutter: 0, font: '10px sans-serif' });
    ctx.restore();
    const label = toolPlural('card.weeksLeft', state.leftWeeks);
    ctx.fillStyle = ink;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    const size = kind === 'wallpaper' ? 52 : 46;
    ctx.font = `700 ${size}px -apple-system, system-ui, sans-serif`;
    const textY = kind === 'wallpaper' ? top + gridH + 110 : top - 52;
    ctx.fillText(label, W / 2, textY);
    ctx.globalAlpha = 0.45;
    ctx.font = `600 ${Math.round(size * 0.55)}px -apple-system, system-ui, sans-serif`;
    ctx.fillText('getleft.app', W / 2, kind === 'wallpaper' ? textY + 64 : H - 40);
    ctx.globalAlpha = 1;
    img.toBlob(blob => {
      if (!blob) return;
      const name = kind === 'wallpaper' ? 'life-in-weeks-wallpaper.png' : 'life-in-weeks.png';
      const file = typeof File === 'function' ? new File([blob], name, { type: 'image/png' }) : null;
      toolTrack('share_click', { method: 'image_' + kind });
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file] }).catch(() => {});
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    }, 'image/png');
  }

  // Default: someone born 30 years ago today, so the grid shows at once.
  const def = today();
  def.setFullYear(def.getFullYear() - 30);
  birthEl.value = toLocalDateInput(def);
  birthEl.max = toLocalDateInput(today());

  birthEl.addEventListener('input', render);
  birthEl.addEventListener('change', render);
  spanEl.addEventListener('input', () => { spanTouched = true; render(); });
  markEl.addEventListener('input', render);
  markEl.addEventListener('change', render);
  document.getElementById('liw-save-wallpaper').addEventListener('click', e => exportImage('wallpaper', e.currentTarget));
  document.getElementById('liw-save-square').addEventListener('click', e => exportImage('square', e.currentTarget));
  window.addEventListener('resize', drawPage, { passive: true });
  if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    if (mq.addEventListener) mq.addEventListener('change', drawPage);
  }
  render();
})();
