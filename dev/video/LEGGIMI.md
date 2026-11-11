# TG Rally: il kit dei video

Qui c'è tutto quello che serve per montare il TG di Rally, il canale TikTok di FinLearn: Rally conduttore al bancone racconta notizie e storie della finanza, dalla notizia del giorno agli speciali di qualche minuto. Lo usa la skill `regista-video-rally`, che spiega fasi, fermate e regole. Qui ci sono solo i pezzi e i comandi.

## I pezzi

| File | Che cosa fa |
|---|---|
| `rally4.js` | Lo scheletro di Rally: disegno, viste, espressioni, pose, labiale, movimenti. Non si ridisegna. |
| `tg.js` | Lo studio del TG (schermo, bancone, nastro, sottotitoli, camera) e la regia: che cosa fa Rally parola per parola. |
| `video.js` | La scheda dell'episodio: battute, sottotitoli, capitoli, schermate, gesti. Cambia a ogni episodio. |
| `render.html`, `render.cjs`, `render.sh` | Disegnano i fotogrammi e montano il video. |
| `scene.cjs` | Dalla scheda alle battute per la voce (`scene.json`), con le pause prima dei capitoli. |
| `tempi.py` | Voce: taglia i silenzi, controlla le parole con il riconoscitore vocale, trova i tempi veri di ogni parola. |
| `sound.py` | Effetti sonori sintetizzati e mix: voce sopra, effetti almeno 10 dB sotto, −14 LUFS. |
| `controlli.cjs` | I controlli automatici: sottotitoli troppo brevi, scritte che spariscono troppo presto, tratti vuoti. |
| `fonts.py` | Incorpora i caratteri dell'app (Bricolage Grotesque, IBM Plex Mono). |

Ogni fotogramma è disegnato a partire dal tempo `t`, senza stato nascosto. I momenti della regia sono agganciati alle parole, non ai secondi: quando arrivano i tempi veri della voce si spostano da soli.

## I comandi, nello spazio di Higgsfield

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/stefanocoran6-dotcom/app tg
cd tg && git sparse-checkout set dev/video && cd dev/video
npm i --no-save --silent @fontsource-variable/bricolage-grotesque@5.3.0 @fontsource/ibm-plex-mono@5.3.0 && python3 fonts.py
export NODE_PATH=$(npm root -g)
cp episodi/AAAA-MM-GG-parola.js video.js             # l'episodio da montare
node scene.cjs scene.json
mkdir -p voce        # una battuta per scena: voce/<id>.mp3, scaricata dall'indirizzo della generazione
python3 tempi.py voce scene.json .
node controlli.cjs                                   # di nuovo, con i tempi veri
node render.cjs eventi eventi.json
python3 sound.py eventi.json voce.wav mix.wav
./render.sh anteprima.mp4 0.5 mix.wav                # fermata 3: 540×960
./render.sh tg-rally-AAAA-MM-GG.mp4 1 mix.wav        # finale: 1080×1920, con size "xl"
```

Senza `tempi.js` i tempi sono stimati a 2,2 parole al secondo (il passo della voce di Rally): serve per lo storyboard, prima della voce.

**Video lunghi.** Nello spazio di Higgsfield un lavoro in sottofondo dura al massimo 15 minuti. Se `render.sh` non ci sta, si rende a pezzi in lavori separati, `node render.cjs frames parte1.mp4 <scala> <da> <a>` (fotogrammi da..a-1, 30 al secondo), poi si uniscono con `ffmpeg -f concat -safe 0 -i parti.txt -c copy muto.mp4` e si aggiunge l'audio come alla fine di `render.sh`.

## La scheda dell'episodio (`video.js`)

Ogni episodio è una scheda: battute, schermate e gesti scelti dalle librerie di `tg.js`. Codice nuovo serve solo quando una storia chiede un disegno che non c'è ancora. Due esempi completi: `episodi/2026-11-10-bollette.js` (una notizia, 30 secondi) e `episodi/2026-11-11-jensen-huang.js` (uno speciale di 4 minuti, a capitoli). Ogni episodio si salva in `episodi/` con il suo nome, poi si copia in `video.js` per montarlo.

- **`scene`**: le battute in ordine, ognuna con `id` e `dice` (il testo per la voce, numeri in lettere). I sottotitoli in due modi:
  - `mostra`: lo stesso testo con i numeri in cifre e la *parola* da evidenziare tra asterischi, stesse parole una per una ("cinque milioni" → "*5 milioni*"). `tg.js` lo taglia da solo in blocchi di 2-4 parole, sulla punteggiatura e mai dentro un'evidenziazione;
  - `blocchi`: a mano, [quante parole dette copre, testo].
- **`capitoli`** [{scena, titolo}]: ogni capitolo comincia con la battuta `scena`. Prima della battuta c'è un respiro in più (`pausaCapitolo`, di solito 0,6 s; una scena può avere la sua `pausa`), poi compare da solo il cartello del capitolo con il numero, il titolo e i pallini dei capitoli; il titolo resta sul nastro fino al capitolo dopo.
- **Appuntamenti**: tutti i tempi si agganciano alle parole. `"fatto:Prime"` è quando Rally dice "Prime" nella battuta `fatto`; `"perte:il#2"` è la seconda volta che dice "il"; `"come:@inizio"` e `"come:@fine"` sono inizio e fine della battuta. Con `d` si aggiunge uno scarto in secondi: `{a: 'fatto:Prime', d: -.12}`. Le parole si scrivono come nel testo (`"c3c:Denny's"`, `"c4c:l'altro"`).
- **`schermi`**, in ordine: il primo parte da 0, gli altri da `da`.

| Modello | Campi |
|---|---|
| `titolo` | `etichetta`, `righe` (2, corte), `evid` (la riga evidenziata), `icona` (nome, oppure {nome, a} per farla entrare su una parola), `timbro` {testo, colore, a} |
| `numero` | `etichetta`, `parti` [{testo, a}]: la prima arriva con un colpo, le altre scivolano; `chips` [{testo, icona, colore, a}]; `fonte` |
| `catena` | `etichetta`, `passi` [{icona, nome, a}] (2 o 3) uniti da frecce, ognuno entra sulla sua parola; `note` [{testo, passo, colore, lato, a}]; `fx`: `cresce`, `moneta`, `accendi` {passo, a, fino} e `prezzo` {passo, su, giu, simbolo} |
| `scelta` | `etichetta`, `domanda`, `carte` (2) [{titolo, nota, colore, notaColore, segno: si, no o uguale, a, pulse}] |
| `confronto` | `etichetta`, `sinistra` {testo, nota, a}, `destra` {testo, nota, colore, a} |
| `grafico` | `etichetta`, `valori`, `linea` {a}, `soglia` {valore, testo}, `fine` {testo, a}, `verso` (su o giu), `colore` |
| `griglia` | lo schermo fatto di pixel. `modo` assente: l'immagine si disegna (`disegna` {a, fino}) e un puntino si ingrandisce (`lente` {a, i, j, testo}); `modo: 'confronto'`: `sinistra` {a, testo, nota} colora un puntino alla volta, `destra` {a, testo, nota} si riempie tutta insieme su `tutti` {a}; `modo: 'pioggia'`: tanti puntini insieme (`pioggia` {a}), `chips` sotto |
| `formula` | `etichetta`, `termini` [{testo, nota, colore, a}] uniti da `operatori` (di solito × e =); l'ultimo è il risultato, in giallo |
| `saluto` | `segui` {a}, `motto` |
| `capitolo` | lo mette da solo `tg.js`, dai `capitoli` |

Ogni schermata può scegliere `camera` (`schermo`, `rally` o `resta`), `zoom` [inizio, fine] e `fy` [inizio, fine].

Icone: lampadina, fiamma, centrale, casa, moneta, barile, banca, carrello, salvadanaio, banconota, persone, grafico; e per le storie: secchio, pin, aereo, collegio, diploma, piatti, tazza, chip, joypad, clessidra, scheda (grafica), coppa, cervello, server, provetta, chat, giacca. Sono oggetti e luoghi: le persone reali non si disegnano. Colori: giallo, az, menta, pesca, lilla, rosa, grigio, bianco.

- **`gesti`** {g, a, fino, ...}: `avanti`, `sporgi`, `salto` (forza), `gira` (durata), `bacchetta` (tocchi), `guarda` (dx, dy, rot), `segui` (oltre), `inclina`, `orecchie`, `posa` (nome, sporgi), `spalle`, `saluta`. Per indicare qualcosa sullo schermo si usa la `bacchetta`: le pose con la mano davanti al muso (`indicaSu`, `indicaCamera`, `pensa`) coprono la bocca mentre parla.
- **`umori`** {u, a}: le espressioni di Rally (neutral, happy, celebrating, thinking, sad, surprised, angry, love, sleepy, wink, dizzy, smug, crying, proud, determined, nervous, laugh). Il cambio avviene dietro un battito di ciglia.

## Limiti noti

- Higgsfield accetta al massimo due voci alla volta: le altre richieste tornano indietro (429) e vanno rimandate. Una richiesta arriva al massimo a 2048 caratteri.
- La voce costa circa 0,7 crediti ogni 100 caratteri (11 novembre 2026): uno speciale di 4 minuti, circa 3.000 caratteri, circa 21 crediti.
- Non accelerare la voce: con `TEMPO=1.1` si capiva peggio ("Prima estime" invece di "Prime stime").
- Questa voce ha un leggero accento: "bolletta" si sente come "boletta".

## Controlli rapidi

- `node render.cjs info`: durata, fotogrammi, se i tempi sono veri.
- `node render.cjs still prova.jpg 10.9 0.5`: un fotogramma da guardare.
- `node controlli.cjs`: sottotitoli sotto 0,6 s, scritte che restano meno di 1,3 s, tratti di più di 4 s senza niente di nuovo sullo schermo.
- `tempi.py` stampa che cosa ha sentito il riconoscitore e le parole del copione che non ha sentito: se ce ne sono, la battuta si rigenera.
- `sound.py` stampa volume, picco e di quanto gli effetti stanno sotto la voce.
