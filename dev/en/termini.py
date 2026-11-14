# Tabella dei termini italiano -> inglese (inglese americano; negli esempi l'euro, che l'app mostra come dollaro per chi sceglie gli Stati Uniti). Scrive termini.json.
# Chiave: la voce del glossario italiano (GLOSS_DEF in ../ordine/p10_data.js). Valore: termine inglese, poi eventuali forme accettate in più.
# Se una riga finisce con una nota (dopo #), la nota vale per chi traduce.
import json, os
T = {
 # i soldi nel tempo
 'mezzo di scambio': ['medium of exchange'], 'unità di conto': ['unit of account'], 'riserva di valore': ['store of value'],
 'investimenti': ['investments', 'investment', 'investing'], 'capitale': ['principal', 'capital'],   # principal nei prestiti e negli interessi; capital o lump sum altrove
 'interessi': ['interest'], 'tasso': ['rate', 'interest rate'], 'interesse semplice': ['simple interest'], 'montante': ['final amount'],
 'interesse composto': ['compound interest', 'interest on interest'], 'inflazione': ['inflation'], 'paniere': ['basket'], "potere d'acquisto": ['purchasing power'],
 'tasso nominale': ['nominal rate'], 'tasso reale': ['real rate'],
 # entrate e uscite
 'entrate': ['income'], 'uscite': ['expenses', 'spending'], 'saldo': ['balance'], 'spese fisse': ['fixed expenses', 'fixed expense'], 'spese variabili': ['variable expenses', 'variable expense'],
 'risparmio': ['savings', 'saving'], 'budget': ['budget'], 'bisogni': ['needs'], 'desideri': ['wants'], 'fondo di emergenza': ['emergency fund'],
 'liquido': ['liquid'], 'liquidità': ['liquidity', 'cash'], 'conto corrente': ['checking account', 'current account'], 'conto deposito': ['savings account', 'deposit account'],
 # lo stipendio (solo Italia)
 'ral': ['gross annual salary', 'RAL'], 'contributi': ['social security contributions', 'contributions', 'contribution'], 'imponibile fiscale': ['taxable income'],
 'imponibile previdenziale': ['contribution base'], 'irpef': ['IRPEF'], 'irpef lorda': ['gross IRPEF'], 'addizionali': ['local surtaxes', 'local surtax'],
 'conguaglio': ['year-end adjustment'], 'naspi': ['NASpI'], 'estratto conto contributivo': ['contribution statement'], 'a scaglioni': ['in bands', 'bands', 'tax bands'],
 'aliquota media': ['average rate'], 'aliquota marginale': ['marginal rate'], 'detrazioni': ['tax credits', 'tax credit'],   # MAI deduction: la detrazione riduce l'imposta
 'deduzione': ['deduction', 'deductions'],                                                                                # riduce il reddito su cui si calcola l'imposta
 'taglio del cuneo': ['tax wedge cut'], 'tfr': ['TFR'], 'tassazione separata': ['separate taxation'],
 # la banca e i pagamenti
 'imposta di bollo': ['stamp duty'], 'giacenza media': ['average balance'], 'riepilogo delle spese': ['statement of fees'], 'carta di debito': ['debit card', 'debit cards'],
 'carta di credito': ['credit card', 'credit cards'], 'prepagata': ['prepaid card', 'prepaid'], 'plafond': ['credit limit'], 'a saldo': ['in full'],
 'pre-autorizzazione': ['pre-authorization'], 'anticipo di contante': ['cash advance'], 'bonifico istantaneo': ['instant transfer', 'instant transfers'], 'iban': ['IBAN'],
 'orario limite': ['cut-off time'], 'verifica del beneficiario': ['verification of payee'], 'addebito diretto': ['direct debit', 'direct debits'],
 'fondo di garanzia': ['deposit guarantee scheme'], 'depositi': ['deposits', 'deposit'], 'istituti di pagamento': ['payment institutions', 'payment institution'],
 'autenticazione forte': ['strong customer authentication'], 'colpa grave': ['gross negligence'], 'chargeback': ['chargeback'],
 # debiti e prestiti
 'rata': ['installment', 'installments', 'repayment', 'payment'], 'quota interessi': ['interest portion'], 'quota capitale': ['principal portion'], 'debito residuo': ['remaining balance', 'outstanding balance', 'remaining debt'],
 'tan': ['nominal interest rate', 'TAN'], 'taeg': ['APR', 'TAEG'],   # TAEG = annual percentage rate of charge: in inglese APR; la sigla italiana solo dove serve riconoscerla su un contratto italiano
 'spese': ['fees'], 'mutuo': ['mortgage'], 'ipoteca': ['lien'], 'tasso fisso': ['fixed rate'], 'tasso variabile': ['adjustable rate', 'variable rate'], 'spread': ['spread', 'margin'],
 'revolving': ['revolving credit', 'revolving'], 'sistemi di informazioni creditizie': ['credit bureaus', 'credit bureau'], 'assicurazione obbligatoria': ['mandatory insurance', 'required insurance', 'compulsory insurance'],
 # capire le notizie
 'inattivi': ['economically inactive', 'inactive'], 'tasso di disoccupazione': ['unemployment rate'], 'tasso di occupazione': ['employment rate'], 'pil pro capite': ['GDP per capita'],
 'carrello della spesa': ['shopping basket'], 'deficit': ['deficit'], 'debito pubblico': ['public debt'], 'saldo primario': ['primary balance', 'primary surplus'],
 'punti base': ['basis points', 'basis point'], 'rating': ['rating', 'credit rating'], 'investment grade': ['investment grade'], 'outlook': ['outlook'],
 'capitalizzazione': ['market capitalization', 'market cap'], 'btp': ['BTP', 'BTPs'], 'bot': ['BOT', 'BOTs'], 'bund': ['Bund', 'Bunds'],
 # la pensione (solo Italia)
 'a ripartizione': ['pay-as-you-go'], 'pensione di vecchiaia': ['old-age pension'], 'pensione anticipata': ['early pension'], 'tasso di sostituzione': ['replacement rate'],
 'montante contributivo': ['notional balance'], 'coefficiente di trasformazione': ['conversion coefficient'], 'fondo pensione': ['pension fund', 'pension funds'],
 'fondi negoziali': ['occupational pension funds'], 'fondi aperti': ['open pension funds'], 'pip': ['PIP', 'PIPs'], 'isc': ['ISC'], 'covip': ['COVIP'],
 # la casa
 'anticipo': ['down payment'],   # non deposit: deposit è la caparra
 'perizia': ['appraisal'], 'caparra': ['deposit', 'earnest money'], 'contratto preliminare': ['preliminary contract'], 'garante': ['guarantor'],
 'fondo prima casa': ['First Home Guarantee Fund'], 'prima casa': ['first home'], 'rendita catastale': ['cadastral income'], 'prezzo-valore': ['price-value rule'],
 'surroga': ['mortgage transfer'], 'rinegoziazione': ['renegotiation'], 'sostituzione del mutuo': ['mortgage replacement'],
 # proteggersi
 'assicurazione': ['insurance'], 'premio': ['premium'], 'indennizzo': ['payout'], 'polizza': ['policy'], 'esclusioni': ['exclusions', 'exclusion'],
 'franchigia': ['deductible'],         # americano; non excess
 'scoperto': ['percentage deductible'], 'massimale': ['coverage limit', 'policy limit'], 'responsabilità civile': ['liability', 'third-party liability'], 'rc auto': ['auto liability insurance'],
 'schema ponzi': ['Ponzi scheme'], 'phishing': ['phishing'], 'smishing': ['smishing'], 'vishing': ['vishing'], 'spoofing': ['spoofing'], "furto d'identità": ['identity theft'],
 'temporanea caso morte': ['term life insurance'], 'polizza rivalutabile': ['with-profits policy'], 'unit-linked': ['unit-linked policy', 'unit-linked'],
 'caricamento': ['premium charge'], 'kid': ['KID'], 'reclamo': ['complaint', 'written complaint'], 'abf': ['ABF'], 'acf': ['ACF'], 'arbitro assicurativo': ['Insurance Ombudsman'],
 # gli strumenti
 'azioni': ['stocks', 'stock', 'shares', 'share'], 'dividendo': ['dividend'], 'obbligazioni': ['bonds', 'bond'], 'cedola': ['coupon'], 'rimborso': ['redemption'],
 'fondo comune': ['mutual fund', 'mutual funds', 'investment fund'], 'quote': ['shares', 'share', 'units', 'unit'], 'etf': ['ETF', 'ETFs'],
 # rischio, tempo e costi
 'rischio': ['risk'], 'diversificare': ['diversify', 'diversification'], 'orizzonte temporale': ['time horizon'], 'lordo': ['gross'], 'netto': ['net'],
 # investire passo passo
 'pic': ['lump sum'], 'pac': ['dollar-cost averaging', 'regular investment plan'], 'prezzo medio di carico': ['average purchase price'], 'asset allocation': ['asset allocation'], 'ribilanciare': ['rebalance', 'rebalancing'],
 # la testa dell'investitore
 'avversione alle perdite': ['loss aversion'], 'fomo': ['FOMO'], 'effetto gregge': ['herd behavior'], 'bolla': ['bubble'], 'eccesso di fiducia': ['overconfidence'], 'commissione': ['fee', 'fees'],
 # leggere un'azienda
 'stato patrimoniale': ['balance sheet'], 'attività': ['assets'], 'passività': ['liabilities'], 'patrimonio netto': ['equity'], 'conto economico': ['income statement'],
 'ricavi': ['revenue'], 'costi': ['costs'], 'utile': ['profit', 'earnings'], 'margine lordo': ['gross margin'], 'risultato operativo': ['operating income', 'operating profit'], 'utile netto': ['net income', 'net profit'],
 'margine netto': ['net margin'], 'competenza': ['accrual basis'], 'ammortamento': ['depreciation'], 'rendiconto finanziario': ['cash flow statement'], 'p/e': ['P/E', 'price/earnings'],
 # l'economia intorno
 'banca centrale': ['central bank'], 'tassi di riferimento': ['policy rates', 'policy rate'], 'tasso di cambio': ['exchange rate'], 'rischio di cambio': ['currency risk', 'exchange rate risk'],
 'pil': ['GDP'], 'recessione': ['recession'], 'indice di borsa': ['stock market index', 'index'], 'inflazione di fondo': ['core inflation'], 'pun': ['PUN'],
 'megawattora': ['megawatt-hour'], 'fed': ['Fed'], 'wall street': ['Wall Street'],
}
# parole ricorrenti che non sono voci del glossario ma vanno rese sempre allo stesso modo
ALTRE = {
 'busta paga': 'pay stub', 'stipendio lordo / netto': 'gross / net pay', 'datore di lavoro': 'employer', 'bolletta': 'bill', 'bonifico': 'bank transfer',
 'prelievo': 'withdrawal', 'estratto conto': 'bank statement', 'canone': 'monthly fee', 'prestito': 'loan', 'finanziaria': 'finance company', 'penale': 'penalty',
 'notaio': 'notary', 'agenzia (immobiliare)': 'real estate agent', 'affitto': 'rent', 'titoli di Stato': 'government bonds', 'Borsa': 'stock market',
 'rendimento': 'return', 'costi (di un fondo)': 'costs', 'figurina': 'sticker', 'unità': 'unit', 'lezione': 'lesson', 'In breve': 'In short',
 'truffa': 'scam', 'risparmi': 'savings', 'spesa (al supermercato)': 'groceries', 'a testa': 'per person', 'Stato': 'the State / the government',
}
if __name__ == '__main__':
    out = dict(termini={k: dict(en=v[0], anche=v[1:]) for k, v in T.items()}, altre=ALTRE)
    json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'termini.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('termini:', len(T), '| altre parole:', len(ALTRE))
