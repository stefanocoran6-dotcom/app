
// =====================================================================================================
// IMPARA: home, dentro un percorso, lezione, domande
// =====================================================================================================
const firstName = n => String(n || '').trim().split(/\s+/)[0] || '';
function userName() { const s = s2get(); if (s.name) return s.name; const d = K.user && K.user.displayName; return d && d !== 'Google User' && d !== 'Apple User' ? firstName(d) : ''; }

function ExamDateSheet({ onClose }) {
  const cur = LS.raw('finlearn_exam_date') || '';
  const [v, setV] = useState(cur);
  const save = () => { try { if (v) localStorage.setItem('finlearn_exam_date', v); else localStorage.removeItem('finlearn_exam_date'); } catch (e) {} onClose(); };
  return html`<${BSheet} onClose=${onClose} label="Data dell'esame">
    <h2 class="o-big">Quando hai l'esame?</h2>
    <p class="o-body o-mut" style="margin-top:6px">Rally conta i giorni che mancano e te li ricorda nella home.</p>
    <input class="o-inp" type="date" value=${v} onChange=${e => setV(e.target.value)} aria-label="Data dell'esame" style="margin-top:16px"/>
    <div style="margin-top:16px"><${Btn} cls="lg" onClick=${save}>Salva la data<//></div>
    ${cur && html`<div style="text-align:center;margin-top:4px"><button type="button" class="o-link" onClick=${() => { try { localStorage.removeItem('finlearn_exam_date'); } catch (e) {} onClose(); }}>Togli la data</button></div>`}
  <//>`;
}

const unitInitials = name => String(name).split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
// Home: il percorso dell'obiettivo scelto, la prossima lezione e le unità in fila (quelle che si sanno già, quella in corso, quelle in arrivo)
function HomeScreen({ nav }) {
  useS2(); useTick();
  const [dateOpen, setDateOpen] = useState(false), [addOpen, setAddOpen] = useState(false);
  const cur = currentCourse();
  const name = userName(), streak = streakDays(), xp = (K.stats && K.stats.xp) || 0;
  const next = nextLesson(cur), pct = coursePct(cur), ed = examDays(), begun = doneCount(misLessons(cur)) > 0;
  const isExam = cur.group === 'cert', title = misName(cur);
  const pill = isExam ? (ed != null && ed >= 0 ? (ed === 0 ? 'Esame oggi' : `Esame tra ${plural(ed, 'giorno', 'giorni')}`) : 'Metti la data dell\'esame') : (streak > 1 ? `${streak} giorni di fila` : 'Giorno ' + Math.max(1, streak));
  const others = misCourses().filter(c => c !== cur), stops = misStops(cur), known = misGet().known || [];
  const rest = isExam ? [] : misRest(cur), restN = rest.reduce((n, u) => n + unitLessons(u).length, 0);
  const open = u => nav.go('percorso', { course: cur.id, unit: u.id });
  return html`<${Room} color=${AZ} tab="home" go=${nav.tab}
    rally=${html`<${Rally} pose="saluta" alt="Rally saluta" style="position:absolute;right:-10px;top:calc(var(--otop) + 4px)"/>`}
    head=${html`<div style="position:absolute;right:20px;top:0"><${StatPill} streak=${streak} xp=${xp}/></div>
      <div class="o-col" style="align-items:flex-start;gap:14px;padding-top:4px;max-width:210px">
        <h1 class="o-h1" style=${name.length > 9 ? { fontSize: 32, lineHeight: '34px' } : null}>Ciao${name ? html`,<br/>${name}` : '!'}</h1>
        ${isExam ? html`<button type="button" onClick=${() => setDateOpen(true)}><${Pill}>${pill}<//></button>` : html`<${Pill}>${pill}<//>`}
      </div>`}>
    <div class="o-pad" style="position:relative;z-index:1"><div class="o-card o-col" style="gap:16px">
      <button type="button" class="o-col" style="gap:10px;width:100%" onClick=${() => nav.go('percorso', { course: cur.id, unit: next ? next.unit.id : null })} aria-label=${`Apri ${title}`}>
        <span class="o-rowf" style="gap:10px;width:100%"><span class="o-ibox" style="width:36px;height:36px;border-radius:11px;font-size:14px;background:${misP().course === cur.id ? misP().color : AZ}">${misIcon(cur, 18)}</span>
          <span class="o-grow" style="font-size:16px;line-height:20px;font-weight:800;text-align:left">${title}</span><span style="font-size:14px;line-height:20px;font-weight:800">${pct}%</span></span>
        <span style="display:block;width:100%"><${Bar} pct=${pct} label=${`Percorso completato al ${pct}%`}/></span>
      </button>
      ${next ? html`<div class="o-col" style="gap:4px"><div class="o-big" style=${Object.assign({ overflowWrap: 'anywhere', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3, overflow: 'hidden' }, next.title.length > 44 ? { fontSize: 22, lineHeight: '27px', letterSpacing: '-.01em' } : null)}>${next.title}</div>
          <div class="o-body o-mut">${begun ? 'Prossima lezione' : 'Prima lezione'} di ${next.unit.name}, ${next.minutes} minuti</div></div>
        <${Btn} onClick=${() => nav.go('lezione', { key: next.key })}>${begun ? 'Riprendi la lezione' : 'Inizia la lezione'}<//>`
      : html`<div class="o-col" style="gap:4px"><div class="o-big">Percorso completato</div><div class="o-body o-mut">Hai finito le lezioni pronte. Tieni vive le figurine con il ripasso.</div></div>
        <${Btn} onClick=${() => nav.tab('allenati')}>Vai al ripasso<//>`}
    </div></div>
    <${NewsTicker} nav=${nav}/>
    <${Sheet}>
      <h2 class="o-h2" style="margin-bottom:4px">${isExam ? `Gli argomenti di ${title}` : 'Il tuo percorso, unità per unità'}</h2>
      ${stops.map(s => {
        if (s.soon) return html`<div key=${s.soon.id} class="o-row"><span class="o-ibox" style="font-size:15px;background:${T_BG};border-style:dashed;color:${MUT}">${unitInitials(s.soon.name)}</span>
          <span class="o-grow o-col" style="gap:1px"><span class="o-t" style="color:${MUT}">${s.soon.name}</span><span class="o-s">In arrivo</span></span></div>`;
        const u = s.u, ls = unitLessons(u), d = hadCount(ls), kn = known.includes(u.id) && doneCount(ls) < ls.length, here = next && next.unit === u;
        if (here) return html`<button key=${u.id} type="button" class="o-rowf" onClick=${() => open(u)} style="gap:14px;width:calc(100% + 20px);min-height:62px;margin:4px -10px;padding:0 10px;background:${T_AZ};border:2.5px solid ${INK};border-radius:16px;text-align:left">
          <span class="o-ibox" style="font-size:15px">${unitInitials(u.name)}</span><span class="o-grow o-col" style="gap:1px"><span class="o-t" style="font-weight:800">${u.name}</span><span class="o-s" style="color:${INK}">Sei qui: ${d} di ${plural(ls.length, 'lezione', 'lezioni')}</span></span>${PathIco(D_NEXT, 22, 2.6)}</button>`;
        return html`<${Row} key=${u.id} icon=${html`<span style="font-size:15px">${unitInitials(u.name)}</span>`} title=${u.name}
          sub=${kn ? `La sai già: ${plural(ls.length, 'lezione', 'lezioni')}` : `${d} di ${plural(ls.length, 'lezione', 'lezioni')}`}
          right=${kn ? html`<span style="width:36px;height:36px;flex:none;display:flex;align-items:center;justify-content:center;background:${MENTA};border:2px solid ${INK};border-radius:50%" role="img" aria-label="La sai già">${PathIco(D_CHECK, 18, 3)}</span>` : html`<${Ring} pct=${ls.length ? d / ls.length * 100 : 0}/>`} onClick=${() => open(u)}/>`; })}
      ${rest.length > 0 && html`<${Row} icon=${PathIco(D_PLUS, 20, 2.6)} title="Aggiungi altre unità" sub=${`${rest.length === 1 ? 'Un\'altra unità' : 'Altre ' + rest.length + ' unità'} delle Basi, ${plural(restN, 'lezione', 'lezioni')}`} chev=${true} onClick=${() => setAddOpen(true)}/>`}
      ${others.length > 0 && html`<h2 class="o-h2" style="margin:22px 0 4px">Gli altri tuoi percorsi</h2>`}
      ${others.map(c => { const ls = misLessons(c); return html`<${Row} key=${c.id} icon=${c.badge} title=${c.name} sub=${`${hadCount(ls)} di ${plural(ls.length, 'lezione', 'lezioni')}`} right=${html`<${Ring} pct=${coursePct(c)}/>`} onClick=${() => { s2set({ cur: c.id }); }}/>`; })}
      <${NewsHomeRow} nav=${nav}/>
      <${Row} icon=${Ico(LayoutGrid, 22)} ibg=${AZ} title="Scopri tutti i percorsi" sub="Da aggiungere e in arrivo" chev=${true} last=${true} onClick=${() => nav.go('catalogo')}/>
    <//>
    ${dateOpen && html`<${ExamDateSheet} onClose=${() => setDateOpen(false)}/>`}
    ${addOpen && html`<${BSheet} onClose=${() => setAddOpen(false)} label="Aggiungi altre unità">
      <h2 class="o-big" style="flex:none">Aggiungi altre unità</h2><p class="o-body o-mut" style="margin:6px 0 8px;flex:none">Sono le altre unità delle Basi della finanza. Quelle che aggiungi vanno in fondo al tuo percorso.</p>
      <div class="o-scroll" style="flex:0 1 auto;max-height:56vh">${rest.map((u, k) => html`<div key=${u.id} class=${'o-row' + (k === rest.length - 1 ? ' last' : '')}><span class="o-ibox" style="font-size:15px">${unitInitials(u.name)}</span>
        <span class="o-grow o-col" style="gap:1px"><span class="o-t">${u.name}</span><span class="o-s">${MIS_SUB[u.id] || plural(unitLessons(u).length, 'lezione', 'lezioni')}</span></span>
        <button type="button" class="o-chip" onClick=${() => { misAddUnits([u.id]); if (rest.length === 1) setAddOpen(false); }} aria-label=${`Aggiungi ${u.name}`}>Aggiungi</button></div>`)}</div>
      ${rest.length > 1 && html`<div style="margin-top:12px;flex:none"><${Btn} cls="lg" onClick=${() => { misAddUnits(rest.map(u => u.id)); setAddOpen(false); }}>Aggiungile tutte<//></div>`}<//>`}
  <//>`;
}

// ---- dentro un percorso: le sezioni dell'unità e le lezioni in fila ----
function PercorsoScreen({ nav, course, unit }) {
  useS2(); useTick();
  const c = courseById(course) || currentCourse();
  const nx = nextLesson(c, unit);
  const [uid, setUid] = useState(unit || (nx ? nx.unit.id : misUnits(c)[0].id));
  const [pick, setPick] = useState(false);
  // le unità del percorso; se se ne apre una che il percorso non usa, compare in fondo
  const u = c.units.find(x => x.id === uid) || misUnits(c)[0], units = misUnits(c).includes(u) ? misUnits(c) : [...misUnits(c), u], ui = units.indexOf(u);
  const album = K.albumLoad(), now = Date.now(), tests = s2get().tests;
  const curL = unitLessons(u).find(l => !isDone(l.key));
  const curRef = useRef(null), scrollRef = useRef(null);
  useEffect(() => { const t = setTimeout(() => { const el = curRef.current, sc = scrollRef.current; if (el && sc) sc.scrollTop = Math.max(0, el.offsetTop - sc.clientHeight / 2 + 60); }, 40); return () => clearTimeout(t); }, [uid]);
  const line = solid => html`<span aria-hidden="true" style=${solid ? { position: 'absolute', left: 22, top: 44, bottom: -12, width: 4, background: INK } : { position: 'absolute', left: 22, top: 46, bottom: -10, width: 0, borderLeft: `4px dotted ${INK}` }}></span>`;
  const subOf = l => { const st = stickerState(l, album, now); return st === 'sbiadisce' ? 'Sta sbiadendo, ripassala' : st === 'dorata' ? 'Figurina dorata' : 'Figurina presa'; };
  return html`<${Room} color=${c.color || AZ} tab="home" go=${nav.tab} headH=${156} scrollRef=${scrollRef}
    rally=${html`<${Rally} pose="indica" w=${206} alt="Rally indica la prossima lezione" style="position:absolute;right:-20px;top:calc(var(--otop) + 6px)"/>`}
    head=${html`<div class="o-rowf" style="height:44px;gap:12px"><${IBtn} d=${D_BACK} onClick=${nav.back} label="Torna a Impara"/><span style="font-size:15px;line-height:20px;font-weight:800">${misName(c)}</span></div>
      <div class="o-col" style="align-items:flex-start;gap:12px;margin-top:12px;max-width:225px">
        <h1 class="o-h1m" style=${u.name.length > 14 ? { fontSize: 26, lineHeight: '28px' } : null}>${u.name}</h1>
        <button type="button" onClick=${() => setPick(true)} aria-label="Cambia argomento"><${Pill}>Unità ${ui + 1} di ${units.length}<//></button>
      </div>`}>
    <${Sheet} style=${{ paddingTop: 22 }}>
      ${u.sections.map((sec, si) => { const d = doneCount(sec.lessons), qn = allQuestions(sec.lessons).length, tid = 'unit:' + sec.id, tr = tests[tid];
        return html`<section key=${sec.id} style=${{ marginBottom: 28 }}>
          <div class="o-col" style="gap:2px;margin-bottom:10px">${sec.num && html`<span class="o-s">Reading ${sec.num}</span>`}
            <div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px"><h2 class="o-h2">${sec.name}</h2><span class="o-lab" style="flex:none">${d} su ${sec.lessons.length} fatte</span></div></div>
          <div class="o-col">
            ${sec.lessons.map((l, k) => { const done = isDone(l.key), isCur = l === curL, last = k === sec.lessons.length - 1 && qn < 3;
              if (isCur) return html`<div key=${l.key} ref=${curRef} style="position:relative;display:flex;align-items:flex-start;gap:14px;padding:8px 0">${!last && line(false)}
                <span style="width:48px;flex:none;display:flex;justify-content:center;padding-top:14px;position:relative"><span style="width:48px;height:48px;display:flex;align-items:center;justify-content:center;background:${AZ};border:2.5px solid ${INK};border-radius:50%;box-shadow:0 0 0 5px #fff">${PathIco('M8 5l11 7-11 7z', 20, 2, INK, INK)}</span></span>
                <div class="o-grow o-col" style="gap:12px;padding:14px 16px 16px;background:#fff;border:2.5px solid ${INK};border-radius:22px;box-shadow:4px 4px 0 ${INK}">
                  <div class="o-col" style="gap:2px"><span style="font-size:20px;line-height:24px;font-weight:800;letter-spacing:-.01em;overflow-wrap:anywhere;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:4;overflow:hidden">${l.title}</span><span class="o-lab" style="font-weight:600">Lezione ${k + 1}, ${l.minutes} minuti</span></div>
                  <${Btn} cls="sm" onClick=${() => nav.go('lezione', { key: l.key })}>Inizia<//></div></div>`;
              return html`<button key=${l.key} type="button" onClick=${() => nav.go('lezione', { key: l.key })} style="position:relative;min-height:56px;display:flex;align-items:center;gap:14px;padding:6px 0;width:100%">${!last && line(done)}
                <span style="width:48px;flex:none;display:flex;justify-content:center;position:relative">${done
                  ? html`<span style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:${INK};border:2px solid ${INK};border-radius:50%;color:#fff">${PathIco(D_CHECK, 20, 3)}</span>`
                  : html`<span style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:#fff;border:2px solid ${INK};border-radius:50%;font-size:15px;font-weight:800">${k + 1}</span>`}</span>
                <span class="o-grow o-col" style="gap:1px"><span class="o-t" style="overflow-wrap:anywhere">${l.title}</span><span class="o-s">${done ? subOf(l) : l.minutes + ' minuti'}</span></span></button>`; })}
            ${qn >= 3 && html`<button type="button" onClick=${() => nav.go('testInizio', { kind: 'unit', course: c.id, section: sec.id })} style="position:relative;min-height:56px;display:flex;align-items:center;gap:14px;padding:6px 0;width:100%">
              <span style="width:48px;flex:none;display:flex;justify-content:center"><span style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:${tr && tr.passedEver ? GIALLO : '#fff'};border:2px solid ${INK};border-radius:50%">${tr && tr.passedEver ? PathIco(D_STAR, 20, 2.2, INK, INK) : Ico(Flag, 18, 2.4)}</span></span>
              <span class="o-grow o-col" style="gap:1px"><span class="o-t">Verifica</span><span class="o-s">${tr && tr.passedEver ? `Superata con ${tr.best} su ${tr.n}: figurine dorate` : `${Math.min(10, qn)} domande, se passi le figurine diventano dorate`}</span></span></button>`}
          </div></section>`; })}
    <//>
    ${pick && html`<${BSheet} onClose=${() => setPick(false)} label="Argomenti">
      <h2 class="o-big" style="margin-bottom:6px">${misName(c)}</h2>
      ${units.map((x, k) => { const ls = unitLessons(x), d = doneCount(ls); return html`<${Row} key=${x.id} icon=${k + 1} ibg=${x === u ? AZ : null} title=${x.name} sub=${`${d} di ${ls.length} lezioni`} right=${html`<${Ring} pct=${ls.length ? d / ls.length * 100 : 0}/>`} last=${k === units.length - 1} onClick=${() => { setUid(x.id); setPick(false); }}/>`; })}
    <//>`}
  <//>`;
}

// ---- pezzi delle domande ----
const L3 = ['A', 'B', 'C', 'D'];
const splitCase = q => { const t = String(q.q || ''); const parts = t.split(/\n\s*\n/); return t.length > 260 && parts.length >= 2 ? { ctx: parts.slice(0, -1).join('\n\n'), ask: parts[parts.length - 1] } : null; };
const optState = (q, k, sel, locked) => !locked ? (sel === k ? 'sel' : '') : k === q.ans ? 'ok' : k === sel ? 'ko' : 'dim';
const optNote = (q, k, sel, locked) => !locked ? (sel === k ? 'La tua scelta' : null) : (k === sel ? (k === q.ans ? 'La tua scelta' : 'La tua risposta') : k === q.ans ? 'Quella giusta' : null);
function Options({ q, sel, onSel, locked }) {
  const rich = q.options.some(o => /\\\(|\*\*|\$\$/.test(o)), big = q.options.every(o => String(o).length <= 14);
  return html`<div class="o-col" style="gap:10px">${q.options.map((o, k) => html`<${Opt} key=${k} letter=${L3[k]} text=${o} rich=${rich} big=${big} lang=${q.lang} state=${optState(q, k, sel, locked)} note=${optNote(q, k, sel, locked)} disabled=${locked} onClick=${() => onSel(k)}/>`)}</div>`;
}
// corpo di una domanda: corta (titolo grande e Rally), media, oppure lunga con le due linguette "Il caso" e "Domanda"
function QuestionBody({ q, label, sel, onSel, locked, tab, setTab, pose = 'pensa' }) {
  const cs = splitCase(q);
  const [open, setOpen] = useState(false);
  if (cs) return html`<div class="o-pad" style="padding-top:12px;padding-bottom:20px">
    <div role="tablist" style="display:grid;grid-template-columns:1fr 1fr;gap:0;padding:3px;border:2.5px solid ${INK};border-radius:16px">
      ${[['case', 'Il caso'], ['ask', label || 'Domanda']].map(([id, t]) => html`<button key=${id} type="button" role="tab" aria-selected=${tab === id ? 'true' : 'false'} onClick=${() => setTab(id)}
        style=${{ height: 40, borderRadius: 11, textAlign: 'center', fontSize: 15, fontWeight: 800, background: tab === id ? INK : 'transparent', color: tab === id ? '#fff' : INK }}>${t}</button>`)}</div>
    ${tab === 'case' ? html`<div style="margin-top:18px"><${Rich} text=${cs.ctx} lang=${q.lang}/></div>`
      : html`<div style="margin-top:18px"><${Rich} text=${cs.ask} cls="q" lang=${q.lang}/>
        <button type="button" onClick=${() => setOpen(!open)} aria-expanded=${open ? 'true' : 'false'} class="o-rowf" style="gap:10px;width:100%;min-height:48px;margin-top:14px;padding:0 14px;border:2.5px solid ${INK};border-radius:14px;font-size:15px;font-weight:800">
          ${Ico(Table2, 20)}<span class="o-grow">I dati del caso</span><span style=${{ transform: open ? 'rotate(180deg)' : 'none', display: 'flex' }}>${Ico(ChevronDown, 22, 2.6)}</span></button>
        ${open && html`<div style="margin-top:10px;padding:12px 14px;background:${T_BG};border-radius:14px"><${Rich} text=${cs.ctx} cls="sm" lang=${q.lang}/></div>`}
        <div style="margin-top:14px"><${Options} q=${q} sel=${sel} onSel=${onSel} locked=${locked}/></div></div>`}
  </div>`;
  const short = q.q.length <= 90 && q.q.indexOf('\n') < 0 && !/\\\(|\$\$/.test(q.q);
  return html`<div class="o-pad" style="position:relative;padding-top:22px;padding-bottom:20px">
    ${short && html`<${Rally} pose=${pose} w=${196} alt="" style="position:absolute;right:-12px;top:-14px"/>`}
    <div class="o-col" style=${{ gap: 6, position: 'relative', minHeight: short ? 150 : 0, maxWidth: short ? 214 : 'none' }}>
      ${label && html`<span class="o-lab">${label}</span>`}
      ${short ? html`<h1 class="o-q" lang=${q.lang}>${q.q}</h1>` : html`<${Rich} text=${q.q} cls="q" lang=${q.lang}/>`}
    </div>
    <div style=${{ marginTop: short ? 18 : 16, position: 'relative' }}><${Options} q=${q} sel=${sel} onSel=${onSel} locked=${locked}/></div>
  </div>`;
}
// foglio dopo la risposta: verde "Giusto!", rosa "Non ancora"
function FeedbackSheet({ ok, q, xp, onNext, nav, left, next = 'Continua' }) {
  const [flagged, setFlagged] = useState(false);
  const flag = () => { s2set(s => ({ flags: Object.assign({}, s.flags, { [q.key]: Date.now() }) })); setFlagged(true); };
  return html`<${BSheet} dim=${false} bg=${ok ? MENTA : ROSA} label=${ok ? 'Risposta giusta' : 'Risposta sbagliata'}>
    <div class="o-rowf" style="justify-content:space-between;gap:12px"><h2 style="font-size:30px;line-height:36px;font-weight:800;letter-spacing:-.02em">${ok ? 'Giusto!' : 'Non ancora'}</h2>
      ${ok ? (xp ? html`<${Pill} bg=${GIALLO} rot=${4}>+${xp} XP<//>` : null) : (left != null ? html`<${Pill} rot=${3}>Spiegazione ${FREE_EXPL - left} di ${FREE_EXPL}<//>` : null)}</div>
    ${q.exp && html`<div class="o-scroll" style="flex:0 1 auto;max-height:34vh;margin-top:6px"><${Rich} text=${q.exp} cls="sm"/></div>`}
    <div style="margin-top:14px;flex:none"><${Btn} cls="lg" bg="#fff" onClick=${onNext}>${ok ? next : 'Ho capito'}<//></div>
    ${!ok && html`<div style="text-align:center;flex:none">${flagged ? html`<span class="o-link" style="text-decoration:none">Segnalata, grazie</span>` : html`<button type="button" class="o-link" onClick=${flag}>Segnala un errore in questa domanda</button>`}</div>`}
  <//>`;
}
// foglio quando le spiegazioni gratis del giorno sono finite
function LimitSheet({ onPro, onSkip }) {
  return html`<${BSheet} label="Spiegazioni finite">
    <${Rally} pose="re" w=${150} alt="" style="position:absolute;right:14px;top:-128px"/>
    <div><${Pill} bg=${GIALLO} rot=${-3}>FinLearn Pro<//></div>
    <h2 class="o-big" style="margin-top:14px;font-size:24px;line-height:28px">Per oggi le spiegazioni sono finite</h2>
    <p class="o-body o-mut" style="margin-top:6px">Gratis ne hai ${FREE_EXPL} al giorno. Con Pro non finiscono mai.</p>
    <ul class="o-col" style="gap:10px;margin-top:14px;list-style:none">${PRO_POINTS.slice(0, 3).map(t => html`<li key=${t} class="o-rowf" style="gap:12px"><span style="width:24px;height:24px;flex:none;display:flex;align-items:center;justify-content:center;background:${GIALLO};border:2px solid ${INK};border-radius:8px">${PathIco(D_CHECK, 14, 3.4)}</span><span class="o-t">${t}</span></li>`)}</ul>
    <p class="o-t" style="margin-top:14px;font-size:14px">${PRO_TRIAL_LINE}</p>
    <div style="margin-top:12px"><${Btn} cls="lg" bg=${GIALLO} onClick=${onPro}>Prova Pro gratis<//></div>
    <div style="text-align:center"><button type="button" class="o-link" onClick=${onSkip}>Torno domani</button></div>
  <//>`;
}
// esercizio "abbina le coppie"
function MatchExercise({ pairs, onDone }) {
  const right = useMemo(() => K.flShuffle(pairs.map((p, i) => i)), [pairs]);
  const [a, setA] = useState(null), [ok, setOk] = useState([]), [bad, setBad] = useState(null);
  useEffect(() => { if (ok.length === pairs.length) onDone(); }, [ok.length]);
  const tapR = j => { if (a == null || ok.includes(j)) return; if (j === a) { setOk([...ok, j]); setA(null); } else { setBad(j); setTimeout(() => setBad(null), 420); } };
  const cell = (on, done, wrong) => ({ minHeight: 78, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, padding: '8px 12px', width: '100%', border: `2.5px solid ${INK}`, borderRadius: 18,
    background: done ? MENTA : wrong ? ROSA : on ? T_AZ : '#fff', boxShadow: on && !done ? `4px 4px 0 ${INK}` : 'none', transition: 'background .15s' });
  const tick = PathIco('M5 12l5 5 9-10', 20, 3.2);
  return html`<div class="o-pad" style="position:relative;padding-top:22px;padding-bottom:20px">
    <${Rally} pose="pensa" w=${196} alt="" style="position:absolute;right:-12px;top:-14px"/>
    <div class="o-col" style="gap:6px;position:relative;min-height:150px;max-width:190px"><h1 class="o-big">Abbina le coppie</h1><p class="o-lab">Tocca una parola, poi il suo significato.</p></div>
    <div style="display:grid;grid-template-columns:minmax(132px,43%) 1fr;gap:10px 12px;margin-top:18px;position:relative">
      ${pairs.map((p, i) => html`<${React.Fragment} key=${i}>
        <button type="button" aria-pressed=${a === i || ok.includes(i) ? 'true' : 'false'} disabled=${ok.includes(i)} onClick=${() => setA(a === i ? null : i)} style=${Object.assign(cell(a === i, ok.includes(i)), { fontSize: 16, fontWeight: 800 })}>${p[0]}${ok.includes(i) && tick}</button>
        <button type="button" disabled=${ok.includes(right[i])} onClick=${() => tapR(right[i])} style=${Object.assign(cell(false, ok.includes(right[i]), bad === right[i]), { fontSize: 14, lineHeight: '19px', fontWeight: ok.includes(right[i]) ? 700 : 600 })}>${pairs[right[i]][1]}${ok.includes(right[i]) && tick}</button>
      <//>`)}
    </div>
    <p class="o-lab" style="margin-top:16px" aria-live="polite">${ok.length === pairs.length ? 'Tutte le coppie sono a posto.' : `${plural(ok.length, 'coppia', 'coppie')} su ${pairs.length}.${a != null ? ` Hai scelto “${pairs[a][0]}”: ora tocca il significato.` : ''}`}</p>
  </div>`;
}
// grafico della lezione sull'interesse composto: 1.000 € al 5%, anni a scelta
function CompoundWidget() {
  const [n, setN] = useState(20);
  const C = 1000, i = 0.05, pts = [0, n / 4, n / 2, 3 * n / 4, n];
  const val = t => ({ cap: C, simple: C * i * t, extra: C * Math.pow(1 + i, t) - C - C * i * t });
  const tot = C * Math.pow(1 + i, n), H = 132;
  const eur = v => eur0(v);   // stessa scrittura delle lezioni: 2.653 €
  const end = val(n);
  return html`<div class="o-card s o-col" style="padding:16px 18px;gap:10px;margin-top:16px">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px"><span style="font-size:15px;line-height:20px;font-weight:800">1.000 € al 5% l'anno</span>
      <span class="o-col" style="align-items:flex-end"><span class="o-s">dopo ${n} anni</span><span style="font-size:15px;line-height:20px;font-weight:800">${eur(tot)}</span></span></div>
    <div role="img" aria-label=${`Dopo ${n} anni 1.000 euro diventano ${eur(tot)}`} style="display:flex;align-items:flex-end;justify-content:space-between;height:${H + 4}px;padding:0 10px;border-bottom:2.5px solid ${INK}">
      ${pts.map((t, k) => { const v = val(t), sc = H / tot; return html`<div key=${k} style="width:42px;display:flex;flex-direction:column;border:2px solid ${INK};border-bottom:0;border-radius:6px 6px 0 0;overflow:hidden">
        ${v.extra * sc >= 1 && html`<i style=${{ display: 'block', height: v.extra * sc, background: AZ, borderBottom: `2px solid ${INK}` }}></i>`}
        ${v.simple * sc >= 1 && html`<i style=${{ display: 'block', height: v.simple * sc, background: T_AZ, borderBottom: `2px solid ${INK}` }}></i>`}
        <i style=${{ display: 'block', height: v.cap * sc, background: '#fff' }}></i></div>`; })}
    </div>
    <div style="display:flex;justify-content:space-between;padding:0 10px;font-size:12px;line-height:16px;font-weight:700;color:${MUT}">${pts.map((t, k) => html`<span key=${k} style="width:42px;text-align:center;white-space:nowrap">${k === 0 ? 'oggi' : k === 4 ? `${t} anni` : t}</span>`)}</div>
    <label class="o-rowf" style="gap:12px;margin-top:2px"><span style="font-size:15px;font-weight:800">Anni</span>
      <input type="range" min="4" max="40" step="4" value=${n} onInput=${e => setN(+e.target.value)} onChange=${e => setN(+e.target.value)} style="flex:1;accent-color:${INK};height:28px"/><span style="width:24px;text-align:right;font-size:15px;font-weight:800">${n}</span></label>
    <div class="o-col" style="gap:4px;font-size:14px;line-height:20px;font-weight:700">
      ${[['#fff', 'I tuoi soldi', end.cap], [T_AZ, 'Interessi sui tuoi soldi', end.simple], [AZ, 'Interessi sugli interessi', end.extra]].map(([bg, t, v]) => html`<div key=${t} class="o-rowf" style="gap:8px"><i style=${{ width: 14, height: 14, flex: 'none', background: bg, border: `2px solid ${INK}`, borderRadius: 4 }}></i><span class="o-grow">${t}</span><span style="font-weight:800">${eur(v)}</span></div>`)}
    </div></div>`;
}

// ---- la lezione: pagine, riepilogo, esercizi, e alla fine la figurina ----
function LessonScreen({ nav, lessonKey, at, ask }) {
  const l = lessonByKey(lessonKey);
  const steps = useMemo(() => lessonSteps(l), [lessonKey]);
  const [i, setI] = useState(() => clamp(at | 0, 0, Math.max(0, steps.length - 1))), [sel, setSel] = useState(null), [fb, setFb] = useState(null), [res, setRes] = useState({}), [tab, setTab] = useState('case');
  const [matched, setMatched] = useState(false), [done, setDone] = useState(null), [left, setLeft] = useState(null);
  const scrollRef = useRef(null);
  // parole da toccare: solo nelle lezioni di base, e si spengono quando esci dalla lezione
  termStore.on = !!l && l.kind !== 'los';
  useEffect(() => () => { termStore.on = false; termOpen(null); }, []);
  const firstTermPage = useMemo(() => (l && l.kind !== 'los' ? steps.findIndex(s => s.k === 'page' && hasTerms(s.text)) : -1), [lessonKey]);
  useEffect(() => { markSeen(l); }, [lessonKey]);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; setSel(null); setFb(null); setTab('case'); setMatched(false); }, [i]);
  const st = steps[i];
  const finish = (resNow) => {
    // contano come risposte le domande a scelta e i "Calcola tu"
    const R = resNow || res, qi = steps.map((s, k) => s.k === 'q' || s.k === 'num' ? k : -1).filter(k => k >= 0), okN = qi.filter(k => R[k] && R[k].ok).length, first = !isDone(l.key);
    if (first) { if (l.kind === 'los') K.setLosProgress(p => p.includes(l.key) ? p : [...p, l.key]); else s2set(s => ({ basi: s.basi.includes(l.key) ? s.basi : [...s.basi, l.key] })); K.albumLearn(l.key); }
    else if (qi.length) K.albumReview(l.key, okN === qi.length);
    const xp = first ? 10 + 10 * okN : 5 * okN; addXp(xp);
    setDone({ xp, okN, qn: qi.length, first, wrong: qi.filter(k => steps[k].k === 'q' && !(R[k] && R[k].ok)) });
  };
  // esito e scelta si azzerano insieme al cambio di passo: così una domanda può stare anche a metà lezione, seguita da una pagina
  const next = () => { if (i < steps.length - 1) { setSel(null); setFb(null); setI(i + 1); } else finish(); };
  useEffect(() => { if (!steps.length) finish({}); }, []);
  // "Chiedi a Rally": la chat conosce la pagina (o la domanda) che hai davanti. Una chat per pagina, che si riapre.
  const askHere = () => {
    if (!st) return;
    const id = `lez_${l.key}_${i}`, back = { lesson: l.key, at: i, chat: id };
    if (st.k === 'q') {
      const plain = K.flPlain(st.q.q), picked = fb && sel != null ? L3[sel] : null, right = L3[st.q.ans];
      return nav.askAbout({ id, back, title: 'Domanda: ' + plain.slice(0, 40),
        first: picked ? `Domanda: "${plain}"\n\nHai risposto ${picked}, la giusta è ${right}. Cosa vuoi capire?` : `Stai lavorando su:\n\n"${plain}"\n\nTi guido io, senza dirti subito la risposta. Da dove partiamo?`,
        ctx: { picked, correct: right, q: plain, opts: st.q.options.map(K.flPlain), topic: `${l.unit.name} · ${l.title}` } });
    }
    const page = st.k === 'recap' ? 'In breve' : st.title;
    const text = st.k === 'recap' ? [...st.points.map(p => '• ' + p), ...(st.tips.length ? ['All\'esame:', ...st.tips.map(p => '• ' + p)] : [])].join('\n')
      : [st.text, st.note ? 'In breve: ' + st.note : ''].filter(Boolean).join('\n\n');
    const others = steps.filter((s, k) => k !== i && s.k === 'page' && s.title).map(s => s.title).join('; ');
    nav.askAbout({ id, back, title: 'Lezione: ' + l.title,
      first: `Stai leggendo "${page}". Cosa non ti torna? Posso spiegartelo più semplice, farti un esempio con i numeri o interrogarti.`,
      ctx: { kind: 'lesson', title: l.title, where: [l.course && l.course.name, l.unit && l.unit.name].filter(Boolean).join(' · '), page, text: String(text).slice(0, 6000), others: others.slice(0, 800) } });
  };
  // ritorno da OpenRouter: la lezione si riapre alla stessa pagina, con la chat aperta
  useEffect(() => { if (ask) askHere(); }, []);
  if (done) return html`<${LessonDone} nav=${nav} l=${l} done=${done} steps=${steps} res=${res}/>`;
  if (!st) return html`<div class="o-scr"></div>`;
  // passi interattivi (stima, leve, metti a posto, ordina, calcola): ognuno disegna il suo corpo e il suo piede
  const IS = ISTEPS[st.k];
  if (IS) return html`<${IS} key=${i} st=${st} l=${l} repeat=${isDone(l.key)} scrollRef=${scrollRef} top=${html`<${TopBar} onClose=${nav.back} n=${steps.length} i=${i}/>`}
    onNext=${r => { const R = r ? Object.assign({}, res, { [i]: r }) : res; if (r) setRes(R); if (i < steps.length - 1) setI(i + 1); else finish(R); }}/>`;
  const check = () => {
    const ok = sel === st.q.ans; recordAnswer(st.q, ok); setRes(r => Object.assign({}, r, { [i]: { sel, ok } }));
    if (ok) return setFb('ok');
    const e = explState();
    if (e.pro) { setLeft(null); setFb('ko'); } else if (e.left > 0) { spendExplanation(); setLeft(e.left - 1); setFb('ko'); } else setFb('limit');
  };
  const locked = !!fb;
  const cs = st.k === 'q' ? splitCase(st.q) : null;
  const calcBtn = html`<${IBtn} lg=${true} icon=${Ico(Calculator, 24, 2.2)} onClick=${nav.openCalc} label="Calcolatrice"/>`;
  let body, foot;
  if (st.k === 'page') {
    body = html`<div class="o-pad" style="position:relative;padding-top:18px;padding-bottom:24px">
      ${st.head && html`<div class="o-lab" style="margin-bottom:4px">${st.head}</div>`}
      <h1 style="font-size:30px;line-height:34px;font-weight:800;letter-spacing:-.02em;text-wrap:balance;overflow-wrap:anywhere">${st.title}</h1>
      <div style="margin-top:12px">${(() => { const parts = st.fig ? String(st.text).split(/\n*\[fig\]\n*/) : [st.text]; return html`<${React.Fragment}><${Rich} text=${parts[0]}/>${st.fig && html`<${Fig} key=${'f' + i} fig=${st.fig}/>`}${parts[1] && html`<${Rich} text=${parts[1]}/>`}<//>`; })()}</div>
      ${i === firstTermPage && html`<p class="o-s" style="margin-top:14px">Le parole sottolineate si possono toccare: ti dicono che cosa vogliono dire.</p>`}
      ${st.widget === 'compound' && html`<${CompoundWidget}/>`}
      ${st.note && html`<div class="o-note" style="margin-top:18px"><${Rich} text=${'In breve: ' + st.note} cls="sm" style=${{ fontSize: 'inherit', lineHeight: 'inherit', fontWeight: 'inherit' }}/></div>`}
    </div>`;
    foot = html`<${Btn} cls="lg" onClick=${next}>Ho capito<//>`;
  } else if (st.k === 'recap') {
    body = html`<div class="o-pad" style="position:relative;padding-top:18px;padding-bottom:24px">
      <${Rally} pose="insegna" w=${170} alt="" style="position:absolute;right:-14px;top:-8px"/>
      <div style="position:relative;min-height:128px;max-width:200px"><div class="o-lab" style="margin-bottom:4px">${l.title}</div><h1 style="font-size:30px;line-height:34px;font-weight:800;letter-spacing:-.02em">In breve</h1></div>
      ${st.points.length > 0 && html`<div class="o-card s o-col" style="position:relative;padding:8px 18px;margin-top:10px">${st.points.map((t, k) => html`<div key=${k} class="o-rowf" style=${{ gap: 12, padding: '12px 0', borderBottom: k < st.points.length - 1 ? `2px solid ${SEP}` : 0, alignItems: 'flex-start' }}>
        <span style="width:24px;height:24px;flex:none;display:flex;align-items:center;justify-content:center;background:${INK};border-radius:50%;color:#fff;margin-top:1px">${PathIco(D_CHECK, 14, 3.4)}</span><${Rich} text=${t} cls="sm" style=${{ fontWeight: 700 }}/></div>`)}</div>`}
      ${st.tips.length > 0 && html`<div style="margin-top:16px;padding:12px 16px;background:${T_GIALLO};border-radius:16px"><div style="font-size:13px;line-height:18px;font-weight:800;margin-bottom:2px">All'esame</div>${st.tips.map((t, k) => html`<${Rich} key=${k} text=${String(t).replace(/^[^\wÀ-ÿ(]+\s*/, '')} cls="sm"/>`)}</div>`}
    </div>`;
    foot = html`<${Btn} cls="lg" onClick=${next}>${steps[i + 1] && steps[i + 1].k === 'q' ? 'Vai alla domanda' : 'Ho capito'}<//>`;
  } else if (st.k === 'match') {
    body = html`<${MatchExercise} key=${i} pairs=${st.pairs} onDone=${() => setMatched(true)}/>`;
    foot = html`<${Btn} cls="lg" disabled=${!matched} onClick=${next}>Continua<//>`;
  } else {
    const qn = steps.filter(s => s.k === 'q').length, qk = steps.slice(0, i + 1).filter(s => s.k === 'q').length;
    body = html`<${QuestionBody} key=${i} q=${st.q} label=${qn > 1 ? `Domanda ${qk} di ${qn}` : (l.kind === 'los' ? 'Domanda d\'esame' : 'Domanda')} sel=${sel} onSel=${setSel} locked=${locked} tab=${tab} setTab=${setTab}/>`;
    foot = html`<div class="o-rowf" style="gap:12px">${l.kind === 'los' && calcBtn}<div class="o-grow">${cs && tab === 'case'
      ? html`<${Btn} cls="lg" onClick=${() => setTab('ask')}>Vai alla domanda<//>` : html`<${Btn} cls="lg" disabled=${sel == null || locked} onClick=${check}>Controlla<//>`}</div></div>`;
  }
  const over = st.k !== 'q' ? null : fb === 'ok' ? html`<${FeedbackSheet} ok=${true} q=${st.q} xp=${isDone(l.key) ? 5 : 10} onNext=${next}/>`
    : fb === 'ko' ? html`<${FeedbackSheet} ok=${false} q=${st.q} left=${left} onNext=${next}/>`
    : fb === 'limit' ? html`<${LimitSheet} onPro=${() => { startPro(); setLeft(null); setFb('ko'); }} onSkip=${next}/>` : null;
  const askBtn = st.k === 'page' || st.k === 'recap' || st.k === 'q' ? html`<${IBtn} icon=${PathIco(D_TABS.coach, 22, 2.4)} onClick=${askHere} label="Chiedi a Rally"/>` : null;
  return html`<${Flow} scrollRef=${scrollRef} top=${html`<${TopBar} onClose=${nav.back} n=${steps.length} i=${i} right=${askBtn}/>`} foot=${foot} over=${over}>${body}<//>`;
}
// lezione finita: figurina, punti, giorni di fila
function LessonDone({ nav, l, done, steps, res }) {
  const [rev, setRev] = useState(false);
  const streak = streakDays(), emoji = lessonEmoji(l);
  const wq = done.wrong.length ? steps[done.wrong[0]].q : null, wr = wq ? res[done.wrong[0]] : null;
  const goOn = () => { const s = s2get(); if (K.user && K.user.guest && !s.askedSave) { s2set({ askedSave: true }); nav.replace('salva'); } else nav.back(); };
  const conf = [[34, 96, GIALLO, 24, 0], [58, 176, '#fff', 0, 1], [26, 244, MENTA, -32, 0], [96, 70, ROSA, 0, 1], [-48, 88, ROSA, -18, 0], [-70, 170, GIALLO, 0, 1], [-38, 240, '#fff', 38, 0], [-104, 64, MENTA, 0, 1]];
  return html`<div class="o-scr" style="background:repeating-conic-gradient(from 5deg at 50% 190px, #A9D3FF 0deg 10deg, ${AZ} 10deg 20deg)">
    <div class="o-scroll"><div class="o-col" style="min-height:100%;align-items:center;position:relative;padding:0 20px">
      ${conf.map(([x, y, bg, rot, round], k) => html`<span key=${k} aria-hidden="true" style=${Object.assign({ position: 'absolute', top: y, background: bg, border: `2px solid ${INK}` }, x >= 0 ? { left: x } : { right: -x }, round ? { width: 13, height: 13, borderRadius: '50%' } : { width: 10, height: 18, borderRadius: 3, transform: `rotate(${rot}deg)` })}></span>`)}
      <${Rally} pose="festa-grad" w=${300} alt="Rally festeggia con il cappello da laureato" style="margin-top:calc(var(--otop) - 17px);position:relative"/>
      <h1 class="o-pop" style="font-size:44px;line-height:48px;font-weight:800;letter-spacing:-.02em;text-align:center;margin-top:-18px;position:relative">Lezione finita!</h1>
      <p style="font-size:16px;line-height:22px;font-weight:600;text-align:center;margin-top:6px">${done.first ? 'Hai una figurina nuova nel tuo album.' : 'Figurina ravvivata: resta a colori più a lungo.'}</p>
      <div style="display:flex;align-items:flex-start;justify-content:center;gap:20px;margin-top:26px;width:100%">
        <div class="o-col" style="width:168px;flex:none;padding:8px 8px 12px;gap:10px;background:#fff;border:2.5px solid ${INK};border-radius:20px;box-shadow:5px 5px 0 ${INK};transform:rotate(-5deg)">
          <div style="height:122px;display:flex;align-items:center;justify-content:center;background:${T_AZ};border:2px solid ${INK};border-radius:13px;font-size:${emoji ? 56 : 44}px;line-height:1;font-weight:800">${emoji || stickerSym(l)}</div>
          <div class="o-col" style="gap:1px;padding:0 4px"><span style="font-size:15px;line-height:20px;font-weight:800;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${l.title}</span>
            <span style="font-size:12px;line-height:16px;font-weight:600;color:${MUT};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${l.unit.name}${l.code ? ', n. ' + l.code : ''}</span></div></div>
        <div class="o-col" style="width:152px;flex:none;margin-top:6px;overflow:hidden;background:#fff;border:2.5px solid ${INK};border-radius:20px">
          <div class="o-col" style="padding:9px 14px 10px;border-bottom:2px solid ${INK};background:${GIALLO}"><span style="font-size:13px;line-height:18px;font-weight:700">Punti</span><span style="font-size:22px;line-height:26px;font-weight:800">+${done.xp} XP</span></div>
          ${done.qn > 0 && html`<div class="o-col" style="padding:9px 14px 10px;border-bottom:2px solid ${INK}"><span class="o-s">Risposte giuste</span><span style="font-size:22px;line-height:26px;font-weight:800">${done.okN} su ${done.qn}</span></div>`}
          <div class="o-col" style="padding:9px 14px 10px"><span class="o-s">Giorni di fila</span><span style="font-size:22px;line-height:26px;font-weight:800">${Math.max(1, streak)}</span></div></div>
      </div>
      <div style="flex:1 1 20px;min-height:20px"></div>
      ${wq && html`<button type="button" class="o-link" onClick=${() => setRev(true)}>Rivedi la domanda sbagliata</button>`}
      <div style="width:100%;padding:8px 0 max(34px,calc(env(safe-area-inset-bottom) + 12px))"><${Btn} cls="lg" bg="#fff" onClick=${goOn}>Continua<//></div>
    </div></div>
    ${rev && html`<${BSheet} onClose=${() => setRev(false)} label="Domanda sbagliata">
      <div class="o-scroll" style="flex:0 1 auto;max-height:70vh"><${Rich} text=${wq.q} cls="q" lang=${wq.lang}/>
        <div style="margin-top:14px"><${Options} q=${wq} sel=${wr ? wr.sel : null} onSel=${() => {}} locked=${true}/></div>
        ${wq.exp && html`<div style="margin-top:14px;padding:12px 14px;background:${T_BG};border-radius:14px"><div style="font-size:18px;font-weight:800;margin-bottom:4px">Perché</div><${Rich} text=${wq.exp} cls="sm"/></div>`}</div>
      <div style="margin-top:14px;flex:none"><${Btn} cls="lg" onClick=${() => setRev(false)}>Ho capito<//></div>
    <//>`}
  </div>`;
}
