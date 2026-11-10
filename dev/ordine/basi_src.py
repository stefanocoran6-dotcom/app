# Contenuti del percorso "Basi della finanza": 24 lezioni in 6 unità. Scrive basi.json, che build.sh inserisce in ordine.js.
# Ogni lezione: pagine (titolo + testo), una frase "In breve", esercizi (scelta tra tre risposte, oppure abbina le coppie).
# Le lezioni a passi corti (LF) alternano pagine brevi e cose da fare: stima, leve, metti a posto, metti in ordine, calcola.
# Nel testo: **grassetto**, righe che iniziano con "• ", tabelle con |, formule tra $$ ... $$ (su una riga a sé) o \( ... \).
import json, os, re, collections
H = os.path.dirname(os.path.abspath(__file__))

def L(key, sym, title, minutes, pages, note, ex):
    return dict(key=key, sym=sym, title=title, minutes=minutes, pages=[dict(t=t, x=x.strip('\n'), **(dict(widget=w) if w else {})) for (t, x, *rest) in pages for w in [rest[0] if rest else None]], note=note, ex=ex)
def Q(q, options, ans, exp): return dict(type='mcq', q=q, options=options, ans=ans, exp=exp.strip('\n'))
def M(*pairs): return dict(type='match', pairs=[list(p) for p in pairs])

# ---- lezioni a passi corti: "flow" elenca i passi nell'ordine in cui si vedono ----
def P(t, x, widget=None, fig=None):            # pagina di spiegazione; "[fig]" su una riga a sé dice dove va il disegno
    d = dict(type='page', t=t, x=x.strip('\n'))
    if widget: d['widget'] = widget
    if fig: d['fig'] = fig
    return d
def F(rows, cap=None):                         # disegno a barre: righe (etichetta, valore, pezzi); ogni pezzo è (peso, nome, colore, cifra)
    d = dict(rows=[dict(lab=l, val=v, segs=[list(x) for x in segs]) for (l, v, segs) in rows])
    if cap: d['cap'] = cap
    return d
def G(q, after, lo=None, hi=None, step=None, truth=None, near=None, unit='€', options=None, ans=None):   # stima prima di leggere: cursore, oppure scelta tra risposte
    d = dict(type='guess', q=q.strip('\n'), after=after.strip('\n'))
    if options: d.update(options=options, ans=ans)
    else: d.update(min=lo, max=hi, step=step, truth=truth, near=near, unit=unit)
    return d
def LV(t, x, model, params, sliders, goals, after):   # leve da muovere fino a un obiettivo; il conto sta nell'app (LEVERS in p35_steps.js)
    return dict(type='lever', t=t, x=x, model=model, params=params, sliders=sliders, goals=goals, after=after)
def BK(t, buckets, items, after=None):                # metti ogni voce al posto giusto: (testo, numero del contenitore, perché)
    d = dict(type='bucket', t=t, buckets=buckets, items=[list(i) for i in items])
    if after: d['after'] = after
    return d
def OR(t, items, x=None, after=None):                 # metti in ordine: le voci sono scritte già nell'ordine giusto
    d = dict(type='order', t=t, items=items)
    if x: d['x'] = x
    if after: d['after'] = after
    return d
def N(q, ans, unit, exp, tol=0.5, dec=0):             # calcola tu: risposta con il tastierino, entro una tolleranza
    return dict(type='num', q=q.strip('\n'), ans=ans, unit=unit, tol=tol, dec=dec, exp=exp.strip('\n'))
def LF(key, sym, title, minutes, flow, note):         # lezione a passi: domande e abbinamenti finiscono anche in "ex", che serve a verifiche e allenamento
    ex = []; fl = []
    for s in flow:
        if s['type'] in ('mcq', 'match'): fl.append(dict(type='ex', i=len(ex))); ex.append(s)
        else: fl.append(s)
    return dict(key=key, sym=sym, title=title, minutes=minutes, flow=fl, note=note, ex=ex, pages=[])

U1 = dict(id='basi-u1', sid='basi-s1', name='I soldi nel tempo', lessons=[
  L('basi-1-1', '€', 'A cosa servono i soldi', 4, [
    ('Tre lavori in uno', r'''
I soldi fanno tre lavori.

• **Mezzo di scambio**: li dai in cambio di quello che ti serve, senza dover barattare.
• **Unità di conto**: sono il metro con cui confronti i prezzi. Un caffè costa 1,30 €, un libro 18 €.
• **Riserva di valore**: li metti da parte oggi per spenderli domani.'''),
    ('Il terzo lavoro è il più fragile', r'''
Come riserva di valore i soldi non sono perfetti: se i prezzi salgono, con la stessa cifra compri meno cose.

È il motivo per cui esistono **interessi** e **investimenti**: servono a far sì che i soldi messi da parte non perdano terreno.''')],
    "I soldi servono per pagare, per misurare i prezzi e per conservare valore. Il terzo lavoro è quello che l'inflazione mette alla prova.",
    [Q('Metti 500 € in un cassetto per comprare una bici tra un anno. Quale lavoro stai chiedendo ai soldi?', ['Mezzo di scambio', 'Unità di conto', 'Riserva di valore'], 2,
       'Li stai conservando per spenderli più avanti: è la funzione di **riserva di valore**. Diventeranno mezzo di scambio solo il giorno in cui paghi la bici.')]),
  L('basi-1-2', '%', 'Interesse semplice', 4, [
    ('Il prezzo del tempo', r'''
Se presti dei soldi, chi li riceve ti paga un compenso: l'**interesse**. Si misura con un **tasso**, cioè una percentuale all'anno.

Con l'**interesse semplice** il tasso si applica sempre e solo alla cifra di partenza, il **capitale**.'''),
    ('Un esempio', r'''
Presti 1.000 € al 5% l'anno per 3 anni.

• Ogni anno maturi 1.000 × 5% = **50 €**.
• In 3 anni: 50 × 3 = **150 €** di interessi.
• Alla fine hai 1.000 + 150 = **1.150 €**.

$$I = C \times i \times t$$

Dove \(C\) è il capitale, \(i\) il tasso annuo e \(t\) gli anni.''')],
    'Interesse semplice: capitale × tasso × anni. Gli interessi sono uguali ogni anno.',
    [Q("Presti 2.000 € al 3% l'anno, a interesse semplice, per 4 anni. Quanti interessi maturi in tutto?", ['60 €', '240 €', '251 €'], 1,
       "Ogni anno: 2.000 × 3% = 60 €. In 4 anni: 60 × 4 = **240 €**. La risposta 60 € è un solo anno; 251 € è l'interesse composto, che vediamo nella prossima lezione.")]),
  L('basi-1-3', '%%', "L'interesse composto", 5, [
    ("L'interesse composto", "Ogni anno gli interessi si sommano al capitale. L'anno dopo fruttano anche loro.", 'compound'),
    ('La formula', r'''
Dopo \(t\) anni al tasso \(i\) il capitale \(C\) diventa:

$$M = C \times (1 + i)^t$$

Con 1.000 € al 5%:

• dopo 1 anno: 1.000 × 1,05 = **1.050 €**
• dopo 2 anni: 1.050 × 1,05 = **1.102,50 €**
• dopo 20 anni: 1.000 × 1,05²⁰ = **2.653 €**

A interesse semplice dopo 20 anni avresti 2.000 €: i 653 € in più sono **interessi sugli interessi**.''')],
    "Conta più il tempo della cifra di partenza: gli interessi sugli interessi crescono piano all'inizio e in fretta dopo.",
    [Q("Metti 1.000 € al 5% l'anno. Quanto hai dopo 2 anni?", ['1.100,00 €', '1.102,50 €', '1.050,00 €'], 1,
       'Il primo anno arrivi a 1.050 €. Nel secondo anno il 5% si calcola su 1.050 €: sono 52,50 €, non 50. Totale **1.102,50 €**. Chi risponde 1.100 € ha contato il 5% due volte sui 1.000 € di partenza.'),
     Q("Metti 2.000 € al 4% l'anno con l'interesse composto. Quanto hai dopo 3 anni?", ['2.240,00 €', '2.163,20 €', '2.249,73 €'], 2, r'''
| Anno | Conto | Fine anno |
|---|---|---|
| 1 | 2.000,00 × 1,04 | 2.080,00 |
| 2 | 2.080,00 × 1,04 | 2.163,20 |
| 3 | 2.163,20 × 1,04 | 2.249,73 |

L'errore tipico è contare il 4% ogni anno sui 2.000 € di partenza: così arrivi a 2.240 €.''')]),
  L('basi-1-4', '↑', "L'inflazione", 4, [
    ('I prezzi che salgono', r'''
L'**inflazione** è l'aumento generale dei prezzi nel tempo. Se è al 3% l'anno, quello che oggi costa 100 € tra un anno costa in media 103 €.

I tuoi soldi non cambiano numero, ma comprano meno cose: scende il **potere d'acquisto**.'''),
    ('Un esempio', r'''
Hai 1.000 € fermi sul conto, che rende lo 0%. L'inflazione è al 3%.

• Tra un anno hai ancora 1.000 €.
• Ma per comprare le stesse cose ne servono 1.030.
• Il tuo potere d'acquisto è sceso di circa il **3%**.

In 10 anni, a questo ritmo, 1.000 € comprano quello che oggi compri con circa 744 €.''')],
    "Con l'inflazione i soldi fermi perdono potere d'acquisto, anche se la cifra sul conto non scende.",
    [Q("L'inflazione è al 3% l'anno e il tuo conto rende l'1%. Dopo un anno, che cosa è successo al tuo potere d'acquisto?", ["È salito dell'1%", 'È rimasto uguale', 'È sceso di circa il 2%'], 2,
       "Il conto è cresciuto dell'1%, ma i prezzi del 3%: in termini reali hai perso circa il **2%** (per la precisione 1,01 / 1,03 − 1 = −1,94%).")]),
  L('basi-1-5', 'r', 'Tasso reale', 4, [
    ('Nominale e reale', r'''
Il tasso che leggi sul contratto è il **tasso nominale**. Quello che conta per quanto puoi comprare è il **tasso reale**, cioè il nominale ripulito dall'inflazione.

Per cifre piccole basta una sottrazione:

$$\text{reale} \approx \text{nominale} - \text{inflazione}$$'''),
    ('Il conto esatto', r'''
La formula precisa divide invece di sottrarre:

$$1 + r = \frac{1 + n}{1 + \pi}$$

Dove \(r\) è il tasso reale, \(n\) il tasso nominale e \(\pi\) l'inflazione.

Con un nominale del 5% e un'inflazione del 2%:

• approssimato: 5% − 2% = **3%**
• esatto: 1,05 / 1,02 − 1 = **2,94%**

Più i tassi sono alti, più la differenza tra i due conti si allarga.''')],
    'Tasso reale ≈ tasso nominale − inflazione. Se il reale è negativo, stai perdendo potere d\'acquisto.',
    [Q("Un titolo rende il 4% l'anno e l'inflazione è al 6%. Quanto vale all'incirca il tasso reale?", ['−2%', '+2%', '+10%'], 0,
       'Reale ≈ 4% − 6% = **−2%**. Il titolo ti paga, ma meno di quanto salgono i prezzi: in termini reali perdi.')]),
])

# Le unità cambiate rispetto alla prima versione hanno un nome di sezione nuovo: così una verifica già superata sulla vecchia unità non vale per quella nuova.
U2 = dict(id='basi-u2', sid='basi-strumenti', name='Gli strumenti', lessons=[
  L('basi-2-1', 'AZ', 'Azioni', 4, [
    ('Un pezzo di azienda', r'''
Un'**azione** è una quota di proprietà di un'azienda. Se l'azienda ha emesso 1.000 azioni e tu ne hai 10, sei proprietario dell'1%.

Chi ha azioni guadagna in due modi:

• il **dividendo**, cioè la parte di utile che l'azienda distribuisce ai soci;
• l'aumento del **prezzo**, se l'azione vale di più quando la rivendi.'''),
    ('Niente è promesso', r'''
Né il dividendo né il prezzo sono garantiti. Se l'azienda va male il dividendo può sparire e il prezzo scendere.

In cambio di questo rischio, sul lungo periodo le azioni hanno reso in media più delle obbligazioni.''')],
    'Azione = quota di proprietà. Rende con dividendi e crescita del prezzo, senza garanzie.',
    [Q("Un'azienda ha 2.000 azioni in circolazione e tu ne possiedi 50. Quale quota dell'azienda è tua?", ['0,25%', '2,5%', '25%'], 1, '50 / 2.000 = 0,025, cioè il **2,5%**.')]),
  L('basi-2-2', 'OB', 'Obbligazioni', 5, [
    ('Un prestito che puoi rivendere', r'''
Un'**obbligazione** è un prestito che fai a un'azienda o a uno Stato. In cambio ricevi:

• una **cedola**, cioè l'interesse pagato a scadenze fisse;
• il **rimborso** del capitale alla scadenza.

Un BTP a 10 anni con cedola 3% su 1.000 € ti paga 30 € l'anno e ti restituisce 1.000 € dopo 10 anni.'''),
    ('Meno sorprese, non zero', r'''
Rispetto a un'azione sai già quanto incasserai, se chi ha emesso il titolo paga. I rischi sono due:

• che l'emittente **non paghi** (rischio di credito);
• che i **tassi salgano**: le nuove obbligazioni rendono di più e la tua, se la vendi prima della scadenza, vale meno.''')],
    'Obbligazione = prestito. Cedole fisse e rimborso a scadenza; il prezzo scende quando i tassi salgono.',
    [M(('Azione', "Una quota di proprietà di un'azienda"), ('Obbligazione', "Un prestito a un'azienda o a uno Stato"), ('Dividendo', 'La parte di utile pagata ai soci'), ('Inflazione', 'I prezzi che salgono nel tempo')),
     Q("I tassi d'interesse scendono. Che cosa succede di solito al prezzo delle obbligazioni già in circolazione?", ['Scende', 'Resta uguale', 'Sale'], 2,
       'Le obbligazioni già emesse pagano cedole più alte di quelle nuove, quindi valgono di più: il prezzo **sale**. Tassi e prezzi delle obbligazioni si muovono in direzioni opposte.')]),
  L('basi-2-4', 'ETF', 'Fondi ed ETF', 5, [
    ('Tanti titoli in un colpo solo', r'''
Un **fondo comune** raccoglie i soldi di tanti risparmiatori e li investe in molti titoli insieme. Tu non compri le singole azioni o obbligazioni: compri **quote** del fondo.

Il valore di una quota si calcola così:

$$\text{quota} = \frac{\text{patrimonio}}{\text{numero di quote}}$$

Se il fondo ha un patrimonio di 10 milioni di euro diviso in 1 milione di quote, ogni quota vale **10 €**. Con 500 € ne compri 50.'''),
    ('Che cosa cambia con un ETF', r'''
Un **ETF** è un fondo che si compra e si vende in borsa come un'azione e che di solito **replica un indice**, cioè un paniere di titoli scelto con una regola fissa (per esempio le 500 maggiori aziende americane).

• Un fondo **attivo** ha un gestore che sceglie i titoli e costa di più, spesso tra l'1% e il 2% l'anno.
• Un ETF che replica un indice non sceglie nulla e costa meno, spesso tra lo 0,1% e lo 0,3% l'anno.

In entrambi i casi hai molti titoli diversi con una sola operazione.''')],
    'Un fondo mette insieme i soldi di tanti e compra molti titoli. Un ETF è un fondo quotato in borsa che replica un indice e costa poco.',
    [Q('Un fondo ha un patrimonio di 50 milioni di euro diviso in 2 milioni di quote. Quanto vale una quota?', ['2,50 €', '25 €', '100 €'], 1, '50.000.000 / 2.000.000 = **25 €** per quota.'),
     Q('Che cosa fa un ETF che replica un indice?', ['Sceglie ogni giorno i titoli migliori', 'Garantisce il capitale investito', "Compra i titoli dell'indice, senza scegliere"], 2,
       "Compra i titoli che compongono l'indice, nelle stesse proporzioni, **senza scegliere**. Per questo costa poco. Non garantisce il capitale: se l'indice scende, scende anche l'ETF.")]),
  L('basi-2-5', 'CC', 'Conti, depositi e liquidità', 4, [
    ('Dove stanno i soldi di tutti i giorni', r'''
• Il **conto corrente** serve per incassare e pagare. Rende poco o niente.
• Il **conto deposito** è fatto per lasciare ferma una somma: in cambio la banca ti paga un interesse. Spesso i soldi sono **vincolati**: se li ritiri prima della scadenza perdi gli interessi, in tutto o in parte, e in certi casi non puoi ritirarli affatto.

Esempio: 5.000 € su un conto deposito al 3% per un anno rendono 5.000 × 3% = **150 €** prima delle tasse. In Italia l'imposta sugli interessi è del 26%: te ne restano **111 €**.'''),
    ('La liquidità', r'''
**Liquidità** vuol dire quanto in fretta trasformi qualcosa in denaro senza perderci. Il conto corrente è liquidissimo. Una casa no: per venderla servono mesi.

Per gli imprevisti serve un **fondo di emergenza**: soldi liquidi pari a qualche mese di spese. Una regola diffusa è tenerne da 3 a 6 mesi.

Se spendi 1.500 € al mese, il fondo di emergenza va da 4.500 € a 9.000 €. Solo quello che avanza ha senso investirlo.''')],
    'I soldi che possono servirti presto stanno su strumenti liquidi. Il resto può lavorare su tempi più lunghi.',
    [Q('Spendi 1.200 € al mese e vuoi un fondo di emergenza che copra 4 mesi. Quanto devi tenere da parte?', ['4.800 €', '1.200 €', '14.400 €'], 0,
       '1.200 × 4 = **4.800 €**. 14.400 € sarebbero un anno intero di spese.')]),
])

U3 = dict(id='basi-u3', sid='basi-rischio', name='Rischio, tempo e costi', lessons=[
  L('basi-2-3', 'R', 'Rischio e rendimento', 4, [
    ('Vanno insieme', r'''
Nessuno ti paga di più senza chiederti qualcosa in cambio. Un rendimento atteso più alto arriva sempre con più **rischio**, cioè con risultati che possono allontanarsi molto dalla media, in su e in giù.

Se qualcuno promette rendimenti alti senza rischio, manca un pezzo del racconto.'''),
    ('Non tutte le uova nello stesso paniere', r'''
**Diversificare** vuol dire dividere i soldi tra tanti titoli diversi. Se uno va male, pesa poco sul totale.

La diversificazione non toglie tutto il rischio: quello legato all'intero mercato resta. Toglie il rischio di puntare tutto sull'azienda sbagliata.''')],
    'Più rendimento atteso, più rischio. Diversificare riduce il rischio delle singole aziende, non quello del mercato.',
    [Q('Hai tutti i risparmi in azioni di una sola azienda. Qual è il modo più diretto per ridurre il rischio?', ['Comprare altre azioni della stessa azienda', 'Dividere i soldi tra molte aziende diverse', 'Controllare il prezzo ogni giorno'], 1,
       'Dividere i soldi tra molte aziende, cioè **diversificare**, fa sì che il guaio di una sola pesi poco sul totale.')]),
  L('basi-3-2', '½', 'Diversificare con i numeri', 5, [
    ('Due titoli, due scenari', r'''
Prendi due aziende che reagiscono in modo opposto alla stessa notizia. L'azienda A guadagna quando il petrolio sale, l'azienda B quando scende.

| Scenario | A | B | Metà e metà |
|---|---|---|---|
| Petrolio su | +20% | −5% | +7,5% |
| Petrolio giù | −10% | +15% | +2,5% |

Con tutti i soldi su A il risultato va da +20% a −10%. Con metà su A e metà su B va da +7,5% a +2,5%: stesso mondo, molte meno sorprese.'''),
    ('Come si fa il conto', r'''
Il rendimento di un portafoglio è la media dei rendimenti dei titoli, pesata per quanto hai messo su ciascuno:

$$R_p = w_A \times R_A + w_B \times R_B$$

Dove \(R_p\) è il rendimento del portafoglio, \(w_A\) e \(w_B\) le quote messe sui due titoli, che sommate fanno 1, e \(R_A\) e \(R_B\) i loro rendimenti.

Petrolio su: 0,5 × 20% + 0,5 × (−5%) = **+7,5%**.

La diversificazione funziona quando i titoli **non si muovono tutti insieme**. Dieci aziende dello stesso settore diversificano poco.''')],
    'Mettere insieme titoli che non si muovono allo stesso modo riduce le oscillazioni del portafoglio.',
    [Q('Hai il 60% in un titolo che rende +10% e il 40% in un titolo che rende −5%. Quanto rende il portafoglio?', ['+2,5%', '+5%', '+4%'], 2,
       '0,6 × 10% + 0,4 × (−5%) = 6% − 2% = **+4%**. Il +2,5% sarebbe la media semplice, giusta solo con metà e metà.')]),
  L('basi-3-3', 'T', "L'orizzonte temporale", 5, [
    ('Quando ti servono i soldi', r'''
L'**orizzonte temporale** è il tempo che passa prima che quei soldi ti servano. È la prima domanda da farsi, prima ancora di scegliere lo strumento.

• Soldi che servono **entro uno o due anni**, come l'anticipo per una casa: strumenti liquidi e stabili.
• Soldi che servono **tra dieci anni o più**, come la pensione: possono stare su strumenti che oscillano, perché c'è tempo per recuperare.'''),
    ('Perché una perdita pesa più di quanto sembra', r'''
Se un investimento scende del 30%, per tornare al punto di partenza non basta un +30%.

Parti da 100 €. Dopo un −30% hai 70 €. Per tornare a 100 € ti servono 30 € su 70, cioè un **+42,9%**.

$$\text{recupero} = \frac{1}{1 - \text{perdita}} - 1$$

Con una perdita del 50% il recupero necessario è del **100%**: i soldi devono raddoppiare. Per questo chi ha poco tempo davanti non può permettersi grandi oscillazioni.''')],
    'Più tardi ti servono i soldi, più oscillazioni puoi sopportare. Una perdita chiede sempre un recupero più grande in percentuale.',
    [Q('Un investimento perde il 50%. Di quanto deve salire per tornare al valore di partenza?', ['Del 50%', 'Del 100%', 'Del 75%'], 1,
       'Da 100 € scendi a 50 €. Per tornare a 100 € i 50 € devono raddoppiare: **+100%**.'),
     Q("Ti servono 20.000 € tra otto mesi per l'anticipo di una casa. Dove ha più senso tenerli?", ['Su uno strumento liquido e stabile', 'In azioni, per farli crescere', 'In un fondo che investe in un solo settore'], 0,
       'Otto mesi sono un orizzonte breve: se le azioni scendono non hai il tempo di recuperare. Servono strumenti **liquidi e stabili**.')]),
  L('basi-3-4', '−%', 'I costi', 5, [
    ('Piccole percentuali, grandi cifre', r'''
Ogni strumento ha un costo: commissioni di gestione, di acquisto, di vendita. Sembrano numeri piccoli perché sono espressi in percentuale all'anno, ma si pagano **ogni anno** e sul **totale** investito, non solo sui guadagni.

Il rendimento prima dei costi si chiama **lordo**, quello che ti resta **netto**:

$$\text{netto} \approx \text{lordo} - \text{costi}$$

Un fondo che rende il 5% prima dei costi e costa l'1,5% l'anno ti lascia circa il **3,5%**.'''),
    ("Trent'anni dopo", r'''
Investi 10.000 € per 30 anni in due strumenti che rendono entrambi il 6% l'anno prima dei costi. Il primo costa lo 0,2% l'anno, il secondo il 2%. Ipotesi: nessun altro versamento, costi tolti ogni anno.

| Costo annuo | Netto | Dopo 30 anni |
|---|---|---|
| 0,2% | 5,8% | 54.271 € |
| 2,0% | 4,0% | 32.434 € |

La differenza è di circa **21.800 €**, più del doppio della cifra investita. È l'interesse composto che lavora al contrario: i costi tolgono soldi che avrebbero continuato a fruttare.''')],
    'I costi si pagano ogni anno e si compongono come gli interessi. A parità di strumento, quello che costa meno ti lascia di più.',
    [Q("Un fondo rende il 7% l'anno prima dei costi e costa l'1,8% l'anno. Quanto ti resta all'incirca?", ['5,2%', '8,8%', '7%'], 0, '7% − 1,8% = **5,2%** circa. I costi si tolgono dal rendimento, non si aggiungono.')]),
])

# Unità pilota a passi corti: ogni lezione alterna spiegazioni vere (scritte per chi parte da zero, con un disegno accanto) e cose da fare.
# Ogni lezione segue una situazione di vita reale dall'inizio alla fine: la stima d'apertura fa la domanda, l'ultima pagina la chiude.
INT, CAP = 'pesca', 'az'   # colori fissi nei disegni: interessi e costi in pesca, capitale in azzurro
U4 = dict(id='basi-u4', sid='basi-debiti', name='Debiti e prestiti', lessons=[
  LF('basi-4-1', 'P', 'Come funziona un prestito', 7, [
    G("Ti servono 3.310 € per una moto usata. La banca te li presta al 10% l'anno e tu li restituisci in 3 rate annuali uguali. Quanti interessi le paghi in tutto?",
      "Molti dicono 993 €, cioè il 10% di 3.310 € per tre anni. Ma ogni rata restituisce anche un pezzo del debito, quindi gli interessi si calcolano su una cifra che scende. In tutto sono **683 €**: adesso vediamo da dove escono.",
      lo=0, hi=1500, step=10, truth=683, near=70),
    P('Soldi oggi, restituiti a rate', r'''
**Chiedere un prestito vuol dire usare oggi soldi che non hai, e restituirli un po' alla volta.**

La banca ti dà subito i 3.310 € della moto: quella cifra si chiama **capitale**.

La banca però non lo fa gratis. Per ogni anno in cui tieni i suoi soldi ti chiede un compenso, gli **interessi**: qui il 10% di quello che le devi ancora.

Ogni anno le versi una cifra fissa, la **rata**: 1.331 €. Dentro ci sono due cose diverse:

• una parte paga gli interessi di quell'anno;
• il resto restituisce un pezzo del capitale.

[fig]

Più capitale restituisci, meno devi alla banca, e meno interessi pagherai l'anno dopo.''',
      fig=F([('La rata di ogni anno', '1.331 €', [(1, 'Interessi', INT), (3, 'Capitale restituito', CAP)])], cap='Quanto vale ogni pezzo cambia di anno in anno: lo vediamo subito.')),
    P('Il primo anno', r'''
Facciamo il conto della prima rata.

All'inizio devi alla banca tutti i 3.310 €. Gli interessi del primo anno sono il 10% di quella cifra:

• Interessi: 10% di 3.310 € = **331 €**

La rata è di 1.331 €. Tolti gli interessi, quello che avanza restituisce capitale:

• Capitale restituito: 1.331 − 331 = **1.000 €**

[fig]

Dopo la prima rata non devi più 3.310 €, ma 3.310 − 1.000 = **2.310 €**. Gli interessi dell'anno prossimo si calcolano su questa cifra, che è più bassa.''',
      fig=F([('La prima rata', '1.331 €', [(331, 'Interessi', INT, '331 €'), (1000, 'Capitale restituito', CAP, '1.000 €')])])),
    N(r'''
Secondo anno. Adesso devi alla banca 2.310 €, e il tasso è sempre il 10%.

| Anno | Interessi | Capitale | Debito residuo |
|---|---|---|---|
| 1 | 331 | 1.000 | 2.310 |
| 2 | **?** | | |

Quanti interessi paghi nel secondo anno?''', 231, '€',
      "10% di 2.310 € = **231 €**. Il resto della rata, 1.331 − 231 = 1.100 €, restituisce capitale: il debito scende a 1.210 €."),
    N(r'''
Terzo anno. Ti restano 1.210 € di debito al 10%, e la rata è sempre di 1.331 €.

| Anno | Interessi | Capitale | Debito residuo |
|---|---|---|---|
| 1 | 331 | 1.000 | 2.310 |
| 2 | 231 | 1.100 | 1.210 |
| 3 | 121 | **?** | |

Quanto capitale restituisci con l'ultima rata?''', 1210, '€',
      "Interessi: 10% di 1.210 € = 121 €. Capitale restituito: 1.331 − 121 = **1.210 €**, cioè tutto il debito che restava. Il prestito è chiuso."),
    P('La rata resta uguale, dentro cambia', r'''
Ecco le tre rate una sotto l'altra. La cifra è sempre 1.331 €, ma guarda come cambia dentro.

[fig]

Anno dopo anno il debito scende, quindi scendono gli interessi e cresce la parte che restituisce capitale.

E i 683 € della domanda iniziale? Sono gli interessi delle tre rate messi insieme: 331 + 231 + 121 = **683 €**. È il prezzo che paghi per avere la moto subito.

Per i curiosi, la rata uguale che fa tornare i conti si trova così:

$$R = C \times \frac{i}{1 - (1 + i)^{-n}}$$

Dove \(R\) è la rata, \(C\) il capitale, \(i\) il tasso per periodo e \(n\) il numero di rate.''',
      fig=F([('Anno 1', '1.331 €', [(331, 'Interessi', INT, '331 €'), (1000, 'Capitale', CAP, '1.000 €')]),
             ('Anno 2', '1.331 €', [(231, 'Interessi', INT, '231 €'), (1100, 'Capitale', CAP, '1.100 €')]),
             ('Anno 3', '1.331 €', [(121, 'Interessi', INT, '121 €'), (1210, 'Capitale', CAP, '1.210 €')])])),
    BK('Con il passare degli anni, sale o scende?', ['Scende', 'Resta uguale', 'Sale'], [
      ('La quota interessi', 0, 'Gli interessi si calcolano sul debito che resta, e il debito cala a ogni rata.'),
      ('La rata', 1, "In questo tipo di prestito la rata è la stessa dalla prima all'ultima."),
      ('La quota capitale', 2, 'La rata è fissa e gli interessi scendono: quello che avanza per ridurre il debito cresce.'),
      ('Il debito residuo', 0, 'Ogni rata ne restituisce un pezzo.')]),
    Q("Prendi in prestito 5.000 € all'8% l'anno. Quanti interessi maturano nel primo anno?", ['400 €', '40 €', '800 €'], 0,
      '5.000 × 8% = **400 €**. Negli anni dopo gli interessi scendono, perché il debito residuo si riduce.'),
    Q("In un prestito a rata costante, com'è fatta la prima rata rispetto all'ultima?", ['Ha meno interessi e più capitale', 'È uguale anche dentro', 'Ha più interessi e meno capitale'], 2,
      "All'inizio il debito è al massimo, quindi gli interessi pesano di più e resta meno spazio per il capitale. Nell'esempio della lezione la prima rata ha 331 € di interessi, l'ultima 121 €."),
  ], 'La rata resta uguale, ma dentro cambia: prima più interessi, poi quasi solo capitale.'),

  LF('basi-4-2', 'TAN', 'TAN e TAEG', 6, [
    G("Due banche ti offrono lo stesso prestito: stessa cifra, stessa durata. La banca A chiede un tasso del 5%, la banca B del 6%. Quale ti costa meno?",
      "Il tasso da solo non basta: mancano le **spese**. Un prestito al 5% con spese alte può costare più di uno al 6% senza spese. Per questo ogni prestito ha due numeri, il TAN e il TAEG.",
      options=['La banca A', 'La banca B', 'Non si può dire'], ans=2),
    P('Il tasso non racconta tutto', r'''
Quando chiedi un prestito paghi due tipi di costi.

Il primo sono gli **interessi**, cioè il compenso alla banca per i soldi che ti presta. Il tasso che li misura si chiama **TAN**, tasso annuo nominale.

Il secondo sono le **spese**: aprire la pratica, incassare ogni rata, a volte un'assicurazione che la banca ti obbliga a fare. Nel TAN non ci sono.

Per questo esiste un secondo numero, il **TAEG**, tasso annuo effettivo globale: mette insieme interessi e spese obbligatorie e ti dice quanto costa davvero il prestito in un anno.

[fig]

Quando confronti due offerte, guarda il TAEG.''',
      fig=F([('Quanto ti costa un prestito', None, [(4, 'Interessi: li misura il TAN', INT), (1, 'Spese obbligatorie', 'giallo')])], cap='Il TAEG misura tutta la barra, il TAN solo il primo pezzo.')),
    BK('Entra nel TAEG o resta fuori?', ['Entra nel TAEG', 'Resta fuori'], [
      ('Interessi sul prestito', 0, 'Gli interessi sono il primo pezzo del TAEG: è il TAN.'),
      ('Spese di istruttoria', 0, 'Sono spese obbligatorie per avere il prestito: entrano.'),
      ('Spese di incasso della rata', 0, 'Le paghi a ogni rata e non puoi evitarle: entrano.'),
      ('Assicurazione obbligatoria', 0, 'Se senza polizza il prestito non te lo danno, il suo costo entra.'),
      ('Assicurazione facoltativa', 1, 'Se puoi avere il prestito anche senza, non è un costo obbligatorio: resta fuori.'),
      ('Interessi di mora (per chi paga in ritardo)', 1, 'Li paghi solo se sei in ritardo con le rate: non fanno parte del costo previsto.'),
      ('Spese del notaio', 1, 'Nel mutuo le paghi davvero, ma per regola restano fuori dal TAEG: vanno contate a parte.')],
      after='Nel TAEG entra quello che sei obbligato a pagare per avere il prestito. Restano fuori i costi facoltativi, quelli che nascono da un tuo ritardo e le spese del notaio.'),
    N(r'''
Prestito di 10.000 € per un anno, restituito tutto alla fine.

• Interessi (TAN 6%): 600 €
• Spese obbligatorie: 150 €, pagate insieme al rimborso

Quanto vale il TAEG, in percentuale?''', 7.5, '%', r'''
Costo totale: 600 + 150 = 750 €.

$$\text{TAEG} = \frac{750}{10.000} = 7{,}5\%$$

Il TAN dice 6%, ma il prestito costa il 7,5%. Se le spese si pagassero subito, il TAEG salirebbe ancora un po', perché di fatto riceveresti meno di 10.000 €.''', tol=0.05, dec=2),
    M(('TAN', 'Il puro tasso di interesse del prestito'), ('TAEG', 'Il costo annuo del prestito, spese comprese'), ('Rata', 'La somma che paghi a ogni scadenza'), ('Capitale', 'La cifra che hai preso in prestito')),
    Q('Prestito A: TAN 5%, TAEG 8,2%. Prestito B: TAN 6%, TAEG 6,9%. Stessa cifra, stessa durata. Quale costa meno?', ['Il prestito A', 'Il prestito B', 'Costano uguale'], 1,
      "Conta il TAEG, che comprende le spese: **B** costa il 6,9% contro l'8,2% di A, anche se ha il TAN più alto."),
  ], 'Il TAN è il prezzo del denaro, il TAEG è il prezzo del prestito tutto compreso. Si confronta il TAEG.'),

  LF('basi-4-3', 'M', 'Il mutuo: fisso o variabile', 7, [
    G("Per comprare casa chiedi un mutuo di 150.000 €, da restituire in 25 anni. Se il tasso passa dal 3% al 5%, di quanto aumenta la rata di ogni mese?",
      "Al 3% la rata è di **711 €**, al 5% di **877 €**: circa **166 € in più ogni mese**, per 25 anni. Sulle durate lunghe anche due punti di tasso pesano molto.",
      lo=0, hi=400, step=5, truth=166, near=20),
    P('Un prestito lungo, con la casa in garanzia', r'''
Il **mutuo** è il prestito che si chiede per comprare casa. La cifra è grande, quindi si restituisce in tanti anni, di solito tra 15 e 30, con una rata ogni mese.

Per prestare così tanto e così a lungo la banca vuole una garanzia: la casa stessa. Se smetti di pagare le rate, può farla vendere e riprendersi i soldi. Questa garanzia si chiama **ipoteca**.

Su tempi così lunghi gli interessi pesano molto. Guarda quanto restituisci in tutto per 150.000 € in 25 anni:

[fig]

Stessa casa, stessa cifra: due punti di tasso in più fanno quasi 50.000 € di interessi in più.''',
      fig=F([('Con il tasso al 3%', '213.395 €', [(150000, 'Capitale', CAP, '150.000 €'), (63395, 'Interessi', INT, '63.395 €')]),
             ('Con il tasso al 5%', '263.066 €', [(150000, 'Capitale', CAP, '150.000 €'), (113066, 'Interessi', INT, '113.066 €')])])),
    P('Fisso o variabile', r'''
Quando firmi un mutuo scegli come si comporterà il tasso negli anni.

Con il **tasso fisso** il tasso resta quello del primo giorno, e con lui la rata: sai già oggi quanto pagherai tra vent'anni.

Con il **tasso variabile** il tasso segue un tasso di riferimento del mercato, a cui la banca aggiunge una maggiorazione fissa, lo **spread**. Se i tassi di mercato salgono, sale anche la tua rata; se scendono, scende.

Il variabile parte spesso da una rata più bassa, ma il rischio che salga è tuo. Il fisso spesso costa un po' di più all'inizio: è il prezzo della certezza.'''),
    BK('Fisso o variabile?', ['Tasso fisso', 'Tasso variabile'], [
      ('La rata resta uguale fino alla fine', 0, 'È il tasso fisso che blocca la rata per tutta la durata.'),
      ('Segue un tasso di mercato più lo spread', 1, 'È proprio la definizione di tasso variabile.'),
      ('Se i tassi salgono, la rata sale', 1, 'Con il fisso la rata non si muove: succede solo con il variabile.'),
      ('Sai già oggi quanto pagherai tra 20 anni', 0, 'Solo il fisso ti dà questa certezza.'),
      ('Se i tassi scendono, paghi meno', 1, 'Il variabile segue il mercato anche quando scende.')]),
    LV('Trova una rata che ci sta', 'Mutuo di 150.000 €. Muovi tasso e durata e guarda che cosa succede alla rata e agli interessi totali.', 'mutuo', dict(C=150000),
      [dict(id='tasso', label='Tasso', min=2, max=6, step=0.25, start=5, unit='%', dec=2), dict(id='anni', label='Durata', min=10, max=30, step=5, start=20, unit='anni')],
      [dict(label='Porta la rata a 800 € o meno', cond=[['rata', '<=', 800]], hint='Allungare la durata non basta: prova anche ad abbassare il tasso.'),
       dict(label='Ora tieni anche gli interessi totali sotto 80.000 €', cond=[['rata', '<=', 800], ['interessi', '<', 80000]], hint='Più anni vuol dire più interessi: prova ad abbassare ancora il tasso o ad accorciare la durata.')],
      'Allungare la durata abbassa la rata, ma fa salire gli interessi totali. Per tenere basse tutte e due serve un tasso più basso: per questo conviene confrontare più offerte prima di firmare.'),
    Q('Hai un mutuo a tasso variabile e i tassi di mercato salgono. Che cosa succede alla tua rata?', ['Sale', 'Scende', 'Resta uguale'], 0,
      'Il tasso variabile segue il mercato: se i tassi salgono, **sale** anche la rata. Con un tasso fisso sarebbe rimasta uguale.'),
  ], 'Fisso: rata certa. Variabile: rata che segue i tassi di mercato. La scelta dipende da quanto margine hai se la rata sale.'),

  LF('basi-4-4', '!', 'Quando il debito lavora contro di te', 7, [
    G("Hai pagato un divano e un telefono con la carta di credito: 2.000 € di debito, al 18% l'anno. Per 5 anni paghi solo gli interessi. Quanto hai versato in tutto alla fine?",
      "Ogni anno gli interessi sono 2.000 × 18% = 360 €. In 5 anni fanno **1.800 €**, e devi ancora tutti i 2.000 € di partenza.",
      lo=0, hi=3000, step=50, truth=1800, near=150),
    P('Il debito che non scende', r'''
Alcune carte di credito ti lasciano restituire quello che spendi un po' alla volta. Si chiamano carte **revolving**. Sembra comodo, ma il tasso è spesso molto alto, e la rata minima che ti chiedono copre quasi solo gli interessi.

Con 2.000 € di debito al 18% l'anno gli interessi sono 360 € l'anno, cioè 30 € al mese. Se paghi 30 € al mese, tutto quello che versi va alla banca come interessi e il debito resta fermo.

[fig]

Il debito scende solo con quello che paghi **in più** degli interessi.''',
      fig=F([('Versato in 5 anni', '1.800 €', [(1800, 'Tutti interessi', INT)]), ('Debito che resta', '2.000 €', [(2000, 'Come il primo giorno', CAP)])])),
    LV('Chiudi il debito', "2.000 € di debito al 18% l'anno, cioè l'1,5% al mese. Decidi quanto pagare ogni mese.", 'carta', dict(debito=2000, tasso=18),
      [dict(id='rata', label='Pagamento mensile', min=30, max=200, step=10, start=30, unit='€')],
      [dict(label='Chiudi il debito entro 2 anni', cond=[['mesi', '<=', 24]], hint='Con 30 € paghi solo gli interessi. Sali finché il tempo scende a 2 anni.')],
      'Con 30 € al mese non finisci mai. Con 100 € chiudi in 2 anni e paghi circa 396 € di interessi. Più paghi ogni mese, meno ti costa il debito.'),
    P('Quale debito chiudere per primo', r'''
Ogni euro con cui riduci un debito smette di costarti interessi. È come un investimento sicuro che rende quanto il tasso del debito.

Hai 1.000 € liberi. Guarda che cosa succede in un anno:

• sul conto deposito al 3% guadagni 30 €;
• usati per ridurre la carta al 18%, risparmi 180 € di interessi.

[fig]

Per questo, di solito, conviene chiudere prima i debiti con il tasso più alto.''',
      fig=F([('Sul conto deposito al 3%', '30 €', [(30, 'Interessi guadagnati', 'menta')]), ('Togliendo debito al 18%', '180 €', [(180, 'Interessi risparmiati', 'menta')])], cap='In un anno, con gli stessi 1.000 €.')),
    OR('Hai dei soldi liberi: in che ordine li usi?', ['Fondo di emergenza', 'Debiti con il tasso più alto', 'Investimenti'],
      after='È una regola pratica: prima la sicurezza, poi i debiti cari, poi il resto.'),
    N("Hai un debito sulla carta al 18% l'anno e lo riduci di 500 €. Quanti interessi risparmi in un anno?", 90, '€',
      "500 × 18% = **90 €** l'anno. Su un conto deposito al 3% gli stessi 500 € ne renderebbero 15."),
    Q('Hai 1.000 € liberi, un debito sulla carta al 18% e un conto deposito che rende il 3%. Che cosa conviene fare?', ['Metterli sul conto deposito', 'È indifferente', 'Ridurre il debito sulla carta'], 2,
      'Ridurre il debito ti fa risparmiare 180 € di interessi in un anno, contro i 30 € che guadagneresti sul conto deposito.'),
  ], 'Un debito al 18% costa più di quanto rende quasi ogni investimento. Chiuderlo è il rendimento più sicuro che hai.'),
])

U5 = dict(id='basi-u5', sid='basi-azienda', name="Leggere un'azienda", lessons=[
  L('basi-5-1', 'SP', 'Lo stato patrimoniale', 4, [
    ('Una fotografia', r'''
Lo **stato patrimoniale** fotografa un'azienda in un giorno preciso. Ha due lati che pesano sempre uguale.

• Le **attività**: quello che l'azienda possiede, come cassa, magazzino e impianti.
• Le **passività**: quello che deve ad altri, come i debiti con banche e fornitori.
• Il **patrimonio netto**: quello che resta ai soci una volta pagati tutti i debiti.

**Attività = Passività + Patrimonio netto**'''),
    ('Un esempio', r'''
Un'azienda possiede:

• cassa 50
• magazzino 150
• impianti 300

Totale attività: **500**.

Deve 320 a banche e fornitori. Il patrimonio netto è quello che avanza:

500 − 320 = **180**

Se l'azienda guadagna e non distribuisce gli utili, il patrimonio netto sale. Se perde, scende.''')],
    "Attività = passività + patrimonio netto. È un'uguaglianza che vale sempre, per ogni azienda.",
    [Q("Un'azienda ha attività per 800 e passività per 500. Quanto vale il patrimonio netto?", ['1.300', '500', '300'], 2, '800 − 500 = **300**. Sommare le due cifre è l\'errore tipico: il patrimonio netto è quello che avanza dopo i debiti.'),
     Q("Un'azienda chiude l'anno in perdita e i soci non versano altri soldi. Che cosa succede al patrimonio netto?", ['Scende', 'Sale', 'Resta uguale'], 0,
       "La perdita riduce quello che resta ai soci: il patrimonio netto **scende**. Sale quando l'azienda guadagna e tiene gli utili in azienda.")]),
  L('basi-5-2', 'CE', 'Il conto economico', 5, [
    ('Un film, non una fotografia', r'''
Il **conto economico** racconta un periodo, di solito un anno: quanto l'azienda ha incassato dalle vendite, i **ricavi**, e quanto ha speso, i **costi**. Quello che resta è l'**utile**.

Si scende a gradini:

• ricavi meno costo dei prodotti venduti = **margine lordo**
• meno costi di struttura, come stipendi e affitti = **risultato operativo**
• meno interessi e imposte = **utile netto**'''),
    ('Un esempio', r'''
| Voce | Importo |
|---|---|
| Ricavi | 1.000 |
| Costo dei prodotti venduti | −600 |
| **Margine lordo** | 400 |
| Costi di struttura | −250 |
| **Risultato operativo** | 150 |
| Interessi | −30 |
| Imposte (30% di 120) | −36 |
| **Utile netto** | 84 |

Il **margine netto** è l'utile diviso i ricavi: 84 / 1.000 = **8,4%**. Dice quanti centesimi restano all'azienda per ogni euro venduto.''')],
    'Ricavi meno costi uguale utile. I margini, in percentuale sui ricavi, permettono di confrontare aziende di dimensioni diverse.',
    [M(('Attività', "Quello che l'azienda possiede"), ('Passività', "Quello che l'azienda deve ad altri"), ('Patrimonio netto', 'Quello che resta ai soci'), ('Utile', 'Ricavi meno costi')),
     Q("Un'azienda ha ricavi per 2.000 e costi totali per 1.700. Quanto vale il margine netto?", ['85%', '15%', '30%'], 1, 'Utile = 2.000 − 1.700 = 300. Margine netto = 300 / 2.000 = **15%**.')]),
  L('basi-5-3', '≠', 'Utile non è cassa', 5, [
    ('Due orologi diversi', r'''
Il conto economico registra ricavi e costi quando **nascono**, non quando i soldi si muovono. Questa regola si chiama **competenza**.

• Vendi merce per 100 con pagamento a 90 giorni: il ricavo c'è subito, i soldi no.
• Compri un macchinario da 1.000 che userai per 5 anni: paghi 1.000 subito, ma il conto economico ne conta 200 l'anno. Quella quota si chiama **ammortamento**.

Per questo un'azienda può avere utile e restare senza soldi in cassa.'''),
    ('Seguire i soldi', r'''
Il **rendiconto finanziario** mostra i movimenti di cassa veri.

Un'azienda chiude l'anno con un utile di 50. Ipotesi: tutti i costi sono stati pagati in contanti, ma i clienti devono ancora 80 di vendite già contate nei ricavi.

• Utile: +50
• Vendite non ancora incassate: −80
• Variazione di cassa: **−30**

L'azienda ha guadagnato, eppure ha 30 in meno in cassa. Chi valuta un'azienda guarda sempre tutti e due i numeri.''')],
    "L'utile misura quanto hai guadagnato, la cassa quanti soldi hai davvero. Possono andare in direzioni opposte.",
    [Q("Un'azienda ha un utile di 120. Tutti i costi sono pagati, ma i clienti devono ancora 200 di vendite già contate. Com'è variata la cassa?", ['−80', '+120', '+320'], 0,
       "120 − 200 = **−80**. L'utile c'è, ma i soldi non sono ancora entrati.")]),
  L('basi-5-4', 'P/E', 'Prezzo e valore', 5, [
    ('Quanto paghi per un euro di utile', r'''
Il prezzo di un'azione da solo non dice se è cara. Un'azione da 30 € può essere più cara di una da 300 €.

Un primo metro è il rapporto **prezzo/utili**, in inglese **P/E**:

$$\text{P/E} = \frac{\text{prezzo dell'azione}}{\text{utile per azione}}$$

Se l'azione costa 30 € e l'utile per azione è 2 €, il P/E è **15**: paghi 15 € per ogni euro di utile annuo.'''),
    ('Come si legge', r'''
Un P/E alto di solito vuol dire che il mercato si aspetta utili in forte crescita. Un P/E basso può voler dire un'occasione, oppure un'azienda in difficoltà.

• Azienda A: prezzo 30 €, utile per azione 2 €, P/E 15.
• Azienda B: prezzo 60 €, utile per azione 2 €, P/E 30.

B costa il doppio per lo stesso utile di oggi. Ha senso solo se i suoi utili cresceranno molto più in fretta. Il P/E da solo non dà il verdetto: serve a fare la domanda giusta.''')],
    'Il P/E dice quanti euro paghi per un euro di utile. Si usa per confrontare aziende simili, non come giudizio finale.',
    [Q("Un'azione costa 48 € e l'utile per azione è 4 €. Quanto vale il P/E?", ['12', '44', '192'], 0, '48 / 4 = **12**: paghi 12 € per ogni euro di utile annuo.'),
     Q('Due aziende dello stesso settore: A ha un P/E di 10, B di 25. Che cosa dice il confronto?', ['B guadagna più di A', 'A è di sicuro un affare', 'Per ogni euro di utile, B costa di più'], 2,
       "Il P/E dice quanto paghi per un euro di utile: 25 € con B, 10 € con A. Non dice chi guadagna di più, e un P/E basso non è per forza un affare: può segnalare un'azienda in difficoltà.")]),
])

U6 = dict(id='basi-u6', sid='basi-economia', name="L'economia intorno", lessons=[
  L('basi-6-1', 'BC', 'Banche centrali e tassi', 4, [
    ('Chi decide il prezzo del denaro', r'''
Una **banca centrale**, come la BCE per l'euro o la Federal Reserve per il dollaro, decide i **tassi di riferimento**: quanto pagano le banche per farsi prestare denaro dalla banca centrale e quanto ricevono se lo depositano lì. Da quei tassi dipendono, a cascata, i tassi di mutui, prestiti e conti deposito.

Il compito principale della BCE è tenere stabili i prezzi: il suo obiettivo è un'inflazione del 2% l'anno nel medio periodo.'''),
    ('Tassi su, tassi giù', r'''
• **Inflazione troppo alta**: la banca centrale **alza** i tassi. Prendere soldi in prestito costa di più, famiglie e aziende spendono meno, i prezzi rallentano.
• **Economia debole**: **abbassa** i tassi. Il credito costa meno, consumi e investimenti ripartono.

Per chi investe conta molto: quando i tassi salgono, le obbligazioni già in circolazione perdono valore e le rate dei mutui variabili aumentano. Quando scendono, succede il contrario.''')],
    "La banca centrale alza i tassi per frenare l'inflazione e li abbassa per sostenere l'economia. I mutui a tasso variabile e le obbligazioni sono i primi a risentirne.",
    [Q("L'inflazione è molto sopra l'obiettivo. Che cosa fa di solito la banca centrale?", ['Abbassa i tassi', 'Alza i tassi', 'Lascia tutto fermo'], 1,
       'Alza i tassi: il credito costa di più, la spesa rallenta e i prezzi smettono di correre.'),
     Q('La banca centrale abbassa i tassi. Che effetto ha di solito sui nuovi mutui?', ['Costano meno', 'Costano di più', 'Nessun effetto'], 0,
       'Se il denaro costa meno alle banche, di solito scendono anche i tassi che le banche chiedono ai clienti: i nuovi mutui **costano meno**.')]),
  L('basi-6-2', 'FX', 'I cambi', 5, [
    ('Il prezzo di una moneta', r'''
Il **tasso di cambio** è il prezzo di una moneta espresso in un'altra. Se il cambio euro/dollaro è 1,10, con 1 € compri 1,10 $.

• Se il cambio sale a 1,20 l'euro si è **rafforzato**: con 1 € compri più dollari.
• Se scende a 1,00 l'euro si è **indebolito**.'''),
    ('Il cambio dentro gli investimenti', r'''
Chi compra titoli in un'altra moneta ha due rendimenti: quello del titolo e quello del cambio.

Compri azioni americane per 1.100 $ quando il cambio è 1,10: spendi **1.000 €**. Ipotesi: dopo un anno le azioni valgono ancora 1.100 $, ma il cambio è salito a 1,20.

$$\frac{1.100}{1{,}20} = 916{,}67$$

In euro hai **916,67 €**: hai perso l'8,3% senza che il titolo si sia mosso. Questo è il **rischio di cambio**. Vale anche al contrario: se l'euro si indebolisce, guadagni.''')],
    'Con un titolo in valuta estera guadagni o perdi anche per il cambio. Euro più forte: i tuoi dollari valgono meno.',
    [Q('Hai 1.000 $. Il cambio euro/dollaro passa da 1,00 a 1,25. Quanto valgono adesso in euro?', ['1.250 €', '1.000 €', '800 €'], 2,
       "1.000 / 1,25 = **800 €**. L'euro si è rafforzato, quindi i tuoi dollari comprano meno euro."),
     Q("Il cambio euro/dollaro passa da 1,10 a 1,00. Che cosa è successo all'euro?", ['Si è rafforzato', 'Si è indebolito', 'Non è cambiato nulla'], 1,
       'Prima con 1 € compravi 1,10 $, adesso solo 1,00 $: l\'euro **si è indebolito**.')]),
  L('basi-6-3', '~', 'Il ciclo economico', 5, [
    ('Il PIL e le sue stagioni', r'''
Il **PIL**, prodotto interno lordo, è il valore di tutti i beni e i servizi prodotti in un Paese in un anno. È il termometro dell'economia.

Il PIL non cresce in linea retta. Attraversa fasi che si ripetono:

• **espansione**: il PIL cresce, le aziende assumono;
• **picco**: l'economia è al massimo, spesso l'inflazione sale;
• **recessione**: il PIL scende, la disoccupazione aumenta;
• **ripresa**: si riparte dal punto più basso.'''),
    ('Come si riconosce una recessione', r'''
Una regola pratica molto usata: c'è **recessione** quando il PIL scende per due trimestri consecutivi.

Il ciclo conta per chi investe:

• in recessione gli utili delle aziende scendono e le azioni soffrono;
• le banche centrali di solito abbassano i tassi, e questo aiuta le obbligazioni;
• i mercati guardano avanti: spesso le azioni risalgono prima che la recessione sia finita.

Nessuno sa con certezza in che fase siamo finché non è passata. Per questo conviene un piano che regga in tutte le stagioni.''')],
    "L'economia alterna espansioni e recessioni. Due trimestri di PIL in calo sono la regola pratica per dire recessione.",
    [Q('Il PIL di un Paese scende per due trimestri di fila. Come si chiama questa fase?', ['Espansione', 'Recessione', 'Inflazione'], 1,
       'Due trimestri consecutivi di PIL in calo sono la regola pratica per dire **recessione**.'),
     Q('In una recessione, che cosa fanno di solito le banche centrali?', ['Abbassano i tassi', 'Alzano i tassi', 'Chiudono le borse'], 0,
       "Abbassano i tassi, per rendere il credito meno caro e far ripartire consumi e investimenti.")]),
])

UNITS = [U1, U2, U3, U4, U5, U6]
# ---- controlli di forma ----
keys = [l['key'] for u in UNITS for l in u['lessons']]
assert len(keys) == len(set(keys)), 'chiavi doppie'
pos = collections.Counter(); steps = collections.Counter(); nq = 0; nm = 0
for u in UNITS:
    for l in u['lessons']:
        fl = l.get('flow') or []
        assert (l['pages'] or fl) and l['note'] and l['ex'], l['key']
        assert any(e['type'] == 'mcq' for e in l['ex']), 'manca la domanda in ' + l['key']
        for s in fl:
            T = s['type']; assert T in ('page', 'guess', 'lever', 'bucket', 'order', 'num', 'ex'), (l['key'], T); steps[T] += 1
            for k in ('q', 'x', 'after', 'exp', 't'):
                if isinstance(s.get(k), str): assert '—' not in s[k] and '"' not in s[k], (l['key'], T, k)
            if T == 'guess' and 'options' in s: assert len(s['options']) == 3 and 0 <= s['ans'] < 3, l['key']
            elif T == 'guess': assert s['min'] < s['truth'] < s['max'] and s['near'] > 0 and (s['max'] - s['min']) % s['step'] == 0, l['key']
            elif T == 'lever': assert s['model'] in ('mutuo', 'carta') and s['goals'] and all(g['cond'] and g['label'] for g in s['goals']) and all(x['min'] <= x['start'] <= x['max'] for x in s['sliders']), l['key']
            elif T == 'bucket': assert 2 <= len(s['buckets']) <= 3 and len(s['items']) >= 3 and all(0 <= i[1] < len(s['buckets']) for i in s['items']) and set(i[1] for i in s['items']) == set(range(len(s['buckets']))), l['key']
            elif T == 'order': assert len(s['items']) >= 3 and len(set(s['items'])) == len(s['items']), l['key']
            elif T == 'num': assert isinstance(s['ans'], (int, float)) and s['tol'] >= 0 and s['unit'] in ('€', '%', ''), l['key']
            elif T == 'ex': assert 0 <= s['i'] < len(l['ex']), l['key']
        assert not fl or sorted(s['i'] for s in fl if s['type'] == 'ex') == list(range(len(l['ex']))), l['key']
        for pg in l['pages'] + [s for s in fl if s['type'] == 'page']:
            assert len(pg['x']) < 1000, (l['key'], pg['t'], len(pg['x']))
            assert ('[fig]' in pg['x']) == bool(pg.get('fig')), (l['key'], pg['t'], 'disegno e segnaposto non coincidono')
            for r in (pg.get('fig') or {}).get('rows', []): assert r['segs'] and all(x[0] > 0 and x[2] in ('az', 'pesca', 'menta', 'giallo', 'lilla', 'rosa', 'bianco') for x in r['segs']), (l['key'], pg['t'])
            assert '—' not in pg['x'] and '"' not in pg['x'], (l['key'], pg['t'])
        for e in l['ex']:
            if e['type'] == 'mcq':
                assert len(e['options']) == 3 and 0 <= e['ans'] < 3 and len(set(e['options'])) == 3, l['key']; pos[e['ans']] += 1; nq += 1
            else:
                assert len(e['pairs']) == 4, l['key']; nm += 1
# spazio che non va a capo tra la cifra e la valuta ("150 €" resta sulla stessa riga)
def nb(o):
    if isinstance(o, str): return re.sub(r'(?<=\d) (?=[€$])', '\u00a0', o)
    if isinstance(o, list): return [nb(x) for x in o]
    if isinstance(o, dict): return {k: (v if k in ('key', 'id', 'sid', 'sym', 'type', 'widget', 'model', 'unit', 'cond', 'params') else nb(v)) for k, v in o.items()}
    return o
UNITS = nb(UNITS)
json.dump(UNITS, open(H + '/basi.json', 'w'), ensure_ascii=False, separators=(',', ':'))
print('unità', len(UNITS), '| lezioni', len(keys), '| domande', nq, '| abbina', nm, '| risposta giusta in A/B/C:', [pos[i] for i in range(3)], '| minuti', sum(l['minutes'] for u in UNITS for l in u['lessons']), '| passi nuovi:', dict((k, v) for k, v in steps.items() if k not in ('page', 'ex')))
