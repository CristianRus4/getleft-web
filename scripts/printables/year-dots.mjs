// Page for the year in dots (drawing: tools/print/year-dots.js).
export default {
  id: 'year-dots',
  slug: 'printable-year-in-dots',
  order: 20,
  title: 'Printable Year in Dots: A Year Progress Sheet | Left',
  h1: 'Printable year in dots',
  desc: 'Print a year in dots: one rounded square for every day, with the year as the title. Cross off each day and watch the year fill in. A5, A4, A3 or Letter.',
  lede: 'One small square for every day of the year. Pick the year, print the sheet, and fill in a square each evening.',
  cardTitle: 'Year in dots',
  cardDesc: 'One square for every day of the year, to fill in day by day.',
  sections: [
    ['How to use the year in dots', [
      'Print the sheet and put it where you will see it. At the end of each day, fill in that day’s square with a pen or a marker. By the end of the year the whole page is full.',
      'Choose Filled in to shade the days that have already passed and mark today. This only applies when the year you pick is the current year. Choose Blank to start from empty squares, for example on 1 January.',
    ]],
    ['A year progress sheet you fill in yourself', [
      'Seeing the year as a grid makes time easier to feel. Each square is one day, so a leap year has 366 and every other year has 365. Filling them in one by one shows how much of the year is behind you and how much is left.',
    ]],
    ['Paper sizes', [
      'A5 prints 17 squares across and fits a notebook or a planner. A4 and Letter print 18 across for a desk or a fridge. A3 is a poster for the wall, with large squares that are easy to fill in from a few steps away.',
    ]],
  ],
  faq: [
    ['How do I print the year in dots?', 'Choose the year and the paper size, then press Print or save as PDF. In the print window, keep the scale at 100% and margins at none or default for the best fit.'],
    ['Can I save it as a PDF?', 'Yes. Press Print or save as PDF and choose Save as PDF in the print window.'],
    ['How many squares are there?', 'One for every day: 365 in a normal year and 366 in a leap year. The sheet counts them for the year you pick.'],
    ['What does Filled in do?', 'For the current year it shades the days already gone and marks today in your colour. For any other year the squares stay blank.'],
    ['Is anything I type uploaded?', 'No. The page is drawn in your browser, and your settings stay in the page link on your device.'],
  ],
  related: ['printable-year-in-pixels', 'printable-streak-tracker', 'percentage-year-calculator', 'printables'],
  card: { family: 'year', cta: 'See the year on your Lock Screen', links: { blog: 'what-is-year-progress', landing: 'year-progress-widget' } },
};
