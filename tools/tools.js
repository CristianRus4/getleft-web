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
  // Whole months are added to `a` with end-of-month clamping (Jan 31 + 1 month = Feb 28), then the remaining days are counted.
  const clamped = (n) => {
    const t = a.getFullYear() * 12 + a.getMonth() + n;
    const y = Math.floor(t / 12), m = t - y * 12;
    return Date.UTC(y, m, Math.min(a.getDate(), new Date(y, m + 1, 0).getDate()));
  };
  const end = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  let total = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
  if (total < 0) return { years: 0, months: 0, days: 0 };
  if (clamped(total) > end) total -= 1;
  if (total < 0) return { years: 0, months: 0, days: 0 };
  const days = Math.round((end - clamped(total)) / 86400000);
  return { years: Math.floor(total / 12), months: total % 12, days };
}

// Add years/months/weeks/days/hours/minutes to a date. Negative subtracts.
function addToDate(date, { years = 0, months = 0, weeks = 0, days = 0, hours = 0, minutes = 0 }) {
  const x = new Date(date);
  // Years and months clamp to the end of the target month: Jan 31 + 1 month is Feb 28 (or 29), not Mar 3.
  const addMonths = (n) => {
    const day = x.getDate();
    x.setDate(1);
    x.setMonth(x.getMonth() + n);
    x.setDate(Math.min(day, new Date(x.getFullYear(), x.getMonth() + 1, 0).getDate()));
  };
  if (years || months) addMonths(years * 12 + months);
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
  const event = { spring: 'march', summer: 'june', fall: 'september', winter: 'december' }[lookupSeason];
  for (let year = from.getFullYear(); year <= from.getFullYear() + 1; year++) {
    let iso = SEASONS_N[year] && SEASONS_N[year][lookupSeason];
    // After the table ends, the UTC date of the computed moment.
    if (!iso) { const t = seasonInstant(year, event); iso = t && t.toISOString().slice(0, 10); }
    if (iso) {
      const d = new Date(iso + 'T00:00:00');
      if (d > from) return d;
    }
  }
  return null;
}

// Exact moment of an equinox or solstice, any year 1000-3000, as a Date (UTC
// instant). event: 'march' | 'june' | 'september' | 'december'. Our own
// implementation of the method in Jean Meeus, Astronomical Algorithms (2nd ed.),
// chapter 27: a mean instant from a polynomial, corrected by 24 periodic terms.
// Good to about a minute for the years people ask about.
const SEASON_TERMS = [
  [485, 324.96, 1934.136], [203, 337.23, 32964.467], [199, 342.08, 20.186], [182, 27.85, 445267.112],
  [156, 73.14, 45036.886], [136, 171.52, 22518.443], [77, 222.54, 65928.934], [74, 296.72, 3034.906],
  [70, 243.58, 9037.513], [58, 119.81, 33718.147], [52, 297.17, 150.678], [50, 21.02, 2281.226],
  [45, 247.54, 29929.562], [44, 325.15, 31555.956], [29, 60.93, 4443.417], [18, 155.12, 67555.328],
  [17, 288.79, 4562.452], [16, 198.04, 62894.029], [14, 199.76, 31436.921], [12, 95.39, 14577.848],
  [12, 287.11, 31931.756], [12, 320.81, 34777.259], [9, 227.73, 1222.114], [8, 15.45, 16859.074],
];
const SEASON_MEAN = {
  march:     [2451623.80984, 365242.37404, 0.05169, -0.00411, -0.00057],
  june:      [2451716.56767, 365241.62603, 0.00325, 0.00888, -0.00030],
  september: [2451810.21715, 365242.01767, -0.11575, 0.00337, 0.00078],
  december:  [2451900.05952, 365242.74049, -0.06223, -0.00823, 0.00032],
};
function seasonInstant(year, event) {
  const c = SEASON_MEAN[event];
  if (!c) return null;
  const Y = (year - 2000) / 1000;
  const jde0 = c[0] + c[1] * Y + c[2] * Y * Y + c[3] * Y ** 3 + c[4] * Y ** 4;
  const T = (jde0 - 2451545.0) / 36525;
  const rad = Math.PI / 180;
  const W = (35999.373 * T - 2.47) * rad;
  const dl = 1 + 0.0334 * Math.cos(W) + 0.0007 * Math.cos(2 * W);
  let S = 0;
  for (const [A, B, C] of SEASON_TERMS) S += A * Math.cos((B + C * T) * rad);
  const jde = jde0 + 0.00001 * S / dl; // Terrestrial Time
  // Universal Time: subtract delta T (Espenak and Meeus polynomial for 2005-2050,
  // held near today's ~69 s outside that range; seconds do not change the minute shown).
  const t = Math.min(Math.max(year, 2005), 2050) - 2000;
  const deltaT = Math.min(62.92 + 0.32217 * t + 0.005589 * t * t, 69 + 0.7 * Math.max(0, year - 2026)) ;
  return new Date(Math.round((jde - 2440587.5) * MS_DAY - deltaT * 1000));
}

// Next start of `season` for a hemisphere as the exact astronomical moment.
function nextSeasonInstant(season, hemi = 'N', from = new Date()) {
  const north = { spring: 'march', summer: 'june', fall: 'september', winter: 'december' };
  const south = { spring: 'september', summer: 'december', fall: 'march', winter: 'june' };
  const event = (hemi === 'S' ? south : north)[season];
  if (!event) return null;
  for (let y = from.getFullYear() - 1; y <= from.getFullYear() + 1; y++) {
    const d = seasonInstant(y, event);
    if (d > from) return d;
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

/* ─────────── Localization ─────────── */

// English source strings. Translated pages get window.LEFT_TOOL_I18N (same
// shape, injected by the build before this script); any key missing there
// falls back to these. Must stay identical to i18n/tools-runtime/en.json.
// Plural entries are objects keyed by Intl.PluralRules category.
const LEFT_TOOL_STRINGS_EN = {
  result: {
    arrived: 'It\'s here.',
    notYet: 'Not yet',
    futureDate: 'That date is in the future.',
    datePassed: 'That date has passed.',
    selectDate: 'Select a valid date.',
    selectBoth: 'Select both dates.',
    chooseTarget: 'Choose a target date above.',
    deadlinePassed: 'Deadline passed',
    pastDue: 'Past due',
    deadlineUrgent: 'Urgent deadline',
    deadlineSoon: 'Coming up soon',
    deadlineAhead: 'Deadline ahead',
    fastComplete: 'Fast complete!',
    weddingArrived: 'The date has arrived',
    weekend: 'Weekend!',
    itsWeekend: 'It\'s the weekend! Enjoy it.',
    workdayEnded: 'Workday ended',
    workdayEndedHint: 'Set a later time to count down again.',
    upcoming: 'Upcoming: {dates}',
    since: 'Since {date}',
    fastEnds: 'Fast ends: {date}',
    sinceJan1: 'Since January 1, {year} at midnight',
    untilDec31: 'Until midnight on December 31, {year}',
    fiscalEnds: 'Fiscal year ends {date}',
    quarterEnds: 'Quarter ends {date}',
    weddingDate: 'Wedding date: {date}',
    departure: 'Departure: {date}',
    currentAge: 'Current age: {years} years, {months} months, {days} days',
    hoursAndMinutes: '{hours} hours and {minutes} minutes',
    minutesExtra: '{minutes} minutes extra, {total} total minutes',
    readingDetail: '{minutes} minutes and {seconds} seconds at {wpm} words per minute',
    workdaysAt: '{days} workdays at {hours} hours per day',
    minutesSince: '{minutes} total minutes since {date}',
    schoolDays: 'school days',
    weekdaysMinusBreaks: '{weekdays} weekdays minus {breaks} break days',
    businessAfter: '{count} business days after {date}',
    businessBefore: '{count} business days before {date}',
    futureTime: 'That time is in the future.',
    unitEquals: '{amount} {from} equals about {value} {to}',
    invalidTimestamp: 'Invalid timestamp.',
    invalidDate: 'Invalid date.',
    local: 'local',
    pregFirst: 'First trimester',
    pregSecond: 'Second trimester',
    pregThird: 'Third trimester',
    pregWeekDay: '{weeks}w {days}d',
    dueWas: 'Due date was {date} - congratulations!',
    yearDays: 'Year {year} - {days} days total',
    easterDates: 'Western - {western}; Orthodox - {orthodox}',
  },
  stat: {
    days: 'days',
    hours: 'hours',
    min: 'min',
    sec: 'sec',
    weeks: 'weeks',
    months: 'months',
    daysSince: 'days since',
    daysUntil: 'days until',
    yearAnniversary: 'year anniversary',
    elapsed: 'elapsed',
    left: 'left',
    daysLeft: 'days left',
    weeksLeft: 'weeks left',
    yearsLeft: 'years left',
    streakDays: 'days completed',
    fullWeeks: 'full weeks',
    approxMonths: 'approx. months',
    durationMin: 'duration min',
    elapsedMin: 'elapsed min',
    minutesLeft: 'minutes left',
    currentQuarter: 'current quarter',
    remaining: 'remaining',
    daysSober: 'days sober',
    daysToMilestone: 'days to next milestone',
    nextMilestone: 'next milestone',
    daysUntilDeparture: 'days until departure',
    tripDays: 'trip days',
  },
  unit: {
    months: { one: 'month', other: 'months' },
    weeks: { one: 'week', other: 'weeks' },
    days: { one: 'day', other: 'days' },
    hours: { one: 'hour', other: 'hours' },
    minutes: { one: 'minute', other: 'minutes' },
    seconds: { one: 'second', other: 'seconds' },
    years: { one: 'year', other: 'years' },
  },
  next: {
    christmas: 'Next Christmas: {date}',
    newYear: 'Next New Year: {date}',
    halloween: 'Next Halloween: {date}',
    thanksgiving: 'Next Thanksgiving: {date}',
    valentines: 'Next Valentine\'s Day: {date}',
    mothersDay: 'Next Mother\'s Day: {date}',
    fathersDay: 'Next Father\'s Day: {date}',
    spring: 'Next spring equinox: {date}',
    summer: 'Next summer solstice: {date}',
    fall: 'Next autumnal equinox: {date}',
    winter: 'Next winter solstice: {date}',
    westernEaster: 'Next Western Easter: {date}',
    orthodoxEaster: 'Next Orthodox Easter: {date}',
    birthday: 'Next birthday: {date}',
    anniversary: 'Next anniversary: {date}',
    saturday: 'Next Saturday: {date}',
    birthdayAway: { one: 'Next birthday: {date} ({count} day away)', other: 'Next birthday: {date} ({count} days away)' },
  },
  sleep: {
    bed9: '9 hrs (6 cycles)',
    bed75: '7.5 hrs (5 cycles, recommended)',
    bed6: '6 hrs (4 cycles)',
    bed45: '4.5 hrs (3 cycles)',
    wake45: '4.5 hrs',
    wake6: '6 hrs',
    wake75: '7.5 hrs (recommended)',
    wake9: '9 hrs',
  },
  preg: {
    weeksPregnant: 'weeks pregnant',
    weeksToGo: 'weeks to go',
    daysToGo: 'days to go',
    dueDate: 'Estimated due date: {date}',
    dueDateTitle: 'Due date',
  },
  // Result card under every tool: widget preview, share, and the link handoff
  // for visitors who are not on an iPhone.
  card: {
    handoff: 'Send the link to your iPhone',
    handoffTitle: 'Left for iPhone',
    copied: 'Link copied',
    android: 'On Android? See your options',
    shareText: '{title}: {result}',
    today: 'today',
    daysLeft: { one: '{count} day left', other: '{count} days left' },
    hoursLeft: { one: '{count} hour left today', other: '{count} hours left today' },
    yearsLeft: { one: '{count} year left', other: '{count} years left' },
    weeksLeft: { one: '{count} week left', other: '{count} weeks left' },
  },
};

const LEFT_TOOL_RUNTIME = { lang: null, plural: null, number: null };

function toolLang() {
  if (!LEFT_TOOL_RUNTIME.lang) {
    let lang = (document.documentElement && document.documentElement.lang) || 'en';
    try { lang = Intl.getCanonicalLocales(lang)[0] || 'en'; } catch { lang = 'en'; }
    LEFT_TOOL_RUNTIME.lang = lang;
  }
  return LEFT_TOOL_RUNTIME.lang;
}

// English pages keep the visitor's own number/date conventions (the original
// behaviour); translated pages format for the page language.
function toolFormatLocale() {
  const lang = toolLang();
  return /^en(-|$)/i.test(lang) ? undefined : lang;
}

function toolLookup(table, key) {
  if (!table || typeof table !== 'object') return undefined;
  if (Object.prototype.hasOwnProperty.call(table, key)) return table[key];
  let cur = table;
  for (const part of key.split('.')) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = cur[part];
  }
  return cur;
}

function toolInterpolate(str, vars) {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (m, name) => (name in vars ? String(vars[name]) : m));
}

// Translated string for `key`, with {name} placeholders filled from `vars`.
function toolT(key, vars) {
  const tr = toolLookup(typeof window !== 'undefined' ? window.LEFT_TOOL_I18N : null, key);
  const value = typeof tr === 'string' ? tr : toolLookup(LEFT_TOOL_STRINGS_EN, key);
  return toolInterpolate(typeof value === 'string' ? value : key, vars);
}

// Count-dependent string for `key` (an object of plural categories).
function toolPlural(key, n, vars) {
  if (!LEFT_TOOL_RUNTIME.plural) {
    try { LEFT_TOOL_RUNTIME.plural = new Intl.PluralRules(toolLang()); }
    catch { LEFT_TOOL_RUNTIME.plural = new Intl.PluralRules('en'); }
  }
  const category = LEFT_TOOL_RUNTIME.plural.select(n);
  const tr = toolLookup(typeof window !== 'undefined' ? window.LEFT_TOOL_I18N : null, key);
  const en = toolLookup(LEFT_TOOL_STRINGS_EN, key);
  let value;
  if (tr && typeof tr === 'object') value = tr[category] ?? tr.other;
  else if (typeof tr === 'string') value = tr;
  if (typeof value !== 'string' && en && typeof en === 'object') value = en[category] ?? en.other;
  return toolInterpolate(typeof value === 'string' ? value : key, Object.assign({ count: fmtNum(n) }, vars));
}

function toolEscape(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ─────────── Formatters ─────────── */

const pad = n => String(n).padStart(2, '0');
function fmtNum(n) {
  if (!LEFT_TOOL_RUNTIME.number) {
    try { LEFT_TOOL_RUNTIME.number = new Intl.NumberFormat(toolFormatLocale()); }
    catch { LEFT_TOOL_RUNTIME.number = new Intl.NumberFormat(); }
  }
  return LEFT_TOOL_RUNTIME.number.format(n);
}

function formatDateLong(d) {
  return d.toLocaleDateString(toolFormatLocale(), { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
function formatDateShort(d) {
  return d.toLocaleDateString(toolFormatLocale(), { year: 'numeric', month: 'short', day: 'numeric' });
}
// "Saturday, March 20, 2027 at 9:25 AM" in the visitor's time zone.
function formatDateTimeLong(d) {
  return d.toLocaleString(toolFormatLocale(), { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}
function formatDateTime(d) {
  return d.toLocaleString(toolFormatLocale(), { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
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
  if (ms <= 0) { target.innerHTML = `<div class="tool-result-big">${toolEscape(toolT('result.arrived'))}</div>`; return; }
  const b = breakdown(ms);
  if (units === 'all') {
    target.innerHTML = `
      <div class="tool-stat-row">
        <div class="tool-stat"><div class="tool-stat-num">${fmtNum(b.days)}</div><div class="tool-stat-label">${toolEscape(toolT('stat.days'))}</div></div>
        <div class="tool-stat"><div class="tool-stat-num">${pad(b.hours)}</div><div class="tool-stat-label">${toolEscape(toolT('stat.hours'))}</div></div>
        <div class="tool-stat"><div class="tool-stat-num">${pad(b.minutes)}</div><div class="tool-stat-label">${toolEscape(toolT('stat.min'))}</div></div>
        <div class="tool-stat"><div class="tool-stat-num">${pad(b.seconds)}</div><div class="tool-stat-label">${toolEscape(toolT('stat.sec'))}</div></div>
      </div>`;
    return;
  }
  const map = {
    months: b.totalMonth,
    weeks:  b.totalWeek,
    days:   b.totalDay,
    hours:  b.totalHour,
    minutes:b.totalMin,
    seconds:b.totalSec,
  };
  const key = Object.prototype.hasOwnProperty.call(map, units) ? units : 'days';
  const n = map[key];
  target.innerHTML = `<div class="tool-result-big">${fmtNum(n)} <span class="tool-result-unit">${toolEscape(toolPlural('unit.' + key, n))}</span></div>`;
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

/* ─────────── Result card: widget preview, share, handoff ─────────── */
// The build (scripts/lib/tool-template.mjs) writes a [data-tool-card] block
// under every tool's result: a preview of the result as a Left widget, the
// App Store button and a Share button. Without JavaScript it is a plain
// App Store link. Pages never need to call anything here; toolPreview() is
// for pages whose result is not a single number.

function toolIsIOS() {
  const ua = navigator.userAgent || '';
  if (/iPhone|iPod|iPad/.test(ua)) return true;
  return /Macintosh/.test(ua) && (navigator.maxTouchPoints || 0) > 1; // iPadOS asks for desktop pages
}
function toolIsAndroid() { return /Android/i.test(navigator.userAgent || ''); }

// GA4 event through the gtag that analytics.js manages (no-op without consent).
function toolTrack(name, params) {
  try {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', name, Object.assign({
      locale: document.documentElement.lang || '',
      page_path: location.pathname,
      content_type: 'tool',
    }, params || {}));
  } catch { /* analytics is optional */ }
}

// Set the preview explicitly. Without a call, a "number" preview mirrors the
// first stat or big number in the result.
//   toolPreview({ num: '42', label: 'days', title: 'Trip' })  number widget
//   toolPreview({ lived: 34.2, total: 80 })                     life widget, in years
//   toolPreview(null)                                           back to automatic
const LEFT_TOOL_PREVIEW = { data: null, queued: false, keys: new WeakMap() };
function toolPreview(data) {
  LEFT_TOOL_PREVIEW.data = data || null;
  toolPreviewQueue();
}
// Number preview for a result that is a date: days until it, or days since.
function toolPreviewDate(date, title) {
  if (!(date instanceof Date) || isNaN(date)) { toolPreview(null); return; }
  const days = Math.round((startOfDay(date) - startOfDay(new Date())) / MS_DAY);
  toolPreview({
    num: fmtNum(Math.abs(days)),
    label: toolT(days < 0 ? 'stat.daysSince' : 'stat.daysUntil'),
    title,
  });
}

function toolPreviewQueue() {
  if (LEFT_TOOL_PREVIEW.queued) return;
  LEFT_TOOL_PREVIEW.queued = true;
  const run = () => { LEFT_TOOL_PREVIEW.queued = false; toolPreviewRender(); };
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(run); else setTimeout(run, 16);
}

function toolCleanText(s) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim(); }

// { num, label } from the page's own result, or null.
function toolPreviewFromResult(card) {
  const widget = card.closest('.tool-widget') || document;
  const sel = card.getAttribute('data-preview-src');
  let el = null;
  if (sel) el = widget.querySelector(sel);
  else {
    const result = widget.querySelector('.tool-result');
    el = (result && result.querySelector('.tool-stat, .tool-result-big')) || widget.querySelector('.tool-stat, .tool-result-big');
    // A countdown under a day reads "0 days": show the first unit that is not zero.
    if (el && el.classList.contains('tool-stat')) {
      const row = Array.from(el.parentNode.querySelectorAll(':scope > .tool-stat'));
      const nonZero = row.find(s => !/^[\s0.,:]*$/.test((s.querySelector('.tool-stat-num') || s).textContent));
      if (nonZero) el = nonZero;
    }
  }
  if (!el || card.contains(el)) return null;
  if (el.classList.contains('tool-stat-num')) el = el.closest('.tool-stat') || el;
  let num = '', label = '';
  if (el.classList.contains('tool-stat')) {
    const n = el.querySelector('.tool-stat-num');
    const l = el.querySelector('.tool-stat-label');
    num = n ? n.textContent : el.textContent;
    label = l ? l.textContent : '';
  } else {
    const copy = el.cloneNode(true);
    copy.querySelectorAll('.tool-result-unit').forEach(u => { label = u.textContent; u.remove(); });
    num = copy.textContent;
  }
  num = toolCleanText(num);
  if (!num || /^[-–—]+$/.test(num)) return null;
  return { num, label: toolCleanText(label) };
}

function toolSetText(root, sel, text) {
  const el = root.querySelector(sel);
  if (el && el.textContent !== text) el.textContent = text;
}

// Dot grid in Left's style: done dots faint, the current one in the accent
// colour, the rest solid. cols 0 fits the grid to the canvas. Redraws only
// when the inputs change.
function toolDrawDots(canvas, total, done, cols) {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (!w || !h || !canvas.getContext) return;
  const dark = typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const key = [total, Math.floor(done), cols, w, h, dpr, dark].join('|');
  if (LEFT_TOOL_PREVIEW.keys.get(canvas) === key) return;
  LEFT_TOOL_PREVIEW.keys.set(canvas, key);
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const ink = getComputedStyle(canvas).color || (dark ? '#F5F5F5' : '#0D0D0D');
  const accent = (getComputedStyle(document.documentElement).getPropertyValue('--accent') || '').trim() || '#FF4F00';
  if (!cols) cols = Math.max(1, Math.round(Math.sqrt(total * w / h)));
  const rows = Math.ceil(total / cols);
  const cell = Math.min(w / cols, h / rows);
  const r = Math.max(0.6, cell * 0.34);
  const ox = (w - cell * cols) / 2, oy = (h - cell * rows) / 2;
  const current = Math.min(Math.floor(done), total - 1);
  for (let i = 0; i < total; i++) {
    const x = ox + (i % cols + 0.5) * cell;
    const y = oy + (Math.floor(i / cols) + 0.5) * cell;
    ctx.globalAlpha = i < current ? 0.2 : 1;
    ctx.fillStyle = i === current ? accent : ink;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function toolPreviewRender() {
  document.querySelectorAll('[data-tool-card]').forEach(card => {
    const box = card.querySelector('[data-tool-preview]');
    if (!box) return;
    const kind = box.getAttribute('data-tool-preview');
    const canvas = box.querySelector('canvas');
    const d = LEFT_TOOL_PREVIEW.data;
    const now = new Date();
    if (kind === 'year') {
      const y = now.getFullYear();
      const total = daysInYear(y);
      const dayIndex = Math.floor((startOfDay(now) - startOfYear(now)) / MS_DAY + 0.5);
      toolSetText(box, '[data-preview-title]', String(y));
      toolSetText(box, '[data-preview-label]', toolPlural('card.daysLeft', total - dayIndex));
      if (canvas) toolDrawDots(canvas, total, dayIndex, 0);
      return;
    }
    if (kind === 'day') {
      const hour = now.getHours();
      toolSetText(box, '[data-preview-label]', toolPlural('card.hoursLeft', 24 - hour));
      if (canvas) toolDrawDots(canvas, 24, hour, 0);
      return;
    }
    if (kind === 'life') {
      const total = Math.max(1, Math.round((d && d.total) || 80));
      const lived = Math.max(0, Math.min(total, (d && d.lived) || 0));
      if (d && d.weeks) toolSetText(box, '[data-preview-label]', toolPlural('card.weeksLeft', Math.max(0, Math.round(d.weeks))));
      else toolSetText(box, '[data-preview-label]', toolPlural('card.yearsLeft', Math.max(0, Math.floor(total - lived))));
      box.classList.toggle('is-empty', !d);
      if (canvas) toolDrawDots(canvas, total, d ? lived : 0, 0);
      return;
    }
    const v = (d && d.num != null) ? { num: toolCleanText(d.num), label: toolCleanText(d.label) } : toolPreviewFromResult(card);
    if (d && d.title) toolSetText(box, '[data-preview-title]', toolCleanText(d.title));
    toolSetText(box, '[data-preview-num]', v ? v.num : '–');
    toolSetText(box, '[data-preview-label]', v ? v.label : '');
    box.classList.toggle('is-long', !!v && v.num.length > 6);
    box.classList.toggle('is-empty', !v);
  });
}

// ── Share: the page URL with the current inputs, so the link reopens this result.

function toolStateGroups(widget) {
  return Array.from(widget.querySelectorAll('.tool-units[id], .tool-toggle[id], .tool-tabs[id], [role="group"][id], [role="tablist"][id]'))
    .filter(g => !g.closest('[data-tool-card]') && g.querySelector('button'));
}
function toolActiveIndex(group) {
  const btns = Array.from(group.querySelectorAll('button'));
  return btns.findIndex(b => b.classList.contains('is-active') || b.getAttribute('aria-selected') === 'true' || b.getAttribute('aria-pressed') === 'true');
}
function toolStateFields(widget) {
  return Array.from(widget.querySelectorAll('input[id], select[id], textarea[id]')).filter(el => {
    if (el.closest('[data-tool-card]')) return false;
    return !/^(button|submit|reset|file|password|hidden|image)$/i.test(el.type || '');
  });
}

function toolStateQuery() {
  const widget = document.querySelector('.tool-widget');
  if (!widget) return '';
  const params = new URLSearchParams();
  toolStateGroups(widget).forEach(g => {
    const i = toolActiveIndex(g);
    if (i >= 0 && i !== g.__leftDefault) params.set(g.id, String(i));
  });
  toolStateFields(widget).forEach(el => {
    if (el.closest('[hidden]')) return; // a switched-off method's fields
    if (el.type === 'checkbox' || el.type === 'radio') {
      if (el.checked !== el.defaultChecked) params.set(el.id, el.checked ? '1' : '0');
    } else if (el.value !== '') params.set(el.id, el.value);
  });
  return params.toString();
}

function toolRestoreState() {
  const widget = document.querySelector('.tool-widget');
  if (!widget) return;
  toolStateGroups(widget).forEach(g => { g.__leftDefault = toolActiveIndex(g); });
  let q;
  try { q = new URLSearchParams(location.search); } catch { return; }
  let touched = false;
  toolStateGroups(widget).forEach(g => {
    if (!q.has(g.id)) return;
    const b = g.querySelectorAll('button')[parseInt(q.get(g.id), 10)];
    if (b) { b.click(); touched = true; }
  });
  toolStateFields(widget).forEach(el => {
    if (!q.has(el.id)) return;
    const value = q.get(el.id);
    if (el.type === 'checkbox' || el.type === 'radio') el.checked = value === '1';
    else el.value = value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    touched = true;
  });
  if (touched) {
    const submit = widget.querySelector('.tool-submit');
    if (submit) submit.click();
  }
}

// The element (or text node) holding a button's visible label.
function toolLabelNode(btn) {
  const slot = btn.querySelector('[data-cta-label]');
  if (slot) return slot;
  if (!btn.querySelector('svg')) return btn;
  return Array.from(btn.childNodes).reverse().find(n => n.nodeType === 3 && n.textContent.trim()) || btn;
}

function toolFlash(btn, text) {
  const label = toolLabelNode(btn);
  if (!btn.__leftLabel) btn.__leftLabel = label.textContent;
  label.textContent = text;
  clearTimeout(btn.__leftFlash);
  btn.__leftFlash = setTimeout(() => { label.textContent = btn.__leftLabel; }, 2200);
}

function toolCopy(text, btn) {
  const done = () => toolFlash(btn, toolT('card.copied'));
  const fallback = () => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch { /* nothing else to try */ }
    ta.remove();
    done();
  };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
  else fallback();
}

function toolShareOrCopy(data, btn) {
  if (navigator.share) {
    navigator.share(data).catch(e => { if (!e || e.name !== 'AbortError') toolCopy(data.url, btn); });
  } else toolCopy(data.url, btn);
}

function toolShareResult(btn) {
  const qs = toolStateQuery();
  const url = location.origin + location.pathname + (qs ? '?' + qs : '');
  const h1 = document.querySelector('.tool-page h1');
  const title = toolCleanText(h1 ? h1.textContent : document.title);
  const card = btn.closest('[data-tool-card]');
  const box = card && card.querySelector('[data-tool-preview]');
  let result = '';
  if (box && !box.classList.contains('is-empty')) {
    const num = box.querySelector('[data-preview-num]');
    const label = box.querySelector('[data-preview-label]');
    result = toolCleanText((num ? num.textContent + ' ' : '') + (label ? label.textContent : ''));
  }
  toolTrack('share_click', { method: navigator.share ? 'share' : 'copy' });
  toolShareOrCopy({ title, text: result ? toolT('card.shareText', { title, result }) : title, url }, btn);
}

// ── Handoff: Left is iPhone-only, so elsewhere the App Store buttons send the
// link to the visitor's iPhone (share sheet or clipboard) instead of opening a
// page they cannot install from. Placement "handoff" in analytics and campaigns.

function toolSetupHandoff() {
  if (toolIsIOS()) return;
  const label = toolT('card.handoff');
  document.querySelectorAll('.tool-page a[data-cta="result"], .tool-page a[data-cta="end"]').forEach(a => {
    const href = (a.getAttribute('href') || '').replace(/(ct=[\w-]*?)-(?:result|end)-/, '$1-handoff-');
    a.setAttribute('data-cta', 'handoff');
    a.setAttribute('aria-label', label);
    const node = toolLabelNode(a);
    node.textContent = node === a || node.nodeType === 1 ? label : ' ' + label + ' ';
    a.addEventListener('click', e => {
      e.preventDefault();
      toolShareOrCopy({ title: toolT('card.handoffTitle'), url: href }, a);
    });
  });
  if (!toolIsAndroid()) return;
  document.querySelectorAll('[data-tool-card] .tool-card__body').forEach(body => {
    if (body.querySelector('.tool-card__alt')) return;
    const p = document.createElement('p');
    p.className = 'tool-card__alt';
    const link = document.createElement('a');
    link.href = '/android'; // the English page sends visitors on to their language
    link.textContent = toolT('card.android');
    p.appendChild(link);
    body.appendChild(p);
  });
}

function toolCardInit() {
  toolRestoreState();
  toolSetupHandoff();
  const cards = document.querySelectorAll('[data-tool-card]');
  if (!cards.length) return;
  cards.forEach(card => {
    const share = card.querySelector('[data-tool-share]');
    if (share) share.addEventListener('click', () => toolShareResult(share));
    const widget = card.closest('.tool-widget');
    if (widget && typeof MutationObserver === 'function') {
      new MutationObserver(muts => {
        if (muts.some(m => !card.contains(m.target))) toolPreviewQueue();
      }).observe(widget, { subtree: true, childList: true, characterData: true });
    }
  });
  setInterval(toolPreviewQueue, 60000);
  window.addEventListener('resize', toolPreviewQueue, { passive: true });
  if (typeof matchMedia === 'function') {
    const mq = matchMedia('(prefers-color-scheme: dark)');
    if (mq.addEventListener) mq.addEventListener('change', toolPreviewQueue);
  }
  toolPreviewRender();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', toolCardInit);
  else setTimeout(toolCardInit, 0);
}
