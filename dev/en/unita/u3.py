# Unit 3, "Rischio, tempo e costi": lessons basi-2-3, 3-2, 3-3, 3-4 (all label A).
U3 = dict(id='basi-u3', sid='basi-rischio', name='Risk, time and costs', lessons=[
# ---- basi-2-3 (A)
  L('basi-2-3', 'R', 'Risk and return', 4, [
    ('They go together', r'''
Nobody pays you more without asking for something in return. A higher expected return always comes with more **risk**, that is with results that can stray far from the average, up and down.

If someone promises high returns with no risk, a piece of the story is missing.'''),
    ('Not all your eggs in one basket', r'''
To **diversify** means to split your money among many different securities. If one does badly, it weighs little on the total.

Diversification doesn't remove all the risk: the risk tied to the whole market remains. It removes the risk of betting everything on the wrong company.''')],
    'More expected return, more risk. Diversifying reduces the risk of individual companies, not that of the market.',
    [Q('All your savings are in the stock of a single company. What is the most direct way to reduce the risk?', ['Buy more stock of the same company', 'Split the money among many different companies', 'Check the price every day'], 1,
       'Splitting the money among many companies is how you **diversify**: the trouble of a single one weighs little on the total.')]),
# ---- basi-3-2 (A)
  L('basi-3-2', '½', 'Diversifying with numbers', 5, [
    ('Two securities, two scenarios', r'''
Take two companies that react in opposite ways to the same news. Company A gains when oil rises, company B when it falls.

| Scenario | A | B | Half and half |
|---|---|---|---|
| Oil up | +20% | −5% | +7.5% |
| Oil down | −10% | +15% | +2.5% |

With all the money on A the result ranges from +20% to −10%. With half on A and half on B it ranges from +7.5% to +2.5%: same world, far fewer surprises.'''),
    ('How to do the math', r'''
A portfolio's return is the average of the securities' returns, weighted by how much you put in each:

$$R_p = w_A \times R_A + w_B \times R_B$$

Where \(R_p\) is the portfolio's return, \(w_A\) and \(w_B\) are the fractions put in the two securities, which add up to 1, and \(R_A\) and \(R_B\) are their returns.

Oil up: \(0.5 \times 20\% + 0.5 \times (-5\%) =\) **+7.5%**.

Diversification works when the securities **don't all move together**. Ten companies in the same sector diversify little.''')],
    "Combining securities that don't move the same way reduces the swings of the portfolio.",
    [Q('You have 60% in a security that returns +10% and 40% in a security that returns −5%. What does the portfolio return?', ['+2.5%', '+5%', '+4%'], 2,
       r'\(0.6 \times 10\% + 0.4 \times (-5\%) = 6\% - 2\% =\) **+4%**. The +2.5% would be the simple average, right only with half and half.')]),
# ---- basi-3-3 (A)
  L('basi-3-3', 'T', 'The time horizon', 5, [
    ('When you need the money', r'''
The **time horizon** is the time that passes before you need that money. It is the first question to ask, even before choosing the instrument.

• Money you need **within a year or two**, like the down payment on a house: liquid, stable instruments.
• Money you need **in ten years or more**, like retirement: it can sit in instruments that swing, because there is time to recover.'''),
    ('Why a loss weighs more than it seems', r'''
If an investment drops 30%, to get back to the starting point a +30% is not enough.

Start with €100. After a −30% you have €70. To get back to €100 you need €30 on €70, that is a **+42.9%**.

$$\text{recovery} = \frac{1}{1 - \text{loss}} - 1$$

With a 50% loss the recovery needed is **100%**: the money has to double. That is why someone with little time ahead can't afford big swings.''')],
    'The later you need the money, the more swings you can bear. A loss always demands a bigger recovery in percentage terms.',
    [Q('An investment loses 50%. By how much must it rise to get back to its starting value?', ['By 50%', 'By 100%', 'By 75%'], 1,
       'From €100 you drop to €50. To get back to €100 the €50 has to double: **+100%**.'),
     Q("You need €20,000 in eight months for the down payment on a house. Where does it make the most sense to keep it?", ['In a liquid, stable instrument', 'In stocks, to make it grow', 'In a fund that invests in a single sector'], 0,
       "Eight months is a short horizon: if stocks fall you don't have time to recover. You need **liquid, stable** instruments.")]),
# ---- basi-3-4 (A)
  L('basi-3-4', '−%', 'Costs', 5, [
    ('Small percentages, big amounts', r'''
Every instrument has a cost: management fees, purchase fees, sale fees. They look like small numbers because they are expressed as a percentage per year, but they are paid **every year** and on the **total** invested, not only on the gains.

The return before costs is called **gross**, what is left to you is **net**:

$$\text{net} \approx \text{gross} - \text{costs}$$

A fund that returns 5% before costs and costs 1.5% a year leaves you about **3.5%**.'''),
    ('Thirty years later', r'''
You invest €10,000 for 30 years in two instruments that both return 6% a year before costs. The first costs 0.2% a year, the second 2%. Assumptions: no other contributions, costs taken out every year.

| Annual cost | Net | After 30 years |
|---|---|---|
| 0.2% | 5.8% | €54,271 |
| 2.0% | 4.0% | €32,434 |

The difference is about **€21,800**, more than double the amount invested. It is compound interest working in reverse: costs take out money that would have kept earning.''')],
    'Costs are paid every year and compound like interest. All else equal, the instrument that costs less leaves you more.',
    [Q('A fund returns 7% a year before costs and costs 1.8% a year. About how much is left to you?', ['5.2%', '8.8%', '7%'], 0, r'\(7\% - 1.8\% =\) about **5.2%**. Costs are taken off the return, not added to it.')]),
])
