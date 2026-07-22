#!/usr/bin/env node
// Build the English-only /tools pages and normalize SEO metadata across tools
// and support source pages. The output remains plain static HTML.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const SITE = 'https://getleft.app';
const OG_IMAGE = `${SITE}/images/og-image.png`;
const APP_URL = 'https://apps.apple.com/us/app/left-widgets-for-time-left/id6740155884?itscg=30200&amp;itsct=apps_box_badge&amp;mttnsubad=6740155884';
const TIME_ZONE_OPTIONS = JSON.parse(
  await fs.readFile(path.join(ROOT, 'scripts/time-zone-options.json'), 'utf8')
);

const existingTools = [
  { slug: 'date-countdown-calculator', title: 'Date Countdown Calculator - Days, Hours & Minutes to Any Date | Left', h1: 'Date countdown calculator', desc: 'Free date countdown calculator. Pick any future date and instantly see the exact days, hours, minutes, and seconds remaining. Track it on your iPhone with Left.', cardTitle: 'Countdown to any date', cardDesc: 'Pick a target date, see days, hours, minutes, and seconds remaining.' },
  { slug: 'time-left-in-year-calculator', title: 'Time Left in the Year Calculator - Days, Hours & Minutes Until New Year | Left', h1: 'Time left in the year', desc: 'How much time is left in the year? See the exact days, hours, and minutes remaining until December 31st. Track year progress on your iPhone with Left.', cardTitle: 'Time left in the year', cardDesc: 'How many days, hours, and minutes remain until New Year.' },
  { slug: 'time-passed-in-year-calculator', title: 'Time Passed in the Year Calculator - Days & Hours Elapsed | Left', h1: 'Time passed in the year', desc: 'How much of the year has already passed? See the exact days, hours, and minutes elapsed since January 1st. Free, live, and no signup required.', cardTitle: 'Time passed in the year', cardDesc: 'How far into the year you are, down to the minute.' },
  { slug: 'percentage-year-calculator', title: 'Percentage of Year Calculator - How Much of the Year Is Over? | Left', h1: 'Percentage of the year calculator', desc: 'What percentage of the year has passed, and what percentage is left? Live calculator updated to the second. Track year progress on your iPhone with Left widgets.', cardTitle: 'Percentage of the year', cardDesc: 'What percent of the year is over, and what percent is left, right now.' },
  { slug: 'christmas-countdown-widget', title: 'Christmas Countdown - Days, Hours & Minutes Until December 25 | Left', h1: 'Christmas countdown', desc: 'How many days until Christmas? See the exact countdown to December 25th in days, weeks, hours, minutes, or seconds. Track it live on your iPhone with Left widgets.', cardTitle: 'Christmas countdown', cardDesc: 'Days, weeks, months, or hours until December 25th.' },
  { slug: 'days-until-easter', title: 'How Many Days Until Easter - Live Easter Countdown | Left', h1: 'How many days until Easter?', desc: 'How many days until Easter Sunday? Live countdown to Western and Orthodox Easter. See days, hours, and minutes remaining. Free tool by Left.', cardTitle: 'Days until Easter', cardDesc: 'Western and Orthodox Easter dates, with a live countdown.' },
  { slug: 'days-until-spring', title: 'How Many Days Until Spring - Spring Equinox Countdown | Left', h1: 'How many days until spring?', desc: 'How many days until spring? Live countdown to the spring equinox for your hemisphere. See days, hours, and minutes remaining until the first day of spring.', cardTitle: 'Days until spring', cardDesc: 'Spring equinox countdown - Northern or Southern hemisphere.' },
  { slug: 'days-until-summer', title: 'How Many Days Until Summer - Summer Solstice Countdown | Left', h1: 'How many days until summer?', desc: 'How many days until summer? Live countdown to the summer solstice for your hemisphere. Days, hours, and minutes until the first day of summer.', cardTitle: 'Days until summer', cardDesc: 'Summer solstice countdown - pick your hemisphere.' },
  { slug: 'days-until-fall', title: 'How Many Days Until Fall - Autumn Equinox Countdown | Left', h1: 'How many days until fall?', desc: 'How many days until fall? Live countdown to the autumnal equinox for your hemisphere. Days, hours, and minutes until the first day of autumn.', cardTitle: 'Days until fall', cardDesc: 'Autumn equinox countdown - works for both hemispheres.' },
  { slug: 'days-until-winter', title: 'How Many Days Until Winter - Winter Solstice Countdown | Left', h1: 'How many days until winter?', desc: 'How many days until winter? Live countdown to the winter solstice for your hemisphere. Days, hours, and minutes until the first day of winter.', cardTitle: 'Days until winter', cardDesc: 'Winter solstice countdown - pick your hemisphere.' },
  { slug: 'days-until-new-year', title: 'Days Until New Year - Countdown to January 1st | Left', h1: 'Days until New Year', desc: 'How many days until New Year? Live countdown to January 1st in days, hours, minutes, and seconds. Track it on your iPhone with Left widgets.', cardTitle: 'Days until New Year', cardDesc: 'Time remaining until January 1st.' },
  { slug: 'days-until-halloween', title: 'Days Until Halloween - Countdown to October 31st | Left', h1: 'Days until Halloween', desc: 'How many days until Halloween? Live countdown to October 31st in days, hours, and minutes. Track it on your iPhone Home Screen with Left widgets.', cardTitle: 'Days until Halloween', cardDesc: 'How long until October 31st.' },
  { slug: 'days-until-valentines', title: "Days Until Valentine's Day - Countdown to February 14th | Left", h1: "Days until Valentine's Day", desc: "How many days until Valentine's Day? Live countdown to February 14th in days, hours, and minutes. Plan ahead with Left on iPhone.", cardTitle: "Days until Valentine's Day", cardDesc: 'Countdown to February 14th.' },
  { slug: 'days-until-thanksgiving', title: 'Days Until Thanksgiving - Countdown to Thanksgiving | Left', h1: 'Days until Thanksgiving', desc: 'How many days until Thanksgiving? Live countdown to the fourth Thursday of November in the US. Days, hours, and minutes until Thanksgiving Day.', cardTitle: 'Days until Thanksgiving', cardDesc: 'Fourth Thursday of November in the US.' },
  { slug: 'days-until-mothers-day', title: "Days Until Mother's Day - Countdown to Mother's Day | Left", h1: "Days until Mother's Day", desc: "How many days until Mother's Day? Live countdown to the second Sunday of May. Days, hours, and minutes remaining.", cardTitle: "Days until Mother's Day", cardDesc: 'Second Sunday of May in the US.' },
  { slug: 'days-until-fathers-day', title: "Days Until Father's Day - Countdown to Father's Day | Left", h1: "Days until Father's Day", desc: "How many days until Father's Day? Live countdown to the third Sunday of June. Days, hours, and minutes remaining.", cardTitle: "Days until Father's Day", cardDesc: 'Third Sunday of June in the US.' },
  { slug: 'days-until-birthday', title: 'Days Until Your Birthday - Birthday Countdown Calculator | Left', h1: 'Days until your birthday', desc: 'How many days until your next birthday? Enter your birthdate and get a live countdown in days, hours, and minutes. Free birthday countdown calculator.', cardTitle: 'Days until your birthday', cardDesc: 'Enter a birthday, see exactly how long until the next one.' },
  { slug: 'time-until-weekend', title: 'Time Until the Weekend - Countdown to Saturday | Left', h1: 'Time until the weekend', desc: 'How many hours until the weekend? Live countdown to Saturday in days, hours, minutes, and seconds. See exactly how much work week is left.', cardTitle: 'Time until the weekend', cardDesc: 'Countdown to Saturday morning.' },
  { slug: 'days-between-two-dates', title: 'Days Between Two Dates Calculator - Exact Day Count | Left', h1: 'Days between two dates', desc: 'Calculate the exact number of days between any two dates instantly. Free, no signup. Also count weeks, months, or hours. Track events with Left widgets on iPhone.', cardTitle: 'Days between two dates', cardDesc: 'The exact number of days between any two dates.' },
  { slug: 'hours-between-two-dates', title: 'Hours Between Two Dates - Hours Calculator | Left', h1: 'Hours between two dates', desc: 'Calculate the exact number of hours between any two dates and times. Free online hours calculator with minutes and seconds breakdown.', cardTitle: 'Hours between two dates', cardDesc: 'Duration in hours between two dates and times.' },
  { slug: 'weeks-until-date', title: 'Weeks Until a Date - Week Countdown Calculator | Left', h1: 'Weeks until a date', desc: 'How many weeks until a date? Enter any future date and get the exact number of weeks remaining. Free weeks countdown calculator.', cardTitle: 'Weeks until a date', cardDesc: 'Pick a target date, see whole weeks remaining.' },
  { slug: 'business-days-calculator', title: 'Business Days Calculator - Working Days Between Two Dates | Left', h1: 'Business days calculator', desc: 'Calculate the number of business days between two dates. Free working days calculator for deadlines, contracts, and project planning.', cardTitle: 'Business days calculator', cardDesc: 'Working days, Monday through Friday, between two dates.' },
  { slug: 'add-subtract-date-calculator', title: 'Add or Subtract Days from a Date - Date Calculator | Left', h1: 'Add or subtract from a date', desc: 'Add or subtract days, weeks, months, or years from any date. Free date calculator - find a date N days from today or in the past.', cardTitle: 'Add or subtract from a date', cardDesc: 'Add or subtract years, months, weeks, days, hours, or minutes.' },
  { slug: 'what-was-the-date', title: 'What Was the Date N Days Ago - Past Date Calculator | Left', h1: 'What was the date?', desc: 'What was the date 30, 60, or 90 days ago? Enter any number of days, weeks, or months and find the exact past date. Free date calculator.', cardTitle: 'What was the date?', cardDesc: 'Go back in time by subtracting a duration.' },
  { slug: 'age-calculator', title: 'Age Calculator - How Old Am I in Years, Months, and Days | Left', h1: 'Age calculator', desc: 'Calculate your exact age in years, months, days, hours, and minutes. Free age calculator - enter your birthdate and see how old you are right now.', cardTitle: 'Age calculator', cardDesc: 'Your exact age in years, months, and days.' },
  { slug: 'iso-week-number', title: 'ISO Week Number Calculator - What Week of the Year Is It? | Left', h1: 'ISO week number', desc: 'What ISO week number is it today? Find the ISO 8601 week number for any date. Free week number calculator showing current and past week numbers.', cardTitle: 'ISO week number', cardDesc: 'The ISO 8601 week number for any date.' },
  { slug: 'unix-timestamp-converter', title: 'Unix Timestamp Converter - Epoch Time to Human Date | Left', h1: 'Unix timestamp converter', desc: 'Convert Unix timestamps to human-readable dates and times, or convert any date to a Unix epoch timestamp. Free online Unix time converter.', cardTitle: 'Unix timestamp converter', cardDesc: 'Convert between epoch seconds and human dates.' },
  { slug: 'life-expectancy-calculator', title: 'Life Expectancy Calculator - How Many Years Do I Have Left? | Left', h1: 'Life expectancy calculator', desc: 'Estimate your life expectancy and years remaining based on population baselines and research-adjusted factors: age, gender, lifestyle, health, and more.', cardTitle: 'Life expectancy calculator', cardDesc: 'A population-level estimate based on lifestyle factors.' },
  { slug: 'pregnancy-due-date-calculator', title: 'Pregnancy Due Date Calculator - When Is My Baby Due? | Left', h1: 'Pregnancy due date calculator', desc: 'Calculate your pregnancy due date from your last menstrual period. See your due date, current week of pregnancy, and a live countdown.', cardTitle: 'Pregnancy due date', cardDesc: 'From last menstrual period, conception date, or ultrasound.' },
  { slug: 'sleep-calculator', title: 'Sleep Calculator - Best Bedtime & Wake-Up Times | Left', h1: 'Sleep calculator', desc: 'Calculate the best time to go to sleep or wake up based on 90-minute sleep cycles. Find wake-up times that avoid sleep inertia and leave you feeling rested.', cardTitle: 'Sleep calculator', cardDesc: 'Calculate how long you will sleep between bedtime and alarm.' },
  { slug: 'intermittent-fasting-duration-calculator', title: 'Intermittent Fasting Duration Calculator - 16:8, 18:6, OMAD | Left', h1: 'Intermittent fasting duration calculator', desc: 'Calculate your intermittent fasting window. Enter when you last ate and your fasting protocol to see when your fast ends.', cardTitle: 'Fasting duration', cardDesc: 'Hours and minutes between two fast times.' },
  { slug: 'end-of-fasting-calculator', title: 'End of Fasting Calculator - When Does My Fast End? | Left', h1: 'End of fasting calculator', desc: 'Calculate exactly when your fast ends. Enter your fast start time and duration to get the precise end time and a live countdown.', cardTitle: 'End of fasting calculator', cardDesc: 'When does your 16:8, 18:6, or custom fast end?' },
  { slug: 'fasting-countdown', title: 'Fasting Countdown - Live Timer Until Your Fast Ends | Left', h1: 'Fasting countdown', desc: 'Live fasting countdown timer. Set your fast end time and watch the countdown tick down in hours, minutes, and seconds. Free fasting timer.', cardTitle: 'Live fasting countdown', cardDesc: 'Real-time countdown of an in-progress fast.' },
];

const newTools = [
  {
    slug: 'days-since-date',
    title: 'Days Since Date Calculator - Count Days Since an Event | Left',
    h1: 'Days since date calculator',
    desc: 'Count how many days, weeks, months, hours, and minutes have passed since any date. Free days since calculator for anniversaries, streaks, and milestones.',
    cardTitle: 'Days since a date',
    cardDesc: 'Count days, weeks, and months since an event.',
    category: 'Since & streaks',
    fields: `<div class="tool-widget__row">
        <div class="tool-widget__field">
          <label for="since-date">Start date</label>
          <input type="date" id="since-date" />
        </div>
        <div class="tool-widget__field">
          <label for="since-time">Start time</label>
          <input type="time" id="since-time" value="09:00" />
        </div>
      </div>
      <div class="tool-result" id="since-result" aria-live="polite"></div>`,
    script: `const dateEl = document.getElementById('since-date');
    const timeEl = document.getElementById('since-time');
    const result = document.getElementById('since-result');
    const def = new Date(); def.setDate(def.getDate() - 30);
    dateEl.value = toLocalDateInput(def);
    function render() {
      if (!dateEl.value) { result.innerHTML = ''; return; }
      const start = new Date(dateEl.value + 'T' + (timeEl.value || '00:00'));
      const now = new Date();
      const ms = now - start;
      if (isNaN(start)) { result.innerHTML = '<p>Select a valid date.</p>'; return; }
      if (ms < 0) { result.innerHTML = '<div class="tool-result-big">Not yet</div><p class="tool-result-sub">That date is in the future.</p>'; return; }
      const b = breakdown(ms);
      result.innerHTML = '<div class="tool-stat-row">' +
        '<div class="tool-stat"><div class="tool-stat-num">' + fmtNum(b.totalDay) + '</div><div class="tool-stat-label">days since</div></div>' +
        '<div class="tool-stat"><div class="tool-stat-num">' + fmtNum(b.totalWeek) + '</div><div class="tool-stat-label">weeks</div></div>' +
        '<div class="tool-stat"><div class="tool-stat-num">' + fmtNum(b.totalMonth) + '</div><div class="tool-stat-label">months</div></div>' +
        '<div class="tool-stat"><div class="tool-stat-num">' + fmtNum(b.totalHour) + '</div><div class="tool-stat-label">hours</div></div>' +
      '</div><p class="tool-result-sub">Since ' + formatDateTime(start) + '</p>';
    }
    dateEl.addEventListener('change', render); timeEl.addEventListener('change', render); tickEvery(60000, render);`,
    sections: [
      ['How this days since calculator works', ['Enter the date and optional time of an event, and the calculator subtracts it from the current moment. The result updates automatically so you can see the exact number of days since the event began.', 'This is useful for anniversaries, sobriety dates, streaks, product launches, recovery timelines, and any milestone where the elapsed time matters.']],
      ['Common ways to use days since', ['People often search for days since a birthday, days since a breakup, days since quitting a habit, or days since a project started. The same calculation works for all of them: pick the start date and the elapsed count becomes visible.', 'In Left, this maps closely to Since and streak tracking. Once you know the date, you can keep it visible on your iPhone widget instead of recalculating it.']],
      ['Date and time accuracy', ['The calculator uses your local browser time zone. If the original event happened in another time zone, enter the equivalent local date and time for the most accurate count.']]
    ],
    related: ['hours-since-date', 'habit-streak-calculator', 'sobriety-calculator', 'days-between-two-dates'],
  },
  {
    slug: 'hours-since-date',
    title: 'Hours Since Calculator - Hours Since a Date and Time | Left',
    h1: 'Hours since calculator',
    desc: 'Calculate how many hours and minutes have passed since any date and time. Free hours since calculator for shifts, fasting, projects, and milestones.',
    cardTitle: 'Hours since a date',
    cardDesc: 'Exact hours and minutes since a date and time.',
    category: 'Since & streaks',
    fields: `<div class="tool-widget__row">
        <div class="tool-widget__field">
          <label for="hours-since-start">Start date and time</label>
          <input type="datetime-local" id="hours-since-start" />
        </div>
      </div>
      <div class="tool-result" id="hours-since-result" aria-live="polite"></div>`,
    script: `const startEl = document.getElementById('hours-since-start');
    const result = document.getElementById('hours-since-result');
    const def = new Date(); def.setHours(def.getHours() - 36);
    startEl.value = toLocalInput(def);
    function render() {
      const start = new Date(startEl.value);
      const now = new Date();
      if (isNaN(start)) { result.innerHTML = ''; return; }
      const ms = now - start;
      if (ms < 0) { result.innerHTML = '<div class="tool-result-big">0 <span class="tool-result-unit">hours</span></div><p class="tool-result-sub">That time is in the future.</p>'; return; }
      const b = breakdown(ms);
      result.innerHTML = '<div class="tool-result-big">' + fmtNum(b.totalHour) + ' <span class="tool-result-unit">hours</span></div><p class="tool-result-sub">' + fmtNum(b.totalMin) + ' total minutes since ' + formatDateTime(start) + '</p>';
    }
    startEl.addEventListener('change', render); tickEvery(60000, render);`,
    sections: [
      ['When hours matter more than days', ['Some timelines are too short for day counts. Hours since a medication dose, a last meal, a shift start, an outage, or a deadline often need a more precise answer than whole calendar days.']],
      ['How the calculation works', ['The calculator measures the exact difference between the selected start time and right now, then displays total hours and total minutes. It includes nights, weekends, and all elapsed time.']],
      ['Planning with elapsed hours', ['Use this tool for quick calculations, then create a visible countdown or Since widget in Left for anything you want to keep checking throughout the day.']]
    ],
    related: ['days-since-date', 'hours-between-two-dates', 'fasting-countdown', 'end-of-fasting-calculator'],
  },
  {
    slug: 'minutes-between-two-times',
    title: 'Minutes Between Two Times Calculator | Left',
    h1: 'Minutes between two times',
    desc: 'Calculate the exact number of minutes between two times. Handles same-day and overnight ranges for shifts, classes, workouts, and meetings.',
    cardTitle: 'Minutes between times',
    cardDesc: 'Exact minutes between two clock times.',
    category: 'Date math',
    fields: `<div class="tool-widget__row">
        <div class="tool-widget__field">
          <label for="mb-start">Start time</label>
          <input type="time" id="mb-start" value="09:00" />
        </div>
        <div class="tool-widget__field">
          <label for="mb-end">End time</label>
          <input type="time" id="mb-end" value="17:30" />
        </div>
        <div class="tool-widget__field">
          <label for="mb-overnight">Range type</label>
          <select id="mb-overnight">
            <option value="auto">Auto-detect overnight</option>
            <option value="same">Same day only</option>
            <option value="overnight">Force overnight</option>
          </select>
        </div>
      </div>
      <div class="tool-result" id="mb-result" aria-live="polite"></div>`,
    script: `const startEl = document.getElementById('mb-start');
    const endEl = document.getElementById('mb-end');
    const modeEl = document.getElementById('mb-overnight');
    const result = document.getElementById('mb-result');
    function mins(str) { const p = str.split(':').map(Number); return p[0] * 60 + p[1]; }
    function render() {
      if (!startEl.value || !endEl.value) { result.innerHTML = ''; return; }
      const start = mins(startEl.value);
      let end = mins(endEl.value);
      if (modeEl.value === 'overnight' || (modeEl.value === 'auto' && end < start)) end += 1440;
      const diff = Math.max(0, end - start);
      const hours = Math.floor(diff / 60);
      const minutes = diff % 60;
      result.innerHTML = '<div class="tool-result-big">' + fmtNum(diff) + ' <span class="tool-result-unit">minutes</span></div><p class="tool-result-sub">' + hours + ' hours and ' + minutes + ' minutes</p>';
    }
    [startEl, endEl, modeEl].forEach(el => el.addEventListener('change', render)); render();`,
    sections: [
      ['Why calculate minutes between times?', ['Minutes are the cleanest unit for short durations: meetings, classes, workouts, commute windows, cooking timers, and billable blocks. This calculator turns two clock times into one exact minute count.']],
      ['Overnight time ranges', ['If the end time is earlier than the start time, the auto setting treats it as an overnight range. For example, 10:00 PM to 2:00 AM becomes 240 minutes, not zero.']],
      ['From minutes to planning', ['Once you have the duration, you can compare it with a deadline or use Left to keep the next important time visible on your Home Screen.']]
    ],
    related: ['time-between-two-times', 'meeting-time-calculator', 'hours-between-two-dates', 'countdown-timer'],
  },
  {
    slug: 'time-between-two-times',
    title: 'Time Between Two Times Calculator - Hours and Minutes | Left',
    h1: 'Time between two times',
    desc: 'Find the duration between two clock times in hours and minutes. Free time between times calculator with overnight support.',
    cardTitle: 'Time between two times',
    cardDesc: 'Duration between two clock times.',
    category: 'Date math',
    fields: `<div class="tool-widget__row">
        <div class="tool-widget__field">
          <label for="tb-start">Start time</label>
          <input type="time" id="tb-start" value="08:45" />
        </div>
        <div class="tool-widget__field">
          <label for="tb-end">End time</label>
          <input type="time" id="tb-end" value="15:15" />
        </div>
      </div>
      <div class="tool-result" id="tb-result" aria-live="polite"></div>`,
    script: `const startEl = document.getElementById('tb-start');
    const endEl = document.getElementById('tb-end');
    const result = document.getElementById('tb-result');
    function toMinutes(str) { const p = str.split(':').map(Number); return p[0] * 60 + p[1]; }
    function render() {
      let start = toMinutes(startEl.value);
      let end = toMinutes(endEl.value);
      if (end < start) end += 1440;
      const diff = end - start;
      const h = Math.floor(diff / 60);
      const m = diff % 60;
      result.innerHTML = '<div class="tool-result-big">' + h + ' <span class="tool-result-unit">hours</span></div><p class="tool-result-sub">' + m + ' minutes extra, ' + fmtNum(diff) + ' total minutes</p>';
    }
    startEl.addEventListener('change', render); endEl.addEventListener('change', render); render();`,
    sections: [
      ['How the duration is calculated', ['The calculator converts each clock time into minutes after midnight, then subtracts start from end. If the end time is earlier, it assumes the range crosses midnight.']],
      ['Useful examples', ['Use it for shifts, school periods, travel windows, appointments, classes, workouts, or any plan where you need a simple hours-and-minutes duration.']],
      ['Short time blocks and focus', ['When a block has a clear start and end, it becomes easier to protect. Left can keep the next block visible as a countdown so it does not disappear into your calendar.']]
    ],
    related: ['minutes-between-two-times', 'working-hours-calculator', 'meeting-time-calculator', 'countdown-timer'],
  },
  {
    slug: 'business-days-from-date',
    title: 'Business Days From Date Calculator - Add or Subtract Workdays | Left',
    h1: 'Business days from date calculator',
    desc: 'Add or subtract business days from any date. Find the date 5, 10, 30, 60, or 90 working days from today.',
    cardTitle: 'Business days from a date',
    cardDesc: 'Add or subtract working days from a date.',
    category: 'Work & school',
    fields: `<div class="tool-widget__row">
        <div class="tool-widget__field">
          <label for="bdf-start">Start date</label>
          <input type="date" id="bdf-start" />
        </div>
        <div class="tool-widget__field">
          <label for="bdf-count">Business days</label>
          <input type="number" id="bdf-count" min="0" value="30" />
        </div>
        <div class="tool-widget__field">
          <label for="bdf-op">Operation</label>
          <select id="bdf-op">
            <option value="add">Add business days</option>
            <option value="subtract">Subtract business days</option>
          </select>
        </div>
      </div>
      <div class="tool-result" id="bdf-result" aria-live="polite"></div>`,
    script: `const startEl = document.getElementById('bdf-start');
    const countEl = document.getElementById('bdf-count');
    const opEl = document.getElementById('bdf-op');
    const result = document.getElementById('bdf-result');
    startEl.value = toLocalDateInput(new Date());
    function addBiz(date, amount, dir) {
      const d = new Date(date);
      let left = Math.max(0, amount);
      while (left > 0) {
        d.setDate(d.getDate() + dir);
        const day = d.getDay();
        if (day !== 0 && day !== 6) left--;
      }
      return d;
    }
    function render() {
      const start = new Date(startEl.value + 'T00:00:00');
      const amount = parseInt(countEl.value, 10) || 0;
      const dir = opEl.value === 'subtract' ? -1 : 1;
      const target = addBiz(start, amount, dir);
      result.innerHTML = '<div class="tool-result-big" style="font-size:clamp(32px,5vw,56px);">' + formatDateShort(target) + '</div><p class="tool-result-sub">' + amount + ' business days ' + (dir > 0 ? 'after' : 'before') + ' ' + formatDateShort(start) + '</p>';
    }
    [startEl, countEl, opEl].forEach(el => el.addEventListener('change', render)); render();`,
    sections: [
      ['What counts as a business day?', ['This tool treats Monday through Friday as business days and skips Saturdays and Sundays. It does not automatically remove public holidays because those vary by country, state, and workplace.']],
      ['Common deadline calculations', ['Business-day offsets are common for contracts, payment terms, support SLAs, hiring timelines, shipping estimates, and project schedules. Searches like 30 business days from today or 10 working days ago use this exact calculation.']],
      ['Turn the result into a countdown', ['After you calculate the target date, add it to Left as an Ahead date so the deadline stays visible on your Lock Screen or Home Screen.']]
    ],
    related: ['business-days-calculator', 'working-hours-calculator', 'deadline-countdown-calculator', 'add-subtract-date-calculator'],
  },
  {
    slug: 'working-hours-calculator',
    title: 'Working Hours Calculator - Work Hours Between Dates | Left',
    h1: 'Working hours calculator',
    desc: 'Calculate working hours between two dates with custom workday start, end, lunch break, and weekday rules.',
    cardTitle: 'Working hours calculator',
    cardDesc: 'Work hours between dates with breaks.',
    category: 'Work & school',
    fields: `<div class="tool-field-grid">
        <div class="tool-widget__field"><label for="wh-start">Start date</label><input type="date" id="wh-start" /></div>
        <div class="tool-widget__field"><label for="wh-end">End date</label><input type="date" id="wh-end" /></div>
        <div class="tool-widget__field"><label for="wh-day-start">Work starts</label><input type="time" id="wh-day-start" value="09:00" /></div>
        <div class="tool-widget__field"><label for="wh-day-end">Work ends</label><input type="time" id="wh-day-end" value="17:00" /></div>
        <div class="tool-widget__field"><label for="wh-break">Break minutes per day</label><input type="number" id="wh-break" min="0" value="30" /></div>
      </div>
      <div class="tool-result" id="wh-result" aria-live="polite"></div>`,
    script: `const ids = ['wh-start','wh-end','wh-day-start','wh-day-end','wh-break'];
    const els = Object.fromEntries(ids.map(id => [id, document.getElementById(id)]));
    const result = document.getElementById('wh-result');
    const today = new Date(); els['wh-start'].value = toLocalDateInput(today);
    const next = new Date(); next.setDate(today.getDate() + 14); els['wh-end'].value = toLocalDateInput(next);
    function mins(str) { const p = str.split(':').map(Number); return p[0] * 60 + p[1]; }
    function render() {
      let a = new Date(els['wh-start'].value + 'T00:00:00');
      let b = new Date(els['wh-end'].value + 'T00:00:00');
      if (b < a) { const t = a; a = b; b = t; }
      const perDay = Math.max(0, mins(els['wh-day-end'].value) - mins(els['wh-day-start'].value) - (parseInt(els['wh-break'].value, 10) || 0));
      let days = 0;
      const cur = new Date(a);
      while (cur <= b) { const day = cur.getDay(); if (day !== 0 && day !== 6) days++; cur.setDate(cur.getDate() + 1); }
      const totalMin = days * perDay;
      result.innerHTML = '<div class="tool-result-big">' + (totalMin / 60).toFixed(1) + ' <span class="tool-result-unit">hours</span></div><p class="tool-result-sub">' + days + ' workdays at ' + (perDay / 60).toFixed(2) + ' hours per day</p>';
    }
    Object.values(els).forEach(el => el.addEventListener('change', render)); render();`,
    sections: [
      ['Working hours vs calendar hours', ['Calendar hours count every hour on the clock. Working hours count only the hours inside your workday schedule, usually Monday through Friday. That makes the result better for capacity planning, consulting estimates, and sprint planning.']],
      ['Breaks and schedules', ['Set your workday start and end time, then subtract a daily break. The calculator multiplies that net workday by the number of weekdays in the range.']],
      ['Use it for deadlines', ['A deadline that is 80 working hours away feels different from one that is 14 calendar days away. Convert the schedule into a real number, then track the final date in Left.']]
    ],
    related: ['business-days-calculator', 'business-days-from-date', 'time-between-two-times', 'meeting-time-calculator'],
  },
  {
    slug: 'workday-countdown',
    title: 'Workday Countdown - Time Until End of Work | Left',
    h1: 'Workday countdown',
    desc: 'See how much time is left in your workday. Countdown to your custom end-of-day time in hours, minutes, and seconds.',
    cardTitle: 'Workday countdown',
    cardDesc: 'Time left until the end of your workday.',
    category: 'Work & school',
    fields: `<div class="tool-widget__row">
        <div class="tool-widget__field"><label for="wd-end">Workday ends at</label><input type="time" id="wd-end" value="17:00" /></div>
      </div>
      <div class="tool-result" id="wd-result" aria-live="polite"></div>`,
    script: `const endEl = document.getElementById('wd-end');
    const result = document.getElementById('wd-result');
    function render() {
      const now = new Date();
      const parts = endEl.value.split(':').map(Number);
      const end = new Date(); end.setHours(parts[0], parts[1], 0, 0);
      if (end <= now) { result.innerHTML = '<div class="tool-result-big">Workday ended</div><p class="tool-result-sub">Set a later time to count down again.</p>'; return; }
      renderCountdown(result, end - now, 'all');
    }
    endEl.addEventListener('change', render); tickEvery(1000, render);`,
    sections: [
      ['A countdown for the rest of today', ['The workday countdown shows exactly how much focused time remains before your chosen end time. It is useful when you want a clear boundary for deep work, admin, school, or a shift.']],
      ['Why the end time matters', ['A visible end point helps prevent the day from expanding indefinitely. Once you know there are 2 hours left, prioritization becomes more concrete.']],
      ['Using it with Left', ['For recurring visibility, create a daily end-of-work countdown in Left and place it on a widget. The timer becomes part of your work rhythm instead of another tab to check.']]
    ],
    related: ['time-until-weekend', 'working-hours-calculator', 'deadline-countdown-calculator', 'countdown-timer'],
  },
  {
    slug: 'school-days-calculator',
    title: 'School Days Calculator - Weekdays Between School Dates | Left',
    h1: 'School days calculator',
    desc: 'Count school days between two dates. Estimate weekdays in a term, semester, or school year and subtract break days manually.',
    cardTitle: 'School days calculator',
    cardDesc: 'Weekday school days between two dates.',
    category: 'Work & school',
    fields: `<div class="tool-widget__row">
        <div class="tool-widget__field"><label for="sd-start">Start date</label><input type="date" id="sd-start" /></div>
        <div class="tool-widget__field"><label for="sd-end">End date</label><input type="date" id="sd-end" /></div>
        <div class="tool-widget__field"><label for="sd-breaks">Break / holiday days to subtract</label><input type="number" id="sd-breaks" min="0" value="0" /></div>
      </div>
      <div class="tool-result" id="sd-result" aria-live="polite"></div>`,
    script: `const startEl = document.getElementById('sd-start');
    const endEl = document.getElementById('sd-end');
    const breakEl = document.getElementById('sd-breaks');
    const result = document.getElementById('sd-result');
    const now = new Date(); startEl.value = toLocalDateInput(now); const end = new Date(); end.setMonth(end.getMonth() + 3); endEl.value = toLocalDateInput(end);
    function render() {
      const a = new Date(startEl.value + 'T00:00:00'); const b = new Date(endEl.value + 'T00:00:00');
      const weekdays = businessDaysBetween(a, b) + (b.getDay() !== 0 && b.getDay() !== 6 ? 1 : 0);
      const breaks = parseInt(breakEl.value, 10) || 0;
      const school = Math.max(0, weekdays - breaks);
      result.innerHTML = '<div class="tool-result-big">' + fmtNum(school) + ' <span class="tool-result-unit">school days</span></div><p class="tool-result-sub">' + weekdays + ' weekdays minus ' + breaks + ' break days</p>';
    }
    [startEl, endEl, breakEl].forEach(el => el.addEventListener('change', render)); render();`,
    sections: [
      ['How school days are counted', ['This calculator counts weekdays between the start and end dates, then lets you subtract breaks or public holidays manually. That gives a practical school-day estimate for terms, semesters, and school years.']],
      ['Why holidays are manual', ['School calendars vary by country, state, district, and institution. A manual break-day field keeps the calculator flexible without pretending every calendar follows the same holidays.']],
      ['Planning assignments and exams', ['When you know the actual number of school days left, deadlines feel clearer. Use the result to pace revision, projects, and reading plans.']]
    ],
    related: ['semester-countdown-calculator', 'business-days-calculator', 'deadline-countdown-calculator', 'weeks-until-date'],
  },
  {
    slug: 'semester-countdown-calculator',
    title: 'Semester Countdown Calculator - Weeks and Percent Left | Left',
    h1: 'Semester countdown calculator',
    desc: 'Count down to the end of a semester. See weeks left, days left, percent elapsed, and percent remaining for school or university terms.',
    cardTitle: 'Semester countdown',
    cardDesc: 'Weeks, days, and percent left in a semester.',
    category: 'Work & school',
    fields: `<div class="tool-widget__row">
        <div class="tool-widget__field"><label for="sem-start">Semester starts</label><input type="date" id="sem-start" /></div>
        <div class="tool-widget__field"><label for="sem-end">Semester ends</label><input type="date" id="sem-end" /></div>
      </div>
      <div class="tool-result" id="sem-result" aria-live="polite"></div>`,
    script: `const startEl = document.getElementById('sem-start');
    const endEl = document.getElementById('sem-end');
    const result = document.getElementById('sem-result');
    const now = new Date(); const start = new Date(now.getFullYear(), now.getMonth(), 1); const end = new Date(start); end.setMonth(end.getMonth() + 4);
    startEl.value = toLocalDateInput(start); endEl.value = toLocalDateInput(end);
    function render() {
      const a = new Date(startEl.value + 'T00:00:00'); const b = new Date(endEl.value + 'T23:59:59'); const now = new Date();
      const total = Math.max(1, b - a); const elapsed = Math.max(0, Math.min(total, now - a)); const left = Math.max(0, b - now);
      const pct = (elapsed / total) * 100; const daysLeft = Math.ceil(left / MS_DAY); const weeksLeft = Math.floor(daysLeft / 7);
      result.innerHTML = '<div class="tool-stat-row">' +
        '<div class="tool-stat"><div class="tool-stat-num">' + fmtNum(daysLeft) + '</div><div class="tool-stat-label">days left</div></div>' +
        '<div class="tool-stat"><div class="tool-stat-num">' + fmtNum(weeksLeft) + '</div><div class="tool-stat-label">weeks left</div></div>' +
        '<div class="tool-stat"><div class="tool-stat-num">' + pct.toFixed(1) + '%</div><div class="tool-stat-label">elapsed</div></div>' +
      '</div>';
    }
    [startEl, endEl].forEach(el => el.addEventListener('change', render)); tickEvery(60000, render);`,
    sections: [
      ['Make the semester visible', ['A semester can feel abstract until the final weeks. This calculator shows the remaining days, weeks, and percentage so you can see how much term time is really left.']],
      ['Use it for pacing', ['Use the percentage elapsed to compare progress against assignments, readings, revision, and exam prep. If the semester is 60 percent over but the project is 20 percent done, the mismatch is visible early.']],
      ['Track the end date', ['Add the semester end date or next exam date to Left so the countdown stays visible across your phone and widgets.']]
    ],
    related: ['school-days-calculator', 'weeks-until-date', 'deadline-countdown-calculator', 'percentage-year-calculator'],
  },
  {
    slug: 'quarter-countdown-calculator',
    title: 'Quarter Countdown Calculator - Time Left in This Quarter | Left',
    h1: 'Quarter countdown calculator',
    desc: 'See how much time is left in the current calendar quarter. Count days, weeks, and percent remaining in Q1, Q2, Q3, or Q4.',
    cardTitle: 'Quarter countdown',
    cardDesc: 'Time left in the current calendar quarter.',
    category: 'Planning countdowns',
    fields: `<div class="tool-result" id="quarter-result" aria-live="polite"></div>`,
    script: `const result = document.getElementById('quarter-result');
    function render() {
      const now = new Date();
      const q = Math.floor(now.getMonth() / 3) + 1;
      const start = new Date(now.getFullYear(), (q - 1) * 3, 1);
      const end = new Date(now.getFullYear(), q * 3, 1);
      const total = end - start; const left = end - now; const pctLeft = Math.max(0, left / total * 100);
      const b = breakdown(left);
      result.innerHTML = '<div class="tool-stat-row">' +
        '<div class="tool-stat"><div class="tool-stat-num">Q' + q + '</div><div class="tool-stat-label">current quarter</div></div>' +
        '<div class="tool-stat"><div class="tool-stat-num">' + fmtNum(b.totalDay) + '</div><div class="tool-stat-label">days left</div></div>' +
        '<div class="tool-stat"><div class="tool-stat-num">' + pctLeft.toFixed(1) + '%</div><div class="tool-stat-label">remaining</div></div>' +
      '</div><p class="tool-result-sub">Quarter ends ' + formatDateLong(new Date(end.getTime() - MS_DAY)) + '</p>';
    }
    tickEvery(60000, render);`,
    sections: [
      ['Why quarters are useful', ['Quarterly planning is common for teams, freelancers, students, and personal goals. A quarter is short enough to feel urgent but long enough for meaningful progress.']],
      ['How the quarter is calculated', ['The tool uses standard calendar quarters: Q1 is January through March, Q2 is April through June, Q3 is July through September, and Q4 is October through December.']],
      ['Turn quarter goals into dates', ['Use the quarter countdown to keep your planning window honest. For individual milestones, add specific deadline countdowns in Left.']]
    ],
    related: ['fiscal-year-progress-calculator', 'time-left-in-year-calculator', 'deadline-countdown-calculator', 'percentage-year-calculator'],
  },
  {
    slug: 'fiscal-year-progress-calculator',
    title: 'Fiscal Year Progress Calculator - Percent of Fiscal Year | Left',
    h1: 'Fiscal year progress calculator',
    desc: 'Calculate how much of your fiscal year has passed and how much is left. Choose any fiscal year start month.',
    cardTitle: 'Fiscal year progress',
    cardDesc: 'Percent elapsed and left for any fiscal year.',
    category: 'Planning countdowns',
    fields: `<div class="tool-widget__row">
        <div class="tool-widget__field"><label for="fy-month">Fiscal year starts in</label><select id="fy-month"></select></div>
      </div>
      <div class="tool-result" id="fy-result" aria-live="polite"></div>`,
    script: `const monthEl = document.getElementById('fy-month');
    const result = document.getElementById('fy-result');
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    monthEl.innerHTML = months.map((m, i) => '<option value="' + i + '"' + (i === 0 ? ' selected' : '') + '>' + m + '</option>').join('');
    function render() {
      const now = new Date(); const startMonth = parseInt(monthEl.value, 10);
      let startYear = now.getMonth() >= startMonth ? now.getFullYear() : now.getFullYear() - 1;
      const start = new Date(startYear, startMonth, 1);
      const end = new Date(startYear + 1, startMonth, 1);
      const pct = Math.max(0, Math.min(100, ((now - start) / (end - start)) * 100));
      const daysLeft = Math.ceil((end - now) / MS_DAY);
      result.innerHTML = '<div class="tool-stat-row">' +
        '<div class="tool-stat"><div class="tool-stat-num">' + pct.toFixed(1) + '%</div><div class="tool-stat-label">elapsed</div></div>' +
        '<div class="tool-stat"><div class="tool-stat-num">' + (100 - pct).toFixed(1) + '%</div><div class="tool-stat-label">left</div></div>' +
        '<div class="tool-stat"><div class="tool-stat-num">' + fmtNum(daysLeft) + '</div><div class="tool-stat-label">days left</div></div>' +
      '</div><p class="tool-result-sub">Fiscal year ends ' + formatDateLong(new Date(end.getTime() - MS_DAY)) + '</p>';
    }
    monthEl.addEventListener('change', render); tickEvery(60000, render);`,
    sections: [
      ['Calendar year vs fiscal year', ['Not every team plans from January to December. This calculator lets you choose the month your fiscal year starts, then shows percent elapsed and days remaining.']],
      ['Use it for business planning', ['Fiscal year progress is useful for budgets, annual targets, school years, fundraising cycles, and reporting periods where the official year does not match the calendar year.']],
      ['Keep the target visible', ['If your fiscal year has important milestones, turn those dates into Left countdowns so the quarter or year stays visible day to day.']]
    ],
    related: ['quarter-countdown-calculator', 'time-left-in-year-calculator', 'percentage-year-calculator', 'deadline-countdown-calculator'],
  },
  {
    slug: 'date-units-converter',
    title: 'Date Units Converter - Days, Weeks, Months, Years | Left',
    h1: 'Date units converter',
    desc: 'Convert between days, weeks, months, years, hours, and minutes. Free time unit converter for planning and date math.',
    cardTitle: 'Date units converter',
    cardDesc: 'Convert days, weeks, months, years, hours, and minutes.',
    category: 'Time converters',
    fields: `<div class="tool-widget__row">
        <div class="tool-widget__field"><label for="duc-amount">Amount</label><input type="number" id="duc-amount" value="90" step="0.01" /></div>
        <div class="tool-widget__field"><label for="duc-from">From</label><select id="duc-from"></select></div>
        <div class="tool-widget__field"><label for="duc-to">To</label><select id="duc-to"></select></div>
      </div>
      <div class="tool-result" id="duc-result" aria-live="polite"></div>`,
    script: `const units = { minutes: 1 / 1440, hours: 1 / 24, days: 1, weeks: 7, months: 30.4375, years: 365.25 };
    const labels = Object.keys(units);
    const amountEl = document.getElementById('duc-amount');
    const fromEl = document.getElementById('duc-from');
    const toEl = document.getElementById('duc-to');
    const result = document.getElementById('duc-result');
    fromEl.innerHTML = labels.map(u => '<option value="' + u + '">' + u + '</option>').join('');
    toEl.innerHTML = labels.map(u => '<option value="' + u + '"' + (u === 'weeks' ? ' selected' : '') + '>' + u + '</option>').join('');
    function render() {
      const amount = parseFloat(amountEl.value) || 0;
      const days = amount * units[fromEl.value];
      const converted = days / units[toEl.value];
      result.innerHTML = '<div class="tool-result-big">' + converted.toLocaleString(undefined, { maximumFractionDigits: 4 }) + ' <span class="tool-result-unit">' + toEl.value + '</span></div><p class="tool-result-sub">' + amount + ' ' + fromEl.value + ' equals about ' + converted.toFixed(4) + ' ' + toEl.value + '</p>';
    }
    [amountEl, fromEl, toEl].forEach(el => el.addEventListener('change', render)); render();`,
    sections: [
      ['Approximate calendar conversions', ['Days and weeks are exact, but months and years are averages because calendar months are different lengths and leap years add extra days. This converter uses 30.4375 days per month and 365.25 days per year.']],
      ['When to use it', ['Use this date unit converter for planning rough timelines, translating 90 days into weeks, estimating months from days, or comparing hours and minutes for shorter durations.']],
      ['For exact dates', ['If you need an exact calendar date, use the add or subtract date calculator instead. It walks the calendar rather than using month averages.']]
    ],
    related: ['add-subtract-date-calculator', 'days-between-two-dates', 'weeks-until-date', 'unix-timestamp-converter'],
  },
  {
    slug: 'deadline-countdown-calculator',
    title: 'Deadline Countdown Calculator - Time Left Until a Deadline | Left',
    h1: 'Deadline countdown calculator',
    desc: 'Count down to any deadline in days, hours, minutes, and seconds. Free deadline countdown for projects, exams, launches, and events.',
    cardTitle: 'Deadline countdown',
    cardDesc: 'Live time left until a deadline.',
    category: 'Planning countdowns',
    fields: `<div class="tool-widget__row">
        <div class="tool-widget__field"><label for="dl-target">Deadline date and time</label><input type="datetime-local" id="dl-target" /></div>
      </div>
      <div id="dl-status" class="tool-meta"></div>
      <div class="tool-result" id="dl-result" aria-live="polite"></div>`,
    script: `const targetEl = document.getElementById('dl-target');
    const statusEl = document.getElementById('dl-status');
    const result = document.getElementById('dl-result');
    const def = new Date(); def.setDate(def.getDate() + 14); def.setHours(17, 0, 0, 0); targetEl.value = toLocalInput(def);
    function render() {
      const target = new Date(targetEl.value); const now = new Date(); const ms = target - now;
      if (isNaN(target)) { result.innerHTML = ''; return; }
      if (ms <= 0) { statusEl.textContent = 'Deadline passed'; result.innerHTML = '<div class="tool-result-big">Past due</div>'; return; }
      const days = Math.floor(ms / MS_DAY);
      statusEl.textContent = days <= 1 ? 'Urgent deadline' : (days <= 7 ? 'Coming up soon' : 'Deadline ahead');
      renderCountdown(result, ms, 'all');
    }
    targetEl.addEventListener('change', render); tickEvery(1000, render);`,
    sections: [
      ['Why countdowns help deadlines', ['A calendar event says when something is due. A countdown says how much time is left. That difference matters because remaining time is the resource you can still use.']],
      ['Project, exam, and launch deadlines', ['Use this calculator for assignments, client deliverables, product launches, applications, renewals, and travel cutoffs. Anything with a fixed date can become a visible countdown.']],
      ['Make the deadline visible', ['Left is built around this behavior: add the deadline once, then keep the remaining days or hours on your iPhone widget so it is always in sight.']]
    ],
    related: ['date-countdown-calculator', 'business-days-from-date', 'workday-countdown', 'semester-countdown-calculator'],
  },
  {
    slug: 'vacation-countdown',
    title: 'Vacation Countdown - Days Until Your Trip | Left',
    h1: 'Vacation countdown',
    desc: 'Count down to your next vacation, holiday, or trip. See days, weeks, hours, and trip length in one free vacation countdown tool.',
    cardTitle: 'Vacation countdown',
    cardDesc: 'Days until your next trip or holiday.',
    category: 'Planning countdowns',
    fields: `<div class="tool-widget__row">
        <div class="tool-widget__field"><label for="vac-start">Departure date</label><input type="date" id="vac-start" /></div>
        <div class="tool-widget__field"><label for="vac-end">Return date</label><input type="date" id="vac-end" /></div>
      </div>
      <div class="tool-result" id="vac-result" aria-live="polite"></div>`,
    script: `const startEl = document.getElementById('vac-start');
    const endEl = document.getElementById('vac-end');
    const result = document.getElementById('vac-result');
    const dep = new Date(); dep.setMonth(dep.getMonth() + 2); const ret = new Date(dep); ret.setDate(ret.getDate() + 7);
    startEl.value = toLocalDateInput(dep); endEl.value = toLocalDateInput(ret);
    function render() {
      const start = new Date(startEl.value + 'T00:00:00'); const end = new Date(endEl.value + 'T00:00:00');
      const now = new Date(); const daysUntil = Math.max(0, Math.ceil((start - now) / MS_DAY)); const tripDays = Math.max(0, Math.round((end - start) / MS_DAY));
      result.innerHTML = '<div class="tool-stat-row">' +
        '<div class="tool-stat"><div class="tool-stat-num">' + fmtNum(daysUntil) + '</div><div class="tool-stat-label">days until departure</div></div>' +
        '<div class="tool-stat"><div class="tool-stat-num">' + Math.floor(daysUntil / 7) + '</div><div class="tool-stat-label">weeks</div></div>' +
        '<div class="tool-stat"><div class="tool-stat-num">' + fmtNum(tripDays) + '</div><div class="tool-stat-label">trip days</div></div>' +
      '</div><p class="tool-result-sub">Departure: ' + formatDateLong(start) + '</p>';
    }
    [startEl, endEl].forEach(el => el.addEventListener('change', render)); render();`,
    sections: [
      ['Count down to a trip', ['A vacation countdown turns a future trip into something visible today. Enter your departure date and return date to see how many days remain and how long the trip lasts.']],
      ['Planning before departure', ['Use the remaining days for passports, bookings, packing, leave requests, pet care, and itinerary planning. A visible countdown helps prevent last-minute compression.']],
      ['Keep the trip on your Home Screen', ['Add your vacation as an Ahead date in Left to see the countdown every time you unlock your phone.']]
    ],
    related: ['date-countdown-calculator', 'days-between-two-dates', 'weeks-until-date', 'deadline-countdown-calculator'],
  },
  {
    slug: 'wedding-countdown',
    title: 'Wedding Countdown - Days Until Your Wedding | Left',
    h1: 'Wedding countdown',
    desc: 'Count down to your wedding date in days, weeks, months, hours, and minutes. Free wedding countdown calculator by Left.',
    cardTitle: 'Wedding countdown',
    cardDesc: 'Days, weeks, and months until a wedding.',
    category: 'Planning countdowns',
    fields: `<div class="tool-widget__row">
        <div class="tool-widget__field"><label for="wed-date">Wedding date</label><input type="date" id="wed-date" /></div>
      </div>
      <div class="tool-result" id="wed-result" aria-live="polite"></div>`,
    script: `const dateEl = document.getElementById('wed-date'); const result = document.getElementById('wed-result');
    const def = new Date(); def.setMonth(def.getMonth() + 9); dateEl.value = toLocalDateInput(def);
    function render() {
      const d = new Date(dateEl.value + 'T00:00:00'); const ms = d - new Date();
      if (ms <= 0) { result.innerHTML = '<div class="tool-result-big">The date has arrived</div>'; return; }
      const b = breakdown(ms);
      result.innerHTML = '<div class="tool-stat-row">' +
        '<div class="tool-stat"><div class="tool-stat-num">' + fmtNum(b.totalDay) + '</div><div class="tool-stat-label">days</div></div>' +
        '<div class="tool-stat"><div class="tool-stat-num">' + fmtNum(b.totalWeek) + '</div><div class="tool-stat-label">weeks</div></div>' +
        '<div class="tool-stat"><div class="tool-stat-num">' + fmtNum(b.totalMonth) + '</div><div class="tool-stat-label">months</div></div>' +
      '</div><p class="tool-result-sub">Wedding date: ' + formatDateLong(d) + '</p>';
    }
    dateEl.addEventListener('change', render); render();`,
    sections: [
      ['A countdown for the big date', ['Wedding planning has many deadlines, but one date anchors all of them. This calculator shows the days, weeks, and approximate months until the wedding.']],
      ['Planning milestones', ['Use the countdown to pace venue bookings, invitations, fittings, travel plans, payments, and final confirmations. A visible date makes each planning window easier to understand.']],
      ['Share the countdown', ['Create the wedding date in Left and keep it on a widget. Shared countdowns are useful for couples, family, and wedding parties who all need the same date in view.']]
    ],
    related: ['anniversary-countdown', 'date-countdown-calculator', 'days-between-two-dates', 'vacation-countdown'],
  },
  {
    slug: 'retirement-countdown-calculator',
    title: 'Retirement Countdown Calculator - Years Until Retirement | Left',
    h1: 'Retirement countdown calculator',
    desc: 'Calculate how many years, months, weeks, and days remain until retirement based on your current age and target retirement age.',
    cardTitle: 'Retirement countdown',
    cardDesc: 'Years, months, and days until retirement.',
    category: 'Planning countdowns',
    fields: `<div class="tool-widget__row">
        <div class="tool-widget__field"><label for="ret-age">Current age</label><input type="number" id="ret-age" min="0" value="35" /></div>
        <div class="tool-widget__field"><label for="ret-target">Retirement age</label><input type="number" id="ret-target" min="1" value="65" /></div>
      </div>
      <div class="tool-result" id="ret-result" aria-live="polite"></div>`,
    script: `const ageEl = document.getElementById('ret-age'); const targetEl = document.getElementById('ret-target'); const result = document.getElementById('ret-result');
    function render() {
      const age = parseFloat(ageEl.value) || 0; const target = parseFloat(targetEl.value) || 0; const years = Math.max(0, target - age);
      result.innerHTML = '<div class="tool-stat-row">' +
        '<div class="tool-stat"><div class="tool-stat-num">' + years.toFixed(1) + '</div><div class="tool-stat-label">years left</div></div>' +
        '<div class="tool-stat"><div class="tool-stat-num">' + Math.round(years * 12) + '</div><div class="tool-stat-label">months</div></div>' +
        '<div class="tool-stat"><div class="tool-stat-num">' + Math.round(years * 52.18) + '</div><div class="tool-stat-label">weeks</div></div>' +
      '</div>';
    }
    ageEl.addEventListener('input', render); targetEl.addEventListener('input', render); render();`,
    sections: [
      ['How retirement time is estimated', ['This simple retirement countdown uses your current age and target retirement age to estimate years, months, and weeks remaining. It is a planning view, not financial advice.']],
      ['Why long countdowns matter', ['Retirement is far enough away that it can feel abstract. Converting it into years and weeks makes the horizon more concrete and easier to plan around.']],
      ['Pair it with financial planning', ['Use this calculator for time awareness, then combine it with financial advice, savings targets, and retirement planning tools for money decisions.']]
    ],
    related: ['life-expectancy-calculator', 'age-calculator', 'date-countdown-calculator', 'percentage-year-calculator'],
  },
  {
    slug: 'anniversary-countdown',
    title: 'Anniversary Countdown - Days Until Your Next Anniversary | Left',
    h1: 'Anniversary countdown',
    desc: 'Count down to your next anniversary from any original date. See days remaining, years completed, and the next anniversary date.',
    cardTitle: 'Anniversary countdown',
    cardDesc: 'Days until the next yearly anniversary.',
    category: 'Since & streaks',
    fields: `<div class="tool-widget__row">
        <div class="tool-widget__field"><label for="ann-date">Original date</label><input type="date" id="ann-date" /></div>
      </div>
      <div class="tool-result" id="ann-result" aria-live="polite"></div>`,
    script: `const dateEl = document.getElementById('ann-date'); const result = document.getElementById('ann-result');
    const def = new Date(); def.setFullYear(def.getFullYear() - 3); dateEl.value = toLocalDateInput(def);
    function render() {
      const original = new Date(dateEl.value + 'T00:00:00'); const now = new Date();
      let next = new Date(now.getFullYear(), original.getMonth(), original.getDate());
      if (next < startOfDay(now)) next.setFullYear(next.getFullYear() + 1);
      const years = next.getFullYear() - original.getFullYear();
      const days = Math.ceil((next - now) / MS_DAY);
      result.innerHTML = '<div class="tool-stat-row">' +
        '<div class="tool-stat"><div class="tool-stat-num">' + fmtNum(days) + '</div><div class="tool-stat-label">days until</div></div>' +
        '<div class="tool-stat"><div class="tool-stat-num">' + years + '</div><div class="tool-stat-label">year anniversary</div></div>' +
      '</div><p class="tool-result-sub">Next anniversary: ' + formatDateLong(next) + '</p>';
    }
    dateEl.addEventListener('change', render); render();`,
    sections: [
      ['Find the next anniversary', ['Enter the original date and the calculator finds the next yearly anniversary from today. It also shows which anniversary year is coming up.']],
      ['Useful anniversary types', ['Use it for weddings, relationships, sobriety dates, launches, work anniversaries, birthdays, memorials, and personal milestones.']],
      ['Since and ahead together', ['Anniversaries combine elapsed time and future countdowns. Left supports both patterns: Since for how long it has been, Ahead for the next anniversary.']]
    ],
    related: ['days-since-date', 'wedding-countdown', 'days-until-birthday', 'date-countdown-calculator'],
  },
  {
    slug: 'sobriety-calculator',
    title: 'Sobriety Calculator - Days Sober and Next Milestone | Left',
    h1: 'Sobriety calculator',
    desc: 'Calculate days sober from your sobriety date and see your next milestone. Free sobriety day counter for recovery tracking.',
    cardTitle: 'Sobriety calculator',
    cardDesc: 'Days sober and next recovery milestone.',
    category: 'Since & streaks',
    fields: `<div class="tool-widget__row">
        <div class="tool-widget__field"><label for="sob-date">Sobriety date</label><input type="date" id="sob-date" /></div>
      </div>
      <div class="tool-result" id="sob-result" aria-live="polite"></div>`,
    script: `const dateEl = document.getElementById('sob-date'); const result = document.getElementById('sob-result');
    const def = new Date(); def.setDate(def.getDate() - 100); dateEl.value = toLocalDateInput(def);
    function render() {
      const start = new Date(dateEl.value + 'T00:00:00'); const days = Math.max(0, Math.floor((new Date() - start) / MS_DAY));
      const milestones = [7, 14, 30, 60, 90, 180, 365, 500, 730, 1000, 1825, 3650];
      const next = milestones.find(m => m > days) || (Math.ceil((days + 1) / 365) * 365);
      result.innerHTML = '<div class="tool-stat-row">' +
        '<div class="tool-stat"><div class="tool-stat-num">' + fmtNum(days) + '</div><div class="tool-stat-label">days sober</div></div>' +
        '<div class="tool-stat"><div class="tool-stat-num">' + fmtNum(next - days) + '</div><div class="tool-stat-label">days to next milestone</div></div>' +
        '<div class="tool-stat"><div class="tool-stat-num">' + fmtNum(next) + '</div><div class="tool-stat-label">next milestone</div></div>' +
      '</div>';
    }
    dateEl.addEventListener('change', render); render();`,
    sections: [
      ['A private day counter', ['This sobriety calculator counts the days since your sobriety date and shows the next common milestone. It is a simple date calculator, not medical or recovery advice.']],
      ['Why milestones help', ['Milestones like 7, 30, 90, 180, and 365 days make long-term progress easier to see. The next milestone gives the streak a near-term target.']],
      ['Keep progress visible', ['Many people use a private widget or streak tracker for recovery milestones. Left can show the day count without needing to open a separate app.']]
    ],
    related: ['days-since-date', 'habit-streak-calculator', 'anniversary-countdown', 'life-expectancy-calculator'],
  },
  {
    slug: 'habit-streak-calculator',
    title: 'Habit Streak Calculator - Count Your Current Streak | Left',
    h1: 'Habit streak calculator',
    desc: 'Calculate how long a habit streak has lasted from a start date. Estimate days, weeks, and months in your current streak.',
    cardTitle: 'Habit streak calculator',
    cardDesc: 'Count days, weeks, and months in a habit streak.',
    category: 'Since & streaks',
    fields: `<div class="tool-widget__row">
        <div class="tool-widget__field"><label for="hs-start">Streak start date</label><input type="date" id="hs-start" /></div>
        <div class="tool-widget__field"><label for="hs-missed">Missed days to subtract</label><input type="number" id="hs-missed" min="0" value="0" /></div>
      </div>
      <div class="tool-result" id="hs-result" aria-live="polite"></div>`,
    script: `const startEl = document.getElementById('hs-start'); const missedEl = document.getElementById('hs-missed'); const result = document.getElementById('hs-result');
    const def = new Date(); def.setDate(def.getDate() - 21); startEl.value = toLocalDateInput(def);
    function render() {
      const start = new Date(startEl.value + 'T00:00:00'); const raw = Math.max(0, Math.floor((new Date() - start) / MS_DAY) + 1); const missed = parseInt(missedEl.value, 10) || 0; const streak = Math.max(0, raw - missed);
      result.innerHTML = '<div class="tool-stat-row">' +
        '<div class="tool-stat"><div class="tool-stat-num">' + fmtNum(streak) + '</div><div class="tool-stat-label">streak days</div></div>' +
        '<div class="tool-stat"><div class="tool-stat-num">' + Math.floor(streak / 7) + '</div><div class="tool-stat-label">full weeks</div></div>' +
        '<div class="tool-stat"><div class="tool-stat-num">' + Math.floor(streak / 30.4375) + '</div><div class="tool-stat-label">approx. months</div></div>' +
      '</div>';
    }
    [startEl, missedEl].forEach(el => el.addEventListener('change', render)); render();`,
    sections: [
      ['What a streak calculator shows', ['A streak is the visible length of repeated effort. Enter the start date of your habit and optionally subtract missed days to estimate your active streak count.']],
      ['Streaks and habits are different', ['A streak counts continuity. A habit system tracks completion on a schedule. This calculator is best for simple day-count streaks where the main question is how long it has lasted.']],
      ['Use streaks carefully', ['Streaks can motivate, but they can also become brittle. If missing one day should not erase progress, track the habit itself in Left and use streaks as a visible reward.']]
    ],
    related: ['days-since-date', 'sobriety-calculator', 'anniversary-countdown', 'age-calculator'],
  },
  {
    slug: 'reading-time-calculator',
    title: 'Reading Time Calculator - How Long to Read Text | Left',
    h1: 'Reading time calculator',
    desc: 'Calculate how long it will take to read an article, document, book chapter, or script from word count and reading speed.',
    cardTitle: 'Reading time calculator',
    cardDesc: 'Estimate reading time from words and speed.',
    category: 'Time converters',
    fields: `<div class="tool-widget__row">
        <div class="tool-widget__field"><label for="rt-words">Word count</label><input type="number" id="rt-words" min="0" value="1200" /></div>
        <div class="tool-widget__field"><label for="rt-wpm">Reading speed (words/min)</label><input type="number" id="rt-wpm" min="1" value="225" /></div>
      </div>
      <div class="tool-result" id="rt-result" aria-live="polite"></div>`,
    script: `const wordsEl = document.getElementById('rt-words'); const wpmEl = document.getElementById('rt-wpm'); const result = document.getElementById('rt-result');
    function render() {
      const words = parseFloat(wordsEl.value) || 0; const wpm = Math.max(1, parseFloat(wpmEl.value) || 225); const min = words / wpm; const whole = Math.floor(min); const sec = Math.round((min - whole) * 60);
      result.innerHTML = '<div class="tool-result-big">' + Math.ceil(min) + ' <span class="tool-result-unit">min</span></div><p class="tool-result-sub">' + whole + ' minutes and ' + sec + ' seconds at ' + wpm + ' words per minute</p>';
    }
    wordsEl.addEventListener('input', render); wpmEl.addEventListener('input', render); render();`,
    sections: [
      ['Average reading speed', ['Many adults read non-technical material around 200 to 250 words per minute. Technical, legal, academic, or unfamiliar material can be slower. Skimming can be much faster.']],
      ['Use cases for reading time', ['Use this calculator for blog posts, essays, speeches, meeting pre-reads, scripts, study material, and documentation. It helps you decide whether something fits into the time you have.']],
      ['Turn reading into a block', ['Once you know the reading time, create a focus countdown or planner block in Left so the reading window has a visible boundary.']]
    ],
    related: ['countdown-timer', 'meeting-time-calculator', 'time-between-two-times', 'deadline-countdown-calculator'],
  },
  {
    slug: 'meeting-time-calculator',
    title: 'Meeting Time Calculator - Duration and Time Remaining | Left',
    h1: 'Meeting time calculator',
    desc: 'Calculate meeting duration, elapsed time, and time remaining from a meeting start and end time.',
    cardTitle: 'Meeting time calculator',
    cardDesc: 'Meeting duration, elapsed time, and remaining time.',
    category: 'Work & school',
    fields: `<div class="tool-widget__row">
        <div class="tool-widget__field"><label for="mt-start">Meeting starts</label><input type="datetime-local" id="mt-start" /></div>
        <div class="tool-widget__field"><label for="mt-end">Meeting ends</label><input type="datetime-local" id="mt-end" /></div>
      </div>
      <div class="tool-result" id="mt-result" aria-live="polite"></div>`,
    script: `const startEl = document.getElementById('mt-start'); const endEl = document.getElementById('mt-end'); const result = document.getElementById('mt-result');
    const s = new Date(); s.setMinutes(0,0,0); const e = new Date(s); e.setHours(e.getHours() + 1); startEl.value = toLocalInput(s); endEl.value = toLocalInput(e);
    function render() {
      const start = new Date(startEl.value); const end = new Date(endEl.value); const now = new Date(); const dur = Math.max(0, end - start); const elapsed = Math.max(0, Math.min(dur, now - start)); const left = Math.max(0, end - now);
      const bDur = breakdown(dur); const bLeft = breakdown(left);
      result.innerHTML = '<div class="tool-stat-row">' +
        '<div class="tool-stat"><div class="tool-stat-num">' + bDur.totalMin + '</div><div class="tool-stat-label">duration min</div></div>' +
        '<div class="tool-stat"><div class="tool-stat-num">' + Math.floor(elapsed / MS_MIN) + '</div><div class="tool-stat-label">elapsed min</div></div>' +
        '<div class="tool-stat"><div class="tool-stat-num">' + bLeft.totalMin + '</div><div class="tool-stat-label">minutes left</div></div>' +
      '</div>';
    }
    [startEl, endEl].forEach(el => el.addEventListener('change', render)); tickEvery(60000, render);`,
    sections: [
      ['Understand meeting duration', ['This calculator shows the planned duration, elapsed time, and remaining time for a meeting. It is useful for agendas, timeboxing, workshops, interviews, and calls.']],
      ['Keeping meetings on track', ['A visible remaining time changes the conversation. It makes it easier to move from context to decisions before the end time arrives.']],
      ['Use with countdowns', ['For important meetings, use a countdown timer or Left widget before the start time so preparation does not get squeezed.']]
    ],
    related: ['time-between-two-times', 'minutes-between-two-times', 'working-hours-calculator', 'countdown-timer'],
  },
  {
    slug: 'countdown-timer',
    title: 'Countdown Timer - Hours, Minutes, and Seconds | Left',
    h1: 'Countdown timer',
    desc: 'Start a simple countdown timer for hours, minutes, and seconds. Free browser countdown timer for focus blocks, breaks, and tasks.',
    cardTitle: 'Countdown timer',
    cardDesc: 'Simple hours, minutes, and seconds timer.',
    category: 'Planning countdowns',
    fields: `<div class="tool-widget__row">
        <div class="tool-widget__field"><label for="ct-hours">Hours</label><input type="number" id="ct-hours" min="0" value="0" /></div>
        <div class="tool-widget__field"><label for="ct-minutes">Minutes</label><input type="number" id="ct-minutes" min="0" value="25" /></div>
        <div class="tool-widget__field"><label for="ct-seconds">Seconds</label><input type="number" id="ct-seconds" min="0" value="0" /></div>
      </div>
      <button id="ct-start" class="tool-submit">Start timer</button>
      <div class="tool-result" id="ct-result" aria-live="polite"></div>`,
    script: `const hEl = document.getElementById('ct-hours'); const mEl = document.getElementById('ct-minutes'); const sEl = document.getElementById('ct-seconds'); const btn = document.getElementById('ct-start'); const result = document.getElementById('ct-result');
    let end = null; let timer = null;
    function totalMs() { return ((parseInt(hEl.value,10)||0) * 3600 + (parseInt(mEl.value,10)||0) * 60 + (parseInt(sEl.value,10)||0)) * 1000; }
    function render() {
      const ms = end ? Math.max(0, end - Date.now()) : totalMs();
      if (end && ms === 0) { clearInterval(timer); timer = null; end = null; btn.textContent = 'Start timer'; }
      renderCountdown(result, ms, 'all');
    }
    btn.addEventListener('click', () => { if (timer) { clearInterval(timer); timer = null; end = null; btn.textContent = 'Start timer'; render(); return; } end = Date.now() + totalMs(); btn.textContent = 'Reset timer'; timer = setInterval(render, 250); render(); });
    [hEl,mEl,sEl].forEach(el => el.addEventListener('input', render)); render();`,
    sections: [
      ['A simple countdown timer', ['Set hours, minutes, and seconds, then start the timer. It is useful for focus sessions, breaks, cooking, workouts, cleaning sprints, and short deadlines.']],
      ['Countdowns create boundaries', ['A timer gives a task a visible edge. Instead of working until attention fades, you work until the block ends.']],
      ['Persistent countdowns', ['For timers and deadlines you want to see outside the browser, use Left widgets and Live Activities on iPhone.']]
    ],
    related: ['deadline-countdown-calculator', 'workday-countdown', 'reading-time-calculator', 'meeting-time-calculator'],
  },
  {
    slug: 'time-zone-meeting-planner',
    title: 'Time Zone Meeting Planner - Compare Meeting Times | Left',
    h1: 'Time zone meeting planner',
    desc: 'Compare a meeting time across multiple time zones. Plan calls for New York, London, Los Angeles, Tokyo, Sydney, and more.',
    cardTitle: 'Time zone meeting planner',
    cardDesc: 'Compare one meeting time across time zones.',
    category: 'Time converters',
    fields: `<div class="tool-widget__row">
        <div class="tool-widget__field"><label for="tz-time">Meeting date and time (your local time)</label><input type="datetime-local" id="tz-time" /></div>
        <div class="tool-widget__field"><label for="tz-a">Time zone 1</label><select id="tz-a"></select></div>
        <div class="tool-widget__field"><label for="tz-b">Time zone 2</label><select id="tz-b"></select></div>
        <div class="tool-widget__field"><label for="tz-c">Time zone 3</label><select id="tz-c"></select></div>
      </div>
      <div class="tool-result" id="tz-result" aria-live="polite"></div>`,
    script: `const zones = ${JSON.stringify(TIME_ZONE_OPTIONS)};
    const timeEl = document.getElementById('tz-time'); const selects = ['tz-a','tz-b','tz-c'].map(id => document.getElementById(id)); const result = document.getElementById('tz-result');
    const def = new Date(); def.setDate(def.getDate() + 1); def.setHours(9, 0, 0, 0); timeEl.value = toLocalInput(def);
    const defaults = ['America/New_York','Europe/London','Asia/Tokyo'];
    function zoneLabel(z) { return z === 'UTC' ? 'UTC' : z.replace(/_/g, ' ').replace(/\\//g, ' / '); }
    selects.forEach((sel, i) => {
      sel.innerHTML = zones.map(z => '<option value="' + z + '">' + zoneLabel(z) + '</option>').join('');
      sel.value = defaults[i] || zones[i] || 'UTC';
    });
    function render() {
      const d = new Date(timeEl.value);
      if (Number.isNaN(d.getTime())) { result.innerHTML = '<p class="tool-result-sub">Choose a meeting date and time.</p>'; return; }
      result.innerHTML = '<div class="tool-stat-row">' + selects.map(sel => {
        const fmt = new Intl.DateTimeFormat(undefined, { timeZone: sel.value, weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(d);
        return '<div class="tool-stat"><div class="tool-stat-num" style="font-size:20px;">' + fmt + '</div><div class="tool-stat-label">' + zoneLabel(sel.value) + '</div></div>';
      }).join('') + '</div>';
    }
    [timeEl, ...selects].forEach(el => el.addEventListener('change', render)); render();`,
    sections: [
      ['Plan across time zones', ['Choose a meeting time in your local time, then compare how it appears in other cities and time zones. This helps avoid calls that are too early or too late for someone else.']],
      ['Good meeting windows', ['For global teams, look for overlap that is within normal waking or work hours for most participants. The best time is often a compromise, not the default calendar slot.']],
      ['Make the meeting visible', ['Once the meeting time is set, add a countdown in Left so the call stays visible before it starts.']]
    ],
    related: ['meeting-time-calculator', 'unix-timestamp-converter', 'unix-milliseconds-converter', 'date-countdown-calculator'],
  },
  {
    slug: 'unix-milliseconds-converter',
    title: 'Unix Milliseconds Converter - Epoch Milliseconds to Date | Left',
    h1: 'Unix milliseconds converter',
    desc: 'Convert Unix epoch milliseconds to a human date and convert any date to epoch milliseconds. Free timestamp millisecond converter.',
    cardTitle: 'Unix milliseconds converter',
    cardDesc: 'Convert epoch milliseconds and human dates.',
    category: 'Time converters',
    fields: `<div class="tool-field-grid">
        <div class="tool-widget__field"><label for="ums-input">Unix milliseconds</label><input type="number" id="ums-input" placeholder="1717000000000" /></div>
        <div class="tool-widget__field"><label for="ums-date">Date and time</label><input type="datetime-local" id="ums-date" /></div>
      </div>
      <div class="tool-result" id="ums-result" aria-live="polite"></div>`,
    script: `const msEl = document.getElementById('ums-input'); const dateEl = document.getElementById('ums-date'); const result = document.getElementById('ums-result');
    const now = new Date(); msEl.value = Date.now(); dateEl.value = toLocalInput(now);
    function fromMs() { const d = new Date(parseInt(msEl.value, 10)); if (isNaN(d)) return; dateEl.value = toLocalInput(d); render(d); }
    function fromDate() { const d = new Date(dateEl.value); if (isNaN(d)) return; msEl.value = d.getTime(); render(d); }
    function render(d) { result.innerHTML = '<div class="tool-result-big" style="font-size:clamp(28px,4vw,46px);">' + fmtNum(d.getTime()) + '</div><p class="tool-result-sub">' + formatDateTime(d) + '</p>'; }
    msEl.addEventListener('change', fromMs); dateEl.addEventListener('change', fromDate); fromMs();`,
    sections: [
      ['Seconds vs milliseconds', ['Unix time is often stored in seconds, but JavaScript and many APIs use milliseconds. A millisecond timestamp is 1,000 times larger than a Unix seconds timestamp.']],
      ['Developer-friendly conversion', ['Use this tool when debugging API payloads, logs, analytics events, database records, or browser timestamps that store time as epoch milliseconds.']],
      ['Local display', ['The converted date is shown in your local browser time zone. The millisecond number itself represents an absolute moment in time.']]
    ],
    related: ['unix-timestamp-converter', 'time-zone-meeting-planner', 'hours-between-two-dates', 'date-units-converter'],
  },
];

// ─── SEO title/description overrides ──────────────────────────────────────────
// Single source of truth for tools <title> + meta description. Titles lead with
// the natural-language query people actually search (per Search Console data) and
// stay ~≤60 chars; descriptions front-load the keyword, answer the question, and
// note the free/live/iPhone-widget angle. og:/twitter: tags derive from these.
const SEO_OVERRIDES = {
  'date-countdown-calculator': { title: 'Date Countdown Calculator - Time to Any Date | Left', desc: 'Free date countdown calculator. Pick any future date and see the exact days, hours, minutes, and seconds remaining. Track it on your iPhone with Left widgets.' },
  'time-left-in-year-calculator': { title: 'Time Left in the Year - Countdown to New Year | Left', desc: 'How much time is left in the year? See the exact days, hours, and minutes remaining until December 31st. Free, live, and tracked on your iPhone with Left.' },
  'time-passed-in-year-calculator': { title: 'Time Passed in the Year - Days & Hours Elapsed | Left', desc: 'How much of the year has passed? See the exact days, hours, and minutes elapsed since January 1st. Free live year-progress tracker, no signup required.' },
  'percentage-year-calculator': { title: 'Percentage of the Year Calculator - Year Progress | Left', desc: 'What percentage of the year has passed, and how much is left? Live year-progress calculator updated to the second. Track it on your iPhone with Left widgets.' },
  'christmas-countdown-widget': { title: 'How Many Days Until Christmas - Live Countdown | Left', desc: 'How many days until Christmas? See the exact countdown to December 25th in days, hours, minutes, and seconds. Track it live on your iPhone with Left widgets.' },
  'days-until-easter': { title: 'How Many Days Until Easter - Live Countdown | Left', desc: 'How many days until Easter Sunday? Live countdown to Western and Orthodox Easter in days, hours, and minutes. Free Easter countdown by Left.' },
  'days-until-spring': { title: 'How Many Days Until Spring - Equinox Countdown | Left', desc: 'How many days until spring? Live countdown to the spring equinox for your hemisphere in days, hours, and minutes until the first day of spring.' },
  'days-until-summer': { title: 'How Many Days Until Summer - Solstice Countdown | Left', desc: 'How many days until summer? Live countdown to the summer solstice for your hemisphere in days, hours, and minutes until the first day of summer.' },
  'days-until-fall': { title: 'How Many Days Until Fall - Autumn Countdown | Left', desc: 'How many days until fall? Live countdown to the autumnal equinox for your hemisphere in days, hours, and minutes until the first day of autumn.' },
  'days-until-winter': { title: 'How Many Days Until Winter - Solstice Countdown | Left', desc: 'How many days until winter? Live countdown to the winter solstice for your hemisphere in days, hours, and minutes until the first day of winter.' },
  'days-until-new-year': { title: 'How Many Days Until New Year - Countdown 2026 | Left', desc: 'How many days until New Year? Live countdown to January 1st, 2026 in days, hours, minutes, and seconds. Track it on your iPhone with Left widgets.' },
  'days-until-halloween': { title: 'How Many Days Until Halloween - Live Countdown | Left', desc: 'How many days until Halloween? Live countdown to October 31st in days, hours, and minutes. Track it on your iPhone Home Screen with Left widgets.' },
  'days-until-valentines': { title: "How Many Days Until Valentine's Day - Countdown | Left", desc: "How many days until Valentine's Day? Live countdown to February 14th in days, hours, and minutes. Plan ahead and track it on your iPhone with Left." },
  'days-until-thanksgiving': { title: 'How Many Days Until Thanksgiving - Countdown | Left', desc: 'How many days until Thanksgiving? Live countdown to the fourth Thursday of November in the US, in days, hours, and minutes until Thanksgiving Day.' },
  'days-until-mothers-day': { title: "How Many Days Until Mother's Day - Countdown | Left", desc: "How many days until Mother's Day? Live countdown to the second Sunday of May in days, hours, and minutes. Plan ahead with Left on iPhone." },
  'days-until-fathers-day': { title: "How Many Days Until Father's Day - Countdown | Left", desc: "How many days until Father's Day? Live countdown to the third Sunday of June in days, hours, and minutes. Plan ahead with Left on iPhone." },
  'days-until-birthday': { title: 'How Many Days Until My Birthday - Countdown | Left', desc: 'How many days until your next birthday? Enter your birthdate for a live countdown in days, hours, and minutes. Free birthday countdown calculator.' },
  'time-until-weekend': { title: 'How Long Until the Weekend - Countdown to Saturday | Left', desc: 'How many hours until the weekend? Live countdown to Saturday in days, hours, minutes, and seconds. See exactly how much of the work week is left.' },
  'days-between-two-dates': { title: 'Days Between Two Dates - Exact Day Counter | Left', desc: 'Calculate the exact number of days between two dates instantly. Free, no signup. Also count weeks, months, or hours. Track events with Left widgets on iPhone.' },
  'hours-between-two-dates': { title: 'Hours Between Two Dates - Hours Calculator | Left', desc: 'Calculate the exact number of hours between two dates and times. Free online hours calculator with a minutes and seconds breakdown.' },
  'weeks-until-date': { title: 'How Many Weeks Until a Date - Week Countdown | Left', desc: 'How many weeks until a date? Enter any future date and get the exact number of weeks remaining. Free weeks-until countdown calculator.' },
  'business-days-calculator': { title: 'Business Days Calculator - Working Days Between Dates | Left', desc: 'Calculate the number of business days between two dates. Free working-days calculator for deadlines, contracts, and project planning.' },
  'add-subtract-date-calculator': { title: 'Add or Subtract Days From a Date - Date Calculator | Left', desc: 'Add or subtract days, weeks, months, or years from any date. Free date calculator - find the date N days from today or in the past.' },
  'what-was-the-date': { title: 'What Was the Date N Days Ago - Past Date Finder | Left', desc: 'What was the date 30, 60, or 90 days ago? Enter any number of days, weeks, or months and find the exact past date. Free date calculator.' },
  'age-calculator': { title: 'Age Calculator - How Old Am I Exactly | Left', desc: 'Calculate your exact age in years, months, days, hours, and minutes. Free age calculator - enter your birthdate and see how old you are right now.' },
  'iso-week-number': { title: 'ISO Week Number - What Week of the Year Is It | Left', desc: 'What ISO week number is it today? Find the ISO 8601 week number for any date. Free week-number calculator showing current and past weeks.' },
  'minutes-between-two-times': { title: 'Minutes Between Two Times Calculator | Left', desc: 'Calculate the exact number of minutes between two times. Handles same-day and overnight ranges for shifts, classes, workouts, and meetings.' },
  'time-between-two-times': { title: 'Time Between Two Times - Hours and Minutes | Left', desc: 'Find the duration between two clock times in hours and minutes. Free time-between-times calculator with overnight support.' },
  'days-since-date': { title: 'Days Since Date - Count Days Since an Event | Left', desc: 'Count how many days, weeks, months, hours, and minutes have passed since any date. Free days-since calculator for anniversaries, streaks, and milestones.' },
  'hours-since-date': { title: 'Hours Since Date - Hours Since a Time Calculator | Left', desc: 'Calculate how many hours and minutes have passed since any date and time. Free hours-since calculator for shifts, fasting, projects, and milestones.' },
  'anniversary-countdown': { title: 'Anniversary Countdown - Days Until Your Anniversary | Left', desc: 'Count down to your next anniversary from any original date. See days remaining, years completed, and the exact next anniversary date.' },
  'sobriety-calculator': { title: 'Sobriety Calculator - Days Sober Counter | Left', desc: 'Calculate days sober from your sobriety date and see your next milestone. Free sobriety day counter for recovery tracking.' },
  'habit-streak-calculator': { title: 'Habit Streak Calculator - Count Your Streak | Left', desc: 'Calculate how long a habit streak has lasted from a start date. See days, weeks, and months in your current streak. Free streak counter.' },
  'business-days-from-date': { title: 'Business Days From Date - Add or Subtract Workdays | Left', desc: 'Add or subtract business days from any date. Find the date 5, 10, 30, 60, or 90 working days from today. Free workday calculator.' },
  'working-hours-calculator': { title: 'Working Hours Calculator - Work Hours Between Dates | Left', desc: 'Calculate working hours between two dates with custom workday start, end, lunch break, and weekday rules. Free working-hours calculator.' },
  'workday-countdown': { title: 'Workday Countdown - Time Until End of Work | Left', desc: 'How long until the end of your workday? Live countdown to your custom end-of-day time in hours, minutes, and seconds. Free workday timer.' },
  'school-days-calculator': { title: 'School Days Calculator - Weekdays Between Dates | Left', desc: 'Count school days between two dates. Estimate weekdays in a term, semester, or school year and subtract break days manually.' },
  'semester-countdown-calculator': { title: 'Semester Countdown - Weeks Left in the Term | Left', desc: 'Count down to the end of a semester. See weeks left, days left, percent elapsed, and percent remaining for school or university terms.' },
  'meeting-time-calculator': { title: 'Meeting Time Calculator - Duration & Time Left | Left', desc: 'Calculate meeting duration, elapsed time, and time remaining from a start and end time. Free meeting-time calculator for back-to-back calls.' },
  'deadline-countdown-calculator': { title: 'Deadline Countdown - Time Left Until a Deadline | Left', desc: 'Count down to any deadline in days, hours, minutes, and seconds. Free deadline countdown for projects, exams, launches, and events.' },
  'vacation-countdown': { title: 'Vacation Countdown - Days Until Your Trip | Left', desc: 'Count down to your next vacation, holiday, or trip. See days, weeks, hours, and trip length in one free vacation countdown tool.' },
  'wedding-countdown': { title: 'Wedding Countdown - Days Until Your Wedding | Left', desc: 'Count down to your wedding date in days, weeks, months, hours, and minutes. Free wedding countdown calculator by Left.' },
  'retirement-countdown-calculator': { title: 'Retirement Countdown - Years Until Retirement | Left', desc: 'Calculate how many years, months, weeks, and days remain until retirement based on your current age and target retirement age.' },
  'quarter-countdown-calculator': { title: 'Quarter Countdown - Time Left in This Quarter | Left', desc: 'How much time is left in the quarter? Count days, weeks, and percent remaining in Q1, Q2, Q3, or Q4. Free quarter-countdown calculator.' },
  'fiscal-year-progress-calculator': { title: 'Fiscal Year Progress - Percent of Fiscal Year | Left', desc: 'Calculate how much of your fiscal year has passed and how much is left. Choose any fiscal-year start month. Free fiscal-year tracker.' },
  'countdown-timer': { title: 'Countdown Timer - Hours, Minutes, and Seconds | Left', desc: 'Start a simple countdown timer for hours, minutes, and seconds. Free browser countdown timer for focus blocks, breaks, and tasks.' },
  'unix-timestamp-converter': { title: 'Unix Timestamp Converter - Epoch to Human Date | Left', desc: 'Convert Unix timestamps to human-readable dates and times, or any date to a Unix epoch timestamp. Free online Unix time converter.' },
  'unix-milliseconds-converter': { title: 'Unix Milliseconds Converter - Epoch ms to Date | Left', desc: 'Convert Unix epoch milliseconds to a human date, and any date to epoch milliseconds. Free timestamp millisecond converter for developers.' },
  'date-units-converter': { title: 'Date Units Converter - Days, Weeks, Months, Years | Left', desc: 'Convert between days, weeks, months, years, hours, and minutes. Free time-unit converter for planning and date math.' },
  'time-zone-meeting-planner': { title: 'Time Zone Meeting Planner - Compare Meeting Times | Left', desc: 'Compare a meeting time across multiple time zones. Plan calls for New York, London, Los Angeles, Tokyo, Sydney, and more.' },
  'reading-time-calculator': { title: 'Reading Time Calculator - How Long to Read | Left', desc: 'Calculate how long it takes to read an article, document, book chapter, or script from word count and reading speed. Free reading-time tool.' },
  'life-expectancy-calculator': { title: 'Life Expectancy Calculator - Years You Have Left | Left', desc: 'Estimate your life expectancy and years remaining from population baselines and research-adjusted factors: age, gender, lifestyle, health, and more.' },
  'pregnancy-due-date-calculator': { title: 'Pregnancy Due Date Calculator - When Is My Baby Due | Left', desc: 'Calculate your pregnancy due date from your last menstrual period. See your due date, current week of pregnancy, and a live countdown.' },
  'sleep-calculator': { title: 'Sleep Calculator - Best Bedtime & Wake-Up Times | Left', desc: 'Calculate the best time to sleep or wake up based on 90-minute sleep cycles. Find wake-up times that avoid sleep inertia and leave you rested.' },
  'intermittent-fasting-duration-calculator': { title: 'Intermittent Fasting Calculator - 16:8, 18:6, OMAD | Left', desc: 'Calculate your intermittent fasting window. Enter when you last ate and your fasting protocol to see exactly when your fast ends.' },
  'end-of-fasting-calculator': { title: 'End of Fasting Calculator - When Does My Fast End | Left', desc: 'Calculate exactly when your fast ends. Enter your fast start time and duration to get the precise end time and a live countdown.' },
  'fasting-countdown': { title: 'Fasting Countdown - Live Timer Until Fast Ends | Left', desc: 'Live fasting countdown timer. Set your fast end time and watch it tick down in hours, minutes, and seconds. Free fasting timer.' },
};

const allTools = [...existingTools, ...newTools].map(
  t => (SEO_OVERRIDES[t.slug] ? { ...t, ...SEO_OVERRIDES[t.slug] } : t)
);
const toolBySlug = new Map(allTools.map(t => [t.slug, t]));

const relatedOverrides = {
  'date-countdown-calculator': ['deadline-countdown-calculator', 'vacation-countdown', 'wedding-countdown', 'days-between-two-dates'],
  'days-between-two-dates': ['days-since-date', 'business-days-from-date', 'hours-between-two-dates', 'date-units-converter'],
  'hours-between-two-dates': ['hours-since-date', 'working-hours-calculator', 'meeting-time-calculator', 'minutes-between-two-times'],
  'business-days-calculator': ['business-days-from-date', 'working-hours-calculator', 'school-days-calculator', 'deadline-countdown-calculator'],
  'add-subtract-date-calculator': ['business-days-from-date', 'what-was-the-date', 'date-units-converter', 'date-countdown-calculator'],
  'what-was-the-date': ['days-since-date', 'add-subtract-date-calculator', 'days-between-two-dates', 'anniversary-countdown'],
  'age-calculator': ['retirement-countdown-calculator', 'life-expectancy-calculator', 'days-until-birthday', 'days-since-date'],
  'unix-timestamp-converter': ['unix-milliseconds-converter', 'time-zone-meeting-planner', 'hours-between-two-dates', 'date-countdown-calculator'],
  'sleep-calculator': ['countdown-timer', 'hours-between-two-dates', 'workday-countdown', 'time-until-weekend'],
  'time-until-weekend': ['workday-countdown', 'business-days-calculator', 'working-hours-calculator', 'time-left-in-year-calculator'],
  'time-left-in-year-calculator': ['quarter-countdown-calculator', 'fiscal-year-progress-calculator', 'percentage-year-calculator', 'days-until-new-year'],
  'percentage-year-calculator': ['fiscal-year-progress-calculator', 'quarter-countdown-calculator', 'time-left-in-year-calculator', 'life-expectancy-calculator'],
  'weeks-until-date': ['semester-countdown-calculator', 'vacation-countdown', 'deadline-countdown-calculator', 'pregnancy-due-date-calculator'],
  'life-expectancy-calculator': ['retirement-countdown-calculator', 'age-calculator', 'percentage-year-calculator', 'date-countdown-calculator'],
  'fasting-countdown': ['hours-since-date', 'end-of-fasting-calculator', 'intermittent-fasting-duration-calculator', 'countdown-timer'],
  'end-of-fasting-calculator': ['fasting-countdown', 'hours-since-date', 'intermittent-fasting-duration-calculator', 'countdown-timer'],
};

const groups = [
  {
    name: 'Countdowns',
    slugs: ['date-countdown-calculator', 'time-left-in-year-calculator', 'time-passed-in-year-calculator', 'percentage-year-calculator', 'christmas-countdown-widget', 'days-until-easter', 'days-until-spring', 'days-until-summer', 'days-until-fall', 'days-until-winter', 'days-until-new-year', 'days-until-halloween', 'days-until-valentines', 'days-until-thanksgiving', 'days-until-mothers-day', 'days-until-fathers-day', 'days-until-birthday', 'time-until-weekend'],
  },
  {
    name: 'Date math',
    slugs: ['days-between-two-dates', 'hours-between-two-dates', 'weeks-until-date', 'business-days-calculator', 'add-subtract-date-calculator', 'what-was-the-date', 'age-calculator', 'iso-week-number', 'minutes-between-two-times', 'time-between-two-times'],
  },
  {
    name: 'Since & streaks',
    slugs: ['days-since-date', 'hours-since-date', 'anniversary-countdown', 'sobriety-calculator', 'habit-streak-calculator'],
  },
  {
    name: 'Work & school',
    slugs: ['business-days-from-date', 'working-hours-calculator', 'workday-countdown', 'school-days-calculator', 'semester-countdown-calculator', 'meeting-time-calculator'],
  },
  {
    name: 'Planning countdowns',
    slugs: ['deadline-countdown-calculator', 'vacation-countdown', 'wedding-countdown', 'retirement-countdown-calculator', 'quarter-countdown-calculator', 'fiscal-year-progress-calculator', 'countdown-timer'],
  },
  {
    name: 'Time converters',
    slugs: ['unix-timestamp-converter', 'unix-milliseconds-converter', 'date-units-converter', 'time-zone-meeting-planner', 'reading-time-calculator'],
  },
  {
    name: 'Life & health',
    slugs: ['life-expectancy-calculator', 'pregnancy-due-date-calculator', 'sleep-calculator', 'intermittent-fasting-duration-calculator', 'end-of-fasting-calculator', 'fasting-countdown'],
  },
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/"/g, '&quot;');
}

function stripSite(title) {
  return title.replace(/\s*\|\s*Left\s*$/, '');
}

function canonical(slug) {
  return slug ? `${SITE}/tools/${slug}` : `${SITE}/tools/`;
}

function jsonScript(obj) {
  return `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n  </script>`;
}

function toolHead(tool, extraJsonLd = []) {
  const pageUrl = canonical(tool.slug);
  const ogTitle = stripSite(tool.title);
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: ogTitle,
      url: pageUrl,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: tool.desc,
      publisher: { '@type': 'Organization', name: 'Left' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Left', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE}/tools/` },
        { '@type': 'ListItem', position: 3, name: tool.h1 || ogTitle, item: pageUrl },
      ],
    },
    ...extraJsonLd,
  ];

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>${escapeHtml(tool.title)}</title>
  <meta name="description" content="${escapeAttr(tool.desc)}" />
  <meta name="theme-color" content="#FAFAFA" media="(prefers-color-scheme: light)" />
  <meta name="theme-color" content="#0C0C0E" media="(prefers-color-scheme: dark)" />
  <meta name="color-scheme" content="light dark" />
  <link rel="canonical" href="${pageUrl}" />
  <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
  <link rel="manifest" href="/favicon/site.webmanifest" />
  <meta name="robots" content="index,follow" />
  <meta property="og:title" content="${escapeAttr(ogTitle)}" />
  <meta property="og:description" content="${escapeAttr(tool.desc)}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:image" content="${OG_IMAGE}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="Left" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeAttr(ogTitle)}" />
  <meta name="twitter:description" content="${escapeAttr(tool.desc)}" />
  <meta name="twitter:image" content="${OG_IMAGE}" />
  <link rel="stylesheet" href="/style.css" />
  <link rel="stylesheet" href="/tools/tools.css" />
  ${jsonLd.map(jsonScript).join('\n  ')}
</head>
`;
}

function nav() {
  return `<nav class="top-nav top-nav--visible" aria-label="Primary">
    <div class="container nav-inner">
      <a href="/" class="brand">Left</a>
      <div class="nav-trailing">
        <div class="nav-links"><a href="/#features" class="nav-link">Features</a></div>
        <a class="btn btn-primary" href="${APP_URL}" target="_blank" rel="noopener">Download</a>
      </div>
    </div>
  </nav>`;
}

function downloadBlock() {
  return `<section class="download-block">
      <div class="section-head">
        <span class="eyebrow">Download Left</span>
        <h2>Start noticing what matters.</h2>
        <p>Download Left on your iPhone to see the time you have left, dates you are looking forward to, build the habits you want to keep, and become a better version of yourself.</p>
      </div>
      <div class="download-actions">
        <div class="download-group">
          <div class="qr-flip bento-cell" tabindex="0" role="button" aria-label="QR code - tap for instructions">
            <div class="bento-inner">
              <div class="bento-face qr-face-front">
                <div class="qr-mask"></div>
              </div>
              <div class="bento-face bento-face-back">
                <p class="qr-face-back-text">Scan with your camera to find Left on the App Store. Or search <strong>"Left"</strong> on the App Store.</p>
              </div>
            </div>
          </div>
          <a class="dl-btn" href="${APP_URL}" target="_blank" rel="noopener" aria-label="Download Left on the App Store">
            <svg class="dl-btn-apple" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.925-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>
            Download for iOS
          </a>
        </div>
      </div>
    </section>`;
}

function footer() {
  return `<footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-main">
        <div class="footer-brand">
          <span class="footer-counter-inline"><span id="userCounter">2,100,000</span> people making every moment count.</span>
          <span>Left &ndash; Coded in NZ &ndash; &copy; 2026 cntxt</span>
        </div>
        <nav class="footer-links" aria-label="Footer">
          <a href="/support.html">Support</a>
          <a href="/terms.html">Terms</a>
          <a href="/privacy.html">Privacy</a>
          <a href="/press.html">Press</a>
          <a href="/contact.html">Contact</a>
          <a href="/tools/">Tools</a>
        </nav>
      </div>
    </div>
  </footer>`;
}

function prose(sections) {
  return `<div class="tool-prose">
${sections.map(([title, paragraphs]) => `      <h2>${escapeHtml(title)}</h2>
${paragraphs.map(p => `      <p>${p}</p>`).join('\n')}`).join('\n\n')}
    </div>`;
}

function related(slugs) {
  return `<div class="tool-related">
      <h2>Related tools</h2>
      <div class="tool-related-items">
${slugs.map(slug => {
    const tool = toolBySlug.get(slug);
    return `        <a class="tool-related-item" href="/tools/${slug}">${escapeHtml(tool ? tool.cardTitle : slug)}</a>`;
  }).join('\n')}
      </div>
    </div>`;
}

function newToolPage(tool) {
  return `${toolHead(tool)}<body>
  ${nav()}

  <main class="container tool-page">
    <h1>${escapeHtml(tool.h1)}</h1>
    <p class="tool-lede">${escapeHtml(tool.desc)}</p>

    <div class="tool-widget">
      ${tool.fields}
    </div>

    ${prose(tool.sections)}

    ${related(tool.related)}

    ${downloadBlock()}
  </main>

  ${footer()}

  <script src="/tools/tools.js"></script>
  <script>
    ${tool.script}
  </script>
  <script defer src="/index.js"></script>
</body>
</html>
`;
}

function itemListJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Left free time tools',
    itemListElement: allTools.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: tool.cardTitle,
      url: `${SITE}/tools/${tool.slug}`,
    })),
  };
}

function toolsIndexPage() {
  const indexTool = {
    slug: '',
    title: 'Free Time Tools - Countdowns, Date Calculators & Time Left | Left',
    h1: 'Free time tools',
    desc: 'Free online tools by Left for countdowns, date calculators, days since, workdays, school days, sleep, fasting, year progress, time zones, Unix timestamps, and more.',
  };
  const head = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>${indexTool.title}</title>
  <meta name="description" content="${indexTool.desc}" />
  <meta name="theme-color" content="#FAFAFA" media="(prefers-color-scheme: light)" />
  <meta name="theme-color" content="#0C0C0E" media="(prefers-color-scheme: dark)" />
  <meta name="color-scheme" content="light dark" />
  <link rel="canonical" href="${SITE}/tools/" />
  <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
  <link rel="manifest" href="/favicon/site.webmanifest" />
  <meta name="robots" content="index,follow" />
  <meta property="og:title" content="Free Time Tools - Left" />
  <meta property="og:description" content="${indexTool.desc}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${SITE}/tools/" />
  <meta property="og:image" content="${OG_IMAGE}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="Left" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Free Time Tools - Left" />
  <meta name="twitter:description" content="${indexTool.desc}" />
  <meta name="twitter:image" content="${OG_IMAGE}" />
  <link rel="stylesheet" href="/style.css" />
  <link rel="stylesheet" href="/tools/tools.css" />
  ${jsonScript({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Left - Free Time Tools',
    url: `${SITE}/tools/`,
    description: indexTool.desc,
  })}
  ${jsonScript(itemListJsonLd())}
</head>`;

  const sections = groups.map(group => `<section class="tools-group">
      <h2>${escapeHtml(group.name)}</h2>
      <div class="tools-grid">
${group.slugs.map(slug => {
    const tool = toolBySlug.get(slug);
    return `        <a class="tool-card" href="/tools/${slug}"><div class="tool-card-title">${escapeHtml(tool.cardTitle)}</div><p class="tool-card-desc">${escapeHtml(tool.cardDesc)}</p></a>`;
  }).join('\n')}
      </div>
    </section>`).join('\n\n');

  return `${head}
<body>
  ${nav()}

  <main class="container tools-index">
    <h1>Free time tools</h1>
    <p class="tools-intro">A growing collection of small, fast tools from the team behind <a href="/" style="color:var(--accent);">Left</a>. Count down to dates, calculate time between moments, work out days since events, business days, school days, sleep, fasting, year progress, time zones, Unix timestamps, and more. For iPhone widgets, habits, streaks, Ahead dates, Since dates, and Planner, download Left.</p>

    ${sections}

    ${downloadBlock()}
  </main>

  ${footer()}

  <script defer src="/index.js"></script>
</body>
</html>
`;
}

function replaceHead(html, tool) {
  const bodyIndex = html.indexOf('<body');
  if (bodyIndex < 0) return html;
  return toolHead(tool) + html.slice(bodyIndex);
}

function replaceRelatedBlock(html, slugs) {
  if (!slugs || !slugs.length) return html;
  return html.replace(
    /<div class="tool-related">\s*<h2>Related tools<\/h2>\s*<div class="tool-related-items">[\s\S]*?<\/div>\s*<\/div>/,
    related(slugs)
  );
}

function normalizeExistingBody(slug, html) {
  html = html
    .replace('<div class="tool-result-big">🎉 Weekend!</div>', '<div class="tool-result-big">Weekend!</div>')
    .replace(/7\.5 hrs \(5 cycles\) ✓/g, '7.5 hrs (5 cycles, recommended)')
    .replace(/7\.5 hrs ✓/g, '7.5 hrs (recommended)')
    .replace('both count down to the moment 2025 ends and 2026 begins at midnight in your local time zone.', 'both count down to the moment the current year ends and the next year begins at midnight in your local time zone.')
    .replace('In most years, Western and Orthodox Easter fall on different Sundays - sometimes just one week apart, sometimes up to five weeks apart. In some years (such as 2025 and 2028) they coincide on the same date.', 'In most years, Western and Orthodox Easter fall on different Sundays - sometimes just one week apart, sometimes up to five weeks apart. In some years they coincide on the same date.')
    .replace('The next 53-week years after 2026 are 2032 and 2037.', 'Upcoming 53-week years include 2032 and 2037.');

  return replaceRelatedBlock(html, relatedOverrides[slug]);
}

function supportUrlFor(file) {
  if (file === 'support.html') return `${SITE}/support.html`;
  const slug = path.basename(file, '.html');
  return `${SITE}/support/${slug}.html`;
}

function ensureTagAfter(html, testRegex, tag, afterRegex) {
  if (testRegex.test(html)) return html;
  const match = afterRegex.exec(html);
  if (!match) return html;
  const insertAt = match.index + match[0].length;
  return html.slice(0, insertAt) + `\n  ${tag}` + html.slice(insertAt);
}

function removeMeta(html, nameOrProperty) {
  const attr = nameOrProperty.startsWith('og:') ? 'property' : 'name';
  const escaped = nameOrProperty.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return html.replace(new RegExp(`\\n?\\s*<meta\\b(?=[^>]*\\b${attr}="${escaped}")[^>]*\\/?>`, 'gi'), '');
}

function getMetaContent(html, property) {
  const re = new RegExp(`<meta[^>]+(?:property|name)="${property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`, 'i');
  const tag = html.match(re)?.[0] || '';
  return tag.match(/content="([^"]*)"/i)?.[1] || '';
}

function getMetaI18nAttr(html, property) {
  const re = new RegExp(`<meta[^>]+(?:property|name)="${property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`, 'i');
  const tag = html.match(re)?.[0] || '';
  return tag.match(/data-i18n-attr="([^"]*)"/i)?.[1] || '';
}

function normalizeSupportMetadata(html, file) {
  const isArticle = file.startsWith('support/');
  const pageUrl = supportUrlFor(file);
  const ogTitle = getMetaContent(html, 'og:title') || html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1] || 'Left Support';
  const ogDesc = getMetaContent(html, 'og:description') || getMetaContent(html, 'description') || '';
  const titleI18n = getMetaI18nAttr(html, 'og:title');
  const descI18n = getMetaI18nAttr(html, 'og:description');
  const titleAttr = titleI18n ? ` data-i18n-attr="${titleI18n}"` : '';
  const descAttr = descI18n ? ` data-i18n-attr="${descI18n}"` : '';

  html = html.replace(/<link rel="canonical" href="[^"]*" \/>/i, `<link rel="canonical" href="${pageUrl}" />`);
  html = html.replace(/<meta property="og:url" content="[^"]*" \/>/i, `<meta property="og:url" content="${pageUrl}" />`);

  html = removeMeta(html, 'og:type');
  html = removeMeta(html, 'og:image');
  html = removeMeta(html, 'og:image:width');
  html = removeMeta(html, 'og:image:height');
  html = removeMeta(html, 'og:site_name');
  html = removeMeta(html, 'twitter:card');
  html = removeMeta(html, 'twitter:title');
  html = removeMeta(html, 'twitter:description');
  html = removeMeta(html, 'twitter:image');

  html = ensureTagAfter(html, /property="og:type"/i, `<meta property="og:type" content="${isArticle ? 'article' : 'website'}" />`, /<meta\s+name="robots"[^>]*>/i);
  html = ensureTagAfter(html, /property="og:image"/i, `<meta property="og:image" content="${OG_IMAGE}" />`, /<meta\s+property="og:url"[^>]*>/i);
  html = ensureTagAfter(html, /property="og:image:width"/i, '<meta property="og:image:width" content="1200" />', /<meta\s+property="og:image"[^>]*>/i);
  html = ensureTagAfter(html, /property="og:image:height"/i, '<meta property="og:image:height" content="630" />', /<meta\s+property="og:image:width"[^>]*>/i);
  html = ensureTagAfter(html, /property="og:site_name"/i, '<meta property="og:site_name" content="Left" />', /<meta\s+property="og:image:height"[^>]*>/i);
  html = ensureTagAfter(html, /name="twitter:card"/i, '<meta name="twitter:card" content="summary_large_image" />', /<meta\s+property="og:site_name"[^>]*>/i);
  html = ensureTagAfter(html, /name="twitter:title"/i, `<meta${titleAttr} name="twitter:title" content="${ogTitle}" />`, /<meta\s+name="twitter:card"[^>]*>/i);
  html = ensureTagAfter(html, /name="twitter:description"/i, `<meta${descAttr} name="twitter:description" content="${ogDesc}" />`, /<meta\b[^>]*\bname="twitter:title"[^>]*>/i);
  html = ensureTagAfter(html, /name="twitter:image"/i, `<meta name="twitter:image" content="${OG_IMAGE}" />`, /<meta\b[^>]*\bname="twitter:description"[^>]*>/i);

  return html;
}

function toolsListMarkdown() {
  const lines = [];
  for (const group of groups) {
    lines.push(`### ${group.name}`);
    for (const slug of group.slugs) {
      const tool = toolBySlug.get(slug);
      lines.push(`- [${tool.cardTitle}](${SITE}/tools/${slug}): ${tool.cardDesc}`);
    }
    lines.push('');
  }
  return lines.join('\n').trim();
}

async function updateLlms() {
  const file = path.join(ROOT, 'llms.txt');
  let txt = await fs.readFile(file, 'utf8');
  const section = `## Free online tools\n\n${toolsListMarkdown()}\n\n`;
  if (/## Free online tools[\s\S]*?(?=## What Left does)/.test(txt)) {
    txt = txt.replace(/## Free online tools[\s\S]*?(?=## What Left does)/, section);
  } else {
    txt = txt.replace('## What Left does', `${section}## What Left does`);
  }
  await fs.writeFile(file, txt);
}

async function main() {
  const toolsDir = path.join(ROOT, 'tools');

  for (const tool of newTools) {
    const merged = toolBySlug.get(tool.slug);
    await fs.writeFile(path.join(toolsDir, `${tool.slug}.html`), newToolPage(merged));
  }

  for (const tool of existingTools) {
    const merged = toolBySlug.get(tool.slug);
    const file = path.join(toolsDir, `${tool.slug}.html`);
    let html = await fs.readFile(file, 'utf8');
    html = normalizeExistingBody(tool.slug, html);
    html = replaceHead(html, merged);
    await fs.writeFile(file, html);
  }

  await fs.writeFile(path.join(toolsDir, 'index.html'), toolsIndexPage());

  const supportFiles = ['support.html', ...((await fs.readdir(path.join(ROOT, 'support'))).filter(f => f.endsWith('.html')).map(f => `support/${f}`))];
  for (const rel of supportFiles) {
    const file = path.join(ROOT, rel);
    const html = await fs.readFile(file, 'utf8');
    await fs.writeFile(file, normalizeSupportMetadata(html, rel));
  }

  await updateLlms();
  console.log(`[tools-seo] wrote ${newTools.length} new tools, normalized ${existingTools.length} existing tools, updated support metadata and llms.txt`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
