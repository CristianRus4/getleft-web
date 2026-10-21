# Translations: three-page sample per locale (CNTXT-885)

Audited 2026-10-21 (`main` 13d696b2). 18 locales x 3 pages = 54 pages, plus catalog reports from `node scripts/check-i18n.mjs --verbose`. Script: `data/sample-locales.mjs`; raw output: `data/locale-sample.json`. Machine checks on every sampled page, then a read of titles and descriptions, and a terminology check of Apple UI terms across each locale folder. I read de, es, es-419, fr, it, pt, pt-BR and nl titles with confidence; ja, zh, ko, ru, tr, hi, id, pl and ro only for structure and Apple terms. These are machine translations that no person has reviewed.

**Sample per locale:** home (`index`), `support/wallpaper-shortcut` (changed in October), and a third page: `blog/how-to-build-a-streak` (es, es-419), `countdown-widget` (de, zh-Hant), `tools/days-until-birthday` (ja), otherwise `support/widget-iphone-lock-screen`.

## Result

| Check | Result |
|---|---|
| `<html lang>`, self canonical, hreflang (x-default, en, all locales) | Correct on all 54 pages (hreflang 46 tags on site pages, 25 on blog, 8 on landing pages, 3 on tools) |
| Title and description translated, not English | 54 of 54 |
| Titles and descriptions inside the length limits | Latin-script homes 48-57 chars, descriptions 141-153; the earlier audit's 65-77 / 184-241 problem is fixed |
| English UI terms left in support titles, descriptions, h1 ("Home Screen", "Lock Screen", "Notification Center") | 0 in all 18 locales (earlier audit: 15 of 17 had them) |
| Paragraph text identical to English | 0% on every site page; 4% on es and es-419 blog (code names and the "Download for iOS" label); 17% on the ja tool page (calculator labels the generator does not route through `toolT()` yet) |
| Removed claims still translated (Apple Watch, Mood, Time Between) on home and support index | none in any locale |
| Local search terms in homepage titles (ko 디데이, ja 記念日, zh 倒数日/倒數日, ru счётчик дней, de Countdown-App, pl odliczanie dni) | present; the earlier audit's "missing term" table is resolved |
| Links inside locale pages | support articles link 25-28 locale pages and no English page; home pages in locales without released landing/blog pages link nothing in those sections (by design, until the release dates) |
| Image alt text | 6 of 7 home alt strings (and the hero alt via `data-i18n-attr`) are English on all 18 locale homes (see TR-03) |

## Findings

1. **Stale and missing catalog keys.** Nine locales (de, es, es-419, fr, it, nl, pl, pt, pt-BR) have `support_articles.wallpaper_shortcut.li_extra_17` and `support.support.p_37` stale, and `support_articles.accountability_with_friends.li_extra_leaderboard` missing. The other nine locales are current. Fixing the English sentences listed in `fix-list.md` (SUP-01 to SUP-07) will stale more keys; queue them with these.
2. **Turkish uses "Kilitli Ekran" for Lock Screen, 155 occurrences across `tr/`.** Apple's Turkish iOS term is "Kilit Ekranı" (and "Ana Ekran" for Home Screen, which the pages use). I did not verify against Apple's glossary files, so confirm before a bulk change. Because this edits only `i18n/locales/tr.json` and not English, no other locale is affected (TR-01).
3. **Polish Home Screen term.** Pages say "ekranie głównym" (32 times); Apple's Polish iOS term is "ekran początkowy". Lower confidence than the Turkish item (TR-02).
4. **Unshipped-feature pages exist in every locale.** `apple-watch-app`, `mood-tracker-in-left`, `world-mood-globe` and the two iPad articles are translated and live in 18 locales (90 URLs). Removing them in English (SUP-01, SUP-02) means removing them from the locale builds too, which costs no translation work.
5. **Blog and tools catalogs.** Blog is about 94% translated everywhere and 98% in de and es; only de, es and es-419 serve it. The tools catalog is 33-35% translated in every locale, below the 90% page threshold, so only `tools/ja` (18 pages) is live and its tool pages still show English calculator labels (17% identical blocks on the sampled page). The `de`/`es` "3,822 orphaned" figure in the blog report is the 31 scheduled pages translated ahead of release, not an error.
6. **Hindi.** `/hi/` homepage and support pages are current and complete; the earlier research judged Hindi traffic unlikely (English carries India). Not worth more investment.

## Fixes proposed from this sample

| ID | Fix | Translation impact |
|---|---|---|
| TR-01 | Replace "Kilitli Ekran" with "Kilit Ekranı" (with the correct suffixes) in the Turkish catalogs after checking Apple's Turkish glossary | no English change; edits tr catalogs only (about 155 occurrences) |
| TR-02 | Check Polish "ekranie głównym" against Apple's "ekran początkowy" | no English change; edits pl catalogs only (32 occurrences) |
| TR-03 | Give the 6 English-only home alt strings translation keys | translated: 6 new units in every locale |
| TR-04 | Re-translate the stale and missing keys listed in finding 1 for 9 locales | translated: 3 units x 9 locales (existing English; no English change) |
