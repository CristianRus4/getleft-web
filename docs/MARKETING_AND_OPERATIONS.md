# Left website marketing and operations

## Message hierarchy

Lead with the outcome: Left makes time visible so people can act on what matters.
Explain features through concrete user jobs rather than a catalogue of every
tool. Keep the order consistent with the product hierarchy in the app docs.

Public copy must not invent ratings, user counts, medical or ADHD treatment
claims, prices, platform availability, or feature behavior. Editorial content
may discuss ADHD-oriented workflows, but should not diagnose, promise treatment,
or present general productivity advice as clinical guidance.

## Claim review

Before adding or materially changing a product claim:

1. Find the matching app surface and verify it ships in the intended public
   version.
2. Check whether the feature needs a subscription, account, permission,
   network, Apple Watch, specific OS, or third-party service.
3. State those boundaries where omission could mislead.
4. Update the app-side website-content document if the approved message changes.
5. Check every duplicate in metadata, structured data, FAQs, support, blog,
   locale pages, press material, and App Store calls to action.

## Support and editorial maintenance

- Support instructions must be reproducible on the current app and OS.
- Account, sync, social, Health, widgets, purchases, and automation articles are
  release-sensitive and should be reviewed with relevant app changes.
- Date or remove stale screenshots and OS-specific steps rather than blending
  old and new interfaces.
- Blog comparisons must remain factual, dated where appropriate, and respectful
  of third-party names and trademarks.
- Preserve distinct canonical URLs. Do not create localized or blog pages that
  compete with an existing page for the same query and intent.
- Keep sitemap, robots, canonical, `hreflang`, Open Graph, and structured data
  consistent with the rendered page.

## Local and pre-release QA

Serve the repository locally, then check:

- homepage at mobile and desktop widths;
- navigation, footer, App Store calls to action, contact, privacy, and press;
- support search/navigation and at least one deep article per topic family;
- a representative set of short, long, right-to-left if supported, and CJK
  locales;
- missing assets, console errors, keyboard navigation, focus visibility, image
  alternatives, heading order, and reduced-motion behavior;
- canonical, social, FAQ/article structured data, sitemap and robots entries;
- invitation flow with missing, malformed, and valid-looking codes;
- AASA response on `go.getleft.app` and its Apple CDN copy after deployment;
- Todoist OAuth metadata and return path without exposing authorization data.

Static-site link checks should include fragment targets and case-sensitive file
paths, because Cloudflare's production filesystem may expose mistakes hidden by
local development.

## Deployment

Cloudflare Pages deploys this repository automatically. The safe sequence is:

1. Preview locally and review the changed English source.
2. Run translation generation/validation when translatable content changed.
3. Inspect the diff for generated-page scope, accidental credentials, personal
   data, and unintended redirects.
4. Merge or push to the connected production branch.
5. Verify the Cloudflare deployment and both domains.
6. Purge or bypass caches when validating `.well-known` or redirect changes.
7. Record material routing, integration, privacy, or incident changes in docs.

Rollback is a revert and redeploy of the known-good commit. For a broken
integration endpoint, restore the exact previous `.well-known` or redirect file
first; avoid opportunistic content changes in the incident fix.

## Repository documentation

Committed documentation lives in this repository and Context reads it directly.
