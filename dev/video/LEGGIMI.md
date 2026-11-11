# TG Rally: il kit dei video

Qui c'è tutto quello che serve per montare il TG di Rally, il telegiornale di FinLearn per TikTok: Rally conduttore al bancone racconta ogni giorno una notizia di finanza. Lo usa la skill `regista-video-rally`, che spiega fasi, fermate e regole. Qui ci sono solo i pezzi e i comandi.

## I pezzi

| File | Che cosa fa |
|---|---|
| `rally4.js` | Lo scheletro di Rally: disegno, viste, espressioni, pose, labiale, movimenti. Non si ridisegna. |
| `tg.js` | Lo studio del TG (schermo, bancone, nastro, sottotitoli, camera) e la regia: che cosa fa Rally parola per parola. |
| `video.js` | La scheda dell'episodio: battute, sottotitoli, nastro, schermate, gesti. Cambia a ogni episodio. |
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

Senza `tempi.js` i tempi sono stimati a 2,2 parole al secondo (il passo della voce di Rally): serve per lo storyboard, prima della voce.

## La scheda dell'episodio (`video.js`)

Ogni episodio è una scheda: battute, schermate e gesti scelti da due librerie di `tg.js`. Codice nuovo serve solo quando una notizia chiede un disegno che non c'è ancora. L'esempio completo è `episodi/2026-11-10-bollette.js`. Ogni episodio si salva lì con il suo nome, poi si copia in `video.js` per montarlo.

- **`scene`**: le battute in ordine, ognuna con `id`, `dice` (numeri in lettere) e `blocchi` dei sottotitoli. La struttura del format è sempre la stessa: gancio, fatto con il numero, come funziona, che cosa cambia per te, saluto.
- **Appuntamenti**: tutti i tempi si agganciano alle parole. `"fatto:Prime"` è quando Rally dice "Prime" nella battuta `fatto`; `"perte:il#2"` è la seconda volta che dice "il"; `"come:@inizio"` e `"come:@fine"` sono inizio e fine della battuta. Con `d` si aggiunge uno scarto in secondi: `{a: 'fatto:Prime', d: -.12}`.
- **`schermi`**, in ordine: il primo parte da 0, gli altri da `da`.

| Modello | Campi |
|---|---|
| `titolo` | `etichetta`, `righe` (2), `evid` (la riga evidenziata), `icona`, `timbro` {testo, colore, a} |
| `numero` | `etichetta`, `parti` [{testo, a}]: la prima arriva con un colpo, le altre scivolano; `chips` [{testo, icona, colore, a}]; `fonte` |
| `catena` | `etichetta`, `passi` [{icona, nome}] (2 o 3) uniti da frecce, `note` [{testo, passo, colore, lato, a}], `fx`: `cresce`, `moneta`, `accendi` {passo, a, fino} e `prezzo` {passo, su, giu, simbolo} |
| `scelta` | `etichetta`, `domanda`, `carte` (2) [{titolo, nota, colore, notaColore, segno: si, no o uguale, a, pulse}] |
| `confronto` | `etichetta`, `sinistra` {testo, nota, a}, `destra` {testo, nota, colore, a} |
| `grafico` | `etichetta`, `valori`, `linea` {a}, `soglia` {valore, testo}, `fine` {testo, a}, `verso` (su o giu), `colore` |
| `saluto` | `segui` {a}, `motto` |

Ogni schermata può scegliere `camera` (`schermo` o `rally`), `zoom` [inizio, fine] e `fy` [inizio, fine].
Icone: lampadina, fiamma, centrale, casa, moneta, barile, banca, carrello, salvadanaio, banconota, persone, grafico. Colori: giallo, az, menta, pesca, lilla, rosa, grigio, bianco.

- **`gesti`** {g, a, fino, ...}: `avanti`, `sporgi`, `salto` (forza), `gira` (durata), `bacchetta` (tocchi), `guarda` (dx, dy, rot), `segui` (oltre), `inclina`, `orecchie`, `posa` (nome, sporgi), `spalle`, `saluta`.
- **`umori`** {u, a}: le espressioni di Rally (happy, surprised, nervous, smug, neutral, wink, thinking, proud, determined, laugh...). Il cambio avviene dietro un battito di ciglia.

## Limiti noti

- Higgsfield accetta al massimo due voci alla volta: le altre richieste tornano indietro (429) e vanno rimandate.
- Non accelerare la voce: con `TEMPO=1.1` si capiva peggio ("Prima estime" invece di "Prime stime").
- Questa voce ha un leggero accento: "bolletta" si sente come "boletta".

## Controlli rapidi

- `node render.cjs info`: durata, fotogrammi, se i tempi sono veri.
- `node render.cjs still prova.jpg 10.9 0.5`: un fotogramma da guardare.
- `tempi.py` stampa che cosa ha sentito il riconoscitore e le parole del copione che non ha sentito: se ce ne sono, la battuta si rigenera.
- `sound.py` stampa volume, picco e di quanto gli effetti stanno sotto la voce.
