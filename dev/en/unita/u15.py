# Unit 15, "Capire le notizie": lessons basi-15-1, 15-2, 15-3, 15-4 (all label B: Italian figures and institutions, kept as they are).
U15 = dict(id='basi-u15', sid='basi-notizie', name='Understanding the news', lessons=[
# ---- basi-15-1 (B)
  LF('basi-15-1', 'PIL', 'GDP, inflation, unemployment', 8, [
    G('Out of 100 Italians between 15 and 64, 63 have a job. Of the other 37, how many count as unemployed in the statistics?',
      "About **4**. The other 33 don't work but aren't looking for a job either: they study, take care of the home, have stopped looking. The statistics call them **inactive**. For ISTAT, the Italian statistics institute, only someone who has no job, is looking for one and is ready to start counts as unemployed. And the unemployment rate is calculated only on those who work or look: 4 out of 67, that is about 6%.",
      lo=0, hi=37, step=1, truth=4, near=2, unit='persone'),
    P('GDP, and how to read it', r'''
**GDP is the value of everything a country produces in a period: goods and services, from bread to doctor visits.**

When a news story says GDP has grown, look at three things.

• **Compared with when.** The change on the previous quarter is called quarter-on-quarter; the one on the same quarter a year ago, year-on-year. In summer 2026 Italian GDP was flat on the previous quarter and 0.8% higher than a year earlier.
• **Real or nominal.** Nominal GDP rises even just because prices rise. Real GDP strips out inflation: it is the number the news reports.
• **Total or per person.** A country can grow just because it has more inhabitants. For the standard of living, **GDP per capita** counts.

Real growth is obtained, more or less, like this:

$$\text{real} \approx \text{nominal} - \text{inflation}$$

And one limit: GDP measures how much is produced, not how people live. It doesn't say how income is divided, and it doesn't count unpaid work.'''),
    N("In one year a country's nominal GDP grows 3.5% and prices grow 2.7%. By roughly how much did real GDP grow?", 0.8, '%',
      r'\(\text{real growth} \approx \text{nominal growth} - \text{inflation} = 3.5\% - 2.7\% =\) **0.8%**. The rest of the growth is made only of higher prices.', tol=0.05, dec=1),
    P('Inflation in the headlines', r'''
You have already met inflation: it is the general rise in prices. In the news it comes with three labels.

• **Year-on-year**: this month's prices against those of the same month a year ago. It is the number in the headlines.
• **Month-on-month**: against last month. It tells whether the run is accelerating or slowing down.
• The **shopping basket**: only food and household and personal care products. These are everyday purchases, so it is the increase you feel the most.

A real example: in October 2026 ISTAT estimated +5.4% year-on-year and +0.9% on the month, with the shopping basket at +2.5%. Energy prices were the ones driving it.

A frequent trap: if inflation falls from 5% to 3%, prices do not fall. They still rise, only more slowly.'''),
    LV('A hundred people and a rate', 'A hundred people between 15 and 64. Whoever is not employed and not looking for work is inactive.', 'lavoro', dict(),
      [dict(id='occ', label='Employed', min=55, max=70, step=1, start=63, unit=''),
       dict(id='dis', label='Unemployed: looking for work', min=1, max=12, step=1, start=4, unit='')],
      [dict(label='Bring unemployment below 5% without creating jobs', cond=[['tasso10', '<', 50], ['occ', '<=', 63]], hint='If the employed stay at 63, only the number of people looking can change.'),
       dict(label='Now create three jobs', cond=[['occ', '>=', 66]], hint='Raise the employed to 66 and see what the two rates do.')],
      'The unemployment rate counts only people looking for work. If someone stops looking they become inactive, and the rate falls even if nobody found a job. That is why it has to be read together with the employment rate, which tells how many people actually work.'),
    BK('Employed, unemployed or inactive?', ['Employed', 'Unemployed', 'Inactive'], [
      ('Works part-time, 20 hours a week', 0, 'For the statistics, having worked at least one hour in the week is enough.'),
      ('Without a job, sends out résumés every week', 1, 'Does not work, is looking and is available: unemployed.'),
      ('Studies and is not looking for work', 2, 'Does not work and is not looking: for the statistics, among the inactive.'),
      ('Has stopped looking: thinks they will not find anything', 2, 'Whoever no longer looks does not count among the unemployed.'),
      ("On Italy's wage supplement fund for a month", 0, 'Whoever is absent from work for a short time stays among the employed.')]),
    Q("A country's real GDP grows 0.5% and its population 1%. What happens to GDP per capita?", ['It rises', 'It falls', 'It stays the same'], 1,
      'GDP grows less than the population: the share that on average falls to each person shrinks by about half a percentage point.'),
    Q('Inflation goes from 5% to 2%. What do prices do?', ['They fall by 3%', 'They go back to the level of a year earlier', 'They still rise, but more slowly'], 2,
      'Lower inflation means prices that rise less quickly. For prices to fall you need negative inflation, which is called deflation.'),
    Q("In one month the unemployment rate falls, but the number of employed doesn't rise. What may have happened?", ['Some people stopped looking for work', 'Salaries went up', 'GDP grew'], 0,
      'Whoever stops looking goes from unemployed to inactive, and drops out of the count. The rate falls even if nobody found a job.'),
  ], "GDP: check whether it is real and compared with when. Lower inflation doesn't mean lower prices. Unemployment counts only those who look: read it together with employment."),
# ---- basi-15-2 (B)
  LF('basi-15-2', '3%', 'Deficit and public debt', 8, [
    G('In 2025 the Italian state spent more than it took in. By how much, for every €1,000 of GDP?',
      "**€31** for every 1,000 of GDP, that is 3.1%: it is the **deficit**. It seems little, but it adds to a debt that is already worth €1,367 for every 1,000 of GDP. The deficit is what is missing in one year. The debt is what has piled up over all the past years.",
      lo=0, hi=100, step=1, truth=31, near=8),
    P('Two words that get confused', r'''
**The deficit is how much the state spends over what it takes in during a year. Public debt is the sum of past deficits, still to be repaid.**

One is measured over a year, the other builds up over time.

To cover the deficit the state borrows money, by selling securities such as BOT and BTP, the Italian government bonds. Every year that ends in deficit adds debt.

Both numbers are measured relative to GDP, because what matters is the size of the debt compared with the economy that has to carry it.

| | Italy, 2025 | EU threshold |
|---|---|---|
| Deficit | 3.1% of GDP | 3% |
| Debt | 136.7% of GDP | 60% |

Whoever exceeds a 3% deficit can end up in a European procedure, which asks for a plan to get back in line. Italy has been in one since 2024.'''),
    BK('Deficit or debt?', ['Deficit', 'Debt'], [
      ('How much the state spends over what it takes in this year', 0, 'It is the result of a single year.'),
      ('All the BOT and BTP still to be repaid', 1, 'It is what the state has to repay in all.'),
      ('The European reference is 3% of GDP', 0, "The 3% concerns each year's deficit."),
      ('The European reference is 60% of GDP', 1, 'The 60% concerns the accumulated debt.'),
      ('It grows every year in which the accounts close in the red', 1, 'Every deficit adds to the debt.')]),
    P('What makes debt rise or fall', r'''
The ratio of debt to GDP can fall even without repaying €1. It depends on three forces.

• **Interest** makes debt grow, because it has to be paid every year. In 2025 Italy paid €87 billion: 3.8% of GDP.
• **Growth** makes GDP grow, that is the number under the fraction. What counts is nominal growth, prices included.
• The **primary balance**: the difference between revenue and spending before paying interest. If it is positive it is called a primary surplus, and it reduces debt. In 2025 Italy's was 0.8% of GDP.

The rule is this: if the rate paid on the debt is higher than growth, debt rises on its own, and to stop it you need a primary surplus. If growth exceeds the rate, debt falls on its own.'''),
    LV('Ten years of public debt', "We start from numbers close to Italy's 2025 figures: debt at 137% of GDP and deficit at 3.1%.", 'debito', dict(debito=137, anni=10),
      [dict(id='crescita', label='GDP growth, prices included', min=0, max=6, step=0.5, start=2.5, unit='%', dec=1),
       dict(id='tasso', label='Average rate paid on the debt', min=1, max=6, step=0.5, start=3, unit='%', dec=1),
       dict(id='primario', label='Primary balance, as a share of GDP', min=-3, max=4, step=0.5, start=1, unit='%', dec=1)],
      [dict(label='Bring debt below 130% of GDP', cond=[['finale', '<', 130]], hint='You can raise growth, lower the rate or raise the primary balance.'),
       dict(label='Now do it with growth of 1%', cond=[['finale', '<', 130], ['crescita', '<=', 1]], hint='With little growth you need a big primary surplus, or a lower rate.')],
      "If growth stays at 1% and the rate stays at 3%, to get below 130% you need a primary surplus of 3.5% of GDP every year, for ten years: more taxes or less spending by tens of billions. With growth of 3.5% half a point would be enough. That is why, when talking about debt, growth counts as much as cuts."),
    N('A country has debt equal to 140% of GDP and pays an average of 3% interest. How much does it spend on interest each year, as a percentage of GDP?', 4.2, '%',
      r'\(\text{interest} = \text{debt} \times \text{rate} = 140\% \times 3\% =\) **4.2%** of GDP. It is money that every year cannot go to schools, healthcare or pensions.', tol=0.05, dec=1),
    Q("A country ends the year with a lower deficit than the year before. What happens to its debt?", ['It falls', 'It stays put', 'It still rises, but less than before'], 2,
      'As long as the accounts close in deficit, the amount of debt keeps rising. A smaller deficit only means it rises more slowly.'),
    Q('What is a primary surplus?', ['Revenue higher than spending, before paying interest', 'The debt left over at the end of the year', 'A European loan'], 0,
      "The primary balance compares revenue and spending without counting interest on the debt. When it is positive it is called a primary surplus: it is the resources left to pay interest and reduce debt."),
    Q('A debt costs 3% on average and nominal GDP grows 5%. With a balanced primary balance, what does the ratio of debt to GDP do?', ['It rises', 'It falls', 'It stays the same'], 1,
      'Debt grows 3% because of interest, but GDP grows 5%: the fraction shrinks. That is why growth, even growth made of inflation, lightens debt.'),
  ], 'The deficit is for one year, the debt piles up. Both are measured against GDP. Debt falls if growth exceeds the rate paid, or with a primary surplus.'),
# ---- basi-15-3 (B)
  LF('basi-15-3', 'BTP', 'Spread and rating', 7, [
    G('November 2011, in the middle of the debt crisis: the spread between BTPs and Bunds hits its record. How many basis points?',
      "**574 basis points**, on November 9, 2011: to lend money to Italy for ten years the market asked 5.74% more than for Germany. On November 10, 2026 the spread was at 102. That number is a thermometer: it tells how risky lending to one state is considered compared with another.",
      lo=0, hi=1000, step=10, truth=574, near=60, unit='punti'),
    P('What the spread is', r'''
**The spread is the difference between the yield on ten-year Italian government bonds, the BTPs, and that on German bonds, the Bunds.**

It is measured in **basis points**: 100 basis points are one percentage point.

$$\text{spread} = \text{BTP} - \text{Bund}$$

Germany is the benchmark because its bonds are considered the safest in the euro area. The **spread** is therefore the premium the market asks for lending to Italy instead of Germany.

Why it ends up in the news:

• if it rises, the state pays higher interest on new bonds, and that money leaves the public budget;
• over time the rates that banks charge on mortgages and loans rise too;
• whoever already holds BTPs sees their price fall.'''),
    N('On November 10, 2026 the ten-year BTP yielded 4.27% and the Bund 3.25%. What was the spread, in basis points?', 102, '',
      r'\(\text{spread} = 4.27\% - 3.25\% = 1.02\%\). One percentage point is 100 basis points, so the spread was **102 basis points**.'),
    P('The rating: the report card of debt', r'''
A **rating** is a grade on the ability of a state, or of a company, to repay its debts. It is given by private agencies: the most followed are S&P, Moody's and Fitch.

The scale goes from AAA, the top, down to D, which means a missed payment. The line that matters is in the middle.

| Band | S&P grades |
|---|---|
| Investment grade | AAA to BBB− |
| Speculative | BB+ and below |

Many funds can only buy **investment grade** securities. Whoever falls below that line loses some of its buyers, and pays higher rates.

At the beginning of November 2026 Italy has BBB+ from S&P and from Fitch, and Baa2 from Moody's, which on its scale equals BBB: a few notches above the line.

Next to the grade there is the **outlook**: positive, stable or negative. It says in which direction the grade could move.'''),
    OR('From safest to riskiest', ['AAA', 'A', 'BBB', 'BB', 'CCC'],
      x='Tap the grades from the highest to the lowest.',
      after='From BBB up we are in the investment grade band. From BB down, in the speculative one. Inside each letter there are then pluses and minuses: BBB+ is one notch above BBB.'),
    Q('The spread goes from 80 to 150 basis points. What does it mean?', ['That the market asks more to lend to Italy instead of Germany', 'That BTPs yield less than Bunds', 'That public debt has decreased'], 0,
      "A wider spread means that the yield on BTPs has moved further from that on Bunds: to buy Italian bonds the market wants a higher premium."),
    Q('You hold a BTP bought a year ago. The spread rises a lot, with German yields unchanged. What happens to the price of your bond?', ['It rises', 'It falls', "It doesn't change"], 1,
      'If the spread rises with Bund yields unchanged, the BTP yield has risen. Bonds already in circulation, which pay lower coupons, are worth less. If you hold it to maturity you still receive all the principal.'),
    Q('A country goes from BBB− to BB+. Why is it important news?', ['Because it climbs one notch', 'Because only the name of the grade changes', 'Because it leaves the investment grade band'], 2,
      "BBB− is the last notch of investment grade. With BB+ you enter the speculative band: many funds can no longer hold those bonds and have to sell them."),
  ], 'The spread is the extra yield of BTPs over Bunds, in basis points. The rating is the grade on the debt: from BBB− up it is investment grade, below it is speculative.'),
# ---- basi-15-4 (B)
  LF('basi-15-4', 'MIB', 'Stock market indexes', 7, [
    G("The FTSE MIB is the most quoted index of the Italian stock market. How many companies does it contain?",
      "There are **40**: the largest and most traded of those listed in Milan. An index is not the whole stock market: it is a basket chosen by a rule. The American S&P 500 contains 500, the German DAX 40.",
      lo=0, hi=300, step=10, truth=40, near=10, unit='società'),
    P('What an index measures', r'''
**A stock market index sums up in a single number the prices of a group of stocks. If it rises, on average those stocks are worth more.**

Its value is expressed in points, but points alone say nothing: what counts is the percentage change, calculated like this:

$$\frac{\text{today} - \text{yesterday}}{\text{yesterday}}$$

Each index tells a different piece of the market.

• The **FTSE MIB**: 40 large Italian companies, among which banks and energy weigh a lot.
• The **S&P 500**: 500 large American companies, among which technology weighs a lot.

When you hear that the stock market has wiped out billions, it means the market value of companies has fallen. No cash has vanished: the prices at which those stocks trade have fallen. They can rise again, or fall further.'''),
    N('An index closes at 40,600 points. The day before it had closed at 40,000. By what percentage did it rise?', 1.5, '%',
      r'\(\text{change} = \dfrac{40{,}600 - 40{,}000}{40{,}000} = \dfrac{600}{40{,}000} =\) **1.5%**.', tol=0.05, dec=1),
    P("Not all weigh the same", r'''
In most indexes the companies don't count the same: each weighs in proportion to its value on the stock market, its **market capitalization**.

A company worth 100 billion moves the index ten times more than one worth 10 billion.

Two consequences.

• A few names can decide the day. In the FTSE MIB, in mid-2026, the top five companies alone were worth more than half of the index.
• The index can rise even if most of the stocks fall: it is enough that the biggest ones rise.'''),
    LV('An index with three companies', 'Three companies: the large one weighs 60, the medium one 30, the small one 10. Move their daily changes.', 'indice', dict(pa=60, pb=30, pc=10),
      [dict(id='a', label='The large one, weight 60', min=-10, max=10, step=1, start=0, unit='%'),
       dict(id='b', label='The medium one, weight 30', min=-10, max=10, step=1, start=0, unit='%'),
       dict(id='c', label='The small one, weight 10', min=-10, max=10, step=1, start=0, unit='%')],
      [dict(label='Make the index rise 3% with the medium and small ones flat or down', cond=[['ind10', '>=', 30], ['b', '<=', 0], ['c', '<=', 0]], hint='Just move the largest company.'),
       dict(label='Now make the index close down with two out of three companies up', cond=[['ind10', '<', 0], ['su', '>=', 2]], hint='Make the large one fall, and the other two rise a little.')],
      "The large company alone is worth 60% of the index: if it rises 5%, the index rises 3% with the others flat. And a day with two stocks out of three up can close in the red. The index tells how the market is doing on average, weighted by value. It doesn't tell how most of the companies are doing."),
    P('Two warnings about newspaper headlines', r'''
• **Dividends are not visible.** Almost all the indexes quoted in the news track only prices. Whoever held the stocks also collected the dividends: over many years, the real return is higher than the one the index shows.
• **Points are misleading.** A drop of 500 points is serious on an index at 5,000 and almost nothing on one at 50,000. Always look at the percentage.

And remember that an index is not the economy. Inside it there are only listed companies, often large and with a lot of business abroad: the stock market can rise in a year when GDP is flat.'''),
    Q('An index loses 400 points. What do you need to tell whether it is a lot or a little?', ['The name of the index', 'The value it started from, to calculate the percentage', 'The number of companies it contains'], 1,
      'Four hundred points are 4% of an index at 10,000 and 0.8% of one at 50,000. Without the starting value the number says nothing.'),
    Q('In an index weighted by market capitalization, which company moves the result the most?', ['The one with the most employees', 'The one listed the longest', 'The one worth the most on the stock market'], 2,
      'The weight of each company is in proportion to its market value. The largest count more, and can decide the direction of the day on their own.'),
    Q("The FTSE MIB rises 1%. What can you say for sure?", ['That, taking the weights into account, its 40 companies are on average worth more', 'That all Italian stocks have risen', 'That the Italian economy has grown 1%'], 0,
      "An index tells how its basket did on average, weighted by value. Some companies may have fallen, those outside the basket don't count, and the stock market is not GDP."),
  ], "An index is a basket of stocks weighted by market value: look at the percentage, not the points. It usually doesn't count dividends. And the stock market is not the whole economy."),
])
