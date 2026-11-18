// Page for the streak tracker (drawing: tools/print/streak.js).
export default {
  id: 'streak',
  slug: 'printable-streak-tracker',
  order: 60,
  title: 'Printable Streak Tracker: 30, 66 or 100 Day Challenge | Left',
  h1: 'Printable streak tracker',
  desc: 'Print a 30, 66 or 100 day streak tracker with one circle per day. Add your habit and start date, then print in A5, A4, A3 or Letter.',
  lede: 'One circle for every day of your streak. Type the habit and the day you start, pick 30, 66 or 100 days, and print.',
  cardTitle: 'Streak tracker',
  cardDesc: 'A circle for every day of a 30, 66 or 100 day streak.',
  sections: [
    ['How to use the streak tracker', [
      'Write the habit at the top, or type it above so it prints in your colour. Fill in one circle each day you keep it. When you miss a day, note it under Restarts and start a new run; the longest run goes under Longest streak.',
      'Add a start date and every circle shows its day of the month, so you can see at a glance which days are done.',
    ]],
    ['30, 66 or 100 days?', [
      '30 days is a good first challenge: long enough to notice a change, short enough to see the end. 66 days is the average time it took people in a well-known habit study to make a new behaviour automatic. 100 days turns a habit into part of your year.',
    ]],
    ['Paper sizes', [
      'A5 keeps the circles and two fields, small enough for a planner or a notebook. A4 and Letter add the boxes for why you are doing it and the reward at the end. A3 is a poster for the wall, with bigger circles and more room to write.',
    ]],
  ],
  faq: [
    ['How do I print the streak tracker?', 'Choose the paper size, then press Print or save as PDF. In the print window, keep the scale at 100% and margins at none or default for the best fit.'],
    ['Can I save it as a PDF?', 'Yes. Press Print or save as PDF and choose Save as PDF in the print window.'],
    ['How long does it take to build a habit?', 'In one study it took people 66 days on average for a new habit to feel automatic, with a wide range from about 18 to 254 days. Missing a single day did not undo the progress.'],
    ['Is anything I type uploaded?', 'No. The page is drawn in your browser, and your settings stay in the page link on your device.'],
  ],
  related: ['printable-habit-tracker', 'printable-goal-tracker', 'habit-streak-calculator', 'printables'],
  card: { family: 'since', cta: 'Keep your streak on your Home Screen', links: { blog: 'how-to-build-a-streak', landing: 'habit-tracker' } },
};
