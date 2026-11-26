# DESIGN.md — MAVQESTRA PROPERTIES

Read this file before every task. It tells you (1) what the site should feel like, (2) which skill/MCP to load for the task at hand, (3) the rules you must not break.

---

## 1. Brand & mood

**Company:** MAVQESTRA PROPERTIES — real estate (sales, listings, valuation), Nigeria.
**Feeling:** quiet luxury, cinematic, architectural. A visitor should be "in awe" in the first 3 seconds, then feel calm and trusted.
**Reference:** two videos in `/reference/` (copy them there if not present):
- *Dolce Vita hero* — slow, dusk-lit, warm-light-against-deep-blue luxury architecture. Take: lighting mood, slow camera, generous negative space.
- *Scroll-driven site recording* — a full-bleed hero where a building goes from structural skeleton to finished home as the user scrolls, then transitions into an interior. Take: scroll-scrubbed hero, small floating pill nav, serif headlines, restrained UI chrome, image-led sections.

**Do NOT copy** any text, names ("Solenne", "Dolce Vita") or imagery from the references. Only the feel.

### Palette (define as CSS variables in `globals.css`, expose via Tailwind theme)
| Token | Hex | Use |
|---|---|---|
| `--basalt` | `#0E0D0C` | dark surfaces, hero overlay |
| `--graphite` | `#1A1816` | cards on dark |
| `--ivory` | `#F4EFE6` | light surfaces, text on dark |
| `--sand` | `#E3DACB` | borders, muted fills |
| `--ember` | `#E8913A` | primary accent (CTAs, highlights) — echoes the warm window light |
| `--dusk` | `#1F6F78` | secondary accent (links, badges, verified ticks) |
| `--stone` | `#8A8378` | secondary text |

Rules: ember is used sparingly (one primary CTA per viewport). No gradients except subtle scrims over video/images. WCAG AA contrast minimum.

### Typography
- Display: **Instrument Serif** or **Fraunces** (via `next/font/google`) — large, tight leading, sentence case.
- UI/body: **Geist** or **Inter** — 16px base.
- Fluid type scale with `clamp()`. Hero headline ≈ `clamp(2.75rem, 7vw, 6.5rem)`.
- No more than 2 font families. Max 3 weights.

### Layout & shape
- 12-col grid, max content width 1280px, generous vertical rhythm (section padding `clamp(5rem, 10vw, 9rem)`).
- Radius: 999px for pills/buttons, 20px for cards, 28px for media.
- Floating pill nav, centered, glass (`backdrop-blur`) over hero; becomes solid ivory/basalt after scroll.
- Images/video are the heroes; text is short.

### Motion budget (important — many users are on mid/low-end Android over mobile data)
- **GSAP is the only animation library** (`gsap`, `ScrollTrigger`, `@gsap/react`'s `useGSAP`). Do not add framer-motion/motion, AOS, or other animation libs. Use GSAP for the hero scrub AND all page animations: section reveals, staggered text/card entrances, count-ups, marquee, nav show/hide, menu open/close, page-load intro, hover micro-interactions, route-transition choreography. Register plugins once in `src/lib/gsap.ts`; use `useGSAP({ scope })` so every tween/ScrollTrigger is cleaned up on unmount; use `gsap.matchMedia()` for desktop/mobile/reduced-motion variants; call `ScrollTrigger.refresh()` after fonts/images load.
- Two signature scroll-scrubbed moments: the **scroll-scrubbed construction hero** AND the **scroll-scrubbed architectural showcase section** (both bidirectional: scrolling down plays the video forward, scrolling up plays it backward, for mouse wheel, trackpad, touch swipe and keyboard scroll). Everything else is subtle: fade/translate-up on enter (≤ 24px, 500–700ms, `power2.out`), image parallax ≤ 8%, button hover.
- Animate only `transform` and `opacity`.
- Honour `prefers-reduced-motion`: replace scrub with a static poster + simple fade.
- No autoplaying sound. No layout-shifting animation.

### Copy tone
Warm, confident, plain English. Short sentences. No hype words ("world-class", "unmatched"). Prices in ₦ with `Intl.NumberFormat('en-NG')`.

---

## 2. Skill / MCP routing — load the right one for the task

**First run only — install/verify.** Antigravity loads project skills from `.agent/skills/` (and global ones from the user skills directory). For each item below: check if it is already available; if not, install it (clone the repo into `.agent/skills/<name>/` or follow its README install steps). If a repo or skill cannot be found or installed, say so and continue with the fallback listed — never invent its contents.

| Skill / tool | Source | Load it when… | Fallback if unavailable |
|---|---|---|---|
| `frontend-design` / **impeccable** | search "impeccable" skill | starting any new section; final polish pass on each section | follow §1 of this file strictly |
| **taste-skill** | github.com/Leonxlnx/taste-skill | choosing layout, spacing, hierarchy; avoiding "AI-template" look; reviewing a finished section | self-review against §1 |
| **ui-ux-pro** (UI UX Pro skill) | search "ui ux pro" skill | designing components, forms (valuation), filters, empty/loading/error states, accessibility | WCAG 2.2 AA checklist |
| **ai-design-skills** | github.com/elayadesign/ai-design-skills | design-system tokens, component specs, design critique | §1 tokens |
| **gsap-skills** | github.com/greensock/gsap-skills | ANY animation using GSAP/ScrollTrigger — the hero scrub, pinned sections, reveal choreography | GSAP docs |
| **transitions.dev** | github.com/Jakubantalik/transitions.dev | page-to-page transitions, section reveals, micro-interactions | CSS transitions + View Transitions API |
| **ponytail** | search "ponytail" skill | whichever of its capabilities matches the task (read its SKILL.md first and state what it is for); do not use it if its purpose doesn't match | skip |
| **Nigeria_vibe_compliance** | github.com/Mikecode2005/Nigeria_vibe_compliance | anything with Nigerian specifics: ₦ formatting, +234 phone numbers/WhatsApp links, NDPA privacy/consent wording, Nigerian address/state lists, copy tone for the local market, low-bandwidth performance | `Intl` APIs + manual checks |
| **playwright-cli** | github.com/microsoft/playwright-cli | after finishing each section: screenshots at 390 / 768 / 1440 px, check console errors, tap targets, horizontal overflow, Lighthouse-style sanity | `next build` + manual review |
| `premium-church-ui` | already in this environment | **DO NOT USE** — belongs to a different project | — |

### Task → skill map
| Task | Load (in order) |
|---|---|
| Project setup, tokens, fonts | ai-design-skills → impeccable → Nigeria_vibe_compliance (locale constants) |
| Logo | taste-skill → impeccable |
| Nav + footer | ui-ux-pro → transitions.dev → taste-skill |
| Scroll-scrubbed hero (bidirectional, keyframe video) | gsap-skills → taste-skill → playwright-cli |
| Content sections (about, services, process, stats) | impeccable → taste-skill → gsap-skills (reveals only) |
| Featured properties + cards | ui-ux-pro → taste-skill |
| Properties page (search/filter/pagination) | ui-ux-pro → Nigeria_vibe_compliance → playwright-cli |
| Valuation page (form) | ui-ux-pro → Nigeria_vibe_compliance |
| Google reviews section | taste-skill → gsap-skills (marquee) or transitions.dev |
| WhatsApp CTA / floating button | Nigeria_vibe_compliance → ui-ux-pro |
| Page transitions | transitions.dev |
| QA / polish / perf | playwright-cli → taste-skill → impeccable |

Each task in `PRD.md` names its skills. At the start of a task, state: "Loading: X, Y". At the end: "Verified with playwright-cli at 390/768/1440: ✔/✘".

---

## 3. Engineering rules

- **Stack:** Next.js (App Router) + TypeScript + Tailwind CSS + `gsap` (+ `@gsap/react`) + `lucide-react`. Frontend only: no API routes, no database, no auth.
- **Versions: always the latest stable of everything you install.** Use **Next.js 16** (`npx create-next-app@latest`), the React version it ships with, the latest Tailwind CSS, latest `gsap`, `@gsap/react`, `lucide-react`, and any other package (`npm install <pkg>@latest`). Never pin old versions from memory. Before writing code, run `npm view <pkg> version` for each dependency and confirm what is installed with `npm ls --depth=0`. Check the official docs/upgrade guide for the installed major version (Next 16: async `params`/`searchParams` must be awaited, `middleware` is now `proxy`, Turbopack is the default bundler, Node 20.9+ required) and follow current APIs, not older patterns from training data. Tailwind v4 style config (CSS-first, `@theme` in `globals.css`) if that is what `@latest` installs. If a package's latest version breaks the build, report it and propose the smallest fix rather than silently downgrading.
- Server Components by default; `"use client"` only for interactive/animated pieces.
- `next/image` for all images; `next/font` for fonts. Hero video lazy-handled (see PRD T4).
- All editable content lives in `src/data/*.ts` and `src/config/site.ts` — never hard-code business info inside components.
- File layout:
  ```
  src/
    app/ (page.tsx, properties/page.tsx, properties/[slug]/page.tsx, valuation/page.tsx, layout.tsx, globals.css)
    components/ (layout/, home/, properties/, valuation/, ui/, Logo.tsx)
    data/ (properties.ts, reviews.ts, services.ts)
    config/ site.ts
    lib/ (format.ts, whatsapp.ts, filters.ts)
    types/ index.ts
  public/ (logo.svg, videos/, images/, og/)
  reference/ (the two inspiration videos)
  ```
- No `any`. Lint + `next build` must pass before a task is marked done.
- Accessibility: semantic landmarks, visible focus rings, labels on every input, alt text, 44px min tap targets, keyboard-operable filters.
- **Hero video encoding: EVERY frame must be a keyframe (all-intra H.264).** This is what makes backward scrubbing instant. Encode with FFmpeg using `-g 1 -keyint_min 1 -sc_threshold 0 -bf 0` (see `docs/VIDEO.md` for the full commands) and verify with ffprobe that 100% of frames are `I`. Never ship a video with P/B frames in the hero.
- Performance targets (mobile): LCP < 2.5s, CLS < 0.1. All-intra files are large, so tune CRF/resolution to keep the hero around ≤ 12 MB desktop (≈1600px wide) and ≤ 5 MB mobile (720px wide); the video is 6s so keep fps at 30.
- SEO: metadata per page, Open Graph image, `RealEstateAgent` JSON-LD on home.
- Placeholders: any invented data (phone, address, listings, reviews) must be marked `// TODO(client): replace` and be obviously fake-safe. **Never fabricate Google reviews as if real** — see PRD T9.

## 4. Definition of done (every task)
1. Matches §1 visually. 2. Responsive 390 / 768 / 1440. 3. Reduced-motion respected. 4. No console errors. 5. `next build` passes. 6. Checkbox ticked in `PRD.md`. Then **stop and wait** for "next" before starting the next task.
