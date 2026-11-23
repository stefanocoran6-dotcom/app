# Capitolo 5 di «Azioni», parte 1: prezzo e valore. Le lezioni si scrivono qui; azioni_src.py le mette insieme.
from lezioni_lib import Q, P, F, G, BK, N, LF
from azioni_dati import scheda

LEZIONI = [
  # ---------------------------------------------------------------------------------------------------
  LF('az-5-01', 'P≠V', 'Prezzo e valore non sono la stessa cosa', 8, [
    P('Nora e la sua bici', r'''
Nora ha 29 anni e va al lavoro in bici elettrica. La sua bici è una **Velonda**: un'azienda italiana che produce bici da città, quotata in Borsa.

Nora ha messo da parte 3.000 € e sta pensando di comprare azioni Velonda. Ha già guardato che cosa produce l'azienda, in che settore lavora e come se la cava contro i concorrenti. Le piace.

Resta la domanda più difficile. Oggi un'azione Velonda costa **12 €**: è tanto o poco?

[fig]

In questo capitolo impari a rispondere con i numeri, come fa chi valuta le aziende di mestiere. Questa è la scheda di Velonda: la ritroverai in ogni lezione.

Velonda e i suoi concorrenti sono inventati per questo corso. I metodi che impari sono quelli veri.''',
      fig=scheda("Prezzo di un'azione", tutta=True)),
    G("Ieri un'azione Velonda costava 12 €. Oggi costa 11,40 €: il 5% in meno. Nel frattempo non è uscita nessuna notizia sull'azienda. Di quanto è cambiato quello che Velonda produce e guadagna?",
      "Le fabbriche sono le stesse, le bici vendute sono le stesse. È cambiato solo il **prezzo**: la cifra a cui oggi qualcuno è disposto a comprare e qualcun altro a vendere. Quanto l'azienda vale davvero è un'altra cosa, e si muove molto più lentamente.",
      options=['È sceso del 5%, come il prezzo', 'Non è cambiato', 'È salito del 5%'], ans=1),
    P('Il prezzo lo leggi, il valore lo stimi', r'''
Di un'azione esistono due numeri diversi.

Il **prezzo** è la cifra a cui l'azione si scambia in Borsa in questo momento. Nasce dall'incontro tra chi compra e chi vende, e cambia di continuo. Lo leggi su uno schermo.

Il **valore intrinseco** è quanto vale davvero l'azione, per quello che l'azienda darà ai suoi soci negli anni: utili, dividendi, crescita. Non è scritto da nessuna parte: va **stimato**, facendo i conti.

| | Prezzo | Valore |
|---|---|---|
| Dove sta | Sullo schermo | In una stima |
| Chi lo fa | Il mercato | Chi fa i conti |
| Si muove | Di continuo | Piano |

Due persone serie possono stimare due valori diversi per la stessa azione. Sul prezzo, invece, non si discute.'''),
    P('Perché i due numeri si allontanano', r'''
Se il valore si muove piano e il prezzo di continuo, è normale che ogni tanto i due si allontanino.

Nel breve periodo il prezzo lo muovono anche cose che con l'azienda c'entrano poco:

• la paura dopo una brutta giornata di Borsa
• l'entusiasmo per un settore di moda
• un grande fondo che deve vendere in fretta

Nel lungo periodo, però, il prezzo tende a seguire i risultati dell'azienda. Benjamin Graham, il maestro di Warren Buffett, lo diceva più o meno così: nel breve il mercato è una macchina che conta i voti, nel lungo è una bilancia che pesa.

Quanto in fretta il prezzo torni vicino al valore è una delle grandi discussioni della finanza. La trovi nel capitolo 10, «Posso battere il mercato?».'''),
    P('Cara, a buon mercato o al prezzo giusto', r'''
Tutto il gioco sta nel confrontare i due numeri.

• Se il valore stimato è **più alto** del prezzo, l'azione è **sottovalutata**: costa meno di quanto vale.
• Se è **più basso**, è **sopravvalutata**: costa più di quanto vale.
• Se i due numeri sono vicini, l'azione è **al prezzo giusto**.

Un analista stima che un'azione Velonda valga 15 €. In Borsa costa 12 €.

[fig]

Per lui è sottovalutata. Ma è la sua stima: un altro analista, con ipotesi più prudenti, potrebbe arrivare a 11 €. Per questo nessuno compra solo perché la propria stima è un po' sopra il prezzo.''',
      fig=F([('Valore stimato', '15 €', [(15, "Stima dell'analista", 'menta')]), ('Prezzo in Borsa', '12 €', [(12, 'Prezzo', 'az')])])),
    P('Il margine di sicurezza', r'''
Una stima può essere sbagliata. Chi investe vuole quindi un cuscinetto tra la sua stima e il prezzo che paga: il **margine di sicurezza**.

$$M = \frac{V - P}{V}$$

\(V\) = valore stimato, \(P\) = prezzo, \(M\) = margine di sicurezza.

Per l'analista di prima:

$$M = \frac{15 - 12}{15} = 20\%$$

Il prezzo è il 20% sotto la stima: anche se l'analista avesse esagerato un po', resterebbe spazio.

Quanto margine serve? Dipende da quanto ci si può fidare della stima. Per un'azienda stabile, con utili regolari, può bastare poco. Per un'azienda giovane, dove ogni previsione è incerta, ne serve molto di più.'''),
    N(r'''
Un'analista stima che un'azione valga 40 €. In Borsa l'azione costa 30 €.

Quanto vale il margine di sicurezza, in percentuale del valore stimato?''', 25, '%',
      r'''
$$M = \frac{V - P}{V}$$

\(V\) = valore stimato (40 €), \(P\) = prezzo (30 €).

$$M = \frac{40 - 30}{40} = 25\%$$

Il prezzo è il **25%** sotto la stima. Attenzione a dividere per il valore stimato e non per il prezzo: con il prezzo uscirebbe 33%.'''),
    P('Prima di fidarti della tua stima', r'''
Hai fatto i conti e la tua stima è diversa dal prezzo. Chi ha ragione, tu o il mercato? Prima di rispondere, quattro domande.

**1. Quanto è grande la distanza?** Un 5% sta dentro l'errore di qualunque stima. Un 40% merita attenzione.

**2. Quanto sono solide le ipotesi?** Cambiale un po' e guarda se la conclusione resta in piedi.

**3. Quanti stanno guardando?** Una grande azienda è studiata ogni giorno da decine di analisti: è difficile che abbiano sbagliato tutti. Una piccola, seguita da pochi, ha più spesso un prezzo lontano dal valore.

**4. Perché il prezzo dovrebbe muoversi?** Se nessun altro se ne accorge, un'azione sottovalutata può restarlo per anni.

Il mercato non ha sempre ragione. Ma è fatto di migliaia di persone che fanno i tuoi stessi conti: va preso sul serio.'''),
    BK('Parla del prezzo o del valore?', ['Prezzo', 'Valore'], [
      ("Lo leggi sull'app della banca", 0, 'Il prezzo è pubblico: basta guardare lo schermo.'),
      ('Due analisti arrivano a due cifre diverse', 1, 'Il valore è una stima, e le stime dipendono dalle ipotesi di chi le fa.'),
      ('Cambia di continuo, anche senza notizie', 0, "Il prezzo si muove a ogni scambio. Il valore di un'azienda non cambia da un minuto all'altro."),
      ("Dipende dagli utili che l'azienda farà nei prossimi anni", 1, "È il valore intrinseco: quello che l'azienda darà ai soci nel tempo."),
      ('È la cifra che paghi davvero quando compri', 0, 'Si compra al prezzo, qualunque sia il valore che hai stimato.'),
      ('Per trovarlo servono conti e ipotesi', 1, 'Il valore non è scritto da nessuna parte: va stimato.')],
      after="Il prezzo è un fatto. Il valore è un'opinione: quella buona ha i conti dietro."),
    Q("Un'azione costa 30 € in Borsa. Dopo aver fatto i conti, stimi che valga 24 €. Per te l'azione è:", ['Sopravvalutata', 'Sottovalutata', 'Al prezzo giusto'], 0,
      "Il prezzo (30 €) è più alto del valore che hai stimato (24 €): secondo te l'azione costa più di quanto vale, quindi è **sopravvalutata**. Se la tua stima è giusta, non è il momento di comprare."),
    Q('Stimi che un\'azione valga 50 €. In Borsa costa 48 €. Che cosa conclude un investitore prudente?', ['Che è un affare: costa meno di quanto vale', "Che la distanza è troppo piccola: sta dentro l'errore della stima", 'Che il mercato ha sbagliato il prezzo'], 1,
      r"Il margine di sicurezza è \(\dfrac{50 - 48}{50} = 4\%\). Un cuscinetto così sottile sparisce al primo errore nelle ipotesi. Per chi è prudente questa azione è al prezzo giusto, non sottovalutata."),
    Q('Per quale azienda è più facile che il prezzo sia lontano dal valore?', ['Una grande azienda, seguita ogni giorno da quaranta analisti', 'Una piccola azienda, seguita da un solo analista', 'È uguale: il mercato sbaglia allo stesso modo con tutte'], 1,
      "Più persone studiano un'azienda, più in fretta le notizie e i conti finiscono nel prezzo. Le aziende piccole e poco seguite sono quelle dove un prezzo sbagliato può restare lì più a lungo. Vale anche al contrario: lì è più facile che a sbagliare sia tu."),
    Q('Quale frase sul valore intrinseco è giusta?', ["È il prezzo a cui l'azione si scambia oggi", 'È una stima: persone diverse possono arrivare a cifre diverse', 'È sempre uguale al valore scritto nei conti'], 1,
      "Il valore intrinseco non si legge da nessuna parte: si stima a partire da quello che l'azienda darà ai soci nel tempo, e dipende dalle ipotesi di chi fa i conti. Il prezzo si legge in Borsa. Il valore scritto nei conti è un'altra cosa ancora: lo trovi nella lezione sul P/B."),
  ], "Il prezzo lo leggi, il valore lo stimi. Se la stima è più alta del prezzo l'azione è sottovalutata. Ma una stima può sbagliare: per questo serve un margine di sicurezza, tanto più largo quanto più la stima è incerta."),

  # ---------------------------------------------------------------------------------------------------
  LF('az-5-02', 'V?', 'Di quale valore parliamo?', 7, [
    G("Tre cifre per la stessa azione Velonda. In Borsa costa 12 €. Se l'azienda chiudesse e vendesse tutto, ai soci resterebbero 3,50 € per azione. Un grande gruppo ne offre 15 per comprarla tutta. Qual è il valore giusto?",
      "Ogni cifra risponde a una domanda diversa: quanto vale se continua a lavorare, quanto vale se chiude, quanto vale per chi la vuole tutta. Prima di stimare un valore bisogna decidere **quale**.",
      options=['12 €: conta solo la Borsa', 'Dipende da che cosa vuoi farne', '15 €: la cifra più alta'], ans=1),
    P("Un'azienda che continua a lavorare", r'''
Quasi sempre chi valuta un'azienda dà per scontato che continuerà a lavorare: a produrre, a vendere, a guadagnare. È il **valore in continuità**.

In questo caso l'azienda vale per gli utili che produrrà negli anni, non per le cose che possiede. Fabbriche, magazzino e marchio contano perché insieme fanno guadagnare.

È l'ipotesi che sta dietro a quasi tutti i metodi di questo capitolo. Quando Nora si chiede se 12 € sono tanti o pochi, sta pensando a una Velonda che tra dieci anni fa ancora bici.

Non è però l'unica ipotesi possibile.'''),
    P("Se l'azienda chiudesse domani", r'''
Il **valore di liquidazione** è quello che resterebbe ai soci se l'azienda chiudesse, vendesse tutto quello che ha e pagasse tutti i debiti.

Per Velonda, un'ipotesi:

• vendendo in fretta fabbriche, magazzino e marchio si incassano 200 milioni
• i debiti da pagare, tutti, sono 130 milioni
• ai soci restano \(200 - 130 =\) **70 milioni**

Le azioni sono 20 milioni: \(\dfrac{70}{20} =\) **3,50 € per azione**.

In Borsa l'azione ne costa 12. Il motivo è semplice: un'azienda che funziona vale più dei suoi pezzi venduti uno per uno, perché ogni anno produce utili.

Il valore di liquidazione fa da pavimento, e conta davvero solo quando un'azienda sta per chiudere. Se un'azienda valesse di più chiusa che aperta, ai soci converrebbe venderne i pezzi.'''),
    N(r'''
Un'azienda in difficoltà sta per chiudere. Vendendo tutto quello che ha incasserebbe 90 milioni. I debiti da pagare sono 60 milioni e le azioni sono 10 milioni.

Quanto vale il valore di liquidazione, in euro per azione?''', 3, '€',
      r'''
Prima quello che resta ai soci, poi la divisione per il numero di azioni.

$$\frac{90 - 60}{10} = 3$$

Ai soci restano 30 milioni: **3 € per azione**. Prima si pagano i debiti, e solo quello che avanza va ai soci.'''),
    P('Il valore per chiunque e il valore per uno solo', r'''
C'è una seconda distinzione: per **chi** vale.

Il **valore equo** (in inglese fair value) è il prezzo su cui si metterebbero d'accordo un compratore e un venditore qualunque, tutti e due informati e nessuno dei due costretto a concludere. È il valore per chiunque.

Il **valore d'investimento** è quanto vale l'azienda per un compratore preciso, con i suoi progetti. Può essere più alto.

Un esempio. Un grande gruppo di biciclette compra Velonda e unisce le due reti di negozi: risparmia 6 milioni di costi l'anno. Quei risparmi si chiamano **sinergie**, e li può ottenere solo lui. Per quel gruppo Velonda vale più che per Nora o per chiunque altro.'''),
    P('Se qualcuno la comprasse tutta', r'''
Chi compra **tutta** l'azienda ha anche un altro vantaggio: comanda.

Nora, con le sue poche azioni, non decide niente. Chi ha tutte le azioni sceglie i dirigenti, cambia la strategia, decide quanti dividendi pagare.

Per questi due motivi, il comando e le sinergie, chi vuole comprare un'intera azienda di solito offre più del prezzo di Borsa. La differenza si chiama **premio di controllo**.

Un grande gruppo offre 15 € per ogni azione Velonda, che in Borsa costa 12 €:

$$\frac{15 - 12}{12} = 25\%$$

Il premio è del 25%. Non vuol dire che il prezzo di Borsa fosse sbagliato: in Borsa si scambiano piccole quote, senza comando.'''),
    P('Quattro domande, quattro valori', r'''
Ecco le cifre di Velonda viste fin qui, una sotto l'altra.

[fig]

| Valore | La domanda |
|---|---|
| Di liquidazione | Quanto resta se chiude? |
| In continuità | Quanto vale se va avanti? |
| Equo | Quanto vale per chiunque? |
| D'investimento | Quanto vale per quel compratore? |

Nel resto del capitolo cerchiamo il valore di Velonda **in continuità**, per una piccola socia come Nora. È la domanda di chi compra azioni in Borsa.''',
      fig=F([('Se chiude e vende tutto', '3,50 €', [(3.5, 'Liquidazione', 'giallo')]), ('In Borsa, oggi', '12 €', [(12, 'Prezzo', 'az')]), ('Per il gruppo che la vuole tutta', '15 €', [(15, 'Offerta', 'pesca')])])),
    BK('Quale valore serve?', ['Continuità', 'Liquidazione', 'Compratore'], [
      ("Nora compra cento azioni di un'azienda sana", 0, "Un'azienda sana continuerà a lavorare: vale per gli utili che farà."),
      ("Un tribunale vende i macchinari di un'azienda fallita", 1, "L'azienda non lavora più: conta solo quanto si ricava vendendo i pezzi."),
      ('Un concorrente calcola quanto risparmia unendo le due reti di negozi', 2, 'Sono sinergie: valgono solo per quel compratore.'),
      ('Un fondo valuta una catena di supermercati che apre nuovi negozi', 0, "Un'azienda che cresce si valuta in continuità."),
      ('Una fabbrica chiude e mette in vendita il capannone', 1, "Quando l'attività si ferma si guarda al valore di liquidazione."),
      ('Un gruppo straniero paga di più per entrare in un nuovo paese', 2, "Quel vantaggio vale solo per lui: è un valore d'investimento.")],
      after='Prima di chiedersi quanto vale, bisogna chiedersi: per chi, e per farne che cosa.'),
    Q("Un gruppo offre 26 € per azione per comprare un'intera azienda, che in Borsa quota 20 €. Quanto vale il premio di controllo?", ['6%', '23%', '30%'], 2,
      r"Il premio si misura sul prezzo di Borsa: \(\dfrac{26 - 20}{20} =\) **30%**. Il 23% esce dividendo per il prezzo offerto, ma chi vende confronta l'offerta con quello che ha in mano oggi."),
    Q("Per un'azienda sana, che guadagna bene, quale di questi valori è di solito il più basso?", ['Il valore in continuità', 'Il valore di liquidazione', 'Il valore per chi la compra tutta'], 1,
      "Vendere in fretta i pezzi di un'azienda che funziona vuol dire rinunciare agli utili che produrrebbe: il valore di liquidazione è il pavimento. Chi la compra tutta, al contrario, paga di solito anche un premio."),
    Q("Un gruppo è disposto a pagare un'azienda più di chiunque altro, perché unendola alla propria taglierebbe molti costi. Come si chiama questo valore?", ['Valore equo', 'Valore di liquidazione', "Valore d'investimento"], 2,
      "È il **valore d'investimento**: quanto vale l'azienda per un compratore preciso, con i vantaggi che solo lui può ottenere. Il valore equo è quello su cui si accorderebbero un compratore e un venditore qualunque."),
  ], "La parola valore ha più significati: in continuità o in liquidazione, per chiunque o per un compratore preciso. Chi compra tutta un'azienda di solito paga un premio di controllo. In Borsa si cerca il valore in continuità, per un piccolo socio."),

  # ---------------------------------------------------------------------------------------------------
  LF('az-5-03', '1·2·3', 'Tre strade per stimare il valore', 6, [
    G("Tre analisti stimano quanto vale un'azione Velonda. Ognuno usa un metodo diverso. Che cosa ti aspetti?",
      "Ogni metodo guarda l'azienda da un lato e usa ipotesi diverse. Chi valuta sul serio ne usa più di uno e guarda **dove le cifre si avvicinano**. Le strade sono tre, e questo capitolo le percorre tutte.",
      options=['Tre cifre uguali: il valore è uno solo', "Tre cifre diverse: ogni metodo guarda l'azienda da un lato", 'Che un solo metodo sia giusto e gli altri due sbagliati'], ans=1),
    P('Prima strada: i soldi che arriveranno', r'''
Un'azione vale per i soldi che darà a chi la possiede: i **dividendi**, e il prezzo a cui un giorno verrà rivenduta.

Quei soldi arrivano in futuro, e un euro tra un anno vale meno di un euro oggi. Quindi si prevedono i soldi che arriveranno e li si riporta a oggi: è il conto dell'interesse composto che hai visto nelle Basi, fatto al contrario.

È la strada più completa, perché guarda proprio quello che interessa a un socio. È anche la più delicata: tutto dipende dalle previsioni, e basta cambiarle di poco per ottenere un valore molto diverso.

La percorri nella parte 4 del capitolo, «I soldi che arriveranno».'''),
    P('Seconda strada: il confronto', r'''
La seconda strada non prevede il futuro: guarda **quanto paga oggi il mercato per aziende simili**.

Funziona come con le case. Per capire se un appartamento è caro si guarda il prezzo al metro quadro di quelli vicini. Per un'azienda si guarda quanto costa ogni euro di utile, di vendite o di patrimonio. Questi rapporti si chiamano **multipli**: il più famoso è il P/E.

È la strada più veloce e la più usata: è quella che trovi ogni giorno sui giornali. Ha un limite: se in quel momento tutte le aziende simili sono care, la stima esce cara anche lei.

La percorri nelle parti 2 e 3, «I multipli» e «Il valore d'impresa».'''),
    P('Terza strada: i pezzi', r'''
La terza strada guarda quello che l'azienda **possiede**: si stima quanto valgono oggi tutte le sue attività, una per una, e si tolgono tutti i debiti.

È la strada giusta quando il valore sta nelle cose: una società che possiede palazzi, o quote di altre società.

È la meno adatta a un'azienda che vale per quello che sa fare. Un produttore di bici non è la somma di capannoni e magazzino: vale perché con quei capannoni guadagna.

La percorri nella parte 5, subito prima del caso finale.'''),
    P('Ogni strada ha il suo terreno', r'''
| Strada | Punto forte | Punto debole |
|---|---|---|
| Soldi futuri | Guarda quello che conta per un socio | Vive di previsioni |
| Confronto | Veloce, parte da prezzi veri | Se il settore è caro, sbaglia con lui |
| Pezzi | Parte da cose che esistono | Non vede la capacità di guadagnare |

Quale usare dipende dall'azienda e da quello che sai.

• **Soldi futuri**: aziende stabili, di cui si possono fare previsioni ragionevoli.
• **Confronto**: quando esistono aziende simili quotate in Borsa.
• **Pezzi**: società immobiliari, società che possiedono quote di altre, aziende che stanno per chiudere.'''),
    BK('Quale strada sta usando?', ['Soldi futuri', 'Confronto', 'Pezzi'], [
      ('Riporto a oggi i dividendi che mi aspetto', 0, 'Parte dai soldi che arriveranno: è la prima strada.'),
      ('Guardo a che P/E si scambiano le aziende simili', 1, 'Usa i prezzi di aziende simili: è il confronto.'),
      ('Stimo quanto valgono oggi i palazzi e tolgo i debiti', 2, "Conta quello che l'azienda possiede: sono i pezzi."),
      ('Applico ai ricavi il multiplo medio del settore', 1, 'Un multiplo preso da aziende simili: è il confronto.'),
      ("Calcolo quanto vale oggi la cassa che l'azienda produrrà", 0, 'Soldi futuri riportati a oggi: è la prima strada.'),
      ("Sommo ai prezzi di oggi le quote che l'azienda possiede in altre società", 2, 'Mette in fila i beni uno per uno: sono i pezzi.')]),
    P('Mai una strada sola', r'''
Chi valuta un'azienda di mestiere usa quasi sempre almeno due strade: una per ragionare, l'altra per controllare di non essere finito fuori strada.

Se le cifre sono vicine, la stima è solida. Se sono lontanissime, una delle ipotesi è sbagliata, e conviene capire quale prima di fidarsi.

In ogni caso il risultato non è un numero secco. È un **intervallo**: «tra 11 e 13 €» è una risposta più onesta di «12,37 €».

Alla fine del capitolo avrai percorso tutte e tre le strade su Velonda, e metterai le stime una accanto all'altra.'''),
    Q('Qual è il punto debole del metodo del confronto?', ['Se le aziende simili sono tutte care, anche la stima esce cara', 'Richiede previsioni su molti anni', 'Si può usare solo con le banche'], 0,
      "Il confronto prende per buoni i prezzi delle aziende simili. Se in quel momento il mercato le paga troppo, l'errore passa pari pari nella stima. Le previsioni lontane sono il punto debole della prima strada, non di questa."),
    Q('Per quale azienda il metodo dei pezzi è il più adatto?', ['Un produttore di bici in forte crescita', 'Una società che possiede solo palazzi affittati', 'Uno studio di consulenza'], 1,
      "Il metodo dei pezzi funziona quando il valore sta nei beni posseduti, e quei beni hanno un prezzo che si può stimare: è il caso dei palazzi. Un'azienda in crescita vale per gli utili futuri, uno studio di consulenza per le persone."),
    Q("Un'azienda giovane non ha ancora utili e non paga dividendi, ma in Borsa sono quotate tre aziende molto simili. Qual è la strada più praticabile?", ['I soldi che arriveranno: basta prevedere i dividendi', 'Il confronto, usando un multiplo delle vendite', "I pezzi: conta quello che possiede"], 1,
      "Senza utili e senza dividendi le previsioni sono un salto nel buio, e un'azienda giovane di solito possiede poco. Restano le aziende simili: si guarda quanto il mercato paga le loro vendite e si applica quel multiplo. È una stima grezza, ma parte da prezzi veri."),
  ], "Il valore si stima per tre strade: i soldi che arriveranno riportati a oggi, il confronto con aziende simili, il valore dei pezzi. Ognuna ha il suo terreno. Chi valuta sul serio ne usa almeno due, e conclude con un intervallo."),
]
