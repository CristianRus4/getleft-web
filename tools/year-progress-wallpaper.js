// Year progress wallpaper maker for /tools/year-progress-wallpaper. Needs /tools/tools.js first.
// Draws the year (dots, month bars or a ring) on a canvas at the phone's exact size and saves it as PNG.
// Strings come from the hidden #ypw-strings block, so the build translates them.
(function () {
  const $id = id => document.getElementById(id);
  const strEl = $id('ypw-strings');
  const s = (key, vars) => {
    const el = strEl && strEl.querySelector('[data-s="' + key + '"]');
    return toolInterpolate(el ? el.textContent.trim() : key, vars);
  };
  const canvas = $id('ypw-canvas');
  const ctx = canvas.getContext('2d');
  const yearEl = $id('ypw-year'), deviceEl = $id('ypw-device'), customColor = $id('ypw-custom');
  const loc = toolFormatLocale();
  const FONT = 'system-ui, -apple-system, "SF Pro Display", "Helvetica Neue", Arial, sans-serif';
  const COLORS = ['#ff4f00', '#ffb300', '#34c759', '#0a84ff', '#bf5af2', '#ff375f'];
  const state = { style: 'dots', color: COLORS[0], bg: 'dark', text: true };

  const now0 = new Date();
  for (let y = now0.getFullYear(); y <= now0.getFullYear() + 1; y++) yearEl.add(new Option(y, y));

  // Pick the visitor's own iPhone when the screen matches a preset.
  const px = [Math.round(screen.width * devicePixelRatio), Math.round(screen.height * devicePixelRatio)].sort((a, b) => a - b).join('x');
  const match = [...deviceEl.options].find(o => o.value === px);
  if (match) deviceEl.value = match.value;

  // Settings from a shared link.
  const q = new URLSearchParams(location.search);
  if (['dots', 'bars', 'ring'].includes(q.get('style'))) state.style = q.get('style');
  if (/^[0-9a-f]{6}$/i.test(q.get('color') || '')) state.color = '#' + q.get('color').toLowerCase();
  if (q.get('bg') === 'light') state.bg = 'light';
  if (q.get('text') === '0') state.text = false;
  if ([...yearEl.options].some(o => o.value === q.get('y'))) yearEl.value = q.get('y');
  if ([...deviceEl.options].some(o => o.value === q.get('d'))) deviceEl.value = q.get('d');

  const swatches = $id('ypw-colors');
  COLORS.forEach(c => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'ypw-swatch'; b.style.setProperty('--c', c); b.dataset.c = c;
    b.setAttribute('aria-label', c);
    b.addEventListener('click', () => { state.color = c; draw(); });
    swatches.insertBefore(b, swatches.lastElementChild);
  });
  customColor.addEventListener('input', () => { state.color = customColor.value; draw(); });
  document.querySelectorAll('[data-ypw]').forEach(group => {
    group.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      const key = group.dataset.ypw;
      state[key] = key === 'text' ? b.dataset.v === '1' : b.dataset.v;
      draw();
    }));
  });
  [yearEl, deviceEl].forEach(el => el.addEventListener('change', draw));

  function yearInfo() {
    const y = +yearEl.value, now = new Date();
    const total = isLeap(y) ? 366 : 365;
    const start = new Date(y, 0, 1);
    let passed; // whole days before today in that year
    if (now.getFullYear() < y) passed = 0;
    else if (now.getFullYear() > y) passed = total;
    else passed = Math.round((new Date(now.getFullYear(), now.getMonth(), now.getDate()) - start) / 864e5);
    const isNow = now.getFullYear() === y;
    return { y, total, passed, left: total - passed - (isNow ? 1 : 0), isNow };
  }

  function draw() {
    const [w, h] = deviceEl.value.split('x').map(Number);
    canvas.width = w; canvas.height = h;
    const frame = $id('ypw-phone');
    frame.style.aspectRatio = w + ' / ' + h;
    const dark = state.bg === 'dark';
    const fg = dark ? '#ffffff' : '#111111';
    ctx.fillStyle = dark ? '#000000' : '#f4f2ee';
    ctx.fillRect(0, 0, w, h);
    const info = yearInfo();
    const u = w / 100; // 1% of the width
    // iOS keeps the top third for the clock and the bottom for the torch and camera buttons.
    const top = h * 0.36, bottom = h * (state.text ? 0.80 : 0.86), left = u * 9, right = w - u * 9;
    const faded = dark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.14)';

    if (state.style === 'dots') {
      const n = info.total, aw = right - left, ah = bottom - top;
      let cols = Math.max(7, Math.round(Math.sqrt(n * aw / ah)));
      let rows = Math.ceil(n / cols);
      const cell = Math.min(aw / cols, ah / rows);
      const r = cell * 0.34;
      const gx = left + (aw - cell * cols) / 2, gy = top + (ah - cell * rows) / 2;
      for (let i = 0; i < n; i++) {
        const cx = gx + (i % cols + 0.5) * cell, cy = gy + (Math.floor(i / cols) + 0.5) * cell;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = i < info.passed ? faded : (info.isNow && i === info.passed ? fg : state.color);
        ctx.fill();
      }
    } else if (state.style === 'bars') {
      const aw = right - left, ah = bottom - top;
      const gap = ah / 12 * 0.3, bh = ah / 12 - gap;
      const labelW = u * 15;
      ctx.font = "600 " + Math.round(bh * 0.78) + 'px ' + FONT;
      ctx.textBaseline = 'middle';
      for (let m = 0; m < 12; m++) {
        const y0 = top + m * (bh + gap) + gap / 2;
        const dim = new Date(info.y, m + 1, 0).getDate();
        const first = Math.round((new Date(info.y, m, 1) - new Date(info.y, 0, 1)) / 864e5);
        const gone = Math.min(dim, Math.max(0, info.passed - first));
        const x0 = left + labelW, bw = aw - labelW;
        ctx.fillStyle = gone >= dim ? faded : fg;
        ctx.fillText(new Date(2001, m, 1).toLocaleDateString(loc, { month: 'short' }).replace('.', ''), left, y0 + bh / 2);
        roundRect(x0, y0, bw, bh, bh / 2, faded);
        if (gone < dim) {
          // The part of the month still ahead, in the accent colour.
          ctx.save();
          clipRound(x0, y0, bw, bh, bh / 2);
          ctx.fillStyle = state.color;
          ctx.fillRect(x0 + bw * gone / dim, y0, bw * (1 - gone / dim), bh);
          ctx.restore();
        }
      }
    } else {
      const cx = w / 2, cy = (top + bottom) / 2, rad = Math.min(right - left, bottom - top) / 2 * 0.92, lw = rad * 0.16;
      ctx.lineCap = 'round';
      ctx.lineWidth = lw;
      ctx.strokeStyle = faded;
      ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.stroke();
      const frac = (info.total - info.passed) / info.total;
      if (frac > 0) {
        ctx.strokeStyle = state.color;
        ctx.beginPath(); ctx.arc(cx, cy, rad, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac); ctx.stroke();
      }
      ctx.fillStyle = fg;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = '700 ' + Math.round(rad * 0.42) + 'px ' + FONT;
      ctx.fillText(String(info.y), cx, cy);
      ctx.textAlign = 'start';
    }

    if (state.text) {
      const pct = new Intl.NumberFormat(loc, { style: 'percent', maximumFractionDigits: 0 }).format((info.total - info.passed) / info.total);
      const amount = info.isNow ? fmtNum(info.left) + ' ' + toolPlural('unit.days', info.left) : pct;
      ctx.fillStyle = fg; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
      ctx.font = '700 ' + Math.round(u * 5.4) + 'px ' + FONT;
      ctx.fillText(s('left', { amount }), w / 2, h * 0.86);
      ctx.fillStyle = dark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.5)';
      ctx.font = '500 ' + Math.round(u * 3.8) + 'px ' + FONT;
      const sub = info.isNow ? (state.style === 'ring' ? pct : info.y + ' · ' + pct) : (state.style === 'ring' ? '' : String(info.y));
      if (sub) ctx.fillText(sub, w / 2, h * 0.86 + u * 6.4);
      ctx.textAlign = 'start';
    }

    // Lock Screen clock in the preview only (not in the saved image).
    const d = new Date();
    $id('ypw-clock-date').textContent = d.toLocaleDateString(loc, { weekday: 'long', month: 'long', day: 'numeric' });
    $id('ypw-clock-time').textContent = d.toLocaleTimeString(loc, { hour: 'numeric', minute: '2-digit' }).replace(/\s?[AP]M$/i, '');
    frame.classList.toggle('is-light', !dark);
    document.querySelectorAll('[data-ypw]').forEach(g => g.querySelectorAll('button').forEach(b => {
      const key = g.dataset.ypw;
      b.classList.toggle('is-active', key === 'text' ? (b.dataset.v === '1') === state.text : b.dataset.v === state[key]);
    }));
    swatches.querySelectorAll('.ypw-swatch').forEach(b => b.classList.toggle('is-active', b.dataset.c === state.color));
  }
  function roundRect(x, y, w, h, r, fill) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fillStyle = fill; ctx.fill(); }
  function clipRound(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.clip(); }

  const fileName = () => 'year-progress-' + yearEl.value + '-' + toLocalDateInput(new Date()) + '.png';
  $id('ypw-save').addEventListener('click', () => {
    canvas.toBlob(async blob => {
      const file = new File([blob], fileName(), { type: 'image/png' });
      try {
        // iPhone: the share sheet has Save Image, which puts it in Photos.
        if (navigator.canShare && navigator.canShare({ files: [file] }) && /iPhone|iPad|Android/i.test(navigator.userAgent)) {
          await navigator.share({ files: [file] });
          return;
        }
      } catch (e) { if (e && e.name === 'AbortError') return; }
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = fileName();
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    }, 'image/png');
  });

  const shareBtn = $id('ypw-share');
  shareBtn.addEventListener('click', async () => {
    const p = new URLSearchParams();
    if (state.style !== 'dots') p.set('style', state.style);
    if (state.color !== COLORS[0]) p.set('color', state.color.slice(1));
    if (state.bg !== 'dark') p.set('bg', state.bg);
    if (!state.text) p.set('text', '0');
    if (+yearEl.value !== new Date().getFullYear()) p.set('y', yearEl.value);
    const url = location.origin + location.pathname + (p.toString() ? '?' + p : '');
    try {
      if (navigator.share) { await navigator.share({ title: document.title, url }); return; }
      await navigator.clipboard.writeText(url);
      const old = shareBtn.textContent;
      shareBtn.textContent = s('copied');
      setTimeout(() => { shareBtn.textContent = old; }, 1800);
    } catch (e) { /* share sheet dismissed */ }
  });

  draw();
  // Redraw after midnight so the preview never shows yesterday.
  tickEvery(60000, draw);
})();
