# Content audit, October 2026 (CNTXT-885)

Read-only audit of every live English page, scored 1-5 on eight lines (search fit, accuracy, depth, internal links, E-E-A-T, conversion, technical, translation). Nothing here edits a live page.

| File | What it holds |
|---|---|
| `fix-list.md` | **Start here.** All fixes ranked by demand x gap, with translation impact per fix, the decisions the owner needs to make, and what the verification rejected. |
| `blog.md` | 47 posts plus the blog index (the newest post, `best-days-since-apps-iphone`, was skipped). |
| `tools.md` | 57 tools plus the tools index. |
| `support.md` | 29 support articles plus the support index. |
| `site.md` | Home, 7 landing pages, press, contact, privacy, web and 3 redirect stubs. |
| `translations.md` | Three pages per locale (54 pages) and the catalog reports. |
| `data/` | `facts.json` (scripted facts per page), `*-fixes.json` (each group's proposed fixes), `ranked-fixes.json` (merged, verified, ranked), `verification.json` (Opus check of the first 20), `locale-sample.json`, and the two read-only scripts that produced the data (`extract-facts.mjs`, `sample-locales.mjs`). |

Scored 2026-10-21 against `main` at 13d696b2. Search Console data: `docs/seo/gsc/2026-10-19/`. Re-run `node docs/seo/audit/data/extract-facts.mjs` from the repo root to refresh `facts.json`.
