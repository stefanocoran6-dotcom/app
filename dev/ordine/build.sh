#!/bin/bash
# Ricostruisce ../../ordine.js (la nuova grafica "In ordine") unendo i pezzi di questa cartella, poi ne controlla la sintassi.
# Uso: dev/ordine/build.sh
set -e
D="$(cd "$(dirname "$0")" && pwd)"; OUT="$D/../../ordine.js"
python3 "$D/basi_src.py"   # controlla le lezioni di "Basi della finanza" e scrive basi.json
{ cat "$D/p00_base.js"; printf '\n// Lezioni di "Basi della finanza" (generate da dev/ordine/basi_src.py)\nconst BASI_UNITS = '; cat "$D/basi.json"; printf ';\n'
  cat "$D/p10_data.js" "$D/p20_ui.js" "$D/p30_learn.js" "$D/p35_steps.js" "$D/p37_news.js" "$D/p40_train.js" "$D/p50_more.js" "$D/p55_live.js" "$D/p60_start.js" "$D/p90_app.js"; } > "$OUT"
T="$(mktemp -d)"; cp "$OUT" "$T/ordine.mjs"; node --check "$T/ordine.mjs" && echo "ordine.js ok, $(wc -c < "$OUT") byte"; rm -rf "$T"
python3 "$D/../notizie_check.py" | tail -1   # le notizie del nastro (notizie.json)
node "$D/../../sfide/estrai-domande.mjs"   # le domande che usa l'arbitro delle sfide dal vivo (sfide/src/domande.json)
