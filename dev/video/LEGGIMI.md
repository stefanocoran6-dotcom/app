# TG Rally: il kit dei video

Qui c'è tutto quello che serve per montare il TG di Rally, il telegiornale di FinLearn per TikTok: Rally conduttore al bancone racconta ogni giorno una notizia di finanza. Lo usa la skill `regista-video-rally`, che spiega fasi, fermate e regole. Qui ci sono solo i pezzi e i comandi.

## I pezzi

| File | Che cosa fa |
|---|---|
| `rally4.js` | Lo scheletro di Rally: disegno, viste, espressioni, pose, labiale, movimenti. Non si ridisegna. |
| `tg.js` | Lo studio del TG (schermo, bancone, nastro, sottotitoli, camera) e la regia: che cosa fa Rally parola per parola. |
| `video.js` | La scheda dell'episodio: battute, sottotitoli, testo del nastro. Cambia a ogni episodio. |
| `render.html`, `render.cjs`, `render.sh` | Disegnano i fotogrammi e montano il video. |
| `tempi.py` | Voce: taglia i silenzi, controlla le parole con il riconoscitore vocale, trova i tempi veri di ogni parola. |
| `sound.py` | Effetti sonori sintetizzati e mix: voce sopra, effetti almeno 10 dB sotto, −14 LUFS. |
| `fonts.py` | Incorpora i caratteri dell'app (Bricolage Grotesque, IBM Plex Mono). |

Ogni fotogramma è disegnato a partire dal tempo `t`, senza stato nascosto. I momenti della regia sono agganciati alle parole, non ai secondi: quando arrivano i tempi veri della voce si spostano da soli.

## I comandi, nello spazio di Higgsfield

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/stefanocoran6-dotcom/app tg
cd tg && git sparse-checkout set dev/video && cd dev/video
npm i --no-save --silent @fontsource-variable/bricolage-grotesque@5.3.0 @fontsource/ibm-plex-mono@5.3.0 && python3 fonts.py
export NODE_PATH=$(npm root -g)
node -e "global.window={};require('./video.js');require('fs').writeFileSync('scene.json',JSON.stringify(window.VIDEO.scene.map(s=>({id:s.id,dice:s.dice}))))"
mkdir -p voce        # una battuta per scena: voce/<id>.mp3, scaricata dall'indirizzo della generazione
python3 tempi.py voce scene.json .
node render.cjs eventi eventi.json
python3 sound.py eventi.json voce.wav mix.wav
./render.sh anteprima.mp4 0.5 mix.wav                # fermata 3: 540×960
./render.sh tg-rally-AAAA-MM-GG.mp4 1 mix.wav        # finale: 1080×1920, meglio con size "xl"
```

Senza `tempi.js` i tempi sono stimati a 2,4 parole al secondo: serve per lo storyboard, prima della voce.

## Controlli rapidi

- `node render.cjs info`: durata, fotogrammi, se i tempi sono veri.
- `node render.cjs still prova.jpg 10.9 0.5`: un fotogramma da guardare.
- `tempi.py` stampa che cosa ha sentito il riconoscitore e le parole del copione che non ha sentito: se ce ne sono, la battuta si rigenera.
- `sound.py` stampa volume, picco e di quanto gli effetti stanno sotto la voce.
