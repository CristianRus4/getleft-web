// Page for the goal tracker (drawing: tools/print/goals.js).
export default {
  id: 'goals',
  slug: 'printable-goal-tracker',
  order: 70,
  title: 'Printable Goal Tracker: A Circle for Every Step | Left',
  h1: 'Printable goal tracker',
  desc: 'Print a goal tracker for the year with one circle per step toward each goal. Add up to four goals with a target and a date, then print in A5, A4, A3 or Letter.',
  lede: 'Pick the year, list up to four goals and give each a target. Every goal gets a row of circles to fill in as you make progress.',
  cardTitle: 'Goal tracker',
  cardDesc: 'A circle for every step toward each goal of the year.',
  sections: [
    ['How to use the goal tracker', [
      'Type each goal, its target and, if you like, the date you want it done by. Pick a unit such as km or $ and the circles are labelled for you. Colour in a circle each time you take a step.',
      'The last circle of every goal is marked in your colour. When you reach it, the goal is done.',
    ]],
    ['How the circles are counted', [
      'A target of 30 or less gets one circle for each unit, so 20 books means 20 circles. A bigger target is split into 30 circles that each stand for a round step. Run 300 km gives 30 circles of 10 km each.',
      'Leave a goal title empty and it prints a Goal line to write on. Choose the Blank template for a sheet with only write-in goals, each numbered 1 to 30.',
    ]],
    ['Paper sizes', [
      'A5 and A4 print three goals. A3 prints four, in larger rows of 15 circles, for a poster you can fill in all year. Letter prints like A4.',
    ]],
    ['Goals that you can count', [
      'Books read, kilometres run, money saved and recipes cooked all work, because each has a number you can reach. A goal like "be healthier" does not. Turn it into one you can count, such as 100 workouts.',
    ]],
  ],
  faq: [
    ['How do I print the goal tracker?', 'Choose the paper size, then press Print or save as PDF. In the print window, keep the scale at 100% and margins at none or default for the best fit.'],
    ['Can I save it as a PDF?', 'Yes. Press Print or save as PDF and choose Save as PDF in the print window.'],
    ['How many goals can I add?', 'Up to four. A5, A4 and Letter print the first three; A3 prints all four.'],
    ['What if my target is bigger than 30?', 'The goal gets 30 circles, each worth the target divided by 30, rounded to a round number. The last circle always shows your full target.'],
    ['Is anything I type uploaded?', 'No. The page is drawn in your browser, and your settings stay in the page link on your device.'],
  ],
  related: ['printable-habit-tracker', 'printable-streak-tracker', 'printables'],
  card: { family: 'since', cta: 'Count your goals in Aims on iPhone', links: { blog: 'how-to-build-a-streak', support: 'streaks-vs-habits', landing: 'habit-tracker' } },
};
