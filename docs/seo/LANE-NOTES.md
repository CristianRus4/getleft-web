# Lane notes from Lane 0 (read before you continue)

Updated 2026-10-19 by the orchestrator session. Pull `origin/main` first.

## What changed on main

**One build command.** `node scripts/build.mjs` runs, in order:
1. the tools generator;
2. English page normalisation (`scripts/site-inject.mjs`);
3. the locale build and sitemap (`scripts/build-i18n.mjs`);
4. the translation report and gate (`scripts/check-i18n.mjs --gate`);
5. the site checks (`scripts/check-site.mjs`).

It must pass before every push. Commit everything it writes.

**Locale registry.** `i18n/locales.json` lists every locale: folder, `htmlLang`, hreflang codes, `og:locale` and detect aliases.
- A locale goes live when `i18n/locales/<code>.json` exists. Creating `i18n/locales/pt-BR.json` is enough to publish `/pt-BR/`.
- `es-419` is no longer emitted as an hreflang code, because Google does not support it. `/es-419/` pages carry es-MX, es-US, es-AR and the other Latin American codes; `/es/` carries `es` and `es-ES`; `/pt/` carries `pt` and `pt-PT`.

**Staleness tracking.** `i18n/source-hashes/<loc>.json` records which English text each translation was made from.
- `node scripts/check-i18n.mjs --verbose` lists missing, stale and extra keys per locale.
- After you have reviewed and updated a locale, run `node scripts/check-i18n.mjs --accept <loc>` and commit the result. Each lane owns its own locales' hash files.
- Stale keys report as warnings. The gate only fails on real errors in current keys: placeholders, markup, protected terms, structure.
- Missing keys fall back to English, which is allowed.

**English copy changed in `i18n/locales/en.json`.** Update every locale.

| Change | Keys |
|---|---|
| New keys | `common.nav.tools`, `common.nav.blog`, `common.footer.blog`, `common.footer.cookie_settings`, `common.consent.{label,text,accept,decline,privacy}`, `index.blog.{eyebrow,h2,p,all}`, `index.blog.links.{year_progress,streak,time_blindness,countdown_widgets,add_widgets,smart_goals}` |
| Changed keys | `index.meta.title`, `index.meta.description`, `index.meta.og_description`, `index.bento.p`, `index.faq.items[0].a`, `support.support.meta.description`, `support.support.p_15`, `support.support.p_22` |
| Removed keys (delete them from your catalogs) | `index.bento.items.{time_between,mood,world_mood}`; `index.faq.items[13]` and `[14]` (the English list now has 13 items); `support.support.{tutorial_title_28,tutorial_title_29,p_55,p_56,summary_31,summary_32,p_60,p_61}`; `support_articles.choose_your_tools.li_extra_8` |

The removed keys are for Mood, World Mood and Time Between, which are hidden in the production app, and the old "free forever" claim. Never reintroduce them.

## Blog, tools and standalone pages are translatable now

These pages are not annotated on disk. The build extracts their English into content-hash catalogs:
- `i18n/blog/en.json`
- `i18n/tools/en.json`
- `i18n/pages/en.json` (press, privacy, and the landing pages once they exist)

The build regenerates these English catalogs, so never edit them by hand.

**To translate:** create or extend `i18n/<family>/<loc>.json` with the same structure, translating only the values:

```json
{ "blog": { "how-to-build-a-streak": { "t1a2b3c4d5e": "…", "a0f9e8d7c6b": "…" } } }
```

- `t…` keys are block HTML: an element's inner HTML. Keep every tag and attribute exactly. The "Download for iOS" button contains an inline `<svg>`; copy it unchanged.
- `a…` keys are attribute values: alt text, aria-label, title, meta description, og and twitter. They are plain text, already entity-decoded.
- `l…` keys are JSON-LD strings.
- Tool runtime strings live under `tools.runtime` and mirror `i18n/tools-runtime/en.json`. Plural forms are objects: `{"one": "…", "other": "…"}`, plus `few`/`many`/`two`/`zero` where the language needs them.
- **Publishing threshold:** a page's locale copy (for example `/de/blog/how-to-build-a-streak`) is published only once at least 90% of that page's units are translated. Until then the URL does not exist, and hreflang and links point to English. Do whole pages, not scattered strings.
- **When English changes:** if an English sentence is edited, its hash changes. The old translation becomes orphaned (the report counts orphans) and that sentence falls back to English until you translate the new key. Delete orphans when you touch a page.
- **Inline tool scripts are still English.** Many tools build result text in their inline scripts (for example "days sober" or "That date has passed."). That needs a generator change in `scripts/build-tools-seo.mjs`, which Lane 3 will route through `toolT()`/`toolPlural()` in `tools/tools.js`. Translate the catalogs; ignore those strings for now.

## Lane 3 (English content): handover

- `blog/*.html` and the tool copy in `scripts/build-tools-seo.mjs` are now yours, as planned.
  - Lane 0 keeps the `nav()`, `downloadBlock()`, head and `APP_URL` helpers in that script.
  - Never edit inside `<!-- left:… -->` or `<!-- i18n:… -->` marker blocks; the build owns them. That includes the nav and footer links, analytics, consent, smart banner, hreflang, detect script and switcher.
- **Landing pages.** The 7 landing pages are already registered in the `pages` family in `i18n/locales.json`. Creating the files is enough: the build adds analytics, CTA tagging, the sitemap entry and translation extraction.
  - Use `data-cta="hero|inline|end"` on download links.
  - Point hrefs at `https://apps.apple.com/app/id6740155884`.
- **Two blog fixes already made.** Lane 0 corrected two blog sentences that claimed "free forever" or Time Between, in `best-free-widget-apps-iphone` and `habitkit-vs-left`. Keep the new wording.
- **Making tool inline scripts translatable.** Wrap user-visible strings in the inline result code with `toolT('key', vars)` / `toolPlural('key', n)`, and add the English strings to `i18n/tools-runtime/en.json` (Lane 0 owns that file; tell Lane 0 the keys and English values in your report, or add them and say so).
- `/android` still redirects to `/web` in `_redirects`. Lane 0 removes that redirect once `android.html` is on main.

## Gate summary before you push

```sh
git fetch origin && git rebase origin/main
node scripts/build.mjs        # must end with "✓ build passed"
git add -A && git commit
git push origin HEAD:main
node scripts/indexnow.mjs     # tells Bing about the pages you changed
```

On a rebase conflict in generated files (`/<locale>/…`, `sitemap.xml`, `tools/*.html`, `i18n/*/en.json`, `docs/seo/publish-schedule.md`), take upstream, finish the rebase, rerun the build and commit.

## Update, 2026-10-19 20:45: Apple Watch hidden, Focus stays

The owner confirmed today:
- **Apple Watch is not ready.** The website must not claim a Left Apple Watch app or complications until it ships.
- **Mood stays hidden.**
- **Focus ships in v2026.11** (about 2 November) and stays visible.

What Lane 0 changed:
- **Noindexed:** `support/apple-watch-app` and `blog/left-apple-watch-app` (URLs stay live).
- **Unlisted:** the watch support article is out of the "Related guides" lists.
- **Home:** the Apple Watch feature row is gone.
- **`llms.txt`:** watch claims removed.
- **`i18n/locales/en.json`:** watch mentions removed from these keys. Translators: update them in every locale; `check-i18n --verbose` lists them as stale.

| Change | Keys |
|---|---|
| Changed | `index.meta.description`, `index.meta.og_description`, `index.bento.items.{widgets,fasting,focus}.body`, `index.faq.items[9]` (now "Can I see Left on my Lock Screen?"), `index.faq.items[11].a`, `index.faq.items[12].a`, `support_articles.aims_in_left.{h2_7,p_12}`, `support_articles.apple_health_automatic_tracking.p_5`, `support_articles.fasting_in_left.{h2_4,p_6}`, `support_articles.focus_timer_in_left.{meta.description,p_1,h2_5,p_7}`, `support.support.{p_58,p_59}` |
| Removed | `index.features.watch.*`, `support.support.{tutorial_title_24,p_51}` |

The `support_articles.apple_watch_app.*` keys stay, because the noindexed page still exists. Translating them is lowest priority.

Lane 3 (Ava), in the blog and your landing pages:
1. Remove every claim that Left has an Apple Watch app, works on the wrist, or has watch complications. Saying that other apps have watch apps is fine.
2. In `blog/best-apple-watch-apps-adhd.html`, drop Left from the list if it is presented as a watch app.
3. Remove the `left-apple-watch-app` card from `blog/index.html`.
4. Write the landing pages without Apple Watch.

## Update, 2026-10-20: Bing and IndexNow

getleft.app is now in Bing Webmaster Tools. After every push to main, run `node scripts/indexnow.mjs`; it is now the last line of the push loop above. It tells Bing (and Yandex, Naver and Seznam) which pages changed, so new locale pages are crawled within minutes. It is safe to run from any worktree: it works out the changed pages from `origin/main` itself. If it fails, mention it in your report and carry on.

## Update, 2026-10-20: iPhone widget support articles corrected

Lane 0 rewrote the English in the iPhone Home Screen and Lock Screen widget articles so every claim matches the app source and Apple's iOS 26 guide. What it fixed: the "Smart" picker (it does not exist; widgets have a **Select date** parameter); "iOS 16" and "iPhone 8" (Left needs iOS 26); circular widgets "above the clock" (only one single-line widget fits in the date line; circular and rectangular widgets go in the row below the clock); the old "+" button (iOS 26 uses **Edit → Add Widget**); per-size content claims; resizing in place.

Translators: update these keys in every locale; `check-i18n --verbose` lists them as stale.

| Article | Changed keys |
|---|---|
| `support_articles.widget_iphone_home_screen` | `li_1`, `li_extra_2`, `li_extra_3`, `li_extra_5`, `li_extra_7`, `li_extra_10`, `li_extra_11`, `li_extra_12`, `li_extra_13`, `p_3`, `p_4` |
| `support_articles.widget_iphone_lock_screen` | `p_1`, `li_1`, `li_3`, `li_4`, `li_extra_2`, `li_extra_3`, `li_extra_6`, `li_extra_7`, `li_extra_10`, `li_extra_12`, `li_extra_13`, `p_extra_14` |

Keep the app's UI labels as the app shows them in your language: **Ahead**, **Since**, **Select date**, **Text**/**Grid**, and the widget names Ahead, Habit, Streak, Aim, Year, Month, Week, Day, Time Ahead list, Streaks list. Use Apple's own iOS wording for **Edit**, **Add Widget**, **Add Widgets** and **Done** in your language.

**Broken images removed.** The 19 `left-tutorial-*.webp` images were deleted earlier and returned 404 on 11 support pages. The Home Screen article's Step 1 image now uses `images/left-steps-light-2.webp`; the other 18 `<img>` lines are gone. No catalog keys changed for this.

## 2026-10-20 - iPad, Mac and StandBy widget articles corrected (English)

Changed in `i18n/locales/en.json` (translation lanes: these strings need re-translating):
- `support_articles.widget_ipad_home_screen`: `li_extra_1`, `li_extra_2`, `li_extra_3`, `li_extra_5`, `li_extra_8`, `li_extra_11` (Smart -> Select date), `li_extra_12`-`15` (sizes; Extra Large only for list-style widgets), `h2_4`, `p_2`
- `support_articles.widget_ipad_lock_screen`: `p_1` (iPadOS 26), `li_1`, `li_3`, `li_4`, `li_extra_2`, `li_extra_3`, `li_extra_6`, `li_extra_10` (Smart -> Select date), `p_extra_12`
- `support_articles.widget_mac_desktop` and `widget_mac_notification_center`: rewritten. Left has no Mac app (no Mac target, Mac Catalyst off), so the articles now describe Sonoma+ "Use iPhone widgets" (same Apple Account, iPhone nearby). Keys: `meta.description`, `h2_2`, `p_1`, `li_extra_1`, `li_extra_2`, `li_extra_9`, `p_extra_10`/`p_extra_11`, plus `h2_7`/`p_2`/`li_5`/`li_6` (desktop) and `li_1`, `li_3`, `li_7`, `li_8` (Notification Center). Also `og_description`/`p_9` (desktop), the Notification Center meta description, `widget_size_mac`.
- `support_articles.widget_iphone_standby`: `li_extra_1` (iOS 26), `p_extra_11` (no "iOS 17").
- Account sync copy no longer says "and Mac": the Sign in with Apple meta description, `og_description` and `p_47`.

## Update, 2026-10-20: Lane 0 translates the blog

- **Lane 0 owns the `blog` family for every locale.** It is translating all blog posts into all 18 locales in parallel from the main account. Lanes 1 and 2: don't create or edit `i18n/blog/<loc>.json`. Your Phase 2 is the `pages` and `tools` families only.
- **Blog English is frozen while this runs.** Lane 3: don't edit `blog/*.html` without telling Lane 0 first. Any change to a sentence changes its hash and drops the translations of that sentence in every locale. Fixes for factual errors are fine, but list them in your report.

## Update, 2026-10-20: a Mac app is coming, so don't say there isn't one

The owner says Left will have a Mac app soon. It hasn't shipped, so the site must not claim one yet, but it must not say "Left has no Mac app" either: that sentence goes stale on launch day. Describe what works today (iPhone widgets on macOS Sonoma or later) and leave the Mac app unmentioned.

Lane 0 reworded the Mac articles accordingly. Translators: these keys changed again, so re-translate them (they replace the "no Mac version" wording above):

| Article | Changed keys |
|---|---|
| `support_articles.widget_mac_desktop` | `p_1`, `p_2`, `p_extra_10` |
| `support_articles.widget_mac_notification_center` | `p_1`, `li_7`, `p_extra_11` |

Blog follow-up for Lane 0, after the blog English freeze lifts: `blog/best-productivity-apps-mac.html` says Left has "no Mac app, menu-bar item or Mac widget". The Mac widget part is already wrong, because iPhone widgets show on the Mac desktop and in Notification Center from macOS Sonoma. Reword it to describe Left's widgets on the Mac through iPhone widgets, without saying Left has no Mac app.

**Mac app (owner says it is coming):** the Mac articles (`widget_mac_desktop`, `widget_mac_notification_center`) describe iPhone widgets on Mac because Left has no Mac app yet. When the Mac app ships, rewrite them for the native app, and restore "one purchase covers iPhone, iPad and Mac" copy only once it is true.

## Update, 2026-10-20: drip publishing

New content now goes live gradually instead of all at once. The owner's policy:
- at most **one new English page** a day, highest search value first;
- translations go out in **releases**, one language of one family (for example "blog in French"), at most **one release** a day;
- updates and fixes to pages that are already live are never throttled, including translation fixes;
- dates are New Zealand dates.

**The calendar.** `i18n/publish-schedule.json` is the single source of truth. **Only Lane 0 edits it.** The build turns it into `docs/seo/publish-schedule.md`, which shows every dated item as scheduled or live and lists the translations that are ready but held.

```json
{
  "pages":    { "blog/new-article.html": "2026-10-23" },
  "releases": { "blog/fr": "2026-10-21", "tools/ja": "2026-10-24" }
}
```

**Translation lanes: push finished translations whenever you like.**
- A locale copy of a `blog`, `tools` or `pages` page is published only when it is at least 90% translated **and** its release (`<family>/<locale>`) has a date on or before today.
- With no date, the family/locale is **held**: no URL, no sitemap entry, no hreflang, no switcher entry, no links. It is held until Lane 0 schedules it, so pushing it is safe. Your report should say which family/locales are ready.
- Already released: `blog/de`, `blog/es`, `blog/es-419`, `pages/ja`, `pages/zh-Hant`, `tools/ja` (dated 2026-10-20, the pages that were live when this started).
- Fixes to a released family/locale publish with your next push, as before.
- Once a family/locale is released, further pages of it that reach 90% also publish with the next build. To drip them, finish a family/locale before Lane 0 releases it.
- The `site` family (home, support, contact) is never scheduled.

**New English pages go in `scheduled/`.**
- Put the page at `scheduled/<path>`, the same relative path it will have (`scheduled/blog/new-article.html`). Lane 0 then adds `"blog/new-article.html": "<date>"` to `pages`.
- The build and the checks skip `scheduled/`, and the live site returns 404 for `/scheduled/*`. On or after the date, the build moves the page to `<path>`, and the normal pipeline takes over: canonical, nav, analytics, sitemap and translation extraction.
- **Don't link to a scheduled page from a live page** (including `blog/index.html` cards, related links and `llms.txt`). The build fails with `<file> links to <url>, which is scheduled for <date>`. Add the links on or after the page's date. Links between scheduled pages are fine.
- A new landing page still needs its entry in the `pages` family of `i18n/locales.json`. It can go in before the date, because missing files are ignored.
- Tool pages come from `scripts/build-tools-seo.mjs` and can't wait in `scheduled/`. Add a new tool to the generator on its publish day.

**Lane 0: scheduling.**
- Release: add `"<family>/<locale>": "YYYY-MM-DD"` to `releases`, run the build, push.
- New page: add `"<path>": "YYYY-MM-DD"` to `pages` once the file is in `scheduled/`, run the build, push.
- A date of today publishes on that push. A future date publishes on the day, through the workflow below.
- The check fails if two future releases, or two future pages, share a day. It also fails if a future page is missing from `scheduled/` or already sits at its live path.

**The daily publish.** `.github/workflows/daily-publish.yml` runs at 07:15 NZ time (18:15 UTC) and can be started by hand (`gh workflow run daily-publish.yml --repo CristianRus4/getleft-web`). It:
1. runs the scheduler self-test;
2. builds `main` with `LEFT_SKIP_I18N_GATE=1`, which skips only the translation-engine gate, because the engine is not in CI;
3. commits any changes as `github-actions[bot]` (`Daily publish 2026-10-21: blog/fr`) and pushes to main, where Cloudflare deploys it;
4. submits the changed URLs to IndexNow.

When nothing changed it commits nothing, so a second run on the same day is harmless. Whoever builds first on a publish day publishes the due items, the workflow or a lane, and either is fine. If a page fails the checks on its day, the run fails and nothing is pushed; GitHub emails the owner.

**Tests.** `node scripts/check-publish.mjs --selftest` builds a throwaway copy of the repo on three fixture dates (release held, release live, new page live) and checks files, sitemap, hreflang and links. Run it after touching `scripts/lib/publish.mjs`, `build-i18n.mjs` or the workflow.

Never run a `BUILD_DATE=…` build in your worktree: it moves scheduled pages into place. Use the self-test.

## English copy changed in `i18n/locales/en.json` (content audit, 2026-10-20)

Lane 3 corrected factual errors in `support.html` and `support/*.html` (details in `docs/seo/content-audit-2026-10.md`). Translators: these keys now have new English, so the existing translations are stale and must be redone.

Changed values:
- `support.support.li_10`
- `support.support.li_11`
- `support.support.li_2`
- `support.support.li_8`
- `support.support.li_9`
- `support.support.p_13`
- `support.support.p_16`
- `support.support.p_17`
- `support.support.p_19`
- `support.support.p_24`
- `support.support.p_28`
- `support.support.p_33`
- `support.support.p_35`
- `support.support.p_37`
- `support.support.p_47`
- `support.support.summary_17`
- `support.support.widget_size_home`
- `support.support.widget_size_lock`
- `support_articles.account_and_sync.p_1`
- `support_articles.account_and_sync.p_7`
- `support_articles.accountability_with_friends.li_extra_6`
- `support_articles.accountability_with_friends.li_extra_7`
- `support_articles.accountability_with_friends.li_extra_8`
- `support_articles.choose_your_tools.li_extra_7`
- `support_articles.choose_your_tools.p_extra_1`
- `support_articles.joint_ahead_dates.li_extra_1`
- `support_articles.streaks_vs_habits.li_extra_1`
- `support_articles.wallpaper_shortcut.li_extra_10`
- `support_articles.wallpaper_shortcut.li_extra_11`
- `support_articles.wallpaper_shortcut.li_extra_12`
- `support_articles.wallpaper_shortcut.li_extra_2`
- `support_articles.wallpaper_shortcut.li_extra_6`
- `support_articles.widget_ipad_home_screen.li_extra_1`

New keys (Premium notes and one tool):
- `support_articles.accountability_with_friends.p_premium`
- `support_articles.add_friends.p_premium`
- `support_articles.choose_your_tools.li_extra_8`
- `support_articles.joint_ahead_dates.p_premium`
- `support_articles.set_up_your_lifespan.p_premium`

Removed from the HTML but still present as keys in `en.json` (safe to delete): `support_articles.set_up_your_lifespan.li_4`, `support_articles.set_up_your_lifespan.li_extra_4`, `support_articles.iphone_action_button_left.h2_5`, `support_articles.iphone_action_button_left.p_extra_14`, `support.support.widget_size_mac`.
Not in `en.json` (hand-written English in the page, translated through the pages catalog): the `press.html` widget sentence.

## English copy changed in `i18n/locales/en.json` (content audit fixes, batch 2)

New English, so existing translations of these keys are stale. Titles of `contact.html` and `support.html` changed in the HTML as well; `press.html` and `web.html` titles and `tools/*` copy are not in `en.json`.

Changed values:
- `contact.meta.title`
- `support.support.meta.title`
- `index.blog.links.add_widgets`

New keys ("See also" lines linking landing pages from support articles):
- `support_articles.widget_iphone_home_screen.p_landing`
- `support_articles.widget_iphone_lock_screen.p_landing`
- `support_articles.widget_iphone_standby.p_landing`
- `support_articles.edit_or_remove_widget_iphone.p_landing`
- `support_articles.widget_transparent_iphone.p_landing`
- `support_articles.streaks_vs_habits.p_landing`
- `support_articles.aims_in_left.p_landing`
- `support_articles.organise_ahead_since.p_landing`
- `support_articles.joint_ahead_dates.p_landing`
- `support_articles.add_friends.p_landing`
- `support_articles.accountability_with_friends.p_landing`
- `support_articles.wallpaper_shortcut.p_landing`
- `support_articles.set_up_your_lifespan.p_landing`
- `support_articles.apple_health_automatic_tracking.p_landing`
- `support_articles.left_shortcuts.p_landing`
- `support_articles.focus_modes_with_left.p_landing`
- `support_articles.choose_your_tools.p_landing`

## English copy changed in `i18n/locales/en.json` (content audit fixes, batch 3)

Changed value (existing translations stale): `support_articles.account_and_sync.li_7`.

New keys (free-plan lines): `support_articles.aims_in_left.p_free`, `support_articles.streaks_vs_habits.p_free`, `support_articles.organise_ahead_since.p_free`.

New tool runtime keys in `i18n/tools-runtime/en.json` (also mirrored in `tools/tools.js`): `result.hoursAndMinutes`, `result.minutesExtra`, `result.readingDetail`, `result.workdaysAt`, `result.minutesSince`, `result.schoolDays`, `result.weekdaysMinusBreaks`, `result.businessAfter`, `result.businessBefore`, `result.futureTime`.
