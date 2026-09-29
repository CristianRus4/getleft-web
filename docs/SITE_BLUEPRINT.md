# Left site blueprint

## Responsibilities

The site serves four related jobs:

1. Explain Left and send qualified visitors to the App Store.
2. Provide localized support and educational content that matches the current
   app.
3. Host public invitation and Todoist OAuth handoff surfaces.
4. Publish crawler, press, contact, privacy, and other trust material.

## Domains and routing

| Host or path | Responsibility | Important behavior |
| --- | --- | --- |
| `getleft.app` | Marketing, support, blog, contact, press, download, invitation landing | Intentionally does not opt into Left Universal Links |
| `go.getleft.app` | App-opening handoffs | Associated domain for invitations and HTTPS OAuth return |
| `/app` | Generic app-opening Universal Link | Opens Left when installed; otherwise redirects directly to its App Store page |
| `/invite?invite=<code>` | Browser-first invitation explanation | Accept action moves to `go.getleft.app` |
| `/todoist/oauth/return` | Todoist HTTPS return | Forwards authorized parameters to the app's `left://` callback flow |
| `/.well-known/*` | AASA and public OAuth metadata | Must be served without redirects or content rewriting |
| `/download` and `/ios` | App Store shortcuts | Cloudflare redirects to App Store ID `6740155884` |

Both live hosts are served by the same Cloudflare Pages project. Keep AASA
association limited to `go.getleft.app`; enabling it on `getleft.app` would
change the intentional browser-first invitation flow.

The root README's example AASA setup still shows an older placeholder bundle
identifier. The committed `.well-known/apple-app-site-association` and the
current app target use `com.cr.left`; verify the deployed file and Apple CDN
response rather than copying the stale setup snippet into a release change.

## Technical shape

The site is committed static HTML, CSS, JavaScript, images, metadata files, and
Cloudflare `_redirects`. There is no build step for production. A simple local
HTTP server is preferable to `file://` when testing absolute paths, redirects,
or language navigation:

```bash
npx serve .
```

Cloudflare Pages is configured with no framework, no build command, and `/` as
the output directory. Pushing content is therefore equivalent to publishing
the repository tree once Cloudflare's connected deployment succeeds.

## Content topology

- `index.html`: product landing page
- `support.html` and `support/`: support index and detailed support library
- `blog/`: English editorial and search content
- `contact.html`, `press.html`, `privacy.html`, and related trust pages
- locale directories: translated marketing, contact, support index, and support
  articles
- `i18n/`: translation tooling, locale data, and workflow documentation
- `public/invite/`: invitation landing behavior
- `.well-known/`: Apple association and Todoist public-client metadata
- `_redirects`: Cloudflare route, redirect, and shortcut behavior

The repository contains hundreds of committed HTML pages. Bulk changes need
both representative visual review and mechanical checks across every locale;
spot-checking English alone is insufficient.

## Product model reflected on the site

The public hierarchy should match the app:

- Time Left and time-visualization tools establish the core promise.
- Aims, habits, and streaks turn time awareness into repeated action.
- Ahead and Planner make future commitments visible.
- Widgets, Apple Watch, shortcuts, focus tools, mood, fasting, wallpaper, and
  social/accountability features support those primary jobs.

Do not promote an experiment, partially shipped feature, or old name as a
current capability. When uncertain, verify against the app blueprint and source,
then update `WEBSITE_CONTENT.md` in the app repository as part of the same work.

## Localization contract

English is the source for marketing and support changes. Locale pages and i18n
catalogs must preserve:

- the product name **Left**;
- URL and integration parameters;
- App Store and support destinations;
- Apple platform terminology where an official translation exists;
- the meaning and safety implications of account, sync, Health, purchase, and
  social instructions.

Never publish a machine-updated locale without checking page structure,
navigation, metadata, missing tokens, and the most sensitive support flows.
The translation workflow lives under `i18n/` and `docs/`.

## Trust boundaries

- No Todoist client secret belongs in the website or app; the public client uses
  Authorization Code with PKCE and rotating refresh tokens.
- Invitation codes and OAuth authorization parameters must not be logged into
  analytics, copied into documentation, or retained in static content.
- AASA, callback URLs, bundle identifiers, App Store IDs, and redirect paths are
  release contracts shared with the app.
- Privacy, account deletion, purchase restoration, and sync guidance must match
  the current Firebase, CloudKit, Core Data, and RevenueCat behavior described
  in the app repository.
