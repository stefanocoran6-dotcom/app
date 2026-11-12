# Sorgenti di lavoro

Questa cartella non serve all'app in funzione: contiene i pezzi da cui si ricostruisce `ordine.js`, la nuova grafica "In ordine".

- `ordine/p00_base.js` … `p90_app.js`: i pezzi del codice, nell'ordine in cui vengono uniti (base e stili, dati, componenti, Impara, passi interattivi, notizie, Allenati, Sfide e Profilo, apertura, app).
- `ordine/basi_src.py`: le lezioni del percorso "Basi della finanza". Si scrivono qui, una per blocco, con pagine, frase "In breve" ed esercizi. Lo script controlla la forma (chiavi uniche, tre risposte per domanda, una domanda per lezione) e scrive `basi.json`.
- `ordine/p35_steps.js`: i passi interattivi delle lezioni (stima prima di leggere, leve con un obiettivo, metti al posto giusto, metti in ordine, calcola con il tastierino). I conti dietro le leve stanno in `LEVERS`: `mutuo` (rata e interessi), `carta` (debito rimborsato a cifra fissa), `piano` (versamenti regolari che rendono), `obiettivo` (risparmio senza interessi verso una cifra), `budget` (bisogni, desideri, risparmio), `inflazione` (soldi fermi mentre i prezzi salgono), `conto` (costo di un conto corrente in un anno: canone, operazioni, bollo sopra la soglia di giacenza), `garanzia` (garanzia dei depositi: conto proprio e cointestato in una banca, conto in un'altra), `netto`, `irpef` e `sconto` (stipendio 2026: dal lordo al netto, scaglioni, detrazioni e deduzioni; i conti comuni stanno in `STIP`), `tfr` (TFR lasciato in azienda), `rate` (TAEG di un acquisto a rate con spese), `quinto` (cessione del quinto), `casa` (affitto o acquisto dopo un certo numero di anni), `mutuomax` (mutuo che un reddito regge con la rata a un terzo), `surroga` (cambiare tasso e durata di un mutuo), `pensione` (montante per coefficiente di trasformazione), `fondo` (fondo pensione: versamenti, contributo del datore, costi), `tfrscelta` (TFR in azienda o nel fondo, al netto delle imposte finali), `lavoro` (occupati, disoccupati e inattivi su 100 persone), `debito` (debito pubblico sul PIL dopo dieci anni), `indice` (indice di Borsa pesato su tre società). Per una leva nuova si aggiunge il conto lì e il suo nome nel controllo di `basi_src.py`. Le ipotesi di ogni conto sono scritte nel commento sopra il modello e in `ordine/FONTI_BASI.md`; i numeri che cambiano con le leggi (scaglioni, coefficienti della pensione) vanno aggiornati lì ogni anno. La scheda di una leva mostra il numero grande, una riga sotto (`sideLab`, `side`), se serve una seconda riga (`side2Lab`, `side2`) e la barra in due pezzi (facoltativa: un modello senza `barLab` non la disegna); resta ferma in alto mentre si scorre, così su uno schermo basso si vedono insieme il numero e la leva che si sta muovendo.
- `ordine/build.sh`: unisce tutto in `ordine.js` e controlla la sintassi.

Una lezione può essere scritta in due modi: `L(...)`, con pagine e poi esercizi, oppure `LF(...)`, a passi corti che alternano pagine brevi e cose da fare (`G` stima, `LV` leve, `BK` metti a posto, `OR` ordina, `N` calcola, più le solite `Q` e `M`). Sono scritte nel secondo modo, pensato per chi parte da zero, le unità "I soldi nel tempo", "Entrate e uscite", "Lo stipendio", "La banca e i pagamenti", "Debiti e prestiti", "La casa", "Proteggersi", "Investire passo passo", "La testa dell'investitore", "La pensione" e "Capire le notizie". Restano nel primo "Gli strumenti", "Rischio, tempo e costi", "Leggere un'azienda" e "L'economia intorno". Una pagina può avere un disegno a barre (`fig=F(...)`, con `[fig]` nel testo dove deve comparire). Le parole in grassetto che stanno nel glossario (`GLOSS_DEF` in `p10_data.js`, diviso per unità) diventano parole da toccare: una parola nuova messa in grassetto in una lezione va aggiunta lì con la sua spiegazione.

Come è fatta una lezione a passi: parte da una situazione di vita reale con una stima (`G`), che fa la domanda a cui la lezione risponde; ogni parola nuova è spiegata quando compare; i numeri degli esempi tornano nei disegni e negli esercizi; le ipotesi dei conti sono scritte. Ogni pagina resta sotto i 1.000 caratteri. Una domanda (`Q`) o una stima (`G`) possono stare anche a metà lezione, tra due pagine. Nei "metti al posto giusto" con tre contenitori le voci vanno tenute corte (parole entro una decina di lettere): le colonne sono strette. Le formule in evidenza vanno tenute entro una trentina di caratteri, e le tabelle a tre colonne con celle corte: su uno schermo da 320 px il resto scorre di lato. Le lezioni che citano dati del momento (inflazione, spread, rating, requisiti della pensione) hanno in `FONTI_BASI.md` la data del controllo e quando riguardarle.

Le lezioni che spiegano regole e non solo conti (unità "La banca e i pagamenti") poggiano su leggi e dati che cambiano: ogni cifra ha la sua fonte in `ordine/FONTI_BASI.md`, con la data dell'ultimo controllo e l'elenco di che cosa va riguardato e quando.

L'ordine delle unità nel percorso è la lista `UNITS` in fondo a `basi_src.py`. Si può cambiare liberamente: i progressi sono legati alle chiavi delle lezioni (`basi-7-1`), non alla posizione.

Per cambiare una lezione o la grafica: si modifica il pezzo, si lancia `dev/ordine/build.sh`, si alza di uno il numero in `sw.js` (`CACHE`) e in `app.js` (`FL_VERSION`).

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

- Collegamento (OAuth con PKCE): `flOR.start()` salva verificatore e `state` (`finlearn_or_pkce`) e apre `openrouter.ai/auth` con `callback_url` = la pagina dell'app. OpenRouter rimanda con `?code=…`: `FL_OR_BOOT` toglie subito il codice dall'indirizzo e `FlOrReturn` lo scambia con la chiave (`POST /api/v1/auth/keys` con il verificatore). La chiave sta in `finlearn_or_key`, solo su quel dispositivo; uscire dall'account la toglie.
- Dove tornare: `start()` riceve dove si era (`{ tab, chat }`, `{ lesson, at, chat }` o `{ screen: 'impostazioni' }`) e `p90_app.js` lo riapre quando torna la chiave.
- Domande: `flOR.chat()` manda a `/api/v1/chat/completions` con `stream: true` e legge la risposta a pezzi. Il modello di partenza è `openrouter/free` (OpenRouter sceglie un modello gratis); lo studente può sceglierne un altro in Impostazioni → AI Coach → Modello (`finlearn_or_model`). Con l'interruttore "Solo fornitori che non tengono le domande" si aggiunge `provider: { data_collection: 'deny' }`.
- Risposte: `flAiTidy` porta il markdown dei modelli alle regole di `RichText` (titoli → grassetto, trattini → •, `$…$` → `\(…\)`, `\[…\]` → `$$…$$`, via HTML e link cliccabili). Le istruzioni del modello (`getSystemPrompt` + `FL_AI_FORMAT`) chiedono le stesse regole delle formule scritte sopra.
- Errori: `flOrMsg` li spiega in italiano (limite dei modelli gratis, crediti, privacy, modello non disponibile); con una chiave non più valida (401) l'app la toglie e torna "Collega OpenRouter".
- Nelle lezioni il tasto in alto a destra apre la chat sulla pagina che si sta leggendo (una chat per pagina, che si riapre). Nel file di "Scarica i miei dati" la chiave non c'è.
- `sw.js` non mette mai in cache le richieste a openrouter.ai, né le pagine con parametri (il ritorno con `?code=`).

## Sfide dal vivo (Lampo)

Due telefoni giocano le stesse 5 domande nello stesso momento. In mezzo c'è un arbitro su Cloudflare (cartella `sfide/`): un Worker con una "stanza" (Durable Object) per ogni sfida. L'app non contiene chiavi; l'arbitro accetta collegamenti solo dal sito dell'app (`ORIGINI` in `sfide/wrangler.jsonc`).

- Regole: il punto va a chi risponde giusto per primo. Chi sbaglia perde un punto e per quella domanda è fermo, l'altro può ancora rispondere. Due risposte giuste a meno di 5 centesimi l'una dall'altra fanno pari (un punto a testa). Tempo per domanda: 24 secondi le Basi, 45 il CFA Level II.
- Il tempo lo misura il telefono (`p55_live.js`), da quando la domanda compare sullo schermo al tocco: chi ha la rete lenta non è penalizzato. L'arbitro lo accetta solo se è credibile: non può essere più corto del tempo passato davvero meno il ping più basso misurato per quel telefono e 0,15 s di margine. Dopo la prima risposta giusta la domanda resta aperta ancora un attimo (il ping dell'altro più 0,1 s, tra 0,3 e 1,2 s) per le risposte già in viaggio.
- Le domande con le risposte giuste le ha l'arbitro (`sfide/src/domande.json`, scritto da `sfide/estrai-domande.mjs`, che `dev/ordine/build.sh` lancia ogni volta). Al telefono arrivano testo e risposte, la giusta solo dopo.
- Stanza: codice di 6 caratteri senza I, O, 0 e 1. Il link `…/app/#sfida=CODICE` apre l'app nella stanza (il codice si toglie subito dall'indirizzo). Ogni telefono ha un codice segreto per stanza (`finlearn_sfide_pid`) per rientrare nello stesso posto se cade la rete; la stanza tiene lo stato nel suo salvataggio, così sopravvive anche a un riavvio. Si chiude da sola: 15 minuti senza avversario, 5 minuti dopo la fine, un'ora al massimo. Alla chiusura si cancella tutto.
- Limiti: al massimo due giocatori, 15 messaggi al secondo per telefono, messaggi corti, nomi ripuliti (20 caratteri, niente caratteri invisibili).
- Indirizzo: `SFIDE_HOST` in `p55_live.js` (`finlearn-sfide.finlearn27.workers.dev`). Finché c'è `SOTTODOMINIO` la scheda Sfide non mostra la sfida dal vivo. In prova sul computer l'app usa `ws://127.0.0.1:8787`.
- Prova sul computer: in `sfide/` `npm install`, poi `npx wrangler dev --port 8787` con un file `.dev.vars` che contiene `ORIGINI=http://127.0.0.1:8765` (non va pubblicato).
- Pubblicazione: su Cloudflare (piano gratuito) si crea un Worker chiamato `finlearn-sfide` collegato a questo repository, con cartella `sfide`. A ogni pubblicazione su `main` Cloudflare aggiorna l'arbitro da solo. Se cambiano i messaggi tra app e arbitro va alzato `SFIDE_V` / `VERSIONE` in tutti e due.

## Su misura (obiettivo e percorso)

Alla registrazione si sceglie che cosa fare con l'app (da zero, investire, lavoro, esame) e da dove si parte. Da lì dipende che cosa mostrano tutte le schede: chi non prepara un esame non trova il CFA finché non lo aggiunge da "Scopri".

- Il modello sta in `dev/ordine/p10_data.js`, blocco "su misura": `MIS_PATHS` dice, per ogni obiettivo, il corso e le unità in ordine (`stops`). Un nome che comincia con `+` è un'unità ancora da scrivere, mostrata come "in arrivo" (testi in `MIS_SOON`).
- Lo stato salvato è `mis` dentro `fl2_state`: `goal`, `level`, `known` (unità "la sai già"), `more` (unità aggiunte al percorso), `add` (percorsi aggiunti interi).
- Le schede non leggono più `courses()` direttamente: usano `misCourses()`, `misUnits(c)`, `misLessons(c)`, `misStops(c)`, `misName(c)`. Chi aggiunge una scheda nuova deve fare lo stesso, altrimenti il CFA torna a comparire ai principianti.
- Le 5 domande della registrazione (`placementFor`, `placementKnown`) segnano come note le prime unità con tutte le risposte giuste. Le unità note contano nel percorso (`isHad`), ma la figurina si prende solo facendo la lezione (`isDone`).
- Chi usava l'app prima di questa versione riceve un percorso ricavato da quello che aveva scelto o iniziato (`misDerive`): i percorsi iniziati restano tutti.
- Quando un'unità "in arrivo" viene scritta: aggiungerla alle Basi in `basi_src.py`, poi sostituire il suo `+nome` in `stops` con l'id dell'unità.
- La registrazione è in `dev/ordine/p60_start.js` (`OrdineWelcome`). Prima dell'accesso i dati dei percorsi arrivano da `app.js` con la proprietà `pre`.

