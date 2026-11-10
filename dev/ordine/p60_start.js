
// =====================================================================================================
// APERTURA e PRIMO GIORNO (fuori dall'app vera e propria: non usano il kit)
// =====================================================================================================
// il marchio dell'app, come FinLearnWordmark nel tema chiaro
function Wordmark({ size = 60, arrowRef, headRef }) {
  return html`<span aria-label="FinLearn" style=${{ fontFamily: "'Nunito','Bricolage Grotesque',system-ui,sans-serif", fontWeight: 900, fontSize: size, letterSpacing: '-.02em', lineHeight: 1, color: '#FFB020', display: 'inline-flex', alignItems: 'flex-end' }}>
    <span style="color:#16203A">f<span style="position:relative;display:inline-block">ı<svg viewBox="0 0 20 20" aria-hidden="true" style="position:absolute;left:50%;top:-.04em;width:.42em;height:.42em;transform:translateX(-46%);overflow:visible">
      <polyline ref=${arrowRef} points="3,15 8,9 11,12 16,5" fill="none" stroke="#22C55E" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>
      <path ref=${headRef} d="M18.6 2.2 L11.6 4.2 L17 9.4 Z" fill="#22C55E" stroke="#22C55E" stroke-width="1.6" stroke-linejoin="round"/></svg></span>n</span>learn</span>`;
}

// Apertura: le otto candele dello splash storico crescono una dopo l'altra, la linea di tendenza si disegna,
// compaiono Rally, marchio e motto; la base del grafico fa da barra di caricamento. Stessi tempi di prima (circa 3 secondi).
const SPL = { W: 390, H: 844, DUR: 3.15, x0: 27, sx: 1.68, y0: 424, sy: 2.95, w: 28, base: 700, rules: [460, 541, 622], gy: 214, logo: 240, fs: 66, tag: 328, rs: 124,
  can: [[22, 60, 1, 0], [30, 48, 1, .12], [18, 52, 0, .24], [34, 36, 1, .36], [26, 30, 1, .48], [16, 38, 0, .6], [40, 14, 1, .72], [32, 8, 1, .84]],
  line: [[12, 68], [37, 55], [62, 58], [87, 42], [112, 38], [137, 44], [162, 22], [187, 16]] };
function splashChart(t) {
  const G = SPL, seg = (a, b) => clamp((t - a) / (b - a), 0, 1), out = x => 1 - Math.pow(1 - x, 3), quint = x => 1 - Math.pow(1 - x, 5), f = v => (+v).toFixed(1);
  const X = u => G.x0 + u * G.sx, Y = u => G.y0 + u * G.sy, XA = X(0), XB = X(200), BG = T_BG;
  const pts = G.line.map(q => [X(q[0]), Y(q[1])]); let len = 0; for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  let s = ''; const g = seg(0, .35).toFixed(2);
  G.rules.forEach(y => { s += `<path d="M${f(XA)} ${y}H${f(XB)}" stroke="#DDE3EC" stroke-width="1.5" opacity="${g}"/>`; });
  const fl = out(seg(1.8, 2.8));
  s += `<rect x="${f(XA)}" y="${G.base - 2}" width="${f(XB - XA)}" height="4" rx="2" fill="#D3DAE5" opacity="${g}"/>`;
  if (fl > 0) s += `<rect x="${f(XA)}" y="${G.base - 2}" width="${f(Math.max((XB - XA) * fl, 4))}" height="4" rx="2" fill="${INK}"/>`;
  G.can.forEach(([h, y, up, d], i) => {
    const x = seg(d, d + .6); if (x <= 0) return;
    const k = quint(x), cx = X(i * 25 + 12), yb = Y(y + h), hh = Math.max(h * G.sy * k, 1), ym = Y(y + h / 2), wl = (h / 2 + 6) * G.sy * k;
    s += `<path d="M${f(cx)} ${f(ym - wl)}V${f(ym + wl)}" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`;
    s += `<rect x="${f(cx - G.w / 2)}" y="${f(yb - hh)}" width="${G.w}" height="${f(hh)}" rx="3" fill="${up ? '#10B981' : '#F43F5E'}" stroke="${INK}" stroke-width="2"/>`;
  });
  const p = out(seg(.3, 1.9));
  if (p > 0) { const d = 'M' + pts.map(q => f(q[0]) + ' ' + f(q[1])).join('L'), da = ` fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${f(len)}" stroke-dashoffset="${f(len * (1 - p))}"/>`;
    s += `<path d="${d}" stroke="${BG}" stroke-width="6.4"${da}<path d="${d}" stroke="${INK}" stroke-width="3"${da}`; }
  const a = seg(1.84, 1.96);
  if (a > 0) { const q = pts[pts.length - 1], r = seg(1.9, 2.55);
    if (r > 0 && r < 1) s += `<circle cx="${f(q[0])}" cy="${f(q[1])}" r="${f(5.5 + 15 * out(r))}" fill="none" stroke="${INK}" stroke-width="1.5" opacity="${(.45 * (1 - r)).toFixed(2)}"/>`;
    s += `<circle cx="${f(q[0])}" cy="${f(q[1])}" r="5.5" fill="${INK}" stroke="${BG}" stroke-width="2.4" opacity="${a.toFixed(2)}"/>`; }
  return s;
}
export function OrdineSplash({ onComplete }) {
  const R = useRef({}).current;
  const [sc, setSc] = useState(() => (typeof window === 'undefined' ? 1 : Math.min(window.innerWidth / SPL.W, window.innerHeight / SPL.H)));
  useEffect(() => {
    ordInjectCss();
    const onRes = () => setSc(Math.min(window.innerWidth / SPL.W, window.innerHeight / SPL.H)); window.addEventListener('resize', onRes);
    let reduce = false; try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1), out = x => 1 - Math.pow(1 - x, 3), io = x => (x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
    const t0 = performance.now(); let raf = 0, over = false;
    const draw = t => {
      if (R.chart) R.chart.innerHTML = splashChart(t);
      const a = out(seg(t, .2, .75)); if (R.rally) { R.rally.style.opacity = a.toFixed(3); R.rally.style.transform = `translateY(${(10 * (1 - a)).toFixed(2)}px)`; }
      const blink = (t > 1.24 && t < 1.32) || (t > 2.18 && t < 2.26), down = t > 1.39 && t < 2.31;
      if (R.p0) { R.p0.style.opacity = blink || down ? 0 : 1; R.p1.style.opacity = !blink && down ? 1 : 0; R.p2.style.opacity = blink ? 1 : 0; }
      const l = out(seg(t, .7, 1.2)); if (R.logo) { R.logo.style.opacity = l.toFixed(3); R.logo.style.transform = `translateY(${(12 * (1 - l)).toFixed(2)}px)`; }
      const w = io(seg(t, .95, 1.4)); if (R.arrow) { R.arrow.setAttribute('stroke-dasharray', '20.7'); R.arrow.setAttribute('stroke-dashoffset', (20.7 * (1 - w)).toFixed(2)); R.arrow.style.opacity = w > 0 ? 1 : 0; }
      if (R.head) R.head.style.opacity = out(seg(t, 1.34, 1.5)).toFixed(3);
      const g = out(seg(t, 1.2, 1.7)); if (R.tag) { R.tag.style.opacity = g.toFixed(3); R.tag.style.transform = `translateY(${(6 * (1 - g)).toFixed(2)}px)`; }
      if (R.stage) R.stage.style.opacity = (1 - io(seg(t, 2.62, 3.12))).toFixed(3);
    };
    const end = () => { if (!over) { over = true; onComplete && onComplete(); } };
    const tick = now => { const t = (now - t0) / 1000; draw(reduce ? 2.5 : t); if (t < (reduce ? 1.4 : SPL.DUR)) raf = requestAnimationFrame(tick); else end(); };
    draw(0); raf = requestAnimationFrame(tick);
    const safety = setTimeout(end, 6000);   // se la scheda è in secondo piano i fotogrammi non arrivano: l'app parte lo stesso
    return () => { cancelAnimationFrame(raf); clearTimeout(safety); window.removeEventListener('resize', onRes); };
  }, []);
  const rw = 228 * SPL.rs / 160, rx = SPL.W / 2 - SPL.rs / 2 - 34 * SPL.rs / 160, ry = SPL.gy - 163 * SPL.rs / 160 - 44 * SPL.rs / 160;
  const im = (n, k, o) => html`<img ref=${el => { R[k] = el; }} src=${'rally/' + n + '.svg'} alt="" width=${rw} style=${{ position: 'absolute', left: 0, top: 0, width: rw, height: 'auto', opacity: o }}/>`;
  return html`<div style="position:fixed;inset:0;z-index:60;background:${T_BG};overflow:hidden" role="img" aria-label="FinLearn si sta aprendo">
    <div ref=${el => { R.stage = el; }} style=${{ position: 'absolute', left: '50%', top: '50%', width: SPL.W, height: SPL.H, marginLeft: -SPL.W / 2, marginTop: -SPL.H / 2, transform: `scale(${sc.toFixed(4)})`, transformOrigin: '50% 50%' }}>
      <svg ref=${el => { R.chart = el; }} viewBox="0 0 390 844" style="position:absolute;left:0;top:0;width:390px;height:844px;overflow:visible"></svg>
      <div ref=${el => { R.rally = el; }} style=${{ position: 'absolute', left: rx, top: ry, width: rw, opacity: 0 }}>${im('calmo', 'p0', 1)}${im('calmo-giu', 'p1', 0)}${im('calmo-chiusi', 'p2', 0)}</div>
      <div ref=${el => { R.logo = el; }} style=${{ position: 'absolute', left: 0, right: 0, top: SPL.logo, display: 'flex', justifyContent: 'center', opacity: 0 }}><${Wordmark} size=${SPL.fs} arrowRef=${el => { R.arrow = el; }} headRef=${el => { R.head = el; }}/></div>
      <div ref=${el => { R.tag = el; }} style=${{ position: 'absolute', left: 0, right: 0, top: SPL.tag, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, fontFamily: "'IBM Plex Mono',ui-monospace,monospace", fontWeight: 500, fontSize: 10.5, lineHeight: '14px', letterSpacing: '.32em', textTransform: 'uppercase', color: MUT, whiteSpace: 'nowrap', opacity: 0 }}>
        <i style="display:block;width:26px;height:1.5px;background:${INK};border-radius:1px"></i><span style="margin-right:-.32em">Bull market your knowledge</span><i style="display:block;width:26px;height:1.5px;background:${INK};border-radius:1px"></i></div>
    </div></div>`;
}

// Primo giorno: benvenuto, obiettivo, punto di partenza. `auth` arriva da app.js (accesso di prova, salvato sul dispositivo).
const GOALS = [['zero', 'Capire la finanza da zero', 'Soldi, interessi, inflazione', Sprout], ['invest', 'Investire i miei risparmi', 'Azioni, obbligazioni, fondi', TrendingUp], ['work', 'Usarla al lavoro', 'Bilanci, valutazioni, tassi', Briefcase], ['exam', 'Preparare un esame', 'CFA, FRM, CAIA', GraduationCap]];
function Choice({ on, onClick, icon, title, sub }) {
  return html`<button type="button" role="radio" aria-checked=${on ? 'true' : 'false'} onClick=${onClick} class="o-rowf" style=${{ gap: 14, width: '100%', minHeight: 72, padding: '12px 16px', border: `2.5px solid ${INK}`, borderRadius: 20, background: on ? T_AZ : '#fff', boxShadow: on ? `4px 4px 0 ${INK}` : 'none' }}>
    ${icon && html`<span class="o-ibox" style="width:42px;height:42px;border-radius:13px">${icon}</span>`}
    <span class="o-grow o-col" style="gap:2px"><span style="font-size:17px;line-height:22px;font-weight:800">${title}</span><span class="o-s" style="font-size:14px;line-height:19px">${sub}</span></span>
    <span style=${{ width: 28, height: 28, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: `2.5px solid ${INK}`, background: on ? INK : '#fff', color: '#fff' }}>${on && PathIco(D_CHECK, 15, 3.6)}</span></button>`;
}
export function OrdineWelcome({ auth, onAuth }) {
  const [step, setStep] = useState('welcome'), [goal, setGoal] = useState('zero'), [start, setStart] = useState('zero'), [mins, setMins] = useState(10);
  const [busy, setBusy] = useState(false), [err, setErr] = useState(null), [mode, setMode] = useState('in');
  ordInjectCss();
  useOrdFit();
  const enter = async fn => { setBusy(true); setErr(null); try { const r = await fn(); onAuth(r.user, r.data); } catch (e) { setErr((e && e.message) || 'Non ha funzionato, riprova.'); setBusy(false); } };
  const create = () => { s2set(s => ({ onboard: { goal, start, t: Date.now() }, settings: Object.assign({}, s.settings, { goalMin: mins }) })); enter(() => auth.guest()); };
  let body;
  if (step === 'welcome') body = html`<div class="o-scr" style="background:${AZ}">
    <div class="o-top" style="flex:1 1 0;min-height:300px;position:relative;display:flex;flex-direction:column;align-items:center">
      <div style="margin-top:22px"><${Wordmark} size=${34}/></div>
      <div style="position:relative;width:min(288px,70vw);aspect-ratio:1;margin-top:auto;margin-bottom:-8px;background:#fff;border:2.5px solid ${INK};border-radius:50%;box-shadow:5px 5px 0 ${INK};display:flex;align-items:flex-end;justify-content:center">
        <${Rally} pose="saluta" w=${250} alt="Rally, la mascotte di FinLearn, saluta" style="margin-bottom:-6px;max-width:92%"/>
        <span style="position:absolute;left:-22px;top:20px"><${Pill} rot=${-8}>Ciao, sono Rally<//></span></div></div>
    <div class="o-sheet o-col" style="flex:none;padding-top:28px;padding-bottom:max(26px,calc(env(safe-area-inset-bottom) + 10px))">
      <h1 style="font-size:30px;line-height:34px;font-weight:800;letter-spacing:-.02em;text-wrap:balance">Impara la finanza, dieci minuti al giorno</h1>
      <p class="o-body o-mut" style="margin-top:10px;font-size:16px;line-height:23px">Dalle basi alle certificazioni, con lezioni brevi, sfide e figurine da collezionare.</p>
      <div style="margin-top:22px"><${Btn} cls="lg" onClick=${() => setStep('goal')}>Inizia<//></div>
      <div style="text-align:center;margin-top:4px"><button type="button" class="o-link" onClick=${() => setStep('login')}>Ho già un account</button></div></div></div>`;
  else if (step === 'goal') body = html`<${Flow} top=${html`<${TopBar} onBack=${() => setStep('welcome')} n=${3} i=${0}/>`} foot=${html`<${Btn} cls="lg" onClick=${() => setStep('start')}>Continua<//>`}>
    <div class="o-pad" style="position:relative;padding-top:22px;padding-bottom:20px"><${Rally} pose="indica" w=${190} alt="" style="position:absolute;right:-14px;top:-10px"/>
      <div class="o-col" style="gap:6px;position:relative;min-height:156px;max-width:200px"><span class="o-lab">Passo 1 di 3</span><h1 class="o-big" style="font-size:30px;line-height:34px">Cosa vuoi imparare?</h1></div>
      <div role="radiogroup" aria-label="Cosa vuoi imparare" class="o-col" style="gap:12px;position:relative">${GOALS.map(([id, t, s, I]) => html`<${Choice} key=${id} on=${goal === id} onClick=${() => setGoal(id)} icon=${Ico(I, 22)} title=${t} sub=${s}/>`)}</div>
      <p class="o-body o-mut" style="margin-top:18px">Puoi seguire più percorsi insieme e cambiare idea quando vuoi.</p></div><//>`;
  else if (step === 'start') body = html`<${Flow} top=${html`<${TopBar} onBack=${() => setStep('goal')} n=${3} i=${1}/>`}
    foot=${html`${err && html`<p class="o-s" style="color:#B3261E;font-weight:700;margin-bottom:8px;text-align:center" role="alert">${err}</p>`}<${Btn} cls="lg" disabled=${busy} onClick=${create}>${busy ? 'Un attimo…' : 'Crea il mio percorso'}<//>`}>
    <div class="o-pad" style="position:relative;padding-top:22px;padding-bottom:20px"><${Rally} pose="occhiolino" w=${190} alt="" style="position:absolute;right:-14px;top:-10px"/>
      <div class="o-col" style="gap:6px;position:relative;min-height:156px;max-width:200px"><span class="o-lab">Passo 2 di 3</span><h1 class="o-big" style="font-size:30px;line-height:34px">Da dove parti?</h1></div>
      <div role="radiogroup" aria-label="Da dove parti" class="o-col" style="gap:12px;position:relative">
        <${Choice} on=${start === 'zero'} onClick=${() => setStart('zero')} title="Parto da zero" sub="Comincio dalla prima lezione."/>
        <${Choice} on=${start === 'some'} onClick=${() => setStart('some')} title="So già qualcosa" sub="Cinque domande e Rally capisce a che punto sono."/></div>
      <h2 class="o-h2" style="margin:28px 0 12px">Quanto tempo hai al giorno?</h2>
      <div role="radiogroup" aria-label="Minuti al giorno" style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">${[5, 10, 20].map(m => html`<button key=${m} type="button" role="radio" aria-checked=${mins === m ? 'true' : 'false'} onClick=${() => setMins(m)} class="o-col"
        style=${{ alignItems: 'center', padding: '10px 0 12px', border: `2.5px solid ${INK}`, borderRadius: 18, background: mins === m ? AZ : '#fff', boxShadow: mins === m ? `4px 4px 0 ${INK}` : 'none' }}><span style="font-size:26px;line-height:30px;font-weight:800">${m}</span><span style="font-size:14px;font-weight:700">minuti</span></button>`)}</div>
      <p class="o-body o-mut" style="margin-top:16px">Lo cambi quando vuoi dalle impostazioni.</p></div><//>`;
  else body = html`<${Flow} top=${html`<${TopBar} onBack=${() => { setStep('welcome'); setErr(null); }} title=""/>`}>
    <div class="o-pad" style="position:relative;padding-top:22px;padding-bottom:30px"><${Rally} pose="saluta" w=${180} alt="" style="position:absolute;right:-14px;top:-10px"/>
      <div class="o-col" style="gap:6px;position:relative;min-height:150px;max-width:200px"><h1 class="o-big" style="font-size:30px;line-height:34px">${mode === 'in' ? 'Bentornato' : 'Crea un account'}</h1><p class="o-lab">${mode === 'in' ? 'Entra con l\'account che hai già.' : 'Bastano nome, email e password.'}</p></div>
      ${mode === 'in' && html`<${Btn} cls="lg flat" bg="#fff" disabled=${busy} onClick=${() => enter(() => auth.google())}>Continua con Google<//>`}
      <${AccountForm} mode=${mode === 'in' ? 'in' : 'new'} busy=${busy} err=${err} onSubmit=${p => enter(() => (mode === 'in' ? auth.emailIn(p.email, p.password) : auth.emailUp(p.email, p.password, p.name)))}/>
      <div style="text-align:center;margin-top:6px"><button type="button" class="o-link" onClick=${() => { setMode(mode === 'in' ? 'new' : 'in'); setErr(null); }}>${mode === 'in' ? 'Non ho un account' : 'Ho già un account'}</button></div>
      <p class="o-s" style="text-align:center;margin-top:14px">Versione di prova: l'account resta su questo dispositivo.</p></div><//>`;
  return html`<div class="o-app">${body}</div>`;
}
