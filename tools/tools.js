/*
  Left - shared helpers for /tools/* pages.
  Pure functions + tiny render helpers. No deps.
*/

const MS_DAY = 86400000;
const MS_HOUR = 3600000;
const MS_MIN = 60000;

/* ─────────── Date math ─────────── */

function startOfDay(d) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function startOfYear(d) { return new Date(d.getFullYear(), 0, 1); }
function endOfYear(d)   { return new Date(d.getFullYear() + 1, 0, 1); }
function isLeap(y) { return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0); }
function daysInYear(y) { return isLeap(y) ? 366 : 365; }

function diffMs(a, b) { return Math.max(0, b.getTime() - a.getTime()); }

// Break a positive ms duration into months/weeks/days/hours/minutes/seconds.
// Months and weeks are approximations (no calendar walk).
function breakdown(ms) {
  const totalSec  = Math.floor(ms / 1000);
  const totalMin  = Math.floor(ms / MS_MIN);
  const totalHour = Math.floor(ms / MS_HOUR);
  const totalDay  = Math.floor(ms / MS_DAY);
  const totalWeek = Math.floor(totalDay / 7);
  const totalMonth = Math.floor(totalDay / 30.4375);
  // For the "all units" view: cascading remainders (D / H / M / S)
  const days = totalDay;
  const hours = Math.floor((ms - days * MS_DAY) / MS_HOUR);
  const minutes = Math.floor((ms - days * MS_DAY - hours * MS_HOUR) / MS_MIN);
  const seconds = Math.floor((ms - days * MS_DAY - hours * MS_HOUR - minutes * MS_MIN) / 1000);
  return {
    totalMonth, totalWeek, totalDay, totalHour, totalMin, totalSec,
    days, hours, minutes, seconds,
  };
}

// Calendar-aware month difference (full months between two dates).
function monthsBetween(a, b) {
  let months = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
  if (b.getDate() < a.getDate()) months -= 1;
  return Math.max(0, months);
}

// Years/months/days between two dates (used by age + pregnancy).
function ymdBetween(a, b) {
  let years = b.getFullYear() - a.getFullYear();
  let months = b.getMonth() - a.getMonth();
  let days = b.getDate() - a.getDate();
  if (days < 0) {
    months -= 1;
    const prev = new Date(b.getFullYear(), b.getMonth(), 0);
    days += prev.getDate();
  }
  if (months < 0) { years -= 1; months += 12; }
  return { years: Math.max(0, years), months: Math.max(0, months), days: Math.max(0, days) };
}

// Add years/months/weeks/days/hours/minutes to a date. Negative subtracts.
function addToDate(date, { years = 0, months = 0, weeks = 0, days = 0, hours = 0, minutes = 0 }) {
  const x = new Date(date);
  if (years)   x.setFullYear(x.getFullYear() + years);
  if (months)  x.setMonth(x.getMonth() + months);
  if (weeks || days) x.setDate(x.getDate() + weeks * 7 + days);
  if (hours)   x.setHours(x.getHours() + hours);
  if (minutes) x.setMinutes(x.getMinutes() + minutes);
  return x;
}

// ISO 8601 week number for a given date.
function isoWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / MS_DAY + 1) / 7);
  return { week: weekNo, year: d.getUTCFullYear() };
}

// Business days between two dates (Mon–Fri, inclusive of neither endpoint by default).
function businessDaysBetween(a, b) {
  if (b < a) [a, b] = [b, a];
  const start = startOfDay(a);
  const end = startOfDay(b);
  let count = 0;
  const cur = new Date(start);
  while (cur < end) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

/* ─────────── Easter (Anonymous Gregorian / Meeus–Jones–Butcher) ─────────── */

function easterDate(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function nextEaster(from = new Date()) {
  const e = easterDate(from.getFullYear());
  return e > from ? e : easterDate(from.getFullYear() + 1);
}

// Julian (Orthodox) Easter via Meeus algorithm.
function orthodoxEasterDate(year) {
  const a = year % 4, b = year % 7, c = year % 19;
  const d = (19 * c + 15) % 30;
  const e = (2 * a + 4 * b - d + 34) % 7;
  const month = Math.floor((d + e + 114) / 31);
  const day = ((d + e + 114) % 31) + 1;
  // Convert Julian → Gregorian (add 13 days for 1900–2099).
  return new Date(year, month - 1, day + 13);
}

/* ─────────── Seasons (Northern Hemisphere astronomical dates) ─────────── */

// Precomputed UTC dates 2024–2035. Southern = +6 months from northern.
const SEASONS_N = {
  2024: { spring: '2024-03-20', summer: '2024-06-20', fall: '2024-09-22', winter: '2024-12-21' },
  2025: { spring: '2025-03-20', summer: '2025-06-21', fall: '2025-09-22', winter: '2025-12-21' },
  2026: { spring: '2026-03-20', summer: '2026-06-21', fall: '2026-09-23', winter: '2026-12-21' },
  2027: { spring: '2027-03-20', summer: '2027-06-21', fall: '2027-09-23', winter: '2027-12-22' },
  2028: { spring: '2028-03-20', summer: '2028-06-20', fall: '2028-09-22', winter: '2028-12-21' },
  2029: { spring: '2029-03-20', summer: '2029-06-21', fall: '2029-09-22', winter: '2029-12-21' },
  2030: { spring: '2030-03-20', summer: '2030-06-21', fall: '2030-09-22', winter: '2030-12-21' },
  2031: { spring: '2031-03-20', summer: '2031-06-21', fall: '2031-09-23', winter: '2031-12-22' },
  2032: { spring: '2032-03-20', summer: '2032-06-20', fall: '2032-09-22', winter: '2032-12-21' },
  2033: { spring: '2033-03-20', summer: '2033-06-21', fall: '2033-09-22', winter: '2033-12-21' },
  2034: { spring: '2034-03-20', summer: '2034-06-21', fall: '2034-09-22', winter: '2034-12-21' },
  2035: { spring: '2035-03-20', summer: '2035-06-21', fall: '2035-09-23', winter: '2035-12-22' },
};

// season ∈ 'spring' | 'summer' | 'fall' | 'winter'; hemi ∈ 'N' | 'S'
function nextSeasonDate(season, hemi = 'N', from = new Date()) {
  // For Southern Hemisphere: spring/fall and summer/winter are reversed.
  const flip = { spring: 'fall', fall: 'spring', summer: 'winter', winter: 'summer' };
  const lookupSeason = hemi === 'S' ? flip[season] : season;
  let year = from.getFullYear();
  while (year <= 2035) {
    const iso = SEASONS_N[year] && SEASONS_N[year][lookupSeason];
    if (iso) {
      const d = new Date(iso + 'T00:00:00');
      if (d > from) return d;
    }
    year++;
  }
  return null;
}

function guessHemisphere() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    // Crude: anything south of equator we know about.
    const south = /Australia|New_Zealand|Pacific\/Auckland|Pacific\/Fiji|Africa\/Johannesburg|America\/Argentina|America\/Buenos_Aires|America\/Santiago|America\/Sao_Paulo|America\/Montevideo|America\/Lima|America\/La_Paz/.test(tz);
    return south ? 'S' : 'N';
  } catch { return 'N'; }
}

/* ─────────── Specific upcoming dates ─────────── */

function nextChristmas(from = new Date()) {
  const y = from.getFullYear();
  const d = new Date(y, 11, 25, 0, 0, 0);
  return d > from ? d : new Date(y + 1, 11, 25);
}
function nextNewYear(from = new Date()) {
  return new Date(from.getFullYear() + 1, 0, 1, 0, 0, 0);
}
function nextHalloween(from = new Date()) {
  const y = from.getFullYear();
  const d = new Date(y, 9, 31, 0, 0, 0);
  return d > from ? d : new Date(y + 1, 9, 31);
}
function nextValentines(from = new Date()) {
  const y = from.getFullYear();
  const d = new Date(y, 1, 14, 0, 0, 0);
  return d > from ? d : new Date(y + 1, 1, 14);
}
// US Thanksgiving: 4th Thursday of November.
function thanksgivingDate(year) {
  const nov1 = new Date(year, 10, 1);
  const firstThu = 1 + ((4 - nov1.getDay() + 7) % 7);
  return new Date(year, 10, firstThu + 21);
}
function nextThanksgiving(from = new Date()) {
  const d = thanksgivingDate(from.getFullYear());
  return d > from ? d : thanksgivingDate(from.getFullYear() + 1);
}
// US Mother's Day: 2nd Sunday of May.
function mothersDayDate(year) {
  const may1 = new Date(year, 4, 1);
  const firstSun = 1 + ((7 - may1.getDay()) % 7);
  return new Date(year, 4, firstSun + 7);
}
function nextMothersDay(from = new Date()) {
  const d = mothersDayDate(from.getFullYear());
  return d > from ? d : mothersDayDate(from.getFullYear() + 1);
}
// US Father's Day: 3rd Sunday of June.
function fathersDayDate(year) {
  const jun1 = new Date(year, 5, 1);
  const firstSun = 1 + ((7 - jun1.getDay()) % 7);
  return new Date(year, 5, firstSun + 14);
}
function nextFathersDay(from = new Date()) {
  const d = fathersDayDate(from.getFullYear());
  return d > from ? d : fathersDayDate(from.getFullYear() + 1);
}
function nextWeekend(from = new Date()) {
  // "Weekend" = Saturday 00:00 local
  const x = new Date(from);
  const day = x.getDay();
  const daysUntilSat = (6 - day + 7) % 7 || 7;
  x.setDate(x.getDate() + daysUntilSat);
  x.setHours(0, 0, 0, 0);
  return x;
}

/* ─────────── Formatters ─────────── */

const pad = n => String(n).padStart(2, '0');
const fmtNum = n => n.toLocaleString();

function formatDateLong(d) {
  return d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
function formatDateShort(d) {
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}
function formatDateTime(d) {
  return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

/* ─────────── Tiny DOM helpers ─────────── */

function $(sel, root = document) { return root.querySelector(sel); }
function $$(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

// Local-datetime <input type="datetime-local"> value (YYYY-MM-DDTHH:mm).
function toLocalInput(d) {
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function toLocalDateInput(d) {
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}

// Render a countdown into a target element using a unit selector.
// units: 'all' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds'
function renderCountdown(target, ms, units = 'all') {
  if (!target) return;
  if (ms <= 0) { target.innerHTML = `<div class="tool-result-big">It's here.</div>`; return; }
  const b = breakdown(ms);
  if (units === 'all') {
    target.innerHTML = `
      <div class="tool-stat-row">
        <div class="tool-stat"><div class="tool-stat-num">${fmtNum(b.days)}</div><div class="tool-stat-label">days</div></div>
        <div class="tool-stat"><div class="tool-stat-num">${pad(b.hours)}</div><div class="tool-stat-label">hours</div></div>
        <div class="tool-stat"><div class="tool-stat-num">${pad(b.minutes)}</div><div class="tool-stat-label">min</div></div>
        <div class="tool-stat"><div class="tool-stat-num">${pad(b.seconds)}</div><div class="tool-stat-label">sec</div></div>
      </div>`;
    return;
  }
  const map = {
    months: [b.totalMonth, 'months'],
    weeks:  [b.totalWeek,  'weeks'],
    days:   [b.totalDay,   'days'],
    hours:  [b.totalHour,  'hours'],
    minutes:[b.totalMin,   'minutes'],
    seconds:[b.totalSec,   'seconds'],
  };
  const [n, label] = map[units] || map.days;
  target.innerHTML = `<div class="tool-result-big">${fmtNum(n)} <span class="tool-result-unit">${label}</span></div>`;
}

// Keep an interval-driven render going. Returns a cancel fn.
function tickEvery(intervalMs, fn) {
  fn();
  const id = setInterval(fn, intervalMs);
  return () => clearInterval(id);
}

// Build a Tools index card link.
function relatedToolsCard(items) {
  return items.map(it => `<a class="tool-related-item" href="/tools/${it.slug}">${it.title}</a>`).join('');
}
