// Correzioni a mano per la versione inglese: dove la frase inglese ha un altro ordine delle parole, dove il testo è fatto di pezzi
// incollati dal codice, o dove il codice stesso cambia (per esempio il dollaro al posto dell'euro). Ogni voce è [vecchio, nuovo, n]:
// il testo "vecchio" deve comparire esattamente n volte (di solito 1) in ordine.js, altrimenti compila.mjs si ferma e lo dice.
// Il codice italiano non si tocca mai: queste correzioni valgono solo per ordine_en.js.
export default [
  // ============================ p00_base: la lingua del pacchetto ============================
  ["const LANG = 'it';", "const LANG = 'en';"],
  // ============================ p90_app: la chat dell'AI Coach aperta da una domanda ============================
  ['(lo studente ha già risposto ${picked}; la risposta corretta è ${right}: puoi spiegarla apertamente)', '(the student has already answered ${picked}; the correct answer is ${right}: you can explain it openly)'],
  ['`Domanda: "${plain}"\\n\\nHai risposto ${picked}, la giusta è ${right}. Cosa vuoi capire? Posso spiegarti il perché, rifare i conti o darti un trucco per ricordarla.`',
   '`Question: "${plain}"\\n\\nYou answered ${picked}; the right answer is ${right}. What would you like to understand? I can explain why, redo the math, or give you a trick to remember it.`'],
  ['`Stai lavorando su:\\n\\n"${plain}"\\n\\nCome posso aiutarti?`', '`You\'re working on:\\n\\n"${plain}"\\n\\nHow can I help?`'],
  // ============================ p60_start: apertura e primo giorno ============================
  ["const NUM_IT = ['', 'una', 'due', 'tre', 'quattro', 'cinque'];", "const NUM_IT = ['', 'one', 'two', 'three', 'four', 'five'];"],
  // ============================ p10_data: percorsi, dati, punteggi ============================
  [/  learn: \['Come lavorano interessi, inflazione e tempo'[^\n]*/, "  learn: ['How interest, inflation and time work', 'How to keep income, spending and savings in order', 'What loans and mortgages cost, and the math to do before buying a home', 'How to protect yourself from the unexpected', 'What stocks, funds and ETFs are, and how to invest a little at a time', 'What mistakes our brain makes when investing', 'How to read a company\\'s financial statements, and how the economy works'],"],
  ["const RIVALS = ['Giulia', 'Luca', 'Marco', 'Sara', 'Paolo', 'Elena', 'Davide', 'Chiara', 'Matteo'];", "const RIVALS = ['Emma', 'Liam', 'Noah', 'Olivia', 'Ethan', 'Mia', 'Lucas', 'Ava', 'Mason'];"],
  // ============================ p50_more: la posizione in lega (in italiano 3°, in inglese #3) ============================
  ["const ord = n => `${n}°`;", "const ord = n => `#${n}`;", 1],
  // la barra in basso: «Challenges» è più lunga di «Sfide», quindi in inglese ogni scheda è larga quanto la sua scritta (su 320 px altrimenti si taglia)
  ['.o-tab{flex:1 1 0;min-width:0;', '.o-tab{flex:1 1 auto;min-width:0;padding:0 3px;', 1],
  // il punteggio di una sfida: «3 a 2» diventa «3 to 2» (frase troppo corta per il dizionario)
  ['${a} a ${b}</span>', '${a} to ${b}</span>', 1],
  // sfida dal vivo: «Tu e Anna» sotto la risposta scelta da tutti e due
  ["k === opC ? opName : null].filter(Boolean).join(' e ') || null", "k === opC ? opName : null].filter(Boolean).join(' and ') || null", 1],
  ['${livePts(f.punti[io] || 0)} a ${livePts(f.punti[op] || 0)}</span>', '${livePts(f.punti[io] || 0)} to ${livePts(f.punti[op] || 0)}</span>', 1],
  // ============================ Pro: il piè di pagina ha un pezzo italiano dentro un buco del template ============================
  ["PRO_YEAR + ' l\\'anno'", "PRO_YEAR + ' a year'", 1],
  // ============================ p00_base: il plurale dei nomi (il codice passa le parole italiane, qui diventano inglesi) ============================
  ["const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;", "const EN_PL = { lezione: 'lesson', lezioni: 'lessons' };   // le altre parole di plural() le traduce il dizionario\nconst plural = (n, one, many) => { const w = n === 1 ? one : many; return `${n} ${EN_PL[w] || w}`; };"],
  // ============================ p30_learn: Impara, percorso, lezione, domande ============================
  ["rest.length === 1 ? 'Un\\'altra unità' : 'Altre ' + rest.length + ' unità'", "rest.length === 1 ? 'One more unit' : rest.length + ' more units'"],
  ["1.000 € al 5% l'anno", "${CUR}1,000 at 5% a year"],
  ["`Dopo ${n} anni 1.000 euro diventano ${eur(tot)}`", "`After ${n} years ${CUR}1,000 becomes ${eur(tot)}`"],
  ['`Domanda: "${plain}"\\n\\nHai risposto ${picked}, la giusta è ${right}. Cosa vuoi capire?`', '`Question: "${plain}"\\n\\nYou answered ${picked}; the right answer is ${right}. What would you like to understand?`'],
  ['`Stai lavorando su:\\n\\n"${plain}"\\n\\nTi guido io, senza dirti subito la risposta. Da dove partiamo?`', '`You\'re working on:\\n\\n"${plain}"\\n\\nI\'ll guide you without giving away the answer. Where shall we start?`'],
  // ============================ p35_steps: passi interattivi delle lezioni ============================
  ["`La risposta è **${withUnit(st.ans, st.unit, ansDec)}**.\\n\\n${st.exp || ''}`", "`The answer is **${withUnit(st.ans, st.unit, ansDec)}**.\\n\\n${st.exp || ''}`"],
  // ============================ p40_train: Allenati, test e verifiche ============================
  ["plural(n - answered, 'risposta', 'risposte')", "plural(n - answered, 'answer', 'answers')"],
  ["weak.n - weak.nok === 1 ? 'risposta' : 'risposte'", "weak.n - weak.nok === 1 ? 'answer' : 'answers'"],
  // la figurina letta da chi usa lo screen reader: lo stato interno è in italiano (manca, viva, sbiadisce, dorata)
  ['aria-label=${`${l.title}: ${state}`}', "aria-label=${`${l.title}: ${({ manca: 'missing', viva: 'alive', sbiadisce: 'fading', dorata: 'golden' })[state] || state}`}"],
  // ============================ p50_more: AI Coach, profilo, album, impostazioni, Pro, catalogo ============================
  // il file dei dati scaricati ha il nome in inglese
  ['const name = `finlearn-dati-${dayKey()}.json`', 'const name = `finlearn-data-${dayKey()}.json`', 1],
  ["const PRO_YEAR = '34,99 €', PRO_MONTH = '5,99 €';", "const PRO_YEAR = CUR + '34.99', PRO_MONTH = CUR + '5.99';"],
  ["'2,92 € al mese'", "CUR + '2.92 a month'"],
  ["const leg = [[AZ, 'solid', 'Viva'], [T_GR, 'solid', 'Sbiadisce'], [GIALLO, 'solid', 'Dorata'], ['transparent', 'dashed', 'Manca']];", "const leg = [[AZ, 'solid', 'Alive'], [T_GR, 'solid', 'Fading'], [GIALLO, 'solid', 'Golden'], ['transparent', 'dashed', 'Missing']];"],
  ["nk === 1 ? 'nota un\\'unità' : 'note ' + (NUM_IT[nk] || nk) + ' unità'", "nk === 1 ? 'one unit' : (NUM_IT[nk] || nk) + ' units'"],
  ["${d} ${d === 1 ? 'lezione fatta' : 'lezioni fatte'} su ${ls.length}", "${d} of ${ls.length} lessons done"],
  ["[[c.lessons.length, 'lezioni'], [c.units.length, c.group === 'cert' ? 'argomenti' : 'unità'], [mins < 90 ? mins + ' min' : Math.round(mins / 60) + ' ore', 'in tutto']]", "[[c.lessons.length, 'lessons'], [c.units.length, c.group === 'cert' ? 'topics' : 'units'], [mins < 90 ? mins + ' min' : Math.round(mins / 60) + ' hours', 'in total']]"],
];
