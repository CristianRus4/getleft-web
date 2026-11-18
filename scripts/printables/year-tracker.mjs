// Page for the year in pixels (drawing: tools/print/year-tracker.js).
export default {
  id: 'year-tracker',
  slug: 'printable-year-in-pixels',
  order: 50,
  title: 'Printable Year in Pixels: One Square for Every Day | Left',
  h1: 'Printable year in pixels',
  desc: 'Print a year in pixels for one habit or your mood: one square for every day, months down the side. Colour it in each day. A5, A4, A3 or Letter.',
  lede: 'Twelve rows, one square for every day. Track one habit or colour in how each day felt, then print in A5, A4, A3 or Letter.',
  cardTitle: 'Year in pixels',
  cardDesc: 'A square for every day of the year, for one habit or your mood.',
  sections: [
    ['How to use the year in pixels', [
      'Months run down the side and the days 1 to 31 run across, so each square is one day. Pick the year, choose Habit, Mood or Blank, and type your goal or habit if you want it printed on the line at the top.',
      'Each day, fill in that day’s square. For a habit, colour it when you do it. For a mood, pick a colour for how the day felt and keep the same colours all year.',
    ]],
    ['One habit or your mood', [
      'Habit prints the line “My goal is”, so you can write what you are tracking. Mood prints “This year I feel”, so you can colour each day by how it felt, with a colour key you write in the margin. Blank leaves the line empty.',
    ]],
    ['Paper sizes', [
      'All sheets print landscape. A5 keeps the squares and the month names, small enough for a notebook. A4 and Letter add a Total column to count the days each month. A3 is a poster with bigger squares and room for a colour key beside it.',
    ]],
  ],
  faq: [
    ['How do I print the year in pixels?', 'Choose the year, template and paper size, then press Print or save as PDF. In the print window, choose landscape if it is not already set, keep the scale at 100% and margins at none or default.'],
    ['Can I save it as a PDF?', 'Yes. Press Print or save as PDF and choose Save as PDF in the print window.'],
    ['What is a year in pixels?', 'A grid with one square for every day of the year. You colour each square when the day is over, so the finished page shows the whole year at a glance.'],
    ['Can I use it for mood?', 'Yes. Choose the Mood template, make a small colour key, and colour each day to match how it felt.'],
    ['Is anything I type uploaded?', 'No. The page is drawn in your browser, and your settings stay in the page link on your device.'],
  ],
  related: ['printable-year-in-dots', 'printable-streak-tracker', 'printable-habit-tracker', 'printables'],
  card: { family: 'year', cta: 'See the year on your Lock Screen', links: { blog: 'what-is-year-progress', landing: 'year-progress-widget' } },
};
