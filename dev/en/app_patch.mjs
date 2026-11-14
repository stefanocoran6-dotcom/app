// Rende bilingue le frasi di app.js che arrivano nell'interfaccia inglese: ogni frase italiana elencata in app_en.txt diventa L('italiano', 'English').
// L(it, en) dà l'italiano finché l'app è in italiano, quindi l'app italiana resta identica. Si può rilanciare: le frasi già avvolte si saltano.
// Uso: node dev/en/app_patch.mjs [--prova]   (--prova non scrive il file, dice solo che cosa cambierebbe)
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const HERE = path.dirname(new URL(import.meta.url).pathname);
const acorn = createRequire(HERE + '/')('acorn');
const APP = path.join(HERE, '..', '..', 'app.js');
const prova = process.argv.includes('--prova');
const src = fs.readFileSync(APP, 'utf8');

// il dizionario: "Italiano ⇒ English", \n = a capo, \\ = una barra, {} = un valore del codice
const dec = s => s.replace(/\\(n|s|\\)/g, (m, c) => c === 'n' ? '\n' : c === 's' ? ' ' : '\\');   // \n = a capo, \s = uno spazio (a inizio o fine), \\ = una barra
const DIZ = new Map();
for (const r of fs.readFileSync(path.join(HERE, 'app_en.txt'), 'utf8').split('\n')) {
  if (!r || r[0] === '#') continue;
  const k = r.indexOf(' ⇒ '); if (k < 0) { console.error('riga senza ⇒:', r.slice(0, 60)); process.exit(1); }
  DIZ.set(dec(r.slice(0, k)), dec(r.slice(k + 3)));
}

// le zone di app.js dove stanno le frasi: accesso, calcolatrice, AI (OpenRouter e chat), chat nelle lezioni e nella pagina del Coach
const zona = (da, a) => { const i = src.indexOf(da), j = src.indexOf(a, i + 1); if (i < 0 || j < 0) { console.error('zona non trovata:', da); process.exit(1); } return [i, j]; };
const ZONE = [zona('const mockAuth = {', '// ========== LOADING SCREEN'), zona('function TICalculator({', '// ========== AI ON-DEVICE'), zona('// ========== AI ON-DEVICE', '// ========== PRO UPGRADE MODAL'),
  zona('const flAiModelLine =', 'function AiCoachPage(')];   // l'ultima: la chat dentro le lezioni (QuizAISheet) e la pagina del Coach (AiPageChat)
const inZona = n => ZONE.some(z => n.start >= z[0] && n.end <= z[1]);

const ast = acorn.parse(src, { ecmaVersion: 'latest', sourceType: 'module' });
const reps = [], usate = new Set();
const esc = t => t.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${').replace(/\n/g, '\\n');
function walk(n, parent) {
  if (!n || typeof n.type !== 'string') return;
  if (inZona(n)) {
    const gia = parent && parent.type === 'CallExpression' && parent.callee.type === 'Identifier' && parent.callee.name === 'L';
    const chiave = parent && parent.type === 'Property' && parent.key === n && !parent.computed;
    const direttiva = parent && parent.type === 'ExpressionStatement' && parent.directive;
    if (!gia && !chiave && !direttiva) {
      if (n.type === 'Literal' && typeof n.value === 'string' && DIZ.has(n.value)) {
        usate.add(n.value); reps.push({ start: n.start, end: n.end, n, en: DIZ.get(n.value) });
      } else if (n.type === 'TemplateLiteral') {
        const k = n.quasis.map(q => q.value.cooked).join('{}');
        if (DIZ.has(k)) {
          if (DIZ.get(k).split('{}').length !== n.expressions.length + 1) { console.error('buchi diversi:', k.slice(0, 70)); process.exit(1); }
          usate.add(k); reps.push({ start: n.start, end: n.end, n, en: DIZ.get(k), tpl: true });
        }
      }
    }
  }
  for (const k in n) { const v = n[k]; if (Array.isArray(v)) v.forEach(c => walk(c, n)); else if (v && typeof v.type === 'string') walk(v, n); }
}
walk(ast, null);

// il testo di src[start, end) con le sostituzioni contenute (ma non quella uguale a skip): una frase può stare dentro un buco di un'altra
function fetta(start, end, skip) {
  const dentro = reps.filter(r => r !== skip && r.start >= start && r.end <= end).sort((a, b) => a.start - b.start || b.end - a.end);
  let out = '', pos = start;
  for (const r of dentro) { if (r.start < pos) continue; out += src.slice(pos, r.start) + testo(r); pos = r.end; }
  return out + src.slice(pos, end);
}
function testo(r) {
  if (!r.tpl) return `L(${src.slice(r.start, r.end)}, ${JSON.stringify(r.en)})`;
  const parti = r.en.split('{}'); let t = esc(parti[0]);
  r.n.expressions.forEach((e, i) => { t += '${' + fetta(e.start, e.end, null) + '}' + esc(parti[i + 1]); });
  return `L(${fetta(r.start, r.end, r)}, \`${t}\`)`;
}
const mancano = [...DIZ.keys()].filter(k => !usate.has(k) && !/^[\s\W]*$/.test(k));
const out = fetta(0, src.length, null);
console.log(`frasi avvolte: ${reps.length}; voci del dizionario non trovate (già avvolte o assenti): ${mancano.length}`);
mancano.slice(0, 40).forEach(k => console.log('  non trovata: ' + JSON.stringify(k).slice(0, 110)));
if (!prova && reps.length) { fs.writeFileSync(APP, out); console.log('app.js aggiornato'); }
