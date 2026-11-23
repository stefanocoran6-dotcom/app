# Capitolo 5 di «Azioni», parte 2 (seconda metà): P/B, P/S, prezzo contro la cassa, metodo dei simili.
from lezioni_lib import Q, P, F, PONTE, G, BK, N, LF
from azioni_dati import scheda

LEZIONI = [
  # ---------------------------------------------------------------------------------------------------
  LF('az-5-07', 'P/B', 'Il P/B: il prezzo contro i conti', 9, [
    G("Nei conti di Velonda c'è scritto che ai soci, pagati tutti i debiti, restano 120 milioni: è il patrimonio netto. In Borsa, però, tutta Velonda costa 240 milioni: il doppio. Qual è la spiegazione più probabile?",
      "I conti scrivono fabbriche e macchinari a quanto sono costati. La Borsa paga per gli utili che quell'insieme di cose saprà produrre. Il confronto tra i due numeri ha un nome: **P/B**.",
      options=['I conti sono sbagliati', "I conti guardano a quanto è stato speso, la Borsa a quanto l'azienda guadagnerà", "In Borsa si pagano anche i debiti dell'azienda"], ans=1),
    P("Il valore contabile di un'azione", r'''
Nelle Basi hai visto lo stato patrimoniale: attività meno passività fa il **patrimonio netto**, quello che resta ai soci secondo i conti.

Il patrimonio netto si chiama anche **valore contabile**, in inglese book value. Diviso per il numero di azioni dà il **valore contabile per azione**, che troverai scritto BVPS (book value per share):

$$\text{BVPS} = \frac{PN}{N}$$

\(PN\) = patrimonio netto, \(N\) = numero di azioni.

[fig]

Per Velonda:

$$\text{BVPS} = \frac{120 \text{ milioni}}{20 \text{ milioni}} = 6$$

Secondo i conti, a ogni azione Velonda corrispondono **6 €** di patrimonio.''',
      fig=scheda('Patrimonio netto', 'Numero di azioni')),
    P('Il P/B', r'''
Il rapporto tra il prezzo e il valore contabile per azione si chiama **P/B** (price to book):

$$\text{P/B} = \frac{P}{\text{BVPS}}$$

\(P\) = prezzo di un'azione, \(\text{BVPS}\) = valore contabile per azione.

Per Velonda:

$$\text{P/B} = \frac{12}{6} = 2$$

Per ogni euro di patrimonio scritto nei conti, il mercato paga **2 €**. Con le cifre di tutta l'azienda esce lo stesso numero: \(\dfrac{240}{120} = 2\).

[fig]

Metà di quello che paghi è scritto nei conti. L'altra metà è quello che i conti non vedono.''',
      fig=F([('Capitalizzazione', '240 milioni', [(120, 'Patrimonio netto nei conti', 'az', '120'), (120, 'Quello che i conti non vedono', 'giallo', '120')])])),
    P('Che cosa non vedono i conti', r'''
Perché il mercato paga più dei conti? Per tre motivi.

• Di norma i conti scrivono fabbriche e macchinari **al costo di quando sono stati comprati**, meno l'ammortamento. Un capannone comprato vent'anni fa oggi può valere molto di più.
• Il **marchio** costruito negli anni, i clienti affezionati, il saper fare delle persone non compaiono quasi mai tra le attività.
• I conti guardano indietro. Il mercato guarda avanti, agli utili futuri.

Come si legge:

• **P/B sopra 1**: l'azienda in funzione vale più di quanto è scritto nei conti. È il caso normale per chi guadagna bene.
• **P/B sotto 1**: in Borsa vale meno del suo patrimonio contabile. Il mercato teme che quelle attività valgano meno di quanto è scritto, o che l'azienda non riesca a farle rendere. A volte ha ragione, a volte è un'occasione.'''),
    N(r'''
Nordciclo: un'azione costa 4,20 €. Il patrimonio netto è 300 milioni e le azioni sono 50 milioni.

Quanto vale il P/B di Nordciclo?''', 0.7, '',
      r'''
Prima il valore contabile per azione:

$$\text{BVPS} = \frac{PN}{N} = \frac{300}{50} = 6$$

Poi il rapporto con il prezzo:

$$\text{P/B} = \frac{P}{\text{BVPS}} = \frac{4{,}20}{6} = 0{,}7$$

\(PN\) = patrimonio netto, \(N\) = numero di azioni, \(P\) = prezzo.

Il P/B è **0,7**: in Borsa Nordciclo vale meno del patrimonio scritto nei suoi conti.''', tol=0.05, dec=1),
    P('Chi fa rendere il patrimonio merita di più', r'''
Perché Pedalta ha un P/B di 4 e Nordciclo di 0,7? Guarda quanto rende il loro patrimonio.

Il **ROE** (return on equity) è l'utile netto diviso il patrimonio netto: dice quanti euro di utile produce in un anno ogni 100 € di patrimonio.

$$\text{ROE} = \frac{U}{PN}$$

\(U\) = utile netto, \(PN\) = patrimonio netto. Per Velonda: \(\dfrac{15}{120} =\) **12,5%**.

| | Pedalta | Velonda | Nordciclo |
|---|---|---|---|
| ROE | 20% | 12,5% | 7% |
| P/B | 4 | 2 | 0,7 |

Più un'azienda fa rendere il suo patrimonio, più il mercato è disposto a pagare ogni euro di quel patrimonio.

Un P/B alto con un ROE alto è normale. Un P/B alto con un ROE basso è un campanello d'allarme.'''),
    P('Tre numeri legati tra loro', r'''
P/B, P/E e ROE sono legati da un'uguaglianza che vale sempre:

$$\text{P/B} = \text{P/E} \times \text{ROE}$$

Si vede scrivendo i pezzi:

$$\frac{P}{\text{BVPS}} = \frac{P}{\text{EPS}} \times \frac{\text{EPS}}{\text{BVPS}}$$

L'ultimo pezzo, utile per azione diviso patrimonio per azione, è proprio il ROE.

Prova con Velonda: \(16 \times 12{,}5\% = 2\). Con Pedalta: \(20 \times 20\% = 4\). Con Nordciclo: \(10 \times 7\% = 0{,}7\).

Quindi un P/B alto può nascere da due cose: un **ROE alto**, cioè un'azienda che rende molto, oppure un **P/E alto**, cioè un mercato che paga cari i suoi utili. Sono due storie diverse: conviene sempre guardare da quale delle due arriva.'''),
    N(r'''
Un'azienda ha un P/E di 12 e un ROE del 15%.

Quanto vale il suo P/B?''', 1.8, '',
      r'''
$$\text{P/B} = \text{P/E} \times \text{ROE}$$

$$\text{P/B} = 12 \times 15\% = 1{,}8$$

Il P/B è **1,8**. Senza conoscere né il prezzo né il patrimonio: bastano il P/E e il ROE.''', tol=0.05, dec=1),
    P('Pregi e difetti del P/B', r'''
Il P/B ha tre pregi.

• Il patrimonio netto è quasi sempre positivo: il P/B si calcola anche quando l'utile è negativo.
• Il patrimonio cambia poco da un anno all'altro: il P/B è più stabile del P/E.
• Per banche, assicurazioni e società immobiliari, che possiedono soprattutto beni con un prezzo, è il metro più naturale.

E quattro limiti.

• Non vede marchio, persone e programmi fatti in casa.
• I beni sono scritti al costo di quando sono stati comprati: due aziende uguali, una con impianti vecchi e una con impianti nuovi, hanno patrimoni diversi.
• Se l'azienda ricompra le sue azioni o svaluta dei beni, il patrimonio si riduce e il P/B sale, senza che l'attività sia cambiata.
• Dopo anni di perdite il patrimonio può diventare negativo: il P/B non ha più senso.'''),
    BK('Per quali aziende il P/B dice molto?', ['Dice molto', 'Dice poco'], [
      ('Una banca: possiede soprattutto prestiti e titoli', 0, 'Prestiti e titoli sono scritti nei conti a valori vicini a quelli veri: il patrimonio contabile è un buon metro.'),
      ('Una società di software', 1, 'Il suo bene più importante sono le persone e i programmi fatti in casa, che nei conti quasi non compaiono.'),
      ('Una società che possiede palazzi dati in affitto', 0, 'Il suo valore sta negli immobili, che sono scritti tra le attività.'),
      ("Un marchio di moda famoso da cinquant'anni", 1, 'Il marchio costruito in casa non è scritto tra le attività: il patrimonio contabile racconta poco.'),
      ('Uno studio di consulenza', 1, 'Vale per le persone che ci lavorano, non per quello che possiede.')],
      after="Il P/B funziona quando il valore dell'azienda sta in cose che i conti sanno misurare."),
    Q("Un'azione costa 15 €. Il patrimonio netto dell'azienda è 50 milioni e le azioni sono 10 milioni. Quanto vale il P/B?", ['5', '0,3', '3'], 2,
      r"Valore contabile per azione: \(\dfrac{50}{10} = 5\) €. Poi \(\text{P/B} = \dfrac{15}{5} =\) **3**. Il 5 è solo il primo passo, e 0,3 è il rapporto capovolto."),
    Q("Un'azienda ha un P/B di 0,6. Che cosa vuol dire?", ['In Borsa vale meno del patrimonio netto scritto nei suoi conti', "Ha perso il 40% in Borsa nell'ultimo anno", 'Il suo utile è il 60% del patrimonio'], 0,
      "Un P/B sotto 1 vuol dire che la capitalizzazione è più bassa del patrimonio netto contabile: qui il mercato paga 60 centesimi per ogni euro scritto nei conti. Non dice niente su come è andato il prezzo, né sugli utili."),
    Q('Due aziende hanno lo stesso P/B di 3. La prima ha un ROE del 25%, la seconda del 5%. Quale delle due giustifica meglio quel P/B?', ['La seconda: ha più spazio per migliorare', 'La prima: fa rendere molto di più il suo patrimonio', 'Nessuna differenza: il P/B è lo stesso'], 1,
      r"Pagare 3 € per ogni euro di patrimonio ha senso se quel patrimonio rende molto. Con l'uguaglianza si vede subito: il P/E della prima è \(\dfrac{3}{25\%} = 12\), quello della seconda \(\dfrac{3}{5\%} = 60\). A parità di P/B, la seconda è cinque volte più cara rispetto agli utili."),
  ], "Il P/B confronta il prezzo con il patrimonio netto per azione scritto nei conti. Dice molto per banche e aziende piene di beni, poco per quelle che valgono per marchi e persone. Va letto insieme al ROE: P/B = P/E × ROE."),

  # ---------------------------------------------------------------------------------------------------
  LF('az-5-08', 'P/S', 'Il P/S: il prezzo contro le vendite', 8, [
    G("Una giovane azienda di bici a noleggio cresce in fretta, ma è ancora in perdita: quest'anno l'utile è negativo. Quanto vale il suo P/E?",
      "Con un utile negativo il P/E esce negativo e non dice niente: non si può pagare meno di zero per un euro di utile. Serve un metro che funzioni anche quando l'utile non c'è. Le vendite ci sono quasi sempre.",
      options=['Zero', 'Non ha senso calcolarlo', 'È negativo: quindi costa pochissimo'], ans=1),
    P('Il prezzo contro le vendite', r'''
Le vendite di un anno, nei conti, si chiamano **ricavi**. Il rapporto tra quanto vale l'azienda in Borsa e i suoi ricavi si chiama **P/S** (price to sales):

$$\text{P/S} = \frac{\text{Cap}}{R}$$

\(\text{Cap}\) = capitalizzazione, \(R\) = ricavi dell'anno.

[fig]

Per Velonda la capitalizzazione è \(12 \times 20 = 240\) milioni:

$$\text{P/S} = \frac{240}{300} = 0{,}8$$

Per ogni euro di bici vendute in un anno, il mercato paga **80 centesimi**.

Si può fare anche per azione. I ricavi per azione sono \(\dfrac{300}{20} = 15\) €, e \(\dfrac{12}{15} = 0{,}8\): stesso risultato.''',
      fig=scheda('Ricavi', "Prezzo di un'azione", 'Numero di azioni')),
    N(r'''
Pedalta vale in Borsa 180 milioni e ha ricavi per 120 milioni.

Quanto vale il P/S di Pedalta?''', 1.5, '',
      r'''
$$\text{P/S} = \frac{\text{Cap}}{R}$$

\(\text{Cap}\) = capitalizzazione (180 milioni), \(R\) = ricavi (120 milioni).

$$\text{P/S} = \frac{180}{120} = 1{,}5$$

Per ogni euro di vendite di Pedalta il mercato paga **1,50 €**: quasi il doppio di quanto paga per Velonda.''', tol=0.05, dec=1),
    P('Un euro di vendite non vale sempre uguale', r'''
Vendere non vuol dire guadagnare. Di ogni euro incassato, una parte se ne va in costi e solo il resto diventa utile. Quella parte che resta è il **margine netto**: utile netto diviso ricavi.

| | Pedalta | Velonda | Nordciclo |
|---|---|---|---|
| Margine | 7,5% | 5% | 4% |
| P/S | 1,5 | 0,8 | 0,4 |

[fig]

Su 100 € di vendite Pedalta ne trattiene 7,50, Nordciclo 4. È normale che il mercato paghi di più un euro di vendite di Pedalta.

Un P/S basso non è un affare se i margini sono sottili: stai pagando poco per vendite che rendono poco.''',
      fig=F([('Pedalta', '7,50 €', [(7.5, 'Utile', 'menta')]), ('Velonda', '5 €', [(5, 'Utile', 'menta')]), ('Nordciclo', '4 €', [(4, 'Utile', 'menta')])], cap='Quanto resta di utile su 100 € di vendite.')),
    P('Il legame con il P/E', r'''
Anche qui c'è un'uguaglianza che vale sempre:

$$\text{P/S} = \text{P/E} \times \text{margine netto}$$

Prezzo diviso ricavi è uguale a prezzo diviso utile, per utile diviso ricavi.

Con Velonda: \(16 \times 5\% = 0{,}8\). Con Pedalta: \(20 \times 7{,}5\% = 1{,}5\). Con Nordciclo: \(10 \times 4\% = 0{,}4\).

L'uguaglianza serve soprattutto al contrario. Un'azienda giovane, ancora in perdita, ha un P/S di 2. Pensi che una volta cresciuta avrà un margine netto del 10%, come le aziende mature del suo settore. Il suo P/E a regime sarebbe:

$$\frac{\text{P/S}}{\text{margine netto}} = \frac{2}{10\%} = 20$$

È un modo rapido per capire quanta strada deve fare un'azienda per meritare il prezzo di oggi.'''),
    N(r'''
Un'azienda in perdita ha un P/S di 3. Ti aspetti che a regime avrà un margine netto del 15%.

A quale P/E corrisponde il prezzo di oggi, calcolato sugli utili a regime?''', 20, '',
      r'''
$$\text{P/E} = \frac{\text{P/S}}{\text{margine netto}}$$

$$\text{P/E} = \frac{3}{15\%} = 20$$

Anche se tutto va come speri, stai pagando **20 volte** gli utili che l'azienda farà a regime. Se il margine si fermasse al 10%, il P/E sarebbe 30.'''),
    P('Quando serve e dove sbaglia', r'''
Il P/S si usa soprattutto in tre casi:

• aziende giovani che crescono ma non guadagnano ancora
• anni di crisi, quando l'utile crolla per un po' e il P/E impazzisce
• settori in cui gli utili cambiano molto da un anno all'altro

Ha un altro pregio: i ricavi risentono meno dell'utile delle scelte di chi scrive i conti. Meno non vuol dire mai: un'azienda può gonfiarli scrivendo quest'anno vendite che in realtà sono dell'anno prossimo.

E ha due punti ciechi.

• **Non guarda i costi.** Due aziende con lo stesso P/S possono avere margini opposti.
• **Non guarda i debiti.** La capitalizzazione è solo la parte dei soci. Un'azienda piena di debiti può sembrare a buon mercato solo perché i soci ne possiedono una fetta piccola.

Al secondo problema risponde la parte 3 del capitolo.'''),
    BK('Quale metro guardi per primo?', ['P/E', 'P/B', 'P/S'], [
      ('Azienda matura con utili stabili da anni', 0, "Quando l'utile c'è ed è regolare, il P/E è il metro più diretto."),
      ('Banca', 1, 'I beni di una banca sono scritti nei conti a valori vicini a quelli veri: il P/B è il primo metro.'),
      ('Azienda giovane che cresce ma è in perdita', 2, "Senza utile il P/E non ha senso: restano le vendite."),
      ('Società che possiede palazzi', 1, 'Il suo valore sta negli immobili scritti nei conti.'),
      ('Catena di supermercati con utili regolari', 0, 'Utili stabili: il P/E dice quanto li paghi.'),
      ("Azienda con l'utile azzerato da un anno di crisi", 2, 'Con un utile vicino a zero il P/E impazzisce: meglio guardare le vendite.')],
      after='Nessun metro va bene per tutte: prima si guarda che azienda è, poi si sceglie il rapporto.'),
    Q("Un'azienda vale in Borsa 500 milioni e ha ricavi per 1.250 milioni. Quanto vale il suo P/S?", ['2,5', '0,4', '4'], 1,
      r"\(\text{P/S} = \dfrac{\text{Cap}}{R} = \dfrac{500}{1.250} =\) **0,4**: il mercato paga 40 centesimi per ogni euro di vendite. Il 2,5 è il rapporto capovolto."),
    Q('Due aziende hanno lo stesso P/S di 1. La prima ha un margine netto del 2%, la seconda del 10%. Quale delle due costa di più per ogni euro di utile?', ['La prima', 'La seconda', 'Uguale: hanno lo stesso P/S'], 0,
      r"Il P/E è il P/S diviso il margine. Per la prima: \(\dfrac{1}{2\%} = 50\). Per la seconda: \(\dfrac{1}{10\%} = 10\). Stesso P/S, ma la prima è cinque volte più cara rispetto agli utili."),
    Q('Qual è un limite del P/S?', ["Non si può calcolare se l'azienda è in perdita", 'Cambia solo quando esce il bilancio', 'Non tiene conto né dei costi né dei debiti'], 2,
      "Il P/S guarda solo le vendite: non dice quanta parte diventa utile, e non dice quanti debiti ha l'azienda. Si calcola benissimo anche in perdita, ed è proprio il suo pregio. E cambia ogni giorno, insieme al prezzo."),
  ], "Il P/S confronta il valore in Borsa con le vendite di un anno. Funziona anche quando l'utile non c'è, ma non guarda né i margini né i debiti. Va letto insieme al margine netto: P/S = P/E × margine."),

  # ---------------------------------------------------------------------------------------------------
  LF('az-5-09', 'P/CF', 'Il prezzo contro la cassa', 10, [
    G("Due aziende identiche: stesse vendite, stessi incassi, stesse spese. Hanno comprato lo stesso macchinario. La prima ne spalma il costo su 5 anni, la seconda su 10. Quale delle due dichiara l'utile più alto?",
      "La seconda scrive ogni anno metà dell'ammortamento: ha meno costi nei conti, quindi più utile. Ma dal conto in banca sono usciti gli stessi soldi. L'utile dipende anche dalle scelte di chi scrive i conti. La **cassa** no.",
      options=['La prima', 'La seconda', 'Uguale: sono identiche'], ans=1),
    P("Dall'utile alla cassa", r'''
Nelle Basi hai visto il rendiconto finanziario: il conto dei soldi entrati e usciti davvero. La sua prima parte è il **flusso di cassa operativo**: la cassa prodotta in un anno dall'attività di tutti i giorni.

Si parte dall'utile netto e si fanno due correzioni.

• Si **riaggiungono gli ammortamenti**: sono un costo scritto nei conti, ma quest'anno non hanno fatto uscire soldi.
• Si **tolgono i soldi rimasti fermi** in più in magazzino e nei crediti verso i clienti: bici prodotte e non ancora vendute, fatture non ancora incassate.

[fig]

Velonda ha fatto 15 milioni di utile, ma la sua attività ha prodotto **20 milioni** di cassa.''',
      fig=PONTE([('Utile netto', 15, 'base'), ('Ammortamenti', 6, 'plus'), ('Magazzino e crediti in più', 1, 'minus'), ('Flusso di cassa operativo', 20, 'tot')], 'milioni', uno='milione')),
    P('Il P/CF', r'''
Il rapporto tra il prezzo e il flusso di cassa si scrive **P/CF** (price to cash flow):

$$\text{P/CF} = \frac{\text{Cap}}{CF}$$

\(\text{Cap}\) = capitalizzazione, \(CF\) = flusso di cassa operativo dell'anno.

Per Velonda:

$$\text{P/CF} = \frac{240}{20} = 12$$

Per ogni euro di cassa che l'attività produce in un anno, il mercato paga **12 €**. Per azione è lo stesso: la cassa per azione è \(\dfrac{20}{20} = 1\) €, e \(\dfrac{12}{1} = 12\).

| | Pedalta | Velonda | Nordciclo |
|---|---|---|---|
| P/E | 20 | 16 | 10 |
| P/CF | 18 | 12 | 7 |

Il P/CF è più basso del P/E, perché la cassa prodotta è più alta dell'utile. L'ordine tra le tre aziende resta lo stesso.'''),
    N(r'''
Nordciclo vale in Borsa 210 milioni. In un anno la sua attività produce 30 milioni di cassa.

Quanto vale il P/CF di Nordciclo?''', 7, '',
      r'''
$$\text{P/CF} = \frac{\text{Cap}}{CF}$$

\(\text{Cap}\) = capitalizzazione (210 milioni), \(CF\) = flusso di cassa operativo (30 milioni).

$$\text{P/CF} = \frac{210}{30} = 7$$

Per ogni euro di cassa prodotta da Nordciclo il mercato paga **7 €**.'''),
    P('Attenti a quale cassa', r'''
Di flussi di cassa ne esistono diversi, e chi scrive P/CF non sempre dice quale ha usato. Per Velonda:

| Quale | Come si calcola | Milioni |
|---|---|---|
| Rapido | Utile più ammortamenti | 21 |
| Operativo | Tolti anche i soldi fermi in più | 20 |
| Per i soci | Tolti gli investimenti, aggiunti i debiti nuovi | 9 |

Il conto **rapido** è il più diffuso perché è facile, ma dimentica i soldi fermi in magazzino e nei crediti.

Quello **operativo** è più affidabile: è scritto nel rendiconto finanziario.

Quello **per i soci** è il più interessante, e merita una pagina a sé.

Quando leggi un P/CF, chiediti sempre quale cassa c'è sotto. E quando confronti due aziende, usa la stessa per tutte e due.'''),
    P('La cassa che resta ai soci', r'''
Dei 20 milioni di cassa prodotti, non tutti restano ai soci. Per continuare a lavorare e a crescere Velonda deve **investire**: macchinari nuovi, negozi, una fabbrica più grande. E può prendere **debiti nuovi**, che portano cassa.

Quello che resta si chiama **flusso di cassa per i soci** (in inglese FCFE, free cash flow to equity):

$$\text{FCFE} = CF - I + \Delta D$$

\(CF\) = flusso di cassa operativo, \(I\) = investimenti, \(\Delta D\) = debiti nuovi meno debiti rimborsati.

[fig]

Per Velonda: \(20 - 14 + 3 =\) **9 milioni**, cioè 0,45 € per azione. È la cassa che può finire nelle tasche dei soci senza indebolire l'azienda.''',
      fig=PONTE([('Flusso di cassa operativo', 20, 'base'), ('Investimenti', 14, 'minus'), ('Debiti nuovi', 3, 'plus'), ('Flusso di cassa per i soci', 9, 'tot')], 'milioni')),
    N(r'''
In un anno l'attività di un'azienda produce 50 milioni di cassa. L'azienda investe 30 milioni in impianti nuovi e prende 5 milioni di debiti in più.

Quanto vale il flusso di cassa per i soci, in milioni di euro?''', 25, 'mln €',
      r'''
$$\text{FCFE} = CF - I + \Delta D$$

\(CF\) = flusso di cassa operativo (50), \(I\) = investimenti (30), \(\Delta D\) = debiti nuovi (5).

$$\text{FCFE} = 50 - 30 + 5 = 25$$

Ai soci restano **25 milioni**. Gli investimenti si tolgono, i debiti nuovi si aggiungono: sono soldi entrati in cassa.'''),
    P('Il dividendo e la cassa', r'''
Quanta di quella cassa arriva davvero ai soci lo decide l'azienda, con il **dividendo**. Velonda quest'anno ha pagato 0,45 € per azione: 9 milioni in tutto, esattamente la cassa disponibile per i soci.

Il rapporto tra il dividendo e il prezzo è il **rendimento del dividendo**:

$$\frac{\text{Div}}{P} = \frac{0{,}45}{12} = 3{,}75\%$$

| | Pedalta | Velonda | Nordciclo |
|---|---|---|---|
| Rendimento | 1,25% | 3,75% | 7,1% |

Un rendimento alto non è un regalo. Pedalta paga poco perché reinveste tre quarti dell'utile per crescere. Nordciclo paga molto perché cresce poco, e il suo prezzo è basso.

Il controllo da fare è sempre lo stesso: **il dividendo è coperto dalla cassa per i soci?** Un'azienda che paga più di quanto produce sta usando debiti o riserve, e non può durare.'''),
    P('Pregi e difetti del P/CF', r'''
Tre pregi.

• La cassa è più difficile da abbellire dell'utile: o è entrata, o non è entrata.
• Non risente della scelta sugli ammortamenti: due aziende uguali che ammortizzano in tempi diversi hanno utili diversi, ma la stessa cassa.
• Funziona anche quando l'utile è schiacciato da ammortamenti molto alti.

Tre limiti.

• Esistono più definizioni di cassa, e spesso non è scritto quale è stata usata.
• Il conto rapido e quello operativo non tolgono gli investimenti: un'azienda che deve rifare gli impianti ogni pochi anni sembra più a buon mercato di quanto è.
• La cassa per i soci è la più significativa, ma salta molto da un anno all'altro: nell'anno di un grande investimento può essere negativa anche per un'ottima azienda.'''),
    BK("Più o meno cassa dell'utile?", ['Più cassa', 'Meno cassa'], [
      ('Ammortamenti molto alti', 0, "Sono un costo che abbassa l'utile senza far uscire soldi: la cassa è più alta dell'utile."),
      ('I clienti pagano sempre più tardi', 1, "Le vendite sono già nell'utile, ma i soldi non sono ancora arrivati."),
      ('Il magazzino si riempie di bici invendute', 1, 'Produrle è costato soldi veri, che per ora restano fermi sugli scaffali.'),
      ('I fornitori accettano di essere pagati più tardi', 0, "Il costo è già nell'utile, ma i soldi non sono ancora usciti."),
      ('Un impianto viene svalutato perché vale meno del previsto', 0, "La svalutazione abbassa l'utile, ma non fa uscire cassa.")],
      after='Utile e cassa raccontano la stessa azienda in due lingue diverse. Chi le legge tutte e due si fa ingannare meno.'),
    Q("Un'azienda ha un utile netto di 40 milioni e ammortamenti per 10 milioni. Nell'anno magazzino e crediti sono aumentati di 5 milioni. Quanto vale il flusso di cassa operativo?", ['50 milioni', '45 milioni', '35 milioni'], 1,
      r"\(40 + 10 - 5 =\) **45 milioni**. Gli ammortamenti si riaggiungono, i soldi rimasti fermi in più si tolgono. I 50 milioni sono il conto rapido, che dimentica magazzino e crediti."),
    Q("Un'azienda paga ogni anno 30 milioni di dividendi, ma il suo flusso di cassa per i soci è 10 milioni. Che cosa vuol dire?", ['Che il dividendo è molto sicuro', 'Che paga i dividendi anche con debiti o riserve: così non può durare', 'Che il suo P/CF è troppo basso'], 1,
      "La cassa disponibile per i soci copre solo un terzo del dividendo. Gli altri 20 milioni arrivano da debiti nuovi o dalla cassa accumulata negli anni passati. Se la cassa prodotta non sale, prima o poi il dividendo verrà tagliato."),
    Q('Due aziende identiche in tutto scelgono durate diverse per gli ammortamenti. Quale numero resta uguale per tutte e due?', ["L'utile netto", 'Il P/E', 'Il flusso di cassa operativo'], 2,
      "L'ammortamento è un costo scritto nei conti che non fa uscire soldi. Chi ammortizza più in fretta ha un utile più basso e un P/E più alto, ma la cassa prodotta dall'attività è la stessa. Per questo il P/CF permette confronti più puliti."),
  ], "Il P/CF confronta il prezzo con la cassa prodotta in un anno, che risente meno dell'utile delle scelte contabili. La cassa che conta di più è quella che resta ai soci dopo gli investimenti: è lei che deve coprire il dividendo."),

  # ---------------------------------------------------------------------------------------------------
  LF('az-5-10', '≈', 'Il metodo dei simili', 10, [
    G("Due appartamenti identici, nello stesso palazzo e allo stesso piano. Uno è in vendita a 200.000 €, l'altro a 260.000 €. Che cosa pensi?",
      "Due cose uguali dovrebbero costare uguale: si chiama **legge del prezzo unico**. Se i prezzi sono diversi, o uno dei due è sbagliato, o le due cose non sono davvero uguali. Il metodo dei simili applica questa idea alle aziende.",
      options=['È normale: ogni casa ha il suo prezzo', "Uno dei due prezzi è sbagliato, oppure c'è una differenza che non vedo", 'Quello da 260.000 € vale di più'], ans=1),
    P('Il metro quadro delle aziende', r'''
Due case di dimensioni diverse si confrontano con il prezzo al metro quadro. Due aziende di dimensioni diverse si confrontano con i **multipli**: il prezzo per ogni euro di utile, di patrimonio, di vendite, di cassa.

Il **metodo dei simili** funziona in quattro passi.

• **Scegli il multiplo** adatto a quel tipo di azienda.
• **Scegli le aziende simili**, quotate in Borsa.
• **Calcola il multiplo tipico** del gruppo: la media, oppure la mediana.
• **Confronta e applica**: metti il multiplo dell'azienda accanto a quello del gruppo, e usa quello del gruppo per stimare un prezzo.

Sembra facile. Tutta la difficoltà sta nel secondo passo.'''),
    P('Chi è davvero simile', r'''
Due aziende sono simili quando si assomigliano nelle cose che decidono un multiplo.

• **Che cosa fanno**: stesso settore, stessi prodotti, stessi clienti.
• **Quanto crescono**: chi cresce di più merita multipli più alti.
• **Quanto rischiano**: debiti, utili più o meno stabili.
• **Quanto rendono**: margini e ROE.
• **Quanto sono grandi**, e in che paese scrivono i conti.

Due aziende identiche non esistono. Meglio tre simili davvero che dieci scelte a caso.

I simili di Velonda sono Pedalta e Nordciclo: stesso mestiere, ma una cresce e rende più di Velonda, l'altra meno. Velonda sta nel mezzo. Per questo la media dei due è un riferimento ragionevole.'''),
    P('Dal multiplo al prezzo', r'''
Il P/E di Pedalta è 20, quello di Nordciclo 10: la media è 15. L'utile per azione di Velonda è 0,75 €.

$$V = \text{P/E}_{\text{simili}} \times \text{EPS}$$

\(\text{P/E}_{\text{simili}}\) = P/E tipico delle aziende simili, \(\text{EPS}\) = utile per azione dell'azienda da valutare.

$$V = 15 \times 0{,}75 = 11{,}25$$

Se il mercato pagasse Velonda come paga in media i suoi concorrenti, l'azione costerebbe **11,25 €**. Ne costa 12: Velonda è un po' più cara della media dei simili, con un P/E di 16 contro 15.

Prima di dire che è cara bisogna chiedersi se quella differenza ha un motivo. È il passo che molti saltano.'''),
    N(r'''
I concorrenti di un'azienda hanno in media un P/E di 12. L'azienda ha un utile per azione di 2,50 €.

Che valore dà il metodo dei simili, in euro per azione?''', 30, '€',
      r'''
$$V = \text{P/E}_{\text{simili}} \times \text{EPS}$$

\(\text{P/E}_{\text{simili}}\) = P/E medio dei concorrenti (12), \(\text{EPS}\) = utile per azione (2,50 €).

$$V = 12 \times 2{,}50 = 30$$

Se il mercato la pagasse come i concorrenti, l'azione costerebbe **30 €**.'''),
    P('Media o mediana', r'''
Con due sole aziende simili la media va benissimo. Con tante, basta un caso strano per rovinarla.

Cinque aziende hanno questi P/E: 10, 12, 14, 16 e 78. L'ultima ha avuto un anno pessimo: utile quasi a zero, P/E enorme.

• La **media** è \(\dfrac{10 + 12 + 14 + 16 + 78}{5} = 26\). Nessuna delle prime quattro arriva nemmeno a 17: quel 26 non descrive nessuno.
• La **mediana** è il valore che sta nel mezzo quando li metti in fila: **14**.

La mediana non si fa trascinare dai casi estremi. Per questo, quando le aziende simili sono tante, chi fa i conti di mestiere usa quasi sempre quella.'''),
    P('Più multipli, più risposte', r'''
Lo stesso metodo si può fare con ogni multiplo. Per Velonda, usando la media dei due concorrenti:

| Multiplo | Media dei simili | Valore di un'azione |
|---|---|---|
| P/E | 15 | 11,25 € |
| P/CF | 12,5 | 12,50 € |
| P/B | 2,35 | 14,10 € |
| P/S | 0,95 | 14,25 € |

P/E e P/CF danno cifre vicine. P/B e P/S danno cifre molto più alte. Perché?

La media di P/B e P/S è tirata su da Pedalta, che ha un ROE del 20% e un margine del 7,5%. Velonda ha il 12,5% e il 5%: non merita gli stessi multipli.

La regola: **un multiplo si può prendere in prestito solo se è simile quello che c'è dietro**. Dietro il P/E ci sono crescita e rischio, dietro il P/B il ROE, dietro il P/S il margine.'''),
    P('Contro la sua storia', r'''
C'è un secondo confronto possibile: non con le altre aziende, ma con **la stessa azienda nel passato**.

Negli ultimi dieci anni il P/E di Velonda è stato in media 14. Oggi è 16: il mercato la paga più del solito.

$$V = 14 \times 0{,}75 = 10{,}50$$

Se il P/E tornasse alla sua media, l'azione costerebbe **10,50 €**.

Questo confronto ha senso solo se l'azienda è rimasta la stessa. Se oggi cresce più di prima, o ha meno debiti, è giusto che costi di più.

Conta anche il mondo intorno: quando i tassi sono bassi i P/E di tutte le aziende sono più alti, quando salgono si abbassano.'''),
    P('Pregi e difetti dei multipli', r'''
Il metodo dei simili è il più usato perché è semplice.

• Bastano pochi dati, che si trovano facilmente.
• Parte da prezzi veri, pagati oggi da chi compra e vende.
• Lo usano tutti: per capire come ragiona il mercato, bisogna conoscerlo.

Ma va maneggiato con cura.

• Dice se un'azione è cara **rispetto alle altre**, non se è cara in assoluto. In una bolla tutte le aziende simili sono care insieme, e il confronto non se ne accorge.
• Due aziende non sono mai davvero uguali.
• I conti si scrivono con regole e scelte diverse: lo stesso multiplo può nascondere numeri non confrontabili.
• Un multiplo è una scorciatoia: dentro ci sono ipotesi su crescita e rischio che nessuno ha scritto.

Quelle ipotesi le tirerai fuori nella parte 4, quando vedrai da dove nasce un P/E.'''),
    BK('È un buon confronto?', ['Sì', 'No'], [
      ('Due produttori di bici della stessa taglia, con crescita simile', 0, 'Stesso mestiere, stessa crescita: i loro multipli si possono confrontare.'),
      ('Un produttore di bici e una banca', 1, 'Mestieri diversi, conti diversi: il P/E di una banca non dice niente su chi fa bici.'),
      ('Due aziende uguali, ma una ha il triplo dei debiti', 1, 'I debiti cambiano utile e rischio: con il P/E il confronto è falsato. Servono i multipli della prossima parte.'),
      ('Due catene di supermercati dello stesso paese', 0, 'Stesso settore, stessi clienti, stesse regole per i conti.'),
      ("Un'azienda che cresce del 30% l'anno e una che non cresce", 1, 'Chi cresce molto merita un multiplo più alto: metterle insieme confonde.')]),
    Q('Il settore delle bici elettriche è di moda, e tutte le aziende quotate hanno P/E altissimi. Che cosa dice il metodo dei simili su una di loro?', ['Che è cara', 'Che è in linea con le altre, anche se sono tutte care', 'Che è a buon mercato'], 1,
      "Il confronto misura un'azienda contro le altre, non contro il suo valore. Se tutto il settore è gonfio, ogni azienda sembra normale accanto alle vicine. È il limite più serio del metodo: dice chi è cara rispetto a chi, non se sono care tutte."),
    Q("Le aziende simili hanno in media un P/B di 3 e un ROE del 20%. L'azienda che vuoi valutare ha un ROE dell'8%. Se le applichi il P/B medio:", ['La sopravvaluti: rende molto meno dei simili', 'La sottovaluti: ha più spazio per migliorare', 'Ottieni una stima corretta: il settore è lo stesso'], 0,
      "Dietro il P/B c'è il ROE: il mercato paga 3 € ogni euro di patrimonio che rende il 20%. Un patrimonio che rende l'8% merita molto meno. Applicare il multiplo medio a un'azienda che rende meno della media porta a una stima troppo alta."),
    Q('I P/E di cinque aziende simili sono 9, 11, 12, 15 e 53. Qual è la mediana?', ['20', '12', '15'], 1,
      r"Messi in fila, il valore che sta nel mezzo è **12**. La media sarebbe \(\dfrac{9 + 11 + 12 + 15 + 53}{5} = 20\): un numero più alto di quattro aziende su cinque, tirato su da un solo caso estremo."),
    Q("Oggi un'azienda ha un P/E di 22. La sua media degli ultimi dieci anni è 15. Prima di dire che è cara, che cosa controlli?", ['Se nel frattempo è cambiata: cresce di più, ha meno debiti', "Il prezzo di una sua azione", 'Niente: sopra la media vuol dire cara'], 0,
      "Il confronto con il passato vale solo se l'azienda è rimasta la stessa. Se oggi cresce più in fretta o rischia meno di dieci anni fa, è giusto che il mercato la paghi di più. Se invece è rimasta uguale, quel 22 chiede una spiegazione."),
  ], "Il metodo dei simili applica all'azienda il multiplo tipico di aziende che le assomigliano per crescita, rischio e margini. Dice se un'azione è cara rispetto alle altre o rispetto al suo passato, non se è cara in assoluto."),
]
