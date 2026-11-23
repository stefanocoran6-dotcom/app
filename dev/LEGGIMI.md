# Sorgenti di lavoro

Questa cartella non serve all'app in funzione: contiene i pezzi da cui si ricostruisce `ordine.js`, cioè tutta l'app che si vede (la grafica "In ordine").

In `app.js` restano le parti comuni (chat dell'AI Coach, OpenRouter, mascotte, album, calcolatrice) e, non più raggiungibile, il codice della grafica di prima: va tolto in un passo a parte. Dalla versione 57 non ci sono più i contenuti del CFA Level II (erano ricavati dalle dispense di un fornitore: i percorsi professionali si riscrivono da zero) né la scelta tra le due grafiche.

- `ordine/p00_base.js` … `p90_app.js`: i pezzi del codice, nell'ordine in cui vengono uniti (base e stili, dati, componenti, Impara, passi interattivi, notizie, Allenati, Sfide e Profilo, apertura, app).
- `ordine/basi_src.py`: le lezioni del percorso "Basi della finanza". Si scrivono qui, una per blocco, con pagine, frase "In breve" ed esercizi. Lo script controlla la forma (chiavi uniche, tre risposte per domanda, una domanda per lezione) e scrive `basi.json`.
- `ordine/p35_steps.js`: i passi interattivi delle lezioni (stima prima di leggere, leve con un obiettivo, metti al posto giusto, metti in ordine, calcola con il tastierino). I conti dietro le leve stanno in `LEVERS`: `mutuo` (rata e interessi), `carta` (debito rimborsato a cifra fissa), `piano` (versamenti regolari che rendono), `obiettivo` (risparmio senza interessi verso una cifra), `budget` (bisogni, desideri, risparmio), `inflazione` (soldi fermi mentre i prezzi salgono), `conto` (costo di un conto corrente in un anno: canone, operazioni, bollo sopra la soglia di giacenza), `garanzia` (garanzia dei depositi: conto proprio e cointestato in una banca, conto in un'altra), `netto`, `irpef` e `sconto` (stipendio 2026: dal lordo al netto, scaglioni, detrazioni e deduzioni; i conti comuni stanno in `STIP`), `tfr` (TFR lasciato in azienda), `rate` (TAEG di un acquisto a rate con spese), `quinto` (cessione del quinto), `casa` (affitto o acquisto dopo un certo numero di anni), `mutuomax` (mutuo che un reddito regge con la rata a un terzo), `surroga` (cambiare tasso e durata di un mutuo), `pensione` (montante per coefficiente di trasformazione), `fondo` (fondo pensione: versamenti, contributo del datore, costi), `tfrscelta` (TFR in azienda o nel fondo, al netto delle imposte finali), `lavoro` (occupati, disoccupati e inattivi su 100 persone), `debito` (debito pubblico sul PIL dopo dieci anni), `indice` (indice di Borsa pesato su tre società). Per una leva nuova si aggiunge il conto lì e il suo nome nel controllo di `basi_src.py`. Le ipotesi di ogni conto sono scritte nel commento sopra il modello e in `ordine/FONTI_BASI.md`; i numeri che cambiano con le leggi (scaglioni, coefficienti della pensione) vanno aggiornati lì ogni anno. La scheda di una leva mostra il numero grande, una riga sotto (`sideLab`, `side`), se serve una seconda riga (`side2Lab`, `side2`) e la barra in due pezzi (facoltativa: un modello senza `barLab` non la disegna); resta ferma in alto mentre si scorre, così su uno schermo basso si vedono insieme il numero e la leva che si sta muovendo.
- `ordine/build.sh`: unisce tutto in `ordine.js` e controlla la sintassi.

Una lezione può essere scritta in due modi: `L(...)`, con pagine e poi esercizi, oppure `LF(...)`, a passi corti che alternano pagine brevi e cose da fare (`G` stima, `LV` leve, `BK` metti a posto, `OR` ordina, `N` calcola, più le solite `Q` e `M`). Sono scritte nel secondo modo, pensato per chi parte da zero, le unità "I soldi nel tempo", "Entrate e uscite", "Lo stipendio", "La banca e i pagamenti", "Debiti e prestiti", "La casa", "Proteggersi", "Investire passo passo", "La testa dell'investitore", "La pensione" e "Capire le notizie". Restano nel primo "Gli strumenti", "Rischio, tempo e costi", "Leggere un'azienda" e "L'economia intorno". Una pagina può avere un disegno a barre (`fig=F(...)`, con `[fig]` nel testo dove deve comparire). Le parole in grassetto che stanno nel glossario (`GLOSS_DEF` in `p10_data.js`, diviso per unità) diventano parole da toccare: una parola nuova messa in grassetto in una lezione va aggiunta lì con la sua spiegazione.

Come è fatta una lezione a passi: parte da una situazione di vita reale con una stima (`G`), che fa la domanda a cui la lezione risponde; ogni parola nuova è spiegata quando compare; i numeri degli esempi tornano nei disegni e negli esercizi; le ipotesi dei conti sono scritte. Ogni pagina resta sotto i 1.000 caratteri. Una domanda (`Q`) o una stima (`G`) possono stare anche a metà lezione, tra due pagine. Nei "metti al posto giusto" con tre contenitori le voci vanno tenute corte (parole entro una decina di lettere): le colonne sono strette. Le formule in evidenza vanno tenute entro una trentina di caratteri, e le tabelle a tre colonne con celle corte: su uno schermo da 320 px il resto scorre di lato. Le lezioni che citano dati del momento (inflazione, spread, rating, requisiti della pensione) hanno in `FONTI_BASI.md` la data del controllo e quando riguardarle.

Le lezioni che spiegano regole e non solo conti (unità "La banca e i pagamenti") poggiano su leggi e dati che cambiano: ogni cifra ha la sua fonte in `ordine/FONTI_BASI.md`, con la data dell'ultimo controllo e l'elenco di che cosa va riguardato e quando.

L'ordine delle unità nel percorso è la lista `UNITS` in fondo a `basi_src.py`. Si può cambiare liberamente: i progressi sono legati alle chiavi delle lezioni (`basi-7-1`), non alla posizione.

Per cambiare una lezione o la grafica: si modifica il pezzo, si lancia `dev/ordine/build.sh`, si alza di uno il numero in `sw.js` (`CACHE`) e in `app.js` (`FL_VERSION`).

## Dove sta l'app (Cloudflare)

L'app e l'arbitro delle sfide escono dallo stesso indirizzo, da un solo Worker di Cloudflare (`finlearn-sfide`, cartella `sfide/`): oggi `https://finlearn-sfide.finlearn27.workers.dev/`.

- Che cosa viene pubblicato: solo i file che servono al telefono. Li copia `sfide/prepara-sito.mjs` nella cartella `sfide/sito/` (che non entra nel repository) ogni volta che wrangler pubblica o parte in prova. L'elenco è chiuso e sta in cima allo script: un file nuovo dell'app va aggiunto lì e, se deve funzionare senza rete, anche a `SHELL` in `sw.js`. Sorgenti, appunti e strumenti (`dev/`, `sfide/`) non escono.
- Intestazioni di sicurezza: le scrive lo stesso script nel file `_headers` (la pagina non si può mettere dentro la cornice di un altro sito, i tipi dei file non si indovinano, solo https, niente fotocamera, microfono e posizione). La regola completa su quali programmi possono girare (`script-src`, `connect-src`) si potrà mettere quando React, Tailwind, KaTeX e i caratteri saranno dentro l'app invece che presi da altri siti: oggi fermerebbe l'app.
- Pubblicare: `git push origin main`. Cloudflare (Workers Builds, collegato al repository con cartella `sfide`) ricostruisce e pubblica da solo app e arbitro. L'esito si vede su GitHub accanto al commit (controllo "Workers Builds: finlearn-sfide") oppure con `gh api repos/stefanocoran6-dotcom/app/commits/<sha>/check-runs`.
- Prova sul computer: in `sfide/` `npm install`, poi `npx wrangler dev --port 8787`. Su `http://127.0.0.1:8787/` ci sono app e arbitro insieme, come su Cloudflare. Dopo `dev/ordine/build.sh` va rilanciato `node sfide/prepara-sito.mjs`, che aggiorna la copia.
- L'indirizzo non è scritto dentro l'app: tutto è relativo alla pagina, e l'arbitro si cerca allo stesso indirizzo. Per passare a un dominio nostro basta aggiungerlo al Worker su Cloudflare. `SFIDE_HOST` in `p55_live.js` serve solo a chi apre ancora la vecchia pagina su GitHub. Attenzione: i progressi stanno nel telefono, legati all'indirizzo. Cambiare indirizzo vuol dire farli portare a mano (vedi sotto), finché non ci sono gli account veri.
- Trasloco da GitHub: l'app è nata su `…github.io/app`. Chi apre ancora quell'indirizzo vede un avviso (`useTrasloco` in `p90_app.js`) che fa scaricare i dati e apre il nuovo indirizzo; l'avviso compare solo se il nuovo indirizzo risponde davvero. Quando il repository diventa privato la vecchia pagina si spegne: a quel punto l'avviso e `…github.io` in `ORIGINI` (`sfide/wrangler.jsonc`) si possono togliere.

## I dati di chi usa l'app

Non ci sono account: tutto resta sul telefono, nella memoria del browser (voci `finlearn_…` e `fl2_…`). Chi entra diventa un utente "ospite" di quel telefono (`mockAuth.signInAsGuest` in `app.js`). Gli account di prova di una volta (email e password, «Continua con Google» che non collegava niente) non si possono più creare: le schermate sono state tolte e le password rimaste sui telefoni si cancellano all'avvio. Gli account veri arriveranno insieme a un server.

- «Scarica i miei dati» (`downloadData` in `p50_more.js`) mette in un file tutte le voci dell'app tranne quelle che non devono uscire dal telefono (`dataKeyOk`): account di prova, chiave di OpenRouter, identità del telefono nelle sfide dal vivo. Su iPhone con l'app sulla schermata Home il file passa dal foglio "Condividi", perché lì lo scaricamento diretto non è affidabile.
- «Ricarica i miei dati» in Impostazioni e «Ho già un salvataggio» nel benvenuto (`restoreData`, `RestoreInput`) leggono quel file. Il file si controlla, non si crede: al massimo 8 MB, solo voci dell'app con un valore di testo, progressi con la forma giusta (`v: 1`), utente e dati leggibili. Se qualcosa non torna non si scrive niente. I dati di prima vengono sostituiti, non mescolati; se la scrittura si ferma a metà si torna com'era.
- «Cancella tutti i dati» toglie dal telefono tutte le voci `finlearn_…` e `fl2_…`. Restano solo lingua e paese.
- All'avvio un valore rovinato (utente o dati che non si leggono) non ferma l'app: vale come "non c'è".

## Domande generate e «La serie»

- `ordine/p44_motore.js`: il motore. Codice puro (niente schermo, memoria o rete), così lo stesso file potrà servire all'arbitro delle sfide. `GEN.crea(tipo, seme)` dà il nucleo di una domanda (numeri, risposte, posizione della giusta: uguale in tutte le lingue); `GEN.testo(nucleo, lingua, valuta)` la scrive in italiano o in inglese. Dallo stesso seme esce sempre la stessa domanda.
- Stampi di calcolo (`STAMPI`): `par` sceglie i numeri, `ok` calcola la risposta giusta, `err` sono gli errori tipici da cui nascono le risposte sbagliate, ognuno con la sua riga di spiegazione. Le risposte troppo vicine tra loro vengono scartate (`FORMA`).
- Fatti (`PERSONE`, `EVENTI`, `MONETE`, `INDICI`): ogni riga è scritta in tutte le lingue e ha la fonte in `ordine/FONTI_GIOCHI.md`.
- Uno stampo o un fatto nuovo si aggiunge lì, in tutte le lingue; per uno stampo va aggiunto anche il secondo conto in `giochi/ricalcola.py`. Poi `node dev/giochi/collauda.mjs && python3 dev/giochi/ricalcola.py`: genera 10.000 domande per tipo, controlla che la giusta sia una sola, che le risposte siano diverse e distanti, che italiano e inglese abbiano gli stessi numeri, e rifà i conti con un programma scritto a parte. Devono finire tutti e due con zero guai.
- `ordine/p45_serie.js`: il gioco «La serie» (Allenati): domande senza fine, tre errori e si chiude; il record sta in `serie.best` dei dati salvati. Si apre con `nav.go('pratica', { mode: 'serie' })`.
- In inglese i testi del motore non passano dal dizionario `en/ui_en.txt`: `compila.mjs` salta `GEN`, che ha già dentro le sue lingue.

## Notizie

Tre file, nessuno dentro il codice:

- `notizie.json`: le notizie del giorno, quelle che scorrono sul nastro in home.
- `notizie/indice.json`: l'elenco leggero di tutti gli articoli, per la pagina "Tutte le notizie".
- `notizie/AAAA-MM.json`: i testi completi, un file per mese.

L'app li scarica quando servono: per pubblicare notizie nuove non si ricostruisce `ordine.js` e non si alza la versione. Si scrive `notizie.json`, si lancia `python3 dev/notizie_pubblica.py` (controlla i testi, aggiorna il mese e l'elenco) e si fa il commit.

Come si scelgono, si verificano e si scrivono le notizie è in `NOTIZIE.md`: è la procedura che segue anche l'aggiornamento automatico del mattino.

Nei paragrafi le parole in `**grassetto**` che stanno nel glossario (`GLOSS_DEF` in `ordine/p10_data.js`) si aprono con un tocco, come nelle lezioni. Il nastro, la pagina dell'articolo e l'archivio sono in `ordine/p37_news.js`; gli articoli letti restano segnati nella memoria del telefono (`fl2_news_letti`).

## Formule

Ogni formula, anche una sola lettera usata come variabile, si scrive in LaTeX: in mezzo al testo tra `\(` e `\)`, su una riga a sé tra `$$` e `$$` (anche più righe con `\begin{aligned}`). Le regole usate in tutti i contenuti:

- frazioni con `\dfrac` in mezzo al testo e `\frac` nelle formule su riga a sé;
- sigle e parole dentro `\text{}` (`\text{FCFF}`, `\text{P/E}`, `\text{EPS}_t`), lettere singole in corsivo (`r`, `g`, `D_1`);
- meno `-`, per `\times`, circa `\approx`, lettere greche come comandi (`\sigma`, `\beta`);
- percentuale `\%`, virgola decimale `{,}` (`0{,}5`);
- in una formula che lega grandezze a parole va tutto in LaTeX (`\(\text{EV} = \text{equity} + \text{debito} - \text{cassa}\)`); una definizione a parole ("\(H\) = metà del periodo") resta testo.

L'app spezza da sola le formule lunghe in mezzo al testo dopo `=`, `+`, `-`, `\times`, così su un telefono vanno a capo; le formule su riga a sé che sono appena più larghe dello schermo vengono rimpicciolite fino al 70%, oltre si scorrono di lato. Una formula su riga a sé conviene tenerla entro circa 35 caratteri visibili per riga, andando a capo con `aligned`.

## AI Coach con OpenRouter

Ogni studente collega il suo account OpenRouter: nell'app non c'è nessuna chiave e non c'è un server nostro. Il Coach usa solo OpenRouter: i vecchi motori (Claude, "Sul telefono", Ollama) non si scelgono più; il modello si cambia dal tasto "Modello" nella chat o da Impostazioni. Il codice sta in `app.js`, nel blocco `OPENROUTER` sopra `AiChatModal`.

- Collegamento (OAuth con PKCE): `flOR.start()` salva verificatore e `state` (`finlearn_or_pkce`) e apre `openrouter.ai/auth` con `callback_url` = la pagina dell'app. OpenRouter rimanda con `?code=…`: `FL_OR_BOOT` toglie subito il codice dall'indirizzo e `FlOrReturn` lo scambia con la chiave (`POST /api/v1/auth/keys` con il verificatore). La chiave sta in `finlearn_or_key`, solo su quel dispositivo; «Scollega» e «Cancella tutti i dati» la tolgono.
- Dove tornare: `start()` riceve dove si era (`{ tab, chat }`, `{ lesson, at, chat }` o `{ screen: 'impostazioni' }`) e `p90_app.js` lo riapre quando torna la chiave.
- Domande: `flOR.chat()` manda a `/api/v1/chat/completions` con `stream: true` e legge la risposta a pezzi. Chi sceglie un modello riceve la risposta sempre da quello: non ci sono modelli di riserva (se è occupato si vede l'errore). Il modello di partenza è `openrouter/free` (OpenRouter sceglie un modello gratis); lo studente può sceglierne un altro in Impostazioni → AI Coach → Modello (`finlearn_or_model`). Con l'interruttore "Solo fornitori che non tengono le domande" si aggiunge `provider: { data_collection: 'deny' }`.
- Risposte: `flAiTidy` porta il markdown dei modelli alle regole di `RichText` (titoli → grassetto, trattini → •, `$…$` → `\(…\)`, `\[…\]` → `$$…$$`, via HTML e link cliccabili). Le istruzioni del modello (`getSystemPrompt` + `FL_AI_FORMAT`) chiedono le stesse regole delle formule scritte sopra.
- Errori: `flOrMsg` li spiega in italiano (limite dei modelli gratis, crediti, privacy, modello non disponibile); con una chiave non più valida (401) l'app la toglie e torna "Collega OpenRouter".
- Nelle lezioni il tasto in alto a destra apre la chat sulla pagina che si sta leggendo (una chat per pagina, che si riapre). Nel file di "Scarica i miei dati" la chiave non c'è.
- `sw.js` non mette mai in cache le richieste a openrouter.ai, né le pagine con parametri (il ritorno con `?code=`).

## Sfide dal vivo (Lampo)

Due telefoni giocano le stesse 5 domande nello stesso momento. In mezzo c'è un arbitro su Cloudflare (cartella `sfide/`): un Worker con una "stanza" (Durable Object) per ogni sfida, lo stesso Worker che pubblica l'app. L'app non contiene chiavi; l'arbitro accetta collegamenti solo dalla pagina che esce dal suo stesso indirizzo e dagli indirizzi scritti in `ORIGINI` (`sfide/wrangler.jsonc`).

- Regole: il punto va a chi risponde giusto per primo. Chi sbaglia perde un punto e per quella domanda è fermo, l'altro può ancora rispondere. Due risposte giuste a meno di 5 centesimi l'una dall'altra fanno pari (un punto a testa). Tempo per domanda: 24 secondi (`SECONDI` nell'arbitro, uno per percorso; oggi c'è solo quello delle Basi).
- Il tempo lo misura il telefono (`p55_live.js`), da quando la domanda compare sullo schermo al tocco: chi ha la rete lenta non è penalizzato. L'arbitro lo accetta solo se è credibile: non può essere più corto del tempo passato davvero meno il ping più basso misurato per quel telefono e 0,15 s di margine. Dopo la prima risposta giusta la domanda resta aperta ancora un attimo (il ping dell'altro più 0,1 s, tra 0,3 e 1,2 s) per le risposte già in viaggio.
- Le domande con le risposte giuste le ha l'arbitro (`sfide/src/domande.json`, scritto da `sfide/estrai-domande.mjs`, che `dev/ordine/build.sh` lancia ogni volta). Al telefono arrivano testo e risposte, la giusta solo dopo.
- Lingue: ogni telefono dice all'arbitro la lingua della sua app (`lang` nel saluto; chi non la dice è in italiano) e riceve domanda, risposte e spiegazione in quella lingua. Per le Basi il testo inglese viene da `dev/en/basi_en.json` (campo `en` in `domande.json`) e vale solo se ha le stesse risposte nello stesso ordine: così la giusta è la stessa per tutti. Se uno dei due gioca in inglese si pescano solo le domande che hanno anche l'inglese (99 su 156). Una sfida su un percorso che l'arbitro non ha (per esempio da un'app vecchia) viene rifiutata con l'invito ad aggiornare. Chi ha scelto gli Stati Uniti vede i dollari al posto degli euro (`usDollars`, come nelle lezioni), tranne nelle domande con `eu` (lezioni con una variante americana, dove l'euro è proprio l'euro). I messaggi di errore dell'arbitro sono in italiano: l'app usa i suoi (`LIVE_ERR`), scelti dal codice dell'errore.
- Stanza: codice di 6 caratteri senza I, O, 0 e 1. Il link `…/#sfida=CODICE` apre l'app nella stanza (il codice si toglie subito dall'indirizzo). Ogni telefono ha un codice segreto per stanza (`finlearn_sfide_pid`) per rientrare nello stesso posto se cade la rete; la stanza tiene lo stato nel suo salvataggio, così sopravvive anche a un riavvio. Si chiude da sola: 15 minuti senza avversario, 5 minuti dopo la fine, un'ora al massimo. Alla chiusura si cancella tutto.
- Limiti: al massimo due giocatori, 15 messaggi al secondo per telefono, messaggi corti, nomi ripuliti (20 caratteri, niente caratteri invisibili).
- Indirizzo: l'app cerca l'arbitro allo stesso indirizzo della pagina (`SFIDE_WS` in `p55_live.js`); dalla vecchia pagina su GitHub lo cerca su `SFIDE_HOST` (`finlearn-sfide.finlearn27.workers.dev`), in prova sul computer su `ws://127.0.0.1:8787`.
- Prova sul computer: vedi "Dove sta l'app". Se l'app viene servita da un'altra porta (non da wrangler), serve in `sfide/` un file `.dev.vars` con `ORIGINI=http://127.0.0.1:<porta>` (non va pubblicato).
- Pubblicazione: insieme all'app, a ogni `git push` su `main`. Se cambiano i messaggi tra app e arbitro va alzato `SFIDE_V` / `VERSIONE` in tutti e due.

## Su misura (obiettivo e percorso)

Alla registrazione si sceglie che cosa fare con l'app (da zero, investire, lavoro) e da dove si parte. Da lì dipende che cosa mostrano tutte le schede. Oggi c'è un solo percorso scritto, le Basi; i percorsi professionali (valutare le azioni, obbligazioni e tassi…) entreranno come corsi nuovi in `courses()` e, da "Scopri", come percorsi da aggiungere.

- Il modello sta in `dev/ordine/p10_data.js`, blocco "su misura": `MIS_PATHS` dice, per ogni obiettivo, il corso e le unità in ordine (`stops`). Un nome che comincia con `+` è un'unità ancora da scrivere, mostrata come "in arrivo" (testi in `MIS_SOON`).
- Scopri (`CatalogScreen` in `p50_more.js`) mostra i percorsi della propria app e, sotto, tutte le materie divise in cinque categorie che si aprono: l'elenco è `MATERIE` in `p10_data.js`. Una voce è un corso che c'è già (`{ course }`), una materia in arrivo (`{ name, sub }`) o una materia in arrivo con la scheda (`{ id, levels }`, schermata `schedaMateria` → `MateriaScreen`: livelli e capitoli, ogni capitolo è una domanda). Le categorie stanno solo in Scopri: la home mostra solo i percorsi scelti. Quando un capitolo è scritto entra come corso vero in `courses()` e la voce diventa `{ course }`.
- **Materie a capitoli (da v59).** «Azioni» è il primo corso nuovo (`AZIONI` in `p10_data.js`, id `azioni`, `chapters: true`). Le lezioni stanno in `dev/ordine/azioni_c5a.py` … `azioni_c5f.py` (una parte del capitolo per file), i numeri della storia con i loro controlli in `azioni_dati.py`; `azioni_src.py` le mette insieme (attrezzi e controlli in `lezioni_lib.py`) e arrivano nell'app come `AZIONI_UNITS`, accanto a `BASI_UNITS`. Un capitolo è un'unità con il suo numero (`num`): nell'app si vede «Capitolo 5 di 10», e i capitoli non ancora scritti compaiono «in arrivo» (`chapterStops`, nomi in `AZIONI_L`). Storia, numeri e regole di scrittura: `dev/ordine/AZIONI.md`.
  - Pezzi nati con i capitoli: riquadro «Per andare a fondo» (`deep` di una pagina → `Deep` in `p35_steps.js`); disegni `card` (la scheda dell'azienda), `bridge` (il ponte) e `ticks` (le tacche) e `range` (il campo delle stime: punti e intervalli sulla stessa scala, con il prezzo segnato) accanto alle barre (`Fig`); «Prima di cominciare» (`pre` del capitolo → `PreCard` in `p30_learn.js`); leve `pecresc`, `leva`, `unanno`, `gordon`, `sostenibile` (`LEVERS`).
  - **Parti di un capitolo (da v60).** Un capitolo lungo è diviso in parti (`parts` in `azioni_src.py`): nell'app ogni parte è una sezione dell'unità, con il suo nome («Parte 2 di 5»), la sua verifica e, se c'è, il suo laboratorio (`lab` della parte). Le lezioni si contano dall'inizio del capitolo. La risposta giusta delle domande viene distribuita tra A, B e C da `bilancia` (`lezioni_lib.py`), sempre allo stesso modo.
  - Laboratorio di calcolo: `LabRun` in `p45_serie.js`, aperto con `nav.go('pratica', { mode: 'lab', lab })`. Pesca gli stampi del motore che hanno `lab` uguale a quello della parte (8 conti per giro, numeri sempre diversi; il capitolo 5 ne ha due, `multipli` e `flussi`); la Serie non li usa. Il risultato migliore sta in `fl2_state.labs`.
  - Dalla scheda in Scopri (`MateriaScreen`) la materia si aggiunge ai propri percorsi come ogni corso (`misAddCourse`): in home compare tra i percorsi.
  - Inglese: i capitoli non sono tradotti. `compila.mjs` mette `AZIONI_UNITS = []`, quindi il corso non c'è e in Scopri la materia resta «Up next». Quando ci sarà `dev/en/azioni_en.json` entra da solo.
- Lo stato salvato è `mis` dentro `fl2_state`: `goal`, `level`, `known` (unità "la sai già"), `more` (unità aggiunte al percorso), `add` (percorsi aggiunti interi).
- Le schede non leggono più `courses()` direttamente: usano `misCourses()`, `misUnits(c)`, `misLessons(c)`, `misStops(c)`, `misName(c)`. Chi aggiunge una scheda nuova deve fare lo stesso, altrimenti un percorso aggiunto dopo comparirebbe a tutti, anche a chi non l'ha scelto.
- Le 5 domande della registrazione (`placementFor`, `placementKnown`) segnano come note le prime unità con tutte le risposte giuste. Le unità note contano nel percorso (`isHad`), ma la figurina si prende solo facendo la lezione (`isDone`).
- Chi usava l'app prima riceve un percorso ricavato da quello che aveva scelto o iniziato (`misDerive`). Chi aveva scelto "preparare un esame" passa al percorso da zero: quello che aveva fatto resta scritto sul telefono, ma il percorso d'esame non c'è più.
- Quando un'unità "in arrivo" viene scritta: aggiungerla alle Basi in `basi_src.py`, poi sostituire il suo `+nome` in `stops` con l'id dell'unità.
- La registrazione è in `dev/ordine/p60_start.js` (`OrdineWelcome`). Prima dell'accesso i dati dei percorsi arrivano da `app.js` con la proprietà `pre`.

