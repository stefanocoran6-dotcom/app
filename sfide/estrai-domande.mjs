// Copia le domande a scelta dell'app in src/domande.json, il file che l'arbitro usa per le sfide dal vivo.
// L'arbitro deve conoscere le risposte giuste per correggere: per questo ha una sua copia delle domande.
// Uso (dalla cartella dell'app): node sfide/estrai-domande.mjs   (lo lancia anche dev/ordine/build.sh)
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const QUI = dirname(fileURLToPath(import.meta.url)), APP = join(QUI, '..');
const fuori = { basi: [], cfa2: [] };

// Basi della finanza: gli esercizi a scelta delle lezioni (basi.json lo scrive dev/ordine/basi_src.py)
const basi = JSON.parse(readFileSync(join(APP, 'dev/ordine/basi.json'), 'utf8'));
for (const u of basi) for (const l of u.lessons) (l.ex || []).filter(e => e.type === 'mcq').forEach((e, i) => {
  fuori.basi.push({ k: l.key + (i ? '#' + i : ''), q: e.q, o: e.options, a: e.ans, e: e.exp || '' });
});

// CFA Level II: la domanda d'esame di ogni LOS, nello stesso ordine dei percorsi dell'app
const righe = readFileSync(join(APP, 'app.js'), 'utf8').split('\n'), cfa = {};
for (const r of righe) { const m = r.match(/^CFA_CURRICULUM\.(\w+) = (\{.*\});?\s*$/); if (m) cfa[m[1]] = JSON.parse(m[2]); }
for (const unita of ['equityValuation', 'portfolioManagement', 'equity']) {
  const t = cfa[unita]; if (!t) continue;
  for (const m of t.modules) for (const l of m.los) if (l.question) {
    const q = l.question;
    fuori.cfa2.push({ k: `${m.id}-${l.id}`, q: q.q, o: q.options, a: q.ans, e: q.exp || '', l: 'en' });
  }
}

// controlli: ogni domanda deve avere testo, almeno due risposte diverse e l'indice della giusta dentro l'elenco
const errori = [];
for (const [corso, lista] of Object.entries(fuori)) {
  if (lista.length < 10) errori.push(`${corso}: solo ${lista.length} domande`);
  const chiavi = new Set();
  for (const d of lista) {
    if (chiavi.has(d.k)) errori.push(`${corso} ${d.k}: chiave doppia`); chiavi.add(d.k);
    if (!String(d.q || '').trim()) errori.push(`${corso} ${d.k}: testo vuoto`);
    if (!Array.isArray(d.o) || d.o.length < 2 || d.o.some(x => !String(x).trim())) errori.push(`${corso} ${d.k}: risposte mancanti`);
    else if (new Set(d.o.map(x => String(x).trim())).size !== d.o.length) errori.push(`${corso} ${d.k}: due risposte uguali`);
    if (!Number.isInteger(d.a) || d.a < 0 || d.a >= (d.o || []).length) errori.push(`${corso} ${d.k}: risposta giusta fuori elenco`);
  }
}
if (errori.length) { console.error('Domande non valide:\n' + errori.join('\n')); process.exit(1); }
writeFileSync(join(QUI, 'src/domande.json'), JSON.stringify(fuori));
console.log(`domande dell'arbitro ok: ${fuori.basi.length} basi, ${fuori.cfa2.length} CFA Level II`);
