# Sorgenti di lavoro

Questa cartella non serve all'app in funzione: contiene i pezzi da cui si ricostruisce `ordine.js`, la nuova grafica "In ordine".

- `ordine/p00_base.js` … `p90_app.js`: i pezzi del codice, nell'ordine in cui vengono uniti (base e stili, dati, componenti, Impara, passi interattivi, Allenati, Sfide e Profilo, apertura, app).
- `ordine/basi_src.py`: le lezioni del percorso "Basi della finanza". Si scrivono qui, una per blocco, con pagine, frase "In breve" ed esercizi. Lo script controlla la forma (chiavi uniche, tre risposte per domanda, una domanda per lezione) e scrive `basi.json`.
- `ordine/p35_steps.js`: i passi interattivi delle lezioni (stima prima di leggere, leve con un obiettivo, metti al posto giusto, metti in ordine, calcola con il tastierino). I conti dietro le leve stanno in `LEVERS`.
- `ordine/build.sh`: unisce tutto in `ordine.js` e controlla la sintassi.

Una lezione può essere scritta in due modi: `L(...)`, con pagine e poi esercizi, oppure `LF(...)`, a passi corti che alternano pagine brevi e cose da fare (`G` stima, `LV` leve, `BK` metti a posto, `OR` ordina, `N` calcola, più le solite `Q` e `M`). L'unità "Debiti e prestiti" è scritta nel secondo modo. Una pagina può avere un disegno a barre (`fig=F(...)`, con `[fig]` nel testo dove deve comparire). Le parole in grassetto che stanno nel glossario (`GLOSS_DEF` in `p10_data.js`) diventano parole da toccare.

Per cambiare una lezione o la grafica: si modifica il pezzo, si lancia `dev/ordine/build.sh`, si alza di uno il numero in `sw.js` (`CACHE`) e in `app.js` (`FL_VERSION`).
