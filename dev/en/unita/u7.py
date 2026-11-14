# Unit 7, "Entrate e uscite": lessons basi-7-1 to basi-7-4, all label A. basi-7-2 was the worked example.
U7 = dict(id='basi-u7', sid='basi-budget', name='Income and spending', lessons=[
  LF('basi-7-1', '+/−', 'Where your money goes', 6, [
    G("On workdays Giulia has a coffee and a sandwich at the café: €6 a day, for about 220 days a year. How much does she spend in a year?",
      r"€6 for 220 days: \(6 \times 220 =\) **€1,320**, almost a month of her salary, which is €1,600. It isn't a call to give up coffee. It is the reason it pays to know where your money goes: the small amounts that repeat are the ones you notice least.",
      lo=0, hi=3000, step=20, truth=1320, near=150),
    P('Income, expenses, balance', r'''
**To decide where to send your money, you first need to know where it goes now.**

The money that comes to you in a month is called **income**: the salary you receive in your account, a pension, rent you collect.

The money that goes out is called **expenses**: everything you pay, from rent to coffee.

The difference between the two is the month's **balance**:

$$\text{balance} = \text{income} - \text{expenses}$$

Giulia earns €1,600 a month and spends €1,600: her balance is zero. She has no debts, but she isn't setting anything aside, and she couldn't say where it all went.'''),
    P('Fixed and variable expenses', r'''
Expenses are not all the same. It helps to split them into two groups.

**Fixed expenses** come back every month for the same amount, or nearly, and you don't decide them each time: rent, bills, the phone plan, the car payment.

**Variable expenses** change from one month to the next and depend on what you do: grocery shopping, meals out, clothes, gas.

Here is Giulia's month:

[fig]

Fixed expenses rarely change, but when you manage it the saving repeats every month without effort. Variable ones can be changed right away, but you have to keep an eye on them every time.''',
      fig=F([("Giulia's expenses", '€1,600', [(900, 'Fixed expenses', CAP, '€900'), (700, 'Variable expenses', 'giallo', '€700')])])),
    BK('Fixed or variable expense?', ['Fixed expense', 'Variable expense'], [
      ('Rent', 0, "It is the same amount every month and you don't decide it each time."),
      ('Dinner at a restaurant', 1, 'It depends on how often you go out: it changes from one month to the next.'),
      ('Phone plan', 0, 'It renews every month for the same amount.'),
      ('Clothes', 1, 'You buy them when you decide, and the amount changes every time.'),
      ('Car payment', 0, 'It is set by the contract: the same every month.'),
      ('Gas', 1, 'It depends on how much you drive.'),
      ('Gym membership', 0, 'You pay it every month, whether you go or not.')]),
    N(r'''
Luca's month:

• salary: €1,900
• fixed expenses: €1,050
• variable expenses: €620

What is his balance for the month?''', 230, '€',
      r'Expenses: \(1{,}050 + 620 = \text{€}1{,}670\). Balance: \(1{,}900 - 1{,}670 =\) **€230**. That is what Luca can set aside.'),
    P('What the balance tells you', r'''
The balance is the first number to look at.

• If it is **positive**, something is left over: it is the basis of your **savings**.
• If it is **zero**, you get to the end of the month with nothing to spare, and one unexpected expense is enough to push you under.
• If it is **negative**, you are spending more than you earn: you pay the difference from earlier savings, or with debt.

To learn your real balance, one month of attention is enough: write down every expense, even small ones, then split them into fixed and variable.

Back to Giulia. Coffee and a sandwich cost her €1,320 a year, that is €110 a month. If she skipped the café on half the days, she would spend €55 less a month: her balance would go from zero to **+€55**, without changing salary.'''),
    Q('In a month €2,000 comes in and €2,150 goes out. What happened?', ['You saved €150', 'The balance is zero', 'You spent €150 more than you earned'], 2,
      r'\(2{,}000 - 2{,}150 =\) **−€150**. The balance is negative: you took that €150 from earlier savings, or from a debt.'),
    Q('Which of these is a fixed expense?', ['Grocery shopping', 'The home internet subscription', 'A birthday present'], 1,
      "The internet subscription comes back every month for the same amount: it is a **fixed expense**. Grocery shopping and gifts change each time: they are variable expenses."),
  ], r'\(\text{Balance} = \text{income} - \text{expenses}\). Fixed expenses come back the same every month, variable ones depend on what you do.'),
  LF('basi-7-2', 'BUD', 'A budget in three parts', 7, [
    G("A simple rule says to split your salary into three parts: half for what you need, 30% for what you enjoy, 20% to set aside. On €1,600 a month, how much gets set aside each month?",
      "20% of €1,600 is **€320** a month, or €3,840 in a year. Let's see how to build a plan like this, and what to do when the numbers don't add up.",
      lo=0, hi=800, step=10, truth=320, near=30),
    P('A plan for your money', r'''
**A budget is a plan: you decide in advance where the month's money will go, instead of finding out at the end.**

A simple way to do it is the **50/30/20** rule. Split your income into three parts:

• 50% for **needs**: what you can't do without, such as housing, bills, food, transport to work;
• 30% for **wants**: what makes life more enjoyable but could be cut back, such as eating out, trips, subscriptions;
• 20% for **savings**.

With Giulia's €1,600:

[fig]

It isn't a law. It's a starting point for checking whether your month is in balance.''',
      fig=F([("Giulia's salary", '€1,600', [(800, 'Needs', CAP, '€800'), (480, 'Wants', 'giallo', '€480'), (320, 'Savings', OK, '€320')])])),
    BK('Need or want?', ['Need', 'Want'], [
      ('Rent', 0, 'You need a roof over your head: it is a need.'),
      ('Electricity bill', 0, "A home can't do without it: it is a need."),
      ('Movie streaming subscription', 1, 'It is nice to have, but it can be cut if necessary.'),
      ('Groceries', 0, 'Eating is a need. A restaurant, on the other hand, is a want.'),
      ('Weekend at the beach', 1, 'It is a pleasure: it can be postponed or scaled down.'),
      ('Monthly train pass to get to work', 0, 'You need it to earn your salary.'),
      ('New phone, while the old one still works', 1, 'As long as the old one works, replacing it is a choice.')],
      after='The line is not always sharp: groceries are a need, but wants end up in the cart too. What matters is being honest with yourself.'),
    P("When the numbers don't add up", r'''
In real life the three parts rarely come out right the first time. Giulia's actual month looks like this:

[fig]

Needs take €950 instead of €800, wants €600 instead of €480. That leaves €50 for savings.

She has two options, and she can use both:

• cut **wants**, which is the quickest way;
• cut **needs**, which is slower but lasts: a cheaper home, a cheaper electricity or phone plan.

There is also a trick that works: set the savings aside **as soon as your salary arrives**, with an automatic transfer, and live on what is left. That way your savings don't depend on how much is left over at the end of the month.''',
      fig=F([("Giulia's actual month", '€1,600', [(950, 'Needs', CAP, '€950'), (600, 'Wants', 'giallo', '€600'), (50, 'Savings', OK, '€50')])])),
    LV('Bring the month back into balance', 'Giulia earns €1,600 a month. Move needs and wants and watch how much is left to set aside.', 'budget', dict(entrate=1600),
      [dict(id='bisogni', label='Needs', min=700, max=1100, step=10, start=950, unit='€'), dict(id='desideri', label='Wants', min=100, max=700, step=10, start=600, unit='€')],
      [dict(label='Bring savings to at least €320 a month', cond=[['risparmio', '>=', 320]], hint='The quickest way is to lower wants.'),
       dict(label='Now reach €320 while leaving at least €450 for wants', cond=[['risparmio', '>=', 320], ['desideri', '>=', 450]], hint="If wants don't come down, needs have to: try lowering them.")],
      'Cutting only wants works, but leaves little room to live. Lowering a fixed expense as well, such as rent or phone plans, frees up money every month without constant sacrifices.'),
    N('Marco earns €2,200 a month and wants to follow the 50/30/20 rule. What is the most he can put toward wants?', 660, '€',
      r'30% of €2,200 is \(2{,}200 \times 0.30 =\) **€660**. Needs get €1,100 and savings €440.'),
    Q('You earn €1,800 a month. With the 50/30/20 rule, how much do you set aside?', ['€180', '€360', '€540'], 1,
      r'20% of €1,800 is \(1{,}800 \times 0.20 =\) **€360**. €540 is 30%, the share for wants.'),
    Q('Why is it better to set your savings aside as soon as your salary arrives?', ["Because then they don't depend on how much is left at the end of the month", 'Because the bank pays more interest', 'Because fixed expenses go down'], 0,
      'If you wait until the end of the month you only save what is left over, and often nothing is. By setting it aside straight away, saving becomes the first expense of the month, not the last.'),
  ], 'A budget decides in advance where the money goes. Starting rule: 50% needs, 30% wants, 20% savings, set aside first.'),
  LF('basi-7-3', 'SOS', 'The emergency fund', 6, [
    G('Paolo spends €1,400 a month and wants to set aside a reserve that covers 3 months of expenses, for emergencies. He saves €150 a month. How many months does he need to get there?',
      r"He needs \(1{,}400 \times 3 = \text{€}4{,}200\). At €150 a month: \(\dfrac{4{,}200}{150} =\) **28 months**, more than two years. It sounds like a lot, but every month that passes Paolo is a little safer. That reserve has a name: emergency fund.",
      lo=0, hi=60, step=1, truth=28, near=3, unit='mesi'),
    P('What it is for', r'''
**The emergency fund is a sum kept aside only for the unexpected.**

Unexpected expenses aren't rare, they are just hard to predict: the furnace that breaks, the car at the mechanic, a trip to the dentist, a period without work.

Without a fund you have only two ways out. You can take out a loan, which costs interest. Or you can sell what you own in a hurry, maybe at the wrong moment.

With a fund the unexpected stays an annoyance, not a debt.

That is why the **emergency fund** comes before investments: it is what lets you leave them to work in peace.'''),
    P('How big it should be', r'''
The size is not the same amount for everyone: it depends on how much you spend.

The most widely used rule is to keep **3 to 6 months of expenses** aside. Expenses, not salary: what counts is how much you need to live.

Paolo spends €1,400 a month:

[fig]

When is the minimum enough, and when do you need more?

• Closer to **3 months** if you have a steady job and nobody depends on you.
• Closer to **6 months**, or even more, if your income is irregular, if you are self-employed or if you have a family to support.''',
      fig=F([('3 months of expenses', '€4,200', [(4200, 'Minimum fund', OK)]), ('6 months of expenses', '€8,400', [(8400, 'More cautious fund', CAP)])])),
    N('Chiara spends €1,650 a month and wants an emergency fund that covers 4 months. How much does she need to set aside?', 6600, '€',
      r'\(1{,}650 \times 4 =\) **€6,600**.'),
    P('Where to keep it', r'''
The emergency fund has one job: to be there when you need it. It needs two qualities.

• It must be **liquid**: you must be able to use it within a few days, without penalties.
• It must be **stable**: it must not be able to drop in value just when you need it.

That is why it doesn't go into stocks, which can lose a lot in a few months, nor into a locked investment you can't touch.

It sits well in a checking account separate from your everyday one, or in a **savings account** you can withdraw from whenever you want.

It will earn little, and that is as it should be: it isn't there to make money, it is there to protect you. And after you have used it, the first thing to do is rebuild it.'''),
    BK('Is it an emergency fund expense?', ['Yes, it is unexpected', 'No, it can be planned'], [
      ('Your car breaks down and you need it for work', 0, "It is sudden and can't be put off: it is exactly the case for the fund."),
      ('Summer vacation', 1, 'You already know it is coming: you set a little aside each month.'),
      ("Dental treatment that can't wait", 0, "It is urgent and it wasn't planned."),
      ('Christmas presents', 1, "Christmas comes every year on the same date: it isn't unexpected."),
      ('Two months without a salary', 0, 'It is the most important case: the fund pays your expenses until your income returns.'),
      ('The brand-new phone that just came out', 1, 'It is a want: you buy it with the money for wants, not with the fund.'),
      ('The car insurance, which renews every year', 1, 'It is an expense you already know about: it goes in the budget.')],
      after='The fund is for what is urgent, necessary and unexpected all at once. Expenses you already know about go in the budget.'),
    Q('Dario spends €1,200 a month, has a steady job and nobody depends on him. What is a reasonable size for his emergency fund?', ['€1,200', '€3,600', '€36,000'], 1,
      r'With a steady job the minimum of the rule can be enough: 3 months of expenses, that is \(1{,}200 \times 3 =\) **€3,600**. A single month is too little. €36,000 is two and a half years of expenses: too much money sitting idle.'),
    Q('Where does it make the most sense to keep the emergency fund?', ['In stocks, so it grows', 'In an investment locked for 5 years', 'In an account you can withdraw from right away'], 2,
      'It has to be liquid and stable: an account you can withdraw from whenever you want. Stocks can fall just when you need the money, and a 5-year lock blocks it.'),
  ], 'Emergency fund: 3 to 6 months of expenses, in a liquid and stable account. It comes before investments.'),
  LF('basi-7-4', 'META', 'A goal, an amount, a date', 7, [
    G("Elena wants to buy a used car in 2 years: she needs €6,000. She starts from zero and keeps the money in an account that earns nothing. How much does she need to set aside each month?",
      r'€6,000 in 24 months: \(\dfrac{6{,}000}{24} =\) **€250** a month. A goal becomes a plan when it has an amount and a date.',
      lo=0, hi=600, step=10, truth=250, near=20),
    P('From wish to plan', r'''
**A vague goal stays a wish. With an amount and a date it becomes a plan.**

‘I'd like to put something aside for the car’ doesn't tell you what to do tomorrow. ‘I need €6,000 in 24 months’ does: a division is all it takes.

$$\text{monthly saving} = \frac{\text{amount}}{\text{months}}$$

For Elena: \(\dfrac{6{,}000}{24} =\) **€250** a month.

[fig]

If €250 a month is too much, there are only three levers: a lower amount, a later date, or a revised budget that frees up more money each month.''',
      fig=F([("Elena's plan", '€6,000', [(3000, 'First year', OK, '€3,000'), (3000, 'Second year', CAP, '€3,000')])], cap='€250 a month for 24 months.')),
    LV("Move the date or the amount", "Elena needs €6,000 for the car. Move how much she sets aside each month and for how many months.", 'obiettivo', dict(cifra=6000),
      [dict(id='rata', label='Monthly saving', min=50, max=500, step=10, start=100, unit='€'), dict(id='mesi', label='Duration', min=6, max=48, step=1, start=12, unit='mesi')],
      [dict(label='Reach the €6,000 she needs', cond=[['messo', '>=', 6000]], hint='You can raise the monthly saving, lengthen the duration, or both.'),
       dict(label='Now get there setting aside at most €150 a month', cond=[['messo', '>=', 6000], ['rata', '<=', 150]], hint='With €150 a month you need more time: lengthen the duration.')],
      "With €150 a month it takes 40 months instead of 24. The less you set aside each month, the further away the date moves: deciding which of the two matters more is up to you."),
    N('You want to take a trip in 10 months and you need €1,800. How much do you need to set aside each month?', 180, '€',
      r'\(\dfrac{1{,}800}{10} =\) **€180** a month.'),
    P('Near goals and distant goals', r'''
Not all goals are handled the same way. What counts is how much time is left.

• **Within 2 or 3 years**, like a car or a trip: the money has to stay safe, in an account. There is no time to recover from a drop.
• **Many years away**, like retirement: the money can be invested, because time works for you.

On long horizons part of the final amount isn't paid in by you: it is produced by returns, thanks to compound interest.

Here is €250 a month for 20 years, invested at 4% a year. Assumptions: constant return, payments at the end of each month.

[fig]

You paid in €60,000, but you end up with about €91,000. In reality the return changes every year, and it can be negative too: that is why you only invest money you won't need soon.''',
      fig=F([('After 20 years', '€90,960', [(60000, 'Paid in by you', OK, '€60,000'), (30960, 'Returns', CAP, '€30,960')])])),
    M(('Income', 'The money that comes to you in a month'), ('Balance', 'Income minus expenses'), ('Budget', 'The plan for how you will use your money'), ('Emergency fund', 'Money kept aside for the unexpected')),
    Q('You need €3,000 in 15 months. How much do you need to set aside each month, not counting interest?', ['€150', '€200', '€250'], 1,
      r'\(\dfrac{3{,}000}{15} =\) **€200** a month.'),
    Q("You have two goals: a car in 18 months and retirement in 30 years. Which money makes sense to invest in instruments that fluctuate?", ['The money for the car', 'Both in the same way', 'The money for retirement'], 2,
      "With 30 years ahead there is time to recover from drops and to let compound interest work. The money for the car is needed in 18 months: it has to stay safe."),
  ], 'A goal has an amount and a date: amount divided by months gives the monthly saving. Near: keep the money safe. Distant: you can invest.'),
])
