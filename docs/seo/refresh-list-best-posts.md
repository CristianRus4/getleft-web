# Refresh list: live "best ..." posts on getleft.app (2026-10-21)

Read-only audit of 11 live listicles in `blog/` (worktree `seo-listicles-3`). Data sources: US App Store via `itunes.apple.com/lookup` and `/search` (country=us), pulled 2026-10-21; Left claims checked against `/Users/cristian/.t3/lane-work/lane3/facts.md`; overlap checked against `scheduled/blog/*.html`, `i18n/publish-schedule.json` and `docs/seo/research/listicles/*.md`. `best-days-since-apps-iphone` skipped (published today).

Status: this is a list only; no post was edited. Facts were gathered from the US App Store on 2026-10-21 by a sweep helper and spot-read, not individually re-verified by a second pass. Re-check each number against the store on the day of the refresh. Lane 0 schedules the refreshes.

Method notes and limits:
- The posts quote almost no numbers (no prices, ratings, update dates), so "mismatches" are mostly feature, pricing-model and cap claims. The only post with "checked" dates is `best-countdown-widgets-iphone`.
- Every post shows "Updated October 20, 2026" and `dateModified` 2026-10-20, yet most facts below were not rechecked. That is a credibility risk (fresh date, stale content).
- Mac App Store data is not reliably available through the iTunes API (macSoftware searches return iOS rows or nothing), so the Mac post's per-app facts could not be verified that way.
- Editing a live post drops its translations in all 18 languages. Recommendation throughout: one batched refresh per post, never piecemeal. Timing advice is in "Cross-cutting".
- Rating counts of Left are deliberately not quoted anywhere (forbidden in facts.md).

## Summary

| Post | Priority | Top 3 issues |
|---|---|---|
| best-productivity-apps-mac | High | (1) "iPhone widgets on the Mac desktop" wording appears 3 times; this follows the 2026-10-20 LANE-NOTES decision but conflicts with facts.md, so Lane 0 should confirm; (2) Left is #1 on a Mac list while having no Mac app; (3) no table facts/checked date, Mac prices unverified |
| best-habit-tracker-apps-iphone | High | (1) Streaks "12-habit cap" is now 24; (2) "Done" app cannot be found on the US store, HabitKit "one-time purchase" is wrong; (3) omits Habit Tracker by Inner Grow (148k ratings), Finch, Fabulous, Grit; no table/checked/FAQ |
| best-home-screen-widgets-iphone | High | (1) Misses the biggest widget apps (Themify 345k, Photo Widget 169k, iScreen 153k, ThemePack 484k); (2) Widgy "Pro tier" and Streaks "12 habits" wrong; (3) near-duplicate of best-free-widget-apps and 2 scheduled posts |
| best-countdown-widgets-iphone | High | (1) Only two competitors, with 7 and 21 ratings, while Countdown Star (216k), Countdown (189k), Countdown@ (40k), DayCount (26k) are absent; (2) title tag has no year and says "Buyer's Guide"; (3) no table, no links to the new day-counter / countdown-star / wallpaper listicles |
| best-free-widget-apps-iphone | Medium | (1) Widgy "Pro tier unlocks the editor" is wrong (paid slot unlocks); (2) Widgetsmith "Premium" and free-tier details unverified, "PhotoWidget" ambiguous; (3) overlaps with best-home-screen-widgets and scheduled lock-screen post |
| best-apps-for-adhd-iphone | Medium | (1) "highest-leverage intervention" efficacy claim; (2) near-duplicate of best-productivity-apps-adhd (same stack); (3) no Focus timer mention (ships v2026.11), no Checked line or schema |
| best-productivity-apps-adhd | Medium | (1) Same efficacy claim and duplicate app set as best-apps-for-adhd; (2) Forest listed "Paid one-time" but is free with IAP; (3) no Checked line, no FAQ schema |
| best-reminder-apps-iphone | Medium | (1) Joint Ahead "reminder you can't dismiss" overclaim; (2) misses Google Tasks (107k), Todoist-class apps are fine but no prices/ratings; (3) no table, Checked line or schema |
| best-goal-tracking-apps-iphone | Medium | (1) "Goalsetter / GoalsOnTrack" is a dead pick (GoalsOnTrack last updated 2022-04-21, 2.5 stars from 8 ratings; Goalsetter is a kids' finance app); (2) Streaks "12 habits" wrong; (3) Left section implies Planner/friends without Premium note |
| best-apple-watch-apps-adhd | Low | (1) "Stretchly" has no iPhone or Watch app (desktop tool); (2) "Left ... no watch app" / FAQ "No." will go stale when a watch app ships; (3) H1 lacks year, no Checked line |
| best-planner-adhd | Low | (1) Guide not a listicle: no app comparison to keep fresh; (2) H1 lacks year, efficacy tone ("time layer ... usable for someone with time blindness"); (3) no links to new listicles |

Which posts deserve the one refresh most: habit tracker, home-screen widgets, countdown widgets (largest commercial query sets, most scheduled-listicle linking potential), then Mac (a must-fix compliance issue). The ADHD cluster should be refreshed as one batch after v2026.11 ships (~2 Nov), see Cross-cutting.

---

## 1. best-countdown-widgets-iphone

1. Title/H1/meta
   - Title: `Best Countdown Widgets for iPhone: A Buyer's Guide | Left` (no year, "Buyer's Guide" does not match the query). H1 `Best Countdown Widgets for iPhone Home Screen (2026)` has the year. Meta is fine but short on intent words.
   - Own the query "best countdown widget iphone" / "countdown widget app iphone". Suggested title: `Best Countdown Widget Apps for iPhone (2026) Compared | Left`. Suggested meta: `The best countdown widget apps for iPhone in 2026: Home Screen, Lock Screen, Live Activities, sharing and free limits compared. Checked Oct 2026.`
   - Overlap: live landing page `/countdown-widget` (commercial intent, keep it as the "Left" page and link to it); scheduled `best-day-counter-apps-iphone` (11-09), `countdown-star-alternatives` (11-03), `best-countdown-wallpaper-apps-iphone` (10-24), `best-birthday-countdown-apps-iphone` (10-27), `best-exam-countdown-apps-iphone` (11-08). This post should stay the generic "countdown widget" hub and link out to those.
2. Stale facts (App Store, pulled 2026-10-21)
   - "Countdown Widget & Photos By Costhap, free with in-app purchases, requires iOS 26 or later": matches (id 6450153688, iOS 26.0, free, updated 2026-10-14). But the app has 4.0 stars from 7 ratings; a buyer's guide that names it as one of two picks is thin. https://apps.apple.com/us/app/id6450153688
   - "DayDrop: Countdown Widget By Hirak Banerjee": store name is now "Countdown Widget - DayDrop" (id 6759470132; 4.76 from 21 ratings; iOS 18.0; released 2026-03-19; updated 2026-09-20). "listed for iPhone, iPad and Mac": the lookup's supportedDevices shows no Mac entry, so verify the Mac compatibility line on the page before keeping it. https://apps.apple.com/us/app/id6759470132
   - No price/rating numbers in the post, so no other mismatches. The "checked 20 October 2026" lines are accurate and should be re-dated on refresh.
3. Missing apps / competitors
   - Not in the post but strong (US store, updated 2026): Countdown Star (576177593, 216,310 ratings, 4.77), Countdown by Find Appiness (1403367428, 189,243, 4.81), Countdown@ (1456997268, 40,457, 4.70), DayCount (1121088244, 26,261, 4.66), Countdown Buddy (1534850579, 26,208), TimeCount (1497946231, 24,617), Countdown: Event Countdown (983258067, 23,903), Days: Countdown & Widgets (939368917, 12,681), Countdown - Pretty Progress (1597616326, 3,112; Home/Lock/StandBy/Dynamic Island).
   - Researched in `docs/seo/research/listicles/countdown-star-alternatives.md` and `day-counter-apps.md` (the same set, with Premium/watch detail) but absent here.
4. Left claims: all consistent with facts.md (Ahead fields, 4-hour Live Activity, Joint Ahead = Premium, "2 Ahead dates ... deleting one doesn't free a slot", "Prices are shown in the app before you buy"). No forbidden items. Clean, use as the wording reference.
5. Structure gaps
   - Has: Checked date, FAQ with FAQPage schema, hero image, how-to-choose. Missing: comparison table, per-app pros/cons lines, an explicit disclosure ("We build Left"), "How we chose", links to the new listicles (0 found).
6. Priority: **High.** Highest-volume query of the set and the most recent structure, but the competitor set is two micro apps; fixing it is the biggest credibility win.

## 2. best-habit-tracker-apps-iphone

1. Title/H1/meta
   - `7 Best Habit Tracker Apps for iPhone (2026) | Left`, H1 matches. Year right, query-led. Meta uses " - " and no differentiator: `Comparing the leading iPhone habit trackers - widget support, schedules, sharing, and which one fits the way you actually work.`
   - Own "best habit tracker app iphone". Suggested meta: `The 7 best habit tracker apps for iPhone in 2026, compared on widgets, schedules, sharing, Apple Watch and price. Honest pros and cons, checked Oct 2026.`
   - Overlap: scheduled `streaks-app-alternatives` (10-26), `habitkit-alternatives` (10-30), `habitify-alternatives` (11-01), `way-of-life-alternatives` (11-13), `productive-app-alternatives` (11-12), `best-streak-counter-apps-iphone` (11-04); live `/habit-tracker` landing page and `habitkit-vs-left`. Keep this as the hub that links to each alternatives post; also near-duplicate app set with best-goal-tracking.
2. Stale facts
   - "Streaks ... It enforces a 12-habit cap on purpose": the store listing now says "Track up to 24 tasks you want to complete each day" (id 963034692; $5.99; 4.81 from 27,353; updated 2026-10-18, v11.5). https://apps.apple.com/us/app/id963034692. Same "12" appears in best-goal-tracking and best-home-screen-widgets.
   - "Streaks ... Widget set is small but tight": post omits that Streaks has an Apple Watch app and timed tasks with Lock Screen countdown (per research sheet).
   - "HabitKit ... One-time purchase with an optional Pro tier": the listing sells HabitKit Pro as 1 Month ($1.99 or $0.99 variants), 1 Year ($11.99) and Lifetime ($29.99); free is limited to 4 habits and widgets are Pro. So it is not "a one-time purchase". https://apps.apple.com/us/app/id6443918070 (4.84 from 2,494; updated 2026-10-20).
   - "Way of Life ... Free with a paid unlock for more than three habits": the listing does not state a free limit; research sheet says Premium "simply unlocks unlimited habits" with a $29.99-heavy price list. Unverified "three". https://apps.apple.com/us/app/id393159800 (4.82 from 5,320; updated 2026-10-02; no Watch).
   - "Done - best minimal counter ... Free for a small number of habits": no app named "Done" found in US search ("Done habit tracker", "Done. simple habit tracker"). Closest is "Do Habits: Get It Done" (id 1103961876, 4.05 from 16,858), which is a different product. Needs identification or removal.
   - "Productive ... subscription": fine (id 983826477, 4.60 from 91,063, last updated 2026-03-19, 7 months, ok). "Strides": fine (id 672401817, 4.79 from 19,245; also has Watch, Mac).
3. Missing apps
   - Habit Tracker by Inner Grow Limited (1438388363, 148,113 ratings, 4.79, updated 2026-10-15; Watch, widgets, Health); Finch (1528595748, 766,051); Me+ (1596403446, 248,524); Fabulous (1203637303, 89,324); Grit (6446997766, 16,124, iOS 26); Habitify (1111447047, 7,143); Routinery (1450486923, 18,086); Awesome Habits (1514915737); (Not Boring) Habits (1593891243, 6,268).
   - Research sheets habitify/habitkit/productive/streak-counter all rank Inner Grow's Habit Tracker, Habitify and Awesome Habits as top alternatives; none is in this post.
4. Left claims
   - "the Habit widget in its Text layout lets you log a habit without opening the app": "Text layout" is not in facts.md (it says the Habit widget is interactive, S/M Home, rectangular Lock Screen). Verify the layout name or drop it.
   - "Multiple completions per day are tracked individually so a '3 glasses of water' habit isn't a binary checkbox": facts.md supports "period x times" goals; keep but reword to "times per day".
   - "a habit Live Activity for evening reminders": facts say a persistent reminder shows a Live Activity one hour before a time the user chooses; "evening" is the post's framing, make it "before a time you choose".
   - "Shared streaks ... (part of Left Premium)": correct. No mention of the free limit (2 habits, 2 streaks): add, competitors' free limits are discussed.
   - The checklist item "Backup and sync" is never answered for Left (see `/support/account-and-sync`).
5. Structure gaps: no Checked date, no disclosure that Left is the author's product (only "best for" framing), no comparison table, no per-app Pros/Cons labels, no "How we chose", FAQ absent (no FAQPage schema, no FAQ block), no links to the new listicles (0). Hero image exists.
6. Priority: **High.** Biggest query in the cluster, three stale/wrong facts, and the hub for six scheduled posts.

## 3. best-goal-tracking-apps-iphone

1. Title/H1/meta
   - `Best Goal Tracking Apps for iPhone (2026) | Left`; H1 same. Fine. Meta ok. Own "best goal tracking app iphone" / "goal tracker app iphone". Suggested meta: `The best goal tracking apps for iPhone in 2026, matched to your goal: deadlines, habits, number targets or projects. Pros and cons, checked Oct 2026.`
   - Overlap: reuses the habit post's Streaks/HabitKit/Strides/Way of Life set; also `blog/aim-goal-tracker-left` and `smart-goals-guide` (live). Differentiate by goal type and consider cutting duplicated habit entries to short pointers.
2. Stale facts
   - "Streaks ... capped at 12 habits": now 24 (see post 2).
   - "Goalsetter / GoalsOnTrack": GoalsOnTrack (id 1464072292) last updated 2022-04-21, 2.50 from 8 ratings, iOS 12.1: abandoned, do not recommend. "Goalsetter" on the US store is GoalSetter+ (1575428267, Finance, 5 ratings) / a kids' savings product: not a goal-mapping app. Replace both.
   - "Strides ... Cons: dated UI; no countdown widgets": Strides now 4.79 from 19,245, updated 2026-10-06, iOS 17.0; "dated UI" and "no countdown widgets" are not supported by the listing; reword or verify. https://apps.apple.com/us/app/id672401817
   - "Things 3 ... paid on every platform": ok ($9.99 iPhone, 28,020 ratings, 4.82, updated 2026-10-19). "Notion": ok (90,447 ratings, free).
   - "Way of Life ... green/yellow/red": the app is green/red with skip; verify "yellow".
3. Missing apps: Finch (766k ratings), Habit Tracker by Inner Grow (148k), Productive (91k, includes goals), Goal Tracker & Daily Planner (901800555, 3,242), Vision Board & Goal Tracker (1668760976, 3,757), Grit (16k). Researched elsewhere: Awesome Habits, Habitify.
4. Left claims
   - "Time Left, Ahead dates, aim, habits, streaks, Planner, and friends live in one visible system": Planner and friends are Premium; no mention anywhere in the post that free is 2 each. Add the Premium note (facts.md).
   - FAQ "most personal goal tracking fits inside Left without adding another app": risks implying unlimited free Aims; qualify with "2 free Aims, unlimited in Left Premium".
   - "aim" is lowercase and the feature name is "Aims"; "Cons: iPhone only" is fine.
5. Structure gaps: no Checked date, no disclosure line (the intro just says "Left sits at the top"), no per-app prices, FAQ without FAQPage schema, no links to new listicles. Has table, hero, Pros/Cons-ish "Best for/Cons".
6. Priority: **Medium.** Moderate volume; two dead picks and one wrong cap make it embarrassing but it is lower-stakes than habit/widgets.

## 4. best-home-screen-widgets-iphone

1. Title/H1/meta
   - `10 Best Home Screen Widgets for iPhone (2026) | Left`: good. Meta `An honest round-up ... which ones earn their space, and which are decoration.` is vague. Suggest: `The 10 best iPhone Home Screen widget apps in 2026, by job: time, looks, photos, shortcuts. Free tiers, pricing, pros and cons, checked Oct 2026.`
   - Own "best home screen widgets iphone". Overlap: `best-free-widget-apps-iphone` (live, same 7 apps), scheduled `best-lock-screen-widget-apps-iphone` (11-05), `widgetsmith-alternatives` (10-22), `widgy-alternatives` (11-06), `color-widgets-alternatives` (11-11).
2. Stale facts
   - "Widgy ... Pros: unbeatable creative control. Cons: ... widgets can break when iOS updates": no listing evidence; fine as opinion. But Widgy has no "Pro" in the free post (see post 5).
   - "Widgetsmith ... The Pro tier adds custom photos and tides": the IAP is named "Widgetsmith Premium" ($1.99/$3.99/$19.99/$29.99 rows); the listing says tide and weather data are Premium only. Rename to Premium and drop unverified "custom photos". https://apps.apple.com/us/app/id1523682319 (4.61 from 776,631; updated 2026-09-28). "most Widgetsmith widgets open the app on tap": unverified in 2026.
   - "Streaks ... Limited to a fixed number of habits ... 12": now 24. "Pros: ... HealthKit integration" ok.
   - "ScreenKit ... Cons: subscription pricing": store 3.87 from 54,840, iOS 17.0; ok but lowest-rated in the list (worth saying).
   - "PhotoWidget": two similarly named apps (Photo Widget: Theme Wallpapers, Photo Widget Inc., 168,879, updated 2026-10-14; "Photo Widget." by Impala Studios, 31,627). Name the developer.
   - "Launcher": store name is "Launcher with Multiple Widgets" (905099592, 3,378 ratings). "Widgetable": store name "Widgetable: Besties & Couples" (4.92 from 387,050): fine.
3. Missing apps (all updated 2026): Themify (1534126062, 344,957), ThemePack (1616629991, 483,765), Photo Widget: Theme Wallpapers (169k), iScreen (1534704608, 153,186), Locket Widget (1600525061, 581,673), Brass (1533158013, 188,262), Mico (1640653011, 100,963), LockWidget (1643112111, 27,912). Research sheets (widgetsmith-alternatives, color-widgets-alternatives, lock-screen-widget-apps) recommend Themify, iScreen, Photo Widget and Launcher: only some are here.
4. Left claims
   - "combines Time Left, Ahead countdowns, habits, streaks, Planner, and friends in the same widget system": Planner/friends Premium; add or soften. "Free tier: Yes" in the table is fine; add "2 each".
   - "log a habit from the Habit widget (Text layout)": "Text layout" not in facts.md (see post 2).
   - "Lock Screen, and StandBy widgets": ok (StandBy = standard widgets). Conflict-of-interest disclosure present ("the conflict-of-interest pick at the top").
5. Structure gaps: no Checked date; has table, FAQ (no schema), hero, disclosure. Table lacks price/rating/platform columns; no "How we chose" beyond the intro; no links to new listicles.
6. Priority: **High.** High-volume head term, the list omits the market leaders by ratings, and two scheduled posts will compete unless this post is positioned as the hub.

## 5. best-free-widget-apps-iphone

1. Title/H1/meta
   - `10 Best Free Widget Apps for iPhone (2026) | Left`: good. Meta fine. Suggest: `The best free widget apps for iPhone in 2026 and what each free tier really includes, from Apple's built-ins to freemium apps. Checked Oct 2026.`
   - Own "best free widget apps iphone / free widgets iphone". Heavy overlap with best-home-screen-widgets (same app list, same order). Make this one about free-tier limits only (what is free in each, with numbers) so the two do not cannibalise.
2. Stale facts
   - "Widgy - free with optional pro ... Pro tier unlocks the editor for building your own ... Cons: building requires paying": the listing shows no Pro; there are paid slot unlocks (Small/Medium/Large Slots $7.99, Lock Screen Slots $7.99, Watchy Slots $7.99, XL Slots $0.99) and tip rows. https://apps.apple.com/us/app/id1524540481 (4.65 from 26,130; updated 2026-09-17).
   - "Widgetsmith ... Premium unlocks more fonts and custom photos": listing only states tide and weather data are Premium-only; free-tier limits not stated. Verify or quote only the sentence on the page.
   - "Top Widgets+ - free": store lists "Top Widgets+ Icons & Themes" (6446477593, 9,308 ratings) and a separate old "Top Widgets" (1.40 stars, 2021). Name the exact app. "Photo Widget - free": ambiguous (see post 4).
   - "ScreenKit - freemium with trial": ok (3.87 from 54,840).
   - "Color Widgets - freemium with ads": listing says "Enjoy Color Widgets for free, with an optional upgrade" and "UNLIMITED WIDGETS"; "ads in the free tier" not confirmed. https://apps.apple.com/us/app/id1531594277
3. Missing apps: Themify, ThemePack, iScreen, Locket Widget, Brass, Mico, Photo Widget: Theme Wallpapers (all in post 4); and `docs/seo/research/listicles/lock-screen-widget-apps.md` adds LockWidget, CARROT Weather.
4. Left claims: the Left section is accurate against facts.md (free = Time Left, widgets, Wallpaper, 2 each; Premium list; "Prices are shown in the app before you buy"). Two soft spots: "Best for: people who want time left, widgets, habits, streaks, countdowns, and Planner in one place" sits directly after the free list, which can read as Planner being free (Planner is Premium); and FAQ "What's the best free widget for productivity? Left's free Time Left widgets make the year, month, week, day, hour, minute, and life visible" is fine. "Left is free to download" ok; never "free forever", and the post does not say it.
5. Structure gaps: no Checked date; no table (the one place a free-tier table is the obvious fit); no disclosure line; no per-app Pros/Cons labels; FAQ without schema; no new-listicle links.
6. Priority: **Medium.** Good query, but fix by differentiating from post 4 and correcting Widgy; can be refreshed in the same sitting as post 4 (still two separate batches, one per URL).

## 6. best-apps-for-adhd-iphone

1. Title/H1/meta
   - `10 Best Apps for People with ADHD (iPhone, 2026) | Left`: fine, though "best adhd apps iphone" is the target; consider `Best ADHD Apps for iPhone (2026): 10 That Help | Left`. Suggested meta: `10 iPhone apps that help with ADHD in 2026: time blindness, routines, focus and reminders. Honest pros and cons plus a three-app stack. Checked Oct 2026.`
   - Overlap: near-duplicate of `best-productivity-apps-adhd` (same Left, Tiimo, Structured, TickTick, Forest, Opal, Habitica, Brain.fm, Reminders and the same "small stack" section). Also `tiimo-alternatives` (10-29), `structured-app-alternatives` (10-28), `best-apple-watch-apps-adhd`, `best-planner-adhd`. Decide which post owns "adhd apps" and which owns "productivity" (suggest: this post = life/time/routine/emotion apps, the other = tasks/work/focus) or merge.
2. Stale facts
   - "Tiimo ... Cons: subscription": the listing is free with Pro (free = "Basic planner, limited AI chats, 1 profile"; 7-day trial on yearly only). Tiimo id 1480220328, 4.60 from 20,994, updated 2026-10-19. Table shows "Subscription": say "Freemium".
   - "Inflow ... Cons: subscription": id 1528183849, 4.37 from 5,632, updated 2026-08-25: ok.
   - "Structured ... Pro tier required for calendar sync": plausible but not confirmed in listing; Structured now has Mac, Watch, web (id 1499198946, 4.79 from 167,825). Table says "Freemium": ok.
   - "Forest ... Paid one-time" (table): the US listing shows price $0.00 (free, with in-app purchases) (id 866450515; 4.80 from 49,551; updated 2026-10-16). https://apps.apple.com/us/app/id866450515
   - "Habitica ... Free": ok (4.31 from 3,548). "Opal": 4.72 from 90,121, ok. "Brain.fm": 4.55 from 5,525, ok.
3. Missing apps: Finch (766k ratings), Routinery (18k, Watch, Mac), Time Timer (332520417, 14,591), Visual Countdown Timer (541364004, 41,190), Endel (33,957), Focus To-Do (14,687), one sec (1532875441, 23,735), Flora (82,895), Goblin Tools (researched in tiimo-alternatives.md, $1.99), Fabulous (89k). Add Goblin Tools and Time Timer for the ADHD-specific "time blindness" topic.
4. Left claims
   - "visible-time widgets are the highest-leverage intervention for the most common ADHD failure (time blindness)" (intro + FAQ "Why is Left at the top"): an efficacy statement; facts.md bans medical/ADHD-treatment claims. Reword as opinion ("many people with ADHD say ... ") or drop "intervention"/"most common".
   - "Best for: time blindness, missing deadlines, can't-feel-the-future ADHD": soften.
   - "a free plan to start (2 countdowns, 2 habits, 2 streaks and 2 aims ...)": correct.
   - After 2 Nov: Focus timer (Premium, v2026.11) can be added as a legit feature; do it in the same refresh.
   - "What apps can't do" disclaimer is good; keep.
5. Structure gaps: no Checked date, no disclosure sentence ("Our bias is real" is in the FAQ only), has table, FAQ with no schema, hero present, no links to the new tiimo/structured alternatives (0).
6. Priority: **Medium.** Real traffic, but needs the owner decision on duplication and is best batched after 2 Nov.

## 7. best-productivity-apps-adhd

1. Title/H1/meta
   - `Best Productivity Apps for ADHD (iPhone, 2026) | Left`, H1 same: ok. Own "productivity apps for adhd". Suggested meta: `11 productivity apps for ADHD on iPhone in 2026: tasks, planning, focus and app blocking, matched to the bottleneck. Pros, cons, a stack to copy.`
   - Overlap: see post 6 (7 of 11 apps identical, same stack advice). Either merge into one or sharpen this to tasks/work apps (Todoist, Things, TickTick, Sunsama, Tiimo, Structured) and cut Brain.fm/Habitica.
2. Stale facts
   - "Forest ... Paid one-time" (table): free with IAP on the US store (see post 6).
   - "Todoist ... Free tier is generous; reminders are paid": consistent with common knowledge, not verifiable via API (id 572688855; 4.80 from 129,957; updated 2026-10-20).
   - "Sunsama ... Subscription": id 1475755747, 4.50 from 511, updated 2026-10-16: ok but only 511 ratings (thin; say so).
   - "Structured ... Pro tier for calendar sync": see post 6.
3. Missing apps: Things 3 (28k; mentioned only in the "stacking mistakes" text), Google Tasks (107k), Microsoft To Do (268,928), Goblin Tools, Routinery, Finch, Time Timer, Endel, Focus To-Do, Flora.
4. Left claims: "Countdowns, year progress, habit streaks - all on widgets": ok. "highest-leverage intervention for the most common ADHD-related productivity failure": same efficacy overclaim as post 6. "Other habit apps track habits and stop. Left combines habits with countdowns, year progress, and friends": comparative claim, fine but "friends" is Premium; add.
5. Structure gaps: no Checked date, no disclosure sentence, has Compare table (no prices/platforms), FAQ without schema, no new-listicle links.
6. Priority: **Medium.** Cannibalises post 6; refresh once, together with post 6's decision.

## 8. best-reminder-apps-iphone

1. Title/H1/meta
   - `10 Best Reminder Apps for iPhone (2026) | Left`: good. Meta is 156+ chars; trim. Suggested: `The 10 best reminder apps for iPhone in 2026, from Apple Reminders to Due and Todoist: what each is for and where it falls short. Checked Oct 2026.`
   - Own "best reminder app iphone". Overlap: the post has no scheduled twin, but Structured and Tiimo appear; the Left section links to `best-countdown-widgets-iphone`. Low overlap risk.
2. Stale facts (App Store)
   - "Due ... Cons: not free": correct, $7.99 (id 390017969; 4.67 from 2,808; updated 2026-10-14).
   - "Things 3 ... paid on every platform (one-time ...)": correct, $9.99 iPhone.
   - "Fantastical ... subscription": listing is free to download with subscription (id 718043190; 4.22 from 24,644; updated 2026-10-13); the 4.22 rating is the lowest of the main calendar apps, mention.
   - "Microsoft To Do": id 1212616790, 4.72 from 268,928; last update 2026-07-06 (3.5 months). "Any.do": 4.62 from 50,550. "TickTick": 4.86 from 46,505. "Structured": 4.79 from 167,825. All current.
   - "Apple Reminders quietly became one of the best iPhone apps in the last two iOS releases": subjective, OK; Reminders has 1,039,885 ratings (4.83), could be quoted.
3. Missing apps: Google Tasks (1353634006, 107,379), Lists To do (571626623, 106,408), MinimaList (993066159, 48,477), Do! Simple To Do List (421819675, 26,190), Reminder & Countdown (471570365, 16,526; updated 2026-01-13), Reminder with Voice (1071899483), Drink Water reminder (niche). Also "Left" competes for the "countdown" gap: add pointer to the day-counter/countdown listicles.
4. Left claims
   - "Joint Ahead ... It's a reminder you can't dismiss because it lives on their phone too": unsupported; Joint Ahead shares a date, it does not stop anyone dismissing anything. Remove or soften.
   - "Left isn't a to-do app. It is a widget-first time and progress tracker for Time Left, Ahead dates, habits, streaks, Planner, and friends": Planner/friends Premium; add note.
   - "Left is iPhone-only" (FAQ): good, matches facts.
   - "optional reminders for Ahead dates and habits": ok (facts).
5. Structure gaps: no Checked date, no disclosure, no comparison table, no FAQPage schema, no hero credit issue, no new-listicle links. Pros/Cons labelled per app: yes.
6. Priority: **Medium.** Decent volume, mostly accurate, mainly structure and one overclaim.

## 9. best-productivity-apps-mac

1. Title/H1/meta
   - `Best Productivity Apps for Mac (2026) | Left`, H1 same. Query-led, year right. Meta is long (about 160 chars). Suggested: `The 10 best Mac productivity apps in 2026: tasks, calendar, launchers, automation, notes and windows, with pricing, pros and cons. Checked Oct 2026.`
   - Own "best productivity apps for mac". Overlap: none in scheduled (it is the only Mac post); `best-productivity-apps-adhd` is cross-linked.
2. Stale facts
   - Apps are mostly Mac-only or desktop tools (Raycast, Alfred, Keyboard Maestro, Rectangle, Obsidian) and the iTunes API does not return reliable Mac records, so price/rating mismatches could not be tested. Verified on the iOS side only: Things 3 $9.99 iPhone (Mac and iPad priced separately, "Paid one-time on each platform" ok), Todoist 4.80 from 129,957, Notion 4.78 from 90,447, Obsidian 4.48 from 2,785, Fantastical free + subscription, Raycast has an iOS app (6503428327, 4.50 from 252 ratings, "Raycast: AI, Notes and more"), so "launcher" framing should mention the iPhone app is a different product.
   - "Alfred ... Paid Powerpack", "Keyboard Maestro ... Paid one-time", "Rectangle ... Free ... Rectangle Pro": not on the store via API; verify on the vendors' sites before the refresh and add a Checked date.
3. Missing apps: not checkable via the API; candidates from the researched sets that have Mac apps: TickTick (Mac), Structured (Mac, free), Routinery (Mac), Strides (Mac), Any.do, Microsoft To Do. Also consider Bear, Craft, Amie (verify). Mark as candidates, not facts.
4. Left claims (forbidden or risky)
   - Intro: "On a Mac you see it through its iPhone widgets on the desktop, or with your iPhone in StandBy beside the screen."
   - "1. Left": "On the Mac, Left shows up through its iPhone widgets: from macOS Sonoma, iPhone widgets can sit on the Mac desktop and in Notification Center."
   - FAQ "Can I see Left on my Mac? Yes, through its iPhone widgets: from macOS Sonoma, iPhone widgets can sit on the Mac desktop ..."
   - facts.md (2026-10-19) lists "iPhone widgets on Mac" under never-claim, but LANE-NOTES (2026-10-20, commit `26eac76c`) deliberately rewrote this post to describe Left on the Mac through iPhone widgets (macOS Sonoma or later), never "no Mac app". The two rules conflict. Lane 0 should confirm which wins. If facts.md wins, a safe rewrite avoids both phrases: "Left is built for iPhone, so it sits beside your Mac rather than on it: put the iPhone in StandBy on the desk".
   - Table row "Visible time / widgets (iPhone companion), Freemium" and "Cons: built for iPhone, so on the Mac it appears through iPhone widgets": same issue.
   - Also: ranking an iPhone-only app #1 on a Mac list is a relevance risk; consider moving Left to a short "Add a visible-time layer" section at the end.
5. Structure gaps: no Checked date, no disclosure, table lacks price/platform columns, FAQ without schema, three sample stacks fine, no new-listicle links.
6. Priority: **High (rule conflict).** The Mac-widget wording appears three times and needs an owner decision; it is also the post where Left least belongs, so keep any refresh minimal.

## 10. best-planner-adhd

1. Title/H1/meta
   - `How to Choose the Best Planner for ADHD (2026) | Left`; H1 `How to Choose the Best Planner for ADHD` (no year; fine for a guide, add (2026) for consistency). Query-led for "best planner for adhd". Suggested meta: `How to choose a planner that works with ADHD: paper, bullet journal, digital or hybrid, plus a 5-minute daily setup. No-shame, practical, updated 2026.`
   - Overlap: `best-apps-for-adhd-iphone`, `tiimo-alternatives` (digital planner), `structured-app-alternatives`. Mostly distinct (paper vs digital); good.
2. Stale facts: this post names few apps (Notion, GoodNotes, Things 3, Apple Reminders/Calendar) and paper brands (Hobonichi, Leuchtturm, Moleskine, Panda Planner). Things 3 "paid one-time": correct ($9.99). GoodNotes: id 1444383602, 4.72 from 463,768, updated 2026-10-18. Paper brand claims ("Panda Planner ... with ADHD in mind") not verified, low risk. Nothing numerically stale.
3. Missing apps: Tiimo and Structured (the dominant digital ADHD planners: 20,994 and 167,825 ratings) are absent in the digital section; Planny and Sorted³ (researched). Add one line each plus links to the alternatives posts.
4. Left claims
   - "Left does have a Planner day view (part of Left Premium)": correct. 
   - "It's the time layer that makes a paper or digital planner usable for someone with time blindness": softly efficacious; fine as opinion, but avoid "usable for someone with time blindness" as a promise.
   - Others (countdown widget on Lock Screen "12 days", year progress, habit widget): ok.
5. Structure gaps: guide format so listicle elements do not all apply; missing "Checked" line on the few app claims, FAQ without schema, no links to the new listicles, no disclosure beyond "Where Left fits".
6. Priority: **Low.** Evergreen guide, little stale; fold into the ADHD-cluster batch.

## 11. best-apple-watch-apps-adhd

1. Title/H1/meta
   - `9 Best Apple Watch Apps for ADHD (2026) | Left`; H1 `9 Best Apple Watch Apps for ADHD` lacks the year. Query-led for "apple watch apps for adhd". Meta fine; suggested: `The 9 best Apple Watch apps for ADHD in 2026: schedules, reminders, habits, focus and breathing, with honest pros and cons. Checked Oct 2026.`
   - Overlap: none in scheduled except Tiimo/Structured alternatives; keep.
2. Stale facts
   - "7. Stretchly / pause apps ... Various wrist-tap apps": Stretchly is a desktop break-timer; the US store's "Stretchly - Stretch At Home" (6747384166; 10 ratings; last updated 2025-09-17) is an unrelated stretching app. No Watch app. Replace with a real Watch app (e.g. Time Timer, 332520417, 14,591 ratings, or Apple's built-in Mindfulness/Stand).
   - "Streaks ... has an excellent watch app ... complication": consistent with the research sheet (Watch listed). "capped number of habits": now 24.
   - "Forest ... The watch shows the growing tree": unverified; the Forest listing (id 866450515) does not mention Apple Watch in the API data. Verify before keeping; also "paid" nowhere stated, ok.
   - "Tiimo ... On the watch, it shows your current activity ...": plausible, Tiimo is on watchOS per its own site (research sheet). "Structured ... Requires Pro for calendar sync": see post 6.
   - Calm 4.77 from 1,989,059; Headspace 4.84 from 973,797: fine.
3. Missing apps with Watch support (from research sheets): Habit Tracker by Inner Grow (Watch), Routinery (Watch), Fabulous (Watch), Habitify (Watch), Awesome Habits (Watch), Akiflow (Watch), Time Timer. Add at least Inner Grow's Habit Tracker and Time Timer.
4. Left claims
   - "We build Left, which is an iPhone app with no watch app, so it isn't on this list." and FAQ "Does Left have an Apple Watch app? No. Left is an iPhone app.": factually true today and not a forbidden positive claim, but facts.md says "not until it ships", so it will go stale and force another refresh and another translation wipe. Reword to avoid the negation ("Left is an iPhone app, so it isn't on this list") and drop the FAQ or answer "Left runs on iPhone; its widgets and Live Activities cover glanceable time on the phone".
   - "Top slot: a countdown or next-event complication": generic watch-face advice, does not imply Left; fine.
   - "Focus modes with Left" link and "your timer Live Activity": the Focus timer ships v2026.11 (Premium); do not imply it exists before 2 Nov.
   - No mention of Left on the Watch, no "wrist" claim: compliant.
5. Structure gaps: no Checked date, no table, no FAQPage schema (FAQ present), disclosure present ("We build Left"), no new-listicle links; per-app Pros/Cons present.
6. Priority: **Low.** Niche query, Left is not on it; fix Stretchly and the negation in the ADHD-cluster batch.

---

## Cross-cutting

- **Dead freshness signal.** All 11 posts show "Updated October 20, 2026" and dateModified 2026-10-20, but only `best-countdown-widgets-iphone` has "checked" dates and sourced facts. Add a "Checked <date>" line (as in `best-days-since-apps-iphone`) to each post in its single refresh, and quote 1-2 verifiable numbers per app (price model, update date).
- **Streaks cap "12" is wrong in 3 posts** (habit, goal, home-screen; also implied in the watch post). Store now says 24 tasks. One fact, four posts.
- **Left Premium gating is under-explained.** Habit, goal, home-screen, reminder and Mac posts list "Planner, and friends" next to free features with no Premium qualifier; add the standard sentence ("2 of each free; unlimited, Planner, friends in Left Premium; Prices are shown in the app before you buy").
- **"Text layout" for the Habit widget** appears in 2 posts (habit, home-screen) and is not in facts.md; confirm with the app source or drop.
- **ADHD cluster (4 posts)**: efficacy language ("highest-leverage intervention", "most common ADHD failure") in 2 posts, near-duplicate sets in 2, and the Left Focus timer launches v2026.11 (~2 Nov, Premium). Recommend one refresh per post after 2 Nov, decide first whether apps-for-adhd and productivity-apps-adhd stay separate.
- **Widget cluster**: home-screen and free-widget posts overlap 7 of 10 apps and both miss Themify, ThemePack, Photo Widget, iScreen, Locket, Brass. Position home-screen as "by job" and free as "free-tier limits table", and link both to the scheduled lock-screen, widgetsmith, widgy and color-widgets posts.
- **Missing structure in 9 of 11 posts**: no Checked line, no FAQPage JSON-LD (only countdown has it; FAQ text exists in most), mostly no comparison table with price/platform columns, no "How we chose" section, no links to the new listicles (0 in all 11). `best-days-since-apps-iphone` has 12 such links and the schema; use it as the template.
- **Timing and links.** The new listicles publish 2026-10-22 through 2026-11-13 (`i18n/publish-schedule.json`). A refresh before a target post publishes would add 404 links. Recommended sequence: (1) one refresh each for habit, home-screen, countdown and Mac in the week after 2026-11-13 (when all linked listicles are live), or earlier only for Mac if the forbidden claim must go now (accept one extra translation wipe, or have the owner waive); (2) ADHD cluster (apps-for-adhd, productivity-adhd, planner, watch) after 2026-11-02 with the Focus timer, in the same window; (3) free-widget, reminder, goal in the following batch.
- **Ratings caution.** Several named competitors have tiny rating counts (Costhap 7, DayDrop 21, Sunsama 511). A "best" list should say so or swap them for the large apps researched in `docs/seo/research/listicles/`.
- **Store data worth knowing:** Left's own store record lists iPad in supportedDevices (iPhone app runnable on iPad); site copy says iPhone only. Not a post issue, but check that the App Store compatibility setting matches the site's "iPhone only" wording.
