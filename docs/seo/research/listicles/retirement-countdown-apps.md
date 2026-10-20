# Research: retirement countdown apps (targets "retirement countdown app" / "retirement countdown app for iPhone" / "retirement countdown widget" / "work days until retirement")

Checked 2026-10-20. Every fact below comes from the US App Store page and the iTunes lookup data (via appfacts.py, which falls back to the page JSON when the lookup API returns 403), fetched today. "Not stated" means the listing (description, release notes, version history, compatibility, privacy label) does not say. It does not mean the app lacks the feature. Developer websites were not used.

Notes:
- The App Store page shows at most 10 in-app purchase rows; repeated names are different price points. Periods are only known when the product name says so.
- Ratings are the US figures the App Store page displays (one decimal) with the count.
- The page's version history is truncated: it holds at most 25 entries for most apps here (only 8 for WorkEnd), so older release notes are not visible. "Not stated" for widgets, Watch, StandBy and Live Activities was checked against the description plus every entry that the page holds. Where the history is cut off, the oldest visible entry is named.
- No listing in this set mentions Live Activities. Only Zaffles Retirement Countdown and Find Appiness Countdown mention StandBy.
- Age-rating "Contains: Advertising" is reported per app. A missing line means the page does not show it (not found on page).
- Search sweep: the App Store search for "retirement countdown", "retire countdown", "work days left", "days until retirement", "pension countdown" and "retirement days remaining widget" returned many retirement and workday apps. "FIRE retirement calculator" was folded into "pension countdown" results; only planners that advertise a countdown are included (WorkEnd, Retirement Countdown - Days). Employer 401(k) apps (John Hancock, Nationwide, Principal, etc.) have no countdown in their listing titles and were not fetched.

## Recommendation

Strongest 7 to feature (current, relevant, rated). Only the first 2 and the general ones have real rating volume; the workday-specific newcomers have almost no ratings.
1. **Retirement Countdown ·, Zaffles LLC** (1645215938) - 4.8 from 12,686, updated 2026-10-16. Biggest retirement-only app. Home Screen, Lock Screen and StandBy widgets, Big Countdown full-screen view (days, weeks, months, seconds or any mix), daily notifications, Story Cards. "you can now remove vacation days from your countdown" (v2.15-2.19). Working-days counting not stated. Contains Advertising; privacy label includes tracking.
2. **Retirement Countdown App, Green Gecko LLC** (1217657327) - 4.8 from 6,301, updated 2026-05-03. Months, days, hours, minutes, seconds countdown, themes, bucket list, retirement calculators, quote of the day. No widgets, workdays or holidays stated. Premium subscriptions $4.99 per month / $17.99 per year; "Lifetime subscription ... $59.99". Contains Advertising.
3. **Countdown, Find Appiness LLC** (1403367428) - 4.8 from 189,110, updated 2026-10-19. General countdown that lists "Retirement" and "Count only working days"; Lock Screen, Home Screen and StandBy widgets (Premium), Apple Watch, iCloud, yearly/monthly repeat. The only high-volume app that says "Count only working days". Holiday exclusion not stated.
4. **Working Days Counter & Widget, Shayes Apps LLC** (6468970880) - 4.7 from 205, updated 2026-10-15. Custom work schedule, "Exclusion Lists: Filtering out off days and holidays" and calendar import for holidays (premium, $1.99), Home and Lock Screen widgets, Watch app, iCloud. Best match for "work days until retirement" among apps with a real rating count. Does not name retirement in the description (the search tool showed a "Retirement" category label, which is not on the fetched page).
5. **Countdown - Pretty Progress, keinois OU** (1597616326) - 4.7 from 3,109, updated 2026-10-18. Description lists "Days until retirement" and "Days until your financial independence". Home Screen, Lock Screen, StandBy and Watch complications, Dynamic Island support, iCloud. Pro tiers priced up to $59.99 lifetime. Calendar-day only (no workdays stated).
6. **Retirement Countdown: WorkEnd, Tobias Feldmann** (6743494737) - 4.8 from 166, updated 2026-04-16. Retirement countdown plus financial shortfall analysis and "retire earlier" calculator (Premium). No widgets or workdays stated. Privacy: "Data Not Linked to You". Contains Advertising.
7. **RetirementTracker: Countdown, Vincent Waelken** (6759114478) - rated 3.0 from 1 (very new, first release 2026-03-11), updated 2026-10-10. The most complete workdays spec on the store: weekends, public holidays for 13 countries (every US state), vacation, part-time and work phases deducted; widgets are a $1.99 one-time Premium row ("Premium-Widgets = $1.99"); "Data Not Collected". Use as the "workdays done properly" mention, with the one-rating caveat. Close alternative: **Retirement Countdown+ Tracker, Wayne Nixon** (6802019447, 4.0 from 1, updated 2026-10-03): workdays, federal holidays, PTO, shift patterns, Home and Lock Screen widgets, $6.99 single unlock, no ads claimed. Same one-rating caveat.

Documented but dropped:
- **Horizon Retirement Countdown, Digitech Applications Limited** (6745153644): 5.0 from 4 ratings, last update 2025-05-25 (about 17 months, stale). Countdown free "no ads", savings calculator, time capsule; premium subscriptions. Dropped for age and rating count.
- **Retirement Countdown & Timer, Halil Can Ugur** (6744179127): 4.6 from 26, v1.0 only, 2025-04-14 (stale, one release). Home Screen widget, circular tracker, bucket list; "Data Not Collected".
- **Retirement Countdown - Days, Li (6754011756)**: 4.4 from 21, updated 2026-08-18. Current, but 21 ratings; subscriptions to unlock widgets, themes and report export ("Unlimited access = $24.99 ; $4.99"). Small Home Screen and Medium widgets (Premium). Could be a mention if the list needs more rows.
- **Retiro - Retirement Countdown, Timo Strehling** (6775589890): no ratings (0), public holidays only for German states, Contains Advertising, "Data Used to Track You".
- **RetirementCountdown, Mark Mroz** (6775023393): $0.99, no ratings, first release 2026-06-22; counts "days, work days, weeks, months, or years", Home Screen widget; no holiday exclusion stated.
- **Countdown to My Retirement, Andrew Gostanian** (1324292964): $1.99, 1.0 from 1 rating, no widget stated. Updated 2026-01-31.
- **Countdown Star, Joseph Merrill** (576177593): 4.8 from 216,279, updated 2026-09-21. General event countdown (Small/Medium/Large Home Screen widgets, Watch, iCloud) but does not mention retirement or workdays and has ads (Remove Ads $1.99). Use as a generic mention only.
- **TimeCount, App Forgeron** (1497946231): 4.6 from 24,583, updated 2026-10-14. "Retirement" is one example in a list; Home Screen widgets; subscriptions up to Premium Forever $44.99. Generic only.
- **Workday Countdown, Yuichiro Toh** (327525084): 2.1 from 8, last updated 2021-07-18, holiday data only to 2025. Stale.
- Not found in the US store by ID/search: "Workday Retirement Countdown" (Michael Melito) and 6458539173 ("Retirement Countdown Timer App"); the page returned no usable data, so not documented.
- Employer and plan-provider apps (John Hancock Retirement, Nationwide My Retirement, Principal, Transamerica, JPM Retirement Link): not countdown apps from their listings, not fetched.

Stale but popular: none among retirement-specific apps. The old Green Gecko app is still popular (6,301 ratings) but is active (updated 2026-05-03; version history shows only "Content update" releases in 2026, then a 2024 and 2023 gap).

## Competition

What ranked for "retirement countdown app iPhone" in a WebSearch today (titles and domains only):
- Retirement Countdown · (apps.apple.com)
- Retirement Countdown & Timer (apps.apple.com)
- Retirement Countdown App (apps.apple.com)
- Retirement Countdown Timer App (apps.apple.com)
- RetirementCountdown (mwm.ai)
- Countdown to My Retirement (apps.apple.com)
- My Retirement Countdown App (apps.apple.com)
- Second search "Workday Retirement Countdown app store ...": Retirement Countdown Timer App, Working Days Counter & Widget, Workday Countdown (apps.apple.com), retirement countdown (miniwebtool.com)

The results are App Store listings and aggregator pages. No editorial listicle ranked in the top results.

## App blocks

### Retirement Countdown ·

- **Exact App Store name:** Retirement Countdown ·
- **Developer (seller):** Zaffles LLC
- **URL / ID:** https://apps.apple.com/us/app/id1645215938 / 1645215938
- **Price to download:** Free
- **In-app purchases as listed:**
  - Retirement Supporter/Monthly = $0.49
  - Retirement Lifetime Supporter = $6.99
  - Retirement Supporter/Annual = $4.99
  - Retirement Lifetime Supporter = $3.99
  - Labelling: "Monthly", "Annual" and "Lifetime" appear in the names. What "Supporter" unlocks is not stated.
- **Free tier limits (verbatim):** Not stated. Description: "There is also a widget to track your countdown on your home screen." No paid-feature split described.
- **Platforms from the Compatibility section (verbatim):** iPhone Requires iOS 17.6 or later.; Mac Requires macOS 14.6 or later and a Mac with Apple M1 chip or later.; Apple Vision Requires visionOS 1.3 or later. Minimum iOS: 17.6. iPad and Watch not listed.
- **Rating (US):** 4.8 from 12,686 ratings
- **Current version:** 2.38.0, released 2026-10-16. **First release:** 2022-09-17 (year 2022).
- **Key features and where each was found:**
  - Working days vs calendar days: working-days counting not stated. Counts down in "days, weeks, months, seconds, or any combination" (version history v2.36.0).
  - Vacation exclusion: "you can now remove vacation days from your countdown!" (version history v2.15.0 to v2.19.0). Holiday exclusion: not stated.
  - Widgets: Home Screen widget (description); "Redesigned widgets with a big day count over your own photo", "Lock Screen widgets now fit: '400 days to retirement'", "StandBy support: a large, easy-to-read count while your phone charges" (v2.37.0); "Fix for widgets in tinted Home Screens" (v2.14.x). Extra-large widget on iPad mentioned in v2.37.0 although iPad is not in Compatibility.
  - Live Activities: Not stated. Apple Watch: Not stated (not in Compatibility).
  - Notifications: "Daily notifications remind you how long until your big retirement day" (description).
  - Sharing: "Easily share your retirement countdown with friends and family", "Post your retirement countdown to Facebook with one click" (description); Story Cards for Instagram Stories (v2.20.0 to v2.26.0).
  - Other: works offline; Big Countdown full-screen view (v2.36.0); own photo and "Remove My Photo" (v2.38.0); wallpaper use ("Great to use as retirement countdown wallpaper").
  - iCloud sync: Not stated.
- **Ads:** Age rating block: "Contains: Advertising".
- **Privacy label (Apple's wording):** Data Used to Track You: Location, Identifiers, Usage Data, Diagnostics | Data Linked to You: Location, Identifiers, Usage Data, Diagnostics
- **Best for:** The most-rated retirement-only app, now with Lock Screen and StandBy widgets and a photo-led design.
- **Limits the listing itself states:** None stated beyond requiring iOS 17.6; the tracking label and advertising flag are the notable downsides.
- **Checked 2026-10-20.** Fetched: https://apps.apple.com/us/app/id1645215938 and the lookup data via appfacts.py. Version history holds 25 entries (oldest visible 2.12.2, 2025-09-25), so older notes are not visible.

### Retirement Countdown App

- **Exact App Store name:** Retirement Countdown App
- **Developer (seller):** Green Gecko LLC
- **URL / ID:** https://apps.apple.com/us/app/retirement-countdown-app/id1217657327 / 1217657327
- **Price to download:** Free
- **In-app purchases as listed (names and prices copied exactly):** Remove ads = $3.99; Premium Version = $4.99; function to add own picture = $1.99; Premium Version = $17.99; Remove Ads = $2.99; Theme Mountain Lake = $0.99; Remove Ads = $8.99; Theme Forest = $0.99; Theme Mountain Lake 2 = $0.99; Theme Beach Hammock = $0.99. Description states: "two auto-renewing subscriptions: $4.99 per month, $17.99 per year" and "a Lifetime subscription which is paid for by a one-off upfront payment of $59.99".
- **Free tier limits (verbatim):** "You can use most of this app totally free of charge. To use the premium version of this app that includes all themes, the feature to use your own picture, the quote of the day and no advertisement, we offer two auto-renewing subscriptions".
- **Platforms from the Compatibility section (verbatim):** iPhone Requires iOS 12.0 or later.; iPad Requires iPadOS 12.0 or later.; iPod touch Requires iOS 12.0 or later.; Mac Requires macOS 11.0 or later and a Mac with Apple M1 chip or later.; Apple Vision Requires visionOS 1.0 or later. Minimum iOS: 12.0. Watch not listed.
- **Rating (US):** 4.8 from 6,301 ratings
- **Current version:** 2.34, released 2026-05-03. **First release:** 2017-03-24 (year 2017).
- **Key features and where each was found:**
  - Counting: "count down the months, days, hour, minutes and seconds" (description). Working-days and holiday exclusion: Not stated.
  - Exact time of retirement: "You can now also set the exact time when your retirement starts." (v2.25-2.27, 2022).
  - Widgets, StandBy, Live Activities, Apple Watch: Not stated (description and the 25 history entries the page holds; oldest visible 2.10, 2019-01-05).
  - Extras: retirement calculators, quote of the day, bucket list, ideas, picks of the week, book recommendations, games, offers and deals, travel news (description "FEATURES").
  - Sharing: "share your countdown via email or social media" (description).
- **Ads:** Age rating block: "Contains: Advertising".
- **Privacy label (Apple's wording):** Data Used to Track You: Location, Identifiers, Usage Data, Diagnostics | Data Linked to You: Location, Identifiers, Usage Data, Diagnostics | Data Not Linked to You: Diagnostics
- **Best for:** Someone who wants a retirement "lifestyle" app (bucket list, quotes, calculators) rather than a clean widget.
- **Limits the listing itself states:** Premium needed for all themes, own picture, quote of the day and no ads; price points up to $59.99.
- **Checked 2026-10-20.** Fetched: https://apps.apple.com/us/app/id1217657327 and lookup data via appfacts.py. Release notes mostly read "Content update".

### Countdown

- **Exact App Store name:** Countdown
- **Developer (seller):** Find Appiness LLC
- **URL / ID:** https://apps.apple.com/us/app/id1403367428 / 1403367428
- **Price to download:** Free
- **In-app purchases as listed:** Countdown Widget = $6.99; Countdown Widget Offer = $3.99. (Names carry no period; whether one-time or recurring is not stated on the page. The description labels Premium features.)
- **Free tier limits (verbatim):** "Countdown is a free, super easy to use countdown timer and reminder for the important events & dates in your life." and "Create as many events as you'd like". Premium-labelled: Lock Screen widget, StandBy widget, Home Screen widget, "Auto Import (Premium)", "Choose the format in which you want to see your countdown (Premium feature)".
- **Platforms from the Compatibility section (verbatim):** iPhone Requires iOS 17.0 or later.; iPad Requires iPadOS 17.0 or later.; Mac Requires macOS 14.0 or later and a Mac with Apple M1 chip or later.; Apple Vision Requires visionOS 1.0 or later.; Apple Watch Requires watchOS 10.0 or later. Minimum iOS: 17.0.
- **Rating (US):** 4.8 from 189,110 ratings
- **Current version:** 7.5.4, released 2026-10-19. **First release:** 2018-09-11 (year 2018).
- **Key features and where each was found:**
  - Working days: "Count only working days" (description). Holidays/vacation exclusion: Not stated.
  - Retirement: named as an example event ("... New Home, Retirement, Game, Goals ..." description).
  - Widgets: "Check your events on the Lock Screen with our widget (Premium feature)", StandBy widget (Premium), Home Screen widget (Premium) (description); Extra Large Widget (iOS 27, Premium) (v7.4.x).
  - Live Activities: Not stated. Apple Watch: "Glance at your events on your Apple Watch" (description).
  - iCloud: "Sync your events across your devices with iCloud" (description).
  - Other: repeats yearly, monthly, weekly or daily; tags; count up from past events; alarms (Premium, v7.5.x); Siri and Shortcuts (v7.3.x).
- **Ads:** Age rating block: "Contains: Advertising".
- **Privacy label (Apple's wording):** Data Used to Track You: Identifiers | Data Not Linked to You: Location, Identifiers, Usage Data, Diagnostics
- **Best for:** Anyone who wants a polished, widely used general countdown with a working-days switch.
- **Limits the listing itself states:** Widgets (Lock Screen, StandBy, Home Screen) are Premium.
- **Checked 2026-10-20.** Fetched: https://apps.apple.com/us/app/id1403367428 and lookup data via appfacts.py. History holds 25 entries (oldest visible 6.7.1, 2026-07-24).

### Working Days Counter & Widget

- **Exact App Store name:** Working Days Counter & Widget
- **Developer (seller):** Shayes Apps LLC
- **URL / ID:** https://apps.apple.com/us/app/id6468970880 / 6468970880
- **Price to download:** Free
- **In-app purchases as listed:** Premium = $1.99 (no period stated in the name).
- **Free tier limits (verbatim):** "Exclusion Lists: Filtering out off days and holidays for a precise countdown (requires premium)" and "Calendar Import: Import holidays from your existing calendars (requires premium)".
- **Platforms from the Compatibility section (verbatim):** iPhone Requires iOS 17.0 or later.; iPad Requires iPadOS 17.0 or later.; Mac Requires macOS 14.0 or later.; Apple Vision Requires visionOS 1.0 or later.; Apple Watch Requires watchOS 10.0 or later. Minimum iOS: 17.0.
- **Rating (US):** 4.7 from 205 ratings
- **Current version:** 4.1.0, released 2026-10-15. **First release:** 2023-11-08 (year 2023).
- **Key features and where each was found:**
  - Working days and holidays: "Work Schedules: Customize to your workday schedule"; exclusion lists for off days and holidays; calendar import for holidays; "Ability to set default exclusion lists" (v4.0.0); exclusions repeat every year (v1.4.0).
  - Retirement: not named in the description.
  - Widgets: "Home & Lock Screen Widgets" (description); Lock Screen widgets (v1.1.0); small widgets (v4.0.0). StandBy and Live Activities: Not stated.
  - Apple Watch: "Apple Watch App & Complications" (description). iCloud: "iCloud Sync" (description). Sharing: "Share your countdowns with colleagues or on social media" (description).
- **Ads:** Age rating block not showing "Contains: Advertising" (not found on page). The privacy section on the page contains a "Third-Party Advertising" purpose heading; the label wording says "Data Not Linked to You: Usage Data".
- **Privacy label (Apple's wording):** Data Not Linked to You: Usage Data
- **Best for:** A direct "work days left" counter with holiday exclusions, widgets and Watch for a low price.
- **Limits the listing itself states:** Exclusions and calendar import require Premium.
- **Checked 2026-10-20.** Fetched: https://apps.apple.com/us/app/id6468970880 and lookup data via appfacts.py. History holds 25 entries back to 1.0.0 (2023-11-08), so it is complete.

### Countdown - Pretty Progress

- **Exact App Store name:** Countdown - Pretty Progress
- **Developer (seller):** keinois OU
- **URL / ID:** https://apps.apple.com/us/app/id1597616326 / 1597616326
- **Price to download:** Free
- **In-app purchases as listed (10 row limit):** Pretty Progress PRO (Weekly) = $4.99; Pretty Progress Pro (Annual) = $14.99; Pretty Progress PRO (Lifetime) = $49.99; Pretty Progress PRO (Monthly) = $4.99; Pretty Progress Pro (Annual) = $24.99; Pretty Progress PRO (Lifetime) = $59.99; Pretty Progress PRO (Weekly) = $4.99; Unlimited access = $5.99; Pretty Progress Pro (Annual) = $... (cut off at the row limit). "Family sharing enabled for the PRO purchase" (description).
- **Free tier limits (verbatim):** Not stated.
- **Platforms from the Compatibility section (verbatim):** iPhone Requires iOS 18.0 or later.; iPad Requires iPadOS 18.0 or later.; Mac Requires macOS 15.0 or later and a Mac with Apple M1 chip or later.; Apple Watch Requires watchOS 11.0 or later. Minimum iOS: 18.0.
- **Rating (US):** 4.7 from 3,109 ratings
- **Current version:** 2.2.2, released 2026-10-18. **First release:** 2021-12-07 (year 2021).
- **Key features and where each was found:**
  - Retirement: "Days until retirement", "Days until your financial independence" (description, "WHAT CAN YOU TRACK?"). Working days and holidays: Not stated.
  - Widgets: "6 different templates ... Home Screen, Lock Screen, Stand By (iOS 17), and Watch complications" (description); "Home Screen widgets: small, medium, and large".
  - Live Activities: Not stated; "Support for Dynamic Island and Alarms" (v2.2.0).
  - Apple Watch: complications for Watch faces (description). iCloud: yes (description). Calendar and Reminders import (description). Percentage of completion, count up and down.
- **Ads:** Age rating "Contains: Advertising" not found on page.
- **Privacy label (Apple's wording):** Data Not Linked to You: Purchases, Usage Data, Diagnostics, Other Data
- **Best for:** Designer-style widgets across Home, Lock, StandBy and Watch, with retirement as one use case.
- **Limits the listing itself states:** PRO purchase tiers (weekly, monthly, annual, lifetime) are listed; free limits not stated.
- **Checked 2026-10-20.** Fetched: https://apps.apple.com/us/app/id1597616326 and lookup data via appfacts.py. History holds 25 entries (oldest visible 2.0.5, 2025-10-27).

### Retirement Countdown: WorkEnd

- **Exact App Store name:** Retirement Countdown: WorkEnd
- **Developer (seller):** Tobias Feldmann
- **URL / ID:** https://apps.apple.com/us/app/id6743494737 / 6743494737
- **Price to download:** Free
- **In-app purchases as listed:** Premium (Lifetime offer) = $14.99; WorkEnd Premium (Monthly) = $2.99; WorkEnd Premium (Solidarity) = $6.99; WorkEnd Premium (Yearly) = $17.90; WorkEnd Premium (Lifetime) = $29.99.
- **Free tier limits (verbatim):** "The retirement countdown shows you exactly how close you are to your goal and helps you stay on track." Premium features: Retirement Shortfall Analysis, Flexible Retirement, Assets & Risk Assessment. "WorkEnd Premium can be activated via a monthly or yearly subscription or a one-time purchase for lifetime use."
- **Platforms from the Compatibility section (verbatim):** iPhone Requires iOS 15.6 or later.; iPod touch Requires iOS 15.6 or later.; Mac Requires macOS 12.5 or later and a Mac with Apple M1 chip or later.; Apple Vision Requires visionOS 1.0 or later. Minimum iOS: 15.6.
- **Rating (US):** 4.8 from 166 ratings
- **Current version:** 1.12, released 2026-04-16. **First release:** 2025-04-22 (year 2025).
- **Key features and where each was found:** financial readiness calculation, early-retirement check, assets tracking (description). Widgets, workdays, holidays, Watch, StandBy, Live Activities: Not stated (history holds 8 entries, all "Bug Fixes & Optimizations").
- **Ads:** Age rating block: "Contains: Advertising".
- **Privacy label (Apple's wording):** Data Not Linked to You: Financial Info, Usage Data, Diagnostics
- **Best for:** People who want the countdown plus a retirement-readiness check.
- **Limits the listing itself states:** Shortfall analysis, flexible retirement and asset risk assessment are Premium.
- **Checked 2026-10-20.** Fetched: https://apps.apple.com/us/app/id6743494737 and lookup data via appfacts.py.

### RetirementTracker: Countdown

- **Exact App Store name:** RetirementTracker: Countdown
- **Developer (seller):** Vincent Waelken
- **URL / ID:** https://apps.apple.com/us/app/id6759114478 / 6759114478
- **Price to download:** Free
- **In-app purchases as listed:** Premium-Widgets = $1.99. Description: "Premium is a one-time purchase - no subscription"; "One-time purchase: no ads, no subscription".
- **Free tier limits (verbatim):** "WIDGETS WITH PREMIUM: With RetirementTracker Premium, your countdown lives on your home screen: Workdays, calendar days, progress and motivation widgets; Each in light and dark; With your own photo". Countdown, workday count, vacation calendar and milestones are presented without a Premium label.
- **Platforms from the Compatibility section (verbatim):** iPhone Requires iOS 15.1 or later.; iPad Requires iPadOS 15.1 or later.; iPod touch Requires iOS 15.1 or later.; Mac Requires macOS 12.0 or later and a Mac with Apple M1 chip or later.; Apple Vision Requires visionOS 1.0 or later. Minimum iOS: 15.1.
- **Rating (US):** 3.0 from 1 rating (page); app first released 2026-03-11, so effectively unrated.
- **Current version:** 1.0.6, released 2026-10-10. **First release:** 2026-03-11 (year 2026).
- **Key features and where each was found:**
  - Working days: "Your actual workdays until retirement - after weekends, public holidays and vacation"; weekdays, part-time or custom workdays; "Work phases"; "What-if plans" (description).
  - Holidays and vacation: "Public holidays for 13 countries, including every US state, the UK nations, all German states and Swiss cantons, Austria, France, Italy, Spain, Ireland and the Nordic countries"; own holidays; vacation days per year and days left this year; "find time off" long weekends (description).
  - Calendar days and "live down to the second" (description). Milestones (1,000, 500, 100 days) with reminders 8:00 AM (description). Share as an image (description).
  - Widgets: Home Screen widgets with Premium; Lock Screen, StandBy, Live Activities, Watch: Not stated. iCloud: Not stated ("stored locally on your device. No account, no sign-up").
- **Ads:** Age rating "Contains: Advertising" not found on page. Description says "no ads" with Premium.
- **Privacy label (Apple's wording):** Data Not Collected
- **Best for:** The clearest "work days until retirement" explanation: breakdown of weekdays, holidays and vacation.
- **Limits the listing itself states:** "It does not calculate pension amounts ... does not provide financial or retirement advice. Holiday data without guarantee." One rating only.
- **Checked 2026-10-20.** Fetched: https://apps.apple.com/us/app/id6759114478 and lookup data via appfacts.py. History holds 9 entries (1.0 on 2026-03-11 to 1.0.6).

### Retirement Countdown+ Tracker (close alternative)

- **Exact App Store name:** Retirement Countdown+ Tracker
- **Developer (seller):** Wayne Nixon
- **URL / ID:** https://apps.apple.com/us/app/id6802019447 / 6802019447
- **Price to download:** Free
- **In-app purchases as listed:** Unlock the Full App = $6.99. Description: "ONE PRICE. NO ADS. NO SUBSCRIPTION."
- **Free tier limits (verbatim):** "The calendar-day countdown, the widget and the morning reminder are free for good. Before you pay, the app shows your own workdays-left number."
- **Platforms from the Compatibility section (verbatim):** iPhone Requires iOS 16.4 or later.; Mac Requires macOS 12.0 or later and a Mac with Apple M1 chip or later.; Apple Vision Requires visionOS 1.0 or later. Minimum iOS: 16.4.
- **Rating (US):** 4.0 from 1 rating
- **Current version:** 2.0.1, released 2026-10-03. **First release:** 2026-09-02 (year 2026).
- **Key features and where each was found:** Workdays "with your weekends, federal holidays and PTO and vacation days already taken off"; repeating shift patterns from 2 to 28 days, 9/80 and four-on-four-off; holidays for the United States, UK (England and Wales), Canada, Australia, much of Europe, or a custom list; key retirement dates from date of birth (59½, 62, 65, full Social Security age, RMDs; "Not financial advice"); Home Screen (small and medium) and Lock Screen widget (v2.0.0); share cards; counts up after zero; backup and restore (description). StandBy, Live Activities, Watch, iCloud: Not stated.
- **Ads:** Age rating "Contains: Advertising" not found on page; description says "No banners, no video".
- **Privacy label (Apple's wording):** Data Not Linked to You: Purchases, Identifiers, Usage Data
- **Best for:** Shift workers and anyone who wants US federal holidays and PTO subtracted.
- **Limits the listing itself states:** Workday counting, schedule, holidays and PTO need the paid unlock.
- **Checked 2026-10-20.** Fetched: https://apps.apple.com/us/app/id6802019447 and lookup data via appfacts.py. History holds 6 entries (1.0 on 2026-09-02 to 2.0.1).

## Competitive angle for Left

The retirement-specific listings are almost all calendar-day or "years, months, days" countdowns decorated with photos; only Zaffles (vacation-day removal, Lock Screen and StandBy widgets) and the newer workday apps (RetirementTracker, Retirement Countdown+, Working Days Counter) describe workday or holiday handling, and the newer ones have one to a few hundred ratings. None mentions Live Activities. Most high-volume retirement apps (Zaffles, Green Gecko, WorkEnd) carry "Contains: Advertising" and the two biggest show "Data Used to Track You", so a no-ads, no-tracking angle is supported by their own labels.
