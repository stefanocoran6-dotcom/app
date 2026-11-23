# Capitolo 5 di «Azioni», parte 3: il valore d'impresa e i suoi multipli.
from lezioni_lib import Q, P, F, PONTE, G, LV, BK, N, LF

LEZIONI = [
  # ---------------------------------------------------------------------------------------------------
  LF('az-5-11', 'EV', "Il valore d'impresa", 9, [
    G("Immagina di comprare tutta Velonda. Le azioni costano in tutto 240 milioni. Ma l'azienda deve 80 milioni alle banche, e quel debito diventa un problema tuo. In cassa ha 20 milioni, che diventano tuoi. Quanto ti costa davvero l'operazione?",
      r"\(240 + 80 - 20 =\) **300 milioni**. Paghi le azioni, ti carichi i debiti e ti ritrovi la cassa. Questo numero si chiama **valore d'impresa**.",
      lo=200, hi=360, step=10, truth=300, near=10, unit='mln €'),
    P("Il prezzo vero di tutta l'azienda", r'''
La capitalizzazione è il prezzo delle azioni. Ma chi compra tutte le azioni si prende anche il resto: i debiti da ripagare e i soldi in cassa.

Il **valore d'impresa**, che troverai scritto **EV** (enterprise value), tiene conto di tutto:

$$\text{EV} = \text{Cap} + D - C$$

\(\text{Cap}\) = capitalizzazione, \(D\) = debiti finanziari, \(C\) = cassa.

I **debiti finanziari** sono quelli su cui si pagano interessi: prestiti delle banche e obbligazioni. Le fatture da pagare ai fornitori non contano: fanno parte del lavoro di tutti i giorni.

[fig]

Per Velonda: \(240 + 80 - 20 =\) **300 milioni**.

La differenza tra debiti finanziari e cassa si chiama **debito netto**: \(80 - 20 = 60\) milioni. L'EV è la capitalizzazione più il debito netto.''',
      fig=PONTE([('Capitalizzazione', 240, 'base'), ('Debiti finanziari', 80, 'plus'), ('Cassa', 20, 'minus'), ("Valore d'impresa", 300, 'tot')], 'milioni')),
    BK("Dalla capitalizzazione all'EV", ['Si aggiunge', 'Si toglie', 'Non conta'], [
      ('Un prestito della banca', 0, "È un debito finanziario: chi compra l'azienda dovrà ripagarlo."),
      ("Le obbligazioni emesse dall'azienda", 0, 'Sono debiti finanziari, come i prestiti delle banche.'),
      ("I soldi sul conto corrente dell'azienda", 1, "È cassa: chi compra l'azienda se la ritrova."),
      ('Le fatture da pagare ai fornitori', 2, "Sono debiti del lavoro di tutti i giorni, senza interessi: nel conto dell'EV non entrano."),
      ('Titoli di Stato a breve tenuti come riserva', 1, 'Si vendono in un attimo: contano come cassa.'),
      ('Il valore del marchio', 2, "Il marchio fa parte dell'attività che l'EV sta misurando: non è una voce da aggiungere o da togliere.")]),
    N(r'''
Nordciclo vale in Borsa 210 milioni. Ha debiti finanziari per 200 milioni e 30 milioni in cassa.

Quanto vale il valore d'impresa di Nordciclo, in milioni di euro?''', 380, 'mln €',
      r'''
$$\text{EV} = \text{Cap} + D - C$$

\(\text{Cap}\) = capitalizzazione (210), \(D\) = debiti finanziari (200), \(C\) = cassa (30).

$$\text{EV} = 210 + 200 - 30 = 380$$

L'EV di Nordciclo è **380 milioni**: quasi il doppio della sua capitalizzazione, perché metà dell'azienda è finanziata a debito.'''),
    P("Di chi è l'azienda", r'''
L'EV è il valore di **tutta l'attività**: fabbriche, marchio, clienti, chiunque abbia messo i soldi per farla funzionare.

Quei soldi li hanno messi in due:

• i **soci**, comprando le azioni: la loro parte vale quanto la capitalizzazione
• i **creditori**, prestando denaro: la loro parte è il debito netto

[fig]

Per Velonda, dei 300 milioni di attività 240 sono dei soci e 60 dei creditori.

Per Nordciclo le parti sono quasi uguali: 210 ai soci, 170 ai creditori. Stesso mestiere, ma un'azienda molto più rischiosa per chi ha le azioni: i creditori vanno pagati per primi, in ogni caso.''',
      fig=F([("Valore d'impresa", '300 milioni', [(240, 'Soci: capitalizzazione', 'az', '240'), (60, 'Creditori: debito netto', 'pesca', '60')])])),
    P('I pezzi che Velonda non ha', r'''
Velonda è un caso semplice. Nei conti di molte aziende ci sono altri pezzi, e la formula completa è questa:

$$\text{EV} = \text{Cap} + D + \text{Priv} + \text{Terzi} - C$$

• Le **azioni privilegiate** (\(\text{Priv}\)) si aggiungono: chi le possiede viene pagato prima dei soci ordinari, un po' come un creditore.
• Le **quote di terzi** (\(\text{Terzi}\)) si aggiungono. Se un gruppo possiede il 70% di una società, nei suoi conti c'è tutto il risultato di quella società. Ma il 30% è di altri soci: per mettere sopra e sotto la stessa cosa si aggiunge il valore di quel 30%.
• Tra i **debiti** contano anche gli affitti a lungo termine di negozi e capannoni, che nei conti scritti con le regole internazionali compaiono dal 2019.
• La **cassa** comprende i titoli che si vendono in un attimo.

Il debito si prende al valore di mercato quando si conosce. Di solito ci si accontenta di quello scritto nei conti.'''),
    N(r'''
Un gruppo vale in Borsa 500 milioni. Ha debiti finanziari per 150 milioni, azioni privilegiate per 30 milioni, quote di terzi per 20 milioni e 50 milioni in cassa.

Quanto vale il suo valore d'impresa, in milioni di euro?''', 650, 'mln €',
      r'''
$$\text{EV} = \text{Cap} + D + \text{Priv} + \text{Terzi} - C$$

$$\text{EV} = 500 + 150 + 30 + 20 - 50 = 650$$

L'EV è **650 milioni**. Si aggiunge tutto quello che spetta a qualcuno prima dei soci ordinari, e si toglie solo la cassa.'''),
    P("Dall'EV al valore per i soci", r'''
La formula si usa anche al contrario, ed è così che lavora chi valuta le aziende di mestiere: **prima stima quanto vale tutta l'attività, poi toglie quello che spetta agli altri**.

$$\text{Valore per i soci} = \text{EV} - (D - C)$$

\(D - C\) = debito netto.

Per Velonda: \(300 - 60 = 240\) milioni. Divisi per 20 milioni di azioni fanno 12 € per azione. Qui il conto torna al prezzo di Borsa, perché siamo partiti da lì. Ma se l'EV è una **stima**, il risultato è una stima del valore di un'azione.

Un avvertimento: il debito pesa. Se la stima dell'attività di Nordciclo fosse sbagliata del 10%, cioè di 38 milioni, il valore per i soci cambierebbe del 18%. Più debiti ha un'azienda, più il valore delle sue azioni risente di ogni errore.'''),
    Q("Un'azienda vale in Borsa 500 milioni, ha debiti finanziari per 150 milioni e 50 milioni in cassa. Quanto vale il suo EV?", ['700 milioni', '600 milioni', '400 milioni'], 1,
      r"\(\text{EV} = \text{Cap} + D - C = 500 + 150 - 50 =\) **600 milioni**. I debiti si aggiungono, la cassa si toglie: con 700 hai aggiunto anche la cassa, con 400 hai fatto il contrario."),
    Q("Un'azienda ha più cassa che debiti finanziari. Com'è il suo EV rispetto alla capitalizzazione?", ['Più basso', 'Più alto', 'Uguale'], 0,
      r"Se la cassa supera i debiti, il debito netto è negativo e l'EV scende sotto la capitalizzazione. È il caso di Pedalta: \(180 + 10 - 20 =\) **170 milioni**. Chi la compra tutta si ritrova più soldi in cassa di quanti debiti deve ripagare."),
    Q("Un gruppo possiede l'80% di una società controllata. Perché nel suo EV si aggiunge il valore del 20% che non possiede?", ['Perché è un debito verso le banche', 'Perché nei conti del gruppo c\'è il 100% dei risultati della controllata', "Perché il gruppo prima o poi comprerà anche quel 20%"], 1,
      "Ricavi, EBITDA e risultato operativo del gruppo comprendono tutta la controllata, anche la parte degli altri soci. Per confrontare l'EV con quei numeri, sopra deve esserci il valore di tutta l'attività: capitalizzazione, debiti e anche la quota dei terzi."),
    Q("Chi valuta un'azienda stima che tutta l'attività valga 500 milioni. I debiti finanziari sono 180 milioni, la cassa 30, le azioni 10 milioni. Quanto vale un'azione secondo questa stima?", ['35 €', '32 €', '50 €'], 0,
      r"Debito netto: \(180 - 30 = 150\). Valore per i soci: \(500 - 150 = 350\) milioni. Diviso 10 milioni di azioni: **35 €**. Con 50 € hai dimenticato i debiti, con 32 € hai dimenticato la cassa."),
  ], "Il valore d'impresa è capitalizzazione più debiti finanziari meno cassa: il prezzo di tutta l'attività, di chiunque siano i soldi. Al contrario: dal valore dell'attività si toglie il debito netto e resta il valore per i soci."),

  # ---------------------------------------------------------------------------------------------------
  LF('az-5-12', 'EV/', "I multipli del valore d'impresa", 10, [
    G('Con il P/E Nordciclo sembra molto più a buon mercato di Velonda: 10 contro 16. Ma Nordciclo ha 200 milioni di debiti, Velonda 80. Secondo te il confronto è alla pari?',
      "Chi ha molti debiti lascia ai soci una fetta più piccola e più rischiosa dell'attività, e il P/E guarda solo quella fetta. Per confrontare le due **attività**, senza farsi ingannare da come sono finanziate, servono i multipli del valore d'impresa.",
      options=['Sì: il P/E tiene già conto di tutto', 'No: i debiti cambiano sia gli utili sia il rischio dei soci', 'No: Nordciclo è comunque la più cara'], ans=1),
    P('Il confronto che il P/E sbaglia', r'''
Per confrontare due attività si usa l'EV, e lo si divide per un guadagno che spetta a tutti, soci e creditori: il **risultato operativo**, cioè l'utile prima di interessi e imposte (in inglese EBIT).

| | Velonda | Nordciclo |
|---|---|---|
| EV | 300 | 380 |
| Risultato operativo | 24 | 38 |
| EV/EBIT | 12,5 | 10 |
| P/E | 16 | 10 |

Con il P/E Velonda costa il 60% più di Nordciclo. Con il multiplo dell'EV solo il 25%.

Una buona parte dello sconto di Nordciclo era soltanto debito. Il resto è vero: la sua attività costa meno di quella di Velonda, perché cresce meno e rende meno.'''),
    P('La regola delle coppie', r'''
Ogni rapporto mette un prezzo sopra e una misura sotto. Sopra e sotto devono riguardare **le stesse persone**.

• Il **prezzo** e la capitalizzazione riguardano solo i soci. Sotto ci vuole una misura che spetta solo ai soci: utile netto, patrimonio netto.
• L'**EV** riguarda soci e creditori insieme. Sotto ci vuole una misura che viene prima di pagare gli interessi: risultato operativo, ricavi.

EV diviso utile netto è un errore: sopra ci sono anche i creditori, sotto i loro interessi sono già stati tolti.

Per lo stesso motivo il P/S è una scorciatoia comoda ma zoppa: i ricavi servono a pagare tutti, creditori compresi. La versione coerente è **EV diviso ricavi**. Per Velonda: \(\dfrac{300}{300} = 1\).'''),
    LV('Stessa attività, debiti diversi',
       "Ipotesi: l'attività di Velonda vale sempre 300 milioni e produce 24 milioni di risultato operativo, comunque sia finanziata. Interessi al 5%, imposte al 25%, cassa ferma a 20 milioni. Muovi i debiti e guarda il P/E.",
       'leva', dict(EV=300, EBIT=24, cassa=20, i=5, tax=25),
       [dict(id='D', label='Debiti finanziari', min=0, max=200, step=20, start=80, unit='mln €')],
       [dict(label='Carica Velonda di debiti: portali a 200 milioni', cond=[['D', '>=', 200]], hint='Sposta il cursore tutto a destra.'),
        dict(label='Adesso azzera i debiti', cond=[['D', '<=', 0]], hint='Sposta il cursore tutto a sinistra.')],
       "L'attività non è cambiata, e il multiplo dell'EV è rimasto fermo a 12,5. Il P/E invece è passato da circa 11 a quasi 18, solo spostando i debiti. Quando due aziende hanno debiti molto diversi, confrontale con i multipli dell'EV."),
    P("L'EBITDA", r'''
Il multiplo dell'EV più usato non ha sotto il risultato operativo, ma un numero un po' più grande: l'**EBITDA**.

È il risultato operativo a cui si riaggiungono ammortamenti e svalutazioni. In italiano si chiama anche margine operativo lordo.

$$\text{EBITDA} = \text{EBIT} + \text{ammortamenti}$$

Per Velonda: \(24 + 6 =\) **30 milioni**.

Che cosa misura? Quanto produce l'attività prima di tre cose: il consumo degli impianti, gli interessi sui debiti, le imposte. È un numero che assomiglia alla cassa prodotta, e che non dipende né da come l'azienda è finanziata né da come ammortizza.

Il nome è una sigla inglese: utili prima di interessi, imposte, svalutazioni e ammortamenti.'''),
    P('EV/EBITDA', r'''
$$\frac{\text{EV}}{\text{EBITDA}} = \frac{300}{30} = 10$$

Tutta l'attività di Velonda costa **10 volte** quello che produce in un anno, prima di ammortamenti, interessi e imposte.

I tre multipli dell'EV, per le tre aziende:

| | Pedalta | Velonda | Nordciclo |
|---|---|---|---|
| EV/EBITDA | 11,3 | 10 | 8 |
| EV/EBIT | 13,6 | 12,5 | 10 |
| EV/ricavi | 1,4 | 1 | 0,7 |

L'ordine è sempre lo stesso: Pedalta la più cara, Nordciclo la meno cara. Ma le distanze sono più piccole che con il P/E, dove Pedalta costava il doppio di Nordciclo.

Quando leggi che un'azienda è stata comprata «a 8 volte», quasi sempre si intende questo: 8 volte l'EBITDA.'''),
    N(r'''
Un'azienda vale in Borsa 400 milioni, ha debiti finanziari per 150 milioni e 50 milioni in cassa. Il suo risultato operativo è 40 milioni e gli ammortamenti sono 10 milioni.

Quanto vale il suo EV/EBITDA?''', 10, '',
      r'''
Due passi: prima l'EV e l'EBITDA, poi il rapporto.

$$\text{EV} = 400 + 150 - 50 = 500$$

$$\text{EBITDA} = 40 + 10 = 50$$

$$\frac{\text{EV}}{\text{EBITDA}} = \frac{500}{50} = 10$$

L'attività costa **10 volte** il suo EBITDA.'''),
    P("Dal multiplo al prezzo di un'azione", r'''
Con i multipli dell'EV il metodo dei simili ha un passo in più: dal valore di tutta l'attività bisogna tornare al valore per i soci.

Gli EV/EBITDA di Pedalta e Nordciclo sono 11,33 e 8: la media è 9,67.

• **Valore dell'attività**: \(9{,}67 \times 30 = 290\) milioni.
• **Meno il debito netto**: \(290 - 60 = 230\) milioni per i soci.
• **Diviso le azioni**: \(\dfrac{230}{20} =\) **11,50 €**.

[fig]

Con il P/E il confronto dava 11,25 €, con il P/CF 12,50 €. Tre multipli diversi, tre cifre vicine: è un buon segno.''',
      fig=PONTE([("Valore stimato dell'attività", 290, 'base'), ('Debito netto', 60, 'minus'), ('Valore per i soci', 230, 'tot')], 'milioni')),
    N(r'''
Le aziende simili hanno in media un EV/EBITDA di 8. L'azienda da valutare ha un EBITDA di 50 milioni, debiti finanziari per 120 milioni, 20 milioni in cassa e 10 milioni di azioni.

Quanto vale una sua azione, in euro?''', 30, '€',
      r'''
Tre passi.

• Valore dell'attività: \(8 \times 50 = 400\) milioni.
• Meno il debito netto, \(120 - 20 = 100\): restano \(400 - 100 = 300\) milioni per i soci.
• Diviso 10 milioni di azioni: \(\dfrac{300}{10} = 30\).

Secondo il confronto un'azione vale **30 €**. Chi dimentica il debito netto arriva a 40 €: un errore del 33%.'''),
    P("Pregi e difetti dei multipli dell'EV", r'''
Tre pregi.

• Confrontano le attività senza farsi ingannare dai debiti.
• L'EBITDA è quasi sempre positivo: il multiplo funziona anche quando l'utile netto è negativo.
• L'EBITDA non dipende dalle scelte sugli ammortamenti.

E un difetto serio: **l'EBITDA non è cassa**. Fa finta che gli impianti non si consumino mai. Ma macchinari e negozi prima o poi vanno rifatti, e quei soldi escono davvero.

Per questo un'azienda che deve investire molto sembra sempre a buon mercato su EV/EBITDA. Quando confronti aziende con impianti molto diversi, guarda anche **EV/EBIT**, che gli ammortamenti li conta.

Infine, l'EV va costruito con cura: basta dimenticare un pezzo dei debiti per cambiare il risultato.'''),
    BK('Quale coppia è coerente?', ['Coerente', 'Zoppa'], [
      ('Prezzo diviso utile per azione', 0, 'Sopra e sotto riguardano solo i soci.'),
      ('EV diviso EBITDA', 0, "Sopra e sotto riguardano tutta l'attività, prima di pagare i creditori."),
      ('EV diviso utile netto', 1, 'Sopra ci sono anche i creditori; sotto, i loro interessi sono già stati tolti.'),
      ('Capitalizzazione diviso patrimonio netto', 0, 'È il P/B: sopra e sotto riguardano solo i soci.'),
      ('Capitalizzazione diviso EBITDA', 1, "Sopra ci sono solo i soci; sotto c'è un guadagno che deve ancora pagare i creditori."),
      ('EV diviso ricavi', 0, 'I ricavi servono a pagare tutti, e sopra ci sono tutti.')],
      after="Prezzo e capitalizzazione vanno con le misure dei soci. L'EV va con le misure che vengono prima degli interessi."),
    Q('Due aziende dello stesso settore: A ha un EV/EBITDA di 6, B di 9. A però deve rifare tutti gli impianti ogni tre anni, B quasi mai. Che cosa concludi?', ['A è di sicuro la più conveniente', "Il confronto sull'EBITDA favorisce A: meglio guardare anche EV/EBIT", 'B è di sicuro la più conveniente'], 1,
      "L'EBITDA non conta il consumo degli impianti. A deve spendere molto ogni tre anni per restare in piedi, e quei soldi nel suo EBITDA non si vedono: per questo sembra a buon mercato. EV/EBIT toglie gli ammortamenti e rende il confronto più onesto."),
    Q("Il P/E di Nordciclo è più basso di quello di Velonda del 37,5%. Il suo EV/EBITDA è più basso solo del 20%. Perché le due distanze sono diverse?", ['Perché Nordciclo ha più azioni', 'Perché una parte dello sconto sul P/E dipende dai suoi debiti', "Perché l'EBITDA di Nordciclo è sbagliato"], 1,
      "Il P/E guarda solo la fetta dei soci, che in un'azienda molto indebitata è più piccola e più rischiosa: per questo il mercato la paga poco. I multipli dell'EV guardano tutta l'attività, e lì la distanza tra le due aziende si riduce. Il numero di azioni non c'entra."),
    Q("Le aziende simili valgono in media 10 volte l'EBITDA. Un'azienda ha un EBITDA di 20 milioni, un debito netto di 50 milioni e 5 milioni di azioni. Quanto vale una sua azione?", ['40 €', '50 €', '30 €'], 2,
      r"Valore dell'attività: \(10 \times 20 = 200\) milioni. Meno il debito netto: \(200 - 50 = 150\). Diviso 5 milioni di azioni: **30 €**. Con 40 € hai dimenticato di togliere il debito, con 50 € lo hai aggiunto."),
  ], "Per confrontare aziende con debiti diversi si usano i multipli dell'EV: EV/EBITDA, EV/EBIT, EV/ricavi. Dal multiplo si arriva al valore dell'attività, si toglie il debito netto e si divide per le azioni. L'EBITDA non è cassa: gli impianti vanno rifatti."),
]
