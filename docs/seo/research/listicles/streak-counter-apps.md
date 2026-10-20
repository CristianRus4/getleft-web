# Streak counter / streak tracker apps: research sheet

Target keywords: "streak counter app", "streak tracker app" (apps for keeping a daily chain going or counting a streak; "don't break the chain").
Checked 2026-10-20. Every fact was read on 2026-10-20 from the US App Store page (`https://apps.apple.com/us/app/id<ID>`, curl; description, What's New, version history, In-App Purchases, compatibility, privacy labels, ratings) and `https://itunes.apple.com/lookup?id=<ID>&country=us`. "Not stated" means the sources fetched do not say it. No developer sites were used.

App Store searches run (US, entity=software, limit 25): "streak counter", "streak tracker", "streak", "don't break the chain", "chain habit", "daily streak", "day counter streak", "days since".

Caveats:
- Version history on the page shows at most 25 versions (fewer for new apps), so "not in release notes" means "not in the versions shown".
- IAP lists repeat items at different prices (regional/offer variants); copied as listed.
- "First release" is `releaseDate` in the lookup.
- Ratings are US.
- "Freeze/skip", "best streak" and "reset" are reported only where the page text or release notes say so.

## Recommendation

Use these 6 (strongest, current, and actually about streaks):
1. **Streaks** (963034692): the category reference. $5.99 paid, 27,353 ratings, 4.81, updated 2026-10-18, Apple Watch, widgets, Live Activity for timers, Siri/Shortcuts. Up to 24 tasks. Manual check-in plus Health auto-completion. Freeze/skip: Not stated.
2. **Days Since: Quit Habit Tracker** (1445348921): automatic count-up counter ("Sober Streak Day Counter"), 19,499 ratings, 4.82, updated 2026-10-13, Apple Watch, Goals widget (4.1.3), Achievements and Stats. Best for quit-a-habit streaks. Subscription-heavy IAP list; free limits Not stated.
3. **Way of Life** (393159800): manual green/red "Chains: challenge yourself not to break a streak", since 2010, 5,317 ratings, 4.82, updated 2026-10-02, widgets, Siri and Shortcuts. No Watch in compatibility. Premium "simply unlocks unlimited habits".
4. **HabitKit** (6443918070): grid/heatmap streak tracker, 2,492 ratings, 4.84, updated 2026-10-13. Free up to four habits including streaks; widgets are Pro. Note: a separate HabitKit alternatives article exists in this folder, so check for overlap before using it here.
5. **Goal Streak: Habit Tracker** (1630626343): free, no IAP listed, privacy label "Data Not Collected", streak freeze (since 2026.15.0, 2026-05-26), longest streak, streak end date, interactive widgets. Only 335 ratings (4.84), iOS 18.0.
6. **Habit Tracker - Flame** (6749051240): positions itself as a "streak counter": manual check-ins or automatic midnight counter, streak freezes, trophies at 7/30/90/365/1,000 days. Only 235 ratings (4.63), first released 2025-08, renamed Flame on 2026-10-07; premium unlocks unlimited streaks and freezes. Kept because it matches the "streak counter" keyword most literally.

Drop, and why:
- **DayCount** (1121088244): 26,262 ratings and has "Streaks and Habits" mode, but it is primarily a countdown app (covered in the Countdown Star sheet); no Apple Watch listed; IAP list includes a "StreakCount" $59.99 entry. Mention only as a crossover.
- **Streakly** (1637037683): 58 ratings; last update 2026-02-09; free limits Not stated; $14.99 lifetime. Nice heatmap and "Don't Break the Chain" wording but too small.
- **My Streaks: Habits & Widget** (6751120903): 4 ratings (4.25); it is a "time since" widget app, requires iOS 18.5; release note 1.9 says "We're Circles Now" (rename not reflected in the store name).
- **Go Streak** (6743342451): 0 ratings; page language listed as Russian only; Contact Info and Identifiers linked to user.
- **(Not Boring) Habits** (1593891243): description says "No streaks. No guilt." (positions against streaks), though release notes 3.27 mention a "Streak" widget. Keep out of a streak list; useful only as the anti-streak contrast. 6,264 ratings, 4.78.
- Other apps with large rating counts that are not streak-first: **Habit Tracker by InnerGrow** (1438388363; 148,058 ratings, updated 2026-10-15; the word "streak" does not appear in its page text), **I Am Sober** (672904239; 189,168 ratings; sobriety tracker, 18+, release notes mention "best streak"), **Productive** (983826477; 91,063 ratings, last update 2026-03-19, "chains of completed habits", heavy tracking label), **Strides** (672401817; "Streak calendars"), **Grit** (6446997766; iOS 26.0 minimum, streak widget), **everyday** (1394150432; "Don't break the chain"), **Don't Break The Chain!** (313567772; 1,423 ratings, last update 2024-10-15). Details below.

---

## 1. Recommended apps

### 1.1 Streaks
- **Name**: Streaks (subtitle "Habit Tracker & To-Do List"). **Developer**: Crunchy Bagel; **seller**: Crunchy Bagel Pty Ltd.
- **URL / ID**: https://apps.apple.com/us/app/streaks/id963034692 / 963034692
- **Price**: $5.99 (paid upfront). In-App Purchases: none listed on the page. No ads label.
- **Free tier**: none (paid app). Limit stated: "Track up to 24 tasks you want to complete each day."
- **Platforms**: iPhone iOS 17.6; iPad iPadOS 17.6; Mac macOS 14.6; Apple Vision visionOS 2.0; Apple Watch watchOS 10.0. Min iOS 17.6.
- **Rating**: 4.8 (lookup 4.81), 27,353 ratings.
- **Version**: 11.5.2, 2026-10-18. **First release**: 2015.
- **How the streak works**: "Your goal is to build a streak of consecutive days." Manual completion of daily tasks; tasks linked to Health complete automatically ("Streaks automatically knows when you complete tasks linked to the Health app"); negative tasks to break bad habits; timed tasks; "Choose how often a task needs to be completed or repeated". "View your current and best streak, and a whole range of other statistics". Freeze/skip days: Not stated. Reset behavior: Not stated. Paused tasks exist (11.2.0 notes: "Paused tasks are now hidden from widgets").
- **Widgets**: "Widgets for your phone's home screen" (description); 11.4.0 "Support for extra-large widgets on iPhone and iPad"; Tasks widget can be limited to a single category; Stats, Dots, Dice widgets named in notes. Lock Screen widgets: Not stated by name; Apple Watch widgets configurable from clock face (11.0.3).
- **Live Activities**: indirect only. 11.3.0 notes: "Fixed: Live Activity not dismissing for certain timers" (version history, 2026-03-21).
- **Apple Watch**: yes, compatibility watchOS 10.0; description: "Apple Watch app, including Health app integration, complications, and rich notifications"; 11.3.0 "Undo on Apple Watch".
- **Other**: iCloud sync, sharing tasks with other Streaks users, 78 color themes, 600+ icons, Siri Shortcuts, "Create and complete tasks with Siri AI" (11.4.0, 2026-09-14).
- **Privacy label**: Data Not Linked to You: Diagnostics.
- **Best for**: Serious daily-chain keepers on iPhone plus Apple Watch who will pay once.
- **Limits stated**: 24 tasks maximum; $5.99 upfront; iOS 17.6 minimum.
- **Checked 2026-10-20.** URLs: https://apps.apple.com/us/app/id963034692 ; https://itunes.apple.com/lookup?id=963034692&country=us

### 1.2 Days Since: Quit Habit Tracker
- **Name**: Days Since: Quit Habit Tracker (subtitle "Sober Streak Day Counter"). **Developer / seller**: A Couple of Friends OOD.
- **URL / ID**: https://apps.apple.com/us/app/id1445348921 / 1445348921
- **Price**: Free. IAPs as listed (labelled): Count Up Club - Yearly $17.99; Count Up Club - Monthly $5.99 and $2.99; Count Up Club - Lifetime $49.99; Premium - Yearly $24.99; Premium - Monthly $7.99 and $9.99; "(DISCOUNT) Count Up Club" $11.99. No ads label.
- **Free tier limits**: Not stated on the page (description does not list what the paid plans unlock).
- **Platforms**: iPhone iOS 16.6; Mac macOS 13.5 (M1); Apple Vision visionOS 1.0; Apple Watch watchOS 10.0. iPad: not listed. Min iOS 16.6.
- **Age rating**: 13+ ("Infrequent Alcohol, Tobacco, Drug Use or References").
- **Rating**: 4.8 (lookup 4.82), 19,499 ratings.
- **Version**: 4.1.3, 2026-10-13. **First release**: 2019.
- **How the streak works**: automatic count-up from a last-occurrence date: "Create a counter for each habit that you are trying to get rid of... set the last time you had a cigarette. The app will show you how long it's been since you smoked". Reset is manual ("You don't want to reset that counter, do you?"). Best streak: not stated in description; 4.0.0 (2025-11-12) "Stats - a new way to see your streaks, trends, and progress". 4.1.0 (2026-08-31) "Achievements - a new way to celebrate your progress and reach meaningful milestones". Freeze/skip: Not stated.
- **Widgets**: 4.1.3 "Home Screen widget for Goals"; earlier fixes for widgets (4.0.3, 4.0.5, 3.0.16). Lock Screen / Live Activities: Not stated.
- **Apple Watch**: yes per compatibility; release notes mention Watch fixes (4.0.13, 3.0.17).
- **Other**: Automatic iCloud Backups (4.0.9, 2026-06-30), Liquid Glass (4.0.6/4.0.7).
- **Privacy label**: Data Not Linked to You: Usage Data, Diagnostics.
- **Best for**: Counting up days since quitting something (sobriety, smoking, sugar).
- **Limits stated**: free-tier limits Not stated; two subscription families plus lifetime.
- **Checked 2026-10-20.** URLs: https://apps.apple.com/us/app/id1445348921 ; https://itunes.apple.com/lookup?id=1445348921&country=us

### 1.3 Way of Life - Habit Tracker
- **Name**: Way of Life - Habit Tracker (subtitle "Daily Goals, Streaks & Routine"). **Developer / seller**: Way of Life ApS.
- **URL / ID**: https://apps.apple.com/us/app/id393159800 / 393159800
- **Price**: Free. IAPs as listed: Premium $29.99 (several entries), $14.99, $4.99; Super-shake $4.99. No period labels. No ads label.
- **Free tier limits**: "Everything above is included. Premium simply unlocks unlimited habits." Number of free habits: Not stated.
- **Platforms**: iPhone iOS 17.6; Mac macOS 13.0.0 (M1); Apple Vision visionOS 1.3. iPad and Apple Watch: not listed. Min iOS 17.6.
- **Rating**: 4.8 (lookup 4.82), 5,317 ratings.
- **Version**: 4.6.0, 2026-10-02. **First release**: 2010 (2010-11-07).
- **How the streak works**: manual daily "Mark each day green or red, keep your chains going". Feature list: "Chains: challenge yourself not to break a streak". Notes (4.3.2) mention a broken chain; "Skip" and "Erase" buttons exist (4.3.x notes: "tapping Yes / No / Skip / Erase"). Best streak / freeze: Not stated. Includes scoreboard and charts (frequency distribution added 4.6.0).
- **Widgets**: "Widgets are back! (iOS 17)" (4.1.0 notes); description lists "Widgets, Siri, and Shortcuts". Lock Screen / Live Activities: Not stated.
- **Other**: free Backup & Restore (4.3.0), export CSV/Excel/JSON, Face ID / passcode lock.
- **Privacy label**: Data Not Linked to You: Purchases, Identifiers, Usage Data, Diagnostics.
- **Best for**: Simple yes/no daily chains and bad-day tracking with a long track record.
- **Limits stated**: free habit cap (unspecified); no Watch/iPad in compatibility.
- **Checked 2026-10-20.** URLs: https://apps.apple.com/us/app/id393159800 ; https://itunes.apple.com/lookup?id=393159800&country=us

### 1.4 HabitKit
- **Name**: Habit Tracker - HabitKit (subtitle "Streaks & Accountability"). **Developer / seller**: Sebastian Roehl.
- **URL / ID**: https://apps.apple.com/us/app/id6443918070 / 6443918070
- **Price**: Free. IAPs as listed with labels: HabitKit Pro (1 Month) $1.99, $0.99, $4.99; (1 Year) $11.99, $24.99, $5.99; (Lifetime) $29.99, $14.99; "HabitKit Pro" $59.99. No ads label ("No ads" in description).
- **Free tier (verbatim)**: "HabitKit is free to use with up to four habits, including streaks, statistics, notes, and reminders. Pro unlocks unlimited habits, home screen widgets, import and export backups, restoring archived habits, and up to three reminders per habit." Note: 1.18.2 (2026-10-13) says "Export and import are now free for everyone", which conflicts with the description line; report both.
- **Platforms**: iPhone iOS 15.0; iPod touch iOS 15.0; Mac macOS 12.0 (M1); Apple Vision visionOS 1.0. iPad and Apple Watch: not listed. Min iOS 15.0.
- **Rating**: 4.8 (lookup 4.84), 2,492 ratings.
- **Version**: 1.18.2, 2026-10-13. **First release**: 2022 (2022-11-26).
- **How the streak works**: manual yes/no, count or measure; "Watch your current streak grow, chase your best streak, and set streak goals". Quit habits: "every day counts as clean until you log a slip, and your streak counts your clean days in a row" (automatic-style count with manual slips). Flexible schedules (specific intervals, times per week/month). Freeze/skip: Not stated.
- **Widgets**: "small, medium, and multi-habit widgets" (Pro); 1.15.0 "compact list" widget. Live Activities / Lock Screen: Not stated.
- **Privacy label**: Data Linked to You: Purchases. Data Not Linked to You: Location, Usage Data, Diagnostics.
- **Best for**: Heatmap-grid fans who want streaks on the free plan (up to four habits).
- **Limits stated**: four free habits; widgets Pro; no Watch.
- **Checked 2026-10-20.** URLs: https://apps.apple.com/us/app/id6443918070 ; https://itunes.apple.com/lookup?id=6443918070&country=us

### 1.5 Goal Streak: Habit Tracker
- **Name**: Goal Streak: Habit Tracker (subtitle "Streaks. Simple. Private."). **Developer**: Emily Cheroske; **seller**: Swifty Bits LLC.
- **URL / ID**: https://apps.apple.com/us/app/id1630626343 / 1630626343
- **Price**: Free. IAP: none listed. No ads label. Description: "a free and simple habit tracker"; "Track unlimited habits & goals".
- **Free tier limits**: none stated beyond "unlimited habits".
- **Platforms**: iPhone iOS 18.0; iPad iPadOS 18.0; Apple Vision visionOS 2.0. Mac and Apple Watch: not listed. Min iOS 18.0.
- **Rating**: 4.8 (lookup 4.84), 335 ratings.
- **Version**: 2026.41.0, 2026-10-11 (timed habits). **First release**: 2022 (2022-06-22).
- **How the streak works**: manual completion; "Set habit frequency" (every other day, multiple times a day, weekly); "Streak freeze - need a break? ... You can preserve your streak with a streak freeze!" (added 2026.15.0, 2026-05-26: "Long press on any habit to see the option to freeze the streak for that day"); "Streak end date" with countdown; "Detailed streak stats - view current streaks, longest streaks, and yearly totals"; 2026.37.0 "Add option to import existing streak for new, daily type goals".
- **Widgets**: "Widgets - track daily and weekly progress right from your Home Screen"; 2026.37.0 "Interactive widgets!". Lock Screen / Live Activities: Not stated.
- **Privacy label**: Data Not Collected. Description: "Your data never leaves your device... stored securely on your iPhone and iCloud".
- **Best for**: Free, private streaks with freeze and longest-streak stats.
- **Limits stated**: iOS 18.0 minimum; small user base; no Watch/Mac.
- **Checked 2026-10-20.** URLs: https://apps.apple.com/us/app/id1630626343 ; https://itunes.apple.com/lookup?id=1630626343&country=us

### 1.6 Habit Tracker - Flame
- **Name**: Habit Tracker - Flame (subtitle "Daily goals & streak counter"). **Developer**: Explora (Apps); **seller**: Explora SAS.
- **URL / ID**: https://apps.apple.com/us/app/id6749051240 / 6749051240
- **Price**: Free. IAPs as listed with labels: Flame Tracker Pro - Yearly $19.99; - Monthly $4.99; - Lifetime $49.99; - Lifetime Offer $24.99. No ads label. Age rating 13+ ("Infrequent Alcohol, Tobacco, Drug Use or References", "Contains User-Generated Content").
- **Free tier (verbatim)**: "Start tracking for free. Premium unlocks unlimited streaks, streak freezes, home screen widgets, Insights, backup and restore, plus custom themes and icons." Free streak count: Not stated.
- **Platforms**: iPhone iOS 15.1; iPad iPadOS 15.1; iPod touch iOS 15.1; Mac macOS 12.0 (M1); Apple Vision visionOS 1.0. Apple Watch: not listed. Min iOS 15.1.
- **Rating**: 4.6 (lookup 4.63), 235 ratings.
- **Version**: 1.14.0, 2026-10-19 (weekday schedules, sort by reminder time). **First release**: 2025 (2025-08-06).
- **How the streak works (description)**: "Build a habit with manual check-ins. Mark it done when you've followed through, and add another day to your streak." "Break a habit with an automatic counter. Your streak grows at midnight without daily check-ins. Reset it when you need a fresh start." "Choose which days count... Planned days off won't break your streak." "Update past days from the calendar." "Use a streak freeze to keep your streak going while recording the missed day". Personal bests, lifetime totals, "a record of your comebacks"; trophies at 7, 30, 90, 365 and 1,000 days. Manual mode added in 1.10.0 (2026-02-17).
- **Widgets**: "home screen widgets" (Premium). Lock Screen / Live Activities: Not stated.
- **Name change**: 1.13.6 (2026-10-07) "We have a new name. Say hello to Flame!" (page title still "Habit Tracker - Flame").
- **Privacy label**: Data Used to Track You: Identifiers. Data Linked to You: Identifiers. Data Not Linked to You: Identifiers, Usage Data, Diagnostics. Description says "Your streak data stays on your phone"; report both.
- **Best for**: People who want a literal "streak counter" with an auto count-up mode and freezes.
- **Limits stated**: freezes, widgets and unlimited streaks are Premium; tiny rating base; no Watch.
- **Checked 2026-10-20.** URLs: https://apps.apple.com/us/app/id6749051240 ; https://itunes.apple.com/lookup?id=6749051240&country=us

---

## 2. Dropped candidates (facts as fetched)

### 2.1 DayCount (1121088244)
Seller Zaminiti Pty Ltd. Free; IAPs DayCount Premium $9.99, DayCount Forever $29.99, DayCount Pro $59.99, StreakCount $59.99 (description: yearly subscription with 7-day trial, or lifetime). 4.7 (26,262). v6.1.1, 2026-10-11; first release 2016. Compatibility: iPhone iOS 16.0, iPad, Mac, Vision; no Watch. Description section "Streaks and Habits: Build positive habits by tracking daily streaks; Work towards your longest run of productive days; View streaks alongside your events". Widgets on Home Screen or Lock Screen. Siri and Shortcuts in 6.1.1. Privacy: Data Linked to You: Contact Info, User Content; Not Linked: Purchases, Identifiers, Usage Data, Diagnostics. URLs: https://apps.apple.com/us/app/id1121088244 ; lookup.

### 2.2 Streakly: Simple Habit Tracker (1637037683)
Unstatic Ltd Co. Free; IAP "Life-time Premium" $14.99. 4.67 (58 ratings). v2.0.0, 2026-02-09 (Liquid Glass refresh); first release 2022. iPhone iOS 16.2, iPad, Mac macOS 12.5, Vision, Apple Watch watchOS 10.6. Description: "Don't Break the Chain", "Year in Pixels" heatmap, "Interactive Widgets: Check off habits directly from your Home Screen", "No Monthly Fees. No Ads. One Lifetime Purchase". Free limits: Not stated. Privacy: Data Not Linked to You: Usage Data. Why dropped: 58 ratings, no 2026 update after February.

### 2.3 My Streaks: Habits & Widget (6751120903)
Arbor Apps LLC. Free; IAPs Plus Lifetime $19.99, Plus Yearly $9.99 ("Purchase Plus to add more streaks"). 4.25 (4 ratings). v1.11, 2026-10-18; first release 2025. iOS 18.5 minimum; iPhone, iPad, Mac, Vision; no Watch. "Time since" streaks pinned to a widget, up to five in the widget. Privacy: Data Not Collected. Why dropped: 4 ratings, iOS 18.5.

### 2.4 Go Streak: habit tracker (6743342451)
Anton Zavalishin. Free; no IAP listed. 0 ratings. v1.6, 2026-02-02 ("English language support added"); page Languages: Russian. iOS 13.0; no Watch. Privacy: Data Linked to You: Contact Info, Identifiers; Not Linked: Usage Data, Diagnostics. Age rating box: "Infrequent Contests". Why dropped: no ratings.

### 2.5 (Not Boring) Habits (1593891243)
Not Boring Software LLC. Free; IAPs Super !Boring Yearly $29.99, Monthly $7.99, !Habits Plus Yearly $14.99, !Habits Plus Lifetime $59.99, skins $4.99 to $9.99. 4.78 (6,264). v3.36, 2026-09-11 ("Updated for iOS27"); first release 2021. iOS 18.0; iPhone, iPad, Vision; no Watch/Mac. Description: "No streaks. No guilt." and "It doesn't matter if you miss a day or break a streak. It just matters that you do it 60 times." Release notes 3.27 nonetheless list a "Streak" widget ("shows your current streak"). Privacy: Data Not Collected. Use only as the anti-streak contrast.

### 2.6 Other large-rating apps seen in searches (page facts)
- **Habit Tracker, InnerGrow** (1438388363): free; 4.79 (148,058); v2.25.4 2026-10-15; iPhone/iPad/Mac/Vision/Watch (watchOS 9.0); iOS 15.0; IAPs Lifetime Member $19.99, Monthly Premium $4.99, Habit Premium Yearly $7.99, etc.; Lock Screen widgets named in description; "streak" not in page text; privacy Not Linked: Diagnostics.
- **I Am Sober** (672904239): 189,168 ratings, 4.88; sobriety tracker, 18+; 8.8.4 2026-10-12 ("progress cards show your month, total days and best streak"); Watch yes; privacy Data Linked to You: Contact Info, User Content, Identifiers, Usage Data, Diagnostics.
- **Productive - Habit Tracker** (983826477): 91,063 ratings, 4.60; last update 2026-03-19; "chains of completed habits and perfect days"; Watch yes; IAP Premium 1 Year up to $79.99; privacy Data Used to Track You: Purchases, Contact Info, Identifiers.
- **Strides** (672401817): 19,242 ratings, 4.79; v19.15 2026-10-06; "Streak calendars"; Watch yes; IAP Strides Plus (multiple prices up to $149.99).
- **Grit** (6446997766): 16,115 ratings, 4.78; v6.0.2 2026-10-09; iOS 26.0 minimum; Watch (watchOS 26.0); "Achievements: Unlock milestones as you build a streak"; 5.5.x "New streak widget", "Option to disable streaks"; privacy Data Used to Track You: Location, Identifiers, Usage Data.
- **everyday - Habit Tracker** (1394150432): 4,536 ratings, 4.71; v3.10.0 2026-10-14; "DON'T BREAK THE CHAIN"; Watch yes; IAP up to $99.99 lifetime.
- **Don't Break The Chain!** (313567772): 1,423 ratings, 4.83; v3.5.0 last updated 2024-10-15; iOS 12.0; IAP "Go Pro!" $5.99 plus tips; first release 2009; no Watch.
Fetched via the same App Store page and lookup URLs (swap in each ID).
