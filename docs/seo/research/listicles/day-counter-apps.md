# Research: day counter apps (targets "day counter app" / "best day counter app iPhone" / "day counter widget")

Checked 2026-10-20. Every fact below comes from the US App Store page (apps.apple.com/us) and the iTunes lookup API / page JSON (via appfacts.py) fetched today. "Not stated" means the listing (description, release notes, version history, compatibility, privacy label) does not say. It does not mean the app lacks the feature. Developer websites were not used.

Notes:
- The App Store page shows at most 10 in-app purchase rows; repeated names are different price points. Periods are only known when the product name says so.
- Ratings are the US averages the App Store page displays (one decimal) plus the count.
- The version history the script could read (up to 25 entries per app, fewer for apps with short histories) was searched; keyword checks for Lock Screen, StandBy, Live Activities, Watch, iCloud and sync covered all of it.
- No listing in this set mentions Live Activities. Only Big Days mentions StandBy. Lock Screen widgets are named by Yoji, Count Time, DayCount, Countdown Days Since & Until and TheDayBefore (details per app).
- Overlap with the existing "best days since apps" page: DayCount (1121088244) and Countdown Days Since & Until (732814593) are reused (2 of the 7). The other five are new to that page's set.
- Intent split: in this set "day counter" apps count both ways (until and since) and are widget-led. Sobriety / quit-habit apps are the other branch and are covered by the days-since page.

## Recommendation

Strongest 7 to feature (current, count up and down, widgets):
1. **DayCount, Zaminiti Pty Ltd** (1121088244) - 4.7 from 26,262, updated 2026-10-11. "Countdown using event counters that track time before and after your date"; Home and Lock Screen widgets with a "Widget Builder" (filters, fonts, textures, borders); streaks in the same app; repeat, reminders, calendar import, backup and sync across iPhone, iPad and Mac. Premium is subscription or lifetime. (Reuse from the days-since page.)
2. **Countdown Days Since & Until, Joseph Sferrazza** (732814593) - 4.8 from 2,522, updated 2026-10-11. "counting down (or up)" in seconds to years or "sleeps"; Home and Lock Screen widgets (ad-free via in-app purchase); Apple Watch app and complications; calendar import; collaboration; iOS 27 Siri and Spotlight. Has ads. (Reuse.)
3. **Day Counter - Countdown Timer, BITSENS, UAB** (1499976509) - 4.7 from 455, updated 2026-09-25. The most literal match for the query: "Count Up & Countdown Modes", unlimited counters, widgets (one free widget since v1.38.0, others paid), swipe between days, weeks, months, years. Ads plus a long list of separate IAPs; privacy label shows tracking.
4. **Countdown & Count Up Timer, Yoji Shimobayashi** (919998681) - 4.7 from 2,317, updated 2026-10-01. Both directions in the title; "Create as many events as you like"; Home Screen and Lock Screen widgets; recurring events; years, months, weeks, days or hours; iCloud backup and restore. No IAP rows listed; ads and tracking in the label.
5. **Count Time Until & Days Since, Javier Gallo Roca** (1532688451) - 4.6 from 168, updated 2026-04-08. "Count Up or Down"; Widgets for Home and Lock Screen (Counter List widget added 2026-02); iCloud Sync; Control Center, Lock Screen or Action button access. No ads shown in the age-rating block; paid tiers named Weekly Plan, Monthly Plan, Annual and Lifetime. Smaller rating count; last update 6.5 months ago.
6. **Big Days - Event Countdown, Vittorio Sorbera** (940109775) - 4.6 from 592, updated 2026-08-07. "Days remaining & days since"; widgets only arrived in v10.0.0 (Home Screen and StandBy, the only StandBy mention in the set). Big Days Pro $3.99 and Widget Pack $2.99 as listed. Ads and tracking in the label. Widgets are new, so reviews of them are thin.
7. **Day Counter ., Inner Grow Limited** (1597681894) - 4.8 from 1,606, updated 2026-10-15. "Countdown to events and dates / Count up days since" plus holidays and expiry dates; lifetime tiers named; "Data Not Collected". Widgets are only evidenced by a release-note line ("fix widget bugs", v1.6.11), not by the description. Release notes are almost entirely "fix bugs".

Documented but dropped:
- **TimeCount - Countdown & Widget, App Forgeron LLC** (1497946231): 4.6 from 24,583, updated 2026-10-14, Home Screen widgets and Watch not listed. Dropped because the listing only describes counting down ("Countdown to your life's most special moments"); count up is not stated. Heavy IAP list (Premium Forever $44.99 / $34.99, yearly $19.99).
- **Countdown Widget & Counter (Widget Studio), Sovereign Apps LLC** (1533996161): 4.6 from 2,435, updated 2026-10-05. Strong widgets (Home, Control Center, photo backgrounds, "Live countdown widgets") and an Apple Watch app, privacy label "Data Not Linked to You: Purchases, Diagnostics". Dropped because the listing describes only countdowns ("Widgets show "Today" on the day of your event, and "Countdown Ended" after"); count up is not stated. Good fallback if a countdown-only entry is wanted.
- **TheDayBefore (days countdown), TheDayBefore, Inc.** (991283955): 4.8 from 1,079, updated 2026-10-17. The D-Day style app: 80+ keywords, anniversary notifications at "100 days and 1-year milestones", Home and Lock Screen widgets, Apple Watch. Count-up direction is not stated; community, stories and comments layer; ads, tracking, age rating 9+.
- **Days Matter (倒数日 · Days Matter), iDaily Corp.** (406170251): 4.8 from 8,238, updated 2026-09-17. Counts both ways ("倒数/正数日期") with an Apple Watch app, but the description, release notes and IAP names are in Chinese; poor fit for an English article.
- **Countdown Timer: Day Counter, Gregory Strigunov** (1118406319): stale, last update 2021-12-28 (v1.2.1). Two modes ("How much time left to the event" / "How much time has passed after the event"), "Without advertising", "Data Not Collected", no widgets stated.
- **Countdown, Find Appiness** (1403367428) and **Countdown by Find Appiness** variants: already on the days-since page and the birthday sheet; not repeated.
- Not fetched in full (tiny rating counts or poor fit from the search results): Days Counter: Event Countdown (1499388693, 6 ratings, last update 2024-02-29), Elapsed - Days Since Counter (6762868290, 19 ratings), Dayward (6797370907, 3 ratings), Dayspan (6794791699, 1 rating), Day Counter: Since & Until (6786448809, 0 ratings), D-Day CountDown (1518400866, 1 rating), Days Counter, Notes (6754532311, 0 ratings), Days - Sobriety Counter (1084331959, sobriety only). Also seen in search: Days • Countdown & Widgets (939368917, 4.8, MD Apps LTD), Countdowns: Widgets & Timer (917514700, Shayes Apps), Countdown@ (1456997268), Countdown Buddy (1534850579) - not fetched, outside the brief's candidate list.

## Competition

One WebSearch today for "best day counter app iPhone widget". Results, titles and domains only:
- Days • Countdown & Widgets - App Store (apps.apple.com)
- Countdowns - Event Countdown App - App Store (apps.apple.com)
- 【2025】12 Best Free Countdown Apps (iPhone/Android) (widget-club.com)
- 12 Best Day Counter Apps for Android & iPhone (techviral.net)
- Left - Habit Tracker, Countdown & Life Widgets for iPhone (left-time.app)
- Day Counter App: 7 Best Apps to Count the Days (2026) (habitbox.app)
- Day Counter Widget - CountDown (apps.apple.com)
- Event Day Countdown Widget (apps.apple.com)
- Day Counter - widget (apps.apple.com)

## App blocks

### DayCount

- **Exact App Store name:** DayCount
- **Developer (seller):** Zaminiti Pty Ltd
- **URL / ID:** https://apps.apple.com/us/app/id1121088244 / 1121088244
- **Price to download:** Free
- **In-app purchases as listed:** DayCount Premium = $9.99; DayCount Forever = $29.99; DayCount Pro = $59.99; StreakCount = $59.99. Description: "DayCount Premium is available as an annual subscription or a lifetime purchase." and "DayCount offers an auto-renewing yearly subscription with a free 7-day trial." Periods are not in the product names.
- **Free tier limits (verbatim):** Not stated as a number. The description lists features without marking which are paid, and mentions "an auto-renewing yearly subscription with a free 7-day trial".
- **Platforms from the Compatibility section (verbatim):** iPhone Requires iOS 16.0 or later.; iPad Requires iPadOS 16.0 or later.; Mac Requires macOS 13.0 or later and a Mac with Apple M1 chip or later.; Apple Vision Requires visionOS 1.0 or later.. Minimum iOS: 16.0. Apple Watch not listed.
- **Rating (US):** 4.7 from 26,262 ratings
- **Current version:** 6.1.1, released 2026-10-11. **First release:** 2016-06-16 (year 2016).
- **Key features and where each was found:**
  - Counting directions: both. "Countdown using event counters that track time before and after your date" (description).
  - Units: "Decimal counting for precise measurements" (description); days, weeks etc. as units: Not stated beyond "Alerts minutes, hours, days, weeks, months, or years before or after events".
  - Widgets: "Add widgets to your Home Screen or Lock Screen"; "Create widgets using different filters, fonts, textures, and borders" (description). Widget Builder v5.0 (2022-02-09), Lock Screen widgets v5.3 (2022-09-28), Upcoming-events list widget v5.7 (2025-02-15) (version history). StandBy: Not stated.
  - Live Activities: Not stated.
  - Apple Watch: Not listed in Compatibility; not mentioned in version history.
  - Sync: "Backup and sync events and streaks across iPhone, iPad, iPod touch, and Mac" (description).
  - Streaks: "Build positive habits by tracking daily streaks" (description).
  - Other: repeats daily to custom intervals, notes, calendar import, location, Face ID / Touch ID lock, Unsplash images, Siri and Shortcuts (release notes v6.1.1).
- **Ads:** age-rating block shows no "Contains: Advertising" line (rated 4+ "with content restrictions ... In-App Controls Parental Controls").
- **Privacy label (Apple's wording):** Data Linked to You: Contact Info, User Content | Data Not Linked to You: Purchases, Identifiers, Usage Data, Diagnostics
- **Best for:** People who want one app for both directions with the most widget customization and streaks alongside.
- **Limits the listing itself states:** Premium is a yearly subscription or a lifetime purchase; the free-tier boundary is not stated. Data Linked to You includes Contact Info and User Content.
- **Checked 2026-10-20.** Fetched: https://apps.apple.com/us/app/id1121088244 and the lookup for 1121088244 (US).

### Countdown Days Since & Until

- **Exact App Store name:** Countdown Days Since & Until
- **Developer (seller):** Joseph Sferrazza
- **URL / ID:** https://apps.apple.com/us/app/id732814593 / 732814593
- **Price to download:** Free
- **In-app purchases as listed:** Unlock All = $4.99; Remove Ads = $2.99; Color and Effect Pack = $2.99; Falling Object Pack = $1.99; Let it Snow = $1.99. Periods not stated in the names.
- **Free tier limits (verbatim):** "Unlimited Events - Add as many countdowns as you want." Widgets: "Add beautiful widgets to your Home or Lock Screen (ad-free with in-app purchase)."
- **Platforms from the Compatibility section (verbatim):** iPhone Requires iOS 15.0 or later.; iPad Requires iPadOS 15.0 or later.; iPod touch Requires iOS 15.0 or later.; Mac Requires macOS 12.0 or later and a Mac with Apple M1 chip or later.; Apple Vision Requires visionOS 1.0 or later.; Apple Watch Requires watchOS 11.0 or later.. Minimum iOS: 15.0.
- **Rating (US):** 4.8 from 2,522 ratings
- **Current version:** 10.0.0, released 2026-10-11. **First release:** 2013-11-08 (year 2013).
- **Key features and where each was found:**
  - Counting directions: both. "counting down (or up)" (description); "Added the ability to differentiate from upcoming and past events" (v9.0.0/9.1.0).
  - Units: "seconds, minutes, hours, days, weeks, months, years - or even sleeps"; "8 different time formats" (description).
  - Widgets: "Add beautiful widgets to your Home or Lock Screen" (description). 9 visual styles for Home Screen widgets (v9.3.0, 2026-03-08), custom text colors (v9.5.0), tinted and clear Home Screen backgrounds (v9.4.1). StandBy: Not stated.
  - Live Activities: Not stated.
  - Apple Watch: yes. "Sync Everywhere - Automatically updates across your devices and Apple Watch" (description); "Add countdowns to your Apple Watch face" (v9.8.0); Watch complications (v9.9.0).
  - Sync: "Automatically updates across your devices and Apple Watch" (description); "Improved iCloud syncing" (v8.0.0).
  - Other: calendar import; Siri on iOS 27, Spotlight search, Image Playground backgrounds (v10.0.0); collaboration and Countdown History (v9.5.0); iMessage app (v9.6.0).
- **Ads:** "Contains: Advertising" shown; "Remove Ads = $2.99" listed.
- **Privacy label (Apple's wording):** Data Not Linked to You: Diagnostics
- **Best for:** Watch-face and widget users who want both directions and a very small privacy footprint, and will pay a few dollars to remove ads.
- **Limits the listing itself states:** Widgets are ad-free only with an in-app purchase; ads in the free app.
- **Checked 2026-10-20.** Fetched: https://apps.apple.com/us/app/id732814593 and the lookup for 732814593 (US).

### Day Counter - Countdown Timer

- **Exact App Store name:** Day Counter — Countdown Timer
- **Developer (seller):** BITSENS, UAB
- **URL / ID:** https://apps.apple.com/us/app/id1499976509 / 1499976509
- **Price to download:** Free
- **In-app purchases as listed (10 rows shown, names and prices copied exactly):** Widget = $5.99; All In One. 60% OFF = $9.99; All In One = $24.99; All In One = $19.99; Notes = $3.49; All In One. 75% OFF = $4.99; Dark Mode = $4.49; All In One. 50% OFF = $9.99; Remove Ads = $2.99; Unlimited counters = $10.99. No periods in the names, so one-time versus recurring is not stated on the page.
- **Free tier limits (verbatim):** "Day Counter is a free, customizable counting app with two powerful modes: count up and countdown." The description also says "Unlimited Counters" and "Create and manage an unlimited number of events with ease", while an IAP row is named "Unlimited counters" ($10.99): the listing is inconsistent on what is free. Version history v1.38.0 (2025-11-05): "We also added a free widget available for everyone."
- **Platforms from the Compatibility section (verbatim):** iPhone Requires iOS 15.6 or later.; iPod touch Requires iOS 15.6 or later.; Apple Vision Requires visionOS 1.0 or later.. Minimum iOS: 15.6. iPad and Apple Watch not listed.
- **Rating (US):** 4.7 from 455 ratings
- **Current version:** 1.42.2, released 2026-09-25. **First release:** 2020-04-11 (year 2020).
- **Key features and where each was found:**
  - Counting directions: both. "Count Up & Countdown Modes - track days since or days until any event" (description).
  - Units: "Count down days, hours, minutes, and even seconds" (description); "Swipe to cycle units on the detail screen ... days, weeks, months, and years" (v1.39.0).
  - Widgets: "Widgets & Reminders" (description). "New widgets in multiple sizes and layouts, showing one or several events" and a free widget (v1.38.0); widgets follow the in-app order (v1.39.0). Lock Screen and StandBy: Not stated.
  - Live Activities: Not stated. Apple Watch: Not stated. iCloud / sync: Not stated.
  - Other: custom colors (v1.37.0), drag-and-drop reordering (v1.39.0), country holiday suggestions (v1.42.0), "Review past events by week, month, or year" (description), custom notifications.
- **Ads:** "Contains: Advertising" shown; "Remove Ads = $2.99" listed. Version history v1.22 (2021-09-10) notes "we have added ads into the app".
- **Privacy label (Apple's wording):** Data Used to Track You: Usage Data | Data Linked to You: Contact Info, User Content, Identifiers, Usage Data | Data Not Linked to You: Location, Identifiers, Usage Data, Diagnostics
- **Best for:** Anyone searching literally for a "day counter" with two modes and sober, streak and birthday use cases in one list.
- **Limits the listing itself states:** The privacy label includes tracking and linked data. Many separate paid unlocks (widget, notes, dark mode, unlimited counters, ads).
- **Checked 2026-10-20.** Fetched: https://apps.apple.com/us/app/id1499976509 and the lookup for 1499976509 (US).

### Countdown & Count Up Timer

- **Exact App Store name:** Countdown & Count Up Timer
- **Developer (seller):** Yoji Shimobayashi
- **URL / ID:** https://apps.apple.com/us/app/id919998681 / 919998681
- **Price to download:** Free
- **In-app purchases as listed:** None listed on the page ("In-App Purchases" row absent; not found on page).
- **Free tier limits (verbatim):** "Create as many events as you like and choose how you want to see the time: years, months, weeks, days or hours." and "Unlimited events - Create as many countdowns and count-ups as you need." No paid feature stated.
- **Platforms from the Compatibility section (verbatim):** iPhone Requires iOS 18.0 or later.; iPad Requires iPadOS 18.0 or later.. Minimum iOS: 18.0.
- **Rating (US):** 4.7 from 2,317 ratings
- **Current version:** 3.1.6, released 2026-10-01. **First release:** 2014-10-24 (year 2014).
- **Key features and where each was found:**
  - Counting directions: both. "Count down to something you're looking forward to, or see how much time has passed since a meaningful day." (description).
  - Units: "years, months, weeks, days or hours"; "Exact date and time" (description).
  - Widgets: "Home Screen and Lock Screen widgets" (description). Lock Screen widget event choice in-app and a 6-event cap on the Home Screen widget (v3.0.3, 2025-08-18); deprecated widgets discontinued (v2.9.20). StandBy: Not stated.
  - Live Activities: Not stated. Apple Watch: Not listed in Compatibility.
  - iCloud: "iCloud backup and restore" (description); iCloud sync: Not stated.
  - Other: recurring events, tags and date sorting, custom photo backgrounds, daily notification at a chosen time, grid view on Home (v3.1.0).
- **Ads:** "Contains: Advertising" shown. No remove-ads IAP listed.
- **Privacy label (Apple's wording):** Data Used to Track You: Location, Identifiers, Usage Data | Data Not Linked to You: Location, Identifiers, Usage Data, Diagnostics
- **Best for:** A free, no-paywall-listed day counter that does both directions and Lock Screen widgets.
- **Limits the listing itself states:** Home Screen widget shows at most 6 events (version history). Needs iOS 18. Ad-supported and the label shows tracking.
- **Checked 2026-10-20.** Fetched: https://apps.apple.com/us/app/id919998681 and the lookup for 919998681 (US).

### Count Time Until & Days Since

- **Exact App Store name:** Count Time Until & Days Since
- **Developer (seller):** Javier Gallo Roca
- **URL / ID:** https://apps.apple.com/us/app/id1532688451 / 1532688451
- **Price to download:** Free
- **In-app purchases as listed:** Annual = $19.99; Annual Plan = $9.99; Lifetime = $19.99; Weekly Plan = $2.99; Welcome Annual Plan = $9.99; Monthly Plan = $1.99. "Lifetime" carries lifetime in the name; other rows carry their period in the name.
- **Free tier limits (verbatim):** Not stated. The description lists features with no free or paid marking.
- **Platforms from the Compatibility section (verbatim):** iPhone Requires iOS 18.0 or later.; iPad Requires iPadOS 18.0 or later.; Mac Requires macOS 15.0 or later and a Mac with Apple M1 chip or later.; Apple Vision Requires visionOS 2.0 or later.. Minimum iOS: 18.0. Apple Watch not listed.
- **Rating (US):** 4.6 from 168 ratings
- **Current version:** 1.12.0, released 2026-04-08. **First release:** 2021-04-03 (year 2021).
- **Key features and where each was found:**
  - Counting directions: both. "Count Up or Down: Track events before or after they happen" (description).
  - Units: "Time unit selection" (v1.3.x, 2024); "Round-up option" (v1.10.0).
  - Widgets: "Widgets for Home & Lock Screen" (description). Lock Screen widgets v1.2.0 (2022-09-08), new Lock Screen design v1.8.x, tinted Home Screen widgets (v1.4.0), Counter List widget (v1.10.0). StandBy: Not stated.
  - Quick access: "Quickly access Count Time from the Control Center, Lock Screen, or Action button" (v1.4.0).
  - Live Activities: Not stated. Apple Watch: Not stated.
  - Sync: "iCloud Sync: Keep all your time counters and categories synced across your devices seamlessly." (description).
  - Other: recurring daily, weekly, monthly or yearly (biweekly added v1.3.x), up to two notifications per event, calendar import (v1.8.x), sharing images.
- **Ads:** age-rating block shows no "Contains: Advertising" line. A quoted review in the description says "no ads"; treat as developer-selected.
- **Privacy label (Apple's wording):** Data Not Linked to You: Purchases, Location, Identifiers, Usage Data, Diagnostics
- **Best for:** iCloud-synced, ad-free-looking counter with Lock Screen and Control Center access.
- **Limits the listing itself states:** Two notifications per event. Weekly, monthly, annual and lifetime paid tiers; free-tier limits not stated. 168 ratings only.
- **Checked 2026-10-20.** Fetched: https://apps.apple.com/us/app/id1532688451 and the lookup for 1532688451 (US).

### Big Days - Event Countdown

- **Exact App Store name:** Big Days - Event Countdown
- **Developer (seller):** Vittorio Sorbera (page copyright: AstrovicApps)
- **URL / ID:** https://apps.apple.com/us/app/id940109775 / 940109775
- **Price to download:** Free
- **In-app purchases as listed:** Big Days Pro = $3.99; Widget Pack = $2.99. Periods not stated in the names.
- **Free tier limits (verbatim):** Not stated. Widgets are described as "Widgets are finally here!" (v10.0.0) with a "Widget Pack" IAP; what is free is not stated.
- **Platforms from the Compatibility section (verbatim):** iPhone Requires iOS 15.0 or later.; iPad Requires iPadOS 15.0 or later.; iPod touch Requires iOS 15.0 or later.; Mac Requires macOS 12.0 or later and a Mac with Apple M1 chip or later.; Apple Vision Requires visionOS 1.0 or later.. Minimum iOS: 15.0. Apple Watch not listed.
- **Rating (US):** 4.6 from 592 ratings
- **Current version:** 10.0.0, released 2026-08-07. **First release:** 2014-11-20 (year 2014).
- **Key features and where each was found:**
  - Counting directions: both. "Days remaining & days since: track both upcoming events and how much time has passed." (description).
  - Units: Not stated beyond "days".
  - Widgets: "brand-new Home Screen and StandBy widgets" (description); "Full support for iOS StandBy mode" (v10.0.0 notes). Lock Screen widgets: Not stated.
  - Live Activities: Not stated. Apple Watch: Not listed. iCloud / sync: Not stated.
  - Other: Pixabay background search, custom fonts and colors, share or save as wallpaper, reminders, favorite event on startup, upcoming/past sections (v9.8.0).
- **Ads:** "Contains: Advertising" shown.
- **Privacy label (Apple's wording):** Data Used to Track You: Identifiers, Usage Data, Diagnostics | Data Not Linked to You: Identifiers, Usage Data, Diagnostics
- **Best for:** Long-running (since 2014) countdown with photo backgrounds and, newly, StandBy widgets.
- **Limits the listing itself states:** Widgets are new in v10.0.0 (2026-08-07). Nothing between 2025-11-23 and 2026-08-07 in the version history. Ads and tracking in the label.
- **Checked 2026-10-20.** Fetched: https://apps.apple.com/us/app/id940109775 and the lookup for 940109775 (US).

### Day Counter .

- **Exact App Store name:** Day Counter .
- **Developer (seller):** Inner Grow Limited (page copyright line: Lightbyte)
- **URL / ID:** https://apps.apple.com/us/app/id1597681894 / 1597681894
- **Price to download:** Free
- **In-app purchases as listed:** Cute Countdown Meow = $4.99; Lifetime Premium = $6.99; Lifetime Sale = $3.99. "Lifetime Premium" and "Lifetime Sale" carry lifetime in the name; "Cute Countdown Meow" carries no period.
- **Free tier limits (verbatim):** Not stated. Description in full: "A cute day counter and reminder app. - Countdown to events and dates - Count up days since - Upcoming holidays - Birthday countdown and reminders - Track food & item expiration dates".
- **Platforms from the Compatibility section (verbatim):** iPhone Requires iOS 15.0 or later.; iPod touch Requires iOS 15.0 or later.; Mac Requires macOS 12.0 or later and a Mac with Apple M1 chip or later.; Apple Vision Requires visionOS 1.0 or later.. Minimum iOS: 15.0. iPad and Apple Watch not listed.
- **Rating (US):** 4.8 from 1,606 ratings
- **Current version:** 1.8.2, released 2026-10-15 ("add support for iOS 27"). **First release:** 2022-01-23 (year 2022).
- **Key features and where each was found:**
  - Counting directions: both. "Countdown to events and dates" / "Count up days since" (description).
  - Units: Not stated.
  - Widgets: not in the description; only "fix widget bugs" (v1.6.11, 2025-12-29). Home, Lock Screen and StandBy: Not stated.
  - Live Activities: Not stated. Apple Watch: Not listed. iCloud / sync: Not stated.
  - Other: holidays, birthdays, expiry dates, notes with images (v1.7.4 / v1.7.5, 2026-03).
- **Ads:** no "Contains: Advertising" line; age-rating block shows "Contains: Messaging and Chat".
- **Privacy label (Apple's wording):** Data Not Collected
- **Best for:** A cute, low-cost day counter with lifetime unlock and no data collection.
- **Limits the listing itself states:** Widgets not described in the listing. Release notes are almost all "fix bugs" (most of the last 25 entries).
- **Checked 2026-10-20.** Fetched: https://apps.apple.com/us/app/id1597681894 and the lookup for 1597681894 (US).

### Dropped apps (key facts only)

- **TimeCount - Countdown & Widget** (1497946231), App Forgeron LLC. Free. 4.6 from 24,583, v2.0.1 2026-10-14, first 2020-03-21, iOS 16.0+, iPhone, Mac, Vision (no Watch listed). IAP: Premium Yearly Subscription = $19.99; Premium Monthly Subscription = $3.99; Yearly Premium = $13.99; Premium Yearly Subscription = $19.99; Premium Forever = $44.99; Premium Yearly Subscription = $19.99; Premium Forever = $34.99; Premium Yearly Subscription = $19.99. Description: "Home Screen Countdown Widgets", "Unlimited Free Mode", repeats yearly, monthly, weekly or daily. Count up: Not stated. No "Contains: Advertising". Privacy: Data Used to Track You: User Content | Data Not Linked to You: User Content, Identifiers, Usage Data. Release notes identical for 25 versions.
- **Countdown Widget & Counter** (1533996161), Sovereign Apps LLC (product "Widget Studio"). Free. 4.6 from 2,435, v3.2.1 2026-10-05, first 2020-10-10, iOS 17.6+, iPhone, iPad, Mac, Vision, Apple Watch (watchOS 10.0). IAP: Widget Studio PRO = $7.99 / $4.99 / $1.99 / $8.99 / $5.99 / $12.99; Widget Studio Pro Lifetime = $9.99 / $14.99; Monthly Subscription = $3.99; Annual Subscription = $12.99. "Most of the app's content is free. Some selected features require the purchase of a full version in the app (recurring annual subscription)." "Live countdown widgets"; photo widget backgrounds (v3.0.6); Control Center widget (v2.4.0); "Exclude Custom Days" (v3.0.7). No "Contains: Advertising". Privacy: Data Not Linked to You: Purchases, Diagnostics. Count up: Not stated.
- **TheDayBefore (days countdown)** (991283955), TheDayBefore, Inc. Free. 4.8 from 1,079, v5.2.2 2026-10-17, first 2015-05-13, iOS 17.0+, iPhone, Mac, Apple Watch (watchOS 10.0). IAP: Remove Ads = $9.99; Basic (1-Month Plan) = $1.49. "home screen and lock screen widgets"; "Get custom notifications on the day, D-7, D-3, or D-1"; "Anniversary notifications like 100 days and 1-year milestones are set automatically." Age rating 9+, "Contains: Advertising" and "Health or Wellness Topics". Privacy: Data Used to Track You: Identifiers, Usage Data | Data Not Linked to You: User Content, Identifiers, Usage Data, Diagnostics.
- **Countdown Timer: Day Counter** (1118406319), Gregory Strigunov. Free, 4.8 from 1,236, v1.2.1 2021-12-28, first 2016-06-01, iOS 11.0+, iPhone, iPad, iPod touch, Mac. No IAP listed. "Without advertising." Privacy: Data Not Collected. Stale (4 years 10 months).
- **Days Matter (倒数日)** (406170251), iDaily Corp. Free, 4.8 from 8,238, v5.3.1 2026-09-17, first 2010-12-14, iOS 13.0+, iPhone, iPad, Mac, Vision, Apple Watch. Listing text in Chinese. Privacy: Data Not Linked to You: Contact Info, Usage Data, Diagnostics.

## Competitive angle for Left

Every app here answers "how many days until or since this date". The listings sell counters, photo backgrounds and reminders; only Big Days mentions StandBy, and none mentions Live Activities. Most are free with ads or a paywall for the widget (BITSENS "Widget = $5.99", Countdown Days Since & Until "ad-free with in-app purchase", Big Days "Widget Pack = $2.99"), so a no-ads, widgets-first angle is checkable on the page. Several privacy labels include tracking (BITSENS, Yoji, Big Days, TheDayBefore), while Inner Grow's Day Counter . shows "Data Not Collected".
