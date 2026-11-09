// Shared blocks on every /tools page, written into the English source HTML by
// scripts/build-tools-seo.mjs (then translated like the rest of the page):
//
//   1. the result card at the end of .tool-widget: a preview of the result as
//      a Left widget, one App Store button worded for the tool, Share, and a
//      link to all tools (behaviour: toolCardInit() in tools/tools.js);
//   2. "Read more" before the related tools: one blog post, one support
//      article and one widget page;
//   3. the closing download block's heading and paragraph, per tool family.
//
// To set up a new tool, add one line to TOOLS (family, button, preview).
// A page with no entry still gets the blocks: its old result/inline button
// label is kept and the family defaults to "countdown".
//
// Every block sits between <!-- tools:NAME:start/end --> comments and is
// rewritten on each build, so edit this file, never the blocks in the pages.

import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const APP_URL = 'https://apps.apple.com/app/id6740155884';
const APPLE_SVG = '<svg class="dl-btn-apple" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.925-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>';

// Link targets (anchor text is what the reader sees; keep it short).
const BLOG = {
  'what-is-year-progress': 'What year progress is and why to track it',
  'best-year-progress-apps-iphone': 'The best year progress apps for iPhone',
  'best-countdown-wallpaper-apps-iphone': 'Days left wallpapers for iPhone, compared',
  'best-countdown-widgets-iphone': 'The best countdown widgets for iPhone',
  'best-birthday-countdown-apps-iphone': 'Birthday countdown apps for iPhone, compared',
  'best-exam-countdown-apps-iphone': 'Exam countdown apps for students, compared',
  'best-retirement-countdown-apps-iphone': 'Retirement countdown apps for iPhone, compared',
  'countdown-next-trip-with-friends': 'Counting down to a trip with friends',
  'best-days-since-apps-iphone': 'The best days since apps for iPhone',
  'best-day-counter-apps-iphone': 'Day counter apps for iPhone, compared',
  'best-relationship-counter-apps-iphone': 'Relationship counter apps, compared',
  'best-sobriety-counter-apps-iphone': 'Sobriety counter apps for iPhone, compared',
  'how-to-build-a-streak': 'How to build a streak on your iPhone',
  'best-life-calendar-apps-iphone': 'Life calendar apps for iPhone, compared',
  'weeks-and-days-iphone-screen': 'How to add weeks and days to your iPhone screen',
  'best-fasting-tracker-apps-iphone': 'Fasting tracker apps for iPhone, compared',
  'home-screen-timer-iphone': 'How to put a timer on your Home Screen',
  'presentation-timer-iphone': 'A presentation timer setup for iPhone',
  'timer-interval-app-iphone': 'Interval timers for focus and habits',
  'how-to-add-widgets-iphone': 'How to add widgets on iPhone',
};
const SUPPORT = {
  'widget-iphone-lock-screen': 'Add a Left widget to your Lock Screen',
  'widget-iphone-home-screen': 'Add a Left widget to your Home Screen',
  'wallpaper-shortcut': 'Set up the Left Wallpaper shortcut',
  'organise-ahead-since': 'Organise your dates in Ahead and Since',
  'joint-ahead-dates': 'Share a countdown with Joint Ahead dates',
  'streaks-vs-habits': 'Streaks or habits: which to use',
  'set-up-your-lifespan': 'Set up your lifespan in Left',
  'fasting-in-left': 'How fasting works in Left',
  'focus-timer-in-left': 'Use the Focus timer in Left',
};
const LANDING = {
  'year-progress-widget': 'Year progress widget for iPhone',
  'days-left-wallpaper': 'A days left wallpaper that updates itself',
  'countdown-widget': 'Countdown widget for iPhone',
  'days-since-widget': 'Days since widget for iPhone',
  'habit-tracker': 'Habit tracker and streak counter',
  'life-calendar': 'Life calendar: your life in weeks',
  'pomodoro-timer-iphone': 'Pomodoro timer for iPhone',
};

// Per family: the closing block's heading and paragraph (claims follow
// docs/seo/research/product-claims.md: no prices, nothing called free) and the
// default "Read more" links.
const FAMILIES = {
  countdown: {
    end: ['Keep the countdown in sight.', 'Add the date to Ahead in Left and a widget counts it down on your Home Screen, Lock Screen and Apple Watch, with a reminder before the day.'],
    links: { blog: 'best-countdown-widgets-iphone', support: 'organise-ahead-since', landing: 'countdown-widget' },
  },
  date: {
    end: ['Turn the date into a countdown.', 'Once you know the date, add it to Ahead in Left and see the days left on your Home Screen, Lock Screen and Apple Watch.'],
    links: { blog: 'best-countdown-widgets-iphone', support: 'organise-ahead-since', landing: 'countdown-widget' },
  },
  year: {
    end: ['See the year on your Lock Screen.', 'Left draws the year, month, week and day as grids that fill in by themselves, as widgets on your Home Screen, Lock Screen and Apple Watch.'],
    links: { blog: 'what-is-year-progress', support: 'widget-iphone-lock-screen', landing: 'year-progress-widget' },
  },
  since: {
    end: ['Keep counting without the calculator.', 'Since in Left counts the days since anything and keeps your streaks and habits on your Home Screen, Lock Screen and Apple Watch.'],
    links: { blog: 'best-days-since-apps-iphone', support: 'streaks-vs-habits', landing: 'days-since-widget' },
  },
  life: {
    end: ['See your life in weeks.', 'Left draws your life as a grid from your birthday, with Life widgets for your Home Screen, Lock Screen and Apple Watch and a wallpaper that updates itself.'],
    links: { blog: 'best-life-calendar-apps-iphone', support: 'set-up-your-lifespan', landing: 'life-calendar' },
  },
  day: {
    end: ['Keep the day in view.', 'Left shows how much of your day and week is left as widgets on your Home Screen, Lock Screen and Apple Watch, next to your countdowns and habits.'],
    links: { blog: 'home-screen-timer-iphone', support: 'focus-timer-in-left', landing: 'pomodoro-timer-iphone' },
  },
  fasting: {
    end: ['Follow your fast from the Lock Screen.', 'Fasting in Left shows the time left in your fast as a Live Activity on your Lock Screen and on your Apple Watch.'],
    links: { blog: 'best-fasting-tracker-apps-iphone', support: 'fasting-in-left' },
  },
  utility: {
    end: ['Keep time where you look.', 'Left puts countdowns, year progress, habits and streaks on your Home Screen, Lock Screen and Apple Watch.'],
    links: { blog: 'how-to-add-widgets-iphone', support: 'widget-iphone-home-screen', landing: 'countdown-widget' },
  },
};

// family, button label, preview ('number' mirrors the result; 'year' | 'day'
// | 'life' draw a grid), preview title, optional preview source selector and
// link overrides.
export const TOOLS = {
  'date-countdown-calculator': { family: 'countdown', cta: 'Put this countdown on your Home Screen', preview: 'number', title: 'Countdown' },
  'time-left-in-year-calculator': { family: 'year', cta: 'See the days left on your Lock Screen', preview: 'year', links: { blog: 'best-year-progress-apps-iphone' } },
  'time-passed-in-year-calculator': { family: 'year', cta: 'See the year on your Lock Screen', preview: 'year' },
  'percentage-year-calculator': { family: 'year', cta: 'Put the year on your Lock Screen', preview: 'year', links: { blog: 'best-year-progress-apps-iphone' } },
  'christmas-countdown-widget': { family: 'countdown', cta: 'Put the Christmas countdown on your Home Screen', preview: 'number', title: 'Christmas' },
  'days-until-easter': { family: 'countdown', cta: 'Put the Easter countdown on your Home Screen', preview: 'number', title: 'Easter' },
  'days-until-spring': { family: 'countdown', cta: 'Count down to spring on your Home Screen', preview: 'number', title: 'Spring' },
  'days-until-summer': { family: 'countdown', cta: 'Count down to summer on your Home Screen', preview: 'number', title: 'Summer' },
  'days-until-fall': { family: 'countdown', cta: 'Count down to fall on your Home Screen', preview: 'number', title: 'Fall' },
  'days-until-winter': { family: 'countdown', cta: 'Count down to winter on your Home Screen', preview: 'number', title: 'Winter' },
  'days-until-new-year': { family: 'countdown', cta: 'Put the New Year countdown on your Lock Screen', preview: 'number', title: 'New Year', links: { support: 'widget-iphone-lock-screen' } },
  'days-until-halloween': { family: 'countdown', cta: 'Put the Halloween countdown on your Home Screen', preview: 'number', title: 'Halloween' },
  'days-until-valentines': { family: 'countdown', cta: "Put the Valentine's Day countdown on your Home Screen", preview: 'number', title: "Valentine's Day" },
  'days-until-thanksgiving': { family: 'countdown', cta: 'Put the Thanksgiving countdown on your Home Screen', preview: 'number', title: 'Thanksgiving' },
  'days-until-mothers-day': { family: 'countdown', cta: "Put the Mother's Day countdown on your Home Screen", preview: 'number', title: "Mother's Day" },
  'days-until-fathers-day': { family: 'countdown', cta: "Put the Father's Day countdown on your Home Screen", preview: 'number', title: "Father's Day" },
  'days-until-birthday': { family: 'countdown', cta: 'Put this birthday countdown on your Home Screen', preview: 'number', title: 'Birthday', links: { blog: 'best-birthday-countdown-apps-iphone' } },
  'time-until-weekend': { family: 'day', cta: 'Count down to the weekend on your Home Screen', preview: 'number', title: 'Weekend' },
  'days-between-two-dates': { family: 'date', cta: 'Count down to this date in Left', preview: 'number', title: 'Days between', links: { blog: 'best-day-counter-apps-iphone' } },
  'hours-between-two-dates': { family: 'date', cta: 'Count down to this date in Left', preview: 'number', title: 'Hours between' },
  'weeks-until-date': { family: 'countdown', cta: 'Put this countdown on your Home Screen', preview: 'number', title: 'Weeks to go', links: { blog: 'best-exam-countdown-apps-iphone' } },
  'business-days-calculator': { family: 'date', cta: 'Count down to this deadline in Left', preview: 'number', title: 'Business days' },
  'add-subtract-date-calculator': { family: 'date', cta: 'Count down to this date in Left', preview: 'number', title: 'Your date' },
  'what-was-the-date': { family: 'since', cta: 'Count the days since in Left', preview: 'number', title: 'Since', links: { blog: 'best-day-counter-apps-iphone', support: 'organise-ahead-since' } },
  'age-calculator': { family: 'life', cta: 'See your life in weeks on your Home Screen', preview: 'life', title: 'Your life', links: { blog: 'weeks-and-days-iphone-screen' } },
  'iso-week-number': { family: 'year', cta: 'See the week on your Lock Screen', preview: 'number', title: 'Week', links: { blog: 'weeks-and-days-iphone-screen' } },
  'unix-timestamp-converter': { family: 'utility', cta: 'Put the year on your Lock Screen', preview: 'year' },
  'life-expectancy-calculator': { family: 'life', cta: 'Keep your life grid on your Lock Screen', preview: 'life', title: 'Your life' },
  'pregnancy-due-date-calculator': { family: 'countdown', cta: 'Count down to the due date in Left', preview: 'number', title: 'Due date', links: { support: 'joint-ahead-dates' } },
  'sleep-calculator': { family: 'day', cta: 'See the hours left in your day on your Lock Screen', preview: 'day', title: 'Today' },
  'intermittent-fasting-duration-calculator': { family: 'fasting', cta: 'Follow your fast on your Lock Screen', preview: 'number', title: 'Fast' },
  'end-of-fasting-calculator': { family: 'fasting', cta: 'Follow your fast on your Lock Screen', preview: 'number', title: 'Fast' },
  'fasting-countdown': { family: 'fasting', cta: 'Keep your fast on your Lock Screen', preview: 'number', title: 'Fast' },
  'days-since-date': { family: 'since', cta: 'Keep counting the days on your Home Screen', preview: 'number', title: 'Since', links: { blog: 'best-day-counter-apps-iphone', support: 'organise-ahead-since' } },
  'hours-since-date': { family: 'since', cta: 'Keep counting on your Home Screen', preview: 'number', title: 'Since', links: { support: 'organise-ahead-since' } },
  'minutes-between-two-times': { family: 'day', cta: 'See the hours left in your day on your Lock Screen', preview: 'day', title: 'Today' },
  'time-between-two-times': { family: 'day', cta: 'See the hours left in your day on your Lock Screen', preview: 'day', title: 'Today' },
  'anniversary-countdown': { family: 'countdown', cta: 'Put your anniversary countdown on your Home Screen', preview: 'number', title: 'Anniversary', links: { blog: 'best-relationship-counter-apps-iphone', support: 'joint-ahead-dates' } },
  'sobriety-calculator': { family: 'since', cta: 'Keep your sober days on your Home Screen', preview: 'number', title: 'Sober', links: { blog: 'best-sobriety-counter-apps-iphone' } },
  'habit-streak-calculator': { family: 'since', cta: 'Keep your streak on your Home Screen', preview: 'number', title: 'Streak', links: { blog: 'how-to-build-a-streak', landing: 'habit-tracker' } },
  'business-days-from-date': { family: 'date', cta: 'Count down to this date in Left', preview: 'number', title: 'Deadline' },
  'working-hours-calculator': { family: 'day', cta: 'See the hours left in your day on your Lock Screen', preview: 'day', title: 'Today' },
  'workday-countdown': { family: 'day', cta: 'See what is left of your day on your Lock Screen', preview: 'number', title: 'Workday' },
  'school-days-calculator': { family: 'countdown', cta: 'Count down to the end of term in Left', preview: 'number', title: 'School days', links: { blog: 'best-exam-countdown-apps-iphone' } },
  'semester-countdown-calculator': { family: 'countdown', cta: 'Count down to the end of the semester in Left', preview: 'number', title: 'Semester', links: { blog: 'best-exam-countdown-apps-iphone' } },
  'meeting-time-calculator': { family: 'day', cta: 'See the hours left in your day on your Lock Screen', preview: 'day', title: 'Today', links: { blog: 'presentation-timer-iphone' } },
  'deadline-countdown-calculator': { family: 'countdown', cta: 'Count down to your deadline on your Home Screen', preview: 'number', title: 'Deadline' },
  'vacation-countdown': { family: 'countdown', cta: 'Put your trip countdown on your Home Screen', preview: 'number', title: 'Trip', links: { blog: 'countdown-next-trip-with-friends', support: 'joint-ahead-dates' } },
  'wedding-countdown': { family: 'countdown', cta: 'Put your wedding countdown on your Home Screen', preview: 'number', title: 'Wedding', links: { support: 'joint-ahead-dates' } },
  'retirement-countdown-calculator': { family: 'countdown', cta: 'Count down to retirement on your Home Screen', preview: 'number', title: 'Retirement', links: { blog: 'best-retirement-countdown-apps-iphone' } },
  'quarter-countdown-calculator': { family: 'year', cta: 'Count down to the end of the quarter in Left', preview: 'number', title: 'Quarter', src: '.tool-result .tool-stat:nth-child(2)' },
  'fiscal-year-progress-calculator': { family: 'year', cta: 'Count down to your year end in Left', preview: 'number', title: 'Fiscal year' },
  'countdown-timer': { family: 'day', cta: 'Run a Focus timer on your Lock Screen', preview: 'number', title: 'Timer', links: { blog: 'timer-interval-app-iphone' } },
  'unix-milliseconds-converter': { family: 'utility', cta: 'Put the year on your Lock Screen', preview: 'year' },
  'date-units-converter': { family: 'utility', cta: 'Put the year on your Lock Screen', preview: 'year' },
  'time-zone-meeting-planner': { family: 'utility', cta: 'See the hours left in your day on your Lock Screen', preview: 'day', title: 'Today' },
  'reading-time-calculator': { family: 'utility', cta: 'See the hours left in your day on your Lock Screen', preview: 'day', title: 'Today' },
  'life-in-weeks-calculator': { family: 'life', cta: 'Keep your life grid on your Lock Screen', preview: 'life', title: 'Your life', links: { blog: 'weeks-and-days-iphone-screen' } },
};

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = s => esc(s).replace(/"/g, '&quot;');
const decode = s => String(s).replace(/&(amp|quot|#39|apos|lt|gt);/g, (_, e) => ({ amp: '&', quot: '"', '#39': "'", apos: "'", lt: '<', gt: '>' })[e]);

function previewHtml(cfg) {
  const kind = cfg.preview || 'number';
  const title = cfg.title ? esc(cfg.title) : '';
  if (kind === 'year') {
    return `<div class="tool-preview tool-preview--grid" data-tool-preview="year" aria-hidden="true">
          <span class="tool-preview__title" data-preview-title>${new Date().getFullYear()}</span>
          <canvas width="0" height="0"></canvas>
          <span class="tool-preview__label" data-preview-label></span>
        </div>`;
  }
  if (kind === 'day' || kind === 'life') {
    return `<div class="tool-preview tool-preview--grid" data-tool-preview="${kind}" aria-hidden="true">
          <span class="tool-preview__title">${title}</span>
          <canvas width="0" height="0"></canvas>
          <span class="tool-preview__label" data-preview-label></span>
        </div>`;
  }
  return `<div class="tool-preview" data-tool-preview="number" aria-hidden="true">
          <span class="tool-preview__title" data-preview-title>${title}</span>
          <span class="tool-preview__num" data-preview-num>–</span>
          <span class="tool-preview__label" data-preview-label></span>
        </div>`;
}

function cardHtml(cfg) {
  const src = cfg.src ? ` data-preview-src="${escAttr(cfg.src)}"` : '';
  return `<!-- tools:card:start -->
      <div class="tool-card-cta" data-tool-card${src}>
        ${previewHtml(cfg)}
        <div class="tool-card__body">
          <div class="tool-card__actions">
            <a class="dl-btn" data-cta="result" href="${APP_URL}" target="_blank" rel="noopener">
              ${APPLE_SVG}
              <span data-cta-label>${esc(cfg.cta)}</span>
            </a>
            <button type="button" class="tool-share" data-tool-share>Share</button>
            <a class="tool-card__more" href="/tools/">All tools</a>
          </div>
        </div>
      </div>
      <!-- tools:card:end -->`;
}

function moreHtml(links) {
  const items = [];
  if (links.blog && BLOG[links.blog]) items.push(`<a class="tool-related-item" href="/blog/${links.blog}">${esc(BLOG[links.blog])}</a>`);
  if (links.support && SUPPORT[links.support]) items.push(`<a class="tool-related-item" href="/support/${links.support}">${esc(SUPPORT[links.support])}</a>`);
  if (links.landing && LANDING[links.landing]) items.push(`<a class="tool-related-item" href="/${links.landing}">${esc(LANDING[links.landing])}</a>`);
  if (!items.length) return '';
  return `<!-- tools:more:start -->
    <div class="tool-related tool-more">
      <h2>Read more</h2>
      <div class="tool-related-items">
        ${items.join('\n        ')}
      </div>
    </div>
    <!-- tools:more:end -->`;
}

// Index just past the </div> that closes the <div> opening at `start`.
function closingDiv(html, start) {
  const re = /<div\b[^>]*>|<\/div\s*>/gi;
  re.lastIndex = start;
  let depth = 0;
  let m;
  while ((m = re.exec(html))) {
    if (m[0][1] === '/') { depth -= 1; if (depth === 0) return m.index; }
    else depth += 1;
  }
  return -1;
}

const LEGACY_CTA = /\n?[ \t]*<p class="tool-cta"[^>]*>\s*<a\b[^>]*data-cta="(?:result|inline)"[^>]*>([\s\S]*?)<\/a>\s*<\/p>/g;

// The label a page's old result/inline button used (fallback for pages
// without an entry in TOOLS).
function legacyLabel(html) {
  const m = new RegExp(LEGACY_CTA.source).exec(html);
  if (!m) return '';
  return decode(m[1].replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
}

export function toolConfig(slug, html) {
  const own = TOOLS[slug];
  const family = FAMILIES[own?.family] ? own.family : 'countdown';
  const cfg = {
    preview: 'number',
    ...own,
    family,
    cta: own?.cta || legacyLabel(html) || 'Put this countdown on your Home Screen',
  };
  cfg.links = { ...FAMILIES[family].links, ...(own?.links || {}) };
  return cfg;
}

// ─── Generated tables (refreshed on every build, so they never go stale) ───

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const pad2 = n => String(n).padStart(2, '0');

// Build date (New Zealand day, set by scripts/build.mjs) as a year number.
function buildYear() {
  const env = process.env.BUILD_DATE;
  return env && /^\d{4}-/.test(env) ? Number(env.slice(0, 4)) : new Date().getFullYear();
}

function replaceBlock(html, name, inner) {
  const re = new RegExp(`(<!-- tools:${name}:start -->)[\\s\\S]*?([ \\t]*<!-- tools:${name}:end -->)`);
  return html.replace(re, (m, open, close) => `${open}\n${inner}\n${close}`);
}

// Percentage of the year: the moment each share of the year is reached,
// this year and next (local clock time, no daylight-saving shift).
function milestonesTable() {
  const y = buildYear();
  const years = [y, y + 1];
  const rows = [[10, '10%'], [20, '20%'], [25, '25%'], [30, '30%'], [100 / 3, '33.3%'], [40, '40%'], [50, '50%'], [60, '60%'], [200 / 3, '66.7%'], [70, '70%'], [75, '75%'], [80, '80%'], [90, '90%']];
  const at = (year, pct) => {
    const days = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;
    const d = new Date(Date.UTC(year, 0, 1) + Math.round(pct / 100 * days * 1440) * 60000);
    return `${WEEKDAYS[d.getUTCDay()]}, ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())}`;
  };
  const head = `<tr><th>Share of the year</th>${years.map(v => `<th>${v}</th>`).join('')}</tr>`;
  const body = rows.map(([pct, label]) => `          <tr><td>${label}</td>${years.map(v => `<td>${at(v, pct)}</td>`).join('')}</tr>`).join('\n');
  return `      <div class="tool-table-wrap">
        <table class="tool-table">
          <thead>${head}</thead>
          <tbody>
${body}
          </tbody>
        </table>
      </div>`;
}

// The date rules the pages use in the browser, loaded from tools/tools.js so
// the tables and the live countdowns can never disagree.
let toolsJs = null;
function rules() {
  if (!toolsJs) {
    const ctx = {};
    vm.createContext(ctx);
    const src = readFileSync(new URL('../../tools/tools.js', import.meta.url), 'utf8');
    vm.runInContext(`${src}\n;this.api = { easterDate, orthodoxEasterDate, thanksgivingDate, mothersDayDate, fathersDayDate, seasonInstant };`, ctx);
    toolsJs = ctx.api;
  }
  return toolsJs;
}

function buildIso() {
  const env = process.env.BUILD_DATE;
  if (env && /^\d{4}-\d{2}-\d{2}$/.test(env)) return env;
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
const isoOf = d => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const WEEKDAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const longDate = d => `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`; // December 25, 2026
const dayMonth = d => `${WEEKDAYS_LONG[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`; // Sunday, March 28
const weekday = d => WEEKDAYS_LONG[d.getDay()];
const nthWeekday = (y, month, weekdayIndex, n) => {
  const first = new Date(y, month, 1);
  return new Date(y, month, 1 + ((weekdayIndex - first.getDay() + 7) % 7) + (n - 1) * 7);
};

// Five rows from the first year whose `main` date is today or later.
function fiveYears(main, cells) {
  const today = buildIso();
  let y = buildYear() - 1;
  while (isoOf(main(y)) < today) y += 1;
  return [0, 1, 2, 3, 4].map(i => cells(y + i));
}

const CELL = 'style="text-align:left;padding:10px 16px 10px 0;border-bottom:1px solid var(--hairline);"';
// Rewrites the rows of the first table in the page's prose; the header stays
// hand-written. Cell text matches the hand-typed format, so translations of
// rows that were already there are kept.
function refreshTbody(html, rows) {
  const prose = html.indexOf('<div class="tool-prose">');
  if (prose < 0) return html;
  const open = html.indexOf('<tbody>', prose);
  const close = html.indexOf('</tbody>', open);
  if (open < 0 || close < 0) return html;
  const body = rows.map(r => `          <tr>${r.map(c => `<td ${CELL}>${c}</td>`).join('')}</tr>`).join('\n');
  return `${html.slice(0, open)}<tbody>\n${body}\n          ${html.slice(close)}`;
}

const fixedDay = (month, day) => html => refreshTbody(html, fiveYears(
  y => new Date(y, month, day),
  y => { const d = new Date(y, month, day); return [String(y), longDate(d), weekday(d)]; }
));

// Season pages: the exact UTC moment for each hemisphere, five years.
function seasonsTable(northEvent, southEvent, northLabel, southLabel) {
  const { seasonInstant } = rules();
  const today = buildIso();
  let y = buildYear();
  const utcIso = d => d.toISOString().slice(0, 10);
  if (utcIso(seasonInstant(y, northEvent)) < today && utcIso(seasonInstant(y, southEvent)) < today) y += 1;
  const fmt = d => `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}, ${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())}`;
  const rows = [0, 1, 2, 3, 4].map(i => {
    const minute = e => new Date(Math.round(seasonInstant(y + i, e) / 60000) * 60000);
    return `          <tr><td>${fmt(minute(northEvent))}</td><td>${fmt(minute(southEvent))}</td></tr>`;
  }).join('\n');
  return `      <div class="tool-table-wrap">
        <table class="tool-table">
          <thead><tr><th>${northLabel}</th><th>${southLabel}</th></tr></thead>
          <tbody>
${rows}
          </tbody>
        </table>
      </div>`;
}

const GENERATED = {
  'percentage-year-calculator': html => replaceBlock(html, 'milestones', milestonesTable()),
  'days-until-spring': html => replaceBlock(html, 'seasons', seasonsTable('march', 'september', 'Northern Hemisphere: March equinox (UTC)', 'Southern Hemisphere: September equinox (UTC)')),
  'days-until-summer': html => replaceBlock(html, 'seasons', seasonsTable('june', 'december', 'Northern Hemisphere: June solstice (UTC)', 'Southern Hemisphere: December solstice (UTC)')),
  'days-until-fall': html => replaceBlock(html, 'seasons', seasonsTable('september', 'march', 'Northern Hemisphere: September equinox (UTC)', 'Southern Hemisphere: March equinox (UTC)')),
  'days-until-winter': html => replaceBlock(html, 'seasons', seasonsTable('december', 'june', 'Northern Hemisphere: December solstice (UTC)', 'Southern Hemisphere: June solstice (UTC)')),
  'christmas-countdown-widget': fixedDay(11, 25),
  'days-until-halloween': fixedDay(9, 31),
  'days-until-valentines': fixedDay(1, 14),
  'days-until-new-year': html => refreshTbody(html, fiveYears(
    y => new Date(y + 1, 0, 1),
    y => { const d = new Date(y + 1, 0, 1); return [longDate(d), weekday(d), `${weekday(new Date(y, 11, 31))}, ${longDate(new Date(y, 11, 31))}`]; }
  )),
  'days-until-easter': html => refreshTbody(html, fiveYears(
    y => rules().easterDate(y),
    y => [String(y), dayMonth(rules().easterDate(y)), dayMonth(rules().orthodoxEasterDate(y))]
  )),
  'days-until-thanksgiving': html => refreshTbody(html, fiveYears(
    y => rules().thanksgivingDate(y),
    y => [String(y), dayMonth(rules().thanksgivingDate(y)), dayMonth(nthWeekday(y, 9, 1, 2))]
  )),
  'days-until-mothers-day': html => refreshTbody(html, fiveYears(
    y => rules().mothersDayDate(y),
    y => { const e = rules().easterDate(y); return [String(y), dayMonth(rules().mothersDayDate(y)), dayMonth(new Date(e.getFullYear(), e.getMonth(), e.getDate() - 21))]; }
  )),
  'days-until-fathers-day': html => refreshTbody(html, fiveYears(
    y => rules().fathersDayDate(y),
    y => [String(y), dayMonth(rules().fathersDayDate(y)), dayMonth(nthWeekday(y, 8, 0, 1))]
  )),
};

export function applyToolTemplate(slug, html) {
  if (GENERATED[slug]) html = GENERATED[slug](html);
  const cfg = toolConfig(slug, html);

  // 1. Result card: drop the old buttons and the previous card, then append
  //    the card as the last child of .tool-widget.
  html = html.replace(LEGACY_CTA, '');
  html = html.replace(/\n?[ \t]*<!-- tools:card:start -->[\s\S]*?<!-- tools:card:end -->/g, '');
  const widgetStart = html.search(/<div class="tool-widget"[^>]*>/);
  if (widgetStart >= 0) {
    const close = closingDiv(html, widgetStart);
    if (close > 0) {
      const before = html.slice(0, close).replace(/\s*$/, '');
      html = `${before}\n      ${cardHtml(cfg)}\n    ${html.slice(close)}`;
    }
  }

  // 2. Read more, right before the related tools.
  html = html.replace(/\n?[ \t]*<!-- tools:more:start -->[\s\S]*?<!-- tools:more:end -->/g, '');
  const more = moreHtml(cfg.links);
  if (more) html = html.replace(/([ \t]*)<div class="tool-related">/, (m, indent) => `    ${more}\n${indent}<div class="tool-related">`);

  // 3. Closing block: heading and paragraph for this tool's family.
  const [heading, para] = FAMILIES[cfg.family].end;
  html = html.replace(
    /(<section class="download-block">\s*<div class="section-head">\s*<span class="eyebrow">[^<]*<\/span>\s*)<h2>[\s\S]*?<\/h2>\s*<p>[\s\S]*?<\/p>/,
    (m, head) => `${head}<h2>${esc(heading)}</h2>\n        <p>${esc(para)}</p>`
  );
  return html;
}
