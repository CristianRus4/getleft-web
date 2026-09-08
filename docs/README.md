# Left website documentation

This directory explains how the public Left website is structured, what it may
claim, and how to operate it safely. The repository root `README.md` remains the
quick technical entry point; these documents add product, content, and release
context.

## Start here

| Work | Read |
| --- | --- |
| Site structure, domains, redirects, localization, or integrations | [Site blueprint](SITE_BLUEPRINT.md) |
| Marketing, support, SEO, deployment, or release QA | [Marketing and operations](MARKETING_AND_OPERATIONS.md) |
| Product-approved website copy | [Left website content](../../../Apps/Left-app/docs/WEBSITE_CONTENT.md) |
| Product architecture and terminology | [Left blueprint](../../../Apps/Left-app/BLUEPRINT.md) |
| Translation implementation | [i18n README](../i18n/README.md) and [Nexus translation notes](nexus/TRANSLATIONS.md) |
| Nexus ownership | [Nexus project](nexus/PROJECT.md) and [website operations](nexus/WEBSITE.md) |

## Identity

- Product name: **Left**
- Canonical public site: `https://getleft.app`
- Universal-link host: `https://go.getleft.app`
- App Store ID: `6740155884`
- Hosting: Cloudflare Pages from this repository
- App repository: `Apps/Left-app`

`getleft-web` is the active Left website. The older `left-time` site or
repository is not a current product surface and must not be used as the source
for links, copy, or Nexus ownership.

## Documentation contract

- Source code and Cloudflare configuration are authoritative for live routing.
- The app repository is authoritative for shipped product behavior.
- `Apps/Left-app/docs/WEBSITE_CONTENT.md` is the approved product-copy bridge.
- This repository is authoritative for public pages, support articles, SEO
  metadata, legal copy, and web integration endpoints.
- Commit and push docs to main before expecting them to appear in Nexus.
