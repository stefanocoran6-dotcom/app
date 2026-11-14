// Per ogni riga di una parte: la riga di codice una sola volta, e sotto le frasi che contiene (con il loro hash).
// Uso: node per_riga.mjs p30_learn [da_riga] [a_riga] [--tutte]   (senza --tutte salta le frasi già nel dizionario)
import { unita, src, norm, hashDi, DIZIONARIO, chiaveDi } from '../compila.mjs';
const [parte, da, a] = [process.argv[2], +process.argv[3] || 0, +process.argv[4] || 1e9], tutte = process.argv.includes('--tutte');
const righe = new Map(); const visti = new Set();
for (const u of unita) {
  if (u.parte !== parte + '.js' || u.classe === 'codice') continue;
  const k = norm(u.key); if (!tutte && DIZIONARIO.has(chiaveDi(u, k))) continue;
  const nl = src.slice(0, u.start).split('\n').length; if (nl < da || nl > a) continue;
  if (!righe.has(nl)) righe.set(nl, []); righe.get(nl).push(u);
}
let nTot = 0;
for (const [nl, us] of righe) {
  const ls = src.lastIndexOf('\n', us[0].start) + 1, le = src.indexOf('\n', us[0].start);
  let riga = src.slice(ls, le).trim(); if (riga.length > 360) { const p = us[0].start - ls - 60; riga = (p > 0 ? '…' : '') + src.slice(ls + Math.max(0, p), ls + Math.max(0, p) + 360).trim() + '…'; }
  const mine = us.filter(u => { const id = hashDi(norm(u.key)) + u.kind; if (visti.has(id)) return false; visti.add(id); return true; });
  if (!mine.length) continue;
  console.log(`L${nl}: ${riga}`);
  for (const u of mine) { console.log(`   #${hashDi(norm(u.key))}${'@'+u.kind} ${u.classe === 'forse' ? '?' : ''}${u.kind === 'attr' ? '@' + u.dove : u.kind === 'lit' ? 'L' : u.kind === 'tpl' ? 'T' : ''} ${norm(u.key).slice(0, 150)}`); nTot++; }
}
console.error('frasi mostrate:', nTot);
