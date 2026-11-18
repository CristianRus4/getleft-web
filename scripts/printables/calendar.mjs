// Page for the year calendar (drawing: tools/print/calendar.js).
export default {
  id: 'calendar',
  slug: 'printable-year-calendar',
  order: 10,
  title: 'Printable Year Calendar: 12 Months on One Page | Left',
  h1: 'Printable year calendar',
  desc: 'Print a year calendar with all 12 months on one page. Choose dates, days left, dots or squares, mark birthdays and holidays, and print in A5, A4, A3 or Letter.',
  lede: 'The whole year on one page. Pick the year and a style, mark the dates that matter and print.',
  cardTitle: 'Year calendar',
  cardDesc: 'All twelve months on one page, with your dates marked.',
  sections: [
    ['How to use the year calendar', [
      'Choose the year and whether your week starts on Monday or Sunday. The page starts with the coming year and the usual first day of the week for your region. Each month has a thin bar under its name that shows where it sits in the year.',
      'Add the dates you want to see at a glance, such as birthdays, holidays, trips or deadlines. Each one gets a ring in your colour on the calendar. A date marks the same day in whichever year you print, so a birthday stays marked if you change the year.',
    ]],
    ['Four styles', [
      'Dates is a classic calendar with the day numbers. Days left counts down instead: 1 January shows 365, or 366 in a leap year, and 31 December shows 1. Dots and Squares replace the numbers with a shape for every day, to fill in or cross off as each one passes. Both come filled or as outlines.',
      'Weekends print in grey in Dates and Days left, so the working week stands out.',
    ]],
    ['Paper sizes', [
      'A5 fits a planner or a notebook: twelve months in three columns and nothing else. A4 and Letter add how many days are left in the year at the start of each month, and two lists for your goals and the dates to remember. A3 is a wall calendar with four columns, a write-in box for every day in Dates and Days left, and a third list for notes.',
      'On A4, A3 and Letter, goals you type print on the numbered lines, and the dates you mark print under Dates to remember, in date order.',
    ]],
  ],
  faq: [
    ['How do I print the year calendar?', 'Choose the year, the style and the paper size, then press Print or save as PDF. In the print window, keep the scale at 100% and margins at none or default for the best fit.'],
    ['Can I save it as a PDF?', 'Yes. Press Print or save as PDF and choose Save as PDF in the print window.'],
    ['Can I start the week on Sunday?', 'Yes. Pick Monday or Sunday under Week starts on. The page starts with the usual choice for your region.'],
    ['What does Days left show?', 'Each day shows how many days of the year are left, counting that day. It is the same number on every copy, so you can see how much of the year is ahead without counting.'],
    ['Is anything I type uploaded?', 'No. The page is drawn in your browser, and your settings stay in the page link on your device.'],
  ],
  related: ['printable-year-in-dots', 'printable-monthly-planner', 'time-left-in-year-calculator', 'printables'],
  card: { family: 'year', cta: 'See the days left on your Lock Screen', links: { blog: 'what-is-year-progress', landing: 'year-progress-widget' } },
};
