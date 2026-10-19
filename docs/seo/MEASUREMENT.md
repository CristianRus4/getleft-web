# Measurement

How getleft.app measures which pages help people download Left, from the page
to the App Store and back into a weekly report. Nothing here applies to
`go.getleft.app`, which never loads analytics.

Owner decisions this design implements: Google Analytics 4 only; Consent
Mode v2 with an opt-in banner in the EEA, the UK and Switzerland and analytics
on by default elsewhere; ad storage, ad user data and ad personalisation always
denied; Google signals and ad personalisation off.

## 1. Configuration: `site.config.json`

| Key | Meaning | Today |
|---|---|---|
| `appId` | App Store ID shared with the app (release contract) | `6740155884` |
| `ga4MeasurementId` | GA4 web stream ID | `G-YJKL80Z8DP` (live since 2026-10-19) |
| `appStoreProviderToken` | App Store Connect provider token (`pt`) | empty: clean, untagged App Store links |
| `campaignPrefix` | First segment of every website campaign token | `w` |
| `analyticsHost` | The only hostname that may send data | `getleft.app` |
| `analyticsExcludedPaths` | Paths that never load analytics (also under a locale prefix, e.g. `/de/invite`) | `/invite`, `/todoist`, `/friends`, `/public` |

Empty IDs mean "not configured yet". The site must build and work with both
empty, and it emits no analytics while `ga4MeasurementId` is empty.

To switch analytics on: create the GA4 property (below), put its measurement
ID into `ga4MeasurementId`, run the site build, deploy.

## 2. GA4 property

- Property: **getleft.app** in account CristianRus4 (44324492), property ID `559550454`,
  web stream `16156543586` for `https://getleft.app`, measurement ID `G-YJKL80Z8DP`.
  Reporting time zone New Zealand, currency USD. Created 2026-10-19.
- Status on 2026-10-19: Google signals off (never turned on); event data retention set to
  14 months; enhanced measurement keeps page views (page loads only), scrolls, outbound
  clicks, video and file downloads, with site search, form interactions and history-based
  page changes off; custom dimensions `placement`, `locale`, `content_type` created;
  Search Console (`sc-domain:getleft.app`) linked. `download_click` is marked as a key
  event once GA has received it (the new GA4 admin only stars events it has seen).
- No Google Ads link exists, so the ads-personalisation panel stays inactive; the tag
  also sends `allow_ad_personalization_signals: false` and denies every ad signal.
- Cloudflare also injects its own Web Analytics beacon (`static.cloudflareinsights.com`)
  into browser responses. That comes from a Cloudflare dashboard setting, not this repo.
- Admin → Data collection: Google signals **off**. Leave granular location and
  device data collection at its default (the privacy policy discloses
  approximate location and device type).
- Admin → Data retention: **14 months** for event and user data.
- Admin → Data streams → Enhanced measurement: keep page views, scrolls and
  outbound clicks; turn **off** "Page changes based on browser history events",
  "Site search" and "Form interactions". The first two read the raw URL (and
  query) instead of the sanitised `page_location`; the site has no search box
  and no forms worth measuring.
- Admin → Events: mark **`download_click`** as the key event.
- Admin → Custom definitions: register event-scoped dimensions `placement`,
  `locale`, `page_path`, `content_type`, `link_url` so they can be used in
  explorations.
- No Google Ads link, no BigQuery link, no User-ID.

## 3. What the build injects

`scripts/site-inject.mjs` (English pages) and `scripts/build-i18n.mjs` (every
locale copy) apply these. Pages in the injector's `NO_ANALYTICS` set (invite,
public invite, Todoist OAuth fallback, `friends`) get none of the analytics
parts.

| Piece | Where | Only when |
|---|---|---|
| `partials/analytics.html` | `<head>`, right after the language-detect block, between `<!-- left:analytics:start -->` / `<!-- left:analytics:end -->`; `__GA4_ID__` → measurement ID, `__GA4_EXCLUDED__` → JSON array of `analyticsExcludedPaths` | `ga4MeasurementId` set |
| `partials/consent-banner.html` | before `</body>`, between `<!-- left:consent:start -->` / `<!-- left:consent:end -->`; translated by the normal i18n pass (`common.consent.*`) | `ga4MeasurementId` set |
| Footer "Cookie settings" link | `nav.footer-links`: `<a href="#" data-consent-open data-i18n="common.footer.cookie_settings">` | `ga4MeasurementId` set |
| `smartBannerMeta()` | replaces `<meta name="apple-itunes-app">` | always |
| `rewriteAppStoreLinks(html, { family, locale })` | every App Store `<a>` on the page | always (clean URLs while the token is empty) |

`partials/analytics.html` loads `/analytics.js` (deferred), which holds the
banner behaviour and the `download_click` listener.

## 4. Consent design

The inline loader runs only when `location.hostname === 'getleft.app'` and the
path is not excluded. It then:

1. Sets two Consent Mode v2 defaults. For the region list (EU27, the French
   outermost regions GF/GP/MQ/RE/YT/MF, IS, LI, NO, GB, CH) everything is
   `denied` with `wait_for_update: 500`. The global default grants only
   `analytics_storage`; `ad_storage`, `ad_user_data` and `ad_personalization`
   are denied everywhere. Google resolves the region from the IP address.
2. Applies a stored choice from `localStorage['left.consent']`
   (`granted` / `denied`) with `gtag('consent', 'update', …)`.
3. Sets `ads_data_redaction: true`, `url_passthrough: false`, and configures
   the property with `allow_google_signals: false`,
   `allow_ad_personalization_signals: false`.
4. Sends a sanitised `page_location` (origin + path + only `utm_*` and `ref`
   query parameters; `invite`, `code` and anything else are dropped) and a
   sanitised `page_referrer` (origin + path, never a query; any
   `*.getleft.app` subdomain or excluded path is cut to the origin).
5. Loads `gtag.js` asynchronously.

While consent is denied, GA4 sets no cookies and sends cookieless pings that
Google uses for behavioural modelling only.

**Banner.** Server-rendered and hidden in every page
(`#left-consent`, translated). `analytics.js` reveals it when there is no
stored choice **and** the browser time zone is `Europe/*` or one of
Atlantic/Canary, Madeira, Azores, Reykjavik, Faroe, Arctic/Longyearbyen (plus
Cyprus, Ceuta and the French outermost regions, which sit outside `Europe/*`).
"Allow analytics" / "No thanks" store the choice (a storage failure still
applies it to the current page), send the consent update and hide the banner.
"Cookie settings" in the footer (`[data-consent-open]`) reopens it anywhere in
the world. The banner CSS is injected by `analytics.js` (no `style.css`
change): bottom-left card on desktop, bottom-centre on mobile, lifted above
the mobile `.hero-floater` download button, 44 px targets, dark mode,
reduced-motion safe. The time zone is only a hint for showing the prompt;
the legal default always comes from Google's IP-based region.

**Storage on the visitor's device:** `left.lang` (language) and
`left.consent` (choice) in localStorage; `_ga`, `_ga_<id>` cookies once
analytics storage is granted.

**Privacy policy:** `privacy.html#website` ("This website") describes all of
this; the banner's privacy link points there.

## 5. Events

Only page views (automatic) and one custom event. No scroll-depth, engagement
or fingerprinting code.

`download_click`, sent with `transport_type: 'beacon'` from one delegated
capture-phase listener for `a[href*="apps.apple.com"]`, `/download`, `/app`,
`/ios` and `[data-cta]`:

| Parameter | Value |
|---|---|
| `placement` | the element's `data-cta`, else inferred: `.top-nav` → `nav`, `.hero-floater` → `float`, `.hero` → `hero`, `.download-block` / `.download-cta` → `end`, `.site-footer` → `footer`, `.tool-result` / `[data-tool-result]` → `result`, else `inline` (first matching rule wins) |
| `locale` | `<html lang>` |
| `page_path` | `location.pathname` |
| `content_type` | `<meta name="left:content-type">`, else from the path: home, blog, tool, support, legal, press, landing |
| `link_url` | link href without query or hash |

**Key event:** `download_click`. It measures intent; actual installs come from
App Store Connect (section 6).

## 6. App Store campaign links

`scripts/lib/appstore.mjs` builds every App Store link.

- With a provider token:
  `https://apps.apple.com/app/apple-store/id6740155884?pt=<pt>&ct=<ct>&mt=8`
- Without one (today): `https://apps.apple.com/app/id6740155884`

**Campaign token (`ct`)** = `<prefix>-<family>-<placement>-<locale>`, family and
placement lowercased, locale as published. Families come from
`ctaFamily(page)` in `scripts/site-inject.mjs`: `home`, `blog`, `tool`,
`support`, `legal`, `land`, `other`. Placements are the `data-cta` values above.

| Link | `ct` |
|---|---|
| Top-nav button on the home page | `w-home-nav-en` |
| Floating mobile button, Spanish home | `w-home-float-es` |
| End-of-post button, Traditional Chinese blog | `w-blog-end-zh-Hant` |
| Result card on a German tool | `w-tool-result-de` |
| QR code | `w-other-qr-all` |
| Smart App Banner | `w-banner` |

**Length limit.** App Store Connect Help ("Campaign links") allows up to **30**
characters for a campaign token; older guidance said 40. `campaignToken()`
throws above 30 so the build fails instead of silently losing data. The
longest token the current families can produce (`w-support-result-zh-Hans`)
is 24.

**Provider token.** It identifies the developer account and is the same for
every campaign. Get it once: App Store Connect → Apps → Left → Analytics →
Acquisition → Campaigns → Generate campaign link; copy the `pt` value. Put it in
`appStoreProviderToken`, run the build (it rewrites every App Store link in
every locale and adds `data-cta` where missing; the rewrite is idempotent), and
regenerate the QR (section 8). Nothing else needs editing.

Campaign data appears in App Store Connect 24 hours after the first downloads
and only once a campaign has at least 5 first-time downloads; downloads are
attributed when they happen within 24 hours of the click.

## 7. Smart App Banner

`smartBannerMeta()` writes `<meta name="apple-itunes-app" content="app-id=6740155884">`.
Once a provider token exists it adds
`affiliate-data=pt=<pt>&ct=w-banner&mt=8`.

Apple's WebKit reference ("Promoting apps with Smart App Banners") documents
only `app-id` and `app-argument`. App Store Connect Help ("Campaign links")
tells developers to add their campaign and provider tokens to Smart App
Banners but gives no syntax; `affiliate-data` is the only parameter the banner
has accepted for this, and developers report it as the working form (Apple
Developer Forums threads 803466 and 824941; Apple has not confirmed it).
Safari ignores an unknown parameter, so it cannot break the banner. If
`w-banner` never shows data after a month with the token set, drop it.

## 8. QR code

`invite/qr-app-link.svg` is the mask image used by `.qr-mask` in `style.css`.
It encodes `appStoreUrl({ family: 'other', placement: 'qr', locale: 'all' })`.
Regenerate it after setting the provider token:

```sh
URL=$(node -e "import('./scripts/lib/appstore.mjs').then(m => console.log(m.appStoreUrl({ family: 'other', placement: 'qr', locale: 'all' })))")
swift scripts/make-qr.swift "$URL" invite/qr-app-link.svg
```

The script uses CoreImage `CIQRCodeGenerator` (correction level M), keeps the
original SVG structure (329×329 viewBox, white shapes, rounded finder rings,
round modules), then renders the written file and decodes it with
`CIDetector`; it exits non-zero if the decoded URL differs.
`swift scripts/make-qr.swift --verify invite/qr-app-link.svg` only decodes.

## 9. Short links

Cloudflare `_redirects`, 302 to the App Store:

| Path | Use | `ct` |
|---|---|---|
| `/download` | the share link the app itself hands out | `app-share` (no `w-` prefix: it measures app sharing, not the site) |
| `/app` | short link for posts, bios, print | `w-short-app` |
| `/ios` | short link for posts, bios, print | `w-short-ios` |

Targets follow section 6: clean `https://apps.apple.com/app/id6740155884`
until the provider token exists, then
`https://apps.apple.com/app/apple-store/id6740155884?pt=<pt>&ct=<ct>&mt=8`.
Clicks on on-site links to these paths are also counted by `download_click`.

## 10. Weekly data pull

Once a week (Monday, covering the previous 7 and 28 days):

1. **Search Console** (getleft.app and left-time.app properties): queries,
   pages, countries, CTR and position through the browser extractor; save the
   export under `docs/seo/gsc/<date>/<property>/`.
2. **GA4**: Explore → free form, event `download_click`, rows `placement`,
   `locale`, `page_path` (also `content_type`), metric event count; plus
   sessions per landing page for the same window, giving clicks per session by
   page and placement. Note the share of EEA traffic that is modelled.
3. **Elevate** (app id `left`, read-only):
   `elevate metrics breakdown --app left --metric first_time_downloads --by source-type --window 28d`
   for the Web Referrer share of downloads, and
   `elevate metrics breakdown --app left --metric first_time_downloads --by storefront --window 28d`
   to see which storefronts web downloads come from (add
   `--source-type 'Web referrer'` to `metrics series` for day-by-day jumps).
4. **App Store Connect** → Analytics → Acquisition → Campaigns: first-time
   downloads, proceeds and sessions per `ct` once the provider token is live;
   group by placement and locale from the token segments and compare with
   GA4's `download_click` for the same window (click-to-download rate).

5. **Bing Webmaster Tools** (getleft.app, imported from Search Console):
   Search Performance clicks, impressions and top queries, plus Sitemaps and
   IndexNow submission status. Bing also feeds DuckDuckGo, Yahoo, Ecosia,
   ChatGPT search and Copilot. It is large in Japan (about 31% of searches).

Record the week's numbers next to the GSC export (same dated folder) together
with any change shipped that week, so changes can be read against them.

## 11. Bing and IndexNow

- **Bing Webmaster Tools.** getleft.app (and left-time.app) were added on
  2026-10-20 by importing them from Google Search Console under the owner's
  Google account. The import verified the sites but brought in no sitemaps, so
  `https://getleft.app/sitemap.xml` was submitted by hand the same day. Don't
  submit a sitemap for left-time.app: it is being redirected. Once that
  redirect is live, run Bing's **Site Move** tool from left-time.app to
  getleft.app, as with Search Console's Change of Address.
- **First IndexNow run.** All 637 sitemap URLs were submitted on 2026-10-20.
  A brand-new key first returns `403 SiteVerificationNotCompleted` until Bing
  has checked the key file; retry a little later.
- **IndexNow.** The key is `indexNowKey` in `site.config.json`, and the key file
  `/<key>.txt` sits at the site root. After each push to main, run
  `node scripts/indexnow.mjs`. It submits the pages changed since the last
  submission, which is tracked in the shared local ref `refs/indexnow/submitted`,
  to `api.indexnow.org`. That one endpoint reaches Bing, Yandex, Naver and
  Seznam. `--all` resubmits the whole sitemap, and `--dry-run` only lists URLs.
  Google does not use IndexNow; Search Console's sitemap covers it.

## 12. Drip publishing

New pages and translation releases go live on dated days, not all at once (see the drip
publishing section in `LANE-NOTES.md`). That makes each launch readable on its own.

- **When something went live.** `docs/seo/publish-schedule.md` lists every English page and
  translation release with its New Zealand date. Each daily publish is also a commit on main
  by `github-actions[bot]` named `Daily publish <date>: <items>`, for example
  `Daily publish 2026-10-21: blog/fr`. Releases dated 2026-10-20 are the pages that were
  already live when the schedule started.
- **Reading a release.** In Search Console, filter the page path to the locale folder (for
  example `/fr/blog/`) and compare impressions and clicks from the release date on. In GA4,
  use the `locale` and `content_type` dimensions on `page_view` and `download_click`. Give a
  release two to four weeks before judging it.
- **Recording.** In the weekly pull (section 10), list the pages and releases that went live
  that week next to the numbers.
- **Crawling.** The daily workflow submits the changed URLs to IndexNow itself
  (`scripts/indexnow.mjs --since <previous main>`), so there is no manual run for those
  pushes. New URLs enter `sitemap.xml` on their day, with `lastmod` set to that commit's date.
