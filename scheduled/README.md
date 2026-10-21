# scheduled/

New English pages waiting for their publish date. Put a page here at the same relative path it
will have on the site (`scheduled/blog/new-article.html` becomes `blog/new-article.html`) and give
that path a date in `pages` in `i18n/publish-schedule.json` (Lane 0 only).

On or after that New Zealand date, `node scripts/build.mjs` (run daily by
`.github/workflows/daily-publish.yml`) moves it into place, and the normal build takes over:
canonical, nav, analytics, sitemap and translation extraction. A blog post also gets its card at the
top of `blog/index.html` automatically (`scripts/build-blog-list.mjs`); don't add it by hand. Until then the live site returns
404 for `/scheduled/*` and nothing may link to the page: `scripts/check-publish.mjs` fails the
build if a live page does. Add links to it on or after its date.

See the drip publishing section in `docs/seo/LANE-NOTES.md`.
