# Printables

Printable tools live under `/tools/printable-*` with a hub at `/tools/printables`.
Visitors fill in their own details (habits, dates, goals, name, birth date), pick a
paper size and print, or save a PDF from the print window. Everything is drawn in
the browser; settings live in the URL hash, which is never sent to a server.

## One set of parts for every printable

Every sheet is drawn from the shared parts in `tools/print/core.js` (`LeftPrint.P`),
and their look lives only in `tools/print/print.css`. Change a part there and it
changes on every printable and every paper size.

| Part | Use |
| --- | --- |
| `P.head({ title, sub, right, size, subSize })` | Big title, optional subtitle on its baseline, then the rule |
| `P.rule({ inline })` | The black rule under a header; `inline` runs on from a title |
| `P.check({ s, label, fs, accent, off, done, fluid, color })` | Circle: habits, streaks, goals, checks |
| `P.day({ s, label, fs, past, now, accent, filled, blank, fluid })` | Rounded square: days, weeks, months that pass |
| `P.box({ n, sub, fs, r, pad, accent, muted, shaded, past, empty, inner })` | Rounded write-in box with a number in the corner |
| `P.lines(count, { row, faint, texts, fs })` | Write-in lines, optionally with typed text on them |
| `P.field(label, { value, lab, lineH, w })` | Small grey label over a line or a typed value |
| `P.section(title, body, { fs, gap })` | Bold section title over a body (Notes, Goals for 2027) |
| `P.label(text, { fs, ink, accent })` | Small grey labels: weekday initials, day numbers, ages |

Rules for printable code:

- Use the parts for every circle, square, box, line, field, title and rule. Printable
  code only sets layout (grid, flex, gaps, sizes) and sizes through the part options.
  Never restyle a part inline (no border, radius, colour or weight on a part).
- A new visual variant goes into `core.js` and `print.css` as a shared option, so
  every printable can use it.
- Colours are CSS variables on the sheet: `--ink`, `--muted`, `--stroke`, `--past`,
  `--writeline`, `--hair`, `--shade`, `--boxline`, `--accent`. Layout code may use
  them (for example a weekend column on `var(--shade)`).

## Paper sizes

`PAPERS` and `TIERS` in `core.js`. A5, A4, A3 and US Letter; Letter uses the A4 tier
(type sizes and spacing) with its own page box (816 × 1056 px). A printable's
`render(state, ctx)` gets `ctx.w`, `ctx.h`, `ctx.cw`, `ctx.ch` (content box), `ctx.px`,
`ctx.py`, `ctx.rule`, `ctx.ruleGap`, `ctx.lw` and `ctx.pick({ A5, A4, A3 })` for
per-size settings. Each size is laid out for its paper: A5 drops the small extras,
A3 adds rows, lists and write-in boxes. Compute grid sizes from `ctx.cw`/`ctx.ch` so
Letter fits too.

## Adding a printable

1. `tools/print/<id>.js`: `LeftPrint.define({ id, orientation, fields, render, thumb })`.
   See `tools/print/streak.js`.
2. `i18n/tools-runtime/print/<id>.json`: every English string the drawing and its
   controls use, read with `t('<id>.<key>', vars)`. Month and weekday names come from
   `fmt` (Intl, in the page's language), never from strings.
3. `scripts/printables/<id>.mjs`: the page (slug `printable-…`, titles, copy, FAQ,
   related tools, result-card settings). See `scripts/printables/streak.mjs`.
4. `node scripts/build.mjs`. The tools step builds the page and the hub, merges the
   strings into `i18n/tools-runtime/en.json` under `print` and writes
   `tools/print/strings.js` (the English fallback; do not edit).

Field types for `fields`: `text`, `number`, `date`, `segment`, `select`, `year`,
`month`, `list` (rows of sub-fields). Options: `label` (string key), `placeholder`,
`def` (value or `({ t, fmt, util }) => value`), `when(state)`, `half` (two per row),
`max`, `min`, `options: [{ v, label | text }]`. Paper and colour are added to every
printable.

## Translation

Printed and control text is runtime text: English in `i18n/tools-runtime/print/*.json`,
translations in `i18n/tools/<lang>.json` under `tools.runtime.print`. The page copy
(title, headings, FAQ) is translated like every other tool page, through the hash
catalogs in `i18n/tools/<lang>.json`.
