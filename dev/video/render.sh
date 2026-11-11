#!/usr/bin/env bash
# Video del TG Rally: fotogrammi in parallelo (un pezzo per processore), unione senza ricodificare, audio alla fine.
# Uso: ./render.sh <uscita.mp4> <scala: 0.5 = anteprima 540x960 | 1 = finale 1080x1920> [audio.wav]
set -euo pipefail
cd "$(dirname "$0")"
OUT=$1; SC=$2; AUD=${3:--}
export NODE_PATH=${NODE_PATH:-$(npm root -g)}
FR=$(node render.cjs info | python3 -c "import json,sys;print(json.load(sys.stdin)['frames'])")
P=$(nproc); if [ "$P" -gt 8 ]; then P=8; fi
C=$(( (FR + P - 1) / P )); : > parti.txt; PIDS=()
for i in $(seq 0 $((P - 1))); do
  A=$((i * C)); B=$(((i + 1) * C))
  if [ "$B" -gt "$FR" ]; then B=$FR; fi
  if [ "$A" -ge "$FR" ]; then break; fi
  node render.cjs frames "parte$i.mp4" "$SC" "$A" "$B" & PIDS+=($!)
  echo "file 'parte$i.mp4'" >> parti.txt
done
for p in "${PIDS[@]}"; do wait "$p"; done
ffmpeg -y -v error -f concat -safe 0 -i parti.txt -c copy muto.mp4
if [ "$AUD" = "-" ]; then mv muto.mp4 "$OUT"; else
  ffmpeg -y -v error -i muto.mp4 -i "$AUD" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -ar 48000 -ac 2 -af apad -shortest \
    -movflags +faststart "${OUT%.mp4}.tmp.mp4"
  mv "${OUT%.mp4}.tmp.mp4" "$OUT"; rm -f muto.mp4
fi
rm -f parte*.mp4 parti.txt
ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height,r_frame_rate -of compact=p=0 "$OUT"
