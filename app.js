import React, { useState, useEffect, useRef, useReducer, createContext, useContext } from 'react';
import { Star, Lock, Check, X, Home, BookOpen, User, MessageSquare, Send, Brain, Play, ChevronRight, ChevronLeft, Calculator, Clock, Flame, Target, Zap, Mail, Eye, EyeOff, LogOut, AlertCircle, Sun, Moon, TrendingUp, Award, Trophy, BarChart3, GraduationCap, Sparkles, Layers, RotateCcw, ChevronDown } from 'lucide-react';

// ========== CFA CURRICULUM DATABASE ==========
const CFA_CURRICULUM = {
  equity: {
    id: 'equity',
    name: 'Equity Investments',
    icon: '📈',
    weight: '11-14%',
    color: 'from-blue-500 to-indigo-600',
    totalModules: 8,
    modules: [{
      id: 'equity-lm1',
      number: 1,
      title: 'Market Organization and Structure',
      estimatedTime: '4-6 hours',
      totalLOS: 12,
      los: [{
        id: 'a',
        code: 'LOS 36a',
        title: 'Explain the main functions of the financial system',
        commandWord: 'Explain',
        importance: 'HIGH',
        content: {
          introduction: 'The financial system performs six main functions that enable individuals, companies, and governments to achieve their financial objectives.',
          sections: [{
            title: '1. SAVING',
            icon: '💰',
            content: 'Individuals and companies set aside money in the present to have more in the future.\n\n• Individuals save during working years to finance retirement\n• Companies save to repay suppliers, purchase equipment, or make acquisitions\n• Investors who accept more risk expect higher returns'
          }, {
            title: '2. BORROWING',
            icon: '🏦',
            content: 'Receiving money in the present that will be repaid in the future.\n\nSECURED LOANS:\n• Lender can sell collateral if borrower defaults\n• Examples: mortgages, auto loans\n• Lower interest rates\n\nUNSECURED LOANS:\n• No collateral\n• Examples: credit cards, student loans\n• Higher interest rates'
          }, {
            title: '3. RAISING EQUITY CAPITAL',
            icon: '📊',
            content: 'Companies raise equity capital by selling ownership shares.\n\n• Investment banks assist in issuing shares\n• Unlike debt, equity does not promise fixed payments\n• Investors expect dividends and capital gains'
          }, {
            title: '4. MANAGING RISKS',
            icon: '🛡️',
            content: 'Using financial instruments to offset adverse price movements.\n\nINSTRUMENTS:\n• Forward contracts\n• Futures contracts\n• Options contracts\n• Insurance contracts\n\nEXAMPLE: Airline buys fuel forward to hedge price risk'
          }, {
            title: '5. EXCHANGING ASSETS',
            icon: '🔄',
            content: 'Exchanging currencies, commodities for immediate delivery.\n\n• Spot market = immediate settlement\n• Spot price = current market price\n• Settlement typically T+2'
          }, {
            title: '6. INFORMATION-MOTIVATED TRADING',
            icon: '🧠',
            content: 'Trading based on informational advantage.\n\n• Traders expect EXCESS returns\n• Identify undervalued/overvalued securities\n• Active managers seek to beat benchmarks'
          }]
        },
        keyPoints: ['Financial system has 6 main functions', 'Saving = setting aside for future', 'Secured vs unsecured borrowing', 'Equity = selling ownership', 'Risk management via derivatives', 'Info trading = EXCESS returns'],
        examTips: ['🎯 Identify which function given a scenario', '⚠️ Secured vs unsecured key difference', '💡 Info traders seek EXCESS returns']
      }, {
        id: 'b',
        code: 'LOS 36b',
        title: 'Describe classifications of assets and markets',
        commandWord: 'Describe',
        importance: 'HIGH',
        content: {
          introduction: 'Financial assets and markets are classified into several categories.',
          sections: [{
            title: 'ASSET TYPES',
            icon: '📦',
            content: 'SECURITIES: Debt & Equity\nCURRENCIES: Forex market\nCONTRACTS: Derivatives\nCOMMODITIES: Metals, energy\nREAL ASSETS: Real estate'
          }, {
            title: 'PRIMARY vs SECONDARY',
            icon: '🏛️',
            content: 'PRIMARY MARKET:\n• NEW securities issued\n• Funds go to ISSUER\n• Examples: IPO\n\nSECONDARY MARKET:\n• EXISTING securities traded\n• Funds between INVESTORS\n• Examples: NYSE, NASDAQ'
          }, {
            title: 'MONEY vs CAPITAL',
            icon: '⏱️',
            content: 'MONEY MARKETS:\n• Maturity ≤ 1 year\n• T-bills, commercial paper\n\nCAPITAL MARKETS:\n• Maturity > 1 year\n• Bonds, stocks'
          }, {
            title: 'TRADITIONAL vs ALTERNATIVE',
            icon: '🔮',
            content: 'TRADITIONAL:\n• Public debt & equity\n• High liquidity\n\nALTERNATIVE:\n• PE, hedge funds, RE\n• Less liquid, higher returns'
          }]
        },
        keyPoints: ['5 asset types', 'PRIMARY = issuer receives', 'SECONDARY = investors trade', 'Money ≤ 1yr, Capital > 1yr'],
        examTips: ['🎯 Primary vs Secondary is KEY', '💡 IPO = primary, NYSE = secondary']
      }, {
        id: 'f',
        code: 'LOS 36f',
        title: 'Calculate leverage ratio, margin return, and margin call price',
        commandWord: 'Calculate',
        importance: 'VERY HIGH',
        content: {
          introduction: 'Margin transactions amplify returns using borrowed money. CALCULATION LOS!',
          sections: [{
            title: 'CONCEPTS',
            icon: '📚',
            content: 'MARGIN = buying with borrowed money\nINITIAL MARGIN = % investor puts up\nMAINTENANCE MARGIN = minimum equity (25%)\nMARGIN CALL = broker demands more funds'
          }, {
            title: 'LEVERAGE RATIO',
            icon: '⚖️',
            content: 'LEVERAGE = Total Value / Equity\n\nMAX LEVERAGE = 1 / Initial Margin\n\nExample: 40% margin = 2.5x leverage'
          }, {
            title: 'MARGIN CALL PRICE',
            icon: '🚨',
            content: 'MARGIN CALL PRICE = Debt / (1 - Maint. Margin)\n\nExample:\n• Buy at $30, Leverage 2x\n• Equity = $15, Debt = $15\n• Maint. margin = 25%\n\nCall Price = $15 / 0.75 = $20\n\nIf price hits $20 → MARGIN CALL!'
          }, {
            title: 'LEVERAGE EFFECT',
            icon: '⚡',
            content: 'Leverage AMPLIFIES both ways!\n\n2x leverage:\n• +10% price → +20% return ✅\n• -10% price → -20% return ❌\n\n⚠️ DOUBLE-EDGED SWORD'
          }]
        },
        keyPoints: ['Leverage = Value / Equity', 'Max Leverage = 1 / Initial Margin', 'Call Price = Debt / (1 - Maint%)', 'Leverage amplifies BOTH ways'],
        examTips: ['⚠️ MARGIN CALL FORMULA - MEMORIZE!', '📝 Practice calculations!']
      }]
    }]
  }
};

// ========== PORTFOLIO MANAGEMENT · READING 39-44 (53 LOS, teoria in italiano, formule LaTeX, domanda d'esame per ogni LOS) ==========
// ========== EQUITY VALUATION · READING 22-27 · 76 LOS (traduzione fedele AnalystPrep) ==========
CFA_CURRICULUM.equityValuation = {"id": "equityValuation", "name": "Equity Valuation", "icon": "📐", "weight": "10-15%", "color": "from-sky-500 to-indigo-600", "totalModules": 6, "modules": [{"id": "ev-r22", "number": 22, "title": "Equity Valuation: Applications and Processes", "estimatedTime": "2-3 ore", "totalLOS": 8, "los": [{"id": "a", "code": "LOS 22a", "title": "Definire la valutazione e il valore intrinseco e spiegare le fonti del mispricing percepito", "commandWord": "Definire", "importance": "HIGH", "content": {"introduction": "", "sections": [{"title": "Valutazione", "icon": "🏷️", "content": "La **valutazione** è il processo di stima del valore di un asset basato su:\n\n1. Variabili relative ai rendimenti futuri dell'investimento (**valutazione assoluta**).\n2. Confronto con asset simili (**valutazione relativa**).\n3. Stime del processo di liquidazione immediata."}, {"title": "Valore intrinseco e mispricing percepito", "icon": "🎯", "content": "Il **valore intrinseco** è il valore di un asset determinato da un investitore che ha una comprensione completa dell'asset. Gli investitori valutano un asset perché ritengono che il suo valore intrinseco differisca dal valore di mercato. Questo è noto come **mispricing percepito**. Questa differenza presenta un'opportunità di profitto quando il valore di mercato alla fine converge con il valore intrinseco.\n\nSecondo la teoria dei **mercati efficienti**, si assume che il valore intrinseco sia uguale al valore di mercato. Pertanto, la necessità per gli investitori di eseguire un'analisi di valutazione viene eliminata, poiché sia il valore intrinseco che quello di mercato sono uguali, e qualsiasi analisi comporterebbe costi aggiuntivi per l'investitore. Nessun investitore sosterrà questi costi aggiuntivi di raccolta e analisi dei dati su un asset a meno che non si aspetti di guadagnare rendimenti più elevati dal mispricing percepito.\n\nGli **investitori attivi** eseguono l'analisi di valutazione per guadagnare rendimenti più elevati rispetto a quelli proporzionali al rischio dell'asset. Un investitore attivo mira a guadagnare un rendimento aggiustato per il rischio positivo. Questo rendimento è noto come **rendimento anomalo (abnormal return)** o **alfa**."}, {"title": "Fonti del mispricing percepito", "icon": "🔍", "content": "Ci sono due possibili fonti di mispricing:\n\n1. **Mispricing reale (errore di mercato)**: è la differenza tra il prezzo di mercato e il valore intrinseco effettivo dell'asset.\n2. **Errore di valutazione (errore dell'analista)**: è la differenza tra il valore intrinseco effettivo e il valore intrinseco stimato.\n\n$$\\text{Mispricing percepito} = \\text{Mispricing reale} + \\text{Errore di valutazione}$$\n\n$$V_E - P = (V - P) + (V_E - V)$$\n\nDove:\n\n\\(V_E\\) = Valore stimato. \\(P\\) = Prezzo di mercato. \\(V\\) = Valore intrinseco reale.\n\nAnche senza un errore nella stima del valore intrinseco, un investitore potrebbe non realizzare i benefici dell'analisi di valutazione, poiché il valore di mercato potrebbe non convergere al valore intrinseco entro l'orizzonte di investimento dell'investitore."}]}, "keyPoints": ["Valutazione assoluta, relativa o di liquidazione", "Valore intrinseco = valore con comprensione completa dell'asset", "Mercati efficienti: valore intrinseco = prezzo, l'analisi non serve", "Mispricing percepito = mispricing reale + errore di valutazione", "Il prezzo può non convergere al valore entro il tuo orizzonte"], "examTips": ["Trucco: VE − P si scompone sommando e togliendo V: errore del mercato (V − P) + errore dell'analista (VE − V)", "Alfa = abnormal return, cioè rendimento aggiustato per il rischio positivo"], "question": {"q": "The value of an asset, given a hypothetically complete understanding of its investment characteristics, is most likely the:", "options": ["Fair market value.", "Intrinsic value.", "Investment value."], "ans": 1, "exp": "The intrinsic value is the value of the asset based on a hypothetically complete understanding of the asset's investment characteristics. In other words, it is the perceived actual value of an asset rather than its market price or book value.\n\n**A is incorrect.** The fair market price is the price at which an asset or liability changes hands between a willing buyer and a willing seller when neither party is under compulsion to buy or sell.\n\n**C is incorrect.** The investment value is the concept of value to a specific buyer considering potential synergies and based on the investor's requirements and expectations."}}, {"id": "b", "code": "LOS 22b", "title": "Spiegare il concetto di going concern e confrontare going concern value e liquidation value", "commandWord": "Spiegare", "importance": "MEDIUM", "content": {"introduction": "L'**ipotesi di continuità aziendale (going concern assumption)** è l'ipotesi che un'azienda continuerà a operare nel futuro immediato. Il valore di un'azienda secondo l'ipotesi di continuità aziendale è noto come **going concern value**.\n\nD'altra parte, il **valore di liquidazione (liquidation value)** è il valore di un'azienda se cessasse le operazioni e i suoi asset venissero venduti individualmente. Questo è appropriato per le aziende in difficoltà finanziaria. Nella maggior parte dei casi, il going concern value sarà più alto del valore di liquidazione, poiché incorpora il valore aggiunto dalle competenze manageriali e dalla sinergia degli asset. Tuttavia, il going concern value può essere inferiore per le aziende che subiscono perdite in modo continuativo.\n\nIl valore di liquidazione di un'azienda può cambiare drasticamente nel tempo, a seconda del tempo disponibile per vendere gli asset dell'azienda. Per un'azienda con beni deperibili, il valore dei beni deperibili si ridurrà significativamente nel tempo e quindi devono essere venduti rapidamente rispetto ai beni non deperibili, che possono essere venduti in modo ordinato. Questo conferisce ai beni non deperibili un **valore di liquidazione ordinato (orderly liquidation value)**.", "sections": []}, "keyPoints": ["Going concern = l'azienda continua a operare", "Liquidation value = asset venduti singolarmente", "Di norma going concern > liquidazione (management + sinergie)", "Eccezione: aziende in perdita continuativa", "Orderly liquidation value: più tempo per vendere → valore più alto"], "examTips": ["La liquidazione è la misura di valore di norma più bassa: tipico distrattore nelle domande \"least value\""], "question": {"q": "The value measure with the least value is most likely the:", "options": ["Investment value.", "Liquidation value.", "Going concern value."], "ans": 1, "exp": "Liquidation value has the least value. It is the value of a company if it ceased operations and its assets sold off. It is appropriate for companies under financial distress.\n\n**A is incorrect.** Investment value is the value to an investor because of the potential synergies the investor can get from the asset. Due to these potential synergies, investment value will be higher.\n\n**C is incorrect.** Going concern value is the value of a company under the going concern assumption, which assumes that a company will continue to operate in the foreseeable future."}}, {"id": "c", "code": "LOS 22c", "title": "Descrivere le definizioni di valore e giustificare quale definizione è più rilevante per la valutazione azionaria pubblica", "commandWord": "Descrivere", "importance": "MEDIUM", "content": {"introduction": "Il **fair value (valore equo)** è il prezzo che si riceverebbe per vendere un asset o si pagherebbe per trasferire una passività in una transazione ordinata tra partecipanti al mercato alla data di misurazione. È il valore utilizzato nel financial reporting.\n\nIl **fair market value (valore equo di mercato)** è il valore di un asset tra un compratore e un venditore che non hanno alcun obbligo di comprare o vendere e che sono entrambi pienamente consapevoli delle caratteristiche dell'asset. Nel lungo periodo, i prezzi di mercato tendono a riflettere il fair value se il mercato crede che il management stia agendo nel migliore interesse degli azionisti.\n\nUn asset può valere più del suo fair value per un investitore a causa delle potenziali sinergie che l'investitore può ricavare dall'asset. Questo valore più alto è chiamato **investment value (valore d'investimento)**.\n\nPertanto, un analista deve essere consapevole dello scopo di una valutazione. Il **valore intrinseco** è il concetto di valore rilevante quando si valutano le azioni pubbliche, mentre l'**investment value** è il più adatto per le acquisizioni.", "sections": []}, "keyPoints": ["Fair value → financial reporting", "Fair market value → compratore e venditore informati e non costretti", "Investment value → valore per uno specifico compratore (sinergie)", "Azioni pubbliche → valore intrinseco"], "examTips": ["Trucco: l'investment value dipende da CHI compra (le sue sinergie), il fair value no", "Domanda tipica: buyer strategico in un'acquisizione → investment value"], "question": {"q": "The most appropriate measure for strategic buyers pursuing acquisitions is the:", "options": ["Intrinsic value.", "Investment value.", "Fair market value."], "ans": 1, "exp": "Investment value is the concept of value to a specific buyer taking account of potential synergies and based on the investor's requirements and expectations. It is an appropriate measure for strategic buyers pursuing acquisitions.\n\n**A is incorrect.** The intrinsic value of any asset is the asset's value given a hypothetically complete understanding of the asset's investment characteristics. Intrinsic value is most appropriate when valuing public equities.\n\n**C is incorrect.** The fair market price is the price at which an asset or liability changes hands between a willing buyer and a willing seller when neither party is under compulsion to buy or sell."}}, {"id": "d", "code": "LOS 22d", "title": "Descrivere le applicazioni della valutazione azionaria", "commandWord": "Descrivere", "importance": "MEDIUM", "content": {"introduction": "I modelli e le tecniche di valutazione azionaria sono usati per realizzare quanto segue:", "sections": [{"title": "I. Selezione titoli (Stock Selection)", "icon": "🛒", "content": "• La valutazione azionaria è usata per determinare se un titolo è correttamente prezzato, sopravvalutato o sottovalutato rispetto al suo valore intrinseco e rispetto al prezzo di titoli comparabili."}, {"title": "II. Dedurre le aspettative di mercato (Deducing Market Expectations)", "icon": "🔮", "content": "Il prezzo di mercato di un'azione riflette le aspettative degli investitori sulla performance futura dell'azienda. Un analista può valutare queste aspettative rispetto alle proprie e/o usarle come benchmark per valutare altre aziende."}, {"title": "III. Valutare eventi societari (Evaluating Corporate Events)", "icon": "🏢", "content": "L'analisi di valutazione è usata per valutare l'impatto di eventi societari come fusioni, acquisizioni, dismissioni e spin-off sui flussi di cassa di un'azienda e di conseguenza sul valore dei suoi titoli.\n\n• Una **fusione (merger)** è la combinazione di due aziende.\n• Un'**acquisizione (acquisition)** è la combinazione di due aziende in cui una società, chiamata **acquirente (acquirer)**, acquista la maggior parte o tutte le azioni di un'altra, chiamata **target**.\n• Una **dismissione (divestiture)** si ha quando un'azienda cede i suoi asset o una business unit.\n• Uno **spin-off** si ha quando un'azienda separa una delle sue divisioni per creare una nuova entità legale, ma le sue azioni vengono emesse proporzionalmente solo agli azionisti attuali."}, {"title": "IV. Fornire fairness opinion (Rendering Fairness Opinion)", "icon": "⚖️", "content": "Possono essere richieste a terze parti per stabilire se il valore pagato per l'azienda è equo in eventi societari come le fusioni. Questo viene fatto utilizzando modelli di valutazione."}, {"title": "V. Valutare strategie e modelli di business (Evaluating Business Strategies and Models)", "icon": "♟️", "content": "Le aziende usano i modelli di valutazione per valutare l'impatto delle loro strategie sulla ricchezza degli azionisti."}, {"title": "VI. Comunicare con analisti e azionisti (Communicating with Analysts and Shareholders)", "icon": "🗣️", "content": "I modelli di valutazione forniscono una base di discussione tra azionisti, management e analisti su questioni societarie che influiscono sul valore di un'azienda."}, {"title": "VII. Valutare aziende private (Appraising Private Business)", "icon": "🔒", "content": "I modelli di valutazione sono usati per valutare aziende non quotate per scopi transazionali (es. acquisizione di tali aziende) o fiscali (es. la tassazione dei patrimoni/eredità)."}, {"title": "VIII. Compensi azionari (Share-based Compensation)", "icon": "🎁", "content": "I modelli di valutazione sono usati per stimare il valore della retribuzione esecutiva basata su azioni, es. concessioni di azioni vincolate (restricted stock grants)."}]}, "keyPoints": ["Stock selection: sotto/sopra/correttamente valutato", "Il prezzo contiene aspettative di mercato da \"leggere\"", "Valutare l'impatto di M&A, dismissioni, spin-off", "Fairness opinion, strategie, comunicazione", "Aziende private e compensi azionari"], "examTips": ["Attenzione al tranello: \"a merger\" NON è un'applicazione; lo è \"valutare l'impatto di un merger\""], "question": {"q": "Which of the following is least likely an application of equity valuation?", "options": ["The valuation of business strategies and models.", "Stock selection.", "A merger."], "ans": 2, "exp": "The question asks which is not an application of equity valuation. A merger is not an application of equity valuation. Evaluation of the impact of corporate events like mergers is an application of equity valuation.\n\n**A is incorrect.** Evaluation of business strategies and models on the impact of shareholder wealth is an application of equity valuation techniques.\n\n**B is incorrect.** Stock selection is an application of equity valuation techniques. These techniques are used to determine whether a security is underpriced, fairly priced, or overpriced."}}, {"id": "e", "code": "LOS 22e", "title": "Descrivere le fasi principali del processo di valutazione azionaria", "commandWord": "Descrivere", "importance": "HIGH", "content": {"introduction": "Ci sono cinque passi nel processo di valutazione:\n\n1. Comprendere il business.\n2. Prevedere la performance dell'azienda.\n3. Selezionare il modello di valutazione appropriato.\n4. Usare le previsioni in una valutazione.\n5. Applicare le conclusioni della valutazione.", "sections": [{"title": "1. Comprendere il business", "icon": "🏭", "content": "Per prevedere la performance finanziaria di un'azienda, un analista deve comprendere appieno il settore in cui l'azienda opera, la sua strategia e la sua performance finanziaria passata.\n\n**Analisi di settore e competitiva.** Un'analisi di settore completa consente all'analista di sviluppare scenari appropriati che possono essere usati nel processo di valutazione. La **sensitivity analysis (analisi di sensibilità)** è usata per determinare come una variazione di un input influisce sull'output dell'analisi.\n\nLe seguenti domande sono rilevanti per comprendere un business e il suo settore."}, {"title": "Quanto è attraente il settore in cui opera l'azienda?", "icon": "🌍", "content": "Le **cinque forze di Michael Porter** sono ampiamente usate per comprendere la struttura del settore. Esse sono:\n\n1. **L'intensità della rivalità di settore**: una bassa intensità di rivalità di settore — specialmente con pochi partecipanti in un settore in crescita — migliora la profittabilità del settore.\n2. **Nuovi entranti**: alte barriere all'ingresso nel settore risultano in pochi partecipanti e minore concorrenza, migliorando la profittabilità del settore.\n3. **Sostituti (substitutes)**: quando ci sono pochi sostituti o il costo di passaggio ai sostituti è elevato, le aziende del settore sono in grado di trasferire gli aumenti dei costi ai consumatori, migliorando quindi la profittabilità del settore.\n4. **Potere dei fornitori (supplier power)**: un settore con molti fornitori riduce il potere dei fornitori di aumentare i prezzi dei loro prodotti, perché i partecipanti del settore possono facilmente cambiare fornitore. Questo migliora la profittabilità del settore.\n5. **Potere degli acquirenti (buyer power)**: quando ci sono molti consumatori in un settore, i consumatori mancano del potere di negoziare prezzi più bassi. Questo migliora la profittabilità del settore."}, {"title": "Qual è la posizione competitiva e la strategia dell'azienda nel settore?", "icon": "♟️", "content": "Un'azienda che può creare e sostenere un vantaggio rispetto alla concorrenza avrà un valore più alto. Secondo Porter, ci sono tre strategie per raggiungere una performance sopra la media:\n\n1. **Cost leadership (leadership di costo)**: è quando un'azienda ha i costi di produzione più bassi mantenendo prodotti comparabili con i concorrenti, il che permette alle aziende di prezzare i loro prodotti al livello o vicino alla media di settore.\n2. **Offrire prodotti unici**: un'azienda che usa questa strategia dovrebbe avere spese di vendita più alte ma anche margini lordi più alti rispetto a un'azienda che usa una strategia di cost leadership. Questo perché può applicare un premio rispetto agli altri sul mercato.\n3. **Focus**: comporta il perseguimento di un vantaggio competitivo all'interno di un segmento o segmenti di un settore, basato su cost leadership o differenziazione."}, {"title": "Quanto bene l'azienda esegue la sua strategia?", "icon": "🏁", "content": "Analizzare i report finanziari passati di un'azienda dà un'idea di come abbia performato rispetto ai suoi obiettivi e fornisce una base per sviluppare la performance futura dell'azienda. Analizzando alcuni anni di report annuali passati, un analista può vedere come il management abbia previsto e si sia adattato alle sfide.\n\nQuando si analizza l'esecuzione strategica di un'azienda, un analista dovrebbe:\n\n• Considerare fattori non numerici come la struttura proprietaria, gli asset immateriali, le potenziali dispute legali e altre passività potenziali.\n• Evitare di estrapolare la performance passata quando si prevede la performance. Questo perché le aziende che vanno bene attireranno concorrenti e ridurranno la profittabilità, mentre le aziende che performano male verranno ristrutturate. Di conseguenza, la performance passata potrebbe non fornire un'indicazione affidabile dei risultati futuri, poiché si stima che la previsione di crescita di lungo periodo converga verso il tasso di crescita dell'economia."}, {"title": "Qualità delle informazioni di bilancio", "icon": "🧾", "content": "Le informazioni sul settore e sull'azienda possono derivare da disclosure obbligatorie, filing regolamentari, comunicati stampa, materiali di investor relations, contatti con altri analisti, organizzazioni di settore, fornitori di market intelligence.\n\nDue cose cruciali da considerare quando si usano le informazioni contabili sono:\n\n• **Qualità degli utili (quality of earnings)**: che comporta l'esame di tutti i bilanci per valutare la proporzione di reddito attribuibile alle attività operative core di un business.\n• **Sostenibilità (sustainability)**: che comporta l'analisi degli aspetti della performance che probabilmente si ripeteranno in futuro. Utili con componenti significative di eventi non ricorrenti sono di qualità inferiore e meno sostenibili.\n\nUn analista dovrebbe anche identificare le decisioni riportate che risultano in utili che è improbabile continuino. Per esempio, scomporre l'utile netto in una componente **accrual** (per competenza) e **cash** (per cassa). Un'azienda con un'alta proporzione di accrual indica che la maggior parte delle sue vendite sono vendute a credito. La componente cash è più persistente degli accrual, e le aziende con alti accrual avranno un return on assets (ROA) relativamente più basso in futuro. L'utile netto con un'alta proporzione di accrual è considerato di qualità inferiore."}, {"title": "Esempio: Qualità degli utili", "icon": "✏️", "content": "| Esempio | Interpretazione potenziale |\n|---|---|\n| Riconoscere i ricavi troppo presto. Per esempio, \"bill & hold\" di vendite e contabilizzare le vendite prima dell'accettazione da parte del cliente. | Reddito riportato ↑. Reddito futuro ↓. |\n| Riconoscere troppe o troppo poche riserve nel periodo corrente, es. accantonamenti per crediti dubbi, riserve di ristrutturazione. | Reddito corrente ↑/↓. Reddito futuro ↓. Porta a una probabile scarsa performance sottostante. |\n| Uso di finanziamenti fuori bilancio come leasing di asset o cartolarizzazione di crediti. | Asset e passività di bilancio potrebbero non essere correttamente riflessi in bilancio. |\n| Caratterizzazione di uno scoperto bancario come flusso di cassa operativo. | Il flusso di cassa operativo potrebbe essere gonfiato. |"}]}, "keyPoints": ["5 passi: capire → prevedere → modello → valutare → applicare", "Cinque forze di Porter: rivalità, entranti, sostituti, fornitori, acquirenti", "Tre strategie: cost leadership, differenziazione, focus", "Non estrapolare la performance passata", "Utili con molti accrual = qualità più bassa"], "examTips": ["Trucco per le 5 forze: \"RE-SO-FA\" → Rivalità, Entranti, SOstituti, Fornitori, Acquirenti", "Distrattore classico: cost leadership è una STRATEGIA, non una forza di Porter"], "question": {"q": "Which of the following is most likely one of Porter's five forces that are used to analyze an industry?", "options": ["Supplier power.", "Top-down forecasting approach.", "Cost leadership."], "ans": 0, "exp": "Supplier power is one of Porter's five factors that are used to analyze industry. An industry with many suppliers reduces suppliers' power to increase the prices of their products because industry participants can easily switch suppliers. This enhances industry profitability. The other factors include buyer power, substitutes, new entrants, the intensity of industry rivalry.\n\n**B is incorrect.** The top-down approach is one of the methods that is used in forecasting company performance.\n\n**C is incorrect.** Cost leadership is one of the strategies companies use to create and sustain a competitive advantage relative to the competition. The other strategies are differentiation and focus."}}, {"id": "f", "code": "LOS 22f", "title": "Confrontare i modelli di valutazione assoluti e relativi e descrivere esempi di ciascuno", "commandWord": "Confrontare", "importance": "HIGH", "content": {"introduction": "I due principali modelli di valutazione basati sull'ipotesi di continuità aziendale sono:\n\n1. Modelli di valutazione assoluti.\n2. Modelli di valutazione relativi.", "sections": [{"title": "1. Modelli di valutazione assoluti", "icon": "📐", "content": "Questi modelli stimano il valore intrinseco di un asset, che può essere confrontato con il suo prezzo di mercato. I modelli di valore assoluto includono i modelli del valore attuale e i modelli di valutazione basati sugli asset.\n\nI **modelli del valore attuale (present value models)**, chiamati anche modelli di **discounted cash flow**, si basano sull'ipotesi che il valore di un asset debba essere correlato ai flussi di cassa che un investitore si aspetta di ricevere dall'acquisizione dell'asset. Esempi di flussi di cassa includono dividendi, free cash flow e residual income. Vedremo tutti questi modelli in dettaglio nei reading successivi, ma per ora:\n\n• I **dividendi** sono flussi di cassa a livello degli azionisti che vengono pagati agli azionisti.\n• I **free cash flow** sono flussi di cassa dalle operazioni dopo le spese in conto capitale e le spese di capitale circolante. Ci sono due tipi di free cash flow:\n   1. **Free cash flow to equity (FCFE)**: sono i free cash flow dopo aver dedotto i pagamenti ai fornitori di debito.\n   2. **Free cash flow to the firm (FCFF)**: sono i free cash flow prima di effettuare i pagamenti ai fornitori di debito dell'azienda.\n• Il **residual income** è l'eccesso degli utili contabili rispetto al costo in dollari del capitale.\n\nI **modelli di valutazione basati sugli asset (asset-based valuation models)** usano una somma dei valori di mercato degli asset di un'azienda. Questo è spesso applicato alle aziende di risorse naturali."}, {"title": "2. Modelli di valutazione relativi", "icon": "🔗", "content": "Secondo i modelli di valutazione relativi, il valore di un asset è stimato rispetto a quello di un altro asset comparabile usando multipli di prezzo e multipli enterprise. L'ipotesi alla base di questo è che asset simili dovrebbero avere valori simili.\n\nI **multipli di prezzo (price multiples)** sono rapporti tra il prezzo del titolo e i fondamentali di un'azienda, come il rapporto price-to-earnings, il rapporto price-to-book value e il rapporto price-to-cash flow.\n\nI **multipli enterprise (enterprise multiples)** sono rapporti tra l'enterprise value (valore totale del capitale azionario e del debito al netto di cassa e investimenti a breve termine) e un fondamentale di valutazione come gli utili operativi.\n\nIl multiplo di prezzo più comunemente usato è il multiplo **price-to-earnings (P/E)**. Un titolo che vende a un P/E più basso rispetto al suo comparabile è considerato relativamente sottovalutato. Un problema comune con questo modello è che il prezzo del titolo comparabile potrebbe essere assolutamente sopravvalutato o sottovalutato. Usando l'approccio della valutazione relativa, l'analista assume che l'asset comparabile sia correttamente prezzato.\n\nIl modello di valutazione relativa è anche chiamato **metodo dei comparabili (method of comparables)**."}]}, "keyPoints": ["Assoluti → valore intrinseco (DDM, FCF, RI, asset-based)", "FCFE dopo il debito, FCFF prima del debito", "Asset-based → aziende di risorse naturali", "Relativi → multipli di prezzo ed enterprise", "Relativo assume il comparabile prezzato correttamente"], "examTips": ["\"Relativamente\" sottovalutato ≠ sottovalutato in assoluto: occhio alla parola", "I tre flussi dei modelli PV: dividendi, free cash flow, residual income"], "question": {"q": "Which of the following is an example of a cash flow used in present value models?", "options": ["Residual income.", "Price multiple.", "Enterprise multiple."], "ans": 0, "exp": "Residual income is one of the cash flows used in the present value models. The other is dividends and free cash flow.\n\n**B is incorrect.** Price multiples are ratios of stock price to a company's fundamental to estimate value. They fall under the relative valuation models.\n\n**C is incorrect.** Enterprise multiples are ratios of enterprise value to a valuation fundamental. They fall under relative valuation models."}}, {"id": "g", "code": "LOS 22g", "title": "Descrivere la sum-of-the-parts valuation e il conglomerate discount", "commandWord": "Descrivere", "importance": "MEDIUM", "content": {"introduction": "Il modello di valutazione **sum-of-the-parts** valuta un'azienda aggregando il valore stimato dei suoi diversi segmenti valutati come se fossero indipendenti. Il valore stimato da questo approccio è chiamato **breakup value** o **private market value**.\n\nQuesto approccio è appropriato per le aziende con segmenti diversi e non correlati. È anche usato per stimare il valore che può essere sbloccato da una ristrutturazione come uno spin-off, split-off o equity carve-off.\n\nUno **sconto di conglomerato (conglomerate discount)** può essere applicato alla valutazione sum-of-the-parts. Le spiegazioni per lo sconto di conglomerato includono:\n\n• **Inefficienza nell'allocazione del capitale di investimento tra le divisioni**: questa allocazione inefficiente del capitale non massimizza il valore per gli azionisti.\n• **Fattori endogeni**: le aziende che performano male si espanderanno facendo acquisizioni in settori non correlati.\n• **Errori di misurazione nella ricerca**: secondo alcuni, gli sconti di conglomerato non esistono, in quanto sono il risultato di una misurazione errata.\n\nUn breakup value superiore al going concern value di un'azienda può spingere verso una dismissione o uno spin-off.", "sections": []}, "keyPoints": ["Sum-of-the-parts = somma dei segmenti valutati separatamente", "Risultato = breakup value / private market value", "Utile per spin-off, split-off, carve-out", "Conglomerate discount: allocazione inefficiente, fattori endogeni, errori di misura"], "examTips": ["Trucco: le 3 cause del conglomerate discount = \"C-E-M\": Capitale mal allocato, Endogeni, Misurazione"], "question": {"q": "Which of the following is the most likely reason for applying a conglomerate discount to a valuation?", "options": ["Inefficiency in the allocation of investment capital.", "Sum-of-parts valuation.", "Breakup value."], "ans": 0, "exp": "The inefficiency in the allocation of investment capital is one of the reasons a conglomerate discount would be applied to an estimated valuation.\n\n**B is incorrect.** Sum-of-parts valuation values a company by aggregating the estimated value of its different segments valued as if they are independent.\n\n**C is incorrect.** Break-up value is the value estimated from the sum-of-parts valuation model."}}, {"id": "h", "code": "LOS 22h", "title": "Spiegare le questioni nella selezione e interpretazione del modello di valutazione", "commandWord": "Spiegare", "importance": "MEDIUM", "content": {"introduction": "Affinché un modello di valutazione sia appropriato, dovrebbe avere le seguenti tre caratteristiche.", "sections": [{"title": "1. Coerente con le caratteristiche dell'azienda", "icon": "🧩", "content": "La selezione di un buon modello di valutazione richiede una buona comprensione del business. Questo include i suoi asset e come crea valore, per esempio, usando un approccio di valutazione basato sugli asset su un'azienda di risorse naturali."}, {"title": "2. Appropriato data la disponibilità e qualità dei dati", "icon": "📊", "content": "Non sarebbe possibile usare un dividend discount model su un'azienda che non ha mai pagato dividendi e non si prevede paghi dividendi nel futuro prossimo. Allo stesso modo, i modelli di valutazione relativi non sarebbero possibili per le aziende che hanno utili negativi."}, {"title": "3. Coerente con lo scopo della valutazione", "icon": "🎯", "content": "Un investitore che cerca di acquisire una posizione azionaria di controllo in un'azienda userebbe più probabilmente un modello di valutazione free cash flow per valutare un'azienda, perché sarebbe in grado di controllare la politica dei dividendi di un'azienda da tale acquisizione.\n\nGli analisti usano frequentemente più modelli di valutazione per stimare il valore di un asset. Questo può essere fatto assegnando ai modelli di valutazione pesi diversi in base alla loro appropriatezza."}]}, "keyPoints": ["Modello coerente con le caratteristiche dell'azienda", "Modello compatibile con dati disponibili e loro qualità", "Modello coerente con lo scopo (es. controllo → FCF)", "Spesso si combinano più modelli con pesi diversi"], "examTips": ["Il tranello: \"relative valuation model\" è un MODELLO, non un criterio di scelta"], "question": {"q": "Which of the following is the least likely criteria used for choosing a valuation approach?", "options": ["Consistent with the company's characteristics.", "Appropriateness given the availability and quality of data.", "Relative valuation model."], "ans": 2, "exp": "The relative valuation model is a valuation approach that estimates the value of an asset relative to the value of another asset. It is therefore not a criterion used for choosing a valuation approach but a valuation approach in itself.\n\n**B is incorrect.** Appropriateness of the approach given the availability and quality of data is one of the criteria used to choose a valuation approach. Some valuation approaches would not be possible with certain data, e.g., relative valuation models would not be possible for companies that have negative earnings.\n\n**A is incorrect.** Consistency with the company's characteristics is another criterion used for picking a valuation approach. This requires a good understanding of the company and how it creates value."}}]}, {"id": "ev-r23", "number": 23, "title": "Discounted Dividend Valuation", "estimatedTime": "5-6 ore", "totalLOS": 16, "los": [{"id": "a", "code": "LOS 23a", "title": "Confrontare dividendi, free cash flow e residual income come input dei modelli DCF e identificare gli investimenti adatti a ciascuna misura", "commandWord": "Confrontare", "importance": "HIGH", "content": {"introduction": "I modelli di **discounted cash flow (DCF)** vedono il valore intrinseco di un'azione come il valore attuale dei suoi flussi di cassa futuri attesi. I quattro passi per applicare l'analisi DCF alla valutazione azionaria sono:\n\n1. Selezionare una definizione specifica di flusso di cassa.\n2. Prevedere i flussi di cassa.\n3. Scegliere una metodologia per il tasso di sconto.\n4. Stimare il tasso di sconto.\n\nI flussi di cassa ricevuti in futuro valgono meno della stessa quantità di flussi di cassa ricevuti oggi, perché il denaro ricevuto oggi dà a un individuo l'opzione di consumarlo immediatamente. Per questo motivo, quando si valuta un asset, i flussi di cassa futuri devono essere scontati al presente prima di sommarli. Questo riduce il valore dei flussi di cassa a seconda di quanto lontano nel futuro vengono ricevuti.\n\nIl valore di un asset è quindi il valore attuale dei flussi di cassa futuri attesi.\n\n$$V_0 = \\sum_{t=1}^{n} \\frac{CF_t}{(1+r)^t}$$\n\nDove: \\(V_0\\) = Valore di un asset al tempo \\(t = 0\\). \\(n\\) = Il numero di flussi di cassa nella vita di un asset. \\(CF_t\\) = Il flusso di cassa al tempo \\(t\\). \\(r\\) = Il tasso di rendimento richiesto / tasso di sconto.\n\nI tre tipi di flussi di cassa usati lavorando con il modello DCF sono:\n\n• **Dividendi**: denaro pagato agli azionisti.\n• **Free cash flow**: denaro disponibile per pagare gli azionisti.\n• **Residual income**: profitti economici.\n\nIl flusso di cassa selezionato definisce il tipo di modello DCF che può essere usato, ovvero:\n\n• Il dividend discount model.\n• Il free cash flow model.\n• Il residual income model.", "sections": [{"title": "Il Dividend Discount Model", "icon": "💵", "content": "Il **dividend discount model (DDM)** descrive i flussi di cassa come dividendi. Questo perché gli investitori che comprano le azioni di un'azienda si aspettano di ricevere denaro sotto forma di dividendi. La stabilità dei dividendi rende i valori del DDM meno sensibili alle fluttuazioni di breve termine.\n\nAlcune aziende possono pagare dividendi, mentre altre possono scegliere di non pagare. Generalmente, sono le grandi aziende profittevoli che pagano dividendi in modo costante. Queste aziende sono di solito riluttanti a ridurre i loro livelli di dividendi.\n\nIl DDM è adatto quando:\n\n• L'azienda paga dividendi.\n• C'è una relazione stabile tra la politica dei dividendi di un'azienda e la sua profittabilità.\n• Un investitore assume una prospettiva di non controllo."}, {"title": "Il Free Cash Flow Model", "icon": "💧", "content": "Ci sono due definizioni di flusso di cassa:\n\n**i. Free Cash Flow to the Firm (FCFF)**\n\nIl **free cash flow to the firm (FCFF)** è il flusso di cassa generato dalle operazioni dell'azienda che è disponibile per gli obbligazionisti e gli azionisti mantenendo al contempo le operazioni dell'azienda. Le spese in conto capitale (capital expenditures) sono necessarie per supportare le operazioni dell'azienda e sono quindi dedotte dalle operazioni di cassa per arrivare al free cash flow to the firm. Il valore totale dell'azienda può essere stimato scontando il FCFF futuro atteso.\n\n**ii. Free Cash Flow to Equity (FCFE)**\n\nIl **FCFE** è il flusso di cassa dalle operazioni di un'azienda, meno le spese in conto capitale e i pagamenti netti ai detentori di debito. Il valore del capitale azionario può essere stimato scontando il free cash flow to equity. Quindi, il FCFE è una misura di flusso di cassa post-debito.\n\nIl free cash flow model può non essere appropriato per aziende con spese in conto capitale sostanziali che risultano in free cash flow attesi negativi.\n\nIl free cash flow model è adatto quando:\n\n• L'azienda non paga dividendi.\n• L'azienda paga dividendi, ma i dividendi superano o sono inferiori in modo significativo al FCFE.\n• L'investitore vuole assumere una prospettiva di controllo.\n• I free cash flow dell'azienda sono in linea con la profittabilità dell'azienda."}, {"title": "Il Residual Income Model", "icon": "📗", "content": "Il **residual income** è calcolato come gli utili di un determinato periodo al di sopra del rendimento richiesto dagli investitori all'inizio del periodo. Per esempio, l'investimento degli azionisti in un'azienda è di $100 milioni all'inizio di un periodo, e il tasso di rendimento richiesto è dell'8%. Se l'azienda guadagna $11 milioni in quel periodo, il residual income sarebbe di $3 milioni, ossia $11 milioni – (8% × $100 milioni) = $3 milioni. L'importo al di sopra del rendimento richiesto rappresenta il valore aggiunto o guadagno economico per gli azionisti.\n\nIl residual income model calcola il valore di un'azienda come la somma totale del suo valore contabile (book value) e del valore attuale dei futuri utili residui attesi.\n\nIl residual income model è più appropriato quando:\n\n• L'azienda non paga dividendi.\n• I free cash flow attesi dell'azienda sono negativi."}]}, "keyPoints": ["Valore = PV dei flussi futuri attesi", "DDM → paga dividendi, legati alla profittabilità, prospettiva di minoranza", "FCF → niente dividendi o dividendi ≠ FCFE, prospettiva di controllo", "FCFF → valore azienda; FCFE → valore equity (post-debito)", "RI → niente dividendi e FCF negativi"], "examTips": ["Trucco: CONTROLLO → FCF; MINORANZA → DDM; FCF NEGATIVI → RI", "Il book value NON è un flusso: è un input del RI model"], "question": {"q": "Which of the following is least likely a type of cash flow used under the discounted cash flow model?", "options": ["Dividends.", "Residual income.", "Book value."], "ans": 2, "exp": "Book value is not a type of cash flow. Instead, book value is an input used in the residual income model to find the value of a company.\n\n**A is incorrect.** Dividends are a type of cash flow used with the dividend discount model to estimate the value of a company.\n\n**B is incorrect.** Residual income is a type of cash flow under the discounted cash flow model. It is calculated as the earnings for a particular period above investors' required return at the beginning of the period."}}, {"id": "b", "code": "LOS 23b", "title": "Calcolare e interpretare il valore di un'azione con il DDM per periodi di detenzione singolo e multiplo", "commandWord": "Calcolare", "importance": "HIGH", "content": {"introduction": "", "sections": [{"title": "Periodo di detenzione singolo (Single Holding Period)", "icon": "⏱️", "content": "I flussi di cassa per un investitore che detiene azioni sono i dividendi pagati e il prezzo di mercato dell'azione quando la vende. Per esempio, supponiamo che un investitore si aspetti di detenere l'azione per un anno. In tal caso, il valore dell'azione oggi è il valore attuale del dividendo previsto più il valore attuale del prezzo di vendita previsto tra un anno.\n\n$$V_0 = \\frac{D_1}{(1+r)^1} + \\frac{P_1}{(1+r)^1} = \\frac{(D_1 + P_1)}{(1+r)^1}$$\n\nDove: \\(V_0\\) = Il valore di un'azione oggi, a \\(t = 0\\). \\(P_1\\) = Il prezzo previsto per azione a \\(t = 1\\). \\(D_1\\) = I dividendi attesi per azione da pagare alla fine dell'anno a \\(t = 1\\). \\(r\\) = Il tasso di sconto dell'azione."}, {"title": "Esempio: DDM a periodo singolo", "icon": "✏️", "content": "Un investitore si aspetta che un'azienda paghi un dividendo di $1.50 alla fine dell'anno. L'investitore prevede di vendere l'azione a $38.00 immediatamente dopo. Con un tasso di rendimento richiesto del 9%, il valore dell'azione è più vicino a:\n\n$$\\begin{aligned} V_0 &= \\frac{(D_1 + P_1)}{(1+r)^1} \\\\ &= \\frac{(1.50 + 38.00)}{(1.09)} = 36.24 \\end{aligned}$$"}, {"title": "DDM a periodo multiplo (Multiple Period DDM)", "icon": "📅", "content": "Supponiamo che un investitore preveda di detenere l'azione per due anni. In tal caso, il valore dell'azione è la somma del valore attuale dei dividendi attesi alla fine dell'anno 1, del valore attuale dei dividendi attesi alla fine dell'anno 2, e del valore attuale del prezzo di vendita previsto alla fine dell'anno 2.\n\n$$\\begin{aligned} V_0 &= \\frac{D_1}{(1+r)^1} + \\frac{D_2}{(1+r)^2} + \\frac{P_2}{(1+r)^2} \\\\ &= \\frac{D_1}{(1+r)^1} + \\frac{(D_2 + P_2)}{(1+r)^2} \\end{aligned}$$\n\nPer n periodi, il valore dell'azione è la somma del valore attuale dei dividendi attesi per gli n periodi e del valore attuale del prezzo atteso al periodo t = n.\n\n$$\\begin{aligned} V_0 &= \\frac{D_1}{(1+r)^1} + \\cdots + \\frac{D_n}{(1+r)^n} + \\frac{P_n}{(1+r)^n} \\\\ &= \\sum_{t=1}^{n} \\frac{D_t}{(1+r)^t} + \\frac{P_n}{(1+r)^n} \\end{aligned}$$\n\nCon un periodo di detenzione finito, il DDM trova il valore di un'azione come la somma di:\n\n1. Il valore attuale dei dividendi attesi durante il periodo di detenzione.\n2. Il valore attuale del prezzo atteso dell'azione alla fine del periodo di detenzione.\n\nSe il periodo di detenzione si estende al futuro indefinito, il valore dell'azione è il valore attuale di tutti i dividendi futuri attesi.\n\n$$\\begin{aligned} V_0 &= \\frac{D_1}{(1+r)^1} + \\cdots + \\frac{D_n}{(1+r)^n} \\\\ &= \\sum_{t=1}^{\\infty} \\frac{D_t}{(1+r)^t} \\end{aligned}$$"}, {"title": "Esempio: DDM a periodo multiplo", "icon": "✏️", "content": "ABC Inc. si aspetta dividendi di $2 e $2.5 alla fine dei prossimi due anni, rispettivamente. Il prezzo atteso dell'azione alla fine dell'anno 2 è $48. Se il tasso di rendimento richiesto è del 15%, allora il valore dell'azione di ABC oggi è più vicino a:\n\n**Soluzione**\n\n$$\\begin{aligned} V_0 &= \\frac{D_1}{(1+r)^1} + \\cdots + \\frac{D_n}{(1+r)^n} + \\frac{P_n}{(1+r)^n} \\\\ &= \\frac{\\$2}{1.15} + \\frac{(\\$2.5 + \\$48)}{(1.15)^2} = \\$39.92 \\end{aligned}$$\n\nPrevedere i dividendi nel futuro indefinito è una sfida a causa dell'incertezza delle variabili coinvolte. Ci sono due approcci usati per risolvere questo:\n\n**i.** Ai dividendi previsti possono essere assegnati diversi pattern di crescita. Questi pattern sono:\n\n• Crescita costante (il Gordon growth model).\n• Due fasi distinte di crescita (il modello a due stadi e l'H-model).\n• Tre fasi definite di crescita (il modello di crescita a tre stadi).\n\nIl valore DDM dell'azione è calcolato come la somma dei valori scontati dei dividendi futuri.\n\n**ii.** Prevedere un numero finito di dividendi fino a un punto terminale. Il periodo previsto dipende dalla prevedibilità degli utili dell'azienda. Dopo questo periodo:\n\n• Ai dividendi rimanenti dal punto terminale può essere assegnato un pattern di crescita.\n• L'analista può prevedere il prezzo dell'azione al punto terminale.\n\nIl valore DDM dell'azione è calcolato scontando i dividendi e il prezzo terminale previsto dell'azione, se presente."}]}, "keyPoints": ["Flussi dell'azionista: dividendi + prezzo di vendita", "Singolo periodo: (D1 + P1) / (1 + r)", "n periodi: Σ dividendi scontati + P_n scontato", "Orizzonte infinito: Σ di tutti i dividendi", "Approcci: pattern di crescita o previsione fino a un terminal point"], "examTips": ["Errore comune: dimenticare di scontare anche il prezzo finale con lo stesso esponente dell'ultimo dividendo"], "question": {"q": "Which of the following is the least likely method of estimating the value of a share using an indefinite number of future dividends?", "options": ["The Gordon growth model.", "The two-stage model.", "The present value of future dividends and terminal price."], "ans": 2, "exp": "The present value of future dividends and terminal price is a method used to estimate the value of a share assuming a finite number of dividends.\n\n**A is incorrect.** The Gordon growth model assumes a constant growth of indefinite dividends into the future to estimate the value of a share.\n\n**B is incorrect.** The two-stage model is an approach for estimating the value of a share that assumes an indefinite number of future dividends."}}, {"id": "c", "code": "LOS 23c", "title": "Calcolare il valore dell'equity con il Gordon growth model e spiegarne le assunzioni", "commandWord": "Calcolare", "importance": "VERY HIGH", "content": {"introduction": "Il **Gordon growth model** assume che i dividendi crescano indefinitamente a un tasso costante.\n\nA qualsiasi tempo \\(t\\), \\(D_t\\) è uguale ai dividendi a \\(t = 0\\), capitalizzati a \\(g\\) per \\(t\\) periodi. Il valore dell'azione è dato da:\n\n$$V_0 = \\frac{D_0(1+g)}{(r-g)} = \\frac{D_1}{(r-g)}$$", "sections": [{"title": "Esempio", "icon": "✏️", "content": "Con un dividendo corrente \\(D_0 = \\$5\\), un tasso di crescita \\(g = 4\\%\\) e un tasso di rendimento richiesto \\(r = 9\\%\\):\n\n$$V_0 = \\frac{\\$5(1+4\\%)}{(9\\% - 5\\%)} = \\frac{\\$5.2}{0.04} = \\$130$$\n\nIl Gordon growth model può essere usato anche per valutare le azioni privilegiate perpetue a tasso fisso (fixed-rate perpetual preferred shares). Per esempio, se il dividendo sull'azione privilegiata è \\(D\\) e la crescita è zero, il valore dell'azione usando il Gordon growth model è \\(V_0 = D/r\\).\n\nIl tasso di sconto, \\(r\\), è chiamato **capitalization rate (tasso di capitalizzazione)** perché capitalizza l'importo del dividendo, \\(D\\).\n\nIl Gordon growth model implica una relazione definita tra i tassi di crescita degli utili e dei dividendi e il valore dell'azione. Con i dividendi che crescono a un tasso di crescita costante \\(g\\), mantenendo stabile il tasso di rendimento richiesto, il valore dell'azione cresce a \\(g\\)."}]}, "keyPoints": ["V0 = D1 / (r − g), con D1 = D0(1 + g)", "Richiede crescita costante per sempre e r > g", "Privilegiate perpetue: g = 0 → V = D / r", "r è il capitalization rate", "Il valore dell'azione cresce allo stesso tasso g"], "examTips": ["Errore n.1 all'esame: usare D0 al numeratore invece di D1", "Se ti danno D0 e g, moltiplica sempre per (1 + g) prima di dividere"], "question": null}, {"id": "d", "code": "LOS 23d", "title": "Calcolare il valore di un'azione privilegiata perpetua non callable a tasso fisso", "commandWord": "Calcolare", "importance": "MEDIUM", "content": {"introduction": "Le imprese senza ulteriori opportunità di generare rendimenti al di sopra del tasso di rendimento richiesto dovrebbero distribuire tutti i loro utili in dividendi. I loro titoli hanno un tasso di dividendo fisso specificato e non hanno data di scadenza. Poiché i dividendi su questi titoli sono fissi, e \\(g\\) è uguale a 0, il loro valore può essere calcolato come:\n\n$$V_0 = \\frac{D_p}{r_p}$$\n\nDove: \\(D_p\\) = Dividendo perpetuo. \\(r_p\\) = Costo del capitale privilegiato (cost of preferred equity).", "sections": [{"title": "Esempio: Calcolo del valore di un'azione privilegiata perpetua non callable", "icon": "✏️", "content": "ABC Ltd. ha in circolazione un'azione privilegiata perpetua non callable con un dividendo del 10% (basato su un'emissione alla pari di $100). Dato che il tasso di rendimento richiesto dagli investitori per detenere queste azioni è del 12%, il valore corrente delle azioni è più vicino a:\n\n**Soluzione**\n\n$$\\text{Valore delle azioni privilegiate perpetue} = \\frac{D_p}{r_p}$$\n\nDove \\(D_p = 10\\% \\times 100 = \\$10\\)\n\n$$\\text{Valore delle azioni privilegiate perpetue} = \\frac{\\$10}{0.12} = \\$83.33$$"}]}, "keyPoints": ["Privilegiata perpetua = rendita perpetua con g = 0", "Dp = tasso cedolare × valore nominale", "V0 = Dp / rp"], "examTips": ["Il dividendo si calcola sul valore NOMINALE (par), non sul prezzo di mercato"], "question": {"q": "A company has a $100 par 6% fixed-rate perpetual preferred stock. Given a required rate of return of 8%, the current value of the security is closest to:", "options": ["$55.", "$70.", "$75."], "ans": 2, "exp": "$$\\begin{aligned} V_0 &= \\frac{D_p}{r_p} \\\\ &= \\frac{6.00}{0.08} = 75 \\end{aligned}$$"}}, {"id": "e", "code": "LOS 23e", "title": "Calcolare e interpretare il tasso di crescita implicito dei dividendi", "commandWord": "Calcolare", "importance": "HIGH", "content": {"introduction": "Diverse ipotesi sul tasso di crescita possono spiegare le differenze tra i valori stimati di un'azione e il valore di mercato effettivo. Dato il prezzo, il dividendo atteso e il tasso di rendimento richiesto, il tasso di crescita dei dividendi riflesso nel prezzo può essere dedotto usando il Gordon growth model. La plausibilità del tasso di crescita può quindi essere valutata.", "sections": [{"title": "Esempio: Il tasso di crescita implicito dei dividendi", "icon": "✏️", "content": "Supponiamo che il dividendo corrente di un'azienda sia $3.00 e il tasso di rendimento richiesto sia dell'11%. Il tasso di crescita dei dividendi che sarebbe richiesto per giustificare un prezzo di mercato dell'azione di $45 sarebbe:\n\n$$\\begin{aligned} V_0 &= \\frac{D_0(1+g)}{(r-g)} \\\\ 45 &= \\frac{3(1+g)}{(11\\% - g)} \\\\ 4.95 - 45g &= 3 + 3g \\\\ 48g &= 1.95 \\\\ g &= 4.06\\% \\end{aligned}$$"}]}, "keyPoints": ["Si risolve il Gordon model per g", "Con D1: g = r − D1/P0", "Poi si giudica se g è plausibile"], "examTips": ["Leggi bene se il dividendo è \"next period\" (D1) o \"current\" (D0): cambia l'equazione"], "question": {"q": "Consider a company with a required rate of return of 12% and a share market price of $30. If the next period's dividend is expected to be $2.00, the dividend growth rate is closest to:", "options": ["33%.", "25%.", "50%."], "ans": 0, "exp": "$$\\begin{aligned} V_0 &= \\frac{D_0(1+g)}{(r-g)} \\\\ 30 &= \\frac{2.00}{(12\\% - g)} \\\\ 3.6 - 30g &= 2 \\\\ 30g &= 1.6 \\\\ g &= 5.33\\% \\end{aligned}$$"}}, {"id": "f", "code": "LOS 23f", "title": "Calcolare e interpretare il valore attuale delle opportunità di crescita (PVGO) e la componente del P/E legata al PVGO", "commandWord": "Calcolare", "importance": "HIGH", "content": {"introduction": "Il valore di un'azione può essere valutato come la somma di:\n\n1. Il valore dell'azienda senza reinvestimento degli utili, \\((E_1/r)\\); più\n2. Il valore attuale delle opportunità di crescita (PVGO).\n\n$$V_0 = \\frac{E_1}{r} + \\text{PVGO}$$\n\nDove: \\(E_1\\) = Utili attesi al tempo \\(t = 1\\). \\(r\\) = Tasso di rendimento richiesto.\n\nIl **valore attuale delle opportunità di crescita (PVGO)** somma il valore attuale delle opportunità di reinvestire profittevolmente gli utili futuri. La crescita degli utili può aumentare, lasciare invariata o ridurre la ricchezza degli azionisti, a seconda che la crescita derivi da rendimenti superiori, uguali o inferiori al costo opportunità dei fondi. Il PVGO è determinato da:\n\n1. Le opzioni dell'azienda di investire, e\n2. Le opzioni dell'azienda di avviare, scalare o abbandonare progetti futuri.\n\nGli aumenti della ricchezza degli azionisti si verificano quando gli utili reinvestiti rendono più del costo opportunità dei fondi. Le aziende senza prospettive di investire in progetti a NPV positivo sono chiamate aziende **no-growth** (senza crescita). Esse dovrebbero distribuire i loro utili agli azionisti come dividendi per reindirizzare il capitale verso aree più attraenti.\n\nIl valore attuale delle opportunità di crescita può essere riformulato in termini di rapporto P/E basato sugli utili previsti:\n\n$$\\frac{V_0}{E_1} \\text{ o } \\frac{P_0}{E_1} \\text{ o } \\text{P/E} = \\frac{1}{r} + \\frac{\\text{PVGO}}{E_1}$$\n\nIl primo termine, \\(\\frac{1}{r}\\), è il valore del P/E per un'azienda no-growth. Il secondo termine, \\(\\frac{\\text{PVGO}}{E_1}\\), è la componente del valore del P/E che si riferisce alle opportunità di crescita.", "sections": [{"title": "Esempio: Il valore attuale delle opportunità di crescita", "icon": "✏️", "content": "Le azioni di XYZ Ltd vengono vendute a $60 su utili futuri per azione di $2.00. Supponiamo che il rendimento richiesto sia del 10%. Il PVGO è più vicino a:\n\n$$\\begin{aligned} V_0 &= \\frac{E_1}{r} + \\text{PVGO} \\\\ 60 &= \\frac{2}{0.10} + \\text{PVGO} \\\\ \\text{PVGO} &= \\$60 - \\$20 = \\$40 \\end{aligned}$$\n\nIl mercato assegna il 66.67% del prezzo \\(\\left(\\frac{\\$40}{\\$60}\\right)\\) alla crescita futura."}]}, "keyPoints": ["V0 = E1/r + PVGO", "E1/r = valore senza crescita (tutto distribuito)", "PVGO > 0 solo se il reinvestimento rende più di r", "P/E = 1/r + PVGO/E1"], "examTips": ["Trucco: PVGO = prezzo − E1/r. Due righe e hai finito", "Attenzione: E1/r usa gli utili, NON i dividendi"], "question": {"q": "Suppose a company's earnings per share is expected to be $1.50. If its required rate of return is 12% and its share market price is $36, its PVGO is closest to:", "options": ["$12.", "$23.", "$36."], "ans": 1, "exp": "$$\\begin{aligned} 36 &= \\frac{1.50}{0.12} + \\text{PVGO} \\\\ 4.32 &= 1.50 + 0.12(\\text{PVGO}) \\\\ 2.82 &= 0.12(\\text{PVGO}) \\\\ \\text{PVGO} &= 23 \\end{aligned}$$"}}, {"id": "g", "code": "LOS 23g", "title": "Calcolare e interpretare i P/E giustificati leading e trailing con il Gordon growth model", "commandWord": "Calcolare", "importance": "VERY HIGH", "content": {"introduction": "Il rapporto **price-to-earnings (P/E)** è l'indicatore di valutazione più ampiamente riconosciuto. Usando il Gordon growth model, si può sviluppare un multiplo P/E. Quando si usano input previsti nel multiplo, si ottiene un **multiplo P/E fondamentale giustificato (justified fundamental P/E)**. L'espressione del P/E può essere formulata in termini di P/E corrente o leading.", "sections": [{"title": "i. P/E corrente (o trailing)", "icon": "⏪", "content": "Si calcola usando il prezzo di mercato odierno per azione diviso per gli utili per azione degli ultimi 12 mesi (trailing).\n\n$$\\begin{aligned} \\frac{P_0}{E_0} &= \\frac{(D_0(1+g))/E_0}{r-g} \\\\ &= \\frac{(1-b)(1+g)}{r-g} \\end{aligned}$$\n\nDove: \\(b\\) = Tasso di ritenzione (retention ratio). \\((1-b)\\) = Tasso di distribuzione dei dividendi (dividend payout ratio)."}, {"title": "ii. P/E leading (o forward)", "icon": "⏩", "content": "Si calcola usando il prezzo di mercato odierno per azione diviso per una previsione degli utili per azione dei 12 mesi.\n\n$$\\begin{aligned} \\frac{P_0}{E_1} &= \\frac{D_1/E_1}{r-g} \\\\ &= \\frac{1-b}{r-g} \\end{aligned}$$"}, {"title": "Esempio: Gordon growth model e il rapporto Price-to-Earnings", "icon": "✏️", "content": "Date le seguenti informazioni:\n\n• Prezzo corrente dell'azione = $24.00\n• Utili per azione trailing = $1.80\n• Dividendi annuali correnti = $0.60\n• Tasso di rendimento richiesto = 12%\n• Tasso di crescita dei dividendi = 4%\n\nI P/E giustificati trailing e leading basati sul Gordon growth model sarebbero:\n\n**i. P/E trailing giustificato**\n\n$$\\begin{aligned} \\frac{P_0}{E_0} &= \\frac{D_0(1+g)/E_0}{(r-g)} \\\\ &= \\frac{(1-b)(1+g)}{r-g} \\\\ &= \\frac{(0.333)(1.04)}{0.08} \\\\ &= 4.33 \\end{aligned}$$\n\n**ii. P/E leading giustificato**\n\n$$\\begin{aligned} \\frac{P_0}{E_1} &= \\frac{D_1/E_1}{r-g} \\\\ &= \\frac{1-b}{r-g} \\\\ &= \\frac{0.333}{0.08} \\\\ &= 4.16 \\end{aligned}$$\n\nSi noti che il mercato sta valutando gli utili dell'azienda più di quanto sia giustificato dai fondamentali dell'azienda; quindi, l'azione è sopravvalutata.\n\n$$\\text{P/E effettivo} = \\frac{24}{1.80} = 13.33$$"}]}, "keyPoints": ["Trailing: (1 − b)(1 + g) / (r − g)", "Leading: (1 − b) / (r − g)", "Trailing = Leading × (1 + g)", "P/E effettivo > giustificato → sopravvalutata"], "examTips": ["Trucco: il trailing ha UN (1 + g) in più perché guarda all'indietro (E0 è più piccolo di E1)", "Il payout si ricava come dividendo / EPS"], "question": {"q": "Given the following information,\n\n• Current stock price = $22.00\n• Trailing earnings per share = $3.80\n• Current annual dividends = $1.20\n• Required rate of return = 13%\n• Dividend growth rate = 8%\n\nThe trailing P/E ratio is closest to:", "options": ["8.00.", "3.50.", "6.91."], "ans": 2, "exp": "$$\\begin{aligned} \\frac{P_0}{E_0} &= \\frac{D_0(1+g)/E_0}{r-g} \\\\ &= \\frac{(1-b)(1+g)}{r-g)} \\\\ &= \\frac{(0.32)(1.08)}{0.05} \\\\ &= 6.91 \\end{aligned}$$"}}, {"id": "h", "code": "LOS 23h", "title": "Descrivere punti di forza e limiti del Gordon growth model e giustificarne la scelta", "commandWord": "Descrivere", "importance": "MEDIUM", "content": {"introduction": "", "sections": [{"title": "Punti di forza", "icon": "👍", "content": "• È semplice e facile da implementare.\n• È appropriato per valutare aziende mature che pagano dividendi.\n• È usato per giudicare se un mercato azionario è correttamente valutato.\n• È usato per modellare l'ultimo stadio di crescita in un modello multistadio per un'azienda con un alto tasso di crescita."}, {"title": "Limiti", "icon": "👎", "content": "• Il modello è sensibile alle stime del tasso di crescita e del tasso di rendimento richiesto.\n• Il modello deve essere usato in combinazione con altri modelli per valutare aziende che sperimentano alti tassi di crescita.\n• Il modello non si applica alle aziende che non pagano dividendi."}]}, "keyPoints": ["Semplice, adatto ad aziende mature che pagano dividendi", "Usato per l'ultimo stadio dei modelli multistadio", "Molto sensibile a g e r", "Inutile senza dividendi"], "examTips": ["La sensibilità a g e r è un LIMITE: occhio alle domande che la presentano come pregio"], "question": {"q": "Which of the following is least likely a strength of the Gordon growth model?", "options": ["It is appropriate for dividend-paying companies.", "It is easy to implement.", "It is sensitive to the growth rate estimate."], "ans": 2, "exp": "The sensitivity of the Gordon growth model to the growth rate estimate is one of the model's limitations.\n\n**B is incorrect.** The simplicity and ease of implementing the Gordon growth model are some of its strengths.\n\n**A is incorrect.** One of the strengths of the Gordon growth model is it is appropriate for valuing dividend-paying companies."}}, {"id": "i", "code": "LOS 23i", "title": "Spiegare le fasi di crescita di un'azienda", "commandWord": "Spiegare", "importance": "MEDIUM", "content": {"introduction": "Prevedere un singolo tasso di crescita stabile dei dividendi per un'azienda nel futuro indefinito non è realistico per molte aziende, perché le aziende sperimentano tassi di crescita diversi durante il loro ciclo di vita. Pertanto, gli analisti possono assumere che la crescita rientri in tre fasi:", "sections": [{"title": "i. Fase di crescita (Growth Phase)", "icon": "🌱", "content": "Le aziende si stanno espandendo rapidamente, con alti margini di profitto e un alto tasso di crescita degli utili per azione. Queste aziende hanno free cash flow negativi perché investono pesantemente nell'espansione delle operazioni. Di conseguenza, i tassi di distribuzione dei dividendi (dividend payout ratio) delle aziende in fase di crescita sono spesso bassi o addirittura zero. Il tasso di crescita dell'azienda in questa fase è chiamato **crescita supernormale (supernormal growth)**."}, {"title": "ii. Fase di transizione (Transition Phase)", "icon": "🌿", "content": "La crescita degli utili e delle vendite rallenta a causa dell'aumento della concorrenza e della saturazione del mercato. La crescita degli utili declina verso il tasso di crescita dell'economia. I free cash flow diventano positivi, e i tassi di distribuzione dei dividendi aumentano man mano che i fabbisogni di capitale diminuiscono."}, {"title": "iii. Fase di maturità (Mature Phase)", "icon": "🌳", "content": "Il return on equity si avvicina al rendimento richiesto sul capitale (required return on equity). Il dividend payout ratio, la crescita degli utili e il return on equity si stabilizzano a livelli che possono essere sostenuti nel lungo termine. Di conseguenza, il Gordon growth model può essere usato per valutare l'azienda in questa fase. Il tasso di crescita dell'azienda è chiamato **tasso di crescita maturo (mature growth rate)**."}]}, "keyPoints": ["Crescita: FCF negativi, payout ~0, supernormal growth", "Transizione: crescita in calo, FCF positivi, payout in aumento", "Maturità: ROE ≈ r, tutto stabile → Gordon model"], "examTips": ["Trucco: Gordon model \"da solo\" → solo fase matura"], "question": {"q": "In which phase would the Gordon growth model only be most appropriate?", "options": ["Growth phase.", "Transition phase.", "Mature phase."], "ans": 2, "exp": "The Gordon growth model is most appropriate in the mature phase where the earnings growth rate has stabilized and sustainable in the long run.\n\n**B is incorrect.** In the transition phase, a company experiences a high growth rate that would eventually decline to a sustainable rate. Therefore, the Gordon growth model would not be appropriate by itself.\n\n**A is incorrect.** Under the growth phase, a company would experience multiple growth stages that would make the Gordon growth model not appropriate by itself."}}, {"id": "j", "code": "LOS 23j", "title": "Descrivere le assunzioni e giustificare la scelta dei modelli DDM a due stadi, H-model, a tre stadi e spreadsheet", "commandWord": "Descrivere", "importance": "HIGH", "content": {"introduction": "", "sections": [{"title": "Two-stage DDM (prima versione)", "icon": "2️⃣", "content": "Ci sono diverse assunzioni della prima versione del two-stage DDM:\n\n$$V_0 = \\sum_{t=1}^{n} \\frac{D_0(1+g_S)^t}{(1+r)^t} + \\frac{D_0(1+g_S)^n(1+g_L)}{(1+r)^n(r-g_L)}$$\n\n\\(g_S\\) = Tasso di crescita supernormale nel primo stadio. \\(g_L\\) = Tasso di crescita maturo nel secondo stadio. \\(r\\) = Tasso di rendimento richiesto. \\(n\\) = Durata del tasso di crescita straordinario."}, {"title": "H-Model", "icon": "📉", "content": "Le assunzioni dell'H-Model includono:\n\n$$V_0 = \\frac{D_0(1+g_L) + D_0H(g_S - g_L)}{r - g_L}$$\n\n\\(H\\) = Half-life (anni) del periodo di alta crescita. \\(g_S\\) = Tasso di crescita iniziale dei dividendi di breve termine elevato. \\(g_L\\) = Tasso di crescita dei dividendi sostenibile di lungo termine. \\(r\\) = Tasso di rendimento richiesto."}, {"title": "Three-stage DDM", "icon": "3️⃣", "content": "Questo modello è più adatto per aziende che ci si aspetta abbiano tre stadi separati di crescita degli utili. È un raffinamento più complesso del modello a due stadi."}, {"title": "Spreadsheet modeling", "icon": "🗂️", "content": "Il **spreadsheet modeling** è usato per costruire modelli complicati che richiederebbero pattern diversi di crescita dei dividendi. Le funzioni integrate dei fogli di calcolo rendono anche più semplice il calcolo. Inoltre, permettono a diversi analisti di condividere i loro modelli su foglio di calcolo, scambiando così informazioni. I modelli su foglio di calcolo riducono anche la probabilità di imprecisioni di calcolo."}]}, "keyPoints": ["Two-stage: salto brusco da gS a gL", "H-model: discesa lineare, H = metà del periodo di transizione", "Three-stage: tre fasi distinte", "Spreadsheet: qualsiasi pattern"], "examTips": ["Nell'H-model lo stadio FINALE ha crescita sostenibile; l'alta crescita è all'inizio"], "question": {"q": "Which of the following is the least likely an assumption of the H-model?", "options": ["There are two stages in the H-model.", "A supernormal growth rate characterizes the final stage of the H-model.", "A sustainable long term growth rate characterizes the final stage of the H-model."], "ans": 1, "exp": "A supernormal growth rate does not characterize the final stage. It is during the first stage of the H-model that the growth rate is expected to be high.\n\n**A is incorrect.** The H-model assumes there are two stages.\n\n**C is incorrect.** The final stage of the H-model is characterized by a sustainable long-term growth rate that is expected to continue into perpetuity."}}, {"id": "k", "code": "LOS 23k", "title": "Spiegare il terminal value e come stimarlo con il Gordon growth model o con un multiplo", "commandWord": "Spiegare", "importance": "HIGH", "content": {"introduction": "Valutare un'azione comporta l'assunzione che il suo tasso di crescita rallenterà fino a un tasso di lungo termine comparabile a quello dell'economia. Il valore proiettato alla fine degli stadi di alta crescita basato sul tasso di crescita di lungo termine è noto come **terminal value** (valore terminale) dell'azione (o **continuing value**).\n\nIl terminal value può essere calcolato:\n\n1. Usando il Gordon growth model.\n2. Applicando un multiplo, es. il P/E, a un fondamentale stimato, es. l'EPS alla data terminale.", "sections": [{"title": "Esempio: Stima del terminal value con il Gordon growth model e un multiplo P/E", "icon": "✏️", "content": "Date le seguenti informazioni:\n\n• Dividendo annuale pagato di recente = $0.40.\n• Tasso di crescita dei dividendi = 12% per i prossimi 5 anni.\n• Il tasso di crescita si stabilizzerà a un tasso di lungo termine del 4%.\n• Rapporto P/E trailing alla fine del periodo iniziale di alta crescita = 6.\n• Tasso di ritenzione = 25%.\n• Tasso di rendimento richiesto = 12%.\n\nUsando il Gordon growth model, il terminal value è calcolato come:\n\n$$\\begin{aligned} \\text{Dividendi anno 5} &= 0.40(1.12)^5 \\\\ &= 0.70 \\\\ \\text{Terminal value} &= \\frac{0.70(1.04)}{12\\% - 4\\%} \\\\ &= \\frac{0.728}{0.08} \\\\ &= 9.16 \\end{aligned}$$\n\nUsando un multiplo P/E, il terminal value è calcolato come:\n\n$$\\begin{aligned} \\text{Dividendi anno 5} &= 0.70 \\\\ \\text{EPS anno 5} &= \\frac{0.70}{0.75} = 0.9333 \\end{aligned}$$\n\nApplicando il P/E trailing di 6 sull'EPS dell'anno 5, il terminal value è:\n\n$$V_0 = 0.9333 \\times 6 = 5.6$$"}]}, "keyPoints": ["Terminal value = valore a fine alta crescita", "Metodo 1: Gordon con D_{n+1}", "Metodo 2: multiplo × fondamentale", "Con P/E trailing usa EPS_n; con leading EPS_{n+1}"], "examTips": ["Per passare da dividendo a EPS dividi per il payout (1 − b), NON per b"], "question": {"q": "A company's current EPS of $2.50 is expected to grow at 12% for 8 years. After that, it will decline to a long-term rate of 4%. If the trailing P/E at the end of the high growth stage is 9, the terminal value is closest to:", "options": ["$22.55.", "$57.80.", "$55.70."], "ans": 2, "exp": "$$\\begin{aligned} \\text{EPS}_8 &= 2.50(1.12)^8 = 6.19 \\\\ \\text{Terminal value} &= 6.19 \\times 9 = 55.71 \\end{aligned}$$"}}, {"id": "l", "code": "LOS 23l", "title": "Calcolare e interpretare il valore di un'azione con i DDM a due e tre stadi", "commandWord": "Calcolare", "importance": "VERY HIGH", "content": {"introduction": "", "sections": [{"title": "Two-Stage Dividend Discount Model", "icon": "2️⃣", "content": "Ci sono due approcci al two-stage dividend discount model:\n\n**i. Il modello generale a due stadi (General Two-Stage Model).** In questo modello, la crescita di un'azienda è divisa in due sezioni — una in cui sperimenta alta crescita e la seconda in cui la sua crescita è stabile e sostenibile. La transizione dal primo stadio al secondo è brusca e immediata.\n\n$$V_0 = \\sum_{t=1}^{n} \\frac{D_0(1+g_S)^t}{(1+r)^t} + \\frac{D_0(1+g_S)^n(1+g_L)}{(1+r)^n(r-g_L)}$$\n\nDove: \\(g_S\\) = Tasso di crescita elevato di breve termine. \\(g_L\\) = Tasso di crescita sostenibile di lungo termine. \\(r\\) = Tasso di rendimento richiesto. \\(n\\) = Durata del tasso di crescita straordinario."}, {"title": "Esempio: Modello a due stadi", "icon": "✏️", "content": "Il dividendo corrente di ABC di $0.50 ci si aspetta cresca dell'8% all'anno per i prossimi 3 anni. Successivamente, il tasso di crescita dei dividendi declinerà al 5% e rimarrà a quel livello indefinitamente. Usando un tasso di rendimento richiesto del 13%, il valore del prezzo dell'azione sarebbe calcolato come:\n\n$$\\begin{aligned} D_1 &= \\$0.50 \\times 1.08 = \\$0.54 \\\\ D_2 &= \\$0.54 \\times 1.08 = \\$0.583 \\\\ D_3 &= \\$0.583 \\times 1.08 = \\$0.630 \\\\ D_4 &= \\$0.630 \\times 1.05 = \\$0.662 \\\\ V_3 &= \\frac{0.662}{13\\% - 5\\%} = \\$8.275 \\\\ V_0 &= \\frac{0.54}{1.13} + \\frac{0.583}{(1.13)^2} + \\frac{0.63 + 8.275}{(1.13)^3} = 7.10 \\end{aligned}$$\n\n**Interpretazione del Two-Stage DDM generale**\n\n1. Il valore attuale (PV) del terminal value (alla fine dell'anno 3) è \\(\\frac{\\$8.275}{(1.13)^3} = \\$5.73\\).\n2. Il PV del terminal value costituisce l'80.70% \\(\\left(= \\frac{\\$5.73}{\\$7.10}\\right)\\) del valore totale dell'azione.\n3. Di conseguenza, la valutazione dipende maggiormente dalle assunzioni sul tasso di crescita e sul tasso di rendimento richiesto nel Gordon growth model.\n\nUn'azienda può sperimentare una crescita supernormale per alcuni periodi, dopo i quali il tasso di crescita scende a un livello sostenibile. Questo può essere dovuto a brevetti, a un vantaggio di primo arrivato (first-mover advantage), o a un fattore che dà all'azienda un vantaggio. Di conseguenza, può essere usato un tasso di sconto diverso per lo stadio di alta crescita e per lo stadio maturo sostenibile, per riflettere i diversi livelli di rischio coinvolti.\n\nUn limite del modello generale a due stadi è che la transizione tra il periodo iniziale di crescita supernormale e il tasso di crescita maturo sostenibile è brusca e immediata.\n\n**Two-Stage DDM (aziende che non pagano ancora dividendi).** Un'azienda che attualmente non paga dividendi ma inizierà a pagarli in futuro può comunque essere valutata usando il dividend discount model. Per valutare tale azienda, un analista può usare un DDM multistadio, in cui il valore della prima sezione è uguale a zero.\n\nD'altra parte, supponiamo che un'azienda non abbia intenzione di pagare dividendi, o che sia difficile prevedere la tempistica dei dividendi. In tal caso, un analista può usare il free cash flow model o il residual income model per valutare l'azienda.\n\n**ii. L'H-model.** In questo modello, ci sono due stadi distinti ma la transizione dalla sezione di alta crescita allo stadio maturo è graduale e lineare.\n\n$$V_0 = \\frac{D_0(1+g_L) + D_0H(g_S - g_L)}{r - g_L}$$\n\nDove: \\(V_0\\) = Valore per azione a \\(t = 0\\). \\(D_0\\) = Dividendi correnti. \\(r\\) = Tasso di rendimento richiesto sul capitale. \\(H\\) = Half-life in anni del periodo di alta crescita. \\(g_S\\) = Tasso di crescita iniziale dei dividendi di breve termine. \\(g_L\\) = Tasso di crescita normale dei dividendi di lungo termine dopo il periodo di alta crescita."}, {"title": "Esempio: L'H-Model", "icon": "✏️", "content": "Il dividendo corrente di XYZ è di $0.80. La crescita corrente dell'8% all'anno ci si aspetta declini linearmente al 5% nei prossimi 10 anni e dopodiché rimanga a quel livello indefinitamente. Usando un tasso di rendimento richiesto del 13%, il valore dell'azione sarebbe calcolato come:\n\n$$\\begin{aligned} V_0 &= \\frac{D_0(1+g_L) + D_0H(g_S - g_L)}{r - g_L} \\\\ &= \\frac{0.80(1.05) + 0.80(5)(0.03)}{0.08} \\\\ &= 12.0 \\end{aligned}$$\n\n(Nota: H = 5, ossia metà del periodo di transizione di 10 anni.)\n\n**Interpretazione dell'H-Model a due stadi**\n\nSe la crescita normale dovesse iniziare immediatamente, il valore dell'azione sarebbe uguale a \\(\\frac{D_0(1+g_L)}{r-g_L} = \\frac{\\$0.80(1+0.05)}{0.13-0.05} = \\$10.50\\). La crescita straordinaria (extraordinary growth) aggiunge $1.50 al valore dell'azione."}, {"title": "Three-Stage Dividend Discount Model", "icon": "3️⃣", "content": "Ci sono due approcci al three-stage dividend discount model, differenziati dalla modellazione del secondo stadio:\n\n1. Un'azienda ha tre stadi di crescita distinti, e il tasso di crescita del secondo stadio è costante. Per esempio, lo stadio 1 potrebbe avere una crescita del 20% per quattro anni, lo stadio 2 una crescita dell'8% per cinque anni, e lo stadio 3 una crescita del 4% successivamente.\n2. Si assume che il tasso di crescita nello stadio 2 declini linearmente fino al tasso di crescita maturo e sostenibile. Pertanto, gli stadi 2 e 3 sono trattati come un H-model. Valutare un'azienda usando questo modello richiede quanto segue:\n\n• Stimare il dividendo corrente.\n• Stimare la durata del primo, secondo e terzo stadio.\n• Stimare i tassi di crescita attesi del primo e del terzo stadio.\n• Stimare il rendimento richiesto sul capitale.\n• Calcolare i dividendi attesi e la somma dei loro valori attuali nello stadio 1.\n• Applicare l'H-model al secondo e terzo stadio per ottenere il valore dell'azione all'inizio dello stadio 2.\n• Poi, trovare il valore attuale del valore dell'H-model alla data odierna (\\(t = 0\\)).\n• Infine, sommare il valore attuale dello stadio 1 e il valore attuale del valore dell'H-model."}, {"title": "Esempio: Three-Stage Dividend Discount Model", "icon": "✏️", "content": "La Società A ha pagato di recente un dividendo di $2.00, e ci si aspetta che cresca del 14% per i prossimi due anni, del 12% per i tre anni successivi, e del 6% successivamente. Pertanto, usando il three-stage dividend discount e assumendo un tasso di rendimento richiesto dell'11%, il valore dell'azione può essere stimato come:\n\n$$\\begin{aligned} D_1 &= \\$2 \\times 1.14 = \\$2.28 \\\\ D_2 &= \\$2.28 \\times 1.14 = \\$2.60 \\\\ D_3 &= \\$2.60 \\times 1.12 = \\$2.91 \\\\ D_4 &= \\$2.91 \\times 1.12 = \\$3.26 \\\\ D_5 &= \\$3.26 \\times 1.12 = \\$3.65 \\end{aligned}$$\n\nValore dei dividendi a crescita costante:\n\n$$\\begin{aligned} V_5 &= \\frac{3.65 \\times 1.06}{11\\% - 6\\%} = 77.40 \\\\ V_0 &= \\frac{2.28}{(1.11)^1} + \\frac{2.60}{(1.11)^2} + \\frac{2.91}{(1.11)^3} + \\frac{3.26}{(1.11)^4} + \\frac{3.63 + 77.40}{(1.11)^5} \\\\ &= 56.52 \\end{aligned}$$\n\nIl PV del terminal value costituisce una porzione preponderante del valore totale dell'azione, ossia \\(\\left(81.25\\% = \\frac{\\$45.92}{\\$56.52}\\right)\\)."}]}, "keyPoints": ["Two-stage: PV dividendi alta crescita + PV di V_n", "V_n = D_{n+1} / (r − gL), scontato con (1 + r)^n", "Il terminal value pesa spesso 80%+", "H-model: H = metà della transizione", "Three-stage: dividendi stadio 1 + H-model o terzo Gordon"], "examTips": ["Trucco: il TV si calcola a fine anno n ma con D_{n+1}, poi si sconta di n anni (non n+1!)", "Nell'H-model leggi bene: \"declina in 10 anni\" → H = 5"], "question": {"q": "A company just paid a dividend of $1.50. The dividend is projected to grow at 8% in the next period and linearly decline over the following 6 years to 4% and thereafter remain at that level indefinitely. Using a required rate of return of 10%, the value of the share is closest to:", "options": ["$25.", "$36.", "$29."], "ans": 2, "exp": "$$\\begin{aligned} V_0 &= \\frac{D_0(1+g_L) + D_0H(g_S - g_L)}{r - g_L} \\\\ &= \\frac{1.50(1.04) + 1.50(3)(0.04)}{0.10 - 0.04} \\\\ &= 29 \\end{aligned}$$"}}, {"id": "m", "code": "LOS 23m", "title": "Spiegare l'uso dello spreadsheet modeling per prevedere i dividendi e valutare le azioni", "commandWord": "Spiegare", "importance": "LOW", "content": {"introduction": "I dividend discount model assumono un pattern stilizzato (semplificato) di crescita dei dividendi. Tuttavia, la crescita dei dividendi può seguire una varietà di pattern. Pertanto, lo **spreadsheet modeling** (modellazione su foglio di calcolo) è usato per prevedere qualsiasi pattern di dividendi. Inoltre, i fogli di calcolo permettono agli analisti di costruire modelli complicati, eseguire analisi di scenario (scenario analysis) e scambiare informazioni condividendo i loro modelli su foglio di calcolo. Rispetto ai modelli stilizzati presentati in questo reading, i fogli di calcolo permettono di prevedere prospetti pro forma su un orizzonte molto più lungo.", "sections": []}, "keyPoints": ["Modelli stilizzati = pattern semplificati", "Spreadsheet = qualsiasi pattern, modelli complessi, scenari", "Condivisione dei modelli tra analisti"], "examTips": ["Il caso con pattern STILIZZATO non richiede lo spreadsheet: è il distrattore tipico"], "question": {"q": "Which of the following is least likely an advantage of using spreadsheet modeling?", "options": ["Building complicated models.", "Forecasting any dividend growth pattern.", "Valuing a stock with a stylized pattern of dividend growth."], "ans": 2, "exp": "Valuing a stock with a stylized pattern of dividend growth does not require spreadsheet modeling."}}, {"id": "n", "code": "LOS 23n", "title": "Stimare il rendimento richiesto di un titolo azionario dato il prezzo di mercato e gli input di un DDM", "commandWord": "Stimare", "importance": "HIGH", "content": {"introduction": "Dati tutti gli input di un dividend discount model (DDM) eccetto il rendimento richiesto, l'**IRR** può essere calcolato e usato come sostituto del tasso di rendimento richiesto. Questo IRR può essere interpretato come il rendimento atteso sul titolo implicito nel prezzo di mercato.", "sections": [{"title": "Il Gordon Growth Model", "icon": "📐", "content": "Usando il Gordon growth model, il tasso di rendimento richiesto può essere calcolato come:\n\n$$r = \\frac{D_1}{P_0} + g$$"}, {"title": "Esempio: Stima del tasso di rendimento richiesto", "icon": "✏️", "content": "Se un titolo ha un dividendo corrente di $1.50, un prezzo corrente di $25, e un tasso di crescita atteso del 4%, allora il tasso di rendimento richiesto sarebbe:\n\n$$\\begin{aligned} r &= \\frac{1.50(1.04)}{25} + 0.04 \\\\ &= 10.24\\% \\end{aligned}$$"}, {"title": "L'H-model", "icon": "📉", "content": "Usando l'H-model, il tasso di rendimento richiesto può essere calcolato come:\n\n$$r = \\left(\\frac{D_0}{P_0}\\right)\\left[(1+g_L) + H(g_S - g_L)\\right] + g_L$$"}, {"title": "Esempio: Stima del tasso di rendimento richiesto (H-model)", "icon": "✏️", "content": "Se un titolo ha un dividendo di $1.50, un prezzo corrente di $25, e un tasso di crescita atteso di breve termine del 10% che declina linearmente su 10 anni fino al 6%, allora il tasso di rendimento atteso sarebbe:\n\n$$\\begin{aligned} r &= \\left(\\frac{1.50}{25}\\right)\\left[(1.06) + 5(0.04)\\right] + 0.06 \\\\ &= 13.56\\% \\end{aligned}$$"}]}, "keyPoints": ["Rendimento implicito = IRR che eguaglia prezzo e PV dei dividendi", "Gordon: r = D1/P0 + g (dividend yield + crescita)", "H-model: r = (D0/P0)[(1 + gL) + H(gS − gL)] + gL"], "examTips": ["r = dividend yield + crescita: verifica sempre se il dividendo dato è D0 o D1"], "question": {"q": "For a security with an expected dividend of $2.50, a current price of $38, and an expected growth rate of 5%, the required rate of return would be closest to:", "options": ["9.5%.", "11.58%.", "15.55%."], "ans": 1, "exp": "$$\\begin{aligned} r &= \\frac{D_1}{P_0} + g \\\\ &= \\frac{2.50}{38} + 0.05 \\\\ &= 11.58\\% \\end{aligned}$$"}}, {"id": "o", "code": "LOS 23o", "title": "Spiegare l'uso dell'analisi DuPont per calcolare il sustainable growth rate", "commandWord": "Spiegare", "importance": "HIGH", "content": {"introduction": "", "sections": [{"title": "Sustainable Growth Rate", "icon": "🌱", "content": "Il **sustainable growth rate (SGR — tasso di crescita sostenibile)** è il tasso di crescita dei dividendi (e degli utili) che un'azienda può mantenere per un dato return on equity (ROE), assumendo che la struttura del capitale rimanga invariata e che non venga emesso ulteriore capitale azionario ordinario. Il SGR può essere usato come input nel Gordon Growth Model.\n\nIl sustainable growth rate (SGR) può essere calcolato come:\n\n$$g = b \\times \\text{ROE}$$\n\nDove: \\(g\\) = Tasso di crescita dei dividendi. \\(b\\) = Tasso di ritenzione degli utili (1 − Dividend payout ratio).\n\nPiù alto è il return on equity, più alto è il tasso di crescita sostenibile dei dividendi/utili. Più alto è il tasso di ritenzione degli utili, più alto è il tasso di crescita sostenibile dei dividendi/utili. Questa relazione è nota come **dividend displacement of earnings**."}, {"title": "L'analisi DuPont", "icon": "🧩", "content": "L'equazione del SGR può essere espansa per esaminare cosa guida il ROE:\n\n$$\\text{ROE} = \\frac{\\text{Net income}}{\\text{Shareholder's equity}}$$\n\nIl ROE può essere collegato al return on assets (ROA) e all'entità della leva finanziaria (equity multiplier):\n\n$$\\text{ROE} = \\frac{\\text{Net income}}{\\text{Total assets}} \\times \\frac{\\text{Total assets}}{\\text{Shareholders' equity}}$$\n\nUn'azienda può quindi aumentare il suo ROE o aumentando il ROA o usando la leva.\n\nL'equazione del ROE può essere espansa ulteriormente scomponendo il ROA in due componenti, il margine di profitto e il turnover (efficienza):\n\n$$\\text{ROE} = \\frac{\\text{Net income}}{\\text{Sales}} \\times \\frac{\\text{Sales}}{\\text{Total assets}} \\times \\frac{\\text{Total assets}}{\\text{Shareholders' equity}}$$\n\nIl primo termine è il margine di profitto dell'azienda. Un alto margine di profitto risulterà in un alto ROE. Il secondo termine calcola il total asset turnover, che è l'efficienza dell'azienda. Un alto turnover risulterà in un alto ROE. Il terzo termine è l'equity multiplier.\n\nQuesta relazione è ampiamente nota come **DuPont model**. Il **PRAT model** è un metodo per calcolare il sustainable growth rate usando il DuPont model. Combinando queste equazioni, il tasso di crescita dei dividendi può essere calcolato come:\n\n$$\\begin{aligned} g &= \\text{Profit margin} \\times \\text{Retention rate} \\times \\text{Asset turnover} \\times \\text{Financial leverage} \\\\ &= \\frac{\\text{Net income} - \\text{Dividends}}{\\text{Net income}} \\times \\frac{\\text{Net income}}{\\text{Sales}} \\times \\frac{\\text{Sales}}{\\text{Total assets}} \\times \\frac{\\text{Total assets}}{\\text{Shareholders' equity}} \\end{aligned}$$\n\nDove \\(\\frac{\\text{Net income} - \\text{Dividends}}{\\text{Net income}}\\) è il retention ratio, e il resto dell'equazione è il ROE.\n\n(Nota: \"PRAT\" sta per Profit margin, Retention, Asset turnover, financial leverage — le quattro componenti dell'equazione.)"}, {"title": "Esempio: Sustainable Growth Rate", "icon": "✏️", "content": "Date le seguenti informazioni:\n\n• Margine di profitto = 4%.\n• Total asset turnover = 1.2.\n• Equity multiplier = 1.75.\n• Retention ratio = 65%.\n\nIl sustainable growth rate (SGR) è più vicino a:\n\n**Soluzione**\n\n$$\\begin{aligned} g &= \\frac{\\text{Net income}}{\\text{Sales}} \\times \\frac{\\text{Net income} - \\text{Dividends}}{\\text{Net income}} \\times \\frac{\\text{Sales}}{\\text{Total assets}} \\times \\frac{\\text{Total assets}}{\\text{Shareholders' equity}} \\\\ &= 0.65 \\times 4\\% \\times 1.2 \\times 1.75 \\\\ &= 5.46\\% \\end{aligned}$$\n\nUn'azienda con una ritenzione degli utili più alta e una leva finanziaria (equity multiplier) più alta avrà un tasso di crescita sostenibile dei dividendi più alto."}]}, "keyPoints": ["g = b × ROE", "ROE = margine × turnover × equity multiplier", "PRAT: Profit margin × Retention × Asset turnover × leverage", "Assume capitale invariato e nessuna nuova equity"], "examTips": ["Trucco PRAT: \"P-R-A-T\" sono quattro numeri da moltiplicare, l'ordine non conta", "Se ti danno il ROA, ROE = ROA × equity multiplier"], "question": {"q": "Consider two companies with the following information:\n\n| | ROA | Retention rate | Equity multiplier |\n|---|---|---|---|\n| Blue Enterprises | 13% | 30% | 1.3 |\n| Green Enterprises | 13% | 40% | 1.8 |\n\nGiven the above information, the sustainable growth rate for Blue and Green are closest to:", "options": ["3.9% and 5.2%, respectively.", "5.07% and 9.36%, respectively.", "3.9% and 7.2%, respectively."], "ans": 1, "exp": "The formula for the sustainable growth rate is \\(g = b \\times \\text{ROE}\\).\n\nFor Blue: \\(g = 13\\% \\times 30\\% \\times 1.3 = 5.07\\%\\)\n\nFor Green: \\(g = 13\\% \\times 40\\% \\times 1.8 = 9.36\\%\\)"}}, {"id": "p", "code": "LOS 23p", "title": "Valutare se un'azione è sopravvalutata, correttamente valutata o sottovalutata in base a un DDM", "commandWord": "Valutare", "importance": "MEDIUM", "content": {"introduction": "Se il prezzo di mercato corrente è maggiore del valore intrinseco stimato usando il DDM, l'azione è **sopravvalutata (overvalued)**. Se è uguale al valore intrinseco ottenuto dal DDM, l'azione è **correttamente valutata (fairly valued)**. Se è minore del valore intrinseco ottenuto dal DDM, l'azione è **sottovalutata (undervalued)**.", "sections": []}, "keyPoints": ["Prezzo > valore → overvalued", "Prezzo = valore → fairly valued", "Prezzo < valore → undervalued"], "examTips": ["Trucco: \"paghi più di quanto vale → sopravvalutata\""], "question": {"q": "If the current market price is greater than the intrinsic value estimated using the DDM, the stock is most likely:", "options": ["Overvalued.", "Undervalued.", "Fairly valued."], "ans": 0, "exp": "If the current market price is greater than the intrinsic value estimated using the DDM, the stock is overvalued.\n\n**B is incorrect.** If the current market price is less than the intrinsic value estimated using the DDM, the stock is undervalued.\n\n**C is incorrect.** If the current market price equals the intrinsic value estimated using the DDM, the stock is fairly valued."}}]}, {"id": "ev-r24", "number": 24, "title": "Free Cash Flow Valuation", "estimatedTime": "5-6 ore", "totalLOS": 13, "los": [{"id": "a", "code": "LOS 24a", "title": "Confrontare gli approcci di valutazione FCFF e FCFE", "commandWord": "Confrontare", "importance": "HIGH", "content": {"introduction": "", "sections": [{"title": "Valore attuale del FCFF", "icon": "🏢", "content": "L'approccio di valutazione basato sul **free cash flow to the firm (FCFF)** stima il valore dell'azienda come il valore attuale dei FCFF futuri scontati al costo medio ponderato del capitale (WACC):\n\n$$\\text{Firm Value} = \\sum_{t=1}^{\\infty} \\frac{\\text{FCFF}_t}{(1+\\text{WACC})^t}$$\n\nUsare il weighted average cost of capital (WACC) per scontare i FCFF dà il valore totale dell'azienda. Il valore del capitale (equity) è stimato deducendo il valore di mercato del debito dal valore dell'azienda.\n\n$$\\text{Equity Value} = \\text{Firm Value} - \\text{Market Value of Debt}$$\n\nIl valore per azione si ottiene dividendo il valore totale del capitale per il numero di azioni in circolazione.\n\nIl **WACC** è la media ponderata dei tassi di rendimento richiesti al netto delle imposte del debito e del capitale. I pesi sono le proporzioni del valore di mercato totale dell'azienda attribuibili a debito e capitale. Tuttavia, gli analisti possono anche usare pesi target. Il WACC dipende dalla rischiosità dei flussi di cassa. Più alta è la cifra del WACC, più rischiosi sono i flussi di cassa.\n\nIl WACC è calcolato come:\n\n$$\\text{WACC} = \\frac{\\text{MV(Debt)}}{\\text{MV(Debt)} + \\text{MV(Equity)}}\\, r_d(1-t) + \\frac{\\text{MV(Equity)}}{\\text{MV(Debt)} + \\text{MV(Equity)}}\\, r$$\n\nDove: \\(r\\) = Cost of equity (costo del capitale). \\(r_d\\) = Before-tax cost of debt (costo del debito al lordo delle imposte). \\(t\\) = Aliquota marginale d'imposta sul reddito d'impresa."}, {"title": "Valore attuale del FCFE", "icon": "👥", "content": "Il valore del capitale si ottiene scontando il **free cash flow to equity (FCFE)** al tasso di rendimento richiesto del capitale, \\(r\\).\n\n$$\\text{Equity value} = \\sum_{t=1}^{\\infty} \\frac{\\text{FCFE}_t}{(1+r)^t}$$\n\n**Exam tip #1:** Dividendo il valore del capitale per il numero di azioni in circolazione si ottiene il valore per azione.\n\n**Exam tip #2:** Quando usi il FCFF, dividi per (1 + WACC). Quando usi il FCFE, dividi per \\((1 + r)\\)."}]}, "keyPoints": ["FCFF → sconti al WACC → firm value", "Equity = firm value − valore di mercato del debito", "FCFE → sconti a r → equity value direttamente", "WACC usa il costo del debito after-tax"], "examTips": ["Trucco: il flusso e il tasso devono \"parlare dello stesso investitore\": tutti i finanziatori ↔ WACC, solo azionisti ↔ r"], "question": {"q": "Given the firm's value, which of the following is the most appropriate way of computing the value of equity?", "options": ["Adding the value of assets to the value of the firm.", "Deducting the value of assets from the value of the firm.", "Deducting the market value of debt from the value of the firm."], "ans": 2, "exp": "Given the firm's value, the value of equity can be computed by subtracting the market value of debt.\n\n$$\\text{Equity Value} = \\text{Firm Value} - \\text{Market Value of Debt}$$\n\n**A is incorrect.** Adding the value of the assets to the firm's value is not a method of computing the value of equity.\n\n**B is incorrect.** Deducting the value of assets from the firm's value would not give one the value of equity."}}, {"id": "b", "code": "LOS 24b", "title": "Spiegare la prospettiva proprietaria implicita nell'approccio FCFE", "commandWord": "Spiegare", "importance": "MEDIUM", "content": {"introduction": "Nell'approccio del free cash flow to equity (FCFE), la **prospettiva proprietaria (ownership perspective)** è quella di un acquirente che può cambiare la politica dei dividendi dell'azienda. Questo approccio assume una **prospettiva di controllo (control perspective)**, che presuppone il riconoscimento immediato del valore.\n\nD'altra parte, l'approccio del discounted dividend assume la prospettiva di un azionista di minoranza che non ha controllo sulla politica dei dividendi di un'azienda. Esso presuppone che il valore possa non essere realizzato finché la politica dei dividendi non rifletta la redditività di lungo periodo dell'azienda.\n\nL'approccio di valutazione basato sul free cash flow può essere preferito al dividend discount model quando:\n\n1. L'azienda non paga dividendi.\n2. L'azienda paga dividendi, ma questi differiscono significativamente dalla sua capacità di pagare dividendi.\n3. I free cash flow si allineano con la redditività entro un periodo di previsione soddisfacente.\n4. Un investitore che assume il controllo ha discrezionalità sull'uso del free cash flow.", "sections": []}, "keyPoints": ["FCFE = prospettiva di controllo", "DDM = prospettiva di minoranza", "FCF preferito: niente dividendi, dividendi ≠ capacità, FCF allineati alla redditività, controllo"], "examTips": ["Il caso \"FCF NON allineati alla redditività\" è un motivo CONTRO il FCF: distrattore classico"], "question": {"q": "Which of the following is least likely a reason why analysts use free cash flow valuation approach over the dividend discount approach?", "options": ["The company does not pay dividends.", "The company is being valued from a majority interest ownership perspective.", "The free cash flow does not align with profitability within a satisfactory forecast period."], "ans": 2, "exp": "Analysts will use not use the free cash flow approach when the free cash flow does not align with profitability within a satisfactory forecast period.\n\n**A is incorrect.** If a company does not pay dividends and it is not possible to forecast dividend payment in the future, analysts would use the free cash flow approach to value a company.\n\n**B is incorrect.** If the ownership perspective is that of a majority interest, free cash flow approach is more appropriate for valuation as the investor that takes control of the firm has discretion over the use of free cash flow."}}, {"id": "c", "code": "LOS 24c", "title": "Spiegare le rettifiche al net income, all'EBIT, all'EBITDA e al CFO necessarie per calcolare FCFF e FCFE", "commandWord": "Spiegare", "importance": "VERY HIGH", "content": {"introduction": "", "sections": [{"title": "Calcolo del FCFF dal Net Income", "icon": "🧾", "content": "Il FCFF è il flusso di cassa disponibile per i fornitori di capitale di un'azienda dopo aver dedotto le spese operative, le spese per il capitale circolante e gli investimenti in capitale fisso.\n\nIl FCFF può essere calcolato dal net income come:\n\n$$\\begin{aligned} \\text{FCFF} = {} & \\text{Net Income} + \\text{Net Non-Cash Charges} + \\text{Interest Expense}(1 - \\text{Tax Rate}) \\\\ & - \\text{Fixed Capital Investments} - \\text{Working Capital Investments} \\end{aligned}$$\n\nIl net income usato nell'equazione qui sopra è al lordo della deduzione dei dividendi agli azionisti ordinari, assumendo che i fornitori di capitale dell'azienda siano gli obbligazionisti e gli azionisti ordinari.\n\nI **net non-cash charges** (oneri netti non monetari) rappresentano una rettifica per diminuzioni o aumenti non monetari del net income. Un esempio di spesa non monetaria è l'ammortamento (depreciation and amortization). Si tratta di una spesa che riduce il net income ma non comporta un'uscita di cassa. Deve quindi essere riaggiunta al net income quando si calcola il FCFF. Le informazioni sugli oneri non monetari si trovano nel rendiconto finanziario (statement of cash flows).\n\nL'**after-tax interest expense** (interesse al netto delle imposte) deve essere riaggiunto al net income per arrivare al FCFF. Questo perché l'interesse passivo è dedotto per arrivare al net income, ma questo interesse è un flusso di cassa disponibile per i fornitori di debito dell'azienda.\n\nI **fixed capital investments** (investimenti in capitale fisso) rappresentano un'uscita di cassa per acquistare capitale fisso come immobili, impianti e macchinari (PPE) necessari a supportare le operazioni attuali e future dell'azienda. Questa informazione può essere derivata dal rendiconto finanziario.\n\nI **working capital investments** (investimenti in capitale circolante) rappresentano gli investimenti netti in attività correnti (crediti commerciali) meno le passività correnti (debiti commerciali), escludendo la cassa e il debito a breve termine (effetti passivi e quota corrente del debito a lungo termine). Questa informazione può essere derivata dallo stato patrimoniale e dal rendiconto finanziario.\n\n**Nota:** Se un'azienda ha azioni privilegiate, i **dividendi privilegiati (preferred dividends)** sono dedotti nel calcolo del net income. Pertanto, vengono riaggiunti nel calcolo del FCFF dell'azienda perché questo flusso di cassa è disponibile per un altro dei fornitori di capitale dell'azienda, gli azionisti privilegiati."}, {"title": "Calcolo del FCFF dal Cash Flow from Operations", "icon": "🔄", "content": "Anche il **cash flow from operations (CFO)** può essere usato per calcolare il FCFF. Il CFO è l'importo netto di cassa fornito dalle attività operative dell'azienda. Il cash flow from operations incorpora già le rettifiche per le spese non monetarie (come l'ammortamento) e gli investimenti netti in capitale circolante.\n\nIl rendiconto finanziario è suddiviso in tre segmenti:\n\n1. **Cash flow from operating activities**: è l'importo netto fornito dalle attività operative dell'azienda.\n2. **Cash flow from investing activities**: è l'impiego o la fonte di cassa dalle attività a lungo termine di un'azienda, come PP&E.\n3. **Cash flow from financing activities**: questa sezione mostra le attività di un'azienda nella raccolta o nel rimborso di capitale.\n\nIl FCFF può essere stimato dal CFO come:\n\n$$\\begin{aligned} \\text{FCFF} = {} & \\text{Cash Flow from Operations} + \\text{Interest}(1 - \\text{Tax Rate}) \\\\ & - \\text{Fixed Capital Investments} \\end{aligned}$$\n\nI non-cash charges e i working capital investments non sono inclusi nel calcolo qui sopra perché sono già inclusi nel calcolo del CFO."}, {"title": "Calcolo del FCFE dal FCFF", "icon": "➖", "content": "Il free cash flow to equity (FCFE) è il flusso di cassa disponibile per i detentori di capitale. Al contrario, il cash flow to the firm (FCFF) è il flusso di cassa disponibile per tutti i fornitori di capitale di un'azienda (azionisti ordinari, detentori di debito e azionisti privilegiati, se presenti). Il FCFE è la somma che l'azienda può permettersi di distribuire come dividendi. Le aziende, tuttavia, non pagano l'intero importo perché vorrebbero mantenere stabili i loro dividendi.\n\nAssumendo l'assenza di azionisti privilegiati, la differenza tra FCFF e FCFE è il flusso di cassa verso i fornitori di debito. I flussi di cassa che derivano dalle transazioni con i debitori sono dedotti dal FCFF per arrivare al FCFE.\n\nIl FCFE può essere calcolato come:\n\n$$\\begin{aligned} \\text{FCFE} = {} & \\text{FCFF} - \\text{Interest}(1 - \\text{Tax Rate}) \\\\ & + \\text{Net Borrowing} \\end{aligned}$$\n\nL'after-tax interest è dedotto dal FCFF per rimuovere il flusso di cassa disponibile per i detentori di debito. Di conseguenza, il **net borrowing** (indebitamento netto) include i nuovi prestiti di debito dell'azienda meno i rimborsi di debito, per arrivare all'importo netto.\n\nProprio come il FCFF, il FCFE può essere calcolato dal net income e dal cash flow from operations:\n\n$$\\begin{aligned} \\text{FCFE} = {} & \\text{Net Income} + \\text{Non-Cash Charges} - \\text{Fixed Capital Investments} \\\\ & - \\text{Working Capital Investments} + \\text{Net Borrowing} \\end{aligned}$$\n\nLa differenza tra questa equazione e quella che calcola il FCFF usando il net income è l'after-tax interest e il net borrowing. L'after-tax interest è già dedotto nel calcolo del net income e quindi non viene riaggiunto. Il net borrowing è aggiunto perché questo importo è disponibile per i detentori di capitale da usare a loro discrezione. Quindi, è calcolato come i prestiti dell'azienda meno i rimborsi dell'azienda.\n\n$$\\begin{aligned} \\text{FCFE} = {} & \\text{Cash from Operations} - \\text{Fixed Capital Investments} \\\\ & + \\text{Net Borrowing} \\end{aligned}$$\n\nIl cash from operations ha già le rettifiche per l'interest expense e i working capital investments. Pertanto, dedurre i fixed capital investments e aggiungere il net borrowing stimerebbe il FCFE."}, {"title": "Calcolo di FCFF e FCFE da EBIT o EBITDA", "icon": "🧮", "content": "EBIT ed EBITDA possono essere punti di partenza nel calcolo di FCFF e FCFE. Assumendo che l'unica spesa non monetaria di un'azienda sia l'ammortamento, il FCFF può essere calcolato dal net income come:\n\n$$\\begin{aligned} \\text{FCFF} = {} & \\text{Net Income} + \\text{Depreciation} + \\text{Interest}(1 - \\text{Tax Rate}) \\\\ & - \\text{Fixed Capital Investments} - \\text{Working Capital Investments} \\end{aligned}$$\n\nIl net income può essere espresso come:\n\n$$\\begin{aligned} \\text{Net income} &= (\\text{EBIT} - \\text{Interest})(1 - \\text{Tax Rate}) \\\\ &= \\text{EBIT}(1 - \\text{Tax Rate}) - \\text{Interest}(1 - \\text{Tax Rate}) \\end{aligned}$$\n\nSostituendo l'equazione del net income nell'equazione del FCFF, possiamo calcolare il FCFF come:\n\n$$\\begin{aligned} \\text{FCFF} = {} & \\text{EBIT}(1 - \\text{Tax Rate}) + \\text{Depreciation} \\\\ & - \\text{Fixed Capital Investments} - \\text{Working Capital Investments} \\end{aligned}$$\n\nIl net income può essere calcolato dall'EBITDA come:\n\n$$\\begin{aligned} \\text{Net Income} &= (\\text{EBITDA} - \\text{Depreciation} - \\text{Interest})(1 - \\text{Tax Rate}) \\\\ &= \\text{EBITDA}(1 - \\text{Tax Rate}) - \\text{Depreciation}(1 - \\text{Tax Rate}) \\\\ & \\quad - \\text{Interest}(1 - \\text{Tax Rate}) \\end{aligned}$$\n\nSostituendo la formula del net income nell'equazione del FCFF, possiamo calcolare il FCFF come:\n\n$$\\begin{aligned} \\text{FCFF} = {} & \\text{EBITDA}(1 - \\text{Tax}) + \\text{Depreciation}(\\text{Tax}) \\\\ & - \\text{Fixed Capital Investments} - \\text{Working Capital Investments} \\end{aligned}$$\n\nMolte rettifiche per i non-cash charges richieste per calcolare il FCFF quando si parte dal net income non sono richieste quando si parte da EBIT o EBITDA. Questo perché molti oneri non monetari sono effettuati dopo il calcolo di EBIT o EBITDA, quindi non devono essere riaggiunti quando si calcola il FCFF basato su EBIT o EBITDA.\n\nAnche il FCFE può essere calcolato da EBIT o EBITDA. Per ottenere il FCFE basato su EBIT o EBITDA, si usa l'espressione del FCFF da EBIT o l'espressione del FCFF da EBITDA, rispettivamente, e si sottrae l'after-tax interest e si aggiunge il net borrowing. Il FCFE è calcolato dal FCFF come:\n\n$$\\text{FCFE} = \\text{FCFF} - \\text{Interest}(1 - \\text{Tax Rate}) + \\text{Net Borrowing}$$\n\nIl FCFE può essere calcolato da EBIT come:\n\n$$\\begin{aligned} \\text{FCFE} = {} & \\text{EBIT}(1 - \\text{Tax Rate}) - \\text{Interest}(1 - \\text{Tax Rate}) + \\text{Depreciation} \\\\ & - \\text{Fixed Capital Investment} - \\text{Working Capital Investments} \\\\ & + \\text{Net Borrowing} \\end{aligned}$$\n\nIl FCFE può essere calcolato da EBITDA come:\n\n$$\\begin{aligned} \\text{FCFE} = {} & \\text{EBITDA}(1 - \\text{Tax rate}) - \\text{Interest}(1 - \\text{Tax Rate}) \\\\ & + \\text{Depreciation}(\\text{Tax Rate}) - \\text{Fixed Capital Investments} \\\\ & - \\text{Working Capital Investments} + \\text{Net Borrowing} \\end{aligned}$$"}]}, "keyPoints": ["FCFF = NI + NCC + Int(1 − t) − FCInv − WCInv", "FCFF = CFO + Int(1 − t) − FCInv", "FCFF = EBIT(1 − t) + Dep − FCInv − WCInv", "FCFF = EBITDA(1 − t) + Dep·t − FCInv − WCInv", "FCFE = FCFF − Int(1 − t) + Net borrowing"], "examTips": ["Dall'EBITDA l'ammortamento entra solo come scudo fiscale (Dep × t), non per intero", "Dal CFO NON riaggiungere l'ammortamento: c'è già", "WCInv esclude cassa e debito a breve"], "question": {"q": "Which of the following is least likely reflected in the calculation of FCFF when beginning with cash flow from operations (CFO)?", "options": ["Interest.", "Depreciation.", "Fixed capital investments."], "ans": 1, "exp": "Depreciation is not considered in the calculation of FCFF when beginning with CFO. It is already added back when computing CFO.\n\n**C is incorrect.** Fixed capital investments are deducted from CFO when calculating FCFF.\n\n**A is incorrect.** After-tax interest expense is added to CFO when calculating FCFF."}}, {"id": "d", "code": "LOS 24d", "title": "Calcolare FCFF e FCFE", "commandWord": "Calcolare", "importance": "VERY HIGH", "content": {"introduction": "Si considerino le seguenti informazioni relative ad ABC Ltd:\n\n**Conto Economico (in milioni di $)**\n\n| | 2020 | 2019 |\n|---|---|---|\n| Sales | 294 | 212 |\n| COGS | 132 | 106 |\n| Gross profit | 162 | 106 |\n| SG&A | 12 | 9 |\n| Depreciation | 28 | 24 |\n| EBIT | 122 | 73 |\n| Interest Expense | 9 | 7 |\n| Pre-tax earnings | 113 | 66 |\n| Taxes | 28.25 | 17 |\n| Net income | 84.75 | 50 |\n\n**Stato Patrimoniale (in milioni di $)**\n\n| | 2020 | 2019 |\n|---|---|---|\n| Gross PPE | 678 | 529 |\n| Accumulated depreciation | 122 | 94 |\n| Net PPE | 556 | 435 |\n| Inventory | 25 | 21 |\n| Accounts receivable | 4 | 7 |\n| Cash | 11 | 9 |\n| Total current assets | 40 | 37 |\n| Total assets | 596 | 472 |\n| Common stock | 141 | 141 |\n| Retained earnings | 236 | 157 |\n| Total equity | 377 | 298 |\n| Long-term debt | 172 | 136 |\n| Short-term debt | 29 | 24 |\n| Accounts payable | 18 | 14 |\n| Total current liabilities | 47 | 38 |\n| Total liabilities | 219 | 174 |\n| Total equity and liabilities | 596 | 472 |\n\nPossiamo stimare FCFF e FCFE per il 2020 partendo da: net income, EBIT, EBITDA, CFO.", "sections": [{"title": "Partendo dal Net Income", "icon": "🧾", "content": "**Calcolo del FCFF**\n\n$$\\text{FCFF} = \\text{NI} + \\text{NNC} + \\text{Int}(1 - \\text{Tax rate}) - \\text{FCInv} - \\text{WCInv}$$\n\n$$\\begin{aligned} \\text{FCInv} &= \\text{Gross PPE}_{2020} - \\text{Gross PPE}_{2019} \\\\ &= \\$678 - \\$529 = \\$149 \\\\ \\text{WCInv} &= (\\text{AR}_{2020} + \\text{Inventory}_{2020} - \\text{AP}_{2020}) \\\\ & \\quad - (\\text{AR}_{2019} + \\text{Inventory}_{2019} - \\text{AP}_{2019}) \\\\ &= (4 + 25 - 18) - (7 + 21 - 14) = -3 \\end{aligned}$$\n\nPertanto:\n\n$$\\text{FCFF} = 84.75 + 28 + 9(1 - 0.25) - 149 - (-3) = -26.50$$\n\n**Calcolo del FCFE**\n\n$$\\text{FCFE} = \\text{NI} + \\text{NCC} - \\text{FCInv} - \\text{WCInv} + \\text{Net borrowing}$$\n\n$$\\begin{aligned} \\text{Net borrowing} &= \\text{Aumento del debito a breve e lungo termine nell'anno} \\\\ &= (172 + 29) - (136 + 24) = 41 \\end{aligned}$$\n\nPertanto:\n\n$$\\text{FCFE} = 84.75 + 28 - 149 - (-3) + 41 = 7.75$$"}, {"title": "Partendo dall'EBIT", "icon": "🏭", "content": "**FCFF**\n\n$$\\begin{aligned} \\text{FCFF} &= \\text{EBIT}(1 - \\text{Tax rate}) + \\text{Dep} - \\text{FCInv} - \\text{WCInv} \\\\ &= 122(1 - 0.25) + 28 - 149 - (-3) = -26.50 \\end{aligned}$$\n\n**FCFE**\n\n$$\\begin{aligned} \\text{FCFE} &= \\text{EBIT}(1 - \\text{Tax rate}) - \\text{Int}(1 - \\text{Tax rate}) + \\text{Dep} - \\text{WCInv} + \\text{Net borrowing} \\\\ &= 122(1 - 0.25) - 9(1 - 0.25) + 28 - 149 - (-3) + 41 = 7.75 \\end{aligned}$$"}, {"title": "Partendo dall'EBITDA", "icon": "⚙️", "content": "**FCFF**\n\n$$\\begin{aligned} \\text{FCFF} &= \\text{EBITDA}(1 - t) + \\text{Dep}(t) - \\text{FCInv} - \\text{WCInv} \\\\ &= (162 - 12)(1 - 0.25) + 28(0.25) - 149 - (-3) = -26.50 \\end{aligned}$$\n\n(EBITDA = Gross profit − SG&A = 162 − 12 = 150)\n\n**FCFE**\n\n$$\\begin{aligned} \\text{FCFE} &= \\text{EBITDA}(1 - t) - \\text{Int}(1 - t) + \\text{Dep}(t) - \\text{FCInv} - \\text{WCInv} + \\text{Net borrowing} \\\\ &= (162 - 12)(1 - 0.25) - 9(0.75) + 28(0.25) - 149 - (-3) + 41 = 7.75 \\end{aligned}$$"}, {"title": "Partendo dal CFO", "icon": "🔄", "content": "**FCFF**\n\n$$\\begin{aligned} \\text{CFO} &= \\text{Net income} + \\text{Depreciation} - \\text{WCInv} \\\\ &= 84.75 + 28 - 3 = 115.75 \\end{aligned}$$\n\nPertanto:\n\n$$\\text{FCFF} = 115.75 + 9(1 - 0.25) - 149 = -26.50$$\n\n**FCFE**\n\n$$\\text{FCFE} = 115.75 - 149 + 41 = 7.75$$"}]}, "keyPoints": ["FCInv = variazione del Gross PPE (non del Net PPE)", "WCInv = Δ(crediti + scorte − debiti commerciali)", "Net borrowing = Δ(debito a breve + a lungo)", "Quattro strade, stesso FCFF e FCFE"], "examTips": ["Una diminuzione del capitale circolante (WCInv negativo) AUMENTA il free cash flow: attento ai segni", "Per la tax rate: imposte / utile ante imposte"], "question": {"q": "Blue Ltd.'s capital constitutes a debt of $200,000 and equity of $300,000. It recently announced a net income of $275,000. The company managers have invested $90,000 in fixed capital and $60,000 in working capital. The company's only non-cash expense for the period was $40,000. If the company's average after-tax interest on debt is 8%, the free cash flow to the firm (FCFF) is closest to:", "options": ["$90,000.", "$181,000.", "$145,000."], "ans": 1, "exp": "$$\\begin{aligned} \\text{FCFF} = {} & \\text{Net income} + \\text{Net non-cash charges} + \\text{Interest expense}(1 - \\text{Tax rate}) \\\\ & - \\text{Fixed capital investments} - \\text{Working capital investments} \\\\ = {} & \\$275{,}000 + \\$40{,}000 + (8\\% \\times \\$200{,}000) - \\$90{,}000 - \\$60{,}000 \\\\ = {} & \\$181{,}000 \\end{aligned}$$"}}, {"id": "e", "code": "LOS 24e", "title": "Descrivere gli approcci per prevedere FCFF e FCFE", "commandWord": "Descrivere", "importance": "HIGH", "content": {"introduction": "Ci sono due approcci usati per prevedere FCFF e FCFE:\n\n1. **Applicare un tasso di crescita costante al free cash flow corrente**: questo assume che il tasso di crescita storico si applichi al futuro. Sarebbe appropriato se il free cash flow storico è cresciuto a un tasso costante che ci si aspetta continui in futuro.\n2. **Prevedere alcune componenti del free cash flow**: queste componenti sono EBIT(1−Tax), oneri netti non monetari (net non-cash charges), investimenti in capitale fisso (fixed capital investments) e investimenti in capitale circolante (working capital investments). È un approccio più complicato.\n\nL'EBIT può essere previsto prevedendo le vendite e il margine EBIT dell'azienda sulla base dei dati storici e dell'ambiente economico attuale e atteso.\n\nI fabbisogni di capitale (fixed capital investments e working capital investments) possono essere previsti sulla base della relazione storica tra gli incrementi delle vendite e gli investimenti in capitale fisso e circolante, entrambi legati alle vendite dell'azienda.", "sections": [{"title": "Metodo di previsione basato sulle vendite (Sales-Based Forecasting Method)", "icon": "📈", "content": "Un'ipotesi centrale del metodo di previsione basato sulle vendite è:\n\n1. Gli investimenti in capitale fisso al di sopra dell'ammortamento (Fixed capital investments – Depreciation) e gli investimenti in capitale circolante hanno entrambi una relazione costante con gli incrementi previsti delle vendite.\n2. Si assume anche che il debt ratio rimanga costante. Il debt ratio sarebbe quindi la percentuale dei nuovi investimenti netti in capitale fisso e circolante finanziata da debito.\n3. Se l'ammortamento riflette il costo annuo per il mantenimento del capitale esistente, gli investimenti incrementali in capitale fisso dovrebbero essere legati alle spese in conto capitale richieste per la crescita. Sarebbero richiesti i seguenti input:\n\n• Previsioni dei tassi di crescita delle vendite.\n• Previsioni del margine operativo after-tax o del margine di profitto.\n• Una stima della relazione tra investimenti incrementali in capitale fisso e incremento delle vendite.\n• Una stima della relazione tra investimenti in capitale circolante e incremento delle vendite.\n• Una stima del debt ratio.\n\nIl FCFF è previsto come EBIT(1−Tax rate) meno gli investimenti incrementali in capitale fisso e gli investimenti incrementali in capitale circolante. Gli investimenti incrementali in capitale fisso e circolante sono stimati moltiplicando la loro proporzione passata rispetto agli incrementi delle vendite per gli incrementi di vendite previsti.\n\n• Gli investimenti incrementali in capitale fisso come proporzione degli incrementi delle vendite si calcolano come:\n\n$$\\frac{\\text{Capital Expenditures} - \\text{Depreciation Expense}}{\\text{Increase in Sales}}$$\n\n• Gli investimenti incrementali in capitale circolante come proporzione degli incrementi delle vendite si calcolano come:\n\n$$\\frac{\\text{Increase in Working Capital Investments}}{\\text{Increase in Sales}}$$\n\nCon questo approccio, gli investimenti in capitale hanno due componenti:\n\n1. Investimenti necessari a mantenere la capacità esistente (sostituzioni di capitale fisso). Qui gli investimenti per mantenere la capacità sono verosimilmente legati al livello **corrente** delle vendite.\n2. Investimenti necessari per la crescita. Gli investimenti per la crescita sono verosimilmente legati alla **previsione** di crescita delle vendite.\n\nAssumendo che l'ammortamento sia l'unico onere non monetario, il FCFF può essere previsto come:\n\n$$\\begin{aligned} \\text{FCFE} = {} & \\text{Net Income} - (\\text{Fixed Capital Investments} - \\text{Depreciation}) \\\\ & - \\text{Working Capital Investments} + \\text{Net Borrowing} \\end{aligned}$$\n\n(Nota: nel testo originale l'intestazione dice \"FCFF\" ma la formula riportata è in realtà quella del FCFE, che parte dall'utile netto e include il net borrowing.)\n\n(Fixed capital investments – Depreciation) rappresenta gli investimenti incrementali in capitale fisso al netto dell'ammortamento. Il net borrowing previsto può essere eliminato usando un debt ratio (DR) ipotizzato:\n\n$$\\begin{aligned} \\text{Net Borrowing} = {} & \\text{DR}(\\text{Fixed Capital Investments} - \\text{Depreciation}) \\\\ & + \\text{DR}(\\text{Working Capital Investments}) \\end{aligned}$$\n\nIncorporando questo nell'equazione, il FCFE può essere calcolato come:\n\n$$\\begin{aligned} \\text{FCFE} = {} & \\text{Net income} - (1 - \\text{DR})(\\text{Fixed Capital Investments} - \\text{Depreciation}) \\\\ & - (1 - \\text{DR})\\,\\text{Working Capital Investments} \\end{aligned}$$\n\nDa questa equazione, il FCFE è uguale all'utile netto meno la quota di investimenti incrementali in capitale fisso e circolante finanziata da equity."}, {"title": "Esempio: previsione del FCFF", "icon": "✏️", "content": "Si consideri la seguente informazione:\n\n| Voce | Valore |\n|---|---|\n| Sales (vendite) | $2,320 |\n| Sales growth (crescita vendite) | $116 |\n| EBIT | $348 |\n| Tax rate (aliquota fiscale) | 25% |\n| Purchase of fixed assets (acquisto immobilizzazioni) | $464 |\n| Depreciation expense (ammortamento) | $406 |\n| Change in working capital (variazione CCN) | $29 |\n| Net income margin (margine utile netto) | 8% |\n| Debt ratio | 25% |\n\nIl FCFF è closest to:\n\n**Soluzione**\n\n$$\\begin{aligned} \\text{Sales growth} &= \\frac{\\$116}{\\$2320} = 5\\% \\\\ \\text{EBIT margin} &= \\frac{\\$348}{\\$2320} = 15\\% \\\\ \\text{Incremental FC/Sales growth} &= \\frac{(\\$464 - \\$406)}{\\$116} = 50\\% \\\\ \\text{Incremental WC/Sales growth} &= \\frac{\\$29}{\\$116} = 25\\% \\end{aligned}$$\n\n$$\\begin{aligned} \\text{Sales} &= \\$116 + \\$2320 = \\$2436 \\\\ \\text{EBIT} &= \\$2436 \\times 15\\% = \\$365 \\\\ \\text{EBIT}(1 - \\text{Tax rate}) &= \\$365 \\times (1 - 25\\%) = \\$274 \\\\ \\text{Incremental FC} &= \\$116 \\times 50\\% = \\$58 \\\\ \\text{Incremental WC} &= \\$116 \\times 25\\% = \\$29 \\end{aligned}$$\n\n$$\\begin{aligned} \\text{FCFF} &= \\text{EBIT}(1 - \\text{Tax rate}) - \\Delta\\text{Capex} - \\Delta\\text{WCInv} \\\\ &= 365(1 - 25\\%) - \\$58 - \\$29 = \\$187 \\end{aligned}$$"}]}, "keyPoints": ["Due approcci: crescita costante o componenti", "Sales-based: investimenti proporzionali all'aumento delle vendite", "FCFF = EBIT(1 − t) − (FCInv − Dep) − WCInv", "FCFE = NI − (1 − DR)(FCInv − Dep) − (1 − DR)WCInv"], "examTips": ["Con DR costante, il net borrowing sparisce dalla formula: l'equity finanzia solo (1 − DR) degli investimenti", "Se hai già il margine after-tax, la tax rate non serve"], "question": {"q": "Which of the following is least likely a required input when forecasting FCFF?", "options": ["Tax rate.", "Forecasted sales growth rate.", "Forecasted after-tax operating margin or profit margin."], "ans": 0, "exp": "The tax rate is not an input required when forecasting the FCFF, especially when an analyst already has the after-tax operating margin or profit margin.\n\n**B is incorrect.** A forecast sales growth rate is required when forecasting FCFF by forecasting its components.\n\n**C is incorrect.** A forecast of after-tax operating margin or profit margin is required when forecasting FCFF by forecasting its components."}}, {"id": "f", "code": "LOS 24f", "title": "Confrontare il modello FCFE e i modelli dividend discount", "commandWord": "Confrontare", "importance": "MEDIUM", "content": {"introduction": "L'approccio di valutazione basato sul free cash flow è preferito rispetto al dividend discount model (DDM) perché:\n\n• Molte società pagano dividendi in contanti nulli o minimi. Usare il DDM richiederebbe di assumere un periodo futuro in cui i dividendi saranno pagati, l'importo che sarà pagato e il suo tasso di crescita.\n• I dividendi sono a discrezione del consiglio di amministrazione della società. I dividendi potrebbero quindi non segnalare la profittabilità di lungo periodo dell'azienda.\n• I dividendi sono flussi di cassa che vanno agli azionisti, mentre il FCFE è il flusso di cassa disponibile per gli azionisti senza compromettere le operazioni dell'azienda. Pertanto, esso assume una prospettiva di azionista di minoranza. Se un'azienda viene valutata perché è un obiettivo di acquisizione (takeover target), una misura di free cash flow è più appropriata.", "sections": []}, "keyPoints": ["Dividendi nulli o minimi → FCF", "Dividendi decisi dal CdA, possono non riflettere la redditività", "Minoranza → DDM; acquisizione/controllo → FCF"], "examTips": ["FCFE = capacità di pagare; dividendi = quanto si paga davvero"], "question": {"q": "Which of the following valuation models is most appropriate when valuing a company from a minority shareholder perspective?", "options": ["FCFE model.", "FCFF model.", "Dividend discount model."], "ans": 2, "exp": "The dividend discount model is the most appropriate valuation model when valuing a company from a minority shareholders' perspective.\n\n**A is incorrect.** The FCFE model is appropriate when valuing a company from a majority shareholder's perspective.\n\n**B is incorrect.** FCFF is also be used to value the firm from a majority shareholder's perspective."}}, {"id": "g", "code": "LOS 24g", "title": "Spiegare come dividendi, riacquisti, emissioni di azioni e variazioni di leva influenzano FCFF e FCFE futuri", "commandWord": "Spiegare", "importance": "MEDIUM", "content": {"introduction": "I **dividendi**, i **riacquisti di azioni (share repurchases)** e le **emissioni di azioni (share issuance)** non influenzano FCFF e FCFE. La ragione è che FCFF e FCFE sono flussi di cassa disponibili per gli investitori, mentre dividendi e riacquisti di azioni sono utilizzi di questi flussi di cassa. Pertanto, la transazione tra l'azienda e i suoi azionisti (tramite dividendi in contanti, emissioni e riacquisti di azioni) non influenza il free cash flow.\n\nLe **variazioni della leva finanziaria (leverage changes)** avranno un lieve impatto sul FCFE ma non sul FCFF. Nel periodo in cui il debito viene emesso, il FCFE aumenterà dell'importo del debito emesso. Successivamente, il FCFE si ridurrà dell'interesse passivo al netto delle imposte (after-tax interest expense).\n\nSe tutti gli input fossero noti, un DDM e un modello FCFE produrrebbero valutazioni identiche per un'azione. Tuttavia, FCFE e dividendi differiranno, ma gli stessi fattori economici che portano a dividendi alti (bassi) portano a un FCFE alto (basso). Per esempio, se un'azienda ha molte opportunità di investimento promettenti, reinvestirà e pagherà pochi dividendi; di conseguenza i suoi investimenti in capitale fisso saranno elevati, riducendo l'importo del FCFE.", "sections": []}, "keyPoints": ["Dividendi, buyback, emissioni → nessun effetto su FCFF/FCFE", "Nuovo debito → FCFE ↑ subito, poi ↓ per gli interessi", "Il FCFF non dipende dalla leva"], "examTips": ["Trucco: il free cash flow si misura PRIMA di decidere come distribuirlo"], "question": {"q": "Which of the following would most likely affect FCFE?", "options": ["Dividends.", "Debt increase.", "Share repurchases."], "ans": 1, "exp": "Debt increases will have an impact on FCFE. In the period that the debt is issued, FCFE will increase by the debt amount, and in subsequent periods it will reduce by the after-tax interest expense.\n\n**C is incorrect.** Share repurchases are uses of cash flow but do not affect the amount of cash flow available to equity shareholders.\n\n**A is incorrect.** Dividends do not affect the cash flow available to equity shareholders, but it is a use of the cash flows available to equity shareholders."}}, {"id": "h", "code": "LOS 24h", "title": "Valutare l'uso del net income e dell'EBITDA come proxy del flusso di cassa nella valutazione", "commandWord": "Valutare", "importance": "MEDIUM", "content": {"introduction": "Usare altre misure di reddito come utile netto, EBIT, EBITDA o CFO nel modello discounted cash flow darebbe una stima errata del valore di un'azienda.", "sections": [{"title": "L'utile netto (net income) in modo inappropriato", "icon": "🚫", "content": "• Include gli effetti degli oneri non monetari (non-cash charges) come l'ammortamento, che dovrebbero essere riaggiunti per calcolare il flusso di cassa disponibile per gli azionisti.\n• Ignora il flusso di cassa in entrata dai net borrowings.\n• Ignora il flusso di cassa in uscita per FCInv e WCInv."}, {"title": "L'EBIT in modo inappropriato", "icon": "🚫", "content": "• Non riflette le imposte in contanti (cash taxes) pagate dall'azienda.\n• Ignora gli effetti di FCInv e WCInv.\n• Non tiene conto del contributo dello **scudo fiscale dell'ammortamento (depreciation tax shield)**."}]}, "keyPoints": ["NI: include oneri non monetari, ignora NB, FCInv, WCInv", "EBIT/EBITDA: ignora tasse, FCInv, WCInv e tax shield", "Nessuna di queste misure è un free cash flow"], "examTips": ["Associa: \"non-cash charges\" → problema del NI; \"cash taxes\" e \"tax shield\" → problema dell'EBIT/EBITDA"], "question": {"q": "Which of the following reasons most likely makes net income a poor measure of earnings in the discounted cash flow model?", "options": ["It does not reflect the cash taxes paid by the firm.", "It does not account for the depreciation tax shield.", "It includes the effects of non-cash charges like depreciation."], "ans": 2, "exp": "Net income is a poor measure of earnings in the discounted cash flow model because it includes the effects of non-cash charges like deprecation. Depreciation should be added back as it is a non-cash expense.\n\n**A is incorrect.** Net income reflects the cash taxes paid by the firm. This is a reason why EBIT is a poor measure of earnings in the discounted cash flow model.\n\n**B is incorrect.** Net income reflects the depreciation tax shield as depreciation is deducted when computing net income. This is a reason why EBIT is a poor measure of earnings in the discounted cash flow model."}}, {"id": "i", "code": "LOS 24i", "title": "Descrivere i modelli FCFF e FCFE single-stage, two-stage e three-stage e selezionare il modello adatto", "commandWord": "Descrivere", "importance": "HIGH", "content": {"introduction": "", "sections": [{"title": "Modelli single-stage (a crescita costante)", "icon": "➡️", "content": "**Calcolo FCFF.** Assumendo che il FCFF cresca a un tasso costante \\(g\\), il FCFF del periodo successivo sarà:\n\n$$\\text{FCFF}_t = \\text{FCFF}_{t-1}(1+g)$$\n\nSe il FCFF cresce a un tasso costante, il valore dell'azienda si calcola come:\n\n$$\\text{Firm value} = \\frac{\\text{FCFF}_1}{\\text{WACC} - g} = \\frac{\\text{FCFF}_0(1+g)}{\\text{WACC} - g}$$\n\n**Calcolo FCFE.** Assumendo che il FCFE cresca a un tasso costante \\(g\\), il FCFE del periodo successivo sarà:\n\n$$\\text{FCFE}_t = \\text{FCFE}_{t-1}(1+g)$$\n\nIl valore dell'equity si calcola come:\n\n$$\\text{Equity value} = \\frac{\\text{FCFE}_1}{r - g} = \\frac{\\text{FCFE}_0(1+g)}{r - g}$$\n\nDove: \\(r\\) = Tasso di rendimento richiesto sull'equity. \\(g\\) = Tasso di crescita costante."}, {"title": "Modelli two-stage", "icon": "2️⃣", "content": "In un modello two-stage, il tasso di crescita nel secondo stadio è un tasso di crescita sostenibile di lungo periodo. Per un settore in declino, il tasso del secondo stadio potrebbe essere leggermente inferiore al tasso di crescita economica, oppure leggermente superiore per un settore con forte crescita.\n\nCi sono due approcci al modello two-stage FCFF e FCFE, differenziati dal tasso di crescita nel primo stadio:\n\n1. Il tasso di crescita è costante nello stadio 1 e poi cala bruscamente al tasso di crescita sostenibile di lungo periodo nello stadio 2.\n2. Il tasso di crescita declina nello stadio 1 fino a raggiungere il tasso sostenibile di lungo periodo all'inizio dello stadio 2. Questo è simile all'H-model del dividend discount model.\n\nNei modelli free cash flow, il tasso di crescita può riferirsi a variabili diverse, ossia FCFF o FCFE, utili (utile netto o utile operativo), o tassi di crescita delle vendite.\n\n**Calcolo FCFF.** Il modello di valutazione FCFF two-stage generale è:\n\n$$\\text{Firm value} = \\sum_{t=1}^{n} \\frac{\\text{FCFF}_t}{(1+\\text{WACC})^t} + \\frac{\\text{FCFF}_{n+1}}{(\\text{WACC} - g)} \\frac{1}{(1+\\text{WACC})^n}$$\n\nIl terminal value è stimato usando un modello FCFF a crescita costante, \\(\\frac{\\text{FCFF}_{n+1}}{(\\text{WACC}-g)}\\), che viene attualizzato al presente tramite \\(\\frac{1}{(1+\\text{WACC})^n}\\). Sottraendo il valore del debito in essere dal valore dell'azienda si ottiene il valore dell'equity. Infine, il valore per azione si stima dividendo il valore totale dell'equity per il numero di azioni in circolazione.\n\n**Calcolo FCFE.** Il modello di valutazione FCFE two-stage generale è:\n\n$$\\text{Equity value} = \\sum_{t=1}^{n} \\frac{\\text{FCFE}_t}{(1+r)^t} + \\frac{\\text{FCFE}_{n+1}}{r - g} \\frac{1}{(1+r)^n}$$\n\nIl terminal value è stimato usando il modello FCFE a crescita costante, \\(\\frac{\\text{FCFE}_{n+1}}{r-g}\\), attualizzato al presente tramite \\(\\frac{1}{(1+r)^n}\\). Il terminal value potrebbe anche essere stimato con l'approccio dei multipli. Anche qui, il valore per azione si calcola dividendo il valore totale dell'equity per il numero di azioni in circolazione.\n\nSe un'azienda ha attività non operative significative, come liquidità in eccesso e titoli negoziabili, queste dovrebbero essere valutate separatamente e poi aggiunte al valore delle attività operative per trovare il valore totale dell'azienda:\n\n$$\\text{Value of the firm} = \\text{Value of operating assets} + \\text{Value of non-operating assets}$$"}, {"title": "Modelli di crescita three-stage", "icon": "3️⃣", "content": "Ci sono due approcci:\n\n1. Assumere un tasso di crescita costante ma diverso per i tre stadi.\n2. Assumere un tasso di crescita costante negli stadi 1 e 3 e un tasso di crescita decrescente nello stadio 2."}]}, "keyPoints": ["FCFF single-stage: FCFF1 / (WACC − g)", "FCFE single-stage: FCFE1 / (r − g)", "Two-stage: PV flussi + PV terminal value", "Attività non operative si aggiungono a parte"], "examTips": ["FCFF ↔ WACC, FCFE ↔ r: mai incrociarli"], "question": {"q": "Which of the following discount rates is applied to FCFF when computing the firm's value?", "options": ["WACC.", "r−g.", "r."], "ans": 0, "exp": "The weighted average cost of capital (WACC) represents its blended cost of capital across all sources, including common shares, preferred shares, and debt. It is the rate that discounts the free cash flow to the firm (FCFF) to arrive at the value of the firm.\n\n**B is incorrect.** r−g is used to discount FCFE.\n\n**C is incorrect.** r is not used to discount FCFF."}}, {"id": "j", "code": "LOS 24j", "title": "Stimare il valore di un'azienda o della sua equity con un modello free cash flow", "commandWord": "Stimare", "importance": "VERY HIGH", "content": {"introduction": "L'approccio FCFF stima il valore dell'azienda come valore attuale dei FCFF futuri attualizzati al costo medio ponderato del capitale:\n\n$$\\text{Firm value} = \\sum_{t=1}^{\\infty} \\frac{\\text{FCFF}_t}{(1+\\text{WACC})^t}$$\n\nIl valore dell'equity si ottiene deducendo il valore di mercato del debito dal valore dell'azienda, e il valore per azione dividendo per il numero di azioni in circolazione:\n\n$$\\text{Equity value} = \\text{Firm value} - \\text{Market value of debt}$$\n\nIl WACC è la media ponderata dei rendimenti richiesti after-tax di debito ed equity, dove i pesi sono le proporzioni del valore di mercato totale dell'azienda attribuibili a debito ed equity (gli analisti possono anche usare pesi target):\n\n$$\\text{WACC} = \\frac{\\text{MV(Debt)}}{\\text{MV(Debt)} + \\text{MV(Equity)}}\\, r_d(1 - \\text{Tax rate}) + \\frac{\\text{MV(Equity)}}{\\text{MV(Debt)} + \\text{MV(Equity)}}\\, r$$", "sections": [{"title": "Esempio: valutazione FCFF a tre stadi", "icon": "✏️", "content": "| Voce | Valore |\n|---|---|\n| Current FCFF (in $ milioni) | 175 |\n| Outstanding shares (in milioni) | 525 |\n| Long-term debt value (in $ milioni) | 700 |\n| FCFF growth anni 1–3 | 45% |\n| FCFF growth anno 4 | 36% |\n| FCFF growth anno 5 | 18% |\n| FCFF growth anno 6 e successivi | 7,5% |\n| WACC | 15% |\n\nTutte le cifre in $ milioni eccetto il valore per azione.\n\n**Soluzione**\n\nProiezione dei FCFF (applicando i tassi di crescita al FCFF corrente di 175):\n\n$$\\begin{aligned} \\text{FCFF}_1 &= 175 \\times 1.45 = 253.75 \\\\ \\text{FCFF}_2 &= 253.75 \\times 1.45 = 367.94 \\\\ \\text{FCFF}_3 &= 367.94 \\times 1.45 = 533.51 \\\\ \\text{FCFF}_4 &= 533.51 \\times 1.36 = 725.57 \\\\ \\text{FCFF}_5 &= 725.57 \\times 1.18 = 856.17 \\\\ \\text{FCFF}_6 &= 856.17 \\times 1.075 = 920.4 \\end{aligned}$$\n\n$$\\begin{aligned} \\text{Terminal value} &= \\frac{\\text{FCFF}_{n+1}}{(\\text{WACC} - g)} \\frac{1}{(1+\\text{WACC})^n} \\\\ &= \\frac{920.4}{(0.15 - 0.075)} \\frac{1}{(1 + 0.15)^5} = \\$6{,}101.35 \\end{aligned}$$\n\n$$\\begin{aligned} \\text{Firm value} &= \\sum_{t=1}^{n} \\frac{\\text{FCFF}_t}{(1+\\text{WACC})^t} + \\text{PV(Terminal value)} \\\\ &= 220.65 + 278.21 + 350.79 + 414.85 + 425.67 + 6{,}101.35 \\\\ &= \\$7{,}791.52 \\end{aligned}$$\n\n$$\\begin{aligned} \\text{Equity value} &= \\text{Firm value} - \\text{Debt value} \\\\ &= 7{,}791.52 - 700 = \\$7{,}091.52 \\end{aligned}$$\n\n$$\\text{Equity value per share} = \\frac{\\$7{,}091.52}{525 \\text{ shares}} = \\$13.51 \\text{ per share}$$"}, {"title": "Esempio: FCFF a due stadi", "icon": "✏️", "content": "L'azienda ha un FCFF corrente di $600,000. Sta sperimentando un tasso di crescita dell'8% atteso per tre anni, dopo i quali il tasso di crescita scenderà al 4% e rimarrà a quel livello indefinitamente. Il WACC è del 9%.\n\n**Soluzione**\n\n$$\\begin{aligned} \\text{FCFF}_1 &= 600{,}000 \\times 1.08 = 648{,}000 \\\\ \\text{FCFF}_2 &= 648{,}000 \\times 1.08 = 699{,}840 \\\\ \\text{FCFF}_3 &= 699{,}840 \\times 1.08 = 755{,}827 \\end{aligned}$$\n\n$$\\begin{aligned} \\text{Firm value} &= \\sum_{t=1}^{n} \\frac{\\text{FCFF}_t}{(1+\\text{WACC})^t} + \\frac{\\text{FCFF}_{n+1}}{(\\text{WACC} - g)} \\frac{1}{(1+\\text{WACC})^n} \\\\ &= \\frac{648{,}000}{(1+9\\%)^1} + \\frac{699{,}840}{(1+9\\%)^2} + \\frac{755{,}827}{(1+9\\%)^3} \\\\ & \\quad + \\frac{755{,}827(1+4\\%)}{(9\\% - 4\\%)} \\frac{1}{(1+9\\%)^3} \\\\ &= \\$13{,}907{,}095 \\end{aligned}$$\n\n(La pagina presenta anche un esempio analogo che applica lo stesso procedimento con l'approccio FCFE two-stage: in quel caso i flussi si attualizzano al tasso \\(r\\) e non si sottrae il debito, poiché il FCFE è già un flusso post-debito.)"}]}, "keyPoints": ["Proietta i FCFF stadio per stadio", "TV = FCFF_{n+1} / (WACC − g), poi scontalo di n anni", "Firm value − debito = equity; / azioni = per azione"], "examTips": ["Nel three-stage il TV usa il FCFF del primo anno a crescita stabile (qui l'anno 6) e si sconta di 5 anni", "Il PV del terminal value spesso è la parte più grande del valore"], "question": null}, {"id": "k", "code": "LOS 24k", "title": "Spiegare l'uso dell'analisi di sensibilità nelle valutazioni FCFF e FCFE", "commandWord": "Spiegare", "importance": "MEDIUM", "content": {"introduction": "Come per qualsiasi tecnica di valutazione, gli input determinano la qualità della valutazione prodotta dai modelli FCF. Pochi analisti sono assolutamente sicuri delle proprie assunzioni. Frequentemente usano un'**analisi di sensibilità** per determinare quanto il valore finale dell'azienda o dell'equity sia sensibile alle variazioni di ciascun input del modello di valutazione. Alcuni input hanno un impatto più significativo sull'azione rispetto ad altri, per esempio il tasso di crescita dei ricavi.\n\nLa crescita delle vendite e i margini di profitto dipendono dalla fase di crescita dell'azienda e dalla profittabilità del settore. I tassi di crescita e la durata della crescita sono difficili da prevedere.\n\nAlcune fonti di errore nei risultati di valutazione includono:\n\n• **Stimare il tasso di crescita futuro di FCFF e FCFE**: una piccola variazione del tasso di crescita produce una differenza sostanziale nel valore calcolato.\n• **Scegliere i corretti anni base (base years) per le previsioni di crescita di FCFF e FCFE**: il valore dell'azienda aumenterà/diminuirà proporzionalmente al valore iniziale di FCFF o FCFE.", "sections": []}, "keyPoints": ["Sensibilità = quanto cambia il valore per ogni input", "Crescita e anno base sono le fonti di errore principali", "La durata della crescita è difficile da prevedere"], "examTips": ["Il valore è proporzionale al FCF dell'anno base: un anno base \"anomalo\" sporca tutta la valutazione"], "question": {"q": "Which of the following is the least likely source of error in valuation results?", "options": ["The duration of growth rate.", "Estimating the future growth rate of FCFF and FCFE.", "Choosing the correct base year for the FCFF and FCFE growth forecasts."], "ans": 0, "exp": "The duration of growth rate is not a source of error in valuation. However it is difficult to forecast.\n\n**B is incorrect.** Estimating the future growth rate of FCFF and FCFE is a source of error in valuation results as a small change in growth rate results in a substantial difference in the computed value.\n\n**C is incorrect.** Choosing the correct base year for the FCFF and FCFE growth forecasts is a source of error as the firm's value will increase/decrease proportionately with the initial value of FCFF and FCFE."}}, {"id": "l", "code": "LOS 24l", "title": "Descrivere gli approcci per calcolare il terminal value in un modello multistadio", "commandWord": "Descrivere", "importance": "HIGH", "content": {"introduction": "Esistono due approcci per calcolare il terminal value:\n\n**1. Modello single-stage (a crescita costante).** Il terminal value è stimato come una perpetuità in crescita:\n\n$$\\text{Terminal value}_n = \\frac{\\text{FCFF}_{n+1}}{\\text{WACC} - g} \\quad \\text{(per il FCFF)}$$\n\n$$\\text{Terminal value}_n = \\frac{\\text{FCFE}_{n+1}}{r - g} \\quad \\text{(per il FCFE)}$$\n\n**2. Approccio dei multipli di valutazione (valuation multiples).** Può essere fatto in due modi:\n\n$$\\text{Terminal value in year } n = \\text{Justified trailing P/E} \\times \\text{Forecasted earnings in year } n$$\n\n$$\\text{Terminal value in year } n = \\text{Justified leading P/E} \\times \\text{Forecasted earnings in year } n+1$$", "sections": [{"title": "Esempio", "icon": "✏️", "content": "L'EPS di una certa azienda è stimato a $5.00 tra cinque anni. L'EPS tra sei anni è stimato a $5.90. Se il P/E trailing mediano del settore è stimato a 28, il terminal value nell'anno 5 è closest to:\n\n$$\\text{Terminal value in Year 5} = 28 \\times \\$5.00 = \\$140$$"}]}, "keyPoints": ["Gordon: flusso dell'anno n+1 / (tasso − g)", "Trailing P/E × EPS dell'anno n", "Leading P/E × EPS dell'anno n+1"], "examTips": ["Trucco: TRAILING guarda indietro (EPS_n), LEADING guarda avanti (EPS_{n+1})"], "question": null}, {"id": "m", "code": "LOS 24m", "title": "Valutare se un'azione è sopravvalutata, correttamente valutata o sottovalutata in base a un modello free cash flow", "commandWord": "Valutare", "importance": "MEDIUM", "content": {"introduction": "• Se il valore per azione dell'equity ottenuto dal modello è inferiore al prezzo dell'azione, l'azione è **sopravvalutata (overvalued)**.\n• Se il valore per azione dell'equity ottenuto dal modello è superiore al prezzo dell'azione, l'azione è **sottovalutata (undervalued)**.\n• Se il valore per azione dell'equity ottenuto dal modello è uguale al prezzo dell'azione, l'azione è **valutata equamente (fairly valued)**.", "sections": []}, "keyPoints": ["Prezzo > valore → overvalued", "Prezzo < valore → undervalued", "Prezzo = valore → fairly valued"], "examTips": ["Stessa regola del DDM: cambia solo il modello che produce il valore"], "question": {"q": "Which of the following situations most likely results in a stock being overvalued?", "options": ["When the market price is higher than the intrinsic value.", "When the market price is less than the intrinsic value.", "When the market price is equivalent to the intrinsic value."], "ans": 0, "exp": "A stock is overvalued when the market price is higher than the intrinsic value.\n\n**B is incorrect.** When a stock's market price is lower than its intrinsic value, the stock is considered undervalued.\n\n**C is incorrect.** When the market price is equivalent to the intrinsic value, the stock is considered fairly valued."}}]}, {"id": "ev-r25", "number": 25, "title": "Market-Based Valuation: Price and Enterprise Value Multiples", "estimatedTime": "5-6 ore", "totalLOS": 18, "los": [{"id": "a", "code": "LOS 25a", "title": "Distinguere tra method of comparables e metodo basato sui fondamentali previsti, e spiegare il razionale economico di ciascuno", "commandWord": "Distinguere", "importance": "HIGH", "content": {"introduction": "Ci sono due metodi per usare i multipli di prezzo e di enterprise value:\n\n• Il **method of comparables** (metodo dei comparabili).\n• Il metodo basato sui **fondamentali previsti** (forecasted fundamentals).", "sections": [{"title": "Il method of comparables", "icon": "🔗", "content": "Il method of comparables è la valutazione di un'attività basata sui multipli di un'attività simile (comparabili o guideline assets).\n\nMoltiplicando un valore benchmark del multiplo prezzo/utili (P/E) per una stima dell'utile per azione di un'azienda si ottiene una stima rapida del valore dell'azione, che può essere confrontata con il prezzo di mercato dell'azione.\n\nInoltre, confrontare l'effettivo multiplo di prezzo di un'azione con un multiplo benchmark rilevante dovrebbe portare alla stessa conclusione sulla valutazione relativa dell'azione.\n\nIl razionale economico alla base del method of comparables è la **legge del prezzo unico (law of one price)**, ossia il principio economico secondo cui due attività identiche dovrebbero avere un prezzo simile."}, {"title": "Il metodo basato sui fondamentali previsti", "icon": "📐", "content": "Questo metodo si riferisce all'uso di multipli derivati da fondamentali previsti, anziché dal confronto con altre aziende. I **fondamentali** sono caratteristiche di un'azienda legate alla profittabilità, alla crescita o alla solidità finanziaria.\n\nIl **justified price multiple** (multiplo di prezzo giustificato) è il valore equo stimato del multiplo, che può essere giustificato in base al metodo dei fondamentali previsti o al method of comparables.\n\nIl razionale economico alla base del metodo dei fondamentali previsti è che il valore al numeratore usato nel justified price multiple è derivato dal modello DCF."}]}, "keyPoints": ["Comparables → multipli di attività simili", "Razionale comparables → law of one price", "Fondamentali → multipli ricavati da profittabilità, crescita, solidità", "Razionale fondamentali → modello DCF"], "examTips": ["Trucco: COMPARABILI = confronto orizzontale (law of one price); FONDAMENTALI = DCF \"travestito\" da multiplo"], "question": {"q": "The economic rationale underlying the method of comparables is most likely:", "options": ["The law of one price.", "The characteristics of a business related to profitability, growth, or financial strength.", "The justified P/E is higher than the actual P/E."], "ans": 0, "exp": "The law of one price is the economic rationale underlying the method of comparables that states that two identical assets should sell at the same price.\n\n**B is incorrect.** The characteristics of a business related to profitability, growth, or financial strength are called fundamentals.\n\n**C is incorrect.** The justified P/E being higher than the actual P/E indicates that the stock may be undervalued."}}, {"id": "b", "code": "LOS 25b", "title": "Calcolare e interpretare un justified price multiple", "commandWord": "Calcolare", "importance": "HIGH", "content": {"introduction": "Un **justified price multiple** stima il valore equo di un multiplo di prezzo, giustificabile in base al metodo dei fondamentali previsti o al method of comparables. È il valore che il multiplo assumerebbe se l'azione fosse scambiata al suo valore equo.\n\n**Regola di interpretazione:**\n\n• Se il justified price multiple è **superiore** al multiplo di prezzo corrente, l'azione è **sottovalutata**.\n• Se il justified price multiple è **inferiore** al multiplo di prezzo corrente, l'azione è **sopravvalutata**.", "sections": [{"title": "Esempio (method of comparables)", "icon": "✏️", "content": "L'azione di una certa azienda è attualmente scambiata a $50. L'EPS dell'azienda alla fine dell'anno scorso era $5. Il P/E trailing medio delle aziende comparabili è 20. L'azione è sottovalutata, valutata equamente o sopravvalutata?\n\n$$\\text{Trailing P/E} = \\frac{50}{5} = 10$$\n\nPoiché il P/E trailing effettivo dell'azienda, pari a 10, è inferiore al P/E trailing medio dei comparabili (20), l'azione è relativamente sottovalutata."}, {"title": "Esempio (fondamentali previsti, tramite Gordon growth model)", "icon": "✏️", "content": "Si supponga: prezzo $30, EPS $5, payout ratio 25%, \\(r = 10\\%\\), \\(g = 4\\%\\). Determinare il P/E leading dell'azione basato sul suo valore fondamentale.\n\n$$\\text{P/E effettivo} = \\frac{30}{5} = 6$$\n\n$$\\text{Dividendo atteso del prossimo anno} = 5 \\times 0.25 = 1.25$$\n\n$$\\text{Valore intrinseco} = \\frac{D_1}{(r-g)} = \\frac{1.25}{(0.10 - 0.04)} = \\$20.83$$\n\n$$\\text{Leading P/E} = \\frac{20.83}{5} = 4.17$$\n\nIl P/E effettivo dell'azione (6) è superiore al P/E basato sui fondamentali (4.17): l'azione è quindi sopravvalutata."}]}, "keyPoints": ["Justified multiple = multiplo al valore equo", "Justified > effettivo → sottovalutata", "Justified < effettivo → sopravvalutata"], "examTips": ["Trucco: il \"justified\" è quanto DOVREBBE valere il multiplo; se il mercato paga meno, è un affare"], "question": null}, {"id": "c", "code": "LOS 25c", "title": "Descrivere il razionale e i possibili svantaggi dei multipli di prezzo alternativi e del dividend yield", "commandWord": "Descrivere", "importance": "HIGH", "content": {"introduction": "", "sections": [{"title": "Prezzo/utili (P/E)", "icon": "💰", "content": "• **Razionale**: il potere di generare utili (earning power) è un driver primario del valore di un investimento, e l'EPS è probabilmente il principale oggetto di attenzione degli analisti.\n• **Svantaggi**: l'EPS è spesso soggetto a distorsioni, frequentemente volatile e talvolta negativo (rendendo il P/E privo di significato).\n\nLe due definizioni alternative sono il **trailing P/E** (basato sugli ultimi quattro trimestri di EPS) e il **forward/leading P/E** (basato sugli utili attesi del prossimo anno)."}, {"title": "Prezzo/valore contabile (P/B)", "icon": "📚", "content": "• **Razionale**: il valore contabile è solitamente positivo anche quando l'EPS è negativo, ed è più stabile dell'EPS; è particolarmente appropriato per le istituzioni finanziarie e per aziende che potrebbero cessare l'attività.\n• **Aggiustamenti/svantaggi**: occorre spesso usare il valore contabile tangibile, sottraendo le attività immateriali come l'avviamento (goodwill) dal patrimonio netto dei soci ordinari; per aziende che usano metodi di valutazione delle scorte diversi (FIFO o LIFO) vanno fatti aggiustamenti per renderle confrontabili; vanno inoltre apportati aggiustamenti per attività e passività fuori bilancio significative (es. una garanzia a pagare un debito in caso di default)."}, {"title": "Prezzo/vendite (P/S)", "icon": "🛍️", "content": "• **Razionale**: le vendite, essendo la prima riga del conto economico, sono generalmente meno soggette a distorsioni o manipolazioni rispetto ad altri fondamentali come EPS o valore contabile; sono positive anche quando l'EPS può essere negativo; sono più stabili perché non riflettono l'effetto della leva operativa e finanziaria; la ricerca mostra che le differenze nei multipli P/S sono legate a differenze nei rendimenti medi di lungo periodo. I multipli P/S sono appropriati per valutare aziende mature, cicliche e in perdita.\n• **Svantaggi**: un'azienda può avere un'elevata crescita delle vendite mentre i suoi profitti operativi sono negativi (per continuare a operare un'azienda deve generare utili); il P/S non tiene conto delle differenze nella struttura dei costi tra le aziende; pratiche diverse di riconoscimento dei ricavi possono distorcere il P/S."}, {"title": "Prezzo/flusso di cassa (P/CF)", "icon": "💧", "content": "• **Razionale**: gli utili sono più soggetti a manipolazione del flusso di cassa; il flusso di cassa è più stabile degli utili ed è quindi più stabile del P/E; usare il prezzo/flusso di cassa affronta le differenze nella qualità degli utili; la ricerca mostra che le differenze nei rapporti P/CF sono legate a differenze nei rendimenti medi di lungo periodo.\n• **Svantaggi**: gli elementi che incidono sull'effettivo flusso di cassa operativo (come i ricavi non monetari) vengono trascurati quando si usa la definizione \"EPS + oneri non monetari\"; il FCFE è più adatto a valutare un'azienda rispetto al flusso di cassa operativo, ma è più volatile; il flusso di cassa operativo può essere manipolato (es. cartolarizzando i crediti per accelerare gli incassi o esternalizzando i debiti per rallentare i pagamenti).\n• Esistono quattro definizioni principali di flusso di cassa utilizzabili per calcolare il P/CF: utile netto più oneri non monetari (come ammortamenti); flusso di cassa operativo (CFO); free cash flow to equity (FCFE); EBITDA."}, {"title": "Dividend yield", "icon": "💵", "content": "• **Razionale**: il dividend yield è una componente del rendimento totale, ed è una componente meno rischiosa rispetto all'apprezzamento del capitale.\n• **Svantaggi**: è solo una delle componenti del rendimento (usare il dividend yield ignora le altre componenti del rendimento); un dividend yield più alto implica un tasso di crescita degli utili più basso in prospettiva."}]}, "keyPoints": ["P/E: earning power, ma EPS volatile e a volte negativo", "P/B: stabile e positivo, ottimo per banche; rettifiche per intangibili, FIFO/LIFO, fuori bilancio", "P/S: difficile da manipolare, adatto a cicliche e aziende in perdita; ignora i costi", "P/CF: più stabile del P/E; quattro definizioni di cash flow", "Dividend yield: parte meno rischiosa del rendimento; yield alto = crescita bassa"], "examTips": ["Trucco: azienda in PERDITA → P/B o P/S, mai P/E", "Forward P/E = utili dei prossimi 4 trimestri / 12 mesi / prossimo esercizio"], "question": {"q": "Which of the following would most likely be used as the earnings component of the forward P/E ratio?", "options": ["Non-recurring earnings.", "The following four quarters earnings.", "Diluted EPS."], "ans": 1, "exp": "The next four quarters, the next 12 months' earnings, and the following fiscal year earnings can be used as the earnings component of the forward P/E ratio.\n\n**A is incorrect.** The non-recurring component of earnings is a part of earnings that are not expected to persist into the future.\n\n**C is incorrect.** Diluted EPS is an item that should be considered when calculating trailing EPS."}}, {"id": "d", "code": "LOS 25d", "title": "Calcolare e interpretare i multipli di prezzo alternativi e il dividend yield", "commandWord": "Calcolare", "importance": "HIGH", "content": {"introduction": "", "sections": [{"title": "Prezzo/valore contabile (P/B)", "icon": "📚", "content": "$$\\text{P/B ratio} = \\frac{\\text{Market price per share}}{\\text{Book value per share}}$$\n\nUn P/B di 1,88 significa che un investitore paga 1,88 volte il valore contabile per un'azione. Se un'azienda comparabile è scambiata a un P/B più basso, allora il comparabile è relativamente sottovalutato (assumendo che l'azienda con P/B 1,88 sia valutata correttamente)."}, {"title": "Prezzo/vendite (P/S)", "icon": "🛍️", "content": "$$\\text{P/S ratio} = \\frac{\\text{Market price per share}}{\\text{Annual net sales per share}}$$\n\n$$\\text{Annual net sales} = \\text{Total sales} - (\\text{Returns} + \\text{Customer discounts})$$\n\nUn analista dovrebbe valutare le pratiche di riconoscimento dei ricavi di un'azienda prima di affidarsi al multiplo P/S.\n\n**Esempio:** con vendite nette totali di $1,200,000 e 100,000 azioni, e prezzo $15:\n\n$$\\text{Annual net sales per share} = \\frac{\\$1{,}200{,}000}{100{,}000} = 12$$\n\n$$\\text{P/S ratio} = \\frac{15}{12} = 1.25$$\n\nPoiché il multiplo P/S benchmark (6,5) è superiore al P/S del soggetto (1,25), l'azione appare relativamente sottovalutata."}, {"title": "Prezzo/flusso di cassa (P/CF)", "icon": "💧", "content": "$$\\text{P/CF} = \\frac{\\text{Market price per share}}{\\text{Free cash flow per share}}$$\n\n$$\\text{Free cash flow per share} = \\frac{\\$600{,}000}{100{,}000} = \\$6.00$$\n\n$$\\text{P/CF} = \\frac{\\$15}{\\$6} = 2.5$$\n\nConfrontando i rapporti P/CF di aziende diverse, l'azienda con il P/CF più basso è relativamente sottovalutata."}, {"title": "Dividend yield", "icon": "💵", "content": "Il dividend yield si calcola come dividendo per azione diviso il prezzo dell'azione:\n\n$$\\text{Trailing dividend yield} = \\frac{\\text{Most recent yearly dividend}}{\\text{Current market share price}}$$\n\n$$\\text{Leading dividend yield} = \\frac{\\text{Next year's forecasted dividend}}{\\text{Current market price}}$$\n\n**Esempio:** con dividendi trimestrali dell'ultimo anno di 0,52 + 0,55 + 0,56 + 0,56, dividendo previsto del prossimo anno $2,28 e prezzo $29:\n\n$$\\text{Trailing dividend yield} = \\frac{(0.52 + 0.55 + 0.56 + 0.56)}{29} = 0.07552 \\approx 7.55\\%$$\n\n$$\\text{Leading dividend yield} = \\frac{2.28}{29} = 0.0786 \\approx 7.86\\%$$"}, {"title": "Forward P/E (esempio)", "icon": "⏩", "content": "Con prezzo $28,00 e stime di EPS dei prossimi quattro trimestri pari a 0,30 + 0,37 + 0,43 + 0,48:\n\n$$\\text{Forward P/E ratio} = \\frac{28.00}{(0.30 + 0.37 + 0.43 + 0.48)} = 17.72$$"}]}, "keyPoints": ["P/B = prezzo / BVPS", "P/S = prezzo / vendite nette per azione", "P/CF = prezzo / cash flow per azione", "Trailing yield = dividendi ultimi 4 trimestri / prezzo", "Multiplo più basso del benchmark → relativamente sottovalutata"], "examTips": ["Per il trailing dividend yield SOMMA i quattro dividendi trimestrali (non moltiplicare l'ultimo per 4)"], "question": null}, {"id": "e", "code": "LOS 25e", "title": "Calcolare e interpretare underlying earnings, spiegare la normalizzazione dell'EPS e calcolare l'EPS normalizzato", "commandWord": "Calcolare", "importance": "HIGH", "content": {"introduction": "", "sections": [{"title": "EPS di base vs EPS diluito", "icon": "⚖️", "content": "Le aziende sono tenute a comunicare sia l'**EPS di base** (basic) sia l'**EPS diluito** (diluted). L'EPS di base è il totale degli utili diviso il numero medio ponderato di azioni in circolazione nel periodo. L'EPS diluito riflette l'effetto sull'EPS dell'esercizio di stock option, warrant e obbligazioni convertibili. L'EPS diluito è preferito a quello di base quando si confrontano aziende."}, {"title": "Underlying earnings (utili sottostanti)", "icon": "🔎", "content": "Gli elementi che non ci si aspetta si ripetano in futuro vengono rimossi dagli utili, ottenendo gli **underlying earnings** (detti anche utili persistenti, continuativi o core). Le aziende possono comunicare questi utili rettificati; tuttavia, tale dato potrebbe non essere comparabile tra aziende a causa delle diverse basi di calcolo, quindi gli analisti dovrebbero esaminarne il calcolo. L'obiettivo è calcolare utili persistenti, continuativi e core. Il P/E usato nella valutazione dovrebbe essere calcolato in modo coerente tra tutte le azioni in esame.\n\nGli underlying earnings escludono componenti non ricorrenti come: plusvalenze/minusvalenze su cessioni di attività, svalutazioni di attività deteriorate, accantonamenti per perdite, ristrutturazioni aziendali, dismissioni di segmenti di business, perdite straordinarie da riacquisto del debito prima della scadenza e variazioni nelle stime contabili."}, {"title": "Esempio: underlying earnings", "icon": "✏️", "content": "EPS 2009 = $8,00; plusvalenza su cessione di attività = $1,40; plusvalenza da variazione di stima contabile = $0,75.\n\n$$\\text{Underlying earnings} = \\$8.00 - \\$1.40 - \\$0.75 = \\$5.85$$"}, {"title": "EPS normalizzato", "icon": "🎚️", "content": "A causa degli effetti ciclici, gli ultimi quattro trimestri di utili potrebbero non riflettere accuratamente il potere di generare utili medio o di lungo periodo dell'azienda. Gli analisti affrontano il problema della ciclicità **normalizzando l'EPS**, ossia calcolando il livello di EPS che l'azienda potrebbe conseguire attualmente in condizioni di metà ciclo (mid-cyclical). I due metodi sono:\n\n1. **Metodo dell'EPS storico medio (historical average EPS)**: l'EPS normalizzato è la media dell'EPS su un periodo recente, di norma l'ultimo ciclo economico completo. Questo metodo ignora gli effetti dimensionali (size effects).\n2. **Metodo del ROE medio (average ROE)**: l'EPS normalizzato è il ROE medio moltiplicato per il valore contabile per azione (BVPS) corrente. Anche qui il ROE medio è misurato sull'ultimo ciclo economico. Poiché si basa sul BVPS, riflette più accuratamente le variazioni di dimensione dell'azienda; per questo è preferito rispetto al metodo dell'EPS storico medio."}, {"title": "Esempio: EPS normalizzato", "icon": "✏️", "content": "Dati: ROE degli ultimi 4 anni = 15%, 15%, 21%, 16%; EPS degli ultimi 4 anni = $4,00, $3,80, $5,25, $4,50; BVPS corrente = $28,00.\n\n**Metodo del ROE medio:**\n\n$$\\text{ROE medio} = \\frac{0.15 + 0.15 + 0.21 + 0.16}{4} = 0.1675$$\n\n$$\\text{EPS normalizzato} = 0.1675 \\times \\$28.00 = \\$4.69$$\n\n**Metodo dell'EPS storico medio:**\n\n$$\\text{EPS normalizzato} = \\frac{4.00 + 3.80 + 5.25 + 4.50}{4} = \\$4.39$$"}]}, "keyPoints": ["Per confrontare aziende: EPS diluito", "Underlying = EPS meno voci non ricorrenti", "Normalizzato = EPS a metà ciclo", "Metodo ROE medio × BVPS corrente è preferito (tiene conto della dimensione)"], "examTips": ["Trucco: l'EPS storico medio \"dimentica\" che l'azienda è cresciuta; il ROE medio × BVPS di oggi no", "Plusvalenze non ricorrenti si SOTTRAGGONO, minusvalenze non ricorrenti si AGGIUNGONO"], "question": null}, {"id": "f", "code": "LOS 25f", "title": "Spiegare e giustificare l'uso dell'earnings yield (E/P)", "commandWord": "Spiegare", "importance": "MEDIUM", "content": {"introduction": "L'**earnings yield (E/P)** è il reciproco del rapporto P/E:\n\n$$\\text{Earnings yield} = \\frac{E}{P} = \\frac{\\text{EPS}}{\\text{Prezzo per azione}}$$\n\nIl razionale per usare l'E/P al posto del P/E sta nel trattamento degli utili nulli o negativi: quando l'EPS è zero o negativo, il P/E non è significativo (un P/E negativo o estremamente elevato non è ordinabile in modo sensato), mentre l'earnings yield può comunque essere calcolato e usato per ordinare (rank) le azioni.\n\nNell'ordinamento, un earnings yield più alto indica un'azione relativamente più conveniente (più utili per unità di prezzo): l'azione più sottovalutata è quella con l'E/P più alto. L'E/P può basarsi su utili trailing o leading, e gli analisti possono usare l'EPS normalizzato al numeratore.", "sections": []}, "keyPoints": ["E/P = 1 / (P/E)", "Funziona anche con utili zero o negativi", "E/P più alto = azione più conveniente"], "examTips": ["Trucco: ordinando per E/P il \"migliore\" è in cima (valore più alto); col P/E sarebbe il più basso"], "question": null}, {"id": "g", "code": "LOS 25g", "title": "Identificare e interpretare i fondamentali che influenzano i multipli di prezzo e il dividend yield", "commandWord": "Identificare", "importance": "HIGH", "content": {"introduction": "", "sections": [{"title": "P/E", "icon": "💰", "content": "Il P/E trailing giustificato può essere ricavato dal Gordon growth model:\n\n$$\\frac{P_0}{E_0} = \\frac{D_0(1+g)/E_0}{r-g} = \\frac{(1-b)(1+g)}{r-g}$$\n\nIl P/E è **inversamente** correlato al tasso di rendimento richiesto dell'azione (\\(r\\)), a parità di altre condizioni, e **positivamente** correlato al tasso di crescita dei flussi di cassa attesi, a parità di altre condizioni."}, {"title": "P/B", "icon": "📚", "content": "I fondamentali di un'azienda possono essere usati per stimare il P/B giustificato:\n\n$$\\frac{P_0}{B_0} = \\frac{\\text{ROE} \\times \\left(1 - \\frac{g}{\\text{ROE}}\\right)}{r-g} = \\frac{\\text{ROE} - g}{r-g}$$\n\nConfrontando azioni con lo stesso P/B, quella con il ROE più alto è relativamente sottovalutata. Più grande è il ROE rispetto a \\(r\\), più alto è il P/B giustificato basato sui fondamentali: ciò ha senso perché maggiore è la differenza tra il ROE e il rendimento richiesto sull'equity (\\(r\\)), maggiore è il valore creato dall'azienda per i suoi azionisti."}, {"title": "Dividend yield", "icon": "💵", "content": "I driver fondamentali del dividend yield sono il tasso di crescita atteso dei dividendi e il tasso di rendimento richiesto. Dal Gordon growth model, poiché \\(P_0 = \\frac{D_0(1+g)}{r-g}\\), il dividend yield basato sui fondamentali è:\n\n$$\\frac{D_0}{P_0} = \\frac{r-g}{1+g}$$\n\nUn \\(r\\) più alto aumenta il dividend yield, mentre un \\(g\\) più alto lo riduce."}]}, "keyPoints": ["P/E ↑ se g ↑, ↓ se r ↑", "P/B = (ROE − g)/(r − g): ↑ se ROE − r ↑", "Dividend yield = (r − g)/(1 + g): ↑ con r, ↓ con g"], "examTips": ["Trucco: ROE = r → P/B giustificato = 1 (nessun valore creato)"], "question": {"q": "Which of the following would most likely result in a higher justified P/B ratio?", "options": ["A higher r relative to ROE.", "A higher ROE relative to r.", "An ROE that is equal to r."], "ans": 1, "exp": "A higher ROE relative to r would result in a higher justified P/B ratio. The greater the difference between the ROE and the required return on equity, the more the value created for its shareholders.\n\n**A is incorrect.** A higher r relative to ROE is an indication that the company is not creating any value for its shareholders and therefore justified P/B is expected to reduce.\n\n**C is incorrect.** An ROE equal to r indicates the firm is not creating or destroying value, and therefore justified P/B should remain constant."}}, {"id": "h", "code": "LOS 25h", "title": "Calcolare e interpretare i P/E, P/B e P/S giustificati basati sui fondamentali previsti", "commandWord": "Calcolare", "importance": "VERY HIGH", "content": {"introduction": "", "sections": [{"title": "P/E leading giustificato basato sui fondamentali", "icon": "📐", "content": "$$\\text{Justified leading } \\frac{P_0}{E_1} = \\frac{D_1/E_1}{r-g} = \\frac{1-b}{r-g}$$\n\nDove \\(1-b\\) = payout ratio.\n\n$$\\frac{P_0}{E_0} = \\frac{D_0(1+g)/E_0}{r-g} = \\frac{(1-b)(1+g)}{r-g} = \\left(\\frac{1-b}{r-g}\\right)(1+g)$$\n\n$$\\text{Justified trailing } \\frac{P}{E} = \\text{Justified leading } \\frac{P}{E} \\times (1+g)$$\n\n• Se ci si attende che gli utili crescano di \\(g\\), gli utili del prossimo anno saranno superiori a quelli dell'anno scorso del tasso di crescita, e il P/E trailing giustificato sarà superiore al P/E leading giustificato di un fattore \\((1+g)\\).\n• Un P/E giustificato più alto indica una sopravvalutazione relativa."}, {"title": "Esempio: P/E giustificato basato sui fondamentali", "icon": "✏️", "content": "Dati: retention ratio = 40%; tasso di rendimento richiesto = 10%; tasso di crescita dei dividendi = 3%.\n\n$$\\text{Justified trailing P/E} = \\frac{(1-b)(1+g)}{r-g} = \\frac{(1 - 40\\%)(1.03)}{0.10 - 0.03} = 8.83$$\n\n$$\\text{Justified leading P/E} = \\frac{1 - 0.40}{0.10 - 0.03} = 8.57$$"}, {"title": "P/B giustificato basato sui fondamentali", "icon": "📐", "content": "$$\\frac{P_0}{B_0} = \\frac{\\text{ROE} - g}{r-g}$$\n\nDove ROE = return on equity, \\(r\\) = rendimento richiesto sull'equity, \\(g\\) = tasso di crescita sostenibile."}, {"title": "Esempio: P/B giustificato basato sui fondamentali", "icon": "✏️", "content": "Dati ABC Ltd: ROE = 16%; tasso di rendimento richiesto = 12%; tasso di crescita atteso = 10%.\n\n$$\\frac{P_0}{B_0} = \\frac{\\text{ROE} - g}{r-g} = \\frac{0.16 - 0.10}{0.12 - 0.10} = 3$$\n\nA parità di altre condizioni, il P/B è positivamente correlato al ROE. Più ampio è lo spread tra ROE e \\(r\\), più alto è il P/B. Un P/B giustificato più alto indica una sopravvalutazione relativa."}, {"title": "P/S giustificato basato sui fondamentali", "icon": "📐", "content": "$$\\text{Justified P/S} = \\frac{(E_0/S_0)(1-b)(1+g)}{r-g}$$\n\nDove \\(E_0/S_0\\) = margine di profitto netto, \\(1-b\\) = payout ratio. Il P/S aumenta con un aumento del margine di profitto e con un aumento del tasso di crescita degli utili."}, {"title": "Esempio: P/S giustificato basato sui fondamentali", "icon": "✏️", "content": "| Voce | Valore |\n|---|---|\n| Dividend payout ratio | 30% |\n| ROE | 12% |\n| EPS | $6 |\n| Sales per share | $328 |\n| Tasso di crescita atteso (dividendi e utili) | 7,50% |\n| Tasso di rendimento richiesto | 15% |\n\n$$\\text{Justified P/S} = \\frac{(E_0/S_0)(1-b)(1+g)}{r-g} = \\frac{\\left(\\frac{6}{328}\\right)(0.30)(1.075)}{0.15 - 0.075} = 0.0786$$\n\nUn P/S giustificato basso può indicare che l'azione è sottovalutata, mentre un rapporto significativamente sopra la media può suggerire sopravvalutazione."}]}, "keyPoints": ["Leading P/E = payout / (r − g)", "Trailing P/E = payout × (1 + g) / (r − g)", "P/B = (ROE − g) / (r − g)", "P/S = margine × payout × (1 + g) / (r − g)", "Giustificato > effettivo → sottovalutata"], "examTips": ["Il P/S giustificato è il P/E trailing giustificato moltiplicato per il margine netto E0/S0", "Nel P/B la crescita g è quella sostenibile (b × ROE)"], "question": {"q": "Consider the following information:\n\n• Earnings growth ratio = 12%\n• Required rate of return = 13%\n• Long term profit margin = 6.5%\n• Dividend payout ratio = 30%\n\nThe justified P/S ratio is closest to:", "options": ["2.184.", "2.451.", "2.662."], "ans": 0, "exp": "$$\\begin{aligned} \\text{Justified P/S} &= \\frac{(E_0/S_0)(1-b)(1+g)}{r-g} \\\\ &= \\frac{(0.065)(0.30)(1.12)}{0.13 - 0.12} = 2.184 \\end{aligned}$$"}}, {"id": "i", "code": "LOS 25i", "title": "Calcolare e interpretare un P/E predetto da una regressione cross-sectional sui fondamentali e spiegarne i limiti", "commandWord": "Calcolare", "importance": "MEDIUM", "content": {"introduction": "Un **P/E predetto (predicted P/E)** è stimato dalle regressioni cross-sectional del P/E sui fondamentali considerati determinanti del valore d'investimento, per esempio il tasso di crescita degli utili e il payout ratio.\n\nSi consideri un'azienda con beta 0,8, payout ratio 0,40 e tasso di crescita degli utili 0,09. La regressione stimata per un gruppo di azioni dello stesso settore è:\n\n$$\\text{Predicted P/E} = 11.12 + (2.15 \\times \\text{DPR}) - (0.15 \\times \\text{Beta}) + (12.43 \\times \\text{EGR})$$\n\ndove DPR è il dividend payout ratio ed EGR è il tasso di crescita degli utili a cinque anni. In base a questa regressione, il P/E predetto dell'azienda è:\n\n$$\\text{Predicted P/E} = 11.12 + (2.15 \\times 0.40) - (0.15 \\times 0.8) + (12.43 \\times 0.09) = 12.979$$", "sections": [{"title": "Limiti della metodologia di regressione cross-sectional", "icon": "📉", "content": "• La relazione tra i fondamentali dell'azienda e il P/E cambia nel tempo, riducendo il potere predittivo del modello.\n• Tali regressioni tendono a soffrire di multicollinearità, rendendo difficile interpretare i singoli coefficienti di regressione.\n• I risultati sono specifici del campione di azioni e del periodo considerato, e potrebbero non valere al di fuori di esso."}]}, "keyPoints": ["P/E predetto = valore stimato dalla regressione sui fondamentali", "Basta sostituire i valori nella regressione", "Limiti: instabilità nel tempo, multicollinearità, specificità del campione"], "examTips": ["Attento ai segni dei coefficienti (qui il beta ha segno negativo)"], "question": {"q": "A company has a beta of 0.6, a dividend payout ratio of 0.30, and an earnings growth rate of 0.07. The predicted P/E is closest to:", "options": ["12.62.", "14.50.", "16.32."], "ans": 0, "exp": "$$\\begin{aligned} \\text{Predicted P/E} &= 11.12 + (2.15 \\times \\text{DPR}) - (0.15 \\times \\text{Beta}) + (12.43 \\times \\text{EGR}) \\\\ &= 11.12 + (2.15 \\times 0.30) - (0.15 \\times 0.6) + (12.43 \\times 0.07) \\\\ &= 12.62 \\end{aligned}$$"}}, {"id": "j", "code": "LOS 25j", "title": "Valutare un'azione con il method of comparables e spiegare l'importanza dei fondamentali", "commandWord": "Valutare", "importance": "HIGH", "content": {"introduction": "I passi per la valutazione basata sui comparabili sono:\n\n1. Selezionare e calcolare il multiplo di prezzo.\n2. Selezionare il benchmark e calcolarne il multiplo di prezzo.\n3. Stimare il valore dell'azione dell'azienda usando il multiplo benchmark.\n4. Verificare se le differenze tra il multiplo dell'azione e quello del benchmark sono spiegate dai determinanti sottostanti del multiplo. In caso contrario, l'attività potrebbe essere mal prezzata: controllare i fondamentali!\n\n**Possibili benchmark del multiplo:** il P/E medio o mediano del gruppo di aziende comparabili (peer group) in un settore; la media dei P/E passati dell'azione rispetto al peer group; il valore medio passato del P/E per l'azione; il P/E di un indice azionario rappresentativo.\n\n• Se il prezzo dell'azione è superiore al prezzo basato sul multiplo benchmark, l'azione è relativamente **sopravvalutata**.\n• Se il prezzo dell'azione è inferiore al prezzo basato sul multiplo benchmark, l'azione è relativamente **sottovalutata**.", "sections": [{"title": "Importanza dei fondamentali", "icon": "🧱", "content": "L'azione A ha un P/E inferiore alla mediana del peer group pur avendo un tasso di crescita e un beta comparabili: è sottovalutata rispetto al benchmark. L'azione B ha un P/E più alto nonostante una crescita attesa inferiore e un beta più elevato: è sopravvalutata rispetto al benchmark."}]}, "keyPoints": ["Quattro passi: multiplo, benchmark, valore, controllo fondamentali", "Benchmark = media/mediana peer, storico dell'azione, indice", "P/E basso con fondamentali uguali → sottovalutata"], "examTips": ["Più crescita e meno rischio giustificano un P/E più alto; il contrario no"], "question": {"q": "Which of the following can least likely be used as a benchmark multiple in a valuation based on multiples?", "options": ["The average past value of the P/Es for the stock.", "The P/E ratio for a representative equity index.", "A group of assets."], "ans": 2, "exp": "A group of assets by itself could not be used as a benchmark multiple. However, the mean or median of a group of assets could be used as a benchmark multiple.\n\n**A is incorrect.** The average past value of the P/Es of the stock could be used as a benchmark multiple.\n\n**B is incorrect.** The P/E ratio for a representative equity index could be used as a benchmark multiple."}}, {"id": "k", "code": "LOS 25k", "title": "Calcolare e interpretare il rapporto P/E-to-growth (PEG) e spiegarne l'uso", "commandWord": "Calcolare", "importance": "MEDIUM", "content": {"introduction": "Il **rapporto PEG** considera l'impatto della crescita degli utili sul P/E. Si calcola come il P/E diviso il tasso di crescita atteso degli utili (espresso in percentuale):\n\n$$\\text{PEG} = \\frac{\\text{P/E}}{\\text{Tasso di crescita atteso degli utili (\\%)}}$$\n\nLe azioni con PEG più basso sono più attraenti di quelle con PEG più alto. Un PEG inferiore a uno è generalmente considerato un livello d'investimento interessante.\n\n**Limiti del PEG:**\n\n• Assume una relazione lineare tra P/E e crescita.\n• Non tiene conto delle differenze di rischio.\n• Non tiene conto delle differenze nella durata della crescita.", "sections": [{"title": "Esempio", "icon": "✏️", "content": "Un'azienda con un forward P/E di 9,21 e una previsione di crescita dell'EPS a 5 anni del 12% avrebbe un PEG di:\n\n$$\\text{PEG} = \\frac{9.21}{12} = 0.76$$"}]}, "keyPoints": ["PEG = P/E / crescita in punti percentuali", "PEG < 1 = interessante", "Ignora rischio e durata della crescita, assume linearità"], "examTips": ["La crescita si inserisce come NUMERO (12, non 0.12)"], "question": {"q": "Consider a company with a forward P/E ratio of 8.20 and a 5-year EPS growth forecast of 13%. The PEG would be closest to:", "options": ["0.55.", "0.63.", "0.71."], "ans": 1, "exp": "$$\\text{PEG} = \\frac{8.20}{13} = 0.63$$"}}, {"id": "l", "code": "LOS 25l", "title": "Calcolare e spiegare l'uso dei multipli di prezzo per determinare il terminal value in un DCF multistadio", "commandWord": "Calcolare", "importance": "MEDIUM", "content": {"introduction": "Il terminal value in un modello DCF multistadio può essere determinato con due approcci: il modello a crescita costante (Gordon growth model) oppure l'approccio dei multipli (un multiplo giustificato o di comparabili moltiplicato per la stima di un fondamentale).\n\nUn vantaggio dell'approccio dei multipli è che è ancorato ai dati di mercato, a differenza del Gordon growth model che si basa su molte stime ed è molto sensibile a variazioni di tali stime. Uno svantaggio è che, se il valore benchmark è mal prezzato, anche la stima del terminal value rifletterà tale errore di prezzo.", "sections": [{"title": "Esempio", "icon": "✏️", "content": "Valori del peer group: payout ratio medio 0,35; ROE medio 6%; P/E mediano 8. Si assumano \\(\\text{EPS}_5 = 1.4\\) e \\(r = 10\\%\\).\n\n**Usando il Gordon growth model:**\n\n$$\\begin{aligned} D_5 &= \\text{EPS}_5 \\times \\text{Dividend payout ratio} = 1.4 \\times 0.35 = 0.49 \\\\ \\text{Retention ratio} &= 1 - 0.35 = 0.65 \\\\ g &= \\text{Retention ratio} \\times \\text{ROE} = 0.65 \\times 6\\% = 3.9\\% \\\\ V_5 &= \\frac{D_5(1+g)}{r-g} = \\frac{0.49(1.039)}{0.10 - 0.039} = 8.35 \\end{aligned}$$\n\n**Usando i comparabili (multipli):**\n\n$$V_5 = \\text{P/E} \\times \\text{EPS}_5 = 8 \\times 1.4 = 11.20$$"}]}, "keyPoints": ["TV = multiplo × fondamentale stimato", "Pro: ancorato al mercato", "Contro: eredita l'eventuale mispricing del benchmark"], "examTips": ["Gordon e multipli possono dare TV molto diversi: è normale, dipende dalle ipotesi"], "question": null}, {"id": "m", "code": "LOS 25m", "title": "Spiegare le definizioni alternative di cash flow usate nei multipli e i loro limiti", "commandWord": "Spiegare", "importance": "MEDIUM", "content": {"introduction": "Esistono vari proxy per il flusso di cassa utilizzabili nel calcolo dei multipli di cash flow.", "sections": [{"title": "EPS Plus Non-Cash Charges", "icon": "➕", "content": "Si calcola come:\n\n$$\\text{EPS Plus Non-Cash Charges} = \\text{EPS} + \\text{Depreciation} + \\text{Amortization} + \\text{Depletion}$$\n\nUn limite di questo proxy è che ignora i ricavi non monetari e le variazioni del capitale circolante (working capital)."}, {"title": "Cash Flow from Operations (CFO)", "icon": "🔄", "content": "Deriva dal rendiconto finanziario e rappresenta l'ammontare di cassa che un'azienda genera dallo svolgimento delle proprie attività operative in un periodo di tempo. Si calcola come:\n\n$$\\text{Cash flow from operations} = \\text{Net income} + \\text{Non-cash charges} + \\text{Changes in working capital}$$\n\nIl CFO può richiedere aggiustamenti per voci non ricorrenti. Inoltre, possono essere necessari aggiustamenti quando si confrontano aziende che usano principi contabili diversi. Per esempio, i dividendi possono essere classificati come attività operative o di investimento secondo gli IFRS, e solo come attività operative secondo gli US GAAP."}, {"title": "Free Cash Flow to Equity (FCFE)", "icon": "👥", "content": "Si calcola come:\n\n$$\\text{FCFE} = \\text{CFO} - \\text{FCInv} + \\text{Net borrowing}$$\n\nIl FCFE è il proxy più valido per il flusso di cassa, ma anche il più volatile."}, {"title": "EBITDA", "icon": "⚙️", "content": "Si calcola come:\n\n$$\\text{EBITDA} = \\text{EBIT} + \\text{Depreciation and amortization}$$\n\nÈ usato più appropriatamente per valutare l'intera azienda piuttosto che la sola componente equity, poiché rappresenta i flussi di cassa disponibili sia per gli azionisti sia per gli obbligazionisti."}]}, "keyPoints": ["EPS + non-cash: ignora ricavi non monetari e capitale circolante", "CFO: rettifiche per voci non ricorrenti e principi contabili", "FCFE: il migliore ma il più volatile", "EBITDA: per l'intera azienda (EV)"], "examTips": ["Associazioni da esame: volatile → FCFE; intera azienda → EBITDA; ignora ricavi non monetari → EPS + NCC"], "question": {"q": "Which of the following is most likely a limitation of using EPS plus non-cash charges as a proxy for cash flow?", "options": ["Its volatility.", "It ignores non-cash revenues.", "It is more appropriately used to value the entire firm."], "ans": 1, "exp": "A significant limitation of EPS plus non-cash charges is that it ignores non-cash revenues and changes in working capital.\n\n**A is incorrect.** Volatility is a drawback of using FCFE as a proxy for cash flow but not EPS plus non-cash charges.\n\n**C is incorrect.** EPS plus non-cash charges are used to value the equity component of the firm as cash available to the debt holder is already deducted."}}, {"id": "n", "code": "LOS 25n", "title": "Calcolare e interpretare gli EV multiples e valutare l'uso dell'EV/EBITDA", "commandWord": "Calcolare", "importance": "VERY HIGH", "content": {"introduction": "I multipli enterprise value sono relativamente meno sensibili agli effetti della leva finanziaria rispetto ai multipli di prezzo, quando si confrontano aziende che usano diversi livelli di leva. Inoltre, assumono una prospettiva di controllo.", "sections": [{"title": "Enterprise Value to EBITDA", "icon": "🏢", "content": "L'**EBITDA** è definito come una stima del flusso di cassa operativo pre-interessi e pre-imposte. L'**enterprise value**, allo stesso tempo, è il valore totale dell'azienda (il valore di mercato di equity ordinario, debito ed equity privilegiato) meno il valore della cassa e degli investimenti a breve termine. L'EV/EBITDA è, pertanto, un indicatore di valutazione per l'azienda nel suo complesso.\n\n**Vantaggi**\n\n• L'EV/EBITDA è più appropriato del solo P/E per confrontare aziende con diversi livelli di leva finanziaria (valori di debito).\n• Aggiungere nuovamente ammortamenti e svalutazioni elimina i problemi che derivano dai diversi metodi di contabilizzazione degli ammortamenti, a differenza dell'utile netto, che è al netto di ammortamenti e svalutazioni.\n• L'EBITDA è positivo quando l'EPS è negativo.\n\n**Svantaggi**\n\n• L'EBITDA sovrastima il flusso di cassa operativo quando il capitale circolante è in crescita.\n• Il free cash flow to the firm (FCFF) ha un legame più forte con la teoria della valutazione rispetto all'EBITDA."}, {"title": "Determinazione dell'enterprise value", "icon": "🏗️", "content": "$$\\begin{aligned} \\text{Enterprise value} = {} & \\text{Market value of common equity} \\\\ & + \\text{Market value of preferred stock} + \\text{Market value of debt} \\\\ & - \\text{Value of cash and short-term investments} \\end{aligned}$$\n\n**Valutazione basata sui fondamentali previsti.** Il justified EV/EBITDA basato sui fondamentali è positivamente correlato alla redditività attesa, misurata dal return on invested capital, e al tasso di crescita atteso del free cash flow to the firm. È negativamente correlato al costo medio ponderato del capitale (WACC) dell'azienda. Il **return on invested capital (ROIC)** si calcola come utile operativo al netto delle imposte diviso il capitale investito totale.\n\n**Valutazione basata sui comparabili.** Un EV/EBITDA più basso rispetto ai peer indica che un'azienda è relativamente sottovalutata. Tuttavia, l'EV/EBITDA è solo un elemento informativo da considerare. Il **total invested capital (TIC)**, noto anche come valore di mercato del capitale investito, è un'alternativa all'enterprise value: è il valore di mercato di equity e debito.\n\nAltri multipli enterprise value includono:\n\n1. EV/FCFF.\n2. EV/EBITDAR, dove R sta per spese di affitto (rent expense).\n3. EV/EBIT."}, {"title": "Enterprise Value to Sales", "icon": "🛍️", "content": "L'enterprise value to sales è un'alternativa al rapporto prezzo/vendite. La debolezza del multiplo P/S è che non riconosce che, per un'azienda finanziata con debito, non tutte le vendite appartengono agli investitori in equity dell'azienda: parte dei proventi dalle vendite sarà usata per pagare interessi e capitale ai fornitori di capitale di debito. L'EV/S è un rapporto alternativo basato sulle vendite, particolarmente utile quando si confrontano aziende con strutture di capitale diverse."}, {"title": "Esempio: multipli enterprise value con i comparabili", "icon": "✏️", "content": "| Voce | Valore |\n|---|---|\n| Numero di azioni in circolazione | 100.000 |\n| Prezzo di mercato per azione | 16 |\n| Valore di mercato delle azioni privilegiate | 1,2 |\n| Valore di mercato del debito | 2,8 |\n| Cassa e investimenti a breve termine | 0,6 |\n| Ricavi | 6,4 |\n| Ammortamenti e svalutazioni | 0,5 |\n| Spese per interessi | 0,1 |\n| Imposte | 0,3 |\n| Utile netto | 1,9 |\n\nCalcolare enterprise value, EBITDA ed EV/EBITDA.\n\n**Soluzione**\n\n$$\\text{Enterprise value} = (0.1 \\times 16) + 1.2\\text{m} + 2.8\\text{m} - 0.6\\text{m} = \\$5\\text{m}$$\n\n$$\\begin{aligned} \\text{EBITDA} &= \\text{Net income} + \\text{Interest} + \\text{Taxes} + \\text{Depreciation and amortization} \\\\ &= 1.9\\text{m} + 0.1\\text{m} + 0.3\\text{m} + 0.5\\text{m} = \\$2.8\\text{m} \\end{aligned}$$\n\n$$\\frac{\\text{EV}}{\\text{EBITDA}} = \\frac{\\$5\\text{m}}{\\$2.8\\text{m}} = 1.79$$\n\n(Nota di traduzione: nella formula dell'EV, \"0,1 × 16\" corrisponde a 0,1 milioni di azioni — cioè le 100.000 azioni — moltiplicate per il prezzo 16, da cui MV equity = 1,6 mln.)"}]}, "keyPoints": ["EV = equity + privilegiate + debito − cassa", "EV/EBITDA neutralizza leva e politiche di ammortamento", "EBITDA sovrastima il cash flow se il capitale circolante cresce", "Giustificato: ↑ con ROIC e crescita FCFF, ↓ con WACC", "EV/EBITDA basso vs peer → sottovalutata"], "examTips": ["EBITDA dal net income: NI + interessi + imposte + ammortamenti", "Numeratore e denominatore devono \"appartenere\" agli stessi investitori: EV con EBITDA, prezzo con EPS"], "question": {"q": "A lower EV/EBITDA relative to peers indicates that a company is mostly likely:", "options": ["undervalued.", "overvalued.", "fairly valued."], "ans": 0, "exp": "A lower EV/EBITDA relative to peers most likely indicated that it is relatively undervalued.\n\n**B is incorrect.** A higher EV/EBITDA value relative to peers indicates that the company is relatively overvalued.\n\n**C is incorrect.** An EV/EBITDA value similar to that of peers indicates that the company is relatively fairly valued."}}, {"id": "o", "code": "LOS 25o", "title": "Spiegare le fonti di differenze nei confronti di valutazione cross-border", "commandWord": "Spiegare", "importance": "LOW", "content": {"introduction": "Confrontare aziende tra paesi diversi è complicato, poiché comporta differenze nei metodi contabili, differenze economiche, differenze culturali e conseguenti differenze nelle opportunità di crescita e di rischio. È stato riscontrato che i rapporti P/E di aziende dello stesso settore, ma di paesi diversi, variano ampiamente. Sebbene i principi contabili internazionali stiano convergendo, permangono differenze tra paesi, che a volte rendono difficili i confronti.\n\nGli analisti devono essere consapevoli delle differenze tra i principi e fare aggiustamenti quando le informazioni fornite (disclosure) offrono dati sufficienti per farlo. Le differenze contabili internazionali influenzano la comparabilità di tutti i multipli di prezzo.", "sections": []}, "keyPoints": ["Fonti: contabilità, economia, cultura, crescita e rischio", "Le differenze contabili toccano tutti i multipli", "Rettificare quando la disclosure lo consente"], "examTips": ["Le differenze di P/E sono la CONSEGUENZA, non la fonte"], "question": {"q": "Which of the following is least likely a source of cross-border valuation differences?", "options": ["Accounting methods.", "Differences in risk.", "Differences in P/E."], "ans": 2, "exp": "The differences in P/E are the least likely a source of cross-border valuation differences.\n\n**B is incorrect.** Differences in risk are a source of cross-border valuation differences.\n\n**A is incorrect.** Accounting methods are a source of cross-border valuation differences."}}, {"id": "p", "code": "LOS 25p", "title": "Descrivere gli indicatori di valutazione momentum", "commandWord": "Descrivere", "importance": "MEDIUM", "content": {"introduction": "Gli **indicatori momentum** mettono in relazione il prezzo o un fondamentale, come gli utili, con la serie storica dei loro valori passati o con il valore atteso del fondamentale.\n\nEsistono tre principali indicatori momentum:\n\n• Earnings surprise.\n• Standardized unexpected earnings.\n• Relative strength.", "sections": [{"title": "Earnings Surprise/Unexpected Earnings", "icon": "😮", "content": "Gli **unexpected earnings** (chiamati anche **earnings surprise**) sono la differenza tra gli utili riportati e gli utili attesi.\n\n$$\\text{UE}_t = \\text{EPS}_t - E(\\text{EPS}_t)$$\n\nDove:\n\n• \\(\\text{UE}_t\\) = unexpected earnings per il trimestre \\(t\\).\n• \\(\\text{EPS}_t\\) = utili per azione riportati per il trimestre \\(t\\).\n• \\(E(\\text{EPS}_t)\\) = EPS atteso per il trimestre."}, {"title": "Esempio: earnings surprise/unexpected earnings", "icon": "✏️", "content": "Un'azione con utili trimestrali riportati di $2,05 e utili attesi di $2,00 sarebbe considerata avere un earnings surprise positivo di $0,05. La percentuale di earnings surprise sarebbe \\(\\frac{0.05}{2.00} = 0.025\\) ovvero 2,5%."}, {"title": "Standardized Unexpected Earnings (SUE)", "icon": "📏", "content": "Il **SUE** scala gli unexpected earnings con una misura della dimensione degli errori di previsione (o sorprese) storici. Il principio sottostante è che, quanto più bassa è la dimensione storica dell'errore di previsione, tanto più significativo è il dato errore di previsione. Si calcola come:\n\n$$\\text{SUE}_t = \\frac{\\text{EPS}_t - E(\\text{EPS}_t)}{\\sigma[\\text{EPS}_t - E(\\text{EPS}_t)]}$$\n\nDove:\n\n• \\(\\text{EPS}_t\\) = EPS effettivo al tempo \\(t\\).\n• \\(E(\\text{EPS}_t)\\) = EPS atteso al tempo \\(t\\).\n• \\(\\sigma[\\text{EPS}_t - E(\\text{EPS}_t)]\\) = deviazione standard di \\(\\text{EPS}_t - E(\\text{EPS}_t)\\)."}, {"title": "Indicatori di relative strength", "icon": "💪", "content": "Confrontano la performance di un'azione durante un periodo con la sua performance passata o con la performance di un gruppo di azioni. Questo indicatore è spesso scalato a 1 nel periodo iniziale per facilità di interpretazione. Se l'azione sovraperforma l'indice, l'indicatore di relative strength sarà maggiore di 1."}]}, "keyPoints": ["UE = EPS riportato − EPS atteso", "SUE = UE / deviazione standard delle sorprese passate", "Relative strength > 1 = sovraperformance"], "examTips": ["La stessa sorpresa \"pesa\" di più se storicamente le previsioni erano molto precise (σ piccola)"], "question": {"q": "Suppose a stock has reported quarterly earnings of $8.35 and expected earnings of $7.90. The earnings surprise would closest to:", "options": ["0.45.", "-0.45.", "8.35."], "ans": 0, "exp": "$$\\begin{aligned} \\text{UE}_t &= \\text{EPS}_t - E(\\text{EPS}_t) \\\\ &= 8.35 - 7.90 \\\\ &= 0.45 \\end{aligned}$$"}}, {"id": "q", "code": "LOS 25q", "title": "Usare media aritmetica, mediana, media armonica e media armonica ponderata per misurare la tendenza centrale dei multipli", "commandWord": "Calcolare", "importance": "HIGH", "content": {"introduction": "", "sections": [{"title": "Media dei multipli / la media armonica", "icon": "➗", "content": "La **media armonica (harmonic mean)** e la **media armonica ponderata (weighted harmonic mean)** si applicano per fare la media di un gruppo di multipli di prezzo."}, {"title": "Esempio: misurare la tendenza centrale nei multipli", "icon": "✏️", "content": "Si consideri un portafoglio che contiene due azioni, assumendo che il portafoglio possieda il 100% delle azioni di ciascun titolo.\n\n| | Capitalizzazione di mercato | Utili | P/E |\n|---|---|---|---|\n| Stock A | 515 | 41,5 | 12,41 |\n| Stock B | 485 | 23,5 | 20,63 |\n\nIl P/E del portafoglio si calcola direttamente aggregando le capitalizzazioni di mercato e gli utili delle aziende:\n\n$$\\frac{515 + 485}{41.5 + 23.5} = \\frac{1000}{65} = 15.38$$\n\nSe il rapporto di una singola partecipazione è rappresentato da \\(X_i\\), l'espressione per la media armonica semplice del rapporto è:\n\n$$X_H = \\frac{n}{\\sum_{i=1}^{n}(1/X_i)}$$\n\nL'espressione per la media armonica ponderata è:\n\n$$X_{WH} = \\frac{1}{\\sum_{i=1}^{n}(\\omega_i/X_i)}$$\n\ndove gli \\(\\omega_i\\) sono i pesi di valore del portafoglio che sommano a 1.\n\n$$\\text{Media aritmetica P/E} = \\frac{12.41 + 20.63}{2} = 16.52$$\n\n$$\\text{Media ponderata P/E} = \\left(\\frac{515}{1000} \\times 12.41\\right) + \\left(\\frac{485}{1000} \\times 20.63\\right) = 16.39$$\n\n$$\\text{Media armonica P/E} = \\frac{2}{\\left(\\frac{1}{12.41} + \\frac{1}{20.63}\\right)} = 15.44$$\n\n$$\\text{Media armonica ponderata P/E} = \\frac{1}{\\left(\\frac{515}{1000} \\times \\frac{1}{12.41}\\right) + \\left(\\frac{485}{1000} \\times \\frac{1}{20.63}\\right)} = 15.50$$\n\nSi possono fare le seguenti osservazioni:\n\n• La media armonica semplice (15,44) è inferiore alla media aritmetica (16,52). La media armonica semplice attribuisce un peso minore ai P/E più alti e un peso maggiore ai P/E più bassi.\n• Usare la mediana, anziché la media, riduce l'effetto degli outlier.\n• Anche la media armonica può essere usata per ridurre l'impatto degli outlier. Tuttavia, mentre la media armonica riduce l'impatto degli outlier significativi, può peggiorare l'impatto dei piccoli outlier.\n• Per un indice equipesato (equal-weighted), la media armonica ponderata e la media armonica semplice sono uguali."}, {"title": "Uso di più indicatori di valutazione", "icon": "🧰", "content": "Gli analisti usano gli indicatori di valutazione per definire il proprio universo di investimenti attraverso un processo chiamato **screening**. Gli **stock screen** definiscono i criteri per includere le azioni in un portafoglio di investimento e sono un modo utile per restringere la ricerca di investimenti. L'uso di più di un indicatore di valutazione nella valutazione e selezione delle azioni è frequente, poiché indicatori diversi forniscono informazioni diverse.\n\nUna questione relativa all'uso dei rapporti in una strategia d'investimento è il **look-ahead bias**. Il look-ahead bias viene introdotto in studi o simulazioni usando informazioni o dati che non erano noti al momento in cui lo studio o la simulazione è stato condotto. Gli analisti d'investimento usano spesso dati storici per fare il backtest di una strategia d'investimento che prevede la selezione delle azioni basata su multipli di prezzo o altri fattori."}]}, "keyPoints": ["Armonica = n / Σ(1/X)", "Armonica ponderata = 1 / Σ(ω/X) = P/E del portafoglio", "Armonica < aritmetica: pesa meno i multipli alti", "Mediana robusta agli outlier", "Look-ahead bias nei backtest"], "examTips": ["Trucco: i multipli hanno il prezzo al numeratore; mediarli \"al contrario\" (1/X) equivale a mediare gli earnings yield, ed è per questo che l'armonica ponderata dà il P/E aggregato"], "question": {"q": "Consider a portfolio with 100 shares each of Stock A and Stock B:\n\n• Stock A is trading at $32 with an EPS of $4, resulting in a P/E of 8.\n• Stock B is trading at $27 with an EPS of $3, resulting in a P/E of 9.\n\nThe simple harmonic mean is closest to:", "options": ["8.47.", "8.50.", "8.55."], "ans": 0, "exp": "$$X_H = \\frac{n}{\\sum_{i=1}^{n}(1/X_i)} = \\frac{2}{\\frac{1}{8} + \\frac{1}{9}} = 8.47$$"}}, {"id": "r", "code": "LOS 25r", "title": "Valutare se un'azione è sopravvalutata, correttamente valutata o sottovalutata confrontando i multipli", "commandWord": "Valutare", "importance": "HIGH", "content": {"introduction": "", "sections": [{"title": "Valutazione basata sui comparabili", "icon": "🔗", "content": "Il metodo di valutazione P/E è usato per stimare il valore dell'azione di un'azienda applicando un multiplo benchmark agli utili effettivi o previsti dell'azienda. Un approccio equivalente consiste nel confrontare il multiplo di prezzo effettivo di un'azione con un valore benchmark del multiplo.\n\nI passi per la valutazione basata sui comparabili sono:\n\n1. Selezionare e calcolare il multiplo di prezzo.\n2. Selezionare il benchmark e calcolarne il multiplo di prezzo.\n3. Stimare il valore dell'azione dell'azienda usando il multiplo benchmark.\n4. Verificare se le differenze tra il multiplo dell'azione e quello del benchmark sono spiegate dai determinanti sottostanti del multiplo. In caso contrario, l'attività potrebbe essere mal prezzata: controllare i fondamentali!"}, {"title": "Tipi di valori benchmark", "icon": "📋", "content": "Il multiplo benchmark può essere:\n\n• Il P/E medio o mediano del peer group di aziende di un settore, oppure una media dei P/E passati dell'azione rispetto al peer group.\n• Il valore medio passato del P/E dell'azione.\n• Il P/E di un indice azionario rappresentativo."}, {"title": "Il valore di un'azione", "icon": "🏷️", "content": "Se il prezzo dell'azione è superiore al prezzo basato sul multiplo benchmark, l'azione è relativamente sopravvalutata. Se il prezzo dell'azione è inferiore al prezzo basato sul multiplo benchmark, l'azione è relativamente sottovalutata."}, {"title": "Esempio: valutazione dei P/E con il metodo dei comparabili", "icon": "✏️", "content": "| | Trailing P/E | Leading P/E | Crescita a 5 anni | Beta |\n|---|---|---|---|---|\n| A | 9 | 7 | 9% | 1.1 |\n| B | 13 | 10 | 7% | 1.2 |\n| Mediana del peer | 12 | 11 | 9% | 1.1 |\n\nValutare il valore e il P/E di ciascuna azione con il metodo dei comparabili.\n\n**Soluzione.** L'azione A ha un P/E inferiore alla mediana del peer, pur avendo un tasso di crescita e un beta comparabili. È sottovalutata rispetto al benchmark.\n\nL'azione B ha un P/E più alto, nonostante una crescita attesa inferiore e un beta più elevato. È sopravvalutata rispetto al benchmark."}]}, "keyPoints": ["Confronta il multiplo con un benchmark", "Spiega le differenze con crescita e rischio", "P/E alto + crescita bassa + rischio alto → sopravvalutata"], "examTips": ["Prima di concludere \"sottovalutata\", chiediti: il P/E basso è spiegato da meno crescita o più rischio?"], "question": {"q": "Which of the following can least likely be used as a benchmark multiple in a valuation based on multiples?", "options": ["The average past value of the P/Es for the stock.", "The P/E ratio for a representative equity index.", "A group of assets."], "ans": 2, "exp": "A group of assets by itself could not be used as a benchmark multiple. However, the mean or median of a group of assets could be used as a benchmark multiple.\n\n**A is incorrect.** The average past value of the P/Es of the stock could be used as a benchmark multiple.\n\n**B is incorrect.** The P/E ratio for a representative equity index could be used as a benchmark multiple."}}]}, {"id": "ev-r26", "number": 26, "title": "Residual Income Valuation", "estimatedTime": "4-5 ore", "totalLOS": 12, "los": [{"id": "a", "code": "LOS 26a", "title": "Calcolare e interpretare il residual income, l'economic value added e il market value added", "commandWord": "Calcolare", "importance": "VERY HIGH", "content": {"introduction": "Il **residual income** deduce un onere per il capitale azionario (**equity charge**) per determinare se l'impresa sta generando un rendimento superiore ai costi opportunità per gli investitori in equity. Il residual income è equivalente al **profitto economico**. Si calcola come:\n\n$$\\begin{aligned} \\text{Residual income} &= \\text{Net income} - \\text{Equity charge} \\\\ \\text{Equity charge} &= \\text{Cost of equity capital} \\times \\text{Equity capital} \\end{aligned}$$", "sections": [{"title": "Esempio: Residual income", "icon": "✏️", "content": "Si considerino le seguenti informazioni:\n\n• Attivo totale = $3.000.000\n• Debito = 30%, Equity = 70%\n• Cost of equity = 10%\n• Cost of debt (al lordo delle imposte) = 7%\n• EBIT = $400.000\n• Aliquota fiscale = 30%\n\nIl residual income si calcolerebbe come:\n\n| | |\n|---|---|\n| EBIT | 400.000 |\n| Meno: Interest expense | (63.000) |\n| Reddito ante imposte | 337.000 |\n| Meno: Imposte sul reddito (30%) | (101.100) |\n| Net income | 235.900 |\n\n$$\\begin{aligned} \\text{Debito} &= \\$3.000.000 \\times 30\\% = \\$900.000 \\\\ \\text{Interest expense} &= \\$900.000 \\times 7\\% = \\$63.000 \\\\ \\text{Equity capital} &= 70\\% \\times \\$3.000.000 = \\$2.100.000 \\\\ \\text{Equity charge} &= \\text{Cost of equity capital} \\times \\text{Equity capital} \\\\ &= 10\\% \\times \\$2.100.000 = \\$210.000 \\\\ \\text{Residual income} &= \\text{Net income} - \\text{Equity charge} \\\\ &= \\$235.900 - \\$210.000 = \\$25.900 \\end{aligned}$$\n\nUn residual income positivo indica che gli utili dell'impresa coprono il suo cost of equity capital."}, {"title": "Economic Value Added (EVA)", "icon": "➕", "content": "L'**economic value added (EVA)** si calcola come:\n\n$$\\text{EVA} = \\text{NOPAT} - (C\\% \\times TC)$$\n\nDove:\n\nNOPAT = Net operating profit after tax (utile operativo netto al netto delle imposte)\nC% = Cost of capital\nTC = Total capital (capitale totale)\n\nIl NOPAT si calcola come:\n\n$$\\text{NOPAT} = \\text{EBIT} - (\\text{EBIT} \\times \\text{Taxes})$$\n\nDove: EBIT = Earnings before interest and taxes\n\nOccorre apportare le seguenti rettifiche:\n\n• Le spese di R&S vengono riaggiunte agli utili per calcolare il NOPAT.\n• Per gli investimenti strategici che non ci si attende generino un rendimento immediato, l'onere per il capitale viene sospeso fino a una data successiva.\n• Le imposte differite vengono eliminate. Solo le imposte effettivamente pagate per cassa (cash taxes) sono considerate un costo.\n• Eventuale riserva LIFO dell'inventario viene riaggiunta al capitale, e ogni incremento della riserva LIFO viene riaggiunto in sede di calcolo del NOPAT.\n• I leasing operativi vengono trattati come leasing finanziari (capital leases) e le voci non ricorrenti vengono rettificate."}, {"title": "Market Value Added (MVA)", "icon": "📈", "content": "Un'impresa che genera un profitto economico positivo dovrebbe avere un valore di mercato superiore al valore contabile del suo capitale. L'**MVA** misura il valore generato dal management per gli investitori dell'impresa attraverso la produzione di profitti economici lungo la vita dell'impresa.\n\nL'MVA si calcola come:\n\n$$\\text{MVA} = \\text{Market value of the company} - \\text{Book value of total capital}$$"}, {"title": "Esempio: Calcolo di EVA e MVA", "icon": "✏️", "content": "Si considerino le seguenti informazioni:\n\n| | |\n|---|---|\n| NOPAT | $1.650 |\n| Numero totale di azioni in circolazione | 550 |\n| Prezzo di mercato per azione | $35 |\n| Market value of debt | $5.500 |\n| Total invested capital | $19.250 |\n| WACC | 10% |\n\nL'EVA e l'MVA dell'impresa sono più prossimi a:\n\n$$\\begin{aligned} \\text{EVA} &= \\text{NOPAT} - (C\\% \\times TC) \\\\ &= 1.650 - (10\\% \\times 19.250) \\\\ &= -\\$275 \\end{aligned}$$\n\n$$\\begin{aligned} \\text{Market value of the company} &= \\text{Market value of equity} + \\text{Market value of debt} \\\\ &= (550 \\times 35) + 5.500 \\\\ &= \\$24.750 \\\\ \\text{MVA} &= \\text{Market value of the company} - \\text{Valore contabile del capitale totale} \\\\ &= 24.750 - 19.250 \\\\ &= \\$5.500 \\end{aligned}$$"}]}, "keyPoints": ["RI = NI − (r × equity capital)", "EVA = NOPAT − (WACC × capitale totale)", "MVA = valore di mercato − valore contabile del capitale", "RI usa il costo dell'equity; EVA usa il WACC"], "examTips": ["Trucco: RI guarda solo agli azionisti (parte dal NI), EVA a tutti i finanziatori (parte dal NOPAT)", "Gli interessi sono già dentro il NI: nel RI si sottrae solo il costo dell'equity"], "question": {"q": "Given the following information:\n\n• Total assets = $2,000,000\n• Debt = 40%, Equity = 60%\n• Cost of equity = 9%\n• Cost of debt (before tax) = 5%\n• EBIT = $200,000\n• Tax rate = 20%\n\nResidual income is closest to:", "options": ["$4,000", "$40,000", "$108,000"], "ans": 0, "exp": "| | |\n|---|---|\n| EBIT | $200,000 |\n| Less: Interest expense | $40,000 |\n| Pre-tax income | $160,000 |\n| Less: Income tax expense (30%) | $48,000 |\n| Net income | $112,000 |\n\n$$\\begin{aligned} \\text{Debt} &= \\$2{,}000{,}000 \\times 40\\% = \\$800{,}000 \\\\ \\text{Interest expense} &= \\$800{,}000 \\times 5\\% = \\$40{,}000 \\\\ \\text{Equity capital} &= 60\\% \\times \\$2{,}000{,}000 = \\$1{,}200{,}000 \\\\ \\text{Equity charge} &= \\text{Cost of equity capital} \\times \\text{Equity capital} \\\\ &= 9\\% \\times \\$1{,}200{,}000 = \\$108{,}000 \\\\ \\text{Residual income} &= \\text{Net income} - \\text{Equity charge} \\\\ &= \\$112{,}000 - \\$108{,}000 = \\$4{,}000 \\end{aligned}$$"}}, {"id": "b", "code": "LOS 26b", "title": "Descrivere gli usi dei residual income models", "commandWord": "Descrivere", "importance": "MEDIUM", "content": {"introduction": "Un'impresa con residual income positivo — che genera più reddito del suo cost of capital — sta **creando valore**. Un'impresa con residual income negativo sta **distruggendo valore**. Un residual income più elevato è associato a una valutazione più elevata.\n\nI residual income models sono stati impiegati per valutare singole azioni e indici azionari. Il residual income model è stato usato anche per misurare l'impairment dell'avviamento (goodwill).\n\nIl residual income è anche definito **profitto economico / utili anomali (abnormal earnings)**, per via della sua stima del profitto dell'impresa dopo aver dedotto il costo di tutto il capitale.", "sections": []}, "keyPoints": ["RI > 0 → crea valore; RI < 0 → distrugge valore", "Usi: azioni, indici, impairment del goodwill", "Sinonimi: profitto economico, abnormal earnings"], "examTips": ["RI positivo → prezzo atteso SOPRA il book value"], "question": {"q": "Which of the following statements is the most accurate regarding residual income?", "options": ["A company with positive residual income is generating more income than its cost of capital.", "A company with positive residual income is only generating enough income to cover its cost of debt.", "A company with positive residual income should expect its share price to be lower than its book value."], "ans": 0, "exp": "A company with positive residual income generates more income than its cost of capital for both debt and equity. Residual income is calculated by deducting a company's cost of capital. If it is positive, then the company is generating more income than its cost of both debt and equity.\n\n**B is incorrect.** A company with positive residual income is generating enough income to cover both its cost of debt and cost of equity.\n\n**C is incorrect.** A company with positive residual income should expect its share price to be higher than its book value because it is generating value."}}, {"id": "c", "code": "LOS 26c", "title": "Calcolare il valore intrinseco di un'azione con il residual income model e confrontare il riconoscimento del valore con gli altri present value model", "commandWord": "Calcolare", "importance": "VERY HIGH", "content": {"introduction": "Il residual income model analizza il valore intrinseco dell'equity come somma di:\n\n• il valore contabile corrente dell'equity; e\n• il valore attuale dei residual income futuri attesi.\n\nIl residual income si calcola come utile netto meno un equity charge:\n\n$$RI_t = E_t - (r \\times B_{t-1})$$\n\nUsando il residual income model, il valore intrinseco di un'azione ordinaria può essere espresso come segue:\n\n$$V_0 = B_0 + \\sum_{t=1}^{\\infty} \\frac{RI_t}{(1+r)^t} = B_0 + \\sum_{t=1}^{\\infty} \\frac{E_t - rB_{t-1}}{(1+r)^t}$$\n\nDove:\n\n\\(V_0\\) = Valore dell'azione oggi\n\\(B_0\\) = Valore contabile corrente dell'equity per azione\n\\(B_t\\) = Valore contabile atteso dell'equity al tempo t\n\\(r\\) = Tasso di rendimento richiesto sull'equity\n\\(E_t\\) = EPS atteso per il periodo t\n\\(RI_t\\) = Residual income per azione atteso", "sections": [{"title": "Esempio: Previsione del residual income", "icon": "✏️", "content": "Un'impresa presenta le seguenti informazioni:\n\n• Il valore contabile corrente per azione è pari a $9,00.\n• Per i prossimi tre anni, l'EPS atteso è rispettivamente di $3,25, $4,00 e $5,50.\n• I dividendi per i prossimi tre anni sono attesi rispettivamente a $2,25, $3,00 e $16,50.\n• Il dividendo dell'anno 3 è atteso essere un dividendo di liquidazione, cioè ci si attende che l'impresa chiuda le proprie operazioni alla fine dell'anno 3 e distribuisca l'intero valore contabile sotto forma di dividendo.\n\nIl tasso di rendimento richiesto sull'equity è dell'8%.\n\na) Il valore contabile per azione e il residual income per i prossimi tre anni sono:\n\n| Anno | 1 | 2 | 3 |\n|---|---|---|---|\n| Valore contabile iniziale per azione \\((B_{t-1})\\) | $9,00 | $10,00 | $11,00 |\n| Utile netto per azione (EPS) | 3,25 | 4,00 | 5,50 |\n| Meno dividendi per azione (D) | 2,25 | 3,00 | 16,50 |\n| Valore contabile finale per azione \\((B_{t-1} + \\text{EPS} - D)\\) | $10,00 | $11,00 | $0,00 |\n| Utile netto per azione (EPS) | 3,25 | 4,00 | 5,50 |\n| Meno equity charge per azione \\((rB_{t-1})\\) | 0,72 | 0,80 | 0,88 |\n| Residual income | $2,53 | $3,20 | $4,62 |\n\nUsando il residual income model, il valore intrinseco si calcola come:\n\n$$V_0 = 9{,}00 + \\frac{2{,}53}{(1{,}08)} + \\frac{3{,}20}{(1{,}08)^2} + \\frac{4{,}62}{(1{,}08)^3} = \\$17{,}75$$\n\nUsando il dividend discount model, il valore intrinseco si calcola come:\n\n$$V_0 = \\frac{2{,}25}{(1{,}08)^1} + \\frac{3{,}00}{(1{,}08)^2} + \\frac{16{,}50}{(1{,}08)^3} = \\$17{,}75$$\n\nIl residual income model e altri modelli di valutazione come il dividend discount model dovrebbero fornire lo stesso valore.\n\nEsiste un modo alternativo di calcolare il residual income, oltre a:\n\n$$RI_t = E_t - (r \\times B_{t-1})$$\n\nEsso consiste nell'applicare la differenza tra il return on equity (ROE) effettivo e il rendimento richiesto sull'equity (\\(r\\)) al valore contabile di inizio periodo.\n\n$$E_t = \\text{ROE} \\times B_{t-1}$$\n\nPertanto:\n\n$$RI_t = (\\text{ROE} - r) \\times B_{t-1}$$\n\nUsando questa formula, l'equazione del residual income model può essere espressa come:\n\n$$V_0 = B_0 + \\sum_{t=1}^{\\infty} \\frac{(\\text{ROE}_t - r)B_{t-1}}{(1+r)^t}$$"}]}, "keyPoints": ["V0 = B0 + PV dei RI futuri", "RI_t = E_t − r × B_{t−1} = (ROE − r) × B_{t−1}", "Book value finale = iniziale + EPS − dividendi", "RI e DDM danno lo stesso valore, ma il RI lo riconosce prima"], "examTips": ["L'equity charge usa il book value di INIZIO periodo (B_{t−1})", "Il book value corrente B0 NON si sconta"], "question": {"q": "Assuming a company has the following information:\n\n• Current book value per share equals $22.00.\n• For the next three years, EPS is expected to be $6.50, $8.00, and $10.50, respectively.\n• Dividends for the next three years are expected to be $3.50, $5.00, and $12.50 respectively.\n• The Year 3 dividend is expected to be a liquidating dividend, i.e., the company is anticipated to cease its operations at the end of Year 3 and distribute its entire book value in a dividend.\n• The required rate of return on equity of 9%.\n\nIts intrinsic value would be closest to:", "options": ["37.14.", "35.50.", "39.23."], "ans": 0, "exp": "| Year | 1 | 2 | 3 |\n|---|---|---|---|\n| Beginning book value per share \\((B_{t-1})\\) | $22.00 | $25.00 | 28.00 |\n| Net income per share (EPS) | 6.50 | 8.00 | 10.50 |\n| Less dividends per share (D) | 3.50 | 5.00 | 38.50 |\n| Ending book value per share \\((B_{t-1} + \\text{EPS} - D)\\) | 25.00 | 28.00 | 00.00 |\n| Net income per share (EPS) | 6.50 | 8.00 | 10.50 |\n| Less per share equity charge \\((rB_{t-1})\\) | 1.98 | 2.25 | 2.52 |\n| Residual income | $4.52 | $5.75 | $7.98 |\n\n$$V_0 = 22.00 + \\frac{4.52}{(1.09)^1} + \\frac{5.75}{(1.09)^2} + \\frac{7.98}{(1.09)^3} = \\$37.14$$"}}, {"id": "d", "code": "LOS 26d", "title": "Spiegare i determinanti fondamentali del residual income", "commandWord": "Spiegare", "importance": "HIGH", "content": {"introduction": "I driver fondamentali del residual income possono essere individuati assumendo una crescita costante di dividendi e utili.\n\nAssumendo crescita costante, il valore intrinseco di un'azione secondo il residual income model può essere espresso come:\n\n$$V_0 = B_0 + \\frac{\\text{ROE} - r}{r - g} B_0$$\n\nSe il return on equity è uguale al rendimento richiesto sull'equity, il valore intrinseco dell'azione sarà pari al valore contabile. Se il return on equity è maggiore del rendimento richiesto sull'equity, il valore intrinseco dell'azione sarà superiore al valore contabile e il justified P/B ratio sarà maggiore di 1. Se il return on equity è minore del rendimento richiesto sull'equity, il valore intrinseco dell'azione sarà inferiore al valore contabile e il justified P/B ratio sarà minore di 1.", "sections": []}, "keyPoints": ["Driver: ROE, r, g e book value", "ROE > r crea valore sopra il book value", "Crescita costante di utili e dividendi (non dei ricavi)"], "examTips": ["Il premio sul book value dipende dallo spread (ROE − r), amplificato dalla crescita"], "question": {"q": "Which of the following is least likely a fundamental driver of residual income?", "options": ["Constant growth in earnings.", "Constant growth in revenues.", "Constant growth in dividends."], "ans": 1, "exp": "Constant growth in revenues is not a fundamental driver of residual income.\n\n**A is incorrect.** Constant growth in earnings is a fundamental driver of residual income.\n\n**C is incorrect.** Constant growth in revenues is a fundamental driver of residual income."}}, {"id": "e", "code": "LOS 26e", "title": "Spiegare la relazione tra residual income valuation e justified P/B basato sui fondamentali previsti", "commandWord": "Spiegare", "importance": "HIGH", "content": {"introduction": "I residual income models possono essere usati per stimare justified price multiple. A partire dal justified P/B ratio basato sui fondamentali:\n\n$$\\frac{P_0}{B_0} = \\frac{\\text{ROE} - g}{r - g}$$\n\nche è matematicamente equivalente a:\n\n$$\\frac{P_0}{B_0} = 1 + \\frac{\\text{ROE} - r}{r - g}$$\n\nIl valore approssimato di un'azione è il valore contabile per azione più il valore attuale del flusso atteso di residual income.\n\nIl justified P/B ratio di un'azione è correlato al residual income futuro atteso. Un concetto strettamente collegato è la **q di Tobin**, il rapporto tra il valore di mercato di debito ed equity e il costo di sostituzione (replacement cost) dell'attivo totale.\n\n$$\\text{q di Tobin} = \\frac{\\text{Valore di mercato di debito ed equity}}{\\text{Costo di sostituzione dell'attivo totale}}$$\n\nIl denominatore utilizza l'attivo totale ed è valutato al costo di sostituzione. I costi di sostituzione tengono conto degli effetti dell'inflazione. Ci si attende che la q di Tobin sia tanto più alta quanto maggiore è la produttività dell'attivo dell'impresa. Una difficoltà nel calcolo della q di Tobin è la mancanza di informazioni sul costo di sostituzione dell'attivo.\n\nSe il return on equity (ROE) è maggiore del rendimento richiesto sull'equity (\\(r\\)), il valore intrinseco dell'azione sarà superiore al valore contabile. Il justified P/B ratio sarà maggiore di uno.\n\nSe il return on equity (ROE) è minore del rendimento richiesto sull'equity (\\(r\\)), il valore intrinseco dell'azione sarà inferiore al valore contabile. Il justified P/B ratio sarà inferiore a uno.", "sections": []}, "keyPoints": ["P/B = (ROE − g)/(r − g) = 1 + (ROE − r)/(r − g)", "Il premio sul book = PV dei RI futuri / B0", "q di Tobin = valore di mercato / costo di sostituzione"], "examTips": ["ROE = r → RI = 0 → valore = book value"], "question": {"q": "If the return on equity equals the required rate of return on equity, a share's intrinsic value would most likely be equal to?", "options": ["Book value.", "Present value of the expected residual income.", "Earnings per share."], "ans": 0, "exp": "If the return on equity equals the required return on equity, the share's intrinsic value will be equal to the book value. If the return on equity is greater than the required return on equity, the stock's intrinsic value will be higher than the book value. If the return on equity is less than the required return on equity, the stock's intrinsic value will be less than the book value.\n\n**B is incorrect.** If the return on equity equals the required rate of return on equity, the residual income would be equal to zero.\n\n**C is incorrect.** If the return on equity equals the required rate of return on equity, the share price would not be equal to its earnings per share."}}, {"id": "f", "code": "LOS 26f", "title": "Calcolare e interpretare il valore intrinseco con i residual income model single-stage e multistage", "commandWord": "Calcolare", "importance": "VERY HIGH", "content": {"introduction": "", "sections": [{"title": "Single-Stage Residual Income Valuation", "icon": "➡️", "content": "Il modello **single-stage del residual income** (a crescita costante) assume che un'impresa abbia un return on equity costante e un tasso di crescita degli utili costante nel tempo.\n\n$$V_0 = B_0 + \\frac{\\text{ROE} - r}{r - g} B_0$$"}, {"title": "Esempio: Uso di un single-stage residual income model", "icon": "✏️", "content": "Il valore contabile corrente per azione di un'impresa è di $25,25 e il prezzo corrente per azione è di $36,00. Il ROE atteso di lungo periodo dell'impresa è del 12% e la crescita di lungo periodo è del 6,5%. Assumendo un cost of equity dell'8%, il valore intrinseco si calcola come:\n\n$$\\begin{aligned} V_0 &= B_0 + \\frac{\\text{ROE} - r}{r - g} B_0 \\\\ &= 25{,}25 + \\left(\\frac{0{,}12 - 0{,}08}{0{,}08 - 0{,}65}\\right) \\times 25{,}25 \\\\ &= 92{,}58 \\end{aligned}$$\n\nSe il return on equity è inferiore al rendimento richiesto sull'equity, il valore intrinseco dell'azione di un'impresa sarà inferiore al suo valore contabile per azione. Quando un'impresa non ha prospettive di coprire il proprio cost of capital, può essere opportuna una liquidazione dell'impresa e una riallocazione degli asset.\n\nUn limite del modello single-stage è che assume che il return on equity superiore al cost of equity persista indefinitamente. Tuttavia, il return on equity di un'impresa tenderà probabilmente a regredire verso un valore medio nel tempo. Se un settore ha un return on equity elevato, attirerà concorrenza, riducendo infine il return on equity."}, {"title": "Multistage Residual Income Valuation", "icon": "🪜", "content": "L'approccio **multistage** del residual income può essere usato per prevedere il residual income lungo un dato orizzonte temporale e poi calcolare un terminal value basato sul **continuing residual income** al termine di quel periodo. Il continuing residual income è il residual income successivo al periodo di previsione.\n\nNell'approccio del residual income model, il terminal value non costituisce una porzione ampia del valore intrinseco. Ciò è diverso dagli approcci multistage DDM e DCF.\n\nOccorre fare una delle seguenti assunzioni sul continuing residual income:\n\n• Il residual income prosegue indefinitamente a un livello positivo.\n• Il residual income è zero dall'anno terminale in poi.\n• Il residual income declina a zero man mano che il ROE regredisce verso il cost of equity nel tempo.\n• Il residual income riflette la regressione del ROE verso un certo livello medio."}, {"title": "Esempio: Multistage residual income model", "icon": "✏️", "content": "Un'impresa presenta le seguenti informazioni:\n\n• Valore contabile corrente per azione = $12\n• ROE = 16%\n• L'EPS atteso per gli anni 1-5 è calcolato come ROE per il valore contabile per azione di inizio periodo.\n• Dividend payout ratio = 25%\n• Tasso di rendimento richiesto sull'equity = 8%\n\na) Se il ROE scende all'8% dopo l'anno 5 e il continuing residual income scende a zero, il valore intrinseco dell'impresa si calcola come:\n\n| Anno | 1 | 2 | 3 | 4 | 5 | 6 |\n|---|---|---|---|---|---|---|\n| Valore contabile iniziale per azione | $12,00 | $13,44 | $15,05 | $16,85 | $18,87 | $21,14 |\n| Più: EPS \\((\\text{ROE} \\times B_{t-1})\\) | 1,92 | 2,15 | 2,40 | 2,70 | 3,02 | 3,38 |\n| Meno: Dividendi \\((25\\% \\times \\text{EPS})\\) | 0,48 | 0,54 | 0,60 | 0,68 | 0,75 | 0,85 |\n| **Valore contabile finale per azione** | **13,44** | **15,05** | **16,85** | **18,87** | **21,14** | **23,67** |\n| Utile per azione (EPS) | 1,92 | 2,15 | 2,40 | 2,70 | 3,02 | 3,38 |\n| Meno: Equity charge per azione \\((r \\times B_{t-1})\\) | 0,96 | 1,08 | 1,20 | 1,35 | 1,51 | 1,69 |\n| **Residual income per azione** | **0,96** | **1,07** | **1,20** | **1,35** | **1,51** | **1,69** |\n\n$$\\begin{aligned} \\text{Valore intrinseco} &= 12{,}00 + \\frac{0{,}96}{(1{,}08)^1} + \\frac{1{,}07}{(1{,}08)^2} + \\frac{1{,}20}{(1{,}08)^3} + \\frac{1{,}35}{(1{,}08)^4} + \\frac{1{,}51}{(1{,}08)^5} \\\\ &= \\$16{,}78 \\end{aligned}$$\n\nb) Assumendo che il continuing residual income rimanga costante al valore dell'anno cinque di $0,90 in futuro, il valore intrinseco si calcola come:\n\n$$\\begin{aligned} \\text{Terminal value} &= \\frac{0{,}90}{0{,}08} = 11{,}25 \\\\ \\text{Valore intrinseco} &= 12{,}00 + \\frac{0{,}96}{(1{,}08)^1} + \\frac{1{,}07}{(1{,}08)^2} + \\frac{1{,}20}{(1{,}08)^3} + \\frac{1{,}35}{(1{,}08)^4} \\\\ & \\quad + \\frac{1{,}51 + 11{,}25}{(1{,}08)^5} \\\\ &= \\$24{,}44 \\end{aligned}$$\n\nc) Assumendo che il ROE declini verso il rendimento richiesto sull'equity nel tempo, il valore intrinseco si calcola usando:\n\n$$V_0 = B_0 + \\sum_{t=1}^{T-1} \\frac{(E_t - rB_{t-1})}{(1+r)^t} + \\frac{E_T - rB_{T-1}}{(1+r-\\omega)(1+r)^{T-1}}$$\n\nDove: \\(\\omega\\) = Fattore di persistenza (**persistence factor**).\n\nUn persistence factor pari a 1 indica che il residual income non declinerà: rimarrà allo stesso livello indefinitamente. Un persistence factor pari a 0 indica che non vi sarà residual income dopo l'orizzonte di previsione iniziale. Maggiore è il persistence factor, maggiore è il flusso di residual income nella fase finale e maggiore è il valore dell'azione.\n\nAssumendo un persistence factor di 0,4, il terminal value alla fine dell'anno 5 si calcola come:\n\n$$\\begin{aligned} \\text{Terminal value} &= \\frac{1{,}69}{(1 + 0{,}08 - 0{,}4)} = 2{,}49 \\\\ \\text{Valore intrinseco} &= 12{,}00 + \\frac{0{,}96}{(1{,}08)^1} + \\frac{1{,}07}{(1{,}08)^2} + \\frac{1{,}20}{(1{,}08)^3} + \\frac{1{,}35}{(1{,}08)^4} \\\\ & \\quad + \\frac{1{,}51 + 2{,}49}{(1{,}08)^5} \\\\ &= \\$18{,}47 \\end{aligned}$$"}]}, "keyPoints": ["Single-stage: V0 = B0 + (ROE − r)/(r − g) × B0", "Multistage: B0 + PV RI espliciti + PV continuing RI", "Continuing RI: costante, zero, in declino, verso la media", "Persistence factor ω tra 0 e 1: più alto → più valore", "Il terminal value pesa poco nel RI model"], "examTips": ["TV con persistence: RI / (1 + r − ω), poi sconta come l'ultimo flusso", "ω = 1 → perpetuità RI/r; ω = 0 → TV = RI/(1 + r), solo un altro anno"], "question": {"q": "Assuming a company has the following information:\n\n• Current book value per share = $40\n• Expected long-term ROE = 18%\n• Required rate of return on equity = 9%\n• Current market price = $95\n\nThe implied growth rate is closest to:", "options": ["2.5%.", "3.0%.", "2.0%."], "ans": 0, "exp": "$$\\begin{aligned} g &= r - \\left[\\frac{(\\text{ROE} - r) \\times B_0}{V_0 - B_0}\\right] \\\\ &= 0.09 - \\left[\\frac{(0.18 - 0.09) \\times 40}{85 - 40}\\right] \\\\ &= 2.5\\% \\end{aligned}$$"}}, {"id": "g", "code": "LOS 26g", "title": "Calcolare il tasso di crescita implicito nel residual income dati il P/B di mercato e il rendimento richiesto", "commandWord": "Calcolare", "importance": "HIGH", "content": {"introduction": "L'equazione single-stage del residual income può essere riarrangiata per calcolare la crescita implicita nel prezzo di mercato corrente. Si assume che il prezzo di mercato corrente sia uguale al valore intrinseco dell'azione. Il valore intrinseco è assunto pari al prezzo di mercato.\n\n$$g = r - \\left[\\frac{(\\text{ROE} - r) \\times B_0}{V_0 - B_0}\\right]$$", "sections": [{"title": "Esempio", "icon": "✏️", "content": "Un'impresa presenta le seguenti informazioni:\n\n• Valore contabile corrente per azione = $8\n• ROE atteso di lungo periodo = 15%\n• Tasso di rendimento richiesto sull'equity = 8%\n\nSe il prezzo di mercato corrente è $32, il tasso di crescita implicito si calcola come:\n\n$$\\begin{aligned} g &= r - \\left[\\frac{(\\text{ROE} - r) \\times B_0}{V_0 - B_0}\\right] \\\\ &= 0{,}08 - \\left[\\frac{(0{,}15 - 0{,}08) \\times 8}{32 - 8}\\right] \\\\ &= 5{,}7\\% \\end{aligned}$$"}]}, "keyPoints": ["g implicita = r − RI / (prezzo − book value)", "Assume prezzo = valore intrinseco", "Premio sul book alto → crescita implicita alta"], "examTips": ["Deriva tutto dal single-stage: se ricordi quello, la formula si ricava in una riga"], "question": {"q": "Assuming a company has the following information:\n\n• Current book value per share = $12\n• Expected long-term ROE = 14%\n• Required rate of return on equity = 9%\n• Current market price = $42\n\nThe implied growth rate is closest to?", "options": ["6%", "7%", "8%"], "ans": 1, "exp": "$$\\begin{aligned} g &= r - \\left[\\frac{(\\text{ROE} - r) \\times B_0}{V_0 - B_0}\\right] \\\\ &= 9\\% - \\left[\\frac{(14\\% - 9\\%) \\times 12}{42 - 12}\\right] \\\\ &= 7\\% \\end{aligned}$$"}}, {"id": "h", "code": "LOS 26h", "title": "Spiegare il continuing residual income e giustificarne una stima all'orizzonte di previsione, date le prospettive di impresa e di settore", "commandWord": "Spiegare", "importance": "HIGH", "content": {"introduction": "", "sections": [{"title": "Single-Stage Residual Income Valuation", "icon": "➡️", "content": "Il modello **single-stage del residual income** (a crescita costante) assume che un'impresa abbia un return on equity costante e un tasso di crescita degli utili costante nel tempo.\n\n$$V_0 = B_0 + \\frac{\\text{ROE} - r}{r - g} B_0$$"}, {"title": "Esempio: Uso di un single-stage residual income model", "icon": "✏️", "content": "Il valore contabile corrente per azione di un'impresa è di $25,25 e il prezzo corrente per azione è di $36,00. Il ROE atteso di lungo periodo dell'impresa è del 12% e la crescita di lungo periodo è del 6,5%. Assumendo un cost of equity dell'8%, il valore intrinseco si calcola come:\n\n$$\\begin{aligned} V_0 &= B_0 + \\frac{\\text{ROE} - r}{r - g} B_0 \\\\ &= 25{,}25 + \\left(\\frac{0{,}12 - 0{,}08}{0{,}08 - 0{,}65}\\right) \\times 25{,}25 \\\\ &= 92{,}58 \\end{aligned}$$\n\nSe il return on equity è inferiore al rendimento richiesto sull'equity, il valore intrinseco dell'azione di un'impresa sarà inferiore al suo valore contabile per azione. Quando un'impresa non ha prospettive di coprire il proprio cost of capital, può essere opportuna una liquidazione dell'impresa e una riallocazione degli asset.\n\nUn limite del modello single-stage è che assume che il return on equity superiore al cost of equity persista indefinitamente. Tuttavia, il return on equity di un'impresa tenderà probabilmente a regredire verso un valore medio nel tempo. Se un settore ha un return on equity elevato, attirerà concorrenza, riducendo infine il return on equity."}, {"title": "Multistage Residual Income Valuation", "icon": "🪜", "content": "L'approccio **multistage** del residual income può essere usato per prevedere il residual income lungo un dato orizzonte temporale e poi calcolare un terminal value basato sul **continuing residual income** al termine di quel periodo. Il continuing residual income è il residual income successivo al periodo di previsione.\n\nNell'approccio del residual income model, il terminal value non costituisce una porzione ampia del valore intrinseco. Ciò è diverso dagli approcci multistage DDM e DCF.\n\nOccorre fare una delle seguenti assunzioni sul continuing residual income:\n\n• Il residual income prosegue indefinitamente a un livello positivo.\n• Il residual income è zero dall'anno terminale in poi.\n• Il residual income declina a zero man mano che il ROE regredisce verso il cost of equity nel tempo.\n• Il residual income riflette la regressione del ROE verso un certo livello medio."}, {"title": "Esempio: Multistage residual income model", "icon": "✏️", "content": "Un'impresa presenta le seguenti informazioni:\n\n• Valore contabile corrente per azione = $12\n• ROE = 16%\n• L'EPS atteso per gli anni 1-5 è calcolato come ROE per il valore contabile per azione di inizio periodo.\n• Dividend payout ratio = 25%\n• Tasso di rendimento richiesto sull'equity = 8%\n\na) Se il ROE scende all'8% dopo l'anno 5 e il continuing residual income scende a zero, il valore intrinseco dell'impresa si calcola come:\n\n| Anno | 1 | 2 | 3 | 4 | 5 | 6 |\n|---|---|---|---|---|---|---|\n| Valore contabile iniziale per azione | $12,00 | $13,44 | $15,05 | $16,85 | $18,87 | $21,14 |\n| Più: EPS \\((\\text{ROE} \\times B_{t-1})\\) | 1,92 | 2,15 | 2,40 | 2,70 | 3,02 | 3,38 |\n| Meno: Dividendi \\((25\\% \\times \\text{EPS})\\) | 0,48 | 0,54 | 0,60 | 0,68 | 0,75 | 0,85 |\n| **Valore contabile finale per azione** | **13,44** | **15,05** | **16,85** | **18,87** | **21,14** | **23,67** |\n| Utile per azione (EPS) | 1,92 | 2,15 | 2,40 | 2,70 | 3,02 | 3,38 |\n| Meno: Equity charge per azione \\((r \\times B_{t-1})\\) | 0,96 | 1,08 | 1,20 | 1,35 | 1,51 | 1,69 |\n| **Residual income per azione** | **0,96** | **1,07** | **1,20** | **1,35** | **1,51** | **1,69** |\n\n$$\\begin{aligned} \\text{Valore intrinseco} &= 12{,}00 + \\frac{0{,}96}{(1{,}08)^1} + \\frac{1{,}07}{(1{,}08)^2} + \\frac{1{,}20}{(1{,}08)^3} + \\frac{1{,}35}{(1{,}08)^4} + \\frac{1{,}51}{(1{,}08)^5} \\\\ &= \\$16{,}78 \\end{aligned}$$\n\nb) Assumendo che il continuing residual income rimanga costante al valore dell'anno cinque di $0,90 in futuro, il valore intrinseco si calcola come:\n\n$$\\begin{aligned} \\text{Terminal value} &= \\frac{0{,}90}{0{,}08} = 11{,}25 \\\\ \\text{Valore intrinseco} &= 12{,}00 + \\frac{0{,}96}{(1{,}08)^1} + \\frac{1{,}07}{(1{,}08)^2} + \\frac{1{,}20}{(1{,}08)^3} + \\frac{1{,}35}{(1{,}08)^4} \\\\ & \\quad + \\frac{1{,}51 + 11{,}25}{(1{,}08)^5} \\\\ &= \\$24{,}44 \\end{aligned}$$\n\nc) Assumendo che il ROE declini verso il rendimento richiesto sull'equity nel tempo, il valore intrinseco si calcola usando:\n\n$$V_0 = B_0 + \\sum_{t=1}^{T-1} \\frac{(E_t - rB_{t-1})}{(1+r)^t} + \\frac{E_T - rB_{T-1}}{(1+r-\\omega)(1+r)^{T-1}}$$\n\nDove: \\(\\omega\\) = Fattore di persistenza (**persistence factor**).\n\nUn persistence factor pari a 1 indica che il residual income non declinerà: rimarrà allo stesso livello indefinitamente. Un persistence factor pari a 0 indica che non vi sarà residual income dopo l'orizzonte di previsione iniziale. Maggiore è il persistence factor, maggiore è il flusso di residual income nella fase finale e maggiore è il valore dell'azione.\n\nAssumendo un persistence factor di 0,4, il terminal value alla fine dell'anno 5 si calcola come:\n\n$$\\begin{aligned} \\text{Terminal value} &= \\frac{1{,}69}{(1 + 0{,}08 - 0{,}4)} = 2{,}49 \\\\ \\text{Valore intrinseco} &= 12{,}00 + \\frac{0{,}96}{(1{,}08)^1} + \\frac{1{,}07}{(1{,}08)^2} + \\frac{1{,}20}{(1{,}08)^3} + \\frac{1{,}35}{(1{,}08)^4} \\\\ & \\quad + \\frac{1{,}51 + 2{,}49}{(1{,}08)^5} \\\\ &= \\$18{,}47 \\end{aligned}$$"}]}, "keyPoints": ["Continuing RI = RI dopo l'orizzonte esplicito", "Quattro ipotesi: positivo costante, zero, in declino, verso la media", "ω alto: payout basso, ROE storicamente persistente", "ω basso: ROE estremi, voci speciali, accrual alti"], "examTips": ["Trucco: tutto ciò che è \"anomalo\" (ROE estremo, special items, accrual) svanisce in fretta → ω basso"], "question": {"q": "Assuming a company has the following information:\n\n• Current book value per share = $40\n• Expected long-term ROE = 18%\n• Required rate of return on equity = 9%\n• Current market price = $95\n\nThe implied growth rate is closest to:", "options": ["2.5%.", "3.0%.", "2.0%."], "ans": 0, "exp": "$$\\begin{aligned} g &= r - \\left[\\frac{(\\text{ROE} - r) \\times B_0}{V_0 - B_0}\\right] \\\\ &= 0.09 - \\left[\\frac{(0.18 - 0.09) \\times 40}{85 - 40}\\right] \\\\ &= 2.5\\% \\end{aligned}$$"}}, {"id": "i", "code": "LOS 26i", "title": "Confrontare i residual income models con i dividend discount e i free cash flow models", "commandWord": "Confrontare", "importance": "MEDIUM", "content": {"introduction": "A differenza del residual income model, i modelli discounted dividend e free cash flow prevedono i flussi di cassa futuri e determinano il valore di un'azione attualizzandoli al presente usando il rendimento richiesto.\n\nI dividendi e il free cash flow to equity (FCFE) sono attualizzati al tasso di rendimento richiesto sull'equity (cost of equity), mentre il free cash flow to the firm (FCFF) è attualizzato al costo medio ponderato del capitale (WACC).\n\nIl valore intrinseco calcolato tramite il dividend discount model, i free cash flow model e il residual income model dovrebbe essere il medesimo.\n\nUna frazione significativa del valore attuale totale di un'azione nei modelli discounted dividend e free cash flow è rappresentata dal valore attuale del terminal value atteso. Allo stesso tempo, le valutazioni con residual income sono tipicamente meno sensibili alle stime del terminal value.", "sections": []}, "keyPoints": ["Stesso valore in teoria con DDM, FCF e RI", "DDM/FCF: valore dominato dal terminal value", "RI: valore dominato dal book value corrente"], "examTips": ["Il book value corrente NON si sconta: è già un valore di oggi"], "question": {"q": "Under the residual income model, which of the following most likely constitutes a large portion of a stock's present value?", "options": ["Present value of the terminal value.", "Book value.", "Present value of the current book value."], "ans": 1, "exp": "Under the residual income model, the book value constitutes a large portion of the present value of a stock's present value, unlike in the DDM and free cash flows models, in which the terminal values make up a significant portion of a stock's intrinsic value.\n\n**A is incorrect.** The present value of the terminal value makes up a large portion of the intrinsic value under both DDM and free cash flow models. This intrinsic value is highly sensitive to terminal value estimates.\n\n**C is incorrect.** The current book value is not discounted when computing a stock's present value."}}, {"id": "j", "code": "LOS 26j", "title": "Spiegare punti di forza e debolezza dei residual income models e giustificarne la scelta", "commandWord": "Spiegare", "importance": "HIGH", "content": {"introduction": "", "sections": [{"title": "Punti di forza", "icon": "👍", "content": "• Il terminal value non costituisce una porzione ampia del valore attuale totale rispetto agli altri modelli.\n• I residual income models utilizzano dati contabili facilmente disponibili.\n• I residual income models possono essere applicati a imprese che non pagano dividendi o che non hanno free cash flow positivi.\n• I modelli possono essere usati quando i flussi di cassa non sono prevedibili.\n• I modelli si concentrano sulla redditività economica."}, {"title": "Punti di debolezza", "icon": "👎", "content": "• I dati contabili su cui si basa il modello sono soggetti a manipolazione.\n• I dati contabili utilizzati possono richiedere rettifiche.\n• Il modello richiede che valga il **clean surplus**. Per calcolare gli utili in clean surplus, tutte le componenti che incidono sul valore contabile dell'equity dovrebbero essere incorporate negli utili e transitare dal conto economico. Se ciò non vale, occorre apportare rettifiche.\n• Il residual income model assume che il costo del capitale di debito sia adeguatamente riflesso dagli oneri finanziari (interest expense)."}, {"title": "Quando il residual income model è appropriato", "icon": "✅", "content": "Il residual income model è appropriato quando:\n\n• Un'impresa non paga dividendi o li paga in modo imprevedibile.\n• I free cash flow attesi di un'impresa sono negativi.\n• Vi è un grado significativo di incertezza nella previsione dei terminal value.\n\nIl residual income model è meno appropriato quando:\n\n• La contabilità in clean surplus non vale.\n• I determinanti del residual income, come valore contabile e ROE, non sono prevedibili.\n\nIl residual income model, proprio come i modelli discounted dividend e free cash flow, può essere usato anche per calcolare justified market multiple, come il price-to-earnings ratio (P/E) o il price-to-book ratio (P/B).\n\nIl residual income model può inoltre essere usato insieme ad altri modelli per valutare la coerenza dei risultati. Se si osserva un'ampia variazione del valore calcolato e ciascun modello appare appropriato, l'incoerenza può essere dovuta alle assunzioni utilizzate nei modelli."}]}, "keyPoints": ["Forza: TV pesa poco, dati contabili disponibili, ok senza dividendi/FCF", "Debolezza: manipolazione, rettifiche, clean surplus necessario", "Ideale con forte incertezza sul terminal value", "Inadatto se ROE e book value sono imprevedibili"], "examTips": ["Il clean surplus è una CONDIZIONE per usarlo, non il \"caso più adatto\": occhio alla formulazione"], "question": {"q": "The residual income approach is most appropriate when:", "options": ["determinants of residual income like book value and ROE are not predictable.", "there is a significant degree of doubt in forecasting terminal values.", "clean surplus accounting holds."], "ans": 1, "exp": "When there is a significant degree of doubt in forecasting terminal values, it would be most appropriate to use the residual income approach because the terminal value does not constitute a large portion of the intrinsic value.\n\n**A is incorrect.** When determinants of residual income like book value and ROE are not predictable, the residual income approach would not be appropriate because these two are significant components of the residual income model.\n\n**C is incorrect.** The residual income approach is appropriate when clean surplus holds, i.e., when all items that affect the book value of equity are included in earnings and flow in the income statement. If this is not the case, an analyst would be required to adjust or use a different valuation model of adjustments if they cannot adjust."}}, {"id": "k", "code": "LOS 26k", "title": "Descrivere i problemi contabili nell'applicazione dei residual income models", "commandWord": "Descrivere", "importance": "MEDIUM", "content": {"introduction": "Vi sono due principali driver del residual income: ROE e valore contabile. Nell'applicazione del residual income model, occorre considerare i seguenti problemi contabili:\n\n• Violazioni della relazione di clean surplus.\n• Rettifiche di bilancio per il fair value.\n• Attività immateriali (intangible assets).\n• Voci non ricorrenti.\n• Pratiche contabili aggressive.\n• Considerazioni internazionali.", "sections": [{"title": "Violazioni della relazione di clean surplus", "icon": "🧹", "content": "La contabilità in clean surplus deve valere affinché un analista possa usare il residual income model, cioè:\n\n$$\\text{Valore contabile finale} = \\text{Valore contabile iniziale} + \\text{Utile netto} - \\text{Dividendi}$$\n\nLa relazione di clean surplus è violata se utili o perdite — come le variazioni non realizzate del fair value di alcuni strumenti finanziari, gli aggiustamenti da conversione di valuta estera, certi aggiustamenti pensionistici — aggirano il conto economico e vengono imputati direttamente a patrimonio netto. Quando la relazione di clean surplus non vale, l'utile netto deve essere rettificato per tener conto di queste voci."}, {"title": "Rettifiche di bilancio per il fair value", "icon": "🔧", "content": "Le attività e passività fuori bilancio (off-balance sheet) devono essere rettificate affinché l'analista disponga di una misura appropriata del valore contabile. Inoltre, le attività e passività iscritte dovrebbero essere rettificate al fair value ove possibile. Altre voci che richiedono rettifiche includono inventario, attività e passività fiscali differite e attività immateriali.\n\nI prospetti finanziari e le note devono essere esaminati per individuare voci specifiche dell'impresa."}, {"title": "Attività immateriali", "icon": "💡", "content": "È appropriato includere nel calcolo del valore contabile gli immateriali identificabili che possono essere separati dall'entità e venduti. Se questi asset hanno vita utile finita, saranno ammortizzati nel tempo. Le attività immateriali, tuttavia, richiedono una considerazione particolare, perché spesso non vengono riconosciute come asset a meno che non siano acquisite in un'operazione di acquisizione.\n\nLa spesa in ricerca e sviluppo (R&S) è un tipo di attività immateriale da considerare. Se un'impresa si impegna in spese di R&S improduttive, il residual income sarà più basso. Se un'impresa si impegna in spese di R&S produttive, i ricavi saranno più elevati e compenseranno le spese nel tempo. Per un'impresa matura, il ROE dovrebbe riflettere la produttività delle spese di R&S senza richiedere una rettifica."}, {"title": "Voci non ricorrenti", "icon": "🎲", "content": "Il residual income dovrebbe essere previsto sulla base di voci ricorrenti. In assenza di rettifiche degli utili, il residual income futuro potrebbe risultare sovrastimato o sottostimato. Le voci che possono richiedere rettifiche includono voci straordinarie, oneri di ristrutturazione, attività operative cessate (discontinued operations) e cambiamenti di principio contabile. L'analista dovrebbe valutare se queste voci sono destinate a continuare e a contribuire al residual income. In caso contrario, dovrebbero essere rimosse dagli utili operativi nella previsione del residual income."}, {"title": "Pratiche contabili aggressive", "icon": "🚩", "content": "Le imprese possono adottare pratiche contabili che comportano la sovrastima di attività o utili, come l'accelerazione dei ricavi o il differimento delle spese. Per esempio, un'impresa potrebbe capitalizzare anziché spesare un pagamento per cassa, ottenendo spese inferiori e attività maggiori.\n\nUn analista deve valutare attentamente le politiche contabili di un'impresa e considerare l'integrità del management nel valutare gli input di un residual income model."}, {"title": "Considerazioni internazionali", "icon": "🌐", "content": "I principi contabili differiscono a livello globale, il che comporta misure differenti di valore contabile e utili. Vi sono tre considerazioni chiave nell'applicazione internazionale di un residual income model:\n\n• La disponibilità di previsioni di utili affidabili.\n• Violazioni sistematiche dell'assunzione di clean surplus.\n• Regole contabili che comportano un'identificazione ritardata delle variazioni di valore."}]}, "keyPoints": ["Clean surplus: book finale = iniziale + NI − dividendi", "OCI (fair value, FX, pensioni) viola il clean surplus", "Immateriali identificabili e separabili nel book value", "Previsioni su voci ricorrenti", "Pratiche aggressive e differenze internazionali"], "examTips": ["Le voci RICORRENTI non sono un problema: lo sono quelle NON ricorrenti"], "question": {"q": "Which of the following would least likely be considered an accounting issue when using the residual income model?", "options": ["International considerations.", "Intangible assets.", "Recurring items."], "ans": 2, "exp": "Recurring items are not considered an issue when using the residual income approach. It is only a problem when a company has nonrecurring items in its financial reports that would need to be deducted from its earnings to arrive at recurring earnings.\n\n**A is incorrect.** International considerations are items to consider when using the residual income approach. This includes accounting rules and the availability of data.\n\n**B is incorrect.** Intangible assets are an issue to consider when using the residual income approach. Identifiable intangibles that can be split from the entity and sold should be included in the computation of book value."}}, {"id": "l", "code": "LOS 26l", "title": "Valutare se un'azione è sopravvalutata, correttamente valutata o sottovalutata in base a un residual income model", "commandWord": "Valutare", "importance": "MEDIUM", "content": {"introduction": "I driver fondamentali del residual income possono essere individuati assumendo una crescita costante di dividendi e utili.\n\nAssumendo crescita costante, il valore intrinseco di un'azione secondo il residual income model può essere espresso come:\n\n$$V_0 = B_0 + \\frac{\\text{ROE} - r}{r - g} B_0$$\n\nSe il return on equity è uguale al rendimento richiesto sull'equity, il valore intrinseco dell'azione sarà pari al valore contabile. Se il return on equity è maggiore del rendimento richiesto sull'equity, il valore intrinseco dell'azione sarà superiore al valore contabile e il justified P/B ratio sarà maggiore di 1. Se il return on equity è minore del rendimento richiesto sull'equity, il valore intrinseco dell'azione sarà inferiore al valore contabile e il justified P/B ratio sarà minore di 1.", "sections": []}, "keyPoints": ["Calcola V0 con il RI model e confrontalo col prezzo", "Oppure confronta P/B di mercato e P/B giustificato", "Prezzo > valore → sopravvalutata"], "examTips": ["Scorciatoia: P/B giustificato = 1 + (ROE − r)/(r − g)"], "question": {"q": "Which of the following is least likely a fundamental driver of residual income?", "options": ["Constant growth in earnings.", "Constant growth in revenues.", "Constant growth in dividends."], "ans": 1, "exp": "Constant growth in revenues is not a fundamental driver of residual income.\n\n**A is incorrect.** Constant growth in earnings is a fundamental driver of residual income.\n\n**C is incorrect.** Constant growth in revenues is a fundamental driver of residual income."}}]}, {"id": "ev-r27", "number": 27, "title": "Private Company Valuation", "estimatedTime": "4-5 ore", "totalLOS": 9, "los": [{"id": "a", "code": "LOS 27a", "title": "Confrontare le caratteristiche di società pubbliche e private rilevanti per la valutazione", "commandWord": "Confrontare", "importance": "HIGH", "content": {"introduction": "", "sections": [{"title": "Fattori specifici della società (company-specific)", "icon": "🏢", "content": "1. **Stadio nel ciclo di vita.** Le società private si trovano di solito in una fase iniziale di sviluppo, mentre le società pubbliche sono normalmente avanzate nel loro ciclo di vita. Le società private hanno meno dipendenti e attività più ridotte, ma possono anche essere società rilevanti, stabili, oppure società fallite in liquidazione. Lo stadio del ciclo di vita influenza il processo di valutazione.\n\n2. **Dimensione.** Si misura dal conto economico o dallo stato patrimoniale. Le società private tendono ad avere dimensioni più piccole. La dimensione minore aumenta i livelli di rischio e i premi per il rischio nella stima dei rendimenti richiesti. La piccola dimensione delle società private riduce il loro accesso al capitale per finanziare la crescita delle operazioni. Tuttavia, il costo di operare come società pubblica, inclusi i costi di compliance, può superare i vantaggi di finanziamento che le società pubbliche possono avere.\n\n3. **Sovrapposizione tra azionisti e management.** Molte società private hanno il top management che detiene il controllo della proprietà. Questo attenua i problemi di agenzia. Le società private non subiscono pressioni da parte di investitori esterni per risultati di breve termine; pertanto, le loro decisioni hanno una prospettiva di più lungo termine.\n\n4. **Qualità/profondità del management.** Le società private hanno una qualità e profondità del management inferiori, poiché hanno meno probabilità di attrarre manager altamente qualificati rispetto alle società pubbliche.\n\n5. **Qualità dell'informazione finanziaria.** Le società pubbliche sono tenute a fornire tempestiva informativa finanziaria e di altro tipo. Gli analisti pongono inoltre richieste al management per informazioni di alta qualità. La minore richiesta posta sulle società private quanto a disclosure dell'informazione finanziaria aumenta il rischio e porta a una valutazione relativamente più bassa.\n\n6. **Pressione dagli investitori di breve termine.** Il top management delle società pubbliche subisce pressioni da investitori e analisti per intraprendere azioni che raggiungano le aspettative di breve termine. Il management delle società private non subisce pressioni analoghe e, pertanto, le sue azioni assumono una prospettiva di più lungo termine.\n\n7. **Aspetti fiscali.** Ridurre il reddito imponibile dichiarato e i pagamenti d'imposta societaria può essere un obiettivo più importante per le società private che per quelle pubbliche, per via del maggior beneficio per i proprietari."}, {"title": "Fattori specifici del titolo (stock-specific)", "icon": "📃", "content": "1. **Liquidità delle quote di partecipazione nell'impresa.** Le azioni di società private sono di norma meno liquide e hanno meno azionisti rispetto alle società pubbliche. Questo riduce il valore delle azioni nelle società private rispetto a quelle pubbliche.\n\n2. **Concentrazione del controllo.** Il controllo delle società private è spesso concentrato in pochi investitori, il che può portare a transazioni con entità in cross-ownership a prezzi superiori a quelli di mercato, a vantaggio dei proprietari di maggioranza a scapito degli azionisti di minoranza.\n\n3. **Potenziali accordi che limitano la liquidità.** Le società private possono avere patti parasociali (shareholder agreements) che limitano la possibilità di vendere le azioni. Questi accordi possono ridurre la marketability delle azioni della società privata.\n\nI fattori stock-specific sono negativi per la valutazione di una società privata, mentre i fattori company-specific sono potenzialmente positivi o negativi."}]}, "keyPoints": ["Company-specific: ciclo di vita, dimensione, agenzia, management, informativa, breve termine, fisco", "Stock-specific: liquidità, concentrazione del controllo, patti parasociali", "Stock-specific → sempre negativi per il valore", "Company-specific → positivi o negativi"], "examTips": ["Trucco: \"STOCK\" = cose che riguardano l'AZIONE (vendibilità, controllo, patti); il resto è \"company\""], "question": {"q": "Which of the following is *least likely* a stock-specific difference between public and private companies?", "options": ["Concentration of control.", "Potential agreements restricting liquidity.", "Stage in lifecycle."], "ans": 2, "exp": "The stage in the lifecycle is a company-specific difference between public and private companies. Private companies are usually at the early stage of development while public companies are normally advanced in their lifecycle.\n\n**A is incorrect.** The concentration of control is a stock-specific difference between public and private companies. Private companies have control concentrated on a few investors compared to public companies.\n\n**B is incorrect.** Potential agreements restricting liquidity are a stock-specific factor differentiating public and private companies. Private companies may have shareholder agreements that restrict the ability to sell shares."}}, {"id": "b", "code": "LOS 27b", "title": "Descrivere gli usi della valutazione di società private ed esplicitare le applicazioni di maggior interesse per l'analista", "commandWord": "Descrivere", "importance": "MEDIUM", "content": {"introduction": "Le ragioni per cui si effettuano valutazioni di società private si categorizzano in:\n\n1. Legate a transazioni (transaction related).\n2. Legate alla compliance (compliance related).\n3. Legate al contenzioso (litigation related).", "sections": [{"title": "1. Valutazione legata a transazioni", "icon": "🤝", "content": "Le transazioni sono eventi che incidono sulla proprietà o sul finanziamento di un'impresa. Le transazioni di società private includono:\n\n• **Finanziamento di venture capital.** Le società in fase iniziale e le società di venture capital spesso si assicurano investitori in equity attraverso molteplici round di finanziamento collegati a milestone aziendali significative. In caso di elevata incertezza sui flussi di cassa futuri, valutazioni informali guidano le negoziazioni tra la società e i potenziali investitori.\n• **Finanziamento privato (private financing).** Gli investitori tipicamente investono attraverso molteplici round di finanziamento legati al raggiungimento di milestone critiche. Le valutazioni sono effettuate per determinare il livello di investimento richiesto per una quota di equity in una società privata. Per via dell'incertezza sui flussi di cassa della società privata, le valutazioni sono spesso informali e basate su negoziazioni.\n• **Finanziamento tramite debito (debt financing).** Le società private e i finanziatori possono condurre valutazioni per stimare la capacità della società di usare i flussi di cassa operativi esistenti per rimborsare il debito o assumere ulteriore debito per finalità quali ristrutturazione, espansione o acquisizioni.\n• **Initial Public Offering (IPO).** Le banche d'investimento preparano valutazioni nell'ambito del processo di IPO. La valutazione in sede di IPO dipende fortemente dalle proiezioni di crescita futura della società.\n• **Acquisizione.** Sia il target sia l'acquirente possono effettuare valutazioni legate all'acquisizione. Le società più piccole possono essere vendute con l'assistenza di un business broker, mentre per le società più grandi si ricorre alle banche d'investimento.\n• **Fallimento (bankruptcy).** La valutazione di un'impresa e dei suoi asset sottostanti in regime di protezione fallimentare può aiutare a stabilire se una società valga di più come going concern o in liquidazione.\n• **Pagamenti basati su azioni (compensation).** I pagamenti basati su azioni, inclusi grant di stock option e grant di restricted stock, hanno implicazioni contabili e fiscali per l'emittente e per il dipendente. Tali pagamenti forniscono un incentivo al miglioramento della performance dei dipendenti."}, {"title": "2. Valutazione legata alla compliance", "icon": "📜", "content": "La compliance comprende le azioni richieste dalla legge. La rendicontazione finanziaria e quella fiscale sono i due principali focus di questo tipo di valutazione.\n\n• **Rendicontazione finanziaria.** L'impairment dell'avviamento (goodwill) è un'importante applicazione della valutazione. Le componenti di società pubbliche sono valutate usando tecniche di valutazione di società private. Per le società private, i grant di stock option richiederanno frequentemente valutazioni.\n• **Rendicontazione fiscale.** Le ragioni fiscali per le valutazioni includono la rendicontazione fiscale societaria e individuale. Alcune attività societarie come ristrutturazione, transfer pricing e imposta patrimoniale possono richiedere una valutazione della società."}, {"title": "3. Valutazione legata al contenzioso", "icon": "⚖️", "content": "Procedimenti legali come richieste di danni, controversie tra azionisti, richieste per mancati profitti (lost profit) e divorzi richiedono valutazioni. Ciascuna delle tre aree richiede competenze e conoscenze specialistiche, e le transazioni coinvolgono di norma investment banker. Le valutazioni di compliance sono svolte da professionisti con conoscenze fiscali o contabili."}, {"title": "Aree di focus nella valutazione di società private", "icon": "🔒", "content": "Quando si valutano società private con il metodo FCFF discounted cash flow, gli analisti devono affrontare tre rettifiche cruciali:\n\n1. **Rettifiche di flussi di cassa e utili**: le differenze tra società private e pubbliche richiedono rettifiche di stato patrimoniale e conto economico per stimare gli utili normalizzati, incidendo sul numeratore della valutazione.\n2. **Rettifica di tassi di sconto e rendimento richiesto**: le società private spesso necessitano di assunzioni diverse per attualizzare i flussi di cassa futuri, per via dell'assenza di prezzi di mercato osservabili per debito ed equity. Questo incide sul denominatore della valutazione.\n3. **Valutazione di sconti/premi**: le rettifiche specifiche delle società private dovrebbero considerare i fattori stock-specific relativi a vantaggi o svantaggi di controllo, riflettendo l'impatto di illiquidità e interessi di minoranza nella valutazione."}]}, "keyPoints": ["Transazioni: VC, private financing, debito, IPO, M&A, fallimento, stock option", "Compliance: financial reporting (goodwill impairment) e fisco", "Contenzioso: danni, liti tra soci, lost profit, divorzi", "Tre rettifiche: utili normalizzati, tasso di sconto, sconti/premi"], "examTips": ["Il financial reporting (impairment del goodwill) è COMPLIANCE, non transazione"], "question": {"q": "Which of the following is *least likely* a transaction-related reason for valuing private companies?", "options": ["Bankruptcy.", "Acquisition.", "Financial reporting."], "ans": 2, "exp": "Financial reporting is a compliance-related valuation reason. This is particularly important when testing for impairment of goodwill.\n\n**A is incorrect.** Bankruptcy is a transaction-related valuation reason. This is when a company is not expected to continue being in operations in the future, and the value of its underlying assets need to be valued.\n\n**B is incorrect.** Acquisitions are transaction-related valuation reasons. These valuations are done by the target and the acquirer. This can be done with the help of investment banks"}}, {"id": "c", "code": "LOS 27c", "title": "Spiegare i problemi di stima dei flussi di cassa delle società private e le rettifiche per stimare gli utili normalizzati", "commandWord": "Spiegare", "importance": "HIGH", "content": {"introduction": "Le valutazioni di società private possono richiedere rettifiche per stimare gli **utili normalizzati** della società, poiché gli utili dichiarati riflettono spese discrezionali. Ciò genera differenze tra utili dichiarati e utili normalizzati. Gli utili normalizzati sono i benefici economici rettificati per voci non ricorrenti, non economiche o altrimenti inusuali, al fine di eliminare le anomalie e facilitare i confronti.\n\n$$\\text{Utili normalizzati} = \\text{Utili dichiarati} + \\text{Rettifiche (per voci non ricorrenti, non economiche e inusuali)}$$\n\nGli utili delle società private vengono rettificati per numerose ragioni:\n\n• L'effetto delle transazioni tra la società privata e i proprietari e/o le loro società.\n• Compensi superiori al mercato o altre spese che riducono il reddito imponibile e l'onere fiscale. Anche i familiari possono essere inclusi come dipendenti.\n• Per le società private che dichiarano perdite, le spese possono essere sottostimate, con il reddito dichiarato dell'entità sovrastimato.\n• Spese personali possono essere incluse come spese della società privata. Anche l'uso di veicoli aziendali per uso personale può richiedere rettifiche.\n• I prestiti ad azionisti/top management meritano una verifica.\n• Gli immobili usati dalla società privata richiedono una verifica. Quando la società privata possiede immobili, alcuni analisti possono rimuovere dal conto economico ricavi e costi associati agli immobili. Il valore dell'immobile rappresenterebbe un'attività non operativa (non-operating asset) della società. Queste rettifiche sono necessarie per via delle diverse aspettative di rischio e crescita tra operazioni d'impresa e immobili.\n• I prospetti finanziari delle società private sono soggetti a review anziché a revisione (audit), come avviene per le società pubbliche. I prospetti soggetti a review forniscono una lettera di opinione con dichiarazioni e assicurazioni da parte del contabile revisore che sono inferiori a quelle dei prospetti soggetti ad audit.\n\nSenza queste rettifiche sulla performance finanziaria dichiarata, la società privata potrebbe essere valutata in modo errato.", "sections": [{"title": "Problemi di stima dei flussi di cassa per le società private", "icon": "🌫️", "content": "La stima dei flussi di cassa per le società private solleva sfide importanti, come la natura dell'interessenza oggetto di valutazione, le potenziali incertezze sulle operazioni future e il coinvolgimento del management nelle previsioni.\n\nL'interessenza in equity oggetto di valutazione e la finalità prevista della valutazione sono fondamentali per determinare la definizione di valore appropriata per una specifica valutazione. Le assunzioni possono differire quando si valuta un'interessenza azionaria di minoranza rispetto al totale dell'equity dell'impresa.\n\nMolte società in fase di sviluppo e alcune società mature sono soggette a incertezze significative riguardo a operazioni e flussi di cassa futuri. Una possibile soluzione consiste nel proiettare i diversi scenari futuri possibili, inclusi initial public offering, acquisizione, continuazione dell'attività come società privata o fallimento. Il tasso di sconto dovrebbe riflettere il rischio dei flussi di cassa proiettati in quello scenario. Deve essere stimata anche la probabilità di accadimento di ciascuno scenario. La stima complessiva del valore di una società è la media ponderata per le probabilità dei valori dei suoi scenari stimati.\n\nI manager delle società private hanno più informazioni sull'impresa rispetto agli esterni. Quando si valuta usando le previsioni del management, gli analisti dovrebbero essere consapevoli dei potenziali bias manageriali, come la sovrastima dei valori in caso di test di impairment dell'avviamento, la sottostima dei valori in caso di grant di incentive stock option, e i fabbisogni di capitale.\n\nIl processo di stima di FCFF e FCFE è simile per società private e pubbliche.\n\n$$\\begin{aligned} \\text{FCFF} &= \\text{Reddito operativo al netto delle imposte} + \\text{Ammortamenti} \\\\ & \\quad - \\text{Capital expenditures} - \\text{Incremento del capitale circolante} \\\\ \\text{FCFE} &= \\text{FCFF} - \\text{Oneri finanziari al netto delle imposte} + \\text{Net borrowing} \\end{aligned}$$\n\nIl FCFF è preferito quando ci si attende che la società subisca variazioni significative di capitale, perché il WACC è meno sensibile del cost of equity alle variazioni della leva finanziaria."}]}, "keyPoints": ["Utili normalizzati = dichiarati + rettifiche", "Rettifiche: compensi, spese personali, parenti, prestiti ai soci, immobili", "Scenari multipli ponderati per probabilità", "Attenzione ai bias del management", "FCFF preferito se cambia la leva"], "examTips": ["Trucco: tutto ciò che \"non sopravvivrebbe a un nuovo proprietario\" va normalizzato"], "question": {"q": "Which of the following is *least likely* a reason for adjusting a private company's earnings when performing valuations?", "options": ["The effect of transactions between the company and its owners.", "Personal expenses of shareholders being paid by the company.", "Audited financial statements."], "ans": 2, "exp": "Audited financial statements are the least likely reason for adjusting a private company's earnings, as private companies are not required to provide audited financial statements. Their financial statements are reviewed.\n\n**A is incorrect.** The effect of transactions between the company and its owners are items to consider when estimating a private company's normalized earnings as these are not expected to persist once the company is acquired.\n\n**B is incorrect.** Personal expenses of shareholders being paid by the company need to be deducted from the company's earnings as these are not expected to persist into the future once the firm is acquired."}}, {"id": "d", "code": "LOS 27d", "title": "Spiegare i fattori che richiedono una rettifica nella stima del tasso di sconto per le società private", "commandWord": "Spiegare", "importance": "HIGH", "content": {"introduction": "Sfide nella stima di un tasso di rendimento richiesto:\n\n• **Premio per la dimensione (size premium).** Quando si valutano società private, si usano size premium nello sviluppo dei requisiti di rendimento dell'equity. Stimare un premio usando piccole società pubbliche può avere un bias verso l'alto, poiché molte di esse stanno attraversando difficoltà finanziarie.\n• **Uso del CAPM.** Le piccole società con scarse prospettive di quotazione o di acquisizione da parte di una società pubblica potrebbero non essere comparabili alle società pubbliche per cui sono disponibili stime di beta basate su dati di mercato.\n• **CAPM ampliato (expanded CAPM).** L'expanded CAPM aggiunge un premio per la piccola dimensione e per il rischio specifico della società quando si valutano società private.\n• **Elementi del build-up approach.** Il build-up approach può essere usato quando non vi sono società pubbliche comparabili. È simile all'extended CAPM ma esclude l'applicazione del beta all'equity risk premium.\n• **Disponibilità relativa di debito e costo del debito.** La stima della capacità di debito di una società privata è un'altra sfida, poiché la società può avere meno accesso al capitale di debito rispetto alle società pubbliche, il che può richiederle di fare più affidamento sul finanziamento tramite equity. La dimensione minore di una società privata può inoltre aumentare il costo del debito.\n• **Tassi di sconto in un contesto di acquisizione.** In un'acquisizione, il costo del capitale dovrebbe essere quello del target e non dell'acquirente, anche se ci si attenderebbe che una società pubblica matura abbia un tasso di sconto più basso rispetto a una società privata più rischiosa.\n• **Rettifiche del tasso di sconto per il rischio di proiezione.** La disponibilità di informazioni limitate sulle società private rispetto alle pubbliche introduce incertezza e porta a tassi di sconto più elevati. Le proiezioni fatte dai manager possono essere eccessivamente ottimistiche o pessimistiche.", "sections": []}, "keyPoints": ["Size premium (rischio di bias verso l'alto)", "CAPM spesso inadatto; expanded CAPM e build-up", "Meno accesso al debito, costo del debito più alto", "Acquisizione → tasso del TARGET", "Rischio di proiezione → tasso più alto"], "examTips": ["In un'acquisizione il tasso segue il RISCHIO DEI FLUSSI, cioè quelli del target"], "question": {"q": "Which of the following is *least likely* a challenge when estimating the required rate of return?", "options": ["Application of size premium.", "Target's discount rate.", "Easy access to debt."], "ans": 2, "exp": "Compared to public companies, private companies have less access to debt capital and will therefore require more equity financing.\n\n**A is incorrect.** Application of size premium is a challenge when estimating the required rate of return. They are required in developing equity return requirements due to private companies' relatively smaller size.\n\n**B is incorrect.** The discount rate that should be used to value the target company should be the one associated with the risks of the target's cash flows."}}, {"id": "e", "code": "LOS 27e", "title": "Confrontare i modelli per stimare il rendimento richiesto sull'equity di una privata (CAPM, expanded CAPM, build-up)", "commandWord": "Confrontare", "importance": "VERY HIGH", "content": {"introduction": "", "sections": [{"title": "Il CAPM", "icon": "📐", "content": "$$\\begin{aligned} \\text{Rendimento richiesto sull'equity} &= \\text{Risk-free rate} \\\\ & \\quad + (\\text{Beta} \\times \\text{Market risk premium}) \\end{aligned}$$\n\nIl CAPM è generalmente inappropriato per le entità private."}, {"title": "Expanded CAPM", "icon": "➕", "content": "$$\\begin{aligned} \\text{Rendimento richiesto sull'equity} &= \\text{Risk-free rate} + (\\text{Beta} \\times \\text{Market risk premium}) \\\\ & \\quad + \\text{Small stock premium} \\\\ & \\quad + \\text{Company-specific risk premium} \\end{aligned}$$"}, {"title": "Build-Up Approach", "icon": "🧱", "content": "$$\\begin{aligned} \\text{Rendimento richiesto sull'equity} &= \\text{Risk-free rate} + \\text{Equity risk premium} \\\\ & \\quad + \\text{Small stock premium} \\\\ & \\quad + \\text{Company-specific risk premium} \\\\ & \\quad + \\text{Industry risk premium} \\end{aligned}$$\n\nIl build-up approach è spesso usato quando non sono disponibili guideline public companies."}, {"title": "Esempio: Confronto tra modelli di rendimento richiesto", "icon": "✏️", "content": "Si considerino le seguenti informazioni:\n\n| | |\n|---|---|\n| Risk-free rate | 1,25% |\n| Equity risk premium | 7,50% |\n| Beta | 1,875 |\n| Small stock premium | 5,00% |\n| Company-specific risk premium | 1,88% |\n| Industry risk premium | 1,50% |\n\n**CAPM**\n\n$$\\begin{aligned} R_E &= 1{,}25\\% + 1{,}875 \\times 7{,}50\\% \\\\ &= 15{,}31\\% \\end{aligned}$$\n\n**Expanded CAPM**\n\n$$\\begin{aligned} R_E &= 1{,}25\\% + (1{,}875 \\times 7{,}50\\%) + 5\\% + 1{,}88\\% \\\\ &= 22{,}19\\% \\end{aligned}$$\n\n**Build-up Approach**\n\n$$\\begin{aligned} R_E &= 1{,}25\\% + 7{,}50\\% + 5\\% + 1{,}88\\% + 1{,}50\\% \\\\ &= 17{,}13\\% \\end{aligned}$$"}]}, "keyPoints": ["CAPM: Rf + β × ERP", "Expanded: + small stock + company-specific", "Build-up: niente beta, + industry risk premium", "Build-up quando mancano comparabili quotati"], "examTips": ["Trucco: il build-up \"costruisce\" il tasso a mattoni senza beta, quindi aggiunge il premio di SETTORE al suo posto"], "question": null}, {"id": "f", "code": "LOS 27f", "title": "Spiegare e valutare gli effetti di sconti e premi basati su controllo e marketability", "commandWord": "Spiegare", "importance": "VERY HIGH", "content": {"introduction": "Le valutazioni di società pubbliche si basano su uno scambio di azioni liquido, mentre le valutazioni di società private si rettificano per il controllo e per lo scambio di azioni limitato. Il valore più elevato proviene da un acquirente strategico con potenziale di sinergie e disponibilità ad assumersi il rischio di esecuzione. Gli acquirenti finanziari possono pagare un premio per il controllo ma possono mancare di sinergie o competenze. L'equity di minoranza commerciabile (marketable non-controlling) corrisponde ai prezzi di mercato pubblici. Gli sconti per controllo e marketability sono discussi più avanti, con variazioni basate sul contesto, sulla comparabilità dei dati, sulla dimensione della partecipazione, sui fattori legali e altro. Il timing conta, poiché le società private che mirano a IPO o vendite strategiche hanno sconti più bassi, mentre quelle senza dividendi o prospettive di liquidità ne hanno di più alti. Rettifiche per controllo e/o marketability sono spesso incluse nelle valutazioni di interessenze in società private.", "sections": [{"title": "Discount For Lack of Control (DLOC)", "icon": "🎮", "content": "Lo **sconto per mancanza di controllo** è una riduzione del valore delle azioni di una società dovuta al fatto che un azionista non è in grado di esercitare il proprio controllo sulla società. È necessario per valutare interessenze azionarie di minoranza (non-controlling) in società private se il valore del totale equity è stato sviluppato su base di interessenza di controllo.\n\nPer una società privata, lo sconto è più alto quando la società non ha pagato dividendi e non ha probabilità di quotarsi. Per contro, lo sconto è più basso quando una società privata punta a un'IPO e quando si tratta di una vendita strategica.\n\n$$\\text{DLOC} = 1 - \\left[\\frac{1}{1 + \\text{Control premium}}\\right]$$"}, {"title": "Esempio: DLOC", "icon": "✏️", "content": "Se il control premium è del 15%, allora:\n\n$$\\text{DLOC} = 1 - \\left[\\frac{1}{1{,}15}\\right] = 13\\%$$\n\nL'applicazione del DLOC varia:\n\n• Se l'investitore valuta la società da una prospettiva non di controllo (non-controlling), allora il DLOC va applicato.\n• Se l'investitore valuta la società da una prospettiva di controllo, allora il DLOC non va applicato."}, {"title": "Lack of Marketability Discounts (DLOM)", "icon": "🔐", "content": "Uno **sconto per mancanza di marketability** è la percentuale dedotta dal valore di un'interessenza di proprietà per riflettere la relativa assenza di un mercato pronto per le azioni di una società rispetto alle società quotate. Si applica alla valutazione di interessenze azionarie di minoranza (non-controlling) in società private.\n\n**Fattori che aumentano il DLOM**\n\n• Restrizione alla vendita delle azioni.\n• Restrizioni alla trasferibilità.\n• Rischio più elevato.\n• Maggiore incertezza del valore.\n• Concentrazione della proprietà.\n\n**Fattori che riducono il DLOM**\n\n• Elevate prospettive di liquidità.\n• Pagamenti di dividendi.\n• Ampio bacino di potenziali acquirenti.\n• Durata dell'asset.\n\nIl valore dell'interessenza in equity si calcola poi come:\n\n$$\\begin{aligned} \\text{Valore stimato dell'interessenza in equity} &= \\text{Valore pro-rata dell'interessenza in equity} \\\\ & \\quad \\times (1 - \\text{Control discount}) \\\\ & \\quad \\times (1 - \\text{Marketability discount}) \\end{aligned}$$"}, {"title": "Esempio: Calcolo del valore stimato dell'interessenza in equity", "icon": "✏️", "content": "Dati un DLOC del 15% e un DLOM dell'11%:\n\n$$\\begin{aligned} \\text{Sconto totale} &= 1 - [(1 - \\text{DLOC})(1 - \\text{DLOM})] \\\\ &= 1 - [(1 - 0{,}15)(1 - 0{,}11)] \\\\ &= 0{,}243 \\\\ &= 24{,}3\\% \\end{aligned}$$"}]}, "keyPoints": ["DLOC = 1 − 1/(1 + control premium)", "DLOC solo da prospettiva di minoranza", "DLOM per illiquidità: ↑ con restrizioni e rischio, ↓ con dividendi e liquidità", "Sconto totale = 1 − (1 − DLOC)(1 − DLOM)"], "examTips": ["Errore n.1: sommare DLOC e DLOM (15% + 11% = 26%) invece di moltiplicare i complementi (24.3%)", "Errore n.2: DLOC = control premium. No: DLOC = 1 − 1/(1 + CP)"], "question": {"q": "For a company with a discount for lack control is 8% and a discount for lack of marketability of 9%, the total discount is *closest to:*", "options": ["16.28%.", "17%.", "17.14%"], "ans": 0, "exp": "$$\\begin{aligned} \\text{Total discount} &= 1 - (1 - 0.08)(1 - 0.09) \\\\ &= 0.1628 \\\\ &= 16.28\\% \\end{aligned}$$"}}, {"id": "g", "code": "LOS 27g", "title": "Spiegare gli approcci income, market e asset-based alla valutazione di una privata e i fattori per sceglierli", "commandWord": "Spiegare", "importance": "VERY HIGH", "content": {"introduction": "Vi sono tre principali approcci alla valutazione:\n\n1. **Approccio income (reddituale):** valuta un asset come valore attuale scontato del suo reddito atteso.\n2. **Approccio market (di mercato):** valuta un asset sulla base di multipli di prezzo da vendite di asset ritenuti simili all'asset oggetto di valutazione. I multipli possono basarsi sul prezzo dell'azione o su una misura del valore totale della società.\n3. **Approccio asset-based (patrimoniale):** valuta una società privata sulla base dei valori delle attività sottostanti dell'entità meno il valore di eventuali passività correlate. I modelli asset-based e discounted cash flow sono classificati come modelli di valutazione assoluta, mentre l'approccio market-based è un modello di valutazione relativa.\n\nGli analisti selezionano l'approccio in funzione dei seguenti fattori:\n\n• **Natura delle operazioni e stadio nel ciclo di vita.** Nelle prime fasi di sviluppo, una società può essere valutata al meglio usando un approccio asset-based, perché la premessa di going-concern del valore può essere incerta e i flussi di cassa futuri possono essere difficili da prevedere. Durante la fase di crescita, una società può essere valutata usando l'approccio income, simile al metodo del free cash flow. Una società stabile e matura può essere valutata usando l'approccio market.\n• **Dimensione della società.** I multipli di società pubbliche potrebbero non essere appropriati per società private piccole con prospettive di crescita molto limitate. I confronti con società pubbliche non sono una buona base di valutazione per una società privata se le prospettive di rischio e crescita differiscono in misura rilevante.\n\nLe società pubbliche e private possono essere composte da varie attività operative e non operative. Le attività non operative, come cassa in eccesso e saldi di investimento, non sono necessarie per le operazioni della società. Il valore di una società è la somma del valore delle attività operative e non operative.", "sections": [{"title": "Approccio Income", "icon": "💧", "content": "**Vi sono tre forme di approccio income:**"}, {"title": "Free Cash Flow Method (Discounted Cash Flow Method)", "icon": "💧", "content": "Questo metodo valuta un asset sulla base di stime dei flussi di cassa futuri per diversi anni, fino a quando ci si attende che i flussi di cassa si stabilizzino. Un terminal value è attualizzato a un tasso di sconto che riflette i rischi associati a questi flussi di cassa.\n\nLa stima del terminal value comporta la capitalizzazione del flusso di cassa finale stimato usando un tasso di crescita sostenibile di lungo periodo o multipli di prezzo che dovrebbero anch'essi assumere flussi di cassa sostenibili.\n\n**Formula:**\n\n$$\\begin{aligned} \\text{Valore dell'impresa} &= \\text{Valore attuale dei flussi di cassa futuri attesi} \\\\ & \\quad + \\text{Valore attuale del terminal value} \\end{aligned}$$"}, {"title": "Esempio: Stima del valore di un'impresa con l'approccio FCF", "icon": "✏️", "content": "Le seguenti informazioni si riferiscono a ABC Ltd.\n\n| | |\n|---|---|\n| Net profit margin | 15% |\n| Vendite nell'Anno 0 | $8m |\n| Investimento in capitale fisso nell'Anno 0 | $3m |\n| Ammortamenti nell'Anno 0 | $4m |\n| Investimento in capitale circolante come percentuale delle vendite | 5,5% |\n| Aliquota fiscale | 30% |\n| Oneri finanziari sul valore nominale del debito di $5m nell'Anno 0 | 10% |\n| WACC durante la fase di alta crescita | 15% |\n| WACC durante la fase matura | 12% |\n| Tasso di crescita per i prossimi due anni | 8% |\n| Tasso di crescita costante di lungo periodo | 3% |\n\nDeterminare il valore dell'impresa.\n\n**Soluzione**\n\n| Anno | 0 | 1 | 2 |\n|---|---|---|---|\n| Vendite | 8,00 | 8,64 | 9,33 |\n| Net income | 1,20 | 1,30 | 1,40 |\n| Più Ammortamenti | 4,00 | 4,32 | 4,67 |\n| Più Oneri finanziari al netto delle imposte | 0,35 | 0,38 | 0,41 |\n| Meno Investimento in capitale fisso | 3 | 3,24 | 3,50 |\n| Meno Investimento in capitale circolante | 0,44 | 0,48 | 0,51 |\n| **FCFF** | **2,11** | **2,28** | **2,46** |\n\n**Terminal value alla fine dell'anno 2 (fine della fase 1)**\n\nQuindi, usando il constant growth model:\n\n$$\\begin{aligned} \\text{Terminal value}_T &= \\text{FCFF}_T \\times \\frac{(1+g)}{(\\text{WACC} - g)} \\\\ \\text{Terminal value}_5 &= 2{,}46 \\times \\frac{1{,}03}{(0{,}12 - 0{,}03)} = \\$28{,}15 \\\\ \\text{Valore dell'impresa} &= \\frac{2{,}28}{1{,}15} + \\frac{(2{,}46 + 28{,}15)}{1{,}15^2} = \\$25{,}13 \\end{aligned}$$"}, {"title": "Capitalized Cash Flow Method", "icon": "🏦", "content": "Questo metodo stima il valore di una società privata sulla base del valore di una rendita perpetua crescente. È simile al modello single-stage del free cash flow. È appropriato per società private senza proiezioni e con aspettativa di operazioni future stabili. Il free cash flow method è più appropriato per società il cui tasso di crescita ci si attende cambi in misura significativa.\n\nLa formula per il capitalized cash flow è:\n\n$$V_f = \\frac{\\text{FCFF}_1}{(\\text{WACC} - g_f)}$$\n\nDove:\n\n\\(V_f\\) = valore dell'impresa.\n\\(\\text{FCFF}_1\\) = Free cash flow to the firm per i prossimi dodici mesi.\n\\(\\text{WACC}\\) = Weighted average cost of capital.\n\\(g_f\\) = Tasso di crescita sostenibile del FCFF.\n\nIl denominatore dell'equazione precedente, \\((\\text{WACC} - g_f)\\), è noto come **capitalization rate**.\n\nIl valore dell'equity può essere calcolato deducendo il valore di mercato del debito.\n\n$$V_e = V_f - \\text{Valore di mercato del debito}$$\n\nIl capitalized cash flow method può anche essere usato per valutare direttamente l'equity.\n\n$$V_e = \\frac{\\text{FCFE}_1}{(r - g)}$$\n\nDove: \\(r\\) = Rendimento richiesto sull'equity. \\(g\\) = Tasso di crescita sostenibile del FCFE."}, {"title": "Esempio: Calcolo del valore dell'impresa con il Capitalized Cash Flow Model", "icon": "✏️", "content": "Si supponga che il free cash flow to the firm di una società sia stato di $30 milioni nel periodo precedente e ci si attenda cresca del 3,5% annuo. Il WACC è stimato al 12%. Dato che il valore di mercato del suo debito è di $60 milioni, il valore dell'impresa e dell'equity si calcolano come:\n\n**Soluzione**\n\n$$\\begin{aligned} \\text{Valore dell'impresa} &= \\frac{\\text{FCFE}_1}{(\\text{WACC} - g)} = \\frac{30(1{,}035)}{0{,}12 - 0{,}035} = 365{,}29 \\text{ milioni} \\\\ \\text{Valore dell'equity} &= 365{,}29\\text{m} - 60\\text{m} = 305{,}29\\text{m} \\end{aligned}$$"}, {"title": "Residual Income (Excess Earnings) Method", "icon": "📗", "content": "Questo metodo stima il valore di tutte le attività immateriali dell'impresa capitalizzando gli utili futuri eccedenti i requisiti di rendimento stimati associati al capitale circolante e alle immobilizzazioni.\n\n$$\\text{Residual income (RI)} = \\text{Utili normalizzati} - \\text{Rendimento sul capitale circolante} - \\text{Rendimento sulle immobilizzazioni}$$\n\nE\n\nValore delle attività immateriali: \\(V_{\\text{intangible}} = \\frac{RI_0(1+g)}{(r_{\\text{intangible}} - g)}\\)\n\nValore dell'impresa: \\(V_{\\text{firm}} = V_{\\text{intangible}} + \\text{Capitale circolante} + \\text{Immobilizzazioni}\\)"}, {"title": "Esempio: Stima del valore dell'impresa con l'Excess Earnings Method", "icon": "✏️", "content": "Si considerino le seguenti informazioni:\n\n| | |\n|---|---|\n| Capitale circolante | 45.000 |\n| Immobilizzazioni | 180.000 |\n| Utili normalizzati (anno appena concluso) | 21.150 |\n| Rendimento richiesto per il capitale circolante | 3% |\n| Rendimento richiesto per le immobilizzazioni | 8% |\n| Tasso di crescita del residual income | 2,5% |\n| Tasso di sconto per le attività immateriali | 18% |\n\nIl valore dell'impresa è *più prossimo a:*\n\n**Soluzione**\n\n$$\\begin{aligned} \\text{Rendimento sul capitale circolante} &= 3\\% \\times \\$45.000 = \\$1.350 \\\\ \\text{Rendimento sulle immobilizzazioni} &= 8\\% \\times \\$180.000 = \\$14.400 \\\\ \\text{Residual Income} &= \\$21.150 - \\$1.350 - \\$14.400 = \\$5.400 \\end{aligned}$$\n\nValore delle attività immateriali:\n\n$$\\begin{aligned} V_{\\text{intangible}} &= \\frac{RI_0(1+g)}{(r_{\\text{intangible}} - g)} \\\\ \\text{Valore delle attività immateriali} &= \\frac{\\$5400 \\times 1{,}025}{0{,}18 - 0{,}025} = \\$35.710 \\end{aligned}$$\n\nValore dell'impresa:\n\n$$\\begin{aligned} V_{\\text{firm}} &= V_{\\text{intangible}} + \\text{Capitale circolante} + \\text{Immobilizzazioni} \\\\ &= \\$35.710 + \\$45.000 + \\$180.000 = \\$260.710 \\end{aligned}$$"}, {"title": "Approccio Market-Based", "icon": "🔗", "content": "L'approccio market usa confronti diretti con società pubbliche per stimare il fair value di un'interessenza in equity in una società privata. Le tre principali varianti sono:\n\n1. Il guideline public company method (GPCM).\n2. Il guideline transactions method (GTM).\n3. Il prior transaction method (PTM).\n\nL'approccio market è preferito agli approcci income e asset perché usa transazioni di mercato effettive.\n\nI fattori per identificare le guideline companies sono simili per società pubbliche e private. I fattori chiave includono l'appartenenza al settore, la forma delle operazioni, i trend e lo stato operativo corrente.\n\nL'analisi di società pubbliche e private può differire nelle metriche finanziarie usate nel processo di valutazione. I rapporti price-to-earnings sono frequentemente usati nella valutazione di società pubbliche, mentre i multipli EBITDA/EBIT sono usati nella valutazione di società private mature di maggiori dimensioni. L'EBITDA è confrontato al meglio con il **market value of invested capital (MVIC)**, che è il valore di mercato di debito ed equity. I multipli sul net income sono comunemente usati per società private più piccole, mentre i multipli sui ricavi sono usati per le piccole società private."}, {"title": "Guideline Public Company Method", "icon": "🏛️", "content": "Il valore di una società privata si basa sui multipli osservati dall'attività di trading delle azioni di società pubbliche comparabili. Questi multipli sono rettificati per le differenze di rischio e crescita della società privata.\n\nIl vantaggio principale è l'ampio bacino di guideline companies e di informazioni disponibili. Gli svantaggi includono possibili problemi di comparabilità e soggettività nelle rettifiche per rischio e crescita applicate al multiplo di prezzo.\n\nI control premium sono usati nella valutazione di interessenze di controllo. Un **control premium** è un importo o una percentuale di cui il valore pro-rata di un'interessenza di controllo eccede il valore pro-rata di un'interessenza non di controllo in una società. Un control premium è aggiunto al valore dell'interessenza di controllo calcolato con il GPCM.\n\n**Fattori da considerare nella valutazione dei multipli di prezzo**\n\n• **Tipo di transazione.** Le transazioni possono essere finanziarie o strategiche. Una transazione strategica coinvolge un acquirente che beneficerebbe di sinergie acquisendo la società target. Una transazione finanziaria coinvolge un acquirente che non si attende sinergie dall'acquisizione del target. I control premium sono più alti per le transazioni strategiche rispetto a quelle finanziarie.\n• **Fattori settoriali.** Si assume che i settori che stanno vivendo acquisizioni riflettano già un control premium nei loro prezzi, per via della probabilità di acquisizione.\n• **Forma del corrispettivo.** Una transazione con scambio di azioni potrebbe non essere appropriata per misurare i control premium, perché il management tipicamente preferisce usare azioni nelle acquisizioni quando ritiene che le proprie azioni siano sopravvalutate."}, {"title": "Esempio: Valore della società privata usando i multipli di prezzo", "icon": "✏️", "content": "Sono state raccolte le seguenti informazioni su società pubbliche comparabili a una società privata oggetto di valutazione:\n\n• Il MVIC/EBITDA delle società pubbliche comparabili è 5.\n• È richiesta una rettifica al ribasso del 15% sul MVIC/EBITDA medio delle società pubbliche per riflettere il rischio e la crescita della società privata.\n• L'EBITDA normalizzato della società privata è di $12 milioni e il valore di mercato del debito è di $7 milioni.\n\nIl valore della società privata e del suo equity si calcolano come:\n\n$$\\begin{aligned} \\text{MVIC/EBITDA rettificato} &= 5 \\times (1 - 0{,}15) = 4{,}25 \\\\ \\text{Valore dell'impresa} &= 4{,}25 \\times 12\\text{m} = 51\\text{m} \\\\ \\text{Valore dell'equity} &= 51\\text{m} - 7\\text{m} = 44\\text{m} \\end{aligned}$$"}, {"title": "Guideline Transactions Method (GTM)", "icon": "🤝", "content": "Il valore si basa su multipli di prezzo derivati dall'acquisizione di società pubbliche o private comparabili. Il GTM usa un multiplo relativo alla vendita di intere società. I dati sulle transazioni sono raccolti da documenti pubblici. I multipli da transazione sono i più appropriati per valutare un'interessenza di controllo in una società privata.\n\n**Fattori da considerare nell'uso di multipli di prezzo basati su transazioni:**\n\n• **Sinergie:** il prezzo di acquisizioni strategiche comparabili può includere rettifiche per sinergie attese.\n• **Corrispettivi contingenti (contingent considerations):** potenziali pagamenti futuri al venditore subordinati al raggiungimento di determinate milestone, come un EBITDA obiettivo. L'inclusione di corrispettivi contingenti negli accordi di acquisizione riflette l'incertezza sulla performance finanziaria futura.\n• **Corrispettivo non in contanti (noncash consideration):** le acquisizioni possono includere azioni nel corrispettivo. Il valore equivalente in contanti di un grande blocco di azioni può creare incertezza riguardo al prezzo della transazione.\n• **Disponibilità di transazioni:** le transazioni significative per una specifica società privata possono essere limitate.\n• **Variazioni tra la data della transazione e la data di valutazione:** anche il periodo tra la data della transazione comparabile e la data di valutazione dovrebbe essere considerato, poiché numerose variazioni possono essere intervenute tra le due date."}, {"title": "Esempio: Guideline Transactions Method", "icon": "✏️", "content": "Sono state raccolte le seguenti informazioni su transazioni che coinvolgono società pubbliche comparabili a una società privata oggetto di valutazione:\n\n• I multipli MVIC/EBITDA da recenti acquisizioni di società private nel settore sono 7.\n• Il rischio complessivo e le opportunità di crescita delle società acquisite sono simili a quelli della società privata.\n\nSe l'EBITDA della società privata è di $13 milioni e il valore di mercato del suo debito è di $13 milioni, il valore dell'impresa e del suo equity si calcolano come:\n\n$$\\begin{aligned} \\text{Valore dell'impresa} &= 7 \\times 13 = 91\\text{m} \\\\ \\text{Valore dell'equity} &= 91\\text{m} - 13\\text{m} = 78\\text{m} \\end{aligned}$$"}, {"title": "Prior Transaction Method", "icon": "🕰️", "content": "Si basa su transazioni effettive sulle azioni della società privata oggetto di valutazione. È più rilevante quando si determina il valore di un'interessenza di minoranza in una società.\n\nIl vantaggio di questo approccio è che fornisce il valore più significativo, in quanto basato su transazioni effettive sulle azioni della società. Per contro, è un approccio meno affidabile in caso di transazioni poco frequenti."}]}, "keyPoints": ["Asset-based → fasi iniziali; income → crescita; market → maturità", "FCF method, capitalized cash flow, excess earnings", "Excess earnings → valore degli immateriali", "GPCM + control premium; GTM per il controllo; PTM per la minoranza", "EBITDA ↔ MVIC"], "examTips": ["Trucco: GTM = transazioni di intere società → già \"di controllo\"; GPCM = prezzi di borsa → di minoranza, serve il premio", "Capitalization rate = WACC − g"], "question": {"q": "For a company with the following information:\n\n• Working capital = $23,000\n• Fixed assets = $85,000\n• Normalized earnings for the previous period = $90,000\n• The required rate of return for working capital assets and fixed assets is 6% and 11%, respectively.\n• Residual income is expected to grow at 6%, and the discount rate of intangible assets is 10%.\n\nThe value of the firm is closest to:", "options": ["$2,208,655.", "$2,802,655.", "$2,028,655."], "ans": 0, "exp": "$$\\begin{aligned} \\text{Working capital required return} &= \\$23{,}000 \\times 0.06 = \\$1{,}380 \\\\ \\text{Fixed assets required return} &= \\$85{,}000 \\times 0.11 = \\$9{,}350 \\\\ \\text{Residual income} &= \\$90{,}000 - \\$1{,}380 - \\$9{,}350 = \\$79{,}270 \\\\ \\text{Value of intangible assets} &= \\frac{\\$79{,}270 \\times 1.06}{0.10 - 0.06} = \\$2{,}100{,}655 \\\\ \\text{Value of the firm} &= \\$2{,}100{,}655 + \\$23{,}000 + \\$85{,}000 = \\$2{,}208{,}655 \\end{aligned}$$"}}, {"id": "h", "code": "LOS 27h", "title": "Calcolare il valore di una società privata con i metodi income-based", "commandWord": "Calcolare", "importance": "VERY HIGH", "content": {"introduction": "Nelle sezioni precedenti abbiamo discusso la rettifica dei parametri di valutazione per le società private, inclusi la normalizzazione del reddito e le variazioni del tasso di rendimento richiesto. Dopo aver determinato il valore dell'impresa, controllo e marketability, possono essere applicati premi o sconti in base alla prospettiva e agli obiettivi del valutatore. Ora ci concentriamo sulla conduzione di una valutazione di società privata usando l'approccio income e queste rettifiche.\n\n1. Stimare il FCFF top-down dalle informazioni della società:\n\n$$\\begin{aligned} \\text{FCFF} &= \\text{EBIT}(1 - \\text{Aliquota fiscale}) + \\text{Ammortamenti}(\\text{Aliquota fiscale}) \\\\ & \\quad - \\Delta\\text{Attività a lungo termine} - \\Delta\\text{Capitale circolante} \\end{aligned}$$\n\n2. Calcolare il WACC dai comparabili pubblici.\n3. Stimare il tasso di crescita \\(g\\) in base al profilo della società.\n4. Risolvere per l'enterprise value (EV) usando il modello DCF:\n\n$$EV_t = \\sum_{i=1}^{n} \\frac{\\text{FCFF}_{t+i}}{(1+\\text{WACC})^i} + \\frac{\\frac{\\text{FCFF}_{t+n+1}}{(\\text{WACC} - g)}}{(1+\\text{WACC})^n}$$\n\n5. Aggiungere premio/sconto per fattori di liquidità o controllo.\n\nIllustriamo questo con un esempio.", "sections": [{"title": "Esempio 1: Vickers Prinsloo", "icon": "✏️", "content": "Claudia Jean possiede il 100% delle azioni di SereniTea LTD ed è anche la CEO. SereniTea LTD produce una linea di tè verde cinese alle erbe. Vickers Prinsloo, un analista di private equity, è stato incaricato della valutazione d'acquisto di SereniTea LTD per conto di un cliente. Di seguito le note che Prinsloo ha preso durante la sua valutazione.\n\n1. Il compenso di Jean per l'anno è stato di $600.000. Prinsloo ritiene che sia in linea con il compenso medio di settore per il CEO.\n2. SereniTea LTD aveva un saldo di debito di $2.560.000 con un tasso di interesse del 6,0%, inferiore al livello di debito ideale per la società. L'onere finanziario dichiarato non rappresentava accuratamente il costo ottimale. Prinsloo suggerisce di usare una misura di utili che escluda interamente gli oneri finanziari, principalmente il reddito operativo al netto delle imposte, per valutare meglio SereniTea LTD.\n3. SereniTea LTD ha avuto una capital expenditure di $980.000, che ha incrementato il capitale circolante di $450.000.\n\nPrinsloo usa il seguente conto economico per calcolare il reddito operativo.\n\n**Exhibit 1: SereniTea Income Statement**\n\n| | $'000 |\n|---|---|\n| Sales revenue | 25.000 |\n| Purchases | 15.000 |\n| Gross profit | 10.000 |\n| Operating expenses | 2.000 |\n| EBITDA | 8.000 |\n| Depreciation and amortization | 500 |\n| EBIT | 7.500 |\n| Tax (20%) | 1.500 |\n| Operating income after tax | 6.000 |\n\nProcede inoltre a calcolare i tassi di sconto per SereniTea LTD, con i risultati riepilogati di seguito.\n\n**Exhibit 2: SereniTea Discount Rates**\n\n| Variabile calcolata | Approccio | Risultato |\n|---|---|---|\n| Required return on equity | Build-up approach | 10,2% |\n| Required return on equity | CAPM | 7,4% |\n| Required return on equity | Expanded CAPM | 11,3% |\n| WACC | Usando il debt ratio effettivo | 10,2% |\n| WACC | Usando il rapporto ottimale | 9,6% |\n\nPer stimare la valutazione di SereniTea usando l'approccio income, Prinsloo segue questi passaggi:"}, {"title": "Step 1: Stimare il WACC", "icon": "🪜", "content": "Poiché il build-up approach ha dato un rendimento richiesto sull'equity del 10,2% e l'expanded CAPM ha dato l'11,3%, Prinsloo usa la media dei due, 10,75%, come parte del calcolo del WACC. Arriva a una stima del WACC diversa, pari a 9,9%, per i debt ratio."}, {"title": "Step 2: Sviluppare una stima del FCFF dell'anno base", "icon": "🪜", "content": "Usando le informazioni del conto economico, il FCFF sarà:\n\n$$\\begin{aligned} \\text{FCFF} &= \\text{EBIT}(1 - \\text{Aliquota fiscale}) + \\text{Ammortamenti}(\\text{Aliquota fiscale}) \\\\ & \\quad - \\Delta\\text{Attività a lungo termine} - \\Delta\\text{Capitale circolante} \\\\ \\text{FCFF} &= 7.500.000 \\times (1 - 0{,}2) + 500.000 \\times 0{,}2 - 980.000 - 450.000 \\\\ \\text{FCFF} &= \\$5.570.000 \\end{aligned}$$"}, {"title": "Step 3: Stimare l'EV usando una previsione del FCFF e un terminal value atteso", "icon": "🪜", "content": "Prinsloo crea una previsione quinquennale dei ricavi basata sui trend di settore attesi. Un caso downside di crescita del FCFF del 3% per i prossimi cinque anni, un caso base del 5% e un caso ottimistico del 7%. Un tasso di crescita perpetuo atteso del 2% è usato per calcolare il terminal value. Tutti i risultati sono riepilogati di seguito:\n\n**Exhibit 3: SereniTea FCFF and Terminal Value Forecasts ($)**\n\n| Anno | Downside (3%) | Base (5%) | Optimistic (7%) |\n|---|---|---|---|\n| Anno base | 5.570.000 | 5.570.000 | 5.570.000 |\n| 1 | 5.737.100 | 5.848.500 | 5.959.900 |\n| 2 | 5.909.213 | 6.140.925 | 6.377.093 |\n| 3 | 6.086.489 | 6.447.971 | 6.823.590 |\n| 4 | 6.269.084 | 6.770.370 | 7.301.134 |\n| 5 | 6.457.157 | 7.108.888 | 7.812.213 |\n| Terminal value | 84.188.244 | 94.485.224 | 105.810.988 |\n\nIl FCFF dell'anno 5 per il caso base si calcola come segue:\n\n$$\\text{FCFF(Base)}_5 = \\text{FCFF}_0(1 + 0{,}05)^5 = \\$7.108.888$$\n\nIl terminal value del caso base si calcola come segue:\n\n$$\\text{Terminal Value (Base)} = \\text{FCFF(Base)}_5 \\times \\frac{(1 + 0{,}05)}{(0{,}099 - 0{,}02)}$$\n\n$$\\text{Terminal Value (Base)} = \\frac{\\$7.64.332{,}4}{0{,}079} = 94.485.224$$\n\nL'equity value e l'enterprise value dell'impresa sono mostrati di seguito.\n\n**Exhibit 4: Equity and Enterprise Value Estimates ($)**\n\n| Case | Downside | Base | Optimistic |\n|---|---|---|---|\n| **Equity value** | 75.535.864,17 | 83.274.310,88 | 91.721.191,84 |\n| **EV** | 78.095.864,17 | 85.834.310,88 | 94.281.191,84 |\n\nSereniTea aveva un debito in essere di $2.560.000. Deduciamo il debito dalla stima dell'enterprise value per ottenere l'equity value."}, {"title": "Step 4: Applicare sconti/premi appropriati per completare la valutazione", "icon": "🪜", "content": "Dopo aver calcolato l'equity value, Prinsloo conclude di dover tenere conto dello status di società privata di SereniTea LTD scontando le stime per la mancanza di marketability. Dopo un'analisi approfondita, conclude che un DLOM del 10% sarà appropriato per SereniTea LTD. La tabella seguente mostra l'intervallo di valore stimato per SereniTea dopo lo sconto per mancanza di marketability.\n\n**Exhibit 5: SereniTea Non-Marketable Equity Value Estimates ($)**\n\n| | Downside | Base | Optimistic |\n|---|---|---|---|\n| Equity value meno DLOM | 67.982.277,76 | 74.946.879,79 | 82.549.072,66 |"}]}, "keyPoints": ["FCFF = EBIT(1 − t) + Dep × t − ΔLTA − ΔWC", "Costo equity da build-up / expanded CAPM, poi WACC", "Scenari di crescita → range di valori", "EV − debito = equity, poi DLOM/DLOC"], "examTips": ["Se la struttura del capitale attuale non è quella ottimale, ragiona prima degli oneri finanziari (FCFF e WACC \"ottimale\")", "Il risultato di una privata è spesso un RANGE di valori, non un numero"], "question": null}, {"id": "i", "code": "LOS 27i", "title": "Calcolare il valore di una società privata con i metodi del market approach e descriverne vantaggi e svantaggi", "commandWord": "Calcolare", "importance": "VERY HIGH", "content": {"introduction": "Gli analisti spesso tentano di calcolare il valore di società private facendo riferimento a multipli market-based derivati dalle azioni di società pubbliche comparabili. Questo approccio è preferito al metodo di valutazione income-based discusso in precedenza. Mentre, in alcuni casi, questi multipli sono modificati per tenere conto delle variazioni di rischio e potenziale di crescita relativi, in altri casi si utilizzano più gruppi di società comparabili per rispecchiare le diversificate attività di un'impresa privata. Impieghiamo questo metodo quando conduciamo una valutazione di società privata usando un approccio market-based, come illustrato di seguito.\n\n**Step 1: Scegliere i comparabili pubblici e ponderarli per corrispondere alla società privata.**\n\n**Step 2: Raccogliere e riepilogare i multipli delle società pubbliche comparabili.**\n\nEV/EBITDA, EV/EBITA, EV/EBIT, EV/sales ed EV/FCFF.\n\n**Step 3: Stimare l'enterprise value della società privata a partire dai multipli.**\n\n$$\\begin{aligned} EV_t &= \\sum_{w=1}^{n} w_i \\left(\\frac{EV_i}{\\text{Sales}_i}(\\text{Vendite della società privata})\\right): \\\\ w_i &= \\frac{\\text{Vendite della linea di business}}{\\text{Vendite totali}} \\end{aligned}$$\n\n**Step 4: Scontare il valore stimato per illiquidità o proprietà di minoranza.**\n\nIllustriamo questo con un esempio.", "sections": [{"title": "Esempio 2: Valutazione con l'approccio market", "icon": "✏️", "content": "Georgina Dolci è stata incaricata di analizzare il valore di un'interessenza di minoranza non di controllo in North Rift Ltd, una società privata statunitense le cui azioni non sono quotate. Dolci stima che il valore non rettificato di North Rift sia di $900 milioni e stima il control premium al 10%. La società è ben nota nel settore della logistica ma si è espansa nei mercati delle consegne di pacchi e a domicilio negli ultimi anni. Molti dei loro veicoli di flotta nei mercati emergenti di pacchi e consegne a domicilio sono elettrici, per ridurre le emissioni come società e per conformarsi agli standard ambientali del settore.\n\n**Exhibit 1: North Rift Ltd Financial Data ($ millions)**\n\n| Linea di business | Ricavi | Attività | EBITDA |\n|---|---|---|---|\n| Logistic service | 800 | 1400 | 200 |\n| Parcel | 160 | 550 | 20 |\n| Home delivery | 40 | 50 | -10 |\n| Total | 1000 | 2000 | 210 |\n\n**Exhibit 2: North Rift Ltd Comparable multiples**\n\n| Linea di business | EV/EBITDA | EV/Sales |\n|---|---|---|\n| Logistic service | 9,4 | 3,6 |\n| Parcel | 8,9 | 2,1 |\n| Home delivery | 21,3 | 7,4 |\n\nPer determinare l'interessenza di minoranza con l'approccio market, Dolci seguirà questi passaggi:"}, {"title": "Step 1: Identificare società pubbliche comparabili per ciascuna linea di business", "icon": "🪜", "content": "**Exhibit 3: North Rift Ltd Financial Data (% of total)**\n\n| Linea di business | Ricavi | Attività | EBITDA |\n|---|---|---|---|\n| Logistic service | 80% | 70% | 95,24% |\n| Parcel | 16% | 27,5% | 9,52% |\n| Home delivery | 4% | 2,5% | -4,76% |"}, {"title": "Step 2: Raccogliere e riepilogare i multipli delle società pubbliche comparabili", "icon": "🪜", "content": "**Exhibit 4: North Rift Ltd Comparable multiples**\n\n| Linea di business | EV/EBITDA | EV/Sales |\n|---|---|---|\n| Logistic service | 9,4 | 3,6 |\n| Parcel | 8,9 | 2,1 |\n| Home delivery | 21,3 | 7,4 |\n| Composite | 8,786 | 3,512 |\n\n$$\\begin{aligned} \\text{Composite EV/EBITDA} &= \\left(\\frac{200}{210}\\right) \\times 9{,}4 + \\left(\\frac{20}{210}\\right) \\times 8{,}9 + \\left(\\frac{(-10)}{210}\\right) \\times 21{,}3 \\\\ &= 8{,}9524 + 0{,}8476 - 1{,}0143 = 8{,}786 \\\\ \\text{Composite EV/Sales} &= \\left(\\frac{800}{1000}\\right) \\times 3{,}6 + \\left(\\frac{160}{1000}\\right) \\times 2{,}1 + \\left(\\frac{40}{1000}\\right) \\times 7{,}4 \\\\ &= 2{,}88 + 0{,}336 + 0{,}296 = 3{,}512 \\end{aligned}$$"}, {"title": "Step 3: Usare i multipli per derivare una stima iniziale del valore", "icon": "🪜", "content": "Dolci deriva stime preliminari del valore per North Rift con il seguente calcolo.\n\n$$EV_{\\text{EV/Sales}} = 3{,}512 \\times \\$1.000.000.000 = \\$3.512.000.000$$\n\nSono necessarie ulteriori rettifiche perché la stima si basa su comparabili di società pubbliche. Dolci deve moltiplicare i ricavi di North Rift per i singoli multipli EV/Sales di ciascuna linea di business. I risultati sono i seguenti:\n\n**Exhibit 5: North Rift Valuation by Segment Based on EV/Sales**\n\n| Linea di business | EV/Sales | Ricavi ($ millions) | Valore stand-alone ($ million) |\n|---|---|---|---|\n| Logistic services | 3,6 | 800 | 2.880 |\n| Parcel | 2,1 | 160 | 336 |\n| Home delivery | 7,4 | 40 | 296 |\n| Total | | | 3.512 |\n\nSebbene il totale della valutazione per segmento sia lo stesso, ciascuno dei tre termini può essere interpretato come stima del valore di una società pubblica.\n\n$$EV_{\\text{EV/EBITDA}} = 8{,}786 \\times \\$210.000.000 = \\$1.845.060.000$$"}, {"title": "Step 4: Applicare sconti/premi appropriati per completare la valutazione", "icon": "🪜", "content": "Dai risultati derivati nello step 3, Dolci dovrà rettificare il valore di North Rift per riflettere la prospettiva di un azionista non commerciabile e non di controllo. Per il DLOM, Dolci stima 15% e 10% rispettivamente, il che risulterà in uno sconto totale del 25%. Dolci procede quindi a rettificare ciascuna delle sue stime di valore come segue:\n\n$$\\begin{aligned} EV_{\\text{EV/Sales}} &= \\$3.512.000.000 \\times (1 - 15\\%) = \\$2.985.200.000 \\\\ EV_{\\text{EV/EBITDA}} &= \\$1.845.060.000 \\times (1 - 10\\%) = \\$1.660.554.000 \\end{aligned}$$\n\nFacendo la media dei due risultati market-based, Dolci può derivare una stima di valutazione unica:\n\n$$\\frac{(\\$2.985.200.000 + 1.660.554.000)}{2} = \\$2.322.877.000$$"}]}, "keyPoints": ["Pondera i comparabili come le linee di business della privata", "EV/Sales composito = Σ peso ricavi × multiplo", "EV/EBITDA composito: pesi = quote di EBITDA (anche negative)", "Applica DLOC/DLOM per la quota di minoranza", "Media di più stime per un valore unico"], "examTips": ["Con EBITDA negativo di una linea il peso diventa negativo: è per questo che spesso si preferisce EV/Sales", "I comparabili quotati sono già \"di minoranza commerciabile\": occhio a non scontare due volte"], "question": null}]}]};
CFA_CURRICULUM.portfolioManagement = {"id": "portfolioManagement", "name": "Portfolio Management", "icon": "data:image/webp;base64,UklGRlA7AABXRUJQVlA4WAoAAAAQAAAAvwAAvwAAQUxQSAMEAAABoEZtkyHJ+jIjr23btm3btm3btm3btm3btiYi8vsxatyO67sRMQH4KzRlKaVIhy2lSE6/B0lKQgdPRXJb5ZIBYPhpl93miDMuv+XWWzrmrbdcfuaR2y433fAAkEtuFxEAoy9/zENfsGN/+cjxK44JIEtqvSQAxt789u/Y3VTVOqyqGrv/cNdW4wKQ1GICYOHLvidpapUdu5oayR+vWiwB0ko5Q1Z/hKRZZcevpiSfWGcg5NwyBVjmcdKtMojVnHxmRaC0Rk6Y/DrSnKF0I2+ZGim3gAA7/UB3htONP++RIU0rGOc20hhSI++ZAKVJBYt+Qq0MalV+sTQkNSEJtqw0BtbIHSGpYUlwMN0ZWncehZwalATHUyuDW5VnQFJjCo6lMsBdPB2lIQX7URniLh6G0oCCDag1RuziVij9EsyhVhnkanV+SD9yHuF9OsPs9dPRUu5bwdVUBtp4C6RPgnWoDLVyM0gfch7lS/dYVf9urJR7E5xNZbCNl0J6EUzvxnAb54D0lHELQ3Yfcg+C2egMuHMBSE9X0yJmvBUZQMbEv9UaMVabChkoOITKkCuPQ0FKg7xFj5nzoyGQBAvQGXTnUigFJ1CjpvUsFMir9Kg53xkEmMwrw17rdMC61LgpNwdOjt25wAO0uDmfwJDvs8at8rMRJvklcqROMx9DX7nk6vTIOTfYPHbGXXanxe7Qg6J39AD/DfDfAP8N8N//Q9o1egdvRo/djqvGzrne3Ax95aIT/sQaOHZNMfg79LhVfjwM7qbFzfkIcCw1bsrTgdVokdsAGL+LNWzVp0BKz9Gj5nytoOBwatSUJ6IIZqNHzbkABKm8RI+Z861BUkLB7tSYKQ9EATLG/KnWiNX66wTIAATnUiNmvAKCbmkq84h5nbknCC6hxct4PQQ95jTxr16jVU2nTr1AcAQ1WsqTIeg15aHfqx4rr5+MkHNvECxJjZVyZQj6WnAaNVLKC1DQ5ySDPU+Lk/G1oXLqGzIm+756lKr/PC0y+itYilZjVJUro6D/BZtSa4SqcnsUNLJgV2qNT1Xui4LGFuxG8+hU434oaHTBFqTFxskdUFLDULD899TIKH9eDQXNLJj2RZpHpRpfmwkFzS0Y+hxSY6LkRcOjoNkZWPUD0uJhlZ+sAwianwQjn2ysVkNhznrG6JCElhRgputIqkehKsmbZgcErZoEmOeqLtLVO5+rk3bd/IAktHDOwJRHvEOyqnntVNVNK8n3jpkWyBktLhkYYqmz3mb3atqBrbL7u+csMxSQBW2YBcCgM2932YvfsUN//9IVO8w6OADJaNMkgu6jzrjsFnsdc/IpnfTYvbdcbubREgCIJLRzkiLo4FIk4XcwJZHSgUVSwl+hAFZQOCAmNwAAkJIAnQEqwADAAD49FohDIiEhGHw28CADxLYAW31Z/2/ifyP/Lv5E6f/S/65+bP7R/4/9J8iuf/qXyNvMv1P/W/3n/G/9z/G///6ef4r/Z+xr81/7j/D/AF+n/+a/tP+L/6P+P///zVfs57wv2v9RP87/tn/Q/xP73fLp/rv+h/l/c5/bP8j/wf8v8AP9J/vH/g9sH/l///3Jv8J/0P/p7hv9C/xX/h9nr/i/t58Hn9R/2v7ff8v5Ff6P/gP/B+fXyAf/f1AP/F6gG+58TP2X5Fea/4182/hv7t+3n9z9yT+58MXWXmX/L/wJ+r/vv7pfmj83/9L7ZPVf8w/gf91+af5M/YR+Pf0H/H/3L90f8b8dvbLw/rZf7X1FPcj6f/mP8N+7X969UXWn8H/7r8rfoF/Vz/Wfm760//U8wz79/xf+D7g38z/uv/O/yn5k/TP/W/+b/Sf6D9tfdt+e/4j/v/5//TfId/L/6z/u/79/nf/d/qv///9vu19ln7gey/+zv/kc+a3EViHefYF4IudXDfHFNIZVUCkS1wawdbzabiyjNAoGZitAv07E/xQr3M+TWUNk3Q7X9XNQci7gPdaW0Zfa3QRoUIR4soGi9GMpuo6XdPmpgSQNJkXQmUU+/pGd/KAQirO/0O01yWyEC2N/8i+OSby2y6yYunHeOfZBeGkG4z3dAqmvkL8bF7Yr27kdSrVRThLSD1ymxZPTIjwITK/lmdirNJOOX7dheAio2zPowYF3Zo0rRBm+7hNbhufAmUp/7xFVYeT5e33uRUy85ILs4ZqRb2H01KSIWQ7Hx4eoQWqIgQGPa6ZWVTckVL/M79XaunHSZatJt4KyrPGkNpqG4tyuJJSBNpYYaJjE68+XOP/kaRDjM+8l3cEbsVMOiSX8soRD9HbSt2LhP4iDzKDx+NAU/RkTP2hJgSM7SxBUva1RRjJGbK1ZoAP7b/eldPTsAR33Dvnv8lUFSAcvx4xF/f1KHbfc1fC+IWXANS8JJzpJ1gJLWy/atq3iU7dV1/Ee9qcHT4hHR+y6aNQ92DewLFuLr/zxPs34VkV+W2ftB4mYgJ/7aQaXKP9Ve3Y8CZXwuDOgeanToNuMLO7j4d2TP6Sydi5RpuK0VenXfYuD+P+pEMzS9Jo26JoxaQl4tASt1g6Tz37+cSyRGPTQkO6d/P+peKOuNX4wyjWThM2IZZW6n2qYruSoyza94/NvehZX3dHuBSedNem9hzhdBEIK/f1g9EgQQFE5fiC/J+RTltQPJBSYqAYyDtU0R8/RA5abVR5YfXrEZoofxUZk84MdRbNgOZv3xBxna0h3VAzYy+5LuW+XgimrpNO5+YV9IMUneCxha4LhvLl7EvqYgoIQQPSVNfo84Mj5a+gVnEU8JsfiSe6/aoKrNaDRM4OXLl06tMa5/N0JULgyHbKSBjG0TZ9Qhcoc7PpgwnnCuma3ks/Zzvy7QT78tyyWdHrVHeLPnXjmN5PtsdpVKBcx2bnt4aZy7dg3MTEJpqa4IXsq7DyDqj10JXQeVll40Xgm664xgmShZYn/7LcG6A2Px6ZSzEz84qHiTimKloAA/v/+tZhY/73OdZFYro7EbhJTYShgmss7QzjnlngU7wR/cf1SsrxK3GEfJykb47m2VqGGVjff0ny7ywOF0D6S9PT2rWKDa1xWZ0e6eUw9nJqfcUybitzt74gQMOhMfbobWIPjHziTjxaDcAxeUg6D5iDHXhRQMGdwJ8HwlpWNGZEv/q5ANVdmgE+Z9YPQ46eol0eIOt58vltrcUVLjxKmv0Njogq21suH0AEUmvKIcZUFcmKGcOd6KjopU/O0kuLL+z1NbxG1/Hsjmh5OMI59N2bZoTRWYG249mUSzAjlod7HkQqykJHg6xX+ZIZ92EiTBcOiev/kp+5ncFRaD6gldeoQK8idvlRFGqL08X7+aGpQCxgqvVcD2VNx0obWTVgqEP8cFRundm7WhVndIf6EBtd7kVNJDDdpOcV3t65fANJ7D2cXc+1WBQdFmv0QLe5OxqdkInVyed62+WyrPp07OGwv1fSDSd77weC30GwH8pZqoh5WsfyzBn4G2TWKu/TVd5fp+7JmlDEwUfHgLh4P5Re/AZulqjHil4k/wuVW8+6AICY/FFdXgyVMh1erJ13vOTjuSafNAgJhVR+KAhN5Q0AI5esD4QsvdX4RutUQDEzjx4s2JkA6w1q2xB8UR1tMSDwAhKFNs0NGFqa3YbnFfDZq25k7pqEVC666KpaNSoSsD2jXpGMrwvXp9hGBDMRCOMDMn7bNziOS9xFzTO0yY5ON91+orMW+eVJ30wVAXv3OmI/Gr9vdaIPtkNcnvM7fKROVic9uN3dfe33/Fz4ZqzUU+GIABwIQj9ZNLGbQAdd3LFMOvaZ3+ocWedj31RwZgBZNK9+a2StHH/JmAexaq9sIYk6+m9m+Ox7lr7x0lVQg9cXcN3UFPyE6d4HV6nkU1k73M7+tOo9A7fN8Ol6jSYoCZZhwmW9sCJyP5uF7EYy3O3cKPaPqfbPhVHaeysDX3UfbvHnpZcFJdVrwJBJY8mq5zTedxYOO+NLFFcs1XAfgK5ZeLHJ47vdgZzqqVWOxVbWWFz/yp/RmeSDLfXJ2NoyeYEdc+l+Fx4yG6PnC1pUuynq+13JIuWoed3Z1rhhWPL3kjFxLQ7j+jcvUVd3TPbu3r0Ufve/U5DzlW3BceQ6pSijDMvx7G9P5Ecb9icJwMG/cHiWf97ATyXltKOq0Gfg7fNdk1xGoBrCUilpabOGsctRgDoT+7nQZysy8CXmECTtkqjcn4eg9fxLA8xFcZM0gmr1cvKEfXLUP2OOji8b8Yc5WuOPZjAU+ld2wRJ3naEegkNzU3BozUTOzle3Xge6m/xm91neamA9Iio5ZZYdydLW00G/wMNZjqR3y/x7XgjPrlUfpo8rlVI6FMWYxbbCrnhJsQagbB5I5WBNsoqFCJ8jSysDT/yA6jRMWTELFpDaUpEJlpOqNC5lBs60gzHJQjO/G1kkC8plSQn9iSPDF1CLPNtnz2vt6nbRPiVMIM7Fa5hX/Jtma22pcDw/ziDjhMkVvGbt1nrvLm9xDiAvA2+kipYMwpqcQ32WbqUUALYfeKf0gpTI3OlDmqM0vwbWXaf7dh3weezb2b8Su6XakH8OLWOOk8yAr2TzFu0Exx/d1Q2ufP+wMQkzybmWftBTQfLivb+hQP3ydCk7hWvxN986y+e++sZpJACoLX82xbIwijeWvRgEWLytt4L69Q98WJvPgQz1Ri79bk91TKFBF78X85SM39lFOaYlG/7ozsdYkV6h9JlYo/K/I2rZane61PnoOI5yOjna4i4QCom2nFpBBGI/q0KXnfzJwKRprSA2nEt/2WF5Oj3QacJTm9FkNzib86NFZkQ6+CadAAP5cedEpzDV8KaK269AHdgQqswtjFzBDpbg63OqhmM1camnjlpCCxj9XG3DPzXFxrBvFI1ioWlqWjblqEEM+bEFlLjBQAWDpxheCq6OD6iOvnkrgvwVyp6SX1Z0GWXkzxSbniIk3wYewcP0q+1mhseUO4vNmajuUGVcBw01sdIjmT2xlMnKTlRdv4xAIoUZ5Y1cIsT9287+HX+HRpyFNMyiJDE2ygty6+N/n+8iYRZSgM+b+IkHY0ejbxIiqqmLrzWwPoPN4PqiAeRq9OiRdsBjMUd87w/OdcCEY2oTgbtx38JLDWoa5fnVyh6ccOPJ47zloypZSTiIT9P9eikGTQjL7H0a/KIkNWa6rVkKn9jvyNyTkT7lDe1+KjcnTy26AFjm0+c/2ugEOjYmu9z/yS7dqGPtvHjcyoqJCLkoWcfikTr/iwS8zEqidiQfWNSzKi1rKqrsBnntdJWNFUY1egcpZxt3Yj5mH6qfQqWcPNfP2mAAgrebrg+e8aFxPhtY+iRYIWxS5x6X3OX0L4kR5EjtTMoQubM3S+HmgwDhtJ4Vpg2VAKcJLwVAMi0CAn36tqzkPTog7BR7nXkB3HGo+pwePYZ39zH28ZrfZArkCbThDha+fPhXRqoDdQhJq1+y9HYoKTZGtoPMfvhiCPa5T2Tzk9wU0geJ22embrn+dcFCEsNa8PkNPsFcbguLofRVCGazoO0PyjV+zK0cXA9blxOk1yqsyoOiI12z+h8IxZ4XsqaHuavMnoGLcpTmcedf2vejWZCIJTopW7tpAH/UnYvfwMzFhPRxY90c3i7Qs6QdG77R7Oz9v1PXK8v7QL0ZdzUJRG0FDpFSFTrDqwuQZN3Nd5rfHFFe0Czspw4R+X4CR2odmOlaIvmQlOuUmAF+r6YraaQzreZ+9kdKbJDkZG8kImc7EDhd1MKpypf8xeOpIujk/v7ucGfRc/5V35CREqkHHGWGLyTuEmbaUlRaFlpWkUWhuQpo+Sx0dCvthdTknlkbRVPi+0Wa+bpgo7Z9iGJ1hfV4HSrxKb2bWpdESmB/PqQuNcbZ7vO/VmYc/6TZTxGNWcYT0p+jCnuWT617WYDCGXWHAZnfcNP9vBYKTK81MS2HfW/F2fIA1vycFVOztO71k9oTZ0yKw64L7vItdp8ffwErSh5DQK0unkH0H822s+9ZQjy5nODFN30mNIRIfGjb/hv+voOUSIubPo3vXy1Twnz9hMVLKefPPX/g+a5sitOwuMY4ld3Cl91BVQsorqtnPIcpXWcADlIOVckA4BXwGO5SzOkOvKC+wPPH45/EmGBCyDo1aQtILDjF/8WV4CCiehMViebOKPz7TpTeEt7VlRK/h6sW6K1W2u/JlSOIL/eT7fa5H/yzyWBPwTgeKf7WUrZc3nJ20Hz5FZNciKlsnk9a4ZG9qmfuzUNIeBrDvWA5wQxvb1iejiWVkr0gN+M7KA2LF77HDc8RYHtAL0hla7tDOup2SNnGX6+DppNYOUrmMkpjcDGDVYgnVQVjAIg3spWeykji2v0nQmZG1Ivbs8/OEROTLgPNCX/Kg2iB0bTGck5ZXq9M0RXZCVnRUf6IRK5v9ZXleDV6XoUviXDNx0UCtPbR6zK2VjKQFAialjzIWac1o3BW02M341260NOcLhmejgHmOj7GPMpzjLAKwBy3PgSoqr6nmiNPKVElf/h2QiuyA+JdwbBuYBUTEfKtubXELv/34lJp/IH774+ubATetebORIfUAnBWDgfr7Dg7s88szQVr00q+T2j7/CHpsalkjm7c5FxRA6bwdRLUsH3yzqpYZ9ICqIqrkCnCQkTiezKrpNwX/iTXzBTjiIOOGrx2TPBAkL+9OD4KEEki4XCDWnNfZkIxHpDQJFyjx3qYkrmqOQaJUbI7VMv8R+MNd5vycu0Ub3vkxafu+jZmPUePoACuLl000IJiA6MCHElPmOQ4eKtinVKazBN2klgumcXxh7j6IAqyQGbePYuQBle5E4YYd/5hJuJahkPJm0SsZKHYML1LFmuArI+TzmbxVGTYQyq0fPV65Kefd7uKv4oYVXT6hJnf/ZkSpjFpZLKK/kTxSHkWwDU0ZUnBdQ06Sl1pHE5Wrp0I6TASYugCUvP7YiD8SZOT98iaigHaLNiHHwFdu+FbvewzF5VUaVGvUvA2zSOG3ruyQx+Tol585AZbTYhS33DSANySRsdbG+dfY2QKoJv+z3lzRFOmvyZct5dY0L2ws8qsXlY/DLfg1U+rz3RmJYUorzwkGyhpGr96ncqVNDbBVLDQQ9I0EyivTp2XDDI98foJYhxHH0lbEqnPt8uofxslKEJsUcqBeDVZc5aYTdZSxrmtpDunGFt3hb5pjq8sJKR6m/5uSZUE+qPapTV9HDnhaKYfTtmxaj4e2ekBv6TbW7Uyis9157pHs9tICkds01+8DfUz1GBqhvXNXTiS0FoF0nf3/19AU2xV5IJwICaYZFp10qhVTv1a11x9Wp3DKLGYUaJscjwFaU5trBft7gHI3PDQdaxiffv7n+8ASHcjE/z+iBdTlf4pPkeqjJbMdGfkZwsABtY35ZQDmOXINb0G7xKWlmuzM8PdxPy4SZiEQb4D0scHiegc8c5MoxwwRiKGZyWMl9hx0xWjpmJ9TJbXz/cp2g8rLluXKJbu5jfXybKNklVg1ujSKI2OP1OSJXctVEEDgU4cwHdTCV/khU7a8yXikW6Dur/EI1koojhhw8jZAJYkmN9uunREJLubv3YLJT9sArpNrSH7wym1rXbY09dRDAnN8Ej5ZA6Nj1cLGxpuudfBR/A+HwCNtdFy9npqtL0dNnXpFkJDMwxCPTM689xyZTeX2oSpKGAOqOpsI+ZGCar4PfBKmIwYWUd+6lmh9ADIlBGyUmm5zkrTziQ0pd2WqYCYYsvx3m32cXQ2EnajeRwQLRnr9+yYAAPNjfl5lIFw/NQ5cAYMyiXd3viVtvJiKUBTVWq4cFpPnTHudzVisqsp0iowO25YzChj9g1mLQTgzcX+gGtNJ8gZl6yeEFnJ7xgvC6JAPsocLcUurhjhg6LKZ+bnt3dV7DfClxRW+dSPaqYk1dV5qP2FLfe3Mt4GOD+5Op2+y+5h5v8rb0eScxZrblu8wsE/bTeA4ziszHg+XBVqN1/P/8PLj4rG2mLFWGo0TfyXO8TWGRuYjSa3M1SQCt3epevYEDx52iNMB4671WNP1qfGsJvC+xsH4eMC+iTmQ/eh6jzHEGKmpk600IPujns7L+Z+ygT0ZnLrG9XPlyspKuTY11pspB+VYZ7/TLacZyhdPt5yFplco35v/gNsoYO3UGjY/6LNJP+LrGTqWHf/B/nC4J3Su0erE7Pd4fuRZdGbW085uPXXKqt/tuxndFpL2g0ZXbJj6fJCumiLbzKo7QcwmajtW4/Fv3k/1qrz+AazQ+FegNBgEPH/xfKkEwb67+ot/yRLMsS5RulBOCTprmZh0GWEb/pCOLIDE+ucSKd3PPW8nlsjBvost69TjhDiu0V0DSkq6wniBuWaIpDSqcsT76+xJh4WCT/ikNlJZhjh6EAfCTVoCf/UnwmbOvgq0Ks3liMFl9NWtvsCCUPWHukPpif7D0cYYbE7u/PqznGAr+HhO63visW2MVpochoplxSuzKIXeaM40j/c3LOlByGJIHaSiO2QmuXyXbPBN3MV9oAlFsLlaS3UWw5mkEQ/DODjZJzz0Wpb3Q1k1Edwv/aLHgzeSumP+0igkr46dVZFtj34NrH2mVcdSYXNQOh+DdczYM/Kz/hfnqN9Qi6aoGCcVOkVEcE1JINo7v/GhvLq2ljznZIYnnAr6iAU0tWehgnR1XBaK3A7Z/YayoCCS7a/cz2HkLUgfUrFeAzZhekpBR1Ch8jy8gnedqFKHLnsGLz2H9W8eO60MnbJrtX6QKDmtUoEMxkKtz+JKyrd5Mxxvxi0tbeUWxr0Q2a9IFx+khuwAe1ZvQuvD62kG6UXrqLA47vfL/qxcadSolsh91qNHpbZdV/Bs2POj9ISFmKxf5V0baV/4pFiwwyALOokeTzrTh62BVkTSN2AmZUe797+0F2Mx51/Ccs1wQqwLy7NVclNFUr5sj9+3hcEacbZ2g1jolwLVR4DviWyNf4P4f/M1XZxVHh1U6f8TgYfVC7GP/JEEnm1WGdIcP+NiVZQm/j7Xm+FbMLgUPz1hfYDfR2+0A2IAp9/r/M8+cMc/6PFg1j6ho2MV7++Kcz3etKFGQo9C46HMsfvK3X/Q6yf6ckrUuo87/wpok4D8D9OXmlzkHfn7JTdVaQbjJiWPBMcoszNyEMud98LVE0vf2w4AxvWX0WSgHA33K1dwsu4O/qYmsOjLyKqUDnFF6+Xzkrine/Ue+IZrkg2BzAoFPzRQl+duCg6vXCaAIbJfsK/FN9J8f6P9UFcyde/sjUlEbPtdMv42IQsnWmsv6TnulACfDWUVVh4s7wgtPWBqz2yyYiYhSkaArKEako5jWhzXi4IZJkKKQxkwAH3EHoseLr5N03NeTsHF91EQDW6/Ea9nkgbz3FHz3xvR/bJXY7smcDX/ksSbr00XcAdXz19aRH3bySzUX98q9jNzxUjLm2NXifYyquBFAaxFunm5QA6OqTseLDPAIXvFJmTOqrP6ZAEPMr3bxRXyN5YCMDRN0YVQPEj6L8mRkh2SPE3YfSH86i8QGdTJ2fNPTPXgZW/Mhc3MbxM06KfiBKut2nNhEYRP1kIS08dOsMf1F9IJM8lH+YcViFxIE9ryFPrwoYcGv9wZ4j1tjwOrwNjameuo7cGUhCfo4VsPYXtTdNKdMw/bJrtQGYMDE7YG7q03K/yaChPfCiJxO+FeaPNZGbvDC1OZ5QZt42sIwIdmVcGnFgyhny9oMoH1CyUjdj09jhdsVT8JzzGO6psvDZ7K2Xrt3XuBmHJQxVWQEl8Ljn+vqSb7BwqqMNFO8N6dWS7uSvZ/58uhRq38c7NUsy8N9LAhnel3I9AhDwD7dM6EADxeOW7l4+tcN4tT0L5fYccsGlLUjeR6hHIdB4cQrUA2QjYnuG+oHrsiRu1O4OQXIM5EODfr3c/m4HalOJyGERLztHwRiZxrEcAxFFu15jY6eoOw9CcAdaWMb0CNX5MgT/pFs+VTE3Iqi9CQPepjI8f6xPYi/dZCqPeFveVhGtop3zpXIfQ6YD539B2+lXBK3SrjBSeCaYD465ZZSPT3UXocy73Egir3OQx/idAXYTb+ZW5v0g+htSQbyevFsLLdian3VcNh/IWtlv+JdRCuMmXjLY/15nhuBRzKg5zvS9thgCuJ0mRVP64228yER/DEc+m/usrQiYloPZBmADSGXKT1zxebw0V3OyfxTroC8bixD80gNbLECYrZkuSqEZO73BKSmn7HSf3Lzp31j/omHR2VRXbP2BdFiiJTuAjMeUBGLp09e8KnZ2jADEJUF0FL7jclVhIb/IX9dK+Y/OjrX2MNxwCJPHC+gM6vt4XHiZB9YHwdudfEtvL5PmbH1iUVT/sI02SjGDRKqKAZ7ClJyVlJbABTR8uDtC2fr32hHZkqu2iyjIcIHKBkZ/0HT8irPl/iX3HAAZXjuMEs2owQ1O5s8s5V8NnkTq3WCiLj4eT0C0fqTimD9dxa1ja66Be2vA5CKAAf11zclxx0xVMKf9+FM6h7/p978yzg/+mE3qVNPNIIXqanD8/F5llx5StNfmwUfvbUSf77zjeORU+Qz8UGG2C8ZhCccT8YnXI+5zTR+hlv8O6T8zIFnW9MpYUejS0bghN/pAdsqd9xfYoFin1c95JVzHCLtZINU8EdE+9JiC3RmtPbGQgew7Ai5TfG9Po/6++iLjP1u/nd9hXVqNLPA7/wDVSVIHnAMVbIhHo3UG90xfdv7KyU+pRtv3tSJ8V6HJNeE+Ij79W9th+Q2/KJG2uPIUqXTwq5p5BgZzq1lBHOqzWxXDbnK8cwVb10JWivzPODrhZ6xeTtYSMhT3sFtHiSfJY885fyTxyNvv4S7RDezzY3qmIbRhxJ5dGb3SwcDcjE51clFVRGESz2ngxGZYgQK6znZuW66Trlv8H/iViibbAO4d2ZJo/ay7fkowGwa3+k35uhhbyxwpdIsLTd01h3mZcl9DAkwoX91I3tVqmVnd6g5D/8Tuu7o+SFWYM1iKaNcmeipeA/JtSzVsl6zthXk2oFmVY1YODtg6qAjFn5/aztlL5TaPDX3LFgDAR31990ODk3T1OwxYBx3WHf9SxTF3xMwlysX1qR4olQW6g4ER2jPwss6UD3TRRvvDNfsns5v/FhDGcwPRXpcqe3w7r/P6mBVLHL+x1tXcczyLlX0uQxrNibICB69riu8hr2eiprzO3GmKS6ij8lDysirjN2JYk36PiVTZJE0IcW9GX4Wym0jGTpXsgCQXhSVxisKfpRzGZfbG61q14ACtt04SW6qHT/PkaNpvrp36HXk7hLdcSaQ2e1UxZpVDTJg4UsbICWXOOdR0yGtgF9km90XiL/W+icAJLYVfETFtbYc1r8nQMUS6+5KauknN5sSIHKL/1GUigL5fJ6dOGBzPdqf1h4MSBrioVEKP2a0yuwhDwbGszb3yj4OsBjsmdYpsc8CO72kWaE6ht7mGmT/VXt006xv2+9WT5MOaJqP/zN4RkmURg115ku8/qLm+vEUuJO67V6DR9DHFciigDmhrJY/GgWv6lN4ratqkoJGt5vfgqA59kuX6BER0SLDAKALTDb2iY8Yo/DnIEqlf1bg3ymywOerxN1o1+0U//H9T8MLBgyOBqAvynYo+nmiWFhSNc2ul05Tu0JyH/1De0tUDxcFrjgK80hmsiQHmONBQILDlYfEbCvHLPisysnpMxFjTfyWPq+EB7eKRUBbePuqSJw4TQcqH7NC1iRh2y8PgY3gEV7Q1Y02bDsVfh5D9q8T6BMU+Rue1f3TUmNrWzkpPTorKLBtNzuklQOVYN1RFDpxz4PZ3JgjVj3SdeK5dZ3ScYIlVqadCka+vnfVcdhMQIYZMLZuCuNb2tdzDY98Nw3uXfwSF1wMW7C5Hsfx0DhyWyFlRDEAVGDP+gP1rYtAbeoDYgyK/B6FnPWSbAniTcIN1uxc0Vr8tKWadiNWpKmEwXlBCymOfKFq2CG+30aCi2Jsck7gx6qLakGq/35kz0tDRvlJ3gLK6x1DdLEN900P2AaPIy1pvQWwTThe/oBBVfyRcKIzxHK0Qh8T7Kzb85axebjA/l8bcvkglndLeJVq6NiBARpzho4bZMqLfIpkiYgSdlqBsaf4gl4x8k+y3jVbpilMLlbA8FKNoB2FdVSxU3HrZMNFZYJ3nj865gHCh6JD0uCcmKetqfMzjPmyi5ts5iolJhpzMia297C/kPhHSFGdbP5eLZvb7fTzG+wqzoSr9aeQ4u1xA9J2R+llDdrQP2N1V4p9XkOEfDpdq3eyz+KloGnk0zRzshJ4i8gmmMQHlKJSyNMxDKjrMyGzyvemJezW8MfcGMJgqEEtCl77roDv5cMz33i9mWgJRFqwt5g9sOyA++x988G2xkudZ15KLhuFOVPwPJheMjfCHOjWLxO7WnzZqqOEEfFNbkuIALGBZWJyUcza5oS0Txca0mQSMk8A8k1k0tQkoBFB3BIHdzCzyHSv+6C4/zv0NDpBq7i/RR65rqQTs9KNftqCOHhVS0UYp8hxbuW3XAWwovAb6qvxkFIuyWgjieIyR+sJKYtFu7PaFwdkknv0mVnFlSFgovxpT81+jnkNNZwSsVopOcPpg07NxHC19peAEeRwx7Hvsc8Vlm2+/5A90HNPEYg3nt9Ftk7RTvVmJ1YpC4+FUjkT6zFiATD/TtK9/RKY9Ew+qajLvQtARsMpwrEKBv1J0xlHkmu+K8+Fn//I1OoXgJCDE3DZGH2nsT9E3ImelKCm3lUgve7Q/U4d0QpVw4Trzgfkm5sFh/e+ufI00rv6tmTIkYSistIaWeERvLnSoDFo6AcD/vH/2Fa32vK1CR3XFLrb+Du9WAv3XJMV27ZWX1Qa7Uj+0qR0gGV7RqKugQN1f3lpjRttl/VrTKWAwKgAZoQ1oWQHiSB119BvBZWUWiuv+w8EW/flUNnkQ5B8SvbuAhBk7/VimHaS1h5tOZY3Nyv7IJg23pJkhqbWiqUYuped5TXMEhJ8+Vwrea6eF8BPojp8P5OIlbe6CuLssYPgNcIvWvJBv8y6iQE/pPdEiBoK2QfodBONmJtle+K9QNzDuGPkdlrE5hQFT8pZZVh0YJlz2S3bpC+15qhshbZ6N9xGEgHvelpiXGw2fPgauWQFQlS7ycEBV/9hVueZndddOsRE2fhGa06RzUAQxBz6aHzWUHrWnNtDtN61pGjaEQVpVucx/2BVit+KyFRKkXQhN5lnb58n/vAUSFS0qXvO9TVoCVRojDdAcifvx7JpKlah1RkNwbFIiChK8H42xos13M/z7SaULHvCkcMPuWkxhRWDnw5KC4Q357vOJlF6Tk8wV4s5rZX0Q8go6h/UvH6V/Z041Miwla0r3qB8cHMcZDMsEeoEVhBOsosCen5ljLUWNMQXrmiQVOIxEW09PTbu5H6XM8xsTdpYAsPnTpAcdLHMunt9HBD0w/8Qqdt+eZDFzxcxiL4D8ADTN5ZXNGO0/2VNjk2xhxeBkkyXfwNFoFr/dDx3jUz9wxux7Ips/lXrNXmBbI/4xWB4QmjK4AaF3w37fVHxMz9vmVXg7s29duQLi/4XkU63yP8+EQLRc2x/b4p+HWMDpQiASw9Fu8X6Fefml+maZHrrzRqpmDU37jmvi6l1DoqeS6PEuwvhsKhSVjSE8AtLdVHvi9HVPNJR3RnAyujgSyUBRiF23p1lWIcVtxInP/EOZIEK0h890PnX3p/9SG1MZqvLjWgUeC3JL+i1Crm2mqL4MfFmDntAqEoMZhef/B/OGnhKjkmrjeK1rCjmqp/PlUm5pTaRianmhP9zIQA3QK6YU5KhRMdGKxnh4uhxInXAUEG4Sae2EXNm6MhUflT1AYa0QLKGe4xWpQlipy6pLGaMpc3Hau90Xe5m8/Of3m6npBlq1CeU+QJY4No6pCqeU/dSutfrPwon8qhIWZwuAxQFMsfoIWiY+6i6fRGkWhAXz+DQxhqw2VWNGVfxndJ19Ulaetn9e5YrY1rBYTvTyNiBdshs9z6S4honL88DwLHv9OATdAwkiSsLqha2V8HKA1NwIjFFWFx8398bgXZF0LaSeXY7Ghaz1xTM/t7Ap0DbR1W6bSuZ0amms8SKG3yXNwZNTBHkDANkQ73hAaXGV/3EBIy+81yE9w7b6YWRh5GxCSix5c5NdfpLn221clgpOcrVShF2URVStyVuEPRvaxVrY/v03uDhgJwLlv/p3/ZJ+rgYR1qzv3MzxwFen9tVC8IaqZo30Dy2uxpgt3ORRw+KK91deJvthuwNJnneoUWXsJDASycVxVoEL6jVYFOW+JTu4ikO0y9BabgKGIS2KU6Js4WjDJScJOvIvKmNgG0NmhJ2R1QbYMO4sdF9SbCuIC10X/bRC163fRvf9OwcHxiW2doc5NOzgvOJjnTVET/26Qf4lkcZybr+ECAM9MAuCVCG6bdqYd6T6Rmn4pId9F3WtjLjFXft6oYvh4hsrqDd9qrHkZjV+yMzK+dchzQA5x4CMlUVUkHa48TH5r9EVBtQjzMem1R9uA+8GCQNrCHJaY455jY8jek2jN6A/r/QbrFPW7rrfbHwGrPIhQRM/EOs/Qd0n+FpnqWcjBbM/vn0Vh60Z9TJyz7oXtFsG7nNn8J1TsnsrMNfY5FOGRlMAjV1CxAOBeSTfXpsItC8PwXUhfX3NiAZfB/pfn0Gl2yh2eOcJBb2U5lCi1v+FutngGsBiL53wZZBxaL7SKZnU01kXp5aHdzEoPWYZIjQ+z9tQthbg/5wuDrhQewiQixvhsK9+NeTXsRmB4BPCaUfSZ6kWyDsE1RZhi8ZHi8mz2/I6PvgSehMbTOkdtFUqEYzOjOPoJeNli/2uloVaNypxrZtFeI76tBQ8xDVcWvUZjR4hTG0BvQFB1K9F2zkXodRkEfoLFQuWcymsjSjPMHWeQEWtepNx35VvEp+Q3Ze4i8e0hPzrXtk8jyFN4HtoZk/opowrsDaUVs90AKlehJ4MlRCIb3xaT9j9hILPZtJvRhYjdKfRkQfKa5GpD5ZNaEG1ddeqRrYWpJYhJkBePRMlDNA5jeq8FzUp2JO1dyUqLa8Y+m1m+dkJRyHSu8aDUYjhV6hMCX+3nT5SSLfW5KAZXjFk3f/Q5oR0C/s1ny0wMHihwf8TjG15LXT8BxEGlY00d52TYxHD0mbaRzeNdJ3A2rQehxlLLTRUGsSPYCZt99m6SAS6jltcR1GPNrZ7inLWDPhkYwyGrJG0i3Ag11OHAJxBnXBT7S0bb6IfOYqF+tQerYMTR5QyilAaZA7jiLgO3KAnJIYgPcq9iG7afC3wcSk8h7LdGzRQXLNjhJgS1HE5Qp50/cHSU1NybEpDD5d1PfzGSO9hmliBfzJsXkueQDDl53YUFpRM45m62Nc926kaYMDhzQJI7d33U1pxbuS1yLClfPEAdKXqhFtUhwrdYGKqgyooAJF9T4tmF/vF+FB+wnZVkKJCRPYphPpEddNDrAvrDLWIE9G+4PSAgvKKflv81BK3w6vwdVmOzHt92oU7OHfe7bZP3ZhFYxVyKXeZLceaFM3GUT0hB4Z/R7UldBYBT8dHi4ipNZY/Ha5mRKNCiqAF/tbQOhGSA2WK23SOQ1KUqZmyaz1gK+15oJJ5LQTIaDHAvPA38QK36Oyma/wpdr/k/Gr3OOqUMVeFhQxsv0I5FzyXUOkaSqMhqKk+R2UmAeQMslNxy08ym3S9Ww7/UK54khN1e1QefOPfZEaa6Mfh41n8TzdK4awUTGTaV07M+nC69XPyLkJf5Qq54BBSLAjOcO2eLhSTIB6s5KHdgrufXKFKQ3RtceGcOcmtRARtc+Z1Gfx9941ZbWYfwNGOAKPLqMKHUiU8GrlyF1Bgvsd8tOXRV36c4d3r9JHdf3ZOHxNT0TbpFqxosZP+J8YZ11IbioUfWQxG27u8leXPJd6D7RJoLdOxWzWF19337VejScvG33x6BDac+/5YlAo+TmyHKWimfXD60+H9BaFZdlzOFADi3f+l5fI0NaaZ6v04xXjYTnbXqsQr3eTxXUpT5C07HZAGQVWCftYE9isyK2WoK/epj4+IJPQtaATVEWTiR0FcsgdVjcuFtsYz8kFDcxHkUWpzFP82xusrNFmpz2o7fAf0lENJi7dY2FAnpS0EAqJUwBToDzn39uXWWGlvY4r4+7PIYJ+nReScbR+R5V1F8gjwFT4NkIuJu9MaCSJR6KOxC9i/RHlmZamj6wSbOd+euQt56wNNRnIuwq5hrZNc6Y+akqRO7uyhIDeq2t7F6UQmCury0wJJ+4Si2EH1GggcuvNDNeFU1hmPIA+FM044OqYgixx4X7+sjMiHG4Y72vx7x1CXjLNHfjAg7g/dJ2fgb2cybny6G2xCh7enIm6SsmqY3V/YJSengWXe9POsO9D0y8QBnJaYZYTnJUmPAn2wH32ZdqfBaVctXniOG3nexqT5hionyyR5t/dJCW6WVg+NOVKvb1MNglBzopE//3nyfZ7ei5/WqoZmwYJRSRRrc17f3imVNgbjAx5jzkhc6/TLht6nUi0bAQpBpy+5TDRgK4hC7NGfQj+jMKIZxbZUkMPLFKsm5Kitsjyzxj93UQl5aYOrK5/sX9c64mvornowRcIU0HKVWCkdYF5VppMn2AHhlFQZjigDA27x2gFFVjqT5JdRsAqEr3wDf+vZOb17WfhStFw/aYmDm7seVPNp9d2NUpYLwYNDq0jTU5Ed60MQtojd9ydCwbgvV5XYaLoKiAJEsAXOCd1sFkYSwir5KfSwkiCW0o4kk7HZqlm/q7EGzllgALrKKC7BYQ9x0Qd/B/jIKg2jK2TV1rizf6PyD2u0Sg1cQtV0VRMVyVFfIqCiHMCo2B+gNOMLkOjzrvEYRgbaamJ6p7bmb3y95h2L5BV4zQ4LU5xdA/wyUzMFyQXQgymI5nXIKJ5H9Q72yyX02CoHyTYTnnftiW9OC1tVUe3058eAHZqAVbgI72TvPPYWwEb5itcNtATuYtnpu6AW0clApk8DSPXWApmkdlWTvGl5eaoLH9yX8VG6M4cS7ebEz7Y0JFEv2ydthMyqQo/EqYWVsm5JgrU8nxkxJ+2JlWTeQEGXSWl/DxW2PR/nUPTwypzJzslUakaLzN8iH6E+OMR9y9H9RbV1eJbxKRFIRhLU9ssJXhjvCvpaZjoWenlpesP8nPxLpYdIsKt0+Lv+gP71VXkmd7HuWtc0VyxcnfXkAauZTPrZk2CzBkMhDYsgRYmTjP7UMMdFjmLN6YA1jxeHq0/wYiJzYQh23wE9/BbGOLOUtKjBVwBhSRXHj6bmyuUWelv0el/YqpGc/q76vAKvDyDWhP8hc7EE6owe7UxiQX30giHfu2IgoIbuTydOz2qXZ/xQmreiVfa+1LOmtI1xc6k4Ur6Hz7a8thXzDUIKrfbsTLFRZGgOIifUp6VPSvYCRrH2eQBVIbXR1iBGj5VrezzV1ACDhH8dhVfXppYAafbuG7L0wXQkdERSgAglpEXFC7p8SgLHPrr9Gzhls6OOQqbhkR+2H0jazrqKHUztzCxg+pdUgyFNX24xGNdUdweDorgEGOi/YIpEU7lfwc5mWB6KdcvzYNwO2VSc+Fgt0Lhpo78KMHzkpVfQDnVr8zXSXcJ/lJWDSaE8gw3dqIRfEt+6RiVlDtkciMqFHD9nnDpPlPT1QpnBeZuD0pDh740k02DgE+GAGEIQHCy1NWmmbNWesZ60/Sga/A+B8K4S9B4nK+3R4OMROyEQ6Kffi7KrY/vpC71JiIx61uoU9nboJy0+BwzjGcx+l+jiKbbVpj7m1SAZL7CNb5UmzznRdIWlBq4n2KEjpvAHjSUxfvgB1h+2Oi46ggp6/g42iQmfrV08chthpuJyDN86lh0vdMxmpnO8tcog6uBS4s2xsSbkgWWe3o0t6N1Qvq02wkGufF+m5vLSgZTeWvIkYD5M/4BOe8/mZn8DxnOa/OovBSgEXEHNI3WFTH3LD475T3lJyX30Qnh0QjiHb5QvzDfZ0j/hwMIn1oRtfU77Amp7SV0h+hIRv74Q/EVFoTub2qrrK6aE1PGW+9f2uL8CrpF3d6LKWvcaN8aWorG3z01F8ZKJDJiGzMKLir1VBpmJs4BF1BRn6gj6fg1Ug8dUxHDy8woHls+fJiB6GtwcXC+wJ8JfMuMCMBYwyVwkiFs4ZCnoTvDoCYxWuZtTsugv8CyHzEI5eI1TW2M9/y7vFbzUuV/TGt0S5hnQ5SZVIag8d5XZByPUvKcQEElzEqRvXS+shbtLH43Qvy+xH8c/JzoTvdLysVgfQZSwOMHLEPu7ZWMvejvh9x+YHOA9YDjChk7LFDZtTKlIl0U+aifnzP247ZIHzmpY2CuArSZF+RhiChZxDR+lA69eC1qqK6zl6aG2aua9Xj3tLMWPFVJUv4T9RJhGLEwwSHQKa4IcxNxMlJXW1XCvgBrqKfQfv3ZU0iPrQUeENVKfqq6Z2JUT/XJoeJtbBmvg1M2zw5GETY2W58ggHunmp+FRIKRUZT94Hh4Pxcy7Zy+rZfT0ikUhRJf0P7GKtcqmwW1CyThyB1ANIGPn26cnaz4NkO1tPv8YUD9PC6XhCfrc6yBElplS/kiFssl783yXClCleKMd4ExKZd1rYmb10qHqACYjZnUcuf4OVO0J9t0HVa7DuCcOzO/q0s/OiMFsdbEkU/hY2YroBFNYjFcbZgHdTkzAUjuO7J33Vi9t1n/zZt1cqdf5RUyBiYsNDtyBPcdSzAoCzOjlte1eIh/qXFUOhyR1FziUjTt0FToR3U5p4JMTpT5XUgN5B3Tp7kjP38PlYpsGzTOwoh8u3N3TiYtfbq1ADmyavHIy9q2kiQXSN1Mm/QQAyLfmqrXSGXQwddRKiwCvgHCBki/LMNMZVnPDznq+F82aUUKLd2AKsYYmzRwIJxq94tk5sQ+QYTOvEFBBOQENlDlX6nvJYl52j1XVy9Yhvy6uc30YImUxS2VU7b4UYJ9GgdPpIWr+tJHbLBbojZQc5hOlSwbzPn2T+y728k9Qs+8TmTvEkWJiMdGxLO9F1sfix7fXqYbPamRFlO6amThq9slTT50F85+hkMAHUzhwsAYmA6f7//50+nUZRSADlc+jv+RIZzv3zV19UlA5PKUQ57g9qruv3ikj1W2KeoMmOE5bOJjuA7iA2h9Jm5LtUYvABTGKAXr2OMiLV6iEtCZwmusTYPUZKMMsFknuZw+dxMPFEnroQjK4o3dEgqdDWcgAsw8kbYNB6wxVCwD62FZ63qdxxKsi+m4yN7vxldZe4fihy0lnKYcc3+iPY/XXUr8SwWmdpHZjP10lrMHg9usJSdaCauH0LzQLonExHJ5qez6lCcClotQlZVX5O0v676PxDCcYTnwd4gJ0OVJjdS0xabgO3ix8d4FHgVq3r5FGDIESqZT2MiaF5zp7wdh+haxHYPqvcpHP00eLMbRzd8baDYCEK0aG6yVIFCp5qQhQbcXFiIJtGStradUclDGDVsG6bhZz6uOUbHIpAtgqdb1k4G012DlLFFaH49WxmvHO3u7QFzGjMon4XkoYKDHnuasT6g51xb5xEI02lmlZIqTRiJ/Te0JXrtGD1aa3sQquzoMnL8isgLWSz+Wrp4ruXKwaPKmdGZs4L00kUfqCvx2GMQKhu7QBKUd/5SIL+tx43Rvnrps6yBj/sWbPlBbUU+Q4SZASiG1DTBURndPvZYNs2OBtuXPzY6N3N4IimQ7nIhHV8w1QJQtRVzlw0IvzaCM6WOl6CLbX9ocYNRD117YzcrVhuR/4Lh1eKo6ZcLvqrkMg6pqEOSEpz2V281HBq0dvtlL5nMbDkJ9ZEghm4TQomcGF2o5rZselQxwv8aKsGpNWDNIFnAqCt2qkXsFv86O2zc0Oi1maCh/KPYa83HjrvyzJIWhj8tG5djHPKQxG8PpiJ+xMAESg/Fqzu/bpluIQkTGpwRSj7jDArKTFx1JJpbJTiBaH5nDdIoX0sPtlMhsVXq8okg1vTmlLUi29FcjxLy10Mh1+/SgCj5iRXXBr1aSUhNPfBU244J5cvxXcvMfPzMek3nbYCvrmgnTXnb/pZA1hpd53idfRNkDjgsOmYMxgbgsD8/kbKIpIMuVyrUNSuIhkqy/0VZphzz2pZ0TsT1ObzWkbdQRiEK7mgtFhsXwrhOEGI1GqGPuhBFyGXkDk9eux0G6240qTQqoqJWX+312vacIIP90UGpcoSYw9Pign6o98nnuO3PZ0HJ2KR6/5f42X/uiLf9BuA6F4h8iGwWjhViVT/MzGkdh8GFNyJPeUS6AAAA", "weight": "10-15%", "color": "from-amber-500 to-orange-600", "totalModules": 6, "modules": [{"id": "pm-r39", "number": 39, "title": "Exchange-Traded Funds: Mechanics and Applications", "estimatedTime": "3-4 ore", "totalLOS": 8, "los": [{"id": "a", "code": "LOS 39a", "title": "Spiegare il processo di creation/redemption degli ETF e la funzione degli authorized participant", "commandWord": "Spiegare", "importance": "VERY HIGH", "content": {"introduction": "Un **ETF** (exchange-traded fund) è un fondo che detiene un paniere di titoli (azioni, obbligazioni, commodity) e che si compra e vende in borsa come una singola azione. Il suo prezzo resta vicino al **NAV** (net asset value, il valore dei titoli che contiene diviso per il numero di quote) grazie a un meccanismo di arbitraggio: il processo di creation/redemption.", "sections": [{"title": "Mercato primario: creation e redemption", "icon": "🏭", "content": "Le quote dell'ETF nascono e spariscono nel **mercato primario**, cioè a livello di fondo, non in borsa.\n\n• **Creation**: un authorized participant (AP) consegna al fondo un **creation basket** (paniere predefinito di titoli, a volte con cassa) e riceve in cambio un blocco di nuove quote dell'ETF.\n• **Redemption**: l'AP restituisce quote dell'ETF al fondo e riceve in cambio un **redemption basket** (l'elenco di titoli consegnati all'AP). Di solito coincide con il creation basket, ma il gestore può modificarlo.\n\nLo scambio avviene **in kind** (titoli contro quote, non contanti): per questo non genera capital gain tassabili nel fondo.\n\nQuando un investitore normale compra un ETF in borsa, invece, il fondo non è coinvolto: le quote passano semplicemente da un investitore all'altro (mercato secondario)."}, {"title": "Chi sono gli authorized participant", "icon": "🤝", "content": "Gli **AP** sono grandi operatori (tipicamente market maker o broker-dealer) approvati dallo sponsor dell'ETF. Sono **gli unici** che possono creare o rimborsare quote.\n\nCosa fanno:\n• comprano in borsa i titoli del creation basket e li consegnano all'emittente in cambio di quote;\n• restituiscono le quote indesiderate in cambio del redemption basket;\n• ricevono ogni giorno le posizioni del fondo, quindi possono operare anche a mercati chiusi;\n• pagano i costi del processo (creation/redemption fee, imposte).\n\nLe due funzioni chiave:\n1. **Allineare il prezzo dell'ETF al NAV** (più trasparenza).\n2. **Dare liquidità**: se un AP si ritira, altri vedono il profitto e prendono il suo posto. L'ETF trae la sua liquidità dai titoli sottostanti."}, {"title": "Esempio 1: ETF a premio → creation", "icon": "💹", "content": "Prezzo di borsa dell'ETF = $33,70\nFair value del paniere sottostante = $33,60\n\nL'ETF costa più di quello che contiene, quindi è **a premio**.\n\nL'AP:\n1. compra il paniere di titoli a $33,60;\n2. lo consegna al fondo e riceve nuove quote (creation);\n3. vende le quote in borsa a $33,70.\n\n$$\\text{Profitto per quota} = 33{,}70 - 33{,}60 = \\$0{,}10$$\n\nLe vendite di quote spingono giù il prezzo dell'ETF finché il premio sparisce."}, {"title": "Esempio 2: ETF a sconto → redemption", "icon": "📉", "content": "Prezzo di borsa dell'ETF = $30,10\nFair value del paniere sottostante = $30,20\n\nL'ETF costa meno di quello che contiene, quindi è **a sconto**.\n\nL'AP:\n1. compra quote dell'ETF in borsa a $30,10;\n2. le restituisce al fondo e riceve il paniere di titoli (redemption);\n3. vende i titoli in borsa a $30,20.\n\n$$\\text{Profitto per quota} = 30{,}20 - 30{,}10 = \\$0{,}10$$\n\nL'arbitraggio continua finché l'opportunità non scompare."}]}, "keyPoints": ["Creation/redemption avviene nel mercato primario, solo tramite gli AP", "Scambio in kind: paniere di titoli contro quote dell'ETF", "ETF a premio → l'AP crea quote e le vende", "ETF a sconto → l'AP compra quote e le rimborsa", "Funzioni degli AP: prezzo vicino al NAV e liquidità"], "examTips": ["Trucco: PREMIO = Produci quote (creation); SCONTO = Smonta quote (redemption)", "Gli ordini sul mercato pubblico li inviano i broker, non gli AP: è un distrattore classico"], "question": {"q": "Sophie Einstein, a junior ETF investor, was asked to state the roles of authorized participants in an investment. She gave the following responses:\n1. Creating and redeeming ETF's new shares.\n2. Submitting orders to the public market.\n3. Performing ETF transactions after close of the trading day.\nWhich of the responses above are most likely true?", "options": ["1 and 2", "2 and 3", "1 and 3"], "ans": 2, "exp": "Le affermazioni 1 e 3 sono corrette: gli AP creano e rimborsano le quote e possono operare anche dopo la chiusura, perché ricevono le posizioni giornaliere del fondo. La 2 è sbagliata: inviare ordini al mercato pubblico è il lavoro dei broker."}}, {"id": "b", "code": "LOS 39b", "title": "Descrivere come gli ETF sono negoziati nei mercati secondari", "commandWord": "Descrivere", "importance": "MEDIUM", "content": {"introduction": "Il **mercato secondario** è la borsa: lì gli investitori si scambiano quote di ETF già esistenti, senza che il fondo intervenga.", "sections": [{"title": "Come funziona la negoziazione in borsa", "icon": "🔁", "content": "• Lo scambio avviene tra due partecipanti qualsiasi (investitori privati, istituzionali, market maker).\n• Quando un investitore vende in borsa, il fondo **non deve vendere titoli**: il gestore non sa nemmeno che la vendita è avvenuta e non tocca il portafoglio.\n• I prezzi cambiano continuamente in base a domanda e offerta."}, {"title": "Perché gli ETF sono fiscalmente efficienti", "icon": "🧾", "content": "Il rimborso delle quote avviene **in kind** (titoli, non contanti), quindi **non è un evento tassabile**: non fa realizzare capital gain ai quotisti rimasti nel fondo.\n\nConfronto con un fondo comune tradizionale:\n• **mutual fund**: se altri quotisti chiedono il rimborso, il fondo vende titoli e realizza plusvalenze che ricadono su chi resta;\n• **ETF**: questo non succede, per questo si dice che gli ETF sono \"tax fair\"."}, {"title": "L'AP tra primario e secondario", "icon": "⚖️", "content": "Un AP può vendere quote dell'ETF in borsa e **nello stesso momento** comprare i titoli del creation basket.\n\nQuando il valore delle quote vendute e quello del paniere comprato si equivalgono, l'operazione è **senza rischio**: vuol dire che quote e titoli hanno prezzi equi (fair)."}, {"title": "Primario vs secondario: le differenze", "icon": "📋", "content": "| | Mercato primario | Mercato secondario |\n|---|---|---|\n| Chi opera | Solo AP con il fondo | Qualsiasi investitore |\n| Cosa succede | Creation/redemption di quote | Scambio di quote esistenti |\n| Prezzo | Fisso (valore del paniere) | Variabile (domanda e offerta) |\n| Intermediari | AP e sponsor | Borsa e broker |"}]}, "keyPoints": ["Mercato secondario = borsa, scambio tra investitori", "Il fondo non vende titoli quando un investitore vende in borsa", "Rimborsi in kind = nessun capital gain tassabile", "Prezzi secondari variabili, determinati da domanda e offerta"], "examTips": ["La creation/redemption NON avviene nel secondario: distrattore frequente", "Ricorda 'tax fair': confronto ETF vs mutual fund sui rimborsi"], "question": {"q": "Which of the following most accurately differentiates ETF trade in the secondary market and primary market?", "options": ["Variation of prices in the secondary market depending on demand and supply forces.", "Lack of intermediaries in the secondary market.", "Share creation or redemption takes place in the secondary market."], "ans": 0, "exp": "Nel mercato secondario i prezzi variano con domanda e offerta, mentre nel primario lo scambio avviene al valore del paniere. B è sbagliata: nel secondario la borsa e i broker fanno da intermediari. C è sbagliata: creation e redemption avvengono nel mercato primario."}}, {"id": "c", "code": "LOS 39c", "title": "Descrivere le fonti di tracking error degli ETF", "commandWord": "Descrivere", "importance": "HIGH", "content": {"introduction": "Il **tracking error** di un ETF è la deviazione standard annualizzata delle differenze tra i rendimenti giornalieri dell'ETF (calcolati sul NAV) e quelli dell'indice benchmark. Dice quanto l'ETF si allontana dall'indice nel tempo.", "sections": [{"title": "Definizione", "icon": "📐", "content": "$$\\text{Tracking error} = \\sigma\\left(R_{ETF,t} - R_{indice,t}\\right) \\times \\sqrt{\\text{giorni di borsa}}$$\n\ndove \\(R_{ETF,t}\\) è il rendimento giornaliero dell'ETF sul NAV e \\(R_{indice,t}\\) quello del benchmark.\n\nVa distinto dalla **tracking difference**, che è la semplice differenza di rendimento accumulata in un periodo (spesso negativa per via delle commissioni)."}, {"title": "Le 8 fonti di tracking error", "icon": "🧩", "content": "1. **Index changes**: quando l'indice cambia composizione, l'ETF deve adeguarsi e sostiene costi di transazione che l'indice non ha.\n2. **Cash drag**: l'ETF tiene un po' di cassa (dividendi incassati, afflussi) che resta ferma finché non viene reinvestita; l'indice no.\n3. **Expenses e fee**: l'indice assume scambi senza costi a prezzi di chiusura; commissioni e spese del fondo riducono il rendimento.\n4. **Representative sampling / optimization**: se l'indice contiene titoli illiquidi, il gestore compra solo un campione di titoli più liquidi che lo approssima.\n5. **Depositary receipt e altri ETF**: se il mercato locale è illiquido il gestore usa depositary receipt, che hanno orari e prezzi diversi.\n6. **Fund accounting practice**: es. gli ETF obbligazionari valutano i bond alla chiusura della borsa azionaria, l'indice a un orario precedente.\n7. **Requisiti regolamentari e fiscali**: es. ritenute sui dividendi esteri non previste dalla metodologia dell'indice.\n8. **Operazioni dell'asset manager**: security lending e recupero di dividendi esteri sono costi \"negativi\" che **migliorano** il rendimento rispetto all'indice."}]}, "keyPoints": ["Tracking error = deviazione standard annualizzata delle differenze di rendimento giornaliere", "Fonti principali: fee, sampling, cash drag, index changes", "Security lending può far battere l'indice (costo negativo)", "Index changes sono rare: contribuiscono poco"], "examTips": ["Domanda tipica: quale fonte contribuisce MENO? → index changes", "Non confondere tracking error (volatilità) con tracking difference (differenza cumulata)"], "question": {"q": "Which of the following sources of a typical ETF's tracking error is most likely to contribute the least to the fund's tracking error?", "options": ["Fees and expenses.", "Representative sampling.", "Index changes."], "ans": 2, "exp": "Le modifiche all'indice (entrata e uscita di titoli) sono poco frequenti e il gestore può lavorare con gli AP per ribilanciare a costi bassi. Il tracking error che ne deriva è quindi di solito minore di quello dovuto a representative sampling o a fee e spese."}}, {"id": "d", "code": "LOS 39d", "title": "Descrivere i fattori che influenzano il bid-ask spread degli ETF", "commandWord": "Descrivere", "importance": "HIGH", "content": {"introduction": "Il **bid-ask spread** è la differenza tra il prezzo a cui qualcuno è disposto a comprare (bid) e quello a cui qualcuno è disposto a vendere (ask). Per gli ETF dipende soprattutto dalla struttura del mercato e dalla liquidità dei titoli sottostanti.", "sections": [{"title": "Cosa allarga o restringe lo spread", "icon": "🎚️", "content": "• **Liquidità dei titoli sottostanti**: titoli scambiati spesso → spread stretto. Lo spread dell'ETF misura quindi la liquidità del mercato sottostante.\n• **Volume di order flow sull'ETF**: più quote scambiate → spread più stretto.\n• **Concorrenza tra market maker**: più market maker in competizione → spread più stretto.\n• **Costi e rischi del liquidity provider**: più costi, rischi e incertezza per il market maker → spread più largo.\n• **Volatilità**: più volatilità → spread più largo (nelle recessioni si allarga, nei mercati tranquilli si restringe)."}, {"title": "La scomposizione dello spread", "icon": "🧮", "content": "Lo spread di un ETF è in genere **minore o uguale** alla somma di:\n\n• **±** creation/redemption fee e altri costi diretti di negoziazione\n• **+** bid-ask spread dei titoli sottostanti\n• **+** compenso per il rischio di coprire o tenere la posizione fino a fine giornata\n• **+** margine di profitto desiderato dal market maker\n• **−** sconto per la probabilità di ricevere a breve un ordine di segno opposto\n\nL'ultimo termine si sottrae: se il market maker sa che a breve arriverà un ordine opposto che chiude la posizione, può chiedere meno."}, {"title": "Il caso degli ETF molto liquidi", "icon": "🏎️", "content": "Per gli ETF grandi e molto scambiati, compratori e venditori sono attivi tutto il giorno e gli ordini si incrociano subito, **senza passare dal processo di creation/redemption**.\n\nQuindi i primi tre termini (fee di creation/redemption, spread dei sottostanti, rischio di copertura) **contano poco**. Restano rilevanti il profitto del market maker e lo sconto per l'ordine opposto."}]}, "keyPoints": ["Spread stretto = liquidità alta, volume alto, molta concorrenza, bassa volatilità", "Spread ETF ≤ fee ± spread sottostanti + rischio copertura + profitto MM − sconto ordine opposto", "ETF molto liquidi: gli ordini si incrociano senza creation/redemption"], "examTips": ["Per gli ETF molto liquidi lo spread dei sottostanti è il fattore che conta MENO", "Volatilità e spread si muovono nella stessa direzione"], "question": {"q": "Which of the following is least likely to influence the bid-ask spread for very liquid, high-volume ETFs?", "options": ["The desired profit spread of the authorized participant.", "Discount related to the likelihood of receiving an offsetting ETF order in a short time frame.", "Bid-ask spread of the underlying securities held by the ETF."], "ans": 2, "exp": "Negli ETF molto liquidi la maggior parte degli scambi si incrocia rapidamente senza passare dal processo di creation/redemption. I primi tre termini della scomposizione, tra cui lo spread dei titoli sottostanti, contribuiscono quindi poco allo spread dell'ETF."}}, {"id": "e", "code": "LOS 39e", "title": "Descrivere le fonti di premi e sconti degli ETF rispetto al NAV", "commandWord": "Descrivere", "importance": "VERY HIGH", "content": {"introduction": "Il **NAV** di un ETF si calcola a fine giornata. Se il prezzo di borsa è sopra il NAV, l'ETF tratta **a premio**; se è sotto, **a sconto**. Durante la giornata si usa l'**iNAV** (intraday NAV), calcolato sui titoli del creation basket.", "sections": [{"title": "Le formule", "icon": "📐", "content": "$$\\text{Premio/sconto di fine giornata} = \\frac{\\text{Prezzo ETF} - \\text{NAV per quota}}{\\text{NAV per quota}}$$\n\n$$\\text{Premio/sconto intraday} = \\frac{\\text{Prezzo ETF} - \\text{iNAV per quota}}{\\text{iNAV per quota}}$$\n\nRisultato positivo = premio; negativo = sconto."}, {"title": "Fonte 1: timing difference", "icon": "⏰", "content": "I titoli sottostanti e l'ETF possono chiudere a orari diversi.\n\n• **Titoli esteri**: un ETF quotato negli USA che detiene azioni europee chiude ore dopo i mercati europei. Il NAV usa prezzi europei \"vecchi\", quindi è un cattivo indicatore del fair value.\n• **Obbligazioni**: non trattano in borsa, quindi il NAV si basa sui prezzi **bid** dei dealer. Il prezzo di chiusura dell'ETF tende a stare sopra questi bid, e l'ETF obbligazionario sembra **a premio**.\n• Nelle fasi di stress, invece, gli ETF obbligazionari molto scambiati tendono a trattare **a sconto**."}, {"title": "Fonte 2: stale pricing", "icon": "🕸️", "content": "Uno **stale price** è un prezzo che non incorpora informazioni recenti.\n\n• Se l'ETF non ha scambiato nelle ultime ore prima della chiusura, mentre il mercato si muoveva molto, il suo ultimo prezzo non riflette quei movimenti → premio o sconto apparente rispetto al NAV.\n• Quando il mercato sottostante è chiuso o poco liquido, il **prezzo dell'ETF** può essere più affidabile del NAV: è lui a fare da \"price discovery\"."}, {"title": "Esempio svolto", "icon": "✏️", "content": "Prezzo ETF = $42,55; NAV = $30,11; iNAV = $36,13\n\n**Passo 1, premio intraday:**\n$$\\frac{42{,}55 - 36{,}13}{36{,}13} = \\frac{6{,}42}{36{,}13} = 17{,}77\\%$$\n\n**Passo 2, premio di fine giornata:**\n$$\\frac{42{,}55 - 30{,}11}{30{,}11} = \\frac{12{,}44}{30{,}11} = 41{,}32\\%$$\n\nEntrambi positivi: l'ETF tratta a premio."}]}, "keyPoints": ["Prezzo > NAV = premio; prezzo < NAV = sconto", "Fine giornata si usa il NAV, durante la giornata l'iNAV", "Fonti: timing difference e stale pricing", "ETF obbligazionari: NAV sui bid → premio apparente"], "examTips": ["Il denominatore è sempre il NAV (o iNAV), non il prezzo dell'ETF", "Con mercati sottostanti chiusi il prezzo dell'ETF può essere più 'vero' del NAV"], "question": {"q": "Consider an ETF with a share price of $42.55. Additionally, its net asset value and intraday net asset value are $30.11 and $36.13, respectively. Which of the following most correctly gives the intraday and end-of-day ETF premiums?", "options": ["Intraday ETF premium: 17.77%; End-of-day ETF premium: 41.32%.", "Intraday ETF premium: 15.09%; End-of-day ETF premium: 41.32%.", "Intraday ETF premium: 17.77%; End-of-day ETF premium: 26.44%."], "ans": 0, "exp": "Intraday = (42,55 − 36,13) / 36,13 = 17,77%. Fine giornata = (42,55 − 30,11) / 30,11 = 41,32%. Le altre opzioni usano il prezzo dell'ETF al denominatore (15,09%) o mescolano NAV e iNAV (26,44%)."}}, {"id": "f", "code": "LOS 39f", "title": "Descrivere i costi di possesso di un ETF", "commandWord": "Descrivere", "importance": "VERY HIGH", "content": {"introduction": "Possedere un ETF costa in due modi: **costi espliciti** (management fee, commissioni, imposte sui guadagni realizzati) e **costi impliciti** (tracking error, bid-ask spread, premio/sconto al NAV, turnover del portafoglio, security lending). Alcuni possono essere positivi per l'investitore (es. comprare a sconto, ricavi da security lending).", "sections": [{"title": "Le formule", "icon": "📐", "content": "**Costo di andata e ritorno (round-trip):**\n$$\\text{Round-trip} = (\\text{commissione one-way \\%} \\times 2) + \\left(\\tfrac{1}{2}\\,\\text{spread \\%} \\times 2\\right)$$\n\nSi paga la commissione due volte (acquisto e vendita) e metà spread a ogni passaggio, cioè lo spread intero in totale.\n\n**Costo di detenzione (holding period cost):**\n$$\\text{Holding cost} = \\text{Round-trip} + \\text{Management fee annua} \\times \\frac{\\text{mesi}}{12}$$"}, {"title": "Esempio svolto: round-trip", "icon": "✏️", "content": "Commissione = $4 su un'operazione da $10.000; spread = 0,12%\n\n**Passo 1, commissione one-way in %:**\n$$\\frac{4}{10.000} = 0{,}04\\%$$\n\n**Passo 2, round-trip:**\n$$(0{,}04\\% \\times 2) + \\left(\\tfrac{1}{2} \\times 0{,}12\\% \\times 2\\right) = 0{,}08\\% + 0{,}12\\% = 0{,}20\\%$$"}, {"title": "Esempio svolto: holding cost a 4 mesi, 1 anno, 2 anni", "icon": "⏳", "content": "Stessi dati, management fee annua = 0,12%\n\n$$\\text{4 mesi} = 0{,}20\\% + \\tfrac{4}{12} \\times 0{,}12\\% = 0{,}24\\%$$\n$$\\text{12 mesi} = 0{,}20\\% + \\tfrac{12}{12} \\times 0{,}12\\% = 0{,}32\\%$$\n$$\\text{2 anni} = 0{,}20\\% + \\tfrac{24}{12} \\times 0{,}12\\% = 0{,}44\\%$$\n\n| Orizzonte | 4 mesi | 12 mesi | 2 anni |\n|---|---|---|---|\n| Commissioni | 0,08% | 0,08% | 0,08% |\n| Bid-ask spread | 0,12% | 0,12% | 0,12% |\n| Management fee | 0,04% | 0,12% | 0,24% |\n| **Totale** | **0,24%** | **0,32%** | **0,44%** |\n\nPeso dei costi di negoziazione sul totale: 0,20/0,24 = **83%** a 4 mesi, 0,20/0,32 = **62,5%** a 12 mesi, 0,20/0,44 = **45%** a 2 anni."}, {"title": "La lezione", "icon": "💡", "content": "• **Orizzonti brevi**: dominano i costi di negoziazione (commissioni e spread) → conta scegliere ETF liquidi con spread stretti.\n• **Orizzonti lunghi**: domina la management fee, che cresce con il tempo → conta scegliere ETF con expense ratio basso.\n\n(Il calcolo ignora l'effetto della capitalizzazione composta.)"}]}, "keyPoints": ["Costi espliciti: fee, commissioni, tasse; impliciti: spread, tracking error, premio/sconto", "Round-trip = 2 × commissione + spread intero", "Holding cost = round-trip + fee × (mesi/12)", "Breve periodo: pesano i costi di trading; lungo periodo: pesa la fee"], "examTips": ["Errore tipico: dimenticare di raddoppiare la commissione", "Lo spread si conta per intero nel round-trip (metà in entrata, metà in uscita)"], "question": {"q": "Jayson Smith is an investor who pays a commission of $8 on a $22,000 trade. He also spends 0.14% on the bid-ask spread. Smith's round-trip trading cost is closest to:", "options": ["0.036%.", "0.248%.", "0.212%."], "ans": 2, "exp": "Commissione one-way = 8 / 22.000 = 0,036%. Round-trip = (0,036% × 2) + (½ × 0,14% × 2) = 0,072% + 0,14% = 0,212%. A è solo la commissione one-way; B dimentica di dimezzare lo spread a ogni passaggio."}}, {"id": "g", "code": "LOS 39g", "title": "Descrivere i tipi di rischio degli ETF", "commandWord": "Descrivere", "importance": "HIGH", "content": {"introduction": "Gli ETF hanno tre grandi famiglie di rischio oltre al rischio di mercato: **rischio di controparte**, **rischio di chiusura del fondo** e **rischio legato all'investitore** (non capire cosa si compra, soprattutto con ETF a leva e inversi).", "sections": [{"title": "Counterparty risk", "icon": "🤝", "content": "Il rischio che una controparte non adempia.\n\n• **Settlement risk**: tipico degli ETF che usano derivati OTC (swap). Si riduce regolando spesso i contratti, così l'esposizione verso la controparte resta piccola.\n• **Security lending**: il fondo presta titoli (es. a short seller). Se chi li ha presi non li restituisce, il fondo perde. Si riduce con l'**over-collateralization** (garanzie superiori al valore prestato)."}, {"title": "Fund closure", "icon": "🚪", "content": "Un ETF può chiudere: vende i titoli e restituisce la liquidità agli investitori. Cause:\n\n• **Regolamentazione**: nuove regole rendono il fondo non più gestibile.\n• **Concorrenza**: troppi ETF simili, i fondi piccoli chiudono.\n• **Corporate action**: fusioni tra provider, i nuovi proprietari chiudono i fondi meno performanti.\n• **Creation halt**: il fondo sospende le creazioni, l'arbitraggio non funziona più e l'ETF tratta a premio (tipico degli ETN).\n• **Cambio di strategia**: il gestore cambia l'indice sottostante → \"chiusura virtuale\"."}, {"title": "Investor-related risk e ETF a leva", "icon": "🎢", "content": "Chi non capisce l'esposizione reale dell'ETF rischia di più. I casi più delicati sono gli **ETF leveraged e inverse**: devono **resettare ogni giorno** l'esposizione per dare il multiplo promesso del rendimento **giornaliero**. Su più giorni il risultato non è il multiplo del rendimento del periodo."}, {"title": "Esempio svolto: reset di un ETF 3x", "icon": "✏️", "content": "ETF a leva 3x sull'S&P 500. NAV = $150, esposizione nozionale = $200 (dato del problema). Rendimento dell'indice in giornata = +10%.\n\n**Passo 1, esposizione a fine giornata:**\n$$200 + 200 \\times 10\\% = \\$220$$\n\n**Passo 2, NAV a fine giornata:**\n$$150 \\times (1 + 3 \\times 10\\%) = \\$195$$\n\n**Passo 3, esposizione necessaria per domani (3 × NAV):**\n$$195 \\times 3 = \\$585$$\n\n**Passo 4, quanto aumentare lo swap:**\n$$585 - 220 = \\$365$$"}]}, "keyPoints": ["Controparte: settlement risk (OTC) e security lending (over-collateralization)", "Chiusura: regole, concorrenza, M&A, creation halt, cambio strategia", "ETF a leva/inversi: reset giornaliero dell'esposizione", "Esposizione necessaria = leva × NAV di fine giornata"], "examTips": ["Nel calcolo del reset: esposizione nuova − esposizione aggiornata dal rendimento", "Creation halt → l'ETF tratta a premio (l'arbitraggio non funziona)"], "question": {"q": "Consider an ETF that offers a 300% exposure to the benchmark index with a net asset value of $125 and a notional exposure of $140. The one-day S&P 500 Index return is 6%. The increase in the notional swap exposure is closest to:", "options": ["$442.50.", "$294.10.", "$295.90."], "ans": 1, "exp": "Esposizione a fine giornata = 140 × 1,06 = $148,40. NAV di fine giornata = 125 × (1 + 3 × 6%) = $147,50. Esposizione necessaria = 147,50 × 3 = $442,50. Aumento dello swap = 442,50 − 148,40 = $294,10."}}, {"id": "h", "code": "LOS 39h", "title": "Identificare e descrivere gli usi degli ETF in portafoglio", "commandWord": "Identificare", "importance": "MEDIUM", "content": {"introduction": "Asset manager e consulenti usano gli ETF in tre modi: per **gestire il portafoglio in modo efficiente**, per **controllare l'esposizione alle asset class** e per **strategie attive e fattoriali**, su base strategica, tattica o dinamica.", "sections": [{"title": "Gestione efficiente del portafoglio", "icon": "⚙️", "content": "• **Gestione della liquidità**: investire subito afflussi di cassa ed evitare il cash drag mantenendo l'esposizione al benchmark.\n• **Ribilanciamento**: riportare il portafoglio ai pesi target con ETF liquidi e a spread stretto.\n• **Portfolio completion**: colmare buchi di esposizione (es. small cap internazionali, real asset).\n• **Transition management**: mantenere l'esposizione al benchmark mentre si cambia gestore e si vendono i titoli del gestore uscente."}, {"title": "Esposizione alle asset class", "icon": "🧭", "content": "• **Core exposure**: costruire il nucleo di un portafoglio diversificato (azioni domestiche e internazionali, obbligazioni). Dopo il 2008 gli ETF obbligazionari sono diventati un modo liquido ed efficiente per averla.\n• **Strategie tattiche**: ETF settoriali o tematici per esprimere una view di breve periodo; la liquidità li rende adatti al trading tattico."}, {"title": "Active e factor investing", "icon": "🎯", "content": "• **Factor exposure**: aggiungere fattori mancanti (value, momentum…) con factor ETF e verificarne l'efficacia.\n• **Risk management**: smart beta a bassa volatilità; gestione di equity beta, valuta e duration.\n• **Alternative weighting**: pesi diversi dalla capitalizzazione per esprimere una view.\n• **Discretionary active ETF**: ETF a gestione attiva (spesso obbligazionari).\n• **Dynamic asset allocation / multi-asset**: allocazione attiva tra asset class in base al profilo di rischio."}]}, "keyPoints": ["Tre famiglie d'uso: efficienza, esposizione alle asset class, active/factor", "Usi operativi: liquidità, ribilanciamento, completion, transition", "Usi tattici: settoriali/tematici per view di breve"], "examTips": ["Gli ETF NON servono a misurare il tracking error: distrattore tipico", "Transition management = mantenere il beta mentre si cambia gestore"], "question": {"q": "ETFs are important tools for investors across markets. Which one of the following is least likely true about the applications of ETFs in portfolio management?", "options": ["ETFs are used in portfolio rebalancing.", "ETFs are used for portfolio liquidity management.", "ETFs are used to measure tracking error."], "ans": 2, "exp": "Gli ETF non si usano per misurare il tracking error. Tra gli usi in portafoglio ci sono ribilanciamento, gestione della liquidità, esposizione ai fattori, gestione del rischio e transition management."}}]}, {"id": "pm-r40", "number": 40, "title": "Using Multifactor Models", "estimatedTime": "4-5 ore", "totalLOS": 7, "los": [{"id": "a", "code": "LOS 40a", "title": "Descrivere l'arbitrage pricing theory (APT), le sue assunzioni e la sua relazione con i multifactor model", "commandWord": "Descrivere", "importance": "HIGH", "content": {"introduction": "L'**APT** (arbitrage pricing theory, Stephen Ross, 1976) dice che il rendimento atteso di un asset è una **funzione lineare di più fattori di rischio sistematico** prezzati dal mercato. Nasce come alternativa al CAPM, che usa un solo fattore (il mercato).", "sections": [{"title": "Le tre assunzioni", "icon": "🧱", "content": "1. I rendimenti degli asset sono spiegati da **fattori sistematici**.\n2. Nei portafogli ben diversificati **non esistono opportunità di arbitraggio** (non si può guadagnare senza rischio e senza investire).\n3. Con la diversificazione il **rischio specifico** dei singoli titoli si elimina.\n\nL'APT **non** richiede che gli investitori decidano solo su media e varianza, né che esista un portafoglio di mercato: sono assunzioni del CAPM."}, {"title": "L'equazione dell'APT", "icon": "📐", "content": "$$E(R_i) = R_F + \\beta_{i1}\\lambda_1 + \\beta_{i2}\\lambda_2 + \\dots + \\beta_{iK}\\lambda_K$$\n\n• \\(E(R_i)\\) = rendimento atteso del portafoglio ben diversificato \\(i\\)\n• \\(R_F\\) = rendimento del portafoglio a beta zero (in pratica il risk-free)\n• \\(\\beta_{ij}\\) = sensibilità del portafoglio \\(i\\) al fattore \\(j\\)\n• \\(\\lambda_j\\) = **premio per il rischio** del fattore \\(j\\) (quanto il mercato paga per una unità di esposizione a quel fattore)\n\nIn parole: rendimento atteso = risk-free + somma di (esposizione × prezzo del rischio) per ogni fattore."}, {"title": "APT, CAPM e multifactor model", "icon": "🔗", "content": "• **CAPM**: un solo fattore (il mercato), equilibrio basato su media-varianza.\n• **APT**: più fattori, equilibrio basato sull'assenza di arbitraggio; **non dice quali siano** i fattori.\n• **Multifactor model**: l'applicazione pratica dell'APT, dove si scelgono i fattori (inflazione, produzione industriale, spread tra tassi lunghi e brevi, spread di credito…).\n\nIl CAPM si può vedere come un caso particolare dell'APT con un solo fattore."}]}, "keyPoints": ["APT: rendimento atteso lineare in più fattori sistematici", "Assunzioni: fattori sistematici, niente arbitraggio, rischio specifico diversificabile", "λ = premio per il rischio del fattore, β = sensibilità", "L'APT non specifica quali e quanti siano i fattori"], "examTips": ["Distrattore classico: 'decisioni basate solo su media, varianza e correlazioni' → è il CAPM", "APT = Arbitraggio; CAPM = Mercato e media-varianza"], "question": {"q": "Which of the following statements is the most accurate about the APT model?", "options": ["Returns from the assets can be explained using systematic factors.", "Only three factors are considered under this model.", "Investors' portfolio decisions can be made, considering just returns' means, variances, and correlations."], "ans": 0, "exp": "L'APT assume che i rendimenti siano spiegati da fattori sistematici, che il rischio non sistematico si possa diversificare e che non esistano arbitraggi. B è sbagliata: il numero di fattori non è fissato. C descrive un'assunzione del CAPM."}}, {"id": "b", "code": "LOS 40b", "title": "Definire l'opportunità di arbitraggio e determinare se esiste", "commandWord": "Determinare", "importance": "VERY HIGH", "content": {"introduction": "Un **arbitraggio** è un'operazione che **non costa nulla** (né oggi né in futuro), **non ha rischio di perdita** e offre un **profitto positivo** oggi o in futuro. Nell'APT si cerca confrontando portafogli con le **stesse esposizioni ai fattori** ma rendimenti attesi diversi.", "sections": [{"title": "Il metodo in 4 passi", "icon": "🔍", "content": "1. Con due portafogli (A e B) costruisci un portafoglio **D** che abbia **le stesse beta** del portafoglio da testare (C). I pesi di A e B devono sommare a 1.\n2. Calcola il rendimento atteso di D come media ponderata.\n3. Confronta: stesso rischio ma rendimento diverso → c'è arbitraggio.\n4. **Compra quello che rende di più, vendi allo scoperto quello che rende di meno**: investimento netto zero, rischio fattoriale zero, profitto positivo."}, {"title": "Esempio svolto", "icon": "✏️", "content": "Modello a due fattori:\n\n| Portafoglio | E(R) | β₁ | β₂ |\n|---|---|---|---|\n| A | 12% | 1,0 | 0,4 |\n| B | 16% | 0,8 | 0,8 |\n| C | 12% | 0,9 | 0,6 |\n\n**Passo 1**, portafoglio D = 50% A + 50% B:\n$$\\beta_1^D = 0{,}5(1{,}0) + 0{,}5(0{,}8) = 0{,}9 \\qquad \\beta_2^D = 0{,}5(0{,}4) + 0{,}5(0{,}8) = 0{,}6$$\nD ha le stesse esposizioni di C.\n\n**Passo 2**, rendimento atteso di D:\n$$E(R_D) = 0{,}5(12\\%) + 0{,}5(16\\%) = 14\\%$$\n\n**Passo 3**: stesso rischio, ma D rende 14% e C rende 12% → C è **sopravvalutato**.\n\n**Passo 4**: compra D e vendi allo scoperto C → guadagno di \\(14\\% - 12\\% = 2\\%\\) senza rischio fattoriale e senza capitale.\n\nGli arbitraggisti vendono C, il suo prezzo scende e il suo rendimento atteso sale finché non torna in equilibrio."}, {"title": "Sopravvalutato o sottovalutato?", "icon": "🧠", "content": "• Il portafoglio replicante rende **di più** del portafoglio testato → il testato è **sopravvalutato** (prezzo troppo alto, rendimento troppo basso) → si vende.\n• Il portafoglio replicante rende **di meno** → il testato è **sottovalutato** → si compra.\n\nL'APT assume che gli investitori possano prendere posizioni long e short illimitate, quindi i mispricing spariscono subito."}]}, "keyPoints": ["Arbitraggio = costo zero, rischio zero, profitto positivo", "Si replica il portafoglio con le stesse beta e pesi che sommano a 1", "Rendimento più basso a parità di rischio = sopravvalutato → short", "L'arbitraggio riporta i prezzi in equilibrio"], "examTips": ["Imposta sempre il vincolo x + y = 1 prima di risolvere sui beta", "Attenzione a 'least likely true': trova la valutazione corretta e scegli l'opposto"], "question": {"q": "An investment firm uses a factor model to evaluate assets. Consider the following data for portfolios ABC, XYZ, and MNO:\nABC: E(R) 20%, β1 1.00, β2 0.50\nXYZ: E(R) 15%, β1 0.80, β2 0.40\nMNO: E(R) 17%, β1 0.92, β2 0.46\nWhich of the following statements is least likely true about portfolio MNO?", "options": ["It is overvalued.", "It is undervalued.", "It is fairly valued."], "ans": 1, "exp": "Con pesi x + y = 1 e x + 0,8y = 0,92 si ottiene x = 0,6 (ABC) e y = 0,4 (XYZ): anche β2 coincide (0,5·0,6 + 0,4·0,4 = 0,46). Il portafoglio replicante rende 0,6·20% + 0,4·15% = 18%, più di MNO (17%). MNO è quindi sopravvalutato: si vende MNO e si compra il replicante. L'affermazione meno probabile è che sia sottovalutato."}}, {"id": "c", "code": "LOS 40c", "title": "Calcolare il rendimento atteso di un asset date le factor sensitivity e i factor risk premium", "commandWord": "Calcolare", "importance": "VERY HIGH", "content": {"introduction": "Ci sono due formule da non confondere. Il **modello multifattoriale** spiega il rendimento **realizzato** partendo dal rendimento atteso più le **sorprese** dei fattori. L'**APT** dà il rendimento **atteso** partendo dal risk-free più i **premi per il rischio**.", "sections": [{"title": "Modello a uno o più fattori (rendimento realizzato)", "icon": "📐", "content": "Un fattore:\n$$R_i = E(R_i) + \\beta_i F + \\varepsilon_i$$\n\nPiù fattori:\n$$R_i = E(R_i) + \\beta_{i1}F_1 + \\beta_{i2}F_2 + \\dots + \\beta_{ik}F_k + \\varepsilon_i$$\n\n• \\(F_k\\) = **sorpresa** del fattore \\(k\\) (valore realizzato − valore atteso)\n• \\(\\varepsilon_i\\) = sorpresa specifica dell'impresa (zero se non ci sono notizie sull'azienda)\n\nSe tutte le sorprese sono zero, il titolo rende esattamente il suo rendimento atteso."}, {"title": "APT (rendimento atteso)", "icon": "📐", "content": "$$E(R_i) = R_F + \\beta_{i1}\\lambda_1 + \\beta_{i2}\\lambda_2 + \\dots + \\beta_{iK}\\lambda_K$$\n\nQui al posto delle sorprese ci sono i **premi per il rischio** \\(\\lambda\\) e al posto del rendimento atteso c'è il **risk-free**."}, {"title": "Esempio 1: un fattore", "icon": "✏️", "content": "Blue Ray Limited: β sul PIL = 1,5; sorpresa del PIL = 4%; rendimento atteso = 10%; nessuna notizia specifica.\n\n$$R = 10\\% + 1{,}5 \\times 4\\% + 0 = 16\\%$$"}, {"title": "Esempio 2: due fattori", "icon": "✏️", "content": "β PIL = 1,5 con sorpresa 2%; β tassi = 2,0 con sorpresa 1%; rendimento atteso 10%.\n\n$$R = 10\\% + 1{,}5 \\times 2\\% + 2{,}0 \\times 1\\% = 10\\% + 3\\% + 2\\% = 15\\%$$"}, {"title": "Esempio 3: APT a due fattori", "icon": "✏️", "content": "Risk-free = 6%; fattore 1: β = 1,5, λ = 2%; fattore 2: β = 1,2, λ = 3%.\n\n$$E(R_A) = 6\\% + 1{,}5(2\\%) + 1{,}2(3\\%) = 6\\% + 3\\% + 3{,}6\\% = 12{,}6\\%$$"}]}, "keyPoints": ["Modello multifattoriale: E(R) + β × sorpresa + ε", "APT: risk-free + β × premio per il rischio", "Sorpresa = realizzato − atteso", "Nessuna notizia sull'azienda → ε = 0"], "examTips": ["Guarda le parole: 'surprise' → modello multifattoriale; 'risk premium' → APT", "Controlla i segni: una sorpresa negativa con beta negativo AUMENTA il rendimento"], "question": {"q": "The following data exists for a portfolio A:\nFactor betas: GDP 0.5, Interest Rate 0.4, Inflation 0.6\nSurprise in factors: GDP 2%, Interest Rate 1%, Inflation 3%\nWhich of the following is the most accurate return for portfolio A calculated using a three-factor general multifactor model, given that the expected return is 12%?", "options": ["13.2%", "14.2%", "15.2%"], "ans": 2, "exp": "R = 12% + 0,5 × 2% + 0,4 × 1% + 0,6 × 3% = 12% + 1% + 0,4% + 1,8% = 15,2%."}}, {"id": "d", "code": "LOS 40d", "title": "Descrivere e confrontare macroeconomic, fundamental e statistical factor model", "commandWord": "Confrontare", "importance": "VERY HIGH", "content": {"introduction": "I modelli multifattoriali si dividono in tre famiglie in base a **cosa usano come fattori** e **come stimano le sensibilità**: macroeconomici, fondamentali e statistici.", "sections": [{"title": "1. Macroeconomic factor model", "icon": "🌍", "content": "**Fattori**: sorprese di variabili macro osservabili (inflazione, crescita, tassi, cambi).\n**Sensibilità**: stimate con una **regressione time-series** sui rendimenti storici.\n\n$$R_i = E(R_i) + b_{i1}F_1 + b_{i2}F_2 + \\dots + b_{ik}F_k + \\varepsilon_i$$\n\n**Limite**: bisogna identificare e misurare tutti gli shock che contano, e alcuni possono essere ignoti o senza dati.\n\n**Esempio**: E(R) = 15%; sorpresa F₁ = +3% con b = 1,3; sorpresa F₂ = −2% con b = −0,3.\n$$R = 15\\% + 1{,}3(3\\%) + (-0{,}3)(-2\\%) = 15\\% + 3{,}9\\% + 0{,}6\\% = 19{,}5\\%$$"}, {"title": "2. Fundamental factor model", "icon": "🏢", "content": "**Fattori**: rendimenti associati ad **attributi delle aziende** (dimensione, book-to-market, dividend yield, settore).\n**Sensibilità**: calcolate direttamente dagli attributi, **standardizzate**; i rendimenti dei fattori si stimano con una **regressione cross-sectional**.\n\n$$R_i = \\alpha_i + \\beta_{i1}F_1 + \\dots + \\beta_{ik}F_k + \\varepsilon_i$$\n\nSensibilità standardizzata (es. al P/E):\n$$\\beta_{A1} = \\frac{F_{A1} - \\bar{F}_1}{\\sigma_{F_1}}$$\n\ncioè quante deviazioni standard l'attributo dell'azienda A dista dalla media di tutte le aziende. L'intercetta \\(\\alpha\\) **non** è il rendimento atteso."}, {"title": "3. Statistical factor model", "icon": "📊", "content": "**Fattori**: estratti dai rendimenti storici con la **principal components analysis**, cercando le combinazioni che spiegano più varianza possibile.\n\n**Pro**: poche ipotesi a priori.\n**Contro**: i fattori spesso **non hanno un significato economico** e cambiano molto tra dataset diversi.\n\nSia i modelli statistici sia quelli macro richiedono una **serie storica lunga e stabile** per stimare bene le beta."}, {"title": "Confronto rapido", "icon": "📋", "content": "| | Macro | Fondamentale | Statistico |\n|---|---|---|---|\n| Fattori | Sorprese macro | Attributi aziendali | Componenti principali |\n| Sensibilità | Regressione time-series | Attributi standardizzati | Dai dati |\n| Fattori stimati con | Dati osservati | Regressione cross-section | PCA |\n| Interpretazione | Chiara | Chiara | Spesso assente |"}]}, "keyPoints": ["Macro: sorprese macro, beta da time-series", "Fondamentale: attributi aziendali standardizzati, fattori da cross-section", "Statistico: PCA, fattori senza significato economico", "Nel fondamentale l'intercetta non è il rendimento atteso"], "examTips": ["Trucco: Macro = Mondo esterno; Fondamentale = Foto dell'azienda; Statistico = Solo numeri", "Standardized sensitivity = (valore − media) / deviazione standard"], "question": {"q": "The following data exists for stock A of company X:\nSurprise sensitivities: GDP 1.1, Interest Rate 0.8, Deflation −0.1\nSurprise in factors: GDP 2%, Interest Rate 1%, Deflation (3)%\nWhich of the following is the most accurate return for stock A calculated using a three-factor macroeconomic factor model, given that the expected return is 8% and the company experienced a 2% surprise return?", "options": ["8.3%", "10.3%", "13.3%"], "ans": 2, "exp": "R = 8% + 1,1 × 2% + 0,8 × 1% + (−0,1) × (−3%) + 2% = 8% + 2,2% + 0,8% + 0,3% + 2% = 13,3%. Non dimenticare la sorpresa specifica dell'azienda (+2%). Nota: nel PDF la sensibilità alla deflazione compariva come 0,1, ma la soluzione usa −0,1; qui i dati sono stati resi coerenti."}}, {"id": "e", "code": "LOS 40e", "title": "Spiegare le fonti di active risk e interpretare il tracking risk e l'information ratio", "commandWord": "Interpretare", "importance": "VERY HIGH", "content": {"introduction": "Un gestore attivo si allontana dal benchmark per batterlo. Quanto se ne allontana in rendimento è l'**active return**; quanto è variabile questo scostamento è l'**active risk** (o tracking error). L'**information ratio** misura quanto active return ottiene per ogni unità di active risk.", "sections": [{"title": "Le formule", "icon": "📐", "content": "$$\\text{Active return} = R_P - R_B$$\n\n$$\\text{Active risk} = TE = s\\,(R_P - R_B)$$\n(deviazione standard campionaria degli active return)\n\n$$IR = \\frac{\\bar{R}_P - \\bar{R}_B}{s\\,(R_P - R_B)}$$\n\n• **TE basso**: il portafoglio segue da vicino il benchmark.\n• **TE alto**: il portafoglio si discosta molto dal benchmark.\n• **IR alto**: il gestore ottiene molto active return per il rischio attivo che prende (più skill e più costanza). Gli investitori **preferiscono un IR alto**."}, {"title": "Esempio svolto", "icon": "✏️", "content": "| Periodo | \\(R_P\\) | \\(R_B\\) | \\(R_P - R_B\\) |\n|---|---|---|---|\n| 1 | 2,11% | 1,11% | +1,00% |\n| 2 | 0,91% | 1,12% | −0,21% |\n| 3 | 1,28% | 0,91% | +0,37% |\n| 4 | 0,83% | 0,92% | −0,09% |\n| 5 | 1,60% | 1,11% | +0,49% |\n| 6 | 1,91% | 1,83% | +0,08% |\n| **Media** | **1,44%** | **1,17%** | **+0,27%** |\n\n**Passo 1**: active return medio = 1,44% − 1,17% = 0,27%\n**Passo 2**: deviazione standard campionaria degli active return (n − 1 al denominatore) = 0,44%\n**Passo 3**:\n$$IR = \\frac{0{,}27\\%}{0{,}44\\%} \\approx 0{,}62$$\n\n(Il PDF riporta 0,41% e IR 0,66: con n − 1 il valore corretto è 0,44% e 0,62.)"}, {"title": "Come leggerlo", "icon": "🧠", "content": "Gli active return vanno da −0,21% a +1,00% in periodi da circa l'1%: il portafoglio **si discosta parecchio** dal benchmark, cioè ha un tracking risk non trascurabile rispetto al rendimento.\n\nIl IR di 0,62 per periodo è positivo e discreto: il gestore ha aggiunto valore, ma con una certa variabilità."}]}, "keyPoints": ["Active return = R_P − R_B", "Active risk = tracking error = dev. standard degli active return", "IR = active return medio / tracking error", "Gli investitori preferiscono IR alto"], "examTips": ["Usa la deviazione standard campionaria (n − 1)", "TE misura quanto il portafoglio è 'volatile rispetto al benchmark', non la volatilità assoluta"], "question": {"q": "Using the following data (portfolio returns 0.0211, 0.0091, 0.0128, 0.0083, 0.0160, 0.0191; benchmark returns 0.0111, 0.0112, 0.0091, 0.0092, 0.0111, 0.0183), which of the following is most likely correct about the portfolio relative to the benchmark?", "options": ["It is close to the benchmark.", "It is volatile relative to the benchmark.", "It has a low information ratio."], "ans": 1, "exp": "Gli active return vanno da −0,21% a +1,00% con una deviazione standard di circa 0,44% per periodo, ampia rispetto all'active return medio (0,27%): il portafoglio è volatile rispetto al benchmark. A è sbagliata perché non lo segue da vicino. C è sbagliata: un IR di circa 0,62 non è basso. Nota: la spiegazione del PDF dice che gli investitori preferiscono un IR basso, ma è il contrario."}}, {"id": "f", "code": "LOS 40f", "title": "Descrivere gli usi dei multifactor model e interpretarne l'output", "commandWord": "Interpretare", "importance": "VERY HIGH", "content": {"introduction": "I multifactor model servono a tre cose: **return attribution** (da dove viene l'extra-rendimento), **risk attribution** (da dove viene il rischio attivo) e **costruzione del portafoglio** (passiva o attiva).", "sections": [{"title": "Return attribution", "icon": "📐", "content": "L'active return si divide in due parti:\n$$\\text{Active return} = \\text{Factor return} + \\text{Security selection return}$$\n\n$$\\text{Factor return} = \\sum_{i=1}^{k}\\left(\\beta_{Pi} - \\beta_{Bi}\\right)\\lambda_i$$\n\n• **Factor return**: viene dalle scommesse sui fattori (esposizioni diverse dal benchmark).\n• **Security selection**: viene dalla scelta dei singoli titoli; si ottiene **per differenza**:\n$$\\text{Security selection} = \\text{Active return} - \\text{Factor return}$$"}, {"title": "Esempio: return decomposition", "icon": "✏️", "content": "Fondo ABC = 10,68%; benchmark = 10,54%.\n\n| | PIL | Inflazione |\n|---|---|---|\n| β portafoglio | 0,80 | 1,50 |\n| β benchmark | 1,20 | 1,20 |\n| λ (premio) | 4,00% | −2,00% |\n\n**Passo 1**, factor return:\n$$(0{,}8 - 1{,}2)(4\\%) + (1{,}5 - 1{,}2)(-2\\%) = -1{,}6\\% - 0{,}6\\% = -2{,}2\\%$$\n\n**Passo 2**, active return = 10,68% − 10,54% = 0,14%\n\n**Passo 3**, security selection:\n$$0{,}14\\% - (-2{,}2\\%) = 2{,}34\\%$$\n\nLe scommesse sui fattori sono andate male (−2,2%), ma la scelta dei titoli (+2,34%) ha più che compensato."}, {"title": "Risk attribution", "icon": "📐", "content": "$$(\\text{Active risk})^2 = \\text{Active factor risk} + \\text{Active specific risk}$$\n\n• **Active factor risk**: viene dalle esposizioni ai fattori diverse dal benchmark.\n• **Active specific risk** (asset selection risk): viene dai pesi dei singoli titoli diversi dal benchmark:\n$$\\text{Active specific risk} = \\sum_{i=1}^{n}\\left(w_{Pi} - w_{Bi}\\right)^2\\sigma^2_{\\varepsilon i}$$\n\nAttenzione: si sommano le **varianze**, non le deviazioni standard."}, {"title": "Esempio: risk decomposition", "icon": "✏️", "content": "Contributi all'active risk al quadrato (varianza attiva):\n\n| Portafoglio | Fattore 1 | Fattore 2 | Tot. fattori | Specifico | Totale |\n|---|---|---|---|---|---|\n| A | 3,2 | 12,6 | 15,8 | 4,2 | 20,0 |\n| B | 8,3 | 0,2 | 8,5 | 16,5 | 25,0 |\n| C | 10,1 | 15,1 | 25,2 | 4,8 | 30,0 |\n\n**Chi ha più rischio dal fattore 2, in proporzione?**\nA = 12,6/20 = **63%**; B = 0,2/25 = 0,8%; C = 15,1/30 = 50,3% → **A**\n\n**Chi ha meno rischio specifico, in proporzione?**\nA = 4,2/20 = 21%; B = 16,5/25 = 66%; C = 4,8/30 = **16%** → **C**"}, {"title": "Costruzione del portafoglio e lettura dell'output", "icon": "🧭", "content": "• **Gestione passiva**: si costruisce un **tracking portfolio** con le stesse esposizioni ai fattori del benchmark.\n• **Gestione attiva**: si scommette su alcuni fattori restando neutrali sugli altri, usando **factor portfolio** (esposizione 1 a un fattore, 0 agli altri).\n\nEsempio con il modello Fama-French (RMRF = mercato, SMB = small meno big, HML = value meno growth):\n\n| Portafoglio | RMRF | SMB | HML |\n|---|---|---|---|\n| X | 1,5 | 0,1 | 0,0 |\n| Y | 1,2 | 0,0 | 0,0 |\n| Z | 0,0 | 0,0 | −1,0 |\n\n• Ti aspetti un mercato forte → **long Y** (solo esposizione al mercato; X ha esposizioni indesiderate a SMB).\n• Ti aspetti che i growth battano i value → **long Z** (HML negativo)."}]}, "keyPoints": ["Active return = factor return + security selection", "Factor return = Σ(β_P − β_B) × λ; selection per differenza", "Active risk² = factor risk + specific risk (varianze)", "Per scommettere su un fattore usa un portafoglio puro su quel fattore"], "examTips": ["Nei confronti di risk attribution guarda le PROPORZIONI sul totale, non i valori assoluti", "SMB positivo = small; per scommettere sulle large cap vai SHORT sul portafoglio SMB"], "question": {"q": "Consider the factor exposures of three portfolios evaluated with a Carhart four-factor model:\nA: RMRF 1.0, SMB 0.0, HML 0.0, WML 0.0\nB: RMRF 0.0, SMB 1.0, HML 0.0, WML 0.0\nC: RMRF 1.3, SMB 0.0, HML 0.3, WML 0.0\nWhich of the following would be the most appropriate strategy if a manager expects large-cap stocks to outperform small-cap stocks?", "options": ["Go long on portfolio B.", "Go long on portfolio B and short on portfolios A and C.", "Go short on portfolio B."], "ans": 2, "exp": "B è un portafoglio puro sul fattore SMB (small meno big): guadagna quando le small cap battono le large. Se ci si aspetta il contrario, si va short su B."}}, {"id": "g", "code": "LOS 40g", "title": "Descrivere i potenziali benefici per gli investitori nel considerare più dimensioni di rischio nella modellazione dei rendimenti", "commandWord": "Descrivere", "importance": "MEDIUM", "content": {"introduction": "Guardare il rischio su più dimensioni (più fattori invece del solo beta di mercato) permette all'investitore di capire davvero cosa possiede e se sta pagando il giusto per la gestione attiva.", "sections": [{"title": "I benefici", "icon": "🎁", "content": "• **Capire le esposizioni comparate** di azioni, obbligazioni e altre asset class, con una return e risk attribution dettagliata sui portafogli attivi.\n• **Controllare che il portafoglio aggregato rispetti l'active risk** voluto e che gli obiettivi siano coerenti con le **commissioni attive** pagate.\n• **Verificare** se il portafoglio complessivo soddisfa le aspettative di rendimento e la propensione al rischio.\n• **Costruire esposizioni intenzionali** a fattori che esprimono view macro (inflazione, crescita…)."}, {"title": "Cosa non è un beneficio per l'investitore", "icon": "🚫", "content": "Costruire portafogli che replicano il benchmark è un uso dei multifactor model da parte dei **gestori passivi**, non un beneficio diretto per l'investitore finale."}]}, "keyPoints": ["Più fattori = visione più granulare del rischio", "Aiuta a valutare se le fee attive sono giustificate", "Permette esposizioni intenzionali a view macro"], "examTips": ["La costruzione di tracking portfolio è un compito del gestore passivo, non un beneficio per l'investitore"], "question": {"q": "Which of the following is the least likely benefit of the use of multifactor modeling of asset returns for investors?", "options": ["It helps investors understand the comparative risk exposures of equity.", "It helps in the construction of portfolios that obtain a consistent result on the characteristics of the benchmark.", "It helps establish whether an investor's aggregate portfolio meets his return expectations and risk appetite."], "ans": 1, "exp": "Costruire portafogli coerenti con le caratteristiche del benchmark è il lavoro dei gestori passivi, non un beneficio per l'investitore. A e C sono benefici diretti: capire le esposizioni comparate e verificare che il portafoglio complessivo rispetti obiettivi di rendimento e propensione al rischio."}}]}, {"id": "pm-r41", "number": 41, "title": "Measuring and Managing Market Risk", "estimatedTime": "5-6 ore", "totalLOS": 12, "los": [{"id": "a", "code": "LOS 41a", "title": "Spiegare l'uso del value at risk (VaR) nella misurazione del rischio di portafoglio", "commandWord": "Spiegare", "importance": "VERY HIGH", "content": {"introduction": "Il **VaR** (value at risk) è una misura del rischio di ribasso: indica la **perdita minima** che ci si aspetta in uno scenario sfavorevole, con una data probabilità e in un dato orizzonte, in condizioni normali di mercato.", "sections": [{"title": "Definizione", "icon": "📐", "content": "Per una variabile continua \\(X\\) (rendimento o variazione di valore):\n$$VaR(X) = -t \\quad \\text{dove} \\quad P(X < t) = p$$\n\nTre ingredienti, sempre tutti presenti:\n• **un importo** (o una %): es. $7.500\n• **una probabilità** \\(p\\) (es. 5%) o un livello di confidenza \\(1 - p\\) (es. 95%)\n• **un orizzonte**: es. 1 giorno"}, {"title": "Come si legge", "icon": "🗣️", "content": "VaR giornaliero al 5% = $7.500 si può dire in due modi equivalenti:\n\n• **Lettura \"minima perdita\"**: c'è un 5% di probabilità di perdere **almeno** $7.500 in un giorno.\n• **Lettura \"confidenza\"**: siamo confidenti al 95% che la perdita in un giorno **non superi** $7.500.\n\nIl VaR **non** dice quanto si perde nel 5% peggiore: dice solo dove inizia la coda. Non è la \"perdita massima possibile\"."}]}, "keyPoints": ["VaR = soglia di perdita con probabilità p in un orizzonte", "Servono sempre importo, probabilità e orizzonte", "VaR al 5% ↔ confidenza al 95%", "Il VaR è una perdita MINIMA nella coda, non massima"], "examTips": ["La frase corretta è 'perdita di ALMENO X con probabilità p'", "Il VaR non dà la probabilità di perdere un importo esatto"], "question": {"q": "A hypothetical portfolio B has an annual 1% VaR of $45,000. Which of the following statements is most likely true about the portfolio?", "options": ["The expected minimum loss over one year, 1% of the time, is $45,000.", "There is a 99% probability that the expected loss over the next year is more than $45,000.", "The likelihood of losing $45,000 over the next year is 1%."], "ans": 0, "exp": "Un VaR annuo all'1% di $45.000 significa che nell'1% dei casi la perdita in un anno è di almeno $45.000. B inverte la frase: al 99% la perdita NON supera $45.000. C è sbagliata perché il VaR non dà la probabilità di perdere un importo preciso."}}, {"id": "b", "code": "LOS 41b", "title": "Confrontare i metodi parametrico (variance-covariance), simulazione storica e simulazione Monte Carlo per stimare il VaR", "commandWord": "Confrontare", "importance": "VERY HIGH", "content": {"introduction": "Il VaR si stima in tre modi. Cambia soprattutto **da dove vengono i rendimenti** usati per costruire la distribuzione: da una formula (parametrico), dal passato (storico) o da numeri generati a caso (Monte Carlo).", "sections": [{"title": "Metodo parametrico (variance-covariance)", "icon": "🔔", "content": "• Usa solo **media e deviazione standard** dei rendimenti (e le covarianze tra asset) stimate su un **lookback period**.\n• Assume una distribuzione, di solito **normale**, e legge il VaR dalla tavola della normale con lo z-score.\n• **Pro**: semplice e veloce, il metodo più usato.\n• **Contro**: se i rendimenti hanno code spesse (non normali) **sottostima** il rischio; funziona male con le opzioni (payoff non lineari)."}, {"title": "Simulazione storica", "icon": "📜", "content": "• Prende i **rendimenti effettivi** del lookback period, li applica al portafoglio di oggi e li **ordina dal peggiore al migliore**.\n• Il VaR è il rendimento al percentile scelto.\n• **Pro**: **nessuna ipotesi sulla distribuzione**; gestisce bene le opzioni.\n• **Contro**: dipende tutto dal campione: un periodo molto volatile **sovrastima** il VaR, uno tranquillo lo **sottostima**. Assume che il passato si ripeta."}, {"title": "Simulazione Monte Carlo", "icon": "🎲", "content": "• Si sceglie una distribuzione per ogni fattore di rischio, si **generano a caso** migliaia di scenari e si rivaluta il portafoglio in ciascuno.\n• I risultati si ordinano come nella simulazione storica: l'n-esimo percentile è il VaR all'n%.\n• **Pro**: flessibile, gestisce distribuzioni non normali e opzioni.\n• **Contro**: dipende dalle ipotesi sulle distribuzioni; richiede molta potenza di calcolo.\n• Con una distribuzione normale e un campione grande dà **lo stesso risultato** del parametrico."}, {"title": "Confronto", "icon": "📋", "content": "| | Parametrico | Storica | Monte Carlo |\n|---|---|---|---|\n| Rendimenti da | Formula (μ, σ) | Dati passati | Numeri generati |\n| Ipotesi distributiva | Sì (normale) | **No** | Sì (scelta dall'utente) |\n| Opzioni | Male | Bene | Bene |\n| Punto debole | Code spesse | Dipende dal campione | Dipende dalle ipotesi |"}]}, "keyPoints": ["Parametrico: media, dev. std, normalità", "Storica: rendimenti passati ordinati, nessuna ipotesi distributiva", "Monte Carlo: scenari casuali da distribuzioni scelte", "La storica dipende dal lookback period"], "examTips": ["Unica senza ipotesi sulla distribuzione: la simulazione STORICA", "Parametrico + code spesse = VaR sottostimato"], "question": {"q": "Which of the following statements is least likely true about the historical simulation method of estimating VaR?", "options": ["This method uses a lookback period to estimate VaR.", "This method assumes that the past performance of a portfolio is a good indicator of its performance in the near future.", "This method assumes that asset price returns and volatility follow a normal distribution."], "ans": 2, "exp": "La simulazione storica non richiede alcuna ipotesi sulla distribuzione: usa i rendimenti effettivamente osservati. A e B sono vere: dipende dal lookback period e assume che il passato sia un buon indicatore del futuro prossimo."}}, {"id": "c", "code": "LOS 41c", "title": "Stimare e interpretare il VaR con i metodi parametrico, simulazione storica e Monte Carlo", "commandWord": "Stimare", "importance": "VERY HIGH", "content": {"introduction": "Questo è il LOS di calcolo del Reading 41. Il metodo parametrico si fa con una formula; la simulazione storica (e la Monte Carlo) si fanno ordinando i rendimenti e prendendo il percentile giusto.", "sections": [{"title": "Formula del metodo parametrico", "icon": "📐", "content": "$$VaR_p = \\mu - z_\\alpha\\,\\sigma$$\n(in valore: si moltiplica per il valore del portafoglio; un risultato negativo è una perdita)\n\n| Confidenza | 90% | 95% | 99% |\n|---|---|---|---|\n| \\(z\\) | 1,282 | 1,645 | 2,326 |\n\n**Portafoglio di due asset:**\n$$\\mu_p = w_A\\mu_A + w_B\\mu_B$$\n$$\\sigma_p^2 = w_A^2\\sigma_A^2 + w_B^2\\sigma_B^2 + 2w_Aw_B\\,\\text{Cov}_{AB}$$\n\n**Da giornaliero ad annuo** (T giorni di borsa):\n$$\\mu_{annuo} = T \\times \\mu_{giorno} \\qquad \\sigma_{annua} = \\sqrt{T} \\times \\sigma_{giorno}$$"}, {"title": "Esempio svolto: parametrico", "icon": "✏️", "content": "Asset A: σ giornaliera = 0,0231; media giornaliera = 0,0012; valore = $200.000; 250 giorni; VaR annuo al 5%.\n\n**Passo 1**, media annua:\n$$\\mu = 250 \\times 0{,}0012 = 0{,}30$$\n\n**Passo 2**, deviazione standard annua:\n$$\\sigma = \\sqrt{250} \\times 0{,}0231 = 15{,}811 \\times 0{,}0231 = 0{,}3652$$\n\n**Passo 3**, VaR in %:\n$$0{,}30 - 1{,}645 \\times 0{,}3652 = 0{,}30 - 0{,}6008 = -0{,}3008$$\n\n**Passo 4**, in dollari:\n$$200.000 \\times 0{,}3008 \\approx \\$60.165$$\n\nC'è un 5% di probabilità di perdere almeno circa $60.165 in un anno. (Il PDF riporta $59.660 per un arrotondamento della σ annua.)"}, {"title": "Esempio svolto: simulazione storica", "icon": "✏️", "content": "Regola: con N osservazioni, il VaR al p% è circa la **(p × N)-esima peggiore** (es. 200 giorni, 5% → 10° peggiore).\n\nAsset B, 120 giorni; i 10 rendimenti peggiori ordinati:\n−15,72%, −14,12%, −10,92%, −6,90%, −5,50%, **−5,30%**, −4,31%, −3,56%, −3,45%, −2,50%\n\n**Passo 1**: \\(5\\% \\times 120 = 6\\)\n**Passo 2**: il 6° peggiore è **−5,30%**\n\nVaR a 1 giorno al 5% = 5,30%: al 95% la perdita giornaliera non supera il 5,3%."}, {"title": "Monte Carlo in pratica", "icon": "🎲", "content": "1. Si generano migliaia di rendimenti casuali da distribuzioni scelte per i fattori di rischio.\n2. Si rivaluta il portafoglio in ogni scenario.\n3. Si ordinano i risultati e si prende il percentile, come nella simulazione storica.\n\nCon tanta potenza di calcolo si possono simulare anche portafogli complessi con opzioni."}]}, "keyPoints": ["VaR parametrico = μ − z × σ", "z: 1,282 (90%), 1,645 (95%), 2,326 (99%)", "Annualizzare: media × T, dev. std × √T", "Storica: VaR = (p × N)-esimo rendimento peggiore"], "examTips": ["Errore classico: annualizzare la σ moltiplicando per T invece che per √T", "Nella varianza di portafoglio i pesi vanno AL QUADRATO e non dimenticare 2·wA·wB·Cov"], "question": {"q": "Consider the following daily data: security A has standard deviation 0.0108 and mean return 0.0004; security B has standard deviation 0.0131 and mean return 0.0006; the covariance between A and B is 0.00007. Which of the following best estimates the 5% annual VaR for a $1 million portfolio invested 70% in A and 30% in B, assuming 250 trading days in a year?", "options": ["$106,600", "$147,700", "$256,400"], "ans": 1, "exp": "Varianza giornaliera = 0,7²(0,0108²) + 0,3²(0,0131²) + 2(0,7)(0,3)(0,00007) = 0,000102. σ annua = √(250 × 0,000102) = 0,1597. Media annua = 250 × (0,7 × 0,0004 + 0,3 × 0,0006) = 0,115. VaR = 0,115 − 1,645 × 0,1597 = −0,1477, cioè circa $147.700. A dimentica la covarianza; C usa lo z del 99% (2,326). Nota: la domanda del PDF aveva una covarianza incompatibile con le deviazioni standard (correlazione 2,8), qui è stata resa coerente."}}, {"id": "d", "code": "LOS 41d", "title": "Descrivere i vantaggi e i limiti del VaR", "commandWord": "Descrivere", "importance": "HIGH", "content": {"introduction": "Il VaR è popolare perché riassume il rischio in un solo numero, ma proprio questa semplicità nasconde molte cose.", "sections": [{"title": "Vantaggi", "icon": "👍", "content": "1. **Facile da capire**: un solo numero, in % o in valuta.\n2. **Applicabile ovunque**: confronta il rischio tra asset class e portafogli diversi.\n3. **Accettato**: standard di mercato, usato dai regolatori bancari e nei bilanci.\n4. **Utile per la performance**: base per rendimenti corretti per il rischio.\n5. **Verificabile**: si può controllare con il **backtesting** (contando quante volte la perdita supera il VaR)."}, {"title": "Limiti", "icon": "👎", "content": "1. **Dipende da input e ipotesi** (es. normalità, passato che si ripete).\n2. **Risultati diversi** con metodi diversi per lo stesso portafoglio.\n3. **Falso senso di sicurezza**: non dice quanto si perde oltre la soglia (rischio di coda).\n4. **Difficile per portafogli grandi**: servono tutte le correlazioni.\n5. **Soggettivo**: scelta di parametri, distribuzione, probabilità e lookback period.\n6. **Guarda solo la coda sinistra**: ignora i potenziali guadagni."}]}, "keyPoints": ["Pro: semplice, confrontabile, accettato, verificabile", "Contro: dipende dalle ipotesi, non misura la coda oltre la soglia", "Metodi diversi → VaR diversi"], "examTips": ["'Misura il rischio di ribasso' è una caratteristica, non un vantaggio elencato", "Il backtesting è il modo per verificare l'affidabilità del VaR"], "question": {"q": "Which of the following is an advantage of VaR?", "options": ["VaR can be used to measure and compare risk across different asset classes.", "VaR is a limited acceptable measure of risk.", "VaR measures downside risk."], "ans": 0, "exp": "Il VaR permette di confrontare il rischio tra asset class e portafogli diversi. B è sbagliata: il VaR è ampiamente accettato, anche dai regolatori. C descrive cosa misura, ed è anzi un limite: guarda solo la coda sinistra e ignora i potenziali guadagni."}}, {"id": "e", "code": "LOS 41e", "title": "Descrivere le estensioni del VaR", "commandWord": "Descrivere", "importance": "VERY HIGH", "content": {"introduction": "Le estensioni del VaR rispondono a domande che il VaR da solo non copre: quanto perdo **oltre** la soglia? Come cambia il VaR se modifico o tolgo una posizione? Quanto rischio di fare peggio del benchmark?", "sections": [{"title": "Conditional VaR (CVaR)", "icon": "🕳️", "content": "Detto anche **expected shortfall**, **expected tail loss** o **average VaR**.\n\nÈ la **perdita media nei casi peggiori del VaR**: la media della coda oltre la soglia.\n\n$$CVaR = E\\left[\\text{perdita} \\mid \\text{perdita} > VaR\\right]$$\n\nÈ sempre ≥ VaR. È facile da calcolare con simulazione storica e Monte Carlo (media dei risultati oltre il cutoff), difficile con il parametrico."}, {"title": "Incremental VaR (IVaR)", "icon": "➕", "content": "Misura come cambia il VaR del portafoglio se si **modifica una posizione** (si aumenta o riduce un peso):\n$$IVaR = VaR_{dopo} - VaR_{prima}$$"}, {"title": "Marginal VaR (MVaR)", "icon": "✂️", "content": "Misura come cambia il VaR per una **variazione piccolissima** (un dollaro in più) di una posizione; si usa per capire il contributo di ogni posizione al VaR totale.\n\nNella lettura del PDF il marginal VaR è presentato come l'effetto di **togliere un'intera posizione** dal portafoglio: all'esame ricordati che IVaR e MVaR misurano entrambi l'effetto di una posizione sul VaR, uno per variazioni discrete, l'altro per variazioni piccole."}, {"title": "Relative VaR", "icon": "📏", "content": "Misura il rischio di **sottoperformare il benchmark** (è un VaR applicato agli active return).\n\nEsempio: relative VaR a 1 giorno al 5% = $5.000 → solo 5 giorni su 100 il portafoglio fa peggio del benchmark di più di $5.000."}]}, "keyPoints": ["CVaR = perdita media oltre il VaR (expected shortfall)", "IVaR = variazione del VaR modificando una posizione", "MVaR = contributo marginale di una posizione al VaR", "Relative VaR = rischio di sottoperformare il benchmark"], "examTips": ["Trucco: C = Coda (media della coda); I = Incremento di una posizione; R = Relativo al benchmark", "CVaR difficile con il metodo parametrico"], "question": {"q": "Which of the following statements about the extensions of VaR is the most accurate?", "options": ["Marginal VaR is a tail risk metric that quantifies the amount of expected losses beyond the VaR cutoff point.", "Conditional VaR is a measure of how removing a position from a portfolio may affect the overall VaR.", "Incremental VaR measures the impact on the VaR resulting from small changes caused by taking different positions of a portfolio."], "ans": 2, "exp": "L'incremental VaR misura come cambia il VaR modificando le posizioni del portafoglio. A descrive il CVaR, non il marginal VaR. B descrive l'effetto di togliere una posizione, che non è il CVaR (il CVaR è la perdita media oltre la soglia del VaR)."}}, {"id": "f", "code": "LOS 41f", "title": "Descrivere le sensitivity risk measure e le scenario risk measure e confrontarle con il VaR", "commandWord": "Confrontare", "importance": "HIGH", "content": {"introduction": "Oltre al VaR esistono due famiglie di misure: quelle di **sensibilità** (quanto cambia il valore se un fattore si muove un po') e quelle di **scenario** (cosa succede in condizioni estreme).", "sections": [{"title": "Sensitivity risk measure", "icon": "🎚️", "content": "Misurano quanto cambia il valore del portafoglio per **un piccolo movimento di un fattore**: beta, duration, convexity, greche delle opzioni.\n\nDifferenza dal VaR: **non danno nessuna probabilità** del movimento, dicono solo \"se succede, quanto cambia\"."}, {"title": "Scenario risk measure", "icon": "🌪️", "content": "Stimano il valore del portafoglio in **condizioni di mercato estreme**, muovendo più fattori insieme e di molto.\n\n• **Scenari storici**: crisi passate (crisi dello SME, crisi Tequila 1995, 1998…) riapplicate al portafoglio di oggi.\n• **Scenari ipotetici**: eventi mai accaduti ma possibili, costruiti dall'analista; il metodo **Monte Carlo** si basa su scenari ipotetici.\n\nNeanche gli scenari danno una probabilità precisa: si concentrano sull'entità della perdita."}, {"title": "Confronto con il VaR", "icon": "📋", "content": "| | VaR | Sensibilità | Scenario |\n|---|---|---|---|\n| Domanda | Quanto posso perdere con prob. p? | Quanto cambia per un piccolo movimento? | Quanto perdo in un evento estremo? |\n| Probabilità | Sì | No | No (o soggettiva) |\n| Fattori | Tutti insieme | Uno alla volta | Più fattori, movimenti grandi |"}]}, "keyPoints": ["Sensibilità: un fattore, piccolo movimento, nessuna probabilità", "Scenario: più fattori, movimenti estremi", "Scenari storici vs ipotetici; Monte Carlo usa scenari ipotetici"], "examTips": ["Il 'tweaking' (stimare input mancanti) non è un tipo di scenario: distrattore", "Solo il VaR associa una probabilità alla perdita"], "question": {"q": "Scenario analysis is a process used for estimating changes in the value of an asset of a portfolio under extreme market conditions. Which of the following scenarios is the most applicable in the Monte Carlo method of obtaining VaR?", "options": ["Tweaking scenarios.", "Hypothetical scenarios.", "Historical scenarios."], "ans": 1, "exp": "La Monte Carlo genera scenari ipotetici: variazioni dei fattori di rischio non necessariamente accadute, ma con probabilità non nulla. Il tweaking consiste nello stimare a mano input mancanti e non è un tipo di scenario. Gli scenari storici riapplicano crisi passate."}}, {"id": "g", "code": "LOS 41g", "title": "Dimostrare l'uso delle exposure measure di equity, fixed income e opzioni nella misurazione e gestione del market risk e del volatility risk", "commandWord": "Dimostrare", "importance": "HIGH", "content": {"introduction": "Ogni asset class ha la sua misura di esposizione al rischio di mercato: **beta** per le azioni, **duration e convexity** per le obbligazioni, **greche** (delta, gamma, vega) per le opzioni.", "sections": [{"title": "Azioni: beta (e alpha)", "icon": "📈", "content": "• **Beta**: quanto il titolo si muove quando si muove il mercato. Beta = 1,3 → se il benchmark fa +10%, ci si aspetta +13%. Beta > 1 = più volatile del mercato.\n• **Alpha**: rendimento in eccesso rispetto a quanto spiegato dal beta; alpha +5% = 5% sopra il benchmark aggiustato per il rischio.\n\n$$\\Delta\\%\\,\\text{valore} \\approx \\beta \\times \\Delta\\%\\,\\text{mercato}$$"}, {"title": "Obbligazioni: duration e convexity", "icon": "🏦", "content": "• **Duration**: sensibilità lineare del prezzo al tasso:\n$$\\frac{\\Delta P}{P} \\approx -D \\times \\Delta y$$\n• **Convexity**: la curvatura della relazione prezzo-rendimento; corregge la duration per movimenti grandi:\n$$\\frac{\\Delta P}{P} \\approx -D\\,\\Delta y + \\tfrac{1}{2}\\,C\\,(\\Delta y)^2$$\n\nCon **convexity positiva** il prezzo sale di più quando i tassi scendono di quanto scenda quando salgono. Con **convexity negativa** (es. bond callable, MBS) vale il contrario."}, {"title": "Opzioni: le greche", "icon": "🎛️", "content": "• **Delta** \\(\\Delta = \\dfrac{\\partial P_{opz}}{\\partial S}\\): variazione del prezzo dell'opzione per $1 di sottostante (call da 0 a 1, put da −1 a 0).\n• **Gamma** \\(\\Gamma = \\dfrac{\\partial \\Delta}{\\partial S}\\): quanto cambia il delta quando si muove il sottostante (la \"convexity\" delle opzioni).\n• **Vega** \\(\\nu = \\dfrac{\\partial P_{opz}}{\\partial \\sigma}\\): variazione del prezzo per una variazione della volatilità; è positivo per call e put lunghe.\n\nTutte insieme:\n$$\\Delta c \\approx \\Delta \\cdot \\Delta S + \\tfrac{1}{2}\\,\\Gamma\\,(\\Delta S)^2 + \\nu \\cdot \\Delta\\sigma$$"}, {"title": "Esempio: la leva delle opzioni", "icon": "✏️", "content": "Due portafogli da $10.000 sulla stessa azione (prezzo $10):\n• **Bush**: 1.000 azioni.\n• **Wright**: 4.000 call da $2,50, delta 0,5.\n\nL'azione sale del 10% (+$1).\n\n**Bush**: 1.000 × $11 = $11.000 → **+10%**\n**Wright**: ogni call sale di 0,5 × $1 = $0,50 → da $2,50 a $3,00\n$$4.000 \\times 3{,}00 = \\$12.000 \\rightarrow +20\\%$$\n\nStesso movimento del sottostante, rendimento doppio: le opzioni danno leva."}]}, "keyPoints": ["Azioni → beta; obbligazioni → duration e convexity; opzioni → delta, gamma, vega", "Delta = ∂opzione/∂sottostante; gamma = ∂delta/∂sottostante; vega = ∂opzione/∂volatilità", "Δc ≈ Δ·ΔS + ½Γ(ΔS)² + ν·Δσ"], "examTips": ["Gamma è l'equivalente della convexity per le opzioni", "Il vega si esprime in unità di prezzo, non in percentuale"], "question": {"q": "Clara Bush has $10,000 invested in 1,000 shares of Company A. Mark Wright has $10,000 invested in 4,000 call options on shares of Company A. Each call option has a delta of 0.5. What is the percentage change in the value of each portfolio if the share price increases by 10%?", "options": ["Bush: 5%; Wright: 2.5%", "Bush: 10%; Wright: 0%", "Bush: 10%; Wright: 20%"], "ans": 2, "exp": "L'azione vale $10 e la call $2,50. Con +10% l'azione va a $11: il portafoglio di Bush vale $11.000 (+10%). Ogni call sale di 0,5 × $1 = $0,50, quindi da $2,50 a $3,00: il portafoglio di Wright vale 4.000 × $3 = $12.000 (+20%). Nota: nel PDF il testo diceva +8% ma il calcolo usava +$1; qui i dati sono stati resi coerenti."}}, {"id": "h", "code": "LOS 41h", "title": "Descrivere l'uso delle sensitivity risk measure e delle scenario risk measure", "commandWord": "Descrivere", "importance": "MEDIUM", "content": {"introduction": "I risk manager usano le misure di sensibilità per capire come ogni posizione reagisce ai singoli fattori, e le misure di scenario per vedere l'effetto di shock estremi su più fattori insieme.", "sections": [{"title": "Uso delle misure di sensibilità", "icon": "🎚️", "content": "• **Beta**: sensibilità al premio per il rischio azionario.\n• **Duration**: la misura di rischio più importante per il reddito fisso (effetto lineare dei tassi); la **convexity** è l'effetto quadratico.\n• **Greche**: isolano ogni componente del rischio di un'opzione; facili da calcolare, utili per coprire le posizioni.\n\nNon dicono nulla sulla probabilità che il movimento avvenga."}, {"title": "Uso delle misure di scenario", "icon": "🌪️", "content": "Usano **più fattori** e **movimenti grandi**, concentrandosi sugli esiti estremi.\n\n• **Stress test**: quantifica l'impatto di uno shock negativo estremo sul portafoglio.\n• **Scenari storici**: eventi già accaduti che potrebbero ripetersi.\n• **Scenari ipotetici**: eventi mai accaduti, utili per shock in mercati diversi.\n• **Reverse stress test**: si parte dalla perdita inaccettabile e si cerca **quali scenari** la provocherebbero, per scoprire vulnerabilità nascoste."}]}, "keyPoints": ["Sensibilità = un fattore alla volta, movimenti piccoli", "Scenario = più fattori, movimenti estremi", "Stress test: impatto di uno shock estremo", "Reverse stress test: dalla perdita inaccettabile agli scenari che la causano"], "examTips": ["Stress test va dallo scenario alla perdita; reverse stress test dalla perdita allo scenario"], "question": {"q": "Which of the following is most likely applicable in extreme negative stress to a portfolio exposure?", "options": ["Stress tests", "Reverse stress tests", "Sensitivity analysis"], "ans": 0, "exp": "Lo stress test quantifica l'impatto di uno stress negativo estremo sul portafoglio. Il reverse stress test parte invece da un esito inaccettabile e cerca gli scenari che lo causerebbero. L'analisi di sensibilità guarda un solo fattore alla volta con movimenti piccoli."}}, {"id": "i", "code": "LOS 41i", "title": "Descrivere i vantaggi e i limiti delle sensitivity risk measure e delle scenario risk measure", "commandWord": "Descrivere", "importance": "MEDIUM", "content": {"introduction": "Entrambe le famiglie completano il VaR, ma hanno punti deboli diversi: le misure di sensibilità ignorano le relazioni tra fattori, quelle di scenario sono costose e non danno probabilità affidabili.", "sections": [{"title": "Misure di sensibilità", "icon": "🎚️", "content": "**Vantaggi**\n• Analisi dettagliata di come ogni fattore muove il valore.\n• Aiutano decisioni d'investimento più informate.\n\n**Limiti**\n• Basate su **ipotesi** (spesso dati storici): ipotesi sbagliate → previsioni sbagliate.\n• **Ignorano le correlazioni**: guardano un fattore alla volta (es. inflazione e tassi separatamente, anche se sono legati)."}, {"title": "Misure di scenario", "icon": "🌪️", "content": "**Vantaggi**\n• Migliorano il ragionamento sui possibili esiti, positivi e negativi.\n• Aiutano ad allocare meglio le risorse.\n• Aiutano a evitare decisioni sbagliate considerando il caso migliore e peggiore.\n\n**Limiti**\n• Impegnative, lunghe, richiedono competenza.\n• **Difficile immaginare tutti gli scenari e assegnare probabilità**; gli eventi storici non si ripetono mai uguali."}]}, "keyPoints": ["Sensibilità: dettaglio ma ignorano le correlazioni", "Scenario: pensano agli estremi ma non danno probabilità affidabili", "Entrambe dipendono dalle ipotesi"], "examTips": ["'Difficile identificare tutti gli scenari' è un limite delle misure di SCENARIO, non di sensibilità"], "question": {"q": "Which of the following is least likely a limitation of sensitivity risk measures?", "options": ["They omit variable correlations.", "They are based on assumptions that may prove inaccurate.", "It is challenging to identify all possible scenarios and allocate probabilities."], "ans": 2, "exp": "La difficoltà di identificare tutti gli scenari e assegnare loro probabilità è un limite delle misure di scenario. Le misure di sensibilità hanno invece i limiti in A (ignorano le correlazioni tra variabili) e in B (dipendono da ipotesi che possono rivelarsi sbagliate)."}}, {"id": "j", "code": "LOS 41j", "title": "Spiegare i vincoli usati nella gestione dei market risk: risk budgeting, position limit, scenario limit e stop-loss limit", "commandWord": "Spiegare", "importance": "HIGH", "content": {"introduction": "Misurare il rischio non basta: bisogna **limitarlo**. Vincoli troppo stretti tolgono opportunità e rendimento; troppo larghi possono portare a perdite enormi. Un VaR al 99% con un limite largo può essere meno restrittivo di un VaR al 90% con un limite stretto.", "sections": [{"title": "Risk budgeting", "icon": "💰", "content": "Si decide **quanto rischio totale** si è disposti a prendere (risk appetite, es. un limite di VaR o di capitale economico) e lo si **distribuisce** tra tipi di rischio (mercato, credito, operativo), attività, unità e aree geografiche.\n\nPer un gestore: dato un **budget di tracking error ex-ante**, si assegna più tracking error alle strategie che promettono la ricompensa maggiore.\n\nEsempio: \"tracking error ex-ante massimo dell'8% per ogni portafoglio\"."}, {"title": "Position limit", "icon": "📏", "content": "Un **tetto alla dimensione di una posizione** (es. numero massimo di contratti derivati, peso massimo per titolo, settore o paese).\n\nServe a evitare concentrazioni e a impedire che qualcuno controlli il mercato con i derivati.\n\nEsempio: \"massimo 1.000 contratti sulla scadenza a pronti\"."}, {"title": "Scenario limit", "icon": "🌪️", "content": "Una **perdita massima consentita in uno scenario specifico** (es. \"in uno scenario di tassi +200 bp non possiamo perdere più di X\"). Se la perdita stimata supera il limite, bisogna intervenire.\n\nCopre ciò che il VaR non vede: cambi di correlazione ed eventi estremi."}, {"title": "Stop-loss limit", "icon": "🛑", "content": "Una **perdita massima in un periodo**: se viene superata, il trader deve ridurre o chiudere la posizione.\n\n**Limite**: è **retrospettivo**, interviene dopo che la perdita è avvenuta.\n\nSi usa insieme al VaR per evitare il **\"trending\"**: un portafoglio che resta sotto il limite di VaR ogni giorno ma accumula perdite nel tempo. Esempio: VaR a 10 giorni al 5% di $1 milione, liquidazione se la perdita cumulata del mese supera $3 milioni."}]}, "keyPoints": ["Risk budget: distribuire il rischio totale tra attività", "Position limit: tetto alla dimensione di una posizione", "Scenario limit: perdita massima in uno scenario", "Stop-loss: perdita massima in un periodo, poi si riduce o si chiude"], "examTips": ["Riconosci dall'esempio: tracking error per portafoglio → risk budget; numero di contratti → position limit; perdita in un mese → stop-loss", "Lo stop-loss è retrospettivo"], "question": {"q": "Which of the following best describes a stop-loss limit?", "options": ["Allowing an ex-ante tracking error of up to 8% in each portfolio.", "Selling a position in a portfolio after suffering a loss of 8% of capital in one month.", "Setting a spot-month limit to 1000 contract units."], "ans": 1, "exp": "Lo stop-loss limit fissa la perdita massima in un periodo, superata la quale si riduce o si chiude la posizione. A è un esempio di risk budget. C è un position limit."}}, {"id": "k", "code": "LOS 41k", "title": "Spiegare come le misure di rischio possono essere usate nelle decisioni di allocazione del capitale", "commandWord": "Spiegare", "importance": "HIGH", "content": {"introduction": "Il capitale è costoso: va dato alle attività con il miglior rendimento atteso per unità di capitale (e di rischio), così che le strategie migliori non restino senza risorse.", "sections": [{"title": "Economic capital", "icon": "🛡️", "content": "L'**economic capital** è l'equity necessaria per **sopravvivere a uno scenario estremo** (perdite di coda a un livello di confidenza molto alto).\n\n1. Si misura l'economic capital → definisce il **risk appetite** dell'impresa.\n2. Lo si suddivide tra le unità → **risk budget**.\n3. Si alloca il capitale alle strategie in base al rendimento atteso per unità di capitale.\n\nL'allocazione del capitale conta soprattutto quando si usa tutta la leva disponibile o quando una strategia ha più rischio di coda del previsto."}, {"title": "Hurdle rate", "icon": "📐", "content": "Si confronta il rendimento atteso per unità di capitale con un tasso minimo (hurdle):\n$$\\text{Rendimento sul capitale} = \\frac{\\text{Rendimento atteso in \\$}}{\\text{Capitale richiesto}}$$\n\nSi scelgono le strategie sopra l'hurdle, preferendo quelle con il rapporto più alto."}, {"title": "Esempio svolto", "icon": "✏️", "content": "| Portafoglio | Capitale | Rend. atteso | Rend. sul capitale |\n|---|---|---|---|\n| A | $100.000 | $18.000 | **18%** |\n| B | $250.000 | $30.000 | 12% |\n\nHurdle = 15%. **A** è l'uso migliore del capitale, anche se B guadagna di più in assoluto."}]}, "keyPoints": ["Economic capital = equity per sopravvivere al caso peggiore", "Economic capital → risk appetite → risk budget", "Si sceglie con il rendimento per unità di capitale vs hurdle rate"], "examTips": ["Guarda il rendimento PERCENTUALE sul capitale, non quello in dollari"], "question": {"q": "An investor X has three portfolio choices. Portfolios A, B, and C require capital of $500,000, $400,000, and $1,000,000, respectively. If the expected return for A is $95,000, B is $84,000, and C is $195,000 per year, which of the following best suits X's investment plan in terms of capital allocation, given that his annualized hurdle rate is 20%?", "options": ["Portfolio A", "Portfolio B", "Portfolio C"], "ans": 1, "exp": "A = 95.000/500.000 = 19%; B = 84.000/400.000 = 21%; C = 195.000/1.000.000 = 19,5%. Solo B supera l'hurdle del 20%."}}, {"id": "l", "code": "LOS 41l", "title": "Descrivere le misure di rischio usate da banche, asset manager, pension fund e assicuratori", "commandWord": "Descrivere", "importance": "MEDIUM", "content": {"introduction": "Ogni operatore usa misure diverse in base a tre cose: **quanta leva** ha (e se deve rispettare requisiti di capitale), **a quali rischi** è esposto e **quali regole** contabili e regolamentari deve seguire.", "sections": [{"title": "Banche", "icon": "🏦", "content": "Esposte a rischio di **mercato, credito e operativo**.\n• **VaR**: per la coda delle perdite di mercato.\n• **Leverage**: attivi ponderati per il rischio / equity.\n• **Sensibilità**: duration, esposizioni valutarie e azionarie, delta, gamma e vega dei derivati.\n• **Economic capital**: perdita potenziale su tutto il bilancio a confidenza molto alta (99%–99,99%).\n• **Scenari**: effetto di tassi, inflazione e credito su tutto il bilancio."}, {"title": "Asset manager", "icon": "💼", "content": "Regolati soprattutto per il **trattamento equo dei clienti**, non per il capitale.\n\n**Long-only tradizionali** (spesso in % del NAV): sensibilità (key rate duration, OAD, spread duration, delta), beta, **liquidità** (giorni per liquidare), scenari; VaR solo per strategie absolute return.\n\n**Hedge fund** (con leva): VaR a confidenza alta e orizzonte breve, scenari specifici, **gross exposure**, leverage, **drawdown**; simulano margin call e rimborsi per capire il fabbisogno di cassa nel caso peggiore."}, {"title": "Pension fund (a prestazione definita)", "icon": "👵", "content": "• **Surplus at risk**: un VaR in cui gli attivi sono posizioni lunghe e le passività posizioni corte in reddito fisso: stima di quanto le passività possono superare gli attivi. È **tipico dei fondi pensione**.\n• **Glide path**: percorso pluriennale per portare il portafoglio dallo stato attuale a quello target."}, {"title": "Assicuratori", "icon": "☂️", "content": "**Danni (property & casualty)**: poco correlati ai mercati finanziari. Scenari, sensibilità ed esposizioni entro range target, economic capital e VaR.\n\n**Vita e rendite**: molto legati ai mercati, passività lunghe, riserve che dipendono dal tasso di sconto. Sensibilità, **asset-liability matching** stretto, scenari e stress (potential stress loss)."}]}, "keyPoints": ["Banche: VaR, leverage, sensibilità, economic capital, scenari", "Hedge fund: gross exposure, leverage, drawdown", "Pension fund: surplus at risk e glide path", "Assicuratori vita: ALM; danni: poco legati ai mercati"], "examTips": ["Surplus at risk = misura tipica dei fondi pensione", "Drawdown e gross exposure = hedge fund"], "question": {"q": "Which of the following risk measures is most likely used by pension funds but not any other market participant?", "options": ["Sensitivities", "Surplus at risk", "Scenarios"], "ans": 1, "exp": "Il surplus at risk è un VaR su attivi meno passività: gli attivi entrano come posizioni lunghe e le passività come posizioni corte in reddito fisso. È tipico dei fondi pensione a prestazione definita. Sensibilità e scenari li usano tutti gli operatori."}}]}, {"id": "pm-r42", "number": 42, "title": "Backtesting and Simulation", "estimatedTime": "3-4 ore", "totalLOS": 8, "los": [{"id": "a", "code": "LOS 42a", "title": "Descrivere gli obiettivi del backtesting di una strategia d'investimento", "commandWord": "Descrivere", "importance": "MEDIUM", "content": {"introduction": "Il **backtesting** prova una strategia d'investimento sui **dati del passato** per vedere come si sarebbe comportata, come se fosse stata applicata davvero in quel periodo.", "sections": [{"title": "A cosa serve", "icon": "🎯", "content": "• **Dare rigore e insight**: capire come e quando la strategia funziona.\n• **Approvare o rifiutare** una strategia: i gestori adottano le strategie con risultati positivi nel backtest.\n• **Misurare l'efficacia storica** della strategia: rendimento, rischio, comportamento nelle crisi."}, {"title": "Il limite di fondo", "icon": "⚠️", "content": "Il backtest mostra solo **un** percorso possibile: quello che è effettivamente accaduto. Il futuro contiene **casualità** e può andare diversamente, per questo il backtesting si completa con la simulazione (LOS 42f-h).\n\nIl backtesting **non** è uno strumento di valutazione dei titoli: non dice quanto vale un'azione."}]}, "keyPoints": ["Backtesting = testare una strategia sui dati storici", "Obiettivi: insight, criterio di approvazione, efficacia storica", "Il passato è un solo percorso: il futuro è casuale"], "examTips": ["Distrattore tipico: 'serve a valutare le azioni' → falso"], "question": {"q": "Which one of the following is least likely to be a reason for backtesting an investment strategy?", "options": ["To offer insight into an investment strategy.", "It is used to value stocks.", "An investment strategy approval or rejection criterion."], "ans": 1, "exp": "Il backtesting usa i dati passati per valutare come avrebbe funzionato una strategia: non è uno strumento per valutare i titoli. A e C sono obiettivi tipici del backtesting."}}, {"id": "b", "code": "LOS 42b", "title": "Descrivere e confrontare le fasi e le procedure del backtesting di una strategia d'investimento", "commandWord": "Descrivere", "importance": "HIGH", "content": {"introduction": "Il backtesting si fa in **tre fasi**: progettare la strategia, simularla sui dati storici, analizzare i risultati.", "sections": [{"title": "Fase 1: strategy design", "icon": "✍️", "content": "Si formula l'**ipotesi d'investimento** e l'obiettivo (per una strategia attiva: battere il benchmark).\n\nL'ipotesi comprende: un **criterio di selezione dei titoli**, una **regola di trading** e un **portafoglio** con un obiettivo. Poi la si traduce in parametri:\n• **universo investibile**: di solito un indice ampio (es. Russell 3000 per gli USA, S&P/TSX per il Canada, MSCI China A, S&P Global BMI per il resto);\n• **date di inizio e fine**: a parità di condizioni, meglio una storia lunga;\n• **costi di transazione**: molte anomalie spariscono quando li si include."}, {"title": "Fase 2: historical investment simulation", "icon": "🔄", "content": "Si usa una **rolling window** per replicare come avrebbe lavorato un gestore reale:\n\n1. si costruisce la strategia con i dati di un periodo **in-sample**;\n2. la si testa sul periodo successivo **out-of-sample**;\n3. la finestra si sposta in avanti: il periodo out-of-sample diventa parte del nuovo in-sample, si ricalcola e si testa ancora.\n\nCosì si usano solo le informazioni che sarebbero state disponibili a ogni data, ribilanciando man mano."}, {"title": "Fase 3: analisi dei risultati", "icon": "📊", "content": "Si guarda sia il **rendimento** sia il **rischio**:\n• rendimento medio e volatilità;\n• **Sharpe ratio** (rendimento in eccesso / volatilità) e **Sortino ratio** (rendimento in eccesso / volatilità al ribasso);\n• **maximum drawdown** (la perdita più grande da un picco al minimo successivo);\n• grafici: ricchezza cumulata, distribuzione dei rendimenti, confronto degli Sharpe."}]}, "keyPoints": ["Tre fasi: design, simulazione storica, analisi", "Design: ipotesi, universo, date, costi di transazione", "Simulazione: rolling window in-sample → out-of-sample", "Analisi: Sharpe, Sortino, volatilità, maximum drawdown"], "examTips": ["Rolling window = come un gestore reale che usa solo dati già disponibili", "Dimenticare i costi di transazione rende la strategia troppo bella"], "question": {"q": "An analyst is backtesting a stock-selection strategy. She first defines the investment universe as the Russell 3000 Index, then repeatedly estimates the model on 60 months of data and tests it on the following month, moving the window forward each month. Finally, she reports the Sharpe ratio and maximum drawdown. The repeated estimation and testing step is best described as:", "options": ["Strategy design.", "Historical investment simulation.", "Analysis of backtesting output."], "ans": 1, "exp": "Stimare il modello in-sample e testarlo out-of-sample spostando ogni volta la finestra è la rolling window, cioè la fase di historical investment simulation. La scelta dell'universo è strategy design; riportare Sharpe e drawdown è l'analisi dei risultati. (Domanda di allenamento: il PDF non ne riportava una per questo LOS.)"}}, {"id": "c", "code": "LOS 42c", "title": "Interpretare metriche e grafici riportati nel backtest di una strategia d'investimento", "commandWord": "Interpretare", "importance": "HIGH", "content": {"introduction": "Il reading usa un esempio con **otto fattori** combinati in due modi: il portafoglio **benchmark (BM)**, che dà peso uguale a ogni fattore, e il portafoglio **risk parity (RP)**, che dà a ogni fattore lo **stesso contributo al rischio**.", "sections": [{"title": "Gli otto fattori", "icon": "🧪", "content": "1. Cyclical value: book-to-market\n2. Defensive value: earnings yield\n3. Growth: crescita dell'EPS\n4. Price momentum: rendimento a 12 mesi\n5. Earnings quality: peso degli accruals\n6. Profitability: ROE\n7. Leverage: debt/equity\n8. Analyst sentiment: revisioni dell'EPS a 3 mesi\n\nPer ogni fattore: **long il 20% migliore, short il 20% peggiore**, titoli equipesati. Poi i fattori si combinano in BM (peso uguale) e RP (contributo al rischio uguale, tenendo conto di volatilità e correlazioni). Entrambi long-only sui fattori (pesi ≥ 0)."}, {"title": "Come leggere la tabella delle statistiche", "icon": "📊", "content": "| | EY | B/M | Momentum | BM | RP |\n|---|---|---|---|---|---|\n| Media mensile | 0,7% | 0,4% | 0,6% | 0,5% | 0,4% |\n| Dev. std | 3,6% | 4% | 5% | 2% | 0,7% |\n| Skewness | −1 | 3 | −2,36 | −2,4 | 0,5 |\n| Kurtosi | 11 | 24 | 17 | 5,4 | 5,4 |\n\n• **Diversificazione**: BM e RP hanno volatilità molto più bassa dei singoli fattori con rendimenti simili.\n• **Skewness negativa** (BM e la maggior parte dei fattori): code lunghe a sinistra, cioè rare perdite grandi.\n• **Kurtosi > 3**: code spesse, eventi estremi più frequenti di una normale.\n• RP ha volatilità minima e skewness positiva: rischio di coda più contenuto."}, {"title": "Metriche e grafici tipici", "icon": "🖼️", "content": "• Ricchezza cumulata (wealth curve): qui il BM accumula di più.\n• Rendimento medio e volatilità, confronto degli **Sharpe ratio** (qui RP ha Sharpe migliore).\n• **Maximum drawdown**, VaR e CVaR.\n• **Grafici della distribuzione** dei rendimenti dei fattori.\n\nUn \"word cloud\" o altri grafici descrittivi non sono strumenti di valutazione del backtest."}]}, "keyPoints": ["BM = fattori a peso uguale; RP = contributo al rischio uguale", "Combinare i fattori riduce molto la volatilità", "Skewness negativa + kurtosi alta = rischio di coda", "Metriche: Sharpe, Sortino, drawdown, VaR/CVaR, grafici di distribuzione"], "examTips": ["Kurtosi > 3 = code spesse", "RP tiene conto di volatilità e correlazioni, BM no"], "question": {"q": "Which of the following is not a metric or visual used to assess a factor-based investment strategy's backtesting?", "options": ["Maximum drawdown", "Distribution plots of factor returns", "Word cloud describing characteristics of the factor"], "ans": 2, "exp": "Un word cloud non serve a valutare il backtest. Maximum drawdown e grafici della distribuzione dei rendimenti dei fattori sono invece metriche e grafici tipici."}}, {"id": "d", "code": "LOS 42d", "title": "Identificare i problemi nel backtest di una strategia d'investimento", "commandWord": "Identificare", "importance": "VERY HIGH", "content": {"introduction": "Un backtest può sembrare ottimo per errori di metodo. I tre problemi principali sono **survivorship bias**, **look-ahead bias** e **data snooping**.", "sections": [{"title": "Survivorship bias", "icon": "🪦", "content": "Si usano solo le aziende **sopravvissute** fino a oggi (es. i componenti attuali di un indice), ignorando quelle fallite o uscite.\n\n**Effetto**: risultati troppo ottimistici, perché i \"perdenti\" sono stati tolti dal campione.\n**Rimedio**: dati **point-in-time**, che includono tutte le aziende esistite a ogni data.\n\nEsempio: la low-volatility anomaly appare diversa se testata con dati point-in-time o con i componenti attuali dell'indice."}, {"title": "Look-ahead bias", "icon": "🔮", "content": "Si usano informazioni che **non erano ancora disponibili** alla data del test. È l'errore più comune.\n\nTre forme:\n1. **Reporting lag**: i bilanci escono mesi dopo la chiusura dell'esercizio; si aggiunge un ritardo (che però rende i dati un po' \"vecchi\").\n2. **Data revision**: bilanci riesposti e dati macro rivisti sostituiscono quelli originali.\n3. **Index addition**: i data vendor aggiungono aziende nuove con anni di dati passati che allora non erano nel database.\n\n**Rimedio**: dati **point-in-time**."}, {"title": "Data snooping (p-hacking)", "icon": "🎣", "content": "Si guarda prima ai risultati e poi si \"costruisce\" il test che li conferma: si provano tante varianti finché una funziona.\n\nForme tipiche: togliere gli outlier dopo l'analisi, decidere a metà se continuare a raccogliere dati, usare tantissime variabili, scegliere dopo quali risultati mostrare.\n\n**Effetto**: **falsi positivi**.\n**Rimedio**: **cross-validation** e soglie di significatività più alte (es. t-stat > 3)."}]}, "keyPoints": ["Survivorship: solo aziende sopravvissute → rimedio point-in-time", "Look-ahead: info non ancora disponibili → rimedio point-in-time", "Data snooping: si cercano i risultati → rimedio cross-validation e t-stat alte"], "examTips": ["Cross-validation ↔ data snooping; dati point-in-time ↔ survivorship e look-ahead", "Reporting lag, data revision, index addition = forme di look-ahead"], "question": {"q": "Cross-validation is useful in the avoidance of which one of the following problems that may affect backtesting?", "options": ["Data snooping.", "Survivorship bias.", "Look-ahead bias."], "ans": 0, "exp": "La cross-validation serve contro il data snooping. Survivorship e look-ahead bias si evitano invece usando dati point-in-time."}}, {"id": "e", "code": "LOS 42e", "title": "Valutare e interpretare un'analisi di scenario storica", "commandWord": "Interpretare", "importance": "HIGH", "content": {"introduction": "L'**historical scenario analysis** è un backtest che guarda come si comporta la strategia nei diversi **regimi** del mercato, separando i periodi tra loro (structural break).", "sections": [{"title": "I due regimi tipici", "icon": "🔀", "content": "1. **Alta vs bassa volatilità**: si usa il **VIX** (volatilità implicita delle opzioni sull'S&P 500). Regime di bassa volatilità = VIX sotto la sua media mobile a 5 anni.\n2. **Espansione vs recessione**: le date di inizio e fine delle recessioni si conoscono solo **a posteriori**."}, {"title": "Cosa emerge nell'esempio BM vs RP", "icon": "📋", "content": "• **Recessione**: RP tiene bene, BM va male.\n• **Bassa volatilità**: BM fatica; RP va bene sia in alta sia in bassa volatilità.\n• **BM in recessione**: rendimenti medi più bassi, **skewness negativa** ed **eccesso di kurtosi**.\n• **RP in recessione**: rendimenti medi anche più bassi, ma con kurtosi e volatilità minori del BM.\n\nLezione: una strategia che sembra buona \"in media\" può nascondere un comportamento pessimo in un regime specifico."}, {"title": "Come interpretare skewness e kurtosi", "icon": "🧠", "content": "• **Skewness negativa**: la coda sinistra è più lunga, cioè rare perdite grandi.\n• **Kurtosi in eccesso** (> 3): code spesse, eventi estremi più frequenti.\n\nInsieme, in recessione, indicano **rendimenti medi più bassi** e rischio di perdite estreme."}]}, "keyPoints": ["Regimi: alta/bassa volatilità (VIX vs media mobile 5 anni), espansione/recessione", "RP robusto in recessione; BM debole in recessione e in bassa volatilità", "Skew negativa + kurtosi alta = rendimenti più bassi e code pesanti"], "examTips": ["Le recessioni si datano solo a posteriori: attenzione al look-ahead", "Valuta sempre una strategia regime per regime, non solo in media"], "question": {"q": "Mark Jayden conducted a historical scenario analysis to examine the effect of regime changes on his portfolio. He observed that the portfolio had negative skewness and a fat left tail in a recession regime. Which of the following is the conclusion that Jayden will most likely make about his portfolio?", "options": ["Lower average returns.", "Higher average returns.", "Cannot be determined."], "ans": 0, "exp": "Skewness negativa ed eccesso di kurtosi in recessione indicano rendimenti medi più bassi, con perdite estreme più frequenti. Rendimenti più alti si associano a kurtosi bassa e skewness positiva."}}, {"id": "f", "code": "LOS 42f", "title": "Confrontare gli approcci di simulazione Monte Carlo e historical simulation", "commandWord": "Confrontare", "importance": "HIGH", "content": {"introduction": "Il backtest mostra un solo percorso storico. La **simulazione** genera tanti percorsi possibili per tenere conto della **casualità** dei mercati, sia al ribasso sia al rialzo.", "sections": [{"title": "Historical simulation", "icon": "📜", "content": "• Estrae **a caso** rendimenti da periodi storici diversi, **senza rispettare l'ordine cronologico**: è un rolling-window backtest non deterministico.\n• Usata spesso dalle banche per il rischio di mercato.\n• **Limite**: assume che il passato rappresenti il futuro e che i dati siano statici."}, {"title": "Monte Carlo simulation", "icon": "🎲", "content": "• Estrae le osservazioni da **distribuzioni** scelte per ogni variabile chiave.\n• **Vantaggio**: molto **flessibile**, si possono usare distribuzioni diverse per variabili diverse.\n• **Svantaggi**: **complessa** e **pesante dal punto di vista computazionale**; dipende da quanto bene le distribuzioni scelte descrivono i dati reali."}, {"title": "Gli 8 passi di una simulazione", "icon": "🪜", "content": "1. Definire la **target variable** (es. rendimento della strategia).\n2. Definire le **key decision variable** (es. rendimenti dei fattori).\n3. Scegliere il **numero di prove** N.\n4. Definire le **proprietà distributive** delle variabili chiave.\n5. Generare N numeri casuali per ogni variabile chiave.\n6. Calcolare la target variable per ogni set simulato.\n7. Ripetere i passi 5–6 fino a N prove.\n8. Analizzare la distribuzione degli N risultati."}]}, "keyPoints": ["Historical: estrazioni casuali dai dati passati", "Monte Carlo: estrazioni da distribuzioni scelte", "Monte Carlo: flessibile ma complessa e pesante", "8 passi: target, variabili chiave, N, distribuzioni, estrazioni, calcolo, ripeti, analizza"], "examTips": ["Vantaggio Monte Carlo = flessibilità; complessità e calcolo sono svantaggi", "Ricorda l'ordine: prima target e variabili, poi N, poi distribuzioni"], "question": {"q": "Which of the following is most likely an advantage of Monte Carlo simulation? Monte Carlo simulation:", "options": ["Is highly flexible.", "Is very complex.", "Involves intensive computation."], "ans": 0, "exp": "La Monte Carlo è diffusa perché è molto flessibile: permette distribuzioni diverse per variabili diverse. Complessità e intensità di calcolo sono svantaggi."}}, {"id": "g", "code": "LOS 42g", "title": "Spiegare input e decisioni nella simulazione e interpretare una simulazione", "commandWord": "Interpretare", "importance": "HIGH", "content": {"introduction": "Nella simulazione bisogna decidere **da dove estrarre i dati** (storico o distribuzione), **come estrarli** (con o senza reinserimento) e **quante prove** fare. Poi si leggono i risultati confrontando Sharpe ratio e rischio di coda.", "sections": [{"title": "Historical simulation: input e decisioni", "icon": "📜", "content": "• Si estraggono mesi storici a caso, invece di seguirli in ordine.\n• **Con reinserimento** (lo stesso mese può uscire più volte) = **bootstrapping**; si usa quando le simulazioni sono più numerose dei dati storici. Senza reinserimento si possono fare al massimo tante prove quanti sono i dati.\n\n**Esempio del reading**:\n• target variable: rendimenti dei portafogli BM e RP\n• key decision variable: rendimenti degli 8 fattori\n• N = 800 prove; 374 mesi storici (apr 1988 – mag 2019)\n• si estrae un numero uniforme tra 0 e 1: ogni mese corrisponde a un intervallo di ampiezza \\(1/374 = 0{,}00267\\)"}, {"title": "Calcolo di un esito (ottobre 2006)", "icon": "✏️", "content": "Rendimenti degli 8 fattori: 2,5%; 0,3%; −0,8%; 0%; −0,75%; 2,5%; 0,5%; −0,6%\n\n**BM** (peso 1/8 = 0,125 a ciascuno):\n$$R_{BM} = 0{,}125 \\times (2{,}5 + 0{,}3 - 0{,}8 + 0 - 0{,}75 + 2{,}5 + 0{,}5 - 0{,}6)\\% = 0{,}456\\%$$\n\n**RP** (pesi di rischio 6,0%; 30,3%; 11,7%; 5,2%; 10,4%; 6,3%; 9,6%; 20,4%):\n$$R_{RP} = \\sum w_i R_i \\approx 0{,}15\\%$$\n\nSi ripete per 800 estrazioni e si calcolano le metriche sugli 800 risultati."}, {"title": "Monte Carlo: input e decisioni", "icon": "🎲", "content": "Bisogna scegliere una **forma funzionale** (distribuzione) per le variabili chiave, dopo un'analisi esplorativa dei dati. Criteri:\n• deve riprodurre i pattern empirici principali;\n• deve tenere conto delle **correlazioni** tra variabili;\n• conta la complessità e il numero di parametri.\n\n**Nell'esempio**: normale multivariata con 8 medie, 8 deviazioni standard e 28 covarianze stimate sui dati storici; si simulano 800 set di rendimenti.\n\nPrima simulazione: BM = 0,125 × (−3 − 3,2 − 0,3 + 0,7 + 2,4 − 3,3 − 1,8 + 2)% ≈ −0,81%. (Il PDF riporta −1,312%, ma la media dei fattori dà −0,81%.)"}, {"title": "Interpretazione dei risultati", "icon": "🧠", "content": "• **Sharpe ratio**: RP batte BM in tutti e tre gli approcci (backtest, historical, Monte Carlo): il risultato è robusto.\n• **CVaR (rischio di coda)**: è più sensibile al metodo. Con la Monte Carlo normale il rischio di coda del BM risulta **sottostimato**, perché i rendimenti reali dei fattori hanno skewness negativa ed eccesso di kurtosi.\n• La sottostima riguarda solo il BM perché la ponderazione equipesata **non tiene conto di correlazioni e rischi dei fattori**; il RP sì."}]}, "keyPoints": ["Bootstrapping = estrazione con reinserimento", "Monte Carlo richiede una forma funzionale con correlazioni", "Sharpe robusto tra i metodi; CVaR sensibile al metodo", "Normale multivariata sottostima le code del BM"], "examTips": ["Più simulazioni che dati → serve il reinserimento (bootstrapping)", "BM sottostimato perché l'equal weight ignora correlazioni e rischi dei fattori"], "question": {"q": "What could be the most likely reason why the downside risk of the benchmark strategy would be underestimated under the Monte Carlo simulation?", "options": ["BM strategy is robust to non-normal factor distribution.", "The correlations and the factor risks are properly accounted for in the equal weighting scheme.", "The correlations and the factor risks are not properly accounted for in the equal weighting scheme."], "ans": 2, "exp": "La sottostima riguarda solo il BM perché la ponderazione equipesata non tiene conto di correlazioni e rischi dei fattori. È la strategia risk parity a essere robusta a distribuzioni non normali."}}, {"id": "h", "code": "LOS 42h", "title": "Dimostrare l'uso della sensitivity analysis", "commandWord": "Dimostrare", "importance": "MEDIUM", "content": {"introduction": "La normale multivariata non cattura skewness negativa e code spesse. La **sensitivity analysis** ripete la simulazione cambiando gli input (qui la distribuzione) per vedere **quanto cambiano i risultati**.", "sections": [{"title": "Come si fa", "icon": "🔁", "content": "Si ripetono gli stessi passi della Monte Carlo con due differenze:\n• **passo 4**: si calibra una **t di Student multivariata asimmetrica (skewed)**, che cattura skewness ed eccesso di kurtosi;\n• **passo 5**: si simulano 800 set di rendimenti da questa nuova distribuzione.\n\n**Costo**: più parametri da stimare e più complessità matematica."}, {"title": "Esempio: primo mese simulato", "icon": "✏️", "content": "Rendimenti degli 8 fattori: 2,1%; 0,4%; 1,8%; 3,2%; 2,1%; 1%; 0,3%; −0,5%\n\n$$R_{BM} = 0{,}125 \\times 10{,}4\\% = 1{,}3\\%$$\n$$R_{RP} = \\sum w_i R_i \\approx 0{,}83\\%$$"}, {"title": "Cosa si scopre", "icon": "🧠", "content": "• Lo **Sharpe ratio** non cambia con il metodo di simulazione: RP batte sempre BM.\n• Il **CVaR** del BM è sensibile al metodo: backtest e historical simulation danno valori simili; le due Monte Carlo (normale e t asimmetrica) li **sottostimano** entrambe.\n• Le Monte Carlo non riescono a catturare la coda sinistra del BM, dovuta a skewness negativa ed eccesso di kurtosi.\n\nLa sensitivity analysis serve proprio a scoprire **quanto i risultati dipendono dalle ipotesi**."}]}, "keyPoints": ["Sensitivity analysis = cambiare un input e ripetere la simulazione", "Alternativa alla normale: t di Student multivariata asimmetrica", "Sharpe insensibile al metodo; CVaR sensibile"], "examTips": ["Dividere la rolling window in regimi di volatilità è backtesting/scenario analysis, NON sensitivity analysis"], "question": {"q": "Which of the following situations concerning simulation analysis of a multifactor asset allocation strategy is not likely to involve sensitivity analysis?", "options": ["Changing the specified multivariate normal distribution to a skewed t-distribution.", "Splitting the rolling window between high-volatility periods and low-volatility periods.", "Repeating the simulation process with the multivariate skewed t-distribution."], "ans": 1, "exp": "Dividere la rolling window tra periodi di alta e bassa volatilità fa parte del backtesting (analisi per regimi). Cambiare la distribuzione e ripetere la simulazione con la t asimmetrica sono invece i passi tipici della sensitivity analysis."}}]}, {"id": "pm-r43", "number": 43, "title": "Economics and Investment Markets", "estimatedTime": "4-5 ore", "totalLOS": 12, "los": [{"id": "a", "code": "LOS 43a", "title": "Spiegare la nozione secondo cui, per influenzare i valori di mercato, i fattori economici devono incidere su tassi default-free, flussi di cassa attesi o premi per il rischio", "commandWord": "Spiegare", "importance": "HIGH", "content": {"introduction": "Il valore di qualsiasi asset è il **valore attuale dei flussi di cassa attesi**. Quindi un fattore economico può cambiare il prezzo solo se tocca uno di questi tre elementi: **i tassi default-free**, **i flussi di cassa attesi** (entità e tempi) o **i premi per il rischio**.", "sections": [{"title": "Il modello di base", "icon": "📐", "content": "$$\\text{Valore} = \\sum_{t=1}^{n} \\frac{CF_t}{(1 + r)^t}$$\n\nIl tasso di sconto \\(r\\) si scompone in:\n$$r = \\underbrace{R}_{\\text{tasso reale default-free}} + \\underbrace{\\pi}_{\\text{inflazione attesa}} + \\underbrace{\\text{premi per il rischio}}$$"}, {"title": "Le componenti del tasso di sconto", "icon": "🧩", "content": "• **Tasso reale default-free**: il compenso per rinviare il consumo, su un asset senza rischio di default e protetto dall'inflazione.\n• **Inflazione attesa**: chi investe in un titolo nominale vuole essere protetto dalla perdita di potere d'acquisto.\n• **Premi per il rischio**: compenso per l'incertezza sui flussi. Cambia molto tra asset class ed è proprio ciò che le distingue (premio per l'inflazione incerta, credit spread, equity premium…).\n\nIl **ciclo economico** influenza tutti questi elementi e quindi i prezzi."}, {"title": "Le relazioni da ricordare", "icon": "🧠", "content": "• Flussi attesi più alti (o che crescono di più) → **valore più alto**.\n• Tasso di sconto più alto (per tassi reali, inflazione o premi) → **valore più basso**.\n• L'inflazione alza il tasso di sconto: a parità di flussi il valore **scende**."}]}, "keyPoints": ["Valore = valore attuale dei flussi attesi", "Tre canali: tassi default-free, flussi di cassa, premi per il rischio", "Tasso di sconto = reale + inflazione attesa + premi", "Più crescita dei flussi → valore più alto; più tasso → valore più basso"], "examTips": ["Distrattore: 'l'inflazione aumenta il valore perché aumenta i flussi' → il canale principale è il tasso di sconto, che sale"], "question": {"q": "An asset's market value is determined by computing the present value of its expected cash flows at a discount rate that reflects the riskiness of those cash flows. Assuming that all other variables are constant except for the variable discussed below, which of the following statements is most likely accurate?", "options": ["Inflation increases the value of an asset because it increases the expected cash flows.", "The value of an asset increases with an increase in the discount rate.", "The value of an asset increases with an increase in the expected growth rate of cash flows."], "ans": 2, "exp": "Il valore è una funzione crescente dei flussi di cassa attesi, quindi anche del loro tasso di crescita. A è sbagliata: l'inflazione alza il tasso di sconto e riduce il valore. B è sbagliata: se il tasso di sconto sale, il valore scende."}}, {"id": "b", "code": "LOS 43b", "title": "Spiegare il ruolo delle aspettative e dei cambiamenti nelle aspettative nella valutazione di mercato", "commandWord": "Spiegare", "importance": "HIGH", "content": {"introduction": "I prezzi incorporano già ciò che il mercato si aspetta. Muovono i prezzi solo le **sorprese**, cioè le informazioni non anticipate.", "sections": [{"title": "Notizie attese vs sorprese", "icon": "📰", "content": "• L'informazione **anticipata** è già nei prezzi: quando esce, non sposta quasi nulla.\n• L'informazione **non anticipata** è la vera \"notizia\": costringe a rivedere le aspettative.\n\nConseguenza: reazioni **controintuitive**. Un dato \"buono\" può far scendere i prezzi se ci si aspettava un dato ancora migliore."}, {"title": "Aspettative sui tassi", "icon": "📉", "content": "Se ci si aspetta che i **tassi scendano**:\n• gli investimenti **a breve** diventano meno attraenti (quando scadranno si reinvestirà a tassi più bassi) → la loro **domanda cala**;\n• gli investimenti **a lungo** diventano più attraenti (bloccano i tassi alti di oggi) → domanda e **prezzi salgono**.\n\nIl contrario se ci si aspetta un rialzo dei tassi."}]}, "keyPoints": ["I prezzi riflettono le aspettative", "Solo le sorprese muovono i prezzi", "Tassi attesi in calo → meno domanda per il breve, più per il lungo"], "examTips": ["'Buona notizia ma prezzo giù' = la notizia era meno buona del previsto"], "question": {"q": "If the prevailing discount rate is expected to fall, which of the following statements is most accurate?", "options": ["Demand for short-term investments will decrease.", "Price of short-term investments will increase.", "Price of long-term investments will fall."], "ans": 0, "exp": "Se ci si aspetta un calo dei tassi, gli investimenti a breve diventano meno attraenti perché andranno reinvestiti a tassi più bassi: la loro domanda cala. Gli investimenti a lungo, che bloccano i tassi di oggi, diventano più richiesti e i loro prezzi salgono."}}, {"id": "c", "code": "LOS 43c", "title": "Spiegare la relazione tra il tasso di crescita di lungo periodo dell'economia, la volatilità di tale tasso e il livello medio dei tassi d'interesse reali a breve", "commandWord": "Spiegare", "importance": "VERY HIGH", "content": {"introduction": "Il tasso reale default-free è il **prezzo del tempo**: quanto bisogna pagare qualcuno per rinunciare a consumare oggi. Dipende da quanto si cresce e da quanto è incerta la crescita.", "sections": [{"title": "Intertemporal rate of substitution", "icon": "📐", "content": "$$m_t = \\frac{u_t}{u_0}$$\n\nrapporto tra l'**utilità marginale** del consumo futuro (\\(u_t\\)) e quella del consumo di oggi (\\(u_0\\)). Di solito \\(m_t < 1\\): si preferisce consumare oggi.\n\nPrezzo di uno zero-coupon default-free che paga 1 tra t periodi:\n$$P_0 = E(m_t)$$\n\nTasso reale a un periodo:\n$$R = \\frac{1}{E(m_1)} - 1$$"}, {"title": "L'intuizione dell'utilità marginale", "icon": "🧠", "content": "• Nei periodi buoni il reddito è alto, si consuma molto → l'utilità marginale di un euro in più è **bassa**.\n• Nei periodi cattivi un euro in più vale **molto**.\n• Quindi gli investitori apprezzano di più gli asset che **pagano nei periodi cattivi**.\n\nI tassi reali sono **alti** quando:\n• la **crescita attesa** del consumo è alta (si preferisce consumare oggi e indebitarsi, si risparmia meno);\n• l'**incertezza è bassa** (meno risparmio precauzionale)."}, {"title": "Asset rischiosi", "icon": "📐", "content": "$$P_0 = \\frac{E(P_1)}{1 + R} + \\text{Cov}(P_1, m_1)$$\n\nPer un asset rischioso tipico la covarianza è **negativa**: paga molto nei periodi buoni, quando \\(m\\) è basso. Il prezzo è quindi **più basso** del semplice valore attuale atteso, cioè c'è un **premio per il rischio**.\n\nL'avversione al rischio assoluta scende al crescere della ricchezza, ma in equilibrio tutti gli investitori detengono gli asset rischiosi alle stesse condizioni."}, {"title": "Crescita, volatilità e tassi reali", "icon": "📈", "content": "• **Crescita del PIL reale più alta** → tasso reale default-free più alto (meno risparmio, più indebitamento).\n• Anche la **volatilità della crescita** è legata positivamente ai tassi reali, per via di un premio per il rischio più alto.\n\nConclusione: in un'economia con **crescita alta e volatile** ci si aspetta un **livello medio più alto** dei tassi reali a breve."}]}, "keyPoints": ["m_t = u_t / u_0 < 1; P = E(m); R = 1/E(m₁) − 1", "Più crescita attesa → tassi reali più alti", "Più volatilità della crescita → tassi reali più alti (in questo reading)", "Asset che pagano nei periodi cattivi → premi per il rischio più bassi"], "examTips": ["Più crescita → MENO risparmio e PIÙ indebitamento, non il contrario", "Covarianza negativa tra payoff e m → premio per il rischio positivo"], "question": {"q": "Which of the following statements is most likely correct?", "options": ["An increase in real GDP growth implies the real default-free rate of interest will decrease.", "An increase in real GDP growth leads to an increase in the real default-free interest rate.", "An increase in real GDP growth implies less borrowing and more savings."], "ans": 1, "exp": "Con una crescita reale più alta gli investitori sono meno disposti a rinviare il consumo: risparmiano meno e si indebitano di più, e il tasso reale default-free sale. A dice il contrario; C inverte risparmio e indebitamento."}}, {"id": "d", "code": "LOS 43d", "title": "Spiegare come la fase del ciclo economico influisce sulla politica e sui tassi a breve, sullo slope della term structure e sulla performance relativa di obbligazioni di diversa scadenza", "commandWord": "Spiegare", "importance": "VERY HIGH", "content": {"introduction": "La banca centrale fissa i tassi a breve guardando inflazione e attività economica. Le aspettative sui tassi futuri disegnano poi la **forma della curva dei rendimenti**, che a sua volta anticipa il ciclo.", "sections": [{"title": "Tassi a breve", "icon": "📐", "content": "Per un T-bill a brevissima scadenza l'incertezza sull'inflazione è trascurabile:\n$$P_0 = \\frac{CF_t}{(1 + R + \\pi)^t}$$\n(R = tasso reale, π = inflazione attesa)\n\nPer i bond **a lungo** si aggiunge un **premio per l'incertezza sull'inflazione**: reale + inflazione attesa + premio.\n\nI tassi nominali a breve sono più alti nelle economie con crescita alta e volatile e con inflazione media più alta."}, {"title": "La regola di Taylor", "icon": "📐", "content": "$$r_t = R + \\pi_t + 0{,}5\\,(\\pi_t - \\pi_t^*) + 0{,}5\\,(y_t - y_t^*)$$\n\n• \\(r_t\\) = tasso di policy\n• \\(R\\) = tasso reale neutrale\n• \\(\\pi_t\\), \\(\\pi_t^*\\) = inflazione effettiva e target\n• \\(y_t - y_t^*\\) = **output gap** (PIL effettivo − potenziale, in %)\n\nOutput gap positivo = economia \"surriscaldata\", inflazione in aumento → tassi più alti.\nCon inflazione al target e output gap nullo si ha il **tasso neutrale**: \\(r = R + \\pi\\).\n\n**Esempio**: R = 3%, π = 2%, π* = 3%, output gap = 2%\n$$r = 3\\% + 2\\% + 0{,}5(2\\% - 3\\%) + 0{,}5(2\\%) = 5\\% - 0{,}5\\% + 1\\% = 5{,}5\\%$$"}, {"title": "Curva dei rendimenti e ciclo", "icon": "📈", "content": "• **Curva molto ripida**: ci si aspettano tassi in forte aumento (inflazione alta attesa), tipico dell'inizio di una ripresa.\n• **Curva piatta o invertita**: ci si aspettano tassi in calo; tipica della **fine dell'espansione**, quando la banca centrale ha alzato molto i tassi a breve.\n• Una **curva invertita** spesso **anticipa una recessione**.\n\nTassi troppo bassi troppo a lungo → rischio di bolle del credito; troppo alti troppo a lungo → recessione."}, {"title": "Obbligazioni di scadenza diversa", "icon": "🏦", "content": "• Quando la banca centrale taglia i tassi (rallentamento o recessione), la curva tende a irripidirsi e i **bond lunghi** guadagnano di più (duration maggiore).\n• Quando li alza (fine espansione), i lunghi soffrono di più, ma la curva tende ad appiattirsi."}]}, "keyPoints": ["Tasso breve ≈ reale + inflazione attesa; lunghi + premio per incertezza", "Taylor: r = R + π + 0,5(π − π*) + 0,5(output gap)", "Curva invertita → spesso precede una recessione", "Output gap positivo → tassi più alti"], "examTips": ["Nella Taylor l'inflazione compare due volte: una nel livello, una nello scarto dal target", "Inflazione SOTTO il target → il termine 0,5(π − π*) è negativo"], "question": {"q": "The central bank of a given country provides the following information: real short-term interest rate 3%; rate of inflation 2%; target rate of inflation 3%; output gap 2%. The central bank policy rate is closest to:", "options": ["5%.", "5.5%.", "6%."], "ans": 1, "exp": "Con la regola di Taylor: r = 3% + 2% + 0,5 × (2% − 3%) + 0,5 × 2% = 5% − 0,5% + 1% = 5,5%."}}, {"id": "e", "code": "LOS 43e", "title": "Descrivere i fattori che influenzano gli yield spread tra obbligazioni non aggiustate per l'inflazione e obbligazioni inflation-indexed", "commandWord": "Descrivere", "importance": "HIGH", "content": {"introduction": "La differenza di rendimento tra un bond **nominale** e uno **indicizzato all'inflazione** con la stessa scadenza si chiama **break-even inflation rate (BEI)**.", "sections": [{"title": "Le formule", "icon": "📐", "content": "Bond indicizzato (reale, default-free):\n$$P_0 = \\sum_{t=1}^{n}\\frac{CF_t}{(1 + R)^t}$$\n\nBond nominale (default-free):\n$$P_0 = \\sum_{t=1}^{n}\\frac{CF_t}{(1 + R + \\pi^e + \\theta)^t}$$\n\n$$BEI = \\text{rendimento nominale} - \\text{rendimento reale} = \\pi^e + \\theta$$\n\n• \\(\\pi^e\\) = inflazione attesa\n• \\(\\theta\\) = premio per il rischio di inflazione (incertezza sull'inflazione futura)\n\n(Nel PDF le lettere sono invertite: θ indica l'inflazione attesa e π il premio. Conta il concetto.)"}, {"title": "Come leggerlo", "icon": "🧠", "content": "• Il BEI **non** è solo l'inflazione attesa: contiene anche il premio per l'incertezza.\n• Il **tasso reale** risk-free è presente in **entrambi** i rendimenti, quindi **si cancella** e non influenza il BEI.\n• BEI in aumento = il mercato si aspetta più inflazione o è più incerto sull'inflazione."}]}, "keyPoints": ["BEI = rendimento nominale − rendimento indicizzato", "BEI = inflazione attesa + premio per incertezza sull'inflazione", "Il tasso reale si cancella"], "examTips": ["Il risk-free reale NON entra nel BEI: distrattore classico"], "question": {"q": "Which of the following elements is least likely to influence the break-even inflation rate (BEI)?", "options": ["Expected inflation", "The risk premium for inflation uncertainty", "The risk-free rate"], "ans": 2, "exp": "Il BEI è la differenza tra il rendimento di un bond nominale e quello di un bond indicizzato con la stessa scadenza. Dipende dall'inflazione attesa e dal premio per l'incertezza sull'inflazione. Il tasso reale risk-free compare in entrambi i rendimenti e si cancella."}}, {"id": "f", "code": "LOS 43f", "title": "Spiegare come la fase del ciclo economico influisce sui credit spread e sulla performance degli strumenti fixed-income sensibili al credito", "commandWord": "Spiegare", "importance": "HIGH", "content": {"introduction": "Il **credit spread** è la differenza di rendimento tra un bond corporate e un titolo di Stato con la stessa scadenza: è il compenso per il rischio di default.", "sections": [{"title": "Il tasso di sconto di un bond rischioso", "icon": "📐", "content": "$$r = R + \\pi^e + \\theta + \\gamma$$\n\nreale + inflazione attesa + premio per l'incertezza sull'inflazione + **credit spread** (\\(\\gamma\\))."}, {"title": "Credit spread lungo il ciclo", "icon": "🔄", "content": "• **Avvicinandosi e durante una recessione**: aumentano probabilità di default e perdite → gli spread **si allargano molto**.\n• **Dopo la recessione e in espansione**: i default calano → gli spread **si restringono**."}, {"title": "Chi va meglio", "icon": "🏅", "content": "• **Spread che si restringono** (ripresa): i bond rischiosi battono i governativi, e i bond con **rating più basso** battono quelli con rating più alto (il loro rendimento scende di più).\n• **Spread che si allargano** (rallentamento): i bond con **rating alto** fanno meglio (il loro rendimento sale meno), i governativi meglio di tutti."}]}, "keyPoints": ["Credit spread = rendimento corporate − governativo di pari scadenza", "Recessione → spread larghi; espansione → spread stretti", "Spread in calo: vincono i rating bassi; spread in aumento: vincono i rating alti"], "examTips": ["Gli spread si muovono in direzione opposta al ciclo (controciclici)"], "question": {"q": "Which of the following statements is most likely correct about the credit spread of risky bonds? The credit spread:", "options": ["Tends to rise during times of economic downturns.", "Increases during expansions.", "Declines during bad economic times."], "ans": 0, "exp": "Nelle fasi di rallentamento aumenta la probabilità di default, quindi gli spread salgono. In espansione, con meno default, tendono a scendere."}}, {"id": "g", "code": "LOS 43g", "title": "Spiegare come le caratteristiche dei mercati dei prodotti di un'impresa influenzano la qualità del credito dell'impresa", "commandWord": "Spiegare", "importance": "MEDIUM", "content": {"introduction": "Il ciclo muove tutti gli spread, ma **quanto** si muovono dipende dal **settore** e dal **rating** dell'emittente: cioè da cosa vende l'azienda e da quanto è solida.", "sections": [{"title": "Settore e ciclicità", "icon": "🏭", "content": "• Le aziende **cicliche** (beni durevoli, auto, materie prime) hanno ricavi molto legati al ciclo → i loro spread reagiscono di più.\n• Le aziende **non cicliche** (beni di prima necessità, utility, sanità) hanno flussi stabili → spread più stabili."}, {"title": "Rating e struttura finanziaria", "icon": "🏅", "content": "• Emittenti profittevoli, con pochi interessi da pagare e poco debito, hanno **rating alto** e spread bassi.\n• Quando gli spread si **restringono** rispetto ai governativi, si restringono anche le differenze tra rating alti e bassi: gli investitori distinguono meno tra credito forte e debole, e i bond con **rating basso** fanno meglio.\n• Quando gli spread si **allargano** vale il contrario."}]}, "keyPoints": ["Aziende cicliche → spread più sensibili al ciclo", "Rating e settore determinano quanto il ciclo pesa sugli spread", "Spread in calo: i rating bassi battono i rating alti"], "examTips": ["Spread che si restringono: corporate > governativi E rating bassi > rating alti"], "question": {"q": "When credit spreads are narrowing relative to government bonds, the spreads between higher- and lower-rated corporate bond categories also narrow. Which of the following expectations is most likely true during these times?", "options": ["Government bonds generally outperform corporate bonds.", "Higher-rated corporate bonds outperform lower-rated corporate bonds.", "Lower-rated corporate bonds tend to outperform higher-rated bonds."], "ans": 2, "exp": "Quando gli spread si restringono gli investitori distinguono meno tra credito forte e debole, e il miglioramento è maggiore per gli emittenti più deboli. I bond corporate battono i governativi e quelli con rating basso battono quelli con rating alto. Il contrario vale quando gli spread si allargano."}}, {"id": "h", "code": "LOS 43h", "title": "Spiegare come la fase del ciclo economico influisce sulle aspettative di crescita degli utili di breve e di lungo periodo", "commandWord": "Spiegare", "importance": "MEDIUM", "content": {"introduction": "Utili e ciclo economico sono strettamente legati, ma non per tutte le aziende allo stesso modo: conta soprattutto **cosa vende** l'azienda.", "sections": [{"title": "Settori difensivi (non ciclici)", "icon": "🛡️", "content": "Beni e servizi di cui non si fa a meno: prodotti per la casa e l'igiene, utility, sanità.\n→ **Utili stabili** lungo il ciclo."}, {"title": "Settori ciclici", "icon": "🎢", "content": "Beni di consumo durevoli e discrezionali, industria.\n→ **Ricavi e utili molto sensibili** al ciclo: alti in espansione, bassi in recessione.\n→ Un aumento della profittabilità delle cicliche segnala spesso un miglioramento dell'economia in arrivo."}, {"title": "Altri fattori", "icon": "🧠", "content": "Anche management ed esperienza o struttura finanziaria contano, ma sono meno legati al ciclo. In un boom anche i manager mediocri sembrano bravi."}]}, "keyPoints": ["Difensivi: utili stabili; ciclici: utili volatili", "Sensibilità degli utili al ciclo cresce con la ciclicità", "Utili delle cicliche in ripresa = segnale di ripresa economica"], "examTips": ["Distrattore: 'le cicliche hanno utili stabili' → falso"], "question": {"q": "Which of the following statements about the business cycle and earnings growth expectations is least likely accurate?", "options": ["Defensive industries have earnings that are relatively stable to changes in the business cycle.", "The sensitivity of a company's earnings to variations in the business cycle is positively correlated with the level of cyclicality.", "Cyclical industries tend to have earnings that are stable and immune to variations in the business cycle."], "ans": 2, "exp": "Le industrie cicliche producono beni di consumo e durevoli: i loro ricavi e utili seguono il ciclo, alti in espansione e bassi in recessione. A e B sono vere: i difensivi hanno utili stabili e la sensibilità al ciclo cresce con la ciclicità."}}, {"id": "i", "code": "LOS 43i", "title": "Spiegare la relazione tra le proprietà di consumption-hedging dell'equity e l'equity risk premium", "commandWord": "Spiegare", "importance": "HIGH", "content": {"introduction": "Le azioni hanno dividendi incerti nell'importo e nei tempi, e possono smettere di pagarli in caso di fallimento: sono più rischiose del debito. In più vanno male proprio quando si sta peggio, e per questo richiedono un premio alto.", "sections": [{"title": "Il rendimento richiesto sulle azioni", "icon": "📐", "content": "$$r_{equity} = R + \\pi^e + \\theta + \\gamma + \\kappa$$\n\nreale + inflazione attesa + premio per l'inflazione + credit spread \\(\\gamma\\) + premio addizionale per l'azionario \\(\\kappa\\).\n\n$$\\text{Equity risk premium} = \\gamma + \\kappa$$\n\ncioè quanto si chiede in più rispetto a un titolo di Stato."}, {"title": "La proprietà di consumption hedging", "icon": "☂️", "content": "Conta il **payoff nei periodi cattivi** più del rendimento medio:\n• gli asset che pagano bene in recessione proteggono il consumo → sono molto apprezzati → **premio per il rischio basso** (es. titoli di Stato);\n• le azioni **perdono valore in recessione** → sono una cattiva copertura del consumo → gli investitori chiedono un **equity risk premium alto**."}]}, "keyPoints": ["ERP = credit spread + premio addizionale azionario", "Contano i payoff nei periodi CATTIVI", "Azioni = cattiva copertura → premio alto", "Titoli di Stato = buona copertura → premio basso"], "examTips": ["Distrattore: 'conta il payoff nei periodi BUONI' → falso"], "question": {"q": "Which of the following statements about equity is the least accurate?", "options": ["Equity provides a poor hedge against bad consumption outcomes.", "Assets that provide a higher payoff during economic downturns have lower risk premiums.", "The consumption hedging property highlights that the payoff of a security during good economic times is what matters more than its return."], "ans": 2, "exp": "La proprietà di consumption hedging dice che conta il payoff nei periodi CATTIVI, non in quelli buoni. A e B sono vere: le azioni perdono valore in recessione e gli asset che pagano bene nelle fasi negative hanno premi per il rischio più bassi."}}, {"id": "j", "code": "LOS 43j", "title": "Descrivere gli effetti ciclici sui multipli di valutazione", "commandWord": "Descrivere", "importance": "MEDIUM", "content": {"introduction": "**P/E** e **P/B** salgono quando il mercato si aspetta più crescita degli utili e quando il tasso richiesto scende. Entrambe le cose seguono il ciclo.", "sections": [{"title": "Da cosa dipendono", "icon": "📐", "content": "Con il modello di Gordon:\n$$\\frac{P}{E} = \\frac{\\text{payout}\\,(1+g)}{r - g}$$\n\nQuindi i multipli:\n• **salgono** con la **crescita attesa degli utili** (\\(g\\));\n• **scendono** con il **rendimento richiesto** (\\(r\\)): tassi reali, inflazione attesa, premio per l'incertezza sull'inflazione, equity risk premium."}, {"title": "Lungo il ciclo", "icon": "🔄", "content": "• **Espansione**: crescita attesa alta, ERP più basso → P/E e P/B **salgono**.\n• **Recessione**: crescita attesa bassa, ERP più alto → multipli **scendono**.\n\nUn P/B alto indica grandi aspettative di crescita ma un **margine di sicurezza** più basso se le cose vanno male."}]}, "keyPoints": ["P/E e P/B crescono con la crescita attesa degli utili", "P/E e P/B calano con tassi reali, inflazione attesa ed ERP", "Espansione → multipli più alti"], "examTips": ["Tutto ciò che alza il tasso richiesto abbassa i multipli"], "question": {"q": "When is the price-to-book ratio most likely to increase, holding all else constant? When:", "options": ["Real interest rates increase.", "Expected future earnings growth increases.", "Expected inflation increases."], "ans": 1, "exp": "Il P/B cresce con la crescita attesa degli utili e scende con il rendimento richiesto. Tassi reali o inflazione attesa più alti aumentano il rendimento richiesto e quindi riducono il P/B."}}, {"id": "k", "code": "LOS 43k", "title": "Descrivere come l'analisi economica è usata nelle strategie di sector rotation", "commandWord": "Descrivere", "importance": "MEDIUM", "content": {"introduction": "La **sector rotation** sposta il portafoglio tra settori seguendo il ciclo: ciclici quando l'economia accelera, difensivi quando rallenta. Funziona solo con il timing giusto.", "sections": [{"title": "Ex-post risk premium di un settore", "icon": "📐", "content": "$$\\text{Premio ex-post} = \\bar{R}_{settore} - R_{F,\\,breve}$$\n\nrendimento medio del settore meno il tasso risk-free nominale a breve, calcolati a posteriori sui dati storici. Il settore con il premio più alto ha fatto meglio."}, {"title": "La logica", "icon": "🔄", "content": "• Le **azioni cicliche** sono molto volatili e seguono il ciclo.\n• Le **non cicliche** (beni di prima necessità) reggono anche in recessione.\n• Se si riuscisse a passare dal settore in difficoltà a quello in forma **prima** del cambio, si guadagnerebbe molto.\n• In pratica il timing è difficile: un timing sbagliato porta a fare **peggio dell'indice**."}, {"title": "Esempio svolto", "icon": "✏️", "content": "Beni di prima necessità (non ciclici) = 15%; beni discrezionali (ciclici) = 12%; T-bill = 5%.\n\nPremio non ciclici = 15% − 5% = **10%**\nPremio ciclici = 12% − 5% = **7%**\n\n→ I **non ciclici** hanno fatto meglio."}]}, "keyPoints": ["Premio ex-post = rendimento medio del settore − risk-free a breve", "Ciclici in espansione, difensivi in rallentamento", "Il timing è il punto debole della rotazione"], "examTips": ["Consumer staples = non ciclici; consumer discretionary = ciclici"], "question": {"q": "The total annualized return of the consumer staple goods sector in a given stock market was 15%; for the consumer discretionary goods sector it was 12%. The average annualized return on the country's T-bills over the same period was 5%. Which of the following is most likely correct?", "options": ["Cyclical stocks outperformed non-cyclical stocks.", "Non-cyclical stocks outperformed the cyclical stocks.", "The performance of the two sectors is identical."], "ans": 1, "exp": "Premio ex-post dei beni di prima necessità (non ciclici) = 15% − 5% = 10%; dei beni discrezionali (ciclici) = 12% − 5% = 7%. I non ciclici hanno fatto meglio."}}, {"id": "l", "code": "LOS 43l", "title": "Descrivere i fattori economici che influenzano l'investimento in commercial real estate", "commandWord": "Descrivere", "importance": "MEDIUM", "content": {"introduction": "L'immobiliare commerciale è un ibrido: gli **affitti** somigliano a un'obbligazione, il **valore dell'immobile** a fine contratto somiglia a un'azione. In più è illiquido e ciclico, quindi chiede premi per il rischio alti.", "sections": [{"title": "Componente obbligazionaria: gli affitti", "icon": "🏢", "content": "Il reddito da locazione è il flusso atteso. La sua qualità dipende dalla **qualità del credito degli inquilini**: inquilini solidi pagano con puntualità."}, {"title": "Componente azionaria: il valore dell'immobile", "icon": "📈", "content": "A fine contratto il proprietario può riaffittare, ristrutturare o vendere. Il valore dipende da posizione e stato dell'economia, quindi è **incerto** come un'azione → serve un premio per questa incertezza."}, {"title": "Liquidità e ciclicità", "icon": "🔒", "content": "• **Illiquido**: vendere richiede tempo e costi alti. L'illiquidità rende l'immobile una cattiva copertura nei periodi cattivi → **premio di liquidità**.\n• **Pro-ciclico**: i prezzi salgono e scendono con l'economia → **premio per il rischio alto**."}]}, "keyPoints": ["Affitti = componente obbligazionaria (dipende dagli inquilini)", "Valore finale = componente azionaria (incerta)", "Illiquido e pro-ciclico → premi per il rischio alti"], "examTips": ["Distrattore: 'l'immobiliare commerciale è anticiclico' → è pro-ciclico"], "question": {"q": "Which of the following statements relating to commercial real estate is most likely correct?", "options": ["The credit quality of the tenants does not affect the value of the property.", "Commercial real estate ownership tends to be counter-cyclical.", "The risk premium for illiquidity and the risk premium for uncertainty in future value are high in commercial real estate as compared to other asset classes."], "ans": 2, "exp": "L'immobiliare commerciale è molto illiquido e il valore futuro dell'immobile è incerto come quello di un'azione: servono premi alti sia per l'illiquidità sia per l'incertezza. A è sbagliata: la qualità degli inquilini conta. B è sbagliata: i prezzi sono pro-ciclici."}}]}, {"id": "pm-r44", "number": 44, "title": "Analysis of Active Portfolio Management", "estimatedTime": "4-5 ore", "totalLOS": 6, "los": [{"id": "a", "code": "LOS 44a", "title": "Descrivere come si misura il valore aggiunto dalla gestione attiva", "commandWord": "Descrivere", "importance": "VERY HIGH", "content": {"introduction": "Il **valore aggiunto** (active return) è quanto il portafoglio gestito fa meglio (o peggio) del benchmark. Nasce interamente dalle differenze di peso rispetto al benchmark: gli **active weight**.", "sections": [{"title": "Le formule", "icon": "📐", "content": "$$R_A = R_P - R_B$$\n\n$$R_B = \\sum_{i=1}^{n} w_{B,i}R_i \\qquad R_P = \\sum_{i=1}^{n} w_{P,i}R_i$$\n\nSottraendo:\n$$R_A = \\sum_{i=1}^{n} \\Delta w_i\\,R_i \\quad \\text{con} \\quad \\Delta w_i = w_{P,i} - w_{B,i}$$\n\nGli active weight sommano sempre a zero: sovrappesare qualcosa significa sottopesare qualcos'altro.\n\nIl valore aggiunto può venire da scelta dei titoli, asset allocation, scelte per settore o per area geografica."}, {"title": "Esempio svolto", "icon": "✏️", "content": "| Titolo | Peso P | Peso B | Δw | Rendimento | Δw × R |\n|---|---|---|---|---|---|\n| A | 35% | 30% | +5% | 16% | +0,80% |\n| B | 30% | 25% | +5% | 18% | +0,90% |\n| C | 20% | 25% | −5% | 14% | −0,70% |\n| D | 15% | 20% | −5% | 10% | −0,50% |\n\n$$R_A = 0{,}8\\% + 0{,}9\\% - 0{,}7\\% - 0{,}5\\% = 0{,}5\\%$$"}, {"title": "Attenzione: asset allocation e selezione", "icon": "🧠", "content": "Quando portafoglio e benchmark hanno **rendimenti diversi** per la stessa asset class (perché il gestore sceglie titoli diversi dentro la classe), il valore aggiunto si divide in:\n• **asset allocation**: \\(\\sum \\Delta w_i \\times R_{B,i}\\)\n• **selezione**: \\(\\sum w_{P,i}\\,(R_{P,i} - R_{B,i})\\)\n\ne il totale è \\(R_P - R_B\\) calcolato con pesi e rendimenti di ciascuno."}]}, "keyPoints": ["R_A = R_P − R_B = Σ Δw × R", "Δw = peso portafoglio − peso benchmark (sommano a zero)", "Valore aggiunto da selezione, allocazione, settori, paesi"], "examTips": ["Usa i pesi del benchmark per R_B e quelli del portafoglio per R_P", "Leggi bene se i rendimenti sono gli stessi per P e B oppure no"], "question": {"q": "XYZ is a pension scheme with the following asset classes. Expected returns are the same for the portfolio and the benchmark:\nQuoted equities: portfolio weight 20%, benchmark weight 25%, expected return 20%\nTreasury bonds: portfolio weight 50%, benchmark weight 40%, expected return 15%\nOffshore investments: portfolio weight 30%, benchmark weight 35%, expected return 10%\nThe ex-ante value added is closest to:", "options": ["-0.5%.", "0.0%.", "0.75%."], "ans": 1, "exp": "E(R_B) = 0,25 × 20% + 0,40 × 15% + 0,35 × 10% = 14,5%. E(R_P) = 0,20 × 20% + 0,50 × 15% + 0,30 × 10% = 14,5%. Il valore aggiunto ex-ante è 14,5% − 14,5% = 0%. Con gli active weight: −5% × 20% + 10% × 15% − 5% × 10% = −1% + 1,5% − 0,5% = 0%."}}, {"id": "b", "code": "LOS 44b", "title": "Calcolare e interpretare l'information ratio (ex-post ed ex-ante) e confrontarlo con lo Sharpe ratio", "commandWord": "Calcolare", "importance": "VERY HIGH", "content": {"introduction": "Lo **Sharpe ratio** misura il rendimento per unità di rischio **totale**; l'**information ratio** il rendimento attivo per unità di rischio **attivo**. Combinati, dicono quanto della strategia attiva conviene usare.", "sections": [{"title": "Information ratio e Sharpe ratio", "icon": "📐", "content": "$$IR = \\frac{R_P - R_B}{\\sigma(R_P - R_B)} = \\frac{\\text{active return}}{\\text{active risk}}$$\n\n**Ex-ante**: active return atteso e active risk previsto. **Ex-post**: medie realizzate e deviazione standard campionaria.\n\n$$SR = \\frac{R_P - R_F}{\\sigma_P}$$\n\n• Lo **Sharpe** non cambia con la **leva** (aggiungere o togliere cassa risk-free).\n• L'**IR** di un portafoglio non vincolato non cambia con l'**aggressività** degli active weight (raddoppiare le scommesse raddoppia active return e active risk)."}, {"title": "Combinare benchmark e strategia attiva", "icon": "📐", "content": "Livello ottimale di active risk:\n$$\\sigma_A^* = \\frac{IR}{SR_B}\\,\\sigma_B$$\n\nQuota da mettere nella strategia attiva:\n$$w_A = \\frac{\\sigma_A^*}{\\sigma_A}$$\n\nSharpe del portafoglio ottimale:\n$$SR_P^2 = SR_B^2 + IR^2$$\n\nActive return atteso:\n$$E(R_A) = IR \\times \\sigma_A^*$$"}, {"title": "Esempio svolto", "icon": "✏️", "content": "IR = 0,14; active risk della strategia = 12%; SR benchmark = 0,30; rischio totale benchmark = 20%.\n\n**Passo 1**, active risk ottimale:\n$$\\sigma_A^* = \\frac{0{,}14}{0{,}30} \\times 20\\% = 9{,}33\\%$$\n\n**Passo 2**, quota nella strategia attiva:\n$$w_A = \\frac{9{,}33\\%}{12\\%} = 77{,}8\\%$$\n(il resto, 22,2%, va nel benchmark)\n\n**Passo 3**, Sharpe del portafoglio combinato:\n$$SR_P = \\sqrt{0{,}30^2 + 0{,}14^2} = \\sqrt{0{,}1096} = 0{,}331$$\n\n**Passo 4**, active return atteso:\n$$0{,}14 \\times 9{,}33\\% = 1{,}31\\%$$"}]}, "keyPoints": ["IR = active return / active risk; SR = excess return / rischio totale", "SR invariante alla leva; IR invariante all'aggressività (senza vincoli)", "σ_A* = (IR / SR_B) × σ_B", "SR_P² = SR_B² + IR²"], "examTips": ["Nella formula di SR_P eleva al quadrato SIA SR_B SIA IR, poi fai la radice", "w_A = σ* / σ attuale della strategia: se < 1 si mescola con il benchmark"], "question": {"q": "Given the following information:\nActive portfolio: Sharpe ratio 0.0095, information ratio 0.0047, active risk 0.0025\nBenchmark portfolio: Sharpe ratio 0.0105, volatility 0.0057\nThe Sharpe ratio of the optimal portfolio obtained by combining the active and the benchmark portfolios is closest to:", "options": ["0.0095.", "0.0105.", "0.0115."], "ans": 2, "exp": "SR_P = √(SR_B² + IR²) = √(0,0105² + 0,0047²) = √(0,00011025 + 0,00002209) = √0,00013234 ≈ 0,0115."}}, {"id": "c", "code": "LOS 44c", "title": "Enunciare e interpretare la fundamental law of active portfolio management, inclusi transfer coefficient, information coefficient, breadth e active risk", "commandWord": "Interpretare", "importance": "VERY HIGH", "content": {"introduction": "La **legge fondamentale** dice da cosa dipende il successo di un gestore attivo: dalla **skill** (IC), dal **numero di scommesse indipendenti** (breadth), da **quanto bene le traduce nel portafoglio** (TC) e da **quanto rischio attivo** prende.", "sections": [{"title": "I quattro ingredienti", "icon": "🧩", "content": "• **IC (information coefficient)**: correlazione tra rendimenti attivi previsti e realizzati. Misura la **skill**. Va da −1 a +1; 0 = nessuna skill. Valori realistici sono piccoli (es. 0,05).\n• **BR (breadth)**: numero di **decisioni indipendenti** in un anno (es. 100 titoli rivisti ogni trimestre → fino a 400, se indipendenti).\n• **TC (transfer coefficient)**: correlazione tra active weight \"ideali\" (dai rendimenti previsti) ed effettivi. Misura quanto i **vincoli** (no short, limiti di peso…) rovinano la traduzione delle idee. TC = 1 senza vincoli, < 1 con vincoli.\n• **σ_A (active risk)**: l'aggressività."}, {"title": "La legge base e quella completa", "icon": "📐", "content": "**Senza vincoli** (TC = 1):\n$$IR^* = IC\\,\\sqrt{BR} \\qquad E(R_A) = IC\\,\\sqrt{BR}\\;\\sigma_A$$\n\n**Con vincoli** (legge completa):\n$$IR = TC \\times IC\\,\\sqrt{BR} \\qquad E(R_A) = TC \\times IC\\,\\sqrt{BR}\\;\\sigma_A$$\n\n$$TC = \\text{Corr}\\!\\left(\\frac{\\mu_i}{\\sigma_i},\\; \\Delta w_i\\,\\sigma_i\\right)$$\n\nActive risk ottimale con vincoli e Sharpe massimo:\n$$\\sigma_A^* = TC\\,\\frac{IR^*}{SR_B}\\,\\sigma_B \\qquad SR_P^2 = SR_B^2 + TC^2\\,(IR^*)^2$$\n\nCon TC = 0 l'active risk ottimale è zero: conviene tenere solo il benchmark.\n\nPerché serve il TC: con IC mensile 0,04 e 1.050 titoli, la legge base dà \\(0{,}04\\sqrt{12 \\times 1050} = 4{,}49\\), un IR irrealistico."}, {"title": "Esempio svolto: legge completa", "icon": "✏️", "content": "Dati: Cov(μ/σ, Δwσ) = 0,074 (%²); Var(Δwσ) = 0,0033916 (%²); Var(μ/σ) = 4,266 (%²). IC = 0,75; BR = 9; vincolo di active risk = 10%.\n\n**Passo 1**, transfer coefficient:\n$$TC = \\frac{0{,}074}{\\sqrt{4{,}266}\\,\\sqrt{0{,}0033916}} = \\frac{0{,}074}{2{,}0654 \\times 0{,}0582} = 0{,}615$$\n\n**Passo 2**, valore aggiunto atteso:\n$$E(R_A) = 0{,}615 \\times 0{,}75 \\times \\sqrt{9} \\times 10\\% = 13{,}84\\%$$\n\n(L'IC di 0,75 è irrealisticamente alto: serve solo per l'esercizio.)"}, {"title": "Ex-post: skill realizzata e rumore", "icon": "📐", "content": "Con l'IC **realizzato** \\(IC_R\\):\n$$E(R_A \\mid IC_R) = TC \\times IC_R\\,\\sqrt{BR}\\;\\sigma_A$$\n\n$$R_A = E(R_A \\mid IC_R) + \\text{noise}$$\n\nIl **noise** è la parte del rendimento attivo non spiegata dalla skill realizzata.\n\n**Esempio**: BR = 96, IC_R = 0,08, TC = 0,90, σ_A = 5%, rendimento attivo effettivo = 3,62%.\n$$E(R_A \\mid IC_R) = 0{,}90 \\times 0{,}08 \\times \\sqrt{96} \\times 5\\% = 3{,}53\\%$$\n$$\\text{noise} = 3{,}62\\% - 3{,}53\\% = 0{,}09\\%$$"}]}, "keyPoints": ["IR = TC × IC × √BR; E(R_A) = IR × σ_A", "IC = skill; BR = scommesse indipendenti; TC = efficienza nel tradurle", "Senza vincoli TC = 1; con vincoli TC < 1", "Rendimento effettivo = atteso dato IC realizzato + rumore"], "examTips": ["Trucco: 'Tanto Intuito, Bene Ripetuto' = TC · IC · √BR", "Attenzione: la breadth va sotto RADICE"], "question": {"q": "An active management strategy includes ninety-six investment decisions, a realized information coefficient of 0.08, and a transfer coefficient of 0.90. The annualized active risk of the strategy is 5%, and the actual return on the active portfolio is 3.62%. The amount of forecasted active return that was offset by the noise component is closest to:", "options": ["0.01%.", "0.04%.", "0.09%."], "ans": 2, "exp": "E(R_A | IC_R) = 0,90 × 0,08 × √96 × 5% = 3,53%. Rumore = 3,62% − 3,53% = 0,09%."}}, {"id": "d", "code": "LOS 44d", "title": "Spiegare come l'information ratio possa essere utile nella selezione del gestore e nella scelta del livello di active risk di portafoglio", "commandWord": "Spiegare", "importance": "HIGH", "content": {"introduction": "Combinando benchmark e strategia attiva, lo Sharpe massimo raggiungibile cresce con l'IR. Quindi, a parità di benchmark, conviene scegliere il gestore con l'**IR atteso più alto** e poi dosarlo al livello ottimale di active risk.", "sections": [{"title": "IR come criterio di scelta", "icon": "🏆", "content": "Il portafoglio ottimale è quello con lo **Sharpe più alto**, indipendentemente dall'avversione al rischio dell'investitore:\n$$SR_P^2 = SR_B^2 + IR^2$$\n\nQuindi il gestore con l'IR più alto porta allo Sharpe più alto. Per la teoria media-varianza il **miglior criterio** per valutare la gestione attiva è l'**IR atteso**, soprattutto a parità di benchmark.\n\nAttenzione: con IR **negativo** la relazione non vale (IR² è positivo, ma la strategia va usata al contrario o evitata)."}, {"title": "Livello ottimale di active risk", "icon": "📐", "content": "$$\\sigma(R_A)^* = \\frac{IR}{SR_B}\\,\\sigma(R_B)$$\n\n**Esempio**: IR = 0,20; SR benchmark = 0,25; rischio benchmark = 15%.\n$$\\sigma(R_A)^* = \\frac{0{,}20}{0{,}25} \\times 15\\% = 12\\%$$\n\nL'investitore regola poi il rischio totale con la cassa: l'IR sceglie **quanto rischio attivo**, l'avversione al rischio sceglie **quanta leva**."}]}, "keyPoints": ["IR più alto → Sharpe ottimale più alto", "Criterio migliore per scegliere il gestore: IR atteso", "σ_A* = (IR / SR_B) × σ_B"], "examTips": ["L'active risk attuale del gestore NON serve per l'active risk ottimale: distrattore", "Con IR negativo la regola 'IR più alto = meglio' va interpretata con attenzione"], "question": {"q": "A portfolio manager uses a benchmark portfolio that has a Sharpe ratio of 0.30 and a total risk of 12.0%. His actively managed portfolio has an information ratio of 0.25 and an active risk of 5.0%. The portfolio's optimal level of active risk is closest to:", "options": ["10%.", "12%.", "15%."], "ans": 0, "exp": "σ_A* = (IR / SR_B) × σ_B = (0,25 / 0,30) × 12% = 10%. L'active risk attuale del gestore (5%) non entra nella formula."}}, {"id": "e", "code": "LOS 44e", "title": "Confrontare le strategie di gestione attiva (incluse market timing e security selection) e valutare i cambiamenti di strategia alla luce della fundamental law", "commandWord": "Confrontare", "importance": "VERY HIGH", "content": {"introduction": "Le strategie attive si distinguono soprattutto per la **breadth**: la selezione dei titoli fa molte scommesse, il market timing poche. Con la stessa skill, più breadth significa IR più alto.", "sections": [{"title": "Security selection", "icon": "🔎", "content": "Scegliere titoli che ci si aspetta battano il mercato. Molti titoli e revisioni frequenti → **breadth alta**.\n\nPer la legge fondamentale, a parità di skill la security selection ha l'**IR più alto**, seguita dalla sector rotation."}, {"title": "Sector rotation", "icon": "🔄", "content": "Spostarsi tra settori seguendo il ciclo. Pochi settori → breadth media. Il timing è difficile: sbagliarlo porta a fare peggio dell'indice."}, {"title": "Market timing", "icon": "⏱️", "content": "Variare la quota investita in azioni in base alle previsioni sul mercato. Una sola scommessa per periodo → **breadth bassa**.\n\nInformation coefficient di un market timer:\n$$IC = \\frac{2N_c}{N} - 1 = 2 \\times (\\%\\ \\text{corrette}) - 1$$\n\n**Esempio**: decisioni mensili, 52% corrette, portafoglio non vincolato (TC = 1):\n$$IC = 2(0{,}52) - 1 = 0{,}04 \\qquad IR = 0{,}04 \\times 1 \\times \\sqrt{12} = 0{,}14$$\n\nAnche un 52% di previsioni giuste, se ripetuto spesso, crea valore."}, {"title": "Valutare un cambio di strategia", "icon": "🧠", "content": "Con la legge \\(IR = TC \\times IC \\times \\sqrt{BR}\\) si confrontano le alternative:\n• più **breadth** (più titoli, più frequenza) aumenta l'IR, se le scommesse restano indipendenti;\n• togliere **vincoli** (es. permettere lo short) aumenta il TC;\n• più skill aumenta l'IC.\n\nPer raddoppiare l'IR via breadth bisogna **quadruplicare** il numero di scommesse indipendenti."}]}, "keyPoints": ["Security selection: breadth alta → IR più alto a parità di skill", "Market timing: IC = 2 × % corrette − 1", "Per raddoppiare l'IR via breadth servono 4 volte le scommesse"], "examTips": ["Per il market timer la breadth è il numero di decisioni all'anno (12 mensili, 4 trimestrali)", "Ricorda di moltiplicare per il TC se è dato"], "question": {"q": "Joyce Wright is a market timer who makes quarterly asset allocation decisions based on forecasts of market movement. She is right on 65% of her bets. Given a transfer coefficient of 0.80, Wright's information ratio is closest to:", "options": ["0.3.", "0.48.", "0.96."], "ans": 1, "exp": "IC = 2 × 0,65 − 1 = 0,30. Le decisioni sono trimestrali, quindi BR = 4. IR = 0,30 × 0,80 × √4 = 0,48. A è solo l'IC; C dimentica il TC."}}, {"id": "f", "code": "LOS 44f", "title": "Descrivere i punti di forza e i limiti pratici della fundamental law of active management", "commandWord": "Descrivere", "importance": "HIGH", "content": {"introduction": "La legge fondamentale è un quadro utile per confrontare strategie diverse (selezione, rotazione, timing), ma nella pratica due ingredienti sono difficili da misurare: la **skill reale** e la **vera breadth**.", "sections": [{"title": "Punti di forza", "icon": "👍", "content": "• Permette di confrontare strategie diverse con un unico linguaggio.\n• Mostra il ruolo di skill, numero di scommesse e vincoli.\n• Aiuta a decidere quanto rischio attivo prendere."}, {"title": "Limite 1: misurare la skill ex-ante", "icon": "🎯", "content": "• I gestori tendono a **sovrastimare** il proprio IC.\n• L'IC non è costante: cambia nel tempo e tra segmenti di titoli.\n\nQian e Hua (2004) aggiungono l'incertezza sulla skill:\n$$\\sigma_A = \\sigma_{IC}\\,\\sqrt{N}\\,\\sigma_{RM}$$\ndove \\(\\sigma_{RM}\\) è il tracking risk previsto dal modello e \\(\\sigma_{IC}\\) è la variabilità dell'IC: l'active risk realizzato risulta maggiore di quello previsto."}, {"title": "Limite 2: indipendenza delle decisioni", "icon": "🔗", "content": "La breadth conta solo le scommesse **indipendenti**, ma:\n• **dipendenza cross-sectional**: i rendimenti attivi dei titoli sono correlati (es. 500 titoli dell'S&P 500 non sono 500 scommesse indipendenti);\n• **dipendenza time-series**: un titolo previsto in sovraperformance un trimestre di solito lo resta anche nei successivi.\n\nBreadth corretta (Clarke, de Silva e Thorley, 2006):\n$$BR = \\frac{N}{1 + (N - 1)\\rho}$$\ncon \\(\\rho\\) correlazione media tra le decisioni. Con \\(\\rho = 0\\) si ha \\(BR = N\\); con \\(\\rho\\) > 0 la breadth effettiva è molto più bassa."}]}, "keyPoints": ["Forza: confronta strategie diverse", "Limite 1: IC difficile da stimare e variabile", "Limite 2: le decisioni non sono indipendenti", "BR effettiva = N / [1 + (N − 1)ρ]"], "examTips": ["Con correlazione anche piccola la breadth crolla: es. N = 100, ρ = 0,1 → BR ≈ 9,2", "Cross-sectional = tra titoli; time-series = nel tempo"], "question": {"q": "Two active managers, A and B, construct a portfolio every quarter by selecting individual stocks of the S&P 500. Manager A has a substantially higher information ratio than manager B. They propose the following possible reasons, based on the limitations of the fundamental law:\nI. Correlation of the active returns on the S&P 500 stocks.\nII. Correlation of the forecasts for the same stocks from quarter to quarter.\nIII. Different information coefficients for different stocks.\nWhich of the following gives the most accurate reasons?", "options": ["I and II", "II and III", "I, II and III"], "ans": 2, "exp": "Tutte e tre sono limiti della legge. I: i rendimenti attivi dei titoli sono correlati, quindi le decisioni indipendenti sono meno di 500 (dipendenza cross-sectional). II: un titolo previsto in sovraperformance tende a restarlo per più trimestri (dipendenza time-series). III: la legge assume lo stesso IC per tutte le previsioni, ma l'IC può variare tra titoli e nel tempo."}}]}]};
const TOTAL_CFA_LOS = Object.values(CFA_CURRICULUM).reduce((n, t) => n + t.modules.reduce((k, m) => k + m.los.length, 0), 0);

// ========== THEME SYSTEM ==========
const ThemeContext = /*#__PURE__*/createContext();
const themes = {
  dark: {
    name: 'dark',
    bg: 'bg-slate-900',
    bgGradient: 'from-slate-900 via-slate-800 to-slate-900',
    card: 'bg-slate-800',
    cardBorder: 'border-slate-700',
    text: 'text-white',
    textMuted: 'text-slate-400',
    textSecondary: 'text-slate-300',
    input: 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-500',
    nav: 'bg-slate-900 border-slate-800',
    accent: 'amber'
  },
  light: {
    name: 'light',
    bg: 'bg-slate-50',
    bgGradient: 'from-slate-100 via-white to-slate-100',
    card: 'bg-white',
    cardBorder: 'border-slate-200',
    text: 'text-slate-900',
    textMuted: 'text-slate-500',
    textSecondary: 'text-slate-600',
    input: 'bg-white border-slate-300 text-slate-900 placeholder-slate-400',
    nav: 'bg-white border-slate-200',
    accent: 'amber'
  }
};

// ========== PROFESSIONAL SVG ICONS ==========

// ========== RALLY v3 — mascotte FinLearn (cel-shading a toni piatti + animazione con squash & stretch) ==========
// Mood: neutral · happy · thinking · celebrating · sad · correct · wrong · walking
// Tecnica: ogni parte = forma in tono d'ombra + area illuminata ritagliata (clipPath) + riflesso. Luce fissa da in alto a sinistra.
const R3 = {
  S: '#D57E1A', B: '#F6A730', H: '#FFC45C',            // pelo: ombra · base · luce
  tuftS: '#B8640F', tuftB: '#D9821F',
  bellyS: '#F0BE80', bellyB: '#FFE0B0',
  muzS: '#EDB37E', muzB: '#FFD7A6', muzH: '#FFEBCB',
  hornS: '#E2C690', hornB: '#FFF4DE', hornTip: '#B98F5A', hornRing: '#CFAE76',
  hoofS: '#33231B', hoofB: '#563C2F', hoofH: '#7B5A48',
  ear: '#EF8A78', earH: '#FFA898',
  ink: '#1A0F08', iris: '#4A2A15', eyeShade: '#EBEFF5',
  nostril: '#7A3418', nostrilIn: '#4E1E0B',
  mouth: '#5C1A0E', tongue: '#FF7B7B', cheek: '#FF8A73',
  gold: '#F2C440', goldS: '#C4931C', brow: '#A9570C'
};

function r3Mirror(d) {
  return d.replace(/([MLCQHVZ])([^MLCQHVZ]*)/g, (all, cmd, args) => {
    if (cmd === 'Z' || cmd === 'V') return all;
    const n = args.trim().split(/[\s,]+/).filter(Boolean).map(Number);
    if (cmd === 'H') return 'H' + (160 - n[0]);
    for (let i = 0; i < n.length; i += 2) n[i] = +(160 - n[i]).toFixed(2);
    return cmd + n.join(' ');
  });
}

// parte con cel-shading: d = contorno; lit/hi = forme (stringhe svg) disegnate dentro il ritaglio
function r3Part(u, key, d, shadowFill, inner, extraAttr) {
  return `<clipPath id="${key}${u}"><path d="${d}"/></clipPath>` +
    `<path d="${d}" fill="${shadowFill}"${extraAttr || ''}/>` +
    `<g clip-path="url(#${key}${u})">${inner}</g>`;
}

function r3Eye(u, m, side) {
  const C = R3;
  const cx = side === 'L' ? 63 : 97, cy = 46, rx = 12, ry = 13.4;
  const sgn = side === 'L' ? 1 : -1;
  if (m === 'celebrating') return `<path d="M${cx - 9.5} ${cy + 3} Q${cx} ${cy - 8} ${cx + 9.5} ${cy + 3}" fill="none" stroke="${C.ink}" stroke-width="4.2" stroke-linecap="round"/>`;
  const look = m === 'thinking' ? [2.6, -4] : (m === 'sad' || m === 'wrong') ? [0, 3] : [1, 1.2];
  const px = cx + look[0], py = cy + look[1];
  // palpebra superiore per mood: [abbassamento, rotazione]
  const lid = {
    neutral: [3.5, 6], walking: [3.5, 6], happy: [0, 0], correct: [0, 0],
    thinking: side === 'L' ? [1, -4] : [7, 4], sad: [8, -16], wrong: [7, -12]
  }[m] || [3, 5];
  const bottom = (m === 'happy' || m === 'correct') ? `<ellipse cx="${cx}" cy="${cy + 20}" rx="17" ry="10" fill="${C.B}"/>` : '';
  const k = `e${side}`;
  return `<clipPath id="${k}${u}"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/></clipPath>` +
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff"/>` +
    `<g clip-path="url(#${k}${u})">` +
      `<ellipse cx="${cx}" cy="${cy - 14}" rx="15" ry="5" fill="${C.eyeShade}"/>` +
      `<g class="r3-look"><circle cx="${px}" cy="${py}" r="7.8" fill="${C.iris}"/><circle cx="${px + .4}" cy="${py + .4}" r="5.4" fill="${C.ink}"/>` +
      `<circle cx="${px + 2.7}" cy="${py - 3}" r="2.9" fill="#fff"/><circle cx="${px - 2.5}" cy="${py + 2.7}" r="1.25" fill="#fff"/></g>` +
      bottom +
      `<g class="r3-blink"><g transform="translate(0 ${lid[0]}) rotate(${lid[1] * sgn} ${cx} ${cy - 13})"><rect x="${cx - 18}" y="${cy - 39}" width="36" height="26" fill="${C.B}"/></g></g>` +
    `</g>`;
}

function r3Face(u, m) {
  const C = R3;
  let s = '';
  s += `<g class="r3-eyes">${r3Eye(u, m, 'L')}${r3Eye(u, m, 'R')}</g>`;
  // sopracciglia (ciuffi di pelo)
  const br = (d) => `<path d="${d}" fill="none" stroke="${C.brow}" stroke-width="4.4" stroke-linecap="round"/>`;
  if (m === 'thinking') s += br('M53 27 Q62 20.5 72 26');
  if (m === 'sad' || m === 'wrong') s += br('M53 31.5 Q62 31 70.5 25.5') + br('M89.5 25.5 Q98 31 107 31.5');
  if (m === 'celebrating' || m === 'correct') s += br('M54 28 Q63 22 72 27') + br('M88 27 Q97 22 106 28');
  // guance
  const blush = (m === 'sad' || m === 'wrong') ? .18 : .38;
  s += `<ellipse cx="45" cy="72" rx="7.5" ry="4.2" fill="${C.cheek}" opacity="${blush}"/><ellipse cx="115" cy="72" rx="7.5" ry="4.2" fill="${C.cheek}" opacity="${blush}"/>`;
  // muso
  const muz = 'M80 58 C99 58 111 66 111 77 C111 89 98 96 80 96 C62 96 49 89 49 77 C49 66 61 58 80 58 Z';
  s += r3Part(u, 'mz', muz, C.muzS,
    `<ellipse cx="77" cy="73" rx="30" ry="16" fill="${C.muzB}"/><ellipse cx="70" cy="63.5" rx="15" ry="3.4" fill="${C.muzH}"/>`);
  // narici
  const nos = 'M68.5 68 C72.5 67.6 75 71 74.4 74.8 C73.9 78 68.6 78.6 66.8 76 C65 73 65.6 68.3 68.5 68 Z';
  s += `<path d="${nos}" fill="${C.nostril}"/><path d="${r3Mirror(nos)}" fill="${C.nostril}"/>`;
  s += `<ellipse cx="70.4" cy="74" rx="2.2" ry="2.8" fill="${C.nostrilIn}"/><ellipse cx="89.6" cy="74" rx="2.2" ry="2.8" fill="${C.nostrilIn}"/>`;
  // anello al naso
  s += `<path d="M75 79.5 A5 5 0 1 0 85 79.5" fill="none" stroke="${C.goldS}" stroke-width="3.2" stroke-linecap="round"/>` +
       `<path d="M75.6 80.6 A4.6 4.6 0 0 0 79.2 84.4" fill="none" stroke="#FFE68A" stroke-width="1.3" stroke-linecap="round"/>` +
       `<path d="M75 79.5 A5 5 0 1 0 85 79.5" fill="none" stroke="${C.gold}" stroke-width="1.6" stroke-linecap="round" opacity=".9"/>`;
  // bocca
  const line = (d) => `<path d="${d}" fill="none" stroke="${C.mouth}" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"/>`;
  const open = (d, ty, rx, ry) => `<clipPath id="mo${u}"><path d="${d}"/></clipPath><path d="${d}" fill="${C.mouth}" stroke="${C.mouth}" stroke-width="1.4" stroke-linejoin="round"/>` +
    `<g clip-path="url(#mo${u})"><ellipse cx="80" cy="${ty}" rx="${rx}" ry="${ry}" fill="${C.tongue}"/></g>`;
  const mouths = {
    neutral: line('M71.5 89.5 Q80 93.5 88.5 89.5'),
    happy: open('M68 88 Q80 100.5 92 88 Q80 91 68 88 Z', 97, 7, 4),
    celebrating: open('M66 87 Q80 104 94 87 Q80 90.5 66 87 Z', 100.5, 8.5, 5),
    thinking: line('M73.5 91.2 Q79.5 89.6 87.5 90.6'),
    sad: line('M71.5 93.5 Q80 87.5 88.5 93.5'),
    wrong: line('M70.5 91.5 Q75.2 88.4 80 91.5 Q84.8 94.6 89.5 91.5')
  };
  mouths.correct = mouths.celebrating; mouths.walking = mouths.neutral;
  s += mouths[m] || mouths.neutral;
  // sbuffi di vapore, lacrima, sudore
  s += `<g fill="#fff"><circle class="r3-puffL" cx="63" cy="82" r="3.4" opacity="0"/><circle class="r3-puffR" cx="97" cy="82" r="3.4" opacity="0"/></g>`;
  if (m === 'sad') s += `<path class="r3-tear" d="M58 66 C54.6 71.6 54 75 58 76.6 C62 75 61.4 71.6 58 66 Z" fill="#7DD3FC"/>`;
  if (m === 'wrong') s += `<path class="r3-sweat" d="M123 30 C118.6 37 117.6 41.4 123 43.4 C128.4 41.4 127.4 37 123 30 Z" fill="#7DD3FC"/><ellipse cx="121.4" cy="38.6" rx="1.2" ry="2" fill="#fff" opacity=".8"/>`;
  return s;
}

function r3Character(u, m) {
  const C = R3;
  let s = '';
  // --- coda (base + punta con ritardo)
  s += `<g class="r3-tail"><path d="M117 131 C129 129 135.5 121 137.5 110" fill="none" stroke="${C.S}" stroke-width="5" stroke-linecap="round"/>` +
    `<g class="r3-tailTip">` + r3Part(u, 'tt', 'M137.6 111.5 C131.4 106.6 132.4 97.4 137.6 93 C140.6 98.4 147 101 145 108.4 C144 112.2 140.4 113.4 137.6 111.5 Z', C.tuftS,
      `<ellipse cx="136.5" cy="101" rx="5" ry="9" fill="${C.tuftB}"/>`) + `</g></g>`;
  // --- gambe
  const leg = (dx, cls, k) => `<g class="${cls}"><g transform="translate(${dx} 0)">` +
    r3Part(u, k + 'l', 'M64 128 C71 128 77 132 77 139 V150 H53 V139 C53 132 57 128 64 128 Z', C.S, `<ellipse cx="60" cy="138" rx="12" ry="16" fill="${C.B}"/>`) +
    r3Part(u, k + 'h', 'M50 154 Q50 149 56 149 H74 Q80 149 80 154 V158 Q80 163 75 163 H55 Q50 163 50 158 Z', C.hoofS,
      `<ellipse cx="61" cy="154" rx="14" ry="6.5" fill="${C.hoofB}"/><ellipse cx="57" cy="151.4" rx="5.2" ry="1.5" fill="${C.hoofH}"/>`) +
    `<path d="M65 156 V163" stroke="${C.hoofS}" stroke-width="2.2" stroke-linecap="round"/></g></g>`;
  s += leg(0, 'r3-legL', 'gL') + leg(31, 'r3-legR', 'gR');
  // --- parte superiore (respira come un blocco)
  s += `<g class="r3-upper">`;
  const torso = 'M80 82 C107 82 123 99 123 118 C123 135 105 145 80 145 C55 145 37 135 37 118 C37 99 53 82 80 82 Z';
  s += r3Part(u, 'to', torso, C.S, `<ellipse cx="72" cy="113" rx="45" ry="37" fill="${C.B}"/><ellipse cx="60" cy="98" rx="17" ry="8" fill="${C.H}" transform="rotate(-18 60 98)"/>`);
  s += r3Part(u, 'be', 'M80 102 C94 102 104 110 104 121 C104 132 94 140 80 140 C66 140 56 132 56 121 C56 110 66 102 80 102 Z', C.bellyS,
    `<ellipse cx="76.5" cy="117" rx="22" ry="18" fill="${C.bellyB}"/>`);
  s += `<path d="M73 109 l3.5 3.5 l3.5 -3.5 l3.5 3.5 l3.5 -3.5" fill="none" stroke="${C.bellyS}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/>`;
  // braccia (dietro la testa)
  const armD = 'M55 94 C44 95 34 105 31 118 C29 126.5 36 131.5 40.5 126.5 C44.5 117 50.5 108.5 61 101.5 Z';
  const arm = (side) => {
    const L = side === 'L';
    const d = L ? armD : r3Mirror(armD);
    const hx = L ? 36 : 124;
    return `<g class="r3-arm${side}"><path d="${d}" fill="${C.S}" opacity=".55" transform="translate(${L ? 3.5 : -3.5} 2.5)"/>` +
      r3Part(u, 'a' + side, d, C.S, `<ellipse cx="${L ? 39 : 117}" cy="106" rx="${L ? 9 : 6.5}" ry="16" fill="${C.B}" transform="rotate(${L ? 25 : -25} ${L ? 39 : 117} 106)"/>`) +
      r3Part(u, 'ah' + side, `M${hx - 7.6} 127 C${hx - 7.6} 122.5 ${hx + 7.6} 122.5 ${hx + 7.6} 127 C${hx + 7.6} 132.5 ${hx - 7.6} 132.5 ${hx - 7.6} 127 Z`, C.hoofS,
        `<ellipse cx="${hx - 1.4}" cy="125.8" rx="6.4" ry="4.6" fill="${C.hoofB}"/><ellipse cx="${hx - 3}" cy="124.2" rx="2.6" ry="1" fill="${C.hoofH}"/>`) +
      `<path d="M${hx} 125.5 V132" stroke="${C.hoofS}" stroke-width="1.6" stroke-linecap="round"/></g>`;
  };
  s += arm('L') + (m === 'thinking' ? '' : arm('R'));
  // --- testa
  s += `<g class="r3-head">`;
  const earD = 'M43 47 C33 39 17 40 8 50.5 C17 60.5 33 59.5 44 55 Z';
  const earIn = 'M39 49.5 C31 44.6 20.5 45.4 14 50.6 C21 55.4 31 55.4 39 53 Z';
  const ear = (side) => {
    const L = side === 'L', M = L ? (d) => d : r3Mirror;
    return `<g class="r3-ear${side}">` + r3Part(u, 'er' + side, M(earD), C.S, `<ellipse cx="${L ? 25 : 135}" cy="47.5" rx="18" ry="6.5" fill="${C.B}"/>`) +
      r3Part(u, 'ei' + side, M(earIn), C.ear, `<ellipse cx="${L ? 26 : 134}" cy="49" rx="12" ry="3" fill="${C.earH}"/>`) + `</g>`;
  };
  s += ear('L') + ear('R');
  const hornD = 'M51 31 C40 32 27 28.5 20.5 18.5 C16.4 12 17 4.6 21.2 1.2 C24 9.4 30.4 15.4 38.4 18.2 C44.4 20.3 50.6 21.4 57 22.4 Z';
  const horn = (side) => {
    const L = side === 'L';
    const d = L ? hornD : r3Mirror(hornD);
    const x = (v) => L ? v : 160 - v;
    return r3Part(u, 'hn' + side, d, C.hornS,
      `<ellipse cx="${x(37)}" cy="19" rx="21" ry="5.8" fill="${C.hornB}" transform="rotate(${L ? 27 : -27} ${x(37)} ${19})"/>` +
      `<circle cx="${x(19.4)}" cy="5" r="7.6" fill="${C.hornTip}"/>` +
      `<path d="M${x(44.6)} 20.8 Q${x(42)} 25.8 ${x(44.8)} 31.2 M${x(49.4)} 21.6 Q${x(47)} 26.4 ${x(49.6)} 31.4" fill="none" stroke="${C.hornRing}" stroke-width="1.6" stroke-linecap="round"/>`);
  };
  s += horn('L') + horn('R');
  const headD = 'M80 16 C111 16 129 34 129 58 C129 80 111 95 80 95 C49 95 31 80 31 58 C31 34 49 16 80 16 Z';
  s += r3Part(u, 'hd', headD, C.S,
    `<ellipse cx="73" cy="51" rx="51" ry="40" fill="${C.B}"/><ellipse cx="58" cy="31" rx="17" ry="7.5" fill="${C.H}" transform="rotate(-22 58 31)"/>`);
  s += r3Part(u, 'tf', 'M65 25 C61 17 65 8.5 71.5 8 C70.8 12 73.4 14.4 76 12.6 C76 6.4 82 3 87.6 6 C84.6 9 86.4 12.2 89.4 12.4 C92.4 9.2 97.6 10.6 98.4 14.6 C96.6 20.4 92.4 24.2 86 25.4 C79 22.6 71.6 22.6 65 25 Z', C.tuftS,
    `<ellipse cx="79" cy="13" rx="17" ry="9" fill="${C.tuftB}"/>`);
  s += r3Face(u, m);
  s += `</g>`;
  if (m === 'thinking') s += arm('R');
  s += `</g>`; // upper
  return s;
}

function r3Extras(m) {
  let s = '';
  if (m === 'thinking') s += `<g fill="#CBD5E1"><circle class="r3-dot1" cx="133" cy="30" r="3"/><circle class="r3-dot2" cx="142" cy="18" r="4.2"/><circle class="r3-dot3" cx="152" cy="4" r="5.8"/></g>`;
  if (m === 'correct') {
    const star = (x, y, r, c, k) => `<path class="r3-tw${k}" d="M${x} ${y - r} Q${x + r * .2} ${y - r * .2} ${x + r} ${y} Q${x + r * .2} ${y + r * .2} ${x} ${y + r} Q${x - r * .2} ${y + r * .2} ${x - r} ${y} Q${x - r * .2} ${y - r * .2} ${x} ${y - r} Z" fill="${c}"/>`;
    s += star(10, 28, 7, '#FFD43B', 1) + star(150, 34, 6, '#FFD43B', 2) + star(24, 8, 4, '#fff', 3) + star(140, 10, 3.5, '#fff', 1);
  }
  if (m === 'celebrating') {
    const conf = [[8, 18, '#58CC02', 20], [28, 2, '#1CB0F6', -30], [126, 4, '#FF4B8B', 35], [148, 24, '#FFD43B', -15], [2, 48, '#FF4B8B', 45], [152, 52, '#1CB0F6', 10], [52, -4, '#FFD43B', 60], [106, -6, '#58CC02', -50]];
    s += conf.map(([x, y, c, r], i) => `<g class="r3-conf r3-c${i % 4}"><rect x="${x}" y="${y}" width="6" height="9" rx="2" fill="${c}" transform="rotate(${r} ${x + 3} ${y + 4.5})"/></g>`).join('');
  }
  return s;
}

function r3Delay(u) { let h = 0; for (const ch of String(u)) h = (h * 31 + ch.charCodeAt(0)) % 997; return -(h % 40) / 10; }

function rly3SVG(mood, size, uid, opts) {
  const o = opts || {};
  const m = mood || 'neutral';
  const u = uid || 'r';
  return `<svg viewBox="0 0 160 170" width="${size}" height="${size * 170 / 160}" style="overflow:visible;display:block" aria-hidden="true">` +
    `<ellipse class="r3-shadow" cx="80" cy="164" rx="38" ry="5" fill="#000" opacity=".18"/>` +
    `<g class="r3 r3-m-${m}${o.static ? ' r3-static' : ''}${o.poke ? ' r3-poke' : ''}" style="--rd:${r3Delay(u)}s">${r3Extras(m)}<g class="r3-all">${r3Character(u, m)}</g></g></svg>`;
}

function rly3MarkSVG(size, opts) {
  const o = opts || {};
  const u = o.uid || 'mk';
  const sc = o.maskable ? 0.64 : 0.9;
  const tx = 60 - 80 * sc;
  const ty = o.maskable ? 60 - 84 * sc : 6 - 1 * sc;
  return `<svg viewBox="0 0 120 120" width="${size}" height="${size}" style="display:block" aria-hidden="true">` +
    `<rect width="120" height="120" rx="${o.rounded ? 26 : 0}" fill="${o.bg || '#0B1322'}"/>` +
    `<circle cx="60" cy="${o.maskable ? 62 : 66}" r="${o.maskable ? 40 : 52}" fill="#14213C"/>` +
    `<g transform="translate(${tx} ${ty}) scale(${sc})"><g class="r3 r3-static">${r3Character(u, 'happy')}</g></g></svg>`;
}

const RLY3_CSS = `
.r3, .r3 * { transform-box: view-box; }
.r3-all { transform-origin: 80px 163px; }
.r3-upper { transform-origin: 80px 150px; animation: r3Breath 3.4s cubic-bezier(.45,0,.55,1) var(--rd) infinite; }
.r3-head { transform-origin: 80px 92px; animation: r3HeadBob 3.4s cubic-bezier(.45,0,.55,1) calc(var(--rd) + .25s) infinite; }
.r3-earL { transform-origin: 43px 51px; animation: r3EarL 3.4s cubic-bezier(.45,0,.55,1) calc(var(--rd) + .45s) infinite; }
.r3-earR { transform-origin: 117px 51px; animation: r3EarR 3.4s cubic-bezier(.45,0,.55,1) calc(var(--rd) + .45s) infinite; }
.r3-tail { transform-origin: 117px 131px; animation: r3Tail 2.6s cubic-bezier(.45,0,.55,1) var(--rd) infinite; }
.r3-tailTip { transform-origin: 137.5px 110px; animation: r3TailTip 2.6s cubic-bezier(.45,0,.55,1) calc(var(--rd) + .3s) infinite; }
.r3-armL { transform-origin: 55px 98px; animation: r3ArmIdleL 3.4s cubic-bezier(.45,0,.55,1) calc(var(--rd) + .15s) infinite; }
.r3-armR { transform-origin: 105px 98px; animation: r3ArmIdleR 3.4s cubic-bezier(.45,0,.55,1) calc(var(--rd) + .15s) infinite; }
.r3-legL { transform-origin: 65px 138px; } .r3-legR { transform-origin: 96px 138px; }
.r3-blink { animation: r3Blink 5.2s linear var(--rd) infinite; }
.r3-look { animation: r3Look 8s cubic-bezier(.2,.9,.3,1) var(--rd) infinite; }
.r3-puffL, .r3-puffR { transform-box: fill-box; transform-origin: center; }

/* NEUTRO: si guarda intorno, ogni tanto raspa con lo zoccolo e sbuffa */
.r3-m-neutral .r3-legR { animation: r3Paw 7s cubic-bezier(.45,0,.55,1) var(--rd) infinite; }
.r3-m-neutral .r3-all { animation: r3PawBody 7s cubic-bezier(.45,0,.55,1) var(--rd) infinite; }
.r3-m-neutral .r3-puffL { animation: r3PuffL 7s ease-out var(--rd) infinite; }
.r3-m-neutral .r3-puffR { animation: r3PuffR 7s ease-out var(--rd) infinite; }

/* FELICE: saltello con anticipo + saluto con la mano */
.r3-m-happy .r3-all { animation: r3Hop 1.6s linear infinite; }
.r3-m-happy .r3-armL { animation: r3Wave 1.6s cubic-bezier(.45,0,.55,1) infinite; }
.r3-m-happy .r3-look { animation: none; }

/* PENSA */
.r3-m-thinking .r3-head { animation: r3Ponder 4s cubic-bezier(.45,0,.55,1) infinite; }
.r3-m-thinking .r3-armR { animation: r3Chin 1.4s cubic-bezier(.45,0,.55,1) infinite; }
.r3-m-thinking .r3-legL { animation: r3FootTap .7s cubic-bezier(.45,0,.55,1) infinite; }
.r3-m-thinking .r3-look { animation: none; }

/* FESTEGGIA: balla sul ritmo */
.r3-m-celebrating .r3-all { animation: r3Dance 1s linear infinite; }
.r3-m-celebrating .r3-armL { animation: r3CheerL .5s cubic-bezier(.34,1.56,.64,1) infinite alternate; }
.r3-m-celebrating .r3-armR { animation: r3CheerR .5s cubic-bezier(.34,1.56,.64,1) infinite alternate-reverse; }
.r3-m-celebrating .r3-legL { animation: r3Kick 1s cubic-bezier(.45,0,.55,1) infinite; }
.r3-m-celebrating .r3-legR { animation: r3Kick 1s cubic-bezier(.45,0,.55,1) -.5s infinite; }
.r3-m-celebrating .r3-head { animation: r3HeadDance 1s cubic-bezier(.45,0,.55,1) .08s infinite; }

/* TRISTE */
.r3-m-sad .r3-upper { animation: r3Sag 4.6s cubic-bezier(.45,0,.55,1) infinite; }
.r3-m-sad .r3-head { animation: r3SadHead 4.6s cubic-bezier(.45,0,.55,1) .3s infinite; }
.r3-m-sad .r3-earL, .r3-m-wrong .r3-earL { animation: r3DroopL 4.6s cubic-bezier(.45,0,.55,1) infinite; }
.r3-m-sad .r3-earR, .r3-m-wrong .r3-earR { animation: r3DroopR 4.6s cubic-bezier(.45,0,.55,1) infinite; }
.r3-m-sad .r3-tail { animation-duration: 6s; }
.r3-m-sad .r3-look { animation: none; }

/* RISPOSTA GIUSTA: carica, salta, pugno al cielo, atterra */
.r3-m-correct .r3-all { animation: r3Jump 1.8s linear infinite; }
.r3-m-correct .r3-armR { animation: r3Pump 1.8s linear infinite; }
.r3-m-correct .r3-legL { animation: r3TuckL 1.8s linear infinite; }
.r3-m-correct .r3-legR { animation: r3TuckR 1.8s linear infinite; }
.r3-m-correct .r3-look { animation: none; }

/* RISPOSTA SBAGLIATA: scuote la testa, poi alza le spalle */
.r3-m-wrong .r3-head { animation: r3Shake 2.6s linear infinite; }
.r3-m-wrong .r3-upper { animation: r3ShrugBody 2.6s cubic-bezier(.45,0,.55,1) infinite; }
.r3-m-wrong .r3-armL { animation: r3ShrugL 2.6s cubic-bezier(.45,0,.55,1) infinite; }
.r3-m-wrong .r3-armR { animation: r3ShrugR 2.6s cubic-bezier(.45,0,.55,1) infinite; }
.r3-m-wrong .r3-look { animation: none; }

/* CAMMINA */
.r3-m-walking .r3-all { animation: r3Bob .8s cubic-bezier(.45,0,.55,1) infinite; }
.r3-m-walking .r3-legL { animation: r3Step .8s cubic-bezier(.45,0,.55,1) infinite; }
.r3-m-walking .r3-legR { animation: r3Step .8s cubic-bezier(.45,0,.55,1) -.4s infinite; }
.r3-m-walking .r3-armL { animation: r3Swing .8s cubic-bezier(.45,0,.55,1) -.4s infinite; }
.r3-m-walking .r3-armR { animation: r3Swing .8s cubic-bezier(.45,0,.55,1) infinite; }
.r3-m-walking .r3-head { animation: r3WalkHead .4s cubic-bezier(.45,0,.55,1) .08s infinite; }

/* TOCCO */
.r3-poke .r3-all { animation: r3Poke .75s linear 1 !important; }
.r3-poke .r3-puffL { animation: r3PuffLq .75s ease-out 1 !important; }
.r3-poke .r3-puffR { animation: r3PuffRq .75s ease-out 1 !important; }
.r3-poke .r3-blink { animation: r3BlinkQ .75s linear 1 !important; }

/* extra */
.r3-dot1, .r3-dot2, .r3-dot3 { animation: r3Fade 1.8s infinite; } .r3-dot2 { animation-delay: .3s; } .r3-dot3 { animation-delay: .6s; }
.r3-tear, .r3-sweat { animation: r3Drip 1.6s ease-in infinite; }
.r3-tw1, .r3-tw2, .r3-tw3 { transform-box: fill-box; transform-origin: center; animation: r3Tw 1.2s cubic-bezier(.34,1.56,.64,1) infinite; } .r3-tw2 { animation-delay: .4s; } .r3-tw3 { animation-delay: .8s; }
.r3-conf { animation: r3Conf 1.4s cubic-bezier(.45,0,.55,1) infinite; } .r3-c1 { animation-delay: .2s; } .r3-c2 { animation-delay: .5s; } .r3-c3 { animation-delay: .8s; }
.r3-static, .r3-static * { animation: none !important; }

@keyframes r3Breath { 0%,100% { transform: scale(1,1); } 50% { transform: scale(.988,1.022); } }
@keyframes r3HeadBob { 0%,100% { transform: translateY(0) rotate(0); } 25% { transform: rotate(-1.6deg); } 50% { transform: translateY(-1.6px) rotate(0); } 75% { transform: rotate(1.6deg); } }
@keyframes r3EarL { 0%,100% { transform: rotate(0); } 50% { transform: rotate(5deg); } 90% { transform: rotate(-2deg); } 93% { transform: rotate(14deg); } 96% { transform: rotate(-4deg); } }
@keyframes r3EarR { 0%,100% { transform: rotate(0); } 50% { transform: rotate(-5deg); } }
@keyframes r3Tail { 0%,100% { transform: rotate(-9deg); } 50% { transform: rotate(11deg); } }
@keyframes r3TailTip { 0%,100% { transform: rotate(-14deg); } 50% { transform: rotate(16deg); } }
@keyframes r3ArmIdleL { 0%,100% { transform: rotate(0); } 50% { transform: rotate(3deg); } }
@keyframes r3ArmIdleR { 0%,100% { transform: rotate(0); } 50% { transform: rotate(-3deg); } }
@keyframes r3Blink { 0%,88%,91.5%,94%,96.5%,100% { transform: translateY(0); } 89.5% { transform: translateY(30px); } 95.2% { transform: translateY(30px); } }
@keyframes r3BlinkQ { 0%,40%,100% { transform: translateY(0); } 15%,25% { transform: translateY(30px); } }
@keyframes r3Look { 0%,14%,100% { transform: translate(0,0); } 17%,36% { transform: translate(3.2px,-.6px); } 39%,58% { transform: translate(-3.4px,.4px); } 61%,80% { transform: translate(.6px,-2.2px); } 83%,97% { transform: translate(0,0); } }
@keyframes r3Paw { 0%,64%,92%,100% { transform: rotate(0) translate(0,0); } 67% { transform: rotate(-18deg) translate(0,-4px); } 71% { transform: rotate(8deg) translate(0,0); } 75% { transform: rotate(-18deg) translate(0,-4px); } 79% { transform: rotate(8deg) translate(0,0); } 84% { transform: rotate(0); } }
@keyframes r3PawBody { 0%,62%,90%,100% { transform: rotate(0) scale(1,1); } 66%,82% { transform: rotate(-2deg) scale(1.02,.98); } 86% { transform: rotate(0) scale(.98,1.03); } }
@keyframes r3PuffL { 0%,84% { opacity: 0; transform: translate(0,0) scale(.3); } 86% { opacity: .95; transform: translate(-2px,1px) scale(.8); } 97% { opacity: 0; transform: translate(-13px,6px) scale(2); } 100% { opacity: 0; } }
@keyframes r3PuffR { 0%,84% { opacity: 0; transform: translate(0,0) scale(.3); } 86% { opacity: .95; transform: translate(2px,1px) scale(.8); } 97% { opacity: 0; transform: translate(13px,6px) scale(2); } 100% { opacity: 0; } }
@keyframes r3PuffLq { 0% { opacity: 0; transform: scale(.3); } 20% { opacity: .95; } 100% { opacity: 0; transform: translate(-14px,6px) scale(2.1); } }
@keyframes r3PuffRq { 0% { opacity: 0; transform: scale(.3); } 20% { opacity: .95; } 100% { opacity: 0; transform: translate(14px,6px) scale(2.1); } }
@keyframes r3Hop {
  0% { transform: translateY(0) scale(1,1); animation-timing-function: cubic-bezier(.45,0,.55,1); }
  14% { transform: translateY(0) scale(1.07,.92); animation-timing-function: cubic-bezier(.2,.7,.4,1); }
  34% { transform: translateY(-11px) scale(.95,1.06); animation-timing-function: cubic-bezier(.6,0,.8,.4); }
  50% { transform: translateY(0) scale(1.08,.93); animation-timing-function: cubic-bezier(.34,1.56,.64,1); }
  64% { transform: translateY(0) scale(1,1); } 100% { transform: translateY(0) scale(1,1); } }
@keyframes r3Wave { 0%,100% { transform: rotate(66deg); } 20% { transform: rotate(98deg); } 40% { transform: rotate(68deg); } 60% { transform: rotate(98deg); } 80% { transform: rotate(72deg); } }
@keyframes r3Ponder { 0%,100% { transform: rotate(7deg); } 50% { transform: rotate(10deg) translateY(-1.2px); } }
@keyframes r3Chin { 0%,100% { transform: rotate(124deg); } 50% { transform: rotate(132deg); } }
@keyframes r3FootTap { 0%,100% { transform: rotate(0); } 45% { transform: rotate(-11deg) translateY(-2px); } }
@keyframes r3Dance {
  0% { transform: translateY(0) rotate(-6deg) scale(1.05,.95); animation-timing-function: cubic-bezier(.2,.7,.4,1); }
  25% { transform: translateY(-9px) rotate(0) scale(.97,1.04); animation-timing-function: cubic-bezier(.6,0,.8,.4); }
  50% { transform: translateY(0) rotate(6deg) scale(1.05,.95); animation-timing-function: cubic-bezier(.2,.7,.4,1); }
  75% { transform: translateY(-9px) rotate(0) scale(.97,1.04); animation-timing-function: cubic-bezier(.6,0,.8,.4); }
  100% { transform: translateY(0) rotate(-6deg) scale(1.05,.95); } }
@keyframes r3HeadDance { 0%,100% { transform: rotate(5deg); } 50% { transform: rotate(-5deg); } }
@keyframes r3CheerL { from { transform: rotate(72deg); } to { transform: rotate(100deg); } }
@keyframes r3CheerR { from { transform: rotate(-72deg); } to { transform: rotate(-100deg); } }
@keyframes r3Kick { 0%,50%,100% { transform: rotate(0); } 25% { transform: rotate(-15deg) translateY(-3px); } }
@keyframes r3Sag { 0%,100% { transform: scale(1.02,.965); } 50% { transform: scale(1.01,.975); } }
@keyframes r3SadHead { 0%,100% { transform: translateY(4px) rotate(-3deg); } 50% { transform: translateY(5px) rotate(2deg); } }
@keyframes r3DroopL { 0%,100% { transform: rotate(-30deg); } 50% { transform: rotate(-24deg); } }
@keyframes r3DroopR { 0%,100% { transform: rotate(30deg); } 50% { transform: rotate(24deg); } }
@keyframes r3Jump {
  0% { transform: translateY(0) scale(1,1); animation-timing-function: cubic-bezier(.45,0,.55,1); }
  12% { transform: translateY(0) scale(1.1,.88); animation-timing-function: cubic-bezier(.15,.75,.35,1); }
  30% { transform: translateY(-18px) scale(.93,1.08); animation-timing-function: cubic-bezier(.45,0,.55,1); }
  38% { transform: translateY(-20px) scale(1,1); animation-timing-function: cubic-bezier(.6,0,.85,.35); }
  52% { transform: translateY(0) scale(1.12,.88); animation-timing-function: cubic-bezier(.34,1.56,.64,1); }
  66% { transform: translateY(0) scale(1,1); } 100% { transform: translateY(0) scale(1,1); } }
@keyframes r3Pump {
  0% { transform: rotate(-20deg); animation-timing-function: cubic-bezier(.45,0,.55,1); }
  12% { transform: rotate(-10deg); animation-timing-function: cubic-bezier(.2,.8,.3,1.3); }
  32% { transform: rotate(-104deg); animation-timing-function: cubic-bezier(.45,0,.55,1); }
  44% { transform: rotate(-86deg); } 56% { transform: rotate(-102deg); animation-timing-function: cubic-bezier(.45,0,.55,1); }
  85% { transform: rotate(-20deg); } 100% { transform: rotate(-20deg); } }
@keyframes r3TuckL { 0%,14%,52%,100% { transform: rotate(0); } 32% { transform: rotate(20deg) translateY(-4px); } }
@keyframes r3TuckR { 0%,14%,52%,100% { transform: rotate(0); } 32% { transform: rotate(-20deg) translateY(-4px); } }
@keyframes r3Shake {
  0% { transform: rotate(0); animation-timing-function: cubic-bezier(.45,0,.55,1); }
  7% { transform: rotate(-12deg); } 16% { transform: rotate(11deg); } 25% { transform: rotate(-8deg); } 34% { transform: rotate(5deg); }
  42% { transform: rotate(-2deg); } 50% { transform: rotate(0); } 100% { transform: rotate(0); } }
@keyframes r3ShrugBody { 0%,52%,96%,100% { transform: scale(1,1); } 62%,86% { transform: scale(1.03,.96); } }
@keyframes r3ShrugL { 0%,52%,96%,100% { transform: rotate(0); } 62%,86% { transform: rotate(42deg); } }
@keyframes r3ShrugR { 0%,52%,96%,100% { transform: rotate(0); } 62%,86% { transform: rotate(-42deg); } }
@keyframes r3Bob { 0%,50%,100% { transform: translateY(0) rotate(-1.5deg); } 25%,75% { transform: translateY(-3.5px) rotate(1.5deg); } }
@keyframes r3WalkHead { 0%,100% { transform: translateY(0); } 50% { transform: translateY(1.4px); } }
@keyframes r3Step { 0%,100% { transform: rotate(-20deg) translateY(-1px); } 50% { transform: rotate(20deg) translateY(-1px); } 25%,75% { transform: rotate(0) translateY(-3px); } }
@keyframes r3Swing { 0%,100% { transform: rotate(-18deg); } 50% { transform: rotate(18deg); } }
@keyframes r3Poke {
  0% { transform: translateY(0) scale(1,1); animation-timing-function: cubic-bezier(.2,.7,.4,1); }
  12% { transform: translateY(0) scale(1.12,.86); animation-timing-function: cubic-bezier(.15,.75,.35,1); }
  40% { transform: translateY(-18px) scale(.92,1.09) rotate(-5deg); animation-timing-function: cubic-bezier(.6,0,.85,.35); }
  68% { transform: translateY(0) scale(1.1,.9); animation-timing-function: cubic-bezier(.34,1.56,.64,1); }
  100% { transform: translateY(0) scale(1,1); } }
@keyframes r3Fade { 0%,100% { opacity: .25; } 50% { opacity: 1; } }
@keyframes r3Drip { 0% { transform: translateY(-2px); opacity: 0; } 25% { opacity: 1; } 100% { transform: translateY(9px); opacity: 0; } }
@keyframes r3Tw { 0%,100% { transform: scale(.3) rotate(0); opacity: .2; } 50% { transform: scale(1.1) rotate(45deg); opacity: 1; } }
@keyframes r3Conf { 0%,100% { transform: translateY(0); } 50% { transform: translateY(7px); } }
@media (prefers-reduced-motion: reduce) { .r3, .r3 * { animation: none !important; } }
.fl-wordmark { font-family: 'Nunito', 'Outfit', system-ui, sans-serif; font-weight: 900; letter-spacing: -0.02em; line-height: 1; color: #FFB020; display: inline-flex; align-items: flex-end; text-transform: none; }
.fl-wordmark .fl-wm-fin { color: #FFF4DA; }
.fl-wordmark .fl-wm-i { position: relative; display: inline-block; }
.fl-wordmark .fl-wm-i svg { position: absolute; left: 50%; top: -0.04em; width: 0.42em; height: 0.42em; transform: translateX(-46%); overflow: visible; }
`;



const FL_RICH_CSS = `
.fl-rich { line-height: 1.6; overflow-wrap: anywhere; }
.fl-rich .fl-p { margin: 0; }
.fl-rich .fl-li { padding-left: 1.1em; text-indent: -1.1em; margin: 2px 0; }
.fl-rich .fl-strong { font-weight: 800; color: #FFB020; }
.fl-tex-d { display: block; overflow-x: auto; overflow-y: hidden; padding: 8px 10px; margin: 6px 0; border-radius: 12px; background: rgba(255,176,32,.08); border: 1px solid rgba(255,176,32,.22); text-align: center; font-size: 1.05em; }
.fl-tex-d math { display: block; margin: 0 auto; }
.fl-tex-i math { font-size: 1.04em; }
.fl-table-wrap { overflow-x: auto; margin: 8px 0; border-radius: 12px; border: 1px solid var(--fl-line, #e2e8f0); }
.fl-table { border-collapse: collapse; width: 100%; font-size: 12.5px; font-variant-numeric: tabular-nums; }
.fl-table th { text-align: left; font-weight: 800; padding: 7px 9px; background: rgba(255,176,32,.12); white-space: nowrap; }
.fl-table td { padding: 6px 9px; border-top: 1px solid var(--fl-line, #e2e8f0); white-space: nowrap; }
`;
const FL_HARMONY_CSS = `
    /* ===== Armonizzazione tema scuro: una sola palette (navy + oro, verde = giusto, rosso = sbagliato) ===== */
    html.fl-dark { --fl-bg: #0B1322; --fl-s1: #111C33; --fl-s2: #16243F; --fl-s3: #1C2C4C; --fl-line: #22324F;
      --fl-fg: #F3EEE4; --fl-fg2: #C9D1E0; --fl-muted: #8E9BB5; --fl-gold: #FFB020; --fl-gold2: #F08A00;
      --fl-green: #22C55E; --fl-green2: #16A34A; --fl-red: #FF5A5F; background: var(--fl-bg); color-scheme: dark; }
    html.fl-dark body { background: var(--fl-bg); }
    html.fl-dark .bg-white, html.fl-dark .bg-slate-50, html.fl-dark .bg-white\\/90, html.fl-dark .bg-slate-800, html.fl-dark .bg-zinc-900 { background-color: var(--fl-s1) !important; }
    html.fl-dark .bg-slate-100, html.fl-dark .bg-slate-200, html.fl-dark .bg-slate-700, html.fl-dark .bg-purple-100, html.fl-dark .bg-blue-100, html.fl-dark .bg-zinc-700 { background-color: var(--fl-s2) !important; }
    html.fl-dark .bg-slate-900 { background-color: var(--fl-bg) !important; }
    html.fl-dark .bg-slate-700\\/50, html.fl-dark .bg-slate-800\\/50 { background-color: rgba(28,44,76,.6) !important; }
    html.fl-dark .bg-slate-300, html.fl-dark .bg-zinc-500 { background-color: var(--fl-s3) !important; }
    html.fl-dark .text-slate-900, html.fl-dark .text-slate-800, html.fl-dark .text-slate-700, html.fl-dark .text-zinc-900, html.fl-dark .text-zinc-700 { color: var(--fl-fg) !important; }
    html.fl-dark .text-slate-600, html.fl-dark .text-slate-300, html.fl-dark .text-zinc-300 { color: var(--fl-fg2) !important; }
    html.fl-dark .text-slate-500, html.fl-dark .text-slate-400, html.fl-dark .text-zinc-500 { color: var(--fl-muted) !important; }
    html.fl-dark .border-slate-200, html.fl-dark .border-slate-300, html.fl-dark .border-slate-600, html.fl-dark .border-slate-700, html.fl-dark .border-slate-800, html.fl-dark .border-zinc-700, html.fl-dark .border-zinc-800 { border-color: var(--fl-line) !important; }
    html.fl-dark .bg-emerald-50, html.fl-dark .bg-emerald-100 { background-color: rgba(34,197,94,.12) !important; }
    html.fl-dark .border-emerald-200 { border-color: rgba(34,197,94,.4) !important; }
    html.fl-dark .text-emerald-700, html.fl-dark .text-emerald-600 { color: #4ADE80 !important; }
    html.fl-dark .bg-rose-50, html.fl-dark .bg-rose-100, html.fl-dark .bg-red-100 { background-color: rgba(255,90,95,.12) !important; }
    html.fl-dark .border-rose-300 { border-color: rgba(255,90,95,.45) !important; }
    html.fl-dark .text-rose-700, html.fl-dark .text-rose-600 { color: #FF8A8E !important; }
    html.fl-dark .bg-amber-50, html.fl-dark .bg-orange-50 { background-color: rgba(255,176,32,.1) !important; }
    html.fl-dark .border-amber-200, html.fl-dark .border-amber-300, html.fl-dark .border-orange-200 { border-color: rgba(255,176,32,.4) !important; }
    html.fl-dark .text-amber-700, html.fl-dark .text-amber-800, html.fl-dark .text-orange-900 { color: #FFC555 !important; }
    /* colori decorativi fuori palette -> oro */
    html.fl-dark .text-purple-700, html.fl-dark .text-purple-500, html.fl-dark .text-purple-400 { color: var(--fl-gold) !important; }
    html.fl-dark .bg-purple-500, html.fl-dark .bg-purple-400 { background-color: var(--fl-gold) !important; }
    html.fl-dark .bg-purple-500\\/20 { background-color: rgba(255,176,32,.16) !important; }
    html.fl-dark .from-white, html.fl-dark .from-slate-100 { --tw-gradient-from: var(--fl-s1) !important; --tw-gradient-to: rgba(17,28,51,0) !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important; }
    html.fl-dark .to-orange-50, html.fl-dark .to-slate-50, html.fl-dark .to-slate-100 { --tw-gradient-to: var(--fl-s1) !important; }
    html.fl-dark .via-white { --tw-gradient-stops: var(--tw-gradient-from), var(--fl-s1), var(--tw-gradient-to) !important; }
    html.fl-dark .from-purple-400, html.fl-dark .from-purple-500, html.fl-dark .from-blue-400, html.fl-dark .from-blue-500, html.fl-dark .from-cyan-400, html.fl-dark .from-rose-400 { --tw-gradient-from: #FFC14D !important; --tw-gradient-to: rgba(255,176,32,0) !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important; }
    html.fl-dark .to-indigo-600, html.fl-dark .to-purple-600, html.fl-dark .to-pink-500, html.fl-dark .to-blue-500, html.fl-dark .to-blue-600, html.fl-dark .to-cyan-500, html.fl-dark .to-rose-500 { --tw-gradient-to: var(--fl-gold2) !important; }
    html.fl-dark .to-teal-500, html.fl-dark .to-teal-600, html.fl-dark .to-emerald-600 { --tw-gradient-to: var(--fl-green2) !important; }
    html.fl-dark .from-emerald-400, html.fl-dark .from-emerald-500 { --tw-gradient-from: var(--fl-green) !important; }
    html.fl-dark .shadow-teal-500\\/30, html.fl-dark .shadow-teal-500\\/20 { --tw-shadow-color: rgba(34,197,94,.25) !important; }
    html.fl-dark .fl-grid-bg { display: none; }
    html.fl-dark .from-amber-50, html.fl-dark .from-orange-50 { --tw-gradient-from: var(--fl-s1) !important; --tw-gradient-to: rgba(17,28,51,0) !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important; }
    html.fl-dark .bg-amber-100 { background-color: rgba(255,176,32,.16) !important; }
    html.fl-dark .text-amber-600 { color: var(--fl-gold) !important; }
    html.fl-dark .hover\\:bg-slate-100:hover, html.fl-dark .hover\\:bg-amber-100:hover, html.fl-dark .hover\\:bg-slate-300:hover { background-color: var(--fl-s2) !important; }
    html.fl-dark .text-slate-300 { color: var(--fl-muted) !important; }
    html.fl-dark .border-b.bg-white { border-color: var(--fl-line) !important; }
    body, button, input, textarea { font-family: 'Nunito', system-ui, sans-serif; }
`;

const FL_FIG_CSS = `
    /* ===== Tema "Figurine" (chiaro): inchiostro nero, bordi spessi, ombre piene, colori pieni. Icone e mascotte invariate. ===== */
    html.fl-fig { --ink: #1A1A1A; --fg-bg: #F4F6FA; --pop: #8EC5FF; --mint: #7EE0B5; --sky: #9CC8FF; --rose: #FFB4C8;
      background: var(--fg-bg); color-scheme: light; }
    html.fl-fig body { background: var(--fg-bg) !important; color: var(--ink); }
    html.fl-fig body, html.fl-fig button, html.fl-fig input, html.fl-fig textarea,
    html.fl-fig .fl-display, html.fl-fig .fl-mono { font-family: 'Bricolage Grotesque', 'Nunito', system-ui, sans-serif !important; }
    html.fl-fig .fl-display, html.fl-fig h1, html.fl-fig h2 { letter-spacing: -0.015em; }
    html.fl-fig .fl-grid-bg { display: none; }
    html.fl-fig .fl-gold-text { background: none; -webkit-text-fill-color: currentColor; color: var(--ink); animation: none; }
    html.fl-fig .fl-sweep::after { display: none; }

    /* superfici: bianco, bordo inchiostro 2.5px, ombra piena */
    html.fl-fig .fl-glass { background: #fff !important; backdrop-filter: none; -webkit-backdrop-filter: none; border: 2.5px solid var(--ink) !important; }
    html.fl-fig [style*="border: 1px solid rgb(26, 26, 26)"], html.fl-fig [style*="border-color: rgb(26, 26, 26)"],
    html.fl-fig .border.border-slate-200, html.fl-fig .border.border-slate-100, html.fl-fig .border-2.border-slate-200 {
      border: 2.5px solid var(--ink) !important; box-shadow: 4px 4px 0 var(--ink) !important; }
    html.fl-fig .border-slate-200, html.fl-fig .border-slate-100, html.fl-fig .border-slate-300 { border-color: var(--ink) !important; }
    html.fl-fig .border-b, html.fl-fig .border-t { border-color: var(--ink) !important; }
    html.fl-fig .shadow-lg, html.fl-fig .shadow-xl, html.fl-fig .shadow-2xl, html.fl-fig .shadow-md { --tw-shadow: 4px 4px 0 var(--ink) !important; --tw-shadow-colored: 4px 4px 0 var(--ink) !important; box-shadow: 4px 4px 0 var(--ink) !important; }
    html.fl-fig .fl-card-hover:hover:not(:disabled) { transform: translate(-1px,-1px); box-shadow: 6px 6px 0 var(--ink) !important; }
    html.fl-fig .fl-card-hover:active:not(:disabled), html.fl-fig button:active:not(:disabled) { transform: translate(2px,2px); }

    /* blocchi colorati a gradiente -> colore pieno con bordo inchiostro */
    html.fl-fig .bg-gradient-to-r.rounded-2xl, html.fl-fig .bg-gradient-to-br.rounded-2xl, html.fl-fig .bg-gradient-to-r.rounded-3xl, html.fl-fig .bg-gradient-to-br.rounded-3xl,
    html.fl-fig .bg-gradient-to-r.rounded-xl, html.fl-fig .bg-gradient-to-br.rounded-xl {
      border: 2.5px solid var(--ink) !important; box-shadow: 4px 4px 0 var(--ink) !important; }
    html.fl-fig .from-amber-400, html.fl-fig .from-amber-500, html.fl-fig .from-amber-600, html.fl-fig .from-orange-400, html.fl-fig .from-orange-500, html.fl-fig .from-orange-600, html.fl-fig .from-yellow-400 { background: var(--pop) !important; }
    html.fl-fig .from-emerald-400, html.fl-fig .from-emerald-500, html.fl-fig .from-emerald-600, html.fl-fig .from-teal-400, html.fl-fig .from-teal-500, html.fl-fig .from-green-500 { background: var(--mint) !important; }
    html.fl-fig .from-blue-400, html.fl-fig .from-blue-500, html.fl-fig .from-cyan-400, html.fl-fig .from-indigo-500, html.fl-fig .from-sky-400, html.fl-fig .from-sky-500 { background: var(--sky) !important; }
    html.fl-fig .from-purple-400, html.fl-fig .from-purple-500, html.fl-fig .from-pink-500, html.fl-fig .from-rose-400, html.fl-fig .from-rose-500 { background: var(--rose) !important; }
    html.fl-fig .from-slate-300, html.fl-fig .from-slate-400, html.fl-fig .from-slate-600 { background: #E3E6EE !important; }
    html.fl-fig .from-amber-50, html.fl-fig .from-orange-50, html.fl-fig .from-slate-100 { background: #FFFFFF !important; }
    html.fl-fig .from-slate-700, html.fl-fig .from-slate-800, html.fl-fig .from-slate-900 { background: var(--ink) !important; }
    html.fl-fig [class*="bg-gradient-to"].text-white, html.fl-fig [class*="bg-gradient-to"] .text-white, html.fl-fig [class*="bg-gradient-to"] .text-white\\/80, html.fl-fig [class*="bg-gradient-to"] .text-white\\/90,
    html.fl-fig [class*="bg-gradient-to"] .text-white\\/70, html.fl-fig [class*="bg-gradient-to"] .text-white\\/60 { color: var(--ink) !important; }
    html.fl-fig .from-slate-700.text-white, html.fl-fig .from-slate-800.text-white, html.fl-fig .from-slate-900.text-white,
    html.fl-fig .from-slate-700 .text-white, html.fl-fig .from-slate-800 .text-white, html.fl-fig .from-slate-900 .text-white { color: #FFFFFF !important; }

    /* pulsanti a gradiente inline (oro/arancio) -> giallo pieno, testo nero */
    html.fl-fig [style*="linear-gradient"][style*="rgb(217, 119, 6)"], html.fl-fig [style*="linear-gradient"][style*="rgb(180, 83, 9)"],
    html.fl-fig [style*="linear-gradient"][style*="rgb(251, 191, 36)"], html.fl-fig [style*="linear-gradient"][style*="rgb(245, 158, 11)"] {
      background: var(--pop) !important; color: var(--ink) !important; }
    html.fl-fig :not(.rounded-full)[style*="linear-gradient"][style*="rgb(217, 119, 6)"], html.fl-fig :not(.rounded-full)[style*="linear-gradient"][style*="rgb(180, 83, 9)"],
    html.fl-fig :not(.rounded-full)[style*="linear-gradient"][style*="rgb(251, 191, 36)"] { border: 2.5px solid var(--ink) !important; box-shadow: 3px 3px 0 var(--ink) !important; }
    html.fl-fig [style*="linear-gradient"][style*="rgb(217, 119, 6)"] *, html.fl-fig [style*="linear-gradient"][style*="rgb(180, 83, 9)"] *, html.fl-fig [style*="linear-gradient"][style*="rgb(251, 191, 36)"] * { color: var(--ink) !important; }
    html.fl-fig .sticky.fl-glass { border-width: 0 0 2.5px 0 !important; border-radius: 0 !important; }
    html.fl-fig [style*="border-bottom-width: 1px; border-color: rgb(26, 26, 26)"] { border-width: 0 0 2.5px 0 !important; border-style: solid !important; box-shadow: none !important; }
    html.fl-fig .sticky.top-0 { border-width: 0 0 2.5px 0 !important; border-style: solid !important; border-color: var(--ink) !important; border-radius: 0 !important; box-shadow: none !important; background: #FFFFFF !important; }
    html.fl-fig .bg-amber-500, html.fl-fig .bg-amber-400, html.fl-fig .bg-orange-500 { background-color: var(--pop) !important; color: var(--ink) !important; }
    html.fl-fig .bg-emerald-500 { background-color: var(--mint) !important; color: var(--ink) !important; }

    /* testi oro poco leggibili su bianco -> inchiostro / ambra scuro */
    html.fl-fig [style*="color: rgb(245, 208, 97)"], html.fl-fig [style*="color: rgb(232, 185, 49)"], html.fl-fig [style*="color: rgb(255, 176, 32)"] { color: var(--ink) !important; }
    html.fl-fig .text-amber-400, html.fl-fig .text-amber-500, html.fl-fig .text-amber-600 { color: var(--ink) !important; }
    html.fl-fig [style*="border: 1px solid rgb(245, 158, 11)"], html.fl-fig [style*="rgba(251, 191, 36, 0.3)"] { border: 2.5px solid var(--ink) !important; box-shadow: 4px 4px 0 var(--ink) !important; }
    html.fl-fig [style*="border: 1px solid rgb(245, 158, 11)"] > button { background: var(--pop); border-bottom: 2.5px solid var(--ink); }
    html.fl-fig .text-slate-400 { color: #5B6170 !important; }
    html.fl-fig .text-slate-500 { color: #4A4F5A !important; }

    html.fl-fig .bg-amber-100, html.fl-fig .bg-amber-50 { background-color: #E3F0FF !important; }
    /* barra di navigazione */
    html.fl-fig .fixed.bottom-0 .fl-glass { border-radius: 20px !important; box-shadow: 4px 4px 0 var(--ink) !important; }
    html.fl-fig .fixed.bottom-0 .fl-glass button span.absolute { background: var(--pop) !important; box-shadow: inset 0 0 0 2px var(--ink) !important; }
    html.fl-fig .fixed.bottom-0 .fl-glass button { color: #4A4F5A !important; }
    html.fl-fig .fixed.bottom-0 .fl-glass button:has(span.absolute) { color: var(--ink) !important; }

    /* variabili usate da LosQuestion e tabelle */
    html.fl-fig { --fl-s1: #FFFFFF; --fl-s2: #FFFFFF; --fl-line: #1A1A1A; --fl-fg: #1A1A1A; }
    html.fl-fig .rounded-2xl[style*="var(--fl-line"] { border: 2.5px solid var(--ink) !important; box-shadow: 4px 4px 0 var(--ink) !important; }
    html.fl-fig [style*="rgba(232, 185, 49, 0.3)"] { border: 2.5px solid var(--ink) !important; box-shadow: 4px 4px 0 var(--ink) !important; }
    html.fl-fig .border-amber-200, html.fl-fig .border-amber-300, html.fl-fig .border-orange-200, html.fl-fig .border-emerald-200, html.fl-fig .border-rose-300 { border: 2.5px solid var(--ink) !important; box-shadow: 4px 4px 0 var(--ink) !important; }
    html.fl-fig .text-amber-700, html.fl-fig .text-amber-800, html.fl-fig .text-orange-900, html.fl-fig .text-orange-700 { color: var(--ink) !important; }

    /* testo di studio e formule */
    html.fl-fig .fl-rich .fl-strong { color: var(--ink); background: #D6E9FF; padding: 0 2px; border-radius: 3px; }
    html.fl-fig .fl-tex-d { background: #fff; border: 2.5px solid var(--ink); box-shadow: 3px 3px 0 var(--ink); }
    html.fl-fig .fl-table-wrap { border: 2px solid var(--ink); }
    html.fl-fig .fl-table th { background: var(--pop); }
    html.fl-fig .fl-table td { border-top-color: #D5D9E2; }
`;
if (typeof document !== 'undefined' && !document.getElementById('rly-css')) {
  const st = document.createElement('style'); st.id = 'rly-css'; st.textContent = RLY3_CSS + FL_HARMONY_CSS + FL_RICH_CSS + FL_FIG_CSS; document.head.appendChild(st);
  if (!document.getElementById('rly-font')) {
    const lk = document.createElement('link'); lk.id = 'rly-font'; lk.rel = 'stylesheet';
    lk.href = 'https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700;800;900&family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&display=swap'; document.head.appendChild(lk);
  }
}
let rlyCounter = 0;

// Mascotte Rally: stessa API del vecchio BullMascot (size, mood, className). Toccandolo salta e sbuffa.
const BullMascot = ({ size = 80, mood = 'neutral', className = '', animate = true }) => {
  const uidRef = useRef(null);
  if (uidRef.current === null) uidRef.current = 'r' + (++rlyCounter);
  const [poke, setPoke] = useState(0);
  useEffect(() => { if (!poke) return; const t = setTimeout(() => setPoke(0), 750); return () => clearTimeout(t); }, [poke]);
  return React.createElement('span', {
    className: 'inline-block align-middle ' + className,
    style: { width: size, height: size * 170 / 160, lineHeight: 0, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' },
    role: 'img', 'aria-label': 'Rally, la mascotte di FinLearn',
    onClick: (e) => { e.stopPropagation(); setPoke(Date.now()); },
    dangerouslySetInnerHTML: { __html: rly3SVG(mood, size, uidRef.current, { static: !animate, poke: !!poke }) }
  });
};
const RallyMascot = BullMascot;

// Logo: marchio (busto di Rally su navy) + wordmark "finlearn" con la i a freccia di rialzo
const FinLearnMark = ({ size = 44, className = '' }) => {
  const uidRef = useRef(null);
  if (uidRef.current === null) uidRef.current = 'mk' + (++rlyCounter);
  return React.createElement('span', {
    className: 'inline-block align-middle ' + className,
    style: { width: size, height: size, lineHeight: 0, borderRadius: size * 0.24, overflow: 'hidden', boxShadow: '0 0 0 1px rgba(255,176,32,.25)' },
    dangerouslySetInnerHTML: { __html: rly3MarkSVG(size, { uid: uidRef.current }) }
  });
};
const FL_ARROW_SVG = '<svg viewBox="0 0 20 20" aria-hidden="true"><polyline points="3,15 8,9 11,12 16,5" fill="none" stroke="#22C55E" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.6 2.2 L11.6 4.2 L17 9.4 Z" fill="#22C55E" stroke="#22C55E" stroke-width="1.6" stroke-linejoin="round"/></svg>';
const FinLearnWordmark = ({ size = 32, className = '', light = false }) =>
  React.createElement('span', {
    className: 'fl-wordmark ' + className, 'aria-label': 'FinLearn',
    style: { fontSize: size },
    dangerouslySetInnerHTML: { __html: `<span class="fl-wm-fin" ${light ? 'style="color:#16203A"' : ''}>f<span class="fl-wm-i">ı${FL_ARROW_SVG}</span>n</span>learn` }
  });


// ========== EFFETTI DI FINE ESERCIZIO (stile figurine) ==========
// Funzioni imperative: creano nodi sul body e li tolgono da sole, senza toccare lo stato React.
const FL_FX_CSS = `
.flfx-layer { position: fixed; inset: 0; pointer-events: none; z-index: 99; overflow: hidden; }
.flfx-bit { position: absolute; left: 0; top: 0; border: 2px solid #1A1A1A; will-change: transform, opacity; }
.flfx-sticker { position: absolute; left: 0; top: 0; padding: 6px 14px; border: 2.5px solid #1A1A1A; border-radius: 14px; background: #fff; color: #1A1A1A;
  font: 800 18px/1.1 'Bricolage Grotesque', 'Nunito', system-ui, sans-serif; box-shadow: 3px 3px 0 #1A1A1A; white-space: nowrap; will-change: transform, opacity; }
.flfx-sticker small { display: block; font-size: 11px; font-weight: 700; opacity: .75; margin-top: 1px; }
@keyframes flfxPop { 0% { transform: scale(1); } 35% { transform: scale(1.045) rotate(-.6deg); } 70% { transform: scale(.99); } 100% { transform: none; } }
@keyframes flfxShake { 0%,100% { transform: none; } 15% { transform: translateX(-9px) rotate(-1deg); } 30% { transform: translateX(8px) rotate(1deg); } 45% { transform: translateX(-6px); } 60% { transform: translateX(5px); } 75% { transform: translateX(-2px); } }
.flfx-pop { animation: flfxPop .45s cubic-bezier(.34,1.56,.64,1); }
.flfx-shake { animation: flfxShake .5s cubic-bezier(.36,.07,.19,.97); }
.flfx-cover { position: fixed; inset: 0; z-index: 95; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 22px;
  background: rgba(244,246,250,.82); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); cursor: pointer; opacity: 0; transition: opacity .25s ease; }
html.fl-dark .flfx-cover { background: rgba(7,11,20,.82); }
.flfx-cover.in { opacity: 1; }
.flfx-stage { perspective: 900px; position: relative; }
.flfx-card { width: 250px; border: 3px solid #1A1A1A; border-radius: 22px; background: #fff; color: #1A1A1A; box-shadow: 7px 7px 0 #1A1A1A; overflow: hidden; position: relative;
  font-family: 'Bricolage Grotesque', 'Nunito', system-ui, sans-serif; transform-style: preserve-3d; }
.flfx-card-head { background: #8EC5FF; border-bottom: 3px solid #1A1A1A; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; font-weight: 800; font-size: 12px; letter-spacing: .08em; }
.flfx-card-icon { height: 118px; display: flex; align-items: center; justify-content: center; font-size: 64px; background: repeating-linear-gradient(45deg, #F4F6FA 0 10px, #EAF2FF 10px 20px); border-bottom: 3px solid #1A1A1A; }
.flfx-card-body { padding: 12px 14px 14px; display: flex; flex-direction: column; gap: 6px; }
.flfx-card-code { align-self: flex-start; background: #1A1A1A; color: #fff; border-radius: 8px; padding: 2px 9px; font-weight: 800; font-size: 13px; }
.flfx-card-title { font-weight: 800; font-size: 17px; line-height: 1.15; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.flfx-card-foot { display: flex; justify-content: space-between; align-items: center; font-weight: 700; font-size: 12px; color: #4A4F5A; padding-top: 4px; }
.flfx-meter { flex: 1; height: 9px; border: 2px solid #1A1A1A; border-radius: 99px; margin-right: 10px; background: #fff; overflow: hidden; }
.flfx-meter i { display: block; height: 100%; background: #7EE0B5; border-right: 2px solid #1A1A1A; transition: width .9s cubic-bezier(.22,1,.36,1) .55s; }
.flfx-shine { position: absolute; inset: 0; background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,.75) 50%, transparent 65%); transform: translateX(-120%); pointer-events: none; }
.flfx-mascot { position: absolute; right: -58px; bottom: -78px; line-height: 0; transform-origin: 50% 100%; }
.flfx-hint { font: 700 13px 'Bricolage Grotesque', 'Nunito', system-ui, sans-serif; color: #4A4F5A; }
html.fl-dark .flfx-hint { color: #C9D1E0; }
@media (prefers-reduced-motion: reduce) { .flfx-pop, .flfx-shake { animation: none; } }
`;
if (typeof document !== 'undefined' && !document.getElementById('flfx-css')) {
  const st = document.createElement('style'); st.id = 'flfx-css'; st.textContent = FL_FX_CSS; document.head.appendChild(st);
}
const FLFX_COLORS = ['#8EC5FF', '#7EE0B5', '#FFB4C8', '#FFD43B', '#C4B5FD'];
const flfxReduced = () => { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };
const flfxBuzz = p => { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} };
const flfxRetrigger = (el, cls) => { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); setTimeout(() => el.classList.remove(cls), 600); };
function flfxCenter(el) {
  if (el && el.getBoundingClientRect) { const r = el.getBoundingClientRect(); if (r.width) return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
  return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
}
// coriandoli-figurina: rettangolini, pallini e stelline con il bordo nero, sparati verso l'alto e poi giù per gravità
function flfxBurst(x, y, n = 26, layer) {
  const own = !layer; layer = layer || document.body.appendChild(Object.assign(document.createElement('div'), { className: 'flfx-layer' }));
  for (let i = 0; i < n; i++) {
    const b = document.createElement('div'); b.className = 'flfx-bit';
    const kind = i % 3, size = 10 + Math.random() * 9;
    b.style.background = FLFX_COLORS[i % FLFX_COLORS.length];
    b.style.width = (kind === 0 ? size * 1.5 : size) + 'px'; b.style.height = size + 'px';
    b.style.borderRadius = kind === 1 ? '50%' : '3px';
    if (kind === 2) { b.style.clipPath = 'polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)'; b.style.border = 'none'; b.style.width = b.style.height = size * 1.6 + 'px'; }
    layer.appendChild(b);
    const ang = -Math.PI / 2 + (Math.random() - .5) * Math.PI * 1.35, v = 150 + Math.random() * 190;
    const dx = Math.cos(ang) * v, dy = Math.sin(ang) * v, rot = (Math.random() - .5) * 720;
    b.animate([
      { transform: `translate(${x}px,${y}px) rotate(0) scale(.4)`, opacity: 1 },
      { transform: `translate(${x + dx * .7}px,${y + dy * .7}px) rotate(${rot * .5}deg) scale(1)`, opacity: 1, offset: .35 },
      { transform: `translate(${x + dx}px,${y + dy + 260}px) rotate(${rot}deg) scale(.9)`, opacity: 0 }
    ], { duration: 1100 + Math.random() * 500, easing: 'cubic-bezier(.2,.7,.4,1)', fill: 'forwards' });
  }
  if (own) setTimeout(() => layer.remove(), 1800);
}
function flfxSticker(x, y, text, sub) {
  const layer = document.body.appendChild(Object.assign(document.createElement('div'), { className: 'flfx-layer' }));
  const s = document.createElement('div'); s.className = 'flfx-sticker';
  s.textContent = text; if (sub) { const sm = document.createElement('small'); sm.textContent = sub; s.appendChild(sm); }
  layer.appendChild(s);
  const w = s.offsetWidth, h = s.offsetHeight, rot = -8 + Math.random() * 6;
  const cx = Math.min(Math.max(x - w / 2, 12), window.innerWidth - w - 12), cy = y - h / 2 - 34;
  s.animate([
    { transform: `translate(${cx}px,${cy + 10}px) rotate(${rot - 10}deg) scale(.2)`, opacity: 0 },
    { transform: `translate(${cx}px,${cy - 6}px) rotate(${rot}deg) scale(1.12)`, opacity: 1, offset: .22 },
    { transform: `translate(${cx}px,${cy - 10}px) rotate(${rot}deg) scale(1)`, opacity: 1, offset: .7 },
    { transform: `translate(${cx}px,${cy - 44}px) rotate(${rot}deg) scale(.96)`, opacity: 0 }
  ], { duration: 1300, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'forwards' });
  setTimeout(() => layer.remove(), 1400);
}
const FLFX_OK = ['Esatto!', 'Perfetto!', 'Ottimo!', 'Bravo!', 'Centrato!'];
const flFx = {
  correct(el, sub) {
    flfxBuzz(18);
    const card = el && el.closest ? (el.closest('.rounded-2xl') || el) : null; flfxRetrigger(card, 'flfx-pop');
    if (flfxReduced()) return;
    const { x, y } = flfxCenter(el); flfxBurst(x, y); flfxSticker(x, y, FLFX_OK[Math.floor(Math.random() * FLFX_OK.length)], sub);
  },
  wrong(el) {
    flfxBuzz([30, 40, 30]);
    const card = el && el.closest ? (el.closest('.rounded-2xl') || el) : null; flfxRetrigger(card, 'flfx-shake');
  },
  // figurina della LOS appena completata: si gira, si "incolla", la mascotte festeggia. Tocca per chiudere (o si chiude da sola).
  losDone({ code, title, icon, reading, done, total }) {
    flfxBuzz([20, 60, 35]);
    const cover = document.createElement('div'); cover.className = 'flfx-cover'; cover.setAttribute('role', 'dialog'); cover.setAttribute('aria-label', 'LOS completato');
    const pct = total ? Math.round(done / total * 100) : 100;
    const esc = t => String(t == null ? '' : t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    cover.innerHTML = `<div class="flfx-stage"><div class="flfx-card">
        <div class="flfx-card-head"><span>FIGURINA SBLOCCATA</span><span>${esc(reading)}</span></div>
        <div class="flfx-card-icon">${String(icon || '').startsWith('data:') ? `<img src="${esc(icon)}" alt="" style="width:100px;height:100px;object-fit:contain">` : esc(icon || '📗')}</div>
        <div class="flfx-card-body"><span class="flfx-card-code">${esc(code)}</span><div class="flfx-card-title">${esc(title)}</div>
          <div class="flfx-card-foot"><span class="flfx-meter"><i style="width:${Math.max(0, pct - Math.round(100 / Math.max(total, 1)))}%"></i></span><span>${done}/${total}</span></div></div>
        <div class="flfx-shine"></div></div>
        <div class="flfx-mascot">${typeof rly3SVG === 'function' ? rly3SVG('celebrating', 96, 'fx' + Date.now(), {}) : ''}</div></div>
      <div class="flfx-hint">Tocca per continuare</div>`;
    document.body.appendChild(cover);
    const card = cover.querySelector('.flfx-card'), mascot = cover.querySelector('.flfx-mascot'), meter = cover.querySelector('.flfx-meter i');
    let closed = false;
    const close = () => { if (closed) return; closed = true; cover.classList.remove('in'); setTimeout(() => cover.remove(), 260); };
    cover.addEventListener('click', close); setTimeout(close, 3400);
    requestAnimationFrame(() => {
      cover.classList.add('in');
      requestAnimationFrame(() => { meter.style.width = pct + '%'; });
      if (flfxReduced()) return;
      card.animate([
        { transform: 'rotateY(180deg) rotate(-14deg) scale(.5)', opacity: 0 },
        { transform: 'rotateY(70deg) rotate(-8deg) scale(.95)', opacity: 1, offset: .45 },
        { transform: 'rotateY(0) rotate(-3deg) scale(1.12)', offset: .75 },
        { transform: 'rotateY(0) rotate(-3deg) scale(1)' }
      ], { duration: 720, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' });
      cover.querySelector('.flfx-shine').animate([{ transform: 'translateX(-120%)' }, { transform: 'translateX(120%)' }], { duration: 900, delay: 650, easing: 'ease-in-out', fill: 'forwards' });
      mascot.animate([{ transform: 'translateY(60px) scale(.6)', opacity: 0 }, { transform: 'translateY(-8px) scale(1.05)', opacity: 1, offset: .7 }, { transform: 'none', opacity: 1 }], { duration: 520, delay: 520, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'both' });
      setTimeout(() => { const r = card.getBoundingClientRect(); flfxBurst(r.left + r.width / 2, r.top + 30, 36); }, 560);
    });
  }
};

// ========== ALBUM CHE SBIADISCE ==========
// Ogni LOS completata diventa una figurina. Se non la ripassi entro la scadenza sbiadisce;
// la ravvivi rispondendo alla sua domanda d'esame (o ripassando i punti chiave se non ha domanda).
// Ripetizione dilazionata: giusta -> intervallo successivo (1, 3, 7, 16, 35, 80 giorni); sbagliata -> si riparte da 1 giorno.
const FL_ALBUM_KEY = 'finlearn_album';
const FL_DAY = 864e5;
const FL_STEPS = [1, 3, 7, 16, 35, 80];
const albumLoad = () => { try { return JSON.parse(localStorage.getItem(FL_ALBUM_KEY) || '{}'); } catch (e) { return {}; } };
const albumSave = a => { try { localStorage.setItem(FL_ALBUM_KEY, JSON.stringify(a)); } catch (e) {} try { window.dispatchEvent(new Event('fl-album')); } catch (e) {} };
function albumLearn(key) {
  const a = albumLoad(); if (a[key]) return;
  const now = Date.now(); a[key] = { t: now, step: 0, due: now + FL_DAY }; albumSave(a);
}
function albumReview(key, ok) {
  const a = albumLoad(); const now = Date.now();
  const s = a[key] || { t: now, step: 0 };
  s.step = ok ? Math.min((s.step || 0) + 1, FL_STEPS.length - 1) : 0;
  s.due = now + FL_STEPS[s.step] * FL_DAY; s.last = now; a[key] = s; albumSave(a);
}
// freschezza 1 = a colori; scende verso 0.25 man mano che si supera la scadenza
function albumFresh(s, now) {
  if (!s) return 0;
  if (now < s.due) return 1;
  const over = (now - s.due) / (FL_STEPS[s.step || 0] * FL_DAY);
  return Math.max(0.25, 1 - 0.75 * Math.min(1, 0.2 + over));
}
const FL_GENERIC_ICONS = ['✏️', '🧮', '🪜', '2️⃣', '3️⃣', '➡️', '📘', '👍', '👎', '⚠️'];
// "Calcolare e interpretare il valore intrinseco..." -> "Valore intrinseco..." (via il verbo d'apertura della LOS)
const flShortTitle = t => {
  const r = String(t || '').replace(/^((calcolare|spiegare|descrivere|confrontare|valutare|definire|identificare|interpretare|stimare|discutere|distinguere|analizzare|giustificare|dimostrare|formulare|elencare|riconoscere|determinare)(,| e| o)?\s+)+/i, '')
    .replace(/^(il|lo|la|i|gli|le|un|una|uno|come|se|quando|perché|l')\s*/i, '');
  return r.charAt(0).toUpperCase() + r.slice(1);
};
function albumIndex() {
  const out = [];
  Object.entries(CFA_CURRICULUM).forEach(([tk, t]) => (t.modules || []).forEach(m => (m.los || []).forEach((l, i) => out.push({
    key: `${m.id}-${l.id}`, tk, topic: t, mod: m, los: l, idx: i,
    code: (l.code || `LOS ${m.number}${l.id}`).replace(/^LOS\s*/, ''),
    icon: ((l.content && l.content.sections) || []).map(x => x.icon).find(ic => ic && !FL_GENERIC_ICONS.includes(ic)) || '📗',
    short: flShortTitle(l.title)
  }))));
  return out;
}
// prima volta: le LOS già completate entrano nell'album, con scadenze sparse sulla settimana (non tutte domani)
function albumMigrate(losProgress) {
  try {
    if (localStorage.getItem('finlearn_album_v1')) return;
    const a = albumLoad(); const now = Date.now();
    (losProgress || []).forEach((k, i) => { if (!a[k]) a[k] = { t: now, step: 0, due: now + (1 + i % 7) * FL_DAY }; });
    localStorage.setItem('finlearn_album_v1', '1'); albumSave(a);
  } catch (e) {}
}
const flAlbumPal = dark => ({
  bg: dark ? '#0B1322' : '#F4F6FA', ink: dark ? '#3A4D74' : '#1A1A1A', fg: dark ? '#F3EEE4' : '#1A1A1A', muted: dark ? '#9AA6BF' : '#4A4F5A',
  card: dark ? '#111C33' : '#FFFFFF', paper: dark ? '#16243F' : '#EAF2FF', empty: dark ? '#3A4D74' : '#9AA0AB',
  sky: '#8EC5FF', mint: '#7EE0B5', rose: '#FFB4C8'
});
const flRadius = r => ({ borderRadius: r });

function AlbumSticker({ it, st, now, pal, onClick, w = '100%', h = 118, tilt = 0 }) {
  const learned = !!st;
  if (!learned) {
    return React.createElement('button', {
      onClick, 'aria-label': `LOS ${it.code} da conquistare`,
      style: { width: w, height: h, border: `2.5px dashed ${pal.empty}`, borderRadius: 14, background: 'transparent', color: pal.empty, fontWeight: 800, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }
    }, it.code);
  }
  const f = albumFresh(st, now);
  const img = String(it.topic.icon || '').startsWith('data:');
  return React.createElement('button', {
    onClick, 'aria-label': `LOS ${it.code}${f < 1 ? ', da ravvivare' : ''}`,
    style: { width: w, height: h, padding: 0, border: `2.5px solid ${pal.ink}`, borderRadius: 14, background: pal.card, color: pal.fg, overflow: 'hidden', display: 'flex', flexDirection: 'column', textAlign: 'left',
      boxShadow: f === 1 ? `3px 3px 0 ${pal.ink}` : 'none', opacity: f === 1 ? 1 : 0.35 + 0.5 * f, filter: f === 1 ? 'none' : `grayscale(${(1 - f).toFixed(2)})`, transform: f === 1 && tilt ? `rotate(${tilt}deg)` : 'none', transition: 'opacity .4s, filter .4s' }
  },
    React.createElement('span', { style: { flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: `2px solid ${pal.ink}`, fontSize: 28, background: `repeating-linear-gradient(45deg, ${pal.paper} 0 8px, ${pal.card} 8px 16px)` } },
      img && it.icon === '📗' ? React.createElement('img', { src: it.topic.icon, alt: '', style: { width: 40, height: 40, objectFit: 'contain' } }) : it.icon),
    React.createElement('span', { style: { flex: 'none', margin: '4px 7px', height: 28, fontWeight: 700, fontSize: 12, lineHeight: '14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } },
      React.createElement('b', null, it.code), ' · ', it.short));
}

function AlbumReview({ items, pal, onClose, onOpenLOS }) {
  const [i, setI] = useState(0);
  const [sel, setSel] = useState(null);
  const [reveal, setReveal] = useState(false);
  const [results, setResults] = useState([]);
  const done = i >= items.length;
  const it = items[i];
  const record = (ok, el) => {
    albumReview(it.key, ok);
    setResults(r => [...r, { key: it.key, ok }]);
    if (ok) flFx.correct(el); else flFx.wrong(el);
  };
  const next = () => { setSel(null); setReveal(false); setI(i + 1); };
  useEffect(() => { if (done && results.some(r => r.ok)) setTimeout(() => flfxBurst(window.innerWidth / 2, window.innerHeight / 3, 36), 150); }, [done]);
  const L = ['A', 'B', 'C', 'D'];
  const btn = (bg, extra = {}) => ({ height: 52, border: `2.5px solid ${pal.ink}`, borderRadius: 16, background: bg, color: '#1A1A1A', fontWeight: 800, fontSize: 16, boxShadow: `3px 3px 0 ${pal.ink}`, ...extra });
  let body;
  if (done) {
    const ok = results.filter(r => r.ok).length;
    body = React.createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, textAlign: 'center', paddingTop: 20 } },
      React.createElement(BullMascot, { size: 120, mood: ok === results.length ? 'celebrating' : 'happy' }),
      React.createElement('h2', { style: { margin: 0, fontSize: 28, fontWeight: 800, color: pal.fg } }, ok === results.length ? 'Album di nuovo a colori!' : `${ok} su ${results.length} ravvivate`),
      React.createElement('p', { style: { margin: 0, fontSize: 14, fontWeight: 600, color: pal.muted, maxWidth: 300 } },
        ok === results.length ? 'Le rivedrai più avanti, a intervalli sempre più lunghi.' : 'Quelle sbagliate restano sbiadite e tornano domani. Se vuoi, ripassa la teoria.'),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, width: '100%', maxWidth: 340, marginTop: 6 } },
        items.map((x, k) => React.createElement(AlbumSticker, { key: x.key, it: x, st: albumLoad()[x.key], now: Date.now(), pal, h: 104, tilt: k % 2 ? 1.5 : -1.5, onClick: () => { onClose(); onOpenLOS(x); } }))),
      React.createElement('button', { onClick: onClose, style: btn(pal.sky, { width: '100%', maxWidth: 340, marginTop: 10 }) }, 'Torna all\'album'));
  } else {
    const q = it.los.question;
    const head = React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' } },
      React.createElement('span', { style: { border: `2px solid ${pal.ink}`, borderRadius: 10, background: pal.rose, color: '#1A1A1A', padding: '2px 10px', fontWeight: 800, fontSize: 13 } }, `${it.topic.name} · LOS ${it.code}`),
      React.createElement('span', { style: { fontWeight: 700, fontSize: 12, color: pal.muted } }, 'sta sbiadendo'));
    const title = React.createElement('div', { style: { fontWeight: 800, fontSize: 18, lineHeight: 1.25, color: pal.fg } }, it.los.title);
    if (q) {
      const answered = sel !== null;
      body = React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } }, head, title,
        React.createElement('div', { lang: 'en', style: { border: `2.5px solid ${pal.ink}`, borderRadius: 18, background: pal.card, color: pal.fg, boxShadow: `4px 4px 0 ${pal.ink}`, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 } },
          React.createElement('div', { style: { fontSize: 15, fontWeight: 600 } }, React.createElement(RichText, { text: q.q })),
          q.options.map((o, k) => {
            const isAns = k === q.ans; let bg = pal.card;
            if (answered && isAns) bg = 'rgba(34,197,94,.18)'; else if (answered && k === sel) bg = 'rgba(255,90,95,.16)';
            return React.createElement('button', {
              key: k, disabled: answered,
              onClick: e => { setSel(k); record(k === q.ans, e.currentTarget); },
              style: { textAlign: 'left', border: `2.5px solid ${answered && isAns ? '#22C55E' : answered && k === sel ? '#FF5A5F' : pal.ink}`, borderRadius: 14, background: bg, color: pal.fg, padding: '10px 12px', display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, fontWeight: 600 }
            }, React.createElement('span', { style: { flex: 'none', width: 28, height: 28, border: `2px solid ${pal.ink}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 } }, L[k]),
              React.createElement('span', { style: { paddingTop: 3 } }, React.createElement(RichText, { text: o })));
          })),
        answered && React.createElement('div', { style: { border: `2.5px solid ${pal.ink}`, borderRadius: 16, background: sel === q.ans ? 'rgba(34,197,94,.10)' : 'rgba(255,90,95,.08)', color: pal.fg, padding: 12, fontSize: 14 } },
          React.createElement('div', { style: { fontWeight: 800, marginBottom: 4 } }, sel === q.ans ? 'Figurina ravvivata' : `Risposta giusta: ${L[q.ans]}. Torna domani.`),
          React.createElement(RichText, { text: q.exp, className: 'text-sm' })),
        answered && React.createElement('div', { style: { display: 'flex', gap: 10 } },
          sel !== q.ans && React.createElement('button', { onClick: () => { onClose(); onOpenLOS(it); }, style: btn(pal.card, { color: pal.fg, padding: '0 14px', fontSize: 14 }) }, 'Rivedi la teoria'),
          React.createElement('button', { onClick: next, style: btn(pal.sky, { flex: 1 }) }, i < items.length - 1 ? 'Avanti' : 'Fine')));
    } else {
      body = React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } }, head, title,
        React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: pal.muted } }, 'Questa LOS non ha una domanda d\'esame: prova a ricordare i punti chiave, poi controlla.'),
        reveal ? React.createElement('div', { style: { border: `2.5px solid ${pal.ink}`, borderRadius: 18, background: pal.card, color: pal.fg, boxShadow: `4px 4px 0 ${pal.ink}`, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 } },
          (it.los.keyPoints || []).map((p, k) => React.createElement('div', { key: k, style: { fontSize: 14, fontWeight: 600, display: 'flex', gap: 8 } }, React.createElement('span', null, '•'), React.createElement('span', null, p))))
          : React.createElement('button', { onClick: () => setReveal(true), style: btn(pal.card, { color: pal.fg }) }, 'Mostra i punti chiave'),
        reveal && !results.find(r => r.key === it.key) && React.createElement('div', { style: { display: 'flex', gap: 10 } },
          React.createElement('button', { onClick: e => record(false, e.currentTarget), style: btn(pal.card, { flex: 1, color: pal.fg }) }, 'Non li ricordavo'),
          React.createElement('button', { onClick: e => record(true, e.currentTarget), style: btn(pal.mint, { flex: 1 }) }, 'Me li ricordavo')),
        results.find(r => r.key === it.key) && React.createElement('button', { onClick: next, style: btn(pal.sky) }, i < items.length - 1 ? 'Avanti' : 'Fine'));
    }
  }
  return React.createElement('div', { role: 'dialog', 'aria-label': 'Ripasso dell\'album', style: { position: 'fixed', inset: 0, zIndex: 60, background: pal.bg, overflowY: 'auto' }, className: 'fl-album-layer' },
    React.createElement('div', { style: { maxWidth: 560, margin: '0 auto', padding: '16px 16px 40px', display: 'flex', flexDirection: 'column', gap: 14 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
        React.createElement('button', { onClick: onClose, 'aria-label': 'Chiudi', style: { width: 44, height: 44, border: `2.5px solid ${pal.ink}`, borderRadius: 12, background: pal.card, color: pal.fg, display: 'flex', alignItems: 'center', justifyContent: 'center' } }, React.createElement(X, { size: 20 })),
        React.createElement('div', { style: { flex: 1, display: 'grid', gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 4 } },
          items.map((x, k) => { const r = results[k]; return React.createElement('span', { key: k, style: { height: 12, border: `2px solid ${pal.ink}`, borderRadius: 99, background: r ? (r.ok ? pal.mint : pal.rose) : k === i ? pal.sky : 'transparent' } }); }))),
      body));
}

function AlbumPages({ topicKey, pal, now, album, onClose, onOpenLOS }) {
  const t = CFA_CURRICULUM[topicKey];
  const all = albumIndex().filter(x => x.tk === topicKey);
  const img = String(t.icon || '').startsWith('data:');
  return React.createElement('div', { role: 'dialog', 'aria-label': `Album ${t.name}`, className: 'fl-album-layer', style: { position: 'fixed', inset: 0, zIndex: 60, background: pal.bg, overflowY: 'auto' } },
    React.createElement('div', { style: { position: 'sticky', top: 0, zIndex: 2, background: pal.mint, borderBottom: `2.5px solid ${pal.ink}`, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, color: '#1A1A1A' } },
      React.createElement('button', { onClick: onClose, 'aria-label': 'Indietro', style: { width: 44, height: 44, border: '2.5px solid #1A1A1A', borderRadius: 12, background: '#FFFFFF', color: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, React.createElement(ChevronLeft, { size: 22 })),
      React.createElement('div', { style: { flex: 1 } },
        React.createElement('div', { style: { fontWeight: 800, fontSize: 20, lineHeight: 1.1 } }, `Album ${t.name}`),
        React.createElement('div', { style: { fontWeight: 700, fontSize: 12 } }, `${all.filter(x => album[x.key]).length} / ${all.length} figurine`)),
      img ? React.createElement('img', { src: t.icon, alt: '', style: { width: 44, height: 40, objectFit: 'contain' } }) : React.createElement('span', { style: { fontSize: 28 } }, t.icon)),
    React.createElement('div', { style: { maxWidth: 560, margin: '0 auto', padding: '16px 16px 60px', display: 'flex', flexDirection: 'column', gap: 22 } },
      t.modules.map(m => {
        const items = all.filter(x => x.mod.id === m.id);
        const got = items.filter(x => album[x.key]).length;
        const faded = items.filter(x => album[x.key] && albumFresh(album[x.key], now) < 1).length;
        return React.createElement('section', { key: m.id, style: { display: 'flex', flexDirection: 'column', gap: 10 } },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, color: pal.fg } },
            React.createElement('h3', { style: { margin: 0, fontWeight: 800, fontSize: 17, lineHeight: 1.2 } }, `${m.id.startsWith('pm-') ? 'R' : 'LM'}${m.number} · ${m.title}`),
            React.createElement('span', { style: { flex: 'none', fontWeight: 700, fontSize: 12, color: pal.muted } }, `${got}/${items.length}${faded ? ` · ${faded} sbiadite` : ''}`)),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 } },
            items.map((x, k) => React.createElement(AlbumSticker, { key: x.key, it: x, st: album[x.key], now, pal, tilt: [-1.5, 1, -0.5, 1.5][k % 4], onClick: () => { onClose(); onOpenLOS(x); } }))));
      })));
}

function AlbumHome({ losProgress, theme, onOpenLOS }) {
  const dark = theme === 'dark';
  const pal = flAlbumPal(dark);
  const [, force] = useState(0);
  const [review, setReview] = useState(null);
  const [pages, setPages] = useState(null);
  useEffect(() => { albumMigrate(losProgress); const h = () => force(n => n + 1); window.addEventListener('fl-album', h); return () => window.removeEventListener('fl-album', h); }, []);
  const album = albumLoad(); const now = Date.now();
  const idx = albumIndex();
  const learned = idx.filter(x => album[x.key]);
  const fading = learned.filter(x => now >= album[x.key].due).sort((a, b) => albumFresh(album[a.key], now) - albumFresh(album[b.key], now));
  // prossima da conquistare: dopo l'ultima figurina presa, nello stesso modulo/materia
  const lastKey = Object.entries(album).sort((a, b) => b[1].t - a[1].t)[0];
  const last = lastKey && idx.find(x => x.key === lastKey[0]);
  const pool = last ? [...idx.filter(x => x.tk === last.tk && x.mod.id === last.mod.id), ...idx.filter(x => x.tk === last.tk), ...idx] : [...idx.filter(x => x.tk === 'equityValuation'), ...idx];
  const nextUp = pool.find(x => !album[x.key]);
  const nextDue = learned.length && !fading.length ? Math.ceil((Math.min(...learned.map(x => album[x.key].due)) - now) / FL_DAY) : null;
  const card = (extra = {}) => ({ border: `2.5px solid ${pal.ink}`, borderRadius: 20, background: pal.card, boxShadow: `4px 4px 0 ${pal.ink}`, padding: '12px 14px', color: pal.fg, ...extra });
  const btnS = (bg, extra = {}) => ({ height: 48, border: `2.5px solid ${pal.ink}`, borderRadius: 14, background: bg, boxShadow: `3px 3px 0 ${pal.ink}`, color: '#1A1A1A', fontWeight: 800, fontSize: 15, ...extra });
  const topics = Object.entries(CFA_CURRICULUM).filter(([, t]) => t.modules && t.modules.some(m => m.los && m.los.length)).sort((a, b) => {
    const order = ['equityValuation', 'portfolioManagement']; const ia = order.indexOf(a[0]), ib = order.indexOf(b[0]); return (ia < 0 ? 9 : ia) - (ib < 0 ? 9 : ib);
  });
  const tileBg = [pal.mint, pal.rose, pal.sky, '#FFD43B'];
  const reviewSet = fading.slice(0, 5);
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 8 } },
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', color: pal.fg } },
      React.createElement('div', null,
        React.createElement('div', { style: { fontWeight: 600, fontSize: 14, color: pal.muted } }, 'Il tuo album CFA L2'),
        React.createElement('div', { style: { fontWeight: 800, fontSize: 30, letterSpacing: '-0.02em', lineHeight: 1.05 } }, `${learned.length} / ${idx.length} figurine`)),
      React.createElement(BullMascot, { size: 54, mood: fading.length ? 'thinking' : 'happy' })),

    React.createElement('div', { style: card({ display: 'flex', flexDirection: 'column', gap: 10 }) },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 } },
        React.createElement('span', { style: { fontWeight: 800, fontSize: 17 } }, fading.length ? 'Stanno sbiadendo' : 'Tutto a colori'),
        React.createElement('span', { style: { fontWeight: 700, fontSize: 12, color: pal.muted } }, fading.length ? `${fading.length} da ravvivare` : learned.length ? (nextDue <= 1 ? 'il prossimo ripasso è domani' : `prossimo ripasso tra ${nextDue} giorni`) : 'completa una LOS per la prima figurina')),
      fading.length ? React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 } },
        fading.slice(0, 3).map(x => React.createElement(AlbumSticker, { key: x.key, it: x, st: album[x.key], now, pal, h: 104, onClick: () => setReview([x]) }))) : null,
      fading.length ? React.createElement('button', { onClick: () => setReview(reviewSet), style: btnS(pal.sky) }, `Ravviva ${reviewSet.length === 1 ? 'la figurina' : `queste ${reviewSet.length}`} · ~${Math.max(2, Math.round(reviewSet.length * 1.5))} min`) : null),

    nextUp && React.createElement('div', { style: card({ display: 'flex', gap: 12, alignItems: 'center' }) },
      React.createElement('div', { style: { flex: 'none', width: 84, height: 108, border: `2.5px dashed ${pal.ink}`, borderRadius: 14, background: `repeating-linear-gradient(45deg, ${pal.card} 0 8px, ${pal.paper} 8px 16px)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 28, color: pal.empty } }, '?'),
      React.createElement('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 } },
        React.createElement('span', { style: { fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', color: pal.muted } }, 'PROSSIMA DA CONQUISTARE'),
        React.createElement('span', { style: { fontWeight: 800, fontSize: 15, lineHeight: 1.25, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' } }, `LOS ${nextUp.code} · ${nextUp.los.title}`),
        React.createElement('button', { onClick: () => onOpenLOS(nextUp), style: { alignSelf: 'flex-start', height: 40, padding: '0 16px', border: `2.5px solid ${pal.ink}`, borderRadius: 12, background: dark ? pal.sky : '#1A1A1A', color: dark ? '#1A1A1A' : '#FFFFFF', fontWeight: 800, fontSize: 14 } }, 'Studiala'))),

    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 } },
      topics.map(([tk, t], k) => {
        const all = idx.filter(x => x.tk === tk); const got = all.filter(x => album[x.key]).length;
        const faded = all.filter(x => album[x.key] && now >= album[x.key].due).length;
        const img = String(t.icon || '').startsWith('data:');
        return React.createElement('button', { key: tk, onClick: () => setPages(tk), style: { textAlign: 'left', border: `2.5px solid ${pal.ink}`, borderRadius: 16, background: tileBg[k % tileBg.length], boxShadow: `3px 3px 0 ${pal.ink}`, color: '#1A1A1A', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6 } },
          React.createElement('span', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 } },
            React.createElement('span', { style: { fontWeight: 800, fontSize: 15, lineHeight: 1.1 } }, t.name),
            img ? React.createElement('img', { src: t.icon, alt: '', style: { width: 30, height: 28, objectFit: 'contain', flex: 'none' } }) : React.createElement('span', { style: { fontSize: 20 } }, t.icon)),
          React.createElement('span', { style: { display: 'block', height: 10, border: '2px solid #1A1A1A', borderRadius: 99, background: '#FFFFFF', overflow: 'hidden' } },
            React.createElement('span', { style: { display: 'block', height: '100%', width: `${all.length ? got / all.length * 100 : 0}%`, background: '#1A1A1A' } })),
          React.createElement('span', { style: { fontWeight: 700, fontSize: 12 } }, `${got} / ${all.length}${faded ? ` · ${faded} sbiadite` : ''}`));
      })),

    review && React.createElement(AlbumReview, { items: review, pal, onClose: () => setReview(null), onOpenLOS }),
    pages && React.createElement(AlbumPages, { topicKey: pages, pal, now, album, onClose: () => setPages(null), onOpenLOS }));
}

// Level Icons - Professional rank badges
const RookieIcon = ({
  size = 40,
  className = ''
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 100 100",
  width: size,
  height: size,
  className: className
}, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
  id: "rookieGrad",
  x1: "0%",
  y1: "0%",
  x2: "100%",
  y2: "100%"
}, /*#__PURE__*/React.createElement("stop", {
  offset: "0%",
  stopColor: "#94a3b8"
}), /*#__PURE__*/React.createElement("stop", {
  offset: "100%",
  stopColor: "#64748b"
}))), /*#__PURE__*/React.createElement("circle", {
  cx: "50",
  cy: "50",
  r: "40",
  fill: "url(#rookieGrad)"
}), /*#__PURE__*/React.createElement("path", {
  d: "M50,25 L55,40 L70,40 L58,50 L63,65 L50,55 L37,65 L42,50 L30,40 L45,40 Z",
  fill: "white",
  opacity: "0.9"
}));
const TraderIcon = ({
  size = 40,
  className = ''
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 100 100",
  width: size,
  height: size,
  className: className
}, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
  id: "traderGrad",
  x1: "0%",
  y1: "0%",
  x2: "100%",
  y2: "100%"
}, /*#__PURE__*/React.createElement("stop", {
  offset: "0%",
  stopColor: "#3b82f6"
}), /*#__PURE__*/React.createElement("stop", {
  offset: "100%",
  stopColor: "#1d4ed8"
}))), /*#__PURE__*/React.createElement("circle", {
  cx: "50",
  cy: "50",
  r: "40",
  fill: "url(#traderGrad)"
}), /*#__PURE__*/React.createElement("path", {
  d: "M25,65 L40,45 L55,55 L75,30",
  stroke: "white",
  strokeWidth: "4",
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}), /*#__PURE__*/React.createElement("path", {
  d: "M65,30 L75,30 L75,40",
  stroke: "white",
  strokeWidth: "4",
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}));
const WolfIcon = ({
  size = 40,
  className = ''
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 100 100",
  width: size,
  height: size,
  className: className
}, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
  id: "wolfGrad",
  x1: "0%",
  y1: "0%",
  x2: "100%",
  y2: "100%"
}, /*#__PURE__*/React.createElement("stop", {
  offset: "0%",
  stopColor: "#8b5cf6"
}), /*#__PURE__*/React.createElement("stop", {
  offset: "100%",
  stopColor: "#6d28d9"
}))), /*#__PURE__*/React.createElement("circle", {
  cx: "50",
  cy: "50",
  r: "40",
  fill: "url(#wolfGrad)"
}), /*#__PURE__*/React.createElement("path", {
  d: "M25,45 L35,20 L45,40 Z",
  fill: "white"
}), /*#__PURE__*/React.createElement("path", {
  d: "M75,45 L65,20 L55,40 Z",
  fill: "white"
}), /*#__PURE__*/React.createElement("ellipse", {
  cx: "50",
  cy: "55",
  rx: "20",
  ry: "18",
  fill: "white"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "40",
  cy: "50",
  r: "4",
  fill: "#6d28d9"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "60",
  cy: "50",
  r: "4",
  fill: "#6d28d9"
}), /*#__PURE__*/React.createElement("ellipse", {
  cx: "50",
  cy: "62",
  rx: "6",
  ry: "4",
  fill: "#4c1d95"
}));
const BullIcon = ({
  size = 40,
  className = ''
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 100 100",
  width: size,
  height: size,
  className: className
}, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
  id: "bullIconGrad",
  x1: "0%",
  y1: "0%",
  x2: "100%",
  y2: "100%"
}, /*#__PURE__*/React.createElement("stop", {
  offset: "0%",
  stopColor: "#fbbf24"
}), /*#__PURE__*/React.createElement("stop", {
  offset: "100%",
  stopColor: "#ea580c"
}))), /*#__PURE__*/React.createElement("circle", {
  cx: "50",
  cy: "50",
  r: "40",
  fill: "url(#bullIconGrad)"
}), /*#__PURE__*/React.createElement("path", {
  d: "M20,40 Q10,20 20,25 Q25,30 30,40",
  fill: "white"
}), /*#__PURE__*/React.createElement("path", {
  d: "M80,40 Q90,20 80,25 Q75,30 70,40",
  fill: "white"
}), /*#__PURE__*/React.createElement("ellipse", {
  cx: "50",
  cy: "55",
  rx: "22",
  ry: "18",
  fill: "white"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "40",
  cy: "50",
  r: "4",
  fill: "#ea580c"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "60",
  cy: "50",
  r: "4",
  fill: "#ea580c"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "44",
  cy: "62",
  r: "3",
  fill: "#fbbf24"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "56",
  cy: "62",
  r: "3",
  fill: "#fbbf24"
}));

// Topic Icons - Professional category icons
const BondsIcon = ({
  size = 40,
  className = ''
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 100 100",
  width: size,
  height: size,
  className: className
}, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
  id: "bondsGrad",
  x1: "0%",
  y1: "0%",
  x2: "100%",
  y2: "100%"
}, /*#__PURE__*/React.createElement("stop", {
  offset: "0%",
  stopColor: "#06b6d4"
}), /*#__PURE__*/React.createElement("stop", {
  offset: "100%",
  stopColor: "#0891b2"
}))), /*#__PURE__*/React.createElement("rect", {
  x: "15",
  y: "20",
  width: "70",
  height: "60",
  rx: "8",
  fill: "url(#bondsGrad)"
}), /*#__PURE__*/React.createElement("rect", {
  x: "25",
  y: "30",
  width: "50",
  height: "8",
  rx: "2",
  fill: "white",
  opacity: "0.9"
}), /*#__PURE__*/React.createElement("rect", {
  x: "25",
  y: "45",
  width: "35",
  height: "6",
  rx: "2",
  fill: "white",
  opacity: "0.6"
}), /*#__PURE__*/React.createElement("rect", {
  x: "25",
  y: "58",
  width: "25",
  height: "6",
  rx: "2",
  fill: "white",
  opacity: "0.6"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "70",
  cy: "60",
  r: "12",
  fill: "white",
  opacity: "0.9"
}), /*#__PURE__*/React.createElement("text", {
  x: "70",
  y: "65",
  textAnchor: "middle",
  fontSize: "14",
  fill: "#0891b2",
  fontWeight: "bold"
}, "%"));
const EquityIcon = ({
  size = 40,
  className = ''
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 100 100",
  width: size,
  height: size,
  className: className
}, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
  id: "equityGrad",
  x1: "0%",
  y1: "0%",
  x2: "100%",
  y2: "100%"
}, /*#__PURE__*/React.createElement("stop", {
  offset: "0%",
  stopColor: "#10b981"
}), /*#__PURE__*/React.createElement("stop", {
  offset: "100%",
  stopColor: "#059669"
}))), /*#__PURE__*/React.createElement("circle", {
  cx: "50",
  cy: "50",
  r: "40",
  fill: "url(#equityGrad)"
}), /*#__PURE__*/React.createElement("path", {
  d: "M25,70 L35,50 L50,60 L65,35 L80,45",
  stroke: "white",
  strokeWidth: "4",
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "80",
  cy: "45",
  r: "6",
  fill: "white"
}));

// Flame Icon - Animated
const FlameIconSVG = ({
  size = 24,
  animated = false,
  className = ''
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  width: size,
  height: size,
  className: `${className} ${animated ? 'animate-pulse' : ''}`
}, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
  id: "flameGradient",
  x1: "0%",
  y1: "100%",
  x2: "0%",
  y2: "0%"
}, /*#__PURE__*/React.createElement("stop", {
  offset: "0%",
  stopColor: "#ea580c"
}), /*#__PURE__*/React.createElement("stop", {
  offset: "50%",
  stopColor: "#f59e0b"
}), /*#__PURE__*/React.createElement("stop", {
  offset: "100%",
  stopColor: "#fcd34d"
}))), /*#__PURE__*/React.createElement("path", {
  fill: "url(#flameGradient)",
  d: "M12 23c-3.866 0-7-3.134-7-7 0-2.577 1.405-4.83 3.49-6.035-.145 1.035.09 2.09.67 2.965.65.98 1.64 1.67 2.76 1.94-.17-.89-.08-1.82.25-2.65.33-.84.88-1.54 1.58-2.02-.12.66.02 1.35.39 1.92.37.57.95.99 1.62 1.18-.19-.73-.15-1.5.11-2.22.27-.72.74-1.35 1.35-1.78-.08.87.13 1.75.58 2.5.45.74 1.12 1.32 1.9 1.65C19.89 15.08 19 18.91 15 21.5c-.95.58-2.02.96-3.15 1.1-.61.08-1.23.08-1.85.01V23z"
}));

// Star Icon - Custom
const StarIconSVG = ({
  size = 24,
  filled = true,
  className = ''
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  width: size,
  height: size,
  className: className
}, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
  id: "starGrad",
  x1: "0%",
  y1: "0%",
  x2: "100%",
  y2: "100%"
}, /*#__PURE__*/React.createElement("stop", {
  offset: "0%",
  stopColor: "#fcd34d"
}), /*#__PURE__*/React.createElement("stop", {
  offset: "100%",
  stopColor: "#f59e0b"
}))), /*#__PURE__*/React.createElement("path", {
  fill: filled ? "url(#starGrad)" : "none",
  stroke: filled ? "none" : "#f59e0b",
  strokeWidth: "2",
  d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
}));

// Trophy Icon - Custom
const TrophyIconSVG = ({
  size = 40,
  className = ''
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 100 100",
  width: size,
  height: size,
  className: className
}, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
  id: "trophyGrad",
  x1: "0%",
  y1: "0%",
  x2: "100%",
  y2: "100%"
}, /*#__PURE__*/React.createElement("stop", {
  offset: "0%",
  stopColor: "#fcd34d"
}), /*#__PURE__*/React.createElement("stop", {
  offset: "100%",
  stopColor: "#f59e0b"
}))), /*#__PURE__*/React.createElement("path", {
  d: "M25,20 L75,20 L70,55 Q65,70 50,70 Q35,70 30,55 Z",
  fill: "url(#trophyGrad)"
}), /*#__PURE__*/React.createElement("path", {
  d: "M25,25 Q10,25 10,40 Q10,55 25,50",
  stroke: "#f59e0b",
  strokeWidth: "6",
  fill: "none"
}), /*#__PURE__*/React.createElement("path", {
  d: "M75,25 Q90,25 90,40 Q90,55 75,50",
  stroke: "#f59e0b",
  strokeWidth: "6",
  fill: "none"
}), /*#__PURE__*/React.createElement("rect", {
  x: "40",
  y: "70",
  width: "20",
  height: "10",
  fill: "#f59e0b"
}), /*#__PURE__*/React.createElement("rect", {
  x: "30",
  y: "80",
  width: "40",
  height: "8",
  rx: "2",
  fill: "#fcd34d"
}), /*#__PURE__*/React.createElement("path", {
  d: "M50,30 L53,40 L63,40 L55,47 L58,57 L50,51 L42,57 L45,47 L37,40 L47,40 Z",
  fill: "white"
}));

// Helper function to get level icon and info
const getLevelInfo = xp => {
  if (xp >= 5000) return {
    name: 'Bull',
    Icon: BullIcon,
    color: 'from-amber-400 to-orange-500'
  };
  if (xp >= 2000) return {
    name: 'Wolf',
    Icon: WolfIcon,
    color: 'from-purple-400 to-purple-600'
  };
  if (xp >= 500) return {
    name: 'Trader',
    Icon: TraderIcon,
    color: 'from-blue-400 to-blue-600'
  };
  return {
    name: 'Rookie',
    Icon: RookieIcon,
    color: 'from-slate-400 to-slate-500'
  };
};

// ========== GLOBAL DESIGN SYSTEM ==========
const GlobalStyles = () => /*#__PURE__*/React.createElement("style", null, `
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700;800;900&display=swap');

    body, button, input, textarea { font-family: 'Nunito', system-ui, sans-serif; }
    .fl-display { font-family: 'Nunito', system-ui, sans-serif !important; font-weight: 900 !important; letter-spacing: -0.01em; }
    .fl-mono { font-family: 'Nunito', system-ui, sans-serif !important; font-weight: 800; font-variant-numeric: tabular-nums; letter-spacing: .02em; }

    @keyframes flShimmer { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }
    @keyframes flTicker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    @keyframes flGlowPulse { 0%,100% { opacity: .35; transform: scale(1); } 50% { opacity: .8; transform: scale(1.08); } }
    @keyframes flGridPan { 0% { background-position: 0 0; } 100% { background-position: 48px 48px; } }
    @keyframes flCandle { 0% { transform: scaleY(0); opacity: 0; } 100% { transform: scaleY(1); opacity: 1; } }
    @keyframes flFadeUp { 0% { opacity: 0; transform: translateY(16px); } 100% { opacity: 1; transform: translateY(0); } }
    @keyframes flSweep { 0% { transform: translateX(-160%) skewX(-20deg); } 60%,100% { transform: translateX(380%) skewX(-20deg); } }
    @keyframes flQuizIn { 0% { opacity: 0; transform: translateX(34px); } 100% { opacity: 1; transform: none; } }
    @keyframes flOptIn { 0% { opacity: 0; transform: translateY(14px); } 100% { opacity: 1; transform: none; } }
    .fl-quiz-in { animation: flQuizIn .38s cubic-bezier(.22,1,.36,1) both; }
    .fl-opt-in { animation: flOptIn .45s cubic-bezier(.22,1,.36,1) both; }
    @keyframes flFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }

    .fl-gold-text {
      background: linear-gradient(110deg, #d97706 10%, #f5d061 35%, #fff3c4 50%, #e8b931 65%, #d97706 90%);
      background-size: 200% auto;
      -webkit-background-clip: text; background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: flShimmer 4.5s linear infinite;
    }
    .fl-glass {
      background: rgba(17, 28, 51, 0.78);
      backdrop-filter: blur(20px) saturate(1.3);
      -webkit-backdrop-filter: blur(20px) saturate(1.3);
      border: 1px solid rgba(232, 185, 49, 0.14);
    }
    .fl-grid-bg {
      background-image:
        linear-gradient(rgba(232,185,49,.045) 1px, transparent 1px),
        linear-gradient(90deg, rgba(232,185,49,.045) 1px, transparent 1px);
      background-size: 48px 48px;
      animation: flGridPan 14s linear infinite;
    }
    .fl-card-hover { transition: transform .25s cubic-bezier(.22,1,.36,1), box-shadow .25s ease, border-color .25s ease; }
    .fl-card-hover:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 14px 36px -14px rgba(232,185,49,.4); }
    .fl-card-hover:active:not(:disabled) { transform: translateY(-1px) scale(.99); }
    .fl-fade-up { animation: flFadeUp .55s cubic-bezier(.22,1,.36,1) both; }
    .fl-float { animation: flFloat 4s ease-in-out infinite; }
    .fl-sweep { position: relative; overflow: hidden; }
    .fl-sweep::after {
      content: ''; position: absolute; top: 0; bottom: 0; left: 0; width: 45%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,.28), transparent);
      animation: flSweep 3.4s cubic-bezier(.4,0,.2,1) infinite; pointer-events: none;
    }
    .fl-ticker-track { display: flex; width: max-content; animation: flTicker 32s linear infinite; }
    .fl-ticker-track:hover { animation-play-state: paused; }


    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(232,185,49,.22); border-radius: 99px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(232,185,49,.45); }
    button { -webkit-tap-highlight-color: transparent; }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
    }
  `);

// Ticker tape stile mercati: i topic CFA quotati come indici (variazione = peso d'esame)
const TICKER_ITEMS = [{
  sym: 'ETHICS',
  chg: '+15.0%',
  up: true
}, {
  sym: 'QUANT',
  chg: '+9.2%',
  up: true
}, {
  sym: 'ECON',
  chg: '+8.1%',
  up: true
}, {
  sym: 'FRA',
  chg: '+14.5%',
  up: true
}, {
  sym: 'CORP ISS',
  chg: '+7.0%',
  up: true
}, {
  sym: 'EQUITY',
  chg: '+12.4%',
  up: true
}, {
  sym: 'FIXED INC',
  chg: '+13.8%',
  up: true
}, {
  sym: 'DERIV',
  chg: '-6.2%',
  up: false
}, {
  sym: 'ALT INV',
  chg: '+7.7%',
  up: true
}, {
  sym: 'PM',
  chg: '-5.9%',
  up: false
}];
const TickerTape = () => /*#__PURE__*/React.createElement("div", {
  className: "overflow-hidden border-y",
  style: {
    borderColor: 'rgba(232,185,49,0.14)',
    background: 'rgba(5,8,16,0.6)'
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "fl-ticker-track py-1.5"
}, [...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => /*#__PURE__*/React.createElement("span", {
  key: i,
  className: "fl-mono text-[11px] flex items-center gap-1.5 px-4 whitespace-nowrap"
}, /*#__PURE__*/React.createElement("span", {
  className: "text-slate-400 font-semibold"
}, t.sym), /*#__PURE__*/React.createElement("span", {
  className: t.up ? 'text-emerald-400' : 'text-rose-400'
}, t.up ? '▲' : '▼', " ", t.chg)))));

// Candlestick chart animato (splash / sfondi)
const CandleChart = ({
  className = ''
}) => {
  const candles = [{
    h: 22,
    y: 60,
    up: true,
    w: 16,
    d: 0
  }, {
    h: 30,
    y: 48,
    up: true,
    w: 16,
    d: .12
  }, {
    h: 18,
    y: 52,
    up: false,
    w: 16,
    d: .24
  }, {
    h: 34,
    y: 36,
    up: true,
    w: 16,
    d: .36
  }, {
    h: 26,
    y: 30,
    up: true,
    w: 16,
    d: .48
  }, {
    h: 16,
    y: 38,
    up: false,
    w: 16,
    d: .6
  }, {
    h: 40,
    y: 14,
    up: true,
    w: 16,
    d: .72
  }, {
    h: 32,
    y: 8,
    up: true,
    w: 16,
    d: .84
  }];
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 200 100",
    className: className,
    preserveAspectRatio: "none"
  }, candles.map((c, i) => /*#__PURE__*/React.createElement("g", {
    key: i
  }, /*#__PURE__*/React.createElement("line", {
    x1: i * 25 + 12,
    x2: i * 25 + 12,
    y1: c.y - 6,
    y2: c.y + c.h + 6,
    stroke: c.up ? '#34d399' : '#fb7185',
    strokeWidth: "1.5",
    opacity: "0.7",
    style: {
      animation: `flCandle .5s ${c.d}s cubic-bezier(.22,1,.36,1) both`,
      transformOrigin: `${i * 25 + 12}px ${c.y + c.h / 2}px`
    }
  }), /*#__PURE__*/React.createElement("rect", {
    x: i * 25 + 12 - c.w / 2,
    y: c.y,
    width: c.w,
    height: c.h,
    rx: "2",
    fill: c.up ? '#10b981' : '#f43f5e',
    opacity: "0.85",
    style: {
      animation: `flCandle .6s ${c.d}s cubic-bezier(.22,1,.36,1) both`,
      transformOrigin: `${i * 25 + 12}px ${c.y + c.h}px`
    }
  }))), /*#__PURE__*/React.createElement("polyline", {
    points: "12,68 37,55 62,58 87,42 112,38 137,44 162,22 187,16",
    fill: "none",
    stroke: "#f5d061",
    strokeWidth: "1.5",
    strokeDasharray: "300",
    strokeDashoffset: "300",
    opacity: "0.9",
    style: {
      animation: 'flDash 1.6s .3s ease-out forwards'
    }
  }), /*#__PURE__*/React.createElement("style", null, `@keyframes flDash { to { stroke-dashoffset: 0; } }`));
};

// ========== SPLASH SCREEN ==========
function SplashScreen({
  onComplete
}) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const timers = [setTimeout(() => setPhase(1), 200), setTimeout(() => setPhase(2), 700), setTimeout(() => setPhase(3), 1200), setTimeout(() => setPhase(4), 1800), setTimeout(() => setPhase(5), 2600), setTimeout(() => onComplete(), 3200)];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);
  return /*#__PURE__*/React.createElement("div", {
    className: `fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500 ${phase >= 5 ? 'opacity-0' : 'opacity-100'}`,
    style: {
      background: 'radial-gradient(ellipse at 50% 0%, #1a1207 0%, #070b14 55%, #04060d 100%)'
    }
  }, /*#__PURE__*/React.createElement(GlobalStyles, null), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 fl-grid-bg opacity-60"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-x-0 bottom-0 h-1/2 opacity-30"
  }, /*#__PURE__*/React.createElement(CandleChart, {
    className: "w-full h-full"
  })), /*#__PURE__*/React.createElement("div", {
    className: "absolute w-[420px] h-[420px] rounded-full blur-[120px]",
    style: {
      background: 'rgba(232,185,49,0.18)',
      animation: 'flGlowPulse 3.5s ease-in-out infinite'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative z-10 flex flex-col items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: `transition-all duration-700 ${phase >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl-float drop-shadow-2xl",
    // area extra per il filtro: su iOS Safari un elemento con drop-shadow ritaglia ciò che esce dai suoi bordi (corna durante il salto)
    style: { padding: '28px 16px 8px', margin: '-28px -16px -8px' }
  }, /*#__PURE__*/React.createElement(BullMascot, {
    size: 128,
    mood: phase >= 2 ? "celebrating" : "walking"
  }))), /*#__PURE__*/React.createElement("h1", {
    className: `mt-7 transition-all duration-500 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`
  }, React.createElement(FinLearnWordmark, { size: 60 })), /*#__PURE__*/React.createElement("div", {
    className: `flex items-center gap-2 mt-4 transition-all duration-500 ${phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "h-px w-8",
    style: {
      background: 'linear-gradient(90deg, transparent, #e8b931)'
    }
  }), /*#__PURE__*/React.createElement("p", {
    className: "fl-mono text-amber-200/70 text-[11px] tracking-[0.35em] uppercase"
  }, "Bull Market Your Knowledge"), /*#__PURE__*/React.createElement("span", {
    className: "h-px w-8",
    style: {
      background: 'linear-gradient(90deg, #e8b931, transparent)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: `relative w-72 h-[3px] mt-9 rounded-full overflow-hidden transition-all duration-500 ${phase >= 4 ? 'opacity-100' : 'opacity-0'}`,
    style: {
      background: 'rgba(232,185,49,0.12)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full rounded-full transition-all duration-1000 ease-out",
    style: {
      width: phase >= 4 ? '100%' : '0%',
      background: 'linear-gradient(90deg, #d97706, #f5d061, #fff3c4)'
    }
  })), /*#__PURE__*/React.createElement("p", {
    className: `fl-mono mt-6 text-amber-500/40 text-[10px] tracking-[0.25em] transition-opacity duration-500 ${phase >= 4 ? 'opacity-100' : 'opacity-0'}`
  }, "v13 \xB7 CFA LEVEL II EDITION")));
}

// ========== DEMO AUTH SYSTEM ==========
// Simula Firebase per testing - i dati sono salvati in localStorage
const DEMO_MODE = true;
const mockAuth = {
  currentUser: null,
  onAuthStateChanged: callback => {
    const saved = localStorage.getItem('finlearn_user');
    if (saved) {
      mockAuth.currentUser = JSON.parse(saved);
      setTimeout(() => callback(mockAuth.currentUser), 100);
    } else {
      setTimeout(() => callback(null), 100);
    }
    return () => {};
  },
  signInWithEmailAndPassword: async (email, password) => {
    await new Promise(r => setTimeout(r, 800));
    const users = JSON.parse(localStorage.getItem('finlearn_users') || '{}');
    const userKey = email.toLowerCase();
    if (!users[userKey]) throw {
      code: 'auth/user-not-found'
    };
    if (users[userKey].password !== password) throw {
      code: 'auth/wrong-password'
    };
    mockAuth.currentUser = users[userKey].user;
    localStorage.setItem('finlearn_user', JSON.stringify(mockAuth.currentUser));
    return {
      user: mockAuth.currentUser
    };
  },
  createUserWithEmailAndPassword: async (email, password, displayName) => {
    await new Promise(r => setTimeout(r, 800));
    const users = JSON.parse(localStorage.getItem('finlearn_users') || '{}');
    const userKey = email.toLowerCase();
    if (users[userKey]) throw {
      code: 'auth/email-already-in-use'
    };
    const uid = 'user_' + Date.now();
    const user = {
      uid,
      email,
      displayName,
      photoURL: null
    };
    users[userKey] = {
      user,
      password
    };
    localStorage.setItem('finlearn_users', JSON.stringify(users));
    mockAuth.currentUser = user;
    localStorage.setItem('finlearn_user', JSON.stringify(user));
    return {
      user
    };
  },
  signInWithGoogle: async () => {
    await new Promise(r => setTimeout(r, 1000));
    const uid = 'google_' + Date.now();
    const user = {
      uid,
      email: 'demo@gmail.com',
      displayName: 'Google User',
      photoURL: 'https://ui-avatars.com/api/?name=G&background=f59e0b&color=fff'
    };
    mockAuth.currentUser = user;
    localStorage.setItem('finlearn_user', JSON.stringify(user));
    return {
      user
    };
  },
  signOut: async () => {
    mockAuth.currentUser = null;
    localStorage.removeItem('finlearn_user');
  }
};
const mockDb = {
  getData: uid => {
    const data = localStorage.getItem('finlearn_data_' + uid);
    return data ? JSON.parse(data) : null;
  },
  setData: (uid, data) => {
    localStorage.setItem('finlearn_data_' + uid, JSON.stringify(data));
  }
};
const getErrorMessage = code => {
  const messages = {
    'auth/email-already-in-use': 'Email già registrata. Prova ad accedere.',
    'auth/user-not-found': 'Account non trovato. Registrati!',
    'auth/wrong-password': 'Password errata.',
    'auth/weak-password': 'Password troppo debole (min 6 caratteri).',
    'auth/invalid-email': 'Email non valida.'
  };
  return messages[code] || 'Errore. Riprova.';
};

// ========== LOADING SCREEN ==========
function LoadingScreen() {
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex items-center justify-center overflow-hidden",
    style: {
      background: 'radial-gradient(ellipse at 50% 30%, #15100a 0%, #070b14 60%, #04060d 100%)'
    }
  }, /*#__PURE__*/React.createElement(GlobalStyles, null), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 fl-grid-bg opacity-50"
  }), /*#__PURE__*/React.createElement("div", {
    className: "text-center relative z-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl-float inline-block"
  }, /*#__PURE__*/React.createElement(BullMascot, {
    size: 84,
    mood: "happy"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mt-3"
  }, React.createElement(FinLearnWordmark, { size: 34 })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center gap-1.5 mt-4"
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "w-1.5 h-1.5 rounded-full bg-amber-400",
    style: {
      animation: `flGlowPulse 1s ${i * 0.18}s ease-in-out infinite`
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "fl-mono text-amber-500/50 text-[10px] tracking-[0.25em] mt-4 uppercase"
  }, "Caricamento mercati\u2026")));
}

// ========== AUTH SCREEN ==========
function AuthScreen({
  onAuth
}) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email non valida.');
      return;
    }
    if (password.length < 6) {
      setError('Password min 6 caratteri.');
      return;
    }
    if (mode === 'register' && password !== confirmPassword) {
      setError('Le password non coincidono.');
      return;
    }
    if (mode === 'register' && displayName.trim().length < 2) {
      setError('Inserisci il tuo nome.');
      return;
    }
    setLoading(true);
    try {
      let result;
      if (mode === 'login') {
        result = await mockAuth.signInWithEmailAndPassword(email, password);
      } else {
        result = await mockAuth.createUserWithEmailAndPassword(email, password, displayName.trim());
      }
      // Load or create user data
      let userData = mockDb.getData(result.user.uid);
      if (!userData) {
        userData = {
          stats: {
            xp: 0,
            coins: 0,
            level: 1,
            streak: 0,
            quizzes: 0,
            correct: 0,
            cards: 0
          },
          completedLessons: [],
          activeLesson: 1,
          settings: {
            timerEnabled: false
          }
        };
        mockDb.setData(result.user.uid, userData);
      }
      onAuth(result.user, userData);
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };
  const handleGoogle = async () => {
    setLoading(true);
    try {
      const result = await mockAuth.signInWithGoogle();
      let userData = mockDb.getData(result.user.uid);
      if (!userData) {
        userData = {
          stats: {
            xp: 0,
            coins: 0,
            level: 1,
            streak: 0,
            quizzes: 0,
            correct: 0,
            cards: 0
          },
          completedLessons: [],
          activeLesson: 1,
          settings: {
            timerEnabled: false
          }
        };
        mockDb.setData(result.user.uid, userData);
      }
      onAuth(result.user, userData);
    } catch (err) {
      setError('Errore Google login');
    } finally {
      setLoading(false);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex items-center justify-center p-4 overflow-hidden relative",
    style: {
      background: 'radial-gradient(ellipse at 50% -10%, #18120a 0%, #070b14 55%, #04060d 100%)'
    }
  }, /*#__PURE__*/React.createElement(GlobalStyles, null), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 fl-grid-bg opacity-40"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute -top-20 left-1/2 -translate-x-1/2 w-[480px] h-[480px] rounded-full blur-[130px]",
    style: {
      background: 'rgba(232,185,49,0.12)',
      animation: 'flGlowPulse 5s ease-in-out infinite'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-x-0 bottom-0 h-2/5 opacity-[0.12] pointer-events-none"
  }, /*#__PURE__*/React.createElement(CandleChart, {
    className: "w-full h-full"
  })), /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-md relative z-10 fl-fade-up"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center mb-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl-float inline-block mb-1"
  }, /*#__PURE__*/React.createElement(BullMascot, {
    size: 80,
    mood: "happy"
  })), /*#__PURE__*/React.createElement("h1", {
    className: ""
  }, React.createElement(FinLearnWordmark, { size: 46 })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center gap-2 mt-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "h-px w-6",
    style: {
      background: 'linear-gradient(90deg, transparent, #e8b931)'
    }
  }), /*#__PURE__*/React.createElement("p", {
    className: "fl-mono text-amber-200/60 text-[10px] tracking-[0.3em] uppercase"
  }, "Bull Market Your Knowledge"), /*#__PURE__*/React.createElement("span", {
    className: "h-px w-6",
    style: {
      background: 'linear-gradient(90deg, #e8b931, transparent)'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "fl-glass rounded-3xl shadow-2xl p-6",
    style: {
      boxShadow: '0 30px 70px -30px rgba(0,0,0,.8)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleGoogle,
    disabled: loading,
    className: "w-full flex items-center justify-center gap-3 py-3 px-4 bg-white rounded-2xl font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50 fl-card-hover"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "#4285F4",
    d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#34A853",
    d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#FBBC05",
    d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#EA4335",
    d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
  })), "Continua con Google"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4 my-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1 h-px",
    style: {
      background: 'linear-gradient(90deg, transparent, rgba(148,163,184,.3))'
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-slate-500 text-xs fl-mono tracking-widest uppercase"
  }, "oppure"), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 h-px",
    style: {
      background: 'linear-gradient(90deg, rgba(148,163,184,.3), transparent)'
    }
  })), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-4"
  }, mode === 'register' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-semibold text-slate-400 mb-1.5 tracking-wide uppercase"
  }, "Nome"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: displayName,
    onChange: e => setDisplayName(e.target.value),
    placeholder: "Come ti chiami?",
    className: "w-full px-4 py-3 rounded-2xl focus:outline-none text-white placeholder-slate-600 transition",
    style: {
      background: 'rgba(5,8,16,0.5)',
      border: '1px solid rgba(232,185,49,0.16)'
    },
    onFocus: e => e.target.style.borderColor = '#e8b931',
    onBlur: e => e.target.style.borderColor = 'rgba(232,185,49,0.16)'
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-semibold text-slate-400 mb-1.5 tracking-wide uppercase"
  }, "Email"), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement(Mail, {
    size: 18,
    className: "absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/50"
  }), /*#__PURE__*/React.createElement("input", {
    type: "email",
    value: email,
    onChange: e => setEmail(e.target.value),
    placeholder: "la.tua@email.com",
    className: "w-full pl-11 pr-4 py-3 rounded-2xl focus:outline-none text-white placeholder-slate-600 transition",
    style: {
      background: 'rgba(5,8,16,0.5)',
      border: '1px solid rgba(232,185,49,0.16)'
    },
    onFocus: e => e.target.style.borderColor = '#e8b931',
    onBlur: e => e.target.style.borderColor = 'rgba(232,185,49,0.16)'
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-semibold text-slate-400 mb-1.5 tracking-wide uppercase"
  }, "Password"), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement(Lock, {
    size: 18,
    className: "absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/50"
  }), /*#__PURE__*/React.createElement("input", {
    type: showPassword ? 'text' : 'password',
    value: password,
    onChange: e => setPassword(e.target.value),
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    className: "w-full pl-11 pr-12 py-3 rounded-2xl focus:outline-none text-white placeholder-slate-600 transition",
    style: {
      background: 'rgba(5,8,16,0.5)',
      border: '1px solid rgba(232,185,49,0.16)'
    },
    onFocus: e => e.target.style.borderColor = '#e8b931',
    onBlur: e => e.target.style.borderColor = 'rgba(232,185,49,0.16)'
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setShowPassword(!showPassword),
    className: "absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400 transition"
  }, showPassword ? /*#__PURE__*/React.createElement(EyeOff, {
    size: 18
  }) : /*#__PURE__*/React.createElement(Eye, {
    size: 18
  })))), mode === 'register' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-semibold text-slate-400 mb-1.5 tracking-wide uppercase"
  }, "Conferma Password"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    value: confirmPassword,
    onChange: e => setConfirmPassword(e.target.value),
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    className: "w-full px-4 py-3 rounded-2xl focus:outline-none text-white placeholder-slate-600 transition",
    style: {
      background: 'rgba(5,8,16,0.5)',
      border: '1px solid rgba(232,185,49,0.16)'
    },
    onFocus: e => e.target.style.borderColor = '#e8b931',
    onBlur: e => e.target.style.borderColor = 'rgba(232,185,49,0.16)'
  })), error && /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 p-3 bg-rose-500/15 border border-rose-500/30 rounded-2xl text-rose-400 text-sm"
  }, /*#__PURE__*/React.createElement(AlertCircle, {
    size: 18
  }), error), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: loading,
    className: "w-full py-3.5 text-white font-bold rounded-2xl transition disabled:opacity-50 fl-card-hover fl-sweep",
    style: {
      background: 'linear-gradient(110deg, #d97706, #f59e0b 50%, #d97706)',
      boxShadow: '0 12px 30px -10px rgba(245,158,11,.5)'
    }
  }, loading ? 'Caricamento…' : mode === 'login' ? 'Accedi' : 'Registrati')), /*#__PURE__*/React.createElement("div", {
    className: "text-center mt-6"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-slate-500 text-sm"
  }, mode === 'login' ? 'Non hai un account? ' : 'Hai già un account? '), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setMode(mode === 'login' ? 'register' : 'login');
      setError(null);
    },
    className: "text-amber-400 font-semibold hover:text-amber-300 transition"
  }, mode === 'login' ? 'Registrati' : 'Accedi'))), DEMO_MODE && /*#__PURE__*/React.createElement("div", {
    className: "text-center mt-4 text-slate-600 text-xs fl-mono tracking-wide"
  }, "DEMO MODE \xB7 dati salvati localmente")));
}


// ========== TESTO RICCO PER LE LEZIONI: formule LaTeX ($$...$$ e \(...\)), tabelle markdown, **grassetto** ==========
let flKatexPromise = null;
function ensureKatex() {
  if (typeof window === 'undefined') return Promise.reject();
  if (window.katex) return Promise.resolve();
  if (flKatexPromise) return flKatexPromise;
  flKatexPromise = new Promise((resolve, reject) => {
    const sc = document.createElement('script');
    sc.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
    sc.onload = () => resolve();
    sc.onerror = () => { flKatexPromise = null; reject(); };
    document.head.appendChild(sc);
  });
  return flKatexPromise;
}
function Tex({ f, display = false }) {
  const ref = useRef(null);
  useEffect(() => {
    let alive = true;
    if (ref.current) ref.current.textContent = f;
    ensureKatex().then(() => {
      if (!alive || !ref.current) return;
      try { window.katex.render(f, ref.current, { displayMode: display, throwOnError: false, output: 'mathml' }); }
      catch (e) { ref.current.textContent = f; }
    }).catch(() => {});
    return () => { alive = false; };
  }, [f, display]);
  return React.createElement(display ? 'div' : 'span', { ref, className: display ? 'fl-tex-d' : 'fl-tex-i' });
}
function flInline(text, keyBase) {
  const parts = String(text).split(/(\\\(.+?\\\)|\*\*.+?\*\*)/g);
  return parts.filter(x => x !== '').map((x, i) => {
    if (x.startsWith('\\(') && x.endsWith('\\)')) return React.createElement(Tex, { key: keyBase + i, f: x.slice(2, -2) });
    if (x.startsWith('**') && x.endsWith('**') && x.length > 4) return React.createElement('strong', { key: keyBase + i, className: 'fl-strong' }, flInline(x.slice(2, -2), keyBase + i + '-'));
    return React.createElement(React.Fragment, { key: keyBase + i }, x);
  });
}
function RichText({ text, className = '' }) {
  const lines = String(text || '').split('\n');
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const t = lines[i].trim();
    if (t.startsWith('$$')) {
      let buf = t;
      while (!(buf.length > 3 && buf.endsWith('$$')) && i + 1 < lines.length) { i++; buf += ' ' + lines[i].trim(); }
      blocks.push({ k: 'math', v: buf.slice(2, -2) }); i++; continue;
    }
    if (t.startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) { rows.push(lines[i].trim()); i++; }
      blocks.push({ k: 'table', rows }); continue;
    }
    if (t === '') { blocks.push({ k: 'gap' }); i++; continue; }
    blocks.push({ k: 'line', v: lines[i] }); i++;
  }
  return React.createElement('div', { className: 'fl-rich ' + className }, blocks.map((b, bi) => {
    if (b.k === 'gap') return React.createElement('div', { key: bi, className: 'h-2' });
    if (b.k === 'math') return React.createElement(Tex, { key: bi, f: b.v, display: true });
    if (b.k === 'table') {
      const cells = r => r.replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
      const body = b.rows.filter(r => !/^\|\s*:?-{2,}/.test(r));
      const [head, ...rest] = body;
      return React.createElement('div', { key: bi, className: 'fl-table-wrap' }, React.createElement('table', { className: 'fl-table' },
        React.createElement('thead', null, React.createElement('tr', null, cells(head).map((c, ci) => React.createElement('th', { key: ci }, flInline(c, bi + '-h' + ci))))),
        React.createElement('tbody', null, rest.map((r, ri) => React.createElement('tr', { key: ri }, cells(r).map((c, ci) => React.createElement('td', { key: ci }, flInline(c, bi + '-' + ri + '-' + ci))))))));
    }
    const bullet = /^\s*(•|\d+\.)\s/.test(b.v);
    return React.createElement('div', { key: bi, className: bullet ? 'fl-li' : 'fl-p' }, flInline(b.v, bi + '-'));
  }));
}
// Domanda d'esame interattiva a fine LOS
function LosQuestion({ q }) {
  const [sel, setSel] = useState(null);
  const answered = sel !== null;
  const ok = sel === q.ans;
  const L = ['A', 'B', 'C'];
  const card = { background: 'var(--fl-s1, #ffffff)', border: '1px solid var(--fl-line, #e2e8f0)', color: 'var(--fl-fg, #0f172a)' };
  return React.createElement('div', { className: 'rounded-2xl p-4 mb-6', style: card },
    React.createElement('div', { className: 'flex items-center justify-between gap-2 mb-3' },
      React.createElement('h4', { className: 'font-black text-amber-500 flex items-center gap-2' }, React.createElement(Brain, { size: 18 }), "Domanda d'esame"),
      React.createElement('span', { className: 'text-[11px] font-bold px-2 py-1 rounded-full', style: { background: 'rgba(255,176,32,.14)', color: '#FFB020' } }, 'in inglese, come all’esame')),
    React.createElement('div', { className: 'text-sm font-semibold mb-3', lang: 'en' }, React.createElement(RichText, { text: q.q })),
    React.createElement('div', { className: 'space-y-2' }, q.options.map((o, i) => {
      let st = { background: 'var(--fl-s2, #f8fafc)', border: '2px solid var(--fl-line, #e2e8f0)' };
      if (answered && i === q.ans) st = { background: 'rgba(34,197,94,.14)', border: '2px solid #22C55E' };
      else if (answered && i === sel) st = { background: 'rgba(255,90,95,.12)', border: '2px solid #FF5A5F' };
      return React.createElement('button', { key: i, disabled: answered, onClick: (e) => { setSel(i); if (i === q.ans) flFx.correct(e.currentTarget); else flFx.wrong(e.currentTarget); }, className: 'w-full text-left rounded-xl p-3 flex items-start gap-3 transition', style: st, lang: 'en' },
        React.createElement('span', { className: 'w-7 h-7 rounded-lg flex items-center justify-center font-black shrink-0', style: { background: answered && i === q.ans ? '#22C55E' : answered && i === sel ? '#FF5A5F' : 'rgba(255,176,32,.16)', color: answered && (i === q.ans || i === sel) ? '#fff' : '#FFB020' } }, L[i]),
        React.createElement('span', { className: 'text-sm pt-0.5' }, o));
    })),
    answered && React.createElement('div', { className: 'mt-4 rounded-xl p-3 flex items-start gap-3', style: { background: ok ? 'rgba(34,197,94,.1)' : 'rgba(255,176,32,.1)', border: `1px solid ${ok ? 'rgba(34,197,94,.35)' : 'rgba(255,176,32,.35)'}` } },
      React.createElement(BullMascot, { size: 46, mood: ok ? 'correct' : 'wrong' }),
      React.createElement('div', { className: 'flex-1 min-w-0' },
        React.createElement('p', { className: 'font-black text-sm mb-1', style: { color: ok ? '#22C55E' : '#FFB020' } }, ok ? 'Esatto!' : `Non proprio: la risposta giusta è ${L[q.ans]}`),
        React.createElement(RichText, { text: q.exp, className: 'text-sm' }),
        React.createElement('button', { onClick: () => setSel(null), className: 'mt-2 text-xs font-bold text-amber-500 flex items-center gap-1' }, React.createElement(RotateCcw, { size: 12 }), 'Riprova'))));
}

// ========== MATH FORMULA ==========
function MathFormula({
  formula,
  display = false
}) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && window.katex) {
      try {
        window.katex.render(formula, ref.current, {
          displayMode: display,
          throwOnError: false
        });
      } catch (e) {
        if (ref.current) ref.current.textContent = formula;
      }
    }
  }, [formula, display]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    className: display ? "block my-2" : "inline"
  });
}

// ========== EQUITY VALUATION · READING 22-27 (dati: teoria LOS-completa, 180 flashcard, 65 quiz) ==========
const EQ_READINGS = [/* ================================================================== R22 */
{
  n: 22,
  key: 'r22',
  title: 'Equity Valuation: Applications and Processes',
  sub: 'Valore intrinseco, misure di valore, processo e modelli',
  weight: '11–14%',
  theory: [{
    code: '22(a)',
    title: 'Valore intrinseco e fonti del mispricing',
    imp: 'ALTA',
    blocks: [{
      p: "La valutazione stima il valore di un asset su tre basi: variabili sui rendimenti futuri (valutazione assoluta), confronto con asset simili (relativa), o stime di liquidazione immediata."
    }, {
      h: 'Valore intrinseco & mispricing percepito',
      p: "Il valore intrinseco è il valore stimato da un investitore con comprensione completa dell'asset. Gli investitori operano perché ritengono che differisca dal prezzo: è il mispricing percepito, un'opportunità di profitto quando il prezzo converge al valore intrinseco. L'investitore attivo cerca un rendimento aggiustato per il rischio positivo (alfa o abnormal return)."
    }, {
      f: 'V_E - P = (V - P) + (V_E - V)',
      cap: 'Mispricing percepito = mispricing reale (errore di mercato) + errore di valutazione (errore dell\u2019analista). V_E = valore stimato · P = prezzo · V = valore intrinseco reale.'
    }]
  }, {
    code: '22(b)',
    title: 'Going concern vs. valore di liquidazione',
    imp: 'MEDIA',
    blocks: [{
      p: "L'ipotesi di continuità (going concern) assume che l'azienda continui a operare: il valore corrispondente è il going concern value. Il valore di liquidazione è il valore se l'azienda cessasse e gli asset fossero venduti singolarmente — appropriato in difficoltà finanziaria."
    }, {
      p: "Di norma going concern > liquidazione, perché incorpora competenze manageriali e sinergie. Eccezione: aziende in perdita continuativa. I beni non deperibili, vendibili in modo ordinato, hanno un orderly liquidation value più alto."
    }]
  }, {
    code: '22(c)',
    title: 'Definizioni di valore',
    imp: 'ALTA',
    blocks: [{
      h: 'Fair value',
      p: "Prezzo in una transazione ordinata tra partecipanti al mercato. È il valore usato nel financial reporting."
    }, {
      h: 'Fair market value',
      p: "Valore tra compratore e venditore non obbligati, entrambi consapevoli. Nel lungo periodo i prezzi tendono al fair value."
    }, {
      h: 'Investment value',
      p: "Valore per uno specifico investitore, più alto grazie alle sinergie. È la misura più adatta per le acquisizioni strategiche, mentre il valore intrinseco è il concetto rilevante per le azioni quotate."
    }]
  }, {
    code: '22(d)',
    title: 'Applicazioni della valutazione azionaria',
    imp: 'MEDIA',
    blocks: [{
      list: ['Selezione titoli (sotto/sopra/correttamente valutati).', 'Dedurre le aspettative di mercato implicite nel prezzo.', 'Valutare eventi societari: fusioni, acquisizioni, divestiture, spin-off.', 'Fornire fairness opinion.', 'Valutare strategie e modelli di business.', 'Comunicare con analisti e azionisti.', 'Valutare aziende private (transazionale / fiscale).', 'Compensi azionari (es. restricted stock grants).']
    }, {
      h: 'Eventi societari',
      p: "Merger: combinazione di due aziende. Acquisizione: l'acquirer compra le azioni del target. Divestiture: cessione di asset/business unit. Spin-off: una divisione diventa entità separata, con azioni emesse pro-quota agli azionisti attuali."
    }]
  }, {
    code: '22(e)',
    title: 'Il processo di valutazione',
    imp: 'ALTA',
    blocks: [{
      h: 'I 5 passi',
      list: ['Comprendere il business.', "Prevedere la performance dell'azienda.", 'Selezionare il modello appropriato.', 'Usare le previsioni nella valutazione.', 'Applicare le conclusioni.']
    }, {
      h: 'Le 5 forze di Porter',
      p: "Attrattività del settore: intensità della rivalità, nuovi entranti (barriere), sostituti, potere dei fornitori, potere degli acquirenti."
    }, {
      h: 'Strategie competitive',
      p: "Tre vie per la sovra-performance: cost leadership, differenziazione (prodotti unici, margini più alti), focus (vantaggio entro un segmento)."
    }, {
      h: 'Qualità degli utili',
      p: "Quality of earnings: quota di reddito dalle attività core. Scomporre l'utile in accrual (competenza) e cash: alti accrual = qualità inferiore e ROA futuro più basso. Evitare di estrapolare la performance passata: tende a convergere verso la crescita dell'economia."
    }]
  }, {
    code: '22(f)',
    title: 'Modelli di valutazione',
    imp: 'ALTA',
    blocks: [{
      h: 'Modelli assoluti',
      p: "Stimano il valore intrinseco. Includono i modelli del valore attuale (DCF) e quelli basati sugli asset. I flussi di cassa DCF: dividendi, FCFE, FCFF, residual income."
    }, {
      h: 'Modelli relativi (method of comparables)',
      p: "Valore stimato rispetto a un comparabile usando multipli di prezzo (P/E, P/B, P/CF) o enterprise multiples. Il P/E è il più usato: un P/E più basso del comparabile = relativamente sottovalutato, assumendo che il comparabile sia correttamente prezzato."
    }]
  }, {
    code: '22(g)',
    title: 'Sum-of-the-parts & conglomerate discount',
    imp: 'MEDIA',
    blocks: [{
      p: "La sum-of-the-parts valuta un'azienda aggregando il valore dei segmenti come indipendenti: il risultato è il breakup value (private market value). Adatta a segmenti diversi e non correlati."
    }, {
      p: "Lo sconto di conglomerato si applica per: inefficienza nell'allocazione del capitale tra divisioni; fattori endogeni; errori di misurazione. Un breakup value > going concern value può spingere verso uno spin-off."
    }]
  }, {
    code: '22(h)',
    title: 'Scelta del modello',
    imp: 'ALTA',
    blocks: [{
      h: 'Le 3 caratteristiche',
      list: ["Coerente con le caratteristiche dell'azienda (es. asset-based per risorse naturali).", 'Appropriato data disponibilità e qualità dei dati (no DDM senza dividendi; no multipli con utili negativi).', 'Coerente con lo scopo (chi cerca il controllo preferisce un modello FCF).']
    }, {
      p: "Gli analisti usano spesso più modelli insieme, assegnando pesi diversi in base alla loro appropriatezza."
    }]
  }],
  cards: [{
    los: '22a',
    q: "Cos'è il valore intrinseco?",
    a: "Il valore di un asset stimato da un investitore con comprensione ipoteticamente completa delle sue caratteristiche d'investimento — distinto da prezzo di mercato o valore contabile."
  }, {
    los: '22a',
    q: 'Scomponi il mispricing percepito.',
    a: "Mispricing percepito (V_E − P) = mispricing reale (V − P, errore di mercato) + errore di valutazione (V_E − V, errore dell'analista)."
  }, {
    los: '22a',
    q: "Cos'è l'alfa (abnormal return)?",
    a: "Il rendimento aggiustato per il rischio positivo che l'investitore attivo cerca sfruttando il mispricing percepito."
  }, {
    los: '22a',
    q: 'Cosa implica la teoria dei mercati efficienti per la valutazione?',
    a: "Valore intrinseco = prezzo di mercato: nessuno sosterrebbe i costi dell'analisi senza attendersi rendimenti più elevati."
  }, {
    los: '22b',
    q: 'Going concern vs liquidation value: quale è di norma più alto?',
    a: "Il going concern value, perché incorpora competenze manageriali e sinergie tra asset. Eccezione: aziende in perdita continuativa."
  }, {
    los: '22b',
    q: "Cos'è l'orderly liquidation value?",
    a: "Il valore di liquidazione ottenibile quando i beni (non deperibili) possono essere venduti in modo ordinato, con più tempo a disposizione: è più alto di una vendita forzata."
  }, {
    los: '22c',
    q: 'Definisci il fair value.',
    a: "Il prezzo che si riceverebbe vendendo un asset (o pagherebbe trasferendo una passività) in una transazione ordinata tra partecipanti al mercato. Usato nel financial reporting."
  }, {
    los: '22c',
    q: 'Quale misura per un acquirente strategico?',
    a: "L'investment value, perché incorpora le sinergie potenziali specifiche per quell'acquirente."
  }, {
    los: '22d',
    q: 'Divestiture vs spin-off?',
    a: "Divestiture = cessione di asset/business unit. Spin-off = una divisione diventa entità separata, con azioni emesse pro-quota agli azionisti attuali."
  }, {
    los: '22e',
    q: 'I 5 passi del processo di valutazione?',
    a: "1) Comprendere il business; 2) prevedere la performance; 3) selezionare il modello; 4) usare le previsioni nella valutazione; 5) applicare le conclusioni."
  }, {
    los: '22e',
    q: 'Le 5 forze di Porter?',
    a: "Intensità della rivalità, nuovi entranti (barriere all'ingresso), sostituti, potere dei fornitori, potere degli acquirenti."
  }, {
    los: '22e',
    q: "Cosa indica un'alta proporzione di accrual?",
    a: "Qualità degli utili inferiore: la componente cash è più persistente, e l'azienda tende ad avere un ROA futuro più basso."
  }, {
    los: '22f',
    q: 'I 4 flussi di cassa dei modelli del valore attuale?',
    a: "Dividendi, FCFE, FCFF e residual income."
  }, {
    los: '22g',
    q: "Cos'è il breakup value e quando segnala un'azione?",
    a: "Il valore da sum-of-the-parts (private market value). Se > going concern value, può spingere verso divestiture o spin-off."
  }, {
    los: '22h',
    q: 'I 3 criteri per scegliere un modello?',
    a: "1) Coerenza con le caratteristiche dell'azienda; 2) appropriatezza rispetto a disponibilità/qualità dei dati; 3) coerenza con lo scopo della valutazione."
  }, {
    los: '22a',
    q: 'Le tre basi su cui può poggiare una valutazione?',
    a: "1) Variabili legate ai rendimenti futuri (valutazione assoluta); 2) confronto con asset simili (valutazione relativa); 3) stime di liquidazione immediata."
  }, {
    los: '22a',
    q: 'Perché nei mercati efficienti nessuno farebbe analisi?',
    a: "Se valore intrinseco = prezzo, i costi dell'analisi non sarebbero compensati da rendimenti più elevati: l'analisi attiva ha senso solo se si attende un abnormal return."
  }, {
    los: '22b',
    q: 'Quando è appropriato usare il liquidation value?',
    a: "Per aziende in difficoltà finanziaria o in perdita continuativa, dove la cessazione delle operazioni e la vendita separata degli asset è lo scenario rilevante."
  }, {
    los: '22c',
    q: 'Fair value vs fair market value?',
    a: "Il fair value è il prezzo in una transazione ordinata tra partecipanti al mercato (financial reporting). Il fair market value è tra compratore e venditore non obbligati e pienamente informati — concetto usato spesso in ambito fiscale."
  }, {
    los: '22d',
    q: "Cos'è una fairness opinion?",
    a: "Un parere di congruità fornito da un terzo indipendente sul prezzo di una transazione (es. una fusione), basato su una valutazione."
  }, {
    los: '22d',
    q: "Cosa significa 'dedurre le aspettative di mercato'?",
    a: "Usare il prezzo corrente per ricavare le assunzioni implicite del mercato sui fondamentali (es. la crescita attesa), e confrontarle con le proprie stime."
  }, {
    los: '22e',
    q: 'A cosa serve la sensitivity analysis nel processo di valutazione?',
    a: "A determinare come una variazione di un input (es. crescita, margini, tasso) influisce sull'output della valutazione, sviluppando scenari appropriati."
  }, {
    los: '22e',
    q: 'Come ciascuna forza di Porter migliora la profittabilità?',
    a: "Bassa rivalità (pochi player, settore in crescita); alte barriere all'ingresso; pochi sostituti o switching cost elevati; molti fornitori (basso supplier power); molti consumatori (basso buyer power)."
  }, {
    los: '22e',
    q: 'Cost leadership vs differenziazione: effetti su costi e margini?',
    a: "Cost leadership: costi di produzione più bassi a prodotti comparabili, prezzi vicini alla media. Differenziazione: spese di vendita più alte ma margini lordi più alti grazie al premio di prezzo."
  }, {
    los: '22e',
    q: 'Top-down vs bottom-up forecasting?',
    a: "Top-down: dalle previsioni macro/di settore si scende all'azienda. Bottom-up: si parte dai dati a livello di singola azienda/segmento e si aggrega."
  }, {
    los: '22e',
    q: 'Quattro red flag di qualità degli utili?',
    a: "Ricavi riconosciuti troppo presto (es. bill & hold); riserve troppo alte/basse (crediti dubbi, ristrutturazioni); finanziamenti fuori bilancio (leasing, cartolarizzazioni); scoperto bancario classificato come flusso operativo."
  }, {
    los: '22f',
    q: 'Modelli del valore attuale vs asset-based?',
    a: "I present value (DCF) scontano i flussi futuri attesi; gli asset-based stimano il valore come somma dei valori delle attività al netto delle passività."
  }, {
    los: '22f',
    q: "L'assunzione chiave del method of comparables?",
    a: "Che il comparabile/benchmark sia correttamente prezzato: se il peer è mal prezzato, il giudizio relativo eredita quell'errore."
  }, {
    los: '22g',
    q: 'Quando la sum-of-the-parts è appropriata?',
    a: "Per aziende con segmenti diversi e non correlati, e per stimare il valore sbloccabile da spin-off, split-off o equity carve-out."
  }, {
    los: '22h',
    q: 'Perché chi cerca il controllo preferisce un modello FCF?',
    a: "Perché chi acquisisce il controllo può cambiare la politica dei dividendi: conta il free cash flow generabile, non i dividendi correnti."
  }],
  quiz: [{
    q: "Il valore di un asset data una comprensione ipoteticamente completa è con più probabilità:",
    opts: ['Fair market value', 'Valore intrinseco', 'Investment value'],
    correct: 1,
    exp: "Il valore intrinseco si basa su una comprensione completa dell'asset. Il fair market value è il prezzo tra parti non obbligate; l'investment value considera le sinergie."
  }, {
    q: "La misura di valore più bassa è con più probabilità:",
    opts: ['Investment value', 'Liquidation value', 'Going concern value'],
    correct: 1,
    exp: "Il liquidation value è il più basso: valore se l'azienda cessasse e vendesse gli asset singolarmente."
  }, {
    q: "La misura più appropriata per un acquirente strategico è:",
    opts: ['Valore intrinseco', 'Investment value', 'Fair market value'],
    correct: 1,
    exp: "L'investment value tiene conto delle sinergie specifiche per l'acquirente."
  }, {
    q: "Quale è con minore probabilità un'applicazione della valutazione azionaria?",
    opts: ['Valutare strategie di business', 'Selezione titoli', 'Una fusione'],
    correct: 2,
    exp: "Una fusione in sé non lo è: lo è valutare l'impatto di eventi come le fusioni."
  }, {
    q: "Quale è una delle cinque forze di Porter?",
    opts: ['Potere dei fornitori', 'Approccio top-down', 'Cost leadership'],
    correct: 0,
    exp: "Il potere dei fornitori è una delle 5 forze. Top-down è un metodo di previsione; cost leadership è una strategia competitiva."
  }, {
    q: "Un'azienda con alti accrual rispetto alla componente cash ha con più probabilità:",
    opts: ['Utili di qualità superiore', 'ROA futuro più basso', 'ROA futuro più alto'],
    correct: 1,
    exp: "Alti accrual = qualità degli utili inferiore: la componente cash è più persistente, il ROA futuro tende a essere più basso."
  }, {
    q: "La separazione di una divisione in una nuova entità con azioni emesse pro-quota agli azionisti è:",
    opts: ['Una divestiture', 'Uno spin-off', "Un'acquisizione"],
    correct: 1,
    exp: "È uno spin-off. La divestiture è la cessione di asset/business unit a terzi."
  }, {
    q: "Quale flusso di cassa NON appartiene ai modelli del valore attuale?",
    opts: ['Residual income', 'FCFF', 'Enterprise multiple'],
    correct: 2,
    exp: "L'enterprise multiple appartiene alla valutazione relativa, non ai modelli del valore attuale."
  }, {
    q: "Ragione più probabile per uno sconto di conglomerato:",
    opts: ["Inefficienza nell'allocazione del capitale", 'Sum-of-the-parts valuation', 'Breakup value'],
    correct: 0,
    exp: "L'inefficienza nell'allocazione del capitale tra divisioni è una delle cause. La SOTP è il metodo; il breakup value è il risultato."
  }, {
    q: "Criterio meno probabile per scegliere un approccio di valutazione:",
    opts: ["Coerenza con le caratteristiche dell'azienda", 'Disponibilità e qualità dei dati', 'Modello di valutazione relativa'],
    correct: 2,
    exp: "Il modello relativo è esso stesso un approccio, non un criterio di scelta."
  }]
}, /* ================================================================== R23 */
{
  n: 23,
  key: 'r23',
  title: 'Discounted Dividend Valuation',
  sub: 'DDM, Gordon, PVGO, P/E giustificati, multistadio, SGR',
  weight: '11–14%',
  theory: [{
    code: '23(a)',
    title: 'DCF: dividendi, FCF, residual income',
    imp: 'ALTA',
    blocks: [{
      p: "Il valore intrinseco è il valore attuale dei flussi di cassa futuri attesi. I quattro passi: definire il flusso di cassa, prevederlo, scegliere la metodologia per il tasso, stimarlo."
    }, {
      f: 'V_0 = \\sum_{t=1}^{n} \\dfrac{CF_t}{(1+r)^t}',
      cap: 'Valore = valore attuale dei flussi di cassa futuri. r = tasso di rendimento richiesto.'
    }, {
      h: 'Quando usare il DDM',
      p: "L'azienda paga dividendi, c'è relazione stabile tra dividendi e profittabilità, e l'investitore assume una prospettiva di non-controllo (minoranza). Il FCF è preferito in prospettiva di controllo; il residual income quando i dividendi sono assenti o i FCF attesi sono negativi."
    }]
  }, {
    code: '23(b)',
    title: 'DDM single e multiperiodo',
    imp: 'ALTA',
    blocks: [{
      f: 'V_0 = \\dfrac{D_1 + P_1}{(1+r)}',
      cap: 'Periodo singolo: PV del dividendo + PV del prezzo di vendita.'
    }, {
      f: 'V_0 = \\sum_{t=1}^{n} \\dfrac{D_t}{(1+r)^t} + \\dfrac{P_n}{(1+r)^n}',
      cap: 'Periodo multiplo (n periodi).'
    }, {
      f: 'V_0 = \\sum_{t=1}^{\\infty} \\dfrac{D_t}{(1+r)^t}',
      cap: 'Orizzonte indefinito: PV di tutti i dividendi futuri.'
    }]
  }, {
    code: '23(c)',
    title: 'Gordon Growth Model',
    imp: 'ALTA',
    blocks: [{
      p: "Assume dividendi in crescita indefinita a tasso costante g, con r > g. r è detto capitalization rate."
    }, {
      f: 'V_0 = \\dfrac{D_0(1+g)}{r-g} = \\dfrac{D_1}{r-g}',
      cap: 'Es.: D₀ = $5, g = 4%, r = 8% → V₀ = 5,20/0,04 = $130.'
    }]
  }, {
    code: '23(d)',
    title: 'Azione privilegiata perpetua a tasso fisso',
    imp: 'MEDIA',
    blocks: [{
      f: 'V_0 = \\dfrac{D_p}{r_p}',
      cap: 'g = 0. Es.: par $100, dividendo 6%, r = 8% → 6/0,08 = $75.'
    }]
  }, {
    code: '23(e)',
    title: 'Tasso di crescita implicito',
    imp: 'MEDIA',
    blocks: [{
      p: "Dato prezzo, dividendo e r, si deduce g invertendo il Gordon model, per valutarne la plausibilità rispetto alle attese."
    }, {
      f: 'P = \\dfrac{D_0(1+g)}{r-g} \\;\\Rightarrow\\; g',
      cap: 'Es.: D₀ = $3, r = 11%, P = $45 → g ≈ 4,06%.'
    }]
  }, {
    code: '23(f)',
    title: 'PVGO — opportunità di crescita',
    imp: 'ALTA',
    blocks: [{
      f: 'V_0 = \\dfrac{E_1}{r} + PVGO',
      cap: 'Valore = azienda no-growth (E₁/r) + valore attuale delle opportunità di crescita.'
    }, {
      f: '\\dfrac{P_0}{E_1} = \\dfrac{1}{r} + \\dfrac{PVGO}{E_1}',
      cap: 'Il P/E si scompone in componente no-growth (1/r) + componente crescita.'
    }, {
      p: "La crescita aumenta la ricchezza solo se gli utili reinvestiti rendono più del costo opportunità dei fondi. Le aziende no-growth dovrebbero distribuire tutto in dividendi."
    }]
  }, {
    code: '23(g)',
    title: 'P/E giustificati (trailing & leading)',
    imp: 'ALTA',
    blocks: [{
      f: '\\dfrac{P_0}{E_0} = \\dfrac{(1-b)(1+g)}{r-g}',
      cap: 'P/E trailing giustificato. b = retention ratio; (1−b) = payout.'
    }, {
      f: '\\dfrac{P_0}{E_1} = \\dfrac{1-b}{r-g}',
      cap: 'P/E leading giustificato.'
    }]
  }, {
    code: '23(h)',
    title: 'Forza e limiti del Gordon model',
    imp: 'MEDIA',
    blocks: [{
      h: 'Forza',
      list: ['Semplice da implementare.', 'Adatto ad aziende mature che pagano dividendi.', 'Utile per giudicare un intero mercato e per lo stadio finale dei modelli multistadio.']
    }, {
      h: 'Limiti',
      list: ['Molto sensibile a g e r (specie quando r−g è piccolo).', 'Non adatto da solo ad aziende in alta crescita.', 'Inapplicabile senza dividendi.']
    }]
  }, {
    code: '23(i)',
    title: 'Le fasi di crescita',
    imp: 'ALTA',
    blocks: [{
      h: 'Growth phase',
      p: "Espansione rapida, margini alti, alta crescita dell'EPS, FCF negativi per i forti investimenti, payout basso o nullo. Crescita supernormale."
    }, {
      h: 'Transition phase',
      p: "La crescita rallenta per concorrenza e saturazione, declina verso quella dell'economia. I FCF diventano positivi e il payout aumenta."
    }, {
      h: 'Mature phase',
      p: "Il ROE converge verso r; payout, crescita e ROE si stabilizzano a livelli sostenibili. Qui il Gordon model è appropriato. Il tasso è il mature growth rate."
    }]
  }, {
    code: '23(j-k)',
    title: 'Modelli multistadio & terminal value',
    imp: 'ALTA',
    blocks: [{
      f: 'V_0 = \\sum_{t=1}^{n}\\dfrac{D_0(1+g_S)^t}{(1+r)^t} + \\dfrac{D_0(1+g_S)^n(1+g_L)}{(1+r)^n (r-g_L)}',
      cap: 'Two-stage DDM. g_S = crescita supernormale; g_L = crescita matura.'
    }, {
      f: 'V_0 = \\dfrac{D_0(1+g_L) + D_0\\,H\\,(g_S-g_L)}{r-g_L}',
      cap: 'H-model: la crescita declina linearmente da g_S a g_L. H = metà del periodo di alta crescita (anni).'
    }, {
      p: "Il terminal value si stima col Gordon model sul primo dividendo maturo, oppure applicando un multiplo (es. P/E) a un fondamentale alla data terminale. Il three-stage DDM combina due stadi di crescita distinti più lo stadio maturo (o un secondo stadio con declino lineare, à la H-model)."
    }]
  }, {
    code: '23(o)',
    title: 'Sustainable growth rate & DuPont',
    imp: 'ALTA',
    blocks: [{
      f: 'g = b \\times ROE',
      cap: 'SGR: tasso sostenibile a struttura del capitale invariata, senza nuova equity. b = retention ratio.'
    }, {
      f: 'ROE = \\dfrac{NI}{Sales}\\times\\dfrac{Sales}{Assets}\\times\\dfrac{Assets}{Equity}',
      cap: 'DuPont: margine × asset turnover × leva finanziaria.'
    }, {
      f: 'g = \\dfrac{NI-Div}{NI}\\times\\dfrac{NI}{Sales}\\times\\dfrac{Sales}{Assets}\\times\\dfrac{Assets}{Equity}',
      cap: 'Modello PRAT: retention (P) × margine (R) × turnover (A) × leva (T).'
    }]
  }],
  cards: [{
    los: '23a',
    q: 'Quando è più adatto il DDM?',
    a: "Quando l'azienda paga dividendi, esiste relazione stabile tra dividendi e profittabilità, e si assume una prospettiva di non-controllo (minoranza)."
  }, {
    los: '23a',
    q: 'I 4 passi di una valutazione DCF?',
    a: "1) Definire il flusso di cassa; 2) prevederlo; 3) scegliere la metodologia per il tasso di sconto; 4) stimare il tasso."
  }, {
    los: '23b',
    q: 'DDM a periodo singolo?',
    a: "V₀ = (D₁ + P₁)/(1+r): valore attuale del dividendo atteso più il prezzo di vendita atteso."
  }, {
    los: '23c',
    q: 'Formula del Gordon Growth Model e ipotesi chiave?',
    a: "V₀ = D₀(1+g)/(r−g) = D₁/(r−g). Ipotesi: dividendi in crescita costante e indefinita, r > g."
  }, {
    los: '23d',
    q: "Valore di un'azione privilegiata perpetua a tasso fisso?",
    a: "V₀ = D_p/r_p (g = 0). Es.: par $100, dividendo 6%, r 8% → 6/0,08 = $75."
  }, {
    los: '23e',
    q: 'A cosa serve il tasso di crescita implicito?',
    a: "Si inverte il Gordon model dato il prezzo di mercato per dedurre g, e valutarne la plausibilità rispetto alle attese dell'analista."
  }, {
    los: '23f',
    q: "Cos'è il PVGO?",
    a: "Il valore attuale delle opportunità di crescita: V₀ = E₁/r + PVGO. La crescita crea valore solo se il reinvestimento rende più del costo opportunità."
  }, {
    los: '23f',
    q: 'Scomposizione del P/E con il PVGO?',
    a: "P₀/E₁ = 1/r + PVGO/E₁: componente no-growth (1/r) + componente legata alla crescita."
  }, {
    los: '23g',
    q: 'P/E leading vs trailing giustificato?',
    a: "Leading: (1−b)/(r−g). Trailing: (1−b)(1+g)/(r−g) — il trailing è il leading × (1+g)."
  }, {
    los: '23h',
    q: 'Tre limiti del Gordon model?',
    a: "Molto sensibile a g e r; non adatto da solo ad alta crescita; inapplicabile senza dividendi."
  }, {
    los: '23i',
    q: 'Caratteristiche della growth phase?',
    a: "Espansione rapida, margini e crescita EPS alti, FCF negativi per i forti investimenti, payout basso o nullo: crescita supernormale."
  }, {
    los: '23i',
    q: 'Cosa accade nella transition phase?',
    a: "La crescita rallenta verso quella dell'economia per concorrenza e saturazione; i FCF diventano positivi e il payout aumenta."
  }, {
    los: '23j',
    q: "Cosa assume l'H-model?",
    a: "La crescita declina linearmente da g_S a g_L lungo 2H anni. V₀ = [D₀(1+g_L) + D₀·H·(g_S−g_L)]/(r−g_L)."
  }, {
    los: '23k',
    q: 'Due modi per stimare il terminal value?',
    a: "1) Gordon model sul primo dividendo della fase matura; 2) multiplo (es. P/E) applicato a un fondamentale alla data terminale."
  }, {
    los: '23o',
    q: 'Formula del sustainable growth rate?',
    a: "g = b × ROE: crescita sostenibile senza nuova equity e a struttura del capitale invariata."
  }, {
    los: '23o',
    q: 'Il modello PRAT?',
    a: "g = retention × margine di profitto × asset turnover × leva finanziaria — le tre componenti DuPont del ROE moltiplicate per la retention."
  }, {
    los: '23l',
    q: 'Procedura di calcolo con un modello multiperiodo?',
    a: "1) Prevedere i dividendi della fase di alta crescita e scontarli; 2) stimare il terminal value alla fine della fase (Gordon o multiplo); 3) scontare il terminal value a oggi; 4) sommare i due PV."
  }, {
    los: '23n',
    q: 'Come si stima il required return da un DDM?',
    a: "Si calcola l'IRR implicito nel prezzo di mercato. Col Gordon: r = D₁/P₀ + g. Es.: D₀ $1,50, P₀ $25, g 4% → r = 1,56/25 + 0,04 = 10,24%."
  }, {
    los: '23p',
    q: 'Giudizio su un\u2019azione col DDM?',
    a: "Prezzo di mercato > valore intrinseco DDM → sopravvalutata; uguale → correttamente valutata; minore → sottovalutata."
  }, {
    los: '23b',
    q: 'DDM multiperiodo con prezzo terminale?',
    a: "V₀ = Σ D_t/(1+r)^t + P_n/(1+r)^n: si scontano i dividendi dei primi n anni più il prezzo di vendita atteso alla fine dell'orizzonte."
  }, {
    los: '23c',
    q: 'Perché il Gordon richiede r > g?',
    a: "Con r ≤ g il denominatore (r−g) si annulla o diventa negativo e il valore esplode/perde senso. E quando r−g è piccolo, il valore è estremamente sensibile agli input."
  }, {
    los: '23c',
    q: "Cos'è il capitalization rate?",
    a: "Il tasso r usato nel Gordon growth model per capitalizzare il dividendo: il rendimento richiesto sull'equity."
  }, {
    los: '23e',
    q: 'Implied g: D₀ $3, r 11%, P $45. Quanto vale?',
    a: "45 = 3(1+g)/(0,11−g) → g ≈ 4,06%. Si verifica poi se è plausibile rispetto alle attese sull'azienda."
  }, {
    los: '23f',
    q: 'Quando la crescita NON crea valore?',
    a: "Quando gli utili reinvestiti rendono meno del costo opportunità dei fondi: in quel caso l'azienda dovrebbe distribuire tutto in dividendi (PVGO può essere negativo)."
  }, {
    los: '23g',
    q: 'Relazione tra trailing e leading P/E giustificato?',
    a: "Trailing = leading × (1+g): (1−b)(1+g)/(r−g) contro (1−b)/(r−g)."
  }, {
    los: '23i',
    q: 'Supernormal vs mature growth rate?',
    a: "Supernormal: crescita della growth phase, ben sopra quella dell'economia, non sostenibile. Mature: tasso stabile di lungo periodo della fase matura, usato nel Gordon e nei terminal value."
  }, {
    los: '23j',
    q: 'Le assunzioni del two-stage DDM (prima versione)?',
    a: "Crescita costante g_S per n anni, poi salto immediato e permanente al tasso maturo g_L. Adatto quando la transizione è brusca (es. scadenza brevetto)."
  }, {
    los: '23j',
    q: "Quando è preferibile l'H-model al two-stage classico?",
    a: "Quando la crescita declina gradualmente e linearmente da g_S a g_L, anziché con un salto a gradino: più realistico per molte aziende in transizione."
  }, {
    los: '23k',
    q: 'Terminal value con un multiplo: come si fa?',
    a: "TV_n = multiplo (es. P/E giustificato o di settore) × fondamentale previsto alla data terminale (es. EPS_n). Alternativa al Gordon sul primo dividendo maturo."
  }, {
    los: '23n',
    q: "Come si interpreta l'IRR di un DDM?",
    a: "Dato il prezzo di mercato e gli altri input, l'IRR è il rendimento atteso implicito nel prezzo: usabile come stima del required return."
  }],
  quiz: [{
    q: "Quale NON è un tipo di flusso di cassa usato nel DCF?",
    opts: ['Dividendi', 'Residual income', 'Book value'],
    correct: 2,
    exp: "Il book value è un input del residual income model, non un flusso di cassa."
  }, {
    q: "Da prospettiva di azionista di minoranza, il modello più appropriato è:",
    opts: ['FCFE', 'FCFF', 'DDM'],
    correct: 2,
    exp: "Il DDM assume la prospettiva di chi non controlla la politica dei dividendi. FCFE/FCFF sono adatti alla prospettiva di controllo."
  }, {
    q: "Dividendo atteso $1,50, prezzo di vendita $38, r = 9%. Valore (1 anno):",
    opts: ['$36,24', '$39,50', '$34,00'],
    correct: 0,
    exp: "V₀ = (1,50 + 38)/1,09 = $36,24."
  }, {
    q: "D₀ = $5, g = 4%, r = 8%. Gordon value:",
    opts: ['$104', '$130', '$125'],
    correct: 1,
    exp: "V₀ = D₀(1+g)/(r−g) = 5(1,04)/(0,08−0,04) = 5,20/0,04 = $130."
  }, {
    q: "Privilegiata par $100, tasso fisso 6%, r = 8%. Valore:",
    opts: ['$55', '$70', '$75'],
    correct: 2,
    exp: "V₀ = D_p/r_p = 6/0,08 = $75."
  }, {
    q: "EPS atteso $1,50, r = 12%, prezzo $36. PVGO:",
    opts: ['$12,0', '$23,5', '$36,0'],
    correct: 1,
    exp: "36 = 1,50/0,12 + PVGO = 12,5 + PVGO → PVGO = $23,5."
  }, {
    q: "In quale fase il Gordon model da solo è più appropriato?",
    opts: ['Growth phase', 'Transition phase', 'Mature phase'],
    correct: 2,
    exp: "Nella fase matura: crescita stabilizzata e sostenibile, ROE vicino a r."
  }, {
    q: "Nella growth phase, i free cash flow sono tipicamente:",
    opts: ['Negativi', 'Positivi e crescenti', 'Pari ai dividendi'],
    correct: 0,
    exp: "Negativi: l'azienda investe pesantemente nell'espansione; il payout è basso o nullo."
  }, {
    q: "Trailing P/E giustificato con payout 32%, r = 13%, g = 8%:",
    opts: ['8,00', '3,50', '6,91'],
    correct: 2,
    exp: "(0,32 × 1,08)/(0,13 − 0,08) = 0,3456/0,05 = 6,91."
  }, {
    q: "Nell'H-model, H rappresenta:",
    opts: ['Il periodo totale di alta crescita', 'La metà del periodo di alta crescita', 'Il tasso di crescita massimo'],
    correct: 1,
    exp: "H = metà della durata (in anni) del periodo in cui la crescita declina linearmente da g_S a g_L."
  }, {
    q: "ROE = 12%, payout = 40%. Sustainable growth rate:",
    opts: ['4,8%', '7,2%', '12,0%'],
    correct: 1,
    exp: "b = 1 − 0,40 = 0,60; g = 0,60 × 12% = 7,2%."
  }, {
    q: "Nel modello PRAT, la T rappresenta:",
    opts: ['Il tax rate', 'La leva finanziaria (Assets/Equity)', "L'asset turnover"],
    correct: 1,
    exp: "P = retention (profit retention), R = margine, A = asset turnover, T = leva finanziaria (Assets/Equity)."
  }]
}, /* ================================================================== R24 */
{
  n: 24,
  key: 'r24',
  title: 'Free Cash Flow Valuation',
  sub: 'FCFF, FCFE, derivazioni da NI/CFO/EBIT/EBITDA, multistadio',
  weight: '11–14%',
  theory: [{
    code: '24(a-b)',
    title: 'FCFF vs FCFE e quando usarli',
    imp: 'ALTA',
    blocks: [{
      h: 'FCFF',
      p: "Flusso di cassa dalle operazioni disponibile a tutti i finanziatori (debito + equity), dopo gli investimenti necessari. Si sconta al WACC → valore dell'azienda."
    }, {
      h: 'FCFE',
      p: "Flusso di cassa dopo i pagamenti netti ai detentori di debito: misura post-debito, prospettiva proprietaria. Si sconta a r → valore dell'equity."
    }, {
      h: 'Quando preferire il FCF al DDM',
      list: ["L'azienda non paga dividendi (o minimi).", 'I dividendi divergono dalla capacità di pagarli (sono a discrezione del board).', "Si valuta un takeover target / prospettiva di controllo: il FCFE è il flusso disponibile senza compromettere le operazioni."]
    }]
  }, {
    code: '24(c)',
    title: 'Calcolo del FCFF',
    imp: 'ALTA',
    blocks: [{
      f: 'FCFF = NI + NCC + Int(1-t) - FCInv - WCInv',
      cap: 'Da utile netto. NCC = oneri non monetari (ammortamenti, ecc.). Int(1−t) riaggiunto perché flusso a favore dei creditori. I dividendi privilegiati, se dedotti nel NI, vanno riaggiunti.'
    }, {
      f: 'FCFF = CFO + Int(1-t) - FCInv',
      cap: 'Da flusso di cassa operativo.'
    }, {
      f: 'FCFF = EBIT(1-t) + Dep - FCInv - WCInv',
      cap: 'Da EBIT.'
    }, {
      f: 'FCFF = EBITDA(1-t) + Dep\\cdot t - FCInv - WCInv',
      cap: 'Da EBITDA: si riaggiunge solo lo scudo fiscale dell\u2019ammortamento.'
    }]
  }, {
    code: '24(c)',
    title: 'Calcolo del FCFE',
    imp: 'ALTA',
    blocks: [{
      f: 'FCFE = FCFF - Int(1-t) + \\text{Net Borrowing}',
      cap: 'Dal FCFF: si rimuove l\u2019interesse netto ai creditori e si aggiunge l\u2019indebitamento netto (nuovo debito − rimborsi).'
    }, {
      f: 'FCFE = NI + NCC - FCInv - WCInv + \\text{Net Borrowing}',
      cap: 'Da utile netto: l\u2019after-tax interest è già dedotto nel NI.'
    }, {
      f: 'FCFE = CFO - FCInv + \\text{Net Borrowing}',
      cap: 'Da flusso di cassa operativo.'
    }]
  }, {
    code: '24(g)',
    title: 'Effetti di dividendi, riacquisti, leva',
    imp: 'ALTA',
    blocks: [{
      p: "Dividendi, riacquisti ed emissioni di azioni NON influenzano FCFF e FCFE: sono usi dei flussi di cassa, non flussi disponibili. Le variazioni di leva hanno effetto modesto sul FCFE: il nuovo debito aumenta il FCFE nell'anno di emissione e lo riduce negli anni successivi (interessi al netto delle imposte e rimborsi); non toccano il FCFF."
    }]
  }, {
    code: '24(h)',
    title: 'NI ed EBITDA come proxy',
    imp: 'MEDIA',
    blocks: [{
      p: "Utile netto ed EBITDA sono proxy imperfetti: il NI contiene oneri non monetari e ignora gli investimenti; l'EBITDA ignora capex, variazioni di capitale circolante e imposte, e sovrastima il flusso operativo quando il circolante cresce. Il FCFF ha il legame teorico più forte con la valutazione."
    }]
  }, {
    code: '24(i)',
    title: 'Modelli single & multistadio',
    imp: 'ALTA',
    blocks: [{
      f: '\\text{Firm value} = \\dfrac{FCFF_1}{WACC - g} = \\dfrac{FCFF_0(1+g)}{WACC - g}',
      cap: 'Single-stage FCFF (crescita costante).'
    }, {
      f: '\\text{Equity value} = \\dfrac{FCFE_1}{r - g}',
      cap: 'Single-stage FCFE.'
    }, {
      f: '\\text{Firm} = \\sum_{t=1}^{n}\\dfrac{FCFF_t}{(1+WACC)^t} + \\dfrac{FCFF_{n+1}}{WACC-g}\\cdot\\dfrac{1}{(1+WACC)^n}',
      cap: 'Two-stage FCFF. Equity = Firm − valore di mercato del debito.'
    }, {
      p: "Sensitivity analysis: i valori stimati sono molto sensibili a g e al tasso di sconto; piccole variazioni degli input producono ampie variazioni del valore."
    }]
  }],
  cards: [{
    los: '24a',
    q: 'FCFF vs FCFE: a quale tasso si scontano e cosa danno?',
    a: "FCFF al WACC → valore dell'azienda (flusso disponibile a tutti i finanziatori). FCFE a r → valore dell'equity (post-debito, prospettiva proprietaria)."
  }, {
    los: '24a',
    q: 'Tre ragioni per preferire il FCF al DDM?',
    a: "1) Dividendi nulli o minimi; 2) i dividendi sono a discrezione del board e divergono dalla capacità di pagarli; 3) prospettiva di controllo/takeover."
  }, {
    los: '24c',
    q: "FCFF dall'utile netto?",
    a: "FCFF = NI + NCC + Int(1−t) − FCInv − WCInv. L'interesse netto si riaggiunge perché flusso a favore dei creditori."
  }, {
    los: '24c',
    q: 'FCFF dal CFO?',
    a: "FCFF = CFO + Int(1−t) − FCInv."
  }, {
    los: '24c',
    q: 'FCFF da EBIT e da EBITDA?',
    a: "Da EBIT: EBIT(1−t) + Dep − FCInv − WCInv. Da EBITDA: EBITDA(1−t) + Dep·t − FCInv − WCInv (si recupera solo lo scudo fiscale dell'ammortamento)."
  }, {
    los: '24c',
    q: 'FCFE dal FCFF?',
    a: "FCFE = FCFF − Int(1−t) + Net Borrowing."
  }, {
    los: '24c',
    q: "FCFE dall'utile netto?",
    a: "FCFE = NI + NCC − FCInv − WCInv + Net Borrowing. L'after-tax interest non si riaggiunge: è già dedotto nel NI."
  }, {
    los: '24c',
    q: 'Come si trattano i dividendi privilegiati nel FCFF da NI?',
    a: "Se dedotti per arrivare al NI (disponibile agli azionisti ordinari), vanno riaggiunti, come l'interesse: sono flussi verso una classe di finanziatori."
  }, {
    los: '24d',
    q: 'Calcola il FCFF: NI 200, Dep 50, Int 40, t 25%, FCInv 120, WCInv 30.',
    a: "FCFF = NI + NCC + Int(1−t) − FCInv − WCInv = 200 + 50 + 30 − 120 − 30 = 130."
  }, {
    los: '24f',
    q: 'Perché il FCFE è spesso preferito al DDM?',
    a: "I dividendi sono a discrezione del board e possono non segnalare la redditività di lungo periodo; molte società non li pagano; il FCFE misura il distribuibile senza compromettere le operazioni — la misura giusta per un takeover target."
  }, {
    los: '24g',
    q: 'I riacquisti di azioni influenzano il FCFE?',
    a: "No. Dividendi, riacquisti ed emissioni sono usi del free cash flow, non lo determinano."
  }, {
    los: '24g',
    q: "Effetto dell'emissione di nuovo debito sul FCFE?",
    a: "Aumenta il FCFE nell'anno di emissione (net borrowing positivo) e lo riduce negli anni successivi (interessi netti e rimborsi). Il FCFF non è toccato."
  }, {
    los: '24h',
    q: "Perché l'EBITDA è un proxy debole del flusso di cassa?",
    a: "Ignora capex, variazioni di capitale circolante e imposte; sovrastima il flusso operativo quando il circolante cresce."
  }, {
    los: '24i',
    q: "Valore dell'azienda single-stage FCFF?",
    a: "Firm value = FCFF₁/(WACC − g) = FCFF₀(1+g)/(WACC − g)."
  }, {
    los: '24i',
    q: "Come si ottiene l'equity value da un modello FCFF?",
    a: "Equity = Firm value − valore di mercato del debito. Poi VPS = Equity/numero di azioni."
  }, {
    los: '24i',
    q: 'A cosa serve la sensitivity analysis nei modelli FCF?',
    a: "I valori sono molto sensibili a g e al tasso di sconto: si testano variazioni degli input per capire l'intervallo del valore stimato."
  }, {
    los: '24a',
    q: 'Quando il FCF model è poco affidabile?',
    a: "Quando i FCF attesi sono fortemente negativi (capex elevate) per l'orizzonte di previsione: meglio il residual income."
  }, {
    los: '24b',
    q: 'Quale prospettiva proprietaria implica l\u2019approccio FCFE?',
    a: "Quella di un acquirente che può cambiare la politica dei dividendi (controllo). Il DDM invece assume chi non controlla la dividend policy: il valore può non realizzarsi finché i dividendi non riflettono la redditività di lungo periodo."
  }, {
    los: '24e',
    q: 'I due approcci per prevedere FCFF e FCFE?',
    a: "1) Applicare un tasso di crescita costante al FCF corrente (se la crescita storica è costante e attesa continuare); 2) prevedere le componenti: EBIT(1−t), oneri non monetari netti, FCInv e WCInv — più complesso."
  }, {
    los: '24e',
    q: 'Ipotesi centrale del sales-based forecasting?',
    a: "Gli investimenti in capitale fisso e circolante sono legati alle vendite: si prevedono dalla relazione storica tra incrementi delle vendite e FCInv/WCInv; l'EBIT da vendite previste × margine EBIT."
  }, {
    los: '24k',
    q: 'Perché la sensitivity analysis è essenziale nei modelli FCF?',
    a: "I valori stimati sono molto sensibili al tasso di crescita e al tasso di sconto: piccole variazioni degli input producono ampie variazioni del valore stimato."
  }, {
    los: '24l',
    q: 'I due approcci per il terminal value in un modello FCF multistadio?',
    a: "1) Perpetuità in crescita: TV_n = FCFF_{n+1}/(WACC−g) (o FCFE_{n+1}/(r−g)); 2) multipli: TV_n = trailing P/E giustificato × EPS anno n, oppure leading P/E × EPS anno n+1."
  }, {
    los: '24c',
    q: 'Cosa sono gli NCC e perché si rettificano?',
    a: "Oneri (e proventi) non monetari come ammortamenti e svalutazioni: riducono il NI senza uscita di cassa, quindi si riaggiungono per passare dal reddito al flusso di cassa."
  }, {
    los: '24d',
    q: 'Calcola il FCFE: FCFF 130, Int 40, t 25%, net borrowing 20.',
    a: "FCFE = FCFF − Int(1−t) + NB = 130 − 30 + 20 = 120."
  }, {
    los: '24e',
    q: "Come si prevede l'EBIT nel metodo per componenti?",
    a: "EBIT = vendite previste × margine EBIT, stimati dai dati storici e dall'ambiente economico corrente e atteso."
  }, {
    los: '24g',
    q: 'Perché le variazioni di leva non toccano il FCFF?',
    a: "Il FCFF è pre-debito: misura il flusso disponibile a tutti i finanziatori, prima di interessi e rimborsi. La leva sposta solo la ripartizione tra creditori e azionisti (cioè il FCFE)."
  }, {
    los: '24i',
    q: "Com'è strutturato un three-stage FCF model?",
    a: "Tre stadi di crescita distinti (alta, transizione, matura), oppure due stadi con il secondo in declino lineare verso il tasso maturo, più il terminal value."
  }, {
    los: '24i',
    q: 'Dal firm value al valore per azione?',
    a: "VPS = (Firm value − valore di mercato del debito) / numero di azioni in circolazione."
  }, {
    los: '24l',
    q: 'TV con multiplo: EPS anno 5 = $5, trailing P/E mediano 28. TV?',
    a: "TV₅ = 28 × 5,00 = $140."
  }, {
    los: '24i',
    q: 'Come si trattano le attività non operative nella valutazione?',
    a: "Si valutano separatamente e si sommano: Firm value = valore delle attività operative + valore delle non operative (liquidità in eccesso, titoli negoziabili)."
  }],
  quiz: [{
    q: "A quale tasso si sconta il FCFF per il valore dell'azienda?",
    opts: ['WACC', 'Cost of equity (r)', 'r − g'],
    correct: 0,
    exp: "Il FCFF è disponibile a tutti i finanziatori → WACC. Il FCFE si sconta a r."
  }, {
    q: "Nel passaggio da NI a FCFF, Int(1−t) si:",
    opts: ['Sottrae', 'Riaggiunge', 'Ignora'],
    correct: 1,
    exp: "Si riaggiunge: dedotto per arrivare al NI, ma è un flusso disponibile ai creditori."
  }, {
    q: "FCFE = FCFF − Int(1−t) + ?",
    opts: ['FCInv', 'Net Borrowing', 'WCInv'],
    correct: 1,
    exp: "Si aggiunge il net borrowing (nuovo debito − rimborsi), disponibile agli azionisti."
  }, {
    q: "Da EBITDA: FCFF = EBITDA(1−t) + ?",
    opts: ['Dep(1−t)', 'Dep·t', 'Int(1−t)'],
    correct: 1,
    exp: "Si riaggiunge solo lo scudo fiscale dell'ammortamento: Dep × t."
  }, {
    q: "Un riacquisto di azioni proprie influenza:",
    opts: ['Il FCFF', 'Il FCFE', 'Né FCFF né FCFE'],
    correct: 2,
    exp: "Dividendi, riacquisti ed emissioni sono usi dei flussi, non li determinano."
  }, {
    q: "L'emissione di nuovo debito nell'anno corrente:",
    opts: ['Aumenta il FCFE', 'Riduce il FCFE', 'Aumenta il FCFF'],
    correct: 0,
    exp: "Il net borrowing positivo aumenta il FCFE nell'anno di emissione; il FCFF non è toccato."
  }, {
    q: "FCFF₀ = 100, g = 5%, WACC = 10%. Valore dell'azienda:",
    opts: ['$2.000', '$2.100', '$1.050'],
    correct: 1,
    exp: "FCFF₁ = 105; 105/(0,10 − 0,05) = $2.100."
  }, {
    q: "Da prospettiva di maggioranza (controllo), il modello più appropriato è:",
    opts: ['DDM', 'FCFE/FCFF', 'Gordon su dividendi'],
    correct: 1,
    exp: "Chi controlla può cambiare la politica dei dividendi: il free cash flow è la misura rilevante. Il DDM è da minoranza."
  }, {
    q: "Il FCFE è una misura di flusso di cassa:",
    opts: ['Pre-debito', 'Post-debito', 'Pre-imposte'],
    correct: 1,
    exp: "Post-debito: dopo interessi netti e pagamenti netti ai creditori."
  }, {
    q: "Il FCF model è meno appropriato quando:",
    opts: ['I FCF attesi sono fortemente negativi per capex elevate', "L'azienda non paga dividendi", 'Si assume prospettiva di controllo'],
    correct: 0,
    exp: "FCF negativi attesi rendono il modello poco affidabile: meglio il residual income."
  }, {
    q: "Equity value da un two-stage FCFF model:",
    opts: ['Firm value + debito', 'Firm value − valore di mercato del debito', 'PV dei dividendi'],
    correct: 1,
    exp: "Equity = Firm − MV del debito; poi si divide per il numero di azioni."
  }]
}, /* ================================================================== R25 */
{
  n: 25,
  key: 'r25',
  title: 'Market-Based Valuation: Multiples',
  sub: 'P/E, EPS normalizzato, P/B, P/S, PEG, EV/EBITDA',
  weight: '11–14%',
  theory: [{
    code: '25(a-b)',
    title: 'Comparabili vs fondamentali · justified multiple',
    imp: 'ALTA',
    blocks: [{
      p: "Due approcci: method of comparables (relativo a peer, assume che asset simili abbiano valori simili) e metodo basato sui fondamentali previsti. Un justified price multiple è il valore equo del multiplo dati i fondamentali."
    }, {
      list: ['Justified > multiplo corrente → azione sottovalutata.', 'Justified < multiplo corrente → azione sopravvalutata.']
    }]
  }, {
    code: '25(c-d)',
    title: 'P/E: razionale e problemi',
    imp: 'MEDIA',
    blocks: [{
      h: 'Razionale',
      p: "L'earning power è il driver primario del valore; il P/E è il multiplo più usato e riconosciuto."
    }, {
      h: 'Problemi',
      p: "EPS negativi rendono il P/E privo di significato; EPS volatili o distorti da scelte contabili riducono la comparabilità. Trailing P/E usa gli EPS degli ultimi 4 trimestri; leading P/E gli EPS attesi."
    }]
  }, {
    code: '25(e)',
    title: 'EPS normalizzato',
    imp: 'ALTA',
    blocks: [{
      p: "Per la ciclicità, gli ultimi 4 trimestri possono non riflettere il potere di utile sostenibile. Due metodi di normalizzazione:"
    }, {
      list: ["Historical average EPS: media dell'EPS sull'ultimo ciclo economico completo (ignora però la crescita dimensionale).", "Average ROE: EPS normalizzato = ROE medio × book value per share corrente — riflette la dimensione attuale, perciò è preferito."]
    }, {
      f: 'EPS_{norm} = \\overline{ROE} \\times BVPS_0',
      cap: 'Es.: ROE medio 16,75% × BVPS $28,00 = $4,69.'
    }]
  }, {
    code: '25(f)',
    title: 'Earnings yield (E/P)',
    imp: 'MEDIA',
    blocks: [{
      f: 'E/P = \\dfrac{EPS}{P_0}',
      cap: 'Reciproco del P/E.'
    }, {
      p: "Con EPS negativi il P/E non è significativo, mentre l'earnings yield può comunque essere calcolato e usato per ordinare (rank) i titoli: E/P più alto = più conveniente."
    }]
  }, {
    code: '25(g-h)',
    title: 'Multipli giustificati sui fondamentali',
    imp: 'ALTA',
    blocks: [{
      f: '\\dfrac{P_0}{E_1} = \\dfrac{1-b}{r-g}',
      cap: 'P/E leading giustificato (trailing = leading × (1+g)).'
    }, {
      f: '\\dfrac{P_0}{B_0} = \\dfrac{ROE - g}{r - g}',
      cap: 'P/B giustificato: cresce con lo spread (ROE − r).'
    }, {
      f: '\\dfrac{P_0}{S_0} = \\dfrac{(E_0/S_0)(1-b)(1+g)}{r-g}',
      cap: 'P/S giustificato. E₀/S₀ = margine di profitto netto.'
    }]
  }, {
    code: '25(k)',
    title: 'Rapporto PEG',
    imp: 'MEDIA',
    blocks: [{
      f: 'PEG = \\dfrac{P/E}{g}',
      cap: 'P/E per unità di crescita attesa: più basso = più attraente; PEG < 1 spesso letto come sottovalutazione.'
    }, {
      p: "Limiti: assume relazione lineare tra P/E e crescita, ignora le differenze di rischio e la durata della crescita."
    }]
  }, {
    code: '25(n)',
    title: 'EV multiples & EV/EBITDA',
    imp: 'ALTA',
    blocks: [{
      f: 'EV = MV_{equity} + MV_{preferred} + MV_{debt} - \\text{Cash & ST inv.}',
      cap: 'Enterprise value: il costo di acquisto dell\u2019intera azienda, al netto della liquidità.'
    }, {
      list: ["EV/EBITDA è preferito al P/E per confrontare aziende con leva diversa.", "L'EBITDA è spesso positivo anche con EPS negativo.", "Limite: l'EBITDA sovrastima il flusso operativo se il circolante cresce; il FCFF ha legame teorico più forte."]
    }]
  }, {
    code: '25(q)',
    title: 'Tendenza centrale dei multipli',
    imp: 'MEDIA',
    blocks: [{
      p: "Per i multipli di un gruppo di peer, la media armonica (o armonica ponderata) e la mediana riducono la distorsione degli outlier rispetto alla media aritmetica, che sovrappesa i multipli alti."
    }, {
      f: 'X_H = \\dfrac{n}{\\sum_{i=1}^{n} \\frac{1}{X_i}}',
      cap: 'Media armonica semplice di n multipli.'
    }]
  }],
  cards: [{
    los: '25a',
    q: 'Su cosa si basa il method of comparables?',
    a: "Sull'assunzione che asset simili abbiano valori simili: si confronta il multiplo del titolo con quello di un peer/benchmark assunto correttamente prezzato."
  }, {
    los: '25b',
    q: 'Justified > o < multiplo corrente: cosa significa?',
    a: "Justified > corrente → azione sottovalutata. Justified < corrente → sopravvalutata."
  }, {
    los: '25c',
    q: 'Trailing vs leading P/E?',
    a: "Trailing: prezzo / EPS degli ultimi 4 trimestri. Leading (forward): prezzo / EPS attesi dei prossimi 4 trimestri o dell'anno fiscale successivo."
  }, {
    los: '25e',
    q: 'I due metodi di normalizzazione dell\u2019EPS?',
    a: "1) Historical average EPS (media sull'ultimo ciclo completo); 2) average ROE × BVPS corrente — preferito perché riflette la dimensione attuale dell'azienda."
  }, {
    los: '25e',
    q: 'EPS normalizzato con ROE medio 16,75% e BVPS $28?',
    a: "EPS_norm = 0,1675 × 28,00 = $4,69."
  }, {
    los: '25f',
    q: 'Perché usare l\u2019earnings yield invece del P/E?',
    a: "Con EPS negativi il P/E non è significativo, mentre l'E/P resta calcolabile e utilizzabile per ordinare i titoli (E/P alto = più conveniente)."
  }, {
    los: '25h',
    q: 'P/B giustificato sui fondamentali?',
    a: "P₀/B₀ = (ROE − g)/(r − g). Più ampio lo spread (ROE − r), più alto il P/B giustificato."
  }, {
    los: '25h',
    q: 'P/S giustificato?',
    a: "P₀/S₀ = (E₀/S₀)(1−b)(1+g)/(r−g), con E₀/S₀ = margine di profitto netto."
  }, {
    los: '25g',
    q: 'Razionale e limiti del P/B?',
    a: "Razionale: il book value è positivo anche con utili negativi, più stabile dell'EPS; adatto a banche/assicurazioni e liquidazioni. Limiti: ignora gli intangibili non contabilizzati, distorto da scelte contabili."
  }, {
    los: '25k',
    q: 'Come si calcola e interpreta il PEG?',
    a: "PEG = (P/E)/g. Più basso è più attraente; PEG < 1 spesso indica sottovalutazione. Assume linearità e ignora rischio e durata della crescita."
  }, {
    los: '25n',
    q: "Formula dell'enterprise value?",
    a: "EV = MV equity + MV preferred + MV debito − cassa e investimenti a breve."
  }, {
    los: '25n',
    q: 'Perché EV/EBITDA è migliore del P/E con leva diversa?',
    a: "Confronta l'intera azienda (capital-structure neutral) e l'EBITDA è spesso positivo anche con EPS negativo."
  }, {
    los: '25q',
    q: 'Quale tendenza centrale per i multipli dei peer?',
    a: "Media armonica (o armonica ponderata) e mediana: riducono la distorsione degli outlier rispetto alla media aritmetica, che sovrappesa i multipli alti."
  }, {
    los: '25q',
    q: 'Media armonica di P/E 10 e 30?',
    a: "X_H = 2/(1/10 + 1/30) = 2/(0,1333) = 15,0 — più bassa della media aritmetica (20), meno influenzata dal multiplo alto."
  }, {
    los: '25d',
    q: 'Come si calcolano dividend yield e P/CF, e come si interpretano?',
    a: "Dividend yield = D/P (trailing: dividendi degli ultimi 4 trimestri; leading: dividendi attesi). P/CF = prezzo/cash flow per share: tra comparabili, il P/CF più basso è relativamente sottovalutato."
  }, {
    los: '25i',
    q: "Cos'è il P/E predetto da regressione cross-sectional?",
    a: "Un P/E stimato regredendo i P/E di un gruppo di titoli sui fondamentali (es. payout, beta, crescita degli utili): Predicted P/E = a + b·DPR + c·Beta + d·EGR. Limite: vale per quel campione e quel periodo."
  }, {
    los: '25j',
    q: 'Come si valuta un titolo con il method of comparables?',
    a: "Si confronta il suo multiplo col multiplo benchmark dei peer: più basso → relativamente sottovalutato. Occorre però controllare le differenze nei fondamentali (crescita, rischio) che giustificano multipli diversi."
  }, {
    los: '25l',
    q: 'Multipli per il terminal value: vantaggio e svantaggio vs Gordon?',
    a: "Vantaggio: ancorato ai dati di mercato (il Gordon dipende da molte stime sensibili). Svantaggio: se il benchmark è mal prezzato, l'errore si trasferisce al terminal value."
  }, {
    los: '25m',
    q: 'Definizioni alternative di cash flow per i multipli e il proxy migliore?',
    a: "EPS + non-cash charges (ignora ricavi non monetari e circolante), CFO (richiede rettifiche per voci non ricorrenti), FCFE (il proxy più valido ma il più volatile), EBITDA (meglio per EV, è un flusso pre-interessi)."
  }, {
    los: '25o',
    q: 'Perché i confronti cross-border sono difficili?',
    a: "Differenze nei metodi contabili, economiche e culturali, quindi in crescita e rischio: i P/E dello stesso settore variano ampiamente tra paesi nonostante la convergenza degli standard."
  }, {
    los: '25p',
    q: 'I tre indicatori momentum?',
    a: "Earnings surprise (UE_t = EPS riportato − atteso), standardized unexpected earnings (SUE = UE scalato per la sua deviazione standard) e relative strength (performance del titolo vs benchmark o vs proprio passato)."
  }, {
    los: '25r',
    q: 'Giudizio finale con i multipli?',
    a: "Multiplo corrente < justified (o < benchmark a parità di fondamentali) → sottovalutata; > → sopravvalutata; ≈ → equamente valutata."
  }, {
    los: '25c',
    q: 'Razionale e svantaggio del P/S?',
    a: "Razionale: i ricavi sono meno manipolabili dell'EPS e positivi anche in perdita; più stabili. Svantaggio: non cattura redditività e struttura dei costi — vendite alte non implicano utili."
  }, {
    los: '25c',
    q: 'Razionale del P/CF e del dividend yield?',
    a: "P/CF: il cash flow è meno manipolabile dell'EPS e il multiplo è più stabile. Dividend yield: componente certa del total return; svantaggio: ignora il capital gain atteso."
  }, {
    los: '25d',
    q: 'Trailing vs leading dividend yield?',
    a: "Trailing: dividendi degli ultimi 4 trimestri / prezzo. Leading: dividendi attesi nei prossimi 12 mesi / prezzo."
  }, {
    los: '25e',
    q: "Cosa sono gli underlying earnings?",
    a: "Utili depurati dalle voci non ricorrenti (gain/loss una tantum, ristrutturazioni): riflettono il potere di utile persistente — base migliore per il P/E."
  }, {
    los: '25g',
    q: 'Come crescita e rischio muovono i multipli giustificati?',
    a: "Relazione positiva con la crescita attesa g (a parità di resto) e negativa con il rischio: un r più alto abbassa P/E, P/B e P/S giustificati."
  }, {
    los: '25i',
    q: 'Due limiti del P/E predetto da regressione?',
    a: "Vale solo per il campione e il periodo della stima (non generalizzabile nel tempo), e i fondamentali regressori sono spesso correlati tra loro (multicollinearità)."
  }, {
    los: '25m',
    q: "Perché l'EBITDA è più adatto a multipli EV che a multipli di prezzo?",
    a: "È un flusso pre-interessi che spetta a tutta l'impresa (debito + equity): coerente col numeratore EV, non col solo prezzo dell'equity."
  }, {
    los: '25b',
    q: 'Come si usa un justified multiple per stimare il valore?',
    a: "Valore = multiplo giustificato × fondamentale previsto (es. justified P/E × EPS atteso), da confrontare poi col prezzo di mercato."
  }],
  quiz: [{
    q: "Se il justified P/E è superiore al P/E corrente, l'azione è:",
    opts: ['Sopravvalutata', 'Sottovalutata', 'Equamente valutata'],
    correct: 1,
    exp: "Justified > corrente → il mercato paga meno del giustificato → sottovalutata."
  }, {
    q: "Il metodo di normalizzazione EPS preferito è:",
    opts: ['Historical average EPS', 'Average ROE × BVPS corrente', 'Ultimo EPS riportato'],
    correct: 1,
    exp: "Il metodo del ROE medio riflette la dimensione attuale dell'azienda (via BVPS corrente), a differenza della media storica."
  }, {
    q: "ROE medio 16,75%, BVPS $28. EPS normalizzato:",
    opts: ['$4,39', '$4,69', '$5,02'],
    correct: 1,
    exp: "0,1675 × 28,00 = $4,69."
  }, {
    q: "Con EPS negativi, per ordinare i titoli si usa:",
    opts: ['Il P/E trailing', "L'earnings yield (E/P)", 'Il PEG'],
    correct: 1,
    exp: "L'E/P resta calcolabile e ordinabile anche con utili negativi; il P/E perde significato."
  }, {
    q: "Il P/B giustificato è:",
    opts: ['(ROE − g)/(r − g)', '(1 − b)/(r − g)', '(P/E)/g'],
    correct: 0,
    exp: "P₀/B₀ = (ROE − g)/(r − g)."
  }, {
    q: "ROE = 16%, r = 12%, g = 10%. P/B giustificato:",
    opts: ['1,5', '3,0', '4,0'],
    correct: 1,
    exp: "(0,16 − 0,10)/(0,12 − 0,10) = 0,06/0,02 = 3,0."
  }, {
    q: "Nel P/S giustificato, E₀/S₀ rappresenta:",
    opts: ['Il payout', 'Il margine di profitto netto', "L'asset turnover"],
    correct: 1,
    exp: "E₀/S₀ = utile/vendite = margine di profitto netto."
  }, {
    q: "Forward P/E 9,21, crescita EPS 12%. PEG:",
    opts: ['0,77', '1,10', '1,32'],
    correct: 0,
    exp: "9,21/12 = 0,77 (< 1, relativamente attraente)."
  }, {
    q: "L'enterprise value si calcola sottraendo:",
    opts: ['Il debito', 'La cassa e gli investimenti a breve', 'Le preferred'],
    correct: 1,
    exp: "EV = MV equity + preferred + debito − cassa e investimenti a breve."
  }, {
    q: "Per confrontare aziende con leva molto diversa è preferibile:",
    opts: ['P/E', 'EV/EBITDA', 'P/E leading'],
    correct: 1,
    exp: "EV/EBITDA è neutrale rispetto alla struttura del capitale."
  }, {
    q: "P/E dei peer: 10, 12, 50. La misura meno distorta dall'outlier è:",
    opts: ['Media aritmetica', 'Media armonica o mediana', 'Il massimo'],
    correct: 1,
    exp: "Armonica e mediana riducono l'effetto degli outlier; l'aritmetica (24) sovrappesa il 50."
  }]
}, /* ================================================================== R26 */
{
  n: 26,
  key: 'r26',
  title: 'Residual Income Valuation',
  sub: 'RI, EVA/MVA, single-stage, persistence factor, clean surplus',
  weight: '11–14%',
  theory: [{
    code: '26(a)',
    title: 'Residual income, EVA, MVA',
    imp: 'ALTA',
    blocks: [{
      f: 'RI = NI - r \\times \\text{Equity}',
      cap: 'Utile in eccesso rispetto all\u2019equity charge (costo in dollari del capitale azionario).'
    }, {
      f: 'EVA = NOPAT - (C\\% \\times TC), \\quad NOPAT = EBIT(1-t)',
      cap: 'Economic value added. C% = WACC; TC = capitale totale investito.'
    }, {
      f: 'MVA = \\text{Market value} - \\text{Book value of total capital}',
      cap: 'Market value added: il valore creato dal management.'
    }]
  }, {
    code: '26(c)',
    title: 'Valore intrinseco con il RI model',
    imp: 'ALTA',
    blocks: [{
      f: 'V_0 = B_0 + \\sum_{t=1}^{\\infty}\\dfrac{RI_t}{(1+r)^t}',
      cap: 'Valore = book value corrente + PV dei residual income futuri.'
    }, {
      f: 'RI_t = E_t - r\\,B_{t-1} = (ROE - r)\\,B_{t-1}',
      cap: 'Residual income per azione. B = book value dell\u2019equity per share.'
    }]
  }, {
    code: '26(f)',
    title: 'Single-stage & justified P/B',
    imp: 'ALTA',
    blocks: [{
      f: 'V_0 = B_0 + \\dfrac{ROE - r}{r - g}\\,B_0',
      cap: 'Single-stage residual income: book value + premio legato allo spread.'
    }, {
      f: '\\dfrac{P_0}{B_0} = 1 + \\dfrac{ROE - r}{r - g} = \\dfrac{ROE - g}{r - g}',
      cap: 'Justified P/B. ROE > r → P/B > 1; ROE < r → P/B < 1.'
    }]
  }, {
    code: '26(d)',
    title: 'Determinanti e mean reversion',
    imp: 'MEDIA',
    blocks: [{
      p: "Il residual income è guidato dallo spread (ROE − r): ROE persistentemente sopra il costo dell'equity genera RI positivi e premio sul book value. La concorrenza tende a erodere lo spread nel tempo (mean reversion)."
    }]
  }, {
    code: '26(h)',
    title: 'Continuing RI & persistence factor',
    imp: 'ALTA',
    blocks: [{
      p: "Oltre l'orizzonte esplicito, il continuing residual income dipende dalla persistenza dello spread. ω è il persistence factor: ω = 1 → il RI resta costante indefinitamente; ω = 0 → nessun RI dopo l'orizzonte. Maggiore ω, maggiore il valore del flusso terminale. Ipotesi alternative: RI decade verso il livello medio di settore, o il premio sul book value svanisce subito."
    }]
  }, {
    code: '26(g)',
    title: 'Clean surplus relation & rettifiche',
    imp: 'MEDIA',
    blocks: [{
      f: 'B_t = B_{t-1} + E_t - D_t',
      cap: 'Clean surplus: il book value cresce di utili meno dividendi.'
    }, {
      p: "Il RI model assume la clean surplus relation: viene violata quando poste vanno direttamente a OCI bypassando il conto economico (es. FX translation, titoli AFS). L'analista deve rettificare, insieme a R&S, operating lease, e altre poste contabili."
    }]
  }, {
    code: '26(i-j)',
    title: 'Forza, debolezza e quando usarlo',
    imp: 'MEDIA',
    blocks: [{
      h: 'Forza',
      list: ['Il terminal value pesa meno: gran parte del valore è nel book value corrente.', 'Usa dati contabili disponibili.', 'Applicabile senza dividendi o con FCF negativi.']
    }, {
      h: 'Debolezza',
      list: ['Dipende da dati contabili manipolabili.', 'Richiede rettifiche per la clean surplus relation.', 'Lo spread (ROE − r) può non persistere.']
    }, {
      h: 'Quando usarlo',
      p: "Dividendi assenti/volatili, FCF negativi nell'orizzonte, o grande incertezza sul terminal value."
    }]
  }],
  cards: [{
    los: '26a',
    q: "Cos'è il residual income?",
    a: "L'utile netto in eccesso rispetto all'equity charge: RI = NI − (r × Equity)."
  }, {
    los: '26a',
    q: "Cos'è l'equity charge?",
    a: "Il costo in dollari del capitale azionario: r × book value dell'equity."
  }, {
    los: '26a',
    q: 'Formula di EVA e NOPAT?',
    a: "EVA = NOPAT − (C% × TC), con NOPAT = EBIT(1−t), C% = WACC, TC = capitale totale investito."
  }, {
    los: '26a',
    q: "Cos'è l'MVA?",
    a: "Market Value Added = market value dell'azienda − book value del capitale totale: il valore creato dal management."
  }, {
    los: '26c',
    q: 'Valore intrinseco con il RI model?',
    a: "V₀ = B₀ + Σ RI_t/(1+r)^t: book value corrente più il PV dei residual income futuri."
  }, {
    los: '26c',
    q: 'RI per azione in funzione del ROE?',
    a: "RI_t = E_t − r·B_{t−1} = (ROE − r) × B_{t−1}."
  }, {
    los: '26f',
    q: 'Single-stage residual income value?',
    a: "V₀ = B₀ + [(ROE − r)/(r − g)] × B₀."
  }, {
    los: '26e',
    q: 'Relazione tra residual income valuation e justified P/B?',
    a: "Il justified P/B deriva direttamente dal RI model: P₀/B₀ = 1 + PV dei RI futuri attesi / B₀. Il premio (o sconto) sul book value riflette i residual income attesi."
  }, {
    los: '26f',
    q: 'Quando il justified P/B è > 1?',
    a: "Quando ROE > r: l'azienda genera valore sopra il costo dell'equity. P₀/B₀ = (ROE − g)/(r − g)."
  }, {
    los: '26d',
    q: 'Perché lo spread (ROE − r) tende a erodersi?',
    a: "Per la concorrenza: i rendimenti in eccesso attirano nuovi entranti e gli spread tendono alla mean reversion."
  }, {
    los: '26h',
    q: 'Cosa indica un persistence factor ω = 1? E ω = 0?',
    a: "ω = 1: il RI resta allo stesso livello indefinitamente. ω = 0: nessun residual income dopo l'orizzonte di previsione."
  }, {
    los: '26g',
    q: "Cos'è la clean surplus relation?",
    a: "B_t = B_{t−1} + E_t − D_t: il book value cresce di utili meno dividendi. Violata quando poste vanno direttamente a OCI (es. FX translation, titoli AFS)."
  }, {
    los: '26j',
    q: 'Perché il terminal value pesa meno nel RI model?',
    a: "Gran parte del valore stimato è già contenuta nel book value corrente B₀, riducendo l'incertezza legata al valore terminale."
  }, {
    los: '26i',
    q: 'Quando è indicato il RI model?',
    a: "Dividendi assenti o volatili, FCF negativi nell'orizzonte di previsione, o grande incertezza sul terminal value."
  }, {
    los: '26j',
    q: 'Due debolezze del RI model?',
    a: "Dipende da dati contabili manipolabili e richiede rettifiche per la clean surplus relation; inoltre lo spread potrebbe non persistere."
  }, {
    los: '26b',
    q: 'Gli usi dei residual income models?',
    a: "Valutare singole azioni e indici azionari, e misurare l'impairment dell'avviamento. RI positivo = creazione di valore; il RI è detto anche profitto economico o abnormal earnings."
  }, {
    los: '26g',
    q: 'Come si ricava il growth rate implicito nel RI model?',
    a: "Dal single-stage dato il prezzo: P₀ = B₀ + (ROE−r)B₀/(r−g), si risolve per g: g = r − (ROE−r)×B₀/(P₀−B₀)."
  }, {
    los: '26k',
    q: 'I problemi contabili nell\u2019applicare il RI model?',
    a: "Violazioni della clean surplus, rettifiche per il fair value, intangibili, voci non ricorrenti, pratiche contabili aggressive, differenze internazionali."
  }, {
    los: '26l',
    q: 'Giudizio su un\u2019azione col RI model?',
    a: "Prezzo di mercato > V₀ (B₀ + PV dei RI) → sopravvalutata; uguale → equamente valutata; minore → sottovalutata."
  }, {
    los: '26a',
    q: 'Equity charge vs capital charge?',
    a: "Equity charge = r × book value dell'equity (usato nel RI). Capital charge dell'EVA = WACC × capitale totale investito: copre tutto il capitale, non solo l'equity."
  }, {
    los: '26a',
    q: 'EVA numerica: NOPAT 100, WACC 10%, TC 700.',
    a: "EVA = 100 − (0,10 × 700) = 100 − 70 = 30: l'impresa crea valore."
  }, {
    los: '26b',
    q: 'RI positivo vs negativo: cosa implicano?',
    a: "RI positivo: l'impresa genera più reddito del suo costo del capitale → crea valore (valutazione più alta). RI negativo: distrugge valore."
  }, {
    los: '26b',
    q: 'Altri nomi del residual income?',
    a: "Profitto economico (economic profit) o abnormal earnings: il profitto dopo aver dedotto il costo di tutto il capitale."
  }, {
    los: '26c',
    q: 'RI per azione: ROE 12%, r 10%, B_{t−1} $20.',
    a: "RI = (0,12 − 0,10) × 20 = $0,40 per azione."
  }, {
    los: '26d',
    q: 'I due driver fondamentali del residual income?',
    a: "Il ROE e il book value: RI = (ROE − r) × B. Lo spread determina il segno, il book value la scala."
  }, {
    los: '26f',
    q: 'Cosa rappresenta il premio sul book value?',
    a: "Il PV dei residual income futuri attesi: P₀ − B₀ = Σ RI_t/(1+r)^t. Premio positivo ↔ spread (ROE − r) atteso positivo."
  }, {
    los: '26h',
    q: 'Le quattro ipotesi sul continuing residual income?',
    a: "1) Persiste indefinitamente allo stesso livello (ω=1); 2) cessa subito (ω=0, il premio svanisce); 3) decade a zero nel tempo; 4) decade verso il livello medio di settore."
  }, {
    los: '26h',
    q: 'Effetto di un persistence factor più alto?',
    a: "Maggiore ω → maggiore il flusso di residual income nella fase terminale → terminal value e valore stimato più alti."
  }, {
    los: '26i',
    q: 'RI model vs DDM/FCF: la differenza chiave nel timing del valore?',
    a: "Il RI riconosce gran parte del valore subito (nel book value e nei primi RI), mentre DDM e FCF lo spostano sul terminal value lontano: meno incertezza terminale."
  }, {
    los: '26k',
    q: 'Esempi di violazione della clean surplus?',
    a: "Utili/perdite che vanno a OCI senza passare dal conto economico: variazioni non realizzate di fair value di certi strumenti, aggiustamenti da conversione valutaria."
  }],
  quiz: [{
    q: "Equity $100M, r = 8%, utile $11M. Residual income:",
    opts: ['$3M', '$8M', '$11M'],
    correct: 0,
    exp: "RI = 11 − (0,08 × 100) = $3M."
  }, {
    q: "Il residual income value si calcola come:",
    opts: ['B₀ + PV dei RI futuri', 'PV dei dividendi', 'FCFE/(r−g)'],
    correct: 0,
    exp: "V₀ = B₀ + Σ RI_t/(1+r)^t."
  }, {
    q: "NOPAT nell'EVA è pari a:",
    opts: ['EBIT(1−t)', 'NI + Dep', 'EBITDA(1−t)'],
    correct: 0,
    exp: "NOPAT = EBIT(1−t)."
  }, {
    q: "RI_t in funzione del ROE:",
    opts: ['(ROE − r) × B_{t−1}', 'ROE × B_t', '(r − g) × B₀'],
    correct: 0,
    exp: "RI_t = E_t − r·B_{t−1} = (ROE − r)·B_{t−1}."
  }, {
    q: "Se ROE > r, il justified P/B è:",
    opts: ['Maggiore di 1', 'Minore di 1', 'Uguale a 1'],
    correct: 0,
    exp: "ROE > r → creazione di valore → P/B > 1."
  }, {
    q: "ROE = 14%, r = 10%, g = 4%, B₀ = $20. Single-stage value:",
    opts: ['$20,00', '$33,33', '$28,00'],
    correct: 1,
    exp: "V₀ = 20 + (0,04/0,06)×20 = 20 + 13,33 = $33,33."
  }, {
    q: "Un persistence factor ω = 0 implica:",
    opts: ['RI costante per sempre', "Nessun RI dopo l'orizzonte di previsione", 'RI crescente'],
    correct: 1,
    exp: "ω = 0: il residual income cessa subito dopo l'orizzonte; ω = 1: persiste indefinitamente."
  }, {
    q: "La clean surplus relation è violata quando:",
    opts: ['Poste vanno direttamente a OCI bypassando il CE', "L'azienda paga dividendi", 'Il ROE supera r'],
    correct: 0,
    exp: "Es.: FX translation adjustments e titoli AFS che vanno a OCI senza passare dal conto economico."
  }, {
    q: "Un punto di forza del RI model è:",
    opts: ['Il terminal value pesa meno sul valore', 'Richiede dividendi stabili', 'Non usa dati contabili'],
    correct: 0,
    exp: "Gran parte del valore è nel book value corrente: minore incertezza terminale. Usa dati contabili (questo è anche la sua debolezza)."
  }, {
    q: "Il RI model è particolarmente indicato quando:",
    opts: ['I FCF attesi sono negativi', 'I dividendi sono stabili', 'Il book value è inaffidabile'],
    correct: 0,
    exp: "Con FCF negativi nell'orizzonte (o dividendi assenti), il RI model resta applicabile."
  }, {
    q: "L'MVA è:",
    opts: ['Market value − book value del capitale totale', 'NOPAT − equity charge', 'NI − dividendi'],
    correct: 0,
    exp: "MVA = valore di mercato dell'azienda − book value del capitale totale investito."
  }]
}, /* ================================================================== R27 */
{
  n: 27,
  key: 'r27',
  title: 'Private Company Valuation',
  sub: 'Normalizzazione, income/market/asset, CAPM esteso, DLOC/DLOM',
  weight: '11–14%',
  theory: [{
    code: '27(a-b)',
    title: 'Società private vs pubbliche · usi',
    imp: 'MEDIA',
    blocks: [{
      p: "Le private differiscono per: dimensione minore, stadio di vita più precoce, qualità/quantità inferiore dell'informazione, illiquidità delle azioni, proprietà concentrata, commistione tra interessi del management e fiscali."
    }, {
      p: "Usi della valutazione: transazioni (compravendita, IPO, finanziamento), compliance (financial reporting, fiscale), litigation. Il valore dipende dallo standard di valore e dalla prospettiva: controllo vs minoranza, commerciabile vs non commerciabile."
    }]
  }, {
    code: '27(c)',
    title: 'Normalizzazione dei flussi',
    imp: 'ALTA',
    blocks: [{
      p: "Gli utili si normalizzano per riflettere il potere di utile sostenibile: rettifica di remunerazioni eccessive/insufficienti dei proprietari-manager, spese personali a carico dell'azienda, transazioni con parti correlate non a condizioni di mercato (es. affitti), voci non ricorrenti."
    }]
  }, {
    code: '27(d-e)',
    title: 'Required return: CAPM, expanded CAPM, build-up',
    imp: 'ALTA',
    blocks: [{
      f: 'r = R_f + \\beta \\times ERP',
      cap: 'CAPM — generalmente inappropriato per le entità private.'
    }, {
      f: 'r = R_f + \\beta\\,ERP + SSP + CSRP',
      cap: 'Expanded CAPM: + small stock premium + company-specific risk premium.'
    }, {
      f: 'r = R_f + ERP + SSP + CSRP + IRP',
      cap: 'Build-up approach: senza beta, con industry risk premium. Usato quando mancano guideline public companies.'
    }]
  }, {
    code: '27(g)',
    title: 'Tre approcci di valutazione',
    imp: 'ALTA',
    blocks: [{
      h: 'Income approach',
      p: "Valore attuale dei redditi futuri attesi: free cash flow method (DCF multistadio), capitalized cash flow method, excess earnings method."
    }, {
      h: 'Market approach',
      p: "Multipli da comparabili: guideline public company method (GPCM), guideline transactions method (GTM), prior transaction method."
    }, {
      h: 'Asset-based approach',
      p: "Attività meno passività: tipicamente un floor di valore; poco adatto a going concern con molto valore immateriale."
    }]
  }, {
    code: '27(h)',
    title: 'Capitalized cash flow method',
    imp: 'ALTA',
    blocks: [{
      f: '\\text{Firm value} = \\dfrac{FCFF_1}{WACC - g_f}',
      cap: 'CCM: imprese stabili a crescita costante. Equity = Firm − debito (o direttamente FCFE₁/(r − g)).'
    }]
  }, {
    code: '27(f)',
    title: 'Sconti: DLOC & DLOM',
    imp: 'ALTA',
    blocks: [{
      f: 'DLOC = 1 - \\dfrac{1}{1 + \\text{Control premium}}',
      cap: 'Discount for Lack of Control: si applica solo in prospettiva di minoranza su un valore di base sviluppato come controllo. Es.: premio 15% → DLOC ≈ 13%.'
    }, {
      f: '\\text{Sconto totale} = 1 - (1 - DLOC)(1 - DLOM)',
      cap: 'Gli sconti si combinano moltiplicativamente, non sommandosi. Es.: 8% e 9% → 16,3%.'
    }, {
      h: 'Fattori che muovono il DLOM',
      p: "Aumentano: restrizioni alla vendita, assenza di prospettive di IPO/cessione, dividendi nulli. Riducono: dividendi pagati, prospettiva concreta di liquidità (IPO o vendita imminente)."
    }]
  }],
  cards: [{
    los: '27a',
    q: 'Tre differenze chiave tra private e pubbliche?',
    a: "Informazione di minore qualità/quantità, illiquidità delle azioni, proprietà concentrata (più dimensione minore e stadio di vita più precoce)."
  }, {
    los: '27b',
    q: 'I tre usi della valutazione di società private?',
    a: "Transazioni (compravendita, IPO, finanziamento), compliance (financial reporting, fiscale), litigation."
  }, {
    los: '27c',
    q: 'Perché si normalizzano gli utili di una privata?',
    a: "Per riflettere il potere di utile sostenibile: rettifica di remunerazioni dei proprietari, spese personali, transazioni con parti correlate non a mercato, voci non ricorrenti."
  }, {
    los: '27e',
    q: "Cosa aggiunge l'expanded CAPM al CAPM?",
    a: "Small stock premium e company-specific risk premium: r = R_f + β·ERP + SSP + CSRP."
  }, {
    los: '27e',
    q: 'Quando si usa il build-up approach e cosa lo distingue?',
    a: "Quando mancano guideline public companies: niente beta, e si aggiunge un industry risk premium oltre a ERP, SSP e CSRP."
  }, {
    los: '27g',
    q: 'I tre approcci di valutazione?',
    a: "Income (FCF method, capitalized cash flow, excess earnings), market (GPCM, GTM, prior transaction), asset-based (attività − passività, tipicamente un floor)."
  }, {
    los: '27g',
    q: 'GPCM vs GTM?',
    a: "GPCM: multipli da società pubbliche comparabili (con aggiustamenti). GTM: multipli da transazioni di acquisizione comparabili — già riflettono il premio di controllo."
  }, {
    los: '27h',
    q: 'Formula del capitalized cash flow method?',
    a: "Firm value = FCFF₁/(WACC − g_f), per imprese stabili a crescita costante. Equity = Firm − debito."
  }, {
    los: '27f',
    q: 'Formula del DLOC?',
    a: "DLOC = 1 − 1/(1 + control premium). Si applica solo valutando un'interessenza di minoranza su base di controllo."
  }, {
    los: '27f',
    q: 'Come si combinano DLOC e DLOM?',
    a: "Moltiplicativamente: sconto totale = 1 − (1 − DLOC)(1 − DLOM). Es.: 15% e 11% → 1 − 0,85·0,89 = 24,4%."
  }, {
    los: '27f',
    q: 'Due fattori che aumentano il DLOM?',
    a: "Restrizioni contrattuali alla vendita delle azioni e assenza di prospettive di liquidità (niente IPO/cessione attesa); anche dividendi nulli."
  }, {
    los: '27g',
    q: "Perché l'asset-based approach è spesso un floor?",
    a: "Ignora gran parte del valore immateriale e di avviamento di un going concern: cattura solo attività − passività."
  }, {
    los: '27a',
    q: 'Cosa rende più alto il required return di una privata?',
    a: "Premi addizionali per dimensione (size premium), rischio specifico dell'impresa e illiquidità."
  }, {
    los: '27b',
    q: 'Da cosa dipende il valore stimato di una stessa interessenza?',
    a: "Dallo standard di valore adottato e dalla prospettiva: controllo vs minoranza, commerciabile vs non commerciabile."
  }, {
    los: '27d',
    q: 'Quali fattori richiedono rettifiche nel tasso di sconto di una privata?',
    a: "Size premium (stimarlo da small cap pubbliche può avere bias verso l'alto: molte sono in difficoltà), inapplicabilità del CAPM puro (niente beta di mercato comparabile), da cui expanded CAPM o build-up."
  }, {
    los: '27a',
    q: 'I fattori company-specific di una privata?',
    a: "Stadio del ciclo di vita più precoce, dimensione minore, qualità del management e dell'informazione, commistione con interessi fiscali/personali. Possono essere positivi o negativi per il valore."
  }, {
    los: '27a',
    q: 'I fattori stock-specific di una privata?',
    a: "Illiquidità delle azioni, restrizioni alla vendita, concentrazione del controllo. Sono tipicamente negativi per la valutazione."
  }, {
    los: '27b',
    q: 'Le tre categorie di usi della valutazione di private?',
    a: "Transaction-related, compliance-related e litigation-related."
  }, {
    los: '27b',
    q: 'Esempi di transazioni che richiedono una valutazione?',
    a: "Finanziamento di venture capital, IPO, vendita dell'azienda, compensi azionari (con implicazioni contabili e fiscali per emittente e dipendente)."
  }, {
    los: '27b',
    q: 'Da cosa dipende fortemente la valutazione in sede di IPO?',
    a: "Dalle proiezioni di crescita futura della società, preparate con le banche d'investimento nel processo di quotazione."
  }, {
    los: '27b',
    q: 'I due focus della valutazione compliance-related?',
    a: "La rendicontazione finanziaria (es. impairment del goodwill) e la rendicontazione fiscale."
  }, {
    los: '27c',
    q: 'Effetto della normalizzazione di uno stipendio sopra mercato?',
    a: "Si sostituisce la remunerazione del proprietario-manager con quella di mercato: i costi scendono e gli utili normalizzati aumentano."
  }, {
    los: '27c',
    q: 'Immobile di proprietà usato dall\u2019azienda: come trattarlo?',
    a: "È un'attività non operativa: si valuta separatamente e si rettificano i flussi operativi imputando un affitto di mercato, per non distorcere il confronto."
  }, {
    los: '27e',
    q: 'CAPM vs expanded CAPM vs build-up: differenze chiave?',
    a: "CAPM: R_f + β·ERP (inadatto alle private). Expanded: + small stock premium + company-specific premium. Build-up: senza beta, + industry risk premium — quando mancano comparabili pubbliche."
  }, {
    los: '27g',
    q: "Cos'è l'excess earnings method?",
    a: "Metodo income che stima il valore degli intangibili: dal reddito normalizzato si deducono i rendimenti richiesti su working capital e fixed assets; l'eccesso, capitalizzato, è il valore degli intangibili (più WC e FA = valore dell'impresa)."
  }, {
    los: '27g',
    q: 'Quali multipli per quali società private?',
    a: "EBITDA/EBIT per private mature di maggiori dimensioni; multipli sul net income per le più piccole; multipli sui ricavi per le piccolissime."
  }, {
    los: '27g',
    q: "Cos'è il prior transaction method?",
    a: "Usa i prezzi di transazioni precedenti sulle azioni della stessa società: il più rilevante in teoria, ma spesso le transazioni sono poche, datate o non a condizioni di mercato."
  }, {
    los: '27f',
    q: 'Quando serve applicare il DLOC?',
    a: "Quando si valuta un'interessenza di minoranza partendo da un valore sviluppato su base di controllo (es. multipli da GTM, che incorporano il premio di controllo)."
  }, {
    los: '27f',
    q: 'Quando il DLOC NON è necessario?',
    a: "Quando il valore base riflette già prezzi di minoranza, come i multipli GPCM derivati dal trading di mercato di azioni pubbliche (prezzi di scambi tra azionisti di minoranza)."
  }, {
    los: '27h',
    q: 'CCM con FCFE: come si valuta direttamente l\u2019equity?',
    a: "Equity value = FCFE₁/(r − g): si capitalizza il flusso agli azionisti al costo dell'equity, senza passare dal firm value."
  }],
  quiz: [{
    q: "Control premium 15%. DLOC più vicino a:",
    opts: ['13%', '15%', '17%'],
    correct: 0,
    exp: "DLOC = 1 − 1/1,15 ≈ 13%."
  }, {
    q: "DLOC 8%, DLOM 9%. Sconto totale:",
    opts: ['17,0%', '16,3%', '15,0%'],
    correct: 1,
    exp: "1 − (0,92)(0,91) = 16,3%: gli sconti si combinano moltiplicativamente."
  }, {
    q: "Il capitalized cash flow method è:",
    opts: ['FCFF₁/(WACC − g_f)', 'B₀ + PV dei RI', 'EV/EBITDA'],
    correct: 0,
    exp: "CCM: per imprese stabili a crescita costante."
  }, {
    q: "L'approccio asset-based fornisce tipicamente:",
    opts: ['Un floor di valore', 'Il valore massimo', 'Il valore di mercato esatto'],
    correct: 0,
    exp: "Cattura attività − passività, ignorando l'immateriale di un going concern."
  }, {
    q: "Il DLOC si applica quando si valuta da prospettiva di:",
    opts: ['Controllo', 'Minoranza', 'Creditore'],
    correct: 1,
    exp: "Solo in prospettiva di minoranza, se il valore base è stato sviluppato su base di controllo."
  }, {
    q: "Per una privata molto piccola senza comparabili pubbliche si usa:",
    opts: ['CAPM puro', 'Build-up approach', 'DDM'],
    correct: 1,
    exp: "Il build-up somma premi al risk-free senza beta, includendo l'industry risk premium."
  }, {
    q: "L'expanded CAPM aggiunge al CAPM:",
    opts: ['Industry risk premium', 'Small stock premium e company-specific premium', 'Solo il size premium'],
    correct: 1,
    exp: "r = R_f + β·ERP + SSP + CSRP. L'industry risk premium appartiene al build-up."
  }, {
    q: "I multipli del guideline transactions method riflettono già:",
    opts: ['Lo sconto di minoranza', 'Il premio di controllo', 'Il DLOM'],
    correct: 1,
    exp: "Le transazioni di acquisizione incorporano il premio di controllo pagato dagli acquirenti."
  }, {
    q: "Stipendio del proprietario-manager sopra il mercato: la normalizzazione…",
    opts: ['Riduce gli utili', 'Aumenta gli utili normalizzati', 'Non ha effetto'],
    correct: 1,
    exp: "Si sostituisce la remunerazione eccessiva con quella di mercato: i costi scendono, gli utili normalizzati aumentano."
  }, {
    q: "Una prospettiva concreta di IPO imminente:",
    opts: ['Aumenta il DLOM', 'Riduce il DLOM', 'Aumenta il DLOC'],
    correct: 1,
    exp: "La liquidità attesa riduce lo sconto per mancanza di marketability."
  }]
}];

// ========== EQUITY VALUATION MODULE (Reading 22-27) — integrato nel tema FinLearn ==========
const EQ_LOGO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWgAAAEsCAMAAADZ8tmdAAAB/lBMVEXU3+JtoZpnmJSWoKubrK8cWluKmaJUXnBNYGxYmIus29Urqmpqd4qmzscNbxpWYHFHiHtqopkEJjJ1tHqZzbiXxLo0bmnQ2t0AMT5ydKpebYM1em04hncurq6yucQFBXo6hHWytdUoNk9//38A/wBhboJIh3p/f/8AAP87j4GIf46KmaJOdnYvNU0cXlACSz45kH5Jkn1V/6r//wA1OUk9joB40sOAe4j/AAD/AP8AAAAOK0cDaVgSMlEFc2IKIzsEcF4HHDL+/v4CW0x+fn8oeWk0NGgyhXU+f382Q1ksNlRVqqoqOE+pqapYZHoAAFVVVVUAVVV9e4gA//9Tl4pQlYgAf38xSGTV1uB///8kLUI1hnZJVmoTgm4jKz1ue4x+vr1LV2vLytRVqlVmmZkzZmZspZr2+vtWmItXZHiy1tAweWqLubBGinxzgZE9PT1qpJhteIlVVapGiHrV5+dVlIiKta1LWG5MjYFteYp5s6iNmKiuycZoZ2tmnJGux8cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADA4fzXAAAAgHRSTlMiW55dIe6anunbHgRmUANjojL8BStPp0gECM5jpARbBmkj2AIBpXYCAeYe2QaoBvzE0AMBTGsR/QEBAP7+/v7+/v4H/gP5BPME+pAD+wNpAwMDHgGxzQL5GAL+0e79/8cE0RgDBQWMJ4/OMdVR0MYEca8D7CpvcrHOkW1xMwqPSfXFjLwAACYxSURBVHja7Z0He9tIlq7BJCqHdnbb7rY7b8/Mpnt37y0EgkXAIJfQWFyS0sqUxlIrp7ZsRduy/de3CokAiFRIFCXWPKN2q20afHX41XdOnaqiwAAO+BLAx7XaG/gLHJhnpgaRMwDP1mmaZh+BhSHo5MYagJNLNMuy9Dvwagg6Sdl4wyqDfjMEndj4BYBcgR2CTnoIAH6o0UPQScvGK0A9pnXOLDsEncxYRrKx1MXMsn8OQScxNpFsWDgPQSc0rh6z1jEEHf+YB+CTNZyHoJMYCwD+1MN5CDru0UTPudeDeQg6AdnILbHsEHTysvHOkfPQR8eapADwrMA6j2FExzfeAzC5xA5BJx3OL5FssOwQdMJD8JCNIeg4ZUOr8A9BJzpe4Qq/F+ch6JjcRt5LNob2Lja38cFTNoagYxkPrRX+IehkxrJbzm0dw6WsyDk3yPrKxjCi43ioCzbQGIKOMOa9cu4h6NhGHefc9BB08ub5wTobdAwnw/C1DZhZooegU8i5g8vGEHQE2cgVWJIxBB3abdBD0EmH80tAvWMJR8KgmxN1eNNACwFKdWmDFjQ9u0mgH/lV+PsAGoI/MhkYH+nrEdGnj9kQI0nQdXDVWV1tQ+HmgK4HK9U5gU5uhaW5CFurHLOaAZs3BbRS4WevHWhASascx8/Cxo83A/RDcLXHstcO9FOwjThzjPgHuBGgkXnOLLHXEPQifII4czx3BrZuAOiXuMLPhh+JgV6Ad1d5zJn/Df4Ib0BEU+ssex1BV8Eux/MINbeabwoDDlogz7nTAi0sjncYRuG8mkV6PdCgFwhLdWmCroO5VQZrNALd+Y9Gc4BBwy2Qvx+Vc2KgG6DF6WP1I5gY6IiOKhsJLmXVm+OSAZr7lwEGDWOQjQRT8AbIdjnz3JywMaigBfCYjWEkBPr/AWgKaIZvgekBBV0HuRfXGPQdmOF4I6AZRqKAMJigH4Eie41BA3DJdJWDZ7gMXBtI0Eih1+kYMNPJgBbAFdcFjVm3B3QyRKAfX2PQVbjLWcdqPgbt6A/oPTo65YRAo6eTGBvo3Rgc3mBGNE0rqN/A+EHXQWbVxpmTYqgsDWZEK/GMJ8OXsT/dBmxz9rGaiV7w6IfreAn+KwblQF/XIajG/GzvwdRqD2euA582byNoNaBxDv4HeCjE+mxVU5mjO6R7eGnzNoJW/8/StSwAcZJeFu6KjAPpNryNoGkz8ot8nKgnQJZzAM1IV1FJD6ZGWyRkMr52IgHsSIwdNI/HLGjcdtA0uzeHXjMW2k+bpjKHOQ1nJGpx+daC1jiztPwTjEs/Og7CweOCx3HE6XDQI1r7RSEDwdvIQT3RzKxyjqCRSkfswxtQ0Crh7t5aWi5S0Xs/BdDm3EBzmcXN2xjRtJKGdw0IXVqajBrUE+BQ4hxJ4y8dsHgbI7orG7pal+i9iE6vDh0DWgON8vDqbY1oW+mDXvoAwavQqOfBlHNAG0lL9VZqtEmg9ZycZtdzIGzcNatuAa3GNC/djWI8Bh80TdNG7YOll4rPQ+pHHexLjFdE860oIT3Q9s7M2cBeQ0H9OcRTNeAu4xXRyOFFCekBBk1bOBujRF/kAPm9IXXBK6B55PFwSE/cQtA07UKapuW/Q2JTPe1YH7Xm4asRQnrQQdPOY500qAVwl/MFHWU9fGB9tDohuqEuse/+AC8FEtBZzo80z3D3Fqu3EbS2Rus8ChkiD70v8Zwfaob/l9Bp/oCuGVrKdy6k2QsqsNNbBm1fzhh1+PRwYH00zXpEs5a/LGUCxl8d3Fv1QYy1A1c84MatAR1ANoxMcQ9Nir/6P5FXUmgSafw1E9J4DOaaIe1pObqokdMrBgtoz6QQr2WpXzjugKreHunQV8Fp/1Gis/C9z/PARb+A1jgrO+I+hlPpPoGmYyl1BABNl0eh34xYBxnOu8rBaaDxkODy8q2aDHUd9onokuzbC9qAvwVRaOSjlagOt3o4yKDZADMiXZL/2wd0FWRWg4BmGAU0I1GNH25dRAcYvqAB7PhjxnssEGjMmtsFG7cGtFHtjw76sxAgoJVQViIa/V8aD1HxHuQ1w7giuhNMoY2BQrp+S0DT8UlHHXzkOELS4jj5ivggZoY0GWjBiwoEQSyHDTTfIg/pwQNNhpmmX3uCrvqWR9V1LCVZYTTOjHSFz3S54QkLYUDTr//bA7TQhN4rsrbKv67S5K0HAxjRhOO1l0bXAwS02UgzqvlgVg9JVyUHDjQp55IX6OU6lHiODLUy+A61+P9vMmiaVDi8QW+A7cCYOcYEmuEyhFnLAEY0mUp7ga439iWCeDZx5pkO4SbPwQOt/i8e0D4tBraqv0k5lM70jRsKmiYqRAcALQCCgEbSgQNZT8U5nrAzfVBA06bdWHFp9ETwgNbq/lrJQwHNbROJx0BJB01Q8PcH/QO4u0oQ0LxJpDFoRjolScQHB7TRMxOX65gPsiJr044uaVxbglvXHjQdciLUlDoO0AI4XGUI5kKeMbkOZYh3CY6XHiTQ+qaVWEDDKmwzwXWD4S32Th1PCNZpBws0cV7oDnoDfOQYsrnQzpnh7gW3eCmAhr82I2s07doOHRI0bFAdhsBDcw6cGeYINuC1AS0AewccOWja1Hgez2RY9WsxsCeFjqC5w8DikTjoVwDmqUgRTYerJnmDFgKsyDr4OtvgO/CaSMfyQ5Dfk5cylqJiQNC0zdfFCXotUItBd1uFWhztCWh+9TjomXjJgkZ4R5YQoxVLukoQ0WqronYKChsbaMFyKmYg5XDQDlz+6FyLiH4EYFHhVPvDBpoO7jEiTIQeoLOrq6SOwwk0F3hFPEHQ+Ar1UW33HxUCNG1qSKJDa4cT6GVwSlJN4jlnlVYKeiIFlvsL+j2AWVkDGgJ0D9sYQT+F26uhs29LHo6+toIl4kmBhi8BvDDms5CgNeWIgFkFvWgXDqKANhrCekDjLxUx2GG8VGKy8WylS5MINM12a3R6BTpm0HPYQ/PR0kJjdpwLVMRLBjSa1Sdl0+kDNSLQdI/JCG+j6dI/HEDnRdWeRTHS2jcrhbm+RTR8qLmNkKDtPiNawtILGgqwHZiz3srhOBMizsy/opfrD2gsGwULSbr2P8FB00Zto7vnJ3xAO0kHsglXY5x6zYq/y9P6z22k9ePSufZ+v1xHtfcWSCLQrNXWsZHyQhcfvQxg5ls0vkdjW/KrkDI9NVIx+60yvmQzMGALb9yg4VtAPbbfSEEG2rLVm3gxNlgKbv5O1ls41F4wa7oy5vJS6YEW8J3TPRTJQXedBxvF23mUSdeqytisjkv+Et3Nv3m9fWYO/2l880JfUnCUc//kcJENAWhTBSlSIHtNhuaxBXYDLK6YzJwKutPfJsdXAD52usimF3SgZCUO0iVv0FCg/LpJje1YZme3SryBlorVbbhcHkssHTTL0rHEsx/oqm9A48TGFs88PvYH1pf7BBq5jQ8u918RRzSbEugf6uMBTo/oWf/Gs+MXwr7d2EA/RG6DdglUwojWS6PJg15wDWj9NANDO+wJi3g1vdwH0O+xbLjPcDXSohId1/AELYBxrwOrurCdqkpZMpWOB3QdXx7rDq8XdOz95h6g3few1MEXz9KSdqCBc1FJJNttGFNE73jefhVQo2lb42hsoL9zm719NrDwSqrNc47awe0SHa8XA+h5JBsrbHTQtMlEs3FNhQj0ZzfQdxz7/XlDL5Q45t1EmiHbbRgd9IJpJSUCaFsumAJoHNC8S9rds73QYR2Lb5HsgYsKGr4E1IXfbZv+oGmjLhpthZAE9FP40asX2hTUTqTxqbBTBKQjgsa1jRXfCpG/vaOj1UI9OLuCxlsMXfpG1VqSkX67LYEzR7CaUgPNZyQbAS6P9QNtXryKm7Or61gD2VWPBjDNb3BuTUrKPpbD1Jocqb0gl/T6gKaTiGads5uP/sV1i6Fe6Xd3duYmx39PHjR0LImGiuhkhifouvsWQ767FdmbM8NnAl/8S0WQZzi5FLCxy0+jEwtnV9DLE05lO/00MGP7hDdnhukE7vkPDRrXNgJ30Pm5jvRB44BmXEscpuNmPEHzXOCbDkOCFl6RXDntCZqOq1BHAloALnVovntghKmnwBU0Iya7Zohee3KJjgV0gurs4Tr+DQV0wef4E8dO3R47/SXgbsOQEW3t27jeoB0iuulS5dDnP15fkPUnLe4HC+kwoL+D+RWynRHuoGNLAr1A95B46mQ5DH12WLzyGLNgMyHQC83MEh0RNB365J44QDuW7dRo5ox4DsiZEYNdkxpKOgqEu9fcQIfZoEkO+p96QE/AHoXWj3jt6S/wH21YbyYBet5tCTZMRNPJiLQ3aMG69K3pBaeBZvTmgqCsUSJeTwJ0FfydjQt09P6YMKCr4IvhofluMxLPMUbCQhTSgXYbhgE9w8YX0XTyoO0aLdSpbpVDL9bxnNXYkQyUtQjXBbTT4qzRbJ6sSPeArpuWvnleX4Plw4NmOuDaSEcv6G77Ysr2brlB/caYDg403IapmERK+ou/SqcAmnYDnWD+7ZGCd8t2Kl1jPuQMA03KmRF3fMWjb5MhHW37oDdoW61DsFU5CmaBNhmPsJwZpuWbiKcU0Q6ToS7PSSyseID+rCu0JhmmTIXjw1FWE/Hlfk+GtFtE00kaadoF9CIYFxkj4eat2sEwYUEzWb9EPPmIpj2kIwHTgfXZw3XUQVbfJaRz1pOVgPU6F4vnl4j3T6MTK9wpGu0S0fPGfafGWpXeYKfmLWFBo6ylDq/pZJhArqKQ9bJ3VdhiTG0yRgcH33MoJnFIf/QOaXLQQhjQfziCjt10aKBdJ8O6qX2UN6/ARpsKtZD2PNmxr6Dj7P6y5ymOtY6nsGVbTdGTcC6SbighfezppRMHreB0Ax2rfCjRXLIkK2iUTaDrYMpUtuvm3VFlQx0S7Kd00P6gYzXQPQFdlucN0NN6QPOW/kW9fhdt8Py2l0onPRmqCNIB7Sgd5RVjnfrfFqc0D813DzvBlLXWgoig8WGly/300alFtDPodfgd1Jdk29r5PGqZg9HXYHmGiZCrdEm3PE6ySiOiUwPtRJr+AB5pC1jgq2iANg7etm6JjTbEu+5Nj4lqtAGgf6DL8qmuHD/gwyP0HMW8/yc+1h4r4kmC7jq3foEul8p70LAc9ySGtySEPX240VBXKsy563yYKOj0I9qOuvz6kx7QygW+1hzF5Zik0JwrlRPXrCU50OaTkNIC3RPT2HPoVY4pybJtwulcVz4qaPflwwQjmk5bOnptdLmkX5gO6+r557x5g0pPOEdJWxBmpVyavuug09doW0TT5Zr+Ua6DQ8VD892iqOMpmGS9Mz2c+wI6LddR0oO5h3OJntS3xjdg29gzqObcztsHSZrBFL4m3cAGb87tnON+gY5/lbBXoelS7Y8FPaDviermwG4tyV6t4xm9dYYn4Wy+CUf8GS70IaK7YZss6JLLTEijgH6p/6VtxnJPHt8bz90dFcE5i7NoPHny5D4aT+7vfgXNVKWDTlM6SuqqipONrkEtoKuLmVXGOO+rW00yt37ptQ8Cja7whwlu6AwI2lLWT3gyLGlBbY9oI6Ah6PCmk9V4x330vL55k6jN4C9bExMTW+rY7E/1zkTCdSkruXo/8najUPhVe2T1QH/euKuG05lGLCWJp2C5jxFtA80mC9o0+Vk40zltbxoU4KVmORiLRofr/7Isq5wFvU0hKdB0P0DTtvqosWNFOfS1e4l613VEBY13ZSUHeoZQOZxAJywbuGyX088eaII72k1i5qVCJhbQfCbghVkJdiqZNZpKCLQr5lL5Anb3YFFS91B+fSp0OR6CfKUQNvslHb3duElFtCvncrn2vHuYxgbcVVI4nnMtJ4VX6VywjYbJaTTdV9ClD+Ct+am/SKKpfzQ+zrifYzGZ86OFoBHNJgu65DXKBWrB9ImGdQDvHZ9lZttSvPGMp8N8QieiBwWddER7cqY/OZ/CA+H4+RMp1ohmZuF0X0A7tcSkChr9J5SrzNs+zzC/OTHRUH95d7sjMsSFDfeQFhZSB+1yx0TKoMvI5fzi+PDNH5treO6CV9kDTj3VLjrpLGikDJruFjqSB+1Kmi7ROc/ju6BwB3/NHIlxtChVKuJ4gB2diSxl0f2VjtKe25GCJtZYVw/bYvSArlSY7QAhHTdo5+bQNEHTZfn5wi/+7wPiKDy85CKDDpaHx63RKYF2amc0SOeCHu2M9AUeH0T3Hfyxfx4eC2jafH6r04g/BfcAXSS4rhujbkUn3fFPw+OJ6O79js5YYl/Kcs8IseMgOW64ivQjelBnwFZqoL2Ok4kVdMlVN8poyKZ1wkADTgCYjarTo1BIR6N92MQb0V3DTPeCLsJHpO9oA4CMpK8MhFRp3zM7woPuHujfdc5sYNBs/NqsgFar/W/fCmuQIKg3ADXLRQFdOYIL/55Q9Y6mg4d0bBFdKnnXOOSd7l/z6lVjAY35IMQbSD44PnxZryLeBT8kUfin7Se4epIuybGBpn1IvxjdezMy839mcg9MyF8KePjZDyQfEUz1rM/x6NFWWLq2OQXQJavdoN2mQzRKtDxa+6aw9/vId3nKIP45/4vHVsBp8PUkSmnpamM5kYg2zibQy/we8mED/TYE6FKAIrQNuPrjkFdW/noxkntk8P6cd518qPsRSO96p0mhNbq7H9Nfo3tA/zWMoSPgbPYl5bI6TYwWiyPPKe0x3q4tO7qPLFcJHdKUp/GI4jq6kuEzF9pAL8Ai8bbjUqlEFNJd0uofU0L8NcY9+Qxqz7Iw3yvUI4XQIf0lCdCma+iDsLKAhhDulUNyJo5pe95YLrE1eWV0JqcqydsFy4Wx6NdzYmjj4XnwbljQessGSwYawkXhLwCMliNngSEHDm6MW5bX382ob35LMMGeBvmT8NXS2EHThDu5NdCCmrTBBytlgknQw2RECG406Np9BFuB/NlIJzfBaTtkSEvQvWs3Omg6IOi8oEZ0fuRifakUz1p3FBFR22xKJaTaIypsYV4TajjLVMKENP/R47yflEDPq5CzxRWZpV+U6D6DtsZ2SV4v5qD25gDO8L6IlTDu4wDWkwEd+KgNGYJnk3u1bsv4dcFseO7XtYvMA80T/VAF52KYmOYz7r2l6UQ0++e6zOKEjaSYVEqOc1mVDbOOlMuyvPdBCey39Wm1/zREacn1qqEIriOh4y6DFTUig+75V+y1S7UX7xTj9zdAtcl3LFdE96uGQkd0YoiTsXWBYluRkdejxU+YCpoSw4R0IxkfnSDotEYv6nJpVJkcMyJ50vI15i3KiYPu2TKYpIqUDf0o6+W/16PvcuD0gHhKbIGBiujuLgnaedEq/qAul02Yle+9Xpl58DtxSO+7NEldU9D2qlAXQpBB+KPR/pD5j2vflv/z9wJxtbQ+SNKhYNKjDLtCWa7JtdqLwvr6+uibP38fsYw/3zze21tfL7yoKUOWZdqKPQBoazzrYf5NmS3EU1q6jqA1xjQCJhdWHv/508zMZC734AG147vKukM9ePAgl5uc+ZB9s7f+4jV6BW1+KweOaK3M1/3mNwRKXWG+wDv9S1gCI8alHgx4dPTNzMynZw8giDTgg9ynmZl3oyuyQbzsVvowOJdLZh0pE6LGIQ2vL2jlzdL069roXjE78pWClmd9+1IQHuWf+69nC/Pz88/zjwThpa3PH1LPRor3R0dfm5e5dOiWiHaYDZTfWQgc0tuOeXj/QSsfalpeWUeEc390Cb/9vJmfBxEj+nl+83MXOqTyuZFicaX22hzcBl39h2AJcOM/lNhKsCLeKHRqW+oraPwppWsrLy5Gcnl9NQ+8fIT5NkGMA/4KBERc36a183xupPjXmmzEtolm2Uhg7NOpp4JUzAsAOaeQDgU6ltM1SiW2Vlv/fTK3Y3RfPFoQBAiSG1AQ5g1V2cnNvFmXa7Q1tsvGhtBe3+KB2nwQTeUENoVrENHKpim2Jo++m3ymMX77NmBDUSyjCd8vLLx9qKJ/NlNceS2blMPSH1I2GxZVxksVt5UsnXOFyTiUltICXTJsRQl5CstS9Dzoy5if1/ow4GmuiKZJ2mxJekF3Z0znebHS5cwcOWyISzOi8ULhkrFyhF4pL4A+D6g9AoTPRy5W/mEWZAtom8uuuB58p4AWD5vVGBpohL+HcW/YWBRH9DnvUb4Jrs0Q8uo0uZMfKY7KJbvH65kZXQVE48wwlzFMhr/+BcyQqzKa9kbyqiK/zEMIrttA09emDnuvJtsx28y1kpxXbPpsJi1+BXcigkafNLhHJs5ybe+DZi2EZF1F1MgWhLeqH3m3Lpe+sWSRDjlM11dbPIfyL+2eJl6KGHNmhcAms/LKu0+nSrdy433ajOfH19buVKvuewCraNxZs8wUy+9fvcL//Joblf+hVFycOJdLlqiumD2H8ksU0vXwoIXvAMit0+XAU9/KRVbT5BQDGY4LvWyhw+jpcdR3Cait1HDnE3J+pR6NNpebFANS0bXDBJq5hPOhQb8H4OqNHNTM1VY+aL0Sayn5t+X5hYVGw8SYejB1fnz2/c/Z7BgaJ1J3nOBvjGW//Xbm7PjjlLn/Um9ynldh5z6syCWnAoiRrBeM4zIrJtCVwj3bAgBFgHknuxRkURZRXkJTn/L4j1IxcCjjuzPxUM/4HhxmjrNj7c6BKOLTUCwHGJj/RTtGGv2mg4NOeyybObQWC2FeZY0E232FQTUgPZwrlRashgGNngB+WvG/4Ar9zWxtL3elNA+mkew1m/Ob2jvaoeZy2cv7mG7PyYE6X9OvtJMNMBn8TcSmIBYOxkbMB9nB959V1rJsLYtYIvsbs0IrQoL+IVLWtqVgoFEO9Wxd9u9MKsu1xxlKLVykEMvNfFWvyo1k759IRKvW9qOr+EKhcDL7c85Wz1JLrjBXrL3uLgrYlETXD8vIWs8aogKG8zvZv0eXXXqco9S0OgVFXtNmuakR5QAf0mYXDTMKP04UkV6fnU+5fQDhe+Xrp+Io7ZQ5aisDdtCF8Q2BCDQ+qDe34tOYhCxGbW9kB6ZDWf9QwqmztlQgY2yKYiQe4slldmTKtM5QtS+tCsifLAN1lyjM7clONgSnNKwdNJO1bGrxBY1+KtQ7X2VGiZ9i5B79krhcLG8oFRsqtzsmisT71ZRAVpK3k6PWyOG4gfjOZt4c0cLyD0K9Wp1Wq0ONanWjrnTEUh9WXju4EMV/2EiLlk3pPqDhW/RjrHl7jZK8kv2KH3ITJm8vlESZOsxeiiG3QCDQonSQHcmfak87sbnWbJpPFIM/rG1Nm9Z7d3a031ndFJSwfiw7mj37pMhbNrV4g0YTMLXntU8FJ9jvFL8sJF/BmFemvv2PLUkMJchIRxnpoL2d0WzcxFrdVhIQ1jYNvuNz5yPZ2fsno2jcb41k9qEa+BiaEtYObq9icXmWZVq/iB7xCGe8DnWRUXQ5+cxvGW9MhV+3n0ghNmwrnPGkd/ZVfdDpjQ2b+Zxfe6hnlvewhTkROW22rKgOUDrJno/jP/O3hzis12WnldyCJT/cNpWWPEAjTbp67OowUDCzS5NflVwm+VjG+R68t4vefbhdxBwntY81W7FYv2t9YLi2oIkGdY4Qi+4vIl7u4hdRpvuv70Z7jR4O6m4ebg5pymsWxOHsOpYuPsFUqhhwAWO+u31CDFmPffFk+56qbFX7oQfLdS1pf5D7GU+unImTg+1G/2H0yz4SHEWtR3pyRqXS1H2B7e5hOJS7d6Yu3NVZLrzDf/LzfPLTH56Xrs4uw4Uyz4gHrawawZtrPWXRuqL68OvZ2IEoep43qGc3vHQ/e1cJacWE5C/ksj2sS90qkwiNvI1yC2eYWXLMBPG35D01mJM3zFjjds6PxHA373JSJ6uats16s2mv9CuaDO8etw/EQFdliVJnLDt3ag4C9OX5T3KPghSMBYEvhko7g0am7ie3jJtdyeaVFa3k68mLGEQWpX1MgfDMEnxtlXiZmVJzkB55m99Uq0Yjs5Jk6cpwf7F2VttMBO5AK2pqBmeMFtTfaLPoP4tUXXAHDbupYM+xJPI6thmvFpKvFykfze0jUcngiG9TEo+Ox5VUo+dadLg2rWQe59mAUysvnsweq5wajQ27WL5/hT3Iin05V58Tv+idBw6gqwBOys55tqzux0uhXoSt/tSumvkRYkYf8tltxWE0xp2Td7h/fCkyAXZtoqxDvPyiWcLquHuNAtm9f1jnxIIe0o1lZ9DwpZKjOEnz6IfxdBZLBIwjc0maYKsyLt7PKHb3Tk84CAuaSxwL9Mr4c9HSeiO8Fy9w6Rmhfm1NyfWQrjuCxrJRc8wA1/EE+DCFYFYq5plOGC/HS53tfWXyW+61L/iU3Z3DXSno8dFiJ6u+1njA1VQliTHlMErxY1Tz0pT9EwsnazZ1ZnHRaC+HS/kwHczwvBPmGClOah0qytb8sSev3FQmPzV5D6LMnLR7TwnloJWFJj4UMl+UzdMittRMDqz1gkZu47HVPCvOQ/4JY36fUjTDbXw+PHFAi5cfd5zdkHKJNMxnDwKXSMS2UlmoE8mkUrbGi9cW91EZgz3SAR+CfMFa38dnJdWKX9U1w+SHhjmEaVYDsNdjqDM33P/SCfijw8qcnVJeK1Sd3OpAEGnuXPHSlOWJPsl2U8cWPkDNayXvNKY1zGS6oXg5/JDV3nOSlvH0Rx0fKbMfHwizdKa8VkiVRPGIPFv5G2NWZBj1wl/KLM9F1mabUXKCfkMjHczaFEh2ewciU8jew1Tu9gbYBp5WD1tScBniOtmocYWnxZlad+mlspoBT02g82DH1uqFMGOjsZVK7wv+Sw6x0yDVZnH3rvZTcvrJ7RMIc4Xhjj6i56hG7b9EqE+LstGHWhiDSOt10FieS5YpkFX8XDUdzCj0plAOUeCCnyiglJg7eALcclBmRe6nsiKJAkkfY3rD+CXyRaMEUjlHT0MZ7lm2ZCfsxSQu6KfTyYXXJVsSz5BZDR55A4A7uRxXhpTLEoIf2aNhrsPY3hHAs6K6T3EFLghUN0sxCbR8kVHWTVLBDBsAHovEoiG2FJ+x7IL5jCzjEfEUuBFjXGFbPaOXq4uaRjdA1uCMe43uZ9SmmVTGhirOhUKByGi0plykWUBG43RbJDnVpCK2xuOLZn18h0v6pW800pRinz8Ytq5Uptc/pYhZWAQUVlICzjzjhXkayWMLublC8Ct6mSMUWE8TeHOfAZgcVayejDuL3oKifh0CXaIVp5Ha3hKUs50j98VzRNrc2tcEwima557gFyOwiOJuYu8YTz5F+Rss09SvGmf1PgQFcz0tzMJDcNrieI4oERRbyM9NL7vMQOOzpP7w6CrJd4zbvEbx9Yooou/rOTe7hN36Qmo941V8mg7RPY7I6raRaEzXXTDvt0g7PsRjNEUl+QEWXqFEUC6vUKBorAQWU8WMpmBqVkkECcxzJ+P2iWuEwcwd5ZP/AKMfY66Yo7LaXku5+DxVzOjtHUpYS40rjb2zEyS63BM3zLiac0qKuVLh0Ce4kfxbVevR+ODbEi3/hDTkZYq7eer4UGxtVQSLtE+BA/0uTvro4jTw6fpwWyQ+UPTgEPgczB+bqd5aoFZQ9sKu51Aim+4Wy31TQhHk2mgJl7ccT+8TtgD8SLwgw3AtKqU6jlqP/iDLLyZBio4OaFdEENX2OWw16i5SD+aOyBcKGJQK3knxPVPgWS6tsr6pINvCs2Bgs8F1UEbRgG6Vsl3lxQgXCjIxnwniC1pIGzNydftPiMrO0jYE04JLmQTgMgnxAuP9/RS6uW0R/SjdYxzgX7Db4IKnKRyuQ6y5lUnyRyFOEGVmQRpuwwY63dFUjvws4CAMtjLY+ehWI8Z7mHZDtD5iV9e4C2426A0Avzhu3HEL56xrHWKDeEbVRxaC9A8KoVKWZ+qSK3SrcN4xXWEuxz0St//JikwY0HMpT4N9AF0Ha53uHWu+yiFuuyZude0KQvJeXnEOTABws0FPgK9KawzH+ykHBsg9cQ1nWA19U6w0534M/00BvQXOJfVueb8wVPbCH+PbZ9yqNPc6ITmP94lziqC3wLFi6/ggboNHns6t1R2F8/8NefHg2L7HTSk3BPQWOOOMsoYfapy3uUQenAD7bY4PQ7oi9Y9zaqC3wM9ct37keSFEhevcc8kEFdlAAsSHaTat/NZHzmmB/hv4XnNiCmVvU7cLXYV0Dd8NGyLlVj4mVy4J5g0CvaVwNsLQTTmU72PZcPPOD0H+kgk5pHw/OacDuqpy1st1inDwjl5DqRK7dWUh2ciExYz981Nww0FvgYy6Nmgcs+P44VcWWs6gaz6BwnxXisB5E9xw0BPYb3CBVrt/m3Jfgaiq8hxucH2O5zRAC0o88wHyZe7JqXm3pJ3zVTss5wqX7as+pwL6qaobvOWILjcarld6wWkwF1o28Kk7DXDDQcNFSgpWFuU/unfaI87nXHjOTwCANx30GnggeR8hpc2O0pzHakEDbIfnXDmBYB7cdNBgEc4Wur6CM8jaSP/rqXvhebkKwk+DTEWcSq+bsI+gm2CtZewI1uv05hxc2SLxxKNRGFG6zzEcHxK01/2kN8p14KW98+yYcpKAXvQ3TYv4V9K2x66+O+D0fpBVL9fFsL4bjrR8tLJfGI6PzEqmYxsM0ng9/KPH4tImoMaYCKBb8GHzloAGercAnMu2DiTzEUWKWqNpcBq4c54KbevwROhyc9XNLZNCuKmc4wSvMm3l/CKjr0PKe7RmbYKvUiUCaPHwGhiOVEErOaJ2WBSgMmftA049zmFs32OuWgP3onBmuLNrMRGmDVqJ6Lp+aDk8P9sdk7LenK8i6AYabXgH3lLQqjEWGrqgeLWxLoPTE56LwLkzDq7NJRlU3/7m5tqEVmR25bwzpq9Z8SESb+bg7nUR6L6C9hWZJmwz3eWvoDajoh9gVWhRrjWqIWhLeXVfIg1njhdF8WC0nZ3JTEEABDAEHSimM7tjRwcHhYKIh7pliLOUovCNCMp/PDg4OGqPfZ/JHHYPkK/+CIagycaDqXvnueOzzM/ff/9ta6yNBr5G5dtvf/757Dhzfj41dWqe9HD2s1Gfv2Z3Rf0v/OroPUUHa9kAAAAASUVORK5CYII=';
CFA_CURRICULUM.equityValuation.icon = EQ_LOGO;
const EQ_EMOJI = {
  22: '🧭',
  23: '💵',
  24: '🌊',
  25: '⚖️',
  26: '📐',
  27: '🏛️'
};
const EQ_TABS = [{
  id: 'theory',
  label: 'Teoria',
  Icon: BookOpen
}, {
  id: 'cards',
  label: 'Flashcard',
  Icon: Layers
}, {
  id: 'quiz',
  label: 'Quiz',
  Icon: Target
}];
function EquityModule({
  th,
  theme,
  onClose,
  onReward,
  rewarded,
  markRewarded
}) {
  const [reading, setReading] = useState(null); // indice EQ_READINGS o null = lista
  const [tab, setTab] = useState('theory');
  const r = reading !== null ? EQ_READINGS[reading] : null;
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 overflow-y-auto",
    style: {
      background: th.bg
    }
  }, theme === 'dark' && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 fl-grid-bg opacity-40 pointer-events-none"
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative max-w-xl mx-auto px-4 pb-24 pt-5"
  }, reading === null ?
  /*#__PURE__*/
  /* ---- LISTA READING ---- */
  React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "flex items-center gap-1.5 text-sm font-bold text-amber-500 mb-5"
  }, /*#__PURE__*/React.createElement(ChevronLeft, {
    size: 18
  }), "Studia"), /*#__PURE__*/React.createElement("div", {
    className: "fl-fade-up relative overflow-hidden rounded-3xl p-5 text-white mb-6 fl-sweep",
    style: {
      background: 'linear-gradient(125deg, #b45309 0%, #f59e0b 45%, #d97706 100%)',
      boxShadow: '0 20px 50px -20px rgba(245,158,11,.55)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-16 h-16 rounded-2xl bg-white/90 flex items-center justify-center overflow-hidden p-2 shrink-0 fl-float"
  }, /*#__PURE__*/React.createElement("img", {
    src: EQ_LOGO,
    alt: "",
    className: "w-full h-auto select-none",
    draggable: false
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "fl-mono text-amber-100/80 font-semibold mb-1",
    style: {
      fontSize: 10,
      letterSpacing: '0.2em'
    }
  }, "CFA LEVEL II \xB7 EQUITY INVESTMENTS"), /*#__PURE__*/React.createElement("h1", {
    className: "fl-display text-2xl font-bold leading-tight"
  }, "Equity Valuation"))), /*#__PURE__*/React.createElement("p", {
    className: "text-amber-50/90 text-sm mt-1 font-medium"
  }, "Reading 22\u201327 \xB7 teoria LOS-completa \xB7 ", EQ_READINGS.reduce((s, x) => s + x.cards.length, 0), " flashcard \xB7 ", EQ_READINGS.reduce((s, x) => s + x.quiz.length, 0), " quiz")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, EQ_READINGS.map((rd, i) => {
    const done = rewarded.includes(rd.key);
    return /*#__PURE__*/React.createElement("button", {
      key: rd.key,
      onClick: () => {
        setReading(i);
        setTab('theory');
      },
      className: "fl-card-hover fl-fade-up w-full flex items-center gap-4 p-4 rounded-2xl border text-left",
      style: {
        animationDelay: `${i * 55}ms`,
        backgroundColor: th.card,
        borderColor: done ? 'rgba(52,211,153,.5)' : th.cardBorder
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
      style: {
        background: theme === 'dark' ? 'rgba(5,8,16,0.6)' : '#fef3c7',
        fontSize: 26
      }
    }, EQ_EMOJI[rd.n]), /*#__PURE__*/React.createElement("div", {
      className: "flex-1 min-w-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "fl-mono font-bold px-1.5 py-0.5 rounded",
      style: {
        fontSize: 10,
        background: 'rgba(245,158,11,.15)',
        color: '#f5d061'
      }
    }, "R", rd.n), /*#__PURE__*/React.createElement("span", {
      className: "fl-mono",
      style: {
        fontSize: 10,
        color: th.textMuted
      }
    }, "peso ", rd.weight), done && /*#__PURE__*/React.createElement(Check, {
      size: 14,
      className: "text-emerald-400"
    })), /*#__PURE__*/React.createElement("h3", {
      className: "font-bold leading-snug mt-0.5",
      style: {
        color: th.text,
        fontSize: 15
      }
    }, rd.title), /*#__PURE__*/React.createElement("p", {
      className: "mt-0.5 truncate",
      style: {
        fontSize: 12,
        color: th.textMuted
      }
    }, rd.sub, " \xB7 ", rd.cards.length, " card \xB7 ", rd.quiz.length, " quiz")), /*#__PURE__*/React.createElement(ChevronRight, {
      size: 18,
      style: {
        color: '#f59e0b'
      }
    }));
  })), /*#__PURE__*/React.createElement("p", {
    className: "text-center mt-6 fl-mono",
    style: {
      fontSize: 10,
      color: th.textMuted
    }
  }, "QUIZ \u226570% \u2192 +50 XP \xB7 +15 \uD83E\uDE99 (una volta per reading)")) :
  /*#__PURE__*/
  /* ---- READING APERTO ---- */
  React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    onClick: () => setReading(null),
    className: "flex items-center gap-1.5 text-sm font-bold text-amber-500 mb-4"
  }, /*#__PURE__*/React.createElement(ChevronLeft, {
    size: 18
  }), "Reading 22\u201327"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3 mb-4 fl-fade-up"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 fl-float",
    style: {
      background: theme === 'dark' ? 'rgba(5,8,16,0.6)' : '#fef3c7',
      fontSize: 28
    }
  }, EQ_EMOJI[r.n]), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "fl-mono font-bold px-1.5 py-0.5 rounded",
    style: {
      fontSize: 10,
      background: 'rgba(245,158,11,.15)',
      color: '#f5d061'
    }
  }, "Reading ", r.n, " \xB7 peso ", r.weight), /*#__PURE__*/React.createElement("h1", {
    className: "fl-display font-bold leading-tight mt-1",
    style: {
      color: th.text,
      fontSize: 20
    }
  }, r.title))), /*#__PURE__*/React.createElement("div", {
    className: "fl-glass rounded-2xl p-1.5 flex gap-1 mb-5 sticky top-3 z-20 shadow-xl"
  }, EQ_TABS.map(({
    id,
    label,
    Icon
  }) => {
    const on = tab === id;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: () => setTab(id),
      className: "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold transition-all",
      style: on ? {
        background: 'linear-gradient(110deg,#d97706,#f59e0b)',
        color: '#fff',
        boxShadow: '0 8px 20px -10px rgba(245,158,11,.6)'
      } : {
        color: th.textMuted
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      size: 15
    }), label);
  })), tab === 'theory' && /*#__PURE__*/React.createElement(EqTheory, {
    sections: r.theory,
    th: th,
    theme: theme
  }), tab === 'cards' && /*#__PURE__*/React.createElement(EqCards, {
    key: r.key,
    cards: r.cards,
    th: th,
    theme: theme
  }), tab === 'quiz' && /*#__PURE__*/React.createElement(EqQuiz, {
    key: r.key,
    r: r,
    th: th,
    theme: theme,
    onReward: onReward,
    rewarded: rewarded,
    markRewarded: markRewarded
  }))));
}

/* ---- TEORIA ---- */
function EqTheory({
  sections,
  th,
  theme
}) {
  const [open, setOpen] = useState(0);
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, sections.map((sec, i) => {
    const isOpen = open === i;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: `rounded-2xl overflow-hidden fl-fade-up ${isOpen ? 'fl-glass' : ''}`,
      style: {
        animationDelay: `${i * 40}ms`,
        backgroundColor: isOpen ? undefined : th.card,
        border: `1px solid ${isOpen ? 'rgba(232,185,49,.3)' : th.cardBorder}`
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setOpen(isOpen ? -1 : i),
      className: "w-full flex items-center gap-3 p-4 text-left"
    }, /*#__PURE__*/React.createElement("span", {
      className: "fl-mono font-bold px-2 py-1 rounded-lg shrink-0",
      style: {
        fontSize: 10,
        background: 'rgba(245,158,11,.12)',
        color: '#f5d061'
      }
    }, sec.code), /*#__PURE__*/React.createElement("span", {
      className: "flex-1 font-bold leading-snug",
      style: {
        color: th.text,
        fontSize: 14
      }
    }, sec.title), sec.imp === 'ALTA' && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12
      }
    }, "\uD83D\uDD25"), /*#__PURE__*/React.createElement(ChevronDown, {
      size: 17,
      style: {
        color: th.textMuted,
        transform: isOpen ? 'rotate(180deg)' : 'none',
        transition: 'transform .3s'
      }
    })), isOpen && /*#__PURE__*/React.createElement("div", {
      className: "px-4 pb-5 space-y-4 fl-fade-up"
    }, sec.blocks.map((blk, j) => /*#__PURE__*/React.createElement("div", {
      key: j
    }, blk.h && /*#__PURE__*/React.createElement("h4", {
      className: "font-bold tracking-wide uppercase mb-1.5 flex items-center gap-1.5",
      style: {
        fontSize: 11,
        color: '#f5d061'
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "w-1 h-1 rounded-full bg-amber-400"
    }), blk.h), blk.f && /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl px-3 py-4 my-2 overflow-x-auto text-center",
      style: {
        background: theme === 'dark' ? 'rgba(5,8,16,.6)' : '#fff',
        border: '1px solid rgba(232,185,49,.25)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: th.text
      }
    }, /*#__PURE__*/React.createElement(MathFormula, {
      formula: blk.f,
      display: true
    })), blk.cap && /*#__PURE__*/React.createElement("div", {
      className: "mt-2 leading-snug",
      style: {
        fontSize: 11,
        color: th.textMuted
      }
    }, blk.cap)), blk.p && /*#__PURE__*/React.createElement("p", {
      className: "leading-relaxed",
      style: {
        fontSize: 14,
        color: th.textSecondary
      }
    }, blk.p), blk.list && /*#__PURE__*/React.createElement("ul", {
      className: "space-y-1.5 mt-1"
    }, blk.list.map((li, k) => /*#__PURE__*/React.createElement("li", {
      key: k,
      className: "flex gap-2.5 leading-snug",
      style: {
        fontSize: 14,
        color: th.textSecondary
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "fl-mono font-bold shrink-0",
      style: {
        fontSize: 11,
        color: '#f5d061',
        marginTop: 2
      }
    }, String(k + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("span", null, li))))))));
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-center pt-1 fl-mono",
    style: {
      fontSize: 10,
      color: th.textMuted
    }
  }, "\uD83D\uDD25 = LOS AD ALTA PROBABILIT\xC0 D'ESAME"));
}

/* ---- FLASHCARD ---- */
function EqCards({
  cards,
  th,
  theme
}) {
  const [idx, setIdx] = useState(0);
  const [flip, setFlip] = useState(false);
  const [done, setDone] = useState({});
  const total = cards.length;
  const card = cards[idx];
  const go = d => {
    setFlip(false);
    setTimeout(() => setIdx(i => (i + d + total) % total), 130);
  };
  const rate = id => {
    setDone(p => ({
      ...p,
      [idx]: id
    }));
    if (idx < total - 1) go(1);
  };
  const RATE = [{
    id: 'again',
    label: 'Ripeti',
    col: '#fb7185'
  }, {
    id: 'hard',
    label: 'Difficile',
    col: '#fbbf24'
  }, {
    id: 'good',
    label: 'Bene',
    col: '#60a5fa'
  }, {
    id: 'easy',
    label: 'Facile',
    col: '#34d399'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "fl-fade-up"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-2 px-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fl-mono font-semibold",
    style: {
      fontSize: 11,
      color: th.textMuted
    }
  }, "CARTA ", idx + 1, " / ", total, " \xB7 LOS ", card.los.toUpperCase()), /*#__PURE__*/React.createElement("span", {
    className: "fl-mono",
    style: {
      fontSize: 11,
      color: th.textMuted
    }
  }, Object.keys(done).length, " riviste")), /*#__PURE__*/React.createElement("div", {
    className: "h-1.5 rounded-full mb-5 overflow-hidden",
    style: {
      background: 'rgba(232,185,49,.12)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full rounded-full transition-all duration-500",
    style: {
      width: `${Object.keys(done).length / total * 100}%`,
      background: 'linear-gradient(90deg,#d97706,#f5d061)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      perspective: 1400,
      minHeight: 260
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative w-full",
    style: {
      minHeight: 260,
      transformStyle: 'preserve-3d',
      transition: 'transform .55s cubic-bezier(.4,0,.2,1)',
      transform: flip ? 'rotateY(180deg)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setFlip(true),
    className: "fl-glass absolute inset-0 w-full rounded-3xl p-6 flex flex-col items-center justify-center text-center",
    style: {
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      boxShadow: '0 24px 50px -28px rgba(0,0,0,.7)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "fl-mono font-bold px-2.5 py-1 rounded-full mb-4",
    style: {
      fontSize: 10,
      background: 'rgba(245,158,11,.15)',
      color: '#f5d061',
      letterSpacing: '0.15em'
    }
  }, "DOMANDA"), /*#__PURE__*/React.createElement("p", {
    className: "font-bold leading-snug",
    style: {
      fontSize: 18,
      color: th.text
    }
  }, card.q), /*#__PURE__*/React.createElement("span", {
    className: "mt-5 flex items-center gap-1.5 fl-mono",
    style: {
      fontSize: 10,
      color: th.textMuted
    }
  }, /*#__PURE__*/React.createElement(RotateCcw, {
    size: 11
  }), " TOCCA PER GIRARE")), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 w-full rounded-3xl p-6 flex flex-col",
    style: {
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      transform: 'rotateY(180deg)',
      background: 'linear-gradient(155deg, rgba(217,119,6,.2), rgba(13,20,38,.95))',
      border: '1px solid rgba(232,185,49,.3)',
      boxShadow: '0 24px 50px -28px rgba(0,0,0,.7)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "fl-mono font-bold mb-3",
    style: {
      fontSize: 10,
      color: '#f5d061',
      letterSpacing: '0.15em'
    }
  }, "RISPOSTA"), /*#__PURE__*/React.createElement("p", {
    className: "leading-relaxed flex-1 overflow-y-auto",
    style: {
      fontSize: 15,
      color: '#f8fafc'
    }
  }, card.a)))), flip ? /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-4 gap-2 mt-5 fl-fade-up"
  }, RATE.map(rr => /*#__PURE__*/React.createElement("button", {
    key: rr.id,
    onClick: () => rate(rr.id),
    className: "fl-card-hover py-2.5 rounded-xl text-center font-bold",
    style: {
      fontSize: 12,
      backgroundColor: th.card,
      border: `1px solid ${done[idx] === rr.id ? rr.col : th.cardBorder}`,
      color: rr.col
    }
  }, rr.label))) : /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mt-5"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => go(-1),
    className: "fl-card-hover fl-glass w-11 h-11 rounded-xl flex items-center justify-center"
  }, /*#__PURE__*/React.createElement(ChevronLeft, {
    size: 20,
    className: "text-amber-400"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setDone({});
      setIdx(0);
      setFlip(false);
    },
    className: "fl-mono flex items-center gap-1.5",
    style: {
      fontSize: 11,
      color: th.textMuted
    }
  }, /*#__PURE__*/React.createElement(RotateCcw, {
    size: 11
  }), " RESET"), /*#__PURE__*/React.createElement("button", {
    onClick: () => go(1),
    className: "fl-card-hover fl-glass w-11 h-11 rounded-xl flex items-center justify-center"
  }, /*#__PURE__*/React.createElement(ChevronRight, {
    size: 20,
    className: "text-amber-400"
  }))));
}

/* ---- QUIZ ---- */
function EqQuiz({
  r,
  th,
  theme,
  onReward,
  rewarded,
  markRewarded
}) {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const questions = r.quiz;
  const total = questions.length;
  const q = questions[i];
  const answered = answers[i] !== undefined;
  const score = Object.values(answers).filter(a => a.ok).length;
  const choose = k => {
    if (!answered) setAnswers(p => ({
      ...p,
      [i]: {
        sel: k,
        ok: k === q.correct
      }
    }));
  };
  const restart = () => {
    setI(0);
    setAnswers({});
    setFinished(false);
  };
  const finish = () => {
    setFinished(true);
    const pct = Math.round(score / total * 100);
    if (pct >= 70 && !rewarded.includes(r.key)) {
      onReward(50, 15);
      markRewarded(r.key);
    }
  };
  if (finished) {
    const pct = Math.round(score / total * 100);
    const pass = pct >= 70;
    return /*#__PURE__*/React.createElement("div", {
      className: "fl-glass rounded-3xl p-8 text-center fl-fade-up"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 44
      },
      className: "mb-2"
    }, pass ? '🏆' : '📚'), /*#__PURE__*/React.createElement("div", {
      className: "fl-display fl-gold-text font-bold mb-1",
      style: {
        fontSize: 42
      }
    }, pct, "%"), /*#__PURE__*/React.createElement("p", {
      className: "fl-mono mb-1",
      style: {
        fontSize: 12,
        color: th.textSecondary
      }
    }, score, " / ", total, " CORRETTE"), /*#__PURE__*/React.createElement("h3", {
      className: "font-bold mb-1",
      style: {
        fontSize: 19,
        color: th.text
      }
    }, pass ? 'Sopra la soglia CFA!' : 'Sotto il 70% — ripassa e riprova'), pass && (rewarded.includes(r.key) ? /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        color: th.textMuted
      }
    }, "Ricompensa gi\xE0 riscossa per questo reading") : /*#__PURE__*/React.createElement("p", {
      className: "font-bold text-amber-400",
      style: {
        fontSize: 13
      }
    }, "+50 XP \xB7 +15 \uD83E\uDE99")), /*#__PURE__*/React.createElement("button", {
      onClick: restart,
      className: "fl-card-hover w-full py-3.5 rounded-2xl font-bold text-white mt-5",
      style: {
        background: 'linear-gradient(110deg,#d97706,#f59e0b)'
      }
    }, "Riprova il quiz"));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "fl-fade-up"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-x-auto",
    style: {
      scrollbarWidth: 'none',
      WebkitOverflowScrolling: 'touch'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5 px-1 py-1",
    style: {
      width: 'max-content'
    }
  }, questions.map((_, k) => {
    const a = answers[k];
    const cur2 = k === i;
    return /*#__PURE__*/React.createElement("button", {
      key: k,
      ref: el => {
        if (el && cur2) el.scrollIntoView({
          inline: 'center',
          block: 'nearest',
          behavior: 'smooth'
        });
      },
      onClick: () => setI(k),
      className: "flex items-center justify-center rounded-lg font-bold shrink-0 transition-all duration-200",
      style: {
        width: 28,
        height: 28,
        fontSize: 12,
        background: a ? a.ok ? '#10b981' : '#fb7185' : cur2 ? 'linear-gradient(135deg,#fbbf24,#f97316)' : theme === 'dark' ? 'rgba(5,8,16,.6)' : '#e2e8f0',
        color: a || cur2 ? '#fff' : th.textMuted,
        transform: cur2 ? 'scale(1.2)' : 'none',
        boxShadow: cur2 ? '0 3px 10px -2px rgba(245,158,11,.55)' : 'none'
      }
    }, k + 1);
  }))), /*#__PURE__*/React.createElement("span", {
    className: "fl-mono font-bold shrink-0",
    style: {
      fontSize: 11,
      color: '#f5d061'
    }
  }, score, " \u2713")), /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "fl-quiz-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl-glass rounded-3xl p-5 mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rounded-xl text-white flex items-center justify-center font-black shrink-0",
    style: {
      width: 34,
      height: 34,
      fontSize: 14,
      background: 'linear-gradient(135deg,#fbbf24,#f97316)'
    }
  }, i + 1), /*#__PURE__*/React.createElement("p", {
    className: "font-bold leading-snug flex-1",
    style: {
      fontSize: 15,
      color: th.text,
      paddingTop: 4
    }
  }, q.q)), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2.5"
  }, q.opts.map((opt, k) => {
    const isCorrect = k === q.correct;
    const isSel = answers[i]?.sel === k;
    let st = {
      backgroundColor: theme === 'dark' ? 'rgba(5,8,16,.5)' : '#fff',
      border: `1px solid ${th.cardBorder}`,
      color: th.textSecondary
    };
    if (answered) {
      if (isCorrect) st = {
        background: 'rgba(16,185,129,.15)',
        border: '1px solid #10b981',
        color: th.text
      };else if (isSel) st = {
        background: 'rgba(251,113,133,.15)',
        border: '1px solid #fb7185',
        color: th.text
      };else st = {
        ...st,
        opacity: .5
      };
    }
    return /*#__PURE__*/React.createElement("button", {
      key: k,
      onClick: () => choose(k),
      disabled: answered,
      className: `fl-opt-in w-full flex items-center gap-3 p-3.5 rounded-2xl text-left transition-all ${!answered ? 'fl-card-hover' : ''}`,
      style: {
        ...st,
        fontSize: 14,
        animationDelay: `${k * 70}ms`
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "fl-mono rounded-lg flex items-center justify-center font-bold shrink-0",
      style: {
        width: 26,
        height: 26,
        fontSize: 12,
        background: 'rgba(245,158,11,.15)',
        color: '#f5d061'
      }
    }, String.fromCharCode(65 + k)), /*#__PURE__*/React.createElement("span", {
      className: "flex-1"
    }, opt), answered && isCorrect && /*#__PURE__*/React.createElement(Check, {
      size: 18,
      className: "text-emerald-400"
    }), answered && isSel && !isCorrect && /*#__PURE__*/React.createElement(X, {
      size: 18,
      className: "text-rose-400"
    }));
  }))), answered && /*#__PURE__*/React.createElement("div", {
    className: "fl-glass rounded-2xl p-4 mb-3 fl-fade-up"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3"
  }, /*#__PURE__*/React.createElement(BullMascot, {
    size: 44,
    mood: answers[i].ok ? 'correct' : 'wrong'
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fl-mono font-bold flex items-center gap-1.5 mb-1.5",
    style: {
      fontSize: 10,
      color: '#f5d061',
      letterSpacing: '0.15em'
    }
  }, "\uD83D\uDCA1 SPIEGAZIONE"), /*#__PURE__*/React.createElement("p", {
    className: "leading-relaxed",
    style: {
      fontSize: 13,
      color: th.textSecondary
    }
  }, q.exp))))), answered && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (i < total - 1) setI(i + 1);else finish();
    },
    className: "fl-card-hover w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2",
    style: {
      background: 'linear-gradient(110deg,#d97706,#f59e0b)'
    }
  }, i < total - 1 ? 'Prossima domanda' : 'Vedi risultato', " ", /*#__PURE__*/React.createElement(ChevronRight, {
    size: 18
  })));
}

// ========== FINLEARN CALCULATOR — BA II PLUS-COMPATIBLE (FULL CFA FUNCTION SET) ==========
// Motore sincrono basato su ref (zero stale state) · tasti su pointer-down per reattività immediata
// TVM (P/Y, C/Y, BGN) · AMORT · CF/NPV/IRR · BOND · DEPR · ICONV · DATE · BRKEVN · DATA/STAT · STO/RCL · FORMAT

// ---- Tasto calcolatrice: componente stabile, feedback di pressione in stili inline (funziona anche senza Tailwind JIT) ----
const CALC_KEY_STYLES = {
  num: {
    background: '#e4e4e7',
    color: '#18181b'
  },
  tvm: {
    background: '#3f3f46',
    color: '#ffffff'
  },
  func: {
    background: '#52525b',
    color: '#ffffff'
  },
  op: {
    background: '#3f3f46',
    color: '#fcd34d'
  },
  hot: {
    background: '#f59e0b',
    color: '#18181b',
    fontWeight: 900
  },
  go: {
    background: '#059669',
    color: '#ffffff'
  }
};
function CalcKey({
  main,
  sub,
  kind = 'num',
  onAct
}) {
  const [pressed, setPressed] = useState(false);
  const fired = useRef(false);
  return /*#__PURE__*/React.createElement("button", {
    onPointerDown: e => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      fired.current = true;
      setPressed(true);
      onAct();
    },
    onPointerUp: () => setPressed(false),
    onPointerLeave: () => setPressed(false),
    onPointerCancel: () => setPressed(false),
    onClick: () => {
      if (!fired.current) onAct();
      fired.current = false;
    },
    onContextMenu: e => e.preventDefault(),
    className: "relative rounded-lg font-bold select-none",
    style: {
      ...CALC_KEY_STYLES[kind],
      fontSize: 13,
      paddingTop: 14,
      paddingBottom: 7,
      lineHeight: 1.1,
      transform: pressed ? 'scale(0.88)' : 'scale(1)',
      filter: pressed ? 'brightness(1.35)' : 'none',
      transition: 'transform 70ms ease, filter 70ms ease',
      WebkitTapHighlightColor: 'transparent',
      touchAction: 'manipulation',
      WebkitUserSelect: 'none',
      userSelect: 'none',
      cursor: 'pointer',
      border: 'none'
    }
  }, sub && /*#__PURE__*/React.createElement("span", {
    className: "absolute left-0 right-0 pointer-events-none",
    style: {
      top: 2,
      fontSize: 8,
      fontWeight: 600,
      color: '#fbbf24',
      lineHeight: 1
    }
  }, sub), main);
}
function TICalculator({
  onClose
}) {
  const [, force] = useReducer(c => c + 1, 0);
  const S = useRef({
    display: '0',
    label: '',
    input: '',
    second: false,
    cpt: false,
    ans: 0,
    acc: null,
    op: null,
    memFlag: null,
    ws: null,
    idx: 0,
    pyEdit: false,
    pyField: 'PY',
    tvm: {
      N: 0,
      IY: 0,
      PV: 0,
      PMT: 0,
      FV: 0
    },
    py: 1,
    cy: 1,
    bgn: false,
    cfs: [{
      v: 0,
      f: 1
    }],
    npvI: 0,
    amort: {
      P1: 1,
      P2: 1
    },
    iconv: {
      NOM: 0,
      CY: 12,
      EFF: 0
    },
    brk: {
      FC: 0,
      VC: 0,
      P: 0,
      PFT: 0,
      Q: 0
    },
    depr: {
      M: 'SL',
      DB: 200,
      CST: 0,
      SAL: 0,
      LIF: 1,
      YR: 1
    },
    dateW: {
      DT1: '01.0126',
      DT2: '01.0126',
      DBD: 0,
      ACT: true
    },
    bond: {
      SDT: '01.0126',
      CPN: 0,
      RDT: '01.0131',
      RV: 100,
      ACT: true,
      CPY: 2,
      YLD: 0,
      PRI: 0
    },
    stat: {
      pts: []
    },
    mem: Array(10).fill(0),
    dec: 2
  }).current;
  const R = () => force();

  // ============ HELPERS ============
  const fmt = n => {
    if (n === undefined || n === null || isNaN(n) || !isFinite(n)) return 'Error';
    if (S.dec === 9) {
      if (n !== 0 && (Math.abs(n) < 1e-6 || Math.abs(n) >= 1e10)) return n.toExponential(5);
      return parseFloat(n.toPrecision(10)).toString();
    }
    if (n !== 0 && Math.abs(n) >= 1e10) return n.toExponential(S.dec);
    return n.toLocaleString('en-US', {
      minimumFractionDigits: S.dec,
      maximumFractionDigits: S.dec
    });
  };
  const cur = () => S.input !== '' ? parseFloat(S.input) || 0 : parseFloat(String(S.display).replace(/,/g, '')) || 0;
  const show = (n, lab) => {
    S.display = fmt(n);
    if (!isNaN(n) && isFinite(n)) S.ans = n;
    if (lab !== undefined) S.label = lab;
    S.input = '';
    R();
  };
  const parseDate = s => {
    const str = (parseFloat(s) || 1.0126).toFixed(4);
    const [mm, ddyy] = str.split('.');
    const d = parseInt(ddyy.slice(0, 2)) || 1,
      yy = parseInt(ddyy.slice(2, 4)) || 0;
    const year = yy < 80 ? 2000 + yy : 1900 + yy;
    return new Date(Date.UTC(year, (parseInt(mm) || 1) - 1, d));
  };
  const dateStr = s => {
    const d = parseDate(s);
    return `${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}-${d.getUTCFullYear()}`;
  };
  const daysBetween = (a, b, act) => {
    if (act) return Math.round((b - a) / 86400000);
    let y1 = a.getUTCFullYear(),
      m1 = a.getUTCMonth() + 1,
      d1 = Math.min(a.getUTCDate(), 30);
    let y2 = b.getUTCFullYear(),
      m2 = b.getUTCMonth() + 1,
      d2 = b.getUTCDate();
    if (d2 === 31 && d1 === 30) d2 = 30;
    return (y2 - y1) * 360 + (m2 - m1) * 30 + (d2 - d1);
  };

  // ============ TVM ============
  const perRate = iy => {
    const r = iy / 100 / S.cy;
    return Math.pow(1 + r, S.cy / S.py) - 1;
  };
  const tvmF = (i, t) => {
    const g = S.bgn ? 1 + i : 1;
    if (Math.abs(i) < 1e-12) return t.PV + t.PMT * t.N + t.FV;
    return t.PV + t.PMT * g * (1 - Math.pow(1 + i, -t.N)) / i + t.FV * Math.pow(1 + i, -t.N);
  };
  const solveTVM = key => {
    const t = S.tvm,
      i = perRate(t.IY),
      g = S.bgn ? 1 + i : 1;
    if (key === 'FV') return t.FV = Math.abs(i) < 1e-12 ? -(t.PV + t.PMT * t.N) : -(t.PV * Math.pow(1 + i, t.N) + t.PMT * g * (Math.pow(1 + i, t.N) - 1) / i);
    if (key === 'PV') return t.PV = Math.abs(i) < 1e-12 ? -(t.FV + t.PMT * t.N) : -(t.FV * Math.pow(1 + i, -t.N) + t.PMT * g * (1 - Math.pow(1 + i, -t.N)) / i);
    if (key === 'PMT') return t.PMT = Math.abs(i) < 1e-12 ? -(t.PV + t.FV) / t.N : -(t.PV + t.FV * Math.pow(1 + i, -t.N)) / (g * (1 - Math.pow(1 + i, -t.N)) / i);
    if (key === 'N') {
      if (Math.abs(i) < 1e-12) return t.N = -(t.PV + t.FV) / t.PMT;
      const a = -(t.FV * i - t.PMT * g) / (t.PV * i + t.PMT * g);
      return t.N = Math.log(a) / Math.log(1 + i);
    }
    if (key === 'IY') {
      let lo = -0.9999,
        hi = 10,
        fl = tvmF(lo + 1e-9, t);
      if (fl * tvmF(hi, t) > 0) {
        hi = 100;
        if (fl * tvmF(hi, t) > 0) return t.IY = NaN;
      }
      for (let k = 0; k < 200; k++) {
        const m = (lo + hi) / 2,
          fm = tvmF(m, t);
        if (Math.abs(fm) < 1e-10) {
          lo = hi = m;
          break;
        }
        if (fl * fm < 0) hi = m;else {
          lo = m;
          fl = fm;
        }
      }
      const iPer = (lo + hi) / 2;
      return t.IY = (Math.pow(1 + iPer, S.py / S.cy) - 1) * S.cy * 100;
    }
  };

  // ============ CALCOLI WORKSHEET ============
  const calcNPV = () => {
    const r = S.npvI / 100;
    let s = S.cfs[0].v,
      base = 0;
    for (let i = 1; i < S.cfs.length; i++) {
      for (let k = 0; k < S.cfs[i].f; k++) s += S.cfs[i].v / Math.pow(1 + r, base + k + 1);
      base += S.cfs[i].f;
    }
    return s;
  };
  const calcIRR = () => {
    const f = r => {
      let s = S.cfs[0].v,
        base = 0;
      for (let i = 1; i < S.cfs.length; i++) {
        for (let k = 0; k < S.cfs[i].f; k++) s += S.cfs[i].v / Math.pow(1 + r, base + k + 1);
        base += S.cfs[i].f;
      }
      return s;
    };
    let lo = -0.999,
      hi = 10,
      fl = f(lo);
    if (fl * f(hi) > 0) return NaN;
    for (let k = 0; k < 200; k++) {
      const m = (lo + hi) / 2,
        fm = f(m);
      if (Math.abs(fm) < 1e-11) return m * 100;
      if (fl * fm < 0) hi = m;else {
        lo = m;
        fl = fm;
      }
    }
    return (lo + hi) / 2 * 100;
  };
  const amortCalc = () => {
    const i = perRate(S.tvm.IY);
    let bal = S.tvm.PV,
      PRN = 0,
      INT = 0;
    const p1 = Math.round(S.amort.P1),
      p2 = Math.round(S.amort.P2);
    for (let p = 1; p <= p2; p++) {
      const interest = bal * i;
      const principal = -S.tvm.PMT - interest;
      if (p >= p1) {
        INT += interest;
        PRN += principal;
      }
      bal -= principal;
    }
    return {
      BAL: bal,
      PRN: -PRN,
      INT: -INT
    };
  };
  const deprCalc = () => {
    const {
      M,
      DB,
      CST,
      SAL,
      LIF,
      YR
    } = S.depr;
    let dep = 0,
      rbv = CST;
    for (let y = 1; y <= Math.min(YR, LIF); y++) {
      let d;
      if (M === 'SL') d = (CST - SAL) / LIF;else if (M === 'SYD') d = (CST - SAL) * (LIF - y + 1) / (LIF * (LIF + 1) / 2);else d = rbv * (DB / 100) / LIF;
      d = Math.max(0, Math.min(d, rbv - SAL));
      if (y === YR) dep = d;
      rbv -= d;
    }
    return {
      DEP: dep,
      RBV: rbv,
      RDV: Math.max(0, rbv - SAL)
    };
  };
  const bondSchedule = () => {
    const settle = parseDate(S.bond.SDT),
      red = parseDate(S.bond.RDT);
    const step = S.bond.CPY === 2 ? 6 : 12;
    const coupons = [];
    let d = new Date(red);
    let guard = 0;
    while (d > settle && guard++ < 600) {
      coupons.unshift(new Date(d));
      d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - step, d.getUTCDate()));
    }
    return {
      settle,
      coupons,
      prev: d
    };
  };
  const bondPrice = yld => {
    try {
      const {
        settle,
        coupons,
        prev
      } = bondSchedule();
      if (!coupons.length) return {
        clean: NaN,
        ai: NaN
      };
      const c = S.bond.CPN / S.bond.CPY;
      const y = yld / 100 / S.bond.CPY;
      const dPeriod = daysBetween(prev, coupons[0], S.bond.ACT) || 1;
      const w = daysBetween(settle, coupons[0], S.bond.ACT) / dPeriod;
      let dirty = 0;
      coupons.forEach((cd, k) => {
        dirty += (c + (k === coupons.length - 1 ? S.bond.RV : 0)) / Math.pow(1 + y, w + k);
      });
      const ai = c * (1 - w);
      return {
        clean: dirty - ai,
        ai
      };
    } catch {
      return {
        clean: NaN,
        ai: NaN
      };
    }
  };
  const bondSolveYld = () => {
    let lo = -50,
      hi = 300;
    const f = yy => bondPrice(yy).clean - S.bond.PRI;
    let fl = f(lo);
    for (let k = 0; k < 200; k++) {
      const m = (lo + hi) / 2,
        fm = f(m);
      if (Math.abs(fm) < 1e-9) return m;
      if (fl * fm < 0) hi = m;else {
        lo = m;
        fl = fm;
      }
    }
    return (lo + hi) / 2;
  };
  const statResults = () => {
    const pts = S.stat.pts.filter(p => p && !isNaN(p.x));
    const n = pts.length;
    if (!n) return [['n', 0]];
    const xs = pts.map(p => p.x),
      ys = pts.map(p => isNaN(p.y) ? 1 : p.y);
    const mx = xs.reduce((a, b) => a + b, 0) / n,
      my = ys.reduce((a, b) => a + b, 0) / n;
    const Sxx = xs.reduce((a, x) => a + (x - mx) ** 2, 0),
      Syy = ys.reduce((a, y) => a + (y - my) ** 2, 0);
    const Sxy = pts.reduce((a, p) => a + (p.x - mx) * ((isNaN(p.y) ? 1 : p.y) - my), 0);
    const out = [['n', n], ['x\u0304', mx], ['Sx', Math.sqrt(Sxx / Math.max(1, n - 1))], ['\u03c3x', Math.sqrt(Sxx / n)], ['y\u0304', my], ['Sy', Math.sqrt(Syy / Math.max(1, n - 1))], ['\u03c3y', Math.sqrt(Syy / n)]];
    if (Sxx > 0 && Syy > 0) {
      const b = Sxy / Sxx;
      out.push(['a', my - b * mx], ['b', b], ['r', Sxy / Math.sqrt(Sxx * Syy)]);
    }
    return out;
  };

  // ============ WORKSHEET: campi ============
  const wsFields = name => {
    if (name === 'AMORT') {
      const a = amortCalc();
      return [{
        k: 'P1',
        lab: 'P1',
        get: () => S.amort.P1,
        set: v => S.amort.P1 = Math.max(1, Math.round(v))
      }, {
        k: 'P2',
        lab: 'P2',
        get: () => S.amort.P2,
        set: v => S.amort.P2 = Math.max(1, Math.round(v))
      }, {
        k: 'BAL',
        lab: 'BAL',
        get: () => a.BAL,
        ro: true
      }, {
        k: 'PRN',
        lab: 'PRN',
        get: () => a.PRN,
        ro: true
      }, {
        k: 'INT',
        lab: 'INT',
        get: () => a.INT,
        ro: true
      }];
    }
    if (name === 'ICONV') return [{
      k: 'NOM',
      lab: 'NOM',
      get: () => S.iconv.NOM,
      set: v => S.iconv.NOM = v,
      cpt: () => S.iconv.NOM = (Math.pow(1 + S.iconv.EFF / 100, 1 / S.iconv.CY) - 1) * S.iconv.CY * 100
    }, {
      k: 'EFF',
      lab: 'EFF',
      get: () => S.iconv.EFF,
      set: v => S.iconv.EFF = v,
      cpt: () => S.iconv.EFF = (Math.pow(1 + S.iconv.NOM / 100 / S.iconv.CY, S.iconv.CY) - 1) * 100
    }, {
      k: 'CY',
      lab: 'C/Y',
      get: () => S.iconv.CY,
      set: v => S.iconv.CY = Math.max(1, Math.round(v))
    }];
    if (name === 'BRKEVN') return [{
      k: 'FC',
      lab: 'FC',
      get: () => S.brk.FC,
      set: v => S.brk.FC = v,
      cpt: () => S.brk.FC = (S.brk.P - S.brk.VC) * S.brk.Q - S.brk.PFT
    }, {
      k: 'VC',
      lab: 'VC',
      get: () => S.brk.VC,
      set: v => S.brk.VC = v,
      cpt: () => S.brk.VC = S.brk.P - (S.brk.FC + S.brk.PFT) / S.brk.Q
    }, {
      k: 'P',
      lab: 'P',
      get: () => S.brk.P,
      set: v => S.brk.P = v,
      cpt: () => S.brk.P = S.brk.VC + (S.brk.FC + S.brk.PFT) / S.brk.Q
    }, {
      k: 'PFT',
      lab: 'PFT',
      get: () => S.brk.PFT,
      set: v => S.brk.PFT = v,
      cpt: () => S.brk.PFT = (S.brk.P - S.brk.VC) * S.brk.Q - S.brk.FC
    }, {
      k: 'Q',
      lab: 'Q',
      get: () => S.brk.Q,
      set: v => S.brk.Q = v,
      cpt: () => S.brk.Q = (S.brk.FC + S.brk.PFT) / (S.brk.P - S.brk.VC)
    }];
    if (name === 'DEPR') {
      const d = deprCalc();
      return [{
        k: 'M',
        lab: S.depr.M + (S.depr.M === 'DB' ? ` ${S.depr.DB}%` : ''),
        get: () => ({
          SL: 1,
          SYD: 2,
          DB: 3
        })[S.depr.M],
        setting: true,
        toggle: () => {
          S.depr.M = S.depr.M === 'SL' ? 'SYD' : S.depr.M === 'SYD' ? 'DB' : 'SL';
        }
      }, ...(S.depr.M === 'DB' ? [{
        k: 'DB',
        lab: 'DB%',
        get: () => S.depr.DB,
        set: v => S.depr.DB = v
      }] : []), {
        k: 'CST',
        lab: 'CST',
        get: () => S.depr.CST,
        set: v => S.depr.CST = v
      }, {
        k: 'SAL',
        lab: 'SAL',
        get: () => S.depr.SAL,
        set: v => S.depr.SAL = v
      }, {
        k: 'LIF',
        lab: 'LIF',
        get: () => S.depr.LIF,
        set: v => S.depr.LIF = Math.max(1, Math.round(v))
      }, {
        k: 'YR',
        lab: 'YR',
        get: () => S.depr.YR,
        set: v => S.depr.YR = Math.max(1, Math.round(v))
      }, {
        k: 'DEP',
        lab: 'DEP',
        get: () => d.DEP,
        ro: true
      }, {
        k: 'RBV',
        lab: 'RBV',
        get: () => d.RBV,
        ro: true
      }, {
        k: 'RDV',
        lab: 'RDV',
        get: () => d.RDV,
        ro: true
      }];
    }
    if (name === 'DATE') return [{
      k: 'DT1',
      lab: 'DT1 ' + dateStr(S.dateW.DT1),
      get: () => parseFloat(S.dateW.DT1),
      set: v => S.dateW.DT1 = String(v)
    }, {
      k: 'DT2',
      lab: 'DT2 ' + dateStr(S.dateW.DT2),
      get: () => parseFloat(S.dateW.DT2),
      set: v => S.dateW.DT2 = String(v),
      cpt: () => {
        const d = parseDate(S.dateW.DT1);
        d.setUTCDate(d.getUTCDate() + Math.round(S.dateW.DBD));
        S.dateW.DT2 = `${String(d.getUTCMonth() + 1).padStart(2, '0')}.${String(d.getUTCDate()).padStart(2, '0')}${String(d.getUTCFullYear() % 100).padStart(2, '0')}`;
        return parseFloat(S.dateW.DT2);
      }
    }, {
      k: 'DBD',
      lab: 'DBD',
      get: () => S.dateW.DBD,
      set: v => S.dateW.DBD = v,
      cpt: () => S.dateW.DBD = daysBetween(parseDate(S.dateW.DT1), parseDate(S.dateW.DT2), S.dateW.ACT)
    }, {
      k: 'MODE',
      lab: S.dateW.ACT ? 'ACT' : '360',
      get: () => S.dateW.ACT ? 1 : 2,
      setting: true,
      toggle: () => {
        S.dateW.ACT = !S.dateW.ACT;
      }
    }];
    if (name === 'BOND') return [{
      k: 'SDT',
      lab: 'SDT ' + dateStr(S.bond.SDT),
      get: () => parseFloat(S.bond.SDT),
      set: v => S.bond.SDT = String(v)
    }, {
      k: 'CPN',
      lab: 'CPN',
      get: () => S.bond.CPN,
      set: v => S.bond.CPN = v
    }, {
      k: 'RDT',
      lab: 'RDT ' + dateStr(S.bond.RDT),
      get: () => parseFloat(S.bond.RDT),
      set: v => S.bond.RDT = String(v)
    }, {
      k: 'RV',
      lab: 'RV',
      get: () => S.bond.RV,
      set: v => S.bond.RV = v
    }, {
      k: 'DAY',
      lab: S.bond.ACT ? 'ACT' : '360',
      get: () => S.bond.ACT ? 1 : 2,
      setting: true,
      toggle: () => {
        S.bond.ACT = !S.bond.ACT;
      }
    }, {
      k: 'CPY',
      lab: S.bond.CPY === 2 ? '2/Y' : '1/Y',
      get: () => S.bond.CPY,
      setting: true,
      toggle: () => {
        S.bond.CPY = S.bond.CPY === 2 ? 1 : 2;
      }
    }, {
      k: 'YLD',
      lab: 'YLD',
      get: () => S.bond.YLD,
      set: v => S.bond.YLD = v,
      cpt: () => S.bond.YLD = bondSolveYld()
    }, {
      k: 'PRI',
      lab: 'PRI',
      get: () => S.bond.PRI,
      set: v => S.bond.PRI = v,
      cpt: () => S.bond.PRI = bondPrice(S.bond.YLD).clean
    }, {
      k: 'AI',
      lab: 'AI',
      get: () => bondPrice(S.bond.YLD).ai,
      ro: true
    }];
    if (name === 'MEM') return S.mem.map((m, i) => ({
      k: 'M' + i,
      lab: 'M' + i,
      get: () => S.mem[i],
      set: v => S.mem[i] = v
    }));
    if (name === 'FORMAT') return [{
      k: 'DEC',
      lab: 'DEC',
      get: () => S.dec,
      set: v => S.dec = Math.min(9, Math.max(0, Math.round(v)))
    }];
    return null;
  };
  const wsLen = () => {
    const n = S.ws;
    if (n === 'CF') return 1 + (S.cfs.length - 1) * 2 + 2;
    if (n === 'NPV') return 2;
    if (n === 'DATA') return (S.stat.pts.length + 1) * 2;
    if (n === 'STAT') return statResults().length;
    const f = wsFields(n);
    return f ? f.length : 1;
  };

  // mostra il campo corrente — SINCRONO, legge sempre lo stato fresco dal ref
  const refresh = () => {
    const n = S.ws,
      i = S.idx;
    if (!n) {
      R();
      return;
    }
    if (n === 'CF') {
      if (i === 0) {
        S.label = 'CF0';
        S.display = fmt(S.cfs[0].v);
      } else {
        const ci = Math.ceil(i / 2),
          isF = i % 2 === 0;
        while (S.cfs.length <= ci) S.cfs.push({
          v: 0,
          f: 1
        });
        S.label = (isF ? 'F' : 'C') + String(ci).padStart(2, '0');
        S.display = fmt(isF ? S.cfs[ci].f : S.cfs[ci].v);
      }
    } else if (n === 'NPV') {
      S.label = i === 0 ? 'I' : 'NPV';
      S.display = fmt(i === 0 ? S.npvI : calcNPV());
    } else if (n === 'DATA') {
      const p = Math.floor(i / 2),
        isY = i % 2 === 1;
      while (S.stat.pts.length <= p) S.stat.pts.push({
        x: NaN,
        y: NaN
      });
      S.label = (isY ? 'Y' : 'X') + String(p + 1).padStart(2, '0');
      const pt = S.stat.pts[p];
      S.display = fmt(isY ? isNaN(pt.y) ? 1 : pt.y : isNaN(pt.x) ? 0 : pt.x);
    } else if (n === 'STAT') {
      const res = statResults();
      const [lab, val] = res[Math.min(i, res.length - 1)];
      S.label = lab;
      S.display = fmt(val);
    } else if (n === 'IRR') {/* display già impostato */} else {
      const f = wsFields(n);
      const fl = f[Math.min(i, f.length - 1)];
      S.label = fl.lab;
      S.display = fmt(fl.get());
    }
    S.input = '';
    R();
  };
  const openWs = name => {
    S.ws = name;
    S.idx = 0;
    S.second = false;
    S.cpt = false;
    S.pyEdit = false;
    refresh();
  };
  const move = d => {
    if (S.pyEdit) {
      S.pyField = S.pyField === 'PY' ? 'CY' : 'PY';
      S.label = S.pyField === 'PY' ? 'P/Y' : 'C/Y';
      S.display = fmt(S.pyField === 'PY' ? S.py : S.cy);
      S.input = '';
      R();
      return;
    }
    if (!S.ws || S.ws === 'IRR') return;
    const len = wsLen();
    S.idx = (S.idx + d + len) % len;
    refresh();
  };

  // ============ TASTI ============
  const num = d => {
    if (S.memFlag) {
      const i = parseInt(d);
      if (S.memFlag === 'STO') {
        S.mem[i] = cur();
        S.label = `STO ${i}`;
      } else {
        S.display = fmt(S.mem[i]);
        S.ans = S.mem[i];
        S.label = `RCL ${i}`;
        S.input = '';
      }
      S.memFlag = null;
      R();
      return;
    }
    if (S.second) {
      const map = {
        '7': 'DATA',
        '8': 'STAT',
        '9': 'BOND',
        '4': 'DEPR',
        '5': 'BRKEVN',
        '6': 'ICONV',
        '0': 'MEM'
      };
      if (map[d]) {
        openWs(map[d]);
        return;
      }
      S.second = false;
    }
    S.input = S.input === '0' ? d : S.input + d;
    S.display = S.input;
    R();
  };
  const dot = () => {
    if (S.second) {
      openWs('FORMAT');
      return;
    }
    if (!S.input.includes('.')) {
      S.input = (S.input || '0') + '.';
      S.display = S.input;
      R();
    }
  };
  const plusMinus = () => {
    S.input = S.input !== '' ? S.input.startsWith('-') ? S.input.slice(1) : '-' + S.input : String(-cur());
    S.display = S.input;
    R();
  };
  const back = () => {
    S.input = S.input.slice(0, -1);
    S.display = S.input || '0';
    R();
  };
  const applyOp = (a, b, o) => o === '+' ? a + b : o === '−' ? a - b : o === '×' ? a * b : o === '÷' ? b !== 0 ? a / b : NaN : o === 'yˣ' ? Math.pow(a, b) : b;
  const factorial = n => {
    n = Math.round(n);
    if (n < 0 || n > 170) return NaN;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
  };
  const doOp = o => {
    if (S.second) {
      if (o === '×') {
        show(factorial(cur()), 'x!');
        S.second = false;
        R();
        return;
      }
      if (o === '÷') {
        show(Math.random(), 'RAND');
        S.second = false;
        R();
        return;
      }
      S.second = false;
    }
    const v = cur();
    const res = S.acc !== null && S.op ? applyOp(S.acc, v, S.op) : v;
    S.acc = res;
    S.op = o;
    S.display = fmt(res);
    S.label = o;
    S.input = '';
    R();
  };
  const equals = () => {
    if (S.second) {
      show(S.ans, 'ANS');
      S.second = false;
      R();
      return;
    }
    if (S.acc !== null && S.op) {
      const r = applyOp(S.acc, cur(), S.op);
      S.acc = null;
      S.op = null;
      show(r, '');
    }
  };
  const pct = () => {
    if (S.second) {
      openWs('DATE');
      return;
    }
    if (S.acc !== null && S.op) {
      const v = S.acc * cur() / 100;
      S.input = String(v);
      S.display = fmt(v);
      R();
    } else show(cur() / 100, '%');
  };
  const sqrt = () => {
    S.second = false;
    show(Math.sqrt(cur()), '√x');
  };
  const sq = () => {
    S.second = false;
    show(Math.pow(cur(), 2), 'x²');
  };
  const recip = () => {
    S.second = false;
    show(1 / cur(), '1/x');
  };
  const ln = () => {
    if (S.second) {
      S.second = false;
      show(Math.exp(cur()), 'eˣ');
      return;
    }
    show(Math.log(cur()), 'LN');
  };
  const tvmKey = k => {
    if (S.second) {
      S.second = false;
      if (k === 'N') {
        const v = cur() * S.py;
        S.tvm.N = v;
        show(v, 'N');
        return;
      }
      if (k === 'IY') {
        S.pyEdit = true;
        S.ws = null;
        S.pyField = 'PY';
        S.label = 'P/Y';
        S.display = fmt(S.py);
        S.input = '';
        R();
        return;
      }
      if (k === 'PV') {
        openWs('AMORT');
        return;
      }
      if (k === 'PMT') {
        S.bgn = !S.bgn;
        S.label = S.bgn ? 'BGN' : 'END';
        R();
        return;
      }
      if (k === 'FV') {
        S.tvm = {
          N: 0,
          IY: 0,
          PV: 0,
          PMT: 0,
          FV: 0
        };
        S.label = 'CLR TVM';
        S.display = fmt(0);
        S.input = '';
        R();
        return;
      }
    }
    if (S.cpt) {
      S.cpt = false;
      const v = solveTVM(k);
      show(v, k === 'IY' ? 'I/Y' : k);
      return;
    }
    const v = cur();
    S.tvm[k] = v;
    show(v, k === 'IY' ? 'I/Y' : k);
  };
  const pressEnter = () => {
    if (S.pyEdit) {
      const v = Math.max(1, Math.round(cur()));
      if (S.pyField === 'PY') {
        S.py = v;
        S.cy = v;
      } else S.cy = v;
      S.display = fmt(v);
      S.input = '';
      R();
      return;
    }
    if (!S.ws) {
      S.input = '';
      R();
      return;
    }
    const n = S.ws;
    if (n === 'CF') {
      const v = cur();
      if (S.idx === 0) S.cfs[0].v = v;else {
        const ci = Math.ceil(S.idx / 2),
          isF = S.idx % 2 === 0;
        while (S.cfs.length <= ci) S.cfs.push({
          v: 0,
          f: 1
        });
        if (isF) S.cfs[ci].f = Math.max(1, Math.round(v));else S.cfs[ci].v = v;
      }
      refresh();
      return;
    }
    if (n === 'NPV') {
      if (S.idx === 0) S.npvI = cur();
      refresh();
      return;
    }
    if (n === 'DATA') {
      const p = Math.floor(S.idx / 2),
        isY = S.idx % 2 === 1,
        v = cur();
      while (S.stat.pts.length <= p) S.stat.pts.push({
        x: NaN,
        y: NaN
      });
      if (isY) S.stat.pts[p].y = v;else S.stat.pts[p].x = v;
      refresh();
      return;
    }
    if (n === 'STAT' || n === 'IRR') return;
    const fields = wsFields(n);
    if (!fields) return;
    const f = fields[Math.min(S.idx, fields.length - 1)];
    if (f.setting && f.toggle) {
      f.toggle();
      refresh();
      return;
    }
    if (!f.ro && f.set) {
      f.set(cur());
      refresh();
    }
  };
  const cptKey = () => {
    if (S.ws && !['CF', 'DATA', 'STAT', 'IRR'].includes(S.ws)) {
      if (S.ws === 'NPV' && S.idx === 1) {
        show(calcNPV(), 'NPV');
        return;
      }
      const fields = wsFields(S.ws);
      const f = fields?.[Math.min(S.idx, fields.length - 1)];
      if (f?.cpt) {
        const v = f.cpt();
        show(v, f.k);
        return;
      }
    }
    S.cpt = true;
    R();
  };
  const cfKey = () => {
    if (S.second) {
      S.cfs = [{
        v: 0,
        f: 1
      }];
      S.npvI = 0;
      S.second = false;
      S.label = 'CLR WORK';
      if (S.ws === 'CF') {
        S.idx = 0;
        refresh();
      } else R();
      return;
    }
    openWs('CF');
  };
  const irrKey = () => {
    S.cpt = false;
    S.ws = 'IRR';
    S.idx = 0;
    S.label = 'IRR';
    S.display = '...';
    R();
    setTimeout(() => {
      const v = calcIRR();
      S.display = fmt(v);
      if (!isNaN(v)) S.ans = v;
      R();
    }, 20);
  };
  const clear = () => {
    if (S.second) {
      S.ws = null;
      S.pyEdit = false;
      S.label = '';
      S.second = false;
      S.input = '';
      S.display = fmt(S.ans);
      R();
      return;
    } // QUIT
    S.input = '';
    S.display = '0';
    S.acc = null;
    S.op = null;
    S.cpt = false;
    if (S.ws) refresh();else {
      S.label = '';
      R();
    }
  };

  // ============ UI ============

  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-3",
    onPointerDown: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-zinc-900 rounded-3xl p-4 w-full overflow-y-auto shadow-2xl border border-zinc-700",
    style: {
      maxWidth: 380,
      maxHeight: '95vh'
    },
    onPointerDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "",
    style: {
      fontSize: 12
    }
  }, React.createElement(FinLearnWordmark, { size: 15 })), /*#__PURE__*/React.createElement("div", {
    className: "text-zinc-500 font-semibold",
    style: {
      fontSize: 10
    }
  }, "Financial Calculator \xB7 BA-compatible")), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "w-7 h-7 rounded-full bg-zinc-700 active:bg-zinc-500 flex items-center justify-center transition-colors"
  }, /*#__PURE__*/React.createElement(X, {
    size: 14,
    className: "text-zinc-300"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "rounded-xl p-3 mb-3 border-4 border-zinc-800 shadow-inner",
    style: {
      background: '#9aa88a'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between font-bold text-zinc-700",
    style: {
      fontSize: 9,
      height: 14
    }
  }, /*#__PURE__*/React.createElement("span", null, S.second ? '2ND' : ''), /*#__PURE__*/React.createElement("span", null, S.bgn ? 'BGN' : ''), /*#__PURE__*/React.createElement("span", null, S.cpt ? 'CPT' : ''), /*#__PURE__*/React.createElement("span", null, S.ws || (S.pyEdit ? 'P/Y' : '')), /*#__PURE__*/React.createElement("span", null, "DEC ", S.dec === 9 ? 'F' : S.dec)), /*#__PURE__*/React.createElement("div", {
    className: "text-right font-mono text-zinc-700 truncate",
    style: {
      fontSize: 11,
      height: 16
    }
  }, S.label), /*#__PURE__*/React.createElement("div", {
    className: "text-right font-mono font-bold text-zinc-900 truncate",
    style: {
      fontSize: 28,
      lineHeight: 1,
      letterSpacing: '-0.5px'
    }
  }, S.display)), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-5 gap-1.5"
  }, /*#__PURE__*/React.createElement(CalcKey, {
    main: "2ND",
    kind: S.second ? 'hot' : 'op',
    onAct: () => {
      S.second = !S.second;
      R();
    }
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "CPT",
    kind: "hot",
    onAct: cptKey
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "ENTER",
    sub: "SET",
    kind: "func",
    onAct: pressEnter
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "\u2191",
    sub: "DEL",
    kind: "func",
    onAct: () => move(-1)
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "\u2193",
    sub: "INS",
    kind: "func",
    onAct: () => move(1)
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "CF",
    sub: "CLR WORK",
    kind: "func",
    onAct: cfKey
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "NPV",
    kind: "func",
    onAct: () => openWs('NPV')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "IRR",
    kind: "func",
    onAct: irrKey
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "\u2190",
    kind: "func",
    onAct: back
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "CE|C",
    sub: "QUIT",
    kind: "func",
    onAct: clear
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "N",
    sub: "xP/Y",
    kind: "tvm",
    onAct: () => tvmKey('N')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "I/Y",
    sub: "P/Y",
    kind: "tvm",
    onAct: () => tvmKey('IY')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "PV",
    sub: "AMORT",
    kind: "tvm",
    onAct: () => tvmKey('PV')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "PMT",
    sub: "BGN",
    kind: "tvm",
    onAct: () => tvmKey('PMT')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "FV",
    sub: "CLR TVM",
    kind: "tvm",
    onAct: () => tvmKey('FV')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "%",
    sub: "DATE",
    kind: "func",
    onAct: pct
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "\u221Ax",
    kind: "func",
    onAct: sqrt
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "x\xB2",
    kind: "func",
    onAct: sq
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "1/x",
    kind: "func",
    onAct: recip
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "\xF7",
    sub: "RAND",
    kind: "op",
    onAct: () => doOp('÷')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "STO",
    kind: "func",
    onAct: () => {
      S.memFlag = 'STO';
      R();
    }
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "7",
    sub: "DATA",
    onAct: () => num('7')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "8",
    sub: "STAT",
    onAct: () => num('8')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "9",
    sub: "BOND",
    onAct: () => num('9')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "\xD7",
    sub: "x!",
    kind: "op",
    onAct: () => doOp('×')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "RCL",
    kind: "func",
    onAct: () => {
      S.memFlag = 'RCL';
      R();
    }
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "4",
    sub: "DEPR",
    onAct: () => num('4')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "5",
    sub: "BRKEVN",
    onAct: () => num('5')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "6",
    sub: "ICONV",
    onAct: () => num('6')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "\u2212",
    kind: "op",
    onAct: () => doOp('−')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "LN",
    sub: "e\u02E3",
    kind: "func",
    onAct: ln
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "1",
    onAct: () => num('1')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "2",
    onAct: () => num('2')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "3",
    onAct: () => num('3')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "+",
    kind: "op",
    onAct: () => doOp('+')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "y\u02E3",
    kind: "func",
    onAct: () => doOp('yˣ')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "0",
    sub: "MEM",
    onAct: () => num('0')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: ".",
    sub: "FORMAT",
    onAct: dot
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "+/\u2212",
    onAct: plusMinus
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "=",
    sub: "ANS",
    kind: "go",
    onAct: equals
  })), S.memFlag && /*#__PURE__*/React.createElement("div", {
    className: "mt-2 text-center text-amber-400 font-bold",
    style: {
      fontSize: 10
    }
  }, S.memFlag, ": premi una cifra (0\\u20139)"), /*#__PURE__*/React.createElement("div", {
    className: "mt-2.5 text-zinc-500 text-center",
    style: {
      fontSize: 9,
      lineHeight: 1.5
    }
  }, "TVM: valore\u2192tasto \xB7 CPT\u2192tasto per calcolare \xB7 2ND I/Y = P/Y (\u2191\u2193 per C/Y) \xB7 2ND PMT = BGN", /*#__PURE__*/React.createElement("br", null), "Worksheet (2ND + cifra): DATA\xB7STAT\xB7BOND\xB7DEPR\xB7BRKEVN\xB7ICONV\xB7MEM | 2ND % = DATE | \u2191\u2193 naviga \xB7 ENTER salva \xB7 ENTER sui setting = cambia \xB7 2ND CE|C esce", /*#__PURE__*/React.createElement("br", null), "Date in formato MM.DDYY (es. 06.1526 = 15 giu 2026)")));
}

// ========== AI ON-DEVICE: modello locale nel browser (transformers.js, zero config) ==========
let _devicePipePromise = null;
function loadDeviceModel(onProgress) {
  if (!_devicePipePromise) {
    _devicePipePromise = (async () => {
      const {
        pipeline
      } = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.3.1');
      const device = typeof navigator !== 'undefined' && navigator.gpu ? 'webgpu' : 'wasm';
      return pipeline('text-generation', 'onnx-community/Qwen2.5-0.5B-Instruct', {
        dtype: 'q4',
        device,
        progress_callback: p => {
          if (p.status === 'progress' && p.total) onProgress?.(Math.min(99, Math.round(p.loaded / p.total * 100)), p.file || '');
          if (p.status === 'done') onProgress?.(100, p.file || '');
        }
      });
    })().catch(e => {
      _devicePipePromise = null;
      throw e;
    });
  }
  return _devicePipePromise;
}

// ========== AI CHAT MODAL WITH REAL ANTHROPIC API ==========
function AiChatModal({
  onClose,
  chatId,
  chats,
  setChats,
  currentQuestion
}) {
  const [msg, setMsg] = useState('');
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState(null);
  // ---- motore AI: 'claude' (integrato) oppure 'ollama' (modello locale sul tuo computer) ----
  const [engine, setEngine] = useState('claude');
  const [showCfg, setShowCfg] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState('idle'); // idle | loading | ready | error
  const [deviceProgress, setDeviceProgress] = useState(0);
  const [deviceFile, setDeviceFile] = useState('');
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState('llama3.1:8b');
  const chatEndRef = useRef(null);

  // Deriva chat corrente da chats
  const currentChat = chats.find(c => c.id === chatId);
  const chat = currentChat?.messages || [];
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [chat, typing]);

  // System prompt per il tutor CFA
  const getSystemPrompt = () => {
    let prompt = `Sei FinLearn AI Coach 🐂, un tutor esperto per la preparazione all'esame CFA Level 1.

REGOLE FONDAMENTALI:
- Rispondi SEMPRE in italiano
- Sii conciso ma esaustivo (max 150 parole per risposta)
- Usa emoji per rendere le spiegazioni più engaging
- Se l'utente chiede aiuto su una domanda, NON dare la risposta diretta
- Guida il ragionamento con domande socratiche
- Usa esempi pratici e mnemonici

TONO:
- Incoraggiante ma professionale
- Usa "tu" informale
- Celebra i progressi dell'utente

FORMATO:
- Usa bullet points per liste
- Evidenzia formule importanti
- Includi mnemonici quando utili`;
    if (currentQuestion) {
      prompt += `

CONTESTO DOMANDA ATTUALE:
Domanda: "${currentQuestion.q}"
Opzioni: ${currentQuestion.opts.map((o, i) => `${String.fromCharCode(65 + i)}) ${o}`).join(', ')}
Topic: ${currentQuestion.topic || 'Fixed Income'}

IMPORTANTE: Se l'utente chiede aiuto su questa domanda, guida il ragionamento senza rivelare la risposta. Puoi spiegare i concetti teorici correlati.`;
    }
    return prompt;
  };

  // Chiamata API Anthropic reale
  const callAnthropicAPI = async (userMessage, conversationHistory) => {
    try {
      // Costruisci la history per l'API
      const messages = conversationHistory.filter(m => m.role === 'user' || m.role === 'assistant').map(m => ({
        role: m.role,
        content: m.content
      }));

      // Aggiungi il nuovo messaggio
      messages.push({
        role: 'user',
        content: userMessage
      });
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          system: getSystemPrompt(),
          messages: messages
        })
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
      }
      const data = await response.json();

      // Estrai il testo dalla risposta
      const assistantMessage = data.content.filter(block => block.type === 'text').map(block => block.text).join('\n');
      return assistantMessage || 'Mi dispiace, non ho ricevuto una risposta valida.';
    } catch (err) {
      console.error('Anthropic API Error:', err);
      throw err;
    }
  };

  // Chiamata a modello LOCALE via Ollama (https://ollama.com) — gira sul tuo computer
  const callOllamaAPI = async (userMessage, conversationHistory) => {
    const messages = [{
      role: 'system',
      content: getSystemPrompt()
    }, ...conversationHistory.filter(m => m.role === 'user' || m.role === 'assistant').map(m => ({
      role: m.role,
      content: m.content
    })), {
      role: 'user',
      content: userMessage
    }];
    const response = await fetch(`${ollamaUrl.replace(/\/$/, '')}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: ollamaModel,
        messages,
        stream: false,
        options: {
          num_predict: 500
        }
      })
    });
    if (!response.ok) {
      const t = await response.text().catch(() => '');
      throw new Error(`Ollama ${response.status}: ${t.slice(0, 120)}`);
    }
    const data = await response.json();
    return data.message?.content || 'Risposta vuota dal modello locale.';
  };

  // Generazione ON-DEVICE: il modello gira dentro il browser, nessun server
  const callDeviceAPI = async (userMessage, conversationHistory) => {
    if (deviceStatus !== 'ready') setDeviceStatus('loading');
    const pipe = await loadDeviceModel((pct, file) => {
      setDeviceProgress(pct);
      setDeviceFile(file);
    });
    setDeviceStatus('ready');
    const messages = [{
      role: 'system',
      content: getSystemPrompt() + '\nRispondi in modo breve (max 80 parole).'
    }, ...conversationHistory.slice(-6).filter(m => m.role === 'user' || m.role === 'assistant').map(m => ({
      role: m.role,
      content: m.content
    })), {
      role: 'user',
      content: userMessage
    }];
    const out = await pipe(messages, {
      max_new_tokens: 220,
      temperature: 0.7,
      do_sample: true
    });
    const gen = out?.[0]?.generated_text;
    const last = Array.isArray(gen) ? gen[gen.length - 1]?.content : String(gen || '');
    return last || 'Risposta vuota dal modello on-device.';
  };
  const sendMsg = async () => {
    if (!msg.trim() || typing) return;
    const userMessage = {
      role: 'user',
      content: msg.trim(),
      timestamp: new Date().toISOString()
    };

    // Aggiungi messaggio utente a chats
    setChats(prev => prev.map(c => {
      if (c.id === chatId) {
        return {
          ...c,
          messages: [...c.messages, userMessage],
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    }));
    const currentMsg = msg;
    const currentHistory = [...chat];
    setMsg('');
    setTyping(true);
    setError(null);
    try {
      const aiResponse = engine === 'ollama' ? await callOllamaAPI(currentMsg, currentHistory) : engine === 'device' ? await callDeviceAPI(currentMsg, currentHistory) : await callAnthropicAPI(currentMsg, currentHistory);

      // Aggiungi risposta AI a chats
      setChats(prev => prev.map(c => {
        if (c.id === chatId) {
          return {
            ...c,
            messages: [...c.messages, {
              role: 'assistant',
              content: aiResponse,
              timestamp: new Date().toISOString()
            }],
            updatedAt: new Date().toISOString()
          };
        }
        return c;
      }));
    } catch (err) {
      if (engine === 'device') setDeviceStatus('error');
      setError(engine === 'device' ? "Il modello on-device non si è caricato. Nell'anteprima di claude.ai il download è bloccato dalla sandbox: usa questo motore nella versione pubblicata (PWA/GitHub Pages), oppure resta su Claude." : engine === 'ollama' ? `Non raggiungo Ollama su ${ollamaUrl}. Verifica che sia avviato (\`ollama serve\`) e lanciato con OLLAMA_ORIGINS="*", e che il modello \`${ollamaModel}\` sia scaricato (\`ollama pull ${ollamaModel}\`).` : 'Errore di connessione al motore Claude. Riprova.');
      console.error('Chat error:', err);
    } finally {
      setTyping(false);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/50 z-50 flex items-end justify-center",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white w-full max-w-xl rounded-t-3xl flex flex-col animate-slide-up",
    style: {
      height: '75vh'
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between p-4 border-b border-slate-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-xl"
  }, "\uD83D\uDC02"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "font-bold text-slate-800"
  }, "AI Coach"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-emerald-600 flex items-center gap-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2 h-2 bg-emerald-500 rounded-full animate-pulse"
  }), engine === 'ollama' ? `Ollama · ${ollamaModel}` : engine === 'device' ? `On-device · Qwen2.5-0.5B ${deviceStatus === 'ready' ? '· pronto' : ''}` : 'Claude (integrato)'))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex rounded-full bg-slate-100 p-0.5"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setEngine('claude'),
    className: `px-2.5 py-1 rounded-full font-bold transition ${engine === 'claude' ? 'bg-white shadow text-amber-600' : 'text-slate-500'}`,
    style: {
      fontSize: 11
    }
  }, "Claude"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setEngine('device'),
    className: `px-2.5 py-1 rounded-full font-bold transition ${engine === 'device' ? 'bg-white shadow text-amber-600' : 'text-slate-500'}`,
    style: {
      fontSize: 11
    }
  }, "On-device"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setEngine('ollama');
      setShowCfg(true);
    },
    className: `px-2.5 py-1 rounded-full font-bold transition ${engine === 'ollama' ? 'bg-white shadow text-amber-600' : 'text-slate-500'}`,
    style: {
      fontSize: 11
    }
  }, "Ollama")), engine === 'ollama' && /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowCfg(s => !s),
    className: "p-1.5 hover:bg-slate-100 rounded-full",
    title: "Configura Ollama"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15
    }
  }, "\u2699\uFE0F")), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "p-2 hover:bg-slate-100 rounded-full"
  }, /*#__PURE__*/React.createElement(X, {
    size: 24,
    className: "text-slate-600"
  })))), engine === 'ollama' && showCfg && /*#__PURE__*/React.createElement("div", {
    className: "px-4 py-3 bg-slate-50 border-b border-slate-200 space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-500 mb-0.5",
    style: {
      fontSize: 10
    }
  }, "URL OLLAMA"), /*#__PURE__*/React.createElement("input", {
    value: ollamaUrl,
    onChange: e => setOllamaUrl(e.target.value),
    className: "w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700",
    style: {
      fontSize: 12
    },
    placeholder: "http://localhost:11434"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-500 mb-0.5",
    style: {
      fontSize: 10
    }
  }, "MODELLO"), /*#__PURE__*/React.createElement("input", {
    value: ollamaModel,
    onChange: e => setOllamaModel(e.target.value),
    className: "w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700",
    style: {
      fontSize: 12
    },
    placeholder: "llama3.1:8b"
  }))), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-400 leading-snug",
    style: {
      fontSize: 10
    }
  }, "Sul computer: installa Ollama, poi ", /*#__PURE__*/React.createElement("code", {
    className: "bg-slate-200 px-1 rounded"
  }, "OLLAMA_ORIGINS=\"*\" ollama serve"), " e ", /*#__PURE__*/React.createElement("code", {
    className: "bg-slate-200 px-1 rounded"
  }, "ollama pull ", ollamaModel || 'llama3.1:8b'), ". Da iPhone usa l'IP del computer (es. http://192.168.1.10:11434).")), engine === 'device' && deviceStatus !== 'ready' && /*#__PURE__*/React.createElement("div", {
    className: "px-4 py-3 bg-slate-50 border-b border-slate-200"
  }, deviceStatus === 'loading' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between mb-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-slate-600",
    style: {
      fontSize: 11
    }
  }, "Scarico il modello (solo la prima volta)\u2026"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-amber-600",
    style: {
      fontSize: 11
    }
  }, deviceProgress, "%")), /*#__PURE__*/React.createElement("div", {
    className: "h-1.5 rounded-full bg-slate-200 overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all",
    style: {
      width: `${deviceProgress}%`
    }
  })), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-400 truncate mt-1",
    style: {
      fontSize: 9
    }
  }, deviceFile)) : /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500 leading-snug",
    style: {
      fontSize: 11
    }
  }, "\uD83E\uDDE0 Modello ", /*#__PURE__*/React.createElement("b", null, "Qwen2.5-0.5B"), " eseguito ", /*#__PURE__*/React.createElement("b", null, "dentro il browser"), " (WebGPU/WASM): nessuna installazione, nessuna chiave. ~350MB scaricati una sola volta al primo messaggio, poi resta in cache e funziona anche offline. Qualit\xE0 da mini-modello: ottimo per hint e definizioni rapide.")), currentQuestion && /*#__PURE__*/React.createElement("div", {
    className: "px-4 py-2 bg-amber-50 border-b border-amber-100"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-amber-700 font-medium truncate"
  }, "\uD83D\uDCDD Domanda: ", currentQuestion.q.substring(0, 60), "...")), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-y-auto p-4 space-y-3"
  }, chat.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "text-center py-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-5xl mb-4"
  }, "\uD83D\uDC02"), /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-slate-800 mb-2"
  }, "Ciao! Sono il tuo AI Coach"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500 text-sm mb-4"
  }, "Posso aiutarti a capire i concetti senza darti le risposte dirette."), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap justify-center gap-2"
  }, ['Spiegami il concetto', 'Dammi un hint', 'Non capisco'].map(suggestion => /*#__PURE__*/React.createElement("button", {
    key: suggestion,
    onClick: () => setMsg(suggestion),
    className: "px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-sm text-slate-600 transition"
  }, suggestion)))), chat.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: `max-w-[85%] rounded-2xl p-3 ${m.role === 'user' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700'}`
  }, /*#__PURE__*/React.createElement("p", {
    className: "whitespace-pre-wrap"
  }, m.content)))), typing && /*#__PURE__*/React.createElement("div", {
    className: "flex justify-start"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-slate-100 rounded-2xl p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-2 h-2 bg-amber-400 rounded-full animate-bounce"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-2 h-2 bg-amber-400 rounded-full animate-bounce",
    style: {
      animationDelay: '0.1s'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-2 h-2 bg-amber-400 rounded-full animate-bounce",
    style: {
      animationDelay: '0.2s'
    }
  })))), error && /*#__PURE__*/React.createElement("div", {
    className: "flex justify-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-rose-50 text-rose-600 rounded-xl px-4 py-2 text-sm"
  }, "\u26A0\uFE0F ", error)), /*#__PURE__*/React.createElement("div", {
    ref: chatEndRef
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-4 border-t border-slate-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: msg,
    onChange: e => setMsg(e.target.value),
    onKeyDown: e => e.key === 'Enter' && !e.shiftKey && sendMsg(),
    placeholder: "Chiedimi qualcosa...",
    disabled: typing,
    className: "flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 disabled:bg-slate-50"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: sendMsg,
    disabled: !msg.trim() || typing,
    className: "px-4 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
  }, /*#__PURE__*/React.createElement(Send, {
    size: 20
  }))))));
}

// ========== PRO UPGRADE MODAL ==========
function ProModal({
  onClose,
  onUpgrade
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 p-6 text-white text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-5xl mb-3"
  }, "\uD83D\uDC51"), /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl font-black"
  }, "FinLearn PRO"), /*#__PURE__*/React.createElement("p", {
    className: "text-white/80 mt-1"
  }, "Sblocca tutto il potenziale")), /*#__PURE__*/React.createElement("div", {
    className: "p-6 space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-xl"
  }, "\uD83D\uDCDD"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-slate-800"
  }, "Mock Exam Completi"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500 text-sm"
  }, "180 domande, 3 ore, identico all'esame CFA reale"))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-xl"
  }, "\uD83C\uDFC6"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-slate-800"
  }, "+500 XP per Mock"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500 text-sm"
  }, "Domina la classifica e diventa #1"))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl"
  }, "\uD83D\uDCCA"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-slate-800"
  }, "Analytics Avanzati"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500 text-sm"
  }, "Scopri i tuoi punti deboli e migliorali"))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl"
  }, "\uD83E\uDD16"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-slate-800"
  }, "AI Coach Illimitato"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500 text-sm"
  }, "Chiedi tutto quello che vuoi, sempre")))), /*#__PURE__*/React.createElement("div", {
    className: "px-6 pb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-slate-500 text-sm line-through"
  }, "\u20AC39.99/mese"), /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-black text-slate-800"
  }, "\u20AC19.99", /*#__PURE__*/React.createElement("span", {
    className: "text-base font-normal text-slate-500"
  }, "/mese"))), /*#__PURE__*/React.createElement("div", {
    className: "bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full"
  }, "-50%")), /*#__PURE__*/React.createElement("p", {
    className: "text-amber-700 text-xs mt-2"
  }, "\uD83D\uDD25 Offerta limitata per i primi 100 utenti")), /*#__PURE__*/React.createElement("button", {
    onClick: onUpgrade,
    className: "w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-500/30 text-lg"
  }, "SBLOCCA PRO \uD83D\uDC51"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "w-full py-3 text-slate-500 font-medium mt-2 hover:text-slate-700 transition"
  }, "Magari dopo"))));
}

// ========== MAIN APP (requires auth) ==========
function MainApp({
  user,
  userData,
  onLogout,
  onSaveProgress
}) {
  const [section, setSection] = useState('home');
  const [showCalc, setShowCalc] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);
  const [completed, setCompleted] = useState(userData?.completedLessons || []);
  const [activeLesson, setActiveLesson] = useState(userData?.activeLesson || 1);
  const [quiz, setQuiz] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [topic, setTopic] = useState(null);
  const [tab, setTab] = useState('theory');
  const [cardIdx, setCardIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [streak, setStreak] = useState(0);
  const [timerOn, setTimerOn] = useState(userData?.settings?.timerEnabled || false);
  const [timer, setTimer] = useState(null);

  // CFA Curriculum states
  const [studyMode, setStudyMode] = useState('curriculum');
  const [cfaTopic, setCfaTopic] = useState(null);
  const [cfaModule, setCfaModule] = useState(null);
  const [cfaLOS, setCfaLOS] = useState(null);
  const [expandedSection, setExpandedSection] = useState(0);
  const [losProgress, setLosProgress] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('finlearn_los_progress') || '[]');
    } catch {
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem('finlearn_los_progress', JSON.stringify(losProgress));
  }, [losProgress]);
  // dall'album: apre la LOS nel lettore di Studia
  const openLOSFromAlbum = it => {
    setSection('library'); setStudyMode('curriculum'); setTopic(null);
    setCfaTopic(CFA_CURRICULUM[it.tk]); setCfaModule(it.mod); setCfaLOS({ ...it.los, index: it.idx }); setExpandedSection(0);
    try { window.scrollTo(0, 0); } catch (e) {}
  };

  // Theme state con persistenza
  const [theme, setTheme] = useState(() => {
    try {
      // Restyling "Figurine" (ott 2026): il tema chiaro diventa quello di partenza, una volta sola
      if (!localStorage.getItem('finlearn_fig')) { localStorage.setItem('finlearn_fig', '1'); localStorage.setItem('finlearn_theme', 'light'); return 'light'; }
      const saved = localStorage.getItem('finlearn_theme');
      return saved || 'light';
    } catch {
      return 'light';
    }
  });

  // Salva theme quando cambia
  useEffect(() => {
    try { localStorage.setItem('finlearn_theme', theme); } catch {}
    document.documentElement.classList.toggle('fl-dark', theme === 'dark');
    document.documentElement.classList.toggle('fl-fig', theme !== 'dark');
  }, [theme]);
  // la schermata di accesso resta col suo stile: togli la skin quando MainApp si smonta (logout)
  useEffect(() => () => document.documentElement.classList.remove('fl-fig'), []);

  // Theme colors helper
  const th = theme === 'dark' ? {
    bg: '#070b14',
    bgSecondary: '#0b1322',
    card: 'rgba(13, 20, 38, 0.7)',
    cardBorder: 'rgba(232, 185, 49, 0.14)',
    text: '#f8fafc',
    textMuted: '#7c89a3',
    textSecondary: '#b8c2d6',
    inputBg: 'rgba(5, 8, 16, 0.5)',
    inputBorder: 'rgba(232, 185, 49, 0.16)',
    navBg: 'rgba(7, 11, 20, 0.85)',
    navBorder: 'rgba(232, 185, 49, 0.12)',
    overlay: 'rgba(4, 6, 13, 0.9)',
    chatBubbleAi: 'rgba(13, 20, 38, 0.8)',
    chatBubbleUser: '#f59e0b'
  } : {
    bg: '#F4F6FA',
    bgSecondary: '#ffffff',
    card: '#ffffff',
    cardBorder: '#1A1A1A',
    text: '#151515',
    textMuted: '#4A4F5A',
    textSecondary: '#2E333D',
    inputBg: '#ffffff',
    inputBorder: '#1A1A1A',
    navBg: '#ffffff',
    navBorder: '#1A1A1A',
    overlay: 'rgba(255, 255, 255, 0.95)',
    chatBubbleAi: '#ffffff',
    chatBubbleUser: '#f59e0b'
  };

  // Chat history system - replaces simple chat state
  const [chats, setChats] = useState(() => {
    try {
      const saved = localStorage.getItem(`finlearn_chats_${user?.uid || 'guest'}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeChatId, setActiveChatId] = useState(null);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [msg, setMsg] = useState('');
  const [typing, setTyping] = useState(false);

  // Derived state - current chat messages
  const currentChat = chats.find(c => c.id === activeChatId);
  const chat = currentChat?.messages || [];
  const [stats, setStats] = useState(userData?.stats || {
    streak: 0,
    coins: 0,
    level: 1,
    xp: 0,
    quizzes: 0,
    correct: 0,
    cards: 0
  });
  const [eqOpen, setEqOpen] = useState(false);
  const [eqRewarded, setEqRewarded] = useState([]);
  const [quizCorrect, setQuizCorrect] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({}); // Track all answers: { index: { selected, isCorrect } }
  const [showQuizChat, setShowQuizChat] = useState(false);
  const [quizChatId, setQuizChatId] = useState(null); // ID della chat quiz attiva (usa sistema chats unificato)

  // ========== MOCK EXAM AI SYSTEM ==========
  const [mockExamState, setMockExamState] = useState({
    active: false,
    loading: false,
    questions: [],
    currentIndex: 0,
    answers: [],
    timeRemaining: 0,
    sessionTopic: null,
    examConfig: null,
    results: null,
    error: null,
    flagged: [],
    isFullExam: false
  });

  // CFA Topics per Mock Exam
  const CFA_TOPICS = [{
    id: 'ethics',
    name: 'Ethics & Professional Standards',
    weight: 15,
    icon: '⚖️'
  }, {
    id: 'quant',
    name: 'Quantitative Methods',
    weight: 10,
    icon: '📊'
  }, {
    id: 'economics',
    name: 'Economics',
    weight: 10,
    icon: '🌐'
  }, {
    id: 'fra',
    name: 'Financial Reporting & Analysis',
    weight: 15,
    icon: '📈'
  }, {
    id: 'corporate',
    name: 'Corporate Issuers',
    weight: 10,
    icon: '🏢'
  }, {
    id: 'equity',
    name: 'Equity Investments',
    weight: 11,
    icon: '📉'
  }, {
    id: 'fixed',
    name: 'Fixed Income',
    weight: 11,
    icon: '💵'
  }, {
    id: 'derivatives',
    name: 'Derivatives',
    weight: 6,
    icon: '🔄'
  }, {
    id: 'alternatives',
    name: 'Alternative Investments',
    weight: 6,
    icon: '🏠'
  }, {
    id: 'portfolio',
    name: 'Portfolio Management',
    weight: 6,
    icon: '💼'
  }];

  // Mock Exam Setup State
  const [showMockExamSetup, setShowMockExamSetup] = useState(false);
  const [mockExamConfig, setMockExamConfig] = useState({
    numQuestions: 10,
    timeLimit: 15,
    selectedTopics: [{
      id: 'ethics',
      name: 'Ethics & Professional Standards',
      weight: 15,
      icon: '⚖️'
    }, {
      id: 'fixed',
      name: 'Fixed Income',
      weight: 11,
      icon: '💵'
    }, {
      id: 'equity',
      name: 'Equity Investments',
      weight: 11,
      icon: '📉'
    }],
    difficulty: 2
  });

  // Generate questions via AI
  const generateMockQuestions = async config => {
    const {
      numQuestions,
      topics,
      difficulty
    } = config;

    // Build prompt for Claude
    const topicsList = topics.map(t => t.name).join(', ');
    const prompt = `You are a CFA Level 1 exam question generator. Generate ${numQuestions} multiple choice questions.

REQUIREMENTS:
- Topics to cover: ${topicsList}
- Difficulty: ${difficulty} (1=easy, 2=medium, 3=hard)
- Each question must have exactly 4 options (A, B, C, D)
- Only ONE correct answer per question
- Include calculations where appropriate
- Questions should match real CFA exam style and difficulty

RESPOND ONLY WITH A VALID JSON ARRAY, no other text:
[
  {
    "topic": "Fixed Income",
    "q": "A bond has a coupon rate of 6% and currently trades at 95. What is the current yield?",
    "opts": ["5.68%", "6.00%", "6.32%", "6.67%"],
    "ans": 2,
    "exp": "Current Yield = Annual Coupon / Current Price = 6/95 = 6.32%. The current yield is higher than the coupon rate because the bond trades at a discount."
  }
]

Generate exactly ${numQuestions} questions now:`;
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          messages: [{
            role: 'user',
            content: prompt
          }]
        })
      });
      const data = await response.json();
      const content = data.content?.[0]?.text || '';

      // Parse JSON from response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('Invalid response format');
      const questions = JSON.parse(jsonMatch[0]);
      return questions;
    } catch (err) {
      console.error('Error generating questions:', err);
      throw err;
    }
  };

  // ========== FULL EXAM CONFIG ==========
  const CFA_FULL_EXAM_CONFIG = {
    totalQuestions: 180,
    timeMinutes: 270,
    passingScore: 70,
    distribution: {
      ethics: 33,
      fra: 25,
      equity: 20,
      fixed: 20,
      quant: 16,
      economics: 16,
      portfolio: 14,
      alternatives: 13,
      corporate: 12,
      derivatives: 11
    }
  };

  // ========== PRE-BUILT CFA QUESTION BANK ==========
  const CFA_QUESTION_BANK = {
    ethics: [{
      topic: "Ethics",
      q: "According to the CFA Institute Code of Ethics, members must place the integrity of the investment profession and the interests of clients above:",
      opts: ["Their own personal interests", "The interests of their employer", "Both A and B", "Neither A nor B"],
      ans: 2,
      exp: "The Code of Ethics requires members to place client interests and professional integrity above both personal interests and employer interests."
    }, {
      topic: "Ethics",
      q: "A CFA charterholder receives material nonpublic information about a company. According to Standard II(A), which action is most appropriate?",
      opts: ["Trade immediately before the information becomes public", "Share the information only with preferred clients", "Refrain from trading until the information is public", "Trade in small amounts to avoid detection"],
      ans: 2,
      exp: "Standard II(A) Material Nonpublic Information prohibits trading on or causing others to trade on material nonpublic information."
    }, {
      topic: "Ethics",
      q: "Which of the following best describes the fiduciary duty of a portfolio manager?",
      opts: ["Maximizing returns regardless of risk", "Acting in the best interest of the client", "Following all client instructions without question", "Minimizing taxes at all costs"],
      ans: 1,
      exp: "Fiduciary duty requires acting in the client's best interest, which includes considering risk tolerance, investment objectives, and suitability."
    }, {
      topic: "Ethics",
      q: "Standard III(B) Fair Dealing requires investment recommendations to be:",
      opts: ["Given first to the largest clients", "Disseminated fairly to all clients", "Shared only with institutional clients", "Provided based on commission levels"],
      ans: 1,
      exp: "Fair Dealing requires that investment recommendations and actions be disseminated to all clients in a fair manner, without favoring any client over another."
    }, {
      topic: "Ethics",
      q: "A research analyst owns shares in a company she covers. According to CFA Standards, she must:",
      opts: ["Sell all shares immediately", "Disclose the ownership in research reports", "Stop covering the company", "Transfer shares to a family member"],
      ans: 1,
      exp: "Standard VI(A) requires disclosure of conflicts of interest, including beneficial ownership of securities being recommended."
    }],
    fixed: [{
      topic: "Fixed Income",
      q: "A bond with a 5% coupon rate is trading at 102. The current yield is closest to:",
      opts: ["4.90%", "5.00%", "5.10%", "4.80%"],
      ans: 0,
      exp: "Current Yield = Annual Coupon / Price = 5/102 = 4.90%. When a bond trades at a premium, current yield is less than coupon rate."
    }, {
      topic: "Fixed Income",
      q: "Which of the following bonds has the highest interest rate risk?",
      opts: ["5-year, 8% coupon", "10-year, 8% coupon", "10-year, 4% coupon", "5-year, 4% coupon"],
      ans: 2,
      exp: "Interest rate risk increases with longer maturity and lower coupon rates. The 10-year, 4% coupon bond has both characteristics."
    }, {
      topic: "Fixed Income",
      q: "Macaulay duration of a zero-coupon bond equals:",
      opts: ["Zero", "Half its maturity", "Its maturity", "Twice its maturity"],
      ans: 2,
      exp: "For a zero-coupon bond, Macaulay duration equals its time to maturity because all cash flows occur at maturity."
    }, {
      topic: "Fixed Income",
      q: "If interest rates increase by 100 basis points, a bond with modified duration of 7 will change in price by approximately:",
      opts: ["+7%", "-7%", "+0.7%", "-0.7%"],
      ans: 1,
      exp: "Price change ≈ -Modified Duration × ΔYield = -7 × 0.01 = -7%. Bond prices move inversely to interest rates."
    }, {
      topic: "Fixed Income",
      q: "A callable bond compared to an otherwise identical non-callable bond will have:",
      opts: ["Higher price", "Lower yield", "Negative convexity at low yields", "Higher duration"],
      ans: 2,
      exp: "Callable bonds exhibit negative convexity when yields are low because the call option limits price appreciation."
    }, {
      topic: "Fixed Income",
      q: "The Z-spread is the spread that when added to each spot rate on the benchmark curve makes the present value of the bond's cash flows equal to its:",
      opts: ["Par value", "Face value", "Market price", "Coupon payment"],
      ans: 2,
      exp: "The Z-spread (zero-volatility spread) is the constant spread added to Treasury spot rates to discount a bond's cash flows to its market price."
    }, {
      topic: "Fixed Income",
      q: "Which bond type has the least reinvestment risk?",
      opts: ["Coupon bond", "Zero-coupon bond", "Floating rate bond", "Callable bond"],
      ans: 1,
      exp: "Zero-coupon bonds have no reinvestment risk because there are no periodic coupon payments to reinvest."
    }],
    equity: [{
      topic: "Equity",
      q: "A company has a P/E ratio of 15 and earnings per share of $4. The stock price is:",
      opts: ["$45", "$60", "$75", "$30"],
      ans: 1,
      exp: "Stock Price = P/E × EPS = 15 × $4 = $60"
    }, {
      topic: "Equity",
      q: "The dividend discount model (DDM) is most appropriate for valuing:",
      opts: ["High-growth technology companies", "Mature dividend-paying companies", "Companies with negative earnings", "Start-up companies"],
      ans: 1,
      exp: "DDM works best for mature companies with stable, predictable dividends."
    }, {
      topic: "Equity",
      q: "If a stock has a beta of 1.5 and the market rises by 10%, the stock is expected to:",
      opts: ["Rise by 10%", "Rise by 15%", "Rise by 5%", "Fall by 15%"],
      ans: 1,
      exp: "Beta measures systematic risk. Expected return = Beta × Market Return = 1.5 × 10% = 15%."
    }, {
      topic: "Equity",
      q: "A stock trading at $50 with expected dividend of $2 and growth rate of 6%. Using Gordon Growth Model, required return is:",
      opts: ["8%", "10%", "12%", "6%"],
      ans: 1,
      exp: "r = (D1/P0) + g = (2/50) + 0.06 = 0.04 + 0.06 = 10%"
    }, {
      topic: "Equity",
      q: "Which ratio measures operational efficiency?",
      opts: ["Current ratio", "Debt-to-equity", "Asset turnover", "Price-to-book"],
      ans: 2,
      exp: "Asset turnover (Revenue/Total Assets) measures how efficiently a company uses its assets to generate sales."
    }, {
      topic: "Equity",
      q: "Free Cash Flow to Equity (FCFE) equals:",
      opts: ["CFO - CapEx", "CFO - CapEx + Net Borrowing", "Net Income + Depreciation", "EBITDA - Taxes"],
      ans: 1,
      exp: "FCFE = CFO - Capital Expenditures + Net Borrowing. It represents cash available to equity holders."
    }],
    quant: [{
      topic: "Quantitative Methods",
      q: "An investment of $1,000 grows to $1,610.51 over 5 years. The compound annual growth rate is closest to:",
      opts: ["8%", "10%", "12%", "15%"],
      ans: 1,
      exp: "CAGR = (FV/PV)^(1/n) - 1 = (1610.51/1000)^(1/5) - 1 = 10%"
    }, {
      topic: "Quantitative Methods",
      q: "A 95% confidence interval means:",
      opts: ["95% of data falls within the interval", "There's 95% probability the true parameter is in the interval", "The test has 95% power", "5% of samples will be outliers"],
      ans: 1,
      exp: "A 95% confidence interval means we are 95% confident that the true population parameter lies within the interval."
    }, {
      topic: "Quantitative Methods",
      q: "The coefficient of variation (CV) is calculated as:",
      opts: ["Mean / Standard Deviation", "Standard Deviation / Mean", "Variance / Mean", "Mean / Variance"],
      ans: 1,
      exp: "CV = Standard Deviation / Mean. It measures relative dispersion and allows comparison across different scales."
    }, {
      topic: "Quantitative Methods",
      q: "NPV of a project is $50,000 and IRR is 15%. If cost of capital is 12%, you should:",
      opts: ["Reject - NPV is too low", "Accept - positive NPV and IRR > cost of capital", "Reject - IRR is too high", "Need more information"],
      ans: 1,
      exp: "Accept because NPV > 0 and IRR (15%) > Cost of Capital (12%). Both criteria indicate value creation."
    }, {
      topic: "Quantitative Methods",
      q: "In a normal distribution, approximately what percentage of observations fall within ±2 standard deviations?",
      opts: ["68%", "95%", "99%", "90%"],
      ans: 1,
      exp: "For a normal distribution: ±1σ = 68%, ±2σ = 95%, ±3σ = 99.7%"
    }],
    economics: [{
      topic: "Economics",
      q: "If a country's currency depreciates, its exports will likely:",
      opts: ["Decrease", "Increase", "Stay the same", "Become more expensive"],
      ans: 1,
      exp: "Currency depreciation makes exports cheaper for foreign buyers, increasing export demand."
    }, {
      topic: "Economics",
      q: "The Phillips Curve shows the relationship between:",
      opts: ["GDP and interest rates", "Inflation and unemployment", "Supply and demand", "Savings and investment"],
      ans: 1,
      exp: "The Phillips Curve illustrates the inverse relationship between inflation and unemployment in the short run."
    }, {
      topic: "Economics",
      q: "Expansionary monetary policy typically leads to:",
      opts: ["Higher interest rates", "Lower money supply", "Increased borrowing and spending", "Currency appreciation"],
      ans: 2,
      exp: "Expansionary monetary policy lowers interest rates, encouraging borrowing and spending to stimulate the economy."
    }, {
      topic: "Economics",
      q: "GDP calculated using the expenditure approach equals:",
      opts: ["C + I + G + NX", "Wages + Rent + Interest + Profits", "Total output × Price level", "Income - Taxes + Transfers"],
      ans: 0,
      exp: "GDP (Expenditure) = Consumption + Investment + Government Spending + Net Exports (Exports - Imports)"
    }, {
      topic: "Economics",
      q: "A country running a current account deficit must have:",
      opts: ["A capital account deficit", "A capital account surplus", "A balanced capital account", "High inflation"],
      ans: 1,
      exp: "Balance of Payments must balance. Current Account Deficit = Capital Account Surplus (net capital inflow)."
    }],
    fra: [{
      topic: "Financial Reporting",
      q: "Under IFRS, inventory can be valued using:",
      opts: ["LIFO only", "FIFO or weighted average cost", "LIFO, FIFO, or weighted average", "FIFO only"],
      ans: 1,
      exp: "IFRS prohibits LIFO. Only FIFO and weighted average cost methods are permitted."
    }, {
      topic: "Financial Reporting",
      q: "Straight-line depreciation compared to accelerated depreciation results in:",
      opts: ["Higher early-year expenses", "Lower early-year net income", "Higher early-year net income", "No difference in total depreciation"],
      ans: 2,
      exp: "Straight-line depreciation has lower early-year expenses than accelerated, resulting in higher early-year net income."
    }, {
      topic: "Financial Reporting",
      q: "Operating cash flow using the indirect method starts with:",
      opts: ["Revenue", "Gross profit", "Net income", "EBITDA"],
      ans: 2,
      exp: "The indirect method starts with net income and adjusts for non-cash items and changes in working capital."
    }, {
      topic: "Financial Reporting",
      q: "A company capitalizing an expense instead of expensing it will have:",
      opts: ["Lower current assets", "Higher current period income", "Lower total assets", "Higher current period expenses"],
      ans: 1,
      exp: "Capitalizing creates an asset and defers expense recognition, resulting in higher current income."
    }, {
      topic: "Financial Reporting",
      q: "The quick ratio excludes which current asset?",
      opts: ["Cash", "Receivables", "Inventory", "Marketable securities"],
      ans: 2,
      exp: "Quick Ratio = (Current Assets - Inventory) / Current Liabilities. Inventory is excluded as it's less liquid."
    }],
    corporate: [{
      topic: "Corporate Issuers",
      q: "The weighted average cost of capital (WACC) is used to:",
      opts: ["Evaluate dividend policy", "Discount project cash flows", "Calculate earnings per share", "Determine stock price"],
      ans: 1,
      exp: "WACC represents the company's blended cost of capital and is used to discount project cash flows for capital budgeting decisions."
    }, {
      topic: "Corporate Issuers",
      q: "According to the pecking order theory, companies prefer financing in which order?",
      opts: ["Debt, equity, internal funds", "Internal funds, debt, equity", "Equity, debt, internal funds", "Internal funds, equity, debt"],
      ans: 1,
      exp: "Pecking order theory: Internal funds first (retained earnings), then debt, then equity as last resort."
    }, {
      topic: "Corporate Issuers",
      q: "A stock split will:",
      opts: ["Increase market capitalization", "Decrease share price proportionally", "Change the P/E ratio", "Affect total shareholder equity"],
      ans: 1,
      exp: "A stock split increases shares outstanding and decreases price proportionally, keeping market cap unchanged."
    }, {
      topic: "Corporate Issuers",
      q: "The agency problem refers to conflicts between:",
      opts: ["Creditors and regulators", "Managers and shareholders", "Shareholders and customers", "Employees and managers"],
      ans: 1,
      exp: "Agency problems arise when managers (agents) may not act in the best interests of shareholders (principals)."
    }],
    derivatives: [{
      topic: "Derivatives",
      q: "A call option is in-the-money when:",
      opts: ["Stock price < Strike price", "Stock price > Strike price", "Stock price = Strike price", "Time value > Intrinsic value"],
      ans: 1,
      exp: "A call option is in-the-money when the underlying stock price exceeds the strike price."
    }, {
      topic: "Derivatives",
      q: "The maximum loss for a buyer of a put option is:",
      opts: ["Unlimited", "Strike price minus premium", "Premium paid", "Stock price"],
      ans: 2,
      exp: "Option buyers can only lose the premium paid. Maximum loss = Premium."
    }, {
      topic: "Derivatives",
      q: "A forward contract differs from a futures contract because forwards are:",
      opts: ["Standardized and exchange-traded", "Customized and traded OTC", "Settled daily", "More liquid"],
      ans: 1,
      exp: "Forwards are customized, traded over-the-counter (OTC), and settled at maturity. Futures are standardized and exchange-traded."
    }, {
      topic: "Derivatives",
      q: "Put-call parity states that:",
      opts: ["Call + Put = Stock", "Stock + Put = Call + Bond", "Call + Bond = Put + Stock", "Stock + Call = Put + Bond"],
      ans: 1,
      exp: "Put-Call Parity: S + P = C + PV(X), or Stock + Put = Call + Present Value of Strike Price."
    }],
    portfolio: [{
      topic: "Portfolio Management",
      q: "Diversification reduces which type of risk?",
      opts: ["Systematic risk", "Unsystematic risk", "Market risk", "Interest rate risk"],
      ans: 1,
      exp: "Diversification reduces unsystematic (company-specific) risk. Systematic risk cannot be diversified away."
    }, {
      topic: "Portfolio Management",
      q: "The Capital Asset Pricing Model (CAPM) calculates:",
      opts: ["Total risk", "Expected return based on beta", "Portfolio variance", "Sharpe ratio"],
      ans: 1,
      exp: "CAPM: E(R) = Rf + β(Rm - Rf). It calculates expected return based on systematic risk (beta)."
    }, {
      topic: "Portfolio Management",
      q: "The efficient frontier represents portfolios that:",
      opts: ["Have the lowest risk", "Have the highest return", "Maximize return for each level of risk", "Are equally weighted"],
      ans: 2,
      exp: "The efficient frontier shows portfolios offering maximum return for each level of risk (or minimum risk for each return level)."
    }, {
      topic: "Portfolio Management",
      q: "A portfolio's Sharpe ratio of 0.8 compared to another with 0.5 indicates:",
      opts: ["Lower risk-adjusted return", "Higher risk-adjusted return", "Higher total return", "Lower total risk"],
      ans: 1,
      exp: "Higher Sharpe ratio = better risk-adjusted return. Sharpe = (Return - Risk-free rate) / Standard Deviation."
    }],
    alternatives: [{
      topic: "Alternative Investments",
      q: "Private equity funds typically have:",
      opts: ["Daily liquidity", "Lock-up periods of several years", "Publicly traded shares", "Low minimum investments"],
      ans: 1,
      exp: "Private equity funds typically have lock-up periods of 7-10 years with limited liquidity."
    }, {
      topic: "Alternative Investments",
      q: "Real estate investment offers which benefit?",
      opts: ["Perfect liquidity", "Inflation hedge", "No management required", "Guaranteed returns"],
      ans: 1,
      exp: "Real estate often serves as an inflation hedge because property values and rents tend to rise with inflation."
    }, {
      topic: "Alternative Investments",
      q: "Hedge funds differ from mutual funds primarily in their:",
      opts: ["Use of leverage and short selling", "Investment in stocks", "SEC registration requirements", "Fee structures only"],
      ans: 0,
      exp: "Hedge funds can use leverage, short selling, and derivatives—strategies typically restricted for mutual funds."
    }]
  };

  // Function to get questions from bank based on selected topics
  // Generate Full 180-question Mock Exam
  const generateFullMockExam = () => {
    const questions = [];
    const distribution = CFA_FULL_EXAM_CONFIG.distribution;
    Object.entries(distribution).forEach(([topicKey, count]) => {
      const topicQuestions = CFA_QUESTION_BANK[topicKey] || [];
      const shuffled = [...topicQuestions].sort(() => Math.random() - 0.5);
      let selected = shuffled.slice(0, Math.min(count, shuffled.length));

      // If not enough questions, repeat some
      while (selected.length < count && topicQuestions.length > 0) {
        const extra = [...topicQuestions].sort(() => Math.random() - 0.5);
        selected = [...selected, ...extra.slice(0, count - selected.length)];
      }
      questions.push(...selected);
    });
    return questions.sort(() => Math.random() - 0.5);
  };
  const getQuestionsFromBank = config => {
    const {
      numQuestions,
      selectedTopics,
      difficulty
    } = config;
    let allQuestions = [];

    // Gather questions from selected topics
    selectedTopics.forEach(topic => {
      const topicKey = topic.id;
      if (CFA_QUESTION_BANK[topicKey]) {
        allQuestions = [...allQuestions, ...CFA_QUESTION_BANK[topicKey]];
      }
    });

    // Shuffle questions
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);

    // Return requested number
    return shuffled.slice(0, Math.min(numQuestions, shuffled.length));
  };

  // Start Mock Exam - usa database locale per velocità istantanea
  const startMockExam = config => {
    // Usa le domande dal database locale - istantaneo!
    const questions = getQuestionsFromBank(config);
    if (questions.length === 0) {
      setMockExamState(prev => ({
        ...prev,
        loading: false,
        error: 'Nessuna domanda disponibile per i topic selezionati.'
      }));
      return;
    }
    setMockExamState({
      active: true,
      loading: false,
      questions,
      currentIndex: 0,
      answers: [],
      timeRemaining: config.timeLimit * 60,
      // convert minutes to seconds
      sessionTopic: config.topics,
      examConfig: config,
      results: null,
      error: null
    });
  };

  // Timer effect for Mock Exam
  useEffect(() => {
    if (!mockExamState.active || mockExamState.timeRemaining <= 0) return;
    const timer = setInterval(() => {
      setMockExamState(prev => {
        if (prev.timeRemaining <= 1) {
          // Time's up - auto submit
          clearInterval(timer);
          return {
            ...prev,
            timeRemaining: 0
          };
        }
        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [mockExamState.active]);

  // Submit answer in Mock Exam
  const submitMockAnswer = selectedIndex => {
    const currentQ = mockExamState.questions[mockExamState.currentIndex];
    const isCorrect = selectedIndex === currentQ.ans;
    const newAnswer = {
      questionIndex: mockExamState.currentIndex,
      selectedAnswer: selectedIndex,
      isCorrect,
      question: currentQ
    };
    setMockExamState(prev => ({
      ...prev,
      answers: [...prev.answers, newAnswer]
    }));
  };

  // Go to next question in Mock Exam
  const nextMockQuestion = () => {
    setMockExamState(prev => {
      if (prev.currentIndex >= prev.questions.length - 1) {
        // Exam finished - calculate results
        const correct = prev.answers.filter(a => a.isCorrect).length;
        const total = prev.questions.length;
        const percentage = Math.round(correct / total * 100);
        const passed = percentage >= 70;

        // Award XP
        const baseXP = 500;
        const bonusXP = passed ? 200 : 0;
        const totalXP = baseXP + bonusXP;

        // Update user stats
        setStats(s => ({
          ...s,
          xp: s.xp + totalXP,
          totalQuizzes: s.totalQuizzes + 1,
          correctAnswers: s.correctAnswers + correct,
          totalAnswers: s.totalAnswers + total
        }));
        return {
          ...prev,
          results: {
            correct,
            total,
            percentage,
            passed,
            xpEarned: totalXP,
            topicBreakdown: calculateTopicBreakdown(prev.answers, prev.questions)
          }
        };
      }
      return {
        ...prev,
        currentIndex: prev.currentIndex + 1
      };
    });
  };

  // Calculate topic breakdown for results
  const calculateTopicBreakdown = (answers, questions) => {
    const breakdown = {};
    answers.forEach((ans, i) => {
      const topic = questions[i]?.topic || 'General';
      if (!breakdown[topic]) breakdown[topic] = {
        correct: 0,
        total: 0
      };
      breakdown[topic].total++;
      if (ans.isCorrect) breakdown[topic].correct++;
    });
    return breakdown;
  };

  // Reset Mock Exam
  const resetMockExam = () => {
    setMockExamState({
      active: false,
      loading: false,
      questions: [],
      currentIndex: 0,
      answers: [],
      timeRemaining: 0,
      sessionTopic: null,
      examConfig: null,
      results: null,
      error: null
    });
  };

  // ========== LEADERBOARD & PRO SYSTEM ==========
  const [isPro, setIsPro] = useState(userData?.isPro || false);
  const [showProModal, setShowProModal] = useState(false);
  const [mockExamActive, setMockExamActive] = useState(false);
  const [mockExamTimer, setMockExamTimer] = useState(null);

  // Mock leaderboard data (in produzione verrebbe dal backend)
  const [leaderboard] = useState([{
    id: 1,
    name: 'Marco R.',
    xp: 4250,
    avatar: '🦁',
    league: 'diamond',
    change: 0
  }, {
    id: 2,
    name: 'Sofia L.',
    xp: 3890,
    avatar: '🦊',
    league: 'diamond',
    change: 2
  }, {
    id: 3,
    name: 'Andrea M.',
    xp: 3654,
    avatar: '🐺',
    league: 'gold',
    change: -1
  }, {
    id: 4,
    name: 'Giulia B.',
    xp: 3420,
    avatar: '🦋',
    league: 'gold',
    change: 1
  }, {
    id: 5,
    name: 'Luca T.',
    xp: 3180,
    avatar: '🦅',
    league: 'gold',
    change: -2
  }, {
    id: 6,
    name: 'Elena F.',
    xp: 2950,
    avatar: '🐬',
    league: 'silver',
    change: 0
  }, {
    id: 7,
    name: 'Francesco P.',
    xp: 2780,
    avatar: '🐯',
    league: 'silver',
    change: 3
  }, {
    id: 8,
    name: 'Chiara V.',
    xp: 2540,
    avatar: '🦄',
    league: 'silver',
    change: -1
  }, {
    id: 9,
    name: 'Matteo G.',
    xp: 2320,
    avatar: '🐻',
    league: 'bronze',
    change: 0
  }, {
    id: 10,
    name: 'Alessia N.',
    xp: 2100,
    avatar: '🐨',
    league: 'bronze',
    change: -2
  }]);

  // Get user's league based on XP
  const getUserLeague = xp => {
    if (xp >= 4000) return {
      name: 'Diamante',
      icon: '💎',
      color: 'from-cyan-400 to-blue-500'
    };
    if (xp >= 2500) return {
      name: 'Oro',
      icon: '🥇',
      color: 'from-amber-400 to-yellow-500'
    };
    if (xp >= 1000) return {
      name: 'Argento',
      icon: '🥈',
      color: 'from-slate-300 to-slate-400'
    };
    return {
      name: 'Bronzo',
      icon: '🥉',
      color: 'from-orange-400 to-amber-600'
    };
  };

  // Calculate user's rank in leaderboard
  const getUserRank = () => {
    const userXp = stats.xp;
    const rank = leaderboard.filter(u => u.xp > userXp).length + 1;
    return Math.min(rank, 99); // Cap at 99 if not in top
  };

  // Days until weekly reset (Monday)
  const getDaysUntilReset = () => {
    const now = new Date();
    const daysUntilMonday = (8 - now.getDay()) % 7 || 7;
    return daysUntilMonday;
  };

  // Save chats to localStorage when they change
  useEffect(() => {
    if (chats.length > 0) {
      try {
        localStorage.setItem(`finlearn_chats_${user?.uid || 'guest'}`, JSON.stringify(chats));
        console.log('💾 Chats saved to localStorage:', chats.length, 'chats');
      } catch (e) {
        console.error('Error saving chats:', e);
      }
    }
  }, [chats, user?.uid]);

  // Save progress when stats change
  useEffect(() => {
    if (user && onSaveProgress) {
      onSaveProgress({
        stats,
        completedLessons: completed,
        activeLesson,
        settings: {
          timerEnabled: timerOn
        }
      });
    }
  }, [stats, completed, activeLesson, timerOn]);

  // Timer effect
  useEffect(() => {
    if (quiz && timerOn && timer > 0 && !answered) {
      const id = setTimeout(() => setTimer(t => t - 1), 1000);
      return () => clearTimeout(id);
    }
    if (timer === 0 && !answered) setAnswered(true);
  }, [quiz, timerOn, timer, answered]);

  // Load KaTeX
  useEffect(() => {
    if (!document.querySelector('link[href*="katex"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
      document.head.appendChild(link);
    }
    if (!window.katex) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
      document.head.appendChild(script);
    }
  }, []);

  // ========== IMAGE SYSTEM ==========
  const IMAGES = {
    // Hero images per topic (Unsplash - ottimizzate per performance)
    topics: {
      bonds: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
      fixedIncome: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&q=80",
      equity: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80",
      derivatives: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=800&q=80",
      portfolio: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      economics: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80"
    },
    // Sfondi decorativi
    backgrounds: {
      hero: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80",
      profile: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1200&q=80",
      leaderboard: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80"
    },
    // Badge per leghe
    leagues: {
      bronze: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=200&q=80",
      silver: "https://images.unsplash.com/photo-1610375461249-cba53a8ba5c3?w=200&q=80",
      gold: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=200&q=80",
      diamond: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=200&q=80"
    }
  };

  // SVG Icone Custom per UI
  const BullIcon = ({
    size = 40,
    className = ""
  }) => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 100 100",
    width: size,
    height: size,
    className: className
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "bullGrad",
    x1: "0%",
    y1: "0%",
    x2: "100%",
    y2: "100%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#fbbf24"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#ea580c"
  }))), /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "50",
    r: "45",
    fill: "url(#bullGrad)"
  }), /*#__PURE__*/React.createElement("text", {
    x: "50",
    y: "62",
    textAnchor: "middle",
    fontSize: "40"
  }, "\uD83D\uDC02"));
  const TrophyIcon = ({
    size = 40,
    color = "#fbbf24"
  }) => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    fill: "none",
    stroke: color,
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18 9h1.5a2.5 2.5 0 0 0 0-5H18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 22h16"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18 2H6v7a6 6 0 0 0 12 0V2Z"
  }));
  const FlameIcon = ({
    size = 24,
    animated = false
  }) => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    className: animated ? "animate-pulse" : ""
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "flameGrad",
    x1: "0%",
    y1: "100%",
    x2: "0%",
    y2: "0%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#ea580c"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "50%",
    stopColor: "#f59e0b"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#fcd34d"
  }))), /*#__PURE__*/React.createElement("path", {
    fill: "url(#flameGrad)",
    d: "M12 23c-3.866 0-7-3.134-7-7 0-2.577 1.405-4.83 3.49-6.035-.145 1.035.09 2.09.67 2.965.65.98 1.64 1.67 2.76 1.94-.17-.89-.08-1.82.25-2.65.33-.84.88-1.54 1.58-2.02-.12.66.02 1.35.39 1.92.37.57.95.99 1.62 1.18-.19-.73-.15-1.5.11-2.22.27-.72.74-1.35 1.35-1.78-.08.87.13 1.75.58 2.5.45.74 1.12 1.32 1.9 1.65C19.89 15.08 19 18.91 15 21.5c-.95.58-2.02.96-3.15 1.1-.61.08-1.23.08-1.85.01V23z"
  }));
  const XPBadge = ({
    xp,
    size = "md"
  }) => {
    const sizes = {
      sm: "text-xs px-2 py-0.5",
      md: "text-sm px-3 py-1",
      lg: "text-base px-4 py-1.5"
    };
    return /*#__PURE__*/React.createElement("div", {
      className: `inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-full ${sizes[size]}`
    }, /*#__PURE__*/React.createElement(Zap, {
      size: size === "sm" ? 12 : size === "md" ? 14 : 16
    }), xp, " XP");
  };
  const LeagueBadge = ({
    league,
    size = 40
  }) => {
    const leagues = {
      bronze: {
        bg: "from-orange-600 to-amber-700",
        icon: "🥉",
        name: "Bronze"
      },
      silver: {
        bg: "from-slate-300 to-slate-400",
        icon: "🥈",
        name: "Silver"
      },
      gold: {
        bg: "from-amber-400 to-yellow-500",
        icon: "🥇",
        name: "Gold"
      },
      diamond: {
        bg: "from-cyan-400 to-blue-500",
        icon: "💎",
        name: "Diamond"
      }
    };
    const l = leagues[league] || leagues.bronze;
    return /*#__PURE__*/React.createElement("div", {
      className: `w-${size / 4} h-${size / 4} bg-gradient-to-br ${l.bg} rounded-full flex items-center justify-center shadow-lg`,
      style: {
        width: size,
        height: size
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: size * 0.5
      }
    }, l.icon));
  };

  // Achievement Card Component
  const AchievementCard = ({
    icon,
    title,
    description,
    unlocked = false
  }) => /*#__PURE__*/React.createElement("div", {
    className: `relative p-4 rounded-xl border-2 transition-all ${unlocked ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/50' : 'bg-slate-800/50 border-slate-700 opacity-60'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: `w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 ${unlocked ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-slate-700'}`
  }, icon), /*#__PURE__*/React.createElement("h4", {
    className: `font-bold ${unlocked ? 'text-white' : 'text-slate-500'}`
  }, title), /*#__PURE__*/React.createElement("p", {
    className: `text-xs mt-1 ${unlocked ? 'text-slate-400' : 'text-slate-600'}`
  }, description), unlocked && /*#__PURE__*/React.createElement("div", {
    className: "absolute top-2 right-2 text-emerald-400"
  }, /*#__PURE__*/React.createElement(Check, {
    size: 16
  })));

  // DATA
  const topics = {
    bonds: {
      id: 'bonds',
      title: 'Obbligazioni',
      icon: '📊',
      level: 'base',
      time: '45 min',
      image: IMAGES.topics.bonds,
      color: 'from-blue-500 to-cyan-500',
      theory: [{
        title: "Cos'è un'obbligazione?",
        content: "💡 Un bond è un prestito che TU fai!\n\nL'emittente (governo, azienda) ti promette:\n• Pagamenti periodici (coupon)\n• Rimborso del capitale a scadenza\n\nTermini chiave:\n• Face Value: importo rimborsato\n• Coupon Rate: tasso annuale\n• Maturity: data scadenza\n• Yield: rendimento effettivo"
      }, {
        title: "Relazione Prezzo-Yield",
        content: "📐 Regola fondamentale:\n\n⬆️ Tassi = ⬇️ Prezzi\n⬇️ Tassi = ⬆️ Prezzi\n\nPerché? I vecchi bond con coupon bassi valgono meno quando i nuovi offrono di più!"
      }],
      cards: [{
        front: "Cos'è un'obbligazione?",
        back: "Titolo di DEBITO: presti soldi all'emittente, ricevi interessi + capitale",
        mnemonic: "🏦 Tu sei la banca!"
      }, {
        front: "Coupon Rate",
        back: "Tasso di interesse annuo sul Face Value",
        formula: "\\text{Coupon} = FV \\times \\text{Rate}",
        example: "5% su €1.000 = €50/anno"
      }, {
        front: "Relazione Prezzo-Yield",
        back: "INVERSA! Yield ↑ = Price ↓",
        formula: "\\uparrow y \\Rightarrow \\downarrow P",
        mnemonic: "🎢 Salgono e scendono opposti"
      }],
      questions: [
      // === BOND FEATURES & BASICS (10 domande) ===
      {
        q: "Un'obbligazione con original maturity di 9 mesi è classificata come:",
        opts: ["Money market security", "Capital market security", "Perpetual bond"],
        ans: 0,
        exp: "Bonds con original maturity ≤1 anno sono money market securities. Oltre 1 anno sono capital market securities.",
        time: 30,
        topic: "features"
      }, {
        q: "Il tenor di un'obbligazione si riferisce:",
        opts: ["All'original maturity quando fu emessa", "Al tempo rimanente fino alla scadenza", "Al coupon rate del bond"],
        ans: 1,
        exp: "Tenor = tempo RIMANENTE fino alla maturity. Original maturity = durata iniziale.",
        time: 30,
        topic: "features"
      }, {
        q: "Un bond con 5% coupon rate semestrale e $1,000 par value paga ogni 6 mesi:",
        opts: ["$25", "$50", "$100"],
        ans: 0,
        exp: "Pagamento semestrale = (5% × $1,000) / 2 = $25. Il coupon annuale viene diviso per 2.",
        time: 30,
        topic: "features"
      }, {
        q: "La relazione tra prezzi e yields delle obbligazioni a cedola fissa è:",
        opts: ["Positiva", "Inversa", "Nessuna relazione"],
        ans: 1,
        exp: "Prezzi e yields hanno relazione INVERSA: quando yields salgono, i prezzi scendono e viceversa.",
        time: 30,
        topic: "features"
      }, {
        q: "Una yield curve normale è:",
        opts: ["Piatta", "Inclinata verso l'alto (upward-sloping)", "Inclinata verso il basso"],
        ans: 1,
        exp: "Normal yield curve = upward-sloping: yields più alti per maturities più lunghe.",
        time: 30,
        topic: "features"
      }, {
        q: "Il benchmark yield curve è tipicamente costruito usando:",
        opts: ["Corporate bonds", "Government bonds", "Municipal bonds"],
        ans: 1,
        exp: "Government bonds sono il benchmark per il lowest credit risk e massima liquidità.",
        time: 30,
        topic: "features"
      }, {
        q: "Un bond domestico è emesso:",
        opts: ["In un paese straniero", "Nel paese dell'issuer nella sua currency", "Solo in USD"],
        ans: 1,
        exp: "Domestic bond: emesso e traded nel paese dell'issuer, nella home currency.",
        time: 30,
        topic: "features"
      }, {
        q: "Eurobonds sono issued:",
        opts: ["Solo in Europa", "Outside jurisdiction di any single country", "Solo in EUR"],
        ans: 1,
        exp: "Eurobonds: emessi fuori dalla jurisdiction di qualsiasi paese, possono essere in ANY currency.",
        time: 45,
        topic: "features"
      }, {
        q: "Cosa rappresenta lo 'yield to maturity' (YTM)?",
        opts: ["Solo gli interessi annuali", "Il rendimento totale se detenuto fino a scadenza", "Il prezzo attuale"],
        ans: 1,
        exp: "YTM = tasso che eguaglia PV di tutti i flussi futuri al prezzo corrente. È il rendimento TOTALE.",
        time: 30,
        topic: "features"
      }, {
        q: "Cosa significa che un bond quota 'above par'?",
        opts: ["Prezzo < valore nominale", "Prezzo = valore nominale", "Prezzo > valore nominale"],
        ans: 2,
        exp: "Above par = prezzo > 100 (sopra il nominale). Succede quando coupon > tassi di mercato.",
        time: 30,
        topic: "features"
      },
      // === CASH FLOW STRUCTURES (10 domande) ===
      {
        q: "Con TIPS (Treasury Inflation-Protected), in caso di deflation alla maturity:",
        opts: ["Si riceve il deflated principal", "Si riceve il MAX tra adjusted e original par", "Si riceve zero"],
        ans: 1,
        exp: "TIPS protezione: alla maturity ricevi il MASSIMO tra inflation-adjusted principal e original par.",
        time: 45,
        topic: "structures"
      }, {
        q: "Su un capital-indexed bond con 3% coupon annuo e 1% inflation semestrale, il primo coupon su $1,000 è:",
        opts: ["$15.00", "$15.15", "$30.00"],
        ans: 1,
        exp: "Principal adjusted: $1,000 × 1.01 = $1,010. Semiannual coupon: $1,010 × 1.5% = $15.15.",
        time: 60,
        topic: "structures"
      }, {
        q: "Zero-coupon bonds pagano:",
        opts: ["Coupon periodici", "Solo par value alla maturity", "Interest mensile"],
        ans: 1,
        exp: "Zero-coupon: NESSUN coupon periodico, solo single payment di par alla scadenza.",
        time: 30,
        topic: "structures"
      }, {
        q: "Zero-coupon bonds sono popolari con investors che vogliono minimizzare:",
        opts: ["Credit risk", "Reinvestment risk", "Interest rate risk"],
        ans: 1,
        exp: "Senza periodic coupons, NON c'è reinvestment risk. Il return è locked in all'acquisto.",
        time: 45,
        topic: "structures"
      }, {
        q: "Zero-coupon bonds devono essere priced:",
        opts: ["At par", "Above par", "Below par (a sconto)"],
        ans: 2,
        exp: "Zero-coupon = pure discount bonds. Devono tradare SOTTO par per offrire positive return.",
        time: 30,
        topic: "structures"
      }, {
        q: "Un deferred coupon bond:",
        opts: ["Non paga mai coupons", "Inizia coupon payments dopo un periodo specificato", "Paga tutti coupons alla maturity"],
        ans: 1,
        exp: "Deferred coupon: regular payments iniziano DOPO un periodo specificato dall'emissione.",
        time: 45,
        topic: "structures"
      }, {
        q: "La duration di un zero-coupon bond è:",
        opts: ["Zero", "Uguale alla sua maturity", "Metà della maturity"],
        ans: 1,
        exp: "Zero-coupon: unico cash flow a scadenza → Macaulay Duration = Maturity ESATTAMENTE.",
        time: 30,
        topic: "structures"
      }, {
        q: "Qual è la caratteristica principale di un'obbligazione zero-coupon?",
        opts: ["Paga cedole trimestrali", "Non paga cedole periodiche", "Ha duration pari a zero"],
        ans: 1,
        exp: "Zero-coupon: emesse a SCONTO, nessuna cedola, rimborsate al valore nominale alla scadenza.",
        time: 30,
        topic: "structures"
      }, {
        q: "Il coupon rate di un capital-indexed bond può essere visto come:",
        opts: ["Nominal rate", "Real rate of interest", "Risk-free rate"],
        ans: 1,
        exp: "Il coupon è il REAL rate; gli inflation adjustments proteggono il purchasing power.",
        time: 45,
        topic: "structures"
      }, {
        q: "Cosa indica il 'credit spread'?",
        opts: ["Differenza prezzo-nominale", "Differenza rendimento corporate vs gov bond", "La duration"],
        ans: 1,
        exp: "Credit spread = YTM corporate - YTM government. Premio per il maggior rischio di credito.",
        time: 30,
        topic: "structures"
      },
      // === REPOS & MONEY MARKETS (10 domande) ===
      {
        q: "In un repo, il purchase price è effettivamente:",
        opts: ["Il prezzo definitivo", "Un loan dal buyer al seller", "Solo un deposito"],
        ans: 1,
        exp: "Repo purchase price = loan amount. Il buyer presta cash, il seller dà securities come collateral.",
        time: 45,
        topic: "repos"
      }, {
        q: "La differenza tra repurchase e purchase price in un repo rappresenta:",
        opts: ["Il principal", "L'interest pagato al lender", "Una fee"],
        ans: 1,
        exp: "Repurchase - Purchase = INTEREST pagato al security buyer (cash lender) al repo rate.",
        time: 45,
        topic: "repos"
      }, {
        q: "Se initial margin è 103%, il purchase price è:",
        opts: ["103% del security value", "Security value ÷ 1.03", "Security value × 1.03"],
        ans: 1,
        exp: "Purchase price (loan) = Security Market Value / Initial Margin. Es: $1M / 1.03 ≈ $970,874.",
        time: 45,
        topic: "repos"
      }, {
        q: "L'haircut in un repo rappresenta:",
        opts: ["Una fee fissa", "Il discount sul security value per calcolare il loan", "L'interest rate"],
        ans: 1,
        exp: "Haircut = 1 - (1/Initial Margin). Es: margin 103% → haircut = 1 - 1/1.03 ≈ 2.9%.",
        time: 45,
        topic: "repos"
      }, {
        q: "Variation margin è richiesta quando:",
        opts: ["Sempre, ogni giorno", "Il security value scende sotto loan × initial margin", "Mai, è opzionale"],
        ans: 1,
        exp: "Variation margin: extra collateral richiesto se security value < loan value × initial margin.",
        time: 45,
        topic: "repos"
      }, {
        q: "Un overnight repo ha term di:",
        opts: ["Una settimana", "Un giorno", "Un mese"],
        ans: 1,
        exp: "Overnight repo = ONE-DAY repurchase agreement. Term repo = più di un giorno.",
        time: 30,
        topic: "repos"
      }, {
        q: "Un tri-party repo impiega:",
        opts: ["Solo due parti", "Un terzo intermediario (custodian)", "Tre tipi di collateral"],
        ans: 1,
        exp: "Tri-party: third party (custodian bank) gestisce collateral, valuation, settlement. Riduce operational risk.",
        time: 45,
        topic: "repos"
      }, {
        q: "Un bilateral repo è:",
        opts: ["Con terze parti", "Direttamente tra due parti senza intermediario", "Sempre su exchange"],
        ans: 1,
        exp: "Bilateral repo: struck direttamente tra borrower e lender, senza third-party intermediary.",
        time: 30,
        topic: "repos"
      }, {
        q: "Il repo rate è tipicamente più ALTO per:",
        opts: ["Term più brevi", "Term più lunghi (yield curve normale)", "Collateral di alta qualità"],
        ans: 1,
        exp: "Longer repo term → higher rate (quando yield curve è normal/upward-sloping).",
        time: 45,
        topic: "repos"
      }, {
        q: "Il repo rate è tipicamente più BASSO quando:",
        opts: ["Collateral ha bassa qualità", "Collateral ha ALTA qualità e alta domanda", "È undercollateralized"],
        ans: 1,
        exp: "High quality collateral + high demand = LOWER repo rate. Il lender accetta meno rendimento.",
        time: 45,
        topic: "repos"
      }]
    },
    cfa: {
      id: 'cfa',
      title: 'Fixed Income CFA',
      icon: '🎓',
      level: 'avanzato',
      time: '8 ore',
      image: IMAGES.topics.fixedIncome,
      color: 'from-purple-500 to-indigo-600',
      theory: [{
        title: "CFA Fixed Income",
        content: "🎓 Il 10-12% dell'esame!\n\nTopics:\n• Bond Valuation & YTM\n• Duration & Convexity\n• Term Structure\n• Credit Analysis\n• MBS/ABS basics"
      }],
      formulas: {
        'Bond Valuation': [{
          name: 'Bond Price',
          formula: 'P = \\sum_{t=1}^{N} \\frac{C}{(1+r)^t} + \\frac{FV}{(1+r)^N}',
          desc: 'PV di tutti i cash flows'
        }, {
          name: 'Full Price',
          formula: 'P_{full} = P_{flat} + AI',
          desc: 'Prezzo + Accrued Interest'
        }, {
          name: 'Accrued Interest',
          formula: 'AI = \\frac{C}{m} \\times \\frac{t}{T}',
          desc: 't=giorni passati, T=giorni periodo'
        }],
        'Yield Measures': [{
          name: 'Current Yield',
          formula: 'CY = \\frac{\\text{Annual Coupon}}{\\text{Price}}',
          desc: 'Rendimento semplice'
        }, {
          name: 'BEY',
          formula: 'BEY = 2 \\times YTM_{semi}',
          desc: 'Bond Equivalent Yield'
        }, {
          name: 'EAY',
          formula: 'EAY = (1 + YTM_{semi})^2 - 1',
          desc: 'Effective Annual Yield'
        }, {
          name: 'G-Spread',
          formula: 'G = YTM_{bond} - YTM_{gov}',
          desc: 'vs Government benchmark'
        }, {
          name: 'Z-Spread',
          formula: 'P = \\sum \\frac{CF_t}{(1+S_t+Z)^t}',
          desc: 'Spread costante su spot curve'
        }, {
          name: 'OAS',
          formula: 'OAS = Z - \\text{Option Value}',
          desc: 'Option-Adjusted Spread'
        }],
        'Duration': [{
          name: 'Macaulay Duration',
          formula: 'MacD = \\frac{\\sum t \\times PV(CF_t)}{P}',
          desc: 'Tempo medio ponderato'
        }, {
          name: 'Modified Duration',
          formula: 'ModD = \\frac{MacD}{1 + y/m}',
          desc: 'Sensibilità al tasso'
        }, {
          name: 'Effective Duration',
          formula: 'EffD = \\frac{P_- - P_+}{2 \\times \\Delta y \\times P_0}',
          desc: 'Per bond con opzioni'
        }, {
          name: 'Price Change',
          formula: '\\%\\Delta P \\approx -ModD \\times \\Delta y',
          desc: 'Approssimazione lineare'
        }],
        'Convexity': [{
          name: 'Convexity Adjustment',
          formula: 'Conv\\_Adj = \\frac{1}{2} \\times Conv \\times (\\Delta y)^2',
          desc: 'Sempre positivo per option-free'
        }, {
          name: 'Full Price Change',
          formula: '\\%\\Delta P \\approx -ModD \\cdot \\Delta y + \\frac{1}{2}Conv(\\Delta y)^2',
          desc: 'Con convexity adjustment'
        }],
        'Forward Rates': [{
          name: 'Forward da Spot',
          formula: 'f_{1,1} = \\frac{(1+S_2)^2}{(1+S_1)} - 1',
          desc: '1-year forward, 1-year from now'
        }, {
          name: 'General Forward',
          formula: '(1+S_A)^A \\times (1+f_{A,B-A})^{B-A} = (1+S_B)^B',
          desc: 'No arbitrage condition'
        }]
      },
      cards: [{
        front: "Macaulay Duration",
        back: "Tempo medio ponderato per ricevere i cash flows del bond, misurato in anni",
        formula: "MacD = \\frac{\\sum_{t=1}^{N} t \\times \\frac{CF_t}{(1+y)^t}}{P}",
        mnemonic: "⏱️ 'Quanto tempo in media aspetto?'",
        example: "MacD = 5.2 anni → in media ricevi flussi dopo 5.2 anni"
      }, {
        front: "Modified Duration",
        back: "Misura la sensibilità percentuale del prezzo a variazioni di 1% dello yield",
        formula: "ModD = \\frac{MacD}{1 + y/m}",
        mnemonic: "📉 'Di quanto scendo se yield sale 1%?'",
        example: "ModD = 7 → se yield +1%, price ≈ -7%"
      }, {
        front: "Current Yield vs YTM",
        back: "CY = coupon/prezzo (snapshot). YTM include anche capital gain/loss a maturity (film completo)",
        formula: "CY = \\frac{C}{P}",
        mnemonic: "🎯 CY = foto, YTM = video",
        example: "Premium bond: Coupon > CY > YTM"
      }, {
        front: "Convexity",
        back: "Misura la curvatura della relazione prezzo-yield. Sempre 'amica' del bondholder per option-free bonds",
        formula: "\\%\\Delta P \\approx -ModD \\cdot \\Delta y + \\frac{1}{2}Conv(\\Delta y)^2",
        mnemonic: "🌈 Curva = sempre meglio che linea",
        example: "Alta convexity = meglio sia se tassi ↑ che ↓"
      }, {
        front: "Premium vs Discount Bond",
        back: "Premium: P > Par, Coupon > YTM. Discount: P < Par, Coupon < YTM. Par: P = Par, Coupon = YTM",
        formula: "\\text{Premium: } C > YTM \\Rightarrow P > 100",
        mnemonic: "💰 Paghi di più se il coupon è generoso",
        example: "Bond 6% quando mercato 4% → quota sopra par"
      }, {
        front: "G-Spread vs Z-Spread",
        back: "G-Spread = vs singolo gov bond (stesso maturity). Z-Spread = spread COSTANTE su TUTTA la spot curve",
        formula: "G = YTM - YTM_{gov}",
        mnemonic: "G = gross (semplice), Z = zero-volatility (preciso)",
        example: "Z-Spread considera shape della curva"
      }, {
        front: "Callable Bond Duration",
        back: "Quando tassi bassi (call probabile), duration < option-free. Quando tassi alti, duration ≈ option-free",
        formula: "\\text{Low yields} \\Rightarrow \\text{Lower duration}",
        mnemonic: "📞 Se ti richiamano presto, aspetti meno",
        example: "Call at low yields = price capped = less sensitive"
      }, {
        front: "Effective Duration",
        back: "Usata per bond con opzioni embedded. Basata su shock alla benchmark curve, non al singolo yield",
        formula: "EffD = \\frac{P_- - P_+}{2 \\times \\Delta y \\times P_0}",
        mnemonic: "⚡ Effective = per bond 'complicati'",
        example: "Callable, putable, MBS usano effective duration"
      }],
      questions: [{
        q: "Bond semiannuale, coupon 6%, FV $1.000 paga ogni 6 mesi:",
        opts: ["$30", "$60", "$120"],
        ans: 0,
        exp: "(6%×$1.000)/2 = $30",
        time: 30,
        topic: "valuation"
      }, {
        q: "Se ModD = 6 e yield +0.5%, price change ≈",
        opts: ["-3%", "+3%", "-6%"],
        ans: 0,
        exp: "%ΔP ≈ -6 × 0.005 = -3%",
        time: 45,
        topic: "duration"
      }, {
        q: "Premium bond: ordine corretto?",
        opts: ["Coupon > CY > YTM", "YTM > CY > Coupon", "Tutti uguali"],
        ans: 0,
        exp: "Premium (P>Par): Coupon > CY > YTM",
        time: 45,
        topic: "yield"
      }, {
        q: "Zero-coupon bond duration equals:",
        opts: ["Zero", "Its maturity", "Half its maturity"],
        ans: 1,
        exp: "ZCB: unico cash flow a maturity → MacDur = Maturity",
        time: 30,
        topic: "duration"
      }, {
        q: "Effective duration è usata per:",
        opts: ["Solo government bonds", "Bond con opzioni embedded", "Solo zero-coupon bonds"],
        ans: 1,
        exp: "Effective dur per callable, putable, MBS - considera l'effetto delle opzioni",
        time: 45,
        topic: "duration"
      }, {
        q: "Il BEY di un bond con YTM semestrale 2.5% è:",
        opts: ["2.5%", "5.0%", "5.0625%"],
        ans: 1,
        exp: "BEY = 2 × semiannual YTM = 2 × 2.5% = 5.0%",
        time: 30,
        topic: "yield"
      }, {
        q: "L'EAY dello stesso bond (YTM semi 2.5%) è:",
        opts: ["5.0%", "5.0625%", "2.5%"],
        ans: 1,
        exp: "EAY = (1.025)² - 1 = 5.0625%. EAY > BEY per effetto compounding",
        time: 45,
        topic: "yield"
      }, {
        q: "Convexity adjustment per option-free bond è:",
        opts: ["Sempre negativo", "Sempre positivo", "Può essere entrambi"],
        ans: 1,
        exp: "Conv adj = ½×Conv×(Δy)². Conv positiva × (Δy)² positivo = sempre positivo",
        time: 45,
        topic: "duration"
      }]
    },
    stocks: {
      id: 'stocks',
      title: 'Azioni',
      icon: '📈',
      level: 'base',
      time: '40 min',
      theory: [{
        title: "Cos'è un'azione?",
        content: "📈 Un'azione è una QUOTA DI PROPRIETÀ di un'azienda!\n\nQuando compri un'azione diventi SOCIO:\n• Diritto a dividendi (se distribuiti)\n• Diritto di voto in assemblea (common stock)\n• Capital gain se il prezzo sale\n\nDifferenza chiave vs Bond:\n• Bond = DEBITO (sei creditore)\n• Azione = EQUITY (sei proprietario)"
      }, {
        title: "Tipi di Azioni",
        content: "🏷️ Due categorie principali:\n\nCOMMON STOCK (Ordinarie):\n• Diritto di voto ✓\n• Dividendi variabili\n• Ultima priorità in liquidazione\n\nPREFERRED STOCK (Privilegiate):\n• Nessun voto ✗\n• Dividendi FISSI e prioritari\n• Priorità sui common in liquidazione\n\n💡 Preferred = ibrido tra bond e azione!"
      }, {
        title: "Valutazione Base",
        content: "📊 Metriche fondamentali:\n\nEPS = Utile Netto / Azioni\n→ Quanto guadagna l'azienda per ogni azione\n\nP/E = Prezzo / EPS\n→ Quanto paghi per €1 di utili\n→ P/E alto = costoso o alte aspettative\n\nDividend Yield = Dividendo / Prezzo\n→ Rendimento da dividendi\n\nMarket Cap = Prezzo × N. Azioni\n→ Valore totale dell'azienda in borsa"
      }],
      cards: [{
        front: "Cos'è un'azione?",
        back: "Quota di PROPRIETÀ di un'azienda. Ti rende socio con diritto a dividendi e capital gain.",
        mnemonic: "🏢 Compri un pezzo dell'azienda!"
      }, {
        front: "Common vs Preferred Stock",
        back: "Common: voto + dividendi variabili. Preferred: NO voto + dividendi fissi prioritari.",
        mnemonic: "🗳️ Common vota, 💰 Preferred incassa prima"
      }, {
        front: "EPS (Earnings Per Share)",
        back: "Utile netto diviso per numero di azioni. Misura la profittabilità per azione.",
        formula: "EPS = \\frac{Net\\ Income - Pref\\ Div}{Shares}",
        example: "Utile €10M, 5M azioni → EPS = €2"
      }, {
        front: "P/E Ratio",
        back: "Prezzo diviso EPS. Indica quanto paghi per €1 di utili. Alto = costoso o growth.",
        formula: "P/E = \\frac{Price}{EPS}",
        example: "Prezzo €30, EPS €2 → P/E = 15x"
      }, {
        front: "Dividend Yield",
        back: "Dividendo annuo diviso prezzo. Rendimento % da dividendi.",
        formula: "DY = \\frac{DPS}{Price}",
        example: "Div €1.50, Prezzo €50 → DY = 3%"
      }, {
        front: "Market Cap",
        back: "Prezzo × Azioni outstanding. Valore totale dell'azienda sul mercato.",
        formula: "MC = Price \\times Shares",
        example: "€20 × 500M = €10 miliardi"
      }, {
        front: "Book Value per Share",
        back: "Equity totale diviso azioni. Valore contabile per azione.",
        formula: "BVPS = \\frac{Total\\ Equity}{Shares}",
        mnemonic: "📚 Quanto vale 'sui libri'"
      }, {
        front: "ROE (Return on Equity)",
        back: "Utile netto diviso Equity. Misura l'efficienza del capitale proprio.",
        formula: "ROE = \\frac{Net\\ Income}{Equity}",
        example: "ROE 15% = €15 di utile per €100 di equity"
      }, {
        front: "Beta",
        back: "Misura la volatilità vs mercato. Beta > 1 = più volatile, < 1 = meno volatile.",
        formula: "\\beta = \\frac{Cov(R_i, R_m)}{Var(R_m)}",
        mnemonic: "📊 Beta 1.5 = 50% più volatile del mercato"
      }, {
        front: "PEG Ratio",
        back: "P/E diviso tasso di crescita EPS. Considera la crescita nel valutare il P/E.",
        formula: "PEG = \\frac{P/E}{g}",
        example: "P/E 20, growth 20% → PEG = 1 (fair)"
      }],
      formulas: {
        'Valuation Ratios': [{
          name: 'P/E Ratio',
          formula: 'P/E = \\frac{Price}{EPS}',
          desc: 'Prezzo per €1 di utili'
        }, {
          name: 'PEG Ratio',
          formula: 'PEG = \\frac{P/E}{g}',
          desc: 'P/E aggiustato per crescita (g in %)'
        }, {
          name: 'P/B Ratio',
          formula: 'P/B = \\frac{Price}{BVPS}',
          desc: 'Prezzo vs valore contabile'
        }, {
          name: 'P/S Ratio',
          formula: 'P/S = \\frac{Price}{Sales/Share}',
          desc: 'Prezzo vs ricavi per azione'
        }, {
          name: 'EV/EBITDA',
          formula: 'EV/EBITDA = \\frac{MC + Debt - Cash}{EBITDA}',
          desc: 'Valutazione enterprise'
        }],
        'Per Share Metrics': [{
          name: 'EPS',
          formula: 'EPS = \\frac{Net\\ Income - Pref\\ Div}{Shares}',
          desc: 'Utile per azione'
        }, {
          name: 'BVPS',
          formula: 'BVPS = \\frac{Total\\ Equity}{Shares}',
          desc: 'Valore contabile per azione'
        }, {
          name: 'DPS',
          formula: 'DPS = \\frac{Total\\ Dividends}{Shares}',
          desc: 'Dividendo per azione'
        }],
        'Returns & Yields': [{
          name: 'Dividend Yield',
          formula: 'DY = \\frac{DPS}{Price}',
          desc: 'Rendimento da dividendi'
        }, {
          name: 'Total Return',
          formula: 'R = \\frac{P_1 - P_0 + Div}{P_0}',
          desc: 'Capital gain + dividendi'
        }, {
          name: 'Payout Ratio',
          formula: 'Payout = \\frac{DPS}{EPS}',
          desc: '% utili distribuiti'
        }],
        'Profitability': [{
          name: 'ROE',
          formula: 'ROE = \\frac{Net\\ Income}{Equity}',
          desc: 'Ritorno sul capitale proprio'
        }, {
          name: 'ROA',
          formula: 'ROA = \\frac{Net\\ Income}{Assets}',
          desc: 'Ritorno sugli asset'
        }, {
          name: 'Profit Margin',
          formula: 'Margin = \\frac{Net\\ Income}{Revenue}',
          desc: 'Margine netto'
        }],
        'Size & Value': [{
          name: 'Market Cap',
          formula: 'MC = Price \\times Shares',
          desc: 'Capitalizzazione di mercato'
        }, {
          name: 'Enterprise Value',
          formula: 'EV = MC + Debt - Cash',
          desc: 'Valore totale impresa'
        }]
      },
      questions: [
      // === BASICS (5 domande) ===
      {
        q: "Un'azione rappresenta:",
        opts: ["Un debito dell'azienda verso te", "Una quota di proprietà dell'azienda", "Un prestito che fai all'azienda"],
        ans: 1,
        exp: "Azione = EQUITY = proprietà. Bond = DEBITO = prestito.",
        time: 30,
        topic: "basics"
      }, {
        q: "Chi ha priorità nella distribuzione dei dividendi?",
        opts: ["Common stockholders", "Preferred stockholders", "Entrambi hanno uguale priorità"],
        ans: 1,
        exp: "Preferred stock ha PRIORITÀ sui dividendi rispetto ai common shareholders.",
        time: 30,
        topic: "basics"
      }, {
        q: "Il diritto di voto in assemblea spetta tipicamente a:",
        opts: ["Solo Preferred stockholders", "Solo Common stockholders", "Entrambi"],
        ans: 1,
        exp: "Common stock = voting rights. Preferred stock generalmente NON ha diritto di voto.",
        time: 30,
        topic: "basics"
      }, {
        q: "Il capital gain si realizza quando:",
        opts: ["Ricevi un dividendo", "Vendi l'azione a un prezzo superiore all'acquisto", "L'azienda aumenta il capitale"],
        ans: 1,
        exp: "Capital gain = Prezzo vendita > Prezzo acquisto. È il guadagno dalla variazione di prezzo.",
        time: 30,
        topic: "basics"
      }, {
        q: "Un'azione 'growth' tipicamente ha:",
        opts: ["Alto dividend yield", "Basso o zero dividend yield", "Dividendi garantiti"],
        ans: 1,
        exp: "Growth stocks reinvestono gli utili per crescere → dividendi bassi o nulli. Value stocks pagano più dividendi.",
        time: 45,
        topic: "basics"
      },
      // === VALUATION (5 domande) ===
      {
        q: "Se EPS = €2 e P/E = 15, qual è il prezzo dell'azione?",
        opts: ["€30", "€7.50", "€17"],
        ans: 0,
        exp: "P/E = Price/EPS → Price = P/E × EPS = 15 × €2 = €30",
        time: 45,
        topic: "valuation"
      }, {
        q: "Un P/E ratio alto suggerisce che:",
        opts: ["L'azione è sottovalutata", "L'azione è sopravvalutata o ha alte aspettative di crescita", "L'azienda sta perdendo soldi"],
        ans: 1,
        exp: "P/E alto = paghi di più per €1 di utili. Può indicare sopravvalutazione O alte aspettative di crescita.",
        time: 45,
        topic: "valuation"
      }, {
        q: "Se il dividendo annuo è €1.50 e il prezzo è €50, il dividend yield è:",
        opts: ["3%", "33%", "0.03%"],
        ans: 0,
        exp: "DY = Dividendo/Prezzo = €1.50/€50 = 0.03 = 3%",
        time: 30,
        topic: "valuation"
      }, {
        q: "Un'azienda ha Market Cap €10B e 500M azioni. Il prezzo per azione è:",
        opts: ["€20", "€50", "€5000"],
        ans: 0,
        exp: "Price = Market Cap / Shares = €10B / 500M = €20 per azione",
        time: 45,
        topic: "valuation"
      }, {
        q: "ROE del 15% significa:",
        opts: ["15% di ritorno sul debito", "15% di ritorno sull'equity", "15% di dividendi"],
        ans: 1,
        exp: "ROE = Net Income / Equity. ROE 15% = €15 di utile per ogni €100 di capitale proprio.",
        time: 30,
        topic: "valuation"
      },
      // === INTERMEDIATE (5 domande) ===
      {
        q: "Le 'Blue Chip' stocks sono:",
        opts: ["Startup ad alto rischio", "Aziende grandi, stabili e consolidate", "Penny stocks"],
        ans: 1,
        exp: "Blue chips = large-cap, aziende stabili con track record solido (es: Apple, Microsoft, J&J).",
        time: 30,
        topic: "intermediate"
      }, {
        q: "Uno stock split 2:1 significa:",
        opts: ["Il prezzo raddoppia", "Le azioni raddoppiano e il prezzo dimezza", "I dividendi raddoppiano"],
        ans: 1,
        exp: "Split 2:1: ogni azione diventa 2, prezzo si dimezza. Il valore totale NON cambia.",
        time: 45,
        topic: "intermediate"
      }, {
        q: "Un buyback (riacquisto azioni) tipicamente:",
        opts: ["Aumenta l'EPS", "Diminuisce l'EPS", "Non ha effetto sull'EPS"],
        ans: 0,
        exp: "Buyback riduce shares outstanding → stesso utile / meno azioni = EPS più alto.",
        time: 45,
        topic: "intermediate"
      }, {
        q: "Un Beta > 1 indica che l'azione è:",
        opts: ["Meno volatile del mercato", "Più volatile del mercato", "Non correlata al mercato"],
        ans: 1,
        exp: "Beta > 1 = più volatile. Es: Beta 1.5 → se mercato +10%, azione circa +15%.",
        time: 45,
        topic: "intermediate"
      }, {
        q: "Il dividend payout ratio è calcolato come:",
        opts: ["Dividendi / Net Income", "Net Income / Dividendi", "Dividendi × Net Income"],
        ans: 0,
        exp: "Payout Ratio = DPS/EPS = % di utili distribuiti come dividendi.",
        time: 30,
        topic: "intermediate"
      },
      // === ADVANCED (5 domande) ===
      {
        q: "Il PEG ratio considera:",
        opts: ["Solo il P/E", "P/E e tasso di crescita degli utili", "Solo i dividendi"],
        ans: 1,
        exp: "PEG = P/E / Growth rate. Aggiusta il P/E per la crescita attesa. PEG < 1 = potenzialmente sottovalutato.",
        time: 45,
        topic: "advanced"
      }, {
        q: "L'Enterprise Value (EV) include:",
        opts: ["Solo Market Cap", "Market Cap + Debito - Cash", "Solo il Debito"],
        ans: 1,
        exp: "EV = MC + Debt - Cash. Rappresenta il costo totale per acquistare l'intera azienda.",
        time: 45,
        topic: "advanced"
      }, {
        q: "Il Free Cash Flow viene usato per:",
        opts: ["Pagare solo gli interessi", "Dividendi, buyback, riduzione debito", "Solo le tasse"],
        ans: 1,
        exp: "FCF = cash disponibile DOPO investimenti. Può andare a dividendi, buyback, o debt repayment.",
        time: 45,
        topic: "advanced"
      }, {
        q: "Un'azienda con P/B < 1 è:",
        opts: ["Sempre sopravvalutata", "Potenzialmente sottovalutata", "Matematicamente impossibile"],
        ans: 1,
        exp: "P/B < 1 = prezzo < book value. Può indicare sottovalutazione, ma anche problemi finanziari.",
        time: 45,
        topic: "advanced"
      }, {
        q: "La 'diluzione' degli azionisti avviene quando:",
        opts: ["Si emettono nuove azioni", "Si pagano dividendi", "Si fa un buyback"],
        ans: 0,
        exp: "Nuove azioni emesse = più shares outstanding = ogni azione vale % minore dell'azienda = diluzione.",
        time: 45,
        topic: "advanced"
      }]
    }
  };
  const lessons = [{
    id: 1,
    name: 'Obbligazioni',
    icon: '📊',
    color: 'from-amber-400 to-orange-500'
  }, {
    id: 2,
    name: 'Azioni',
    icon: '📈',
    color: 'from-emerald-400 to-teal-500'
  }, {
    id: 3,
    name: 'ETF',
    icon: '🎯',
    color: 'from-purple-400 to-pink-500'
  }, {
    id: 4,
    name: 'Derivati',
    icon: '⚡',
    color: 'from-rose-400 to-red-500'
  }];

  // Handlers
  const startFullQuiz = questions => {
    // Start quiz with ALL questions from the lesson
    setQuizQuestions(questions);
    setQuizIndex(0);
    setQuiz(questions[0]);
    setQuizCorrect(0);
    setQuizAnswers({});
    setSelected(null);
    setAnswered(false);
    if (timerOn) setTimer(questions[0].time || 60);
  };
  const startSingleQuiz = q => {
    // Start single question (from library)
    setQuizQuestions([q]);
    setQuizIndex(0);
    setQuiz(q);
    setQuizAnswers({});
    setSelected(null);
    setAnswered(false);
    if (timerOn) setTimer(q.time || 60);
  };

  // Navigate to a specific question
  const navigateToQuestion = targetIndex => {
    if (targetIndex < 0 || targetIndex >= quizQuestions.length) return;
    setQuizIndex(targetIndex);
    setQuiz(quizQuestions[targetIndex]);

    // If already answered, restore that state
    if (quizAnswers[targetIndex]) {
      setSelected(quizAnswers[targetIndex].selected);
      setAnswered(true);
    } else {
      setSelected(null);
      setAnswered(false);
      if (timerOn) setTimer(quizQuestions[targetIndex].time || 60);
    }
  };
  const submit = () => {
    if (selected === null) return;
    setAnswered(true);
    const isCorrect = selected === quiz.ans;

    // Track this answer
    setQuizAnswers(prev => ({
      ...prev,
      [quizIndex]: {
        selected,
        isCorrect
      }
    }));
    const optEl = document.querySelector('[data-quiz-opt="' + selected + '"]') || document.activeElement;
    if (isCorrect) {
      flFx.correct(optEl, streak >= 1 ? `Serie x${streak + 1}` : undefined);
      setStreak(s => s + 1);
      setQuizCorrect(c => c + 1);
    } else {
      flFx.wrong(optEl);
      setStreak(0);
    }
  };
  const next = () => {
    const correct = selected === quiz.ans;
    const bonus = Math.min(streak, 5) * 10;

    // Update stats for this question (only if not already counted)
    if (!quizAnswers[quizIndex]) {
      if (correct) {
        setStats(s => ({
          ...s,
          coins: s.coins + 10 + bonus,
          xp: s.xp + 20 + bonus,
          correct: s.correct + 1,
          quizzes: s.quizzes + 1
        }));
      } else {
        setStats(s => ({
          ...s,
          quizzes: s.quizzes + 1
        }));
      }
    }

    // Find next unanswered question or go to next in sequence
    let nextIdx = quizIndex + 1;

    // Check if all questions are answered
    const answeredCount = Object.keys(quizAnswers).length + (quizAnswers[quizIndex] ? 0 : 1);
    if (answeredCount >= quizQuestions.length) {
      // All questions answered - complete quiz
      const totalQuestions = quizQuestions.length;
      const finalCorrect = Object.values(quizAnswers).filter(a => a.isCorrect).length + (correct && !quizAnswers[quizIndex] ? 1 : 0);
      const percentage = Math.round(finalCorrect / totalQuestions * 100);

      // Mark lesson as completed if from home (not library)
      if (!topic && percentage >= 60) {
        setCompleted(prev => [...new Set([...prev, activeLesson])]);
        setActiveLesson(Math.min(activeLesson + 1, lessons.length));
        // Bonus for completing lesson
        setStats(s => ({
          ...s,
          coins: s.coins + 100,
          xp: s.xp + 200
        }));
      }

      // Reset quiz state
      setQuiz(null);
      setQuizQuestions([]);
      setQuizIndex(0);
      setQuizCorrect(0);
      setQuizAnswers({});
      setTimer(null);
      return;
    }

    // Go to next question in sequence
    if (nextIdx < quizQuestions.length) {
      setQuizIndex(nextIdx);
      setQuiz(quizQuestions[nextIdx]);

      // Check if already answered
      if (quizAnswers[nextIdx]) {
        setSelected(quizAnswers[nextIdx].selected);
        setAnswered(true);
      } else {
        setSelected(null);
        setAnswered(false);
        if (timerOn) setTimer(quizQuestions[nextIdx].time || 60);
      }
    }
  };
  const rateCard = rating => {
    if (cardIdx < topic.cards.length - 1) {
      setCardIdx(cardIdx + 1);
      setShowAnswer(false);
    } else {
      setStats(s => ({
        ...s,
        cards: s.cards + topic.cards.length,
        xp: s.xp + 50
      }));
      setTab('theory');
      setCardIdx(0);
      setShowAnswer(false);
    }
  };

  // ========== CHAT MANAGEMENT FUNCTIONS ==========

  // Helper function for AI responses
  // Chiamata API Anthropic reale per la chat principale
  const callMainChatAPI = async (userMessage, conversationHistory) => {
    const systemPrompt = `Sei FinLearn AI Coach 🐂, un tutor esperto per la preparazione all'esame CFA Level 1.

REGOLE:
- Rispondi SEMPRE in italiano
- Sii conciso ma completo (max 200 parole)
- Usa emoji per rendere le spiegazioni engaging
- Usa esempi pratici e mnemonici
- Spiega le formule con esempi numerici

TONO: Incoraggiante, usa "tu" informale

AREE DI COMPETENZA:
- Fixed Income (bond, duration, convexity, yield)
- Equity (P/E, EPS, valuation)
- Corporate Finance (NPV, IRR, WACC)
- Portfolio Management (CAPM, beta, diversificazione)
- Derivatives, Economics, Ethics

Rispondi in modo chiaro e pratico, come un tutor esperto.`;
    try {
      const messages = conversationHistory.filter(m => m.role === 'user' || m.role === 'assistant').slice(-10) // Ultimi 10 messaggi per contesto
      .map(m => ({
        role: m.role,
        content: m.content
      }));
      messages.push({
        role: 'user',
        content: userMessage
      });
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 600,
          system: systemPrompt,
          messages: messages
        })
      });
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      const data = await response.json();
      return data.content.filter(block => block.type === 'text').map(block => block.text).join('\n') || 'Mi dispiace, riprova.';
    } catch (err) {
      console.error('API Error:', err);
      return '🐂 Ops! Problema di connessione. Riprova tra poco!';
    }
  };

  // Create new chat
  const createNewChat = () => {
    const newChat = {
      id: `chat_${Date.now()}`,
      title: 'Nuova conversazione',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [{
        role: 'assistant',
        content: `🐂 Ciao${user?.displayName ? ` ${user.displayName}` : ''}! Sono il tuo AI Coach. Come posso aiutarti oggi?`,
        timestamp: new Date().toISOString()
      }]
    };
    setChats(prev => [newChat, ...prev].slice(0, 50));
    setActiveChatId(newChat.id);
    setShowChatHistory(false);
  };

  // Select existing chat
  const selectChat = chatId => {
    setActiveChatId(chatId);
    setShowChatHistory(false);
  };

  // Delete chat
  const deleteChat = (chatId, e) => {
    if (e) e.stopPropagation();
    setChats(prev => prev.filter(c => c.id !== chatId));
    if (activeChatId === chatId) {
      const remaining = chats.filter(c => c.id !== chatId);
      setActiveChatId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  // Open AI Chat from Quiz - creates new chat with quiz context
  const openQuizChat = question => {
    console.log('🎯 openQuizChat called with:', question.q.slice(0, 50));
    const newChat = {
      id: `quiz_${Date.now()}`,
      title: `Quiz: ${question.q.slice(0, 35)}...`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isQuizChat: true,
      quizQuestion: question.q,
      messages: [{
        role: 'assistant',
        content: `🐂 Stai lavorando su:\n\n"${question.q}"\n\nCome posso aiutarti? Posso spiegarti i concetti senza darti la risposta!`,
        timestamp: new Date().toISOString()
      }]
    };
    console.log('📝 Creating new quiz chat:', newChat.id);
    setChats(prev => {
      const updated = [newChat, ...prev].slice(0, 50);
      console.log('📊 Chats after add:', updated.length);
      return updated;
    });
    setQuizChatId(newChat.id);
    setShowQuizChat(true);
  };

  // Close quiz chat modal
  const closeQuizChat = () => {
    setShowQuizChat(false);
    setQuizChatId(null);
  };

  // Send message - works with chats system (now with real AI)
  const sendMsg = async () => {
    if (!msg.trim() || typing) return;
    const userMessage = {
      role: 'user',
      content: msg.trim(),
      timestamp: new Date().toISOString()
    };

    // If no active chat, create a new one
    if (!activeChatId) {
      const newChatId = `chat_${Date.now()}`;
      const welcomeMsg = {
        role: 'assistant',
        content: `🐂 Ciao! Come posso aiutarti?`,
        timestamp: new Date().toISOString()
      };
      const newChat = {
        id: newChatId,
        title: msg.trim().slice(0, 40) + (msg.length > 40 ? '...' : ''),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [welcomeMsg, userMessage]
      };
      setChats(prev => [newChat, ...prev].slice(0, 50));
      setActiveChatId(newChatId);
      const currentMsg = msg;
      setMsg('');
      setTyping(true);
      try {
        const resp = await callMainChatAPI(currentMsg, [welcomeMsg]);
        setChats(prev => prev.map(c => c.id === newChatId ? {
          ...c,
          messages: [...c.messages, {
            role: 'assistant',
            content: resp,
            timestamp: new Date().toISOString()
          }],
          updatedAt: new Date().toISOString()
        } : c));
      } catch (err) {
        console.error('Chat error:', err);
      } finally {
        setTyping(false);
      }
      return;
    }

    // Add message to existing chat
    const currentHistory = [...chat];
    setChats(prev => prev.map(c => {
      if (c.id === activeChatId) {
        const isFirstUserMsg = !c.messages.some(m => m.role === 'user');
        const newTitle = isFirstUserMsg ? msg.trim().slice(0, 40) + (msg.length > 40 ? '...' : '') : c.title;
        return {
          ...c,
          title: newTitle,
          messages: [...c.messages, userMessage],
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    }));
    const currentMsg = msg;
    const currentChatId = activeChatId;
    setMsg('');
    setTyping(true);
    try {
      const resp = await callMainChatAPI(currentMsg, currentHistory);
      setChats(prev => prev.map(c => c.id === currentChatId ? {
        ...c,
        messages: [...c.messages, {
          role: 'assistant',
          content: resp,
          timestamp: new Date().toISOString()
        }],
        updatedAt: new Date().toISOString()
      } : c));
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setTyping(false);
    }
  };

  // ========== QUIZ SCREEN ==========
  if (quiz) {
    const correct = selected === quiz.ans;
    const answeredCount = Object.keys(quizAnswers).length;
    const progress = quizQuestions.length > 1 ? answeredCount / quizQuestions.length * 100 : answered ? 100 : 0;
    const canGoPrev = quizIndex > 0;
    const canGoNext = quizIndex < quizQuestions.length - 1;
    const allAnswered = answeredCount >= quizQuestions.length;
    return /*#__PURE__*/React.createElement("div", {
      className: "min-h-screen bg-slate-50"
    }, /*#__PURE__*/React.createElement("div", {
      className: "bg-white border-b border-slate-200 sticky top-0 z-20"
    }, /*#__PURE__*/React.createElement("div", {
      className: "max-w-xl mx-auto px-4 py-3 flex items-center justify-between"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setQuiz(null);
        setQuizQuestions([]);
        setQuizIndex(0);
        setQuizAnswers({});
      },
      className: "p-2 hover:bg-slate-100 rounded-full"
    }, /*#__PURE__*/React.createElement(X, {
      size: 24,
      className: "text-slate-600"
    })), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setShowCalc(true),
      className: "p-2 hover:bg-amber-100 rounded-full transition",
      title: "Calcolatrice"
    }, /*#__PURE__*/React.createElement(Calculator, {
      size: 20,
      className: "text-amber-600"
    })), /*#__PURE__*/React.createElement("button", {
      onClick: () => openQuizChat(quiz),
      className: "p-2 hover:bg-amber-100 rounded-full transition",
      title: "Chiedi a AI Coach"
    }, /*#__PURE__*/React.createElement(MessageSquare, {
      size: 20,
      className: "text-amber-600"
    })), quizQuestions.length > 1 && /*#__PURE__*/React.createElement("div", {
      className: "bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-bold"
    }, quizIndex + 1, "/", quizQuestions.length), streak > 0 && /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-1 bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-sm font-bold"
    }, "\u2600\uFE0F ", streak, "x"), timerOn && timer !== null && /*#__PURE__*/React.createElement("div", {
      className: `flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${timer <= 10 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'}`
    }, /*#__PURE__*/React.createElement(Clock, {
      size: 16
    }), timer, "s")), /*#__PURE__*/React.createElement("div", {
      className: "w-10"
    })), /*#__PURE__*/React.createElement("div", {
      className: "h-1 bg-slate-200"
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500",
      style: {
        width: `${progress}%`
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "max-w-xl mx-auto px-4 py-6"
    }, quizQuestions.length > 1 && /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3 mb-6"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => navigateToQuestion(quizIndex - 1),
      disabled: !canGoPrev,
      className: `flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-all duration-200 ${canGoPrev ? 'bg-white border border-slate-200 shadow-sm hover:border-amber-400 hover:text-amber-600 active:scale-95 text-slate-500' : 'bg-slate-100 text-slate-300'}`
    }, /*#__PURE__*/React.createElement(ChevronLeft, {
      size: 20
    })), /*#__PURE__*/React.createElement("div", {
      className: "flex-1 overflow-x-auto",
      style: {
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-1.5 px-1 py-1",
      style: {
        width: 'max-content'
      }
    }, quizQuestions.map((_, idx) => {
      const a = quizAnswers[idx];
      const isCurrent = idx === quizIndex;
      return /*#__PURE__*/React.createElement("button", {
        key: idx,
        ref: el => {
          if (el && isCurrent) el.scrollIntoView({
            inline: 'center',
            block: 'nearest',
            behavior: 'smooth'
          });
        },
        onClick: () => navigateToQuestion(idx),
        className: `flex items-center justify-center rounded-lg font-bold shrink-0 transition-all duration-200 ${a ? a.isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-400 text-white' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`,
        style: {
          width: 28,
          height: 28,
          fontSize: 12,
          ...(isCurrent ? {
            transform: 'scale(1.2)',
            background: a ? undefined : 'linear-gradient(135deg,#fbbf24,#f97316)',
            color: '#fff',
            boxShadow: '0 3px 10px -2px rgba(245,158,11,.55)'
          } : {})
        }
      }, idx + 1);
    }))), /*#__PURE__*/React.createElement("button", {
      onClick: () => navigateToQuestion(quizIndex + 1),
      disabled: !canGoNext,
      className: `flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-all duration-200 ${canGoNext ? 'bg-white border border-slate-200 shadow-sm hover:border-amber-400 hover:text-amber-600 active:scale-95 text-slate-500' : 'bg-slate-100 text-slate-300'}`
    }, /*#__PURE__*/React.createElement(ChevronRight, {
      size: 20
    }))), /*#__PURE__*/React.createElement("div", {
      key: quizIndex,
      className: "fl-quiz-in"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-start gap-3 mb-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-black shrink-0 shadow-md",
      style: {
        fontSize: 15
      }
    }, quizIndex + 1), /*#__PURE__*/React.createElement("h2", {
      className: "text-xl font-bold text-slate-800 flex-1 pt-1"
    }, quiz.q)), /*#__PURE__*/React.createElement("div", {
      className: "space-y-3 mb-6"
    }, quiz.opts.map((opt, i) => {
      let style = 'border-slate-200 bg-white hover:border-emerald-400';
      if (answered) {
        if (i === quiz.ans) style = 'border-emerald-500 bg-emerald-50';else if (selected === i) style = 'border-rose-500 bg-rose-50';else style = 'border-slate-200 bg-slate-50 opacity-50';
      } else if (selected === i) style = 'border-amber-500 bg-amber-50';
      return /*#__PURE__*/React.createElement("button", {
        key: i,
        'data-quiz-opt': i,
        onClick: () => !answered && setSelected(i),
        disabled: answered,
        className: `fl-opt-in w-full p-4 rounded-xl border-2 text-left transition-all ${style}`,
        style: {
          animationDelay: `${i * 70 + 60}ms`
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-3"
      }, /*#__PURE__*/React.createElement("div", {
        className: `w-8 h-8 rounded-lg flex items-center justify-center font-bold ${answered && i === quiz.ans ? 'bg-emerald-500 text-white' : answered && selected === i ? 'bg-rose-500 text-white' : selected === i ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'}`
      }, String.fromCharCode(65 + i)), /*#__PURE__*/React.createElement("span", {
        className: "font-medium text-slate-700"
      }, opt), answered && i === quiz.ans && /*#__PURE__*/React.createElement(Check, {
        className: "ml-auto text-emerald-600",
        size: 20
      }), answered && selected === i && !correct && /*#__PURE__*/React.createElement(X, {
        className: "ml-auto text-rose-600",
        size: 20
      })));
    }))), answered && /*#__PURE__*/React.createElement("div", {
      className: `p-4 rounded-xl mb-6 ${correct ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-start gap-3"
    }, /*#__PURE__*/React.createElement(BullMascot, {
      size: 40,
      mood: correct ? 'correct' : 'wrong'
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: `font-bold ${correct ? 'text-emerald-700' : 'text-amber-700'}`
    }, correct ? streak > 1 ? `${streak}x Streak! Sei on fire!` : 'Ottimo lavoro!' : 'Ci sei quasi, riprova!'), /*#__PURE__*/React.createElement("p", {
      className: "text-slate-600 text-sm mt-1"
    }, quiz.exp)))), !answered ? /*#__PURE__*/React.createElement("button", {
      onClick: submit,
      disabled: selected === null,
      className: `w-full py-4 rounded-xl font-bold transition-all ${selected !== null ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-slate-200 text-slate-400'}`
    }, "VERIFICA") : allAnswered ? /*#__PURE__*/React.createElement("button", {
      onClick: next,
      className: "w-full py-4 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
    }, "\uD83C\uDF31 COMPLETA QUIZ") : /*#__PURE__*/React.createElement("button", {
      onClick: next,
      className: "w-full py-4 rounded-xl font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition-all"
    }, "CONTINUA \u2192")), showCalc && /*#__PURE__*/React.createElement(TICalculator, {
      onClose: () => setShowCalc(false)
    }), showQuizChat && quizChatId && /*#__PURE__*/React.createElement(AiChatModal, {
      onClose: closeQuizChat,
      chatId: quizChatId,
      chats: chats,
      setChats: setChats,
      currentQuestion: quiz
    }));
  }

  // ========== MOCK EXAM RENDER ==========
  if (mockExamState.active) {
    const {
      questions,
      currentIndex,
      answers,
      timeRemaining,
      results,
      flagged,
      isFullExam
    } = mockExamState;
    const currentQ = questions[currentIndex];
    const currentAnswer = answers.find(a => a.questionIndex === currentIndex);
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const isTimeWarning = timeRemaining < 300; // 5 min warning

    // Results Screen
    if (results) {
      return /*#__PURE__*/React.createElement("div", {
        className: "min-h-screen",
        style: {
          background: theme === 'dark' ? `linear-gradient(180deg, ${th.bg} 0%, ${th.bgSecondary} 100%)` : `linear-gradient(180deg, ${th.bg} 0%, ${th.bgSecondary} 100%)`
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "max-w-xl mx-auto px-4 py-8"
      }, /*#__PURE__*/React.createElement("div", {
        className: "text-center mb-8"
      }, /*#__PURE__*/React.createElement("div", {
        className: "mb-4"
      }, /*#__PURE__*/React.createElement(BullMascot, {
        size: 100,
        mood: results.passed ? 'celebrating' : 'thinking'
      })), /*#__PURE__*/React.createElement("h1", {
        className: "text-3xl font-black mb-2",
        style: {
          color: th.text
        }
      }, results.passed ? '🎉 Complimenti!' : '💪 Continua così!'), /*#__PURE__*/React.createElement("p", {
        style: {
          color: th.textMuted
        }
      }, results.passed ? 'Hai superato il Mock Exam!' : 'Serve il 70% per passare. Riprova!')), /*#__PURE__*/React.createElement("div", {
        className: "flex justify-center mb-8"
      }, /*#__PURE__*/React.createElement("div", {
        className: `w-40 h-40 rounded-full flex flex-col items-center justify-center ${results.passed ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : 'bg-gradient-to-br from-amber-400 to-orange-500'}`
      }, /*#__PURE__*/React.createElement("span", {
        className: "text-5xl font-black text-white"
      }, results.percentage, "%"), /*#__PURE__*/React.createElement("span", {
        className: "text-white/80 text-sm"
      }, results.correct, "/", results.total, " corrette"))), /*#__PURE__*/React.createElement("div", {
        className: "rounded-2xl p-6 mb-6 text-center",
        style: {
          backgroundColor: th.card,
          borderWidth: 1,
          borderColor: th.cardBorder
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "text-sm font-medium mb-2",
        style: {
          color: th.textMuted
        }
      }, "XP Guadagnati"), /*#__PURE__*/React.createElement("div", {
        className: "text-4xl font-black text-amber-500 flex items-center justify-center gap-2"
      }, /*#__PURE__*/React.createElement(Zap, {
        size: 32
      }), "+", results.xpEarned), results.passed && /*#__PURE__*/React.createElement("div", {
        className: "mt-2 text-sm text-emerald-500 font-semibold"
      }, "\uD83C\uDF81 Include +200 bonus per aver superato!")), /*#__PURE__*/React.createElement("div", {
        className: "rounded-2xl p-4 mb-6",
        style: {
          backgroundColor: th.card,
          borderWidth: 1,
          borderColor: th.cardBorder
        }
      }, /*#__PURE__*/React.createElement("h3", {
        className: "font-bold mb-4 flex items-center gap-2",
        style: {
          color: th.text
        }
      }, /*#__PURE__*/React.createElement(Target, {
        size: 18,
        className: "text-amber-500"
      }), "Performance per Topic"), /*#__PURE__*/React.createElement("div", {
        className: "space-y-3"
      }, Object.entries(results.topicBreakdown).map(([topic, data]) => {
        const pct = Math.round(data.correct / data.total * 100);
        return /*#__PURE__*/React.createElement("div", {
          key: topic
        }, /*#__PURE__*/React.createElement("div", {
          className: "flex justify-between text-sm mb-1"
        }, /*#__PURE__*/React.createElement("span", {
          style: {
            color: th.text
          }
        }, topic), /*#__PURE__*/React.createElement("span", {
          className: pct >= 70 ? 'text-emerald-500' : 'text-amber-500'
        }, data.correct, "/", data.total, " (", pct, "%)")), /*#__PURE__*/React.createElement("div", {
          className: "h-2 rounded-full",
          style: {
            backgroundColor: theme === 'dark' ? '#334155' : '#e2e8f0'
          }
        }, /*#__PURE__*/React.createElement("div", {
          className: `h-full rounded-full ${pct >= 70 ? 'bg-emerald-500' : 'bg-amber-500'}`,
          style: {
            width: `${pct}%`
          }
        })));
      }))), /*#__PURE__*/React.createElement("button", {
        onClick: () => setMockExamState(prev => ({
          ...prev,
          results: null,
          currentIndex: 0
        })),
        className: "w-full py-4 rounded-xl font-bold mb-3 transition",
        style: {
          backgroundColor: th.card,
          borderWidth: 1,
          borderColor: th.cardBorder,
          color: th.text
        }
      }, "\uD83D\uDCDD Rivedi Risposte"), /*#__PURE__*/React.createElement("button", {
        onClick: resetMockExam,
        className: "w-full py-4 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white"
      }, "\u2705 Torna alla Home")));
    }

    // Question Screen
    return /*#__PURE__*/React.createElement("div", {
      className: "min-h-screen pb-24",
      style: {
        backgroundColor: theme === 'dark' ? th.bg : '#f8fafc'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "sticky top-0 z-20 backdrop-blur-sm",
      style: {
        backgroundColor: theme === 'dark' ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)',
        borderBottomWidth: 1,
        borderColor: th.cardBorder
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "max-w-xl mx-auto px-4 py-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        if (confirm('Vuoi davvero abbandonare? Il progresso verrà perso.')) {
          resetMockExam();
        }
      },
      className: "flex items-center gap-1 text-sm font-medium",
      style: {
        color: th.textMuted
      }
    }, /*#__PURE__*/React.createElement(X, {
      size: 18
    }), " Esci"), /*#__PURE__*/React.createElement("div", {
      className: `flex items-center gap-2 px-4 py-2 rounded-full font-mono font-bold ${isTimeWarning ? 'bg-rose-100 text-rose-600 animate-pulse' : ''}`,
      style: !isTimeWarning ? {
        backgroundColor: theme === 'dark' ? th.bgSecondary : '#f1f5f9',
        color: th.text
      } : {}
    }, /*#__PURE__*/React.createElement(Clock, {
      size: 16
    }), String(minutes).padStart(2, '0'), ":", String(seconds).padStart(2, '0')), /*#__PURE__*/React.createElement("div", {
      className: "text-sm font-semibold",
      style: {
        color: th.text
      }
    }, currentIndex + 1, "/", questions.length)), /*#__PURE__*/React.createElement("div", {
      className: "mt-3 h-2 rounded-full",
      style: {
        backgroundColor: theme === 'dark' ? '#334155' : '#e2e8f0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all",
      style: {
        width: `${(currentIndex + 1) / questions.length * 100}%`
      }
    })))), /*#__PURE__*/React.createElement("div", {
      className: "max-w-xl mx-auto px-4 py-6"
    }, /*#__PURE__*/React.createElement("div", {
      key: currentIndex,
      className: "fl-quiz-in"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mb-4"
    }, /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700"
    }, "\uD83D\uDCDA ", currentQ.topic)), /*#__PURE__*/React.createElement("div", {
      className: "rounded-2xl p-5 mb-6",
      style: {
        backgroundColor: th.card,
        borderWidth: 1,
        borderColor: th.cardBorder
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-start gap-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-black shrink-0 shadow-md",
      style: {
        fontSize: 15
      }
    }, currentIndex + 1), /*#__PURE__*/React.createElement("h2", {
      className: "text-lg font-bold leading-relaxed flex-1",
      style: {
        color: th.text
      }
    }, currentQ.q))), /*#__PURE__*/React.createElement("div", {
      className: "space-y-3 mb-6"
    }, currentQ.opts.map((opt, i) => {
      const isSelected = currentAnswer?.selectedAnswer === i;
      const showCorrect = currentAnswer && i === currentQ.ans;
      const showWrong = currentAnswer && isSelected && !currentAnswer.isCorrect;
      let optStyle = {
        backgroundColor: th.card,
        borderWidth: 2,
        borderColor: th.cardBorder,
        color: th.text
      };
      if (showCorrect) {
        optStyle = {
          backgroundColor: theme === 'dark' ? 'rgba(16,185,129,0.15)' : '#ecfdf5',
          borderWidth: 2,
          borderColor: '#10b981',
          color: '#059669'
        };
      } else if (showWrong) {
        optStyle = {
          backgroundColor: theme === 'dark' ? 'rgba(244,63,94,0.15)' : '#fef2f2',
          borderWidth: 2,
          borderColor: '#f43f5e',
          color: '#e11d48'
        };
      } else if (isSelected && !currentAnswer) {
        optStyle = {
          backgroundColor: theme === 'dark' ? 'rgba(251,191,36,0.15)' : '#fffbeb',
          borderWidth: 2,
          borderColor: '#fbbf24',
          color: th.text
        };
      }
      return /*#__PURE__*/React.createElement("button", {
        key: i,
        onClick: () => !currentAnswer && submitMockAnswer(i),
        disabled: !!currentAnswer,
        className: "w-full p-4 rounded-xl text-left transition-all flex items-center gap-3",
        style: optStyle
      }, /*#__PURE__*/React.createElement("div", {
        className: `w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${showCorrect ? 'bg-emerald-500 text-white' : showWrong ? 'bg-rose-500 text-white' : isSelected ? 'bg-amber-500 text-white' : ''}`,
        style: !showCorrect && !showWrong && !isSelected ? {
          backgroundColor: theme === 'dark' ? '#334155' : '#e2e8f0',
          color: th.textMuted
        } : {}
      }, String.fromCharCode(65 + i)), /*#__PURE__*/React.createElement("span", {
        className: "flex-1 font-medium"
      }, opt), showCorrect && /*#__PURE__*/React.createElement(Check, {
        size: 24,
        className: "text-emerald-500"
      }), showWrong && /*#__PURE__*/React.createElement(X, {
        size: 24,
        className: "text-rose-500"
      }));
    })), currentAnswer && /*#__PURE__*/React.createElement("div", {
      className: `rounded-xl p-4 mb-6 ${currentAnswer.isCorrect ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-start gap-3"
    }, /*#__PURE__*/React.createElement(BullMascot, {
      size: 40,
      mood: currentAnswer.isCorrect ? 'correct' : 'wrong'
    }), /*#__PURE__*/React.createElement("div", {
      className: "flex-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: `font-bold mb-1 ${currentAnswer.isCorrect ? 'text-emerald-700' : 'text-amber-700'}`
    }, currentAnswer.isCorrect ? '✓ Corretto!' : '✗ Sbagliato'), /*#__PURE__*/React.createElement("p", {
      className: "text-slate-600 text-sm"
    }, currentQ.exp)))))), /*#__PURE__*/React.createElement("div", {
      className: "fixed bottom-0 left-0 right-0 p-4",
      style: {
        backgroundColor: theme === 'dark' ? th.bg : 'white',
        borderTopWidth: 1,
        borderColor: th.cardBorder
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "max-w-xl mx-auto"
    }, !currentAnswer ? /*#__PURE__*/React.createElement("div", {
      className: "text-center text-sm",
      style: {
        color: th.textMuted
      }
    }, "Seleziona una risposta") : currentIndex >= questions.length - 1 ? /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        // Calculate and show results
        const correct = answers.filter(a => a.isCorrect).length;
        const total = questions.length;
        const percentage = Math.round(correct / total * 100);
        const passed = percentage >= 70;
        const baseXP = isFullExam ? 1000 : 500; // Full exam = 1000 XP
        const bonusXP = passed ? isFullExam ? 500 : 200 : 0; // Full exam bonus = 500

        setStats(s => ({
          ...s,
          xp: s.xp + baseXP + bonusXP,
          totalQuizzes: s.totalQuizzes + 1,
          correctAnswers: s.correctAnswers + correct,
          totalAnswers: s.totalAnswers + total
        }));
        setMockExamState(prev => ({
          ...prev,
          results: {
            correct,
            total,
            percentage,
            passed,
            xpEarned: baseXP + bonusXP,
            topicBreakdown: calculateTopicBreakdown(answers, questions),
            isFullExam
          }
        }));
      },
      className: "w-full py-4 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
    }, "\uD83C\uDFC1 ", isFullExam ? 'COMPLETA FULL EXAM' : 'COMPLETA MOCK EXAM') : /*#__PURE__*/React.createElement("button", {
      onClick: nextMockQuestion,
      className: "w-full py-4 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white"
    }, "PROSSIMA DOMANDA \u2192"))), /*#__PURE__*/React.createElement("div", {
      className: "fixed bottom-20 left-0 right-0 px-4 pb-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "max-w-xl mx-auto"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => currentIndex > 0 && setMockExamState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex - 1
      })),
      disabled: currentIndex === 0,
      className: "w-10 h-10 rounded-xl flex items-center justify-center font-bold transition disabled:opacity-30",
      style: {
        backgroundColor: theme === 'dark' ? '#334155' : '#e2e8f0',
        color: th.text
      }
    }, /*#__PURE__*/React.createElement(ChevronLeft, {
      size: 20
    })), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-1 overflow-x-auto flex-1 justify-center"
    }, (() => {
      const total = questions.length;
      let start = Math.max(0, currentIndex - 2);
      let end = Math.min(total, start + 5);
      if (end - start < 5) start = Math.max(0, end - 5);
      const visibleIndices = [];
      for (let i = start; i < end; i++) visibleIndices.push(i);
      return visibleIndices.map(idx => {
        const ans = answers.find(a => a.questionIndex === idx);
        const isFlagged = flagged.includes(idx);
        return /*#__PURE__*/React.createElement("button", {
          key: idx,
          onClick: () => setMockExamState(prev => ({
            ...prev,
            currentIndex: idx
          })),
          className: `w-9 h-9 rounded-lg text-xs font-bold transition relative ${idx === currentIndex ? 'bg-amber-500 text-white ring-2 ring-amber-300' : ans?.isCorrect ? 'bg-emerald-500 text-white' : ans ? 'bg-rose-500 text-white' : ''}`,
          style: idx !== currentIndex && !ans ? {
            backgroundColor: theme === 'dark' ? '#334155' : '#e2e8f0',
            color: th.textMuted
          } : {}
        }, idx + 1, isFlagged && /*#__PURE__*/React.createElement("span", {
          className: "absolute -top-1 -right-1 text-xs"
        }, "\uD83D\uDEA9"));
      });
    })()), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setMockExamState(prev => ({
          ...prev,
          flagged: prev.flagged.includes(currentIndex) ? prev.flagged.filter(i => i !== currentIndex) : [...prev.flagged, currentIndex]
        }));
      },
      className: `w-10 h-10 rounded-xl flex items-center justify-center transition ${flagged.includes(currentIndex) ? 'bg-rose-500 text-white' : ''}`,
      style: !flagged.includes(currentIndex) ? {
        backgroundColor: theme === 'dark' ? '#334155' : '#e2e8f0',
        color: th.textMuted
      } : {}
    }, "\uD83D\uDEA9"), /*#__PURE__*/React.createElement("select", {
      value: currentIndex,
      onChange: e => setMockExamState(prev => ({
        ...prev,
        currentIndex: parseInt(e.target.value)
      })),
      className: "w-16 h-10 rounded-xl text-center text-sm font-bold appearance-none cursor-pointer",
      style: {
        backgroundColor: theme === 'dark' ? '#334155' : '#e2e8f0',
        color: th.text
      }
    }, questions.map((_, idx) => /*#__PURE__*/React.createElement("option", {
      key: idx,
      value: idx
    }, idx + 1))), /*#__PURE__*/React.createElement("button", {
      onClick: () => currentIndex < questions.length - 1 && setMockExamState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1
      })),
      disabled: currentIndex === questions.length - 1,
      className: "w-10 h-10 rounded-xl flex items-center justify-center font-bold transition disabled:opacity-30",
      style: {
        backgroundColor: theme === 'dark' ? '#334155' : '#e2e8f0',
        color: th.text
      }
    }, /*#__PURE__*/React.createElement(ChevronRight, {
      size: 20
    }))), /*#__PURE__*/React.createElement("div", {
      className: "flex justify-center gap-4 mt-2 text-xs",
      style: {
        color: th.textMuted
      }
    }, /*#__PURE__*/React.createElement("span", null, "\u2713 ", answers.filter(a => a.isCorrect).length), /*#__PURE__*/React.createElement("span", null, "\u2717 ", answers.filter(a => !a.isCorrect).length), /*#__PURE__*/React.createElement("span", null, "\u25CB ", questions.length - answers.length), flagged.length > 0 && /*#__PURE__*/React.createElement("span", null, "\uD83D\uDEA9 ", flagged.length)))));
  }

  // ========== MAIN RENDER ==========
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen pb-24 relative",
    style: {
      background: theme === 'dark' ? '#0B1322' : '#f8fafc'
    }
  }, /*#__PURE__*/React.createElement(GlobalStyles, null), false && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 fl-grid-bg opacity-40 pointer-events-none"
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative z-10"
  }, section === 'home' && /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0",
    style: {
      background: 'radial-gradient(ellipse at 50% -40%, rgba(232,185,49,0.18) 0%, transparent 60%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative",
    style: {
      borderBottomWidth: 1,
      borderColor: th.cardBorder
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-xl mx-auto px-4 py-4 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, (() => {
    const level = getLevelInfo(stats.xp);
    return /*#__PURE__*/React.createElement(FinLearnMark, {
      size: 44
    });
  })(), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "leading-none"
  }, React.createElement(FinLearnWordmark, { size: 26, light: theme !== 'dark' })), /*#__PURE__*/React.createElement("p", {
    className: "fl-mono text-amber-500/80 text-[11px] font-semibold mt-1 tracking-wide"
  }, getLevelInfo(stats.xp).name.toUpperCase(), " \xB7 ", stats.xp.toLocaleString(), " XP"))), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold fl-glass",
    style: {
      color: '#f5d061'
    }
  }, /*#__PURE__*/React.createElement(FlameIconSVG, {
    size: 15,
    animated: stats.streak > 0
  }), " ", stats.streak), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold fl-glass",
    style: {
      color: '#f5d061'
    }
  }, /*#__PURE__*/React.createElement(StarIconSVG, {
    size: 15
  }), stats.coins))))), /*#__PURE__*/React.createElement("div", {
    className: "max-w-xl mx-auto px-4 py-6"
  }, React.createElement(AlbumHome, { losProgress, theme, onOpenLOS: openLOSFromAlbum }), /*#__PURE__*/React.createElement("div", {
    className: "mt-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-4"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "font-bold flex items-center gap-2",
    style: {
      color: th.text
    }
  }, /*#__PURE__*/React.createElement(TrophyIconSVG, {
    size: 24
  }), " Arena delle simulazioni"), /*#__PURE__*/React.createElement("div", {
    className: "text-xs px-3 py-1 rounded-full",
    style: {
      backgroundColor: theme === 'dark' ? 'rgba(51,65,85,0.5)' : '#f1f5f9',
      color: th.textMuted
    }
  }, "Reset tra ", getDaysUntilReset(), " giorni")), /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-xl mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: `bg-gradient-to-r ${getUserLeague(stats.xp).color} p-4`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, (() => {
    const level = getLevelInfo(stats.xp);
    return /*#__PURE__*/React.createElement(level.Icon, {
      size: 48,
      className: "drop-shadow-lg"
    });
  })(), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-white/80 text-xs"
  }, "La tua posizione"), /*#__PURE__*/React.createElement("div", {
    className: "text-white font-black text-xl"
  }, "#", getUserRank()))), /*#__PURE__*/React.createElement("div", {
    className: "text-right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-white/80 text-xs"
  }, "Lega ", getUserLeague(stats.xp).name), /*#__PURE__*/React.createElement("div", {
    className: "text-white font-bold text-lg"
  }, stats.xp, " XP")))), /*#__PURE__*/React.createElement("div", {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-slate-400 text-xs font-semibold mb-3 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Flame, {
    size: 14,
    className: "text-orange-400"
  }), "CLASSIFICA SETTIMANALE"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, leaderboard.slice(0, 5).map((player, idx) => {
    const isUser = player.xp <= stats.xp && (idx === 0 || leaderboard[idx - 1].xp > stats.xp);
    const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : null;
    return /*#__PURE__*/React.createElement("div", {
      key: player.id,
      className: `flex items-center gap-3 p-2 rounded-xl transition-all ${isUser ? 'bg-amber-500/20 border border-amber-500/30' : 'hover:bg-white/5'}`
    }, /*#__PURE__*/React.createElement("div", {
      className: `w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-amber-400 text-amber-900' : idx === 1 ? 'bg-slate-300 text-slate-700' : idx === 2 ? 'bg-orange-400 text-orange-900' : 'bg-slate-700 text-slate-300'}`
    }, medal || idx + 1), /*#__PURE__*/React.createElement("div", {
      className: "w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-xl"
    }, player.avatar), /*#__PURE__*/React.createElement("div", {
      className: "flex-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-white font-semibold text-sm"
    }, player.name), /*#__PURE__*/React.createElement("div", {
      className: "text-slate-500 text-xs"
    }, player.xp.toLocaleString(), " XP")), /*#__PURE__*/React.createElement("div", {
      className: `text-xs font-bold ${player.change > 0 ? 'text-emerald-400' : player.change < 0 ? 'text-rose-400' : 'text-slate-500'}`
    }, player.change > 0 ? `↑${player.change}` : player.change < 0 ? `↓${Math.abs(player.change)}` : '−'));
  })), getUserRank() > 5 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "text-center text-slate-600 py-2"
  }, "\u2022 \u2022 \u2022"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 p-2 rounded-xl bg-amber-500/20 border border-amber-500/30"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm bg-slate-700 text-slate-300"
  }, getUserRank()), /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-xl"
  }, stats.xp >= 2000 ? '🌳' : stats.xp >= 500 ? '🌿' : '🌱'), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-white font-semibold text-sm"
  }, "Tu"), /*#__PURE__*/React.createElement("div", {
    className: "text-slate-500 text-xs"
  }, stats.xp.toLocaleString(), " XP")), /*#__PURE__*/React.createElement("div", {
    className: "text-amber-400 text-xs font-bold"
  }, "\u2B50 TU"))))), /*#__PURE__*/React.createElement("div", {
    onClick: () => isPro ? setShowMockExamSetup(true) : setShowProModal(true),
    className: `relative overflow-hidden rounded-2xl border-2 transition-all cursor-pointer ${isPro ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 hover:border-amber-400 hover:shadow-lg' : 'bg-gradient-to-br from-slate-100 to-slate-50 border-slate-200 hover:border-slate-300'}`
  }, !isPro && /*#__PURE__*/React.createElement("div", {
    className: "absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg"
  }, /*#__PURE__*/React.createElement(Lock, {
    size: 12
  }), "PRO"), /*#__PURE__*/React.createElement("div", {
    className: "absolute top-3 right-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg"
  }, /*#__PURE__*/React.createElement(Award, {
    size: 12
  }), "UFFICIALE"), /*#__PURE__*/React.createElement("div", {
    className: "p-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-teal-500/30"
  }, /*#__PURE__*/React.createElement(Trophy, {
    size: 32,
    className: "text-white"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-lg text-slate-800 pr-20"
  }, "Esame completo"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm mt-1 text-slate-600"
  }, "180 domande \u2022 4h 30min \u2022 come all'esame vero"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mt-3 flex-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700"
  }, /*#__PURE__*/React.createElement(Zap, {
    size: 12
  }), "+1000 XP"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-purple-100 text-purple-700"
  }, /*#__PURE__*/React.createElement(Target, {
    size: 12
  }), "Classifica")))), /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      const questions = generateFullMockExam();
      setMockExamState({
        active: true,
        loading: false,
        questions,
        currentIndex: 0,
        answers: [],
        timeRemaining: CFA_FULL_EXAM_CONFIG.timeMinutes * 60,
        sessionTopic: 'full',
        examConfig: {
          type: 'full',
          numQuestions: 180
        },
        results: null,
        error: null,
        flagged: [],
        isFullExam: true
      });
    },
    className: "w-full mt-4 py-3 rounded-xl font-bold transition-all bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-teal-500/20"
  }, "Inizia la simulazione (180 domande)"))), /*#__PURE__*/React.createElement("div", {
    className: "relative overflow-hidden rounded-2xl border-2 transition-all cursor-pointer bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 hover:border-amber-400 hover:shadow-lg mt-4",
    onClick: () => setShowMockExamSetup(true)
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg"
  }, /*#__PURE__*/React.createElement(BookOpen, {
    size: 12
  }), "ALLENAMENTO"), /*#__PURE__*/React.createElement("div", {
    className: "p-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/30"
  }, /*#__PURE__*/React.createElement(BullMascot, {
    size: 48,
    mood: "happy"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-lg text-slate-800 pr-20"
  }, "Allenamento"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm mt-1 text-slate-600"
  }, "Scegli argomenti e numero di domande"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700"
  }, /*#__PURE__*/React.createElement(Zap, {
    size: 12
  }), "+500 XP")))), /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      setShowMockExamSetup(true);
    },
    className: "w-full mt-4 py-3 rounded-xl font-bold transition-all bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-orange-500/20"
  }, "Configura l'allenamento"))), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 bg-white rounded-xl p-4 border border-slate-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Zap, {
    size: 16,
    className: "text-amber-500"
  }), "Come guadagnare XP"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-slate-600"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2 h-2 bg-emerald-400 rounded-full"
  }), "Quiz completato: +20"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-slate-600"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2 h-2 bg-emerald-400 rounded-full"
  }), "Risposta corretta: +10"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-slate-600"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2 h-2 bg-amber-400 rounded-full"
  }), "Streak bonus: +10/livello"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-slate-600"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2 h-2 bg-purple-400 rounded-full"
  }), "Mock Exam: +500 \uD83D\uDC51")))))), section === 'library' && /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen pb-24",
    style: {
      backgroundColor: 'transparent'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sticky top-0 z-10 fl-glass",
    style: {
      borderBottom: `1px solid ${th.cardBorder}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-xl mx-auto px-4 py-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-2xl flex items-center justify-center fl-float",
    style: {
      background: 'linear-gradient(135deg, #f5d061, #d97706)'
    }
  }, /*#__PURE__*/React.createElement(BookOpen, {
    className: "text-white",
    size: 20
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "fl-display font-bold text-lg",
    style: {
      color: th.text
    }
  }, "Studia"), /*#__PURE__*/React.createElement("p", {
    className: "fl-mono text-[11px] tracking-wide",
    style: {
      color: th.textMuted
    }
  }, "CFA LEVEL II \xB7 2026"))), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setStudyMode('curriculum');
      setTopic(null);
      setCfaTopic(null);
      setCfaModule(null);
      setCfaLOS(null);
    },
    className: `flex-1 py-2.5 px-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${studyMode === 'curriculum' ? 'text-white fl-card-hover' : ''}`,
    style: studyMode === 'curriculum' ? {
      background: 'linear-gradient(110deg, #d97706, #f59e0b)',
      boxShadow: '0 10px 24px -10px rgba(245,158,11,.5)'
    } : {
      backgroundColor: th.card,
      color: th.textMuted,
      border: `1px solid ${th.cardBorder}`
    }
  }, /*#__PURE__*/React.createElement(GraduationCap, {
    size: 16
  }), "Curriculum CFA"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setStudyMode('topics');
      setCfaTopic(null);
      setCfaModule(null);
      setCfaLOS(null);
    },
    className: `flex-1 py-2.5 px-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${studyMode === 'topics' ? 'text-white fl-card-hover' : ''}`,
    style: studyMode === 'topics' ? {
      background: 'linear-gradient(110deg, #d97706, #f59e0b)',
      boxShadow: '0 10px 24px -10px rgba(245,158,11,.5)'
    } : {
      backgroundColor: th.card,
      color: th.textMuted,
      border: `1px solid ${th.cardBorder}`
    }
  }, /*#__PURE__*/React.createElement(Zap, {
    size: 16
  }), "Argomenti rapidi")))), /*#__PURE__*/React.createElement("div", {
    className: "max-w-xl mx-auto px-4 py-6"
  }, eqOpen && /*#__PURE__*/React.createElement(EquityModule, {
    th: th,
    theme: theme,
    onClose: () => setEqOpen(false),
    rewarded: eqRewarded,
    markRewarded: k => setEqRewarded(p => [...p, k]),
    onReward: (xp, coins) => setStats(s => ({
      ...s,
      xp: s.xp + xp,
      coins: s.coins + coins,
      quizzes: s.quizzes + 1
    }))
  }), studyMode === 'curriculum' && /*#__PURE__*/React.createElement(React.Fragment, null, !cfaTopic && !cfaModule && !cfaLOS && /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold flex items-center gap-2",
    style: {
      color: th.text
    }
  }, /*#__PURE__*/React.createElement(BookOpen, {
    size: 18,
    className: "text-amber-500"
  }), "Argomenti"), Object.entries(CFA_CURRICULUM).map(([key, td]) => /*#__PURE__*/React.createElement("button", {
    key: key,
    onClick: () => setCfaTopic(td),
    className: "w-full rounded-2xl p-5 text-left transition-all hover:scale-[1.01]",
    style: {
      backgroundColor: th.card,
      border: `1px solid ${th.cardBorder}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: `w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg overflow-hidden ${String(td.icon).startsWith('data:') ? '' : 'bg-gradient-to-br ' + td.color}`
  }, String(td.icon).startsWith('data:') ? /*#__PURE__*/React.createElement("img", {
    src: td.icon,
    alt: "",
    className: "w-full h-full object-contain select-none",
    draggable: false
  }) : td.icon), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-lg",
    style: {
      color: th.text
    }
  }, td.name), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mt-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 font-semibold"
  }, td.weight), /*#__PURE__*/React.createElement("span", {
    className: "text-xs",
    style: {
      color: th.textMuted
    }
  }, td.totalModules, " moduli"))), /*#__PURE__*/React.createElement(ChevronRight, {
    size: 24,
    style: {
      color: th.textMuted
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl p-5",
    style: {
      backgroundColor: th.card,
      border: `1px solid ${th.cardBorder}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement(Target, {
    className: "text-white",
    size: 28
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "font-bold",
    style: {
      color: th.text
    }
  }, "I tuoi progressi"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm",
    style: {
      color: th.textMuted
    }
  }, losProgress.length, "/", TOTAL_CFA_LOS, " LOS completati")), /*#__PURE__*/React.createElement("span", {
    className: "text-2xl font-black text-amber-500"
  }, Math.round(losProgress.length / TOTAL_CFA_LOS * 100), "%")), /*#__PURE__*/React.createElement("div", {
    className: "h-2.5 rounded-full overflow-hidden",
    style: {
      backgroundColor: theme === 'dark' ? '#334155' : '#e2e8f0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full bg-gradient-to-r from-amber-500 to-orange-500",
    style: {
      width: `${losProgress.length / TOTAL_CFA_LOS * 100}%`
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10",
    style: {
      border: '1px solid rgba(251,191,36,0.3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-2xl"
  }, "\uD83D\uDCCA"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-amber-500 font-semibold text-sm"
  }, "Novità: Equity Valuation completo"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs mt-1",
    style: {
      color: th.textMuted
    }
  }, "Reading 22\u201327 \xB7 76 LOS con il testo integrale tradotto, formule, esempi svolti e una domanda d'esame per LOS"))))), cfaTopic && !cfaModule && !cfaLOS && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: `rounded-2xl p-5 mb-4 bg-gradient-to-br ${cfaTopic.color}`
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setCfaTopic(null),
    className: "flex items-center gap-1 text-white/80 hover:text-white mb-3 font-medium text-sm"
  }, /*#__PURE__*/React.createElement(ChevronLeft, {
    size: 18
  }), "Indietro"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4 text-white"
  }, String(cfaTopic.icon).startsWith('data:') ? /*#__PURE__*/React.createElement("img", {
    src: cfaTopic.icon,
    alt: "",
    className: "w-16 h-16 object-contain drop-shadow-lg select-none",
    draggable: false
  }) : /*#__PURE__*/React.createElement("span", {
    className: "text-5xl"
  }, cfaTopic.icon), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-black"
  }, cfaTopic.name), /*#__PURE__*/React.createElement("p", {
    className: "text-white/80 text-sm"
  }, cfaTopic.weight, " \xB7 ", cfaTopic.totalModules, " moduli")))), /*#__PURE__*/React.createElement("h3", {
    className: "font-bold mb-4 flex items-center gap-2",
    style: {
      color: th.text
    }
  }, /*#__PURE__*/React.createElement(Layers, {
    size: 18,
    className: "text-amber-500"
  }), "Moduli"), cfaTopic.modules.map(m => {
    const done = losProgress.filter(id => id.startsWith(m.id)).length;
    const pct = done / m.los.length * 100;
    return /*#__PURE__*/React.createElement("button", {
      key: m.id,
      onClick: () => setCfaModule(m),
      className: "w-full rounded-xl p-4 mb-3 text-left",
      style: {
        backgroundColor: th.card,
        border: `1px solid ${pct === 100 ? '#22c55e' : th.cardBorder}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: `w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg ${pct === 100 ? 'bg-emerald-500' : 'bg-gradient-to-br from-amber-500 to-orange-600'}`
    }, pct === 100 ? /*#__PURE__*/React.createElement(Check, {
      size: 24
    }) : m.number), /*#__PURE__*/React.createElement("div", {
      className: "flex-1"
    }, /*#__PURE__*/React.createElement("h4", {
      className: "font-bold",
      style: {
        color: th.text
      }
    }, m.id.startsWith("pm-") ? "R" : "LM", m.number, ": ", m.title), /*#__PURE__*/React.createElement("p", {
      className: "text-xs mt-1",
      style: {
        color: th.textMuted
      }
    }, m.los.length, " LOS \xB7 ", m.estimatedTime), /*#__PURE__*/React.createElement("div", {
      className: "mt-2 h-1.5 rounded-full overflow-hidden",
      style: {
        backgroundColor: theme === 'dark' ? '#334155' : '#e2e8f0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: `h-full ${pct === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`,
      style: {
        width: `${pct}%`
      }
    }))), /*#__PURE__*/React.createElement(ChevronRight, {
      size: 20,
      style: {
        color: th.textMuted
      }
    })));
  })), cfaModule && !cfaLOS && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl p-4 mb-4",
    style: {
      backgroundColor: th.card,
      border: `1px solid ${th.cardBorder}`
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setCfaModule(null),
    className: "flex items-center gap-1 mb-3 font-medium text-sm",
    style: {
      color: th.textMuted
    }
  }, /*#__PURE__*/React.createElement(ChevronLeft, {
    size: 18
  }), cfaTopic.name), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-black text-lg"
  }, cfaModule.number), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "font-bold",
    style: {
      color: th.text
    }
  }, cfaModule.title), /*#__PURE__*/React.createElement("p", {
    className: "text-xs",
    style: {
      color: th.textMuted
    }
  }, cfaModule.los.length, " LOS")))), /*#__PURE__*/React.createElement("h3", {
    className: "font-bold mb-3 flex items-center gap-2",
    style: {
      color: th.text
    }
  }, /*#__PURE__*/React.createElement(Zap, {
    size: 18,
    className: "text-amber-500"
  }), "Obiettivi di apprendimento (LOS)"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, cfaModule.los.map((los, idx) => {
    const done = losProgress.includes(`${cfaModule.id}-${los.id}`);
    return /*#__PURE__*/React.createElement("button", {
      key: los.id,
      onClick: () => {
        setCfaLOS({
          ...los,
          index: idx
        });
        setExpandedSection(0);
      },
      className: "w-full rounded-xl p-4 text-left",
      style: {
        backgroundColor: th.card,
        border: `1px solid ${done ? '#22c55e' : th.cardBorder}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-start gap-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: `w-10 h-10 rounded-lg flex items-center justify-center font-bold ${done ? 'bg-emerald-500 text-white' : 'bg-amber-500/20 text-amber-500'}`
    }, done ? /*#__PURE__*/React.createElement(Check, {
      size: 20
    }) : los.id.toUpperCase()), /*#__PURE__*/React.createElement("div", {
      className: "flex-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2 mb-1"
    }, /*#__PURE__*/React.createElement("span", {
      className: `text-[10px] px-2 py-0.5 rounded font-bold ${los.importance === 'VERY HIGH' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`
    }, los.importance), /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] px-2 py-0.5 rounded",
      style: {
        backgroundColor: theme === 'dark' ? '#334155' : '#e2e8f0',
        color: th.textMuted
      }
    }, los.commandWord)), /*#__PURE__*/React.createElement("p", {
      className: "text-sm font-medium",
      style: {
        color: th.text
      }
    }, los.title)), /*#__PURE__*/React.createElement(ChevronRight, {
      size: 18,
      style: {
        color: th.textMuted
      }
    })));
  }))), cfaLOS && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-4"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setCfaLOS(null),
    className: "flex items-center gap-1 font-medium",
    style: {
      color: th.textMuted
    }
  }, /*#__PURE__*/React.createElement(ChevronLeft, {
    size: 20
  }), cfaModule.id.startsWith("pm-") ? "R" : "LM", cfaModule.number), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-500"
  }, cfaLOS.code || "LOS " + cfaLOS.id.toUpperCase(), " \xB7 ", cfaLOS.index + 1, "/", cfaModule.los.length)), /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl p-5 mb-5 bg-gradient-to-br from-amber-500 to-orange-600 text-white"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mb-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold px-2 py-1 rounded bg-white/20"
  }, cfaLOS.commandWord), /*#__PURE__*/React.createElement("span", {
    className: `text-xs font-bold px-2 py-1 rounded ${cfaLOS.importance === 'VERY HIGH' ? 'bg-rose-500' : 'bg-white/30'}`
  }, cfaLOS.importance), losProgress.includes(`${cfaModule.id}-${cfaLOS.id}`) && /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold px-2 py-1 rounded bg-emerald-500 flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(Check, {
    size: 12
  }), "Done")), /*#__PURE__*/React.createElement("h2", {
    className: "font-bold text-lg"
  }, cfaLOS.title)), cfaLOS.content.introduction && /*#__PURE__*/React.createElement("div", {
    className: "rounded-xl p-4 mb-4",
    style: {
      backgroundColor: 'rgba(251,191,36,0.1)',
      border: '1px solid rgba(251,191,36,0.2)'
    }
  }, /*#__PURE__*/React.createElement(RichText, {
    text: cfaLOS.content.introduction,
    className: "text-sm"
  })), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3 mb-5"
  }, cfaLOS.content.sections.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "rounded-xl overflow-hidden",
    style: {
      backgroundColor: th.card,
      border: `1px solid ${expandedSection === i ? '#f59e0b' : th.cardBorder}`
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setExpandedSection(expandedSection === i ? -1 : i),
    className: "w-full p-4 flex items-center gap-3 text-left"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-2xl"
  }, s.icon), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-amber-500 flex-1"
  }, s.title), /*#__PURE__*/React.createElement(ChevronRight, {
    size: 20,
    className: `transition-transform ${expandedSection === i ? 'rotate-90' : ''}`,
    style: {
      color: th.textMuted
    }
  })), expandedSection === i && /*#__PURE__*/React.createElement("div", {
    className: "px-4 pb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-px mb-4",
    style: {
      backgroundColor: th.cardBorder
    }
  }), /*#__PURE__*/React.createElement(RichText, {
    text: s.content,
    className: "text-sm"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "rounded-xl p-4 mb-4",
    style: {
      backgroundColor: th.card,
      border: `1px solid ${th.cardBorder}`
    }
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-amber-500 mb-3 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Target, {
    size: 18
  }), "Punti chiave"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, cfaLOS.keyPoints.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "flex items-start gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5"
  }, /*#__PURE__*/React.createElement(Check, {
    size: 12,
    className: "text-emerald-500"
  })), /*#__PURE__*/React.createElement("p", {
    className: "text-sm",
    style: {
      color: th.text
    }
  }, p))))), /*#__PURE__*/React.createElement("div", {
    className: "rounded-xl p-4 mb-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10",
    style: {
      border: '1px solid rgba(251,191,36,0.3)'
    }
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-amber-500 mb-3 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Award, {
    size: 18
  }), "Consigli d'esame"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, cfaLOS.examTips.map((t, i) => /*#__PURE__*/React.createElement("p", {
    key: i,
    className: "text-sm",
    style: {
      color: th.text
    }
  }, t)))), cfaLOS.question && /*#__PURE__*/React.createElement(LosQuestion, {
    key: `${cfaModule.id}-${cfaLOS.id}`,
    q: cfaLOS.question
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      const id = `${cfaModule.id}-${cfaLOS.id}`;
      if (!losProgress.includes(id)) {
        const doneN = cfaModule.los.filter(l => losProgress.includes(`${cfaModule.id}-${l.id}`)).length + 1;
        flFx.losDone({ code: cfaLOS.code || `LOS ${cfaModule.number}${cfaLOS.id}`, title: cfaLOS.title, icon: String(cfaTopic?.icon || '').startsWith('data:') ? cfaTopic.icon : cfaLOS.content?.sections?.[0]?.icon,
          reading: (cfaModule.id.startsWith('pm-') ? 'R' : 'LM') + cfaModule.number, done: doneN, total: cfaModule.los.length });
        setLosProgress([...losProgress, id]);
        albumLearn(id);
      }
      if (cfaLOS.index < cfaModule.los.length - 1) {
        setCfaLOS({
          ...cfaModule.los[cfaLOS.index + 1],
          index: cfaLOS.index + 1
        });
        setExpandedSection(0);
      } else setCfaLOS(null);
    },
    className: `w-full py-4 rounded-xl font-bold text-white text-lg ${losProgress.includes(`${cfaModule.id}-${cfaLOS.id}`) ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`
  }, losProgress.includes(`${cfaModule.id}-${cfaLOS.id}`) ? '✅ ' : '✓ ', cfaLOS.index < cfaModule.los.length - 1 ? 'Completa e continua →' : 'Completa il LOS'), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mt-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (cfaLOS.index > 0) {
        setCfaLOS({
          ...cfaModule.los[cfaLOS.index - 1],
          index: cfaLOS.index - 1
        });
        setExpandedSection(0);
      }
    },
    disabled: cfaLOS.index === 0,
    className: "flex-1 py-3 rounded-xl font-semibold disabled:opacity-30",
    style: {
      backgroundColor: th.card,
      color: th.text,
      border: `1px solid ${th.cardBorder}`
    }
  }, "\u2190 Precedente"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (cfaLOS.index < cfaModule.los.length - 1) {
        setCfaLOS({
          ...cfaModule.los[cfaLOS.index + 1],
          index: cfaLOS.index + 1
        });
        setExpandedSection(0);
      }
    },
    disabled: cfaLOS.index >= cfaModule.los.length - 1,
    className: "flex-1 py-3 rounded-xl font-semibold disabled:opacity-30",
    style: {
      backgroundColor: th.card,
      color: th.text,
      border: `1px solid ${th.cardBorder}`
    }
  }, "Successivo \u2192")))), studyMode === 'topics' && /*#__PURE__*/React.createElement(React.Fragment, null, !topic ? /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, Object.values(topics).map(tp => /*#__PURE__*/React.createElement("button", {
    key: tp.id,
    onClick: () => setTopic(tp),
    className: "w-full rounded-2xl text-left overflow-hidden group",
    style: {
      backgroundColor: th.card,
      border: `1px solid ${th.cardBorder}`
    }
  }, tp.image && /*#__PURE__*/React.createElement("div", {
    className: "relative h-32 overflow-hidden"
  }, /*#__PURE__*/React.createElement("img", {
    src: tp.image,
    alt: tp.title,
    className: "w-full h-full object-cover"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0",
    style: {
      background: theme === 'dark' ? 'linear-gradient(to top, rgba(15,23,42,1), transparent)' : 'linear-gradient(to top, rgba(255,255,255,1), transparent)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute bottom-3 left-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-3xl"
  }, tp.icon))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 flex items-center gap-3"
  }, !tp.image && /*#__PURE__*/React.createElement("span", {
    className: "text-3xl"
  }, tp.icon), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-lg",
    style: {
      color: th.text
    }
  }, tp.title), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-3 mt-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs",
    style: {
      color: th.textMuted
    }
  }, /*#__PURE__*/React.createElement(Clock, {
    size: 12,
    className: "inline mr-1"
  }), tp.time), /*#__PURE__*/React.createElement("span", {
    className: "text-xs",
    style: {
      color: th.textMuted
    }
  }, tp.theory?.length || 0, " lessons"))), /*#__PURE__*/React.createElement(ChevronRight, {
    size: 20,
    style: {
      color: th.textMuted
    }
  }))))) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setTopic(null);
      setTab('theory');
    },
    className: "flex items-center gap-1 mb-4 font-medium",
    style: {
      color: th.textMuted
    }
  }, /*#__PURE__*/React.createElement(ChevronLeft, {
    size: 20
  }), "Indietro"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 mb-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-4xl"
  }, topic.icon), /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-bold",
    style: {
      color: th.text
    }
  }, topic.title)), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mb-6"
  }, ['theory', 'cards', 'quiz'].map(tb => /*#__PURE__*/React.createElement("button", {
    key: tb,
    onClick: () => {
      setTab(tb);
      if (tb === 'cards') {
        setCardIdx(0);
        setShowAnswer(false);
      }
    },
    className: `px-4 py-2 rounded-lg text-sm font-semibold ${tab === tb ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : ''}`,
    style: tab !== tb ? {
      backgroundColor: th.card,
      color: th.textMuted
    } : {}
  }, tb === 'theory' ? '📖 Theory' : tb === 'cards' ? '🧠 Cards' : '✍️ Quiz'))), tab === 'theory' && topic.theory && /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, topic.theory.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "rounded-xl p-5",
    style: {
      backgroundColor: th.card,
      border: `1px solid ${th.cardBorder}`
    }
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold mb-2",
    style: {
      color: th.text
    }
  }, i + 1, ". ", s.title), /*#__PURE__*/React.createElement("p", {
    className: "whitespace-pre-line",
    style: {
      color: th.textMuted
    }
  }, s.content)))), tab === 'cards' && topic.cards && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between mb-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-sm",
    style: {
      color: th.textMuted
    }
  }, "Card ", cardIdx + 1, "/", topic.cards.length)), /*#__PURE__*/React.createElement("div", {
    onClick: () => setShowAnswer(!showAnswer),
    className: "bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white min-h-[250px] cursor-pointer"
  }, !showAnswer ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-amber-200 text-sm mb-3"
  }, "QUESTION"), /*#__PURE__*/React.createElement("h3", {
    className: "text-xl font-bold"
  }, topic.cards[cardIdx].front)) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-amber-200 text-sm mb-2"
  }, "ANSWER"), /*#__PURE__*/React.createElement("p", null, topic.cards[cardIdx].back))), showAnswer && /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-3 mt-4"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setShowAnswer(false);
      setCardIdx(Math.min(cardIdx + 1, topic.cards.length - 1));
    },
    className: "py-3 rounded-xl bg-rose-100 text-rose-700 font-semibold"
  }, "Hard"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setShowAnswer(false);
      setCardIdx(Math.min(cardIdx + 1, topic.cards.length - 1));
    },
    className: "py-3 rounded-xl bg-amber-100 text-amber-700 font-semibold"
  }, "Ok"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setShowAnswer(false);
      setCardIdx(Math.min(cardIdx + 1, topic.cards.length - 1));
    },
    className: "py-3 rounded-xl bg-emerald-100 text-emerald-700 font-semibold"
  }, "Easy"))), tab === 'quiz' && topic.questions && /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, topic.questions.slice(0, 5).map((q, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "rounded-xl p-4",
    style: {
      backgroundColor: th.card,
      border: `1px solid ${th.cardBorder}`
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-medium mb-3",
    style: {
      color: th.text
    }
  }, "Q", i + 1, ": ", q.q), /*#__PURE__*/React.createElement("button", {
    onClick: () => startSingleQuiz(q),
    className: "px-4 py-2 bg-amber-500 text-white rounded-lg font-semibold"
  }, "Start \u2192")))))))), section === 'ai' && /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex flex-col",
    style: {
      backgroundColor: 'transparent'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl-glass",
    style: {
      borderBottomWidth: 1,
      borderColor: th.cardBorder
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-xl mx-auto px-4 py-4 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-2xl flex items-center justify-center fl-float",
    style: {
      background: 'linear-gradient(135deg, #f5d061, #d97706)'
    }
  }, /*#__PURE__*/React.createElement(BullMascot, {
    size: 32,
    mood: "happy"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "fl-display font-bold text-lg",
    style: {
      color: th.text
    }
  }, "AI Coach"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs",
    style: {
      color: th.textMuted
    }
  }, "Il tuo tutor finanziario"))), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowChatHistory(true),
    className: "p-2 rounded-lg relative transition",
    style: {
      backgroundColor: theme === 'dark' ? th.bgSecondary : '#f1f5f9'
    },
    title: "Cronologia chat"
  }, /*#__PURE__*/React.createElement(Clock, {
    size: 20,
    style: {
      color: th.textMuted
    }
  }), chats.length > 0 && /*#__PURE__*/React.createElement("span", {
    className: "absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
  }, chats.length)), /*#__PURE__*/React.createElement("button", {
    onClick: createNewChat,
    className: "p-2 bg-amber-100 hover:bg-amber-200 rounded-lg",
    title: "Nuova chat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-amber-600 text-xl font-bold"
  }, "+"))))), !activeChatId && chats.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "flex-1 flex flex-col items-center justify-center p-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-24 h-24 mb-6"
  }, /*#__PURE__*/React.createElement(BullMascot, {
    size: 96,
    mood: "celebrating"
  })), /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-bold mb-2",
    style: {
      color: th.text
    }
  }, "Benvenuto in AI Coach!"), /*#__PURE__*/React.createElement("p", {
    className: "text-center mb-6",
    style: {
      color: th.textMuted
    }
  }, "Il tuo tutor finanziario personale per la preparazione CFA"), /*#__PURE__*/React.createElement("button", {
    onClick: createNewChat,
    className: "px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition"
  }, "Inizia una conversazione")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-y-auto max-w-xl mx-auto w-full px-4 py-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, chat.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: `max-w-[85%] rounded-2xl p-4 ${m.role === 'user' ? 'bg-amber-500 text-white' : ''}`,
    style: m.role !== 'user' ? {
      backgroundColor: th.card,
      borderWidth: 1,
      borderColor: th.cardBorder,
      color: th.text
    } : {}
  }, m.content))), typing && /*#__PURE__*/React.createElement("div", {
    className: "flex justify-start"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl p-4",
    style: {
      backgroundColor: th.card,
      borderWidth: 1,
      borderColor: th.cardBorder
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-2 h-2 bg-amber-400 rounded-full animate-bounce"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-2 h-2 bg-amber-400 rounded-full animate-bounce",
    style: {
      animationDelay: '0.1s'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-2 h-2 bg-amber-400 rounded-full animate-bounce",
    style: {
      animationDelay: '0.2s'
    }
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "p-4",
    style: {
      backgroundColor: th.card,
      borderTopWidth: 1,
      borderColor: th.cardBorder
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-xl mx-auto flex gap-2"
  }, /*#__PURE__*/React.createElement("input", {
    value: msg,
    onChange: e => setMsg(e.target.value),
    onKeyDown: e => e.key === 'Enter' && sendMsg(),
    placeholder: "Chiedimi qualcosa...",
    className: "flex-1 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-amber-300",
    style: {
      backgroundColor: theme === 'dark' ? th.bgSecondary : '#f1f5f9',
      color: th.text
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: sendMsg,
    disabled: !msg.trim(),
    className: `px-4 py-3 rounded-xl transition-all ${msg.trim() ? 'bg-amber-500 text-white' : ''}`,
    style: !msg.trim() ? {
      backgroundColor: theme === 'dark' ? th.bgSecondary : '#e2e8f0',
      color: th.textMuted
    } : {}
  }, /*#__PURE__*/React.createElement(Send, {
    size: 20
  }))))), showChatHistory && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-black/50",
    onClick: () => setShowChatHistory(false)
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative ml-auto w-80 max-w-full bg-white h-full shadow-2xl flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 border-b flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "font-bold text-slate-800"
  }, "Cronologia"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, chats.length, " conversazioni")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowChatHistory(false),
    className: "p-2 hover:bg-white/50 rounded-lg"
  }, /*#__PURE__*/React.createElement(X, {
    size: 20,
    className: "text-slate-500"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-y-auto"
  }, chats.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "text-center text-slate-400 py-12"
  }, /*#__PURE__*/React.createElement(MessageSquare, {
    size: 40,
    className: "mx-auto mb-3 opacity-50"
  }), /*#__PURE__*/React.createElement("p", null, "Nessuna conversazione")) : /*#__PURE__*/React.createElement("div", {
    className: "p-2 space-y-1"
  }, chats.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    onClick: () => selectChat(c.id),
    className: `p-3 rounded-xl cursor-pointer group transition-all ${c.id === activeChatId ? 'bg-amber-100 border border-amber-300' : 'hover:bg-slate-50'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-start gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: `font-medium truncate text-sm flex items-center gap-1.5 ${c.id === activeChatId ? 'text-amber-700' : 'text-slate-700'}`
  }, c.isQuizChat ? /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCDD") : /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCAC"), c.title), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-400 mt-1 ml-5"
  }, new Date(c.updatedAt).toLocaleDateString('it'), " \u2022 ", c.messages?.length || 0, " msg")), /*#__PURE__*/React.createElement("button", {
    onClick: e => deleteChat(c.id, e),
    className: "opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 rounded-lg transition"
  }, /*#__PURE__*/React.createElement(X, {
    size: 14,
    className: "text-red-500"
  }))))))), /*#__PURE__*/React.createElement("div", {
    className: "p-3 border-t bg-slate-50"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: createNewChat,
    className: "w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition"
  }, "+ Nuova Conversazione"))))), section === 'profile' && /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen",
    style: {
      background: 'transparent'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-8 pb-16 px-4 text-center text-white relative overflow-hidden",
    style: {
      background: 'linear-gradient(135deg, #b45309 0%, #f59e0b 50%, #d97706 100%)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 opacity-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute top-4 left-4 fl-float"
  }, /*#__PURE__*/React.createElement(BullMascot, {
    size: 60,
    mood: "happy"
  })), /*#__PURE__*/React.createElement("div", {
    className: "absolute bottom-4 right-4 fl-float",
    style: {
      animationDelay: '1s'
    }
  }, /*#__PURE__*/React.createElement(BullMascot, {
    size: 80,
    mood: "celebrating"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, user?.photoURL ? /*#__PURE__*/React.createElement("img", {
    src: user.photoURL,
    className: "w-24 h-24 rounded-full mx-auto mb-3 border-4 border-white/30 shadow-xl",
    alt: ""
  }) : /*#__PURE__*/React.createElement("div", {
    className: "w-24 h-24 mx-auto mb-3"
  }, (() => {
    const level = getLevelInfo(stats.xp);
    return /*#__PURE__*/React.createElement(BullMascot, {
      size: 92,
      mood: "happy"
    });
  })()), /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-bold"
  }, user?.displayName || 'Trader'), /*#__PURE__*/React.createElement("p", {
    className: "text-amber-100 text-sm"
  }, user?.email), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center gap-2 mt-2"
  }, (() => {
    const level = getLevelInfo(stats.xp);
    return /*#__PURE__*/React.createElement("span", {
      className: `inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium`
    }, level.name, " \u2022 ", stats.xp.toLocaleString(), " XP");
  })()))), /*#__PURE__*/React.createElement("div", {
    className: "max-w-xl mx-auto px-4 mt-4 relative z-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3 mb-4"
  }, [{
    icon: StarIconSVG,
    label: 'Monete',
    value: stats.coins,
    color: 'amber'
  }, {
    icon: Zap,
    label: 'XP',
    value: stats.xp,
    color: 'orange'
  }, {
    icon: Target,
    label: 'Precisione',
    value: `${stats.quizzes ? Math.round(stats.correct / stats.quizzes * 100) : 0}%`,
    color: 'emerald'
  }, {
    icon: Brain,
    label: 'Flashcards',
    value: stats.cards,
    color: 'purple'
  }].map(({
    icon: Icon,
    label,
    value,
    color
  }) => /*#__PURE__*/React.createElement("div", {
    key: label,
    className: "rounded-xl p-4 shadow-lg",
    style: {
      backgroundColor: th.card,
      borderWidth: 1,
      borderColor: th.cardBorder
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: `w-8 h-8 bg-${color}-500/20 rounded-lg flex items-center justify-center`
  }, typeof Icon === 'function' && Icon.toString().includes('svg') ? /*#__PURE__*/React.createElement(Icon, {
    size: 18
  }) : /*#__PURE__*/React.createElement(Icon, {
    size: 18,
    className: `text-${color}-400`
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      color: th.textMuted
    },
    className: "text-sm"
  }, label)), /*#__PURE__*/React.createElement("div", {
    className: "text-xl font-bold",
    style: {
      color: th.text
    }
  }, typeof value === 'number' ? value.toLocaleString() : value)))), /*#__PURE__*/React.createElement("div", {
    className: "rounded-xl p-4 shadow-lg mb-4",
    style: {
      backgroundColor: th.card,
      borderWidth: 1,
      borderColor: th.cardBorder
    }
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold mb-3 flex items-center gap-2",
    style: {
      color: th.text
    }
  }, /*#__PURE__*/React.createElement(TrendingUp, {
    size: 18,
    className: "text-amber-500"
  }), "Il tuo livello"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4"
  }, (() => {
    const level = getLevelInfo(stats.xp);
    const nextLevel = stats.xp < 500 ? {
      name: 'Trader',
      xp: 500
    } : stats.xp < 2000 ? {
      name: 'Wolf',
      xp: 2000
    } : stats.xp < 5000 ? {
      name: 'Bull',
      xp: 5000
    } : null;
    const prevXp = stats.xp < 500 ? 0 : stats.xp < 2000 ? 500 : stats.xp < 5000 ? 2000 : 5000;
    const progress = nextLevel ? (stats.xp - prevXp) / (nextLevel.xp - prevXp) * 100 : 100;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FinLearnMark, {
      size: 46
    }), /*#__PURE__*/React.createElement("div", {
      className: "flex-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between text-sm mb-1"
    }, /*#__PURE__*/React.createElement("span", {
      className: "font-medium",
      style: {
        color: th.text
      }
    }, level.name), nextLevel && /*#__PURE__*/React.createElement("span", {
      style: {
        color: th.textMuted
      }
    }, nextLevel.xp - stats.xp, " XP per ", nextLevel.name)), /*#__PURE__*/React.createElement("div", {
      className: "h-3 rounded-full overflow-hidden",
      style: {
        backgroundColor: theme === 'dark' ? '#334155' : '#e2e8f0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: `h-full bg-gradient-to-r ${level.color} rounded-full transition-all`,
      style: {
        width: `${progress}%`
      }
    }))));
  })())), /*#__PURE__*/React.createElement("div", {
    className: "rounded-xl p-4 shadow-lg mb-4",
    style: {
      backgroundColor: th.card,
      borderWidth: 1,
      borderColor: th.cardBorder
    }
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold mb-3 flex items-center gap-2",
    style: {
      color: th.text
    }
  }, /*#__PURE__*/React.createElement(BarChart3, {
    size: 18,
    className: "text-emerald-500"
  }), "Le tue statistiche"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-sm mb-1"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: th.textMuted
    }
  }, "Quiz completati"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold",
    style: {
      color: th.text
    }
  }, stats.quizzes)), /*#__PURE__*/React.createElement("div", {
    className: "h-2 rounded-full",
    style: {
      backgroundColor: theme === 'dark' ? '#334155' : '#e2e8f0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full",
    style: {
      width: `${Math.min(stats.quizzes / 50 * 100, 100)}%`
    }
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-sm mb-1"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: th.textMuted
    }
  }, "Corrette"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-emerald-500"
  }, stats.correct, "/", stats.quizzes)), /*#__PURE__*/React.createElement("div", {
    className: "h-2 rounded-full",
    style: {
      backgroundColor: theme === 'dark' ? '#334155' : '#e2e8f0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full bg-emerald-500 rounded-full",
    style: {
      width: stats.quizzes ? `${stats.correct / stats.quizzes * 100}%` : '0%'
    }
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "rounded-xl p-4 shadow-lg mb-4",
    style: {
      backgroundColor: th.card,
      borderWidth: 1,
      borderColor: th.cardBorder
    }
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold mb-3 flex items-center gap-2",
    style: {
      color: th.text
    }
  }, /*#__PURE__*/React.createElement(Sparkles, {
    size: 18,
    className: "text-purple-500"
  }), "Impostazioni"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between py-3",
    style: {
      borderBottomWidth: 1,
      borderColor: th.cardBorder
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center"
  }, /*#__PURE__*/React.createElement(Clock, {
    size: 20,
    className: "text-amber-400"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "font-medium",
    style: {
      color: th.text
    }
  }, "Timer Quiz"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs",
    style: {
      color: th.textMuted
    }
  }, "Tempo limitato per rispondere"))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTimerOn(!timerOn),
    className: `w-14 h-8 rounded-full transition-all ${timerOn ? 'bg-amber-500' : ''}`,
    style: {
      backgroundColor: timerOn ? undefined : theme === 'dark' ? '#475569' : '#cbd5e1'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: `w-6 h-6 bg-white rounded-full shadow transition-all ${timerOn ? 'translate-x-7' : 'translate-x-1'}`
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between py-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: `w-10 h-10 rounded-xl flex items-center justify-center ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-amber-500/20'}`
  }, theme === 'dark' ? /*#__PURE__*/React.createElement(Moon, {
    size: 20,
    className: "text-purple-400"
  }) : /*#__PURE__*/React.createElement(Sun, {
    size: 20,
    className: "text-amber-500"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: th.text
    },
    className: "font-medium"
  }, theme === 'dark' ? 'Tema Scuro' : 'Tema Chiaro'), /*#__PURE__*/React.createElement("p", {
    style: {
      color: th.textMuted
    },
    className: "text-xs"
  }, theme === 'dark' ? 'Risparmia batteria' : 'Più leggibile di giorno'))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1 rounded-full p-1",
    style: {
      backgroundColor: theme === 'dark' ? '#334155' : '#e2e8f0'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setTheme('dark'),
    className: `p-2 rounded-full transition-all ${theme === 'dark' ? 'bg-purple-500 text-white' : ''}`,
    style: {
      color: theme !== 'dark' ? th.textMuted : undefined
    }
  }, /*#__PURE__*/React.createElement(Moon, {
    size: 16
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTheme('light'),
    className: `p-2 rounded-full transition-all ${theme === 'light' ? 'bg-amber-500 text-white' : ''}`,
    style: {
      color: theme !== 'light' ? th.textMuted : undefined
    }
  }, /*#__PURE__*/React.createElement(Sun, {
    size: 16
  }))))), /*#__PURE__*/React.createElement("button", {
    onClick: onLogout,
    className: "w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold shadow-lg transition mb-4",
    style: {
      backgroundColor: th.card,
      color: th.textMuted,
      borderWidth: 1,
      borderColor: th.cardBorder
    }
  }, /*#__PURE__*/React.createElement(LogOut, {
    size: 20
  }), "Esci dall'account"))), /*#__PURE__*/React.createElement("div", {
    className: "fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-2 pointer-events-none"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-xl mx-auto fl-glass rounded-2xl px-2 py-2 flex justify-around pointer-events-auto shadow-2xl",
    style: {
      boxShadow: '0 16px 40px -16px rgba(0,0,0,.7)'
    }
  }, [{
    id: 'home',
    icon: Home,
    label: 'Home'
  }, {
    id: 'library',
    icon: BookOpen,
    label: 'Studia'
  }, {
    id: 'ai',
    icon: MessageSquare,
    label: 'AI Coach'
  }, {
    id: 'profile',
    icon: User,
    label: 'Profilo'
  }].map(({
    id,
    icon: Icon,
    label
  }) => {
    const isActive = section === id;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: () => setSection(id),
      className: "relative flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all",
      style: {
        color: isActive ? '#f5d061' : th.textMuted
      }
    }, isActive && /*#__PURE__*/React.createElement("span", {
      className: "absolute inset-0 rounded-xl",
      style: {
        background: 'rgba(232,185,49,0.12)',
        boxShadow: 'inset 0 0 0 1px rgba(232,185,49,.25)'
      }
    }), /*#__PURE__*/React.createElement(Icon, {
      size: 21,
      className: "relative",
      strokeWidth: isActive ? 2.5 : 2
    }), /*#__PURE__*/React.createElement("span", {
      className: `relative text-[10px] tracking-wide ${isActive ? 'font-bold' : 'font-medium'}`
    }, label));
  }))), showCalc && /*#__PURE__*/React.createElement(TICalculator, {
    onClose: () => setShowCalc(false)
  }), showProModal && /*#__PURE__*/React.createElement(ProModal, {
    onClose: () => setShowProModal(false),
    onUpgrade: () => {
      setIsPro(true);
      setShowProModal(false);
      // In produzione qui andresti a Stripe/payment
      alert('🎉 Congratulazioni! Sei ora un utente PRO!\n\n(In produzione, qui ci sarebbe il pagamento con Stripe)');
    }
  }), showMockExamSetup && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-black/60 backdrop-blur-sm",
    onClick: () => !mockExamState.loading && setShowMockExamSetup(false)
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative w-full max-w-lg mx-4 mb-4 sm:mb-0 rounded-3xl overflow-hidden shadow-2xl",
    style: {
      backgroundColor: th.card
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement(BullMascot, {
    size: 48,
    mood: "happy"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-black"
  }, "AI Mock Exam"), /*#__PURE__*/React.createElement("p", {
    className: "text-white/80 text-sm"
  }, "Configura il tuo esame personalizzato"))), /*#__PURE__*/React.createElement("button", {
    onClick: () => !mockExamState.loading && setShowMockExamSetup(false),
    className: "p-2 hover:bg-white/20 rounded-full transition"
  }, /*#__PURE__*/React.createElement(X, {
    size: 24
  })))), /*#__PURE__*/React.createElement("div", {
    className: "p-6 max-h-[60vh] overflow-y-auto"
  }, mockExamState.error && /*#__PURE__*/React.createElement("div", {
    className: "mb-4 p-4 bg-rose-100 border border-rose-300 rounded-xl text-rose-700 text-sm"
  }, "\u26A0\uFE0F ", mockExamState.error), /*#__PURE__*/React.createElement("div", {
    className: "mb-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-bold mb-2",
    style: {
      color: th.text
    }
  }, "\uD83D\uDCDD Numero Domande"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-4 gap-2"
  }, [5, 10, 20, 30].map(num => /*#__PURE__*/React.createElement("button", {
    key: num,
    onClick: () => setMockExamConfig(c => ({
      ...c,
      numQuestions: num
    })),
    className: `py-3 rounded-xl font-bold transition ${mockExamConfig.numQuestions === num ? 'bg-amber-500 text-white' : ''}`,
    style: mockExamConfig.numQuestions !== num ? {
      backgroundColor: theme === 'dark' ? '#334155' : '#f1f5f9',
      color: th.text
    } : {}
  }, num)))), /*#__PURE__*/React.createElement("div", {
    className: "mb-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-bold mb-2",
    style: {
      color: th.text
    }
  }, "\u23F1\uFE0F Tempo Limite"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-4 gap-2"
  }, [{
    min: 10,
    label: '10 min'
  }, {
    min: 15,
    label: '15 min'
  }, {
    min: 30,
    label: '30 min'
  }, {
    min: 60,
    label: '1 ora'
  }].map(t => /*#__PURE__*/React.createElement("button", {
    key: t.min,
    onClick: () => setMockExamConfig(c => ({
      ...c,
      timeLimit: t.min
    })),
    className: `py-3 rounded-xl font-bold text-sm transition ${mockExamConfig.timeLimit === t.min ? 'bg-amber-500 text-white' : ''}`,
    style: mockExamConfig.timeLimit !== t.min ? {
      backgroundColor: theme === 'dark' ? '#334155' : '#f1f5f9',
      color: th.text
    } : {}
  }, t.label)))), /*#__PURE__*/React.createElement("div", {
    className: "mb-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-bold mb-2",
    style: {
      color: th.text
    }
  }, "\uD83D\uDCAA Difficolt\xE0"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-2"
  }, [{
    level: 1,
    label: 'Facile',
    emoji: '🌱'
  }, {
    level: 2,
    label: 'Medio',
    emoji: '🔥'
  }, {
    level: 3,
    label: 'Difficile',
    emoji: '💀'
  }].map(d => /*#__PURE__*/React.createElement("button", {
    key: d.level,
    onClick: () => setMockExamConfig(c => ({
      ...c,
      difficulty: d.level
    })),
    className: `py-3 rounded-xl font-bold text-sm transition ${mockExamConfig.difficulty === d.level ? 'bg-amber-500 text-white' : ''}`,
    style: mockExamConfig.difficulty !== d.level ? {
      backgroundColor: theme === 'dark' ? '#334155' : '#f1f5f9',
      color: th.text
    } : {}
  }, d.emoji, " ", d.label)))), /*#__PURE__*/React.createElement("div", {
    className: "mb-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-bold mb-2",
    style: {
      color: th.text
    }
  }, "\uD83D\uDCDA Topics (min 1)"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2 max-h-48 overflow-y-auto"
  }, CFA_TOPICS.map(topic => {
    const isSelected = mockExamConfig.selectedTopics.some(t => t.id === topic.id);
    return /*#__PURE__*/React.createElement("button", {
      key: topic.id,
      onClick: () => {
        setMockExamConfig(c => ({
          ...c,
          selectedTopics: isSelected ? c.selectedTopics.filter(t => t.id !== topic.id) : [...c.selectedTopics, topic]
        }));
      },
      className: `p-3 rounded-xl text-left transition text-sm ${isSelected ? 'bg-amber-500 text-white' : ''}`,
      style: !isSelected ? {
        backgroundColor: theme === 'dark' ? '#334155' : '#f1f5f9',
        color: th.text
      } : {}
    }, /*#__PURE__*/React.createElement("span", {
      className: "mr-2"
    }, topic.icon), topic.name.split(' ')[0]);
  })), /*#__PURE__*/React.createElement("p", {
    className: "text-xs mt-2",
    style: {
      color: th.textMuted
    }
  }, mockExamConfig.selectedTopics.length, " topic selezionati")), /*#__PURE__*/React.createElement("div", {
    className: "rounded-xl p-4 mb-6",
    style: {
      backgroundColor: theme === 'dark' ? 'rgba(251,191,36,0.1)' : '#fffbeb'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-bold text-amber-700 mb-2"
  }, "\uD83D\uDCCB Riepilogo"), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-amber-600 space-y-1"
  }, /*#__PURE__*/React.createElement("p", null, "\u2022 ", mockExamConfig.numQuestions, " domande generate da AI"), /*#__PURE__*/React.createElement("p", null, "\u2022 Tempo: ", mockExamConfig.timeLimit, " minuti"), /*#__PURE__*/React.createElement("p", null, "\u2022 Difficolt\xE0: ", mockExamConfig.difficulty === 1 ? 'Facile' : mockExamConfig.difficulty === 2 ? 'Media' : 'Difficile'), /*#__PURE__*/React.createElement("p", null, "\u2022 Topics: ", mockExamConfig.selectedTopics.map(t => t.name.split(' ')[0]).join(', '))))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 border-t",
    style: {
      borderColor: th.cardBorder
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (mockExamConfig.selectedTopics.length === 0) {
        alert('Seleziona almeno un topic!');
        return;
      }
      startMockExam({
        numQuestions: mockExamConfig.numQuestions,
        timeLimit: mockExamConfig.timeLimit,
        selectedTopics: mockExamConfig.selectedTopics,
        difficulty: mockExamConfig.difficulty
      });
      setShowMockExamSetup(false);
    },
    disabled: mockExamConfig.selectedTopics.length === 0,
    className: "w-full py-4 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white disabled:opacity-50 flex items-center justify-center gap-2"
  }, /*#__PURE__*/React.createElement(Play, {
    size: 20
  }), "INIZIA MOCK EXAM"))))));
}

// ========== ROOT APP WITH AUTH ==========
export default function FinLearn() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Splash screen - show once per session
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('finlearn_splash_shown')) return false;
    if (typeof window !== 'undefined') sessionStorage.setItem('finlearn_splash_shown', 'true');
    return true;
  });
  useEffect(() => {
    const unsubscribe = mockAuth.onAuthStateChanged(async firebaseUser => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const data = mockDb.getData(firebaseUser.uid);
        if (data) {
          setUserData(data);
        } else {
          const newData = {
            stats: {
              xp: 0,
              coins: 0,
              level: 1,
              streak: 0,
              quizzes: 0,
              correct: 0,
              cards: 0
            },
            completedLessons: [],
            activeLesson: 1,
            settings: {
              timerEnabled: false
            }
          };
          mockDb.setData(firebaseUser.uid, newData);
          setUserData(newData);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  const handleAuth = (firebaseUser, data) => {
    setUser(firebaseUser);
    setUserData(data);
  };
  const handleLogout = async () => {
    await mockAuth.signOut();
    setUser(null);
    setUserData(null);
  };
  const handleSaveProgress = data => {
    if (user) {
      mockDb.setData(user.uid, data);
    }
  };

  // Show splash first
  if (showSplash) return /*#__PURE__*/React.createElement(SplashScreen, {
    onComplete: () => setShowSplash(false)
  });
  if (loading) return /*#__PURE__*/React.createElement(LoadingScreen, null);
  if (!user) return /*#__PURE__*/React.createElement(AuthScreen, {
    onAuth: handleAuth
  });
  return /*#__PURE__*/React.createElement(MainApp, {
    user: user,
    userData: userData,
    onLogout: handleLogout,
    onSaveProgress: handleSaveProgress
  });
}
import { createRoot } from 'react-dom/client';
createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(FinLearn));