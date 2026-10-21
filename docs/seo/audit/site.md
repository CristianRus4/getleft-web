# Home, landing pages, legal and press: scorecard (CNTXT-885)

Audited 2026-10-21 against `main` (13d696b2). Scope: `index.html`, the 7 landing pages (`countdown-widget`, `days-since-widget`, `year-progress-widget`, `life-calendar`, `habit-tracker`, `days-left-wallpaper`, `android`), `press`, `contact`, `privacy`, `web`, and the three redirect stubs `terms`, `download`, `promo` (15 pages). Method as in `support.md`.

**Averages:** Search fit 3.6, Accuracy 4.2, Depth 3.4, Links 2.6, E-E-A-T 3.1, Conversion 3.8, Technical 3.5, Translation 3.7.

## Summary

- **The landing pages are the strongest content on the site.** Each has a specific title, a feature-named CTA in three places (`data-cta` hero, inline, end), a step list that matches the app, an honest "what is free and what needs Premium" section, a FAQ with `FAQPage` JSON-LD, `MobileApplication` and `BreadcrumbList` markup, 1,000-1,250 words, and no hard-rule breach. They are written against the left-time.app query clusters (days since 1,397 impressions, year/day/life progress 957, countdown 648, wallpaper 411, Android 872) and none has yet earned a Search Console impression on getleft.app: they are new and the old domain is not yet redirected. SERPs for these queries are App Store listings and how-to sites, so a real explainer page is the right shape.
- **Internal links are the weak line (2.6).** `/android` has 2 inbound links, `/life-calendar` 8, `/days-since-widget` 14. The Android cluster (872 impressions, 126 clicks at position 1.3-6 on the old domain) is the best-proven demand and the page that serves it is the least linked.
- **Home is solid, with three gaps.** It never says "iPhone, iOS 26 or later" in visible text (only in JSON-LD); the `MobileApplication` is nested inside `WebSite.about` rather than top-level; and six alt strings are English on all 18 locale homes because they are not wired to translation keys.
- **Accuracy is clean.** No Mood, Time Between, Apple Watch, price, "free forever" or rating claim on any page in the group. One soft spot: `/countdown-widget`, `/days-since-widget`, `/habit-tracker` and `/android` say "its widgets are free" without naming which (the app's own paywall lists widgets as free, so this is imprecision, not an error); Planner, Fasting and Focus widgets belong to Premium features (see the listicle fact-check notes). The other landing pages name the free widgets exactly.
- **Open outside the site:** Left's App Store description says "Left requires a Premium plan to use its features", which contradicts the free plan the site documents. Flagged to Lane 0 on 2026-10-20; not a site fix.

## Scorecard

| Page | Search fit | Accuracy | Depth | Links | E-E-A-T | Conversion | Technical | Translation | Total /40 | Main query | Demand | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` | 4 | 4 | 4 | 4 | 3 | 4 | 3 | 4 | **30** | left app / left time app / countdown habit widgets | 188 impr (getleft.app); ~13,900 brand impr on left-time.app | Strong page. Gaps: no visible "iPhone, iOS 26" line outside the FAQ schema; MobileApplication is nested in WebSite.about; 6 hero/feature alt strings stay English in all 18 locales. |
| `/countdown-widget` | 4 | 4 | 5 | 4 | 3 | 5 | 4 | 4 | **33** | countdown widget iphone | left-time.app countdown cluster 648 impr; ASO "countdown widget" 60 (US) | Best page on the site. Says "its widgets are free" without naming which: Planner, Fasting and Focus widgets are Premium. |
| `/days-since-widget` | 4 | 4 | 4 | 3 | 3 | 5 | 4 | 4 | **31** | days since widget iphone | left-time.app cluster 1,397 impr (pos 6-9); ASO "days since" 51 | Highest unserved left-time.app demand. 14 inbound links. |
| `/year-progress-widget` | 4 | 4 | 4 | 4 | 3 | 5 | 4 | 4 | **32** | year progress widget iphone | left-time.app year/day/life cluster 957 impr (pos 7-8) | "Free, with no limits" is specific to the Year widget and holds. |
| `/life-calendar` | 4 | 4 | 4 | 3 | 3 | 5 | 4 | 4 | **31** | life calendar app iphone | part of the 957 impr year/life cluster; "life widget time progress" 255 | Only 8 inbound links. |
| `/habit-tracker` | 4 | 4 | 4 | 4 | 3 | 5 | 4 | 4 | **32** | habit tracker widget iphone | ASO "habit tracker" 67 (US); left-time.app habit queries small | SERP is crowded with App Store listings; page is the explainer they lack. |
| `/days-left-wallpaper` | 4 | 4 | 4 | 3 | 3 | 5 | 4 | 4 | **31** | days left wallpaper iphone | left-time.app wallpaper cluster 411 impr (pos 6.9); "days left wallpaper" 233 | No competing guide in the SERP for auto-updating wallpaper; strong opening. |
| `/android` | 5 | 4 | 3 | 2 | 3 | 3 | 4 | 4 | **28** | left app for android | left-time.app Android cluster 872 impr, 126 clicks (pos 1.3-6) | Only 2 inbound links (home FAQ and support FAQ). Visitors cannot convert on Android; the web version is the CTA. |
| `/privacy` | 3 | 4 | 4 | 3 | 5 | 3 | 4 | 4 | **30** | left privacy policy | 3 impr, pos 7.3 | Dated 19 Oct 2026; matches the analytics banner. |
| `/press` | 3 | 4 | 2 | 2 | 3 | 3 | 3 | 4 | **24** | left app press kit | 17 impr, pos 9.1 | 185 words; spells "Visualise"/"enquiries" (UK) while the rest of the site is mixed; press kit is a Google Drive link. |
| `/contact` | 3 | 4 | 2 | 2 | 3 | 2 | 3 | 4 | **23** | contact left support | 7 impr, pos 19.7 | 81 words, two emails, no link to the Android or Premium FAQs that most contacts would need. |
| `/web` | 3 | 4 | 2 | 2 | 2 | 3 | 2 | 2 | **20** | left web version year grid | 0 | 50 words visible (JS app); no hreflang or locale copies; the title is fine. |
| `/terms` | 3 | 5 | 3 | 1 | 3 | 3 | 3 | 3 | **24** | (redirect stub) | 0 | Noindexed stub that sends visitors to Apple's EULA: correct. |
| `/download` | 3 | 5 | 3 | 1 | 3 | 3 | 3 | 3 | **24** | (redirect stub) | 0 | Noindexed stub; its canonical points to /download.html, harmless on a noindexed page. |
| `/promo` | 3 | 5 | 3 | 1 | 3 | 3 | 3 | 3 | **24** | (redirect stub) | 0 | Noindexed stub with no description; harmless. |

## Reasons that apply to the whole group

- **Search fit:** landing titles are 54-60 characters, lead with the query ("Days Since Widget for iPhone (Home & Lock Screen)") and descriptions run 140-156 characters. 5 only for `/android`, where title, description and the old-domain Android cluster line up exactly. Home is 4: the title carries "Countdown, Habit Tracker & Time Left Widgets" while 71% of old-domain clicks were the brand ("left app", "left time app"), which the title and H1 serve through the page name.
- **Depth:** landing pages beat what ranks (App Store listings, a Substack tutorial, generic how-tos) on method, sizes table, free-vs-Premium, FAQ and related tools. `/android` and `/web` are thinner by nature; press and contact are minimal.
- **E-E-A-T (3.1):** none of the landing pages shows a date, author or "tested on iOS 26" line, and the photo credits are the only sourcing. `privacy` is dated (5). The `Person` (founder) exists only in JSON-LD on home.
- **Conversion:** landing pages score 5 (hero, inline, end CTAs naming the feature). Home 4 (three CTAs, generic "Download for iOS"). `/android` 3: the CTA targets iPhone owners on a page for Android visitors, and the useful action (add the web version to the home screen) has no tracked CTA.
- **Technical:** canonicals, hreflang, sitemap state and schema are correct on every indexable page (`check-site` passes: 920 pages, 855 sitemap URLs). `/web` has no hreflang and no locale copies, and `/press`, `/contact`, `/privacy` carry no `BreadcrumbList`.
- **Translation:** landing pages and press and privacy are live in de, ja and zh-Hant (the `pages` releases); `pages/es-419`, `pt-BR`, `fr`, `es`, `ko`, `it`... are scheduled by `i18n/publish-schedule.json` and are not penalised. Home, contact and support are live in all 18 locales and current.

## Findings by page

| Page | Line | Evidence | Fix (see `fix-list.md`) |
|---|---|---|---|
| `/android` | Links 2 (verified: the 'Open Left on the web' button already exists above the iPhone CTA, so no new CTA is needed) | Inbound only from the home FAQ line and a support FAQ; no blog or tools page links it, though the old domain's Android queries (872 impr) are the best-proven demand | SITE-01 |
| `/` | Accuracy 4, Technical 3 | No visible "iOS 26"; `MobileApplication` nested in `WebSite.about`; 6 alt strings English in every locale | SITE-02, SITE-03, SITE-04 |
| `/countdown-widget`, `/days-since-widget`, `/habit-tracker`, `/android` | Accuracy 4 | "Left is free to download and its widgets are free." (the same unscoped line is on all four; the Opus check found the other three) | SITE-05 |
| all landing pages | E-E-A-T 3 | No updated date or author line | SITE-06 |
| `/life-calendar`, `/days-since-widget`, `/days-left-wallpaper` | Links 3 | 8, 14 and 11 inbound links | SITE-01 |
| `/contact`, `/press`, `/web` | Depth 2 | 81, 185 and 50 words | low priority, SITE-07 |
