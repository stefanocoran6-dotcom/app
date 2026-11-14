#!/usr/bin/env python3
# Il glossario inglese: le spiegazioni che l'app mostra quando si tocca una parola in grassetto nelle lezioni. Scrive glossario_en.json.
# Ogni riga: (voce italiana di GLOSS_DEF in ../ordine/p10_data.js, titolo inglese, spiegazione).
# La chiave inglese è il termine di termini.json (il campo "en"), così le lezioni e il glossario non possono scostarsi.
# Le forme in più di termini.json ("anche") diventano rimandi alla voce; ALIAS serve per i rimandi che vanno scelti a mano.
# Le cifre sono scritte in € come nelle lezioni: per chi sceglie gli Stati Uniti l'app le mostra in $.
# Regole: inglese americano, "you", niente virgolette doppie né lineette lunghe; nessun fatto solo italiano nelle voci delle lezioni A.
import json, os, re, sys
H = os.path.dirname(os.path.abspath(__file__))
T = json.load(open(os.path.join(H, 'termini.json'), encoding='utf-8'))['termini']
norm = lambda t: re.sub(r'\s+', ' ', re.sub(r'[.,;:!?()«»“”]', '', t.lower())).strip()

G = [
 # i soldi nel tempo
 ('mezzo di scambio', 'Medium of exchange', "One of the three jobs of money: you hand it over in exchange for what you need, without having to swap one thing for another."),
 ('unità di conto', 'Unit of account', "One of the three jobs of money: it works as a yardstick to measure and compare prices."),
 ('riserva di valore', 'Store of value', "One of the three jobs of money: it keeps its value over time, so you can earn today and spend later."),
 ('investimenti', 'Investments', "Using money today to have more in the future, accepting some risk: for example by buying stocks, bonds or shares of a fund."),
 ('capitale', 'Principal', "The starting amount, not counting interest: the sum you lend, deposit or invest, or the sum you borrow and have to pay back."),
 ('interessi', 'Interest', "The payment for using money over time. You receive it when you lend or deposit money, and you pay it when you borrow. It is calculated as a percentage of the amount."),
 ('tasso', 'Rate', "Interest expressed as a percentage of the amount, usually for one year. A rate of 5% a year means €5 of interest for every €100, every year."),
 ('interesse semplice', 'Simple interest', "Interest calculated only on the starting principal. The interest is the same every year."),
 ('montante', 'Final amount', "The end figure: the starting principal plus the interest earned."),
 ('paniere', 'Basket', "The list of goods and services that stands for what households typically spend. It is used to measure how much prices go up."),
 ("potere d'acquisto", 'Purchasing power', "How much you can buy with a given amount of money. If prices go up and the amount stays the same, purchasing power goes down."),
 ('tasso nominale', 'Nominal rate', "The rate written on the contract: it tells you how much the amount grows, without taking inflation into account."),
 ('tasso reale', 'Real rate', "The rate after inflation: it tells you how much what you can actually buy really grows. It is roughly the nominal rate minus inflation."),
 # entrate e uscite
 ('entrate', 'Income', "The money that comes in over a period: salary, pension, rent you collect."),
 ('uscite', 'Expenses', "The money you spend over a period, from utility bills to coffee."),
 ('saldo', 'Balance', "The difference between income and expenses. If it is positive you have something left over; if it is negative you spent more than you earned."),
 ('spese fisse', 'Fixed expenses', "The expenses that come back every month for the same amount or nearly, like rent, utility bills and subscriptions."),
 ('spese variabili', 'Variable expenses', "The expenses that change from one month to the next and depend on what you do, like groceries, eating out and clothes."),
 ('risparmio', 'Savings', "The part of your income that you don't spend and set aside."),
 ('bisogni', 'Needs', "The expenses you can't do without: housing, bills, food, transport to work."),
 ('desideri', 'Wants', "The expenses that make life more enjoyable but could be cut back: eating out, trips, subscriptions."),
 ('fondo di emergenza', 'Emergency fund', "A sum kept aside only for the unexpected, usually equal to 3 to 6 months of expenses, in an account you can withdraw from right away."),
 ('liquido', 'Liquid', "Said of money or investments you can use quickly and without losing out. A checking account is liquid; a house is not."),
 ('liquidità', 'Liquidity', "How quickly you can turn something into cash without losing out. Money ready to use is also called liquidity."),
 ('conto corrente', 'Checking account', "The everyday account: you use it to receive your salary and to pay. It earns little or nothing."),
 ('conto deposito', 'Savings account', "An account made to leave a sum untouched in exchange for interest. It can be flexible, if you can withdraw whenever you want, or locked for a set time."),
 # debiti e prestiti
 ('rata', 'Installment', "The amount you pay at each due date to pay back a loan. It contains a part of interest and a part of principal."),
 ('tan', 'Nominal interest rate', "The yearly interest rate of the loan, not counting fees."),
 ('taeg', 'APR', "Annual percentage rate. It is what the loan costs you in a year, putting together interest and mandatory fees. It is the number to compare between different offers."),
 ('spese', 'Fees', "The costs of a loan that are not interest: setting up the loan, collecting each payment, the insurance the bank requires you to take out."),
 ('mutuo', 'Mortgage', "The long-term loan you take out to buy a home. It is secured by the home itself."),
 ('ipoteca', 'Lien', "The guarantee you give the bank when you take out a mortgage: if you stop paying, the bank can have the home sold to get its money back."),
 ('tasso fisso', 'Fixed rate', "A rate that stays the same for the whole life of the loan. The payment doesn't change either."),
 ('tasso variabile', 'Adjustable rate', "A rate that follows a market benchmark rate: when that goes up or down, your payment changes too."),
 ('spread', 'Spread', "The difference between two rates. On a mortgage it is the markup the bank adds to the benchmark rate. In the news it is the gap between the yield on Italian government bonds (BTPs) and on German ones (Bunds)."),
 ('revolving', 'Revolving card', "A credit card that lets you pay back what you spend in installments, charging interest on the debt that remains. The rate is often high."),
 ('sistemi di informazioni creditizie', 'Credit bureaus', "Databases where banks and lenders record loan applications and payments, on time or late. They check them before granting credit."),
 # capire le notizie
 ('inattivi', 'Economically inactive', "People who don't have a job and aren't looking for one: students, retirees, people who take care of the home, people who have stopped looking. They are not counted among the unemployed."),
 ('pil pro capite', 'GDP per capita', "GDP divided by the number of inhabitants. It is used to compare living standards between countries of different sizes."),
 ('carrello della spesa', 'Shopping basket', "The trend of prices for food and for household and personal care products: the things people buy most often."),
 ('deficit', 'Deficit', "How much the government spends beyond what it takes in during a year. It is measured as a percentage of GDP."),
 ('saldo primario', 'Primary balance', "The difference between the government's revenue and spending, not counting the interest on the debt. When it is positive it is called a primary surplus."),
 ('punti base', 'Basis points', "Hundredths of a percentage point: 100 basis points are 1%. They are used to measure small differences between rates."),
 ('rating', 'Rating', "The grade an agency gives to the ability of a government or a company to pay back its debts. It goes from AAA, the highest, to D."),
 ('investment grade', 'Investment grade', "The band of the highest ratings, from AAA to BBB−: debt considered reliable. Below this line, bonds are called speculative."),
 ('outlook', 'Outlook', "The expected direction. Next to a rating it can be positive, stable or negative: it says where the grade might move."),
 ('capitalizzazione', 'Market capitalization', "The value of a company on the stock market: the price of one share times the number of shares."),
 # assicurazioni
 ('assicurazione', 'Insurance', "An agreement in which you pay a small, certain amount to a company, which in return compensates you if you suffer a loss covered by the contract."),
 ('premio', 'Premium', "The price of insurance: the amount you pay the company, usually once a year."),
 ('indennizzo', 'Payout', "The sum the insurance company pays you when you suffer a loss covered by the policy."),
 ('polizza', 'Policy', "The insurance contract. It says what is covered, how much you pay and how much you receive in case of loss."),
 ('esclusioni', 'Exclusions', "The cases in which the policy doesn't pay, written in the contract. It is the part to read most carefully."),
 ('franchigia', 'Deductible', "The fixed part of each loss that stays with you. With a €500 deductible, on €3,000 of damage the company pays €2,500."),
 ('scoperto', 'Percentage deductible', "The part of each loss that stays with you, expressed as a percentage. With a 10% deductible, on €3,000 of damage you pay €300."),
 ('massimale', 'Coverage limit', "The highest amount the company pays for a loss. The part above the limit stays with you."),
 ('responsabilità civile', 'Liability', "The obligation to compensate for the damage you cause to other people or to their property. The insurance that covers it is called liability insurance."),
 ('rc auto', 'Auto liability insurance', "The insurance that pays for the damage you cause to others with your vehicle. In most places the law requires every driver to have it."),
 # truffe
 ('schema ponzi', 'Ponzi scheme', "A scam in which there is no real investment: the gains paid to the first people in are the money paid in by those who join later. When the new arrivals run out, it collapses."),
 ('phishing', 'Phishing', "A fake email that imitates your bank, a courier or an agency, to get you to open a link and enter data or codes."),
 ('smishing', 'Smishing', "Phishing done with a text message or a chat message. It can show up in the same conversation as the real messages from your bank."),
 ('vishing', 'Vishing', "The scam done by phone: a fake agent from your bank, or from another service, talks you into giving away codes or moving money."),
 ('spoofing', 'Spoofing', "Faking the name of the sender of a message or the number of the caller, so that it looks like someone you trust is writing or calling."),
 ("furto d'identità", 'Identity theft', "Using another person's data, such as ID documents and personal numbers, to get loans or open accounts in their name."),
 # polizze vita
 ('temporanea caso morte', 'Term life insurance', "A policy that pays a sum to the people named if the insured person dies before a set date. If the insured is still alive at the end, it pays nothing."),
 ('polizza rivalutabile', 'With-profits policy', "A life insurance policy that is also an investment, linked to the company's prudent management. The capital grows slowly, usually with a guarantee written in the contract."),
 ('unit-linked', 'Unit-linked policy', "A life insurance policy that is also an investment, whose value follows that of the funds it is linked to. The risk that the funds go down is borne by the person who takes it out."),
 ('caricamento', 'Premium charge', "The part of each payment that a policy keeps to cover its costs, before investing the rest."),
 ('kid', 'KID', "Key information document: a document of at most three pages with the key facts about an investment product: risks, scenarios and costs. It must be handed to you before you sign."),
 # investire
 ('azioni', 'Stocks', "Ownership stakes in a company. They earn through dividends and through a rising price, but nothing is guaranteed."),
 ('dividendo', 'Dividend', "The part of profit that a company distributes to its owners, that is, to the people who hold its stock."),
 ('obbligazioni', 'Bonds', "Loans made to a company or to a government. In return you receive interest at fixed dates, the coupons, and the repayment of the principal at maturity."),
 ('cedola', 'Coupon', "The interest that a bond pays at fixed dates, for example once a year."),
 ('rimborso', 'Redemption', "The paying back of the principal lent, at the maturity of the bond."),
 ('fondo comune', 'Mutual fund', "A vehicle that gathers the money of many savers and invests it in many securities together. Those who take part own shares of the fund."),
 ('quote', 'Shares', "The equal parts a fund is divided into. Whoever invests in a fund buys shares, and the value of each share changes over time."),
 ('etf', 'ETF', "A fund that is bought and sold on the stock exchange like a stock. It usually tracks an index, that is, a basket of securities chosen by a fixed rule, and it costs little."),
 ('rischio', 'Risk', "The possibility that the result is different from what was expected, for better or for worse. The higher it is, the further results can move from the average."),
 ('diversificare', 'Diversify', "Splitting your money among many different investments, so the trouble of just one weighs little on the total."),
 ('orizzonte temporale', 'Time horizon', "The time that passes before you need the money you invested. The longer it is, the more ups and downs you can bear."),
 ('lordo', 'Gross', "Before costs and taxes are taken out."),
 ('netto', 'Net', "What is left after costs and taxes are taken out."),
 ('pic', 'Lump sum', "Investing a whole sum all at once, in a single go."),
 ('pac', 'Dollar-cost averaging', "Investing a fixed amount at regular intervals, usually every month."),
 ('prezzo medio di carico', 'Average purchase price', "What each share or unit cost you on average: the total paid in divided by the number of shares you own. It is your break-even point."),
 ('asset allocation', 'Asset allocation', "How you split your money among different types of investments, for example how much in stocks and how much in bonds."),
 ('ribilanciare', 'Rebalance', "Bringing the portfolio back to the split you chose, by selling a bit of what went up and buying what lagged behind."),
 ('avversione alle perdite', 'Loss aversion', "The tendency to suffer more from a loss than you enjoy a gain of the same size: about twice as much."),
 ('fomo', 'FOMO', "Short for fear of missing out: the worry of being left out of a gain that others are making."),
 ('effetto gregge', 'Herd behavior', "The tendency to do something because everyone is doing it, without asking whether it makes sense."),
 ('bolla', 'Bubble', "A phase in which prices rise much more than the real value of what is being bought, pushed by enthusiasm. It ends with a sudden drop."),
 ('eccesso di fiducia', 'Overconfidence', "The tendency to believe you are better or better informed than average. In investing it leads to taking too much risk and to buying and selling too often."),
 ('commissione', 'Fee', "The payment you make to an intermediary for a service, for example every time you buy or sell securities."),
 # leggere un'azienda
 ('stato patrimoniale', 'Balance sheet', "The document that takes a snapshot of a company on one specific day: what it owns, what it owes to others and what is left for its owners."),
 ('attività', 'Assets', "What a company owns: cash, inventory, equipment, money owed by customers."),
 ('passività', 'Liabilities', "What a company owes to others: debts with banks, suppliers, the tax authorities."),
 ('patrimonio netto', 'Equity', "What is left to the owners of a company once all the debts are paid: assets minus liabilities."),
 ('conto economico', 'Income statement', "The document that tells the story of a period, usually a year: how much the company took in, how much it spent and how much was left."),
 ('ricavi', 'Revenue', "What a company takes in by selling its products or services."),
 ('costi', 'Costs', "What is spent to obtain something. For a company they are raw materials, salaries, rent; for an investor they are fees and management costs."),
 ('utile', 'Profit', "What is left to a company after taking costs away from revenue."),
 ('margine lordo', 'Gross margin', "Revenue minus the cost of the goods sold. It tells you how much is left before paying salaries, rent and the other overhead costs."),
 ('risultato operativo', 'Operating income', "What the company earns from its business, before paying interest and taxes."),
 ('utile netto', 'Net income', "What is left to the company after everything is taken out: costs, interest and taxes."),
 ('margine netto', 'Net margin', "Net income divided by revenue: how many cents the company keeps for every €1 of sales."),
 ('competenza', 'Accrual basis', "The rule that revenue and costs are recorded when they arise, not when the money comes in or goes out."),
 ('ammortamento', 'Depreciation', "The share of the cost of an asset that lasts several years, like a machine, counted in each year it is used."),
 ('rendiconto finanziario', 'Cash flow statement', "The document that shows a company's real cash movements: the money that came in and the money that went out."),
 ('p/e', 'P/E', "The ratio between the price of a share and the earnings per share: how much you pay for each €1 of yearly earnings."),
 # l'economia
 ('banca centrale', 'Central bank', "The institution that manages the money of a country or an area, like the Federal Reserve for the dollar or the ECB for the euro. It sets the policy rates to keep prices stable."),
 ('tassi di riferimento', 'Policy rates', "The rates set by the central bank. The rates on mortgages, loans and savings accounts depend on them, one after the other."),
 ('tasso di cambio', 'Exchange rate', "The price of one currency expressed in another. If the euro/dollar rate is 1.10, with 1 euro you buy 1.10 dollars."),
 ('rischio di cambio', 'Currency risk', "The risk of gaining or losing because the value of the currency you invested in changes."),
 ('pil', 'GDP', "Gross domestic product: the value of all the goods and services produced in a country in a year. It is the thermometer of the economy."),
 ('recessione', 'Recession', "A phase in which the economy shrinks. The rule of thumb: GDP falls for two quarters in a row."),
]

# rimandi scelti a mano: la forma ambigua va alla voce che le lezioni intendono
ALIAS = {'share': 'shares'}
# forme di termini.json troppo generiche per diventare un rimando da sole
NO_RIMANDO = {'payment', 'unit', 'units'}

def main():
    out = {}; usati = set()
    for it, titolo, testo in G:
        if it not in T: sys.exit(f'voce italiana sconosciuta: {it}')
        if it in usati: sys.exit(f'voce doppia: {it}')
        usati.add(it)
        k = norm(T[it]['en'])
        if k in out: sys.exit(f'chiave inglese doppia: {k}')
        if '"' in testo or '—' in testo or '"' in titolo: sys.exit(f'caratteri vietati in: {it}')
        out[k] = {'it': it, 'titolo': titolo, 'testo': testo}
    out['_alias'] = ALIAS
    out['_nessun_rimando'] = sorted(NO_RIMANDO)
    json.dump(out, open(os.path.join(H, 'glossario_en.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'glossario_en.json: {len(G)} voci')

if __name__ == '__main__':
    main()
