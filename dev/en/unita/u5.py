# Unit 5, "Leggere un'azienda": lessons basi-5-1, 5-2, 5-3, 5-4 (all label A).
U5 = dict(id='basi-u5', sid='basi-azienda', name='Reading a company', lessons=[
# ---- basi-5-1 (A)
  L('basi-5-1', 'SP', 'The balance sheet', 4, [
    ('A snapshot', r'''
The **balance sheet** is a snapshot of a company on a specific day. It has two sides that always weigh the same.

• The **assets**: what the company owns, like cash, inventory and equipment.
• The **liabilities**: what it owes to others, like debts to banks and suppliers.
• The **equity**: what is left to the owners once all debts are paid.

$$\text{Assets} = \text{Liabilities} + \text{Equity}$$'''),
    ('An example', r'''
A company owns:

• cash 50
• inventory 150
• equipment 300

Total assets: **500**.

It owes 320 to banks and suppliers. Equity is what is left over:

\(500 - 320 =\) **180**

If the company earns and doesn't distribute profits, equity rises. If it loses, it falls.''')],
    r"\(\text{Assets} = \text{liabilities} + \text{equity}\). It is an equality that always holds, for every company.",
    [Q('A company has assets of 800 and liabilities of 500. What is the equity worth?', ['1,300', '500', '300'], 2, r'\(800 - 500 =\) **300**. Adding the two figures is the typical mistake: equity is what is left over after the debts.'),
     Q('A company ends the year with a loss and the owners put in no more money. What happens to equity?', ['It falls', 'It rises', 'It stays the same'], 0,
       'The loss reduces what is left to the owners: equity **falls**. It rises when the company earns and keeps the profits in the company.')]),
# ---- basi-5-2 (A)
  L('basi-5-2', 'CE', 'The income statement', 5, [
    ('A movie, not a snapshot', r'''
The **income statement** tells the story of a period, usually a year: how much the company took in from sales, the **revenue**, and how much it spent, the **costs**. What is left is the **profit**.

You work down in steps:

• revenue minus the cost of goods sold = **gross margin**
• minus operating expenses, like salaries and rent = **operating income**
• minus interest and taxes = **net income**'''),
    ('An example', r'''
| Item | Amount |
|---|---|
| Revenue | 1,000 |
| Cost of goods sold | −600 |
| **Gross margin** | 400 |
| Operating expenses | −250 |
| **Operating income** | 150 |
| Interest | −30 |
| Taxes (30% of 120) | −36 |
| **Net income** | 84 |

The **net margin** is net income divided by revenue: \(\dfrac{84}{1{,}000} =\) **8.4%**. It tells how much of every €1 of sales stays with the company.''')],
    'Revenue minus costs equals profit. Margins, as a percentage of revenue, let you compare companies of different sizes.',
    [M(('Assets', 'What the company owns'), ('Liabilities', 'What the company owes to others'), ('Equity', 'What is left to the owners'), ('Profit', 'Revenue minus costs')),
     Q('A company has revenue of 2,000 and total costs of 1,700. What is the net margin?', ['85%', '15%', '30%'], 1, r'\(\text{Profit} = 2{,}000 - 1{,}700 = 300\). \(\text{Net margin} = \dfrac{300}{2{,}000} =\) **15%**.')]),
# ---- basi-5-3 (A)
  L('basi-5-3', '≠', 'Profit is not cash', 5, [
    ('Two different clocks', r'''
The income statement records revenue and costs when they **arise**, not when the money moves. This rule is called the **accrual basis**.

• You sell goods for 100 with payment in 90 days: the revenue is there right away, the money isn't.
• You buy a machine for 1,000 that you will use for 5 years: you pay 1,000 right away, but the income statement counts 200 a year. That portion is called **depreciation**.

That is why a company can show a profit and still run out of cash.'''),
    ('Following the money', r'''
The **cash flow statement** shows the real cash movements.

A company ends the year with a profit of 50. Assumption: all costs were paid in cash, but customers still owe 80 for sales already counted in revenue.

• Profit: +50
• Sales not yet collected: −80
• Change in cash: **−30**

The company earned, and yet it has 30 less in cash. Whoever evaluates a company always looks at both numbers.''')],
    'Profit measures how much you earned, cash how much money you really have. They can go in opposite directions.',
    [Q('A company has a profit of 120. All costs are paid, but customers still owe 200 for sales already counted. How did cash change?', ['−80', '+120', '+320'], 0,
       r'\(120 - 200 =\) **−80**. The profit is there, but the money has not come in yet.')]),
# ---- basi-5-4 (A)
  L('basi-5-4', 'P/E', 'Price and value', 5, [
    ('What you pay for €1 of profit', r'''
The price of a stock alone doesn't say whether it is expensive. A €30 stock can be more expensive than a €300 one.

A first yardstick is the **price/earnings** ratio, known as the **P/E**:

$$\text{P/E} = \frac{\text{stock price}}{\text{earnings per share}}$$

If the stock costs €30 and earnings per share are €2, the P/E is **15**: you pay €15 for every €1 of annual profit.'''),
    ('How to read it', r'''
A high P/E usually means the market expects earnings to grow strongly. A low P/E can mean a bargain, or a company in trouble.

• Company A: price €30, earnings per share €2, P/E 15.
• Company B: price €60, earnings per share €2, P/E 30.

B costs double for the same earnings today. It makes sense only if its earnings will grow much faster. The P/E alone doesn't give the verdict: it helps you ask the right question.''')],
    'The P/E tells how much you pay for each €1 of profit. It is used to compare similar companies, not as a final judgment.',
    [Q('A stock costs €48 and earnings per share are €4. What is the P/E?', ['12', '44', '192'], 0, r'\(\dfrac{48}{4} =\) **12**: you pay €12 for every €1 of annual profit.'),
     Q('Two companies in the same sector: A has a P/E of 10, B of 25. What does the comparison say?', ['B earns more than A', 'A is surely a bargain', 'For every €1 of profit, B costs more'], 2,
       "The P/E says how much you pay for €1 of profit: €25 with B, €10 with A. It doesn't say who earns more, and a low P/E is not necessarily a bargain: it can signal a company in trouble.")]),
])
