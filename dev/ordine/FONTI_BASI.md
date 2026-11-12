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
