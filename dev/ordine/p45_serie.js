// =====================================================================================================
// LA SERIE: domande generate senza fine (motore in p44_motore.js). Tre errori e la partita finisce.
// =====================================================================================================
// Tutto sul telefono: niente rete, niente arbitro. Il record resta nei dati salvati (serie.best).
const SERIE_VITE = 3;
const D_CUORE = 'M12 20.5s-7.5-4.7-7.5-10.4A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.7c0 5.7-7.5 10.4-7.5 10.4z';
const D_SENZAFINE = 'M6.5 8.5C4.6 8.5 3 10.1 3 12s1.6 3.5 3.5 3.5c3.5 0 7.5-7 11-7 1.9 0 3.5 1.6 3.5 3.5s-1.6 3.5-3.5 3.5c-3.5 0-7.5-7-11-7z';
const semeNuovo = () => { try { return crypto.getRandomValues(new Uint32Array(1))[0]; } catch (e) { return Math.floor(Math.random() * 4294967296); } };
const serieStato = () => { const v = s2get().serie; return v && typeof v.best === 'number' ? v : { best: 0, n: 0, last: 0 }; };
// la domanda numero n (da 0): prima le facili, poi entrano le medie e le difficili; mai due volte di fila lo stesso tipo, mai lo stesso fatto in una partita
function serieDomanda(n, viste, ultimo) {
  const tetto = n < 4 ? 1 : n < 10 ? 2 : 3;
  const adatti = GEN.tipi.filter(t => t.liv <= tetto && t.id !== ultimo), alti = adatti.filter(t => t.liv === tetto);
  for (let giri = 0; giri < 80; giri++) {
    const rosa = alti.length && Math.random() < 0.5 ? alti : adatti;   // metà delle volte dal livello più alto raggiunto: così la partita sale
    const tipo = rosa[Math.floor(Math.random() * rosa.length)], N = GEN.crea(tipo.id, semeNuovo());
    if (!N || viste.has(GEN.impronta(N))) continue;
    viste.add(GEN.impronta(N));
    return Object.assign(GEN.testo(N, LANG, CUR), { tipo: tipo.id });
  }
  viste.clear(); return serieDomanda(n, viste, null);   // partita lunghissima, finite le domande nuove: si ricomincia a pescare
}
function SerieRun({ nav }) {
  useS2();
  const viste = useRef(new Set()), partenza = useRef(serieStato().best), scrollRef = useRef(null);
  const [q, setQ] = useState(() => serieDomanda(0, viste.current, null));
  const [n, setN] = useState(0), [okN, setOkN] = useState(0), [vite, setVite] = useState(SERIE_VITE), [sel, setSel] = useState(null), [fb, setFb] = useState(null), [tab, setTab] = useState('case'), [fine, setFine] = useState(false);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [n]);
  const best = serieStato().best;
  if (fine) {
    const record = okN > partenza.current;
    const ancora = () => { viste.current.clear(); partenza.current = serieStato().best; setQ(serieDomanda(0, viste.current, null)); setN(0); setOkN(0); setVite(SERIE_VITE); setSel(null); setFb(null); setFine(false); };
    return html`<${Flow} bg=${MENTA} top=${html`<${TopBar} onClose=${nav.back} title=""/>`}
      foot=${html`<${Btn} cls="lg" bg="#fff" onClick=${ancora}>Gioca ancora<//><div style="text-align:center;margin-top:6px"><button type="button" class="o-link" onClick=${nav.back}>Torna ad Allenati</button></div>`}>
      <div class="o-col o-pad" style="align-items:center;text-align:center;padding-top:6px"><${Rally} pose=${record ? 'festeggia' : 'pensa'} w=${250} alt=""/>
        <h1 class="o-pop" style="font-size:40px;line-height:44px;font-weight:800;letter-spacing:-.02em;margin-top:-6px">${record ? 'Nuovo record!' : 'Serie finita'}</h1>
        <p class="o-body" style="margin-top:8px;max-width:300px">${record ? (partenza.current > 0 ? `Prima il tuo record era ${partenza.current}.` : 'È la tua prima serie: da adesso è il numero da battere.') : okN === 0 ? 'Tre errori prima di una risposta giusta. Le spiegazioni servono a questo: riprova.' : `Il tuo record resta ${best}.`}</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;width:100%;margin-top:24px">
          <div class="o-col" style="padding:10px 14px;background:${GIALLO};border:2.5px solid ${INK};border-radius:18px;text-align:left"><span style="font-size:13px;font-weight:700">Risposte giuste</span><span style="font-size:22px;line-height:26px;font-weight:800">${okN}</span></div>
          <div class="o-col" style="padding:10px 14px;background:#fff;border:2.5px solid ${INK};border-radius:18px;text-align:left"><span class="o-s">Punti</span><span style="font-size:22px;line-height:26px;font-weight:800">+${okN * 5} XP</span></div></div>
      </div><//>`;
  }
  const locked = !!fb;
  const next = () => {
    if (vite <= 0) { s2set(s => ({ serie: Object.assign({}, serieStato(), { n: (serieStato().n || 0) + 1, last: okN }) })); return setFine(true); }
    const k = n + 1; setQ(serieDomanda(k, viste.current, q.tipo)); setN(k); setSel(null); setFb(null); setTab('case');
  };
  const check = () => {
    if (sel === q.ans) {
      const tot = okN + 1; setOkN(tot); addXp(5);
      if (tot > serieStato().best) s2set(s => ({ serie: Object.assign({}, serieStato(), { best: tot }) }));
      return setFb('ok');
    }
    setVite(v => v - 1); setFb('ko');   // nel gioco la spiegazione dopo un errore c'è sempre: non conta nel limite gratis del giorno
  };
  // dopo un errore la spiegazione comincia dalla riga che dice quale errore è (se la risposta scelta nasce da un errore tipico)
  const qFb = fb === 'ko' && q.note[sel] ? Object.assign({}, q, { exp: q.note[sel] + '\n\n' + q.exp }) : q;
  const cuori = html`<span class="o-rowf" role="img" aria-label=${`Vite rimaste: ${vite} su ${SERIE_VITE}`} style="gap:3px;flex:none">${[0, 1, 2].map(k => html`<span key=${k} style=${{ display: 'flex', opacity: k < vite ? 1 : 0.28 }}>${PathIco(D_CUORE, 22, 2.2, k < vite ? ROSA : 'none', INK)}</span>`)}</span>`;
  const over = fb === 'ok' ? html`<${FeedbackSheet} ok=${true} q=${qFb} xp=${5} onNext=${next}/>` : fb === 'ko' ? html`<${FeedbackSheet} ok=${false} q=${qFb} onNext=${next}/>` : null;
  return html`<${Flow} scrollRef=${scrollRef}
    top=${html`<${TopBar} onClose=${nav.back} mid=${html`<span class="o-grow" style="font-size:15px;line-height:20px;font-weight:800;white-space:nowrap">Giuste: ${okN}</span>`} right=${cuori}/>`}
    foot=${html`<div class="o-rowf" style="gap:12px"><${IBtn} lg=${true} icon=${Ico(Calculator, 24, 2.2)} onClick=${nav.openCalc} label="Calcolatrice"/><div class="o-grow"><${Btn} cls="lg" bg=${MENTA} disabled=${sel == null || locked} onClick=${check}>Controlla<//></div></div>`} over=${over}>
    <div class="o-test"><${QuestionBody} key=${n} q=${q} label=${`Domanda ${n + 1}`} sel=${sel} onSel=${setSel} locked=${locked} tab=${tab} setTab=${setTab}/></div><//>`;
}
