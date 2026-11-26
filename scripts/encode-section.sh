#!/usr/bin/env bash
set -euo pipefail

RAW_INPUT="${1:-reference/section-raw.mp4}"

if [ ! -f "$RAW_INPUT" ]; then
  echo "Error: raw video not found at '$RAW_INPUT'" >&2
  exit 1
fi

mkdir -p public/videos public/images

echo "Encoding desktop section showcase video..."
ffmpeg -y -i "$RAW_INPUT" -an \
  -vf "fps=30,scale=1600:-2" \
  -c:v libx264 -preset slow -crf 26 \
  -g 1 -keyint_min 1 -sc_threshold 0 -bf 0 \
  -x264-params keyint=1:min-keyint=1:scenecut=0 \
  -pix_fmt yuv420p -movflags +faststart \
  public/videos/section-showcase.mp4

echo "Encoding mobile section showcase video..."
ffmpeg -y -i "$RAW_INPUT" -an \
  -vf "fps=30,scale=1080:-2" \
  -c:v libx264 -preset slow -crf 28 \
  -g 1 -keyint_min 1 -sc_threshold 0 -bf 0 \
  -x264-params keyint=1:min-keyint=1:scenecut=0 \
  -pix_fmt yuv420p -movflags +faststart \
  public/videos/section-showcase-mobile.mp4

echo "Extracting first and last frame posters..."
ffmpeg -y -i "$RAW_INPUT" -vf "select=eq(n\,0)" -vframes 1 -q:v 2 public/images/section-poster.jpg
ffmpeg -y -sseof -0.1 -i "$RAW_INPUT" -vframes 1 -q:v 2 public/images/section-poster-end.jpg

verify_all_intra() {
  local file="$1"
  echo "Verifying keyframes for $file:"
  local summary
  summary=$(ffprobe -v error -select_streams v:0 -show_entries frame=pict_type -of csv=p=0 "$file" | sort | uniq -c)
  echo "$summary"
  if echo "$summary" | grep -qE '[PB]$'; then
    echo "ERROR: $file contains non-I frames! Re-encode required." >&2
    exit 1
  fi
}

verify_all_intra public/videos/section-showcase.mp4
verify_all_intra public/videos/section-showcase-mobile.mp4

ls -lh public/videos/section-showcase.mp4 public/videos/section-showcase-mobile.mp4 public/images/section-poster.jpg public/images/section-poster-end.jpg
