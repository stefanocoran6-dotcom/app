
// =====================================================================================================
// SFIDE, AI COACH, PROFILO, ALBUM, IMPOSTAZIONI, PRO, CATALOGO
// =====================================================================================================
const PRO_POINTS = ['Spiegazioni senza limite', 'Tutti i test, con il report per argomento', 'Allenamento sui tuoi punti deboli', 'I tasti della calcolatrice, passo per passo'];
const PRO_YEAR = '34,99 €', PRO_MONTH = '5,99 €';
const PRO_TRIAL_LINE = `7 giorni di prova, poi ${PRO_YEAR} l'anno.`;
function startPro(plan) { s2set({ pro: { since: Date.now(), plan: plan || 'anno' } }); try { K.setIsPro(true); } catch (e) {} }
function stopPro() { s2set({ pro: null }); try { K.setIsPro(false); } catch (e) {} }
const Avatar = ({ ch, bg = '#fff', size = 40 }) => html`<span style=${{ width: size, height: size, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg, border: `2px solid ${INK}`, borderRadius: '50%', fontSize: size * 0.4, fontWeight: 800 }}>${ch}</span>`;

function SfideScreen({ nav }) {
  useS2(); useTick();
  const [skip, setSkip] = useState(0);
  const lg = league(), me = lg.me;
  const rival = RIVALS[(RIVALS.indexOf(duelRival()) + skip) % RIVALS.length];
  const above = lg.rows[me.pos - 2];
  const ord = n => `${n}°`;
  const init = (userName() || 'T')[0].toUpperCase();
  return html`<${Room} color=${PESCA} tab="sfide" go=${nav.tab}
    rally=${html`<${Rally} pose="sfida" alt="Rally con la maschera" style="position:absolute;right:-10px;top:calc(var(--otop) + 4px)"/>`}
    head=${html`<div class="o-col" style="align-items:flex-start;gap:14px;padding-top:4px;max-width:210px"><h1 class="o-h1">Sfide</h1><${Pill}>Sei ${ord(me.pos)} in lega<//></div>`}>
    <div class="o-pad" style="position:relative;z-index:1"><div class="o-card o-col" style="gap:14px;align-items:center;text-align:center">
      <div class="o-rowf" style="gap:14px;align-items:flex-start">
        <span class="o-col" style="align-items:center;gap:6px"><${Avatar} ch=${init} bg=${PESCA} size=${56}/><span class="o-s" style="color:${INK};font-weight:700">Tu</span></span>
        <span style="margin-top:14px;padding:3px 12px;background:${INK};color:#fff;border-radius:999px;font-size:14px;font-weight:800;transform:rotate(-4deg)">contro</span>
        <span class="o-col" style="align-items:center;gap:6px"><${Avatar} ch=${rival[0]} size=${56}/><span class="o-s" style="color:${INK};font-weight:700">${rival}</span></span></div>
      <div class="o-col" style="gap:4px"><div style="font-size:22px;line-height:26px;font-weight:800;letter-spacing:-.01em">${rival} ti ha sfidato</div><div class="o-body o-mut">5 domande dai tuoi percorsi.<br/>Vince chi ne fa giuste di più.</div></div>
      <div class="o-rowf" style="gap:10px;width:100%"><div class="o-grow"><${Btn} bg=${PESCA} onClick=${() => nav.go('sfida', { rival })}>Accetta la sfida<//></div>
        <button type="button" class="o-btn flat" style="width:auto;background:#fff" onClick=${() => setSkip(skip + 1)}>Dopo</button></div>
    </div></div>
    <div style="height:24px;flex:none"></div>
    <${Sheet}>
      <div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:8px"><h2 class="o-h2">${lg.name}</h2><span class="o-lab">Finisce domenica</span></div>
      ${lg.rows.map(r => html`<div key=${r.name} class="o-rowf" style=${Object.assign({ gap: 12, height: 54, padding: '0 10px', borderRadius: 16 }, r.me ? { background: T_PESCA, border: `2.5px solid ${INK}` } : { border: '2.5px solid transparent' })}>
        <span style="width:22px;font-size:15px;font-weight:800;text-align:center">${r.pos}</span><${Avatar} ch=${r.me ? init : r.name[0]} bg=${r.me ? PESCA : '#fff'} size=${36}/>
        <span class="o-grow" style="font-size:17px;font-weight:700">${r.name}</span><span style="font-size:16px;font-weight:800">${fmtInt(r.xp)} XP</span></div>`)}
      <p class="o-s" style="margin-top:12px">${above ? `Ti mancano ${fmtInt(above.xp - me.xp + 1)} XP per superare ${above.name}.` : 'Sei in testa alla lega.'} Lega di prova: per ora gli altri sono avversari simulati.</p>
    <//>
  <//>`;
}
function duelQuestions() { const st = startedCourses(); const pool = (st.length ? st : courses()).flatMap(c => c.lessons); const done = pool.filter(l => isDone(l.key)); const src = allQuestions(done).length >= 5 ? done : pool; return K.flShuffle(allQuestions(src)).slice(0, 5); }
function DuelRun({ nav, rival }) {
  const qs = useMemo(duelQuestions, []);
  const [i, setI] = useState(0), [sel, setSel] = useState(null), [show, setShow] = useState(false), [mine, setMine] = useState([]), [his, setHis] = useState([]), [el, setEl] = useState(0);
  const n = qs.length, q = qs[i], lim = q ? Math.round(q.lesson.course.pace / 2) : 30;
  const bot = useMemo(() => ({ t: 5 + Math.random() * Math.max(4, lim - 14), ok: Math.random() < 0.62 }), [i]);
  const t0 = useRef(Date.now()), fired = useRef(false), init = (userName() || 'T')[0].toUpperCase();
  const confirm = () => {
    if (fired.current || !q) return; fired.current = true;
    const ok = sel === q.ans; if (sel != null) recordAnswer(q, ok);
    const m2 = [...mine, ok], h2 = [...his, bot.ok]; setMine(m2); setHis(h2); setShow(true);
    setTimeout(() => {
      if (i < n - 1) { fired.current = false; t0.current = Date.now(); setEl(0); setSel(null); setShow(false); setI(i + 1); }
      else { const a = m2.filter(Boolean).length, b = h2.filter(Boolean).length, xp = a > b ? 30 : a === b ? 10 : 5; addXp(xp); s2set(s => ({ duel: { w: s.duel.w + (a > b ? 1 : 0), l: s.duel.l + (a < b ? 1 : 0), last: Date.now() } })); nav.replace('sfidaFine', { rival, a, b, xp }); }
    }, 1500);
  };
  useEffect(() => { const h = setInterval(() => { const e = (Date.now() - t0.current) / 1000; setEl(e); if (e >= lim && !fired.current) confirm(); }, 250); return () => clearInterval(h); }, [i, sel, mine, his]);
  if (!q) return html`<${Flow} top=${html`<${TopBar} onClose=${nav.back} title="Sfida"/>`}><p class="o-pad o-body" style="padding-top:20px">Per sfidare qualcuno serve almeno una lezione con una domanda.</p><//>`;
  const left = Math.max(0, Math.ceil(lim - el)), a = mine.filter(Boolean).length, b = his.filter(Boolean).length;
  const dot = (v, k) => html`<i key=${k} style=${{ width: 12, height: 12, borderRadius: '50%', border: `2px solid ${INK}`, background: v === true ? INK : v === false ? '#fff' : 'transparent', borderStyle: v == null ? 'dashed' : 'solid' }}></i>`;
  return html`<${Flow} bg="#fff" top=${html`<div style="flex:none;background:${PESCA};border-bottom:2.5px solid ${INK};padding-bottom:58px;position:relative">
      <${Rally} pose="sfida" w=${110} alt="" style="position:absolute;right:6px;top:calc(var(--otop) - 7px)"/>
      <${TopBar} onClose=${nav.back} title=${'Sfida con ' + rival}/></div>
    <div class="o-pad" style="flex:none;margin-top:-46px;position:relative"><div class="o-card s" style="display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:12px 16px">
      <span class="o-col" style="align-items:center;gap:2px"><${Avatar} ch=${init} bg=${PESCA}/><span class="o-s">Tu</span><span style="font-size:30px;line-height:32px;font-weight:800">${a}</span></span>
      <span class="o-col" style="align-items:center;gap:6px"><span class="o-s" style="font-weight:700">Domanda ${i + 1} di ${n}</span>
        <span class="o-mono" role="timer" style=${{ padding: '3px 14px', background: left <= 5 ? ROSA : T_PESCA, border: `2px solid ${INK}`, borderRadius: 999, fontSize: 17, fontWeight: 600 }}>${fmtClock(left)}</span>
        <span class="o-rowf" style="gap:5px">${Array.from({ length: n }, (_, k) => dot(mine[k], k))}</span></span>
      <span class="o-col" style="align-items:center;gap:2px"><${Avatar} ch=${rival[0]} bg=${LILLA}/><span class="o-s">${rival}</span><span style="font-size:30px;line-height:32px;font-weight:800">${b}</span></span></div></div>`}
    foot=${html`<${Btn} cls="lg" bg=${PESCA} disabled=${sel == null || show} onClick=${confirm}>Conferma<//>`}>
    <div class="o-duel o-pad" style="padding-top:14px;padding-bottom:16px">
      <div style="display:flex;justify-content:flex-end;min-height:28px">${(show || el >= bot.t) && html`<span class="o-fade" style="padding:2px 12px;background:${MENTA};border:2px solid ${INK};border-radius:999px;font-size:13px;line-height:18px;font-weight:800">${rival} ha già risposto</span>`}</div>
      <div style="margin-top:10px"><${Rich} text=${q.q} cls="q" lang=${q.lang}/></div>
      <div style="margin-top:16px"><${Options} q=${q} sel=${sel} onSel=${setSel} locked=${show}/></div>
    </div>
  <//>`;
}
function DuelDone({ nav, rival, a, b, xp }) {
  const [msg, setMsg] = useState(false);
  const lg = league(), win = a > b, draw = a === b, init = (userName() || 'T')[0].toUpperCase();
  return html`<div class="o-scr" style="background:repeating-conic-gradient(from 5deg at 50% 200px, #FFD7BA 0deg 10deg, ${PESCA} 10deg 20deg)"><div class="o-scroll"><div class="o-col o-pad" style="min-height:100%;align-items:center">
    <div style="width:240px;height:240px;flex:none;margin-top:calc(var(--otop) + 21px);background:#fff;border:2.5px solid ${INK};border-radius:50%;box-shadow:5px 5px 0 ${INK};display:flex;align-items:flex-end;justify-content:center;overflow:hidden">
      <${Rally} pose=${win ? 'festeggia' : draw ? 'occhiolino' : 'triste'} w=${228} alt="" style="margin-bottom:-18px"/></div>
    <h1 class="o-pop" style="font-size:44px;line-height:48px;font-weight:800;letter-spacing:-.02em;margin-top:22px">${win ? 'Hai vinto!' : draw ? 'Pareggio' : 'Stavolta no'}</h1>
    <div class="o-rowf" style="gap:12px;margin-top:18px;padding:12px 20px;background:#fff;border:2.5px solid ${INK};border-radius:22px;box-shadow:5px 5px 0 ${INK};transform:rotate(-2deg)">
      <${Avatar} ch=${init} bg=${PESCA}/><span style="font-size:15px;font-weight:700">Tu</span><span style="font-size:38px;line-height:40px;font-weight:800;letter-spacing:-.02em;margin:0 6px">${a} a ${b}</span><span style="font-size:15px;font-weight:700">${rival}</span><${Avatar} ch=${rival[0]} bg=${LILLA}/></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;width:100%;margin-top:24px">
      <div class="o-col" style="align-items:center;padding:10px;background:${GIALLO};border:2.5px solid ${INK};border-radius:18px"><span style="font-size:20px;line-height:24px;font-weight:800">+${xp} XP</span><span style="font-size:13px;font-weight:700">${win ? 'per la vittoria' : draw ? 'per il pareggio' : 'per averci provato'}</span></div>
      <div class="o-col" style="align-items:center;padding:10px;background:#fff;border:2.5px solid ${INK};border-radius:18px"><span style="font-size:20px;line-height:24px;font-weight:800">${lg.me.pos}° posto</span><span style="font-size:13px;font-weight:700">in ${lg.name}</span></div></div>
    <div style="flex:1 1 16px;min-height:16px"></div>
    <div class="o-col" style="gap:12px;width:100%"><${Btn} cls="lg" bg="#fff" onClick=${() => nav.replace('sfida', { rival })}>Rivincita<//>
      <${Btn} cls="lg ink" onClick=${() => setMsg(true)}>${Ico(Link2, 20)} Sfida un amico con un link<//></div>
    ${msg && html`<p class="o-s o-fade" style="text-align:center;margin-top:8px;color:${INK}">Le sfide con gli amici arrivano insieme agli account online.</p>`}
    <div style="padding:2px 0 max(22px,calc(env(safe-area-inset-bottom) + 8px))"><button type="button" class="o-link" onClick=${nav.back}>Torna alle sfide</button></div>
  </div></div></div>`;
}

// ---- AI Coach: la chat è quella dell'app, dentro la nuova cornice ----
const COACH_ASK = ['Spiegami il residual income da zero', 'Differenza tra FCFF e FCFE', 'Come si calcola il VaR parametrico?', 'Interrogami con domande A, B, C'];
function CoachScreen({ nav }) {
  const [hist, setHist] = useState(false), [pending, setPending] = useState(null);
  const chats = K.chats || [], active = chats.find(c => c.id === K.activeChatId);
  const Chat = K.AiChatModal;
  const newChat = first => {
    const now = new Date().toISOString(), nm = userName();
    const c = { id: `chat_${Date.now()}`, title: first ? first.slice(0, 40) : 'Nuova conversazione', createdAt: now, updatedAt: now, messages: [{ role: 'assistant', content: `Ciao${nm ? ' ' + nm : ''}! Chiedimi un concetto da spiegare da zero, un esercizio o una domanda d'esame.`, timestamp: now }] };
    K.setChats(prev => [c, ...prev].slice(0, 50)); K.setActiveChatId(c.id); setPending(first ? { id: c.id, text: first } : null); setHist(false);
  };
  const fmt = d => { try { return new Date(d).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }); } catch (e) { return ''; } };
  return html`<${Room} color=${LILLA} tab="coach" go=${nav.tab} headH=${140}
    rally=${html`<${Rally} pose="coach" alt="Rally con le cuffie" style="position:absolute;right:-10px;top:calc(var(--otop) + 4px)"/>`}
    head=${html`<div class="o-col" style="align-items:flex-start;gap:14px;padding-top:4px;max-width:210px"><h1 class="o-h1">AI Coach</h1>
      <div class="o-rowf" style="gap:8px"><button type="button" onClick=${() => newChat()} aria-label="Nuova conversazione"><${Pill}>${active ? 'Nuova chat' : 'Chiedimi tutto'}<//></button>
        ${chats.length > 0 && html`<button type="button" class="o-ib" style="width:34px;height:34px;border-radius:11px" onClick=${() => setHist(true)} aria-label="Conversazioni">${Ico(History, 17, 2.4)}</button>`}</div></div>`}>
    <${Sheet} pad=${false} style=${{ paddingTop: 18 }}>
      ${active && Chat ? html`<div class="o-coach"><${Chat} key=${active.id} variant="page" chatId=${active.id} chats=${chats} setChats=${K.setChats} onClose=${() => {}} initialMessage=${pending && pending.id === active.id ? pending.text : null} onInitialSent=${() => setPending(null)} orBack=${{ tab: 'coach', chat: active.id }}/></div>`
        : html`<div class="o-col" style="gap:10px;padding-bottom:140px"><h2 class="o-h2">Cosa vuoi capire oggi?</h2><p class="o-body o-mut" style="margin-bottom:6px">Concetti spiegati da zero, esercizi passo per passo, domande come all'esame.</p>
          ${COACH_ASK.map(t => html`<button key=${t} type="button" class="o-rowf" onClick=${() => newChat(t)} style="gap:12px;width:100%;min-height:54px;padding:8px 14px;border:2.5px solid ${INK};border-radius:18px;font-size:15px;line-height:20px;font-weight:700"><span class="o-grow">${t}</span>${PathIco(D_NEXT, 20, 2.6)}</button>`)}
          <div style="margin-top:8px"><${Btn} bg=${LILLA} onClick=${() => newChat()}>Scrivi tu la domanda<//></div></div>`}
    <//>
    ${hist && html`<${BSheet} onClose=${() => setHist(false)} label="Conversazioni"><h2 class="o-big" style="margin-bottom:6px;flex:none">Conversazioni</h2>
      <div class="o-scroll" style="flex:0 1 auto;max-height:60vh">${chats.map((c, k) => html`<${Row} key=${c.id} icon=${PathIco(D_TABS.coach, 20, 2.4)} ibg=${c.id === K.activeChatId ? LILLA : null} title=${(c.isQuizChat ? 'Domanda: ' : '') + (c.title || 'Conversazione')} sub=${fmt(c.updatedAt || c.createdAt)}
        last=${k === chats.length - 1} onClick=${() => { K.setActiveChatId(c.id); setHist(false); }} right=${html`<span role="button" tabindex="0" aria-label="Elimina" onClick=${e => { e.stopPropagation(); K.deleteChat(c.id, e); }} style="width:36px;height:36px;display:flex;align-items:center;justify-content:center">${Ico(Trash2, 18)}</span>`}/>`)}</div><//>`}
  <//>`;
}

// ---- profilo e album ----
const allStickers = () => courses().flatMap(c => c.lessons);
function ProfiloScreen({ nav }) {
  useS2(); useTick();
  const album = K.albumLoad(), now = Date.now(), all = allStickers(), have = all.filter(l => album[l.key]);
  const recent = have.slice().sort((a, b) => album[b.key].t - album[a.key].t).slice(0, 8), cur = currentCourse();
  const name = userName() || 'Profilo', lg = league();
  const cells = Array.from({ length: 8 }, (_, k) => recent[k] || null);
  return html`<${Room} color=${ROSA} tab="profilo" go=${nav.tab} headH=${140}
    rally=${html`<${Rally} pose="moneta" alt="Rally con una moneta" style="position:absolute;right:-10px;top:calc(var(--otop) + 4px)"/>`}
    head=${html`<div class="o-col" style="align-items:flex-start;gap:14px;padding-top:4px;max-width:210px"><h1 class="o-h1" style=${name.length > 8 ? { fontSize: 34, lineHeight: '36px' } : null}>${name}</h1><${Pill}>${lg.name}<//></div>`}>
    <div class="o-pad" style="position:relative;z-index:1"><div class="o-card o-col" style="gap:14px">
      <div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px"><span style="font-size:22px;line-height:26px;font-weight:800;letter-spacing:-.01em">Il tuo album</span><span class="o-lab">${have.length} figurine su ${all.length}</span></div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">${cells.map((l, k) => { const st = l ? stickerState(l, album, now) : 'manca', em = l && lessonEmoji(l);
        return html`<span key=${k} style=${{ aspectRatio: '1 / 0.92', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 14, fontSize: em ? 24 : 17, fontWeight: 800, overflow: 'hidden',
          background: !l ? 'transparent' : st === 'dorata' ? GIALLO : st === 'sbiadisce' ? T_GR : ROSA, border: l ? `2.5px solid ${INK}` : `2px dashed ${INK}`, filter: st === 'sbiadisce' ? 'grayscale(1)' : 'none' }}>${l ? (em || stickerSym(l)) : '?'}</span>`; })}</div>
      <${Btn} bg=${ROSA} onClick=${() => nav.go('album')}>Apri l'album<//>
    </div></div>
    <div style="height:24px;flex:none"></div>
    <${Sheet}>
      <${Stats3} items=${[[streakDays(), 'giorni di fila'], [fmtInt((K.stats && K.stats.xp) || 0), 'punti XP'], [(cur ? coursePct(cur) : 0) + '%', cur ? 'di ' + cur.name : 'del percorso']]}/>
      <div style="height:2px;background:${SEP};margin:18px 0 0"></div>
      <${Row} icon=${Ico(Crown, 22)} ibg=${GIALLO} title="FinLearn Pro" sub=${K.isPro ? 'Attivo' : 'Provalo gratis per 7 giorni'} chev=${true} onClick=${() => nav.go('pro')}/>
      <${Row} icon=${Ico(SlidersHorizontal, 22)} title="Impostazioni" sub="Obiettivo, account e grafica" chev=${true} last=${true} onClick=${() => nav.go('impostazioni')}/>
    <//>
  <//>`;
}
function AlbumScreen({ nav }) {
  useS2(); useTick();
  const album = K.albumLoad(), now = Date.now(), all = allStickers(), have = all.filter(l => album[l.key]).length;
  const groups = courses().flatMap(c => c.units.map(u => ({ id: u.id, name: u.name.replace('Management', 'Mgmt'), lessons: unitLessons(u) })));
  const firstWith = groups.find(g => g.lessons.some(l => album[l.key])) || groups[0];
  const [gid, setGid] = useState(firstWith.id);
  const g = groups.find(x => x.id === gid) || groups[0], due = dueLessons();
  const leg = [[AZ, 'solid', 'Viva'], [T_GR, 'solid', 'Sbiadisce'], [GIALLO, 'solid', 'Dorata'], ['transparent', 'dashed', 'Manca']];
  return html`<${Room} color=${ROSA} tabs=${false} headH=${150}
    rally=${html`<${Rally} pose="moneta" w=${200} alt="" style="position:absolute;right:-10px;top:calc(var(--otop) + 4px)"/>`}
    head=${html`<div class="o-rowf" style="height:44px"><${IBtn} d=${D_BACK} onClick=${nav.back} label="Indietro"/></div>
      <div class="o-col" style="align-items:flex-start;gap:12px;margin-top:14px;max-width:210px"><h1 class="o-h1">Album</h1><${Pill}>${have} figurine su ${all.length}<//></div>`}>
    <${Sheet} pad=${false} style=${{ paddingTop: 18 }}>
      <div class="o-scroll" style="display:flex;gap:8px;overflow-x:auto;overflow-y:hidden;margin:0 -23px;padding:0 23px 2px;flex:none">${groups.map(x => html`<button key=${x.id} type="button" class=${'o-chip' + (x.id === gid ? ' on' : '')} onClick=${() => setGid(x.id)}>${x.name}</button>`)}</div>
      <div class="o-rowf" style="gap:14px;margin:14px 0 14px;flex-wrap:wrap">${leg.map(([bg, bs, t]) => html`<span key=${t} class="o-rowf" style="gap:6px;font-size:13px;font-weight:700;color:${MUT}"><i style=${{ width: 13, height: 13, background: bg, border: `2px ${bs} ${INK}`, borderRadius: 4 }}></i>${t}</span>`)}</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px 12px;justify-items:center;padding-bottom:${due.length ? 120 : 40}px">
        ${g.lessons.map(l => html`<${Sticker} key=${l.key} l=${l} state=${stickerState(l, album, now)} w=${104} big=${true} onClick=${() => nav.go('lezione', { key: l.key })}/>`)}</div>
    <//>
    ${due.length > 0 && html`<div class="o-foot" style="position:absolute;left:0;right:0;bottom:0;background:linear-gradient(rgba(255,255,255,0),#fff 28%);padding-top:26px"><${Btn} cls="lg" bg=${ROSA} onClick=${() => nav.go('pratica', { mode: 'ravviva' })}>${due.length === 1 ? 'Ravviva quella che sbiadisce' : `Ravviva le ${due.length} che sbiadiscono`}<//></div>`}
  <//>`;
}

// ---- impostazioni ----
function downloadData() {
  try {
    // nel file non finiscono le password degli account di prova né la chiave di OpenRouter
    const out = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (/^(finlearn_|fl2_)/.test(k) && k !== 'finlearn_users' && !/^finlearn_or_(key|pkce)$/.test(k)) out[k] = localStorage.getItem(k); }
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(out, null, 1)], { type: 'application/json' })); a.download = `finlearn-dati-${dayKey()}.json`; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  } catch (e) {}
}
// ---- AI Coach con OpenRouter: collega, scegli il modello, scollega ----
const orModelLabel = id => { const t = id === K.FL_OR_FREE ? 'Automatico (gratis)' : K.flOrModelName(id); return t.length > 28 ? t.slice(0, 27) + '…' : t; };
function OrSheet({ onClose }) {
  const or = K.useFlOr(), F = K.flOR;
  const [busy, setBusy] = useState(false), [err, setErr] = useState(null), [paste, setPaste] = useState(false), [txt, setTxt] = useState(''), [page, setPage] = useState(null);
  // pagina della chiave su OpenRouter: l'indirizzo si prepara prima, così il tocco apre subito la pagina
  useEffect(() => { let on = true; if (or.on) F.keyPage().then(u => { if (on) setPage(u); }, () => {}); return () => { on = false; }; }, [or.on]);
  const connect = async () => { setBusy(true); setErr(null); try { await F.start({ screen: 'impostazioni' }); } catch (e) { setErr(K.flOrMsg(e)); setBusy(false); } };
  const use = async () => { setBusy(true); setErr(null); try { await F.paste(txt); setTxt(''); setPaste(false); } catch (e) { setErr(K.flOrMsg(e)); } setBusy(false); };
  if (or.on) return html`<${BSheet} onClose=${onClose} label="OpenRouter"><div class="o-scroll" style="flex:0 1 auto"><h2 class="o-big">OpenRouter è collegato</h2>
    <p class="o-body o-mut" style="margin-top:6px">Rally risponde con il tuo account OpenRouter. La chiave resta su questo dispositivo.</p>
    <div class="o-row last" style="min-height:64px;gap:12px;margin-top:6px"><span class="o-grow o-col" style="gap:2px"><span class="o-t" style="font-size:15px">Solo fornitori che non tengono le domande</span><span class="o-s">Con i modelli gratis spesso non ce ne sono: Rally potrebbe non rispondere.</span></span><${Sw} on=${F.priv()} onChange=${v => F.setPriv(v)} label="Solo fornitori che non tengono le domande"/></div>
    <div class="o-col" style="gap:10px;margin-top:10px">
      <a class="o-btn lg flat" href=${page || 'https://openrouter.ai/keys'} target="_blank" rel="noopener noreferrer" style="background:#fff;text-decoration:none">Gestisci la chiave su OpenRouter</a>
      <${Btn} cls="lg flat" bg=${ROSA} onClick=${() => { F.disconnect(); onClose(); }}>Scollega da questo dispositivo<//></div>
    <p class="o-s" style="margin-top:10px">Scollegando, la chiave resta nel tuo account OpenRouter: la cancelli dalla pagina delle chiavi.</p></div><//>`;
  return html`<${BSheet} onClose=${onClose} label="Collega OpenRouter"><div class="o-scroll" style="flex:0 1 auto"><h2 class="o-big">Collega OpenRouter</h2>
    <div class="o-col o-body" style="gap:8px;margin-top:8px">
      <p>Rally ti risponde con un modello AI che gira sul tuo account OpenRouter. Con i modelli gratis non paghi niente: OpenRouter mette solo un limite di domande al minuto e al giorno.</p>
      <p>La chiave resta su questo dispositivo e le domande vanno da qui a OpenRouter, senza passare da FinLearn.</p>
      <p>Con i modelli gratis, chi fa girare il modello può conservare le domande e usarle: non scriverci dati personali.</p></div>
    ${err && html`<p class="o-s" role="alert" style="color:#B3261E;font-weight:700;margin-top:10px">${err}</p>`}
    <div style="margin-top:14px"><${Btn} cls="lg" bg=${LILLA} disabled=${busy} onClick=${connect}>${busy && !paste ? 'Apro OpenRouter…' : 'Collega OpenRouter'}<//></div>
    ${paste ? html`<div class="o-col" style="gap:10px;margin-top:14px"><input class="o-inp" type="password" value=${txt} onChange=${e => setTxt(e.target.value)} placeholder="sk-or-… oppure il codice" aria-label="Chiave o codice di OpenRouter" autocomplete="off" autocapitalize="off" spellcheck="false"/>
      <${Btn} cls="lg flat" bg="#fff" disabled=${busy || !txt.trim()} onClick=${use}>${busy ? 'Controllo…' : 'Usa questa'}<//></div>`
      : html`<div style="text-align:center"><button type="button" class="o-link" onClick=${() => setPaste(true)}>Ho una chiave o un codice</button></div>`}
  </div><//>`;
}
function ModelSheet({ onClose }) {
  const or = K.useFlOr(), F = K.flOR;
  const [list, setList] = useState(null), [err, setErr] = useState(null), [all, setAll] = useState(false), [q, setQ] = useState('');
  useEffect(() => { let on = true; F.models().then(m => { if (on) setList(m); }, e => { if (on) setErr(K.flOrMsg(e)); }); return () => { on = false; }; }, []);
  const pick = id => { F.setModel(id); onClose(); };
  const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean), MAX = 120;
  // prima i gratis, poi quelli a pagamento dal più economico
  const shown = (list || []).filter(m => (all || m.free) && words.every(w => (m.name + ' ' + m.id).toLowerCase().includes(w))).sort((a, b) => (a.free === b.free ? (a.free ? 0 : K.flOrCost(a) - K.flOrCost(b)) : a.free ? -1 : 1));
  const tick = id => (or.model === id ? html`<span style="flex:none;margin-right:4px">${PathIco(D_CHECK, 22, 3)}</span>` : null);
  return html`<${BSheet} onClose=${onClose} label="Modello"><h2 class="o-big" style="flex:none">Modello</h2>
    <p class="o-s" style="margin-top:4px;flex:none">I modelli gratis non costano niente. Quelli a pagamento usano i crediti del tuo account OpenRouter.</p>
    <div class="o-rowf" style="gap:8px;margin-top:12px;flex:none">${[[false, 'Gratis'], [true, 'Tutti']].map(([v, t]) => html`<button key=${t} type="button" class=${'o-chip' + (all === v ? ' on' : '')} aria-pressed=${all === v ? 'true' : 'false'} onClick=${() => setAll(v)}>${t}</button>`)}</div>
    <input class="o-inp" value=${q} onChange=${e => setQ(e.target.value)} placeholder="Cerca un modello" aria-label="Cerca un modello" style="margin-top:10px;flex:none;height:48px"/>
    <div class="o-scroll" style="flex:0 1 auto;max-height:52vh;margin-top:6px">
      <${Row} title="Automatico (gratis)" sub="Ogni volta OpenRouter sceglie un modello gratis libero." onClick=${() => pick(K.FL_OR_FREE)} right=${tick(K.FL_OR_FREE)}/>
      ${err && html`<p class="o-s" role="alert" style="color:#B3261E;font-weight:700;padding:10px 0">${err}</p>`}
      ${!list && !err && html`<p class="o-s" style="padding:10px 0">Carico l'elenco dei modelli…</p>`}
      ${shown.slice(0, MAX).map((m, k) => html`<${Row} key=${m.id} title=${m.free ? K.flOrNice(m.name) + ' · gratis' : m.name + ' · a pagamento'} sub=${K.flOrPrice(m)} last=${k === Math.min(shown.length, MAX) - 1} onClick=${() => pick(m.id)} right=${tick(m.id)}/>`)}
      ${list && shown.length > MAX && html`<p class="o-s" style="padding:10px 0">Ce ne sono altri ${shown.length - MAX}: scrivi per cercarli.</p>`}
      ${list && !shown.length && html`<p class="o-s" style="padding:10px 0">Nessun modello con questo nome.</p>`}
    </div><//>`;
}
function SettingsScreen({ nav, sheet: sheet0 }) {
  const s = useS2(), set = s.settings, u = K.user || {}, or = K.useFlOr();
  const [sheet, setSheet] = useState(sheet0 || null), [nm, setNm] = useState(userName());
  const upd = p => s2set(x => ({ settings: Object.assign({}, x.settings, p) }));
  const flags = Object.keys(s.flags || {}).length;
  const access = u.guest ? 'Ospite' : u.provider === 'apple' ? 'Con Apple' : /^google_/.test(u.uid || '') || u.provider === 'google' ? 'Con Google' : 'Con l\'email';
  const H = t => html`<h2 class="o-h2" style="font-size:18px;margin:26px 0 2px">${t}</h2>`;
  const R = (label, value, onClick, right, last) => html`<${onClick ? 'button' : 'div'} type=${onClick ? 'button' : undefined} class=${'o-row' + (last ? ' last' : '')} style="min-height:52px;gap:10px" onClick=${onClick}>
    <span class="o-grow o-t" style="font-size:16px">${label}</span>${value != null && html`<span style="font-size:15px;font-weight:600;color:${MUT};text-align:right">${value}</span>`}${right || (onClick && PathIco(D_NEXT, 20, 2.6))}<//>`;
  const wipe = () => { try { const uid = u.uid; ['fl2_state', 'finlearn_los_progress', 'finlearn_album', 'finlearn_album_v1', 'finlearn_activity', 'finlearn_quiz_stats', 'finlearn_exam_date', 'finlearn_data_' + uid, 'finlearn_chats_' + uid,
    'finlearn_or_key', 'finlearn_or_pkce', 'finlearn_or_model', 'finlearn_or_private', 'finlearn_ai_engine'].forEach(k => localStorage.removeItem(k)); } catch (e) {} K.onLogout(); setTimeout(() => { try { location.reload(); } catch (e) {} }, 50); };
  return html`<${Flow} top=${html`<${TopBar} onBack=${nav.back} mid=${html`<h1 class="o-grow" style="font-size:28px;line-height:32px;font-weight:800;letter-spacing:-.02em">Impostazioni</h1>`}/>`}>
    <div class="o-pad" style="padding-bottom:max(30px,calc(env(safe-area-inset-bottom) + 14px))">
      ${H('Studio')}
      ${R('Obiettivo al giorno', `${set.goalMin} minuti`, () => setSheet('goal'))}
      ${R('Promemoria', 'In arrivo', null)}
      ${R('Lingua delle spiegazioni', set.lang, () => setSheet('lang'))}
      ${R('Domande d\'esame', 'In inglese, come all\'esame', null, null, true)}
      ${H('AI Coach')}
      ${R('OpenRouter', or.on ? 'Collegato' : 'Da collegare', () => setSheet('or'))}
      ${R('Modello', orModelLabel(or.model), () => setSheet('model'), null, true)}
      ${H('Account')}
      ${R('Nome', userName() || 'Aggiungi', () => setSheet('name'))}
      ${R('Accesso', access, () => (u.guest ? nav.go('salva') : setSheet('account')))}
      ${R('Piano', K.isPro ? 'Pro' : 'Gratis', () => nav.go('pro'), K.isPro ? null : html`<span class="o-tag" style="padding:3px 11px;font-size:13px">Passa a Pro</span>`)}
      ${R('Scarica i miei dati', null, downloadData)}
      ${R('Elimina l\'account', null, () => setSheet('del'), null, true)}
      ${H('Aspetto')}
      ${R('Grafica', 'In ordine', () => setSheet('ui'), null, true)}
      ${H('Aiuto')}
      ${R('Domande segnalate', flags ? String(flags) : 'Nessuna', flags ? () => setSheet('flags') : null)}
      ${R('Regole e privacy', null, () => setSheet('priv'), null, true)}
      <p class="o-s" style="text-align:center;margin-top:26px">FinLearn 2.0 · ${K.VERSION || ''}</p>
    </div>
    ${sheet === 'goal' && html`<${BSheet} onClose=${() => setSheet(null)} label="Obiettivo"><h2 class="o-big">Quanto tempo hai al giorno?</h2>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:16px">${[5, 10, 20].map(m => html`<button key=${m} type="button" class="o-col" onClick=${() => { upd({ goalMin: m }); setSheet(null); }} style=${{ alignItems: 'center', padding: '12px 0', border: `2.5px solid ${INK}`, borderRadius: 18, background: set.goalMin === m ? AZ : '#fff', boxShadow: set.goalMin === m ? `3px 3px 0 ${INK}` : 'none' }}><span style="font-size:26px;line-height:30px;font-weight:800">${m}</span><span class="o-s" style="color:${INK}">minuti</span></button>`)}</div><//>`}
    ${sheet === 'lang' && html`<${BSheet} onClose=${() => setSheet(null)} label="Lingua"><h2 class="o-big" style="margin-bottom:6px">Lingua delle spiegazioni</h2>
      ${[['Italiano', true], ['English', false], ['Français', false], ['Español', false], ['Deutsch', false], ['中文', false]].map(([l, ok], k) => html`<div key=${l} class="o-row" style=${{ minHeight: 50, borderBottom: k < 5 ? `2px solid ${SEP}` : 0 }}><span class="o-grow o-t" style=${{ color: ok ? INK : DIMT }}>${l}</span>${ok ? PathIco(D_CHECK, 22, 3) : html`<span class="o-s">In arrivo</span>`}</div>`)}<//>`}
    ${sheet === 'name' && html`<${BSheet} onClose=${() => setSheet(null)} label="Nome"><h2 class="o-big">Come ti chiami?</h2>
      <input class="o-inp" value=${nm} onChange=${e => setNm(e.target.value)} placeholder="Il tuo nome" maxlength="24" aria-label="Nome" style="margin-top:16px"/>
      <div style="margin-top:14px"><${Btn} cls="lg" onClick=${() => { s2set({ name: firstName(nm) }); setSheet(null); }}>Salva<//></div><//>`}
    ${sheet === 'account' && html`<${BSheet} onClose=${() => setSheet(null)} label="Account"><h2 class="o-big">${u.displayName || 'Account'}</h2><p class="o-body o-mut" style="margin-top:4px">${u.email || ''}</p>
      <p class="o-body" style="margin-top:12px">Versione di prova: i tuoi dati restano su questo dispositivo.</p>
      <div style="margin-top:16px"><${Btn} cls="lg flat" bg="#fff" onClick=${() => { setSheet(null); K.onLogout(); }}>${Ico(LogOut, 20)} Esci dall'account<//></div><//>`}
    ${sheet === 'ui' && html`<${BSheet} onClose=${() => setSheet(null)} label="Grafica"><h2 class="o-big">Grafica dell'app</h2>
      <p class="o-body o-mut" style="margin-top:6px">Stai usando la grafica nuova, "In ordine". Quella di prima resta disponibile, con gli stessi progressi.</p>
      <div class="o-col" style="gap:10px;margin-top:16px"><${Btn} cls="lg" onClick=${() => setSheet(null)}>Tengo quella nuova<//><${Btn} cls="lg flat" bg="#fff" onClick=${() => K.setUi('figurine')}>Torna alla grafica precedente<//></div><//>`}
    ${sheet === 'flags' && html`<${BSheet} onClose=${() => setSheet(null)} label="Domande segnalate"><h2 class="o-big" style="flex:none">Domande segnalate</h2><p class="o-body o-mut" style="margin:6px 0 8px;flex:none">Finiscono anche nel file di "Scarica i miei dati".</p>
      <div class="o-scroll" style="flex:0 1 auto;max-height:50vh">${Object.keys(s.flags || {}).map(k => { const l = lessonByKey(k.split('#')[0]); return html`<div key=${k} class="o-row" style="min-height:48px"><span class="o-grow o-t" style="font-size:15px">${l ? l.title : k}</span><span class="o-s">${l && l.code ? l.code : ''}</span></div>`; })}</div>
      <div style="margin-top:12px;flex:none"><${Btn} cls="lg flat" bg="#fff" onClick=${() => { s2set({ flags: {} }); setSheet(null); }}>Svuota l'elenco<//></div><//>`}
    ${sheet === 'priv' && html`<${BSheet} onClose=${() => setSheet(null)} label="Regole e privacy"><h2 class="o-big">Regole e privacy</h2>
      <div class="o-col o-body" style="gap:10px;margin-top:10px"><p>I tuoi progressi, le risposte e le conversazioni sono salvati solo su questo dispositivo.</p><p>Se colleghi OpenRouter, le domande che fai all'AI Coach partono da qui verso OpenRouter e il fornitore del modello scelto. FinLearn non le riceve.</p><p>Niente pubblicità e nessun dato venduto.</p><p>FinLearn non è affiliata a CFA Institute. CFA® e Chartered Financial Analyst® sono marchi di CFA Institute.</p></div>
      <div style="margin-top:16px"><${Btn} cls="lg" onClick=${() => setSheet(null)}>Ho capito<//></div><//>`}
    ${sheet === 'or' && html`<${OrSheet} onClose=${() => setSheet(null)}/>`}
    ${sheet === 'model' && html`<${ModelSheet} onClose=${() => setSheet(null)}/>`}
    ${sheet === 'del' && html`<${BSheet} onClose=${() => setSheet(null)} label="Elimina l'account"><h2 class="o-big">Eliminare tutto?</h2><p class="o-body o-mut" style="margin-top:6px">Cancelli da questo dispositivo progressi, figurine, punti e conversazioni. Non si può annullare.</p>
      <div class="o-col" style="gap:10px;margin-top:16px"><${Btn} cls="lg" onClick=${() => setSheet(null)}>Tengo tutto<//><${Btn} cls="lg flat" bg=${ROSA} onClick=${wipe}>${Ico(Trash2, 20)} Elimina account e dati<//></div><//>`}
  <//>`;
}

// ---- FinLearn Pro ----
function ProScreen({ nav }) {
  useS2();
  const [plan, setPlan] = useState('anno');
  const pro = !!K.isPro;
  const card = (id, name, price, sub, tag) => html`<button type="button" aria-pressed=${plan === id ? 'true' : 'false'} onClick=${() => setPlan(id)} class="o-col" style=${{ position: 'relative', padding: '12px 14px 12px', gap: 2, border: `2.5px solid ${INK}`, borderRadius: 20, background: plan === id ? '#fff' : T_GIALLO, boxShadow: plan === id ? `4px 4px 0 ${INK}` : 'none' }}>
    ${tag && html`<span style="position:absolute;right:-6px;top:-13px;padding:2px 10px;background:#fff;border:2px solid ${INK};border-radius:999px;font-size:12px;line-height:16px;font-weight:800;transform:rotate(4deg)">${tag}</span>`}
    <span style="font-size:15px;font-weight:800">${name}</span><span style="font-size:24px;line-height:28px;font-weight:800;letter-spacing:-.01em">${price}</span><span class="o-s">${sub}</span></button>`;
  return html`<div class="o-scr" style="background:repeating-conic-gradient(from 5deg at 50% 200px, #FFE066 0deg 10deg, ${GIALLO} 10deg 20deg)"><div class="o-scroll"><div class="o-col" style="min-height:100%">
    <${TopBar} onClose=${nav.back} title=""/>
    <div class="o-col o-pad" style="align-items:center;flex:1 0 auto">
      <div style="width:200px;height:200px;flex:none;margin-top:-28px;background:#fff;border:2.5px solid ${INK};border-radius:50%;box-shadow:5px 5px 0 ${INK};display:flex;align-items:flex-end;justify-content:center;overflow:hidden"><${Rally} pose="re" w=${196} alt="Rally con la corona" style="margin-bottom:-14px"/></div>
      <h1 style="font-size:42px;line-height:46px;font-weight:800;letter-spacing:-.02em;margin-top:16px">FinLearn Pro</h1>
      <p style="font-size:16px;line-height:22px;font-weight:700;margin-top:4px">${pro ? 'È attivo. Buono studio.' : 'Tutta la finanza, senza limiti.'}</p>
      <div class="o-card s" style="width:100%;padding:4px 18px;margin-top:18px">${PRO_POINTS.map((t, k) => html`<div key=${t} class="o-rowf" style=${{ gap: 12, minHeight: 46, padding: '6px 0', borderBottom: k < PRO_POINTS.length - 1 ? `2px solid ${SEP}` : 0 }}>
        <span style="width:24px;height:24px;flex:none;display:flex;align-items:center;justify-content:center;background:${INK};border-radius:50%;color:#fff">${PathIco(D_CHECK, 14, 3.4)}</span><span class="o-t">${t}</span></div>`)}</div>
      ${!pro && html`<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;width:100%;margin-top:22px">${card('anno', 'Annuale', PRO_YEAR, '2,92 € al mese', 'Consigliato')}${card('mese', 'Mensile', PRO_MONTH, 'al mese')}</div>`}
      <div style="flex:1 1 16px;min-height:16px"></div>
      <div style="width:100%">${pro ? html`<${Btn} cls="lg flat" bg="#fff" onClick=${() => { stopPro(); }}>Torna al piano gratis<//>`
        : html`<${Btn} cls="lg ink" onClick=${() => { startPro(plan); nav.back(); nav.toast('Pro è attivo. Nessun addebito: i pagamenti non sono ancora collegati.'); }}>Prova gratis per 7 giorni<//>`}</div>
      <p style="font-size:14px;line-height:20px;font-weight:700;text-align:center;padding:10px 0 max(22px,calc(env(safe-area-inset-bottom) + 8px))">${pro ? 'Versione di prova dell\'app: Pro si attiva senza pagamento.' : `Poi ${plan === 'anno' ? PRO_YEAR + ' l\'anno' : PRO_MONTH + ' al mese'}. Per ora nessun addebito: i pagamenti non sono ancora collegati.`}</p>
    </div></div></div></div>`;
}

// ---- catalogo e scheda di un percorso ----
const CAT_ICON = { wallet: Wallet, trend: TrendingUp, pie: PieChart };
function CatalogScreen({ nav }) {
  const [f, setF] = useState('all');
  const ready = courses(), groups = [['basi', 'Finanza di base'], ['invest', 'Investire'], ['cert', 'Certificazioni']];
  const chips = [['all', 'Tutti'], ['basi', 'Basi'], ['invest', 'Investire'], ['cert', 'Esami']];
  const tile = c => { const isReady = !!c.ready, I = CAT_ICON[c.icon];
    return html`<button key=${c.id} type="button" disabled=${!isReady} onClick=${() => nav.go('scheda', { course: c.id })} class="o-col" style=${{ gap: 8, padding: 8, minHeight: c.group === 'cert' ? 0 : 132, borderRadius: 18, background: isReady ? '#fff' : T_BG, border: isReady ? `2.5px solid ${INK}` : `2px dashed ${INK}`, boxShadow: isReady ? `4px 4px 0 ${INK}` : 'none' }}>
      ${c.group !== 'cert' && html`<span style=${{ height: 52, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isReady ? (c.color || AZ) : 'transparent', border: isReady ? `2px solid ${INK}` : `2px dashed ${DIM}`, borderRadius: 11, fontSize: 24, fontWeight: 800, color: isReady ? INK : DIMT }}>${I ? Ico(I, 24) : c.badge}</span>`}
      <span class="o-col" style=${{ gap: 2, padding: c.group === 'cert' ? '6px 8px' : '0 4px 4px' }}><span class="o-t" style=${{ fontSize: 15, color: isReady ? INK : MUT }}>${c.name}</span><span class="o-s">${isReady ? (c.group === 'cert' ? plural(c.units.length, 'argomento pronto', 'argomenti pronti') : plural(c.lessons.length, 'lezione', 'lezioni')) : 'In arrivo'}</span></span></button>`; };
  return html`<${Flow} top=${html`<${TopBar} onBack=${nav.back} mid=${html`<h1 class="o-grow" style="font-size:28px;line-height:32px;font-weight:800;letter-spacing:-.02em">Percorsi</h1>`}/>`}>
    <div class="o-pad" style="padding-top:14px;padding-bottom:max(30px,calc(env(safe-area-inset-bottom) + 14px))">
      <div class="o-rowf" style="gap:8px;flex-wrap:wrap">${chips.map(([id, t]) => html`<button key=${id} type="button" class=${'o-chip' + (f === id ? ' on' : '')} onClick=${() => setF(id)}>${t}</button>`)}</div>
      ${groups.filter(([g]) => f === 'all' || f === g).map(([g, t]) => html`<section key=${g}><h2 class="o-h2" style="font-size:18px;margin:22px 0 10px">${t}</h2>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">${[...ready.filter(c => c.group === g), ...COMING.filter(c => c.group === g)].map(tile)}</div></section>`)}
      <button type="button" class="o-rowf" onClick=${() => nav.tab('coach')} style="gap:12px;width:100%;padding:14px 16px;margin-top:26px;background:${T_GR};border-radius:16px"><span class="o-grow o-t">Non trovi un argomento? Chiedilo a Rally.</span>${PathIco(D_NEXT, 22, 2.6)}</button>
    </div>
  <//>`;
}
function CourseSheetScreen({ nav, course }) {
  useS2(); useTick();
  const c = courseById(course) || courses()[0], album = K.albumLoad(), now = Date.now();
  const mins = c.lessons.reduce((n, l) => n + l.minutes, 0), started = doneCount(c.lessons) > 0, nx = nextLesson(c);
  const go = () => { s2set(x => ({ cur: c.id, started: Array.from(new Set([...(x.started || []), c.id])) })); if (nx) nav.replace('lezione', { key: nx.key }); else nav.replace('percorso', { course: c.id }); };
  return html`<${Room} color=${c.color || AZ} tabs=${false} headH=${176}
    rally=${html`<${Rally} pose="insegna" alt="" style="position:absolute;right:-14px;top:calc(var(--otop) + 27px)"/>`}
    head=${html`<div class="o-rowf" style="height:44px"><${IBtn} d=${D_BACK} onClick=${nav.back} label="Indietro"/></div>
      <div class="o-col" style="align-items:flex-start;gap:12px;margin-top:22px;max-width:190px"><h1 class="o-h1m">${c.name}</h1><${Pill}>${c.tagline}<//></div>`}>
    <${Sheet} pad=${false} style=${{ paddingTop: 24 }}>
      <${Stats3} items=${[[c.lessons.length, 'lezioni'], [c.units.length, c.group === 'cert' ? 'argomenti' : 'unità'], [mins < 90 ? mins + ' min' : Math.round(mins / 60) + ' ore', 'in tutto']]}/>
      <div style="height:2px;background:${SEP};margin:18px 0"></div>
      <h2 class="o-h2" style="font-size:18px;margin-bottom:10px">Cosa impari</h2>
      <ul class="o-col" style="gap:8px;list-style:none">${c.learn.map(t => html`<li key=${t} class="o-rowf" style="gap:12px;align-items:flex-start">${PathIco(D_CHECK, 20, 3)}<span class="o-t" style="font-size:15px;font-weight:600">${t}</span></li>`)}</ul>
      <h2 class="o-h2" style="font-size:18px;margin:22px 0 12px">Le figurine da vincere</h2>
      <div class="o-scroll" style="display:flex;gap:10px;overflow-x:auto;overflow-y:hidden;margin:0 -23px;padding:2px 23px 6px;flex:none">${c.lessons.slice(0, 8).map((l, k) => { const st = stickerState(l, album, now), em = lessonEmoji(l);
        return html`<span key=${l.key} style=${{ width: 50, height: 50, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 14, fontSize: em ? 22 : 16, fontWeight: 800, background: st !== 'manca' || k === 0 ? (c.color || AZ) : 'transparent', border: st !== 'manca' || k === 0 ? `2.5px solid ${INK}` : `2px dashed ${INK}`, boxShadow: st !== 'manca' || k === 0 ? `3px 3px 0 ${INK}` : 'none', transform: k === 0 ? 'rotate(-4deg)' : 'none' }}>${st !== 'manca' || k < 2 ? (em || stickerSym(l)) : '?'}</span>`; })}</div>
      <div style="flex:1 1 20px;min-height:20px"></div>
      <p class="o-s" style="text-align:center;font-size:14px;font-weight:700;color:${INK};margin-top:22px">Tutte le lezioni sono gratis.</p>
      <div style="padding:12px 0 max(30px,calc(env(safe-area-inset-bottom) + 12px))"><${Btn} cls="lg" onClick=${go}>${started ? 'Continua il percorso' : 'Inizia il percorso'}<//></div>
    <//>
  <//>`;
}

// ---- salva i progressi (per chi è entrato come ospite) e accesso ----
function AccountForm({ mode, onSubmit, busy, err }) {
  const [name, setName] = useState(''), [email, setEmail] = useState(''), [pw, setPw] = useState('');
  return html`<form class="o-col" style="gap:10px;margin-top:14px" onSubmit=${e => { e.preventDefault(); onSubmit({ name: name.trim(), email: email.trim(), password: pw }); }}>
    ${mode === 'new' && html`<input class="o-inp" value=${name} onChange=${e => setName(e.target.value)} placeholder="Il tuo nome" aria-label="Nome" autocomplete="given-name" maxlength="24"/>`}
    <input class="o-inp" type="email" value=${email} onChange=${e => setEmail(e.target.value)} placeholder="Email" aria-label="Email" autocomplete="email" required=${true}/>
    <input class="o-inp" type="password" value=${pw} onChange=${e => setPw(e.target.value)} placeholder="Password (almeno 6 caratteri)" aria-label="Password" autocomplete=${mode === 'new' ? 'new-password' : 'current-password'} minlength="6" required=${true}/>
    ${err && html`<p class="o-s" style="color:#B3261E;font-weight:700" role="alert">${err}</p>`}
    <${Btn} cls="lg" type="submit" disabled=${busy} onClick=${undefined}>${busy ? 'Un attimo…' : mode === 'new' ? 'Crea l\'account' : 'Entra'}<//>
  </form>`;
}
function SaveScreen({ nav }) {
  const [form, setForm] = useState(false), [busy, setBusy] = useState(false), [err, setErr] = useState(null);
  const l = allStickers().find(x => isDone(x.key));
  const link = async p => { setBusy(true); setErr(null); try { await K.upgradeGuest(p); if (p.name) s2set({ name: firstName(p.name) }); nav.back(); } catch (e) { setErr((e && e.message) || 'Non ha funzionato, riprova.'); setBusy(false); } };
  return html`<div class="o-scr" style="background:${AZ}">
    <div style="position:relative;flex:none;height:calc(var(--otop) + 227px)">
      <div class="o-top o-pad"><${IBtn} d=${D_X} onClick=${nav.back} label="Chiudi"/></div>
      <${Rally} pose="telefono" w=${214} alt="Rally con il telefono" style="position:absolute;left:50%;margin-left:-150px;bottom:-34px"/>
      ${l && html`<div class="o-col" style="position:absolute;left:50%;margin-left:44px;bottom:26px;width:104px;padding:6px 6px 10px;gap:6px;background:#fff;border:2.5px solid ${INK};border-radius:16px;box-shadow:4px 4px 0 ${INK};transform:rotate(6deg)">
        <span style="height:52px;display:flex;align-items:center;justify-content:center;background:${AZ};border:2px solid ${INK};border-radius:10px;font-size:24px;font-weight:800">${lessonEmoji(l) || stickerSym(l)}</span><span style="font-size:12px;line-height:15px;font-weight:700;padding:0 2px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">${l.title}</span></div>`}
    </div>
    <div class="o-scroll" style="background:#fff;border-top:2.5px solid ${INK};position:relative"><div class="o-col o-pad" style="min-height:100%;padding-top:26px">
      <h1 class="o-big" style="font-size:30px;line-height:34px">Salva i tuoi progressi</h1>
      <p class="o-body o-mut" style="margin-top:8px;font-size:16px">${l ? 'Hai finito la prima lezione e vinto una figurina. ' : ''}Con un account le ritrovi quando rientri.</p>
      ${form ? html`<${AccountForm} mode="new" busy=${busy} err=${err} onSubmit=${p => link(Object.assign({ provider: 'email' }, p))}/>`
        : html`<div class="o-col" style="gap:12px;margin-top:26px">
          <${Btn} cls="lg ink" disabled=${busy} onClick=${() => link({ provider: 'apple' })}>Continua con Apple<//>
          <${Btn} cls="lg flat" bg="#fff" disabled=${busy} onClick=${() => link({ provider: 'google' })}>Continua con Google<//>
          <${Btn} cls="lg flat" bg="#fff" disabled=${busy} onClick=${() => setForm(true)}>Continua con l'email<//></div>`}
      <div style="text-align:center;margin-top:6px"><button type="button" class="o-link" onClick=${nav.back}>Più tardi</button></div>
      <div style="flex:1 1 12px"></div>
      <p class="o-s" style="text-align:center;padding:10px 12px max(26px,calc(env(safe-area-inset-bottom) + 10px))">Versione di prova: l'account resta su questo dispositivo. Niente pubblicità, niente dati venduti.</p>
    </div></div></div>`;
}
