# Fonti delle lezioni di "Basi della finanza"

Qui stanno i fatti che non sono conti: leggi, soglie, date e dati pubblici usati nelle lezioni. Ogni riga dice che cosa afferma la lezione, da dove viene e quando è stata controllata l'ultima volta. Se una regola cambia, si corregge la lezione in `basi_src.py` e si aggiorna questa pagina.

## Unità "La banca e i pagamenti" (`basi-u11`), controllo del 12 novembre 2026

### Da riguardare

| Quando | Che cosa | Lezioni toccate |
|---|---|---|
| Ogni dicembre | La Banca d'Italia pubblica la nuova indagine sul costo dei conti: cambiano 101 €, 31 € e i 16 € della commissione per lo sconfinamento | `basi-11-1` |
| Quando sarà in vigore il nuovo regolamento europeo sui servizi di pagamento (PSR, con la direttiva PSD3) | Cambia chi paga nelle truffe in cui il truffatore si finge la banca. Ad agosto 2026 il testo non era ancora in Gazzetta ufficiale; l'applicazione era attesa verso metà 2028 | `basi-11-3`, `basi-11-5` |
| Se cambia la legge di bilancio | Imposta di bollo: 34,20 €, soglia di 5.000 €, 0,2% sui conti deposito | `basi-11-1` |
| Se cambia la direttiva sulla garanzia dei depositi | Limite di 100.000 €, 7 giorni lavorativi, nove mesi per le somme temporaneamente alte | `basi-11-4` |

### Quanto ti costa il conto (`basi-11-1`)

| Nella lezione | Fonte |
|---|---|
| Spesa media 2024: 101,1 € conto con sportello, 30,6 € conto online. L'imposta di bollo non è compresa nel dato | [Banca d'Italia, Indagine sul costo dei conti correnti nel 2024](https://www.bancaditalia.it/pubblicazioni/indagine-costo-cc/indagine-costo-cc2025/index.html), pubblicata il 15 dicembre 2025. Sul bollo escluso: [indagine sui dati 2023](https://dirittobancario.it/wp-content/uploads/2024/12/Indagine-Banca-dItalia-sul-costo-dei-conti-correnti-2023-dicembre-2024-n.-14.pdf) |
| Commissione per lo sconfinamento: in media 16,2 € nel 2024 | Stessa indagine |
| Imposta di bollo di 34,20 € l'anno per le persone fisiche; non dovuta se la giacenza media non supera 5.000 €; la media si calcola sul periodo dell'estratto conto; i conti della stessa persona nella stessa banca si sommano e, superata la soglia, il bollo è dovuto su ciascuno | [Agenzia delle Entrate, circolare 48/E del 21 dicembre 2012](https://www.dirittobancario.it/wp-content/uploads/sites/default/files/allegati/circolare_agenzia_delle_entrate_21_dicembre_2012_n._48_e.pdf), paragrafi 1.2 e 1.3 |
| Sul conto deposito il bollo è lo 0,2% l'anno, senza soglia | [ItaliaOggi, guida all'imposta di bollo](https://www.italiaoggi.it/le-guide-per-tutti/imposta-di-bollo-su-conti-correnti-e-investimenti-quando-si-applica-uvqksh2j), 5 giugno 2025 |
| Riepilogo delle spese una volta l'anno; Documento informativo sulle spese uguale in tutte le banche | [Guida all'indicatore dei costi complessivi (Fineco)](https://images.finecobank.com/it/pub/pdf/popup/trasparenza/guida_icc.pdf), che riprende le disposizioni di trasparenza della Banca d'Italia |
| Trasferimento del conto: si chiede alla banca nuova, 12 giorni lavorativi, senza spese, indennizzo se in ritardo, il conto vecchio si chiude solo su richiesta | [Altroconsumo](https://www.altroconsumo.it/soldi/conti-correnti/news/trasferire-il-conto) e [QuiFinanza](https://quifinanza.it/info-utili/portabilita-conti-cosa-come-richiederla/242515/) |
| Sconfinamento fino a 500 € per non più di 7 giorni: una volta a trimestre niente commissione fissa (gli interessi restano) | D.M. 30 giugno 2012 n. 644, riassunto in [Studio Cataldi](https://www.studiocataldi.it/guide_legali/diritto-bancario/quando-e-dovuta-la-commissione-di-istruttoria-veloce) |

### Debito, credito, prepagata (`basi-11-2`)

| Nella lezione | Fonte |
|---|---|
| All'estero puoi sempre rifiutare la conversione in euro e pagare nella valuta del posto; chi la propone deve mostrare il ricarico | [La tua Europa, Prezzi e pagamenti](https://europa.eu/youreurope/citizens/consumers/shopping/pricing-payments/index_it.htm), verificata il 27 gennaio 2026 |
| Di solito la valuta del posto costa meno | [QuiFinanza](https://quifinanza.it/soldi/pagamenti-estero-euro-valuta-locale-cosa-conviene-di-piu/738619/) |
| Commissione del 4% sull'anticipo di contante, cambio a 1,20 € per sterlina, commissione del 2,5% | Sono esempi con numeri scelti per il conto, non dati |

### Bonifici, IBAN e addebiti diretti (`basi-11-3`)

| Nella lezione | Fonte |
|---|---|
| Ordine arrivato dopo l'orario limite: vale come ricevuto il giorno lavorativo seguente, e i soldi arrivano alla banca del beneficiario il giorno lavorativo dopo ancora | [Banca d'Italia, domande e risposte sugli strumenti di pagamento](https://www.bancaditalia.it/compiti/sispaga-mercati/strumenti-pagamento/materiale-inofrmativo/faq-/index.html) |
| Bonifico istantaneo: 10 secondi, a ogni ora e in ogni giorno; costo non superiore al bonifico ordinario; obbligo di offrirlo e verifica del beneficiario dal 9 ottobre 2025; la verifica è gratuita; tetto su richiesta, al giorno o per operazione | [Regolamento (UE) 2024/886](https://www.dirittobancario.it/wp-content/uploads/2024/03/Regolamento-UE-2024-886.pdf), articoli 5 bis, 5 ter e 5 quater |
| Quattro esiti della verifica; chi conferma nonostante l'avviso se ne assume la responsabilità | [LeggiOggi](https://www.leggioggi.it/bonifici-istantanei-obbligatori-dal-9-ottobre-25/) |
| Un IBAN di un altro Paese dell'area non può essere rifiutato | Regolamento (UE) 260/2012, articolo 9; [Altroconsumo](https://www.altroconsumo.it/azioni-collettive/discriminazione-iban) |
| Addebito diretto autorizzato: rimborso entro 8 settimane, senza condizioni se in euro; la banca risponde entro 10 giorni lavorativi; 13 mesi se non autorizzato | [Banca Mediolanum, guida alle operazioni non autorizzate](https://www.bancamediolanum.it/static-assets/documenti/file/it/2025/10/15//Brochure_OP_non_autorizzate.pdf), ottobre 2025 |

### Se la banca fallisce (`basi-11-4`)

| Nella lezione | Fonte |
|---|---|
| 100.000 € per depositante e per banca; rimborso in 7 giorni lavorativi | [FITD, opuscolo informativo](https://www.fitd.it/Content/public/FITD_opuscolo_informativo_cosa_facciamo.pdf) |
| I conti nella stessa banca si sommano (esempio 90.000 + 20.000); il cointestato vale per ciascun intestatario; nove mesi di protezione per le somme temporaneamente alte | [Modulo standard di informazioni per i depositanti (Fineco)](https://images.finecobank.com/docs/pdf/open-account/informazioni_depositanti.pdf) |
| Coperti: conti correnti, conti deposito, depositi a risparmio, assegni circolari. Esclusi: obbligazioni e operazioni in titoli | [FITD, informazioni generali per i depositanti](https://www.bplajatico.it/wp-content/uploads/2016/10/FITD_Informazioni-generali-per-i-depositanti.pdf) |
| Titoli in custodia e cassette di sicurezza non sono toccati; ordine delle perdite: azionisti, obbligazionisti, poi i depositi oltre 100.000 € | [Banca d'Italia, Come sono gestite le crisi bancarie](https://www.bancaditalia.it/media/approfondimenti/2015/gestione-crisi-bancarie/index.html) |
| Istituti di pagamento e di moneta elettronica: i soldi dei clienti restano separati e sono dei clienti anche se l'istituto fallisce | Risposta della Banca d'Italia riportata da [AziendaBanca](https://www.aziendabanca.it/notizie/conto-pagamento-bail-in), 2020 |
| Banche di altri Paesi dell'Unione: vale il fondo del Paese d'origine, stesso limite | Direttiva 2014/49/UE, articolo 14 (vedi l'elenco delle affermazioni senza pagina aperta, più sotto) |

### Pagare online e con il telefono (`basi-11-5`)

| Nella lezione | Fonte |
|---|---|
| Contactless senza PIN fino a 50 €; PIN dopo 150 € in tutto o dopo cinque pagamenti | Regolamento delegato (UE) 2018/389, articolo 11, riassunto in [Agenda Digitale](https://www.agendadigitale.eu/cittadinanza-digitale/pagamenti-digitali/furti-con-carte-contactless-e-rimborsi-la-sentenza-della-corte-di-giustizia-ue/) |
| Pagamento non autorizzato: 13 mesi per contestarlo, rimborso entro il giorno lavorativo successivo, al massimo 50 € a carico del cliente prima della segnalazione, niente dopo; niente a carico del cliente senza autenticazione forte; tutta la perdita al cliente in caso di dolo o colpa grave | [Banca del Piemonte, guida al disconoscimento](https://www.bancadelpiemonte.it/wp-content/uploads/2025/06/Guida-DISCONOSCIMENTO-OPERAZIONI-NON-AUTORIZZATE-vers.-01.07.2025.pdf) e [Banca Mediolanum](https://www.bancamediolanum.it/static-assets/documenti/file/it/2025/10/15//Brochure_OP_non_autorizzate.pdf) (d.lgs. 11/2010) |
| Chargeback: non è nelle norme sui pagamenti, è una regola dei circuiti; di solito entro 120 giorni dall'addebito. Con un bonifico la banca risponde solo della corretta esecuzione | [Banca d'Italia, domande e risposte sui pagamenti per gli acquisti online](https://www.bancaditalia.it/compiti/tutela-educazione/avvisi-comunicazioni/faq-pagamenti/index.html) |
| Reclamo sui pagamenti: risposta entro 15 giorni lavorativi. Arbitro Bancario Finanziario: 20 €, restituiti se il ricorso è accolto, senza avvocato | Stessa pagina della Banca d'Italia e [Altroconsumo](https://www.altroconsumo.it/soldi/conti-correnti/news/arbitro-finanziario), 5 dicembre 2025 |

### Affermazioni senza una pagina aperta nel controllo del 12 novembre 2026

Sono regole stabili e note, ma in questo controllo non sono state rilette su una fonte: alla prossima revisione vanno legate a una pagina.

- Come funziona una pre-autorizzazione (la cauzione di hotel e noleggi) su carta di debito e di credito; molti noleggi accettano solo carte di credito (`basi-11-2`).
- Struttura dell'IBAN italiano (27 caratteri) e cifre di controllo che scoprono gli errori di battitura (`basi-11-3`).
- Diritto di chiedere alla banca limiti e blocchi sugli addebiti diretti: Regolamento (UE) 260/2012, articolo 5 (`basi-11-3`).
- Banche di altri Paesi dell'Unione coperte dal fondo del Paese d'origine: Direttiva 2014/49/UE, articolo 14 (`basi-11-4`).
- Le tre prove dell'autenticazione forte e le sue eccezioni; il numero sostitutivo della carta nel portafoglio digitale del telefono (`basi-11-5`).

### Parti che valgono solo per l'Italia

Imposta di bollo, Riepilogo delle spese, commissione per lo sconfinamento, Arbitro Bancario Finanziario, albi della Banca d'Italia. Il resto dell'unità è regola europea. Serve saperlo per l'edizione in inglese.

## Unità "Lo stipendio" (`basi-u12`), controllo del 12 novembre 2026

Tutta l'unità vale per l'Italia e per il 2026. **Va rifatta ogni gennaio**, dopo la legge di bilancio: scaglioni, detrazioni, taglio del cuneo, soglie INPS e importi della NASpI cambiano quasi ogni anno. I numeri di Marco (RAL 30.000 €) escono dai conti `STIP` in `p35_steps.js`: cambiate le regole lì, vanno ricalcolati anche quelli scritti nei testi.

| Nella lezione | Fonte |
|---|---|
| IRPEF 2026: 23% fino a 28.000 €, 33% fino a 50.000 €, 43% oltre | Legge di bilancio 2026, art. 1 commi 3-4: [Andersen](https://it.andersen.com/wp-content/uploads/2026/01/Agg.-Legge-di-Bilancio-2026-Novita-riguardati-il-reddito-delle-persone-fisiche.pdf), [Wikilabour](https://www.wikilabour.it/wp-content/uploads/2026/01/Commento_LeggeBilancio2026_def.pdf) |
| Detrazione per lavoro dipendente: 1.955 € fino a 15.000 €; 1.910 + 1.190 × (28.000 − r) / 13.000 fino a 28.000 €; 1.910 × (50.000 − r) / 22.000 fino a 50.000 € | [Namirial, Busta paga 2026](https://focus.namirial.com/it/busta-paga-2026/), 16 marzo 2026. I 65 € in più tra 25.000 e 35.000 € (art. 13 comma 1.1 TUIR) non hanno una pagina aperta, ma senza quelli la tabella qui sotto non torna |
| Taglio del cuneo confermato nel 2026: somma del 7,1% / 5,3% / 4,8% fino a 20.000 €; detrazione di 1.000 € tra 20.000 e 32.000 €, poi 1.000 × (40.000 − r) / 8.000 fino a 40.000 € | [Money.it](https://www.money.it/bonus-busta-paga-2026-elenco-completo-seconda-quanto-guadagni), 5 febbraio 2026 |
| Netto di Marco e degli altri esempi (Milano, 13 mensilità): il modello dà 1.341, 1.582, 1.802, 2.002 e 2.151 € al mese per RAL da 20.000 a 40.000 €, gli stessi della tabella pubblicata | [Dipendenti.it](https://www.dipendenti.it/guida/calcolo-stipendio-netto), 25 ottobre 2026. Il confronto si rifà con `scratchpad/basi_u11/netto.py` |
| Contributi: 33% per la pensione, 9,19% a carico del lavoratore e 23,81% dell'azienda; 1% in più oltre 56.224 €; i contributi si tolgono prima dell'IRPEF | [Centro Fiscale](https://centrofiscale.com/contributi-inps-busta-paga-2026/); soglie nella circolare INPS n. 6 del 30 gennaio 2026 ([Informazione Fiscale](https://www.informazionefiscale.it/contributi-INPS-2026-dipendenti-istruzioni-calcolo-importo)) |
| NASpI 2026: 75% fino a 1.456,72 €, tetto 1.584,70 €, meno 3% al mese dal sesto mese, durata pari a metà delle settimane di contributi degli ultimi quattro anni (massimo 24 mesi), domanda entro 68 giorni | [Manageritalia, Indennità di disoccupazione 2026](https://www.manageritalia.it/wp-content/uploads/2026/02/Indennita-di-disoccupazione-2026.pdf) |
| Contributi non versati: prescrizione in cinque anni, dieci con la denuncia del lavoratore | [PensioniOggi](https://www.pensionioggi.it/dizionario/prescrizione-contributiva), letta solo nei risultati di ricerca |
| Detrazioni e deduzioni: 19% sulle spese mediche oltre 129,11 €; pagamento tracciabile dal 2020, con l'eccezione di medicinali e dispositivi medici; interessi del mutuo 19% su 4.000 €; colf 1.549,37 €; sport dei ragazzi 210 € | [Centro Fiscale, spese detraibili e deducibili](https://centrofiscale.com/spese-detraibili-deducibili-730-2026/), 18 agosto 2026 |
| Fondo pensione: deduzione fino a 5.300 € dal 2026 | [MySolution](https://www.mysolution.it/fisco/informazioni/news/2026/01/05/previdenza-complementare-tetto-di-deducibilita-a-5.300-euro-e-super-deduzione-giovani-aggiornata), letta solo nei risultati di ricerca: da rileggere per l'unità sulla pensione |
| TFR: retribuzione / 13,5 meno lo 0,5%; rivalutazione 1,5% + 75% dell'inflazione, con imposta del 17%; tassazione separata (di solito 23-27%); anticipo dopo 8 anni, fino al 70%, una volta | [Centro Fiscale, TFR 2026](https://centrofiscale.com/tfr-calcolo-anticipo-tassazione-2026/), [First Cisl](https://www.firstcisl.it/milanometropoli/wp-content/uploads/sites/19/2026/03/Chiaro-e-tondo-TFR.pdf) |
| Dal 1° luglio 2026, per chi è al primo impiego, il TFR va a un fondo pensione se non si sceglie entro 60 giorni | Legge di bilancio 2026, commi 204-205 ([Wikilabour](https://www.wikilabour.it/wp-content/uploads/2026/01/Commento_LeggeBilancio2026_def.pdf)) |

Conti ricavati, non letti: tra 32.000 e 40.000 € di imponibile ogni euro in più perde circa il 54% di IRPEF (33% + 8,7% di detrazione per lavoro + 12,5% di detrazione del cuneo); la rivalutazione netta del TFR batte l'inflazione fino a circa il 3,3%.

## Aggiunte a "Debiti e prestiti" (`basi-4-5`, `basi-4-6`, `basi-4-7`), controllo del 12 novembre 2026

Da riguardare ogni trimestre: i tassi medi (la Banca d'Italia li pubblica a fine marzo, giugno, settembre e dicembre). Le regole sul credito ai consumatori sono quelle in vigore dal 20 novembre 2026.

| Nella lezione | Fonte |
|---|---|
| TAEG medi: prestiti per comprare un bene 11,30%, prestiti personali 12,08%, revolving 16,50%, cessione del quinto 14,23% fino a 15.000 € e 9,88% oltre | [Banca d'Italia, rilevazione dei tassi per il quarto trimestre 2026](https://www.bancaditalia.it/media/comunicati/documenti/2026-02/cs-rilevazione-trim-antiusura-30.09.2026.pdf) (tassi rilevati nel secondo trimestre 2026) |
| Tempi nelle banche dati del credito: richiesta 6 mesi, una o due rate in ritardo poi pagate 12 mesi, più di due 24 mesi, mai pagate 36 mesi, prestito regolare 60 mesi | [CRIF, vademecum del codice di condotta, dicembre 2019](https://www.crif.it/media/4488/vademecum-codice-di-condotta-sic-dicembre-2019.pdf) |
| Compra ora, paga dopo: dal 20 novembre 2026 è credito ai consumatori (d.lgs. 212/2025, direttiva UE 2023/2225), con verifica del merito creditizio; resta fuori la dilazione gratuita del venditore entro 50 giorni | [La Legge per Tutti](https://www.laleggepertutti.it/825376_come-cambia-il-credito-al-consumo-dal-20-novembre-2026), 28 ottobre 2026 |
| Cessione del quinto: rata fino a un quinto del netto, 10 anni, trattenuta da datore o INPS, assicurazione obbligatoria, TFR a garanzia, rinnovo dopo i due quinti, riduzione dei costi anche iniziali in caso di estinzione, iscrizione a Banca d'Italia o OAM | [Altroconsumo](https://www.altroconsumo.it/soldi/lavoro-pensione/news/cessione-del-quinto), 8 luglio 2026 |

Conti ricavati: TAEG dell'8,75% per 1.200 € in 12 rate a tasso zero con 30 € di pratica e 2 € a rata (12,9% su 6 rate); 300 € al mese per 10 anni al 9,88% valgono circa 23.200 € oggi.

Senza una pagina aperta in questo controllo: recesso entro 14 giorni dal contratto di credito; scioglimento del finanziamento collegato se il venditore non consegna; foglio informativo standard prima della firma; il fatto che nel compra ora, paga dopo la commissione la paghi il negozio; l'esclusione dal TAEG di assicurazioni facoltative e mora.


## Unità "La casa" (`basi-u13`), controllo del 12 novembre 2026

Regole italiane. Da riguardare ogni gennaio (imposte, Fondo prima casa) e quando cambiano i tassi dei mutui: gli esempi usano il 3,5% a 25 anni.

| Nella lezione | Fonte |
|---|---|
| Mutuo fino all'80% del valore di perizia; rata entro un terzo del reddito disponibile; imposta sul mutuo 0,25% per la prima casa (2% per le altre); surroga senza costi; estinzione anticipata senza penali per i mutui sulla casa | Banca d'Italia, [Il mutuo per la casa in parole semplici](https://bancafucino.it/sites/default/files/2026-09/Guida-Il-Mutuo-per-la-casa_Mod_Feb_2026.pdf), edizione febbraio 2026 |
| La banca può sciogliere il contratto se una rata non è pagata entro 180 giorni, o se il ritardo tra 30 e 180 giorni si ripete almeno sette volte, anche non di seguito | Art. 40 comma 2 del Testo unico bancario: [Brocardi](https://brocardi.it/testo-unico-bancario/titolo-ii/capo-vi/sezione-i/art40.html) |
| Fondo prima casa: garanzia del 50%; 80% per under 36, giovani coppie, genitori soli con figli minori e inquilini di case popolari, con ISEE fino a 40.000 € e mutuo oltre l'80% del prezzo; mutuo fino a 250.000 €; fino al 31 dicembre 2027 | [Money.it](https://www.money.it/mutuo-giovani-under-36-garanzia-statale-requisiti-e-come-funziona), 23 ottobre 2026 |
| Imposte sull'acquisto: da privato registro 2% (minimo 1.000 €) sul valore catastale, cioè rendita × 115,5, più 50 + 50 €; altre case 9% su rendita × 126; da impresa IVA 4% (10% le altre case) più 200 € × 3; categorie A/1, A/8 e A/9 escluse; residenza entro 18 mesi | [Studio Madera](https://studiomadera.it/news/293-prima-casa), 30 settembre 2026 |
| Due anni (non più uno) per vendere la casa già comprata con lo sconto; l'acquirente non deve avere altre case nello stesso Comune | Legge 207/2024, art. 1 comma 116: [Edotto](https://edotto.com/articolo/prima-casa-piu-tempo-per-vendere-limmobile-precedente) |
| Sconto perso se si rivende entro cinque anni, salvo riacquisto entro un anno di una casa da abitare; in quel caso imposte piene più sanzione del 30% | [Edotto](https://edotto.com/articolo/benefici-prima-casa-e-vendita-nel-quinquennio-condizioni-per-il-riacquisto), 30 giugno 2022 |
| Fondo di solidarietà per i mutui prima casa: rate sospese fino a 18 mesi per perdita del lavoro, riduzione dell'orario, morte o grave invalidità; domanda alla banca | [QuiFinanza](https://quifinanza.it/mercato-immobiliare/mutui-e-prestiti/fondo-solidarieta-mutui-prima-casa-guida/825665/), 10 giugno 2024: limiti (ISEE, valore della casa) da ricontrollare se entrano nel testo |

Conti ricavati con le leve di `p35_steps.js` (`casa`, `mutuomax`, `surroga`): 160.000 € al 3,5% per 25 anni danno una rata di 801 € (983 € al 5,5%); con casa da 200.000 €, costi di acquisto 8%, manutenzione 1% l'anno e 2% di rendimento perso, dopo 3 anni comprare è costato 41.593 € contro 28.800 € di affitto, e il pareggio con un affitto di 800 € arriva all'undicesimo anno; una rata di 1.000 € ripaga 199.750 €; su 120.000 € al 4,5% per 20 anni la rata è 759 €, e passare a 30 anni la abbassa di 151 € ma costa 36.685 € di interessi in più. Esempio dei costi: registro 1.848 € + 100 €, agenzia 3% più IVA 7.320 €, notaio 2.500 €, mutuo 400 € di imposta più 800 € di spese: 12.968 €, il 6,5% del prezzo.

Senza una pagina aperta in questo controllo: la caparra confirmatoria (art. 1385 del codice civile: chi l'ha data la perde, chi l'ha ricevuta restituisce il doppio); la clausola che lega la proposta alla concessione del mutuo; l'agenzia tra il 2% e il 3% più IVA e il notaio a tariffa libera (usi di mercato, le cifre sono esempi dichiarati tali nel testo); il prezzo-valore chiesto al notaio; l'agevolazione prima casa nel Comune in cui si lavora; la rinegoziazione senza notaio; il divieto di aumentare il debito con la surroga; il Fondo prima casa che si rivale su chi non paga.

## Unità "Proteggersi": le tre lezioni aggiunte (`basi-8-5`, `basi-8-6`, `basi-8-7`), controllo del 12 novembre 2026

Da riguardare ogni anno: i numeri dei furti d'identità (escono ogni estate), i costi e i limiti degli arbitri, la detrazione sui premi.

| Nella lezione | Fonte |
|---|---|
| Furto d'identità: nel 2025 più di 38.000 frodi sul credito, per 165 milioni di euro (la media di 4.300 € è il rapporto tra le due cifre) | Osservatorio CRIF, ripreso da [l'Adige](https://www.ladige.it/tecnologia/furti-didentita-oltre-38-mila-frodi-nel-2025-danni-per-165-milioni-nqwypob6) e [Teleborsa](https://www.teleborsa.it/News/2026/08/03/osservatorio-crif-frodi-creditizie-in-crescita-107.html), 3 agosto 2026 |
| Numero del chiamante falsificato: blocco delle chiamate dall'estero con numero fisso italiano dal 19 agosto 2025, con numero mobile dal 19 novembre 2025 | Delibera AGCOM 106/25/CONS: [CorCom](https://corrierecomunicazioni.it/telco/telemarketing-selvaggio-da-oggi-stop-alle-chiamate-moleste-dallestero-ecco-cosa-succede) |
| La banca non chiede mai password o codici; non usare i link; richiamare il numero ufficiale; blocco e denuncia | Guida di ABI, Polizia e associazioni dei consumatori: [QuiFinanza](https://quifinanza.it/info-utili/truffe-online-telefono-guida-abi-2025/939235/) |
| Polizze vita: temporanea caso morte, rivalutabili, unit-linked; premio di una temporanea tra 200 e 800 € l'anno per capitali tra 100.000 e 300.000 €; detrazione del 19% su 530 €; capitale ai beneficiari fuori da IRPEF ed eredità | [Centro Fiscale](https://centrofiscale.com/polizza-vita-tipologie-fiscalita-2026/), 2026 |
| Una unit-linked costa in media tra 0,5 e 2,5 punti l'anno in più dei fondi in cui investe | Banca d'Italia, Questioni di economia e finanza n. 907, febbraio 2025: [Diritto Bancario](https://www.dirittobancario.it/art/il-differenziale-di-costo-tra-le-polizze-unit-linked-e-fondi-comuni/); vedi anche [QuiFinanza](https://quifinanza.it/economia/finanza/polizze-vita-unit-linked-rischi-costi/1017163/) |
| ABF: reclamo, risposta entro 60 giorni (15 lavorativi per i pagamenti), ricorso entro 12 mesi, 20 € restituiti se accolto, fino a 200.000 €, decisione non vincolante ma pubblicata se non rispettata | [MIMIT](https://www.mimit.gov.it/it/sceglilalternativa/strumenti/arbitro-bancario-finanziario-abf) e [Altroconsumo](https://www.altroconsumo.it/soldi/conti-correnti/news/problemi-con-la-banca-rivolgiti-all-arbitro) |
| ACF: gratuito, fino a 500.000 €, reclamo con risposta entro 60 giorni, ricorso entro un anno dal reclamo, decisione non vincolante ma pubblicata | [MIMIT](https://www.mimit.gov.it/it/sceglilalternativa/strumenti/arbitro-controversie-finanziarie-consob), [Altroconsumo](https://www.altroconsumo.it/soldi/conti-correnti/news/arbitro-controversie-finanziarie) e, per il termine di un anno, l'[informativa di un intermediario](https://www.ioinvesto.net/informativa-arbitro-controversie-finanziarie/) |
| Arbitro Assicurativo: attivo dal 15 gennaio 2026, reclamo e 45 giorni di attesa, ricorso entro 12 mesi, 20 € | [QuiFinanza](https://quifinanza.it/info-utili/arbitro-assicurativo-15-gennaio-2026/952814/) e [lentepubblica](https://lentepubblica.it/cittadini-e-imprese/come-funziona-arbitro-assicurativo-novita-15-gennaio-2026/) |
| Servizio Conciliazione ARERA: gratuito, obbligatorio prima del giudice, attivabile dopo 40 giorni senza risposta (50 per l'acqua) | [Switcho](https://www.switcho.it/blog/luce-gas/conciliazione-arera/), 24 aprile 2024 |

Conto della figura in `basi-8-6`: 10.000 € al 4% per 20 anni danno 21.911 €; al 2,5% (cioè con 1,5 punti di costi in più) 16.386 €; la differenza è 5.525 €.

Senza una pagina aperta in questo controllo: il messaggio falso che compare nella conversazione dei messaggi veri (mittente alfanumerico copiato); l'accesso gratuito ai propri dati nelle banche dati del credito; la risposta falsa nel questionario sulla salute che può far perdere l'indennizzo (art. 1892 del codice civile); l'impignorabilità delle somme delle polizze vita (art. 1923 del codice civile, con limiti); il KID di tre pagine al massimo (regolamento UE sui PRIIP); ConciliaWeb dell'AGCOM gratuito e obbligatorio prima del giudice. I limiti di valore dell'Arbitro Assicurativo cambiano per tipo di polizza e non sono nel testo.

## Unità "La pensione" (`basi-u14`), controllo del 12 novembre 2026

Regole italiane. Da riguardare ogni gennaio (requisiti, deducibilità, coefficienti: quelli del 2027-2028 escono a fine 2026) e ogni giugno, quando la COVIP pubblica la relazione annuale.

| Nella lezione | Fonte |
|---|---|
| Requisiti 2026: vecchiaia a 67 anni con 20 di contributi; anticipata con 42 anni e 10 mesi (41 e 10 mesi le donne); a 64 anni con 20 di contributi e pensione sopra tre volte l'assegno sociale, o a 71 con 5 anni, per chi versa dal 1996 | [Money.it](https://www.money.it/pensioni-ecco-nuovi-requisiti-prossimi-4-anni), 17 ottobre 2025 |
| Aumento di un mese nel 2027 e di tre mesi in tutto dal 2028 | Circolare INPS 28 del 16 marzo 2026: [Fisco e Tasse](https://www.fiscoetasse.com/new-rassegna-stampa/3706-eta-pensione-2027-2028-ecco-i-nuovi-requisiti.html) |
| Coefficienti di trasformazione 2025-2026 (64 anni 5,088%; 67 anni 5,608%; 70 anni 6,258%; 71 anni 6,510%), rivisti ogni due anni; esempio 300.000 € × 5,608% = 16.824 € | [LeggiOggi](https://www.leggioggi.it/pensioni-2025-assegni-contributivi-piu-bassi/), 9 aprile 2025 |
| Rivalutazione del montante con la media di cinque anni del PIL nominale: 4,04% sui montanti a fine 2024 (3,66% l'anno prima) | [Businessonline](https://www.businessonline.it/news/nuove-pensioni-2026-come-cambia-limporto-con-i-nuovi-montanti-contributivi-rivalutati-al-404-calcolo-ed-esempi_n79515.html), 31 ottobre 2025 |
| Tasso di sostituzione in calo per le generazioni più giovani | Proiezioni della Ragioneria generale dello Stato riprese da [QuiFinanza](https://quifinanza.it/pensioni/assegno-pensionistico-uguale-ultimo-stipendio/847541/), 30 agosto 2024: nel testo c'è solo la direzione, non le cifre |
| Fondi pensione a fine 2025: 10,5 milioni di iscritti, il 39,9% delle forze di lavoro; costi medi a dieci anni 0,47% (negoziali), 1,36% (aperti), 2,17% (PIP); in dieci anni circa il 5% l'anno le linee più azionarie contro il 2,5% del TFR | Relazione COVIP: [Teleborsa](https://www.teleborsa.it/News/2026/06/10/fondi-pensione-verso-i-10-5-milioni-di-iscritti-con-quota-di-under-35-che-sale-al-20-8percent-141.html), 10 giugno 2026 |
| Legge 199/2025: deducibilità fino a 5.300 € dal 2026; adesione automatica dei neoassunti del settore privato dal 1° luglio 2026, con 60 giorni per scegliere altro | [EC News](https://www.ecnews.it/lavoro/prestazioni-assistenziali-e-previdenziali/pensioni/legge-bilancio-2026-novita-previdenza-complementare/), 17 marzo 2026; [Fiscozen](https://www.fiscozen.it/news/previdenza-complementare-cosa-cambia-dal-2026-tra-adesione-automatica-portabilita-del-contributo-datoriale-e-nuovo-limite-di-deducibilita/), 6 ottobre 2026; [Elsa](https://ciaoelsa.com/blog/novita-fondi-pensione-2026), 30 giugno 2026 |
| Anticipazioni (75% per spese sanitarie in ogni momento; 75% per la prima casa e 30% per altre esigenze dopo 8 anni); rendimenti tassati al 20%; prestazioni al 15% che scende di 0,3 punti l'anno dopo il quindicesimo, fino al 9% | [We Wealth](https://www.we-wealth.com/news/consulenza-patrimoniale/previdenza/fondi-pensione-tutto-quello-che-ce-da-sapere-1), 10 agosto 2022 |
| Scelta del fondo irrevocabile, scelta dell'azienda sempre modificabile | COVIP citata da [Money.it](https://www.money.it/tfr-nel-fondo-pensione-nuovo-silenzio-assenzo-attenzione-non-sara-piu-possibile-tornare-indietro), 21 novembre 2024 |
| TFR in azienda: tassazione separata con aliquota minima del 23%; Fondo di Tesoreria INPS nelle aziende da 50 dipendenti; Fondo di garanzia INPS; contributo del datore tra 0,55% e 2% se il lavoratore versa il minimo | [Centro Fiscale](https://centrofiscale.com/tfr-azienda-fondo-pensione-dove-conviene/), 2 luglio 2026 |

Ipotesi delle leve (`pensione`, `fondo`, `tfrscelta` in `p35_steps.js`), tutte scritte anche nel testo:
- `pensione`: montante = 33% dello stipendio lordo medio per ogni anno di contributi, in euro di oggi (contributi rivalutati quanto i prezzi); pensione = montante × coefficiente 2025-2026. Con 30.000 €, 35 anni e 67 anni: 346.500 € di montante, 19.432 € l'anno, 1.495 € al mese per tredici mensilità, il 65% dello stipendio. Ogni anno di lavoro vale l'1,85% dello stipendio (33% × 5,608%). È una stima prudente rispetto a uno stipendio fermo e ottimista rispetto all'ultimo stipendio di una carriera in crescita: per questo il testo parla di stipendio medio.
- `fondo`: RAL 30.000 €, TFR 173 € al mese (2.072 € l'anno), datore 40 € al mese se il lavoratore ne versa almeno 25 (esempio, circa 1,6% e 1%), rendimento del 4% prima dei costi, risparmio fiscale del 23%. Con 30 € al mese per 30 anni: 134.917 € con costi dell'1,25%, 152.932 € con lo 0,5%.
- `tfrscelta`: quota annua 2.072 €; in azienda rivalutazione netta (1,5% + 75% dell'inflazione) × 0,83 e imposta finale del 23% sulle quote; nel fondo rendimento netto scelto e imposta finale sulle quote tra il 15% e il 9%. Con inflazione al 2% e 30 anni il fondo vince dal 2% netto in su; con inflazione al 5% dal 4%.

Senza una pagina aperta in questo controllo: il simulatore INPS della pensione futura; l'anno 2022 chiuso in perdita dai fondi pensione; la tassazione ordinaria al 26% dei rendimenti finanziari.

## Unità "Capire le notizie" (`basi-u15`), controllo del 12 novembre 2026

I dati citati come esempio vanno aggiornati: PIL e prezzi ogni trimestre, conti pubblici ad aprile e a ottobre, rating a ogni revisione (S&P decide il 13 novembre 2026), pesi del FTSE MIB ogni sei mesi.

| Nella lezione | Fonte |
|---|---|
| PIL del terzo trimestre 2026: fermo sul trimestre prima, +0,8% su un anno prima | [ISTAT](https://www.istat.it/comunicato-stampa/stima-preliminare-del-pil-iii-trimestre-2026/), 30 ottobre 2026 |
| Prezzi a ottobre 2026: +5,4% su base annua, +0,9% sul mese, carrello della spesa +2,5%, energia +31,4% | [ISTAT](https://www.istat.it/comunicato-stampa/prezzi-al-consumo-dati-provvisori-ottobre-2026/), 30 ottobre 2026 |
| Settembre 2026: tasso di occupazione 63,0%, disoccupazione 6,3%, inattività 32,7% (da cui i 63, 4 e 33 su 100 della stima iniziale) | ISTAT ripreso da [Teleborsa](https://www.teleborsa.it/News/2026/10/29/italia-a-settembre-crescono-i-disoccupati-mentre-restano-stabili-occupati-e-inattivi-75.html), 29 ottobre 2026 |
| Occupato chi ha lavorato almeno un'ora nella settimana o è assente per non più di tre mesi, cassa integrazione compresa; disoccupato chi ha cercato lavoro nelle ultime quattro settimane ed è disponibile entro due; inattivi tutti gli altri | ISTAT, [Cosa cambia nella nuova rilevazione](https://www.istat.it/notizia/cosa-cambia-nella-nuova-rilevazione/) |
| Conti 2025: deficit 3,1% del PIL, debito 136,7%, interessi 87,2 miliardi pari al 3,8% del PIL, avanzo primario 0,8% | Notifica ISTAT ripresa da [Teleborsa](https://www.teleborsa.it/DettaglioNews/97_2026-10-21_TLB/Istat-notifica-Ue-nel-2025-deficit-al-31-del-Pil-debito-al-1367-25-punti.html), 21 ottobre 2026 |
| Spread a 102 punti il 10 novembre 2026, con BTP al 4,27% e Bund al 3,25% | [QuiFinanza](https://quifinanza.it/economia/finanza/spread-btp-bund-10-novembre-2026/1023611/), 10 novembre 2026 |
| Record dello spread: 574 punti il 9 novembre 2011 | [Blitz quotidiano](https://archivio.blitzquotidiano.it/economia/spread-btp-record-a-574-punti-rendimento-a-747-1011541), 9 novembre 2011 (letto solo il titolo) |
| Rating dell'Italia: S&P BBB+ con outlook positivo, Fitch BBB+ stabile (confermato l'11 settembre 2026), Moody's Baa2 stabile | [AGI](https://www.agi.it/economia/news/2026-09-11/fitch-rating-italia-39013657/), 11 settembre 2026; [Milano Finanza](https://www.milanofinanza.it/news/ai-btp-la-promozione-di-s-p-puo-non-bastare-2720751), 15 ottobre 2026 |
| FTSE MIB: 40 società, indice di soli prezzi, pesi per capitalizzazione con tetto del 15%; a fine giugno 2026 UniCredit 15,95%, Intesa 12,44%, Enel 10,32%, e le prime cinque oltre metà dell'indice | [OraFinanza](https://www.orafinanza.it/it/cos-e-l-indice-ftse-mib-e-perche-e-cosi-importante), 10 settembre 2026 |

Leve (`lavoro`, `debito`, `indice`): tasso di disoccupazione = disoccupati / (occupati + disoccupati), su 100 persone tra 15 e 64 anni; debito dell'anno dopo = debito × (1 + tasso) / (1 + crescita nominale) − saldo primario, partendo dal 137% del PIL per dieci anni; indice = media delle variazioni pesata 60, 30 e 10.

Senza una pagina aperta in questo controllo: i riferimenti europei del 3% e del 60% e la procedura per deficit eccessivo aperta sull'Italia nel 2024; la scala dei rating con il confine tra BBB− e BB+ (Baa3 e Ba1 per Moody's); il DAX a 40 società e l'S&P 500 a 500; il legame tra spread e tassi dei prestiti bancari.
