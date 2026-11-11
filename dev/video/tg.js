// tg.js · Il TG di Rally: lo studio (set fisso) e la regia.
// Ogni fotogramma è funzione del tempo t (secondi), senza stato nascosto: lo stesso t dà sempre lo stesso disegno.
// Dipende da rally4.js (scheletro di Rally) e da window.VIDEO (scheda del video del giorno).
// Uso: TG.init(VIDEO, tempiVeri?) poi TG.frame(t, uid) -> stringa HTML 1080x1920.
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
  const WPS = 2.4, ARIA = .3;                       // parole al secondo e aria tra le battute (stima, prima della voce)

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

  // ---------- tempi: battute, parole, sottotitoli ----------
  function plan(text, t0, dur, parole) {
    if (parole && parole.length) {                    // tempi veri dalla voce: labiale parola per parola
      const words = []; const re = /\S+/g; let m;
      while ((m = re.exec(text))) words.push({ w: m[0], i: m.index, key: key(m[0]) });
      if (parole.length !== words.length) throw new Error('TG: ' + parole.length + ' tempi per ' + words.length + ' parole');
      const seq = [];
      words.forEach((w, k) => {
        w.t = parole[k].t; w.end = Math.max(parole[k].end, w.t + .05);
        const s = r4LipSync(w.w, { lang: 'it' }), d = r4LipSyncDuration(s) || .1, a = w.t - t0, sc = (w.end - w.t) / d;
        s.forEach((e) => {
          const x = { t: +(a + e.t * sc).toFixed(3), key: e.key, i: w.i + e.i };
          if (seq.length && seq[seq.length - 1].t >= x.t) seq[seq.length - 1] = x; else seq.push(x);
        });
      });
      return { seq, words };
    }
    const d0 = r4LipSyncDuration(r4LipSync(text, { lang: 'it' })) || 1;
    const seq = r4LipSync(text, { lang: 'it', rate: d0 / dur });
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
  function at(id, w, plus) {
    const f = T.by[id].words.find((x) => x.key === key(w));
    if (!f) throw new Error('TG: parola non trovata ' + id + '/' + w);
    return f.t + (plus || 0);
  }

  function init(V, tempi) {
    let t = .2;
    const sc = V.scene.map((s) => {
      const n = s.dice.trim().split(/\s+/).length, real = tempi && tempi[s.id];
      const t0 = real ? real.t0 : t, dur = real ? real.dur : n / WPS;
      const pl = plan(s.dice, t0, dur, real && real.parole);
      t = t0 + dur + ARIA;
      let w = 0;
      const bl = s.blocchi.map((b) => { const o = { t0: pl.words[w].t, show: b[1] }; w += b[0]; return o; });
      if (w !== pl.words.length) throw new Error('TG: i blocchi di "' + s.id + '" coprono ' + w + ' parole su ' + pl.words.length);
      bl.forEach((b, i) => { b.t1 = i + 1 < bl.length ? bl[i + 1].t0 : t0 + dur + .22; });
      return { id: s.id, dice: s.dice, t0, dur, t1: t0 + dur, blocchi: bl, seq: pl.seq, words: pl.words };
    });
    T = { V, sc, by: {}, total: sc[sc.length - 1].t1 + 1.4, env: tempi && tempi.env ? tempi.env : null, envFps: (tempi && tempi.fps) || 30 };
    sc.forEach((s) => { T.by[s.id] = s; });
    const q = T.q = {
      s1: T.by.gancio.t0, s2: T.by.fatto.t0, s3: T.by.come.t0, s4: T.by.perte.t0, s5: T.by.saluto.t0,
      gennaio: at('gancio', 'da'),
      approvato: at('fatto', 'approvato', .12), stime: at('fatto', 'Prime'), famiglia: at('fatto', 'famiglia'),
      n17: at('fatto', 'diciassette'), n37: at('fatto', 'trentasette'), anno: at('fatto', "l'anno."),
      se: at('come', 'Se'), troppo: at('come', 'costa'), centrali: at('come', 'centrali'), rimborso: at('come', 'rimborso'),
      vendono: at('come', 'vendono'), meno: at('come', 'meno'),
      hai: at('perte', 'hai'), variabile: at('perte', 'prezzo'), fisso: at('perte', 'Con'), nulla: at('perte', 'non'),
      seguimi: at('saluto', 'Seguimi')
    };
    T.slides = [
      { id: 'titolo', t0: 0, fn: slTitolo },
      { id: 'numero', t0: q.stime - .12, fn: slNumero },
      { id: 'come', t0: q.s3 - .08, fn: slCome },
      { id: 'perte', t0: q.s4 - .08, fn: slPerTe },
      { id: 'saluto', t0: q.s5 - .08, fn: slSaluto }
    ];
    // camera: (ingrandimento k attorno al punto fx,fy). Si muove poco e con uno scopo.
    const FR = RY + 172;   // altezza del muso di Rally
    T.cam = [
      { t: 0, k: 1.13, fx: CX, fy: FR },
      { t: q.s2 - .3, k: 1.17, fx: CX, fy: FR },               // lento avvicinamento sul gancio
      { t: q.s2 + .12, k: 1, fx: CX, fy: FR },                // si allarga: entra lo schermo
      { t: q.n17, k: 1, fx: CX, fy: 560 },
      { t: q.s3 - .3, k: 1.05, fx: CX, fy: 560 },             // lento avvicinamento sul numero
      { t: q.s3 + .15, k: 1.09, fx: CX, fy: 520 },
      { t: q.s4 - .3, k: 1.12, fx: CX, fy: 520 },             // resta vicino allo schema
      { t: q.s4 + .12, k: 1, fx: CX, fy: FR },
      { t: q.s5 - .25, k: 1, fx: CX, fy: FR },
      { t: q.s5 + .17, k: 1.07, fx: CX, fy: FR - 30 },        // chiusura su Rally
      { t: T.total, k: 1.1, fx: CX, fy: FR - 30 }
    ];
    // eventi per i suoni: una sola fonte dei tempi
    T.events = [
      { t: 0, tipo: 'apertura' }, { t: q.approvato, tipo: 'timbro' }, { t: T.slides[1].t0, tipo: 'cambio' },
      { t: q.n17, tipo: 'numero' }, { t: q.n37, tipo: 'numero' }, { t: T.slides[2].t0, tipo: 'cambio' },
      { t: q.troppo, tipo: 'sale' }, { t: q.rimborso, tipo: 'moneta' }, { t: q.meno, tipo: 'scende' },
      { t: T.slides[3].t0, tipo: 'cambio' }, { t: q.variabile - .15, tipo: 'cartellino' }, { t: q.fisso, tipo: 'cartellino' },
      { t: T.slides[4].t0, tipo: 'cambio' }, { t: q.seguimi, tipo: 'chiusura' }, { t: T.by.saluto.t1 + .06, tipo: 'sigla' }
    ].sort((a, b) => a.t - b.t);
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

  function recita(P, t) {
    const q = T.q;
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
    const M = [[0, 'surprised'], [q.gennaio - .06, 'happy'], [q.approvato + .02, 'surprised'], [q.approvato + .75, 'happy'], [q.troppo - .1, 'nervous'], [q.rimborso - .06, 'happy'],
      [q.s4 + .15, 'smug'], [q.variabile + .7, 'happy'], [q.nulla - .1, 'neutral'], [q.s5 - .1, 'happy'], [T.by.saluto.t1 + .18, 'wink']];
    let mood = 'happy'; M.forEach((m, i) => { if (t >= m[0]) mood = m[1]; if (i) P.blink = Math.max(P.blink, E.bump(seg(t, m[0] - .08, m[0] + .09))); });
    P.mood = mood;

    // S1 · gancio: si sporge e apre il braccio su "da gennaio"
    const g1 = env(t, q.gennaio - .1, q.s2 - .3, .28, .3);
    P.aR += -30 * g1; P.eR = (P.eR || 0) - 42 * g1; P.aL += 10 * g1; P.uRot += .8 * g1; P.hRot += -2 * g1;
    const lean = ease(t, .3, .7) * (1 - ease(t, q.s2 - .3, q.s2 + .1)); P.sy *= 1 + .02 * lean; P.sx *= 1 + .02 * lean;

    // S2 · il fatto: il timbro lo fa girare verso lo schermo; poi prende la bacchetta e indica i numeri
    { const x = t - q.approvato; if (x >= 0 && x < .6) { const bb = ex(-x * 8) * S(TAU * 2.2 * x); P.y += -3.4 * bb; P.earL += 12 * bb; P.earR += 12 * bb; } }
    const tA = q.approvato + .1, tB = tA + 1.12;
    const a1 = E.bump(seg(t, tA - .16, tA + .12)), a2 = E.bump(seg(t, tB - .16, tB + .12));
    const k1 = E.inOut(seg(t, tA, tA + .4)), k2 = E.inOut(seg(t, tB, tB + .4));
    P.yaw = clamp(k1 - k2, 0, 1);
    const ov1 = t > tA + .4 ? ex(-(t - tA - .4) * 6) * S(TAU * 1.3 * (t - tA - .4)) : 0;
    const ov2 = t > tB + .4 ? ex(-(t - tB - .4) * 6) * S(TAU * 1.3 * (t - tB - .4)) : 0;
    P.rot += -2.2 * a1 + 3 * ov1 + 1.8 * a2 - 2.6 * ov2;
    P.sy *= 1 - .035 * a1 - .025 * a2 + .03 * E.bump(k1) + .025 * E.bump(k2);
    P.sx *= 1 + .018 * a1 + .012 * a2 - .02 * E.bump(k1) - .015 * E.bump(k2);
    look(P, 0, -3, P.yaw); P.hRot += -5 * P.yaw; P.hDy += -1.6 * P.yaw;
    // la bacchetta: sale su "Prime stime", resta per tutto lo schema, scende prima di "per te"
    const antB = E.bump(seg(t, q.stime - .06, q.stime + .2)); P.sy *= 1 - .022 * antB; P.sx *= 1 + .012 * antB;
    const wb = E.outBack(seg(t, q.stime + .12, q.stime + .5), 1.1) * (1 - E.inOut(seg(t, q.s4 - .5, q.s4 - .16)));
    let tap = 0; [q.n17, q.n37, q.rimborso + .1, q.meno].forEach((tn) => { tap = Math.max(tap, E.bump(seg(t, tn - .08, tn + .22))); });
    P.aR += (-40 - 9 * tap) * wb; P.eR = (P.eR || 0) + (-110 + 16 * tap) * wb; P.aL += 5 * wb;
    P._ptr = { w: wb, rot: lerp(172, -30 - 10 * tap + 3 * S(TAU * t / 2.3), E.inOut(clamp(wb, 0, 1))) };
    const lk2 = ease(t, q.stime, q.stime + .22) - ease(t, q.n37 + .6, q.n37 + .9);
    look(P, 1.4, -3.2, lk2); P.hRot += 2.4 * lk2; P.hDy += -1.2 * lk2;
    [q.n17, q.n37].forEach((tn) => { const x = t - tn; if (x >= 0 && x < .7) { const bb = ex(-x * 7) * S(TAU * 2.1 * x); P.y += -3.2 * bb; P.earL += 11 * bb; P.earR += 11 * bb; } });

    // S3 · come funziona: testa inclinata sulla domanda, poi segue lo schema con gli occhi
    const q3 = E.bump(seg(t, q.s3 - .05, q.se - .08)); P.hRot += 5.5 * q3; P.hDx += 1.2 * q3; look(P, -1.5, -2.6, q3);
    const lk3 = ease(t, q.se - .1, q.se + .15) - ease(t, q.meno + .5, q.meno + .8);
    const sweep = lerp(-2.4, 2.2, ease(t, q.se, q.vendono));                       // gli occhi vanno dal gas alla lampadina
    look(P, sweep, -3, lk3 * .9); P.hRot += (1.6 * sweep / 2.4) * lk3; P.hDy += -1 * lk3;
    const pk = E.bump(seg(t, q.troppo, q.troppo + .8)); P.earL += -15 * pk; P.earR += -15 * pk; P.hDy += .9 * pk;   // orecchie giù: costa troppo
    { const x = t - q.rimborso - .26; if (x >= 0 && x < .7) { const bb = ex(-x * 7) * S(TAU * 2.1 * x); P.y += -2.8 * bb; P.earL += 10 * bb; P.earR += 10 * bb; } }
    { const x = t - q.meno - .2; if (x >= 0 && x < .8) { const bb = ex(-x * 6) * S(TAU * 1.9 * x); P.y += -3.4 * bb; P.earL += 9 * bb; P.earR += 9 * bb; } }

    // S4 · per te: si sporge verso chi guarda con le mani sui fianchi, poi alza le spalle sul "non cambia nulla"
    const g4 = env(t, q.s4 + .1, q.fisso + .1, .3, .3); poseOn(P, 'maniFianchi', g4);
    const ln4 = E.bump(seg(t, q.hai - .25, q.hai + .9)); P.sy *= 1 + .022 * ln4; P.sx *= 1 + .022 * ln4; P.hRot += -3.5 * ln4;
    const up4 = E.bump(seg(t, q.variabile - .1, q.variabile + .9)); look(P, 0, -3, up4); P.hDy += -1 * up4;
    const g5 = env(t, q.nulla - .14, T.by.perte.t1 + .22, .3, .28); poseOn(P, 'scrollaSpalle', g5);
    P.y += 1.6 * g5;

    // S5 · saluto con la mano
    const tw = t - (q.s5 + .02);
    if (tw > -.2) {
      const ant = E.bump(seg(tw, 0, .3)); P.sy *= 1 - .025 * ant; P.sx *= 1 + .012 * ant; P.aR += 7 * ant;
      const up = E.outBack(seg(tw, .18, .55), 1.4) * (1 - E.inOut(seg(tw, 2.5, 3.0)));
      const on = E.smooth(seg(tw, .4, .6)) * (1 - E.smooth(seg(tw, 2.3, 2.55))), ph = TAU * 2.5 * (tw - .55);
      if (up > .5) P.fR = 1;
      if (up > .001) { P.pose = { name: 'saluta', w: Math.min(1, up) }; (P._x = P._x || []).push({ name: 'saluta', w: up }); }
      P.aR += -96 * up + 6 * on * S(ph); P.eR = (P.eR || 0) + (-40 * up + 24 * on * S(ph - 1.0));
      P.hRot += 4.5 * up + .8 * on * S(ph - 1.6); P.hDx += 1 * up; P.rot += .7 * on * S(ph - .4); P.uRot += 1.2 * up; P.aL += -4 * up;
    }
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

  // ---------- le schermate ----------
  function slTitolo(t) {
    const q = T.q; let h = tab('LA NOTIZIA', t, .04);
    const l1 = pop(t, .06, .3, 1.2), l2 = pop(t, .18, .3, 1.2);
    h += `<div style="position:absolute;left:44px;top:92px;font:800 124px/1 ${DISP};letter-spacing:-.035em;color:${C.ink}">` +
      `<div style="transform:translateY(${px(36 * (1 - l1))});opacity:${l1 > 0 ? 1 : 0}">Decreto</div>` +
      `<div style="transform:translateY(${px(36 * (1 - l2))});opacity:${l2 > 0 ? 1 : 0};margin-top:2px"><span style="background:linear-gradient(transparent 56%,${C.giallo} 56%);padding:0 12px;margin-left:-12px">bollette</span></div></div>`;
    const kb = pop(t, .22, .36, 1.6);
    h += svgL(`<g transform="translate(676 262) scale(${kb.toFixed(3)})">${bulb(0, 0, 1.25, true, t)}</g>`);
    const st = t - q.approvato;
    if (st >= 0) h += chip(590, 352, 'OK DEL GOVERNO', { bg: C.menta, fs: 37, k: 2.4 - 1.4 * E.outBack(seg(st, 0, .2), 1.2), rot: -8, bd: 7, r: 12, sh: 7 });
    return h;
  }
  function slNumero(t) {
    const q = T.q; let h = tab('PRIME STIME', t, q.stime);
    const a = t - q.n17, b = t - q.n37;
    const ka = a < 0 ? 0 : 1.9 - .9 * E.outBack(seg(a, 0, .24), 1.3), kb = b < 0 ? 0 : E.outBack(seg(b, 0, .3), 1.8);
    h += `<div style="position:absolute;left:0;top:74px;width:${MW}px;text-align:center;font:800 200px/1 ${DISP};letter-spacing:-.045em;color:${C.ink};white-space:nowrap">` +
      `<span style="display:inline-block;transform:scale(${ka.toFixed(3)});opacity:${a < 0 ? 0 : 1}">17</span>` +
      `<span style="display:inline-block;transform-origin:0 60%;transform:translateX(${px(70 * (1 - kb))}) scale(${(.6 + .4 * kb).toFixed(3)});opacity:${b < 0 ? 0 : 1}">-37&nbsp;€</span></div>`;
    const kf = pop(t, q.famiglia, .3), kn = pop(t, q.anno, .3);
    if (kf > 0) h += `<div style="position:absolute;left:216px;top:316px;transform:translate(-50%,-50%) scale(${kf.toFixed(3)});display:flex;align-items:center;gap:12px;white-space:nowrap;font:700 38px/1 ${DISP};color:${C.ink};background:#fff;border:5px solid ${C.ink};border-radius:16px;padding:10px 20px 10px 14px">` +
      `<svg width="56" height="48" viewBox="-44 -68 88 72" style="overflow:visible">${house(0, 0, .82)}</svg>una famiglia</div>`;
    h += chip(580, 316, "in meno l'anno", { bg: C.giallo, fs: 38, k: kn, r: 16, disp: true });
    h += `<div style="position:absolute;right:34px;top:372px;font:600 25px/1 ${MONO};color:${C.mut};opacity:${E.out(seg(t, q.n37 + .2, q.n37 + .5)).toFixed(2)}">stime Ecco e Codacons</div>`;
    return h;
  }
  function slCome(t) {
    const q = T.q; let h = tab('COME FUNZIONA', t, q.s3 - .02);
    const gx = 142, px0 = 402, lx = 640, base = 326, tx = lx + 118;
    const up = ease(t, q.troppo, q.troppo + .5), dn = ease(t, q.meno - .1, q.meno + .45);
    const fs = 1 + .18 * up * (1 - .6 * dn);                                   // la fiamma cresce quando il gas costa troppo
    const cx = t - q.rimborso;                                                 // la moneta cade sulla centrale e rimbalza
    let cy = -80, crot = 0, cvis = cx >= 0;
    if (cvis) { const fall = E.in(seg(cx, 0, .26)); const bn = cx > .26 ? ex(-(cx - .26) * 7) * Math.abs(S(TAU * 1.9 * (cx - .26))) : 0; cy = lerp(-80, 178, fall) - 46 * bn; crot = 360 * seg(cx, 0, .5); }
    const py = lerp(lerp(160, 112, up), 190, dn);                              // il cartellino del prezzo della luce sale, poi scende
    const pcol = dn > .5 ? C.menta : up > .5 ? C.rosa : '#fff';
    const k0 = pop(t, q.s3 + .05, .3), k1 = pop(t, q.s3 + .16, .3), k2 = pop(t, q.s3 + .27, .3);
    let g = '';
    g += `<g transform="translate(${gx} ${base}) scale(${(1.25 * k0).toFixed(3)})">${flame(0, 0, fs, t)}</g>`;
    g += `<g transform="translate(${px0} ${base}) scale(${(1.15 * k1).toFixed(3)})">${plant(0, 0, t)}</g>`;
    g += `<g transform="translate(${lx} ${base}) scale(${(1.12 * k2).toFixed(3)})">${bulb(0, 0, 1, dn > .5, t)}</g>`;
    if (k1 > .9) g += arrow(gx + 76, base - 54, px0 - 106, t);
    if (k2 > .9) g += arrow(px0 + 106, base - 54, lx - 66, t);
    if (cvis) g += coin(px0 - 30, cy, 36, crot);
    h += svgL(g);
    // cartellino del prezzo accanto alla lampadina
    if (k2 > .9) h += `<div style="position:absolute;left:${tx}px;top:${px(py)};transform:translate(-50%,-50%);display:flex;align-items:center;gap:6px;font:800 40px/1 ${DISP};color:${C.ink};background:${pcol};border:5px solid ${C.ink};border-radius:14px;padding:8px 12px">€<span style="font-size:34px">${dn > .5 ? '↓' : up > .5 ? '↑' : ''}</span></div>`;
    h += chip(gx, base + 46, 'GAS', { fs: 27, bd: 0, bg: 'transparent', k: k0 });
    h += chip(px0, base + 46, 'CENTRALE', { fs: 27, bd: 0, bg: 'transparent', k: k1 });
    h += chip(lx, base + 46, 'LUCE', { fs: 27, bd: 0, bg: 'transparent', k: k2 });
    h += chip(gx + 8, 100, 'troppo caro', { bg: C.rosa, fs: 27, k: pop(t, q.troppo + .1, .3), rot: -3 });
    h += chip(px0 - 6, 96, 'rimborso', { bg: C.giallo, fs: 27, k: pop(t, q.rimborso + .22, .3), rot: 2 });
    h += chip(tx - 6, 262, 'a meno', { bg: C.menta, fs: 27, k: pop(t, q.meno + .1, .3), rot: -2 });
    return h;
  }
  function card(y, on, bg, icon, titolo, nota, notaBg, k, pulse) {
    if (k <= .001) return '';
    const kn = pop(on, 0, 1, 1.8);                       // on: 0..1, quanto è "acceso" il cartellino
    return `<div style="position:absolute;left:40px;top:${y}px;width:${MW - 80}px;height:110px;box-sizing:border-box;transform:scale(${(k * (1 + .04 * E.bump(on))).toFixed(3)});display:flex;align-items:center;gap:20px;padding:0 22px;background:${on > .5 ? bg : '#F1F3F7'};border:7px solid ${C.ink};border-radius:26px;box-shadow:0 8px 0 ${C.ink}">` +
      `<div style="flex:none;width:66px;height:66px;border-radius:50%;background:#fff;border:6px solid ${C.ink};display:flex;align-items:center;justify-content:center;font:800 44px/1 ${DISP}">${on > .5 ? icon : '?'}</div>` +
      `<div style="flex:1;font:800 48px/1 ${DISP};letter-spacing:-.025em;white-space:nowrap">${titolo}</div>` +
      (on > .02 ? `<div style="flex:none;transform:scale(${(kn * (1 + .1 * (pulse || 0))).toFixed(3)});font:700 28px/1 ${MONO};background:${notaBg};border:5px solid ${C.ink};border-radius:12px;padding:10px 14px;white-space:nowrap">${nota}</div>` : '') + `</div>`;
  }
  function slPerTe(t) {
    const q = T.q; let h = tab('PER CHI VALE', t, q.s4 - .02);
    const ck = `<svg width="40" height="40" viewBox="0 0 46 46"><path d="M9 24 L19 34 L37 13" fill="none" ${ST(8)}/></svg>`;
    const eq = `<svg width="40" height="40" viewBox="0 0 46 46"><path d="M9 16 H37 M9 30 H37" fill="none" ${ST(8)}/></svg>`;
    const kq = pop(t, q.s4 + .12, .3, 1.4);
    h += `<div style="position:absolute;left:40px;top:82px;transform-origin:0 50%;transform:scale(${kq.toFixed(3)});white-space:nowrap;font:800 50px/1 ${DISP};letter-spacing:-.025em;color:${C.ink}">Che contratto hai?</div>`;
    h += card(150, seg(t, q.variabile - .15, q.variabile + .2), C.menta, ck, 'Prezzo variabile', 'sconto', '#fff', pop(t, q.s4 + .3, .32, 1.5), 0);
    h += card(276, seg(t, q.fisso, q.fisso + .35), '#fff', eq, 'Prezzo fisso', 'non cambia', C.grigio, pop(t, q.s4 + .42, .32, 1.5), E.bump(seg(t, q.nulla + .25, q.nulla + .7)));
    return h;
  }
  function slSaluto(t) {
    const q = T.q, V = T.V; let h = '';
    const k = pop(t, q.s5, .34, 1.5), k2 = pop(t, q.seguimi, .3, 1.8);
    h += `<div style="position:absolute;left:50%;top:128px;transform:translate(-50%,-50%) rotate(-3deg) scale(${k.toFixed(3)});white-space:nowrap;font:800 132px/1 ${DISP};letter-spacing:-.04em;color:${C.ink};background:${C.giallo};border:8px solid ${C.ink};border-radius:26px;box-shadow:0 10px 0 ${C.ink};padding:10px 34px 16px">${esc(V.rubrica)}</div>`;
    h += `<div style="position:absolute;left:0;top:246px;width:${MW}px;text-align:center;font:700 40px/1 ${DISP};color:${C.ink};opacity:${E.out(seg(t, q.s5 + .25, q.s5 + .5)).toFixed(2)}">una notizia al giorno</div>`;
    if (k2 > 0) h += `<div style="position:absolute;left:50%;top:346px;transform:translate(-50%,-50%) scale(${k2.toFixed(3)});display:flex;align-items:center;gap:14px;white-space:nowrap;font:700 38px/1 ${MONO};color:${C.giallo};background:${C.ink};border-radius:16px;padding:14px 24px 14px 16px">` +
      `<span style="display:inline-flex;width:44px;height:44px;border-radius:50%;background:${C.giallo};color:${C.ink};align-items:center;justify-content:center;font:800 40px/1 ${DISP}">+</span>Seguimi</div>`;
    return h;
  }

  // ---------- lo studio ----------
  const layer = (inner, dx) => `<div style="position:absolute;left:0;top:0;width:${MW}px;height:${MH}px;transform:translateX(${px(dx)})">${inner}</div>`;
  function schermo(t) {
    const sl = T.slides; let i = 0; while (i < sl.length - 1 && t >= sl[i + 1].t0) i++;
    const D = .36, x = t - sl[i].t0;
    if (i > 0 && x < D) return layer(sl[i - 1].fn(t), -MW * E.inOut(seg(x, 0, D))) + layer(sl[i].fn(t), MW * (1 - E.outBack(seg(x, 0, D), .8)));
    return layer(sl[i].fn(t), 0);
  }
  function mondo(t, uid) {
    const q = T.q; let h = '';
    h += `<div style="position:absolute;left:-400px;top:-400px;width:1880px;height:2720px;background:${C.az}"></div>`;
    h += `<div style="position:absolute;left:${CX - 590}px;top:20px;width:1180px;height:1180px;border-radius:50%;background:${C.azL}"></div>`;
    // schermo appeso: cinghie, ombra, cornice
    const sx = t - q.n17, shake = sx >= 0 && sx < .6 ? 1.3 * ex(-sx * 9) * S(TAU * 3 * sx) : 0;
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
    h += `<div style="position:absolute;left:-60px;top:1500px;width:1200px;text-align:center;transform:rotate(-2deg);white-space:nowrap;font:800 250px/1 ${DISP};letter-spacing:-.05em;color:${C.lillaD};opacity:.6">${esc(T.V.rubrica)}</div>`;
    h += `<svg style="position:absolute;left:776px;top:${DY - 190}px;overflow:visible" width="120" height="200" viewBox="0 0 120 200">` +
      `<path d="M60 196 V120" ${ST(9)} fill="none"/><ellipse cx="60" cy="194" rx="38" ry="10" fill="${C.ink}"/>` +
      `<g transform="rotate(-16 60 120)"><rect x="38" y="36" width="44" height="90" rx="22" fill="${C.mut}" ${ST(7)}/><path d="M38 70 H82 M38 92 H82" ${ST(5)} opacity=".55"/><path d="M48 50 C50 44 56 42 62 42" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".7"/></g></svg>`;
    return h;
  }
  function nastro(t) {
    const V = T.V, fs = 32, cw = fs * .6, chipTxt = V.rubrica + ' · ' + V.data;
    const run = V.nastro.join('   •   ') + '   •   ', loopW = run.length * cw, off = -((t * 92) % loopW);
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
