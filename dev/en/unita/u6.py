# Unit 6, "L'economia intorno": lessons basi-6-1, 6-2, 6-3 (all label A). Note: basi-6-2 is written from the point of view of a euro investor (euro/dollar), so for US users it needs its own version.
U6 = dict(id='basi-u6', sid='basi-economia', name='The economy around you', lessons=[
# ---- basi-6-1 (A)
  L('basi-6-1', 'BC', 'Central banks and rates', 4, [
    ('Who sets the price of money', r'''
A **central bank**, like the ECB for the euro or the Federal Reserve for the dollar, sets the **policy rates**: what banks pay to borrow money from the central bank and what they receive if they deposit it there. The rates on mortgages, loans and savings accounts depend on them, in a cascade.

The ECB's main task is to keep prices stable: its goal is inflation of 2% a year over the medium term.'''),
    ('Rates up, rates down', r'''
• **Inflation too high**: the central bank **raises** rates. Borrowing money costs more, families and companies spend less, prices slow down.
• **Weak economy**: it **lowers** rates. Credit costs less, spending and investment pick up.

It matters a lot for investors: when rates rise, bonds already in circulation lose value and payments on adjustable-rate mortgages go up. When they fall, the opposite happens.''')],
    "The central bank raises rates to curb inflation and lowers them to support the economy. Adjustable-rate mortgages and bonds are the first to feel it.",
    [Q('Inflation is well above the target. What does the central bank usually do?', ['It lowers rates', 'It raises rates', 'It leaves everything unchanged'], 1,
       'It raises rates: credit costs more, spending slows down and prices stop running.'),
     Q('The central bank lowers rates. What effect does it usually have on new mortgages?', ['They cost less', 'They cost more', 'No effect'], 0,
       'If money costs banks less, the rates banks charge customers usually fall too: new mortgages **cost less**.')]),
# ---- basi-6-2 (A)
  L('basi-6-2', 'FX', 'Exchange rates', 5, [
    ('The price of a currency', r'''
The **exchange rate** is the price of one currency expressed in another. If the euro/dollar rate is 1.10, with €1 you buy $1.10.

• If the rate rises to 1.20 the euro has **strengthened**: with €1 you buy more dollars.
• If it falls to 1.00 the euro has **weakened**.'''),
    ('Exchange rates inside investments', r'''
Whoever buys securities in another currency has two returns: that of the security and that of the exchange rate.

You buy American stocks for $1,100 when the rate is 1.10: you spend **€1,000**. Assumption: after a year the stocks are still worth $1,100, but the rate has risen to 1.20.

$$\frac{1{,}100}{1.20} = 916.67$$

In euros you have **€916.67**: you lost 8.3% without the stock moving. This is **currency risk**. It also works the other way: if the euro weakens, you gain.''')],
    'With a security in a foreign currency you gain or lose because of the exchange rate too. Stronger euro: your dollars are worth less.',
    [Q('You have $1,000. The euro/dollar rate goes from 1.00 to 1.25. How much are they worth now in euros?', ['€1,250', '€1,000', '€800'], 2,
       r"\(\dfrac{1{,}000}{1.25} =\) **€800**. The euro has strengthened, so your dollars buy fewer euros."),
     Q("The euro/dollar rate goes from 1.10 to 1.00. What happened to the euro?", ['It strengthened', 'It weakened', 'Nothing changed'], 1,
       "Before, with €1 you bought $1.10, now only $1.00: the euro **has weakened**.")]),
# ---- basi-6-3 (A)
  L('basi-6-3', '~', 'The business cycle', 5, [
    ('GDP and its seasons', r'''
**GDP**, gross domestic product, is the value of all the goods and services produced in a country in a year. It is the thermometer of the economy.

GDP doesn't grow in a straight line. It goes through phases that repeat:

• **expansion**: GDP grows, companies hire;
• **peak**: the economy is at its maximum, inflation often rises;
• **recession**: GDP falls, unemployment rises;
• **recovery**: you start again from the lowest point.'''),
    ('How to recognize a recession', r'''
A widely used rule of thumb: there is a **recession** when GDP falls for two consecutive quarters.

The cycle matters for investors:

• in a recession company earnings fall and stocks suffer;
• central banks usually lower rates, and this helps bonds;
• markets look ahead: often stocks recover before the recession is over.

Nobody knows for sure which phase we are in until it has passed. That is why a plan that holds up in every season is best.''')],
    "The economy alternates expansions and recessions. Two quarters of falling GDP are the rule of thumb for calling a recession.",
    [Q('A country\'s GDP falls for two quarters in a row. What is this phase called?', ['Expansion', 'Recession', 'Inflation'], 1,
       'Two consecutive quarters of falling GDP are the rule of thumb for calling a **recession**.'),
     Q('In a recession, what do central banks usually do?', ['They lower rates', 'They raise rates', 'They close the stock exchanges'], 0,
       "They lower rates, to make credit cheaper and get spending and investment going again.")]),
])
