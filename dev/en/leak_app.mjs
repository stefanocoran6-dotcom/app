// Cerca le frasi italiane di app.js che non sono avvolte in L('italiano', 'English') e che potrebbero arrivare all'interfaccia inglese.
// Uso: node dev/en/leak_app.mjs [da] [a]   (righe di app.js; di norma si guardano le parti raggiungibili in inglese)
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const HERE = path.dirname(new URL(import.meta.url).pathname);
const acorn = createRequire(HERE + '/')('acorn');
const file = path.join(HERE, '..', '..', 'app.js');
const src = fs.readFileSync(file, 'utf8');
const ast = acorn.parse(src, { ecmaVersion: 'latest', sourceType: 'module', locations: true });
const da = +(process.argv[2] || 0), a = +(process.argv[3] || 1e9);
const IT = new Set(('il lo gli una uno di da su tra fra ed ma che non più anche già ancora sono sei hai ho ci mi ti si del della dei delle nel nella nei nelle sul sulla alla alle agli quello quella questo questa questi queste quando dove perché perchè solo tutto tutti tutte ogni molto poco troppo tanto due tre quattro cinque sette otto nove dieci '
  + 'stato stata essere avere fare fatto fai puoi può posso vuoi vuole voglio devi deve cosa cose così bene male oggi ieri domani adesso poi prima dopo sempre mai ecco vai vieni torna tocca scegli scrivi leggi apri chiudi salva annulla conferma continua riprova '
  + 'lezione lezioni domanda domande risposta risposte impara allenati sfide profilo impostazioni gratis soldi mese mesi anno anni giorno giorni settimana settimane ore minuti indietro avanti inizio entra esci accedi registrati cerca invia modifica elimina vuoto vuota '
  + 'gruppo corso corsi esame livello punti punteggio serie striscia figurine figurina unità percorso obiettivo obiettivi capito sbagliato giusto giusta sbagliata corretto corretta errore errori bravo brava complimenti insieme senza dalla dalle degli sugli '
  + 'quindi infatti però inoltre oppure finché mentre quanto quanti quanta quante qual quale quali chi cui dentro fuori sopra sotto verso circa invece dunque allora semplice esempio numeri trucco ricordarlo interrogami spiegami spiegamelo fammi dammi rifammi conti passo').split(/\s+/));
const SOLO_UI = new Set('indietro avanti chiudi salva annulla conferma continua riprova impara allenati sfide profilo impostazioni gratis soldi lezione lezioni domanda domande risposta risposte esci entra accedi registrati cerca invia modifica elimina tutti vuoto'.split(' '));
const ACC = /[àèéìòù]/;
function sospetto(t) {
  if (!/[A-Za-zÀ-ÿ]{2,}/.test(t)) return null;
  if (/^[a-z][A-Za-z0-9_\-:.\/#\[\]]*$/.test(t) && !SOLO_UI.has(t.toLowerCase())) return null;
  if (/^https?:|^[\w.-]+\.(js|json|png|svg|webp|mp3|css)\b|^[#.\/]|^\d/.test(t)) return null;
  const parole = (t.toLowerCase().match(/[a-zàèéìòù]+/g) || []);
  const hit = new Set(parole.filter(w => IT.has(w)));
  if (ACC.test(t.replace(/[–—]/g, ''))) parole.filter(w => ACC.test(w)).forEach(w => hit.add(w));
  return hit.size ? [...hit].slice(0, 6).join(',') : null;
}
const out = [];
function walk(n, parent, fn) {
  if (!n || typeof n.type !== 'string') return;
  const line = n.loc.start.line;
  if (n.type === 'FunctionDeclaration' && n.id) fn = n.id.name;
  if (n.type === 'VariableDeclarator' && n.id && n.id.name && n.init && /Function|Arrow/.test(n.init.type)) fn = n.id.name;
  const isL = parent && parent.type === 'CallExpression' && parent.callee.type === 'Identifier' && parent.callee.name === 'L';
  if (isL) return;                                   // L('it','en'): già bilingue
  if (n.type === 'Literal' && typeof n.value === 'string' && !(parent && (parent.type === 'ImportDeclaration' || (parent.type === 'Property' && parent.key === n && !parent.computed)))) { if (line >= da && line <= a) { const m = sospetto(n.value); if (m) out.push([line, fn, m, n.value.replace(/\s+/g, ' ').slice(0, 110)]); } }
  if (n.type === 'TemplateLiteral') { if (line >= da && line <= a) { const t = n.quasis.map(q => q.value.cooked).join(' ◇ '); const m = sospetto(t); if (m) out.push([line, fn, m, t.replace(/\s+/g, ' ').slice(0, 110)]); } }
  for (const k in n) { const v = n[k]; if (Array.isArray(v)) v.forEach(c => walk(c, n, fn)); else if (v && typeof v.type === 'string') walk(v, n, fn); }
}
walk(ast, null, '');
const visti = new Set();
for (const o of out) { const k = o[3]; if (visti.has(k)) continue; visti.add(k); console.log(`${o[0]} (${o[1]}) {${o[2]}} ${o[3]}`); }
console.error(`sospetti: ${visti.size}`);
