# Unit 8, "Proteggersi": lessons basi-8-1, 8-2, 8-3 (label A) and basi-8-4, 8-5, 8-6 (label B). basi-8-7 (label C) is not translated.
U8 = dict(id='basi-u8', sid='basi-protezione', name='Protecting yourself', lessons=[
# ---- basi-8-1 (A)
  LF('basi-8-1', 'AS', 'How insurance works', 6, [
    G("A town has 1,000 families. Every year, on average, 2 houses suffer a fire that causes €100,000 of damage. If all the families split the cost of the damage, how much does each one pay in a year?",
      r"The year's damage is \(2 \times 100{,}000 = \text{€}200{,}000\). Divided among 1,000 families, that is **€200** each. With €200 a year nobody risks losing €100,000: that is the idea behind every insurance policy.",
      lo=0, hi=1000, step=10, truth=200, near=30),
    P('Many pay a little, a few receive a lot', r'''
**Insuring yourself means paying a small, certain amount so you don't risk a big, uncertain loss.**

A fire at home is rare, but if it happens to you it costs an amount you couldn't pay on your own. Nobody knows who it will hit. But we do know, quite precisely, how many there will be in all: out of 1,000 houses, about 2 a year.

An **insurance** company collects an amount from everyone every year, the **premium**, and with that money pays the damage of those who were hit. The sum that whoever suffered the damage receives is called the **payout**.

[fig]

The premium is higher than the simple division of the damage, because the company has to cover its costs and make a profit.''',
      fig=F([("Each family's premium", '€260', [(200, 'Expected damage', CAP, '€200'), (60, "The company's costs and profit", INT, '€60')])], cap='An example: real figures change from one policy to another.')),
    P('The contract is called a policy', r'''
The contract you sign with the company is called a **policy**. It says:

• what is covered: for example fire and flooding, but not theft;
• how much you pay: the premium, usually once a year;
• the most you receive if the damage happens;
• what is left out, that is the **exclusions**: the cases where the company doesn't pay.

The exclusions are the part to read most carefully. A policy can also cost little because it covers little.

If the year goes by without damage, the premium doesn't come back. It is not money thrown away: you bought a year of protection, and with your premium the company paid whoever did have damage.'''),
    N("An insurance company covers 5,000 cars. Every year, on average, 100 of them have an accident that causes €3,000 of damage. How much should each car pay, just to cover the damage?", 60, '€',
      r"The year's damage: \(100 \times 3{,}000 = \text{€}300{,}000\). Divided among 5,000 cars: \(\dfrac{300{,}000}{5{,}000} =\) **€60**. The real premium will be higher, because it includes the company's costs and profit."),
    M(('Premium', 'What you pay the company'), ('Payout', 'What you receive if you suffer the damage'), ('Policy', 'The insurance contract'), ('Exclusions', "The cases where the company doesn't pay")),
    Q("You pay a €300 premium to insure your house and nothing happens during the year. What happens to the €300?", ['It is refunded to you', "It counts as next year's premium", 'It stays with the company: you paid for a year of protection'], 2,
      "The premium pays for the year's protection, whether you have damage or not. With the premiums of those who had no damage, the company pays those who did."),
    Q("Why is the premium higher than the average damage divided among the insured?", ["Because it includes the company's costs and profit", 'Because damage is always more than expected', 'Because the government sets it'], 0,
      "Besides paying for damage, the company has offices, staff and a profit to earn. In the lesson's example: €200 of expected damage plus €60 of costs and profit."),
  ], "With insurance, many people pay a small, certain premium, and whoever suffers damage receives the payout. Always read what is excluded."),
# ---- basi-8-2 (A)
  LF('basi-8-2', 'FR', 'Deductible and coverage limit', 7, [
    G("Anna insured her house. The contract says she pays the first €500 of every damage. A pipe breaks and the water causes €3,000 of damage. How much does the insurance reimburse her?",
      r"The first €500 stay with Anna: the insurer pays \(3{,}000 - 500 =\) **€2,500**. That part you pay yourself is called the deductible. Together with the coverage limit, which we will see shortly, it decides what a policy is really worth.",
      lo=0, hi=3000, step=50, truth=2500, near=100),
    P('The part you pay', r'''
**Almost no policy pays the whole damage: part of it stays with you.**

The **deductible** is a fixed amount that stays with you for every damage. With a €500 deductible:

[fig]

What is it for? It removes small damages, which would cost the company more time than money. In exchange the premium goes down: the higher the deductible, the less the policy costs.

Sometimes, in place of the deductible, there is a **percentage deductible**: it works the same way, but it is a percentage of the damage instead of a fixed amount.''',
      fig=F([('Damage of €3,000', None, [(500, 'Deductible: you pay', INT, '€500'), (2500, 'The insurer pays', CAP, '€2,500')]),
             ('Damage of €400', None, [(400, 'Smaller than the deductible: you pay it all', INT, '€400')])])),
    N('A policy with a €250 deductible. You have damage of €1,900. How much does the company reimburse you?', 1650, '€',
      r'\(1{,}900 - 250 =\) **€1,650**. The first €250 stay with you.'),
    P('The ceiling: the coverage limit', r'''
At the other extreme is the **coverage limit**: the highest amount the company pays, whatever the damage.

Anna's policy has a coverage limit of €50,000. If a fire caused €80,000 of damage, the company would stop at €50,000.

[fig]

That is why the coverage limit should be chosen by looking at the worst damage that can happen, not the most likely one. A policy with a low coverage limit costs less, but leaves you uncovered in exactly the case you insured against.

In short: small damages you pay yourself because of the deductible. Of enormous ones you pay the part above the coverage limit. In between, the company pays.''',
      fig=F([('Fire damage of €80,000', None, [(50000, 'The insurer pays, up to the coverage limit', CAP, '€50,000'), (30000, 'Stays with you', INT, '€30,000')])])),
    N('A policy with a €100,000 coverage limit and no deductible. The damage is €130,000. How much stays with you?', 30000, '€',
      r'The company pays up to the coverage limit: €100,000. You are left with \(130{,}000 - 100{,}000 =\) **€30,000**.'),
    BK('€500 deductible, €50,000 coverage limit: who pays?', ['You pay', 'The insurer pays'], [
      ('A damage of €300', 0, "It is smaller than the deductible: it all stays with you."),
      ('The first €500 of a €4,000 damage', 0, "That is the deductible."),
      ('The other €3,500 of that damage', 1, 'With the deductible removed, the company pays the rest.'),
      ('The part above €50,000 of an enormous damage', 0, "Above the coverage limit the company doesn't pay."),
      ('A €20,000 damage, after the deductible', 1, 'It falls between the deductible and the coverage limit: the company pays.')]),
    Q('All else equal, what happens to the premium if you choose a higher deductible?', ['It goes down', 'It goes up', "It doesn't change"], 0,
      'With a higher deductible you take on a bigger share of the damage. The company risks less and asks for a **lower** premium.'),
    Q('You have a policy with a €1,000 deductible and suffer €800 of damage. How much do you receive?', ['€800', '€200', 'Nothing'], 2,
      'The damage is smaller than the deductible: it all stays with you. The company starts paying only above €1,000.'),
  ], "Deductible: the part of every damage you pay. Coverage limit: the ceiling above which the company doesn't pay. Together they tell you what a policy is worth."),
# ---- basi-8-3 (A)
  LF('basi-8-3', 'RC', 'What to really insure', 6, [
    G("You have €400 a year to spend on insurance. Which of these risks makes the most sense to cover first?",
      "You insure first what would ruin you, not what would only annoy you. A broken screen is paid for with the emergency fund. Serious harm done to another person can cost more than you earn in many years.",
      options=['The phone screen that breaks', 'Serious harm done to another person', 'A flight delay'], ans=1),
    P('Big and rare, small and frequent', r'''
**The right question is not how likely it is, but: what happens to me if it happens?**

Every risk falls into one of these two boxes.

• **Small damages**, even if frequent: the broken phone, the washing machine to replace, a fine. They annoy you, but you can pay them with the budget or the emergency fund. Insuring them is rarely worth it: on average the premiums you pay exceed the payouts you receive, and you could have absorbed that damage yourself.
• **Big damages**, even if rare: the house destroyed, serious harm done to another person, an illness that keeps you from working for a long time. You can't pay them on your own. That is what insurance exists for.

[fig]

The emergency fund and insurance work together: the first covers small damages, the second those that the fund could never cover.''',
      fig=F([('Phone screen', '€200', [(200, 'The emergency fund covers it', OK)]), ('Serious harm to another person', '€300,000', [(300000, 'You need insurance', CAP)])],
            cap="Example figures. The short bar is already longer than the true one: to scale it wouldn't be visible.")),
    P('Damage done to others', r'''
There is a risk many people forget: causing damage to someone else.

If because of you a person gets hurt or something breaks, the law obliges you to pay compensation. This obligation is called **liability**, and the insurance that covers it is liability insurance.

For drivers it is so important that the law makes it mandatory almost everywhere: without **auto liability insurance** you can't drive. A serious accident can cost a six-figure sum, and without a policy you would have to pay it yourself.

It exists outside the car too. A liability policy for everyday life covers, for example, the flowerpot that falls from your balcony or the damage done while riding a bicycle. It usually costs little, because these cases are rare, but it covers very high amounts.'''),
    BK('Insurance or emergency fund?', ['Insurance', 'Emergency fund'], [
      ('A fire in your home', 0, "It is an enormous damage, which you couldn't pay on your own."),
      ('The washing machine to replace', 1, "It costs a few hundred: that is the emergency fund's job."),
      ('Serious harm done to another person', 0, 'It can cost very high amounts: you need liability insurance.'),
      ('The broken phone screen', 1, 'It is a small expense: you pay it with the money set aside.'),
      ('An illness that keeps you from working for years', 0, 'Losing income for a long time is one of the biggest risks.'),
      ('A flat tire', 1, 'It is a nuisance that costs very little.')]),
    OR('What comes first?', ['Insurance required by law', 'The risks that would ruin you', 'Small damages, if you really want'],
      x='Tap the items from the most important to the least important.',
      after="First what the law requires, then what you could never pay on your own. Small damages come last, and it is often better to leave them to the emergency fund."),
    Q('Which risk makes the most sense to insure?', ['A rare but enormous damage', 'A frequent but small damage', 'A small and rare damage'], 0,
      "Insurance is for the losses you couldn't bear on your own. Small damages are paid with the emergency fund."),
    Q('Why is it usually not worth insuring a €150 item?', ['Because you can bear that loss yourself, and on average premiums exceed payouts', 'Because it is forbidden', 'Because companies never pay'], 0,
      "A €150 loss annoys you but doesn't put you in difficulty. And since the premium includes the company's costs and profit, on average you pay more than you receive."),
  ], "You insure what would ruin you, not what annoys you. Small damages are covered by the emergency fund."),
# ---- basi-8-4 (B)
  LF('basi-8-4', '!!', 'Spotting a scam', 7, [
    G("You are offered an investment that pays 10% a month, guaranteed. If it were true, how much would €1,000 become after 5 years?",
      r'10% a month for 60 months gives \(1{,}000 \times 1.10^{60}\), which is about **€304,000**. No real business grows like that, and if one existed it would not need your money. A return that high, and on top of that guaranteed, is the first sign of a scam.',
      options=['About €6,000', 'About €60,000', 'More than €300,000'], ans=2),
    P("High and guaranteed don't go together", r'''
**Whoever promises you high, safe gains is hiding something from you.**

Return and risk go together. A savings account pays a few points a year precisely because the risk is low. To earn more you have to accept that things can go wrong.

That is why two words never go together: **high** and **guaranteed**.

[fig]

Whoever offers 10% a month is offering, in a single month, more than triple what a prudent investment returns in a whole year. If it were true, banks would be lining up to lend them money at much less.''',
      fig=F([('A savings account, in one year', '3%', [(3, 'Return', OK)]), ('The offer, in one month', '10%', [(10, 'Promised return', 'rosa')])], cap='The 3% is an example: a savings account returns a few points a year.')),
    P('How a Ponzi scheme works', r'''
The most common scam has a name: the **Ponzi scheme**. There is no investment at all. The gains paid to the first arrivals are the money paid in by the last.

Here is how it runs, with the promised 10% a month.

• 100 people pay in €1,000 each. There is €100,000 in the pot.
• Every month the scammer pays 10%, that is €10,000. The money comes out of the pot.
• The first ones are paid on time, they trust it and bring friends. The new money covers the payments.
• When new arrivals slow down, the pot empties. The payments stop and the principal is gone.

[fig]

Whoever gets in first sometimes really does earn, and that is what makes the scheme credible. But the money they collect is what was lost by those who came after.''',
      fig=F([('Paid in by 100 people', '€100,000', [(100000, 'Money in the pot', CAP)]), ('Paid out as gains over 10 months', '€100,000', [(100000, 'The same money, returned in pieces', INT)])],
            cap='With no new arrivals the pot lasts 10 months. Then nothing is left.')),
    N('A scheme promises 5% a month. 200 people have joined, with €2,000 each. How much must the scammer pay each month to keep the promise?', 20000, '€',
      r'There is \(200 \times 2{,}000 = \text{€}400{,}000\) in the pot. 5% of €400,000 is **€20,000** a month. No investment produces that: it comes out of the pot, that is, out of the money of those who paid in.'),
    P('The signs to recognize', r'''
Scams change shape, but the signs are almost always the same.

• **High, guaranteed returns**: it is the clearest sign.
• **Hurry**: the offer expires today, spots are running out. It is there to stop you from thinking.
• **Lack of clarity**: it is not clear where the gains come from, and questions get vague answers.
• **Rewards for bringing friends**: the new money is used to pay the old.
• **No authorization**: to collect savings you need an authorization. In Italy the lists of who is authorized are public, on the websites of Consob and the Bank of Italy.

Before sending any money, do three things: check those lists, ask for everything in writing and take a few days. A serious offer will still be there in a week.'''),
    BK('Warning sign or normal?', ['Warning sign', 'Normal'], [
      ('A guaranteed return of 5% a month', 0, "High and guaranteed together doesn't exist."),
      ('They tell you the value can also go down', 1, "It is what a serious operator has to tell you: every investment carries a risk."),
      ('The offer is only valid if you sign today', 0, 'The hurry is there to stop you from thinking.'),
      ('They hand you a document with costs and risks', 1, 'Putting everything in writing is a sign of seriousness.'),
      ('You earn more if you bring other investors', 0, "It is the mechanism that keeps a Ponzi scheme standing."),
      ('Whoever is offering is on the list of authorized operators', 1, 'It is the first check to make, and here it went well.'),
      ("They don't explain where the gains come from", 0, "If you don't understand how money is made, don't invest.")]),
    Q('In a Ponzi scheme, where do the gains paid to the first investors come from?', ['From the money paid in by those who join later', 'From the profits of a real investment', 'From the central bank'], 0,
      "There is no investment at all: the first ones' gains are the **money paid in by the last**. That is why the scheme holds up only as long as new people keep arriving."),
    Q('An acquaintance offers you a safe investment at 4% a month and asks you to decide by tonight. What do you do?', ['I pay in right away, before the spots run out', 'I pay in only a small amount, to try', 'I pay in nothing and check whether the person offering it is authorized'], 2,
      'High return, guarantee and hurry are three warning signs together. Even a small amount risks being lost, and the first on-time payments are there precisely to get you to pay in more.'),
  ], "A high, guaranteed return doesn't exist. Distrust hurry, ask where the gains come from and check that whoever is offering is authorized."),
# ---- basi-8-5 (B)
  LF('basi-8-5', 'SMS', 'Phishing and identity theft', 7, [
    G('A text message arrives in the same conversation where your bank sends you your codes: ‘Unusual account access. Verify now at this link.’ What do you think?',
      "The sender name of a text message and the number of whoever calls you can be faked: it is called **spoofing**. That is why a fake message can show up in the same conversation as the real ones. Since 2025 Italian carriers have blocked many calls from abroad that display a fake Italian number, but the trick has not gone away. The sender, on its own, never proves who is writing.",
      options=["It is real: it is in the bank's conversation", 'It could be fake: the sender can be copied', 'Opening the link is enough to tell'], ans=1),
    P('Three channels, the same trick', r'''
**A scammer doesn't force the door: they talk you into opening it.**

• **Phishing**: an email that imitates the bank, the post office, a courier, a government agency.
• **Smishing**: the same message, by text or chat.
• **Vishing**: a phone call. It often comes right after the message: a fake operator, kind and well prepared, who guides you step by step.

The pattern is always the same: an urgent problem (the account blocked, the package held up, a refund on the way), a link to open or a number to call, and at the end a request for data or codes.

Three rules are almost always enough.

• The bank never asks for passwords, PINs or codes: not by email, not by text, not by phone.
• Don't go in through the link. Open the app yourself, or type the address yourself.
• If they call you, hang up and call back yourself, at the number on the card or on the website.'''),
    BK('Trap or normal?', ['Trap', 'Normal'], [
      ('Text message: account suspended, log in from this link', 0, 'Urgency plus a link: it is the classic pattern.'),
      ('The app asks for your fingerprint for a payment you are making', 1, "It is strong authentication, and you started the payment."),
      ('An operator asks you for the code that arrived by text', 0, 'Codes are for authorizing, never for blocking. No real operator asks for them.'),
      ('Courier email: pay €1.99 to release the package', 0, 'The small amount is there to get you to enter your card details.'),
      ('App notification for a login you just made', 1, 'It is a security alert, and it matches what you were doing.'),
      ('They tell you to move your money to a safe account', 0, "The safe account is the scammer's. No bank asks for that.")]),
    P('When they steal your name', r'''
**Scammers need more than your money: they need your data too.**

With a photo of an ID, the tax code (codice fiscale) and a fake pay stub, someone can apply for a loan in your name. They collect the money. The unpaid installments stay recorded under your name.

It is called **identity theft**. In Italy in 2025 more than 38,000 cases were uncovered, for over €165 million: on average €4,300 each.

You often find out late: from a reminder letter, or from financing that is refused to you for no reason.

How to reduce the risk:

• don't send photos of your documents to people you don't know, not even for a rental or sale listing;
• protect your email inbox with a password used nowhere else and with two-step verification: whoever gets in there can reset the passwords for everything else;
• every so often check what is recorded in your name at the credit bureaus: asking for it is free.'''),
    OR('Your data has been used: in what order do you move?', ['You block cards and access, from the app or the toll-free number', 'You change your passwords, starting with email', 'You file a report with the Polizia Postale, the Italian police unit for online crime', 'You send the report to the bank and the finance companies'],
      x='Tap the moves from the first to the last.',
      after="First you stop the damage, then you document it. With the report in hand you dispute in writing the payments and loans you didn't ask for, and have the records in your name at the credit bureaus corrected."),
    Q('You get an email from your bank with a link to update your details. What is the safe way to check?', ['Open the link and see whether the site looks real', "Open the bank's app yourself, without going through the link", 'Reply to the email and ask for confirmation'], 1,
      "A fake site can be identical to the real one, and whoever sent the email is the one who answers it. The only safe check is to go in on your own, from the app or by typing the address."),
    Q('Why does the email inbox need more protection than any other service?', ['Because from there you can reset the passwords for almost everything', 'Because it is the hardest to get back into', 'Because it contains advertising'], 0,
      'Almost every service lets you reset your password with a link sent by email. Whoever controls your email can get into all the others, one at a time.'),
    Q('A finance company sends you reminders for the installments of a loan you never applied for. What do you do?', ['You pay, to avoid being reported', 'You ignore the letter', 'You file a report and dispute the loan in writing'], 2,
      "Paying would mean acknowledging a debt that isn't yours, and ignoring the letter lets the problem grow. With the report you dispute the loan and ask for the records in your name to be deleted."),
  ], "The sender can be faked: never go in through a link and never give codes to anyone. Protect your documents and email. If your data is used: block, change your passwords, report, dispute."),
# ---- basi-8-6 (B)
  LF('basi-8-6', 'VITA', 'Life insurance: protection or investment?', 7, [
    G('Marco is 35, has two children and a mortgage. He wants his family to receive €200,000 if he dies in the next 20 years. How much does a policy that does only this cost each year?',
      "A **term life insurance** policy usually costs between €200 and €800 a year for amounts between €100,000 and €300,000, depending on age and health. It costs little because it pays only if the event happens, and at 35 that is rare. If at expiration Marco is alive he receives nothing: he bought protection, not an investment.",
      options=['A few hundred', 'About €2,000', 'About €6,000'], ans=0),
    P('Two products with the same name', r'''
**Two very different products are sold under the name life insurance: one protects, the other invests.**

• The **protection policy** is term life insurance. You pay a premium every year and, if you die within the chosen term, the people you named receive the death benefit. If at expiration you are alive, you receive nothing.
• The **investment policy**: you pay in money, the company invests it and later returns a lump sum to you. It can be a **with-profits policy**, linked to a prudent management by the company, or a **unit-linked policy**, linked to funds: there the value goes up and down, and the risk is yours.

Many policies mix the two. That is why, before signing, the question is one: do I need to protect someone, or to grow some money?'''),
    P('Who needs protection', r'''
The question to ask is: **if my income disappeared tomorrow, who would be left in difficulty?**

• Young children, a partner who earns less, a mortgage to pay: protection is needed.
• Nobody depends on your income: as a rule it is not needed.

How big a death benefit? A simple way: the debt left on the mortgage, plus a few years of the family's expenses.

Four things to know.

• The premium depends on age, health and smoking: the younger you are, the less it costs.
• Answer the health questions precisely: a false answer can cause the payment to be refused.
• In Italy, premiums give a 19% tax credit, calculated on a maximum of €530 a year.
• In Italy, the sum paid to your loved ones is exempt from IRPEF and does not enter the estate: it goes to whoever you named.'''),
    N("Giulia and Paolo have a mortgage with €120,000 of debt and spend €24,000 a year. They want to cover the mortgage plus three years of expenses. What amount do they insure?", 192000, '€',
      r'Three years of expenses: \(24{,}000 \times 3 = \text{€}72{,}000\). Plus the mortgage: \(120{,}000 + 72{,}000 =\) **€192,000**.'),
    P('When the policy is an investment', r'''
An investment policy has real advantages: you choose who receives the money, without going through the estate, and as a rule those sums can't be seized.

It also has a price. Inside are the company's costs, the funds' costs and often a **premium charge**, that is, a percentage withheld on every payment. A Bank of Italy study measured that a unit-linked policy costs on average between 0.5 and 2.5 points a year more than buying the same funds directly.

It seems little. Over 20 years it is not:

[fig]

Two more things to check.

• **Leaving early costs**: in the first years what you get back can be less than what you paid in.
• The costs are written in the **KID**, the document of at most three pages that you must receive before signing.''',
      fig=F([('€10,000 at 4% for 20 years', '€21,911', [(21911, 'With no extra costs', OK)]), ('With 1.5 points of extra costs', '€16,386', [(16386, 'What is left', CAP), (5525, 'Eaten by costs', INT, '€5,525')])],
            cap='An example with a fixed return of 4% a year, before taxes.')),
    BK('Who needs a term life policy?', ['Needs one', 'As a rule, no'], [
      ('Father of two children, the only paycheck at home', 0, "If he is gone, the family is left with no income."),
      ('Single 25-year-old, no debts and no dependents', 1, 'Nobody depends on their income.'),
      ('Couple who have just taken out a thirty-year mortgage', 0, 'The one who is left would have to pay the installment alone.'),
      ('Retired woman with adult, independent children', 1, "The children have their own income: there is nobody to protect."),
      ('Single mother with a 6-year-old child', 0, 'The child depends entirely on her.')]),
    Q('You have a 20-year term life policy. At expiration you are alive. What do you receive?', ['The insured amount', 'The premiums you paid', 'Nothing: you paid for twenty years of protection'], 2,
      "Term life insurance pays only if you die within the term. It is like home insurance: if nothing happens, the premium bought the protection of those years."),
    Q('In a unit-linked policy, who bears the risk that the funds go down?', ['The company', 'You', 'The government'], 1,
      "In a unit-linked policy the amount follows the value of the funds. If they go down, what you get back goes down: the company doesn't guarantee the result, except what is written in the contract."),
    Q('Where do you find the costs of an investment policy, before signing?', ['In the KID', 'In the advertising', 'Only in the statement, after the first year'], 0,
      'The KID is the key information document: it shows the total costs and how much they weigh on the return, and it must be handed to you before signing.'),
  ], "Life insurance means two things: protection, which costs little and is needed if someone depends on your income, and investment, where you should check costs and exit penalties in the KID."),
])
