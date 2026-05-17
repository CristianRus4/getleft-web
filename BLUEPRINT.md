# BLUEPRINT

## 1. Project Identity

Left is a SwiftUI iPhone and iPad app with four targets in this repo: `Left`, `LeftWidgetsExtension`, `LeftTests`, and `LeftUITests`.

- Main app bundle ID: `com.cr.left`
- Widget extension bundle ID: `com.cr.left.widgets`
- Test bundle IDs: `cr.LeftTests`, `cr.LeftUITests`
- Primary language: Swift 5
- Main app deployment target: iOS 18.0
- Widget extension deployment target: iOS 18.0
- Test targets deployment target: iOS 18.1
- Shipping platforms in this repo: iOS and iPadOS only
- App Store status: the app is wired to a live App Store listing and review flow for App Store ID `6740155884`

There is no macOS app target and no watchOS app target in the project. `MACOSX_DEPLOYMENT_TARGET` appears in build settings, and some widget code has broader availability guards, but those do not correspond to a shipping macOS or watchOS app target here.

## 2. Architecture Overview

Left is a SwiftUI app built around shared observable managers and services. `LeftApp` creates long-lived managers, injects them into the view tree, and feature views read and mutate shared state through those objects instead of owning separate backend clients or persistence stacks.

The load-bearing architecture decisions are:

- Core Data in the App Group container is the primary persisted store for time data.
- CloudKit sync is owned by `NSPersistentCloudKitContainer` in the main app. Sync is implicit: the app writes Core Data and the container performs export/import in the background. There is no manual push or pull pipeline for normal sync.
- Firebase is the backend for account identity, profile sync, usernames, friendships, shared `Since` data, joint `Ahead` data, photo storage, notification preferences, and FCM token handling.
- App Group `UserDefaults` stores preferences, widget snapshots, compatibility mirrors, planner caches, and widget entitlement flags.

There is not a single global source of truth for the whole app. Core Data is authoritative for local time-tracking data. Firebase is authoritative for account and social data. Widget snapshots are caches only.

The Core Data stack uses `NSMergeByPropertyObjectTrumpMergePolicy` on the main `viewContext` and on new background contexts. That policy favors the in-memory object's property values when Core Data resolves save conflicts, which matches the app's bias toward preserving the current edit context rather than blindly replacing it with store values.

`TimeSinceCounter.isHabit` is the discriminating field between streaks and habits. `false` means a streak-style counter driven by `startDate` and `resets`. `true` means a habit-style counter driven by completion data and habit schedule fields.

## 3. Codebase Structure

```text
.
├── AGENTS.md
├── BLUEPRINT.md
├── Left
│   ├── App
│   ├── Assets.xcassets
│   ├── Generators
│   ├── Intents
│   ├── Left.xcdatamodeld
│   ├── Managers
│   ├── Models
│   ├── Providers
│   ├── Services
│   ├── Stores
│   ├── Utilities
│   └── Views
├── Left.xcodeproj
├── LeftTests
├── LeftUITests
├── LeftWidgets
│   ├── Assets.xcassets
│   ├── MiscWidgets
│   └── ViewsWidgets
├── Plus.storekit
├── docs
├── firebase
│   ├── functions
│   └── tests
├── icons
└── scripts
```

- `Left`: main app target code, model types, managers, persistence, App Intents, and user-facing views. It does not contain Firebase deployment tooling.
- `Left/Localizable.xcstrings`: the app's first string catalog, currently seeded with English and Spain Spanish strings for the native paywall.
- `LeftWidgets`: widget extension code, widget-side Core Data access, Live Activity rendering, and control-widget code. It does not own CloudKit sync.
- `LeftTests`: unit and behavior tests for app logic. It is not the UI automation target.
- `LeftUITests`: UI automation target. It is not feature implementation code.
- `firebase`: Firestore rules, Storage rules, Cloud Functions, and backend tests for Firebase-backed features. It is backend infrastructure, not app target source.
- `docs`: hand-written supporting docs such as sync and backup notes. It is reference material, not runtime configuration.
- `scripts`: repo tooling, including the required safe `xcodebuild` wrapper. It is not app runtime code.
- `icons`: alternate-icon source assets. It is not where icon switching logic lives.
- `Plus.storekit`: local StoreKit testing configuration. It is not the production source of entitlement truth.

Target summary:

- `Left`: shipping app target.
- `LeftWidgetsExtension`: widgets, Live Activities, and control widget.
- `LeftTests`: unit tests.
- `LeftUITests`: UI tests.

## 3.5 Feature Map

### Left Time

Left Time is the main "how much time is left" surface for life, year, month, week, day, and hour views. It reads `birthDate`, `calculatedLifespan`, `lifeDisplayMode`, and related preferences from App Group defaults, and the calculation lives in view/model code such as `HomeDisplayMode` and `LeftView` rather than in a dedicated manager. It connects to widgets (`LifeWidget`, `YearWidget`, `MonthWidget`, `WeekWidget`, `DayWidget`, `MinutesWidget`, `DaytimeWidget`, `EverythingWidget`, `DynamicTimeWidget`, `AnalogWidget`) and to the `You` and wallpaper features because they reuse the same lifespan inputs.

### Since

`Since` lets the user track either streaks or habits in one feature area. Both are backed by `TimeSinceCounter`; the user-facing difference is that streaks measure elapsed time since a start or reset, while habits require repeated completions against a schedule. The data-level difference is `TimeSinceCounter.isHabit`, plus habit-specific fields such as `completedDates`, `completionTimestamps`, `habitTimeframe`, `habitTimesRequired`, and schedule fields. Ownership is split across `TimeSinceView`, `HabitsManager`, `HabitCompletionService`, and `SharedSinceCountersManager`. It connects to widgets, habit Live Activities, planner rows, `Left` home-grid embedding, and the Shared Since social feature.

### Ahead

`Ahead` tracks future or bounded dates and counts down to them. It is backed by `CustomDate` in app code and `TimeAheadDate` in Core Data. The main UI owner is `TimeAheadView`; shared ownership for social features sits in `JointAheadDatesManager`. It connects to widgets, calendar import, planner rows, and `FinalCountdownLiveActivityManager` for final-countdown Live Activities.

### Time Between

`Time Between` calculates the duration between two chosen date-times. It does not use a dedicated persisted entity; it is mostly ephemeral view state in `TimeBetweenView`, with only its display unit saved in App Group defaults. It does not feed other core features.

### Left Wallpaper

`Left Wallpaper` generates wallpaper images from Left's time views. It reads a saved `WallpaperConfig`, uses inputs from shared preferences and optionally `CustomDate` data, and writes PNG files plus optional background-photo files into the App Group `Wallpapers/` directory. Ownership is split between `DynamicWallpaperView`, `WallpaperConfig`, `WallpaperGenerator`, `ShortcutsManager`, and `UpdateDynamicWallpaperIntent`. It connects to App Shortcuts and daily pre-generation on app launch.

### Planner

Planner aggregates local `Since` counters, local `Ahead` dates, EventKit calendars, EventKit reminders, HealthKit summaries, and WeatherKit summaries into one timeline-like surface. `PlannerView` is the main owner, with support from `CalendarManager`, `RemindersManager`, `HealthKitManager`, `WeatherManager`, and `DuePreferencesStore`. It connects to planner widgets, planner notifications, and the same shared time data used by `Since` and `Ahead`. Apple Calendar and Apple Reminders are visible by default; when their EventKit permissions have not been granted, Planner shows a tap-to-allow access card in the timeline and seeds selected calendars/lists after permission is granted.

### Friends

Friends is the social graph: find a user by username, send a request, accept it, and unlock friend-only shared features. The owner is `FriendsManager`, with `JointAheadDatesManager` and `SharedSinceCountersManager` layered on top. Friendship is the gate for joint `Ahead` invites and Shared `Since` invites.

### You

`You` is the personal summary screen. It shows profile basics, age and lifespan calculations, app usage counts such as custom-date and counter totals, and account-connected profile information. Ownership is mainly `YouView`, with account data coming from `AuthManager` and time counts read from local caches or Core Data-backed app state. It connects to account/profile sync and to lifespan settings used by Left Time.

### Games

Games is a small collection of built-in mini-games: Snake, Pong, Tic-tac-toe, Flappy Bird, Memory Match, and Breakout. They live in the main app target and are owned by `GamesView` plus game model types. They are mostly self-contained and do not read the core time-data entities. Their only notable connection is the challenge/unlock system.

### Widgets

Widgets expose multiple feature areas:

- Left Time widgets: `LifeWidget`, `YearWidget`, `MonthWidget`, `WeekWidget`, `DayWidget`, `MinutesWidget`, `MonthsWidget`, `DaytimeWidget`, `EverythingWidget`, `DynamicTimeWidget`, `AnalogWidget`, `DigitalClockWidget`
- Ahead widgets: `AheadWidget`, `TimeAheadListWidget`, `AheadBarWidget`, `AheadCircleWidget`
- Since widgets: `StreakWidget`, `StreaksWidget`, `HabitWidget`, `HabitsWidget`
- Planner widget: `PlannerWidget`
- You widget: `YouWidget`
- Notes widget: `SpecialNoteWidget`
- Live Activities: `HabitLiveActivityWidgetExtension`, `FinalCountdownLiveActivityWidgetExtension`
- Control widget: `LeftWidgetsControl`

Most widget content comes from App Group snapshot caches. Some widget code can also read the shared SQLite store directly through the widget-side `CoreDataManager`.

## 4. Core Systems

### Persistence and iCloud Sync

This system owns the App Group SQLite store, Core Data migrations, backups, and CloudKit sync state. The main owner is `Left/Managers/CoreDataManager.swift`, with support from `DataMigrationService` and `DataBackupService`. It uses Core Data, CloudKit, the App Group container, and WidgetKit.

`CoreDataManager` registers for `.NSPersistentStoreRemoteChange` in `setupRemoteChangeObserver()`. When a remote CloudKit import lands, `scheduleRemoteChangeProcessing(identifier:)` debounces handling, records the merge time, calls `WidgetDataSyncService.shared.rebuildSnapshotsFromStore()`, then on the main queue calls `WidgetCenter.shared.reloadAllTimelines()` and posts `.widgetDataDidImport` for counters and custom dates. The snapshot rebuild itself is not synchronous with the notification callback; it is queued onto `WidgetDataSyncService` and runs against a background Core Data context.

Conflict behavior is the default Core Data behavior plus `NSMergeByPropertyObjectTrumpMergePolicy`. The app does not add a custom CloudKit conflict resolver on top. When Core Data resolves a save conflict, the in-memory object's changed properties win over store values. That is useful for preserving current edits, but it also means CloudKit-delivered store values are not always preferred when a context saves conflicting local edits.

### Widget Snapshots, Widgets, Live Activities, and Control Widgets

Widget snapshots are stored as `Codable` structs encoded with `JSONEncoder` into `Data` in App Group `UserDefaults`, not as raw JSON strings and not as `NSKeyedArchiver` blobs. `WidgetDataSyncService` owns the snapshot format and rebuild path.

The main snapshot keys in `group.cr.Left` are:

- `timeSinceCounters`
- `customDates_v3`
- `timeSinceCountersVersion`
- `timeSinceCountersImportedVersion`
- `customDatesVersion`
- `customDatesImportedVersion`
- `dueEventSnapshot`
- `dueReminderSnapshot`
- `plannerSummarySnapshot`

The widget-only keyspace in `group.cr.Left.widgets` currently includes:

- `hasPlus`
- `hasFree`
- `hasSuper`
- `hasPremium`
- `hasDeath`
- `dynamicTimeViewMode`

Rebuild ownership sits with `WidgetDataSyncService`, not with individual widgets. `rebuildSnapshotsFromStore()` debounces work by 0.35 seconds on a utility queue, and if launch is still marked as sensitive it defers until after first render. Snapshot rebuilds happen after Core Data saves, remote CloudKit change processing, Firebase sync imports, shared-photo downloads, migration, and backup restore paths.

The counters snapshot stores `[TimeSinceCounter]` and the dates snapshot stores `[CustomDate]`. Streaks and habits use the same snapshot struct shape and are distinguished by `isHabit`. Shared widget-only faceplate arrays are injected into the JSON before encoding.

Most widgets decode the snapshot cache first. The extension also ships a plain `NSPersistentContainer` over the shared SQLite file in `LeftWidgets/MiscWidgets/CoreDataManager.swift`, so widget code that needs live store access can read SQLite directly. The decision is implementation-specific: many timeline providers and views rely on snapshot caches, while some widget-side utilities still have direct Core Data access available.

### Streak and Habit Rendering

The record type switch is `TimeSinceCounter.isHabit`. `false` means streak logic. `true` means habit logic.

For streaks, the displayed current count is derived from `startDate` and `resets` through `TimeSinceCounter.currentStreak(asOf:)`. For habits, the displayed current count is derived from completion data through `TimeSinceCounter.habitStreakDays`, `TimeSinceCounter.habitStreakStartDate()`, and `HabitsManager` helpers such as `evaluateDayStatus(for:counter:)`, `calculateStreakDays`, `calculateStreakWeeks`, and `calculateStreakMonths`.

`completed today` for a habit is not a single stored flag. It is computed from `completionTimestamps` and the legacy `completedDates` set. `TimeSinceCounter.completionCount(for:)` counts the day's completion timestamps, and `TimeSinceCounter.isCompleted(date:)` compares that count to the required completion count for the habit.

`TimeSinceCounter.completionTimestamps` is maintained as a sorted-ascending array so per-day lookups can binary-search. `addCompletion(at:)` does a sorted insert via `upperBoundIndex(for:)`; `removeLastCompletion(for:)` finds the day's range with `lowerBoundIndex(for:)` and removes the last timestamp inside it; `completionCount(for:)` and `completionCount(from:to:)` derive counts from binary-search ranges over the same sorted array. Every entry point that builds a `TimeSinceCounter` from an external source enforces this invariant: the `Codable` `init(from decoder:)` defensively `.sorted()`s the array if not already sorted; the Core Data inits in both app (`Left/Models/TimeSinceCounter+CoreData.swift`) and widget (`LeftWidgets/MiscWidgets/TimeSinceCounter+CoreData.swift`) sort after pulling timestamps out of the unordered `HabitCompletion` `NSSet`; `FireSyncManager` and `SharedSinceCountersManager` `.sorted()` Firestore-decoded timestamps; `DataMigrationService` `.sorted()`s the union when merging legacy stores. The widget's raw-JSON intent path in `LeftWidgets/ViewsWidgets/HabitWidget.swift` explicitly re-sorts before writing the JSON back, since it bypasses `Codable`.

### Habit Display Cache (`HabitDisplayCacheStore`)

Per-habit derived display state (current streak, today's status and progress, completed-days set, streak-sort interval, source-revision hash) is cached in `HabitDisplayCacheStore` so SwiftUI render paths never recompute streaks from raw timestamps inside `body`. The store keeps an in-memory `[UUID: HabitDisplayCache]` dictionary persisted as JSON in `group.cr.Left` under `habitDisplayCache_v1`. Reads (`cached(for:)`, `rowDisplay(for:)`) are synchronous and never touch disk after the first hydration. Recomputation runs on a private `userInitiated` queue and only writes entries whose `sourceRevision` or `computedForDay` actually changed, so re-triggers during launch fan-out become cheap no-ops once the cache is hot.

When a single habit's cache entry is recomputed via `refresh(counterID:)`, the store posts `.habitDisplayCacheDidChange` with the habit `UUID` in `object`. Broad refreshes (`refresh(counters:)`, `pruneMissing`, initial bulk load) post the notification with `object: nil`. Views interpret a UUID-scoped notification as "rebuild one row" and `nil` as "rebuild the whole list".

### Counter Loading (`TimeSinceCounterLoadCoordinator`)

Full `TimeSinceCounter` loads from Core Data are coordinated through `TimeSinceCounterLoadCoordinator`. `PlannerView` and `TimeSinceView` both bootstrap from the app-group `timeSinceCounters` snapshot for first paint, then ask the coordinator for a post-render reconciliation. The coordinator debounces new full-load requests for about 250 ms and shares one scheduled or in-flight fetch across all callers, so stacked launch events (`onAppear`, widget import notifications, sync revision changes, foreground refreshes) do not start overlapping `fetchAll` calls.

View-level full loads are read-only. Loading counters into `PlannerView` or `TimeSinceView` must not rewrite `timeSinceCounters`, reload widgets, or post widget-import notifications unless `TimeSinceCounterLoader` reports an actual legacy snapshot upgrade. Snapshot writes are owned by mutation, migration, backup/restore, widget import, and explicit sync rebuild paths.

### Habit Completion Mutation Pipeline

`HabitCompletionService` is the single entry point for habit completion changes (`addCompletion`, `removeCompletion`, `toggleCompletion`, `cycleCompletion`). All four follow the same pattern, optimised so the caller's `await` returns within microseconds and no I/O runs on the main thread:

1. Load the counter once via `loadCounterWithConflictResolution`. This is a **pure read** — it loads from both Core Data and UserDefaults, picks the most recent completion set by comparing `timeSinceCountersVersion` timestamps, and returns the merged value without writing anything back.
2. Validate (date bounds, daily limit, `canMutateSharedSinceProgress`) and mutate the in-memory counter struct (`addCompletion(at:)` / `removeLastCompletion(for:)` / etc.) — maintains the sorted-timestamps invariant via binary-search insertion.
3. Call `finalizeMutation(habitId:updated:...)`. This:
   - **Synchronously posts `.habitCompletionsDidChange` with the habit `UUID` in `object`.** Subscribers (`TimeSinceView`, `PlannerView`, `LeftApp`'s app-icon-badge observer) react this frame; the row UI flips before the function returns.
   - **Detaches a `Task(priority: .utility)`** that runs everything else off the main thread: appends to the completion-history audit log in `group.cr.Left/habitCompletionHistory` on a utility queue; saves to Core Data on a `newBackgroundContext()`; saves the UserDefaults snapshot on a utility queue; refreshes `HabitDisplayCacheStore` for that single habit; requests a debounced widget reload via `WidgetReloadCoalescer`; updates the habit Live Activity if enabled.
4. Return the updated counter to the caller.

`WidgetReloadCoalescer` (`Left/Services/WidgetReloadCoalescer.swift`) debounces `WidgetCenter.reloadTimelines(ofKind:)` calls into a single reload per kind per 500 ms window, so a flurry of taps collapses into one widget refresh instead of four-per-tap.

`HabitCompletionPostProcessor` (`Left/Services/HabitCompletionPostProcessor.swift`) debounces the heavier per-completion cross-cutting work — app-icon badge recount and `scheduleLiveActivityNotificationsForIncompleteHabits` — with an 800 ms window. These iterate every habit and reschedule system notifications, so they run at most once per burst of taps instead of once per tap.

`PerfLog` (`Left/Services/PerfLog.swift`) emits `[Perf …]` prints to the console for the mutation path (`tap_notified`, `persist_and_sync`, `core_data_save`, `user_defaults_save`, `log_event`), the cache-refresh path (`HabitDisplayCacheStore.performRefresh_done`), and coordinated full loads (`CounterLoadCoordinator.scheduled`, `.coalesced`, `.full_load_started`, `.full_load_finished`, `.released`). These are diagnostic only — there is no remote reporting tied to them.

Widgets do not read a separate precomputed streak-count field from the snapshot cache. They decode the `TimeSinceCounter` snapshot and run the same or equivalent day-status logic against the snapshot payload. `HabitWidget` and `StreakWidget` derive their displayed streak state from the snapshot struct itself.

Habit Live Activity lifecycle is owned by `HabitLiveActivityManager`:

- Start: `scheduleActivityForHabit(_:)` starts an activity only for counters where `isHabit == true`, `liveActivityEnabled == true`, and today's status is `.pending` or `.partial`, and only during the post-8pm window.
- Update: `HabitCompletionService.updateWidgetsAndLiveActivity(for:)` updates the activity via `updateActivityForHabit`.
- End: `updateActivityForHabit` ends it after completion, and `scheduleActivityForHabit` also ends stale activities when today's status no longer requires action.

### Authentication and Profile Sync

This system owns Sign in with Apple, Firebase Auth session state, local/remote profile mirroring, and profile photo upload or download. The owner is `AuthManager`. It uses `AuthenticationServices`, `FirebaseAuth`, `FirebaseFirestore`, `FirebaseStorage`, `NSUbiquitousKeyValueStore`, WidgetKit, and App Group defaults.

The remote account profile document under `users/{uid}` is authoritative once signed in. Local fields are mirrored so the app still has usable profile basics when signed out.

### Social and Shared Data Features

This system owns usernames, friend requests, friendships, invite links, joint `Ahead` dates, Shared `Since` watchers, and user-private notification preferences. Ownership is split across `FriendsManager`, `JointAheadDatesManager`, `SharedSinceCountersManager`, and `FireSyncManager`. It uses `FirebaseFirestore`, `FirebaseStorage`, `FirebaseMessaging`, `FirebaseAuth`, and Core Data.

`FireSyncManager` intentionally disables CloudKit sync while a Firebase time-data session is active by calling `CoreDataManager.shared.setCloudKitSyncEnabled(false)`, then re-enables it on teardown. The pause flag is persisted in App Group defaults. There is no separate startup scrubber that clears a stale pause flag on its own; recovery is driven by the next auth/session path that re-activates or deactivates `FireSyncManager`.

### Notifications and Planner Integrations

This system owns local notifications, planner notifications, badge updates, deep-link payloads, habit Live Activity reminder scheduling, and final-countdown reminder scheduling. The main owner is `NotificationManager`, with support from `CalendarManager`, `RemindersManager`, and planner support code. It uses `UserNotifications`, `EventKit`, UIKit badge APIs, and WidgetKit.

Planner integrations also cache EventKit and summary snapshots in shared defaults so widgets and planner reloads do not have to refetch everything every render.

### Purchases and Entitlements

This system owns RevenueCat setup, offering resolution, purchase flows, manual restore, entitlement refresh, and compatibility entitlement caching. The owner is `PurchaseManager`. It uses `RevenueCat`, `RevenueCatUI`, `StoreKit`, WidgetKit, and shared defaults.

Runtime entitlement truth comes from RevenueCat `CustomerInfo`. `PurchaseManager` exposes tier flags (`hasFree`, `hasPlus`, `hasSuper`, `hasPremium`, `hasDeath`, and `hasResolvedEntitlements`) and still mirrors legacy `hasPlus` plus the new tier keys into both `group.cr.Left` and `group.cr.Left.widgets` for launch compatibility. Widgets do not use entitlement keys to lock or downgrade rendering.

### Analytics and Crash Reporting

This system owns analytics events, performance traces, operational diagnostics, Crashlytics issue reporting, and Sentry fatal or hang capture. The main owners are `TrackManager`, `FirebasePerformanceManager`, `CrashlyticsManager`, `LogReportManager`, and `SentryManager`. It uses Firebase Analytics, Firebase Performance, Firebase Crashlytics, and Sentry.

Crashlytics is the broad operational reporting path. Sentry is intentionally narrow and mostly used for fatal crash and app-hang retention.

### HealthKit and WeatherKit Planner Summaries

This system owns planner health and weather summary rows. The owners are `HealthKitManager` and `WeatherManager`. It uses HealthKit, WeatherKit, and CoreLocation.

Both are permission-gated and return no summary when permission is missing or the requested date is outside the supported window.

### Shortcuts and Dynamic Wallpaper Generation

This system owns wallpaper generation, wallpaper caching, and the App Shortcut that exposes wallpaper refresh to Shortcuts. Ownership is split between `DynamicWallpaperView`, `WallpaperConfig`, `WallpaperGenerator`, `ShortcutsManager`, and `UpdateDynamicWallpaperIntent`.

`WallpaperGenerator` writes date-stamped PNGs and the optional background photo into the App Group `Wallpapers/` directory. `LeftAppShortcutsProvider` exposes the `Left wallpaper` shortcut phrase set. `ShortcutsManager` pre-generates the next 30 days of wallpapers.

### Alternate Icons

The app supports user-selectable alternate icons. The main owner is `IconPickerView`, with the actual `UIApplication.setAlternateIconName` call wrapped by `AppIconChanger.setAlternateIconName(_:)`.

The named manual icon options are:

- `original`
- `colors`
- `check`
- `noir`
- `type`
- `minimal`
- `white`
- `blue`
- `brown`
- `green`
- `mint`
- `orange`
- `pink`
- `purple`
- `red`
- `yellow`

There is also an automatic monthly mode driven by `AppIconMonthController` and an automatic theme-color mode driven by `AppIconThemeController`. Icon assets live in `icons/`, the root `left-icon.icon`, and preview images in `Left/Assets.xcassets`.

Alternate icon selection is not gated by RevenueCat. Some icon variants are unlocked through `ChallengesManager` rewards instead.

### Deep Links and Universal Links

The app handles both custom schemes and universal links.

- Custom scheme: `left://`
- Special legacy app URL path: `leftapp://whatsnew`
- Universal link host for friend invites: `go.getleft.app`

`LeftApp.pendingIntent(for:)` parses most in-app routes on launch and foreground. Supported patterns in checked-in code include:

- `left://preferences`
- `left://custom?id=...`
- `left://timesince?id=...`
- `left://timeahead?id=...`
- `left://planner`
- `left://friends`
- `left://you`
- `left://life`
- `left://year`
- `left://month`
- `left://week`
- `left://day`
- `left://hour`

Friend invite links are intercepted by `FriendsManager.handleIncomingURL(_:)`, which accepts:

- `https://go.getleft.app/invite?invite=CODE`
- `left://friends/invite?invite=CODE`
- legacy Firebase hosting or `left-time.app` invite URLs

`LeftApp` stages a `PendingLaunchIntent`, and `ContentView.deliverQueuedLaunchIntentIfPossible(for:)` converts that into actual tab selection and per-feature navigation state. Notification taps can also route through the same system via a `deepLink` string in the notification payload.

## 5. External Dependencies

### Swift Package Dependencies

- `RevenueCat`
  - Purpose: purchase execution, offering fetches, entitlement refresh, restore.
  - Integrated in: `PurchaseManager`.
  - Configuration: public API key is hard-coded in source; local StoreKit config exists in `Plus.storekit`.

- `RevenueCatUI`
  - Purpose: paywall UI.
  - Integrated in: `PaywallDefaultView`, `PaywallOfferView`, `PaywallDeathView`, `PaywallReviewView`, backed by `RevenueCatPaywallContainer`.
  - Configuration: same RevenueCat setup as above.

- Firebase iOS SDK
  - Products in use: `FirebaseAuth`, `FirebaseFirestore`, `FirebaseStorage`, `FirebaseMessaging`, `FirebaseCrashlytics`, `FirebasePerformance`, `FirebaseAnalyticsCore`.
  - Purpose: auth, account sync, social data, shared data, photos, FCM tokens, analytics, crash reporting, and performance.
  - Integrated in: app managers under `Left/Managers/` and widget analytics bootstrap.
  - Configuration: `Left/GoogleService-Info.plist`, Firebase capabilities, remote-notification background mode, backend rules and functions under `firebase/`.

- `Sentry`
  - Purpose: fatal crash and app-hang reporting.
  - Integrated in: `SentryManager`.
  - Configuration: DSN is hard-coded in source.

- `Solar`
  - Purpose: solar and daylight calculations for Left time views.
  - Integrated in: main app view code such as `LeftView`.
  - Configuration: no extra key or entitlement.

- `SymbolPicker`
  - Purpose: symbol picker UI for user-configurable symbols.
  - Integrated in: creation and edit flows for user-defined items.
  - Configuration: no extra key or entitlement.

- `UnsplashPhotoPicker`
  - Purpose: pick Unsplash-hosted background or card photos.
  - Integrated in: Unsplash manager and feature edit flows.
  - Configuration: Unsplash access keys are hard-coded in source.

### Backend-Side npm Dependencies

- `firebase-admin`
  - Purpose: admin Firestore, Auth, and FCM access in Cloud Functions.
  - Integrated in: `firebase/functions/index.js`.
  - Configuration: Firebase deploy-time credentials.

- `firebase-functions`
  - Purpose: HTTP and Firestore-triggered functions.
  - Integrated in: `firebase/functions/index.js`.
  - Configuration: Node runtime `22` in `firebase/functions/package.json`.

- `@firebase/rules-unit-testing`, `firebase`, `firebase-tools`
  - Purpose: rules tests and emulator tooling.
  - Integrated in: `firebase/package.json` and `firebase/tests/`.
  - Configuration: emulator and CLI environment, not app runtime.

## 6. Configuration and Environment

Checked-in configuration points:

- `Left/GoogleService-Info.plist`
- `Left/Left.entitlements`
- `Left/Info.plist`
- `LeftWidgets/Info.plist`
- `LeftWidgetsExtension.entitlements`
- `firebase/firestore.rules`
- `firebase/storage.rules`
- `firebase/firebase.json`
- `firebase/functions/package.json`
- `firebase/functions/index.js`
- `Plus.storekit/Configuration.storekit`

Secrets and configuration handling in the repo today:

- RevenueCat public API key is hard-coded in `PurchaseManager`.
- Sentry DSN is hard-coded in `SentryManager`.
- Unsplash keys are hard-coded in `UnsplashPhotoService`.
- Firebase app config is checked in through `GoogleService-Info.plist`.
- There are no `.xcconfig` files and no checked-in dev/staging/prod switching layer in the Xcode project.

Required capabilities and why:

- App Groups: share SQLite, widget snapshots, planner caches, wallpaper files, and entitlement flags.
- CloudKit/iCloud: Core Data CloudKit sync and compatibility mirroring.
- Associated Domains: universal links for `go.getleft.app`.
- Sign in with Apple: Firebase login flow.
- HealthKit: planner health summaries.
- WeatherKit: planner weather summaries.
- Time-sensitive notifications: important reminder surfaces.
- Remote notifications: Firebase Messaging token registration and remote push handling.

## 7. Data Model

### Core Data

The primary local entities are:

- `TimeSinceCounter`: one record type for both streaks and habits.
- `TimeAheadDate`: one record type for future or bounded dates.

`TimeSinceCounter` carries both shared and type-specific fields:

- Shared structure: identity, naming, color, symbol, `startDate`, reminders, goal metadata, photo filename and attribution, notes, and home/widget visibility.
- Streak structure: `resets` and elapsed-time formatting.
- Habit structure: `isHabit`, `completedDates`, `completionTimestamps`, `habitTimeframe`, `habitTimesRequired`, `habitScheduleType`, `habitSpecificDays`, `habitDaysPerWeek`, and `liveActivityEnabled`.
- Shared Since mirror structure: `sharedSinceCounterID`, `sharedSinceOwnerUserID`, watcher IDs, pending invitee IDs, and current-user participation status.

`TimeAheadDate` carries:

- Base date structure: `name`, `startDate`, `endDate`, `isEnabled`, `displayUnit`, `note`, symbol and color fields.
- Reminder structure: reminder enabled flag, offset, reminder time, repeat option.
- Live Activity structure: `finalCountdownLiveActivityEnabled`.
- Joint Ahead mirror structure: owner/admin ID, participant IDs, pending invitee IDs, and current-user participation status.

Supporting Core Data entities connected to `TimeSinceCounter` are:

- `ResetDate`
- `CompletedDate`
- `DatedNote`
- `ReminderDay`
- `HabitSpecificDay`
- `HabitCompletion`

Photo bytes are not stored inside Core Data. The app stores photo filenames and attribution in the entities, while the JPEG data itself lives in App Group file-system folders such as `TimeSincePhotos/`, `TimeAheadPhotos/`, and `Wallpapers/`.

### Firebase-Side Structures

The main Firebase-backed shapes that drive app behavior are:

- `users/{uid}`
  - Purpose: signed-in account profile and FireSync root.
  - Behavior-driving fields read or written by the app: `userName`, `birthDate`, `calculatedLifespan`, `profileSymbol`, `profilePhotoPath`, `profilePhotoState`, `profilePhotoUpdatedAt`, `profileRevisionId`, `createdAt`, `updatedAt`, `schemaVersion`, plus `friendInviteCode` and `usernameInitialChangeUsed` from the friends/account layer.

- `publicProfiles/{uid}`
  - Purpose: social display profile.
  - Behavior-driving fields: `uid`, `userName`, `username`, `profileSymbol`, `profilePhotoPath`, `profilePhotoState`, `profilePhotoUpdatedAt`, `updatedAt`.
  - Read by: friends lists, invites, Shared Since participant UI, Joint Ahead participant UI.

- `usernameIndex/{normalizedUsername}`
  - Purpose: uniqueness lookup for usernames.
  - Behavior-driving fields: `uid`, `username`, `updatedAt`.
  - Uniqueness is enforced by using the normalized username as the document ID and checking it inside `FriendsManager` transactions before writing.

- `friendRequests/{senderId_recipientId}`
  - Purpose: pending friend lifecycle.
  - Behavior-driving fields: `senderId`, `recipientId`, `createdAt`.
  - There is no separate status field in the checked-in code. Pending state is represented by document existence.

- `friendships/{sortedMemberIds}`
  - Purpose: accepted friendship graph.
  - Behavior-driving fields: `members`, `createdAt`, `inviteId`.

- `friendInvites/{uid}`
  - Purpose: sharable friend invite link target.
  - Behavior-driving fields: `code`, `inviterId`, `inviterUsername`, `profilePhotoPath`, `createdAt`, `updatedAt`.

- `userPrivate/{uid}`
  - Purpose: private notification preferences and push token storage.
  - Behavior-driving fields: `requestNotificationsEnabled`, `friendRequestNotificationsEnabled`, `jointAheadInviteNotificationsEnabled`, `sharedSinceInviteNotificationsEnabled`, `sinceWatcherCompletionNotificationsEnabled`, `sinceWatcherMissNotificationsEnabled`, `sinceWatcherSupportNotificationsEnabled`, `fcmTokens`, `updatedAt`.

- `users/{uid}/aheadDates/{dateId}`
  - Purpose: Firebase mirror of the user's Ahead data and the authoritative shared record for joint dates owned by that user.
  - Behavior-driving fields: base `CustomDate` fields, reminder fields, `finalCountdownLiveActivityEnabled`, photo metadata and storage path, `adminId`, `participantIds`, `pendingInviteeIds`, `revisionId`, `updatedAt`, `schemaVersion`.
  - For joint dates, the Firestore owner document is the shared source that participant UIs mirror back into local state.

- `jointAheadDateInvites/{dateId_recipientId}`
  - Purpose: joint date invite lifecycle.
  - Behavior-driving fields: `dateId`, `adminId`, `recipientId`, `status`, `createdAt`, `updatedAt`.
  - Lifecycle states in code: `pending`, `accepted`, `declined`, `cancelled`.

- `users/{uid}/streaks/{counterId}` and `users/{uid}/habits/{counterId}`
  - Purpose: Firebase mirror of the user's Since data and the authoritative shared record for Shared Since owners.
  - Behavior-driving fields: base `TimeSinceCounter` fields, reminder fields, `resets`, `completedDates`, `completionTimestamps`, habit schedule fields, photo metadata and storage path, `sharedSinceCounterId`, `sharedSinceOwnerUserId`, `sharedSinceWatcherIds`, `sharedSincePendingInviteeIds`, `sharedSinceCurrentUserStatus`, `revisionId`, `updatedAt`, `schemaVersion`.
  - For shared counters, the owner's Firestore document is authoritative and watcher UIs mirror it locally.

- `sharedSinceInvites/{counterId_recipientId}`
  - Purpose: shared streak or habit invite lifecycle.
  - Behavior-driving fields: `counterId`, `ownerId`, `recipientId`, `isHabit`, `status`, `createdAt`, `updatedAt`.
  - Lifecycle states in code: `pending`, `accepted`, `declined`, `cancelled`.
  - Watcher notification behavior is then driven by accepted watcher IDs stored on the owner counter document plus user-private notification preferences.

No checked-in iOS code in this repo uses a Firestore `isPaidCustomer` flag as authoritative entitlement state. RevenueCat `CustomerInfo` plus local compatibility caches are the runtime entitlement path used by the app.

## 8. Key Flows

1. First launch or onboarding writes local profile basics such as `userName`, `birthDate`, and `calculatedLifespan` into App Group defaults, then shared managers and widget caches are prepared.
2. On a legacy install, `DataMigrationService` checks whether Core Data is already populated, migrates old serialized counters and dates into the shared SQLite store if needed, and triggers `WidgetDataSyncService.shared.rebuildSnapshotsFromStore()`.
3. A normal local edit to a streak, habit, or ahead date writes through `CoreDataManager`, saves the store, then `NSPersistentCloudKitContainer` handles export or import implicitly in the background.
4. A CloudKit remote change lands, `CoreDataManager.setupRemoteChangeObserver()` receives `.NSPersistentStoreRemoteChange`, ignores very recent app-authored local-save echoes, and otherwise lets `scheduleRemoteChangeProcessing(identifier:)` debounce handling. The processing path calls `WidgetDataSyncService.shared.rebuildSnapshotsFromStore()`, then `WidgetCenter.shared.reloadAllTimelines()` and `.widgetDataDidImport` notify views and widgets. `TimeSinceView`, `TimeAheadView`, and `PlannerView` respond by re-fetching their data; Since/Planner counter fetches go through `TimeSinceCounterLoadCoordinator`.
5. Sign in with Apple runs through `AuthManager.signInWithApple()`, exchanges credentials with Firebase Auth, starts the remote profile listener, mirrors profile fields between local storage and Firestore, and schedules FireSync activation.
6. In the friend flow, `FriendsManager` resolves a username through `usernameIndex`, creates a `friendRequests` document, listens for incoming and outgoing request changes, and turns acceptance into a `friendships` document plus public-profile-backed UI state.
7. In the Joint Ahead flow, a local date is mirrored to `users/{uid}/aheadDates`, `JointAheadDatesManager` creates a `jointAheadDateInvites` document, participant listeners watch for accepted states, and accepted shared records are mirrored back into local UI and widget refreshes.
8. In the Shared Since flow, an owner counter is mirrored to `users/{uid}/streaks` or `users/{uid}/habits`, `SharedSinceCountersManager` creates `sharedSinceInvites`, accepted watchers are reflected onto the owner record, watcher mirrors are persisted locally, and notification requests are driven through Firebase-backed endpoints and preference documents.
9. Planner bootstraps counters from the app-group snapshot, reconciles the full Core Data counter list through `TimeSinceCounterLoadCoordinator` after first render, loads local dates, merges EventKit events and reminders, folds in HealthKit and WeatherKit summaries, caches EventKit and summary snapshots in shared defaults, and renders the result in `PlannerView` and `PlannerWidget`.
10. A habit completion changes through `HabitCompletionService`. The service loads the counter once (pure read with last-write-wins merge), mutates it in memory, then `finalizeMutation` synchronously posts `.habitCompletionsDidChange` (with the habit `UUID` in `object`) so the UI redraws this frame, and detaches a background `Task(priority: .utility)` that appends to the completion-history audit log, saves to Core Data on a background context, saves the UserDefaults snapshot on a utility queue, refreshes the habit display cache, requests a debounced widget reload through `WidgetReloadCoalescer`, and updates the habit Live Activity if enabled. The badge recount and live-activity reschedule run through `HabitCompletionPostProcessor` with their own 800 ms debounce window. No persistence I/O runs on the main thread on the tap path.
11. On launch or foreground, `PurchaseManager` runs an entitlement refresh, applies `CustomerInfo`, writes compatibility tier keys into shared defaults, and lets the SwiftUI tree react to tier flags.
12. On a gated action, the relevant view checks the required tier. Plus-level gates use `hasPlus || hasSuper || hasPremium`; premium-level gates use `hasSuper || hasPremium`. If blocked, it presents one of the explicit RevenueCat paywall views, purchase or restore updates `PurchaseManager`, and gated UI unlocks.

## 9. Known Constraints and Non-Obvious Decisions

- The main app owns CloudKit sync. The widget extension opens the same SQLite store with a plain `NSPersistentContainer` and does not run CloudKit sync itself.
- The app intentionally uses two backends: Core Data plus CloudKit for local time data, and Firebase for account, social, and sharing features.
- The Core Data merge policy is `NSMergeByPropertyObjectTrumpMergePolicy`. That means the context's changed object properties win when Core Data resolves save conflicts. This is good for preserving active edits, but it can be surprising when a CloudKit-imported store value conflicts with a locally edited object that later saves.
- `FireSyncManager` persists the CloudKit-pause state in `coredata.firebaseSyncActive`. If the app is terminated while a Firebase time-data session is active, the next launch does not run a separate stale-pause cleanup. Recovery depends on the next auth-driven `FireSyncManager` activation or deactivation path.
- Streak and habit day-bucketing is built on `Calendar.current.startOfDay` and ISO day strings. The app listens for significant time changes and refreshes views, but there is no separate timezone-stable calendar layer. Timezone jumps or manual device-clock changes can therefore affect day boundaries.
- Resets and habit completions are both normalized to calendar days. There is no extra special-case resolver for "reset and completion on the same day"; behavior follows the streak or habit calculation path for that record type.
- Widget snapshots are caches. If the app crashes after a Core Data write but before the deferred snapshot rebuild runs, widgets can show stale data until the next rebuild trigger on launch, import, or later mutation.
- Live Activity attribute structs must stay identical between the app target and the widget extension target.
- App Group defaults and snapshot caches are intentional bridges. They are not accidental duplication and should not be treated as the authoritative store.
- Full Since/Planner counter loads are read-only UI reconciliation. Do not add app-group snapshot writes, widget reloads, or broad `.widgetDataDidImport` posts to `TimeSinceView`/`PlannerView` load-completion paths; mutation, import, migration, backup/restore, and explicit sync rebuild flows own those writes.
- App-authored Core Data contexts use the `Left.app` transaction author. `HabitCompletionService` explicitly arms a short `CoreDataManager` local-echo suppression window before its background Core Data save so the tap path does not trigger a broad `.widgetDataDidImport` reload; external import paths must still post explicit `.widgetDataDidImport` notifications after they apply changes.
- Photo binaries are stored outside Core Data and outside CloudKit value storage. The synced records carry filenames and metadata, while bytes live in the App Group file system or Firebase Storage.
- `PurchaseManager` tracks `Death` separately from the core Plus/Super/Premium tier. Do not use `hasDeath` to unlock regular paid features unless a dedicated Death feature path is added.
- `TimeSinceCounter.completionTimestamps` must always be sorted ascending — `completionCount(for:)`, `completionCount(from:to:)`, and `removeLastCompletion(for:)` binary-search the array. Every code path that constructs or imports a counter sorts (Codable `init(from decoder:)`, Core Data inits in both targets, Firebase/Shared decoders, migration union, widget intent JSON write). Any new write path must preserve this invariant or call `.sort()` explicitly before persisting.
- `HabitCompletionService` mutation methods return immediately after posting the change notification and detach all persistence to a background `Task`. Callers must not assume Core Data / UserDefaults / Firebase / widgets are already updated when `await addCompletion(...)` returns. The change notification is the synchronisation point for UI; subsequent reads from disk may briefly lag the in-memory value. Recovery is automatic on the next mutation or the next CloudKit / FireSync import.
- `loadCounterWithConflictResolution` is a pure read. The old behaviour synchronously rewrote the UserDefaults snapshot to "heal" drift between Core Data and UserDefaults on every read; this caused the tap-path lag and has been removed. Drift between the two stores is now reconciled on the next mutation (which writes both) or by `WidgetDataSyncService.rebuildSnapshotsFromStore()`. Existing on-disk inconsistencies from prior versions are preserved until that next write.

## 10. Maintenance Contract

- If you add or remove a target, update sections 1 and 3.
- If you change supported platforms or deployment targets, update section 1.
- If you change the architectural split, sync ownership, or merge policy, update sections 2, 4, and 9.
- If you change the folder structure or move a major feature area, update section 3.
- If you add, remove, or materially change a user-facing feature, update section 3.5.
- If you add a new core system or move system ownership, update section 4.
- If you add or remove a framework, package, SDK, npm dependency, or backend runtime, update section 5.
- If you change secrets handling, entitlements, capabilities, plist configuration, URL schemes, universal links, or environment switching, update section 6.
- If you change Core Data entities, Firebase document shapes, cache formats, or persistence boundaries, update section 7.
- If you add or materially change a cross-system flow, update section 8.
- If you introduce or remove a hidden constraint, workaround, or known edge case, update section 9.
- If you change monetisation, paywall placement, entitlement identifiers, or runtime gates, update section 11.
- Do not add speculative or aspirational content. Every statement here must be traceable to the current repository, checked-in config, or in-repo docs.

## 11. Monetisation

### Entitlement Structure

`PurchaseManager` reads three RevenueCat entitlements from `CustomerInfo`:

- `Plus`
- `Premium`
- `Death`

The legacy `Plus` entitlement is split into Plus or Super by `EntitlementInfo.productIdentifier`. Product IDs `tier2999`, `tier2499`, `tier1999`, `tier1799`, `tier1499`, and `tier1299` classify as Super. Non-Super active `Plus` classifies as Plus. Active `Premium` classifies as Premium and wins the displayed paid tier. `Death` is tracked separately with `hasDeath`.

`Plus.storekit` contains both one-time and recurring test products:

- One-time non-consumables used directly by the custom purchase UI:
  - `cr.Left.GetLeftPlus`
  - `cr.Left.GetLeftPlusMedium`
  - `cr.Left.GetLeftPlusBig`
- Additional one-time StoreKit products present in the file:
  - `cr.Left.GetLeftPlusSmall`
  - several `tier...` products
- Recurring subscriptions present in the file:
  - `LeftSub_299`
  - `LeftSub_399`
  - `LeftSub_899`

The repo does not check in fixed RevenueCat offering identifiers. The app asks RevenueCat for the current offering or the offering for a placement at runtime.

### What Is Free

The following capabilities are free in the app logic:

- Left Time core views and their base widgets
- Sign in with Apple and account sync
- Profile editing, username setup, and the friends graph
- Accepting friend requests, accepting or joining Joint Ahead invites, and accepting or watching Shared Since content
- `You`
- `Time Between`
- Dynamic wallpaper configuration, wallpaper generation, and the `Left wallpaper` App Shortcut
- Base settings such as theme, birthday, display style, and many notification preferences
- Widget rendering and widget display styles, including Dynamic Time, Special Note, Life styles, and Minutes styles

Planner is free only as sample mode. The full planner data experience is not free.

Fresh installs seed sample data for `Ahead`, habits, and streaks when the local stores are empty, so the default experience shows examples without requiring the user to tap a separate sample button.

### What Is Gated

- Add a streak
  - Gate: `TimeSinceView` checks Plus-level access before opening streak templates.
  - Check style: action-time intercept.
  - Limit type: hard gate.

- Add a habit
  - Gate: `TimeSinceView` checks Plus-level access before opening habit templates.
  - Check style: action-time intercept.
  - Limit type: hard gate.

- Add an Ahead date
  - Gate: `TimeAheadView.attemptAddDate()` and toolbar actions check Plus-level access.
  - Check style: action-time intercept.
  - Limit type: hard gate.

- Import Ahead dates from Calendar
  - Gate: `TimeAheadView` calendar-import actions check Plus-level access.
  - Check style: action-time intercept.
  - Limit type: hard gate.

- Full Planner
  - Gate: `PlannerView.isSampleMode` switches to sample content when entitlements are resolved and the user lacks Super or Premium.
  - Check style: render-time replacement, with paywall CTA from sample mode.
  - Limit type: hard gate on real planner data.

- Special dates management
  - Gate: `CustomDatesView` branches on Plus-level access.
  - Check style: render-time gate plus action-time paywall prompts.
  - Limit type: hard gate on full management, with a Plus-only local limit of 10 items once unlocked.

- Calculated lifespan screen
  - Gate: `PreferencesView`, `SettingsView`, and `AccountView` only navigate to `LifespanView` with Plus-level access.
  - Check style: action-time intercept.
  - Limit type: hard gate.

- Home shortcut into special dates on older Left home UI
  - Gate: `LeftView.leftButtonContextMenu` checks Plus-level access before opening `CustomDatesView`.
  - Check style: action-time intercept.
  - Limit type: hard gate.

- Games entry
  - Gate: `ContentView` and `ToolsView` require Super or Premium before opening `GamesView`.
  - Check style: render-time replacement with a paywall at the entry point.
  - Limit type: hard gate on entering games. Challenge locks inside `GamesView` remain challenge-based.

- App Icon picker entry
  - Gate: `SettingsView` requires Super or Premium before opening `IconPickerView`.
  - Check style: action-time intercept.
  - Limit type: hard gate on entering the picker. Challenge locks inside `IconPickerView` remain challenge-based.

- Sending friend and shared-content invites
  - Gate: `FriendsView`, `AddTimeAheadView`, `DetailsTimeAheadView`, `AddTimeSinceView`, `AddHabitView`, and `DetailsTimeSinceView` require Super or Premium before sending friend requests, Joint Ahead invites, or Shared Since watcher invites.
  - Check style: action-time intercept.
  - Limit type: hard gate on sending invites only.

- Legacy Plus upgrade banner
  - Gate: `SettingsView` and `LeftView` show it only when `hasPlus && !hasSuper && !hasPremium`.
  - Check style: render-time countdown from the persisted `plusUpgradeOfferStartedAt` app-group timestamp.
  - Limit type: 18-hour offer entry point to `PaywallOfferView`.
  - Placement behavior: in Settings it replaces the random cross-promo app banner slot while active; on Left home it replaces the normal home upsell banner priority.

### Paywall Placements

Repo-visible paywall placements and entry points:

- Onboarding paywall
  - Placement: current RevenueCat offering
  - Trigger: end of onboarding flow
  - Presenter: `OnboardingFlowView`
  - UI: `PaywallDefaultView` using RevenueCatUI `PaywallView`
  - Presentation: sheet

- Default app paywall
  - Placement: current RevenueCat offering
  - Trigger: generic premium upsell entry points
  - Presenter: `PaywallDefaultView`
  - UI: RevenueCatUI `PaywallView`
  - Presentation: sheet or modal depending on caller

- Offer paywall
  - Placement: `offer`
  - Trigger: legacy Plus upgrade countdown banners in Settings and Left home
  - Presenter: `PaywallOfferView`
  - UI: RevenueCatUI `PaywallView`
  - Presentation: sheet

- Death paywall
  - Placement: `death`
  - Trigger: final step in `DeathFeeView`
  - Presenter: `PaywallDeathView` from `DeathFeeView`
  - UI: RevenueCatUI `PaywallView`
  - Presentation: sheet

- Review paywall
  - Placement: `review`
  - Trigger: review-specific upsell entry points
  - Presenter: `PaywallReviewView`
  - UI: RevenueCatUI `PaywallView`
  - Presentation: sheet

Other paywall source strings are tracked in code for analytics, including `home_get_plus`, `time_since_add_streak`, `time_ahead_add`, `custom_dates_item`, `custom_dates_prompt`, `preferences_get_left_plus`, `settings_lifespan_calculate`, `due_planner_sample`, `games_entry`, `settings_app_icon`, `friends_add_friend`, `joint_ahead_invite`, `shared_since_invite`, `app_url_get_plus`, and `quick_action_get_plus`.

### Onboarding

First launch presents `OnboardingFlowView` instead of the older welcome `TourView`. `OnboardingFlowView` marks `hasCompletedOnboarding` before presenting the default onboarding paywall, and the Left home launch path marks `hasSeenTour` so the older tour does not immediately stack its own paywall after onboarding. The old tour remains available as a manual Settings entry point.

### How Entitlement Is Checked At Runtime

The authoritative runtime entitlement source is RevenueCat `CustomerInfo`. `PurchaseManager.updatePurchasedState()` and the RevenueCat delegate feed `applyCustomerInfo(_:)`, which classifies `Plus`, `Premium`, and `Death` entitlements into local tier flags. Old installs that only have cached `hasPlus == true` continue to boot as Plus until RevenueCat resolves the exact tier.

Caches:

- App Group `group.cr.Left` `hasPlus`
- App Group `group.cr.Left` `hasFree`, `hasSuper`, `hasPremium`, `hasDeath`
- Widget App Group `group.cr.Left.widgets` `hasPlus`
- Widget App Group `group.cr.Left.widgets` `hasFree`, `hasSuper`, `hasPremium`, `hasDeath`

Those caches exist for launch-state bootstrapping and compatibility. They are not more authoritative than RevenueCat, and widget render paths no longer depend on them for locks or downgrades.

If RevenueCat is unreachable, `PurchaseManager` keeps the previous entitlement state. If entitlements have never been resolved before, it marks `hasResolvedEntitlements = true` without inventing a new paid state.

### Entitlement Lifecycle

Entitlement refresh happens:

- on first active launch path
- on foreground resume
- after purchase completion
- after restore
- when RevenueCat pushes updated customer info through its delegate

When entitlement state changes, `PurchaseManager.applyCustomerInfo(_:)` updates the tier flags, updates tier-aware analytics and Sentry paid status, writes the compatibility tier keys to shared defaults, and reloads widget timelines.

### Widget Entitlement Cache

Widgets still receive cached entitlement keys for compatibility, but Dynamic Time, Special Note, Life, and Minutes widgets no longer lock or downgrade based on those keys. `PurchaseManager.writeEntitlementStateToSharedDefaults(_:)` writes the keys whenever entitlement state changes.

### Restore Flow

The manual restore path is `PurchaseManager.restorePurchasesManually()`. `RevenueCatPaywallContainer` listens to `customerInfoPublisher` and shows one of two alerts:

- `Restore Successful`
- `No Purchases Found`

If a restore succeeds, `applyCustomerInfo(_:)` updates the local cache and the paywall dismiss path runs. If no purchases are found, the alert is shown and the entitlement state remains unchanged.

### Edge Cases

- Purchase on one device, first launch on another device
  - The second device boots from cached tier keys if available. Legacy cached `hasPlus` is still honored. It then refreshes from RevenueCat on activation. There is no separate Firestore paid-state fallback.

- Refund or subscription lapse
  - The app relies on the next RevenueCat refresh or delegate callback to flip tier flags and rewrite compatibility caches.

- Mid-session entitlement loss
  - The app reacts when RevenueCat pushes updated `CustomerInfo` or when the next refresh runs. There is no separate timer constantly polling entitlement state in the checked-in code.

- RevenueCat init or network failure on launch
  - The app keeps the previous cached entitlement state and avoids inventing a new paid result.

- `Death` entitlement
  - The app reads it into `hasDeath` and the death-specific paywall restore path treats it as a successful restore. Core Plus/Super/Premium feature gates do not depend on `hasDeath`.

## Glossary

- `Left`: the core time-left feature area for life, year, month, week, day, and hour views.
- `Left Time`: shorthand for the same core time-left calculations shown in the app and widgets.
- `Since`: the feature for tracking either streaks or habits with one record type.
- `Streak`: a `TimeSinceCounter` where `isHabit == false`; it measures elapsed time since the start or last reset.
- `Habit`: a `TimeSinceCounter` where `isHabit == true`; it measures repeated completions against a schedule.
- `Ahead`: the feature for tracking future or bounded dates and their countdowns.
- `Joint Ahead`: the shared version of an Ahead date between friends.
- `Shared Since`: the social version of a streak or habit where friends can watch progress.
- `Left Wallpaper`: the wallpaper generator that renders Left-style progress into image files for Shortcuts or manual wallpaper use.
- `Planner`: the combined agenda view that mixes local Left data with EventKit, HealthKit, and WeatherKit data.
- `You`: the personal summary and account view.
- `Time Between`: the calculator for the duration between two chosen dates.
- `Games`: the built-in mini-games shipped inside the main app target.
