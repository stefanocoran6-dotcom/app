# Contenuti del percorso "Basi della finanza": 45 lezioni in 11 unità. Scrive basi.json, che build.sh inserisce in ordine.js.
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

# colori fissi nei disegni: interessi, costi e perdite in pesca; capitale e quello che resta in azzurro; risparmio e guadagni in menta
INT, CAP, OK = 'pesca', 'az', 'menta'

# Unità 1, a passi corti come "Debiti e prestiti": è la prima che vede chi arriva da fuori, quindi ogni parola nuova è spiegata quando compare.
U1 = dict(id='basi-u1', sid='basi-tempo', name='I soldi nel tempo', lessons=[
  LF('basi-1-1', '€', 'A cosa servono i soldi', 5, [
    G("Metti 100 € in un cassetto. Oggi un caffè al bar costa 1 €. Tra vent'anni, immagina, ne costa 2. Quanti caffè compri tra vent'anni con quei 100 €?",
      "Oggi con 100 € compri 100 caffè. Se il prezzo raddoppia, gli stessi 100 € ne comprano **50**. La banconota nel cassetto non è cambiata: è cambiato quello che ci puoi fare. I soldi fanno tre lavori, e questo è il più delicato.",
      lo=0, hi=100, step=5, truth=50, near=5, unit='caffè'),
    P('Tre lavori in uno', r'''
**I soldi in sé non valgono nulla: valgono per quello che ti permettono di fare.**

Fanno tre lavori diversi.

• **Mezzo di scambio.** Li dai in cambio di quello che ti serve. Senza soldi dovresti barattare: il panettiere che vuole un paio di scarpe dovrebbe trovare un calzolaio che ha voglia di pane.
• **Unità di conto.** Sono il metro con cui si misurano i prezzi. Un caffè costa 1,30 €, un libro 18 €: puoi confrontarli perché usano la stessa misura.
• **Riserva di valore.** Ti permettono di spostare il valore nel tempo: guadagni oggi, spendi domani.

I primi due lavori li vedi ogni giorno, quando paghi e quando guardi un prezzo. Il terzo si vede solo con il passare degli anni.'''),
    BK('Quale lavoro stanno facendo i soldi?', ['Mezzo di scambio', 'Unità di conto', 'Riserva di valore'], [
      ('Paghi la spesa alla cassa', 0, 'Dai soldi in cambio di cose: è lo scambio.'),
      ('Confronti il prezzo di due telefoni', 1, 'Usi i soldi come metro per misurare.'),
      ('Metti da parte 200 € per le vacanze', 2, 'Sposti valore da oggi a domani.'),
      ('Ricevi lo stipendio per il tuo lavoro', 0, 'Scambi il tuo lavoro con dei soldi.'),
      ("Leggi che un'auto costa 15.000 €", 1, 'Il prezzo è una misura espressa in soldi.'),
      ('Tieni 1.000 € sul conto per gli imprevisti', 2, 'Li conservi per usarli più avanti.')]),
    P('Il lavoro più fragile', r'''
Dei tre lavori, il terzo è quello che i soldi fanno peggio.

Come mezzo di scambio e come unità di conto funzionano sempre. Come riserva di valore hanno un nemico: i prezzi che salgono.

Torna ai 100 € nel cassetto.

[fig]

Dopo vent'anni la banconota è la stessa, ma compra la metà. Tenere i soldi fermi sembra la scelta più sicura, perché la cifra non scende mai. In realtà è una perdita lenta, che non si vede.

Tutto il resto di questo percorso parte da qui. Gli **interessi** e gli **investimenti** esistono per questo: far sì che i soldi messi da parte non perdano terreno, e se possibile ne guadagnino.''',
      fig=F([('Oggi, con il caffè a 1 €', '100 caffè', [(100, 'Quello che comprano 100 €', CAP)]),
             ("Tra vent'anni, con il caffè a 2 €", '50 caffè', [(50, 'Quello che comprano gli stessi 100 €', INT)])])),
    Q('Metti 500 € in un cassetto per comprare una bici tra un anno. Quale lavoro stai chiedendo ai soldi?', ['Mezzo di scambio', 'Unità di conto', 'Riserva di valore'], 2,
      'Li stai conservando per spenderli più avanti: è la funzione di **riserva di valore**. Diventeranno mezzo di scambio solo il giorno in cui paghi la bici.'),
    Q('Perché i soldi tenuti per molti anni in un cassetto non sono una riserva di valore perfetta?', ['Perché le banconote scadono', 'Perché se i prezzi salgono comprano meno cose', 'Perché la banca li tassa'], 1,
      'La cifra resta la stessa, ma se nel frattempo i prezzi salgono con quella cifra compri **meno cose**. Le banconote non scadono, e nel cassetto la banca non c\'entra.'),
  ], 'I soldi servono per pagare, per misurare i prezzi e per conservare valore. Il terzo lavoro è il più fragile: se i prezzi salgono, i soldi fermi comprano meno.'),

  LF('basi-1-2', '%', 'Interesse semplice', 6, [
    G("Presti 1.000 € a un amico per 3 anni. Vi accordate così: ogni anno ti paga il 5% della cifra prestata, e alla fine ti restituisce i 1.000 €. Quanto incassi in più, in tutto?",
      r"Il 5% di 1.000 € è 50 € l'anno. In tre anni: \(50 \times 3 =\) **150 €**. Quel compenso ha un nome, interesse, e il modo in cui lo avete calcolato si chiama interesse semplice.",
      lo=0, hi=500, step=10, truth=150, near=15),
    P('Il prezzo del tempo', r'''
**Chi presta dei soldi rinuncia a usarli per un po'. L'interesse è il compenso per quella rinuncia.**

Quando presti 1.000 € a qualcuno, per tutta la durata del prestito quei soldi non sono a tua disposizione, e corri il rischio che non tornino. In cambio chiedi un compenso: l'**interesse**.

L'interesse si misura con un **tasso**: una percentuale della cifra prestata, di solito riferita a un anno. Un tasso del 5% l'anno vuol dire 5 € di interesse per ogni 100 € prestati, per ogni anno.

La cifra prestata si chiama **capitale**.

Funziona nei due sensi. Quando depositi soldi in banca sei tu che presti, e gli interessi li ricevi. Quando chiedi un prestito, li paghi.'''),
    P('Sempre sulla cifra di partenza', r'''
Con l'**interesse semplice** il tasso si applica sempre e solo al capitale di partenza. Per questo gli interessi sono uguali ogni anno.

Ecco i 1.000 € prestati al 5% l'anno per 3 anni:

[fig]

Alla fine hai \(1.000 + 150 =\) **1.150 €**. La cifra finale, capitale più interessi, si chiama **montante**.

Il conto si può scrivere in una riga:

$$I = C \times i \times t$$

Dove \(I\) sono gli interessi, \(C\) il capitale, \(i\) il tasso annuo e \(t\) il numero di anni. Qui: \(1.000 \times 5\% \times 3 = 150\) €.''',
      fig=F([('Dopo 3 anni', '1.150 €', [(1000, 'Capitale', CAP, '1.000 €'), (50, 'Anno 1', INT, '50 €'), (50, 'Anno 2', INT, '50 €'), (50, 'Anno 3', INT, '50 €')])],
            cap='Tre pezzi di interessi tutti uguali, perché si calcolano sempre sui 1.000 € di partenza.')),
    N("Presti 2.000 € al 3% l'anno, a interesse semplice. Quanti interessi maturi in un anno?", 60, '€',
      r"\(2.000 \times 3\% =\) **60 €**. Con l'interesse semplice saranno 60 € anche il secondo anno, il terzo e tutti gli altri."),
    N("Stesso prestito: 2.000 € al 3% l'anno, a interesse semplice, per 4 anni. Qual è il montante alla fine?", 2240, '€',
      r"Interessi: 60 € l'anno per 4 anni, \(60 \times 4 = 240\) €. Montante: \(2.000 + 240 =\) **2.240 €**."),
    M(('Capitale', 'La cifra prestata o depositata'), ('Interesse', 'Il compenso per chi presta'), ('Tasso', "L'interesse in percentuale, per un anno"), ('Montante', 'Capitale più interessi')),
    Q("Depositi 5.000 € al 2% l'anno, a interesse semplice, per 3 anni. Quanti interessi maturi in tutto?", ['100 €', '300 €', '306 €'], 1,
      r"Ogni anno: \(5.000 \times 2\% = 100\) €. In 3 anni: \(100 \times 3 =\) **300 €**. La risposta 100 € è un solo anno; 306 € è quello che darebbe l'interesse composto, che vediamo nella prossima lezione."),
    Q("Che cosa dice un tasso del 4% l'anno?", ['Che il prestito dura 4 anni', "Che ogni anno l'interesse è 4 € per ogni 100 € di capitale", 'Che alla fine si restituiscono 4 € in tutto'], 1,
      "Il tasso è l'interesse in percentuale del capitale, per un anno: al 4%, **4 € ogni 100 €, ogni anno**. Su 1.000 € sono 40 € l'anno."),
  ], r'Interesse semplice: \(\text{capitale} \times \text{tasso} \times \text{anni}\). Gli interessi sono uguali ogni anno.'),

  LF('basi-1-3', '%%', "L'interesse composto", 7, [
    G("Metti 1.000 € al 5% l'anno e non li tocchi per 30 anni. Ogni anno gli interessi restano lì e fruttano anche loro. Quanto trovi alla fine?",
      r"Con l'interesse semplice avresti \(1.000 + 50 \times 30 = 2.500\) €. Lasciando lavorare anche gli interessi arrivi a circa **4.322 €**. La differenza, più di 1.800 €, sono interessi guadagnati su altri interessi.",
      lo=1000, hi=8000, step=100, truth=4322, near=300),
    P('Interessi sugli interessi', r'''
**Con l'interesse composto gli interessi non restano da parte: si aggiungono al capitale e cominciano a rendere anche loro.**

Parti da 1.000 € al 5% l'anno.

• **Anno 1**: \(5\% \times 1.000 = 50\) €. Hai 1.050 €.
• **Anno 2**: il 5% si calcola su 1.050 €, non più su 1.000. Sono 52,50 €. Hai 1.102,50 €.
• **Anno 3**: \(5\% \times 1.102{,}50 = 55{,}13\) €. Hai 1.157,63 €.

[fig]

Ogni anno gli interessi sono un po' più alti dell'anno prima, perché si calcolano su una cifra che cresce. All'inizio la differenza con l'interesse semplice è di pochi euro. Con il passare del tempo diventa enorme.''',
      fig=F([("Interessi dell'anno 1", '50,00 €', [(50, 'Sul capitale di partenza', INT)]),
             ("Interessi dell'anno 2", '52,50 €', [(50, 'Sul capitale di partenza', INT), (2.5, 'Sugli interessi di prima', CAP)]),
             ("Interessi dell'anno 3", '55,13 €', [(50, 'Sul capitale di partenza', INT), (5.13, 'Sugli interessi di prima', CAP)])])),
    P('Guardalo crescere', "Muovi il cursore degli anni. Le colonne mostrano tre pezzi: i tuoi soldi, gli interessi sui tuoi soldi e gli interessi sugli interessi. Guarda quale dei tre cresce di più quando gli anni aumentano.", widget='compound'),
    P('Conta più il tempo della cifra', r'''
Dopo \(t\) anni al tasso \(i\) il capitale \(C\) diventa:

$$M = C \times (1 + i)^t$$

Al 5% ogni anno la cifra si moltiplica per 1,05. Dopo due anni l'hai moltiplicata due volte, dopo trent'anni trenta volte.

Ecco 1.000 € al 5% l'anno, con l'interesse semplice e con quello composto:

| Dopo | Semplice | Composto |
|---|---|---|
| 1 anno | 1.050 € | 1.050 € |
| 10 anni | 1.500 € | 1.629 € |
| 20 anni | 2.000 € | 2.653 € |
| 30 anni | 2.500 € | 4.322 € |

Nei primi anni le due colonne quasi coincidono. Poi quella di destra scappa via. Per questo chi comincia presto con poco spesso supera chi comincia tardi con molto.'''),
    N("Metti 2.000 € al 10% l'anno con l'interesse composto. Quanto hai dopo 2 anni?", 2420, '€',
      r"Primo anno: \(2.000 \times 1{,}10 = 2.200\) €. Secondo anno: \(2.200 \times 1{,}10 =\) **2.420 €**. Con l'interesse semplice saresti a 2.400 €: i 20 € in più sono gli interessi maturati sugli interessi del primo anno."),
    Q("Metti 1.000 € al 5% l'anno. Quanto hai dopo 2 anni?", ['1.100,00 €', '1.102,50 €', '1.050,00 €'], 1,
      'Il primo anno arrivi a 1.050 €. Nel secondo anno il 5% si calcola su 1.050 €: sono 52,50 €, non 50. Totale **1.102,50 €**. Chi risponde 1.100 € ha contato il 5% due volte sui 1.000 € di partenza.'),
    Q("Metti 2.000 € al 4% l'anno con l'interesse composto. Quanto hai dopo 3 anni?", ['2.240,00 €', '2.163,20 €', '2.249,73 €'], 2, r'''
| Anno | Conto | Fine anno |
|---|---|---|
| 1 | \(2.000{,}00 \times 1{,}04\) | 2.080,00 |
| 2 | \(2.080{,}00 \times 1{,}04\) | 2.163,20 |
| 3 | \(2.163{,}20 \times 1{,}04\) | 2.249,73 |

L'errore tipico è contare il 4% ogni anno sui 2.000 € di partenza: così arrivi a 2.240 €.'''),
  ], "Conta più il tempo della cifra di partenza: gli interessi sugli interessi crescono piano all'inizio e in fretta dopo."),

  LF('basi-1-4', '↑', "L'inflazione", 7, [
    G("Hai 1.000 € fermi in un cassetto. I prezzi salgono del 3% l'anno. Tra 10 anni, quanto comprano quei 1.000 €, misurati con i prezzi di oggi?",
      "Tra dieci anni quello che oggi costa 1.000 € costerà circa 1.344 €. I tuoi 1.000 € compreranno quindi quello che oggi compri con circa **744 €**. La cifra nel cassetto è la stessa: è il suo valore che è sceso di un quarto.",
      lo=0, hi=1000, step=10, truth=744, near=30),
    P('I prezzi che salgono', r'''
**L'inflazione è l'aumento generale dei prezzi nel tempo.**

Generale vuol dire che non riguarda un solo prodotto. Se sale solo il prezzo delle pesche perché il raccolto è andato male, non è inflazione. Lo è quando sale, in media, il costo di tutto quello che una famiglia compra: cibo, bollette, affitti, trasporti.

Si misura in percentuale all'anno. Un'inflazione del 3% vuol dire che quello che oggi costa 100 €, tra un anno costa in media 103 €.

Per misurarla si usa un **paniere**: un elenco di beni e servizi che rappresenta la spesa tipica delle famiglie. Ogni mese si guarda quanto costa riempirlo e lo si confronta con un anno prima.'''),
    P("Il potere d'acquisto", r'''
Quello che conta dei tuoi soldi non è la cifra, ma che cosa ci puoi comprare. Si chiama **potere d'acquisto**.

Quando i prezzi salgono e la tua cifra resta ferma, il potere d'acquisto scende. Ecco i 1.000 € del cassetto, con l'inflazione al 3% l'anno:

[fig]

Nel cassetto ci sono sempre 1.000 €. Nessuno te li ha tolti. Eppure dopo dieci anni è come se ne avessi 744, e dopo venti 554.

Per questo tenere tutto fermo non è una scelta senza rischi: è la scelta di perdere poco alla volta, con certezza.''',
      fig=F([('Oggi', '1.000 €', [(1000, "Potere d'acquisto", CAP)]),
             ('Tra 10 anni', '744 €', [(744, "Potere d'acquisto", CAP), (256, 'Perso', INT)]),
             ('Tra 20 anni', '554 €', [(554, "Potere d'acquisto", CAP), (446, 'Perso', INT)])], cap="Con l'inflazione al 3% l'anno, misurando tutto con i prezzi di oggi.")),
    LV("Quanto pesa l'inflazione", 'Hai 1.000 € fermi. Muovi inflazione e anni e guarda quanto comprano, con i prezzi di oggi.', 'inflazione', dict(C=1000),
      [dict(id='infl', label='Inflazione', min=1, max=8, step=0.5, start=2, unit='%', dec=1), dict(id='anni', label='Anni', min=1, max=40, step=1, start=5, unit='anni')],
      [dict(label='Trova quando 1.000 € comprano meno di 750 €', cond=[['reale', '<', 750]], hint="Puoi alzare l'inflazione, oppure far passare più anni."),
       dict(label="Ora dimezza il potere d'acquisto con l'inflazione al 2%", cond=[['reale', '<=', 500], ['infl', '<=', 2]], hint="Riporta l'inflazione al 2% e allunga gli anni: serve molto tempo.")],
      "Anche un'inflazione bassa, lasciata lavorare per decenni, dimezza il valore dei soldi fermi. Al 2% servono circa 35 anni, al 6% ne bastano 12."),
    N("Oggi la tua spesa settimanale costa 200 €. Con un'inflazione del 5%, quanto costerà la stessa spesa tra un anno?", 210, '€',
      r'\(200 \times 1{,}05 =\) **210 €**: 10 € in più per comprare le stesse cose.'),
    Q("L'inflazione è al 3% l'anno e il tuo conto rende l'1%. Dopo un anno, che cosa è successo al tuo potere d'acquisto?", ["È salito dell'1%", 'È rimasto uguale', 'È sceso di circa il 2%'], 2,
      r"Il conto è cresciuto dell'1%, ma i prezzi del 3%: in termini reali hai perso circa il **2%** (per la precisione \(\dfrac{1{,}01}{1{,}03} - 1 = -1{,}94\%\))."),
    Q("Che cosa misura l'inflazione?", ["L'aumento medio dei prezzi di tutto quello che le famiglie comprano", "L'aumento del prezzo di un solo prodotto", 'Quanto rende un conto in banca'], 0,
      "L'inflazione guarda l'insieme dei prezzi, attraverso un paniere di beni e servizi. Se sale un solo prodotto e gli altri restano fermi, non è inflazione."),
  ], "Con l'inflazione i soldi fermi perdono potere d'acquisto, anche se la cifra sul conto non scende."),

  LF('basi-1-5', 'r', 'Tasso reale', 6, [
    G("La banca A ti offre il 2% l'anno in un periodo in cui i prezzi salgono dell'1%. La banca B ti offre il 5% in un periodo in cui i prezzi salgono del 6%. In quale caso, a fine anno, puoi comprare più cose di prima?",
      "Con A i tuoi soldi crescono del 2% e i prezzi dell'1%: alla fine compri circa l'1% in più. Con B crescono del 5%, ma i prezzi del 6%: compri circa l'1% in meno, anche se sul conto vedi una cifra più alta. Conta il tasso tolta l'inflazione: si chiama tasso reale.",
      options=['Con la banca A', 'Con la banca B', 'In tutti e due i casi'], ans=0),
    P('Nominale e reale', r'''
**Un tasso di interesse da solo non dice se stai guadagnando: bisogna confrontarlo con l'inflazione.**

Il tasso che leggi sul contratto si chiama **tasso nominale**: dice di quanto cresce la cifra.

Il **tasso reale** dice invece di quanto cresce il tuo potere d'acquisto, cioè quello che puoi comprare. È il tasso nominale ripulito dall'inflazione.

Per i conti di tutti i giorni basta una sottrazione:

$$\text{reale} \approx \text{nominale} - \text{inflazione}$$

[fig]

Se il tasso reale è positivo, a fine anno puoi comprare più cose. Se è negativo ne puoi comprare meno, anche se la cifra sul conto è salita.''',
      fig=F([('Banca A: il conto rende', '2%', [(2, 'Tasso nominale', CAP)]), ('Banca A: i prezzi salgono', '1%', [(1, 'Inflazione', INT)]),
             ('Banca B: il conto rende', '5%', [(5, 'Tasso nominale', CAP)]), ('Banca B: i prezzi salgono', '6%', [(6, 'Inflazione', INT)])],
            cap='Con A il tasso batte i prezzi: reale circa +1%. Con B perdono i tuoi soldi: reale circa −1%.')),
    P('Il conto esatto', r'''
La sottrazione è una buona approssimazione. Il conto preciso divide invece di sottrarre:

$$1 + r = \frac{1 + n}{1 + \pi}$$

Dove \(r\) è il tasso reale, \(n\) il tasso nominale e \(\pi\) l'inflazione.

Con un nominale del 5% e un'inflazione del 2%:

• approssimato: \(5\% - 2\% =\) **3%**
• esatto: \(\dfrac{1{,}05}{1{,}02} - 1 =\) **2,94%**

Perché si divide? In un anno 100 € diventano 105 €, ma quello che costava 100 € ora ne costa 102. Con 105 € compri \(\dfrac{105}{102} = 1{,}0294\) volte quello che compravi prima.

Con tassi bassi i due conti quasi coincidono. Più i tassi sono alti, più la differenza si allarga.'''),
    N("Un conto deposito rende il 3,5% l'anno e l'inflazione è al 2%. Quanto vale all'incirca il tasso reale? Usa la sottrazione.", 1.5, '%',
      r'\(3{,}5\% - 2\% =\) **1,5%**. Il conto esatto dà \(\dfrac{1{,}035}{1{,}02} - 1 = 1{,}47\%\).', tol=0.05, dec=1),
    BK("Il tuo potere d'acquisto sale o scende?", ['Sale', 'Scende'], [
      ('Tasso 4%, inflazione 1%', 0, r'Reale circa \(4\% - 1\% = +3\%\).'),
      ('Tasso 2%, inflazione 5%', 1, r'Reale circa \(2\% - 5\% = -3\%\).'),
      ('Tasso 0%, inflazione 2%', 1, "I soldi fermi perdono circa il 2% l'anno."),
      ('Tasso 6%, inflazione 3%', 0, r'Reale circa \(6\% - 3\% = +3\%\).'),
      ('Tasso 7%, inflazione 9%', 1, "Un tasso alto non basta, se l'inflazione è più alta."),
      ('Tasso 1%, inflazione 0%', 0, 'Senza inflazione tutto il tasso è guadagno reale.')]),
    Q("Un titolo rende il 4% l'anno e l'inflazione è al 6%. Quanto vale all'incirca il tasso reale?", ['−2%', '+2%', '+10%'], 0,
      r'\(\text{Reale} \approx 4\% - 6\% =\) **−2%**. Il titolo ti paga, ma meno di quanto salgono i prezzi: in termini reali perdi.'),
    Q('Il tuo stipendio aumenta del 3% in un anno in cui i prezzi salgono del 3%. Che cosa è successo a quello che puoi comprare?', ['È aumentato del 3%', 'È rimasto più o meno uguale', 'È diminuito del 3%'], 1,
      'Stipendio e prezzi sono saliti allo stesso ritmo: il tuo potere d\'acquisto è rimasto **dov\'era**. Lo stesso ragionamento del tasso reale vale per stipendi, affitti e pensioni.'),
  ], r"\(\text{Tasso reale} \approx \text{nominale} - \text{inflazione}\). Se il reale è negativo, stai perdendo potere d'acquisto."),
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
    [Q("Un'azienda ha 2.000 azioni in circolazione e tu ne possiedi 50. Quale quota dell'azienda è tua?", ['0,25%', '2,5%', '25%'], 1, r'\(\dfrac{50}{2.000} = 0{,}025\), cioè il **2,5%**.')]),
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
    [Q('Un fondo ha un patrimonio di 50 milioni di euro diviso in 2 milioni di quote. Quanto vale una quota?', ['2,50 €', '25 €', '100 €'], 1, r'\(\dfrac{50.000.000}{2.000.000} =\) **25 €** per quota.'),
     Q('Che cosa fa un ETF che replica un indice?', ['Sceglie ogni giorno i titoli migliori', 'Garantisce il capitale investito', "Compra i titoli dell'indice, senza scegliere"], 2,
       "Compra i titoli che compongono l'indice, nelle stesse proporzioni, **senza scegliere**. Per questo costa poco. Non garantisce il capitale: se l'indice scende, scende anche l'ETF.")]),
  L('basi-2-5', 'CC', 'Conti, depositi e liquidità', 4, [
    ('Dove stanno i soldi di tutti i giorni', r'''
• Il **conto corrente** serve per incassare e pagare. Rende poco o niente.
• Il **conto deposito** è fatto per lasciare ferma una somma: in cambio la banca ti paga un interesse. Spesso i soldi sono **vincolati**: se li ritiri prima della scadenza perdi gli interessi, in tutto o in parte, e in certi casi non puoi ritirarli affatto.

Esempio: 5.000 € su un conto deposito al 3% per un anno rendono \(5.000 \times 3\% =\) **150 €** prima delle tasse. In Italia l'imposta sugli interessi è del 26%: te ne restano **111 €**.'''),
    ('La liquidità', r'''
**Liquidità** vuol dire quanto in fretta trasformi qualcosa in denaro senza perderci. Il conto corrente è liquidissimo. Una casa no: per venderla servono mesi.

Per gli imprevisti serve un **fondo di emergenza**: soldi liquidi pari a qualche mese di spese. Una regola diffusa è tenerne da 3 a 6 mesi.

Se spendi 1.500 € al mese, il fondo di emergenza va da 4.500 € a 9.000 €. Solo quello che avanza ha senso investirlo.''')],
    'I soldi che possono servirti presto stanno su strumenti liquidi. Il resto può lavorare su tempi più lunghi.',
    [Q('Spendi 1.200 € al mese e vuoi un fondo di emergenza che copra 4 mesi. Quanto devi tenere da parte?', ['4.800 €', '1.200 €', '14.400 €'], 0,
       r'\(1.200 \times 4 =\) **4.800 €**. 14.400 € sarebbero un anno intero di spese.')]),
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

Petrolio su: \(0{,}5 \times 20\% + 0{,}5 \times (-5\%) =\) **+7,5%**.

La diversificazione funziona quando i titoli **non si muovono tutti insieme**. Dieci aziende dello stesso settore diversificano poco.''')],
    'Mettere insieme titoli che non si muovono allo stesso modo riduce le oscillazioni del portafoglio.',
    [Q('Hai il 60% in un titolo che rende +10% e il 40% in un titolo che rende −5%. Quanto rende il portafoglio?', ['+2,5%', '+5%', '+4%'], 2,
       r'\(0{,}6 \times 10\% + 0{,}4 \times (-5\%) = 6\% - 2\% =\) **+4%**. Il +2,5% sarebbe la media semplice, giusta solo con metà e metà.')]),
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
    [Q("Un fondo rende il 7% l'anno prima dei costi e costa l'1,8% l'anno. Quanto ti resta all'incirca?", ['5,2%', '8,8%', '7%'], 0, r'\(7\% - 1{,}8\% =\) **5,2%** circa. I costi si tolgono dal rendimento, non si aggiungono.')]),
])

# Unità pilota a passi corti: ogni lezione alterna spiegazioni vere (scritte per chi parte da zero, con un disegno accanto) e cose da fare.
# Ogni lezione segue una situazione di vita reale dall'inizio alla fine: la stima d'apertura fa la domanda, l'ultima pagina la chiude.
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

• Interessi: \(10\% \times 3.310 =\) **331 €**

La rata è di 1.331 €. Tolti gli interessi, quello che avanza restituisce capitale:

• Capitale restituito: \(1.331 - 331 =\) **1.000 €**

[fig]

Dopo la prima rata non devi più 3.310 €, ma \(3.310 - 1.000 =\) **2.310 €**. Gli interessi dell'anno prossimo si calcolano su questa cifra, che è più bassa.''',
      fig=F([('La prima rata', '1.331 €', [(331, 'Interessi', INT, '331 €'), (1000, 'Capitale restituito', CAP, '1.000 €')])])),
    N(r'''
Secondo anno. Adesso devi alla banca 2.310 €, e il tasso è sempre il 10%.

| Anno | Interessi | Capitale | Debito residuo |
|---|---|---|---|
| 1 | 331 | 1.000 | 2.310 |
| 2 | **?** | | |

Quanti interessi paghi nel secondo anno?''', 231, '€',
      r"\(10\% \times 2.310 =\) **231 €**. Il resto della rata, \(1.331 - 231 = 1.100\) €, restituisce capitale: il debito scende a 1.210 €."),
    N(r'''
Terzo anno. Ti restano 1.210 € di debito al 10%, e la rata è sempre di 1.331 €.

| Anno | Interessi | Capitale | Debito residuo |
|---|---|---|---|
| 1 | 331 | 1.000 | 2.310 |
| 2 | 231 | 1.100 | 1.210 |
| 3 | 121 | **?** | |

Quanto capitale restituisci con l'ultima rata?''', 1210, '€',
      r"Interessi: \(10\% \times 1.210 = 121\) €. Capitale restituito: \(1.331 - 121 =\) **1.210 €**, cioè tutto il debito che restava. Il prestito è chiuso."),
    P('La rata resta uguale, dentro cambia', r'''
Ecco le tre rate una sotto l'altra. La cifra è sempre 1.331 €, ma guarda come cambia dentro.

[fig]

Anno dopo anno il debito scende, quindi scendono gli interessi e cresce la parte che restituisce capitale.

E i 683 € della domanda iniziale? Sono gli interessi delle tre rate messi insieme: \(331 + 231 + 121 =\) **683 €**. È il prezzo che paghi per avere la moto subito.

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
      r'\(5.000 \times 8\% =\) **400 €**. Negli anni dopo gli interessi scendono, perché il debito residuo si riduce.'),
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
Costo totale: \(600 + 150 = 750\) €.

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
      r"Ogni anno gli interessi sono \(2.000 \times 18\% = 360\) €. In 5 anni fanno **1.800 €**, e devi ancora tutti i 2.000 € di partenza.",
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
      r"\(500 \times 18\% =\) **90 €** l'anno. Su un conto deposito al 3% gli stessi 500 € ne renderebbero 15."),
    Q('Hai 1.000 € liberi, un debito sulla carta al 18% e un conto deposito che rende il 3%. Che cosa conviene fare?', ['Metterli sul conto deposito', 'È indifferente', 'Ridurre il debito sulla carta'], 2,
      'Ridurre il debito ti fa risparmiare 180 € di interessi in un anno, contro i 30 € che guadagneresti sul conto deposito.'),
  ], 'Un debito al 18% costa più di quanto rende quasi ogni investimento. Chiuderlo è il rendimento più sicuro che hai.'),
  # ---- aggiunte del novembre 2026: comprare a rate, compra ora paga dopo, cessione del quinto. Tassi medi: Banca d'Italia, quarto trimestre 2026 ----
  LF('basi-4-5', '0%', 'Comprare a rate', 7, [
    G('Un televisore da 1.200 € in 12 rate a tasso zero. Nel contratto ci sono 30 € di spese di pratica e 2 € di spese per ogni rata. Quanto paghi in tutto?',
      r"Il tasso è davvero zero: di interessi non ne paghi. Ma paghi 30 € di pratica e \(2 \times 12 = 24\) € sulle rate: in tutto **1.254 €**. Quei 54 € in più, rapportati a un anno, fanno un TAEG dell'8,75%. Tasso zero vuol dire TAN zero, non costo zero.",
      lo=1200, hi=1400, step=2, truth=1254, near=10),
    P('Dove si nasconde il costo', r'''
**In un acquisto a rate il prezzo del prestito non sta solo negli interessi.**

Il **TAN** misura gli interessi. Il **TAEG** mette insieme interessi e spese: è l'unico numero che dice quanto costa davvero il prestito in un anno.

Le spese stanno di solito in tre punti.

• **Spese di pratica**, pagate una volta all'inizio.
• **Spese di incasso** per ogni rata, e l'imposta di bollo sul contratto.
• **Assicurazioni** vendute insieme al prestito. Se sono facoltative puoi rifiutarle. Se sono obbligatorie per avere il prestito, il loro costo deve stare dentro il TAEG.

Un riferimento per capire se un'offerta è cara: nella rilevazione della Banca d'Italia della primavera 2026 il TAEG medio dei prestiti per comprare un bene è dell'11,3%, quello dei prestiti personali del 12,1%.'''),
    LV('Tasso zero, TAEG no', 'Un acquisto da 1.200 € a tasso zero. Muovi le spese e il numero di rate.', 'rate', dict(prezzo=1200),
      [dict(id='pratica', label='Spese di pratica', min=0, max=100, step=10, start=30, unit='€'),
       dict(id='incasso', label='Spese per ogni rata', min=0, max=5, step=0.5, start=2, unit='€', dec=2),
       dict(id='mesi', label='Numero di rate', min=6, max=36, step=6, start=12, unit='')],
      [dict(label='Porta il TAEG sotto il 5%', cond=[['taeg10', '<', 50]], hint='Il tasso è già zero: il TAEG scende solo togliendo spese.'),
       dict(label='Ora rimetti 30 € di pratica e 2 € a rata, e scendi a 6 rate', cond=[['pratica', '>=', 30], ['incasso', '>=', 2], ['mesi', '<=', 6]], hint='Riporta le spese ai valori di partenza, poi accorcia il piano.')],
      'Con le stesse spese, su 6 rate il TAEG sale quasi al 13%. I costi fissi pesano di più sui prestiti piccoli e corti: per questo su un acquisto a rate anche pochi euro di spese contano.'),
    P('I tuoi diritti quando firmi', r'''
Un acquisto a rate è un contratto di credito, e la legge ti dà quattro diritti che pochi usano.

• **Ripensarci.** Hai 14 giorni per uscire dal finanziamento senza spiegare perché.
• **Chiudere prima.** Puoi restituire tutto in anticipo quando vuoi, e i costi del prestito si riducono per il tempo che non usi.
• **Fermare le rate se il bene non arriva.** Se il venditore non consegna, o consegna una cosa diversa, e non rimedia dopo il tuo sollecito, puoi far sciogliere anche il finanziamento collegato all'acquisto.
• **Sapere prima.** Prima di firmare devono darti un foglio con TAEG, rata e totale da restituire, uguale per tutte le finanziarie: serve a confrontare due offerte.'''),
    P('Che cosa resta scritto di te', r'''
Ogni volta che chiedi un prestito, la richiesta e i pagamenti finiscono nei **sistemi di informazioni creditizie**, banche dati che le finanziarie consultano prima di decidere.

Ci resta il bello e il brutto, per tempi fissati:

| Che cosa | Per quanto tempo |
|---|---|
| Una richiesta di prestito | 6 mesi |
| Una o due rate in ritardo, poi pagate | 12 mesi |
| Più di due rate in ritardo, poi pagate | 24 mesi |
| Rate mai pagate | 36 mesi |
| Un prestito pagato regolarmente | 60 mesi |

Due conseguenze pratiche. Un ritardo anche piccolo ti segue per un anno, e può costarti un mutuo. E chiedere prestiti a molte finanziarie nello stesso mese lascia una traccia che non aiuta.

Puoi chiedere gratis di vedere i tuoi dati.'''),
    BK('Entra nel TAEG?', ['Sì', 'No'], [
      ('Gli interessi', 0, 'Sono la prima voce del costo.'),
      ('Le spese di pratica', 0, 'Sono un costo obbligato del prestito.'),
      ("L'assicurazione che la finanziaria ti impone", 0, 'Se senza non ti danno il prestito, il suo costo va contato nel TAEG.'),
      ('Le spese di incasso di ogni rata', 0, 'Le paghi a ogni rata: fanno parte del costo.'),
      ("L'assicurazione facoltativa che hai scelto tu", 1, "Non è necessaria per avere il prestito: resta fuori dal TAEG. Per questo va guardata a parte."),
      ('La mora per una rata pagata in ritardo', 1, 'Il TAEG è calcolato come se pagassi sempre puntuale.')],
      after='Il TAEG conta tutto quello che devi pagare per forza. Quello che aggiungi tu, o che nasce da un ritardo, sta fuori.'),
    Q('Un prestito ha TAN 0% e TAEG 9%. Che cosa vuol dire?', ['Che non costa nulla', 'Che non ci sono interessi, ma ci sono spese', "Che c'è un errore nel contratto"], 1,
      'Il TAN misura solo gli interessi, il TAEG anche le spese. Con TAN zero e TAEG al 9% gli interessi non ci sono, ma le spese sì: sono loro il costo del prestito.'),
    Q('Hai firmato ieri un finanziamento per un divano e ci hai ripensato. Che cosa puoi fare?', ['Uscire dal contratto: hai 14 giorni', 'Nulla: la firma è definitiva', 'Uscire solo pagando una penale'], 0,
      'Nei contratti di credito hai 14 giorni per recedere, senza dover dare spiegazioni.'),
    Q('Hai pagato in ritardo due rate, poi ti sei messo in regola. Per quanto tempo resta la segnalazione nelle banche dati del credito?', ['Viene cancellata subito', '6 mesi', '12 mesi'], 2,
      "Un ritardo di una o due rate, poi pagate, resta visibile per 12 mesi dal momento in cui ti metti in regola. Oltre le due rate i mesi diventano 24."),
  ], 'Tasso zero vuol dire TAN zero: il costo sta nelle spese, e lo misura il TAEG. Hai 14 giorni per ripensarci, e i ritardi restano scritti per almeno un anno.'),

  LF('basi-4-6', '3×', 'Compra ora, paga dopo', 6, [
    G('Paghi un acquisto da 300 € in tre rate senza interessi, con un servizio del tipo compra ora, paga dopo. Chi paga il costo del servizio?',
      "Lo paga il **negozio**, con una commissione su ogni vendita. Gli conviene, perché chi può dividere in rate compra più spesso e spende di più. È il punto da ricordare: il servizio è gratis per te perché funziona nel farti comprare.",
      options=['Nessuno: è gratis per tutti', 'Il negozio, con una commissione', 'Tu, con un prezzo più alto'], ans=1),
    P('Come funziona', r'''
**Compra ora, paga dopo è un piccolo prestito senza interessi, concesso in pochi secondi alla cassa.**

Di solito il prezzo si divide in tre o quattro rate: la prima subito, le altre ogni mese, prelevate da sole dalla carta.

Se paghi puntuale non costa nulla. Per questo sembra diverso da un debito, ma è un debito a tutti gli effetti.

I rischi sono tre, e nessuno è scritto in grande.

• **Compri di più.** Una spesa da 300 € che diventa 100 € fa meno effetto.
• **Le rate si sommano.** Tre acquisti con tre servizi diversi sono tre piani di rate, e nessuno ti mostra il totale del mese.
• **Il ritardo si paga.** Se sulla carta non ci sono soldi quando passa la rata, possono scattare spese di mora, e il ritardo può essere segnalato.'''),
    N(r'''
In ottobre Elena fa tre acquisti con il compra ora, paga dopo, ognuno in 3 rate uguali:

• scarpe da 240 €
• una giacca da 180 €
• cuffie da 90 €

Quanto le verrà prelevato in tutto dalla carta a novembre?''', 170, '€',
      r'Ogni acquisto diviso in tre: \(80 + 60 + 30 =\) **170 €**. Lo stesso a dicembre. Sono rate piccole, ma arrivano insieme e su tre servizi diversi.'),
    P('Dal 20 novembre 2026 è credito a tutti gli effetti', r'''
Per anni questi pagamenti sono rimasti fuori dalle regole dei prestiti. Con le nuove norme europee, in vigore in Italia dal 20 novembre 2026, non è più così.

Quando la dilazione la concede una società diversa dal negozio, valgono le regole del credito ai consumatori:

• chi la concede deve prima **verificare che tu possa restituire**, guardando anche i debiti che hai già;
• deve dirti con chiarezza costi e totale;
• i tuoi ritardi possono finire nelle banche dati del credito, dove li vedrà anche la banca a cui chiederai un mutuo.

Resta fuori solo la dilazione che il venditore ti concede di tasca sua, **gratis** e per **non più di 50 giorni**.'''),
    BK('Vale la regola del credito?', ['Sì, è credito', 'No, resta fuori'], [
      ('Tre rate senza interessi con una società di pagamenti', 0, 'La dilazione non la concede il negozio ma una società terza: è credito.'),
      ('Il negozio ti fa pagare a fine mese, senza costi', 1, 'È una dilazione gratuita del venditore, entro 50 giorni.'),
      ('Sei rate in sei mesi offerte dal negozio, gratis', 0, 'Supera i 50 giorni: valgono le regole del credito.'),
      ('Il negozio ti dà 30 giorni, con 3 € di commissione', 0, 'Ha un costo: non è più una dilazione gratuita.'),
      ('Paghi la palestra alla fine di ogni mese', 1, 'Paghi un servizio dopo averlo usato, senza costi in più.')],
      after='Fuori dalle regole resta solo quello che è insieme gratuito, breve e concesso dal venditore.'),
    Q('Perché il compra ora, paga dopo va trattato come un debito, anche se non ha interessi?', ['Perché ha sempre spese nascoste', 'Perché impegna soldi che devi ancora guadagnare', 'Perché fa salire il prezzo'], 1,
      'Se paghi puntuale non costa nulla. Ma le rate dei prossimi mesi sono soldi già promessi: si sommano tra loro e al resto delle spese fisse.'),
    Q("Dal 20 novembre 2026, che cosa deve fare la società che ti concede tre rate su un acquisto?", ['Verificare prima che tu possa restituire', 'Chiederti una garanzia sulla casa', 'Nulla di diverso da prima'], 0,
      'Con le nuove regole è credito ai consumatori: chi lo concede deve valutare prima se puoi restituirlo, considerando anche gli altri debiti.'),
    Q('Salti una rata di un acquisto pagato in tre volte. Oltre alla mora, che cosa rischi?', ['Nulla: sono cifre piccole', "Che ti ritirino l'acquisto", 'Che il ritardo resti scritto nelle banche dati del credito'], 2,
      'Anche un debito piccolo, se pagato in ritardo, può finire nelle banche dati che le banche consultano. Lo ritrovi quando chiedi un prestito o un mutuo.'),
  ], 'Compra ora, paga dopo è un debito senza interessi: gratis se paghi puntuale, ma le rate si sommano. Dal 20 novembre 2026 segue le regole del credito.'),

  LF('basi-4-7', '1/5', 'La cessione del quinto', 7, [
    G('Paola ha un netto di 1.384 € al mese per 13 mensilità, cioè 1.500 € al mese in media. Con una cessione del quinto, qual è la rata più alta che può impegnare?',
      r"Un quinto del netto: \(\dfrac{1.500}{5} =\) **300 €** al mese. Il limite è scritto nella legge, e serve a lasciare a chi si indebita almeno quattro quinti dello stipendio.",
      lo=0, hi=600, step=10, truth=300, near=20),
    P('Il prestito che si paga da solo', r'''
**Nella cessione del quinto la rata non la paghi tu: la trattiene chi ti paga lo stipendio.**

• Possono chiederla i lavoratori dipendenti e i pensionati.
• La rata non può superare **un quinto** del netto.
• Può durare fino a **10 anni**.
• La rata viene tolta dalla busta paga dal datore di lavoro, o dalla pensione dall'INPS, e versata alla finanziaria.

Per chi presta è un rischio piccolo, per tre motivi: la rata arriva alla fonte, un'**assicurazione obbligatoria** copre il caso di morte o di perdita del lavoro, e il **TFR** resta vincolato a garanzia.

Per questo viene concessa anche a chi un altro prestito non lo otterrebbe. Ed è il motivo per cui va guardata con più attenzione, non con meno.'''),
    P('Quanto costa davvero', r'''
Una rata che esce dalla busta paga non si sente. Il costo, però, c'è tutto.

Il TAEG di una cessione comprende interessi, commissioni, spese di istruttoria e assicurazioni. Nella rilevazione della Banca d'Italia della primavera 2026 quello medio è:

| Cessione del quinto | TAEG medio |
|---|---|
| fino a 15.000 € | 14,2% |
| oltre 15.000 € | 9,9% |

Con 300 € al mese per 10 anni restituisci 36.000 €. Al 9,9% ne ricevi circa 23.200: gli altri 12.800 € sono il prezzo del prestito.

Tre cose da confrontare tra due offerte, più della rata: il **TAEG**, il **totale da restituire** e la **somma che ti arriva** davvero sul conto.'''),
    LV('Quanto ricevi, quanto restituisci', 'La rata è sempre un quinto del netto. Muovi stipendio, durata e TAEG.', 'quinto', dict(),
      [dict(id='netto', label='Netto medio al mese', min=1000, max=3000, step=50, start=1500, unit='€'),
       dict(id='anni', label='Durata', min=2, max=10, step=1, start=10, unit='anni'),
       dict(id='taeg', label='TAEG', min=6, max=20, step=0.5, start=10, unit='%', dec=1)],
      [dict(label='Fai scendere il costo del prestito sotto 8.000 €', cond=[['costo', '<', 8000]], hint='Il costo è la parte della barra a destra. Scende con una durata più corta o con un TAEG più basso.'),
       dict(label='Ora ricevi almeno 15.000 € con un costo sotto 5.000 €', cond=[['somma', '>=', 15000], ['costo', '<', 5000]], hint='Servono insieme una durata media e un TAEG basso.')],
      'Durata e TAEG decidono il costo molto più della rata. E siccome la rata resta sempre un quinto dello stipendio, allungare il piano fa arrivare più soldi oggi, ma li fa pagare di più.'),
    P('Tre regole da conoscere', r'''
• **Non si rinnova quando si vuole.** Una cessione si può rinnovare solo dopo averne pagati i due quinti: su un piano di 10 anni, dopo 4. La regola serve a fermare le catene di rinnovi, ognuno con le sue spese.
• **Chiuderla prima fa risparmiare.** Puoi estinguerla in anticipo quando vuoi, e hai diritto alla riduzione dei costi per il tempo che non usi, comprese le spese pagate all'inizio. Non sempre viene applicata bene: vale la pena controllare il conteggio.
• **Se il lavoro finisce, entra in gioco il TFR.** Il debito che resta viene preso prima di tutto da lì.

Prima di firmare controlla che chi ti propone il prestito sia iscritto negli elenchi della Banca d'Italia o dell'OAM, l'organismo degli agenti del credito. La frase in convenzione con l'INPS non vuol dire che il prestito sia garantito o conveniente.'''),
    N('Hai una cessione del quinto di 120 rate. Dopo quante rate pagate la puoi rinnovare?', 48, '',
      r'Si può rinnovare dopo aver pagato i due quinti del piano: \(120 \times \dfrac{2}{5} =\) **48 rate**, cioè 4 anni.'),
    Q('Perché una finanziaria concede la cessione del quinto anche a chi non otterrebbe un altro prestito?', ['Perché ha tassi fissati dallo Stato', 'Perché la rata arriva dalla busta paga, con assicurazione e TFR a garanzia', 'Perché non controlla nulla'], 1,
      "La rata la versa direttamente il datore di lavoro o l'INPS, un'assicurazione copre morte e perdita del lavoro, e il TFR resta vincolato. Il rischio per chi presta è basso. Questo non rende il prestito conveniente per te."),
    Q('Due offerte di cessione hanno la stessa rata di 300 € per 10 anni. Una ti accredita 23.000 €, l\'altra 20.000 €. Che cosa cambia?', ['Nulla: la rata è uguale', 'La seconda dura meno', 'La seconda costa di più: il TAEG è più alto'], 2,
      'Con la stessa rata e la stessa durata restituisci gli stessi 36.000 €. Se ricevi 3.000 € in meno, il prestito costa 3.000 € in più: è un TAEG più alto.'),
    Q('Estingui una cessione dopo 4 anni su 10. Che cosa ti spetta?', ['La riduzione dei costi per gli anni che non usi, comprese le spese iniziali', 'Solo la riduzione degli interessi futuri', 'Nulla: i costi sono già pagati'], 0,
      "Chi chiude prima un prestito ha diritto alla riduzione del suo costo totale per il tempo che resta, e questo vale anche per le spese pagate all'inizio. Se il conteggio non torna puoi fare reclamo, e poi ricorso all'Arbitro Bancario Finanziario."),
  ], 'Cessione del quinto: rata al massimo un quinto del netto, fino a 10 anni, trattenuta in busta paga. Guarda TAEG, totale da restituire e somma che ricevi, non la rata.'),
])

U5 = dict(id='basi-u5', sid='basi-azienda', name="Leggere un'azienda", lessons=[
  L('basi-5-1', 'SP', 'Lo stato patrimoniale', 4, [
    ('Una fotografia', r'''
Lo **stato patrimoniale** fotografa un'azienda in un giorno preciso. Ha due lati che pesano sempre uguale.

• Le **attività**: quello che l'azienda possiede, come cassa, magazzino e impianti.
• Le **passività**: quello che deve ad altri, come i debiti con banche e fornitori.
• Il **patrimonio netto**: quello che resta ai soci una volta pagati tutti i debiti.

$$\text{Attività} = \text{Passività} + \text{Patrimonio netto}$$'''),
    ('Un esempio', r'''
Un'azienda possiede:

• cassa 50
• magazzino 150
• impianti 300

Totale attività: **500**.

Deve 320 a banche e fornitori. Il patrimonio netto è quello che avanza:

\(500 - 320 =\) **180**

Se l'azienda guadagna e non distribuisce gli utili, il patrimonio netto sale. Se perde, scende.''')],
    r"\(\text{Attività} = \text{passività} + \text{patrimonio netto}\). È un'uguaglianza che vale sempre, per ogni azienda.",
    [Q("Un'azienda ha attività per 800 e passività per 500. Quanto vale il patrimonio netto?", ['1.300', '500', '300'], 2, r"\(800 - 500 =\) **300**. Sommare le due cifre è l'errore tipico: il patrimonio netto è quello che avanza dopo i debiti."),
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

Il **margine netto** è l'utile diviso i ricavi: \(\dfrac{84}{1.000} =\) **8,4%**. Dice quanti centesimi restano all'azienda per ogni euro venduto.''')],
    'Ricavi meno costi uguale utile. I margini, in percentuale sui ricavi, permettono di confrontare aziende di dimensioni diverse.',
    [M(('Attività', "Quello che l'azienda possiede"), ('Passività', "Quello che l'azienda deve ad altri"), ('Patrimonio netto', 'Quello che resta ai soci'), ('Utile', 'Ricavi meno costi')),
     Q("Un'azienda ha ricavi per 2.000 e costi totali per 1.700. Quanto vale il margine netto?", ['85%', '15%', '30%'], 1, r'\(\text{Utile} = 2.000 - 1.700 = 300\). \(\text{Margine netto} = \dfrac{300}{2.000} =\) **15%**.')]),
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
       r"\(120 - 200 =\) **−80**. L'utile c'è, ma i soldi non sono ancora entrati.")]),
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
    [Q("Un'azione costa 48 € e l'utile per azione è 4 €. Quanto vale il P/E?", ['12', '44', '192'], 0, r'\(\dfrac{48}{4} =\) **12**: paghi 12 € per ogni euro di utile annuo.'),
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
       r"\(\dfrac{1.000}{1{,}25} =\) **800 €**. L'euro si è rafforzato, quindi i tuoi dollari comprano meno euro."),
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

# ---- Unità nuove, tutte a passi corti e scritte per chi parte da zero ----
# Colori dei disegni in queste unità: bisogni e spese fisse in azzurro, desideri e spese variabili in giallo, risparmio in menta.
U7 = dict(id='basi-u7', sid='basi-budget', name='Entrate e uscite', lessons=[
  LF('basi-7-1', '+/−', 'Dove vanno i tuoi soldi', 6, [
    G("Giulia, nei giorni di lavoro, prende un caffè e un panino al bar: 6 € al giorno, per circa 220 giorni l'anno. Quanto spende in un anno?",
      r'6 € per 220 giorni: \(6 \times 220 =\) **1.320 €**, quasi un mese del suo stipendio, che è di 1.600 €. Non è un invito a rinunciare al caffè. È il motivo per cui conviene sapere dove vanno i soldi: le cifre piccole che si ripetono sono quelle che si vedono meno.',
      lo=0, hi=3000, step=20, truth=1320, near=150),
    P('Entrate, uscite, saldo', r'''
**Per decidere dove mandare i tuoi soldi devi prima sapere dove vanno adesso.**

I soldi che ti arrivano in un mese si chiamano **entrate**: lo stipendio che ricevi sul conto, una pensione, un affitto che incassi.

I soldi che escono si chiamano **uscite**: tutto quello che paghi, dall'affitto al caffè.

La differenza tra le due è il **saldo** del mese:

$$\text{saldo} = \text{entrate} - \text{uscite}$$

Giulia guadagna 1.600 € al mese e ne spende 1.600: il suo saldo è zero. Non ha debiti, ma non mette da parte niente, e non saprebbe dire dove sono finiti.'''),
    P('Spese fisse e spese variabili', r'''
Le uscite non sono tutte uguali. Conviene dividerle in due gruppi.

Le **spese fisse** tornano ogni mese con la stessa cifra, o quasi, e non le decidi di volta in volta: l'affitto, le bollette, l'abbonamento del telefono, la rata dell'auto.

Le **spese variabili** cambiano da un mese all'altro e dipendono da quello che fai: la spesa al supermercato, le cene fuori, i vestiti, la benzina.

Ecco il mese di Giulia:

[fig]

Le spese fisse si cambiano di rado, ma quando ci riesci il risparmio si ripete ogni mese senza fatica. Quelle variabili si cambiano subito, ma vanno tenute d'occhio ogni volta.''',
      fig=F([('Le uscite di Giulia', '1.600 €', [(900, 'Spese fisse', CAP, '900 €'), (700, 'Spese variabili', 'giallo', '700 €')])])),
    BK('Spesa fissa o variabile?', ['Spesa fissa', 'Spesa variabile'], [
      ('Affitto', 0, 'È la stessa cifra ogni mese e non la decidi di volta in volta.'),
      ('Cena al ristorante', 1, "Dipende da quante volte esci: cambia da un mese all'altro."),
      ('Abbonamento del telefono', 0, 'Si rinnova ogni mese con la stessa cifra.'),
      ('Vestiti', 1, 'Li compri quando decidi tu, e la cifra cambia ogni volta.'),
      ("Rata dell'auto", 0, 'È fissata dal contratto: uguale ogni mese.'),
      ('Benzina', 1, 'Dipende da quanti chilometri fai.'),
      ('Abbonamento alla palestra', 0, 'Lo paghi ogni mese, che tu ci vada oppure no.')]),
    N(r'''
Il mese di Luca:

• stipendio: 1.900 €
• spese fisse: 1.050 €
• spese variabili: 620 €

Quanto vale il suo saldo del mese?''', 230, '€',
      r'Uscite: \(1.050 + 620 = 1.670\) €. Saldo: \(1.900 - 1.670 =\) **230 €**. È quello che Luca può mettere da parte.'),
    P('Che cosa ti dice il saldo', r'''
Il saldo è il primo numero da guardare.

• Se è **positivo** ti avanza qualcosa: è la base del tuo **risparmio**.
• Se è **zero** arrivi a fine mese giusto giusto, e basta un imprevisto per andare sotto.
• Se è **negativo** stai spendendo più di quello che guadagni: la differenza la paghi con i risparmi di prima, oppure con un debito.

Per conoscere il tuo saldo vero basta un mese di attenzione: segna ogni uscita, anche piccola, poi dividile in fisse e variabili.

Torniamo a Giulia. Caffè e panino le costano 1.320 € l'anno, cioè 110 € al mese. Se metà dei giorni facesse a meno del bar, spenderebbe 55 € in meno al mese: il suo saldo passerebbe da zero a **+55 €**, senza cambiare stipendio.'''),
    Q('In un mese entrano 2.000 € ed escono 2.150 €. Che cosa è successo?', ['Hai risparmiato 150 €', 'Il saldo è zero', 'Hai speso 150 € più di quanto hai guadagnato'], 2,
      r'\(2.000 - 2.150 =\) **−150 €**. Il saldo è negativo: quei 150 € li hai presi dai risparmi di prima, oppure da un debito.'),
    Q('Quale di queste è una spesa fissa?', ['La spesa al supermercato', "L'abbonamento a internet di casa", 'Un regalo di compleanno'], 1,
      "L'abbonamento a internet torna ogni mese con la stessa cifra: è una **spesa fissa**. La spesa al supermercato e i regali cambiano di volta in volta: sono spese variabili."),
  ], r'\(\text{Saldo} = \text{entrate} - \text{uscite}\). Le spese fisse tornano uguali ogni mese, quelle variabili dipendono da quello che fai.'),

  LF('basi-7-2', 'BUD', 'Un budget in tre parti', 7, [
    G("Una regola semplice dice di dividere lo stipendio in tre parti: metà per quello che ti serve, il 30% per quello che ti piace, il 20% da mettere da parte. Con 1.600 € al mese, quanto finisce da parte ogni mese?",
      "Il 20% di 1.600 € è **320 €** al mese, cioè 3.840 € in un anno. Vediamo come si costruisce un piano così, e che cosa fare quando i conti non tornano.",
      lo=0, hi=800, step=10, truth=320, near=30),
    P('Un piano per i tuoi soldi', r'''
**Un budget è un piano: decidi prima dove andranno i soldi del mese, invece di scoprirlo alla fine.**

Un modo semplice per farlo è la regola **50/30/20**. Dividi le entrate in tre parti:

• il 50% ai **bisogni**: quello di cui non puoi fare a meno, come casa, bollette, cibo, trasporti per andare al lavoro;
• il 30% ai **desideri**: quello che rende la vita più piacevole ma che potresti ridurre, come cene fuori, viaggi, abbonamenti;
• il 20% al **risparmio**.

Con i 1.600 € di Giulia:

[fig]

Non è una legge. È un punto di partenza per vedere se il tuo mese è in equilibrio.''',
      fig=F([('Lo stipendio di Giulia', '1.600 €', [(800, 'Bisogni', CAP, '800 €'), (480, 'Desideri', 'giallo', '480 €'), (320, 'Risparmio', OK, '320 €')])])),
    BK('Bisogno o desiderio?', ['Bisogno', 'Desiderio'], [
      ('Affitto di casa', 0, 'Un tetto serve: è un bisogno.'),
      ('Bolletta della luce', 0, 'In casa non se ne può fare a meno: è un bisogno.'),
      ('Abbonamento a una piattaforma di film', 1, 'Fa piacere, ma se serve si può tagliare.'),
      ('Spesa al supermercato', 0, 'Mangiare è un bisogno. Il ristorante, invece, è un desiderio.'),
      ('Weekend al mare', 1, 'È un piacere: si può rimandare o ridurre.'),
      ('Abbonamento del treno per andare al lavoro', 0, 'Ti serve per guadagnare lo stipendio.'),
      ('Telefono nuovo, con il vecchio che funziona', 1, 'Finché il vecchio funziona, cambiarlo è una scelta.')],
      after='Il confine non è sempre netto: la spesa è un bisogno, ma nel carrello finiscono anche desideri. Conta essere onesti con sé stessi.'),
    P('Quando i conti non tornano', r'''
Nella realtà le tre parti raramente escono giuste al primo colpo. Il mese vero di Giulia è questo:

[fig]

I bisogni le prendono 950 € invece di 800, i desideri 600 € invece di 480. Per il risparmio restano 50 €.

Ha due strade, e può usarle insieme:

• ridurre i **desideri**, che è la via più veloce;
• ridurre i **bisogni**, che è più lenta ma dura nel tempo: una casa meno cara, una tariffa di luce o telefono più bassa.

C'è poi un trucco che funziona: mettere da parte il risparmio **appena arriva lo stipendio**, con un bonifico automatico, e vivere con quello che resta. Così il risparmio non dipende da quanto avanza a fine mese.''',
      fig=F([('Il mese vero di Giulia', '1.600 €', [(950, 'Bisogni', CAP, '950 €'), (600, 'Desideri', 'giallo', '600 €'), (50, 'Risparmio', OK, '50 €')])])),
    LV('Rimetti in equilibrio il mese', 'Giulia guadagna 1.600 € al mese. Muovi bisogni e desideri e guarda quanto resta da mettere da parte.', 'budget', dict(entrate=1600),
      [dict(id='bisogni', label='Bisogni', min=700, max=1100, step=10, start=950, unit='€'), dict(id='desideri', label='Desideri', min=100, max=700, step=10, start=600, unit='€')],
      [dict(label='Porta il risparmio ad almeno 320 € al mese', cond=[['risparmio', '>=', 320]], hint='Il modo più veloce è abbassare i desideri.'),
       dict(label='Ora arriva a 320 € lasciando ai desideri almeno 450 €', cond=[['risparmio', '>=', 320], ['desideri', '>=', 450]], hint='Se i desideri non scendono, devono scendere i bisogni: prova ad abbassarli.')],
      'Tagliare solo i desideri funziona, ma lascia poco spazio per vivere. Abbassare anche una spesa fissa, come affitto o tariffe, libera soldi ogni mese senza rinunce continue.'),
    N('Marco guadagna 2.200 € al mese e vuole seguire la regola 50/30/20. Quanto può destinare, al massimo, ai desideri?', 660, '€',
      r'Il 30% di 2.200 € è \(2.200 \times 0{,}30 =\) **660 €**. Ai bisogni vanno 1.100 € e al risparmio 440 €.'),
    Q('Guadagni 1.800 € al mese. Con la regola 50/30/20, quanto metti da parte?', ['180 €', '360 €', '540 €'], 1,
      r'Il 20% di 1.800 € è \(1.800 \times 0{,}20 =\) **360 €**. 540 € è il 30%, la parte dei desideri.'),
    Q('Perché conviene mettere da parte il risparmio appena arriva lo stipendio?', ['Perché così non dipende da quanto avanza a fine mese', 'Perché la banca paga più interessi', 'Perché le spese fisse diminuiscono'], 0,
      "Se aspetti la fine del mese risparmi solo quello che è avanzato, e spesso non avanza niente. Mettendolo da parte subito, il risparmio diventa la prima spesa del mese, non l'ultima."),
  ], 'Un budget decide prima dove vanno i soldi. Regola di partenza: 50% bisogni, 30% desideri, 20% risparmio, messo da parte per primo.'),

  LF('basi-7-3', 'SOS', 'Il fondo di emergenza', 6, [
    G('Paolo spende 1.400 € al mese e vuole mettere da parte una riserva che copra 3 mesi di spese, per gli imprevisti. Risparmia 150 € al mese. Quanti mesi gli servono per arrivarci?',
      r"Gli servono \(1.400 \times 3 = 4.200\) €. Con 150 € al mese: \(\dfrac{4.200}{150} =\) **28 mesi**, più di due anni. Sembra tanto, ma ogni mese che passa Paolo è un po' più al sicuro. Quella riserva ha un nome: fondo di emergenza.",
      lo=0, hi=60, step=1, truth=28, near=3, unit='mesi'),
    P('A che cosa serve', r'''
**Il fondo di emergenza è una somma tenuta da parte solo per gli imprevisti.**

Gli imprevisti non sono rari, sono solo difficili da prevedere: la caldaia che si rompe, l'auto dal meccanico, una spesa dal dentista, un periodo senza lavoro.

Senza un fondo hai due sole strade. Puoi chiedere un prestito, che costa interessi. Oppure puoi vendere in fretta quello che hai, magari nel momento sbagliato.

Con un fondo l'imprevisto resta un fastidio, non diventa un debito.

Per questo il **fondo di emergenza** viene prima degli investimenti: è quello che ti permette di lasciarli lavorare in pace.'''),
    P('Quanto deve essere grande', r'''
La misura non è una cifra uguale per tutti: dipende da quanto spendi.

La regola più usata è tenere da parte da **3 a 6 mesi di spese**. Di spese, non di stipendio: conta quanto ti serve per vivere.

Paolo spende 1.400 € al mese:

[fig]

Quando basta il minimo e quando serve di più?

• Verso i **3 mesi** se hai un lavoro stabile e nessuno che dipende da te.
• Verso i **6 mesi**, o anche di più, se il tuo reddito è irregolare, se lavori in proprio o se hai una famiglia a carico.''',
      fig=F([('3 mesi di spese', '4.200 €', [(4200, 'Fondo minimo', OK)]), ('6 mesi di spese', '8.400 €', [(8400, 'Fondo più prudente', CAP)])])),
    N('Chiara spende 1.650 € al mese e vuole un fondo di emergenza che copra 4 mesi. Quanto deve mettere da parte?', 6600, '€',
      r'\(1.650 \times 4 =\) **6.600 €**.'),
    P('Dove tenerlo', r'''
Il fondo di emergenza ha un solo compito: esserci quando serve. Deve avere due qualità.

• Deve essere **liquido**: lo devi poter usare in pochi giorni, senza penali.
• Deve essere **stabile**: non deve poter scendere di valore proprio quando ti serve.

Per questo non va in azioni, che possono perdere molto in pochi mesi, e nemmeno in un investimento vincolato che non puoi toccare.

Sta bene su un conto corrente separato da quello di tutti i giorni, oppure su un **conto deposito** da cui puoi ritirare i soldi quando vuoi.

Renderà poco, ed è giusto così: non è lì per guadagnare, è lì per proteggerti. E dopo averlo usato, la prima cosa da fare è ricostruirlo.'''),
    BK('È una spesa da fondo di emergenza?', ['Sì, è un imprevisto', 'No, si può programmare'], [
      ("L'auto si rompe e ti serve per lavorare", 0, 'È improvvisa e non si può rimandare: è proprio il caso del fondo.'),
      ('Le vacanze estive', 1, "Sai già che arrivano: si mettono da parte un po' al mese."),
      ('Una cura dal dentista che non può aspettare', 0, 'È urgente e non era prevista.'),
      ('I regali di Natale', 1, 'Natale arriva ogni anno alla stessa data: non è un imprevisto.'),
      ('Due mesi senza stipendio', 0, 'È il caso più importante: il fondo paga le spese finché il reddito non torna.'),
      ('Il telefono nuovo appena uscito', 1, 'È un desiderio: si compra con i soldi dei desideri, non con il fondo.'),
      ("L'assicurazione dell'auto, che scade ogni anno", 1, 'È una spesa che conosci già: va messa nel budget.')],
      after='Il fondo serve per quello che è insieme urgente, necessario e imprevisto. Le spese che conosci già vanno nel budget.'),
    Q('Dario spende 1.200 € al mese, ha un lavoro stabile e nessuno a carico. Qual è una misura ragionevole per il suo fondo di emergenza?', ['1.200 €', '3.600 €', '36.000 €'], 1,
      r'Con un lavoro stabile può bastare il minimo della regola: 3 mesi di spese, cioè \(1.200 \times 3 =\) **3.600 €**. Un solo mese è poco. 36.000 € sono due anni e mezzo di spese: troppi soldi fermi.'),
    Q('Dove ha più senso tenere il fondo di emergenza?', ['In azioni, così cresce', 'In un investimento vincolato per 5 anni', 'Su un conto da cui puoi ritirare subito'], 2,
      'Deve essere liquido e stabile: un conto da cui ritiri quando vuoi. Le azioni possono scendere proprio quando ti servono i soldi, e un vincolo di 5 anni te li blocca.'),
  ], 'Fondo di emergenza: da 3 a 6 mesi di spese, su un conto liquido e stabile. Viene prima degli investimenti.'),

  LF('basi-7-4', 'META', 'Un obiettivo, una cifra, una data', 7, [
    G("Elena vuole comprare un'auto usata tra 2 anni: le servono 6.000 €. Parte da zero e tiene i soldi su un conto che non rende nulla. Quanto deve mettere da parte ogni mese?",
      r'6.000 € in 24 mesi: \(\dfrac{6.000}{24} =\) **250 €** al mese. Un obiettivo diventa un piano quando ha una cifra e una data.',
      lo=0, hi=600, step=10, truth=250, near=20),
    P('Dal desiderio al piano', r'''
**Un obiettivo vago resta un desiderio. Con una cifra e una data diventa un piano.**

«Vorrei mettere via qualcosa per l'auto» non ti dice che cosa fare domani. «Mi servono 6.000 € tra 24 mesi» sì: basta una divisione.

$$\text{risparmio al mese} = \frac{\text{cifra}}{\text{mesi}}$$

Per Elena: \(\dfrac{6.000}{24} =\) **250 €** al mese.

[fig]

Se 250 € al mese sono troppi, le leve sono solo tre: una cifra più bassa, una data più lontana, oppure un budget rivisto per liberare più soldi ogni mese.''',
      fig=F([('Il piano di Elena', '6.000 €', [(3000, 'Primo anno', OK, '3.000 €'), (3000, 'Secondo anno', CAP, '3.000 €')])], cap='250 € al mese per 24 mesi.')),
    LV("Sposta la data o la cifra", "A Elena servono 6.000 € per l'auto. Muovi quanto mette da parte ogni mese e per quanti mesi.", 'obiettivo', dict(cifra=6000),
      [dict(id='rata', label='Risparmio al mese', min=50, max=500, step=10, start=100, unit='€'), dict(id='mesi', label='Durata', min=6, max=48, step=1, start=12, unit='mesi')],
      [dict(label='Arriva ai 6.000 € che servono', cond=[['messo', '>=', 6000]], hint='Puoi alzare il risparmio al mese, allungare la durata, o tutte e due le cose.'),
       dict(label='Ora arrivaci mettendo da parte al massimo 150 € al mese', cond=[['messo', '>=', 6000], ['rata', '<=', 150]], hint='Con 150 € al mese serve più tempo: allunga la durata.')],
      "Con 150 € al mese servono 40 mesi invece di 24. Meno metti da parte ogni mese, più si allontana la data: decidere quale delle due cose conta di più tocca a te."),
    N('Vuoi fare un viaggio tra 10 mesi e ti servono 1.800 €. Quanto devi mettere da parte ogni mese?', 180, '€',
      r'\(\dfrac{1.800}{10} =\) **180 €** al mese.'),
    P('Obiettivi vicini e obiettivi lontani', r'''
Non tutti gli obiettivi si trattano allo stesso modo. Conta quanto tempo manca.

• **Entro 2 o 3 anni**, come un'auto o un viaggio: i soldi devono restare al sicuro, su un conto. Non c'è tempo per recuperare un calo.
• **Tra molti anni**, come la pensione: i soldi si possono investire, perché il tempo lavora per te.

Sui tempi lunghi una parte della cifra finale non la versi tu: la producono i rendimenti, grazie all'interesse composto.

Ecco 250 € al mese per 20 anni, investiti al 4% l'anno. Ipotesi: rendimento costante, versamenti a fine mese.

[fig]

Hai versato 60.000 €, ma ti ritrovi con circa 91.000 €. Nella realtà il rendimento cambia ogni anno, e può anche essere negativo: per questo si investono solo i soldi che non servono presto.''',
      fig=F([('Dopo 20 anni', '90.960 €', [(60000, 'Versato da te', OK, '60.000 €'), (30960, 'Rendimenti', CAP, '30.960 €')])])),
    M(('Entrate', 'I soldi che ti arrivano in un mese'), ('Saldo', 'Entrate meno uscite'), ('Budget', 'Il piano di come userai i soldi'), ('Fondo di emergenza', 'I soldi tenuti da parte per gli imprevisti')),
    Q('Ti servono 3.000 € tra 15 mesi. Quanto devi mettere da parte ogni mese, senza contare interessi?', ['150 €', '200 €', '250 €'], 1,
      r'\(\dfrac{3.000}{15} =\) **200 €** al mese.'),
    Q("Hai due obiettivi: un'auto tra 18 mesi e la pensione tra 30 anni. Quali soldi ha senso investire in strumenti che oscillano?", ["Quelli per l'auto", 'Tutti e due allo stesso modo', 'Quelli per la pensione'], 2,
      "Con 30 anni davanti c'è il tempo di recuperare i cali e di far lavorare l'interesse composto. I soldi per l'auto servono tra 18 mesi: devono restare al sicuro."),
  ], 'Un obiettivo ha una cifra e una data: cifra diviso mesi dà il risparmio al mese. Vicino: soldi al sicuro. Lontano: si può investire.'),
])

U8 = dict(id='basi-u8', sid='basi-protezione', name='Proteggersi', lessons=[
  LF('basi-8-1', 'AS', "Come funziona un'assicurazione", 6, [
    G("In un paese ci sono 1.000 famiglie. Ogni anno, in media, 2 case subiscono un incendio che fa 100.000 € di danni. Se tutte le famiglie si dividono il costo dei danni, quanto paga ciascuna in un anno?",
      r"I danni dell'anno sono \(2 \times 100.000 = 200.000\) €. Divisi per 1.000 famiglie fanno **200 €** a testa. Con 200 € l'anno nessuno rischia più di perderne 100.000: è l'idea che sta dietro a ogni assicurazione.",
      lo=0, hi=1000, step=10, truth=200, near=30),
    P('Tanti pagano poco, pochi ricevono molto', r'''
**Assicurarsi vuol dire pagare una cifra piccola e certa per non rischiare una perdita grande e incerta.**

Un incendio in casa è raro, ma se capita a te costa una cifra che da solo non riusciresti a pagare. Nessuno sa a chi toccherà. Si sa però, con buona precisione, quanti saranno in tutto: su 1.000 case, circa 2 l'anno.

Una compagnia di **assicurazione** raccoglie da tutti una cifra ogni anno, il **premio**, e con quei soldi paga i danni di chi è stato colpito. La somma che riceve chi ha subito il danno si chiama **indennizzo**.

[fig]

Il premio è più alto della semplice divisione dei danni, perché la compagnia deve coprire i suoi costi e avere un guadagno.''',
      fig=F([('Il premio di ogni famiglia', '260 €', [(200, 'Danni attesi', CAP, '200 €'), (60, 'Costi e guadagno della compagnia', INT, '60 €')])], cap='Un esempio: le cifre vere cambiano da una polizza all\'altra.')),
    P('Il contratto si chiama polizza', r'''
Il contratto che firmi con la compagnia si chiama **polizza**. Dentro c'è scritto:

• che cosa è coperto: per esempio incendio e allagamento, ma non il furto;
• quanto paghi: il premio, di solito una volta l'anno;
• quanto ricevi al massimo se succede il danno;
• che cosa resta fuori, cioè le **esclusioni**: i casi in cui la compagnia non paga.

Le esclusioni sono la parte da leggere con più attenzione. Una polizza può costare poco anche perché copre poco.

Se l'anno passa senza danni, il premio non torna indietro. Non sono soldi buttati: hai comprato un anno di protezione, e con il tuo premio la compagnia ha pagato chi il danno lo ha avuto.'''),
    N("Un'assicurazione copre 5.000 auto. Ogni anno, in media, 100 di queste hanno un incidente che fa 3.000 € di danni. Quanto dovrebbe pagare ogni auto, solo per coprire i danni?", 60, '€',
      r"Danni dell'anno: \(100 \times 3.000 = 300.000\) €. Divisi per 5.000 auto: \(\dfrac{300.000}{5.000} =\) **60 €**. Il premio vero sarà più alto, perché comprende i costi e il guadagno della compagnia."),
    M(('Premio', 'Quello che paghi alla compagnia'), ('Indennizzo', 'Quello che ricevi se subisci il danno'), ('Polizza', 'Il contratto di assicurazione'), ('Esclusioni', 'I casi in cui la compagnia non paga')),
    Q("Paghi 300 € di premio per assicurare la casa e durante l'anno non succede nulla. Che fine fanno i 300 €?", ['Ti vengono restituiti', "Valgono come premio dell'anno dopo", "Restano alla compagnia: hai pagato un anno di protezione"], 2,
      "Il premio paga la protezione dell'anno, che tu abbia un danno oppure no. Con i premi di chi non ha avuto danni la compagnia paga chi li ha avuti."),
    Q("Perché il premio è più alto della media dei danni divisa tra gli assicurati?", ['Perché comprende i costi e il guadagno della compagnia', 'Perché i danni sono sempre più del previsto', 'Perché lo decide lo Stato'], 0,
      "Oltre a pagare i danni, la compagnia ha uffici, personale e un guadagno da ottenere. Nell'esempio della lezione: 200 € di danni attesi più 60 € di costi e guadagno."),
  ], "Con l'assicurazione tanti pagano un premio piccolo e certo, e chi subisce il danno riceve l'indennizzo. Leggi sempre che cosa è escluso."),

  LF('basi-8-2', 'FR', 'Franchigia e massimale', 7, [
    G("Anna ha assicurato la casa. Nel contratto c'è scritto che i primi 500 € di ogni danno li paga lei. Un tubo si rompe e l'acqua fa 3.000 € di danni. Quanto le rimborsa l'assicurazione?",
      r"I primi 500 € restano a carico di Anna: l'assicurazione paga \(3.000 - 500 =\) **2.500 €**. Quella parte a carico tuo si chiama franchigia. Insieme al massimale, che vediamo tra poco, decide quanto vale davvero una polizza.",
      lo=0, hi=3000, step=50, truth=2500, near=100),
    P('La parte che paghi tu', r'''
**Quasi nessuna polizza paga tutto il danno: una parte resta a te.**

La **franchigia** è una cifra fissa che resta a carico tuo a ogni danno. Con una franchigia di 500 €:

[fig]

A che cosa serve? Toglie di mezzo i danni piccoli, che alla compagnia costerebbero più tempo che soldi. In cambio il premio scende: più alta è la franchigia, meno costa la polizza.

A volte al posto della franchigia c'è lo **scoperto**: funziona allo stesso modo, ma è una percentuale del danno invece di una cifra fissa.''',
      fig=F([('Danno di 3.000 €', None, [(500, 'Franchigia: paghi tu', INT, '500 €'), (2500, "Paga l'assicurazione", CAP, '2.500 €')]),
             ('Danno di 400 €', None, [(400, 'Più piccolo della franchigia: paghi tutto tu', INT, '400 €')])])),
    N('Polizza con franchigia di 250 €. Hai un danno di 1.900 €. Quanto ti rimborsa la compagnia?', 1650, '€',
      r'\(1.900 - 250 =\) **1.650 €**. I primi 250 € restano a carico tuo.'),
    P('Il tetto: il massimale', r'''
All'altro estremo c'è il **massimale**: la cifra più alta che la compagnia paga, qualunque sia il danno.

La polizza di Anna ha un massimale di 50.000 €. Se un incendio facesse 80.000 € di danni, la compagnia si fermerebbe a 50.000.

[fig]

Per questo il massimale va scelto guardando al danno peggiore che può capitare, non a quello più probabile. Una polizza con un massimale basso costa meno, ma ti lascia scoperto proprio nel caso per cui ti eri assicurato.

In breve: i danni piccoli li paghi tu per via della franchigia. Di quelli enormi paghi tu la parte che supera il massimale. In mezzo paga la compagnia.''',
      fig=F([('Incendio da 80.000 €', None, [(50000, "Paga l'assicurazione, fino al massimale", CAP, '50.000 €'), (30000, 'Resta a te', INT, '30.000 €')])])),
    N('Polizza con massimale di 100.000 € e nessuna franchigia. Il danno è di 130.000 €. Quanto resta a carico tuo?', 30000, '€',
      r'La compagnia paga fino al massimale: 100.000 €. A te restano \(130.000 - 100.000 =\) **30.000 €**.'),
    BK('Franchigia 500 €, massimale 50.000 €: chi paga?', ['Paghi tu', "Paga l'assicurazione"], [
      ('Un danno di 300 €', 0, 'È più piccolo della franchigia: resta tutto a te.'),
      ('I primi 500 € di un danno di 4.000 €', 0, 'È la franchigia.'),
      ('Gli altri 3.500 € di quel danno', 1, 'Tolta la franchigia, il resto lo paga la compagnia.'),
      ('La parte oltre i 50.000 € di un danno enorme', 0, 'Oltre il massimale la compagnia non paga.'),
      ('Un danno di 20.000 €, tolta la franchigia', 1, 'Sta tra la franchigia e il massimale: paga la compagnia.')]),
    Q('A parità di tutto il resto, che cosa succede al premio se scegli una franchigia più alta?', ['Scende', 'Sale', 'Non cambia'], 0,
      'Con una franchigia più alta ti fai carico di una parte più grande dei danni. La compagnia rischia meno e chiede un premio più **basso**.'),
    Q('Hai una polizza con franchigia di 1.000 € e subisci un danno di 800 €. Quanto ricevi?', ['800 €', '200 €', 'Niente'], 2,
      'Il danno è più piccolo della franchigia: resta tutto a carico tuo. La compagnia comincia a pagare solo sopra i 1.000 €.'),
  ], 'Franchigia: la parte di ogni danno che paghi tu. Massimale: il tetto oltre cui la compagnia non paga. Insieme dicono quanto vale una polizza.'),

  LF('basi-8-3', 'RC', 'Che cosa assicurare davvero', 6, [
    G("Hai 400 € l'anno da spendere in assicurazioni. Quale di questi rischi ha più senso coprire per primo?",
      "Si assicura prima quello che ti rovinerebbe, non quello che ti darebbe solo fastidio. Uno schermo rotto si paga con il fondo di emergenza. Un danno grave fatto a un'altra persona può costare più di quanto guadagni in molti anni.",
      options=['Lo schermo del telefono che si rompe', "Un danno grave fatto a un'altra persona", 'Il ritardo di un volo'], ans=1),
    P('Grande e raro, piccolo e frequente', r'''
**La domanda giusta non è quanto è probabile, ma: che cosa succede a me se capita?**

Ogni rischio sta in una di queste due caselle.

• **Danni piccoli**, anche se frequenti: il telefono rotto, la lavatrice da cambiare, una multa. Danno fastidio, ma li puoi pagare con il budget o con il fondo di emergenza. Assicurarli conviene poco: in media i premi che paghi superano i rimborsi che ricevi, e quel danno potevi sostenerlo da solo.
• **Danni grandi**, anche se rari: la casa distrutta, un danno grave fatto a un'altra persona, una malattia che ti impedisce a lungo di lavorare. Da solo non li puoi pagare. È per questi che l'assicurazione esiste.

[fig]

Fondo di emergenza e assicurazione lavorano insieme: il primo copre i danni piccoli, la seconda quelli che il fondo non potrebbe mai coprire.''',
      fig=F([('Schermo del telefono', '200 €', [(200, 'Lo copre il fondo di emergenza', OK)]), ("Danno grave a un'altra persona", '300.000 €', [(300000, "Serve un'assicurazione", CAP)])],
            cap='Cifre di esempio. La barra corta è già più lunga del vero: in scala non si vedrebbe.')),
    P('I danni fatti agli altri', r'''
C'è un rischio che molti dimenticano: fare un danno a qualcun altro.

Se per colpa tua una persona si fa male o una cosa si rompe, la legge ti obbliga a risarcire. Questo obbligo si chiama **responsabilità civile**, e l'assicurazione che lo copre si indica spesso con la sigla RC.

Per chi guida è così importante che la legge la rende obbligatoria: senza la **RC auto** non puoi circolare. Un incidente grave può costare centinaia di migliaia di euro, e senza polizza dovresti pagarli tu.

Esiste anche fuori dall'auto. Una polizza di responsabilità civile per la vita di tutti i giorni copre, per esempio, il vaso che cade dal tuo balcone o il danno fatto andando in bicicletta. Di solito costa poco, perché sono casi rari, ma copre cifre molto alte.'''),
    BK('Assicurazione o fondo di emergenza?', ['Assicurazione', 'Fondo di emergenza'], [
      ("L'incendio della casa", 0, 'È un danno enorme, che da solo non potresti pagare.'),
      ('La lavatrice da sostituire', 1, 'Costa qualche centinaio di euro: è il lavoro del fondo di emergenza.'),
      ("Un danno grave fatto a un'altra persona", 0, 'Può costare cifre altissime: serve la responsabilità civile.'),
      ('Lo schermo del telefono rotto', 1, 'È una spesa piccola: si paga con i soldi da parte.'),
      ('Una malattia che ti impedisce di lavorare per anni', 0, 'Perdere il reddito a lungo è uno dei rischi più grandi.'),
      ('Una gomma bucata', 1, 'È un fastidio da poche decine di euro.')]),
    OR('Che cosa viene prima?', ['Le assicurazioni obbligatorie per legge', 'I rischi che ti rovinerebbero', 'I danni piccoli, se proprio vuoi'],
      x='Tocca le voci dalla più importante alla meno importante.',
      after='Prima quello che la legge impone, poi quello che non potresti mai pagare da solo. I danni piccoli vengono per ultimi, e spesso conviene lasciarli al fondo di emergenza.'),
    Q('Quale rischio ha più senso assicurare?', ['Un danno raro ma enorme', 'Un danno frequente ma piccolo', 'Un danno piccolo e raro'], 0,
      "L'assicurazione serve per le perdite che da solo non potresti sostenere. I danni piccoli si pagano con il fondo di emergenza."),
    Q('Perché di solito non conviene assicurare un oggetto da 150 €?', ['Perché quella perdita la puoi sostenere da solo, e in media i premi superano i rimborsi', 'Perché è vietato', 'Perché le compagnie non pagano mai'], 0,
      'Una perdita da 150 € dà fastidio ma non ti mette in difficoltà. E siccome il premio comprende costi e guadagno della compagnia, in media paghi più di quanto ricevi.'),
  ], 'Si assicura quello che ti rovinerebbe, non quello che ti dà fastidio. I danni piccoli li copre il fondo di emergenza.'),

  LF('basi-8-4', '!!', 'Riconoscere una truffa', 7, [
    G('Ti propongono un investimento che rende il 10% al mese, garantito. Se fosse vero, 1.000 € dopo 5 anni quanto sarebbero diventati?',
      r'Il 10% al mese per 60 mesi fa \(1.000 \times 1{,}10^{60}\), cioè circa **304.000 €**. Nessuna attività vera cresce così, e se esistesse non avrebbe bisogno dei tuoi soldi. Un rendimento così alto, e per di più garantito, è il primo segnale di una truffa.',
      options=['Circa 6.000 €', 'Circa 60.000 €', 'Più di 300.000 €'], ans=2),
    P('Alto e garantito non stanno insieme', r'''
**Chi ti promette guadagni alti e sicuri ti sta nascondendo qualcosa.**

Rendimento e rischio vanno insieme. Un conto deposito paga pochi punti l'anno proprio perché il rischio è basso. Per guadagnare di più bisogna accettare che le cose possano andare male.

Per questo due parole non stanno mai insieme: **alto** e **garantito**.

[fig]

Chi offre il 10% al mese sta offrendo, in un mese solo, più del triplo di quello che un investimento prudente rende in un anno intero. Se fosse vero, le banche farebbero la fila per prestargli soldi a molto meno.''',
      fig=F([('Un conto deposito, in un anno', '3%', [(3, 'Rendimento', OK)]), ('La proposta, in un mese', '10%', [(10, 'Rendimento promesso', 'rosa')])], cap='Il 3% è un esempio: un conto deposito rende pochi punti l\'anno.')),
    P('Come funziona uno schema Ponzi', r'''
La truffa più diffusa ha un nome: **schema Ponzi**. Non c'è nessun investimento. I guadagni pagati ai primi arrivati sono i soldi versati dagli ultimi.

Ecco come gira, con il 10% al mese promesso.

• 100 persone versano 1.000 € a testa. In cassa ci sono 100.000 €.
• Ogni mese il truffatore paga il 10%, cioè 10.000 €. Li prende dalla cassa.
• I primi incassano puntuali, si fidano e portano amici. I soldi nuovi coprono i pagamenti.
• Quando i nuovi arrivi rallentano, la cassa si svuota. I pagamenti si fermano e il capitale non c'è più.

[fig]

Chi entra per primo a volte guadagna davvero, ed è questo che rende lo schema credibile. Ma i soldi che incassa sono quelli persi da chi è arrivato dopo.''',
      fig=F([('Versati da 100 persone', '100.000 €', [(100000, 'Soldi in cassa', CAP)]), ('Pagati come guadagni in 10 mesi', '100.000 €', [(100000, 'Gli stessi soldi, restituiti a pezzi', INT)])],
            cap='Senza nuovi arrivi la cassa dura 10 mesi. Poi non resta nulla.')),
    N('Uno schema promette il 5% al mese. Hanno aderito 200 persone, con 2.000 € a testa. Quanto deve pagare ogni mese il truffatore per mantenere la promessa?', 20000, '€',
      r'In cassa ci sono \(200 \times 2.000 = 400.000\) €. Il 5% di 400.000 € è **20.000 €** al mese. Nessun investimento li produce: escono dalla cassa, cioè dai soldi di chi ha versato.'),
    P('I segnali da riconoscere', r'''
Le truffe cambiano forma, ma i segnali sono quasi sempre gli stessi.

• **Rendimenti alti e garantiti**: è il segnale più chiaro.
• **Fretta**: l'offerta scade oggi, i posti stanno finendo. Serve a non farti ragionare.
• **Poca chiarezza**: non si capisce da dove vengono i guadagni, e le domande ricevono risposte vaghe.
• **Premi se porti amici**: i soldi nuovi servono a pagare quelli vecchi.
• **Nessuna autorizzazione**: per raccogliere risparmi serve un'autorizzazione. In Italia gli elenchi di chi è autorizzato sono pubblici, sui siti di Consob e Banca d'Italia.

Prima di versare un euro fai tre cose: controlla quegli elenchi, chiedi tutto per iscritto e prenditi qualche giorno. Un'offerta seria tra una settimana c'è ancora.'''),
    BK('Segnale di allarme o cosa normale?', ['Segnale di allarme', 'Cosa normale'], [
      ('Rendimento garantito del 5% al mese', 0, 'Alto e garantito insieme non esiste.'),
      ('Ti dicono che il valore può anche scendere', 1, 'È quello che un operatore serio deve dirti: ogni investimento ha un rischio.'),
      ("L'offerta vale solo se firmi oggi", 0, 'La fretta serve a non farti ragionare.'),
      ('Ti consegnano un documento con costi e rischi', 1, 'Mettere tutto per iscritto è un segno di serietà.'),
      ('Guadagni di più se porti altri investitori', 0, 'È il meccanismo che tiene in piedi uno schema Ponzi.'),
      ("Chi propone è nell'elenco degli operatori autorizzati", 1, 'È il primo controllo da fare, e qui è andato bene.'),
      ('Non ti spiegano da dove arrivano i guadagni', 0, 'Se non capisci come si guadagna, non investire.')]),
    Q('In uno schema Ponzi, da dove arrivano i guadagni pagati ai primi investitori?', ['Dai soldi versati da chi entra dopo', 'Dai profitti di un investimento vero', 'Dalla banca centrale'], 0,
      'Non esiste nessun investimento: i guadagni dei primi sono i **soldi versati dagli ultimi**. Per questo lo schema regge solo finché continuano ad arrivare persone nuove.'),
    Q('Un conoscente ti propone un investimento sicuro al 4% al mese e ti chiede di decidere entro stasera. Che cosa fai?', ['Verso subito, prima che finiscano i posti', 'Verso solo una piccola cifra, per provare', 'Non verso nulla e controllo se chi propone è autorizzato'], 2,
      'Rendimento alto, garanzia e fretta sono tre segnali di allarme insieme. Anche una cifra piccola rischia di andare persa, e i primi pagamenti puntuali servono proprio a farti versare di più.'),
  ], 'Rendimento alto e garantito non esiste. Diffida della fretta, chiedi da dove vengono i guadagni e controlla che chi propone sia autorizzato.'),

  LF('basi-8-5', 'SMS', "Phishing e furto d'identità", 7, [
    G('Ti arriva un SMS nella stessa conversazione in cui la tua banca ti manda i codici: «Accesso anomalo al conto. Verifica subito da questo link». Che cosa ne pensi?',
      "Il nome del mittente di un SMS e il numero di chi ti chiama si possono falsificare: si chiama **spoofing**. Per questo un messaggio falso può comparire nella stessa conversazione di quelli veri. Dal 2025 gli operatori italiani bloccano molte chiamate dall'estero che mostrano un numero italiano falso, ma il trucco non è sparito. Il mittente, da solo, non prova mai chi sta scrivendo.",
      options=['È vero: è nella conversazione della banca', 'Può essere falso: il mittente si può copiare', 'Per capirlo basta aprire il link'], ans=1),
    P('Tre canali, lo stesso trucco', r'''
**Chi ti truffa non forza la porta: ti convince ad aprirla.**

• **Phishing**: una mail che imita la banca, le Poste, un corriere, un ente pubblico.
• **Smishing**: lo stesso messaggio, via SMS o chat.
• **Vishing**: una telefonata. Spesso arriva subito dopo il messaggio: un finto operatore, gentile e preparato, che ti guida passo passo.

Lo schema è sempre uguale: un problema urgente (il conto bloccato, il pacco fermo, un rimborso in arrivo), un link da aprire o un numero da chiamare, e alla fine la richiesta di dati o di codici.

Tre regole bastano quasi sempre.

• La banca non chiede mai password, PIN o codici: né per mail, né per SMS, né al telefono.
• Non entrare dal link. Apri tu l'app, oppure scrivi tu l'indirizzo.
• Se ti chiamano, riattacca e richiama tu, al numero scritto sulla carta o sul sito.'''),
    BK('Trappola o cosa normale?', ['Trappola', 'Cosa normale'], [
      ('SMS: conto sospeso, accedi da questo link', 0, 'Urgenza più link: è lo schema classico.'),
      ("L'app ti chiede l'impronta per un pagamento che stai facendo tu", 1, "È l'autenticazione forte, e il pagamento lo hai avviato tu."),
      ('Un operatore ti chiede il codice arrivato per SMS', 0, 'I codici servono ad autorizzare, mai a bloccare. Nessun operatore vero li chiede.'),
      ('Mail del corriere: paga 1,99 € per sbloccare il pacco', 0, 'La cifra piccola serve a farti inserire i dati della carta.'),
      ("Notifica dell'app per un accesso che hai appena fatto tu", 1, 'È un avviso di sicurezza, e corrisponde a quello che stavi facendo.'),
      ('Ti dicono di spostare i soldi su un conto sicuro', 0, 'Il conto sicuro è quello del truffatore. Nessuna banca lo chiede.')]),
    P('Quando rubano il tuo nome', r'''
**Ai truffatori non servono solo i tuoi soldi: servono anche i tuoi dati.**

Con la foto di un documento, il codice fiscale e una busta paga falsa, qualcuno può chiedere un prestito a nome tuo. Lui incassa. Le rate non pagate restano registrate sul tuo nome.

Si chiama **furto d'identità**. In Italia nel 2025 i casi scoperti sono stati più di 38.000, per oltre 165 milioni di euro: in media 4.300 € l'uno.

Spesso lo scopri tardi: da una lettera di sollecito, o da un finanziamento che ti viene rifiutato senza motivo.

Come si riduce il rischio:

• non mandare foto dei documenti a chi non conosci, nemmeno per un annuncio di affitto o di vendita;
• proteggi la casella di posta con una password solo sua e con il doppio codice: chi entra lì può rifare le password di tutto il resto;
• ogni tanto guarda che cosa risulta a tuo nome nelle banche dati del credito: chiederlo è gratis.'''),
    OR('Hanno usato i tuoi dati: in che ordine ti muovi?', ["Blocchi carte e accessi, dall'app o dal numero verde", 'Cambi le password, a partire dalla mail', 'Fai denuncia alla Polizia Postale', 'Mandi la denuncia a banca e finanziarie'],
      x="Tocca le mosse dalla prima all'ultima.",
      after='Prima fermi il danno, poi lo documenti. Con la denuncia in mano contesti per iscritto i pagamenti e i prestiti che non hai chiesto, e fai correggere le segnalazioni a tuo nome nelle banche dati del credito.'),
    Q('Ricevi una mail dalla tua banca con un link per aggiornare i dati. Qual è il modo sicuro per controllare?', ['Aprire il link e vedere se il sito sembra vero', "Aprire tu l'app della banca, senza passare dal link", 'Rispondere alla mail e chiedere conferma'], 1,
      "Un sito falso può essere identico a quello vero, e alla mail risponde chi l'ha mandata. L'unico controllo sicuro è entrare da soli, dall'app o scrivendo l'indirizzo."),
    Q('Perché la casella di posta va protetta più di ogni altro servizio?', ['Perché da lì si possono rifare le password di quasi tutto', 'Perché è la più difficile da riaprire', 'Perché contiene la pubblicità'], 0,
      'Quasi ogni servizio ti fa cambiare la password con un link mandato per mail. Chi controlla la tua posta può entrare, uno alla volta, in tutti gli altri.'),
    Q('Una finanziaria ti sollecita le rate di un prestito che non hai mai chiesto. Che cosa fai?', ['Paghi, per evitare segnalazioni', 'Ignori la lettera', 'Fai denuncia e contesti il prestito per iscritto'], 2,
      'Pagare vorrebbe dire riconoscere un debito non tuo, e ignorare la lettera lascia crescere il problema. Con la denuncia contesti il prestito e chiedi di cancellare le segnalazioni a tuo nome.'),
  ], 'Il mittente si può falsificare: non entrare mai da un link e non dare codici a nessuno. Proteggi documenti e posta. Se usano i tuoi dati: blocca, cambia le password, denuncia, contesta.'),

  LF('basi-8-6', 'VITA', 'Polizze vita: protezione o investimento?', 7, [
    G('Marco ha 35 anni, due figli e un mutuo. Vuole che la famiglia riceva 200.000 € se lui muore nei prossimi 20 anni. Quanto costa, ogni anno, una polizza che fa solo questo?',
      "Una polizza **temporanea caso morte** costa di solito tra 200 e 800 € l'anno per capitali tra 100.000 e 300.000 €, secondo l'età e la salute. Costa poco perché paga solo se il fatto succede, e a 35 anni è raro. Se alla scadenza Marco è vivo non riceve nulla: ha comprato protezione, non un investimento.",
      options=['Qualche centinaio di euro', 'Circa 2.000 €', 'Circa 6.000 €'], ans=0),
    P('Due prodotti con lo stesso nome', r'''
**Con il nome polizza vita si vendono due prodotti molto diversi: uno protegge, l'altro investe.**

• La **polizza di protezione** è la temporanea caso morte. Paghi un premio ogni anno e, se muori entro la durata scelta, le persone che hai indicato ricevono il capitale. Se alla scadenza sei vivo, non ricevi nulla.
• La **polizza di investimento**: versi dei soldi, la compagnia li investe e più avanti ti restituisce un capitale. Può essere una **polizza rivalutabile**, legata a una gestione prudente della compagnia, oppure una **unit-linked**, legata a fondi: lì il valore sale e scende, e il rischio è tuo.

Molte polizze mescolano le due cose. Per questo, prima di firmare, la domanda è una: mi serve proteggere qualcuno, o far crescere dei soldi?'''),
    P('A chi serve la protezione', r'''
La domanda da farsi è: **se domani il mio reddito sparisse, chi resterebbe in difficoltà?**

• Figli piccoli, un partner che guadagna meno, un mutuo da pagare: la protezione serve.
• Nessuno dipende dal tuo reddito: di norma non serve.

Quanto capitale? Un modo semplice: il debito che resta sul mutuo, più qualche anno di spese della famiglia.

Quattro cose da sapere.

• Il premio dipende da età, salute e fumo: più sei giovane, meno costa.
• Alle domande sulla salute si risponde con precisione: una risposta falsa può far saltare il pagamento.
• I premi danno una detrazione del 19%, calcolata su un massimo di 530 € l'anno.
• Il capitale pagato ai tuoi cari è esente da IRPEF e non entra nell'eredità: va a chi hai indicato tu.'''),
    N("Giulia e Paolo hanno un mutuo con 120.000 € di debito e spendono 24.000 € l'anno. Vogliono coprire il mutuo più tre anni di spese. Quale capitale assicurano?", 192000, '€',
      r'Tre anni di spese: \(24.000 \times 3 = 72.000\) €. Più il mutuo: \(120.000 + 72.000 =\) **192.000 €**.'),
    P('Quando la polizza è un investimento', r'''
Una polizza di investimento ha vantaggi veri: scegli tu a chi va il capitale, senza passare dall'eredità, e di norma quelle somme non si possono pignorare.

Ha anche un prezzo. Dentro ci sono i costi della compagnia, quelli dei fondi e spesso un **caricamento**, cioè una percentuale trattenuta su ogni versamento. Uno studio della Banca d'Italia ha misurato che una unit-linked costa in media tra 0,5 e 2,5 punti l'anno in più rispetto a comprare direttamente gli stessi fondi.

Sembra poco. Su 20 anni non lo è:

[fig]

Altre due cose da controllare.

• **Uscire presto costa**: nei primi anni quello che riprendi può essere meno di quello che hai versato.
• I costi stanno scritti nel **KID**, il documento di tre pagine al massimo che devi ricevere prima della firma.''',
      fig=F([('10.000 € al 4% per 20 anni', '21.911 €', [(21911, 'Senza costi in più', OK)]), ('Con 1,5 punti di costi in più', '16.386 €', [(16386, 'Quello che resta', CAP), (5525, 'Mangiato dai costi', INT, '5.525 €')])],
            cap="Un esempio con un rendimento fisso del 4% l'anno, prima delle imposte.")),
    BK('A chi serve una polizza caso morte?', ['Serve', 'Di norma no'], [
      ('Padre di due bambini, unico stipendio di casa', 0, 'Se lui manca, la famiglia resta senza reddito.'),
      ('Single di 25 anni, senza debiti e senza persone a carico', 1, 'Nessuno dipende dal suo reddito.'),
      ("Coppia con un mutuo di trent'anni appena acceso", 0, 'Chi resta dovrebbe pagare la rata da solo.'),
      ('Pensionata con figli adulti e indipendenti', 1, "I figli hanno il loro reddito: non c'è nessuno da proteggere."),
      ('Madre sola con un figlio di 6 anni', 0, 'Il figlio dipende del tutto da lei.')]),
    Q('Hai una temporanea caso morte di 20 anni. Alla scadenza sei vivo. Che cosa ricevi?', ['Il capitale assicurato', 'I premi che hai versato', "Niente: hai pagato vent'anni di protezione"], 2,
      "La temporanea caso morte paga solo se muori entro la durata. È come l'assicurazione sulla casa: se non succede nulla, il premio ha comprato la protezione di quegli anni."),
    Q('In una polizza unit-linked, chi sopporta il rischio che i fondi scendano?', ['La compagnia', 'Tu', 'Lo Stato'], 1,
      'In una unit-linked il capitale segue il valore dei fondi. Se scendono, scende quello che riprendi: la compagnia non garantisce il risultato, salvo quello che è scritto nel contratto.'),
    Q('Dove trovi i costi di una polizza di investimento, prima di firmare?', ['Nel KID', 'Nella pubblicità', 'Solo nel rendiconto, dopo il primo anno'], 0,
      'Il KID è il documento con le informazioni chiave: mostra i costi totali e quanto pesano sul rendimento, e va consegnato prima della firma.'),
  ], 'Polizza vita vuol dire due cose: protezione, che costa poco e serve se qualcuno dipende dal tuo reddito, e investimento, dove vanno controllati costi e penali di uscita nel KID.'),

  LF('basi-8-7', 'ABF', 'Reclami: a chi rivolgersi', 7, [
    G('Scrivi un reclamo alla tua banca per una spesa che ritieni sbagliata. Entro quanti giorni deve risponderti?',
      "**60 giorni**, che scendono a 15 giorni lavorativi se il reclamo riguarda un pagamento. Un'assicurazione ne ha 45. Il reclamo scritto è sempre il primo passo: senza, nessun arbitro ti ascolta. E il termine conta: quando è scaduto, o se la risposta non ti convince, puoi salire di un gradino.",
      lo=0, hi=180, step=5, truth=60, near=10, unit='giorni'),
    P('Prima il reclamo, sempre', r'''
**Protestare al telefono non lascia traccia. Quello che conta è il reclamo scritto.**

Un **reclamo** che funziona dice quattro cose:

• chi sei, e quale conto o contratto riguarda;
• che cosa è successo, con le date;
• che cosa chiedi: una cifra, una correzione, una risposta;
• quali documenti lo provano, allegati.

Mandalo all'ufficio reclami con la PEC, con una raccomandata o dal modulo del sito, e conserva la ricevuta: da quel giorno parte il tempo per rispondere.

| Chi riceve il reclamo | Risponde entro |
|---|---|
| Banca o finanziaria | 60 giorni |
| Banca, per un pagamento | 15 giorni lavorativi |
| Assicurazione | 45 giorni |
| Chi ti ha venduto un investimento | 60 giorni |'''),
    P('Se la risposta non arriva, o non ti convince', r'''
Il gradino successivo è un arbitro: un organismo indipendente che decide sulle carte, senza udienze e senza avvocato. Ce n'è uno per ogni settore.

| Problema con | Arbitro | Costo |
|---|---|---|
| conto, carta, prestito, mutuo | ABF | 20 € |
| investimenti e consulenza | ACF | gratis |
| polizze | Assicurativo | 20 € |

L'**ABF** lavora presso la Banca d'Italia, l'**ACF** presso la Consob, l'**Arbitro Assicurativo** presso l'IVASS. Il ricorso si fa online, e i 20 € tornano indietro se ti danno ragione.

Tre limiti da conoscere.

• Hai 12 mesi dal reclamo per fare ricorso.
• C'è un tetto alla cifra che puoi chiedere: 200.000 € all'ABF, 500.000 € all'ACF.
• La decisione non è una sentenza. Chi perde può non rispettarla, ma il suo nome viene pubblicato, e quasi sempre si adegua. A te resta comunque la strada del giudice.'''),
    BK('A quale arbitro fai ricorso?', ['ABF', 'ACF', 'Assicurativo'], [
      ('Bonifico non tuo, mai rimborsato', 0, 'È un servizio di pagamento: Arbitro Bancario Finanziario.'),
      ('Fondo venduto senza spiegare i rischi', 1, 'È un investimento: Arbitro per le Controversie Finanziarie.'),
      ('Danno alla casa che la polizza non paga', 2, 'È un contratto di assicurazione.'),
      ('Spese del conto mai comunicate', 0, "Conti, carte, prestiti e mutui vanno all'ABF."),
      ('Titoli inadatti, scelti dal consulente', 1, "Consulenza e servizi di investimento vanno all'ACF."),
      ('Polizza viaggio: rimborso negato', 2, "Per le polizze c'è l'Arbitro Assicurativo.")]),
    P('Bollette, telefono, internet', r'''
Fuori da banche e assicurazioni la strada è la stessa: prima il reclamo scritto, poi una conciliazione gratuita.

• **Telefono e internet**: ConciliaWeb, la piattaforma dell'AGCOM.
• **Luce, gas e acqua**: il Servizio Conciliazione di ARERA. Puoi attivarlo se la risposta al reclamo non ti soddisfa, oppure dopo 40 giorni senza risposta (50 per l'acqua).

Qui non decide un arbitro: un conciliatore aiuta te e l'azienda a trovare un accordo. In tutti e due i casi il tentativo è obbligatorio prima di poter andare dal giudice.

Se non sai da dove cominciare, un'associazione di consumatori può scrivere il reclamo con te.'''),
    OR('La strada di un reclamo', ['Reclamo scritto, con i documenti', 'Aspetti la risposta, entro il termine', "Ricorso all'arbitro, entro 12 mesi", 'Se non basta, il giudice'],
      after="Ogni gradino richiede quello prima: senza reclamo scritto non si arriva all'arbitro. Per questo la ricevuta del reclamo va conservata."),
    Q("La tua assicurazione non risponde al reclamo. Dopo quanti giorni puoi rivolgerti all'Arbitro Assicurativo?", ['15', '45', '90'], 1,
      "Un'assicurazione ha 45 giorni per rispondere. Scaduti quelli, o se la risposta non ti soddisfa, puoi fare ricorso: costa 20 €."),
    Q("L'ABF ti dà ragione, ma la banca non paga. Che cosa succede?", ["Il suo nome finisce nell'elenco pubblico di chi non rispetta le decisioni", 'Arriva subito il pignoramento', 'Il ricorso si annulla'], 0,
      "La decisione dell'arbitro non è una sentenza e non si può far eseguire con la forza. Ma l'elenco è pubblico, e per questo quasi tutte le banche pagano. Tu puoi comunque andare dal giudice."),
    Q('Hai comprato delle obbligazioni in banca e pensi che non ti abbiano spiegato i rischi. Dopo il reclamo, a chi fai ricorso?', ["All'ABF", "All'Arbitro Assicurativo", "All'ACF"], 2,
      "Sugli investimenti decide l'ACF, l'arbitro presso la Consob, anche se a venderteli è stata la banca. L'ABF si occupa di conti, pagamenti e prestiti."),
  ], "Prima il reclamo scritto, poi l'arbitro: ABF per la banca, ACF per gli investimenti, Arbitro Assicurativo per le polizze. Costa poco o nulla e non serve un avvocato."),
])

# Colori dei disegni in questa unità: azioni in pesca, obbligazioni in azzurro, soldi versati in menta.
U9 = dict(id='basi-u9', sid='basi-investire', name='Investire passo passo', lessons=[
  LF('basi-9-1', 'PAC', "Tutto subito o un po' alla volta", 7, [
    G("Davide investe 200 € al mese per 20 anni in un fondo che rende in media il 5% l'anno. In tutto versa 48.000 €. Quanto si ritrova alla fine?",
      "Con queste ipotesi arriva a circa **81.000 €**: 48.000 € li ha versati lui, gli altri 33.000 € sono rendimenti. Ipotesi: rendimento costante del 5% l'anno, versamenti a fine mese. Nella realtà il rendimento cambia ogni anno, ma l'idea resta: versare poco per molto tempo funziona.",
      lo=40000, hi=140000, step=1000, truth=81161, near=6000),
    P('Due modi di investire', r'''
**Per investire non serve avere già una grossa cifra: si può cominciare con poco, ogni mese.**

Ci sono due modi di mettere soldi in un investimento.

• Il **PIC**, piano di investimento del capitale: versi una somma in una volta sola. È il caso di chi ha già dei soldi da parte, per esempio un'eredità.
• Il **PAC**, piano di accumulo del capitale: versi una cifra fissa a scadenze regolari, di solito ogni mese. È il caso di chi investe una parte dello stipendio.

[fig]

Il PAC ha un vantaggio pratico: diventa un'abitudine. Una volta impostato il versamento automatico, investi senza doverci pensare e senza dover decidere ogni volta se è il momento giusto.''',
      fig=F([('PIC: tutto il primo giorno', '12.000 €', [(12000, 'Un solo versamento', CAP)]),
             ('PAC: dopo 6 mesi', '6.000 €', [(6000, '6 versamenti da 1.000 €', OK)]),
             ('PAC: dopo 12 mesi', '12.000 €', [(12000, '12 versamenti da 1.000 €', OK)])])),
    P('Il tempo fa la parte più grande', r'''
Torniamo a Davide: 200 € al mese per 20 anni, al 5% l'anno.

[fig]

Ogni versamento comincia a rendere dal giorno in cui entra, e i rendimenti producono altri rendimenti: è l'interesse composto. I primi 200 € lavorano per quasi vent'anni, gli ultimi non hanno ancora avuto il tempo di rendere.

Per questo conta così tanto cominciare presto.

| Durata | Versato | Alla fine |
|---|---|---|
| 10 anni | 24.000 € | 30.873 € |
| 20 anni | 48.000 € | 81.161 € |
| 30 anni | 72.000 € | 163.075 € |

Da 10 a 20 anni il versato raddoppia, ma la cifra finale fa molto di più. Da 20 a 30 anni aggiungi 24.000 € di versamenti e ne trovi circa 82.000 in più.''',
      fig=F([('Dopo 20 anni', '81.161 €', [(48000, 'Versato da Davide', OK, '48.000 €'), (33161, 'Rendimenti', CAP, '33.161 €')])])),
    LV('Costruisci il tuo piano', "Versi ogni mese una cifra e la investi al 5% l'anno. Muovi le leve e guarda quanto avrai alla fine.", 'piano', dict(tasso=5),
      [dict(id='rata', label='Versamento al mese', min=50, max=500, step=10, start=100, unit='€'), dict(id='anni', label='Durata', min=5, max=40, step=5, start=10, unit='anni')],
      [dict(label='Arriva ad almeno 100.000 €', cond=[['totale', '>=', 100000]], hint='Prova ad allungare la durata, oppure ad alzare il versamento.'),
       dict(label='Ora arrivaci versando in tutto meno di 50.000 €', cond=[['totale', '>=', 100000], ['versato', '<', 50000]], hint='Meno soldi versati vuol dire più lavoro lasciato al tempo: allunga la durata e abbassa il versamento.')],
      'Si può arrivare a 100.000 € versandone meno della metà, ma solo dando al piano molti anni. Chi comincia tardi, per arrivare alla stessa cifra deve versare molto di più.'),
    N('Investi 150 € al mese con un PAC. Quanto hai versato in tutto dopo 8 anni?', 14400, '€',
      r"\(150 \times 12 = 1.800\) € l'anno. In 8 anni: \(1.800 \times 8 =\) **14.400 €**. Il valore del tuo investimento sarà diverso, perché dipende dai rendimenti."),
    Q('Che cosa distingue un PAC da un PIC?', ['Con il PAC versi una cifra fissa a scadenze regolari, con il PIC tutto in una volta', 'Il PAC è garantito, il PIC no', 'Il PAC si può fare solo con le obbligazioni'], 0,
      'PAC vuol dire versamenti regolari, PIC un versamento unico. Nessuno dei due è garantito: tutti e due investono in strumenti che possono salire e scendere.'),
    Q('Anna e Bruno versano 200 € al mese nello stesso fondo. Anna comincia a 25 anni, Bruno a 35. Tutti e due smettono a 65. Chi avrà di più?', ['Bruno, perché ha cominciato con più esperienza', 'Anna, perché i suoi soldi hanno lavorato 10 anni in più', 'Avranno la stessa cifra'], 1,
      'Anna versa per 40 anni, Bruno per 30. Anna ha versato 24.000 € in più, ma soprattutto i suoi primi versamenti hanno avuto dieci anni in più per produrre rendimenti sui rendimenti.'),
  ], "PIC: tutto in una volta. PAC: una cifra fissa ogni mese. Con il PAC conta soprattutto il tempo: prima cominci, più lavora l'interesse composto."),

  LF('basi-9-2', 'Ø', 'Comprare a prezzi diversi', 7, [
    G("Investi 100 € al mese in un fondo. Il prezzo di una quota è 10 € il primo mese, 8 € il secondo, 12,50 € il terzo. In quale mese hai comprato più quote?",
      r'Con una cifra fissa compri più quote quando il prezzo è basso: \(\dfrac{100}{8} =\) **12,5 quote** nel secondo mese, contro 10 nel primo e 8 nel terzo. È un piccolo vantaggio automatico del versare sempre la stessa cifra.',
      options=['Il primo', 'Il secondo', 'Il terzo'], ans=1),
    P('Stessa cifra, quote diverse', r'''
**Con un PAC non compri sempre la stessa quantità: compri sempre per la stessa cifra.**

Un fondo è diviso in **quote**, e il prezzo di una quota cambia nel tempo. Se versi 100 € al mese, quante quote ricevi dipende dal prezzo di quel giorno:

$$\text{quote} = \frac{\text{cifra versata}}{\text{prezzo di una quota}}$$

[fig]

Quando il prezzo scende i tuoi 100 € comprano di più, quando sale comprano di meno. Senza decidere nulla, finisci per comprare più quote a prezzi bassi che a prezzi alti.''',
      fig=F([('Mese 1: prezzo 10 €', '10 quote', [(10, 'Quote comprate con 100 €', CAP)]),
             ('Mese 2: prezzo 8 €', '12,5 quote', [(12.5, 'Quote comprate con 100 €', OK)]),
             ('Mese 3: prezzo 12,50 €', '8 quote', [(8, 'Quote comprate con 100 €', INT)])])),
    N('In tre mesi hai versato 300 € e hai comprato 10 quote, poi 12,5, poi 8. Quante quote hai in tutto?', 30.5, 'quote',
      r'\(10 + 12{,}5 + 8 =\) **30,5 quote**.', tol=0.01, dec=1),
    P('Il prezzo medio di carico', r'''
Quanto ti è costata, in media, ogni quota? Si chiama **prezzo medio di carico**:

$$\text{prezzo medio} = \frac{\text{totale versato}}{\text{quote possedute}}$$

Hai versato 300 € e hai 30,5 quote: \(\dfrac{300}{30{,}5} =\) **9,84 €** a quota.

La media dei tre prezzi, invece, è \(\dfrac{10 + 8 + 12{,}50}{3} =\) **10,17 €**.

Il tuo costo è più basso della media dei prezzi, proprio perché hai comprato più quote quando costavano meno.

Attenzione a non chiedere al PAC quello che non può dare. Non ti protegge dalle perdite: se il prezzo scende sotto 9,84 € sei in perdita. E se i prezzi salgono sempre, chi ha versato tutto subito ha fatto meglio. Il suo pregio è un altro: ti evita di dover indovinare il momento giusto per entrare.'''),
    N('Con un PAC hai versato in tutto 1.200 € e possiedi 100 quote. Oggi una quota vale 13 €. Quanto vale il tuo investimento?', 1300, '€',
      r"100 quote a 13 € l'una: \(100 \times 13 =\) **1.300 €**. Il tuo prezzo medio di carico è \(\dfrac{1.200}{100} = 12\) €: oggi la quota vale di più, quindi stai guadagnando 100 €."),
    BK('Vero o falso sul PAC?', ['Vero', 'Falso'], [
      ('Con la stessa cifra compri più quote quando il prezzo è basso', 0, 'È una divisione: cifra fissa diviso un prezzo più basso dà più quote.'),
      ('Un PAC garantisce di non perdere', 1, 'Se il prezzo scende sotto il tuo prezzo medio di carico, sei in perdita.'),
      ('Ti evita di scegliere il momento giusto per entrare', 0, "Entri un po' alla volta, a prezzi diversi."),
      ('Se i prezzi salgono sempre, il PAC batte il versamento unico', 1, 'In quel caso chi ha versato tutto subito ha comprato ai prezzi più bassi.'),
      ('Il prezzo medio di carico è il totale versato diviso le quote', 0, 'È proprio la definizione.')]),
    Q('Versi 200 € quando la quota costa 20 € e altri 200 € quando costa 10 €. Qual è il tuo prezzo medio di carico?', ['15,00 €', '13,33 €', '10,00 €'], 1,
      r'Quote comprate: \(\dfrac{200}{20} = 10\) e \(\dfrac{200}{10} = 20\), in tutto 30. Prezzo medio di carico: \(\dfrac{400}{30} =\) **13,33 €**. Non è 15 €, la media dei due prezzi, perché a 10 € hai comprato il doppio delle quote.'),
    Q('Hai un prezzo medio di carico di 9,84 € e oggi la quota vale 9 €. Come sta il tuo investimento?', ['In guadagno', 'In pari', 'In perdita'], 2,
      'Ogni quota ti è costata in media 9,84 € e oggi ne vale 9: sei **in perdita**. Il prezzo medio di carico è il tuo punto di pareggio.'),
  ], 'Con una cifra fissa compri più quote quando costano meno. Il prezzo medio di carico è il totale versato diviso le quote: è il tuo punto di pareggio.'),

  LF('basi-9-3', '72', 'La regola del 72', 6, [
    G("Investi 5.000 € e li lasci crescere al 6% l'anno, senza toccarli. Dopo quanti anni saranno diventati 10.000 €?",
      r"Servono circa **12 anni**. C'è una scorciatoia per saperlo senza calcolatrice: dividi 72 per il tasso. \(\dfrac{72}{6} = 12\).",
      lo=0, hi=40, step=1, truth=12, near=1, unit='anni'),
    P('Una divisione al posto di una formula', r'''
**Per sapere in quanti anni i tuoi soldi raddoppiano basta dividere 72 per il tasso.**

$$\text{anni per raddoppiare} \approx \frac{72}{\text{tasso}}$$

Il tasso si scrive come numero: per il 6% metti 6. Funziona grazie all'interesse composto: ogni anno gli interessi si sommano al capitale e l'anno dopo fruttano anche loro.

| Tasso | Regola del 72 | Conto esatto |
|---|---|---|
| 2% | 36 anni | 35,0 anni |
| 4% | 18 anni | 17,7 anni |
| 6% | 12 anni | 11,9 anni |
| 8% | 9 anni | 9,0 anni |

È una stima, non un conto preciso, ma per i tassi che si incontrano di solito sbaglia di pochi mesi.

Nota una cosa: passare dal 2% al 4% non accorcia l'attesa di poco. La dimezza.'''),
    N("Un investimento rende il 3% l'anno. Secondo la regola del 72, in quanti anni raddoppia?", 24, 'anni',
      r'\(\dfrac{72}{3} =\) **24 anni**.'),
    P('Vale per tutto quello che cresce', r'''
La stessa regola funziona per qualunque cosa cresca a un ritmo costante. Anche per i prezzi.

Con un'inflazione del 3% l'anno i prezzi raddoppiano in circa \(\dfrac{72}{3} =\) **24 anni**. Vuol dire che i soldi lasciati fermi, in 24 anni, comprano la metà.

[fig]

E funziona per i debiti. Un debito al 18% l'anno su cui non paghi nulla raddoppia in circa \(\dfrac{72}{18} =\) **4 anni**.

La regola del 72 serve a questo: a sentire quanto pesa un tasso senza fare conti. Il 2% e il 6% sembrano vicini. Ma uno raddoppia i soldi in 36 anni, l'altro in 12.''',
      fig=F([('Oggi', '1.000 €', [(1000, 'Quello che comprano 1.000 €', CAP)]), ('Tra 24 anni, con inflazione al 3%', 'circa la metà', [(492, 'Quello che comprano gli stessi 1.000 €', INT)])])),
    N("Con un'inflazione del 4% l'anno, in quanti anni circa i prezzi raddoppiano?", 18, 'anni',
      r'\(\dfrac{72}{4} =\) **18 anni**. In 18 anni i soldi lasciati fermi comprano circa la metà.'),
    OR('Dal raddoppio più veloce al più lento', ['Debito sulla carta al 18%', "Investimento all'8%", 'Investimento al 4%', 'Conto deposito al 2%'],
      x='Tocca le voci da quella che raddoppia prima a quella che raddoppia dopo.', after='72 diviso il tasso: circa 4 anni, 9 anni, 18 anni, 36 anni.'),
    Q('A quale tasso annuo, circa, i soldi raddoppiano in 10 anni?', ['3,6%', '7,2%', '10%'], 1,
      r'La regola funziona anche al contrario: \(\text{tasso} \approx \dfrac{72}{\text{anni}} = \dfrac{72}{10} =\) **7,2%**.'),
    Q("Hai 2.000 € investiti all'8% l'anno. Secondo la regola del 72, quanto avrai all'incirca dopo 18 anni?", ['4.000 €', '6.000 €', '8.000 €'], 2,
      r"All'8% i soldi raddoppiano ogni \(\dfrac{72}{8} = 9\) anni. In 18 anni raddoppiano due volte: da 2.000 a 4.000, poi a **8.000 €**."),
  ], r'\(\text{Anni per raddoppiare} \approx \dfrac{72}{\text{tasso}}\). Vale per i soldi investiti, per i prezzi e per i debiti.'),

  LF('basi-9-4', '60/40', 'Dividere e riequilibrare', 7, [
    G("Marta investe 10.000 €: 6.000 € in azioni e 4.000 € in obbligazioni. In un anno le azioni salgono del 30%, le obbligazioni restano ferme. Che percentuale del suo portafoglio è ora in azioni?",
      r'Le azioni valgono \(6.000 \times 1{,}30 = 7.800\) €, le obbligazioni 4.000 €. In tutto 11.800 €, e le azioni sono \(\dfrac{7.800}{11.800}\), cioè circa il **66%**. Marta non ha fatto nulla, eppure il suo portafoglio è diventato più rischioso di come lo aveva scelto.',
      lo=50, hi=100, step=1, truth=66, near=2, unit='%'),
    P('La scelta che conta di più', r'''
**Prima di scegliere quali titoli comprare, si decide come dividere i soldi tra azioni e obbligazioni.**

L'insieme dei tuoi investimenti si chiama portafoglio. Il modo in cui lo dividi ha un nome: **asset allocation**. È la scelta che pesa di più su quanto potrà salire e scendere.

• Più **azioni**: più crescita attesa nel lungo periodo, ma cali più forti lungo la strada.
• Più **obbligazioni**: meno crescita attesa, ma un percorso più tranquillo.

[fig]

Non esiste la divisione giusta per tutti. Dipende da quanto tempo hai prima che i soldi ti servano, e da quanto riesci a sopportare di vederli scendere senza vendere.

Marta ha 15 anni davanti e sceglie 60% azioni e 40% obbligazioni.''',
      fig=F([('Prudente', None, [(30, 'Azioni', INT, '30%'), (70, 'Obbligazioni', CAP, '70%')]),
             ('Bilanciato', None, [(60, 'Azioni', INT, '60%'), (40, 'Obbligazioni', CAP, '40%')]),
             ('Dinamico', None, [(90, 'Azioni', INT, '90%'), (10, 'Obbligazioni', CAP, '10%')])], cap='Tre esempi. I nomi cambiano da un intermediario all\'altro.')),
    P('Il portafoglio si sposta da solo', r'''
Una volta scelta, la divisione non resta ferma: la spostano i mercati.

Dopo un anno in cui le azioni salgono del 30% e le obbligazioni restano ferme, il portafoglio di Marta è cambiato:

[fig]

Le azioni sono passate dal 60% al 66%. Se continuassero a salire arriverebbero al 70%, poi all'80%. Marta si ritroverebbe con un portafoglio molto più rischioso di quello che aveva scelto, proprio dopo una lunga salita: cioè quando un calo farebbe più male.''',
      fig=F([("All'inizio", '10.000 €', [(6000, 'Azioni', INT, '6.000 €'), (4000, 'Obbligazioni', CAP, '4.000 €')]),
             ('Dopo un anno', '11.800 €', [(7800, 'Azioni', INT, '7.800 €'), (4000, 'Obbligazioni', CAP, '4.000 €')])])),
    P('Riportarlo dove lo avevi deciso', r'''
**Ribilanciare** vuol dire riportare il portafoglio alla divisione che avevi scelto.

Marta vuole tornare al 60% di azioni su 11.800 €:

• azioni che dovrebbe avere: \(11.800 \times 60\% =\) **7.080 €**
• azioni che ha: 7.800 €
• da vendere: \(7.800 - 7.080 =\) **720 €**

Con quei 720 € compra obbligazioni, che salgono a 4.720 €: il 40%.

Ha venduto un po' di quello che è salito e comprato quello che è rimasto indietro. È il contrario di quello che verrebbe d'istinto, e per questo conviene farlo con una regola fissa, per esempio una volta l'anno.

Ribilanciare non serve a guadagnare di più: serve a tenere il rischio dove lo avevi deciso. Vendere può far pagare tasse e commissioni, quindi non va fatto troppo spesso.'''),
    N('Un portafoglio vale 20.000 €: 14.000 € in azioni e 6.000 € in obbligazioni. Vuoi tornare a metà e metà. Quanti euro di azioni devi vendere?', 4000, '€',
      r'Metà di 20.000 € è 10.000 €. Hai 14.000 € di azioni: ne vendi \(14.000 - 10.000 =\) **4.000 €** e con quei soldi compri obbligazioni, che salgono a 10.000 €.'),
    BK('Più azioni o più obbligazioni?', ['Più azioni', 'Più obbligazioni'], [
      ('I soldi ti servono tra 25 anni', 0, 'Con tanto tempo davanti puoi sopportare i cali e puntare sulla crescita.'),
      ('I soldi ti servono tra 3 anni', 1, 'Con poco tempo un calo forte non si recupera: serve un percorso più tranquillo.'),
      ('Un calo del 20% non ti farebbe dormire', 1, 'Se finiresti per vendere nel momento peggiore, meglio un portafoglio che oscilla meno.'),
      ('Hai appena cominciato a lavorare e investi per la pensione', 0, 'È il caso tipico di un orizzonte molto lungo.'),
      ("Vai in pensione l'anno prossimo", 1, 'Tra poco quei soldi ti serviranno per vivere.')]),
    Q('Hai scelto 50% azioni e 50% obbligazioni. Dopo un anno le azioni sono salite molto e ora sono il 60%. Che cosa vuol dire ribilanciare?', ['Comprare altre azioni, visto che salgono', 'Vendere tutto e ricominciare', 'Vendere una parte di azioni e comprare obbligazioni'], 2,
      'Ribilanciare riporta il portafoglio alla divisione scelta: si **vende una parte di quello che è salito** e si compra quello che è rimasto indietro, fino a tornare a 50 e 50.'),
    Q('A che cosa serve, soprattutto, ribilanciare?', ['A tenere il rischio al livello che avevi scelto', 'A fare meglio del mercato', 'A non pagare tasse'], 0,
      'Serve a non ritrovarsi, dopo una lunga salita, con molte più azioni di quante ne avevi decise. Non promette rendimenti più alti, e vendere può anzi far pagare tasse.'),
  ], "L'asset allocation è come dividi i soldi tra azioni e obbligazioni. I mercati la spostano: ribilanciare la riporta dove l'avevi decisa."),
])

U10 = dict(id='basi-u10', sid='basi-testa', name="La testa dell'investitore", lessons=[
  LF('basi-10-1', '2×', 'Le perdite fanno più male', 6, [
    G("Un gioco: si lancia una moneta. Se esce testa vinci 150 €, se esce croce perdi 100 €. Se potessi ripeterlo tante volte, quanto guadagneresti in media a ogni lancio?",
      r'Metà delle volte vinci 150 €, metà perdi 100 €: in media \(0{,}5 \times 150 - 0{,}5 \times 100 =\) **+25 €** a lancio. È un gioco che conviene. Eppure, davanti a un solo lancio, molte persone rifiutano: la paura di perdere 100 € pesa più della speranza di vincerne 150.',
      lo=-100, hi=150, step=5, truth=25, near=10),
    P('Una perdita pesa circa il doppio', r'''
**Perdere 100 € fa più male di quanto faccia piacere guadagnarne 100.**

Gli studiosi lo chiamano **avversione alle perdite**. Negli esperimenti, per accettare il rischio di perdere 100 € le persone chiedono in media di poterne vincere circa 200. Una perdita pesa all'incirca il doppio di un guadagno della stessa misura.

[fig]

Non è un difetto da correggere: è il modo in cui siamo fatti. Ma quando si investe porta a decisioni sbagliate, perché i mercati salgono e scendono di continuo, e ogni discesa si fa sentire il doppio di ogni salita.''',
      fig=F([('Guadagnare 100 €', None, [(1, 'Quanto fa piacere', OK)]), ('Perdere 100 €', None, [(2, 'Quanto fa male', 'rosa')])], cap='Una misura indicativa: cambia da persona a persona.')),
    P('Che cosa ci fa fare', r'''
L'avversione alle perdite spinge verso tre errori tipici.

• **Tenere troppo a lungo i titoli in perdita.** Finché non vendi, la perdita sembra non esistere. Così si aspetta di tornare in pari, anche quando le ragioni per cui avevi comprato non ci sono più.
• **Vendere troppo presto i titoli in guadagno**, per la paura di vedere sparire quel guadagno.
• **Guardare troppo spesso.** Chi controlla ogni giorno vede molte più giornate negative di chi guarda una volta l'anno, e ogni giornata negativa fa male.

Un'idea aiuta contro tutti e tre: al mercato non interessa a che prezzo hai comprato. La domanda utile non è «quanto sto perdendo?», ma «se oggi avessi questi soldi in mano, comprerei questo titolo?». Se la risposta è no, il prezzo di acquisto non è una ragione per tenerlo.'''),
    N('Un altro gioco con la moneta: testa vinci 300 €, croce perdi 200 €. Quanto guadagni in media a ogni lancio?', 50, '€',
      r'\(0{,}5 \times 300 - 0{,}5 \times 200 = 150 - 100 =\) **+50 €** a lancio. È un gioco favorevole, anche se la possibile perdita di 200 € spaventa.'),
    BK("È un effetto dell'avversione alle perdite?", ['Sì', 'No'], [
      ('Non vendo finché non torno in pari', 0, 'Il prezzo di acquisto diventa un traguardo, ma al mercato non interessa.'),
      ('Vendo subito un titolo salito del 5%, per paura che scenda', 0, 'La paura di perdere un guadagno fa vendere troppo presto.'),
      ('Controllo il portafoglio dieci volte al giorno', 0, 'Più guardi, più giornate negative vedi, e ognuna pesa il doppio.'),
      ('Vendo perché ho raggiunto la cifra che mi serviva', 1, 'È una decisione legata al tuo obiettivo, non alla paura.'),
      ("Ribilancio una volta l'anno, come da piano", 1, 'È una regola decisa prima, a mente fredda.')]),
    Q("Hai comprato un'azione a 50 € e ora vale 30 €. Nel frattempo l'azienda ha perso i suoi clienti migliori. Qual è il modo più sano di ragionare?", ['Mi chiedo se oggi la comprerei a 30 €', 'Aspetto che torni a 50 €, poi vendo', 'Ne compro altre per abbassare il prezzo medio'], 0,
      'I 50 € che hai pagato non contano più: conta che cosa vale oggi quel titolo e che cosa ti aspetti per il futuro. Se oggi non la compreresti, il prezzo di acquisto non è un motivo per tenerla.'),
    Q("Che cosa dice l'avversione alle perdite?", ['Che una perdita pesa più di un guadagno della stessa misura', 'Che chi investe perde sempre', 'Che le perdite si recuperano da sole'], 0,
      'Perdere 100 € fa male circa il doppio di quanto fa piacere guadagnarne 100. Non dice nulla su come andranno i tuoi investimenti: dice come reagirai tu.'),
  ], 'Una perdita fa male circa il doppio di quanto fa piacere un guadagno uguale. Decidi guardando avanti, non al prezzo a cui hai comprato.'),

  LF('basi-10-2', 'FOMO', 'Tutti comprano, compro anche io', 7, [
    G("Un titolo passa da 10 € a 40 € in un anno. Ne parlano tutti, e Luca compra a 40 €. Poi il prezzo torna a 16 €. Quanto ha perso Luca, in percentuale?",
      "Luca ha comprato a 40 € e si ritrova con 16 €: ha perso 24 € su 40, cioè il **60%**. Chi aveva comprato a 10 € è ancora in guadagno del 60%. Stesso titolo, stessa storia: la differenza l'ha fatta il momento in cui si entra.",
      lo=0, hi=100, step=1, truth=60, near=3, unit='%'),
    P('La paura di restare fuori', r'''
**Quando un prezzo sale e tutti ne parlano, viene voglia di comprare. Spesso è il momento peggiore per farlo.**

Vedere gli altri guadagnare mentre tu resti a guardare crea una spinta molto forte. In inglese ha un nome ormai comune: **FOMO**, cioè fear of missing out, la paura di restare fuori.

Insieme lavora un'altra abitudine: l'**effetto gregge**. Se lo fanno tutti, pensiamo, un motivo ci sarà. Nella vita di tutti i giorni spesso è una buona regola. Nei mercati no, per una ragione semplice: più persone hanno già comprato, più il prezzo è già salito.

[fig]

Quando una notizia è arrivata fino a te, è probabile che sia già dentro il prezzo.''',
      fig=F([('Un anno prima', '10 €', [(10, 'Prezzo', CAP)]), ('Quando ne parlano tutti', '40 €', [(40, 'Prezzo', 'rosa')]), ('Un anno dopo', '16 €', [(16, 'Prezzo', CAP)])])),
    P('Come nasce una bolla', r'''
Quando l'effetto gregge prende tutto un mercato nasce una **bolla**: i prezzi salgono molto più di quanto vale davvero quello che si compra.

Di solito va così.

• Una novità attira l'attenzione, e i primi prezzi salgono per buone ragioni.
• I guadagni dei primi attirano altri compratori. Il prezzo sale perché si compra, e si compra perché il prezzo sale.
• Arriva chi compra solo per rivendere a un prezzo più alto. Nessuno guarda più che cosa sta comprando.
• I compratori nuovi finiscono. Il prezzo smette di salire, qualcuno vende, e la discesa è più veloce della salita.

È successo con i tulipani in Olanda nel Seicento, con le azioni di internet alla fine degli anni Novanta, con le case negli Stati Uniti prima del 2008. Cambia l'oggetto, non il copione.'''),
    OR('Metti in ordine le fasi di una bolla', ['Una novità attira i primi compratori', 'I prezzi salgono e arrivano tutti gli altri', 'Si compra solo per rivendere a di più', 'I compratori finiscono e il prezzo crolla'],
      after='Chi entra nella terza fase compra da chi era entrato nella prima.'),
    N("Compri un titolo a 80 €, nel pieno dell'entusiasmo. Il prezzo scende a 20 €. Di quanto deve salire, in percentuale, per tornare a 80 €?", 300, '%',
      r'Da 20 € a 80 € mancano 60 €: \(\dfrac{60}{20} =\) **300%**. Il prezzo deve quadruplicare. Dopo un calo del 75% non basta un +75%.'),
    P('Come difendersi', r'''
Non serve saper prevedere le bolle. Serve non farsi trascinare.

• **Decidi prima.** Un piano scritto, con quanto investi ogni mese e in che cosa, ti toglie la decisione nel momento in cui sei più emotivo.
• **Fatti la domanda scomoda.** Sto comprando perché ho capito che cosa compro e quanto vale, oppure perché è salito?
• **Guarda quanto pesa.** Una piccola parte dei tuoi soldi su un'idea rischiosa è una scelta. Tutti i risparmi no.

Chi investe una cifra fissa ogni mese in un fondo ben diversificato ha già una buona difesa: compra sempre, sia quando tutti sono entusiasti sia quando tutti hanno paura.'''),
    Q('Un titolo è triplicato in sei mesi e ne parlano tutti. Che cosa dice questo sul suo futuro?', ['Che continuerà a salire', 'Che crollerà di sicuro', 'Niente di certo: dice solo che oggi costa molto di più'], 2,
      'Una salita passata non promette né altra salita né un crollo. Dice solo che chi compra oggi paga tre volte di più, quindi ha meno margine se le cose vanno male.'),
    Q('Che cosa distingue una bolla da una normale salita dei prezzi?', ['Nella bolla si compra soprattutto perché il prezzo sale', 'Nella bolla i prezzi salgono lentamente', 'Nella bolla comprano solo i professionisti'], 0,
      'In una bolla il prezzo sale perché si compra, e si compra perché il prezzo sale. Nessuno guarda più quanto vale davvero quello che sta comprando.'),
  ], 'Quando tutti comprano, il prezzo è già salito. Decidi con un piano scritto prima, non con la paura di restare fuori.'),

  LF('basi-10-3', '↓↑', 'Vendere nel momento peggiore', 6, [
    G("Sara ha 10.000 € investiti. Il mercato perde il 30% e lei, presa dalla paura, vende tutto. L'anno dopo il mercato risale del 50%, ma Sara è rimasta fuori. Quanti soldi ha in meno rispetto a chi non ha venduto?",
      r"Chi è rimasto investito ha \(10.000 \times 0{,}70 \times 1{,}50 = 10.500\) €. Sara ha venduto a 7.000 € e lì è rimasta: ha **3.500 €** in meno. La perdita del 30% era solo sulla carta. Vendendo l'ha resa definitiva.",
      lo=0, hi=6000, step=100, truth=3500, near=300),
    P('Una perdita sulla carta', r'''
**Finché non vendi, un calo è un numero su uno schermo. Diventa una perdita vera nel momento in cui vendi.**

Quando i mercati scendono forte, i telegiornali parlano di crollo e ogni giorno il numero è più basso. La reazione naturale è scappare: vendere tutto per non perdere altro.

Il problema è che i cali forti e le risalite forti stanno spesso vicini. Chi esce dopo il calo si mette al riparo da una discesa che c'è già stata, e si perde la risalita che viene dopo.

[fig]

Per fare meglio di chi resta fermo bisogna indovinare due momenti: quando uscire e quando rientrare. Sbagliarne uno basta a fare peggio.''',
      fig=F([("All'inizio", '10.000 €', [(10000, 'Tutti e due', CAP)]), ('Chi resta investito', '10.500 €', [(10500, 'Dopo il −30% e il +50%', OK)]), ('Chi vende dopo il calo', '7.000 €', [(7000, 'Fuori dal mercato', 'rosa')])])),
    P('Perché il tempo aiuta', r'''
Scendere fa parte del modo in cui le borse funzionano. Nella storia dei grandi mercati azionari i cali del 10% sono arrivati in media ogni anno o due, e quelli del 30% o più circa una volta ogni dieci anni.

Finora i grandi mercati hanno sempre recuperato: a volte in pochi mesi, a volte dopo molti anni. Non è una garanzia per il futuro. Ma per chi ha molto tempo davanti un calo è un tratto di strada, non la fine del viaggio.

Tre cose rendono più facile restare fermi.

• **Investire solo soldi che non ti servono presto.** Chi ne ha bisogno tra un anno è costretto a vendere, a qualunque prezzo.
• **Avere un fondo di emergenza.** Così un imprevisto non ti obbliga a vendere nel momento sbagliato.
• **Scegliere una divisione che riesci a sopportare.** Se un −30% non ti farebbe dormire, servono meno azioni.'''),
    N('Hai 8.000 € investiti. Il mercato scende del 25% e poi risale del 40%. Se non vendi, quanto hai alla fine?', 8400, '€',
      r'Dopo il calo: \(8.000 \times 0{,}75 = 6.000\) €. Dopo la risalita: \(6.000 \times 1{,}40 =\) **8.400 €**. Un −25% seguito da un +40% non fa +15%: le percentuali si moltiplicano, non si sommano.'),
    BK('Ti aiuta a non vendere nel panico?', ['Aiuta', 'Non aiuta'], [
      ('Avere un fondo di emergenza', 0, 'Un imprevisto non ti costringe a vendere.'),
      ('Controllare i prezzi ogni ora', 1, 'Più guardi, più il calo fa paura.'),
      ('Aver investito soldi che servono tra 20 anni', 0, 'Con tanto tempo, un calo si può aspettare.'),
      ('Aver messo tutto in un solo titolo', 1, 'Un titolo solo può non risalire mai: diversificare serve anche a questo.'),
      ('Avere un piano scritto prima', 0, 'La decisione è già presa, a mente fredda.'),
      ('Ascoltare chi grida al crollo', 1, 'La paura degli altri è contagiosa.')]),
    Q('Il tuo fondo diversificato ha perso il 20% e quei soldi ti serviranno tra 25 anni. Che cosa fa di solito chi ha un piano?', ['Vende tutto e aspetta tempi migliori', 'Continua con i versamenti previsti', 'Sposta tutto su un solo titolo che sta salendo'], 1,
      'Con 25 anni davanti un calo del 20% è un tratto di strada. Chi continua a versare, in quel periodo compra a prezzi più bassi.'),
    Q('Perché è così difficile guadagnare uscendo dal mercato e rientrando?', ['Perché è vietato', 'Perché i prezzi non cambiano mai', 'Perché bisogna indovinare due momenti: quando uscire e quando rientrare'], 2,
      'Bisogna azzeccare sia il momento di uscire sia quello di rientrare. Chi esce dopo un calo spesso rientra quando i prezzi sono già risaliti.'),
  ], 'Un calo diventa una perdita vera solo quando vendi. Tempo, fondo di emergenza e un piano scritto aiutano a restare fermi.'),

  LF('basi-10-4', 'N.1', 'Sentirsi più bravi del mercato', 7, [
    G("Luca ha 10.000 € investiti e compra e vende spesso: 40 operazioni l'anno, e ognuna gli costa 8 € di commissione. Quanto spende in commissioni in 10 anni?",
      r"\(40 \times 8 = 320\) € l'anno, cioè **3.200 €** in dieci anni: quasi un terzo dei 10.000 € di partenza, spesi solo per muoversi. Per andare in pari, ogni anno Luca deve fare il 3,2% meglio di chi sta fermo.",
      lo=0, hi=6000, step=100, truth=3200, near=300),
    P('Tutti sopra la media', r'''
**Quasi tutti pensiamo di essere più bravi della media. Per definizione, non può essere vero per tutti.**

Si chiama **eccesso di fiducia**. Chiedi a un gruppo di persone se guidano meglio della media: la grande maggioranza risponde di sì.

Negli investimenti succede lo stesso, con un'aggravante: il caso si traveste da bravura. Se compri un titolo e sale, pensi di averlo capito. Se scende, è stata sfortuna. Dopo qualche colpo fortunato ti senti esperto e cominci a rischiare di più.

Dall'altra parte di ogni tuo acquisto, però, c'è qualcuno che vende. Spesso è un professionista che fa questo lavoro tutto il giorno, con più informazioni e più strumenti di te. Non è impossibile fare meglio di lui. È solo molto meno probabile di quanto sembra.'''),
    P('Muoversi costa', r'''
L'eccesso di fiducia ha un effetto che si può misurare: fa comprare e vendere troppo.

Ogni operazione ha un costo. C'è la **commissione** che paghi all'intermediario. E ci sono le tasse sui guadagni, che paghi ogni volta che vendi in guadagno invece di rimandarle.

Ecco i 10.000 € di Luca e le sue commissioni di dieci anni:

[fig]

Gli studi sui piccoli investitori trovano lo stesso risultato da anni: in media, chi fa più operazioni ottiene di meno. Non perché scelga titoli peggiori, ma perché i costi si mangiano i risultati.

Spesso la mossa che rende di più è non fare nulla.''',
      fig=F([('Capitale di partenza', '10.000 €', [(10000, 'Soldi investiti', CAP)]), ('Commissioni in 10 anni', '3.200 €', [(3200, "40 operazioni l'anno a 8 €", INT)])])),
    N("Fai 25 operazioni l'anno e ognuna costa 6 € di commissione. Hai 5.000 € investiti. Quanto pesano le commissioni in un anno, in percentuale del capitale?", 3, '%',
      r"\(25 \times 6 = 150\) € l'anno. \(\dfrac{150}{5.000} =\) **3%**. Prima ancora di guadagnare qualcosa, devi recuperare il 3%."),
    P('Le regole di chi non si fida di sé', r'''
I buoni investitori non sono quelli che non hanno queste debolezze. Sono quelli che sanno di averle e si danno delle regole.

• **Scrivi il piano prima**: quanto investi, in che cosa, per quanto tempo.
• **Rendilo automatico**: un versamento fisso ogni mese decide al posto tuo.
• **Diversifica**: così non devi avere ragione su un singolo titolo.
• **Guarda poco**: una o due volte l'anno bastano per ribilanciare.
• **Tieni basse le spese**: i costi sono l'unica cosa certa di un investimento.

Sono le idee di tutto questo percorso, messe in fila. Nessuna richiede di prevedere il futuro, ed è per questo che funzionano.'''),
    M(('Avversione alle perdite', 'Una perdita pesa più di un guadagno uguale'), ('Effetto gregge', 'Fare una cosa perché la fanno tutti'), ('FOMO', 'La paura di restare fuori da un guadagno'), ('Eccesso di fiducia', 'Credersi più bravi della media')),
    Q('Hai indovinato tre titoli di fila. Che cosa dimostra?', ['Che sai prevedere il mercato', 'Poco: tre colpi possono essere fortuna', 'Che conviene puntare tutto sul prossimo'], 1,
      'Tre risultati sono troppo pochi per distinguere la bravura dalla fortuna. Il rischio è sentirsi esperti e cominciare a puntare cifre più grandi.'),
    Q("Due investitori hanno lo stesso portafoglio. Uno fa 50 operazioni l'anno, l'altro 2. A parità di rendimento prima dei costi, chi ottiene di più?", ['Chi ne fa 50', 'È uguale', 'Chi ne fa 2'], 2,
      'Ogni operazione costa una commissione, e spesso anche tasse. A parità di rendimento prima dei costi, a chi si muove meno resta di più.'),
  ], "Sentirsi più bravi della media fa muovere troppo, e muoversi costa. Un piano scritto, automatico e a basso costo batte quasi sempre l'istinto."),
])

# Unità 11: la banca e i pagamenti. Qui le regole contano più dei conti: ogni cifra viene da una fonte (elenco in dev/ordine/FONTI_BASI.md)
# e va ricontrollata quando la regola cambia. Regole in vigore a novembre 2026: servizi di pagamento (d.lgs. 11/2010), bonifici istantanei
# (Reg. UE 2024/886), garanzia dei depositi (100.000 €), imposta di bollo (34,20 €), indagine della Banca d'Italia sui costi dei conti (dati 2024).
U11 = dict(id='basi-u11', sid='basi-banca', name='La banca e i pagamenti', lessons=[
  LF('basi-11-1', 'C/C', 'Quanto ti costa il conto', 7, [
    G('Pensa a un conto corrente in una banca tradizionale, di quelle con lo sportello. Tra canone, carte e commissioni, quanto costa in media in un anno?',
      "Nel 2024 la spesa media è stata di **101 €**, secondo l'indagine della Banca d'Italia. Per i conti solo online è stata di **31 €**: 70 € di differenza ogni anno, 700 € in dieci anni. Quasi nessuno sa quanto paga, perché il costo non arriva tutto insieme. Arriva a pezzi.",
      lo=0, hi=300, step=5, truth=101, near=15),
    P('I quattro pezzi del costo', r'''
**Il costo di un conto non è una cifra sola: sono quattro pezzi, e ognuno si abbassa in un modo diverso.**

• Il **canone**: una cifra fissa, di solito al mese. La paghi anche se il conto non lo usi.
• Le **operazioni**: bonifici, prelievi, pagamenti. Spesso sono gratis dall'app e a pagamento allo sportello, o al bancomat di un'altra banca.
• Le **carte**: alcune hanno un canone a parte, una volta l'anno.
• L'**imposta di bollo**: 34,20 € l'anno che la banca incassa per lo Stato. È dovuta solo se sul conto tieni in media più di 5.000 €.

[fig]

I primi tre pezzi li decide la banca e cambiano da un conto all'altro. Il quarto è uguale in tutte le banche.''',
      fig=F([('Conto con sportello', '101 €', [(101, 'Spesa media in un anno', CAP)]), ('Conto solo online', '31 €', [(31, 'Spesa media in un anno', OK)])],
            cap="Banca d'Italia, indagine sul costo dei conti correnti nel 2024. L'imposta di bollo non è compresa.")),
    LV('Il conto di Marta', "Ogni operazione a pagamento le costa 1,50 €. Muovi le leve e guarda quanto spende in un anno.", 'conto', dict(op=1.5, bollo=34.2, soglia=5000),
      [dict(id='canone', label='Canone al mese', min=0, max=10, step=1, start=6, unit='€'),
       dict(id='ops', label='Operazioni a pagamento al mese', min=0, max=8, step=1, start=4, unit=''),
       dict(id='giac', label='Giacenza media sul conto', min=1000, max=10000, step=500, start=7000, unit='€')],
      [dict(label="Porta il costo sotto 100 € l'anno", cond=[['costo', '<', 100]], hint='Canone e operazioni si pagano ogni mese: ogni euro al mese fa 12 € in un anno.'),
       dict(label='Ora scendi sotto 31 €, la media dei conti online', cond=[['costo', '<', 31]], hint='Finché la giacenza media supera 5.000 €, il bollo da solo fa 34,20 €.')],
      "Tre leve, tre mosse: un canone più basso, le operazioni fatte dal canale gratuito, una giacenza media entro i 5.000 €. L'ultima non vuol dire avere meno soldi: vuol dire non lasciarli tutti fermi sul conto di tutti i giorni."),
    P('Conta la media, non il picco', r'''
La soglia del bollo non guarda il saldo di un giorno. Guarda la **giacenza media**: si sommano i saldi di tutti i giorni del periodo e si divide per il numero dei giorni.

$$\text{giacenza media} = \frac{\text{somma dei saldi}}{\text{numero dei giorni}}$$

Il periodo è quello dell'estratto conto, spesso un trimestre. Se in quel trimestre la media supera 5.000 €, paghi la quota di quel trimestre: circa 8,55 €, un quarto di 34,20 €.

Due dettagli che pochi conoscono.

• Se hai più conti nella stessa banca, le giacenze **si sommano**. E superata la soglia il bollo è dovuto su ciascun conto.
• Sul **conto deposito** il bollo funziona in un altro modo: è lo 0,2% l'anno della somma, senza soglia. Su 2.000 € sono 4 €.

Lasciare molti soldi fermi sul conto di tutti i giorni costa quindi due volte: il bollo, e gli interessi a cui rinunci.'''),
    N(r'''
La banca di Piero manda l'estratto conto ogni tre mesi. In questo trimestre sul conto ci sono stati:

• 7.500 € per un mese
• 3.000 € per gli altri due mesi

Quanto vale la giacenza media del trimestre? Per semplicità conta i tre mesi come se fossero lunghi uguali.''', 4500, '€',
      r"\(\dfrac{7.500 + 3.000 + 3.000}{3} =\) **4.500 €**. È sotto 5.000 €: per questo trimestre il bollo non è dovuto, anche se per un mese sul conto c'erano 7.500 €. Conta la media, non il picco."),
    P('Tre strumenti che quasi nessuno usa', r'''
**Sapere quanto hai pagato.** Una volta l'anno la banca ti manda il **Riepilogo delle spese**: tutte le spese del conto sommate, voce per voce. È lì che trovi la cifra vera.

**Confrontare prima di scegliere.** Ogni conto ha un Documento informativo sulle spese, fatto allo stesso modo in tutte le banche: due conti si confrontano mettendo i due fogli uno accanto all'altro.

**Cambiare banca senza fare niente.** Il trasferimento lo chiedi alla banca nuova: è lei a farsi mandare dalla vecchia saldo, addebiti e bonifici ricorrenti. Non costa nulla e deve finire entro 12 giorni lavorativi.

C'è poi una voce che conviene evitare: andare **in rosso** senza un accordo con la banca. Oltre agli interessi, a ogni sconfinamento può scattare una commissione fissa: in media 16 € nel 2024. Ne sei esente una volta a trimestre, se lo sconfinamento è piccolo e breve: fino a 500 € e per non più di 7 giorni.'''),
    Q('Senza un accordo con la banca, il conto di Luca va in rosso di 40 € per tre giorni. È la prima volta in questo trimestre. Che cosa paga?', ['Interessi e commissione fissa', 'Solo gli interessi', 'Niente'], 1,
      'Di norma chi sconfina paga gli interessi e una commissione fissa. Ma uno sconfinamento fino a 500 €, che dura al massimo 7 giorni, una volta a trimestre è esente dalla commissione. Gli interessi sui 40 € restano dovuti: per tre giorni sono pochi centesimi.'),
    Q('Vuoi cambiare banca e portarti dietro saldo, bollette e accredito dello stipendio. A chi lo chiedi?', ['Alla banca nuova', 'Alla banca vecchia', "Alla Banca d'Italia"], 0,
      'Il trasferimento si chiede alla **banca nuova**: è lei a occuparsi di tutto con la vecchia, entro 12 giorni lavorativi e senza spese. Se sfora ti spetta un indennizzo. Il conto vecchio viene chiuso solo se lo chiedi tu nel modulo.'),
    Q('Chiara ha due conti correnti nella stessa banca: su uno tiene in media 3.500 €, sull\'altro 2.500 €. Paga l\'imposta di bollo?', ['No: nessuno dei due supera 5.000 €', 'Sì, ma solo sul conto più grande', 'Sì, su tutti e due: insieme superano 5.000 €'], 2,
      r"Per la soglia contano insieme i conti che la stessa persona ha nella stessa banca: \(3.500 + 2.500 = 6.000\) €, più di 5.000 €. E superata la soglia il bollo è dovuto su ognuno dei due: \(34{,}20 \times 2 =\) **68,40 €** l'anno."),
  ], 'Il costo del conto ha quattro pezzi: canone, operazioni, carte, bollo. Il bollo scatta sopra 5.000 € di giacenza media. Il Riepilogo delle spese ti dice quanto hai pagato davvero.'),

  LF('basi-11-2', 'CARTE', 'Debito, credito, prepagata', 7, [
    G("Arrivi in hotel e alla reception ti chiedono una carta a garanzia: bloccano 300 €. Dai la tua carta di debito. Che cosa succede a quei 300 €?",
      "Si chiama **pre-autorizzazione**. I soldi restano tuoi ma sono bloccati, e lo sblocco può richiedere giorni anche dopo che sei ripartito. Con una carta di debito il blocco cade sui soldi del conto. Con una carta di credito cade sul tetto di spesa della carta, e il conto non se ne accorge. È una delle differenze che non si vedono finché non servono.",
      options=['Escono dal conto e tornano alla partenza', "Restano sul conto, ma non li puoi usare finché l'hotel non li sblocca", 'Niente: è solo una formalità'], ans=1),
    P('Tre carte, tre momenti', r'''
**Le tre carte si distinguono per una cosa sola: il momento in cui i soldi escono dalle tue tasche.**

| Carta | Paghi | Limite |
|---|---|---|
| Debito | subito | i soldi sul conto |
| Credito | il mese dopo | un tetto mensile |
| Prepagata | prima | quello che carichi |

Con la **carta di debito** paghi con soldi tuoi, che lasciano il conto quasi subito.

Con la **carta di credito** paghi con soldi che la banca ti anticipa fino a un tetto, il **plafond**. Il mese dopo li restituisci tutti insieme, senza interessi: è il pagamento **a saldo**.

La **prepagata** non è legata al conto: ci carichi una cifra e spendi quella.

Da qui viene anche che cosa è esposto se la carta finisce in mani sbagliate: con il debito il conto, con il credito il plafond, con la prepagata solo quello che c'è sopra.'''),
    BK('Quale carta ha più senso?', ['Debito', 'Credito', 'Prepagata'], [
      ('La spesa di tutti i giorni', 0, 'I soldi escono subito dal conto: vedi sempre quanto ti resta.'),
      ("La cauzione per un'auto a noleggio", 1, 'Il blocco cade sul plafond e non sui soldi del conto. Molti noleggi accettano solo carte di credito.'),
      ('Un acquisto su un sito che non conosci', 2, 'Se qualcosa va storto è esposto solo quello che hai caricato, non il conto.'),
      ('Un prelievo di contanti al bancomat', 0, 'Con la carta di credito il prelievo è un piccolo prestito, e paga una commissione a parte.'),
      ('La paghetta di un figlio di 14 anni', 2, 'La carichi tu, e non può spendere più di quello che c\'è sopra.'),
      ('Una spesa grossa da pagare il mese dopo', 1, 'La carta di credito a saldo addebita il mese dopo, senza interessi.')],
      after='Non esiste la carta migliore: ognuna sposta il momento in cui escono i soldi, e quello che metti a rischio.'),
    P('Dove la carta di credito costa', r'''
Usata a saldo, la carta di credito non costa interessi. I costi arrivano da tre punti che è facile non vedere.

• **Le rate.** Se invece di restituire tutto il mese dopo scegli di pagare a rate, la carta diventa **revolving**: sul debito che resta paghi interessi, spesso molto alti.
• **Il contante.** Prelevare con la carta di credito non è un prelievo normale: è un **anticipo di contante**, cioè un piccolo prestito, e ha una commissione a parte. Con una commissione del 4%, per esempio, 250 € prelevati ne costano 10.
• **Il canone.** Molte carte di credito hanno un costo fisso ogni anno.

Regola pratica: la carta di credito conviene se la usi a saldo e non ci prelevi mai contanti.'''),
    P("All'estero: in che valuta paghi?", r'''
Fuori dall'area dell'euro, il terminale del negozio o il bancomat spesso ti fanno una domanda: vuoi pagare nella valuta del posto, o direttamente in euro?

Sembra una gentilezza, ma è un servizio a pagamento.

• Se scegli gli **euro**, il cambio lo decide chi gestisce il terminale, e ci aggiunge un suo margine.
• Se scegli la **valuta del posto**, il cambio lo fa il circuito della tua carta. La tua banca aggiunge la sua commissione, che trovi nel contratto.

Di solito la seconda strada costa meno. Nell'Unione europea chi ti propone gli euro deve mostrarti prima il ricarico che applica, e tu hai sempre il diritto di rifiutare.

Lo stesso vale quando prelevi a un bancomat all'estero.'''),
    N(r'''
A Londra il conto del ristorante è di 100 sterline. Il terminale ti mostra due scelte:

• pagare 100 sterline
• pagare 129 €

Se scegli le sterline, il circuito della tua carta le converte a 1,20 € per sterlina e la tua banca aggiunge una commissione del 2,5%. Quanti euro risparmi scegliendo le sterline?''', 6, '€',
      r'In sterline: \(100 \times 1{,}20 = 120\) €, più la commissione del 2,5%, cioè 3 €. In tutto 123 €. In euro il terminale chiedeva 129 €: \(129 - 123 =\) **6 €** in più per lo stesso pranzo. È il margine di chi gestisce il terminale.'),
    Q('Che differenza c\'è tra pagare a saldo e pagare a rate (revolving) con una carta di credito?', ['A saldo restituisci tutto il mese dopo senza interessi, a rate paghi interessi sul debito che resta', 'A saldo i soldi escono subito dal conto, a rate il mese dopo', 'Nessuna: sono due nomi della stessa cosa'], 0,
      'A saldo la banca ti anticipa le spese del mese e le addebita tutte insieme il mese dopo, senza interessi. Con il rimborso a rate il debito resta aperto e ogni mese produce interessi, spesso alti.'),
    Q("A New York un bancomat ti chiede se vuoi l'addebito in dollari o in euro. Di solito che cosa conviene?", ['In euro: vedi subito la cifra esatta', 'In dollari: il cambio lo fa il circuito della tua carta', 'È uguale: il cambio è lo stesso'], 1,
      "Se scegli gli euro, il cambio lo decide chi gestisce il bancomat, con un suo margine. Scegliendo la valuta del posto, il cambio lo fa il circuito della tua carta, e di solito costa meno. Vedere subito la cifra in euro è comodo, ma quella comodità si paga."),
    Q("Per un'auto a noleggio devi lasciare una cauzione di 500 €. Perché in questo caso è più comoda la carta di credito?", ['Perché la cauzione costa meno', 'Perché non serve il PIN', 'Perché il blocco cade sul plafond e non sui soldi del conto'], 2,
      'La cauzione è una pre-autorizzazione: i soldi non escono, ma restano bloccati per giorni. Con la carta di debito quei 500 € spariscono dal saldo che puoi usare. Con la carta di credito si riduce solo il plafond.'),
  ], 'Debito: i soldi escono subito. Credito: il mese dopo, e a rate diventa cara. Prepagata: è esposto solo quello che carichi. All\'estero scegli la valuta del posto.'),

  LF('basi-11-3', 'IBAN', 'Bonifici, IBAN e addebiti diretti', 7, [
    G('Venerdì sera alle 22 ordini dall\'app un bonifico normale, non istantaneo. Entro quando, al più tardi, i soldi devono arrivare alla banca di chi li riceve?',
      "Ogni banca ha un **orario limite**: un ordine che arriva dopo vale come ricevuto il giorno lavorativo seguente, cioè lunedì. Da lì la banca ha tempo fino alla fine del giorno lavorativo successivo: **martedì**. Sabato e domenica non contano. Con un **bonifico istantaneo** gli stessi soldi arrivano in dieci secondi, anche di notte e la domenica.",
      options=['Sabato', 'Lunedì', 'Martedì'], ans=2),
    P('Due velocità', r'''
**Un bonifico sposta soldi dal tuo conto a un altro. Oggi ha due velocità, e per legge la più veloce non può costare di più.**

| Bonifico | Ordinario | Istantaneo |
|---|---|---|
| Arriva | entro un giorno lavorativo | in 10 secondi |
| Quando | nei giorni lavorativi | sempre |
| Si ferma? | a volte, finché non parte | no |

Dal 2025, nei Paesi dell'euro, ogni banca deve offrire il **bonifico istantaneo** e non può farlo pagare più di quello ordinario.

La velocità ha un rovescio. Dopo dieci secondi i soldi sono sul conto dell'altro e non si torna indietro: per riaverli serve che sia lui a restituirli. Per questo l'istantaneo va bene con chi conosci, meno con uno sconosciuto.

Hai anche un diritto poco noto: puoi chiedere alla banca di fissare un **tetto** ai tuoi bonifici istantanei, al giorno o per singola operazione. Se qualcuno entra nel tuo conto, con un istantaneo più di quello non esce.'''),
    G("Stai preparando un bonifico e sbagli a battere una cifra dell'IBAN. Che cosa succede?",
      "L'**IBAN** è l'indirizzo del conto, e contiene due cifre di controllo calcolate su tutte le altre. Se sbagli una cifra il conto non torna, e la banca rifiuta l'IBAN prima ancora che il bonifico parta. L'errore davvero pericoloso è un altro: un IBAN scritto giusto, ma di un'altra persona. Quello passa. Per anni, infatti, la banca non ha guardato il nome: guardava solo l'IBAN.",
      options=['I soldi finiscono sul conto di uno sconosciuto', "La banca rifiuta l'IBAN prima che il bonifico parta", 'Il bonifico parte e torna indietro dopo qualche giorno'], ans=1),
    P('Il controllo del nome', r'''
**Dal 9 ottobre 2025 la banca non guarda più solo l'IBAN: controlla anche il nome.**

Prima che tu confermi un bonifico fa la **verifica del beneficiario**: confronta il nome che hai scritto con quello a cui è intestato il conto. È gratis e vale per tutti i bonifici in euro. Gli esiti possibili sono quattro:

• il nome **corrisponde**;
• corrisponde **in parte**, e la banca ti mostra il nome giusto;
• **non corrisponde**;
• verifica **non possibile**.

Puoi confermare in ogni caso. Ma se ignori un avviso e i soldi finiscono sul conto sbagliato, la responsabilità è tua.

C'è poi una regola sull'IBAN che molti ignorano: un IBAN di un altro Paese europeo vale quanto uno italiano. Nessuna azienda può rifiutarlo per pagarti lo stipendio o per addebitarti una bolletta.'''),
    Q("Un fornitore ti scrive per email che ha cambiato banca e ti manda il nuovo IBAN. Prepari il bonifico e la banca ti avvisa: il nome non corrisponde. Che cosa fai?", ["Confermo: l'IBAN è valido, quindi il bonifico arriva", 'Lo rifaccio come istantaneo, così arriva subito', 'Mi fermo e chiamo il fornitore a un numero che conosco già'], 2,
      "È lo schema di una truffa molto diffusa: qualcuno si inserisce nella corrispondenza e sostituisce l'IBAN. Un IBAN valido dice solo che quel conto esiste, non di chi è. Chiama il fornitore a un numero che avevi già, non a quello scritto nell'email. Con un istantaneo, poi, i soldi non tornerebbero indietro."),
    P("L'addebito diretto: quando preleva l'altro", r'''
Con un bonifico sei tu a **spingere** i soldi. Con un **addebito diretto**, quello di bollette, rate e abbonamenti, è l'azienda a **tirarli** dal tuo conto, perché le hai firmato un permesso: il mandato.

È comodo, ma stai dando a un altro le chiavi. Per questo hai tre protezioni.

• **8 settimane.** Per un addebito in euro che avevi autorizzato puoi chiedere il rimborso alla tua banca entro 8 settimane, senza spiegare il motivo. La banca ha 10 giorni lavorativi per rimborsare o dirti perché no.
• **13 mesi.** Se l'addebito non l'avevi mai autorizzato, il tempo sale a 13 mesi.
• **Limiti e blocchi.** Puoi chiedere alla banca di fissare un importo massimo, di bloccare una certa azienda, o di accettare addebiti solo da quelle che indichi tu.

Attenzione: il rimborso non cancella il debito. Se la bolletta era giusta, l'azienda può chiederti comunque di pagarla.'''),
    BK('Entro quando puoi chiedere i soldi indietro alla banca?', ['8 settimane', '13 mesi', 'Non è previsto'], [
      ('La bolletta addebitata è il doppio del solito', 0, "L'addebito era autorizzato da un mandato: hai 8 settimane, e non devi spiegare il motivo."),
      ('Un addebito da una società mai autorizzata', 1, 'Senza un mandato firmato da te non è autorizzato: hai 13 mesi.'),
      ('Un bonifico istantaneo a un venditore sparito', 2, "L'hai ordinato tu, e la banca lo ha solo eseguito. Resta la denuncia, non un rimborso dalla banca."),
      ('Una palestra che non usi più ti preleva 30 €', 0, "Il mandato c'era: valgono le 8 settimane. Poi però il contratto va disdetto."),
      ("Un bonifico confermato ignorando l'avviso sul nome", 2, "Hai ignorato l'avviso: la banca può solo provare a farsi restituire i soldi, senza garanzie."),
      ('Un addebito attivato da un altro usando il tuo IBAN', 1, 'Il permesso non lo hai dato tu: non è autorizzato, hai 13 mesi.')],
      after='Se a prelevare è un altro, hai tempo per farti ridare i soldi. Se li hai spinti tu, tornano solo se chi li ha ricevuti li restituisce.'),
    Q("Hai un conto con IBAN tedesco. Il tuo datore di lavoro dice che può accreditare lo stipendio solo su un IBAN italiano. Ha ragione?", ['No: un IBAN di un altro Paese europeo vale quanto uno italiano', 'Sì: per lo stipendio serve un IBAN italiano', "Sì, ma solo se l'azienda è piccola"], 0,
      "Per bonifici e addebiti in euro le regole europee vietano di rifiutare un IBAN solo perché è di un altro Paese dell'area. Vale per stipendi, pensioni, bollette e rimborsi."),
    Q('Perché un bonifico istantaneo chiede più attenzione di uno ordinario?', ['Perché per legge costa di più', 'Perché dopo pochi secondi non si può più fermare', 'Perché funziona solo tra clienti della stessa banca'], 1,
      "Costa come un bonifico ordinario e funziona tra banche diverse. La differenza è il tempo: in dieci secondi i soldi sono sul conto dell'altro, e da lì tornano solo se è lui a restituirli."),
  ], "L'istantaneo arriva in 10 secondi e non si ferma: guarda l'esito della verifica del nome prima di confermare. Addebiti diretti: 8 settimane per il rimborso, 13 mesi se non li avevi autorizzati."),

  LF('basi-11-4', '100k', 'Se la banca fallisce', 7, [
    G('Hai 130.000 € su un conto corrente e la banca fallisce. Quanti di quei soldi ti restituisce il fondo di garanzia dei depositi?',
      "Il **fondo di garanzia** rimborsa fino a **100.000 €** per ogni persona e per ogni banca, di norma entro 7 giorni lavorativi. Gli altri 30.000 € non spariscono, ma entrano nella procedura di fallimento: puoi riaverne una parte, e ci vogliono anni. La regola è la stessa in tutta l'Unione europea. Sono i dettagli a cambiare il risultato.",
      lo=0, hi=130000, step=5000, truth=100000, near=5000),
    P('Per persona e per banca', r'''
**Il limite di 100.000 € non vale per ogni conto: vale per persona e per banca.**

Da qui vengono tre conseguenze poco intuitive.

• **Più conti nella stessa banca si sommano.** Con 90.000 € sul conto corrente e 20.000 € sul conto deposito della stessa banca, i soldi protetti sono 100.000 €, non 110.000 €.
• **Banche diverse, limiti diversi.** Gli stessi 110.000 € divisi tra due banche sono protetti tutti.
• **Un conto cointestato si divide.** Se è intestato a due persone, metà conta per te e metà per l'altro, e ognuno ha il suo limite. La tua metà si somma agli altri conti che hai in quella banca.

[fig]

Attenzione ai nomi: due marchi diversi possono essere la stessa banca. Conta la banca scritta nel contratto.''',
      fig=F([('Tutto in una banca', '110.000 €', [(100000, 'Protetti', OK, '100.000 €'), (10000, 'Fuori', INT, '10.000 €')]), ('Diviso tra due banche', '110.000 €', [(110000, 'Protetti', OK, '110.000 €')])])),
    LV('Metti i soldi al riparo', 'In banca A hai un conto tuo e uno cointestato con tua sorella. Puoi aprirne uno in banca B.', 'garanzia', dict(lim=100000),
      [dict(id='a', label='Conto tuo, banca A', min=0, max=150000, step=10000, start=90000, unit='€'),
       dict(id='co', label='Cointestato in due, banca A', min=0, max=200000, step=10000, start=100000, unit='€'),
       dict(id='b', label='Conto tuo, banca B', min=0, max=150000, step=10000, start=0, unit='€')],
      [dict(label='Azzera i soldi fuori dalla garanzia, tenendo almeno 140.000 € tuoi', cond=[['fuori', '<=', 0], ['tuoi', '>=', 140000]], hint='In banca A la tua parte è il tuo conto più metà del cointestato. Sposta in banca B quello che supera 100.000 €.'),
       dict(label='Ora arriva a 200.000 € tuoi, tutti protetti', cond=[['fuori', '<=', 0], ['tuoi', '>=', 200000]], hint='Servono 100.000 € di parte tua in banca A e 100.000 € in banca B.')],
      'Con due banche il massimo protetto è 200.000 €: per andare oltre serve una terza banca. E del conto cointestato conta solo la tua metà.'),
    P('Che cosa è coperto, e che cosa no', r'''
La garanzia copre i **depositi**: conti correnti, conti deposito, libretti di risparmio, assegni circolari.

Non copre quello che deposito non è. E qui i casi sono molto diversi tra loro.

• **I titoli che la banca custodisce per te**, come titoli di Stato, quote di fondi, azioni di altre società. Non hanno bisogno della garanzia: sono tuoi, non della banca, e restano fuori dal fallimento. Lo stesso vale per una cassetta di sicurezza.
• **Le obbligazioni e le azioni della banca stessa.** Se hai le sue **obbligazioni** le hai prestato dei soldi. Se hai le sue **azioni** ne sei socio. In una crisi gli azionisti sono i primi a perdere, e le obbligazioni possono essere ridotte o trasformate in azioni.
• **La parte dei depositi oltre 100.000 €.** Non è garantita, ma è l'ultima a essere toccata: prima vengono azionisti e obbligazionisti.

Quindi la domanda giusta non è solo quanto hai in banca, ma che cosa hai.'''),
    BK('La banca fallisce. Che cosa succede a...', ['Garantito', 'Resta tuo', 'A rischio'], [
      ('Il saldo del conto corrente', 0, 'È un deposito: garantito fino a 100.000 €.'),
      ('Un conto deposito vincolato', 0, 'Anche questo è un deposito. Si somma agli altri conti che hai in quella banca.'),
      ('Titoli di Stato nel deposito titoli', 1, 'La banca li custodisce, ma sono tuoi: non entrano nel fallimento.'),
      ('Obbligazioni emesse dalla banca stessa', 2, 'Sono un prestito che hai fatto alla banca: possono essere ridotte o trasformate in azioni.'),
      ('Azioni della banca stessa', 2, 'Sei socio della banca: gli azionisti sono i primi a perdere.'),
      ('Quote di un fondo nel deposito titoli', 1, 'Come i titoli di Stato: sono tue, la banca le custodisce soltanto.'),
      ('La parte del conto oltre 100.000 €', 2, 'Sopra il limite la garanzia non arriva: quei soldi entrano nella procedura di fallimento.')],
      after='I depositi sono garantiti fino al limite. I titoli emessi da altri restano tuoi. Quello che ha emesso la banca segue la sorte della banca.'),
    P('Tre casi da conoscere', r'''
**Banche di altri Paesi europei.** Molte banche online lavorano in Italia con la licenza di un altro Paese dell'Unione. I tuoi depositi sono garantiti dal fondo di quel Paese, con lo stesso limite di 100.000 €.

**Somme alte per poco tempo.** Hai venduto casa, incassato una liquidazione o un risarcimento, e per qualche mese sul conto c'è molto più di 100.000 €. Per nove mesi dall'accredito quelle somme sono protette anche oltre il limite.

**App e carte che non sono banche.** Alcuni conti e alcune carte prepagate sono di **istituti di pagamento** o di moneta elettronica, che banche non sono. Lì il fondo di garanzia non c'entra. La tutela è un'altra: l'istituto deve tenere i soldi dei clienti separati dai propri, così restano dei clienti anche se l'istituto fallisce.

Per sapere chi hai davanti guarda il contratto, oppure cerca il nome negli albi sul sito della Banca d'Italia.'''),
    Q('Luca ha 80.000 € sul conto corrente e 40.000 € su un conto deposito, nella stessa banca. Se la banca fallisce, quanto gli rimborsa il fondo di garanzia?', ['120.000 €', '100.000 €', '80.000 €'], 1,
      r"I conti nella stessa banca si sommano: \(80.000 + 40.000 = 120.000\) €. Il limite è **100.000 €** per persona e per banca: i 20.000 € in più restano fuori. Con il conto deposito in un'altra banca sarebbero stati protetti tutti."),
    Q('Anna e Paolo hanno un conto cointestato con 180.000 € e nessun altro conto in quella banca. Se la banca fallisce, quanto è protetto in tutto?', ['180.000 €', '100.000 €', '90.000 €'], 0,
      r'Il conto cointestato si divide: \(\dfrac{180.000}{2} = 90.000\) € a testa. Ognuno ha il suo limite di 100.000 €, quindi i 90.000 € di ciascuno sono protetti. In tutto **180.000 €**.'),
    Q("Tieni 3.000 € su una carta prepagata emessa da un istituto di moneta elettronica, che non è una banca. Se l'istituto fallisce, che cosa succede a quei soldi?", ['Li rimborsa il fondo di garanzia dei depositi', 'Sono persi', "Restano tuoi: l'istituto deve tenerli separati dai propri"], 2,
      "Il fondo di garanzia dei depositi riguarda le banche. Gli istituti di pagamento e di moneta elettronica hanno una tutela diversa: i soldi dei clienti vanno tenuti separati dal patrimonio dell'istituto, e per questo non finiscono nel suo fallimento."),
  ], 'Garanzia dei depositi: 100.000 € per persona e per banca. I conti nella stessa banca si sommano, il cointestato si divide. I titoli in custodia restano tuoi, quelli emessi dalla banca seguono la sua sorte.'),

  LF('basi-11-5', 'PIN', 'Pagare online e con il telefono', 7, [
    G('Perdi la carta contactless. Chi la trova non conosce il PIN. Quanto riesce a spendere, al massimo, prima che la carta lo chieda?',
      "Ogni pagamento senza PIN può arrivare a 50 €. Ma la carta tiene il conto: dopo **150 €** in tutto, oppure dopo **cinque pagamenti** di fila (lo sceglie la banca), torna a chiedere il PIN. Nel caso peggiore sono cinque pagamenti da 50 €. E quei soldi, come vedrai, tornano quasi tutti indietro.",
      options=['Un solo pagamento, fino a 50 €', 'Qualche centinaio di euro', "Tutto quello che c'è sul conto"], ans=1),
    P('Due prove su tre', r'''
**Per far partire un pagamento la banca deve essere sicura che sei tu. La regola europea chiede due prove di tipo diverso.**

• Qualcosa che **sai**: il PIN, una password.
• Qualcosa che **hai**: la carta, il telefono.
• Qualcosa che **sei**: l'impronta, il volto.

Si chiama **autenticazione forte**. Al negozio sono carta e PIN. Online sono, per esempio, l'app della banca sul tuo telefono e l'impronta.

Ci sono eccezioni pensate per la comodità: i pagamenti contactless piccoli, gli acquisti online di pochi euro, gli abbonamenti dopo il primo addebito.

Con il telefono è diverso. Nel portafoglio digitale non c'è il numero vero della carta, ma un numero sostitutivo che vale solo per quel dispositivo. E di norma ogni pagamento passa dallo sblocco con impronta, volto o codice. Una carta contactless persa può fare qualche pagamento senza PIN. Un telefono bloccato, no.'''),
    P('Chi paga, se non sei stato tu', r'''
**Se un pagamento non l'hai autorizzato tu, per legge i soldi te li ridà la banca.**

• Hai **13 mesi** dall'addebito per dire alla banca che non lo riconosci. Prima lo fai, meglio è.
• La banca deve rimborsarti subito: al più tardi entro la fine del giorno lavorativo successivo.
• Se la carta era stata persa o rubata, può restare a tuo carico **al massimo 50 €**, e solo per quello che è successo prima della tua segnalazione. Dopo il blocco, niente.
• Se il pagamento è passato senza autenticazione forte, la perdita è della banca.

C'è un'eccezione, ed è larga: la banca può rifiutare il rimborso se dimostra una tua **colpa grave**. Gli esempi tipici: tenere il PIN scritto insieme alla carta, oppure dare a qualcuno i codici di conferma.

Ed è qui che lavorano i truffatori di oggi. Non rubano la carta: convincono te a dare il via. Un pagamento confermato da te, anche con l'inganno, per la banca è un pagamento autorizzato.'''),
    BK('Chi rischia di rimetterci?', ['Rimborsa la banca', 'Rischi di pagare tu'], [
      ('Clonano la carta e comprano online. Tu non hai confermato niente', 0, 'Non lo hai autorizzato: la banca deve rimborsare entro il giorno lavorativo successivo alla tua segnalazione.'),
      ('Un finto operatore della banca ti chiama e gli detti il codice arrivato per SMS', 1, 'Con quel codice il pagamento risulta confermato da te. La banca può parlare di colpa grave e rifiutare il rimborso.'),
      ('Ti rubano il portafoglio: tre pagamenti contactless prima che tu blocchi la carta', 0, 'Sono pagamenti non autorizzati: a tuo carico restano al massimo 50 €, e niente dopo il blocco.'),
      ('Fai un bonifico a un venditore che poi sparisce', 1, "Lo hai ordinato tu: per la banca è autorizzato. Resta la denuncia, ma non c'è un rimborso automatico."),
      ('Tenevi il PIN su un foglietto insieme alla carta, e ti rubano tutto', 1, 'PIN e carta custoditi insieme sono il caso classico di colpa grave: la banca può lasciarti tutta la perdita.'),
      ('Un acquisto online passa senza che ti arrivi nessuna richiesta di conferma', 0, 'Senza autenticazione forte, e senza che tu abbia fatto nulla, la perdita è della banca.')],
      after='Il confine è uno solo: chi ha dato il via. Se non sei stato tu, rimborsa la banca. Se sei stato tu, anche ingannato, riavere i soldi è molto più difficile.'),
    OR('Un pagamento che non hai fatto: in che ordine ti muovi?', ["Blocchi la carta dall'app", 'Dici alla banca che non lo riconosci', 'Se rifiuta il rimborso, fai reclamo scritto', "Se non basta, vai dall'Arbitro Bancario"],
      x='Tocca le mosse dalla prima all\'ultima.',
      after="Al reclamo su un pagamento la banca deve rispondere entro 15 giorni lavorativi. Il ricorso all'Arbitro Bancario Finanziario costa 20 €, che tornano indietro se hai ragione, e non serve un avvocato."),
    P('Carta o bonifico: la tutela non è la stessa', r'''
Altro caso: hai pagato tu, ma il pacco non arriva o il venditore sparisce. Non è un pagamento non autorizzato, perché lo hai fatto tu. Quello che puoi fare dipende da come hai pagato.

• **Con la carta** puoi chiedere alla tua banca di aprire una contestazione presso il circuito, il **chargeback**. Non è un diritto scritto nella legge: è una regola dei circuiti delle carte, e di solito va chiesto entro 120 giorni dall'addebito.
• **Con un bonifico** la banca ha solo eseguito il tuo ordine: non ha niente da contestare. Puoi rivalerti solo sul venditore.

Per questo chi truffa chiede bonifici, ricariche di carte prepagate o buoni regalo: sono pagamenti che non tornano indietro.

Regola pratica: con chi non conosci paga con la carta. E diffida di chi offre uno sconto in cambio di un bonifico.'''),
    Q('Ti rubano la carta e, prima che tu la blocchi, spendono 400 €. Non hai colpe gravi. Quanto può restare a tuo carico, al massimo?', ['Niente, in ogni caso', '50 €', '400 €'], 1,
      'Per i pagamenti fatti con una carta persa o rubata prima della tua segnalazione, la legge lascia a tuo carico al massimo **50 €**. Il resto lo rimborsa la banca. Dopo il blocco non rispondi più di nulla.'),
    Q('Ti chiama la banca: c\'è un pagamento sospetto, e per bloccarlo serve il codice che ti è appena arrivato per SMS. Che cosa fai?', ['Detto il codice: serve a bloccare la frode', 'Detto solo le prime cifre', 'Riattacco e chiamo io la banca, al numero scritto sulla carta'], 2,
      'Un codice serve ad autorizzare un pagamento, mai a bloccarlo. La banca non chiede codici al telefono, e il numero che compare sullo schermo può essere falsificato. Se detti il codice, il pagamento risulta confermato da te e il rimborso diventa difficile.'),
    Q('Compri un telefono su un sito che non conosci. Quale pagamento ti lascia una strada per riavere i soldi, se il pacco non arriva?', ['Con la carta', 'Con un bonifico istantaneo', 'Ricaricando la carta prepagata del venditore'], 0,
      'Con la carta puoi chiedere alla banca il chargeback, di solito entro 120 giorni. Bonifico e ricarica sono soldi che hai spinto tu: tornano solo se il venditore li restituisce.'),
  ], 'Se non hai autorizzato tu, rimborsa la banca: a tuo carico al massimo 50 €. Se hai dato tu il via, anche ingannato, è molto più difficile. Con chi non conosci paga con la carta, non con un bonifico.'),
])

# Unità 12: lo stipendio (Italia). Regole del 2026: IRPEF 23/33/43%, contributi 9,19% + 23,81%, detrazione per lavoro dipendente, taglio del cuneo, NASpI, TFR.
# I numeri di Marco (RAL 30.000 €, Milano, nessun familiare a carico, 13 mensilità) escono dagli stessi conti delle leve (STIP in p35_steps.js),
# verificati su una tabella pubblicata: vedi FONTI_BASI.md. Vanno rifatti ogni anno, dopo la legge di bilancio.
U12 = dict(id='basi-u12', sid='basi-stipendio', name='Lo stipendio', lessons=[
  LF('basi-12-1', 'RAL', 'Dal lordo al netto', 7, [
    G('Marco vive a Milano e ha una RAL di 30.000 €: è lo stipendio lordo di un anno, pagato in 13 mensilità. Quanto gli arriva sul conto ogni mese, in media?',
      r"Divisi per 13, i 30.000 € farebbero 2.308 € lordi al mese. Sul conto ne arrivano circa **1.802**: il 78%. In mezzo ci sono tre trattenute, e conoscerle serve a capire quanto vale davvero un'offerta di lavoro o un aumento.",
      lo=1000, hi=2600, step=20, truth=1802, near=60),
    P("Tre trattenute, in quest'ordine", r'''
**Tra il lordo e il netto ci sono tre trattenute, e l'ordine conta.**

La **RAL** è la retribuzione annua lorda: la cifra scritta nel contratto.

• Per primi si tolgono i **contributi**: il 9,19% va all'INPS, soprattutto per la tua pensione. Quello che resta è l'**imponibile fiscale**.
• Sull'imponibile si calcola l'**IRPEF**, l'imposta sul reddito, che va allo Stato.
• Per ultime le **addizionali**: due imposte più piccole, una per la Regione e una per il Comune. Cambiano secondo dove vivi.

Ecco i 30.000 € di Marco, che non ha familiari a carico:

[fig]

Con la stessa RAL, ma in un'altra città o con un figlio a carico, il netto cambia. Per questo due colleghi con lo stesso contratto possono ricevere cifre diverse.''',
      fig=F([('La RAL di Marco', '30.000 €', [(23425, 'Netto', OK, '23.425 €'), (2757, 'Contributi', CAP, '2.757 €'), (3222, 'IRPEF', INT, '3.222 €'), (596, 'Addizionali', 'giallo', '596 €')])], cap='Regole del 2026, residenza a Milano.')),
    LV('Quanto resta di una RAL', 'Marco vive a Milano e non ha familiari a carico. Muovi la RAL e guarda il netto, su 13 mensilità.', 'netto', dict(mens=13),
      [dict(id='ral', label='RAL', min=18000, max=60000, step=500, start=30000, unit='€')],
      [dict(label='Trova la RAL che porta in tasca almeno 2.000 € al mese', cond=[['netto', '>=', 2000]], hint='Servono circa 5.000 € lordi in più per avere 200 € netti in più al mese.'),
       dict(label='Trova una RAL a cui di 1.000 € lordi in più te ne restano meno di 400', cond=[['resta', '<', 400]], hint='Guarda la riga sotto il netto e sali ancora un poco.')],
      "Tra circa 35.000 e 44.000 € di RAL un aumento rende poco: oltre all'IRPEF al 33% si riducono le detrazioni. Il netto sale sempre, quindi un aumento non va mai rifiutato. Ma in quella fascia il lordo inganna più che altrove."),
    P('Leggere la busta paga', r'''
La busta paga ha tre zone.

• **In alto, chi sei**: livello, data di assunzione, ferie e permessi che ti restano.
• **Al centro, il mese**: paga base, straordinari e premi, poi le trattenute.
• **In basso, i totali**: imponibile previdenziale, imponibile fiscale, IRPEF, netto.

Oltre al netto conviene guardare tre cose.

• L'**imponibile previdenziale**: è la cifra su cui si calcolano i contributi, quindi la tua pensione. Deve comprendere tutto quello che ti pagano.
• Il **TFR** maturato.
• Le **ferie residue**: sono soldi tuoi anche quelle.

E ci sono due sorprese normali. La **tredicesima** è più bassa di una mensilità, perché le detrazioni sono già state distribuite sulle altre dodici. E a fine anno arriva il **conguaglio**: l'azienda rifà i conti dell'IRPEF sull'anno intero, e una busta può uscire più leggera o più pesante del solito.'''),
    BK('A chi va questa trattenuta?', ['INPS', 'Stato', 'Regione o Comune'], [
      ('I contributi del 9,19%', 0, "Vanno all'INPS: servono soprattutto per la pensione."),
      ('IRPEF', 1, "È l'imposta sul reddito: va allo Stato."),
      ('Addizionale regionale', 2, "È un'imposta in più sul reddito, decisa dalla Regione."),
      ('Addizionale comunale', 2, 'La decide il Comune in cui vivi, e alcuni non la applicano.'),
      ("L'1% in più sugli stipendi alti", 0, "È un contributo aggiuntivo per la pensione, dovuto sulla parte di stipendio oltre 56.224 € l'anno.")],
      after="I contributi vanno all'INPS e tornano a te come pensione e tutele. Le imposte vanno a Stato, Regione e Comune e pagano i servizi di tutti."),
    Q("Che cos'è l'imponibile fiscale?", ['La RAL divisa per le mensilità', "La RAL meno i contributi: la cifra su cui si calcola l'IRPEF", 'Il netto che arriva sul conto'], 1,
      "Prima si tolgono i contributi, poi sul resto si calcola l'IRPEF. Quel resto è l'**imponibile fiscale**. Per Marco: 30.000 € meno 2.757 € di contributi, cioè 27.243 €."),
    Q('Perché la tredicesima è più bassa di una mensilità normale?', ['Perché su quella mensilità non ci sono le detrazioni', 'Perché sulla tredicesima non si versano i contributi', 'Perché vale mezzo stipendio'], 0,
      "Le detrazioni dell'anno sono distribuite sulle dodici mensilità ordinarie. Sulla tredicesima l'IRPEF si paga piena, e per questo il netto è più basso, anche se il lordo è lo stesso."),
    Q('Due colleghi hanno la stessa RAL e lo stesso contratto, ma ricevono netti diversi. Quale può essere il motivo?', ["Uno dei due ha scaglioni IRPEF diversi", 'Uno dei due non versa i contributi', 'Vivono in Comuni diversi, oppure uno ha familiari a carico'], 2,
      "Gli scaglioni dell'IRPEF e i contributi sono uguali per tutti. Cambiano le addizionali, che dipendono da Regione e Comune, e le detrazioni, che dipendono anche dalla famiglia."),
  ], "RAL meno contributi fa l'imponibile fiscale; da lì si tolgono IRPEF e addizionali. Con 30.000 € di RAL a Milano restano circa 1.800 € al mese su 13 mensilità."),

  LF('basi-12-2', 'INPS', 'I contributi: dove vanno', 7, [
    G("Marco ha una RAL di 30.000 €. Tra stipendio, contributi versati dall'azienda e TFR, quanto costa all'azienda in un anno, come minimo?",
      r"Sopra la RAL l'azienda versa all'INPS un altro 23,81% per la pensione di Marco: 7.143 €. E mette da parte il TFR: 2.222 €. Fa **39.365 €**, e mancano ancora le voci minori per malattia, disoccupazione e infortuni, che cambiano da settore a settore. Marco costa quasi 40.000 € e sul conto ne riceve circa 23.400.",
      lo=30000, hi=50000, step=500, truth=39365, near=1500),
    P('Il 33% che non vedi', r'''
**Per ogni 100 € di stipendio lordo, 33 € vanno all'INPS per la tua pensione. Tu ne vedi solo una parte.**

• **9,19 €** li versi tu: sono la trattenuta che trovi in busta paga.
• **23,81 €** li versa l'azienda, in aggiunta al tuo lordo. In busta paga non compaiono.

[fig]

Non sono una tassa. Vengono registrati a tuo nome, anno dopo anno, e sono la base su cui si calcolerà la tua pensione.

C'è poi un vantaggio che pochi notano: i contributi che versi tu si tolgono dal reddito **prima** di calcolare l'IRPEF. Su quei soldi, quindi, non paghi imposte.''',
      fig=F([('Su 100 € di lordo', '33 €', [(9.19, 'Versati da te', CAP, '9,19 €'), (23.81, "Versati dall'azienda", OK, '23,81 €')])])),
    P('Che cosa ti comprano', r'''
Oltre alla pensione, i contributi pagano le tutele che scattano quando non puoi lavorare.

• **Malattia e maternità**: lo stipendio continua, in tutto o in parte.
• **Infortuni**: cure e indennità se ti fai male lavorando.
• **Disoccupazione**: se perdi il lavoro senza averlo scelto, hai diritto alla **NASpI**.

La NASpI ha regole precise, utili da conoscere prima che servano:

• vale circa il 75% dello stipendio medio, con un tetto di 1.584,70 € al mese nel 2026;
• dal sesto mese scende del 3% ogni mese;
• dura **la metà** del periodo in cui hai versato contributi negli ultimi quattro anni, fino a 24 mesi;
• la domanda va fatta entro 68 giorni dalla fine del lavoro. Dopo, il diritto si perde.'''),
    N('Sara ha lavorato 30 mesi negli ultimi quattro anni, poi il suo contratto è scaduto. Per quanti mesi, al massimo, può ricevere la NASpI?', 15, 'mesi',
      r'La NASpI dura la metà del periodo in cui hai versato contributi negli ultimi quattro anni: \(\dfrac{30}{2} =\) **15 mesi**.'),
    P('Controlla che siano stati versati', r'''
I contributi li versa l'azienda, anche la parte tua. Tu vedi la trattenuta in busta paga, ma non vedi se i soldi sono arrivati all'INPS.

Per saperlo c'è l'**estratto conto contributivo**: l'elenco, anno per anno, di quello che è stato versato a tuo nome. Si consulta gratis sul sito dell'INPS, entrando con SPID o con la carta d'identità elettronica.

Conviene guardarlo ogni tanto, per due motivi.

• I contributi non versati si possono recuperare, ma non per sempre: dopo **cinque anni** vanno in prescrizione. Se entro quei cinque anni fai una segnalazione all'INPS, il tempo sale a dieci.
• Un buco scoperto dopo vent'anni, magari con l'azienda ormai chiusa, vuol dire una pensione più bassa.

Bastano cinque minuti una volta l'anno.'''),
    BK('Contributo o imposta?', ['Contributo', 'Imposta'], [
      ('Il 9,19% trattenuto in busta paga', 0, "Va all'INPS e viene registrato a tuo nome."),
      ('IRPEF', 1, 'Va allo Stato e paga i servizi di tutti: non è legata a quello che riceverai tu.'),
      ('La quota per la disoccupazione', 0, 'Paga la NASpI: è una tutela per chi perde il lavoro.'),
      ('Addizionale comunale', 1, "È un'imposta: va al Comune."),
      ('Il premio per gli infortuni sul lavoro', 0, 'Paga cure e indennità se ti fai male lavorando.'),
      ('Imposta di bollo sul conto corrente', 1, "È un'imposta che la banca incassa per lo Stato.")],
      after="Un contributo ti torna indietro, come pensione o come tutela. Un'imposta finanzia i servizi di tutti."),
    Q("Su uno stipendio lordo di 2.000 €, quanto arriva in tutto all'INPS per la pensione, sommando la tua parte e quella dell'azienda?", ['184 €', '476 €', '660 €'], 2,
      r"Il 33% di 2.000 €: \(2.000 \times 33\% =\) **660 €**. Di questi, 184 € sono la tua trattenuta del 9,19% e 476 € li aggiunge l'azienda."),
    Q("Scopri che tre anni fa l'azienda non ha versato i tuoi contributi per sei mesi. Sei ancora in tempo per farli recuperare?", ['Sì: la prescrizione scatta dopo cinque anni', 'No: si potevano chiedere solo entro un anno', "Non serve fare nulla: l'INPS li recupera da solo"], 0,
      "I contributi non versati vanno in prescrizione dopo cinque anni: dopo tre sei ancora in tempo. Va fatta una segnalazione all'INPS, che fa salire il termine a dieci anni. Per accorgersene serve guardare l'estratto conto contributivo."),
    Q('Il contratto di Paolo è scaduto 80 giorni fa, e solo oggi pensa alla NASpI. Che cosa succede?', ['La riceve con 80 giorni di ritardo', 'Ha perso il diritto: la domanda andava fatta entro 68 giorni', 'La riceve ridotta del 3%'], 1,
      'La domanda di NASpI va presentata entro 68 giorni dalla fine del rapporto di lavoro. È un termine rigido: passato quello, il diritto si perde.'),
  ], "Per la pensione va all'INPS il 33% del lordo: 9,19% tuo, 23,81% dell'azienda. Gli altri contributi pagano malattia, infortuni e disoccupazione. Controlla l'estratto conto contributivo."),

  LF('basi-12-3', 'IRPEF', "L'IRPEF e gli scaglioni", 7, [
    G('Anna ha un reddito imponibile di 28.000 €, tutto tassato al 23%. Arriva un aumento di 1.000 €, che la porta nello scaglione del 33%. Che cosa succede?',
      r"L'IRPEF si calcola **a scaglioni**: ogni pezzo di reddito ha la sua aliquota. I primi 28.000 € restano al 23%, e il 33% tocca solo i 1.000 € in più: 330 €. Un aumento non fa mai scendere il netto. È uno degli equivoci più diffusi sulle tasse.",
      options=['Paga il 33% su tutti i 29.000 €', 'Paga il 33% solo sui 1.000 € in più', "Le conviene rifiutare l'aumento"], ans=1),
    P('Un pezzo alla volta', r'''
**L'IRPEF non applica una percentuale a tutto il reddito: lo taglia a fette, e ogni fetta ha la sua.**

Gli scaglioni del 2026:

| Parte del reddito | Aliquota |
|---|---|
| fino a 28.000 € | 23% |
| da 28.000 a 50.000 € | 33% |
| oltre 50.000 € | 43% |

Con un imponibile di 35.000 € il conto si fa in due pezzi:

$$28.000 \times 23\% = 6.440 \text{ €}$$

$$7.000 \times 33\% = 2.310 \text{ €}$$

In tutto 8.750 €. Questa è l'**IRPEF lorda**: da qui poi si tolgono le detrazioni.

Il reddito su cui si fa il conto non è la RAL: è l'imponibile fiscale, cioè la RAL meno i contributi.'''),
    LV('Quanta IRPEF su quanto reddito', "Muovi il reddito imponibile e guarda come cambiano l'imposta e le due aliquote.", 'irpef', dict(),
      [dict(id='reddito', label='Reddito imponibile', min=10000, max=80000, step=1000, start=28000, unit='€')],
      [dict(label="Trova il reddito a cui l'aliquota media arriva al 25%", cond=[['media10', '>=', 250]], hint="Fino a 28.000 € la media è ferma al 23%. Sale solo quando entri nel secondo scaglione."),
       dict(label="Ora vai oltre 50.000 €, dove l'ultimo euro paga il 43%", cond=[['reddito', '>', 50000]], hint='Sposta il reddito sopra 50.000 € e guarda la differenza tra le due aliquote.')],
      "Sopra 50.000 € l'ultimo euro paga il 43%, ma l'aliquota media resta molto più bassa: a 60.000 € è il 30%. Il 43% si applica solo alla parte sopra la soglia."),
    N("Calcola l'IRPEF lorda su un reddito imponibile di 40.000 €, con gli scaglioni del 2026: 23% fino a 28.000 € e 33% da 28.000 a 50.000 €.", 10400, '€',
      r'Primo pezzo: \(28.000 \times 23\% = 6.440\) €. Secondo pezzo: \(12.000 \times 33\% = 3.960\) €. In tutto **10.400 €**.'),
    P('Media e marginale', r'''
Con gli scaglioni ogni contribuente ha due aliquote, e servono a cose diverse.

• L'**aliquota media** è l'imposta divisa per il reddito: dice quanto pesa l'IRPEF su tutto quello che guadagni.
• L'**aliquota marginale** è quella che colpisce l'ultimo euro: dice quanto ti resta di un euro in più.

$$\text{aliquota media} = \frac{\text{imposta}}{\text{reddito}}$$

Con 35.000 € la media è il 25%, la marginale il 33%. Per decidere se vale la pena uno straordinario o un secondo lavoro conta la marginale.

E la marginale vera è spesso più alta di quella dello scaglione, perché quando il reddito sale le detrazioni scendono. Tra 32.000 e 40.000 € di imponibile, su ogni euro in più se ne vanno circa 54 centesimi di IRPEF: 33 per l'aliquota, il resto in detrazioni perse.'''),
    P('Dalla lorda alla netta', r'''
L'IRPEF lorda non è quella che paghi. Prima si tolgono le **detrazioni**, che sono sconti sull'imposta.

Chi ha un lavoro dipendente ne ha una per il solo fatto di lavorare. È più alta per i redditi bassi, scende man mano che il reddito sale e si azzera a 50.000 €.

Per questo esiste una soglia sotto la quale l'IRPEF è zero: con un lavoro dipendente per tutto l'anno, fino a circa 8.500 € di reddito la detrazione copre tutta l'imposta.

Dal 2025 c'è anche il **taglio del cuneo**: una somma in più in busta paga per chi ha un reddito fino a 20.000 €, e una detrazione aggiuntiva di 1.000 € tra 20.000 e 32.000 €, che poi scende fino ad azzerarsi a 40.000 €.

Per Marco, con 27.243 € di imponibile: IRPEF lorda 6.266 €, detrazioni 3.044 €, IRPEF netta **3.222 €**.'''),
    Q('Con gli scaglioni del 2026, quanta IRPEF lorda si paga su un imponibile di 30.000 €?', ['6.900 €', '7.100 €', '9.900 €'], 1,
      r'\(28.000 \times 23\% = 6.440\) € più \(2.000 \times 33\% = 660\) €: in tutto **7.100 €**. 6.900 € sarebbe il 23% su tutto, 9.900 € il 33% su tutto: nessuno dei due è il modo in cui funziona.'),
    Q('Ti propongono uno straordinario pagato 500 € lordi. Per capire quanto ti resta, quale aliquota guardi?', ['La marginale', 'La media', 'La più bassa degli scaglioni'], 0,
      "I 500 € si aggiungono in cima al tuo reddito: pagano l'aliquota dell'ultimo scaglione che tocchi, cioè la **marginale**. La media serve a dire quanto pesa l'IRPEF su tutto il reddito."),
    Q('Che cosa fa una detrazione?', ["Riduce il reddito su cui si calcola l'imposta", 'Sposta il reddito nello scaglione più basso', "Riduce direttamente l'imposta da pagare"], 2,
      "La detrazione si toglie dall'imposta già calcolata. Ridurre il reddito è invece il lavoro della deduzione: ne parla la prossima lezione."),
  ], "L'IRPEF si paga a scaglioni: 23% fino a 28.000 €, 33% fino a 50.000 €, 43% oltre. L'aliquota media dice quanto pesa, la marginale quanto resta di un euro in più."),

  LF('basi-12-4', '19%', 'Detrazioni e deduzioni', 7, [
    G("Hai un reddito imponibile di 60.000 € e una spesa di 1.000 €. In un caso la legge te la fa dedurre, nell'altro te la fa detrarre al 19%. In quale caso risparmi di più?",
      r"Dedurre vuol dire togliere la spesa dal reddito: con 60.000 € quei 1.000 € sarebbero stati tassati al 43%, quindi risparmi **430 €**. Detrarre al 19% vuol dire togliere dall'imposta il 19% della spesa: **190 €**, uguali per tutti. Stessa spesa, risparmio più che doppio.",
      options=['Se la deduci', 'Se la detrai', 'È uguale: sono due nomi della stessa cosa'], ans=0),
    P('Due parole simili, due conti diversi', r'''
**Una deduzione abbassa il reddito. Una detrazione abbassa l'imposta.**

• La **deduzione** toglie la spesa dal reddito prima che si calcoli l'IRPEF. Vale quanto la tua aliquota marginale: 23, 33 o 43 centesimi per ogni euro. Più guadagni, più vale.
• La **detrazione** toglie dall'imposta una parte della spesa, quasi sempre il 19%. Vale 19 centesimi per ogni euro, per chiunque.

Le più comuni:

| Spesa | Trattamento |
|---|---|
| Versamenti al fondo pensione | deduzione |
| Contributi per colf e badanti | deduzione |
| Spese mediche | detrazione 19% |
| Interessi del mutuo di casa | detrazione 19% |

Quasi tutte hanno un tetto. Sugli interessi del mutuo, per esempio, il 19% si calcola su al massimo 4.000 € l'anno: lo sconto non supera 760 €.'''),
    LV('Quanto vale uno sconto fiscale', 'La stessa spesa, trattata in due modi. Muovi il reddito imponibile e la spesa.', 'sconto', dict(),
      [dict(id='reddito', label='Reddito imponibile', min=15000, max=80000, step=1000, start=25000, unit='€'),
       dict(id='spesa', label='Spesa', min=500, max=5000, step=100, start=1000, unit='€')],
      [dict(label='Trova un reddito a cui dedurre vale più del doppio che detrarre', cond=[['rapporto100', '>', 200]], hint='Serve lo scaglione più alto: sali oltre 50.000 € di reddito.'),
       dict(label='Ora porta il risparmio della deduzione sopra 1.000 €', cond=[['ded', '>', 1000]], hint='Aumenta la spesa: ogni euro dedotto vale quanto la tua aliquota marginale.')],
      'Una deduzione vale di più per chi ha redditi alti, una detrazione vale uguale per tutti. È il motivo per cui le due parole non sono intercambiabili.'),
    BK('Deduzione o detrazione?', ['Deduzione', 'Detrazione'], [
      ('Versamenti al fondo pensione', 0, "Si tolgono dal reddito, fino a 5.300 € l'anno dal 2026."),
      ('Una visita medica da 150 €', 1, 'Le spese mediche danno una detrazione del 19%, sulla parte che supera 129,11 € in un anno.'),
      ('Interessi del mutuo sulla casa in cui vivi', 1, 'Detrazione del 19% su al massimo 4.000 € di interessi.'),
      ('Contributi versati per la colf', 0, "Si tolgono dal reddito, fino a 1.549,37 € l'anno."),
      ('La palestra del figlio di 12 anni', 1, 'Detrazione del 19% su al massimo 210 € per figlio.'),
      ('I contributi INPS trattenuti in busta paga', 0, "Li toglie già l'azienda dal reddito, prima di calcolare l'IRPEF.")]),
    P('Tre regole per non perderle', r'''
• **Paga in modo tracciabile.** Le detrazioni al 19% valgono solo se hai pagato con carta o bonifico. Fanno eccezione medicinali e dispositivi medici: lì basta lo scontrino con il tuo codice fiscale.
• **Ricorda la franchigia.** Per le spese mediche i primi 129,11 € dell'anno non contano: la detrazione si calcola solo sulla parte sopra.
• **Senza imposta, niente sconto.** Una detrazione riduce l'IRPEF, ma non può portarla sotto zero. Se la tua imposta è già azzerata, la detrazione va persa.

Molte spese arrivano da sole nel **730 precompilato**: farmacie, medici e banche le comunicano all'Agenzia delle Entrate. Controllare che ci siano tutte, però, tocca a te.'''),
    N('Nel 2026 Giulia ha speso 829,11 € in visite mediche, tutte pagate con la carta. Di quanto si riduce la sua IRPEF?', 133, '€',
      r"I primi 129,11 € non contano: restano \(829{,}11 - 129{,}11 = 700\) €. La detrazione è il 19%: \(700 \times 19\% =\) **133 €**."),
    Q('Luca ha un imponibile di 25.000 € e versa 1.000 € nel fondo pensione, che sono deducibili. Quanta IRPEF risparmia?', ['190 €', '230 €', '330 €'], 1,
      r'La deduzione vale quanto la sua aliquota marginale. Con 25.000 € Luca è nel primo scaglione: \(1.000 \times 23\% =\) **230 €**. Con un reddito di 40.000 € ne avrebbe risparmiati 330.'),
    Q('Paghi in contanti 200 € a un fisioterapista privato. Che cosa succede alla detrazione?', ['La perdi: serve un pagamento tracciabile', 'Nulla: basta la fattura', 'Si riduce alla metà'], 0,
      "Per le detrazioni al 19% il pagamento deve essere tracciabile: carta o bonifico. L'eccezione riguarda medicinali e dispositivi medici, non le visite e le terapie da un professionista privato."),
    Q("L'IRPEF di Marta, dopo la detrazione per lavoro dipendente, è già zero. Ha anche spese mediche detraibili. Che cosa ottiene?", ['Un rimborso dallo Stato', "Lo sconto passa all'anno dopo", "Niente: senza imposta da ridurre la detrazione si perde"], 2,
      "Una detrazione può solo ridurre un'imposta che c'è. Se l'IRPEF è già zero non resta nulla da ridurre, e lo sconto non si recupera."),
  ], "La deduzione riduce il reddito e vale la tua aliquota marginale. La detrazione riduce l'imposta e di solito vale il 19%. Paga in modo tracciabile, altrimenti la perdi."),

  LF('basi-12-5', 'TFR', 'Il TFR', 7, [
    G('Marco ha una RAL di 30.000 €. Quanto TFR matura in un anno?',
      r"Ogni anno matura una quota pari alla retribuzione divisa per 13,5: \(\dfrac{30.000}{13{,}5} = 2.222\) €. Da qui si toglie un contributo pari allo 0,5% della retribuzione, 150 €, che va all'INPS. Restano **2.072 €**: quasi una mensilità lorda in più, che però non vedi finché il rapporto di lavoro non finisce.",
      lo=0, hi=5000, step=50, truth=2072, near=150),
    P('Uno stipendio in più, pagato alla fine', r'''
**Il TFR è una parte del tuo stipendio che l'azienda trattiene e ti paga quando il rapporto finisce.**

La sigla vuol dire trattamento di fine rapporto. Ogni anno matura così:

$$\text{quota annua} = \frac{\text{retribuzione annua}}{13{,}5}$$

Tre cose da sapere subito.

• Ti spetta **sempre**, qualunque sia il motivo per cui il lavoro finisce: licenziamento, dimissioni, scadenza del contratto, pensione.
• Non è un regalo dell'azienda: è retribuzione tua, pagata dopo.
• Puoi scegliere dove farlo maturare: in azienda oppure in un fondo pensione. Di questa scelta parla l'unità sulla pensione.

Chi trova il primo lavoro dal 1° luglio 2026 ha 60 giorni per decidere. Se non sceglie, il TFR va a un fondo pensione.'''),
    P('Come cresce', r'''
Il TFR lasciato in azienda non resta fermo: ogni anno viene rivalutato con una regola fissata dalla legge.

$$\text{rivalutazione} = 1{,}5\% + 75\% \times \text{inflazione}$$

Con un'inflazione del 2% la rivalutazione è del 3%: 1,5 più tre quarti di 2.

Su questa rivalutazione si paga ogni anno un'imposta del 17%. Il 3% diventa quindi il 2,49% netto.

La regola protegge bene quando i prezzi salgono poco, e meno quando corrono: dell'inflazione vengono recuperati solo tre quarti. Con le leve puoi trovare il punto in cui smette di bastare.'''),
    LV('Il TFR di Marco', "Marco lascia il TFR in azienda. Muovi gli anni di lavoro e l'inflazione. Per semplicità la sua RAL resta ferma a 30.000 €.", 'tfr', dict(ral=30000),
      [dict(id='anni', label='Anni di lavoro', min=1, max=40, step=1, start=10, unit='anni'),
       dict(id='infl', label="Inflazione all'anno", min=0, max=6, step=0.5, start=2, unit='%', dec=1)],
      [dict(label='Porta il TFR sopra 50.000 €', cond=[['tfr', '>', 50000]], hint='Aumenta gli anni di lavoro.'),
       dict(label="Trova un'inflazione a cui la rivalutazione non tiene il passo dei prezzi", cond=[['scarto10', '<', 0]], hint="Guarda la riga che confronta la rivalutazione con l'inflazione, e alza l'inflazione.")],
      "Fino a un'inflazione di circa il 3,3% la rivalutazione netta batte i prezzi. Sopra, il TFR lasciato in azienda perde potere d'acquisto ogni anno. È uno dei motivi per cui conviene sapere che esiste un'alternativa."),
    P('Quando lo incassi', r'''
Alla fine del rapporto il TFR arriva di solito entro uno o due mesi, e ha una tassazione tutta sua.

Si chiama **tassazione separata**: il TFR non si somma agli altri redditi dell'anno, altrimenti finirebbe tutto nello scaglione più alto. Si applica un'aliquota media calcolata sugli anni di lavoro, che per i redditi medi e bassi sta di solito tra il 23% e il 27%.

Una parte si può avere anche **prima**, con l'anticipo:

• servono almeno 8 anni nella stessa azienda;
• si può chiedere fino al 70% di quello che è maturato;
• per legge solo per spese sanitarie straordinarie, o per comprare la prima casa per te o per i figli;
• di norma una volta sola.

Quello che prendi in anticipo ti verrà tolto dal TFR finale.'''),
    N('Laura lavora nella stessa azienda da 12 anni e ha maturato 26.000 € di TFR. Vuole comprare la prima casa. Quanto può chiedere di anticipo, al massimo?', 18200, '€',
      r"L'anticipo può arrivare al 70% del TFR maturato: \(26.000 \times 70\% =\) **18.200 €**. Su questa cifra si pagano le imposte, e alla fine del rapporto verrà tolta dal TFR."),
    Q('Dai le dimissioni dopo quattro anni. Che cosa succede al TFR che hai maturato?', ['Lo perdi: spetta solo a chi viene licenziato', 'Ti viene pagato: spetta qualunque sia il motivo', 'Resta in azienda fino alla pensione'], 1,
      'Il TFR è retribuzione tua, pagata dopo. Spetta alla fine del rapporto di lavoro per qualsiasi motivo, dimissioni comprese.'),
    Q("In un anno l'inflazione è del 4%. Di quanto si rivaluta, prima delle imposte, il TFR lasciato in azienda?", ['1,5%', '4%', '4,5%'], 2,
      r"\(1{,}5\% + 75\% \times 4\% = 1{,}5\% + 3\% =\) **4,5%**. Tolta l'imposta del 17% resta il 3,7%: meno dell'inflazione. Con i prezzi che salgono del 4% il TFR in azienda perde un po' di potere d'acquisto."),
    Q('Perché il TFR ha una tassazione separata?', ["Perché sommato allo stipendio dell'anno finirebbe nello scaglione più alto", 'Perché sul TFR non si pagano imposte', 'Perché a tassarlo è il Comune'], 0,
      "Il TFR matura in molti anni ma arriva tutto insieme. Sommato al reddito dell'ultimo anno verrebbe tassato con le aliquote più alte: per questo la legge gli applica un'aliquota media a parte."),
  ], "TFR: ogni anno la retribuzione divisa per 13,5. In azienda si rivaluta dell'1,5% più tre quarti dell'inflazione. Ti spetta sempre, a fine rapporto, con una tassazione separata."),
])

# Unità 13: la casa. Regole generali più quelle italiane su imposte e garanzie (2026). I conti delle leve usano ipotesi scritte nel testo:
# casa da 200.000 €, costi di acquisto 8%, mutuo dell'80% al 3,5% per 25 anni, manutenzione 1% l'anno, rendimento perso 2% (modello "casa" in p35_steps.js).
U13 = dict(id='basi-u13', sid='basi-casa', name='La casa', lessons=[
  LF('basi-13-1', 'CASA', 'Affitto o acquisto', 7, [
    G("Compri casa a 200.000 € e dopo tre anni devi cambiare città. La rivendi allo stesso prezzo. Rispetto a un affitto di 800 € al mese, com'è andata?",
      "In tre anni l'affitto sarebbe costato 28.800 €. Comprando hai pagato circa 16.000 € di costi di acquisto, 16.000 € di interessi, la manutenzione, e hai tenuto fermi i tuoi risparmi: in tutto circa 41.600 €. L'affitto non è denaro buttato: è il prezzo di un servizio. Anche chi compra ha soldi che non tornano indietro, solo che si vedono meno.",
      options=["Meglio: l'affitto sono soldi buttati", 'Più o meno uguale', 'Peggio: hai speso circa 13.000 € in più'], ans=2),
    P('I soldi che non tornano indietro', r'''
**Chi affitta paga l'affitto. Chi compra paga altre quattro cose, e nessuna gli viene restituita.**

• I **costi di acquisto**: imposte, notaio, agenzia. Si pagano una volta e non si recuperano quando rivendi.
• Gli **interessi** del mutuo. La parte di rata che restituisce il capitale è risparmio, gli interessi no.
• La **manutenzione** e le spese straordinarie, che in affitto toccano al proprietario.
• Il **rendimento perso** sull'anticipo: quei soldi, investiti, avrebbero reso qualcosa.

In cambio chi compra ha due vantaggi: non paga l'affitto, e se la casa sale di valore il guadagno è suo. Se scende, lo è anche la perdita.

Per questo la domanda giusta non è se comprare conviene, ma **dopo quanti anni**. I costi di acquisto pesano tutti all'inizio: più a lungo resti nella casa, più si diluiscono.'''),
    LV('Dopo quanti anni conviene', "Casa da 200.000 €, mutuo di 160.000 € al 3,5% per 25 anni. Costi di acquisto 8%, manutenzione 1% l'anno, 2% di rendimento perso sui soldi impegnati.", 'casa',
      dict(prezzo=200000, costi=8, anticipo=20, tasso=3.5, anniMutuo=25, manut=1, rend=2),
      [dict(id='anni', label='Anni in cui resti', min=1, max=20, step=1, start=3, unit='anni'),
       dict(id='affitto', label='Affitto al mese', min=500, max=1400, step=50, start=800, unit='€'),
       dict(id='crescita', label="Valore della casa, all'anno", min=-2, max=4, step=0.5, start=0, unit='%', dec=1)],
      [dict(label='Con affitto e prezzi fermi, trova dopo quanti anni comprare costa meno', cond=[['diff', '>', 0], ['affitto', '<=', 800], ['crescita', '<=', 0]], hint='Muovi solo gli anni: i costi di acquisto si pagano una volta sola.'),
       dict(label="Ora torna a 5 anni e fai convenire lo stesso l'acquisto", cond=[['anni', '<=', 5], ['diff', '>', 0]], hint="Su 5 anni comprare vince solo se l'affitto è alto, o se la casa sale di valore.")],
      "Con questi numeri servono circa 11 anni perché comprare batta un affitto di 800 €. Su un tempo breve vince solo se l'affitto è alto o se i prezzi salgono, e sui prezzi nessuno ha certezze. Prima della casa va decisa una cosa: per quanto tempo pensi di restarci."),
    P('Che cosa sposta il conto', r'''
Il risultato cambia molto con tre numeri. Conviene sapere in che direzione spingono.

• **Il rapporto tra affitto e prezzo.** Un affitto di 800 € al mese su una casa da 200.000 € vale, in un anno, il 4,8% del prezzo. Dove gli affitti sono alti rispetto ai prezzi, comprare si ripaga prima.
• **Il tasso del mutuo.** Su 160.000 € di debito, ogni punto in più sono circa 1.600 € di interessi in più l'anno.
• **Quanto resti.** È il numero che conta di più, ed è l'unico che dipende solo da te.

Poi c'è quello che nessun conto misura: la stabilità di una casa tua, oppure la libertà di cambiare città senza dover vendere. Hanno un valore, ma non lo stesso per tutti. Il conto serve a sapere quanto le paghi.'''),
    N("Un appartamento costa 180.000 €. Lo stesso appartamento si affitta a 750 € al mese. Quanto vale l'affitto di un anno, in percentuale del prezzo?", 5, '%',
      r"L'affitto di un anno è \(750 \times 12 = 9.000\) €. Rispetto al prezzo: \(\dfrac{9.000}{180.000} =\) **5%**. Più questo numero è alto, prima l'acquisto si ripaga."),
    Q('Quale di queste spese di chi compra casa non si recupera quando rivende?', ['La parte di rata che restituisce il capitale', "Le imposte e il notaio pagati all'acquisto", "L'anticipo"], 1,
      "Anticipo e capitale restituito restano dentro il valore della casa: li ritrovi quando vendi. Imposte, notaio e agenzia si pagano una volta e non tornano."),
    Q('Pensi di restare in una città due anni. Di solito che cosa costa meno?', ['Affittare', 'Comprare', 'È sempre uguale'], 0,
      'In due anni i costi di acquisto non fanno in tempo a diluirsi. Comprare converrebbe solo se nel frattempo i prezzi salissero molto, e non si può sapere prima.'),
    Q('In che cosa gli interessi del mutuo somigliano a un affitto?', ['Si pagano una volta sola', 'Li incassa chi ti ha venduto la casa', 'Sono il prezzo per usare soldi non tuoi, e non tornano indietro'], 2,
      "Con l'affitto paghi per usare una casa non tua. Con gli interessi paghi per usare soldi non tuoi. In tutti e due i casi è un costo, non un risparmio."),
  ], 'Comprare ha costi che non tornano indietro: acquisto, interessi, manutenzione. Si ripagano solo con il tempo. La domanda giusta è dopo quanti anni.'),

  LF('basi-13-2', '1/3', 'Quanto mutuo ti puoi permettere', 7, [
    G('Una coppia guadagna in due 3.000 € netti al mese. Con un mutuo al 3,5% per 25 anni, quanto può chiedere senza superare una rata prudente?',
      "La regola più usata dice che la rata non dovrebbe superare **un terzo del reddito**: qui 1.000 € al mese. Al 3,5% per 25 anni, una rata da 1.000 € ripaga un mutuo di circa **200.000 €**. Il terzo non è una legge: è il margine che serve per reggere un imprevisto senza saltare una rata.",
      lo=0, hi=400000, step=5000, truth=200000, near=15000),
    P('La regola del terzo', r'''
**Quanto mutuo puoi permetterti non lo decide il prezzo della casa: lo decide la rata che reggi.**

La Banca d'Italia indica come ragionevole una rata che non superi **un terzo del reddito disponibile**. Dentro quel terzo devono stare anche le rate che hai già: l'auto, un prestito, una cessione del quinto.

Fissata la rata, il mutuo dipende da due cose.

• **La durata.** Più anni vuol dire più mutuo con la stessa rata, ma molti più interessi.
• **Il tasso.** Ogni punto in più riduce il mutuo che la stessa rata riesce a ripagare.

C'è poi un secondo limite: di norma la banca presta fino all'**80% del valore** della casa. Il resto, più i costi di acquisto, deve venire dai tuoi risparmi.'''),
    LV('Quanto mutuo regge un reddito', 'La rata è un terzo del reddito netto. Muovi reddito, tasso e durata.', 'mutuomax', dict(),
      [dict(id='reddito', label='Reddito netto al mese', min=1500, max=6000, step=100, start=2400, unit='€'),
       dict(id='tasso', label='Tasso', min=2, max=6, step=0.25, start=3.5, unit='%', dec=2),
       dict(id='anni', label='Durata', min=10, max=30, step=5, start=25, unit='anni')],
      [dict(label='Arriva a un mutuo di almeno 190.000 €', cond=[['mutuo', '>=', 190000]], hint='Puoi alzare il reddito, allungare la durata o abbassare il tasso.'),
       dict(label='Ora ottieni 190.000 € pagando meno di 80.000 € di interessi', cond=[['mutuo', '>=', 190000], ['interessi', '<', 80000]], hint='Una durata lunga fa salire gli interessi. Prova con meno anni e più reddito, o con un tasso più basso.')],
      'Allungare la durata fa crescere il mutuo, ma anche il conto degli interessi. Se per arrivare al prezzo servono 30 anni e una rata al limite, il segnale è un altro: quella casa costa troppo per quel reddito.'),
    P('Come ti guarda la banca', r'''
Per decidere, la banca guarda quattro cose.

• **Il reddito, e quanto è stabile.** Un contratto a tempo indeterminato pesa più di uno a termine.
• **I debiti che hai già**, e come li hai pagati: consulta le banche dati del credito.
• **Il valore della casa**, stimato da un suo perito. Conta la perizia, non il prezzo che hai concordato.
• **Quanto metti di tuo.**

Se scegli il tasso variabile, fai da solo una prova: la rata regge anche con due punti in più? Su 160.000 € a 25 anni, passare dal 3,5% al 5,5% porta la rata da 801 a 983 € al mese.'''),
    N("Marta e Luca guadagnano insieme 3.300 € netti al mese e pagano già 250 € al mese per l'auto. Con la regola del terzo, quale rata di mutuo possono aggiungere?", 850, '€',
      r"Un terzo del reddito: \(\dfrac{3.300}{3} = 1.100\) €. Dentro ci deve stare anche la rata dell'auto: \(1.100 - 250 =\) **850 €**."),
    Q('Reddito netto di 2.700 € al mese, nessun altro debito. Qual è una rata di mutuo prudente?', ['450 €', '900 €', '1.350 €'], 1,
      r'Un terzo del reddito: \(\dfrac{2.700}{3} =\) **900 €**. Con 1.350 € metà del reddito sarebbe impegnata: basterebbe un imprevisto per andare in difficoltà.'),
    Q('A parità di rata, che cosa succede se allunghi il mutuo da 20 a 30 anni?', ['Ottieni più mutuo, e paghi più interessi in tutto', 'Ottieni meno mutuo', 'Paghi meno interessi in tutto'], 0,
      'Con più anni la stessa rata ripaga un debito più grande. Ma gli interessi si pagano per dieci anni in più, e il loro totale sale molto.'),
    Q("Hai concordato un prezzo di 200.000 €, ma il perito della banca valuta la casa 185.000 €. Su quale cifra la banca calcola l'80%?", ['Sul prezzo', 'Sulla media delle due cifre', 'Sulla perizia'], 2,
      "La banca presta in base al valore stimato dal suo perito. L'80% di 185.000 € fa 148.000 €: per arrivare al prezzo servono 52.000 € tuoi, non 40.000."),
  ], "Rata entro un terzo del reddito, contando gli altri debiti. La banca presta di norma fino all'80% del valore di perizia. Più durata vuol dire più mutuo, ma più interessi."),

  LF('basi-13-3', '20%', "L'anticipo e le garanzie", 7, [
    G("Vuoi comprare una casa da 200.000 €. La banca presta l'80% del valore, ma il suo perito la valuta 190.000 €. Senza contare imposte e notaio, quanti soldi tuoi servono?",
      r"La banca presta l'80% della **perizia**: \(190.000 \times 80\% = 152.000\) €. Per arrivare a 200.000 € ne mancano **48.000**, non 40.000. Se la perizia esce più bassa del prezzo, la differenza la metti tutta tu. E a questa cifra vanno aggiunti i costi di acquisto.",
      lo=0, hi=100000, step=1000, truth=48000, near=3000),
    P('Quanti soldi servono subito', r'''
**Per comprare casa non basta l'anticipo: servono tre cifre insieme.**

• L'**anticipo**: la parte di prezzo che la banca non finanzia, di norma almeno il 20%.
• I **costi di acquisto**: imposte, notaio, agenzia, spese del mutuo. Li mette in fila la prossima lezione.
• Un **fondo di emergenza** ancora intero: dopo l'acquisto non devi restare a zero.

Poi ci sono i soldi che escono prima. Con la proposta di acquisto e con il **contratto preliminare**, detto anche compromesso, si versa una **caparra**.

La caparra è una promessa che costa: se ti tiri indietro tu, la perdi. Se si tira indietro il venditore, deve restituirti il doppio.

Per questo, se ti serve un mutuo, c'è una frase da far scrivere nella proposta: che l'acquisto vale **solo se la banca concede il mutuo**. Senza quella frase, se il mutuo viene rifiutato perdi la caparra.'''),
    N("Prezzo concordato: 240.000 €. La perizia della banca dice 230.000 €, e la banca presta l'80% della perizia. Quanti soldi tuoi servono per pagare il prezzo, senza contare i costi di acquisto?", 56000, '€',
      r'La banca presta \(230.000 \times 80\% = 184.000\) €. Per arrivare al prezzo mancano \(240.000 - 184.000 =\) **56.000 €**.'),
    P('Che cosa garantisce il mutuo', r'''
Un mutuo è grande e lungo, e la banca vuole garanzie che durino quanto lui.

• L'**ipoteca** sulla casa. Se smetti di pagare, la banca può farla vendere all'asta e prendersi il ricavato.
• Un'**assicurazione** sulla casa contro i danni, che di norma la banca chiede.
• A volte un **garante**: di solito un genitore, che firma una fideiussione. È un impegno pesante, e chi lo firma deve saperlo: se tu non paghi, la banca può chiedere a lui tutto il debito.

Le conseguenze di un ritardo arrivano molto prima dell'asta. I ritardi vengono segnalati nelle banche dati del credito. E la banca può sciogliere il contratto, e chiedere indietro tutto il debito, se una rata resta non pagata per più di 180 giorni, o se per sette volte paghi con più di 30 giorni di ritardo.'''),
    P("Se l'anticipo non c'è", r'''
Chi non ha il 20% non è per forza escluso. Esiste il **Fondo prima casa**, un fondo di garanzia dello Stato: copre una parte del mutuo, così la banca può prestare anche oltre l'80%.

• Di base copre il 50% del capitale.
• Sale all'**80%** per chi ha meno di 36 anni, per le giovani coppie, per i genitori soli con figli minori e per chi vive in una casa popolare, con ISEE fino a 40.000 € e un mutuo superiore all'80% del prezzo. Questa misura vale fino al 31 dicembre 2027.
• Il mutuo non può superare 250.000 €, e la casa deve essere la prima e non di lusso.

La domanda si fa attraverso la banca.

Un'avvertenza: il Fondo protegge la banca, non te. Se non paghi, lo Stato rimborsa la banca e poi il debito lo chiede a te. E un mutuo che copre tutto il prezzo vuol dire rata più alta e nessun margine se la casa perde valore.'''),
    OR('Le tappe di un acquisto', ['Chiedi alla banca quanto può prestarti', 'Proposta di acquisto, vincolata al mutuo', 'Perizia della casa e via libera della banca', 'Rogito dal notaio: paghi, e la casa è tua'],
      after="Gli impegni si prendono con la proposta, molto prima che si muovano i soldi veri. Per questo conviene parlare con la banca prima di firmarla, non dopo."),
    Q("Hai versato 10.000 € di caparra. Poi cambi idea e rinunci all'acquisto. Che cosa succede?", ['Te la restituiscono', 'La perdi', 'Ne perdi la metà'], 1,
      'Chi ha dato la caparra e si tira indietro la perde. Se a tirarsi indietro è il venditore, deve restituire il doppio.'),
    Q('Tuo padre firma come garante del tuo mutuo. Che cosa rischia?', ['Che la banca chieda a lui il debito, se tu non paghi', 'Nulla: è una firma di cortesia', 'Solo gli interessi di mora'], 0,
      'Chi firma una fideiussione risponde del debito con i propri soldi e i propri beni. Non è una formalità: va firmata sapendo che cosa comporta.'),
    Q('A chi serve soprattutto il Fondo prima casa?', ['A chi possiede già una casa', 'A chi vuole un tasso più basso di quello di mercato', "A chi può pagare la rata, ma non ha tutto l'anticipo"], 2,
      "Il Fondo garantisce una parte del mutuo e permette alla banca di prestare oltre l'80% del valore. Non riduce la rata e non regala nulla: il debito resta tutto tuo."),
  ], "Servono anticipo, costi di acquisto e un fondo di emergenza. Conta la perizia, non il prezzo. Se ti serve un mutuo, fai scrivere nella proposta che l'acquisto vale solo se arriva."),

  LF('basi-13-4', '+€', 'I costi oltre il prezzo', 7, [
    G('Una casa da 200.000 €, comprata da un privato come prima casa, con agenzia e con un mutuo di 160.000 €. Tra imposte, agenzia, notaio e spese del mutuo, quanto serve oltre al prezzo?',
      "In questo esempio, con una rendita catastale di 800 €, circa **13.000 €**: 1.948 € di imposte, 7.320 € di agenzia, 2.500 € di notaio e 1.200 € per il mutuo. È il 6,5% del prezzo, da avere in contanti oltre all'anticipo. E la voce più grossa non sono le tasse: è l'agenzia.",
      lo=0, hi=40000, step=500, truth=13000, near=2000),
    P('Le imposte: conta la rendita, non il prezzo', r'''
**Se compri da un privato puoi pagare l'imposta di registro non sul prezzo, ma sul valore catastale, che di solito è molto più basso.**

Si chiama **prezzo-valore** e si chiede al notaio. Nell'atto si scrive comunque il prezzo vero.

$$\text{valore catastale} = \text{rendita} \times 115{,}5$$

La **rendita catastale** è un numero scritto nella visura della casa. Il 115,5 vale per la prima casa; per le altre si usa 126.

| Compri da | Prima casa | Altra casa |
|---|---|---|
| un privato | 2% del valore catastale | 9% |
| un costruttore | IVA 4% sul prezzo | IVA 10% |

In più ci sono le imposte fisse: 100 € in tutto da un privato, 600 € con l'IVA. Il 2% ha un minimo di 1.000 €.

Con una rendita di 800 €, come prima casa il valore catastale è 92.400 € e paghi 1.848 € più 100 €. Come seconda casa il valore sale a 100.800 €, e paghi 9.072 € più 100 €.'''),
    N('Compri la prima casa da un privato. La rendita catastale è 600 €. Quanto paghi di imposta di registro? È il 2% del valore catastale, e il valore catastale è la rendita moltiplicata per 115,5.', 1386, '€',
      r'Valore catastale: \(600 \times 115{,}5 = 69.300\) €. Imposta di registro: \(69.300 \times 2\% =\) **1.386 €**.'),
    P('Notaio, agenzia, banca', r'''
Le imposte sono spesso la voce più piccola. Ecco l'esempio dei 200.000 €:

[fig]

• L'**agenzia** chiede di solito tra il 2% e il 3% del prezzo, più l'IVA al 22%. Si può trattare, e va messa per iscritto prima.
• Il **notaio** lo sceglie e lo paga chi compra. Fa due atti: la compravendita e il mutuo. Le tariffe sono libere: chiedi più di un preventivo.
• La **banca** trattiene un'imposta sul mutuo, lo 0,25% per la prima casa, e chiede le spese di istruttoria e di perizia.

Le cifre di agenzia, notaio e banca qui sono esempi: cambiano da caso a caso. Le imposte invece sono fissate dalla legge.''',
      fig=F([('Costi su 200.000 €', '12.968 €', [(7320, 'Agenzia', 'giallo', '7.320 €'), (2500, 'Notaio', CAP, '2.500 €'), (1948, 'Imposte', INT, '1.948 €'), (1200, 'Mutuo', 'lilla', '1.200 €')])])),
    P('Le regole della prima casa', r'''
Lo sconto sulla **prima casa** ha condizioni precise. Se non le rispetti lo perdi: paghi la differenza, più una sanzione del 30%.

• La casa non deve essere di lusso: sono escluse le categorie catastali A/1, A/8 e A/9.
• Devi avere la residenza in quel Comune, o portarcela entro 18 mesi. Vale anche il Comune in cui lavori.
• Non devi avere un'altra casa nello stesso Comune.
• Se hai già una casa comprata con lo sconto, devi venderla entro 2 anni.
• Se rivendi entro 5 anni perdi lo sconto, a meno che entro un anno tu ne ricompri un'altra in cui abitare.'''),
    BK('Ha diritto allo sconto prima casa?', ['Sì', 'No'], [
      ('Compra e porta la residenza dopo un anno', 0, 'Il limite è 18 mesi: è nei tempi.'),
      ('Compra una villa in categoria A/8', 1, 'Le case di lusso sono escluse.'),
      ('Ha già una casa con lo sconto, e la tiene', 1, 'Per avere di nuovo lo sconto deve vendere la precedente entro 2 anni.'),
      ('Casa al mare, dove non vive e non lavora', 1, 'Serve la residenza nel Comune della casa, o lavorarci.'),
      ('Non ha altre case, e ci va a vivere subito', 0, 'Non ne possiede altre e porta lì la residenza: le condizioni ci sono.')]),
    Q("Due case costano 200.000 € l'una, e le compri da un privato come prima casa. Una ha rendita catastale 600 €, l'altra 1.000 €. Le imposte sono uguali?", ['Sì: il prezzo è lo stesso', 'No: si calcolano sulla rendita, e la seconda paga di più', 'No: paga di più la prima'], 1,
      r'Con il prezzo-valore le imposte si calcolano sul valore catastale. Con rendita 600 € il registro è 1.386 €; con rendita 1.000 € è \(1.000 \times 115{,}5 \times 2\% =\) **2.310 €**.'),
    Q("Compri la prima casa da un'impresa costruttrice. Quale imposta paghi sul prezzo?", ['IVA al 4%', 'Registro al 2%', 'Registro al 9%'], 0,
      "Quando vende il costruttore, di norma si paga l'IVA sul prezzo: 4% per la prima casa, 10% per le altre. Il registro in percentuale vale per gli acquisti da privati."),
    Q("Nell'esempio della prima casa da 200.000 € comprata da un privato, qual è la voce più alta tra i costi oltre il prezzo?", ['Le imposte', 'Il notaio', "L'agenzia"], 2,
      "L'agenzia al 3% più IVA fa 7.320 €, contro 1.948 € di imposte. Per una seconda casa il conto cambia: lì il registro sale al 9% del valore catastale."),
  ], 'Oltre al prezzo servono imposte, notaio, agenzia e spese del mutuo: nel nostro esempio il 6,5%. Da un privato le imposte si calcolano sulla rendita catastale, non sul prezzo.'),

  LF('basi-13-5', '⇄', 'Cambiare mutuo', 7, [
    G("Hai un mutuo al 4,5% e un'altra banca te lo offre al 3%. Quanto ti costa spostarlo?",
      "Si chiama **surroga**, o portabilità: la nuova banca paga il tuo debito alla vecchia, e il mutuo continua con lei alle nuove condizioni. Per legge non ti costa nulla: niente penali, niente notaio a tuo carico, niente imposte. E la vecchia banca non può opporsi.",
      options=['Circa 2.000 €, tra notaio e imposte', 'Niente: per legge è gratis', 'Una penale alla vecchia banca'], ans=1),
    P('Tre modi per cambiarlo', r'''
**Un mutuo non resta per forza com'è stato firmato. Si può cambiare in tre modi, e solo uno costa.**

• **Rinegoziazione**: chiedi alla tua banca di cambiare tasso o durata. Basta un accordo scritto, senza notaio. La banca però non è obbligata ad accettare.
• **Surroga**: porti il mutuo in un'altra banca che ti offre di meglio. È gratis per legge. Puoi cambiare tasso e durata, ma non chiedere soldi in più.
• **Sostituzione del mutuo**: chiudi il mutuo e ne apri uno nuovo, anche più grande. È un mutuo nuovo a tutti gli effetti, con i suoi costi.

C'è poi una quarta mossa, la più semplice: **restituire prima**. Per i mutui fatti per comprare o ristrutturare casa, restituire in anticipo tutto il debito o una sua parte non ha penali.'''),
    LV('Rata più bassa, a quale prezzo', 'Ti restano 120.000 € di debito e 20 anni al 4,5%: oggi la rata è di 759 €. Muovi tasso e durata del mutuo nuovo.', 'surroga', dict(debito=120000, anni=20, vecchio=4.5),
      [dict(id='tasso', label='Tasso nuovo', min=2, max=4.5, step=0.25, start=4.5, unit='%', dec=2),
       dict(id='anni', label='Durata nuova', min=10, max=30, step=1, start=20, unit='anni')],
      [dict(label='Abbassa la rata di almeno 100 € al mese', cond=[['rispMese', '>=', 100]], hint='Ci sono due strade: un tasso più basso, oppure una durata più lunga.'),
       dict(label='Ora fallo pagando meno interessi di prima, in tutto', cond=[['rispMese', '>=', 100], ['rispTot', '>', 0]], hint='Se allunghi soltanto la durata la rata scende, ma gli interessi totali salgono. Serve un tasso più basso.')],
      'Allungare la durata abbassa la rata, ma può far salire il conto finale: a 30 anni, allo stesso tasso, la rata scende di 151 € e gli interessi in più superano i 36.000 €. Il risparmio vero viene dal tasso.'),
    P('Quando conviene muoversi', r'''
Tre controlli prima di cambiare.

• **Confronta il TAEG, non solo il tasso.** La surroga è gratis, ma il mutuo nuovo può avere spese ricorrenti o polizze diverse.
• **Guarda quanto debito resta.** Il risparmio si calcola sul debito che resta e sugli anni che mancano: nei primi anni di un mutuo è grande, negli ultimi è piccolo.
• **Usa l'offerta come leva.** Con la proposta scritta di un'altra banca in mano, la tua ha un motivo per rinegoziare.

Se invece il problema è pagare la rata, la mossa è un'altra: parlare con la banca **prima** di saltare un pagamento. Si può concordare una sospensione temporanea delle rate. E in casi come la perdita del lavoro esiste un fondo pubblico che le sospende fino a 18 mesi.'''),
    BK('Quale mossa serve?', ['Rinegoziare', 'Surroga', 'Mutuo nuovo'], [
      ('La tua banca ti abbassa il tasso', 0, 'Resti con la stessa banca e cambi le condizioni.'),
      ("Un'altra banca offre un tasso migliore", 1, 'Sposti il mutuo: è gratis per legge.'),
      ('Ti servono 30.000 € in più per dei lavori', 2, 'Con la surroga non puoi aumentare il debito: serve un mutuo nuovo, con i suoi costi.'),
      ('Durata più lunga, nella stessa banca', 0, 'Tasso e durata si possono cambiare con un accordo scritto con la tua banca.'),
      ('Passare al tasso fisso, in altra banca', 1, 'Con la surroga puoi cambiare anche il tipo di tasso.')]),
    Q('Che cosa non puoi fare con una surroga?', ['Cambiare banca', 'Chiedere soldi in più rispetto al debito che resta', 'Passare dal tasso variabile al fisso'], 1,
      'La surroga sposta il debito che resta, alle nuove condizioni. Per avere altri soldi serve un mutuo nuovo, con notaio e imposte.'),
    Q('Hai 20.000 € da parte e un mutuo sulla casa in cui vivi. Se li usi per ridurre il debito, quanto paghi di penale?', ['Niente', "L'1% della cifra restituita", 'Sei mesi di interessi'], 0,
      'Per i mutui fatti per comprare o ristrutturare la casa, il rimborso anticipato, anche solo di una parte, non ha penali né altri costi.'),
    Q('Una banca ti propone di abbassare la rata allungando il mutuo di dieci anni, allo stesso tasso. Che cosa succede?', ['Risparmi su tutto', 'Non cambia nulla', 'La rata scende, ma in tutto paghi più interessi'], 2,
      'Con più anni il debito si restituisce più lentamente, e gli interessi si pagano più a lungo. La rata si alleggerisce, il costo totale cresce.'),
  ], 'Un mutuo si può cambiare: rinegoziando con la propria banca o spostandolo con la surroga, che è gratis. Allungare la durata abbassa la rata ma alza gli interessi totali.'),
])

# Unità 14: la pensione. Regole italiane del 2026 (legge 199/2025 per i fondi pensione). I conti delle leve usano ipotesi scritte nel testo:
# pensione = 33% dello stipendio lordo per ogni anno di contributi, per il coefficiente dell'età (valori 2025-2026); modelli "pensione", "fondo", "tfrscelta" in p35_steps.js.
U14 = dict(id='basi-u14', sid='basi-pensione', name='La pensione', lessons=[
  LF('basi-14-1', '67', 'La pensione pubblica', 7, [
    G("I contributi che versi oggi all'INPS, dove vanno?",
      "Il sistema pubblico è **a ripartizione**: i contributi di chi lavora oggi pagano le pensioni di oggi. A tuo nome non c'è un conto con dei soldi dentro: c'è la registrazione di quanto hai versato, che un giorno deciderà quanto ricevi. La tua pensione la pagheranno i lavoratori di allora.",
      options=['In un conto a tuo nome, investiti fino alla pensione', 'Pagano le pensioni di chi è in pensione adesso', 'Nel bilancio dello Stato, per qualsiasi spesa'], ans=1),
    P('Un patto tra generazioni', r'''
**Lo Stato non mette da parte i tuoi contributi: li usa subito, per pagare le pensioni di oggi.**

Il sistema regge finché chi lavora versa abbastanza per chi è in pensione. Qui sta il problema dell'Italia: si vive più a lungo e nascono meno bambini, quindi i pensionati aumentano e i lavoratori no.

Le riforme degli ultimi trent'anni hanno risposto in due modi.

• **Si va in pensione più tardi.** I requisiti sono agganciati alla speranza di vita: quando si allunga, salgono.
• **La pensione dipende da quanto hai versato.** Per chi ha iniziato a lavorare dal 1996 conta la somma dei contributi di tutta la carriera, non gli ultimi stipendi.

Per chi è giovane oggi vuol dire una cosa precisa: la pensione pubblica ci sarà, ma coprirà una parte dello stipendio più piccola di quella che ha coperto per i suoi genitori.'''),
    P('Quando si va in pensione', r'''
Le strade principali sono due.

| Pensione | Requisiti nel 2026 |
|---|---|
| Di vecchiaia | 67 anni di età e almeno 20 di contributi |
| Anticipata | 42 anni e 10 mesi di contributi, a qualsiasi età |

Per le donne la **pensione anticipata** chiede un anno in meno: 41 anni e 10 mesi.

Questi numeri si muovono. Dal 2027 salgono di un mese e dal 2028 di altri due, perché la speranza di vita è aumentata.

Chi ha iniziato a versare dal 1996 ha altre due uscite: a 64 anni, con almeno 20 anni di contributi e una pensione sopra una soglia minima, oppure a 71 anni con soli 5 anni di contributi.'''),
    BK('Può andare in pensione nel 2026?', ['Sì', 'Non ancora'], [
      ('67 anni di età, 25 di contributi', 0, 'Ha i requisiti della pensione di vecchiaia: 67 anni e almeno 20 di contributi.'),
      ('Uomo di 62 anni, con 43 anni di contributi', 0, 'Ha superato i 42 anni e 10 mesi: pensione anticipata, a qualsiasi età.'),
      ('67 anni di età, 15 di contributi', 1, 'Per la pensione di vecchiaia servono almeno 20 anni di contributi.'),
      ('Uomo di 60 anni, con 38 anni di contributi', 1, "Non ha l'età per la vecchiaia né i contributi per l'anticipata."),
      ('Donna di 61 anni, con 42 anni di contributi', 0, 'Per le donne bastano 41 anni e 10 mesi di contributi.')]),
    P('Quanto prenderai, e dove guardarlo', r'''
La domanda che conta è un'altra: quanta parte dello stipendio diventerà pensione? Questo numero si chiama **tasso di sostituzione**.

Non serve aspettare i 60 anni per saperlo. Sul sito dell'INPS, entrando con SPID o con la carta d'identità elettronica, trovi due strumenti.

• L'**estratto conto contributivo**: controlla che ci siano tutti i periodi in cui hai lavorato. Un buco di oggi è una pensione più bassa domani.
• Il simulatore della pensione futura: ti dice quando potrai uscire e con quale cifra, secondo le regole di oggi.

Poi confronta quella cifra con quello che ti servirà per vivere. La differenza è il motivo per cui esistono il risparmio e i fondi pensione, di cui parlano le prossime lezioni.'''),
    Q('Che cosa vuol dire che il sistema pensionistico pubblico è a ripartizione?', ['I contributi di oggi pagano le pensioni di oggi', 'Ognuno ha un conto investito a suo nome', 'Le pensioni si pagano con le imposte sulla casa'], 0,
      "Nel sistema a ripartizione non si accumulano soldi: quello che entra dai lavoratori esce subito verso i pensionati. Per questo conta il rapporto tra quanti lavorano e quanti sono in pensione."),
    Q('Perché i requisiti per la pensione salgono nel tempo?', ['Perché li decide ogni anno il datore di lavoro', 'Perché sono agganciati alla speranza di vita', 'Perché aumentano gli stipendi'], 1,
      'La legge lega età e anni di contributi alla speranza di vita: se si vive più a lungo, la pensione viene pagata per più anni, e i requisiti si spostano in avanti.'),
    Q('Nel 2026 Paolo ha 67 anni e 18 anni di contributi, in parte versati prima del 1996. Può andare in pensione di vecchiaia?', ['Sì: basta avere 67 anni', 'Sì, ma con la pensione dimezzata', 'No: servono almeno 20 anni di contributi'], 2,
      "Per la pensione di vecchiaia servono tutti e due i requisiti: 67 anni di età e almeno 20 di contributi. L'uscita a 71 anni con 5 anni di contributi vale solo per chi ha iniziato a versare dal 1996."),
  ], 'I contributi di oggi pagano le pensioni di oggi. Nel 2026 si esce a 67 anni con 20 di contributi, o con 42 anni e 10 mesi di contributi. Controlla il tuo estratto conto sul sito INPS.'),

  LF('basi-14-2', '33%', 'Come si calcola la pensione', 7, [
    G("Giulia lavora 35 anni con uno stipendio lordo di 30.000 € l'anno e va in pensione a 67 anni. Quanto prende di pensione lorda al mese?",
      "Circa **1.500 €** lordi al mese per tredici mensilità: il 65% del suo stipendio lordo, che era di 2.308 € al mese. È un conto semplificato, in euro di oggi. Si fa in due passi: prima si sommano i contributi di tutta la carriera, poi si trasformano in pensione con un numero che dipende dall'età.",
      lo=500, hi=2500, step=50, truth=1500, near=150),
    P('Primo passo: il montante', r'''
**Ogni anno il 33% del tuo stipendio lordo viene segnato a tuo nome. La somma di tutta la carriera è il montante contributivo.**

Il **montante contributivo** non è un conto con dei soldi dentro: è una registrazione. Ma cresce come se lo fosse, perché ogni anno viene rivalutato.

La rivalutazione segue l'economia italiana: è la media di quanto è cresciuto il PIL negli ultimi cinque anni, prezzi compresi. Per i montanti maturati alla fine del 2024 è stata del 4,04%.

Due conseguenze.

• Contano tutti gli anni, non solo gli ultimi. Un anno a stipendio basso, o senza contributi, pesa per sempre.
• Se l'economia cresce poco, anche il montante cresce poco.

Con 30.000 € di stipendio lordo si aggiungono 9.900 € l'anno. In 35 anni, a stipendio fermo e senza contare le rivalutazioni, fanno 346.500 €.'''),
    P('Secondo passo: il coefficiente', r'''
Quando vai in pensione, il montante viene moltiplicato per un numero: il **coefficiente di trasformazione**.

$$\text{pensione} = \text{montante} \times \text{coefficiente}$$

Il risultato è la pensione lorda di un anno. Il coefficiente dipende solo dall'età a cui esci.

| Età | Coefficiente |
|---|---|
| 64 anni | 5,088% |
| 67 anni | 5,608% |
| 70 anni | 6,258% |
| 71 anni | 6,510% |

Più tardi esci, più è alto: lo stesso montante va diviso su meno anni di vita attesa.

Questi sono i valori del 2025 e del 2026. Vengono rivisti ogni due anni e, quando la speranza di vita si allunga, scendono.'''),
    N('Marco va in pensione a 67 anni con un montante di 300.000 €. Il coefficiente a 67 anni è 5,608%. Quanto vale la sua pensione lorda di un anno?', 16824, '€',
      r'\(\text{pensione} = \text{montante} \times \text{coefficiente} = 300.000 \times 5{,}608\% =\) **16.824 €** lordi, cioè 1.294 € al mese per tredici mensilità.', tol=1),
    LV('Costruisci una pensione', 'Conto semplificato, in euro di oggi: stipendio lordo medio di tutta la carriera, contributi rivalutati quanto i prezzi.', 'pensione', dict(),
      [dict(id='ral', label='Stipendio lordo medio, in un anno', min=20000, max=60000, step=1000, start=30000, unit='€'),
       dict(id='anni', label='Anni di contributi', min=20, max=45, step=1, start=35, unit='anni'),
       dict(id='eta', label='Età alla pensione', min=64, max=71, step=1, start=67, unit='anni')],
      [dict(label='Porta la pensione ad almeno il 70% dello stipendio', cond=[['tasso', '>=', 70]], hint="Servono più anni di contributi, oppure un'uscita più tardi. Lo stipendio non sposta la percentuale."),
       dict(label='Ora togli dieci anni di contributi: scendi a 25, uscendo non oltre i 67 anni', cond=[['anni', '<=', 25], ['eta', '<=', 67]], hint='Porta gli anni di contributi a 25 e guarda la percentuale.')],
      "Per chi esce a 67 anni, ogni anno di lavoro aggiunge alla pensione circa l'1,85% dello stipendio. Dieci anni senza contributi costano quasi un quinto dello stipendio, per tutta la vita. E alzare lo stipendio non cambia la percentuale: per quella servono più anni, o un'uscita più tardi."),
    Q("Due persone hanno lo stesso montante. Una va in pensione a 64 anni, l'altra a 67. Chi prende di più al mese?", ['Chi esce a 64 anni', 'Prendono la stessa cifra', 'Chi esce a 67 anni'], 2,
      'A 67 anni il coefficiente è 5,608%, a 64 è 5,088%. Chi esce più tardi riceve la pensione per meno anni, quindi ogni assegno è più alto.'),
    Q('Da che cosa dipende la rivalutazione del montante contributivo?', ["Dalla crescita dell'economia italiana", 'Dai rendimenti della Borsa', 'Da una decisione del datore di lavoro'], 0,
      'Il montante si rivaluta ogni anno con la media della crescita del PIL degli ultimi cinque anni. Non è investito sui mercati.'),
    Q('Lavori cinque anni senza contratto, in nero. Che effetto ha sulla pensione?', ['Nessuno: contano solo gli ultimi anni', 'Per quegli anni il montante non cresce, e la pensione sarà più bassa', 'La pensione arriva solo cinque anni dopo'], 1,
      "Senza contributi il montante resta fermo. A 67 anni, cinque anni in meno valgono circa il 9% dello stipendio in meno, per tutta la durata della pensione. E quegli anni non contano per raggiungere i requisiti."),
  ], 'Pensione = montante per coefficiente. Il montante è il 33% di ogni stipendio, rivalutato con il PIL. Il coefficiente cresce con l\'età. Ogni anno di contributi conta.'),

  LF('basi-14-3', 'ISC', 'I fondi pensione', 7, [
    G("Negli ultimi dieci anni il TFR lasciato in azienda si è rivalutato in media del 2,5% l'anno. Quanto hanno reso, in media all'anno, le linee più azionarie dei fondi pensione?",
      "Circa il **5% l'anno**, già tolti costi e tasse, secondo la COVIP, l'autorità che vigila sui fondi pensione. Lungo la strada però ci sono state più oscillazioni, e anche anni chiusi in perdita. Per questo conta l'orizzonte: chi ha davanti trent'anni può reggerle, chi va in pensione tra tre no.",
      lo=0, hi=10, step=1, truth=5, near=1, unit='%'),
    P('Un salvadanaio con il tuo nome', r'''
**Un fondo pensione è un salvadanaio a tuo nome, che si riapre quando vai in pensione. Aderire è una scelta tua.**

A differenza dell'INPS, qui i soldi ci sono davvero: vengono investiti, e quello che ritirerai dipende da quanto è entrato e da quanto ha reso.

Nel fondo possono entrare tre flussi.

• Il **TFR** che matura ogni anno.
• Un **contributo tuo**, di solito una piccola percentuale dello stipendio.
• Il **contributo del datore di lavoro**. Molti contratti lo prevedono, ma solo se aderisci e versi anche tu: altrimenti quei soldi non li vedi.

I fondi sono di tre tipi: i **fondi negoziali**, nati dai contratti di categoria; i **fondi aperti**, venduti da banche e società di gestione; e i **PIP**, che sono polizze. Alla fine del 2025 gli iscritti erano 10,5 milioni: quattro lavoratori su dieci.'''),
    P('Lo sconto fiscale', r'''
Lo Stato spinge verso i fondi pensione con le tasse, in tre momenti.

• **Quando versi.** I contributi si deducono dal reddito, fino a 5.300 € l'anno. Se la tua aliquota più alta è il 33%, ogni 1.000 € versati te ne costano 670.
• **Mentre crescono.** I rendimenti sono tassati al 20%, contro il 26% di un normale investimento.
• **Quando ritiri.** Sulla parte che avevi dedotto paghi il 15%, che scende fino al 9% per chi resta iscritto a lungo: 0,3 punti in meno per ogni anno oltre il quindicesimo.

In cambio c'è un vincolo: i soldi restano nel fondo fino alla pensione, salvo pochi casi.'''),
    N('Versi 1.500 € in un anno nel fondo pensione. La tua aliquota IRPEF più alta è il 33%. Di quanto scendono le tue imposte?', 495, '€',
      r'Il versamento si deduce dal reddito, quindi risparmi la tua aliquota più alta: \(1.500 \times 33\% =\) **495 €**. I 1.500 € ti sono costati 1.005 €.'),
    LV("Trent'anni di fondo pensione", "Esempio con una RAL di 30.000 €. Il TFR, 173 € al mese, entra comunque. Il datore aggiunge 40 € al mese se ne versi almeno 25. Rendimento del 4% l'anno, prima dei costi.", 'fondo',
      dict(tfr=173, soglia=25, datore=40, rend=4, aliq=23),
      [dict(id='versi', label='Versi tu, al mese', min=0, max=300, step=5, start=0, unit='€'),
       dict(id='anni', label='Anni nel fondo', min=10, max=40, step=1, start=30, unit='anni'),
       dict(id='isc', label="Costi del fondo, all'anno", min=0.25, max=2.25, step=0.25, start=1.25, unit='%', dec=2)],
      [dict(label='Fai arrivare il contributo del datore', cond=[['datoreTot', '>', 0]], hint='Il datore versa solo se versi anche tu: qui bastano 25 € al mese.'),
       dict(label="Ora porta i costi allo 0,5% l'anno, o meno", cond=[['datoreTot', '>', 0], ['isc10', '<=', 5]], hint="I fondi negoziali costano in media lo 0,47% l'anno, i PIP il 2,17%.")],
      "Se versi 30 € al mese, dopo lo sconto fiscale te ne costano 23, e il datore ne aggiunge 40: difficile trovare di meglio. I costi contano quanto i versamenti: in trent'anni, passare dall'1,25% allo 0,5% l'anno vale circa 18.000 € in più."),
    P('I vincoli, e come scegliere', r'''
I soldi di un fondo pensione non sono liberi. Prima della pensione puoi chiedere un anticipo solo in tre casi:

• spese sanitarie gravi: in qualsiasi momento, fino al 75%;
• acquisto o ristrutturazione della prima casa: dopo 8 anni di iscrizione, fino al 75%;
• altre esigenze: dopo 8 anni, fino al 30%.

Per scegliere un fondo guarda due cose.

• **I costi**, riassunti in un numero che si chiama **ISC**. In media, su dieci anni: 0,47% l'anno nei fondi negoziali, 1,36% in quelli aperti, 2,17% nei PIP. Sul sito della COVIP c'è un comparatore di tutti i fondi.
• **La linea di investimento.** Più azioni vuol dire più rendimento atteso e più oscillazioni: ha senso da giovani, e va ridotta quando la pensione si avvicina.'''),
    BK('Si può ritirare prima della pensione?', ['Sì, in parte', 'No'], [
      ('Spese sanitarie gravi, dopo 2 anni di iscrizione', 0, 'Per la salute si può chiedere in qualsiasi momento, fino al 75%.'),
      ('Prima casa, dopo 10 anni di iscrizione', 0, 'Dopo 8 anni si può chiedere fino al 75% per la prima casa.'),
      ('Prima casa, dopo 3 anni di iscrizione', 1, 'Per la casa servono almeno 8 anni di iscrizione.'),
      ("Un'auto nuova, dopo 9 anni di iscrizione", 0, 'Dopo 8 anni si può chiedere fino al 30% anche per altre esigenze.'),
      ('Una vacanza, dopo 5 anni di iscrizione', 1, 'Prima di 8 anni si può ritirare solo per spese sanitarie gravi.')]),
    Q("Il tuo contratto prevede che il datore versi l'1,5% dello stipendio nel fondo pensione, se aderisci e versi anche tu. Non aderisci. Che fine fa quell'1,5%?", ['Ti arriva in busta paga', 'Lo perdi: resta al datore', "Va all'INPS a tuo nome"], 1,
      "Il contributo del datore esiste solo per chi aderisce al fondo. Chi non aderisce non lo riceve in nessun'altra forma: è una parte di retribuzione a cui rinuncia."),
    Q("Due fondi investono allo stesso modo. Uno costa lo 0,5% l'anno, l'altro il 2%. Dopo trent'anni, che differenza c'è?", ["Nessuna: i costi contano solo all'inizio", 'Piccola: pochi euro', 'Grande: molte migliaia di euro'], 2,
      "I costi si pagano ogni anno su tutto il capitale, e quello che tolgono smette di rendere. Su trent'anni un punto e mezzo di differenza vale decine di migliaia di euro."),
    Q("Hai 28 anni e andrai in pensione tra circa quarant'anni. Quale linea di investimento ha più senso valutare per prima?", ['Una con molte azioni, da ridurre quando la pensione si avvicina', 'Solo quella garantita', 'Quella con il nome più rassicurante'], 0,
      "Con quarant'anni davanti c'è il tempo per assorbire le oscillazioni delle azioni e raccoglierne il rendimento atteso più alto. Avvicinandosi alla pensione il rischio va ridotto."),
  ], "Nel fondo pensione entrano TFR, contributo tuo e contributo del datore, che perdi se non aderisci. I versamenti si deducono fino a 5.300 €. Guarda i costi: l'ISC."),

  LF('basi-14-4', '6,9%', 'TFR: in azienda o nel fondo?', 7, [
    G("Trovi il tuo primo lavoro in un'azienda privata dopo il 1° luglio 2026, e non comunichi nessuna scelta sul TFR. Dopo 60 giorni, che cosa succede?",
      "Dal 1° luglio 2026 chi viene assunto per la prima volta nel settore privato e non sceglie entro 60 giorni viene iscritto in automatico al fondo pensione previsto dal suo contratto, e il TFR va lì. Non decidere è quindi già una decisione. Meglio prenderla sapendo che cosa cambia.",
      options=['Il TFR resta in azienda', 'Il TFR va nel fondo pensione previsto dal contratto', 'Il TFR viene pagato ogni mese in busta paga'], ans=1),
    P('Due strade per gli stessi soldi', r'''
**Il TFR è tuo in ogni caso. Quello che scegli è dove farlo maturare.**

| | Azienda | Fondo |
|---|---|---|
| Cresce | 1,5% più ¾ dell'inflazione | con i mercati |
| Garantito | sì, dalla legge | no |
| Lo incassi | quando il lavoro finisce | alla pensione |
| Tasse finali | dal 23% in su | dal 15% al 9% |

Una differenza pesa più delle altre: la scelta del fondo **non si può annullare**. Chi lascia il TFR in azienda può spostarlo nel fondo quando vuole. Il contrario no.

Nelle aziende più grandi il TFR lasciato in azienda viene versato a un fondo dell'INPS. Per te non cambia nulla: regole e importi restano gli stessi.'''),
    LV('Chi ti lascia di più', 'RAL di 30.000 €. Il confronto è al netto delle tasse finali: 23% sul TFR in azienda, tra il 15% e il 9% su quello nel fondo.', 'tfrscelta', dict(ral=30000, aliqTfr=23),
      [dict(id='anni', label='Anni di lavoro', min=10, max=40, step=1, start=30, unit='anni'),
       dict(id='rend', label='Rendimento netto del fondo', min=0, max=6, step=0.25, start=3, unit='%', dec=2),
       dict(id='infl', label="Inflazione all'anno", min=0, max=6, step=0.5, start=2, unit='%', dec=1)],
      [dict(label="Trova un caso in cui conviene lasciare il TFR in azienda", cond=[['diff', '<', 0]], hint="Prova con un fondo che rende poco, oppure con un'inflazione alta."),
       dict(label="Ora porta l'inflazione al 5% e fai vincere il fondo", cond=[['infl10', '>=', 50], ['diff', '>', 0]], hint="Con l'inflazione al 5% il TFR in azienda si rivaluta del 4,4% netto: al fondo serve di più.")],
      "Con l'inflazione al 2% e trent'anni davanti, al fondo basta rendere il 2% netto per battere l'azienda: il resto lo fanno le tasse più basse. Con l'inflazione al 5% gli serve più del 4%. Il TFR in azienda è prevedibile e protegge quando i prezzi corrono. Il fondo ha dalla sua il fisco e, sui tempi lunghi, i rendimenti dei mercati, che però non sono garantiti."),
    P('Che cosa pesa nella scelta', r'''
Oltre al rendimento, quattro cose spostano la decisione.

• **Il contributo del datore.** Se il tuo contratto lo prevede, arriva solo a chi aderisce al fondo. Rinunciare vuol dire lasciare sul tavolo una parte di stipendio.
• **Il tempo.** Con trent'anni davanti le oscillazioni dei mercati contano poco. Con tre, molto.
• **La disponibilità.** Il TFR in azienda lo incassi a ogni cambio di lavoro: è un cuscinetto, ma anche una tentazione. Nel fondo resta chiuso fino alla pensione.
• **La solidità dell'azienda.** In un'impresa in difficoltà il TFR può arrivare tardi. Se fallisce, lo paga un fondo di garanzia dell'INPS.'''),
    BK('In azienda o nel fondo?', ['In azienda', 'Nel fondo'], [
      ('La rivalutazione è fissata dalla legge', 0, "1,5% più tre quarti dell'inflazione, ogni anno."),
      ('Il rendimento dipende dai mercati', 1, 'Il fondo investe: può rendere di più, ma non è garantito.'),
      ('Lo incassi quando cambi lavoro', 0, 'Il TFR in azienda viene pagato alla fine di ogni rapporto di lavoro.'),
      ('Alla fine è tassato tra il 15% e il 9%', 1, 'È la tassazione di favore dei fondi pensione.'),
      ('Può arrivare il contributo del datore', 1, 'Il contributo del datore va solo a chi aderisce al fondo.'),
      ('La scelta si può cambiare quando vuoi', 0, "Dall'azienda puoi passare al fondo in ogni momento. Il contrario non si può.")]),
    Q('Hai scelto il fondo pensione per il tuo TFR. Dopo due anni cambi idea. Puoi riportare il TFR in azienda?', ['Sì, in qualsiasi momento', 'Sì, pagando una penale', 'No: la scelta del fondo non si può annullare'], 2,
      'La scelta di destinare il TFR al fondo pensione vale per sempre. Si può cambiare fondo o linea di investimento, ma non tornare al TFR in azienda.'),
    Q('A parità di rendimento, perché il TFR nel fondo può lasciarti più soldi di quello in azienda?', ['Perché alla fine è tassato meno', 'Perché un fondo non ha costi', 'Perché è garantito dallo Stato'], 0,
      "Il TFR in azienda è tassato con un'aliquota che di norma parte dal 23%. Nel fondo si paga il 15%, che scende fino al 9% per chi resta iscritto a lungo."),
    Q('In quale situazione il TFR lasciato in azienda rende più di un fondo pensione?', ['Quando i mercati salgono molto', "Quando l'inflazione è alta e i mercati rendono poco", 'In nessun caso'], 1,
      "La rivalutazione del TFR sale con l'inflazione: con i prezzi al 5% supera il 4% netto. Se nello stesso periodo i mercati rendono poco, il fondo resta indietro."),
  ], "Il TFR in azienda si rivaluta dell'1,5% più tre quarti dell'inflazione. Nel fondo segue i mercati, paga meno tasse e può avere il contributo del datore, ma la scelta non si annulla."),
])

# Unità 15: capire le notizie di economia. Definizioni ISTAT ed europee; i dati citati sono quelli disponibili a novembre 2026 e vanno riguardati (vedi FONTI_BASI.md).
# Leve "lavoro", "debito" e "indice" in p35_steps.js.
U15 = dict(id='basi-u15', sid='basi-notizie', name='Capire le notizie', lessons=[
  LF('basi-15-1', 'PIL', 'PIL, inflazione, disoccupazione', 8, [
    G('Su 100 italiani tra i 15 e i 64 anni, 63 hanno un lavoro. Degli altri 37, quanti risultano disoccupati nelle statistiche?',
      "Circa **4**. Gli altri 33 non lavorano ma nemmeno cercano un lavoro: studiano, si occupano della casa, hanno smesso di cercare. Le statistiche li chiamano **inattivi**. Per l'ISTAT è disoccupato solo chi non ha un lavoro, lo sta cercando ed è pronto a iniziare. E il tasso di disoccupazione si calcola solo su chi lavora o cerca: 4 su 67, cioè circa il 6%.",
      lo=0, hi=37, step=1, truth=4, near=2, unit='persone'),
    P('Il PIL, e come leggerlo', r'''
**Il PIL è il valore di tutto quello che un Paese produce in un periodo: beni e servizi, dal pane alle visite mediche.**

Quando una notizia dice che il PIL è cresciuto, guarda tre cose.

• **Rispetto a quando.** La variazione sul trimestre prima si chiama congiunturale; quella sullo stesso trimestre di un anno fa, tendenziale. Nell'estate 2026 il PIL italiano era fermo sul trimestre prima e più alto dello 0,8% rispetto a un anno prima.
• **Reale o nominale.** Il PIL nominale sale anche solo perché salgono i prezzi. Quello reale toglie l'inflazione: è il numero dei telegiornali.
• **In totale o a testa.** Un Paese può crescere solo perché ha più abitanti. Per il tenore di vita conta il **PIL pro capite**.

La crescita reale si ricava, più o meno, così:

$$\text{reale} \approx \text{nominale} - \text{inflazione}$$

E un limite: il PIL misura quanto si produce, non come si vive. Non dice come il reddito è diviso, e non conta il lavoro non pagato.'''),
    N('In un anno il PIL nominale di un Paese cresce del 3,5% e i prezzi del 2,7%. Di quanto è cresciuto, più o meno, il PIL reale?', 0.8, '%',
      r'\(\text{crescita reale} \approx \text{crescita nominale} - \text{inflazione} = 3{,}5\% - 2{,}7\% =\) **0,8%**. Il resto della crescita è fatto solo di prezzi più alti.', tol=0.05, dec=1),
    P("L'inflazione nei titoli", r'''
L'inflazione l'hai già incontrata: è l'aumento generale dei prezzi. Nelle notizie arriva con tre etichette.

• **Su base annua**: i prezzi di questo mese contro quelli dello stesso mese di un anno fa. È il numero dei titoli.
• **Su base mensile**: contro il mese scorso. Dice se la corsa sta accelerando o rallentando.
• Il **carrello della spesa**: solo alimentari e prodotti per la casa e la persona. Sono gli acquisti di tutti i giorni, quindi è l'aumento che senti di più.

Un esempio vero: a ottobre 2026 l'ISTAT ha stimato un +5,4% su base annua e un +0,9% sul mese, con il carrello della spesa a +2,5%. A correre erano i prezzi dell'energia.

Una trappola frequente: se l'inflazione scende dal 5% al 3%, i prezzi non scendono. Salgono ancora, solo più piano.'''),
    LV('Cento persone e un tasso', 'Cento persone tra i 15 e i 64 anni. Chi non è occupato e non cerca lavoro è inattivo.', 'lavoro', dict(),
      [dict(id='occ', label='Occupati', min=55, max=70, step=1, start=63, unit=''),
       dict(id='dis', label='Disoccupati: cercano lavoro', min=1, max=12, step=1, start=4, unit='')],
      [dict(label='Fai scendere la disoccupazione sotto il 5% senza creare posti di lavoro', cond=[['tasso10', '<', 50], ['occ', '<=', 63]], hint='Se gli occupati restano 63, può cambiare solo il numero di chi cerca.'),
       dict(label='Ora crea tre posti di lavoro', cond=[['occ', '>=', 66]], hint='Porta gli occupati a 66 e guarda che cosa fanno i due tassi.')],
      'Il tasso di disoccupazione conta solo chi cerca lavoro. Se qualcuno smette di cercare diventa inattivo, e il tasso scende anche se nessuno ha trovato un posto. Per questo va letto insieme al tasso di occupazione, che dice quante persone lavorano davvero.'),
    BK('Occupato, disoccupato o inattivo?', ['Occupato', 'Disoccupato', 'Inattivo'], [
      ('Lavora part-time, 20 ore a settimana', 0, "Per le statistiche basta aver lavorato almeno un'ora nella settimana."),
      ('Senza lavoro, manda curriculum ogni settimana', 1, 'Non lavora, cerca ed è disponibile: è disoccupato.'),
      ('Studia e non cerca lavoro', 2, 'Non lavora e non cerca: per le statistiche è tra gli inattivi.'),
      ('Ha smesso di cercare: pensa di non trovare', 2, 'Chi non cerca più non conta tra i disoccupati.'),
      ('In cassa integrazione da un mese', 0, 'Chi è assente dal lavoro per poco tempo resta tra gli occupati.')]),
    Q("Il PIL reale di un Paese cresce dello 0,5% e la popolazione dell'1%. Che cosa succede al PIL pro capite?", ['Sale', 'Scende', 'Resta uguale'], 1,
      'Il PIL cresce meno della popolazione: la parte che in media tocca a ciascuno si riduce di circa mezzo punto percentuale.'),
    Q("L'inflazione passa dal 5% al 2%. Che cosa fanno i prezzi?", ['Scendono del 3%', 'Tornano al livello di un anno prima', 'Salgono ancora, ma più lentamente'], 2,
      "Un'inflazione più bassa vuol dire prezzi che aumentano meno in fretta. Perché i prezzi scendano serve un'inflazione negativa, che si chiama deflazione."),
    Q('In un mese il tasso di disoccupazione scende, ma gli occupati non aumentano. Che cosa può essere successo?', ['Alcune persone hanno smesso di cercare lavoro', 'Sono aumentati gli stipendi', 'È cresciuto il PIL'], 0,
      'Chi smette di cercare passa da disoccupato a inattivo, ed esce dal conto. Il tasso scende anche se nessuno ha trovato un lavoro.'),
  ], "PIL: guarda se è reale e rispetto a quando. Inflazione più bassa non vuol dire prezzi più bassi. La disoccupazione conta solo chi cerca: leggila insieme all'occupazione."),

  LF('basi-15-2', '3%', 'Deficit e debito pubblico', 8, [
    G('Nel 2025 lo Stato italiano ha speso più di quanto ha incassato. Di quanto, per ogni 1.000 € di PIL?',
      "**31 €** ogni 1.000 di PIL, cioè il 3,1%: è il **deficit**. Sembra poco, ma si aggiunge a un debito che vale già 1.367 € ogni 1.000 di PIL. Il deficit è quello che manca in un anno. Il debito è quello che si è accumulato in tutti gli anni passati.",
      lo=0, hi=100, step=1, truth=31, near=8),
    P('Due parole che si confondono', r'''
**Il deficit è quanto lo Stato spende in più di quanto incassa in un anno. Il debito pubblico è la somma dei deficit del passato, ancora da restituire.**

Uno si misura in un anno, l'altro si accumula nel tempo.

Per coprire il deficit lo Stato si fa prestare i soldi, vendendo titoli come BOT e BTP. Ogni anno chiuso in deficit aggiunge debito.

I due numeri si misurano in rapporto al PIL, perché conta la dimensione del debito rispetto all'economia che deve reggerlo.

| | Italia, 2025 | Soglia UE |
|---|---|---|
| Deficit | 3,1% del PIL | 3% |
| Debito | 136,7% del PIL | 60% |

Chi supera il 3% di deficit può finire in una procedura europea, che chiede un piano per rientrare. L'Italia c'è dal 2024.'''),
    BK('Deficit o debito?', ['Deficit', 'Debito'], [
      ("Quanto lo Stato spende più di quanto incassa quest'anno", 0, 'È il risultato di un solo anno.'),
      ('Tutti i BOT e i BTP ancora da rimborsare', 1, 'È quello che lo Stato deve restituire in tutto.'),
      ('Il riferimento europeo è il 3% del PIL', 0, 'Il 3% riguarda il deficit di ogni anno.'),
      ('Il riferimento europeo è il 60% del PIL', 1, 'Il 60% riguarda il debito accumulato.'),
      ('Cresce ogni anno in cui i conti chiudono in rosso', 1, 'Ogni deficit si aggiunge al debito.')]),
    P('Che cosa fa salire o scendere il debito', r'''
Il rapporto tra debito e PIL può scendere anche senza restituire un euro. Dipende da tre forze.

• **Gli interessi** fanno crescere il debito, perché vanno pagati ogni anno. Nel 2025 l'Italia ne ha pagati 87 miliardi: il 3,8% del PIL.
• **La crescita** fa crescere il PIL, cioè il numero sotto la frazione. Conta quella nominale, prezzi compresi.
• Il **saldo primario**: la differenza tra entrate e spese prima di pagare gli interessi. Se è positivo si chiama avanzo primario, e riduce il debito. Nel 2025 quello italiano è stato lo 0,8% del PIL.

La regola è questa: se il tasso pagato sul debito è più alto della crescita, il debito sale da solo, e per fermarlo serve un avanzo primario. Se la crescita supera il tasso, il debito scende da solo.'''),
    LV('Dieci anni di debito pubblico', 'Si parte da numeri vicini a quelli italiani del 2025: debito al 137% del PIL e deficit al 3,1%.', 'debito', dict(debito=137, anni=10),
      [dict(id='crescita', label='Crescita del PIL, prezzi compresi', min=0, max=6, step=0.5, start=2.5, unit='%', dec=1),
       dict(id='tasso', label='Tasso medio pagato sul debito', min=1, max=6, step=0.5, start=3, unit='%', dec=1),
       dict(id='primario', label='Saldo primario, sul PIL', min=-3, max=4, step=0.5, start=1, unit='%', dec=1)],
      [dict(label='Fai scendere il debito sotto il 130% del PIL', cond=[['finale', '<', 130]], hint='Puoi alzare la crescita, abbassare il tasso o aumentare il saldo primario.'),
       dict(label="Ora riuscirci con una crescita dell'1%", cond=[['finale', '<', 130], ['crescita', '<=', 1]], hint='Con poca crescita serve un avanzo primario grande, oppure un tasso più basso.')],
      "Se la crescita si ferma all'1% e il tasso resta al 3%, per scendere sotto il 130% serve un avanzo primario del 3,5% del PIL ogni anno, per dieci anni: più tasse o meno spese per decine di miliardi. Con una crescita del 3,5% basterebbe mezzo punto. Per questo, quando si parla di debito, la crescita conta quanto i tagli."),
    N('Un Paese ha un debito pari al 140% del PIL e paga in media il 3% di interessi. Quanto spende ogni anno in interessi, in percentuale del PIL?', 4.2, '%',
      r'\(\text{interessi} = \text{debito} \times \text{tasso} = 140\% \times 3\% =\) **4,2%** del PIL. Sono soldi che ogni anno non possono andare a scuole, sanità o pensioni.', tol=0.05, dec=1),
    Q("Un Paese chiude l'anno con un deficit più basso di quello dell'anno prima. Che cosa succede al suo debito?", ['Scende', 'Resta fermo', 'Sale ancora, ma meno di prima'], 2,
      'Finché i conti chiudono in deficit, il debito in euro aumenta. Un deficit più piccolo vuol dire solo che aumenta più lentamente.'),
    Q("Che cos'è l'avanzo primario?", ['Entrate più alte delle spese, prima di pagare gli interessi', 'Il debito che avanza a fine anno', 'Un prestito europeo'], 0,
      "Il saldo primario confronta entrate e spese senza contare gli interessi sul debito. Quando è positivo si chiama avanzo primario: sono le risorse che restano per pagare gli interessi e ridurre il debito."),
    Q('Un debito costa in media il 3% e il PIL nominale cresce del 5%. Con un saldo primario in pareggio, che cosa fa il rapporto tra debito e PIL?', ['Sale', 'Scende', 'Resta uguale'], 1,
      'Il debito cresce del 3% per gli interessi, ma il PIL cresce del 5%: la frazione si riduce. È il motivo per cui la crescita, anche fatta di inflazione, alleggerisce il debito.'),
  ], 'Il deficit è di un anno, il debito si accumula. Si misurano sul PIL. Il debito scende se la crescita supera il tasso pagato, oppure con un avanzo primario.'),

  LF('basi-15-3', 'BTP', 'Spread e rating', 7, [
    G('Novembre 2011, piena crisi del debito: lo spread tra BTP e Bund tocca il suo record. Quanti punti base?',
      "**574 punti base**, il 9 novembre 2011: per prestare soldi all'Italia per dieci anni il mercato chiedeva il 5,74% in più che alla Germania. Il 10 novembre 2026 lo spread era a 102. Quel numero è un termometro: dice quanto è considerato rischioso prestare a uno Stato rispetto a un altro.",
      lo=0, hi=1000, step=10, truth=574, near=60, unit='punti'),
    P("Che cos'è lo spread", r'''
**Lo spread è la differenza tra il rendimento dei titoli di Stato italiani a dieci anni, i BTP, e quello dei titoli tedeschi, i Bund.**

Si misura in **punti base**: 100 punti base sono un punto percentuale.

$$\text{spread} = \text{BTP} - \text{Bund}$$

La Germania fa da paragone perché i suoi titoli sono considerati i più sicuri dell'area euro. Lo **spread** è quindi il premio che il mercato chiede per prestare all'Italia invece che alla Germania.

Perché finisce nei telegiornali:

• se sale, lo Stato paga interessi più alti sui titoli nuovi, e quei soldi escono dal bilancio pubblico;
• con il tempo salgono anche i tassi che le banche chiedono su mutui e prestiti;
• chi ha già dei BTP vede scendere il loro prezzo.'''),
    N('Il 10 novembre 2026 il BTP a dieci anni rendeva il 4,27% e il Bund il 3,25%. Quanto valeva lo spread, in punti base?', 102, '',
      r'\(\text{spread} = 4{,}27\% - 3{,}25\% = 1{,}02\%\). Un punto percentuale sono 100 punti base, quindi lo spread era di **102 punti base**.'),
    P('Il rating: la pagella del debito', r'''
Il **rating** è un voto sulla capacità di uno Stato, o di un'azienda, di restituire i propri debiti. Lo danno agenzie private: le più seguite sono S&P, Moody's e Fitch.

La scala va da AAA, il massimo, fino a D, che vuol dire mancato pagamento. La linea che conta sta a metà.

| Fascia | Voti di S&P |
|---|---|
| Investment grade | da AAA a BBB− |
| Speculativa | da BB+ in giù |

Molti fondi possono comprare solo titoli **investment grade**. Chi scende sotto quella linea perde una parte dei compratori, e paga tassi più alti.

All'inizio di novembre 2026 l'Italia ha BBB+ da S&P e da Fitch, e Baa2 da Moody's, che nella sua scala vale BBB: pochi gradini sopra la linea.

Accanto al voto c'è l'**outlook**: positivo, stabile o negativo. Dice in che direzione il voto potrebbe muoversi.'''),
    OR('Dal più sicuro al più rischioso', ['AAA', 'A', 'BBB', 'BB', 'CCC'],
      x='Tocca i voti dal più alto al più basso.',
      after='Da BBB in su siamo nella fascia investment grade. Da BB in giù in quella speculativa. Dentro ogni lettera ci sono poi i più e i meno: BBB+ è un gradino sopra BBB.'),
    Q('Lo spread passa da 80 a 150 punti base. Che cosa vuol dire?', ["Che il mercato chiede di più per prestare all'Italia invece che alla Germania", 'Che i BTP rendono meno dei Bund', 'Che il debito pubblico è diminuito'], 0,
      "Uno spread più largo vuol dire che il rendimento dei BTP si è allontanato da quello dei Bund: per comprare titoli italiani il mercato vuole un premio più alto."),
    Q('Hai in portafoglio un BTP comprato un anno fa. Lo spread sale molto, con i rendimenti tedeschi fermi. Che cosa succede al prezzo del tuo titolo?', ['Sale', 'Scende', 'Non cambia'], 1,
      'Se lo spread sale con i Bund fermi, è salito il rendimento dei BTP. I titoli già in circolazione, che pagano cedole più basse, valgono meno. Se lo tieni fino alla scadenza ricevi comunque tutto il capitale.'),
    Q('Un Paese passa da BBB− a BB+. Perché è una notizia importante?', ['Perché sale di un gradino', 'Perché cambia solo il nome del voto', 'Perché esce dalla fascia investment grade'], 2,
      "BBB− è l'ultimo gradino dell'investment grade. Con BB+ si entra nella fascia speculativa: molti fondi non possono più tenere quei titoli e devono venderli."),
  ], 'Lo spread è il rendimento in più dei BTP rispetto ai Bund, in punti base. Il rating è il voto sul debito: da BBB− in su è investment grade, sotto è speculativo.'),

  LF('basi-15-4', 'MIB', 'Gli indici di Borsa', 7, [
    G("Il FTSE MIB è l'indice più citato della Borsa italiana. Quante società contiene?",
      "Sono **40**: le società più grandi e più scambiate tra quelle quotate a Milano. Un indice non è tutta la Borsa: è un paniere scelto con una regola. L'S&P 500 americano ne contiene 500, il DAX tedesco 40.",
      lo=0, hi=300, step=10, truth=40, near=10, unit='società'),
    P('Che cosa misura un indice', r'''
**Un indice di Borsa riassume in un solo numero i prezzi di un gruppo di azioni. Se sale, in media quelle azioni valgono di più.**

Il suo valore si esprime in punti, ma i punti da soli non dicono nulla: conta la variazione in percentuale, che si calcola così:

$$\frac{\text{oggi} - \text{ieri}}{\text{ieri}}$$

Ogni indice racconta un pezzo di mercato diverso.

• Il **FTSE MIB**: 40 grandi società italiane, tra cui pesano molto banche ed energia.
• L'**S&P 500**: 500 grandi società americane, tra cui pesa molto la tecnologia.

Quando senti che la Borsa ha bruciato miliardi, vuol dire che è sceso il valore di mercato delle società. Non è sparito denaro contante: sono scesi i prezzi a cui quelle azioni si scambiano. Possono risalire, o scendere ancora.'''),
    N('Un indice chiude a 40.600 punti. Il giorno prima aveva chiuso a 40.000. Di quanto è salito, in percentuale?', 1.5, '%',
      r'\(\text{variazione} = \dfrac{40.600 - 40.000}{40.000} = \dfrac{600}{40.000} =\) **1,5%**.', tol=0.05, dec=1),
    P('Non tutte pesano uguale', r'''
Nella maggior parte degli indici le società non contano allo stesso modo: ognuna pesa in proporzione al suo valore in Borsa, la **capitalizzazione**.

Una società che vale 100 miliardi sposta l'indice dieci volte più di una che ne vale 10.

Due conseguenze.

• Pochi nomi possono decidere la giornata. Nel FTSE MIB, a metà 2026, le prime cinque società valevano da sole più di metà dell'indice.
• L'indice può salire anche se la maggior parte dei titoli scende: basta che salgano i più grandi.'''),
    LV('Un indice con tre società', 'Tre società: la grande pesa 60, la media 30, la piccola 10. Muovi le loro variazioni di giornata.', 'indice', dict(pa=60, pb=30, pc=10),
      [dict(id='a', label='La grande, peso 60', min=-10, max=10, step=1, start=0, unit='%'),
       dict(id='b', label='La media, peso 30', min=-10, max=10, step=1, start=0, unit='%'),
       dict(id='c', label='La piccola, peso 10', min=-10, max=10, step=1, start=0, unit='%')],
      [dict(label="Fai salire l'indice del 3% con la media e la piccola ferme o in calo", cond=[['ind10', '>=', 30], ['b', '<=', 0], ['c', '<=', 0]], hint='Basta muovere la società più grande.'),
       dict(label="Ora fai chiudere l'indice in calo con due società su tre in rialzo", cond=[['ind10', '<', 0], ['su', '>=', 2]], hint='Fai scendere la grande, e salire di poco le altre due.')],
      "La società grande vale da sola il 60% dell'indice: se sale del 5%, l'indice sale del 3% con le altre ferme. E una giornata con due titoli su tre in rialzo può chiudersi in rosso. L'indice dice come va il mercato in media, pesata per il valore. Non dice come va la maggior parte delle società."),
    P('Due avvertenze sui titoli dei giornali', r'''
• **I dividendi non si vedono.** Quasi tutti gli indici citati nelle notizie seguono solo i prezzi. Chi ha tenuto le azioni ha incassato anche i dividendi: su molti anni, il rendimento vero è più alto di quello che l'indice mostra.
• **I punti ingannano.** Un calo di 500 punti è grave su un indice a 5.000 e quasi nulla su uno a 50.000. Guarda sempre la percentuale.

E ricorda che un indice non è l'economia. Dentro ci sono solo le società quotate, spesso grandi e con molti affari all'estero: la Borsa può salire in un anno in cui il PIL è fermo.'''),
    Q('Un indice perde 400 punti. Che cosa ti serve per capire se è tanto o poco?', ["Il nome dell'indice", 'Il valore da cui partiva, per calcolare la percentuale', 'Il numero di società che contiene'], 1,
      'Quattrocento punti sono il 4% di un indice a 10.000 e lo 0,8% di uno a 50.000. Senza il valore di partenza il numero non dice nulla.'),
    Q('In un indice pesato per capitalizzazione, quale società sposta di più il risultato?', ['Quella con più dipendenti', 'Quella quotata da più tempo', 'Quella che vale di più in Borsa'], 2,
      'Il peso di ogni società è in proporzione al suo valore di mercato. Le più grandi contano di più, e possono decidere da sole la direzione della giornata.'),
    Q("Il FTSE MIB sale dell'1%. Che cosa puoi dire di sicuro?", ['Che, tenendo conto dei pesi, le sue 40 società in media valgono di più', 'Che tutte le azioni italiane sono salite', "Che l'economia italiana è cresciuta dell'1%"], 0,
      "Un indice dice come è andato in media il suo paniere, pesato per il valore. Alcune società possono essere scese, quelle fuori dal paniere non contano, e la Borsa non è il PIL."),
  ], 'Un indice è un paniere di azioni pesato per valore di mercato: guarda la percentuale, non i punti. Di solito non conta i dividendi. E la Borsa non è tutta l\'economia.'),
])

# Ordine del percorso: prima i soldi di tutti i giorni (tempo, budget, banca e pagamenti, debiti, protezione), poi gli investimenti (strumenti, rischio, come si investe, gli errori della testa), poi aziende ed economia.
# L'ordine si può cambiare liberamente: i progressi sono legati alle chiavi delle lezioni, non alla posizione.
UNITS = [U1, U7, U12, U11, U4, U13, U8, U2, U3, U9, U10, U14, U5, U6, U15]
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
            elif T == 'lever': assert s['model'] in ('mutuo', 'carta', 'piano', 'obiettivo', 'budget', 'inflazione', 'conto', 'garanzia', 'netto', 'irpef', 'sconto', 'tfr', 'rate', 'quinto', 'casa', 'mutuomax', 'surroga', 'pensione', 'fondo', 'tfrscelta', 'lavoro', 'debito', 'indice') and s['goals'] and all(g['cond'] and g['label'] for g in s['goals']) and all(x['min'] <= x['start'] <= x['max'] for x in s['sliders']), l['key']
            elif T == 'bucket': assert 2 <= len(s['buckets']) <= 3 and len(s['items']) >= 3 and all(0 <= i[1] < len(s['buckets']) for i in s['items']) and set(i[1] for i in s['items']) == set(range(len(s['buckets']))), l['key']
            elif T == 'order': assert len(s['items']) >= 3 and len(set(s['items'])) == len(s['items']), l['key']
            elif T == 'num': assert isinstance(s['ans'], (int, float)) and s['tol'] >= 0 and s['unit'] in ('€', '%', '', 'anni', 'mesi', 'quote'), l['key']
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
def _apici(o, dove=''):
    if isinstance(o, str): assert "\\'" not in o, ('barra rovesciata davanti a un apice', dove, o[:60])
    elif isinstance(o, list): [_apici(x, dove) for x in o]
    elif isinstance(o, dict): [_apici(v, o.get('key') or dove) for v in o.values()]
_apici(UNITS)
# spazio che non va a capo tra la cifra e la valuta ("150 €" resta sulla stessa riga)
def nb(o):
    if isinstance(o, str): return re.sub(r'(?<=\\\)) (?=[€$])', '\u00a0', re.sub(r'(?<=\d) (?=[€$])', '\u00a0', o))
    if isinstance(o, list): return [nb(x) for x in o]
    if isinstance(o, dict): return {k: (v if k in ('key', 'id', 'sid', 'sym', 'type', 'widget', 'model', 'unit', 'cond', 'params') else nb(v)) for k, v in o.items()}
    return o
UNITS = nb(UNITS)
json.dump(UNITS, open(H + '/basi.json', 'w'), ensure_ascii=False, separators=(',', ':'))
print('unità', len(UNITS), '| lezioni', len(keys), '| domande', nq, '| abbina', nm, '| risposta giusta in A/B/C:', [pos[i] for i in range(3)], '| minuti', sum(l['minutes'] for u in UNITS for l in u['lessons']), '| passi nuovi:', dict((k, v) for k, v in steps.items() if k not in ('page', 'ex')))
