# Unit 9, "Investire passo passo": lessons basi-9-1, 9-2, 9-3, 9-4 (all label A).
U9 = dict(id='basi-u9', sid='basi-investire', name='Investing step by step', lessons=[
# ---- basi-9-1 (A)
  LF('basi-9-1', 'PAC', 'All at once or a little at a time', 7, [
    G("Davide invests €200 a month for 20 years in a fund that returns 5% a year on average. In all he pays in €48,000. How much does he end up with?",
      "With these assumptions he reaches about **€81,000**: €48,000 he paid in himself, the other €33,000 are returns. Assumptions: constant return of 5% a year, payments at the end of the month. In reality the return changes every year, but the idea holds: paying in a little for a long time works.",
      lo=40000, hi=140000, step=1000, truth=81161, near=6000),
    P('Two ways to invest', r'''
**You don't need a big sum to start investing: you can begin small, every month.**

There are two ways to put money into an investment.

• A **lump sum**: you put in a sum all at once. It is the case of someone who already has money set aside, for example an inheritance.
• **Dollar-cost averaging**: you put in a fixed amount at regular intervals, usually every month. It is the case of someone who invests part of their paycheck.

[fig]

Dollar-cost averaging has a practical advantage: it becomes a habit. Once the automatic payment is set up, you invest without having to think about it and without having to decide each time whether it is the right moment.''',
      fig=F([('Lump sum: all on day one', '€12,000', [(12000, 'A single payment', CAP)]),
             ('Dollar-cost averaging: after 6 months', '€6,000', [(6000, '6 payments of €1,000', OK)]),
             ('Dollar-cost averaging: after 12 months', '€12,000', [(12000, '12 payments of €1,000', OK)])])),
    P('Time does the biggest part', r'''
Back to Davide: €200 a month for 20 years, at 5% a year.

[fig]

Every payment starts earning from the day it goes in, and the returns produce more returns: it is compound interest. The first €200 work for almost twenty years, the last ones haven't yet had time to earn.

That is why starting early matters so much.

| Duration | Paid in | At the end |
|---|---|---|
| 10 years | €24,000 | €30,873 |
| 20 years | €48,000 | €81,161 |
| 30 years | €72,000 | €163,075 |

From 10 to 20 years the amount paid in doubles, but the final amount does much more. From 20 to 30 years you add €24,000 of payments and find about €82,000 more.''',
      fig=F([('After 20 years', '€81,161', [(48000, 'Paid in by Davide', OK, '€48,000'), (33161, 'Returns', CAP, '€33,161')])])),
    LV('Build your plan', "Every month you pay in an amount and invest it at 5% a year. Move the levers and see how much you will have at the end.", 'piano', dict(tasso=5),
      [dict(id='rata', label='Monthly payment', min=50, max=500, step=10, start=100, unit='€'), dict(id='anni', label='Duration', min=5, max=40, step=5, start=10, unit='anni')],
      [dict(label='Reach at least €100,000', cond=[['totale', '>=', 100000]], hint='Try lengthening the duration, or raising the payment.'),
       dict(label='Now get there paying in less than €50,000 in all', cond=[['totale', '>=', 100000], ['versato', '<', 50000]], hint='Less money paid in means more work left to time: lengthen the duration and lower the payment.')],
      'You can reach €100,000 paying in less than half of it, but only by giving the plan many years. Whoever starts late has to pay in much more to reach the same amount.'),
    N('You invest €150 a month with dollar-cost averaging. How much have you paid in, in all, after 8 years?', 14400, '€',
      r"\(150 \times 12 = \text{€}1{,}800\) a year. In 8 years: \(1{,}800 \times 8 =\) **€14,400**. The value of your investment will be different, because it depends on returns."),
    Q('What sets dollar-cost averaging apart from investing a lump sum?', ['With dollar-cost averaging you pay in a fixed amount at regular intervals, with a lump sum everything at once', 'Dollar-cost averaging is guaranteed, a lump sum is not', 'Dollar-cost averaging can only be done with bonds'], 0,
      'Dollar-cost averaging means regular payments, a lump sum means a single payment. Neither is guaranteed: both invest in instruments that can rise and fall.'),
    Q('Anna and Bruno each pay €200 a month into the same fund. Anna starts at 25, Bruno at 35. Both stop at 65. Who will have more?', ['Bruno, because he started with more experience', 'Anna, because her money worked 10 years longer', 'They will have the same amount'], 1,
      'Anna pays in for 40 years, Bruno for 30. Anna has paid in €24,000 more, but above all her first payments had ten more years to produce returns on returns.'),
  ], "Lump sum: all at once. Dollar-cost averaging: a fixed amount every month. With dollar-cost averaging, time matters most: the sooner you start, the more compound interest works."),
# ---- basi-9-2 (A)
  LF('basi-9-2', 'Ø', 'Buying at different prices', 7, [
    G("You invest €100 a month in a fund. The price of one share is €10 the first month, €8 the second, €12.50 the third. In which month did you buy the most shares?",
      r'With a fixed amount you buy more shares when the price is low: \(\dfrac{100}{8} =\) **12.5 shares** in the second month, against 10 in the first and 8 in the third. It is a small automatic advantage of always paying in the same amount.',
      options=['The first', 'The second', 'The third'], ans=1),
    P('Same amount, different shares', r'''
**With dollar-cost averaging you don't always buy the same quantity: you always buy for the same amount.**

A fund is divided into **shares**, and the price of a share changes over time. If you pay in €100 a month, how many shares you receive depends on that day's price:

$$\text{shares} = \frac{\text{amount paid in}}{\text{price of one share}}$$

[fig]

When the price falls your €100 buys more, when it rises it buys less. Without deciding anything, you end up buying more shares at low prices than at high prices.''',
      fig=F([('Month 1: price €10', '10 shares', [(10, 'Shares bought with €100', CAP)]),
             ('Month 2: price €8', '12.5 shares', [(12.5, 'Shares bought with €100', OK)]),
             ('Month 3: price €12.50', '8 shares', [(8, 'Shares bought with €100', INT)])])),
    N('In three months you have paid in €300 and bought 10 shares, then 12.5, then 8. How many shares do you have in all?', 30.5, 'quote',
      r'\(10 + 12.5 + 8 =\) **30.5 shares**.', tol=0.01, dec=1),
    P('The average purchase price', r'''
How much did each share cost you, on average? It is called the **average purchase price**:

$$\text{average price} = \frac{\text{total paid in}}{\text{shares owned}}$$

You paid in €300 and you have 30.5 shares: \(\dfrac{300}{30.5} =\) **€9.84** a share.

The average of the three prices, instead, is \(\dfrac{10 + 8 + 12.50}{3} =\) **€10.17**.

Your cost is lower than the average of the prices, precisely because you bought more shares when they cost less.

Be careful not to ask dollar-cost averaging for what it can't give. It doesn't protect you from losses: if the price falls below €9.84 you are at a loss. And if prices always rise, whoever paid in everything up front did better. Its strength is something else: it saves you from having to guess the right moment to get in.'''),
    N('With dollar-cost averaging you have paid in €1,200 in all and own 100 shares. Today one share is worth €13. How much is your investment worth?', 1300, '€',
      r"100 shares at €13 each: \(100 \times 13 =\) **€1,300**. Your average purchase price is \(\dfrac{1{,}200}{100} = \text{€}12\): today the share is worth more, so you are earning €100."),
    BK('True or false about dollar-cost averaging?', ['True', 'False'], [
      ('With the same amount you buy more shares when the price is low', 0, 'It is a division: a fixed amount divided by a lower price gives more shares.'),
      ('Dollar-cost averaging guarantees you will not lose', 1, 'If the price falls below your average purchase price, you are at a loss.'),
      ('It saves you from choosing the right moment to get in', 0, 'You get in a little at a time, at different prices.'),
      ('If prices always rise, dollar-cost averaging beats a lump sum', 1, 'In that case whoever paid in everything up front bought at the lowest prices.'),
      ('The average purchase price is the total paid in divided by the shares', 0, 'That is exactly the definition.')]),
    Q('You pay in €200 when a share costs €20 and another €200 when it costs €10. What is your average purchase price?', ['€15.00', '€13.33', '€10.00'], 1,
      r'Shares bought: \(\dfrac{200}{20} = 10\) and \(\dfrac{200}{10} = 20\), 30 in all. Average purchase price: \(\dfrac{400}{30} =\) **€13.33**. It is not €15, the average of the two prices, because at €10 you bought twice as many shares.'),
    Q('Your average purchase price is €9.84 and today a share is worth €9. How is your investment doing?', ['At a gain', 'Breaking even', 'At a loss'], 2,
      'Each share cost you €9.84 on average and today it is worth €9: you are **at a loss**. The average purchase price is your breakeven point.'),
  ], 'With a fixed amount you buy more shares when they cost less. The average purchase price is the total paid in divided by the shares: it is your breakeven point.'),
# ---- basi-9-3 (A)
  LF('basi-9-3', '72', 'The rule of 72', 6, [
    G("You invest €5,000 and let it grow at 6% a year, without touching it. After how many years will it have become €10,000?",
      r"It takes about **12 years**. There is a shortcut to know it without a calculator: divide 72 by the rate. \(\dfrac{72}{6} = 12\).",
      lo=0, hi=40, step=1, truth=12, near=1, unit='anni'),
    P('A division instead of a formula', r'''
**To know in how many years your money doubles, just divide 72 by the rate.**

$$\text{years to double} \approx \frac{72}{\text{rate}}$$

The rate is written as a number: for 6% you put 6. It works thanks to compound interest: every year the interest is added to the principal and the next year it earns interest too.

| Rate | Rule of 72 | Exact calculation |
|---|---|---|
| 2% | 36 years | 35.0 years |
| 4% | 18 years | 17.7 years |
| 6% | 12 years | 11.9 years |
| 8% | 9 years | 9.0 years |

It is an estimate, not a precise calculation, but for the rates you usually meet it is off by only a few months.

Notice one thing: going from 2% to 4% doesn't shorten the wait a little. It halves it.'''),
    N("An investment returns 3% a year. According to the rule of 72, in how many years does it double?", 24, 'anni',
      r'\(\dfrac{72}{3} =\) **24 years**.'),
    P('It works for everything that grows', r'''
The same rule works for anything that grows at a constant pace. Prices too.

With inflation of 3% a year, prices double in about \(\dfrac{72}{3} =\) **24 years**. It means that money left idle, in 24 years, buys half as much.

[fig]

And it works for debts. A debt at 18% a year on which you pay nothing doubles in about \(\dfrac{72}{18} =\) **4 years**.

The rule of 72 is for this: to feel how much a rate weighs without doing the math. 2% and 6% look close. But one doubles your money in 36 years, the other in 12.''',
      fig=F([('Today', '€1,000', [(1000, 'What €1,000 buys', CAP)]), ('In 24 years, with 3% inflation', 'about half', [(492, 'What the same €1,000 buys', INT)])])),
    N("With inflation of 4% a year, in about how many years do prices double?", 18, 'anni',
      r'\(\dfrac{72}{4} =\) **18 years**. In 18 years money left idle buys about half as much.'),
    OR('From the fastest doubling to the slowest', ['Credit card debt at 18%', 'Investment at 8%', 'Investment at 4%', 'Savings account at 2%'],
      x='Tap the items from the one that doubles first to the one that doubles last.', after='72 divided by the rate: about 4 years, 9 years, 18 years, 36 years.'),
    Q('At about what annual rate does money double in 10 years?', ['3.6%', '7.2%', '10%'], 1,
      r'The rule also works in reverse: \(\text{rate} \approx \dfrac{72}{\text{years}} = \dfrac{72}{10} =\) **7.2%**.'),
    Q("You have €2,000 invested at 8% a year. According to the rule of 72, about how much will you have after 18 years?", ['€4,000', '€6,000', '€8,000'], 2,
      r"At 8% money doubles every \(\dfrac{72}{8} = 9\) years. In 18 years it doubles twice: from €2,000 to €4,000, then to **€8,000**."),
  ], r'\(\text{Years to double} \approx \dfrac{72}{\text{rate}}\). It works for invested money, for prices and for debts.'),
# ---- basi-9-4 (A)
  LF('basi-9-4', '60/40', 'Splitting and rebalancing', 7, [
    G("Marta invests €10,000: €6,000 in stocks and €4,000 in bonds. In a year the stocks rise 30%, the bonds stay flat. What percentage of her portfolio is now in stocks?",
      r'The stocks are worth \(6{,}000 \times 1.30 = \text{€}7{,}800\), the bonds €4,000. In all €11,800, and the stocks are \(\dfrac{7{,}800}{11{,}800}\), that is about **66%**. Marta did nothing, yet her portfolio became riskier than the one she had chosen.',
      lo=50, hi=100, step=1, truth=66, near=2, unit='%'),
    P('The choice that matters most', r'''
**Before choosing which securities to buy, you decide how to split your money between stocks and bonds.**

The whole of your investments is called a portfolio. The way you split it has a name: **asset allocation**. It is the choice that weighs most on how much it can rise and fall.

• More **stocks**: more expected growth over the long run, but bigger drops along the way.
• More **bonds**: less expected growth, but a calmer ride.

[fig]

There is no split that is right for everyone. It depends on how much time you have before you need the money, and on how much you can bear to watch it fall without selling.

Marta has 15 years ahead and chooses 60% stocks and 40% bonds.''',
      fig=F([('Conservative', None, [(30, 'Stocks', INT, '30%'), (70, 'Bonds', CAP, '70%')]),
             ('Balanced', None, [(60, 'Stocks', INT, '60%'), (40, 'Bonds', CAP, '40%')]),
             ('Aggressive', None, [(90, 'Stocks', INT, '90%'), (10, 'Bonds', CAP, '10%')])], cap='Three examples. The names change from one provider to another.')),
    P('The portfolio drifts by itself', r'''
Once chosen, the split doesn't stay put: the markets move it.

After a year in which stocks rise 30% and bonds stay flat, Marta's portfolio has changed:

[fig]

Stocks went from 60% to 66%. If they kept rising they would reach 70%, then 80%. Marta would find herself with a portfolio much riskier than the one she chose, right after a long climb: that is, when a drop would hurt most.''',
      fig=F([('At the start', '€10,000', [(6000, 'Stocks', INT, '€6,000'), (4000, 'Bonds', CAP, '€4,000')]),
             ('After a year', '€11,800', [(7800, 'Stocks', INT, '€7,800'), (4000, 'Bonds', CAP, '€4,000')])])),
    P('Bringing it back to where you decided', r'''
To **rebalance** means to bring the portfolio back to the split you chose.

Marta wants to go back to 60% stocks on €11,800:

• stocks she should have: \(11{,}800 \times 60\% =\) **€7,080**
• stocks she has: €7,800
• to sell: \(7{,}800 - 7{,}080 =\) **€720**

With those €720 she buys bonds, which rise to €4,720: 40%.

She sold a bit of what went up and bought what stayed behind. It is the opposite of what instinct would say, and that is why it is best done with a fixed rule, for example once a year.

Rebalancing is not for earning more: it is for keeping the risk where you decided. Selling can trigger taxes and fees, so it shouldn't be done too often.'''),
    N('A portfolio is worth €20,000: €14,000 in stocks and €6,000 in bonds. You want to go back to half and half. How much of the stocks do you need to sell?', 4000, '€',
      r'Half of €20,000 is €10,000. You have €14,000 in stocks: you sell \(14{,}000 - 10{,}000 =\) **€4,000** and with that money you buy bonds, which rise to €10,000.'),
    BK('More stocks or more bonds?', ['More stocks', 'More bonds'], [
      ('You need the money in 25 years', 0, 'With so much time ahead you can bear the drops and aim for growth.'),
      ('You need the money in 3 years', 1, "With little time a big drop can't be recovered: you need a calmer ride."),
      ('A 20% drop would keep you awake at night', 1, 'If you would end up selling at the worst moment, better a portfolio that swings less.'),
      ('You have just started working and are investing for retirement', 0, 'It is the typical case of a very long horizon.'),
      ('You retire next year', 1, 'Soon you will need that money to live on.')]),
    Q('You chose 50% stocks and 50% bonds. After a year the stocks have risen a lot and are now 60%. What does rebalancing mean?', ['Buying more stocks, since they are rising', 'Selling everything and starting over', 'Selling some of the stocks and buying bonds'], 2,
      'Rebalancing brings the portfolio back to the chosen split: you **sell part of what went up** and buy what stayed behind, until you are back to 50 and 50.'),
    Q('What is rebalancing mainly for?', ['To keep the risk at the level you chose', 'To beat the market', 'To avoid paying taxes'], 0,
      "It is for not finding yourself, after a long climb, with many more stocks than you had decided on. It doesn't promise higher returns, and selling can in fact trigger taxes."),
  ], "Asset allocation is how you split your money between stocks and bonds. The markets move it: rebalancing brings it back to where you decided."),
])
