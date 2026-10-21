# Focus: what the shipped app does (read from source 2026-10-21, for CNTXT-886)

Source: the Left app repo, `/Users/cristian/Developer/Apps/Left-app` (read-only), at commit `1ff4340` (HEAD on 2026-10-21; Focus rework `fc46f54`, 2026-10-19).
All paths below are relative to that repo. Focus is in the code for v2026.11; `project.pbxproj` still says `MARKETING_VERSION = 2026.10`, so the release build has not been cut yet.

Rules for the site: describe Focus as shipped only from release day (see `docs/seo/focus-release-checklist.md`). Never mention Apple Watch (Left's watch app is unannounced, and the app has a Focus Watch page that must not be referenced). Never promise a price.

## Release status in the code

- `Left/Services/ProductionFeatureGate.swift`: `.focus` is commented out of `unreleasedFeatures` ("Ungated 2026-10-18 for Focus development"). With `productionMode = true`, Focus is therefore visible in a production build. The same file says to re-add it, and re-comment the two Focus registrations in `LeftWidgets/MiscWidgets/LeftWidgetsBundle.swift` (lines 36-37 `FocusWidget()` and 60-61 `FocusLiveActivityWidgetExtension()`), if Focus is not ready to ship. Both registrations are currently live.
- `AGENTS.md` ("Unreleased surfaces use `ProductionFeatureGate`") confirms the same.
- Check on release day that Focus is actually in the build before publishing (checklist step 1).

## Where it lives in the app

- A tool called **Focus**: `Left/Views/Tools/ToolsView.swift:258-262` (`case .focus` shows `FocusView()`), also reachable as a tab (`Left/App/ContentView.swift:463-473`, "choose your tools" mechanism).
- Deep link `left://focus` (`Left/App/LeftApp.swift:181`), used by the widget, the Live Activity and the phase notification.
- Settings: **Settings → Focus** (`Left/Views/Settings/SettingsView.swift:421-426`, `FocusSettingsDetailView`), and a Focus section in notification settings (`Left/Views/Settings/NotificationsSettingsView.swift:275-285`, toggle "Phase alerts").
- Colours on every surface: Focus is orange (`FF4F00`), both breaks are blue (`278CFF`) (`Left/Views/Tools/Focus/FocusModels.swift`, `FocusPalette`).

## Phases, durations and the cycle

Files: `Left/Views/Tools/Focus/FocusPreferencesStore.swift`, `FocusModels.swift`, `FocusSharedLogic.swift`, `FocusSettingsDetailView.swift`.

- Three phases: **Focus**, **Short break**, **Long break** (`FocusPhase`). The phase picker in the control card labels them "Focus", "Break", "Long break" (`FocusView.swift:phasePickerTitle`).
- Defaults: Focus **25 min**, short break **5 min**, long break **20 min**, long break after **4** focus sessions (`FocusPreferencesStore.swift:defaultWorkDurationMinutes` etc.).
- Ranges: **all three durations are 1 to 60 minutes**; focus sessions before the long break: **1 to 12** (`FocusPreferencesStore.swift`, `FocusSettingsDetailView.swift:55-82`). A phase can never be longer than 60 minutes, even after extending (`FocusTimerState.maximumPhaseDurationSeconds = 3600`, `FocusModels.swift`).
  - The current support article says 1-180 min focus and 1-120 min long break. That is wrong.
- Order: Focus → short break → Focus → … → after the Nth completed focus session a long break → back to Focus with the count reset (`FocusSharedLogic.swift:successor`).
- New durations apply to the next phase, never to a timer already in progress (`FocusSettingsDetailView.swift:63` footer; `FocusSharedLogic.applyPreferences` only touches an idle or not-yet-started phase).
- Durations can be changed in three places: Settings → Focus; the clock button in the control card (a "Durations" sheet with the same four steppers); and by dragging the timer before a session starts (see styles).
- Selecting a phase from the phase menu prepares it and resets the group's session count to 0 (`FocusSharedLogic.prepare`).

## Controls

File: `Left/Views/Tools/Focus/FocusView.swift`.

- **Start / Pause / Resume** (the big button). While a session is live, a second **End** button appears. **End** and **Skip** both end the current phase now and move to the next; elapsed active time is saved to history as a session. A phase that was never started can be skipped without a history entry (`FocusSharedLogic.skippedRecord`). The next phase always waits for Start after a skip or End, even with Continue automatically on (`FocusSharedLogic.swift` `advance(..., automaticallyStart: false)`).
- **Reset** (circular arrow, shown whenever the timer is not idle, including a prepared phase that has not started) **restarts the current phase** from its full length and keeps the group's session count. The time already run is discarded with no history entry. It does not reset the whole cycle (`FocusSharedLogic.restartCurrentPhase`). If the phase was running it keeps running.
- **Extend** (the **+** menu): **+5, +10, +15 or +20 minutes** to the current phase (running or paused) only, never beyond 60 minutes in total. It does not change the saved durations (`FocusView.swift:extend`, `FocusSharedLogic.extend`).
- **Phase menu**: switch between Focus, Break and Long break.
- **Clock button**: opens the durations sheet.
- **My focus** (top left): opens history. **Display options** (top right, list icon): choose the timer style.
- **Settings toggles** (`FocusSettingsDetailView.swift`):
  - **Phase notifications** (default on).
  - **Live Activity** (default on).
  - **Keep going when time ends** (default off): the timer counts up past zero ("overtime") until you skip. While it is on, **Continue automatically** is greyed out (`.disabled`) and has no effect; its stored value is not changed, so it can still show as on.
  - **Continue automatically** (default off): moves into the next focus or break phase without a Start tap. It is applied when the timer is next reconciled (app opened, or a Focus widget timeline refresh), not by a background process: with the app closed and no Focus widget installed, the next phase only starts when Left is opened (`FocusSharedLogic.reconcile` -> `advance` -> `start(at: date)`). The Live Activity draws the next phase locally from the old deadline. Don't claim it runs while the app is closed. Without it, the next phase is prepared and waits for Start.
- A session left **paused** from an earlier day expires at the next open: the focus time already banked is kept as a session, and the group and day strip start over for the new day (`FocusSharedLogic.freshDayState`, `expiredPausedRecord`). A session still running carries over midnight.
- Maximum 60 minutes per phase also means "Keep going" can run longer than 60 minutes (it counts up). Do not claim a cap on overtime.

## Timer styles

Files: `Left/Views/Tools/Focus/FocusTimerStyles.swift`, `FocusModels.swift` (`FocusTimerStyle`).

There are **four** styles, chosen from the **Display options** menu (top right). The default is Digital:

| Style (as named in the app) | What it is |
|---|---|
| **Digital** (default) | Large numeric countdown. Swipe up or down on it to change the duration, before a session starts. |
| **Clock** (`circle`) | An analogue dial with ticks, numbers, a hand and a wedge that shows the time left. Drag around the dial to set the duration, before a session starts. |
| **Squares** (`dots`) | One rounded square per minute of the phase (up to 60), arranged in a near-square grid; the squares drain one minute at a time. A short break sits on a single row. Not adjustable by gesture; use the durations sheet. |
| **Pulse** | The same numeric time as Digital (same swipe adjust) over a full-screen soft glow in the phase colour that drifts and breathes on a 5-second cycle. Pausing fades the glow. |

- The duration can only be dragged or swiped while no session has started (`FocusView.swift:canAdjustDuration`).
- The brief's "Clock, Squares and Pulse" omits Digital; the site should name all four. The old support article names "Digital, Circle, Dimming dots, Pulse glow" and says to tap the timer; both are wrong. The names are Digital, Clock, Squares, Pulse and the picker is the Display options menu.
- Reduce Motion is respected.

## The shared day strip

File: `FocusModels.swift` (`FocusDayStrip`, `FocusDayStripBar`).

- A row of pill-shaped segments under the timer in the app, in the widget and in the Live Activity, all drawn from one definition so they match.
- Shows today's finished phases at the length they actually ran (focus pills orange, break pills blue), the phase in progress (it fills as time passes) and what is left of the current group before its long break. A finished group keeps today's pills; a new day starts empty.
- Pill width is proportional to the phase's length. When a long day no longer fits, the oldest finished pills drop off the leading edge.
- Accessibility label: "N of M focus sessions".
- In the Live Activity the strip is capped at the 40 most recent pills (`LiveActivityAttributes.swift:146`).

## Live Activity

Files: `LeftWidgets/ViewsWidgets/Focus/FocusLiveActivity.swift`, `Left/Views/Tools/Focus/FocusLiveActivityManager.swift`, `Left/Models/LiveActivityAttributes.swift`.

- Appears while a session is running or paused (not while idle), if the Live Activity setting is on (default on) and iOS allows Live Activities. Ended when the session ends.
- **Lock Screen** layout: phase title with an icon ("Focus", "Break", "Long break"), "N sessions today" at the right, the large countdown, and the day strip. Tapping opens Focus (`left://focus`).
- **Dynamic Island**: expanded (phase and sessions-today in the header, countdown, day strip), compact (icon and a small countdown) and minimal (icon).
- The countdown runs on a system timer, so it keeps ticking while the app is closed. If a phase runs out while the app is closed, it shows "Focus done" or "Break over" at 00:00, or, with Continue automatically, counts the next phase. With Keep going it counts down and then up (overtime).
- **No buttons in the Live Activity**; the controls are in the app and the widget (the Live Activity source has no `Button(intent:)`).
- It is started and updated by the app or by the widget's Start button; there are no server-pushed Focus Live Activities (`pushType: nil`).

## Widget

Files: `LeftWidgets/ViewsWidgets/Focus/FocusWidget.swift`, `FocusWidgetIntents.swift`.

- One widget, named **Focus**, description "Start a focus session and keep its timer close."
- Sizes: Home Screen **small, medium, large**; Lock Screen **circular** and **rectangular** (`supportedFamilies`, lines 842-848).
- **Small, medium and large** (Home Screen) show the phase, a countdown, a status (Ready, Remaining, Paused, Overtime) and the day strip; the medium adds a phase progress bar and a labelled button; the large adds Today, Session length and Ends rows. Today's focused time also shows on small and medium when Summary is set to Today (the default).
- **Lock Screen rectangular**: phase, "N/M", countdown and a button, no strip. **Lock Screen circular**: only the countdown and a ring, no phase name, no strip, no button (`FocusWidget.swift` ~433-474).
- **Interactive**: a **Start** button when idle and a **Pause / Resume** button when a session exists, on the Home Screen sizes and the rectangular Lock Screen size (not circular), run in the background without opening the app (`StartFocusIntent`, `PauseResumeFocusIntent`, `supportedModes = .background`). Tapping elsewhere opens Focus.
- Configurable: **Background** (the standard widget backgrounds) and **Summary**: Today, Phase or Focus sessions (`FocusWidgetSummaryMode`).
- Tapping Start in the widget also tries to start the Live Activity and the phase notification; ActivityKit can refuse from an extension, in which case the app picks it up later. Say "usually" or leave it out.
- **Verified (Opus fact-check, 2026-10-21): the widget's Start button does not check the plan.** `StartFocusIntent` only calls `AppGroupAccessPolicy.requireAccess()`, which blocks only the hard-paywall experiment group without a paid plan (`Left/Services/AppGroupAccessPolicy.swift:14-17`). A free user can add the widget and start sessions from it. This is an app question for the owner (gate the intent, or accept it). The site therefore says only "Focus is part of Left Premium", never "starting a session needs Premium".

## Notifications

File: `Left/Views/Tools/Focus/FocusSharedLogic.swift:683-749` (`FocusSharedNotifications`).

- One local notification is scheduled for the end of the running phase, titled **Focus**, with the body "Focus session complete. Time for a break.", "Break complete. Ready to focus?" or "Long break complete. Ready for a new cycle?". Tapping it opens Focus.
- On by default; needs notification permission (turning the toggle on asks for it). It is scheduled whenever a phase is running with a future end time, including with Keep going on (it fires at the nominal end, while the timer keeps counting up). Only one is pending at a time; it is replaced on every change.

## History ("My focus")

File: `Left/Views/Tools/Focus/FocusHistoryView.swift`.

- Opened from **My focus** (top left). It shows:
  - **Summary, your last 7 days**: total focused time, comparison with the previous 7 days, today, daily average, average session, number of focus sessions, best day in 14 days, focus-to-break ratio.
  - **Daily focus**: chart of the last 14 days.
  - **Focus and breaks**: how focus and recovery balanced this week.
  - **Six-week trend**: weekly focus time with the active-week average.
  - **Recent sessions** (the last 5) and **All sessions** ("Show complete history"): completed and skipped sessions. Editing a session's start and end, and deleting a session, happen in All sessions (`focus_history_edit_session`, swipe action "Delete").
- It is a log inside the app. Nothing here says it syncs to Apple Health or exports. Do not claim either.
- Focus data is stored on the device in the App Group container (`FocusSharedPersistence`, `baseURL` from `AppGroupIdentifier.main`). Whether it syncs through iCloud or the account: **not verified; do not claim sync**.

## What's Premium

File: `Left/Views/Tools/Focus/FocusView.swift:54, 96-110, 450-455`; `Left/Views/Paywalls/OwnPaywall/OwnPaywallSupport.swift:239`.

- Focus is a **paid** feature. `hasFocusAccess` is `hasPlus || hasSuper || hasPremium`. The site's plan name is **Left Premium** (`docs/seo/research/product-claims.md`); the in-app banner says "Unlock Focus with Premium" / "Get Premium to unlock Focus, use Pomodoro-style sessions to concentrate, and access many other features." Paywall hero: "Make time for focused work" / "Use Pomodoro-style work and break sessions to protect time for what matters." (source `focus_entry`).
- A free user can open the Focus tool and see the timer, history and styles, with a banner at the top. Pressing **Start** while idle opens the paywall instead of starting (`startOrToggle`).
- Pause, resume, skip, reset and the controls on an already running session are not gated in the view; only starting a new session from the app is. The widget's Start is not gated at all (see Widget).
- Everything else about Focus (durations, styles, widget, Live Activity, notifications, history) has no separate gate in code. Say "Focus is part of Left Premium" and nothing finer (not "starting a session needs Premium"). Prices and trials are remote config: never state them.

## Not in Focus (don't claim)

- Don't claim Shortcuts or Siri actions for Focus. `StartFocusIntent` and `PauseResumeFocusIntent` are App Intents in the widget extension; whether they appear in Shortcuts or Spotlight is unverified. There is no Focus Control Center control (confirmed). The word "Focus" in "Use Left with Focus modes" (`support/focus-modes-with-left`) means Apple's iOS Focus modes, a different thing: keep the two clearly apart.
- No task list, no app blocking, no sounds, no Apple Health writes, no Pomodoro "tasks", no friends or sharing of sessions, no web version of Focus (the web version at /web is a separate page; Focus there is **not verified**, so do not claim it).
- No Apple Watch mention. The app source has a Focus Watch page; leave it out.
- No Mac or iPad claims. Requires iOS 26 on iPhone like the rest of the app.
- No counts or ratings of users. No claim that it is "the first" or "the only".
- Analytics: `focus` tool actions `session_started` and `session_completed` (`FocusTimerEngine.swift`); not a site matter.
- A review prompt can follow a completed focus session (`ReviewPromptManager.recordFocusSessionCompleted`); not a site matter.

## Where the current site copy disagrees with the app (found 2026-10-21)

| Claim on the site | App says |
|---|---|
| "Set focus sessions from 1 to 180 minutes… long breaks from 1 to 120 minutes" (`support/focus-timer-in-left`) | All three durations 1 to 60 minutes |
| "Tap the timer to move between Digital, Circle, Dimming dots, and Pulse glow styles" | Display options menu; styles Digital, Clock, Squares, Pulse |
| "Reset … or reset the cycle", "Reset returns it to the beginning" | Reset restarts the current phase only |
| "These options are mutually focused on different working styles" | Keep going disables Continue automatically |
| "A Focus widget shows the current phase and controls" | True; add sizes (small, medium, large, circular, rectangular) and the Start and Pause/Resume buttons |
| Home FAQ "continue from a widget" | True (Start and Pause/Resume from the widget) |
| Home bento "custom durations, history, notifications, Live Activities, and widgets" | True; add the day strip and four styles if space allows |
