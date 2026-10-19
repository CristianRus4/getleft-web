# Content audit, October 2026 (CNTXT-885)

Scope: every live English page except blog posts (home, the 7 landing pages, the 58 tools, the support articles, press, privacy, contact, web). Audited on 2026-10-20 against `main` at the time of writing.

Method: scripted checks over the built HTML (title and description length, duplicates, visible word count, h1 count, noindex and sitemap state, internal links and images resolving to files or `_redirects`, years in copy, inbound link counts, hard-rule terms), curl on external links (no browser), then a read of the home, press, contact, privacy and tool prose against `facts.md`, `docs/seo/research/product-claims.md` and the app source. A separate pass checked the support articles against the app source.

Clean: no duplicate titles or descriptions, no broken internal links or images on any audited page, no h1 problems except the web app, all indexed pages are in the sitemap, privacy was updated 19 October 2026. External links return 200 apart from two bot-blocking 403s (doi.org, fsis.usda.gov), which are fine in a browser.

## Fixed in this batch

| Page | Problem | Fix |
|---|---|---|
| `press.html` | "20 widgets ... for iPhone, iPad, and Mac" contradicts the iPhone-only rule | Reworded to iPhone Home Screen, Lock Screen and StandBy. Not in `i18n/locales/en.json`; the translated press pages fall back to English for that sentence until retranslated. |
| `support.html` | iPad in "sync across iPhone and iPad" and the sync troubleshooting FAQ (iCloud Drive toggle that does not exist); "extra-large on iPad" and the Mac widget line; Lock Screen "circular (above clock)"; Repeat "daily"; "Restore Purchases" path; unverified display-style, 15 to 30 minute refresh, "negligible battery" and Family Sharing claims; Shortcuts "create events"; "Update Left Wallpaper" automation name; "iOS/iPadOS" | Corrected to the app source (Repeat = Never, Weekly, Fortnightly, Monthly, Yearly; Settings > Troubleshooting > Restore purchases; circular and rectangular below the clock, inline above it). Unverifiable claims removed or softened. |
| `support/wallpaper-shortcut.html` | Search term, Legibility Blur step, 00:01, Daily and Notify wording differed from the in-app tutorial | Aligned to the in-app steps (search "Wallpaper", turn off Legibility Blur, 12:01 AM, Repeat Every Day, Notify off) |
| `support/accountability-with-friends.html`, `streaks-vs-habits.html` | Wrong notification labels; "Get last chance reminders" does not exist | Real labels ("Since invites", "Friends habits & streaks completions/missed", "Get a persistent reminder", "Before what time?") |
| `support/choose-your-tools.html` | "Left Wallpaper" tool name, Fasting missing, unverified defaults claim | "Wallpaper", Fasting added, defaults claim removed |
| `support/set-up-your-lifespan.html` | No Premium note on Calculate and Set manually; invented "sleep, awake, activity" views; wrong "Settings > Account" step | Premium note and 80-year default added, invented line and wrong step removed |
| `support/add-friends.html`, `accountability-with-friends.html`, `joint-ahead-dates.html` | No Premium note for friends and Joint Ahead; "Add a date" label | Premium sentence added; "Add a date ahead" |
| `support/account-and-sync.html`, `widget-ipad-home-screen.html` | "iPhone or iPad" sync; "one app for both iPhone and iPad" | iPhone only; false sentence removed |
| `support/iphone-action-button-left.html` | "Advanced" section pointing to URL actions the Shortcuts guide does not have | Section and its table-of-contents entry removed |

## Prioritized findings

Effort: S under 30 minutes, M a few hours, L a day or more.

| # | Page | Problem | Fix | Effort |
|---|---|---|---|---|
| 1 | `index.html` (Lane 0) | None of the 7 landing pages is linked from the home page, nav, footer or any support article. `/android` has no inbound links at all; the other six get links only from tools and blog. They are the pages built to capture the old domain's feature queries. | Add a "Widgets and features" link row or footer column on the home page (`/countdown-widget`, `/days-since-widget`, `/year-progress-widget`, `/life-calendar`, `/habit-tracker`, `/days-left-wallpaper`) and link `/android` from the footer or the FAQ ("Is there an Android app?"). Add one contextual link from each matching support article. | S |
| 2 | `index.html` JSON-LD | `aggregateRating` 4.5 from 226 ratings sits in the MobileApplication JSON-LD. The brief and `product-claims.md` ban ratings and user counts, and the numbers are not shown anywhere on the page, which Google treats as markup that does not match visible content. | Owner to confirm the numbers are current and visible on the page, or remove `aggregateRating`. | S |
| 3 | `tools/life-expectancy-calculator.html` | Prose says "WHO global averages: approximately 73.8 years for males and 79.0 years for females (2024 data)". These are not WHO global figures (WHO global life expectancy at birth is far lower), and the adjustment list cites "NEJM 2013", "Lancet 2010/2011/2017" with no links. A health claim page with unverifiable sources. | Replace with a clearly labelled assumption ("a baseline of 73.8 and 79.0 years, roughly a high-income country average") or cite the real source, link each study, and change the script constants to match. Keep the caveat. | M |
| 4 | 4 iPad and Mac widget support articles | Left is iPhone-only; the pages claim iPad and Mac. Owner decision needed (see S1). | See S1 | M |
| 5 | Tools, 23 pages under 250 words | Thin pages: countdown-timer, anniversary-countdown, meeting-time-calculator, unix-milliseconds-converter, sobriety-calculator, quarter-countdown-calculator, wedding-countdown, vacation-countdown, retirement-countdown-calculator, time-between-two-times, reading-time-calculator, fiscal-year-progress-calculator, deadline-countdown-calculator, date-units-converter, school-days-calculator, semester-countdown-calculator, workday-countdown, habit-streak-calculator, time-zone-meeting-planner, hours-since-date, minutes-between-two-times, working-hours-calculator, business-days-from-date. Same template as the 17 tools already rewritten (explanation of the method, worked example or table, FAQ with JSON-LD, CTA). | Rewrite in value order: wedding-countdown, vacation-countdown, retirement-countdown-calculator, anniversary-countdown, sobriety-calculator, countdown-timer first (the countdown family links naturally to Left's Ahead widget); then the calculator family. About 6 pages per batch with `tools2.py` as the pattern. | L |
| 6 | `web.html` | `<title>` is just "Left" (4 characters), there is no h1 and about 30 visible words (the page is a JS app), and the `android.html` landing page sends people here. | Title "Left on the Web: Year, Life and Time Left Views", keep the description, add a visually hidden h1 and a one-paragraph noscript fallback with a link to the App Store. Cannot be a page of copy, but the title and h1 are cheap. | S |
| 7 | `press.html`, `contact.html`, `support.html` | Titles are the weak pattern "Press - Left", "Contact - Left", "Support - Left" (12 to 14 characters). | "Left Press Kit: Logo, Screenshots and Contact", "Contact Left: Support, Feedback and Bug Reports", "Left Support: Help With Widgets, Habits, Streaks and Premium". Titles are in locale catalogs, so each change drops translations of that title. | S |
| 8 | `tools/index.html` | Title is 65 characters, over the 60 limit. | Shorten to "Free Date and Time Calculators and Countdowns | Left" (50). | S |
| 9 | `index.html` home blog list | The blog section still says "How to add widgets on iPhone, iPad and StandBy" and "The best countdown widgets for iPhone", but the posts were retitled ("... on iPhone: Home Screen, Lock Screen and StandBy"). The card copy mentions iPad, which breaks the iPhone-only rule. | Change the card title to match the post h1. The card titles live in `i18n/locales/en.json` under `index.blog`; Lane 0 owns the change. | S |
| 10 | `index.html` reviews | A reviews section is filled at runtime from `/reviews.json`. Not new content, but product-claims bans new testimonials. | Owner to confirm `reviews.json` holds real, current App Store reviews and that attribution is accurate. | S |
| 11 | `tools/*` internal links | `tools/sleep-calculator`, `iso-week-number`, `reading-time-calculator`, `days-until-fathers-day` have only 2 inbound links each (the tools index and one neighbour). | Add them to the related-tool rows of 2 or 3 closer tools each (sleep to fasting, iso-week to what-was-the-date, reading-time to countdown-timer, fathers-day to mothers-day). Mothers-day already links both ways. | S |
| 12 | Landing pages | Fine on claims (reviewed by Opus on 2026-10-19). Their support-article links are not reciprocated, and none has been updated since publication. | Re-check after the Focus release (v2026.11) and after any widget changes. | S |
| 13 | `privacy.html` | Dated 19 October 2026 and consistent with the analytics banner. Nothing to change. | None | none |

## Support articles: findings still open

Checked with a Sonnet pass against the app source (read-only). Everything marked fixed above is done; these remain.

| # | Page | Problem | Fix | Effort |
|---|---|---|---|---|
| S1 | `support/widget-ipad-home-screen`, `widget-ipad-lock-screen`, `widget-mac-desktop`, `widget-mac-notification-center` (4 indexed pages) and the four matching tutorial cards plus the iPad and Mac mentions in `support.html` | The app has no iPad or Mac build (`TARGETED_DEVICE_FAMILY` is iPhone only, Mac Catalyst and Designed for iPad are off), so "Open Left on your iPad" and "iPadOS 26" are wrong. `facts.md` lists iPhone widgets on Mac as a never-claim; `product-claims.md` says these articles are allowed because they cover widgets only. The two documents disagree. | **Owner decision.** Either noindex and redirect the four pages to the iPhone widget articles, or rewrite them honestly as "iPhone widgets shown on your Mac" with no iPad claims. Until decided they are the biggest remaining factual risk on the site. | M |
| S2 | `support/focus-timer-in-left`, `support.html` Focus FAQ, home FAQ | Focus is described as available now, but it ships in v2026.11. | Hold or mark "arrives in v2026.11" until release, or ship the release first. | S |
| S3 | `support/account-and-sync` | The "What syncs" list names Ahead dates, habits and streaks but not Aims. Not verified in the sync code. | Confirm and add Aims. | S |
| S4 | `support/streaks-vs-habits`, `joint-ahead-dates` | "+ > Add a streak / Add a habit" differs from the "New item" sheet (Build from scratch > Habit, Streak, Aim) described in `facts.md`. Both strings exist in the app. | Confirm the current sheet flow and rewrite the steps. | S |
| S5 | `support/aims-in-left`, `organise-ahead-since` | No mention of the free quota (2 of each). | Optional one-liner. | S |
| S6 | Support articles overall | 300 to 380 words each, accurate but thin and with no internal links to the landing pages or tools (zero inbound links from support to any landing page). | Add a "Related" row per article (widget articles to `/countdown-widget` and `/year-progress-widget`, wallpaper to `/days-left-wallpaper`, lifespan to `/life-calendar`, habit articles to `/habit-tracker`, friends and Ahead to `/countdown-widget`). | M |
| S7 | `support/widget-mac-*` | The two pages share a word-for-word paragraph. | Moot if S1 removes them. | S |

## What should change in blog posts after the freeze

These are known issues only, found while working on the posts. None was changed to protect the translations.

- **Apple Watch:** `blog/left-apple-watch-app` is noindexed and out of the sitemap, with no landing-page links. When the watch app ships, rewrite it and restore it; `habitkit-vs-left` has an FAQ "Does Left have an Apple Watch app?" that currently answers No and must change in the same release.
- **Focus (v2026.11):** posts that mention timers or Pomodoro should link the Focus support article after release. `timer-interval-app-iphone` and `adhd-task-initiation-strategies` are the best candidates.
- **Dates:** every post carries "Updated 20 October 2026" and `dateModified` of the same day from the head pass. Bump both whenever a post is edited, and remove the line from posts nobody touched for a year rather than leaving a false freshness signal.
- **FAQ coverage:** only 7 of 47 posts have a Questions section (and FAQPage JSON-LD). The highest-intent how-to posts without one: `home-screen-timer-iphone`, `iphone-aesthetic-widgets-guide`, `best-reminder-apps-iphone`, `adhd-time-blindness-iphone`.
- **Thin posts:** `left-wallpaper-guide` (472 words) and `aim-goal-tracker-left` (608) are the thinnest. Both map to a landing page (`/days-left-wallpaper`, `/habit-tracker`) and should either be expanded or consolidated into it with a 301.
- **Landing links:** every post except the watch post links a landing page; the `/android` page has no inbound links from any post. Add one in the "iPhone only" and Mac productivity posts (`best-productivity-apps-mac` already answers "Does Left run on Mac?").
- **Home blog card titles** (home page): "How to add widgets on iPhone, iPad and StandBy" and the other card titles still use the old h1s. Update them when the freeze ends or after Lane 0 changes the home keys.
- **Retitled posts:** `how-to-add-widgets-iphone` and `presentation-timer-iphone` changed topic in the claims sweep; check Search Console for those two URLs in four weeks and watch for ranking loss on the old "iPad" and "Mac" queries.
