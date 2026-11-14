# Unit 1, "I soldi nel tempo": lessons basi-1-1 to basi-1-5, all label A.
U1 = dict(id='basi-u1', sid='basi-tempo', name='Money over time', lessons=[
  LF('basi-1-1', '€', 'What money is for', 5, [
    G("Put €100 in a drawer. Today a coffee at the café costs €1. Twenty years from now, say, it costs €2. How many coffees can you buy with that €100 in twenty years?",
      "Today €100 buys you 100 coffees. If the price doubles, the same €100 buys **50**. The banknote in the drawer hasn't changed: what you can do with it has. Money does three jobs, and this is the most delicate one.",
      lo=0, hi=100, step=5, truth=50, near=5, unit='caffè'),
    P('Three jobs in one', r'''
**Money in itself is worth nothing: it is worth what it lets you do.**

It does three different jobs.

• **Medium of exchange.** You hand it over in exchange for what you need. Without money you would have to barter: a baker who wants a pair of shoes would have to find a shoemaker who wants bread.
• **Unit of account.** It is the yardstick for measuring prices. A coffee costs €1.30, a book €18: you can compare them because they use the same measure.
• **Store of value.** It lets you move value through time: you earn today, you spend tomorrow.

You see the first two jobs every day, when you pay and when you look at a price. The third only shows over the years.'''),
    BK('Which job is money doing?', ['Medium of exchange', 'Unit of account', 'Store of value'], [
      ('You pay for groceries at the checkout', 0, 'You give money in exchange for things: that is exchange.'),
      ('You compare the price of two phones', 1, 'You use money as a yardstick for measuring.'),
      ('You set aside €200 for a vacation', 2, 'You move value from today to tomorrow.'),
      ('You receive your salary for your work', 0, 'You trade your work for money.'),
      ('You read that a car costs €15,000', 1, 'A price is a measurement expressed in money.'),
      ('You keep €1,000 in your account for emergencies', 2, 'You save it to use later.')]),
    P('The most fragile job', r'''
Of the three jobs, the third is the one money does worst.

As a medium of exchange and as a unit of account, money always works. As a store of value it has an enemy: rising prices.

Go back to the €100 in the drawer.

[fig]

After twenty years the banknote is the same, but it buys half as much. Keeping money idle looks like the safest choice, because the figure never goes down. In reality it is a slow loss that you can't see.

Everything else in this path starts from here. **Interest** and **investments** exist for this reason: so that the money you set aside doesn't lose ground and, if possible, gains some.''',
      fig=F([('Today, with coffee at €1', '100 coffees', [(100, 'What €100 buys', CAP)]),
             ('In twenty years, with coffee at €2', '50 coffees', [(50, 'What the same €100 buys', INT)])])),
    Q('You put €500 in a drawer to buy a bike a year from now. Which job are you asking of the money?', ['Medium of exchange', 'Unit of account', 'Store of value'], 2,
      'You are keeping it to spend later: that is the **store of value** function. It will become a medium of exchange only on the day you pay for the bike.'),
    Q("Why isn't money kept in a drawer for many years a perfect store of value?", ['Because banknotes expire', 'Because if prices rise it buys fewer things', 'Because the bank taxes it'], 1,
      "The figure stays the same, but if prices rise in the meantime, that figure buys **fewer things**. Banknotes don't expire, and the bank has nothing to do with a drawer."),
  ], 'Money is for paying, for measuring prices and for storing value. The third job is the most fragile: if prices rise, idle money buys less.'),
  LF('basi-1-2', '%', 'Simple interest', 6, [
    G("You lend a friend €1,000 for 3 years. You agree on this: each year they pay you 5% of the amount lent, and at the end they give you back the €1,000. How much extra do you collect in all?",
      r"5% of €1,000 is €50 a year. Over three years: \(50 \times 3 =\) **€150**. That payment has a name, interest, and the way you calculated it is called simple interest.",
      lo=0, hi=500, step=10, truth=150, near=15),
    P('The price of time', r'''
**When you lend money, you give up using it for a while. Interest is the payment for giving it up.**

When you lend someone €1,000, for the whole length of the loan that money is not available to you, and you run the risk that it won't come back. In exchange you ask for a payment: **interest**.

Interest is measured with a **rate**: a percentage of the amount lent, usually per year. A rate of 5% a year means €5 of interest for every €100 lent, for every year.

The amount lent is called the **principal**.

It works both ways. When you deposit money in a bank, you are the one lending, and you receive the interest. When you take out a loan, you pay it.'''),
    P('Always on the starting amount', r'''
With **simple interest** the rate is always applied only to the starting principal. That is why the interest is the same every year.

Here is the €1,000 lent at 5% a year for 3 years:

[fig]

At the end you have \(1{,}000 + 150 =\) **€1,150**. The total at the end, principal plus interest, is called the **final amount**.

The calculation can be written in one line:

$$I = C \times i \times t$$

Where \(I\) is the interest, \(C\) the principal, \(i\) the annual rate and \(t\) the number of years. Here: \(1{,}000 \times 5\% \times 3 = \text{€}150\).''',
      fig=F([('After 3 years', '€1,150', [(1000, 'Principal', CAP, '€1,000'), (50, 'Year 1', INT, '€50'), (50, 'Year 2', INT, '€50'), (50, 'Year 3', INT, '€50')])],
            cap='Three equal pieces of interest, because they are always calculated on the starting €1,000.')),
    N("You lend €2,000 at 3% a year, at simple interest. How much interest do you earn in one year?", 60, '€',
      r"\(2{,}000 \times 3\% =\) **€60**. With simple interest it will be €60 in the second year too, in the third and in every other."),
    N("Same loan: €2,000 at 3% a year, simple interest, for 4 years. What is the final amount?", 2240, '€',
      r"Interest: €60 a year for 4 years, \(60 \times 4 = \text{€}240\). Final amount: \(2{,}000 + 240 =\) **€2,240**."),
    M(('Principal', 'The amount lent or deposited'), ('Interest', 'The payment for the lender'), ('Rate', 'Interest as a percentage, for one year'), ('Final amount', 'Principal plus interest')),
    Q("You deposit €5,000 at 2% a year, simple interest, for 3 years. How much interest do you earn in all?", ['€100', '€300', '€306'], 1,
      r"Each year: \(5{,}000 \times 2\% = \text{€}100\). In 3 years: \(100 \times 3 =\) **€300**. The answer €100 is just one year; €306 is what compound interest would give, which we see in the next lesson."),
    Q("What does a rate of 4% a year tell you?", ['That the loan lasts 4 years', "That each year the interest is €4 for every €100 of principal", 'That €4 in all is paid back at the end'], 1,
      "The rate is the interest as a percentage of the principal, for one year: at 4%, **€4 for every €100, every year**. On €1,000 that is €40 a year."),
  ], r'Simple interest: \(\text{principal} \times \text{rate} \times \text{years}\). The interest is the same every year.'),
  LF('basi-1-3', '%%', 'Compound interest', 7, [
    G("You put €1,000 at 5% a year and leave it untouched for 30 years. Each year the interest stays in and earns interest too. How much do you have at the end?",
      r"With simple interest you would have \(1{,}000 + 50 \times 30 = \text{€}2{,}500\). Letting the interest work too gets you to about **€4,322**. The difference, more than €1,800, is interest earned on interest.",
      lo=1000, hi=8000, step=100, truth=4322, near=300),
    P('Interest on interest', r'''
**With compound interest the interest doesn't sit aside: it is added to the principal and starts earning too.**

You start with €1,000 at 5% a year.

• **Year 1**: \(5\% \times 1{,}000 = \text{€}50\). You have €1,050.
• **Year 2**: the 5% is calculated on €1,050, no longer on €1,000. That is €52.50. You have €1,102.50.
• **Year 3**: \(5\% \times 1{,}102.50 = \text{€}55.13\). You have €1,157.63.

[fig]

Each year the interest is a little higher than the year before, because it is calculated on a figure that keeps growing. At first the difference from simple interest is small. As time goes by it becomes enormous.''',
      fig=F([('Interest in year 1', '€50.00', [(50, 'On the starting principal', INT)]),
             ('Interest in year 2', '€52.50', [(50, 'On the starting principal', INT), (2.5, 'On earlier interest', CAP)]),
             ('Interest in year 3', '€55.13', [(50, 'On the starting principal', INT), (5.13, 'On earlier interest', CAP)])])),
    P('Watch it grow', "Move the years slider. The columns show three pieces: your money, the interest on your money and the interest on the interest. Watch which of the three grows the most as the years go up.", widget='compound'),
    P('Time matters more than the amount', r'''
After \(t\) years at rate \(i\), the principal \(C\) becomes:

$$M = C \times (1 + i)^t$$

At 5%, each year the amount is multiplied by 1.05. After two years you have multiplied it twice, after thirty years thirty times.

Here is €1,000 at 5% a year, with simple and with compound interest:

| After | Simple | Compound |
|---|---|---|
| 1 year | €1,050 | €1,050 |
| 10 years | €1,500 | €1,629 |
| 20 years | €2,000 | €2,653 |
| 30 years | €2,500 | €4,322 |

In the first years the two columns almost coincide. Then the one on the right runs away. That is why someone who starts early with a little often ends up ahead of someone who starts late with a lot.'''),
    N("You put €2,000 at 10% a year with compound interest. How much do you have after 2 years?", 2420, '€',
      r"First year: \(2{,}000 \times 1.10 = \text{€}2{,}200\). Second year: \(2{,}200 \times 1.10 =\) **€2,420**. With simple interest you would be at €2,400: the extra €20 is the interest earned on the first year's interest."),
    Q("You put €1,000 at 5% a year. How much do you have after 2 years?", ['€1,100.00', '€1,102.50', '€1,050.00'], 1,
      'In the first year you reach €1,050. In the second year the 5% is calculated on €1,050: that is €52.50, not 50. Total **€1,102.50**. Anyone who answers €1,100 counted the 5% twice on the starting €1,000.'),
    Q("You put €2,000 at 4% a year with compound interest. How much do you have after 3 years?", ['€2,240.00', '€2,163.20', '€2,249.73'], 2, r'''
| Year | Calculation | End of year |
|---|---|---|
| 1 | \(2{,}000.00 \times 1.04\) | 2,080.00 |
| 2 | \(2{,}080.00 \times 1.04\) | 2,163.20 |
| 3 | \(2{,}163.20 \times 1.04\) | 2,249.73 |

The typical mistake is counting the 4% each year on the starting €2,000: that gets you to €2,240.'''),
  ], "Time matters more than the starting amount: interest on interest grows slowly at first and fast later."),
  LF('basi-1-4', '↑', 'Inflation', 7, [
    G("You have €1,000 sitting in a drawer. Prices rise 3% a year. In 10 years, how much do those €1,000 buy, measured at today's prices?",
      "In ten years, what costs €1,000 today will cost about €1,344. So your €1,000 will buy what you can buy today with about **€744**. The figure in the drawer is the same: it is its value that has dropped by a quarter.",
      lo=0, hi=1000, step=10, truth=744, near=30),
    P('Prices that rise', r'''
**Inflation is a general rise in prices over time.**

General means it isn't about a single product. If only the price of peaches goes up because the harvest was bad, that isn't inflation. It is when, on average, the cost of everything a household buys goes up: food, bills, rent, transport.

It is measured as a percentage per year. Inflation of 3% means that what costs €100 today will cost €103 on average a year from now.

To measure it you use a **basket**: a list of goods and services that stands for what households typically spend on. Every month someone checks how much it costs to fill it and compares that with a year earlier.'''),
    P('Purchasing power', r'''
What matters about your money is not the figure, but what you can buy with it. This is called **purchasing power**.

When prices rise and your figure stays the same, purchasing power falls. Here are the €1,000 from the drawer, with inflation at 3% a year:

[fig]

There are still €1,000 in the drawer. Nobody has taken them. Yet after ten years it is as if you had €744, and after twenty €554.

That is why keeping everything idle is not a risk-free choice: it is the choice of losing a little at a time, with certainty.''',
      fig=F([('Today', '€1,000', [(1000, 'Purchasing power', CAP)]),
             ('In 10 years', '€744', [(744, 'Purchasing power', CAP), (256, 'Lost', INT)]),
             ('In 20 years', '€554', [(554, 'Purchasing power', CAP), (446, 'Lost', INT)])], cap="With inflation at 3% a year, measuring everything at today's prices.")),
    LV("How much inflation weighs", "You have €1,000 sitting idle. Move inflation and years and see how much they buy, at today's prices.", 'inflazione', dict(C=1000),
      [dict(id='infl', label='Inflation', min=1, max=8, step=0.5, start=2, unit='%', dec=1), dict(id='anni', label='Years', min=1, max=40, step=1, start=5, unit='anni')],
      [dict(label='Find when €1,000 buys less than €750', cond=[['reale', '<', 750]], hint='You can raise inflation, or let more years pass.'),
       dict(label='Now halve purchasing power with inflation at 2%', cond=[['reale', '<=', 500], ['infl', '<=', 2]], hint='Bring inflation back to 2% and add years: it takes a long time.')],
      "Even low inflation, left to work for decades, halves the value of idle money. At 2% it takes about 35 years, at 6% just 12."),
    N("Your weekly grocery shopping costs €200 today. With inflation of 5%, how much will the same shopping cost in a year?", 210, '€',
      r'\(200 \times 1.05 =\) **€210**: €10 more to buy the same things.'),
    Q("Inflation is 3% a year and your account earns 1%. After a year, what has happened to your purchasing power?", ['It rose by 1%', 'It stayed the same', 'It fell by about 2%'], 2,
      r"The account grew by 1%, but prices by 3%: in real terms you lost about **2%** (to be precise, \(\dfrac{1.01}{1.03} - 1 = -1.94\%\))."),
    Q("What does inflation measure?", ['The average rise in the prices of everything households buy', 'The rise in the price of a single product', 'How much a bank account earns'], 0,
      "Inflation looks at prices as a whole, through a basket of goods and services. If one product goes up and the rest stay put, that is not inflation."),
  ], "With inflation, idle money loses purchasing power, even if the figure in the account doesn't fall."),
  LF('basi-1-5', 'r', 'Real rate', 6, [
    G("Bank A offers you 2% a year at a time when prices rise 1%. Bank B offers you 5% at a time when prices rise 6%. In which case can you buy more at the end of the year than before?",
      "With A your money grows 2% and prices 1%: in the end you can buy about 1% more. With B it grows 5%, but prices grow 6%: you can buy about 1% less, even though you see a higher figure in your account. What counts is the rate once inflation is taken out: it is called the real rate.",
      options=['With bank A', 'With bank B', 'In both cases'], ans=0),
    P('Nominal and real', r'''
**An interest rate alone doesn't tell you whether you are gaining: you have to compare it with inflation.**

The rate you read on the contract is called the **nominal rate**: it says by how much the figure grows.

The **real rate** says instead by how much your purchasing power grows, that is, what you can buy. It is the nominal rate cleaned of inflation.

For everyday calculations a subtraction is enough:

$$\text{real} \approx \text{nominal} - \text{inflation}$$

[fig]

If the real rate is positive, at the end of the year you can buy more. If it is negative you can buy less, even if the figure in the account has gone up.''',
      fig=F([('Bank A: the account earns', '2%', [(2, 'Nominal rate', CAP)]), ('Bank A: prices rise', '1%', [(1, 'Inflation', INT)]),
             ('Bank B: the account earns', '5%', [(5, 'Nominal rate', CAP)]), ('Bank B: prices rise', '6%', [(6, 'Inflation', INT)])],
            cap='With A the rate beats prices: real about +1%. With B your money loses: real about −1%.')),
    P('The exact calculation', r'''
The subtraction is a good approximation. The precise calculation divides instead of subtracting:

$$1 + r = \frac{1 + n}{1 + \pi}$$

Where \(r\) is the real rate, \(n\) the nominal rate and \(\pi\) inflation.

With a nominal rate of 5% and inflation of 2%:

• approximate: \(5\% - 2\% =\) **3%**
• exact: \(\dfrac{1.05}{1.02} - 1 =\) **2.94%**

Why divide? In a year €100 becomes €105, but what cost €100 now costs €102. With €105 you buy \(\dfrac{105}{102} = 1.0294\) times what you bought before.

With low rates the two calculations almost coincide. The higher the rates, the wider the gap.'''),
    N("A savings account earns 3.5% a year and inflation is 2%. Roughly what is the real rate? Use subtraction.", 1.5, '%',
      r'\(3.5\% - 2\% =\) **1.5%**. The exact calculation gives \(\dfrac{1.035}{1.02} - 1 = 1.47\%\).', tol=0.05, dec=1),
    BK("Does your purchasing power go up or down?", ['Goes up', 'Goes down'], [
      ('Rate 4%, inflation 1%', 0, r'Real about \(4\% - 1\% = +3\%\).'),
      ('Rate 2%, inflation 5%', 1, r'Real about \(2\% - 5\% = -3\%\).'),
      ('Rate 0%, inflation 2%', 1, 'Idle money loses about 2% a year.'),
      ('Rate 6%, inflation 3%', 0, r'Real about \(6\% - 3\% = +3\%\).'),
      ('Rate 7%, inflation 9%', 1, "A high rate isn't enough if inflation is higher."),
      ('Rate 1%, inflation 0%', 0, 'Without inflation the whole rate is real gain.')]),
    Q("An investment earns 4% a year and inflation is 6%. Roughly what is the real rate?", ['−2%', '+2%', '+10%'], 0,
      r'\(\text{Real} \approx 4\% - 6\% =\) **−2%**. The investment pays you, but less than prices are rising: in real terms you lose.'),
    Q('Your salary rises 3% in a year when prices rise 3%. What has happened to what you can buy?', ['It rose 3%', 'It stayed about the same', 'It fell 3%'], 1,
      "Salary and prices rose at the same pace: your purchasing power stayed **where it was**. The same reasoning as the real rate applies to salaries, rents and pensions."),
  ], r"\(\text{Real rate} \approx \text{nominal} - \text{inflation}\). If the real rate is negative, you are losing purchasing power."),
])
