// tg.js · Il TG di Rally: lo studio (set fisso) e la regia.
// Ogni fotogramma è funzione del tempo t (secondi), senza stato nascosto: lo stesso t dà sempre lo stesso disegno.
// Dipende da rally4.js (scheletro di Rally) e da window.VIDEO (scheda del video del giorno).
// Uso: TG.init(VIDEO, tempiVeri?) poi TG.frame(t, uid) -> stringa HTML 1080x1920.
// La scheda dell'episodio (video.js) sceglie schermate e gesti da due librerie (SCREENS e G, più sotto) e li aggancia alle parole.
const TG = (function () {
  const W = 1080, H = 1920, TAU = Math.PI * 2, S = Math.sin, Co = Math.cos, ex = Math.exp;
  // colori e caratteri dell'app
  const C = { ink: '#1A1A1A', az: '#8EC5FF', azL: '#A9D3FF', menta: '#7EE0B5', pesca: '#FFC9A3', lilla: '#D6C8FF', lillaL: '#ECE6FF', lillaD: '#B9A6F2',
    rosa: '#FFB4C8', giallo: '#FFD43B', grigio: '#C4CAD6', mut: '#4A4F5A', fuoco: '#FF9A5A' };
  const DISP = "'Bricolage Grotesque',system-ui,sans-serif", MONO = "'IBM Plex Mono',ui-monospace,monospace";
  // zona sicura di TikTok (prudente): fuori da qui solo sfondo
  const SAFE = { l: 60, t: 250, r: 920, b: 1440 }, CX = 490;
  // misure dello studio
  const MX = 80, MY = 262, MW = 820, MH = 410;      // schermo
  const RW = 500, RY = 690;                         // Rally (larghezza, bordo alto)
  const DY = 1090;                                  // piano del bancone
  const NY = 1146, NH = 66;                         // nastro
  const SY = 1256, SH = 182;                        // sottotitoli
  const WPS = 2.2, ARIA = .3;                       // parole al secondo e aria tra le battute (stima, prima della voce)

  const E = R4M.ease;
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x, lerp = (a, b, k) => a + (b - a) * k;
  const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
  const px = (v) => (Math.round(v * 100) / 100) + 'px';
  const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const pop = (t, t0, d, s) => t < t0 ? 0 : E.outBack(seg(t, t0, t0 + (d || .32)), s == null ? 1.7 : s);   // 0 -> 1 con rimbalzo
  const ease = (t, a, b) => E.inOut(seg(t, a, b));
  const env = (t, a, b, i, o) => E.outBack(seg(t, a, a + (i || .3)), 1.1) * (1 - E.inOut(seg(t, b - (o || .28), b)));  // 0 -> 1 -> 0
  const key = (w) => w.toLowerCase().replace(/[^a-zàèéìòù]/g, '');

  let T = null;
  // lingua dell'episodio (VIDEO.lingua: 'it' o 'en'): labiale e le poche scritte fisse dello studio
  let LANG = 'it';
  const TXT = { it: { capitolo: 'CAPITOLO', di: 'DI', segui: 'Seguimi' }, en: { capitolo: 'CHAPTER', di: 'OF', segui: 'Follow me' } };
  const tx = (k) => (TXT[LANG] || TXT.it)[k];

  // ---------- tempi: battute, parole, sottotitoli ----------
  function plan(text, t0, dur, parole) {
    if (parole && parole.length) {                    // tempi veri dalla voce: labiale parola per parola
      const words = []; const re = /\S+/g; let m;
      while ((m = re.exec(text))) words.push({ w: m[0], i: m.index, key: key(m[0]) });
      if (parole.length !== words.length) throw new Error('TG: ' + parole.length + ' tempi per ' + words.length + ' parole');
      const seq = [];
      words.forEach((w, k) => {
        w.t = parole[k].t; w.end = Math.max(parole[k].end, w.t + .05);
        const s = r4LipSync(w.w, { lang: LANG }), d = r4LipSyncDuration(s) || .1, a = w.t - t0, sc = (w.end - w.t) / d;
        s.forEach((e) => {
          const x = { t: +(a + e.t * sc).toFixed(3), key: e.key, i: w.i + e.i };
          if (seq.length && seq[seq.length - 1].t >= x.t) seq[seq.length - 1] = x; else seq.push(x);
        });
      });
      return { seq, words };
    }
    const d0 = r4LipSyncDuration(r4LipSync(text, { lang: LANG })) || 1;
    const seq = r4LipSync(text, { lang: LANG, rate: d0 / dur });
    const words = []; const re = /\S+/g; let m;
    while ((m = re.exec(text))) words.push({ w: m[0], i: m.index, key: key(m[0]) });
    words.forEach((w, k) => {
      if (parole && parole[k]) { w.t = parole[k].t; return; }           // tempi veri dalla voce
      let tt = null; for (const e of seq) { if (e.i >= w.i) { tt = e.t; break; } }
      w.t = t0 + (tt == null ? dur : tt);
    });
    words.forEach((w, k) => { w.end = k + 1 < words.length ? words[k + 1].t : t0 + dur; });
    return { seq, words };
  }
  // sottotitoli automatici: dal testo da mostrare ("mostra": numeri in cifre, *parola* evidenziata, stesse parole della voce)
  // ai blocchi di 2-4 parole. Il taglio cade sulla punteggiatura, mai dentro un'evidenziazione, e un blocco non finisce con "di", "la"...
  const DEBOLI = new Set(('il lo la i gli le un una uno di da a in per con su tra fra del dello della dei degli delle al allo alla ai agli alle ' +
    'dal dallo dalla dai dagli dalle nel nello nella nei negli nelle sul sullo sulla e ed o che ma se non suo sua suoi sue quel quella questo questa ' +
    'si ci ne mi ti vi più ' +
    'the an of to on at for with and or but that his her its their is was by from as into than this these those').split(' '));
  function autoBlocchi(testo, n, id) {
    const tk = testo.trim().split(/\s+/);
    if (tk.length !== n) throw new Error('TG: "mostra" di "' + id + '" ha ' + tk.length + ' parole, la voce ' + n);
    const bare = (w) => w.replace(/\*/g, ''), fine = (w) => (/[.?!]$/.test(bare(w)) ? 6 : /[:;]$/.test(bare(w)) ? 3 : /,$/.test(bare(w)) ? 1.2 : 0);
    const aperta = []; let open = false;
    tk.forEach((w, i) => { if ((w.match(/\*/g) || []).length % 2) open = !open; aperta[i] = open; });
    const cost = (a, b) => {
      const s = tk.slice(a, b), L = s.map(bare).join(' ').length, last = bare(s[s.length - 1]).toLowerCase().replace(/[.,:;?!]+$/, '');
      let c = (s.length === 5 ? (L <= 22 ? 1 : 3.6) : .4 * (s.length - 3) ** 2 + (s.length === 1 ? 3 : 0)) + (L > 24 ? (L - 24) * .35 : 0);
      if (L < 9) c += 1.5;                                                       // un blocco troppo corto resta a schermo meno di 0,6 s
      if (L < 13 && /[.?!]$/.test(bare(s[s.length - 1])) && s.length < 3) c += 1;   // la coda corta di una frase si appoggia al blocco prima
      for (let k = a; k < b - 1; k++) c += fine(tk[k]);                       // la punteggiatura dentro il blocco costa
      if (b < tk.length) { if (aperta[b - 1]) c += 100; if (DEBOLI.has(last)) c += 2; if (!fine(tk[b - 1])) c += .5; }
      return c;
    };
    const best = [0], from = [0];
    for (let i = 1; i <= tk.length; i++) {
      best[i] = Infinity;
      for (let s = 1; s <= 5 && s <= i; s++) { const c = best[i - s] + cost(i - s, i); if (c < best[i]) { best[i] = c; from[i] = i - s; } }
    }
    const out = []; for (let i = tk.length; i > 0; i = from[i]) out.unshift(tk.slice(from[i], i));
    return out.map((x) => [x.length, x.join(' ')]);
  }
  // pausa prima di ogni battuta: "pausa" nella scena, altrimenti un respiro in più prima di ogni capitolo (pausaCapitolo, di solito 0,6 s).
  // scene.cjs applica la stessa regola per tempi.py, così i tempi stimati e quelli veri hanno le stesse pause.
  function pausaScene(V) {
    const cap = {}; (V.capitoli || []).forEach((c) => { cap[c.scena] = 1; });
    const PC = V.pausaCapitolo == null ? .6 : V.pausaCapitolo;
    return V.scene.map((s, j) => s.pausa != null ? s.pausa : (j && cap[s.id]) ? PC : 0);
  }
  // ---------- appuntamenti: "scena:parola" -> secondi ----------
  // "fatto:Prime" = quando Rally dice "Prime" nella scena fatto · "fatto:il#2" = la seconda volta che dice "il"
  // "come:@inizio" / "come:@fine" = inizio e fine della battuta · {a:'fatto:Prime', d:-.12} = con uno scarto in secondi
  function tc(c, d) {
    if (c == null) return null;
    if (typeof c === 'number') return c + (d || 0);
    if (typeof c === 'object') return tc(c.a, (c.d || 0) + (d || 0));
    const m = String(c).match(/^([^:]+):(.+)$/);
    if (!m) throw new Error('TG: appuntamento senza scena: ' + c);
    const s = T.by[m[1]]; if (!s) throw new Error('TG: scena sconosciuta: ' + m[1]);
    let w = m[2], n = 1; const h = w.match(/^(.*)#(\d+)$/); if (h) { w = h[1]; n = +h[2]; }
    if (w === '@inizio') return s.t0 + (d || 0);
    if (w === '@fine') return s.t1 + (d || 0);
    const k = key(w), f = s.words.filter((x) => x.key === k)[n - 1];
    if (!f) throw new Error('TG: parola non trovata: ' + c);
    return f.t + (d || 0);
  }
  // risolve una volta sola tutti gli appuntamenti di schermate e gesti: a -> _t, fino -> _f, su -> _su, giu -> _giu, pulse -> _p, oltre -> _o
  function risolvi(o) {
    if (Array.isArray(o)) { o.forEach(risolvi); return; }
    if (!o || typeof o !== 'object') return;
    Object.keys(o).forEach((k) => { if (o[k] && typeof o[k] === 'object' && k !== 'a' && k !== 'fino') risolvi(o[k]); });
    if (o.a != null) o._t = tc(o.a, o.d);
    if (o.fino != null) o._f = tc(o.fino, o.fd);
    if (o.su != null) o._su = tc(o.su, o.sd);
    if (o.giu != null) o._giu = tc(o.giu, o.gd);
    if (o.pulse != null) o._p = tc(o.pulse, o.pd);
    if (o.oltre != null) o._o = tc(o.oltre, o.od);
    if (o.sporgi != null && typeof o.sporgi !== 'boolean') o._s = tc(o.sporgi, o.spd);
    if (Array.isArray(o.tocchi)) o._tocchi = o.tocchi.map((x) => tc(x));
  }

  function init(V, tempi) {
    LANG = V.lingua === 'en' ? 'en' : 'it';
    let t = .2;
    const P0 = pausaScene(V);                       // prima di ogni capitolo un respiro in più (lo stesso che usa tempi.py)
    const sc = V.scene.map((s, j) => {
      const n = s.dice.trim().split(/\s+/).length, real = tempi && tempi[s.id], pausa = P0[j];
      if (!real) t += pausa;
      const t0 = real ? real.t0 : t, dur = real ? real.dur : n / WPS;
      const pl = plan(s.dice, t0, dur, real && real.parole);
      t = t0 + dur + ARIA;
      let w = 0;
      const B = s.blocchi || autoBlocchi(s.mostra || s.dice, n, s.id);
      const bl = B.map((b) => { const o = { t0: pl.words[w].t, show: b[1] }; w += b[0]; return o; });
      if (w !== pl.words.length) throw new Error('TG: i blocchi di "' + s.id + '" coprono ' + w + ' parole su ' + pl.words.length);
      bl.forEach((b, i) => { b.t1 = i + 1 < bl.length ? bl[i + 1].t0 : t0 + dur + .22; });
      // con i tempi veri un blocco può restare meno di 0,6 s: si unisce al vicino (quello dopo, o quello prima se chiude la frase)
      const lungo = (x) => x.replace(/\*/g, '').length;
      for (let i = 0; i < bl.length && bl.length > 1; i++) {
        if (bl[i].t1 - bl[i].t0 >= .6) continue;
        const chiude = /[.?!]$/.test(bl[i].show.replace(/\*/g, '')), cand = chiude ? [i - 1, i + 1] : [i + 1, i - 1];
        const j = cand.find((k) => k >= 0 && k < bl.length && lungo(bl[Math.min(i, k)].show + ' ' + bl[Math.max(i, k)].show) <= 44);
        if (j == null) continue;
        const a = Math.min(i, j), b = Math.max(i, j);
        bl[a] = { t0: bl[a].t0, t1: bl[b].t1, show: bl[a].show + ' ' + bl[b].show }; bl.splice(b, 1); i = a - 1;
      }
      return { id: s.id, dice: s.dice, t0, dur, t1: t0 + dur, pausa, blocchi: bl, seq: pl.seq, words: pl.words };
    });
    T = { V, sc, by: {}, q: {}, total: sc[sc.length - 1].t1 + 1.4, env: tempi && tempi.env ? tempi.env : null, envFps: (tempi && tempi.fps) || 30 };
    sc.forEach((s) => { T.by[s.id] = s; });
    const last = sc[sc.length - 1];
    // schermate: modelli riusabili (titolo, numero, catena, scelta, confronto, grafico, saluto)
    const SCH = JSON.parse(JSON.stringify(V.schermi || []));
    risolvi(SCH);
    T.slides = SCH.map((s, i) => {
      if (!SCREENS[s.tipo]) throw new Error('TG: schermata sconosciuta: ' + s.tipo);
      return Object.assign(s, { t0: i ? tc(s.da, s.d) : 0, fn: SCREENS[s.tipo] });
    });
    // capitoli: il cartello compare da solo nel respiro prima della prima battuta, e il titolo va sul nastro
    T.capitoli = (V.capitoli || []).map((c, i) => {
      const s = T.by[c.scena]; if (!s) throw new Error('TG: capitolo senza scena: ' + c.scena);
      return { n: i + 1, titolo: c.titolo, t0: Math.max(s.t0 - s.pausa - ARIA + .1, s.t0 - .45) };   // a metà del respiro: l'ultima scritta del capitolo prima resta leggibile
    });
    T.capitoli.forEach((c) => T.slides.push({ tipo: 'capitolo', n: c.n, titolo: c.titolo, t0: c.t0, fn: SCREENS.capitolo }));
    T.slides.sort((a, b) => a.t0 - b.t0);
    T.slides.forEach((s, i) => { s.t1 = i + 1 < T.slides.length ? T.slides[i + 1].t0 : T.total; });
    T.fineCapitoli = (T.slides.find((s) => s.tipo === 'saluto') || { t0: T.total }).t0;
    // gesti e umori di Rally
    T.gesti = JSON.parse(JSON.stringify(V.gesti || [])); risolvi(T.gesti);
    T.gesti.forEach((g) => { if (!G[g.g]) throw new Error('TG: gesto sconosciuto: ' + g.g); });
    T.umori = (V.umori || []).map((u) => ({ t: tc(u.a, u.d), u: u.u })).sort((a, b) => a.t - b.t);
    // camera: (ingrandimento k attorno al punto fx,fy). Si muove poco e con uno scopo.
    const FR = RY + 172, K = [{ t: 0, k: 1.13, fx: CX, fy: FR }];   // FR: altezza del muso di Rally
    if (sc[1]) K.push({ t: sc[1].t0 - .3, k: 1.17, fx: CX, fy: FR }, { t: sc[1].t0 + .12, k: 1, fx: CX, fy: FR });
    T.slides.forEach((s, i) => {
      if (!i || s.tipo === 'capitolo' || s.camera === 'resta') return;      // sul cartello del capitolo la camera non si muove
      if (s.tipo === 'saluto') K.push({ t: s.t0 - .17, k: 1, fx: CX, fy: FR }, { t: s.t0 + .25, k: 1.07, fx: CX, fy: FR - 30 }, { t: T.total, k: 1.1, fx: CX, fy: FR - 30 });
      else if ((s.camera || (s.tipo === 'scelta' ? 'rally' : 'schermo')) === 'rally') K.push({ t: s.t0 + .2, k: 1, fx: CX, fy: FR }, { t: s.t1 - .3, k: 1.02, fx: CX, fy: FR });
      else { const z = s.zoom || [1, 1.06], y = s.fy || [560, 540]; K.push({ t: s.t0 + .4, k: z[0], fx: CX, fy: y[0] }, { t: s.t1 - .3, k: z[1], fx: CX, fy: y[1] }); }   // zoom e fy: si possono scegliere per schermata
    });
    if (K[K.length - 1].t < T.total) K.push(Object.assign({}, K[K.length - 1], { t: T.total }));
    T.cam = K.sort((a, b) => a.t - b.t).filter((k, i, A) => !i || k.t > A[i - 1].t + .05);
    // eventi per i suoni: una sola fonte dei tempi
    const ev = [{ t: 0, tipo: 'apertura' }];
    T.shakes = [];
    T.slides.forEach((s, i) => {
      if (i) ev.push({ t: s.t0, tipo: s.tipo === 'capitolo' ? 'capitolo' : 'cambio' });
      if (s.timbro) ev.push({ t: s.timbro._t, tipo: 'timbro' });
      (s.passi || []).forEach((p) => { if (p._t != null) ev.push({ t: p._t, tipo: 'passo' }); });
      if (s.icona && s.icona._t != null) ev.push({ t: s.icona._t, tipo: 'passo' });
      (s.termini || []).forEach((p, j, A) => { if (p._t != null) ev.push({ t: p._t, tipo: j === A.length - 1 ? 'numero' : 'cartellino' }); });
      ['tutti', 'pioggia'].forEach((k) => { if (s[k] && s[k]._t != null) ev.push({ t: s[k]._t, tipo: 'pioggia' }); });
      if (s.lente && s.lente._t != null) ev.push({ t: s.lente._t, tipo: 'cartellino' });
      (s.parti || []).forEach((p, j) => { ev.push({ t: p._t, tipo: 'numero' }); if (!j) T.shakes.push(p._t); });
      ['sinistra', 'destra'].forEach((k) => { if (s[k] && s[k]._t != null) ev.push({ t: s[k]._t, tipo: 'numero' }); });
      (s.fx || []).forEach((f) => {
        if (f.tipo === 'moneta') ev.push({ t: f._t, tipo: 'moneta' });
        if (f.tipo === 'cresce' || f.tipo === 'prezzo') ev.push({ t: f.tipo === 'prezzo' ? f._su : f._t, tipo: 'sale' });
        if (f.tipo === 'prezzo' && f._giu != null) ev.push({ t: f._giu, tipo: 'scende' });
      });
      (s.carte || []).forEach((c) => ev.push({ t: c._t, tipo: 'cartellino' }));
      if (s.linea && s.linea._t != null) ev.push({ t: s.linea._t, tipo: s.verso === 'su' ? 'sale' : 'scende' });
      if (s.fine && s.fine._t != null) ev.push({ t: s.fine._t, tipo: 'numero' });
      if (s.segui && s.segui._t != null) ev.push({ t: s.segui._t, tipo: 'chiusura' });
    });
    ev.push({ t: last.t1 + .06, tipo: 'sigla' });
    const seen = {}; T.events = ev.filter((e) => e.t != null).sort((a, b) => a.t - b.t).filter((e) => { const k = e.tipo + Math.round(e.t * 20); if (seen[k]) return false; seen[k] = 1; return true; });
    R4M.define('tg', { dur: T.total, mood: 'happy', fn: recita });
    return T;
  }

  // ---------- recitazione di Rally ----------
  const hash = (n) => { const s = S(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  function breathe(P, t, a, per) {
    a = a == null ? 1 : a; per = per || 3.4; const b = S(TAU * t / per);
    P.uSy *= 1 + .013 * a * b; P.uSx *= 1 - .006 * a * b; P.hDy += -.55 * a * S(TAU * (t - .25) / per);
    P.aL += 1.6 * a * S(TAU * (t - .15) / per); P.aR -= 1.6 * a * S(TAU * (t - .15) / per);
    P.earL += 2.5 * a * S(TAU * (t - .45) / per); P.earR += 2.5 * a * S(TAU * (t - .45) / per);
    P.tail += 5 * a * S(TAU * t / 2.6); P.tailTip += 7 * a * S(TAU * (t - .3) / 2.6);
  }
  function blinkShape(x) { if (x < 0 || x > .17) return 0; if (x < .06) return E.in(x / .06) * .3 + E.smooth(x / .06) * .7; if (x < .09) return 1; return 1 - E.out((x - .09) / .08); }
  function blinks(P, t, seed) {
    const cell = 3.1, k = Math.floor(t / cell); let b = 0;
    for (let j = k - 1; j <= k; j++) {
      const t0 = j * cell + .4 + hash(j + seed) * 2.2;
      b = Math.max(b, blinkShape(t - t0)); if (hash(j * 3.7 + 9 + seed) > .72) b = Math.max(b, blinkShape(t - t0 - .27));
    }
    P.blink = Math.max(P.blink, b);
  }
  const defLook = (yaw) => yaw >= 1 ? [3, 1.2] : [1 + 2 * clamp(yaw, 0, 1), 1.2];
  function look(P, dx, dy, w) { if (w <= 0) return; const d = defLook(P.yaw), c = P.look || d; P.look = [lerp(c[0], d[0] + dx, w), lerp(c[1], d[1] + dy, w)]; }
  // una posa della libreria, dosata da w (0..1). Le parti che finalize non conosce si aggiungono in rallySVG.
  function poseOn(P, name, w) {
    const p = R4_POSES[name]; if (!p || w <= .001) return;
    const ar = p.armRot || {}, el = p.elbow || {}, af = p.armsFront || {}, hd = p.head || {};
    if (ar.L != null) P.aL += ar.L * w; if (ar.R != null) P.aR += ar.R * w;
    if (el.L != null) P.eL = (P.eL || 0) + el.L * w; if (el.R != null) P.eR = (P.eR || 0) + el.R * w;
    if (af.L && w > .5) P.fL = 1; if (af.R && w > .5) P.fR = 1;
    P.hRot += (hd.rot || 0) * w; P.hDy += (hd.dy || 0) * w; P.hDx += (hd.dx || 0) * w;
    if (!P.pose || w > P.pose.w) P.pose = { name, w: Math.min(1, w) };
    (P._x = P._x || []).push({ name, w });
  }

  // ---------- i gesti di Rally: si scelgono nella scheda dell'episodio (VIDEO.gesti) e si agganciano alle parole ----------
  // ognuno riceve P (la posa del fotogramma), t e g (il gesto, con _t = inizio, _f = fine)
  const bounce = (P, t, t0, f) => { const x = t - t0; if (x >= 0 && x < .7) { const b = ex(-x * 7) * S(TAU * 2.1 * x); P.y += -3.2 * (f || 1) * b; P.earL += 11 * b; P.earR += 11 * b; } };
  const G = {
    // si sporge verso chi guarda e apre il braccio (frase d'apertura)
    sporgi(P, t, g) { const F = g._f != null ? g._f : g._t + 2, w = env(t, g._t - .1, F - .3, .28, .3);
      P.aR += -30 * w; P.eR = (P.eR || 0) - 42 * w; P.aL += 10 * w; P.uRot += .8 * w; P.hRot += -2 * w; },
    // busto un po' più vicino alla camera
    avanti(P, t, g) { const F = g._f != null ? g._f : g._t + 2, w = ease(t, g._t, g._t + .4) * (1 - ease(t, F - .3, F + .1)); P.sy *= 1 + .02 * w; P.sx *= 1 + .02 * w; },
    // piccolo salto di sorpresa, con le orecchie che seguono
    salto(P, t, g) { bounce(P, t, g._t, g.forza); },
    // si gira verso lo schermo (tre quarti) e poi torna: preparazione prima, piccolo rimbalzo dopo
    gira(P, t, g) {
      const tA = g._t, tB = g._f != null ? g._f : tA + (g.durata || 1.12);
      const a1 = E.bump(seg(t, tA - .16, tA + .12)), a2 = E.bump(seg(t, tB - .16, tB + .12));
      const k1 = E.inOut(seg(t, tA, tA + .4)), k2 = E.inOut(seg(t, tB, tB + .4)), yaw = clamp(k1 - k2, 0, 1);
      const ov1 = t > tA + .4 ? ex(-(t - tA - .4) * 6) * S(TAU * 1.3 * (t - tA - .4)) : 0;
      const ov2 = t > tB + .4 ? ex(-(t - tB - .4) * 6) * S(TAU * 1.3 * (t - tB - .4)) : 0;
      P.yaw = Math.max(P.yaw || 0, yaw);
      P.rot += -2.2 * a1 + 3 * ov1 + 1.8 * a2 - 2.6 * ov2;
      P.sy *= 1 - .035 * a1 - .025 * a2 + .03 * E.bump(k1) + .025 * E.bump(k2);
      P.sx *= 1 + .018 * a1 + .012 * a2 - .02 * E.bump(k1) - .015 * E.bump(k2);
      look(P, 0, -3, yaw); P.hRot += -5 * yaw; P.hDy += -1.6 * yaw;
    },
    // la bacchetta: sale all'inizio, tocca lo schermo sulle parole di "tocchi", scende alla fine
    bacchetta(P, t, g) {
      const A = g._t, F = g._f != null ? g._f : A + 4;
      const ant = E.bump(seg(t, A - .06, A + .2)); P.sy *= 1 - .022 * ant; P.sx *= 1 + .012 * ant;
      const w = E.outBack(seg(t, A + .12, A + .5), 1.1) * (1 - E.inOut(seg(t, F - .5, F - .16)));
      let tap = 0; (g._tocchi || []).forEach((tn) => { tap = Math.max(tap, E.bump(seg(t, tn - .08, tn + .22))); });
      P.aR += (-40 - 9 * tap) * w; P.eR = (P.eR || 0) + (-110 + 16 * tap) * w; P.aL += 5 * w;
      if (w > .001) P._ptr = { w, rot: lerp(172, -30 - 10 * tap + 3 * S(TAU * t / 2.3), E.inOut(clamp(w, 0, 1))) };
    },
    // guarda lo schermo (dx, dy spostano lo sguardo)
    guarda(P, t, g) { const F = g._f != null ? g._f : g._t + 1, w = ease(t, g._t, g._t + .22) - ease(t, F, F + .3);
      look(P, g.dx || 0, g.dy == null ? -3 : g.dy, w); P.hRot += (g.rot == null ? 2.4 : g.rot) * w; P.hDy += -1.2 * w; },
    // segue lo schema con gli occhi, da sinistra a destra; resta a guardare fino a "oltre"
    segui(P, t, g) {
      const A = g._t, F = g._f != null ? g._f : A + 2, O = g._o != null ? g._o : F;
      const w = ease(t, A - .1, A + .15) - ease(t, O + .5, O + .8), sw = lerp(-2.4, 2.2, ease(t, A, F));
      look(P, sw, -3, w * .9); P.hRot += (1.6 * sw / 2.4) * w; P.hDy += -1 * w;
    },
    // testa inclinata: una domanda
    inclina(P, t, g) { const F = g._f != null ? g._f : g._t + 1, w = E.bump(seg(t, g._t, F)); P.hRot += 5.5 * w; P.hDx += 1.2 * w; look(P, -1.5, -2.6, w); },
    // orecchie giù: qualcosa che preoccupa
    orecchie(P, t, g) { const w = E.bump(seg(t, g._t, g._t + .8)); P.earL += -15 * w; P.earR += -15 * w; P.hDy += .9 * w; },
    // una posa della libreria di Rally (maniFianchi, indicaCamera, pensa, ...); "sporgi" lo fa avvicinare a metà
    posa(P, t, g) {
      const F = g._f != null ? g._f : g._t + 1.5; poseOn(P, g.nome, env(t, g._t, F, .3, .3));
      if (g._s != null) { const l = E.bump(seg(t, g._s - .25, g._s + .9)); P.sy *= 1 + .022 * l; P.sx *= 1 + .022 * l; P.hRot += -3.5 * l; }
    },
    // alza le spalle: "non cambia nulla"
    spalle(P, t, g) { const F = g._f != null ? g._f : g._t + 1.2, w = env(t, g._t, F, .3, .28); poseOn(P, 'scrollaSpalle', w); P.y += 1.6 * w; },
    // saluto con la mano, a fine episodio
    saluta(P, t, g) {
      const tw = t - (g._t + .02); if (tw <= -.2) return;
      const ant = E.bump(seg(tw, 0, .3)); P.sy *= 1 - .025 * ant; P.sx *= 1 + .012 * ant; P.aR += 7 * ant;
      const up = E.outBack(seg(tw, .18, .55), 1.4) * (1 - E.inOut(seg(tw, 2.5, 3.0)));
      const on = E.smooth(seg(tw, .4, .6)) * (1 - E.smooth(seg(tw, 2.3, 2.55))), ph = TAU * 2.5 * (tw - .55);
      if (up > .5) P.fR = 1;
      if (up > .001) { P.pose = { name: 'saluta', w: Math.min(1, up) }; (P._x = P._x || []).push({ name: 'saluta', w: up }); }
      P.aR += -96 * up + 6 * on * S(ph); P.eR = (P.eR || 0) + (-40 * up + 24 * on * S(ph - 1.0));
      P.hRot += 4.5 * up + .8 * on * S(ph - 1.6); P.hDx += 1 * up; P.rot += .7 * on * S(ph - .4); P.uRot += 1.2 * up; P.aL += -4 * up;
    }
  };

  function recita(P, t) {
    breathe(P, t, .8); blinks(P, t, 11);
    // ingresso: sale da dietro il bancone e si assesta
    P.y += 54 * (1 - E.outBack(seg(t, 0, .46), 1.4));
    const ld = t - .4; if (ld >= 0) { const s = ex(-ld * 9) * Co(TAU * 2.4 * ld); P.sy *= 1 - .06 * s; P.sx *= 1 + .035 * s; }
    // parlato: bocca sulle parole, un cenno a ogni parola
    const L = T.sc.find((s) => t >= s.t0 - .02 && t <= s.t1 + .1);
    if (L) {
      P.mouth = r4MouthAt(L.seq, t - L.t0);
      if (T.env) { const ev = T.env[clamp(Math.round(t * T.envFps), 0, T.env.length - 1)] || 0; if (ev < .05) P.mouth = 'X'; }   // a voce ferma la bocca è chiusa
      let nod = 0, sg = 1;
      L.words.forEach((w, i) => { const b = E.bump(seg(t, w.t, w.t + .3)); if (b > nod) { nod = b; sg = i % 2 ? -1 : 1; } });
      P.hDy += 1.1 * nod; P.hRot += sg * 1.5 * nod;
    }
    // umore: il cambio si nasconde dietro un battito di ciglia
    let mood = 'happy';
    T.umori.forEach((m, i) => { if (t >= m.t) mood = m.u; if (i) P.blink = Math.max(P.blink, E.bump(seg(t, m.t - .08, m.t + .09))); });
    P.mood = mood;
    P.yaw = 0;
    T.gesti.forEach((g) => G[g.g](P, t, g));
    ['eL', 'eR'].forEach((k) => { if (P[k] != null && Math.abs(P[k]) < .02) P[k] = null; });
  }

  function rallySVG(t, uid) {
    const ps = R4M.pose('tg', t, {}), P = ps.raw, o = ps.o;
    const xs = (P._x || []).filter((x) => x.w > .02).sort((a, b) => b.w - a.w), top = xs[0];
    if (top) {
      const turned = P.yaw > .02, w = Math.min(1, top.w);
      const src = turned ? r4PoseBlend(top.name, Math.min(2, P.yaw)) : R4_POSES[top.name];
      if (!turned) {
        if (src.reach) { o.reach = {}; for (const sd in src.reach) o.reach[sd] = +(1 + (src.reach[sd] - 1) * w).toFixed(3); }
        if (src.foreshorten) { o.foreshorten = {}; for (const sd in src.foreshorten) o.foreshorten[sd] = +(src.foreshorten[sd] * w).toFixed(3); }
        if (w > .5 && src.hoof) o.hoof = src.hoof;
      }
      if (w > .5 && src.hold) o.hold = src.hold;
    }
    if (P._ptr && P._ptr.w > .03) o.hold = Object.assign({}, o.hold || {}, { R: { item: 'pointer', rot: +P._ptr.rot.toFixed(1), scale: 1.7 } });
    return R4M.svg(ps, RW, uid);
  }

  // ---------- piccoli disegni dello schermo (originali, nello stile dell'app) ----------
  const ST = (w) => `stroke="${C.ink}" stroke-width="${w || 7}" stroke-linejoin="round" stroke-linecap="round"`;
  function bulb(cx, by, s, on, t) {   // lampadina: base in (cx,by)
    let g = `<g transform="translate(${cx} ${by}) scale(${s})">`;
    if (on) for (let i = 0; i < 7; i++) { const a = (-90 + (i - 3) * 34) * Math.PI / 180, r1 = 70 + 4 * S(TAU * (t || 0) / 1.4 + i), r2 = r1 + 20; g += `<path d="M${(Co(a) * r1).toFixed(1)} ${(-102 + S(a) * r1).toFixed(1)} L${(Co(a) * r2).toFixed(1)} ${(-102 + S(a) * r2).toFixed(1)}" ${ST(7)} fill="none"/>`; }
    g += `<path d="M0 -150 C30 -150 50 -128 50 -102 C50 -84 40 -72 30 -60 C24 -52 22 -46 22 -38 H-22 C-22 -46 -24 -52 -30 -60 C-40 -72 -50 -84 -50 -102 C-50 -128 -30 -150 0 -150 Z" fill="${on ? C.giallo : '#fff'}" ${ST(7)}/>` +
      `<path d="M-13 -62 L0 -84 L13 -62" fill="none" ${ST(5)}/><rect x="-21" y="-38" width="42" height="30" rx="7" fill="${C.grigio}" ${ST(7)}/><path d="M-21 -23 H21" ${ST(5)}/>` +
      `<path d="M-28 -120 C-22 -132 -12 -138 -2 -139" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity="${on ? .9 : 0}"/></g>`;
    return g;
  }
  function flame(cx, by, s, t) {       // fiamma: base in (cx,by), tremola un poco
    const w = 1 + .04 * S(TAU * t / .5), h = 1 + .05 * S(TAU * t / .37 + 1);
    return `<g transform="translate(${cx} ${by}) scale(${(s * w).toFixed(3)} ${(s * h).toFixed(3)})">` +
      `<path d="M0 -122 C26 -88 48 -64 48 -34 C48 -8 27 8 0 8 C-27 8 -48 -8 -48 -34 C-48 -54 -36 -66 -26 -80 C-22 -68 -14 -62 -8 -64 C-16 -86 -8 -106 0 -122 Z" fill="${C.fuoco}" ${ST(7)}/>` +
      `<path d="M0 -60 C12 -46 23 -36 23 -21 C23 -8 13 0 0 0 C-13 0 -23 -8 -23 -21 C-23 -33 -10 -44 0 -60 Z" fill="${C.giallo}"/></g>`;
  }
  function plant(cx, by, t) {          // centrale: base in (cx,by), con il fumo che sale
    let g = `<g transform="translate(${cx} ${by})">`;
    g += `<rect x="34" y="-158" width="32" height="92" fill="${C.lillaD}" ${ST(7)}/>` +
      `<path d="M-84 0 V-74 L-38 -102 V-74 L8 -102 V-74 H84 V0 Z" fill="${C.lilla}" ${ST(7)}/>` +
      [-62, -14, 34].map((x) => `<rect x="${x}" y="-50" width="26" height="26" rx="4" fill="#fff" ${ST(5)}/>`).join('') + `</g>`;
    return g;
  }
  function coin(cx, cy, r, rot) {
    return `<g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${(rot || 0).toFixed(1)})"><circle r="${r}" fill="${C.giallo}" ${ST(7)}/><circle r="${r - 12}" fill="none" stroke="${C.ink}" stroke-width="4" opacity=".35"/>` +
      `<text x="0" y="${r * .36}" text-anchor="middle" font-family="${DISP}" font-weight="800" font-size="${r * 1.05}" fill="${C.ink}">€</text></g>`;
  }
  function house(cx, by, s) {
    return `<g transform="translate(${cx} ${by}) scale(${s})"><path d="M-30 0 V-34 H30 V0 Z" fill="#fff" ${ST(6)}/><path d="M-40 -32 L0 -64 L40 -32 Z" fill="${C.pesca}" ${ST(6)}/><rect x="-9" y="-22" width="18" height="22" rx="3" fill="${C.az}" ${ST(5)}/></g>`;
  }
  function arrow(x1, y, x2, t) {       // freccia con i trattini che scorrono
    const off = -((t * 46) % 28);
    return `<path d="M${x1} ${y} H${x2 - 10}" fill="none" stroke="${C.ink}" stroke-width="7" stroke-linecap="round" stroke-dasharray="14 14" stroke-dashoffset="${off.toFixed(1)}"/>` +
      `<path d="M${x2 - 22} ${y - 15} L${x2} ${y} L${x2 - 22} ${y + 15}" fill="none" ${ST(7)}/>`;
  }
  function chip(cx, cy, txt, o) {      // etichetta centrata in (cx,cy)
    o = o || {}; const fs = o.fs || 30, k = o.k == null ? 1 : o.k; if (k <= .001) return '';
    return `<div style="position:absolute;left:${px(cx)};top:${px(cy)};transform:translate(-50%,-50%) rotate(${o.rot || 0}deg) scale(${k.toFixed(3)});white-space:nowrap;` +
      `font:700 ${fs}px/1 ${o.disp ? DISP : MONO};letter-spacing:${o.disp ? '-.01em' : '.02em'};color:${o.fg || C.ink};background:${o.bg || '#fff'};border:${o.bd == null ? 5 : o.bd}px solid ${C.ink};` +
      `border-radius:${o.r == null ? 14 : o.r}px;padding:${Math.round(fs * .36)}px ${Math.round(fs * .56)}px;${o.sh ? `box-shadow:0 ${o.sh}px 0 ${C.ink};` : ''}">${txt}</div>`;
  }
  const tab = (txt, t, t0) => `<div style="position:absolute;left:30px;top:26px;transform-origin:0 50%;transform:scale(${pop(t, t0, .26, 1.4).toFixed(3)});white-space:nowrap;font:700 25px/1 ${MONO};letter-spacing:.06em;color:#fff;background:${C.ink};border-radius:10px;padding:10px 15px">${txt}</div>`;
  const svgL = (inner) => `<svg style="position:absolute;left:0;top:0;overflow:visible" width="${MW}" height="${MH}" viewBox="0 0 ${MW} ${MH}">${inner}</svg>`;

  // ---------- icone: disegnate qui, base in (0,0), alte circa 150 ----------
  const ICON_W = { lampadina: 50, fiamma: 48, centrale: 84, casa: 80, moneta: 52, barile: 50, banca: 84, carrello: 84, salvadanaio: 80, banconota: 74, persone: 82, grafico: 72,
    secchio: 66, pin: 52, aereo: 88, collegio: 88, diploma: 82, piatti: 80, tazza: 78, chip: 74, joypad: 94, clessidra: 56, scheda: 90, coppa: 74, cervello: 90, server: 58, provetta: 62, chat: 94, giacca: 94 };
  function icona(n, t, on) {
    switch (n) {
      case 'lampadina': return bulb(0, 0, 1, on, t);
      case 'fiamma': return flame(0, 0, 1, t);
      case 'centrale': return plant(0, 0, t);
      case 'casa': return `<path d="M-60 0 V-78 H60 V0 Z" fill="#fff" ${ST(7)}/><path d="M-80 -74 L0 -148 L80 -74 Z" fill="${C.pesca}" ${ST(7)}/><rect x="-20" y="-50" width="40" height="50" rx="6" fill="${C.az}" ${ST(6)}/>`;
      case 'moneta': return coin(0, -56, 52, 0);
      case 'barile': return `<rect x="-50" y="-150" width="100" height="150" rx="16" fill="${C.mut}" ${ST(7)}/><path d="M-50 -104 H50 M-50 -46 H50" ${ST(6)}/>` +
        `<path d="M0 -94 C14 -76 21 -67 21 -58 C21 -46 12 -39 0 -39 C-12 -39 -21 -46 -21 -58 C-21 -67 -14 -76 0 -94 Z" fill="${C.ink}" stroke="#fff" stroke-width="5"/>` +
        `<path d="M-32 -138 V-120" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".55"/>`;
      case 'banca': return `<path d="M-84 -104 L0 -152 L84 -104 Z" fill="${C.pesca}" ${ST(7)}/><rect x="-76" y="-104" width="152" height="16" fill="#fff" ${ST(6)}/>` +
        [-52, -18, 18, 52].map((x) => `<rect x="${x - 9}" y="-88" width="18" height="66" fill="#fff" ${ST(5)}/>`).join('') + `<rect x="-86" y="-22" width="172" height="22" rx="5" fill="${C.grigio}" ${ST(7)}/>`;
      case 'carrello': return `<path d="M-50 -110 H76 L58 -42 H-34 Z" fill="#fff" ${ST(7)}/><path d="M-86 -130 H-62 L-34 -42" fill="none" ${ST(7)}/><path d="M-40 -78 H66" ${ST(5)}/>` +
        `<circle cx="-24" cy="-16" r="14" fill="${C.ink}"/><circle cx="48" cy="-16" r="14" fill="${C.ink}"/>`;
      case 'salvadanaio': return `<rect x="-44" y="-36" width="22" height="34" rx="6" fill="${C.rosa}" ${ST(6)}/><rect x="16" y="-36" width="22" height="34" rx="6" fill="${C.rosa}" ${ST(6)}/>` +
        `<ellipse cx="0" cy="-72" rx="70" ry="52" fill="${C.rosa}" ${ST(7)}/><path d="M-30 -118 L-16 -146 L0 -120" fill="${C.rosa}" ${ST(6)}/>` +
        `<ellipse cx="62" cy="-70" rx="16" ry="20" fill="#FF9DB5" ${ST(6)}/><circle cx="58" cy="-74" r="3.5" fill="${C.ink}"/><circle cx="66" cy="-64" r="3.5" fill="${C.ink}"/>` +
        `<circle cx="30" cy="-92" r="6" fill="${C.ink}"/><rect x="-22" y="-128" width="40" height="9" rx="4" fill="${C.ink}"/>` +
        `<path d="M-70 -78 C-86 -80 -88 -98 -76 -100" fill="none" ${ST(6)}/>`;
      case 'banconota': return `<rect x="-74" y="-112" width="148" height="86" rx="12" fill="${C.menta}" ${ST(7)}/><circle cx="0" cy="-69" r="27" fill="#fff" ${ST(6)}/>` +
        `<text x="0" y="-56" text-anchor="middle" font-family="${DISP}" font-weight="800" font-size="38" fill="${C.ink}">€</text>` +
        `<circle cx="-50" cy="-90" r="6" fill="${C.ink}"/><circle cx="50" cy="-48" r="6" fill="${C.ink}"/>`;
      case 'persone': return [[-50, C.pesca, .86], [50, C.az, .86], [0, C.menta, 1]].map(([x, c, s]) =>
        `<g transform="translate(${x} 0) scale(${s})"><path d="M-40 0 C-40 -40 -22 -62 0 -62 C22 -62 40 -40 40 0 Z" fill="${c}" ${ST(7)}/><circle cx="0" cy="-96" r="28" fill="${c}" ${ST(7)}/></g>`).join('');
      case 'grafico': return `<rect x="-72" y="-146" width="144" height="140" rx="16" fill="#fff" ${ST(7)}/><path d="M-50 -36 L-18 -70 L6 -54 L46 -110" fill="none" ${ST(8)}/>` +
        `<path d="M24 -112 L48 -112 L48 -88" fill="none" ${ST(8)}/>`;
      // --- icone degli speciali (storie di persone e aziende): oggetti e luoghi, mai ritratti ---
      case 'secchio': return `<path d="M30 -96 L74 -158" fill="none" ${ST(8)}/>` +
        `<path d="M-58 -98 H58 L46 -6 C45 -2 42 0 38 0 H-38 C-42 0 -45 -2 -46 -6 Z" fill="${C.az}" ${ST(7)}/>` +
        `<path d="M-50 -100 C-50 -146 50 -146 50 -100" fill="none" ${ST(6)}/><path d="M-66 -102 H66" ${ST(10)}/>` +
        `<path d="M-38 -60 H36" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".65"/>` +
        [[-24, -114, 13], [4, -120, 16], [32, -112, 11]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${ST(5)}/>`).join('');
      case 'pin': return `<ellipse cx="0" cy="-4" rx="34" ry="9" fill="${C.ink}" opacity=".22"/>` +
        `<path d="M0 -4 C-12 -34 -52 -66 -52 -104 C-52 -134 -28 -156 0 -156 C28 -156 52 -134 52 -104 C52 -66 12 -34 0 -4 Z" fill="${C.rosa}" ${ST(7)}/><circle cx="0" cy="-104" r="20" fill="#fff" ${ST(6)}/>`;
      case 'aereo': return `<g transform="rotate(-14 0 -74)"><path d="M-14 -84 L-46 -140 H-22 L22 -84 Z" fill="${C.az}" ${ST(6)}/>` +
        `<path d="M-84 -76 C-84 -90 -70 -96 -52 -96 H56 C76 -96 90 -86 90 -74 C90 -62 76 -54 56 -54 H-52 C-70 -54 -84 -62 -84 -76 Z" fill="#fff" ${ST(7)}/>` +
        `<path d="M-76 -92 L-90 -130 H-66 L-46 -94 Z" fill="${C.az}" ${ST(6)}/><path d="M-18 -64 L-52 -12 H-26 L24 -64 Z" fill="${C.az}" ${ST(6)}/>` +
        [-32, -10, 12, 34].map((x) => `<circle cx="${x}" cy="-80" r="6" fill="${C.azL}" stroke="${C.ink}" stroke-width="4"/>`).join('') +
        `<path d="M62 -88 C72 -88 80 -84 85 -78 H62 Z" fill="${C.ink}"/></g>`;
      case 'collegio': return `<path d="M0 -130 V-160" ${ST(6)}/><path d="M0 -160 L30 -152 L0 -144 Z" fill="${C.rosa}" ${ST(5)}/>` +
        `<path d="M-88 -90 L0 -132 L88 -90 Z" fill="${C.lilla}" ${ST(7)}/><rect x="-80" y="-90" width="160" height="90" fill="${C.pesca}" ${ST(7)}/>` +
        `<path d="M-15 0 V-38 C-15 -50 15 -50 15 -38 V0" fill="${C.az}" ${ST(6)}/><circle cx="0" cy="-104" r="10" fill="#fff" ${ST(5)}/>` +
        [-58, -34, 34, 58].map((x) => `<rect x="${x - 9}" y="-72" width="18" height="22" rx="3" fill="#fff" ${ST(5)}/>`).join('');
      case 'diploma': return `<g transform="rotate(-14 0 -66)"><rect x="-74" y="-92" width="148" height="52" rx="10" fill="#fff" ${ST(7)}/>` +
        `<ellipse cx="-74" cy="-66" rx="12" ry="26" fill="${C.grigio}" ${ST(6)}/><ellipse cx="74" cy="-66" rx="12" ry="26" fill="#fff" ${ST(6)}/>` +
        `<path d="M-40 -74 H-22 M-40 -58 H-26 M24 -74 H44 M28 -58 H44" ${ST(4)} opacity=".45"/>` +
        `<rect x="-12" y="-95" width="24" height="58" fill="${C.rosa}" ${ST(5)}/><path d="M-6 -40 L-22 -2 L-10 -8 L-4 4 L8 -40 Z" fill="${C.rosa}" ${ST(5)}/></g>`;
      case 'piatti': return [0, 1, 2].map((k) => { const y = -18 - k * 22; return `<ellipse cx="0" cy="${y}" rx="${80 - k * 4}" ry="17" fill="#fff" ${ST(6)}/><ellipse cx="0" cy="${y - 2}" rx="${46 - k * 3}" ry="8" fill="none" stroke="${C.grigio}" stroke-width="5"/>`; }).join('') +
        [[-36, -110, 14], [-8, -128, 18], [24, -108, 12], [48, -134, 9]].map(([x, y, r], i) => { const yy = y - 5 * S(TAU * (t || 0) / 2.2 + i * 1.7);
          return `<circle cx="${x}" cy="${yy.toFixed(1)}" r="${r}" fill="${C.azL}" ${ST(5)}/><circle cx="${(x - r * .35).toFixed(1)}" cy="${(yy - r * .35).toFixed(1)}" r="${(r * .22).toFixed(1)}" fill="#fff"/>`; }).join('');
      case 'tazza': return `<ellipse cx="0" cy="-6" rx="78" ry="12" fill="${C.grigio}" ${ST(6)}/><path d="M48 -82 C86 -82 86 -36 44 -38" fill="none" ${ST(8)}/>` +
        `<path d="M-52 -96 H52 L44 -30 C42 -16 30 -12 18 -12 H-18 C-30 -12 -42 -16 -44 -30 Z" fill="#fff" ${ST(7)}/><path d="M-41 -66 H41" stroke="${C.pesca}" stroke-width="12"/>` +
        [-18, 14].map((x, i) => `<path d="M${x} -110 C${x - 12} -122 ${x + 12} -132 ${x} -146" fill="none" ${ST(6)} opacity="${(.55 + .45 * S(TAU * (t || 0) / 1.6 + i * 2)).toFixed(2)}"/>`).join('');
      case 'chip': { let g = `<rect x="-58" y="-136" width="116" height="116" rx="14" fill="${C.mut}" ${ST(7)}/><rect x="-34" y="-112" width="68" height="68" rx="8" fill="${C.menta}" ${ST(6)}/>`;
        for (let k = 0; k < 4; k++) { const o = (-40 + k * 26.7).toFixed(1), q = (-78 - 40 + k * 26.7).toFixed(1); g += `<path d="M${o} -136 V-152 M${o} -20 V-4 M-58 ${q} H-74 M58 ${q} H74" ${ST(6)}/>`; }
        return g + `<path d="M-20 -96 L-6 -82" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".8"/>`; }
      case 'joypad': return `<path d="M-60 -112 H60 C84 -112 96 -92 96 -66 C96 -30 82 -8 64 -14 C54 -18 46 -34 36 -42 H-36 C-46 -34 -54 -18 -64 -14 C-82 -8 -96 -30 -96 -66 C-96 -92 -84 -112 -60 -112 Z" fill="${C.lilla}" ${ST(7)}/>` +
        `<path d="M-56 -88 V-50 M-75 -69 H-37" stroke="${C.ink}" stroke-width="13" stroke-linecap="round"/>` +
        [[44, -84, C.rosa], [66, -63, C.giallo], [22, -63, C.menta], [44, -42, C.az]].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="11" fill="${c}" ${ST(5)}/>`).join('');
      case 'clessidra': { const ph = ((t || 0) % 4) / 4, top = 1 - ph * .8;
        return `<path d="M-42 -138 C-42 -100 -8 -90 -8 -76 C-8 -62 -42 -52 -42 -14 H42 C42 -52 8 -62 8 -76 C8 -90 42 -100 42 -138 Z" fill="#fff" ${ST(7)}/>` +
          `<path d="M${(-30 * top).toFixed(1)} ${(-88 - 32 * top).toFixed(1)} H${(30 * top).toFixed(1)} L0 -80 Z" fill="${C.giallo}"/>` +
          `<path d="M-34 -18 C-24 ${(-26 - 24 * ph).toFixed(1)} 24 ${(-26 - 24 * ph).toFixed(1)} 34 -18 Z" fill="${C.giallo}"/>` +
          `<path d="M0 -80 V-22" stroke="${C.giallo}" stroke-width="4" stroke-dasharray="6 6" stroke-dashoffset="${(-((t || 0) * 40) % 12).toFixed(1)}"/>` +
          `<rect x="-56" y="-152" width="112" height="16" rx="6" fill="${C.pesca}" ${ST(6)}/><rect x="-56" y="-16" width="112" height="16" rx="6" fill="${C.pesca}" ${ST(6)}/>`; }
      case 'scheda': { const r = ((t || 0) * 400) % 360;
        return `<rect x="-90" y="-118" width="14" height="96" rx="4" fill="${C.grigio}" ${ST(6)}/><rect x="-78" y="-110" width="164" height="76" rx="12" fill="${C.mut}" ${ST(7)}/>` +
          `<rect x="-46" y="-36" width="96" height="14" rx="3" fill="${C.giallo}" ${ST(5)}/>` +
          [-38, 42].map((cx) => `<g transform="translate(${cx} -72)"><circle r="28" fill="#fff" ${ST(6)}/><g transform="rotate(${r.toFixed(1)})">` +
            [0, 120, 240].map((a) => `<path d="M0 0 C7 -10 5 -20 -4 -24" fill="none" stroke="${C.ink}" stroke-width="6" stroke-linecap="round" transform="rotate(${a})"/>`).join('') + `</g><circle r="6" fill="${C.ink}"/></g>`).join(''); }
      case 'coppa': return `<path d="M-50 -140 C-84 -140 -86 -98 -46 -92 M50 -140 C84 -140 86 -98 46 -92" fill="none" ${ST(7)}/>` +
        `<path d="M-54 -150 H54 C54 -100 32 -76 0 -76 C-32 -76 -54 -100 -54 -150 Z" fill="${C.giallo}" ${ST(7)}/><rect x="-11" y="-78" width="22" height="34" fill="${C.giallo}" ${ST(6)}/>` +
        `<rect x="-40" y="-46" width="80" height="18" rx="5" fill="${C.pesca}" ${ST(6)}/><rect x="-56" y="-30" width="112" height="30" rx="7" fill="${C.mut}" ${ST(7)}/>` +
        `<path d="M-30 -132 C-30 -112 -20 -100 -8 -94" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".7"/>`;
      case 'cervello': return `<path d="M-6 -146 C-30 -160 -64 -150 -70 -124 C-94 -118 -100 -88 -84 -72 C-94 -50 -78 -24 -52 -26 C-40 -8 -14 -8 -6 -22 Z" fill="${C.rosa}" ${ST(7)}/>` +
        `<path d="M6 -146 C30 -160 64 -150 70 -124 C94 -118 100 -88 84 -72 C94 -50 78 -24 52 -26 C40 -8 14 -8 6 -22 Z" fill="${C.rosa}" ${ST(7)}/>` +
        `<path d="M-60 -110 C-44 -112 -38 -98 -46 -88 M-30 -62 C-44 -64 -50 -50 -40 -42 M44 -112 C58 -104 56 -90 44 -86 M36 -60 C50 -66 60 -54 54 -42" fill="none" ${ST(5)}/>` +
        [[-30, -126], [26, -64], [-56, -54], [60, -98]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="7" fill="${Math.floor((t || 0) * 3 + i) % 2 ? C.giallo : '#fff'}" ${ST(4)}/>`).join('');
      case 'server': return `<rect x="-58" y="-156" width="116" height="156" rx="12" fill="${C.mut}" ${ST(7)}/>` +
        [0, 1, 2, 3].map((k) => { const y = -140 + k * 34; return `<rect x="-42" y="${y}" width="84" height="24" rx="5" fill="${C.lilla}" ${ST(5)}/>` +
          `<circle cx="-26" cy="${y + 12}" r="5" fill="${Math.floor((t || 0) * 4 + k * 1.7) % 3 ? C.menta : C.giallo}"/><path d="M-10 ${y + 12} H30" stroke="${C.ink}" stroke-width="4" stroke-linecap="round" opacity=".5"/>`; }).join('');
      case 'provetta': return `<path d="M-20 -150 H20 V-104 L62 -20 C68 -8 60 0 48 0 H-48 C-60 0 -68 -8 -62 -20 L-20 -104 Z" fill="#fff" ${ST(7)}/>` +
        `<path d="M-43 -50 H43 L56 -23 C60 -15 55 -9 47 -9 H-47 C-55 -9 -60 -15 -56 -23 Z" fill="${C.menta}"/><path d="M-30 -150 H30" ${ST(8)}/>` +
        [[-14, -68, 7], [10, -86, 5], [4, -60, 4]].map(([x, y, r], i) => `<circle cx="${x}" cy="${(y - 8 * (((t || 0) * .8 + i * .33) % 1)).toFixed(1)}" r="${r}" fill="#fff" ${ST(4)}/>`).join('');
      case 'chat': return `<path d="M-74 -146 H74 C86 -146 94 -138 94 -126 V-62 C94 -50 86 -42 74 -42 H-16 L-52 -10 L-44 -42 H-74 C-86 -42 -94 -50 -94 -62 V-126 C-94 -138 -86 -146 -74 -146 Z" fill="#fff" ${ST(7)}/>` +
        [-36, 0, 36].map((x, i) => `<circle cx="${x}" cy="${(-94 - 9 * E.bump((((t || 0) * 1.6 + i * .18) % 1))).toFixed(1)}" r="11" fill="${C.ink}"/>`).join('');
      case 'giacca': return `<path d="M-30 -150 L-78 -132 C-90 -126 -94 -116 -94 -104 L-92 -26 C-92 -18 -86 -14 -78 -16 L-66 -20 L-62 -96 L-58 0 H58 L62 -96 L66 -20 L78 -16 C86 -14 92 -18 92 -26 L94 -104 C94 -116 90 -126 78 -132 L30 -150 Z" fill="#2E3036" ${ST(7)}/>` +
        `<path d="M-24 -150 L0 -110 L24 -150 Z" fill="#fff" ${ST(5)}/><path d="M0 -110 V-4" stroke="${C.grigio}" stroke-width="4" stroke-dasharray="5 4"/>` +
        `<path d="M-30 -150 L-46 -112 L-26 -100 L-8 -40 L0 -110 Z" fill="#44474F" ${ST(5)}/><path d="M30 -150 L46 -112 L26 -100 L8 -40 L0 -110 Z" fill="#44474F" ${ST(5)}/>` +
        `<path d="M-82 -112 C-82 -92 -80 -72 -78 -56 M72 -124 C76 -114 78 -102 78 -90" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".35"/>`;
      default: return `<circle cx="0" cy="-70" r="60" fill="#fff" ${ST(7)}/><text x="0" y="-48" text-anchor="middle" font-family="${DISP}" font-weight="800" font-size="64" fill="${C.ink}">?</text>`;
    }
  }
  const tinta = (n, def) => (n && C[n]) || (n === 'bianco' ? '#fff' : def || '#fff');
  const segno = (n) => n === 'uguale' ? `<path d="M9 16 H37 M9 30 H37" fill="none" ${ST(8)}/>` : n === 'no' ? `<path d="M12 12 L34 34 M34 12 L12 34" fill="none" ${ST(8)}/>` : `<path d="M9 24 L19 34 L37 13" fill="none" ${ST(8)}/>`;

  // ---------- le schermate: modelli riusabili, riempiti dalla scheda dell'episodio (VIDEO.schermi) ----------
  // titolo: righe (2), evid (indice della riga evidenziata), icona, timbro {testo, a}
  function scTitolo(t, S) {
    let h = tab(S.etichetta || 'LA NOTIZIA', t, S.t0 + .04);
    const ic0 = S.icona && (typeof S.icona === 'string' ? S.icona : S.icona.nome), iw = ic0 ? (ICON_W[ic0] || 60) : 0;
    const avail = ic0 ? 600 - Math.max(0, iw - 50) * 1.25 - (iw > 50 ? 20 : 0) : 720;     // le righe non finiscono sotto un'icona larga
    const R = S.righe || [], n = Math.max(1, ...R.map((r) => r.length)), fs = Math.round(Math.min(124, avail / (.55 * n)));
    h += `<div style="position:absolute;left:44px;top:${Math.round(92 + (124 - fs) * .7)}px;font:800 ${fs}px/1.02 ${DISP};letter-spacing:-.035em;color:${C.ink};white-space:nowrap">` +
      R.map((r, i) => {
        const k = pop(t, S.t0 + .06 + .12 * i, .3, 1.2);
        const inner = i === S.evid ? `<span style="background:linear-gradient(transparent 56%,${C.giallo} 56%);padding:0 12px;margin-left:-12px">${esc(r)}</span>` : esc(r);
        return `<div style="transform:translateY(${px(36 * (1 - k))});opacity:${k > 0 ? 1 : 0}">${inner}</div>`;
      }).join('') + `</div>`;
    const ic = S.icona && (typeof S.icona === 'string' ? { nome: S.icona } : S.icona);   // icona: nome, oppure {nome, a} per farla entrare su una parola
    if (ic) { const kb = pop(t, ic._t != null ? ic._t : S.t0 + .22, .36, 1.6); if (kb > 0) h += svgL(`<g transform="translate(676 262) scale(${(1.25 * kb).toFixed(3)})">${icona(ic.nome, t, true)}</g>`); }
    const st = S.timbro;
    if (st && t >= st._t) { const tw = st.testo.length * 25 + 70, tx = Math.min(590, MW - 46 - tw / 2);   // un timbro lungo si sposta a sinistra per restare nello schermo
      h += chip(tx, 352, esc(st.testo), { bg: tinta(st.colore, C.menta), fs: 37, k: 2.4 - 1.4 * E.outBack(seg(t - st._t, 0, .2), 1.2), rot: -8, bd: 7, r: 12, sh: 7 }); }
    return h;
  }
  // numero: parti [{testo, a}] (la prima arriva con un colpo, le altre scivolano), chips [{testo, icona, colore, a}], fonte
  function scNumero(t, S) {
    let h = tab(S.etichetta || 'IL NUMERO', t, S.t0 + .02);
    const P = S.parti || [], n = Math.max(1, P.reduce((a, p) => a + p.testo.length, 0)), fs = Math.round(Math.min(200, 760 / (.56 * n)));
    h += `<div style="position:absolute;left:0;top:${Math.round(74 + (200 - fs) * .5)}px;width:${MW}px;text-align:center;font:800 ${fs}px/1 ${DISP};letter-spacing:-.045em;color:${C.ink};white-space:nowrap">` +
      P.map((p, i) => {
        const x = t - p._t, txt = esc(p.testo).replace(/ /g, '&nbsp;');
        if (x < 0) return `<span style="display:inline-block;opacity:0">${txt}</span>`;
        if (!i) return `<span style="display:inline-block;transform:scale(${(1.9 - .9 * E.outBack(seg(x, 0, .24), 1.3)).toFixed(3)})">${txt}</span>`;
        const k = E.outBack(seg(x, 0, .3), 1.8);
        return `<span style="display:inline-block;transform-origin:0 60%;transform:translateX(${px(70 * (1 - k))}) scale(${(.6 + .4 * k).toFixed(3)})">${txt}</span>`;
      }).join('') + `</div>`;
    const CH = S.chips || [];
    if (CH.length) h += `<div style="position:absolute;left:0;top:316px;width:${MW}px;transform:translateY(-50%);display:flex;justify-content:center;gap:30px">` + CH.map((c) => {
      const k = pop(t, c._t, .3);
      return `<div style="transform:scale(${k.toFixed(3)});display:flex;align-items:center;gap:12px;white-space:nowrap;font:700 38px/1 ${DISP};color:${C.ink};background:${tinta(c.colore)};border:5px solid ${C.ink};border-radius:16px;padding:10px 20px 10px ${c.icona ? 12 : 20}px">` +
        (c.icona ? `<svg width="50" height="50" viewBox="-90 -160 180 170" style="overflow:visible">${icona(c.icona, t, true)}</svg>` : '') + `${esc(c.testo)}</div>`;
    }).join('') + `</div>`;
    const lastT = P.length ? P[P.length - 1]._t : S.t0;
    if (S.fonte) h += `<div style="position:absolute;right:34px;top:372px;font:600 25px/1 ${MONO};color:${C.mut};opacity:${E.out(seg(t, lastT + .2, lastT + .5)).toFixed(2)}">${esc(S.fonte)}</div>`;
    return h;
  }
  // catena: passi [{icona, nome}] (2 o 3) collegati da frecce; note [{testo, passo, colore, lato, a}];
  // fx [{tipo:'cresce'|'moneta'|'accendi', passo, a, fino}] e [{tipo:'prezzo', passo, su, giu}]
  function scCatena(t, S) {
    let h = tab(S.etichetta || 'COME FUNZIONA', t, S.t0 + .06);
    const P = S.passi || [], X = P.length === 2 ? [230, 590] : [142, 402, 640], base = 326, SC = P.length === 2 ? [1.3, 1.3] : [1.25, 1.15, 1.12];
    const FX = S.fx || [], sx = (i) => (P[i].scala || SC[i]);
    let g = '';
    const ks = P.map((p, i) => pop(t, p._t != null ? p._t : S.t0 + .13 + .11 * i, .3));   // un passo con "a" entra sulla sua parola
    P.forEach((p, i) => {
      let gr = 0; FX.filter((f) => f.tipo === 'cresce' && f.passo === i).forEach((f) => { gr = Math.max(gr, ease(t, f._t, f._t + .5) * (f._f != null ? 1 - .6 * ease(t, f._f - .1, f._f + .45) : 1)); });
      const on = FX.some((f) => f.tipo === 'accendi' && f.passo === i && t >= f._t + .17);
      g += `<g transform="translate(${X[i]} ${base}) scale(${(sx(i) * ks[i] * (1 + .18 * gr)).toFixed(3)})">${icona(p.icona, t, on)}</g>`;
      if (i && ks[i] > .9) g += arrow(X[i - 1] + (ICON_W[P[i - 1].icona] || 60) * sx(i - 1) + 14, base - 54, X[i] - (ICON_W[p.icona] || 60) * sx(i) - 12, t);
    });
    FX.filter((f) => f.tipo === 'moneta').forEach((f) => {   // la moneta cade sul passo e rimbalza
      const x = t - f._t; if (x < 0) return;
      const fall = E.in(seg(x, 0, .26)), bn = x > .26 ? ex(-(x - .26) * 7) * Math.abs(Math.sin(TAU * 1.9 * (x - .26))) : 0;
      g += coin(X[f.passo] - 30, lerp(-80, base - 148, fall) - 46 * bn, 36, 360 * seg(x, 0, .5));
    });
    h += svgL(g);
    FX.filter((f) => f.tipo === 'prezzo').forEach((f) => {   // il cartellino del prezzo sale e poi scende
      const i = f.passo; if (ks[i] <= .9) return;
      const up = f._su != null ? ease(t, f._su, f._su + .5) : 0, dn = f._giu != null ? ease(t, f._giu - .1, f._giu + .45) : 0;
      const y = lerp(lerp(160, 112, up), 190, dn), bg = dn > .5 ? C.menta : up > .5 ? C.rosa : '#fff';
      h += `<div style="position:absolute;left:${X[i] + 118}px;top:${px(y)};transform:translate(-50%,-50%);display:flex;align-items:center;gap:6px;font:800 40px/1 ${DISP};color:${C.ink};background:${bg};border:5px solid ${C.ink};border-radius:14px;padding:8px 12px">${esc(f.simbolo || '€')}<span style="font-size:34px">${dn > .5 ? '↓' : up > .5 ? '↑' : ''}</span></div>`;
    });
    P.forEach((p, i) => { if (p.nome) h += chip(X[i], base + 46, esc(p.nome), { fs: 27, bd: 0, bg: 'transparent', k: ks[i] }); });
    (S.note || []).forEach((nt, j) => {
      const i = nt.passo || 0, right = nt.lato === 'destra';
      h += chip(right ? X[i] + 112 : X[i] + (j % 2 ? -6 : 8), right ? 262 : 100 - (j % 2) * 4, esc(nt.testo), { bg: tinta(nt.colore, C.giallo), fs: 27, k: pop(t, nt._t, .3), rot: [-3, 2, -2][j % 3] });
    });
    return h;
  }
  // scelta: domanda e cartellini [{titolo, nota, colore, notaColore, segno, a, pulse}]: compaiono spenti e si accendono sulla parola
  function card(y, on, bg, icon, titolo, nota, notaBg, k, pulse) {
    if (k <= .001) return '';
    const kn = pop(on, 0, 1, 1.8);
    return `<div style="position:absolute;left:40px;top:${y}px;width:${MW - 80}px;height:110px;box-sizing:border-box;transform:scale(${(k * (1 + .04 * E.bump(on))).toFixed(3)});display:flex;align-items:center;gap:20px;padding:0 22px;background:${on > .5 ? bg : '#F1F3F7'};border:7px solid ${C.ink};border-radius:26px;box-shadow:0 8px 0 ${C.ink}">` +
      `<div style="flex:none;width:66px;height:66px;border-radius:50%;background:#fff;border:6px solid ${C.ink};display:flex;align-items:center;justify-content:center;font:800 44px/1 ${DISP}">${on > .5 ? icon : '?'}</div>` +
      `<div style="flex:1;font:800 48px/1 ${DISP};letter-spacing:-.025em;white-space:nowrap">${titolo}</div>` +
      (on > .02 && nota ? `<div style="flex:none;transform:scale(${(kn * (1 + .1 * (pulse || 0))).toFixed(3)});font:700 28px/1 ${MONO};background:${notaBg};border:5px solid ${C.ink};border-radius:12px;padding:10px 14px;white-space:nowrap">${nota}</div>` : '') + `</div>`;
  }
  function scScelta(t, S) {
    let h = tab(S.etichetta || 'PER CHI VALE', t, S.t0 + .06);
    if (S.domanda) h += `<div style="position:absolute;left:40px;top:82px;transform-origin:0 50%;transform:scale(${pop(t, S.t0 + .2, .3, 1.4).toFixed(3)});white-space:nowrap;font:800 50px/1 ${DISP};letter-spacing:-.025em;color:${C.ink}">${esc(S.domanda)}</div>`;
    (S.carte || []).slice(0, 2).forEach((c, i) => {
      h += card(150 + 126 * i, seg(t, c._t, c._t + .35), tinta(c.colore), `<svg width="40" height="40" viewBox="0 0 46 46">${segno(c.segno)}</svg>`, esc(c.titolo), c.nota ? esc(c.nota) : '',
        tinta(c.notaColore), pop(t, S.t0 + .38 + .12 * i, .32, 1.5), c._p != null ? E.bump(seg(t, c._p, c._p + .45)) : 0);
    });
    return h;
  }
  // confronto: due numeri, sinistra {testo, nota, a} e destra {testo, nota, colore, a} (prima/dopo, attese/reale)
  function scConfronto(t, S) {
    let h = tab(S.etichetta || 'IL CONFRONTO', t, S.t0 + .06);
    const side = (o, cx, last) => {
      if (!o) return '';
      const x = t - o._t, k = x < 0 ? 0 : last ? 1.9 - .9 * E.outBack(seg(x, 0, .24), 1.3) : E.outBack(seg(x, 0, .3), 1.6);
      const fs = Math.round(Math.min(150, 330 / (.56 * Math.max(1, o.testo.length))));
      return `<div style="position:absolute;left:${cx - 190}px;top:96px;width:380px;text-align:center;opacity:${x < 0 ? 0 : 1};transform:scale(${k.toFixed(3)})">` +
        `<div style="display:inline-block;font:800 ${fs}px/1.05 ${DISP};letter-spacing:-.04em;color:${C.ink};background:${o.colore ? tinta(o.colore) : 'transparent'};border-radius:22px;padding:0 14px">${esc(o.testo).replace(/ /g, '&nbsp;')}</div>` +
        `<div style="margin-top:18px;font:700 30px/1 ${MONO};letter-spacing:.02em;color:${C.mut}">${esc(o.nota || '')}</div></div>`;
    };
    h += side(S.sinistra, 215, false) + side(S.destra, 605, true);
    if (S.destra && t >= S.destra._t - .3) h += `<div style="position:absolute;left:${MW / 2}px;top:170px;transform:translate(-50%,-50%) scale(${pop(t, S.destra._t - .3, .3).toFixed(3)});font:800 64px/1 ${DISP};color:${C.ink}">→</div>`;
    return h;
  }
  // grafico: valori (una linea che si disegna da linea.a), soglia {valore, testo}, fine {testo, a}, verso 'su'|'giu'
  function scGrafico(t, S) {
    let h = tab(S.etichetta || "L'ANDAMENTO", t, S.t0 + .06);
    const V = S.valori || [0, 1], all = V.concat(S.soglia ? [S.soglia.valore] : []), lo = Math.min(...all), hi = Math.max(...all), pad = (hi - lo) * .15 || 1;
    const x0 = 70, x1 = 640, y0 = 350, y1 = 110, X = (i) => x0 + (x1 - x0) * i / (V.length - 1), Y = (v) => y0 - (y0 - y1) * (v - lo + pad) / (hi - lo + 2 * pad);
    const A = S.linea && S.linea._t != null ? S.linea._t : S.t0 + .3, u = E.inOut(seg(t, A, A + 1.4)), n = (V.length - 1) * u;
    let d = `M${X(0).toFixed(1)} ${Y(V[0]).toFixed(1)}`, ex2 = X(0), ey = Y(V[0]);
    for (let i = 1; i <= Math.ceil(n) && i < V.length; i++) { const f = Math.min(1, n - (i - 1)); ex2 = lerp(X(i - 1), X(i), f); ey = lerp(Y(V[i - 1]), Y(V[i]), f); d += ` L${ex2.toFixed(1)} ${ey.toFixed(1)}`; }
    let g = `<path d="M${x0} ${y0 + 20} H${x1 + 30}" ${ST(5)} opacity=".35"/>`;
    if (S.soglia) g += `<path d="M${x0} ${Y(S.soglia.valore).toFixed(1)} H${x1 + 30}" fill="none" stroke="${C.ink}" stroke-width="5" stroke-dasharray="14 12" opacity=".6"/>`;
    if (u > 0) g += `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${ex2.toFixed(1)}" cy="${ey.toFixed(1)}" r="14" fill="${tinta(S.colore, C.rosa)}" ${ST(6)}/>`;
    h += svgL(g);
    if (S.soglia) h += chip(x1 + 90, Y(S.soglia.valore), esc(S.soglia.testo), { fs: 26, bg: '#fff', k: pop(t, A + .2, .3) });
    if (S.fine && S.fine._t != null) h += chip(Math.min(ex2 + 20, x1 - 40), ey - 62, esc(S.fine.testo), { fs: 40, disp: true, bg: tinta(S.colore, C.rosa), k: pop(t, S.fine._t, .3, 1.8), sh: 6 });
    return h;
  }
  // saluto: nome della rubrica, motto, invito a seguire (segui {a})
  function scSaluto(t, S) {
    const V = T.V; let h = '';
    const k = pop(t, S.t0 + .08, .34, 1.5), k2 = S.segui && S.segui._t != null ? pop(t, S.segui._t, .3, 1.8) : 0;
    h += `<div style="position:absolute;left:50%;top:128px;transform:translate(-50%,-50%) rotate(-3deg) scale(${k.toFixed(3)});white-space:nowrap;font:800 132px/1 ${DISP};letter-spacing:-.04em;color:${C.ink};background:${C.giallo};border:8px solid ${C.ink};border-radius:26px;box-shadow:0 10px 0 ${C.ink};padding:10px 34px 16px">${esc(V.rubrica)}</div>`;
    h += `<div style="position:absolute;left:0;top:246px;width:${MW}px;text-align:center;font:700 40px/1 ${DISP};color:${C.ink};opacity:${E.out(seg(t, S.t0 + .33, S.t0 + .58)).toFixed(2)}">${esc(S.motto || 'una notizia al giorno')}</div>`;
    if (k2 > 0) h += `<div style="position:absolute;left:50%;top:346px;transform:translate(-50%,-50%) scale(${k2.toFixed(3)});display:flex;align-items:center;gap:14px;white-space:nowrap;font:700 38px/1 ${MONO};color:${C.giallo};background:${C.ink};border-radius:16px;padding:14px 24px 14px 16px">` +
      `<span style="display:inline-flex;width:44px;height:44px;border-radius:50%;background:${C.giallo};color:${C.ink};align-items:center;justify-content:center;font:800 40px/1 ${DISP}">+</span>${esc(tx('segui'))}</div>`;
    return h;
  }
  // capitolo: il cartello che apre ogni capitolo (lo mette da solo init, dai "capitoli" della scheda): numero, titolo, a che punto della storia siamo
  function scCapitolo(t, S) {
    const N = T.capitoli.length, k = pop(t, S.t0 + .04, .34, 1.6), kt = pop(t, S.t0 + .16, .34, 1.3), kd = E.out(seg(t, S.t0 + .3, S.t0 + .6));
    let h = tab(tx('capitolo') + ' ' + S.n + (N > 1 ? ' ' + tx('di') + ' ' + N : ''), t, S.t0 + .02);
    h += `<div style="position:absolute;left:40px;top:84px;width:224px;height:224px;box-sizing:border-box;border-radius:50%;background:${C.giallo};border:9px solid ${C.ink};box-shadow:0 10px 0 ${C.ink};` +
      `display:flex;align-items:center;justify-content:center;transform:scale(${k.toFixed(3)}) rotate(${(-10 * (1 - k)).toFixed(2)}deg);font:800 ${S.n >= 10 ? 118 : 150}px/1 ${DISP};letter-spacing:-.05em;color:${C.ink}">${S.n}</div>`;
    const L = S.titolo.length, fs = L > 22 ? 56 : L > 16 ? 64 : 76;
    h += `<div style="position:absolute;left:296px;top:84px;width:490px;height:224px;display:flex;align-items:center;transform:translateX(${px(60 * (1 - kt))});opacity:${kt > 0 ? Math.min(1, kt * 1.5).toFixed(2) : 0}">` +
      `<div style="font:800 ${fs}px/1.04 ${DISP};letter-spacing:-.03em;color:${C.ink};text-wrap:balance">${esc(S.titolo)}</div></div>`;
    if (N > 1) {
      const w = 30, gap = 14, x0 = (MW - (N * w + (N - 1) * gap)) / 2;
      h += svgL(T.capitoli.map((c, i) => {
        const cur = i + 1 === S.n, r = (w / 2) * kd * (cur ? 1 + .14 * E.bump(seg(t, S.t0 + .55, S.t0 + .95)) : 1);
        return r > .1 ? `<circle cx="${(x0 + i * (w + gap) + w / 2).toFixed(1)}" cy="360" r="${r.toFixed(2)}" fill="${cur ? C.giallo : i + 1 < S.n ? C.ink : '#fff'}" ${ST(5)}/>` : '';
      }).join(''));
    }
    return h;
  }
  // griglia: lo schermo fatto di puntini (pixel). modo 'pixel': l'immagine si disegna (disegna {a, fino}) e un puntino si ingrandisce (lente {a, i, j});
  // modo 'confronto': a sinistra il processore colora un puntino alla volta (sinistra {a, testo, nota}), a destra il chip tutti insieme (destra {a, testo, nota}, tutti {a});
  // modo 'pioggia': tanti calcoli nello stesso momento (pioggia {a}); chips [{testo, colore, a}] sotto
  function pixel(u, v) {   // un paesaggio semplice: sole, montagna, prato, cielo
    if ((u - .8) ** 2 + ((v - .26) * 1.5) ** 2 < .024) return C.giallo;
    if (v > .8) return C.menta;
    if (v > .36 + Math.abs(u - .36) * 1.3) return C.lilla;
    if (v > .55 + Math.abs(u - .72) * 1.6) return C.pesca;
    return C.azL;
  }
  function griglia(x0, y0, cols, rows, cell, gap, on, extra) {   // on(i, j) -> 0..1: quanto è acceso il puntino
    let g = '';
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const k = on(i, j), x = x0 + i * (cell + gap), y = y0 + j * (cell + gap), lit = k > .02;
      const s = lit ? .55 + .45 * E.outBack(clamp(k, 0, 1), 1.8) : 1, d = cell * (1 - s) / 2;
      g += `<rect x="${(x + d).toFixed(1)}" y="${(y + d).toFixed(1)}" width="${(cell * s).toFixed(1)}" height="${(cell * s).toFixed(1)}" rx="${(cell * .2).toFixed(1)}" fill="${lit ? pixel(i / (cols - 1), j / (rows - 1)) : '#EEF0F5'}" stroke="${C.ink}" stroke-width="3"/>`;
    }
    return g + (extra || '');
  }
  const hash2 = (i, j) => { const s = S(i * 12.9898 + j * 78.233) * 43758.5453; return s - Math.floor(s); };
  function scGriglia(t, S) {
    let h = tab(S.etichetta || 'COME SI DISEGNA', t, S.t0 + .04), g = '';
    if (S.modo === 'confronto') {
      const cols = 8, rows = 6, cell = 30, gap = 4, gw = cols * (cell + gap) - gap, XL = 62, XR = MW - 62 - gw, Y = 126;
      const L = S.sinistra || {}, R = S.destra || {}, A = L._t != null ? L._t : S.t0 + .3, step = L.passo || .2, TT = S.tutti && S.tutti._t != null ? S.tutti._t : Infinity;
      const cur = Math.floor((t - A) / step);
      g += griglia(XL, Y, cols, rows, cell, gap, (i, j) => { const n = j * cols + i; return t < A ? 0 : seg(t, A + n * step, A + n * step + .18); });
      if (t >= A && cur < cols * rows) { const i = cur % cols, j = Math.floor(cur / cols); g += `<rect x="${XL + i * (cell + gap) - 5}" y="${Y + j * (cell + gap) - 5}" width="${cell + 10}" height="${cell + 10}" rx="9" fill="none" stroke="${C.ink}" stroke-width="5"/>`; }
      g += griglia(XR, Y, cols, rows, cell, gap, (i, j) => { const d = hash2(i, j) * .12; return seg(t, TT + d, TT + d + .2); });
      if (t >= TT) { const f = 1 - seg(t, TT, TT + .7); if (f > 0) g += `<rect x="${XR - 14}" y="${Y - 14}" width="${gw + 28}" height="${rows * (cell + gap) - gap + 28}" rx="20" fill="none" stroke="${C.giallo}" stroke-width="${(14 * f).toFixed(1)}" opacity="${f.toFixed(2)}"/>`; }
      h += svgL(g);
      h += chip(XL + gw / 2, 92, esc(L.testo || 'PROCESSORE'), { fs: 26, k: pop(t, A - .1, .3) });
      h += chip(XR + gw / 2, 92, esc(R.testo || 'GPU'), { fs: 26, bg: C.giallo, k: R._t != null ? pop(t, R._t, .3) : 0 });
      if (L.nota) h += chip(XL + gw / 2, 362, esc(L.nota), { fs: 25, bd: 0, bg: 'transparent', k: pop(t, A + .4, .3) });
      if (R.nota) h += chip(XR + gw / 2, 362, esc(R.nota), { fs: 25, bg: C.menta, k: TT < Infinity ? pop(t, TT + .15, .3) : 0 });
      return h;
    }
    const cols = 16, rows = (S.chips || []).length ? 7 : 8, cell = 33, gap = 4, gw = cols * (cell + gap) - gap, X0 = (MW - gw) / 2, Y0 = 84;   // con i chips sotto, una riga in meno
    if (S.modo === 'pioggia') {
      const A = S.pioggia && S.pioggia._t != null ? S.pioggia._t : S.t0 + .3;
      g += griglia(X0, Y0, cols, rows, cell, gap, (i, j) => { if (t < A) return 0; const ph = (t - A) * 2.4 + hash2(i, j); return Math.max(seg(t, A, A + .25), 0) * (ph % 1 < .62 ? 1 : 0); });
    } else {
      const D = S.disegna || {}, A = D._t != null ? D._t : S.t0 + .25, F = D._f != null ? D._f : A + 1.6, span = Math.max(.6, F - A - .2);
      g += griglia(X0, Y0, cols, rows, cell, gap, (i, j) => { const d = A + span * (i / cols * .78 + j / rows * .22); return seg(t, d, d + .22); });
      const Ln = S.lente;
      if (Ln && Ln._t != null && t >= Ln._t) {
        const k = pop(t, Ln._t, .34, 1.6), i = Ln.i == null ? 12 : Ln.i, j = Ln.j == null ? 2 : Ln.j, cx = X0 + i * (cell + gap) + cell / 2, cy = Y0 + j * (cell + gap) + cell / 2, z = 1 + 1.4 * k;
        g += `<rect x="${(cx - cell * z / 2).toFixed(1)}" y="${(cy - cell * z / 2).toFixed(1)}" width="${(cell * z).toFixed(1)}" height="${(cell * z).toFixed(1)}" rx="10" fill="${pixel(i / (cols - 1), j / (rows - 1))}" ${ST(7)}/>` +
          `<circle cx="${cx}" cy="${cy}" r="${(cell * z * .86).toFixed(1)}" fill="none" ${ST(6)} opacity="${k.toFixed(2)}"/>`;
        h += svgL(g) + chip(cx - 150, cy + 20, esc(Ln.testo || 'PIXEL'), { fs: 34, disp: true, bg: C.giallo, k, sh: 6 });
        g = null;
      }
    }
    if (g !== null) h += svgL(g);
    const CH = S.chips || [];
    if (CH.length) h += `<div style="position:absolute;left:0;top:${Y0 + rows * (cell + gap) + 30}px;width:${MW}px;transform:translateY(-50%);display:flex;justify-content:center;gap:24px">` + CH.map((c) => {
      const k = pop(t, c._t, .3);
      return `<div style="transform:scale(${k.toFixed(3)});white-space:nowrap;font:700 34px/1 ${DISP};color:${C.ink};background:${tinta(c.colore)};border:5px solid ${C.ink};border-radius:14px;padding:8px 18px">${esc(c.testo)}</div>`;
    }).join('') + `</div>`;
    return h;
  }
  // formula: termini [{testo, nota, colore, a}] uniti da operatori (di solito × e =); l'ultimo è il risultato, evidenziato
  function scFormula(t, S) {
    let h = tab(S.etichetta || 'LA FORMULA', t, S.t0 + .04);
    const P = S.termini || [], O = S.operatori || ['×', '='], n = P.length, ow = 64, bw = Math.floor((MW - 70 - (n - 1) * ow) / Math.max(1, n)), x0 = (MW - (n * bw + (n - 1) * ow)) / 2;
    P.forEach((p, i) => {
      const k = pop(t, p._t != null ? p._t : S.t0 + .2 + .25 * i, .32, 1.6), last = i === n - 1, x = x0 + i * (bw + ow);
      if (k <= 0) return;
      h += `<div style="position:absolute;left:${x}px;top:104px;width:${bw}px;height:180px;box-sizing:border-box;transform:scale(${k.toFixed(3)});display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;` +
        `background:${tinta(p.colore, last ? C.giallo : '#fff')};border:7px solid ${C.ink};border-radius:26px;box-shadow:0 9px 0 ${C.ink}">` +
        `<div style="font:800 ${p.testo.length > 8 ? 42 : 52}px/1 ${DISP};letter-spacing:-.03em;color:${C.ink};white-space:nowrap">${esc(p.testo)}</div>` +
        (p.nota ? `<div style="font:700 23px/1.15 ${MONO};color:${C.mut};text-align:center;padding:0 12px">${esc(p.nota)}</div>` : '') + `</div>`;
      if (i) h += `<div style="position:absolute;left:${x - ow}px;top:194px;width:${ow}px;text-align:center;transform:translateY(-50%) scale(${k.toFixed(3)});font:800 64px/1 ${DISP};color:${C.ink}">${esc(O[i - 1] || '×')}</div>`;
    });
    if (S.sotto && S.sotto._t != null) h += chip(MW / 2, 350, esc(S.sotto.testo), { fs: 30, disp: true, bg: tinta(S.sotto.colore, C.menta), k: pop(t, S.sotto._t, .3) });
    return h;
  }
  const SCREENS = { titolo: scTitolo, numero: scNumero, catena: scCatena, scelta: scScelta, confronto: scConfronto, grafico: scGrafico, saluto: scSaluto,
    capitolo: scCapitolo, griglia: scGriglia, formula: scFormula };

  // ---------- lo studio ----------
  const layer = (inner, dx) => `<div style="position:absolute;left:0;top:0;width:${MW}px;height:${MH}px;transform:translateX(${px(dx)})">${inner}</div>`;
  function schermo(t) {
    const sl = T.slides; let i = 0; while (i < sl.length - 1 && t >= sl[i + 1].t0) i++;
    const D = .36, x = t - sl[i].t0;
    if (i > 0 && x < D) return layer(sl[i - 1].fn(t, sl[i - 1]), -MW * E.inOut(seg(x, 0, D))) + layer(sl[i].fn(t, sl[i]), MW * (1 - E.outBack(seg(x, 0, D), .8)));
    return layer(sl[i].fn(t, sl[i]), 0);
  }
  function mondo(t, uid) {
    let h = '';
    h += `<div style="position:absolute;left:-400px;top:-400px;width:1880px;height:2720px;background:${C.az}"></div>`;
    h += `<div style="position:absolute;left:${CX - 590}px;top:20px;width:1180px;height:1180px;border-radius:50%;background:${C.azL}"></div>`;
    // schermo appeso: cinghie, ombra, cornice
    let shake = 0; T.shakes.forEach((ts) => { const sx = t - ts; if (sx >= 0 && sx < .6) shake += 1.3 * ex(-sx * 9) * S(TAU * 3 * sx); });   // lo schermo trema quando atterra un numero
    h += `<div style="position:absolute;left:${MX + 150}px;top:-60px;width:22px;height:${MY + 70}px;background:${C.ink}"></div><div style="position:absolute;left:${MX + MW - 172}px;top:-60px;width:22px;height:${MY + 70}px;background:${C.ink}"></div>`;
    h += `<div style="position:absolute;left:${MX}px;top:${MY}px;width:${MW}px;height:${MH}px;transform:rotate(${shake.toFixed(3)}deg)">` +
      `<div style="position:absolute;left:-9px;top:5px;width:${MW + 18}px;height:${MH + 18}px;border-radius:46px;background:${C.ink}"></div>` +
      `<div style="position:absolute;left:-9px;top:-9px;width:${MW}px;height:${MH}px;border:9px solid ${C.ink};border-radius:46px;background:#fff;overflow:hidden">` +
      `<div style="position:absolute;left:0;top:0;width:${MW}px;height:${MH}px">${schermo(t)}</div></div></div>`;
    // Rally
    h += `<div style="position:absolute;left:${CX - RW / 2}px;top:${RY}px;width:${RW}px">${rallySVG(t, uid)}</div>`;
    // bancone e microfono
    h += `<div style="position:absolute;left:-400px;top:${DY + 26}px;width:1880px;height:1200px;background:${C.lilla}"></div>`;
    h += `<div style="position:absolute;left:-400px;top:${DY}px;width:1880px;height:26px;background:${C.lillaL};border-top:8px solid ${C.ink};border-bottom:8px solid ${C.ink}"></div>`;
    const rl = [...T.V.rubrica].length, rfs = rl <= 8 ? 250 : Math.floor(1700 / rl);   // un nome più lungo di TG RALLY si rimpicciolisce per restare intero
    h += `<div style="position:absolute;left:-60px;top:${1500 + (250 - rfs) / 2}px;width:1200px;text-align:center;transform:rotate(-2deg);white-space:nowrap;font:800 ${rfs}px/1 ${DISP};letter-spacing:-.05em;color:${C.lillaD};opacity:.6">${esc(T.V.rubrica)}</div>`;
    h += `<svg style="position:absolute;left:776px;top:${DY - 190}px;overflow:visible" width="120" height="200" viewBox="0 0 120 200">` +
      `<path d="M60 196 V120" ${ST(9)} fill="none"/><ellipse cx="60" cy="194" rx="38" ry="10" fill="${C.ink}"/>` +
      `<g transform="rotate(-16 60 120)"><rect x="38" y="36" width="44" height="90" rx="22" fill="${C.mut}" ${ST(7)}/><path d="M38 70 H82 M38 92 H82" ${ST(5)} opacity=".55"/><path d="M48 50 C50 44 56 42 62 42" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".7"/></g></svg>`;
    return h;
  }
  function nastro(t) {
    const V = T.V, fs = 32, cw = fs * .6, chipTxt = V.rubrica + ' · ' + V.data;
    let cap = null; T.capitoli.forEach((c) => { if (t >= c.t0) cap = c; }); if (t >= T.fineCapitoli) cap = null;   // nel capitolo il nastro ne mostra il titolo
    const items = cap ? [tx('capitolo') + ' ' + cap.n + ' · ' + cap.titolo.toUpperCase()].concat(V.nastro) : V.nastro;
    const run = items.join('   •   ') + '   •   ', loopW = run.length * cw, off = -(((t - (cap ? cap.t0 : 0)) * 92) % loopW);
    const chipW = Math.round(chipTxt.length * 26 * .6 + 34);
    const jolt = T.slides.reduce((m, s, i) => i ? Math.max(m, E.bump(seg(t, s.t0, s.t0 + .28))) : m, 0);   // scatta a ogni cambio di schermata
    return `<div style="position:absolute;left:-40px;top:${NY}px;width:1160px;height:${NH}px;transform:rotate(-2deg) scale(1,${(1 + .12 * jolt).toFixed(3)});background:${C.giallo};border-top:6px solid ${C.ink};border-bottom:6px solid ${C.ink};box-shadow:0 9px 0 ${C.ink};overflow:hidden">` +
      `<div style="position:absolute;left:${104 + chipW + 28}px;right:0;top:0;bottom:0;overflow:hidden"><div style="position:absolute;left:${px(off)};top:0;height:100%;display:flex;align-items:center;white-space:pre;font:700 ${fs}px/1 ${MONO};color:${C.ink}">${esc(run + run + run + run)}</div></div>` +
      `<div style="position:absolute;left:104px;top:50%;transform:translateY(-50%);width:${chipW}px;text-align:center;white-space:nowrap;font:700 26px/1 ${MONO};color:${C.giallo};background:${C.ink};border-radius:9px;padding:10px 0">${esc(chipTxt)}</div></div>`;
  }
  function sottotitoli(t) {
    let b = null; T.sc.forEach((s) => s.blocchi.forEach((x) => { if (t >= x.t0 - .03 && t < x.t1) b = x; }));
    if (!b) return '';
    const k = .86 + .14 * E.outBack(seg(t, b.t0 - .03, b.t0 + .13), 2);
    const txt = esc(b.show).replace(/\*([^*]+)\*/g, `<span style="background:${C.giallo};border-radius:10px;padding:0 12px;margin:0 -5px">$1</span>`);
    return `<div style="position:absolute;left:${SAFE.l}px;top:${SY}px;width:${SAFE.r - SAFE.l}px;height:${SH}px;display:flex;align-items:center;justify-content:center">` +
      `<div style="transform:scale(${k.toFixed(3)});max-width:790px;text-align:center;text-wrap:balance;font:800 62px/1.16 ${DISP};letter-spacing:-.015em;color:${C.ink};background:#fff;border:6px solid ${C.ink};border-radius:26px;box-shadow:0 9px 0 ${C.ink};padding:12px 30px 16px">${txt}</div></div>`;
  }
  function cam(t) {
    const K = T.cam; let i = 0; while (i < K.length - 2 && t >= K[i + 1].t) i++;
    const a = K[i], b = K[i + 1], u = E.smooth(seg(t, a.t, b.t));
    return { k: lerp(a.k, b.k, u), fx: lerp(a.fx, b.fx, u), fy: lerp(a.fy, b.fy, u) };
  }
  function guida() {   // solo per i controlli: tratteggia la zona sicura
    return `<div style="position:absolute;left:${SAFE.l}px;top:${SAFE.t}px;width:${SAFE.r - SAFE.l}px;height:${SAFE.b - SAFE.t}px;border:4px dashed #E11D48;box-sizing:border-box;pointer-events:none"></div>` +
      `<div style="position:absolute;left:0;top:${SAFE.b}px;width:${W}px;height:${H - SAFE.b}px;background:rgba(225,29,72,.16)"></div><div style="position:absolute;left:0;top:0;width:${W}px;height:${SAFE.t}px;background:rgba(225,29,72,.16)"></div>` +
      `<div style="position:absolute;left:${SAFE.r}px;top:${SAFE.t}px;width:${W - SAFE.r}px;height:${SAFE.b - SAFE.t}px;background:rgba(225,29,72,.16)"></div>`;
  }
  function frame(t, uid, opt) {
    t = clamp(t, 0, T.total); const c = cam(t);
    return `<div style="position:relative;width:${W}px;height:${H}px;overflow:hidden;background:${C.az};font-family:${DISP};font-optical-sizing:auto;-webkit-font-smoothing:antialiased;color:${C.ink}">` +
      `<div style="position:absolute;left:0;top:0;width:${W}px;height:${H}px;transform-origin:0 0;transform:translate(${px(c.fx * (1 - c.k))},${px(c.fy * (1 - c.k))}) scale(${c.k.toFixed(4)})">${mondo(t, uid || 'r')}</div>` +
      nastro(t) + sottotitoli(t) + (opt && opt.guida ? guida() : '') + `</div>`;
  }
  return { init, frame, W, H, SAFE, get T() { return T; } };
})();
