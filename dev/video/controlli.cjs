// controlli.cjs · I controlli automatici della scheda, prima dello storyboard e di nuovo con i tempi veri della voce.
// Uso: node controlli.cjs
// Stampa: i sottotitoli che restano meno di 0,6 s; le scritte che restano meno di 1,3 s prima che la schermata cambi;
// i tratti di più di 4 s senza un fatto nuovo sullo schermo (una schermata nuova o qualcosa che entra su una parola).
// Un vuoto può andare bene se in quel tratto si muove qualcosa (una griglia che si riempie) o Rally fa un gesto grande: va guardato, non per forza corretto.
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + path.resolve(__dirname, 'render.html')); await p.evaluate(() => window.ready);
  const r = await p.evaluate(() => {
    const T = TG.T, corti = [], brevi = [], fatti = [];
    T.sc.forEach((s) => s.blocchi.forEach((x) => { if (x.t1 - x.t0 < .6) corti.push(s.id + ' «' + x.show.replace(/\*/g, '') + '» ' + (x.t1 - x.t0).toFixed(2) + ' s'); }));
    T.slides.forEach((s, i) => {
      fatti.push(s.t0);
      const walk = (o, via) => {
        if (!o || typeof o !== 'object') return;
        if (Array.isArray(o)) { o.forEach((x, j) => walk(x, via + '[' + j + ']')); return; }
        if (o !== s && o._t != null) {
          if (o._t >= s.t0 && o._t < s.t1) fatti.push(o._t);
          const resta = s.t1 - o._t; if (resta < 1.3) brevi.push('schermata ' + i + ' (' + s.tipo + ') ' + via + ' «' + (o.testo || o.nome || o.titolo || '') + '» resta ' + resta.toFixed(2) + ' s');
        }
        Object.keys(o).forEach((k) => { if (k !== 'fn' && typeof o[k] === 'object') walk(o[k], via + '.' + k); });
      };
      walk(s, s.tipo);
    });
    fatti.sort((a, c) => a - c); fatti.push(T.total);
    const vuoti = []; for (let i = 1; i < fatti.length; i++) if (fatti[i] - fatti[i - 1] > 4) vuoti.push(fatti[i - 1].toFixed(1) + ' → ' + fatti[i].toFixed(1) + ' s');
    return { total: T.total, reali: !!window.TEMPI, n: fatti.length - 1, corti, brevi, vuoti, eventi: T.events.length };
  });
  console.log('durata', r.total.toFixed(1), 's · tempi', r.reali ? 'veri della voce' : 'stimati', '· fatti sullo schermo', r.n, '(uno ogni', (r.total / r.n).toFixed(1), 's) · eventi sonori', r.eventi);
  r.corti.forEach((x) => console.log('SOTTOTITOLO CORTO', x));
  r.brevi.forEach((x) => console.log('SCRITTA BREVE', x));
  r.vuoti.forEach((x) => console.log('VUOTO', x));
  if (!r.corti.length && !r.brevi.length && !r.vuoti.length) console.log('tutto a posto');
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
