# Lezioni riscritte per chi sceglie gli Stati Uniti. Servono dove il testo "per tutti" dice una cosa che per un americano non quadra:
#  - basi-6-1: la banca centrale di un americano è la Federal Reserve (due compiti, non uno solo);
#  - basi-6-2: la lezione parla dell'euro visto da chi ha euro; per un americano l'esempio è il contrario (azioni europee comprate in dollari).
# Qui i soldi si scrivono già giusti ($ per i dollari, € per gli euro): l'app NON converte le lezioni che hanno una variante.
# controlla.py le controlla come le altre (stessa struttura e stesse risposte dell'originale italiano) e le mette nel campo "us" della lezione.
US = [
# ---- basi-6-1: Fed
  L('basi-6-1', 'BC', 'Central banks and rates', 4, [
    ('Who sets the price of money', r'''
A **central bank**, like the Federal Reserve (the Fed) in the US or the ECB in the euro area, sets the **policy rates**: the benchmark rates for what banks pay to borrow money. The rates on mortgages, loans and savings accounts depend on them, in a cascade.

The Fed has two tasks: stable prices and maximum employment. Its goal is inflation of 2% a year over the long run.'''),
    ('Rates up, rates down', r'''
• **Inflation too high**: the central bank **raises** rates. Borrowing money costs more, families and companies spend less, prices slow down.
• **Weak economy**: it **lowers** rates. Credit costs less, spending and investment pick up.

It matters a lot for investors: when rates rise, bonds already in circulation lose value and payments on adjustable-rate mortgages go up. When they fall, the opposite happens.''')],
    "The central bank raises rates to curb inflation and lowers them to support the economy. Adjustable-rate mortgages and bonds are the first to feel it.",
    [Q('Inflation is well above the target. What does the central bank usually do?', ['It lowers rates', 'It raises rates', 'It leaves everything unchanged'], 1,
       'It raises rates: credit costs more, spending slows down and prices stop running.'),
     Q('The central bank lowers rates. What effect does it usually have on new mortgages?', ['They cost less', 'They cost more', 'No effect'], 0,
       'If money costs banks less, the rates banks charge customers usually fall too: new mortgages **cost less**.')]),
# ---- basi-6-2: cambio euro/dollaro visto da chi ha dollari
  L('basi-6-2', 'FX', 'Exchange rates', 5, [
    ('The price of a currency', r'''
The **exchange rate** is the price of one currency expressed in another. If the euro/dollar rate is 1.10, one euro costs $1.10.

• If the rate rises to 1.20 the euro has **strengthened**: one euro now costs $1.20, so your dollars buy fewer euros.
• If it falls to 1.00 the euro has **weakened**: one euro costs only $1.00, so your dollars buy more euros.'''),
    ('Exchange rates inside investments', r'''
Whoever buys securities in another currency has two returns: that of the security and that of the exchange rate.

You buy European stocks for €1,000 when the rate is 1.10: you spend **$1,100**. Assumption: after a year the stocks are still worth €1,000, but the rate has fallen to 1.00.

$$1{,}000 \times 1.00 = 1{,}000$$

In dollars you have **$1,000**: you lost 9.1% without the stock moving. This is **currency risk**. It also works the other way: if the euro strengthens, you gain.''')],
    'With a security in a foreign currency you gain or lose because of the exchange rate too. Weaker euro: your euro stocks are worth less in dollars.',
    [Q('You have €1,000. The euro/dollar rate goes from 1.00 to 1.25. How much are they worth now in dollars?', ['$800', '$1,000', '$1,250'], 2,
       r"\(1{,}000 \times 1.25 =\) **$1,250**. The euro has strengthened, so each euro buys more dollars."),
     Q("The euro/dollar rate goes from 1.10 to 1.00. What happened to the euro?", ['It strengthened', 'It weakened', 'Nothing changed'], 1,
       "Before, one euro cost $1.10, now only $1.00: the euro **has weakened**.")]),
]
