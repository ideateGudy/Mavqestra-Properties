# PRD — MAVQESTRA PROPERTIES (frontend-only Next.js)

> Read `DESIGN.md` first. Build **one task at a time, in order**. After each task: run the checks, tick the box, summarise in 3 lines, then STOP and wait for "next".

## 1. Overview
A cinematic marketing site for **MAVQESTRA PROPERTIES**, a real estate company. Visitors are wowed by a scroll-driven construction hero, browse a few featured properties, search the full catalogue on a separate page, chat on WhatsApp for a consultation, and request a valuation if they want to sell. No backend: everything is static data + WhatsApp deep links.

**Animation rule:** all page animation uses **GSAP** (ScrollTrigger + `useGSAP`): section reveals, staggers, count-ups, marquee, nav, menu, page transitions and the hero. No other animation library.

## 2. Pages
| Route | Purpose |
|---|---|
| `/` | Landing: hero, trust, featured properties, services, process, reviews, valuation CTA, footer |
| `/properties` | Full catalogue: search, filters, sort, pagination |
| `/properties/[slug]` | Property detail (gallery, specs, WhatsApp enquiry) |
| `/valuation` | "Sell with MAVQESTRA" valuation request form |

## 3. Editable data (the client edits only these files)
- `src/config/site.ts`: company name, tagline, WhatsApp number (international format, digits only, e.g. `234XXXXXXXXXX`), email, address, socials, Google review URL, rating + count.
- `src/data/properties.ts`: exported array `properties: Property[]`.
- `src/data/reviews.ts`: exported array of reviews.
- `src/data/services.ts`: services list.

```ts
// src/types/index.ts
export type PropertyStatus = "for-sale" | "for-rent" | "sold" | "off-plan";
export type PropertyType = "apartment" | "duplex" | "detached" | "terrace" | "land" | "commercial";
export interface Property {
  id: string;
  slug: string;
  title: string;
  status: PropertyStatus;
  type: PropertyType;
  price: number;            // NGN
  priceLabel?: string;      // e.g. "per annum"
  location: { area: string; city: string; state: string };
  bedrooms?: number; bathrooms?: number; toilets?: number;
  sizeSqm?: number;
  images: string[];         // paths in /public/images/properties/
  description: string;
  features: string[];
  featured?: boolean;       // shown on landing page
  addedAt: string;          // ISO date
}
```
Seed with **12 clearly placeholder** properties (mixed types, areas, statuses, 4 marked `featured`). Use neutral gradient/placeholder images in `/public/images/properties/` until real photos are supplied.

## 4. Tasks

### Phase 0 — Foundation
- [x] **T0 Setup** *(skills: ai-design-skills, impeccable, Nigeria_vibe_compliance)*
  Create the Next.js app **in the current empty folder** with `npx create-next-app@latest .` (must be **Next.js 16**; TypeScript, Tailwind, App Router, `src/` dir, ESLint, Turbopack default). Install `gsap @gsap/react lucide-react` at `@latest`. Run `npm ls --depth=0` and report the installed versions before continuing; follow DESIGN.md §3 "Versions" for every later install. Verify/install the skills listed in `DESIGN.md §2`. Create folder structure, tokens in `globals.css`, fonts in `layout.tsx`, `site.ts`, `types`, `lib/format.ts` (₦ formatter), `lib/whatsapp.ts` (builds `https://wa.me/<number>?text=<encoded>` links). Move reference videos into `/reference/`.
  *Done when:* `next dev` shows a blank page with correct fonts/colours; `next build` passes.

- [x] **T1 Logo** *(skills: taste-skill, impeccable)*
  Design the **MAVQESTRA PROPERTIES** logo as inline SVG (no raster). Concept: a geometric **M** whose centre V forms a roofline/gable with a small ember dot (the lit window); wordmark "MAVQESTRA" in wide-tracked caps with "PROPERTIES" smaller beneath. Deliver: `public/logo.svg` (full lockup, dark-on-light), `public/logo-light.svg` (for dark backgrounds), `public/icon.svg` (mark only, used as favicon via `app/icon.svg`), and `components/Logo.tsx` with `variant="full|mark"` and `tone="dark|light"` props using `currentColor`. Must stay legible at 24px height.
  *Done when:* a temporary `/brand` route shows all variants on both backgrounds (delete route after approval).

### Phase 1 — Shell
- [x] **T2 Layout shell** *(skills: ui-ux-pro, transitions.dev, taste-skill)*
  Floating pill nav (Logo, Home, Properties, Sell/Valuation, "Book consultation" ember WhatsApp button). Transparent-glass over hero → solid after scroll. Mobile: full-screen menu with staggered reveal. Footer: logo, nav, contact, socials, ₦/NDPA-appropriate privacy line, © year. Floating WhatsApp button (bottom-right, appears after scroll, pre-filled message).
  *Done when:* works on all routes (create empty page stubs for `/properties` and `/valuation`), keyboard accessible.

### Phase 2 — Landing page, one section per task
- [x] **T3 Hero video: encode + wiring** *(skills: gsap-skills)*
  Hero video goes in **`public/videos/hero-construction.mp4`** (+ `hero-construction-mobile.mp4`), posters at **`public/images/hero-poster.jpg`** (first frame) and `hero-poster-end.jpg` (last frame). Until the file exists, render the poster/gradient fallback. Write `docs/VIDEO.md` and a script `scripts/encode-hero.sh` (accepts the raw file path) that does the encode below, then verifies it.
  **Encoding: force every single frame to be a keyframe** (all-intra), silent, faststart:
  ```
  ffmpeg -i RAW.mp4 -an -vf "fps=30,scale=1600:-2" -c:v libx264 -preset slow -crf 24 \
    -g 1 -keyint_min 1 -sc_threshold 0 -bf 0 -x264-params keyint=1:min-keyint=1:scenecut=0 \
    -pix_fmt yuv420p -movflags +faststart public/videos/hero-construction.mp4
  ```
  Mobile: same command with `scale=720:-2 -crf 28` → `hero-construction-mobile.mp4`.
  **Verify** (must print only `I`): `ffprobe -v error -select_streams v:0 -show_entries frame=pict_type -of csv=p=0 public/videos/hero-construction.mp4 | sort | uniq -c`. If any `P` or `B` appears, re-encode. Report file sizes; if over budget (DESIGN.md §3) raise CRF a little or reduce width, never drop the all-keyframe rule.
  Also create `lib/gsap.ts` (registers `ScrollTrigger` + `useGSAP`) used by every animated component.
- [x] **T4 Hero (signature moment): bidirectional scroll-scrubbed video** *(skills: gsap-skills, taste-skill, playwright-cli)*
  Full-viewport hero pinned with GSAP ScrollTrigger (`pin: true`, `scrub`, `end: "+=250%"` desktop / tuned for mobile). The video is a muted, `playsInline`, `preload="auto"`, no-controls `<video>` that is **never autoplayed**; its `currentTime` is driven by scroll progress so **scrolling down plays the building being constructed forward, and scrolling up plays it in reverse**, with mouse wheel, trackpad, touch swipe/drag, and keyboard (space/arrows/PageUp/PageDown) all working. Reference behaviour: the user's sample recording (a site where the hero video follows the scroll in both directions).
  Implementation notes (follow, and test):
  - Wait for `loadedmetadata` (and enough buffered data) before creating the ScrollTrigger; pause the video, set `currentTime = 0`.
  - Use a proxy object: `ScrollTrigger` `scrub: 0.4` tweens `{ t: 0 → video.duration }`; in `onUpdate`/ticker, set `video.currentTime` only when it changed by ≥ 1/30s, inside `requestAnimationFrame`, to avoid seek flooding. Clamp to `[0, duration - 0.05]`.
  - Because every frame is a keyframe (T3), backward seeking must be instant; if it still stutters on mobile, report it and implement the fallback: extract frames with ffmpeg to `public/hero-frames/` (WebP, ~120-180 frames) and draw them on a `<canvas>` driven by the same scroll progress.
  - Touch: `touch-action` must allow vertical scrolling; consider `ScrollTrigger.normalizeScroll(true)` on touch devices if address-bar resize causes jumps; use `100svh`; `ScrollTrigger.config({ ignoreMobileResize: true })`.
  - Pick `hero-construction-mobile.mp4` below 768px via `gsap.matchMedia()`.
  - Text overlay (no text in the video): headline "Exceptional homes. Built with trust." *(editable in `site.ts`)*, sub line, two CTAs. GSAP timeline tied to the same scroll progress: headline eases up/fades as the build progresses, a CTA bar appears near the end, thin ember progress line at the bottom, "Scroll" cue fades after first scroll. Page-load intro: nav + headline stagger in with GSAP.
  - Smooth unpin into the next section; no CLS; `ScrollTrigger.refresh()` after fonts load.
  - `prefers-reduced-motion` or video error → no pin, static end-frame poster, simple GSAP fade-in of text.
  *Done when:* playwright at 390/1440 shows frames at 0%, 50%, 100% scroll AND scrolling back up returns to the first frame; no console errors; verified that the hero file in `public/videos/` is 100% `I` frames.
- [x] **T5 Trust strip + About** *(skills: impeccable, taste-skill)*
  Slim stats bar (years, properties sold, cities, clients — editable) with count-up on enter. Then an editorial two-column "About MAVQESTRA" with one large image and short copy.
- [x] **T6 Featured properties** *(skills: ui-ux-pro, taste-skill)*
  Shows properties where `featured: true` (max 6) as large cards (image, status badge, ₦ price, area, beds/baths/size, "Enquire" WhatsApp icon-button, card → detail). Desktop: horizontal scroll-snap rail or asymmetric grid; mobile: swipeable. "View all properties →" to `/properties`.
- [x] **T7 Services + Process** *(skills: impeccable, gsap-skills)*
  Services (Buy, Sell, Rent, Valuation, Property advisory) as an elegant list/grid with hover reveals. Then a 4-step "How it works" (Consult → Shortlist → Inspect → Close) with scroll-linked line drawing.
- [x] **T8 Valuation CTA band** *(skills: taste-skill, Nigeria_vibe_compliance)*
  Dark full-bleed band: "Thinking of selling? Find out what your property is worth." → `/valuation`.
- [x] **T9 Google reviews, redesigned** *(skills: taste-skill, gsap-skills or transitions.dev)*
  Replace the generic "Excellent on Google 4.8 (82)" box with something more premium: a split layout — left: large serif rating "4.8", five ember stars, "Based on N Google reviews", the Google "G" mark, and a pill button **"Review us on Google"** (href = `site.googleReviewUrl`, opens in new tab, `rel="noopener noreferrer"`). Right: a slow, pausable, two-row marquee (or stacked drifting cards on desktop, swipe carousel on mobile) of review cards (avatar initial, name, verified tick in `--dusk`, relative date, stars, clamped text with "Read more" expanding in place). Pause on hover/focus; static on reduced motion.
  **Data honesty:** `reviews.ts` ships with 6 obviously placeholder entries flagged `// TODO(client): replace with real Google reviews`. Never copy reviews from other companies. Rating/count come from `site.ts`.
- [x] **T10 Final CTA + footer polish** — big headline, WhatsApp consultation button, contact details.

### Phase 3 — Properties catalogue
- [x] **T11 Properties page: data + listing** *(skills: ui-ux-pro, taste-skill)*
  `/properties` reads `properties` from the data file. Responsive grid of the same card component, result count, empty state.
- [x] **T12 Search, filters, sort** *(skills: ui-ux-pro, Nigeria_vibe_compliance)*
  Text search (title/area/city), filters: status, type, state/city (derived from data), price range (min/max ₦ inputs + presets), bedrooms (any/1+/2+/3+/4+/5+), sort (newest, price ↑, price ↓). Filter logic in `lib/filters.ts` (pure, typed). State synced to the URL query string (`useSearchParams`) so results are shareable. Mobile: filters in a bottom sheet; desktop: sticky sidebar or top bar. "Clear all" + active-filter chips.
- [x] **T13 Pagination** *(skills: ui-ux-pro)*
  9 per page (const in `site.ts`), numbered pagination with prev/next, `?page=` in URL, resets to page 1 on filter change, scrolls to results top, accessible `nav aria-label="Pagination"`.
- [x] **T14 Property detail page** *(skills: taste-skill, ui-ux-pro)*
  `generateStaticParams` from the array (in Next 16, `params` is a Promise: `await params`). Gallery (swipeable on mobile, lightbox on desktop), key specs, features list, description, sticky "Chat on WhatsApp" card with pre-filled message including property title + link. "Similar properties" row. 404 for unknown slug.

### Phase 4 — Valuation
- [x] **T15 Valuation page** *(skills: ui-ux-pro, Nigeria_vibe_compliance)*
  Hero (short), reassurance points (free, no obligation, response within 24h — editable copy), then a multi-step form (client-side only): 1) Property: type, state/city/area, bedrooms, size, condition; 2) Details: expected price (optional), reason/timeline for selling, notes; 3) Contact: name, phone (+234 validation), email (optional), consent checkbox (NDPA wording). Zod/inline validation, progress indicator, review step. On submit: build a structured message and open **WhatsApp** (`wa.me`) with it, plus show a success state with a "Copy details" fallback. No data is stored anywhere; say so in the consent text.
  *Done when:* works with keyboard only; invalid phone formats rejected; message encoding verified.

### Phase 5 — Finish
- [x] **T16 Page animations + transitions (GSAP)** *(skills: gsap-skills, transitions.dev)* — consistent GSAP reveal system (reusable `<Reveal>` / `useReveal` using ScrollTrigger.batch, one shared easing/duration set), route-transition choreography, button/hover micro-interactions, nav show/hide on scroll direction. Respect reduced motion; no leaks (all in `useGSAP` scope).
- [x] **T17 SEO + metadata** — per-page metadata, OG image, sitemap, robots, `RealEstateAgent` JSON-LD, favicons from `icon.svg`.
- [x] **T18 QA + performance** *(skills: playwright-cli, taste-skill, impeccable)* — screenshots of every page at 390/768/1440, fix overflow/contrast/tap-target issues, check LCP/CLS, image sizes, console clean, `next build` + lint pass. Write `README.md` explaining **how to edit properties, reviews, WhatsApp number, and where to put the hero video**.

## 5. Out of scope
Backend, database, admin panel, auth, payments, CMS, live Google API (reviews are a static array), map integrations.
