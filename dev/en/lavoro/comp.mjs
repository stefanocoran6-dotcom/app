// Elenca le frasi "composte" di una parte (con buchi, o pezzi di frasi dentro espressioni) con la riga di codice intorno.
import { unita, src, norm, hashDi } from '../compila.mjs';
const parte = process.argv[2], max = +process.argv[3] || 999, skip = +process.argv[4] || 0;
const viste = new Set(); let n = 0;
for (const u of unita) {
  if (u.parte !== parte + '.js' || u.classe === 'codice') continue;
  const k = norm(u.key);
  const comp = /\{\d+\}/.test(k) || (u.kind === 'lit' && /Binary|Conditional|Logical|Call|Template|Assignment/.test(u.dove)) || u.kind === 'tpl';
  if (!comp) continue;
  const ls = src.lastIndexOf('\n', u.start) + 1, le = src.indexOf('\n', u.end);
  const nl = src.slice(0, u.start).split('\n').length;
  const id = nl + ':' + k; if (viste.has(id)) continue; viste.add(id);
  if (n++ < skip || n > skip + max) continue;
  const riga = src.slice(ls, le), da = Math.max(0, u.start - ls - 120), a = Math.min(riga.length, u.end - ls + 120);
  console.log(`#${hashDi(k)} L${nl} [${u.kind}${u.dove ? ':' + u.dove.replace('Expression', '') : ''}] ${k.slice(0, 90)}\n   ${(da ? '…' : '') + riga.slice(da, a).trim() + (a < riga.length ? '…' : '')}`);
}
console.error('mostrate', Math.min(max, n - skip), 'di', n);
