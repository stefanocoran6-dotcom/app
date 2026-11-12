// FinLearn · arbitro delle sfide dal vivo (modalità Lampo)
// Ogni sfida è una "stanza": un Durable Object di Cloudflare che tiene le domande con le risposte giuste,
// riceve le risposte dei due telefoni, decide chi prende il punto e manda a tutti e due il risultato.
//
// Regole di Lampo
// - Il punto va a chi risponde giusto per primo. Chi sbaglia perde un punto e per quella domanda è fermo; l'altro può ancora rispondere.
// - Il tempo lo misura ogni telefono, da quando la domanda compare sul suo schermo al tocco: così chi ha la rete più lenta non è penalizzato.
//   L'arbitro controlla che il tempo dichiarato sia credibile: non può essere più corto del tempo passato davvero meno il ping di quel telefono.
// - Due risposte giuste a meno di 5 centesimi l'una dall'altra sono un pareggio: un punto a testa.
// Nella stanza restano solo i soprannomi e le risposte della partita; alla fine (o se nessuno entra) si cancella tutto.
//
// Messaggi (JSON) dal telefono: ciao {pid, nome, v} · pronto · risposta {i, c, ms} · pong {s} · rivincita · esco
// Messaggi all'app: benvenuto · stanza · ping · via · domanda · risposto · esito · fine · errore
import DOMANDE from './domande.json';

const VERSIONE = 1;                                     // versione dei messaggi: app e arbitro devono usare la stessa
const ALFABETO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';    // niente I, O, 0, 1: si confondono quando il codice si detta a voce
const CODICE_RE = /^[A-HJ-NP-Z2-9]{6}$/;
const N_DOMANDE = 5;
const SECONDI = { basi: 24, cfa2: 45 };                 // tempo per domanda: metà del ritmo del percorso, come nella sfida simulata
const PARI_MS = 50;                                     // sotto i 5 centesimi di differenza è un pareggio
const MARGINE_MS = 150;                                 // tolleranza sul tempo dichiarato, oltre al ping (la rete non è sempre uguale)
const RTT_BASE = 300, RTT_MAX = 1500;                   // ping supposto quando non è ancora misurato, e il massimo che si accetta
const VIA_MS = 3000, ESITO_MS = 3500, EXTRA_MS = 1500;  // conto alla rovescia, risultato a schermo, margine di rete sulla scadenza
const ATTESA_MAX = 15 * 60e3, FINE_MAX = 5 * 60e3, VITA_MAX = 60 * 60e3;
const MSG_MAX = 600, MSG_SEC = 15, SOCKET_MAX = 6;
const TESTI = {
  nontrovata: 'Questa sfida non esiste più. Fatti mandare un link nuovo.',
  piena: 'In questa sfida ci sono già due giocatori.',
  iniziata: 'Questa sfida è già cominciata.',
  versione: 'Aggiorna FinLearn: chiudi l\'app, riaprila e riprova.',
  scaduta: 'La sfida è scaduta: nessuno è entrato in tempo.',
  finita: 'La sfida è finita.',
  riprova: 'Non sono riuscito a creare la sfida: riprova.',
  formato: 'Messaggio non valido.',
  troppi: 'Troppi messaggi in poco tempo.'
};
const PER_CHIAVE = Object.fromEntries(Object.entries(DOMANDE).map(([c, l]) => [c, new Map(l.map(d => [d.k, d]))]));
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname === '/') return new Response('FinLearn: arbitro delle sfide dal vivo\n', { headers: { 'content-type': 'text/plain; charset=utf-8' } });
    if (url.pathname !== '/stanza') return new Response('Non trovato\n', { status: 404 });
    if ((req.headers.get('Upgrade') || '').toLowerCase() !== 'websocket') return new Response('Serve una connessione WebSocket\n', { status: 426 });
    // si accettano collegamenti solo dalle pagine dell'app (blocca altri siti; non è una password)
    const ammesse = String(env.ORIGINI || '').split(',').map(s => s.trim()).filter(Boolean);
    if (!ammesse.includes(req.headers.get('Origin') || '')) return new Response('Origine non ammessa\n', { status: 403 });
    const nuova = url.searchParams.get('nuova') === '1', corso = String(url.searchParams.get('corso') || 'basi');
    let codice = String(url.searchParams.get('codice') || '').toUpperCase();
    if (nuova) { if (!DOMANDE[corso]) return new Response('Percorso sconosciuto\n', { status: 400 }); codice = nuovoCodice(); }
    else if (!CODICE_RE.test(codice)) return new Response('Codice non valido\n', { status: 400 });
    // le intestazioni interne le scrive solo il Worker: quelle mandate da fuori si buttano
    const h = new Headers(req.headers);
    h.delete('X-Nuova'); h.delete('X-Corso'); h.set('X-Codice', codice);
    if (nuova) { h.set('X-Nuova', '1'); h.set('X-Corso', corso); }
    return env.STANZE.get(env.STANZE.idFromName(codice)).fetch(new Request(req, { headers: h }));
  }
};

export class Stanza {
  constructor(ctx, env) {
    this.ctx = ctx; this.env = env; this.S = null; this.conta = new Map();
    // il battito che l'app manda ogni 20 secondi per tenere viva la connessione: risponde Cloudflare senza svegliare la stanza
    ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair('{"t":"hb"}', '{"t":"hb"}'));
  }
  // la stanza può "andare a dormire" tra un messaggio e l'altro: lo stato sta nel salvataggio, non solo in memoria
  async carica() {
    if (!this.S) {
      this.S = (await this.ctx.storage.get('s')) || null;
      // dopo un riavvio è collegato solo chi ha ancora una connessione aperta
      if (this.S) { const aperte = new Set(this.ctx.getWebSockets().map(w => (w.deserializeAttachment() || {}).pid).filter(Boolean)); this.S.g.forEach(g => { g.via = aperte.has(g.pid); }); }
    }
    return this.S;
  }
  async salva() { if (this.S) await this.ctx.storage.put('s', this.S); }

  async fetch(req) {
    if (this.ctx.getWebSockets().length >= SOCKET_MAX) return new Response('Troppi collegamenti\n', { status: 429 });
    const codice = req.headers.get('X-Codice'), nuova = req.headers.get('X-Nuova') === '1', corso = req.headers.get('X-Corso');
    await this.carica();
    const pair = new WebSocketPair(), client = pair[0], ws = pair[1], now = Date.now();
    const err = nuova ? (this.S ? 'riprova' : null) : (!this.S ? 'nontrovata' : null);
    if (err) {   // connessione rifiutata: si apre solo per dire perché, poi si chiude
      ws.accept(); ws.send(JSON.stringify({ t: 'errore', e: err, m: TESTI[err] })); ws.close(4000, err);
      return new Response(null, { status: 101, webSocket: client });
    }
    this.ctx.acceptWebSocket(ws); ws.serializeAttachment({});
    if (nuova) { this.S = nuovaStanza(codice, corso, now); await this.salva(); await this.pianifica(); }
    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws, raw) {
    if (typeof raw !== 'string' || raw.length > MSG_MAX) return this.caccia(ws, 'formato');
    const att = ws.deserializeAttachment() || {};
    if (!this.limite(att.pid || ws)) return this.caccia(ws, 'troppi');   // conteggio per telefono (o per connessione, prima del ciao)
    let m = null; try { m = JSON.parse(raw); } catch (e) {}
    if (!m || typeof m !== 'object' || typeof m.t !== 'string') return this.caccia(ws, 'formato');
    await this.carica();
    if (!this.S) return this.caccia(ws, 'nontrovata');
    const now = Date.now();
    if (m.t === 'ciao') this.ciao(ws, m, now);
    else {
      const p = att.pid ? this.S.g.findIndex(g => g.pid === att.pid) : -1;
      if (p < 0) return this.caccia(ws, 'formato');
      if (m.t === 'pong') this.pong(p, m, now);
      else if (m.t === 'pronto') this.pronto(p, now);
      else if (m.t === 'risposta') this.risposta(p, m, now);
      else if (m.t === 'rivincita') this.rivincita(p, now);
      else if (m.t === 'esco') this.esco(p, ws, now);
      else return;
    }
    await this.salva(); await this.pianifica();
  }
  async webSocketClose(ws, code, reason) { try { ws.close(code === 1005 ? 1000 : code, reason); } catch (e) {} await this.perso(ws); }
  async webSocketError(ws) { await this.perso(ws); }

  // un telefono si è scollegato (rete, app in secondo piano): resta in partita e può rientrare
  async perso(ws) {
    const pid = (ws.deserializeAttachment() || {}).pid; if (!pid) return;
    await this.carica(); const S = this.S; if (!S) return;
    if (this.ctx.getWebSockets().some(w => w !== ws && (w.deserializeAttachment() || {}).pid === pid)) return;
    const g = S.g.find(x => x.pid === pid); if (!g || !g.via) return;
    g.via = false; this.aggiorna();
    if (S.fase === 'domanda') { const att = this.attivi(); if (att.length && att.every(k => S.r[k])) this.risolvi(Date.now()); }
    await this.salva(); await this.pianifica();
  }

  async alarm() {
    await this.carica(); const S = this.S; if (!S) return;
    const now = Date.now(), tol = 5;
    if (now >= S.creata + VITA_MAX - tol) return this.chiudi('finita');
    if ((S.fase === 'attesa' || S.fase === 'pronti') && now >= S.creata + ATTESA_MAX - tol) return this.chiudi('scaduta');
    if (S.fase === 'fine' && now >= S.fineAt + FINE_MAX - tol) return this.chiudi('finita');
    if (S.fase === 'via' && now >= S.via - tol) this.domanda(0, now);
    else if (S.fase === 'domanda' && ((S.chiudi && now >= S.chiudi - tol) || now >= S.scade - tol)) this.risolvi(now);
    else if (S.fase === 'esito' && now >= S.avanti - tol) { if (S.i + 1 < S.qs.length) this.domanda(S.i + 1, now); else this.finisci(now, null); }
    await this.salva(); await this.pianifica();
  }
  // una sola sveglia per stanza: punta alla prossima scadenza
  async pianifica() {
    const S = this.S; if (!S) return;
    const t = [S.creata + VITA_MAX];
    if (S.fase === 'attesa' || S.fase === 'pronti') t.push(S.creata + ATTESA_MAX);
    if (S.fase === 'via') t.push(S.via);
    if (S.fase === 'domanda') { t.push(S.scade); if (S.chiudi) t.push(S.chiudi); }
    if (S.fase === 'esito') t.push(S.avanti);
    if (S.fase === 'fine') t.push(S.fineAt + FINE_MAX);
    const at = Math.min(...t);
    if ((await this.ctx.storage.getAlarm()) !== at) await this.ctx.storage.setAlarm(at);
  }
  async chiudi(motivo) {
    for (const w of this.ctx.getWebSockets()) this.caccia(w, motivo);
    this.S = null;
    await this.ctx.storage.deleteAlarm(); await this.ctx.storage.deleteAll();
  }

  // ---- la partita ----
  ciao(ws, m, now) {
    const S = this.S, pid = String(m.pid || '');
    if (!/^[A-Za-z0-9_-]{16,48}$/.test(pid)) return this.caccia(ws, 'formato');
    if (m.v !== VERSIONE) return this.caccia(ws, 'versione');
    let p = S.g.findIndex(g => g.pid === pid);
    if (p < 0) {
      if (S.g.length >= 2) return this.caccia(ws, 'piena');
      if (S.fase !== 'attesa') return this.caccia(ws, 'iniziata');
      S.g.push({ pid, nome: pulisciNome(m.nome) || 'Giocatore', pronto: false, punti: 0, rtt: [], via: true, rivincita: false });
      p = S.g.length - 1;
      if (S.g.length === 2) S.fase = 'pronti';
    } else { S.g[p].via = true; const n = pulisciNome(m.nome); if (n) S.g[p].nome = n; }
    // lo stesso telefono che si ricollega: la connessione vecchia si chiude
    for (const w of this.ctx.getWebSockets()) if (w !== ws && (w.deserializeAttachment() || {}).pid === pid) { try { w.close(4001, 'sostituita'); } catch (e) {} }
    ws.serializeAttachment({ pid });
    this.invia(ws, { t: 'benvenuto', codice: S.codice, corso: S.corso, n: N_DOMANDE, secs: SECONDI[S.corso] });
    this.aggiorna();
    this.invia(ws, { t: 'ping', s: now });
    // chi rientra durante la partita ritrova il punto in cui era
    if (S.fase === 'pronti' && S.g.length === 2 && S.g.every(g => g.pronto && g.via)) return this.parti(now);
    if (S.fase === 'via') this.invia(ws, { t: 'via', ms: Math.max(0, S.via - now) });
    if (S.fase === 'domanda' && this.d()) this.invia(ws, this.msgDomanda(now, p));
    if (S.fase === 'esito' && S.esito) this.invia(ws, S.esito);
    if (S.fase === 'fine' && S.fine) this.invia(ws, S.fine);
  }
  pong(p, m, now) {
    const r = now - Number(m.s);
    if (Number.isFinite(r) && r >= 0 && r < 10000) { const a = this.S.g[p].rtt; a.push(r); if (a.length > 6) a.shift(); }
  }
  // il ping più basso misurato: un telefono può rallentare le sue risposte al ping, ma non renderle più veloci della sua rete
  rtt(p) { const a = this.S.g[p].rtt; return a.length ? Math.min(RTT_MAX, Math.min(...a)) : RTT_BASE; }
  pronto(p, now) {
    const S = this.S; if (S.fase !== 'pronti') return;
    S.g[p].pronto = true;
    if (S.g.length === 2 && S.g.every(g => g.pronto && g.via)) this.parti(now); else this.aggiorna();
  }
  parti(now) {
    const S = this.S, tutte = DOMANDE[S.corso].map(d => d.k);
    let libere = tutte.filter(k => !S.usate.includes(k));
    if (libere.length < N_DOMANDE) { S.usate = []; libere = tutte; }
    S.qs = mescola(libere).slice(0, N_DOMANDE); S.usate = S.usate.concat(S.qs).slice(-tutte.length);
    S.g.forEach(g => { g.punti = 0; g.rivincita = false; g.pronto = true; });
    S.storia = []; S.esito = null; S.fine = null; S.i = -1; S.r = [null, null];
    S.fase = 'via'; S.via = now + VIA_MS;
    this.aggiorna();
    this.inviaTutti({ t: 'via', ms: VIA_MS });
    this.inviaTutti({ t: 'ping', s: now });
  }
  d() { return PER_CHIAVE[this.S.corso].get(this.S.qs[this.S.i]); }
  msgDomanda(now, p) {
    const S = this.S, d = this.d(), mia = p != null && S.r[p] ? S.r[p].c : null;
    return { t: 'domanda', i: S.i, n: S.qs.length, q: d.q, o: d.o, l: d.l || 'it', tot: SECONDI[S.corso] * 1000, ms: Math.max(0, S.scade - EXTRA_MS - now), mia,
      altri: S.r.map((x, k) => (x && k !== p ? { p: k, ok: x.ok } : null)).filter(Boolean) };
  }
  domanda(i, now) {
    const S = this.S;
    S.i = i; S.fase = 'domanda'; S.t0 = now; S.scade = now + SECONDI[S.corso] * 1000 + EXTRA_MS; S.chiudi = 0; S.r = [null, null];
    if (!this.d()) { this.risolvi(now); return; }   // domanda sparita dall'elenco (aggiornamento a metà partita): si passa oltre
    this.inviaTutti(this.msgDomanda(now, null));
  }
  risposta(p, m, now) {
    const S = this.S; if (S.fase !== 'domanda' || m.i !== S.i || S.r[p]) return;
    const d = this.d(), c = m.c; if (!d || !Number.isInteger(c) || c < 0 || c >= d.o.length) return;
    // tempo di reazione: quello misurato dal telefono, ma mai meno del tempo passato qui meno il suo ping (e un margine)
    const passato = now - S.t0, minimo = passato - this.rtt(p) - MARGINE_MS;
    let ms = Number(m.ms); if (!Number.isFinite(ms)) ms = passato;
    const eff = Math.round(Math.max(0, Math.min(passato, Math.max(ms, minimo))));
    const ok = c === d.a;
    S.r[p] = { c, ms: eff, ok };
    this.inviaTutti({ t: 'risposto', i: S.i, p, ok });
    const att = this.attivi();
    if (att.every(k => S.r[k])) return this.risolvi(now);
    // la prima risposta giusta chiude la domanda tra poco: si aspettano le risposte ancora in viaggio dagli altri telefoni
    if (ok && !S.chiudi) { const altri = att.filter(k => !S.r[k]); S.chiudi = now + clamp(Math.max(0, ...altri.map(k => this.rtt(k))) + 100, 300, 1200); }
  }
  risolvi(now) {
    const S = this.S, d = this.d(), r = S.r;
    const giusti = [0, 1].filter(k => r[k] && r[k].ok).sort((a, b) => r[a].ms - r[b].ms);
    let punto = null;
    if (giusti.length === 2 && r[giusti[1]].ms - r[giusti[0]].ms < PARI_MS) punto = 'pari';
    else if (giusti.length) punto = giusti[0];
    if (punto === 'pari') giusti.forEach(k => { S.g[k].punti++; });
    else if (punto !== null) S.g[punto].punti++;
    [0, 1].forEach(k => { if (r[k] && !r[k].ok && S.g[k]) S.g[k].punti--; });
    const voce = { i: S.i, a: d ? d.a : null, r: r.map(x => (x ? { c: x.c, ms: x.ms, ok: x.ok } : null)), punto };
    S.storia.push(voce);
    S.esito = Object.assign({ t: 'esito', e: d ? d.e : '', punti: S.g.map(g => g.punti) }, voce);
    S.fase = 'esito'; S.chiudi = 0; S.avanti = now + ESITO_MS;
    this.inviaTutti(S.esito); this.aggiorna();
    this.inviaTutti({ t: 'ping', s: now });
  }
  finisci(now, via) {
    const S = this.S, pt = S.g.map(g => g.punti);
    let vince = pt.length < 2 || pt[0] > pt[1] ? 0 : pt[1] > pt[0] ? 1 : 'pari';
    if (via != null) vince = via === 0 ? 1 : 0;   // chi esce a metà partita la perde
    S.fase = 'fine'; S.fineAt = now; S.g.forEach(g => { g.rivincita = false; g.pronto = false; });
    S.fine = { t: 'fine', punti: pt, vince, uscito: via, storia: S.storia };
    this.inviaTutti(S.fine); this.aggiorna();
  }
  rivincita(p, now) {
    const S = this.S; if (S.fase !== 'fine' || (S.fine && S.fine.uscito != null)) return;
    S.g[p].rivincita = true;
    if (S.g.length === 2 && S.g.every(g => g.rivincita && g.via)) this.parti(now); else this.aggiorna();
  }
  esco(p, ws, now) {
    const S = this.S;
    if (S.fase === 'attesa' || S.fase === 'pronti') {   // prima di cominciare il posto si libera
      S.g.splice(p, 1); S.g.forEach(g => { g.pronto = false; }); S.fase = S.g.length === 2 ? 'pronti' : 'attesa';
    } else {
      S.g[p].via = false;
      if (S.fase === 'via' || S.fase === 'domanda' || S.fase === 'esito') this.finisci(now, p);
    }
    try { ws.serializeAttachment({}); ws.close(1000, 'esco'); } catch (e) {}
    this.aggiorna();
  }

  // ---- invio ----
  attivi() { return this.S.g.map((g, k) => k).filter(k => this.S.g[k].via); }
  giocatori() {
    const out = [];
    for (const w of this.ctx.getWebSockets()) { const a = w.deserializeAttachment() || {}; const p = a.pid ? this.S.g.findIndex(g => g.pid === a.pid) : -1; if (p >= 0) out.push([w, p]); }
    return out;
  }
  stanza(io) {
    const S = this.S;
    return { t: 'stanza', io, fase: S.fase, corso: S.corso, n: N_DOMANDE, i: S.i, g: S.g.map(g => ({ nome: g.nome, pronto: !!g.pronto, punti: g.punti, via: !!g.via, rivincita: !!g.rivincita })) };
  }
  aggiorna() { if (this.S) for (const [w, p] of this.giocatori()) this.invia(w, this.stanza(p)); }
  invia(ws, m) { try { ws.send(JSON.stringify(m)); } catch (e) {} }
  inviaTutti(m) { const s = JSON.stringify(m); for (const [w] of this.giocatori()) { try { w.send(s); } catch (e) {} } }
  caccia(ws, e) { this.invia(ws, { t: 'errore', e, m: TESTI[e] || TESTI.formato }); try { ws.close(4000, e); } catch (x) {} }
  limite(k) {
    const s = Math.floor(Date.now() / 1000), c = this.conta.get(k);
    if (!c || c.s !== s) { if (this.conta.size > 50) this.conta.clear(); this.conta.set(k, { s, n: 1 }); return true; }
    return ++c.n <= MSG_SEC;
  }
}

function nuovaStanza(codice, corso, now) {
  return { v: 1, codice, corso, creata: now, fase: 'attesa', g: [], qs: [], usate: [], i: -1, r: [null, null], t0: 0, scade: 0, chiudi: 0, via: 0, avanti: 0, fineAt: 0, storia: [], esito: null, fine: null };
}
function nuovoCodice() { return Array.from(crypto.getRandomValues(new Uint8Array(6)), x => ALFABETO[x & 31]).join(''); }
function mescola(a) {
  const r = a.slice(), b = crypto.getRandomValues(new Uint32Array(r.length));
  for (let i = r.length - 1; i > 0; i--) { const j = b[i] % (i + 1); [r[i], r[j]] = [r[j], r[i]]; }
  return r;
}
// soprannome: niente caratteri invisibili o di controllo, al massimo 20 caratteri
const INVISIBILI = new RegExp('[' + [[0x00, 0x1f], [0x7f, 0x9f], [0x200b, 0x200f], [0x2028, 0x202e], [0x2060, 0x206f], [0xfeff, 0xfeff]]
  .map(([a, b]) => String.fromCharCode(a) + '-' + String.fromCharCode(b)).join('') + ']', 'g');
function pulisciNome(s) { return String(s || '').replace(INVISIBILI, '').replace(/\s+/g, ' ').trim().slice(0, 20); }
