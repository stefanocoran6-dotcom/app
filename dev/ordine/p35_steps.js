
// ---- passi interattivi delle lezioni: stima prima di leggere, leve con un obiettivo, metti a posto, metti in ordine, calcola ----
// I dati di ogni passo stanno nelle lezioni (campo "flow"); qui c'è come si vedono e come rispondono al tocco.
const NBSP = ' ';
// numeri all'italiana, scritti allo stesso modo su ogni telefono: 1.331 · 7,5 · 87.584
const grp = s => s.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const fmtN = (v, d = 0) => { const s = Math.abs(Number(v)).toFixed(d).split('.'); return (v < 0 ? '−' : '') + grp(s[0]) + (s[1] ? ',' + s[1] : ''); };
const withUnit = (v, unit, d = 0) => fmtN(v, d) + (unit === '%' ? '%' : unit ? NBSP + unit : '');
const eur0 = x => fmtN(Math.round(x)) + NBSP + '€';
const mesiTxt = m => { const a = Math.floor(m / 12), r = m % 12; return a ? plural(a, 'anno', 'anni') + (r ? ' e ' + plural(r, 'mese', 'mesi') : '') : plural(r, 'mese', 'mesi'); };

// cursore con i due tasti meno e più: il dito lo trascina, i tasti servono per il passo fine
function Slider({ value, min, max, step, onChange, label, disabled }) {
  const p = clamp((value - min) / (max - min) * 100, 0, 100);
  const set = x => onChange(clamp(Math.round(Math.round(x / step) * step * 100) / 100, min, max));
  return html`<div class="o-rowf" style="gap:10px">
    <button type="button" class="o-stepb" aria-label=${'Meno: ' + label} disabled=${!!disabled || value <= min} onClick=${() => set(value - step)}>${PathIco('M5 12h14', 18, 3.2)}</button>
    <input type="range" class="o-range o-grow" aria-label=${label} min=${min} max=${max} step=${step} value=${value} disabled=${!!disabled} style=${{ '--p': p + '%' }} onInput=${e => set(+e.target.value)} onChange=${e => set(+e.target.value)}/>
    <button type="button" class="o-stepb" aria-label=${'Più: ' + label} disabled=${!!disabled || value >= max} onClick=${() => set(value + step)}>${PathIco(D_PLUS, 18, 3.2)}</button></div>`;
}

// figura che accompagna una spiegazione: una o più barre divise in pezzi colorati, con la legenda sotto. Le barre crescono quando la pagina compare.
const FIG_COL = { az: AZ, pesca: PESCA, menta: MENTA, giallo: GIALLO, lilla: LILLA, rosa: ROSA, bianco: '#fff' };
function Fig({ fig }) {
  const [go, setGo] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGo(true), 80); return () => clearTimeout(t); }, []);
  const sum = r => r.segs.reduce((a, x) => a + x[0], 0), max = Math.max.apply(null, fig.rows.map(sum));
  const dot = c => html`<i style=${{ width: 12, height: 12, flex: 'none', borderRadius: 4, background: FIG_COL[c] || AZ, border: `2px solid ${INK}` }}></i>`;
  return html`<figure class="o-fig" role="img" aria-label=${fig.alt || fig.rows.map(r => r.lab + (r.val ? ' ' + r.val : '') + ': ' + r.segs.map(x => x[1] + (x[3] ? ' ' + x[3] : '')).join(', ')).join('. ')}>
    ${fig.rows.map((r, k) => html`<div key=${k} class="o-col" style="gap:6px">
      <div class="o-rowf" style="justify-content:space-between;gap:10px;align-items:baseline"><span class="o-t" style="font-weight:800">${r.lab}</span>${r.val && html`<span class="o-t" style="font-weight:800;white-space:nowrap">${r.val}</span>`}</div>
      <div class="o-figbar" style=${{ width: (go ? Math.max(8, sum(r) / max * 100) : 0) + '%' }}>${r.segs.map((x, j) => html`<i key=${j} style=${{ flex: x[0] + ' 1 0', background: FIG_COL[x[2]] || AZ, borderLeft: j ? `2.5px solid ${INK}` : 0 }}></i>`)}</div>
      <div class="o-rowf" style="flex-wrap:wrap;gap:4px 14px">${r.segs.map((x, j) => html`<span key=${j} class="o-s" style=${{ color: INK, display: 'inline-flex', alignItems: 'center', gap: 6 }}>${dot(x[2])}${x[1]}${x[3] ? ' ' + x[3] : ''}</span>`)}</div></div>`)}
    ${fig.cap && html`<figcaption class="o-s" style="margin-top:2px">${fig.cap}</figcaption>`}</figure>`;
}

// "Prima di leggere": una stima (cursore) o una scelta, senza voto. La spiegazione parte da quello che hai risposto.
function GuessStep({ st, top, onNext, scrollRef }) {
  const choice = Array.isArray(st.options);
  const [v, setV] = useState(choice ? null : st.min), [moved, setMoved] = useState(false), [locked, setLocked] = useState(false);
  const rev = useRef(null);
  useEffect(() => { if (locked && rev.current && rev.current.scrollIntoView) { try { rev.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) { /* niente */ } } }, [locked]);
  const u = x => withUnit(x, st.unit, st.dec || 0);
  const right = choice ? v === st.ans : Math.abs(v - st.truth) <= st.near;
  const verdict = choice ? (right ? 'Ci hai visto giusto' : 'Non proprio') : right ? 'Quasi centrato' : v > st.truth ? 'Meno di quanto pensavi' : 'Più di quanto pensavi';
  const pos = x => clamp((x - st.min) / (st.max - st.min) * 100, 0, 100);
  const mark = (x, bg, round) => html`<i style=${{ position: 'absolute', top: '50%', left: pos(x) + '%', width: round ? 24 : 20, height: round ? 24 : 20, marginLeft: round ? -12 : -10, marginTop: round ? -12 : -10, background: bg, border: `2.5px solid ${INK}`, borderRadius: round ? '50%' : 5, transform: round ? 'none' : 'rotate(45deg)' }}></i>`;
  const box = (lab, val, bg) => html`<div class="o-col o-grow" style=${{ padding: '10px 12px', border: `2px solid ${INK}`, borderRadius: 14, background: bg }}><span class="o-s" style=${{ color: INK }}>${lab}</span><span style="font-size:26px;line-height:32px;font-weight:800;white-space:nowrap">${val}</span></div>`;
  const body = html`<div class="o-pad" style="padding-top:18px;padding-bottom:24px">
    <div class="o-rowf" style="gap:8px;align-items:flex-end;margin:-4px 0 12px -6px"><${Rally} pose=${!locked ? 'pensa' : right ? 'giusto' : 'insegna'} w=${92} style=${{ flex: 'none' }}/>
      <span class="o-bub" aria-live="polite">${!locked ? 'Prima di leggere: tu che dici?' : right ? 'Bel colpo!' : 'Guardiamo insieme il conto.'}</span></div>
    <${Rich} text=${st.q} cls="q"/>
    ${choice ? html`<div class="o-col" style="gap:10px;margin-top:16px">${st.options.map((o, k) => html`<${Opt} key=${k} letter=${L3[k]} text=${o}
        state=${!locked ? (v === k ? 'sel' : '') : k === st.ans ? 'ok' : k === v ? 'sel' : 'dim'} note=${k === v ? 'La tua scelta' : locked && k === st.ans ? 'Quella giusta' : null} disabled=${locked} onClick=${() => setV(k)}/>`)}</div>`
    : !locked ? html`<div class="o-card s o-col" style="margin-top:18px;padding:16px 16px 18px;gap:12px">
        <div class="o-col" style="align-items:center"><span class="o-s">La tua stima</span><span class="o-bign" aria-live="polite">${moved ? u(v) : '?'}</span></div>
        <${Slider} value=${v} min=${st.min} max=${st.max} step=${st.step} label="La tua stima" onChange=${x => { setV(x); setMoved(true); }}/>
        <div class="o-rowf" style="justify-content:space-between;padding:0 50px"><span class="o-s">${u(st.min)}</span><span class="o-s">${u(st.max)}</span></div></div>`
    : html`<div class="o-card s o-col" style="margin-top:18px;padding:16px 16px 14px;gap:12px">
        <div class="o-rowf" style="gap:10px;align-items:stretch">${box('La tua stima', u(v), '#fff')}${box('Il conto', u(st.truth), MENTA)}</div>
        <div role="img" aria-label=${`La tua stima è ${u(v)}, il conto dà ${u(st.truth)}`} style="position:relative;height:30px;margin:2px 14px 0">
          <i style="position:absolute;left:-14px;right:-14px;top:50%;height:12px;margin-top:-6px;background:#fff;border:2.5px solid ${INK};border-radius:99px"></i>${mark(v, '#fff', true)}${mark(st.truth, MENTA, false)}</div>
        <div class="o-rowf" style="justify-content:space-between"><span class="o-s">${u(st.min)}</span><span class="o-s">${u(st.max)}</span></div></div>`}
    ${locked && html`<div ref=${rev} class="o-in" style="margin-top:20px"><h2 style="font-size:24px;line-height:28px;font-weight:800;letter-spacing:-.02em">${verdict}</h2><div style="margin-top:6px"><${Rich} text=${st.after} cls="sm"/></div></div>`}
  </div>`;
  const foot = !locked ? html`<${Btn} cls="lg" disabled=${choice ? v == null : !moved} onClick=${() => setLocked(true)}>${choice ? 'Blocca la risposta' : 'Blocca la stima'}<//>` : html`<${Btn} cls="lg" onClick=${() => onNext()}>Continua<//>`;
  return html`<${Flow} scrollRef=${scrollRef} top=${top} foot=${foot}>${body}<//>`;
}

// i conti dietro le leve: ogni modello dice come si calcola e che cosa mostrare
const LEVERS = {
  // mutuo a rata costante, rate mensili: leve "tasso" (% annuo) e "anni"; parametro C = capitale
  mutuo: {
    calc: (v, p) => { const j = v.tasso / 1200, m = v.anni * 12, rata = j > 0 ? p.C * j / (1 - Math.pow(1 + j, -m)) : p.C / m; return { rata, interessi: rata * m - p.C, base: p.C }; },
    view: o => ({ lab: 'Rata mensile', big: eur0(o.rata), sideLab: 'Interessi in tutto', side: eur0(o.interessi), bar: [o.base, o.interessi], barLab: ['Capitale', 'Interessi'] })
  },
  // debito su carta rimborsato con una cifra fissa al mese: leva "rata"; parametri debito e tasso (% annuo, diviso 12 per il mese)
  carta: {
    calc: (v, p) => { const j = p.tasso / 1200; let B = p.debito, n = 0, tot = 0; if (v.rata <= B * j + 1e-9) return { mesi: 9999, interessi: 0, base: p.debito, mai: true };
      while (B > 0.005 && n < 1200) { const due = B * (1 + j), pay = Math.min(v.rata, due); B = due - pay; tot += pay; n++; } return { mesi: n, interessi: tot - p.debito, base: p.debito, mai: false }; },
    view: o => o.mai ? { lab: 'Tempo per chiudere', big: 'Mai', sideLab: 'Con questa cifra', side: 'paghi solo gli interessi', bar: null, barLab: ['Debito', 'Interessi'] }
      : { lab: 'Tempo per chiudere', big: mesiTxt(o.mesi), sideLab: 'Interessi in tutto', side: eur0(o.interessi), bar: [o.base, o.interessi], barLab: ['Debito', 'Interessi'] }
  },
  // versamenti regolari che rendono: leve "rata" (€ al mese) e "anni"; parametro tasso = rendimento annuo in %.
  // Il tasso è quello di un anno intero (il 5% l'anno resta 5% anche versando ogni mese); versamenti a fine mese.
  piano: {
    calc: (v, p) => { const m = v.anni * 12, j = Math.pow(1 + (p.tasso || 0) / 100, 1 / 12) - 1, tot = j > 0 ? v.rata * (Math.pow(1 + j, m) - 1) / j : v.rata * m; return { totale: tot, versato: v.rata * m, interessi: tot - v.rata * m, rata: v.rata, anni: v.anni }; },
    view: o => ({ lab: 'Quanto avrai', big: eur0(o.totale), sideLab: 'Versato da te', side: eur0(o.versato), bar: [o.versato, o.interessi], barLab: ['Versato', 'Rendimenti'], barCol: [MENTA, AZ] })
  },
  // obiettivo di risparmio senza interessi: leve "rata" (€ al mese) e "mesi"; parametro cifra = quanto serve
  obiettivo: {
    calc: (v, p) => { const messo = v.rata * v.mesi; return { messo, manca: Math.max(0, p.cifra - messo), rata: v.rata, mesi: v.mesi, cifra: p.cifra }; },
    view: o => ({ lab: 'Metti da parte', big: eur0(o.messo), sideLab: o.manca > 0 ? 'Ti manca ancora' : 'Obiettivo', side: o.manca > 0 ? eur0(o.manca) : 'raggiunto', bar: [Math.min(o.messo, o.cifra), o.manca], barLab: ['Messo da parte', 'Manca'], barCol: [MENTA, '#fff'] })
  },
  // budget del mese: leve "bisogni" e "desideri" (€ al mese); parametro entrate
  budget: {
    calc: (v, p) => { const r = p.entrate - v.bisogni - v.desideri; return { risparmio: r, quota: r / p.entrate * 100, bisogni: v.bisogni, desideri: v.desideri, spese: v.bisogni + v.desideri }; },
    view: o => ({ lab: 'Risparmio al mese', big: eur0(o.risparmio), sideLab: 'Quota delle entrate', side: fmtN(o.quota, 0) + '%', bar: o.risparmio >= 0 ? [o.spese, o.risparmio] : null, barLab: ['Spese', 'Risparmio'], barCol: ['#fff', MENTA] })
  },
  // soldi fermi mentre i prezzi salgono: leve "infl" (% annuo) e "anni"; parametro C = cifra ferma
  inflazione: {
    calc: (v, p) => { const reale = p.C / Math.pow(1 + v.infl / 100, v.anni); return { reale, perso: (1 - reale / p.C) * 100, persi: p.C - reale, infl: v.infl, anni: v.anni }; },
    view: o => ({ lab: 'Quello che comprano', big: eur0(o.reale), sideLab: "Potere d'acquisto perso", side: fmtN(o.perso, 0) + '%', bar: [o.reale, o.persi], barLab: ['Resta', 'Perso'], barCol: [AZ, PESCA] })
  },
  // costo di un conto corrente in un anno: leve "canone" (€ al mese), "ops" (operazioni a pagamento al mese), "giac" (giacenza media, €).
  // Parametri: op = costo di una operazione, bollo = imposta di bollo di un anno, soglia = giacenza media oltre la quale il bollo è dovuto
  conto: {
    calc: (v, p) => { const banca = 12 * v.canone + 12 * v.ops * p.op, bollo = v.giac > p.soglia ? p.bollo : 0; return { costo: banca + bollo, banca, bollo, canone: v.canone, ops: v.ops, giac: v.giac }; },
    view: o => ({ lab: 'Costo in un anno', big: eur0(o.costo), sideLab: 'Canone e operazioni', side: eur0(o.banca), side2Lab: 'Imposta di bollo', side2: o.bollo > 0 ? fmtN(o.bollo, 2) + NBSP + '€' : 'non dovuta',
      bar: o.costo > 0 ? [o.banca, o.bollo] : null, barLab: ['Alla banca', 'Allo Stato'], barCol: [AZ, PESCA] })
  },
  // garanzia dei depositi: leve "a" (conto tuo in banca A), "co" (conto cointestato in due, banca A), "b" (conto tuo in banca B); parametro lim = limite per persona e per banca.
  // Il cointestato conta per metà; la tua parte in banca A è il tuo conto più quella metà.
  garanzia: {
    calc: (v, p) => { const parteA = v.a + v.co / 2, protA = Math.min(p.lim, parteA), protB = Math.min(p.lim, v.b); return { fuori: parteA - protA + v.b - protB, protetti: protA + protB, tuoi: parteA + v.b, parteA, b: v.b }; },
    view: o => ({ lab: 'Fuori dalla garanzia', big: eur0(o.fuori), sideLab: 'La tua parte in banca A', side: eur0(o.parteA), side2Lab: 'I tuoi soldi in tutto', side2: eur0(o.tuoi),
      bar: o.tuoi > 0 ? [o.protetti, o.fuori] : null, barLab: ['Protetti', 'Fuori'], barCol: [MENTA, PESCA] })
  },
  // dal lordo al netto, regole 2026 (fonti in FONTI_BASI.md): leva "ral". Dipendente privato senza familiari a carico, residente a Milano, 13 mensilità.
  // Contributi 9,19% (+1% oltre 56.224 €), IRPEF 23/33/43%, detrazione per lavoro dipendente, taglio del cuneo (somma fino a 20.000 €, detrazione fino a 40.000 €), addizionali di Lombardia e Milano.
  netto: {
    calc: (v, p) => { const N = STIP.netto(v.ral), N2 = STIP.netto(v.ral + 1000), mens = (p && p.mens) || 13;
      return { netto: N.annuo / mens, annuo: N.annuo, contributi: N.contr, imposte: v.ral - N.contr - N.annuo, trattenute: v.ral - N.annuo, resta: N2.annuo - N.annuo, ral: v.ral }; },
    view: o => ({ lab: 'Netto al mese', big: eur0(o.netto), sideLab: 'Trattenute in un anno', side: eur0(o.trattenute), side2Lab: 'Di 1.000 € lordi in più ti restano', side2: eur0(o.resta),
      bar: [o.annuo, o.trattenute], barLab: ['A te', 'Contributi e imposte'], barCol: [MENTA, PESCA] })
  },
  // IRPEF lorda a scaglioni 2026: leva "reddito" (imponibile). media10 = aliquota media in decimi di punto, per gli obiettivi
  irpef: {
    calc: v => { const im = STIP.irpef(v.reddito), marg = v.reddito > 50000 ? 43 : v.reddito > 28000 ? 33 : 23; return { imposta: im, media: im / v.reddito * 100, media10: im / v.reddito * 1000, marginale: marg, resto: v.reddito - im, reddito: v.reddito }; },
    view: o => ({ lab: 'IRPEF lorda', big: eur0(o.imposta), sideLab: 'Aliquota media', side: fmtN(o.media, 1) + '%', side2Lab: "Aliquota sull'ultimo euro", side2: o.marginale + '%',
      bar: [o.imposta, o.resto], barLab: ['Imposta', 'Resto del reddito'], barCol: [PESCA, '#fff'] })
  },
  // quanto vale uno sconto fiscale: leve "reddito" (imponibile) e "spesa". Deduzione = imposta in meno togliendo la spesa dal reddito; detrazione = 19% della spesa
  sconto: {
    calc: v => { const ded = STIP.irpef(v.reddito) - STIP.irpef(Math.max(0, v.reddito - v.spesa)), det = 0.19 * v.spesa; return { ded, det, rapporto100: det > 0 ? ded / det * 100 : 0, reddito: v.reddito, spesa: v.spesa }; },
    view: o => ({ lab: 'Se la deduci, risparmi', big: eur0(o.ded), sideLab: 'Se la detrai al 19%, risparmi', side: eur0(o.det), bar: [Math.min(o.ded, o.det), Math.abs(o.ded - o.det)], barLab: ['Detrazione', 'In più con la deduzione'], barCol: [AZ, MENTA] })
  },
  // TFR lasciato in azienda: leve "ral", "anni", "infl" (inflazione annua in %). Quota annua = RAL / 13,5 meno lo 0,5% della RAL;
  // ogni anno quello che c'era a fine anno prima si rivaluta dell'1,5% più il 75% dell'inflazione, meno l'imposta del 17% sulla rivalutazione. RAL costante.
  tfr: {
    calc: (v, p) => { const ral = v.ral != null ? v.ral : p.ral, quota = ral / 13.5 - 0.005 * ral, lordo = 1.5 + 0.75 * v.infl, riv = lordo * 0.83; let T = 0; for (let k = 0; k < v.anni; k++) T = T * (1 + riv / 100) + quota;
      return { tfr: T, versato: quota * v.anni, crescita: T - quota * v.anni, riv, scarto10: (riv - v.infl) * 10, quota, anni: v.anni, infl: v.infl }; },
    view: o => ({ lab: 'TFR maturato', big: eur0(o.tfr), sideLab: 'Rivalutazione netta di un anno', side: fmtN(o.riv, 2) + '%', side2Lab: "Rispetto all'inflazione", side2: (o.riv - o.infl >= 0 ? '+' : '') + fmtN(o.riv - o.infl, 2) + ' punti',
      bar: [o.versato, o.crescita], barLab: ['Quote annue', 'Rivalutazioni'], barCol: [AZ, MENTA] })
  },
  // acquisto a rate a tasso zero con spese: leve "pratica" (spese all'inizio, €), "incasso" (spesa per ogni rata, €), "mesi". Parametro prezzo.
  // Il TAEG è il tasso annuo che rende uguali la cifra finanziata (prezzo meno le spese iniziali) e le rate, spese comprese; si trova per tentativi.
  rate: {
    calc: (v, p) => { const rata = p.prezzo / v.mesi + v.incasso, netto = p.prezzo - v.pratica, costo = v.pratica + v.incasso * v.mesi; let lo = 0, hi = 1;
      if (costo > 0) for (let k = 0; k < 80; k++) { const m = (lo + hi) / 2; let pv = 0; for (let j = 1; j <= v.mesi; j++) pv += rata / Math.pow(1 + m, j); if (pv > netto) lo = m; else hi = m; }
      const taeg = costo > 0 ? (Math.pow(1 + lo, 12) - 1) * 100 : 0; return { taeg, taeg10: taeg * 10, costo, totale: p.prezzo + costo, prezzo: p.prezzo, mesi: v.mesi, pratica: v.pratica, incasso: v.incasso }; },
    view: o => ({ lab: 'TAEG', big: fmtN(o.taeg, 1) + '%', sideLab: 'Spese in tutto', side: eur0(o.costo), side2Lab: 'Totale pagato', side2: eur0(o.totale), bar: [o.prezzo, o.costo], barLab: ['Prezzo', 'Spese'], barCol: [AZ, PESCA] })
  },
  // cessione del quinto: leve "netto" (stipendio netto medio al mese), "anni", "taeg" (% annuo). La rata è un quinto del netto;
  // la somma che si riceve è il valore di oggi delle rate al TAEG scelto (tasso del mese = (1 + TAEG)^(1/12) - 1).
  quinto: {
    calc: v => { const rata = v.netto / 5, n = v.anni * 12, i = Math.pow(1 + v.taeg / 100, 1 / 12) - 1, somma = rata * (1 - Math.pow(1 + i, -n)) / i; return { rata, somma, totale: rata * n, costo: rata * n - somma, anni: v.anni, taeg: v.taeg }; },
    view: o => ({ lab: 'Somma che ricevi', big: eur0(o.somma), sideLab: 'Rata trattenuta ogni mese', side: eur0(o.rata), side2Lab: 'Restituisci in tutto', side2: eur0(o.totale), bar: [o.somma, o.costo], barLab: ['Ricevi', 'Costo del prestito'], barCol: [AZ, PESCA] })
  },
  // affitto o acquisto dopo un certo numero di anni: leve "anni", "affitto" (€ al mese), "crescita" (% annuo del valore della casa).
  // Parametri: prezzo, costi (% del prezzo pagata una volta), anticipo (%), tasso e anniMutuo, manut (% del prezzo all'anno), rend (% annuo che avrebbero reso i soldi impegnati).
  // Costo di comprare = costi d'acquisto + interessi pagati + manutenzione - aumento di valore + rendimento perso su anticipo e costi. Costo di affittare = affitti pagati.
  casa: {
    calc: (v, p) => { const M = p.prezzo * (1 - p.anticipo / 100), j = p.tasso / 1200, n = p.anniMutuo * 12, rata = M * j / (1 - Math.pow(1 + j, -n)), k = v.anni * 12;
      const D = M * Math.pow(1 + j, k) - rata * (Math.pow(1 + j, k) - 1) / j, interessi = rata * k - (M - D), fermo = p.prezzo * (p.anticipo + p.costi) / 100;
      const compra = p.prezzo * p.costi / 100 + interessi + p.prezzo * p.manut / 100 * v.anni - p.prezzo * (Math.pow(1 + v.crescita / 100, v.anni) - 1) + fermo * (Math.pow(1 + p.rend / 100, v.anni) - 1), affitta = v.affitto * 12 * v.anni;
      return { compra, affitta, diff: affitta - compra, anni: v.anni, affitto: v.affitto, crescita: v.crescita }; },
    view: o => ({ lab: o.diff >= 0 ? 'Comprando risparmi' : 'Affittando risparmi', big: eur0(Math.abs(o.diff)), sideLab: 'Costo di comprare', side: eur0(o.compra), side2Lab: 'Costo di affittare', side2: eur0(o.affitta),
      bar: o.compra > 0 ? [o.compra, o.affitta] : null, barLab: ['Comprare', 'Affittare'], barCol: [AZ, GIALLO] })
  },
  // quanto mutuo regge un reddito: leve "reddito" (netto al mese), "tasso" (% annuo), "anni". Rata = un terzo del reddito; il mutuo è l'80% del prezzo della casa.
  mutuomax: {
    calc: v => { const rata = v.reddito / 3, j = v.tasso / 1200, n = v.anni * 12, mutuo = rata * (1 - Math.pow(1 + j, -n)) / j; return { rata, mutuo, prezzo: mutuo / 0.8, interessi: rata * n - mutuo, anni: v.anni }; },
    view: o => ({ lab: 'Mutuo che puoi sostenere', big: eur0(o.mutuo), sideLab: 'Rata, un terzo del reddito', side: eur0(o.rata), side2Lab: 'Casa che ci compri, con il 20% tuo', side2: eur0(o.prezzo), bar: [o.mutuo, o.interessi], barLab: ['Mutuo', 'Interessi in tutto'] })
  },
  // cambiare mutuo: leve "tasso" (nuovo, % annuo) e "anni" (nuova durata). Parametri: debito che resta, anni che restano e tasso del mutuo di oggi.
  surroga: {
    calc: (v, p) => { const R = (C, t, a) => { const j = t / 1200; return C * j / (1 - Math.pow(1 + j, -a * 12)); }, vecchia = R(p.debito, p.vecchio, p.anni), nuova = R(p.debito, v.tasso, v.anni);
      return { nuova, vecchia, rispMese: vecchia - nuova, rispTot: vecchia * p.anni * 12 - nuova * v.anni * 12, intNuovi: nuova * v.anni * 12 - p.debito, debito: p.debito }; },
    view: o => ({ lab: 'Rata nuova', big: eur0(o.nuova), sideLab: 'Rispetto alla rata di oggi', side: (o.rispMese >= 0 ? '−' : '+') + eur0(Math.abs(o.rispMese)), side2Lab: o.rispTot >= 0 ? 'Interessi in meno, in tutto' : 'Interessi in più, in tutto', side2: eur0(Math.abs(o.rispTot)),
      bar: [o.debito, o.intNuovi], barLab: ['Debito', 'Interessi da pagare'] })
  },
  // pensione con il metodo contributivo, in euro di oggi: leve "ral" (stipendio lordo medio di un anno), "anni" (di contributi), "eta" (età alla pensione).
  // Montante = 33% dello stipendio per ogni anno di lavoro (contributi rivalutati quanto i prezzi); pensione di un anno = montante × coefficiente dell'età (valori 2025-2026).
  pensione: {
    calc: v => { const K = { 57: 4.204, 58: 4.308, 59: 4.419, 60: 4.536, 61: 4.661, 62: 4.795, 63: 4.936, 64: 5.088, 65: 5.25, 66: 5.423, 67: 5.608, 68: 5.808, 69: 6.024, 70: 6.258, 71: 6.51 };
      const montante = 0.33 * v.ral * v.anni, coeff = K[v.eta], pensione = montante * coeff / 100; return { montante, coeff, pensione, mese: pensione / 13, tasso: pensione / v.ral * 100, manca: Math.max(0, v.ral - pensione), anni: v.anni, eta: v.eta, ral: v.ral }; },
    view: o => ({ lab: 'Pensione lorda al mese', big: eur0(o.mese), sideLab: 'In percentuale dello stipendio', side: fmtN(o.tasso, 0) + '%', side2Lab: 'Montante messo da parte', side2: eur0(o.montante),
      bar: [o.pensione, o.manca], barLab: ["Pensione di un anno", 'Differenza con lo stipendio'], barCol: [AZ, PESCA] })
  },
  // fondo pensione: leve "versi" (€ al mese tuoi), "anni", "isc" (costo annuo in %). Parametri: tfr (€ al mese che entra comunque), soglia (versamento minimo per avere il contributo del datore),
  // datore (€ al mese), rend (% annuo prima dei costi), aliq (% di IRPEF risparmiata sui tuoi versamenti). Capitale prima delle imposte.
  fondo: {
    calc: (v, p) => { const dat = v.versi >= p.soglia ? p.datore : 0, c = p.tfr + v.versi + dat, n = v.anni * 12, F = r => { const i = Math.pow(1 + r / 100, 1 / 12) - 1; return Math.abs(i) < 1e-9 ? c * n : c * (Math.pow(1 + i, n) - 1) / i; };
      const capitale = F(p.rend - v.isc), pieno = F(p.rend), tuoi = v.versi * n, fisco = tuoi * p.aliq / 100;
      return { capitale, persi: pieno - capitale, tuoi, fisco, costo: tuoi - fisco, datoreTot: dat * n, tfrTot: p.tfr * n, isc10: v.isc * 10, versi: v.versi, anni: v.anni }; },
    view: o => ({ lab: 'Capitale alla pensione', big: eur0(o.capitale), sideLab: 'Versi tu, tolto lo sconto fiscale', side: eur0(o.costo), side2Lab: 'Aggiunge il datore', side2: eur0(o.datoreTot),
      bar: [o.capitale, o.persi], barLab: ['Capitale', 'Mangiato dai costi'], barCol: [AZ, PESCA] })
  },
  // TFR in azienda o nel fondo pensione, al netto delle imposte finali: leve "anni", "rend" (% annuo netto del fondo), "infl" (inflazione annua in %). Parametri: ral, aliqTfr (% sul TFR in azienda).
  // Azienda: quota annua rivalutata dell'1,5% più il 75% dell'inflazione, meno il 17%; alla fine imposta aliqTfr sulle quote. Fondo: stessa quota al rendimento scelto;
  // alla fine sulle quote si paga il 15%, meno 0,3 punti per ogni anno oltre il quindicesimo, con un minimo del 9%.
  tfrscelta: {
    calc: (v, p) => { const quota = p.ral / 13.5 - 0.005 * p.ral, riv = (1.5 + 0.75 * v.infl) * 0.83, vers = quota * v.anni; let A = 0, F = 0; for (let k = 0; k < v.anni; k++) { A = A * (1 + riv / 100) + quota; F = F * (1 + v.rend / 100) + quota; }
      const aliqF = Math.max(9, 15 - 0.3 * Math.max(0, v.anni - 15)), az = A - vers * p.aliqTfr / 100, fo = F - vers * aliqF / 100;
      return { az, fo, diff: fo - az, aliqF, riv, anni: v.anni, infl: v.infl, infl10: v.infl * 10, rend: v.rend }; },
    view: o => ({ lab: o.diff >= 0 ? 'Il fondo ti dà in più' : "L'azienda ti dà in più", big: eur0(Math.abs(o.diff)), sideLab: 'TFR in azienda, netto', side: eur0(o.az), side2Lab: 'TFR nel fondo, netto', side2: eur0(o.fo),
      bar: [o.az, o.fo], barLab: ['In azienda', 'Nel fondo'], barCol: [GIALLO, AZ] })
  },
  // mercato del lavoro su 100 persone tra 15 e 64 anni: leve "occ" (occupati) e "dis" (disoccupati: non lavorano e cercano lavoro). Gli altri sono inattivi.
  lavoro: {
    calc: v => { const forze = v.occ + v.dis, tasso = v.dis / forze * 100; return { tasso, tasso10: tasso * 10, occ: v.occ, dis: v.dis, inattivi: 100 - forze, forze }; },
    view: o => ({ lab: 'Tasso di disoccupazione', big: fmtN(o.tasso, 1) + '%', sideLab: 'Tasso di occupazione', side: fmtN(o.occ, 0) + '%', side2Lab: 'Inattivi: non lavorano e non cercano', side2: fmtN(o.inattivi, 0) + ' su 100',
      bar: [o.occ, o.dis + o.inattivi], barLab: ['Occupati', 'Senza lavoro: disoccupati e inattivi'], barCol: [MENTA, GIALLO] })
  },
  // debito pubblico in rapporto al PIL dopo "anni" anni: leve "crescita" (PIL nominale, % annuo), "tasso" (costo medio del debito, %), "primario" (saldo prima degli interessi, % del PIL: positivo = avanzo).
  // Ogni anno: debito = debito × (1 + tasso) / (1 + crescita) − primario. Parametri: debito (% del PIL di partenza), anni.
  debito: {
    calc: (v, p) => { let d = p.debito; for (let k = 0; k < p.anni; k++) d = d * (1 + v.tasso / 100) / (1 + v.crescita / 100) - v.primario; const interessi = p.debito * v.tasso / 100;
      return { finale: d, delta: d - p.debito, interessi, deficit: interessi - v.primario, crescita: v.crescita, tasso: v.tasso, primario: v.primario, debito: p.debito }; },
    view: o => ({ lab: 'Debito tra dieci anni, sul PIL', big: fmtN(o.finale, 0) + '%', sideLab: 'Spesa per interessi, sul PIL', side: fmtN(o.interessi, 1) + '%', side2Lab: 'Deficit del primo anno, sul PIL', side2: fmtN(o.deficit, 1) + '%',
      bar: [o.debito, Math.max(0, o.finale)], barLab: ['Oggi', 'Tra dieci anni'], barCol: [GIALLO, AZ] })
  },
  // indice di Borsa pesato per valore di mercato, con tre società: leve "a", "b", "c" (variazione del giorno di ciascuna, in %). Parametri pa, pb, pc: i pesi, che sommano a 100.
  indice: {
    calc: (v, p) => { const ind = (p.pa * v.a + p.pb * v.b + p.pc * v.c) / 100, su = (v.a > 0 ? 1 : 0) + (v.b > 0 ? 1 : 0) + (v.c > 0 ? 1 : 0), media = (v.a + v.b + v.c) / 3; return { ind, ind10: ind * 10, media, su, a: v.a, b: v.b, c: v.c }; },
    view: o => ({ lab: "L'indice oggi", big: (o.ind > 0 ? '+' : '') + fmtN(o.ind, 1) + '%', sideLab: 'Titoli in rialzo', side: o.su + ' su 3', side2Lab: 'Media semplice dei tre', side2: (o.media > 0 ? '+' : '') + fmtN(o.media, 1) + '%', bar: null })
  }
};
// i conti dello stipendio 2026, usati dalle leve "netto", "irpef" e "sconto" (stesse formule di dev/ordine/FONTI_BASI.md)
const STIP = {
  irpef: x => 0.23 * Math.min(x, 28000) + 0.33 * Math.max(0, Math.min(x, 50000) - 28000) + 0.43 * Math.max(0, x - 50000),
  detrLav: r => (r <= 15000 ? 1955 : r <= 28000 ? 1910 + 1190 * (28000 - r) / 13000 : r <= 50000 ? 1910 * (50000 - r) / 22000 : 0) + (r > 25000 && r <= 35000 ? 65 : 0),
  cuneoDetr: r => (r > 20000 && r <= 32000 ? 1000 : r > 32000 && r <= 40000 ? 1000 * (40000 - r) / 8000 : 0),
  cuneoBonus: r => (r > 20000 ? 0 : r * (r <= 8500 ? 0.071 : r <= 15000 ? 0.053 : 0.048)),
  addReg: r => 0.0123 * Math.min(r, 15000) + 0.0158 * Math.max(0, Math.min(r, 28000) - 15000) + 0.0172 * Math.max(0, Math.min(r, 50000) - 28000) + 0.0173 * Math.max(0, r - 50000),
  addCom: r => (r <= 23000 ? 0 : 0.008 * r),
  netto: ral => { const contr = 0.0919 * ral + 0.01 * Math.max(0, ral - 56224), r = ral - contr, lorda = STIP.irpef(r), irpef = Math.max(0, lorda - STIP.detrLav(r) - STIP.cuneoDetr(r)), add = STIP.addReg(r) + STIP.addCom(r);
    return { contr, imp: r, lorda, irpef, add, bonus: STIP.cuneoBonus(r), annuo: ral - contr - irpef - add + STIP.cuneoBonus(r) }; }
};
// "Muovi le leve": i numeri cambiano sotto il dito; si va avanti quando gli obiettivi sono raggiunti, uno alla volta
// La scheda con il risultato resta ferma in alto mentre scorri: su uno schermo basso si vedono insieme il numero e la leva che stai muovendo.
function LeverStep({ st, top, onNext, scrollRef }) {
  const M = LEVERS[st.model];
  const [vals, setVals] = useState(() => { const o = {}; st.sliders.forEach(s => { o[s.id] = s.start; }); return o; });
  const [got, setGot] = useState(0), [hint, setHint] = useState(false);
  const end = useRef(null);
  const o = M.calc(vals, st.params || {}), w = M.view(o), n = st.goals.length, all = got >= n;
  const test = g => g.cond.every(([k, op, x]) => { const y = Math.round(o[k]); return op === '<=' ? y <= x : op === '<' ? y < x : op === '>=' ? y >= x : y > x; });
  const sig = st.sliders.map(s => vals[s.id]).join('|');
  // l'obiettivo vale quando il cursore si ferma lì, non mentre ci passa sopra
  useEffect(() => { if (all || !test(st.goals[got])) return undefined; const t = setTimeout(() => setGot(g => g + 1), 380); return () => clearTimeout(t); }, [sig, got]);
  useEffect(() => { setHint(false); if (all) return undefined; const t = setTimeout(() => setHint(true), 14000); return () => clearTimeout(t); }, [got]);
  useEffect(() => { if (all && end.current && end.current.scrollIntoView) { try { end.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) { /* niente */ } } }, [all]);
  const tot = w.bar ? w.bar[0] + w.bar[1] : 1;
  const body = html`<div class="o-pad" style="padding-top:18px;padding-bottom:24px">
    <div class="o-col" style="gap:6px"><span class="o-lab">Muovi le leve</span><h1 class="o-q">${st.t}</h1><${Rich} text=${st.x} cls="sm"/></div>
    <div style="position:sticky;top:0;z-index:2;margin:6px -8px 0;padding:8px;background:#fff;box-shadow:0 8px 8px -2px #fff"><div class="o-card s o-col" style="padding:14px 16px 14px;gap:10px" aria-live="polite">
      <div class="o-col"><span class="o-s">${w.lab}</span><span class="o-bign" style="font-size:38px;line-height:44px">${w.big}</span></div>
      <div class="o-rowf" style="justify-content:space-between;gap:12px;padding-top:8px;border-top:2px solid ${SEP}"><span class="o-s">${w.sideLab}</span><span style="font-size:17px;line-height:22px;font-weight:800;text-align:right">${w.side}</span></div>
      ${w.side2Lab && html`<div class="o-rowf" style="justify-content:space-between;gap:12px;margin-top:-4px"><span class="o-s">${w.side2Lab}</span><span style="font-size:17px;line-height:22px;font-weight:800;text-align:right">${w.side2}</span></div>`}
      ${w.barLab && html`<div class="o-col" style=${{ gap: 4, opacity: w.bar ? 1 : 0.35 }}><div style=${{ display: 'flex', height: 16, border: `2px solid ${INK}`, borderRadius: 99, overflow: 'hidden', background: w.barCol ? w.barCol[1] : AZ }}>
          ${w.bar && html`<i style=${{ width: w.bar[0] / tot * 100 + '%', background: w.barCol ? w.barCol[0] : '#fff', borderRight: w.bar[1] > 0 ? `2px solid ${INK}` : 0 }}></i>`}</div>
        <div class="o-rowf" style="justify-content:space-between"><span class="o-s">${w.barLab[0]}</span><span class="o-s">${w.barLab[1]}</span></div></div>`}
    </div></div>
    <div class="o-col" style="gap:12px;margin-top:8px">${st.sliders.map(s => html`<div key=${s.id} class="o-col" style="gap:2px">
      <div class="o-rowf" style="justify-content:space-between"><span class="o-t">${s.label}</span><span class="o-t" style="font-weight:800">${withUnit(vals[s.id], s.unit, s.dec || 0)}</span></div>
      <${Slider} value=${vals[s.id]} min=${s.min} max=${s.max} step=${s.step} label=${s.label} onChange=${x => setVals(q => Object.assign({}, q, { [s.id]: x }))}/></div>`)}</div>
    <div class="o-col" style="gap:8px;margin-top:16px" aria-live="polite">
      ${st.goals.map((g, k) => k < got ? html`<div key=${k} class="o-goal ok"><span style="width:28px;height:28px;flex:none;display:flex;align-items:center;justify-content:center;background:${INK};border-radius:50%;color:#fff">${PathIco(D_CHECK, 16, 3.4)}</span><span class="o-t" style="font-weight:800">${g.label}</span></div>`
        : k === got ? html`<div key=${k} class="o-goal o-in">${Ico(Target, 26, 2.4)}<div class="o-col o-grow"><span class="o-s" style=${{ color: INK }}>Obiettivo${n > 1 ? ` ${k + 1} di ${n}` : ''}</span><span class="o-t" style="font-weight:800">${g.label}</span>
            ${hint && g.hint && html`<span class="o-s o-in" style=${{ color: INK, marginTop: 4 }}>${g.hint}</span>`}</div></div>` : null)}
    </div>
    ${all && html`<div ref=${end} class="o-in o-note" style="margin-top:12px">${st.after}</div>`}
  </div>`;
  return html`<${Flow} scrollRef=${scrollRef} top=${top} foot=${html`<${Btn} cls="lg" disabled=${!all} onClick=${() => onNext()}>Continua<//>`}>${body}<//>`;
}

// "Metti al posto giusto": una voce alla volta, da toccare nel contenitore giusto. Se sbagli, sotto compare il perché.
function BucketStep({ st, top, onNext, scrollRef }) {
  const order = useMemo(() => K.flShuffle(st.items.map((x, i) => i)), [st]);
  const [n, setN] = useState(0), [put, setPut] = useState([]), [miss, setMiss] = useState(0), [missed, setMissed] = useState(false), [flash, setFlash] = useState(null), [why, setWhy] = useState(null), [sh, setSh] = useState(0);
  const N = order.length, cur = n < N ? st.items[order[n]] : null, nb = st.buckets.length;
  const tap = b => {
    if (!cur || (flash && flash.ok)) return;
    if (b === cur[1]) { setFlash({ b, ok: true }); setWhy(null); setTimeout(() => { setFlash(null); setPut(p => p.concat(order[n])); setMissed(false); setN(x => x + 1); }, 240); }
    else { if (!missed) { setMissed(true); setMiss(m => m + 1); } setWhy(cur[2] || `Non va in “${st.buckets[b]}”.`); setSh(x => x + 1); setFlash({ b, ok: false }); setTimeout(() => setFlash(f => (f && !f.ok ? null : f)), 420); }
  };
  const card = { alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 16, minHeight: 104, padding: '14px 16px', border: `2.5px solid ${INK}`, borderRadius: 22, textAlign: 'center' };
  const body = html`<div class="o-pad" style="padding-top:18px;padding-bottom:24px">
    <div class="o-col" style="gap:6px"><span class="o-lab">Metti al posto giusto</span><h1 class="o-q">${st.t}</h1></div>
    ${cur ? html`<div key=${n + '-' + sh} class=${'o-col ' + (missed ? 'o-shake' : 'o-in')} style=${Object.assign({ background: T_AZ }, card)}>
        <span class="o-s" style=${{ color: INK }}>${n + 1} di ${N}</span><span style="font-size:20px;line-height:26px;font-weight:800;text-wrap:balance">${cur[0]}</span></div>`
      : html`<div class="o-col o-pop" style=${Object.assign({ background: MENTA }, card)}><span style="font-size:22px;line-height:28px;font-weight:800">Tutto a posto</span><span class="o-s" style=${{ color: INK }}>${N - miss} su ${N} al primo colpo</span></div>`}
    <div aria-live="polite" style=${Object.assign({ minHeight: 44, marginTop: 10, fontSize: 14, lineHeight: '20px', fontWeight: 700 }, why ? { padding: '10px 14px', background: T_ROSA, borderRadius: 14, color: INK } : { padding: '10px 2px', color: MUT })}><${Rich} text=${why || (cur ? 'Tocca il contenitore giusto.' : (st.after || ''))} cls="sm" style=${{ fontSize: 'inherit', lineHeight: 'inherit', fontWeight: 'inherit', color: 'inherit' }}/></div>
    <div style=${{ display: 'grid', gridTemplateColumns: `repeat(${nb}, minmax(0, 1fr))`, gap: 10, marginTop: 8 }}>
      ${st.buckets.map((name, b) => html`<button key=${b} type="button" class=${'o-bucket' + (flash && flash.b === b ? (flash.ok ? ' ok' : ' ko') : '')} disabled=${!cur} aria-label=${'Metti in: ' + name} onClick=${() => tap(b)}>
        <span style=${{ fontSize: nb > 2 ? 15 : 16, lineHeight: '20px', fontWeight: 800, textAlign: 'center', padding: '2px 0 4px' }}>${name}</span>
        ${put.filter(i => st.items[i][1] === b).map(i => html`<span key=${i} class="o-chip2 o-pop" style=${nb > 2 ? { padding: '5px 6px', fontSize: 12, lineHeight: '16px' } : null}>${st.items[i][0]}</span>`)}</button>`)}
    </div>
  </div>`;
  return html`<${Flow} scrollRef=${scrollRef} top=${top} foot=${html`<${Btn} cls="lg" disabled=${!!cur} onClick=${() => onNext()}>Continua<//>`}>${body}<//>`;
}

// "Metti in ordine": le voci sono mescolate, si toccano dalla prima all'ultima
function OrderStep({ st, top, onNext, scrollRef }) {
  const pool = useMemo(() => { const id = st.items.map((x, i) => i); let p = K.flShuffle(id), g = 0; while (p.every((x, i) => x === i) && g++ < 8) p = K.flShuffle(id); return p; }, [st]);
  const [n, setN] = useState(0), [bad, setBad] = useState(null);
  const N = st.items.length, done = n >= N;
  const tap = i => { if (i === n) setN(n + 1); else { setBad(i); setTimeout(() => setBad(null), 420); } };
  const body = html`<div class="o-pad" style="padding-top:18px;padding-bottom:24px">
    <div class="o-col" style="gap:6px"><span class="o-lab">Metti in ordine</span><h1 class="o-q">${st.t}</h1><p class="o-lab">${st.x || 'Tocca le voci dalla prima all\'ultima.'}</p></div>
    <div class="o-col" style="gap:8px;margin-top:16px">${st.items.map((t, k) => html`<div key=${k} class=${'o-rowf' + (k === n - 1 ? ' o-pop' : '')} style=${{ gap: 12, minHeight: 54, padding: '8px 12px', borderRadius: 16, border: k < n ? `2.5px solid ${INK}` : `2.5px dashed ${k === n ? INK : DIM}`, background: k < n ? MENTA : 'transparent' }}>
      <span style=${{ width: 30, height: 30, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: k < n ? INK : 'transparent', border: k < n ? 0 : `2px solid ${k === n ? INK : DIM}`, color: k < n ? '#fff' : k === n ? INK : DIMT, fontSize: 14, fontWeight: 800 }}>${k + 1}</span>
      <span class="o-t" style=${{ fontWeight: 800 }}>${k < n ? t : ''}</span></div>`)}</div>
    ${!done && html`<div class="o-col" style="gap:10px;margin-top:18px" aria-label="Voci da ordinare">${pool.filter(i => i >= n).map(i => html`<button key=${i} type="button" class=${'o-opt' + (bad === i ? ' ko o-shake' : '')} onClick=${() => tap(i)}><span class="x" style="text-align:center">${st.items[i]}</span></button>`)}</div>`}
    ${done && st.after && html`<div class="o-in o-note" style="margin-top:16px">${st.after}</div>`}
  </div>`;
  return html`<${Flow} scrollRef=${scrollRef} top=${top} foot=${html`<${Btn} cls="lg" disabled=${!done} onClick=${() => onNext()}>Continua<//>`}>${body}<//>`;
}

// "Calcola tu": il numero si scrive con il tastierino; vale come una domanda (punti e conteggio delle risposte giuste)
function NumStep({ st, l, top, onNext, repeat, scrollRef }) {
  const [s, setS] = useState(''), [fb, setFb] = useState(null);
  const dec = st.dec || 0;
  const press = k => { if (fb) return; setS(x => k === 'del' ? x.slice(0, -1) : k === ',' ? (dec && x && x.indexOf(',') < 0 ? x + ',' : x)
    : (x.replace(',', '').length >= 8 || (x.indexOf(',') >= 0 && x.split(',')[1].length >= dec)) ? x : x === '0' ? k : x + k); };
  const val = s ? parseFloat(s.replace(',', '.')) : NaN;
  const shown = s ? grp(s.split(',')[0]) + (s.indexOf(',') >= 0 ? ',' + (s.split(',')[1] || '') : '') : '';
  const ok = fb === 'ok', ansDec = (String(st.ans).split('.')[1] || '').length;
  const q = { key: l.key + '~' + st.n, exp: ok ? st.exp : `La risposta è **${withUnit(st.ans, st.unit, ansDec)}**.\n\n${st.exp || ''}` };
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', dec ? ',' : null, '0', 'del'];
  const body = html`<div class="o-pad" style="padding-top:18px;padding-bottom:20px"><div class="o-col" style="gap:6px"><span class="o-lab">Calcola tu</span><${Rich} text=${st.q} cls="q"/></div></div>`;
  const foot = html`<div class="o-col" style="gap:10px">
    <div class="o-numd" aria-live="polite" aria-label=${s ? `Hai scritto ${shown} ${st.unit}` : 'Scrivi il numero'}><span style=${{ color: s ? INK : DIM }}>${shown || '?'}</span><span style="font-size:22px;line-height:28px;font-weight:800">${st.unit}</span></div>
    <div class="o-keys">${keys.map((k, j) => k == null ? html`<span key=${j}></span>` : html`<button key=${j} type="button" class="o-key" aria-label=${k === 'del' ? 'Cancella' : k === ',' ? 'Virgola' : k} onClick=${() => press(k)}>${k === 'del' ? PathIco('M20 6H9l-6 6 6 6h11zM12 10l4 4M16 10l-4 4', 24, 2.2) : k}</button>`)}</div>
    <${Btn} cls="lg" disabled=${isNaN(val) || !!fb} onClick=${() => setFb(Math.abs(val - st.ans) <= (st.tol || 0) + 1e-9 ? 'ok' : 'ko')}>Controlla<//></div>`;
  const over = fb ? html`<${FeedbackSheet} ok=${ok} q=${q} xp=${repeat ? 5 : 10} onNext=${() => onNext({ ok })}/>` : null;
  return html`<${Flow} scrollRef=${scrollRef} top=${top} foot=${foot} over=${over}>${body}<//>`;
}
const ISTEPS = { guess: GuessStep, lever: LeverStep, bucket: BucketStep, order: OrderStep, num: NumStep };
