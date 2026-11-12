
// =====================================================================================================
// GUSCIO DELL'APP: schede in basso, pila delle schermate, calcolatrice e chat sopra tutto
// =====================================================================================================
const SCREENS = {
  percorso: p => html`<${PercorsoScreen} ...${p}/>`,
  lezione: p => html`<${LessonScreen} nav=${p.nav} lessonKey=${p.key} at=${p.at} ask=${p.ask}/>`,
  testInizio: p => html`<${TestIntro} ...${p}/>`,
  testRun: p => html`<${TestRun} ...${p}/>`,
  testFine: p => html`<${TestDone} ...${p}/>`,
  testRev: p => html`<${TestReview} ...${p}/>`,
  pratica: p => html`<${PracticeRun} ...${p}/>`,
  deboli: p => html`<${WeakScreen} ...${p}/>`,
  sfida: p => html`<${DuelRun} ...${p}/>`,
  sfidaFine: p => html`<${DuelDone} ...${p}/>`,
  live: p => html`<${LiveScreen} ...${p}/>`,
  album: p => html`<${AlbumScreen} ...${p}/>`,
  articolo: p => html`<${ArticleScreen} ...${p}/>`,
  notizie: p => html`<${NewsArchiveScreen} ...${p}/>`,
  impostazioni: p => html`<${SettingsScreen} ...${p}/>`,
  pro: p => html`<${ProScreen} ...${p}/>`,
  catalogo: p => html`<${CatalogScreen} ...${p}/>`,
  livello: p => html`<${LevelScreen} ...${p}/>`,
  scheda: p => html`<${CourseSheetScreen} ...${p}/>`,
  salva: p => html`<${SaveScreen} ...${p}/>`
};
let NAV_ID = 0;
export function OrdineApp({ kit }) {
  const s = useS2();
  K = Object.assign({}, kit, { isPro: !!kit.isPro || !!s.pro });
  MIS_DRAFT = null;   // la bozza della registrazione non deve restare viva dentro l'app
  ordInjectCss();
  kit.useFlScreenLock();
  useOrdFit();
  const [tab, setTab] = useState('home'), [sub, setSub] = useState('allenati'), [stack, setStack] = useState([]);
  const [calc, setCalc] = useState(false), [ai, setAi] = useState(null), [toast, setToast] = useState(null);
  const tabRef = useRef(tab); tabRef.current = tab;
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
      setAi({ id, q: cq, preset: preset || null, back: { tab: tabRef.current, chat: id } });
    },
    // chat su una pagina (o una domanda) di lezione: una sola per pagina, se c'è già si riapre
    askAbout: ({ id, title, ctx, first, back }) => {
      const now = new Date().toISOString();
      if (!(K.chats || []).some(c => c.id === id)) K.setChats(prev => [{ id, title, createdAt: now, updatedAt: now, isLessonChat: true, messages: [{ role: 'assistant', content: first, timestamp: now }] }, ...prev].slice(0, 50));
      setAi({ id, q: ctx, preset: null, back: back || null });
    }
  }), []);
  // ritorno da OpenRouter (la pagina si è ricaricata): si riapre il punto da cui era partito il collegamento
  useEffect(() => {
    const go = () => {
      const b = K.flOR && K.flOR.takeBack(); if (!b) return;
      if (b.lesson && lessonByKey(b.lesson)) { setStack([]); setTab('home'); nav.go('lezione', { key: b.lesson, at: b.at || 0, ask: true }); }
      else if (b.screen === 'impostazioni') { setStack([]); setTab('profilo'); nav.go('impostazioni', { sheet: 'or' }); }
      else if (b.tab) { nav.tab(b.tab); if (b.tab === 'coach' && b.chat && (K.chats || []).some(c => c.id === b.chat)) K.setActiveChatId(b.chat); }
    };
    go(); window.addEventListener('fl-or', go); return () => window.removeEventListener('fl-or', go);
  }, []);
  // link di una sfida dal vivo (…#sfida=CODICE): si apre direttamente la stanza
  useEffect(() => { const c = liveInvito(); if (c) { setStack([]); setTab('sfide'); nav.go('live', { codice: c }); } }, []);
  // primo ingresso: nome per chi usava già l'app, test di livello per chi ha detto "so già qualcosa"
  useEffect(() => {
    const st = s2get(), u = kit.user || {};
    if (!st.name && (!u.displayName || u.displayName === 'Google User') && !u.guest && ((kit.losProgress || []).length || Object.keys(kit.albumLoad()).length)) s2set({ name: 'Stefano' });
    // su misura: chi usava già l'app riceve il percorso ricavato da quello che aveva scelto o iniziato (non perde niente)
    if (!st.mis || !MIS_PATHS[st.mis.goal]) s2set({ mis: misDerive(st) });
    // appena registrato: "Inizia la prima lezione" porta dritto alla lezione
    else if (st.mis.go) { const k = st.mis.go; s2set(x => ({ mis: Object.assign({}, x.mis, { go: null }) })); if (lessonByKey(k)) nav.go('lezione', { key: k }); }
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
  ${ai && Chat && html`<${Chat} key=${ai.id} variant="quiz" chatId=${ai.id} chats=${K.chats} setChats=${K.setChats} currentQuestion=${ai.q} initialMessage=${ai.preset} orBack=${ai.back} onClose=${() => setAi(null)}/>`}<//>`;
}
