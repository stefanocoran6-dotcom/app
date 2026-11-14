# Unit 10, "La testa dell'investitore": lessons basi-10-1, 10-2, 10-3, 10-4 (all label A).
U10 = dict(id='basi-u10', sid='basi-testa', name="The investor's mind", lessons=[
# ---- basi-10-1 (A)
  LF('basi-10-1', '2×', 'Losses hurt more', 6, [
    G("A game: you flip a coin. If it comes up heads you win €150, if it comes up tails you lose €100. If you could repeat it many times, how much would you earn on average on each flip?",
      r'Half the time you win €150, half the time you lose €100: on average \(0.5 \times 150 - 0.5 \times 100 =\) **+€25** per flip. It is a game worth playing. And yet, faced with a single flip, many people refuse: the fear of losing €100 weighs more than the hope of winning €150.',
      lo=-100, hi=150, step=5, truth=25, near=10),
    P('A loss weighs about double', r'''
**Losing €100 hurts more than gaining €100 feels good.**

Researchers call it **loss aversion**. In experiments, to accept the risk of losing €100 people ask on average to be able to win about €200. A loss weighs roughly double a gain of the same size.

[fig]

It is not a flaw to be fixed: it is how we are built. But when investing it leads to wrong decisions, because markets rise and fall all the time, and every drop is felt twice as much as every rise.''',
      fig=F([('Gaining €100', None, [(1, 'How good it feels', OK)]), ('Losing €100', None, [(2, 'How much it hurts', 'rosa')])], cap='A rough measure: it varies from person to person.')),
    P('What it makes us do', r'''
Loss aversion pushes toward three typical mistakes.

• **Holding losing investments too long.** As long as you don't sell, the loss seems not to exist. So you wait to break even, even when the reasons you bought are gone.
• **Selling winning investments too early**, out of fear of watching that gain disappear.
• **Looking too often.** Whoever checks every day sees many more negative days than whoever looks once a year, and every negative day hurts.

One idea helps against all three: the market doesn't care what price you bought at. The useful question isn't ‘how much am I losing?’ but ‘if I had this money in hand today, would I buy this investment?’ If the answer is no, the purchase price is not a reason to hold on to it.'''),
    N('Another coin game: heads you win €300, tails you lose €200. How much do you earn on average on each flip?', 50, '€',
      r'\(0.5 \times 300 - 0.5 \times 200 = 150 - 100 =\) **+€50** per flip. It is a favorable game, even if the possible loss of €200 is scary.'),
    BK('Is it an effect of loss aversion?', ['Yes', 'No'], [
      ("I won't sell until I break even", 0, "The purchase price becomes a finish line, but the market doesn't care."),
      ('I immediately sell a stock that has risen 5%, afraid it will fall', 0, 'The fear of losing a gain makes people sell too early.'),
      ('I check my portfolio ten times a day', 0, 'The more you look, the more negative days you see, and each one weighs double.'),
      ('I sell because I have reached the amount I needed', 1, 'It is a decision tied to your goal, not to fear.'),
      ('I rebalance once a year, as per the plan', 1, 'It is a rule decided beforehand, with a cool head.')]),
    Q("You bought a stock at €50 and it is now worth €30. In the meantime the company has lost its best customers. What is the healthiest way to think about it?", ['I ask myself whether I would buy it today at €30', 'I wait for it to go back to €50, then sell', 'I buy more to lower my average price'], 0,
      "The €50 you paid no longer counts: what counts is what the stock is worth today and what you expect for the future. If you wouldn't buy it today, the purchase price is not a reason to keep it."),
    Q("What does loss aversion say?", ['That a loss weighs more than a gain of the same size', 'That whoever invests always loses', 'That losses recover on their own'], 0,
      'Losing €100 hurts about twice as much as gaining €100 feels good. It says nothing about how your investments will do: it says how you will react.'),
  ], 'A loss hurts about twice as much as an equal gain feels good. Decide by looking ahead, not at the price you bought at.'),
# ---- basi-10-2 (A)
  LF('basi-10-2', 'FOMO', 'Everyone is buying, so I buy too', 7, [
    G("A stock goes from €10 to €40 in a year. Everyone is talking about it, and Luca buys at €40. Then the price goes back to €16. How much did Luca lose, in percentage?",
      "Luca bought at €40 and ends up with €16: he lost €24 out of €40, that is **60%**. Whoever bought at €10 is still up 60%. Same stock, same story: what made the difference was the moment of entry.",
      lo=0, hi=100, step=1, truth=60, near=3, unit='%'),
    P('The fear of missing out', r'''
**When a price rises and everyone is talking about it, you feel like buying. It is often the worst moment to do it.**

Watching others earn while you stand by and watch creates a very strong push. It has a name by now in common use: **FOMO**, fear of missing out.

Another habit works alongside it: **herd behavior**. If everybody is doing it, we think, there must be a reason. In everyday life that is often a good rule. In markets it isn't, for a simple reason: the more people have already bought, the more the price has already risen.

[fig]

When a piece of news has reached you, it is likely already in the price.''',
      fig=F([('A year earlier', '€10', [(10, 'Price', CAP)]), ('When everyone is talking about it', '€40', [(40, 'Price', 'rosa')]), ('A year later', '€16', [(16, 'Price', CAP)])])),
    P('How a bubble forms', r'''
When herd behavior takes over a whole market, a **bubble** forms: prices rise far more than what you are buying is really worth.

It usually goes like this.

• Something new catches attention, and the first prices rise for good reasons.
• The first buyers' gains attract more buyers. The price rises because people buy, and people buy because the price rises.
• Then come those who buy only to resell at a higher price. Nobody looks at what they are buying anymore.
• The new buyers run out. The price stops rising, someone sells, and the fall is faster than the rise.

It happened with tulips in the Netherlands in the seventeenth century, with internet stocks in the late nineties, with houses in the United States before 2008. The object changes, the script doesn't.'''),
    OR('Put the phases of a bubble in order', ['Something new attracts the first buyers', 'Prices rise and everyone else arrives', 'People buy only to resell for more', 'The buyers run out and the price collapses'],
      after='Whoever enters in the third phase buys from whoever entered in the first.'),
    N("You buy a stock at €80, at the height of the enthusiasm. The price falls to €20. By what percentage must it rise to get back to €80?", 300, '%',
      r'From €20 to €80 is €60 more: \(\dfrac{60}{20} =\) **300%**. The price has to quadruple. After a 75% drop, a +75% is not enough.'),
    P('How to defend yourself', r'''
You don't need to be able to predict bubbles. You need not to get carried away.

• **Decide beforehand.** A written plan, with how much you invest each month and in what, takes the decision away from you at the moment when you are most emotional.
• **Ask yourself the uncomfortable question.** Am I buying because I understood what I'm buying and what it is worth, or because it went up?
• **Look at how much it weighs.** A small part of your money on a risky idea is a choice. All of your savings is not.

Whoever invests a fixed amount every month in a well-diversified fund already has a good defense: they always buy, both when everyone is enthusiastic and when everyone is afraid.'''),
    Q('A stock has tripled in six months and everyone is talking about it. What does this say about its future?', ['That it will keep rising', 'That it will surely collapse', 'Nothing certain: it only says that today it costs much more'], 2,
      'A past rise promises neither more rise nor a collapse. It only says that whoever buys today pays three times as much, so has less margin if things go wrong.'),
    Q('What sets a bubble apart from a normal rise in prices?', ['In a bubble people buy mainly because the price is rising', 'In a bubble prices rise slowly', 'In a bubble only professionals buy'], 0,
      'In a bubble the price rises because people buy, and people buy because the price rises. Nobody looks anymore at how much what they are buying is really worth.'),
  ], 'When everyone is buying, the price has already risen. Decide with a plan written beforehand, not with the fear of missing out.'),
# ---- basi-10-3 (A)
  LF('basi-10-3', '↓↑', 'Selling at the worst moment', 6, [
    G("Sara has €10,000 invested. The market loses 30% and she, gripped by fear, sells everything. The next year the market rebounds 50%, but Sara stayed out. How much less money does she have compared with someone who didn't sell?",
      r"Whoever stayed invested has \(10{,}000 \times 0.70 \times 1.50 = \text{€}10{,}500\). Sara sold at €7,000 and stayed there: she has **€3,500** less. The 30% loss was only on paper. By selling she made it final.",
      lo=0, hi=6000, step=100, truth=3500, near=300),
    P('A paper loss', r'''
**As long as you don't sell, a drop is a number on a screen. It becomes a real loss the moment you sell.**

When markets fall hard, the news talks about a crash and every day the number is lower. The natural reaction is to run: sell everything so as not to lose more.

The problem is that sharp drops and sharp rebounds are often close together. Whoever gets out after the drop shelters from a fall that has already happened, and misses the rebound that comes after.

[fig]

To do better than someone who stays put you have to get two moments right: when to get out and when to get back in. Getting just one wrong is enough to do worse.''',
      fig=F([('At the start', '€10,000', [(10000, 'Both', CAP)]), ('Whoever stays invested', '€10,500', [(10500, 'After the −30% and the +50%', OK)]), ('Whoever sells after the drop', '€7,000', [(7000, 'Out of the market', 'rosa')])])),
    P('Why time helps', r'''
Falling is part of how stock markets work. In the history of the big stock markets, drops of 10% have come on average every year or two, and those of 30% or more about once every ten years.

So far the big markets have always recovered: sometimes in a few months, sometimes after many years. It is not a guarantee for the future. But for someone with a lot of time ahead, a drop is a stretch of road, not the end of the journey.

Three things make it easier to stay put.

• **Invest only money you don't need soon.** Whoever needs it in a year is forced to sell, at any price.
• **Have an emergency fund.** That way an unexpected expense doesn't force you to sell at the wrong moment.
• **Choose a split you can bear.** If a −30% would keep you awake at night, you need fewer stocks.'''),
    N("You have €8,000 invested. The market falls 25% and then rebounds 40%. If you don't sell, how much do you have at the end?", 8400, '€',
      r"After the drop: \(8{,}000 \times 0.75 = \text{€}6{,}000\). After the rebound: \(6{,}000 \times 1.40 =\) **€8,400**. A −25% followed by a +40% doesn't make +15%: percentages multiply, they don't add."),
    BK('Does it help you not sell in a panic?', ['Helps', "Doesn't help"], [
      ('Having an emergency fund', 0, "An unexpected expense doesn't force you to sell."),
      ('Checking prices every hour', 1, 'The more you look, the scarier the drop feels.'),
      ('Having invested money you need in 20 years', 0, 'With so much time, a drop can be waited out.'),
      ('Having put everything in a single stock', 1, 'A single stock may never recover: diversifying is for this too.'),
      ('Having a plan written beforehand', 0, 'The decision has already been made, with a cool head.'),
      ('Listening to those shouting about a crash', 1, "Other people's fear is contagious.")]),
    Q('Your diversified fund has lost 20% and you will need that money in 25 years. What does someone with a plan usually do?', ['Sells everything and waits for better times', 'Keeps up the planned payments', 'Moves everything into a single stock that is rising'], 1,
      'With 25 years ahead, a 20% drop is a stretch of road. Whoever keeps paying in buys at lower prices during that period.'),
    Q('Why is it so hard to profit by getting out of the market and back in?', ['Because it is forbidden', 'Because prices never change', 'Because you have to get two moments right: when to get out and when to get back in'], 2,
      'You have to nail both the moment to get out and the moment to get back in. Whoever gets out after a drop often gets back in when prices have already recovered.'),
  ], 'A drop becomes a real loss only when you sell. Time, an emergency fund and a written plan help you stay put.'),
# ---- basi-10-4 (A)
  LF('basi-10-4', 'N.1', 'Feeling smarter than the market', 7, [
    G("Luca has €10,000 invested and buys and sells often: 40 trades a year, and each one costs him an €8 fee. How much does he spend in fees in 10 years?",
      r"\(40 \times 8 = \text{€}320\) a year, that is **€3,200** in ten years: almost a third of the starting €10,000, spent just to move around. To break even, every year Luca has to do 3.2% better than someone who stays put.",
      lo=0, hi=6000, step=100, truth=3200, near=300),
    P('Everyone above average', r'''
**Almost all of us think we are better than average. By definition, it can't be true for everyone.**

It is called **overconfidence**. Ask a group of people whether they drive better than average: the great majority say yes.

In investing the same happens, with an aggravating factor: chance disguises itself as skill. If you buy a stock and it rises, you think you understood it. If it falls, it was bad luck. After a few lucky hits you feel like an expert and start taking more risk.

On the other side of every purchase of yours, though, there is someone selling. Often it is a professional who does this job all day, with more information and more tools than you. It is not impossible to do better than them. It is just much less likely than it seems.'''),
    P('Moving costs money', r'''
Overconfidence has an effect that can be measured: it makes people buy and sell too much.

Every trade has a cost. There is the **fee** you pay the broker. And there are taxes on gains, which you pay every time you sell at a gain instead of putting them off.

Here are Luca's €10,000 and his ten years of fees:

[fig]

Studies on small investors have found the same result for years: on average, whoever trades more earns less. Not because they pick worse stocks, but because costs eat the results.

Often the move that pays the most is doing nothing.''',
      fig=F([('Starting capital', '€10,000', [(10000, 'Money invested', CAP)]), ('Fees over 10 years', '€3,200', [(3200, '40 trades a year at €8', INT)])])),
    N("You make 25 trades a year and each one costs a €6 fee. You have €5,000 invested. How much do the fees weigh in a year, as a percentage of the capital?", 3, '%',
      r"\(25 \times 6 = \text{€}150\) a year. \(\dfrac{150}{5{,}000} =\) **3%**. Before you even earn anything, you have to make up the 3%."),
    P("The rules of someone who doesn't trust themselves", r'''
Good investors are not the ones who don't have these weaknesses. They are the ones who know they have them and give themselves rules.

• **Write the plan beforehand**: how much you invest, in what, for how long.
• **Make it automatic**: a fixed payment every month decides in your place.
• **Diversify**: that way you don't have to be right about a single stock.
• **Look rarely**: once or twice a year is enough to rebalance.
• **Keep costs low**: costs are the only certain thing about an investment.

They are the ideas of this whole course, lined up. None of them requires predicting the future, and that is why they work.'''),
    M(('Loss aversion', 'A loss weighs more than an equal gain'), ('Herd behavior', 'Doing something because everyone is doing it'), ('FOMO', 'The fear of being left out of a gain'), ('Overconfidence', 'Believing you are better than average')),
    Q('You have picked three stocks in a row correctly. What does it prove?', ['That you can predict the market', 'Little: three hits can be luck', 'That you should bet everything on the next one'], 1,
      'Three results are too few to tell skill from luck. The risk is feeling like an expert and starting to bet bigger amounts.'),
    Q("Two investors have the same portfolio. One makes 50 trades a year, the other 2. With the same return before costs, who ends up with more?", ['The one who makes 50', "It's the same", 'The one who makes 2'], 2,
      'Every trade costs a fee, and often taxes too. With the same return before costs, whoever trades less keeps more.'),
  ], "Feeling better than average makes you trade too much, and trading costs money. A written, automatic, low-cost plan almost always beats instinct."),
])
