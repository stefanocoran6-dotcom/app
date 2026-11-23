# Contenuti della materia "Azioni". Scrive azioni.json, che build.sh inserisce in ordine.js come AZIONI_UNITS.
# Ogni capitolo è una domanda che si fa Nora, che vuole investire in Velonda (azienda inventata): la storia, i numeri e le regole di scrittura stanno in AZIONI.md.
# I testi sono scritti da zero. Gli argomenti sono quelli di ogni manuale di valutazione; esempi, numeri, ordine e parole sono nostri.
# Uso: python3 dev/ordine/azioni_src.py   (lo lancia build.sh)
import json, os
from lezioni_lib import Q, M, P, F, SCHEDA, PONTE, TACCHE, G, LV, BK, OR, N, LF, controlla, nb
H = os.path.dirname(os.path.abspath(__file__))

# =====================================================================================================
# I NUMERI DELLA STORIA (milioni di euro, tranne prezzo e azioni). Ogni cifra delle lezioni esce da qui: se ne cambia una, i controlli sotto dicono dove non torna.
# =====================================================================================================
AZ = dict(
    velonda=dict(P=12, N=20, R=300, EBIT=24, AMM=6, INT=4, U=15, PN=120, D=80, C=20),
    pedalta=dict(P=45, N=4, R=120, EBIT=12.5, INT=0.5, U=9, PN=45, D=10, C=20),
    nordciclo=dict(P=4.2, N=50, R=525, EBIT=38, INT=10, U=21, PN=300, D=200, C=30))
def conti(a):
    cap = a['P'] * a['N']; ev = cap + a['D'] - a['C']
    return dict(cap=cap, eps=a['U'] / a['N'], pe=cap / a['U'], bvps=a['PN'] / a['N'], pb=cap / a['PN'], ps=cap / a['R'], ev=ev, evebit=ev / a['EBIT'], roe=a['U'] / a['PN'], marg=a['U'] / a['R'])
K = {k: conti(v) for k, v in AZ.items()}
vicino = lambda a, b: abs(a - b) < 1e-9
for k, a in AZ.items():   # il conto economico torna: (risultato operativo - interessi) meno il 25% di imposte = utile netto; interessi = 5% dei debiti
    assert vicino((a['EBIT'] - a['INT']) * 0.75, a['U']), k
    assert vicino(a['INT'], 0.05 * a['D']), k
    assert vicino(K[k]['pb'], K[k]['pe'] * K[k]['roe']) and vicino(K[k]['ps'], K[k]['pe'] * K[k]['marg']), k
V, PD, NC = K['velonda'], K['pedalta'], K['nordciclo']
assert (V['cap'], PD['cap'], NC['cap']) == (240, 180, 210)
assert (V['eps'], PD['eps'], round(NC['eps'], 2)) == (0.75, 2.25, 0.42)
assert [round(x['pe'], 6) for x in (V, PD, NC)] == [16, 20, 10]
assert [round(x['pb'], 6) for x in (V, PD, NC)] == [2, 4, 0.7]
assert [round(x['ps'], 6) for x in (V, PD, NC)] == [0.8, 1.5, 0.4]
assert (V['ev'], PD['ev'], NC['ev']) == (300, 170, 380)
assert [round(x['evebit'], 6) for x in (V, PD, NC)] == [12.5, 13.6, 10]
assert [round(x['roe'], 6) for x in (V, PD, NC)] == [0.125, 0.2, 0.07]
assert [round(x['marg'], 6) for x in (V, PD, NC)] == [0.05, 0.075, 0.04]
assert vicino((0.30 + 13.45) / 1.10, 12.5)                      # prima strada: il valore a un anno
assert vicino((PD['pe'] + NC['pe']) / 2 * V['eps'], 11.25)        # seconda strada: il confronto
assert vicino((290 - 130) / 20, 8) and vicino((200 - 130) / 20, 3.5)   # terza strada (pezzi a prezzi di oggi) e liquidazione
assert vicino(AZ['velonda']['EBIT'] + AZ['velonda']['AMM'], 30) and vicino(V['ev'] / 30, 10)   # EBITDA ed EV/EBITDA
assert vicino(0.30 / 12, 0.025) and vicino(0.30 * 20 / 15, 0.4)  # dividendo: 2,5% del prezzo, 40% dell'utile

# la scheda di Velonda: in ogni pagina si mettono in evidenza le voci che servono lì
RIGHE = [("Prezzo di un'azione", '12 €'), ('Numero di azioni', '20 milioni'), ('Ricavi', '300 milioni'), ('Risultato operativo', '24 milioni'), ('Utile netto', '15 milioni'),
         ('Patrimonio netto', '120 milioni'), ('Debiti finanziari', '80 milioni'), ('Cassa', '20 milioni')]
def scheda(*hl, cap=None, tutta=False):
    d = SCHEDA('Velonda', 'Bici da città ed elettriche', RIGHE, hl, cap)
    if tutta: d['full'] = 1
    return d

# il caso finale: gli stessi dati in ogni domanda (stanno sotto la linguetta «Il caso»)
CASO = r'''Nora confronta Velonda con i suoi due concorrenti quotati. Cifre in milioni di euro, tranne prezzo e numero di azioni.

| | Velonda | Pedalta | Nordciclo |
|---|---|---|---|
| Prezzo (€) | 12 | 45 | 4,20 |
| Azioni (mln) | 20 | 4 | 50 |
| Ricavi | 300 | 120 | 525 |
| Ris. operativo | 24 | 12,5 | 38 |
| Utile netto | 15 | 9 | 21 |
| Patrim. netto | 120 | 45 | 300 |
| Debiti finanz. | 80 | 10 | 200 |
| Cassa | 20 | 20 | 30 |

Un grande gruppo ha appena offerto 15 € per ogni azione Velonda, per comprarla tutta.

'''
def QC(q, options, ans, exp): return Q(CASO + q, options, ans, exp)

# =====================================================================================================
# CAPITOLO 5 · COSTA TANTO O POCO?
# =====================================================================================================
C5 = dict(id='az-c5', sid='az-costa', name='Costa tanto o poco?', num=5, lab='multipli',
  pre=[dict(course='basi', unit='basi-u5', name="Leggere un'azienda"), dict(course='basi', unit='basi-u1', name='I soldi nel tempo')], lessons=[

  # ---------------------------------------------------------------------------------------------------
  LF('az-5-1', 'P≠V', 'Prezzo e valore non sono la stessa cosa', 7, [
    P('Nora e la sua bici', r'''
Nora ha 29 anni e va al lavoro in bici elettrica. La sua bici è una **Velonda**: un'azienda italiana che produce bici da città, quotata in Borsa.

Nora ha messo da parte 3.000 € e sta pensando di comprare azioni Velonda. Ha già guardato che cosa produce l'azienda, in che settore lavora e come se la cava contro i concorrenti. Le piace.

Resta la domanda più difficile. Oggi un'azione Velonda costa **12 €**: è tanto o poco?

[fig]

In questo capitolo impari a rispondere con i numeri. Questa è la scheda di Velonda: la ritroverai in ogni lezione.

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

Due persone serie possono stimare due valori diversi per la stessa azione. Sul prezzo, invece, non si discute.''',
      deep=('Perché il prezzo si allontana dal valore', r'''
Nel breve periodo il prezzo lo muovono anche cose che con l'azienda c'entrano poco: la paura dopo una brutta giornata di Borsa, l'entusiasmo per un settore di moda, un grande fondo che deve vendere in fretta.

Nel lungo periodo, però, il prezzo tende a seguire i risultati dell'azienda. Benjamin Graham, il maestro di Warren Buffett, lo diceva più o meno così: nel breve il mercato è una macchina che conta i voti, nel lungo è una bilancia che pesa.

Quanto in fretta il prezzo torna vicino al valore è una delle grandi discussioni della finanza. La trovi nel capitolo 10, «Posso battere il mercato?».''')),
    P('Cara o a buon mercato', r'''
Tutto il gioco sta nel confrontare i due numeri.

• Se il valore stimato è **più alto** del prezzo, l'azione è **sottovalutata**: costa meno di quanto vale.
• Se è **più basso**, è **sopravvalutata**: costa più di quanto vale.

Un analista stima che un'azione Velonda valga 15 €. In Borsa costa 12 €.

[fig]

Per lui è sottovalutata. Ma una stima può essere sbagliata. Per questo chi investe vuole un cuscinetto tra la sua stima e il prezzo che paga: il **margine di sicurezza**.

$$M = \frac{V - P}{V}$$

\(V\) = valore stimato, \(P\) = prezzo, \(M\) = margine di sicurezza.

$$M = \frac{15 - 12}{15} = 20\%$$

Il prezzo è il 20% sotto la stima: anche se l'analista avesse esagerato un po', resterebbe spazio.''',
      fig=F([('Valore stimato', '15 €', [(15, "Stima dell'analista", 'menta')]), ('Prezzo in Borsa', '12 €', [(12, 'Prezzo', 'az')])])),
    N(r'''
Un'analista stima che un'azione valga 40 €. In Borsa l'azione costa 30 €.

Quanto vale il margine di sicurezza, in percentuale del valore stimato?''', 25, '%',
      r'''
$$M = \frac{V - P}{V}$$

\(V\) = valore stimato (40 €), \(P\) = prezzo (30 €).

$$M = \frac{40 - 30}{40} = 25\%$$

Il prezzo è il **25%** sotto la stima. Attenzione a dividere per il valore stimato e non per il prezzo: con il prezzo uscirebbe 33%.'''),
    P("Se l'azienda chiudesse domani", r'''
Esiste un valore che fa da pavimento: il **valore di liquidazione**. È quello che resterebbe ai soci se l'azienda chiudesse, vendesse tutto quello che ha e pagasse tutti i debiti.

Per Velonda, un'ipotesi:

• vendendo in fretta fabbriche, magazzino e marchio si incassano 200 milioni
• i debiti da pagare, tutti, sono 130 milioni
• ai soci restano \(200 - 130 =\) **70 milioni**

Le azioni sono 20 milioni: \(\dfrac{70}{20} =\) **3,50 € per azione**.

In Borsa l'azione ne costa 12. Il motivo è semplice: un'azienda che funziona vale più dei suoi pezzi venduti uno per uno, perché ogni anno produce utili.

Il valore di liquidazione conta davvero solo quando un'azienda sta per chiudere.'''),
    P('Se qualcuno la comprasse tutta', r'''
C'è poi il valore per chi compra **tutta** l'azienda.

Nora, con le sue poche azioni, non decide niente. Chi compra tutte le azioni invece comanda: sceglie i dirigenti, cambia la strategia, unisce le fabbriche con le proprie e taglia i costi doppi. Per lui l'azienda può valere di più.

Per questo chi vuole comprare un'intera azienda di solito offre più del prezzo di Borsa. La differenza si chiama **premio di controllo**.

Un grande gruppo offre 15 € per ogni azione Velonda, che in Borsa costa 12 €:

$$\frac{15 - 12}{12} = 25\%$$

Il premio è del 25%. Non vuol dire che il prezzo di Borsa fosse sbagliato: vuol dire che comandare vale qualcosa in più.'''),
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
    Q("Un gruppo offre 26 € per azione per comprare un'intera azienda, che in Borsa quota 20 €. Quanto vale il premio di controllo?", ['6%', '23%', '30%'], 2,
      r"Il premio si misura sul prezzo di Borsa: \(\dfrac{26 - 20}{20} =\) **30%**. Il 23% esce dividendo per il prezzo offerto, ma chi vende confronta l'offerta con quello che ha in mano oggi."),
    Q('Quale frase sul valore intrinseco è giusta?', ["È il prezzo a cui l'azione si scambia oggi", 'È una stima: persone diverse possono arrivare a cifre diverse', 'È sempre uguale al valore di liquidazione'], 1,
      "Il valore intrinseco non si legge da nessuna parte: si stima a partire da quello che l'azienda darà ai soci nel tempo, e dipende dalle ipotesi di chi fa i conti. Il prezzo si legge in Borsa, e il valore di liquidazione riguarda un'azienda che chiude."),
  ], "Il prezzo lo leggi, il valore lo stimi. Se la stima è più alta del prezzo l'azione è sottovalutata. Ma una stima può sbagliare: per questo serve un margine di sicurezza."),

  # ---------------------------------------------------------------------------------------------------
  LF('az-5-2', 'CAP', 'La capitalizzazione', 6, [
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

Il prezzo dell'azione è sceso del 90% e non è successo niente. Ecco perché, da solo, quel prezzo non dice se un'azienda è cara.'''),
    OR('Dalla più grande alla più piccola in Borsa', ['Velonda: 12 € per 20 milioni di azioni', 'Nordciclo: 4,20 € per 50 milioni di azioni', 'Pedalta: 45 € per 4 milioni di azioni'],
       x='Fai il conto della capitalizzazione, poi tocca le aziende dalla più grande alla più piccola.',
       after='240, 210 e 180 milioni. Se avessi guardato il prezzo di una azione, avresti messo Pedalta al primo posto.'),
    P('Grandi, medie e piccole', r'''
In base alla capitalizzazione le aziende quotate si dividono in tre taglie, che troverai scritte in inglese:

• **large cap**: le grandi
• **mid cap**: le medie
• **small cap**: le piccole

Non esiste una soglia uguale per tutti: ogni Borsa e ogni indice fissa le sue. Conta l'idea. Le grandi di solito sono più stabili, e le loro azioni si comprano e si vendono in un attimo. Le piccole possono crescere più in fretta, ma i prezzi ballano di più e a volte è difficile trovare subito qualcuno con cui scambiare.

Con 240 milioni, Velonda è una piccola.

Un'ultima cosa: la capitalizzazione non sta ferma. Se domani il prezzo sale del 10%, anche la capitalizzazione sale del 10%.''',
      deep=('Il flottante', r'''
Non tutte le azioni di un'azienda cambiano mano in Borsa. Una parte sta ferma per anni nelle mani dei fondatori, di una famiglia o dello Stato.

Le azioni che circolano davvero si chiamano **flottante**. Se la famiglia fondatrice tenesse il 60% di Velonda, il flottante sarebbe il 40%: 8 milioni di azioni, che a 12 € valgono 96 milioni.

La capitalizzazione resterebbe 240 milioni. Ma molti indici di Borsa, per decidere quanto pesa un'azienda, contano solo il flottante. Ne riparliamo nel capitolo 8, «Come misuro com'è andata?».''')),
    Q("Un'azienda ha 30 milioni di azioni e ogni azione costa 8 €. Quanto vale la sua capitalizzazione?", ['38 milioni di €', '240 milioni di €', '24 milioni di €'], 1,
      r"\(\text{Cap} = P \times N = 8 \times 30 \text{ milioni} =\) **240 milioni di €**. Prezzo e numero di azioni si moltiplicano, non si sommano."),
    Q('Il prezzo di Velonda sale da 12 € a 13,20 €. Le azioni restano 20 milioni. Che cosa succede alla capitalizzazione?', ['Resta 240 milioni: le azioni non sono cambiate', 'Sale a 241,2 milioni', 'Sale a 264 milioni'], 2,
      r"\(13{,}20 \times 20 \text{ milioni} =\) **264 milioni**. Il prezzo è salito del 10% e la capitalizzazione sale del 10%: si muove insieme al prezzo, ogni giorno."),
    Q('Un\'azienda divide ogni sua azione in due. Subito dopo, che cosa è cambiato per un socio?', ['Ha il doppio delle azioni e ognuna vale la metà: in tutto ha lo stesso valore', 'Ha il doppio delle azioni allo stesso prezzo: il suo valore è raddoppiato', 'Ha le stesse azioni di prima, ma valgono la metà'], 0,
      "Un frazionamento taglia la stessa azienda in più parti. Il numero di azioni raddoppia, il prezzo di ognuna si dimezza, e la capitalizzazione resta identica: nessuno guadagna e nessuno perde."),
  ], "La capitalizzazione è il prezzo di un'azione per il numero di azioni: dice quanto vale in Borsa tutta l'azienda. Il prezzo di una sola azione, da solo, non dice niente."),

  # ---------------------------------------------------------------------------------------------------
  LF('az-5-3', 'P/E', 'Il P/E: il prezzo contro gli utili', 8, [
    G("Comprare tutta Velonda in Borsa costa 240 milioni. Nell'ultimo anno Velonda ha guadagnato 15 milioni di utile netto. Se l'utile restasse uguale ogni anno, quanti anni di utili servirebbero per arrivare a 240 milioni?",
      r"\(\dfrac{240}{15} =\) **16 anni**. Questo numero è il più famoso della Borsa: si chiama **P/E**, e misura quanto è caro un prezzo rispetto agli utili.",
      lo=0, hi=40, step=1, truth=16, near=2, unit='anni'),
    P("Prima: l'utile per azione", r'''
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
    P('Il P/E', r'''
Ora metti il prezzo sopra l'utile per azione. È il rapporto **prezzo/utili**, per tutti **P/E** (price/earnings):

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
    P('Come si legge un P/E', r'''
Un P/E, da solo, non dice se un'azione è cara. Dice **quanto il mercato è disposto a pagare** per gli utili di oggi. E il mercato paga di più quando si aspetta che gli utili crescano.

| | Pedalta | Velonda | Nordciclo |
|---|---|---|---|
| P/E | 20 | 16 | 10 |
| Crescita | 15% | 8% | 2% |

La crescita è quella che il mercato si aspetta per gli utili, ogni anno.

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
    P('Tre trappole', r'''
Prima di fidarti di un P/E, controlla tre cose.

**1. L'utile c'è?** Se l'azienda è in perdita, l'utile per azione è negativo e il P/E non ha senso. Con un utile vicino a zero il P/E diventa enorme e non dice niente.

**2. L'utile è pulito?** Un anno l'azienda vende un palazzo e l'utile raddoppia: il P/E sembra bassissimo, ma quel guadagno non si ripeterà. Vale anche al contrario, per una multa pagata una volta sola. Il P/E va calcolato sull'utile dell'attività normale.

**3. Di quale utile parliamo?** C'è il P/E sugli utili **degli ultimi dodici mesi**, già scritti nei conti, e quello sugli utili **attesi per i prossimi dodici**, che sono previsioni. Sono due numeri diversi: quando confronti due aziende, usa lo stesso tipo per tutte e due.''',
      deep=('Il P/E capovolto', r'''
Se capovolgi il P/E ottieni il **rendimento degli utili**: l'utile per azione diviso il prezzo.

$$\frac{\text{EPS}}{P} = \frac{0{,}75}{12} = 6{,}25\%$$

Si legge come un tasso: a ogni 100 € spesi in azioni Velonda corrispondono 6,25 € di utili l'anno.

Scritto così, si può mettere accanto a quello che rende un titolo di Stato. Se i titoli di Stato rendono di più, chi investe pretende di più anche dalle azioni: a parità di utili, è disposto a pagarle meno. È uno dei motivi per cui, quando i tassi salgono, i P/E di solito scendono.''')),
    Q("Un'azione costa 36 € e il suo utile per azione è 3 €. Che cosa dice il suo P/E?", ["Che l'azione rende il 12% l'anno", 'Che paghi 12 € per ogni euro di utile annuo', "Che gli utili crescono del 12% l'anno"], 1,
      r"\(\text{P/E} = \dfrac{36}{3} = 12\): per ogni euro di utile annuo paghi **12 €**. Il P/E è un numero di volte, non una percentuale: non dice quanto rende l'azione né quanto crescono gli utili."),
    Q("Quest'anno un'azienda ha venduto la sua vecchia sede, e per questo l'utile è raddoppiato. Il suo P/E sembra bassissimo. Qual è la mossa giusta?", ['Ricalcolare il P/E senza il guadagno della vendita, che non si ripeterà', 'Comprare subito: un P/E così basso è un affare', "Lasciar perdere il P/E e guardare solo il prezzo dell'azione"], 0,
      "Il guadagno di una vendita fatta una volta sola gonfia l'utile di quest'anno e fa sembrare basso il P/E. Va tolto: il P/E serve a dire quanto paghi per gli utili che l'azienda sa ripetere."),
    Q('Due aziende dello stesso settore: A ha un P/E di 25, B di 9. Che cosa si può dire?', ['B guadagna più di A', 'A è di sicuro sopravvalutata', 'Il mercato si aspetta che gli utili di A crescano più di quelli di B'], 2,
      "Un P/E alto vuol dire che il mercato paga molto gli utili di oggi, di solito perché ne aspetta di più domani. Non dice quale azienda guadagna di più, e non basta per dire che A è cara: dipende da quanta crescita arriverà davvero."),
  ], "Il P/E è il prezzo diviso l'utile per azione: quanti euro paghi per un euro di utile annuo. Un P/E alto vuol dire crescita attesa, uno basso vuol dire dubbi. Si confronta tra aziende simili, con utili puliti."),

  # ---------------------------------------------------------------------------------------------------
  LF('az-5-4', 'P/B', 'Il P/B: il prezzo contro i conti', 7, [
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

Un P/B alto con un ROE alto è normale. Un P/B alto con un ROE basso è un campanello d'allarme.''',
      deep=('Il legame tra P/B, P/E e ROE', r'''
I tre numeri sono legati da un'uguaglianza che vale sempre:

$$\text{P/B} = \text{P/E} \times \text{ROE}$$

Si vede scrivendo i pezzi:

$$\frac{P}{\text{BVPS}} = \frac{P}{\text{EPS}} \times \frac{\text{EPS}}{\text{BVPS}}$$

L'ultimo pezzo, utile per azione diviso patrimonio per azione, è proprio il ROE.

Prova con Velonda: \(16 \times 12{,}5\% = 2\). Con Pedalta: \(20 \times 20\% = 4\). Con Nordciclo: \(10 \times 7\% = 0{,}7\).

Quindi un P/B alto può nascere da due cose: un ROE alto, oppure un P/E alto. Conviene sempre guardare da quale delle due arriva.''')),
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
      "Pagare 3 € per ogni euro di patrimonio ha senso se quel patrimonio rende molto. La prima azienda produce 25 € di utile ogni 100 di patrimonio, la seconda 5: a parità di P/B, la seconda è molto più cara rispetto a quello che guadagna."),
  ], "Il P/B confronta il prezzo con il patrimonio netto per azione scritto nei conti. Dice molto per banche e aziende piene di beni, poco per quelle che valgono per marchi e persone. Va letto insieme al ROE."),

  # ---------------------------------------------------------------------------------------------------
  LF('az-5-5', 'P/S', 'Il P/S: il prezzo contro le vendite', 6, [
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
      fig=F([('Pedalta', '7,50 €', [(7.5, 'Utile', 'menta')]), ('Velonda', '5 €', [(5, 'Utile', 'menta')]), ('Nordciclo', '4 €', [(4, 'Utile', 'menta')])], cap='Quanto resta di utile su 100 € di vendite.'),
      deep=('Il legame tra P/S, P/E e margine', r'''
Anche qui c'è un'uguaglianza che vale sempre:

$$\text{P/S} = \text{P/E} \times \text{margine netto}$$

Si vede scrivendo i pezzi: prezzo diviso ricavi è uguale a prezzo diviso utile, per utile diviso ricavi.

Prova con Velonda: \(16 \times 5\% = 0{,}8\). Con Pedalta: \(20 \times 7{,}5\% = 1{,}5\). Con Nordciclo: \(10 \times 4\% = 0{,}4\).

Serve anche al contrario. Un'azienda in perdita ha un P/S di 2, e pensi che a regime avrà un margine netto del 10%. Il suo P/E a regime sarebbe \(\dfrac{2}{10\%} = 20\). È un modo rapido per capire quanta strada deve fare per meritare il prezzo di oggi.''')),
    P('Quando serve e dove sbaglia', r'''
Il P/S si usa soprattutto in tre casi:

• aziende giovani che crescono ma non guadagnano ancora
• anni di crisi, quando l'utile crolla per un po' e il P/E impazzisce
• settori in cui gli utili cambiano molto da un anno all'altro

Ha un altro pregio: i ricavi risentono meno dell'utile delle scelte di chi scrive i conti.

Ma ha due punti ciechi.

• **Non guarda i costi.** Due aziende con lo stesso P/S possono avere margini opposti.
• **Non guarda i debiti.** La capitalizzazione è solo la parte dei soci. Un'azienda piena di debiti può sembrare a buon mercato solo perché i soci ne possiedono una fetta piccola.

Al secondo problema risponde la prossima lezione.'''),
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
      "Fai il conto su 100 € di vendite, che in Borsa valgono 100 €. La prima ne ricava 2 € di utile: paghi 50 € per ogni euro di utile. La seconda ne ricava 10 €: paghi 10 €. Stesso P/S, ma la prima è cinque volte più cara rispetto agli utili."),
    Q('Qual è un limite del P/S?', ["Non si può calcolare se l'azienda è in perdita", 'Cambia solo quando esce il bilancio', 'Non tiene conto né dei costi né dei debiti'], 2,
      "Il P/S guarda solo le vendite: non dice quanta parte diventa utile, e non dice quanti debiti ha l'azienda. Si calcola benissimo anche in perdita, ed è proprio il suo pregio. E cambia ogni giorno, insieme al prezzo."),
  ], "Il P/S confronta il valore in Borsa con le vendite di un anno. Funziona anche quando l'utile non c'è, ma non guarda né i margini né i debiti: va letto insieme al margine netto."),

  # ---------------------------------------------------------------------------------------------------
  LF('az-5-6', 'EV', "Il valore d'impresa", 8, [
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

Vale anche al contrario, ed è così che lavorano i professionisti: prima stimano quanto vale tutta l'attività, poi tolgono il debito netto. Quello che resta è il valore per i soci.''',
      fig=F([("Valore d'impresa", '300 milioni', [(240, 'Soci: capitalizzazione', 'az', '240'), (60, 'Creditori: debito netto', 'pesca', '60')])])),
    P('Il confronto che il P/E sbaglia', r'''
Con il P/E, Nordciclo sembra molto più a buon mercato di Velonda: 10 contro 16.

Ma Nordciclo ha 200 milioni di debiti. Per confrontare le due **attività**, senza farsi ingannare da come sono finanziate, si usa l'EV. E lo si divide per un guadagno che spetta a tutti, soci e creditori: il **risultato operativo**, cioè l'utile prima di interessi e imposte (in inglese EBIT).

| | Velonda | Nordciclo |
|---|---|---|
| EV | 300 | 380 |
| Risultato operativo | 24 | 38 |
| EV / risultato operativo | 12,5 | 10 |
| P/E | 16 | 10 |

Con il P/E Velonda costa il 60% più di Nordciclo. Con il multiplo dell'EV solo il 25%. Una buona parte dello sconto di Nordciclo era soltanto debito.''',
      deep=('EBITDA e gli altri pezzi', r'''
Il multiplo dell'EV più usato in assoluto è **EV/EBITDA**.

L'EBITDA è il risultato operativo a cui si riaggiungono gli ammortamenti: un costo scritto nei conti che non fa uscire soldi nell'anno. Per Velonda: risultato operativo 24, ammortamenti 6, EBITDA \(24 + 6 = 30\) milioni.

$$\frac{\text{EV}}{\text{EBITDA}} = \frac{300}{30} = 10$$

È comodo per confrontare aziende con impianti di età diverse. Ma attenzione: gli impianti prima o poi vanno ricomprati, e l'EBITDA fa finta di no.

Nei conti dei professionisti l'EV ha anche altri pezzi: si aggiungono le azioni privilegiate e le quote dei soci di minoranza delle società controllate, e il debito si prende al valore di mercato quando si conosce.''')),
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
    Q("Un'azienda vale in Borsa 500 milioni, ha debiti finanziari per 150 milioni e 50 milioni in cassa. Quanto vale il suo EV?", ['700 milioni', '600 milioni', '400 milioni'], 1,
      r"\(\text{EV} = \text{Cap} + D - C = 500 + 150 - 50 =\) **600 milioni**. I debiti si aggiungono, la cassa si toglie: con 700 hai aggiunto anche la cassa, con 400 hai fatto il contrario."),
    Q("Un'azienda ha più cassa che debiti finanziari. Com'è il suo EV rispetto alla capitalizzazione?", ['Più basso', 'Più alto', 'Uguale'], 0,
      r"Se la cassa supera i debiti, il debito netto è negativo e l'EV scende sotto la capitalizzazione. È il caso di Pedalta: \(180 + 10 - 20 =\) **170 milioni**. Chi la compra tutta si ritrova più soldi in cassa di quanti debiti deve ripagare."),
    Q('Quale coppia è coerente?', ['EV diviso utile netto', 'Capitalizzazione diviso risultato operativo', 'EV diviso risultato operativo'], 2,
      "L'EV è il valore per soci e creditori insieme, e il risultato operativo è il guadagno prima di pagare gli interessi ai creditori: riguardano le stesse persone. L'utile netto spetta solo ai soci, e va messo sotto il prezzo o la capitalizzazione."),
  ], "Il valore d'impresa è capitalizzazione più debiti finanziari meno cassa: il prezzo di tutta l'attività, di chiunque siano i soldi. Per confrontare aziende con debiti diversi si usano i multipli dell'EV."),

  # ---------------------------------------------------------------------------------------------------
  LF('az-5-7', '1·2·3', 'Tre strade per stimare il valore', 8, [
    G("Tre analisti stimano quanto vale un'azione Velonda. Ognuno usa un metodo diverso. Che cosa ti aspetti?",
      "Ogni metodo guarda l'azienda da un lato e usa ipotesi diverse. Chi valuta sul serio ne usa più di uno e guarda **dove le cifre si avvicinano**. Le strade sono tre.",
      options=['Tre cifre uguali: il valore è uno solo', "Tre cifre diverse: ogni metodo guarda l'azienda da un lato", 'Che un solo metodo sia giusto e gli altri due sbagliati'], ans=1),
    P('Prima strada: i soldi che arriveranno', r'''
Un'azione vale per i soldi che darà a chi la possiede: i **dividendi**, e il prezzo a cui un giorno verrà rivenduta.

Quei soldi arrivano in futuro. Nelle Basi hai visto l'interesse: 100 € al 10% diventano 110 € in un anno. Qui si fa il conto al contrario: per chi chiede il 10%, 110 € tra un anno valgono oggi 100 €. Basta dividere per 1,10.

Nora si aspetta tra un anno un dividendo di 0,30 € e pensa di poter rivendere l'azione a 13,45 €. Per il rischio che corre chiede un rendimento del 10%.

$$V = \frac{D_1 + P_1}{1 + r}$$

\(D_1\) = dividendo tra un anno, \(P_1\) = prezzo tra un anno, \(r\) = rendimento richiesto.

$$V = \frac{0{,}30 + 13{,}45}{1{,}10} = 12{,}50$$

Per Nora l'azione vale **12,50 €**: poco più dei 12 € che costa.

È la strada più completa, e la più delicata: tutto dipende dalle previsioni.'''),
    LV('Cambia le ipotesi, cambia il valore',
       'È lo stesso conto di Nora, con un dividendo di 0,30 € tra un anno. Muovi il prezzo a cui pensi di rivendere e il rendimento che chiedi.',
       'unanno', dict(D1=0.30, P=12),
       [dict(id='p1', label='Prezzo atteso tra un anno', min=12, max=15, step=0.05, start=13.45, unit='€', dec=2), dict(id='rr', label='Rendimento richiesto', min=6, max=16, step=1, start=10, unit='%')],
       [dict(label='Trova due ipotesi che fanno scendere il valore sotto 12 €', cond=[['Vc', '<', 1200]], hint='Alza il rendimento richiesto, oppure abbassa il prezzo atteso.'),
        dict(label='Ora trovane due che lo portano sopra 13,50 €', cond=[['Vc', '>', 1350]], hint='Abbassa il rendimento richiesto e alza il prezzo atteso.')],
       "Hai cambiato due ipotesi e il valore è passato da meno di 12 € a più di 13,50 €. Nessuna delle due stime è un errore: dipendono da che cosa ti aspetti e da quanto chiedi. Per questo una stima seria è un intervallo, non una cifra sola."),
    P('Seconda strada: il confronto', r'''
La seconda strada non prevede il futuro: guarda **quanto paga oggi il mercato per aziende simili**.

Sono i rapporti delle lezioni precedenti, che insieme si chiamano **multipli**. Si prende il multiplo medio dei concorrenti e lo si applica ai numeri dell'azienda.

I due concorrenti di Velonda hanno P/E 20 e 10: la media è 15. L'utile per azione di Velonda è 0,75 €.

$$V = \text{P/E}_{\text{simili}} \times \text{EPS}$$

\(\text{P/E}_{\text{simili}}\) = P/E medio delle aziende simili, \(\text{EPS}\) = utile per azione.

$$V = 15 \times 0{,}75 = 11{,}25$$

Se il mercato pagasse Velonda come paga in media i suoi concorrenti, l'azione costerebbe **11,25 €**.

È una strada veloce e legata a prezzi veri. Ha un limite: se tutto il settore è caro, la stima esce cara anche lei. E due aziende non sono mai davvero uguali.'''),
    N(r'''
I concorrenti di un'azienda hanno in media un P/E di 12. L'azienda ha un utile per azione di 2,50 €.

Che valore dà il metodo del confronto, in euro per azione?''', 30, '€',
      r'''
$$V = \text{P/E}_{\text{simili}} \times \text{EPS}$$

\(\text{P/E}_{\text{simili}}\) = P/E medio dei concorrenti (12), \(\text{EPS}\) = utile per azione (2,50 €).

$$V = 12 \times 2{,}50 = 30$$

Se il mercato la pagasse come i concorrenti, l'azione costerebbe **30 €**.'''),
    P('Terza strada: i pezzi', r'''
La terza strada guarda quello che l'azienda **possiede**: si stima quanto valgono oggi tutte le sue attività e si tolgono tutti i debiti.

Per Velonda, un'ipotesi:

• attività ai prezzi di oggi: 290 milioni
• debiti, tutti: 130 milioni
• valore per i soci: \(290 - 130 =\) **160 milioni**

Diviso per 20 milioni di azioni: **8 € per azione**.

È più dei 3,50 € della liquidazione, perché qui nessuno svende in fretta. Ma è meno delle altre due stime: questo metodo conta le cose, non la capacità di usarle per guadagnare.

Per questo è la strada giusta per chi possiede soprattutto beni, come una società immobiliare, e la meno adatta a un'azienda che vale per i suoi utili.'''),
    P('Tre cifre, un intervallo', r'''
Mettiamo le tre stime accanto al prezzo.

[fig]

Le due strade adatte a un'azienda che funziona, i soldi futuri e il confronto, danno 12,50 € e 11,25 €. Il prezzo di Borsa, 12 €, sta nel mezzo.

La risposta onesta alla domanda di Nora non è un numero: è un **intervallo**. Velonda sembra valere tra 11,25 e 12,50 €, e a 12 € non è né regalata né carissima.

Queste tre strade sono solo un assaggio. Il secondo livello di Azioni, «Quanto vale davvero», le percorre una per una fino in fondo.''',
      fig=F([('I soldi che arriveranno', '12,50 €', [(12.5, 'Stima', 'menta')]), ('Il confronto', '11,25 €', [(11.25, 'Stima', 'menta')]), ('I pezzi', '8 €', [(8, 'Stima', 'menta')]), ('Prezzo in Borsa', '12 €', [(12, 'Prezzo', 'az')])]),
      deep=('Quale strada, quando', r'''
Non esiste il metodo giusto in assoluto: dipende dall'azienda e da quello che sai.

• **Soldi futuri**: quando riesci a fare previsioni ragionevoli. Aziende stabili, con utili e dividendi regolari.
• **Confronto**: quando ci sono aziende simili quotate e ti serve una risposta rapida. È il metodo che trovi più spesso sui giornali.
• **Pezzi**: società immobiliari, società che possiedono quote di altre società, aziende che stanno per chiudere.

Chi lo fa di mestiere ne usa quasi sempre due insieme: una per ragionare, l'altra per controllare di non essere finito fuori strada. Se le due cifre sono lontanissime, una delle ipotesi è sbagliata.''')),
    BK('Quale strada sta usando?', ['Soldi futuri', 'Confronto', 'Pezzi'], [
      ('Riporto a oggi i dividendi che mi aspetto', 0, 'Parte dai soldi che arriveranno: è la prima strada.'),
      ('Guardo a che P/E si scambiano le aziende simili', 1, 'Usa i prezzi di aziende simili: è il confronto.'),
      ('Stimo quanto valgono oggi i palazzi e tolgo i debiti', 2, "Conta quello che l'azienda possiede: sono i pezzi."),
      ('Applico ai ricavi il P/S medio del settore', 1, 'Un multiplo preso da aziende simili: è il confronto.'),
      ("Calcolo quanto vale oggi la cassa che l'azienda produrrà", 0, 'Soldi futuri riportati a oggi: è la prima strada.'),
      ("Sommo ai prezzi di oggi le quote che l'azienda possiede in altre società", 2, 'Mette in fila i beni uno per uno: sono i pezzi.')]),
    Q("Tra un anno un'azione pagherà un dividendo di 1 € e pensi di rivenderla a 21 €. Chiedi un rendimento del 10%. Quanto vale oggi per te?", ['22 €', '19,80 €', '20 €'], 2,
      r"\(V = \dfrac{D_1 + P_1}{1 + r} = \dfrac{1 + 21}{1{,}10} =\) **20 €**. I 22 € sono quello che incasserai tra un anno: per portarli a oggi si divide per 1,10. Togliere il 10% da 22 dà 19,80 €, ma non è la stessa cosa."),
    Q('Qual è il punto debole del metodo del confronto?', ['Se le aziende simili sono tutte care, anche la stima esce cara', 'Richiede previsioni su molti anni', 'Si può usare solo con le banche'], 0,
      "Il confronto prende per buoni i prezzi delle aziende simili. Se in quel momento il mercato le paga troppo, l'errore passa pari pari nella stima. Le previsioni lontane sono il punto debole della prima strada, non di questa."),
    Q('Per quale azienda il metodo dei pezzi è il più adatto?', ['Un produttore di bici in forte crescita', 'Una società che possiede solo palazzi affittati', 'Uno studio di consulenza'], 1,
      "Il metodo dei pezzi funziona quando il valore sta nei beni posseduti, e quei beni hanno un prezzo che si può stimare: è il caso dei palazzi. Un'azienda in crescita vale per gli utili futuri, uno studio di consulenza per le persone."),
  ], "Il valore si stima per tre strade: i soldi che arriveranno riportati a oggi, il confronto con aziende simili, il valore dei pezzi. Danno cifre diverse: la risposta seria è un intervallo."),

  # ---------------------------------------------------------------------------------------------------
  LF('az-5-8', 'CASO', 'Il caso: Velonda costa tanto o poco?', 8, [
    P('Quattro mosse', r'''
Adesso metti tutto insieme. Nora ha davanti i numeri di Velonda e dei suoi due concorrenti, e deve rispondere alla domanda del capitolo.

Le mosse sono quattro, sempre le stesse:

• **calcola** i multipli dell'azienda
• **confrontali** con quelli delle aziende simili
• **chiediti perché** sono diversi: crescita, margini, debiti
• **concludi** con un intervallo, non con un numero

Nelle prossime domande i dati sono sempre gli stessi: li trovi sotto la linguetta «Il caso», e li puoi riaprire da ogni domanda.'''),
    QC('Quale delle tre aziende vale di più in Borsa?', ['Pedalta', 'Nordciclo', 'Velonda'], 2,
       r"Si confrontano le capitalizzazioni, prezzo per numero di azioni. Velonda: \(12 \times 20 = 240\). Pedalta: \(45 \times 4 = 180\). Nordciclo: \(4{,}20 \times 50 = 210\). La più grande è **Velonda**, anche se la sua azione non è la più cara."),
    QC('Quale azienda ha il P/E più basso?', ['Nordciclo', 'Velonda', 'Pedalta'], 0,
       r"Con le cifre di tutta l'azienda, il P/E è capitalizzazione diviso utile netto. Velonda: \(\dfrac{240}{15} = 16\). Pedalta: \(\dfrac{180}{9} = 20\). Nordciclo: \(\dfrac{210}{21} = 10\). Il più basso è quello di **Nordciclo**."),
    QC("Nora applica a Velonda la media dei P/E dei due concorrenti. Che prezzo ottiene per un'azione Velonda?", ['15 €', '11,25 €', '12 €'], 1,
       r"I P/E dei concorrenti sono 20 e 10: la media è 15. L'utile per azione di Velonda è \(\dfrac{15}{20} = 0{,}75\) €. Quindi \(V = 15 \times 0{,}75 =\) **11,25 €**. Il 15 è il multiplo, non il prezzo; 12 € è il prezzo di Borsa."),
    QC("Quanto vale il valore d'impresa (EV) di Nordciclo?", ['380 milioni', '440 milioni', '410 milioni'], 0,
       r"\(\text{EV} = \text{Cap} + D - C\). La capitalizzazione è \(4{,}20 \times 50 = 210\). Quindi \(210 + 200 - 30 =\) **380 milioni**. Con 440 hai aggiunto anche la cassa, con 410 hai dimenticato di toglierla."),
    QC("Con il P/E Nordciclo sembra costare molto meno di Velonda: 10 contro 16. Che cosa succede se le confronti con l'EV diviso il risultato operativo?", ['La distanza aumenta', 'Nordciclo diventa più cara di Velonda', 'La distanza si riduce: 10 contro 12,5'], 2,
       r"Velonda: EV \(240 + 80 - 20 = 300\), diviso 24 fa **12,5**. Nordciclo: EV 380, diviso 38 fa **10**. Nordciclo resta meno cara, ma la distanza scende dal 60% al 25%: una buona parte del suo P/E basso dipende dai debiti."),
    QC('Il gruppo offre 15 € per azione. Di quanto è il premio rispetto al prezzo di Borsa?', ['20%', '25%', '3%'], 1,
       r"\(\dfrac{15 - 12}{12} =\) **25%**. Il premio si misura sul prezzo di Borsa. Chi compra tutta l'azienda la paga di più perché compra anche il controllo."),
    QC('Mettendo insieme tutto, qual è la conclusione più ragionevole per Nora?', ['Velonda è cara: la sua azione costa quasi il triplo di quella di Nordciclo', 'A 12 € Velonda è in linea con i concorrenti: né regalata né cara', 'Velonda è un affare sicuro: va comprata subito'], 1,
       "Il prezzo di una sola azione non dice niente. Su tutti i multipli Velonda sta tra Pedalta, che rende di più e costa di più, e Nordciclo, che rende di meno e costa di meno. Il confronto dà 11,25 €, vicino ai 12 € di Borsa. Niente è sicuro, ma il prezzo è coerente con quello che l'azienda è."),
    P('Il verdetto di Nora', r'''
Ecco il quadro completo, con i multipli già calcolati.

| | Velonda | Pedalta | Nordciclo |
|---|---|---|---|
| P/E | 16 | 20 | 10 |
| P/B | 2 | 4 | 0,7 |
| P/S | 0,8 | 1,5 | 0,4 |
| EV/EBIT | 12,5 | 13,6 | 10 |
| ROE | 12,5% | 20% | 7% |

Velonda sta nel mezzo su tutto. Rende più di Nordciclo e meno di Pedalta, e costa più di Nordciclo e meno di Pedalta. Il suo prezzo è coerente con quello che è.

Nora conclude che 12 € è un prezzo onesto. Non è una certezza: è un prezzo a cui ha senso comprare **se** crede che Velonda continuerà a crescere.

Costa tanto o poco? Né l'uno né l'altro. Adesso sai come si arriva a dirlo.''',
      deep=('Il formulario del capitolo', r'''
Tutte le formule del capitolo in una pagina, da tenere a portata di mano per il laboratorio e la verifica.

| Che cosa | Formula |
|---|---|
| Capitalizzazione | \(P \times N\) |
| Utile per azione | \(U / N\) |
| P/E | \(P / \text{EPS}\) |
| P/B | \(P / \text{BVPS}\) |
| P/S | \(\text{Cap} / R\) |
| ROE | \(U / PN\) |
| Valore d'impresa | \(\text{Cap} + D - C\) |
| Margine di sicurezza | \((V - P) / V\) |
| Valore a un anno | \((D_1 + P_1) / (1 + r)\) |

\(P\) = prezzo, \(N\) = azioni, \(U\) = utile netto, \(PN\) = patrimonio netto, \(R\) = ricavi, \(D\) = debiti finanziari, \(C\) = cassa, \(V\) = valore stimato, \(D_1\) e \(P_1\) = dividendo e prezzo tra un anno, \(r\) = rendimento richiesto. \(\text{EPS}\) e \(\text{BVPS}\) sono utile e patrimonio per azione.''')),
  ], "Per dire se un'azione è cara: calcola i multipli, confrontali con quelli di aziende simili, chiediti perché sono diversi e concludi con un intervallo."),
])

UNITS = [C5]
# cursori e risultati dei modelli delle leve (il conto è in LEVERS, dentro p35_steps.js)
LEVE = dict(pecresc=(('g', 'anni'), ('g', 'anni', 'pe10')), leva=(('D',), ('D', 'pe10')), unanno=(('p1', 'rr'), ('Vc', 'rr')))
r = controlla(UNITS, LEVE)
# il caso deve stare sotto le due linguette: testo lungo, con la domanda nell'ultimo capoverso
for e in C5['lessons'][-1]['ex']: assert len(e['q']) > 260 and e['q'].startswith(CASO), 'domanda del caso senza i dati'
json.dump(nb(UNITS), open(H + '/azioni.json', 'w'), ensure_ascii=False, separators=(',', ':'))
print('azioni: capitoli', len(UNITS), '| lezioni', r['lezioni'], '| domande', r['domande'], '| risposta giusta in A/B/C:', r['giusta'], '| minuti', r['minuti'], '| passi nuovi:', r['passi'])
