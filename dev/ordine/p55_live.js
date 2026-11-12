
// =====================================================================================================
// SFIDE DAL VIVO · modalità Lampo: due telefoni e un arbitro su Cloudflare (codice in sfide/)
// =====================================================================================================
// L'arbitro manda la stessa domanda ai due telefoni, riceve le risposte e decide chi prende il punto.
// Questo telefono misura il proprio tempo di reazione: da quando la domanda compare sullo schermo al tocco.
const SFIDE_HOST = 'finlearn-sfide.finlearn27.workers.dev';   // indirizzo dell'arbitro su Cloudflare
const SFIDE_LOCALE = /^(127\.0\.0\.1|localhost)$/.test(location.hostname);
const SFIDE_WS = SFIDE_LOCALE ? 'ws://127.0.0.1:8787' : 'wss://' + SFIDE_HOST;
const SFIDE_ON = SFIDE_LOCALE || !/SOTTODOMINIO/.test(SFIDE_HOST);
const SFIDE_V = 1;
const LIVE_RE = /^[A-HJ-NP-Z2-9]{6}$/;
const LIVE_CORSI = [
  { id: 'basi', name: 'Basi della finanza', sub: 'In italiano, 24 secondi per domanda' },
  { id: 'cfa2', name: 'CFA Level II', sub: 'In inglese come all\'esame, 45 secondi per domanda' }
];
// invito: il link …/app/#sfida=CODICE apre l'app e porta nella stanza (il codice si toglie subito dall'indirizzo)
const LIVE_INV = 'finlearn_sfida_invito', LIVE_PID = 'finlearn_sfide_pid';
try {
  const m = location.hash.match(/^#sfida=([A-Za-z0-9]{6})$/);
  if (m) { sessionStorage.setItem(LIVE_INV, m[1].toUpperCase()); history.replaceState(null, '', location.pathname + location.search); }
} catch (e) {}
function liveInvito() { try { const c = sessionStorage.getItem(LIVE_INV); sessionStorage.removeItem(LIVE_INV); return c && LIVE_RE.test(c) ? c : null; } catch (e) { return null; } }
// per ogni stanza il telefono ha un codice suo, segreto: serve per rientrare nello stesso posto se cade la connessione
function livePids() { try { return JSON.parse(localStorage.getItem(LIVE_PID) || '{}') || {}; } catch (e) { return {}; } }
function livePidSave(codice, pid) {
  try { const a = livePids(); delete a[codice]; a[codice] = pid; const k = Object.keys(a); k.slice(0, Math.max(0, k.length - 6)).forEach(x => { delete a[x]; }); localStorage.setItem(LIVE_PID, JSON.stringify(a)); } catch (e) {}
}
function liveNewPid() { const c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'; return Array.from(crypto.getRandomValues(new Uint8Array(20)), x => c[x & 63]).join(''); }
const liveSec = ms => (ms / 1000).toFixed(2).replace('.', ',') + ' s';
const liveGap = ms => { if (ms >= 1000) return liveSec(ms); const c = Math.max(1, Math.round(ms / 10)); return c === 1 ? '1 centesimo' : c + ' centesimi'; };
const livePts = n => (n < 0 ? '−' + Math.abs(n) : String(n));

// collegamento all'arbitro: si riapre da solo se cade (rete, app in secondo piano), con attese sempre più lunghe
class LiveConn {
  constructor(opt, onMsg, onNet) { this.opt = opt; this.onMsg = onMsg; this.onNet = onNet; this.codice = opt.codice || null; this.pid = (this.codice && livePids()[this.codice]) || liveNewPid(); this.ws = null; this.tent = 0; this.fermo = false; this.timer = null; this.hb = null; }
  url() { return SFIDE_WS + '/stanza?' + (this.codice ? 'codice=' + this.codice : 'nuova=1&corso=' + encodeURIComponent(this.opt.corso)); }
  apri() {
    if (this.fermo) return;
    clearTimeout(this.timer);
    let ws; try { ws = new WebSocket(this.url()); } catch (e) { this.riprova(); return; }
    this.ws = ws; this.onNet(this.tent ? 'ricollego' : 'collego');
    ws.onopen = () => { this.send({ t: 'ciao', pid: this.pid, nome: this.opt.nome, v: SFIDE_V }); clearInterval(this.hb); this.hb = setInterval(() => this.raw('{"t":"hb"}'), 20000); };
    ws.onmessage = ev => {
      let m = null; try { m = JSON.parse(ev.data); } catch (e) { return; }
      if (!m || m.t === 'hb') return;
      if (m.t === 'ping') { this.send({ t: 'pong', s: m.s }); return; }   // subito, prima di disegnare: misura la rete
      if (m.t === 'benvenuto') { this.codice = m.codice; livePidSave(m.codice, this.pid); this.tent = 0; this.onNet('ok'); }
      if (m.t === 'errore') this.fermo = true;
      this.onMsg(m, performance.now());
    };
    ws.onclose = ev => {
      clearInterval(this.hb); if (this.ws !== ws) return; this.ws = null;
      if (this.fermo || ev.code === 4000 || ev.code === 4001) { this.fermo = true; this.onNet('chiuso'); return; }
      this.riprova();
    };
  }
  riprova() {
    if (this.fermo) return;
    this.tent++;
    if (this.tent > 12) { this.fermo = true; this.onNet('irraggiungibile'); return; }
    this.onNet('ricollego');
    this.timer = setTimeout(() => this.apri(), Math.min(8000, 500 * Math.pow(1.6, this.tent)));
  }
  ora() { if (!this.fermo && (!this.ws || this.ws.readyState > 1)) { clearTimeout(this.timer); this.tent = Math.max(1, this.tent); this.apri(); } }
  send(o) { this.raw(JSON.stringify(o)); }
  raw(s) { try { if (this.ws && this.ws.readyState === 1) { this.ws.send(s); return true; } } catch (e) {} return false; }
  chiudi(esco) { if (esco) this.send({ t: 'esco' }); this.fermo = true; clearTimeout(this.timer); clearInterval(this.hb); const ws = this.ws; this.ws = null; try { if (ws) ws.close(1000); } catch (e) {} }
}

function LiveScreen({ nav, codice: cod0, nuova }) {
  const known = userName();
  const [vista, setVista] = useState(cod0 ? 'entra' : nuova ? 'scegli' : 'codice');
  // le domande arrivano dai percorsi che si hanno nell'app: chi non ha il CFA non lo vede tra le scelte
  const corsi = LIVE_CORSI.filter(c => inMyApp(c.id)).length ? LIVE_CORSI.filter(c => inMyApp(c.id)) : LIVE_CORSI;
  const [corso, setCorso] = useState(() => { const c = currentCourse(); return c && corsi.some(x => x.id === c.id) ? c.id : corsi[0].id; });
  const [cod, setCod] = useState(cod0 || ''), [nm, setNm] = useState(known);
  const [st, setSt] = useState({}), [net, setNet] = useState(''), [ask, setAsk] = useState(false), [xp, setXp] = useState(null), [, tick] = useState(0);
  const conn = useRef(null), last = useRef(null), t0 = useRef({}), pend = useRef(null), ioRef = useRef(0), xpDone = useRef(null);
  const nmOk = !!(firstName(nm) || known);

  const onMsg = (m, at) => {
    if (m.t === 'benvenuto') {
      setSt(s => Object.assign({}, s, { benv: m }));
    } else if (m.t === 'stanza') { ioRef.current = m.io; setSt(s => Object.assign({}, s, { stanza: m })); }
    else if (m.t === 'via') { t0.current = {}; pend.current = null; setSt(s => Object.assign({}, s, { via: at + m.ms, dom: null, esito: null, fine: null, chiusa: false, risp: {}, mia: null, storia: [] })); }
    else if (m.t === 'domanda') {
      // risposta data mentre la rete era caduta: si rimanda se la domanda è ancora aperta
      const p = pend.current; if (p && p.i === m.i && m.mia == null && conn.current) conn.current.send({ t: 'risposta', i: p.i, c: p.c, ms: p.ms });
      setSt(s => Object.assign({}, s, { dom: Object.assign({}, m, { at }), esito: s.esito && s.esito.i === m.i ? s.esito : null,
        risp: Object.fromEntries((m.altri || []).map(x => [x.p, x.ok])), mia: m.mia != null ? m.mia : (p && p.i === m.i ? p.c : (s.dom && s.dom.i === m.i ? s.mia : null)) }));
    } else if (m.t === 'risposto') {
      if (m.p === ioRef.current) pend.current = null;
      setSt(s => (s.dom && s.dom.i === m.i ? Object.assign({}, s, { risp: Object.assign({}, s.risp, { [m.p]: m.ok }) }) : s));
    } else if (m.t === 'esito') { pend.current = null; m.at = at; setSt(s => Object.assign({}, s, { esito: m, storia: [...(s.storia || []).filter(x => x.i !== m.i), m] })); }
    else if (m.t === 'fine') setSt(s => Object.assign({}, s, { fine: m, storia: m.storia || s.storia }));
    else if (m.t === 'errore') setSt(s => (m.e === 'finita' && s.fine ? Object.assign({}, s, { chiusa: true }) : Object.assign({}, s, { err: m })));
  };
  const start = o => {
    const nome = firstName(nm) || known;
    if (nome && nome !== s2get().name) s2set({ name: nome });
    if (conn.current) conn.current.chiudi(false);
    last.current = o; t0.current = {}; pend.current = null; xpDone.current = null;
    setSt({}); setNet('collego'); setXp(null); setVista('gioco');
    const c = new LiveConn({ codice: o.codice || null, corso: o.corso || 'basi', nome }, onMsg, setNet);
    conn.current = c; c.apri();
  };
  const leave = () => { if (conn.current) conn.current.chiudi(true); conn.current = null; nav.back(); };
  useEffect(() => { if (vista === 'entra' && known && SFIDE_ON) start({ codice: cod0 }); }, []);
  useEffect(() => () => { if (conn.current) conn.current.chiudi(true); }, []);
  // tornando sull'app (o quando torna la rete) ci si ricollega subito
  useEffect(() => {
    const f = () => { if (document.visibilityState === 'visible' && conn.current) conn.current.ora(); };
    document.addEventListener('visibilitychange', f); window.addEventListener('online', f);
    return () => { document.removeEventListener('visibilitychange', f); window.removeEventListener('online', f); };
  }, []);

  const S = st.stanza, io = S ? S.io : 0, op = io === 0 ? 1 : 0, g = S ? S.g : [], gMe = g[io], gOp = g[op];
  const opName = gOp ? gOp.nome : 'il tuo amico', codice = st.benv ? st.benv.codice : cod;
  const dom = st.dom, es = st.esito && dom && st.esito.i === dom.i ? st.esito : null;
  const fase = st.err ? 'errore' : net === 'irraggiungibile' ? 'rete' : st.fine ? 'fine' : net === 'chiuso' ? 'chiuso' : dom ? (es ? 'esito' : 'domanda') : st.via ? 'via' : S ? 'stanza' : 'collego';
  const corre = fase === 'via' || fase === 'domanda';
  useEffect(() => { if (!corre) return; const h = setInterval(() => tick(x => x + 1), 200); return () => clearInterval(h); }, [corre]);
  // il cronometro parte quando la domanda è sullo schermo (il fotogramma dopo il disegno)
  React.useLayoutEffect(() => {
    if (!dom || t0.current[dom.i] != null) return;
    const i = dom.i; requestAnimationFrame(() => { if (t0.current[i] == null) t0.current[i] = performance.now(); });
  }, [dom && dom.i]);
  // fine partita: punti esperienza una volta sola
  useEffect(() => {
    const f = st.fine; if (!f || xpDone.current === f) return; xpDone.current = f;
    const win = f.vince === io, draw = f.vince === 'pari', mine = f.uscito === io, n = mine || !(f.storia || []).length ? 0 : win ? 30 : draw ? 10 : 5;
    addXp(n); setXp(n);
    if (!mine) s2set(s => ({ duel: { w: s.duel.w + (win ? 1 : 0), l: s.duel.l + (!win && !draw ? 1 : 0), last: Date.now() } }));
  }, [st.fine]);

  const tap = k => {
    if (!dom || es || st.mia != null) return;
    const now = performance.now(); if (now > dom.at + dom.ms) return;
    const ms = Math.max(0, Math.round(now - (t0.current[dom.i] != null ? t0.current[dom.i] : dom.at)));
    pend.current = { i: dom.i, c: k, ms };
    setSt(s => Object.assign({}, s, { mia: k }));
    if (conn.current) conn.current.send({ t: 'risposta', i: dom.i, c: k, ms });
  };
  const link = () => location.origin + location.pathname + '#sfida=' + codice;
  const copy = async (t, msg) => { try { await navigator.clipboard.writeText(t); nav.toast(msg); } catch (e) { nav.toast('Il codice è ' + codice); } };
  const share = async () => {
    const url = link(), text = `Ti sfido su FinLearn: 5 domande, il punto va a chi risponde giusto per primo. Il codice è ${codice}.`;
    if (navigator.share) { try { await navigator.share({ title: 'Sfida su FinLearn', text, url }); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
    copy(url, 'Link copiato');
  };

  // ---- prima di collegarsi: scelta delle domande, codice, nome ----
  const nameField = !known && html`<div class="o-col" style="gap:8px"><label class="o-lab" for="live-nome">Il tuo nome</label>
    <input id="live-nome" class="o-inp" value=${nm} onInput=${e => setNm(e.target.value)} placeholder="Come ti vedrà il tuo amico" maxlength="20" autocomplete="given-name"/></div>`;
  const topSetup = html`<${TopBar} onClose=${nav.back} title="Sfida dal vivo"/>`;
  if (!SFIDE_ON && vista !== 'gioco') return html`<${Flow} top=${topSetup}><div class="o-pad o-col" style="gap:10px;padding-top:12px"><h1 class="o-h1m">Quasi pronta</h1><p class="o-body o-mut">Le sfide dal vivo partono appena l'arbitro è online.</p></div><//>`;
  if (vista === 'scegli') return html`<${Flow} top=${topSetup} foot=${html`<${Btn} cls="lg" bg=${PESCA} disabled=${!nmOk} onClick=${() => start({ corso })}>Crea la sfida<//>`}>
    <div class="o-pad o-col o-duel" style="gap:22px;padding-top:12px;padding-bottom:20px">
      <div class="o-col" style="gap:8px"><h1 class="o-h1m">Lampo</h1>
        <p class="o-body o-mut">5 domande, le stesse sui due telefoni. Il punto va a chi risponde giusto per primo. Se sbagli perdi un punto, e l'altro può ancora rispondere.</p></div>
      ${corsi.length > 1 ? html`<div class="o-col" style="gap:10px" role="radiogroup" aria-label="Da quale percorso arrivano le domande">
        ${corsi.map(c => html`<button key=${c.id} type="button" role="radio" aria-checked=${corso === c.id ? 'true' : 'false'} class=${'o-opt' + (corso === c.id ? ' sel' : '')} onClick=${() => setCorso(c.id)}>
          <span class="l">${corso === c.id ? PathIco(D_CHECK, 20, 3) : ''}</span><span class="x"><span style="display:block">${c.name}</span><span class="o-s" style="display:block;margin-top:2px;font-weight:600">${c.sub}</span></span></button>`)}</div>` : html`<p class="o-s" style="font-size:14px;line-height:20px">Le domande arrivano da ${corsi[0].name}. ${corsi[0].sub}.</p>`}
      ${nameField}
    </div><//>`;
  if (vista === 'codice' || (vista === 'entra' && !known)) {
    const c6 = cod.length === 6, okCod = LIVE_RE.test(cod);
    return html`<${Flow} top=${topSetup} foot=${html`<${Btn} cls="lg" bg=${PESCA} disabled=${!okCod || !nmOk} onClick=${() => start({ codice: cod })}>Entra nella sfida<//>`}>
      <div class="o-pad o-col" style="gap:22px;padding-top:12px;padding-bottom:20px">
        <div class="o-col" style="gap:8px"><h1 class="o-h1m">${vista === 'entra' ? 'Ti hanno sfidato' : 'Entra in una sfida'}</h1>
          <p class="o-body o-mut">${vista === 'entra' ? 'Scrivi il tuo nome ed entra: la sfida parte quando siete pronti tutti e due.' : 'Scrivi il codice di 6 caratteri che ti hanno mandato.'}</p></div>
        <div class="o-col" style="gap:8px"><label class="o-lab" for="live-cod">Codice della sfida</label>
          <input id="live-cod" class="o-inp o-mono" value=${cod} onInput=${e => setCod(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))} readonly=${vista === 'entra'}
            inputmode="text" autocapitalize="characters" autocomplete="off" autocorrect="off" spellcheck="false" maxlength="6" style="height:64px;font-size:28px;letter-spacing:.24em;text-align:center"/>
          ${c6 && !okCod && html`<p class="o-s" role="alert">Nei codici non ci sono mai I, O, 0 e 1: controlla di averlo scritto giusto.</p>`}</div>
        ${nameField}
      </div><//>`;
  }

  // ---- collegati ----
  const banner = net === 'ricollego' && fase !== 'fine' && html`<div role="status" class="o-fade" style="position:absolute;left:20px;right:20px;top:calc(var(--otop) + 54px);z-index:8;padding:10px 14px;background:${GIALLO};border:2.5px solid ${INK};border-radius:16px;font-size:15px;line-height:20px;font-weight:800;text-align:center">Connessione persa: mi ricollego…</div>`;
  const exitSheet = ask && html`<${BSheet} onClose=${() => setAsk(false)} label="Uscire dalla sfida"><h2 class="o-big">Vuoi uscire dalla sfida?</h2>
    <p class="o-body o-mut" style="margin-top:6px">Se esci adesso la partita va a ${opName}.</p>
    <div class="o-col" style="gap:10px;margin-top:16px"><${Btn} cls="lg" bg=${PESCA} onClick=${() => setAsk(false)}>Resto<//><${Btn} cls="lg flat" bg="#fff" onClick=${leave}>Esco<//></div><//>`;
  const closeBtn = () => (fase === 'via' || fase === 'domanda' || fase === 'esito' ? setAsk(true) : leave());

  if (fase === 'errore' || fase === 'rete' || fase === 'chiuso') {
    const msg = fase === 'errore' ? st.err.m : fase === 'rete' ? 'Non riesco a raggiungere l\'arbitro delle sfide. Controlla la connessione e riprova.' : 'Il collegamento con la sfida si è chiuso. Se è ancora aperta, rientra con il codice.';
    return html`<${Flow} top=${html`<${TopBar} onClose=${leave} title="Sfida dal vivo"/>`} foot=${html`<div class="o-col" style="gap:10px">
        ${fase !== 'errore' && last.current && html`<${Btn} cls="lg" bg=${PESCA} onClick=${() => start(last.current.codice || !codice ? last.current : { codice })}>Riprova<//>`}
        <${Btn} cls="lg flat" bg="#fff" onClick=${leave}>Torna alle sfide<//></div>`}>
      <div class="o-pad o-col" style="align-items:center;text-align:center;gap:14px;padding-top:24px"><${Rally} pose="triste" w=${170} alt=""/>
        <p class="o-body" role="alert" style="font-size:17px;line-height:24px;font-weight:700;max-width:320px">${msg}</p></div><//>`;
  }
  if (fase === 'collego') return html`<${Flow} top=${html`<${TopBar} onClose=${leave} title="Sfida dal vivo"/>`}>
    <div class="o-pad o-col" style="align-items:center;text-align:center;gap:14px;padding-top:24px"><${Rally} pose="telefono" w=${170} alt=""/><p class="o-body" role="status">Mi collego all'arbitro…</p></div><//>`;

  if (fase === 'stanza') {
    const two = g.length === 2, iReady = gMe && gMe.pronto;
    const who = (x, me) => html`<div class="o-rowf" style="gap:12px;min-height:56px">
      <${Avatar} ch=${(x.nome || '?')[0].toUpperCase()} bg=${me ? PESCA : LILLA} size=${40}/>
      <span class="o-grow o-col" style="gap:1px"><span class="o-t">${me ? 'Tu' : x.nome}</span>${!(x.pronto && x.via) && html`<span class="o-s">${!x.via ? 'Fuori linea' : me && !two ? 'Nella stanza' : 'Non ancora pronto'}</span>`}</span>
      ${x.pronto && x.via && html`<span class="o-tag" style="background:${MENTA}">Pronto</span>`}</div>`;
    return html`<${Flow} top=${html`<div style="flex:none;background:${PESCA};position:relative"><${TopBar} onClose=${closeBtn} title="Sfida dal vivo"/></div>`}
      foot=${two ? html`<${Btn} cls="lg" bg=${PESCA} disabled=${iReady || !(gOp && gOp.via)} onClick=${() => conn.current && conn.current.send({ t: 'pronto' })}>${iReady ? `Aspetto ${opName}…` : 'Sono pronto'}<//>` : null} over=${banner}>
      <div style="background:${PESCA};padding:4px 20px 26px;border-bottom:2.5px solid ${INK}">
        ${two ? html`<h1 class="o-h1m">${opName} è nella stanza</h1><p class="o-body" style="margin-top:8px">Quando siete pronti tutti e due parte il conto alla rovescia.</p>`
          : html`<h1 class="o-h1m">Manda il codice</h1><p class="o-body" style="margin-top:8px">Il tuo amico entra con il link o scrivendo il codice nella scheda Sfide, con «Ho già un codice».</p>`}</div>
      <div class="o-pad o-col" style="gap:18px;padding-top:20px;padding-bottom:20px">
        ${!two && html`<div class="o-card s o-col" style="align-items:center;gap:4px;padding:16px">
            <span class="o-lab">Codice della sfida</span>
            <span class="o-mono" aria-label=${'Codice ' + codice.split('').join(' ')} style="font-size:40px;line-height:48px;letter-spacing:.2em;font-weight:600;margin-right:-.2em">${codice}</span></div>
          <div class="o-col" style="gap:4px;align-items:center"><${Btn} cls="lg" bg=${PESCA} onClick=${share}>${Ico(Share2, 20)} Invia il link<//>
            <button type="button" class="o-link" onClick=${() => copy(codice, 'Codice copiato')}>Copia solo il codice</button></div>`}
        <div class="o-col">${gMe && who(gMe, true)}${gOp ? who(gOp, false) : html`<div class="o-rowf" style="gap:12px;min-height:56px">
          <span style="width:40px;height:40px;flex:none;border:2px dashed ${INK};border-radius:50%"></span><span class="o-s">In attesa del tuo amico…</span></div>`}</div>
        <p class="o-s">${st.benv && st.benv.corso === 'cfa2' ? 'Domande del CFA Level II, in inglese.' : 'Domande delle Basi della finanza.'} 5 domande: il punto va a chi risponde giusto per primo, chi sbaglia perde un punto.</p>
        ${!two && html`<p class="o-s">Su iPhone il link si apre in Safari, non nell'app: chi ha FinLearn sulla schermata Home fa prima a scrivere il codice.</p>`}
      </div><//>`;
  }

  if (fase === 'via') {
    const left = Math.max(0, Math.ceil((st.via - performance.now()) / 1000));
    return html`<${Flow} bg=${PESCA} top=${html`<${TopBar} onClose=${closeBtn} title=${'Lampo con ' + opName}/>`} over=${html`${banner}${exitSheet}`}>
      <div class="o-pad o-col" style="align-items:center;text-align:center;gap:22px;padding-top:30px">
        <div role="timer" aria-live="assertive" class="o-pop" key=${left} style="width:180px;height:180px;display:flex;align-items:center;justify-content:center;background:#fff;border:2.5px solid ${INK};border-radius:50%;box-shadow:5px 5px 0 ${INK};font-size:${left ? 96 : 56}px;line-height:1;font-weight:800">${left || 'Via!'}</div>
        <p class="o-body" style="font-size:17px;line-height:24px;font-weight:700;max-width:300px">Il punto va a chi risponde giusto per primo. Se sbagli perdi un punto.</p></div><//>`;
  }

  if (fase === 'domanda' || fase === 'esito') {
    const n = dom.n, now = es ? es.at : performance.now(), expired = !es && now > dom.at + dom.ms, left = Math.max(0, Math.ceil((dom.at + dom.ms - now) / 1000));
    const lastEs = (st.storia || []).slice(-1)[0], pts = es ? es.punti : lastEs ? lastEs.punti : g.map(x => x.punti), myOk = st.risp ? st.risp[io] : undefined, opOk = st.risp ? st.risp[op] : undefined;
    const dot = k => { const v = (st.storia || []).find(x => x.i === k), bg = !v ? 'transparent' : v.punto === io ? PESCA : v.punto === op ? LILLA : v.punto === 'pari' ? GIALLO : '#fff';
      return html`<i key=${k} style=${{ width: 12, height: 12, borderRadius: '50%', border: `2px ${v ? 'solid' : 'dashed'} ${INK}`, background: bg }}></i>`; };
    const rich = dom.o.some(o => /\\\(|\*\*|\$\$/.test(o)), big = dom.o.every(o => String(o).length <= 14), opC = es && es.r[op] ? es.r[op].c : null;
    let chip = null;
    if (!es) {
      if (st.mia != null) chip = myOk === false ? [ROSA, 'Sbagliata: perdi un punto'] : myOk === true ? [MENTA, 'Giusta! Vediamo chi è stato più veloce'] : [T_PESCA, 'Risposta inviata'];
      else if (opOk === false) chip = [GIALLO, `${opName} ha sbagliato: tocca a te`];
      else if (opOk === true) chip = [T_GR, `${opName} ha risposto`];
      else if (expired) chip = [T_GR, 'Tempo scaduto'];
    }
    const res = es && (() => {
      const head = es.punto === io ? 'Punto a te' : es.punto === op ? `Punto a ${opName}` : es.punto === 'pari' ? 'Pari: un punto a testa' : 'Nessun punto';
      const a = es.r[io], b = es.r[op], both = a && b && a.ok && b.ok;
      const gap = both && es.punto !== 'pari' ? (es.punto === io ? `Più veloce tu, di ${liveGap(Math.abs(a.ms - b.ms))}` : `${opName} più veloce di ${liveGap(Math.abs(a.ms - b.ms))}`) : null;
      const line = (r, name, me) => html`<div class="o-rowf" style="gap:10px;min-height:30px">
        <span class="o-grow" style="font-size:15px;font-weight:700">${name}</span>
        ${r ? html`<span class="o-rowf" style="gap:6px;font-size:16px;font-weight:800">${PathIco(r.ok ? D_CHECK : D_X, 18, 3)}${liveSec(r.ms)}${!r.ok && html`<span style="padding:0 8px;background:${ROSA};border:2px solid ${INK};border-radius:999px;font-size:13px">−1</span>`}</span>`
          : html`<span class="o-s">Nessuna risposta</span>`}</div>`;
      return html`<div class="o-card s o-pop" role="status" style=${{ padding: '12px 16px', background: es.punto === io ? MENTA : es.punto === op ? T_LILLA : es.punto === 'pari' ? T_GIALLO : '#fff' }}>
        <div style="font-size:20px;line-height:24px;font-weight:800">${head}</div>
        <div class="o-col" style="margin-top:6px">${line(a, 'Tu', true)}${line(b, opName, false)}</div>
        ${gap && html`<p class="o-s" style="margin-top:4px;color:${INK}">${gap}</p>`}</div>`;
    })();
    return html`<${Flow} bg="#fff" top=${html`<div style="flex:none;background:${PESCA};border-bottom:2.5px solid ${INK};padding-bottom:58px;position:relative">
        <${Rally} pose="sfida" w=${110} alt="" style="position:absolute;right:6px;top:calc(var(--otop) - 7px)"/>
        <${TopBar} onClose=${closeBtn} title=${'Lampo con ' + opName} right=${html`<span aria-hidden="true" style="width:84px;flex:none"></span>`}/></div>
      <div class="o-pad" style="flex:none;margin-top:-46px;position:relative"><div class="o-card s" style="display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:12px 16px">
        <span class="o-col" style="align-items:center;gap:2px"><${Avatar} ch=${((gMe && gMe.nome) || 'T')[0].toUpperCase()} bg=${PESCA}/><span class="o-s">Tu</span><span style="font-size:30px;line-height:32px;font-weight:800">${livePts(pts[io] || 0)}</span></span>
        <span class="o-col" style="align-items:center;gap:6px"><span class="o-s" style="font-weight:700">Domanda ${dom.i + 1} di ${n}</span>
          <span class="o-mono" role="timer" aria-label=${es ? 'Domanda chiusa' : `${left} secondi`} style=${{ padding: '3px 14px', background: !es && left <= 5 ? ROSA : T_PESCA, border: `2px solid ${INK}`, borderRadius: 999, fontSize: 17, fontWeight: 600 }}>${fmtClock(left)}</span>
          <span class="o-rowf" style="gap:5px" role="img" aria-label="Punti domanda per domanda">${Array.from({ length: n }, (_, k) => dot(k))}</span></span>
        <span class="o-col" style="align-items:center;gap:2px"><${Avatar} ch=${opName[0].toUpperCase()} bg=${LILLA}/><span class="o-s" style="max-width:96px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${opName}</span><span style="font-size:30px;line-height:32px;font-weight:800">${livePts(pts[op] || 0)}</span></span></div></div>`}
      over=${html`${banner}${exitSheet}`}>
      <div class="o-duel o-pad" style="padding-top:12px;padding-bottom:20px">
        <div aria-live="polite" style="min-height:30px;display:flex;justify-content:flex-end">${chip && html`<span class="o-fade" key=${chip[1]} style=${{ padding: '3px 12px', background: chip[0], border: `2px solid ${INK}`, borderRadius: 999, fontSize: 13, lineHeight: '18px', fontWeight: 800 }}>${chip[1]}</span>`}</div>
        ${res && html`<div style="margin-top:6px">${res}</div>`}
        <div style="margin-top:12px"><${Rich} text=${dom.q} cls=${dom.q.length > 160 ? '' : 'q'} lang=${dom.l}/></div>
        <div class="o-col" style="gap:10px;margin-top:16px">${dom.o.map((o, k) => {
          let state = '', note = null;
          if (es) { state = k === es.a ? 'ok' : k === st.mia ? 'ko' : 'dim'; note = [k === st.mia ? 'Tu' : null, k === opC ? opName : null].filter(Boolean).join(' e ') || null; }
          else if (st.mia === k) { state = myOk === true ? 'ok' : myOk === false ? 'ko' : 'sel'; note = 'Tu'; }
          else if (st.mia != null || expired) state = 'dim';
          return html`<${Opt} key=${k} letter=${L3[k]} text=${o} rich=${rich} big=${big} lang=${dom.l} state=${state} note=${note} disabled=${st.mia != null || !!es || expired} onClick=${() => tap(k)}/>`;
        })}</div>
      </div><//>`;
  }

  // ---- fine ----
  const f = st.fine, win = f.vince === io, draw = f.vince === 'pari', heLeft = f.uscito === op;
  const canRe = f.uscito == null && !st.chiusa && gOp && gOp.via && S && S.fase === 'fine';
  const reLabel = gMe && gMe.rivincita ? `Aspetto ${opName}…` : gOp && gOp.rivincita ? 'Accetta la rivincita' : 'Rivincita';
  return html`<div class="o-scr" style="background:repeating-conic-gradient(from 5deg at 50% 200px, #FFD7BA 0deg 10deg, ${PESCA} 10deg 20deg)"><div class="o-scroll"><div class="o-col o-pad" style="min-height:100%;align-items:center">
    <div style="width:220px;height:220px;flex:none;margin-top:calc(var(--otop) + 18px);background:#fff;border:2.5px solid ${INK};border-radius:50%;box-shadow:5px 5px 0 ${INK};display:flex;align-items:flex-end;justify-content:center;overflow:hidden">
      <${Rally} pose=${win ? 'festeggia' : draw ? 'occhiolino' : 'triste'} w=${208} alt="" style="margin-bottom:-16px"/></div>
    <h1 class="o-pop" style="font-size:44px;line-height:48px;font-weight:800;letter-spacing:-.02em;margin-top:20px;text-align:center">${win ? 'Hai vinto!' : draw ? 'Pareggio' : 'Stavolta no'}</h1>
    ${heLeft && html`<p class="o-body" style="margin-top:6px;font-weight:700">${opName} ha lasciato la sfida.</p>`}
    <div class="o-rowf" style="gap:12px;margin-top:16px;padding:12px 20px;background:#fff;border:2.5px solid ${INK};border-radius:22px;box-shadow:5px 5px 0 ${INK};transform:rotate(-2deg)">
      <${Avatar} ch=${((gMe && gMe.nome) || 'T')[0].toUpperCase()} bg=${PESCA}/><span style="font-size:15px;font-weight:700">Tu</span>
      <span style="font-size:36px;line-height:40px;font-weight:800;letter-spacing:-.02em;margin:0 6px;white-space:nowrap">${livePts(f.punti[io] || 0)} a ${livePts(f.punti[op] || 0)}</span>
      <span style="font-size:15px;font-weight:700;max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${opName}</span><${Avatar} ch=${opName[0].toUpperCase()} bg=${LILLA}/></div>
    ${xp != null && xp > 0 && html`<span class="o-pill" style="margin-top:20px;background:${GIALLO}">+${xp} XP</span>`}
    ${(f.storia || []).length > 0 && html`<div class="o-card s" style="width:100%;margin-top:20px;padding:6px 16px">${f.storia.map(v => {
      const w = v.punto === 'pari' ? null : v.punto, r = w != null && v.r[w] ? v.r[w] : null;
      const t = v.punto === io ? 'Punto a te' : v.punto === op ? `Punto a ${opName}` : v.punto === 'pari' ? 'Pari, un punto a testa' : 'Nessun punto';
      return html`<div key=${v.i} class="o-row" style="min-height:48px;gap:12px"><span style="width:26px;height:26px;flex:none;display:flex;align-items:center;justify-content:center;border:2px solid ${INK};border-radius:50%;font-size:13px;font-weight:800;background:${v.punto === io ? PESCA : v.punto === op ? LILLA : v.punto === 'pari' ? GIALLO : '#fff'}">${v.i + 1}</span>
        <span class="o-grow o-t" style="font-size:15px">${t}</span><span class="o-s" style="color:${INK};font-weight:700">${r ? liveSec(r.ms) : ''}</span></div>`;
    })}</div>`}
    <div style="flex:1 1 16px;min-height:16px"></div>
    <div class="o-col" style="gap:12px;width:100%;margin-top:18px">
      ${canRe ? html`<${Btn} cls="lg" bg="#fff" disabled=${gMe && gMe.rivincita} onClick=${() => conn.current && conn.current.send({ t: 'rivincita' })}>${reLabel}<//>`
        : html`<${Btn} cls="lg" bg="#fff" onClick=${() => { if (conn.current) conn.current.chiudi(true); conn.current = null; nav.replace('live', { nuova: true }); }}>Nuova sfida<//>`}
      ${!canRe && html`<p class="o-s" style="text-align:center;color:${INK}">${heLeft || (gOp && !gOp.via) ? `${opName} non è più nella stanza.` : 'La stanza è chiusa.'} Per giocare ancora crea una sfida nuova.</p>`}</div>
    <div style="padding:2px 0 max(22px,calc(env(safe-area-inset-bottom) + 8px))"><button type="button" class="o-link" onClick=${leave}>Torna alle sfide</button></div>
  </div></div>${banner}</div>`;
}
