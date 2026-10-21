# Focus release-day checklist (v2026.11, about 2 November 2026; CNTXT-886)

Branch: `seo/focus-prep` (pushed to origin, **not merged**). Nothing here is live until you merge.
Facts it is based on: `docs/seo/research/focus-facts.md` (read from the app source on 2026-10-21; recheck step 1 first).

## What is on the branch

| Change | Files |
|---|---|
| Focus facts sheet | `docs/seo/research/focus-facts.md` |
| Corrected English copy: support article, home FAQ item "How does the Focus Pomodoro timer work?", home bento "Focus timer" card, `llms.txt` | `support/focus-timer-in-left.html`, `index.html`, `i18n/locales/en.json` (English keys only), `llms.txt` |
| Landing page draft (scheduled, not dated) with hero | `scheduled/pomodoro-timer-iphone.html`, `images/blog/pomodoro-timer-iphone-hero.webp`, a row in `docs/seo/image-credits.md` |
| This checklist | `docs/seo/focus-release-checklist.md` |

The copy changes are already correct for the shipped app, but they describe Focus as available. If the branch merges before Focus is on the App Store, the site describes a feature people cannot get. Merge on release day, not before.

`docs/seo/changelog.csv` did not exist on main when this branch was prepared, so no changelog rows were added. Add one row each for the four copy changes (support article, home FAQ, home bento, `llms.txt`) and one for the landing page when you merge, if the file exists by then.

## 1. Before merging: is Focus really out?

1. The App Store shows Left 2026.11 (or whatever the release number is), and its "What's New" mentions Focus. `Left.xcodeproj/project.pbxproj` carries `MARKETING_VERSION` for the shipped build.
2. Open the build and confirm Focus is in it: Tools → Focus, the Focus widget in the widget gallery, and the Live Activity on a started session. In the source, `ProductionFeatureGate.swift` has `.focus` commented out of `unreleasedFeatures` and `LeftWidgetsBundle.swift` registers `FocusWidget()` and `FocusLiveActivityWidgetExtension()`; if the release re-gated it, none of this ships.
3. Re-read `docs/seo/research/focus-facts.md` against the release: durations 1 to 60 minutes, the four styles (Digital, Clock, Squares, Pulse), Premium gate. If the app changed (a duration range, a style, a new Focus feature, a different gate), update the support article, FAQ, bento, `llms.txt` and the landing page before merging.

## 2. What to merge

```sh
cd ~/Developer/Webs/getleft-web
git fetch origin && git checkout seo/focus-prep && git rebase origin/main
node scripts/build.mjs        # must end with "✓ build passed"
git add -A && git commit      # only if the build changed files
git push origin HEAD:main     # or merge the branch
node scripts/indexnow.mjs
```

Rebase conflicts in generated files (`/<locale>/…`, `sitemap.xml`, `docs/seo/publish-schedule.md`, `i18n/*/en.json`): take upstream, finish the rebase, rerun the build.

The branch contains these four content changes (the rest of the diff is generated output):

- `support/focus-timer-in-left.html`
- `index.html`
- `llms.txt`
- `i18n/locales/en.json`, English only: keys `index.bento.items.focus.body`, `index.faq.items[12].a`, `support_articles.focus_timer_in_left.{p_2,p_3,p_4,p_5,p_6,p_7,p_8}`

**Translations.** The other locales still have the old Focus sentences, so until they are retranslated their Focus pages show the old claims (1 to 180 minutes, "Circle", "Dimming dots"). Tell the translation lane to retranslate the keys above; `node scripts/check-i18n.mjs --verbose` lists them as stale. The wrong 1-180 and 1-120 minute ranges are a factual error: if retranslation will be slow, consider asking the lane to prioritise `p_4` and `p_5` first.

## 3. Date the landing page and register it (Lane 0)

1. Add `"pomodoro-timer-iphone.html": "<date>"` to `pages` in `i18n/publish-schedule.json`, on or after the release date. One new English page a day, so pick a free day.
2. Add `"pomodoro-timer-iphone.html"` to the `pages` list of the `pages` family in `i18n/locales.json`.
3. Run `node scripts/build.mjs`, commit, push, then `node scripts/indexnow.mjs`.
4. The build moves the page to `/pomodoro-timer-iphone` on its date and adds the canonical, nav, analytics, sitemap entry and translation extraction.
5. The landing page is deliberately **not linked** from any live page (the build forbids linking a scheduled page). On its date, add links to it:
   - from `support/focus-timer-in-left.html` (related guides or a sentence in the intro);
   - from the home bento "Focus timer" card or the home FAQ item, if wanted;
   - an entry in `llms.txt` under the landing pages ("Pomodoro timer for iPhone").
   Each link edit changes English text: do it in one go and tell the translation lane.

## 4. Request indexing on the day

In Google Search Console (property `getleft.app`, URL Inspection → Request indexing) request these URLs, once each is live:

1. `https://getleft.app/support/focus-timer-in-left`
2. `https://getleft.app/` (the home FAQ and the structured data changed)
3. `https://getleft.app/llms.txt` (not an indexing request; just confirm it is served)
4. `https://getleft.app/pomodoro-timer-iphone`, on the landing page's date

`node scripts/indexnow.mjs` covers Bing, Yandex, Naver and Seznam for the same pages. Google ignores IndexNow, so Search Console is the only route there.

## 5. Remove the caveat from `product-claims.md`

In `docs/seo/research/product-claims.md`, the **Focus** section currently says "Focus ships in v2026.11 (about 2 November 2026, owner, 2026-10-19). Keep Focus visible and describe it as a shipped feature…". On release day:

- Replace it with: "Focus shipped in v2026.11 on <date>. Facts: `docs/seo/research/focus-facts.md`."
- Move "Live Activities for habits, countdowns, fasting and focus" and the Focus widget into the plain "Shipped and safe to describe" list.
- Add Focus to the Paid (Left Premium) list: "Focus (Pomodoro-style sessions)".
- Keep the "Never claim" rule about Apple Watch. Left's watch app is still unannounced, and the app source has a Focus Watch page that the site must not mention.

Other places that say "ships in v2026.11" or hedge about Focus: `docs/seo/LANE-NOTES.md` ("Focus ships in v2026.11 and stays visible"); search `grep -rn "v2026.11" docs/` and clean up.

## 6. After it is live

- Run `node scripts/build.mjs` once more and open the support article, the home FAQ, the home bento flip card and the landing page in a browser to check them.
- Check that the landing page renders its hero (`/images/blog/pomodoro-timer-iphone-hero.webp`, a photo by taichi nakamura on Unsplash) and its FAQ markup validates.
- Re-check demand after two weeks in Search Console: queries containing "pomodoro" and "focus timer" on `/pomodoro-timer-iphone` and `/support/focus-timer-in-left`. The slug was chosen without GSC data (there were no Pomodoro impressions in the 2026-10-19 exports), so confirm it picked up queries before building more around it.
- Optional follow-ups: a "best Pomodoro apps for iPhone" listicle (needs the standard competitor fact-check), and Focus mentions in `support/choose-your-tools`.
