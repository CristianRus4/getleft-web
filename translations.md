# Translating Left's website

This document is for translators. Read it once, then translate one JSON file and you are done. No code changes, no build commands required — that part is handled by the developer.

## 1. What you are translating

Only four areas of the Left website are translated. Everything else (press, tools, blog, privacy, terms) stays English-only.

The translated pages are:

- **Homepage** — `/` (index.html)
- **Contact** — `/contact`
- **Support index** — `/support`
- **Support articles** — every page under `/support/*` (12 step-by-step guides for widgets, Shortcuts, Focus modes, etc.)

The marketing site is built from a single source of truth in English: [i18n/locales/en.json](i18n/locales/en.json). Every other language lives in its own JSON file in the same folder, with **identical keys** to the English file. Your job is to translate every string **value** in your language's file. The keys never change.

```
i18n/locales/
  en.json        ← source of truth, never edit
  es.json        ← Spain Spanish (already done)
  es-419.json    ← Latin American Spanish (already done)
  fr.json        ← French (your turn, for example)
  de.json
  it.json
  ja.json
  ko.json
  nl.json
  pl.json
  pt.json
  ro.json
  ru.json
  tr.json
  id.json
  zh-Hans.json
  zh-Hant.json
```

If your language file already contains English copy, that means it has not been translated yet and is waiting for you. The `_meta.status` field will say `"untranslated"`.

## 2. How to work

- Open `en.json` side by side with the language file you are translating.
- Go **string by string, top to bottom**. Read each English value in context (look at the keys around it, the section it belongs to), then rewrite it as natural prose in your language. Do not translate word for word — translate the meaning.
- The structure stays identical. Same keys, same array lengths, same nesting. Only the string values change.
- Do **not** use a dictionary, find-and-replace, or any kind of automation. Every string is read and rewritten by a human (or a careful translator) in context. This is what makes the copy feel native instead of robotic.

## 3. What NOT to translate

Some words must remain in English because they are brand names, product feature names, or proper nouns from Apple. Leave these exactly as they appear in `en.json`:

### Brand and company
- `Left` (the app name)
- `Left Premium`
- `cntxt` (the company)
- `Coded in NZ`

### Product feature names (used as chips, section labels, navigation)
- `Time Left`
- `Habits & Streaks`
- `Ahead`
- `Planner`
- `You`
- `Time Between`
- `Friends`
- `Left Wallpaper`
- `Live Activities`
- `Since` (also `Shared Since`, `Joint Ahead`)
- `Left Time`

These are the marketing names for sections of the app. Keep them English so they match the screenshots, the App Store, and the in-app UI.

### Apple platform terms
- `iPhone`, `iPad`, `iOS`, `iPadOS`, `macOS`
- `App Store`
- `Apple ID`
- `StandBy`
- `Dynamic Island`
- `Apple Calendar`, `Apple Reminders`, `Apple Shortcuts` (the apps, with the "Apple" prefix)
- `HealthKit`, `WeatherKit`
- `Siri`
- `iCloud`, `iCloud Drive`
- `Face ID`, `Touch ID`
- `Mac`, `Mission Control`, `Notification Center`
- `Action Button`
- `Family Sharing`

> Note on `Home Screen` and `Lock Screen`: in body copy, the natural localised form (for example, *pantalla de inicio* / *pantalla bloqueada* in Spanish, *écran d'accueil* in French) reads better than keeping it English. Use the natural form your language's Apple localisation uses.

### Don't translate inside strings either
- HTML tags and attributes: `<strong>`, `<a href="…">`, `<br />`, `target="_blank"`, etc. Keep the tags exactly; translate the visible text between them.
- HTML entities: `&amp;`, `&nbsp;`, `&hellip;`, `&times;`
- Placeholder tokens: `${variable}`, `{count}`, `%s` — keep verbatim
- URLs and `href` targets
- Email addresses (`info@getleft.app`)
- Numbers, dates, app IDs in URLs
- Names of buttons that are themselves English UI in iOS (when wrapped in `<strong>` inside an instruction list, leave the literal button name as it appears in the OS for that language — Apple translates `Add Widget` → `Añadir widget` in Spanish, for example, so use the Apple-localised form)

## 4. Tone of voice

Left is a time-awareness app. The copy is meant to feel:

- **Minimal, direct, considered.** Short sentences. No filler.
- **Slightly confronting about time, but never shaming.** The line is: your time is finite, here it is, now choose what matters.
- **Human and calm**, not corporate, not hype, not wellness-cliché.

**Avoid** corporate productivity language ("unlock your potential," "crush your goals," "supercharge"), generic app-store fluff ("the ultimate app"), and overly soft wellness clichés ("transform your life," "find inner peace"). The English source already avoids these — your translation should too.

**Address the user informally** (the equivalent of "you" rather than "you, sir"): *tú* in Spanish, *du* in German, *tu* in French, casual form in Japanese/Korean, etc. — whatever is standard for consumer products in your language.

In the support articles (step-by-step tutorials), keep the instructional voice clear and direct. Steps should read like instructions, not marketing copy.

If you are unsure about voice, read [content.md](content.md) — it documents the full message hierarchy and tone guidelines for the product.

## 5. The `_meta` block

At the top of every language file there is a `_meta` block:

```json
"_meta": {
  "language": "Español (España)",
  "htmlLang": "es-ES",
  "dir": "ltr",
  "status": "untranslated"
}
```

When you finish translating, change `"status": "untranslated"` to `"status": "translated"`. Leave `language`, `htmlLang`, and `dir` alone.

## 6. Regional variants

Where regional vocabulary differs (Spain Spanish vs. Latin American Spanish, Brazilian Portuguese vs. European Portuguese, Simplified vs. Traditional Chinese), use the variant that matches the file name:

- `es.json` → Spain Spanish (*tú*, *vosotros*, vocabulary used in Spain)
- `es-419.json` → Latin American Spanish (*tú*, *ustedes*, neutral pan-regional vocabulary)
- `pt.json` → European Portuguese
- `zh-Hans.json` → Simplified Chinese (mainland)
- `zh-Hant.json` → Traditional Chinese (Taiwan / Hong Kong)

Keep word choice consistent with how Apple localises its system UI for that region. When in doubt, check how Apple translates `Home Screen`, `Lock Screen`, `Reminders`, etc. on apple.com for that locale, and follow that convention.

## 7. Length and layout

- The site has fixed UI elements (buttons, chips, navigation links). When translating short labels like `Features`, `Download`, `Notice. Act. Become.`, keep your translation roughly the same length as the English original. Very long renderings can break the layout.
- For body copy, normal sentence length is fine — but avoid expanding every sentence by 50%. Stay tight.
- Punctuation should follow your language's conventions: French spaces before `:` and `?`, Spanish opening `¿` and `¡`, etc.

## 8. Once you are done

That is it. Save the file. Hand it back to the developer. They will run the build (`node scripts/build-i18n.mjs`) and the translated pages will appear under `/<lang>/` on the site.

You do **not** need to:
- Touch any HTML file
- Run any commands
- Edit anything outside the one JSON file you were assigned

If `node scripts/check-i18n.mjs` reports `missing=0  extra=0` for your file, the structure is intact. The build will then catch any JSON syntax errors.

## 9. Quick checklist

- [ ] Every English string value has been replaced with a natural translation in your language
- [ ] All keys, nesting, and array lengths are unchanged
- [ ] Brand names, feature names, and Apple terms (section 3) were left in English
- [ ] HTML tags, entities, placeholders, and URLs were left intact
- [ ] Tone is minimal, direct, slightly confronting about time — never corporate or hype
- [ ] User is addressed informally ("you" → *tú* / *du* / *tu* / etc.)
- [ ] `_meta.status` is changed from `"untranslated"` to `"translated"`
- [ ] File is valid JSON (no trailing commas, all strings closed)

Thanks for translating Left.

---

## For maintainers / developers

The pages under `/press.html` and `/tools/*` are **English-only** by design. The build script (`scripts/build-i18n.mjs`) does not generate translated copies of them, the language-detection script (`partials/detect.html`) does not redirect users away from them, and the locale JSONs do not contain keys for them. If you add a new English-only page in the future, you need to:

1. **Not** include it in `SOURCE_PAGES` or `SOURCE_DIRS` in [scripts/build-i18n.mjs](scripts/build-i18n.mjs).
2. Add its path prefix to `EXCLUDED_PATH_PREFIXES` in the same file (so internal links to it are not rewritten to `/<lang>/`).
3. Add the same path prefix to the regex in [partials/detect.html](partials/detect.html) (so the auto-redirect leaves users on the English version).

Conversely, if you add a new translatable page:

1. Add it to `SOURCE_PAGES` (or, for directories of pages, add the directory to `SOURCE_DIRS`).
2. Annotate every user-visible string in the HTML with `data-i18n="key.path"` (or `data-i18n-html`, `data-i18n-attr`).
3. Add the corresponding key to `en.json`.
4. Add the same key (with the same English string as a placeholder) to every other locale file so `check-i18n` stays clean — then have translators fill in their language.
