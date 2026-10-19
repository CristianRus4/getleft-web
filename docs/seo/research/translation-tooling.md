# Translation tooling for getleft.app (read-only report)

## 1. translation-engine (`/Users/cristian/Developer/Tools/translation-engine`, v0.6.0)

**Basics**
- App-agnostic Node 22 CLI. Binary: `bin/translation-engine.js`, which loads `dist/cli.js`. The `dist/` build is present, so the command runs without a build step.
- The README (lines 1-15) says it makes no network calls and uses no paid provider. The `generate` command was removed in 0.6 (`src/cli.ts:46`).
- It has no persistent translation memory, no source fingerprints and no publish command (`README.md:11`). Memory and code context are built in RAM and discarded on exit.
- The agent does the translating. The engine supplies context and validates the result.

**Adapters** (README table, line 44)
- `web-json`: flat or nested objects, root strings and ordered arrays. It can create missing branches or target files on `apply`.
- `xcstrings`: for Xcode catalogs.
- `markdown`: Markdown/MDX blocks, links, code and placeholders. **Read-only**, and write attempts are rejected.
- **There is no HTML adapter.** Blog posts, tool pages and the HTML templates cannot be handled directly. Only JSON catalogs, plus read-only audit of `.md` or `.mdx` files, are supported.
- HTML copy would first need to be extracted into JSON keys. The site already does this with `data-i18n` attributes and `en.json`.

**Commands** (README lines 53-63; `src/cli.ts:56-113`)
- `summary`: coverage per locale, issue counts and register.
- `audit` / `validate`: full JSON diagnostics; exits 1 when any error remains.
- `report`, `coverage`, `context`, `profile --locale`.
- `packet --locale [--review|--all|--limit|--offset|--exclude|--no-usage]`.
- `draft [--locale]`: deterministic values for empty units only.
- `apply --input FILE… [--dry-run]`: atomic write.
- `--output FILE` refuses to overwrite an existing file.

**What it validates**
- Catalog structure and exact locales.
- Placeholders, links and markup.
- Protected terms. `Left` is configured as an ordinary word, so a missing occurrence is only a warning.
- Content policy: `editorial`, `personNames`, `productNames` and `placeNames`.
- Glossary.
- Register, as warnings: de du/Sie, fr tu/vous, es, it, nl, ru, pl. It uses the configured value or the observed dominant form.
- Regional variety, as warnings (es vs es-419, pt-PT vs pt-BR).
- Script mismatches, as warnings: zh-Hans vs zh-Hant, and values with no characters of the locale's script.
- Language mismatches, as warnings: English text left inside another language.
- Source-equal values, as review warnings.
- Missing, empty and extra units.
- Plurals (CLDR) and review states, which matter for `xcstrings`.

**Source hashes and staleness**
- It does **not** track source hashes or fingerprints (README line 11). I found no staleness detection for `web-json`.
- If the English text of a key changes while the key stays the same, the engine cannot detect that the translation is out of date.
- The `stale` field in packets only reflects Xcode's `stale` marker for `xcstrings`.
- The app repo uses `localization-catalog-tool.js --since <ref>` for this (per its AGENTS.md). I did not read that script.
- A website equivalent would be a git diff of `en.json` against the last deploy or tag.

**Invocation against the site**
- Config: `/Users/cristian/Developer/Webs/getleft-web/docs/translation.config.json`.
  - Catalog `left-website`, adapter `web-json`, source `../i18n/locales/en.json`, 17 target locales.
  - `protectedTerms`: Left (ordinary word), Apple, Todoist.
  - `varieties`: `{pt: pt-PT}`.
  - `register`: informal for de, es, es-419, fr, it, nl, pl; formal for ru.
  - `contentPolicy.productNames`: `["common.footer.tagline"]`.
  - `glossary` covers Time Left, Left Time, Time Ahead, Time Since, Time Between and others, across all 17 locales.
- `varieties: {pt: pt-PT}` against the `pt` locale and the glossary is worth checking. The README says plain `pt` means Brazilian Portuguese. The locale list is `pt` only.
- Run from anywhere. Paths in the config resolve relative to the config file.

**Exact read-only pre-deploy command**
```sh
node /Users/cristian/Developer/Tools/translation-engine/bin/translation-engine.js validate --config /Users/cristian/Developer/Webs/getleft-web/docs/translation.config.json
```
- `audit` is equivalent. `validate` exits 1 on any error, 0 otherwise.
- Without `--output` it writes nothing. I ran `summary` and `audit` this way.
- Add `summary` for a human-readable view.
- To fail on warnings as well, parse the JSON `summary.warnings`. The engine itself only fails on errors.
- It would be worth adding `node scripts/check-i18n.mjs` alongside it as a second check.

**Result of running `summary` and `audit` today**
- `left: OK — 0 errors, 17 warnings`.
- All 17 warnings are `kind: extra`, one per locale: `_meta.status` has "no source unit". This is harmless, because `_meta` is not in `en.json`.
- Source units: 1293. Every locale is 1293/1293 (100%).
- No regional, register, protected-term or placeholder warnings were raised.

## 2. `scripts/check-i18n.mjs`

- Read-only: only `readdir` and `readFile` (lines 30-37), and it exits 1 if any locale has missing keys. I ran it.
- It flattens string leaves and skips keys that start with `_`.
- It only compares key sets. It checks no values, placeholders or staleness.
- Output for every locale: `[OK ] <file> missing=0 extra=0`.
  - Locales: de, es-419, es, fr, hi, id, it, ja, ko, nl, pl, pt, ro, ru, tr, zh-Hans, zh-Hant.
  - Exit code 0.

## 3. Key counts and untranslated values

Command: a Python `-I` one-liner that flattens `i18n/locales/*.json`, skips `_` keys, and compares each locale to `en.json`.

`en.json` has 1290 string leaves. The engine counts 1293 units; I did not reconcile the 3-unit difference.

| Locale | Keys | Missing | Extra | Identical to EN (all) | Identical, multi-word values | `_meta.status` |
|---|---|---|---|---|---|---|
| de | 1290 | 0 | 0 | 13 | 5 | translated |
| es | 1290 | 0 | 0 | 9 | 5 | translated |
| es-419 | 1290 | 0 | 0 | 9 | 5 | translated |
| fr | 1290 | 0 | 0 | 12 | 6 | translated |
| hi | 1290 | 0 | 0 | 8 | 5 | translated |
| id | 1290 | 0 | 0 | 9 | 6 | translated |
| it | 1290 | 0 | 0 | 10 | 5 | translated |
| ja | 1290 | 0 | 0 | 7 | 5 | translated |
| ko | 1290 | 0 | 0 | 8 | 5 | translated |
| nl | 1290 | 0 | 0 | 17 | 7 | translated |
| pl | 1290 | 0 | 0 | 12 | 5 | translated |
| pt | 1290 | 0 | 0 | 8 | 5 | translated |
| ro | 1290 | 0 | 0 | 12 | 6 | translated |
| ru | 1290 | 0 | 0 | 7 | 5 | translated |
| tr | 1290 | 0 | 0 | 8 | 5 | translated |
| zh-Hans | 1290 | 0 | 0 | 8 | 5 | translated |
| zh-Hant | 1290 | 0 | 0 | 8 | 5 | translated |

- "Multi-word" means the value contains a space and is longer than 3 characters.
- The identical values cluster in `index.features` (2), `common.footer` (1), `index.bento` (1-2), `support.support` (1) and `contact.meta` (1, in fr, nl and ro).
- Most of these look like brand, feature-name or URL-style values, so coverage is effectively complete.
- Candidates for a review are the `contact.meta` entry in fr, nl and ro, and the higher nl count (17).
- I did not list the individual keys. UNVERIFIED which are intentionally untranslated.

## 4. The two documents

**`/Users/cristian/Developer/Webs/getleft-web/translations.md`** (237 lines)
- It is a translator and maintainer guide:
  - Status table.
  - Scope of what gets translated.
  - Workflow.
  - What not to translate.
  - Tone, `_meta` block, regional variants, length and layout, and a checklist.
  - A maintainers section on adding English-only pages, adding translatable pages (`SOURCE_PAGES` / `SOURCE_DIRS`, `data-i18n` attributes), adding a language (four lists to update) and build commands.
- **Stale status section** (lines 5-21): it says 15 locales are `partially_translated` and only es and es-419 are `translated`. In fact all 17 are `translated`, in both `_meta.status` and coverage.
- **Scope**: only the homepage, contact, support index and support articles are translated. Press, tools, blog, privacy and terms are English-only by design (lines 23-27).
- **Build**: `build-i18n.mjs` regenerates `/<code>/` folders, `sitemap.xml` with hreflang alternates, and the injected hreflang blocks and footer switcher. I read it but did not run it.

**`/Users/cristian/Developer/Webs/getleft-web/content.md`** (642 lines)
- It is the English source-of-truth content brief for the homepage copy:
  - Core idea.
  - Product summary.
  - Message hierarchy.
  - Target user.
  - Tone.
  - A three-word framework.
  - Core and secondary features.
  - Homepage structure.
  - "Final Website Copy" (lines 315-635).
  - Implementation notes (lines 636-642): keep FAQ structured data in sync, order the features as Time Left, Habits & Streaks, Ahead, Planner, and avoid claims about users or revenue.
- It is not machine-read, so it can drift from `index.html` and `en.json`. That drift is UNVERIFIED.

## Gaps relevant to the SEO and translation plan
- No HTML-document translation path exists. Blog, tool and press pages are English-only, and the build excludes them (`build-i18n.mjs` `EXCLUDED_PATH_PREFIXES`, per `translations.md`).
- There is no source-change staleness check for the website.
- The engine's `validate` step is not yet wired into any pre-deploy check. I did not look for CI config; there is no `.github/workflows` in the site repo.
- The `build-i18n.mjs.bak` file sits in `scripts/`.
