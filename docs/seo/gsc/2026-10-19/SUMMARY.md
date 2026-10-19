# Search Console summary, 2026-10-19

Raw exports are in this folder (see `README.md`). Performance data runs to 16 Oct 2026.

## What works

The old domain, **left-time.app**, still holds Left's Google traffic: 4,900 clicks and 118,000 impressions over 16 months, at an average position of 5.9.
- Almost all of it lands on its home page.
- Monthly clicks peaked at 884 in Jan 2026, dropped to 274 in May, and recovered to 647 in Sep 2026.
- Top countries: India (1,173 clicks), US (872), UK (283), Canada (178), Germany (152), Australia (148).

Query clusters (named queries; 71% of clicks are anonymised long-tail):

| Cluster | Clicks | Impressions | Avg position |
|---|---|---|---|
| Brand ("left app", "left time app", "left widgets for time left") | 1,187 | 13,926 | 5.0 |
| People looking for an Android version | 126 | 872 | 5.0 |
| Days since / habit / streak widgets | 15 | 1,397 | 8.2 |
| Year / day / life progress widgets | 22 | 957 | 7.4 |
| Countdown / days left / days until | 4 | 648 | 13.3 |
| Generic "widget" queries | 6 | 539 | 16.8 |
| Wallpaper (days left, time left, year) | 9 | 411 | 6.9 |

Striking distance (position 4 to 20, at least 60 impressions, CTR under 3%). These are feature-intent searches that only the old home page answers today:

| Query | Impressions | Position |
|---|---|---|
| left time | 2,861 | 4.3 |
| time left app | 311 | 7.9 |
| days left widget android | 278 | 6.1 |
| life widget time progress | 255 | 7.8 |
| days since widget | 255 | 8.8 |
| days since widget iphone | 234 | 6.1 |
| year progress widget | 205 | 8.0 |
| time left countdown | 112 | 7.8 |
| days left wallpaper iphone | 104 | 7.1 |

## What fails, and why

**getleft.app** has had 13 clicks and 1,120 impressions since its data began on 28 May 2026, at an average position of 52.8.

**Discovery.** The 48 blog posts were "URL is unknown to Google":
- nothing linked to `/blog/`;
- no sitemap had been submitted;
- the blog canonicals pointed at `.html` URLs that redirect.

**Authority.** The domain is new, and the established left-time.app is not redirected to it. Tools collect impressions but rank at positions 55 to 90.

**Not indexed: 476 pages.**
- 302 old `.html` URLs that redirect. This is expected.
- 168 "Crawled, currently not indexed", of which 155 are localized support articles. They are machine-translated metadata on a new domain, and locale URLs were not in the sitemap as their own entries.
- 4 `/es-419/` pages folded into `/es/`, because Google does not support the `es-419` hreflang code and the two Spanish versions were 79% identical.
- 1 404 (`/cdn-cgi/l/email-protection`) and 1 redirect error (`/web.html`).

**Clicks only measure Google Search.** Visits from social posts, shared links and the App Store's developer link do not appear here, and the site had no analytics before today.

## What changed today (commits 7c568244 and 55d83543)

- **Blog linked everywhere.** The blog is now in every page's nav and footer and in a home section.
- **Canonicals.** All canonicals are clean URLs, and internal `.html` links were rewritten.
- **Sitemap.** It has 649 URLs (every page in every locale) with real `lastmod` dates. It was submitted and read successfully: 649 discovered.
- **hreflang.** `es-419` was replaced by country codes. `robots.txt` now blocks `/cdn-cgi/`.
- **Indexing requested** for: home, `/blog/`, how-to-build-a-streak, adhd-time-blindness-iphone, what-is-year-progress, `/tools/`, `/support`.
- **Validate fix started** for: crawled not indexed, duplicate canonical, 404, redirect error.
- **Analytics.** Google Analytics 4 is live with consent mode, and `download_click` is tracked on every App Store link.

## Next check

- **On 26 Oct and 2 Nov:**
  - indexed count;
  - blog posts indexed (target: at least 40 of 48 by 18 Nov);
  - crawled-not-indexed count;
  - getleft.app impressions;
  - the validation outcomes.
- **After the left-time.app redirect goes live:** watch brand clicks move from left-time.app to getleft.app.
