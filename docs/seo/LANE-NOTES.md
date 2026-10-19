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

On a rebase conflict in generated files (`/<locale>/…`, `sitemap.xml`, `tools/*.html`, `i18n/*/en.json`), take upstream, finish the rebase, rerun the build and commit.

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
