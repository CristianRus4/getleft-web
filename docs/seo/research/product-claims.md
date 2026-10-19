# What the website may and may not claim (verified 2026-10-19)

Source: the Left app repo (`/Users/cristian/Developer/Apps/Left-app`, read-only), `ProductionFeatureGate.swift`,
`OwnPaywallSupport.swift`, `FreeItemQuotaManager.swift`, `LeftWidgetsBundle.swift`, `project.pbxproj`.

## Shipped and safe to describe

- Time Left grids: year, month, week, day, hour, minute and your life (lifespan). Free.
- Since: habits, streaks and Aims (Aims are countable goals, additive or reductive).
- Ahead: countdowns to dates.
- Free tier: **2 each** of Ahead dates, habits, streaks and Aims (lifetime creations). Paid tiers are unlimited.
- Widgets (free): Home Screen and Lock Screen widgets, StandBy through system widgets. Say "dozens of widgets"
  or "35+ widgets and Live Activities" (29 widget kinds + 6 Live Activities). The home page's existing "20+" stays.
- Live Activities for habits, countdowns and fasting.
- Left Wallpaper through the Shortcuts app (a lock screen wallpaper that updates itself). Free.
- Apple Watch app and complications (configurable in the watch face editor).
- Siri, Shortcuts and App Intents for habits, streaks, Aims, Ahead and the wallpaper.
- Paid (Left Premium): Planner (Premium level), fasting, Apple Health automatic tracking, friends and shared
  dates (Joint Ahead, Shared Since), custom lifespan, alternative icons, games.
- Planner can connect Todoist.
- Requires iOS 26 and watchOS 26.
- Languages: the app ships 41 locales.

## Never claim

- Mood, mood logging, World Mood globe (hidden in production).
- Time Between (hidden in production).
- A Control Center control (not registered).
- An iPad app or a Mac app (the app is iPhone-only; iPad and Mac support articles cover widgets only).
- Prices, trial lengths or discounts (remote config; the safe line is "Prices are shown in the app before you buy").
- "Free forever", or that Planner, fasting, friends, Health tracking or games are free.
- Unlimited free countdowns, habits, streaks or Aims.
- Any user count, download count or revenue figure that is not already on the site (existing stats stay untouched).
- New testimonials or reviews of any kind.
- Android availability (Left is iPhone-only; there is a web version at /web).
- Focus: keep existing wording, add no new Focus promises until the owner confirms it ships in 2026.10.

## Brand and terms

- The product name is always **Left** (never translated, Latin script). Plan name: Left Premium.
- Feature names: Time Left, Ahead, Since, Habits, Streaks, Aims, Planner, Wallpaper, Friends.
- Glossary per locale: `docs/translation.config.json`.
