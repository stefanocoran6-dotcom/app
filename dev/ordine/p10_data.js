
// =====================================================================================================
// DATI: percorsi, lezioni, figurine, punteggi
// =====================================================================================================
// "Basi della finanza": primo percorso non d'esame. Contenuti originali, brevi, con un esempio numerico per lezione.
// Le lezioni stanno in basi_src.py (che le controlla e scrive basi.json): build.sh le mette qui sopra come BASI_UNITS.
const BASI = {
  id: 'basi', name: 'Basi della finanza', badge: '€', color: AZ, group: 'basi', ready: true, pace: 48,
  tagline: 'Per chi parte da zero',
  learn: ['Come lavorano interessi, inflazione e tempo', 'Cosa sono azioni, obbligazioni, fondi ed ETF', 'Quanto pesano rischio, costi e debiti', 'Come si leggono un bilancio e le notizie di economia'],
  units: BASI_UNITS.map(u => ({ id: u.id, name: u.name, sections: [{ id: u.sid, name: u.name, lessons: u.lessons }] }))
};
// Percorsi non ancora pronti: compaiono nel catalogo come "in arrivo".
const COMING = [
  { id: 'risparmio', name: 'Risparmio e budget', group: 'basi', color: MENTA, icon: 'wallet' },
  { id: 'azob', name: 'Azioni e obbligazioni', group: 'invest', color: PESCA, icon: 'trend' },
  { id: 'fondi', name: 'Fondi ed ETF', group: 'invest', color: LILLA, icon: 'pie' },
  { id: 'cfa1', name: 'CFA Level I', group: 'cert' }, { id: 'frm1', name: 'FRM Part I', group: 'cert' }, { id: 'caia1', name: 'CAIA Level I', group: 'cert' }
];

let COURSES_MEMO = null;
const losMinutes = l => { const c = l.content || {}; const n = (c.introduction || '').length + (c.sections || []).reduce((s, x) => s + (x.content || '').length, 0); return clamp(Math.round(n / 900) + (l.question ? 2 : 1), 2, 20); };
function courses() {
  if (COURSES_MEMO) return COURSES_MEMO;
  const CFA = (K && K.CFA) || {};
  const units = ['equityValuation', 'portfolioManagement', 'equity'].filter(k => CFA[k]).map(k => {
    const t = CFA[k];
    return { id: k, name: t.name, sections: t.modules.map(m => ({
      id: m.id, name: m.title, num: m.number,
      lessons: m.los.map((l, i) => ({ key: `${m.id}-${l.id}`, kind: 'los', title: K.flShortTitle(l.title), code: (l.code || `LOS ${m.number}${l.id}`).replace(/^LOS\s*/, ''), los: l, minutes: losMinutes(l) }))
    })) };
  });
  const cfa2 = { id: 'cfa2', name: 'CFA Level II', badge: 'L2', color: AZ, group: 'cert', ready: true, pace: 90, tagline: 'Per chi prepara l\'esame',
    learn: ['Valutare un\'azione con dividendi, flussi di cassa, multipli e residual income', 'ETF, modelli multifattoriali, VaR e gestione attiva', 'Domande in inglese, come all\'esame'], units };
  COURSES_MEMO = [BASI, cfa2];
  // indici utili
  COURSES_MEMO.forEach(c => { c.lessons = []; c.units.forEach((u, ui) => u.sections.forEach(s => s.lessons.forEach(l => { l.course = c; l.unit = u; l.ui = ui; l.section = s; if (!l.kind) l.kind = 'base'; c.lessons.push(l); }))); });
  return COURSES_MEMO;
}
const courseById = id => courses().find(c => c.id === id);
let LESSON_MAP = null;
const lessonByKey = key => { if (!LESSON_MAP) { LESSON_MAP = {}; courses().forEach(c => c.lessons.forEach(l => { LESSON_MAP[l.key] = l; })); } return LESSON_MAP[key]; };
const isDone = key => (K.losProgress || []).includes(key) || s2get().basi.includes(key);
const doneCount = list => list.filter(l => isDone(l.key)).length;
const coursePct = c => c.lessons.length ? Math.round(doneCount(c.lessons) / c.lessons.length * 100) : 0;
const unitLessons = u => u.sections.flatMap(s => s.lessons);
const fmtDur = min => { if (min < 60) return `${min} minuti`; const h = Math.floor(min / 60), m = min % 60; return `${h} ${h === 1 ? 'ora' : 'ore'}${m ? ` e ${m} minuti` : ''}`; };
// domande di una lezione (LOS: la domanda d'esame; basi: gli esercizi a scelta)
function lessonQuestions(l) {
  if (l.kind === 'los') return l.los.question ? [{ key: l.key, q: l.los.question.q, options: l.los.question.options, ans: l.los.question.ans, exp: l.los.question.exp, lang: 'en', lesson: l }] : [];
  return (l.ex || []).filter(e => e.type === 'mcq').map((e, i) => ({ key: l.key + (i ? '#' + i : ''), q: e.q, options: e.options, ans: e.ans, exp: e.exp, lesson: l }));
}
const allQuestions = (list) => list.flatMap(lessonQuestions);
// pagine di una lezione, in ordine
function lessonSteps(l) {
  const steps = [];
  if (l.kind === 'los') {
    const c = l.los.content || {};
    if ((c.introduction || '').trim()) steps.push({ k: 'page', title: l.title, text: c.introduction, first: true });
    (c.sections || []).forEach((s, i) => steps.push({ k: 'page', title: String(s.title || '').replace(/^\d+\.\s*/, ''), text: s.content, first: !steps.length && i === 0, head: l.title }));
    const kp = l.los.keyPoints || [], et = l.los.examTips || [];
    if (kp.length || et.length) steps.push({ k: 'recap', points: kp, tips: et });
    lessonQuestions(l).forEach(q => steps.push({ k: 'q', q }));
  } else if (l.flow) {
    // lezione a passi corti: pagine brevi alternate a cose da fare; "In breve" chiude l'ultima pagina
    const qs = lessonQuestions(l), lastPage = l.flow.map(s => s.type).lastIndexOf('page');
    l.flow.forEach((s, i) => {
      if (s.type === 'page') steps.push({ k: 'page', title: s.t, text: s.x, widget: s.widget, first: !steps.length, note: i === lastPage ? l.note : null });
      else if (s.type === 'ex') { const e = l.ex[s.i]; if (e.type === 'match') steps.push({ k: 'match', pairs: e.pairs }); else steps.push({ k: 'q', q: qs[l.ex.slice(0, s.i).filter(x => x.type === 'mcq').length] }); }
      else steps.push(Object.assign({}, s, { k: s.type, n: i }));
    });
  } else {
    (l.pages || []).forEach((p, i) => steps.push({ k: 'page', title: p.t, text: p.x, widget: p.widget, first: i === 0, note: i === l.pages.length - 1 ? l.note : null }));
    let qi = 0;
    (l.ex || []).forEach(e => { if (e.type === 'match') steps.push({ k: 'match', pairs: e.pairs }); else { steps.push({ k: 'q', q: lessonQuestions(l)[qi] }); qi++; } });
  }
  return steps;
}
// percorso attuale e prossima lezione
function startedCourses() { const s = s2get(); const out = new Set(s.started || []); if ((K.losProgress || []).length) out.add('cfa2'); if (s.basi.length) out.add('basi'); return courses().filter(c => out.has(c.id)); }
function currentCourse() {
  const s = s2get(); const st = startedCourses();
  if (s.cur && courseById(s.cur) && (st.some(c => c.id === s.cur))) return courseById(s.cur);
  return st[0] || null;
}
function nextLesson(c, unitId) {
  const s = s2get(); const album = K.albumLoad();
  let u = unitId ? c.units.find(x => x.id === unitId) : null;
  if (!u) {
    const lastKey = s.seen && s.seen[c.id]; const ll = lastKey && lessonByKey(lastKey);
    if (ll && ll.course === c) u = ll.unit;
    else { // unità della figurina presa più di recente
      let best = null; c.lessons.forEach(l => { const a = album[l.key]; if (a && (!best || a.t > best.t)) best = { t: a.t, u: l.unit }; }); u = best ? best.u : c.units[0];
    }
  }
  const order = [u, ...c.units.filter(x => x !== u)];
  for (const x of order) { const l = unitLessons(x).find(z => !isDone(z.key)); if (l) return l; }
  return null;
}
function markSeen(l) { s2set(s => ({ cur: l.course.id, started: Array.from(new Set([...(s.started || []), l.course.id])), seen: Object.assign({}, s.seen, { [l.course.id]: l.key }) })); }

// ---- punti, giorni di fila ----
const weekKey = (d = new Date()) => { const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return dayKey(x); };
function addXp(n) { if (!n) return; try { K.setStats(s => Object.assign({}, s, { xp: (s.xp || 0) + n })); } catch (e) {} const wk = weekKey(); s2set(s => ({ xp: { [wk]: ((s.xp || {})[wk] || 0) + n } })); }   // si tiene solo la settimana in corso (serve alla lega)
function streakDays() {
  const a = K.flActLoad(); let n = 0; const d = new Date();
  if (!K.flStudied(a[dayKey(d)])) d.setDate(d.getDate() - 1);
  while (K.flStudied(a[dayKey(d)])) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
const todayMinutes = () => { const a = K.flActLoad()[dayKey()] || {}; return a.min || 0; };
function examDays() { const e = LS.raw('finlearn_exam_date'); if (!e) return null; const n = Math.ceil((new Date(e + 'T09:00:00') - new Date()) / DAY); return isNaN(n) ? null : n; }

// ---- figurine ----
// stato: 'manca' | 'viva' | 'sbiadisce' | 'dorata'
function stickerState(l, album, now) {
  const a = album[l.key]; if (!a) return 'manca';
  if (s2get().gold[l.section.id]) return 'dorata';
  return now < a.due ? 'viva' : 'sbiadisce';
}
function dueLessons() { const album = K.albumLoad(), now = Date.now(); return courses().flatMap(c => c.lessons).filter(l => stickerState(l, album, now) === 'sbiadisce').sort((x, y) => album[x.key].due - album[y.key].due); }
const stickerSym = l => l.sym || l.code || '?';
const lessonEmoji = l => { if (l.kind !== 'los') return null; const ic = ((l.los.content && l.los.content.sections) || []).map(x => x.icon).find(Boolean); return ic && !String(ic).startsWith('data:') ? ic : null; };

// ---- risposte e punti deboli ----
// Ogni risposta finisce nelle statistiche storiche dell'app e, con la data, nella memoria nuova (ultime 8 per domanda).
function recordAnswer(q, ok) {
  const key = q.key.split('#')[0];
  try { K.qStatsRecord(key, ok); } catch (e) {}
  s2set(s => { const cur = (s.ans[q.key] || []).slice(-7); cur.push([Date.now(), ok ? 1 : 0]); return { ans: Object.assign({}, s.ans, { [q.key]: cur }) }; });
}
// Punteggio 0-100 per argomento: media delle risposte pesata sul tempo (una risposta di 14 giorni fa vale la metà di una di oggi),
// con due risposte "neutre" di partenza così poche domande non danno giudizi estremi. Senza ripasso il punteggio scivola verso 50.
function topicScores(c) {
  const s = s2get(), st = K.qStatsLoad(), now = Date.now(), out = [];
  c.units.forEach(u => u.sections.forEach(sec => {
    let w = 0, wok = 0, n = 0, nok = 0;
    sec.lessons.forEach(l => lessonQuestions(l).forEach(q => {
      const log = s.ans[q.key];
      if (log && log.length) log.forEach(([t, ok]) => { const k = Math.pow(0.5, (now - t) / (14 * DAY)); w += k; wok += k * ok; n++; nok += ok; });
      else { const r = st[q.key]; if (r && r.n) { const k = 0.5 * Math.min(r.n, 3); w += k; wok += k * (r.ok / r.n); n += r.n; nok += r.ok; } }
    }));
    if (n) out.push({ id: sec.id, name: sec.name, unit: u, section: sec, n, nok, score: Math.round((wok + 1) / (w + 2) * 100) });
  }));
  return out.sort((a, b) => a.score - b.score);
}
// ---- spiegazioni gratis al giorno ----
const FREE_EXPL = 3;
function explState() { const s = s2get(); const today = dayKey(); const n = s.expl && s.expl.d === today ? s.expl.n : 0; return { n, left: Math.max(0, FREE_EXPL - n), pro: !!K.isPro }; }
function spendExplanation() { const today = dayKey(); s2set(s => ({ expl: { d: today, n: (s.expl && s.expl.d === today ? s.expl.n : 0) + 1 } })); }

// ---- test ----
// kind: 'unit' (verifica di una sezione), 'level' (test di livello), 'mock' (simulazione), 'weak' (allenamento punti deboli), 'mix' (quiz misto)
function buildTest(kind, c, sec) {
  const sh = K.flShuffle;
  if (kind === 'unit') { const qs = sh(allQuestions(sec.lessons)).slice(0, 10); return { id: 'unit:' + sec.id, kind, course: c, section: sec, title: 'Verifica: ' + sec.name, qs, secs: qs.length * c.pace, pass: Math.ceil(qs.length * 0.7), timed: true }; }
  if (kind === 'level') { const qs = sh(allQuestions(c.lessons)).slice(0, 5); return { id: 'level:' + c.id, kind, course: c, title: 'Test di livello', qs, secs: qs.length * c.pace, pass: Math.ceil(qs.length * 0.6), timed: true }; }
  if (kind === 'mock') { const qs = sh(allQuestions(c.lessons)).slice(0, 44); return { id: 'mock:' + c.id, kind, course: c, title: 'Simulazione d\'esame', qs, secs: qs.length * 180, pass: Math.ceil(qs.length * 0.7), timed: true }; }
  return null;
}
function saveTest(t, res, secs) {
  const ok = res.filter(r => r && r.ok).length; const passed = ok >= t.pass; const per = {};
  t.qs.forEach((q, i) => { const sec = q.lesson.section; per[sec.id] = per[sec.id] || { name: sec.name, ok: 0, n: 0 }; per[sec.id].n++; if (res[i] && res[i].ok) per[sec.id].ok++; });
  const rec = { ok, n: t.qs.length, secs, t: Date.now(), passed, title: t.title };
  s2set(s => ({ tests: Object.assign({}, s.tests, { [t.id]: Object.assign({}, rec, { best: Math.max(ok, (s.tests[t.id] && s.tests[t.id].best) || 0), passedEver: passed || !!(s.tests[t.id] && s.tests[t.id].passedEver) }), _last: Object.assign({ id: t.id }, rec) }) }));
  if (passed && t.kind === 'unit') { // figurine dorate: quelle già prese non sbiadiscono per il periodo più lungo
    s2set(s => ({ gold: Object.assign({}, s.gold, { [t.section.id]: Date.now() }) }));
    try { const a = K.albumLoad(), now = Date.now(); let ch = false; t.section.lessons.forEach(l => { if (a[l.key]) { a[l.key].step = K.FL_STEPS.length - 1; a[l.key].due = now + K.FL_STEPS[K.FL_STEPS.length - 1] * DAY; ch = true; } }); if (ch) K.albumSave(a); } catch (e) {}
  }
  return Object.assign({ per: Object.values(per) }, rec);
}

// ---- lega e sfide: avversari simulati finché non ci sono gli account online ----
const RIVALS = ['Giulia', 'Luca', 'Marco', 'Sara', 'Paolo', 'Elena', 'Davide', 'Chiara', 'Matteo'];
const seedRnd = seed => { let x = 0; for (let i = 0; i < seed.length; i++) x = (x * 31 + seed.charCodeAt(i)) >>> 0; return () => { x = (x * 1664525 + 1013904223) >>> 0; return x / 4294967296; }; };
function league() {
  const wk = weekKey(), start = new Date(wk + 'T00:00:00').getTime(), frac = clamp((Date.now() - start) / (7 * DAY), 0.02, 1);
  const mine = (s2get().xp || {})[wk] || 0;
  const rows = RIVALS.map((name, i) => { const r = seedRnd(wk + name); const target = 180 + Math.round(r() * 640); return { name, xp: Math.round(target * Math.pow(frac, 0.85) / 2) * 2 }; });
  rows.push({ name: 'Tu', xp: mine, me: true });
  rows.sort((a, b) => b.xp - a.xp || (a.me ? -1 : 1));
  rows.forEach((r, i) => { r.pos = i + 1; });
  return { rows, me: rows.find(r => r.me), name: 'Lega Azzurra' };
}
function duelRival() { const wk = weekKey(), r = seedRnd(wk + 'duel' + (s2get().duel.w + s2get().duel.l)); return RIVALS[Math.floor(r() * RIVALS.length)]; }
