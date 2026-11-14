// Mostra dove sta nel sorgente una frase (per hash o per pezzo di testo) e la riga di codice intorno.
import { unita, src, norm, hashDi } from '../compila.mjs';
const q = process.argv.slice(2);
for (const w of q) {
  const trovate = unita.filter(u => hashDi(norm(u.key)) === w || norm(u.key).includes(w));
  const viste = new Set();
  for (const u of trovate.slice(0, 3)) {
    const ls = src.lastIndexOf('\n', u.start) + 1, le = src.indexOf('\n', u.end);
    const riga = src.slice(ls, le); const n = src.slice(0, u.start).split('\n').length;
    const k = hashDi(norm(u.key)) + n; if (viste.has(k)) continue; viste.add(k);
    const da = Math.max(0, u.start - ls - 170), a = Math.min(riga.length, u.end - ls + 170);
    console.log(`--- ${hashDi(norm(u.key))} ${u.parte}:${n} [${u.kind}${u.dove ? ':' + u.dove : ''}] "${norm(u.key).slice(0, 80)}"\n${(da ? '…' : '') + riga.slice(da, a) + (a < riga.length ? '…' : '')}`);
  }
}
