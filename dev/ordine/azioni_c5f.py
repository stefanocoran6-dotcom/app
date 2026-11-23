# Capitolo 5 di «Azioni», parte 5: il metodo patrimoniale e il caso finale.
from lezioni_lib import Q, P, F, CAMPO, G, BK, N, LF

# il caso finale: gli stessi dati in ogni domanda (stanno sotto la linguetta «Il caso»)
CASO = r'''Nora confronta Velonda con i suoi due concorrenti quotati. Cifre in milioni di euro, tranne prezzo e numero di azioni.

| | Velonda | Pedalta | Nordciclo |
|---|---|---|---|
| Prezzo (€) | 12 | 45 | 4,20 |
| Azioni (mln) | 20 | 4 | 50 |
| Ricavi | 300 | 120 | 525 |
| Ris. operativo | 24 | 12,5 | 38 |
| Ammortamenti | 6 | 2,5 | 9,5 |
| Utile netto | 15 | 9 | 21 |
| Patrim. netto | 120 | 45 | 300 |
| Debiti finanz. | 80 | 10 | 200 |
| Cassa | 20 | 20 | 30 |
| Dividendi | 9 | 2,25 | 15 |

Velonda ha annunciato per l'anno prossimo un dividendo di 0,48 € per azione. Nora chiede un rendimento del 9% e si aspetta che poi il dividendo cresca del 5% l'anno.

Un grande gruppo ha appena offerto 15 € per ogni azione Velonda, per comprarla tutta.

'''
def QC(q, options, ans, exp): return Q(CASO + q, options, ans, exp)

LEZIONI = [
  # ---------------------------------------------------------------------------------------------------
  LF('az-5-17', 'A−D', 'Il metodo patrimoniale', 9, [
    G('Una società possiede solo tre palazzi dati in affitto, che oggi valgono in tutto 100 milioni. Ha debiti per 40 milioni. Quanto vale per i suoi soci?',
      r"\(100 - 40 =\) **60 milioni**. Quando un'azienda è fatta di cose che hanno un prezzo, il conto più diretto è questo: quello che possiede meno quello che deve. È la terza strada, il **metodo patrimoniale**.",
      lo=20, hi=100, step=10, truth=60, near=5, unit='mln €'),
    P('Contare i pezzi', r'''
Il **metodo patrimoniale** stima il valore per i soci così:

$$V = A - D_{\text{tot}}$$

\(A\) = attività, al valore di oggi; \(D_{\text{tot}}\) = tutti i debiti, anche quelli verso fornitori e dipendenti.

Assomiglia al patrimonio netto dei conti, ma con una differenza decisiva: le cifre non sono quelle scritte nei conti. Ogni voce viene **ristimata al valore di oggi**.

• Un terreno comprato trent'anni fa può valere molte volte la cifra scritta.
• Un marchio costruito in casa nei conti vale zero, e sul mercato no.
• Un magazzino pieno di modelli vecchi può valere meno di quanto è costato.
• Tra i crediti verso i clienti, qualcuno non verrà mai incassato.

È un lavoro lungo: servono periti per gli immobili, stime per i marchi, un controllo dei crediti uno per uno.'''),
    P('Velonda pezzo per pezzo', r'''
Ecco il conto per Velonda, in milioni. Le cifre di oggi sono ipotesi.

| Voce | Nei conti | Oggi |
|---|---|---|
| Fabbriche e terreni | 110 | 140 |
| Marchio | 0 | 20 |
| Magazzino | 70 | 62 |
| Crediti verso i clienti | 50 | 48 |
| Cassa | 20 | 20 |
| Totale attività | 250 | 290 |

I debiti, tutti, sono 130 milioni: 80 verso banche e obbligazionisti, 50 verso fornitori e altri.

$$V = 290 - 130 = 160$$

Ai soci spettano 160 milioni. Diviso 20 milioni di azioni: **8 € per azione**.

Con le cifre dei conti sarebbe \(250 - 130 = 120\): il patrimonio netto, 6 € per azione. La ristima aggiunge 2 €.'''),
    P('Perché esce meno del prezzo', r'''
In Borsa Velonda costa 12 €. Il metodo patrimoniale dice 8. Chi sbaglia?

Nessuno dei due: misurano cose diverse. Il metodo patrimoniale somma i pezzi. La Borsa paga anche quello che i pezzi fanno **insieme**: un'organizzazione che funziona, clienti che tornano, persone che sanno fare il loro mestiere. Questa differenza si chiama **avviamento**.

[fig]

Il metodo patrimoniale sta sopra la liquidazione, perché qui nessuno svende in fretta. E sta sotto il prezzo, perché non conta la capacità di guadagnare.

Per un'azienda che guadagna bene, quindi, dà quasi sempre una cifra troppo bassa. Serve come controllo: dice quanta parte del prezzo è coperta da cose che esistono.''',
      fig=F([('Se chiude e svende', '3,50 €', [(3.5, 'Liquidazione', 'giallo')]), ('I pezzi, ai prezzi di oggi', '8 €', [(8, 'Metodo patrimoniale', 'menta')]), ('In Borsa', '12 €', [(12, 'Prezzo', 'az')])])),
    N(r'''
Le attività di un'azienda, ristimate al valore di oggi, valgono 500 milioni. I debiti, tutti, sono 320 milioni. Le azioni sono 20 milioni.

Quanto vale un'azione secondo il metodo patrimoniale, in euro?''', 9, '€',
      r'''
$$V = A - D_{\text{tot}}$$

\(A\) = attività al valore di oggi (500), \(D_{\text{tot}}\) = tutti i debiti (320).

$$V = 500 - 320 = 180$$

Ai soci spettano 180 milioni. Diviso 20 milioni di azioni: **9 € per azione**.'''),
    P('Dove funziona', r'''
Il metodo patrimoniale è la strada giusta quando il valore sta nelle cose, e le cose hanno un prezzo.

• **Società immobiliari**: i palazzi si possono far stimare uno per uno.
• **Holding**, cioè società che possiedono quote di altre società: se quelle sono quotate, il conto è immediato.
• **Società che estraggono petrolio, gas o minerali**: valgono per quello che hanno ancora sotto terra.
• **Aziende che stanno per chiudere**: conta solo quello che si ricava dai pezzi.
• **Piccole aziende non quotate**, di cui non esistono previsioni affidabili né simili in Borsa.

Per immobiliari e holding il risultato ha un nome: **NAV** (net asset value), il valore netto di quello che possiedono. Spesso in Borsa costano meno del loro NAV: si dice che quotano **a sconto**.'''),
    P('Dove inciampa', r'''
Tre difficoltà, tutte pratiche.

**Trovare i prezzi.** Un palazzo in centro ha un mercato. Un macchinario costruito su misura no: quanto vale lo sa solo chi sa usarlo.

**Contare quello che non si tocca.** Marchi, brevetti, programmi, persone. Per molte aziende di oggi sono la parte più grande del valore, e la più difficile da stimare. Se li lasci fuori il risultato è troppo basso; se li metti, stai tirando a indovinare.

**Vedere i debiti nascosti.** Una causa in tribunale, un terreno da bonificare, pensioni promesse ai dipendenti. Nei conti possono non esserci ancora, ma chi compra l'azienda li eredita.

Per questo il metodo patrimoniale si usa di rado da solo. Di solito affianca le altre due strade, come pavimento sotto le loro stime.'''),
    BK('Il metodo patrimoniale è adatto?', ['Adatto', 'Poco adatto'], [
      ('Una società che possiede trenta palazzi affittati', 0, 'I palazzi hanno un mercato: si possono stimare uno per uno.'),
      ('Una holding con quote in cinque società quotate', 0, 'Le quote hanno un prezzo di Borsa: il conto è immediato.'),
      ('Una società di software in forte crescita', 1, 'Vale per programmi, persone e crescita futura: cose che questo metodo non sa contare.'),
      ("Un'azienda fallita che vende i macchinari", 0, 'Non lavorerà più: conta solo quello che si ricava dai pezzi.'),
      ('Uno studio di consulenza', 1, 'Possiede poco o niente: il suo valore sono le persone e i clienti.'),
      ('Un marchio di moda famoso in tutto il mondo', 1, 'Il valore sta quasi tutto nel marchio, che è il pezzo più difficile da stimare.')],
      after='Più il valore sta in cose che si possono vendere una per una, più questo metodo funziona.'),
    Q("Una holding possiede quote di società quotate che oggi valgono 800 milioni, e ha debiti per 200 milioni. Le sue azioni sono 100 milioni e costano 4,80 € l'una. Di quanto è lo sconto rispetto al NAV?", ['20%', '25%', '40%'], 0,
      r"Il NAV è \(800 - 200 = 600\) milioni, cioè 6 € per azione. In Borsa l'azione costa 4,80 €: \(\dfrac{6 - 4{,}80}{6} =\) **20%** in meno. Lo sconto si misura sul NAV, non sul prezzo: dividendo per 4,80 uscirebbe 25%."),
    Q('Per Velonda il metodo patrimoniale dà 8 € per azione, contro un prezzo di 12 €. Qual è la spiegazione più probabile?', ['In Borsa Velonda è di sicuro sopravvalutata', "Il metodo conta i pezzi, non quello che l'azienda guadagna usandoli insieme", 'I conti di Velonda sono sbagliati'], 1,
      "Un'azienda che funziona vale più della somma dei suoi beni, perché con quei beni produce utili ogni anno. La differenza è l'avviamento. Il metodo patrimoniale non la vede: per questo, per un'azienda che guadagna bene, dà una cifra più bassa del prezzo."),
    Q('Qual è una difficoltà tipica del metodo patrimoniale?', ['Servono previsioni dei dividendi per molti anni', 'Molti beni non hanno un mercato da cui leggere il prezzo', 'Dipende dai prezzi delle aziende simili'], 1,
      "Per ristimare ogni voce al valore di oggi serve un prezzo, e per impianti su misura, marchi e brevetti un prezzo di mercato spesso non esiste. Le previsioni lontane sono il problema della prima strada, i prezzi dei simili quello della seconda."),
  ], "Il metodo patrimoniale stima il valore per i soci come attività al valore di oggi meno tutti i debiti. Funziona per chi vale per quello che possiede: immobiliari, holding, aziende che chiudono. Per un'azienda che guadagna bene dà una cifra troppo bassa, e fa da pavimento."),

  # ---------------------------------------------------------------------------------------------------
  LF('az-5-18', 'CASO', 'Il caso: Velonda costa tanto o poco?', 12, [
    P('Cinque mosse', r'''
Adesso metti tutto insieme. Nora ha davanti i numeri di Velonda e dei suoi due concorrenti, e deve rispondere alla domanda del capitolo.

Le mosse sono cinque, sempre le stesse:

• **calcola** i multipli dell'azienda
• **confrontali** con quelli delle aziende simili
• **chiediti perché** sono diversi: crescita, margini, debiti
• **controlla** con i soldi che arriveranno: quanta crescita c'è dentro il prezzo?
• **concludi** con un intervallo, non con un numero

Nelle prossime domande i dati sono sempre gli stessi: li trovi sotto la linguetta «Il caso», e li puoi riaprire da ogni domanda.'''),
    QC('Quale azienda ha il P/E più basso?', ['Nordciclo', 'Velonda', 'Pedalta'], 0,
       r"Con le cifre di tutta l'azienda, il P/E è capitalizzazione diviso utile netto. Velonda: \(\dfrac{12 \times 20}{15} = 16\). Pedalta: \(\dfrac{45 \times 4}{9} = 20\). Nordciclo: \(\dfrac{4{,}20 \times 50}{21} = 10\). Il più basso è quello di **Nordciclo**."),
    QC("Quanto vale l'EV/EBITDA di Velonda?", ['10', '12,5', '8'], 0,
       r"EV: \(240 + 80 - 20 = 300\). EBITDA: risultato operativo più ammortamenti, \(24 + 6 = 30\). Quindi \(\dfrac{300}{30} =\) **10**. Il 12,5 è l'EV diviso il solo risultato operativo; 8 esce mettendo sopra la capitalizzazione, che riguarda solo i soci."),
    QC("Con il P/E Nordciclo sembra costare molto meno di Velonda: 10 contro 16. Che cosa succede se le confronti con l'EV diviso il risultato operativo?", ['La distanza aumenta', 'Nordciclo diventa più cara di Velonda', 'La distanza si riduce: 10 contro 12,5'], 2,
       r"Velonda: EV 300, diviso 24 fa **12,5**. Nordciclo: EV \(210 + 200 - 30 = 380\), diviso 38 fa **10**. Nordciclo resta meno cara, ma la distanza scende dal 60% al 25%: una buona parte del suo P/E basso dipende dai debiti."),
    QC("Nora applica a Velonda la media dei P/E dei due concorrenti. Che prezzo ottiene per un'azione Velonda?", ['15 €', '11,25 €', '12 €'], 1,
       r"I P/E dei concorrenti sono 20 e 10: la media è 15. L'utile per azione di Velonda è \(\dfrac{15}{20} = 0{,}75\) €. Quindi \(V = 15 \times 0{,}75 =\) **11,25 €**. Il 15 è il multiplo, non il prezzo; 12 € è il prezzo di Borsa."),
    QC("La media degli EV/EBITDA dei due concorrenti è 9,67. Applicandola a Velonda, che prezzo ottiene Nora per un'azione?", ['14,50 €', '11,50 €', '9,67 €'], 1,
       r"Valore dell'attività: \(9{,}67 \times 30 = 290\) milioni. Meno il debito netto, \(80 - 20 = 60\): restano 230 milioni per i soci. Diviso 20 milioni di azioni: **11,50 €**. Con 14,50 € hai dimenticato di togliere il debito netto."),
    QC('Quanto vale la crescita sostenibile di Velonda?', ['5%', '7,5%', '12,5%'], 0,
       r"Payout: \(\dfrac{9}{15} = 60\%\), quindi la quota trattenuta è il 40%. ROE: \(\dfrac{15}{120} = 12{,}5\%\). Crescita sostenibile: \(40\% \times 12{,}5\% =\) **5%**. Con 7,5% hai usato il payout al posto della quota trattenuta; 12,5% è il ROE."),
    QC("Con il modello di Gordon, quanto vale per Nora un'azione Velonda?", ['12 €', '5,33 €', '9,60 €'], 0,
       r"\(V = \dfrac{\text{Div}_1}{r - g} = \dfrac{0{,}48}{9\% - 5\%} =\) **12 €**. Con 5,33 € hai diviso per il 9% senza togliere la crescita; 9,60 € è il valore per chi chiede il 10%."),
    QC('Se Nora chiedesse un rendimento del 10% invece del 9%, a parità di tutto il resto, che cosa succederebbe al valore di Gordon?', ['Scenderebbe a 9,60 €', 'Salirebbe a 16 €', 'Resterebbe 12 €'], 0,
       r"\(\dfrac{0{,}48}{10\% - 5\%} =\) **9,60 €**. Un punto in più di rendimento richiesto toglie il 20% al valore. I 16 € escono con l'8%: chi si accontenta di meno è disposto a pagare di più."),
    QC('Il gruppo offre 15 € per azione. Di quanto è il premio rispetto al prezzo di Borsa?', ['20%', '25%', '3%'], 1,
       r"\(\dfrac{15 - 12}{12} =\) **25%**. Il premio si misura sul prezzo di Borsa. Chi compra tutta l'azienda la paga di più perché compra anche il comando, e perché può ottenere risparmi che un piccolo socio non avrà mai."),
    QC('Mettendo insieme tutto, qual è la conclusione più ragionevole per Nora?', ['Velonda è cara: la sua azione costa quasi il triplo di quella di Nordciclo', "A 12 € Velonda è dentro l'intervallo delle stime: un prezzo pieno, ma coerente", 'Velonda è un affare sicuro: va comprata subito'], 1,
       "Il prezzo di una sola azione non dice niente. Il confronto con i simili dà tra 11,25 e 12,50 €, i dividendi scontati circa 12 €: il prezzo di Borsa sta lì dentro. Non c'è un margine di sicurezza, quindi non è un affare; ma il prezzo è coerente con quello che l'azienda è."),
    P('Tutte le stime in fila', r'''
Hai percorso le tre strade. Ecco tutte le stime di un'azione Velonda, una sotto l'altra, con il prezzo di Borsa segnato dalla riga.

[fig]

Le strade adatte a un'azienda che funziona, cioè il confronto con i simili e i dividendi scontati, si incontrano tra 11 e 12,50 €. Il prezzo di Borsa sta lì dentro.

Guarda la barra più larga: spostando la crescita di un solo punto, in su o in giù, il valore dei dividendi va da 9,60 a 16 €. È il modo onesto di disegnare una stima che dipende molto dalle ipotesi.

I pezzi stanno più in basso, come ti aspetti per un'azienda che vale per quello che guadagna. L'offerta del gruppo sta più in alto, perché chi compra tutto paga anche il comando.''',
      fig=CAMPO([('Liquidazione', 3.5, 3.5, '3,50 €', 'giallo'), ('I pezzi, ai prezzi di oggi', 8, 8, '8 €', 'giallo'), ('Il suo P/E medio di dieci anni', 10.5, 10.5, '10,50 €', 'menta'),
                 ('I simili: P/E, EV/EBITDA, P/CF', 11.25, 12.5, 'da 11,25 a 12,50 €', 'menta'), ('I dividendi: Gordon e due fasi', 12, 12.23, 'da 12 a 12,23 €', 'az'),
                 ('I dividendi, con crescita dal 4% al 6%', 9.6, 16, 'da 9,60 a 16 €', 'az'), ("L'offerta per tutta l'azienda", 15, 15, '15 €', 'pesca')], (12, 'Prezzo di Borsa: 12 €')),
      deep=("Il formulario: multipli e valore d'impresa", r'''
| Che cosa | Formula |
|---|---|
| Capitalizzazione | \(P \times N\) |
| Utile per azione | \(U / N\) |
| P/E | \(P / \text{EPS}\) |
| P/B | \(P / \text{BVPS}\) |
| P/S | \(\text{Cap} / R\) |
| P/CF | \(\text{Cap} / CF\) |
| ROE | \(U / PN\) |
| EV | \(\text{Cap} + D - C\) |
| EBITDA | \(\text{EBIT} + \text{ammortamenti}\) |
| Margine di sicurezza | \((V - P) / V\) |

\(P\) = prezzo, \(N\) = azioni, \(U\) = utile netto, \(PN\) = patrimonio netto, \(R\) = ricavi, \(CF\) = flusso di cassa operativo, \(D\) = debiti finanziari, \(C\) = cassa, \(V\) = valore stimato.

Due uguaglianze: \(\text{P/B} = \text{P/E} \times \text{ROE}\) e \(\text{P/S} = \text{P/E} \times \text{margine netto}\).''')),
    P('Il verdetto di Nora', r'''
Costa tanto o poco? Nora adesso ha una risposta, e sa da dove viene.

• **Rispetto ai simili**, Velonda costa un filo più della media: P/E 16 contro 15. Ma cresce e rende più di Nordciclo e meno di Pedalta: sta dove deve stare.
• **Rispetto ai soldi che darà**, 12 € è il prezzo giusto per chi chiede il 9% e crede a una crescita del 5%. Il P/E che merita, 15, è quasi quello che ha.
• **Rispetto a quello che possiede**, i pezzi coprono 8 € su 12: il resto è la capacità di guadagnare.

Il verdetto: **12 € è un prezzo onesto, ma pieno**. Non c'è margine di sicurezza. Chi compra a questo prezzo non fa un affare: compra una buona azienda a quello che vale, e guadagnerà se la crescita arriva davvero.

A Nora va bene così. Resta da capire come si compra, in pratica, un'azione: è il prossimo capitolo.''',
      deep=('Il formulario: i soldi che arriveranno', r'''
| Che cosa | Formula |
|---|---|
| Valore a un anno | \((\text{Div}_1 + P_1) / (1 + r)\) |
| Gordon | \(\text{Div}_1 / (r - g)\) |
| Rendimento offerto | \(\text{Div}_1 / P + g\) |
| Crescita sostenibile | \((1 - \text{payout}) \times \text{ROE}\) |
| P/E giusto | \(\text{payout} / (r - g)\) |
| Privilegiata | \(\text{Div} / r\) |
| Cassa per i soci | \(CF - I + \Delta D\) |
| Metodo patrimoniale | \(A - D_{\text{tot}}\) |

\(\text{Div}_1\) e \(P_1\) = dividendo e prezzo tra un anno, \(r\) = rendimento richiesto, \(g\) = crescita, \(I\) = investimenti, \(\Delta D\) = debiti nuovi, \(A\) = attività al valore di oggi, \(D_{\text{tot}}\) = tutti i debiti.''')),
  ], "Per dire se un'azione è cara: calcola i multipli, confrontali con quelli di aziende simili, chiediti perché sono diversi, controlla con i soldi che arriveranno e concludi con un intervallo."),
]
