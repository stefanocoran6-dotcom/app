// Mostra dove compare ciascuna "frase dubbia" (una sola parola, spesso codice) con un po' di codice attorno.
import { unita, src, norm } from '../compila.mjs';
const chiavi = process.argv.slice(2);
for (const k of chiavi) {
  const us = unita.filter(u => norm(u.key) === k);
  console.log(`=== «${k}» (${us.length} volte)`);
  for (const u of us.slice(0, 6)) {
    const nl = src.slice(0, u.start).split('\n').length;
    const a = Math.max(src.lastIndexOf('\n', u.start - 1) + 1, u.start - 90), b = Math.min(src.indexOf('\n', u.end) < 0 ? src.length : src.indexOf('\n', u.end), u.end + 70);
    console.log(`  ${u.parte.slice(0, 3)}:L${nl}${u.kind === 'attr' ? ' @' + u.dove : ''}  ${src.slice(a, u.start)}«${src.slice(u.start, u.end)}»${src.slice(u.end, b)}`);
  }
}
