# Sorgenti di lavoro

Questa cartella non serve all'app in funzione: contiene i pezzi da cui si ricostruisce `ordine.js`, la nuova grafica "In ordine".

- `ordine/p00_base.js` … `p90_app.js`: i pezzi del codice, nell'ordine in cui vengono uniti (base e stili, dati, componenti, Impara, passi interattivi, notizie, Allenati, Sfide e Profilo, apertura, app).
- `ordine/basi_src.py`: le lezioni del percorso "Basi della finanza". Si scrivono qui, una per blocco, con pagine, frase "In breve" ed esercizi. Lo script controlla la forma (chiavi uniche, tre risposte per domanda, una domanda per lezione) e scrive `basi.json`.
- `ordine/p35_steps.js`: i passi interattivi delle lezioni (stima prima di leggere, leve con un obiettivo, metti al posto giusto, metti in ordine, calcola con il tastierino). I conti dietro le leve stanno in `LEVERS`: `mutuo` (rata e interessi), `carta` (debito rimborsato a cifra fissa), `piano` (versamenti regolari che rendono), `obiettivo` (risparmio senza interessi verso una cifra), `budget` (bisogni, desideri, risparmio), `inflazione` (soldi fermi mentre i prezzi salgono). Per una leva nuova si aggiunge il conto lì e il suo nome nel controllo di `basi_src.py`.
- `ordine/build.sh`: unisce tutto in `ordine.js` e controlla la sintassi.

Una lezione può essere scritta in due modi: `L(...)`, con pagine e poi esercizi, oppure `LF(...)`, a passi corti che alternano pagine brevi e cose da fare (`G` stima, `LV` leve, `BK` metti a posto, `OR` ordina, `N` calcola, più le solite `Q` e `M`). Sono scritte nel secondo modo, pensato per chi parte da zero, le unità "I soldi nel tempo", "Entrate e uscite", "Debiti e prestiti", "Proteggersi", "Investire passo passo" e "La testa dell'investitore". Restano nel primo "Gli strumenti", "Rischio, tempo e costi", "Leggere un'azienda" e "L'economia intorno". Una pagina può avere un disegno a barre (`fig=F(...)`, con `[fig]` nel testo dove deve comparire). Le parole in grassetto che stanno nel glossario (`GLOSS_DEF` in `p10_data.js`, diviso per unità) diventano parole da toccare: una parola nuova messa in grassetto in una lezione va aggiunta lì con la sua spiegazione.

Come è fatta una lezione a passi: parte da una situazione di vita reale con una stima (`G`), che fa la domanda a cui la lezione risponde; ogni parola nuova è spiegata quando compare; i numeri degli esempi tornano nei disegni e negli esercizi; le ipotesi dei conti sono scritte. Ogni pagina resta sotto i 1.000 caratteri.

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
