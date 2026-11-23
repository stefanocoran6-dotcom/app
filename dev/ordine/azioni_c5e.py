# Capitolo 5 di «Azioni», parte 4: i soldi che arriveranno (dividendi scontati, crescita costante, crescita sostenibile, due fasi).
from lezioni_lib import Q, P, F, G, LV, BK, N, LF

LEZIONI = [
  # ---------------------------------------------------------------------------------------------------
  LF('az-5-13', '€→', 'Scontare i dividendi', 10, [
    G('Tra un anno Nora riceverà 109 €. Oggi, con lo stesso rischio, può investire al 9% l\'anno. Quanto valgono oggi per lei quei 109 €?',
      r"\(\dfrac{109}{1{,}09} =\) **100 €**. Con 100 € investiti al 9%, tra un anno ne avrebbe 109: per lei le due cose sono uguali. Riportare a oggi una cifra futura si dice **scontare**, ed è il motore di tutta questa parte.",
      lo=90, hi=110, step=1, truth=100, near=1, unit='€'),
    P('Riportare a oggi', r'''
Nelle Basi hai visto l'interesse composto: una cifra di oggi cresce nel tempo. Scontare è lo stesso conto fatto al contrario: da una cifra futura si torna al suo **valore attuale**.

$$V = \frac{F}{(1 + r)^n}$$

\(F\) = cifra futura, \(r\) = rendimento annuo, \(n\) = anni, \(V\) = valore di oggi.

Al 9%, per Nora:

• 109 € tra un anno valgono oggi \(\dfrac{109}{1{,}09} = 100\) €
• 109 € tra due anni valgono \(\dfrac{109}{1{,}09^2} = 91{,}74\) €
• 109 € tra dieci anni valgono 46,04 €

Più i soldi sono lontani, meno valgono oggi. E più alto è il rendimento che usi per scontare, meno valgono: al 12%, quei 109 € tra dieci anni varrebbero solo 35,10 €.'''),
    P('Il rendimento che chiedi', r'''
Con quale rendimento si sconta? Con quello che **chiedi** per mettere i tuoi soldi in quell'azione: il **rendimento richiesto**.

Si costruisce in due pezzi.

• **La base**: quello che renderebbe un investimento senza rischio, come un titolo di Stato sicuro.
• **Il premio per il rischio**: quello che vuoi in più per accettare che le cose possano andare male.

Per Velonda, Nora ragiona così. Ipotesi: un titolo sicuro rende il 3%. Per il rischio di un'azione come Velonda vuole 6 punti in più.

$$r = 3\% + 6\% = 9\%$$

Non è un numero uguale per tutti. Per un'azienda più rischiosa, piena di debiti o con utili ballerini, si chiede di più. E quando i titoli sicuri rendono di più, sale la base per tutte le azioni.

Come si stima il premio con i numeri lo vedrai nel secondo livello, «Quanto vale davvero».'''),
    P("Un'azione tenuta un anno", r'''
Un'azione dà due cose a chi la possiede: i **dividendi**, e il prezzo a cui la rivende.

Nora pensa di tenere Velonda un anno. Velonda ha annunciato per l'anno prossimo un dividendo di 0,48 € per azione. Nora si aspetta di rivendere a 12,60 €.

$$V = \frac{\text{Div}_1 + P_1}{1 + r}$$

\(\text{Div}_1\) = dividendo tra un anno, \(P_1\) = prezzo tra un anno, \(r\) = rendimento richiesto.

$$V = \frac{0{,}48 + 12{,}60}{1{,}09} = 12$$

Per Nora l'azione vale **12 €**: esattamente quello che costa.

Vuol dire che, se le sue previsioni sono giuste, comprando a 12 € guadagnerà proprio il 9% che chiede. È la definizione di **prezzo giusto**: non regala niente, non toglie niente.'''),
    LV('Cambia le ipotesi, cambia il valore',
       'È lo stesso conto di Nora, con un dividendo di 0,48 € tra un anno. Muovi il prezzo a cui pensi di rivendere e il rendimento che chiedi.',
       'unanno', dict(D1=0.48, P=12),
       [dict(id='p1', label='Prezzo atteso tra un anno', min=11, max=14.5, step=0.05, start=12.6, unit='€', dec=2), dict(id='rr', label='Rendimento richiesto', min=5, max=14, step=1, start=9, unit='%')],
       [dict(label='Trova due ipotesi che fanno scendere il valore sotto 11 €', cond=[['Vc', '<', 1100]], hint='Alza il rendimento richiesto e abbassa il prezzo atteso.'),
        dict(label='Ora trovane due che lo portano sopra 13 €', cond=[['Vc', '>', 1300]], hint='Abbassa il rendimento richiesto e alza il prezzo atteso.')],
       "Hai cambiato due ipotesi e il valore è passato da meno di 11 € a più di 13 €. Nessuna delle due stime è un errore: dipendono da che cosa ti aspetti e da quanto chiedi. Per questo una stima seria è un intervallo, non una cifra sola."),
    P('Tre anni, tre dividendi', r'''
Se Nora tiene l'azione più a lungo, il conto ha un pezzo per ogni anno: ogni cifra si sconta per gli anni che mancano.

$$V = \frac{\text{Div}_1}{1 + r} + \frac{\text{Div}_2}{(1 + r)^2} + \frac{\text{Div}_3 + P_3}{(1 + r)^3}$$

Velonda ha annunciato i dividendi dei prossimi tre anni: 0,48 €, 0,51 € e 0,54 €. Nora pensa di rivendere tra tre anni a 14 €.

[fig]

$$V = 0{,}44 + 0{,}43 + 11{,}23 = 12{,}10$$

Con queste previsioni l'azione vale **12,10 €**. Guarda da dove arriva quel valore: i dividendi dei primi due anni contano per 87 centesimi. Tutto il resto dipende dall'ultimo pezzo, dove c'è il prezzo di rivendita.''',
      fig=F([('Anno 1: dividendo di 0,48 €', 'oggi 0,44 €', [(0.44, 'Valore di oggi', 'menta')]),
             ('Anno 2: dividendo di 0,51 €', 'oggi 0,43 €', [(0.43, 'Valore di oggi', 'menta')]),
             ('Anno 3: 0,54 € più 14 € di rivendita', 'oggi 11,23 €', [(11.23, 'Valore di oggi', 'menta')])],
            cap='La lunghezza di ogni barra è quello che quella cifra vale oggi.')),
    N(r'''
Un'azione pagherà un dividendo di 1,10 € tra un anno e di 1,21 € tra due anni. Tra due anni pensi di rivenderla a 24,20 €. Chiedi un rendimento del 10%.

Quanto vale oggi l'azione per te, in euro?''', 22, '€',
      r'''
$$V = \frac{\text{Div}_1}{1 + r} + \frac{\text{Div}_2 + P_2}{(1 + r)^2}$$

$$V = \frac{1{,}10}{1{,}10} + \frac{1{,}21 + 24{,}20}{1{,}21} = 1 + 21 = 22$$

L'azione vale **22 €**. Il primo dividendo si sconta per un anno, il secondo e il prezzo di rivendita per due: \(1{,}10^2 = 1{,}21\).'''),
    P('Da dove viene il prezzo di rivendita', r'''
Più del 90% del valore di Velonda, in quel conto, sta nei 14 € della rivendita. Ma chi lo dice che tra tre anni varrà 14 €?

Pensa a chi comprerà l'azione da Nora. Pagherà 14 € per quello che l'azione gli darà dopo: i dividendi dal quarto anno in poi, e il prezzo a cui la rivenderà lui. E chi comprerà da lui farà lo stesso conto.

Seguendo la catena, i prezzi di rivendita spariscono uno dopo l'altro. Resta una cosa sola: **un'azione vale quanto tutti i dividendi che pagherà, per sempre, riportati a oggi.**

$$V = \frac{\text{Div}_1}{1 + r} + \frac{\text{Div}_2}{(1 + r)^2} + \frac{\text{Div}_3}{(1 + r)^3} + \dots$$

Si chiama **modello dei dividendi scontati**. Vale anche per chi vende dopo un anno: il prezzo che incassa è il valore dei dividendi successivi.

Resta un problema: nessuno può prevedere i dividendi uno per uno, per sempre. La prossima lezione mostra la scorciatoia.'''),
    BK('Fa salire o scendere il valore di oggi?', ['Sale', 'Scende'], [
      ("L'azienda annuncia dividendi più alti del previsto", 0, 'Arrivano più soldi: a parità di tutto il resto, il valore sale.'),
      ('Chiedi un rendimento più alto', 1, 'Dividi le stesse cifre per un numero più grande: il valore scende.'),
      ("L'azienda si riempie di debiti e diventa più rischiosa", 1, 'Più rischio vuol dire un rendimento richiesto più alto, e quindi un valore più basso.'),
      ('I titoli di Stato sicuri cominciano a rendere di più', 1, 'Sale la base del rendimento richiesto per tutte le azioni: i valori scendono.'),
      ('Ti aspetti di rivendere a un prezzo più alto', 0, "L'ultimo pezzo del conto è più grande: il valore sale.")],
      after='Il valore sale con i soldi che arriveranno e scende con il rendimento che chiedi per aspettarli.'),
    Q("Tra un anno un'azione pagherà un dividendo di 1 € e pensi di rivenderla a 21 €. Chiedi un rendimento del 10%. Quanto vale oggi per te?", ['22 €', '19,80 €', '20 €'], 2,
      r"\(V = \dfrac{\text{Div}_1 + P_1}{1 + r} = \dfrac{1 + 21}{1{,}10} =\) **20 €**. I 22 € sono quello che incasserai tra un anno: per portarli a oggi si divide per 1,10. Togliere il 10% da 22 dà 19,80 €, ma non è la stessa cosa."),
    Q("Pensi di vendere un'azione tra tre anni. I dividendi che l'azienda pagherà dal quarto anno in poi contano per te?", ['No: li incasserà chi compra', 'Sì: sono dentro il prezzo a cui vendi', 'Solo se superano il prezzo di oggi'], 1,
      "Chi comprerà da te pagherà l'azione per i dividendi che riceverà dopo. Se quei dividendi sono attesi alti, il prezzo a cui vendi sarà alto. Per questo il valore di un'azione dipende da tutti i dividendi futuri, qualunque sia il momento in cui pensi di vendere."),
    Q("Due investitori fanno le stesse identiche previsioni su un'azione. Il primo chiede un rendimento dell'8%, il secondo del 12%. Chi arriva a un valore più alto?", ['Il primo', 'Il secondo', 'Lo stesso valore: le previsioni sono uguali'], 0,
      "Le cifre future sono le stesse, ma il secondo le divide per un numero più grande. Chi chiede di più è disposto a pagare di meno. Per questo la stessa azione può sembrare cara a uno e a buon mercato a un altro, senza che nessuno dei due sbagli i conti."),
  ], "Un'azione vale quanto tutti i dividendi che pagherà, riportati a oggi con il rendimento che chiedi per il rischio che corri. Più i soldi sono lontani e più chiedi, meno valgono. Il prezzo di rivendita è il valore dei dividendi che vengono dopo."),

  # ---------------------------------------------------------------------------------------------------
  LF('az-5-14', 'r−g', 'Un dividendo che cresce per sempre', 10, [
    G('Un\'azione paga 1 € di dividendo ogni anno, per sempre, sempre uguale. Chiedi un rendimento del 10%. Quanto sei disposto a pagarla?',
      r"\(\dfrac{1}{10\%} =\) **10 €**. Con 10 € investiti al 10% ottieni proprio 1 € l'anno, per sempre. Una serie infinita di pagamenti uguali si chiama **rendita perpetua**, e vale il pagamento diviso il rendimento richiesto.",
      lo=2, hi=20, step=1, truth=10, near=1, unit='€'),
    P('Se il dividendo cresce', r'''
I dividendi di un'azienda sana non restano fermi: crescono insieme agli utili. Se crescono ogni anno della stessa percentuale, per sempre, la somma infinita della lezione scorsa si riduce a una formula brevissima:

$$V = \frac{\text{Div}_1}{r - g}$$

\(\text{Div}_1\) = dividendo del prossimo anno, \(r\) = rendimento richiesto, \(g\) = crescita annua dei dividendi.

Si chiama **modello di Gordon**, dal nome dell'economista che l'ha reso famoso.

Per Velonda: dividendo del prossimo anno 0,48 €, rendimento richiesto 9%. Ipotesi: da lì in poi il dividendo cresce del 5% l'anno.

$$V = \frac{0{,}48}{9\% - 5\%} = \frac{0{,}48}{0{,}04} = 12$$

Esce **12 €**: il prezzo di Borsa. In pratica il mercato sta dicendo: chi chiede il 9% deve credere a una crescita del 5% l'anno, per sempre.''',
      deep=('Perché la formula funziona', r'''
Scrivi i primi dividendi di Velonda riportati a oggi: 0,4404 €, poi 0,4242 €, poi 0,4086 €.

Ogni pezzo è uguale a quello prima moltiplicato per \(\dfrac{1{,}05}{1{,}09}\), cioè per 0,9633. Il dividendo cresce del 5%, ma lo sconto del 9% è più forte: ogni anno il pezzo che si aggiunge è un po' più piccolo.

Una somma infinita di pezzi che rimpiccioliscono sempre della stessa quota non cresce all'infinito: si ferma a un numero preciso. Si chiama serie geometrica, e la sua somma è il primo pezzo diviso per quello che manca a 1:

$$\frac{0{,}4404}{1 - 0{,}9633} = 12$$

Con le lettere al posto dei numeri, e un po' di algebra, esce proprio \(\dfrac{\text{Div}_1}{r - g}\). Ecco anche perché \(g\) deve essere più bassa di \(r\): altrimenti i pezzi non rimpiccioliscono, e la somma non si ferma mai.''')),
    P('Che cosa dice la formula', r'''
La formula sta in una riga, ma dentro c'è tutto quello che decide il valore di un'azione.

• **Più dividendo**, più valore: è il numero sopra.
• **Più crescita**, più valore: \(g\) rimpicciolisce il numero sotto.
• **Più rendimento richiesto**, meno valore: \(r\) lo ingrandisce.

Conta soprattutto la **distanza** tra \(r\) e \(g\). Per Velonda è di 4 punti. Se si dimezzasse, il valore raddoppierebbe.

Se la crescita è zero, la formula diventa \(\dfrac{\text{Div}}{r}\): la rendita perpetua di prima.

Una cosa da non sbagliare: sopra ci va il dividendo **del prossimo anno**. Se conosci solo l'ultimo pagato, devi prima farlo crescere:

$$\text{Div}_1 = \text{Div}_0 \times (1 + g)$$

\(\text{Div}_0\) = ultimo dividendo pagato.'''),
    LV('Un punto di crescita cambia tutto',
       'È il conto di Velonda: dividendo del prossimo anno 0,48 €. Muovi la crescita e il rendimento richiesto, e guarda il valore.',
       'gordon', dict(D1=0.48, P=12),
       [dict(id='g', label='Crescita dei dividendi, per sempre', min=0, max=8, step=0.5, start=5, unit='%', dec=1), dict(id='rr', label='Rendimento richiesto', min=6, max=12, step=0.5, start=9, unit='%', dec=1)],
       [dict(label='Lascia il rendimento richiesto al 9% e abbassa la crescita al 4%', cond=[['g10', '<=', 40], ['g10', '>=', 40], ['r10', '<=', 90], ['r10', '>=', 90]], hint='Sposta solo il primo cursore, fino al 4%.'),
        dict(label='Ora porta la crescita al 7%', cond=[['g10', '<=', 70], ['g10', '>=', 70], ['r10', '<=', 90], ['r10', '>=', 90]], hint='Sposta il primo cursore fino al 7%, con il secondo fermo al 9%.')],
       "Con il 4% l'azione vale 9,60 €, con il 7% vale 24 €. Tre punti di crescita, e il valore più che raddoppia. Con il rendimento richiesto succede lo stesso, al contrario: all'8% il valore è 16 €, al 10% scende a 9,60 €. Un valore calcolato così non è mai un numero solo: è un intervallo."),
    P('Quando si può usare', r'''
La formula è comoda, ma funziona solo a quattro condizioni.

**L'azienda paga dividendi**, in proporzione a quello che guadagna.

**La crescita è stabile.** Va bene per aziende mature, che crescono piano e con regolarità: chi gestisce autostrade o acquedotti, chi vende cibo o detersivi. Non va bene per un'azienda giovane che oggi corre e domani rallenterà.

**La crescita è più bassa del rendimento richiesto.** Se \(g\) arriva a \(r\) il numero sotto diventa zero. Se lo supera, il valore esce negativo. In tutti e due i casi la formula non si può usare.

**La crescita è credibile per sempre.** Nessuna azienda può crescere all'infinito più dell'economia in cui vende: prima o poi diventerebbe più grande dell'economia stessa. Per questo chi fa i conti sul serio usa crescite di pochi punti l'anno. Il 5% di Velonda è già un'ipotesi generosa.'''),
    N(r'''
Un'azione pagherà l'anno prossimo un dividendo di 2 €. Ti aspetti che il dividendo cresca del 3% l'anno per sempre, e chiedi un rendimento dell'8%.

Quanto vale l'azione, in euro?''', 40, '€',
      r'''
$$V = \frac{\text{Div}_1}{r - g}$$

\(\text{Div}_1\) = dividendo del prossimo anno (2 €), \(r\) = rendimento richiesto (8%), \(g\) = crescita (3%).

$$V = \frac{2}{8\% - 3\%} = \frac{2}{0{,}05} = 40$$

L'azione vale **40 €**. Attenzione a non dividere per l'8%: uscirebbe 25 €, il valore di un dividendo che non cresce mai.'''),
    P("Nordciclo, l'azienda matura", r'''
Tra le tre aziende della storia, quella fatta apposta per questa formula è Nordciclo: grande, lenta, con dividendi regolari.

Il suo ultimo dividendo è stato 0,30 € per azione, e cresce del 2% l'anno. Nordciclo ha molti più debiti di Velonda, quindi è più rischiosa: Nora le chiede il 10%.

Prima il dividendo del prossimo anno:

$$\text{Div}_1 = 0{,}30 \times 1{,}02 = 0{,}306$$

Poi la formula:

$$V = \frac{0{,}306}{10\% - 2\%} = 3{,}83$$

In Borsa Nordciclo costa 4,20 €: per Nora è un po' cara, anche se il suo P/E è solo 10.

Ecco perché un P/E basso non basta per dire che un'azione costa poco: un'azienda che cresce piano e rischia molto **merita** un P/E basso.'''),
    N(r'''
Un'azienda ha appena pagato un dividendo di 1,50 € per azione. Ti aspetti che cresca del 4% l'anno per sempre, e chiedi un rendimento del 10%.

Quanto vale l'azione, in euro?''', 26, '€',
      r'''
Prima il dividendo del prossimo anno, poi la formula.

$$\text{Div}_1 = 1{,}50 \times 1{,}04 = 1{,}56$$

$$V = \frac{1{,}56}{10\% - 4\%} = \frac{1{,}56}{0{,}06} = 26$$

L'azione vale **26 €**. Chi mette sopra l'ultimo dividendo pagato, senza farlo crescere, arriva a 25 €: è l'errore più comune con questa formula.'''),
    P('Il rendimento nascosto nel prezzo', r'''
La formula si può girare. Invece di chiedere quanto vale un'azione, chiedi: **che rendimento mi offre questo prezzo?**

$$r = \frac{\text{Div}_1}{P} + g$$

\(P\) = prezzo di oggi. Il primo pezzo è il rendimento del dividendo, il secondo la crescita.

Per Velonda, a 12 €:

$$r = \frac{0{,}48}{12} + 5\% = 4\% + 5\% = 9\%$$

Chi compra oggi può aspettarsi il 4% dai dividendi e il 5% dalla crescita: in tutto il 9% l'anno, se le ipotesi reggono.

Per Nordciclo, a 4,20 €: \(\dfrac{0{,}306}{4{,}20} + 2\% = 9{,}3\%\). Meno del 10% che Nora le chiede: è un altro modo di dire che per lei costa troppo.

Questo conto ha un pregio: non ti chiede di credere a un valore, ma di decidere se il rendimento offerto ti basta.'''),
    Q('Ti aspetti che i dividendi di un\'azienda crescano del 9% l\'anno per sempre. Chiedi un rendimento dell\'8%. Che valore dà il modello di Gordon?', ['Un valore altissimo', 'Nessuno: la formula non si può usare', 'Zero'], 1,
      r"Sotto la formula c'è \(8\% - 9\% = -1\%\): il risultato sarebbe negativo, e non ha senso. Il modello funziona solo se la crescita è più bassa del rendimento richiesto. Del resto nessuna azienda può crescere del 9% per sempre."),
    Q('Per quale azienda il modello di Gordon è più adatto?', ['Una giovane azienda di software che non paga dividendi', 'Una società che gestisce acquedotti, con dividendi regolari da decenni', 'Un produttore di acciaio con utili che cambiano molto ogni anno'], 1,
      "Il modello chiede dividendi che crescono a un ritmo stabile, per sempre: è il ritratto di un'azienda matura e regolare. Chi non paga dividendi resta fuori, e chi ha utili che ballano non ha una crescita stabile da mettere nella formula."),
    Q("Un'azione costa 50 €. L'anno prossimo pagherà un dividendo di 2 €, che poi crescerà del 4% l'anno. Che rendimento offre a chi la compra oggi?", ['4%', '8%', '6%'], 1,
      r"\(r = \dfrac{\text{Div}_1}{P} + g = \dfrac{2}{50} + 4\% = 4\% + 4\% =\) **8%**. Metà arriva dal dividendo, metà dalla crescita. Chi guarda solo il rendimento del dividendo vede il 4% e dimentica l'altra metà."),
  ], "Se il dividendo cresce per sempre allo stesso ritmo, l'azione vale il dividendo del prossimo anno diviso la distanza tra rendimento richiesto e crescita. Vale per aziende mature, con una crescita più bassa del rendimento richiesto. Girata, la formula dice che rendimento offre un prezzo."),

  # ---------------------------------------------------------------------------------------------------
  LF('az-5-15', 'g', 'Da dove viene la crescita, e il P/E giusto', 10, [
    G("L'anno scorso Velonda ha guadagnato 15 milioni di utile netto e ne ha distribuiti 9 ai soci come dividendo. Che fine hanno fatto gli altri 6?",
      "L'utile netto è già quello che resta dopo interessi e imposte. La parte non distribuita resta in azienda e diventa macchinari, negozi, bici in magazzino. La crescita non nasce dal niente: nasce dagli **utili trattenuti**.",
      options=['Sono andati in imposte', "Sono rimasti in azienda, per farla crescere", 'Sono stati restituiti alle banche'], ans=1),
    P('Quanto distribuisce, quanto trattiene', r'''
La quota di utile che un'azienda distribuisce ai soci si chiama **payout**.

$$\text{payout} = \frac{\text{dividendi}}{\text{utile netto}}$$

Per Velonda: \(\dfrac{9}{15} =\) **60%**. Per azione è lo stesso: 0,45 € di dividendo su 0,75 € di utile.

Il resto, il 40%, è la **quota trattenuta**: \(1 - \text{payout}\).

| | Pedalta | Velonda | Nordciclo |
|---|---|---|---|
| Payout | 25% | 60% | 71% |
| Trattenuta | 75% | 40% | 29% |

Sono tre scelte diverse, e non a caso. Pedalta trattiene tre quarti dell'utile perché ha molte occasioni per crescere. Nordciclo distribuisce quasi tutto perché ne ha poche.'''),
    P('La crescita sostenibile', r'''
Quanto può crescere un'azienda usando solo i suoi utili? È la sua **crescita sostenibile**, e dipende da due cose: quanta parte degli utili trattiene, e quanto la fa rendere.

$$g = (1 - \text{payout}) \times \text{ROE}$$

\(g\) = crescita sostenibile, \(\text{ROE}\) = utile netto diviso patrimonio netto.

Per Velonda: \(40\% \times 12{,}5\% =\) **5%**.

Il perché si vede con i milioni. Velonda trattiene 6 milioni: il patrimonio sale da 120 a 126, cioè del 5%. Se anche i nuovi 6 milioni rendono il 12,5%, l'utile dell'anno dopo sale del 5%, e con lui i dividendi.

| | Pedalta | Velonda | Nordciclo |
|---|---|---|---|
| Trattenuta | 75% | 40% | 29% |
| ROE | 20% | 12,5% | 7% |
| Crescita | 15% | 5% | 2% |

Ecco da dove veniva il 5% della lezione scorsa.'''),
    N(r'''
Un'azienda ha un ROE del 15% e distribuisce ai soci il 40% degli utili.

Quanto vale la sua crescita sostenibile, in percentuale?''', 9, '%',
      r'''
$$g = (1 - \text{payout}) \times \text{ROE}$$

La quota trattenuta è \(1 - 40\% = 60\%\).

$$g = 60\% \times 15\% = 9\%$$

La crescita sostenibile è il **9%**. Attenzione a usare la quota trattenuta e non il payout: con il 40% uscirebbe 6%.'''),
    P('Più dividendi oggi o più crescita domani', r'''
Per Velonda gli analisti si aspettano utili in crescita dell'8% l'anno nei prossimi anni: più del 5% sostenibile. Può succedere per un po', con margini che migliorano. Ma a lungo, senza soldi nuovi, un'azienda non cresce più di quanto trattiene e fa rendere.

Ogni euro di utile può fare una cosa sola: finire in tasca ai soci oggi, oppure restare in azienda per farla crescere. Che cosa conviene?

Dipende dal confronto tra due numeri: il **ROE**, cioè quanto rende un euro lasciato in azienda, e il **rendimento richiesto** dai soci.

• Velonda fa rendere il 12,5% e i soci chiedono il 9%: ogni euro trattenuto crea valore.
• Nordciclo fa rendere il 7% e i soci chiedono il 10%: ogni euro trattenuto ne distrugge. Fa bene a distribuire quasi tutto.'''),
    P('Il P/E giusto', r'''
Ora puoi rispondere a una domanda rimasta aperta nella parte 2: quale P/E **merita** un'azienda?

Prendi il modello di Gordon e dividi i due lati per l'utile per azione atteso. A sinistra resta un P/E, a destra compare il payout:

$$\text{P/E giusto} = \frac{\text{payout}}{r - g}$$

Lo chiamiamo **P/E giusto**: è il P/E atteso che un'azienda merita per quanto distribuisce, quanto cresce e quanto rischia.

Per Velonda:

$$\text{P/E giusto} = \frac{60\%}{9\% - 5\%} = 15$$

Il suo P/E atteso vero è 14,8: praticamente lo stesso. Il mercato sta pagando Velonda per quello che è.

Per Nordciclo: \(\dfrac{71\%}{10\% - 2\%} = 8{,}9\), contro un P/E atteso di 9,8. Il suo P/E basso non è uno sconto: è quello che merita, e anche qualcosa in più.'''),
    LV('Trattenere conviene solo se rende',
       "Un'azienda i cui soci chiedono il 9%. Muovi quanta parte dell'utile distribuisce e quanto fa rendere il patrimonio: guarda la crescita e il P/E giusto.",
       'sostenibile', dict(rr=9),
       [dict(id='pay', label='Payout: quota di utile distribuita', min=20, max=100, step=10, start=60, unit='%'), dict(id='roe', label='ROE', min=5, max=20, step=2.5, start=12.5, unit='%', dec=1)],
       [dict(label="Distribuisci tutto l'utile: payout al 100%", cond=[['pay', '>=', 100]], hint='Sposta il primo cursore tutto a destra.'),
        dict(label='Ora trattieni metà: payout al 50%, con il ROE al 12,5%', cond=[['pay', '<=', 50], ['pay', '>=', 50], ['roe10', '<=', 125], ['roe10', '>=', 125]], hint='Primo cursore al 50%, secondo al 12,5%.'),
        dict(label='Stesso payout, ma con il ROE al 5%', cond=[['pay', '<=', 50], ['pay', '>=', 50], ['roe10', '<=', 50]], hint='Sposta il secondo cursore tutto a sinistra.')],
       "Senza utili trattenuti non c'è crescita, e il P/E giusto è 11,1. Trattenendo metà dell'utile con un ROE del 12,5%, più alto del 9% che chiedono i soci, sale a 18,2. Con un ROE del 5%, più basso del 9%, scende a 7,7. Trattenere utili crea valore solo se l'azienda li fa rendere più di quanto i soci otterrebbero altrove."),
    P('Che cosa muove un P/E', r'''
La formula spiega in una riga perché due aziende hanno P/E diversi.

• **Più crescita** (\(g\) più alta): P/E più alto. È il motivo per cui Pedalta costa 20 volte gli utili.
• **Più rischio** (\(r\) più alto): P/E più basso. È il motivo per cui Nordciclo, piena di debiti, ne costa 10.
• **Tassi più alti nel mondo**: sale la base di \(r\) per tutte le azioni, e i P/E scendono tutti insieme.

Ecco che cosa c'era nascosto dentro un multiplo: quando applichi a un'azienda il P/E di un'altra, stai dicendo che hanno la stessa crescita e lo stesso rischio.

Per Pedalta la formula non si può usare: cresce del 15%, più di qualunque rendimento richiesto ragionevole. Nessuno pensa che ci riesca per sempre. Come si valuta un'azienda che oggi corre e domani rallenta lo vedi nella prossima lezione.'''),
    N(r'''
Un'azienda distribuisce il 50% degli utili. I soci chiedono un rendimento del 10% e si aspettano una crescita del 6% l'anno per sempre.

Quanto vale il suo P/E giusto?''', 12.5, '',
      r'''
$$\text{P/E giusto} = \frac{\text{payout}}{r - g}$$

$$\text{P/E giusto} = \frac{50\%}{10\% - 6\%} = \frac{0{,}50}{0{,}04} = 12{,}5$$

L'azienda merita un P/E atteso di **12,5**. Se in Borsa ne avesse uno di 20, il mercato starebbe scommettendo su più crescita, o chiedendo meno rendimento, di quanto dicono queste ipotesi.''', tol=0.05, dec=1),
    Q("Un'azienda ha un ROE del 20% e distribuisce ai soci tutto l'utile. Quanto vale la sua crescita sostenibile?", ['20%', '0%', '10%'], 1,
      r"Con un payout del 100% la quota trattenuta è zero: \(g = 0\% \times 20\% =\) **0%**. Un ROE alto non basta: senza utili che restano in azienda, o soldi nuovi, non c'è niente da far rendere in più."),
    Q('Due aziende identiche in tutto, tranne che la seconda è più rischiosa. Com\'è il P/E giusto della seconda rispetto a quello della prima?', ['Più basso', 'Più alto', 'Uguale'], 0,
      r"Più rischio vuol dire un rendimento richiesto più alto. Nella formula \(r\) sta sotto: se sale, il P/E giusto scende. A parità di utili e di crescita, il mercato paga meno gli utili di cui è meno sicuro."),
    Q('Un\'azienda fa rendere il suo patrimonio il 6%. I suoi soci chiedono il 10%. Che cosa conviene ai soci?', ['Che trattenga più utili possibile, per crescere', 'Che distribuisca più utili possibile', 'È indifferente'], 1,
      "Ogni euro lasciato in azienda rende il 6%, mentre i soci, con lo stesso rischio, potrebbero ottenere il 10% altrove. Crescere così distrugge valore: meglio ricevere il dividendo e investirlo meglio. Crescere fa bene solo quando il ROE supera il rendimento richiesto."),
  ], "La crescita che un'azienda può sostenere da sola è la quota di utili trattenuta per il ROE. Il P/E che merita è il payout diviso la distanza tra rendimento richiesto e crescita: sale con la crescita, scende con il rischio. Trattenere utili conviene solo se il ROE supera il rendimento richiesto."),

  # ---------------------------------------------------------------------------------------------------
  LF('az-5-16', '2F', 'Due fasi, azioni privilegiate, aziende senza dividendi', 10, [
    G("Pedalta cresce del 15% l'anno. Per un'azienda così, piccola e giovane, Nora chiede un rendimento dell'11%. Che cosa dà il modello di Gordon?",
      r"Sotto la formula c'è \(11\% - 15\% = -4\%\): il valore esce negativo. Il modello vale solo per una crescita stabile e più bassa del rendimento richiesto. Per un'azienda che oggi corre e domani rallenterà, il conto si divide in **due fasi**.",
      options=['Un valore altissimo', 'Un numero negativo, che non ha senso', 'Zero'], ans=1),
    P('Due fasi', r'''
L'idea è semplice: si divide il futuro in due.

• **Prima fase**: gli anni in cui l'azienda cresce in fretta, o in modo irregolare. I dividendi si prevedono uno per uno.
• **Seconda fase**: da lì in poi l'azienda è matura e cresce a un ritmo stabile, per sempre. Qui si può usare Gordon.

Gordon, applicato alla fine della prima fase, dà il prezzo dell'azione in quel momento. Si chiama **valore finale**:

$$P_n = \frac{\text{Div}_{n+1}}{r - g}$$

\(n\) = anni della prima fase, \(\text{Div}_{n+1}\) = primo dividendo della seconda fase, \(g\) = crescita stabile.

Poi tutto si riporta a oggi, come nella lezione sui dividendi scontati:

$$V = \frac{\text{Div}_1}{1 + r} + \dots + \frac{\text{Div}_n + P_n}{(1 + r)^n}$$

È il conto dei tre anni di Nora, con una differenza: il prezzo di rivendita non è più tirato a indovinare.'''),
    P('Velonda in due fasi', r'''
**Prima fase.** Tre anni di dividendi già annunciati: 0,48 €, 0,51 € e 0,54 €. Crescono un po' più del 5%, perché nei prossimi anni gli utili corrono.

**Seconda fase.** Dal quarto anno il dividendo cresce del 5% l'anno, per sempre. Il primo è \(0{,}54 \times 1{,}05 = 0{,}567\) €.

$$P_3 = \frac{0{,}567}{9\% - 5\%} = 14{,}18$$

Tra tre anni l'azione dovrebbe valere 14,18 €. Nora, a occhio, aveva detto 14.

**A oggi.** I tre dividendi, scontati, valgono in tutto 1,287 €. Il valore finale, scontato per tre anni, vale 10,946 €.

[fig]

$$V = 1{,}287 + 10{,}946 = 12{,}23$$

Con le due fasi Velonda vale **12,23 €**: poco più dei 12 € di Gordon, perché nei primi tre anni i dividendi crescono un po' più in fretta.''',
      fig=F([('Da dove viene il valore di oggi', '12,23 €', [(1.287, 'Dividendi dei primi tre anni', 'menta'), (10.946, 'Valore finale', 'giallo')])])),
    P('Dove sta il valore', r'''
Guarda la barra: quasi il 90% del valore di Velonda sta nel valore finale, cioè in quello che succederà **dopo** il terzo anno.

Succede quasi sempre, e ha due conseguenze.

**Le ipotesi lontane contano più di quelle vicine.** Sbagliare il dividendo del prossimo anno sposta il valore di qualche centesimo. Sbagliare di un punto la crescita stabile lo sposta di euro: con il 4% al posto del 5%, Velonda scende da 12,23 a 9,96 €.

**La precisione è finta.** 12,23 € sembra una misura esatta. È il risultato di ipotesi che nessuno conosce con certezza. Chi fa questi conti sul serio li ripete con ipotesi diverse e guarda quanto cambia il risultato.

Per le aziende giovani si usano anche tre fasi: crescita veloce, rallentamento, crescita stabile. L'idea è la stessa.'''),
    N(r'''
Un'azione pagherà un dividendo di 1,10 € tra un anno e di 1,21 € tra due anni. Da lì in poi il dividendo crescerà del 5% l'anno per sempre. Chiedi un rendimento del 10%.

Quanto vale oggi l'azione, in euro?''', 23, '€',
      r'''
Tre passi.

• Primo dividendo della seconda fase: \(1{,}21 \times 1{,}05 = 1{,}2705\) €.
• Valore finale tra due anni: \(P_2 = \dfrac{1{,}2705}{10\% - 5\%} = 25{,}41\) €.
• A oggi:

$$V = \frac{1{,}10}{1{,}10} + \frac{1{,}21 + 25{,}41}{1{,}21} = 1 + 22 = 23$$

L'azione vale **23 €**. Di questi, 21 arrivano dal valore finale.'''),
    P('Le azioni privilegiate', r'''
C'è un caso in cui il conto è semplicissimo: le **azioni privilegiate**.

Sono azioni che ricevono il dividendo prima di tutte le altre. Di solito il dividendo è fisso, e in cambio chi le possiede non vota in assemblea. Assomigliano più a un'obbligazione senza scadenza che a un'azione.

Un dividendo fisso, per sempre: è la rendita perpetua.

$$V = \frac{\text{Div}}{r}$$

Un'azione privilegiata paga 0,63 € l'anno. È meno rischiosa di un'azione ordinaria, perché viene pagata per prima: chi la compra chiede il 7%.

$$V = \frac{0{,}63}{7\%} = 9$$

Vale **9 €**. E come per le obbligazioni, se i tassi salgono e chi compra comincia a chiedere di più, il valore scende: all'8% varrebbe 7,88 €.'''),
    N(r'''
Un'azione privilegiata paga un dividendo fisso di 1,20 € l'anno, per sempre. Chi la compra chiede un rendimento del 6%.

Quanto vale, in euro?''', 20, '€',
      r'''
$$V = \frac{\text{Div}}{r}$$

\(\text{Div}\) = dividendo fisso (1,20 €), \(r\) = rendimento richiesto (6%).

$$V = \frac{1{,}20}{0{,}06} = 20$$

Vale **20 €**. È il modello di Gordon con la crescita a zero.'''),
    P('Se i dividendi non raccontano tutto', r'''
Il modello dei dividendi ha un punto debole: guarda solo quello che l'azienda **decide** di distribuire.

• Molte aziende giovani non pagano dividendi. Per il modello varrebbero zero, e non è così.
• Alcune distribuiscono meno di quanto potrebbero, e accumulano cassa.
• Altre distribuiscono più di quanto producono, facendo debiti: non può durare.

In questi casi, al posto dei dividendi si sconta la cassa che l'azienda **potrebbe** distribuire: il flusso di cassa per i soci, che hai visto nella lezione sul P/CF. Le formule sono le stesse, con quel numero al posto del dividendo.

Per Velonda cambia poco: la cassa per i soci è 9 milioni, proprio quanto distribuisce. Per Pedalta, che distribuisce solo un quarto degli utili, cambia molto.

I modelli basati sui flussi di cassa sono il cuore del secondo livello.'''),
    P('Pregi e difetti della prima strada', r'''
Scontare i soldi futuri è il metodo più completo, per tre ragioni.

• Guarda quello che dà valore a un'azione: i soldi che arriveranno ai soci.
• Non dipende dall'umore del mercato: funziona anche quando tutte le aziende simili sono care, o tutte a buon mercato.
• Ti obbliga a scrivere le tue ipotesi, una per una. Se sbagli, sai dove.

Ed è il più fragile, per tre ragioni.

• Chiede previsioni lontane, che nessuno sa fare bene.
• Basta spostare di poco crescita o rendimento richiesto per cambiare molto il risultato.
• Quasi tutto il valore sta nel valore finale, cioè nella parte più incerta.

Per questo non si usa mai da solo. Accanto ci va sempre il confronto con i simili: un metodo guarda dentro l'azienda, l'altro guarda fuori.'''),
    Q('In un modello a due fasi, che cos\'è il valore finale?', ["Il dividendo dell'ultimo anno della prima fase", 'Il prezzo stimato alla fine della prima fase: il valore, in quel momento, di tutti i dividendi successivi', "Quello che resterà ai soci quando l'azienda chiuderà"], 1,
      "Il valore finale è il prezzo che l'azione dovrebbe avere quando finisce la prima fase. Si calcola con Gordon, e racchiude tutti i dividendi della seconda fase. Poi va scontato fino a oggi, insieme ai dividendi dei primi anni."),
    Q('I tassi salgono, e chi compra azioni privilegiate comincia a chiedere un rendimento più alto. Che cosa succede al valore di una privilegiata con dividendo fisso?', ['Sale', 'Resta uguale: il dividendo è fisso', 'Scende'], 2,
      r"Il valore è \(\dfrac{\text{Div}}{r}\). Il dividendo resta fermo, il rendimento richiesto sale: il valore **scende**. È lo stesso meccanismo delle obbligazioni a tasso fisso."),
    Q("Un'azienda non paga dividendi, ma ogni anno produce molta cassa che potrebbe distribuire ai soci. Come si valuta con la prima strada?", ['Non si può: senza dividendi vale zero', 'Si sconta il flusso di cassa per i soci al posto dei dividendi', 'Si guarda solo il valore di liquidazione'], 1,
      "Un'azienda che non distribuisce niente non vale zero: la cassa che produce resta dei soci, anche se per ora rimane in azienda. Si usano le stesse formule, mettendo il flusso di cassa per i soci dove prima c'era il dividendo."),
    Q('In un modello a due fasi il valore finale pesa per il 90% del valore di oggi. Che cosa ne segue?', ['Le previsioni dei primi anni sono le più importanti', 'Crescita stabile e rendimento richiesto decidono quasi tutto', 'Il modello è sbagliato'], 1,
      "Il valore finale dipende da due sole ipotesi: la crescita stabile e il rendimento richiesto. Se pesa per il 90%, sono loro a decidere il risultato. Per questo conviene rifare il conto con ipotesi diverse, invece di fidarsi di una cifra sola."),
  ], "Per un'azienda che oggi corre e domani rallenta si sommano i dividendi dei primi anni e un valore finale calcolato con Gordon, tutto riportato a oggi. Quasi tutto il valore sta nel valore finale. Una privilegiata vale il dividendo fisso diviso il rendimento richiesto."),
]
