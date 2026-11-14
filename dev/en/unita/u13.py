# Unit 13, "La casa": lessons basi-13-1 (label A) and basi-13-2 (label B). basi-13-3, 13-4 and 13-5 (label C) are not translated.
U13 = dict(id='basi-u13', sid='basi-casa', name='Buying a home', lessons=[
  LF('basi-13-1', 'CASA', 'Renting or buying', 7, [
    G("You buy a house for €200,000 and after three years you have to move to another city. You sell it at the same price. Compared with renting at €800 a month, how did it go?",
      "In three years rent would have cost €28,800. By buying you paid about €16,000 in purchase costs, €16,000 in interest, maintenance, and you kept your savings tied up: in all about €41,600. Rent is not money thrown away: it is the price of a service. Whoever buys also has money that doesn't come back, it just shows less.",
      options=["Better: rent is money thrown away", 'About the same', 'Worse: you spent about €13,000 more'], ans=2),
    P("The money that doesn't come back", r'''
**Whoever rents pays rent. Whoever buys pays four other things, and none of them is returned.**

• The **purchase costs**: taxes, legal fees, agent. They are paid once and are not recovered when you sell.
• The mortgage **interest**. The part of each payment that repays principal is saving, the interest is not.
• **Maintenance** and extraordinary expenses, which with a rental fall on the owner.
• The **return you give up** on the down payment: that money, invested, would have earned something.

In exchange the buyer has two advantages: no rent to pay, and if the house rises in value the gain is theirs. If it falls, so is the loss.

That is why the right question isn't whether buying pays off, but **after how many years**. Purchase costs all weigh at the start: the longer you stay in the house, the more they are spread out.'''),
    LV('After how many years it pays off', "A house at €200,000, a mortgage of €160,000 at 3.5% for 25 years. Purchase costs 8%, maintenance 1% a year, 2% return given up on the money tied up.", 'casa',
      dict(prezzo=200000, costi=8, anticipo=20, tasso=3.5, anniMutuo=25, manut=1, rend=2),
      [dict(id='anni', label='Years you stay', min=1, max=20, step=1, start=3, unit='anni'),
       dict(id='affitto', label='Monthly rent', min=500, max=1400, step=50, start=800, unit='€'),
       dict(id='crescita', label='House value, per year', min=-2, max=4, step=0.5, start=0, unit='%', dec=1)],
      [dict(label='With rent and prices flat, find after how many years buying costs less', cond=[['diff', '>', 0], ['affitto', '<=', 800], ['crescita', '<=', 0]], hint='Move only the years: purchase costs are paid just once.'),
       dict(label='Now go back to 5 years and make buying pay off anyway', cond=[['anni', '<=', 5], ['diff', '>', 0]], hint='Over 5 years buying wins only if rent is high, or if the house rises in value.')],
      "With these numbers it takes about 11 years for buying to beat rent of €800. Over a short time it wins only if rent is high or prices rise, and nobody has certainty about prices. Before the house, one thing has to be decided: how long you plan to stay in it."),
    P('What shifts the calculation', r'''
The result changes a lot with three numbers. It helps to know in which direction they push.

• **The ratio of rent to price.** Rent of €800 a month on a house worth €200,000 amounts, over a year, to 4.8% of the price. Where rents are high compared with prices, buying pays for itself sooner.
• **The mortgage rate.** On €160,000 of debt, each extra point is about €1,600 more interest a year.
• **How long you stay.** It is the number that counts most, and it is the only one that depends only on you.

Then there is what no calculation measures: the stability of a home of your own, or the freedom to change city without having to sell. They have a value, but not the same for everyone. The calculation is there to tell you how much you are paying for them.'''),
    N("An apartment costs €180,000. The same apartment rents for €750 a month. What is a year's rent as a percentage of the price?", 5, '%',
      r"A year's rent is \(750 \times 12 = \text{€}9{,}000\). Compared with the price: \(\dfrac{9{,}000}{180{,}000} =\) **5%**. The higher this number, the sooner buying pays for itself."),
    Q('Which of these home-buying expenses is not recovered when you sell?', ['The part of the payment that repays principal', 'The taxes and legal fees paid at purchase', 'The down payment'], 1,
      "The down payment and the principal repaid stay inside the value of the house: you get them back when you sell. Taxes, legal fees and agent are paid once and don't come back."),
    Q('You plan to stay in a city for two years. What usually costs less?', ['Renting', 'Buying', 'It is always the same'], 0,
      "In two years the purchase costs don't have time to spread out. Buying would pay off only if prices rose a lot in the meantime, and that can't be known beforehand."),
    Q('How is mortgage interest like rent?', ['It is paid only once', 'It is collected by whoever sold you the house', "It is the price for using money that isn't yours, and it doesn't come back"], 2,
      "With rent you pay to use a house that isn't yours. With interest you pay to use money that isn't yours. In both cases it is a cost, not a saving."),
  ], "Buying has costs that don't come back: purchase, interest, maintenance. They are paid back only with time. The right question is after how many years."),
  LF('basi-13-2', '1/3', 'How big a mortgage you can afford', 7, [
    G('A couple earns €3,000 net a month between them. With a mortgage at 3.5% for 25 years, how much can they borrow without exceeding a prudent payment?',
      "The most widely used rule says the payment shouldn't exceed **a third of income**: here €1,000 a month. At 3.5% for 25 years, a €1,000 payment repays a mortgage of about **€200,000**. The third isn't a law: it is the margin you need to withstand an unexpected expense without missing a payment.",
      lo=0, hi=400000, step=5000, truth=200000, near=15000),
    P('The one-third rule', r'''
**How big a mortgage you can afford isn't decided by the price of the house: it is decided by the payment you can handle.**

The Bank of Italy indicates as reasonable a payment that doesn't exceed **one third of disposable income**. Inside that third must also fit the payments you already have: the car, a loan, a payroll-deduction loan (the Italian cessione del quinto).

Once the payment is fixed, the mortgage depends on two things.

• **The term.** More years means more mortgage with the same payment, but much more interest.
• **The rate.** Each extra point reduces the mortgage that the same payment can repay.

Then there is a second limit: as a rule the bank lends up to **80% of the value** of the house. The rest, plus the purchase costs, has to come from your savings.'''),
    LV('How big a mortgage an income can carry', 'The payment is a third of net income. Move income, rate and term.', 'mutuomax', dict(),
      [dict(id='reddito', label='Monthly net income', min=1500, max=6000, step=100, start=2400, unit='€'),
       dict(id='tasso', label='Rate', min=2, max=6, step=0.25, start=3.5, unit='%', dec=2),
       dict(id='anni', label='Term', min=10, max=30, step=5, start=25, unit='anni')],
      [dict(label='Reach a mortgage of at least €190,000', cond=[['mutuo', '>=', 190000]], hint='You can raise income, lengthen the term or lower the rate.'),
       dict(label='Now get €190,000 paying less than €80,000 in interest', cond=[['mutuo', '>=', 190000], ['interessi', '<', 80000]], hint='A long term raises interest. Try fewer years and more income, or a lower rate.')],
      'Lengthening the term makes the mortgage grow, but also the interest bill. If it takes 30 years and a payment at the limit to reach the price, the signal is a different one: that house costs too much for that income.'),
    P('How the bank looks at you', r'''
To decide, the bank looks at four things.

• **Income, and how stable it is.** A permanent contract counts for more than a fixed-term one.
• **The debts you already have**, and how you paid them: it checks the credit databases.
• **The value of the house**, estimated by its own appraiser. What counts is the appraisal, not the price you agreed.
• **How much you put in yourself.**

If you choose an adjustable rate, run a test on your own: does the payment hold up with two points more? On €160,000 over 25 years, going from 3.5% to 5.5% takes the payment from €801 to €983 a month.'''),
    N("Marta and Luca earn €3,300 net a month together and already pay €250 a month for the car. With the one-third rule, what mortgage payment can they add?", 850, '€',
      r"A third of income: \(\dfrac{3{,}300}{3} = \text{€}1{,}100\). The car payment has to fit inside it too: \(1{,}100 - 250 =\) **€850**."),
    Q('Net income of €2,700 a month, no other debts. What is a prudent mortgage payment?', ['€450', '€900', '€1,350'], 1,
      r'A third of income: \(\dfrac{2{,}700}{3} =\) **€900**. With €1,350 half of the income would be committed: one unexpected expense would be enough to cause trouble.'),
    Q('With the same payment, what happens if you lengthen the mortgage from 20 to 30 years?', ['You get more mortgage, and pay more interest in all', 'You get less mortgage', 'You pay less interest in all'], 0,
      'With more years the same payment repays a bigger debt. But interest is paid for ten more years, and its total goes up a lot.'),
    Q("You agreed on a price of €200,000, but the bank's appraiser values the house at €185,000. On which figure does the bank calculate the 80%?", ['On the price', 'On the average of the two figures', 'On the appraisal'], 2,
      "The bank lends based on the value estimated by its appraiser. 80% of €185,000 is €148,000: to reach the price you need €52,000 of your own, not €40,000."),
  ], "Payment within a third of income, counting other debts. The bank usually lends up to 80% of the appraised value. A longer term means more mortgage, but more interest."),
])
