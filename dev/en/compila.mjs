// Genera ordine_en.js (l'app in inglese americano) a partire da ordine.js (l'app in italiano), senza toccare il codice italiano.
//   1. applica le correzioni a mano di dev/en/patch_en.mjs (dove la frase inglese ha un altro ordine di parole o il codice cambia);
//   2. trova tutte le frasi (testi dentro i modelli html``, stringhe, attributi visibili) e le sostituisce con quelle del
//      dizionario dev/en/ui_en.txt ("frase italiana ⇒ English phrase", una per riga);
//   3. mette le lezioni in inglese (dev/en/basi_en.json) al posto di BASI_UNITS e il glossario inglese al posto di quello italiano;
//   4. scrive ordine_en.js e l'elenco delle frasi italiane rimaste senza traduzione.
// Uso:  node dev/en/compila.mjs [--scheletro] [--scrivi]
//   senza opzioni: solo il rapporto (frasi mancanti, correzioni che non trovano il punto, frasi del dizionario mai usate)
//   --scheletro:   scrive dev/en/lavoro/da_tradurre.txt (le frasi che mancano) e lavoro/chiavi.json (tutte)
//   --scrivi:      scrive anche ordine_en.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as acorn from 'acorn';
import * as walk from 'acorn-walk';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const SRC = path.join(ROOT, 'ordine.js');
const OUT = path.join(ROOT, 'ordine_en.js');
const DIZ = path.join(HERE, 'ui_en.txt');
const args = process.argv.slice(2);
const IO = process.argv[1] && process.argv[1].endsWith('compila.mjs');   // false quando lo importano gli script di servizio

const srcOrig = fs.readFileSync(SRC, 'utf8');

// ---------- le parti, nell'ordine di build.sh (servono solo per dire dove sta una frase) ----------
const PARTI = ['p00_base.js', null, 'p10_data.js', 'p20_ui.js', 'p30_learn.js', 'p35_steps.js', 'p37_news.js', 'p40_train.js', 'p44_motore.js', 'p45_serie.js', 'p50_more.js', 'p55_live.js', 'p60_start.js', 'p90_app.js'];
// Le parti si ritrovano nel testo (anche dopo le correzioni) cercando l'inizio di ciascuna.
function offsetParti(testo) {
  const D = path.join(ROOT, 'dev', 'ordine'), out = []; let cur = 0;
  for (const p of PARTI) {
    const t = p ? fs.readFileSync(path.join(D, p), 'utf8') : '\n// Lezioni di "Basi della finanza" (generate da dev/ordine/basi_src.py)\nconst BASI_UNITS = ';
    const k = testo.indexOf(t.slice(0, 260), cur); if (k < 0) return null;   // le prime righe di tante parti sono uguali (la riga di =====): servono più caratteri
    out.push({ nome: p || 'basi.json', da: k }); cur = k + 1;
  }
  out.forEach((x, i) => { x.a = i + 1 < out.length ? out[i + 1].da : testo.length; });
  return out;
}
// ---------- correzioni a mano ----------
let PATCH = [];
try { PATCH = (await import('./patch_en.mjs')).default; } catch (e) { if (!/Cannot find module|ERR_MODULE_NOT_FOUND/.test(String(e))) throw e; }
const errori = [];
function applicaPatch(testo) {
  // Ogni correzione: [vecchio, nuovo] oppure [vecchio, nuovo, n] (n = quante volte deve comparire, di solito 1).
  // Le posizioni (per dire "in che parte sta") si calcolano sul testo originale: qui si lavora in ordine di posizione.
  let t = testo;
  PATCH.forEach((p, i) => {
    const [vecchio, nuovo, n = 1] = p;
    if (vecchio instanceof RegExp) {   // il "vecchio" può essere anche un'espressione regolare (utile per righe lunghe)
      const re = new RegExp(vecchio.source, vecchio.flags.includes('g') ? vecchio.flags : vecchio.flags + 'g'), c = (t.match(re) || []).length;
      if (c !== n) { errori.push(`correzione ${i + 1}: l'espressione compare ${c} volte invece di ${n}: ${vecchio.source.slice(0, 70)}`); return; }
      t = t.replace(re, () => nuovo); return;
    }
    let c = 0, k = -1; while ((k = t.indexOf(vecchio, k + 1)) >= 0) c++;
    if (c !== n) { errori.push(`correzione ${i + 1}: il testo compare ${c} volte invece di ${n}: ${vecchio.slice(0, 70).replace(/\n/g, '↵')}`); return; }
    t = t.split(vecchio).join(nuovo);
  });
  return t;
}
const src = applicaPatch(srcOrig);
// Il testo che entra con le correzioni è già inglese: le sue frasi non vanno cercate né nel dizionario né tra quelle da tradurre.
const PATCH_RANGES = [];
PATCH.forEach(p => { const nuovo = p[1]; if (typeof nuovo !== 'string' || nuovo.length < 2) return; let k = -1; while ((k = src.indexOf(nuovo, k + 1)) >= 0) PATCH_RANGES.push([k, k + nuovo.length]); });
const daPatch = (a, b) => PATCH_RANGES.some(r => a >= r[0] && b <= r[1]);
const PARTI_OFF = offsetParti(src);
const parteDi = pos => { if (!PARTI_OFF) return '?'; const p = PARTI_OFF.find(x => pos >= x.da && pos < x.a); return p ? p.nome : '?'; };

// ---------- dizionario ----------
const norm = s => s.replace(/\s+/g, ' ').trim();
const hashDi = s => { let h = 5381; for (const c of s) h = ((h << 5) + h + c.charCodeAt(0)) >>> 0; return h.toString(36).padStart(6, '0').slice(-6); };
function leggiDizionario() {
  const m = new Map(); if (!fs.existsSync(DIZ)) return m;
  fs.readFileSync(DIZ, 'utf8').split('\n').forEach((r, i) => {
    if (!r.trim() || r.startsWith('#')) return;
    const k = r.indexOf(' ⇒ '); if (k < 0) throw new Error(`ui_en.txt riga ${i + 1}: manca " ⇒ "`);
    const it = norm(r.slice(0, k).replace(/\\n/g, '\n')), en = r.slice(k + 3).replace(/\\n/g, '\n').trim();
    if (m.has(it) && m.get(it) !== en) throw new Error(`ui_en.txt riga ${i + 1}: frase doppia con traduzioni diverse: ${it}`);
    m.set(it, en);
  });
  return m;
}
const DIZIONARIO = leggiDizionario();
const usate = new Set();
// Una frase può avere traduzioni diverse a seconda di dove sta: "html|minuti" vale solo per il testo dentro un modello html``,
// "lit|…" solo per le stringhe tra apici, "tpl|…" per i modelli con `…`, "attr|…" per gli attributi. Senza prefisso vale per tutti.
const chiaveDi = (u, k = norm(u.key)) => DIZIONARIO.has(u.kind + '|' + k) ? u.kind + '|' + k : k;
const traduzioneDi = u => DIZIONARIO.get(chiaveDi(u));

// ---------- classificazione: testo da tradurre, codice (classi, stili, id…) o dubbio ----------
const haLettere = s => /[A-Za-zÀ-ÿ]{2,}/.test(s.replace(/\{\d+\}/g, ''));
const PAROLE_IT = new Set('il lo la le gli i un una uno di da in su per con che non del della dei delle nel nella nei nelle sono hai ho è e o a mi ti si ci ne al alla ai alle più già come cosa quando dove quanto quale quali tuo tua tuoi tue mio mia miei mie suo sua questo questa questi queste quello quella ogni tutti tutto tutte anche solo ancora molto poco meno prima dopo senza sopra sotto fra tra verso dal dalla dai dalle sul sulla sui sulle col coi mai sempre oggi ieri domani qui qua lì là allora però ma se perché quindi così bene male meglio peggio cioè ecco ora adesso poi invece oppure né nemmeno neanche'.split(' '));
const ATTR_CODICE = new Set(['class', 'className', 'style', 'id', 'type', 'role', 'href', 'src', 'viewBox', 'd', 'fill', 'stroke', 'points', 'width', 'height', 'x', 'y', 'cx', 'cy', 'r', 'rx', 'ry', 'transform', 'xmlns', 'for', 'name', 'key', 'ref', 'inputmode', 'autocomplete', 'tabindex', 'target', 'rel', 'cls', 'lang', 'aria-current', 'aria-checked', 'aria-hidden', 'aria-live', 'aria-pressed', 'aria-expanded', 'aria-selected', 'aria-modal', 'aria-haspopup', 'aria-controls', 'pose', 'bg', 'color', 'variant', 'stroke-linecap', 'stroke-linejoin', 'stroke-width', 'fill-rule', 'clip-rule', 'preserveAspectRatio', 'loading', 'decoding', 'crossorigin', 'media', 'method', 'action', 'autofocus', 'enterkeyhint', 'pattern', 'min', 'max', 'step', 'value', 'dir']);
const CSS_RE = /^(?:[-a-z]+\s*:\s*[^;]*;?\s*)+$/;
const CODICE_TOK = /^[a-z][a-z0-9_-]*$/;
function classifica(key, u) {
  const k = key.replace(/\{\d+\}/g, '').trim();
  if (!haLettere(key)) return 'codice';
  if (/^#[0-9a-fA-F]{3,8}$/.test(k) || /^https?:/.test(k) || (/^[MmLlHhVvCcSsQqTtAaZz0-9 ,.\-]+$/.test(k) && /[0-9]/.test(k))) return 'codice';   // i dati di un tracciato svg hanno cifre ("Salva" no)
  if (u.kind === 'attr' && ATTR_CODICE.has(u.dove)) return 'codice';
  if (/[;]/.test(k) && /:/.test(k)) return 'codice';
  if (CSS_RE.test(k) || /^[.#]?[\w-]+[{(]/.test(k) || /^[.#][\w-]+\s*\{/.test(k) || /\)\s*$/.test(k) && /^[a-z-]+\(/.test(k)) return 'codice';   // translate(…), .classe {…}: "Automatico (gratis)" invece è testo
  const toks = k.split(/\s+/);
  if (toks.every(t => CODICE_TOK.test(t)) && toks.some(t => /[-_0-9]/.test(t)) && !toks.some(w => PAROLE_IT.has(w))) return 'codice';   // elenchi di classi tipo "o-btn lg"
  if (/[àèéìòùÀÈÉÌÒÙ]/.test(k)) return 'testo';
  if (toks.length > 1 && toks.some(w => PAROLE_IT.has(w.toLowerCase()))) return 'testo';
  if (/^[A-ZÀ-Ý]/.test(k) && /[a-zà-ÿ]{2,}/.test(k)) return 'testo';
  if (toks.length > 1 && /[A-Za-zÀ-ÿ]{3,}/.test(k) && !/[=<>_]/.test(k)) return 'forse';
  if (toks.length === 1 && CODICE_TOK.test(k) && !/[-_0-9]/.test(k)) return 'forse';
  return 'codice';
}

// ---------- analisi ----------
const ast = acorn.parse(src, { ecmaVersion: 'latest', sourceType: 'module' });
const SALTA = []; let BASI_DECL = null;   // le lezioni inline e il glossario non si leggono frase per frase: si sostituiscono per intero
for (const n of ast.body) {
  const nome = n.type === 'VariableDeclaration' && n.declarations[0].id && n.declarations[0].id.name;
  if (nome === 'BASI_UNITS') BASI_DECL = n;
  if (nome === 'BASI_UNITS' || nome === 'GLOSS_DEF' || nome === 'GLOSS_ALIAS' || nome === 'GEN') SALTA.push([n.start, n.end]);   // GEN (p44_motore.js) ha già dentro le sue lingue
}
const dentroSalta = n => SALTA.some(r => n.start >= r[0] && n.end <= r[1]);

const unita = [];   // { kind:'html'|'lit'|'tpl'|'attr', key, start, end, holes:[{start,end}], dove, escape, valore?, classe, parte }
// Nella versione inglese non si raggiungono le notizie e le schermate dell'esame CFA: le loro frasi restano in italiano e non si contano tra quelle da tradurre.
const IGNORA_PARTI = new Set(['p37_news.js']);
const IGNORA_FUNZIONI = new Set([]);
const IGNORA = [];
for (const n of ast.body) if (n.type === 'FunctionDeclaration' && IGNORA_FUNZIONI.has(n.id.name)) IGNORA.push([n.start, n.end]);
function aggiungi(u) {
  u.parte = parteDi(u.start);
  u.perPatch = daPatch(u.start, u.end);
  const fuori = u.perPatch || IGNORA_PARTI.has(u.parte) || IGNORA.some(r => u.start >= r[0] && u.end <= r[1]);
  u.classe = fuori ? 'codice' : classifica(norm(u.key), u); unita.push(u);
}
function pezzi(tpl) {
  const out = [];
  tpl.quasis.forEach((q, i) => {
    out.push({ t: 'x', raw: q.value.raw, start: q.start });
    if (i < tpl.expressions.length) out.push({ t: 'h', start: q.end, end: tpl.quasis[i + 1].start });
  });
  return out;
}
function nuovaCorsa(tipo, dove) { return { tipo, dove, items: [] }; }
function chiudiCorsa(c) {
  if (!c || !c.items.length) return;
  const it = c.items, isWs = x => x.t === 'c' && /\s/.test(x.ch);
  let a = 0, b = it.length; while (a < b && isWs(it[a])) a++; while (b > a && isWs(it[b - 1])) b--;
  if (a >= b) return;
  let key = '', holes = [], esc = false, prevWs = false;
  for (let k = a; k < b; k++) {
    const x = it[k];
    if (x.t === 'h') { key += `{${holes.length}}`; holes.push({ start: x.start, end: x.end }); prevWs = false; }
    else if (/\s/.test(x.ch)) { if (!prevWs) key += ' '; prevWs = true; }
    else { key += x.ch; prevWs = false; if (x.ch === '\\') esc = true; }
  }
  const first = it[a], last = it[b - 1];
  const start = first.t === 'h' ? first.start : first.pos, end = last.t === 'h' ? last.end : last.pos + 1;
  if (!haLettere(key)) return;
  aggiungi({ kind: c.tipo, key, start, end, holes, dove: c.dove, escape: esc, q: c.q });
}
function analizzaHtml(tpl) {
  const ps = pezzi(tpl);
  let stato = 'testo', quote = null, corsa = nuovaCorsa('html'), attr = null, nomeAttr = '', letto = '';
  const chiudi = () => { chiudiCorsa(corsa); corsa = nuovaCorsa('html'); };
  for (const p of ps) {
    if (p.t === 'h') {
      if (stato === 'testo') corsa.items.push({ t: 'h', start: p.start, end: p.end });
      else if (stato === 'tag' && quote && attr) attr.items.push({ t: 'h', start: p.start, end: p.end });
      continue;
    }
    for (let k = 0; k < p.raw.length; k++) {
      const ch = p.raw[k], pos = p.start + k;
      if (stato === 'testo') {
        if (ch === '<' && /[A-Za-z$\/!]/.test(p.raw[k + 1] || '$')) { chiudi(); stato = 'tag'; quote = null; attr = null; nomeAttr = ''; letto = ''; }
        else corsa.items.push({ t: 'c', ch, pos });
      } else if (quote) {
        if (ch === quote) { if (attr) chiudiCorsa(attr); attr = null; quote = null; nomeAttr = ''; letto = ''; }
        else if (attr) attr.items.push({ t: 'c', ch, pos });
      } else if (ch === '"' || ch === "'") { quote = ch; attr = nuovaCorsa('attr', nomeAttr); attr.q = ch; }
      else if (ch === '>') { stato = 'testo'; corsa = nuovaCorsa('html'); letto = ''; nomeAttr = ''; }
      else if (ch === '=') { nomeAttr = letto; letto = ''; }
      else if (/\s/.test(ch)) letto = '';
      else letto += ch;
    }
  }
  chiudi();
}
const htmlTpl = new Set();
walk.full(ast, (n) => {
  if (dentroSalta(n)) return;
  if (n.type === 'TaggedTemplateExpression' && n.tag.type === 'Identifier' && n.tag.name === 'html') { htmlTpl.add(n.quasi); analizzaHtml(n.quasi); }
});
walk.fullAncestor(ast, (n, _s, anc) => {
  if (dentroSalta(n)) return;
  const par = anc[anc.length - 2];
  if (n.type === 'Literal' && typeof n.value === 'string') {
    if (par && ((par.type === 'ImportDeclaration' || par.type === 'ExportNamedDeclaration' || par.type === 'ExportAllDeclaration') && par.source === n)) return;
    if (par && par.type === 'Property' && par.key === n && !par.computed) return;
    if (par && par.type === 'ExpressionStatement') return;
    if (!haLettere(n.value)) return;
    aggiungi({ kind: 'lit', key: norm(n.value), valore: n.value, start: n.start, end: n.end, holes: [], dove: par ? par.type : '', escape: false });
  }
  if (n.type === 'TemplateLiteral' && !htmlTpl.has(n)) {
    if (par && par.type === 'TaggedTemplateExpression') return;
    const c = nuovaCorsa('tpl', '');
    pezzi(n).forEach(p => { if (p.t === 'h') c.items.push({ t: 'h', start: p.start, end: p.end }); else for (let k = 0; k < p.raw.length; k++) c.items.push({ t: 'c', ch: p.raw[k], pos: p.start + k }); });
    chiudiCorsa(c);
  }
});

// ---------- sostituzione ----------
const edits = [], avvisi = [];
const lineaDi = pos => src.slice(0, pos).split('\n').length;
function escLit(s, q) { return s.replace(/\\/g, '\\\\').replace(new RegExp(q, 'g'), '\\' + q).replace(/\n/g, '\\n'); }
function escTpl(s) { return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${'); }
// applica le modifiche comprese tra lo e hi (le più interne le gestisce chi le contiene)
function applicaEdits(lo, hi) {
  let pos = lo, out = '';
  for (const e of edits) {
    if (e.start < lo || e.end > hi) continue;
    if (e.start < pos) { if (e.end > pos) throw new Error('modifiche sovrapposte a ' + e.start); continue; }
    out += src.slice(pos, e.start) + e.render(); pos = e.end;
  }
  return out + src.slice(pos, hi);
}
function creaEdit(u, en) {
  if (u.kind === 'lit') {
    const q = src[u.start], v = u.valore, pre = v.match(/^\s*/)[0], post = v.length > pre.length ? v.match(/\s*$/)[0] : '';
    if (/[\u2028\u2029]/.test(en)) throw new Error('caratteri strani in ' + en);
    return { start: u.start, end: u.end, render: () => q + escLit(pre + en + post, q) + q };
  }
  const q = u.kind === 'attr' ? u.q : null;
  if (u.kind === 'attr' && en.includes(q)) { avvisi.push(`riga ${lineaDi(u.start)}: la traduzione contiene il segno ${q} dentro un attributo: ${en}`); return null; }
  const idx = [...en.matchAll(/\{(\d+)\}/g)].map(m => +m[1]);
  if (idx.some(i => i >= u.holes.length)) { errori.push(`riga ${lineaDi(u.start)}: la traduzione usa un buco che non c'è: ${en}`); return null; }
  const persi = u.holes.map((_, i) => i).filter(i => !idx.includes(i));
  if (persi.length) avvisi.push(`riga ${lineaDi(u.start)}: nella traduzione manca il buco ${persi.map(i => '{' + i + '}').join(' ')}: ${norm(u.key)}  =>  ${en}`);
  return { start: u.start, end: u.end, render: () => en.split(/(\{\d+\})/).map(p => { const m = p.match(/^\{(\d+)\}$/); if (m) { const h = u.holes[+m[1]]; return applicaEdits(h.start, h.end); } return u.kind === 'attr' ? p : escTpl(p); }).join('') };
}
const leggiJson = f => { const p = path.join(HERE, f); return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null; };
function sostituisciDati() {
  // le lezioni: BASI_UNITS diventa quello in inglese, con l'etichetta (A, B, C, E) di ogni lezione per la scelta del paese
  const basi = leggiJson('basi_en.json'), lez = leggiJson('lezioni.json');
  if (basi && BASI_DECL) {
    const lab = {}; (Array.isArray(lez) ? lez : Object.values(lez.lezioni || lez)).forEach(l => { lab[l.id || l.key] = l.etichetta; });
    // le unità di misura dei cursori e dei calcoli (unit='anni'...) restano italiane nei file di traduzione: qui diventano inglesi
    const UNITA = { anni: 'years', mesi: 'months', caffè: 'coffees', quote: 'shares', persone: 'people', punti: 'points', società: 'companies' };
    const unitaEn = o => { if (Array.isArray(o)) o.forEach(unitaEn); else if (o && typeof o === 'object') for (const k of Object.keys(o)) { if (k === 'unit' && typeof o[k] === 'string' && UNITA[o[k]]) o[k] = UNITA[o[k]]; else unitaEn(o[k]); } };
    unitaEn(basi);
    // le sigle delle figurine sono abbreviazioni italiane (AZ = azioni, SP = stato patrimoniale...): in inglese hanno la loro sigla
    const SIGLE = { AZ: 'STK', OB: 'BND', CC: 'ACC', TAN: 'APR', SP: 'BS', CE: 'IS', BC: 'CB', META: 'GOAL', AS: 'INS', FR: 'DED', RC: 'COV', VITA: 'LIFE', PAC: 'DCA', 'N.1': '#1', CASA: 'HOME', PIL: 'GDP', BTP: 'SPR', MIB: 'IDX' };
    basi.forEach(u => u.lessons.forEach(l => { l.lab = lab[l.key] || 'B'; if (SIGLE[l.sym]) l.sym = SIGLE[l.sym]; }));
    edits.push({ start: BASI_DECL.start, end: BASI_DECL.end, render: () => 'const BASI_UNITS = ' + JSON.stringify(basi) + ';' });
  }
  // il glossario: dalle voci di glossario_en.json (scritto da glossario.py) si ricavano GLOSS_DEF e GLOSS_ALIAS
  const gl = costruisciGlossario(leggiJson('glossario_en.json'));
  if (gl) for (const n of ast.body) {
    if (n.type !== 'VariableDeclaration') continue;
    const nome = n.declarations[0].id && n.declarations[0].id.name;
    // le cifre del glossario sono in €: per gli Stati Uniti diventano $ come nelle lezioni
    if (nome === 'GLOSS_DEF') edits.push({ start: n.start, end: n.end, render: () => 'const GLOSS_DEF = (d => COUNTRY === \'US\' ? usDollars(d) : d)(' + JSON.stringify(gl.def) + ');' });
    if (nome === 'GLOSS_ALIAS') edits.push({ start: n.start, end: n.end, render: () => 'const GLOSS_ALIAS = ' + JSON.stringify(gl.alias) + ';' });
  }
}
// Chiave di ricerca delle voci: la stessa di glossKey nell'app (minuscolo, senza punteggiatura, spazi singoli)
const normGloss = t => String(t || '').toLowerCase().replace(/[.,;:!?()«»“”]/g, '').replace(/\s+/g, ' ').trim();
function costruisciGlossario(gl) {
  if (!gl) return null;
  if (gl.def) return { def: gl.def, alias: gl.alias || {} };   // forma già pronta
  const termini = (leggiJson('termini.json') || {}).termini || {};
  const def = {}, alias = {}, nessuno = new Set((gl._nessun_rimando || []).map(normGloss));
  const voci = Object.entries(gl).filter(([k]) => k[0] !== '_');
  for (const [k, e] of voci) def[normGloss(k)] = [e.titolo, e.testo];
  for (const [k, e] of voci) {
    const t = termini[e.it]; if (!t) { errori.push('glossario: voce italiana sconosciuta ' + e.it); continue; }
    for (const f of [t.en, ...(t.anche || [])].map(normGloss)) if (f !== normGloss(k) && !def[f] && !alias[f] && !nessuno.has(f)) alias[f] = normGloss(k);
  }
  for (const [f, k] of Object.entries(gl._alias || {})) { if (!def[normGloss(k)]) errori.push('glossario: rimando a voce inesistente ' + f + ' -> ' + k); else alias[normGloss(f)] = normGloss(k); }
  // una forma che è anche una voce non può essere un rimando
  for (const f of Object.keys(alias)) if (def[f]) delete alias[f];
  return { def, alias };
}
function costruisci() {
  sostituisciDati();
  for (const u of unita) {
    const k = norm(u.key), en = traduzioneDi(u); if (en == null) continue;
    usate.add(chiaveDi(u, k));
    if (en === '=') continue;
    if (u.escape) { avvisi.push(`riga ${lineaDi(u.start)}: il testo ha segni di escape, va corretto a mano: ${k}`); continue; }
    const e = creaEdit(u, en); if (e) edits.push(e);
  }
  edits.sort((a, b) => a.start - b.start || b.end - a.end);
}

export { unita, src, norm, hashDi, parteDi, haLettere, DIZIONARIO, errori, chiaveDi, traduzioneDi };

if (IO) {
  costruisci();
  const mancano = [], viste = new Set(), tutte = {};
  for (const u of unita) {
    if (u.classe === 'codice') continue;
    const k = norm(u.key); tutte[hashDi(k)] = k;
    if (DIZIONARIO.has(chiaveDi(u, k))) continue;
    if (viste.has(k)) continue; viste.add(k); mancano.push(u);
  }
  const inutili = [...DIZIONARIO.keys()].filter(k => !usate.has(k));
  console.log(`frasi trovate: ${unita.length}, nel dizionario: ${usate.size}, ancora da tradurre: ${mancano.length}${errori.length ? ', ERRORI: ' + errori.length : ''}`);
  if (args.includes('--fuori')) { console.log('testi dentro le correzioni (si presumono già inglesi):'); const v = new Set(); for (const u of unita) if (u.perPatch && haLettere(u.key)) { const k = u.kind + ' ' + norm(u.key).slice(0, 110); if (!v.has(k)) { v.add(k); console.log('  ' + k); } } }
  if (inutili.length) console.log(`frasi del dizionario che non compaiono nel codice: ${inutili.length}` + (args.includes('--inutili') ? '\n  ' + inutili.slice(0, 80).join('\n  ') : ' (--inutili per l\'elenco)'));
  errori.slice(0, 20).forEach(e => console.log('  ERRORE ' + e));
  if (args.includes('--avvisi')) avvisi.slice(0, 80).forEach(e => console.log('  avviso ' + e)); else if (avvisi.length) console.log(`avvisi: ${avvisi.length} (--avvisi per l'elenco)`);
  if (args.includes('--scheletro')) {
    fs.mkdirSync(path.join(HERE, 'lavoro'), { recursive: true });
    const righe = mancano.map(u => `${hashDi(norm(u.key))} | ${u.parte.replace('.js', '')} | ${u.classe[0]}${u.kind === 'attr' ? '@' + u.dove : ''} | ${norm(u.key).replace(/\n/g, '\\n')}`);
    fs.writeFileSync(path.join(HERE, 'lavoro', 'da_tradurre.txt'), righe.join('\n') + '\n');
    const prev = fs.existsSync(path.join(HERE, 'lavoro', 'chiavi.json')) ? JSON.parse(fs.readFileSync(path.join(HERE, 'lavoro', 'chiavi.json'), 'utf8')) : {};
    fs.writeFileSync(path.join(HERE, 'lavoro', 'chiavi.json'), JSON.stringify(Object.assign(prev, tutte)));
    console.log('scritto lavoro/da_tradurre.txt');
  }
  if (args.includes('--scrivi')) {
    if (errori.length) { console.log('NON scrivo ordine_en.js: ci sono errori'); process.exit(1); }
    let out = applicaEdits(0, src.length);
    fs.writeFileSync(OUT, out);
    console.log(`scritto ${path.relative(ROOT, OUT)} (${out.length} caratteri)`);
  }
}
