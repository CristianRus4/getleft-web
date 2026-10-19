# Research: iPhone sobriety counter apps

Target queries: "sobriety counter app", "days sober app", "sober counter iPhone". Checked 2026-10-20. Research only, not article copy.

Sources for every app below (all fetched 2026-10-20, US storefront):
- Page: `https://apps.apple.com/us/app/id<ID>` (description, What's New, version history, IAP list, compatibility, privacy labels)
- Lookup: `https://itunes.apple.com/lookup?id=<ID>&country=us` (rating, count, version, first release date, minimum iOS, Developer field)
- Search: `https://itunes.apple.com/search?term=<term>&entity=software&country=us&limit=25` for "sobriety counter", "sober counter", "days sober", "sober time", "quit drinking", "sobriety recovery", plus "smoke free quit smoking", "quitzilla", "sobriety calculator", "sobriety counter widget".

Conventions: "Not stated" means the fetched sources do not say it. The App Store page version history lists only the latest 25 versions at most. Ratings counts differ slightly between the page and the lookup API (cache lag). The lookup count is used below unless noted. Where the page was newer than lookup (I Am Sober 8.8.5 vs 8.8.4), the page value is given. IAP lists on the page show only names and prices, with no free-tier or feature detail, and duplicates are listed once per entry as Apple shows them.

---

## Recommendation

Strongest 6 (all have many ratings, a 2026 update, and are sobriety-first counters):

1. **I Am Sober** (id672904239): the benchmark. 189K ratings, 4.88, updated 2026-10-19. Free tracker plus Sober Plus subscription. Multi-addiction (more tracking is a Plus feature). Community, daily pledge, money saved, milestones, Apple Watch listed in compatibility.
2. **Sober Time - Sobriety Counter** (id1158895079): the closest feature match to Left on widgets. 42.9K ratings, 4.85. Home Screen and Lock Screen widgets, Apple Watch app with watch face widgets, iPad, journal, money saved, multiple trackers, community forum. Premium Monthly/Annual.
3. **Nomo - Sobriety Clocks** (id566975787): indie, multiple clocks, accountability partners, milestone tokens, journaling. No IAPs listed. Widgets only via separate paid app Nomo Widgets ($1.99). 16.7K ratings.
4. **Sober: Sobriety Tracker** (Red Penguin, id863872931): 7.9K ratings, 4.75. Counter, streaks, community, daily widgets, Insights screen. Premium subscription. Makes the most health/credential claims of the six (do not repeat).
5. **Sober SideKick: Quit Addiction** (id1448251580): community-first, 8.1K ratings, 4.83. Counter plus social network and meeting access. No widget or Watch mention anywhere.
6. **Sunflower - Quit Any Addiction** (id1547099435): 6.3K ratings, 4.84, updated 2026-10-19. Counter with a gamified "sunflower per day", AI "sponsor" chat (subscription), guided journaling. More of a coaching/AI app than a pure counter.

Honorable mentions, usable as an optional 7th or as a one-line "also" if the article needs a generic multi-habit counter:
- **Days Since: Quit Habit Tracker** (id1445348921): generic quit counters (not sobriety-specific), Apple Watch in compatibility, Home Screen widget, 19.5K ratings. Best "any habit" alternative.
- **Quitzilla: Quit Tracker** (id1533076568): multiple habits, money saved, Home and Lock Screen widgets, iOS 26.0 minimum, but only 1.5K ratings.

Drop, and why:
- **Reframe: Drink Less & Thrive** (id1485756576, 45K ratings): a program, not a counter. 160-day education program, coaching, subscription from $13.99 per month. Make claims (see below). Mention at most as "a program, not a counter".
- **Sunnyside: Drink Less Alcohol** (id1593489083): explicitly "mindful drinking and moderation, not sobriety". Subscription $99.99/$299.00. Privacy label includes "Sensitive Info". Wrong category.
- **Loosid Recovery & Sober App** (id1413514350): social network and dating, 16+, location in privacy label, many IAPs ("Dating Pro", "SAM"). Not primarily a counter.
- **Smoke Free - Quit Smoking Now** (id577767592, 57K ratings): quit smoking only, program with Pro/"Blitz your Quit". Out of scope for a sober counter article.
- **Sobriety Counter Stop Drinking / EasyQuit** (id1536343358, 2.9K ratings): alcohol only. Its description says no login and data stored locally (a privacy point), but ads, tracking in the privacy label, and only one 2026 update ("updated several libraries"). Weak.
- **DayCount** (id1121088244, 26K ratings): generic day counter, not a sobriety app. Fetched but not profiled.
- Many tiny-rating 2026 clones (e.g. Kern, FreshPath, Sober Days: Quit Alcohol, ClearDay) with fewer than 15 ratings. Not worth including.
- **Days - Sobriety Counter** (id1084331959, 920 ratings, last updated 2025-09-16) and **Clean Day** (id934015977, 1.2K ratings): small, not profiled.

Left positioning note (facts only): of the six, only Sober Time lists Lock Screen widgets and a Watch app explicitly in release notes. None of the fetched pages mention Live Activities or StandBy.

---

## SAMHSA National Helpline (for a "if you need help" pointer)

Fetch status: `https://www.samhsa.gov/find-help/helplines/national-helpline` (and the www.samhsa.gov home and other pages) returned **HTTP 403 Forbidden** to curl and WebFetch today, so the samhsa.gov page itself could not be fetched. Do not treat the quotes below as verified from the fetched samhsa.gov page. Wording was obtained from two other sources fetched today:

1. **USA.gov (official US government site)**, `https://www.usa.gov/substance-abuse`, fetched with curl (HTTP 200) 2026-10-20. Verbatim:
   - "Find substance abuse help through the Substance Abuse and Mental Health Services Administration (SAMHSA) National Helpline."
   - "Connect with treatment and mental health referrals near you by: Calling 1-800-662-HELP (4357) Texting your zip code to HELP4U (435748)"
   - "SAMHSA offers free, confidential help for people facing substance abuse issues."
   - "Search for a treatment facility near you at FindTreatment.gov."
2. **WebSearch result on 2026-10-20** that quoted samhsa.gov's helpline page text (search snippet, not a fetched page): "SAMHSA's National Helpline, 1-800-662-HELP (4357) (also known as the Treatment Referral Routing Service), or TTY: 1-800-487-4889 is a confidential, free, 24-hour-a-day, 365-day-a-year, information service." Also from the snippet: "The referral service is free of charge." and "The service is confidential. SAMHSA will not ask you for any personal information." The page URL returned by search is `https://www.samhsa.gov/find-help/helplines/national-helpline` (title "National Helpline for Mental Health, Drug, Alcohol Issues"). Also `https://www.findtreatment.gov/` returned 200 but with no readable text via curl.

Writer note: the number 1-800-662-HELP (4357) and "free, confidential" are confirmed by usa.gov (fetched). The "24-hour-a-day, 365-day-a-year" wording is from the search snippet attributed to samhsa.gov; someone with a normal browser should confirm it on samhsa.gov before publishing. Safe link target: `https://www.samhsa.gov/find-help/helplines/national-helpline`.

---

## 1. I Am Sober

- Exact name: **I Am Sober**
- Developer: seller I Am Sober LLC; Developer field I Am Sober LLC
- URL: https://apps.apple.com/us/app/id672904239 | ID 672904239
- Price: Free
- IAPs as listed (names and prices, labels as Apple shows): 12 Months $39.99; 1 Month $9.99; 1 Month $9.99; 6 Months $27.49; 12 Months $29.99; 6 Months $27.49; 12 Months $39.99; "I Am Worthy" $0.99; "I Am Letting Go" $0.99; "I Am Killing It" $0.99. Labelled by month counts (1, 6, 12 Months). No "weekly" or "lifetime" label listed.
- Free tier (verbatim): "I Am Sober is free to use, but you can support development of the app with a subscription to Sober Plus." Plus features listed: "Create a group", "Locked access" (TouchID or FaceID lock), "Data Backups", "More tracking" ("Track more addictions and get access to more communities"). Exact free-tier tracker limit: Not stated.
- Platforms (compatibility section): iPhone iOS 15.1+; iPod touch; Mac (macOS 13.3+, Apple M1 or later); Apple Vision (visionOS 1.0+); Apple Watch (watchOS 9.0+). iPad: not listed. Minimum iOS 15.1.
- Rating (US): 4.88 from 189,168 (lookup); page shows 4.9 and 189,228
- Current version/date: 8.8.5, 2026-10-19 (page); lookup shows 8.8.4, 2026-10-12. First release: 2013 (2013-07-19)
- Key features (description, "The I Am Sober app features"): sober day tracker; reasons and photos ("Remember why you quit"); daily pledge tracker; "Sobriety calculator" (money and time saved); trigger analysis; photo journal and story sharing; milestone tracker (1 day to 1 week to 1 month and beyond; release notes say milestones now go up to 50 years); "Withdrawal timeline"; community; customise time, "sober birthday", categories; groups (Plus). Release notes: calendar showing sober days per month (8.8.0), progress cards for month/total days/best streak (8.8.5), alternative app icons for Plus (8.7.2), manual backups (8.8.1).
- Widgets / Lock Screen / StandBy / Live Activities: Not stated in the description or in the 25 versions of release notes shown. Apple Watch support listed in compatibility (and a Watch screenshot set exists on the page), but no description of its features.
- What it counts: multiple addictions (more tracking is Plus). Money saved: yes. Milestones: yes. Journaling: yes. Community: yes (anonymous-style sharing, comments, groups). Coaching/program: counter plus community, not a program.
- Privacy label: "Data Linked to You": Contact Info, User Content, Identifiers, Usage Data, Diagnostics. No "Data Used to Track You" shown.
- Age rating 18+ (Frequent: Alcohol, Tobacco, Drug Use or References; Contains: Advertising, Messaging and Chat, User-Generated Content, Health or Wellness Topics).
- Best for: a full-featured free sobriety counter with a large community.
- Limits stated: Plus needed for groups, locking, backups, more addictions. Contains advertising per age-rating info.
- Claims to avoid (quoted, do not repeat): "Withdrawal timeline ... Prepare yourself for what's to come in recovery."; "Remember why you quit your addiction and stay sober"; "Medical Treatment information" listed as infrequent content.
- Checked 2026-10-20. URLs fetched: https://apps.apple.com/us/app/id672904239 ; https://itunes.apple.com/lookup?id=672904239&country=us

## 2. Sober Time - Sobriety Counter

- Exact name: **Sober Time - Sobriety Counter**
- Developer: seller Sociosoftware LLC (Apps); Developer field Sociosoftware LLC (Apps)
- URL: https://apps.apple.com/us/app/id1158895079 | ID 1158895079
- Price: Free
- IAPs as listed: Premium Monthly $4.99; Premium Annual $29.99; Premium Annual $29.99. No weekly or lifetime.
- Free tier: Not stated. (Description does not say which features need Premium. Release note 4.4.01 says "Premium: timing tuned to your own history".) The 4.1.04 notes say "Removed intrusive ads" while the age-rating box still lists Advertising.
- Platforms: iPhone iOS 17.0+; iPad (iPadOS 17.0+); Mac (macOS 14.0+, Apple M1+); Apple Vision; Apple Watch (watchOS 11.1+). Minimum iOS 17.0.
- Rating (US): 4.85 from 42,866 (lookup; search showed 42,880)
- Current version/date: 4.4.08, 2026-10-15. First release 2016 (2016-10-20)
- Key features: "Track as many addictions as you want"; built-in goals; daily motivational messages; community forum (browse anonymously without an account); backgrounds and icons; "Tons of timer options" (over 10 display modes from total days to breaths); relapse tracking with notes; "See how much money you've saved"; sharing; 15+ colour themes; journal (guided journaling, "Journal Tones", photos); streaks (added 2026-03); cloud sync backups.
- Widgets: yes. Release 4.3.0 (2025-12-22): "WatchOS support! Full Watch app with watch face widgets.", "New home screen widgets: Savings + circular day tracker.", "Lock screen widgets for iOS." Release 4.3.11: "Adding Sober Time widgets is now easier. Just tap Add Widget in the main menu". StandBy and Live Activities: Not stated.
- Apple Watch: yes (compatibility and 4.3.0 notes). iPad: yes.
- What it counts: multiple addictions at once, single-app. Money saved: yes. Milestones: yes (shown since last visit). Journaling: yes. Community: yes. Counter, not a program.
- Privacy label: "Data Used to Track You": Identifiers. "Data Not Linked to You": Identifiers, Usage Data, Diagnostics.
- Age rating 13+ (Infrequent: Alcohol, Tobacco, Drug Use or References; Contains: Advertising, Messaging and Chat, User-Generated Content, Health or Wellness Topics, Social Media).
- Best for: someone who wants Home Screen, Lock Screen and Watch widgets plus a journal in one counter.
- Limits stated: Not stated. Newest versions require iOS 17.
- Claims to avoid (quoted): 4.4.01 "Health Timeline: See what recovery is doing to your body and mind, day by day. Research-backed milestones for alcohol, nicotine, cannabis, opioids, stimulants and more."; 4.4.05 "Clearer research sources and evidence levels on each milestone"; 4.4.08 "Ketamine added: the health timeline now supports it".
- Checked 2026-10-20. URLs: https://apps.apple.com/us/app/id1158895079 ; https://itunes.apple.com/lookup?id=1158895079&country=us

## 3. Nomo - Sobriety Clocks

- Exact name: **Nomo - Sobriety Clocks** (store title has two spaces: "Nomo -  Sobriety Clocks")
- Developer: seller Anthony Stech; Developer field Parker Stech (privacy section also says Parker Stech); copyright SayNomo.com
- URL: https://apps.apple.com/us/app/id566975787 | ID 566975787
- Price: Free. IAPs: none listed on the page (no In-App Purchases row).
- Free tier: Not stated. Description: "Your clocks are completely private by default" and "Nomo has tons of optional features".
- Platforms: iPhone iOS 17.0+; iPad (iPadOS 17.0+); Mac (macOS 14.0+, Apple M1+); Apple Vision. Apple Watch: not listed. Minimum iOS 17.0.
- Rating (US): 4.79 from 16,718 (lookup; search 16,725)
- Current version/date: 8.1.8, 2026-10-07. First release 2012 (2012-10-09). Note: 8.1.6/8.1.7 (Sept 2026) "Rebuilt the whole app natively for iOS".
- Key features (description): "Create as many sobriety clocks as you need"; accountability partners; share selected clocks; notify partners when tempted; notifications when a clock is reset; progress breakdown to the minute; "how much money you've saved"; "Earn tokens when you reach certain milestones"; encouragement wall; check-in button; daily inventory (morning and evening check-ins); "Mini-distraction exercises"; PIN and Face/Touch ID lock; journaling (release notes mention journal entries). Clock time unit can be changed to seconds, minutes, hours, weeks, months, years (7.5.163). Quick Reset, QR code and link sharing (7.9.163). Guest login (7.9.167).
- Widgets: only through a separate companion app, **Nomo Widgets** (id6753310758, seller Anthony Stech, $1.99 per lookup, iOS 18.6+, 177 ratings, 4.68, privacy label "Data Not Collected"). Its notes: Home Screen and Lock Screen widgets (1.1.5, 2025-10-28); display name, units, "money, hours, and calories saved". Nomo 7.5.112 notes: "Widgets - The Nomo Widget app is a separate app, but integrates directly with your clocks. It does cost money, but I made it so it will be free on the first Sunday of every month for those who can't pay." StandBy and Live Activities: Not stated.
- What it counts: unlimited clocks for any habit (long category list incl. alcohol, nicotine, drugs, gambling, social media, etc.). Money saved: yes. Milestones: yes (tokens). Journaling: yes. Community: yes (encouragement wall, Connect wall, partners, private messaging). Counter with optional extras, not a program.
- Privacy label: "Data Linked to You": Contact Info, User Content, Identifiers. "Data Not Linked to You": User Content.
- Age rating 18+ (Frequent: Alcohol, Tobacco, Drug Use or References; Contains: Advertising, Messaging and Chat, User-Generated Content, Health or Wellness Topics).
- Best for: an indie, no-subscription counter with accountability partners.
- Limits stated: account or guest login; widgets need the separate paid app; no Apple Watch listed; requires iOS 17.
- Claims to avoid (quoted): "I'm just a guy in recovery who made Nomo as a tool to keep me on track"; "I hope it's a valuable tool for you in your recovery."; "Nomo is perfect for anyone recovering from Alcohol, ..." (long list incl. self-harm, depression, relationships).
- Checked 2026-10-20. URLs: https://apps.apple.com/us/app/id566975787 ; https://itunes.apple.com/lookup?id=566975787&country=us ; https://apps.apple.com/us/app/id6753310758 ; https://itunes.apple.com/lookup?id=6753310758&country=us

## 4. Sober: Sobriety Tracker (Red Penguin)

- Exact name: **Sober: Sobriety Tracker**
- Developer: seller Red Penguin LLC; Developer field Red Penguin LLC
- URL: https://apps.apple.com/us/app/id863872931 | ID 863872931
- Price: Free
- IAPs as listed: Sober Premium $5.99; Sober Premium $39.99; Annual Premium $39.99. Release notes (12.2.0) mention "free trial, monthly, or yearly plan". No weekly or lifetime label.
- Free tier: Not stated. Guest users can access "core features immediately" (11.6.0 notes).
- Platforms: iPhone iOS 16.4+; iPad (iPadOS 16.4+); Mac (macOS 12.0+, Apple M1+); Apple Vision. Apple Watch: not listed. Minimum iOS 16.4.
- Rating (US): 4.75 from 7,852
- Current version/date: 12.3.0, 2026-09-29. First release 2014 (2014-06-22)
- Key features (description "Core Features"): Sobriety Tracker; Sober Counter and streaks; "Sobriety Calculator – See how much time and money you've saved"; motivational messages; "Relapse Support Tools"; anonymous community; progress insights. Release notes: Insights screen (money, time, calories saved; sleep, mood, urge intensity), offline mode (12.0.0), mood check-in, meeting lists, community follows and GIFs (12.3.0), multiple trackers by drink type (10.32.0), currency setting (11.3.0). Journaling: not stated as such (mood check-in and daily readings/pledge).
- Widgets: yes, "Days counter widgets" (10.31.1: "Keep celebrating your progress right from your home screen"); 12.2.0 "Widgets stay in sync with that same count." Lock Screen, StandBy, Live Activities: Not stated.
- What it counts: multiple trackers (alcohol-focused plus other). Money saved: yes. Milestones: yes. Community: yes. Closer to a counter plus daily-practice app.
- Privacy label: "Data Used to Track You": Identifiers. "Data Linked to You": Identifiers, Usage Data. "Data Not Linked to You": Contact Info, Diagnostics.
- Age rating 18+ (Frequent: Alcohol, Tobacco, Drug Use or References; Infrequent: Medical Treatment information; Contains: Advertising, Messaging and Chat, User-Generated Content, Health or Wellness Topics).
- Best for: someone who wants streaks, insights and a community with meeting lists.
- Limits stated: Not stated.
- Claims to avoid (quoted): "Developed with a Harvard-educated Licensed Chemical Dependency Counselor with 32+ years of sobriety, Sober is built on proven techniques to help you stay accountable and achieve lasting change."; "built for real results"; "Benefits of Staying Sober: Better sleep and increased energy / Improved focus and mental clarity / ... Better physical and emotional health"; "Relapse Support Tools – Manage urges and avoid setbacks".
- Checked 2026-10-20. URLs: https://apps.apple.com/us/app/id863872931 ; https://itunes.apple.com/lookup?id=863872931&country=us

## 5. Sober SideKick: Quit Addiction

- Exact name: **Sober SideKick: Quit Addiction** (description writes "Sober Sidekick")
- Developer: seller Sidekick Mobile Technologies Inc.; Developer field Chris Thompson
- URL: https://apps.apple.com/us/app/id1448251580 | ID 1448251580
- Price: Free. IAPs: none listed on the page. Subscription or free-tier details: Not stated.
- Platforms: iPhone iOS 17.0+; iPad (iPadOS 17.0+); Mac (macOS 14.0+, Apple M1+); Apple Vision. Apple Watch: not listed. Minimum iOS 17.0.
- Rating (US): 4.83 from 8,063
- Current version/date: 5.9.3.4, 2026-10-08. First release 2019 (2019-01-27). Release notes for every 2026 version read only "Minor Bug Fixes. You're Never Alone :)".
- Key features (description): sobriety tracker and counter (days, weeks, months, years); milestones ("one day, 30 days, 60 days, and more"); anonymous social network with posts, empathy badges and direct messages; AA/NA meetings via Zoom 24/7; motivational content and blogs; "Addiction Recovery Counselors are available when you need help"; treatment option listings. Money saved, journaling: Not stated.
- Widgets, Lock Screen, StandBy, Live Activities: Not stated (no mention in description or any listed version notes).
- What it counts: alcohol and drugs recovery, number of trackers Not stated. Community-first app with resources, not a program.
- Privacy label: "Data Not Linked to You": Purchases, Contact Info, User Content, Identifiers, Usage Data, Diagnostics (no linked or tracking categories).
- Age rating 18+ (Frequent: Alcohol, Tobacco, Drug Use or References; Contains: Unrestricted Web Access, Messaging and Chat, User-Generated Content). Languages: English and 23 more.
- Best for: someone who mainly wants peer community and meeting access, with a basic counter.
- Limits stated: Not stated.
- Claims to avoid (quoted): "Quit drinking and receive help: AA support is available every time you reach out, guaranteed!"; "Addiction Recovery Counselors are available when you need help"; "Alcohol addiction is fed in isolation."; "Receive guidance on how to stay sober and start your recovery journey today".
- Checked 2026-10-20. URLs: https://apps.apple.com/us/app/id1448251580 ; https://itunes.apple.com/lookup?id=1448251580&country=us

## 6. Sunflower - Quit Any Addiction

- Exact name: **Sunflower - Quit Any Addiction**
- Developer: seller Koby Empire, Inc; Developer field Koby Conrad
- URL: https://apps.apple.com/us/app/id1547099435 | ID 1547099435
- Price: Free
- IAPs as listed (verbatim names): Monthly $8.95; Plus $34.95; Sunflower Plus $12.99; Plus $3.95; Plus $34.95; Plus $8.95; Sunflower Subscription $3.99; Plus $2.95; Plus $44.95; Plus $8.95. Only "Monthly" carries a period label; no weekly, yearly or lifetime labels.
- Free tier (verbatim): "*Note: A subscription is required to use certain features, like unlimited messaging with your AI sponsor." Other limits: Not stated.
- Platforms: iPhone iOS 16.4+; iPad (iPadOS 16.4+); Mac (macOS 12.0+, Apple M1+); Apple Vision. Apple Watch: not listed. Minimum iOS 16.4.
- Rating (US): 4.84 from 6,307
- Current version/date: 1.6.0, 2026-10-19. First release 2021 (2021-01-06)
- Key features (description): "Sober Days Clean Tracker" (a sunflower for every day); "AI Sponsor" to talk to 24/7 ("Sam"); milestone tracker (one second to ten years); reset quit date; exercises; community; guided journaling exercises. Supports "all substance types". Money saved: Not stated.
- Widgets, Lock Screen, StandBy, Live Activities: Not stated.
- Counts: any substance, tracker count Not stated. Counter plus AI coaching/exercises (leans coaching app).
- Privacy label: "Data Used to Track You": Usage Data. "Data Not Linked to You": Usage Data.
- Age rating 18+ (Frequent: Alcohol, Tobacco, Drug Use or References; Contains: User-Generated Content, Health or Wellness Topics).
- Best for: someone who wants a gamified counter with an AI chat companion.
- Limits stated: AI chat is capped without subscription; English only.
- Claims to avoid (quoted): "This helps your brain associate sobriety with reward."; "Get an AI Sponsor to talk to 24/7 to help you stay sober. Walk through cravings"; "Learn about the common fallacies of an addicted mind and how to overcome them"; "your body regaining its health". App's own disclaimer: "This app is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified healthcare provider..." and "...not a substitute for professional mental health care."
- Checked 2026-10-20. URLs: https://apps.apple.com/us/app/id1547099435 ; https://itunes.apple.com/lookup?id=1547099435&country=us

---

## Honorable mentions and dropped apps (shorter records)

### Days Since: Quit Habit Tracker (id1445348921)
- Seller/Developer: A Couple of Friends OOD. Free. Rating 4.82 from 19,499. Version 4.1.3, 2026-10-13. First release 2019. Minimum iOS 16.6.
- Compatibility: iPhone, Mac (M1+), Apple Vision, Apple Watch (watchOS 10.0+). iPad: not listed.
- IAPs: Count Up Club - Yearly $17.99; Count Up Club - Monthly $5.99; Count Up Club - Monthly $2.99; Count Up Club - Yearly $17.99; Count Up Club - Lifetime $49.99; Premium - Yearly $24.99 (x2); Premium - Monthly $7.99; Premium - Monthly $9.99; (DISCOUNT) Count Up Club $11.99. Lifetime label exists.
- Description: "Create a counter for each habit that you are trying to get rid of." Generic, not sobriety-specific. Notes: Home Screen widget for Goals (4.1.3), Achievements (4.1.0), automatic iCloud backups (4.0.9), Liquid Glass (4.0.6). Lock Screen, StandBy, Live Activities: Not stated.
- Privacy: "Data Not Linked to You": Usage Data, Diagnostics. Age 13+. No health claims in description.
- Checked 2026-10-20: page and lookup for id1445348921.

### Quitzilla: Quit Tracker (id1533076568)
- Seller/Developer: Andrii Hula. Free. Rating 4.78 from 1,527. Version 2.1, 2026-09-24. First release 2020. Minimum iOS 26.0, iPhone only.
- IAPs: 1 Month $5.99; 1 Year $29.99 (x3 entries); 1 Year $39.99; 1 Month $7.99; 1 Week $5.99; Lifetime $89.99. Weekly and lifetime labels exist.
- Description: track multiple habits, money-saved "rewards", motivation reasons, quote of the day, statistics. Notes: Home Screen widgets incl. Quote of the Day and My Reasons (2.1), Lock Screen widgets for counters (2.0), CSV export (2.0), earlier home screen widget (1.2). Apple Watch: not listed. StandBy and Live Activities: Not stated.
- Privacy: "Data Not Linked to You": Purchases, Usage Data, Diagnostics. Age 13+.
- Checked 2026-10-20: page and lookup for id1533076568.

### Reframe: Drink Less & Thrive (id1485756576) - program, drop
- Seller Glucobit Inc. Free download. Rating 4.73 from 45,197. Version 3.9.96, 2026-10-15. First release 2020. iOS 16.4+, iPhone, Apple Vision, Apple Watch (watchOS 10.6+).
- IAPs: Reframe Access (Monthly) $13.99; Reframe Silver (Monthly) $24.99; Reframe Silver (Annual) $119.99; Reframe Access (Yearly) $79.99; Reframe Premium $99.99; Reframe (Annual) $99.99; Reframe (Annual) $119.99; Reframe (Monthly) $19.99; Reframe (Annual) $59.99; Reframe (Annual) $79.99. Description: "Try Reframe FREE for 7 days".
- It is a program: "core 160-day, evidence-based, education program", premium "Thrive Coaching" with "1:1 access to a certified recovery coach". Privacy: Data Used to Track You (Identifiers); Linked (Identifiers); Not Linked (Location, Contact Info, User Content, Identifiers, Usage Data, Diagnostics).
- Claims to avoid: "#1 alcohol reduction app"; "Reframe's neuroscience approach can help you change the way alcohol shows up in your life."; "evidence-based".

### Sunnyside: Drink Less Alcohol (id1593489083) - moderation, drop
- Seller Cutback Coach, Inc. (Developer field Cutback Coach Inc.). Free download. Rating 4.76 from 2,320. Version 1.100.1, 2026-10-14. First release 2022. iOS 15.1+, iPhone, iPod touch, Apple Vision.
- IAPs: Sunnyside Membership $99.99; Sunnyside Premium Membership $299.00. 15-day free trial. Self-description: "focused on mindful drinking and moderation, not sobriety."
- Privacy: "Data Linked to You": Contact Info, User Content, Identifiers, Usage Data, Sensitive Info, Diagnostics.
- Claims to avoid: "Drink 29% less alcohol every week", "Reduce anxiety and improve overall wellness", "Science-backed", "advisory board of medical and habit change experts".

### Loosid Recovery & Sober App (id1413514350) - social/dating, drop
- Seller Loosid App LLC. Free. Rating 4.67 from 7,218. Version 3.25.3, 2026-10-10. First release 2018. iOS 15.1+, iPhone, iPod touch, Mac, Apple Vision. Age 16+.
- IAPs: Dating Pro 1 Month $19.99; Sober Plus 1 Month $12.99; SAM 1 Month $19.99; SAM Premium $59.99; SAM 6 Months $79.99; SAM 3 Months $29.99; SAM Discount $59.99; SAM 1 Week $9.99; Dating Pro 3 Months $44.99; SAM Discount $29.99.
- Description includes: sobriety tracker, community, dating, "crisis hotline for immediate help". Privacy: Linked: Location, Contact Info, User Content, Identifiers; Not Linked: Diagnostics.

### Smoke Free - Quit Smoking Now (id577767592) - smoking only, drop
- Seller 23 Ltd. Free. Rating 4.77 from 57,279. Version 6.4.51, 2026-10-03. First release 2013. iOS 16.0+, iPhone, Apple Vision, Apple Watch (watchOS 7.4+).
- IAPs: Essential pack $0.99; Smoke Free Pro - Bronze $6.99; Smoke Free Pro - Bronze $9.99; Smoke Free Pro Experts Monthly $9.99; Supporters club $29.99; Smoke Free Complete $29.99; Money Back Guarantee $49.99; Smoke Free Complete (upgrade) $23.99; Supporters club (silver) $19.99; Smoke Free Pro - Bronze $209.99.
- Claims to avoid: "tools that double your chance of success", "the app that science built", "proven to double your chances of quitting". Privacy Linked includes Health & Fitness, Purchases, Location, Sensitive Info.

### Sobriety Counter Stop Drinking / "EasyQuit" (id1536343358) - weak, drop
- Seller Mario Herzberg. Free. Rating 4.69 from 2,873. Version 1.8, 2026-09-21 ("updated several libraries"). First release 2020. iOS 15.6+, iPhone, iPad, Mac; no Apple Watch.
- Description: "quit slowly" mode, "No log in, no collection or selling of your sensitive data ... Your data is saved locally on your phone." Privacy label nevertheless shows "Data Used to Track You": Identifiers, Usage Data. Age rating lists Advertising.

---

## Quick comparison (facts from fetched pages)

| App | Ratings (US) | Version / date | Min iOS | Watch (compat) | iPad | Widgets (release notes) | IAP labels |
|---|---|---|---|---|---|---|---|
| I Am Sober | 4.88 / 189K | 8.8.5, 2026-10-19 | 15.1 | Yes, watchOS 9.0 | Not listed | Not stated | 1, 6, 12 Months |
| Sober Time | 4.85 / 42.9K | 4.4.08, 2026-10-15 | 17.0 | Yes, watchOS 11.1 | Yes | Home, Lock, watch face | Premium Monthly, Annual |
| Nomo | 4.79 / 16.7K | 8.1.8, 2026-10-07 | 17.0 | No | Yes | Via separate $1.99 app (Home, Lock) | No IAPs listed |
| Sober: Sobriety Tracker | 4.75 / 7.9K | 12.3.0, 2026-09-29 | 16.4 | No | Yes | "Days counter widgets" | Premium, Annual Premium |
| Sober SideKick | 4.83 / 8.1K | 5.9.3.4, 2026-10-08 | 17.0 | No | Yes | Not stated | No IAPs listed |
| Sunflower | 4.84 / 6.3K | 1.6.0, 2026-10-19 | 16.4 | No | Yes | Not stated | Monthly, Plus, Subscription |

Live Activities and StandBy: Not stated for any of the apps above.

Checked 2026-10-20.
