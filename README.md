# MAVQESTRA PROPERTIES

Cinematic, frontend-only real estate marketing website built with **Next.js 16 (App Router, Turbopack)**, **TypeScript**, **Tailwind CSS v4**, **GSAP (`ScrollTrigger` + `@gsap/react`)**, and **lucide-react**.

No backend, database, or authentication is required — all listings, reviews, and company details live in static TypeScript files, and enquiries open directly in WhatsApp.

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

For production verification:

```bash
npm run lint
npm run build
npm run start
```

---

## Where to Edit Content

The client only needs to edit these files:

| What to edit | File |
|---|---|
| Company name, tagline, **WhatsApp number**, phone, email, address, socials, Google rating/review URL, `propertiesPerPage`, hero copy, stats, about copy | [`src/config/site.ts`](src/config/site.ts) |
| **Property listings** (`properties` array — 12 seeded placeholders, mark up to 6 with `featured: true`) | [`src/data/properties.ts`](src/data/properties.ts) |
| Property photos (referenced by `/images/properties/...` in `properties.ts`) | `public/images/properties/` |
| **Google reviews** (`reviews` array — 6 seeded placeholders) | [`src/data/reviews.ts`](src/data/reviews.ts) |
| **Services & 4-step process** | [`src/data/services.ts`](src/data/services.ts) |

### Updating the WhatsApp Number

In [`src/config/site.ts`](src/config/site.ts), set `whatsappNumber` to your international number using **digits only** (no `+`, spaces, or dashes), for example:

```ts
whatsappNumber: "2348031234567",
```

---

## Hero Video Setup (All-Intra Keyframe Encoding)

The landing page hero scrubs a silent MP4 video bidirectionally with scroll. For instant backward scrubbing, **every frame must be a keyframe (`I`-frame)**.

1. Place your raw source video at `reference/hero-raw.mp4` (or pass any file path to the script).
2. Run the encoding & verification script (requires `ffmpeg` and `ffprobe`):

```bash
bash scripts/encode-hero.sh reference/hero-raw.mp4
```

This generates and verifies:
- `public/videos/hero-construction.mp4` (desktop, 1600px wide, ≤ 12 MB)
- `public/videos/hero-construction-mobile.mp4` (mobile `< 768px`, 720px wide, ≤ 5 MB)
- `public/images/hero-poster.jpg` (first frame)
- `public/images/hero-poster-end.jpg` (last frame, used for `prefers-reduced-motion` fallback)

See [`docs/VIDEO.md`](docs/VIDEO.md) for full FFmpeg & `ffprobe` details.
