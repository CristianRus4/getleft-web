# Left Website Redesign — Web Plan

## Overview

Full redesign of the Left marketing website. The current site uses orange as the primary background color. The new design flips this: white in light mode, near-black in dark mode, with orange as an accent only. The glassmorphism and blur aesthetic stays. All pages share the new `style.css` design system — including the invite page, which gets invite-specific overrides in a dedicated section at the bottom of the shared CSS rather than a separate file.

---

## 1. Migration & File Structure

### Temporary renames (will be deleted later)

- `index.html` → `oldindex.html`
- `style.css` → `oldstyle.css`

These are kept temporarily as a fallback reference. **No live page should reference them.** When they are deleted, nothing should break. The new `style.css` and new `index.html` fully replace them.

### `web.html` — CSS isolation (important)

`web.html` currently imports `style.css` (line 29) and has an extensive inline `<style>` block with Material 3 tokens. It is visually almost entirely self-contained, but it relies on a handful of base styles from `style.css` (resets, `.container`, font-smoothing, basic body styles). 

**Action required:** Move the small set of base styles that `web.html` uses from the old `style.css` into its existing inline `<style>` block. After this, `web.html` should not reference any external CSS file except the Google Fonts it already loads. This makes it fully independent — no dependency on either `style.css` or `oldstyle.css`. It can then remain on its current visual style indefinitely regardless of what happens to the shared CSS.

The specific styles to inline into `web.html`:
- `* { box-sizing: border-box; }`
- `html, body { min-height: 100%; }`
- `body { margin: 0; font-family: system-ui...; -webkit-font-smoothing: antialiased; }`
- `img { max-width: 100%; height: auto; }`
- `.container` (width, max-width, padding-inline)

### `invite/index.html` — CSS update

The invite page moves from `/oldstyle.css` to `/style.css` (the new shared design system). It no longer needs any separate CSS file. Invite-specific styles (avatar rings, QR code container, invite card, accepted/pending states) live as a clearly marked section at the bottom of the main `style.css`, under a comment like `/* ─── Invite page overrides ─── */`. This means fonts, nav, buttons, footer, glass effects, colors, and dark mode all come from the shared system automatically.

### Final file structure

```
getleft-web/
├── index.html              ← new homepage (built from scratch)
├── style.css               ← new shared design system (includes invite overrides section)
├── oldindex.html           ← TEMP: renamed from old index.html — delete when ready
├── oldstyle.css            ← TEMP: renamed from old style.css — delete when ready
├── privacy.html            ← new page, shared nav + footer
├── terms.html              ← new page, shared nav + footer
├── contact.html            ← new contact page, shared nav + footer
├── web.html                ← keep visual style, CSS made self-contained (see above)
├── reviews.json            ← review data file (see Section 4.8)
├── download/
│   └── index.html          ← instant redirect to App Store URL
├── ios/
│   └── index.html          ← instant redirect to App Store URL (same as /download)
├── web/
│   └── index.html          ← instant redirect to /web.html
├── android/
│   └── index.html          ← instant redirect to /web.html
├── blog/
│   ├── index.html          ← blog listing, updated to new nav + footer
│   ├── blog.css            ← update or migrate into shared style.css
│   ├── best-countdown-widgets-iphone.html      ← rewrite (see Section 5)
│   ├── best-habit-tracker-apps-iphone.html     ← rewrite (see Section 5)
│   ├── how-to-add-widgets-iphone.html          ← rewrite (see Section 5)
│   ├── habitkit-vs-left.html                   ← rewrite (see Section 5)
│   └── [new articles]      ← add new articles (see Section 5)
├── invite/
│   └── index.html          ← update <link> to /style.css, remove old inline overrides
├── TemplateLibrary.json    ← existing, used by carousel JS (read-only, do not modify)
├── inspo/                  ← dev reference images only, not deployed
├── favicon/                ← unchanged
└── images/
    ├── [existing images]   ← keep
    └── [named placeholders]← developer creates placeholder `<img>` tags with semantic
                               filenames; Cristian drops real images into /images/ later
```

### Redirect pages

Each redirect is a minimal HTML file with an immediate `<meta http-equiv="refresh">` and a `<script>window.location.href=...</script>` fallback. No CSS needed.

```
/download/  and  /ios/   →  https://apps.apple.com/us/app/left-widgets-for-time-left/id6740155884
/web/        and  /android/  →  /web.html
```

Example (same pattern for all four):
```html
<!doctype html>
<html><head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="0;url=https://apps.apple.com/us/app/left-widgets-for-time-left/id6740155884">
  <script>window.location.href="https://apps.apple.com/..."</script>
</head><body></body></html>
```

---

## 2. Site-Wide Pages

### 2.1 Homepage — `/index.html`
Described in detail in Section 4.

### 2.2 Privacy — `/privacy.html`
Standard privacy policy page. Shared nav + footer. No custom layout — clean prose with the new typography. Prose content either migrated from an existing privacy page or drafted.

### 2.3 Terms — `/terms.html`
Standard terms of service. Same treatment as privacy.

### 2.4 Contact — `/contact.html`
A simple, clean page with:
- A short description of how to get help.
- Primary contact method: email link (mailto:).
- Link to the FAQ section on the homepage.
- Link to the App Store page (for reviews, which often double as public support).

Shared nav + footer. No form needed — mailto link is sufficient for now.

### 2.5 Try on Web — `/web.html`
Keep the current visual design and all functionality unchanged. Only change: make it CSS-independent (see Section 1 above). Nav and footer on this page keep their current style — this page is intentionally different from the marketing site.

### 2.6 Blog — `/blog/index.html`
Listing page for all articles. Updated to use new nav + footer from the shared design system. See Section 5 for article rewrites and new articles.

### 2.7 Invite — `/invite/index.html`
Updated to reference `/style.css`. All invite-specific styles (avatar, QR code, invite card, button states) live as the last section of `style.css`. Everything else — nav, footer, buttons, background, fonts, dark mode — is inherited from the shared system automatically.

---

## 3. Design System

### 3.1 Color Palette

The key shift: orange is now an **accent**, not a background.

```
Light mode:
  --bg:             #FAFAFA           (near-white, slightly warm — not pure white)
  --bg-surface:     #FFFFFF           (cards, elevated surfaces)
  --bg-muted:       #F2F2F2           (subtle section background tints)
  --text:           #0D0D0D           (near-black for primary text)
  --text-secondary: #6B6B6B           (secondary text, labels)
  --accent:         #FF6B24           (orange — CTAs, highlights, active states)
  --accent-warm:    #E69525           (warm amber — gradient partner for accent)
  --hairline:       rgba(0,0,0,0.08)  (borders, dividers)
  --glass-bg:       rgba(255,255,255,0.6)
  --glass-border:   rgba(255,255,255,0.8)
  --shadow-sm:      0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)
  --shadow-md:      0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)

Dark mode:
  --bg:             #0C0C0E           (very dark, slightly warm black)
  --bg-surface:     #1A1A1C           (cards, elevated surfaces)
  --bg-muted:       #141416           (subtle section background tints)
  --text:           #F5F5F5
  --text-secondary: #8A8A8A
  --accent:         #FF6B24           (same orange)
  --accent-warm:    #E69525
  --hairline:       rgba(255,255,255,0.08)
  --glass-bg:       rgba(255,255,255,0.06)
  --glass-border:   rgba(255,255,255,0.12)
  --shadow-sm:      0 2px 8px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.2)
  --shadow-md:      0 12px 40px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)
```

Orange gradient (CTAs, download section, active states):
```css
linear-gradient(135deg, #FF6B24, #E69525)
```

### 3.2 Typography

Same system UI stack as current — no external fonts on the marketing site:
```css
font-family: system-ui, -apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
-webkit-font-smoothing: antialiased;
```

Type scale:
- Hero H1: `clamp(52px, 8vw, 92px)`, weight 800, letter-spacing -0.03em
- Section H2: `clamp(32px, 5vw, 56px)`, weight 700, letter-spacing -0.025em
- Card H3: 20–24px, weight 600
- Body: 16–18px, weight 400, line-height 1.6
- Label/caption: 13–14px, weight 500, letter-spacing 0.02em, uppercase optional

### 3.3 Glass Effect

Used on the scrolled nav, some feature cards, and invite page surfaces.
```css
backdrop-filter: blur(20px) saturate(180%);
-webkit-backdrop-filter: blur(20px) saturate(180%);
background: var(--glass-bg);
border: 1px solid var(--glass-border);
border-radius: 20px;
```
Light mode: frosted white appearance. Dark mode: slightly lifted dark panel.

### 3.4 Radius
- Cards: 20px
- Bento cells: 16–20px
- Buttons: 9999px (pill)
- Small chips/badges: 9999px

### 3.5 Motion

- Scroll entrance: fade-up (opacity 0→1, translateY 24px→0), 400ms ease-out via Intersection Observer
- Staggered children: 100ms delay increment per item
- Bento flip: 300ms CSS 3D rotateY or crossfade
- Scroll-text: per-word opacity transition 200ms ease
- Counter: `requestAnimationFrame` number tick on first scroll into view
- Nav: opacity + translateY transition, 200ms ease, triggers after ~80px scroll

---

## 4. Homepage — Section-by-Section

### 4.1 Navigation

**Behavior:** Fixed position. Hidden on load (opacity 0, translateY -100%). Becomes visible after the user scrolls ~80px. On other pages (contact, privacy, terms, blog) it is always visible.

**Layout — desktop:**
- Leading: "Left" wordmark (bold, 24px, links to `/`)
- Center: ghost pill links — "Features" (smooth-scroll to `#features`), "Blog" (`/blog/`)
- Trailing: "Download" button (filled orange pill → App Store link)

**Layout — mobile:**
- Leading: "Left" wordmark
- Trailing: "Download" button only (no center links)

**Style:**
- Glass background: `rgba(255,255,255,0.72)` light / `rgba(12,12,14,0.82)` dark
- `backdrop-filter: blur(20px)`
- Hairline border-bottom: `1px solid var(--hairline)`
- Height: 56px

---

### 4.2 Hero

**Reference:** `header and peek of image.png`

**Concept:** Large, confident, text-first. The hero image is partially visible at the bottom of the viewport to communicate scrollability.

**Structure:**
- Small pill badge at top: "Free on iPhone" — outlined chip, 13px
- H1 (two lines, large): final copy TBD by Cristian. Suggested directions:
  - "Every moment counts." 
  - "Time left to make it count."
  - "Track the time that matters."
- Subtitle (18–20px, `--text-secondary`): 1–2 sentences about habits, countdowns, time left, widgets
- CTA: App Store badge (existing image asset)
- Secondary text link: "Try on Web →" in `--accent` color, 15px

**Image:**
- Filename: `images/hero.webp` (Cristian provides this)
- A single iPhone showing the app — positioned so the top ~65% is in the viewport; the bottom bleeds below the fold
- Entrance: fade-up + scale 1.02 → 1.0, 600ms ease-out
- Subtle radial gradient glow behind image: orange at ~8% opacity

**Layout:**
- Desktop: two-column (text left, image right), text vertically centered
- Mobile: single column (text → image, image full-width, bottom clipped)

**Background:** `--bg` (white / near-black). No orange background on hero — orange is only the glow accent.

---

### 4.3 Three Core Features — Action Cards

**Reference:** `actions mockup.png`

**Concept:** Three tightly spaced cards showing the three main things the app does. Feels like a product UI row, not marketing cards.

**Cards:**

| # | Feature | Chip label | Headline | Description |
|---|---------|-----------|---------|-------------|
| 1 | Left Time | TIME LEFT | Make time visible | See how much is left in your year, month, week, day, and life |
| 2 | Ahead | COUNTDOWN | Count down to anything | Set ahead dates for events, trips, and milestones that matter |
| 3 | Since / Habits | HABITS & STREAKS | Build what lasts | Track habits and streaks with widgets on your Home Screen |

**Each card:**
- Image/mockup at top: `images/action-timeleft.webp`, `images/action-ahead.webp`, `images/action-since.webp`
- Feature chip: uppercase, 12px, `--accent` color, slight orange tint background
- Headline: 18–20px, semibold
- Description: 14px, `--text-secondary`
- Card style: `--bg-surface`, `var(--shadow-sm)`, 20px radius

**Layout:** Three-column row on desktop. Single column on mobile. Staggered entrance (150ms per card).

---

### 4.4 Main Features Grid

**Reference:** `features presentation.png`

**Concept:** Four large alternating rows, one per primary feature. Each row has a large app screenshot on one side and feature copy on the other.

**Feature blocks (in order):**

**1. Left Time**
- Image: `images/feature-timeleft.webp`
- Chip: TIME LEFT
- Headline: "How much time do you actually have?"
- Body: Left Time shows the time remaining in your life, year, month, week, day, and hour. Every view is a widget. Every widget is a reminder that the time is real.
- Sub-list: Life in weeks · Year progress · Daily countdown · Hour view

**2. Ahead**
- Image: `images/feature-ahead.webp`
- Chip: AHEAD
- Headline: "Count down to what matters."
- Body: Add any date — a trip, a birthday, a deadline, a wedding. Ahead turns it into a beautiful countdown widget on your Home Screen. Invite friends to count down together.
- Sub-list: Custom dates · Joint countdowns · Live Activities · Calendar import

**3. Since — Habits & Streaks**
- Image: `images/feature-since.webp`
- Chip: HABITS & STREAKS
- Headline: "Build habits. Track streaks. Stay consistent."
- Body: Since tracks how long you've kept something going — and how consistently you're doing it. Daily habits, weekly goals, or any custom schedule. Your progress lives on your Home Screen.
- Sub-list: Habit tracker · Streak counter · Custom schedules · Shared streaks

**4. Planner**
- Image: `images/feature-planner.webp`
- Chip: PLANNER
- Headline: "Your entire day, in one place."
- Body: The Planner combines your habits, countdowns, calendar events, reminders, health summaries, and weather into a single scrollable timeline. One view for what's ahead.
- Sub-list: Calendar & Reminders · HealthKit · WeatherKit · Planner widget

**Layout:** Alternating left/right on desktop (odd rows: image left, text right; even rows: text left, image right). Stacked on mobile (text above, image below). 80–120px vertical gap between rows.

---

### 4.5 Bento Grid — Secondary Features

**Reference:** `features bento.png`

**Concept:** 7–8 cells in a mixed-size bento grid. Each cell is interactive: tapping flips it to reveal a short description, then auto-resets after ~3 seconds.

**Cells:**

| Cell | Title | Front visual | Back description |
|------|-------|-------------|-----------------|
| A (2×1 wide) | "3,000+ widget combinations" | A small grid of widget thumbnails | Home Screen, Lock Screen, StandBy, iPad. Dots, rings, bars, text, analog, and more. Over 3,000 combinations. |
| B (1×1) | "Auto-updating wallpaper" | Phone icon with lock screen | Left Wallpaper generates a lock screen image showing your time data — and updates itself automatically via Shortcuts. |
| C (1×1) | "Live Activities" | Dynamic Island illustration | See your final countdown or habit progress in the Dynamic Island or on the Lock Screen in real time. |
| D (1×1) | "Count down together" | Two profile circles | Invite a friend to a Joint Ahead date. You both count down to the same event from your own Home Screens. |
| E (1×2 tall) | "Share your streaks" | Streak widget with watcher icon | Share a habit or streak with a friend. They can watch your progress — or you can watch theirs. |
| F (1×1) | "Time Between" | Two date markers + arrow | Calculate the exact duration between any two dates or times. Great for anniversaries, gaps, or planning. |
| G (1×1) | "Your life, in numbers" | Profile silhouette | The You view shows your age, life percentage, total habits, countdowns, and personal stats in one place. |

**Style per cell:**
- Background: `--bg-surface`, 20px radius, `var(--shadow-sm)`
- Front: centered icon/graphic (SVG or inline illustration, or use `images/bento-*.webp` placeholders) + title at bottom, 14px semibold
- Back: slightly tinted background (`--bg-muted`), description text 14px, closes after 3s
- Flip: CSS `transform: rotateY(180deg)` with `backface-visibility: hidden`, 300ms ease

**Grid:** CSS Grid, desktop: 4 columns, mixed `grid-column` and `grid-row` spans. Mobile: 2 columns, all cells equal height.

---

### 4.6 Scroll-Highlighted Text

**Reference:** `text while scrolling.png`

**Concept:** A large philosophical statement about the app, where individual words or phrases animate from low opacity to full opacity as they scroll into view. Creates a meditative, slow-reading rhythm.

**Copy (draft — Cristian to finalize):**

> "You have this year. This month. These next few weeks. Most people don't track the time they have — only the time they've lost. Left is built on a different idea: what you track, you keep."

**Implementation:**
- Each word wrapped in a `<span class="scroll-word">` element
- JS maps document scroll position to each span's offset, sets opacity from 0.12 to 1.0
- Alternatively: Intersection Observer with a narrow rootMargin to create a "spotlight" effect
- Container uses `position: sticky` inside a tall scroll track, or standard scroll with viewport math
- Font: 36–52px desktop, 26–34px mobile, weight 600, line-height 1.3, tight letter-spacing
- Light mode: `--text` fading in from `--text-secondary` opacity. Dark mode: `--text` fading in from very low opacity.

---

### 4.7 Template Carousel

**Reference:** `carousel gallery of templates.png`

**Data source:** `TemplateLibrary.json` (already in the repo root). Structure per entry:
```json
{
  "kind": "habit" | "streak" | "ahead",
  "category": "string",
  "color": "string (color name, map to hex)",
  "title": "string",
  "description": "string",
  "photo": "https://unsplash.com/photos/..."
}
```

**How to render each card:**
- Fetch `TemplateLibrary.json` with JS, shuffle or select a representative subset (~20–30 items)
- Extract the Unsplash photo ID from the URL and use the Unsplash source API:
  `https://source.unsplash.com/[photo-id]/400x500`
- Each card: background image (Unsplash photo), dark gradient overlay from bottom, color accent from `color` field (map color name → hex), kind-specific symbol/icon (hourglass for ahead, flame for habit/streak), title text at bottom

**Color name → hex map:**
```
orange  → #FF6B24
blue    → #3B82F6
green   → #22C55E
purple  → #A855F7
red     → #EF4444
pink    → #EC4899
yellow  → #EAB308
teal    → #14B8A6
brown   → #92400E
```

**Kind → symbol:**
```
ahead  → hourglass icon or ⏳
habit  → checkmark ring or ✓
streak → flame icon or 🔥
```

**Card dimensions:** ~160×200px, 16px radius. Show 8–12 cards visible at once on desktop.

**Carousel behavior:**
- Infinite horizontal scroll, slow auto-play (~30px/s), pauses on hover/focus
- On mobile: native touch scroll (overflow-x: auto, snap scrolling)
- No arrows — overflow implies scrollability. Cards slightly scale on hover (1.03×)
- Duplicate cards in the DOM for seamless looping (clone-based infinite scroll)

---

### 4.8 Reviews / Social Proof

**Reference:** `reviews mixed.png`

**Data source:** `reviews.json` (create this file in the repo root). Structure:
```json
[
  {
    "type": "app-store" | "twitter" | "youtube" | "reddit",
    "author": "DisplayName or @handle",
    "title": "Short review title (App Store only)",
    "text": "Full review text",
    "rating": 5,
    "link": "https://..."
  }
]
```
- `rating` is only required for `app-store` type; omit for others
- `title` is only used for `app-store` type
- `link` is optional but should be included when available
- File is designed to be expanded — just append new objects to the array
- JS reads this JSON, shuffles it, and renders the cards

**Card rendering per type:**
- `app-store`: show ★★★★★ stars (using `rating` field), title in semibold, text below, App Store icon badge
- `twitter`: show X/Twitter bird icon, `@author` in muted text, text
- `youtube`: show YouTube icon, author name, text
- `reddit`: show Reddit icon, u/author, text

**Layout:**
- Desktop: 3 columns. Left and right columns auto-scroll vertically in opposite directions (CSS `@keyframes` translateY, ~60s duration, linear). Center column is static.
- Mobile: 2 columns, both slowly scroll upward (same CSS animation, different speed)
- Cards: `--bg-surface`, 16px radius, `var(--shadow-sm)`, hairline border

**Placeholder content:** Developer writes 12–15 placeholder review objects in `reviews.json` based on the app's actual features. Cristian will replace with real content.

---

### 4.9 "Making the Most of It" — Photo Mosaic

**Reference:** `people making the most of it.png`

**Concept:** Full-width or contained section with a mosaic of candid lifestyle photos. Humanizes the app.

**Section heading:** "Made for people who make the most of it." (or Cristian's preferred copy)

**Images:** 6–8 photos in a CSS Grid mosaic with varied aspect ratios.

**Image filenames (developer uses these, Cristian drops files later):**
```
images/people-01.webp   images/people-02.webp   images/people-03.webp
images/people-04.webp   images/people-05.webp   images/people-06.webp
```
For development/placeholder: use `https://source.unsplash.com/random/400x500/?lifestyle,candid` for each.

**Style:**
- Grid with mixed heights: 2 tall, 2 square, 2 wide (reference `people making the most of it.png` layout)
- Slight border-radius on each photo: 12px
- Gentle edge vignette on the section to fade images into the background
- Light section heading above, no caption needed per photo

---

### 4.10 FAQ

**Concept:** 8 questions and answers in a two-column accordion grid on desktop, single-column on mobile.

**The developer should write all 8 FAQ questions and answers based on the actual app.** Sources of truth: the homepage content, the BLUEPRINT.md, and the app itself. The questions should address what real users ask — pricing, features, widgets, sync, habits vs streaks, the wallpaper, the planner.

**Areas to cover (developer writes the actual copy):**
1. Is Left free / pricing and what Left+ includes
2. Habits vs streaks — what's the difference
3. Sharing countdowns and habits with friends
4. How to add a widget to the Home Screen
5. Left Wallpaper feature
6. The Planner and what it integrates
7. How many widget styles / combinations
8. iCloud sync across devices

**Interaction:** Custom JS accordion (or native `<details>` element). Clicking a question expands the answer; clicking again or clicking another question collapses it.

**Layout:** CSS Grid, 2 columns on desktop (4 rows each). Single column on mobile.

**Structured data:** Update the `FAQPage` JSON-LD in the `<head>` to match the final FAQ content.

---

### 4.11 Download CTA

**Reference:** `download at end.png`

**Concept:** Full-width section with a single purpose — download the app.

**Content:**
- Headline: "Start tracking what matters." (or Cristian's preferred copy)
- Subline: "Free download. One-time purchase to unlock everything. No subscription."
- App Store badge (existing image asset, black version)
- QR code (small, desktop only, below the badge) — links to `/download/`

**Style:**
- Background: always orange gradient (`linear-gradient(135deg, #FF6B24, #E69525)`) — even in dark mode
- Text: white
- Subtle geometric decoration: a faint tiled pattern of small Left-style widget shapes at low opacity, or just a radial glow

---

### 4.12 Footer

**Reference:** `counter in real time.png`, `footer with location.png`

**Counter:**
- Large number (48–64px, weight 800) + label "people making every moment count" below it
- Implemented with a time-based formula — no backend required:
  ```js
  const BASE_COUNT = 100000;
  const BASE_DATE = new Date('2025-01-01').getTime();
  const RATE = 1 / (7 * 60 * 1000); // ~1 new user per 7 minutes
  const count = BASE_COUNT + Math.floor((Date.now() - BASE_DATE) * RATE);
  ```
  Tune `BASE_COUNT` and `RATE` to display a believable current number. Cristian provides the starting number.
- Counter animates in (count-up effect) when it first scrolls into view

**Footer layout:**
```
┌──────────────────────────────────────────────────────────┐
│  [counter number]                                        │
│  people making every moment count                        │
├──────────────────────────────────────────────────────────┤
│  Left                         Privacy                    │
│  Made in Wellington, NZ       Terms                      │
│  © 2026 Cristian Rus          Contact                    │
│                               Blog                       │
│  [Wellington location pin]    Try on Web                 │
└──────────────────────────────────────────────────────────┘
```

**Wellington location element:** A small inline SVG or icon (📍 or custom SVG pin) next to "Made in Wellington, NZ". On hover: a tooltip or small popover with "Wellington, New Zealand — where Left was built."

**Footer links:** Privacy · Terms · Contact · Blog · Try on Web

---

## 5. Blog

### 5.1 Article rewrites

All four existing articles should be fully rewritten by the developer based on actual Left app content. They currently have thin, generic copy. The rewrite should reference real features, real widget names, real UI flows — using the homepage and BLUEPRINT.md as source material.

| File | Current title | Rewrite focus |
|------|--------------|---------------|
| `best-countdown-widgets-iphone.html` | Best Countdown Widgets | Focus on Left's Ahead feature — custom dates, joint countdowns, Live Activities, widget styles |
| `best-habit-tracker-apps-iphone.html` | Best Habit Tracker Apps | Focus on Left's Since feature — habits vs streaks, widget layouts, daily/weekly schedules, sharing |
| `how-to-add-widgets-iphone.html` | How to Add Widgets | Step-by-step guide using Left as the example — all widget surfaces (Home Screen, Lock Screen, StandBy) |
| `habitkit-vs-left.html` | HabitKit vs Left | Fair, factual comparison — be honest about what each does; Left's differentiators are time awareness, countdown integration, and the widget ecosystem |

### 5.2 New articles to add

The developer should add these articles, each grounded in actual app features:

1. **What is Year Progress and Why You Should Track It** — Left Time feature, year/month/week views, why temporal awareness matters
2. **How to Build a Streak on Your iPhone** — Since feature, streaks vs habits, widget setup
3. **The Left Wallpaper: A Lock Screen That Updates Itself** — Wallpaper feature, Shortcuts integration, how to set it up
4. **Counting Down to Your Next Trip (and Sharing It With Friends)** — Ahead + Joint Ahead feature walkthrough
5. **Left Planner: Your Entire Day in One View** — Planner feature, what it aggregates, how to use it

Each article:
- Uses the same nav + footer as the homepage (new design system)
- Has a clear `<title>` and `<meta description>` written for SEO
- References actual Left feature names (Ahead, Since, Left Time, Planner) accurately
- Includes at least one image placeholder named semantically (e.g. `images/article-streak-widget.webp`)

### 5.3 Blog listing page

`/blog/index.html` — a grid of article cards, each with:
- Article image placeholder (e.g. `images/blog-[slug].webp`)
- Title
- Short excerpt (1–2 sentences)
- Read time estimate
- Link to article

Desktop: 3-column grid. Mobile: 1 column.

---

## 6. Invite Page — Specific Overrides

The invite page uses the same shared `style.css`. The following invite-specific elements need custom styles added to the bottom of `style.css` under `/* ─── Invite page overrides ─── */`:

- **Avatar display**: circular profile photo (60–80px diameter, `border-radius: 50%`, ring in `--accent` color), stacked when multiple participants
- **QR code container**: centered card with `--bg-surface` background, `var(--shadow-sm)`, 20px radius, QR image inside with padding
- **Invite card**: the main invite content block — glass surface, slightly larger radius (24px), centered layout
- **Accept/decline button states**: accept button uses orange gradient fill; decline is ghost/muted
- **"You've been invited by" header**: special treatment — avatar + username + "invited you to Left" formatted as a centered announcement
- **Invite badge**: small pill showing what kind of invite it is (friend request, joint ahead, shared since)

Everything else — nav, footer, background color, font, dark mode, button base styles — comes from the shared system unchanged.

---

## 7. Image Naming Convention

The developer uses these filenames in `<img src="...">` tags. Cristian drops the real `.webp` files into `/images/` when ready. For development, use Unsplash `source.unsplash.com` URLs as `src` values with a `data-final-src` attribute, or use a solid color placeholder `<div>` with the correct aspect ratio.

```
images/hero.webp                      — hero section, iPhone mockup
images/action-timeleft.webp           — 3 core features, card 1
images/action-ahead.webp              — 3 core features, card 2
images/action-since.webp              — 3 core features, card 3
images/feature-timeleft.webp          — main features row 1
images/feature-ahead.webp             — main features row 2
images/feature-since.webp             — main features row 3
images/feature-planner.webp           — main features row 4
images/bento-widgets.webp             — bento cell: widget gallery
images/bento-wallpaper.webp           — bento cell: wallpaper
images/bento-liveactivity.webp        — bento cell: live activity
images/bento-friends.webp             — bento cell: share with friends
images/bento-jointahead.webp          — bento cell: joint countdown
images/people-01.webp                 — photo mosaic (through people-06)
images/blog-countdown-widgets.webp    — blog article cover
images/blog-habit-tracker.webp        — blog article cover
images/blog-add-widgets.webp          — blog article cover
images/blog-habitkit-vs-left.webp     — blog article cover
images/blog-year-progress.webp        — blog article cover
images/blog-streaks.webp              — blog article cover
images/blog-wallpaper.webp            — blog article cover
images/blog-ahead-trip.webp           — blog article cover
images/blog-planner.webp              — blog article cover
```

---

## 8. Technical Notes for the Developer

### CSS architecture
- Single `style.css` shared across all pages (index, privacy, terms, contact, blog, invite)
- `web.html` is CSS-independent (no external CSS link)
- CSS custom properties at `:root` for the full token set
- `@media (prefers-color-scheme: dark)` for all dark mode overrides
- Invite-specific styles at the very bottom of `style.css`, clearly commented
- No CSS framework — pure CSS only
- `style.css` section structure:
  1. Tokens / variables
  2. Reset + base
  3. Typography
  4. Layout utilities (.container, etc.)
  5. Nav
  6. Buttons
  7. Cards + glass
  8. Homepage sections (in order)
  9. Footer
  10. Blog page styles
  11. Legal/contact page styles
  12. `/* ─── Invite page overrides ─── */`

### JavaScript
- Vanilla JS only, no framework, no jQuery
- All JS deferred (`defer` attribute on `<script>` tags)
- Intersection Observer: scroll entrance animations + scroll-text effect
- Bento flip: custom class toggle + 3s auto-reset via `setTimeout`
- Carousel: clone-based infinite scroll + requestAnimationFrame auto-play
- Reviews columns: CSS `@keyframes` animation (no JS required)
- Counter: `requestAnimationFrame` count-up on first viewport entry
- Nav: single scroll listener

### Redirect pages
Minimal HTML only — no JS framework, no CSS, just the meta-refresh and script fallback.

### Responsive breakpoints
```
Mobile:  < 600px
Tablet:  600px – 1024px
Desktop: > 1024px
```

### Performance
- Hero image: WebP, target ≤ 200kb
- All other images: `loading="lazy" decoding="async"`
- Hero image: `fetchpriority="high" decoding="async"`
- No render-blocking CSS or JS
- TemplateLibrary.json and reviews.json: fetched async after page load
- Target LCP < 2.5s on mobile 4G

### Accessibility
- Keyboard navigable interactive elements (bento cells, carousel, FAQ accordion)
- ARIA roles on carousel and bento grid
- `<details>`/`<summary>` for FAQ (with optional JS enhancement)
- Minimum 4.5:1 color contrast in both modes
- Visible focus ring on keyboard navigation

### SEO
- Keep existing Schema.org `FAQPage` and `MobileApplication` JSON-LD in index.html
- Update FAQ answers to match final content
- Each blog article: unique `<title>`, `<meta name="description">`, `<link rel="canonical">`
- Redirect pages: `<meta name="robots" content="noindex">` on all four

### Scroll behavior
```css
html { scroll-behavior: smooth; }
```

---

## 9. Open Items — Cristian to Provide

1. **Counter base number**: What number should the counter display today? (app has "100k+ users" on current site — use that as the floor)
2. **Counter growth rate**: Approximately how many new users per day? This tunes the formula.
3. **Hero copy**: Final headline and subtitle — the most important text on the site.
4. **Scroll-text copy**: The philosophical statement for Section 4.6.
5. **Review content**: Fill `reviews.json` with real content when ready. Developer ships it with placeholder data.
6. **Privacy and Terms content**: Existing copy or needs drafting?
7. **Contact email**: The email address to use on contact.html.
8. **Hero image and feature images**: Drop real `.webp` files into `/images/` using the naming convention in Section 7.

---

## 10. Build Order (suggested)

1. Rename `index.html` → `oldindex.html`, `style.css` → `oldstyle.css`
2. Make `web.html` CSS-independent (inline the base styles it needs, remove the `<link>` to style.css)
3. Create four redirect pages: `/download/`, `/ios/`, `/web/`, `/android/`
4. Build new `style.css`: tokens, reset, typography, nav, buttons, cards, footer
5. Build `index.html` — nav + hero first (validate design direction)
6. Build sections 4.3 and 4.4 (feature cards + feature grid)
7. Build section 4.5 (bento grid with flip behavior)
8. Build section 4.6 (scroll-text)
9. Build section 4.7 (template carousel — wire to TemplateLibrary.json)
10. Create `reviews.json` with placeholder data; build section 4.8 (reviews columns)
11. Build section 4.9 (photo mosaic with placeholder images)
12. Build section 4.10 (FAQ accordion)
13. Build section 4.11 (download CTA)
14. Build section 4.12 (footer + counter)
15. Add invite overrides to `style.css`; update `/invite/index.html` to reference `/style.css`
16. Build `privacy.html`, `terms.html`, `contact.html` with shared nav + footer
17. Update `/blog/index.html` with new nav + footer; rewrite existing articles; add new articles
18. QA pass: mobile responsiveness, dark mode, all redirect links, web.html isolation, performance, accessibility
19. Delete `oldindex.html` and `oldstyle.css` when confident nothing references them

---

*Last updated: May 2026*
