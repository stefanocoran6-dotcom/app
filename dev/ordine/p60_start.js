
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

// Primo giorno: benvenuto, obiettivo, (esame), punto di partenza, (5 domande), "Ecco la tua FinLearn".
// `auth` arriva da app.js (accesso di prova, salvato sul dispositivo); `pre` porta i dati che servono prima dell'accesso.
const GOALS = [['zero', 'Capire la finanza da zero', 'Soldi, interessi, inflazione', Sprout], ['invest', 'Investire i miei risparmi', 'Azioni, obbligazioni, fondi', TrendingUp], ['work', 'Usarla al lavoro', 'Bilanci, valutazioni, tassi', Briefcase], ['exam', 'Preparare un esame', 'CFA, FRM, CAIA', GraduationCap]];
function Choice({ on, onClick, icon, title, sub }) {
  return html`<button type="button" role="radio" aria-checked=${on ? 'true' : 'false'} onClick=${onClick} class="o-rowf" style=${{ gap: 14, width: '100%', minHeight: 72, padding: '12px 16px', border: `2.5px solid ${INK}`, borderRadius: 20, background: on ? T_AZ : '#fff', boxShadow: on ? `4px 4px 0 ${INK}` : 'none' }}>
    ${icon && html`<span class="o-ibox" style="width:42px;height:42px;border-radius:13px;font-size:15px">${icon}</span>`}
    <span class="o-grow o-col" style="gap:2px"><span style="font-size:17px;line-height:22px;font-weight:800">${title}</span><span class="o-s" style="font-size:14px;line-height:19px">${sub}</span></span>
    <span style=${{ width: 28, height: 28, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: `2.5px solid ${INK}`, background: on ? INK : '#fff', color: '#fff' }}>${on && PathIco(D_CHECK, 15, 3.6)}</span></button>`;
}

// Le unità del percorso in fila, come le vede chi ha appena scelto: la sai già, parti da qui, in arrivo. Per un esame, sotto ogni materia ci sono i moduli.
function PathRoute({ c, first }) {
  const stops = misStops(c), known = misGet().known || [], exam = c.group === 'cert', startU = first ? first.unit : null;
  const one = { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
  const node = (kind, n) => html`<span aria-hidden="true" style=${{ width: 26, height: 26, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: 12, lineHeight: 1, fontWeight: 800,
    background: kind === 'start' ? GIALLO : kind === 'known' ? MENTA : kind === 'soon' ? T_BG : '#fff', border: `2px ${kind === 'soon' ? 'dashed' : 'solid'} ${INK}` }}>${kind === 'known' ? PathIco(D_CHECK, 13, 4) : kind === 'soon' ? null : n}</span>`;
  const modName = (u, sec) => { let n = sec.name; if (n.startsWith(u.name + ': ')) n = n.slice(u.name.length + 2); return n.length > 38 && n.includes(': ') ? n.split(': ')[0] : n; };
  const lastU = stops.length ? stops[stops.length - 1].u : null, tail = exam && lastU ? 22 + lastU.sections.length * 22 : 18;
  let num = 0;
  return html`<div style="position:relative;margin-top:16px"><span aria-hidden="true" style=${{ position: 'absolute', left: 12, top: 20, bottom: tail, width: 2, background: INK }}></span>
    <ol class="o-col" style=${{ position: 'relative', gap: exam ? 12 : 8, listStyle: 'none', margin: 0, padding: 0 }}>${stops.map(s => {
      if (s.soon) return html`<li key=${s.soon.id} class="o-rowf" style="gap:12px;min-height:37px">${node('soon')}
        <span class="o-grow o-col" style="color:${MUT}"><span style="font-size:16px;line-height:20px;font-weight:700">${s.soon.name}</span><span style="font-size:13px;line-height:17px;font-weight:600"><b style="font-weight:800">In arrivo:</b> ${s.soon.sub}</span></span></li>`;
      const u = s.u, ls = unitLessons(u), kn = known.includes(u.id), st = u === startU; num++;
      const sub = exam ? `${plural(ls.length, 'lezione', 'lezioni')} in ${plural(u.sections.length, 'modulo', 'moduli')}` : kn ? `La sai già: ${plural(ls.length, 'lezione segnata come fatta', 'lezioni segnate come fatte')}` : (MIS_SUB[u.id] || plural(ls.length, 'lezione', 'lezioni'));
      const row = st ? html`<div class="o-rowf" style="gap:12px;margin:0 -10px;padding:8px 7.5px;background:${T_AZ};border:2.5px solid ${INK};border-radius:16px;box-shadow:3px 3px 0 ${INK}">${node('start', num)}
          <span class="o-grow o-col"><span class="o-rowf" style="gap:8px"><span class="o-grow" style=${Object.assign({ fontSize: 16, lineHeight: '20px', fontWeight: 800 }, one)}>${u.name}</span><span class="o-tag" style="flex:none;line-height:14px;padding:1px 8px">Parti da qui</span></span>
            <span style=${Object.assign({ fontSize: 13, lineHeight: '17px', fontWeight: 600 }, one)}>${sub}</span></span></div>`
        : html`<div class="o-rowf" style="gap:12px;min-height:37px">${node(kn ? 'known' : 'todo', num)}
          <span class="o-grow o-col"><span style=${Object.assign({ fontSize: 16, lineHeight: '20px', fontWeight: 700 }, one)}>${u.name}</span><span style=${Object.assign({ fontSize: 13, lineHeight: '17px', fontWeight: 600, color: MUT }, one)}>${sub}</span></span></div>`;
      return html`<li key=${u.id} class="o-col" style=${{ gap: st ? 8 : 4 }}>${row}
        ${exam && html`<ul class="o-col" style="list-style:none;margin:0;padding:0 0 0 38px">${u.sections.map(sec => html`<li key=${sec.id} class="o-rowf" style="gap:8px;min-height:22px"><span class="o-grow" lang="en" style=${Object.assign({ fontSize: 13, lineHeight: '18px', fontWeight: 600 }, one)}>${modName(u, sec)}</span>
          <span style="flex:none;font-size:13px;line-height:18px;font-weight:600;color:${MUT};font-variant-numeric:tabular-nums" aria-label=${plural(sec.lessons.length, 'lezione', 'lezioni')}>${sec.lessons.length}</span></li>`)}</ul>`}</li>`; })}</ol></div>`;
}
// Quante lezioni e quante unità ha il percorso di oggi, in una riga
function pathMeta(c) {
  const ls = misLessons(c), soon = misStops(c).filter(s => s.soon).length;
  if (c.group === 'cert') return `${plural(ls.length, 'lezione', 'lezioni')}, domande in inglese`;
  return soon ? `${plural(ls.length, 'lezione pronta', 'lezioni pronte')}, ${soon} unità in arrivo` : `${plural(ls.length, 'lezione breve', 'lezioni brevi')} in ${misUnits(c).length} unità`;
}
const NUM_IT = ['', 'una', 'due', 'tre', 'quattro', 'cinque'];

export function OrdineWelcome({ auth, onAuth, pre }) {
  const [step, setStep] = useState('welcome'), [goal, setGoal] = useState('zero'), [start, setStart] = useState('zero'), [mins, setMins] = useState(10), [date, setDate] = useState('');
  const [pl, setPl] = useState(null), [qi, setQi] = useState(0), [sel, setSel] = useState(null), [res, setRes] = useState([]), [known, setKnown] = useState([]);
  const [busy, setBusy] = useState(false), [err, setErr] = useState(null), [mode, setMode] = useState('in');
  if (!K) K = Object.assign({ losProgress: [], albumLoad: () => ({}) }, pre || {});   // prima dell'accesso: i dati dei percorsi e poco altro
  ordInjectCss();
  useOrdFit();
  // durante la registrazione il percorso scelto è una bozza: le schermate lo leggono come se fosse già salvato
  const draft = useMemo(() => ({ goal, level: start, known, more: [], add: [], t: 0 }), [goal, start, known]);
  const inReg = step !== 'welcome' && step !== 'login';
  MIS_DRAFT = inReg ? draft : null;
  useEffect(() => () => { MIS_DRAFT = null; }, []);
  const P = MIS_PATHS[goal], course = inReg ? courseById(P.course) : null, exam = goal === 'exam', N = exam ? 4 : 3, iStart = exam ? 2 : 1;
  const first = inReg ? nextLesson(course) : null;
  const enter = async fn => { setBusy(true); setErr(null); try { const r = await fn(); onAuth(r.user, r.data); } catch (e) { setErr((e && e.message) || 'Non ha funzionato, riprova.'); setBusy(false); } };
  const create = () => { const now = Date.now();
    s2set(s => ({ onboard: { goal, start, level: true, t: now }, mis: { goal, level: start, known, more: [], add: [], t: now, go: first ? first.key : null }, cur: P.course, settings: Object.assign({}, s.settings, { goalMin: mins }) }));
    if (exam && date) { try { localStorage.setItem('finlearn_exam_date', date); } catch (e) {} }
    enter(() => auth.guest()); };
  const pickGoal = id => { setGoal(id); setKnown([]); };
  const fromStart = () => { if (start === 'some') { setPl(placementFor(goal)); setQi(0); setRes([]); setSel(null); setKnown([]); setStep('quiz'); } else { setKnown([]); setStep('pronta'); } };
  const answer = () => { const it = pl.items[qi], ok = sel === it.q.ans, r = [...res, ok];
    try { recordAnswer(it.q, ok); } catch (e) {}
    setRes(r); setSel(null);
    if (qi < pl.items.length - 1) setQi(qi + 1); else { setKnown(placementKnown(pl, r)); setStep('esito'); } };
  const head = (pose, lab, title, minH = 156) => html`<${Rally} pose=${pose} w=${190} alt="" style="position:absolute;right:-14px;top:-10px"/>
    <div class="o-col" style=${{ gap: 6, position: 'relative', minHeight: minH, maxWidth: 200 }}><span class="o-lab">${lab}</span><h1 class="o-big" style="font-size:30px;line-height:34px">${title}</h1></div>`;
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
  else if (step === 'goal') body = html`<${Flow} top=${html`<${TopBar} onBack=${() => setStep('welcome')} n=${N} i=${0}/>`} foot=${html`<${Btn} cls="lg" onClick=${() => setStep(exam ? 'exam' : 'start')}>Continua<//>`}>
    <div class="o-pad" style="position:relative;padding-top:22px;padding-bottom:20px">${head('indica', `Passo 1 di ${N}`, 'Cosa vuoi fare con FinLearn?')}
      <div role="radiogroup" aria-label="Cosa vuoi fare con FinLearn" class="o-col" style="gap:12px;position:relative">${GOALS.map(([id, t, s, I]) => html`<${Choice} key=${id} on=${goal === id} onClick=${() => pickGoal(id)} icon=${Ico(I, 22)} title=${t} sub=${s}/>`)}</div>
      <p class="o-body o-mut" style="margin-top:18px">Da questa scelta dipende cosa trovi nell'app. La cambi quando vuoi, senza perdere i progressi.</p></div><//>`;
  else if (step === 'exam') body = html`<${Flow} top=${html`<${TopBar} onBack=${() => setStep('goal')} n=${N} i=${1}/>`} foot=${html`<${Btn} cls="lg" onClick=${() => setStep('start')}>Continua<//>`}>
    <div class="o-pad" style="position:relative;padding-top:22px;padding-bottom:20px">${head('insegna', 'Passo 2 di 4', 'Quale esame prepari?')}
      <div class="o-col" style="gap:10px;position:relative">
        <${Choice} on=${true} onClick=${() => {}} icon="L2" title=${course.name} sub=${pathMeta(course)}/>
        ${COMING.filter(x => x.group === 'cert').map(x => html`<div key=${x.id} class="o-rowf" style="gap:14px;min-height:56px;padding:8px 16px;border:2px dashed ${INK};border-radius:20px;background:${T_BG}"><span class="o-grow o-t" style="color:${MUT}">${x.name}</span><span class="o-tag" style="background:#fff">In arrivo</span></div>`)}</div>
      <h2 class="o-h2" style="margin:24px 0 10px">Quando hai l'esame?</h2>
      <input class="o-inp" type="date" value=${date} onChange=${e => setDate(e.target.value)} aria-label="Data dell'esame"/>
      <p class="o-body o-mut" style="margin-top:10px;font-size:14px;line-height:20px">Con la data, in Home vedi quanti giorni mancano. Puoi metterla anche dopo.</p></div><//>`;
  else if (step === 'start') body = html`<${Flow} top=${html`<${TopBar} onBack=${() => setStep(exam ? 'exam' : 'goal')} n=${N} i=${iStart}/>`} foot=${html`<${Btn} cls="lg" onClick=${fromStart}>${start === 'some' ? 'Fai le 5 domande' : 'Continua'}<//>`}>
    <div class="o-pad" style="position:relative;padding-top:22px;padding-bottom:20px">${head('occhiolino', `Passo ${iStart + 1} di ${N}`, 'Da dove parti?')}
      <div role="radiogroup" aria-label="Da dove parti" class="o-col" style="gap:12px;position:relative">
        <${Choice} on=${start === 'zero'} onClick=${() => setStart('zero')} title="Parto da zero" sub="Comincio dalla prima lezione."/>
        <${Choice} on=${start === 'some'} onClick=${() => setStart('some')} title="So già qualcosa" sub=${exam ? 'Cinque domande per capire a che punto sei.' : 'Cinque domande, e Rally ti fa saltare quello che sai già.'}/></div>
      <h2 class="o-h2" style="margin:28px 0 12px">Quanto tempo hai al giorno?</h2>
      <div role="radiogroup" aria-label="Minuti al giorno" style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">${[5, 10, 20].map(m => html`<button key=${m} type="button" role="radio" aria-checked=${mins === m ? 'true' : 'false'} onClick=${() => setMins(m)} class="o-col"
        style=${{ alignItems: 'center', padding: '10px 0 12px', border: `2.5px solid ${INK}`, borderRadius: 18, background: mins === m ? AZ : '#fff', boxShadow: mins === m ? `4px 4px 0 ${INK}` : 'none' }}><span style="font-size:26px;line-height:30px;font-weight:800">${m}</span><span style="font-size:14px;font-weight:700">minuti</span></button>`)}</div>
      <p class="o-body o-mut" style="margin-top:16px">Livello e minuti li cambi quando vuoi dalle impostazioni.</p></div><//>`;
  else if (step === 'quiz') { const q = pl.items[qi].q, n = pl.items.length;
    body = html`<${Flow} top=${html`<${TopBar} onBack=${() => setStep('start')} n=${n} i=${qi}/>`} foot=${html`<${Btn} cls="lg" disabled=${sel == null} onClick=${answer}>${qi < n - 1 ? 'Avanti' : 'Vedi da dove parti'}<//>`}>
      <div class="o-test"><div class="o-pad" style="padding-top:18px;padding-bottom:20px"><span class="o-lab">Domanda ${qi + 1} di ${n}</span>
        <div style="margin-top:6px"><${Rich} key=${'q' + qi} text=${q.q} cls="q" lang=${q.lang}/></div>
        <div style="margin-top:14px"><${Options} key=${'o' + qi} q=${q} sel=${sel} onSel=${setSel} locked=${false}/></div></div></div><//>`; }
  else if (step === 'esito') { const ok = res.filter(Boolean).length, nk = known.length, startU = first ? first.unit : course.units[0];
    const text = exam ? 'Per un esame si parte dalla prima materia. Le domande che hai sbagliato le ritrovi tra i punti deboli, in Allenati.'
      : nk === 1 ? 'La prima unità la sai già: Rally te la segna come fatta. Resta aperta, la ripassi quando vuoi.'
      : nk > 1 ? `Le prime ${NUM_IT[nk] || nk} unità le sai già: Rally te le segna come fatte. Restano aperte, le ripassi quando vuoi.`
      : 'Meglio partire dalla prima unità, così non resta nessun buco. Le lezioni sono brevi.';
    body = html`<${Flow} top=${html`<${TopBar} onBack=${() => setStep('start')} n=${N} i=${iStart}/>`}
      foot=${html`<div class="o-col" style="align-items:center;gap:2px"><div style="width:100%"><${Btn} cls="lg" onClick=${() => setStep('pronta')}>${nk ? 'Parto da qui' : 'Continua'}<//></div>
        ${nk > 0 && html`<button type="button" class="o-link" onClick=${() => { setKnown([]); setStep('pronta'); }}>Preferisco partire dall'inizio</button>`}</div>`}>
      <div class="o-pad" style="position:relative;padding-top:22px;padding-bottom:20px"><${Rally} pose="occhiolino" w=${190} alt="" style="position:absolute;right:-14px;top:-10px"/>
        <div class="o-col" style="position:relative;align-items:flex-start;gap:12px;min-height:162px;max-width:214px"><${Pill}>${ok} ${ok === 1 ? 'giusta' : 'giuste'} su ${res.length}<//><h1 class="o-big">${nk || exam ? 'Parti da ' + startU.name : 'Parti dall\'inizio'}</h1></div>
        <p class="o-body o-mut" style="margin-bottom:14px;position:relative">${text}</p>
        ${!exam && html`<div class="o-col" style="gap:4px">${pl.units.map((u, k) => { const kn = known.includes(u.id), st = u === startU;
          return html`<div key=${u.id} class="o-rowf" style=${{ gap: 12, minHeight: st ? 62 : 58, padding: '0 10px', border: `2.5px solid ${st ? INK : '#fff'}`, borderRadius: 16, background: st ? T_AZ : '#fff', boxShadow: st ? `3px 3px 0 ${INK}` : 'none' }}>
            <span class="o-ibox" style=${{ width: 40, height: 40, borderRadius: 13, fontSize: 15, background: kn ? MENTA : '#fff' }}>${kn ? PathIco(D_CHECK, 20, 3) : k + 1}</span>
            <span class="o-grow o-col" style="gap:1px"><span class="o-t" style=${{ fontWeight: st ? 800 : 700 }}>${u.name}</span><span class="o-s" style=${st ? { color: INK } : null}>${plural(unitLessons(u).length, 'lezione', 'lezioni')}</span></span>
            ${kn ? html`<span class="o-tag" style="background:${T_MENTA}">La sai già</span>` : st ? html`<span class="o-tag">Parti da qui</span>` : null}</div>`; })}</div>`}</div><//>`; }
  else if (step === 'pronta') body = html`<div class="o-scr" style="background:${AZ}"><${TopBar} onBack=${() => setStep(start === 'some' && pl ? 'esito' : 'start')} n=${N} i=${N}/>
    <div class="o-scroll"><div class="o-col" style="min-height:100%">
      <div style="position:relative;flex:none"><${Rally} pose="festeggia" w=${200} alt="" style="position:absolute;right:-12px;top:0"/>
        <div class="o-col" style="position:relative;align-items:flex-start;gap:12px;padding:18px 20px 22px;max-width:230px"><h1 style="font-size:34px;line-height:36px;font-weight:800;letter-spacing:-.02em">Ecco la tua FinLearn</h1><${Pill}>${P.pill}<//></div></div>
      <div class="o-sheet o-col" style="flex:1 0 auto;padding-bottom:22px">
        <div class="o-rowf" style="gap:12px"><span class="o-ibox" style=${{ width: 48, height: 48, borderWidth: 2.5, borderRadius: 15, background: P.color, fontSize: exam ? 18 : 22 }}>${P.ico ? Ico(P.ico, 24) : course.badge}</span>
          <div class="o-grow o-col" style="gap:1px"><h2 style="font-size:20px;line-height:24px;font-weight:800">${P.name}</h2><span class="o-s">${pathMeta(course)}</span></div></div>
        <${PathRoute} c=${course} first=${first}/></div></div></div>
    <div class="o-foot" style="border-top:2px solid ${SEP}">${err && html`<p class="o-s" style="color:#B3261E;font-weight:700;margin-bottom:8px;text-align:center" role="alert">${err}</p>`}
      <${Btn} cls="lg" disabled=${busy} onClick=${create}>${busy ? 'Un attimo…' : known.length && first ? 'Inizia da ' + first.title : 'Inizia la prima lezione'}<//>
      <p class="o-s" style="text-align:center;margin-top:10px">Cambi obiettivo quando vuoi, in Impostazioni.</p></div></div>`;
  else body = html`<${Flow} top=${html`<${TopBar} onBack=${() => { setStep('welcome'); setErr(null); }} title=""/>`}>
    <div class="o-pad" style="position:relative;padding-top:22px;padding-bottom:30px"><${Rally} pose="saluta" w=${180} alt="" style="position:absolute;right:-14px;top:-10px"/>
      <div class="o-col" style="gap:6px;position:relative;min-height:150px;max-width:200px"><h1 class="o-big" style="font-size:30px;line-height:34px">${mode === 'in' ? 'Bentornato' : 'Crea un account'}</h1><p class="o-lab">${mode === 'in' ? 'Entra con l\'account che hai già.' : 'Bastano nome, email e password.'}</p></div>
      ${mode === 'in' && html`<${Btn} cls="lg flat" bg="#fff" disabled=${busy} onClick=${() => enter(() => auth.google())}>Continua con Google<//>`}
      <${AccountForm} mode=${mode === 'in' ? 'in' : 'new'} busy=${busy} err=${err} onSubmit=${p => enter(() => (mode === 'in' ? auth.emailIn(p.email, p.password) : auth.emailUp(p.email, p.password, p.name)))}/>
      <div style="text-align:center;margin-top:6px"><button type="button" class="o-link" onClick=${() => { setMode(mode === 'in' ? 'new' : 'in'); setErr(null); }}>${mode === 'in' ? 'Non ho un account' : 'Ho già un account'}</button></div>
      <p class="o-s" style="text-align:center;margin-top:14px">Versione di prova: l'account resta su questo dispositivo.</p></div><//>`;
  return html`<div class="o-app">${body}</div>`;
}
