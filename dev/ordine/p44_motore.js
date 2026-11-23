// =====================================================================================================
// MOTORE DELLE DOMANDE GENERATE: stampi di calcolo e tabelle di fatti
// =====================================================================================================
// Codice puro: niente schermo, niente memoria del telefono, niente rete. Non usa niente del resto dell'app,
// così lo stesso file può servire anche all'arbitro delle sfide (sfide/).
// Una domanda nasce in due tempi:
//   1. GEN.crea(tipo, seme)            → il "nucleo": numeri, risposte e posizione della giusta. Niente parole: è uguale in tutte le lingue.
//   2. GEN.testo(nucleo, lingua, valuta) → domanda, risposte e spiegazione scritte in quella lingua.
// Lo stesso tipo con lo stesso seme dà sempre lo stesso nucleo: due telefoni (o un telefono e l'arbitro) vedono la stessa domanda.
// Regole dei contenuti:
//   - la risposta giusta di uno stampo la calcola `ok`; le sbagliate nascono dagli errori tipici (`err`), ognuno con la sua spiegazione;
//   - ogni stampo e ogni fatto è scritto in tutte le lingue attive (it, en): senza una lingua non entra nel gioco;
//   - uno stampo con `lab` appartiene al laboratorio di un capitolo (p45_serie.js, LabRun): la Serie non lo pesca;
//   - i fatti hanno la fonte in dev/ordine/FONTI_GIOCHI.md; niente fatti che scadono (cariche, tassi del momento) o contestati.
// Il collaudo (dev/giochi/collauda.mjs) genera migliaia di domande per tipo e rifà i conti con un secondo programma scritto a parte.
const GEN = (() => {
  const V = 1;   // cambia quando cambia il modo di generare: due telefoni con V diversa non darebbero lo stesso nucleo dallo stesso seme

  // ---- il caso: stessa sequenza dallo stesso seme (mulberry32) ----
  function caso(seme) {
    let a = seme >>> 0;
    return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const scegli = (R, a) => a[Math.floor(R() * a.length)];
  const mescola = (R, lista) => { const a = lista.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  // arrotonda a d decimali, con il 5 che va lontano dallo zero (2,5 → 3; −2,5 → −3)
  const giro = (x, d = 0) => { const m = Math.pow(10, d); return Math.round(x * m + (x >= 0 ? 1e-7 : -1e-7)) / m || 0; };
  const intero = x => Math.abs(x - Math.round(x)) < 1e-9;

  // ---- come si scrive il valore di una risposta ----
  // d: decimali; rel e abs: distanza minima tra due risposte (in rapporto alla giusta e in assoluto); segno: si scrive anche il +
  const FORMA = {
    soldi: { d: 0, rel: 0.03, abs: 5 },
    pct: { d: 1, rel: 0.08, abs: 0.5 },
    pct2: { d: 2, rel: 0.04, abs: 0.15 },
    seg: { d: 1, rel: 0.08, abs: 0.5, segno: true },
    seg2: { d: 2, rel: 0.08, abs: 0.4, segno: true },
    anni: { d: 0, rel: 0.2, abs: 2 },
    mln: { d: 0, rel: 0.05, abs: 5 },       // milioni: 240 milioni
    volte: { d: 1, rel: 0.08, abs: 0.4 },   // multipli: 16 · 12,5
    euro2: { d: 2, rel: 0.05, abs: 0.05 },  // valuta con i centesimi: 0,75 €
    euro2f: { d: 2, rel: 0.015, abs: 0.05 } // lo stesso, quando due risposte vicine nascono da due formule diverse (26 € e 25 €)
  };

  // ---- la penna: numeri, soldi e percentuali scritti come vuole la lingua ----
  const NB = '\u00A0';
  function penna(lang, cur) {
    const en = lang === 'en', G = en ? ',' : '.', D = en ? '.' : ',', sim = cur || '€';
    // n(2000) → 2.000 · n(3.5, 1) → 3,5 · n(4, 1) → 4 (gli zeri in fondo si tolgono, se non è `fisso`)
    const n = (x, d = 0, fisso) => {
      let s = Math.abs(x).toFixed(d); if (d && !fisso) s = s.replace(/\.?0+$/, '');
      const k = s.indexOf('.'), i = (k < 0 ? s : s.slice(0, k)).replace(/\B(?=(\d{3})+(?!\d))/g, G), f = k < 0 ? '' : s.slice(k + 1);
      return (x < 0 ? '−' : '') + i + (f ? D + f : '');
    };
    const soldi = x => { const t = intero(x) ? n(x) : n(x, 2, true); return en ? sim + t : t + NB + sim; };
    const pct = (x, d = 1) => n(x, d) + '%';
    const seg = (x, d = 1) => (giro(x, d) > 0 ? '+' : '') + n(x, d) + '%';
    // in italiano l'articolo cambia davanti a 1, 8, 11, 80-89: l'8%, all'8%, dell'8%
    const voc = x => { const k = Math.floor(Math.abs(x)); return k === 1 || k === 8 || k === 11 || (k >= 80 && k <= 89) || (k >= 800 && k <= 899); };
    const ilp = (x, d = 1) => (voc(x) ? "l'" : 'il ') + pct(x, d), alp = (x, d = 1) => (voc(x) ? "all'" : 'al ') + pct(x, d), delp = (x, d = 1) => (voc(x) ? "dell'" : 'del ') + pct(x, d);
    const anni = x => en ? `${n(x)} ${x === 1 ? 'year' : 'years'}` : `${n(x)} ${x === 1 ? 'anno' : 'anni'}`;
    // dentro una formula: la virgola va tra graffe, il % con la barra, il meno è quello semplice
    const f = s => String(s).replace(/−/g, '-').replace(/,/g, '{,}').replace(/%/g, '\\%');
    const fn = (x, d = 0, fisso) => f(n(x, d, fisso));
    const fs = x => intero(x) ? fn(x) : fn(x, 2, true);   // una cifra in valuta dentro una formula: 20 oppure 0,20
    const valore = (forma, x) => forma === 'soldi' || forma === 'euro2' || forma === 'euro2f' ? soldi(x) : forma === 'mln' ? n(x) + (en ? ' million' : ' milioni') : forma === 'volte' ? n(x, 1) : forma === 'anni' ? (en ? 'About ' : 'Circa ') + anni(x) : forma === 'seg' || forma === 'seg2' ? seg(x, FORMA[forma].d) : pct(x, FORMA[forma].d);
    return { en, n, soldi, pct, ilp, alp, delp, seg, anni, f, fn, fs, valore };
  }

  // =====================================================================================================
  // STAMPI DI CALCOLO
  // =====================================================================================================
  // par(R): sceglie i numeri (null = combinazione da scartare) · ok(p): la risposta giusta · err: gli errori tipici
  // it / en: q(p, W) la domanda, exp(p, W, ok) la spiegazione con la formula prima a lettere e poi a numeri, err: una riga per ogni errore tipico
  const cap = (r, n) => Math.pow(1 + r / 100, n);
  const STAMPI = {
    semplice: {
      liv: 1, tema: 'tempo', forma: 'soldi',
      par: R => ({ C: scegli(R, [500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 8000, 10000]), r: scegli(R, [2, 3, 4, 5, 6, 8]), n: scegli(R, [2, 3, 4, 5, 6, 8, 10]) }),
      ok: p => p.C * p.r / 100 * p.n,
      err: { montante: p => p.C + p.C * p.r / 100 * p.n, unanno: p => p.C * p.r / 100, composto: p => p.C * (cap(p.r, p.n) - 1) },
      it: {
        q: (p, W) => `Presti ${W.soldi(p.C)} a un amico per ${W.anni(p.n)}, ${W.alp(p.r)} l'anno. Gli interessi si calcolano ogni anno solo sulla cifra prestata (interesse semplice). Quanti interessi incassi in tutto?`,
        exp: (p, W, ok) => `Con l'**interesse semplice** ogni anno incassi la stessa cifra, calcolata sempre sul capitale di partenza.\n\n$$I = C \\times r \\times n$$\n\n\\(C\\) = capitale prestato, \\(r\\) = tasso annuo, \\(n\\) = anni, \\(I\\) = interessi in tutto.\n\n$$I = ${W.fn(p.C)} \\times ${W.fn(p.r / 100, 2, true)} \\times ${p.n} = ${W.fn(ok)}$$\n\nIn tutto incassi **${W.soldi(ok)}** di interessi.`,
        err: { montante: 'Hai sommato anche il capitale: la domanda chiede solo gli interessi.', unanno: 'Questi sono gli interessi di un solo anno: vanno moltiplicati per gli anni.', composto: 'Hai fatto rendere anche gli interessi (interesse composto): qui si calcolano solo sulla cifra prestata.' }
      },
      en: {
        q: (p, W) => `You lend a friend ${W.soldi(p.C)} for ${W.anni(p.n)} at ${W.pct(p.r)} a year. Interest is figured each year only on the amount you lent (simple interest). How much interest do you earn in total?`,
        exp: (p, W, ok) => `With **simple interest** you earn the same amount every year, always figured on the starting principal.\n\n$$I = C \\times r \\times n$$\n\n\\(C\\) = principal you lent, \\(r\\) = annual rate, \\(n\\) = years, \\(I\\) = total interest.\n\n$$I = ${W.fn(p.C)} \\times ${W.fn(p.r / 100, 2, true)} \\times ${p.n} = ${W.fn(ok)}$$\n\nIn total you earn **${W.soldi(ok)}** in interest.`,
        err: { montante: 'You added the principal too: the question asks only for the interest.', unanno: 'This is the interest for one year only: multiply it by the number of years.', composto: 'You let the interest earn interest too (compound interest): here it is figured only on the amount you lent.' }
      }
    },
    composto: {
      liv: 2, tema: 'tempo', forma: 'soldi',
      par: R => ({ C: scegli(R, [500, 1000, 1500, 2000, 3000, 4000, 5000, 8000, 10000, 20000]), r: scegli(R, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12]), n: scegli(R, [2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30]) }),
      ok: p => p.C * cap(p.r, p.n),
      err: { semplice: p => p.C * (1 + p.r / 100 * p.n), soloint: p => p.C * (cap(p.r, p.n) - 1), meno1: p => p.C * cap(p.r, p.n - 1) },
      it: {
        q: (p, W) => `Metti ${W.soldi(p.C)} in un investimento che rende ${W.ilp(p.r)} l'anno. Ogni anno gli interessi restano investiti e rendono anche loro. Quanto hai dopo ${W.anni(p.n)}?`,
        exp: (p, W, ok) => `Gli interessi di ogni anno si aggiungono al capitale e l'anno dopo rendono anche loro: è l'**interesse composto**.\n\n$$M = C \\times (1 + r)^n$$\n\n\\(C\\) = capitale di partenza, \\(r\\) = tasso annuo, \\(n\\) = anni, \\(M\\) = quanto hai alla fine.\n\n$$M = ${W.fn(p.C)} \\times ${W.fn(1 + p.r / 100, 2, true)}^{${p.n}} = ${W.fn(ok)}$$\n\nAlla fine hai **${W.soldi(ok)}** (cifra arrotondata).`,
        err: { semplice: 'Hai calcolato gli interessi sempre sul capitale di partenza (interesse semplice): mancano gli interessi sugli interessi.', soloint: 'Questi sono solo gli interessi: la domanda chiede quanto hai in tutto, capitale compreso.', meno1: 'Hai contato un anno in meno.' }
      },
      en: {
        q: (p, W) => `You put ${W.soldi(p.C)} into an investment that returns ${W.pct(p.r)} a year. Each year the interest stays invested and earns interest too. How much do you have after ${W.anni(p.n)}?`,
        exp: (p, W, ok) => `Each year's interest is added to the principal, and the next year it earns interest too: this is **compound interest**.\n\n$$M = C \\times (1 + r)^n$$\n\n\\(C\\) = starting principal, \\(r\\) = annual rate, \\(n\\) = years, \\(M\\) = what you have at the end.\n\n$$M = ${W.fn(p.C)} \\times ${W.fn(1 + p.r / 100, 2, true)}^{${p.n}} = ${W.fn(ok)}$$\n\nAt the end you have **${W.soldi(ok)}** (rounded).`,
        err: { semplice: 'You figured the interest only on the starting principal (simple interest): the interest on the interest is missing.', soloint: 'This is only the interest: the question asks how much you have in total, principal included.', meno1: 'You counted one year too few.' }
      }
    },
    attuale: {
      liv: 3, tema: 'tempo', forma: 'soldi',
      par: R => ({ F: scegli(R, [500, 1000, 2000, 3000, 5000, 8000, 10000, 15000, 20000, 50000, 100000]), r: scegli(R, [2, 3, 4, 5, 6, 7, 8, 10]), n: scegli(R, [2, 3, 4, 5, 8, 10, 15, 20, 25, 30]) }),
      ok: p => p.F / cap(p.r, p.n),
      err: { capitalizza: p => p.F * cap(p.r, p.n), lineare: p => p.F / (1 + p.r / 100 * p.n), sottrae: p => p.F * (1 - p.r / 100 * p.n) },
      it: {
        q: (p, W) => `Tra ${W.anni(p.n)} ti servono ${W.soldi(p.F)}. Hai un investimento che rende ${W.ilp(p.r)} l'anno, con gli interessi che restano investiti. Quanto devi metterci oggi per arrivare a quella cifra?`,
        exp: (p, W, ok) => `È il conto dell'interesse composto fatto al contrario: si parte dalla cifra futura e si torna a oggi. La cifra di oggi si chiama **valore attuale**.\n\n$$VA = \\frac{F}{(1 + r)^n}$$\n\n\\(F\\) = cifra che ti serve in futuro, \\(r\\) = tasso annuo, \\(n\\) = anni, \\(VA\\) = quanto devi mettere oggi.\n\n$$VA = \\frac{${W.fn(p.F)}}{${W.fn(1 + p.r / 100, 2, true)}^{${p.n}}} = ${W.fn(ok)}$$\n\nOggi devi mettere **${W.soldi(ok)}** (cifra arrotondata).`,
        err: { capitalizza: 'Hai moltiplicato invece di dividere: così trovi quanto diventerebbe quella cifra in futuro, non quanto serve oggi.', lineare: 'Hai tolto gli interessi come se fossero semplici: qui gli interessi restano investiti e rendono anche loro.', sottrae: 'Hai tolto il tasso moltiplicato per gli anni dalla cifra finale: gli interessi si calcolano sulla cifra di oggi, non su quella futura.' }
      },
      en: {
        q: (p, W) => `In ${W.anni(p.n)} you will need ${W.soldi(p.F)}. You have an investment that returns ${W.pct(p.r)} a year, with the interest staying invested. How much do you have to put in today to reach that amount?`,
        exp: (p, W, ok) => `This is the compound interest calculation done backward: you start from the future amount and come back to today. Today's amount is called the **present value**.\n\n$$PV = \\frac{F}{(1 + r)^n}$$\n\n\\(F\\) = amount you need in the future, \\(r\\) = annual rate, \\(n\\) = years, \\(PV\\) = how much you have to put in today.\n\n$$PV = \\frac{${W.fn(p.F)}}{${W.fn(1 + p.r / 100, 2, true)}^{${p.n}}} = ${W.fn(ok)}$$\n\nToday you have to put in **${W.soldi(ok)}** (rounded).`,
        err: { capitalizza: 'You multiplied instead of dividing: that gives what the amount would grow to in the future, not what you need today.', lineare: 'You removed the interest as if it were simple: here the interest stays invested and earns interest too.', sottrae: 'You subtracted the rate times the years from the final amount: interest is figured on today’s amount, not on the future one.' }
      }
    },
    reale: {
      liv: 2, tema: 'tempo', forma: 'seg',
      par: R => { const i = scegli(R, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12]), f = scegli(R, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12]); return i === f ? null : { i, f }; },
      ok: p => ((1 + p.i / 100) / (1 + p.f / 100) - 1) * 100,
      err: { somma: p => p.i + p.f, ignora: p => p.i, rovescia: p => ((1 + p.f / 100) / (1 + p.i / 100) - 1) * 100 },
      it: {
        q: (p, W) => `In un anno i tuoi risparmi rendono ${W.ilp(p.i)}. Nello stesso anno i prezzi salgono ${W.delp(p.f)}. Di quanto è cambiato davvero quello che puoi comprare con quei soldi?`,
        exp: (p, W, ok) => `Quello che conta è il **rendimento reale**: quanto resta del rendimento dopo aver tolto l'aumento dei prezzi.\n\n$$r_{\\text{reale}} = \\frac{1 + i}{1 + \\pi} - 1$$\n\n\\(i\\) = rendimento dei risparmi, \\(\\pi\\) = aumento dei prezzi (inflazione).\n\n$$r_{\\text{reale}} = \\frac{${W.fn(1 + p.i / 100, 2, true)}}{${W.fn(1 + p.f / 100, 2, true)}} - 1 = ${W.f(W.seg(ok))}$$\n\nA mente basta la differenza: \\(${W.f(W.pct(p.i))} - ${W.f(W.pct(p.f))} = ${W.f(W.seg(p.i - p.f))}\\), che è quasi lo stesso numero.`,
        err: { somma: 'Hai sommato l\'aumento dei prezzi: l\'inflazione si toglie dal rendimento, non si aggiunge.', ignora: 'Hai guardato solo il rendimento: se intanto i prezzi salgono, con quei soldi compri meno.', rovescia: 'Il segno è al contrario: si parte dal rendimento e si toglie l\'aumento dei prezzi.' }
      },
      en: {
        q: (p, W) => `In one year your savings earn ${W.pct(p.i)}. In the same year prices rise ${W.pct(p.f)}. By how much has what you can buy with that money really changed?`,
        exp: (p, W, ok) => `What matters is the **real return**: what is left of the return after taking out the rise in prices.\n\n$$r_{\\text{real}} = \\frac{1 + i}{1 + \\pi} - 1$$\n\n\\(i\\) = return on your savings, \\(\\pi\\) = rise in prices (inflation).\n\n$$r_{\\text{real}} = \\frac{${W.fn(1 + p.i / 100, 2, true)}}{${W.fn(1 + p.f / 100, 2, true)}} - 1 = ${W.f(W.seg(ok))}$$\n\nIn your head, the difference is enough: \\(${W.f(W.pct(p.i))} - ${W.f(W.pct(p.f))} = ${W.f(W.seg(p.i - p.f))}\\), which is almost the same number.`,
        err: { somma: 'You added the rise in prices: inflation is taken out of the return, not added to it.', ignora: 'You looked only at the return: if prices rise in the meantime, that money buys less.', rovescia: 'The sign is reversed: you start from the return and take out the rise in prices.' }
      }
    },
    variazione: {
      liv: 1, tema: 'azioni', forma: 'seg',
      par: R => { const A = scegli(R, [10, 16, 20, 25, 30, 40, 50, 60, 75, 80, 125, 150, 200, 250, 300, 400, 500, 1000]), v = scegli(R, [-75, -60, -50, -40, -30, -25, -20, -10, -5, 5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 80, 150, 200]), B = A * (1 + v / 100); return intero(B) ? { A, B: Math.round(B) } : null; },
      ok: p => (p.B - p.A) / p.A * 100,
      err: { suarrivo: p => (p.B - p.A) / p.B * 100, differenza: p => p.B - p.A, rapporto: p => p.B / p.A * 100 },
      it: {
        q: (p, W) => `Un'azione passa da ${W.soldi(p.A)} a ${W.soldi(p.B)}. Di quanto è cambiato il prezzo, in percentuale?`,
        exp: (p, W, ok) => `La variazione si misura sempre rispetto al **prezzo di partenza**.\n\n$$\\text{variazione} = \\frac{P_1 - P_0}{P_0}$$\n\n\\(P_0\\) = prezzo di partenza, \\(P_1\\) = prezzo di arrivo.\n\n$$\\frac{${W.fn(p.B)} - ${W.fn(p.A)}}{${W.fn(p.A)}} = ${W.f(W.seg(ok))}$$`,
        err: { suarrivo: 'Hai diviso per il prezzo di arrivo: la variazione si calcola sul prezzo di partenza.', differenza: 'Questa è la differenza tra i due prezzi, non la percentuale: va divisa per il prezzo di partenza.', rapporto: 'Questo è il prezzo di arrivo in percentuale di quello di partenza: per la variazione bisogna togliere 100.' }
      },
      en: {
        q: (p, W) => `A stock goes from ${W.soldi(p.A)} to ${W.soldi(p.B)}. By what percentage has the price changed?`,
        exp: (p, W, ok) => `A change is always measured against the **starting price**.\n\n$$\\text{change} = \\frac{P_1 - P_0}{P_0}$$\n\n\\(P_0\\) = starting price, \\(P_1\\) = ending price.\n\n$$\\frac{${W.fn(p.B)} - ${W.fn(p.A)}}{${W.fn(p.A)}} = ${W.f(W.seg(ok))}$$`,
        err: { suarrivo: 'You divided by the ending price: the change is figured on the starting price.', differenza: 'This is the difference between the two prices, not the percentage: divide it by the starting price.', rapporto: 'This is the ending price as a percentage of the starting one: for the change you have to subtract 100.' }
      }
    },
    recupero: {
      liv: 2, tema: 'rischio', forma: 'pct',
      par: R => { const x = scegli(R, [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90]), P = scegli(R, [10, 20, 30, 40, 50, 60, 80, 100, 150, 200, 250, 400, 500, 1000]); return { P, x, Q: giro(P * (1 - x / 100), 2) }; },
      ok: p => p.x / (100 - p.x) * 100,
      err: { uguale: p => p.x, doppio: p => 2 * p.x, suuno: p => p.x / (100 + p.x) * 100 },
      it: {
        q: (p, W) => `Un'azione vale ${W.soldi(p.P)}. In un anno perde ${W.ilp(p.x)} e scende a ${W.soldi(p.Q)}. Di quanto deve salire, da lì, per tornare a ${W.soldi(p.P)}?`,
        exp: (p, W, ok) => `Dopo una perdita si riparte da una cifra più bassa: per recuperare gli stessi soldi serve una percentuale più alta.\n\n$$\\text{recupero} = \\frac{P_0 - P_1}{P_1}$$\n\n\\(P_0\\) = prezzo prima della perdita, \\(P_1\\) = prezzo dopo la perdita.\n\n$$\\frac{${W.fn(p.P)} - ${W.fs(p.Q)}}{${W.fs(p.Q)}} = ${W.f(W.pct(ok))}$$\n\nPiù la perdita è grande, più la risalita che serve è lunga.`,
        err: { uguale: 'Non basta la stessa percentuale: dopo la perdita si calcola su una cifra più bassa, quindi si recupera meno.', doppio: 'Non è il doppio della perdita: la risalita si calcola dividendo i soldi persi per il nuovo prezzo.', suuno: 'Hai diviso per una cifra più alta del prezzo di partenza: si divide per il prezzo dopo la perdita.' }
      },
      en: {
        q: (p, W) => `A stock is worth ${W.soldi(p.P)}. In one year it loses ${W.pct(p.x)} and falls to ${W.soldi(p.Q)}. By how much does it have to rise from there to get back to ${W.soldi(p.P)}?`,
        exp: (p, W, ok) => `After a loss you start again from a lower amount: to win back the same money you need a higher percentage.\n\n$$\\text{recovery} = \\frac{P_0 - P_1}{P_1}$$\n\n\\(P_0\\) = price before the loss, \\(P_1\\) = price after the loss.\n\n$$\\frac{${W.fn(p.P)} - ${W.fs(p.Q)}}{${W.fs(p.Q)}} = ${W.f(W.pct(ok))}$$\n\nThe bigger the loss, the longer the climb back.`,
        err: { uguale: 'The same percentage is not enough: after the loss it is figured on a lower amount, so it wins back less.', doppio: 'It is not double the loss: the climb back is the money lost divided by the new price.', suuno: 'You divided by an amount higher than the starting price: divide by the price after the loss.' }
      }
    },
    raddoppio: {
      liv: 2, tema: 'tempo', forma: 'anni',
      par: R => ({ C: scegli(R, [100, 200, 300, 500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 8000, 10000, 20000, 50000]), r: scegli(R, [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15]) }),
      ok: p => Math.log(2) / Math.log(1 + p.r / 100),
      err: { cento: p => 100 / p.r, meta: p => 50 / p.r, triplo: p => 144 / p.r },
      it: {
        q: (p, W) => `Hai ${W.soldi(p.C)} investiti ${W.alp(p.r)} l'anno, con gli interessi che restano investiti. Dopo circa quanti anni diventano ${W.soldi(2 * p.C)}?`,
        exp: (p, W, ok) => `C'è una scorciatoia, la **regola del 72**: dividi 72 per il tasso e trovi più o meno gli anni che servono per raddoppiare.\n\n$$\\text{anni} \\approx \\frac{72}{r}$$\n\n\\(r\\) = tasso annuo, scritto come numero (${p.r} per ${W.ilp(p.r)}).\n\n$$\\frac{72}{${p.r}} ${72 % p.r ? '\\approx' : '='} ${W.fn(72 / p.r, 1)}$$\n\nIl conto esatto con l'interesse composto dà ${W.n(Math.log(2) / Math.log(1 + p.r / 100), 1, true)} anni: la risposta giusta è **circa ${W.anni(ok)}**.`,
        err: { cento: 'Hai diviso 100 per il tasso: varrebbe se gli interessi non rendessero a loro volta. Con l\'interesse composto si fa prima.', meta: 'Troppo presto: in questi anni il capitale non è ancora raddoppiato. La scorciatoia è 72 diviso il tasso.', triplo: 'Troppo tardi: in questi anni il capitale è circa quadruplicato. La scorciatoia è 72 diviso il tasso.' }
      },
      en: {
        q: (p, W) => `You have ${W.soldi(p.C)} invested at ${W.pct(p.r)} a year, with the interest staying invested. After about how many years does it become ${W.soldi(2 * p.C)}?`,
        exp: (p, W, ok) => `There is a shortcut, the **rule of 72**: divide 72 by the rate and you get roughly the years it takes to double.\n\n$$\\text{years} \\approx \\frac{72}{r}$$\n\n\\(r\\) = annual rate, written as a number (${p.r} for ${W.pct(p.r)}).\n\n$$\\frac{72}{${p.r}} ${72 % p.r ? '\\approx' : '='} ${W.fn(72 / p.r, 1)}$$\n\nThe exact compound interest calculation gives ${W.n(Math.log(2) / Math.log(1 + p.r / 100), 1, true)} years: the right answer is **about ${W.anni(ok)}**.`,
        err: { cento: 'You divided 100 by the rate: that would hold if the interest did not earn interest itself. With compound interest it takes less time.', meta: 'Too soon: in these years the money has not doubled yet. The shortcut is 72 divided by the rate.', triplo: 'Too late: in these years the money has grown to about four times. The shortcut is 72 divided by the rate.' }
      }
    },
    dividendo: {
      liv: 1, tema: 'azioni', forma: 'pct',
      par: R => { const P = scegli(R, [5, 8, 10, 15, 16, 20, 25, 30, 40, 50, 60, 80, 125, 150, 200, 250, 400]), y = scegli(R, [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8]), D = P * y / 100; return intero(D * 100) ? { P, D: giro(D, 2) } : null; },
      ok: p => p.D / p.P * 100,
      err: { inverso: p => p.P / p.D, solodiv: p => p.D, dieci: p => p.D / p.P * 1000 },
      it: {
        q: (p, W) => `Un'azione costa ${W.soldi(p.P)} e paga un dividendo di ${W.soldi(p.D)} l'anno. Quanto rende il solo dividendo, in percentuale del prezzo?`,
        exp: (p, W, ok) => `Il rendimento da dividendo dice quanto incassi ogni anno rispetto a quello che spendi per comprare l'azione.\n\n$$\\text{rendimento} = \\frac{D}{P}$$\n\n\\(D\\) = dividendo di un anno, \\(P\\) = prezzo dell'azione.\n\n$$\\frac{${W.fs(p.D)}}{${W.fn(p.P)}} = ${W.f(W.pct(ok))}$$`,
        err: { inverso: 'Hai diviso il prezzo per il dividendo: va fatto il contrario, dividendo diviso prezzo.', solodiv: 'Questo è il dividendo in valuta, non in percentuale: va diviso per il prezzo.', dieci: 'C\'è uno zero di troppo: dividendo diviso prezzo, poi per 100.' }
      },
      en: {
        q: (p, W) => `A stock costs ${W.soldi(p.P)} and pays a dividend of ${W.soldi(p.D)} a year. How much does the dividend alone return, as a percentage of the price?`,
        exp: (p, W, ok) => `The dividend yield tells you how much you collect each year compared with what you spend to buy the stock.\n\n$$\\text{yield} = \\frac{D}{P}$$\n\n\\(D\\) = one year's dividend, \\(P\\) = price of the stock.\n\n$$\\frac{${W.fs(p.D)}}{${W.fn(p.P)}} = ${W.f(W.pct(ok))}$$`,
        err: { inverso: 'You divided the price by the dividend: it goes the other way, dividend divided by price.', solodiv: 'This is the dividend in money, not as a percentage: divide it by the price.', dieci: 'There is one zero too many: dividend divided by price, then times 100.' }
      }
    },
    cedola: {
      liv: 3, tema: 'obbligazioni', forma: 'pct2',
      par: R => ({ c: scegli(R, [1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7]), P: scegli(R, [70, 75, 80, 85, 90, 95, 105, 110, 115, 120, 125]) }),
      ok: p => p.c / p.P * 100,
      err: { nominale: p => p.c, rovescio: p => p.c * p.P / 100, sconto: p => p.c + (100 - p.P) },
      it: {
        q: (p, W) => `Un'obbligazione paga ogni anno una cedola di ${W.soldi(p.c)} per ogni ${W.soldi(100)} di valore nominale. Oggi sul mercato costa ${W.soldi(p.P)}. Se la compri oggi, quanto ti rende la cedola rispetto a quello che paghi?`,
        exp: (p, W, ok) => `La cedola è fissa, ma tu paghi il prezzo di oggi: è su quello che va misurata. Si chiama **rendimento immediato**.\n\n$$\\text{rendimento immediato} = \\frac{c}{P}$$\n\n\\(c\\) = cedola di un anno, \\(P\\) = prezzo di oggi.\n\n$$\\frac{${W.fs(p.c)}}{${W.fn(p.P)}} = ${W.f(W.pct(ok, 2))}$$\n\n${p.P < 100 ? 'Il prezzo è sotto 100: la stessa cedola pesa di più su una spesa più bassa.' : 'Il prezzo è sopra 100: la stessa cedola pesa di meno su una spesa più alta.'}`,
        err: { nominale: 'Questa è la cedola rispetto al valore nominale: tu però non paghi 100, paghi il prezzo di oggi.', rovescio: 'Hai moltiplicato la cedola per il prezzo: va divisa per il prezzo.', sconto: 'Hai aggiunto alla cedola la differenza tra 100 e il prezzo: quella si incassa (o si perde) alla scadenza, non ogni anno.' }
      },
      en: {
        q: (p, W) => `A bond pays a coupon of ${W.soldi(p.c)} every year for each ${W.soldi(100)} of face value. Today it costs ${W.soldi(p.P)} on the market. If you buy it today, how much does the coupon return compared with what you pay?`,
        exp: (p, W, ok) => `The coupon is fixed, but you pay today's price: that is what it should be measured against. It is called the **current yield**.\n\n$$\\text{current yield} = \\frac{c}{P}$$\n\n\\(c\\) = one year's coupon, \\(P\\) = today's price.\n\n$$\\frac{${W.fs(p.c)}}{${W.fn(p.P)}} = ${W.f(W.pct(ok, 2))}$$\n\n${p.P < 100 ? 'The price is below 100: the same coupon weighs more on a lower outlay.' : 'The price is above 100: the same coupon weighs less on a higher outlay.'}`,
        err: { nominale: 'This is the coupon compared with the face value: but you do not pay 100, you pay today’s price.', rovescio: 'You multiplied the coupon by the price: divide it by the price.', sconto: 'You added the gap between 100 and the price to the coupon: that is collected (or lost) at maturity, not every year.' }
      }
    },
    portafoglio: {
      liv: 2, tema: 'rischio', forma: 'seg2',
      par: R => { const w = scegli(R, [20, 25, 30, 40, 60, 70, 75, 80]), a = scegli(R, [-20, -10, 6, 8, 10, 12, 15, 20]), b = scegli(R, [-2, 1, 2, 3, 4, 5]); return { w, a, b }; },
      ok: p => (p.w * p.a + (100 - p.w) * p.b) / 100,
      err: { media: p => (p.a + p.b) / 2, soloazioni: p => p.w * p.a / 100, somma: p => p.a + p.b },
      it: {
        q: (p, W) => `Hai ${W.ilp(p.w)} dei tuoi soldi in azioni e il resto in obbligazioni. In un anno le azioni fanno ${W.seg(p.a)} e le obbligazioni ${W.seg(p.b)}. Quanto ha reso tutto il portafoglio?`,
        exp: (p, W, ok) => `Ogni parte conta per il **peso** che ha nel portafoglio: è una media pesata.\n\n$$R_p = w_A \\times R_A + w_O \\times R_O$$\n\n\\(w_A\\) = quota in azioni, \\(R_A\\) = rendimento delle azioni, \\(w_O\\) = quota in obbligazioni, \\(R_O\\) = rendimento delle obbligazioni.\n\n$$R_p = ${W.fn(p.w / 100, 2, true)} \\times ${p.a < 0 ? '(' + W.f(W.pct(p.a)) + ')' : W.f(W.pct(p.a))} + ${W.fn(1 - p.w / 100, 2, true)} \\times ${p.b < 0 ? '(' + W.f(W.pct(p.b)) + ')' : W.f(W.pct(p.b))} = ${W.f(W.seg(ok, 2))}$$`,
        err: { media: 'Hai fatto la media semplice dei due rendimenti: andrebbe bene solo con metà dei soldi da una parte e metà dall\'altra.', soloazioni: 'Hai contato solo le azioni: manca la parte in obbligazioni.', somma: 'Hai sommato i due rendimenti: ognuno va prima moltiplicato per la sua quota.' }
      },
      en: {
        q: (p, W) => `You have ${W.pct(p.w)} of your money in stocks and the rest in bonds. In one year the stocks return ${W.seg(p.a)} and the bonds ${W.seg(p.b)}. How much did the whole portfolio return?`,
        exp: (p, W, ok) => `Each part counts for the **weight** it has in the portfolio: it is a weighted average.\n\n$$R_p = w_S \\times R_S + w_B \\times R_B$$\n\n\\(w_S\\) = share in stocks, \\(R_S\\) = return on the stocks, \\(w_B\\) = share in bonds, \\(R_B\\) = return on the bonds.\n\n$$R_p = ${W.fn(p.w / 100, 2, true)} \\times ${p.a < 0 ? '(' + W.f(W.pct(p.a)) + ')' : W.f(W.pct(p.a))} + ${W.fn(1 - p.w / 100, 2, true)} \\times ${p.b < 0 ? '(' + W.f(W.pct(p.b)) + ')' : W.f(W.pct(p.b))} = ${W.f(W.seg(ok, 2))}$$`,
        err: { media: 'You took the simple average of the two returns: that would work only with half the money on each side.', soloazioni: 'You counted only the stocks: the bond part is missing.', somma: 'You added the two returns: each one must first be multiplied by its share.' }
      }
    },
    totale: {
      liv: 2, tema: 'azioni', forma: 'seg',
      par: R => { const A = scegli(R, [20, 25, 40, 50, 80, 100, 200]), g = scegli(R, [-20, -10, -5, 5, 10, 15, 20, 30]), d = scegli(R, [1, 2, 3, 4, 5]), B = A * (1 + g / 100), D = A * d / 100; return intero(B * 2) && intero(D * 100) ? { A, B: giro(B, 2), D: giro(D, 2) } : null; },
      ok: p => (p.B - p.A + p.D) / p.A * 100,
      err: { soloprezzo: p => (p.B - p.A) / p.A * 100, solodiv: p => p.D / p.A * 100, suarrivo: p => (p.B - p.A + p.D) / p.B * 100 },
      it: {
        q: (p, W) => `Compri un'azione a ${W.soldi(p.A)}. Dopo un anno vale ${W.soldi(p.B)} e nel frattempo hai incassato ${W.soldi(p.D)} di dividendo. Quanto hai guadagnato o perso in tutto, in percentuale di quello che hai speso?`,
        exp: (p, W, ok) => `Il **rendimento totale** mette insieme le due cose: quanto è cambiato il prezzo e quanto hai incassato di dividendo.\n\n$$R = \\frac{P_1 - P_0 + D}{P_0}$$\n\n\\(P_0\\) = prezzo a cui hai comprato, \\(P_1\\) = prezzo dopo un anno, \\(D\\) = dividendo incassato.\n\n$$R = \\frac{${W.fs(p.B)} - ${W.fn(p.A)} + ${W.fs(p.D)}}{${W.fn(p.A)}} = ${W.f(W.seg(ok))}$$`,
        err: { soloprezzo: 'Hai guardato solo il prezzo: manca il dividendo incassato.', solodiv: 'Hai contato solo il dividendo: manca quanto è cambiato il prezzo.', suarrivo: 'Hai diviso per il prezzo finale: il rendimento si calcola su quello che hai speso all\'inizio.' }
      },
      en: {
        q: (p, W) => `You buy a stock at ${W.soldi(p.A)}. After one year it is worth ${W.soldi(p.B)} and in the meantime you collected ${W.soldi(p.D)} in dividends. How much did you gain or lose in total, as a percentage of what you spent?`,
        exp: (p, W, ok) => `The **total return** puts the two things together: how much the price changed and how much you collected in dividends.\n\n$$R = \\frac{P_1 - P_0 + D}{P_0}$$\n\n\\(P_0\\) = price you bought at, \\(P_1\\) = price after one year, \\(D\\) = dividend collected.\n\n$$R = \\frac{${W.fs(p.B)} - ${W.fn(p.A)} + ${W.fs(p.D)}}{${W.fn(p.A)}} = ${W.f(W.seg(ok))}$$`,
        err: { soloprezzo: 'You looked only at the price: the dividend you collected is missing.', solodiv: 'You counted only the dividend: the change in price is missing.', suarrivo: 'You divided by the final price: the return is figured on what you spent at the start.' }
      }
    },
    margine: {
      liv: 1, tema: 'azienda', forma: 'pct',
      par: R => { const Ri = scegli(R, [20000, 30000, 40000, 50000, 60000, 80000, 100000, 120000, 150000, 200000, 250000, 300000, 400000, 500000, 800000, 1000000, 2000000, 5000000]), m = 2 + Math.floor(R() * 44); return { R: Ri, C: Math.round(Ri * (100 - m) / 100) }; },
      ok: p => (p.R - p.C) / p.R * 100,
      err: { costi: p => p.C / p.R * 100, suicosti: p => (p.R - p.C) / p.C * 100, rapporto: p => p.R / p.C * 100 },
      it: {
        q: (p, W) => `In un anno un'azienda incassa ${W.soldi(p.R)} dalle vendite e spende ${W.soldi(p.C)}. Che parte delle vendite le resta come utile, in percentuale?`,
        exp: (p, W, ok) => `È il **margine di utile**: quanto resta in tasca all'azienda per ogni 100 di vendite.\n\n$$\\text{margine} = \\frac{R - C}{R}$$\n\n\\(R\\) = ricavi (quello che incassa dalle vendite), \\(C\\) = costi.\n\n$$\\frac{${W.fn(p.R)} - ${W.fn(p.C)}}{${W.fn(p.R)}} = ${W.f(W.pct(ok))}$$`,
        err: { costi: 'Questa è la parte delle vendite che se ne va in costi: l\'utile è quello che resta.', suicosti: 'Hai diviso l\'utile per i costi: il margine si calcola sulle vendite.', rapporto: 'Hai diviso le vendite per i costi: prima va trovato l\'utile, poi lo si divide per le vendite.' }
      },
      en: {
        q: (p, W) => `In one year a company takes in ${W.soldi(p.R)} from sales and spends ${W.soldi(p.C)}. What share of its sales is left as profit, as a percentage?`,
        exp: (p, W, ok) => `This is the **profit margin**: how much the company keeps for every 100 of sales.\n\n$$\\text{margin} = \\frac{R - C}{R}$$\n\n\\(R\\) = revenue (what it takes in from sales), \\(C\\) = costs.\n\n$$\\frac{${W.fn(p.R)} - ${W.fn(p.C)}}{${W.fn(p.R)}} = ${W.f(W.pct(ok))}$$`,
        err: { costi: 'This is the share of sales that goes to costs: the profit is what is left.', suicosti: 'You divided the profit by the costs: the margin is figured on sales.', rapporto: 'You divided sales by costs: first find the profit, then divide it by sales.' }
      }
    },
    // =====================================================================================================
    // LABORATORIO «multipli» (materia Azioni, capitolo «Costa tanto o poco?»). Gli stampi con `lab` si usano solo nel laboratorio
    // del loro capitolo: la Serie non li pesca, perché danno per fatte le lezioni. Le cifre delle aziende sono in milioni.
    // =====================================================================================================
    capz: {
      liv: 2, tema: 'valutare', forma: 'mln', lab: 'multipli',
      par: R => { const P = scegli(R, [2.5, 4, 5, 7.5, 8, 12, 15, 20, 25, 40, 60]), N = scegli(R, [4, 5, 8, 10, 20, 25, 40, 50, 80, 100]); return intero(P * N) && P * N >= 40 ? { P, N } : null; },
      ok: p => p.P * p.N,
      err: { somma: p => p.P + p.N, dieci: p => p.P * p.N / 10, cento: p => p.P * p.N * 10 },
      it: {
        q: (p, W) => `Un'azione costa ${W.soldi(p.P)} e le azioni in circolazione sono ${W.n(p.N)} milioni. Quanto vale in Borsa tutta l'azienda?`,
        exp: (p, W, ok) => `La **capitalizzazione** è il prezzo di un'azione per il numero di azioni.\n\n$$\\text{Cap} = P \\times N$$\n\n\\(P\\) = prezzo di un'azione, \\(N\\) = numero di azioni (qui in milioni).\n\n$$\\text{Cap} = ${W.fs(p.P)} \\times ${W.fn(p.N)} = ${W.fn(ok)}$$\n\nL'azienda vale in Borsa **${W.n(ok)} milioni**.`,
        err: { somma: 'Hai sommato prezzo e numero di azioni: vanno moltiplicati.', dieci: 'Hai perso uno zero per strada: rifai la moltiplicazione.', cento: 'Hai aggiunto uno zero di troppo: rifai la moltiplicazione.' }
      },
      en: {
        q: (p, W) => `A share costs ${W.soldi(p.P)} and there are ${W.n(p.N)} million shares outstanding. What is the whole company worth on the stock market?`,
        exp: (p, W, ok) => `**Market capitalization** is the price of one share times the number of shares.\n\n$$\\text{Cap} = P \\times N$$\n\n\\(P\\) = price of one share, \\(N\\) = number of shares (here in millions).\n\n$$\\text{Cap} = ${W.fs(p.P)} \\times ${W.fn(p.N)} = ${W.fn(ok)}$$\n\nThe company is worth **${W.n(ok)} million** on the stock market.`,
        err: { somma: 'You added the price and the number of shares: they must be multiplied.', dieci: 'You lost a zero along the way: redo the multiplication.', cento: 'You added one zero too many: redo the multiplication.' }
      }
    },
    eps: {
      liv: 2, tema: 'valutare', forma: 'euro2', lab: 'multipli',
      par: R => { const U = scegli(R, [6, 9, 12, 15, 18, 21, 24, 30, 36, 45, 60]), N = scegli(R, [4, 5, 8, 10, 12, 20, 25, 40, 50]), m = scegli(R, [8, 10, 12, 15, 16, 20, 25]), E = U / N, P = m * E;
        return intero(E * 100) && E >= 0.2 && E <= 9 && intero(P * 100) ? { U, N, P: giro(P, 2) } : null; },
      ok: p => p.U / p.N,
      err: { capov: p => p.N / p.U, pe: p => p.P / (p.U / p.N), dieci: p => p.U / p.N * 10 },
      it: {
        q: (p, W) => `Un'azienda ha chiuso l'anno con un utile netto di ${W.n(p.U)} milioni. Le azioni sono ${W.n(p.N)} milioni e ognuna costa ${W.soldi(p.P)}. Quanto vale l'utile per azione?`,
        exp: (p, W, ok) => `L'**utile per azione** (EPS) è l'utile netto diviso il numero di azioni. Il prezzo qui non serve.\n\n$$\\text{EPS} = \\frac{U}{N}$$\n\n\\(U\\) = utile netto, \\(N\\) = numero di azioni.\n\n$$\\text{EPS} = \\frac{${W.fn(p.U)}}{${W.fn(p.N)}} = ${W.fs(ok)}$$\n\nA ogni azione spettano **${W.soldi(ok)}** di utile.`,
        err: { capov: 'Hai diviso il numero di azioni per l\'utile: va fatto il contrario.', pe: 'Questo è il P/E, cioè il prezzo diviso l\'utile per azione: la domanda chiede solo l\'utile per azione.', dieci: 'Controlla la virgola: il risultato giusto è dieci volte più piccolo.' }
      },
      en: {
        q: (p, W) => `A company closed the year with a net income of ${W.n(p.U)} million. It has ${W.n(p.N)} million shares, and each one costs ${W.soldi(p.P)}. What are its earnings per share?`,
        exp: (p, W, ok) => `**Earnings per share** (EPS) is net income divided by the number of shares. The price is not needed here.\n\n$$\\text{EPS} = \\frac{U}{N}$$\n\n\\(U\\) = net income, \\(N\\) = number of shares.\n\n$$\\text{EPS} = \\frac{${W.fn(p.U)}}{${W.fn(p.N)}} = ${W.fs(ok)}$$\n\nEach share is entitled to **${W.soldi(ok)}** of earnings.`,
        err: { capov: 'You divided the number of shares by the net income: it goes the other way.', pe: 'This is the P/E, the price divided by earnings per share: the question asks only for earnings per share.', dieci: 'Check the decimal point: the right result is ten times smaller.' }
      }
    },
    pe: {
      liv: 2, tema: 'valutare', forma: 'volte', lab: 'multipli',
      par: R => { const E = scegli(R, [0.25, 0.4, 0.5, 0.75, 0.8, 1.2, 1.25, 1.5, 2, 2.5, 3, 4]), m = scegli(R, [6, 8, 9, 10, 12, 12.5, 14, 15, 16, 18, 20, 22, 24, 25, 28, 30, 35, 40]), P = m * E; return intero(P * 100) ? { P: giro(P, 2), E } : null; },
      ok: p => p.P / p.E,
      err: { resa: p => p.E / p.P * 100, diff: p => p.P - p.E, per: p => p.P * p.E },
      it: {
        q: (p, W) => `Un'azione costa ${W.soldi(p.P)} e l'utile per azione è ${W.soldi(p.E)}. Quanto vale il P/E?`,
        exp: (p, W, ok) => `Il **P/E** è il prezzo diviso l'utile per azione: quanto paghi per ogni euro di utile annuo.\n\n$$\\text{P/E} = \\frac{P}{\\text{EPS}}$$\n\n\\(P\\) = prezzo di un'azione, \\(\\text{EPS}\\) = utile per azione.\n\n$$\\text{P/E} = \\frac{${W.fs(p.P)}}{${W.fs(p.E)}} = ${W.fn(ok, 1)}$$\n\nPer ogni euro di utile annuo il mercato paga **${W.soldi(ok)}**.`,
        err: { resa: 'Hai capovolto il rapporto: questo è l\'utile in percentuale del prezzo, cioè il rendimento degli utili.', diff: 'Hai tolto l\'utile dal prezzo: il prezzo va diviso per l\'utile per azione.', per: 'Hai moltiplicato prezzo e utile: il prezzo va diviso per l\'utile per azione.' }
      },
      en: {
        q: (p, W) => `A share costs ${W.soldi(p.P)} and earnings per share are ${W.soldi(p.E)}. What is the P/E?`,
        exp: (p, W, ok) => `The **P/E** is the price divided by earnings per share: how much you pay for every ${W.soldi(1)} of yearly earnings.\n\n$$\\text{P/E} = \\frac{P}{\\text{EPS}}$$\n\n\\(P\\) = price of one share, \\(\\text{EPS}\\) = earnings per share.\n\n$$\\text{P/E} = \\frac{${W.fs(p.P)}}{${W.fs(p.E)}} = ${W.fn(ok, 1)}$$\n\nFor every ${W.soldi(1)} of yearly earnings the market pays **${W.soldi(ok)}**.`,
        err: { resa: 'You flipped the ratio: this is earnings as a percentage of the price, the earnings yield.', diff: 'You subtracted earnings from the price: the price must be divided by earnings per share.', per: 'You multiplied price and earnings: the price must be divided by earnings per share.' }
      }
    },
    petot: {
      liv: 3, tema: 'valutare', forma: 'volte', lab: 'multipli',
      par: R => { const P = scegli(R, [2.5, 4, 5, 8, 12, 15, 20, 25, 40]), N = scegli(R, [4, 5, 8, 10, 20, 25, 40, 50]), m = scegli(R, [8, 10, 12, 12.5, 15, 16, 20, 25, 30]), U = P * N / m;
        return intero(P * N) && intero(U * 10) && U >= 2 ? { P, N, U: giro(U, 1) } : null; },
      ok: p => p.P * p.N / p.U,
      err: { senzaN: p => p.P / p.U, eps: p => p.U / p.N, resa: p => p.U / (p.P * p.N) * 100 },
      it: {
        q: (p, W) => `Un'azione costa ${W.soldi(p.P)}. Le azioni sono ${W.n(p.N)} milioni e l'utile netto dell'anno è ${W.n(p.U, 1)} milioni. Quanto vale il P/E?`,
        exp: (p, W, ok) => `Si può fare con le cifre di tutta l'azienda: capitalizzazione diviso utile netto.\n\n$$\\text{P/E} = \\frac{P \\times N}{U}$$\n\n\\(P\\) = prezzo di un'azione, \\(N\\) = numero di azioni, \\(U\\) = utile netto.\n\n$$\\text{P/E} = \\frac{${W.fs(p.P)} \\times ${W.fn(p.N)}}{${W.fn(p.U, 1)}} = \\frac{${W.fn(p.P * p.N)}}{${W.fn(p.U, 1)}} = ${W.fn(ok, 1)}$$\n\nÈ lo stesso numero che esce dividendo il prezzo per l'utile per azione.`,
        err: { senzaN: 'Hai diviso il prezzo di una sola azione per l\'utile di tutta l\'azienda: prima serve la capitalizzazione, oppure l\'utile per azione.', eps: 'Questo è l\'utile per azione: è il primo passo, poi va messo sotto il prezzo.', resa: 'Hai capovolto il rapporto: questo è l\'utile in percentuale della capitalizzazione.' }
      },
      en: {
        q: (p, W) => `A share costs ${W.soldi(p.P)}. There are ${W.n(p.N)} million shares, and net income for the year is ${W.n(p.U, 1)} million. What is the P/E?`,
        exp: (p, W, ok) => `You can use the figures for the whole company: market capitalization divided by net income.\n\n$$\\text{P/E} = \\frac{P \\times N}{U}$$\n\n\\(P\\) = price of one share, \\(N\\) = number of shares, \\(U\\) = net income.\n\n$$\\text{P/E} = \\frac{${W.fs(p.P)} \\times ${W.fn(p.N)}}{${W.fn(p.U, 1)}} = \\frac{${W.fn(p.P * p.N)}}{${W.fn(p.U, 1)}} = ${W.fn(ok, 1)}$$\n\nIt is the same number you get by dividing the price by earnings per share.`,
        err: { senzaN: 'You divided the price of a single share by the net income of the whole company: first you need the market capitalization, or the earnings per share.', eps: 'This is earnings per share: it is the first step, then it goes under the price.', resa: 'You flipped the ratio: this is net income as a percentage of market capitalization.' }
      }
    },
    ey: {
      liv: 3, tema: 'valutare', forma: 'pct2', lab: 'multipli',
      par: R => { const m = scegli(R, [5, 8, 10, 12.5, 16, 20, 25, 40]), E = scegli(R, [0.25, 0.4, 0.5, 0.8, 1, 1.25, 2, 2.5, 4]), P = m * E; return intero(P * 100) ? { P: giro(P, 2), E } : null; },
      ok: p => p.E / p.P * 100,
      err: { pe: p => p.P / p.E, cento: p => p.E / p.P, diff: p => (p.P - p.E) / p.P * 100 },
      it: {
        q: (p, W) => `Un'azione costa ${W.soldi(p.P)} e l'utile per azione è ${W.soldi(p.E)}. Quanto vale il rendimento degli utili, cioè l'utile per azione in percentuale del prezzo?`,
        exp: (p, W, ok) => `Il **rendimento degli utili** è il P/E capovolto: utile per azione diviso prezzo.\n\n$$\\frac{\\text{EPS}}{P}$$\n\n\\(\\text{EPS}\\) = utile per azione, \\(P\\) = prezzo di un'azione.\n\n$$\\frac{${W.fs(p.E)}}{${W.fs(p.P)}} = ${W.f(W.pct(ok, 2))}$$\n\nA ogni 100 spesi in azioni corrispondono ${W.n(ok, 2)} di utili l'anno.`,
        err: { pe: 'Questo è il P/E, prezzo diviso utile: il rendimento degli utili è il rapporto capovolto.', cento: 'Hai dimenticato di moltiplicare per 100 per avere la percentuale.', diff: 'Hai tolto l\'utile dal prezzo: l\'utile va diviso per il prezzo.' }
      },
      en: {
        q: (p, W) => `A share costs ${W.soldi(p.P)} and earnings per share are ${W.soldi(p.E)}. What is the earnings yield, that is, earnings per share as a percentage of the price?`,
        exp: (p, W, ok) => `The **earnings yield** is the P/E flipped over: earnings per share divided by price.\n\n$$\\frac{\\text{EPS}}{P}$$\n\n\\(\\text{EPS}\\) = earnings per share, \\(P\\) = price of one share.\n\n$$\\frac{${W.fs(p.E)}}{${W.fs(p.P)}} = ${W.f(W.pct(ok, 2))}$$\n\nEvery 100 spent on the stock corresponds to ${W.n(ok, 2)} of earnings a year.`,
        err: { pe: 'This is the P/E, price divided by earnings: the earnings yield is the ratio flipped over.', cento: 'You forgot to multiply by 100 to get the percentage.', diff: 'You subtracted earnings from the price: earnings must be divided by the price.' }
      }
    },
    pb: {
      liv: 3, tema: 'valutare', forma: 'volte', lab: 'multipli',
      par: R => { const B = scegli(R, [2, 2.5, 4, 5, 6, 8, 10, 12.5, 20]), N = scegli(R, [4, 10, 20, 40, 50]), m = scegli(R, [0.5, 0.6, 0.7, 0.8, 1.2, 1.5, 1.8, 2, 2.5, 3, 4, 5]), P = m * B;
        return intero(P * 100) && intero(B * N) ? { P: giro(P, 2), PN: giro(B * N), N } : null; },
      ok: p => p.P / (p.PN / p.N),
      err: { bvps: p => p.PN / p.N, capov: p => p.PN / p.N / p.P, senzaN: p => p.P / p.PN },
      it: {
        q: (p, W) => `Un'azione costa ${W.soldi(p.P)}. Il patrimonio netto dell'azienda è ${W.n(p.PN)} milioni e le azioni sono ${W.n(p.N)} milioni. Quanto vale il P/B?`,
        exp: (p, W, ok) => `Prima il **valore contabile per azione**, poi il rapporto con il prezzo.\n\n$$\\text{BVPS} = \\frac{PN}{N} = \\frac{${W.fn(p.PN)}}{${W.fn(p.N)}} = ${W.fs(p.PN / p.N)}$$\n\n$$\\text{P/B} = \\frac{P}{\\text{BVPS}} = \\frac{${W.fs(p.P)}}{${W.fs(p.PN / p.N)}} = ${W.fn(ok, 1)}$$\n\n\\(PN\\) = patrimonio netto, \\(N\\) = numero di azioni, \\(P\\) = prezzo di un'azione.\n\n${ok < 1 ? 'In Borsa l\'azienda vale meno del patrimonio scritto nei conti.' : `Per ogni euro di patrimonio scritto nei conti il mercato paga ${W.soldi(ok)}.`}`,
        err: { bvps: 'Questo è il valore contabile per azione: è il primo passo, poi va messo sotto il prezzo.', capov: 'Hai capovolto il rapporto: il prezzo va sopra, il valore contabile per azione sotto.', senzaN: 'Hai diviso il prezzo di una sola azione per il patrimonio di tutta l\'azienda: prima serve il patrimonio per azione.' }
      },
      en: {
        q: (p, W) => `A share costs ${W.soldi(p.P)}. The company's book equity is ${W.n(p.PN)} million and it has ${W.n(p.N)} million shares. What is the P/B?`,
        exp: (p, W, ok) => `First the **book value per share**, then its ratio to the price.\n\n$$\\text{BVPS} = \\frac{PN}{N} = \\frac{${W.fn(p.PN)}}{${W.fn(p.N)}} = ${W.fs(p.PN / p.N)}$$\n\n$$\\text{P/B} = \\frac{P}{\\text{BVPS}} = \\frac{${W.fs(p.P)}}{${W.fs(p.PN / p.N)}} = ${W.fn(ok, 1)}$$\n\n\\(PN\\) = book equity, \\(N\\) = number of shares, \\(P\\) = price of one share.\n\n${ok < 1 ? 'On the stock market the company is worth less than the equity recorded in its books.' : `For every ${W.soldi(1)} of equity recorded in the books the market pays ${W.soldi(ok)}.`}`,
        err: { bvps: 'This is the book value per share: it is the first step, then it goes under the price.', capov: 'You flipped the ratio: the price goes on top, the book value per share underneath.', senzaN: 'You divided the price of a single share by the equity of the whole company: first you need the equity per share.' }
      }
    },
    ps: {
      liv: 3, tema: 'valutare', forma: 'volte', lab: 'multipli',
      par: R => { const P = scegli(R, [2.5, 4, 5, 8, 12, 15, 20, 25, 40]), N = scegli(R, [4, 5, 8, 10, 20, 25, 40, 50]), m = scegli(R, [0.2, 0.4, 0.5, 0.8, 1.2, 1.5, 2, 2.5, 3, 4, 5]), Ri = P * N / m;
        return intero(P * N) && intero(Ri) ? { P, N, R: giro(Ri) } : null; },
      ok: p => p.P * p.N / p.R,
      err: { capov: p => p.R / (p.P * p.N), perazione: p => p.R / p.N, dieci: p => p.P * p.N / p.R * 10 },
      it: {
        q: (p, W) => `Un'azione costa ${W.soldi(p.P)} e le azioni sono ${W.n(p.N)} milioni. I ricavi dell'anno sono ${W.n(p.R)} milioni. Quanto vale il P/S?`,
        exp: (p, W, ok) => `Il **P/S** è la capitalizzazione divisa per i ricavi.\n\n$$\\text{P/S} = \\frac{P \\times N}{R}$$\n\n\\(P\\) = prezzo di un'azione, \\(N\\) = numero di azioni, \\(R\\) = ricavi dell'anno.\n\n$$\\text{P/S} = \\frac{${W.fs(p.P)} \\times ${W.fn(p.N)}}{${W.fn(p.R)}} = \\frac{${W.fn(p.P * p.N)}}{${W.fn(p.R)}} = ${W.fn(ok, 1)}$$\n\nPer ogni euro di vendite il mercato paga **${W.soldi(ok)}**.`,
        err: { capov: 'Hai capovolto il rapporto: la capitalizzazione va sopra, i ricavi sotto.', perazione: 'Questi sono i ricavi per azione: è un primo passo, poi vanno messi sotto il prezzo.', dieci: 'Controlla la virgola: il risultato giusto è dieci volte più piccolo.' }
      },
      en: {
        q: (p, W) => `A share costs ${W.soldi(p.P)} and there are ${W.n(p.N)} million shares. Revenue for the year is ${W.n(p.R)} million. What is the P/S?`,
        exp: (p, W, ok) => `The **P/S** is market capitalization divided by revenue.\n\n$$\\text{P/S} = \\frac{P \\times N}{R}$$\n\n\\(P\\) = price of one share, \\(N\\) = number of shares, \\(R\\) = revenue for the year.\n\n$$\\text{P/S} = \\frac{${W.fs(p.P)} \\times ${W.fn(p.N)}}{${W.fn(p.R)}} = \\frac{${W.fn(p.P * p.N)}}{${W.fn(p.R)}} = ${W.fn(ok, 1)}$$\n\nFor every ${W.soldi(1)} of sales the market pays **${W.soldi(ok)}**.`,
        err: { capov: 'You flipped the ratio: market capitalization goes on top, revenue underneath.', perazione: 'This is revenue per share: it is a first step, then it goes under the price.', dieci: 'Check the decimal point: the right result is ten times smaller.' }
      }
    },
    ev: {
      liv: 2, tema: 'valutare', forma: 'mln', lab: 'multipli',
      par: R => ({ cap: scegli(R, [120, 150, 180, 200, 240, 300, 360, 400, 500, 600, 800]), D: scegli(R, [20, 30, 40, 50, 60, 80, 100, 120, 150, 200, 250]), C: scegli(R, [10, 20, 30, 40, 50, 60, 80]) }),
      ok: p => p.cap + p.D - p.C,
      err: { piucassa: p => p.cap + p.D + p.C, senzacassa: p => p.cap + p.D, contrario: p => p.cap - p.D + p.C },
      it: {
        q: (p, W) => `Un'azienda vale in Borsa ${W.n(p.cap)} milioni. Ha debiti finanziari per ${W.n(p.D)} milioni e ${W.n(p.C)} milioni in cassa. Quanto vale il suo valore d'impresa (EV)?`,
        exp: (p, W, ok) => `Il **valore d'impresa** è quello che costa comprare tutta l'attività: le azioni, più i debiti di cui ti fai carico, meno la cassa che ti ritrovi.\n\n$$\\text{EV} = \\text{Cap} + D - C$$\n\n\\(\\text{Cap}\\) = capitalizzazione, \\(D\\) = debiti finanziari, \\(C\\) = cassa.\n\n$$\\text{EV} = ${W.fn(p.cap)} + ${W.fn(p.D)} - ${W.fn(p.C)} = ${W.fn(ok)}$$\n\nL'EV è **${W.n(ok)} milioni**.`,
        err: { piucassa: 'Hai aggiunto anche la cassa: la cassa si toglie, perché chi compra l\'azienda se la ritrova.', senzacassa: 'Hai dimenticato di togliere la cassa.', contrario: 'Hai tolto i debiti e aggiunto la cassa: è il contrario.' }
      },
      en: {
        q: (p, W) => `A company is worth ${W.n(p.cap)} million on the stock market. It has ${W.n(p.D)} million of financial debt and ${W.n(p.C)} million in cash. What is its enterprise value (EV)?`,
        exp: (p, W, ok) => `**Enterprise value** is what it costs to buy the whole business: the shares, plus the debt you take on, minus the cash you get.\n\n$$\\text{EV} = \\text{Cap} + D - C$$\n\n\\(\\text{Cap}\\) = market capitalization, \\(D\\) = financial debt, \\(C\\) = cash.\n\n$$\\text{EV} = ${W.fn(p.cap)} + ${W.fn(p.D)} - ${W.fn(p.C)} = ${W.fn(ok)}$$\n\nThe EV is **${W.n(ok)} million**.`,
        err: { piucassa: 'You added the cash too: cash is subtracted, because whoever buys the company gets it.', senzacassa: 'You forgot to subtract the cash.', contrario: 'You subtracted the debt and added the cash: it is the other way around.' }
      }
    },
    confronto: {
      liv: 3, tema: 'valutare', forma: 'euro2', lab: 'multipli',
      par: R => { const L = [8, 10, 12, 14, 15, 16, 18, 20, 22, 24, 25, 30], a = scegli(R, L), b = scegli(R, L), E = scegli(R, [0.4, 0.5, 0.8, 1.2, 1.5, 2, 2.5, 3, 4]);
        return Math.abs(a - b) >= 4 && intero((a + b) / 2 * E * 100) ? { a, b, E } : null; },
      ok: p => (p.a + p.b) / 2 * p.E,
      err: { somma: p => (p.a + p.b) * p.E, alto: p => Math.max(p.a, p.b) * p.E, basso: p => Math.min(p.a, p.b) * p.E },
      it: {
        q: (p, W) => `I due concorrenti di un'azienda hanno un P/E di ${W.n(p.a)} e di ${W.n(p.b)}. L'azienda ha un utile per azione di ${W.soldi(p.E)}. Con il metodo del confronto, usando la media dei due P/E, quanto vale una sua azione?`,
        exp: (p, W, ok) => `Il metodo del confronto applica all'azienda il multiplo medio delle aziende simili.\n\n$$V = \\text{P/E}_{\\text{simili}} \\times \\text{EPS}$$\n\n\\(\\text{P/E}_{\\text{simili}}\\) = media dei P/E dei concorrenti, \\(\\text{EPS}\\) = utile per azione.\n\nLa media è \\(\\dfrac{${W.fn(p.a)} + ${W.fn(p.b)}}{2} = ${W.fn((p.a + p.b) / 2, 1)}\\).\n\n$$V = ${W.fn((p.a + p.b) / 2, 1)} \\times ${W.fs(p.E)} = ${W.fs(ok)}$$\n\nSe il mercato la pagasse come i concorrenti, l'azione costerebbe **${W.soldi(ok)}**.`,
        err: { somma: 'Hai sommato i due P/E senza dividere per due: serve la media.', alto: 'Hai usato solo il P/E più alto: serve la media dei due.', basso: 'Hai usato solo il P/E più basso: serve la media dei due.' }
      },
      en: {
        q: (p, W) => `A company's two competitors have a P/E of ${W.n(p.a)} and ${W.n(p.b)}. The company has earnings per share of ${W.soldi(p.E)}. Using the comparison method with the average of the two P/Es, what is one of its shares worth?`,
        exp: (p, W, ok) => `The comparison method applies to the company the average multiple of similar companies.\n\n$$V = \\text{P/E}_{\\text{peers}} \\times \\text{EPS}$$\n\n\\(\\text{P/E}_{\\text{peers}}\\) = average P/E of the competitors, \\(\\text{EPS}\\) = earnings per share.\n\nThe average is \\(\\dfrac{${W.fn(p.a)} + ${W.fn(p.b)}}{2} = ${W.fn((p.a + p.b) / 2, 1)}\\).\n\n$$V = ${W.fn((p.a + p.b) / 2, 1)} \\times ${W.fs(p.E)} = ${W.fs(ok)}$$\n\nIf the market paid for it the way it pays for its competitors, the share would cost **${W.soldi(ok)}**.`,
        err: { somma: 'You added the two P/Es without dividing by two: you need the average.', alto: 'You used only the higher P/E: you need the average of the two.', basso: 'You used only the lower P/E: you need the average of the two.' }
      }
    },
    evebit: {
      liv: 3, tema: 'valutare', forma: 'volte', lab: 'multipli',
      par: R => { const E = scegli(R, [10, 12, 15, 16, 20, 24, 25, 30, 40, 50]), m = scegli(R, [6, 8, 10, 12, 12.5, 15, 16, 20]), D = scegli(R, [20, 40, 50, 60, 80, 100, 150]), C = scegli(R, [10, 20, 30, 40]), cap = m * E - D + C;
        return intero(m * E) && cap >= 40 ? { cap: giro(cap), D, C, E } : null; },
      ok: p => (p.cap + p.D - p.C) / p.E,
      err: { cap: p => p.cap / p.E, piucassa: p => (p.cap + p.D + p.C) / p.E, senzacassa: p => (p.cap + p.D) / p.E },
      it: {
        q: (p, W) => `Un'azienda vale in Borsa ${W.n(p.cap)} milioni, ha debiti finanziari per ${W.n(p.D)} milioni e ${W.n(p.C)} milioni in cassa. Il suo risultato operativo è ${W.n(p.E)} milioni. Quanto vale il rapporto tra valore d'impresa (EV) e risultato operativo?`,
        exp: (p, W, ok) => `Prima l'EV, poi il rapporto.\n\n$$\\text{EV} = \\text{Cap} + D - C = ${W.fn(p.cap)} + ${W.fn(p.D)} - ${W.fn(p.C)} = ${W.fn(p.cap + p.D - p.C)}$$\n\n$$\\frac{\\text{EV}}{\\text{EBIT}} = \\frac{${W.fn(p.cap + p.D - p.C)}}{${W.fn(p.E)}} = ${W.fn(ok, 1)}$$\n\n\\(\\text{Cap}\\) = capitalizzazione, \\(D\\) = debiti finanziari, \\(C\\) = cassa, \\(\\text{EBIT}\\) = risultato operativo.`,
        err: { cap: 'Hai usato la capitalizzazione al posto dell\'EV: sopra il risultato operativo va il valore di tutta l\'attività, debiti compresi.', piucassa: 'Nel calcolo dell\'EV hai aggiunto la cassa: va tolta.', senzacassa: 'Nel calcolo dell\'EV hai dimenticato di togliere la cassa.' }
      },
      en: {
        q: (p, W) => `A company is worth ${W.n(p.cap)} million on the stock market, has ${W.n(p.D)} million of financial debt and ${W.n(p.C)} million in cash. Its operating income is ${W.n(p.E)} million. What is the ratio of enterprise value (EV) to operating income?`,
        exp: (p, W, ok) => `First the EV, then the ratio.\n\n$$\\text{EV} = \\text{Cap} + D - C = ${W.fn(p.cap)} + ${W.fn(p.D)} - ${W.fn(p.C)} = ${W.fn(p.cap + p.D - p.C)}$$\n\n$$\\frac{\\text{EV}}{\\text{EBIT}} = \\frac{${W.fn(p.cap + p.D - p.C)}}{${W.fn(p.E)}} = ${W.fn(ok, 1)}$$\n\n\\(\\text{Cap}\\) = market capitalization, \\(D\\) = financial debt, \\(C\\) = cash, \\(\\text{EBIT}\\) = operating income.`,
        err: { cap: 'You used market capitalization instead of EV: on top of operating income goes the value of the whole business, debt included.', piucassa: 'In the EV you added the cash: it must be subtracted.', senzacassa: 'In the EV you forgot to subtract the cash.' }
      }
    },
    margsic: {
      liv: 2, tema: 'valutare', forma: 'pct', lab: 'multipli',
      par: R => { const V = scegli(R, [10, 12, 15, 20, 25, 30, 40, 50, 60, 80, 100, 120]), m = scegli(R, [10, 12.5, 15, 20, 25, 30, 35, 40]), P = V * (100 - m) / 100; return intero(P * 100) ? { V, P: giro(P, 2) } : null; },
      ok: p => (p.V - p.P) / p.V * 100,
      err: { suprezzo: p => (p.V - p.P) / p.P * 100, rapporto: p => p.P / p.V * 100, diff: p => p.V - p.P },
      it: {
        q: (p, W) => `Stimi che un'azione valga ${W.soldi(p.V)}. In Borsa costa ${W.soldi(p.P)}. Quanto vale il margine di sicurezza, in percentuale del valore stimato?`,
        exp: (p, W, ok) => `Il **margine di sicurezza** è la distanza tra il valore stimato e il prezzo, misurata sul valore stimato.\n\n$$M = \\frac{V - P}{V}$$\n\n\\(V\\) = valore stimato, \\(P\\) = prezzo.\n\n$$M = \\frac{${W.fs(p.V)} - ${W.fs(p.P)}}{${W.fs(p.V)}} = ${W.f(W.pct(ok))}$$`,
        err: { suprezzo: 'Hai diviso per il prezzo: il margine si misura sul valore stimato.', rapporto: 'Questo è il prezzo in percentuale del valore: il margine è quello che manca per arrivare a 100.', diff: 'Questa è la distanza in valuta: va divisa per il valore stimato.' }
      },
      en: {
        q: (p, W) => `You estimate that a stock is worth ${W.soldi(p.V)}. On the stock market it costs ${W.soldi(p.P)}. What is the margin of safety, as a percentage of the estimated value?`,
        exp: (p, W, ok) => `The **margin of safety** is the gap between the estimated value and the price, measured on the estimated value.\n\n$$M = \\frac{V - P}{V}$$\n\n\\(V\\) = estimated value, \\(P\\) = price.\n\n$$M = \\frac{${W.fs(p.V)} - ${W.fs(p.P)}}{${W.fs(p.V)}} = ${W.f(W.pct(ok))}$$`,
        err: { suprezzo: 'You divided by the price: the margin is measured on the estimated value.', rapporto: 'This is the price as a percentage of the value: the margin is what is missing to reach 100.', diff: 'This is the gap in money: it must be divided by the estimated value.' }
      }
    },
    // ---- ancora laboratorio «multipli»: i conti nati con la seconda stesura del capitolo (utile diluito, P/E atteso, cassa, valore d'impresa completo) ----
    epsdil: {
      liv: 3, tema: 'valutare', forma: 'euro2', lab: 'multipli',
      par: R => { const Pm = scegli(R, [10, 12, 15, 20, 24, 30, 40]), fr = scegli(R, [[1, 2], [2, 3], [3, 4], [1, 3], [3, 5], [4, 5]]), K = Pm * fr[0] / fr[1], n = scegli(R, [1, 2, 3, 4, 5, 6]), N = scegli(R, [8, 9, 10, 12, 14, 15, 18, 19, 20, 24]);
        const E = scegli(R, [0.5, 0.6, 0.75, 0.8, 1, 1.2, 1.25, 1.5, 2, 2.5, 3]), ric = n * K / Pm, net = n - ric, U = E * (N + net);
        return intero(K) && intero(ric * 2) && net / N >= 0.06 && net / N <= 0.25 && intero(U * 10) ? { U: giro(U, 1), N, n, K, Pm } : null; },
      ok: p => p.U / (p.N + p.n - p.n * p.K / p.Pm),
      err: { base: p => p.U / p.N, tutte: p => p.U / (p.N + p.n), ricompra: p => p.U / (p.N + p.n * p.K / p.Pm) },
      it: {
        q: (p, W) => `Un'azienda ha un utile netto di ${W.n(p.U, 1)} milioni e ${W.n(p.N)} milioni di azioni. I dirigenti hanno ${W.n(p.n)} ${p.n === 1 ? 'milione' : 'milioni'} di opzioni, ciascuna per comprare un'azione a ${W.soldi(p.K)}. Nell'anno l'azione è costata in media ${W.soldi(p.Pm)}. Quanto vale l'utile per azione diluito?`,
        exp: (p, W, ok) => { const inc = p.n * p.K, ric = inc / p.Pm, net = p.n - ric;
          return `Chi usa le opzioni paga le azioni nuove, e con quei soldi l'azienda può ricomprarne una parte: contano solo le **azioni in più**.\n\n• Incasso: \\(${W.fn(p.n)} \\times ${W.fs(p.K)} = ${W.fn(inc, 1)}\\) milioni.\n• Azioni ricomprate a ${W.soldi(p.Pm)}: \\(\\dfrac{${W.fn(inc, 1)}}{${W.fs(p.Pm)}} = ${W.fn(ric, 1)}\\) milioni.\n• Azioni in più: \\(${W.fn(p.n)} - ${W.fn(ric, 1)} = ${W.fn(net, 1)}\\) milioni.\n\n$$\\text{EPS diluito} = \\frac{U}{N + \\text{azioni in più}} = \\frac{${W.fn(p.U, 1)}}{${W.fn(p.N)} + ${W.fn(net, 1)}} = ${W.fs(ok)}$$\n\n\\(U\\) = utile netto, \\(N\\) = azioni di oggi.`; },
        err: { base: 'Questo è l\'utile per azione base: non hai contato le azioni che nascerebbero dalle opzioni.', tutte: 'Hai aggiunto tutte le azioni delle opzioni: con i soldi incassati l\'azienda ne ricompra una parte, e conta solo la differenza.', ricompra: 'Hai aggiunto le azioni ricomprate: quelle in più sono le opzioni meno le azioni ricomprate.' }
      },
      en: {
        q: (p, W) => `A company has net income of ${W.n(p.U, 1)} million and ${W.n(p.N)} million shares. Its managers hold ${W.n(p.n)} million stock options, each to buy one share at ${W.soldi(p.K)}. During the year the stock traded at an average of ${W.soldi(p.Pm)}. What are diluted earnings per share?`,
        exp: (p, W, ok) => { const inc = p.n * p.K, ric = inc / p.Pm, net = p.n - ric;
          return `Whoever exercises the options pays for the new shares, and with that money the company can buy some back: only the **extra shares** count.\n\n• Proceeds: \\(${W.fn(p.n)} \\times ${W.fs(p.K)} = ${W.fn(inc, 1)}\\) million.\n• Shares bought back at ${W.soldi(p.Pm)}: \\(\\dfrac{${W.fn(inc, 1)}}{${W.fs(p.Pm)}} = ${W.fn(ric, 1)}\\) million.\n• Extra shares: \\(${W.fn(p.n)} - ${W.fn(ric, 1)} = ${W.fn(net, 1)}\\) million.\n\n$$\\text{Diluted EPS} = \\frac{U}{N + \\text{extra shares}} = \\frac{${W.fn(p.U, 1)}}{${W.fn(p.N)} + ${W.fn(net, 1)}} = ${W.fs(ok)}$$\n\n\\(U\\) = net income, \\(N\\) = shares today.`; },
        err: { base: 'This is basic earnings per share: you did not count the shares the options would create.', tutte: 'You added all the option shares: with the proceeds the company buys some back, and only the difference counts.', ricompra: 'You added the shares bought back: the extra shares are the options minus the shares bought back.' }
      }
    },
    peatt: {
      liv: 3, tema: 'valutare', forma: 'volte', lab: 'multipli',
      par: R => { const E = scegli(R, [0.5, 0.8, 1, 1.2, 1.5, 2, 2.5, 4]), g = scegli(R, [10, 20, 25, 50]), m = scegli(R, [8, 10, 12, 15, 16, 20, 24, 25, 30]), P = m * E * (1 + g / 100); return intero(P * 100) && intero(E * (1 + g / 100) * 100) ? { P: giro(P, 2), E, g } : null; },
      ok: p => p.P / (p.E * (1 + p.g / 100)),
      err: { passato: p => p.P / p.E, utile: p => p.E * (1 + p.g / 100), doppio: p => p.P / p.E * (1 + p.g / 100) },
      it: {
        q: (p, W) => `Un'azione costa ${W.soldi(p.P)}. Negli ultimi dodici mesi l'utile per azione è stato ${W.soldi(p.E)}. Per i prossimi dodici mesi gli analisti si aspettano una crescita ${W.delp(p.g)}. Quanto vale il P/E atteso?`,
        exp: (p, W, ok) => `Il **P/E atteso** usa l'utile previsto per i prossimi dodici mesi.\n\n$$\\text{EPS atteso} = ${W.fs(p.E)} \\times ${W.fn(1 + p.g / 100, 2)} = ${W.fs(p.E * (1 + p.g / 100))}$$\n\n$$\\text{P/E atteso} = \\frac{P}{\\text{EPS atteso}} = \\frac{${W.fs(p.P)}}{${W.fs(p.E * (1 + p.g / 100))}} = ${W.fn(ok, 1)}$$\n\n\\(P\\) = prezzo di un'azione. Il P/E passato è ${W.n(p.P / p.E, 1)}: con gli utili in crescita, quello atteso è sempre più basso.`,
        err: { passato: 'Questo è il P/E passato: hai usato l\'utile degli ultimi dodici mesi, senza farlo crescere.', utile: 'Questo è l\'utile per azione atteso: è il primo passo, poi va messo sotto il prezzo.', doppio: 'Hai moltiplicato il P/E passato per la crescita: va diviso, perché l\'utile atteso sta sotto.' }
      },
      en: {
        q: (p, W) => `A share costs ${W.soldi(p.P)}. Over the last twelve months earnings per share were ${W.soldi(p.E)}. For the next twelve months analysts expect growth of ${W.pct(p.g)}. What is the forward P/E?`,
        exp: (p, W, ok) => `The **forward P/E** uses the earnings expected for the next twelve months.\n\n$$\\text{Expected EPS} = ${W.fs(p.E)} \\times ${W.fn(1 + p.g / 100, 2)} = ${W.fs(p.E * (1 + p.g / 100))}$$\n\n$$\\text{Forward P/E} = \\frac{P}{\\text{Expected EPS}} = \\frac{${W.fs(p.P)}}{${W.fs(p.E * (1 + p.g / 100))}} = ${W.fn(ok, 1)}$$\n\n\\(P\\) = price of one share. The trailing P/E is ${W.n(p.P / p.E, 1)}: with growing earnings, the forward one is always lower.`,
        err: { passato: 'This is the trailing P/E: you used the earnings of the last twelve months, without growing them.', utile: 'This is the expected earnings per share: it is the first step, then it goes under the price.', doppio: 'You multiplied the trailing P/E by the growth: it must be divided, because expected earnings go underneath.' }
      }
    },
    pcf: {
      liv: 3, tema: 'valutare', forma: 'volte', lab: 'multipli',
      par: R => { const CF = scegli(R, [10, 12, 15, 20, 25, 30, 40, 50]), m = scegli(R, [5, 6, 8, 10, 12, 12.5, 15, 16, 18, 20]), A = scegli(R, [3, 4, 5, 6, 8, 10, 12, 15]), Wk = scegli(R, [1, 2, 3, 4, 5, 6]), U = CF - A + Wk;
        return intero(m * CF) && U >= 4 && Wk / CF >= 0.1 && (A - Wk) / CF >= 0.1 ? { cap: giro(m * CF), U, A, Wk } : null; },
      ok: p => p.cap / (p.U + p.A - p.Wk),
      err: { pe: p => p.cap / p.U, rapido: p => p.cap / (p.U + p.A), storto: p => p.cap / (p.U + p.A + p.Wk) },
      it: {
        q: (p, W) => `Un'azienda vale in Borsa ${W.n(p.cap)} milioni. Ha un utile netto di ${W.n(p.U)} milioni e ammortamenti per ${W.n(p.A)} milioni. Nell'anno magazzino e crediti sono aumentati di ${W.n(p.Wk)} ${p.Wk === 1 ? 'milione' : 'milioni'}. Quanto vale il P/CF, calcolato sul flusso di cassa operativo?`,
        exp: (p, W, ok) => `Prima il **flusso di cassa operativo**: all'utile si riaggiungono gli ammortamenti e si tolgono i soldi rimasti fermi in più.\n\n$$CF = U + \\text{ammortamenti} - \\text{soldi fermi} = ${W.fn(p.U)} + ${W.fn(p.A)} - ${W.fn(p.Wk)} = ${W.fn(p.U + p.A - p.Wk)}$$\n\n$$\\text{P/CF} = \\frac{\\text{Cap}}{CF} = \\frac{${W.fn(p.cap)}}{${W.fn(p.U + p.A - p.Wk)}} = ${W.fn(ok, 1)}$$\n\n\\(U\\) = utile netto, \\(\\text{Cap}\\) = capitalizzazione.`,
        err: { pe: 'Questo è il P/E: sotto hai messo l\'utile netto, non il flusso di cassa.', rapido: 'Hai usato utile più ammortamenti: mancano i soldi rimasti fermi in magazzino e crediti, che vanno tolti.', storto: 'Hai aggiunto l\'aumento di magazzino e crediti: sono soldi rimasti fermi, vanno tolti.' }
      },
      en: {
        q: (p, W) => `A company is worth ${W.n(p.cap)} million on the stock market. It has net income of ${W.n(p.U)} million and depreciation of ${W.n(p.A)} million. During the year inventory and receivables grew by ${W.n(p.Wk)} million. What is the P/CF, based on cash flow from operations?`,
        exp: (p, W, ok) => `First the **cash flow from operations**: add depreciation back to net income and subtract the extra money tied up.\n\n$$CF = U + \\text{depreciation} - \\text{money tied up} = ${W.fn(p.U)} + ${W.fn(p.A)} - ${W.fn(p.Wk)} = ${W.fn(p.U + p.A - p.Wk)}$$\n\n$$\\text{P/CF} = \\frac{\\text{Cap}}{CF} = \\frac{${W.fn(p.cap)}}{${W.fn(p.U + p.A - p.Wk)}} = ${W.fn(ok, 1)}$$\n\n\\(U\\) = net income, \\(\\text{Cap}\\) = market capitalization.`,
        err: { pe: 'This is the P/E: you put net income underneath, not cash flow.', rapido: 'You used net income plus depreciation: the extra money tied up in inventory and receivables is missing, and it must be subtracted.', storto: 'You added the increase in inventory and receivables: that money is tied up, so it must be subtracted.' }
      }
    },
    fcfe: {
      liv: 2, tema: 'valutare', forma: 'mln', lab: 'multipli',
      par: R => { const CF = scegli(R, [40, 50, 60, 80, 100, 120, 150, 200]), I = scegli(R, [20, 30, 40, 50, 60, 80, 100]), dD = scegli(R, [10, 15, 20, 25, 30]); return CF - I >= 15 && I >= 2 * dD ? { CF, I, dD } : null; },
      ok: p => p.CF - p.I + p.dD,
      err: { senza: p => p.CF - p.I, meno: p => p.CF - p.I - p.dD, storto: p => p.CF + p.I - p.dD },
      it: {
        q: (p, W) => `In un anno l'attività di un'azienda produce ${W.n(p.CF)} milioni di cassa. L'azienda investe ${W.n(p.I)} milioni in impianti nuovi e prende ${W.n(p.dD)} milioni di debiti in più. Quanto vale il flusso di cassa per i soci?`,
        exp: (p, W, ok) => `Il **flusso di cassa per i soci** è la cassa che resta dopo gli investimenti, contando anche i debiti nuovi.\n\n$$\\text{FCFE} = CF - I + \\Delta D$$\n\n\\(CF\\) = flusso di cassa operativo, \\(I\\) = investimenti, \\(\\Delta D\\) = debiti nuovi.\n\n$$\\text{FCFE} = ${W.fn(p.CF)} - ${W.fn(p.I)} + ${W.fn(p.dD)} = ${W.fn(ok)}$$\n\nAi soci restano **${W.n(ok)} milioni**.`,
        err: { senza: 'Hai dimenticato i debiti nuovi: sono soldi entrati in cassa, e vanno aggiunti.', meno: 'Hai tolto i debiti nuovi: portano cassa, quindi vanno aggiunti.', storto: 'Hai aggiunto gli investimenti e tolto i debiti: è il contrario.' }
      },
      en: {
        q: (p, W) => `In one year a company's operations generate ${W.n(p.CF)} million of cash. The company invests ${W.n(p.I)} million in new plant and takes on ${W.n(p.dD)} million of additional debt. What is its free cash flow to equity?`,
        exp: (p, W, ok) => `**Free cash flow to equity** is the cash left after investment, counting new borrowing too.\n\n$$\\text{FCFE} = CF - I + \\Delta D$$\n\n\\(CF\\) = cash flow from operations, \\(I\\) = investment, \\(\\Delta D\\) = new debt.\n\n$$\\text{FCFE} = ${W.fn(p.CF)} - ${W.fn(p.I)} + ${W.fn(p.dD)} = ${W.fn(ok)}$$\n\n**${W.n(ok)} million** is left for shareholders.`,
        err: { senza: 'You forgot the new debt: it is cash coming in, so it must be added.', meno: 'You subtracted the new debt: it brings in cash, so it must be added.', storto: 'You added the investment and subtracted the debt: it is the other way around.' }
      }
    },
    evpieno: {
      liv: 3, tema: 'valutare', forma: 'mln', lab: 'multipli',
      par: R => ({ cap: scegli(R, [300, 400, 500, 600, 800]), D: scegli(R, [100, 120, 150, 200, 250]), Pr: scegli(R, [30, 40, 50, 60]), Tz: scegli(R, [30, 40, 50, 60, 80]), C: scegli(R, [40, 50, 60, 80, 100]) }),
      ok: p => p.cap + p.D + p.Pr + p.Tz - p.C,
      err: { corto: p => p.cap + p.D - p.C, piucassa: p => p.cap + p.D + p.Pr + p.Tz + p.C, tolti: p => p.cap + p.D - p.Pr - p.Tz - p.C },
      it: {
        q: (p, W) => `Un gruppo vale in Borsa ${W.n(p.cap)} milioni. Ha debiti finanziari per ${W.n(p.D)} milioni, azioni privilegiate per ${W.n(p.Pr)} milioni, quote di terzi per ${W.n(p.Tz)} milioni e ${W.n(p.C)} milioni in cassa. Quanto vale il suo valore d'impresa (EV)?`,
        exp: (p, W, ok) => `Nell'EV entra tutto quello che spetta a qualcuno prima dei soci ordinari; si toglie solo la cassa.\n\n$$\\text{EV} = \\text{Cap} + D + \\text{Priv} + \\text{Terzi} - C$$\n\n\\(\\text{Cap}\\) = capitalizzazione, \\(D\\) = debiti finanziari, \\(\\text{Priv}\\) = azioni privilegiate, \\(\\text{Terzi}\\) = quote di terzi, \\(C\\) = cassa.\n\n$$\\text{EV} = ${W.fn(p.cap)} + ${W.fn(p.D)} + ${W.fn(p.Pr)} + ${W.fn(p.Tz)} - ${W.fn(p.C)} = ${W.fn(ok)}$$\n\nL'EV è **${W.n(ok)} milioni**.`,
        err: { corto: 'Hai dimenticato azioni privilegiate e quote di terzi: vanno aggiunte, come i debiti.', piucassa: 'Hai aggiunto anche la cassa: la cassa si toglie.', tolti: 'Hai tolto azioni privilegiate e quote di terzi: vanno aggiunte.' }
      },
      en: {
        q: (p, W) => `A group is worth ${W.n(p.cap)} million on the stock market. It has ${W.n(p.D)} million of financial debt, ${W.n(p.Pr)} million of preferred stock, ${W.n(p.Tz)} million of noncontrolling interests and ${W.n(p.C)} million in cash. What is its enterprise value (EV)?`,
        exp: (p, W, ok) => `EV includes everything owed to someone ahead of common shareholders; only cash is subtracted.\n\n$$\\text{EV} = \\text{Cap} + D + \\text{Pref} + \\text{NCI} - C$$\n\n\\(\\text{Cap}\\) = market capitalization, \\(D\\) = financial debt, \\(\\text{Pref}\\) = preferred stock, \\(\\text{NCI}\\) = noncontrolling interests, \\(C\\) = cash.\n\n$$\\text{EV} = ${W.fn(p.cap)} + ${W.fn(p.D)} + ${W.fn(p.Pr)} + ${W.fn(p.Tz)} - ${W.fn(p.C)} = ${W.fn(ok)}$$\n\nThe EV is **${W.n(ok)} million**.`,
        err: { corto: 'You forgot preferred stock and noncontrolling interests: they are added, like debt.', piucassa: 'You added the cash too: cash is subtracted.', tolti: 'You subtracted preferred stock and noncontrolling interests: they must be added.' }
      }
    },
    evebitda: {
      liv: 3, tema: 'valutare', forma: 'volte', lab: 'multipli',
      par: R => { const B = scegli(R, [20, 25, 30, 40, 50, 60, 80]), A = scegli(R, [5, 8, 10, 12, 15, 20]), m = scegli(R, [5, 6, 7, 8, 9, 10, 12]), D = scegli(R, [40, 60, 80, 100, 150]), C = scegli(R, [10, 20, 30, 40]), cap = m * B - D + C;
        return A <= B / 2 && A >= B / 6 && cap >= 60 ? { cap, D, C, E: B - A, A } : null; },
      ok: p => (p.cap + p.D - p.C) / (p.E + p.A),
      err: { ebit: p => (p.cap + p.D - p.C) / p.E, cap: p => p.cap / (p.E + p.A), meno: p => (p.cap + p.D - p.C) / (p.E - p.A) },
      it: {
        q: (p, W) => `Un'azienda vale in Borsa ${W.n(p.cap)} milioni, ha debiti finanziari per ${W.n(p.D)} milioni e ${W.n(p.C)} milioni in cassa. Il suo risultato operativo è ${W.n(p.E)} milioni e gli ammortamenti sono ${W.n(p.A)} milioni. Quanto vale il suo EV/EBITDA?`,
        exp: (p, W, ok) => `Sopra il valore d'impresa, sotto l'EBITDA: il risultato operativo a cui si riaggiungono gli ammortamenti.\n\n$$\\text{EV} = \\text{Cap} + D - C = ${W.fn(p.cap)} + ${W.fn(p.D)} - ${W.fn(p.C)} = ${W.fn(p.cap + p.D - p.C)}$$\n\n$$\\text{EBITDA} = \\text{EBIT} + \\text{ammortamenti} = ${W.fn(p.E)} + ${W.fn(p.A)} = ${W.fn(p.E + p.A)}$$\n\n$$\\frac{\\text{EV}}{\\text{EBITDA}} = \\frac{${W.fn(p.cap + p.D - p.C)}}{${W.fn(p.E + p.A)}} = ${W.fn(ok, 1)}$$\n\n\\(\\text{Cap}\\) = capitalizzazione, \\(D\\) = debiti finanziari, \\(C\\) = cassa, \\(\\text{EBIT}\\) = risultato operativo.`,
        err: { ebit: 'Hai diviso per il solo risultato operativo: questo è EV/EBIT. Per l\'EBITDA vanno riaggiunti gli ammortamenti.', cap: 'Hai messo sopra la capitalizzazione: con l\'EBITDA va il valore di tutta l\'attività, debiti compresi.', meno: 'Hai tolto gli ammortamenti dal risultato operativo: per arrivare all\'EBITDA vanno aggiunti.' }
      },
      en: {
        q: (p, W) => `A company is worth ${W.n(p.cap)} million on the stock market, has ${W.n(p.D)} million of financial debt and ${W.n(p.C)} million in cash. Its operating income is ${W.n(p.E)} million and depreciation is ${W.n(p.A)} million. What is its EV/EBITDA?`,
        exp: (p, W, ok) => `Enterprise value on top, EBITDA underneath: operating income with depreciation added back.\n\n$$\\text{EV} = \\text{Cap} + D - C = ${W.fn(p.cap)} + ${W.fn(p.D)} - ${W.fn(p.C)} = ${W.fn(p.cap + p.D - p.C)}$$\n\n$$\\text{EBITDA} = \\text{EBIT} + \\text{depreciation} = ${W.fn(p.E)} + ${W.fn(p.A)} = ${W.fn(p.E + p.A)}$$\n\n$$\\frac{\\text{EV}}{\\text{EBITDA}} = \\frac{${W.fn(p.cap + p.D - p.C)}}{${W.fn(p.E + p.A)}} = ${W.fn(ok, 1)}$$\n\n\\(\\text{Cap}\\) = market capitalization, \\(D\\) = financial debt, \\(C\\) = cash, \\(\\text{EBIT}\\) = operating income.`,
        err: { ebit: 'You divided by operating income alone: this is EV/EBIT. For EBITDA, depreciation must be added back.', cap: 'You put market capitalization on top: EBITDA goes with the value of the whole business, debt included.', meno: 'You subtracted depreciation from operating income: to get EBITDA it must be added.' }
      }
    },
    evprezzo: {
      liv: 3, tema: 'valutare', forma: 'euro2', lab: 'multipli',
      par: R => { const m = scegli(R, [6, 7, 8, 9, 10, 12]), B = scegli(R, [20, 25, 30, 40, 50, 60, 80]), D = scegli(R, [40, 60, 80, 100, 120, 150]), C = scegli(R, [10, 20, 30, 40]), N = scegli(R, [5, 8, 10, 20, 25, 40, 50]), eq = m * B - D + C, V = eq / N;
        return eq >= 60 && (D - C) / (m * B) >= 0.12 && intero(V * 100) ? { m, B, D, C, N } : null; },
      ok: p => (p.m * p.B - p.D + p.C) / p.N,
      err: { lordo: p => p.m * p.B / p.N, piu: p => (p.m * p.B + p.D - p.C) / p.N, senzacassa: p => (p.m * p.B - p.D) / p.N },
      it: {
        q: (p, W) => `Le aziende simili valgono in media ${W.n(p.m)} volte l'EBITDA. L'azienda da valutare ha un EBITDA di ${W.n(p.B)} milioni, debiti finanziari per ${W.n(p.D)} milioni, ${W.n(p.C)} milioni in cassa e ${W.n(p.N)} milioni di azioni. Con il metodo dei simili, quanto vale una sua azione?`,
        exp: (p, W, ok) => `Dal multiplo si arriva al valore di tutta l'attività; poi si toglie il debito netto e si divide per le azioni.\n\n$$\\text{EV} = ${W.fn(p.m)} \\times ${W.fn(p.B)} = ${W.fn(p.m * p.B)}$$\n\n$$\\text{Valore per i soci} = \\text{EV} - (D - C) = ${W.fn(p.m * p.B)} - ${W.fn(p.D - p.C)} = ${W.fn(p.m * p.B - p.D + p.C)}$$\n\n$$V = \\frac{${W.fn(p.m * p.B - p.D + p.C)}}{${W.fn(p.N)}} = ${W.fs(ok)}$$\n\n\\(D\\) = debiti finanziari, \\(C\\) = cassa. Un'azione vale **${W.soldi(ok)}**.`,
        err: { lordo: 'Hai diviso per le azioni il valore di tutta l\'attività: prima va tolto il debito netto, che spetta ai creditori.', piu: 'Hai aggiunto il debito netto: va tolto, perché si passa dal valore dell\'attività a quello dei soci.', senzacassa: 'Hai tolto i debiti ma non hai riaggiunto la cassa: si toglie il debito netto, cioè debiti meno cassa.' }
      },
      en: {
        q: (p, W) => `Similar companies are worth on average ${W.n(p.m)} times EBITDA. The company you are valuing has EBITDA of ${W.n(p.B)} million, ${W.n(p.D)} million of financial debt, ${W.n(p.C)} million in cash and ${W.n(p.N)} million shares. Using comparables, what is one of its shares worth?`,
        exp: (p, W, ok) => `The multiple gives the value of the whole business; then subtract net debt and divide by the number of shares.\n\n$$\\text{EV} = ${W.fn(p.m)} \\times ${W.fn(p.B)} = ${W.fn(p.m * p.B)}$$\n\n$$\\text{Equity value} = \\text{EV} - (D - C) = ${W.fn(p.m * p.B)} - ${W.fn(p.D - p.C)} = ${W.fn(p.m * p.B - p.D + p.C)}$$\n\n$$V = \\frac{${W.fn(p.m * p.B - p.D + p.C)}}{${W.fn(p.N)}} = ${W.fs(ok)}$$\n\n\\(D\\) = financial debt, \\(C\\) = cash. One share is worth **${W.soldi(ok)}**.`,
        err: { lordo: 'You divided the value of the whole business by the shares: first subtract net debt, which belongs to lenders.', piu: 'You added net debt: it must be subtracted, because you are going from the value of the business to the value for shareholders.', senzacassa: 'You subtracted the debt but did not add back the cash: what is subtracted is net debt, debt minus cash.' }
      }
    },
    // =====================================================================================================
    // LABORATORIO «flussi» (materia Azioni, capitolo «Costa tanto o poco?», parte «I soldi che arriveranno»): dividendi scontati,
    // crescita costante, rendimento offerto da un prezzo, crescita sostenibile, P/E giusto, azioni privilegiate, due fasi.
    // =====================================================================================================
    unanno: {
      liv: 2, tema: 'valutare', forma: 'euro2', lab: 'flussi',
      par: R => { const r = scegli(R, [8, 10, 12, 20, 25]), V = scegli(R, [10, 12, 15, 20, 25, 30, 40, 50]), D1 = scegli(R, [0.5, 0.6, 0.8, 1, 1.2, 1.5, 2, 2.5, 3]), P1 = V * (1 + r / 100) - D1;
        return intero(P1 * 100) && D1 / V <= 0.08 ? { D1, P1: giro(P1, 2), r } : null; },
      ok: p => (p.D1 + p.P1) / (1 + p.r / 100),
      err: { senza: p => p.D1 + p.P1, per: p => (p.D1 + p.P1) * (1 + p.r / 100), meno: p => (p.D1 + p.P1) * (1 - p.r / 100), solop: p => p.P1 / (1 + p.r / 100) },
      it: {
        q: (p, W) => `Tra un anno un'azione pagherà un dividendo di ${W.soldi(p.D1)} e pensi di rivenderla a ${W.soldi(p.P1)}. Chiedi un rendimento ${W.delp(p.r)}. Quanto vale oggi l'azione per te?`,
        exp: (p, W, ok) => `Quello che incasserai tra un anno si riporta a oggi dividendo per uno più il rendimento che chiedi.\n\n$$V = \\frac{\\text{Div}_1 + P_1}{1 + r}$$\n\n\\(\\text{Div}_1\\) = dividendo tra un anno, \\(P_1\\) = prezzo tra un anno, \\(r\\) = rendimento richiesto.\n\n$$V = \\frac{${W.fs(p.D1)} + ${W.fs(p.P1)}}{${W.fn(1 + p.r / 100, 2, true)}} = ${W.fs(ok)}$$\n\nPer te l'azione vale oggi **${W.soldi(ok)}**.`,
        err: { senza: 'Questo è quello che incasserai tra un anno: per portarlo a oggi va diviso per uno più il rendimento richiesto.', per: 'Hai moltiplicato per uno più il rendimento: così porti la cifra ancora più avanti nel tempo. Per tornare a oggi si divide.', meno: 'Hai tolto il rendimento in percentuale: per scontare si divide per uno più il rendimento, non si toglie la percentuale.', solop: 'Hai scontato solo il prezzo di rivendita: tra un anno incassi anche il dividendo.' }
      },
      en: {
        q: (p, W) => `A year from now a stock will pay a dividend of ${W.soldi(p.D1)} and you expect to sell it for ${W.soldi(p.P1)}. You require a return of ${W.pct(p.r)}. What is the stock worth to you today?`,
        exp: (p, W, ok) => `What you will collect in a year is brought back to today by dividing by one plus the return you require.\n\n$$V = \\frac{\\text{Div}_1 + P_1}{1 + r}$$\n\n\\(\\text{Div}_1\\) = dividend in one year, \\(P_1\\) = price in one year, \\(r\\) = required return.\n\n$$V = \\frac{${W.fs(p.D1)} + ${W.fs(p.P1)}}{${W.fn(1 + p.r / 100, 2, true)}} = ${W.fs(ok)}$$\n\nTo you the stock is worth **${W.soldi(ok)}** today.`,
        err: { senza: 'This is what you will collect in a year: to bring it back to today, divide by one plus the required return.', per: 'You multiplied by one plus the return: that pushes the amount even further into the future. To come back to today, divide.', meno: 'You took the return off as a percentage: to discount you divide by one plus the return, you do not subtract the percentage.', solop: 'You discounted only the sale price: in a year you collect the dividend too.' }
      }
    },
    dueanni: {
      liv: 3, tema: 'valutare', forma: 'euro2', lab: 'flussi',
      par: R => { const r = scegli(R, [10, 20]), k = 1 + r / 100, a = scegli(R, [0.5, 1, 1.5, 2]), b = scegli(R, [10, 12, 15, 20, 24, 25, 30, 40]), D1 = a * k, D2 = scegli(R, [0.6, 0.72, 1.1, 1.2, 1.21, 1.44, 1.8, 2.2, 2.4]), P2 = b * k * k - D2;
        return intero(P2 * 100) && D2 >= D1 && D2 <= 1.5 * D1 ? { D1: giro(D1, 2), D2, P2: giro(P2, 2), r } : null; },
      ok: p => p.D1 / (1 + p.r / 100) + (p.D2 + p.P2) / Math.pow(1 + p.r / 100, 2),
      err: { unsolo: p => (p.D1 + p.D2 + p.P2) / (1 + p.r / 100), senza: p => p.D1 + p.D2 + p.P2, semplice: p => p.D1 / (1 + p.r / 100) + (p.D2 + p.P2) / (1 + 2 * p.r / 100) },
      it: {
        q: (p, W) => `Un'azione pagherà un dividendo di ${W.soldi(p.D1)} tra un anno e di ${W.soldi(p.D2)} tra due anni. Tra due anni pensi di rivenderla a ${W.soldi(p.P2)}. Chiedi un rendimento ${W.delp(p.r)}. Quanto vale oggi l'azione per te?`,
        exp: (p, W, ok) => { const k = 1 + p.r / 100, a = p.D1 / k, b = (p.D2 + p.P2) / (k * k);
          return `Ogni cifra si sconta per gli anni che mancano: una volta il primo dividendo, due volte il secondo e il prezzo di rivendita.\n\n$$V = \\frac{\\text{Div}_1}{1 + r} + \\frac{\\text{Div}_2 + P_2}{(1 + r)^2}$$\n\n\\(\\text{Div}_1\\), \\(\\text{Div}_2\\) = dividendi tra uno e due anni, \\(P_2\\) = prezzo tra due anni, \\(r\\) = rendimento richiesto.\n\n$$V = \\frac{${W.fs(p.D1)}}{${W.fn(k, 2, true)}} + \\frac{${W.fs(p.D2)} + ${W.fs(p.P2)}}{${W.fn(k * k, 2, true)}} = ${W.fs(a)} + ${W.fs(b)} = ${W.fs(ok)}$$\n\nPer te l'azione vale oggi **${W.soldi(ok)}**.`; },
        err: { unsolo: 'Hai scontato tutto per un anno solo: il secondo dividendo e il prezzo di rivendita arrivano tra due anni.', senza: 'Hai sommato le cifre senza scontarle: i soldi futuri valgono meno di quelli di oggi.', semplice: 'Per due anni hai diviso per uno più due volte il tasso: si divide per uno più il tasso, al quadrato.' }
      },
      en: {
        q: (p, W) => `A stock will pay a dividend of ${W.soldi(p.D1)} in one year and ${W.soldi(p.D2)} in two years. In two years you expect to sell it for ${W.soldi(p.P2)}. You require a return of ${W.pct(p.r)}. What is the stock worth to you today?`,
        exp: (p, W, ok) => { const k = 1 + p.r / 100, a = p.D1 / k, b = (p.D2 + p.P2) / (k * k);
          return `Each amount is discounted for the years left: once for the first dividend, twice for the second dividend and the sale price.\n\n$$V = \\frac{\\text{Div}_1}{1 + r} + \\frac{\\text{Div}_2 + P_2}{(1 + r)^2}$$\n\n\\(\\text{Div}_1\\), \\(\\text{Div}_2\\) = dividends in one and two years, \\(P_2\\) = price in two years, \\(r\\) = required return.\n\n$$V = \\frac{${W.fs(p.D1)}}{${W.fn(k, 2, true)}} + \\frac{${W.fs(p.D2)} + ${W.fs(p.P2)}}{${W.fn(k * k, 2, true)}} = ${W.fs(a)} + ${W.fs(b)} = ${W.fs(ok)}$$\n\nTo you the stock is worth **${W.soldi(ok)}** today.`; },
        err: { unsolo: 'You discounted everything for one year only: the second dividend and the sale price arrive in two years.', senza: 'You added the amounts without discounting them: future money is worth less than money today.', semplice: 'For two years you divided by one plus twice the rate: divide by one plus the rate, squared.' }
      }
    },
    gordon: {
      liv: 2, tema: 'valutare', forma: 'euro2f', lab: 'flussi',
      par: R => { const r = scegli(R, [7, 8, 9, 10, 11, 12]), g = scegli(R, [1, 2, 3, 4, 5, 6]), V = scegli(R, [10, 12, 15, 16, 20, 24, 25, 30, 40, 50, 60]), D1 = V * (r - g) / 100;
        return r - g >= 2 && r - g <= 8 && intero(D1 * 100) && D1 >= 0.3 ? { D1: giro(D1, 2), r, g } : null; },
      ok: p => p.D1 / ((p.r - p.g) / 100),
      err: { senzag: p => p.D1 / (p.r / 100), somma: p => p.D1 / ((p.r + p.g) / 100), piug: p => p.D1 * (1 + p.g / 100) / ((p.r - p.g) / 100) },
      it: {
        q: (p, W) => `Un'azione pagherà l'anno prossimo un dividendo di ${W.soldi(p.D1)}. Ti aspetti che il dividendo cresca ${W.delp(p.g)} l'anno per sempre, e chiedi un rendimento ${W.delp(p.r)}. Quanto vale l'azione?`,
        exp: (p, W, ok) => `Con un dividendo che cresce per sempre allo stesso ritmo si usa il **modello di Gordon**.\n\n$$V = \\frac{\\text{Div}_1}{r - g}$$\n\n\\(\\text{Div}_1\\) = dividendo del prossimo anno, \\(r\\) = rendimento richiesto, \\(g\\) = crescita.\n\n$$V = \\frac{${W.fs(p.D1)}}{${p.r}\\% - ${p.g}\\%} = \\frac{${W.fs(p.D1)}}{${W.fn((p.r - p.g) / 100, 2, true)}} = ${W.fs(ok)}$$\n\nL'azione vale **${W.soldi(ok)}**.`,
        err: { senzag: 'Hai diviso per il solo rendimento richiesto: è il valore di un dividendo che non cresce mai. Sotto va la differenza tra rendimento richiesto e crescita.', somma: 'Hai sommato rendimento richiesto e crescita: la crescita va tolta.', piug: 'Hai fatto crescere un dividendo che era già quello del prossimo anno: sopra va così com\'è.' }
      },
      en: {
        q: (p, W) => `A stock will pay a dividend of ${W.soldi(p.D1)} next year. You expect the dividend to grow ${W.pct(p.g)} a year forever, and you require a return of ${W.pct(p.r)}. What is the stock worth?`,
        exp: (p, W, ok) => `For a dividend that grows forever at the same rate, use the **Gordon growth model**.\n\n$$V = \\frac{\\text{Div}_1}{r - g}$$\n\n\\(\\text{Div}_1\\) = next year's dividend, \\(r\\) = required return, \\(g\\) = growth.\n\n$$V = \\frac{${W.fs(p.D1)}}{${p.r}\\% - ${p.g}\\%} = \\frac{${W.fs(p.D1)}}{${W.fn((p.r - p.g) / 100, 2, true)}} = ${W.fs(ok)}$$\n\nThe stock is worth **${W.soldi(ok)}**.`,
        err: { senzag: 'You divided by the required return alone: that is the value of a dividend that never grows. The difference between required return and growth goes underneath.', somma: 'You added required return and growth: growth must be subtracted.', piug: 'You grew a dividend that was already next year\'s: it goes on top as it is.' }
      }
    },
    gordon0: {
      liv: 3, tema: 'valutare', forma: 'euro2f', lab: 'flussi',
      par: R => { const r = scegli(R, [7, 8, 9, 10, 11, 12]), g = scegli(R, [2, 3, 4, 5, 6]), D0 = scegli(R, [0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5, 1.6, 2, 2.4, 2.5, 3, 3.2, 4, 5, 6]), D1 = D0 * (1 + g / 100), V = D1 / ((r - g) / 100);
        return r - g >= 3 && intero(D1 * 1000) && intero(V * 100) ? { D0, r, g } : null; },
      ok: p => p.D0 * (1 + p.g / 100) / ((p.r - p.g) / 100),
      err: { fermo: p => p.D0 / ((p.r - p.g) / 100), senzag: p => p.D0 * (1 + p.g / 100) / (p.r / 100), somma: p => p.D0 * (1 + p.g / 100) / ((p.r + p.g) / 100) },
      it: {
        q: (p, W) => `Un'azienda ha appena pagato un dividendo di ${W.soldi(p.D0)} per azione. Ti aspetti che cresca ${W.delp(p.g)} l'anno per sempre, e chiedi un rendimento ${W.delp(p.r)}. Quanto vale l'azione?`,
        exp: (p, W, ok) => `Nel modello di Gordon sopra va il dividendo **del prossimo anno**: quello appena pagato va prima fatto crescere.\n\n$$\\text{Div}_1 = \\text{Div}_0 \\times (1 + g) = ${W.fs(p.D0)} \\times ${W.fn(1 + p.g / 100, 2, true)} = ${W.fn(p.D0 * (1 + p.g / 100), 3)}$$\n\n$$V = \\frac{\\text{Div}_1}{r - g} = \\frac{${W.fn(p.D0 * (1 + p.g / 100), 3)}}{${W.fn((p.r - p.g) / 100, 2, true)}} = ${W.fs(ok)}$$\n\n\\(\\text{Div}_0\\) = ultimo dividendo pagato, \\(r\\) = rendimento richiesto, \\(g\\) = crescita. L'azione vale **${W.soldi(ok)}**.`,
        err: { fermo: 'Hai messo sopra l\'ultimo dividendo pagato: va usato quello del prossimo anno, cioè l\'ultimo fatto crescere di un anno.', senzag: 'Hai diviso per il solo rendimento richiesto: sotto va la differenza tra rendimento richiesto e crescita.', somma: 'Hai sommato rendimento richiesto e crescita: la crescita va tolta.' }
      },
      en: {
        q: (p, W) => `A company has just paid a dividend of ${W.soldi(p.D0)} per share. You expect it to grow ${W.pct(p.g)} a year forever, and you require a return of ${W.pct(p.r)}. What is the stock worth?`,
        exp: (p, W, ok) => `In the Gordon growth model **next year's** dividend goes on top: the one just paid must be grown first.\n\n$$\\text{Div}_1 = \\text{Div}_0 \\times (1 + g) = ${W.fs(p.D0)} \\times ${W.fn(1 + p.g / 100, 2, true)} = ${W.fn(p.D0 * (1 + p.g / 100), 3)}$$\n\n$$V = \\frac{\\text{Div}_1}{r - g} = \\frac{${W.fn(p.D0 * (1 + p.g / 100), 3)}}{${W.fn((p.r - p.g) / 100, 2, true)}} = ${W.fs(ok)}$$\n\n\\(\\text{Div}_0\\) = last dividend paid, \\(r\\) = required return, \\(g\\) = growth. The stock is worth **${W.soldi(ok)}**.`,
        err: { fermo: 'You put the last dividend paid on top: use next year\'s, that is, the last one grown by one year.', senzag: 'You divided by the required return alone: the difference between required return and growth goes underneath.', somma: 'You added required return and growth: growth must be subtracted.' }
      }
    },
    rimpl: {
      liv: 2, tema: 'valutare', forma: 'pct', lab: 'flussi',
      par: R => { const y = scegli(R, [2, 2.5, 3, 4, 5, 6]), g = scegli(R, [2, 3, 4, 5, 6]), P = scegli(R, [10, 20, 25, 40, 50, 80]), D1 = P * y / 100; return intero(D1 * 100) && Math.abs(y - g) >= 1 ? { P, D1: giro(D1, 2), g } : null; },
      ok: p => p.D1 / p.P * 100 + p.g,
      err: { soloy: p => p.D1 / p.P * 100, solog: p => p.g, pe: p => p.P / p.D1 },
      it: {
        q: (p, W) => `Un'azione costa ${W.soldi(p.P)}. L'anno prossimo pagherà un dividendo di ${W.soldi(p.D1)}, che poi crescerà ${W.delp(p.g)} l'anno per sempre. Che rendimento offre a chi la compra oggi?`,
        exp: (p, W, ok) => `Girando il modello di Gordon, il rendimento offerto da un prezzo è il rendimento del dividendo più la crescita.\n\n$$r = \\frac{\\text{Div}_1}{P} + g$$\n\n\\(\\text{Div}_1\\) = dividendo del prossimo anno, \\(P\\) = prezzo di oggi, \\(g\\) = crescita.\n\n$$r = \\frac{${W.fs(p.D1)}}{${W.fs(p.P)}} + ${p.g}\\% = ${W.f(W.pct(p.D1 / p.P * 100))} + ${p.g}\\% = ${W.f(W.pct(ok))}$$\n\nChi compra oggi può aspettarsi **${W.ilp(ok)}** l'anno, se le ipotesi reggono.`,
        err: { soloy: 'Questo è solo il rendimento del dividendo: manca la crescita.', solog: 'Questa è solo la crescita: manca il rendimento del dividendo.', pe: 'Hai diviso il prezzo per il dividendo: va fatto il contrario, e poi si aggiunge la crescita.' }
      },
      en: {
        q: (p, W) => `A stock costs ${W.soldi(p.P)}. Next year it will pay a dividend of ${W.soldi(p.D1)}, which will then grow ${W.pct(p.g)} a year forever. What return does it offer to someone who buys it today?`,
        exp: (p, W, ok) => `Turning the Gordon growth model around, the return a price offers is the dividend yield plus growth.\n\n$$r = \\frac{\\text{Div}_1}{P} + g$$\n\n\\(\\text{Div}_1\\) = next year's dividend, \\(P\\) = today's price, \\(g\\) = growth.\n\n$$r = \\frac{${W.fs(p.D1)}}{${W.fs(p.P)}} + ${p.g}\\% = ${W.f(W.pct(p.D1 / p.P * 100))} + ${p.g}\\% = ${W.f(W.pct(ok))}$$\n\nA buyer today can expect **${W.pct(ok)}** a year, if the assumptions hold.`,
        err: { soloy: 'This is only the dividend yield: growth is missing.', solog: 'This is only the growth: the dividend yield is missing.', pe: 'You divided the price by the dividend: it goes the other way, and then you add growth.' }
      }
    },
    gsost: {
      liv: 2, tema: 'valutare', forma: 'pct', lab: 'flussi',
      par: R => { const pay = scegli(R, [10, 20, 25, 30, 35, 40, 45, 55, 60, 65, 70, 75, 80, 90]), roe = scegli(R, [6, 8, 10, 12, 14, 15, 16, 18, 20, 22, 24, 25, 30]), g = (100 - pay) * roe / 100; return intero(g * 10) && g >= 1.5 ? { pay, roe } : null; },
      ok: p => (100 - p.pay) * p.roe / 100,
      err: { payout: p => p.pay * p.roe / 100, roe: p => p.roe, diviso: p => p.roe * 100 / (100 - p.pay) },
      it: {
        q: (p, W) => `Un'azienda ha un ROE ${W.delp(p.roe)} e distribuisce ai soci ${W.ilp(p.pay)} degli utili. Quanto vale la sua crescita sostenibile?`,
        exp: (p, W, ok) => `La **crescita sostenibile** è la quota di utili trattenuta per quanto l'azienda la fa rendere.\n\n$$g = (1 - \\text{payout}) \\times \\text{ROE}$$\n\nLa quota trattenuta è \\(100\\% - ${p.pay}\\% = ${100 - p.pay}\\%\\).\n\n$$g = ${100 - p.pay}\\% \\times ${p.roe}\\% = ${W.f(W.pct(ok))}$$`,
        err: { payout: 'Hai usato il payout: la crescita nasce dagli utili che restano in azienda, cioè dalla quota trattenuta.', roe: 'Questo è il ROE: va moltiplicato per la quota di utili trattenuta.', diviso: 'Hai diviso il ROE per la quota trattenuta: va moltiplicato.' }
      },
      en: {
        q: (p, W) => `A company has an ROE of ${W.pct(p.roe)} and pays out ${W.pct(p.pay)} of its earnings to shareholders. What is its sustainable growth rate?`,
        exp: (p, W, ok) => `The **sustainable growth rate** is the share of earnings retained times the return the company earns on it.\n\n$$g = (1 - \\text{payout}) \\times \\text{ROE}$$\n\nThe retained share is \\(100\\% - ${p.pay}\\% = ${100 - p.pay}\\%\\).\n\n$$g = ${100 - p.pay}\\% \\times ${p.roe}\\% = ${W.f(W.pct(ok))}$$`,
        err: { payout: 'You used the payout ratio: growth comes from the earnings that stay in the company, the retained share.', roe: 'This is the ROE: it must be multiplied by the share of earnings retained.', diviso: 'You divided the ROE by the retained share: it must be multiplied.' }
      }
    },
    pegiusto: {
      liv: 3, tema: 'valutare', forma: 'volte', lab: 'flussi',
      par: R => { const pay = scegli(R, [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 90]), r = scegli(R, [7, 8, 9, 10, 11, 12, 13]), g = scegli(R, [1, 2, 3, 4, 5, 6, 7]), pe = pay / (r - g); return r - g >= 2 && intero(pe * 10) ? { pay, r, g } : null; },
      ok: p => p.pay / (p.r - p.g),
      err: { senzag: p => p.pay / p.r, trattenuta: p => (100 - p.pay) / (p.r - p.g), somma: p => p.pay / (p.r + p.g) },
      it: {
        q: (p, W) => `Un'azienda distribuisce ${W.ilp(p.pay)} degli utili. I soci chiedono un rendimento ${W.delp(p.r)} e si aspettano una crescita ${W.delp(p.g)} l'anno per sempre. Quanto vale il P/E giusto, calcolato sugli utili attesi?`,
        exp: (p, W, ok) => `Il **P/E giusto** è quello che un'azienda merita per quanto distribuisce, quanto cresce e quanto rischia.\n\n$$\\text{P/E giusto} = \\frac{\\text{payout}}{r - g}$$\n\n\\(r\\) = rendimento richiesto, \\(g\\) = crescita.\n\n$$\\text{P/E giusto} = \\frac{${p.pay}\\%}{${p.r}\\% - ${p.g}\\%} = \\frac{${W.fn(p.pay / 100, 2, true)}}{${W.fn((p.r - p.g) / 100, 2, true)}} = ${W.fn(ok, 1)}$$`,
        err: { senzag: 'Hai diviso per il solo rendimento richiesto: sotto va la differenza tra rendimento richiesto e crescita.', trattenuta: 'Hai usato la quota trattenuta: sopra va il payout, la quota di utili distribuita.', somma: 'Hai sommato rendimento richiesto e crescita: la crescita va tolta.' }
      },
      en: {
        q: (p, W) => `A company pays out ${W.pct(p.pay)} of its earnings. Shareholders require a return of ${W.pct(p.r)} and expect growth of ${W.pct(p.g)} a year forever. What is the justified P/E, based on expected earnings?`,
        exp: (p, W, ok) => `The **justified P/E** is the one a company deserves for how much it pays out, how fast it grows and how risky it is.\n\n$$\\text{Justified P/E} = \\frac{\\text{payout}}{r - g}$$\n\n\\(r\\) = required return, \\(g\\) = growth.\n\n$$\\text{Justified P/E} = \\frac{${p.pay}\\%}{${p.r}\\% - ${p.g}\\%} = \\frac{${W.fn(p.pay / 100, 2, true)}}{${W.fn((p.r - p.g) / 100, 2, true)}} = ${W.fn(ok, 1)}$$`,
        err: { senzag: 'You divided by the required return alone: the difference between required return and growth goes underneath.', trattenuta: 'You used the retained share: the payout ratio, the share of earnings paid out, goes on top.', somma: 'You added required return and growth: growth must be subtracted.' }
      }
    },
    priv: {
      liv: 2, tema: 'valutare', forma: 'euro2', lab: 'flussi',
      par: R => { const r = scegli(R, [4, 5, 6, 7, 8, 10, 12]), V = scegli(R, [8, 10, 12, 12.5, 15, 16, 20, 24, 25, 30, 40, 50, 60]), D = V * r / 100; return intero(D * 100) ? { D: giro(D, 2), r } : null; },
      ok: p => p.D / (p.r / 100),
      err: { per: p => p.D * p.r, cresciuto: p => p.D * (1 + p.r / 100) / (p.r / 100), dieci: p => p.D / (p.r / 100) / 10 },
      it: {
        q: (p, W) => `Un'azione privilegiata paga un dividendo fisso di ${W.soldi(p.D)} l'anno, per sempre. Chi la compra chiede un rendimento ${W.delp(p.r)}. Quanto vale?`,
        exp: (p, W, ok) => `Un dividendo fisso, per sempre, è una **rendita perpetua**: vale il pagamento diviso il rendimento richiesto.\n\n$$V = \\frac{\\text{Div}}{r}$$\n\n\\(\\text{Div}\\) = dividendo fisso, \\(r\\) = rendimento richiesto.\n\n$$V = \\frac{${W.fs(p.D)}}{${W.fn(p.r / 100, 2, true)}} = ${W.fs(ok)}$$\n\nL'azione privilegiata vale **${W.soldi(ok)}**.`,
        err: { per: 'Hai moltiplicato il dividendo per il rendimento: va diviso per il rendimento richiesto.', cresciuto: 'Hai fatto crescere il dividendo: è fisso, va diviso così com\'è per il rendimento richiesto.', dieci: 'Controlla la virgola: il risultato giusto è dieci volte più grande.' }
      },
      en: {
        q: (p, W) => `A preferred share pays a fixed dividend of ${W.soldi(p.D)} a year, forever. Buyers require a return of ${W.pct(p.r)}. What is it worth?`,
        exp: (p, W, ok) => `A fixed dividend, forever, is a **perpetuity**: it is worth the payment divided by the required return.\n\n$$V = \\frac{\\text{Div}}{r}$$\n\n\\(\\text{Div}\\) = fixed dividend, \\(r\\) = required return.\n\n$$V = \\frac{${W.fs(p.D)}}{${W.fn(p.r / 100, 2, true)}} = ${W.fs(ok)}$$\n\nThe preferred share is worth **${W.soldi(ok)}**.`,
        err: { per: 'You multiplied the dividend by the return: it must be divided by the required return.', cresciuto: 'You grew the dividend: it is fixed, so divide it as it is by the required return.', dieci: 'Check the decimal point: the right result is ten times larger.' }
      }
    },
    duefasi: {
      liv: 3, tema: 'valutare', forma: 'euro2', lab: 'flussi',
      par: R => { const r = scegli(R, [10, 20, 25]), g = scegli(R, r === 10 ? [2, 4, 5, 6] : r === 20 ? [4, 5, 8, 10] : [5, 10, 15]), k = 1 + r / 100, a = scegli(R, [0.5, 1, 1.5, 2, 2.5, 3]), c = scegli(R, [8, 10, 12, 15, 16, 18, 20, 22, 24, 25, 30, 32, 36, 40, 44, 50]), D1 = a * k, D2 = c * k * (r - g) / 100;
        return intero(D1 * 100) && intero(D2 * 100) && D2 >= D1 && D2 <= 1.6 * D1 && intero(D2 * (1 + g / 100) / ((r - g) / 100) * 100) ? { D1: giro(D1, 2), D2: giro(D2, 2), r, g } : null; },
      ok: p => { const k = 1 + p.r / 100, P2 = p.D2 * (1 + p.g / 100) / ((p.r - p.g) / 100); return p.D1 / k + (p.D2 + P2) / (k * k); },
      err: { senzafinale: p => { const k = 1 + p.r / 100; return p.D1 / k + p.D2 / (k * k); },
        nonscontato: p => { const k = 1 + p.r / 100, P2 = p.D2 * (1 + p.g / 100) / ((p.r - p.g) / 100); return p.D1 / k + p.D2 / (k * k) + P2; },
        unanno: p => { const k = 1 + p.r / 100, P2 = p.D2 * (1 + p.g / 100) / ((p.r - p.g) / 100); return (p.D1 + p.D2 + P2) / k; } },
      it: {
        q: (p, W) => `Un'azione pagherà un dividendo di ${W.soldi(p.D1)} tra un anno e di ${W.soldi(p.D2)} tra due anni. Da lì in poi il dividendo crescerà ${W.delp(p.g)} l'anno per sempre. Chiedi un rendimento ${W.delp(p.r)}. Quanto vale oggi l'azione?`,
        exp: (p, W, ok) => { const k = 1 + p.r / 100, D3 = p.D2 * (1 + p.g / 100), P2 = D3 / ((p.r - p.g) / 100);
          return `Due fasi: prima i dividendi previsti uno per uno, poi un **valore finale** calcolato con Gordon, tutto riportato a oggi.\n\n• Primo dividendo della seconda fase: \\(${W.fs(p.D2)} \\times ${W.fn(1 + p.g / 100, 2, true)} = ${W.fn(D3, 4)}\\).\n• Valore finale tra due anni: \\(P_2 = \\dfrac{${W.fn(D3, 4)}}{${W.fn((p.r - p.g) / 100, 2, true)}} = ${W.fs(P2)}\\).\n\n$$V = \\frac{\\text{Div}_1}{1 + r} + \\frac{\\text{Div}_2 + P_2}{(1 + r)^2} = \\frac{${W.fs(p.D1)}}{${W.fn(k, 2, true)}} + \\frac{${W.fs(p.D2)} + ${W.fs(P2)}}{${W.fn(k * k, 2, true)}} = ${W.fs(ok)}$$\n\nL'azione vale oggi **${W.soldi(ok)}**.`; },
        err: { senzafinale: 'Hai scontato solo i dividendi dei primi due anni: manca il valore finale, che racchiude tutti i dividendi successivi.', nonscontato: 'Hai aggiunto il valore finale senza scontarlo: è un prezzo di tra due anni, va riportato a oggi.', unanno: 'Hai scontato tutto per un anno solo: il secondo dividendo e il valore finale arrivano tra due anni.' }
      },
      en: {
        q: (p, W) => `A stock will pay a dividend of ${W.soldi(p.D1)} in one year and ${W.soldi(p.D2)} in two years. After that the dividend will grow ${W.pct(p.g)} a year forever. You require a return of ${W.pct(p.r)}. What is the stock worth today?`,
        exp: (p, W, ok) => { const k = 1 + p.r / 100, D3 = p.D2 * (1 + p.g / 100), P2 = D3 / ((p.r - p.g) / 100);
          return `Two stages: first the dividends forecast one by one, then a **terminal value** from the Gordon growth model, all brought back to today.\n\n• First dividend of the second stage: \\(${W.fs(p.D2)} \\times ${W.fn(1 + p.g / 100, 2, true)} = ${W.fn(D3, 4)}\\).\n• Terminal value in two years: \\(P_2 = \\dfrac{${W.fn(D3, 4)}}{${W.fn((p.r - p.g) / 100, 2, true)}} = ${W.fs(P2)}\\).\n\n$$V = \\frac{\\text{Div}_1}{1 + r} + \\frac{\\text{Div}_2 + P_2}{(1 + r)^2} = \\frac{${W.fs(p.D1)}}{${W.fn(k, 2, true)}} + \\frac{${W.fs(p.D2)} + ${W.fs(P2)}}{${W.fn(k * k, 2, true)}} = ${W.fs(ok)}$$\n\nThe stock is worth **${W.soldi(ok)}** today.`; },
        err: { senzafinale: 'You discounted only the dividends of the first two years: the terminal value, which holds all the later dividends, is missing.', nonscontato: 'You added the terminal value without discounting it: it is a price two years from now, so it must be brought back to today.', unanno: 'You discounted everything for one year only: the second dividend and the terminal value arrive in two years.' }
      }
    }
  };

  function lontano(v, altri, ok, F) { const soglia = Math.max(F.abs, F.rel * Math.abs(ok)); return altri.every(u => Math.abs(v - u) >= soglia - 1e-9); }
  function creaCalcolo(T, R) {
    const F = FORMA[T.forma];
    for (let giri = 0; giri < 300; giri++) {
      const p = T.par(R); if (!p) continue;
      const ok = giro(T.ok(p), F.d); if (!isFinite(ok)) continue;
      const sb = [];
      for (const k of mescola(R, Object.keys(T.err))) {
        const x = T.err[k](p); if (x == null || !isFinite(x)) continue;
        const v = giro(x, F.d); if (!F.segno && v <= 0) continue;
        if (lontano(v, [ok].concat(sb.map(s => s.v)), ok, F)) sb.push({ k, v });
        if (sb.length === 2) break;
      }
      if (sb.length < 2) continue;
      const o = mescola(R, [{ k: 'ok', v: ok }].concat(sb));
      return { p, o, a: o.findIndex(x => x.k === 'ok') };
    }
    return null;   // il collaudo controlla che non succeda mai
  }

  // =====================================================================================================
  // TABELLE DI FATTI (fonti in dev/ordine/FONTI_GIOCHI.md)
  // =====================================================================================================
  // Persone: chi (domanda → nome) e cosa (nome → idea). `piu`: il nome è di due persone.
  const PERSONE = [
    { id: 'smith', nome: 'Adam Smith',
      it: { q: 'Chi ha scritto «La ricchezza delle nazioni», il libro del 1776 da cui parte l\'economia moderna?', cosa: '«La ricchezza delle nazioni» e l\'immagine della mano invisibile', exp: '**Adam Smith** pubblicò «La ricchezza delle nazioni» nel 1776. Lì compare l\'immagine della mano invisibile: chi cerca il proprio guadagno finisce spesso per fare anche l\'interesse degli altri.' },
      en: { q: 'Who wrote ‘The Wealth of Nations’, the 1776 book where modern economics begins?', cosa: '‘The Wealth of Nations’ and the image of the invisible hand', exp: '**Adam Smith** published ‘The Wealth of Nations’ in 1776. It contains the image of the invisible hand: people seeking their own gain often end up serving the interest of others too.' } },
    { id: 'ricardo', nome: 'David Ricardo',
      it: { q: 'Chi ha spiegato il vantaggio comparato, cioè perché a due paesi conviene commerciare anche quando uno dei due è più bravo in tutto?', cosa: 'Il vantaggio comparato nel commercio tra paesi', exp: '**David Ricardo** espose il vantaggio comparato nel 1817: a ogni paese conviene produrre ciò in cui è relativamente più bravo e scambiare il resto.' },
      en: { q: 'Who explained comparative advantage, that is, why two countries gain from trading even when one of them is better at everything?', cosa: 'Comparative advantage in trade between countries', exp: '**David Ricardo** set out comparative advantage in 1817: each country gains by producing what it is relatively better at and trading for the rest.' } },
    { id: 'keynes', nome: 'John Maynard Keynes',
      it: { q: 'Chi ha scritto la «Teoria generale» del 1936, sostenendo che nelle crisi lo Stato può sostenere la spesa quando famiglie e imprese la tagliano?', cosa: 'La «Teoria generale»: nelle crisi lo Stato può sostenere la spesa', exp: '**John Maynard Keynes** pubblicò la «Teoria generale dell\'occupazione, dell\'interesse e della moneta» nel 1936, negli anni della Grande Depressione.' },
      en: { q: 'Who wrote the 1936 ‘General Theory’, arguing that in a slump the government can support spending when households and businesses cut back?', cosa: 'The ‘General Theory’: in a slump the government can support spending', exp: '**John Maynard Keynes** published ‘The General Theory of Employment, Interest and Money’ in 1936, during the Great Depression.' } },
    { id: 'marx', nome: 'Karl Marx',
      it: { q: 'Chi ha scritto «Il Capitale», il cui primo volume uscì nel 1867?', cosa: '«Il Capitale», una critica del capitalismo', exp: '**Karl Marx** pubblicò il primo volume de «Il Capitale» nel 1867.' },
      en: { q: 'Who wrote ‘Capital’ (‘Das Kapital’), whose first volume came out in 1867?', cosa: '‘Capital’, a critique of capitalism', exp: '**Karl Marx** published the first volume of ‘Capital’ in 1867.' } },
    { id: 'friedman', nome: 'Milton Friedman',
      it: { q: 'Quale economista, premio Nobel nel 1976, è il nome più noto del monetarismo, l\'idea che l\'inflazione dipenda dalla quantità di moneta in circolazione?', cosa: 'Il monetarismo: l\'inflazione dipende dalla quantità di moneta', exp: '**Milton Friedman**, premio Nobel per l\'economia nel 1976, sosteneva che l\'inflazione nasce quando la moneta in circolazione cresce più in fretta della produzione.' },
      en: { q: 'Which economist, a 1976 Nobel laureate, is the best-known name in monetarism, the idea that inflation depends on the amount of money in circulation?', cosa: 'Monetarism: inflation depends on the amount of money', exp: '**Milton Friedman**, winner of the 1976 Nobel Prize in economics, argued that inflation arises when the money in circulation grows faster than output.' } },
    { id: 'markowitz', nome: 'Harry Markowitz',
      it: { q: 'Chi ha mostrato nel 1952 come costruire un portafoglio guardando insieme rendimento e rischio, dando una base matematica alla diversificazione?', cosa: 'La teoria del portafoglio: diversificare riduce il rischio', exp: '**Harry Markowitz** pubblicò «Portfolio Selection» nel 1952: il rischio di un portafoglio dipende da come i titoli si muovono tra loro, non solo dal rischio di ciascuno.' },
      en: { q: 'Who showed in 1952 how to build a portfolio by looking at return and risk together, giving diversification a mathematical basis?', cosa: 'Portfolio theory: diversifying reduces risk', exp: '**Harry Markowitz** published ‘Portfolio Selection’ in 1952: the risk of a portfolio depends on how its securities move together, not only on the risk of each one.' } },
    { id: 'sharpe', nome: 'William Sharpe',
      it: { q: 'Quale economista dà il nome all\'indice che misura quanto rendimento in più ottieni per ogni unità di rischio che corri?', cosa: 'L\'indice che confronta il rendimento con il rischio corso', exp: '**William Sharpe** propose negli anni Sessanta l\'indice che porta il suo nome: rendimento in più rispetto a un investimento senza rischio, diviso per il rischio corso.' },
      en: { q: 'Which economist gave his name to the ratio that measures how much extra return you get for each unit of risk you take?', cosa: 'The ratio that compares return with the risk taken', exp: '**William Sharpe** proposed in the 1960s the ratio that bears his name: the return above a risk-free investment, divided by the risk taken.' } },
    { id: 'fama', nome: 'Eugene Fama',
      it: { q: 'Chi ha formulato l\'ipotesi dei mercati efficienti, secondo cui i prezzi contengono già le informazioni disponibili?', cosa: 'L\'ipotesi dei mercati efficienti: i prezzi contengono già le informazioni', exp: '**Eugene Fama** è l\'economista legato all\'ipotesi dei mercati efficienti: se i prezzi riflettono già le informazioni disponibili, battere il mercato con regolarità è molto difficile.' },
      en: { q: 'Who formulated the efficient market hypothesis, which says prices already contain the available information?', cosa: 'The efficient market hypothesis: prices already contain the information', exp: '**Eugene Fama** is the economist tied to the efficient market hypothesis: if prices already reflect the available information, beating the market consistently is very hard.' } },
    { id: 'kahneman', nome: 'Daniel Kahneman',
      it: { q: 'Quale psicologo, premio Nobel per l\'economia nel 2002, ha mostrato con Amos Tversky che una perdita pesa più di un guadagno della stessa cifra?', cosa: 'Con Tversky: una perdita pesa più di un guadagno uguale', exp: '**Daniel Kahneman** studiò con Amos Tversky come le persone decidono davvero. Nel 2002 ricevette il Nobel per l\'economia.' },
      en: { q: 'Which psychologist, winner of the 2002 Nobel Prize in economics, showed with Amos Tversky that a loss weighs more than a gain of the same size?', cosa: 'With Tversky: a loss weighs more than an equal gain', exp: '**Daniel Kahneman** studied with Amos Tversky how people really decide. In 2002 he received the Nobel Prize in economics.' } },
    { id: 'graham', nome: 'Benjamin Graham',
      it: { q: 'Chi ha scritto «L\'investitore intelligente» (1949) ed è considerato il padre dell\'investimento basato sul valore?', cosa: '«L\'investitore intelligente»: comprare a meno di quanto vale', exp: '**Benjamin Graham** pubblicò «L\'investitore intelligente» nel 1949. Tra i suoi allievi ci fu Warren Buffett.' },
      en: { q: 'Who wrote ‘The Intelligent Investor’ (1949) and is considered the father of value investing?', cosa: '‘The Intelligent Investor’: buying for less than it is worth', exp: '**Benjamin Graham** published ‘The Intelligent Investor’ in 1949. Warren Buffett was one of his students.' } },
    { id: 'bogle', nome: 'John Bogle',
      it: { q: 'Chi ha fondato Vanguard e lanciato nel 1976 il primo fondo indicizzato aperto ai piccoli risparmiatori?', cosa: 'Il primo fondo indicizzato per i piccoli risparmiatori', exp: '**John Bogle** fondò Vanguard e nel 1976 lanciò il primo fondo aperto a tutti che si limitava a copiare un indice di Borsa, con costi bassi.' },
      en: { q: 'Who founded Vanguard and in 1976 launched the first index fund open to small investors?', cosa: 'The first index fund for small investors', exp: '**John Bogle** founded Vanguard and in 1976 launched the first fund open to everyone that simply copied a stock index, at low cost.' } },
    { id: 'malthus', nome: 'Thomas Malthus',
      it: { q: 'Chi sostenne nel 1798 che la popolazione tende a crescere più in fretta del cibo disponibile?', cosa: 'La popolazione tende a crescere più in fretta del cibo', exp: '**Thomas Malthus** pubblicò il «Saggio sul principio di popolazione» nel 1798.' },
      en: { q: 'Who argued in 1798 that population tends to grow faster than the food supply?', cosa: 'Population tends to grow faster than the food supply', exp: '**Thomas Malthus** published ‘An Essay on the Principle of Population’ in 1798.' } },
    { id: 'schumpeter', nome: 'Joseph Schumpeter',
      it: { q: 'Chi ha reso celebre l\'espressione «distruzione creatrice», con cui le imprese e i prodotti nuovi prendono il posto di quelli vecchi?', cosa: 'La distruzione creatrice: il nuovo prende il posto del vecchio', exp: '**Joseph Schumpeter** rese celebre l\'espressione «distruzione creatrice» nel libro «Capitalismo, socialismo e democrazia» del 1942.' },
      en: { q: 'Who made famous the phrase ‘creative destruction’, by which new firms and products take the place of old ones?', cosa: 'Creative destruction: the new takes the place of the old', exp: '**Joseph Schumpeter** made the phrase ‘creative destruction’ famous in his 1942 book ‘Capitalism, Socialism and Democracy’.' } },
    { id: 'pareto', nome: 'Vilfredo Pareto',
      it: { q: 'Quale economista italiano dà il nome alla situazione in cui non si può far stare meglio qualcuno senza far stare peggio qualcun altro?', cosa: 'Nessuno può stare meglio senza che un altro stia peggio', exp: '**Vilfredo Pareto** dà il nome all\'ottimo paretiano: una situazione in cui ogni miglioramento per qualcuno costerebbe un peggioramento a qualcun altro.' },
      en: { q: 'Which Italian economist gave his name to the situation where no one can be made better off without making someone else worse off?', cosa: 'No one can be better off without someone else being worse off', exp: '**Vilfredo Pareto** gave his name to Pareto efficiency: a situation where any improvement for someone would cost someone else a loss.' } },
    { id: 'fisher', nome: 'Irving Fisher',
      it: { q: 'Quale economista dà il nome all\'equazione che lega tasso nominale, tasso reale e inflazione?', cosa: 'L\'equazione che lega tasso nominale, tasso reale e inflazione', exp: '**Irving Fisher** dà il nome all\'equazione che separa il tasso che vedi (nominale) da quello che resta dopo l\'inflazione (reale).' },
      en: { q: 'Which economist gave his name to the equation that links the nominal rate, the real rate and inflation?', cosa: 'The equation that links the nominal rate, the real rate and inflation', exp: '**Irving Fisher** gave his name to the equation that separates the rate you see (nominal) from what is left after inflation (real).' } },
    { id: 'modigliani', nome: 'Franco Modigliani',
      it: { q: 'Quale economista italiano, premio Nobel nel 1985, firmò con Merton Miller il teorema sul rapporto tra i debiti di un\'impresa e il suo valore?', cosa: 'Con Miller: il teorema sul rapporto tra debiti e valore dell\'impresa', exp: '**Franco Modigliani** e Merton Miller pubblicarono il loro teorema nel 1958. Modigliani ricevette il Nobel per l\'economia nel 1985.' },
      en: { q: 'Which Italian economist, a 1985 Nobel laureate, wrote with Merton Miller the theorem on the relation between a firm’s debt and its value?', cosa: 'With Miller: the theorem on the relation between debt and firm value', exp: '**Franco Modigliani** and Merton Miller published their theorem in 1958. Modigliani received the Nobel Prize in economics in 1985.' } },
    { id: 'pacioli', nome: 'Luca Pacioli',
      it: { q: 'Quale frate matematico descrisse in un libro del 1494 la partita doppia, il metodo con cui si tengono ancora oggi i conti delle aziende?', cosa: 'La prima descrizione a stampa della partita doppia', exp: '**Luca Pacioli** descrisse la partita doppia nella «Summa de arithmetica», stampata a Venezia nel 1494. Il metodo era già usato dai mercanti: lui lo mise per iscritto.' },
      en: { q: 'Which friar and mathematician described double-entry bookkeeping, the method still used to keep company accounts, in a 1494 book?', cosa: 'The first printed description of double-entry bookkeeping', exp: '**Luca Pacioli** described double-entry bookkeeping in the ‘Summa de arithmetica’, printed in Venice in 1494. Merchants already used the method: he put it in writing.' } },
    { id: 'nash', nome: 'John Nash',
      it: { q: 'Quale matematico dà il nome all\'equilibrio in cui a nessun giocatore conviene cambiare mossa da solo?', cosa: 'L\'equilibrio in cui a nessuno conviene cambiare mossa da solo', exp: '**John Nash** dà il nome all\'equilibrio più usato nella teoria dei giochi. Nel 1994 ricevette il Nobel per l\'economia.' },
      en: { q: 'Which mathematician gave his name to the equilibrium where no player gains by changing their move alone?', cosa: 'The equilibrium where no one gains by changing their move alone', exp: '**John Nash** gave his name to the most widely used equilibrium in game theory. In 1994 he received the Nobel Prize in economics.' } },
    { id: 'minsky', nome: 'Hyman Minsky',
      it: { q: 'Quale economista sostenne che i periodi di calma spingono a fare troppi debiti, e che così la stabilità prepara la crisi successiva?', cosa: 'La stabilità spinge a fare troppi debiti e prepara la crisi', exp: '**Hyman Minsky** è l\'economista dell\'ipotesi dell\'instabilità finanziaria. Il momento in cui i debiti accumulati fanno scattare la crisi viene chiamato «momento Minsky».' },
      en: { q: 'Which economist argued that calm periods push people to take on too much debt, so that stability prepares the next crisis?', cosa: 'Stability pushes people into too much debt and prepares the crisis', exp: '**Hyman Minsky** is the economist of the financial instability hypothesis. The moment when built-up debt sets off the crisis is called a ‘Minsky moment’.' } },
    { id: 'blackscholes', nome: 'Fischer Black e Myron Scholes', nomeEn: 'Fischer Black and Myron Scholes', piu: true,
      it: { q: 'Chi pubblicò nel 1973 la formula più famosa per calcolare il prezzo delle opzioni?', cosa: 'La formula del 1973 per il prezzo delle opzioni', exp: '**Fischer Black e Myron Scholes** pubblicarono la loro formula nel 1973. Nello stesso anno Robert Merton ne ampliò la teoria.' },
      en: { q: 'Who published in 1973 the most famous formula for pricing options?', cosa: 'The 1973 formula for pricing options', exp: '**Fischer Black and Myron Scholes** published their formula in 1973. In the same year Robert Merton extended the theory.' } }
  ];
  // Eventi: quando (domanda → anno) e prima (quale dei tre è avvenuto per primo). `evita`: anni che non devono comparire tra le risposte sbagliate.
  const EVENTI = [
    { id: 'mps', anno: 1472,
      it: { q: 'A quale anno fa risalire le sue origini il Monte dei Paschi di Siena, considerata la banca più antica ancora in attività?', nome: 'La nascita a Siena del Monte Pio, poi Monte dei Paschi', exp: 'Il Monte dei Paschi fa risalire le sue origini al **1472**, quando a Siena nacque il Monte Pio. Il nome di oggi arrivò nel 1624. È considerata la banca più antica ancora in attività.' },
      en: { q: 'To what year does Monte dei Paschi di Siena, considered the oldest bank still in business, trace its origins?', nome: 'The founding in Siena of the Monte Pio, later Monte dei Paschi', exp: 'Monte dei Paschi traces its origins to **1472**, when the Monte Pio was set up in Siena. Today’s name came in 1624. It is considered the oldest bank still in business.' } },
    { id: 'voc', anno: 1602,
      it: { q: 'In che anno nacque la Compagnia olandese delle Indie Orientali, considerata la prima società con azioni scambiate in Borsa?', nome: 'La nascita della Compagnia olandese delle Indie Orientali', exp: 'La Compagnia olandese delle Indie Orientali nacque nel **1602**. Le sue azioni si scambiavano ad Amsterdam: è considerata la prima società quotata.' },
      en: { q: 'In what year was the Dutch East India Company founded, considered the first company with shares traded on an exchange?', nome: 'The founding of the Dutch East India Company', exp: 'The Dutch East India Company was founded in **1602**. Its shares were traded in Amsterdam: it is considered the first publicly traded company.' } },
    { id: 'tulipani', anno: 1637,
      it: { q: 'In che anno scoppiò in Olanda la bolla dei tulipani, quando i prezzi dei bulbi crollarono di colpo?', nome: 'Lo scoppio della bolla dei tulipani in Olanda', exp: 'I prezzi dei bulbi di tulipano crollarono nel febbraio del **1637**: è una delle prime bolle speculative di cui si ha notizia.' },
      en: { q: 'In what year did the tulip bubble burst in Holland, when bulb prices suddenly collapsed?', nome: 'The bursting of the tulip bubble in Holland', exp: 'Tulip bulb prices collapsed in February **1637**: it is one of the first speculative bubbles on record.' } },
    { id: 'boe', anno: 1694,
      it: { q: 'In che anno fu fondata la Banca d\'Inghilterra?', nome: 'La fondazione della Banca d\'Inghilterra', exp: 'La Banca d\'Inghilterra fu fondata nel **1694**: è una delle banche centrali più antiche del mondo.' },
      en: { q: 'In what year was the Bank of England founded?', nome: 'The founding of the Bank of England', exp: 'The Bank of England was founded in **1694**: it is one of the oldest central banks in the world.' } },
    { id: 'buttonwood', anno: 1792,
      it: { q: 'In che anno un gruppo di agenti firmò a New York l\'accordo di Buttonwood, da cui nacque la Borsa di Wall Street?', nome: 'L\'accordo di Buttonwood a New York', exp: 'L\'accordo di Buttonwood fu firmato a New York nel **1792**: da quel gruppo di agenti nacque la Borsa di New York.' },
      en: { q: 'In what year did a group of brokers in New York sign the Buttonwood Agreement, from which the Wall Street stock exchange was born?', nome: 'The Buttonwood Agreement in New York', exp: 'The Buttonwood Agreement was signed in New York in **1792**: the New York Stock Exchange grew out of that group of brokers.' } },
    { id: 'fed', anno: 1913,
      it: { q: 'In che anno fu creata la Federal Reserve, la banca centrale degli Stati Uniti?', nome: 'La nascita della Federal Reserve', exp: 'La Federal Reserve fu creata con una legge del dicembre **1913**.' },
      en: { q: 'In what year was the Federal Reserve, the central bank of the United States, created?', nome: 'The creation of the Federal Reserve', exp: 'The Federal Reserve was created by a law passed in December **1913**.' } },
    { id: 'crollo29', anno: 1929,
      it: { q: 'In che anno ci fu il grande crollo di Wall Street a cui seguì la Grande Depressione?', nome: 'Il grande crollo di Wall Street', exp: 'La Borsa di New York crollò nell\'ottobre del **1929**. Seguì la Grande Depressione.' },
      en: { q: 'In what year was the great Wall Street crash that was followed by the Great Depression?', nome: 'The great Wall Street crash', exp: 'The New York stock market crashed in October **1929**. The Great Depression followed.' } },
    { id: 'bretton', anno: 1944,
      it: { q: 'In che anno furono firmati gli accordi di Bretton Woods, che legarono le monete al dollaro e il dollaro all\'oro?', nome: 'Gli accordi di Bretton Woods', exp: 'Gli accordi di Bretton Woods furono firmati nel luglio del **1944**. Da lì nacquero anche il Fondo monetario internazionale e la Banca mondiale.' },
      en: { q: 'In what year were the Bretton Woods agreements signed, tying currencies to the dollar and the dollar to gold?', nome: 'The Bretton Woods agreements', exp: 'The Bretton Woods agreements were signed in July **1944**. The International Monetary Fund and the World Bank also came out of them.' } },
    { id: 'nixon', anno: 1971,
      it: { q: 'In che anno gli Stati Uniti sospesero la conversione del dollaro in oro, chiudendo di fatto il sistema di Bretton Woods?', nome: 'La fine della conversione del dollaro in oro', exp: 'Il presidente Nixon sospese la conversione del dollaro in oro nell\'agosto del **1971**.' },
      en: { q: 'In what year did the United States suspend the conversion of the dollar into gold, in effect ending the Bretton Woods system?', nome: 'The end of the dollar’s conversion into gold', exp: 'President Nixon suspended the conversion of the dollar into gold in August **1971**.' } },
    { id: 'lunedinero', anno: 1987,
      it: { q: 'In che anno ci fu il «lunedì nero», quando la Borsa di New York perse più del 20% in un solo giorno?', nome: 'Il «lunedì nero» della Borsa di New York', exp: 'Il 19 ottobre **1987** l\'indice Dow Jones perse più del 20% in una sola seduta.' },
      en: { q: 'In what year was ‘Black Monday’, when the New York stock market lost more than 20% in a single day?', nome: '‘Black Monday’ on the New York stock market', exp: 'On October 19, **1987**, the Dow Jones index lost more than 20% in a single session.' } },
    { id: 'maastricht', anno: 1992, evita: [1993],
      it: { q: 'In che anno fu firmato il Trattato di Maastricht, che aprì la strada all\'euro?', nome: 'La firma del Trattato di Maastricht', exp: 'Il Trattato di Maastricht fu firmato nel febbraio del **1992** ed entrò in vigore l\'anno dopo.' },
      en: { q: 'In what year was the Maastricht Treaty signed, opening the way to the euro?', nome: 'The signing of the Maastricht Treaty', exp: 'The Maastricht Treaty was signed in February **1992** and came into force the following year.' } },
    { id: 'bce', anno: 1998, evita: [1999],
      it: { q: 'In che anno è nata la Banca centrale europea?', nome: 'La nascita della Banca centrale europea', exp: 'La Banca centrale europea è nata il 1° giugno **1998**, pochi mesi prima dell\'euro.' },
      en: { q: 'In what year was the European Central Bank established?', nome: 'The establishment of the European Central Bank', exp: 'The European Central Bank was established on June 1, **1998**, a few months before the euro.' } },
    { id: 'euro', anno: 1999, evita: [1998, 2002],
      it: { q: 'In che anno è nato l\'euro, all\'inizio solo per i conti e i pagamenti elettronici?', nome: 'La nascita dell\'euro', exp: 'L\'euro è nato il 1° gennaio **1999**, all\'inizio solo per i conti e i pagamenti elettronici. Banconote e monete sono arrivate tre anni dopo.' },
      en: { q: 'In what year was the euro launched, at first only for accounts and electronic payments?', nome: 'The launch of the euro', exp: 'The euro was launched on January 1, **1999**, at first only for accounts and electronic payments. Banknotes and coins arrived three years later.' } },
    { id: 'dotcom', anno: 2000, evita: [1999, 2001, 2002],
      it: { q: 'In che anno la bolla delle società di internet (dot-com) toccò il massimo e cominciò a sgonfiarsi?', nome: 'Lo scoppio della bolla delle società di internet', exp: 'L\'indice Nasdaq toccò il massimo nel marzo del **2000**, poi cominciò una lunga discesa.' },
      en: { q: 'In what year did the internet company (dot-com) bubble peak and begin to deflate?', nome: 'The bursting of the dot-com bubble', exp: 'The Nasdaq index peaked in March **2000**, then began a long decline.' } },
    { id: 'contanti', anno: 2002, evita: [1999],
      it: { q: 'In che anno sono entrate in circolazione le banconote e le monete in euro?', nome: 'L\'arrivo di banconote e monete in euro', exp: 'Banconote e monete in euro sono entrate in circolazione il 1° gennaio **2002**.' },
      en: { q: 'In what year did euro banknotes and coins come into circulation?', nome: 'The arrival of euro banknotes and coins', exp: 'Euro banknotes and coins came into circulation on January 1, **2002**.' } },
    { id: 'lehman', anno: 2008, evita: [2007, 2009],
      it: { q: 'In che anno fallì la banca d\'affari americana Lehman Brothers?', nome: 'Il fallimento di Lehman Brothers', exp: 'Lehman Brothers dichiarò fallimento il 15 settembre **2008**: fu il momento più acuto della crisi finanziaria.' },
      en: { q: 'In what year did the U.S. investment bank Lehman Brothers go bankrupt?', nome: 'The bankruptcy of Lehman Brothers', exp: 'Lehman Brothers filed for bankruptcy on September 15, **2008**: it was the sharpest moment of the financial crisis.' } },
    { id: 'bitcoin', anno: 2009, evita: [2008],
      it: { q: 'In che anno è stato creato il primo blocco di Bitcoin?', nome: 'Il primo blocco di Bitcoin', exp: 'Il primo blocco di Bitcoin è stato creato nel gennaio del **2009**.' },
      en: { q: 'In what year was the first Bitcoin block created?', nome: 'The first Bitcoin block', exp: 'The first Bitcoin block was created in January **2009**.' } },
    { id: 'draghi', anno: 2012, evita: [2011],
      it: { q: 'In che anno Mario Draghi, presidente della BCE, disse che la banca avrebbe fatto «tutto il necessario» per salvare l\'euro?', nome: 'Il discorso di Draghi sul «tutto il necessario» per l\'euro', exp: 'Mario Draghi lo disse a Londra il 26 luglio **2012** («whatever it takes»). Dopo quel discorso la pressione sui titoli di Stato dei paesi più in difficoltà cominciò a scendere.' },
      en: { q: 'In what year did Mario Draghi, president of the ECB, say the bank would do ‘whatever it takes’ to save the euro?', nome: 'Draghi’s ‘whatever it takes’ speech on the euro', exp: 'Mario Draghi said it in London on July 26, **2012**. After that speech the pressure on the government bonds of the countries in most trouble began to ease.' } }
  ];
  // Monete: moneta (paese → moneta) e paese (moneta → paese). Ogni nome di moneta compare in una sola riga.
  const MONETE = [
    { id: 'jp', it: { paese: 'Giappone', di: 'del Giappone', val: 'Yen', il: 'lo yen', inn: 'in yen' }, en: { paese: 'Japan', di: 'Japan', val: 'Yen', il: 'the yen', la: 'the yen' } },
    { id: 'gb', it: { paese: 'Regno Unito', di: 'del Regno Unito', val: 'Sterlina', il: 'la sterlina', inn: 'in sterline' }, en: { paese: 'United Kingdom', di: 'the United Kingdom', val: 'Pound sterling', il: 'the pound sterling', la: 'the pound sterling' } },
    { id: 'ch', it: { paese: 'Svizzera', di: 'della Svizzera', val: 'Franco', il: 'il franco svizzero', inn: 'in franchi' }, en: { paese: 'Switzerland', di: 'Switzerland', val: 'Franc', il: 'the Swiss franc', la: 'the franc' } },
    { id: 'cn', it: { paese: 'Cina', di: 'della Cina', val: 'Yuan', il: 'lo yuan (renminbi)', inn: 'in yuan' }, en: { paese: 'China', di: 'China', val: 'Yuan', il: 'the yuan (renminbi)', la: 'the yuan' } },
    { id: 'in', it: { paese: 'India', di: 'dell\'India', val: 'Rupia', il: 'la rupia indiana', inn: 'in rupie' }, en: { paese: 'India', di: 'India', val: 'Rupee', il: 'the Indian rupee', la: 'the rupee' } },
    { id: 'br', it: { paese: 'Brasile', di: 'del Brasile', val: 'Real', il: 'il real', inn: 'in real' }, en: { paese: 'Brazil', di: 'Brazil', val: 'Real', il: 'the real', la: 'the real' } },
    { id: 'mx', it: { paese: 'Messico', di: 'del Messico', val: 'Peso', il: 'il peso messicano', inn: 'in pesos' }, en: { paese: 'Mexico', di: 'Mexico', val: 'Peso', il: 'the Mexican peso', la: 'the peso' } },
    { id: 'za', it: { paese: 'Sudafrica', di: 'del Sudafrica', val: 'Rand', il: 'il rand', inn: 'in rand' }, en: { paese: 'South Africa', di: 'South Africa', val: 'Rand', il: 'the rand', la: 'the rand' } },
    { id: 'kr', it: { paese: 'Corea del Sud', di: 'della Corea del Sud', val: 'Won', il: 'il won', inn: 'in won' }, en: { paese: 'South Korea', di: 'South Korea', val: 'Won', il: 'the won', la: 'the won' } },
    { id: 'pl', it: { paese: 'Polonia', di: 'della Polonia', val: 'Zloty', il: 'lo zloty', inn: 'in zloty' }, en: { paese: 'Poland', di: 'Poland', val: 'Zloty', il: 'the zloty', la: 'the zloty' } },
    { id: 'th', it: { paese: 'Thailandia', di: 'della Thailandia', val: 'Baht', il: 'il baht', inn: 'in baht' }, en: { paese: 'Thailand', di: 'Thailand', val: 'Baht', il: 'the baht', la: 'the baht' } },
    { id: 'se', it: { paese: 'Svezia', di: 'della Svezia', val: 'Corona', il: 'la corona svedese', inn: 'in corone' }, en: { paese: 'Sweden', di: 'Sweden', val: 'Krona', il: 'the Swedish krona', la: 'the krona' } }
  ];
  // Indici di Borsa: indice (indice → paese) e borsa (paese → indice).
  const INDICI = [
    { id: 'mib', nome: 'FTSE MIB', it: { paese: 'Italia', agg: 'italiane', exp: 'Il **FTSE MIB** è l\'indice delle principali società della Borsa di Milano.' }, en: { paese: 'Italy', agg: 'Italian', exp: 'The **FTSE MIB** is the index of the leading companies on the Milan stock exchange.' } },
    { id: 'dax', nome: 'DAX', it: { paese: 'Germania', agg: 'tedesche', exp: 'Il **DAX** è l\'indice delle principali società della Borsa di Francoforte.' }, en: { paese: 'Germany', agg: 'German', exp: 'The **DAX** is the index of the leading companies on the Frankfurt stock exchange.' } },
    { id: 'cac', nome: 'CAC 40', it: { paese: 'Francia', agg: 'francesi', exp: 'Il **CAC 40** è l\'indice delle principali società della Borsa di Parigi.' }, en: { paese: 'France', agg: 'French', exp: 'The **CAC 40** is the index of the leading companies on the Paris stock exchange.' } },
    { id: 'ftse', nome: 'FTSE 100', it: { paese: 'Regno Unito', agg: 'britanniche', exp: 'Il **FTSE 100** è l\'indice delle principali società della Borsa di Londra.' }, en: { paese: 'United Kingdom', agg: 'British', exp: 'The **FTSE 100** is the index of the leading companies on the London Stock Exchange.' } },
    { id: 'ibex', nome: 'IBEX 35', it: { paese: 'Spagna', agg: 'spagnole', exp: 'L\'**IBEX 35** è l\'indice delle principali società della Borsa di Madrid.' }, en: { paese: 'Spain', agg: 'Spanish', exp: 'The **IBEX 35** is the index of the leading companies on the Madrid stock exchange.' } },
    { id: 'nikkei', nome: 'Nikkei 225', it: { paese: 'Giappone', agg: 'giapponesi', exp: 'Il **Nikkei 225** è l\'indice più seguito della Borsa di Tokyo.' }, en: { paese: 'Japan', agg: 'Japanese', exp: 'The **Nikkei 225** is the most widely followed index of the Tokyo Stock Exchange.' } },
    { id: 'sp500', nome: 'S&P 500', it: { paese: 'Stati Uniti', agg: 'americane', exp: 'L\'**S&P 500** raccoglie 500 grandi società quotate negli Stati Uniti.' }, en: { paese: 'United States', agg: 'U.S.', exp: 'The **S&P 500** covers 500 large companies listed in the United States.' } },
    { id: 'smi', nome: 'SMI', it: { paese: 'Svizzera', agg: 'svizzere', exp: 'L\'**SMI** (Swiss Market Index) è l\'indice delle principali società quotate in Svizzera.' }, en: { paese: 'Switzerland', agg: 'Swiss', exp: 'The **SMI** (Swiss Market Index) is the index of the leading companies listed in Switzerland.' } },
    { id: 'aex', nome: 'AEX', it: { paese: 'Paesi Bassi', agg: 'olandesi', exp: 'L\'**AEX** è l\'indice delle principali società della Borsa di Amsterdam.' }, en: { paese: 'Netherlands', agg: 'Dutch', exp: 'The **AEX** is the index of the leading companies on the Amsterdam stock exchange.' } },
    { id: 'ibov', nome: 'Ibovespa', it: { paese: 'Brasile', agg: 'brasiliane', exp: 'L\'**Ibovespa** è l\'indice principale della Borsa di San Paolo.' }, en: { paese: 'Brazil', agg: 'Brazilian', exp: 'The **Ibovespa** is the main index of the São Paulo stock exchange.' } },
    { id: 'kospi', nome: 'KOSPI', it: { paese: 'Corea del Sud', agg: 'sudcoreane', exp: 'Il **KOSPI** è l\'indice principale della Borsa della Corea del Sud.' }, en: { paese: 'South Korea', agg: 'South Korean', exp: 'The **KOSPI** is the main index of the South Korean stock exchange.' } },
    { id: 'sensex', nome: 'Sensex', it: { paese: 'India', agg: 'indiane', exp: 'Il **Sensex** è l\'indice più noto della Borsa di Mumbai.' }, en: { paese: 'India', agg: 'Indian', exp: 'The **Sensex** is the best-known index of the Bombay Stock Exchange in Mumbai.' } }
  ];
  const perId = lista => { const m = {}; lista.forEach(x => { m[x.id] = x; }); return m; };
  const P_ID = perId(PERSONE), E_ID = perId(EVENTI), M_ID = perId(MONETE), I_ID = perId(INDICI);
  const ULTIMO_ANNO = 2025;   // gli anni sbagliati non vanno oltre

  // uno giusto e due sbagliati presi dalla stessa tabella, poi mescolati
  function terna(R, lista) {
    const m = mescola(R, lista), giusto = m[0], o = mescola(R, [giusto, m[1], m[2]]);
    return { p: { f: giusto.id }, o: o.map(x => ({ k: x.id })), a: o.indexOf(giusto) };
  }
  const FATTI = {
    chi: { liv: 2, tema: 'storia', crea: R => terna(R, PERSONE) },
    cosa: { liv: 2, tema: 'storia', crea: R => terna(R, PERSONE) },
    moneta: { liv: 1, tema: 'mondo', crea: R => terna(R, MONETE) },
    paese: { liv: 1, tema: 'mondo', crea: R => terna(R, MONETE) },
    indice: { liv: 2, tema: 'mondo', crea: R => terna(R, INDICI) },
    borsa: { liv: 2, tema: 'mondo', crea: R => terna(R, INDICI) },
    quando: { liv: 3, tema: 'storia', crea: R => {
      const e = scegli(R, EVENTI), eta = 2026 - e.anno, largo = Math.max(8, Math.min(60, Math.round(eta * 0.15))), anni = [e.anno];
      for (let giri = 0; giri < 400 && anni.length < 3; giri++) {
        const y = e.anno + (R() < 0.5 ? -1 : 1) * (4 + Math.floor(R() * (largo - 3)));
        if (y > ULTIMO_ANNO || (e.evita || []).indexOf(y) >= 0 || anni.some(a => Math.abs(a - y) < 4)) continue;
        anni.push(y);
      }
      if (anni.length < 3) return null;
      const o = mescola(R, anni);
      return { p: { f: e.id }, o: o.map(y => ({ k: y === e.anno ? 'ok' : 'anno', v: y })), a: o.indexOf(e.anno) };
    } },
    prima: { liv: 3, tema: 'storia', crea: R => {
      for (let giri = 0; giri < 200; giri++) {
        const t = mescola(R, EVENTI).slice(0, 3);
        if (Math.abs(t[0].anno - t[1].anno) < 5 || Math.abs(t[0].anno - t[2].anno) < 5 || Math.abs(t[1].anno - t[2].anno) < 5) continue;
        const primo = t.slice().sort((x, y) => x.anno - y.anno)[0];
        return { p: { f: primo.id }, o: t.map(x => ({ k: x.id })), a: t.indexOf(primo) };
      }
      return null;
    } }
  };
  // le parole dei fatti, per lingua
  const nomeP = (x, en) => en && x.nomeEn ? x.nomeEn : x.nome;
  const PAROLE = {
    chi: (N, L, en) => { const x = P_ID[N.p.f]; return { q: x[L].q, options: N.o.map(o => nomeP(P_ID[o.k], en)), exp: x[L].exp }; },
    cosa: (N, L, en) => { const x = P_ID[N.p.f]; return { q: en ? (x.piu ? `What are ${nomeP(x, en)} known for?` : `What is ${nomeP(x, en)} known for?`) : (x.piu ? `Per che cosa sono ricordati ${x.nome}?` : `Per che cosa è ricordato ${x.nome}?`), options: N.o.map(o => P_ID[o.k][L].cosa), exp: x[L].exp }; },
    moneta: (N, L, en) => { const x = M_ID[N.p.f][L]; return { q: en ? `What is the official currency of ${x.di}?` : `Qual è la moneta ufficiale ${x.di}?`, options: N.o.map(o => M_ID[o.k][L].val), exp: en ? `The official currency of ${x.di} is **${x.il}**.` : `La moneta ufficiale ${x.di} è **${x.il}**.` }; },
    paese: (N, L, en) => { const x = M_ID[N.p.f][L]; return { q: en ? `Which of these countries uses ${x.la}?` : `In quale di questi paesi si paga ${x.inn}?`, options: N.o.map(o => M_ID[o.k][L].paese), exp: en ? `The official currency of **${x.di}** is ${x.il}.` : `La moneta ufficiale **${x.di}** è ${x.il}.` }; },
    indice: (N, L, en) => { const x = I_ID[N.p.f]; return { q: en ? `The ${x.nome} index follows the leading stocks of which country?` : `L'indice ${x.nome} raccoglie le principali azioni di quale paese?`, options: N.o.map(o => I_ID[o.k][L].paese), exp: x[L].exp }; },
    borsa: (N, L, en) => { const x = I_ID[N.p.f]; return { q: en ? `Which of these indexes follows the leading ${x[L].agg} stocks?` : `Quale di questi indici raccoglie le principali azioni ${x[L].agg}?`, options: N.o.map(o => I_ID[o.k].nome), exp: x[L].exp }; },
    quando: (N, L) => { const x = E_ID[N.p.f]; return { q: x[L].q, options: N.o.map(o => String(o.v)), exp: x[L].exp }; },
    prima: (N, L, en) => {
      const righe = N.o.map(o => E_ID[o.k]).sort((x, y) => x.anno - y.anno).map(x => `• ${x.anno}: ${x[L].nome}`).join('\n');
      return { q: en ? 'Which of these happened first?' : 'Quale di questi fatti è avvenuto per primo?', options: N.o.map(o => E_ID[o.k][L].nome), exp: (en ? 'In order of time:' : 'In ordine di tempo:') + '\n' + righe };
    }
  };

  // =====================================================================================================
  // LE DUE FUNZIONI CHE SI USANO DA FUORI
  // =====================================================================================================
  const LINGUE = ['it', 'en'];
  const tipi = Object.keys(STAMPI).map(id => ({ id, fam: 'calcolo', liv: STAMPI[id].liv, tema: STAMPI[id].tema, lab: STAMPI[id].lab || null })).concat(Object.keys(FATTI).map(id => ({ id, fam: 'fatti', liv: FATTI[id].liv, tema: FATTI[id].tema })));
  // il nucleo di una domanda: { v, t: tipo, s: seme, fam, liv, p: dati, o: risposte [{ k, v }], a: posizione della giusta }
  function crea(tipo, seme) {
    const s = seme >>> 0, R = caso(s), T = STAMPI[tipo], F = FATTI[tipo];
    const x = T ? creaCalcolo(T, R) : F ? F.crea(R) : null;
    return x ? { v: V, t: tipo, s, fam: T ? 'calcolo' : 'fatti', liv: (T || F).liv, p: x.p, o: x.o, a: x.a } : null;
  }
  // le parole: { q, options, ans, exp, note: per ogni risposta sbagliata la riga che dice quale errore è (o null), key, lang }
  function testo(N, lingua, valuta) {
    const L = LINGUE.indexOf(lingua) >= 0 ? lingua : 'it', W = penna(L, valuta), T = STAMPI[N.t];
    let r;
    if (T) {
      const ok = N.o[N.a].v;
      r = { q: T[L].q(N.p, W), options: N.o.map(o => W.valore(T.forma, o.v)), exp: T[L].exp(N.p, W, ok), note: N.o.map(o => o.k === 'ok' ? null : T[L].err[o.k]) };
    } else { r = PAROLE[N.t](N, L, W.en); r.note = N.o.map(() => null); }
    r.ans = N.a; r.key = `gen:${N.t}:${N.s}`; r.lang = L;
    return r;
  }
  // l'impronta di una domanda: due domande con la stessa impronta sono la stessa domanda (serve a non ripeterle in una partita)
  const GRUPPO = { chi: 'P', cosa: 'P', moneta: 'M', paese: 'M', indice: 'I', borsa: 'I', quando: 'E' };
  const impronta = N => N.t === 'prima' ? 'prima|' + N.o.map(o => o.k).sort().join('+') : GRUPPO[N.t] ? GRUPPO[N.t] + '|' + N.p.f : N.t + '|' + JSON.stringify(N.p);
  return { V, LINGUE, tipi, crea, testo, impronta, caso, giro, STAMPI, FATTI, tabelle: { PERSONE, EVENTI, MONETE, INDICI } };
})();
