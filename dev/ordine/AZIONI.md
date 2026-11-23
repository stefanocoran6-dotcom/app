# Materia «Azioni»: la storia, i numeri, le regole

Tutto quello che serve per scrivere un capitolo nuovo senza perdere il filo.

- Le lezioni: `azioni_c5a.py` … `azioni_c5f.py` (una parte del capitolo per file).
- I numeri della storia, con i controlli: `azioni_dati.py`.
- Il montaggio: `azioni_src.py`. Gli attrezzi comuni (pagine, disegni, passi da fare, controlli): `lezioni_lib.py`.

## La forma

- **Materia → Capitolo → Parte → Lezione.** Un capitolo è una domanda che si fa Nora. Dentro l'app è un'unità del corso `azioni`, con il suo numero (`num`). Un capitolo lungo è diviso in parti: ogni parte ha il suo nome, la sua verifica e, se serve, il suo laboratorio.
- **Semplice nelle parole, completo nella sostanza.** Ogni cosa è costruita da zero, ma niente resta fuori: per ogni misura la formula completa, come si legge, pregi e difetti, quando inganna. La profondità sta nel testo principale.
- **Lezione da 6-12 minuti**, a passi: una domanda per cominciare, il concetto, la formula a lettere con la legenda, l'esempio svolto con i numeri della storia, «calcola tu», pregi e difetti, tre o quattro domande.
- **«Per andare a fondo»**: un riquadro chiuso sotto una pagina (`deep=` in `P(...)`). Solo per quello che è davvero in più: una dimostrazione, il formulario. Chi lo salta non perde niente di quello che serve.
- **Fine capitolo**: una lezione-caso (domande con gli stessi dati, sotto la linguetta «Il caso») che si chiude con il campo delle stime e il verdetto.
- **Laboratorio di calcolo**: numeri sempre diversi (stampi con `lab` in `p44_motore.js`). Sta in fondo a una parte (`lab=` della parte).
- **Capitoli indipendenti**: ognuno dice quali unità delle Basi dà per scontate (`pre=` del capitolo) e ripresenta in due righe Nora e Velonda.
- I capitoli escono uno alla volta. Quelli non scritti si vedono «in arrivo»: i nomi stanno in `AZIONI_L` (`p10_data.js`).

## Che cosa è nostro

Gli argomenti sono quelli di ogni manuale di valutazione (multipli, valore d'impresa, dividendi e flussi scontati, metodo patrimoniale). Sono nostri: la scaletta a domande, l'ordine, la storia, i numeri, gli esempi, gli esercizi, le parole.
Non si copiano né si traducono testi, esempi o domande di altri (manuali, dispense, programmi d'esame). Nessun nome di certificazione nei testi. Formule e definizioni si ricontrollano sulle fonti in fondo.

## La storia

- **Nora**, 29 anni, va al lavoro in bici elettrica. Ha 3.000 € da parte e vuole capire se comprare azioni dell'azienda che ha fatto la sua bici. Ogni capitolo è una sua domanda.
- **Velonda**: azienda italiana **inventata**, produce bici da città ed elettriche, quotata in Borsa. È la protagonista di tutti i capitoli. Sta nel mezzo su tutto: cresce e rende più di Nordciclo, meno di Pedalta.
- **Pedalta** e **Nordciclo**: i due concorrenti quotati, **inventati**. Pedalta è piccola, cresce in fretta, rende molto, trattiene tre quarti degli utili e costa cara. Nordciclo è grande e matura, rende poco, è piena di debiti, distribuisce quasi tutto e costa poco.
- Nelle lezioni va detto che sono aziende inventate (lo dice la prima pagina del capitolo 5).
- Il capitolo 5 finisce così: per Nora 12 € è un prezzo onesto ma pieno, senza margine di sicurezza; le va bene. Il capitolo 6 riparte da «come la compro?».

## I numeri (milioni di euro, tranne prezzo, azioni e cifre per azione)

Stanno in `azioni_dati.py`, con i controlli: se una cifra cambia, il programma dice dove i conti non tornano.

| | Velonda | Pedalta | Nordciclo |
|---|---|---|---|
| Prezzo di un'azione (€) | 12 | 45 | 4,20 |
| Azioni (milioni) | 20 | 4 | 50 |
| Capitalizzazione | 240 | 180 | 210 |
| Ricavi | 300 | 120 | 525 |
| Risultato operativo (EBIT) | 24 | 12,5 | 38 |
| Ammortamenti | 6 | 2,5 | 9,5 |
| EBITDA | 30 | 15 | 47,5 |
| Interessi (5% dei debiti) | 4 | 0,5 | 10 |
| Imposte (25%) | 5 | 3 | 7 |
| Utile netto | 15 | 9 | 21 |
| Patrimonio netto | 120 | 45 | 300 |
| Debiti finanziari | 80 | 10 | 200 |
| Cassa | 20 | 20 | 30 |
| Flusso di cassa operativo | 20 | 10 | 30 |
| Dividendi pagati | 9 | 2,25 | 15 |
| Utile per azione (€) | 0,75 | 2,25 | 0,42 |
| Dividendo per azione (€) | 0,45 | 0,5625 | 0,30 |
| P/E | 16 | 20 | 10 |
| P/E atteso | 14,8 | 17,4 | 9,8 |
| P/B | 2 | 4 | 0,7 |
| P/S | 0,8 | 1,5 | 0,4 |
| P/CF (flusso operativo) | 12 | 18 | 7 |
| Valore d'impresa (EV) | 300 | 170 | 380 |
| EV / risultato operativo | 12,5 | 13,6 | 10 |
| EV / EBITDA | 10 | 11,3 | 8 |
| EV / ricavi | 1 | 1,4 | 0,7 |
| ROE | 12,5% | 20% | 7% |
| Margine netto | 5% | 7,5% | 4% |
| Payout | 60% | 25% | 71% |
| Rendimento del dividendo | 3,75% | 1,25% | 7,1% |
| Crescita sostenibile (quota trattenuta × ROE) | 5% | 15% | 2% |
| Crescita degli utili attesa dagli analisti nei prossimi anni | 8% | 15% | 2% |

Solo Velonda:
- la cassa: utile 15 + ammortamenti 6 − 1 di magazzino e crediti in più = 20 di flusso operativo; meno 14 di investimenti, più 3 di debiti nuovi = 9 per i soci, cioè i dividendi. Così tutto cresce del 5%: patrimonio da 120 a 126, debito netto da 60 a 63;
- i pezzi (nei conti → oggi): fabbriche e terreni 110 → 140, marchio 0 → 20, magazzino 70 → 62, crediti 50 → 48, cassa 20 → 20; in tutto 250 → 290. Debiti in tutto 130 (80 finanziari più 50 verso fornitori e altri). Vendendo in fretta: 200.

Cifre del capitolo 5, da non contraddire nei prossimi:
- valore di liquidazione 3,50 € per azione; metodo patrimoniale 8 € per azione; valore contabile 6 € per azione;
- un analista stima 15 € (margine di sicurezza 20%); un grande gruppo offre 15 € per azione (premio di controllo 25%) e risparmierebbe 6 milioni di costi l'anno;
- **Nora chiede il 9%** per Velonda: 3% di un titolo senza rischio più 6 punti per il rischio. Per Nordciclo, più indebitata, chiede il 10%; per Pedalta l'11%;
- Velonda ha annunciato i dividendi dei prossimi tre anni: 0,48 €, 0,51 €, 0,54 €; poi crescita del 5% per sempre;
- un anno: dividendo 0,48 e rivendita a 12,60 → 12 €. Tre anni con rivendita a 14 € → 12,10 €;
- Gordon: 0,48 / (9% − 5%) = 12 €. Con crescita al 4% o rendimento al 10%: 9,60 €; con crescita al 6% o rendimento all'8%: 16 €;
- il rendimento nascosto nel prezzo: 4% di dividendo + 5% di crescita = 9%;
- due fasi: valore finale tra tre anni 14,18 €; valore di oggi 12,23 € (1,287 dai dividendi, 10,946 dal valore finale);
- P/E giusto di Velonda: 60% / (9% − 5%) = 15, contro un P/E atteso di 14,8. Di Nordciclo: 8,9 contro 9,8. Nordciclo con Gordon: 3,83 €;
- metodo dei simili: P/E medio 15 → 11,25 €; P/CF medio 12,5 → 12,50 €; EV/EBITDA medio 9,67 → 11,50 €; P/B medio 2,35 → 14,10 € e P/S medio 0,95 → 14,25 € (gonfiati da Pedalta);
- contro la sua storia: P/E medio degli ultimi dieci anni 14 → 10,50 €;
- **ipotesi di scuola, che non sono fatti della storia**: il flottante («se la famiglia fondatrice tenesse il 60%»), l'aumento di capitale a metà anno, il prestito convertibile da 20 milioni e i 3 milioni di opzioni dell'utile diluito, il magazzino venduto con 5 milioni di guadagno. Velonda non ha azioni proprie, privilegiate, opzioni né convertibili: utile base e diluito coincidono.

## Le lettere delle formule

Sempre le stesse in tutta la materia, con la legenda sotto ogni formula:
`P` prezzo di un'azione · `N` numero di azioni · `Cap` capitalizzazione · `U` utile netto · `EPS` utile per azione · `PN` patrimonio netto · `BVPS` valore contabile per azione · `R` ricavi · `CF` flusso di cassa operativo · `I` investimenti · `ΔD` debiti nuovi · `FCFE` flusso di cassa per i soci · `D` debiti finanziari · `C` cassa · `EV` valore d'impresa · `EBIT` risultato operativo · `EBITDA` · `V` valore stimato · `M` margine di sicurezza · `Div_0`, `Div_1` ultimo dividendo e dividendo del prossimo anno · `P_1`, `P_n` prezzo tra un anno, tra n anni · `r` rendimento richiesto · `g` crescita · `payout` · `A` attività al valore di oggi · `D_tot` tutti i debiti.

`D` è sempre il debito: i dividendi si scrivono `Div`.

## Come si scrive

- Le regole delle Basi: frasi corte, ogni parola nuova spiegata quando compare, niente virgolette doppie né lineette lunghe (per citare: « »), una pagina sotto i 1.000 caratteri.
- Ogni formula prima a lettere, poi con i numeri; sotto, la legenda delle lettere. Negli esercizi i dati che servono stanno tutti nel testo della domanda.
- Le ipotesi si dichiarano («Ipotesi: un titolo sicuro rende il 3%»).
- Ogni misura ha la sua pagina «Pregi e difetti».
- Quando due cifre arrotondate non sommano al centesimo, si scrivono con una cifra in più (1,287 + 10,946 = 12,23).
- Tabelle: con quattro colonne la prima deve stare in 14 caratteri (su un telefono stretto altrimenti esce di lato).
- Le parole in grassetto che stanno nel glossario (`GLOSS_DEF` in `p10_data.js`) si aprono con un tocco: quando nasce un termine nuovo, va aggiunto lì.
- La scheda di Velonda (`scheda(...)`) accompagna le pagine con i conti: si mettono in evidenza le voci che servono in quella pagina.
- La risposta giusta si scrive dove viene: `bilancia` la distribuisce poi tra A, B e C. Le spiegazioni quindi non dicono mai «la prima risposta».

## Il capitolo 5, parte per parte

| Parte | Lezioni (chiavi) | Laboratorio |
|---|---|---|
| 1 · Prezzo e valore | `az-5-01` prezzo e valore · `az-5-02` di quale valore parliamo · `az-5-03` tre strade | |
| 2 · I multipli | `az-5-04` capitalizzazione · `az-5-05` utile per azione, base e diluito · `az-5-06` P/E · `az-5-07` P/B · `az-5-08` P/S · `az-5-09` prezzo contro la cassa · `az-5-10` metodo dei simili | |
| 3 · Il valore d'impresa | `az-5-11` valore d'impresa · `az-5-12` i multipli dell'EV | `multipli` (18 stampi) |
| 4 · I soldi che arriveranno | `az-5-13` scontare i dividendi · `az-5-14` Gordon · `az-5-15` crescita sostenibile e P/E giusto · `az-5-16` due fasi, privilegiate, senza dividendi | `flussi` (9 stampi) |
| 5 · I pezzi, e il verdetto | `az-5-17` metodo patrimoniale · `az-5-18` il caso | |

La prima stesura (v59) aveva 8 lezioni con le chiavi `az-5-1` … `az-5-8`: sono state ritirate, e non vanno riusate.

## Aggiungere un capitolo

1. Un file per parte (`azioni_c6a.py` …), ognuno con `LEZIONI = [LF(...), ...]`. In `azioni_src.py`: `C6 = dict(id='az-c6', name=<la domanda>, num=6, pre=[...], parts=[dict(sid='az-6-p1', name=..., lab=<nome o niente>, lessons=...)])` e `UNITS = [C5, C6]`. Le chiavi delle lezioni (`az-6-01` …) non cambiano mai più: i progressi sono legati a quelle.
2. I numeri nuovi della storia in `azioni_dati.py`, con il loro controllo.
3. Se servono leve nuove: il conto in `LEVERS` (`p35_steps.js`) e i nomi dei cursori e dei risultati in `LEVE` (in fondo ad `azioni_src.py`).
4. Se c'è un laboratorio: gli stampi in `p44_motore.js` con `lab: '<nome>'`, in italiano e in inglese, e il secondo conto in `dev/giochi/ricalcola.py`.
5. I termini nuovi nel glossario. Le frasi nuove dell'interfaccia in `dev/en/ui_en.txt`.
6. `bash dev/ordine/build.sh`, poi `node dev/giochi/collauda.mjs && python3 dev/giochi/ricalcola.py`.

In inglese la materia non c'è ancora: `compila.mjs` mette `AZIONI_UNITS = []` finché non esiste `dev/en/azioni_en.json` (stessa forma di `azioni.json`).

## Fonti delle definizioni (controllate il 23 novembre 2026)

- Borsa Italiana, Glossario finanziario:
  - «Enterprise Value» (capitalizzazione più indebitamento netto), «Price/Earnings» (utili passati o attesi), «Price/Book Value» https://www.borsaitaliana.it/borsa/glossario/enterprise-value.html · https://www.borsaitaliana.it/borsa/glossario/price-earnings.html · https://www.borsaitaliana.it/borsa/glossario/price-book-value.html
  - «Earnings per Share» (utile al netto dei dividendi delle privilegiate, media ponderata delle azioni; base e diluito, con convertibili e stock option) https://www.borsaitaliana.it/borsa/glossario/earnings-per-share.html
  - «EV/EBITDA» https://www.borsaitaliana.it/borsa/glossario/enterprise-value-earnings-before-interest-taxes-depreciation-and-amortisation.html
  - «Dividend Discount Model» (valore = dividendi attesi attualizzati; limiti: serve un prezzo finale, i dividendi non misurano tutto) e «Gordon Growth Model» (dividendo del primo anno diviso costo del capitale meno crescita; solo per imprese in crescita costante) https://www.borsaitaliana.it/borsa/glossario/dividend-discount-model.html · https://www.borsaitaliana.it/borsa/glossario/gordon-growth-model.html
- Utile per azione diluito: principio contabile internazionale IAS 33. Opzioni: l'incasso si considera usato per ricomprare azioni al prezzo medio di mercato dell'anno, e contano solo le azioni in più. Convertibili: all'utile si riaggiungono gli interessi al netto delle imposte, alle azioni quelle della conversione. Gli strumenti che farebbero salire l'utile per azione non si contano.
- Debiti per leasing nei conti dal 2019: principio contabile internazionale IFRS 16, in vigore dagli esercizi iniziati dal 1° gennaio 2019.
- Le uguaglianze P/B = P/E × ROE e P/S = P/E × margine netto si ricavano dalle definizioni (stanno anche nei controlli di `azioni_dati.py`). Lo stesso per il P/E giusto: il modello di Gordon diviso per l'utile atteso.
- La regola «sopra e sotto devono riguardare le stesse persone», la crescita sostenibile (quota trattenuta × ROE), il valore d'impresa con privilegiate e quote di terzi, e la prudenza sulla crescita «per sempre» (non può superare quella dell'economia): sono in ogni manuale di valutazione; per esempio A. Damodaran, «Investment Valuation», e le sue dispense pubbliche (pages.stern.nyu.edu/~adamodar).
- Margine di sicurezza e l'immagine della macchina che conta i voti e della bilancia: B. Graham, «The Intelligent Investor» (l'immagine è riportata a parole nostre, come la racconta W. Buffett nelle lettere agli azionisti di Berkshire Hathaway, per esempio in quella del 1993).
- Valore equo, valore d'investimento, valore di liquidazione: sono le definizioni correnti nella pratica della valutazione (in Italia, i Principi Italiani di Valutazione).
- Niente soglie di capitalizzazione per large, mid e small cap: cambiano da mercato a mercato, e nelle lezioni lo diciamo. Niente tassi del momento: il 3% del titolo senza rischio è dichiarato come ipotesi.
