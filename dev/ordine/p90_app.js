
// =====================================================================================================
// GUSCIO DELL'APP: schede in basso, pila delle schermate, calcolatrice e chat sopra tutto
// =====================================================================================================
const SCREENS = {
  percorso: p => html`<${PercorsoScreen} ...${p}/>`,
  lezione: p => html`<${LessonScreen} nav=${p.nav} lessonKey=${p.key}/>`,
  testInizio: p => html`<${TestIntro} ...${p}/>`,
  testRun: p => html`<${TestRun} ...${p}/>`,
  testFine: p => html`<${TestDone} ...${p}/>`,
  testRev: p => html`<${TestReview} ...${p}/>`,
  pratica: p => html`<${PracticeRun} ...${p}/>`,
  deboli: p => html`<${WeakScreen} ...${p}/>`,
  sfida: p => html`<${DuelRun} ...${p}/>`,
  sfidaFine: p => html`<${DuelDone} ...${p}/>`,
  album: p => html`<${AlbumScreen} ...${p}/>`,
  impostazioni: p => html`<${SettingsScreen} ...${p}/>`,
  pro: p => html`<${ProScreen} ...${p}/>`,
  catalogo: p => html`<${CatalogScreen} ...${p}/>`,
  scheda: p => html`<${CourseSheetScreen} ...${p}/>`,
  salva: p => html`<${SaveScreen} ...${p}/>`
};
let NAV_ID = 0;
export function OrdineApp({ kit }) {
  const s = useS2();
  K = Object.assign({}, kit, { isPro: !!kit.isPro || !!s.pro });
  ordInjectCss();
  kit.useFlScreenLock();
  useOrdFit();
  const [tab, setTab] = useState('home'), [sub, setSub] = useState('allenati'), [stack, setStack] = useState([]);
  const [calc, setCalc] = useState(false), [ai, setAi] = useState(null), [toast, setToast] = useState(null);
  const nav = useMemo(() => ({
    tab: id => { setStack([]); setTab(id); if (id === 'allenati') setSub('allenati'); },
    sub: id => setSub(id),
    go: (name, params) => setStack(st => [...st, { name, params: params || {}, id: ++NAV_ID }]),
    back: () => setStack(st => st.slice(0, -1)),
    replace: (name, params) => setStack(st => [...st.slice(0, -1), { name, params: params || {}, id: ++NAV_ID }]),
    openCalc: () => setCalc(true),
    toast: msg => { setToast(msg); setTimeout(() => setToast(t => (t === msg ? null : t)), 3600); },
    askAI: (q, picked, preset) => {
      const now = new Date().toISOString(), id = `quiz_${Date.now()}`, plain = K.flPlain(q.q), right = L3[q.ans];
      const cq = { picked, correct: right, q: plain, opts: q.options.map(K.flPlain), topic: `${q.lesson.unit.name} · ${q.lesson.title}${picked ? ` (lo studente ha già risposto ${picked}; la risposta corretta è ${right}: puoi spiegarla apertamente)` : ''}` };
      const first = picked ? `Domanda: "${plain}"\n\nHai risposto ${picked}, la giusta è ${right}. Cosa vuoi capire? Posso spiegarti il perché, rifare i conti o darti un trucco per ricordarla.` : `Stai lavorando su:\n\n"${plain}"\n\nCome posso aiutarti?`;
      K.setChats(prev => [{ id, title: `Quiz: ${plain.slice(0, 35)}...`, createdAt: now, updatedAt: now, isQuizChat: true, quizQuestion: plain, messages: [{ role: 'assistant', content: first, timestamp: now }] }, ...prev].slice(0, 50));
      setAi({ id, q: cq, preset: preset || null });
    }
  }), []);
  // primo ingresso: nome per chi usava già l'app, test di livello per chi ha detto "so già qualcosa"
  useEffect(() => {
    const st = s2get(), u = kit.user || {};
    if (!st.name && (!u.displayName || u.displayName === 'Google User') && !u.guest && ((kit.losProgress || []).length || Object.keys(kit.albumLoad()).length)) s2set({ name: 'Stefano' });
    if (st.onboard && st.onboard.start === 'some' && !st.onboard.level) { s2set(x => ({ onboard: Object.assign({}, x.onboard, { level: true }) })); const c = st.onboard.goal === 'exam' ? 'cfa2' : 'basi'; nav.go('testInizio', { kind: 'level', course: c }); }
  }, []);
  const top = stack.length - 1;
  const tabScreen = tab === 'home' ? html`<${HomeScreen} nav=${nav}/>` : tab === 'allenati' ? (sub === 'test' ? html`<${TestScreen} nav=${nav}/>` : html`<${AllenatiScreen} nav=${nav}/>`)
    : tab === 'sfide' ? html`<${SfideScreen} nav=${nav}/>` : tab === 'coach' ? html`<${CoachScreen} nav=${nav}/>` : html`<${ProfiloScreen} nav=${nav}/>`;
  const layer = (on, child, key, anim) => html`<div key=${key} class=${anim ? 'o-in' : ''} style=${{ position: 'absolute', inset: 0, visibility: on ? 'visible' : 'hidden', pointerEvents: on ? 'auto' : 'none' }} aria-hidden=${on ? undefined : 'true'}>${child}</div>`;
  const Calc = kit.TICalculator, Chat = kit.AiChatModal;
  return html`<${React.Fragment}><div class="o-app">
    ${layer(top < 0, tabScreen, 'tab:' + tab + ':' + sub, false)}
    ${stack.map((e, k) => layer(k === top, SCREENS[e.name] ? SCREENS[e.name](Object.assign({ nav }, e.params)) : null, 'st' + e.id, true))}
    <${TermHost}/>
    ${toast && html`<div class="o-toast o-fade" role="status">${toast}</div>`}
  </div>
  ${calc && Calc && html`<${Calc} onClose=${() => setCalc(false)}/>`}
  ${ai && Chat && html`<${Chat} key=${ai.id} variant="quiz" chatId=${ai.id} chats=${K.chats} setChats=${K.setChats} currentQuestion=${ai.q} initialMessage=${ai.preset} onClose=${() => setAi(null)}/>`}<//>`;
}
