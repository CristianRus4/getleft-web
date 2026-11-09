/*
  Left - helpers for the seasonal countdown pages (New Year's Eve, Hanukkah,
  Diwali, US holidays…). Loaded after /tools/tools.js, which provides the date
  maths, formatting and translated runtime strings.

  Page-specific sentences live in the page itself, inside
  <div hidden class="sx-strings"><span data-sx="key">Text with {vars}</span></div>,
  so they are translated with the rest of the page's catalog.
*/

/* ─────────── Strings ─────────── */

function sxText(key, vars) {
  const el = document.querySelector('.sx-strings [data-sx="' + key + '"]');
  return toolInterpolate(el ? el.textContent.trim() : key, vars);
}

/* ─────────── Time zones ─────────── */

// Offset of `tz` from UTC at instant `ts`, in ms.
function sxZoneOffset(ts, tz) {
  const parts = {};
  for (const p of new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
  }).formatToParts(new Date(ts))) parts[p.type] = p.value;
  const asUtc = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour % 24, +parts.minute, +parts.second);
  return asUtc - Math.floor(ts / 1000) * 1000;
}

// The instant of wall-clock y-m-d h:mi in `tz` (m is 0-based). Handles DST.
function sxZonedDate(y, m, d, h = 0, mi = 0, tz) {
  if (!tz) return new Date(y, m, d, h, mi, 0, 0);
  const guess = Date.UTC(y, m, d, h, mi);
  let ts = guess - sxZoneOffset(guess, tz);
  const again = guess - sxZoneOffset(ts, tz);
  if (again !== ts) ts = again;
  return new Date(ts);
}

// Calendar year, month (0-based) and day of `date` in `tz`.
function sxZonedParts(date, tz) {
  const parts = {};
  for (const p of new Intl.DateTimeFormat('en-US', { timeZone: tz || undefined, year: 'numeric', month: 'numeric', day: 'numeric' })
    .formatToParts(date)) parts[p.type] = p.value;
  return { year: +parts.year, month: +parts.month - 1, day: +parts.day };
}

function sxLocalZone() {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; } catch { return 'UTC'; }
}

// "Region/City_Name" → "City Name (Region)".
function sxZoneLabel(tz) {
  const bits = tz.split('/');
  if (bits.length < 2) return tz.replace(/_/g, ' ');
  return bits.slice(1).join(' / ').replace(/_/g, ' ') + ' (' + bits[0].replace(/_/g, ' ') + ')';
}

// Fill a <select> with every IANA zone, selecting the visitor's own.
function sxZoneSelect(select, current) {
  let zones = [];
  try { zones = Intl.supportedValuesOf('timeZone'); } catch { zones = []; }
  if (current && !zones.includes(current)) zones.unshift(current);
  if (!zones.length) zones = [current || 'UTC'];
  const frag = document.createDocumentFragment();
  zones.map(z => [sxZoneLabel(z), z]).sort((a, b) => a[0].localeCompare(b[0])).forEach(([label, z]) => {
    const o = document.createElement('option');
    o.value = z; o.textContent = label;
    if (z === current) o.selected = true;
    frag.appendChild(o);
  });
  select.textContent = '';
  select.appendChild(frag);
}

/* ─────────── Formatting ─────────── */

function sxFormat(date, opts, tz) {
  return date.toLocaleString(toolFormatLocale(), Object.assign({}, opts, tz ? { timeZone: tz } : {}));
}
function sxDateLong(date, tz) { return sxFormat(date, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }, tz); }
function sxDateShort(date, tz) { return sxFormat(date, { month: 'short', day: 'numeric' }, tz); }
function sxDate(date, tz) { return sxFormat(date, { year: 'numeric', month: 'long', day: 'numeric' }, tz); }
function sxWeekday(date, tz) { return sxFormat(date, { weekday: 'long' }, tz); }
function sxTime(date, tz) { return sxFormat(date, { weekday: 'short', hour: '2-digit', minute: '2-digit' }, tz); }

// Compact duration: "51 days, 04:12:33" style via the shared unit strings.
function sxDuration(ms) {
  const b = breakdown(Math.max(0, ms));
  const clock = pad(b.hours) + ':' + pad(b.minutes) + ':' + pad(b.seconds);
  return b.days > 0 ? fmtNum(b.days) + ' ' + toolPlural('unit.days', b.days) + ', ' + clock : clock;
}

// Whole calendar days from today to `date` (both at local midnight).
function sxDaysAway(date, from = new Date()) {
  const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const b = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.round((b - a) / MS_DAY);
}

/* ─────────── Unit pills ─────────── */

// Wire a .tool-units group. Returns a getter for the active unit; calls onChange on click.
function sxUnits(group, onChange) {
  let unit = (group.querySelector('.is-active') || {}).dataset?.unit || 'all';
  group.addEventListener('click', e => {
    const b = e.target.closest('button[data-unit]');
    if (!b) return;
    group.querySelectorAll('button').forEach(x => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    unit = b.dataset.unit;
    if (onChange) onChange(unit);
  });
  return () => unit;
}

/* ─────────── Year table ─────────── */

// Replace a <tbody>'s rows. `rows` is an array of arrays of cell text.
function sxFillTable(tbody, rows) {
  if (!tbody) return;
  const frag = document.createDocumentFragment();
  for (const cells of rows) {
    const tr = document.createElement('tr');
    for (const c of cells) { const td = document.createElement('td'); td.textContent = c; tr.appendChild(td); }
    frag.appendChild(tr);
  }
  tbody.textContent = '';
  tbody.appendChild(frag);
}

/* ─────────── Widget preview ─────────── */

// Fill the .sx-preview card next to the result button with the same whole
// days as the big counter (hours on the last day).
function sxPreview(root, ms, dateText) {
  if (!root) return;
  const b = breakdown(Math.max(0, ms));
  const useHours = b.totalDay < 1;
  const n = useHours ? b.totalHour : b.totalDay;
  const num = root.querySelector('[data-sx-num]');
  const unit = root.querySelector('[data-sx-unit]');
  const date = root.querySelector('[data-sx-date]');
  if (num) num.textContent = fmtNum(n);
  if (unit) unit.textContent = toolPlural(useHours ? 'unit.hours' : 'unit.days', n);
  if (date && dateText) date.textContent = dateText;
  root.classList.toggle('is-long', n >= 100);
}

/* ─────────── Share ─────────── */

function sxShare(button) {
  if (!button) return;
  const label = button;
  const original = label.textContent;
  button.addEventListener('click', async () => {
    const url = location.origin + location.pathname;
    const title = document.title.replace(/\s*\|\s*Left\s*$/, '');
    let method = 'copy';
    try {
      if (navigator.share) { method = 'share'; await navigator.share({ title, url }); }
      else await navigator.clipboard.writeText(url);
    } catch (e) {
      if (e && e.name === 'AbortError') return;
      try { await navigator.clipboard.writeText(url); method = 'copy'; } catch { return; }
    }
    if (typeof window.gtag === 'function') window.gtag('event', 'share_click', { method, page_path: location.pathname });
    if (method === 'copy') {
      label.textContent = sxText('copied');
      setTimeout(() => { label.textContent = original; }, 2000);
    }
  });
}
