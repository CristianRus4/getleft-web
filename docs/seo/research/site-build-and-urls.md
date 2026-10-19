# getleft-web: build, localization, publishing and live URL behaviour (read-only audit, 2026-10-19)

All paths are under `/Users/cristian/Developer/Webs/getleft-web` unless stated. Nothing was written or run that writes. The only network calls were HTTP GET/HEAD against getleft.app and go.getleft.app.

## 0. Summary of the important facts

- **Publishing.** There is no production build. Generated HTML is committed and Cloudflare Pages serves the repo tree as-is. `README.md` says "framework = None, build command = empty, output directory = `/`". `docs/SITE_BLUEPRINT.md` repeats this. Pushing to `main` publishes. You run the build scripts by hand before committing.
- **No automation anywhere.** There is no `package.json`, `node_modules`, `.github`, `wrangler.*`, Makefile, CI, test, lint or link check. `.gitignore` lists `wrangler.jsonc`, `node_modules/` and `.wrangler/`, but none exist. `scripts/check-i18n.mjs` is a manual key-coverage check only.
- **The i18n README is wrong about tools and press.** Locales contain only home, contact, the support index and the 29 support articles. This is 32 pages × 17 locales = 544 pages. Tools, press and blog are English-only. Details in section 1.
- **Canonical vs live redirect mismatch (the Cloudflare `.html` → extensionless 308 problem).** The 47 blog posts, `press`, `privacy`, `terms` and `web` carry `.html` canonicals. Live, those URLs 308 to the extensionless form. The sitemap lists the extensionless form, so for those pages the canonical, `og:url` and the sitemap disagree. Details in section 6.
- **Sitemap lastmod is fake.** It is the build date for every URL (all 141 are `2026-10-13`).
- **Sitemap structure.** Localized URLs appear only as `xhtml:link` alternates inside the English `<url>` entries. None is its own `<loc>`.
- **Analytics.** Databuddy was added (commit 9d0a4381) and reverted (commit 7d180c60) with no stated reason. No analytics is live now. A grep for `googletagmanager`, `gtag`, `plausible`, `posthog`, `umami`, `cloudflareinsights`, `beacon` and `databuddy` over html/md/js/mjs/json files found nothing (its output was cut off by `head`, but the live pages show no such tags either).

## 1. Page families: hand-written, generated or patched, and localized or not

### Pipeline (what each script does)

**`scripts/build-i18n.mjs`** (763 lines) is the main i18n build and has these stages:
- Locale list: `LOCALES` at lines 21-40. There are 18 entries, English plus 17 others. `htmlLang` for `es` is `es-ES`.
- Translatable pages: `SOURCE_PAGES = [index.html, support.html, contact.html]` (lines 45-49) plus every `support/*.html` (`SOURCE_DIRS`, line 52).
- Never-touched paths: `EXCLUDED_PATH_PREFIXES` (lines 55-60): `/privacy.html /terms.html /web.html /404.html /press.html /tools/ /blog/ /invite/ /.well-known/ /sw.js /download*`.
- `main()` (lines 65-99) runs in this order:
  - `injectIntoSourcePages` (134-177) patches the English source files **in place**. It injects the detect script and the footer switcher between marker comments. It rewrites canonical and `og:url` to the extensionless form. It rewrites the hreflang block. It regenerates JSON-LD. For support articles it also injects a table of contents and a related-guides block.
  - `buildLocale` (293-311) does `fs.rm` on `<lang>/` and regenerates the whole folder from the English source plus `i18n/locales/<lang>.json`. `transform` (314-422) handles `data-i18n`, `data-i18n-html` and `data-i18n-attr`. It also sets `<html lang>`, canonical, `og:url` and hreflang, rewrites internal links to `/<lang>/…`, strips the detect script, and generates JSON-LD.
  - `writeSitemap` (710-761) rewrites `sitemap.xml`.
- Strict mode exits with code 2 on any missing key. `--allow-missing` falls back to English. The `.claude/settings.local.json` allowlist shows that `--allow-missing` is what actually gets run.

**`scripts/build-tools-seo.mjs`** (1472 lines) works on three things:
- Tools:
  - It **creates** the `newTools` pages from templates (`newToolPage`, line 1197).
  - It **re-heads** the `existingTools` pages (`replaceHead`, line 1320), rewriting the `<head>` and related-tools block while keeping the body.
  - It regenerates `tools/index.html` (`toolsIndexPage`, line 1242).
- `normalizeSupportMetadata` (1378) patches the og/twitter tags and canonical of `support.html` and `support/*.html`. Its `supportUrlFor` (1346) sets the canonical to `/support/<slug>.html`, which is **the `.html` form**. `build-i18n` overwrites it with the extensionless form.
- `updateLlms` (1427) rewrites only the "Free online tools" section of `llms.txt`.

**`scripts/seo-augment.mjs`** (79 lines) is a one-shot, idempotent patcher. It adds og:image, og:url, og:site_name and twitter tags to blog posts that lack `og:image`. It also adds og:site_name to tool pages.

**`scripts/patch-support-seo.mjs`** (214 lines) is a one-off. It rewrites English `<title>`, description and og tags in `support/*.html` from a hard-coded `META` table, and syncs `en.json`. Translated locales keep their old strings.

**`scripts/auto-annotate.mjs`** (179 lines) is a one-shot helper. It adds `data-i18n` attributes to HTML files and merges the extracted English text into `en.json`. It replaces nav and footer with shared blocks. `.claude/settings.local.json` also allowlists `node scripts/_gen-tutorials.mjs`, but that file does not exist in the repo.

**`scripts/apply-support-translations.mjs`** (54 lines) reads `scripts/support-meta-translations.json`. **That file does not exist** (`ls` returned "No such file or directory"), so the script cannot run as shipped.

**`scripts/check-i18n.mjs`** (52 lines) flattens `en.json` and every other locale. It reports missing and extra keys, and exits 1 if any key is missing. It is manual and not wired to anything.

**Other files in `scripts/`:** `build-i18n.mjs.bak` (a tracked 684-line older copy) and `time-zone-options.json` (data for tool pages).

### Per-family table

| Family | Status | Localized? | Evidence |
|---|---|---|---|
| `index.html` (home) | Hand-written English, patched in place by `build-i18n` (detect script, switcher, canonical, hreflang, JSON-LD) | Yes, `/<lang>/` (17 folders) | `build-i18n.mjs` 134-177; live home has the detect markers |
| `support.html`, `contact.html` | Hand-written (via `auto-annotate`), patched in place by `build-i18n`. `support.html` is also touched by `build-tools-seo.normalizeSupportMetadata` | Yes | `SOURCE_PAGES` |
| `support/*.html` (29 articles) | Hand-written with `data-i18n` keys (`support_articles.<slug_with_underscores>.*`). Meta patched by `patch-support-seo`. Table of contents and related guides are injected by `build-i18n` | Yes | `injectSupportArticleExtras`, lines 189-270 |
| `<lang>/index, contact, support, support/*` | **Generated** by `build-i18n` from the English source plus `i18n/locales/<lang>.json`. Folders are deleted and recreated each build. Committed to git | n/a (the output) | 32 files in each of de/fr/ja (verified) |
| `i18n/locales/*.json` | Data files. `en.json` has 1293 string keys. All 17 other locales have 1294 keys and 0 missing | n/a | python count |
| `tools/*.html` (57 tools plus `index`) | **Generated or re-headed** by `build-tools-seo.mjs`. Body content comes from templates in that script, plus the pre-existing body for `existingTools` | **No, English only** | `EXCLUDED_PATH_PREFIXES` has `/tools/`; `/de/tools/` returns 404 live |
| `blog/*.html` (47 posts plus `index`) | Hand-written. OG tags patched by `seo-augment.mjs`. No hreflang. No i18n | No | zero hreflang in all 48 pages |
| `press.html`, `privacy.html`, `terms.html` | Hand-written | No | `/de/press` returns 404 live |
| `web.html` | Hand-written (web app shell) | No | excluded |
| `download.html` | Hand-written, `noindex` | No | |
| `promo.html` | Hand-written, `noindex`. Live `/promo` is 200 | No | |
| `friends` (no extension) | Hand-written. Canonical `https://go.getleft.app/friends` | No | `_headers` forces HTML content-type |
| `invite/index.html` and `public/invite/index.html` | Hand-written, `noindex,nofollow`. The two copies **differ** (`diff -q`) | No | live `/invite` 308s to `/invite/` |
| `404.html` | Hand-written, `noindex,follow` | No | |
| `sitemap.xml`, `llms.txt`, `robots.txt` | `sitemap.xml` is **generated** by `build-i18n.writeSitemap`. `llms.txt` is hand-written, except that the tools section is regenerated by `build-tools-seo.updateLlms`. `robots.txt` is hand-written | n/a | |

### The i18n README claim, checked

`i18n/README.md` line 3 says the site includes "`press.html`, tools index + all 34 tool pages". That is **false** on three counts:
- The script's `SOURCE_PAGES` has no press page.
- The script's `EXCLUDED_PATH_PREFIXES` explicitly excludes `/press.html` and `/tools/`.
- The README itself contradicts this further down in its "Excluded pages" list, and `translations.md` line 25 says "Only four areas... Everything else (press, tools, blog, privacy, terms) stays English-only."

The README is also wrong that there are 34 tool pages. The current count is 57 plus the index. The README's excluded list also omits `press.html` and `tools`.

The same README says the tools were translated at some earlier point. `build-i18n.mjs.bak` (684 lines) may show an older scope, but I did not diff it (UNVERIFIED as to history). What is true now is 32 pages per locale, English-only tools and press, and no `/de/tools/` or `/de/press` (both 404 live).

`translations.md` is also stale. It says 15 locales are "partially_translated". Every locale JSON now has `_meta.status = "translated"`, and commit 3c789553 (2026-10-13) fixed 155 errors to 0.

## 2. Sitemap, hreflang, canonical, lang, OG, JSON-LD, robots, llms.txt

**sitemap.xml**
- Generated only by `build-i18n.writeSitemap` (lines 710-761). It lists 141 `<url>` entries:
  - 32 translated-source pages (home, support, contact and 29 articles) carry `xhtml:link` alternates for all 18 locales plus `x-default`.
  - 109 English-only entries have no alternates: 48 blog, 58 tools, privacy, terms and web.
- Localized URLs are never their own `<loc>`. A python check found 0 locale-prefixed `<loc>` values. The sitemap hreflang is declared only inside the English entries.
- `press`, `friends`, `invite` and `download` are not listed. `press` is a real indexable page, so that is a gap.
- URL form is extensionless (zero `.html` locs). The home is `/`, blog and tools indexes use `/blog/` and `/tools/` with a trailing slash, and everything else is extensionless without a slash.
- **lastmod** is `new Date().toISOString().slice(0,10)` at build time (line 716). It is applied identically to every URL, so it carries no signal. The live file shows `2026-10-13` for all 141 entries.

**hreflang**
- The block is produced by `buildHreflangBlock` (lines 476-487): `x-default` pointing to English, then 18 locales (en, es-ES, es-419, de, fr, it, pt, ja, nl, pl, tr, ru, zh-Hans, zh-Hant, ko, id, ro, hi).
- It goes only on the 32 pages that are translated, in English and in every locale copy. Every page in the set carries the identical 19-link block, including a self-reference. So hreflang is reciprocal within the set.
- Blog, tools, press, privacy, terms, web and invite have **no hreflang** (python count: 0 on all 48 blog pages and all 58 tool pages).
- Five support articles have a **duplicated** `x-default` and `en` pair after the end marker: `apple-health-automatic-tracking`, `fasting-in-left`, `focus-timer-in-left`, `mood-tracker-in-left` and `world-mood-globe`. The extra pair sits on the line right after `<!-- i18n:hreflang:end -->`, so it looks hand-inserted. It also appears in the `de/` copy (2 `x-default` in each). The duplicate values are identical, so it is harmless but unclean.
- hreflang URL form is extensionless, matching the sitemap. The `/de/` home and `/tools/` use a trailing slash.

**canonical**
- `build-i18n` writes the extensionless canonical and `og:url` for the 32 translated pages. Locale canonicals are self-referencing (`/de/support/x`).
- Python scan of canonical forms by family:
  - Blog (48): 47 end in `.html` and 1 is `/blog/`.
  - Tools (58): 57 are extensionless and 1 is `/tools/`.
  - Support (29): all extensionless.
  - Root pages:
    - `press`, `privacy`, `terms` and `web` canonicalize to the `.html` URL.
    - `index`, `support` and `contact` canonicalize to `/`, `/support` and `/contact`.
    - `download`, `404` and `promo` have no canonical.
    - `friends` canonicalizes to `https://go.getleft.app/friends`.
    - `invite` has none.

**`<html lang>`**
- English is `lang="en"`. Locales are rewritten by `transform` step 5 from `locale.htmlLang`, so `/es/` gets `es-ES`, and the others get `de`, `zh-Hans` and so on. Translated pages have `<html  lang="de">` with a double space (cosmetic).
- Tools, blog and press are `lang="en"`.

**Open Graph and Twitter**
- Home and the locale pages get og tags through `data-i18n-attr` translation. Support pages are normalized by `build-tools-seo.normalizeSupportMetadata` and `patch-support-seo`.
- Blog posts get them from `seo-augment.mjs`. Tools pages get them from `toolHead` (`build-tools-seo` lines 1055-1115).
- `og:image` is `https://getleft.app/images/og-image.png` everywhere. `og:image` is missing on `download`, `404`, `promo` and `invite`, and on `friends`, which has no OG tags at all.

**JSON-LD**
- `data-i18n-jsonld-generate` blocks are regenerated per locale by `jsonLdGenerator` (lines 574-690) with kinds `faq`, `support-faq`, `app` and `breadcrumb`.
- The `app` kind hard-codes `aggregateRating ratingValue "4.5" ratingCount "226"`, `operatingSystem "iOS 18+"` and `offers price 0` (lines 662-666). These are static and will go stale.
- Home also has a hand-written Organization block (index.html:272, `@id https://getleft.app/#organization`; commit 6c321245).
- Tools have `WebApplication` plus `BreadcrumbList`, generated in `toolHead`. Tools also have an `ItemList` on the index (`itemListJsonLd`, line 1228).
- Blog posts have no JSON-LD except the blog index (python: `ld` is False on 47 of 48).

**robots.txt** is hand-written. It has `Allow: /` for `*` and explicit `Allow` for AI crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot, CCBot, Amazonbot, Bytespider, and others). It has one `Sitemap: https://getleft.app/sitemap.xml` line. It has no Disallow rules, so `noindex` pages such as `/promo` and `/download.html` rely only on their meta tag.

**llms.txt** is 157 lines and hand-written. It links `.html` URLs for the core pages (`web.html`, `support.html`, `press.html`, `privacy.html`, `terms.html`, `contact.html`). Those URLs 308 live. The tools section links extensionless URLs and is auto-regenerated by `build-tools-seo.updateLlms`.

## 3. Language auto-detect (`partials/detect.html`)

- It is injected into the `<head>` of the 32 English source pages. Markers are `<!-- i18n:auto-detect:start/end -->`. It is stripped from locale copies, so there are no loops. It is not present on blog, tools or press.
- **Logic (lines 1-30):**
  - A `?lang=xx` query parameter wins and is saved to `localStorage['left.lang']`.
  - `?nolang=1` or `lang=en` disables the redirect.
  - Otherwise it walks `navigator.languages`.
  - It does an exact match against SUPPORTED, then regional mappings (es-MX and friends → `es-419`, other `es*` → `es`, `pt*` → `pt`, zh-TW/HK/MO/Hant → `zh-Hant`, other `zh*` → `zh-Hans`, then the base language).
  - It skips a list of path prefixes: `privacy|terms|web|404|invite|blog|.well-known|download|ios|android|press|tools`.
  - It then runs `location.replace('/' + pick + '/' + path + search + hash)`.
- **Googlebot:**
  - This is client-side JavaScript, with no server-side Accept-Language handling and no 30x redirect, so crawlers that do not render JS are unaffected.
  - Googlebot's renderer reports English (`navigator.language` is `en-US`). It resolves to `en` or no match and does not redirect. The `?nolang=1` flag the README mentions is therefore unnecessary for Googlebot.
  - A bot configured with another language (some Bing or social previewers) could be redirected away from the English URL. I did not test this (UNVERIFIED).
- **Users:**
  - A first visit to any English root page from a browser set to German is `location.replace`d to `/de/…`. The stored `left.lang` then sticks.
  - Footer switcher clicks overwrite `left.lang`.
  - Choosing English in the switcher keeps the user on the English URL, because `override === 'en'` returns early.
  - Remembered locale persists across visits. The redirect happens only on English pages. A de-locale page does not bounce back, because the detect script is stripped from locale copies.
- **SEO risks:**
  - A JS replace after first paint can cause a flash of English content before the redirect.
  - Shared English links turn into locale pages for non-English users.
  - Sitelinks and snippet language can be mixed for signed-in-to-Google users.
  - It is not server-side geo or language detection, so there is no Vary problem.
  - The English URL stays the canonical for crawlers, which is fine.
  - The detect script's `p.indexOf('es') === 0` also matches any language code starting with "es" (for example `est`). That is cosmetic.
  - The path-exclusion test is unanchored on word boundary (`^(…|web|…)`), so any path starting with `web…` is excluded.

## 4. Automation, CI, tests

I found none of these:
- `package.json`, `node_modules`, `wrangler.*`, `Makefile`, `.github/` and `.gitlab-ci.yml` are all absent (`ls` errors).
- There are no tests, no lint config and no link-check or pre-deploy check script.

What does exist:
- `scripts/check-i18n.mjs` (manual, key coverage only).
- `docs/MARKETING_AND_OPERATIONS.md` prescribes manual QA only: "Static-site link checks should include fragment targets and case-sensitive file paths", "Run translation generation/validation when translatable content changed", "Rollback is a revert and redeploy of the known-good commit".
- `.claude/settings.local.json` allowlists `node scripts/build-i18n.mjs --allow-missing`, `auto-annotate`, `git add/commit/push`. `.playwright-cli/` holds an old console log from a manual local run on 127.0.0.1:8765 that showed 404s for `/tools/days-since-date` and similar paths.
- `sw.js` and `left.webmanifest` exist (service worker, 1780 bytes). `AGENTS.md` here covers only subagent and model guidance.

Nothing guards against:
- a stale generated copy, because a locale folder can drift from the English source until the script is rerun;
- sitemap and canonical mismatch;
- the `data-i18n` attribute markers remaining visible in served English HTML (the live home still has `data-i18n="index.meta.title"` and similar attributes; they are harmless but verbose).

## 5. Git history: Databuddy and analytics decisions

**Add: `9d0a4381`, 2026-10-08 21:34 +1300, Cristian Rus.** Message: "Add Databuddy analytics (temporary test)" / "Script tag on all pages plus track.js custom events. Revert this single commit to remove."
- Stat: 694 files changed, 1456 insertions(+), 4 deletions(-).
- Every HTML file got 2 added lines, in the pattern shown in the home diff:
  - `<script src="https://cdn.databuddy.cc/databuddy.js" data-client-id="cd7260be-…" data-track-web-vitals="true" data-track-errors="true" data-track-outgoing-links="true" crossorigin="anonymous" async></script>`
  - `<script src="/track.js" defer></script>`
- `track.js` was a new 64-line file. It sent events through `window.databuddy.track` for `app_store_clicked` (with placement), `email_link_clicked`, `language_changed`, `web_tool_action`, `related_tool_clicked`, `tool_used` and `page_not_found`.
- It touched the locale folders as well (for example `de/index.html`, `de/support/*.html`). It also touched `download.html` (4 lines changed), `404.html`, `invite/index.html`, `press.html` and `privacy.html`.

**Revert: `7d180c60`, 2026-10-09 22:35 +1300.** Message: "Revert Databuddy analytics", with only a `Claude-Session: https://claude.ai/code/session_0188cBeRygs8RG3nn4qxCjVD` link and a `Co-authored-by: Claude` trailer.
- Stat: 694 files changed, 4 insertions(+), 1456 deletions(-), which is the inverse.
- **No text anywhere states why it was reverted.** The add commit already called it a "temporary test", and the next day's revert fits that. I would call that inference, not evidence.
- Live check: `https://getleft.app/track.js` returns 404, and the fetched home, blog and German support pages show no Databuddy script. Analytics is currently off.

**Other analytics decisions:**
- A message search (`git log --all -i --grep='analytic|databuddy|posthog|ga4|plausible|umami|cloudflare web|beacon'`) returned only the two Databuddy commits.
- A grep of the docs found no analytics policy beyond `docs/SITE_BLUEPRINT.md` line 101: "Invitation codes and OAuth authorization parameters must not be logged into analytics, copied into documentation, or retained in static content." That is a privacy constraint on any future analytics setup. It implies invite and OAuth-return URLs must be excluded from any site-wide tag.
- There is no consent banner or cookie-banner code in the repo.

## 6. Live URL behaviour (curl -sI, no redirects followed)

| URL | Status | Location |
|---|---|---|
| `https://getleft.app/blog/how-to-build-a-streak.html` | 308 | `/blog/how-to-build-a-streak` |
| `https://getleft.app/blog/how-to-build-a-streak` | 200 | |
| `https://getleft.app/blog/how-to-build-a-streak/` | 308 | `/blog/how-to-build-a-streak` |
| `https://www.getleft.app/` | **no response** (curl exit 6, DNS failure) | |
| `http://getleft.app/` | 301 | `https://getleft.app/` |
| `https://getleft.app/index.html` | 308 | `/` |
| `https://getleft.app/de/` | 200 | |
| `https://getleft.app/de/index.html` | 308 | `/de/` |
| `https://getleft.app/de` | 308 | `/de/` |
| `https://getleft.app/tools/` | 200 | |
| `https://getleft.app/tools/index.html` | 308 | `/tools/` |
| `https://getleft.app/tools/age-calculator.html` | 308 | `/tools/age-calculator` |
| `https://getleft.app/support/widget-iphone-home-screen.html` | 308 | `/support/widget-iphone-home-screen` |
| `https://getleft.app/support` | 200 | |
| `https://getleft.app/blog/` | 200 | |
| `https://getleft.app/sitemap.xml` | 200 (`application/xml`) | |
| `https://getleft.app/download` | 302 | App Store URL |
| `https://getleft.app/app` | 302 | App Store URL |
| `https://go.getleft.app/app` | 302 | App Store URL |

The App Store target for all three is `https://apps.apple.com/us/app/left-widgets-for-time-left/id6740155884?itscg=30200&itsct=apps_box_badge&mttnsubad=6740155884`. This matches `_redirects`.

**Extra checks:**
- `/press`, `/privacy`, `/web`, `/contact` and `/de/support` all return 200.
- `/press.html`, `/privacy.html`, `/web.html`, `/contact.html`, `/support.html` and `/download.html` all return 308 to the extensionless form.
- `/invite` is 308 to `/invite/`. `/ios` is 302 to the App Store. `/android` is 302 to `/web`.
- `/de/press` and `/de/tools/` return 404, which confirms tools and press are English-only. An unknown path returns 404.
- `/track.js` returns 404.
- `robots.txt` has `max-age=14400`. HTML pages have `max-age=0, must-revalidate`.
- `/tools/age-calculator` is 200.

**Served pages, fetched live:**

1. **Home `https://getleft.app/`:**
   - `<html lang="en">`
   - canonical `https://getleft.app/`
   - `og:url` `https://getleft.app/`
   - robots `index,follow`
   - 19 hreflang links, exactly as the build writes them: `x-default` and `en` → `https://getleft.app/`, then `es-ES` → `/es/`, `es-419` → `/es-419/`, and `de, fr, it, pt, ja, nl, pl, tr, ru, zh-Hans, zh-Hant, ko, id, ro, hi` each → `/<code>/`.
   - The detect script is present, and `data-i18n` attributes are still in the source.

2. **Blog `https://getleft.app/blog/how-to-build-a-streak`:**
   - `<html lang="en">`
   - canonical `https://getleft.app/blog/how-to-build-a-streak.html`, **which 308s**
   - `og:url` also `.html`
   - no hreflang
   - no robots meta
   - no JSON-LD

3. **German support `https://getleft.app/de/support/widget-iphone-home-screen`:**
   - `<html  lang="de">`
   - canonical `https://getleft.app/de/support/widget-iphone-home-screen` (extensionless, matches)
   - robots `index,follow`
   - `og:url` the same
   - the same 19-link hreflang set, all extensionless, with `x-default` → the English `/support/widget-iphone-home-screen`
   - BreadcrumbList JSON-LD with three items

**Conclusion on the classic Cloudflare Pages `.html` → extensionless 308 problem:** it is partly present.
- **Affected pages.**
  - Canonicals and `og:url` that point at a redirecting URL: the 47 blog posts (verified live and in local files), `press.html`, `privacy.html`, `terms.html` and `web.html`. `llms.txt` also links `.html` forms for six core pages.
  - Blog `.html` → 308 → extensionless 200 was confirmed live. `press`, `privacy` and `web` gave the same result.
  - `terms` was not fetched live, but its canonical in the file is `.html` and the same Pages behaviour applies (UNVERIFIED live).
- **Why it matters.** The sitemap lists the extensionless URL while the canonical says `.html`. Google may treat the canonical as a redirect target and trust the redirect or the sitemap instead. It is a signal conflict, though Google usually resolves it to the extensionless URL it can fetch.
- **Unaffected.**
  - Support articles, tools, the 3 translated root pages and all locale copies have extensionless canonicals that match the sitemap and return 200.
  - Home, `/de/`, `/tools/` and `/blog/` use a trailing slash that matches their canonical.
- **Other 308 behaviour.**
  - `/de` → 308 → `/de/` is fine because the canonical is `/de/`.
  - A trailing slash on a blog URL also 308s.
- **Redirects not from `_redirects`.** The 308s for `.html` come from Cloudflare Pages' automatic pretty-URL handling. `_redirects` contains only the app shortcuts, the Todoist rewrites and three removed pages.
- **Sitemap URLs fetched.** The blog, tools, support, contact, privacy and web URLs tested all returned 200. I did not fetch all 141.

## 7. Where to hook site-wide changes

The root constraint is that there are four production paths and three of them are independent.

| Path | Pages | Source of truth |
|---|---|---|
| A | 32 English source pages (home, support, contact, 29 support articles) and all 544 locale copies | `build-i18n.mjs`, which patches the English source and regenerates the locale folders |
| B | `tools/*.html` (57 plus index) | `build-tools-seo.mjs` (`toolHead`, `newToolPage`, `replaceHead`, `toolsIndexPage`) |
| C | `blog/*.html` (47 plus index) | hand-written; only `seo-augment.mjs` patches them, and only for missing og tags |
| D | `press`, `privacy`, `terms`, `web`, `friends`, `invite`, `404`, `promo`, `download` | hand-written; nothing generates them |

**GA4 script tag**
- Paths A: add a partial (for example `partials/analytics.html`) and inject it between new markers inside `injectIntoSourcePages` (lines 134-177) using the existing `upsertInjection` pattern (lines 272-282), anchored on `<meta name="viewport">` like the detect script. `transform` (314-422) copies the markers into every locale unless you strip them. Do not put it inside the detect block, because `transform` strips that block on locale pages (line 318).
- Path B: add to `toolHead()` (`build-tools-seo.mjs` line ~1092) and to `toolsIndexPage()` (line 1242). `replaceHead` (line 1320) rewrites existing tool heads, so a tag added by hand to a tool page would be overwritten the next time that script runs.
- Path C and D: no generator exists. Either add a small post-processing step that appends the snippet to every HTML file, or extend `seo-augment.mjs`. The Databuddy attempt did it with a mass edit across 694 files, which would have been lost on the next `build-i18n` run for any file that script regenerates (Databuddy's edits were inside locale files that `buildLocale` rewrites).
- An alternative that needs no per-page edit is a Cloudflare Pages Function or Cloudflare Web Analytics, which need a `functions/` folder or a dashboard setting. Neither exists today (UNVERIFIED that either would be allowed on this setup).
- Respect `docs/SITE_BLUEPRINT.md` line 101: exclude `/invite/` and the Todoist return paths (`/todoist/oauth/*`) from any tag.

**Consent banner**
- Put the markup and script in a partial injected the same way as GA4 (paths A), and into `toolHead()` for B. Banner copy would need `data-i18n` keys in `en.json` plus every locale JSON (1293-key files). Run `check-i18n.mjs` to confirm no key is missing.
- Paths C and D need the same post-processing step as GA4.
- `index.js` is loaded by most pages (`<script defer src="index.js">`; blog, 404 and tools load `/index.js`), so a small shared consent loader could live there. It would not cover `press` and similar pages that skip it. I did not check each page (UNVERIFIED).

**CTA URL helper**
- The App Store URL is hard-coded in 689 files. The dominant form appears 1185 times: `…id6740155884?itscg=30200&itsct=apps_box_badge&mttnsubad=6740155884` (225 are bare, 19 use `apps.apple.com/app/id6740155884`, 3 are the `redeem?…code=BETTER` offer-code form).
- Three generators duplicate the constant: `auto-annotate.mjs` (NAV_BLOCK), `build-tools-seo.mjs` line 12 (`APP_URL`, used by `nav()` and `downloadBlock()`), and the hand-written pages.
- There is no shared CTA helper. The practical hook is to route links through the existing redirects (`/app` or `/download` in `_redirects`) and append the campaign parameters there, so only one line changes. `track.js`'s old `placement()` logic from commit 9d0a4381 is a reusable model for per-placement tracking.
- Note `go.getleft.app/app` and `getleft.app/app` both resolve to the same redirect. `README.md` documents `go.getleft.app/app` as the Universal Link used when an App Store surface only needs to open Left.

**hreflang and sitemap fixes**
- hreflang: `buildHreflangBlock` (lines 476-487) is the single generator for the 32-page family. To add hreflang to tools or blog it would need locale counterparts first. Today hreflang exists only for pages that are translated, and that is correct.
- The duplicate `x-default`/`en` pair on five support articles sits after the end marker, so `build-i18n` will not remove it. It needs a manual edit in the English source (the locale copies inherit it).
- Sitemap: edit `writeSitemap` (lines 710-761).
  - Fix lastmod (line 716): use a per-file `git log -1 --format=%cs -- <file>` or file mtime, instead of today.
  - List locale URLs as `<loc>` entries, if desired, with the same alternates.
  - Add `press`.
  - Add trailing-slash handling to match canonicals.
  - The English-only list is hard-coded at line 732 (`['privacy','terms','web']`) plus directory enumeration. It enumerates every `.html` in `blog/` and `tools/`, so a `noindex` page in those folders would still be listed.
- Canonical fix for the mismatch:
  - Blog: `seo-augment.mjs` reads the canonical from the file and copies it into og:url, so it will not repair `.html`. It needs a new pass, or an edit in each of the 47 files.
  - `press`, `privacy`, `terms` and `web`: hand edits (4 files), plus the six `llms.txt` core links.
  - Order of operations: if `build-tools-seo.mjs` runs after `build-i18n.mjs`, its `normalizeSupportMetadata` puts the `.html` canonical (via `supportUrlFor`) back on `support.html` and the 29 support sources. That fixes itself only on the next `build-i18n` run, so always run `build-tools-seo` first, then `build-i18n`. The docs say this (`patch-support-seo.mjs` header: "then build-tools-seo + build-i18n"), but nothing enforces it. Better still, change `supportUrlFor` (line 1346-1350) to emit the extensionless form.

**Future builds keeping these changes**
- Anything inside the markers `i18n:auto-detect`, `i18n:switcher`, `i18n:hreflang`, `i18n:support-toc` and `i18n:support-related` is regenerated on every `build-i18n` run.
- Anything outside those markers in a `<lang>/` file is destroyed (`fs.rm` at line 295). Never hand-edit `/de/` and the other locale folders.
- Anything in `tools/*.html` between `<head>` and the body is regenerated by `build-tools-seo`.
- A new global tag should therefore be added at its generator, not in HTML output, for paths A and B. Paths C and D are the only ones where editing the HTML directly survives future builds.

## Key paths

- `/Users/cristian/Developer/Webs/getleft-web/scripts/build-i18n.mjs`
- `/Users/cristian/Developer/Webs/getleft-web/scripts/build-tools-seo.mjs`
- `/Users/cristian/Developer/Webs/getleft-web/scripts/seo-augment.mjs`
- `/Users/cristian/Developer/Webs/getleft-web/scripts/patch-support-seo.mjs`
- `/Users/cristian/Developer/Webs/getleft-web/scripts/auto-annotate.mjs`
- `/Users/cristian/Developer/Webs/getleft-web/scripts/apply-support-translations.mjs` (reads a missing `support-meta-translations.json`)
- `/Users/cristian/Developer/Webs/getleft-web/scripts/check-i18n.mjs`
- `/Users/cristian/Developer/Webs/getleft-web/partials/detect.html`
- `/Users/cristian/Developer/Webs/getleft-web/partials/switcher.html`
- `/Users/cristian/Developer/Webs/getleft-web/i18n/README.md` (stale on tools and press)
- `/Users/cristian/Developer/Webs/getleft-web/translations.md` (stale on locale status)
- `/Users/cristian/Developer/Webs/getleft-web/_redirects`
- `/Users/cristian/Developer/Webs/getleft-web/_headers`
- `/Users/cristian/Developer/Webs/getleft-web/robots.txt`
- `/Users/cristian/Developer/Webs/getleft-web/llms.txt`
- `/Users/cristian/Developer/Webs/getleft-web/sitemap.xml`
- `/Users/cristian/Developer/Webs/getleft-web/docs/SITE_BLUEPRINT.md`
- `/Users/cristian/Developer/Webs/getleft-web/docs/MARKETING_AND_OPERATIONS.md`
