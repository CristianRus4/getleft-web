// Page for the monthly habit tracker (drawing: tools/print/habits.js).
export default {
  id: 'habits',
  slug: 'printable-habit-tracker',
  order: 40,
  title: 'Printable Monthly Habit Tracker: Your Habits and Days Off | Left',
  h1: 'Printable monthly habit tracker',
  desc: 'Print a monthly habit tracker with a circle for every day. Add your own habits, the days you plan them and a goal, then print in A5, A4, A3 or Letter.',
  lede: 'One row per habit and one circle for every day of the month. Type your habits, choose the days you plan each one, and print.',
  cardTitle: 'Monthly habit tracker',
  cardDesc: 'A row of circles for each habit, with your days off marked.',
  sections: [
    ['How to use the habit tracker', [
      'Pick the month, then add up to ten habits. For each one, choose the days you plan it: every day, weekdays, weekends, Monday, Wednesday and Friday, or Tuesday and Thursday. Add a short goal, such as 10 pages or 20 minutes, and it prints under the habit name.',
      'Fill in a circle each day you keep the habit. At the end of the month, count the filled circles and write the total in the Done column, next to the number of days you planned.',
      'Not sure where to begin? Start from one of the ready-made sets, such as New Year, Reading, Dry January, No-spend or Fitness, then change anything you like.',
    ]],
    ['Days off are part of the plan', [
      'A habit you only plan three days a week should not look like a failure on the other four. Days a habit is not planned get a dashed circle and are left out of its total, so a week of Monday, Wednesday and Friday gym sessions counts as three out of three.',
      'Weekends are shaded across the whole sheet, so you can see the shape of each week at a glance.',
    ]],
    ['Paper sizes', [
      'A5 fits six habits in a planner or notebook, with two short columns for notes. A4 and Letter also print each habit’s days and goal under its name, with more room to write. A3 is a poster for the wall: ten habits, bigger circles and a third column for next month.',
      'Choose Black and white to print with black ink only, or Colour to give each habit its own colour.',
    ]],
    ['Paper and phone together', [
      'Paper is good for seeing the whole month at once. Habits in Left, part of Since, keep the same habits on your iPhone, with widgets on your Home Screen and Lock Screen and logging from your Apple Watch, so a missed tick on paper is easy to catch up.',
    ]],
  ],
  faq: [
    ['How do I print the habit tracker?', 'Choose the paper size, then press Print or save as PDF. The sheet prints in landscape. In the print window, keep the scale at 100% and margins at none or default for the best fit.'],
    ['Can I save it as a PDF?', 'Yes. Press Print or save as PDF and choose Save as PDF in the print window.'],
    ['How do I mark my days off?', 'Choose the days you plan each habit. The other days print as dashed circles and are not counted in that habit’s total.'],
    ['How many habits can I track?', 'Up to ten. A5, A4 and Letter print the first six; A3 prints all ten.'],
    ['Is anything I type uploaded?', 'No. The page is drawn in your browser, and your settings stay in the page link on your device.'],
  ],
  related: ['printable-streak-tracker', 'habit-streak-calculator', 'sobriety-calculator', 'printables'],
  card: { family: 'since', cta: 'Keep your habits on your Home Screen', links: { blog: 'how-to-build-a-streak', landing: 'habit-tracker' } },
};
