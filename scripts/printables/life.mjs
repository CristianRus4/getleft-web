// Page for the life calendar (drawing: tools/print/life.js).
export default {
  id: 'life',
  slug: 'printable-life-calendar',
  order: 80,
  title: 'Printable Life Calendar: Weeks, Months or Years | Left',
  h1: 'Printable life calendar',
  desc: 'Print your life in weeks, months or years. Add your name, birth date and lifespan, shade the time you have lived, and print in A5, A4, A3 or Letter.',
  lede: 'Your whole life on one sheet of paper. Type your name and birth date, choose weeks, months or years, and print.',
  cardTitle: 'Life calendar',
  cardDesc: 'Your life on one page, in weeks, months or years.',
  sections: [
    ['How to read the life calendar', [
      'Weeks is the classic life calendar: each column is one year of your life and each of its 52 squares is a week, with the age above every column. A small gap marks every decade and every quarter of the year. An 80-year life is a little over 4,000 squares.',
      'Months puts each decade in its own block, ten years across and twelve months down, labelled with the age the decade starts at. Years gives every year its own box, with your age in bold and the calendar year under it, so you can write a word or two about each one.',
      'With Filled in, the time you have already lived is shaded and the current week, month or year is marked in your colour. Choose Blank to shade it in yourself with a pen.',
    ]],
    ['Choosing a lifespan', [
      'The calendar runs from 50 to 120 years, and 90 is the default. Life expectancy at birth is around 73 years worldwide and above 80 in much of Europe and in Japan, but people who have already reached adulthood can usually expect to live longer than that average.',
      'You do not need an exact number. Pick a round lifespan that feels honest, or use the life expectancy calculator for an estimate based on your age and habits. A longer lifespan adds more squares, and they get smaller to fit the page.',
    ]],
    ['Paper sizes', [
      'Weeks prints in landscape and months and years in portrait. A5 fits a notebook or a planner, though the weekly squares are small. A4 and Letter work for a desk or a fridge door. A3 is a poster for the wall, with squares big enough to colour in one week at a time. Every size fits a lifespan of up to 120 years.',
    ]],
    ['Paper or screen', [
      'The interactive life in weeks calculator shows the same grid on screen, with the weeks you have lived and the weeks left. The printed version is for keeping in sight: tick off a square each Sunday, or mark the weeks and years that mattered.',
    ]],
  ],
  faq: [
    ['How do I print the life calendar?', 'Choose weeks, months or years and the paper size, then press Print or save as PDF. In the print window, keep the scale at 100% and margins at none or default for the best fit. The weeks version prints in landscape.'],
    ['Can I save it as a PDF?', 'Yes. Press Print or save as PDF and choose Save as PDF in the print window.'],
    ['How many weeks are in a 90-year life?', 'About 4,700. Each year has 52 weeks and a day or two, so 90 years is 4,680 full weeks plus a few extra days. An 80-year life is about 4,170 weeks.'],
    ['Why is the current week marked?', 'With Filled in on, the calendar shades every week, month or year you have already lived and marks the one you are in now in your colour, worked out from your birth date and today\'s date.'],
    ['Is anything I type uploaded?', 'No. The page is drawn in your browser, and your name, birth date and settings stay in the page link on your device.'],
  ],
  related: ['life-in-weeks-calculator', 'life-expectancy-calculator', 'age-calculator', 'printables'],
  card: { family: 'life', cta: 'See your life in weeks on your Lock Screen', links: { landing: 'life-calendar' } },
};
