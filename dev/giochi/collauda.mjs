// Collaudo delle domande generate (dev/ordine/p44_motore.js).
// Per ogni tipo genera N domande e controlla: una sola risposta giusta, risposte diverse e abbastanza distanti, stessi numeri in italiano
// e in inglese, testi senza buchi, formule chiuse, articoli italiani giusti, stesso nucleo dallo stesso seme.
// Scrive i conti in un file che dev/giochi/ricalcola.py rifà con un secondo programma, scritto a parte.
// Uso: node dev/giochi/collauda.mjs [N] [file dei conti]     (N = domande per tipo, di solito 10000)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const QUI = path.dirname(fileURLToPath(import.meta.url));
const GEN = new Function(fs.readFileSync(path.join(QUI, '..', 'ordine', 'p44_motore.js'), 'utf8') + '\nreturn GEN;')();
const N = Number(process.argv[2]) || 10000, CONTI = process.argv[3] || path.join(QUI, 'conti.jsonl');
const guai = []; const guaio = (t, s, m) => { if (guai.length < 60) guai.push(`${t} seme ${s}: ${m}`); guai.n = (guai.n || 0) + 1; };
const out = fs.createWriteStream(CONTI);
// i numeri di un testo, come valori: "2.000 €" e "€2,000" devono dare lo stesso elenco
const numeri = (testo, en) => (testo.replace(/\\\(|\\\)|\$\$/g, ' ').match(/\d[\d.,{}]*\d|\d/g) || []).map(x => { x = x.replace(/[{}]/g, ''); x = en ? x.replace(/,/g, '') : x.replace(/\./g, '').replace(',', '.'); return String(Number(x)); }).sort().join(' ');
const FORME = { soldi: [0.03, 5], pct: [0.08, 0.5], pct2: [0.04, 0.15], seg: [0.08, 0.5], seg2: [0.08, 0.4], anni: [0.2, 2] };
const riga = [];
for (const tipo of GEN.tipi) {
  const pos = [0, 0, 0], viste = new Set(); let lungaQ = 0, lungaO = 0;
  for (let s = 1; s <= N; s++) {
    const seme = (s * 2654435761) >>> 0, Nu = GEN.crea(tipo.id, seme);
    if (!Nu) { guaio(tipo.id, seme, 'nessuna domanda'); continue; }
    if (JSON.stringify(Nu) !== JSON.stringify(GEN.crea(tipo.id, seme))) guaio(tipo.id, seme, 'lo stesso seme dà due domande diverse');
    if (Nu.o.length !== 3 || !(Nu.a >= 0 && Nu.a < 3)) { guaio(tipo.id, seme, 'non ha tre risposte'); continue; }
    pos[Nu.a]++; viste.add(GEN.impronta(Nu));
    if (tipo.fam === 'calcolo') {
      if (Nu.o.filter(o => o.k === 'ok').length !== 1 || Nu.o[Nu.a].k !== 'ok') guaio(tipo.id, seme, 'la giusta non è una sola');
      const T = GEN.STAMPI[tipo.id], [rel, abs] = FORME[T.forma], ok = Nu.o[Nu.a].v, soglia = Math.max(abs, rel * Math.abs(ok));
      for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) if (Math.abs(Nu.o[i].v - Nu.o[j].v) < soglia - 1e-9) guaio(tipo.id, seme, `risposte troppo vicine: ${Nu.o[i].v} e ${Nu.o[j].v}`);
      out.write(JSON.stringify({ t: tipo.id, s: seme, p: Nu.p, ok }) + '\n');
    } else if (tipo.id === 'quando') { if (Nu.o.filter(o => o.k === 'ok').length !== 1 || Nu.o[Nu.a].k !== 'ok') guaio(tipo.id, seme, 'la giusta non è una sola'); }
    else if (Nu.o[Nu.a].k !== Nu.p.f || new Set(Nu.o.map(o => o.k)).size !== 3) guaio(tipo.id, seme, 'risposte doppie o giusta fuori posto');
    const testi = {};
    for (const [lang, cur] of [['it', '€'], ['en', '€'], ['en', '$']]) {
      const q = GEN.testo(Nu, lang, cur); testi[lang + cur] = q;
      if (q.ans !== Nu.a) guaio(tipo.id, seme, 'la giusta cambia posto nel testo');
      if (new Set(q.options).size !== 3) guaio(tipo.id, seme, `${lang}: due risposte scritte uguali: ${q.options.join(' | ')}`);
      const tutto = [q.q, q.exp].concat(q.options, q.note.filter(Boolean)).join('\n');
      if (/undefined|NaN|\[object|null|Infinity/.test(tutto)) guaio(tipo.id, seme, `${lang}: testo con un buco`);
      if ((q.exp.match(/\$\$/g) || []).length % 2 || (q.exp.match(/\\\(/g) || []).length !== (q.exp.match(/\\\)/g) || []).length) guaio(tipo.id, seme, `${lang}: formula non chiusa`);
      if (/"|—/.test(tutto)) guaio(tipo.id, seme, `${lang}: virgolette doppie o lineetta lunga`);
      if (tipo.fam === 'calcolo' && q.note.filter(Boolean).length !== 2) guaio(tipo.id, seme, `${lang}: manca la riga di un errore tipico`);
      if (lang === 'it') {
        if (/\b(il|al|del) (1|8|11|8\d)([,.]\d+)?%/.test(tutto) || /\b(l'|all'|dell')(?!(1|8|11|8\d)([,.]\d+)?%)\d/.test(tutto)) guaio(tipo.id, seme, 'articolo sbagliato davanti a una percentuale: ' + q.q);
        if (cur === '€' && /\$\d|[A-Za-z]\$/.test(q.q)) guaio(tipo.id, seme, 'dollaro nel testo italiano');
      }
      if (cur === '$' && /€/.test(tutto)) guaio(tipo.id, seme, 'euro rimasto nella versione in dollari');
      lungaQ = Math.max(lungaQ, q.q.length); lungaO = Math.max(lungaO, ...q.options.map(o => o.length));
    }
    if (numeri(testi['it€'].q, false) !== numeri(testi['en€'].q, true)) guaio(tipo.id, seme, `numeri diversi tra italiano e inglese: ${testi['it€'].q} /// ${testi['en€'].q}`);
    if (tipo.fam === 'calcolo' && numeri(testi['it€'].options.join(' '), false) !== numeri(testi['en€'].options.join(' '), true)) guaio(tipo.id, seme, 'risposte con numeri diversi tra italiano e inglese');
  }
  riga.push(`${tipo.id.padEnd(12)} ${tipo.fam.padEnd(8)} liv ${tipo.liv}  domande diverse ${String(viste.size).padStart(5)}  giusta in A/B/C ${pos.map(x => Math.round(x / N * 100) + '%').join(' ')}  domanda più lunga ${lungaQ}  risposta più lunga ${lungaO}`);
}
// le tabelle: chiavi uniche, tutte le lingue, etichette che non si ripetono
const T = GEN.tabelle;
for (const [nome, lista, campi] of [['PERSONE', T.PERSONE, ['q', 'cosa', 'exp']], ['EVENTI', T.EVENTI, ['q', 'nome', 'exp']], ['MONETE', T.MONETE, ['paese', 'di', 'val', 'il']], ['INDICI', T.INDICI, ['paese', 'agg', 'exp']]]) {
  if (new Set(lista.map(x => x.id)).size !== lista.length) guaio(nome, 0, 'chiavi doppie');
  for (const lang of GEN.LINGUE) for (const c of campi) {
    lista.forEach(x => { if (!x[lang] || !x[lang][c]) guaio(nome, 0, `${x.id}: manca ${c} in ${lang}`); });
    if (c !== 'exp' && c !== 'q' && new Set(lista.map(x => x[lang] && x[lang][c])).size !== lista.length) guaio(nome, 0, `${c} in ${lang}: due righe uguali`);
  }
}
out.end(() => {
  console.log(riga.join('\n'));
  console.log(`fatti in tabella: ${T.PERSONE.length} persone, ${T.EVENTI.length} eventi, ${T.MONETE.length} monete, ${T.INDICI.length} indici = ${T.PERSONE.length + T.EVENTI.length + T.MONETE.length + T.INDICI.length}`);
  guai.forEach(g => console.log('GUAIO ' + g));
  console.log(`tipi ${GEN.tipi.length} · domande provate ${GEN.tipi.length * N} · guai ${guai.n || 0}`);
  process.exit(guai.n ? 1 : 0);
});
