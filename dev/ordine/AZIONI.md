# Materia «Azioni»: la storia, i numeri, le regole

Tutto quello che serve per scrivere un capitolo nuovo senza perdere il filo. Le lezioni stanno in `azioni_src.py`; gli attrezzi comuni (pagine, disegni, passi da fare, controlli) in `lezioni_lib.py`.

## La forma

- **Materia → Capitolo → Lezione.** Un capitolo è una domanda che si fa Nora. Dentro l'app un capitolo è un'unità del corso `azioni`, con il suo numero (`num`).
- **Lezione da 5-8 minuti**, a passi: la situazione, il concetto, la formula a lettere con la legenda, l'esempio svolto con i numeri della storia, tre esercizi.
- **«Per andare a fondo»**: un riquadro chiuso sotto una pagina (`deep=` in `P(...)`). Chi lo salta non perde il filo.
- **Fine capitolo**: una lezione-caso (domande con gli stessi dati, sotto la linguetta «Il caso»), il **laboratorio di calcolo** (numeri sempre diversi, stampi con `lab` in `p44_motore.js`) e la verifica.
- **Capitoli indipendenti**: ognuno dice quali unità delle Basi dà per scontate (`pre=` del capitolo) e ripresenta in due righe Nora e Velonda.
- I capitoli escono uno alla volta. Quelli non scritti si vedono «in arrivo»: i nomi stanno in `AZIONI_L` (`p10_data.js`).

## Che cosa è nostro

Gli argomenti sono quelli di ogni manuale di valutazione (multipli, valore d'impresa, flussi scontati). Sono nostri: la scaletta a domande, la storia, i numeri, gli esempi, gli esercizi, le parole.
Non si copiano né si traducono testi, esempi o domande di altri (manuali, dispense, programmi d'esame). Nessun nome di certificazione nei testi. Formule e definizioni si ricontrollano sulle fonti in fondo.

## La storia

- **Nora**, 29 anni, va al lavoro in bici elettrica. Ha 3.000 € da parte e vuole capire se comprare azioni dell'azienda che ha fatto la sua bici. Ogni capitolo è una sua domanda.
- **Velonda**: azienda italiana **inventata**, produce bici da città ed elettriche, quotata in Borsa. È la protagonista di tutti i capitoli.
- **Pedalta** e **Nordciclo**: i due concorrenti quotati, **inventati**. Pedalta è piccola, rende molto e costa cara; Nordciclo è grande, rende poco, è piena di debiti e costa poco.
- Nelle lezioni va detto che sono aziende inventate (lo dice la prima pagina del capitolo 5).
- Il capitolo 5 finisce così: per Nora 12 € è un prezzo onesto. Il capitolo 6 riparte da «come la compro?».

## I numeri (milioni di euro, tranne prezzo e azioni)

Stanno in `AZ` dentro `azioni_src.py`, con i controlli: se una cifra cambia, il programma dice dove i conti non tornano.

| | Velonda | Pedalta | Nordciclo |
|---|---|---|---|
| Prezzo di un'azione (€) | 12 | 45 | 4,20 |
| Azioni (milioni) | 20 | 4 | 50 |
| Capitalizzazione | 240 | 180 | 210 |
| Ricavi | 300 | 120 | 525 |
| Risultato operativo (EBIT) | 24 | 12,5 | 38 |
| Interessi (5% dei debiti) | 4 | 0,5 | 10 |
| Imposte (25%) | 5 | 3 | 7 |
| Utile netto | 15 | 9 | 21 |
| Patrimonio netto | 120 | 45 | 300 |
| Debiti finanziari | 80 | 10 | 200 |
| Cassa | 20 | 20 | 30 |
| Utile per azione (€) | 0,75 | 2,25 | 0,42 |
| P/E | 16 | 20 | 10 |
| P/B | 2 | 4 | 0,7 |
| P/S | 0,8 | 1,5 | 0,4 |
| Valore d'impresa (EV) | 300 | 170 | 380 |
| EV / risultato operativo | 12,5 | 13,6 | 10 |
| ROE | 12,5% | 20% | 7% |
| Margine netto | 5% | 7,5% | 4% |
| Crescita attesa degli utili | 8% | 15% | 2% |

Solo Velonda: ammortamenti 6, EBITDA 30 (EV/EBITDA 10); dividendo 0,30 € per azione (40% dell'utile, 2,5% del prezzo); debiti in tutto 130 (80 finanziari più 50 verso fornitori e altri); attività nei conti 250, ai prezzi di oggi 290, vendute in fretta 200.

Cifre già usate nel capitolo 5, da non contraddire:
- valore di liquidazione 3,50 € per azione; valore «dei pezzi» 8 € per azione;
- un analista stima 15 € (margine di sicurezza 20%); un grande gruppo offre 15 € per azione (premio di controllo 25%);
- Nora: dividendo atteso 0,30 €, prezzo atteso tra un anno 13,45 €, rendimento richiesto 10% → valore 12,50 €;
- metodo del confronto: media dei P/E dei concorrenti 15 → 11,25 €;
- ipotesi di scuola per il flottante: «se la famiglia fondatrice tenesse il 60%» (non è un fatto della storia).

## Le lettere delle formule

Sempre le stesse in tutta la materia, con la legenda sotto ogni formula:
`P` prezzo di un'azione · `N` numero di azioni · `Cap` capitalizzazione · `U` utile netto · `EPS` utile per azione · `PN` patrimonio netto · `BVPS` valore contabile per azione · `R` ricavi · `D` debiti finanziari · `C` cassa · `EV` valore d'impresa · `EBIT` risultato operativo · `V` valore stimato · `M` margine di sicurezza · `D_1`, `P_1` dividendo e prezzo tra un anno · `r` rendimento richiesto.

## Come si scrive

- Le regole delle Basi: frasi corte, ogni parola nuova spiegata quando compare, niente virgolette doppie né lineette lunghe (per citare: « »), una pagina sotto i 1.000 caratteri.
- Ogni formula prima a lettere, poi con i numeri; sotto, la legenda delle lettere. Negli esercizi i dati che servono stanno tutti nel testo della domanda.
- Le ipotesi si dichiarano («Ipotesi: interessi al 5%, imposte al 25%»).
- Tabelle: con quattro colonne la prima deve stare in 14 caratteri (su un telefono stretto altrimenti esce di lato).
- Le parole in grassetto che stanno nel glossario (`GLOSS_DEF` in `p10_data.js`) si aprono con un tocco: quando nasce un termine nuovo, va aggiunto lì.
- La scheda di Velonda (`scheda(...)`) accompagna le pagine con i conti: si mettono in evidenza le voci che servono in quella pagina.

## Aggiungere un capitolo

1. In `azioni_src.py`: un nuovo `C6 = dict(id='az-c6', sid=..., name=<la domanda>, num=6, lab=<nome del laboratorio o niente>, pre=[...], lessons=[...])` e `UNITS = [C5, C6]`. Le chiavi delle lezioni non cambiano mai più (`az-6-1`...): i progressi sono legati a quelle.
2. Se servono leve nuove: il conto in `LEVERS` (`p35_steps.js`) e i nomi dei cursori e dei risultati in `LEVE` (in fondo ad `azioni_src.py`).
3. Se c'è un laboratorio: gli stampi in `p44_motore.js` con `lab: '<nome>'`, in italiano e in inglese, e il secondo conto in `dev/giochi/ricalcola.py`.
4. I termini nuovi nel glossario. Le frasi nuove dell'interfaccia in `dev/en/ui_en.txt`.
5. `bash dev/ordine/build.sh`, poi `node dev/giochi/collauda.mjs && python3 dev/giochi/ricalcola.py`.

In inglese la materia non c'è ancora: `compila.mjs` mette `AZIONI_UNITS = []` finché non esiste `dev/en/azioni_en.json` (stessa forma di `azioni.json`).

## Fonti delle definizioni (controllate il 23 novembre 2026)

- Borsa Italiana, Glossario finanziario: «Enterprise Value» (capitalizzazione più indebitamento netto; base dei multipli EV/EBIT ed EV/EBITDA), «Price/Earnings» (prezzo diviso utile per azione, oppure capitalizzazione diviso utili; utili passati o attesi), «Price/Book Value» (prezzo diviso patrimonio netto per azione; poco significativo per le aziende di servizi).
  https://www.borsaitaliana.it/borsa/glossario/enterprise-value.html · https://www.borsaitaliana.it/borsa/glossario/price-earnings.html · https://www.borsaitaliana.it/borsa/glossario/price-book-value.html
- Le uguaglianze P/B = P/E × ROE e P/S = P/E × margine netto si ricavano dalle definizioni (stanno anche nei controlli di `azioni_src.py`).
- La regola «sopra e sotto devono riguardare le stesse persone» (prezzo con utile netto, EV con risultato operativo) è quella di ogni manuale di valutazione; per esempio A. Damodaran, «Investment Valuation», capitoli sui multipli.
- Margine di sicurezza e l'immagine della macchina che conta i voti e della bilancia: B. Graham, «The Intelligent Investor» (l'immagine è riportata a parole nostre, come la racconta W. Buffett nelle lettere agli azionisti di Berkshire Hathaway, per esempio in quella del 1993).
- Niente soglie di capitalizzazione per large, mid e small cap: cambiano da mercato a mercato, e nelle lezioni lo diciamo.
