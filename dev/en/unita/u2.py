# Unit 2, "Gli strumenti": lessons basi-2-1, 2-4 (label A) and basi-2-2, 2-5 (label B). basi-2-3 is in the "u3" file of this kit.
U2 = dict(id='basi-u2', sid='basi-strumenti', name='Financial instruments', lessons=[
# ---- basi-2-1 (A)
  L('basi-2-1', 'AZ', 'Stocks', 4, [
    ('A piece of a company', r'''
A **stock** is an ownership stake in a company. If the company has issued 1,000 shares and you own 10, you own 1% of it.

Whoever owns stocks earns in two ways:

• the **dividend**, that is the part of profit the company distributes to its owners;
• the rise in the **price**, if the stock is worth more when you resell it.'''),
    ('Nothing is promised', r'''
Neither the dividend nor the price is guaranteed. If the company does badly, the dividend can disappear and the price can fall.

In exchange for this risk, over the long run stocks have returned more on average than bonds.''')],
    'Stock = an ownership stake. It pays through dividends and price growth, with no guarantees.',
    [Q("A company has 2,000 shares outstanding and you own 50. What portion of the company is yours?", ['0.25%', '2.5%', '25%'], 1, r'\(\dfrac{50}{2{,}000} = 0.025\), that is **2.5%**.')]),
# ---- basi-2-2 (B)
  L('basi-2-2', 'OB', 'Bonds', 5, [
    ('A loan you can resell', r'''
A **bond** is a loan you make to a company or a government. In exchange you receive:

• a **coupon**, that is the interest paid at fixed dates;
• the **redemption** of the principal at maturity.

A 10-year BTP (an Italian government bond) with a 3% coupon on €1,000 pays you €30 a year and gives you back €1,000 after 10 years.'''),
    ('Fewer surprises, not zero', r'''
Compared with a stock, you already know how much you will receive, as long as whoever issued the bond pays. There are two risks:

• that the issuer **doesn't pay** (credit risk);
• that **rates rise**: new bonds pay more, and yours, if you sell it before maturity, is worth less.''')],
    "Bond = loan. Fixed coupons and redemption at maturity; the price falls when rates rise.",
    [M(('Stock', 'An ownership stake in a company'), ('Bond', 'A loan to a company or a government'), ('Dividend', 'The part of profit paid to the owners'), ('Inflation', 'Prices that rise over time')),
     Q("Interest rates fall. What usually happens to the price of bonds already in circulation?", ['It falls', 'It stays the same', 'It rises'], 2,
       'Bonds already issued pay higher coupons than new ones, so they are worth more: the price **rises**. Interest rates and bond prices move in opposite directions.')]),
# ---- basi-2-4 (A)
  L('basi-2-4', 'ETF', 'Funds and ETFs', 5, [
    ('Many securities in one go', r'''
A **mutual fund** pools the money of many savers and invests it in many securities together. You don't buy individual stocks or bonds: you buy **shares** of the fund.

The value of one share is calculated like this:

$$\text{share value} = \frac{\text{net assets}}{\text{number of shares}}$$

If the fund has net assets of €10 million divided into 1 million shares, each share is worth **€10**. With €500 you buy 50.'''),
    ('What changes with an ETF', r'''
An **ETF** is a fund that is bought and sold on the stock market like a stock and that usually **tracks an index**, that is a basket of securities chosen by a fixed rule (for example the 500 largest US companies).

• An **active** fund has a manager who picks the securities and costs more, often between 1% and 2% a year.
• An ETF that tracks an index doesn't pick anything and costs less, often between 0.1% and 0.3% a year.

In both cases you hold many different securities with a single transaction.''')],
    'A fund pools the money of many people and buys many securities. An ETF is a fund listed on the stock market that tracks an index and costs little.',
    [Q('A fund has net assets of €50 million divided into 2 million shares. How much is one share worth?', ['€2.50', '€25', '€100'], 1, r'\(\dfrac{50{,}000{,}000}{2{,}000{,}000} =\) **€25** per share.'),
     Q('What does an ETF that tracks an index do?', ['It picks the best securities every day', 'It guarantees the invested principal', "It buys the index's securities, without picking"], 2,
       "It buys the securities that make up the index, in the same proportions, **without picking**. That is why it costs little. It doesn't guarantee the principal: if the index falls, the ETF falls too.")]),
# ---- basi-2-5 (B)
  L('basi-2-5', 'CC', 'Accounts, deposits and liquidity', 4, [
    ('Where everyday money sits', r'''
• The **checking account** is for receiving and paying. It earns little or nothing.
• The **deposit account** is made for leaving a sum untouched: in exchange the bank pays you interest. The money is often **locked**: if you withdraw it before maturity you lose the interest, in whole or in part, and in some cases you can't withdraw it at all.

Example: €5,000 in a deposit account at 3% for a year earns \(5{,}000 \times 3\% =\) **€150** before taxes. In Italy the tax on interest is 26%: you keep **€111**.'''),
    ('Liquidity', r'''
**Liquidity** means how quickly you can turn something into cash without losing money. A checking account is extremely liquid. A house is not: selling it takes months.

For the unexpected you need an **emergency fund**: liquid money equal to a few months of expenses. A common rule is to keep 3 to 6 months.

If you spend €1,500 a month, the emergency fund goes from €4,500 to €9,000. Only what is left over makes sense to invest.''')],
    'Money you may need soon sits in liquid instruments. The rest can work over longer periods.',
    [Q('You spend €1,200 a month and want an emergency fund that covers 4 months. How much do you need to set aside?', ['€4,800', '€1,200', '€14,400'], 0,
       r'\(1{,}200 \times 4 =\) **€4,800**. €14,400 would be a whole year of expenses.')]),
])
