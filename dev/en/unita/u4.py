# Unit 4, "Debiti e prestiti": lessons basi-4-1 to basi-4-6 (4-1 to 4-4 label A, 4-5 and 4-6 label B). basi-4-7 (label C) is not translated.
U4 = dict(id='basi-u4', sid='basi-debiti', name='Debt and credit', lessons=[
  LF('basi-4-1', 'P', 'How a loan works', 7, [
    G("You need €3,310 for a used motorcycle. The bank lends it to you at 10% a year and you repay it in 3 equal yearly installments. How much interest do you pay it in total?",
      "Many people say €993, that is 10% of €3,310 for three years. But each installment also pays back a piece of the debt, so interest is calculated on a figure that goes down. In all it is **€683**: now let's see where it comes from.",
      lo=0, hi=1500, step=10, truth=683, near=70),
    P('Money today, repaid in installments', r'''
**Taking out a loan means using money today that you don't have, and paying it back a little at a time.**

The bank gives you the €3,310 for the motorcycle right away: that amount is called the **principal**.

But the bank doesn't do it for free. For every year you hold its money it asks for a payment, the **interest**: here 10% of what you still owe it.

Each year you pay a fixed amount, the **installment**: €1,331. Inside it are two different things:

• one part pays the interest for that year;
• the rest pays back a piece of the principal.

[fig]

The more principal you repay, the less you owe the bank, and the less interest you will pay the following year.''',
      fig=F([("Each year's installment", '€1,331', [(1, 'Interest', INT), (3, 'Principal repaid', CAP)])], cap='What each piece is worth changes from year to year: we see it next.')),
    P('The first year', r'''
Let's work out the first installment.

At the start you owe the bank the whole €3,310. The interest for the first year is 10% of that amount:

• Interest: \(10\% \times 3{,}310 =\) **€331**

The installment is €1,331. Take out the interest, and what is left pays back principal:

• Principal repaid: \(1{,}331 - 331 =\) **€1,000**

[fig]

After the first installment you no longer owe €3,310, but \(3{,}310 - 1{,}000 =\) **€2,310**. Next year's interest is calculated on this figure, which is lower.''',
      fig=F([('The first installment', '€1,331', [(331, 'Interest', INT, '€331'), (1000, 'Principal repaid', CAP, '€1,000')])])),
    N(r'''
Second year. Now you owe the bank €2,310, and the rate is still 10%.

| Year | Interest | Principal | Balance |
|---|---|---|---|
| 1 | 331 | 1,000 | 2,310 |
| 2 | **?** | | |

How much interest do you pay in the second year?''', 231, '€',
      r"\(10\% \times 2{,}310 =\) **€231**. The rest of the installment, \(1{,}331 - 231 = \text{€}1{,}100\), pays back principal: the debt falls to €1,210."),
    N(r'''
Third year. You have €1,210 of debt left at 10%, and the installment is still €1,331.

| Year | Interest | Principal | Balance |
|---|---|---|---|
| 1 | 331 | 1,000 | 2,310 |
| 2 | 231 | 1,100 | 1,210 |
| 3 | 121 | **?** | |

How much principal do you repay with the last installment?''', 1210, '€',
      r"Interest: \(10\% \times 1{,}210 = \text{€}121\). Principal repaid: \(1{,}331 - 121 =\) **€1,210**, which is all the debt that was left. The loan is paid off."),
    P('The installment stays the same, the inside changes', r'''
Here are the three installments one under the other. The amount is always €1,331, but look at how the inside changes.

[fig]

Year after year the debt goes down, so the interest goes down and the part that repays principal grows.

And the €683 from the opening question? It is the interest of the three installments added together: \(331 + 231 + 121 =\) **€683**. It is the price you pay for having the motorcycle right away.

For the curious, the equal installment that makes the numbers work is found like this:

$$R = C \times \frac{i}{1 - (1 + i)^{-n}}$$

Where \(R\) is the installment, \(C\) the principal, \(i\) the rate per period and \(n\) the number of installments.''',
      fig=F([('Year 1', '€1,331', [(331, 'Interest', INT, '€331'), (1000, 'Principal', CAP, '€1,000')]),
             ('Year 2', '€1,331', [(231, 'Interest', INT, '€231'), (1100, 'Principal', CAP, '€1,100')]),
             ('Year 3', '€1,331', [(121, 'Interest', INT, '€121'), (1210, 'Principal', CAP, '€1,210')])])),
    BK('As the years go by, does it go up or down?', ['Goes down', 'Stays the same', 'Goes up'], [
      ('The interest portion', 0, 'Interest is calculated on the debt that is left, and the debt shrinks with every installment.'),
      ('The installment', 1, 'In this type of loan the installment is the same from the first to the last.'),
      ('The principal portion', 2, 'The installment is fixed and the interest goes down: what is left over to reduce the debt grows.'),
      ('The remaining balance', 0, 'Each installment pays back a piece of it.')]),
    Q("You borrow €5,000 at 8% a year. How much interest accrues in the first year?", ['€400', '€40', '€800'], 0,
      r'\(5{,}000 \times 8\% =\) **€400**. In the following years the interest goes down, because the remaining balance shrinks.'),
    Q("In a loan with a constant installment, how does the first installment compare with the last?", ['It has less interest and more principal', 'It is the same inside too', 'It has more interest and less principal'], 2,
      "At the start the debt is at its highest, so interest weighs more and there is less room for principal. In the lesson's example the first installment has €331 of interest, the last €121."),
  ], 'The installment stays the same, but its inside changes: more interest at first, then almost only principal.'),
  LF('basi-4-2', 'TAN', 'Interest rate and APR', 6, [
    G("Two banks offer you the same loan: same amount, same term. Bank A asks for a rate of 5%, bank B 6%. Which costs you less?",
      "The rate alone is not enough: the **fees** are missing. A loan at 5% with high fees can cost more than one at 6% with no fees. That is why every loan has two numbers: the nominal interest rate and the APR.",
      options=['Bank A', 'Bank B', "You can't tell"], ans=2),
    P("The rate doesn't tell the whole story", r'''
When you take out a loan you pay two kinds of costs.

The first is **interest**, the payment to the bank for the money it lends you. The rate that measures it is called the **nominal interest rate**.

The second is **fees**: setting up the loan, collecting each payment, sometimes insurance the bank requires you to take out. They are not in the nominal rate.

That is why there is a second number, the **APR**, the annual percentage rate: it puts interest and mandatory fees together and tells you how much the loan really costs in a year.

[fig]

When you compare two offers, look at the APR.''',
      fig=F([('How much a loan costs you', None, [(4, 'Interest: measured by the nominal rate', INT), (1, 'Mandatory fees', 'giallo')])], cap='The APR measures the whole bar, the nominal rate only the first piece.')),
    BK('Does it count in the APR?', ['Counts in the APR', 'Left out'], [
      ('Interest on the loan', 0, 'Interest is the first piece of the APR: it is what the nominal rate measures.'),
      ('Loan processing fees', 0, 'They are mandatory fees for getting the loan: they count.'),
      ('Fees for collecting each payment', 0, "You pay them with every installment and can't avoid them: they count."),
      ('Mandatory insurance', 0, "If you can't get the loan without the policy, its cost counts."),
      ('Optional insurance', 1, "If you can get the loan without it, it isn't a mandatory cost: it stays out."),
      ('Late-payment interest (for those who pay late)', 1, 'You pay it only if you are late with your installments: it is not part of the expected cost.'),
      ('Legal fees', 1, 'On a mortgage you do pay them, but by rule they stay out of the APR: they are counted separately.')],
      after='What counts in the APR is whatever you are obliged to pay to get the loan. Left out are optional costs, those that arise from a delay on your part, and legal fees.'),
    N(r'''
A €10,000 loan for one year, repaid all at the end.

• Interest (nominal rate 6%): €600
• Mandatory fees: €150, paid together with the repayment

What is the APR, as a percentage?''', 7.5, '%', r'''
Total cost: \(600 + 150 = \text{€}750\).

$$\text{APR} = \frac{750}{10{,}000} = 7.5\%$$

The nominal rate says 6%, but the loan costs 7.5%. If the fees were paid up front, the APR would rise a bit more, because in effect you would receive less than €10,000.''', tol=0.05, dec=2),
    M(('Nominal rate', 'The pure interest rate of the loan'), ('APR', 'The annual cost of the loan, fees included'), ('Installment', 'The sum you pay at each due date'), ('Principal', 'The amount you borrowed')),
    Q('Loan A: nominal rate 5%, APR 8.2%. Loan B: nominal rate 6%, APR 6.9%. Same amount, same term. Which costs less?', ['Loan A', 'Loan B', 'They cost the same'], 1,
      "What counts is the APR, which includes the fees: **B** costs 6.9% against 8.2% for A, even though it has the higher nominal rate."),
  ], 'The nominal rate is the price of the money, the APR is the price of the whole loan. You compare the APR.'),
  LF('basi-4-3', 'M', 'The mortgage: fixed or adjustable', 7, [
    G("To buy a home you take out a mortgage of €150,000, to be repaid over 25 years. If the rate goes from 3% to 5%, by how much does the monthly payment go up?",
      "At 3% the payment is **€711**, at 5% **€877**: about **€166 more every month**, for 25 years. On long terms even two points of rate weigh a lot.",
      lo=0, hi=400, step=5, truth=166, near=20),
    P('A long loan, with the house as collateral', r'''
The **mortgage** is the loan you take out to buy a home. The amount is large, so it is repaid over many years, usually between 15 and 30, with one payment each month.

To lend so much and for so long the bank wants a guarantee: the house itself. If you stop paying, it can have it sold and take its money back. This guarantee is called a **lien**.

Over such long periods interest weighs a lot. Look at how much you repay in all for €150,000 over 25 years:

[fig]

Same house, same amount: two more points of rate mean almost €50,000 more in interest.''',
      fig=F([('With the rate at 3%', '€213,395', [(150000, 'Principal', CAP, '€150,000'), (63395, 'Interest', INT, '€63,395')]),
             ('With the rate at 5%', '€263,066', [(150000, 'Principal', CAP, '€150,000'), (113066, 'Interest', INT, '€113,066')])])),
    P('Fixed or adjustable', r'''
When you sign a mortgage you choose how the rate will behave over the years.

With a **fixed rate** the rate stays what it was on day one, and so does the payment: you already know today how much you will pay in twenty years.

With an **adjustable rate** the rate follows a market benchmark rate, to which the bank adds a fixed markup, the **spread**. If market rates go up, your payment goes up; if they fall, it falls.

The adjustable often starts from a lower payment, but the risk that it rises is yours. The fixed often costs a bit more at the start: it is the price of certainty.'''),
    BK('Fixed or adjustable?', ['Fixed rate', 'Adjustable rate'], [
      ('The payment stays the same to the end', 0, 'It is the fixed rate that locks the payment for the whole term.'),
      ('It follows a market rate plus the spread', 1, 'That is exactly the definition of an adjustable rate.'),
      ('If rates go up, the payment goes up', 1, "With a fixed rate the payment doesn't move: it only happens with the adjustable."),
      ('You already know today how much you will pay in 20 years', 0, 'Only the fixed rate gives you this certainty.'),
      ('If rates fall, you pay less', 1, 'The adjustable follows the market even when it falls.')]),
    LV('Find a payment that fits', 'A mortgage of €150,000. Move rate and term and see what happens to the payment and to total interest.', 'mutuo', dict(C=150000),
      [dict(id='tasso', label='Rate', min=2, max=6, step=0.25, start=5, unit='%', dec=2), dict(id='anni', label='Term', min=10, max=30, step=5, start=20, unit='anni')],
      [dict(label='Bring the payment to €800 or less', cond=[['rata', '<=', 800]], hint="Lengthening the term isn't enough: try lowering the rate too."),
       dict(label='Now also keep total interest under €80,000', cond=[['rata', '<=', 800], ['interessi', '<', 80000]], hint='More years means more interest: try lowering the rate further or shortening the term.')],
      'Lengthening the term lowers the payment, but raises total interest. To keep both low you need a lower rate: that is why it pays to compare several offers before signing.'),
    Q('You have an adjustable-rate mortgage and market rates go up. What happens to your payment?', ['It goes up', 'It goes down', 'It stays the same'], 0,
      'An adjustable rate follows the market: if rates go up, your payment **goes up** too. With a fixed rate it would have stayed the same.'),
  ], 'Fixed: a certain payment. Adjustable: a payment that follows market rates. The choice depends on how much room you have if the payment goes up.'),
  LF('basi-4-4', '!', 'When debt works against you', 7, [
    G("You paid for a sofa and a phone with a credit card: €2,000 of debt, at 18% a year. For 5 years you pay only the interest. How much have you paid in all at the end?",
      r"Each year the interest is \(2{,}000 \times 18\% = \text{€}360\). In 5 years that makes **€1,800**, and you still owe all the original €2,000.",
      lo=0, hi=3000, step=50, truth=1800, near=150),
    P("The debt that doesn't go down", r'''
Some credit cards let you pay back what you spend a little at a time. They are called **revolving** cards. It looks convenient, but the rate is often very high, and the minimum payment they ask for covers almost only the interest.

With €2,000 of debt at 18% a year the interest is €360 a year, that is €30 a month. If you pay €30 a month, everything you pay goes to the bank as interest and the debt stays put.

[fig]

The debt only goes down with what you pay **on top of** the interest.''',
      fig=F([('Paid in 5 years', '€1,800', [(1800, 'All interest', INT)]), ('Debt that remains', '€2,000', [(2000, 'Same as day one', CAP)])])),
    LV('Pay off the debt', "€2,000 of debt at 18% a year, that is 1.5% a month. Decide how much to pay each month.", 'carta', dict(debito=2000, tasso=18),
      [dict(id='rata', label='Monthly payment', min=30, max=200, step=10, start=30, unit='€')],
      [dict(label='Pay off the debt within 2 years', cond=[['mesi', '<=', 24]], hint='With €30 you pay only the interest. Go up until the time drops to 2 years.')],
      'With €30 a month you never finish. With €100 you pay it off in 2 years and pay about €396 in interest. The more you pay each month, the less the debt costs you.'),
    P('Which debt to pay off first', r'''
Money you use to reduce a debt stops costing you interest. It is like a safe investment that earns as much as the rate on the debt.

You have €1,000 free. See what happens in one year:

• in the savings account at 3% you earn €30;
• used to reduce the card at 18%, you save €180 of interest.

[fig]

That is why it usually pays to pay off the debts with the highest rate first.''',
      fig=F([('In the savings account at 3%', '€30', [(30, 'Interest earned', 'menta')]), ('Paying down debt at 18%', '€180', [(180, 'Interest saved', 'menta')])], cap='In one year, with the same €1,000.')),
    OR('You have some free money: in what order do you use it?', ['Emergency fund', 'Highest-rate debts', 'Investments'],
      after='It is a rule of thumb: first safety, then expensive debts, then the rest.'),
    N("You have a card debt at 18% a year and you reduce it by €500. How much interest do you save in a year?", 90, '€',
      r"\(500 \times 18\% =\) **€90** a year. In a savings account at 3% the same €500 would earn €15."),
    Q('You have €1,000 free, a card debt at 18% and a savings account that earns 3%. What is the best thing to do?', ['Put it in the savings account', 'It makes no difference', 'Pay down the card debt'], 2,
      'Paying down the debt saves you €180 of interest in a year, against the €30 you would earn in the savings account.'),
  ], 'A debt at 18% costs more than almost any investment earns. Paying it off is the safest return you have.'),
  LF('basi-4-5', '0%', 'Buying in installments', 7, [
    G('A €1,200 TV in 12 installments at zero interest. The contract has €30 of setup fees and €2 of fees on each installment. How much do you pay in all?',
      r"The rate really is zero: you pay no interest. But you pay €30 for setup and \(2 \times 12 = \text{€}24\) on the installments: in all **€1,254**. Those extra €54, over a year, make an APR of 8.75%. Zero rate means a zero nominal rate, not zero cost.",
      lo=1200, hi=1400, step=2, truth=1254, near=10),
    P('Where the cost hides', r'''
**In an installment purchase, the price of the loan isn't only in the interest.**

The **nominal interest rate** measures interest. The **APR** puts interest and fees together: it is the only number that tells you how much the loan really costs in a year.

Fees are usually found in three places.

• **Setup fees**, paid once at the start.
• **Collection fees** on each installment and, in Italy, the stamp duty on the contract.
• **Insurance** sold together with the loan. If it is optional you can refuse it. If it is mandatory to get the loan, its cost has to be inside the APR.

A reference point for telling whether an offer is expensive: in Italy, the Bank of Italy's survey of spring 2026 puts the average APR of loans to buy goods at 11.3%, and of personal loans at 12.1%.'''),
    LV('Zero rate, but not zero APR', 'A €1,200 purchase at zero interest. Move the fees and the number of installments.', 'rate', dict(prezzo=1200),
      [dict(id='pratica', label='Setup fees', min=0, max=100, step=10, start=30, unit='€'),
       dict(id='incasso', label='Fees per installment', min=0, max=5, step=0.5, start=2, unit='€', dec=2),
       dict(id='mesi', label='Number of installments', min=6, max=36, step=6, start=12, unit='')],
      [dict(label='Bring the APR under 5%', cond=[['taeg10', '<', 50]], hint='The rate is already zero: the APR only drops by taking out fees.'),
       dict(label='Now put back €30 of setup and €2 per installment, and go down to 6 installments', cond=[['pratica', '>=', 30], ['incasso', '>=', 2], ['mesi', '<=', 6]], hint='Put the fees back to the starting values, then shorten the plan.')],
      'With the same fees, over 6 installments the APR rises to almost 13%. Fixed costs weigh more on small, short loans: that is why, on an installment purchase, even small fees matter.'),
    P('Your rights when you sign', r'''
In Italy, an installment purchase is a credit contract, and the law gives you four rights that few people use.

• **Change your mind.** You have 14 days to leave the financing without saying why.
• **Pay off early.** You can repay everything early whenever you want, and the costs of the loan are reduced for the time you don't use.
• **Stop the installments if the goods don't arrive.** If the seller doesn't deliver, or delivers something different, and doesn't put it right after your reminder, you can also have the financing linked to the purchase dissolved.
• **Know beforehand.** Before you sign they must give you a sheet with the APR, the installment and the total to repay, the same for all finance companies: it is there so you can compare two offers.'''),
    P('What stays on record about you', r'''
In Italy, every time you apply for a loan, the application and the payments end up in **credit bureaus**, databases that finance companies check before they decide.

Both the good and the bad stay on record, for fixed periods:

| What | For how long |
|---|---|
| A loan application | 6 months |
| One or two late installments, then paid | 12 months |
| More than two late installments, then paid | 24 months |
| Installments never paid | 36 months |
| A loan repaid regularly | 60 months |

Two practical consequences. Even a small delay follows you for a year, and can cost you a mortgage. And applying for loans from many finance companies in the same month leaves a trace that doesn't help.

You can ask to see your data for free.'''),
    BK('Does it count in the APR?', ['Yes', 'No'], [
      ('The interest', 0, 'It is the first item of the cost.'),
      ('The setup fees', 0, 'They are a compulsory cost of the loan.'),
      ('The insurance the finance company requires', 0, "If they won't give you the loan without it, its cost counts in the APR."),
      ('The collection fees on each installment', 0, 'You pay them with each installment: they are part of the cost.'),
      ('The optional insurance you chose yourself', 1, "It isn't necessary to get the loan: it stays out of the APR. That is why it has to be looked at separately."),
      ('The late fee for an installment paid late', 1, 'The APR is calculated as if you always paid on time.')],
      after='The APR counts everything you have to pay no matter what. What you add yourself, or what comes from a delay, stays out.'),
    Q('A loan has a nominal rate of 0% and an APR of 9%. What does that mean?', ['That it costs nothing', 'That there is no interest, but there are fees', "That there's an error in the contract"], 1,
      'The nominal rate measures only interest, the APR fees too. With a zero nominal rate and an APR of 9% there is no interest, but there are fees: they are the cost of the loan.'),
    Q('In Italy, you signed a financing agreement for a sofa yesterday and have changed your mind. What can you do?', ['Leave the contract: you have 14 days', 'Nothing: the signature is final', 'Leave only by paying a penalty'], 0,
      'On credit contracts you have 14 days to withdraw, without having to give any explanation.'),
    Q('In Italy, you paid two installments late, then caught up. For how long does the record stay in the credit databases?', ['It is deleted right away', '6 months', '12 months'], 2,
      "A delay of one or two installments, then paid, stays visible for 12 months from the moment you catch up. Beyond two installments the months become 24."),
  ], 'Zero rate means a zero nominal rate: the cost is in the fees, and the APR measures it. In Italy you have 14 days to change your mind, and delays stay on record for at least a year.'),
  LF('basi-4-6', '3×', 'Buy now, pay later', 6, [
    G('You pay for a €300 purchase in three interest-free installments, with a buy now, pay later service. Who pays for the cost of the service?',
      "The **store** pays it, with a fee on each sale. It is worth it to them, because people who can split a payment buy more often and spend more. That is the point to remember: the service is free for you because it works by getting you to buy.",
      options=['Nobody: it is free for everyone', 'The store, with a fee', 'You, with a higher price'], ans=1),
    P('How it works', r'''
**Buy now, pay later is a small interest-free loan, granted in a few seconds at the checkout.**

Usually the price is split into three or four installments: the first right away, the others each month, taken automatically from your card.

If you pay on time it costs nothing. That is why it feels different from a debt, but it is a debt in every respect.

There are three risks, and none is written in large letters.

• **You buy more.** A €300 expense that becomes €100 feels smaller.
• **The installments add up.** Three purchases with three different services are three installment plans, and nobody shows you the monthly total.
• **Delay costs money.** If there is no money on the card when the installment comes due, late fees can apply, and the delay can be reported.'''),
    N(r'''
In October Elena makes three purchases with buy now, pay later, each in 3 equal installments:

• shoes for €240
• a jacket for €180
• headphones for €90

How much will be taken from her card in all in November?''', 170, '€',
      r'Each purchase divided by three: \(80 + 60 + 30 =\) **€170**. The same again in December. They are small installments, but they arrive together and from three different services.'),
    P('In Italy, from November 20, 2026 it is credit in every respect', r'''
For years these payments stayed outside the rules for loans. With the new European rules, in force in Italy from November 20, 2026, that is no longer the case.

When the deferral is granted by a company other than the store, the consumer credit rules apply:

• whoever grants it must first **check that you can repay**, also looking at the debts you already have;
• it must tell you clearly the costs and the total;
• your delays can end up in the credit databases, where the bank you ask for a mortgage will also see them.

Only the deferral that the seller grants you out of its own pocket, **free of charge** and for **no more than 50 days**, stays outside.'''),
    BK('Do the credit rules apply?', ['Yes, it is credit', 'No, it stays outside'], [
      ('Three interest-free installments with a payments company', 0, 'The deferral is granted not by the store but by a third company: it is credit.'),
      ('The store lets you pay at the end of the month, at no cost', 1, 'It is a free deferral from the seller, within 50 days.'),
      ('Six installments over six months offered by the store, free', 0, 'It goes beyond 50 days: the credit rules apply.'),
      ('The store gives you 30 days, with a €3 fee', 0, 'It has a cost: it is no longer a free deferral.'),
      ('You pay the gym at the end of each month', 1, 'You pay for a service after using it, with no extra cost.')],
      after='Only what is free, short and granted by the seller stays outside the rules.'),
    Q('Why should buy now, pay later be treated as a debt, even if it has no interest?', ['Because it always has hidden fees', 'Because it commits money you still have to earn', 'Because it raises the price'], 1,
      'If you pay on time it costs nothing. But the installments of the coming months are money already promised: they add up with each other and with the rest of your fixed expenses.'),
    Q("In Italy, from November 20, 2026, what must the company that grants you three installments on a purchase do?", ['Check beforehand that you can repay', 'Ask you for a guarantee on your home', 'Nothing different from before'], 0,
      'Under the new rules it is consumer credit: whoever grants it must first assess whether you can repay, also considering your other debts.'),
    Q('You miss an installment on a purchase paid in three parts. Besides the late fee, what do you risk?', ['Nothing: the amounts are small', 'That they take back the purchase', 'That the delay stays on record in the credit databases'], 2,
      'Even a small debt, if paid late, can end up in the databases that banks check. You find it again when you ask for a loan or a mortgage.'),
  ], 'Buy now, pay later is a debt without interest: free if you pay on time, but the installments add up. In Italy, from November 20, 2026, it follows the credit rules.'),
])
