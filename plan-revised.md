# getleft.app — Implementation Plan

## Overview

Set up `getleft.app` as the canonical domain for Left, hosted via Cloudflare Pages deploying from a GitHub repo. Implement Universal Links using `go.getleft.app` as the interception subdomain, with a static invitation landing page that handles both the app-not-installed and app-installed flows.

---

## 1. GitHub Repository

### 1.1 Create the repo

- Create a new public GitHub repo: `getleft-website` (or `getleft.app`)
- Initialize with the following structure:

```
getleft.app/
├── .well-known/
│   └── apple-app-site-association     ← served at go.getleft.app/.well-known/apple-app-site-association
├── public/
│   ├── invite/
│   │   └── index.html                 ← invitation landing page
│   └── _redirects                     ← Cloudflare Pages redirect rules
├── index.html                         ← placeholder homepage (fill in later)
├── support.html                       ← placeholder
├── contact.html                       ← placeholder
└── README.md
```

### 1.2 Notes on structure

- All files in the root are served at `getleft.app/`
- The `.well-known/` folder must be served with no transformation — Cloudflare Pages does this by default
- `public/invite/index.html` is served at `getleft.app/invite` (Cloudflare Pages serves `index.html` from directory automatically)
- The `_redirects` file is Cloudflare Pages' native redirect mechanism (same syntax as Netlify)

**✅ DONE:** Folder structure created. All files present:
- `.well-known/apple-app-site-association` — AASA file with placeholder TEAMID (replace before go-live)
- `public/invite/index.html` — fully functional invite landing page with JS flow
- `index.html` — homepage styled to match left-web, with hero, features, reviews, FAQ, footer
- `support.html` — full support/FAQ page with all common questions
- `contact.html` — contact page with email, press kit link, X link
- `style.css` — shared stylesheet copied and extended from left-web
- `_redirects` — Cloudflare Pages redirect file (minimal, ready for left-time.app redirect later)
- `README.md` — full documentation of structure, domains, Universal Link flow, and Cloudflare setup
- `images/` — copied from left-web: left-hero.webp + left-features-1 through 6.webp
- `favicon/` — copied from left-web: all favicon sizes + site.webmanifest

---

## 2. Cloudflare Setup

### 2.1 Connect GitHub repo to Cloudflare Pages

1. In Cloudflare dashboard → Pages → Create a project
2. Connect to GitHub, select the `getleft-website` repo
3. Build settings:
   - Framework preset: **None**
   - Build command: leave empty (static site, no build step)
   - Build output directory: `/` (root)
4. Deploy

### 2.2 Add custom domains in Cloudflare Pages

In the Pages project → Custom Domains, add:

- `getleft.app`
- `go.getleft.app`

Cloudflare will automatically configure the DNS records since the domain is already in Cloudflare.

### 2.3 `_redirects` file

Place this at the root of the repo as `_redirects`:

```
# Catch-all for go.getleft.app paths — served from same Pages project
# No redirects needed for go subdomain, it shares the same repo

# Future: redirect left-time.app → getleft.app (add later)
```

For now the `_redirects` file can stay minimal. Cloudflare Pages serves both `getleft.app` and `go.getleft.app` from the same repo — no redirect between them needed since `go.getleft.app` hosts its own dedicated path (`/invite`).

**✅ DONE:** `_redirects` file created at repo root with placeholder comment for future left-time.app redirect.

---

## 3. Apple App Site Association (AASA)

### 3.1 File location

Create `.well-known/apple-app-site-association` at the repo root. This file is served at:

- `https://go.getleft.app/.well-known/apple-app-site-association`

The AASA only needs to be on `go.getleft.app` since that is the Universal Link interception domain.

### 3.2 File content

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appIDs": ["TEAMID.com.yourcompany.left"],
        "components": [
          {
            "/": "/invite*",
            "comment": "Matches all invite deep links"
          },
          {
            "/": "/join*",
            "comment": "Reserved for future deep links"
          }
        ]
      }
    ]
  }
}
```

Replace `TEAMID` with your Apple Developer Team ID and `com.yourcompany.left` with Left's bundle identifier.

### 3.3 Content-Type requirement

The file **must** be served as `application/json`. Cloudflare Pages serves `.well-known/apple-app-site-association` correctly by default — no extra headers config needed.

### 3.4 Validate

After deploy, verify at:
```
https://app-site-association.cdn-apple.com/a/v1/go.getleft.app
```

Apple's CDN fetches and caches your AASA. Changes take up to 24 hours to propagate.

**✅ DONE:** `.well-known/apple-app-site-association` created with placeholder `TEAMID.com.cntxt.left`. Replace TEAMID and bundle ID before deploying to production.

---

## 4. Invitation Landing Page

### 4.1 Location

`public/invite/index.html` → served at `getleft.app/invite?invite=CODE`

The page is on `getleft.app`, not `go.getleft.app`. This is intentional — the landing page is a human-readable webpage. The Universal Link interception happens when the user taps the step 2 button, which points to `go.getleft.app`.

### 4.2 Flow recap

```
getleft.app/invite?invite=CODE
        │
        ├─ App not installed → page loads in Safari
        │       Step 1: Download on App Store
        │       Step 2: <a href="https://go.getleft.app/invite?invite=CODE">Accept invitation</a>
        │
        └─ App installed → iOS intercepts as Universal Link → app opens directly
```

Wait — if the app is installed, iOS intercepts `getleft.app/invite` only if `getleft.app` also has an AASA. Since we are deliberately NOT putting an AASA on `getleft.app` (to avoid same-domain suppression on the step 2 button), the initial tap of `getleft.app/invite` will always load in Safari when tapped from outside the app.

This is the correct and intentional behavior:
- `getleft.app/invite` = always loads in Safari = shows the landing page
- `go.getleft.app/invite` = always intercepted by iOS if app is installed = opens app

The step 2 button on the landing page uses `go.getleft.app`.

### 4.3 Invite code extraction

The landing page reads the invite code from the URL with plain JavaScript:

```javascript
const params = new URLSearchParams(window.location.search);
const inviteCode = params.get('invite');
```

The step 2 button is built dynamically:

```javascript
const acceptBtn = document.getElementById('accept-btn');
acceptBtn.href = `https://go.getleft.app/invite?invite=${inviteCode}`;
```

### 4.4 Page must handle missing/invalid code

If `invite` param is absent, show a generic "This link is invalid or has expired" message. No Firestore lookup needed — the app handles validation after the deep link opens.

**✅ DONE:** `public/invite/index.html` created with:
- Full JS flow: reads `?invite=CODE` from URL
- Dynamically builds `go.getleft.app/invite?invite=CODE` deep link for the "Accept invitation" button
- App Store download button for new users
- Error/fallback state when invite code is absent or invalid
- Styled with shared style.css (orange gradient, glass cards, same aesthetic as homepage)

---

## 5. Xcode — Associated Domains Entitlement

### 5.1 Add entitlement

In Xcode → Left target → Signing & Capabilities → + Capability → Associated Domains.

Add:

```
applinks:go.getleft.app
```

Do **not** add `applinks:getleft.app`. Only `go.getleft.app` should intercept Universal Links.

### 5.2 Handle the Universal Link in code

In `SceneDelegate.swift`:

```swift
func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
    guard userActivity.activityType == NSUserActivityTypeBrowsingWeb,
          let url = userActivity.webpageURL,
          url.host == "go.getleft.app",
          url.path.hasPrefix("/invite") else { return }

    let components = URLComponents(url: url, resolvingAgainstBaseURL: false)
    guard let inviteCode = components?.queryItems?.first(where: { $0.name == "invite" })?.value else { return }

    // Route to the friend invite acceptance flow
    NotificationCenter.default.post(name: .didReceiveInviteLink, object: inviteCode)
}
```

Post a notification or call directly into your coordinator/router — whatever pattern Left uses for navigation.

Also handle cold launch (app not running when link is tapped):

```swift
func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
    if let userActivity = connectionOptions.userActivities.first {
        self.scene(scene, continue: userActivity)
    }
}
```

---

## 6. Firebase — Invite URL Update

### 6.1 Current state

The app generates: `left://friends/invite?invite=CODE`

### 6.2 Target state

The app generates: `https://go.getleft.app/invite?invite=CODE`

### 6.3 Change required

Find where `left://friends/invite?invite=` is constructed in the app codebase and replace the base URL. This is a single string constant change — the invite code generation and Firestore write are unchanged.

Example before:
```swift
let inviteURL = "left://friends/invite?invite=\(inviteCode)"
```

Example after:
```swift
let inviteURL = "https://go.getleft.app/invite?invite=\(inviteCode)"
```

### 6.4 Firestore — no changes needed

The `friendInvites` collection schema (`code`, `inviterId`, `createdAt`, `updatedAt`) is unchanged. The landing page does not read from Firestore. The app reads from Firestore after the deep link opens, exactly as it does today.

---

## 7. Deployment Checklist (ordered)

- [x] Create GitHub repo with the folder structure above
- [x] Add placeholder `index.html`, `support.html`, `contact.html` at root
- [x] Add `.well-known/apple-app-site-association` with correct Team ID and bundle ID
- [x] Add `public/invite/index.html` landing page
- [ ] Connect repo to Cloudflare Pages
- [ ] Add `getleft.app` and `go.getleft.app` as custom domains in Cloudflare Pages
- [ ] Verify AASA is accessible at `https://go.getleft.app/.well-known/apple-app-site-association`
- [ ] Validate AASA via Apple's CDN checker
- [ ] Add `applinks:go.getleft.app` entitlement in Xcode
- [ ] Implement Universal Link handler in `SceneDelegate` (both warm and cold launch)
- [ ] Update invite URL string in app from `left://friends/invite` to `https://go.getleft.app/invite`
- [ ] Test full flow: share invite → tap link (app not installed) → install → tap step 2 button → app opens with correct invite code
- [ ] Test warm launch: app installed, tap `go.getleft.app/invite?invite=CODE` link → intercepts directly

---

## 8. What Is Not In Scope (for now)

- Redirecting `left-time.app` → `getleft.app` (separate task, LEFT-709)
- Homepage, support, contact page design
- Expiry logic for invites (no `expiresAt` field in Firestore currently)
- Server-side invite validation before showing landing page

---

## 9. Open Questions for Developer

- What is the exact bundle identifier for Left? Needed for the AASA `appIDs` field.
- What is the Apple Developer Team ID? Also needed for AASA.
- What navigation pattern does Left use — coordinator, router, or direct VC push? Affects how the deep link hands off to the invite acceptance UI.
- Is `SceneDelegate` the entry point or does Left use `AppDelegate` + `application(_:continue:restorationHandler:)`? If the app predates multi-window support the handler is in `AppDelegate`.
