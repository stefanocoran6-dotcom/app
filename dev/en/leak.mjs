// Cerca le parole italiane rimaste nel pacchetto inglese (ordine_en.js): frasi, attributi e testi dei template html.
// Uso: node dev/en/leak.mjs [file] [--tutto]   (--tutto mostra anche le parti nascoste in inglese: notizie, sfide)
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const HERE = path.dirname(new URL(import.meta.url).pathname);
const acorn = createRequire(HERE + '/')('acorn');
const file = process.argv.find((a, i) => i > 1 && !a.startsWith('--')) || path.join(HERE, '..', '..', 'ordine_en.js');
const tutto = process.argv.includes('--tutto');
const src = fs.readFileSync(file, 'utf8');
const ast = acorn.parse(src, { ecmaVersion: 'latest', sourceType: 'module' });
const lineOf = i => src.slice(0, i).split('\n').length;

// le parti che in inglese non si raggiungono (notizie, sfide): le loro dichiarazioni si saltano
const nomiDi = f => { const t = fs.readFileSync(path.join(HERE, '..', 'ordine', f), 'utf8'); const a = acorn.parse(t, { ecmaVersion: 'latest', sourceType: 'module' }); const out = new Set();
  a.body.forEach(n => { if (n.type === 'FunctionDeclaration' || n.type === 'ClassDeclaration') out.add(n.id.name); if (n.type === 'VariableDeclaration') n.declarations.forEach(d => d.id.name && out.add(d.id.name)); }); return out; };
const SALTA = new Set([...nomiDi('p37_news.js'), ...nomiDi('p55_live.js'), 'SfideScreen', 'DuelRun', 'DuelDone', 'duelQuestions']);

// parole italiane che non possono essere inglesi
const IT = new Set(('il lo gli una uno di da su tra fra ed ma che non più anche già ancora sono sei hai ho ci mi ti si del della dei delle nel nella nei nelle sul sulla alla alle agli quello quella questo questa questi queste quando dove perché perchè solo tutto tutti tutte ogni molto poco troppo tanto due tre quattro cinque sette otto nove dieci '
  + 'sono stato stata essere avere fare fatto fai puoi può posso vuoi vuole voglio devi deve dei degli cosa cose così bene male oggi ieri domani ora adesso poi prima dopo sempre mai ancora ecco ecco vai vieni torna tocca scegli scrivi leggi apri chiudi salva annulla conferma continua riprova '
  + 'lezione lezioni domanda domande risposta risposte impara allenati sfide profilo impostazioni gratis soldi mese mesi anno anni giorno giorni settimana settimane ore minuti tasso conto indietro avanti fine inizio entra esci accedi registrati nome cerca invia modifica elimina tutti vuoto vuota '
  + 'gruppo corso corsi esame livello punti punteggio serie striscia figurine figurina album unità percorso obiettivo obiettivi capito sbagliato giusto giusta sbagliata corretto corretta errore errori bravo brava complimenti').split(/\s+/));
const SOLO_UI = new Set('indietro avanti chiudi salva annulla conferma continua riprova impara allenati sfide profilo impostazioni gratis soldi lezione lezioni domanda domande risposta risposte esci entra accedi registrati cerca invia modifica elimina tutti vuoto'.split(' '));
const ACC = /[àèéìòù]/;
const EN_OK = /^(café|à la)$/i;
function sospetto(t) {
  if (!/[A-Za-zÀ-ÿ]{2,}/.test(t)) return null;
  if (/^[a-z][A-Za-z0-9_\-:.\/#\[\]]*$/.test(t) && !SOLO_UI.has(t.toLowerCase())) return null;      // identificatori, classi, id
  if (/^https?:|^[\w.-]+\.(js|json|png|svg|webp|mp3|css)\b|^[#.\/]|^\d/.test(t)) return null;
  const parole = (t.toLowerCase().match(/[a-zàèéìòù]+/g) || []);   // anche l'apostrofo separa: l'anno, un'altra, dell'esame
  const hit = new Set(parole.filter(w => IT.has(w) && !(w.length <= 2 && parole.length > 3 && false)));
  if (ACC.test(t.replace(/[–—]/g, ''))) parole.filter(w => ACC.test(w) && !EN_OK.test(w)).forEach(w => hit.add(w));
  return hit.size ? [...hit].slice(0, 6).join(',') : null;
}
const out = [];
const nota = (n, kind, text, top) => { const m = sospetto(text); if (m) out.push([lineOf(n.start), kind, m, text.replace(/\s+/g, ' ').slice(0, 130), top]); };
function walk(n, parent, top) {
  if (!n || typeof n.type !== 'string') return;
  if (parent && parent.type === 'Program') {
    const nome = n.type === 'FunctionDeclaration' || n.type === 'ClassDeclaration' ? n.id.name : n.type === 'VariableDeclaration' ? (n.declarations[0].id.name || '') : '';
    top = nome; if (!tutto && SALTA.has(nome)) return;
    if (nome === 'BASI_UNITS' || nome === 'AZIONI_UNITS' || nome === 'GLOSS_DEF') return;   // le lezioni e il glossario si controllano con basi_en.json / glossario.py
  }
  if (n.type === 'Literal' && typeof n.value === 'string' && !(parent && (parent.type === 'ImportDeclaration' || (parent.type === 'Property' && parent.key === n)))) nota(n, 'str', n.value, top);
  if (n.type === 'TemplateLiteral') {
    const tag = parent && parent.type === 'TaggedTemplateExpression' && parent.quasi === n ? parent.tag : null;
    if (tag && tag.type === 'Identifier' && tag.name === 'html') {
      // template html: il testo tra i tag e i valori degli attributi
      const tt = n.quasis.map(q => q.value.cooked).join('\u0001');
      const pezzi = tt.replace(/<!--[\s\S]*?-->/g, ' ').split(/<[^<>]*>/);
      pezzi.forEach(p => nota(n, 'html', p.replace(/\u0001/g, ' ').trim(), top));
      for (const m of tt.matchAll(/\s(?:alt|title|aria-label|placeholder|label|text|sub|name|desc)="([^"\u0001]*)"/g)) nota(n, 'attr', m[1], top);
    } else n.quasis.forEach(q => nota(n, 'tpl', q.value.cooked || '', top));
  }
  for (const k in n) { const v = n[k]; if (Array.isArray(v)) v.forEach(c => walk(c, n, top)); else if (v && typeof v.type === 'string') walk(v, n, top); }
}
walk(ast, null, '');
const visti = new Set();
for (const o of out) { const k = o[3]; if (visti.has(k)) continue; visti.add(k); console.log(`${o[0]} [${o[1]}] (${o[4]}) {${o[2]}} ${o[3]}`); }
console.error(`sospetti: ${visti.size}`);
