
// =====================================================================================================
// DATI: percorsi, lezioni, figurine, punteggi
// =====================================================================================================
// "Basi della finanza": primo percorso non d'esame. Contenuti originali, brevi, con un esempio numerico per lezione.
// Le lezioni stanno in basi_src.py (che le controlla e scrive basi.json): build.sh le mette qui sopra come BASI_UNITS.
const BASI = {
  id: 'basi', name: 'Basi della finanza', badge: '€', color: AZ, group: 'basi', ready: true, pace: 48,
  tagline: 'Per chi parte da zero',
  learn: ['Come lavorano interessi, inflazione e tempo', 'Come tenere in ordine entrate, uscite e risparmio', 'Quanto costano i debiti e come proteggersi da imprevisti e truffe', 'Cosa sono azioni, obbligazioni, fondi ed ETF, e come si investe un po\' alla volta', 'Quali errori fa la nostra testa quando investe', 'Come si leggono un bilancio e le notizie di economia'],
  units: BASI_UNITS.map(u => ({ id: u.id, name: u.name, sections: [{ id: u.sid, name: u.name, lessons: u.lessons }] }))
};
// Parole da toccare nelle lezioni di base: ogni parola in grassetto che sta qui si apre con un tocco e mostra una spiegazione in parole semplici.
// La chiave è la parola in minuscolo, come compare in grassetto nelle lezioni; le forme diverse (singolare, plurale) stanno in GLOSS_ALIAS.
const GLOSS_DEF = {
  // ---- i soldi nel tempo ----
  'mezzo di scambio': ['Mezzo di scambio', 'Uno dei tre lavori dei soldi: li dai in cambio di quello che ti serve, senza dover barattare una cosa con un\'altra.'],
  'unità di conto': ['Unità di conto', 'Uno dei tre lavori dei soldi: fanno da metro per misurare e confrontare i prezzi.'],
  'riserva di valore': ['Riserva di valore', 'Uno dei tre lavori dei soldi: conservano valore nel tempo, così puoi guadagnare oggi e spendere più avanti.'],
  investimenti: ['Investimenti', 'Usare dei soldi oggi per averne di più in futuro, accettando un rischio: per esempio comprando azioni, obbligazioni o quote di un fondo.'],
  capitale: ['Capitale', 'La somma di partenza, senza contare gli interessi: quella che presti, depositi o investi, oppure quella che ti viene prestata e che devi restituire.'],
  interessi: ['Interessi', 'Il compenso per l\'uso dei soldi nel tempo. Li ricevi quando presti o depositi dei soldi, li paghi quando li prendi in prestito. Si calcolano come percentuale della somma.'],
  tasso: ['Tasso', 'L\'interesse espresso in percentuale della somma, di solito per un anno. Un tasso del 5% l\'anno vuol dire 5 € di interesse ogni 100 €, ogni anno.'],
  'interesse semplice': ['Interesse semplice', 'Interesse calcolato sempre e solo sul capitale di partenza. Gli interessi sono uguali ogni anno.'],
  montante: ['Montante', 'La cifra finale: il capitale di partenza più gli interessi maturati.'],
  'interesse composto': ['Interesse composto', 'Interesse calcolato sul capitale più gli interessi già maturati. Gli interessi producono altri interessi, e la cifra cresce sempre più in fretta.'],
  inflazione: ['Inflazione', 'L\'aumento generale dei prezzi nel tempo. Con un\'inflazione del 3% l\'anno, quello che oggi costa 100 € tra un anno costa in media 103 €.'],
  paniere: ['Paniere', 'L\'elenco di beni e servizi che rappresenta la spesa tipica delle famiglie. Si usa per misurare di quanto salgono i prezzi.'],
  'potere d\'acquisto': ['Potere d\'acquisto', 'Quante cose puoi comprare con una certa cifra. Se i prezzi salgono e la cifra resta ferma, il potere d\'acquisto scende.'],
  'tasso nominale': ['Tasso nominale', 'Il tasso scritto sul contratto: dice di quanto cresce la cifra, senza tenere conto dell\'inflazione.'],
  'tasso reale': ['Tasso reale', 'Il tasso al netto dell\'inflazione: dice di quanto cresce davvero quello che puoi comprare. Vale circa tasso nominale meno inflazione.'],
  // ---- entrate e uscite ----
  entrate: ['Entrate', 'I soldi che ti arrivano in un periodo: stipendio, pensione, affitti incassati.'],
  uscite: ['Uscite', 'I soldi che spendi in un periodo, dalle bollette al caffè.'],
  saldo: ['Saldo', 'La differenza tra entrate e uscite. Se è positivo ti avanza qualcosa, se è negativo hai speso più di quanto hai guadagnato.'],
  'spese fisse': ['Spese fisse', 'Le spese che tornano ogni mese con la stessa cifra o quasi, come affitto, bollette e abbonamenti.'],
  'spese variabili': ['Spese variabili', 'Le spese che cambiano da un mese all\'altro e dipendono da quello che fai, come la spesa, le cene fuori e i vestiti.'],
  risparmio: ['Risparmio', 'La parte delle entrate che non spendi e metti da parte.'],
  budget: ['Budget', 'Un piano che decide prima come userai i soldi del mese: quanto alle spese e quanto al risparmio.'],
  bisogni: ['Bisogni', 'Le spese di cui non puoi fare a meno: casa, bollette, cibo, trasporti per andare al lavoro.'],
  desideri: ['Desideri', 'Le spese che rendono la vita più piacevole ma che potresti ridurre: cene fuori, viaggi, abbonamenti.'],
  'fondo di emergenza': ['Fondo di emergenza', 'Una somma tenuta da parte solo per gli imprevisti, di solito pari a 3-6 mesi di spese, su un conto da cui puoi ritirarla subito.'],
  liquido: ['Liquido', 'Si dice di soldi o investimenti che puoi usare in poco tempo e senza perderci. Il conto corrente è liquido, una casa no.'],
  'liquidità': ['Liquidità', 'Quanto in fretta puoi trasformare qualcosa in denaro senza perderci. Si chiamano liquidità anche i soldi pronti da usare.'],
  'conto corrente': ['Conto corrente', 'Il conto di tutti i giorni: serve per incassare lo stipendio e per pagare. Rende poco o niente.'],
  'conto deposito': ['Conto deposito', 'Un conto fatto per lasciare ferma una somma in cambio di un interesse. Può essere libero, se ritiri quando vuoi, oppure vincolato per un certo tempo.'],
  // ---- la banca e i pagamenti ----
  'imposta di bollo': ['Imposta di bollo', 'Una tassa in cifra fissa che la banca incassa per lo Stato. Sul conto corrente di una persona è di 34,20 € l\'anno, dovuta solo se la giacenza media supera 5.000 €.'],
  'giacenza media': ['Giacenza media', 'La media dei saldi di tutti i giorni di un periodo: si sommano i saldi di ogni giorno e si divide per il numero dei giorni.'],
  'riepilogo delle spese': ['Riepilogo delle spese', 'Il documento che la banca ti manda una volta l\'anno con tutte le spese che hai pagato per il conto, voce per voce.'],
  'carta di debito': ['Carta di debito', 'Una carta legata al conto corrente: quando paghi o prelevi, i soldi escono quasi subito dal conto.'],
  'carta di credito': ['Carta di credito', 'Una carta con cui paghi usando soldi che la banca ti anticipa, fino a un tetto mensile. Li restituisci il mese dopo tutti insieme, oppure a rate pagando interessi.'],
  prepagata: ['Carta prepagata', 'Una carta che carichi tu in anticipo: puoi spendere solo quello che ci hai messo sopra.'],
  plafond: ['Plafond', 'Un tetto massimo. Per una carta di credito è il massimo che puoi spendere in un mese.'],
  'a saldo': ['A saldo', 'Il modo di usare la carta di credito senza interessi: le spese del mese vengono addebitate tutte insieme il mese dopo.'],
  'pre-autorizzazione': ['Pre-autorizzazione', 'Un blocco temporaneo di una somma sulla carta, usato come cauzione da hotel, noleggi e distributori. I soldi non escono, ma non li puoi usare finché il blocco non viene tolto.'],
  'anticipo di contante': ['Anticipo di contante', 'Il prelievo di contanti fatto con una carta di credito. È un piccolo prestito e ha una commissione a parte.'],
  'bonifico istantaneo': ['Bonifico istantaneo', 'Un bonifico che arriva in dieci secondi, a ogni ora e in ogni giorno dell\'anno. Una volta partito non si può fermare.'],
  iban: ['IBAN', 'Il codice che identifica un conto. In Italia ha 27 caratteri: la sigla del Paese, i caratteri di controllo, la banca, la filiale e il numero del conto.'],
  'orario limite': ['Orario limite', 'L\'ora oltre la quale la banca tratta un ordine come se fosse arrivato il giorno lavorativo seguente.'],
  'verifica del beneficiario': ['Verifica del beneficiario', 'Il controllo che la banca fa prima di un bonifico: confronta il nome che hai scritto con quello a cui è intestato l\'IBAN e ti dice se corrispondono.'],
  'addebito diretto': ['Addebito diretto', 'Un pagamento in cui è l\'azienda a prelevare i soldi dal tuo conto, perché le hai firmato un permesso. Si usa per bollette, rate e abbonamenti.'],
  'fondo di garanzia': ['Fondo di garanzia dei depositi', 'Il fondo, finanziato dalle banche, che rimborsa i depositi quando una banca fallisce: fino a 100.000 € per persona e per banca.'],
  depositi: ['Depositi', 'I soldi affidati a una banca, che la banca deve restituirti: conto corrente, conto deposito, libretto di risparmio.'],
  'istituti di pagamento': ['Istituti di pagamento', 'Società autorizzate a offrire conti e carte per pagare senza essere banche. Devono tenere i soldi dei clienti separati dai propri.'],
  'autenticazione forte': ['Autenticazione forte', 'La conferma di un pagamento con due prove di tipo diverso: qualcosa che sai (il PIN), che hai (la carta, il telefono) o che sei (l\'impronta, il volto).'],
  'colpa grave': ['Colpa grave', 'Una disattenzione seria nel custodire carta e codici: per esempio tenere il PIN insieme alla carta, o dare a qualcuno i codici di conferma. Può far perdere il diritto al rimborso.'],
  chargeback: ['Chargeback', 'La contestazione di un pagamento fatto con la carta, per esempio se la merce non arriva. La apre la tua banca presso il circuito della carta. È una regola dei circuiti, non un diritto scritto nella legge.'],
  // ---- debiti e prestiti ----
  rata: ['Rata', 'La cifra che versi a ogni scadenza per restituire un prestito. Dentro ci sono una parte di interessi e una parte di capitale.'],
  'quota interessi': ['Quota interessi', 'La parte della rata che paga gli interessi di quel periodo. Non fa scendere il debito.'],
  'quota capitale': ['Quota capitale', 'La parte della rata che restituisce un pezzo del prestito. È quella che fa scendere il debito.'],
  'debito residuo': ['Debito residuo', 'Quello che devi ancora restituire in questo momento.'],
  tan: ['TAN', 'Tasso annuo nominale. È il tasso di interesse del prestito, senza contare le spese.'],
  taeg: ['TAEG', 'Tasso annuo effettivo globale. È quanto costa il prestito in un anno, mettendo insieme interessi e spese obbligatorie. È il numero da confrontare tra offerte diverse.'],
  spese: ['Spese', 'I costi di un prestito che non sono interessi: aprire la pratica, incassare le rate, le assicurazioni che la banca ti obbliga a fare.'],
  mutuo: ['Mutuo', 'Il prestito a lunga durata che si chiede per comprare casa. È garantito dalla casa stessa.'],
  ipoteca: ['Ipoteca', 'La garanzia che dai alla banca quando fai un mutuo: se smetti di pagare, la banca può far vendere la casa per riprendersi i soldi.'],
  'tasso fisso': ['Tasso fisso', 'Un tasso che resta uguale per tutta la durata del prestito. Anche la rata non cambia.'],
  'tasso variabile': ['Tasso variabile', 'Un tasso che segue un tasso di riferimento del mercato: quando quello sale o scende, cambia anche la tua rata.'],
  spread: ['Spread', 'La maggiorazione fissa che la banca aggiunge al tasso di riferimento. È il suo guadagno sul prestito.'],
  revolving: ['Carta revolving', 'Una carta di credito che ti fa restituire le spese a rate, pagando interessi sul debito che resta. Il tasso è spesso alto.'],
  // ---- proteggersi ----
  assicurazione: ['Assicurazione', 'Un accordo in cui paghi una cifra piccola e certa a una compagnia, che in cambio ti risarcisce se subisci un danno previsto dal contratto.'],
  premio: ['Premio', 'Il prezzo dell\'assicurazione: la cifra che paghi alla compagnia, di solito una volta l\'anno.'],
  indennizzo: ['Indennizzo', 'La somma che la compagnia di assicurazione ti paga quando subisci un danno coperto dalla polizza.'],
  polizza: ['Polizza', 'Il contratto di assicurazione. Dice che cosa è coperto, quanto paghi e quanto ricevi in caso di danno.'],
  esclusioni: ['Esclusioni', 'I casi in cui la polizza non paga, scritti nel contratto. Sono la parte da leggere con più attenzione.'],
  franchigia: ['Franchigia', 'La parte fissa di ogni danno che resta a carico tuo. Con una franchigia di 500 €, su un danno di 3.000 € la compagnia ne paga 2.500.'],
  scoperto: ['Scoperto', 'La parte di ogni danno che resta a carico tuo, espressa in percentuale. Con uno scoperto del 10%, su un danno di 3.000 € paghi tu 300 €.'],
  massimale: ['Massimale', 'La cifra più alta che la compagnia paga per un danno. La parte che supera il massimale resta a carico tuo.'],
  'responsabilità civile': ['Responsabilità civile', 'L\'obbligo di risarcire i danni che fai ad altre persone o alle loro cose. L\'assicurazione che la copre si indica con la sigla RC.'],
  'rc auto': ['RC auto', 'L\'assicurazione obbligatoria per chi guida: paga i danni che fai agli altri con il tuo veicolo.'],
  'schema ponzi': ['Schema Ponzi', 'Una truffa in cui non esiste nessun investimento: i guadagni pagati ai primi arrivati sono i soldi versati da chi entra dopo. Quando i nuovi arrivi finiscono, crolla.'],
  // ---- gli strumenti ----
  azioni: ['Azioni', 'Quote di proprietà di un\'azienda. Rendono con i dividendi e con l\'aumento del prezzo, ma niente è garantito.'],
  dividendo: ['Dividendo', 'La parte di utile che un\'azienda distribuisce ai suoi soci, cioè a chi possiede le azioni.'],
  obbligazioni: ['Obbligazioni', 'Prestiti fatti a un\'azienda o a uno Stato. In cambio ricevi interessi a scadenze fisse, le cedole, e il rimborso del capitale alla scadenza.'],
  cedola: ['Cedola', 'L\'interesse che un\'obbligazione paga a scadenze fisse, per esempio una volta l\'anno.'],
  rimborso: ['Rimborso', 'La restituzione del capitale prestato, alla scadenza dell\'obbligazione.'],
  'fondo comune': ['Fondo comune', 'Uno strumento che raccoglie i soldi di tanti risparmiatori e li investe in molti titoli insieme. Chi partecipa possiede quote del fondo.'],
  quote: ['Quote', 'Le parti uguali in cui è diviso un fondo. Chi investe in un fondo compra quote, e il valore di ogni quota cambia nel tempo.'],
  etf: ['ETF', 'Un fondo che si compra e si vende in borsa come un\'azione. Di solito replica un indice, cioè un paniere di titoli scelto con una regola fissa, e costa poco.'],
  // ---- rischio, tempo e costi ----
  rischio: ['Rischio', 'La possibilità che il risultato sia diverso da quello atteso, in meglio o in peggio. Più è alto, più i risultati possono allontanarsi dalla media.'],
  diversificare: ['Diversificare', 'Dividere i soldi tra tanti investimenti diversi, così il guaio di uno solo pesa poco sul totale.'],
  'orizzonte temporale': ['Orizzonte temporale', 'Il tempo che passa prima che i soldi investiti ti servano. Più è lungo, più oscillazioni puoi sopportare.'],
  lordo: ['Lordo', 'Prima di togliere costi e tasse.'],
  netto: ['Netto', 'Quello che resta dopo aver tolto costi e tasse.'],
  // ---- investire passo passo ----
  pic: ['PIC', 'Piano di investimento del capitale: investi una somma in una volta sola.'],
  pac: ['PAC', 'Piano di accumulo del capitale: investi una cifra fissa a scadenze regolari, di solito ogni mese.'],
  'prezzo medio di carico': ['Prezzo medio di carico', 'Quanto ti è costata in media ogni quota o azione: il totale versato diviso il numero di quote che possiedi. È il tuo punto di pareggio.'],
  'asset allocation': ['Asset allocation', 'Come dividi i tuoi soldi tra tipi diversi di investimento, per esempio quanta parte in azioni e quanta in obbligazioni.'],
  ribilanciare: ['Ribilanciare', 'Riportare il portafoglio alla divisione che avevi scelto, vendendo un po\' di quello che è salito e comprando quello che è rimasto indietro.'],
  // ---- la testa dell'investitore ----
  'avversione alle perdite': ['Avversione alle perdite', 'La tendenza a soffrire per una perdita più di quanto si gode per un guadagno della stessa misura: circa il doppio.'],
  fomo: ['FOMO', 'Dall\'inglese fear of missing out: la paura di restare fuori da un guadagno che gli altri stanno facendo.'],
  'effetto gregge': ['Effetto gregge', 'La tendenza a fare una cosa perché la fanno tutti, senza chiedersi se ha senso.'],
  bolla: ['Bolla', 'Una fase in cui i prezzi salgono molto più del valore reale di quello che si compra, spinti dall\'entusiasmo. Finisce con un calo brusco.'],
  'eccesso di fiducia': ['Eccesso di fiducia', 'La tendenza a credersi più bravi o più informati della media. Negli investimenti porta a rischiare troppo e a comprare e vendere troppo spesso.'],
  commissione: ['Commissione', 'Il compenso che paghi a un intermediario per un servizio, per esempio a ogni acquisto o vendita di titoli.'],
  // ---- leggere un'azienda ----
  'stato patrimoniale': ['Stato patrimoniale', 'Il documento che fotografa un\'azienda in un giorno preciso: che cosa possiede, che cosa deve ad altri e che cosa resta ai soci.'],
  'attività': ['Attività', 'Quello che un\'azienda possiede: cassa, magazzino, impianti, crediti verso i clienti.'],
  'passività': ['Passività', 'Quello che un\'azienda deve ad altri: debiti con banche, fornitori, fisco.'],
  'patrimonio netto': ['Patrimonio netto', 'Quello che resta ai soci di un\'azienda una volta pagati tutti i debiti: attività meno passività.'],
  'conto economico': ['Conto economico', 'Il documento che racconta un periodo, di solito un anno: quanto l\'azienda ha incassato, quanto ha speso e quanto le è rimasto.'],
  ricavi: ['Ricavi', 'Quello che un\'azienda incassa vendendo i suoi prodotti o servizi.'],
  costi: ['Costi', 'Quello che si spende per ottenere qualcosa. Per un\'azienda sono materie prime, stipendi, affitti; per chi investe sono commissioni e spese di gestione.'],
  utile: ['Utile', 'Quello che resta a un\'azienda dopo aver tolto i costi dai ricavi.'],
  'margine lordo': ['Margine lordo', 'I ricavi meno il costo dei prodotti venduti. Dice quanto resta prima di pagare stipendi, affitti e le altre spese di struttura.'],
  'risultato operativo': ['Risultato operativo', 'Quello che l\'azienda guadagna dalla sua attività, prima di pagare interessi e imposte.'],
  'utile netto': ['Utile netto', 'Quello che resta all\'azienda dopo aver tolto tutto: costi, interessi e imposte.'],
  'margine netto': ['Margine netto', 'L\'utile netto diviso i ricavi: quanti centesimi restano all\'azienda per ogni euro venduto.'],
  competenza: ['Competenza', 'La regola per cui ricavi e costi si registrano quando nascono, non quando i soldi entrano o escono.'],
  ammortamento: ['Ammortamento', 'La quota del costo di un bene che dura più anni, come un macchinario, contata in ogni anno in cui viene usato.'],
  'rendiconto finanziario': ['Rendiconto finanziario', 'Il documento che mostra i movimenti di cassa veri di un\'azienda: i soldi entrati e quelli usciti.'],
  'p/e': ['P/E', 'Il rapporto tra il prezzo di un\'azione e l\'utile per azione: quanti euro paghi per ogni euro di utile annuo.'],
  // ---- l'economia intorno ----
  'banca centrale': ['Banca centrale', 'L\'istituzione che gestisce la moneta di un Paese o di un\'area, come la BCE per l\'euro. Decide i tassi di riferimento per tenere stabili i prezzi.'],
  'tassi di riferimento': ['Tassi di riferimento', 'I tassi decisi dalla banca centrale. Da questi dipendono, a cascata, i tassi di mutui, prestiti e conti deposito.'],
  'tasso di cambio': ['Tasso di cambio', 'Il prezzo di una moneta espresso in un\'altra. Se il cambio euro/dollaro è 1,10, con 1 € compri 1,10 $.'],
  'rischio di cambio': ['Rischio di cambio', 'Il rischio di guadagnare o perdere perché cambia il valore della moneta in cui hai investito.'],
  pil: ['PIL', 'Prodotto interno lordo: il valore di tutti i beni e i servizi prodotti in un Paese in un anno. È il termometro dell\'economia.'],
  recessione: ['Recessione', 'Una fase in cui l\'economia si restringe. La regola pratica: il PIL scende per due trimestri consecutivi.'],
  // Notizie
  'indice di borsa': ['Indice di borsa', 'Un numero che riassume l\'andamento di un gruppo di azioni. Se l\'indice sale, in media quelle azioni sono salite.'],
  'inflazione di fondo': ['Inflazione di fondo', 'L\'inflazione calcolata lasciando fuori le voci che cambiano prezzo più in fretta, come energia e alimentari. Mostra la tendenza di fondo dei prezzi.'],
  pun: ['PUN', 'Prezzo unico nazionale: il prezzo all\'ingrosso dell\'elettricità in Italia. Molte offerte della luce a prezzo variabile lo seguono.'],
  megawattora: ['Megawattora', 'Mille chilowattora. Una famiglia consuma in media tra 2 e 3 megawattora di elettricità in un anno.'],
  fed: ['Fed', 'La Federal Reserve, la banca centrale degli Stati Uniti. Decide i tassi di interesse del dollaro.'],
  'wall street': ['Wall Street', 'La via di New York dove ha sede la Borsa. Per estensione indica il mercato azionario americano.']
};
const GLOSS_ALIAS = { indice: 'indice di borsa', interesse: 'interessi', rate: 'rata', fisso: 'tasso fisso', variabile: 'tasso variabile', 'interessi sugli interessi': 'interesse composto', azione: 'azioni', obbligazione: 'obbligazioni',
  rc: 'responsabilità civile', 'prezzo/utili': 'p/e', esclusione: 'esclusioni', quota: 'quote', 'schema di ponzi': 'schema ponzi', investimento: 'investimenti', commissioni: 'commissione', 'spesa fissa': 'spese fisse', 'spesa variabile': 'spese variabili',
  'carta prepagata': 'prepagata', 'carte di credito': 'carta di credito', 'carte di debito': 'carta di debito', 'bonifici istantanei': 'bonifico istantaneo', 'addebiti diretti': 'addebito diretto', 'fondo di garanzia dei depositi': 'fondo di garanzia', deposito: 'depositi', 'istituto di pagamento': 'istituti di pagamento' };
const glossKey = t => { const k = String(t || '').toLowerCase().replace(/[.,;:!?()«»“”]/g, '').replace(/\s+/g, ' ').trim(); return GLOSS_DEF[k] ? k : GLOSS_ALIAS[k] || null; };
const hasTerms = text => (String(text || '').match(/\*\*[^*]+\*\*/g) || []).some(m => glossKey(m.slice(2, -2)));

// Percorsi non ancora pronti: compaiono nel catalogo come "in arrivo".
const COMING = [
  { id: 'risparmio', name: 'Risparmio e budget', group: 'basi', color: MENTA, icon: 'wallet' },
  { id: 'azob', name: 'Azioni e obbligazioni', group: 'invest', color: PESCA, icon: 'trend' },
  { id: 'fondi', name: 'Fondi ed ETF', group: 'invest', color: LILLA, icon: 'pie' },
  { id: 'cfa1', name: 'CFA Level I', group: 'cert' }, { id: 'frm1', name: 'FRM Part I', group: 'cert' }, { id: 'caia1', name: 'CAIA Level I', group: 'cert' }
];

let COURSES_MEMO = null;
const losMinutes = l => { const c = l.content || {}; const n = (c.introduction || '').length + (c.sections || []).reduce((s, x) => s + (x.content || '').length, 0); return clamp(Math.round(n / 900) + (l.question ? 2 : 1), 2, 20); };
function courses() {
  if (COURSES_MEMO) return COURSES_MEMO;
  const CFA = (K && K.CFA) || {};
  const units = ['equityValuation', 'portfolioManagement', 'equity'].filter(k => CFA[k]).map(k => {
    const t = CFA[k];
    return { id: k, name: t.name, sections: t.modules.map(m => ({
      id: m.id, name: m.title, num: m.number,
      lessons: m.los.map((l, i) => ({ key: `${m.id}-${l.id}`, kind: 'los', title: K.flShortTitle(l.title), code: (l.code || `LOS ${m.number}${l.id}`).replace(/^LOS\s*/, ''), los: l, minutes: losMinutes(l) }))
    })) };
  });
  const cfa2 = { id: 'cfa2', name: 'CFA Level II', badge: 'L2', color: AZ, group: 'cert', ready: true, pace: 90, tagline: 'Per chi prepara l\'esame',
    learn: ['Valutare un\'azione con dividendi, flussi di cassa, multipli e residual income', 'ETF, modelli multifattoriali, VaR e gestione attiva', 'Domande in inglese, come all\'esame'], units };
  COURSES_MEMO = [BASI, cfa2];
  // indici utili
  COURSES_MEMO.forEach(c => { c.lessons = []; c.units.forEach((u, ui) => u.sections.forEach(s => s.lessons.forEach(l => { l.course = c; l.unit = u; l.ui = ui; l.section = s; if (!l.kind) l.kind = 'base'; c.lessons.push(l); }))); });
  return COURSES_MEMO;
}
const courseById = id => courses().find(c => c.id === id);
let LESSON_MAP = null;
const lessonByKey = key => { if (!LESSON_MAP) { LESSON_MAP = {}; courses().forEach(c => c.lessons.forEach(l => { LESSON_MAP[l.key] = l; })); } return LESSON_MAP[key]; };
const isDone = key => (K.losProgress || []).includes(key) || s2get().basi.includes(key);
const doneCount = list => list.filter(l => isDone(l.key)).length;
const unitLessons = u => u.sections.flatMap(s => s.lessons);

// ---- su misura: l'obiettivo scelto alla registrazione decide che cosa c'è nell'app ----
// Un obiettivo porta un percorso di partenza: un corso intero, oppure una scelta ordinata delle sue unità più quelle ancora da scrivere ("in arrivo").
// Tutte le schede leggono da qui: chi parte da zero non trova il CFA finché non lo aggiunge da "Scopri".
const MIS_SOON = {
  azob: ['Azioni e obbligazioni', 'tutti i tipi di azioni, BOT, BTP e obbligazioni societarie, ognuno con un esempio in cifre'],
  fondi: ['Fondi ed ETF', 'fondi attivi e indicizzati, ad accumulo o a distribuzione, con i costi in cifre'],
  'w-salute': ['Capire se un\'azienda sta bene', 'margini, EBITDA, ROE, debito'],
  'w-cassa': ['La cassa', 'crediti, magazzino, fornitori'],
  'w-costi': ['Costi, prezzi e margini', 'punto di pareggio, budget'],
  'w-invest': ['Decidere un investimento', 'VAN, TIR, tempo di rientro'],
  'w-finanz': ['Finanziare l\'azienda', 'debito o capitale, banca, leasing'],
  'w-valuta': ['Valutare un\'azienda', 'i multipli e l\'idea del DCF']
};
// una riga su cosa c'è dentro ogni unità delle Basi (schermata "Ecco la tua FinLearn")
const MIS_SUB = { 'basi-u1': 'Interessi, inflazione, tasso reale', 'basi-u7': 'Budget, fondo di emergenza, obiettivi', 'basi-u11': 'Conto, carte, bonifici, garanzia dei depositi', 'basi-u4': 'Prestiti, TAN e TAEG, mutuo', 'basi-u8': 'Assicurazioni e truffe da riconoscere', 'basi-u2': 'Azioni, obbligazioni, fondi, conti',
  'basi-u3': 'Rendimento, diversificare, orizzonte temporale', 'basi-u9': 'Un po\' alla volta, regola del 72', 'basi-u10': 'Paura di perdere, seguire la massa', 'basi-u5': 'Bilancio, utile, cassa, prezzo e valore', 'basi-u6': 'Banche centrali, cambi, ciclo economico' };
// stops: le unità del percorso in ordine; "+nome" è un'unità in arrivo. null = tutto il corso.
const MIS_PATHS = {
  zero: { goal: 'Capire la finanza da zero', name: 'Basi della finanza', pill: 'Per chi parte da zero', course: 'basi', color: AZ, stops: null },
  invest: { goal: 'Investire i miei risparmi', name: 'Investire i miei risparmi', pill: 'Per chi vuole investire', course: 'basi', color: PESCA, ico: TrendingUp, stops: ['basi-u1', 'basi-u2', 'basi-u3', '+azob', '+fondi', 'basi-u9', 'basi-u10'] },
  work: { goal: 'Usarla al lavoro', name: 'Finanza per il lavoro', pill: 'Per chi la usa al lavoro', course: 'basi', color: MENTA, ico: Briefcase, stops: ['basi-u5', '+w-salute', '+w-cassa', '+w-costi', 'basi-u1', '+w-invest', '+w-finanz', 'basi-u6', '+w-valuta'] },
  exam: { goal: 'Preparare un esame', name: 'CFA Level II', pill: 'Per l\'esame CFA Level II', course: 'cfa2', color: AZ, stops: null }
};
// Chi usava l'app prima di "su misura": l'obiettivo si ricava da quello che aveva scelto o iniziato, e i percorsi iniziati restano tutti.
function misDerive(s) {
  const ob = s.onboard || {}, st = new Set(s.started || []), done = s.basi || [];
  const cfa = st.has('cfa2') || !!(K && (K.losProgress || []).length), basi = st.has('basi') || done.length > 0;
  const goal = MIS_PATHS[ob.goal] ? ob.goal : cfa ? 'exam' : 'zero', P = MIS_PATHS[goal], add = [];
  if (cfa && P.course !== 'cfa2') add.push('cfa2');
  if (basi && P.course !== 'basi') add.push('basi');
  const more = P.stops ? BASI.units.filter(u => !P.stops.includes(u.id) && unitLessons(u).some(l => done.includes(l.key))).map(u => u.id) : [];
  return { goal, level: ob.start === 'some' ? 'some' : 'zero', known: [], more, add, t: 0 };
}
let MIS_MEMO = null, MIS_DRAFT = null;   // MIS_DRAFT: la registrazione mostra il percorso prima di salvarlo
function misGet() {
  if (MIS_DRAFT) return MIS_DRAFT;
  const s = s2get(); if (s.mis && MIS_PATHS[s.mis.goal]) return s.mis;
  const n = (K && (K.losProgress || []).length) || 0;
  if (!MIS_MEMO || MIS_MEMO.s !== s || MIS_MEMO.n !== n) MIS_MEMO = { s, n, m: misDerive(s) };
  return MIS_MEMO.m;
}
const misP = () => MIS_PATHS[misGet().goal];
function misCourses() { const ids = [misP().course, ...(misGet().add || [])]; return ids.filter((x, i) => ids.indexOf(x) === i).map(id => courseById(id)).filter(Boolean); }
const inMyApp = id => misCourses().some(c => c.id === id);
// le unità di un corso che fanno parte del percorso, in ordine (per i corsi aggiunti interi: tutte)
function misUnits(c) {
  if (!c) return [];
  const P = misP(); if (c.id !== P.course || !P.stops) return c.units;
  const ids = P.stops.filter(x => x[0] !== '+'), more = misGet().more || [];
  return [...ids, ...c.units.map(u => u.id).filter(x => more.includes(x) && !ids.includes(x))].map(id => c.units.find(u => u.id === id)).filter(Boolean);
}
const misLessons = c => misUnits(c).flatMap(unitLessons);
// come misUnits, ma con le unità "in arrivo" al loro posto: [{ u }] oppure [{ soon: { id, name, sub } }]
function misStops(c) {
  if (!c) return [];
  const P = misP(); if (c.id !== P.course || !P.stops) return c.units.map(u => ({ u }));
  const out = P.stops.map(x => (x[0] === '+' ? { soon: { id: x.slice(1), name: MIS_SOON[x.slice(1)][0], sub: MIS_SOON[x.slice(1)][1] } } : { u: c.units.find(u => u.id === x) })).filter(x => x.soon || x.u);
  const more = misGet().more || []; c.units.forEach(u => { if (more.includes(u.id) && !P.stops.includes(u.id)) out.push({ u }); });
  return out;
}
const misRest = c => { const inP = misUnits(c); return c.units.filter(u => !inP.includes(u)); };   // unità del corso che il percorso non usa
const misName = c => (c && c.id === misP().course ? misP().name : c ? c.name : '');
const misIcon = (c, size = 22) => (c && c.id === misP().course && misP().ico ? Ico(misP().ico, size) : c ? c.badge : null);
const misAll = () => misCourses().flatMap(misLessons);
// le lezioni pronte del percorso di un obiettivo (per dire quante sono prima di cambiare)
const misGoalLessons = goal => { const P = MIS_PATHS[goal], c = courseById(P.course); return (P.stops ? P.stops.filter(x => x[0] !== '+').map(id => c.units.find(u => u.id === id)).filter(Boolean) : c.units).flatMap(unitLessons); };
// unità segnate "la sai già" dalle 5 domande della registrazione: contano come fatte nel percorso, ma la figurina si prende solo facendo la lezione
let KNOWN_MEMO = { k: null, set: new Set() };
function knownKeys() {
  const k = misGet().known || null;
  if (KNOWN_MEMO.k !== k) { const set = new Set(); if (k && k.length) courses().forEach(c => c.units.forEach(u => { if (k.includes(u.id)) unitLessons(u).forEach(l => set.add(l.key)); })); KNOWN_MEMO = { k, set }; }
  return KNOWN_MEMO.set;
}
const isHad = key => isDone(key) || knownKeys().has(key);
const hadCount = list => list.filter(l => isHad(l.key)).length;
const coursePct = c => { const ls = misLessons(c); return ls.length ? Math.round(hadCount(ls) / ls.length * 100) : 0; };
// cambia obiettivo: cambia quello che si vede, non quello che si è fatto. Le unità "la sai già" restano solo se stanno nel nuovo percorso.
function misSetGoal(goal) {
  const P = MIS_PATHS[goal]; if (!P) return;
  s2set(s => { const old = misGet(), c = courseById(P.course), keep = P.stops ? P.stops : c.units.map(u => u.id);
    return { mis: Object.assign({}, old, { goal, known: (old.known || []).filter(id => keep.includes(id)), more: P.stops ? BASI.units.filter(u => !P.stops.includes(u.id) && unitLessons(u).some(l => isDone(l.key))).map(u => u.id) : [], add: (old.add || []).filter(id => id !== P.course), t: Date.now() }), cur: P.course }; });
}
const misAddCourse = id => s2set(s => { const m = misGet(); return m.add.includes(id) || MIS_PATHS[m.goal].course === id ? {} : { mis: Object.assign({}, m, { add: [...m.add, id] }) }; });
const misAddUnits = ids => s2set(s => { const m = misGet(); return { mis: Object.assign({}, m, { more: Array.from(new Set([...(m.more || []), ...ids])) }) }; });
const fmtDur = min => { if (min < 60) return `${min} minuti`; const h = Math.floor(min / 60), m = min % 60; return `${h} ${h === 1 ? 'ora' : 'ore'}${m ? ` e ${m} minuti` : ''}`; };
// domande di una lezione (LOS: la domanda d'esame; basi: gli esercizi a scelta)
function lessonQuestions(l) {
  if (l.kind === 'los') return l.los.question ? [{ key: l.key, q: l.los.question.q, options: l.los.question.options, ans: l.los.question.ans, exp: l.los.question.exp, lang: 'en', lesson: l }] : [];
  return (l.ex || []).filter(e => e.type === 'mcq').map((e, i) => ({ key: l.key + (i ? '#' + i : ''), q: e.q, options: e.options, ans: e.ans, exp: e.exp, lesson: l }));
}
const allQuestions = (list) => list.flatMap(lessonQuestions);
// pagine di una lezione, in ordine
function lessonSteps(l) {
  const steps = [];
  if (l.kind === 'los') {
    const c = l.los.content || {};
    if ((c.introduction || '').trim()) steps.push({ k: 'page', title: l.title, text: c.introduction, first: true });
    (c.sections || []).forEach((s, i) => steps.push({ k: 'page', title: String(s.title || '').replace(/^\d+\.\s*/, ''), text: s.content, first: !steps.length && i === 0, head: l.title }));
    const kp = l.los.keyPoints || [], et = l.los.examTips || [];
    if (kp.length || et.length) steps.push({ k: 'recap', points: kp, tips: et });
    lessonQuestions(l).forEach(q => steps.push({ k: 'q', q }));
  } else if (l.flow) {
    // lezione a passi corti: pagine brevi alternate a cose da fare; "In breve" chiude l'ultima pagina
    const qs = lessonQuestions(l), lastPage = l.flow.map(s => s.type).lastIndexOf('page');
    l.flow.forEach((s, i) => {
      if (s.type === 'page') steps.push({ k: 'page', title: s.t, text: s.x, widget: s.widget, fig: s.fig, first: !steps.length, note: i === lastPage ? l.note : null });
      else if (s.type === 'ex') { const e = l.ex[s.i]; if (e.type === 'match') steps.push({ k: 'match', pairs: e.pairs }); else steps.push({ k: 'q', q: qs[l.ex.slice(0, s.i).filter(x => x.type === 'mcq').length] }); }
      else steps.push(Object.assign({}, s, { k: s.type, n: i }));
    });
  } else {
    (l.pages || []).forEach((p, i) => steps.push({ k: 'page', title: p.t, text: p.x, widget: p.widget, first: i === 0, note: i === l.pages.length - 1 ? l.note : null }));
    let qi = 0;
    (l.ex || []).forEach(e => { if (e.type === 'match') steps.push({ k: 'match', pairs: e.pairs }); else { steps.push({ k: 'q', q: lessonQuestions(l)[qi] }); qi++; } });
  }
  return steps;
}
// percorso attuale e prossima lezione
// i percorsi dell'utente sono quelli del suo obiettivo più quelli aggiunti: il primo è sempre quello dell'obiettivo
function startedCourses() { const s = s2get(); const out = new Set(s.started || []); if ((K.losProgress || []).length) out.add('cfa2'); if (s.basi.length) out.add('basi'); return misCourses().filter(c => out.has(c.id)); }
function currentCourse() {
  const s = s2get(); const mine = misCourses();
  return mine.find(c => c.id === s.cur) || mine[0] || null;
}
function nextLesson(c, unitId) {
  const s = s2get(); const album = K.albumLoad(), units = misUnits(c);
  let u = unitId ? c.units.find(x => x.id === unitId) : null;
  if (!u) {
    const lastKey = s.seen && s.seen[c.id]; const ll = lastKey && lessonByKey(lastKey);
    if (ll && ll.course === c && units.includes(ll.unit)) u = ll.unit;
    else { // unità della figurina presa più di recente
      let best = null; misLessons(c).forEach(l => { const a = album[l.key]; if (a && (!best || a.t > best.t)) best = { t: a.t, u: l.unit }; }); u = best ? best.u : units[0];
    }
  }
  const order = [u, ...units.filter(x => x !== u)];
  for (const x of order) { const l = unitLessons(x).find(z => !isHad(z.key)); if (l) return l; }
  return null;
}
function markSeen(l) { s2set(s => ({ cur: l.course.id, started: Array.from(new Set([...(s.started || []), l.course.id])), seen: Object.assign({}, s.seen, { [l.course.id]: l.key }) })); }

// ---- punti, giorni di fila ----
const weekKey = (d = new Date()) => { const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return dayKey(x); };
function addXp(n) { if (!n) return; try { K.setStats(s => Object.assign({}, s, { xp: (s.xp || 0) + n })); } catch (e) {} const wk = weekKey(); s2set(s => ({ xp: { [wk]: ((s.xp || {})[wk] || 0) + n } })); }   // si tiene solo la settimana in corso (serve alla lega)
function streakDays() {
  const a = K.flActLoad(); let n = 0; const d = new Date();
  if (!K.flStudied(a[dayKey(d)])) d.setDate(d.getDate() - 1);
  while (K.flStudied(a[dayKey(d)])) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
const todayMinutes = () => { const a = K.flActLoad()[dayKey()] || {}; return a.min || 0; };
function examDays() { const e = LS.raw('finlearn_exam_date'); if (!e) return null; const n = Math.ceil((new Date(e + 'T09:00:00') - new Date()) / DAY); return isNaN(n) ? null : n; }

// ---- figurine ----
// stato: 'manca' | 'viva' | 'sbiadisce' | 'dorata'
function stickerState(l, album, now) {
  const a = album[l.key]; if (!a) return 'manca';
  if (s2get().gold[l.section.id]) return 'dorata';
  return now < a.due ? 'viva' : 'sbiadisce';
}
function dueLessons() { const album = K.albumLoad(), now = Date.now(); return misCourses().flatMap(c => c.lessons).filter(l => stickerState(l, album, now) === 'sbiadisce').sort((x, y) => album[x.key].due - album[y.key].due); }
const stickerSym = l => l.sym || l.code || '?';
const lessonEmoji = l => { if (l.kind !== 'los') return null; const ic = ((l.los.content && l.los.content.sections) || []).map(x => x.icon).find(Boolean); return ic && !String(ic).startsWith('data:') ? ic : null; };

// ---- risposte e punti deboli ----
// Ogni risposta finisce nelle statistiche storiche dell'app e, con la data, nella memoria nuova (ultime 8 per domanda).
function recordAnswer(q, ok) {
  const key = q.key.split('#')[0];
  try { K.qStatsRecord(key, ok); } catch (e) {}
  s2set(s => { const cur = (s.ans[q.key] || []).slice(-7); cur.push([Date.now(), ok ? 1 : 0]); return { ans: Object.assign({}, s.ans, { [q.key]: cur }) }; });
}
// Punteggio 0-100 per argomento: media delle risposte pesata sul tempo (una risposta di 14 giorni fa vale la metà di una di oggi),
// con due risposte "neutre" di partenza così poche domande non danno giudizi estremi. Senza ripasso il punteggio scivola verso 50.
function topicScores(c) {
  const s = s2get(), st = K.qStatsLoad(), now = Date.now(), out = [];
  c.units.forEach(u => u.sections.forEach(sec => {
    let w = 0, wok = 0, n = 0, nok = 0;
    sec.lessons.forEach(l => lessonQuestions(l).forEach(q => {
      const log = s.ans[q.key];
      if (log && log.length) log.forEach(([t, ok]) => { const k = Math.pow(0.5, (now - t) / (14 * DAY)); w += k; wok += k * ok; n++; nok += ok; });
      else { const r = st[q.key]; if (r && r.n) { const k = 0.5 * Math.min(r.n, 3); w += k; wok += k * (r.ok / r.n); n += r.n; nok += r.ok; } }
    }));
    if (n) out.push({ id: sec.id, name: sec.name, unit: u, section: sec, n, nok, score: Math.round((wok + 1) / (w + 2) * 100) });
  }));
  return out.sort((a, b) => a.score - b.score);
}
// ---- spiegazioni gratis al giorno ----
const FREE_EXPL = 3;
function explState() { const s = s2get(); const today = dayKey(); const n = s.expl && s.expl.d === today ? s.expl.n : 0; return { n, left: Math.max(0, FREE_EXPL - n), pro: !!K.isPro }; }
function spendExplanation() { const today = dayKey(); s2set(s => ({ expl: { d: today, n: (s.expl && s.expl.d === today ? s.expl.n : 0) + 1 } })); }

// ---- le 5 domande della registrazione: servono a saltare le unità che si sanno già ----
// Una domanda per unità (di più se le unità sono poche). Per l'esame non si salta niente: le unità sono materie intere.
function placementFor(goal) {
  const P = MIS_PATHS[goal], c = courseById(P.course), sh = K.flShuffle;
  if (P.course === 'cfa2') { const u = c.units[0]; return { course: c, units: [], items: sh(allQuestions(unitLessons(u))).slice(0, 5).map(q => ({ q, u })) }; }
  const units = (P.stops ? P.stops.filter(x => x[0] !== '+').map(id => c.units.find(u => u.id === id)) : c.units).filter(Boolean);
  const pick = units.slice(0, 5), items = [];
  for (let i = 0; i < 5; i++) { const u = pick[Math.floor(i * pick.length / 5)], used = items.map(x => x.q.key); const q = sh(allQuestions(unitLessons(u))).find(x => !used.includes(x.key)); if (q) items.push({ q, u }); }
  return { course: c, units, items };
}
// le unità iniziali con tutte le risposte giuste sono "la sai già"; ne resta sempre almeno una da fare
function placementKnown(pl, res) {
  const known = [];
  for (const u of pl.units) { const mine = pl.items.map((x, i) => [x, res[i]]).filter(([x]) => x.u === u); if (!mine.length || !mine.every(([, ok]) => ok)) break; known.push(u.id); }
  return known.slice(0, Math.max(0, pl.units.length - 1));
}

// ---- test ----
// kind: 'unit' (verifica di una sezione), 'level' (test di livello), 'mock' (simulazione), 'weak' (allenamento punti deboli), 'mix' (quiz misto)
function buildTest(kind, c, sec) {
  const sh = K.flShuffle;
  if (kind === 'unit') { const qs = sh(allQuestions(sec.lessons)).slice(0, 10); return { id: 'unit:' + sec.id, kind, course: c, section: sec, title: 'Verifica: ' + sec.name, qs, secs: qs.length * c.pace, pass: Math.ceil(qs.length * 0.7), timed: true }; }
  if (kind === 'level') { const qs = sh(allQuestions(misLessons(c))).slice(0, 5); return { id: 'level:' + c.id, kind, course: c, title: 'Test di livello', qs, secs: qs.length * c.pace, pass: Math.ceil(qs.length * 0.6), timed: true }; }
  if (kind === 'mock') { const qs = sh(allQuestions(c.lessons)).slice(0, 44); return { id: 'mock:' + c.id, kind, course: c, title: 'Simulazione d\'esame', qs, secs: qs.length * 180, pass: Math.ceil(qs.length * 0.7), timed: true }; }
  return null;
}
function saveTest(t, res, secs) {
  const ok = res.filter(r => r && r.ok).length; const passed = ok >= t.pass; const per = {};
  t.qs.forEach((q, i) => { const sec = q.lesson.section; per[sec.id] = per[sec.id] || { name: sec.name, ok: 0, n: 0 }; per[sec.id].n++; if (res[i] && res[i].ok) per[sec.id].ok++; });
  const rec = { ok, n: t.qs.length, secs, t: Date.now(), passed, title: t.title };
  s2set(s => ({ tests: Object.assign({}, s.tests, { [t.id]: Object.assign({}, rec, { best: Math.max(ok, (s.tests[t.id] && s.tests[t.id].best) || 0), passedEver: passed || !!(s.tests[t.id] && s.tests[t.id].passedEver) }), _last: Object.assign({ id: t.id }, rec) }) }));
  if (passed && t.kind === 'unit') { // figurine dorate: quelle già prese non sbiadiscono per il periodo più lungo
    s2set(s => ({ gold: Object.assign({}, s.gold, { [t.section.id]: Date.now() }) }));
    try { const a = K.albumLoad(), now = Date.now(); let ch = false; t.section.lessons.forEach(l => { if (a[l.key]) { a[l.key].step = K.FL_STEPS.length - 1; a[l.key].due = now + K.FL_STEPS[K.FL_STEPS.length - 1] * DAY; ch = true; } }); if (ch) K.albumSave(a); } catch (e) {}
  }
  return Object.assign({ per: Object.values(per) }, rec);
}

// ---- lega e sfide: avversari simulati finché non ci sono gli account online ----
const RIVALS = ['Giulia', 'Luca', 'Marco', 'Sara', 'Paolo', 'Elena', 'Davide', 'Chiara', 'Matteo'];
const seedRnd = seed => { let x = 0; for (let i = 0; i < seed.length; i++) x = (x * 31 + seed.charCodeAt(i)) >>> 0; return () => { x = (x * 1664525 + 1013904223) >>> 0; return x / 4294967296; }; };
function league() {
  const wk = weekKey(), start = new Date(wk + 'T00:00:00').getTime(), frac = clamp((Date.now() - start) / (7 * DAY), 0.02, 1);
  const mine = (s2get().xp || {})[wk] || 0;
  const rows = RIVALS.map((name, i) => { const r = seedRnd(wk + name); const target = 180 + Math.round(r() * 640); return { name, xp: Math.round(target * Math.pow(frac, 0.85) / 2) * 2 }; });
  rows.push({ name: 'Tu', xp: mine, me: true });
  rows.sort((a, b) => b.xp - a.xp || (a.me ? -1 : 1));
  rows.forEach((r, i) => { r.pos = i + 1; });
  return { rows, me: rows.find(r => r.me), name: 'Lega Azzurra' };
}
function duelRival() { const wk = weekKey(), r = seedRnd(wk + 'duel' + (s2get().duel.w + s2get().duel.l)); return RIVALS[Math.floor(r() * RIVALS.length)]; }
