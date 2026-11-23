# Capitolo 5 di «Azioni», parte 2 (prima metà): capitalizzazione, utile per azione, P/E.
from lezioni_lib import Q, P, F, TACCHE, G, LV, BK, OR, N, LF
from azioni_dati import scheda

LEZIONI = [
  # ---------------------------------------------------------------------------------------------------
  LF('az-5-04', 'CAP', 'La capitalizzazione', 8, [
    G("Un'azione Pedalta costa 45 €. Un'azione Nordciclo costa 4,20 €. Sono i due concorrenti di Velonda quotati in Borsa. Quale delle due aziende vale di più?",
      "Manca un dato: **quante azioni** ha ciascuna. Pedalta ne ha 4 milioni, Nordciclo 50 milioni. Fatti i conti, l'azienda con l'azione da 4,20 € vale più di quella con l'azione da 45 €.",
      options=['Pedalta', 'Nordciclo', "Dal prezzo di un'azione non si può dire"], ans=2),
    P('Il prezzo di tutte le azioni insieme', r'''
Un'azienda è divisa in tante parti uguali, le azioni. Il prezzo che leggi in Borsa è il prezzo di **una sola** parte.

Per sapere quanto vale in Borsa tutta l'azienda si moltiplica il prezzo per il numero di azioni. Il risultato si chiama **capitalizzazione**:

$$\text{Cap} = P \times N$$

\(P\) = prezzo di un'azione, \(N\) = numero di azioni, \(\text{Cap}\) = capitalizzazione.

[fig]

Per Velonda:

$$\text{Cap} = 12 \times 20 \text{ milioni} = 240 \text{ milioni}$$

Comprare tutte le azioni Velonda al prezzo di oggi costerebbe 240 milioni di euro. È questo il numero che dice quanto è grande un'azienda in Borsa.''',
      fig=scheda("Prezzo di un'azione", 'Numero di azioni')),
    N(r'''
Pedalta: un'azione costa 45 € e le azioni sono 4 milioni.

Quanto vale la capitalizzazione di Pedalta, in milioni di euro?''', 180, 'mln €',
      r'''
$$\text{Cap} = P \times N$$

\(P\) = prezzo di un'azione (45 €), \(N\) = numero di azioni (4 milioni).

$$\text{Cap} = 45 \times 4 = 180$$

Pedalta vale in Borsa **180 milioni di euro**.'''),
    N(r'''
Nordciclo: un'azione costa 4,20 € e le azioni sono 50 milioni.

Quanto vale la capitalizzazione di Nordciclo, in milioni di euro?''', 210, 'mln €',
      r'''
$$\text{Cap} = P \times N$$

\(P\) = prezzo di un'azione (4,20 €), \(N\) = numero di azioni (50 milioni).

$$\text{Cap} = 4{,}20 \times 50 = 210$$

Nordciclo vale in Borsa **210 milioni di euro**: più di Pedalta, anche se la sua azione costa dieci volte meno.'''),
    P('Tre aziende a confronto', r'''
Ecco le tre aziende una sotto l'altra.

[fig]

L'azione più cara, quella di Pedalta, appartiene all'azienda più piccola. L'azione che costa meno, quella di Nordciclo, appartiene a un'azienda che vale più di Pedalta.

Il prezzo di una singola azione dipende da una scelta arbitraria: in quante parti l'azienda è stata divisa. Per questo **non si confrontano mai i prezzi di due azioni diverse**.

Si confrontano le capitalizzazioni, per dire chi è più grande. E per dire chi è più cara si usano i rapporti che vedrai nelle prossime lezioni.''',
      fig=F([('Velonda', '240 milioni', [(240, "Un'azione: 12 €", 'az')]), ('Nordciclo', '210 milioni', [(210, "Un'azione: 4,20 €", 'menta')]), ('Pedalta', '180 milioni', [(180, "Un'azione: 45 €", 'pesca')])],
            cap='La lunghezza della barra è la capitalizzazione.')),
    P('La stessa azienda, tagliata in più parti', r'''
Per convincerti, immagina che Pedalta decida di dividere ogni sua azione in dieci azioni più piccole. Si chiama **frazionamento**.

| | Prima | Dopo |
|---|---|---|
| Numero di azioni | 4 milioni | 40 milioni |
| Prezzo di un'azione | 45 € | 4,50 € |
| Capitalizzazione | 180 milioni | 180 milioni |

L'azienda è la stessa: stesse fabbriche, stessi utili. Chi aveva un'azione da 45 € ora ne ha dieci da 4,50 €, che insieme valgono sempre 45 €. Nessuno è diventato più ricco o più povero.

Esiste anche l'operazione contraria, il **raggruppamento**: dieci azioni vecchie diventano una sola, che costa dieci volte tanto. Anche lì il valore non cambia.

Il prezzo dell'azione può scendere del 90% senza che sia successo niente. Ecco perché, da solo, quel prezzo non dice se un'azienda è cara.'''),
    OR('Dalla più grande alla più piccola in Borsa', ['Velonda: 12 € per 20 milioni di azioni', 'Nordciclo: 4,20 € per 50 milioni di azioni', 'Pedalta: 45 € per 4 milioni di azioni'],
       x='Fai il conto della capitalizzazione, poi tocca le aziende dalla più grande alla più piccola.',
       after='240, 210 e 180 milioni. Se avessi guardato il prezzo di una azione, avresti messo Pedalta al primo posto.'),
    P('Quali azioni si contano', r'''
Nel conto della capitalizzazione entrano le **azioni in circolazione**: tutte quelle emesse, meno quelle che l'azienda ha ricomprato e tiene per sé. Queste si chiamano **azioni proprie**: non votano e non ricevono dividendi.

Un'azienda ha emesso 100 milioni di azioni e ne ha ricomprate 5: in circolazione ce ne sono 95 milioni.

C'è poi un'altra distinzione. Non tutte le azioni in circolazione cambiano mano in Borsa: una parte sta ferma per anni nelle mani dei fondatori, di una famiglia o dello Stato. Le azioni che circolano davvero si chiamano **flottante**.

Se la famiglia fondatrice tenesse il 60% di Velonda, il flottante sarebbe il 40%: 8 milioni di azioni, che a 12 € valgono 96 milioni. La capitalizzazione resterebbe 240 milioni. Ma molti indici di Borsa, per decidere quanto pesa un'azienda, contano solo il flottante.'''),
    P('Grandi, medie e piccole', r'''
In base alla capitalizzazione le aziende quotate si dividono in tre taglie, che troverai scritte in inglese:

• **large cap**: le grandi
• **mid cap**: le medie
• **small cap**: le piccole

Non esiste una soglia uguale per tutti: ogni Borsa e ogni indice fissa le sue. Conta l'idea. Le grandi di solito sono più stabili, e le loro azioni si comprano e si vendono in un attimo. Le piccole possono crescere più in fretta, ma i prezzi ballano di più e a volte è difficile trovare subito qualcuno con cui scambiare.

Con 240 milioni, Velonda è una piccola.

Un'ultima cosa: la capitalizzazione non sta ferma. Se domani il prezzo sale del 10%, anche la capitalizzazione sale del 10%.'''),
    Q("Un'azienda ha 30 milioni di azioni e ogni azione costa 8 €. Quanto vale la sua capitalizzazione?", ['38 milioni di €', '240 milioni di €', '24 milioni di €'], 1,
      r"\(\text{Cap} = P \times N = 8 \times 30 \text{ milioni} =\) **240 milioni di €**. Prezzo e numero di azioni si moltiplicano, non si sommano."),
    Q('Il prezzo di Velonda sale da 12 € a 13,20 €. Le azioni restano 20 milioni. Che cosa succede alla capitalizzazione?', ['Resta 240 milioni: le azioni non sono cambiate', 'Sale a 241,2 milioni', 'Sale a 264 milioni'], 2,
      r"\(13{,}20 \times 20 \text{ milioni} =\) **264 milioni**. Il prezzo è salito del 10% e la capitalizzazione sale del 10%: si muove insieme al prezzo, ogni giorno."),
    Q('Un\'azienda divide ogni sua azione in due. Subito dopo, che cosa è cambiato per un socio?', ['Ha il doppio delle azioni e ognuna vale la metà: in tutto ha lo stesso valore', 'Ha il doppio delle azioni allo stesso prezzo: il suo valore è raddoppiato', 'Ha le stesse azioni di prima, ma valgono la metà'], 0,
      "Un frazionamento taglia la stessa azienda in più parti. Il numero di azioni raddoppia, il prezzo di ognuna si dimezza, e la capitalizzazione resta identica: nessuno guadagna e nessuno perde."),
    Q("Un'azienda ha 50 milioni di azioni in circolazione, a 10 € l'una. Il fondatore ne possiede 30 milioni e non le vende. Quanto vale il flottante?", ['500 milioni di €', '300 milioni di €', '200 milioni di €'], 2,
      r"Il flottante sono le azioni che circolano davvero: \(50 - 30 = 20\) milioni, che a 10 € valgono **200 milioni di €**. I 500 milioni sono la capitalizzazione, i 300 la quota del fondatore."),
  ], "La capitalizzazione è il prezzo di un'azione per il numero di azioni in circolazione: dice quanto vale in Borsa tutta l'azienda. Il prezzo di una sola azione, da solo, non dice niente."),

  # ---------------------------------------------------------------------------------------------------
  LF('az-5-05', 'EPS', "L'utile per azione, fino in fondo", 9, [
    G("Velonda ha 20 milioni di azioni e un utile di 15 milioni. Immagina che l'anno prossimo l'utile resti lo stesso, ma le azioni diventino 25 milioni. Che cosa succede alla fetta di utile che spetta a ogni azione?",
      "La stessa torta divisa in più fette: ogni fetta è più piccola. Passa da 0,75 € a 0,60 €. Questo effetto si chiama **diluizione**, ed è il motivo per cui l'utile per azione va guardato con attenzione.",
      options=["Resta uguale: l'utile non è cambiato", 'Diventa più piccola', 'Diventa più grande'], ans=1),
    P("L'utile per azione", r'''
Per confrontare il prezzo di un'azione con gli utili serve sapere quanto utile spetta a ogni azione.

Si prende l'**utile netto** dell'anno e lo si divide per il numero di azioni. Il risultato è l'**utile per azione**, che troverai scritto **EPS** (dall'inglese earnings per share):

$$\text{EPS} = \frac{U}{N}$$

\(U\) = utile netto dell'anno, \(N\) = numero di azioni.

[fig]

Per Velonda:

$$\text{EPS} = \frac{15 \text{ milioni}}{20 \text{ milioni}} = 0{,}75$$

A ogni azione Velonda spettano **0,75 €** dell'utile di quest'anno. Non vuol dire che Nora li incassa: l'azienda decide quanta parte distribuire come dividendo e quanta tenere per crescere.''',
      fig=scheda('Utile netto', 'Numero di azioni')),
    N(r'''
Pedalta ha chiuso l'anno con un utile netto di 9 milioni. Le sue azioni sono 4 milioni.

Quanto vale l'utile per azione di Pedalta?''', 2.25, '€',
      r'''
$$\text{EPS} = \frac{U}{N}$$

\(U\) = utile netto (9 milioni), \(N\) = numero di azioni (4 milioni).

$$\text{EPS} = \frac{9}{4} = 2{,}25$$

A ogni azione Pedalta spettano **2,25 €** di utile.''', tol=0.005, dec=2),
    P('Due precisazioni', r'''
La formula completa ha due dettagli in più.

**L'utile è quello dei soci ordinari.** Alcune aziende hanno anche **azioni privilegiate**: azioni che ricevono un dividendo, di solito fisso, prima di tutte le altre. Quel dividendo va tolto dall'utile, perché non spetta ai soci ordinari.

**Le azioni sono quelle medie dell'anno.** Se durante l'anno il numero di azioni cambia, si fa la media pesata per i mesi.

$$\text{EPS} = \frac{U - \text{Div}_{\text{priv}}}{N_{\text{medio}}}$$

\(\text{Div}_{\text{priv}}\) = dividendi delle azioni privilegiate, \(N_{\text{medio}}\) = numero medio di azioni nell'anno.

Un esempio. Se a metà anno Velonda emettesse 4 milioni di azioni nuove, le azioni sarebbero 20 milioni per sei mesi e 24 per gli altri sei: in media 22. L'utile per azione sarebbe \(\dfrac{15}{22} = 0{,}68\) €.'''),
    P('Le azioni che potrebbero nascere', r'''
Le azioni di domani possono essere più di quelle di oggi. Succede quando l'azienda ha emesso strumenti che danno diritto ad avere azioni nuove:

• **opzioni** date ai dirigenti come premio: il diritto di comprare azioni a un prezzo fissato in partenza
• **obbligazioni convertibili**: prestiti che chi li ha comprati può scambiare con azioni

Se quei diritti vengono usati, nascono azioni nuove e lo stesso utile si divide tra più fette.

Per questo le aziende quotate pubblicano due numeri:

• **utile per azione base**: con le azioni che esistono oggi
• **utile per azione diluito**: fa finta che quei diritti siano già stati usati

Il diluito è il conto più prudente: mostra che cosa resterebbe a ogni azione se tutte quelle azioni nuove nascessero davvero.'''),
    P('Il conto con un prestito convertibile', r'''
Velonda non ha né opzioni né prestiti convertibili. Per vedere come funziona il conto, un'ipotesi.

Tra i suoi debiti c'è un prestito convertibile da 20 milioni, con interessi al 5%. Chi lo possiede può scambiarlo con 2,5 milioni di azioni nuove.

Se lo fa, cambiano due cose.

• **Sotto**, le azioni: \(20 + 2{,}5 = 22{,}5\) milioni.
• **Sopra**, l'utile: Velonda non paga più 1 milione di interessi. Tolte le imposte al 25%, l'utile sale di 0,75 milioni e arriva a 15,75.

$$\text{EPS diluito} = \frac{15{,}75}{22{,}5} = 0{,}70$$

Da 0,75 a 0,70 €: la conversione toglierebbe a ogni azione 5 centesimi di utile.'''),
    P('Il conto con le opzioni', r'''
Con le opzioni il conto è diverso, perché chi le usa **paga** le azioni nuove.

Un'ipotesi: i dirigenti di Velonda hanno 3 milioni di opzioni, ciascuna per comprare un'azione a 8 €. In Borsa, nell'anno, l'azione è costata in media 12 €.

• Se le usano tutte, Velonda emette 3 milioni di azioni e incassa \(3 \times 8 = 24\) milioni.
• Con 24 milioni, a 12 € l'una, potrebbe ricomprare in Borsa \(\dfrac{24}{12} = 2\) milioni di azioni.
• Le azioni in più, al netto, sono \(3 - 2 = 1\) milione.

$$\text{EPS diluito} = \frac{15}{20 + 1} = 0{,}71$$

Contano solo le opzioni con un prezzo più basso di quello di Borsa. Nessuno usa un'opzione per pagare 15 € un'azione che in Borsa ne costa 12.'''),
    N(r'''
Un'azienda ha un utile netto di 22 milioni e 10 milioni di azioni. I dirigenti hanno 2 milioni di opzioni, ciascuna per comprare un'azione a 10 €. Nell'anno l'azione è costata in media 20 €.

Quanto vale l'utile per azione diluito?''', 2, '€',
      r'''
Tre passi.

• Usando le opzioni l'azienda incassa \(2 \times 10 = 20\) milioni.
• Con 20 milioni, a 20 € l'una, ricompra \(\dfrac{20}{20} = 1\) milione di azioni.
• Le azioni in più, al netto, sono \(2 - 1 = 1\) milione.

$$\text{EPS diluito} = \frac{22}{10 + 1} = 2$$

L'utile per azione diluito è **2 €**, contro i 2,20 € di quello base.''', tol=0.005, dec=2),
    P('Quale si usa', r'''
Tre regole per orientarsi.

**Il diluito non è mai più alto del base.** Uno strumento che farebbe salire l'utile per azione non si conta: il conto diluito serve a essere prudenti, non ottimisti.

**Chi fa i conti sul serio guarda il diluito.** Se la distanza dal base è piccola, poco male. Se è grande, vuol dire che una bella fetta dell'azienda è già promessa a qualcun altro.

**Mai mescolare.** Quando confronti due aziende, usa lo stesso tipo di utile per tutte e due.

Velonda non ha strumenti di questo tipo: base e diluito coincidono, **0,75 €**. È il numero che useremo nel resto del capitolo.'''),
    BK('Può far nascere azioni nuove?', ['Sì', 'No'], [
      ('Opzioni ai dirigenti per comprare a 8 € azioni che in Borsa ne costano 12', 0, 'Conviene usarle: nasceranno azioni nuove.'),
      ('Obbligazioni che si possono scambiare con azioni', 0, 'Se vengono convertite, il prestito diventa azioni nuove.'),
      ('Un normale prestito della banca', 1, 'Un prestito si ripaga con i soldi: non diventa mai azioni.'),
      ('Opzioni per comprare a 20 € azioni che in Borsa ne costano 12', 1, 'Nessuno le usa finché comprare in Borsa costa meno.'),
      ('Un socio vende le sue azioni a un altro investitore', 1, 'Le azioni cambiano proprietario, ma il loro numero resta lo stesso.')],
      after="Prima di fidarti di un utile per azione, guarda quante azioni potrebbero aggiungersi a quelle di oggi."),
    Q("A inizio anno un'azienda ha 10 milioni di azioni. Il 1° luglio ne emette altri 2 milioni. L'utile netto dell'anno è 22 milioni. Quanto vale l'utile per azione base?", ['2,20 €', '2 €', '1,83 €'], 1,
      r"Per sei mesi le azioni sono state 10 milioni e per sei mesi 12: in media 11. \(\dfrac{22}{11} =\) **2 €**. Con 2,20 € hai usato le azioni di inizio anno, con 1,83 € quelle di fine anno."),
    Q("Un'azienda ha un utile netto di 50 milioni. Paga 5 milioni di dividendi alle azioni privilegiate. Le azioni ordinarie sono 15 milioni. Quanto vale l'utile per azione?", ['3,33 €', '3 €', '3,67 €'], 1,
      r"Prima si toglie quello che spetta alle privilegiate: \(50 - 5 = 45\) milioni. Poi \(\dfrac{45}{15} =\) **3 €**. Con 3,33 € hai lasciato dentro i dividendi delle privilegiate, che non sono dei soci ordinari."),
    Q("Un'azienda dichiara un utile per azione base di 1,50 € e diluito di 1,20 €. Che cosa dice questa distanza?", ["Che l'anno prossimo l'utile scenderà del 20%", 'Che molti strumenti possono diventare azioni nuove', "Che l'azienda ha sbagliato i conti"], 1,
      "Il diluito conta anche le azioni che nascerebbero da opzioni e prestiti convertibili. Se è il 20% più basso del base, le azioni in arrivo sono tante: chi compra oggi deve sapere che la sua fetta può restringersi. Non è una previsione sull'utile dell'anno prossimo."),
  ], "L'utile per azione è l'utile dei soci ordinari diviso il numero medio di azioni. Quello diluito conta anche le azioni che potrebbero nascere da opzioni e prestiti convertibili: è il più prudente, e non è mai più alto di quello base."),

  # ---------------------------------------------------------------------------------------------------
  LF('az-5-06', 'P/E', 'Il P/E: il prezzo contro gli utili', 10, [
    G("Comprare tutta Velonda in Borsa costa 240 milioni. Nell'ultimo anno Velonda ha guadagnato 15 milioni di utile netto. Se l'utile restasse uguale ogni anno, quanti anni di utili servirebbero per arrivare a 240 milioni?",
      r"\(\dfrac{240}{15} =\) **16 anni**. Questo numero è il più famoso della Borsa: si chiama **P/E**, e misura quanto è caro un prezzo rispetto agli utili.",
      lo=0, hi=40, step=1, truth=16, near=2, unit='anni'),
    P('Il P/E', r'''
L'utile per azione di Velonda è 0,75 €. Ora metti il prezzo sopra quel numero. È il rapporto **prezzo/utili**, per tutti **P/E** (price/earnings):

$$\text{P/E} = \frac{P}{\text{EPS}}$$

\(P\) = prezzo di un'azione, \(\text{EPS}\) = utile per azione.

Per Velonda:

$$\text{P/E} = \frac{12}{0{,}75} = 16$$

[fig]

Si legge così: per ogni euro di utile annuo di Velonda, oggi il mercato paga **16 €**.

Con le cifre di tutta l'azienda esce lo stesso numero: capitalizzazione diviso utile netto, \(\dfrac{240}{15} = 16\). È il conto che hai fatto all'inizio.''',
      fig=TACCHE(16, "Prezzo di un'azione", '12 €', '16 tacche da 0,75 €: una per ogni anno di utile', cap='Con gli utili fermi, servono 16 anni di utili per fare il prezzo.')),
    N(r'''
Nordciclo: un'azione costa 4,20 € e l'utile per azione è 0,42 €.

Quanto vale il P/E di Nordciclo?''', 10, '',
      r'''
$$\text{P/E} = \frac{P}{\text{EPS}}$$

\(P\) = prezzo di un'azione (4,20 €), \(\text{EPS}\) = utile per azione (0,42 €).

$$\text{P/E} = \frac{4{,}20}{0{,}42} = 10$$

Per ogni euro di utile annuo di Nordciclo il mercato paga **10 €**: meno dei 16 € che paga per Velonda.'''),
    P('Il P/E capovolto', r'''
Se capovolgi il P/E ottieni il **rendimento degli utili**: l'utile per azione diviso il prezzo.

$$\frac{\text{EPS}}{P} = \frac{0{,}75}{12} = 6{,}25\%$$

Si legge come un tasso: a ogni 100 € spesi in azioni Velonda corrispondono 6,25 € di utili l'anno.

Scritto così, si può mettere accanto a quello che rende un titolo di Stato. Se i titoli di Stato rendono di più, chi investe pretende di più anche dalle azioni: a parità di utili, è disposto a pagarle meno.

È uno dei motivi per cui, quando i tassi salgono, i P/E di solito scendono.'''),
    P('Come si legge un P/E', r'''
Un P/E, da solo, non dice se un'azione è cara. Dice **quanto il mercato è disposto a pagare** per gli utili di oggi. E il mercato paga di più quando si aspetta che gli utili crescano.

| | Pedalta | Velonda | Nordciclo |
|---|---|---|---|
| P/E | 20 | 16 | 10 |
| Crescita | 15% | 8% | 2% |

La crescita è quella che gli analisti si aspettano per gli utili nei prossimi anni.

• **P/E alto**: il mercato si aspetta molta crescita. Se arriva, il prezzo era giusto. Se non arriva, era troppo alto.
• **P/E basso**: il mercato si aspetta poco, o ha paura di qualcosa. Può essere un'occasione, oppure un'azienda con problemi veri.

Per questo il P/E si confronta sempre tra aziende **simili**: stesso settore, stesso tipo di attività.'''),
    LV('Un P/E alto è una scommessa sulla crescita',
       "Pedalta costa 45 € e ha un P/E di 20. Tieni fermo il prezzo e fai crescere gli utili: guarda che cosa succede al P/E calcolato sugli utili di quell'anno.",
       'pecresc', dict(P=45, E=2.25),
       [dict(id='g', label='Crescita degli utili ogni anno', min=0, max=25, step=1, start=0, unit='%'), dict(id='anni', label='Anni che passano', min=0, max=10, step=1, start=0, unit='anni')],
       [dict(label='Con una crescita del 15% (o meno), porta il P/E sotto 12', cond=[['g', '<=', 15], ['pe10', '<', 120]], hint='Metti la crescita al 15% e aggiungi un anno alla volta.'),
        dict(label='Ora crescita al 2% (o meno) per 10 anni: guarda dove resta il P/E', cond=[['g', '<=', 2], ['anni', '>=', 10]], hint='Abbassa la crescita fino al 2% e porta gli anni a 10.')],
       "Con il 15% l'anno bastano 4 anni perché il prezzo di oggi diventi normale. Con il 2% dopo dieci anni il P/E è ancora sopra 16. Chi paga un P/E alto sta scommettendo sulla crescita: se non arriva, ha pagato troppo."),
    P('Passato o atteso', r'''
Di P/E ne esistono due, e danno numeri diversi.

• Il **P/E passato** usa l'utile degli ultimi dodici mesi, già scritto nei conti. In inglese trailing.
• Il **P/E atteso** usa l'utile previsto per i prossimi dodici mesi. In inglese forward.

Gli analisti si aspettano che l'utile per azione di Velonda salga dell'8%, da 0,75 a 0,81 €.

$$\text{P/E atteso} = \frac{12}{0{,}81} = 14{,}8$$

| | Pedalta | Velonda | Nordciclo |
|---|---|---|---|
| P/E passato | 20 | 16 | 10 |
| P/E atteso | 17,4 | 14,8 | 9,8 |

Più l'azienda cresce, più il P/E atteso scende sotto quello passato. Il primo parte da un fatto, il secondo da una previsione, che può essere sbagliata. Quando confronti due aziende, usa lo stesso tipo per tutte e due.'''),
    N(r'''
Un'azione costa 30 €. Negli ultimi dodici mesi l'utile per azione è stato 2 €. Per i prossimi dodici mesi gli analisti si aspettano una crescita del 25%.

Quanto vale il P/E atteso?''', 12, '',
      r'''
Prima l'utile per azione atteso, poi il rapporto con il prezzo.

$$\text{EPS atteso} = 2 \times 1{,}25 = 2{,}50$$

$$\text{P/E atteso} = \frac{30}{2{,}50} = 12$$

Il P/E atteso è **12**. Quello passato è \(\dfrac{30}{2} = 15\): con gli utili in crescita, il P/E atteso è sempre il più basso dei due.'''),
    P("L'utile deve essere pulito", r'''
Un P/E vale quanto l'utile su cui è calcolato. Tre controlli.

**Ci sono guadagni o perdite di una volta sola?** Un'ipotesi: quest'anno Velonda vende un vecchio magazzino e guadagna 5 milioni in più. L'utile sale a 20 milioni e il P/E scende a \(\dfrac{240}{20} = 12\). Sembra un affare, ma quel guadagno non si ripeterà: il P/E vero resta 16. Vale anche al contrario, per una multa o la chiusura di una fabbrica.

**L'utile c'è?** Se l'azienda è in perdita il P/E è negativo e non dice niente. Con un utile vicino a zero diventa enorme, e non dice niente lo stesso.

**L'anno è normale?** Chi produce acciaio o automobili segue gli alti e bassi dell'economia: negli anni migliori ha utili gonfi e un P/E che sembra basso. Proprio quando gli utili stanno per scendere.'''),
    P('Pregi e difetti del P/E', r'''
Il P/E è il multiplo più usato, per buone ragioni.

• L'utile è quello che alla fine spetta ai soci: è la misura più diretta di quanto rende un'azienda.
• Lo usano tutti: trovi il P/E di qualunque azione, ed è facile fare confronti.

Ma ha quattro punti deboli.

• Non funziona con utili negativi o vicini a zero.
• L'utile balla più delle vendite e del patrimonio: un anno storto cambia il P/E.
• L'utile dipende da scelte di chi scrive i conti, come la durata degli ammortamenti.
• L'utile dipende dai debiti: due aziende identiche, una con molti debiti e una senza, hanno P/E diversi.

Per ognuno di questi difetti esiste un altro multiplo che lo aggira. Sono le prossime lezioni.'''),
    Q("Un'azione costa 36 € e il suo utile per azione è 3 €. Che cosa dice il suo P/E?", ["Che l'azione rende il 12% l'anno", 'Che paghi 12 € per ogni euro di utile annuo', "Che gli utili crescono del 12% l'anno"], 1,
      r"\(\text{P/E} = \dfrac{36}{3} = 12\): per ogni euro di utile annuo paghi **12 €**. Il P/E è un numero di volte, non una percentuale: non dice quanto rende l'azione né quanto crescono gli utili."),
    Q("Quest'anno un'azienda ha venduto la sua vecchia sede, e per questo l'utile è raddoppiato. Il suo P/E sembra bassissimo. Qual è la mossa giusta?", ['Ricalcolare il P/E senza il guadagno della vendita, che non si ripeterà', 'Comprare subito: un P/E così basso è un affare', "Lasciar perdere il P/E e guardare solo il prezzo dell'azione"], 0,
      "Il guadagno di una vendita fatta una volta sola gonfia l'utile di quest'anno e fa sembrare basso il P/E. Va tolto: il P/E serve a dire quanto paghi per gli utili che l'azienda sa ripetere."),
    Q('Due aziende dello stesso settore: A ha un P/E di 25, B di 9. Che cosa si può dire?', ['B guadagna più di A', 'A è di sicuro sopravvalutata', 'Il mercato si aspetta che gli utili di A crescano più di quelli di B'], 2,
      "Un P/E alto vuol dire che il mercato paga molto gli utili di oggi, di solito perché ne aspetta di più domani. Non dice quale azienda guadagna di più, e non basta per dire che A è cara: dipende da quanta crescita arriverà davvero."),
    Q("Un'azione costa 20 €. Negli ultimi dodici mesi l'utile per azione è stato 1 €; per i prossimi dodici gli analisti prevedono 1,25 €. Quanto valgono il P/E passato e quello atteso?", ['20 e 16', '16 e 20', '20 e 25'], 0,
      r"Passato: \(\dfrac{20}{1} = 20\). Atteso: \(\dfrac{20}{1{,}25} = 16\). Il prezzo è lo stesso, cambia l'utile che ci metti sotto. Se leggi un P/E senza sapere quale dei due è, non sai che cosa stai guardando."),
  ], "Il P/E è il prezzo diviso l'utile per azione: quanti euro paghi per un euro di utile annuo. Un P/E alto vuol dire crescita attesa, uno basso vuol dire dubbi. Ce ne sono due, passato e atteso: va calcolato su utili puliti e confrontato tra aziende simili."),
]
