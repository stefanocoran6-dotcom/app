#!/bin/bash
# Ricostruisce ../../ordine.js (la nuova grafica "In ordine") unendo i pezzi di questa cartella, poi ne controlla la sintassi.
# Poi genera ../../ordine_en.js, la versione inglese, con dev/en/compila.mjs (frasi in dev/en/ui_en.txt, lezioni in dev/en/basi_en.json).
# Uso: dev/ordine/build.sh
set -e
D="$(cd "$(dirname "$0")" && pwd)"; OUT="$D/../../ordine.js"
python3 "$D/basi_src.py"   # controlla le lezioni di "Basi della finanza" e scrive basi.json
python3 -B "$D/azioni_src.py"   # controlla le lezioni di "Azioni" (con i conti della storia) e scrive azioni.json
{ cat "$D/p00_base.js"; printf '\n// Lezioni di "Basi della finanza" (generate da dev/ordine/basi_src.py)\nconst BASI_UNITS = '; cat "$D/basi.json"; printf ';\n// Lezioni di "Azioni" (generate da dev/ordine/azioni_src.py)\nconst AZIONI_UNITS = '; cat "$D/azioni.json"; printf ';\n'
  cat "$D/p10_data.js" "$D/p20_ui.js" "$D/p30_learn.js" "$D/p35_steps.js" "$D/p37_news.js" "$D/p40_train.js" "$D/p44_motore.js" "$D/p45_serie.js" "$D/p50_more.js" "$D/p55_live.js" "$D/p60_start.js" "$D/p90_app.js"; } > "$OUT"
T="$(mktemp -d)"; cp "$OUT" "$T/ordine.mjs"; node --check "$T/ordine.mjs" && echo "ordine.js ok, $(wc -c < "$OUT") byte"; rm -rf "$T"
# la versione inglese: stesso codice, frasi tradotte. Se nel codice italiano ci sono frasi nuove senza traduzione lo dice qui (e resta in italiano lì).
E="$D/../en"
if [ -f "$E/compila.mjs" ]; then
  [ -d "$E/node_modules/acorn" ] || (cd "$E" && npm install --no-audit --no-fund --silent)
  python3 "$E/glossario.py" | tail -1   # le voci del glossario inglese
  node "$E/compila.mjs" --scrivi | grep -E "ancora da tradurre|scritto|ERRORE" | sed 's/^/inglese: /'
  node "$E/compila.mjs" | grep -q "ancora da tradurre: 0" || echo "ATTENZIONE: ci sono frasi italiane senza traduzione inglese (node dev/en/compila.mjs --scheletro, poi dev/en/LEGGIMI.md)"
  T="$(mktemp -d)"; cp "$D/../../ordine_en.js" "$T/ordine_en.mjs"; node --check "$T/ordine_en.mjs" && echo "ordine_en.js ok, $(wc -c < "$D/../../ordine_en.js") byte"; rm -rf "$T"
fi
python3 "$D/../notizie_check.py" | tail -1   # le notizie del nastro (notizie.json)
node "$D/../../sfide/estrai-domande.mjs"   # le domande che usa l'arbitro delle sfide dal vivo (sfide/src/domande.json)
