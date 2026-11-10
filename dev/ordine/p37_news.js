
// =====================================================================================================
// NOTIZIE: il nastro in home, la pagina dell'articolo e l'archivio di tutti gli articoli.
// I testi non stanno nel codice: notizie.json ha le notizie del giorno, notizie/indice.json l'elenco di tutte,
// notizie/AAAA-MM.json i testi mese per mese. Per aggiornare si cambiano quei file (vedi dev/NOTIZIE.md).
// =====================================================================================================
const NEWS = { data: '', items: [], req: null, subs: new Set(), idx: null, idxReq: null, idxErr: false, mesi: {}, mesiReq: {} };
const newsPing = () => NEWS.subs.forEach(f => f());
const newsJson = u => fetch(u, { cache: 'no-cache' }).then(r => (r.ok ? r.json() : null));
const newsOk = a => a && a.id && a.titolo && Array.isArray(a.corpo);
function newsLoad() {
  if (NEWS.req || typeof fetch === 'undefined') return;
  NEWS.req = newsJson('./notizie.json').then(j => {
    NEWS.data = (j && typeof j.data === 'string' && j.data) || '';
    NEWS.items = j && Array.isArray(j.articoli) ? j.articoli.filter(newsOk).map(a => (a.data ? a : Object.assign({}, a, { data: NEWS.data }))) : [];
    newsPing();
  }).catch(() => { NEWS.req = null; });   // senza rete e senza copia salvata: si riprova alla prossima apertura
}
function newsIndexLoad() {
  if (NEWS.idxReq || typeof fetch === 'undefined') return;
  NEWS.idxErr = false;
  NEWS.idxReq = newsJson('./notizie/indice.json').then(j => { NEWS.idx = j && Array.isArray(j.articoli) ? j.articoli.filter(a => a && a.id && a.data) : []; newsPing(); })
    .catch(() => { NEWS.idxReq = null; NEWS.idxErr = true; newsPing(); });
}
// mesi[m]: undefined = non ancora chiesto, null = non arrivato, lista = arrivato
function newsMonthLoad(m) {
  if (!/^\d{4}-\d{2}$/.test(m) || NEWS.mesiReq[m] || typeof fetch === 'undefined') return;
  NEWS.mesiReq[m] = newsJson(`./notizie/${m}.json`).then(j => { NEWS.mesi[m] = j && Array.isArray(j.articoli) ? j.articoli.filter(newsOk) : []; newsPing(); })
    .catch(() => { delete NEWS.mesiReq[m]; NEWS.mesi[m] = null; newsPing(); });
}
const newsMonthOf = id => String(id || '').slice(0, 7);   // gli id cominciano con la data: 2026-11-10-bollette
const newsFind = id => NEWS.items.find(x => x.id === id) || (NEWS.mesi[newsMonthOf(id)] || []).find(x => x.id === id) || null;
function useNews() {
  const [, f] = useState(0);
  useEffect(() => { const g = () => f(x => x + 1); NEWS.subs.add(g); newsLoad(); return () => { NEWS.subs.delete(g); }; }, []);
  return NEWS;
}
// articoli già letti: restano segnati nell'archivio
const NEWS_READ = 'fl2_news_letti';
let newsReadCache = null;
const newsReadSet = () => newsReadCache || (newsReadCache = new Set((v => (Array.isArray(v) ? v : []))(LS.get(NEWS_READ, []))));
function newsMarkRead(id) { const s = newsReadSet(); if (!id || s.has(id)) return; s.add(id); LS.set(NEWS_READ, Array.from(s).slice(-600)); newsPing(); }

const NEWS_MESI = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
const newsDate = s => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || ''); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; };
// sul nastro c'è scritto "Oggi" solo se le notizie sono davvero di oggi, altrimenti il giorno
const newsDayShort = s => { if (s && s === dayKey()) return 'Oggi'; const d = newsDate(s); return d ? `${d.getDate()} ${NEWS_MESI[d.getMonth()]}` : 'Notizie'; };
const newsCap = t => t.charAt(0).toUpperCase() + t.slice(1);
const newsDayLong = s => { const d = newsDate(s); return d ? newsCap(d.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })) : ''; };
const newsDayName = s => { const d = newsDate(s); return d ? d.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' }) : ''; };
const newsDayHead = s => (s === dayKey() ? 'Oggi · ' + newsDayName(s) : s === dayKey(new Date(Date.now() - DAY)) ? 'Ieri · ' + newsDayName(s) : newsCap(newsDayName(s)));
const newsWords = a => [a.sommario, ...(a.breve || []), ...a.corpo.reduce((t, s) => t.concat(s.h, s.p || []), []), a.perche].join(' ').split(/\s+/).filter(Boolean).length;
const newsMinutes = a => Math.max(1, Math.round(newsWords(a) / 180));
const D_ARROW = 'M5 12h14M13 6l6 6-6 6', D_OUT = 'M14 5h5v5M19 5l-8 8M11 7H6v11h11v-5';
const D_NEWS = 'M4 5h13v14H6a2 2 0 0 1-2-2zM17 9h3v8a2 2 0 0 1-2 2M7.5 9h6M7.5 12.5h6M7.5 16h4';
const newsLab = (t, w = 600) => html`<span class="o-mono" style=${{ fontSize: 11, lineHeight: '14px', fontWeight: w, letterSpacing: '.08em', textTransform: 'uppercase' }}>${t}</span>`;

// Il nastro: i titoli del giorno che scorrono sotto la lezione. Ogni titolo apre il suo articolo, l'etichetta del giorno apre l'archivio.
function NewsTicker({ nav }) {
  const n = useNews();
  if (!n.items.length) return html`<div style="height:24px;flex:none"></div>`;
  const lab = newsDayShort(n.data), chars = n.items.reduce((t, a) => t + String(a.nastro || a.titolo).length + 12, 0);
  const star = html`<svg width="14" height="14" viewBox="0 0 24 24" fill=${INK} aria-hidden="true" style="flex:none"><path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z"/></svg>`;
  // due gruppi uguali uno dopo l'altro: quando il primo è uscito tutto, il giro ricomincia senza salti
  const group = k => html`<span class="o-nt-g" key=${k} aria-hidden=${k ? 'true' : undefined}>
    <button type="button" class="o-nt-chip" tabIndex=${k ? -1 : undefined} aria-label="Tutte le notizie" onClick=${() => nav.go('notizie')}>${lab}</button>
    ${n.items.map(a => html`<button type="button" key=${a.id} class="o-nt-i" tabIndex=${k ? -1 : undefined} onClick=${() => nav.go('articolo', { id: a.id })}>
      <span>${a.nastro || a.titolo}</span><span class="o-nt-l">Leggi${PathIco(D_ARROW, 14, 3)}</span>${star}</button>`)}</span>`;
  // il nastro è inclinato e più largo dello schermo: il riquadro esterno taglia quello che sporge, così la pagina non scorre di lato
  return html`<div class="o-ntw"><div class="o-nt" role="region" aria-label=${lab === 'Oggi' ? 'Le notizie di oggi' : 'Le ultime notizie'}>
    <div class="o-nt-run" style=${{ animationDuration: Math.max(22, Math.round(chars * 0.34)) + 's' }}>${group(0)}${group(1)}</div></div></div>`;
}
// la riga che dalla home porta all'archivio (compare solo se ci sono notizie)
function NewsHomeRow({ nav }) {
  const n = useNews();
  if (!n.items.length) return null;
  return html`<${Row} icon=${PathIco(D_NEWS, 22, 2.2)} ibg=${GIALLO} title="Tutte le notizie" sub="L'archivio, giorno per giorno" chev=${true} onClick=${() => nav.go('notizie')}/>`;
}

function NewsTitle({ a }) {
  const t = String(a.titolo), e = a.evid && t.indexOf(a.evid) >= 0 ? String(a.evid) : '';
  if (!e) return t;
  const i = t.indexOf(e);
  return html`${t.slice(0, i)}<span class="o-hl">${e}</span>${t.slice(i + e.length)}`;
}
const newsNumSize = s => { const L = String(s).length; return L <= 4 ? 96 : L === 5 ? 88 : L === 6 ? 76 : L === 7 ? 66 : 54; };

// `from: 'archivio'` quando l'articolo è stato aperto dall'elenco: "Tutte le notizie" allora torna indietro invece di aprirne un altro
function ArticleScreen({ nav, id, from }) {
  const n = useNews(), a = newsFind(id), m = newsMonthOf(id);
  termStore.on = true;   // le parole in grassetto che stanno nel glossario si toccano, come nelle lezioni
  useEffect(() => () => { termStore.on = false; termOpen(null); }, []);
  useEffect(() => { if (!newsFind(id)) newsMonthLoad(m); }, [id, n.items.length]);   // articolo dei giorni scorsi: serve il file del suo mese
  useEffect(() => { if (a) newsMarkRead(a.id); }, [a && a.id]);
  const back = html`<${IBtn} d=${D_BACK} onClick=${nav.back} label="Indietro"/>`;
  if (!a) {
    const failed = NEWS.mesi[m] === null, gone = Array.isArray(NEWS.mesi[m]);
    return html`<div class="o-scr"><div class="o-top o-pad"><div class="o-rowf" style="height:44px">${back}</div>
      <p class="o-body o-mut" style="margin-top:24px">${failed ? 'Non riesco a caricare questa notizia. Controlla la connessione.' : gone ? 'Questa notizia non è più disponibile.' : 'Sto caricando la notizia.'}</p>
      ${failed && html`<div style="margin-top:14px"><${Btn} cls="sm" bg=${GIALLO} onClick=${() => newsMonthLoad(m)}>Riprova<//></div>`}</div></div>`;
  }
  const day = a.data || n.data, min = newsMinutes(a);
  const pool = n.items.some(x => x.id === a.id) ? n.items : (NEWS.mesi[m] || []);
  const altre = pool.filter(x => x.id !== a.id && (x.data || n.data) === day);
  const allNews = () => (from === 'archivio' ? nav.back() : nav.replace('notizie'));
  return html`<div class="o-scr"><div class="o-scroll"><div class="o-top o-pad o-col" style="padding-bottom:max(28px,calc(env(safe-area-inset-bottom) + 16px))">
    <div class="o-rowf" style="height:44px;justify-content:space-between;gap:12px">${back}${newsLab(`${a.cat || 'Notizie'} · ${min} min di lettura`)}<span aria-hidden="true" style="width:44px;flex:none"></span></div>

    <div style="position:relative;margin-top:56px">
      <${Rally} pose="saluta" w=${138} alt="" style="position:absolute;right:14px;top:-68px"/>
      <div class="o-col" style="position:relative;padding:16px 20px 18px;background:${GIALLO};border:2.5px solid ${INK};border-radius:28px;box-shadow:5px 5px 0 ${INK}">
        ${newsLab(newsDayLong(day) || 'Notizie')}
        <div class="o-rowf" style="margin-top:4px;align-items:flex-end;flex-wrap:wrap;gap:4px 14px">
          <span style=${{ fontSize: newsNumSize(a.numero || ''), lineHeight: '92px', fontWeight: 800, letterSpacing: '-.045em', whiteSpace: 'nowrap' }}>${a.numero}</span>
          ${a.nota && html`<span style="margin-bottom:14px"><${Pill}>${a.nota}<//></span>`}
        </div>
        ${a.didascalia && html`<span style="margin-top:6px;font-size:15px;line-height:20px;font-weight:700">${a.didascalia}</span>`}
      </div>
    </div>

    <h1 style="margin-top:30px;font-size:32px;line-height:37px;font-weight:800;letter-spacing:-.025em;overflow-wrap:anywhere"><${NewsTitle} a=${a}/></h1>
    ${a.sommario && html`<p class="o-mut" style="margin-top:12px;font-size:18px;line-height:26px;font-weight:600">${a.sommario}</p>`}
    <div class="o-rowf" style="margin-top:16px;gap:10px">
      <span aria-hidden="true" style="position:relative;width:44px;height:44px;flex:none;overflow:hidden;background:${AZ};border:2px solid ${INK};border-radius:50%"><${Rally} pose="scrive" w=${104} style="position:absolute;left:-31px;top:-16px;max-width:none"/></span>
      <span class="o-col"><span style="font-size:15px;line-height:20px;font-weight:800">A cura di FinLearn</span><span class="o-s">${newsDayLong(day)}${a.fonti && a.fonti.length ? ' · fonti in fondo' : ''}</span></span>
    </div>

    ${a.breve && a.breve.length > 0 && html`<div class="o-col" style="margin-top:22px;gap:10px;padding:14px 16px 16px;background:${T_GIALLO};border:2.5px solid ${INK};border-radius:20px">
      ${newsLab('In breve', 700)}
      <ul class="o-col" style="gap:8px;list-style:none">${a.breve.map((t, k) => html`<li key=${k} class="o-rowf" style="gap:10px;align-items:flex-start;font-size:15.5px;line-height:22px;font-weight:700">
        <span aria-hidden="true" style="width:8px;height:8px;flex:none;margin-top:7px;background:${INK};border-radius:3px"></span><span>${t}</span></li>`)}</ul></div>`}

    <div class="o-col" style="margin-top:14px;gap:16px">
      ${a.corpo.map((s, k) => html`<${React.Fragment} key=${k}>
        ${s.h && html`<div class="o-col" style="margin-top:14px;gap:10px"><span aria-hidden="true" style="width:34px;height:7px;background:${GIALLO};border:2px solid ${INK};border-radius:99px"></span>
          <h2 style="font-size:24px;line-height:29px;font-weight:800;letter-spacing:-.02em">${s.h}</h2></div>`}
        ${(s.p || []).map((t, j) => html`<${Rich} key=${j} text=${t} cls="art"/>`)}<//>`)}

      ${a.perche && html`<div class="o-col" style="margin-top:8px;gap:4px;padding:12px 16px 14px;background:${T_GIALLO};border-radius:16px">
        ${newsLab('Perché ti riguarda', 700)}<span style="font-size:16px;line-height:23px;font-weight:700">${a.perche}</span></div>`}

      ${a.fonti && a.fonti.length > 0 && html`<div class="o-col" style="margin-top:10px">
        <div aria-hidden="true" style="height:3px;background:${INK};margin-bottom:14px"></div>
        ${newsLab('Fonti', 700)}
        ${a.fonti.map((f, k) => html`<a key=${k} class="o-art-src" href=${f.url} target="_blank" rel="noopener noreferrer">
          <span class="o-grow o-col" style="gap:1px"><span class="o-t">${f.nome}</span>${f.titolo && html`<span class="o-s">${f.titolo}</span>`}</span>
          <span style="flex:none;margin-top:2px">${PathIco(D_OUT, 18, 2.4)}</span></a>`)}
        <p class="o-s" style="margin-top:12px">Sintesi preparata con l'aiuto dell'intelligenza artificiale a partire dalle fonti qui sopra. Serve a capire le notizie, non dice come investire.</p>
      </div>`}

      <div class="o-col" style="margin-top:10px">
        ${altre.length > 0 && html`<h2 class="o-h2" style="margin-bottom:4px">Le altre notizie del giorno</h2>`}
        ${altre.map(x => html`<${Row} key=${x.id} icon=${PathIco(D_NEWS, 22, 2.2)} ibg=${GIALLO} title=${x.nastro || x.titolo} sub=${`${x.cat || 'Notizie'} · ${newsMinutes(x)} min`} chev=${true}
          onClick=${() => nav.replace('articolo', { id: x.id, from })}/>`)}
        <${Row} icon=${PathIco(D_NEWS, 22, 2.2)} title="Tutte le notizie" sub="L'archivio, giorno per giorno" chev=${true} last=${true} onClick=${allNews}/>
      </div>
    </div>
  </div></div></div>`;
}

// L'archivio: tutti gli articoli, dal più recente, divisi per giorno. Quelli già letti restano segnati.
function NewsArchiveScreen({ nav }) {
  const n = useNews();
  useEffect(() => { newsIndexLoad(); }, []);
  const [days, setDays] = useState(10);
  const list = n.idx, read = newsReadSet(), groups = [];
  (list || []).forEach(a => { const g = groups[groups.length - 1]; if (g && g.day === a.data) g.items.push(a); else groups.push({ day: a.data, items: [a] }); });
  const tot = (list || []).length, letti = (list || []).filter(a => read.has(a.id)).length;
  const pill = !list ? 'Un attimo' : tot ? `${letti} ${letti === 1 ? 'letta' : 'lette'} su ${tot}` : 'Ancora vuoto';
  const ini = c => String(c || 'N').split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const okIco = html`<span role="img" aria-label="Già letta" style="width:30px;height:30px;flex:none;margin-right:4px;display:flex;align-items:center;justify-content:center;background:${MENTA};border:2px solid ${INK};border-radius:50%">${PathIco(D_CHECK, 15, 3.2)}</span>`;
  return html`<${Room} color=${GIALLO} tabs=${false} headH=${176}
    rally=${html`<${Rally} pose="telefono" alt="" style="position:absolute;right:-14px;top:calc(var(--otop) + 27px)"/>`}
    head=${html`<div class="o-rowf" style="height:44px"><${IBtn} d=${D_BACK} onClick=${nav.back} label="Indietro"/></div>
      <div class="o-col" style="align-items:flex-start;gap:12px;margin-top:22px;max-width:200px"><h1 class="o-h1m">Tutte le notizie</h1><${Pill}>${pill}<//></div>`}>
    <${Sheet} pad=${false} style=${{ paddingTop: 6, paddingBottom: 'max(28px, calc(env(safe-area-inset-bottom) + 16px))' }}>
      ${!list && html`<p class="o-body o-mut" style="margin-top:18px">${n.idxErr ? 'Non riesco a caricare le notizie. Controlla la connessione.' : 'Sto caricando le notizie.'}</p>`}
      ${!list && n.idxErr && html`<div style="margin-top:14px"><${Btn} cls="sm" bg=${GIALLO} onClick=${newsIndexLoad}>Riprova<//></div>`}
      ${list && !tot && html`<p class="o-body o-mut" style="margin-top:18px">Qui trovi tutti gli articoli, giorno per giorno. Il primo arriva presto.</p>`}
      ${groups.slice(0, days).map(g => html`<div key=${g.day} class="o-col" style="margin-top:18px">
        <div style="margin-bottom:2px">${newsLab(newsDayHead(g.day), 700)}</div>
        ${g.items.map((a, k) => { const r = read.has(a.id); return html`<${Row} key=${a.id} icon=${html`<span style="font-size:15px">${ini(a.cat)}</span>`} ibg=${r ? '#fff' : GIALLO} title=${a.titolo || a.nastro}
          sub=${`${a.cat || 'Notizie'} · ${a.min || 1} min`} right=${r ? okIco : null} chev=${!r} last=${k === g.items.length - 1} onClick=${() => nav.go('articolo', { id: a.id, from: 'archivio' })}/>`; })}
      </div>`)}
      ${groups.length > days && html`<div style="margin-top:18px"><${Btn} cls="sm flat" bg="#fff" onClick=${() => setDays(d => d + 10)}>Mostra i giorni prima<//></div>`}
    <//>
  <//>`;
}
