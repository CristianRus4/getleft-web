# getleft.app growth plan: done today

## Context

The goal is more organic traffic and App Store downloads from getleft.app. The work covers four things:
1. Fix every Search Console indexing problem.
2. Add Google Analytics with consent mode, plus App Store campaign links on every download button.
3. Translate everything: all 17 locales plus a new pt-BR.
4. Add the kinds of pages that win.

Phases 1 to 3 (discovery, Search Console, audience) are done. This plan runs **today**. It pushes and deploys to main continuously, and partial or untranslated states are fine along the way.

### Owner decisions

- **Deploys.** Commit, push and deploy to main as work lands, with no per-deploy approval.
- **Analytics.** GA4 with Consent Mode v2, and a banner only for EU, EEA, UK and CH visitors. Google signals and ad personalisation are off.
- **Testimonials and stats.** Untouched.
- **Old domain.** Redirect left-time.app to getleft.app. The owner applies the Cloudflare steps below in their own browser.
- **Languages.** All 17 locales plus a new pt-BR, at once.
- **T3 sessions.** Three sessions on Opus at extra-high effort, each allowed up to 3 subagents.

### Why Search Console shows 13 clicks (the data isn't broken)

Search Console only counts clicks from Google search results. Visitors from a viral post (TikTok, X, Reddit), from shared links, from the App Store "Developer Website" link (442 backlinks come from apple.com), or who typed the address never show up there. The site has no analytics, so those hundreds of visits are currently measured nowhere. GA4 (Batch 2) fixes that.

The App Store backs this up: 316 downloads in the last 28 days came from **web referrers**.

The Google search numbers themselves were cross-checked:
- **Image search:** 13 impressions in 16 months.
- **Coverage:** the property is the domain property, so it covers every protocol and subdomain.
- **Where the brand searches go:** Google sends Left's brand searches to **left-time.app**. That domain had 4,900 search clicks over 16 months and 647 in September alone.

### Search Console facts (2026-10-19)

**getleft.app** (data since 28 May 2026): 13 clicks, 1,120 impressions, average position 52.8.
- Tools get impressions at positions 55 to 90.
- **Indexing: 441 indexed, 476 not indexed:**

  | Reason | Pages | Cause |
  |---|---|---|
  | Page with redirect | 302 | `.html` URLs that 308-redirect. Expected. |
  | Crawled, currently not indexed | 168 | 155 localized support pages |
  | Duplicate, Google chose a different canonical | 4 | `/es-419/` pages, because `es-419` is an invalid hreflang code |
  | 404 | 1 | `/cdn-cgi/l/email-protection` |
  | Redirect error | 1 | `/web.html` |

- **Blog.** All 48 posts are "URL is unknown to Google". Nothing links to the blog, no sitemap has ever been submitted, and the blog canonicals point at `.html` URLs.
- **Sitemap.** It lists only 141 English URLs, and every entry has the same fake `lastmod`.

**left-time.app** (old GitHub Pages site, live): 4,900 clicks and 118,000 impressions over 16 months, average position 5.9, almost all on the home page. Query clusters:

| Cluster | Clicks | Impressions | Position |
|---|---|---|---|
| Brand | 1,187 | 13,926 | |
| Android-seekers | 126 | 872 | |
| Days since / habit / streak widget | | 1,397 | 8.2 |
| Year / life progress widget | | 957 | 7.4 |
| Countdown / days left | | 648 | 13.3 |
| Wallpaper | | 411 | 6.9 |

The top countries are India, the US, the UK, Canada, Germany and Australia.

**App Store (28 days to 14 Oct).** 6,762 first-time downloads; 316 (4.7%) came from Web Referrer, and 106 of those were in the US.

**Other site problems:**
- No analytics.
- The App Store link is hand-typed about 1,430 times with no `pt` or `ct` campaign parameters.
- The whole repo is publicly served (`/docs`, `/scripts`, `/i18n`, `*.md`).
- The home page promotes Mood and Time Between, which are hidden in production, and says "iOS 18+" when the app needs iOS 26.

**Translation quality** (scored 2 to 4 out of 5):
- Titles lead with "Time Left" instead of local search terms such as 디데이, 倒数日, odliczanie dni or Tage zählen.
- Support metadata in 15 locales still contains English "Home Screen".
- `es` and `es-419` are 79% identical.
- `pt` mixes Brazilian and European Portuguese.
- Some hard errors are visible on live pages.

## Today: four lanes in parallel

### Lane 0: this session (Opus): infrastructure, measurement, deploys

Order matters: each step is pushed to main as soon as it passes checks.

1. **Baseline.** Save the Search Console exports to `docs/seo/gsc/2026-10-19/` as TSVs for both properties, plus `SUMMARY.md`. Copy this plan to `docs/seo/GROWTH-PLAN.md`.
2. **Hide repo internals.**
   - Add `functions/` route guards that return 404 for `/docs/*`, `/scripts/*`, `/i18n/*` and `/partials/*`, and for root `*.md` files.
   - Keep `TemplateLibrary.json` and `reviews.json`, which pages fetch.
   - Verify live right after the push. The fallback is an `X-Robots-Tag: noindex` header in `_headers`.
3. **Search Console fixes.**
   - **Locale registry.** Create `i18n/locales.json`. The build, `detect.html`, `switcher.html` and the sitemap all read it. Add `pt-BR`.
   - **hreflang codes.**
     - `/es/` gets `es` and `es-ES`.
     - `/es-419/` gets es-MX, es-AR, es-CO, es-CL, es-PE, es-VE, es-EC, es-GT, es-CU, es-BO, es-DO, es-HN, es-PY, es-SV, es-NI, es-CR, es-PA, es-UY, es-PR and es-US. URLs do not change.
     - `/pt/` gets `pt` and `pt-PT`. `/pt-BR/` gets `pt-BR`.
     - Remove the 5 duplicate hreflang blocks.
   - **Canonicals.** Blog, press, privacy, terms and web get extensionless canonical and `og:url` tags. Fix `supportUrlFor` in `build-tools-seo.mjs`. Rewrite every internal `.html` link to the clean URL.
   - **Blog links.** Add Blog to the header and footer everywhere, add a "From the blog" block on the home page, related posts in each post, and links from tools and support pages to matching posts.
   - **Sitemap.** Add `scripts/build-sitemap.mjs`. It lists every indexable page in every locale as its own `<loc>` with alternates, adds press, excludes noindex pages, and takes `lastmod` from git.
   - **robots.txt.** Add `Disallow: /cdn-cgi/`. This fixes the 404.
   - **noindex.** Add noindex, and drop from the sitemap, for:
     - `terms.html`, which is a redirect stub;
     - `/public/invite/`;
     - the two Mood support articles in every locale. Mood is hidden in production; the URLs stay live.
   - **Cleanup.** Delete the empty `Privacy` file and `build-i18n.mjs.bak`. Bump the cache name in `sw.js` and limit its navigation caching to `/web`.
   - **Product claims.** Remove Mood and Time Between from the home meta, bento, FAQ and JSON-LD in every locale. Change "iOS 18+" to iOS 26 in JSON-LD and `llms.txt`. Leave ratings and stats alone.
4. **Translatable blog, tools and legal pages.**
   - `auto-annotate` runs at build time on `blog/*`, the generated `tools/*`, the new landing pages and `privacy.html`. English stays in the HTML, so writers edit HTML normally.
   - Keys are `<family>.<slug>.<sha8 of the English text>`, so unchanged text keeps its translation and edited text falls back to English until it is retranslated. The extracted English goes to `i18n/{blog,tools,pages}/en.json`, which is regenerated and never hand-edited.
   - `build-i18n` then generates `/<loc>/blog/*`, `/<loc>/tools/*`, `/<loc>/privacy` and the landing pages for all 18 locales.
   - Any missing translation falls back to English. The owner said partial is fine.
   - `tools.js` gets locale strings plus `Intl` date and number formatting.
   - The site catalogs keep their semantic keys and get `_source` hashes so stale translations are flagged.
   - Add the three catalogs to `docs/translation.config.json`.
5. **One build and a merge gate.**
   - `node scripts/build.mjs` runs, in order: tools generation, annotation, i18n, the site-wide injection step, the sitemap, then `check-site`.
   - `scripts/check-site.mjs` checks every indexable page:
     - self canonical with no `.html`;
     - reciprocal hreflang taken from the registry;
     - present in the sitemap;
     - the GA block present (except excluded paths);
     - no untagged App Store link;
     - JSON-LD parses;
     - no hidden-feature terms.
   - The translation engine's `validate` and `check-i18n` run alongside it.
6. **GA4.**
   - Create a separate property "getleft.app" in account CristianRus4 (44324492), with a web stream for `https://getleft.app`. This happens in the GA web UI, where the owner is already signed in. If Google asks to accept new terms, stop and ask.
   - Property settings: signals off, ad personalisation off, 14-month retention, enhanced measurement on, a `download_click` key event, dimensions `placement`, `locale` and `content_type`, and a Search Console link.
   - `partials/analytics.html` is injected into every page after the language-detect script:
     - Consent defaults: the EEA, UK and CH are denied for all signals. Elsewhere `analytics_storage` is granted and ad signals are denied.
     - `ads_data_redaction` is on.
     - gtag config sets `allow_google_signals:false` and `allow_ad_personalization_signals:false`.
     - The tag never fires on `go.getleft.app`, `/invite/`, `/todoist/` or `/friends`.
   - `analytics.js` provides the consent banner and click tracking:
     - The localized banner appears when the timezone is in Europe and no choice is stored. The choice is kept in `left.consent`, inside try/catch. A footer "Cookie settings" link reopens it.
     - A delegated `download_click` listener sends `placement`, `locale`, `page_path` and `content_type`.
   - Update the privacy page: add a "Website" section and translate it with the legal pages. Flag to the owner, without changing it, that the policy still names Sentry for crash reporting while the app uses Crashlytics.
7. **App Store links.**
   - `site.config.json` holds `appId` and `providerToken`. `scripts/lib/appstore.mjs` builds `https://apps.apple.com/app/apple-store/id6740155884?pt=<PT>&ct=<ct>&mt=8`.
   - Naming: `ct=w-{family}-{placement}-{locale}`, 40 characters at most. Example: `w-blog-end-de`.
   - The injection step rewrites every App Store link and adds `data-cta`.
   - `_redirects` short links: `/download` gets `ct=app-share` (it is the app's share link), and `/app` and `/ios` get `w-short-*`.
   - Add the Smart App Banner to blog, tools and support pages.
   - Regenerate the QR code (`ct=w-qr`) with CoreImage through swift.
   - **The `pt` token needs App Store Connect web**, which is signed out. Until the owner signs in, links ship without `pt`/`ct`. When the token arrives, a one-line config change re-tags the whole site.
   - Document everything in `docs/seo/MEASUREMENT.md`.
8. **After each deploy, in Search Console.**
   - Submit `sitemap.xml`.
   - Request indexing for the home page, `/blog/`, the top posts, `/tools/` and the new pages.
   - Run "Validate fix" for each issue type.
   - Once Cloudflare is done, run **Change of Address** from left-time.app to getleft.app.
9. **Coordination.** Brief the three T3 sessions, answer their questions, watch main, verify live with curl and the browser network log, and write `docs/seo/weekly/2026-10-19.md` as day-zero.

### Lane 1: T3 Kai (Opus, extra-high effort, up to 3 subagents): translations A

- **Locales:** de, es, es-419, fr, it, pt (pt-PT), pt-BR (new), nl, pl.
- **Now:** transcreate the site catalogs (home, contact, support). Titles, metas and h1s use the local search terms from the App Store keyword seed, all under 60 and 155 characters. Then fix the audit's hard errors, the English "Home Screen" text, register mixing, and the es versus es-419 and pt versus pt-BR vocabulary. Create `i18n/locales/pt-BR.json`.
- **When Lane 0 says the blog, tools and pages catalogs exist:** translate them. Holiday tools use locale-correct dates.
- **Owns:** only its locales' files under `i18n/`.

### Lane 2: T3 Max (Opus, extra-high effort, up to 3 subagents): translations B

- **Locales:** ja, ko, zh-Hans, zh-Hant, hi, id, ru, ro, tr.
- **Same two phases as Kai**, with CJK full-width punctuation and Apple's localized UI terms. Fix the Turkish `Left'` suffixes, zh "尖端" and the zh comma errors.
- **Owns:** only its locales' files.

### Lane 3: T3 Ava (Opus, extra-high effort, up to 3 subagents): English content

New landing pages come first. Each has unique copy, screenshots from `images/`, an FAQ, a feature CTA and real app facts. Each is mapped to the left-time.app striking-distance queries:

| Page | Purpose |
|---|---|
| `/days-since-widget` | Days since widget queries |
| `/year-progress-widget` | Year progress widget queries |
| `/life-calendar` | Life in weeks |
| `/countdown-widget` | Countdown and days left widget queries |
| `/days-left-wallpaper` | Wallpaper queries |
| `/habit-tracker` | Habit tracker and streak queries |
| `/android` | Replaces today's 302 to `/web` with an honest "iPhone only, here's the web version" page |

Then:
- **Seasonal tool upgrades:** Christmas, New Year, Thanksgiving, Easter and Valentine's get unique explanations, next-years date tables, FAQs and a "put it on your Home Screen" CTA by the result.
- **Blog:**
  - Article JSON-LD with git dates and a visible "Updated" date;
  - title suffix "| Left";
  - expand the 6 posts under 450 words;
  - an honest, dated comparison in habitkit-vs-left;
  - feature CTAs.
- **Owns:** `blog/*.html`, the new landing pages, and the tool copy in `build-tools-seo.mjs`. Lane 0 makes its head, nav and CTA function changes to that script in the first hour, then hands it over.
- **Claim rules:**
  - no Mood, Time Between, Control widget, iPad or Mac app, prices or "free forever";
  - the free tier is 2 each of Ahead, Habits, Streaks and Aims;
  - Focus stays as currently written until the owner confirms it ships.

### Rules for all lanes

- **Model choice.** Subagents set their model explicitly: Sonnet (medium) for filling, sweeps and recipe edits, Opus (high) for review. That includes the back-translation spot check of about 10% of pages per locale.
- **Push loop.** Work on your own worktree branch. Before each push, run `git pull --rebase origin main`, then `node scripts/build.mjs`, which must pass. Then `git push origin HEAD:main`.
  - Before `build.mjs` exists, run `node scripts/build-i18n.mjs --allow-missing`.
  - Never hand-resolve generated files (`/<loc>/`, `sitemap.xml`, `tools/*.html`). On a conflict, take either side, rerun the build and commit.
- **Gates.** Never weaken a check. Every product claim must trace to the app repo or the store.
- **Disk.** 62 GB free; there are 3 worktrees plus this checkout.

## Cloudflare steps for the owner (left-time.app → getleft.app)

1. Open the Cloudflare dashboard, select the **left-time.app** zone, and go to **DNS → Records**. For each of the four `A` records (185.199.108.153, .109, .110 and .111), plus the `www` record and any `AAAA` records, click the grey cloud so it turns orange (**Proxied**), then **Save**.
2. Go to **Rules → Redirect Rules → Create rule** (choose "Single Redirect" if asked).
   - **Name:** `left-time to getleft`.
   - **If incoming requests match:** choose **Custom filter expression**, then **Edit expression**, and paste:
     `(http.host in {"left-time.app" "www.left-time.app"})`
   - **Then:**
     - Type: **Dynamic**.
     - Expression: `concat("https://getleft.app", http.request.uri.path)`.
     - Status code: **301**.
     - Tick **Preserve query string**.
   - Click **Deploy**.
3. Wait about 5 minutes for the edge certificate, then tell me. I'll curl every old URL (`/`, the 5 blog posts, `/web.html`) to confirm a single 301, then run Change of Address in Search Console.

## Verification

1. **Before every push.** `node scripts/build.mjs` (including `check-site`), the translation engine's `validate`, and `check-i18n` all pass.
2. **After every push.**
   - Curl the changed URLs: status, canonical, hreflang, robots.
   - Confirm `/docs/` and `/scripts/` return 404.
   - Confirm `sitemap.xml` is valid.
3. **GA4.** In the browser pane's network log, see `g/collect` with `en=page_view` and `en=download_click`. Check GA4 Realtime. Confirm the banner shows with a Europe timezone and stays hidden otherwise.
4. **Search Console.** The sitemap is accepted and the URL count matches. URL Inspection shows the blog index and a post as "URL is available to Google". The Validate fix runs have started.
5. **Old domain.** Once Cloudflare is done, every left-time.app URL returns one 301 to its getleft.app twin, and the Change of Address has been submitted.

## Targets (28-day windows; first check on 2 Nov, then weekly)

| Measure | Baseline | 30 days | 60 days | 90 days |
|---|---|---|---|---|
| getleft.app search clicks | 8 in 3 months | ≥ 400 | ≥ 900 | ≥ 1,300 |
| Blog posts indexed | 0 of 48 | ≥ 40 | | |
| Non-brand clicks | | | ≥ 150 | ≥ 400 |
| Web Referrer downloads | 316 | | ≥ 380 | ≥ 450 |
| GA4 `download_click` | not measured | live today | | |

Weekly report: `docs/seo/weekly/<date>.md`, built from Search Console, GA4 `download_click` by placement and locale, and Elevate Web Referrer downloads.

## Critical files

- **Edit:**
  - `scripts/build-i18n.mjs`, `scripts/build-tools-seo.mjs`, `scripts/auto-annotate.mjs`, `scripts/check-i18n.mjs`
  - `partials/detect.html`, `partials/switcher.html`
  - `index.html`, `blog/*.html`, `privacy.html`, `terms.html`
  - `_redirects`, `_headers`, `robots.txt`, `llms.txt`, `sw.js`
  - `docs/translation.config.json`, `i18n/locales/*.json`
- **New:**
  - `i18n/locales.json`, `site.config.json`
  - `scripts/build.mjs`, `scripts/build-sitemap.mjs`, `scripts/check-site.mjs`, `scripts/lib/appstore.mjs`
  - `partials/analytics.html`, `analytics.js`
  - `functions/`
  - landing pages
  - `docs/seo/*`
