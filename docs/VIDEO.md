# Hero Video Encoding Guide (`MAVQESTRA PROPERTIES`)

The landing page hero uses a **scroll-scrubbed construction video** driven bidirectionally by GSAP `ScrollTrigger`.
Because scrolling **up** seeks backward through the video frame-by-frame, **every single frame must be an Intra-frame (keyframe / `I`-frame)**. Standard inter-frame (`P` / `B`) compression causes severe backward-seek stalls on browsers and mobile devices.

## Output Files & Budgets

| File | Target | Budget |
|---|---|---|
| `public/videos/hero-construction.mp4` | Desktop (`>= 768px`) | ≤ 12 MB |
| `public/videos/hero-construction-mobile.mp4` | Mobile (`< 768px`) | ≤ 5 MB |
| `public/images/hero-poster.jpg` | First-frame poster / fallback | < 200 KB |
| `public/images/hero-poster-end.jpg` | Last-frame poster (`prefers-reduced-motion`) | < 200 KB |

## Usage

Run the helper script with the path to your raw source video:

```bash
bash scripts/encode-hero.sh reference/hero-raw.mp4
```

## Manual FFmpeg Commands

### Desktop (`1600px` wide, 30 fps, all-intra H.264)

```bash
ffmpeg -y -i reference/hero-raw.mp4 -an \
  -vf "fps=30,scale=1600:-2" \
  -c:v libx264 -preset slow -crf 24 \
  -g 1 -keyint_min 1 -sc_threshold 0 -bf 0 \
  -x264-params keyint=1:min-keyint=1:scenecut=0 \
  -pix_fmt yuv420p -movflags +faststart \
  public/videos/hero-construction.mp4
```

### Mobile (`720px` wide, 30 fps, all-intra H.264)

```bash
ffmpeg -y -i reference/hero-raw.mp4 -an \
  -vf "fps=30,scale=720:-2" \
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
