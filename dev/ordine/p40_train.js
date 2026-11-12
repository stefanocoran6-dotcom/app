
// =====================================================================================================
// ALLENATI e TEST
// =====================================================================================================
const fmtClock = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const fmtSpan = s => s < 60 ? `${Math.round(s)} s` : `${Math.floor(s / 60)} min${Math.round(s % 60) ? ' ' + Math.round(s % 60) + ' s' : ''}`;
const AllenaSwitch = ({ on, nav }) => html`<div role="tablist" style="display:inline-flex;padding:3px;background:#fff;border:2px solid ${INK};border-radius:999px">
  ${[['allenati', 'Allenati'], ['test', 'Test']].map(([id, t]) => html`<button key=${id} type="button" role="tab" aria-selected=${on === id ? 'true' : 'false'} onClick=${() => nav.sub(id)}
    style=${{ height: 30, padding: '0 14px', borderRadius: 999, fontSize: 14, fontWeight: 800, background: on === id ? INK : 'transparent', color: on === id ? '#fff' : INK }}>${t}</button>`)}</div>`;
// miniatura di una figurina (album, allenati, profilo)
function Sticker({ l, state, w = 92, onClick, big }) {
  const emoji = lessonEmoji(l), miss = state === 'manca', fade = state === 'sbiadisce', gold = state === 'dorata';
  const tile = miss ? 'transparent' : gold ? GIALLO : fade ? T_GR : (l.course.id === 'basi' ? [AZ, GIALLO, MENTA, PESCA, LILLA][l.course.lessons.indexOf(l) % 5] : [AZ, MENTA, PESCA, LILLA, ROSA][(l.section.num || 0) % 5]);
  const inner = html`<span class="o-col" style=${{ width: w, gap: 6, padding: miss ? 6 : '6px 6px 8px', background: miss ? 'transparent' : '#fff', border: miss ? `2px dashed ${INK}` : `2.5px solid ${fade ? '#8A93A0' : INK}`, borderRadius: 16,
      boxShadow: miss || fade ? 'none' : `3px 3px 0 ${INK}`, transform: miss || fade ? 'none' : `rotate(${[-2, 2, -1, 1][(l.key.length + l.key.charCodeAt(l.key.length - 1)) % 4]}deg)`, color: fade ? DIMT : INK }}>
    <span style=${{ height: big ? 64 : 52, display: 'flex', alignItems: 'center', justifyContent: 'center', background: tile, border: miss ? `2px dashed ${INK}` : `2px solid ${fade ? '#8A93A0' : INK}`, borderRadius: 10, fontSize: emoji && !miss ? 26 : 20, lineHeight: 1, fontWeight: 800, filter: fade ? 'grayscale(1)' : 'none', opacity: fade ? .7 : 1 }}>${miss ? '?' : (emoji || stickerSym(l))}${gold && html`<span style="font-size:12px;margin-left:3px">★</span>`}</span>
    <span style="font-size:12px;line-height:15px;font-weight:700;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:30px;text-align:left;overflow-wrap:anywhere">${l.title}</span></span>`;
  return onClick ? html`<button type="button" onClick=${onClick} aria-label=${`${l.title}: ${state}`}>${inner}</button>` : inner;
}

function AllenatiScreen({ nav }) {
  useS2(); useTick();
  const album = K.albumLoad(), now = Date.now();
  const due = dueLessons(), have = Object.keys(album).length, streak = streakDays();
  const cur = currentCourse(), exam = inMyApp('cfa2');   // la simulazione d'esame c'è solo per chi ha il CFA nella sua app
  const weak = topicScores(cur)[0], mock = s2get().tests['mock:cfa2'];
  const mins = Math.max(2, Math.round(due.reduce((n, l) => n + (lessonQuestions(l).length ? 1.5 : 0.7), 0)));
  return html`<${Room} color=${MENTA} tab="allenati" go=${nav.tab}
    rally=${html`<${Rally} pose="allena" alt="Rally con la fascia in fronte" style="position:absolute;right:-10px;top:calc(var(--otop) + 4px)"/>`}
    head=${html`<div style="margin-top:-2px"><${AllenaSwitch} on="allenati" nav=${nav}/></div>
      <div class="o-col" style="align-items:flex-start;gap:14px;margin-top:10px;max-width:210px"><h1 class="o-h1">Allenati</h1><${Pill}>${streak > 0 ? `${plural(streak, 'giorno', 'giorni')} di fila` : 'Comincia oggi'}<//></div>`}>
    <div class="o-pad" style="position:relative;z-index:1"><div class="o-card o-col" style="gap:14px">
      ${due.length > 0 ? html`<div style="display:flex;gap:10px;justify-content:center">${due.slice(0, 3).map(l => html`<${Sticker} key=${l.key} l=${l} state="sbiadisce" w=${96}/>`)}</div>
          <div class="o-col" style="gap:4px"><div style="font-size:22px;line-height:26px;font-weight:800;letter-spacing:-.01em">${due.length === 1 ? 'Una figurina sta sbiadendo' : `${due.length} figurine stanno sbiadendo`}</div><div class="o-body o-mut">${due.length === 1 ? 'La ravvivi' : 'Le ravvivi'} in circa ${plural(mins, 'minuto', 'minuti')}.</div></div>
          <${Btn} bg=${MENTA} onClick=${() => nav.go('pratica', { mode: 'ravviva' })}>${due.length === 1 ? 'Ravviva la figurina' : 'Ravviva le figurine'}<//>`
        : have > 0 ? html`<div class="o-col" style="gap:4px"><div style="font-size:22px;line-height:26px;font-weight:800;letter-spacing:-.01em">Le tue figurine sono tutte vive</div><div class="o-body o-mut">Nessun ripasso in scadenza. Se vuoi, tieniti in forma con un quiz misto.</div></div>
          <${Btn} bg=${MENTA} onClick=${() => nav.go('pratica', { mode: 'mix' })}>Fai un quiz misto<//>`
        : html`<div class="o-col" style="gap:4px"><div style="font-size:22px;line-height:26px;font-weight:800;letter-spacing:-.01em">Qui ripassi quello che impari</div><div class="o-body o-mut">Ogni lezione finita diventa una figurina. Se non la ripassi sbiadisce, e la ravvivi da qui.</div></div>
          <${Btn} bg=${MENTA} onClick=${() => nav.tab('home')}>Vai alle lezioni<//>`}
    </div></div>
    <div style="height:24px;flex:none"></div>
    <${Sheet}>
      <h2 class="o-h2" style="margin-bottom:4px">Oppure scegli tu</h2>
      <${Row} icon=${PathIco(D_TABS.allenati, 22, 2.4)} title="Quiz misto" sub=${misCourses().length > 1 ? '10 domande dai tuoi percorsi' : '10 domande dal tuo percorso'} chev=${true} onClick=${() => nav.go('pratica', { mode: 'mix' })}/>
      <${Row} icon=${Ico(Target, 22)} title="Punti deboli" sub=${weak ? weak.name : 'Rally li trova dalle tue risposte'} chev=${true} onClick=${() => nav.go('deboli')}/>
      ${exam ? html`<${Row} icon=${Ico(Timer, 22)} title="Simulazione d'esame" sub=${mock ? `CFA Level II, ultimo punteggio ${Math.round(mock.ok / mock.n * 100)}%` : 'CFA Level II, 44 domande a tempo'} chev=${true} last=${true} onClick=${() => nav.go('testInizio', { kind: 'mock', course: 'cfa2' })}/>`
        : html`<${Row} icon=${Ico(Compass, 22)} title="Test di livello" sub="5 domande per capire a che punto sei" chev=${true} last=${true} onClick=${() => nav.go('testInizio', { kind: 'level', course: cur.id })}/>`}
    <//>
  <//>`;
}

// sezione consigliata per la prossima verifica: quella con più lezioni fatte tra le non ancora superate
function suggestedTest(c) {
  const tests = s2get().tests; let best = null;
  misUnits(c).forEach(u => u.sections.forEach(sec => { if (allQuestions(sec.lessons).length < 3) return; const t = tests['unit:' + sec.id]; if (t && t.passedEver) return; const d = doneCount(sec.lessons); if (!best || d > best.d) best = { sec, d }; }));
  return best ? best.sec : null;
}
const testableSections = c => misUnits(c).flatMap(u => u.sections).filter(sec => allQuestions(sec.lessons).length >= 3);
function TestScreen({ nav }) {
  useS2();
  const [list, setList] = useState(false);
  const c = currentCourse(), exam = inMyApp('cfa2'), tests = s2get().tests, last = tests._last;
  const sug = suggestedTest(c), secs = testableSections(c), passed = secs.filter(x => tests['unit:' + x.id] && tests['unit:' + x.id].passedEver).length;
  const qn = sug ? Math.min(10, allQuestions(sug.lessons).length) : 0;
  return html`<${Room} color=${MENTA} tab="allenati" go=${nav.tab} headH=${176}
    rally=${html`<${Rally} pose="allena2" alt="Rally pronto per il test" style="position:absolute;right:-10px;top:calc(var(--otop) + 13px)"/>`}
    head=${html`<div style="margin-top:-2px"><${AllenaSwitch} on="test" nav=${nav}/></div>
      <div class="o-col" style="align-items:flex-start;gap:14px;margin-top:14px;max-width:200px"><h1 class="o-h1m">Mettiti alla prova</h1><${Pill}>${last ? `Ultimo test: ${last.ok} su ${last.n}` : 'Nessun test, per ora'}<//></div>`}>
    <div class="o-pad" style="position:relative;z-index:1"><div class="o-card o-col" style="gap:14px">
      ${sug ? html`<div class="o-col" style="gap:3px"><span class="o-s">Consigliato adesso</span><div style="font-size:22px;line-height:26px;font-weight:800;letter-spacing:-.01em;overflow-wrap:anywhere">Verifica: ${sug.name}</div>
          <div class="o-body o-mut">${misName(c)}, ${qn} domande, ${Math.round(qn * c.pace / 60)} minuti</div></div>
        <div class="o-rowf" style="gap:12px;padding:10px 14px;background:${T_GIALLO};border-radius:14px"><span style="width:28px;height:28px;flex:none;display:flex;align-items:center;justify-content:center;background:${GIALLO};border:2px solid ${INK};border-radius:9px">${PathIco(D_STAR, 16, 2, INK, INK)}</span><span class="o-t" style="font-size:15px">Se passi, le figurine diventano dorate.</span></div>
        <${Btn} bg=${MENTA} onClick=${() => nav.go('testInizio', { kind: 'unit', course: c.id, section: sug.id })}>Inizia la verifica<//>`
      : html`<div class="o-col" style="gap:4px"><div style="font-size:22px;line-height:26px;font-weight:800">Hai superato tutte le verifiche</div><div class="o-body o-mut">${exam ? 'Resta la simulazione d\'esame, quando ti senti pronto.' : 'Tieniti in forma con il quiz misto, in Allenati.'}</div></div>`}
    </div></div>
    <div style="height:24px;flex:none"></div>
    <${Sheet}>
      <h2 class="o-h2" style="margin-bottom:4px">Tutti i test</h2>
      <${Row} icon=${Ico(Compass, 22)} title="Test di livello" sub="5 domande per capire a che punto sei" chev=${true} onClick=${() => nav.go('testInizio', { kind: 'level', course: c.id })}/>
      <${Row} icon=${Ico(Flag, 22)} title="Verifiche di unità" sub=${`${misName(c)}: ${passed} ${passed === 1 ? 'superata' : 'superate'} su ${secs.length}`} chev=${true} last=${!exam} onClick=${() => setList(true)}/>
      ${exam && html`<${Row} icon=${Ico(Timer, 22)} title="Simulazione d'esame" sub="CFA Level II, 44 domande a tempo" tag=${K.isPro ? null : 'Pro'} chev=${true} last=${true} onClick=${() => nav.go('testInizio', { kind: 'mock', course: 'cfa2' })}/>`}
    <//>
    ${list && html`<${BSheet} onClose=${() => setList(false)} label="Verifiche di unità">
      <h2 class="o-big" style="margin-bottom:6px;flex:none">Verifiche di unità</h2>
      <div class="o-scroll" style="flex:0 1 auto;max-height:64vh">${secs.map((sec, k) => { const t = tests['unit:' + sec.id]; return html`<${Row} key=${sec.id} icon=${t && t.passedEver ? PathIco(D_STAR, 20, 2, INK, INK) : (sec.num || k + 1)} ibg=${t && t.passedEver ? GIALLO : null}
        title=${sec.name} sub=${t ? `${t.passedEver ? 'Superata' : 'Non ancora superata'}, migliore ${t.best} su ${t.n}` : `${Math.min(10, allQuestions(sec.lessons).length)} domande`} chev=${true} last=${k === secs.length - 1} onClick=${() => { setList(false); nav.go('testInizio', { kind: 'unit', course: c.id, section: sec.id }); }}/>`; })}</div>
    <//>`}
  <//>`;
}

function TestIntro({ nav, kind, course, section }) {
  const c = courseById(course) || currentCourse();
  const sec = section ? c.units.flatMap(u => u.sections).find(s => s.id === section) : null;
  const t = useMemo(() => buildTest(kind, c, sec), [kind, course, section]);
  const needPro = kind === 'mock' && !K.isPro;
  const start = () => { if (needPro) return nav.go('pro', { why: 'test' }); nav.replace('testRun', { test: t }); };
  const info = [[EyeOff, 'Niente aiuti: le spiegazioni arrivano alla fine.'], [Flag, 'Puoi segnare una domanda e tornarci dopo.'], [Calculator, 'La calcolatrice resta a portata di mano.']];
  return html`<${Flow} top=${html`<${TopBar} onClose=${nav.back} title=""/>`}
    foot=${html`<p class="o-s" style="text-align:center;margin-bottom:10px;font-size:14px;font-weight:700">${needPro ? 'La simulazione completa è nel piano Pro.' : 'Il tempo parte subito.'}</p><${Btn} cls="lg" bg=${needPro ? GIALLO : MENTA} disabled=${!t.qs.length} onClick=${start}>${needPro ? 'Scopri Pro' : 'Inizia'}<//>`}>
    <div class="o-pad" style="position:relative;padding-top:22px;padding-bottom:20px">
      <${Rally} pose="allena2" w=${196} alt="" style="position:absolute;right:-12px;top:-14px"/>
      <div class="o-col" style="gap:6px;position:relative;min-height:150px;max-width:205px"><span class="o-lab">${c.name}</span><h1 class="o-big" style="overflow-wrap:anywhere">${t.title}</h1></div>
      <div class="o-card s" style="position:relative;padding:6px 18px;margin-top:14px">
        ${[['Domande', t.qs.length], ['Tempo', fmtDur(Math.round(t.secs / 60))], ['Per passare', `${t.pass} giuste`]].map(([a, b], k) => html`<div key=${a} class="o-rowf" style=${{ height: 48, justifyContent: 'space-between', gap: 12, borderBottom: k < 2 ? `2px solid ${SEP}` : 0 }}><span style="font-size:15px;font-weight:600">${a}</span><span style="font-size:18px;font-weight:800">${b}</span></div>`)}
      </div>
      <div class="o-col" style="gap:14px;margin-top:20px">${info.map(([I, tx]) => html`<div key=${tx} class="o-rowf" style="gap:14px"><span class="o-ibox" style="width:36px;height:36px;border-radius:11px">${Ico(I, 18, 2.4)}</span><span class="o-t" style="font-size:15px;font-weight:600">${tx}</span></div>`)}</div>
      ${kind === 'unit' && html`<div class="o-rowf" style="gap:12px;padding:12px 14px;margin-top:20px;background:${T_GIALLO};border-radius:16px"><span style="width:32px;height:32px;flex:none;display:flex;align-items:center;justify-content:center;background:${GIALLO};border:2px solid ${INK};border-radius:10px">${PathIco(D_STAR, 18, 2, INK, INK)}</span><span class="o-t" style="font-size:15px">Se passi, le figurine dell'unità diventano dorate e restano vive più a lungo.</span></div>`}
    </div>
  <//>`;
}

function TestRun({ nav, test }) {
  const t = test, n = t.qs.length;
  const [i, setI] = useState(0), [ans, setAns] = useState({}), [flags, setFlags] = useState({}), [tab, setTab] = useState('case'), [quit, setQuit] = useState(false);
  const [dead] = useState(() => Date.now() + t.secs * 1000), [t0] = useState(Date.now()), [leftS, setLeftS] = useState(t.secs);
  const scrollRef = useRef(null), stripRef = useRef(null), sent = useRef(false);
  const submit = () => {
    if (sent.current) return; sent.current = true;
    const res = t.qs.map((q, k) => ans[k] == null ? null : { sel: ans[k], ok: ans[k] === q.ans });
    t.qs.forEach((q, k) => { if (res[k]) recordAnswer(q, res[k].ok); });
    const r = saveTest(t, res, Math.round((Date.now() - t0) / 1000));
    addXp(r.passed ? 50 : 2 * r.ok);
    nav.replace('testFine', { test: t, res, result: r });
  };
  useEffect(() => { const h = setInterval(() => { const s = Math.max(0, Math.round((dead - Date.now()) / 1000)); setLeftS(s); if (s <= 0) { clearInterval(h); submit(); } }, 500); return () => clearInterval(h); }, [ans]);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; setTab('case'); const el = stripRef.current && stripRef.current.children[i]; if (el && el.scrollIntoView) { try { el.scrollIntoView({ inline: 'center', block: 'nearest' }); } catch (e) {} } }, [i]);
  const q = t.qs[i], cs = splitCase(q), answered = Object.keys(ans).length;
  const go = k => setI(clamp(k, 0, n - 1));
  const top = html`<div class="o-top o-pad" style="flex:none">
    <div class="o-rowf" style="height:44px;gap:12px;justify-content:space-between"><${IBtn} d=${D_X} onClick=${() => setQuit(true)} label="Esci dal test"/>
      <span class="o-rowf o-mono" role="timer" style=${{ gap: 8, height: 40, padding: '0 16px', background: leftS <= 60 ? ROSA : '#fff', border: `2px solid ${INK}`, borderRadius: 999, boxShadow: `2px 2px 0 ${INK}`, fontSize: 17, fontWeight: 600 }}>${Ico(Clock, 18, 2.4)}${fmtClock(leftS)}</span>
      <span style="min-width:44px;text-align:right;font-size:14px;font-weight:800">${i + 1}/${n}</span></div>
    <div ref=${stripRef} class="o-scroll" style="display:flex;gap:6px;margin:14px -20px 0;padding:0 20px 2px;overflow-x:auto;overflow-y:hidden;flex:none">
      ${t.qs.map((_, k) => html`<button key=${k} type="button" onClick=${() => go(k)} aria-label=${`Domanda ${k + 1}${ans[k] != null ? ', risposta data' : ''}${flags[k] ? ', segnata' : ''}`} aria-current=${k === i ? 'true' : undefined}
        style=${{ width: 30, height: 30, flex: 'none', textAlign: 'center', border: `2px solid ${INK}`, borderRadius: 9, fontSize: 13, fontWeight: 800, background: k === i ? MENTA : flags[k] ? GIALLO : ans[k] != null ? INK : '#fff', color: k !== i && !flags[k] && ans[k] != null ? '#fff' : INK }}>${k + 1}</button>`)}</div>
    <p class="o-s" style="margin-top:8px;font-size:12px">Nero: risposta data. Giallo: segnata per dopo.</p></div>`;
  const foot = html`<div class="o-rowf" style="gap:12px">
    <${IBtn} lg=${true} icon=${Ico(Flag, 22, 2.4)} onClick=${() => setFlags(f => Object.assign({}, f, { [i]: !f[i] }))} label=${flags[i] ? 'Togli il segno' : 'Segna per dopo'} style=${flags[i] ? { background: GIALLO } : null}/>
    <${IBtn} lg=${true} icon=${Ico(Calculator, 24, 2.2)} onClick=${nav.openCalc} label="Calcolatrice"/>
    <div class="o-grow">${cs && tab === 'case' ? html`<${Btn} cls="lg" bg=${MENTA} onClick=${() => setTab('ask')}>Vai alla domanda<//>`
      : i < n - 1 ? html`<${Btn} cls="lg" bg=${MENTA} onClick=${() => go(i + 1)}>Avanti<//>` : html`<${Btn} cls="lg" bg=${MENTA} onClick=${() => (answered < n ? setQuit('send') : submit())}>Consegna<//>`}</div></div>`;
  return html`<${Flow} scrollRef=${scrollRef} top=${top} foot=${foot}
    over=${quit && html`<${BSheet} onClose=${() => setQuit(false)} label="Conferma">
      <h2 class="o-big">${quit === 'send' ? `Mancano ${plural(n - answered, 'risposta', 'risposte')}` : 'Vuoi uscire dal test?'}</h2>
      <p class="o-body o-mut" style="margin-top:6px">${quit === 'send' ? 'Le domande senza risposta contano come sbagliate.' : 'Se esci adesso il test non viene salvato.'}</p>
      <div class="o-col" style="gap:10px;margin-top:16px"><${Btn} cls="lg" bg=${MENTA} onClick=${() => setQuit(false)}>${quit === 'send' ? 'Torno alle domande' : 'Continuo il test'}<//>
        <${Btn} cls="lg flat" bg="#fff" onClick=${quit === 'send' ? submit : nav.back}>${quit === 'send' ? 'Consegna lo stesso' : 'Esci'}<//></div><//>`}>
    <div class="o-test"><${QuestionBody} key=${i} q=${q} label=${cs ? `Domanda ${i + 1}` : null} sel=${ans[i] == null ? null : ans[i]} onSel=${k => setAns(a => Object.assign({}, a, { [i]: k }))} locked=${false} tab=${tab} setTab=${setTab} pose="pensa"/></div>
  <//>`;
}

function TestDone({ nav, test, res, result }) {
  const r = result, t = test, pct = Math.round(r.ok / r.n * 100), wrong = t.qs.map((q, k) => k).filter(k => !(res[k] && res[k].ok));
  const byLesson = t.kind === 'unit';
  return html`<${Room} color=${MENTA} tabs=${false} headH=${150}
    rally=${html`<${Rally} pose=${r.passed ? 'festa-grad' : 'triste'} w=${r.passed ? 210 : 196} alt="" style=${{ position: 'absolute', right: -8, top: `calc(var(--otop) + ${r.passed ? -9 : 5}px)` }}/>`}
    head=${html`<div class="o-col" style="align-items:flex-start;gap:14px;padding-top:6px;max-width:205px"><h1 class="o-h1m">${t.kind === 'level' ? 'Test finito' : r.passed ? 'Verifica superata' : 'Non ancora superata'}</h1>
      ${r.passed && t.kind === 'unit' ? html`<${Pill} bg=${GIALLO}>Figurine dorate<//>` : html`<${Pill}>${r.passed ? `+50 XP` : 'Si riprova quando vuoi'}<//>`}</div>`}>
    <div class="o-pad" style="position:relative;z-index:1"><div class="o-card o-col" style="gap:16px">
      <div class="o-rowf" style="gap:16px"><span style="position:relative;width:84px;height:84px;flex:none;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800">
          <svg width="84" height="84" viewBox="0 0 84 84" aria-hidden="true" style="position:absolute;left:0;top:0"><circle cx="42" cy="42" r="38" fill="#fff" stroke=${INK} stroke-width="2.5"/><circle cx="42" cy="42" r="30" fill="none" stroke=${T_MENTA} stroke-width="9"/>
            ${pct > 0 && html`<circle cx="42" cy="42" r="30" fill="none" stroke=${r.passed ? MENTA : ROSA} stroke-width="9" stroke-dasharray=${`${(188.5 * pct / 100).toFixed(1)} 188.5`} transform="rotate(-90 42 42)"/>`}<circle cx="42" cy="42" r="24.5" fill="none" stroke=${INK} stroke-width="2"/></svg>
          <span style="position:relative">${pct}%</span></span>
        <div class="o-grow o-col" style="gap:2px"><span class="o-s" style="overflow-wrap:anywhere">${t.section ? t.section.name : t.course.name}</span><span style="font-size:28px;line-height:32px;font-weight:800;letter-spacing:-.02em">${r.ok} su ${r.n}</span>
          <span class="o-s">${r.passed ? `Ne bastavano ${t.pass}.` : `Ne servono ${t.pass}.`} Tempo: ${fmtSpan(r.secs)}.</span></div></div>
      ${wrong.length > 0 && html`<${Btn} bg="#fff" onClick=${() => nav.go('testRev', { test: t, res, wrong })}>${wrong.length === 1 ? 'Rivedi l\'errore' : `Rivedi i ${wrong.length} errori`}<//>`}
    </div></div>
    <div style="height:24px;flex:none"></div>
    <${Sheet} pad=${false}>
      <h2 class="o-h2" style="margin-bottom:10px">${byLesson ? 'Domanda per domanda' : 'Per argomento'}</h2>
      ${byLesson ? t.qs.map((q, k) => html`<div key=${k} class="o-rowf" style=${{ gap: 12, minHeight: 44, padding: '6px 0', borderBottom: k < t.qs.length - 1 ? `2px solid ${SEP}` : 0 }}>
            <span style=${{ width: 26, height: 26, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: `2px solid ${INK}`, background: res[k] && res[k].ok ? MENTA : ROSA }}>${res[k] && res[k].ok ? PathIco(D_CHECK, 14, 3.4) : PathIco(D_X, 13, 3.4)}</span>
            <span class="o-grow o-t" style="font-size:15px;overflow-wrap:anywhere">${q.lesson.title}</span></div>`)
        : r.per.map((p, k) => html`<div key=${k} class="o-col" style="gap:6px;margin-bottom:16px"><div class="o-rowf" style="justify-content:space-between;gap:12px"><span class="o-t" style="font-size:15px;overflow-wrap:anywhere">${p.name}</span><span style="flex:none;font-size:15px;font-weight:800">${p.ok} su ${p.n}</span></div>
            <${Bar} pct=${p.ok / p.n * 100} bg=${p.ok / p.n >= 0.7 ? MENTA : p.ok / p.n >= 0.5 ? GIALLO : ROSA} h=${12}/></div>`)}
      <button type="button" class="o-rowf" onClick=${() => nav.go('deboli')} style="gap:12px;width:100%;padding:12px 16px;margin-top:14px;background:${T_GIALLO};border-radius:16px">
        <span class="o-grow o-col" style="gap:1px"><span class="o-t">Allenati sui punti deboli</span><span class="o-s" style="color:${INK}">Rally parte dagli argomenti dove sbagli di più</span></span>${!K.isPro && html`<span class="o-tag">Pro</span>`}${PathIco(D_NEXT, 22, 2.6)}</button>
      <div style="padding:20px 0 max(26px,calc(env(safe-area-inset-bottom) + 10px))"><${Btn} cls="lg" bg=${MENTA} onClick=${nav.back}>Continua<//></div>
    <//>
  <//>`;
}

function TestReview({ nav, test, res, wrong }) {
  const [k, setK] = useState(0);
  const scrollRef = useRef(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [k]);
  const qi = wrong[k], q = test.qs[qi], r = res[qi];
  const keys = () => { if (!K.isPro) return nav.go('pro', { why: 'tasti' }); nav.askAI(q, r ? L3[r.sel] : null, 'Mostrami i tasti da premere sulla BA II Plus per risolvere questa domanda, un passo per riga.'); };
  return html`<${Flow} scrollRef=${scrollRef}
    top=${html`<${TopBar} onBack=${nav.back} mid=${html`<span class="o-grow" style="text-align:center;font-size:15px;font-weight:800">Errore ${k + 1} di ${wrong.length}</span>`} right=${html`<span class="o-chip" style="height:32px;font-size:13px">Domanda ${qi + 1}</span>`}/>`}
    foot=${html`<${Btn} cls="lg" bg=${MENTA} onClick=${() => (k < wrong.length - 1 ? setK(k + 1) : nav.back())}>${k < wrong.length - 1 ? 'Prossimo errore' : 'Fine'}<//>`}>
    <div class="o-pad" style="padding-top:18px;padding-bottom:20px">
      <${Rich} text=${q.q} cls="q" lang=${q.lang}/>
      <div style="margin-top:14px"><${Options} q=${q} sel=${r ? r.sel : null} onSel=${() => {}} locked=${true}/></div>
      ${!r && html`<p class="o-s" style="margin-top:8px">Non avevi risposto a questa domanda.</p>`}
      ${q.exp && html`<div style="margin-top:18px;padding:16px;background:${T_BG};border-radius:20px"><div style="font-size:18px;line-height:24px;font-weight:800;margin-bottom:6px">Perché</div><${Rich} text=${q.exp} cls="sm"/></div>`}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:18px">
        <button type="button" class="o-btn sm flat" style="background:#fff;font-size:15px;padding:6px 8px" onClick=${keys}>Mostrami i tasti${!K.isPro && html`<span class="o-tag">Pro</span>`}</button>
        <button type="button" class="o-btn sm flat" style="background:#fff;font-size:15px" onClick=${() => nav.askAI(q, r ? L3[r.sel] : null)}>Chiedi a Rally</button></div>
      <${ReportLink} q=${q}/>
    </div>
  <//>`;
}
function ReportLink({ q }) {
  const [f, setF] = useState(false);
  return html`<div style="text-align:center;margin-top:6px">${f ? html`<span class="o-link" style="text-decoration:none">Segnalata, grazie</span>`
    : html`<button type="button" class="o-link" onClick=${() => { s2set(s => ({ flags: Object.assign({}, s.flags, { [q.key]: Date.now() }) })); setF(true); }}>Segnala un errore in questa domanda</button>`}</div>`;
}

// ---- allenamento con risposta subito: ravviva le figurine, quiz misto, punti deboli ----
function buildPractice(mode, sectionId) {
  const sh = K.flShuffle, all = courses().flatMap(c => c.lessons);
  if (mode === 'ravviva') return dueLessons().slice(0, 12).map(l => { const qs = lessonQuestions(l); return qs.length ? { q: qs[0], l } : { l, recap: true }; });
  if (mode === 'weak') { const sec = all.map(l => l.section).find(s => s.id === sectionId); const st = K.qStatsLoad(); const qs = allQuestions(sec ? sec.lessons : []);
    return sh(qs).sort((a, b) => ((st[a.key] && st[a.key].last === 0) ? 0 : 1) - ((st[b.key] && st[b.key].last === 0) ? 0 : 1)).slice(0, 8).map(q => ({ q, l: q.lesson })); }
  const started = startedCourses(); const pool = (started.length ? started : misCourses()).flatMap(misLessons);   // solo le lezioni del proprio percorso
  const done = pool.filter(l => isHad(l.key)); const src = allQuestions(done).length >= 5 ? done : pool;
  return sh(allQuestions(src)).slice(0, 10).map(q => ({ q, l: q.lesson }));
}
function PracticeRun({ nav, mode, section }) {
  const items = useMemo(() => buildPractice(mode, section), [mode, section]);
  const [i, setI] = useState(0), [sel, setSel] = useState(null), [fb, setFb] = useState(null), [okN, setOkN] = useState(0), [left, setLeft] = useState(null), [tab, setTab] = useState('case'), [end, setEnd] = useState(false);
  const scrollRef = useRef(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; setSel(null); setFb(null); setTab('case'); }, [i]);
  const titles = { ravviva: 'Figurine ravvivate', mix: 'Quiz finito', weak: 'Allenamento finito' };
  if (!items.length || end) {
    const qn = items.filter(x => x.q).length;
    return html`<${Flow} bg=${MENTA} top=${html`<${TopBar} onClose=${nav.back} title=""/>`} foot=${html`<${Btn} cls="lg" bg="#fff" onClick=${nav.back}>Continua<//>`}>
      <div class="o-col o-pad" style="align-items:center;text-align:center;padding-top:6px"><${Rally} pose=${items.length ? 'festeggia' : 'pensa'} w=${250} alt=""/>
        <h1 class="o-pop" style="font-size:40px;line-height:44px;font-weight:800;letter-spacing:-.02em;margin-top:-6px">${items.length ? titles[mode] : 'Niente da ripassare'}</h1>
        <p class="o-body" style="margin-top:8px;max-width:300px">${!items.length ? 'Qui non ci sono domande per ora. Finisci qualche lezione e torna.' : mode === 'ravviva' ? `${plural(items.length, 'figurina è tornata', 'figurine sono tornate')} a colori.` : 'Ogni risposta aggiorna i tuoi punti deboli.'}</p>
        ${items.length > 0 && html`<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;width:100%;margin-top:24px">
          <div class="o-col" style="padding:10px 14px;background:${GIALLO};border:2.5px solid ${INK};border-radius:18px;text-align:left"><span style="font-size:13px;font-weight:700">Punti</span><span style="font-size:22px;line-height:26px;font-weight:800">+${okN * 5} XP</span></div>
          <div class="o-col" style="padding:10px 14px;background:#fff;border:2.5px solid ${INK};border-radius:18px;text-align:left"><span class="o-s">Risposte giuste</span><span style="font-size:22px;line-height:26px;font-weight:800">${okN} su ${qn}</span></div></div>`}
      </div><//>`;
  }
  const it = items[i], q = it.q, cs = q ? splitCase(q) : null, locked = !!fb;
  const next = () => { if (i < items.length - 1) setI(i + 1); else setEnd(true); };
  const after = ok => { if (K.albumLoad()[it.l.key]) K.albumReview(it.l.key, ok); };
  const check = () => {
    const ok = sel === q.ans; recordAnswer(q, ok); after(ok);
    if (ok) { setOkN(n => n + 1); addXp(5); return setFb('ok'); }
    const e = explState();
    if (e.pro) { setLeft(null); setFb('ko'); } else if (e.left > 0) { spendExplanation(); setLeft(e.left - 1); setFb('ko'); } else setFb('limit');
  };
  let body, foot;
  if (it.recap) {
    const kp = (it.l.los && it.l.los.keyPoints) || [];
    body = html`<div class="o-pad" style="padding-top:18px;padding-bottom:20px"><div class="o-lab" style="margin-bottom:4px">Ripasso veloce</div><h1 style="font-size:28px;line-height:32px;font-weight:800;letter-spacing:-.02em;overflow-wrap:anywhere">${it.l.title}</h1>
      <div class="o-card s o-col" style="padding:8px 18px;margin-top:16px">${(kp.length ? kp : [it.l.note || 'Riapri la lezione per ripassarla.']).map((t, k, a) => html`<div key=${k} class="o-rowf" style=${{ gap: 12, padding: '12px 0', alignItems: 'flex-start', borderBottom: k < a.length - 1 ? `2px solid ${SEP}` : 0 }}>
        <span style="width:24px;height:24px;flex:none;display:flex;align-items:center;justify-content:center;background:${INK};border-radius:50%;color:#fff;margin-top:1px">${PathIco(D_CHECK, 14, 3.4)}</span><${Rich} text=${t} cls="sm" style=${{ fontWeight: 700 }}/></div>`)}</div>
      <div style="text-align:center;margin-top:8px"><button type="button" class="o-link" onClick=${() => nav.go('lezione', { key: it.l.key })}>Riapri la lezione</button></div></div>`;
    foot = html`<${Btn} cls="lg" bg=${MENTA} onClick=${() => { after(true); next(); }}>Ripassata<//>`;
  } else {
    body = html`<${QuestionBody} key=${i} q=${q} label=${`Domanda ${i + 1} di ${items.length}`} sel=${sel} onSel=${setSel} locked=${locked} tab=${tab} setTab=${setTab}/>`;
    foot = html`<div class="o-rowf" style="gap:12px"><${IBtn} lg=${true} icon=${Ico(Calculator, 24, 2.2)} onClick=${nav.openCalc} label="Calcolatrice"/><div class="o-grow">${cs && tab === 'case'
      ? html`<${Btn} cls="lg" bg=${MENTA} onClick=${() => setTab('ask')}>Vai alla domanda<//>` : html`<${Btn} cls="lg" bg=${MENTA} disabled=${sel == null || locked} onClick=${check}>Controlla<//>`}</div></div>`;
  }
  const over = fb === 'ok' ? html`<${FeedbackSheet} ok=${true} q=${q} xp=${5} onNext=${next}/>` : fb === 'ko' ? html`<${FeedbackSheet} ok=${false} q=${q} left=${left} onNext=${next}/>`
    : fb === 'limit' ? html`<${LimitSheet} onPro=${() => { startPro(); setLeft(null); setFb('ko'); }} onSkip=${next}/>` : null;
  return html`<${Flow} scrollRef=${scrollRef} top=${html`<${TopBar} onClose=${nav.back} n=${items.length} i=${i}/>`} foot=${foot} over=${over}><div class="o-test">${body}</div><//>`;
}

function WeakScreen({ nav }) {
  useS2();
  const c = currentCourse();
  const sc = topicScores(c), weak = sc[0], pro = !!K.isPro;
  const col = s => s >= 80 ? MENTA : s >= 55 ? GIALLO : ROSA;
  const train = () => { if (!pro) return nav.go('pro', { why: 'deboli' }); nav.go('pratica', { mode: 'weak', section: weak.id }); };
  return html`<${Room} color=${MENTA} tabs=${false} headH=${168}
    rally=${html`<${Rally} pose="allena2" alt="" style="position:absolute;right:-10px;top:calc(var(--otop) + 9px)"/>`}
    head=${html`<div class="o-rowf" style="height:44px"><${IBtn} d=${D_BACK} onClick=${nav.back} label="Indietro"/></div>
      <div class="o-col" style="align-items:flex-start;gap:14px;margin-top:22px;max-width:210px"><h1 class="o-h1m">Punti deboli</h1><${Pill} bg=${pro ? '#fff' : GIALLO}>${pro ? 'Dalle tue risposte' : 'Solo con Pro'}<//></div>`}>
    <div class="o-pad" style="position:relative;z-index:1"><div class="o-card o-col" style="gap:14px">
      ${weak ? html`<div class="o-col" style="gap:3px"><span class="o-s">Il più debole adesso</span>
          <div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px"><span style="font-size:24px;line-height:28px;font-weight:800;letter-spacing:-.01em;overflow-wrap:anywhere">${weak.name}</span><span style="flex:none;font-size:15px;font-weight:800">${weak.score} su 100</span></div></div>
        <${Bar} pct=${weak.score} bg=${col(weak.score)} label=${`${weak.score} su 100`}/>
        <p class="o-body o-mut">Hai sbagliato ${weak.n - weak.nok} ${weak.n - weak.nok === 1 ? 'risposta' : 'risposte'} su ${weak.n} in ${weak.unit.name}.</p>
        <${Btn} bg=${MENTA} onClick=${train}>Allenati ${plural(Math.max(4, Math.round(Math.min(8, allQuestions(weak.section.lessons).length) * c.pace / 60)), 'minuto', 'minuti')}<//>`
      : html`<div class="o-col" style="gap:4px"><div style="font-size:22px;line-height:26px;font-weight:800">Ancora niente da misurare</div><div class="o-body o-mut">Rispondi a qualche domanda: Rally guarda dove sbagli e ti dice da dove ripartire.</div></div>
        <${Btn} bg=${MENTA} onClick=${() => nav.go('pratica', { mode: 'mix' })}>Fai un quiz misto<//>`}
    </div></div>
    <div style="height:24px;flex:none"></div>
    <${Sheet} pad=${false}>
      <h2 class="o-h2" style="margin-bottom:12px">Tutti gli argomenti</h2>
      ${sc.length === 0 && html`<p class="o-body o-mut">Compaiono qui dopo le prime risposte.</p>`}
      ${sc.map(x => html`<button key=${x.id} type="button" class="o-col" style="gap:6px;margin-bottom:16px;width:100%" onClick=${() => (pro ? nav.go('pratica', { mode: 'weak', section: x.id }) : nav.go('pro', { why: 'deboli' }))}>
        <span class="o-rowf" style="justify-content:space-between;gap:12px;width:100%"><span class="o-t" style="font-size:15px;overflow-wrap:anywhere">${x.name}</span><span style="flex:none;font-size:15px;font-weight:800">${x.score}</span></span>
        <span style="display:block;width:100%"><${Bar} pct=${x.score} bg=${col(x.score)}/></span></button>`)}
      <p class="o-s" style="padding:4px 0 max(30px,calc(env(safe-area-inset-bottom) + 14px))">Le risposte recenti pesano di più. Se non ripassi un argomento, il punteggio torna verso 50.</p>
    <//>
  <//>`;
}
