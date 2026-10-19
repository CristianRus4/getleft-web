# getleft-web page inventory (read-only run)

Everything below came from one stdin Python program that printed to stdout and wrote nothing. The shell found 694 `.html` files plus the extensionless `friends` file, which gives 695 inventory rows. It excluded `node_modules`, `templates-photos` and `.git`. I also ran HEAD requests with curl against getleft.app and go.getleft.app, GET/HEAD only.

Sources:
- `sitemap.xml`
- `_redirects`
- `robots.txt`
- `_headers`

I did not read `build-i18n.mjs` or `build-tools-seo.mjs`, and I did not read BLUEPRINT.md.

Definitions:
- **Word count:** whitespace-split visible text, after removing script, style, svg, nav, footer, noscript, template and `<head>`.
- **CTA count:** anchors that are an App Store link, `/download|/app|/ios`, a `go.getleft.app` link, or carry a class matching `cta|btn|button`.
- **Own URL:** the clean-URL form, so `x.html` becomes `/x` and `dir/index.html` becomes `/dir/`. `friends` becomes `/friends`.

## 1. Headline findings

1. **No localized page is in the sitemap.**
   - `sitemap.xml` has 141 `<loc>` entries, all English (`/`, support, blog, tools, privacy, terms, web).
   - The 17 locale folders hold 544 pages (17 × 32), and none are listed.
   - 32 sitemap entries carry `xhtml:link` alternates (home, contact, support index and 29 support articles).
   - Each of those 32 has 19 alternates, including `x-default`. Locale URLs therefore appear only as alternates, never as their own `<loc>`.
2. **Blog canonicals point at redirecting URLs.**
   - All 47 blog posts use `<link rel="canonical" href="https://getleft.app/blog/<slug>.html">`. Example: `blog/smart-goals-guide.html`, which is the page's `<head>` canonical.
   - `curl -sI https://getleft.app/blog/smart-goals-guide.html` returns `HTTP/2 308 location: /blog/smart-goals-guide`, and the clean URL returns 200.
   - The sitemap lists the clean URL, so canonical and sitemap disagree.
   - `privacy.html`, `terms.html`, `press.html` and `web.html` have the same problem. Privacy returns 308 to `/privacy`, and I did not curl the other three.
   - The sitemap lists `/privacy`, `/terms` and `/web` while their canonicals are the `.html` forms. `press.html` is not in the sitemap at all.
3. **Blog and tools have no hreflang.**
   - 0 of 47 blog posts, the blog index, 57 tools, the tools index, press, legal and the other single pages carry any hreflang link.
   - Only home, contact, support index and support articles do, 19 links each.
   - The blog, tools and legal pages have no locale versions anyway (see section 2).
4. **All 47 blog posts have zero JSON-LD.** The blog index has `Blog`, `ImageObject` and `Organization`. Tools carry `WebApplication`, `Offer`, `Organization` and `BreadcrumbList`. Support articles carry `BreadcrumbList` only, with no `Article` or `HowTo` schema.
5. **No dates exist anywhere.** No page has `article:published_time`, `article:modified_time`, `datePublished`, `dateModified`, a `<time datetime>` or a visible "Updated" or "Published" string. The sitemap `lastmod` is one value, `2026-10-13`, on all 141 URLs.
6. **The `apple-itunes-app` meta tag is on 20 of 695 pages.** Those are the 18 home pages, `friends` and `invite/index.html`. It is missing on every blog, tool, support and press page. Every one of those pages has App Store links, averaging 2.
7. **Thin pages are mostly tools.** Of the 57 English tools, 40 are under 300 words (median 256, min 159). Three blog posts are under 300: `countdown-next-trip-with-friends` at 245, `left-planner-guide` at 243 and `what-is-year-progress` at 266.
8. **Duplicated hreflang links on 5 support articles.** `apple-health-automatic-tracking`, `fasting-in-left`, `focus-timer-in-left`, `mood-tracker-in-left` and `world-mood-globe` carry 21 hreflang links per page instead of 19. The `en` and `x-default` links are repeated twice. The same happens in all 17 locale copies, which is 90 pages with 21.

## 2. Totals

**By family (695 rows)**

| Family | Pages |
|---|---|
| support | 522 (29 articles × 18 locales) |
| tool | 57 |
| blog | 47 |
| home | 18 |
| contact | 18 |
| support-index | 18 |
| other | 5 (`friends`, `promo.html`, `partials/detect.html`, `partials/switcher.html`, `todoist/oauth/callback-fallback.html`) |
| invite | 2 (`invite/index.html`, `public/invite/index.html`) |
| legal | 2 (`privacy.html`, `terms.html`) |
| 404 | 1 |
| blog-index | 1 |
| download | 1 |
| press | 1 |
| tools-index | 1 |
| web-app | 1 |
| landing | 0 (none exist) |

**By locale**
- English has 151 pages.
- Each of the 17 locale folders has exactly 32 pages: de, es, es-419, fr, hi, id, it, ja, ko, nl, pl, pt, ro, ru, tr, zh-Hans, zh-Hant.
- Each locale folder holds 32 pages: home, contact, support index and 29 support articles. Nothing else is translated: no blog, tools, press, privacy or terms.

## 3. Family × locale table

Column key:
- **n:** page count.
- **med/min:** median and minimum word count.
- **noT:** missing titles.
- **dupT:** pages sharing a title with another page in the same locale.
- **noD:** missing meta descriptions.
- **noC:** missing canonical.
- **C≠:** canonical not equal to the page's own clean URL.
- **nidx:** noindex.
- **noHL:** zero hreflang links.
- **noLD:** no JSON-LD.

English rows:

| fam | loc | n | med | min | noT | dupT | noD | noC | C≠ | nidx | noHL | noLD |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| home | en | 1 | 1522 | 1522 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| blog | en | 47 | 1134 | 243 | 0 | 0 | 0 | 0 | 47 | 0 | 47 | 47 |
| blog-index | en | 1 | 1302 | 1302 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| tool | en | 57 | 256 | 159 | 0 | 0 | 0 | 0 | 0 | 0 | 57 | 0 |
| tools-index | en | 1 | 735 | 735 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| support | en | 29 | 625 | 451 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| support-index | en | 1 | 1997 | 1997 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| contact | en | 1 | 58 | 58 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| press | en | 1 | 165 | 165 | 0 | 0 | 0 | 0 | 1 | 0 | 1 | 1 |
| legal | en | 2 | 159 | 7 | 0 | 0 | 0 | 0 | 2 | 0 | 2 | 2 |
| download | en | 1 | 11 | 11 | 0 | 0 | 0 | 1 | 0 | 1 | 1 | 1 |
| invite | en | 2 | 0 | 0 | 1 | 1 | 1 | 2 | 0 | 1 | 2 | 2 |
| web-app | en | 1 | 13 | 13 | 0 | 0 | 0 | 0 | 1 | 0 | 1 | 1 |
| 404 | en | 1 | 21 | 21 | 0 | 0 | 0 | 1 | 0 | 1 | 1 | 1 |
| other | en | 5 | 13 | 0 | 2 | 2 | 4 | 4 | 1 | 2 | 5 | 5 |

Notes on the English rows:
- **terms:** `terms.html` (7 words, h1 "Redirecting...") is a redirect stub. It is canonical, listed in the sitemap, and its `robots` meta is `index,follow`.
- **friends:** `friends` is the one `other` page with a canonical mismatch. Its canonical is `https://go.getleft.app/friends`, a deliberate cross-host canonical.
- **invite:** the two invite pages are `invite/index.html` and `public/invite/index.html`. The latter is an empty shell with no title, description or lang.
- **404 and download:** these two pages have no canonical, which is appropriate for noindex.
- **dupT:** the two "other" and one invite title duplicates are the three empty-title partials and public invite page. They are the empty string, not a real duplicate.

Locale rows (the same 18 locales all pass these checks):
- **Pass on every column:** home, support index and the 29 support articles have no missing title, description or canonical, no mismatch, no noindex and no missing hreflang in any locale (only the JSON-LD column differs, below).
- **noLD:** contact has no JSON-LD in any locale (1 of 1 per locale).
- **Home:** home pages carry `FAQPage`, `MobileApplication`, `AggregateRating`, `Organization` and `WebSite` in all 18 locales. The support index carries `FAQPage` in all 18.
- **Support:** support articles carry `BreadcrumbList` in all 522.

Home word counts by locale (median = the single page):

| locale | words | locale | words | locale | words |
|---|---|---|---|---|---|
| en | 1522 | id | 1456 | ro | 1603 |
| de | 1504 | it | 1675 | ru | 1430 |
| es | 1791 | ko | 1204 | tr | 1337 |
| es-419 | 1802 | nl | 1607 | ja | 230 (*) |
| fr | 1864 | pl | 1448 | zh-Hans | 304 (*) |
| hi | 1861 | pt | 1783 | zh-Hant | 299 (*) |

Support-article word counts (median/min) by locale:

| locale | med / min | locale | med / min |
|---|---|---|---|
| en | 625 / 451 | ko | 480 / 313 |
| de | 627 / 423 | nl | 610 / 407 |
| es | 699 / 517 | pl | 565 / 387 |
| es-419 | 704 / 521 | pt | 680 / 505 |
| fr | 694 / 451 | ro | 665 / 444 |
| hi | 701 / 483 | ru | 562 / 376 |
| id | 580 / 400 | ja | 199 / 108 (*) |
| it | 665 / 450 | zh-Hans | thin by word count (*) |

(*) These CJK numbers are an artifact of whitespace tokenisation, not thin content. A non-space character count on `ja/support/add-friends.html` gives 2114, against 3108 for the English page. `zh-Hans/index.html` gives 3467. Of the 162 "thin" pages, 29 each in ja, zh-Hans and zh-Hant support plus their home pages are CJK false positives. UNVERIFIED: I did not recompute character counts for every CJK page. In the table above I did not re-read the zh-Hans and zh-Hant support rows, so that row is the pattern, not a printed value.

## 4. English blog posts (47 plus index)

All 47 posts have JSON-LD types `-` (none), 2 CTAs (1 for `how-to-add-widgets-iphone`, 3 for `presentation-timer-iphone` and `project-timeline-visualization`), and App Store link counts equal to their CTA counts. Format: path, words, title (length), description length. Every title ends in "- Left Blog" (11 characters).

| Path | Words | Title (chars) | Desc |
|---|---|---|---|
| blog/adhd-body-doubling-apps | 1134 | ADHD Body Doubling: Apps and Alternatives That Actually Work (72) | 155 |
| blog/adhd-morning-routine-iphone | 1131 | How to Build an ADHD-Friendly Morning Routine on iPhone (67) | 160 |
| blog/adhd-reward-system | 1728 | How to Build a Sustainable ADHD Reward System (2026) (64) | 161 |
| blog/adhd-students-study-tools-iphone | 1099 | Study Tools for Students with ADHD (iPhone, 2026) (61) | 158 |
| blog/adhd-task-initiation-strategies | 1258 | ADHD Task Initiation: How to Start When You Can't (61) | 155 |
| blog/adhd-time-blindness-iphone | 1173 | ADHD Time Blindness: What It Is and How Widgets Help (64) | 130 |
| blog/adhd-work-from-home-setup | 1182 | ADHD Work From Home: A Widget-Driven Setup That Works (65) | 164 |
| blog/aim-goal-tracker-left | 575 | Aim in Left: Track Any Goal You Can Count (53) | 144 |
| blog/best-apple-watch-apps-adhd | 1375 | 10 Best Apple Watch Apps for ADHD (2026) (52) | 130 |
| blog/best-apps-for-adhd-iphone | 1324 | 10 Best Apps for People with ADHD (iPhone, 2026) (60) | 143 |
| blog/best-countdown-widgets-iphone | 331 | Best Countdown Widgets for iPhone Home Screen (2026) (64) | 118 |
| blog/best-free-widget-apps-iphone | 850 | 10 Best Free Widget Apps for iPhone (2026) (54) | 138 |
| blog/best-goal-tracking-apps-iphone | 1023 | Best Goal Tracking Apps for iPhone (2026) (53) | 139 |
| blog/best-habit-tracker-apps-iphone | 946 | 7 Best Habit Tracker Apps for iPhone (2026) (55) | 127 |
| blog/best-home-screen-widgets-iphone | 1470 | 10 Best Home Screen Widgets for iPhone (2026) (57) | 125 |
| blog/best-planner-adhd | 1706 | How to Choose the Best Planner for ADHD (2026) (58) | 137 |
| blog/best-productivity-apps-adhd | 1077 | Best Productivity Apps for ADHD (iPhone, 2026) (58) | 139 |
| blog/best-productivity-apps-mac | 1027 | Best Productivity Apps for Mac (2026) (49) | 161 |
| blog/best-reminder-apps-iphone | 1755 | 10 Best Reminder Apps for iPhone (2026) (51) | 160 |
| blog/countdown-clock-graphic-guide | 1038 | Designing a Countdown Clock Graphic: A 2026 Guide (61) | 156 |
| blog/countdown-next-trip-with-friends | 245 | Counting Down to Your Next Trip (and Sharing It with Friends) (73) | 104 |
| blog/digital-clock-date-widget-iphone | 1855 | How to Set Up a Digital Clock and Date Widget on iPhone (2026) (74) | 153 |
| blog/event-planning-timeline | 1421 | Event Planning Timeline: A Step-by-Step Guide (2026) (64) | 161 |
| blog/goal-progress-tracker-setup | 1186 | Goal Progress Tracker App: Your Setup Guide (2026) (62) | 153 |
| blog/habitkit-vs-left | 364 | HabitKit vs Left - A Fair Comparison (48) | 101 |
| blog/home-screen-timer-iphone | 936 | How to Put a Countdown Timer on Your iPhone Home Screen (2026) (74) | 151 |
| blog/how-to-add-widgets-iphone | 343 | How to Add Widgets on iPhone, iPad, Lock Screen, and StandBy (72) | 89 |
| blog/how-to-build-a-streak | 311 | How to Build a Streak on Your iPhone (48) | 80 |
| blog/how-to-focus-adhd | 1280 | How to Focus with ADHD: Practical Steps That Work (61) | 160 |
| blog/iphone-aesthetic-widgets-guide | 1134 | iPhone Aesthetic Widgets: A 2026 How-To Guide (57) | 146 |
| blog/keep-track-multiple-projects | 1058 | How to Keep Track of Multiple Projects (Without Losing Your Mind) (77) | 152 |
| blog/left-apple-watch-app | 469 | Left on Apple Watch: Time, Plans, Habits, Aims, and Countdowns on Your Wrist (88) | 134 |
| blog/left-planner-guide | 243 | Left Planner: Your Day in One View (46) | 116 |
| blog/left-wallpaper-guide | 427 | The Left Wallpaper: A Lock Screen That Updates Itself (65) | 81 |
| blog/presentation-timer-iphone | 1602 | The Best Presentation Timer Setup for iPhone, Watch, and Mac (2026) (79) | 148 |
| blog/productivity-tools-visual-focus | 940 | Productivity Tools: Why Visual Beats Feature-Heavy (62) | 148 |
| blog/project-timeline-visualization | 1495 | Project Timeline Visualization: From Gantt to Glanceable Widgets (76) | 145 |
| blog/smart-goals-guide | 1313 | SMART Goals: A Practical Setup Guide for 2026 (57) | 135 |
| blog/smart-goals-visual-guide | 1193 | SMART Goals Visual: How to Track Them on Your Devices (65) | 129 |
| blog/stay-consistent-with-goals | 1208 | How to Stay Consistent with Goals (Without Relying on Willpower) (76) | 159 |
| blog/time-management-best-practices | 1611 | 10 Time Management Best Practices That Actually Work (2026) (71) | 159 |
| blog/time-management-tips-students | 1449 | 10 Time Management Tips for Students (2026) (55) | 156 |
| blog/timer-interval-app-iphone | 1073 | Interval Timer Apps: Beyond Fitness - A Guide for Focus and Habits (78) | 150 |
| blog/visual-goals-track-on-screens | 1325 | Visual Goals: How to Track Ambitions on Your iPhone Screens (71) | 162 |
| blog/visual-reminders-adhd-apple-setup | 1033 | Visual Reminders for ADHD: Apple Devices Setup Guide (64) | 153 |
| blog/what-is-year-progress | 266 | What is Year Progress, and Why You Should Track It (62) | 100 |
| blog/workplace-productivity-habits | 1398 | 10 Workplace Productivity Habits That Actually Stick (64) | 143 |
| blog/index (index) | 1302 | Left Blog - Time Left, Habits, Countdowns & Widgets (51) | 116 |

The blog index has JSON-LD `Blog`, `ImageObject`, `Organization`, 1 CTA and 1 App Store link, and no hreflang.

Blog length distribution: 3 posts under 300 words, 3 more between 300 and 440 (`habitkit-vs-left` 364, `how-to-add-widgets-iphone` 343, `how-to-build-a-streak` 311, `best-countdown-widgets-iphone` 331), and the rest over 460.

## 5. English tools (57 plus index)

All tools share the same JSON-LD set: `BreadcrumbList`, `ListItem`, `Offer`, `Organization`, `WebApplication`. Each has 2 CTAs and 2 App Store links. Titles end in "| Left" (6 characters), range 43 to 60 characters, and none exceed 60. Descriptions run 116 to 158 characters. The tools-index title is 65 characters and its description 164.

| Path (tools/) | Words | Title len | Desc |
|---|---|---|---|
| add-subtract-date-calculator | 293 | 57 | 131 |
| age-calculator | 265 | 44 | 146 |
| anniversary-countdown | 162 | 58 | 133 |
| business-days-calculator | 321 | 60 | 133 |
| business-days-from-date | 208 | 57 | 129 |
| christmas-countdown-widget | 386 | 53 | 157 |
| countdown-timer | 159 | 52 | 129 |
| date-countdown-calculator | 425 | 51 | 158 |
| date-units-converter | 186 | 56 | 116 |
| days-between-two-dates | 309 | 49 | 158 |
| days-since-date | 263 | 50 | 153 |
| days-until-birthday | 258 | 50 | 146 |
| days-until-easter | 272 | 50 | 140 |
| days-until-fall | 252 | 50 | 143 |
| days-until-fathers-day | 251 | 51 | 137 |
| days-until-halloween | 256 | 53 | 145 |
| days-until-mothers-day | 310 | 51 | 137 |
| days-until-new-year | 286 | 52 | 146 |
| days-until-spring | 319 | 53 | 143 |
| days-until-summer | 294 | 54 | 144 |
| days-until-thanksgiving | 240 | 51 | 146 |
| days-until-valentines | 226 | 54 | 147 |
| days-until-winter | 308 | 54 | 144 |
| deadline-countdown-calculator | 184 | 54 | 131 |
| end-of-fasting-calculator | 315 | 56 | 128 |
| fasting-countdown | 322 | 53 | 127 |
| fiscal-year-progress-calculator | 183 | 52 | 133 |
| habit-streak-calculator | 195 | 50 | 136 |
| hours-between-two-dates | 268 | 49 | 131 |
| hours-since-date | 198 | 55 | 148 |
| intermittent-fasting-duration-calculator | 307 | 57 | 129 |
| iso-week-number | 313 | 52 | 137 |
| life-expectancy-calculator | 424 | 55 | 148 |
| meeting-time-calculator | 166 | 53 | 140 |
| minutes-between-two-times | 199 | 43 | 139 |
| percentage-year-calculator | 393 | 56 | 157 |
| pregnancy-due-date-calculator | 311 | 58 | 134 |
| quarter-countdown-calculator | 176 | 52 | 135 |
| reading-time-calculator | 182 | 49 | 140 |
| retirement-countdown-calculator | 179 | 52 | 126 |
| school-days-calculator | 187 | 54 | 124 |
| semester-countdown-calculator | 189 | 50 | 134 |
| sleep-calculator | 381 | 54 | 142 |
| sobriety-calculator | 172 | 47 | 122 |
| time-between-two-times | 179 | 49 | 122 |
| time-left-in-year-calculator | 328 | 52 | 154 |
| time-passed-in-year-calculator | 299 | 53 | 151 |
| time-until-weekend | 253 | 57 | 145 |
| time-zone-meeting-planner | 196 | 56 | 121 |
| unix-milliseconds-converter | 168 | 53 | 137 |
| unix-timestamp-converter | 328 | 53 | 130 |
| vacation-countdown | 179 | 48 | 128 |
| wedding-countdown | 176 | 50 | 118 |
| weeks-until-date | 259 | 51 | 134 |
| what-was-the-date | 257 | 54 | 136 |
| workday-countdown | 191 | 49 | 137 |
| working-hours-calculator | 205 | 58 | 136 |
| index | 735 | 65 | 164 |

Some tool titles contain a year, for example `days-until-new-year` ("Countdown 2026"). No tool has a date field.

## 6. English support articles (29 plus index)

Each has JSON-LD `BreadcrumbList` and `ListItem`, 3 CTAs and 2 App Store links. Titles end in "| Left" except `world-mood-globe`, which ends in "| Left Support".

| Path (support/) | Words | Title len | Desc |
|---|---|---|---|
| account-and-sync | 779 | 43 | 128 |
| accountability-with-friends | 727 | 43 | 127 |
| add-friends | 728 | 33 | 114 |
| aims-in-left | 683 | 28 | 170 |
| apple-health-automatic-tracking | 625 | 62 | 98 |
| apple-watch-app | 796 | 37 | 132 |
| choose-your-tools | 1011 | 39 | 126 |
| edit-or-remove-widget-iphone | 594 | 54 | 130 |
| fasting-in-left | 632 | 33 | 115 |
| focus-modes-with-left | 662 | 51 | 148 |
| focus-timer-in-left | 592 | 50 | 121 |
| iphone-action-button-left | 577 | 53 | 133 |
| joint-ahead-dates | 691 | 52 | 114 |
| left-shortcuts | 720 | 45 | 124 |
| mood-tracker-in-left | 605 | 42 | 111 |
| organise-ahead-since | 592 | 46 | 117 |
| restore-purchases | 671 | 39 | 134 |
| set-up-your-lifespan | 934 | 42 | 113 |
| streaks-vs-habits | 856 | 55 | 113 |
| wallpaper-shortcut | 832 | 48 | 138 |
| widget-ipad-home-screen | 616 | 51 | 133 |
| widget-ipad-lock-screen | 557 | 51 | 137 |
| widget-iphone-home-screen | 624 | 53 | 126 |
| widget-iphone-lock-screen | 617 | 53 | 131 |
| widget-iphone-standby | 583 | 48 | 129 |
| widget-mac-desktop | 593 | 46 | 140 |
| widget-mac-notification-center | 620 | 53 | 139 |
| widget-transparent-iphone | 595 | 45 | 124 |
| world-mood-globe | 451 | 39 | 89 |
| support.html (index) | 1997 | 14 | 124 |

The support index has JSON-LD `FAQPage`, `Question` and `Answer`, 2 CTAs and 1 App Store link.

## 7. Anomaly lists

**Thin (under 300 words), 162 pages**
- English:
  - 40 tools.
  - 3 blog posts: `countdown-next-trip-with-friends`, `left-planner-guide`, `what-is-year-progress`.
  - Single pages: 404, contact, download, press, terms (7 words), web, promo, invite, the todoist fallback and both partials.
  - `friends` (49 words).
- Contact is thin in all 18 locales, 10 to 62 words. It is a short contact form page.
- Locale false positives (CJK tokenisation) are described in section 3.

**Title length**
- Titles over 60 characters: 105 pages. Titles under 25 characters: 79.
- English offenders: 46 pages. 30 of the 47 blog posts exceed 60 (the "- Left Blog" suffix alone costs 11). Over 60 also: `index.html` (61), `tools/index.html` (65) and `support/apple-health-automatic-tracking` (62).
- Under 25 in English: contact (14), support (14), press (12), download (12), invite (9), web (4), 404, privacy (21), terms (23), the todoist fallback, plus the partials with empty titles.
- By locale, titles outside the 25 to 60 band: de 10, es-419 8, es 8, fr 13, hi 4, id 5, it 8, ja 10, ko 4, nl 7, pl 7, pt 7, ro 8, ru 7, tr 6, zh-Hans 13, zh-Hant 13. The CJK locales are not comparable by character count.
- Under 25 by family: support-index 18 and contact 18 (one per locale each), plus the English single pages.

**Description length**
- Over 160: 137 pages. Under 70 (including missing): 82. Missing outright: 5.
- English over 160: `blog/adhd-reward-system` (161), `adhd-work-from-home-setup` (164), `best-productivity-apps-mac` (161), `event-planning-timeline` (161), `visual-goals-track-on-screens` (162), `index.html` (165), `support/aims-in-left` (170), `tools/index.html` (164).
- English missing: `promo.html`, the todoist fallback, both partials and `public/invite/index.html`.
- English under 70, with a description present: the 5 blog posts at 80 to 89 characters. Those are `how-to-add-widgets-iphone` (89), `how-to-build-a-streak` (80), `left-wallpaper-guide` (81), plus `world-mood-globe` (89) and `apple-health-automatic-tracking` (98 is above 70). I flagged only values the run printed, so treat borderline cases as UNVERIFIED.
- By locale, count outside 70 to 160: zh-Hans 28, zh-Hant 28, fr 16, de 14, it 14, tr 13, ja 12, ro 12, nl 10, id 9, ko 9, pl 9, es 7, es-419 7, pt 7, ru 7, hi 4. The zh counts reflect CJK character norms.

**Duplicate titles**
- Within a locale: the only duplicate group is the English empty-title group (`partials/detect.html`, `partials/switcher.html`, `public/invite/index.html`).
- Localized titles that equal the English title: 3, one each in fr, nl and ro.

**Duplicate descriptions:** 26 groups of identical text across pages. Examples are Spanish text shared by `es` and `es-419` copies (support articles for backup, accountability, Aims, Health, Watch, Choose your tools). I did not print the full list.

**Canonical mismatches, 52**
- 47 blog posts: canonical is the `.html` form, which 308-redirects.
- `press.html`, `privacy.html`, `terms.html`, `web.html`: same pattern.
- `friends`: canonical is `https://go.getleft.app/friends`.
- Missing canonical (8): `404.html`, `download.html`, `invite/index.html`, `promo.html`, `public/invite/index.html`, `todoist/oauth/callback-fallback.html`, and the two partials.
- All 18 home pages, all support pages, contact pages and tools have a self-referencing canonical.

**Robots meta**
- 638 pages have `index,follow`. 52 have no robots meta. 5 are noindex: `404.html`, `download.html`, `invite/index.html`, `promo.html` and `todoist/oauth/callback-fallback.html`.
- All five noindex pages are correctly absent from the sitemap.

**Pages not in the sitemap, 554**
- 544 localized pages (17 × 32).
- 10 English: `404.html`, `download.html`, `friends`, `invite/index.html`, `partials/detect.html`, `partials/switcher.html`, `press.html`, `promo.html`, `public/invite/index.html` and `todoist/oauth/callback-fallback.html`.
- Of those, `press.html` and `friends` are indexable, with a self or go-host canonical.
- The partials are fragments with no title or canonical. Whether they are served publicly is UNVERIFIED.

**Sitemap URLs with no file:** none (0 of 141).

**html lang against folder**
- 35 mismatches.
- 32 are the `es/` folder carrying `lang="es-ES"` (consistent with `es-ES` in hreflang, so probably intentional; the `es` folder uses `es-ES`).
- 3 English files have no `lang` attribute: the two partials and `public/invite/index.html`.
- All other locale folders match their folder code. `es-419`, `zh-Hans` and `zh-Hant` match exactly.

**Heading structure:** No page has more than one `<h1>`. Pages without an `<h1>`: `download.html`, `invite/index.html`, `promo.html`, `web.html`, the two partials and `public/invite/index.html`. `terms.html` has an h1 reading "Redirecting...".

## 8. Sitemap detail

- 141 `<url>` entries.
- Formats:
  - 3 trailing-slash (`/`, `/blog/`, `/tools/`).
  - 138 clean extensionless.
  - 0 `.html`.
- `lastmod`: min = max = `2026-10-13`, 1 distinct value, 0 missing, all 141 entries identical. This suggests it is stamped by the build rather than per-page edits. UNVERIFIED, because I did not read the generator.
- `xhtml:link` alternates: present on 32 entries (19 each, including `x-default`), absent on 109. Hreflang codes used: `de`, `en`, `es-419`, `es-ES`, `fr`, `hi`, `id`, `it`, `ja`, `ko`, `nl`, `pl`, `pt`, `ro`, `ru`, `tr`, `x-default`, `zh-Hans`, `zh-Hant`.
- Locale representation: 141 of 141 entries are English. The locale URLs appear only inside alternates.
- Missing from the sitemap: see section 7.

## 9. Related checks

- **Redirects (`_redirects`):** `/download`, `/app` and `/ios` 302 to the App Store (`id6740155884`). `/android` 302s to `/web`. Removed pages (`/ios-26.html`, `/ios-26-es.html`, `/better2026.html`) 301 to `/press.html` or `/`.
- **robots.txt:** allows all crawlers and names AI bots explicitly. `Sitemap: https://getleft.app/sitemap.xml`.
- **Live curl:**
  - `/blog/smart-goals-guide.html` returns 308 to `/blog/smart-goals-guide`.
  - `/privacy.html` returns 308 to `/privacy`.
  - `/press`, `/de/`, `/de/support/add-friends`, `/friends` and `/tools/age-calculator` return 200.
  - `https://go.getleft.app/friends` returns 200.
- **Reading note:** The ja, zh-Hans and zh-Hant home and support-index word counts are unreliable. `friends` is the one extensionless HTML file, served with `Content-Type: text/html` via `_headers`.

## 10. Not verified

- Whether any page body carries a visible "updated" or "published" date inside text my regexes missed. The run found none on any page, in meta, JSON-LD, `<time>` or visible text.
- Full duplicate-description list across locales (counts only).
- CJK character-count equivalents for every ja, zh-Hans and zh-Hant page.
- Whether `partials/*.html` and `public/invite/index.html` are publicly served.
- Whether Cloudflare serves the locale pages with 200 for all 544 URLs. I curled only `/de/` and one de support article.

Files used (read-only):
- `/Users/cristian/Developer/Webs/getleft-web/sitemap.xml`
- `/Users/cristian/Developer/Webs/getleft-web/_redirects`
- `/Users/cristian/Developer/Webs/getleft-web/_headers`
- `/Users/cristian/Developer/Webs/getleft-web/robots.txt`
- the HTML tree under `/Users/cristian/Developer/Webs/getleft-web`
