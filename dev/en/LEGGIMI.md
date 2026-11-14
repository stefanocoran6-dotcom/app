# Versione inglese delle Basi: istruzioni per chi traduce

Questo è il lavoro da fare: tradurre in inglese le lezioni di "Capire la finanza da zero", un'unità per volta, senza cambiare né la struttura né i numeri. L'inglese è americano, perché la prima versione internazionale è per gli Stati Uniti.

## Che cosa c'è qui

| File | A che cosa serve |
|---|---|
| `termini.py`, `termini.json` | La tabella dei termini: per ogni voce del glossario italiano, il termine inglese da usare sempre. In fondo, le parole ricorrenti che non sono voci di glossario. |
| `lezioni.py`, `lezioni.json` | L'etichetta di ogni lezione: A, B, E o C (vedi sotto). |
| `unita/uNN.py` | Le unità tradotte, una per file. `u7.py` contiene già la lezione `basi-7-2`: è l'esempio da imitare. |
| `controlla.py` | Il controllo. Va fatto girare dopo ogni unità: deve finire con `errori 0`. Scrive anche `basi_en.json`, che è quello che l'app legge. |
| `variante_us.py` | Le due lezioni riscritte per chi sceglie gli Stati Uniti (`basi-6-1`: la Fed; `basi-6-2`: euro e dollaro visti da chi ha dollari). `controlla.py` le confronta con l'originale e le mette nel campo `us` della lezione. |

L'originale italiano è `dev/ordine/basi_src.py` (da leggere, mai da modificare).

## Quali lezioni tradurre

Solo quelle con etichetta **A** o **B** in `lezioni.json`: sono 50, circa 28.000 parole.

- **A**: si traduce così com'è.
- **B**: si traduce, ma dentro ci sono dati o regole italiane (l'elenco è nel campo `segni_italiani`). I fatti restano identici. Dove una frase dà una regola o un dato italiano come se valesse ovunque, si dice il Paese: "In Italy...", "The Bank of Italy suggests...". Non si sostituiscono con esempi di altri Paesi.
- **E** e **C**: per ora non si traducono. Sono regole europee con dettagli italiani (E) o lezioni che valgono solo in Italia (C). Si decideranno quando sarà scelto il Paese.

## Come si lavora

1. Scegli un'unità. Apri `dev/ordine/basi_src.py` e trova il suo blocco (`U7 = dict(id='basi-u7', ...`).
2. Copia il blocco in `dev/en/unita/u7.py` (stesso numero dell'unità), tenendo solo le lezioni A e B, nello stesso ordine.
3. Traduci i testi. Non toccare nient'altro (elenco sotto).
4. `python3 dev/en/controlla.py u7`. Correggi finché dà `errori 0`. Leggi ogni avviso: o lo sistemi, o sei sicuro che vada bene così.
5. Passa all'unità dopo. Un'unità per sessione: su file lunghi lo stile si perde.

Le unità scritte nel formato vecchio (`L(...)` invece di `LF(...)`: Gli strumenti, Rischio tempo e costi, Leggere un'azienda, L'economia intorno) si traducono allo stesso modo.

## Che cosa si traduce e che cosa no

Si traducono: titoli, testi delle pagine, domande, risposte, spiegazioni, etichette dei cursori (`label`), obiettivi e suggerimenti delle leve (`label`, `hint`), voci da mettere a posto o in ordine con il loro perché, nomi dei contenitori, etichette e cifre dei disegni, la frase finale "In breve", il nome dell'unità (`name`).

Restano identici all'originale:

- `key`, `id`, `sid`, la sigla della figurina (secondo argomento di `LF`), i minuti;
- il nome del modello delle leve (`'budget'`, `'mutuo'`...), i suoi parametri (`dict(entrate=1600)`), gli `id` dei cursori, `min`, `max`, `step`, `start`, `dec`, e tutto `cond`;
- ogni `unit=` (`'€'`, `'%'`, `'anni'`, `'mesi'`...): ci pensa l'app a mostrarle nella lingua giusta;
- i numeri di risposta (`ans`, `truth`, `near`, tolleranze), i pesi e i colori dei disegni (`CAP`, `INT`, `OK`, `'giallo'`, `'lilla'`...);
- **l'ordine** delle risposte, delle voci e dei contenitori: la risposta giusta è indicata dalla posizione;
- `[fig]`, le righe `|---|` delle tabelle, il numero di formule.

Nessun numero cambia valore. Cambia solo come è scritto.

## Come si scrive

- **Inglese americano**: installment, pre-authorization, behavior, checking account, stocks, mutual fund, deductible, vacation, cell phone, cart, store. Ortografia americana (-ize, -or, -er) e vocabolario americano.
- Si dà del tu al lettore: "you". Frasi corte, parole semplici, nessun gergo che la lezione non abbia già spiegato. Il tono dell'originale è diretto e senza enfasi: tienilo.
- I termini di `termini.json` si usano sempre uguali. Quando in italiano un termine del glossario è in grassetto, in inglese va in grassetto il termine della tabella, scritto come lì: è così che l'app lo rende una parola da toccare.
- Attenzione a queste coppie: *detrazione* è **tax credit**, *deduzione* è **deduction**; *anticipo* (della casa) è **down payment**, *caparra* è **deposit**; *franchigia* è **deductible**; *rata* è **installment**; *perizia* è **appraisal**; *azioni* sono **stocks**; *fondo comune* è **mutual fund**; *TAEG* è **APR**.
- **Numeri**: migliaia con la virgola, decimali con il punto, simbolo dell'euro davanti, sempre `€` e mai `$`: `€1,600`, `5.4%`, `€3,840`. Per chi sceglie gli Stati Uniti l'app lo mostra come dollaro: non lo fai tu. Dentro le formule: `1{,}600` per le migliaia e `0.30` per i decimali.
- **Formule**: stesse formule dell'originale, tra `\( \)` o `$$ $$`. Le parole dentro `\text{...}` si traducono. Una formula in evidenza resta entro una trentina di caratteri.
- **Vietati nei testi**: le virgolette doppie `"` e la lineetta lunga. Per citare usa ‘ ’. Niente `\'` dentro le stringhe: se il testo ha un apostrofo, chiudi la stringa tra virgolette doppie (`"don't"`), anche con la `r` davanti se ci sono formule.
- **Lunghezze**: una pagina sta sotto i 1.000 caratteri. Nei "metti al posto giusto" con tre contenitori usa parole corte (entro 11 lettere). Le risposte restano brevi come le originali.
- I nomi delle persone degli esempi (Giulia, Marco...) restano.
- Non aggiungere frasi, avvertenze o esempi che nell'originale non ci sono, e non toglierne.

## Il glossario

Per ogni unità tradotta, aggiungi a `dev/en/glossario_en.json` le voci dei termini in grassetto che hai usato, in questa forma:

```json
{ "needs": { "it": "bisogni", "titolo": "Needs", "testo": "What you can't do without: housing, bills, food, transport to work." } }
```

La chiave è il termine inglese in minuscolo, come in `termini.json`. Il testo traduce la spiegazione italiana, che sta in `GLOSS_DEF` dentro `dev/ordine/p10_data.js`.

## Che cosa controlla `controlla.py`, e che cosa no

Controlla: struttura identica all'originale, numeri e parametri invariati, stesso numero di risposte e di voci, formule e disegni al loro posto, caratteri vietati, lunghezza delle pagine, termini del glossario in grassetto, numeri citati nel testo.

Non controlla il significato. Una frase tradotta male passa. Per questo, dopo la traduzione, le lezioni B e quelle con più regole vengono rilette prima di entrare nell'app.

## Quando un'unità è finita

- `python3 dev/en/controlla.py` senza errori.
- Nessun avviso rimasto senza una ragione.
- Le voci del glossario aggiunte.
- Niente commit: le unità restano nella cartella finché non vengono montate e provate nell'app.


## Come si costruisce l'app in inglese

`dev/ordine/build.sh` fa tutto: costruisce `ordine.js` (italiano, identico a prima) e poi `ordine_en.js` (inglese). Nessuno dei due file si modifica a mano. `basi_en.json` va rifatto prima con `python3 dev/en/controlla.py` quando cambia una lezione tradotta.

`ordine_en.js` nasce da `ordine.js` con `node dev/en/compila.mjs`:

1. **`patch_en.mjs`**: sostituzioni esatte `[vecchio, nuovo, volte]` sul testo italiano, per quello che in inglese deve funzionare in un altro modo (la lingua `LANG`, i dollari al posto degli euro, le parti nascoste). Se un testo da sostituire non si trova, la costruzione si ferma.
2. **`ui_en.txt`**: il dizionario `italiano ⇒ inglese` di tutte le scritte dell'interfaccia. Il compilatore estrae ogni frase dal codice e la cerca qui; `{0}`, `{1}` sono i buchi dei template. Se ne manca una, `build.sh` la elenca ("ancora da tradurre"). Per cambiare una scritta si cambia qui, mai in `ordine.js`.
3. **`basi_en.json`** al posto delle lezioni italiane, con l'etichetta di ogni lezione (`lezioni.json`) e il glossario (`glossario_en.json`).

Restano fuori dall'inglese: notizie, sfide e sfide dal vivo, corso CFA, esami, lezioni C ed E (solo italiane), il vecchio aspetto dell'app.

`app.js` è unico per le due lingue: le scritte che servono in inglese passano da `L('italiano', 'English')` e il pacchetto giusto (`ordine.js` o `ordine_en.js`) si carica in base a `fl_lang`. `app_patch.mjs` e `app_en.txt` servono a ritrovare le frasi da avvolgere in `L(...)` dentro le zone elencate in `app_patch.mjs`.

**Lingua e Paese sono due impostazioni separate** (`fl_lang`: it, en; `fl_country`: US, IT). La lingua sceglie il pacchetto; il Paese decide quali lezioni si vedono (le A per tutti, le B solo con IT) e la valuta (in inglese con US gli euro diventano dollari, tranne nelle lezioni che hanno una variante `us`). Cambiare l'una o l'altra ricarica l'app.
