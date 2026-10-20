# Research: Widgy alternatives (target query "Widgy alternatives" / "Widgy alternative iOS")

Checked 2026-10-20. App facts come from the US App Store page (`https://apps.apple.com/us/app/id<ID>`) and the iTunes API (`https://itunes.apple.com/lookup?id=<ID>&country=us`) fetched today. "Not stated" means the listing does not say. Nothing here says an app lacks a feature unless its listing says so.

Source caveats:
- Today the lookup endpoint returned HTTP 403 for seven IDs (1555600758, 1405459188, 1494386093, 1641143233, 1524227906, 6780139153, 1453273600) after repeated retries over about 15 minutes, while returning 200 for the others. For those seven, the same record (rating, version, dates, notes, description) was read from the iTunes Search API (`https://itunes.apple.com/search?term=<name>&country=us&entity=software`), fetched 2026-10-20. Marked "(search API)" below.
- The App Store page shows at most 10 in-app purchase rows; repeated names are other price points. The listing does not say which price is monthly or yearly unless the name does.
- Privacy label: the page shows only the category headings (for example "Data Used to Track You"), not the per-type data lists, so those lists are "not found on page".
- Widgy's developer site: the only developer link on the listing is http://woodsign.hr/ (secondary source, fetched 2026-10-20). It is a 2016 page that says only "A company by dude behind the Widgy app" and links to the App Store listing. It says nothing about features. widgy.app does not resolve. The r/widgy subreddit (about 72k members per a search snippet from gummysearch.com, not opened) is a community, not a source.

## Recommendation

Widgy fans want layers, data sources, scripting and Lock Screen/Watch reach. Strongest 6 to feature, all current (updated within 12 months):

1. **Widgy** (1524540481), the subject. 4.65 (26,131), updated 2026-09-17 (27.0.1). Layer editor, community designs, Lock Screen, Watchy, Live Activities, Async JavaScript mentioned in release notes, Data Not Collected. Slot-unlock pricing.
2. **ScriptWidget** (1555600758). 4.53 (99), updated 2026-09-29. The closest scripting match: "Build your own iPhone and iPad widgets with JSX, live previews, and built-in APIs." Data Not Collected, no IAP listed. Tiny review count.
3. **Charty for Shortcuts** (1494386093). 4.67 (342), updated 2026-06-23. Shortcuts-driven chart widgets; "Charty 2.0 is a complete rebuild". Data Not Collected. Moved to subscription per its notes.
4. **Dashlet: Custom Data Widgets** (6780139153). No ratings yet (first release 2026-07-15), updated 2026-10-12. The only listing built around HTTPS/JSON/RSS data sources with auth headers, Home Screen, Lock Screen and Apple Watch, "No coding". Mention with the caveat that it is brand new and unrated.
5. **Widgetsmith** (1523682319). 4.61 (776,423), updated 2026-09-28. The mainstream option: Lock Screen, Actions (run Shortcuts), time-of-day switching, weather and activity data. No Watch listed.
6. **Launcher with Multiple Widgets** (905099592). 4.51 (3,377), updated 2026-09-22. Lock Screen, Live Activities and Dynamic Island, Apple Watch, Shortcut launchers. A different job (launching), but the best match for Widgy's Live Activities and Watch reach.

Optional 7th (more decorative, less Widgy-like): **Color Widgets** (1531594277, 4.60 / 526,929, updated 2026-09-15) or **iScreen** (1534704608, 4.74 / 153,086, updated 2026-10-15) for people who want ready-made designs rather than building.

Documented but dropped or demoted:
- **Scriptable** (1405459188): the best-known JavaScript widget app ("write your own widgets using JavaScript"), 4.68 (3,960), but last updated 2024-09-30 (over 12 months; notes: "Fixes an issue where background images were not shown in tintable widgets on iOS 18"). Drop per the 12-month rule; could be mentioned as an aside.
- **Data Jar** (1453273600): Shortcuts data store, 4.87 (868), last updated 2022-01-11. Stale.
- **Widget Box Interactive Widgets** (1527561558): last updated 2024-06-24 (search API). Stale.
- **Widget Wizard** (1524227906): current (2026-04-19) but only 4.21 (57) and requires iOS 26.0; health/agenda/countdown widgets with Pro for customization. Too small and too restrictive to feature.
- **Lock Screen 27 - Top Widgets** (1641143233): current (2026-10-19, 4.53 / 7,806) but the listing is only Custom Text & Emoji, shortcuts, contacts, icons, wallpapers; privacy label includes tracking. Poor Widgy fit.
- **Top Widgets+** (6446477593, 4.61 / 9,302) and **Brass** (1533158013, 4.56 / 188,261, updated 2026-07-14): theme-shop apps, not builders; Brass copy is iOS 14 era, both have "Data Used to Track You".
- **Widgeridoo**: not found in the US store search. **Data Widgets**: no app by that name; the search returned unrelated data-usage meters (DataWidget, Data Widget: remaining data).
- Photo Widget (1530149106) is in the existing Widgetsmith sheet; kept below as a reference block because it lists Apple Watch.

## Competition: what ranks for "Widgy alternatives"

WebSearch (2026-10-20, two queries: "Widgy alternative reddit", "Widgy alternatives iOS"). Titles and domains only:
- Widgy Widgets Alternatives (p1 and p2) - alternativeto.net
- Widgy Software Pricing, Alternatives & More 2026 - capterra.com (a different "Widgy" product, not the iOS app)
- gummysearch.com/r/widgy (r/widgy subreddit stats)
- apps like Widgy Widgets: Home/Lock/Watch - worldsapps.com
- Widgy: Ultimative Widget-App für Bastler - appgefahren.de
- Widgy Widgets: Home/Lock/Watch (App Store short link) - apple.co
- Widgy softpedia forum thread, mrmad.com.tw, iphones.ru, lifehacker.jp (reviews, not alternatives)
- Sideloaded "Widgy IPA" sites (senumy.com): ignore, unofficial.
No Reddit thread comparing Widgy to other apps appeared. AlternativeTo's list leads with ViBox (not iOS), Eww, XWidget (desktop), WidgetClub and OneWidget. There is no dedicated iOS "Widgy alternatives" listicle in the visible results, so the SERP is thin.

---

## 1. Widgy Widgets: Home/Lock/Watch (the subject)

- **App Store name:** Widgy Widgets: Home/Lock/Watch
- **Developer (seller):** Woodsign jdoo
- **ID / URL:** 1524540481 - https://apps.apple.com/us/app/id1524540481
- **Price:** Free
- **In-App Purchases (US, as listed):** Small/Medium/Large Slots $7.99; Unlock Lock Screen Slots $7.99; Watchy Slots $7.99; XL Slots And iPad Transparency $0.99; Widgy Tip $4.99, $0.99, $9.99, $1.99, $2.99 (five tip rows). No subscription is listed. Description: "Try Widgy for free. Optional in-app purchases unlock additional widget slots and features."
- **Free tier limits:** exact numbers of free slots: Not stated.
- **Platforms (Compatibility):** iPhone iOS 17.0+; iPad iPadOS 17.0+; Mac macOS 13.0+; Apple Vision visionOS 1.0+; Apple Watch watchOS 10.0+. 22 languages.
- **Rating (US, lookup):** 4.65 from 26,131. **Version:** 27.0.1, 2026-09-17. **First release:** 2020-10-10.
- **Key features (description):**
  - "START WITH A COMMUNITY DESIGN... Import a design, personalize it, or create your own from scratch."
  - "Arrange text, photos, symbols, shapes and charts in layers. Adjust colors, fonts, gradients and layout while you see the result in the editor."
  - "Create clocks, weather displays, calendars and countdowns. Bring together reminders, activity data and other information..."
  - "Create Lock Screen widgets and personalize your Apple Watch with Watchy. Explore Live Activities and Dynamic Island layouts on supported devices."
  - "Use charts, gauges and custom data sources to create detailed dashboards. Share your widgets with a QR code, a link or a file."
  - Apple Health data with permission.
- **Release notes (27.0.1, 2026-09-17):** iCloud Sync improvements ("verified transfers, preserved conflicts... visible sync status"); Tap Actions for Dynamic Island, Control Center, Live Activity and Picture in Picture; Watchy custom fonts transferable to Apple Watch; cryptocurrency picker; weather providers Open-Meteo, OpenWeather, MET Norway; fixed "Async JavaScript jobs completing twice, returning a late result".
- **Version history:**
  - 27 (2026-09-13): "Widget Variables", new layers (Apple Charts, Linear Gauge, Mini Charts, List, Live Progress), "Live Animations: Choose from 44 visual effects", "Smart Colors & Symbols", "Custom Fonts", "Weather Providers: Choose MET, Open-Meteo or OpenWeather", "iPhone XL Widgets: Eight XL slots", "Widget Schedules: Change widgets throughout the day", "Web Data for Charts: Use JSON/JavaScript and compare series", "Text Replacement: Partial, exact or Regex matching", "Custom Web Requests: Custom authentication", "Automatic iCloud Sync", "Last.fm Support".
  - 26.1.1 / 26.1 (2025-11): transparency fixes and true transparency toggle for tinted/glass modes.
  - 26.0 (2025-09-16): Liquid Glass interface, iPad resizable windows.
  - 4.20 (2025-08-30): "JavaScript Upgrade: Added support for btoa and atob."
  - 4.1 (2025-08-06): Spotify data, Control Center widgets, Explore search, iCloud backups.
- **Privacy label:** Data Not Collected ("The developer does not collect any data from this app.").
- **Best for (judgement):** people who want to design widgets layer by layer with data sources and some scripting, across Home, Lock, Watch and Live Activities.
- **Limiting, per listing:** Lock Screen, Watchy and S/M/L slots are separate paid unlocks; "Features vary by device and operating system." The description does not use the word "JavaScript" or "scripting"; only the release notes do. StandBy: not stated.
- **Checked 2026-10-20.** Fetched: https://apps.apple.com/us/app/id1524540481 ; https://itunes.apple.com/lookup?id=1524540481&country=us ; http://woodsign.hr/ (secondary).

## 2. ScriptWidget

- **App Store name:** ScriptWidget (page title "ScriptWidget App")
- **Developer (seller):** 峰 朱
- **ID / URL:** 1555600758 - https://apps.apple.com/us/app/id1555600758
- **Price:** Free
- **In-App Purchases:** none listed on the page.
- **Free tier limits:** Not stated.
- **Platforms (Compatibility):** iPhone iOS 16.0+; iPad iPadOS 16.0+; Mac macOS 26.0+; Apple Vision visionOS 1.0+. Apple Watch: not listed.
- **Rating (US, search API):** 4.53 from 99. **Version:** 27.1.0, 2026-09-29. **First release:** 2021-03-09.
- **Key features (description):** "Build your own iPhone and iPad widgets with JSX, live previews, and built-in APIs. Start from a template and make it yours." "JSX-Style Scripting", "Instant Preview: See your changes live as you code", "Build for both iOS and macOS with a single script", "Lightweight and Flexible: No need for heavy frameworks or external libraries", "Widgets run locally. Network and AI requests are used only for features you configure or permit." Audience: "Developers who want to customize their home screen."
- **Lock Screen widgets, StandBy, Live Activities, iCloud sync, ads:** Not stated.
- **Release notes (27.1.0):** "Refreshed the Studio welcome screen with the current ScriptWidget icon and updated the Dayvella link in More Apps."
- **Privacy label:** Data Not Collected.
- **Best for:** Widgy users who want to write code, not drag layers.
- **Limiting, per listing:** only 99 ratings; Mac requires macOS 26.0.
- **Checked 2026-10-20.** Fetched: https://apps.apple.com/us/app/id1555600758 ; iTunes search API record (lookup 403). Developer website linked on page: https://xnu.app/scriptwidget (not fetched).

## 3. Charty for Shortcuts

- **App Store name:** Charty for Shortcuts
- **Developer (seller):** Rapptor Desenvolvimento de Softwares LTDA
- **ID / URL:** 1494386093 - https://apps.apple.com/us/app/id1494386093
- **Price:** Free
- **In-App Purchases (US, as listed):** Charty Premium $4.99, $9.99, $1.99, $99.99; Large tip $4.99; Small tip $0.99; Medium tip $2.99. Release notes: "Charty is moving to a subscription model at $0.99/month or $9.99/year. If you've ever purchased Charty Premium, you keep full access to everything in 2.0 at no extra cost." The listing does not map the rows to periods.
- **Free tier limits (verbatim):** "FREE TO START Create unlimited charts with up to 2 series per chart - completely free. Unlock Charty Premium to access all 25 Shortcuts actions, unlimited series, full styling controls, area charts, CSV import, image export, widgets, and more."  Note: this says widgets are part of Premium.
- **Platforms (Compatibility):** iPhone iOS 18.0+; iPad iPadOS 18.0+; Mac macOS 15.0+ (Apple M1 or later); Apple Vision visionOS 2.0+. Apple Watch: not listed.
- **Rating (US, search API):** 4.67 from 342. **Version:** 2.0, 2026-06-23. **First release:** 2020-05-06.
- **Key features (description):** "Turn any data into stunning charts right from Apple Shortcuts." Bar, line, scatter, area, pie, donut, ring charts; "Display your charts as widgets that update automatically"; group, filter, accumulate, moving averages, trend lines, CSV import, image export; "16 built-in tutorials". "No coding required."
- **Release notes:** "complete rebuild... on SwiftUI using Apple's Swift Charts"; "Revamped Tutorials tab with downloadable example shortcuts and integrations with Data Jar, Toolbox Pro, Reminders"; French and Spanish localizations "temporarily removed".
- **Lock Screen widgets, StandBy, Live Activities, iCloud sync:** Not stated.
- **Privacy label:** Data Not Collected.
- **Best for:** Widgy users whose data lives in Shortcuts and who mainly want chart widgets.
- **Limiting, per listing:** charts only (not a general widget designer); widgets are a Premium feature; iOS 18.0 minimum.
- **Checked 2026-10-20.** Fetched: https://apps.apple.com/us/app/id1494386093 ; iTunes search API record (lookup 403).

## 4. Dashlet: Custom Data Widgets

- **App Store name:** Dashlet: Custom Data Widgets
- **Developer (seller):** Ziga Dolar
- **ID / URL:** 6780139153 - https://apps.apple.com/us/app/id6780139153
- **Price:** Free
- **In-App Purchases (US, as listed):** Dashlet Premium - Lifetime $19.99; Dashlet Premium (1 month) $0.99; Dashlet Premium (1 year) $9.99.
- **Free tier limits:** Not stated.
- **Platforms (Compatibility):** iPhone iOS 18.0+; iPad iPadOS 18.0+; Apple Watch watchOS 10.6+. Mac, Vision: not listed.
- **Rating (US, search API):** 0 ratings (none yet). **Version:** 1.8, 2026-10-12. **First release:** 2026-07-15.
- **Key features (description):** "Dashlet lets you build beautiful widgets from almost any online data source... on your Home Screen, Lock Screen, and Apple Watch. No coding. No accounts. No cloud." Connects HTTPS endpoints, JSON, XML/RSS and images; "Bearer tokens, Basic Authentication and custom headers"; "Secure Keychain storage"; "Browse your response, pick the fields you want... No JSON paths or scripting required." Widget types: Value, Dashboard, List, Image, Image + Text, Carousel, Charts and Gauges, Maps. Offline cache; request history and endpoint health. Example uses: Home Assistant, webcams, RSS, solar, server monitoring, package tracking.
- **Release notes (1.8):** "Set up a widget from a link, and send your own setups to anyone... Your tokens, passwords and locked header values never leave your device."
- **Live Activities, StandBy, iCloud sync:** Not stated.
- **Privacy label:** Data Not Collected.
- **Best for:** people who used Widgy's web data sources (JSON, RSS) and want a no-code, auth-capable data widget.
- **Limiting, per listing:** very new, no ratings to quote; not a layout designer.
- **Checked 2026-10-20.** Fetched: https://apps.apple.com/us/app/id6780139153 ; iTunes search API record (lookup 403).

## 5. Widgetsmith

- **App Store name:** Widgetsmith
- **Developer (seller):** Cross Forward Consulting, LLC
- **ID / URL:** 1523682319 - https://apps.apple.com/us/app/id1523682319
- **Price:** Free
- **In-App Purchases (US):** "Widgetsmith Premium" at $1.99, $19.99, $3.99, $29.99 (four rows with identical names; periods not labelled). Description says "optional premium subscription ... offered on a monthly or annual basis" (per the earlier sheet; page rows re-checked today).
- **Free tier limits (verbatim):** "Access to tide and weather data is only available to Widgetsmith Premium subscribers." Others: Not stated.
- **Platforms (Compatibility):** iPhone iOS 15.0+; iPad iPadOS 15.0+; iPod touch iOS 15.0+; Mac macOS 12.0+ (Apple M1 or later); Apple Vision visionOS 1.1+. Apple Watch: not listed.
- **Rating (US, lookup):** 4.61 from 776,423. **Version:** 8.7, 2026-09-28. **First release:** 2020-09-16.
- **Key features (description):** photos with filters and borders, photo galleries, "Customizable Date & Time Clocks", "Activity Tracking & Step Counting", "Countdown Timers", "Solar & Lunar Trackers", "Weather Conditions & Forecasts", "Time Zone Tracker". "You can build widgets with Actions to launch apps, run Shortcuts, send a text, and more, from your home screen or Control Center." Customizes the lock screen too. Wallpaper library and widget theming.
- **Release notes (8.7):** "curated collections of stock photos... tap the new Stock button".
- **Live Activities, StandBy, iCloud sync, scripting:** Not stated.
- **Privacy label:** Data Not Linked to You.
- **Best for:** the mainstream, polished alternative with weather, activity and Shortcuts actions.
- **Limiting:** Premium needed for weather and tide data; no free-form layer editor mentioned.
- **Checked 2026-10-20.** Fetched: https://apps.apple.com/us/app/id1523682319 ; https://itunes.apple.com/lookup?id=1523682319&country=us

## 6. Launcher with Multiple Widgets

- **App Store name:** Launcher with Multiple Widgets
- **Developer (seller):** Cromulent Labs, Inc
- **ID / URL:** 905099592 - https://apps.apple.com/us/app/id905099592
- **Price:** Free
- **In-App Purchases (US, as listed):** Pro Version $2.99; Unlock Multiple Widgets $1.99; Pro Version $2.99; Premium Version $14.99; Premium Version Discounted $4.99; Pro Version $1.99; Launcher Premium Yearly $7.99; Unlock Multiple Widgets $3.99; Launcher Premium Yearly $9.99; Buy Greg a Song $0.99.
- **Free tier limits:** Premium unlocks (verbatim list): "Change widget icons automatically based on day, time or location", "Change icon sizes from tiny to huge", "Remove icon labels", "Folders", "Stack widgets", "Backup and restore your launchers with iCloud", "Unlimited number of widgets!". Free: "Customize your icons and backgrounds with colors or images", "Import wallpaper to create simulated transparent widget backgrounds", Shortcut Launchers.
- **Platforms (Compatibility):** iPhone iOS 17.0+; iPad iPadOS 17.0+; Apple Vision visionOS 1.0+; Apple Watch watchOS 10.0+. Mac: not listed.
- **Rating (US, lookup):** 4.51 from 3,377. **Version:** 5.8.2, 2026-09-22. **First release:** 2014-09-17.
- **Key features (description):** "Home Screen, Lock Screen, Dynamic Island, and Apple Watch"; "LIVE ACTIVITIES WIDGETS ON YOUR LOCK SCREEN AND DYNAMIC ISLAND... keep your Live Activities widget running 24/7"; Home Screen widgets in small to extra large portrait; circular and rectangular Lock Screen widgets; Quick Widget (iOS 27).
- **Release notes:** iOS 27 extra large portrait widgets, "New Liquid Glass interface".
- **Privacy label:** Data Not Linked to You.
- **Best for:** tappable launchers on Home, Lock Screen, Dynamic Island and Watch (not data display).
- **Limiting:** a launcher, not a design or data tool.
- **Checked 2026-10-20.** Fetched: https://apps.apple.com/us/app/id905099592 ; https://itunes.apple.com/lookup?id=905099592&country=us

## 7. Color Widgets

- **App Store name:** Color Widgets
- **Developer (seller):** Digital Charms, Inc.
- **ID / URL:** 1531594277 - https://apps.apple.com/us/app/id1531594277
- **Price:** Free
- **In-App Purchases (US):** "Color Widgets Pro" at $6.99, $29.99, $4.99, $6.99, $34.99, $49.99, $29.99, $34.99, $21.99, $24.99 (ten visible rows, periods not labelled).
- **Free tier limits:** "Enjoy Color Widgets for free, with an optional upgrade"; specifics Not stated. Description also says "UNLIMITED WIDGETS".
- **Platforms (Compatibility):** iPhone iOS 15.0+; iPad iPadOS 15.0+; iPod touch; Mac macOS 12.0+; Apple Vision visionOS 1.0+. Apple Watch: not listed. 17 languages.
- **Rating (US, lookup):** 4.60 from 526,929. **Version:** 9.0.0, 2026-09-15. **First release:** 2020-09-17.
- **Key features (description):** "Browse thousands of predesigned widgets or, better yet, design your own with the easy-to-use widget customizer"; Home Screen and Lock Screen; photo, time/date/battery, countdown, weather, Apple Music & Spotify, calendar, custom text, activity, solar and moon widgets; "15,000+ THEMES & WALLPAPERS"; icon packs.
- **Release notes:** iOS 27 XL widget size, Lock Screen Lunar widgets.
- **Privacy label:** Data Used to Track You; Data Linked to You; Data Not Linked to You.
- **Best for:** ready-made themed designs.
- **Limiting:** scripting, layer editing, data sources: Not stated.
- **Checked 2026-10-20.** Fetched: https://apps.apple.com/us/app/id1531594277 ; https://itunes.apple.com/lookup?id=1531594277&country=us

## 8. iScreen - Widgets & Wallpaper

- **App Store name:** iScreen - Widgets & Wallpaper
- **Developer (seller):** Xiamen ShenZhuo Information Technology Co., Ltd.
- **ID / URL:** 1534704608 - https://apps.apple.com/us/app/id1534704608
- **Price:** Free
- **In-App Purchases (US):** Monthly VIP $7.99; Yearly VIP $19.99; Exclusive VIP-Monthly $7.99; Super VIP-Yearly $9.99; Weekly VIP $1.99; Privileged VIP-Monthly $7.99; Permanent VIP $23.99; Quarterly VIP $3.99; Noble VIP-Monthly $6.99; Exclusive VIP-Yearly $19.99.
- **Free tier limits:** Not stated.
- **Platforms (Compatibility):** iPhone iOS 15.0+; iPad iPadOS 15.0+; iPod touch; Apple Vision visionOS 1.0+. Mac and Apple Watch: not listed. 5 languages.
- **Rating (US, lookup):** 4.74 from 153,086. **Version:** 5.1.15, 2026-10-15. **First release:** 2020-11-25.
- **Key features (description):** "Upgraded 4x6 ExtraLarge Widget... Also DIY your own personalized ExtraLarge Widget"; Liquid Glass widgets; space and DIY wallpapers; Control Center styles; widgets such as Dynamic Panel, Photo Wall, Weather, Battery, Countdown, Calendar, Digital Clock; lock screen styles.
- **Privacy label:** Data Used to Track You; Data Not Linked to You.
- **Best for:** decorative, ready-made DIY widgets and wallpapers.
- **Limiting:** no data-source or scripting features in the listing.
- **Checked 2026-10-20.** Fetched: https://apps.apple.com/us/app/id1534704608 ; https://itunes.apple.com/lookup?id=1534704608&country=us

## 9. Photo Widget: Theme Wallpapers (reference)

- **Developer (seller):** Photo Widget Inc. **ID:** 1530149106 - https://apps.apple.com/us/app/id1530149106. Free.
- **IAP (US):** Monthly Subscription $6.99; Annual Subscription $24.99 (twice); theme purchase - basic $1.49; item purchase - basic $0.99; Plus Goods $2.39; Basic Goods $1.69; Simple Goods $0.99; PhotoWidget Pro $24.99 and $6.99.
- **Platforms:** iPhone iOS 16.0+; iPad; Mac macOS 13.0+ (M1+); Apple Vision; **Apple Watch watchOS 9.0+**.
- **Rating:** 4.65 from 168,847. **Version:** 3.33.0, 2026-10-14. **First release:** 2020-09-16.
- **Features (description):** Home Screen: PhotoWidget, D-Day (Countdown), Quotes, Battery, Calendar, Clock, Memo, To-Do List; Lock Screen: Animated, Inline, Shortcut, PhotoWidget, Battery, Calendar, Memo, D-Day.
- **Privacy:** Data Used to Track You; Data Not Linked to You.
- **Best for:** photo-first themes; no scripting or data sources stated.
- **Checked 2026-10-20.** Fetched: https://apps.apple.com/us/app/id1530149106 ; https://itunes.apple.com/lookup?id=1530149106&country=us

## Competitive angle for Left

- Widgy and its closest rivals (ScriptWidget, Dashlet, Charty) are build-it-yourself tools; their listings frame countdowns and clocks as one module among many, with the user designing the layout or data feed.
- Widgy's listing offers Lock Screen, Watch and Live Activities as separate slot unlocks ($7.99 each for Lock Screen and Watchy), while the mainstream apps (Widgetsmith, Color Widgets, iScreen) list ready-made designs plus Premium or VIP subscriptions.
- Four of the six recommended listings (Widgy, ScriptWidget, Dashlet, Charty) state Data Not Collected, which is a fair point of contrast with the theme-shop apps that list tracking.
