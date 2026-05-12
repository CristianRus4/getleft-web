# Left — Remaining Work

## What's implemented

**Infrastructure**
- GitHub repo (`getleft-web`) connected to Cloudflare Pages, auto-deploys on push to `main`
- Both `getleft.app` and `go.getleft.app` live and serving from the same repo
- `.well-known/apple-app-site-association` at repo root with real Team ID (`5X94H5ZCD4`) and bundle ID (`com.cr.left`) — served at `go.getleft.app/.well-known/apple-app-site-association`
- `_redirects` file in place (minimal, ready for left-time.app redirect)

**Website**
- `index.html` — homepage with hero, features, reviews, FAQ, footer, Smart App Banner
- `support.html` — support/FAQ page (placeholder content, needs real copy)
- `contact.html` — contact page (email, press kit link, X handle)
- `style.css` — shared stylesheet (orange gradient, glass cards, invite page styles)
- `invite/index.html` — invite landing page at `getleft.app/invite`:
  - Smart App Banner
  - Fetches inviter name from Firestore (`friendInvites` → `publicProfiles`), renders `@username invited you to Left`
  - Step 1: bare App Store badge
  - Step 2: Accept invitation → `go.getleft.app/invite?invite=CODE`
  - Error state for missing/invalid invite code
- `public/invite/index.html` — JS redirect shim (forwards legacy path to `/invite`)
- `favicon/`, `images/` — all assets in place

**iOS app**
- `Left.entitlements` — `applinks:go.getleft.app` Associated Domains entitlement added
- `FriendsManager.inviteURLString(for:)` — generates `https://getleft.app/invite?invite=CODE` (landing page URL, not Universal Link)
- `FriendsManager.inviteID(from:)` — handles Universal Links (`go.getleft.app/invite`), legacy custom scheme (`left://friends/invite`), and legacy web domains

---

## Pending

### Verification (blocking for launch)

- [ ] **AASA CDN propagation** — check `https://app-site-association.cdn-apple.com/a/v1/go.getleft.app` returns `5X94H5ZCD4.com.cr.left` (was still showing old cached value, may take up to 24h from last push)
- [ ] **End-to-end invite flow — cold launch** — share invite → tap link → Safari loads `getleft.app/invite` → install app → return to page → tap Accept invitation → app opens with correct invite code, friendship created
- [ ] **End-to-end invite flow — warm launch** — app installed, tap `go.getleft.app/invite?invite=CODE` → iOS intercepts as Universal Link → app opens directly to invite acceptance
- [ ] **Auto-redirect** — verify `getleft.app/invite?invite=CODE` opened from Safari (app installed) stays in Safari (no AASA on main domain, intentional), and `go.getleft.app` triggers Universal Link correctly

### Website content

- [ ] **Homepage** — replace placeholder copy and screenshots with real content: updated feature descriptions, real app screenshots or mockups, accurate reviews if any, correct links
- [ ] **Support page** — rewrite with real, accurate FAQ content covering current Left features (habits, countdowns, life widgets, friends); verify all answers are correct
- [ ] **Contact page** — confirm email, update any links
- [ ] **Privacy policy** — create `privacy.html` (linked from footer but page doesn't exist yet); write or port actual privacy policy
- [ ] **Invite page visual polish** — review layout on small screens, refine step presentation, consider adding a preview of what Left looks like

### App

- [ ] **In-app invite UI** — improve the invite acceptance view and/or the "invite a friend" sharing flow UI (FriendsView and related views in Left-app)

### Infrastructure (lower priority)

- [ ] **left-time.app redirect** → `getleft.app` (tracked as LEFT-709; add rule to `_redirects`)
- [ ] **`aps-environment` in entitlements** — currently `development`; confirm it's set to `production` in the release build config (or handled by Xcode automatically via signing)
