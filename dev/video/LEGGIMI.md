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
| `pulisci.py` | Voce: toglie i rumori e le parole inventate che il generatore a volte aggiunge prima o dopo una battuta. |
| `tempi.py` | Voce: taglia i silenzi, controlla le parole con il riconoscitore vocale, trova i tempi veri di ogni parola. |
| `sound.py` | Effetti sonori sintetizzati e mix: voce sopra, effetti almeno 10 dB sotto, −14 LUFS. |
| `giunta.py` | Unisce due prese della stessa battuta, l'inizio da una e il resto dall'altra. |
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
mkdir -p prese voce  # una battuta per scena: prese/<id>.mp3, scaricata dall'indirizzo della generazione
python3 pulisci.py prese scene.json voce              # toglie rumori e parole in più: stampa che cosa ha tolto
PAUSA=0.6 python3 tempi.py voce scene.json .          # PAUSA: le pause dentro una battuta al massimo 0,6 s
node controlli.cjs                                   # di nuovo, con i tempi veri
node render.cjs eventi eventi.json
python3 sound.py eventi.json voce.wav mix.wav
./render.sh anteprima.mp4 0.5 mix.wav                # fermata 3: 540×960
./render.sh tg-rally-AAAA-MM-GG.mp4 1 mix.wav        # finale: 1080×1920, con size "xl"
```

Senza `tempi.js` i tempi sono stimati a 2,2 parole al secondo (il passo della voce di Rally): serve per lo storyboard, prima della voce.

**Video lunghi.** Nello spazio di Higgsfield un lavoro in sottofondo dura al massimo 15 minuti. Se `render.sh` non ci sta, si rende a pezzi in lavori separati, `node render.cjs frames parte1.mp4 <scala> <da> <a>` (fotogrammi da..a-1, 30 al secondo), poi si uniscono con `ffmpeg -f concat -safe 0 -i parti.txt -c copy muto.mp4` e si aggiunge l'audio come alla fine di `render.sh`.

## La scheda dell'episodio (`video.js`)

Ogni episodio è una scheda: battute, schermate e gesti scelti dalle librerie di `tg.js`. Codice nuovo serve solo quando una storia chiede un disegno che non c'è ancora. Tre esempi completi: `episodi/2026-11-10-bollette.js` (una notizia, 30 secondi), `episodi/2026-11-11-jensen-huang.js` (uno speciale di 4 minuti, a capitoli) e `episodi/2026-11-11-jensen-huang-en.js` (lo stesso speciale in inglese). Ogni episodio si salva in `episodi/` con il suo nome, poi si copia in `video.js` per montarlo.

- **`lingua`**: `'it'` (se manca) o `'en'`. Cambia il labiale di Rally, le scritte fisse dello studio (CAPITOLO/CHAPTER, DI/OF, Seguimi/Follow me), le parole deboli su cui un sottotitolo non deve finire e la lingua del riconoscitore vocale in `tempi.py` e `giunta.py`. Tutto il resto (battute, schermate, `rubrica`, `nastro`, `motto`) si scrive già nella lingua dell'episodio. In inglese un numero detto come una parola sola si scrive con i trattini in `dice` ("nineteen-ninety-three", "one-twenty-eight", "three-D"), così corrisponde alla parola "1993" di `mostra`; `tempi.py` riconosce le letture inglesi dei numeri (anni a coppie, "two thousand seven", "$5 trillion").

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
- Questa voce ha un leggero accento: "bolletta" si sente come "boletta", "videogiochi" come "videogiocchi", "moltiplichi" come "multiplichi", "accetta" come "acchetta". In tre prove "finisce il liceo" aveva un suono strano in mezzo: meglio "si diploma". Un numero detto in fretta ("sei mesi") può sembrare un'altra parola: va ricontrollato sempre.
- Quando una presa sbaglia una parola e un'altra presa un'altra, `giunta.py` unisce i pezzi buoni nel silenzio tra due parole, senza spendere crediti: `python3 giunta.py A.mp3 B.mp3 <ultima parola da A> <prima parola da B> uscita.mp3 [it o en]`.
- Il primo speciale (3.068 caratteri, 12 battute rifatte) è costato 30 crediti: conta un terzo in più del preventivo per le prese da rifare.
- In inglese la voce di Rally è il preset Ainsley (`731b4ffe-e95e-59f4-8c00-81608936091f`, scelto da Stefano l'11 novembre 2026), senza cambiare il tono. Si ferma a lungo dopo i due punti e le domande (fino a 1,8 s): `PAUSA=0.6` in `tempi.py` accorcia quelle pause. Il riconoscitore scrive "Raleigh" per Rally e "and Vidia" per Nvidia: sono il suo modo di scrivere, non errori della voce.
- A volte il generatore aggiunge qualcosa che non c'è nel copione: una sillaba prima della battuta, una frase senza senso o un colpo secco alla fine (4 prese su 36 nello speciale inglese). `pulisci.py` le toglie senza spendere crediti; se una presa ha parole sbagliate in mezzo, va rifatta.

## Controlli rapidi

- `node render.cjs info`: durata, fotogrammi, se i tempi sono veri.
- `node render.cjs still prova.jpg 10.9 0.5`: un fotogramma da guardare.
- `node controlli.cjs`: sottotitoli sotto 0,6 s, scritte che restano meno di 1,3 s, tratti di più di 4 s senza niente di nuovo sullo schermo.
- `tempi.py` stampa che cosa ha sentito il riconoscitore e le parole del copione che non ha sentito: se ce ne sono, la battuta si rigenera.
- `sound.py` stampa volume, picco e di quanto gli effetti stanno sotto la voce.
