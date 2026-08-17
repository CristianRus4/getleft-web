# getleft.app

Source for [getleft.app](https://getleft.app) - the canonical website for **Left**, an iPhone app for habit tracking, countdowns, and life visualisation.

Hosted on **Cloudflare Pages**, deployed from this repo.

---

## Structure

```
getleft.app/
├── .well-known/
│   ├── apple-app-site-association     ← AASA for go.getleft.app Universal Links
│   └── todoist-oauth-client.json      ← Todoist public OAuth client metadata
├── public/
│   └── invite/
│       └── index.html                 ← Invitation landing page (getleft.app/invite?invite=CODE)
├── images/                            ← App screenshots and assets
├── favicon/                           ← Favicons and web manifest
├── index.html                         ← Homepage
├── support.html                       ← Support / FAQ page
├── contact.html                       ← Contact page
├── style.css                          ← Shared stylesheet
├── _redirects                         ← Cloudflare Pages redirect rules
└── README.md
```

---

## Domains

| Domain | Purpose |
|---|---|
| `getleft.app` | Main website - homepage, support, contact |
| `go.getleft.app` | Universal Link interception domain - opens Left app |

Both domains are served from this single Cloudflare Pages project.

---

## Universal Links (go.getleft.app)

The `.well-known/apple-app-site-association` file at the root is served at:

```
https://go.getleft.app/.well-known/apple-app-site-association
```

This enables iOS to intercept invite/friend links and the Todoist OAuth callback on `go.getleft.app`, opening Left directly instead of Safari.

**Important:** `getleft.app` intentionally does NOT have Universal Links configured. The invite landing page loads in Safari (always), and only the "Accept invitation" button points to `go.getleft.app` to trigger the app.

### AASA setup

Replace `TEAMID` and bundle identifier in `.well-known/apple-app-site-association` before going live:

```json
"appIDs": ["TEAMID.com.cntxt.left"]
```

Validate after deploy:
```
https://app-site-association.cdn-apple.com/a/v1/go.getleft.app
```

### Todoist OAuth

Todoist discovers Left as a public OAuth client from:

```
https://getleft.app/.well-known/todoist-oauth-client.json
```

The authorization callback is `https://go.getleft.app/todoist/oauth/callback`. The AASA components above route that callback into the app. The public client uses Authorization Code with PKCE and rotating refresh tokens, so no Todoist client secret is stored in this repository or the app.

---

## Invite flow

```
User taps invite link → getleft.app/invite?invite=CODE
        │
        ├─ App not installed → page loads in Safari
        │       Step 1: Download on App Store
        │       Step 2: Tap "Accept invitation" → go.getleft.app/invite?invite=CODE
        │
        └─ App installed → page still loads in Safari (intentional - no AASA on getleft.app)
                Step 1: Tap "Accept invitation" → iOS intercepts as Universal Link → app opens
```

---

## Cloudflare Pages setup

1. Connect this repo to Cloudflare Pages
2. Build settings: framework = None, build command = empty, output directory = `/`
3. Add custom domains: `getleft.app` and `go.getleft.app`
4. Cloudflare auto-configures DNS since the domain is already in Cloudflare

---

## Local preview

No build step needed - open any `.html` file directly in a browser, or use a simple static server:

```bash
npx serve .
```

---

## App Store

[Download Left on the App Store](https://apps.apple.com/us/app/left-widgets-for-time-left/id6740155884)
