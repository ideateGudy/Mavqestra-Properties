# Scroll-Scrubbed Video Encoding Guide (`MAVQESTRA PROPERTIES`)

The landing page uses **two scroll-scrubbed videos** driven bidirectionally by GSAP `ScrollTrigger`:
1. **Hero (`HeroSection`)**: `public/videos/hero-construction.mp4` (+ mobile) from `reference/hero-raw.mp4`
2. **Architectural Showcase (`ScrollVideoSection`)**: `public/videos/section-showcase.mp4` (+ mobile) from `reference/section-raw.mp4`

Because scrolling **up** seeks backward through each video frame-by-frame, **every single frame must be an Intra-frame (keyframe / `I`-frame)**. Standard inter-frame (`P` / `B`) compression causes severe backward-seek stalls on browsers and mobile devices.

## Output Files & Budgets

| File | Target | Budget |
|---|---|---|
| `public/videos/hero-construction.mp4` | Hero Desktop (`>= 768px`) | ≤ 12 MB |
| `public/videos/hero-construction-mobile.mp4` | Hero Mobile (`< 768px`) | ≤ 5 MB |
| `public/images/hero-poster.jpg` | Hero first-frame poster | < 600 KB |
| `public/images/hero-poster-end.jpg` | Hero last-frame poster (`prefers-reduced-motion`) | < 600 KB |
| `public/videos/section-showcase.mp4` | Section Desktop (`>= 768px`) | ≤ 12 MB |
| `public/videos/section-showcase-mobile.mp4` | Section Mobile (`< 768px`) | ≤ 5 MB |
| `public/images/section-poster.jpg` | Section first-frame poster | < 600 KB |
| `public/images/section-poster-end.jpg` | Section last-frame poster (`prefers-reduced-motion`) | < 600 KB |

## Usage

Run the helper scripts with the path to your raw source video:

```bash
bash scripts/encode-hero.sh reference/hero-raw.mp4
bash scripts/encode-section.sh reference/section-raw.mp4
```

## Manual FFmpeg Commands

### Desktop (`1600px` wide, 30 fps, all-intra H.264)

```bash
ffmpeg -y -i reference/hero-raw.mp4 -an \
  -vf "fps=30,scale=1600:-2" \
  -c:v libx264 -preset slow -crf 26 \
  -g 1 -keyint_min 1 -sc_threshold 0 -bf 0 \
  -x264-params keyint=1:min-keyint=1:scenecut=0 \
  -pix_fmt yuv420p -movflags +faststart \
  public/videos/hero-construction.mp4
```

### Mobile (`1080px` wide, 30 fps, all-intra H.264)

```bash
ffmpeg -y -i reference/hero-raw.mp4 -an \
  -vf "fps=30,scale=1080:-2" \
  -c:v libx264 -preset slow -crf 28 \
  -g 1 -keyint_min 1 -sc_threshold 0 -bf 0 \
  -x264-params keyint=1:min-keyint=1:scenecut=0 \
  -pix_fmt yuv420p -movflags +faststart \
  public/videos/hero-construction-mobile.mp4
```

> If a file exceeds the size budget, raise `-crf` slightly (e.g. `26`–`28` desktop, `30` mobile) or reduce width — **never** remove `-g 1 -keyint_min 1 -sc_threshold 0 -bf 0`.

### Posters (First & Last Frame)

```bash
ffmpeg -y -i reference/hero-raw.mp4 -vf "select=eq(n\,0)" -vframes 1 -q:v 2 public/images/hero-poster.jpg
ffmpeg -y -sseof -0.1 -i reference/hero-raw.mp4 -vframes 1 -q:v 2 public/images/hero-poster-end.jpg
```

## Verification (Must Print Only `I`)

```bash
ffprobe -v error -select_streams v:0 -show_entries frame=pict_type -of csv=p=0 public/videos/hero-construction.mp4 | sort | uniq -c
ffprobe -v error -select_streams v:0 -show_entries frame=pict_type -of csv=p=0 public/videos/hero-construction-mobile.mp4 | sort | uniq -c
```

If any `P` or `B` frame appears, re-encode immediately.
