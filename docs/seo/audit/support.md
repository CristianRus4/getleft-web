# Support articles and support index: scorecard (CNTXT-885)

Audited 2026-10-21 against `main` (13d696b2). Scope: 29 articles under `support/` plus `support.html` (30 pages). Method: every page read in full, scripted facts (`data/facts.json`), Search Console exports (2026-10-19), SERP checks with WebSearch, and the claims list in `docs/seo/research/product-claims.md`. Scores are 1-5 per rubric line; the Notes column carries the reason for the scores that are not 3 or 4. Shared reasons are under "Reasons that apply to the whole group".

**Averages across the 30 pages:** Search fit 2.9, Accuracy 3.4, Depth 3.7, Links 2.8, E-E-A-T 2.1, Conversion 2.8, Technical 3.0, Translation 3.6.

## Summary

- **The widget how-tos are accurate for iPhone and structurally the same page 26 times.** The October fixes held: no "Smart" picker, no iOS 16, no old "+" path, Mac articles describe iPhone widgets on macOS Sonoma without claiming or denying a Mac app. The lowest averages are E-E-A-T (no dates, no authors, no schema beyond BreadcrumbList) and conversion (a generic end card; the support index has no App Store link at all).
- **Open accuracy question: the two iPad articles.** `widget-ipad-home-screen` and `widget-ipad-lock-screen` tell readers to "open the Left app on your iPad" and say "Left needs iPadOS 26 or later, so Lock Screen widgets work on any iPad that can run Left". `product-claims.md` says Left is iPhone-only and "never claim an iPad app" while also saying the iPad and Mac articles cover widgets only, and Lane 0 rewrote them on 2026-10-20 rather than removing them. Nobody has tested whether an iPhone-only app's widgets appear on an iPad. They are indexed, in the sitemap, linked from the support index and every article's "Related guides" list, and live in all 18 locales (36 more pages). This was open item S1 in the earlier audit and was skipped on purpose. The Opus check says to test on a real iPad running iPadOS 26 first, then redirect (if no widgets) or reword (if widgets work) (fix SUP-01, gap 4 pending that test).
- **Unshipped features have live pages.** `apple-watch-app`, `mood-tracker-in-left` and `world-mood-globe` are noindexed and out of the sitemap, but they are reachable, carry hreflang, and exist in 18 locales each (57 URLs). They describe features the owner has said not to claim; they were noindexed on purpose with "URLs stay live", so SUP-02 is an owner decision, gap 2 after verification.
- **Two sync stories.** `support.html` FAQ says data "sync via iCloud if enabled" and "stored in iCloud"; `account-and-sync` says data syncs through the Left account after Sign in with Apple. The app has both a CloudKit container and a Firebase sync manager, so each page may be half right; they need to agree (SUP-04). The `account-and-sync` meta description still says "iPhone and iPad".
- **Support demand is tiny and long tail.** 16 months of getleft.app data: `/support` 62 impressions at position 4.8, the best article (`focus-modes-with-left`) 39, most under 10. Titles are mostly the how-to pattern and match the intent; the real gains are accuracy and the E-E-A-T/conversion basics, not title rewrites.

## Scorecard

| Page | Search fit | Accuracy | Depth | Links | E-E-A-T | Conversion | Technical | Translation | Total /40 | Main query | Demand | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `/support/account-and-sync` | 2 | 3 | 4 | 3 | 2 | 3 | 3 | 4 | **24** | back up / sync left app data | 6 impr, pos 5.5 | Meta description still says "across your iPhone and iPad"; body is iPhone-only. Support FAQ describes sync via iCloud, this page via the Left account: reconcile. |
| `/support/accountability-with-friends` | 3 | 4 | 4 | 3 | 2 | 3 | 3 | 3 | **25** | accountability partner habit app | 2 impr, pos 1.5 | Catalog key `li_extra_leaderboard` is missing in 9 locales (falls back to English). |
| `/support/add-friends` | 3 | 4 | 4 | 3 | 2 | 3 | 3 | 4 | **26** | add friends on Left | 2 impr, pos 9.5 | Premium note present. Fine. |
| `/support/aims-in-left` | 2 | 4 | 4 | 3 | 2 | 3 | 3 | 4 | **25** | goal tracker number-based aim | 0 | Title "How aim works in Left" is ungrammatical and lowercase "aim"; description is 170 chars (truncates). |
| `/support/apple-health-automatic-tracking` | 3 | 4 | 4 | 3 | 2 | 3 | 3 | 4 | **26** | apple health habit tracking | 0 | Title is 62 chars (over 60). |
| `/support/apple-watch-app` | 1 | 1 | 4 | 1 | 2 | 2 | 3 | 2 | **16** | (noindexed) | 0 | Describes an Apple Watch app that is not shipped. Noindexed, out of sitemap and unlinked, but the URL and 18 locale copies are live and hreflang-tagged. |
| `/support/choose-your-tools` | 3 | 4 | 4 | 3 | 2 | 3 | 3 | 4 | **26** | customize left bottom menu | 1 impr, pos 1 | Accurate and complete. Low search demand. |
| `/support/edit-or-remove-widget-iphone` | 4 | 4 | 3 | 3 | 2 | 3 | 3 | 4 | **26** | edit remove widget iphone | 3 impr, pos 24 | 3 impr at pos 24. Generic iOS steps; Apple's own guide covers the same ground. |
| `/support/fasting-in-left` | 3 | 4 | 4 | 3 | 3 | 3 | 3 | 4 | **27** | fasting tracker widget iphone | 0 | Has a medical-advice limit paragraph (good). Fasting is untracked in ASO data. |
| `/support/focus-modes-with-left` | 4 | 4 | 4 | 3 | 2 | 3 | 3 | 4 | **27** | different widgets per focus mode iphone | 39 impr, pos 23.7 | Most-seen support article (39 impr, pos 23.7). Mixed US/UK spelling (Control Centre, Customize). |
| `/support/focus-timer-in-left` | 3 | 3 | 4 | 3 | 2 | 3 | 3 | 4 | **25** | pomodoro timer iphone widget | 0 | Describes Focus as available; it ships in v2026.11 (about 2 Nov). Accurate once released. |
| `/support/iphone-action-button-left` | 3 | 4 | 3 | 3 | 2 | 3 | 3 | 4 | **25** | open app action button | 0 | Fine; thin on Left-specific actions. |
| `/support/joint-ahead-dates` | 3 | 4 | 4 | 3 | 2 | 3 | 3 | 4 | **26** | shared countdown with friends | 6 impr, pos 4.5 | Premium note present. |
| `/support/left-shortcuts` | 2 | 3 | 2 | 3 | 2 | 3 | 3 | 4 | **22** | shortcuts app left actions | 6 impr, pos 3.2 | Description promises "Create events"; body only covers Open App. Left ships App Intents for habits, streaks, Aims, Ahead and the wallpaper (product-claims.md) and none is documented. |
| `/support/mood-tracker-in-left` | 1 | 1 | 4 | 1 | 2 | 2 | 3 | 2 | **16** | (noindexed) | 0 | Mood is hidden in production. Noindexed and unlinked, but live in 19 languages. |
| `/support/organise-ahead-since` | 3 | 4 | 4 | 3 | 2 | 3 | 3 | 4 | **26** | reorder items app | 5 impr, pos 2 | Free-plan line present. |
| `/support/restore-purchases` | 4 | 4 | 4 | 3 | 2 | 3 | 3 | 4 | **27** | restore purchases left app | 4 impr, pos 4.5 | Good page; path matches the app (Settings > Troubleshooting). |
| `/support/set-up-your-lifespan` | 3 | 4 | 4 | 3 | 3 | 3 | 3 | 4 | **27** | set life expectancy widget | 1 impr, pos 41 | Estimate caveat present; no source for the calculator's statistical basis. |
| `/support/streaks-vs-habits` | 4 | 4 | 4 | 3 | 2 | 3 | 3 | 4 | **27** | streak vs habit | 10 impr, pos 2.1 | Best-ranked support article (10 impr, pos 2.1). |
| `/support/wallpaper-shortcut` | 4 | 4 | 4 | 3 | 2 | 3 | 3 | 3 | **26** | lock screen wallpaper shortcut automation | 9 impr, pos 6.2 | `li_extra_17` is stale in 9 locales. |
| `/support/widget-ipad-home-screen` | 3 | 2 | 3 | 3 | 2 | 2 | 3 | 2 | **20** | ipad home screen widget | 6 impr, pos 31.3 | "Open the Left app on your iPad" and "download it from the App Store". Left is iPhone-only (earlier audit: iPad and Mac Catalyst are off in the app project). |
| `/support/widget-ipad-lock-screen` | 3 | 2 | 3 | 3 | 2 | 2 | 3 | 2 | **20** | ipad lock screen widget | 3 impr, pos 60.7 | "Left needs iPadOS 26 or later, so Lock Screen widgets work on any iPad that can run Left": Left is iPhone-only. |
| `/support/widget-iphone-home-screen` | 3 | 4 | 4 | 3 | 2 | 3 | 3 | 4 | **26** | add widget iphone home screen | 3 impr, pos 19 | Head term owned by Apple and big publishers; Left-specific angle is the right one. |
| `/support/widget-iphone-lock-screen` | 3 | 4 | 4 | 3 | 2 | 3 | 3 | 4 | **26** | add widget iphone lock screen | 8 impr, pos 26.8 | 8 impr at pos 26.8. Slot counts match Apple's behaviour. |
| `/support/widget-iphone-standby` | 3 | 4 | 4 | 3 | 2 | 3 | 3 | 4 | **26** | standby mode widgets iphone | 6 impr, pos 46.8 | Fine. |
| `/support/widget-mac-desktop` | 3 | 4 | 3 | 3 | 2 | 3 | 3 | 4 | **25** | mac desktop widget iphone | 15 impr, pos 41.7 | Correctly framed as iPhone widgets on macOS Sonoma, with no claim about a Mac app. |
| `/support/widget-mac-notification-center` | 3 | 4 | 3 | 3 | 2 | 3 | 3 | 4 | **25** | mac notification center widgets | 11 impr, pos 39.1 | Same framing; fine. |
| `/support/widget-transparent-iphone` | 4 | 4 | 3 | 3 | 2 | 3 | 3 | 4 | **26** | transparent iphone widgets | 20 impr, pos 38.1 | Covers iOS 26 Clear. Top results also cover the Light/Dark/Auto tint and dimmer options; page does not. |
| `/support/world-mood-globe` | 1 | 1 | 4 | 1 | 2 | 2 | 3 | 2 | **16** | (noindexed) | 0 | World Mood is hidden in production. Noindexed and unlinked, live in 19 languages. |
| `/support` | 4 | 3 | 4 | 4 | 2 | 2 | 4 | 3 | **26** | left support / left app help | 62 impr, pos 4.8 | Index: 62 impr at pos 4.8. FAQ contradictions (iCloud vs account sync, "for screenshots", "Are Left widgets free?" does not answer). No App Store CTA on the page. |

## Reasons that apply to the whole group

- **Search fit (most pages 3):** the title states the task ("How to add a Left widget on your iPhone Lock Screen"), which fits how-to intent, but the head terms are owned by Apple, MacRumors and iPhone Life (SERP check: "how to add widget to iphone lock screen"), and there is no Search Console evidence that any article gets more than a handful of impressions. 4 = the page has measured impressions at a good position or a distinctive query; 2 = title or description is wrong or misleading.
- **Depth (mostly 4):** the steps are complete, accurate to the app and specific to Left. The gap versus top results is troubleshooting and variants (for example transparent widgets: Apple's Light/Dark/Auto tint, dimmer; Action Button: no Left-specific App Intents).
- **Links (2.8):** every article carries an identical 26-link "Related guides" block (including the iPad, Mac, and the lowest-value pages) plus, for 17 articles, one "See also" line to a landing page. No article links to a blog post, tool or the support index in context.
- **E-E-A-T (2.1):** no visible updated date, no author or "tested on iOS 26" line, no schema beyond BreadcrumbList. The only exceptions score 3: fasting (medical-advice paragraph) and lifespan (estimate caveat).
- **Conversion (2.8):** one end card, "Start noticing what matters", with a generic "Download for iOS" button. No in-context CTA naming the feature at the moment of need (for example under "Choose a metric" on the Health page). The support index has none.
- **Technical (3.0):** canonical, hreflang (46 tags: x-default, en, every locale and region codes), sitemap and noindex states are correct. No `Article`/`HowTo` markup, no images (the 18 `left-tutorial-*` images were deleted), `FAQPage` only on the index.
- **Translation (3.6):** all 29 articles and the index exist in all 18 locales. After the wallpaper, sync and widget rewrites, 9 locales (de, es, es-419, fr, it, nl, pl, pt, pt-BR) still have `support_articles.wallpaper_shortcut.li_extra_17` and `support.support.p_37` stale and `accountability_with_friends.li_extra_leaderboard` missing (`check-i18n --verbose`); id, hi, ro, ru, tr, ko, ja, zh-Hans, zh-Hant are current. Pages that are wrong in English (iPad, mood, watch) are wrong in 18 languages.

## Findings by page (pages scoring under 4 on a line that matters)

| Page | Line | Evidence | Fix (see `fix-list.md`) |
|---|---|---|---|
| widget-ipad-home-screen, widget-ipad-lock-screen | Accuracy 2 (pending iPad test) | "Open the Left app on your iPad (download it from the App Store if you haven't already)"; "Left needs iPadOS 26 or later, so Lock Screen widgets work on any iPad that can run Left" | SUP-01 |
| apple-watch-app, mood-tracker-in-left, world-mood-globe | Accuracy 1, Links 1 | "The Left Apple Watch app brings the most important parts of Left to your wrist"; "Mood requires iOS 26 or later and Left Premium"; zero inbound links; all noindexed | SUP-02 |
| account-and-sync | Search fit 2, Accuracy 3 | Meta description: "sync them across your iPhone and iPad" | SUP-03 |
| support (index) | Accuracy 3, Conversion 2 | FAQ "sync via iCloud if enabled", "Are Left widgets free?" answered with "Left is free to download. Left Premium unlocks everything", "Home Screen widget guide for screenshots" (screenshots were removed on purpose), no App Store link | SUP-04, SUP-05 |
| left-shortcuts | Search fit 2, Depth 2 | Description: "Create events, open Left, and build automations"; body covers only the Open App action | SUP-06 |
| aims-in-left | Search fit 2 | Title "How aim works in Left | Left"; description 170 chars | SUP-07 |
| focus-timer-in-left | Accuracy 3 | Focus described as shipped; ships in v2026.11 (about 2 Nov) | none until release; then re-read |
| all 29 articles | E-E-A-T 2, Links 3, Conversion 3 | See group reasons | SUP-08, SUP-09, SUP-10 |

## Not changed by this audit

No page was edited. Fixes are ranked in `fix-list.md`.
