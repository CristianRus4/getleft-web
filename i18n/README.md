# i18n - how it works

The marketing site (`index.html`, `support.html`, support articles, `contact.html`, `press.html`, tools index + all 34 tool pages) is translated into 17 languages plus English. A build step reads the English source HTML, looks up translated strings from JSON locale files, and emits a per-language copy of every page under `/<lang>/`.

**Single source of truth**: edit `index.html`, `en.json`, etc. once - re-run the build, all 17 translated copies regenerate. Never hand-edit anything under `/de/`, `/fr/`, etc.

## Layout

```
i18n/
  locales/
    en.json       ← source of truth (English copy)
    de.json       ← German translations (keyed identically to en.json)
    fr.json
    ...
scripts/
  build-i18n.mjs  ← node scripts/build-i18n.mjs → regenerates /<lang>/ folders + sitemap.xml
  check-i18n.mjs  ← node scripts/check-i18n.mjs → reports missing keys per locale
partials/
  detect.html     ← inline language-detect script (injected into root pages by build)
  switcher.html   ← footer dropdown (injected into every translated page's footer)
```

## Annotating HTML

Put `data-i18n*` attributes on translatable nodes in the **source** (English) HTML:

| Attribute                                    | What it does                                                       |
|---------------------------------------------|-------------------------------------------------------------------|
| `data-i18n="key.path"`                       | Replace **text content** with the translated string                |
| `data-i18n-html="key.path"`                  | Replace **HTML content** (string may contain `<strong>`, `<a>` …) |
| `data-i18n-attr="attr:key,attr:key"`         | Replace attributes (e.g. `alt:hero.alt,title:hero.tt`)            |
| `data-i18n-jsonld="key.path"`                | Replace a `<script type="application/ld+json">` block             |

Key paths are dot-separated; `[N]` for arrays: `index.faq.items[2].q`.

Attributes are stripped from the generated output.

## Adding / editing a string

1. Add the English string to `i18n/locales/en.json` at the chosen key path.
2. Reference it from HTML with `data-i18n` (or `-html` / `-attr`).
3. Translate it in each `<lang>.json` file. Missing keys fall back to English (with a warning); use `--allow-missing` to permit a missing-key build, otherwise the build fails.
4. Run `node scripts/build-i18n.mjs`.

## Adding a new language

1. Create `i18n/locales/<lang>.json` mirroring `en.json`.
2. Append the new code to the `SUPPORTED` array in `partials/detect.html` and `partials/switcher.html`.
3. Append the new locale to the `LOCALES` constant in `scripts/build-i18n.mjs`.
4. Add an `<option>` to the switcher partial.
5. Run the build.

## Excluded pages

These stay English-only - the build script never touches them:

- `privacy.html`, `terms.html`
- `web.html` (the web app shell)
- `404.html`
- `/blog/*`
- `/invite/*`
- `/.well-known/*`
- `/download.html`

## Detection & switcher behavior

- On any root English page, an inline script in `<head>` reads `navigator.languages`, picks the best match against the supported list (with regional fallbacks: `es-MX` → `es-419`, `pt-PT` → `pt`, `zh-TW` → `zh-Hant`), and redirects to `/<lang>/<path>`.
- Override via `?lang=de`, or via the footer switcher (writes `localStorage['left.lang']`).
- Override `en` keeps the user on English.
- `?nolang=1` disables the auto-redirect (useful for crawlers/testing).

## Build & verify

```bash
node scripts/build-i18n.mjs            # strict
node scripts/build-i18n.mjs --allow-missing   # permissive
node scripts/check-i18n.mjs            # coverage report
```
